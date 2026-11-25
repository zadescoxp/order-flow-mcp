# order-flow-mcp

**Live crypto order flow for any AI agent.** An [MCP](https://modelcontextprotocol.io) server that streams trades,
order books, open interest, funding and liquidations from **10 exchanges** and gives agents the same analytics
as the [Order Flow Screener](https://github.com/zadescoxp/order-flow-screener) terminal: footprint candles, CVD, volume
profile, VWAP bands, book imbalance and walls, block prints, absorption and iceberg detection, OI regimes,
venue lead/lag and a multi-symbol screener.

Works with Claude Code, Codex, Cursor, Claude Desktop, VS Code, Windsurf, Gemini CLI, or any client that speaks MCP.
You don't need API keys or an account, and there's nothing to configure.

```
you ▸ What's the order flow on BTC right now?
agent ▸ (calls get_market_snapshot, get_footprint, get_derivatives)
        BTC 59,197, 1.3σ above session VWAP and above value (VAH 59,110). Buyers took
        76% of the last 5m; an iceberg offer at 59,098 absorbed the push before it broke.
        OI flat, funding +0.003%/8h, 10/10 venues live.
```

## Quick start

Node.js 20 or newer is required. Pick your agent and paste one command or config block.

### Claude Code

```bash
claude mcp add orderflow -- npx -y github:zadescoxp/order-flow-mcp
```

### Codex CLI

```bash
codex mcp add orderflow -- npx -y github:zadescoxp/order-flow-mcp
```

Or add it to `~/.codex/config.toml`:

```toml
[mcp_servers.orderflow]
command = "npx"
args = ["-y", "github:zadescoxp/order-flow-mcp"]
startup_timeout_sec = 60   # the first run installs the package
```

### Cursor, Claude Desktop, Windsurf, Gemini CLI, Cline and others

Add this to the client's MCP config. The file is `~/.cursor/mcp.json` for Cursor and
`claude_desktop_config.json` for Claude Desktop (Settings → Developer → Edit Config). Windsurf uses
`~/.codeium/windsurf/mcp_config.json` and Gemini CLI uses `~/.gemini/settings.json`.

```json
{
  "mcpServers": {
    "orderflow": {
      "command": "npx",
      "args": ["-y", "github:zadescoxp/order-flow-mcp"]
    }
  }
}
```

### VS Code (Copilot agent mode)

`.vscode/mcp.json`:

```json
{
  "servers": {
    "orderflow": { "type": "stdio", "command": "npx", "args": ["-y", "github:zadescoxp/order-flow-mcp"] }
  }
}
```

> **Faster startup:** the first `npx` run downloads the package, which can take 20–40 s. To skip that, install
> it once with `npm install -g github:zadescoxp/order-flow-mcp` and use `order-flow-mcp` as the command (no args).

### Remote / shared server (HTTP)

To run one server that several agents or machines share:

```bash
npx -y github:zadescoxp/order-flow-mcp --http --port 3333 --host 0.0.0.0 --token "$SECRET"
# or: docker build -t order-flow-mcp . && docker run -p 3333:3333 -e ORDERFLOW_HTTP_TOKEN=$SECRET order-flow-mcp
```

Then connect a client:

```bash
claude mcp add --transport http orderflow http://your-host:3333/mcp --header "Authorization: Bearer $SECRET"
```

`GET /health` reports the server version and the markets being streamed.

### From source

```bash
git clone https://github.com/zadescoxp/order-flow-mcp && cd order-flow-mcp
npm install && npm run build
claude mcp add orderflow -- node "$PWD/dist/index.js"
```

The repo also ships a `.mcp.json`, so Claude Code picks the server up automatically inside the clone.

## Check that it works

Ask your agent: *"Use orderflow to get a market snapshot for BTC."* You can also exercise every tool against the
live exchanges with the bundled smoke test, or browse the tools in the MCP Inspector:

```bash
npm run smoke            # BTC across all perp venues
node scripts/smoke.mjs ETH bybit
npm run inspect          # MCP Inspector UI
```

## Tools

| Tool | What it returns |
| --- | --- |
| `get_market_snapshot` | **Start here.** Price and spread, session OHLC, VWAP and σ distance, buy/sell volume and delta over 1m/5m/15m, volume z-score, realized volatility, POC/VAH/VAL, book imbalance and depth bands, OI and its regime, funding, basis, liquidations, block prints, absorption/iceberg events, plain-language **signals**, and the status of each venue |
| `get_footprint` | Footprint candles (1m–4h) with bid × ask volume per price row, delta, CVD, POC, VWAP, imbalance flags and stacked imbalances |
| `get_volume_profile` | Session volume at price: POC, value area (any %), high-volume nodes, buy/sell per row |
| `get_order_book` | Aggregated book with cumulative size, depth within 0.1–2 % of mid, large walls, and the top of book on each venue |
| `get_flow_series` | Time bars (1 s–1 h) with OHLC, buy/sell volume, delta, **CVD**, trade count and volume z-score, plus realized volatility |
| `get_trades` | Time & sales, filterable by notional, side and venue |
| `get_big_trades` | Block / whale prints at least N× the average print size |
| `get_derivatives` | Open interest, funding (native, 8h-normalized and annualized) and basis per venue, OI change over 1/5/15/60m with the **price × OI regime** (new longs, short covering, new shorts, long unwind) |
| `get_liquidations` | Long vs short liquidations, per-minute buckets, the largest liquidation and a cascade flag |
| `get_microstructure_events` | **Absorption** (passive side holds against aggressive flow) and **iceberg** (hidden size refilling) detections |
| `get_venue_comparison` | Each venue's price premium, volume share and delta, and which exchange leads price (in ms) |
| `get_liquidity_heatmap` | Resting depth over time within ±1 % of mid, with persistent walls marked pulled, added or held |
| `scan_markets` | Screener: rank up to 15 symbols by volume z-score, delta, buy %, VWAP stretch, OI change, liquidations… |
| `watch_markets` / `unwatch_market` / `list_active_markets` | Keep markets streaming in the background so history builds up |
| `list_markets` | The 120+ supported assets, which venues list each one, FX pairs and timeframes |

There is also an `analyze_order_flow` prompt (a slash command in clients that support MCP prompts).

Every market tool takes `symbol` (`"BTC"`, `"eth"`, `"SOL-PERP"`, `"DOGEUSDT"`…), plus optional `venue`
(default `"all"`, or one of `binance`, `bybit`, `okx`, `bitget`, `hyperliquid`, `deribit`, `coinbase`, `gate`,
`kucoin`, `kraken`, `htx`) and `market_type` (`perp` by default, `spot`, or `forex`).

### Coverage

| | Venues |
| --- | --- |
| Perpetuals | Binance, Bybit, OKX, Bitget, Hyperliquid, Deribit, Gate, KuCoin, Kraken, HTX |
| Spot | Binance, Coinbase, OKX, Bybit, Bitget, Gate, KuCoin, Kraken, HTX |
| Also | Gold and silver (XAU/XAG) perpetuals, and 20 FX pairs (set `FINNHUB_API_KEY`) |

## How it works

```text
Exchange WebSockets (Siebly SDKs)
  → venue adapters → normalized trades / books / OI / funding / liquidations
  → order-flow engine (footprint, profile, CVD, VWAP, absorption, icebergs, venue lead/lag)
  → per-market in-memory session  →  MCP tools (compact JSON)  →  your agent
```

The engine is the Order Flow Screener's own code (`src/lib`), running headless in Node. A market starts
streaming the first time a tool asks for it. Its sockets are shared and it keeps running while it is
being used. If nothing asks for it for 30 minutes it closes, unless you pinned it with `watch_markets`.

**The data is live and the history is short.** All statistics cover only the time since the server started
streaming that market. Each response includes `stream_age_s`, and `warming_up` is true for the first minute.
For an agent that should reason over the last hour, start the market early with `--watch BTC,ETH,SOL` or with
`watch_markets`. The engine keeps about 8 h of 1-minute footprint candles, 2 h of 1-second flow bars, 2 h of
depth snapshots and the last 20,000 prints per market.

Responses are compact JSON, and tables use `columns` + `rows`, so even large footprints stay small in
the agent's context.

## Configuration

| Flag | Env | Default | |
| --- | --- | --- | --- |
| `--http` | `ORDERFLOW_TRANSPORT=http` | stdio | Serve Streamable HTTP at `/mcp` |
| `--port` | `PORT` | `3333` | HTTP port |
| `--host` | `ORDERFLOW_HOST` | `127.0.0.1` | HTTP bind address |
| `--token` | `ORDERFLOW_HTTP_TOKEN` | – | Require `Authorization: Bearer <token>` |
| `--watch BTC,ETH` | `ORDERFLOW_WATCH` | – | Start and pin markets at boot |
| `--idle-minutes` | `ORDERFLOW_IDLE_MINUTES` | `30` | Close unpinned markets after this much idle time |
| `--max-markets` | `ORDERFLOW_MAX_MARKETS` | `20` | Upper bound on concurrent markets |
| | `HTTPS_PROXY` / `ORDERFLOW_PROXY` | – | Send exchange WebSockets and REST calls through an HTTP(S) proxy |
| | `FINNHUB_API_KEY` | – | Turn on the FX pairs |

To pass env vars from a client config, add `"env": { "ORDERFLOW_WATCH": "BTC,ETH" }` next to `command`.

## Notes

- Some exchanges geo-block certain regions. For example, Binance refuses US IP addresses. A blocked venue
  shows `status: "connecting"` or `"error"` in `connections`, and the other venues keep working. To skip one,
  pass a specific `venue`.
- Venues quote in USDT, USDC or USD, so an aggregated book can overlap by a few basis points at the touch
  (`cross_venue_crossed: true`). The reported `mid` and `spread_bps` are medians of each venue's own quote.
- This server is for market analysis only. It cannot place orders, and nothing it returns is financial advice.

## Development

```bash
npm install
npm run dev          # run from source (tsx)
npm test             # offline unit tests (synthetic trades through the real engine)
npm run typecheck
npm run build        # bundles to dist/index.js (committed so `npx github:` needs no build step)
npm run smoke        # live end-to-end test of every tool
```

## License

Apache-2.0. The order-flow engine and exchange adapters come from
[order-flow-screener](https://github.com/zadescoxp/order-flow-screener). Market data is sourced through the
[Siebly](https://siebly.io) exchange SDKs.
