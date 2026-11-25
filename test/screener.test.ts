// Offline: the live screener rows, its HTTP/SSE endpoints and wait_for's
// conditions, driven through the engine's replay path.
import { afterEach, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { checkConditions, hasCondition } from "../src/alerts";
import { LiveMarket, MarketHub } from "../src/market";
import { resolveMarket } from "../src/resolve";
import { listenScreener, ScreenerService, screenerRow, screenerUrl, sparkline } from "../src/screener";
import { SCREENER_PAGE } from "../src/screener-page";
import type { NormalizedLiquidation, NormalizedOrderBook, NormalizedTrade, Venue } from "@/lib/types/market";

const T0 = Date.UTC(2026, 0, 1, 12, 0, 0);
let markets: LiveMarket[] = [];
let cleanup: (() => void)[] = [];
afterEach(() => {
  markets.forEach((m) => m.dispose());
  cleanup.forEach((f) => f());
  markets = [];
  cleanup = [];
});

function offlineMarket(): LiveMarket {
  const spec = resolveMarket("BTC", "bybit");
  const market = new LiveMarket(spec, false);
  markets.push(market);
  market.manager.beginReplay(
    { venue: spec.selection, symbol: spec.symbol, marketType: spec.marketType, timeframe: "1m", imbalanceThreshold: 3, selectedVenues: spec.venues },
    T0
  );
  return market;
}

let seq = 0;
function trade(at: number, price: number, quantity: number, side: "buy" | "sell", venue: Venue = "bybit-futures"): NormalizedTrade {
  return { id: `t${++seq}`, venue, symbol: "BTCUSDT", timestamp: at, localTimestamp: at, price, quantity, quoteVolume: price * quantity, side, marketType: "perpetual" };
}
function book(at: number, mid: number): NormalizedOrderBook {
  const bids = Array.from({ length: 20 }, (_, i) => ({ price: mid - 5 - i * 10, size: 1 }));
  const asks = Array.from({ length: 20 }, (_, i) => ({ price: mid + 5 + i * 10, size: 1 }));
  return { venue: "bybit-futures", symbol: "BTCUSDT", timestamp: at, localTimestamp: at, bids, asks };
}
function liquidation(at: number, usd: number, side: "long" | "short" = "long"): NormalizedLiquidation {
  return { id: `l${++seq}`, venue: "bybit-futures", symbol: "BTCUSDT", timestamp: at, localTimestamp: at, price: 100_000, quantity: usd / 100_000, quoteVolume: usd, side };
}

/** `seconds` of flow from `from`, price rising 1 every 2 seconds from `start`. */
function feed(market: LiveMarket, from: number, seconds: number, start = 100_000) {
  for (let s = 0; s < seconds; s++) {
    const at = from + s * 1000;
    const price = start + Math.floor(s / 2);
    market.manager.ingest("b", book(at, price), at);
    market.manager.ingest("t", trade(at, price, 0.1, "buy"), at);
    market.manager.ingest("t", trade(at + 500, price, 0.04, "sell"), at + 500);
  }
  market.manager.flushNow();
}

describe("screener rows", () => {
  it("builds a sparkline from the window start and a change against it", () => {
    const m = offlineMarket();
    feed(m, T0, 180);
    const spark = sparkline(m, 15 * 60_000, 90)!;
    expect(spark.values).toHaveLength(90);
    expect(spark.values[0]).toBeNull(); // the stream is younger than the window
    expect(spark.values[89]).toBe(100_089);
    expect(spark.base).toBe(100_000);

    const row = screenerRow(m, 15 * 60_000);
    expect(row.base).toBe("BTC");
    expect(row.name).toBe("Bitcoin");
    expect(row.market_type).toBe("perp");
    expect(row.last).toBe(100_089);
    expect(row.change).toBe(89);
    expect(row.change_pct).toBeCloseTo(0.089, 3);
    expect(row.buy_pct_5m).toBeGreaterThan(70);
    expect(row.cascade).toBe(false);
  });

  it("session window spans the stream's whole life", () => {
    const m = offlineMarket();
    feed(m, T0, 120);
    const spark = sparkline(m, 0, 30)!;
    expect(spark.values.filter((v) => v !== null).length).toBeGreaterThan(25);
  });
});

describe("wait_for conditions", () => {
  it("needs at least one condition", () => {
    expect(hasCondition({})).toBe(false);
    expect(hasCondition({ liquidation_cascade: true })).toBe(true);
    expect(hasCondition({ price_above: 1 })).toBe(true);
  });

  it("fires price levels and moves as states", () => {
    const m = offlineMarket();
    feed(m, T0, 180);
    const since = m.state.marketClock;
    expect(checkConditions(m, { price_above: 100_050 }, since)?.condition).toBe("price_above");
    expect(checkConditions(m, { price_above: 100_200 }, since)).toBeNull();
    expect(checkConditions(m, { price_below: 100_100 }, since)?.condition).toBe("price_below");
    expect(checkConditions(m, { move_pct: 0.05, move_minutes: 5 }, since)?.condition).toBe("move_pct");
    expect(checkConditions(m, { move_pct: 1 }, since)).toBeNull();
  });

  it("counts big prints only after the wait began", () => {
    const m = offlineMarket();
    feed(m, T0, 60);
    const at = T0 + 60_500;
    m.manager.ingest("t", trade(at, 100_030, 5, "buy"), at); // $500K, before the wait
    m.manager.flushNow();
    const since = m.state.marketClock;
    expect(checkConditions(m, { big_trade_usd: 250_000 }, since)).toBeNull();
    const later = since + 2_000;
    m.manager.ingest("t", trade(later, 100_031, 4, "sell"), later);
    m.manager.flushNow();
    const hit = checkConditions(m, { big_trade_usd: 250_000 }, since);
    expect(hit?.condition).toBe("big_trade_usd");
    expect(hit?.detail).toContain("Sell print");
  });

  it("detects a liquidation cascade and liquidation totals", () => {
    const m = offlineMarket();
    // Ten quiet minutes with ~$20K of liquidations each, then a $2M minute.
    for (let minute = 0; minute < 10; minute++) {
      const at = T0 + minute * 60_000 + 30_000;
      feed(m, T0 + minute * 60_000, 2);
      m.manager.ingest("l", liquidation(at, 20_000), at);
    }
    const quiet = T0 + 10 * 60_000;
    feed(m, quiet, 2);
    expect(checkConditions(m, { liquidation_cascade: true }, quiet)).toBeNull();
    for (let i = 0; i < 4; i++) m.manager.ingest("l", liquidation(quiet + 5_000 + i * 1000, 500_000), quiet + 5_000 + i * 1000);
    feed(m, quiet + 10_000, 2);
    const hit = checkConditions(m, { liquidation_cascade: true }, quiet);
    expect(hit?.condition).toBe("liquidation_cascade");
    expect(screenerRow(m, 60 * 60_000).cascade).toBe(true);
    expect(checkConditions(m, { liquidations_usd: 1_000_000, liquidations_minutes: 5 }, quiet)?.condition).toBe("liquidations_usd");
  });
});

describe("screener HTTP", () => {
  async function serve(token?: string): Promise<{ base: string; market: LiveMarket }> {
    const hub = new MarketHub({ idleMs: 0, maxMarkets: 5 });
    const m = offlineMarket();
    feed(m, T0, 90);
    (hub as unknown as { markets: Map<string, LiveMarket> }).markets.set(m.spec.key, m);
    const service = new ScreenerService(hub, token);
    const { url, server } = await listenScreener(service, "127.0.0.1", 0);
    cleanup.push(() => { service.close(); (server as Server).closeAllConnections(); (server as Server).close(); });
    return { base: url.replace(/\/screener$/, ""), market: m };
  }

  it("serves the page, a JSON snapshot and an event stream", async () => {
    const { base, market } = await serve();
    const page = await fetch(`${base}/screener`);
    expect(page.headers.get("content-type")).toContain("text/html");
    expect(await page.text()).toBe(SCREENER_PAGE);

    const snap = await (await fetch(`${base}/screener/data.json?window=15m`)).json();
    expect(snap.window).toBe("15m");
    expect(snap.rows[0].key).toBe(market.spec.key);
    expect(snap.rows[0].spark.length).toBe(90);

    const controller = new AbortController();
    const res = await fetch(`${base}/screener/stream?window=1h`, { signal: controller.signal });
    expect(res.headers.get("content-type")).toBe("text/event-stream");
    const reader = res.body!.getReader();
    let text = "";
    while (!text.includes("event: full")) text += new TextDecoder().decode((await reader.read()).value);
    controller.abort();
    const data = JSON.parse(text.split("event: full\ndata: ")[1].split("\n")[0]);
    expect(data.rows[0].last).toBe(100_044);
  });

  it("requires the token when one is set", async () => {
    const { base } = await serve("s3cret");
    expect((await fetch(`${base}/screener`)).status).toBe(401);
    expect((await fetch(`${base}/screener?token=s3cret`)).status).toBe(200);
  });

  it("formats URLs for wildcard binds and tokens", () => {
    expect(screenerUrl("0.0.0.0", 3333)).toBe("http://localhost:3333/screener");
    expect(screenerUrl("127.0.0.1", 3334, "a b")).toBe("http://127.0.0.1:3334/screener?token=a%20b");
  });
});
