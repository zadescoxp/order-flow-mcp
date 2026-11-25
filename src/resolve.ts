// Normalizes the loose market names agents send ("btc", "ETH-PERP",
// "sol/usdt", "XBTUSD") into the screener's symbol / venue / market type.

import { venueSupports, venuesForSelection } from "@/lib/adapters/capabilities";
import { assetFor, ALL_ASSETS } from "@/lib/config/instruments";
import type { MarketType, Timeframe, Venue, VenueSelection } from "@/lib/types/market";

export const PERP_VENUES: Venue[] = ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "bitget-futures", "deribit", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"];
export const SPOT_VENUES: Venue[] = ["binance-spot", "coinbase-spot", "okx-spot", "bybit-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"];
export const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "30m", "1h", "4h"];

export interface MarketSpec {
  symbol: string; // BTCUSDT
  marketType: MarketType;
  selection: VenueSelection;
  venues: Venue[];
  key: string;
}

export class MarketError extends Error {}

/** "btc", "BTC-PERP", "btc/usdt", "XBTUSD" → "BTCUSDT". */
export function normalizeSymbol(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/[\s_\-/:.]/g, "");
  let base = cleaned.replace(/(PERPETUAL|PERP|SWAP|SPOT)$/, "").replace(/(USDT|USDC|USD)$/, "");
  if (base === "XBT") base = "BTC";
  if (!base) throw new MarketError(`Cannot read a symbol from "${raw}"`);
  return `${base}USDT`;
}

/** Venue aliases: "binance" + perpetual → binance-futures, "all" → every venue listing the market. */
function resolveVenue(raw: string | undefined, marketType: MarketType): VenueSelection {
  const v = (raw ?? "all").trim().toLowerCase();
  if (["all", "aggregate", "aggregated", "all-perps", "all-spot", "*", ""].includes(v)) {
    return marketType === "perpetual" ? "all-perps" : "all-spot";
  }
  const pool = marketType === "perpetual" ? PERP_VENUES : SPOT_VENUES;
  const exact = pool.find((venue) => venue === v);
  if (exact) return exact;
  const brand = v.replace(/[-_ ]?(futures|perp|perps|perpetual|swap|spot)$/, "");
  const match = pool.find((venue) => venue.replace(/-(futures|spot)$/, "") === brand);
  if (match) return match;
  throw new MarketError(`Unknown ${marketType} venue "${raw}". Use one of: all, ${pool.join(", ")}`);
}

export function resolveMarket(rawSymbol: string, rawVenue?: string, rawMarketType?: string): MarketSpec {
  const symbol = normalizeSymbol(rawSymbol);
  const marketType: MarketType = (rawMarketType ?? "").toLowerCase() === "spot" ? "spot" : "perpetual";
  if (!assetFor(symbol)) {
    throw new MarketError(`${symbol} is not in the instrument catalog. Call list_markets to see the ${ALL_ASSETS.length} supported assets.`);
  }
  const selection = resolveVenue(rawVenue, marketType);
  const venues = venuesForSelection(selection, marketType, symbol);
  if (!venues.length || venues.some((venue) => !venueSupports(venue, symbol, marketType))) {
    const listed = venuesForSelection(marketType === "perpetual" ? "all-perps" : "all-spot", marketType, symbol);
    throw new MarketError(
      `${selection} has no ${marketType} market for ${symbol}.` + (listed.length ? ` Venues that do: ${listed.join(", ")}` : ` No venue lists a ${marketType} market for it.`)
    );
  }
  return { symbol, marketType, selection, venues, key: `${symbol}|${marketType}|${selection}` };
}
