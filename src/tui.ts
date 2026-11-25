// Terminal screener: a full-screen, Bloomberg-style live board drawn with
// ANSI escapes, no browser and no extra dependencies.
//
//   order-flow-mcp tui                       BTC ETH SOL XRP DOGE BNB HYPE SUI perps, all venues
//   order-flow-mcp tui BTC,ETH,SOL --window 1h
//   order-flow-mcp tui --connect http://127.0.0.1:3334   read a running server's markets and history
//
// It streams the markets itself, or with --connect reads the screener JSON of
// an MCP server that is already running (so it shows the agent's markets and
// their full history). Keys: 1-4 window, s sort, q quit.

import type { MarketHub } from "./market";
import { SCREENER_WINDOWS, screenerSnapshot, type ScreenerWindow } from "./screener";

type Snapshot = ReturnType<typeof screenerSnapshot>;
type Row = Snapshot["rows"][number];
type Event = Snapshot["events"][number];

// ─── colours ──────────────────────────────────────────────────
const ESC = "\x1b[";
const BG = 16; // black
const AMBER = 214, WHITE = 231, GREY = 245, DIM = 240, UP = 46, DOWN = 196, CYAN = 51, YELLOW = 226;
const fg = (n: number) => `${ESC}38;5;${n}m`;
const bg = (n: number) => `${ESC}48;5;${n}m`;
const BOLD = `${ESC}1m`, NOBOLD = `${ESC}22m`, RESET = `${ESC}0m`;

/** A coloured cell: text is padded to `width` before colouring, so ANSI never breaks alignment. */
function cell(text: string, width: number, color = WHITE, align: "l" | "r" = "l", back = BG, bold = false): string {
  const t = text.length > width ? text.slice(0, Math.max(0, width - 1)) + "…" : text;
  const padded = align === "r" ? t.padStart(width) : t.padEnd(width);
  return `${bg(back)}${fg(color)}${bold ? BOLD : ""}${padded}${bold ? NOBOLD : ""}${bg(BG)}`;
}
const dir = (x: number | null | undefined) => (x === null || x === undefined || x === 0 ? WHITE : x > 0 ? UP : DOWN);

