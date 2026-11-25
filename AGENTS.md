# Working on order-flow-mcp

- `src/lib/` is the order-flow engine and exchange adapters vendored from
  [order-flow-screener](https://github.com/zadescoxp/order-flow-screener). Node-specific changes made here:
  `net.ts` (HTTPS_PROXY + global WebSocket), KuCoin/HTX REST called directly instead of through the app's
  CORS routes, forex (Finnhub) removed so the server is crypto-only, the vanilla zustand store, `lastDataAt`/`getBooks()`/`getDepthSides()`/
  `tickSize` on the manager, HTX on its standard (non-AWS) hosts, one-line SDK error logs.
  Keep other engine changes upstream-compatible so fixes can be synced both ways.
- `src/market.ts`: `LiveMarket` (one per symbol × market type × venue selection, built at 1m; higher
  timeframes are merged on demand) and `MarketHub` (lazy start, idle close, pinning).
- `src/views.ts`: engine state → compact JSON. Tables are `{ columns, rows }`.
- `src/server.ts`: tool definitions. `src/index.ts`: CLI, stdio and Streamable HTTP transports.
- stdout belongs to the stdio protocol: never write to it (console.log is redirected to stderr).
- `npm test` runs offline through the engine's replay path; `npm run smoke` hits the real exchanges.
- `dist/` is committed so `npx github:zadescoxp/order-flow-mcp` works without a build. Run `npm run build`
  before committing source changes; CI fails if `dist/` is stale.
