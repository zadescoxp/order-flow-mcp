// Live end-to-end check: spawns the built server over stdio, lists tools and
// calls each one against real exchange feeds.
//   node scripts/smoke.mjs [symbol] [venue]
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const symbol = process.argv[2] ?? "BTC";
const venue = process.argv[3] ?? "all";
const client = new Client({ name: "smoke", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: ["dist/index.js"], env: { ...process.env }, stderr: "inherit" }));

const tools = (await client.listTools()).tools.map((t) => t.name);
console.log(`tools (${tools.length}):`, tools.join(", "));

const call = async (name, args = {}) => {
  const t0 = Date.now();
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.[0]?.text ?? "";
  console.log(`\n── ${name} ${JSON.stringify(args)} ${res.isError ? "ERROR" : "ok"} ${Date.now() - t0}ms ${text.length} chars`);
  console.log(text.length > 1800 ? text.slice(0, 1800) + " …" : text);
  return res.isError ? null : JSON.parse(text);
};

const base = { symbol, venue, wait_seconds: 20 };
await call("get_market_snapshot", base);
console.log("\n(waiting 20s for flow to accumulate…)");
await new Promise((r) => setTimeout(r, 20_000));
await call("get_market_snapshot", base);
await call("get_footprint", { ...base, timeframe: "1m", candles: 2, max_rows: 8 });
await call("get_volume_profile", { ...base, rows: 10 });
await call("get_order_book", { ...base, depth: 5, per_venue: true });
await call("get_trades", { ...base, limit: 5 });
await call("get_big_trades", { ...base, min_ratio: 5, limit: 5 });
await call("get_flow_series", { ...base, interval_seconds: 5, bars: 5 });
await call("get_derivatives", { ...base, history_minutes: 3 });
await call("get_liquidations", { ...base, window_minutes: 5, limit: 5 });
await call("get_microstructure_events", { ...base });
await call("get_venue_comparison", { ...base });
await call("get_liquidity_heatmap", { ...base, minutes: 1, rows: 6, columns: 3 });
await call("scan_markets", { symbols: ["BTC", "ETH", "SOL"], venue, wait_seconds: 15 });
await call("list_active_markets");
await call("list_markets", { query: "sol" });
await client.close();
process.exit(0);
