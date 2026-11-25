// order-flow-mcp — live order flow for AI agents over the Model Context Protocol.
//
//   npx -y order-flow-mcp                      stdio (Claude Code, Codex, Cursor, Claude Desktop…)
//   npx -y order-flow-mcp --http --port 3333   Streamable HTTP at http://localhost:3333/mcp

import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

// Global WebSocket (Node 20 has none) and HTTPS_PROXY support for sockets and fetch.
const { installNetworking } = await import("@/lib/net");
await installNetworking();

// Keep stdout clean for the stdio protocol: anything the SDKs log goes to stderr.
console.log = (...args: unknown[]) => console.error(...args);
console.info = (...args: unknown[]) => console.error(...args);

const { MarketHub } = await import("./market");
const { createServer, VERSION } = await import("./server");

interface Options {
  http: boolean;
  port: number;
  host: string;
  watch: string[];
  idleMinutes: number;
  maxMarkets: number;
  token?: string;
}

function parseArgs(argv: string[]): Options {
  const env = process.env;
  const o: Options = {
    http: env.ORDERFLOW_TRANSPORT === "http",
    port: Number(env.PORT ?? env.ORDERFLOW_PORT ?? 3333),
    host: env.ORDERFLOW_HOST ?? "127.0.0.1",
    watch: (env.ORDERFLOW_WATCH ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    idleMinutes: Number(env.ORDERFLOW_IDLE_MINUTES ?? 30),
    maxMarkets: Number(env.ORDERFLOW_MAX_MARKETS ?? 20),
    token: env.ORDERFLOW_HTTP_TOKEN || undefined,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--http") o.http = true;
    else if (a === "--stdio") o.http = false;
    else if (a === "--port") o.port = Number(next());
    else if (a === "--host") o.host = next();
    else if (a === "--watch") o.watch.push(...next().split(",").map((s) => s.trim()).filter(Boolean));
    else if (a === "--idle-minutes") o.idleMinutes = Number(next());
    else if (a === "--max-markets") o.maxMarkets = Number(next());
    else if (a === "--token") o.token = next();
    else if (a === "--version" || a === "-v") { console.error(VERSION); process.exit(0); }
    else if (a === "--help" || a === "-h") {
      console.error(`order-flow-mcp ${VERSION} — live order flow for AI agents (MCP)

Usage: order-flow-mcp [options]

  --stdio                 Serve over stdio (default)
  --http                  Serve Streamable HTTP at /mcp
  --port <n>              HTTP port (default 3333, env PORT)
  --host <addr>           HTTP bind address (default 127.0.0.1)
  --token <secret>        Require "Authorization: Bearer <secret>" on HTTP (env ORDERFLOW_HTTP_TOKEN)
  --watch BTC,ETH         Start streaming these markets at boot (env ORDERFLOW_WATCH)
  --idle-minutes <n>      Close unwatched markets after n idle minutes (default 30)
  --max-markets <n>       Max concurrent markets (default 20)
`);
      process.exit(0);
    }
  }
  return o;
}

const options = parseArgs(process.argv.slice(2));
const hub = new MarketHub({ idleMs: options.idleMinutes * 60_000, maxMarkets: options.maxMarkets });

for (const symbol of options.watch) {
  try {
    hub.open(symbol).market.pinned = true;
  } catch (error) {
    console.error(`[order-flow-mcp] cannot watch ${symbol}: ${error instanceof Error ? error.message : error}`);
  }
}

function shutdown() {
  hub.dispose();
  setTimeout(() => process.exit(0), 200).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
// Exchange SDKs occasionally reject promises during reconnects; never let that kill the server.
process.on("unhandledRejection", (reason) => console.error("[order-flow-mcp] unhandled rejection:", reason instanceof Error ? reason.message : String(reason).slice(0, 300)));
process.on("uncaughtException", (error) => console.error("[order-flow-mcp] uncaught exception:", error));

if (!options.http) {
  const server = createServer(hub);
  await server.connect(new StdioServerTransport());
  process.stdin.on("close", shutdown);
  console.error(`[order-flow-mcp] ${VERSION} ready on stdio`);
} else {
  const readBody = (req: IncomingMessage) =>
    new Promise<unknown>((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
        if (data.length > 1_000_000) reject(new Error("body too large"));
      });
      req.on("end", () => {
        try { resolve(data ? JSON.parse(data) : undefined); } catch (e) { reject(e); }
      });
      req.on("error", reject);
    });

  const send = (res: ServerResponse, status: number, body: unknown) => {
    res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(body));
  };

  const http = createHttpServer(async (req, res) => {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-headers", "content-type, authorization, mcp-session-id, mcp-protocol-version");
    res.setHeader("access-control-expose-headers", "mcp-session-id");
    if (req.method === "OPTIONS") return void res.writeHead(204).end();
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/health") {
      return send(res, 200, { ok: true, version: VERSION, markets: hub.list().map((m) => m.spec.key) });
    }
    if (url.pathname !== "/mcp") return send(res, 404, { error: "MCP endpoint is /mcp" });
    if (options.token && req.headers.authorization !== `Bearer ${options.token}`) {
      return send(res, 401, { error: "unauthorized" });
    }
    if (req.method !== "POST") {
      // Stateless server: no SSE stream or session to resume.
      return send(res, 405, { jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed" }, id: null });
    }
    try {
      const body = await readBody(req);
      // Stateless: a fresh protocol server per request, all sharing one market hub.
      const server = createServer(hub);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on("close", () => {
        void transport.close();
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (error) {
      if (!res.headersSent) send(res, 500, { jsonrpc: "2.0", error: { code: -32603, message: String(error) }, id: null });
    }
  });
  http.listen(options.port, options.host, () => {
    console.error(`[order-flow-mcp] ${VERSION} listening on http://${options.host}:${options.port}/mcp`);
  });
}
