// Live screener page: a watchlist of every streaming market that updates as
// trades arrive. Served at /screener by the HTTP transport, or by its own
// small HTTP server when the MCP server runs over stdio. Data is pushed with
// Server-Sent Events: price ticks 4× a second, full rows once a second.

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { spawn } from "node:child_process";
import { assetFor } from "@/lib/config/instruments";
import { getTickDecimals } from "@/lib/engine/orderFlowEngine";
import { summarizeLiquidations } from "@/lib/engine/derivatives";
import type { LiveMarket, MarketHub } from "./market";
import { SCREENER_PAGE } from "./screener-page";
import { cascadeNow, fixed, referenceLast, scanRow, sig } from "./views";

export const SCREENER_WINDOWS = { "15m": 15 * 60_000, "1h": 60 * 60_000, "4h": 4 * 60 * 60_000, session: 0 } as const;
export type ScreenerWindow = keyof typeof SCREENER_WINDOWS;

const TICK_MS = 250;
const FULL_MS = 1000;
const SPARK_POINTS = 90;

/** Cheap live price: median of each venue's latest print among the store's newest 500. */
function livePrice(market: LiveMarket): number | null {
  return referenceLast(market, market.state.recentTrades)?.price ?? null;
}

/**
 * Close prices over the window in `points` equal buckets (empty buckets carry
 * the previous close), plus the price the window opened at. Uses 1-second
 * flow bars when they cover the window, 1-minute candles otherwise.
 */
export function sparkline(market: LiveMarket, windowMs: number, points = SPARK_POINTS): { base: number; values: (number | null)[] } | null {
  const s = market.state;
  const end = s.marketClock || Date.now();
  const span = windowMs > 0 ? windowMs : Math.max(60_000, end - market.startedAt);
  const start = end - span;
  const bars = s.liveBar ? [...s.flowBars, s.liveBar] : s.flowBars;
  const candles = market.baseCandles();
  // 1s bars unless they start later than the 1m candles do (windows longer than their 2h history).
  const useBars = bars.length > 0 && (bars[0].time <= start + 1000 || !candles.length || candles[0].openTime >= bars[0].time - 60_000);
  const series: { time: number; open: number; close: number }[] = useBars
    ? bars.filter((b) => b.time >= start && b.trades > 0)
    : candles.filter((c) => c.closeTime >= start).map((c) => ({ time: c.openTime, open: c.open, close: c.close }));
  if (!series.length) return null;
  const step = span / points;
  const values: (number | null)[] = []; // null before the stream's first trade
  let i = 0;
  let last: number | null = null;
  for (let k = 0; k < points; k++) {
    const bucketEnd = start + (k + 1) * step;
    while (i < series.length && series[i].time < bucketEnd) last = series[i++].close;
    values.push(last);
  }
  return { base: series[0].open, values };
}

export function screenerRow(market: LiveMarket, windowMs: number) {
  const s = market.state;
  const last = livePrice(market);
  const spark = sparkline(market, windowMs);
  const scan = scanRow(market, last ?? undefined);
  const t = s.marketClock || Date.now();
  const liq = summarizeLiquidations(s.liquidations, t - 5 * 60_000);
  const base = market.spec.symbol.replace(/USDT$/, "");
  const asset = assetFor(market.spec.symbol);
  const decimals = Math.min(8, getTickDecimals(market.manager.tickSize || 0.01));
  const baseline = spark?.base ?? null;
  return {
    key: market.spec.key,
    base,
    name: asset?.name ?? base,
    color: asset?.color ?? "#888",
    market_type: market.spec.marketType === "perpetual" ? "perp" : "spot",
    venue: market.spec.selection,
    decimals,
    ready: market.ready,
    stream_age_s: scan.stream_age_s,
    last: sig(last, 10),
    baseline: sig(baseline, 10),
    change: last !== null && baseline !== null ? last - baseline : null,
    change_pct: last !== null && baseline ? fixed(((last - baseline) / baseline) * 100, 3) : null,
    spark: spark?.values.map((v) => (v === null ? null : sig(v, 10))) ?? [],
    delta_5m: scan.delta_5m,
    buy_pct_5m: scan.buy_pct_5m,
    notional_5m_usd: scan.notional_5m_usd,
    volume_z_1m: scan.volume_z_1m,
    sigma_from_vwap: scan.sigma_from_vwap,
    obi: scan.obi,
    funding_8h_pct: scan.funding_8h_pct,
    oi_change_5m_pct: scan.oi_change_5m_pct,
    liq_long_5m_usd: Math.round(liq.longNotional),
    liq_short_5m_usd: Math.round(liq.shortNotional),
    cascade: cascadeNow(market),
    big_prints_5m: scan.big_prints_5m,
    live_venues: scan.live_venues,
  };
}

