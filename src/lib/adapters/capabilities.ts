import type { MarketType, Venue, VenueSelection } from "@/lib/types/market";
import { venuesWithData } from "@/lib/config/instruments";

const PERP_VENUES: Venue[] = ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "bitget-futures", "deribit", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"];
const SPOT_VENUES: Venue[] = ["binance-spot", "coinbase-spot", "okx-spot", "bybit-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"];

/**
 * True when `venue` has a live market for `symbol`, from measured venue
 * activity (see lib/config/coinListings.ts).
 */
export function venueSupports(venue: Venue, symbol: string, marketType: MarketType): boolean {
  return venuesWithData(symbol, marketType).includes(venue);
}

export function venuesForSelection(selection: VenueSelection, marketType: MarketType, symbol: string): Venue[] {
  const venues = marketType === "perpetual" ? PERP_VENUES : SPOT_VENUES;
  if (selection !== "all-perps" && selection !== "all-spot") return [selection];
  return venues.filter((venue) => venueSupports(venue, symbol, marketType));
}

/** "bybit-futures" → "bybit"; single-market venues map to themselves. */
export function venueBrandOf(venue: Venue): string {
  return venue.replace(/-(futures|spot)$/, "");
}

/** The same exchange's venue in the other crypto market, if it has one. */
export function venueForMarket(venue: Venue, marketType: "perpetual" | "spot"): Venue | undefined {
  const brand = venueBrandOf(venue);
  return (marketType === "perpetual" ? PERP_VENUES : SPOT_VENUES).find((v) => venueBrandOf(v) === brand);
}
