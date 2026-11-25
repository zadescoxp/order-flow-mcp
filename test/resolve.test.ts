import { describe, expect, it } from "vitest";
import { normalizeSymbol, resolveMarket } from "../src/resolve";

describe("normalizeSymbol", () => {
  it.each([
    ["btc", "BTCUSDT"],
    ["BTC-PERP", "BTCUSDT"],
    ["eth/usdt", "ETHUSDT"],
    ["XBTUSD", "BTCUSDT"],
    ["sol_usdc", "SOLUSDT"],
    ["DOGEUSDT", "DOGEUSDT"],
  ])("%s → %s", (raw, symbol) => {
    expect(normalizeSymbol(raw)).toEqual({ symbol, forex: false });
  });

  it("recognises FX pairs", () => {
    expect(normalizeSymbol("eurusd")).toEqual({ symbol: "EUR/USD", forex: true });
    expect(normalizeSymbol("GBP/USD")).toEqual({ symbol: "GBP/USD", forex: true });
  });
});

describe("resolveMarket", () => {
  it("defaults to every perp venue listing the symbol", () => {
    const spec = resolveMarket("BTC");
    expect(spec.marketType).toBe("perpetual");
    expect(spec.selection).toBe("all-perps");
    expect(spec.venues).toContain("bybit-futures");
    expect(spec.venues.length).toBeGreaterThan(5);
  });

  it("maps exchange brands to the venue for the market type", () => {
    expect(resolveMarket("ETH", "binance").venues).toEqual(["binance-futures"]);
    expect(resolveMarket("ETH", "binance", "spot").venues).toEqual(["binance-spot"]);
    expect(resolveMarket("BTC", "coinbase", "spot").venues).toEqual(["coinbase-spot"]);
    expect(resolveMarket("BTC", "bybit-perp").venues).toEqual(["bybit-futures"]);
  });

  it("rejects venues without the market", () => {
    expect(() => resolveMarket("BTC", "coinbase")).toThrow(/coinbase/);
    expect(() => resolveMarket("NOTACOIN")).toThrow(/catalog/);
  });

  it("keys markets by symbol, type and selection", () => {
    expect(resolveMarket("btc").key).toBe(resolveMarket("BTCUSDT", "all", "perp").key);
    expect(resolveMarket("btc", "okx").key).not.toBe(resolveMarket("btc").key);
  });
});