// ─── number formats ───────────────────────────────────────────
export function fmtPrice(x: number | null, decimals: number): string {
  if (x === null) return "—";
  return x.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
export function fmtUsd(x: number): string {
  const a = Math.abs(x), s = x < 0 ? "-" : "";
  if (a >= 1e9) return `${s}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `${s}$${(a / 1e3).toFixed(0)}K`;
  return `${s}$${a.toFixed(0)}`;
}
function fmtNum(x: number): string {
  const a = Math.abs(x), s = x > 0 ? "+" : "";
  if (a >= 1e6) return `${s}${(x / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `${s}${(x / 1e3).toFixed(1)}K`;
  if (a >= 100) return `${s}${x.toFixed(0)}`;
  return `${s}${x.toFixed(a >= 1 ? 1 : 3)}`;
}
/** Sign prefix, and no "-0.00" for values that round to zero. */
const plus = (x: number, s: string) => (/^-?[0.,]*%?$/.test(s) ? s.replace(/^-/, "") : (x > 0 ? "+" : "") + s);

const BLOCKS = "▁▂▃▄▅▆▇█";
/** Unicode block sparkline of `values` resampled to `width` characters; leading gaps stay blank. */
export function spark(values: (number | null)[], width: number, baseline: number | null): string {
  if (width <= 0) return "";
  const out: (number | null)[] = [];
  for (let i = 0; i < width; i++) {
    const from = Math.floor((i * values.length) / width);
    const to = Math.max(from + 1, Math.floor(((i + 1) * values.length) / width));
    let v: number | null = null;
    for (let j = from; j < to && j < values.length; j++) if (values[j] !== null) v = values[j];
    out.push(v);
  }
  const nums = out.filter((v): v is number => v !== null);
  if (!nums.length) return " ".repeat(width);
  let lo = Math.min(...nums), hi = Math.max(...nums);
  if (baseline !== null) { lo = Math.min(lo, baseline); hi = Math.max(hi, baseline); }
  const span = hi - lo || 1;
  return out.map((v) => (v === null ? " " : BLOCKS[Math.min(7, Math.floor(((v - lo) / span) * 7.999))])).join("");
}

// ─── layout ───────────────────────────────────────────────────
export interface ViewState {
  window: ScreenerWindow;
  sort: SortKey;
  /** key → direction and expiry of the last price change, for the flash. */
  flashes: Map<string, { up: boolean; until: number }>;
  source: string;
  status: string;
}

export const SORTS = ["watchlist", "change", "volume", "delta", "liquidations"] as const;
export type SortKey = (typeof SORTS)[number];

interface Column {
  title: string;
  width: number;
  priority: number; // lower stays longer as the terminal narrows
  align: "l" | "r";
  draw: (r: Row, w: number, view: ViewState, now: number) => string;
}

const COLUMNS: Column[] = [
  { title: "TICKER", width: 10, priority: 0, align: "l", draw: (r, w) => cell(r.base, 5, AMBER, "l", BG, true) + cell(r.market_type === "perp" ? "PERP" : "SPOT", w - 5, DIM) },
  {
    title: "LAST", width: 13, priority: 0, align: "r",
    draw: (r, w, view, now) => {
      const f = view.flashes.get(r.key);
      const live = f && f.until > now;
      return cell(fmtPrice(r.last, r.decimals), w, live ? (f.up ? UP : DOWN) : WHITE, "r", live ? (f.up ? 22 : 52) : BG, true);
    },
  },
  { title: "NET CHG", width: 11, priority: 5, align: "r", draw: (r, w) => cell(r.change === null ? "—" : plus(r.change, fmtPrice(r.change, r.decimals)), w, dir(r.change), "r") },
  { title: "%CHG", width: 8, priority: 0, align: "r", draw: (r, w) => cell(r.change_pct === null ? "—" : plus(r.change_pct, r.change_pct.toFixed(2) + "%"), w, dir(r.change_pct), "r", BG, true) },
  { title: "TREND", width: 22, priority: 1, align: "l", draw: (r, w) => cell(spark(r.spark, w - 1, r.baseline), w, (r.change ?? 0) >= 0 ? UP : DOWN) },
  { title: "Δ 5M", width: 9, priority: 1, align: "r", draw: (r, w) => cell(r.delta_5m === null ? "—" : fmtNum(r.delta_5m), w, dir(r.delta_5m), "r") },
  { title: "BUY%", width: 6, priority: 1, align: "r", draw: (r, w) => cell(r.buy_pct_5m === null ? "—" : r.buy_pct_5m.toFixed(0) + "%", w, r.buy_pct_5m === null ? WHITE : r.buy_pct_5m >= 55 ? UP : r.buy_pct_5m <= 45 ? DOWN : WHITE, "r") },
  { title: "VOL 5M", width: 9, priority: 6, align: "r", draw: (r, w) => cell(r.notional_5m_usd === null ? "—" : fmtUsd(r.notional_5m_usd), w, WHITE, "r") },
  { title: "BOOK", width: 7, priority: 3, align: "r", draw: (r, w) => cell(r.obi === null ? "—" : plus(r.obi, r.obi.toFixed(2)), w, dir(r.obi), "r") },
  { title: "FUND 8H", width: 10, priority: 4, align: "r", draw: (r, w) => cell(r.funding_8h_pct === null ? "—" : r.funding_8h_pct.toFixed(4) + "%", w, dir(r.funding_8h_pct), "r") },
  { title: "OI 5M", width: 8, priority: 4, align: "r", draw: (r, w) => cell(r.oi_change_5m_pct === null ? "—" : plus(r.oi_change_5m_pct, r.oi_change_5m_pct.toFixed(2) + "%"), w, dir(r.oi_change_5m_pct), "r") },
  {
    title: "LIQ 5M L/S", width: 14, priority: 2, align: "r",
    draw: (r, w) => r.market_type !== "perp" ? cell("—", w, DIM, "r")
      : cell(`${fmtUsd(r.liq_long_5m_usd)}/${fmtUsd(r.liq_short_5m_usd)}`, w, r.cascade ? YELLOW : r.liq_long_5m_usd + r.liq_short_5m_usd > 0 ? WHITE : DIM, "r"),
  },
  { title: "VOL Z", width: 6, priority: 7, align: "r", draw: (r, w) => cell(r.volume_z_1m === null ? "—" : r.volume_z_1m.toFixed(1), w, r.volume_z_1m !== null && Math.abs(r.volume_z_1m) >= 3 ? YELLOW : WHITE, "r") },
  { title: "VWAP σ", width: 7, priority: 7, align: "r", draw: (r, w) => cell(r.sigma_from_vwap === null ? "—" : plus(r.sigma_from_vwap, r.sigma_from_vwap.toFixed(1)), w, r.sigma_from_vwap !== null && Math.abs(r.sigma_from_vwap) >= 2 ? YELLOW : WHITE, "r") },
  { title: "VENUES", width: 7, priority: 8, align: "r", draw: (r, w) => cell(r.live_venues, w, GREY, "r") },
  {
    title: "FLAGS", width: 10, priority: 0, align: "l",
    draw: (r, w, _v, now) => r.cascade ? cell(" CASCADE", w, WHITE, "l", Math.floor(now / 500) % 2 ? 196 : 88, true)
      : !r.ready ? cell(" CONNECT", w, GREY) : r.stream_age_s < 60 ? cell(" WARMING", w, GREY) : cell("", w),
  },
];

/** The columns that fit in `width`, dropping the highest priority numbers first; TREND takes spare room. */
function fitColumns(width: number): { col: Column; width: number }[] {
  let cols = [...COLUMNS];
  const total = (cs: Column[]) => cs.reduce((a, c) => a + c.width + 1, 1);
  while (total(cols) > width && cols.length > 4) {
    const worst = Math.max(...cols.map((c) => c.priority));
    const idx = cols.map((c) => c.priority).lastIndexOf(worst);
    cols.splice(idx, 1);
  }
  const spare = Math.max(0, width - total(cols));
  return cols.map((c) => ({ col: c, width: c.title === "TREND" ? Math.min(c.width + spare, 60) : c.width }));
}

function sortRows(rows: Row[], sort: SortKey): Row[] {
  const by = (f: (r: Row) => number | null) => [...rows].sort((a, b) => Math.abs(f(b) ?? -Infinity) - Math.abs(f(a) ?? -Infinity));
  if (sort === "change") return by((r) => r.change_pct);
  if (sort === "volume") return by((r) => r.notional_5m_usd);
  if (sort === "delta") return by((r) => (r.delta_5m !== null && r.last ? r.delta_5m * r.last : null));
  if (sort === "liquidations") return by((r) => r.liq_long_5m_usd + r.liq_short_5m_usd);
  return rows;
}

const time = (ms: number) => new Date(ms).toISOString().slice(11, 19);
const KIND: Record<string, string> = { big: "BLOCK", absorption: "ABSORB", iceberg: "ICEBRG", liq: "LIQ" };

/** One full frame, `height` lines of exactly `width` columns. */
export function renderFrame(snap: Snapshot, view: ViewState, width: number, height: number, now = Date.now()): string {
  const lines: string[] = [];
  const line = (content = "") => lines.push(`${bg(BG)}${content}${bg(BG)}${ESC}K${RESET}`);

  // Title bar
  const left = ` ORDER FLOW <GO>  ${snap.rows.length} MKTS  ${view.source}`;
  const right = `${view.window.toUpperCase()} WINDOW  ${time(now)} UTC `;
  line(cell(left + " ".repeat(Math.max(1, width - left.length - right.length)) + right, width, 16, "l", AMBER, true));

  // Cascade banner
  const cascades = snap.rows.filter((r) => r.cascade);
  if (cascades.length) {
    const text = " ▲ LIQUIDATION CASCADE  " + cascades.map((r) => `${r.base} L ${fmtUsd(r.liq_long_5m_usd)} / S ${fmtUsd(r.liq_short_5m_usd)} (5m)`).join("   ");
    line(cell(text, width, WHITE, "l", Math.floor(now / 500) % 2 ? 160 : 88, true));
  }

  // Table
  const cols = fitColumns(width);
  line(" " + cols.map(({ col, width: w }) => cell(col.title, w, AMBER, col.align)).join(" "));
  line(cell("─".repeat(width), width, DIM));
  const tableRoom = Math.max(1, height - lines.length - 6);
  const rows = sortRows(snap.rows, view.sort).slice(0, tableRoom);
  if (!snap.rows.length) line(cell("  No markets streaming yet.", width, GREY));
  for (const r of rows) line(" " + cols.map(({ col, width: w }) => col.draw(r, w, view, now)).join(" "));
  if (snap.rows.length > rows.length) line(cell(`  … ${snap.rows.length - rows.length} more (enlarge the terminal)`, width, DIM));

  // Tape
  line();
  line(cell(" TAPE  blocks · absorption · icebergs · liquidations", width, AMBER, "l", BG, true));
  line(cell("─".repeat(width), width, DIM));
  const tapeRoom = Math.max(0, height - lines.length - 1);
  for (const e of snap.events.slice(0, tapeRoom) as Event[]) {
    const fresh = now - e.time < 3000;
    const side = e.side === "buy" ? UP : DOWN;
    line(
      " " + cell(time(e.time), 9, fresh ? WHITE : GREY)
      + cell(e.base, 6, AMBER, "l", BG, true)
      + cell(KIND[e.kind] ?? e.kind.toUpperCase(), 7, CYAN)
      + cell(e.side === "buy" ? "BUY" : "SELL", 5, side, "l", BG, true)
      + cell(fmtUsd(e.usd), 9, side, "r", BG, fresh)
      + "  " + cell(e.text, Math.max(0, width - 40), fresh ? WHITE : GREY)
    );
  }
  while (lines.length < height - 1) line();

  // Status bar
  const keys = " 1 15M  2 1H  3 4H  4 SESSION   S SORT:" + view.sort.toUpperCase() + "   Q QUIT";
  const status = view.status ? `${view.status} ` : "";
  line(cell(keys + " ".repeat(Math.max(1, width - keys.length - status.length)) + status, width, GREY, "l", 235));
  return lines.slice(0, height).join("\n");
}

// ─── run loop ─────────────────────────────────────────────────
export interface TuiOptions {
  symbols: string[];
  venue?: string;
  marketType?: string;
  window: ScreenerWindow;
  connect?: string;
  maxMarkets: number;
}

export async function runTui(options: TuiOptions): Promise<void> {
  const out = process.stdout;
  const view: ViewState = { window: options.window, sort: "watchlist", flashes: new Map(), source: "", status: "" };
  const lastPrice = new Map<string, number>();

  // Exchange SDKs log to the console; on a full-screen board that would tear the frame.
  let lastLog = "";
  const capture = (...args: unknown[]) => { lastLog = args.map(String).join(" ").replace(/\s+/g, " ").slice(0, 120); };
  console.log = console.info = console.warn = console.error = capture;
  // Exchange SDKs occasionally throw or reject during reconnects; keep the board up and show it in the status bar.
  process.on("uncaughtException", (e) => capture(e instanceof Error ? e.message : e));
  process.on("unhandledRejection", (e) => capture(e instanceof Error ? e.message : e));

  let hub: MarketHub | null = null;
  let fetchSnapshot: () => Promise<Snapshot>;
  if (options.connect) {
    const base = options.connect.replace(/\/+$/, "").replace(/\/screener$/, "");
    const url = new URL(base + "/screener/data.json");
    const token = url.searchParams.get("token") ?? new URL(options.connect).searchParams.get("token");
    view.source = `· ${url.host}`;
    fetchSnapshot = async () => {
      url.search = `?window=${view.window}${token ? `&token=${encodeURIComponent(token)}` : ""}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`${url.host} answered ${res.status}`);
      return (await res.json()) as Snapshot;
    };
  } else {
    const { MarketHub } = await import("./market");
    const local = new MarketHub({ idleMs: 0, maxMarkets: options.maxMarkets });
    hub = local;
    for (const symbol of options.symbols) {
      try {
        local.open(symbol, options.venue, options.marketType).market.pinned = true;
      } catch (error) {
        lastLog = `${symbol}: ${error instanceof Error ? error.message : error}`;
      }
    }
    view.source = `· ${options.venue && options.venue !== "all" ? options.venue.toUpperCase() : "ALL VENUES"}`;
    fetchSnapshot = async () => screenerSnapshot(local, view.window);
  }

  let snap: Snapshot = { as_of: Date.now(), window: view.window, rows: [], events: [] };
  let error = "";
  let stopped = false;

  const draw = () => {
    if (stopped) return;
    const now = Date.now();
    view.status = error ? `⚠ ${error}` : lastLog ? `log: ${lastLog}` : "";
    out.write(`${ESC}H` + renderFrame(snap, view, out.columns || 120, out.rows || 40, now));
  };

  const refresh = async () => {
    try {
      const next = await fetchSnapshot();
      const now = Date.now();
      for (const r of next.rows) {
        const prev = lastPrice.get(r.key);
        if (r.last !== null && prev !== undefined && r.last !== prev) view.flashes.set(r.key, { up: r.last > prev, until: now + 300 });
        if (r.last !== null) lastPrice.set(r.key, r.last);
      }
      snap = next;
      error = "";
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    draw();
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    out.write(`${RESET}${ESC}?25h${ESC}?1049l`);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    hub?.dispose();
    setTimeout(() => process.exit(0), 100).unref();
  };

  out.write(`${ESC}?1049h${ESC}?25l${ESC}2J`); // alternate screen, hide cursor
  out.on("resize", () => { out.write(`${ESC}2J`); draw(); });
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", (buf: Buffer) => {
      const k = buf.toString();
      if (k === "q" || k === "Q" || k === "\x03" || k === "\x1b") return stop();
      const windows = Object.keys(SCREENER_WINDOWS) as ScreenerWindow[];
      if (k >= "1" && k <= "4") { view.window = windows[Number(k) - 1]; void refresh(); }
      if (k === "s" || k === "S") { view.sort = SORTS[(SORTS.indexOf(view.sort) + 1) % SORTS.length]; draw(); }
    });
  }

  let busy = false;
  const timer = setInterval(() => {
    if (busy) return draw();
    busy = true;
    void refresh().finally(() => { busy = false; });
  }, 250);
  await refresh();
}

export const DEFAULT_TUI_SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "DOGE", "BNB", "HYPE", "SUI"];

/** `tui [BTC,ETH ...] [--window 1h] [--venue bybit] [--spot] [--connect URL] [--max-markets n]` */
export function parseTuiArgs(argv: string[]): TuiOptions {
  const o: TuiOptions = { symbols: [], window: "15m", maxMarkets: 20 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i] ?? "";
    if (a === "--window" || a === "-w") {
      const w = next().toLowerCase();
      if (!(w in SCREENER_WINDOWS)) throw new Error(`--window must be one of ${Object.keys(SCREENER_WINDOWS).join(", ")}`);
      o.window = w as ScreenerWindow;
    } else if (a === "--venue") o.venue = next();
    else if (a === "--spot") o.marketType = "spot";
    else if (a === "--connect") o.connect = next() || "http://127.0.0.1:3334";
    else if (a === "--max-markets") o.maxMarkets = Number(next());
    else if (a.startsWith("-")) throw new Error(`Unknown option ${a}`);
    else o.symbols.push(...a.split(",").map((s) => s.trim()).filter(Boolean));
  }
  if (!o.symbols.length) o.symbols = DEFAULT_TUI_SYMBOLS;
  return o;
}
