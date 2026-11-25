// A live market: the screener's own MarketDataManager + store, running
// headless in Node. One instance per (symbol, market type, venue selection);
// exchange sockets are shared between instances by the adapter pool.

import { MarketDataManager } from "@/lib/managers/marketDataManager";
import { createTerminalStore, type TerminalStore } from "@/lib/store/terminalStore";
import { getCandleOpenTime } from "@/lib/engine/orderFlowEngine";
import type { FootprintCandle, FootprintLevel, Timeframe, Venue, VenueConnection } from "@/lib/types/market";
import { resolveMarket, type MarketSpec } from "./resolve";

/** Candles are built at 1m; larger timeframes are merged from them on demand. */
export const BASE_TIMEFRAME: Timeframe = "1m";
export const TIMEFRAME_MS: Record<Timeframe, number> = {
  "1m": 60_000, "5m": 300_000, "15m": 900_000, "30m": 1_800_000, "1h": 3_600_000, "4h": 14_400_000,
};

export class LiveMarket {
  readonly store = createTerminalStore();
  readonly manager = new MarketDataManager(this.store);
  readonly startedAt = Date.now();
  lastAccess = Date.now();
  pinned = false;
  private disposed = false;

  /** `connect: false` builds the engine without opening exchange sockets (tests). */
  constructor(readonly spec: MarketSpec, connect = true) {
    this.store.setState({
      symbol: spec.symbol,
      venue: spec.selection,
      selectedVenues: spec.venues,
      marketType: spec.marketType,
      timeframe: BASE_TIMEFRAME,
      orderBookMode: spec.venues.length > 1 ? "aggregated" : "single",
    });
    if (connect) this.manager.subscribe(spec.selection, spec.symbol, spec.marketType, BASE_TIMEFRAME, 10, 3, spec.venues);
  }

  get state(): TerminalStore {
    return this.store.getState();
  }

  get ageMs(): number {
    return Date.now() - this.startedAt;
  }

  touch(): this {
    this.lastAccess = Date.now();
    return this;
  }

  /** True once trades and a book have arrived. */
  get ready(): boolean {
    const s = this.state;
    return (s.session?.trades ?? 0) > 0 && s.aggregatedBook !== null;
  }

  connections(): VenueConnection[] {
    const known = this.state.connections;
    return this.spec.venues.map(
      (venue) => known[venue] ?? { venue, status: "connecting", lastHeartbeat: 0, reconnectAttempts: 0 }
    );
  }

  /** True once every venue has delivered data or given up. */
  get settled(): boolean {
    const seen = this.manager.lastDataAt;
    return this.connections().every((c) => seen.has(c.venue) || c.status === "error" || c.status === "offline");
  }

  /**
   * Wait for a new stream to fill in, up to `timeoutMs`: until every venue
   * has delivered data (or failed). Returns whether any data has arrived.
   */
  async waitReady(timeoutMs: number): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    while (!this.disposed && Date.now() < deadline) {
      if (this.ready && this.settled) break;
      const conns = this.connections();
      if (conns.length && conns.every((c) => c.status === "error" || c.status === "offline")) break;
      await new Promise((r) => setTimeout(r, 150));
    }
    // Give the first footprint / OBI flush a moment after the last venue lands.
    if (this.ready) await new Promise((r) => setTimeout(r, 300));
    return this.ready;
  }

  /** Finalized 1m candles plus the live one, oldest first. */
  baseCandles(): FootprintCandle[] {
    const s = this.state;
    return s.currentCandle ? [...s.candles, s.currentCandle] : [...s.candles];
  }

  /** Footprint candles at `timeframe`, merged from 1m candles. */
  candles(timeframe: Timeframe): FootprintCandle[] {
    const base = this.baseCandles();
    if (timeframe === BASE_TIMEFRAME) return base;
    const groups = new Map<number, FootprintCandle[]>();
    for (const candle of base) {
      const open = getCandleOpenTime(candle.openTime, timeframe);
      const list = groups.get(open);
      if (list) list.push(candle);
      else groups.set(open, [candle]);
    }
    return [...groups.entries()].map(([openTime, list]) => mergeCandles(openTime, TIMEFRAME_MS[timeframe], list));
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.manager.disconnect();
  }
}

