// The terminal screener's pure parts: argument parsing, sparklines and frame layout.
import { describe, expect, it } from "vitest";
import { DEFAULT_TUI_SYMBOLS, parseTuiArgs, renderFrame, spark, type ViewState } from "../src/tui";

type Snap = Parameters<typeof renderFrame>[0];

const strip = (s: string) => s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "");

function row(over: Record<string, unknown> = {}) {
  return {
    key: "BTCUSDT|perpetual|all-perps", base: "BTC", name: "Bitcoin", color: "#F7931A", market_type: "perp", venue: "all-perps",
    decimals: 1, ready: true, stream_age_s: 600, last: 58_446.5, baseline: 58_000, change: 446.5, change_pct: 0.77,
    spark: [58_000, 58_100, null, 58_300, 58_446.5], delta_5m: -209, buy_pct_5m: 47, notional_5m_usd: 179_500_000, volume_z_1m: 1.2,
    sigma_from_vwap: -1.1, obi: -0.58, funding_8h_pct: 0.0046, oi_change_5m_pct: -0.07, liq_long_5m_usd: 175, liq_short_5m_usd: 33_000,
    cascade: false, big_prints_5m: 12, live_venues: "10/10", ...over,
  };
}
const view = (): ViewState => ({ window: "15m", sort: "watchlist", flashes: new Map(), source: "· ALL VENUES", status: "" });

describe("tui", () => {
  it("parses symbols and options", () => {
    expect(parseTuiArgs([]).symbols).toEqual(DEFAULT_TUI_SYMBOLS);
    const o = parseTuiArgs(["BTC,eth", "SOL", "--window", "1h", "--venue", "bybit", "--spot"]);
    expect(o).toMatchObject({ symbols: ["BTC", "eth", "SOL"], window: "1h", venue: "bybit", marketType: "spot" });
    expect(parseTuiArgs(["--connect"]).connect).toBe("http://127.0.0.1:3334");
    expect(() => parseTuiArgs(["--window", "2d"])).toThrow(/window/);
  });

  it("draws block sparklines, leaving gaps blank", () => {
    expect(spark([1, 2, 3, 4], 4, null)).toBe("▁▃▆█");
    expect(spark([null, null, 1, 2], 4, null)).toBe("  ▁█");
    expect(spark([], 3, null)).toBe("   ");
  });

  it("renders a frame of exactly the terminal size", () => {
    const snap = ({ as_of: 0, window: "15m" as const, rows: [row(), row({ key: "E", base: "ETH", change: -0.001, change_pct: -0.0001, cascade: true })], events: [{ time: Date.now(), base: "BTC", kind: "big", side: "sell", text: "Sell print 56× avg", usd: 110_000 }] }) as unknown as Snap;
    const lines = renderFrame(snap, view(), 150, 30).split("\n");
    expect(lines).toHaveLength(30);
    const text = lines.map(strip);
    expect(text[0]).toContain("ORDER FLOW");
    expect(text[1]).toContain("LIQUIDATION CASCADE");
    expect(text.find((l) => l.includes("BTC") && l.includes("58,446.5"))).toContain("+0.77%");
    const eth = text.find((l) => l.includes(" ETH "))!;
    expect(eth).toContain("CASCADE");
    expect(eth).not.toContain("-0.00%");
    expect(text.some((l) => l.includes("BLOCK") && l.includes("$110K"))).toBe(true);
    // narrow terminals drop low-priority columns but keep price and change
    const narrow = renderFrame(snap, view(), 70, 20).split("\n").map(strip);
    expect(narrow.find((l) => l.includes("58,446.5"))).toContain("+0.77%");
    expect(narrow[2]).not.toContain("VENUES"); // column header row
  });
});
