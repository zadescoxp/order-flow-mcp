// Conditions for wait_for: an agent blocks on a market until something
// happens instead of polling. State conditions (price level, move, cascade,
// liquidation total) fire as soon as they are true, including at the start;
// event conditions (a big print, absorption, iceberg) need a new event after
// the wait began.

import { summarizeLiquidations } from "@/lib/engine/derivatives";
import type { LiveMarket } from "./market";
import { cascadeNow, fixed, flowWindow, iso, referenceLast, sig, usd } from "./views";

export interface WaitConditions {
  price_above?: number;
  price_below?: number;
  move_pct?: number;
  move_minutes?: number;
  liquidation_cascade?: boolean;
  liquidations_usd?: number;
  liquidations_minutes?: number;
  big_trade_usd?: number;
  absorption?: boolean;
  iceberg?: boolean;
}

export interface Hit {
  condition: keyof WaitConditions;
  detail: string;
  time: string | null;
}

export function hasCondition(c: WaitConditions): boolean {
  return c.price_above !== undefined || c.price_below !== undefined || c.move_pct !== undefined || !!c.liquidation_cascade
    || c.liquidations_usd !== undefined || c.big_trade_usd !== undefined || !!c.absorption || !!c.iceberg;
}

/**
 * The first condition that holds for `market`, or null. `since` is the market
 * time the wait began; event conditions only count events after it.
 */
export function checkConditions(market: LiveMarket, c: WaitConditions, since: number): Hit | null {
  const s = market.state;
  const now = s.marketClock || Date.now();
  const at = iso(now);
  const price = referenceLast(market, s.recentTrades)?.price ?? null;

  if (price !== null && c.price_above !== undefined && price >= c.price_above) {
    return { condition: "price_above", detail: `Price ${sig(price, 8)} is at or above ${c.price_above}.`, time: at };
  }
  if (price !== null && c.price_below !== undefined && price <= c.price_below) {
    return { condition: "price_below", detail: `Price ${sig(price, 8)} is at or below ${c.price_below}.`, time: at };
  }
  if (c.move_pct !== undefined) {
    const minutes = c.move_minutes ?? 5;
    const w = flowWindow(market, minutes * 60_000);
    if (w?.price_change_pct !== null && w?.price_change_pct !== undefined && Math.abs(w.price_change_pct) >= c.move_pct) {
      return { condition: "move_pct", detail: `Price moved ${w.price_change_pct > 0 ? "+" : ""}${w.price_change_pct}% over the last ${minutes}m (threshold ±${c.move_pct}%).`, time: at };
    }
  }
  if (c.liquidation_cascade && cascadeNow(market)) {
    const liq = summarizeLiquidations(s.liquidations, now - 60_000);
    return {
      condition: "liquidation_cascade",
      detail: `Liquidation cascade: ${usd(liq.longNotional)} longs and ${usd(liq.shortNotional)} shorts liquidated in the last minute, at least 5× a typical minute over the last 30m.`,
      time: at,
    };
  }
  if (c.liquidations_usd !== undefined) {
    const minutes = c.liquidations_minutes ?? 5;
    const liq = summarizeLiquidations(s.liquidations, now - minutes * 60_000);
    const total = liq.longNotional + liq.shortNotional;
    if (total >= c.liquidations_usd) {
      return { condition: "liquidations_usd", detail: `${usd(total)} liquidated in ${minutes}m (longs ${usd(liq.longNotional)}, shorts ${usd(liq.shortNotional)}).`, time: at };
    }
  }
  if (c.big_trade_usd !== undefined) {
    // recentTrades is newest first; wait_for polls often enough that 500 prints span the gap.
    for (const t of s.recentTrades) {
      if (t.timestamp <= since) break;
      if (t.quoteVolume >= c.big_trade_usd) {
        return { condition: "big_trade_usd", detail: `${t.side === "buy" ? "Buy" : "Sell"} print of ${usd(t.quoteVolume)} at ${sig(t.price, 8)} on ${t.venue}.`, time: iso(t.timestamp) };
      }
    }
  }
  if (c.absorption || c.iceberg) {
    for (let i = s.microEvents.length - 1; i >= 0; i--) {
      const e = s.microEvents[i];
      if (e.time <= since) break;
      if ((e.kind === "absorption" && c.absorption) || (e.kind === "iceberg" && c.iceberg)) {
        const what = e.kind === "absorption"
          ? (e.side === "bid" ? "Bids absorbed aggressive selling" : "Offers absorbed aggressive buying")
          : (e.side === "bid" ? "Iceberg bid refilled" : "Iceberg offer refilled");
        return { condition: e.kind, detail: `${what} at ${sig(e.price, 8)} (${usd(e.notional)}, ratio ${fixed(e.ratio, 1)}).`, time: iso(e.time) };
      }
    }
  }
  return null;
}
