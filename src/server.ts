import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_ASSETS } from "@/lib/config/instruments";
import { oiWindowChange, summarizeLiquidations } from "@/lib/engine/derivatives";
import type { Timeframe, Venue } from "@/lib/types/market";
import { checkConditions, hasCondition, type Hit, type WaitConditions } from "./alerts";
import { MarketHub, type LiveMarket } from "./market";
import { MarketError, PERP_VENUES, resolveMarket, SPOT_VENUES, TIMEFRAMES } from "./resolve";
import {
  bigTradesView,
  connectionsView,
  derivativesView,
  fixed,
  flowSeriesView,
  flowWindow,
  footprintView,
  header,
  heatmapView,
  iso,
  liquidationsView,
  microView,
  orderBookView,
  pct,
  referenceLast,
  scanRow,
  sig,
  sigmaFromVwapOf,
  snapshotView,
  tradesView,
  venuesView,
  volumeProfileView,
} from "./views";

export const VERSION = "0.1.0";

const INSTRUCTIONS = `Live crypto order-flow data streamed from up to 10 exchanges (Binance, Bybit, OKX, Bitget, Hyperliquid, Deribit, Coinbase, Gate, KuCoin, Kraken, HTX), normalized and aggregated.

How to use:
- Start with get_market_snapshot for a symbol (e.g. "BTC", "ETH", "SOL"). It returns price, session VWAP, delta, CVD windows, volume profile levels, order-book imbalance, open interest, funding, liquidations, big prints, absorption/iceberg events and plain-language signals.
- Drill down with get_footprint, get_volume_profile, get_order_book, get_flow_series (CVD / volume z-score), get_derivatives, get_liquidations, get_big_trades, get_trades, get_microstructure_events, get_venue_comparison and get_liquidity_heatmap.
- Use scan_markets to screen several symbols at once.
- To watch for something (a liquidation cascade, a price level, a big print, a sharp move), call wait_for: it blocks until the condition fires or times out, so you react within a fraction of a second without polling. Call it again to keep watching.
- When the user wants to see the market live, call open_screener: it opens a page that updates several times a second with prices, sparklines and order-flow stats for every streaming market.
- Defaults: market_type="perp" and venue="all" (every venue listing the market, aggregated). Pass venue="bybit" etc. for one exchange, market_type="spot" for spot.

Important: data is live and in-memory, and streams continuously while the server runs. The server's watchlist (BTC, ETH and SOL perpetuals by default) streams from startup; any other market starts streaming the first time it is requested and then keeps streaming. Session statistics cover only the time since a market began streaming (see stream_age_s; warming_up=true for the first minute), so wait before drawing conclusions from a young stream. list_active_markets shows what is streaming and for how long; watch_markets pins more markets. This is market data for analysis only; it cannot place orders.`;

const symbolArg = z.string().describe('Asset or symbol, e.g. "BTC", "ETHUSDT", "SOL-PERP".');
const venueArg = z.string().optional().describe('"all" (default, aggregate every venue listing the market) or one exchange: binance, bybit, okx, bitget, hyperliquid, deribit, coinbase, gate, kucoin, kraken, htx.');
const marketTypeArg = z.enum(["perp", "perpetual", "spot"]).optional().describe('"perp" (default) or "spot".');
const waitArg = z.number().min(0).max(30).optional().describe("Seconds to wait for first data when a market is not streaming yet (default 10).");
const marketArgs = { symbol: symbolArg, venue: venueArg, market_type: marketTypeArg, wait_seconds: waitArg };

type MarketArgs = { symbol: string; venue?: string; market_type?: string; wait_seconds?: number };

function json(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value) }] };
}

function fail(message: string) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ error: message }) }], isError: true };
}

export interface ServerExtras {
  /** Starts (if needed) the live screener page and returns its URL. */
  screener?: () => Promise<string>;
  /** Opens a URL in the browser of the machine running the server. */
  openBrowser?: (url: string) => boolean;
}

