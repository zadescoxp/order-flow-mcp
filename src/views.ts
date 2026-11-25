// Turns a LiveMarket's engine state into compact JSON for agents.
// Tabular data uses { columns, rows } to keep token counts low.

import { computeVolumeProfile, getTickDecimals } from "@/lib/engine/orderFlowEngine";
import { imbalanceOf, stackedRuns } from "@/lib/engine/imbalance";
import {
  resampleBars,
  rollingRealizedVolatility,
  rollingVolumeZScores,
  secondsPerYear,
} from "@/lib/engine/analytics";
import {
  annualizeFunding,
  bucketLiquidations,
  isLiquidationCascade,
  LIQUIDATION_FEED_VENUES,
  OI_REGIME_HINT,
  OI_REGIME_LABEL,
  oiWindowChange,
  summarizeLiquidations,
} from "@/lib/engine/derivatives";
import { venueSummary } from "@/lib/engine/venues";
import type { FlowBar, FootprintCandle, FootprintLevel, Timeframe, Venue } from "@/lib/types/market";
import type { LiveMarket } from "./market";

// ─── number / time formatting ─────────────────────────────────
/** Round to `sig` significant digits; null for non-finite. */
export function sig(x: number | null | undefined, digits = 5): number | null {
  if (x === null || x === undefined || !Number.isFinite(x)) return null;
  if (x === 0) return 0;
  return Number(x.toPrecision(digits));
}
export function fixed(x: number | null | undefined, decimals: number): number | null {
  if (x === null || x === undefined || !Number.isFinite(x)) return null;
  return Number(x.toFixed(decimals));
}
export function iso(ms: number | null | undefined): string | null {
  if (!ms || !Number.isFinite(ms)) return null;
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}
/** Headline dollar amounts as "$1.87B": long raw integers are easy for models to misread. */
export function usd(x: number | null | undefined): string | null {
  if (x === null || x === undefined || !Number.isFinite(x)) return null;
  const a = Math.abs(x), sign = x < 0 ? "-" : "";
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(1)}K`;
  return `${sign}$${a.toFixed(0)}`;
}
const pct = (x: number | null | undefined, decimals = 3) => fixed(x === null || x === undefined ? null : x * 100, decimals);

/** Price formatter with enough decimals for the instrument. */
function pricer(market: LiveMarket) {
  const tick = market.manager.tickSize || 1;
  const decimals = Math.min(10, getTickDecimals(tick) + 1);
  return (p: number | null | undefined) => fixed(p, decimals);
}

// ─── common header ────────────────────────────────────────────
export function header(market: LiveMarket) {
  const s = market.state;
  const age = Math.round(market.ageMs / 1000);
  return {
    market: {
      symbol: market.spec.symbol,
      market_type: market.spec.marketType,
      venue_selection: market.spec.selection,
      venues: market.spec.venues,
    },
    as_of: iso(s.marketClock || Date.now()),
    streaming_since: iso(market.startedAt),
    stream_age_s: age,
    warming_up: !market.ready || age < 60,
    tick_size: market.manager.tickSize,
  };
}

export function connectionsView(market: LiveMarket) {
  const seen = market.manager.lastDataAt;
  return market.connections().map((c) => {
    const at = seen.get(c.venue);
    return {
      venue: c.venue,
      status: c.status,
      ...(c.error && c.status !== "live" ? { error: c.error } : {}),
      last_data_s_ago: at ? fixed((Date.now() - at) / 1000, 1) : null,
    };
  });
}

/**
 * Best bid / ask across venues. Venues quote in different currencies
 * (USDT, USDC, USD), so the summed book can look crossed by a few bps; the
 * reference mid and spread are the median of each venue's own mid and spread.
 */
export function referenceQuote(market: LiveMarket) {
  const books = [...market.manager.getBooks().values()].filter((b) => b.bids[0] && b.asks[0]);
  if (!books.length) return null;
  const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  const mids = books.map((b) => (b.bids[0].price + b.asks[0].price) / 2);
  const spreads = books.map((b) => ((b.asks[0].price - b.bids[0].price) / ((b.asks[0].price + b.bids[0].price) / 2)) * 10_000);
  const agg = market.state.aggregatedBook;
  const crossed = !!agg && agg.bids[0] && agg.asks[0] ? agg.bids[0].price >= agg.asks[0].price : false;
  return {
    mid: median(mids),
    spread_bps: median(spreads),
    best_bid: Math.max(...books.map((b) => b.bids[0].price)),
    best_ask: Math.min(...books.map((b) => b.asks[0].price)),
    crossed,
    venues: books.length,
  };
}

// ─── flow windows ─────────────────────────────────────────────
function allBars(market: LiveMarket): FlowBar[] {
  const s = market.state;
  return s.liveBar ? [...s.flowBars, s.liveBar] : [...s.flowBars];
}

function now(market: LiveMarket): number {
  return market.state.marketClock || Date.now();
}

export function flowWindow(market: LiveMarket, windowMs: number) {
  const bars = allBars(market);
  const since = now(market) - windowMs;
  let volume = 0, buy = 0, sell = 0, trades = 0, notional = 0;
  let first: FlowBar | null = null, last: FlowBar | null = null;
  let high = -Infinity, low = Infinity;
  for (let i = bars.length - 1; i >= 0 && bars[i].time >= since; i--) {
    const b = bars[i];
    if (!last) last = b;
    first = b;
    volume += b.volume;
    buy += b.buyVolume;
    sell += b.sellVolume;
    trades += b.trades;
    notional += b.volume * b.close;
    if (b.trades) {
      high = Math.max(high, b.high);
      low = Math.min(low, b.low);
    }
  }
  if (!first || !last) return null;
  const covered = Math.min(windowMs, (last.time - first.time) + 1000);
  return {
    covered_s: Math.round(covered / 1000),
    volume: sig(volume),
    notional_usd: usd(notional),
    notional_raw: notional,
    buy_volume: sig(buy),
    sell_volume: sig(sell),
    delta: sig(buy - sell),
    buy_pct: volume ? fixed((buy / volume) * 100, 1) : null,
    trades,
    price_change_pct: first.open ? pct((last.close - first.open) / first.open) : null,
    high: Number.isFinite(high) ? high : null,
    low: Number.isFinite(low) ? low : null,
  };
}

/** Drop the raw notional kept for sorting. */
function publicWindow(w: ReturnType<typeof flowWindow>) {
  if (!w) return null;
  const { notional_raw: _raw, ...rest } = w;
  return rest;
}

/** Volume z-score of the latest completed `seconds` bar vs the previous `window` bars. */
function latestVolumeZ(market: LiveMarket, seconds: number, window = 20): number | null {
  const bars = resampleBars(market.state.flowBars, seconds);
  if (bars.length < 5) return null;
  const z = rollingVolumeZScores(bars, window);
  return fixed(z[z.length - 1]?.z ?? null, 2);
}

function realizedVol(market: LiveMarket, seconds: number, window: number): number | null {
  const bars = resampleBars(market.state.flowBars, seconds);
  if (bars.length < 12) return null;
  const rv = rollingRealizedVolatility(bars, window, seconds, secondsPerYear(market.spec.marketType));
  return fixed(rv[rv.length - 1]?.value ?? null, 1);
}

// ─── order book helpers ───────────────────────────────────────
function depthWithin(market: LiveMarket, mid: number, bands: number[]) {
  const sides = market.manager.getDepthSides();
  const out = bands.map((band) => ({ band_pct: band * 100, bid: 0, ask: 0 }));
  for (const side of sides.values()) {
    for (const [price, size] of side.bids as Iterable<[number, number]>) {
      const d = (mid - price) / mid;
      for (let i = 0; i < bands.length; i++) if (d >= 0 && d <= bands[i]) out[i].bid += size;
    }
    for (const [price, size] of side.asks as Iterable<[number, number]>) {
      const d = (price - mid) / mid;
      for (let i = 0; i < bands.length; i++) if (d >= 0 && d <= bands[i]) out[i].ask += size;
    }
  }
  return out.map((b) => ({
    band_pct: b.band_pct,
    bid_size: sig(b.bid),
    ask_size: sig(b.ask),
    bid_usd: usd(b.bid * mid),
    ask_usd: usd(b.ask * mid),
    imbalance: b.bid + b.ask ? fixed((b.bid - b.ask) / (b.bid + b.ask), 3) : null,
  }));
}

// ─── snapshot ─────────────────────────────────────────────────
export function snapshotView(market: LiveMarket) {
  const s = market.state;
  const p = pricer(market);
  const session = s.session;
  const book = s.aggregatedBook;
  const quote = referenceQuote(market);
  const profile = s.volumeProfile;
  const last = session?.last ?? s.ticker?.price ?? null;
  const t = now(market);

  const sigmaFromVwap = session && session.vwapStd > 0 ? (session.last - session.vwap) / session.vwapStd : null;
  const valueLocation = profile && last
    ? last > profile.vah ? "above_value_area" : last < profile.val ? "below_value_area" : "inside_value_area"
    : null;

  const deriv = s.derivatives;
  const oi5 = oiWindowChange(s.oiHistory, 5 * 60_000);
  const liq5 = summarizeLiquidations(s.liquidations, t - 5 * 60_000);
  const big5 = s.bigTrades.filter((b) => b.timestamp >= t - 5 * 60_000);
  const micro = s.microEvents.filter((e) => e.time >= t - 15 * 60_000).slice(-5).reverse();
  const w1 = flowWindow(market, 60_000);
  const w5 = flowWindow(market, 5 * 60_000);
  const w15 = flowWindow(market, 15 * 60_000);
  const volZ1m = latestVolumeZ(market, 60);
  const bandDepth = quote?.mid ? depthWithin(market, quote.mid, [0.001, 0.005, 0.01]) : null;

  const signals: string[] = [];
  if (sigmaFromVwap !== null) {
    if (sigmaFromVwap >= 2) signals.push(`Price is ${sigmaFromVwap.toFixed(1)}σ above session VWAP (stretched).`);
    else if (sigmaFromVwap <= -2) signals.push(`Price is ${Math.abs(sigmaFromVwap).toFixed(1)}σ below session VWAP (stretched).`);
    else signals.push(`Price is ${sigmaFromVwap >= 0 ? "above" : "below"} session VWAP (${sigmaFromVwap.toFixed(2)}σ).`);
  }
  if (valueLocation) signals.push(`Price is ${valueLocation.replace(/_/g, " ")} (VAL ${p(profile!.val)} – VAH ${p(profile!.vah)}, POC ${p(profile!.poc)}).`);
  if (w5 && w5.buy_pct !== null) {
    if (w5.buy_pct >= 60) signals.push(`Aggressive buyers dominate the last 5m (${w5.buy_pct}% of volume).`);
    else if (w5.buy_pct <= 40) signals.push(`Aggressive sellers dominate the last 5m (${(100 - w5.buy_pct).toFixed(1)}% of volume).`);
    const pc = w5.price_change_pct ?? 0;
    if (w5.delta !== null && Math.abs(pc) > 0.05 && Math.sign(pc) !== Math.sign(w5.delta)) {
      signals.push(`Delta divergence over 5m: price ${pc > 0 ? "up" : "down"} ${Math.abs(pc)}% while delta is ${w5.delta > 0 ? "positive" : "negative"}.`);
    }
  }
  if (volZ1m !== null && volZ1m >= 2.5) signals.push(`Volume spike: last 1m volume z-score ${volZ1m}.`);
  if (s.currentOBI >= 0.3) signals.push(`Order book is bid-heavy near the touch (OBI ${s.currentOBI.toFixed(2)}).`);
  else if (s.currentOBI <= -0.3) signals.push(`Order book is ask-heavy near the touch (OBI ${s.currentOBI.toFixed(2)}).`);
  if (oi5 && oi5.regime !== "neutral") signals.push(`OI regime (5m): ${OI_REGIME_LABEL[oi5.regime]} — ${OI_REGIME_HINT[oi5.regime]}`);
  if (deriv?.fundingRate8h !== null && deriv?.fundingRate8h !== undefined && Math.abs(deriv.fundingRate8h) >= 0.0003) {
    signals.push(`Funding is elevated: ${(deriv.fundingRate8h * 100).toFixed(4)}% per 8h (${deriv.fundingRate8h > 0 ? "longs pay shorts" : "shorts pay longs"}).`);
  }
  if (liq5.count) signals.push(`Liquidations last 5m: longs ${usd(liq5.longNotional)}, shorts ${usd(liq5.shortNotional)}.`);
  for (const e of micro.slice(0, 2)) {
    signals.push(`${e.kind === "absorption" ? "Absorption" : "Iceberg"} at ${p(e.price)}: the ${e.side === "bid" ? "bid held against selling" : "offer held against buying"} (${iso(e.time)}).`);
  }

  return {
    ...header(market),
    price: {
      last: p(last),
      mid: p(quote?.mid),
      spread_bps: fixed(quote?.spread_bps, 2),
      ...(quote && quote.venues > 1
        ? {
            highest_bid: p(quote.best_bid),
            lowest_ask: p(quote.best_ask),
            ...(quote.crossed ? { cross_venue_crossed: true } : {}),
          }
        : { best_bid: p(quote?.best_bid), best_ask: p(quote?.best_ask) }),
    },
    session: session
      ? {
          open: p(session.open),
          high: p(session.high),
          low: p(session.low),
          change_pct: session.open ? pct((session.last - session.open) / session.open) : null,
          vwap: p(session.vwap),
          vwap_std: p(session.vwapStd),
          sigma_from_vwap: fixed(sigmaFromVwap, 2),
          volume: sig(session.volume),
          notional_usd: usd(session.notional),
          buy_volume: sig(session.buyVolume),
          sell_volume: sig(session.sellVolume),
          delta: sig(session.buyVolume - session.sellVolume),
          buy_pct: session.volume ? fixed((session.buyVolume / session.volume) * 100, 1) : null,
          trades: session.trades,
          avg_trade: sig(session.volume / Math.max(1, session.trades)),
          max_trade: sig(session.maxTrade),
        }
      : null,
    flow: { last_1m: publicWindow(w1), last_5m: publicWindow(w5), last_15m: publicWindow(w15), volume_z_1m: volZ1m, realized_vol_5m_ann_pct: realizedVol(market, 5, 60) },
    volume_profile: profile ? { poc: p(profile.poc), vah: p(profile.vah), val: p(profile.val), location: valueLocation } : null,
    order_book: book
      ? { obi: fixed(s.currentOBI, 3), obi_note: "obi = (bid−ask)/(bid+ask) size near the touch, within the shallowest venue's displayed depth; depth = all resting size within each band of mid", depth: bandDepth }
      : null,
    derivatives: market.spec.marketType === "perpetual" && deriv
      ? {
          open_interest: sig(deriv.openInterest),
          open_interest_usd: usd(deriv.openInterestValue),
          oi_change_5m_pct: oi5 ? pct(oi5.oiChange) : null,
          oi_regime_5m: oi5 ? oi5.regime : null,
          funding_8h_pct: pct(deriv.fundingRate8h, 5),
          funding_annualized_pct: deriv.fundingRate8h !== null ? fixed(annualizeFunding(deriv.fundingRate8h, 8) * 100, 2) : null,
          next_funding: iso(deriv.nextFundingTime),
          mark: p(deriv.markPrice),
          index: p(deriv.indexPrice),
          basis_bps: fixed(deriv.basisBps, 2),
        }
      : null,
    liquidations_5m: market.spec.marketType === "perpetual"
      ? { long_usd: usd(liq5.longNotional), short_usd: usd(liq5.shortNotional), count: liq5.count }
      : null,
    big_trades_5m: {
      count: big5.length,
      buy_usd: usd(big5.filter((b) => b.side === "buy").reduce((a, b) => a + b.quoteVolume, 0)),
      sell_usd: usd(big5.filter((b) => b.side === "sell").reduce((a, b) => a + b.quoteVolume, 0)),
    },
    recent_micro_events: micro.map((e) => microRow(e, p)),
    signals,
    connections: connectionsView(market),
  };
}


// ─── footprint ────────────────────────────────────────────────
interface Row { price: number; bid: number; ask: number; trades: number }

function groupLevels(candle: FootprintCandle, rowSize: number): Row[] {
  const rows = new Map<number, Row>();
  for (const l of candle.levels.values()) {
    const key = Math.floor(l.price / rowSize + 1e-9) * rowSize;
    const r = rows.get(key) ?? { price: key, bid: 0, ask: 0, trades: 0 };
    r.bid += l.bidVolume;
    r.ask += l.askVolume;
    r.trades += l.tradeCount;
    rows.set(key, r);
  }
  return [...rows.values()].sort((a, b) => b.price - a.price);
}

export interface FootprintOptions {
  timeframe: Timeframe;
  candles: number;
  maxRows: number;
  rowTicks?: number;
  imbalanceRatio: number;
  stackedLevels: number;
  includeRows: boolean;
}

export function footprintView(market: LiveMarket, o: FootprintOptions) {
  const p = pricer(market);
  const tick = market.manager.tickSize || 1;
  const candles = market.candles(o.timeframe).slice(-o.candles);
  const out = candles.map((c) => {
    const span = Math.max(1, Math.round((c.high - c.low) / tick) + 1);
    const ticksPerRow = o.rowTicks ?? Math.max(1, Math.ceil(span / o.maxRows));
    const rowSize = Number((ticksPerRow * tick).toPrecision(10));
    const rows = groupLevels(c, rowSize);
    let poc: Row | null = null;
    for (const r of rows) if (!poc || r.bid + r.ask > poc.bid + poc.ask) poc = r;
    const pseudo = {
      ...c,
      levels: new Map(rows.map((r) => [r.price, { price: r.price, bidVolume: r.bid, askVolume: r.ask } as FootprintLevel])),
      sortedPrices: rows.map((r) => r.price).sort((a, b) => a - b),
    };
    const stacked = stackedRuns(pseudo, o.imbalanceRatio, o.stackedLevels);
    return {
      open_time: iso(c.openTime),
      complete: c.complete,
      open: p(c.open),
      high: p(c.high),
      low: p(c.low),
      close: p(c.close),
      volume: sig(c.volume),
      delta: sig(c.delta),
      delta_pct: c.volume ? fixed((c.delta / c.volume) * 100, 1) : null,
      cvd: sig(c.cumulativeDelta),
      trades: c.tradeCount,
      poc: poc ? p(poc.price) : null,
      vwap: p(c.vwap),
      row_size: rowSize,
      stacked_imbalances: stacked.map((r) => ({ side: r.dir, from: p(r.start), to: p(r.end) })),
      ...(o.includeRows
        ? {
            rows: rows.map((r) => {
              const imb = imbalanceOf({ bidVolume: r.bid, askVolume: r.ask } as FootprintLevel, o.imbalanceRatio);
              return [p(r.price), sig(r.bid, 4), sig(r.ask, 4), sig(r.ask - r.bid, 4), r.trades, imb ?? ""];
            }),
          }
        : {}),
    };
  });
  return {
    ...header(market),
    timeframe: o.timeframe,
    imbalance_ratio: o.imbalanceRatio,
    ...(o.includeRows ? { row_columns: ["price_low", "bid_vol(sells)", "ask_vol(buys)", "delta", "trades", "imbalance"] } : {}),
    note: "Rows run high→low price. bid_vol = volume sold into the bid, ask_vol = volume bought at the ask. 'buy'/'sell' imbalance = one side ≥ ratio× the other at that row.",
    candles: out,
  };
}

// ─── volume profile ───────────────────────────────────────────
export function volumeProfileView(market: LiveMarket, rows: number, valueAreaPct: number) {
  const p = pricer(market);
  const base = market.baseCandles();
  const profile = base.length ? computeVolumeProfile(base, valueAreaPct) : null;
  if (!profile || !profile.levels.length) return { ...header(market), profile: null };
  const tick = market.manager.tickSize || 1;
  const prices = profile.levels.map((l) => l.price);
  const lo = Math.min(...prices), hi = Math.max(...prices);
  const ticksPerRow = Math.max(1, Math.ceil((Math.round((hi - lo) / tick) + 1) / rows));
  const rowSize = Number((ticksPerRow * tick).toPrecision(10));
  const grouped = new Map<number, { vol: number; bid: number; ask: number }>();
  for (const l of profile.levels) {
    const key = Math.floor(l.price / rowSize + 1e-9) * rowSize;
    const g = grouped.get(key) ?? { vol: 0, bid: 0, ask: 0 };
    g.vol += l.totalVolume;
    g.bid += l.bidVolume;
    g.ask += l.askVolume;
    grouped.set(key, g);
  }
  const list = [...grouped.entries()].sort((a, b) => b[0] - a[0]);
  const maxVol = Math.max(...list.map(([, g]) => g.vol));
  const byVol = [...list].sort((a, b) => b[1].vol - a[1].vol);
  return {
    ...header(market),
    value_area_pct: valueAreaPct * 100,
    poc: p(profile.poc),
    vah: p(profile.vah),
    val: p(profile.val),
    total_volume: sig(profile.totalVolume),
    buy_volume: sig(profile.buyVolume),
    sell_volume: sig(profile.sellVolume),
    delta: sig(profile.delta),
    high_volume_nodes: byVol.slice(0, 5).map(([price]) => p(price)),
    row_size: rowSize,
    columns: ["price_low", "volume", "buy_vol", "sell_vol", "delta", "pct_of_max"],
    rows: list.map(([price, g]) => [p(price), sig(g.vol, 4), sig(g.ask, 4), sig(g.bid, 4), sig(g.ask - g.bid, 4), Math.round((g.vol / maxVol) * 100)]),
  };
}

// ─── order book ───────────────────────────────────────────────
function groupBook(levels: { price: number; size: number }[], step: number, side: "bid" | "ask", depth: number) {
  const map = new Map<number, number>();
  for (const l of levels) {
    const key = side === "bid" ? Math.floor(l.price / step + 1e-9) * step : Math.ceil(l.price / step - 1e-9) * step;
    map.set(key, (map.get(key) ?? 0) + l.size);
  }
  return [...map.entries()].sort((a, b) => (side === "bid" ? b[0] - a[0] : a[0] - b[0])).slice(0, depth);
}

export function orderBookView(market: LiveMarket, depth: number, groupTicks: number, perVenue: boolean) {
  const p = pricer(market);
  const book = market.state.aggregatedBook;
  const quote = referenceQuote(market);
  if (!book || !quote) return { ...header(market), order_book: null, connections: connectionsView(market) };
  const mid = quote.mid;
  const tick = market.manager.tickSize || 0;
  const step = groupTicks > 0 && tick > 0 ? Number((tick * groupTicks).toPrecision(10)) : 0;
  const bids = step ? groupBook(book.bids, step, "bid", depth) : book.bids.slice(0, depth).map((l) => [l.price, l.size] as [number, number]);
  const asks = step ? groupBook(book.asks, step, "ask", depth) : book.asks.slice(0, depth).map((l) => [l.price, l.size] as [number, number]);
  const sizes = [...book.bids, ...book.asks].map((l) => l.size).sort((a, b) => a - b);
  const median = sizes[Math.floor(sizes.length / 2)] || 0;
  const walls = [...book.bids.map((l) => ({ ...l, side: "bid" })), ...book.asks.map((l) => ({ ...l, side: "ask" }))]
    .filter((l) => median > 0 && l.size >= median * 5)
    .sort((a, b) => b.size - a.size)
    .slice(0, 8)
    .map((l) => ({ side: l.side, price: p(l.price), size: sig(l.size, 4), usd: usd(l.size * l.price), x_median: fixed(l.size / median, 1), distance_bps: fixed(((l.price - mid) / mid) * 10_000, 1) }));
  let cb = 0, ca = 0;
  const venues = perVenue
    ? [...market.manager.getBooks().values()].map((b) => ({
        venue: b.venue,
        best_bid: p(b.bids[0]?.price),
        best_ask: p(b.asks[0]?.price),
        spread_bps: b.bids[0] && b.asks[0] ? fixed(((b.asks[0].price - b.bids[0].price) / ((b.asks[0].price + b.bids[0].price) / 2)) * 10_000, 2) : null,
        bid_size_top10: sig(b.bids.slice(0, 10).reduce((a, l) => a + l.size, 0), 4),
        ask_size_top10: sig(b.asks.slice(0, 10).reduce((a, l) => a + l.size, 0), 4),
        levels_held: b.bids.length + b.asks.length,
        updated_s_ago: fixed((Date.now() - b.localTimestamp) / 1000, 1),
      }))
    : undefined;
  return {
    ...header(market),
    mid: p(mid),
    spread_bps: fixed(quote.spread_bps, 2),
    ...(quote.crossed
      ? { cross_venue_crossed: true, crossed_note: "Venues quote in USDT, USDC or USD, so the summed book overlaps by a few bps at the touch. mid and spread_bps are medians of each venue's own quote." }
      : {}),
    obi: fixed(market.state.currentOBI, 3),
    group_size: step || "raw",
    columns: ["price", "size", "cumulative_size"],
    bids: bids.map(([price, size]) => [p(price), sig(size, 5), sig((cb += size), 5)]),
    asks: asks.map(([price, size]) => [p(price), sig(size, 5), sig((ca += size), 5)]),
    depth_bands: depthWithin(market, mid, [0.001, 0.0025, 0.005, 0.01, 0.02]),
    walls,
    ...(venues ? { venues } : {}),
    note: "Sizes are base-asset units summed across the venue selection. walls = single price levels ≥5× the median level size.",
  };
}

// ─── tape ─────────────────────────────────────────────────────
export function tradesView(market: LiveMarket, limit: number, minNotional: number, side?: "buy" | "sell", venue?: Venue) {
  const p = pricer(market);
  const tape = market.manager.getTapeLog();
  const rows: unknown[] = [];
  for (const t of tape) {
    if (rows.length >= limit) break;
    if (t.quoteVolume < minNotional) continue;
    if (side && t.side !== side) continue;
    if (venue && t.venue !== venue) continue;
    rows.push([iso(t.timestamp), t.venue, t.side, p(t.price), sig(t.quantity), sig(t.quoteVolume, 4)]);
  }
  return {
    ...header(market),
    tape_size: tape.length,
    columns: ["time", "venue", "aggressor", "price", "qty", "notional_usd"],
    trades: rows,
    note: "Newest first. aggressor 'buy' = market buy lifting the offer.",
  };
}

export function bigTradesView(market: LiveMarket, limit: number, minRatio: number, windowMinutes: number) {
  const p = pricer(market);
  const since = now(market) - windowMinutes * 60_000;
  const list = market.state.bigTrades.filter((b) => b.ratio >= minRatio && b.timestamp >= since);
  const buy = list.filter((b) => b.side === "buy");
  const sell = list.filter((b) => b.side === "sell");
  const session = market.state.session;
  return {
    ...header(market),
    window_minutes: windowMinutes,
    min_ratio: minRatio,
    average_print: session ? sig(session.volume / Math.max(1, session.trades)) : null,
    summary: {
      count: list.length,
      buy_count: buy.length,
      sell_count: sell.length,
      buy_usd: usd(buy.reduce((a, b) => a + b.quoteVolume, 0)),
      sell_usd: usd(sell.reduce((a, b) => a + b.quoteVolume, 0)),
    },
    columns: ["time", "venue", "aggressor", "price", "qty", "notional_usd", "x_avg_print"],
    trades: list.slice(-limit).reverse().map((b) => [iso(b.timestamp), b.venue, b.side, p(b.price), sig(b.quantity), sig(b.quoteVolume, 4), fixed(b.ratio, 1)]),
    note: "Prints at least min_ratio× the session's average print size (counted after a 50-trade warm-up). Newest first.",
  };
}

// ─── flow series (CVD, z-score, volatility) ───────────────────
export function flowSeriesView(market: LiveMarket, intervalSeconds: number, bars: number, zWindow: number) {
  const p = pricer(market);
  const resampled = resampleBars(allBars(market), intervalSeconds);
  const z = rollingVolumeZScores(resampled, zWindow);
  const rv = rollingRealizedVolatility(resampleBars(market.state.flowBars, 1), 300, 1, secondsPerYear(market.spec.marketType));
  const start = Math.max(0, resampled.length - bars);
  return {
    ...header(market),
    interval_s: intervalSeconds,
    volume_z_window: zWindow,
    realized_vol_5m_ann_pct: fixed(rv[rv.length - 1]?.value ?? null, 1),
    session_cvd: sig(resampled[resampled.length - 1]?.cvd ?? null),
    columns: ["time", "open", "high", "low", "close", "volume", "buy_vol", "sell_vol", "delta", "cvd", "trades", "volume_z"],
    bars: resampled.slice(start).map((b, i) => [
      iso(b.time), p(b.open), p(b.high), p(b.low), p(b.close), sig(b.volume, 4), sig(b.buyVolume, 4), sig(b.sellVolume, 4),
      sig(b.buyVolume - b.sellVolume, 4), sig(b.cvd, 5), b.trades, fixed(z[start + i]?.z ?? null, 2),
    ]),
    note: "Oldest first. cvd = cumulative (buy − sell) volume since streaming began. The last bar may still be forming.",
  };
}

// ─── derivatives ──────────────────────────────────────────────
export function derivativesView(market: LiveMarket, historyMinutes: number) {
  const p = pricer(market);
  const s = market.state;
  if (market.spec.marketType !== "perpetual") {
    return { ...header(market), derivatives: null, note: "Open interest and funding exist for perpetuals only (market_type=perp)." };
  }
  const d = s.derivatives;
  const windows = [1, 5, 15, 60].map((m) => {
    const c = oiWindowChange(s.oiHistory, m * 60_000);
    return c
      ? { window_m: m, oi_change_pct: pct(c.oiChange), oi_change: sig(c.oiDelta), price_change_pct: pct(c.priceChange), regime: c.regime, meaning: OI_REGIME_HINT[c.regime] }
      : { window_m: m, oi_change_pct: null };
  });
  const minute = new Map<number, { oi: number; price: number }>();
  for (const pt of s.oiHistory) minute.set(Math.floor(pt.time / 60_000) * 60_000, { oi: pt.openInterest, price: pt.price });
  const series = [...minute.entries()].slice(-historyMinutes);
  return {
    ...header(market),
    aggregate: d
      ? {
          open_interest: sig(d.openInterest),
          open_interest_usd: usd(d.openInterestValue),
          funding_8h_pct: pct(d.fundingRate8h, 5),
          funding_annualized_pct: d.fundingRate8h !== null ? fixed(annualizeFunding(d.fundingRate8h, 8) * 100, 2) : null,
          next_funding: iso(d.nextFundingTime),
          mark: p(d.markPrice),
          index: p(d.indexPrice),
          basis_bps: fixed(d.basisBps, 2),
        }
      : null,
    oi_changes: windows,
    venues: (d?.venues ?? []).map((v) => ({
      venue: v.venue,
      open_interest: sig(v.openInterest ?? null),
      funding_pct: pct(v.fundingRate ?? null, 5),
      funding_interval_h: v.fundingIntervalHours ?? null,
      next_funding: iso(v.nextFundingTime),
      mark: p(v.markPrice),
      index: p(v.indexPrice),
    })),
    oi_history_columns: ["minute", "open_interest", "price"],
    oi_history: series.map(([t, v]) => [iso(t), sig(v.oi, 6), p(v.price)]),
    note: "OI is in base units, summed over venues that report it; funding and basis are OI-weighted. funding_8h normalizes each venue to an 8h interval.",
  };
}

export function liquidationsView(market: LiveMarket, windowMinutes: number, limit: number) {
  const p = pricer(market);
  const s = market.state;
  const t = now(market);
  if (market.spec.marketType !== "perpetual") {
    return { ...header(market), liquidations: null, note: "Liquidations exist for perpetuals only (market_type=perp)." };
  }
  const summary = summarizeLiquidations(s.liquidations, t - windowMinutes * 60_000);
  const buckets = bucketLiquidations(s.liquidations, 60_000, Math.min(windowMinutes, 240), t);
  const feeds = market.spec.venues.filter((v) => LIQUIDATION_FEED_VENUES.has(v));
  return {
    ...header(market),
    window_minutes: windowMinutes,
    venues_with_liquidation_feed: feeds,
    summary: {
      long_liquidated_usd: usd(summary.longNotional),
      short_liquidated_usd: usd(summary.shortNotional),
      count: summary.count,
      largest: summary.largest ? { time: iso(summary.largest.timestamp), venue: summary.largest.venue, side: summary.largest.side, price: p(summary.largest.price), usd: usd(summary.largest.quoteVolume) } : null,
      cascade_now: isLiquidationCascade(buckets, 5, 100_000),
    },
    per_minute_columns: ["minute", "long_usd", "short_usd", "count"],
    per_minute: buckets.filter((b) => b.count).map((b) => [iso(b.time), sig(b.longNotional, 4), sig(b.shortNotional, 4), b.count]),
    recent_columns: ["time", "venue", "liquidated_side", "price", "qty", "usd"],
    recent: s.liquidations.slice(-limit).reverse().map((l) => [iso(l.timestamp), l.venue, l.side, p(l.price), sig(l.quantity), sig(l.quoteVolume, 4)]),
    note: "liquidated_side 'long' = a long was force-closed (forced sell). Coverage depends on which venues publish a liquidation stream.",
  };
}

// ─── microstructure ───────────────────────────────────────────
function microRow(e: { kind: string; side: string; price: number; time: number; start: number; volume: number; notional: number; ratio: number; venue?: Venue }, p: (x: number) => number | null) {
  return {
    kind: e.kind,
    side: e.side,
    meaning: e.kind === "absorption"
      ? (e.side === "bid" ? "passive bids absorbed aggressive selling (support)" : "passive offers absorbed aggressive buying (resistance)")
      : (e.side === "bid" ? "hidden bid refilled (iceberg buyer)" : "hidden offer refilled (iceberg seller)"),
    price: p(e.price),
    time: iso(e.time),
    duration_s: fixed((e.time - e.start) / 1000, 1),
    volume: sig(e.volume),
    notional_usd: usd(e.notional),
    ratio: fixed(e.ratio, 2),
    ...(e.venue ? { venue: e.venue } : {}),
  };
}

export function microView(market: LiveMarket, kind: "absorption" | "iceberg" | "all", limit: number, windowMinutes: number) {
  const p = pricer(market);
  const since = now(market) - windowMinutes * 60_000;
  const events = market.state.microEvents.filter((e) => e.time >= since && (kind === "all" || e.kind === kind));
  return {
    ...header(market),
    window_minutes: windowMinutes,
    count: events.length,
    events: events.slice(-limit).reverse().map((e) => microRow(e, p)),
    definitions: {
      absorption: "In a 10s window, aggressive volume at one price ≥ an average window's total and ≥50% of that side's flow, while price moved ≤1 tick through the level.",
      iceberg: "On one venue, more than 1.5× the displayed size (and ≥10× the average print) traded at a level that kept refilling.",
    },
  };
}

// ─── venues ───────────────────────────────────────────────────
export function venuesView(market: LiveMarket) {
  const p = pricer(market);
  const s = market.state;
  if (market.spec.venues.length < 2) {
    return { ...header(market), venues: null, note: "Venue comparison needs a multi-venue selection (venue='all')." };
  }
  const summary = venueSummary(s.venueBuckets, now(market));
  return {
    ...header(market),
    window_s: 60,
    leader: summary.leader ? { venue: summary.leader.venue, lead_ms: summary.leader.leadMs, corr: fixed(summary.leader.leadCorr, 2) } : null,
    columns: ["venue", "last", "premium_bps", "volume_60s", "share_pct", "delta_60s", "lead_ms", "lead_corr"],
    venues: summary.stats.map((v) => [v.venue, p(v.last), fixed(v.premiumBps, 2), sig(v.volume, 4), fixed(v.share * 100, 1), sig(v.delta, 4), v.leadMs, fixed(v.leadCorr, 2)]),
    connections: connectionsView(market),
    note: "premium vs the median venue price. lead_ms > 0: that venue's price moves first by that many ms (lagged return correlation over the last 2.5 min).",
  };
}

// ─── resting liquidity heatmap ────────────────────────────────
export function heatmapView(market: LiveMarket, minutes: number, rows: number, columns: number) {
  const p = pricer(market);
  const h = market.manager.depthHistory;
  const t = now(market);
  const from = h.seqAtOrAfter(t - minutes * 60_000);
  const to = h.lastSeq;
  if (to < from || h.size === 0) return { ...header(market), heatmap: null, note: "No depth snapshots yet (sampled once a second once trades and books arrive)." };
  const tick = h.tick;
  const mid = referenceQuote(market)?.mid || market.state.session?.last || 0;
  const band = 0.01; // ±1% of mid
  const lo = mid * (1 - band), hi = mid * (1 + band);
  const ticksPerRow = Math.max(1, Math.ceil((hi - lo) / tick / rows));
  const rowSize = Number((ticksPerRow * tick).toPrecision(10));
  const rowOf = (price: number) => Math.floor(price / rowSize + 1e-9) * rowSize;
  const firstTime = h.get(from)!.time;
  const span = Math.max(1, h.get(to)!.time - firstTime + 1000);
  const colMs = Math.ceil(span / columns / 1000) * 1000;
  const grid = new Map<number, { sum: number[]; n: number[] }>();
  const colCount = Math.ceil(span / colMs);
  const samples = new Array(colCount).fill(0);
  for (let seq = from; seq <= to; seq++) {
    const snap = h.get(seq);
    if (!snap) continue;
    const col = Math.min(colCount - 1, Math.floor((snap.time - firstTime) / colMs));
    samples[col]++;
    for (let i = 0; i < snap.index.length; i++) {
      const price = snap.index[i] * tick;
      if (price < lo || price > hi) continue;
      const r = rowOf(price);
      let cell = grid.get(r);
      if (!cell) { cell = { sum: new Array(colCount).fill(0), n: [] }; grid.set(r, cell); }
      cell.sum[col] += snap.size[i];
    }
  }
  const list = [...grid.entries()].sort((a, b) => b[0] - a[0]).map(([price, cell]) => {
    const avg = cell.sum.map((v, i) => (samples[i] ? v / samples[i] : 0));
    return { price, avg };
  });
  const overall = list.map((r) => ({ price: r.price, mean: r.avg.reduce((a, b) => a + b, 0) / colCount, first: r.avg[0], last: r.avg[colCount - 1] }));
  const sorted = [...overall].sort((a, b) => b.mean - a.mean);
  const median = [...overall].map((r) => r.mean).sort((a, b) => a - b)[Math.floor(overall.length / 2)] || 0;
  const walls = sorted.slice(0, 8).map((r) => ({
    price: p(r.price),
    side: r.price < mid ? "bid" : "ask",
    avg_size: sig(r.mean, 4),
    x_median: median ? fixed(r.mean / median, 1) : null,
    change_pct: r.first > 0 ? fixed(((r.last - r.first) / r.first) * 100, 0) : null,
    trend: r.first > 0 && r.last < r.first * 0.5 ? "pulled" : r.last > r.first * 1.5 ? "added" : "stable",
  }));
  return {
    ...header(market),
    minutes,
    mid: p(mid),
    row_size: rowSize,
    column_s: colMs / 1000,
    column_times: Array.from({ length: colCount }, (_, i) => iso(firstTime + i * colMs)),
    persistent_walls: walls,
    columns: ["price_low", "avg_resting_size_per_column…"],
    rows: list.map((r) => [p(r.price), ...r.avg.map((v) => sig(v, 3))]),
    note: "Average resting order-book size (base units, all selected venues) per price row and time column, within ±1% of mid. trend compares the first and last column.",
  };
}

export { pct };