export function mergeCandles(openTime: number, durationMs: number, list: FootprintCandle[]): FootprintCandle {
  const first = list[0];
  const last = list[list.length - 1];
  const levels = new Map<number, FootprintLevel>();
  const venueVolumes: Partial<Record<Venue, number>> = {};
  let high = -Infinity, low = Infinity, volume = 0, delta = 0, trades = 0;
  for (const c of list) {
    high = Math.max(high, c.high);
    low = Math.min(low, c.low);
    volume += c.volume;
    delta += c.delta;
    trades += c.tradeCount;
    for (const [venue, v] of Object.entries(c.venueVolumes) as [Venue, number][]) venueVolumes[venue] = (venueVolumes[venue] ?? 0) + v;
    for (const [price, l] of c.levels) {
      const m = levels.get(price);
      if (!m) {
        levels.set(price, { ...l });
        continue;
      }
      m.bidVolume += l.bidVolume;
      m.askVolume += l.askVolume;
      m.totalVolume += l.totalVolume;
      m.delta += l.delta;
      m.tradeCount += l.tradeCount;
      m.buyTrades += l.buyTrades;
      m.sellTrades += l.sellTrades;
      m.maxTradeSize = Math.max(m.maxTradeSize, l.maxTradeSize);
    }
  }
  let maxVolumeAtLevel = 0;
  for (const l of levels.values()) maxVolumeAtLevel = Math.max(maxVolumeAtLevel, l.totalVolume);
  return {
    openTime,
    closeTime: openTime + durationMs - 1,
    open: first.open,
    high,
    low,
    close: last.close,
    volume,
    delta,
    cumulativeDelta: last.cumulativeDelta,
    levels,
    sortedPrices: [...levels.keys()].sort((a, b) => a - b),
    tradeCount: trades,
    maxVolumeAtLevel,
    complete: Date.now() > openTime + durationMs,
    vwap: last.vwap,
    vwapStd: last.vwapStd,
    venueVolumes,
  };
}

export interface HubOptions {
  /** Unpinned markets close after this long without a tool call; 0 keeps them streaming. */
  idleMs: number;
  /** Upper bound on concurrently streamed markets. */
  maxMarkets: number;
}

export class MarketHub {
  private markets = new Map<string, LiveMarket>();
  private reaper: ReturnType<typeof setInterval>;

  constructor(readonly options: HubOptions) {
    this.reaper = setInterval(() => this.reap(), 30_000);
    this.reaper.unref?.();
  }

  list(): LiveMarket[] {
    return [...this.markets.values()];
  }

  find(spec: MarketSpec): LiveMarket | undefined {
    return this.markets.get(spec.key);
  }

  /** Get (or start) the live market for a request. */
  open(symbol: string, venue?: string, marketType?: string): { market: LiveMarket; created: boolean } {
    const spec = resolveMarket(symbol, venue, marketType);
    const existing = this.markets.get(spec.key);
    if (existing) return { market: existing.touch(), created: false };
    if (this.markets.size >= this.options.maxMarkets) {
      const evictable = this.list().filter((m) => !m.pinned).sort((a, b) => a.lastAccess - b.lastAccess)[0];
      if (!evictable) {
        throw new Error(`Already streaming ${this.markets.size} pinned markets (max ${this.options.maxMarkets}). Unwatch one first.`);
      }
      this.close(evictable.spec.key);
    }
    const market = new LiveMarket(spec);
    this.markets.set(spec.key, market);
    return { market, created: true };
  }

  close(key: string): boolean {
    const market = this.markets.get(key);
    if (!market) return false;
    market.dispose();
    this.markets.delete(key);
    return true;
  }

  private reap(): void {
    if (!(this.options.idleMs > 0)) return;
    const now = Date.now();
    for (const market of this.list()) {
      if (!market.pinned && now - market.lastAccess > this.options.idleMs) this.close(market.spec.key);
    }
  }

  dispose(): void {
    clearInterval(this.reaper);
    for (const key of [...this.markets.keys()]) this.close(key);
  }
}
