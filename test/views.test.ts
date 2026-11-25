// Offline: drives the screener's engine through its replay path with
// synthetic trades and books, then checks the agent-facing views.
import { afterEach, describe, expect, it } from "vitest";
import { LiveMarket, mergeCandles } from "../src/market";
import { resolveMarket } from "../src/resolve";
import { bigTradesView, flowSeriesView, footprintView, orderBookView, snapshotView, tradesView, volumeProfileView } from "../src/views";
import type { NormalizedOrderBook, NormalizedTrade, Venue } from "@/lib/types/market";

const T0 = Date.UTC(2026, 0, 1, 12, 0, 0);
let markets: LiveMarket[] = [];
afterEach(() => { markets.forEach((m) => m.dispose()); markets = []; });

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
  const bids = Array.from({ length: 20 }, (_, i) => ({ price: mid - 5 - i * 10, size: i === 3 ? 50 : 1 }));
  const asks = Array.from({ length: 20 }, (_, i) => ({ price: mid + 5 + i * 10, size: 1 }));
  return { venue: "bybit-futures", symbol: "BTCUSDT", timestamp: at, localTimestamp: at, bids, asks };
}

/** 3 minutes of flow: buyers lift price from 100000 to ~100090. */
function feed(market: LiveMarket) {
  for (let s = 0; s < 180; s++) {
    const at = T0 + s * 1000;
    const price = 100_000 + Math.floor(s / 2);
    market.manager.ingest("b", book(at, price), at);
    market.manager.ingest("t", trade(at, price, 0.1, "buy"), at);
    market.manager.ingest("t", trade(at + 500, price, 0.04, "sell"), at + 500);
    if (s === 100) market.manager.ingest("t", trade(at + 600, price, 5, "buy"), at + 600); // block print
  }
  market.manager.flushNow();
}

describe("views over the real engine", () => {
  it("builds session stats, flow windows and signals", () => {
    const m = offlineMarket();
    feed(m);
    const s = snapshotView(m);
    expect(s.session?.trades).toBe(361);
    expect(s.session?.buy_pct).toBeGreaterThan(70);
    expect(s.price.last).toBe(100_089);
    expect(s.flow.last_1m?.delta).toBeGreaterThan(0);
    expect(s.volume_profile?.poc).toBeGreaterThan(0);
    expect(s.signals.some((x) => x.includes("Aggressive buyers"))).toBe(true);
    expect(s.big_trades_5m.count).toBe(1);
  });

  it("returns footprint candles at 1m and merged 5m", () => {
    const m = offlineMarket();
    feed(m);
    const one = footprintView(m, { timeframe: "1m", candles: 10, maxRows: 12, imbalanceRatio: 3, stackedLevels: 3, includeRows: true });
    expect(one.candles).toHaveLength(3);
    expect(one.candles[0].complete).toBe(true);
    const rows = one.candles[0].rows as unknown[][];
    expect(rows.length).toBeLessThanOrEqual(12);
    // Rows are grouped and run high → low.
    expect(rows[0][0] as number).toBeGreaterThan(rows[rows.length - 1][0] as number);
    const five = footprintView(m, { timeframe: "5m", candles: 10, maxRows: 24, imbalanceRatio: 3, stackedLevels: 3, includeRows: false });
    expect(five.candles).toHaveLength(1);
    expect(five.candles[0].volume).toBeCloseTo(one.candles.reduce((a, c) => a + (c.volume ?? 0), 0), 3);
    expect(five.candles[0].trades).toBe(361);
  });

  it("serves profile, book, tape, big prints and flow series", () => {
    const m = offlineMarket();
    feed(m);
    const vp = volumeProfileView(m, 10, 0.7) as { rows: unknown[]; val: number; poc: number };
    expect(vp.rows.length).toBeLessThanOrEqual(10);
    expect(vp.val).toBeLessThanOrEqual(vp.poc);
    const ob = orderBookView(m, 5, 0, false) as { bids: number[][]; walls: { side: string }[]; spread_bps: number };
    expect(ob.bids).toHaveLength(5);
    expect(ob.walls[0].side).toBe("bid");
    expect(ob.spread_bps).toBeCloseTo(1, 1);
    const tape = tradesView(m, 3, 100_000);
    expect(tape.trades).toHaveLength(1); // only the 5 BTC block clears $100k
    const big = bigTradesView(m, 10, 10, 60 * 24 * 365 * 10);
    expect(big.summary.buy_count).toBe(1);
    const fs = flowSeriesView(m, 60, 10, 20);
    expect(fs.bars.length).toBe(3);
    expect(fs.session_cvd).toBeGreaterThan(0);
  });
});

describe("mergeCandles", () => {
  it("sums levels and keeps OHLC order", () => {
    const m = offlineMarket();
    feed(m);
    const base = m.baseCandles();
    const merged = mergeCandles(base[0].openTime, 180_000, base);
    expect(merged.open).toBe(base[0].open);
    expect(merged.close).toBe(base[base.length - 1].close);
    expect(merged.volume).toBeCloseTo(base.reduce((a, c) => a + c.volume, 0), 9);
    const levelVolume = [...merged.levels.values()].reduce((a, l) => a + l.totalVolume, 0);
    expect(levelVolume).toBeCloseTo(merged.volume, 9);
  });
});

describe("referenceLast", () => {
  it("uses the median of each venue's latest print, not whichever venue printed last", () => {
    const spec = resolveMarket("BTC"); // all perp venues
    const m = new LiveMarket(spec, false);
    markets.push(m);
    m.manager.beginReplay(
      { venue: spec.selection, symbol: spec.symbol, marketType: spec.marketType, timeframe: "1m", imbalanceThreshold: 3, selectedVenues: spec.venues },
      T0
    );
    for (let s = 0; s < 60; s++) {
      const at = T0 + s * 1000;
      m.manager.ingest("t", trade(at, 100_000, 0.1, "buy", "bybit-futures"), at);
      m.manager.ingest("t", trade(at + 100, 100_004, 0.1, "sell", "okx-futures"), at + 100);
      // USD-quoted venue ~5 bps lower, printing last every second
      m.manager.ingest("t", trade(at + 200, 99_950, 0.1, "buy", "deribit"), at + 200);
    }
    m.manager.flushNow();
    const s = snapshotView(m);
    expect(s.price.last).toBe(100_000);
    expect(s.price.last_print).toBe(99_950);
    expect(s.price.last_print_venue).toBe("deribit");
  });
});