/** Notable recent events across markets, newest first: big prints ≥ $50K, absorption, icebergs, liquidations ≥ $100K. */
export function screenerEvents(markets: LiveMarket[], limit = 14, windowMs = 15 * 60_000) {
  const out: { time: number; base: string; kind: string; side: string; text: string; usd: number }[] = [];
  for (const m of markets) {
    const s = m.state;
    const since = (s.marketClock || Date.now()) - windowMs;
    const base = m.spec.symbol.replace(/USDT$/, "");
    for (const b of s.bigTrades.slice(-20)) {
      if (b.timestamp >= since && b.quoteVolume >= 50_000) out.push({ time: b.timestamp, base, kind: "big", side: b.side, text: `${b.side === "buy" ? "Buy" : "Sell"} print ${fixed(b.ratio, 0)}× avg`, usd: b.quoteVolume });
    }
    for (const e of s.microEvents.slice(-10)) {
      if (e.time >= since) out.push({ time: e.time, base, kind: e.kind, side: e.side === "bid" ? "buy" : "sell", text: e.kind === "absorption" ? (e.side === "bid" ? "Bids absorbing sellers" : "Offers absorbing buyers") : (e.side === "bid" ? "Iceberg bid" : "Iceberg offer"), usd: e.notional });
    }
    for (const l of s.liquidations.slice(-50)) {
      if (l.timestamp >= since && l.quoteVolume >= 100_000) out.push({ time: l.timestamp, base, kind: "liq", side: l.side === "long" ? "sell" : "buy", text: `${l.side === "long" ? "Long" : "Short"} liquidated`, usd: l.quoteVolume });
    }
  }
  return out.sort((a, b) => b.time - a.time).slice(0, limit);
}

export function screenerSnapshot(hub: MarketHub, window: ScreenerWindow) {
  const markets = hub.list();
  return {
    as_of: Date.now(),
    window,
    rows: markets.map((m) => screenerRow(m, SCREENER_WINDOWS[window])),
    events: screenerEvents(markets),
  };
}

// ─── HTTP ─────────────────────────────────────────────────────
interface Client {
  res: ServerResponse;
  window: ScreenerWindow;
  prices: Map<string, number | null>;
}