export function createServer(hub: MarketHub, extras: ServerExtras = {}): McpServer {
  const server = new McpServer({ name: "order-flow-mcp", version: VERSION }, { instructions: INSTRUCTIONS });

  /** Resolve + start a market, waiting for first data if it was just opened. */
  async function withMarket(args: MarketArgs, fn: (market: LiveMarket) => unknown) {
    try {
      const { market, created } = hub.open(args.symbol, args.venue, args.market_type);
      // A young stream waits for its venues to connect (bounded by wait_seconds).
      if (!market.ready || (!market.settled && market.ageMs < 15_000)) {
        await market.waitReady(Math.max(0, (args.wait_seconds ?? 10) * 1000 - market.ageMs));
      }
      if (!market.ready) {
        return json({
          ...header(market),
          status: created ? "started_streaming_no_data_yet" : "no_data_yet",
          connections: connectionsView(market),
          hint: "The stream is connecting or the venues are unreachable/geo-blocked from this server. Retry in a few seconds, or pick another venue.",
        });
      }
      return json(fn(market));
    } catch (error) {
      return fail(error instanceof Error ? error.message : String(error));
    }
  }

  const readOnly = { readOnlyHint: true, openWorldHint: true } as const;

  server.registerTool("list_markets", {
    title: "List markets",
    description: "Supported crypto assets (plus gold and silver perpetuals), which exchanges list each as perpetual or spot, and timeframes. Filter with query (e.g. 'sol', 'meme').",
    inputSchema: { query: z.string().optional().describe("Case-insensitive filter on ticker or name."), limit: z.number().int().min(1).max(500).optional() },
    annotations: { readOnlyHint: true },
  }, async ({ query, limit }) => {
    const q = query?.trim().toLowerCase();
    const assets = ALL_ASSETS.filter((a) => !q || a.base.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
    return json({
      count: assets.length,
      columns: ["symbol", "name", "kind", "perp_venues", "spot_venues"],
      assets: assets.slice(0, limit ?? 200).map((a) => [`${a.base}USDT`, a.name, a.kind, a.perp.join(","), a.spot.join(",")]),
      perp_venues: PERP_VENUES,
      spot_venues: SPOT_VENUES,
      timeframes: TIMEFRAMES,
    });
  });

  server.registerTool("get_market_snapshot", {
    title: "Market snapshot",
    description: "One-call overview of live order flow for a market: price/spread, session OHLC & VWAP (σ distance), buy/sell volume & delta over 1m/5m/15m, volume z-score, realized vol, POC/VAH/VAL, order-book imbalance and depth bands, open interest & regime, funding, basis, liquidations, big prints, absorption/iceberg events, plain-language signals and venue connection status.",
    inputSchema: marketArgs,
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => snapshotView(m)));

  server.registerTool("get_footprint", {
    title: "Footprint candles",
    description: "Footprint (bid × ask volume per price row) candles: OHLC, volume, delta, CVD, POC, VWAP, per-row bid/ask volume with imbalance flags, and stacked imbalances. Rows are grouped so each candle has at most max_rows rows.",
    inputSchema: {
      ...marketArgs,
      timeframe: z.enum(["1m", "5m", "15m", "30m", "1h", "4h"]).optional().describe("Candle timeframe (default 5m)."),
      candles: z.number().int().min(1).max(100).optional().describe("Most recent candles to return (default 6)."),
      max_rows: z.number().int().min(3).max(200).optional().describe("Max price rows per candle (default 24)."),
      row_ticks: z.number().int().min(1).max(10000).optional().describe("Fixed row height in ticks (overrides max_rows)."),
      imbalance_ratio: z.number().min(1.1).max(20).optional().describe("Imbalance ratio: ask/bid or bid/ask volume at the same row (default 3)."),
      stacked_levels: z.number().int().min(2).max(10).optional().describe("Consecutive imbalanced rows that count as stacked (default 3)."),
      include_rows: z.boolean().optional().describe("Include per-row volumes (default true). False returns candle summaries only."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => footprintView(m, {
    timeframe: (args.timeframe ?? "5m") as Timeframe,
    candles: args.candles ?? 6,
    maxRows: args.max_rows ?? 24,
    rowTicks: args.row_ticks,
    imbalanceRatio: args.imbalance_ratio ?? 3,
    stackedLevels: args.stacked_levels ?? 3,
    includeRows: args.include_rows ?? true,
  })));

  server.registerTool("get_volume_profile", {
    title: "Session volume profile",
    description: "Volume at price for the streamed session: POC, value area high/low, high-volume nodes, and per-row buy/sell volume and delta.",
    inputSchema: {
      ...marketArgs,
      rows: z.number().int().min(5).max(300).optional().describe("Number of price rows (default 40)."),
      value_area_pct: z.number().min(50).max(95).optional().describe("Value area percentage (default 70)."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => volumeProfileView(m, args.rows ?? 40, (args.value_area_pct ?? 70) / 100)));

  server.registerTool("get_order_book", {
    title: "Order book",
    description: "Live aggregated order book: top levels with cumulative size, spread, imbalance, depth within 0.1–2% of mid, large resting walls, and optionally per-venue top of book.",
    inputSchema: {
      ...marketArgs,
      depth: z.number().int().min(1).max(100).optional().describe("Levels per side (default 20)."),
      group_ticks: z.number().int().min(0).max(10000).optional().describe("Group levels into buckets of N footprint ticks (~1bp each). 0 = raw exchange levels (default)."),
      per_venue: z.boolean().optional().describe("Include each venue's top of book (default false)."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => orderBookView(m, args.depth ?? 20, args.group_ticks ?? 0, args.per_venue ?? false)));

  server.registerTool("get_trades", {
    title: "Time & sales",
    description: "Recent executed trades (tape), newest first, with aggressor side and notional. Filter by minimum notional, side or venue.",
    inputSchema: {
      ...marketArgs,
      limit: z.number().int().min(1).max(1000).optional().describe("Max trades (default 50)."),
      min_notional_usd: z.number().min(0).optional().describe("Only trades at least this notional."),
      side: z.enum(["buy", "sell"]).optional(),
      only_venue: z.string().optional().describe("Only trades from this venue id, e.g. bybit-futures."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => tradesView(m, args.limit ?? 50, args.min_notional_usd ?? 0, args.side, args.only_venue as Venue | undefined)));

  server.registerTool("get_big_trades", {
    title: "Big prints",
    description: "Block / whale prints: trades at least N× the session's average print size, with buy vs sell totals.",
    inputSchema: {
      ...marketArgs,
      min_ratio: z.number().min(5).max(1000).optional().describe("Minimum multiple of the average print (default 10; at least 5)."),
      window_minutes: z.number().min(1).max(480).optional().describe("Look-back window (default 60)."),
      limit: z.number().int().min(1).max(500).optional().describe("Max prints listed (default 30)."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => bigTradesView(m, args.limit ?? 30, args.min_ratio ?? 10, args.window_minutes ?? 60)));

  server.registerTool("get_flow_series", {
    title: "Flow bars (CVD, volume z-score)",
    description: "Time bars of executed flow: OHLC, volume, buy/sell volume, delta, cumulative volume delta (CVD), trade count and rolling volume z-score, plus realized volatility. Built from 1-second bars (2h kept).",
    inputSchema: {
      ...marketArgs,
      interval_seconds: z.number().int().min(1).max(3600).optional().describe("Bar length in seconds (default 60)."),
      bars: z.number().int().min(1).max(500).optional().describe("Most recent bars (default 60)."),
      z_window: z.number().int().min(5).max(500).optional().describe("Bars in the volume z-score baseline (default 20)."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => flowSeriesView(m, args.interval_seconds ?? 60, args.bars ?? 60, args.z_window ?? 20)));

  server.registerTool("get_derivatives", {
    title: "Open interest & funding",
    description: "Perpetuals positioning: aggregate and per-venue open interest, funding (native and 8h-normalized, annualized), next funding, mark/index basis, OI change over 1m/5m/15m/60m with the price × OI regime (new longs, short covering, new shorts, long unwind), and per-minute OI history.",
    inputSchema: { ...marketArgs, history_minutes: z.number().int().min(1).max(120).optional().describe("Minutes of OI history (default 30).") },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => derivativesView(m, args.history_minutes ?? 30)));

  server.registerTool("get_liquidations", {
    title: "Liquidations",
    description: "Forced liquidations on perpetuals: long vs short notional over a window, per-minute buckets, largest liquidation, cascade flag and the latest events.",
    inputSchema: {
      ...marketArgs,
      window_minutes: z.number().min(1).max(240).optional().describe("Look-back window (default 30)."),
      limit: z.number().int().min(1).max(500).optional().describe("Recent events listed (default 20)."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => liquidationsView(m, args.window_minutes ?? 30, args.limit ?? 20)));

  server.registerTool("get_microstructure_events", {
    title: "Absorption & icebergs",
    description: "Detected absorption (passive side holding against aggressive flow without price moving) and iceberg orders (hidden size refilling at a level).",
    inputSchema: {
      ...marketArgs,
      kind: z.enum(["all", "absorption", "iceberg"]).optional(),
      window_minutes: z.number().min(1).max(480).optional().describe("Look-back window (default 60)."),
      limit: z.number().int().min(1).max(500).optional().describe("Max events (default 20)."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => microView(m, args.kind ?? "all", args.limit ?? 20, args.window_minutes ?? 60)));

  server.registerTool("get_venue_comparison", {
    title: "Venue comparison",
    description: "Cross-exchange view for an aggregated market: each venue's last price premium vs the median, 60s volume share and delta, and which venue leads price (lag in ms).",
    inputSchema: marketArgs,
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => venuesView(m)));

  server.registerTool("get_liquidity_heatmap", {
    title: "Resting liquidity heatmap",
    description: "Order-book depth over time (sampled every second) within ±1% of mid: average resting size per price row and time column, plus persistent walls and whether they were pulled, added or held.",
    inputSchema: {
      ...marketArgs,
      minutes: z.number().min(1).max(120).optional().describe("Look-back (default 10)."),
      rows: z.number().int().min(5).max(100).optional().describe("Price rows (default 20)."),
      columns: z.number().int().min(1).max(60).optional().describe("Time columns (default 10)."),
    },
    annotations: readOnly,
  }, async (args) => withMarket(args, (m) => heatmapView(m, args.minutes ?? 10, args.rows ?? 20, args.columns ?? 10)));

  server.registerTool("scan_markets", {
    title: "Order-flow screener",
    description: "Screen several markets side by side: price change, 5m delta and buy %, 5m notional, 1m volume z-score, VWAP distance, book imbalance, funding, 5m OI change, 5m liquidations and big prints. Starts streams that are not running yet.",
    inputSchema: {
      symbols: z.array(z.string()).min(1).max(15).optional().describe('Symbols to screen (default BTC, ETH, SOL, XRP, DOGE, BNB, HYPE, SUI).'),
      venue: venueArg,
      market_type: marketTypeArg,
      sort_by: z.enum(["volume_z", "delta_5m", "buy_pct_5m", "change_5m", "notional_5m", "sigma_from_vwap", "oi_change_5m", "liquidations_5m"]).optional().describe("Sort column, descending by absolute value where signed (default notional_5m)."),
      wait_seconds: waitArg,
    },
    annotations: readOnly,
  }, async (args) => {
    const symbols = args.symbols ?? ["BTC", "ETH", "SOL", "XRP", "DOGE", "BNB", "HYPE", "SUI"];
    const errors: Record<string, string> = {};
    const markets: LiveMarket[] = [];
    for (const symbol of symbols) {
      try {
        markets.push(hub.open(symbol, args.venue, args.market_type).market);
      } catch (error) {
        errors[symbol] = error instanceof Error ? error.message : String(error);
      }
    }
    await Promise.all(markets.map((m) => (m.ready && m.settled ? true : m.waitReady(Math.max(1000, (args.wait_seconds ?? 10) * 1000 - m.ageMs)))));
    const rows = markets.map((m) => scanRow(m));
    const key = ({
      volume_z: "volume_z_1m", delta_5m: "delta_5m", buy_pct_5m: "buy_pct_5m", change_5m: "change_5m_pct",
      notional_5m: "notional_5m_usd", sigma_from_vwap: "sigma_from_vwap", oi_change_5m: "oi_change_5m_pct", liquidations_5m: "liquidations_5m_usd",
    } as const)[args.sort_by ?? "notional_5m"];
    const signed = key !== "buy_pct_5m" && key !== "notional_5m_usd" && key !== "liquidations_5m_usd";
    rows.sort((a, b) => {
      const av = a[key] as number | null, bv = b[key] as number | null;
      const x = av === null ? -Infinity : signed ? Math.abs(av) : av;
      const y = bv === null ? -Infinity : signed ? Math.abs(bv) : bv;
      return y - x;
    });
    const keys = rows.length ? Object.keys(rows[0]) : [];
    return json({
      as_of: iso(Date.now()),
      sorted_by: key,
      columns: keys,
      rows: rows.map((r) => keys.map((k) => (r as Record<string, unknown>)[k])),
      ...(Object.keys(errors).length ? { errors } : {}),
      note: "Notional is base volume × price. Young streams (stream_age_s < 300) have incomplete 5m windows; delta is in base units.",
    });
  });

  server.registerTool("watch_markets", {
    title: "Watch markets",
    description: "Start streaming markets now and keep them running (pinned, never idle-closed) so history accumulates for later analysis. Returns each market's status.",
    inputSchema: {
      symbols: z.array(z.string()).min(1).max(20),
      venue: venueArg,
      market_type: marketTypeArg,
    },
    annotations: { readOnlyHint: false, openWorldHint: true },
  }, async ({ symbols, venue, market_type }) => {
    const out = symbols.map((symbol) => {
      try {
        const { market, created } = hub.open(symbol, venue, market_type);
        market.pinned = true;
        return { symbol: market.spec.symbol, key: market.spec.key, venues: market.spec.venues, started: created, stream_age_s: Math.round(market.ageMs / 1000) };
      } catch (error) {
        return { symbol, error: error instanceof Error ? error.message : String(error) };
      }
    });
    return json({ watching: out });
  });

  server.registerTool("unwatch_market", {
    title: "Stop a market",
    description: "Stop streaming a market and discard its in-memory history.",
    inputSchema: { symbol: symbolArg, venue: venueArg, market_type: marketTypeArg },
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  }, async ({ symbol, venue, market_type }) => {
    try {
      const spec = resolveMarket(symbol, venue, market_type);
      return json({ stopped: hub.close(spec.key), key: spec.key });
    } catch (error) {
      return fail(error instanceof Error ? error.message : String(error));
    }
  });

  server.registerTool("list_active_markets", {
    title: "Active streams",
    description: "Markets currently streaming on this server, with age, trade count, pin state and venue connection status.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  }, async () => json({
    max_markets: hub.options.maxMarkets,
    idle_close_minutes: hub.options.idleMs > 0 ? hub.options.idleMs / 60_000 : "never",
    markets: hub.list().map((m) => ({
      symbol: m.spec.symbol,
      market_type: m.spec.marketType,
      venue_selection: m.spec.selection,
      pinned: m.pinned,
      stream_age_s: Math.round(m.ageMs / 1000),
      idle_s: Math.round((Date.now() - m.lastAccess) / 1000),
      trades: m.state.session?.trades ?? 0,
      last: sig(referenceLast(m)?.price, 8),
      connections: connectionsView(m),
    })),
  }));

  server.registerTool("open_screener", {
    title: "Open the live screener",
    description: "Open a live screener page for the user: a watchlist of every streaming market whose prices, sparklines and order-flow stats (delta, buy %, book imbalance, funding, OI, liquidations, cascade alerts, big prints) update several times a second, plus a live tape of notable events. Pass symbols to add them to the watchlist first. Returns the page URL; on a local server it also opens it in the browser.",
    inputSchema: {
      symbols: z.array(z.string()).max(20).optional().describe('Markets to add and pin first, e.g. ["BTC", "ETH", "SOL"]. Markets already streaming are shown either way.'),
      venue: venueArg,
      market_type: marketTypeArg,
      open_browser: z.boolean().optional().describe("Open the page in the default browser of the machine running this server (default true). Set false when the server is remote."),
    },
    annotations: { readOnlyHint: false, openWorldHint: true },
  }, async ({ symbols, venue, market_type, open_browser }) => {
    if (!extras.screener) return fail("The live screener is not available on this server.");
    const added: Record<string, unknown>[] = [];
    for (const symbol of symbols ?? []) {
      try {
        const { market } = hub.open(symbol, venue, market_type);
        market.pinned = true;
        added.push({ symbol: market.spec.symbol, key: market.spec.key });
      } catch (error) {
        added.push({ symbol, error: error instanceof Error ? error.message : String(error) });
      }
    }
    try {
      const url = await extras.screener();
      const opened = open_browser !== false && !!extras.openBrowser?.(url);
      return json({
        url,
        opened_in_browser: opened,
        ...(added.length ? { added } : {}),
        markets_on_screen: hub.list().map((m) => m.spec.key),
        note: opened
          ? "The screener is open in the user's browser and updates live. Tell the user the URL in case it opened behind other windows."
          : "Give the user this URL to open; the page updates live. It is served by this MCP server, so it works only while the server runs and from a machine that can reach it.",
      });
    } catch (error) {
      return fail(`Could not start the screener: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  server.registerTool("wait_for", {
    title: "Wait for a market event",
    description: "Block until a condition fires on any of the given markets, or until the timeout, instead of polling. Returns which condition fired, on which market, and that market's screener row. Conditions on price level, move %, liquidation cascade and liquidation total fire immediately if already true (check waited_s); big_trade_usd, absorption and iceberg need a new event after the call starts. To keep watching, call again after it returns.",
    inputSchema: {
      symbols: z.array(z.string()).min(1).max(10).describe('Markets to watch, e.g. ["BTC"] or ["BTC", "ETH", "SOL"].'),
      venue: venueArg,
      market_type: marketTypeArg,
      price_above: z.number().optional().describe("Fire when the price is at or above this level (use with a single symbol)."),
      price_below: z.number().optional().describe("Fire when the price is at or below this level (use with a single symbol)."),
      move_pct: z.number().positive().optional().describe("Fire when the price has moved at least this % (either direction) over move_minutes."),
      move_minutes: z.number().min(1).max(120).optional().describe("Window for move_pct (default 5)."),
      liquidation_cascade: z.boolean().optional().describe("Fire on a liquidation cascade: the last minute's liquidations are ≥ $100K and at least 5× a typical (median) minute over the last 30m (perps)."),
      liquidations_usd: z.number().positive().optional().describe("Fire when liquidations over liquidations_minutes reach this many USD (perps)."),
      liquidations_minutes: z.number().min(1).max(60).optional().describe("Window for liquidations_usd (default 5)."),
      big_trade_usd: z.number().positive().optional().describe("Fire on a single print of at least this many USD."),
      absorption: z.boolean().optional().describe("Fire on a new absorption event."),
      iceberg: z.boolean().optional().describe("Fire on a new iceberg event."),
      timeout_seconds: z.number().min(1).max(3600).optional().describe("Give up after this long (default 300). Clients may cut very long calls; on timed_out just call again."),
    },
    annotations: readOnly,
  }, async (args, extra) => {
    const conditions: WaitConditions = {
      price_above: args.price_above, price_below: args.price_below, move_pct: args.move_pct, move_minutes: args.move_minutes,
      liquidation_cascade: args.liquidation_cascade, liquidations_usd: args.liquidations_usd, liquidations_minutes: args.liquidations_minutes,
      big_trade_usd: args.big_trade_usd, absorption: args.absorption, iceberg: args.iceberg,
    };
    if (!hasCondition(conditions)) return fail("Give at least one condition, e.g. liquidation_cascade: true or price_above: 100000.");
    const markets: LiveMarket[] = [];
    const wasPinned = new Map<LiveMarket, boolean>();
    const errors: Record<string, string> = {};
    for (const symbol of args.symbols) {
      try {
        const { market } = hub.open(symbol, args.venue, args.market_type);
        if (!wasPinned.has(market)) wasPinned.set(market, market.pinned);
        market.pinned = true; // a watched market must not be idle-closed mid-wait
        markets.push(market);
      } catch (error) {
        errors[symbol] = error instanceof Error ? error.message : String(error);
      }
    }
    if (!markets.length) return fail(Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join("; "));
    await Promise.all(markets.map((m) => (m.ready ? true : m.waitReady(10_000))));

    const started = Date.now();
    const timeoutMs = (args.timeout_seconds ?? 300) * 1000;
    const since = new Map(markets.map((m) => [m, m.state.marketClock || Date.now()]));
    const progressToken = extra._meta?.progressToken;
    let nextProgress = started + 15_000;
    let hit: { market: LiveMarket; hit: Hit } | null = null;

    while (!extra.signal.aborted) {
      for (const m of markets) {
        const h = checkConditions(m.touch(), conditions, since.get(m)!);
        if (h) { hit = { market: m, hit: h }; break; }
      }
      if (hit || Date.now() - started >= timeoutMs) break;
      if (progressToken !== undefined && Date.now() >= nextProgress) {
        nextProgress += 15_000;
        await extra.sendNotification({
          method: "notifications/progress",
          params: { progressToken, progress: Date.now() - started, total: timeoutMs, message: "Watching " + markets.map((m) => m.spec.symbol).join(", ") },
        }).catch(() => {});
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    for (const [m, pinned] of wasPinned) m.pinned = pinned;
    const waited = fixed((Date.now() - started) / 1000, 1);
    if (hit) {
      return json({
        triggered: true,
        market: hit.market.spec.key,
        symbol: hit.market.spec.symbol,
        condition: hit.hit.condition,
        detail: hit.hit.detail,
        event_time: hit.hit.time,
        waited_s: waited,
        row: scanRow(hit.market),
        ...(Object.keys(errors).length ? { errors } : {}),
      });
    }
    return json({
      triggered: false,
      reason: extra.signal.aborted ? "cancelled" : "timed_out",
      waited_s: waited,
      rows: markets.map((m) => scanRow(m)),
      ...(Object.keys(errors).length ? { errors } : {}),
      note: "Nothing fired. Call wait_for again to keep watching.",
    });
  });

  server.registerPrompt("analyze_order_flow", {
    title: "Analyze order flow",
    description: "Read the live order flow for a market and summarize who is in control, key levels and risks.",
    argsSchema: { symbol: z.string().describe("e.g. BTC"), timeframe: z.string().optional().describe("Footprint timeframe, default 5m") },
  }, ({ symbol, timeframe }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Analyze the live order flow for ${symbol}. Call get_market_snapshot first, then get_footprint (timeframe ${timeframe ?? "5m"}), get_volume_profile, get_order_book and, for perpetuals, get_derivatives and get_liquidations. Report: (1) who is in control (aggressor balance, delta/CVD trend, divergences), (2) key levels (POC, VAH/VAL, VWAP ±σ, book walls, absorption/iceberg prices), (3) positioning (OI regime, funding, liquidations), (4) what would change the read. Mention stream_age_s and treat young streams with caution. This is analysis, not financial advice.`,
      },
    }],
  }));

  return server;
}

export { MarketError };
