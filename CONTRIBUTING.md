# Contributing to order-flow-mcp

Thanks for helping. New exchanges, new tools, sharper signals, bug fixes and better docs are all welcome.

## Quick start

```bash
git clone https://github.com/zadescoxp/order-flow-mcp && cd order-flow-mcp
npm install
npm test             # offline tests (no network needed)
npm run dev          # run the server from source
npm run smoke        # call every tool against the live exchanges
```

Node.js 20 or newer is required.

## Where things live

| Path | What it is |
| --- | --- |
| `src/server.ts` | MCP tool definitions: names, descriptions, arguments |
| `src/views.ts` | Turns engine state into the compact JSON agents receive |
| `src/market.ts` | Live markets and the hub that starts, shares and keeps them |
| `src/resolve.ts` | Symbol and venue parsing (`"btc"`, `"ETH-PERP"`, `"bybit"`) |
| `src/index.ts` | CLI flags, stdio and HTTP transports |
| `src/lib/` | Order-flow engine and exchange adapters shared with [order-flow-screener](https://github.com/zadescoxp/order-flow-screener) |
| `site/` | The project website (plain HTML, CSS and JS) |

`AGENTS.md` has more detail on the engine code and how it differs from the screener.

## Making a change

1. **Open an issue first** for anything bigger than a small fix, so we can agree on the approach.
2. **Branch** from `main`.
3. **Commit in small steps**, one file per commit where practical, with a message that says what changed and why.
4. **Run the checks:** `npm run typecheck && npm test && npm run build`.
5. **Commit `dist/`** after `npm run build`. It is checked in so `npx github:zadescoxp/order-flow-mcp` works without a build step, and CI fails if it is stale.
6. **Open a pull request** describing what changed and how you tested it. For a new tool or exchange, paste a sample response.

## Guidelines

- **Never write to stdout** in server code. It carries the MCP protocol, so log with `console.error`.
- **Keep responses compact.** Tables are `{ columns, rows }`, numbers are rounded, and headline dollar amounts read like `"$1.87B"`.
- **Describe tools for agents.** Say what the tool returns and when to use it, in plain words.
- **Keep engine changes upstream-friendly.** Changes in `src/lib/` should also make sense in the screener.
- **Add a test** for logic changes. Tests in `test/` run offline through the engine's replay path.

## Website

The site is static: open `site/index.html` in a browser, or serve it with `npx serve site`. It deploys to Vercel ([mcp.order-flow.zadescoxp.com](https://mcp.order-flow.zadescoxp.com)) from `main`; `vercel.json` serves `site/` as-is with no build step.

## License

By contributing you agree that your contributions are licensed under the [Apache-2.0 License](LICENSE).