/** Serves the page and its event stream; timers run only while a page is open. */
export class ScreenerService {
  private clients = new Set<Client>();
  private tickTimer: ReturnType<typeof setInterval> | null = null;
  private fullTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly hub: MarketHub, private readonly token?: string) {}

  /** Handles /screener, /screener/stream and /screener/data.json; returns false for other paths. */
  handle(req: IncomingMessage, res: ServerResponse): boolean {
    const url = new URL(req.url ?? "/", "http://localhost");
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (path !== "/screener" && !path.startsWith("/screener/")) return false;
    if (this.token && url.searchParams.get("token") !== this.token && req.headers.authorization !== `Bearer ${this.token}`) {
      res.writeHead(401, { "content-type": "text/plain" }).end("unauthorized: open the screener link with ?token=<token>");
      return true;
    }
    if (req.method !== "GET") {
      res.writeHead(405, { "content-type": "text/plain" }).end("GET only");
      return true;
    }
    const window = (url.searchParams.get("window") ?? "1h") as ScreenerWindow;
    const win: ScreenerWindow = window in SCREENER_WINDOWS ? window : "1h";
    if (path === "/screener") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(SCREENER_PAGE);
    } else if (path === "/screener/data.json") {
      res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(screenerSnapshot(this.hub, win)));
    } else if (path === "/screener/stream") {
      this.attach(res, win);
    } else {
      res.writeHead(404, { "content-type": "text/plain" }).end("not found");
    }
    return true;
  }

  private attach(res: ServerResponse, window: ScreenerWindow): void {
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-store",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    });
    res.write("retry: 2000\n\n");
    const client: Client = { res, window, prices: new Map() };
    this.clients.add(client);
    res.on("close", () => {
      this.clients.delete(client);
      if (!this.clients.size) this.stop();
    });
    this.sendFull([client]);
    this.start();
  }

  private start(): void {
    if (this.tickTimer) return;
    this.tickTimer = setInterval(() => this.sendTicks(), TICK_MS);
    this.fullTimer = setInterval(() => this.sendFull([...this.clients]), FULL_MS);
    this.tickTimer.unref?.();
    this.fullTimer.unref?.();
  }

  private stop(): void {
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.fullTimer) clearInterval(this.fullTimer);
    this.tickTimer = this.fullTimer = null;
  }

  private sendFull(clients: Client[]): void {
    const byWindow = new Map<ScreenerWindow, string>();
    for (const client of clients) {
      let payload = byWindow.get(client.window);
      if (!payload) {
        const snap = screenerSnapshot(this.hub, client.window);
        for (const row of snap.rows) client.prices.set(row.key, row.last);
        payload = `event: full\ndata: ${JSON.stringify(snap)}\n\n`;
        byWindow.set(client.window, payload);
      }
      client.res.write(payload);
    }
  }

  private sendTicks(): void {
    const prices = new Map<string, number | null>();
    for (const m of this.hub.list()) prices.set(m.spec.key, sig(livePrice(m), 10));
    for (const client of this.clients) {
      const changed: Record<string, number> = {};
      let any = false;
      for (const [key, price] of prices) {
        if (price !== null && client.prices.get(key) !== price) {
          changed[key] = price;
          client.prices.set(key, price);
          any = true;
        }
      }
      if (any) client.res.write(`event: tick\ndata: ${JSON.stringify({ t: Date.now(), p: changed })}\n\n`);
    }
  }

  close(): void {
    this.stop();
    for (const client of this.clients) client.res.end();
    this.clients.clear();
  }
}

/**
 * The screener's own HTTP server for stdio mode. Tries `port` and the next 9
 * ports, so several MCP servers on one machine (one per agent session) can
 * each run a screener. Resolves to the page URL.
 */
export function listenScreener(service: ScreenerService, host: string, port: number): Promise<{ url: string; server: Server }> {
  return new Promise((resolve, reject) => {
    let attempt = 0;
    const tryPort = () => {
      const server = createServer((req, res) => {
        if (!service.handle(req, res)) {
          res.writeHead(302, { location: "/screener" }).end();
        }
      });
      server.once("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE" && attempt < 9) {
          attempt++;
          tryPort();
        } else reject(error);
      });
      server.listen(port === 0 ? 0 : port + attempt, host, () => {
        server.unref();
        const bound = server.address();
        resolve({ url: screenerUrl(host, typeof bound === "object" && bound ? bound.port : port + attempt), server });
      });
    };
    tryPort();
  });
}

export function screenerUrl(host: string, port: number, token?: string): string {
  const shown = host === "0.0.0.0" || host === "::" ? "localhost" : host.includes(":") ? `[${host}]` : host;
  return `http://${shown}:${port}/screener${token ? `?token=${encodeURIComponent(token)}` : ""}`;
}

/** Best effort: open `url` in the default browser of the machine running the server. */
export function openInBrowser(url: string): boolean {
  // A headless Linux box (a server, a container) has nowhere to show it.
  if (process.platform === "linux" && !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) return false;
  try {
    const [cmd, args] = process.platform === "darwin" ? ["open", [url]]
      : process.platform === "win32" ? ["cmd", ["/c", "start", "", url]]
      : ["xdg-open", [url]];
    const child = spawn(cmd, args as string[], { detached: true, stdio: "ignore" });
    child.on("error", () => {});
    child.unref();
    return true;
  } catch {
    return false;
  }
}
