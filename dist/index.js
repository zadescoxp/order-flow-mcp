#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/net.ts
var net_exports = {};
__export(net_exports, {
  NodeWebSocket: () => NodeWebSocket,
  installNetworking: () => installNetworking,
  proxyAgent: () => proxyAgent,
  proxyUrl: () => proxyUrl,
  sieblyNet: () => sieblyNet
});
import { HttpsProxyAgent } from "https-proxy-agent";
import WebSocketImpl from "ws";
function proxyAgent() {
  if (!proxyUrl) return void 0;
  agent ??= new HttpsProxyAgent(proxyUrl);
  return agent;
}
function sieblyNet() {
  const a = proxyAgent();
  return a ? { wsOptions: { agent: a } } : {};
}
async function installNetworking() {
  globalThis.WebSocket = NodeWebSocket;
  if (proxyUrl) {
    const { EnvHttpProxyAgent, setGlobalDispatcher } = await import("undici");
    setGlobalDispatcher(new EnvHttpProxyAgent());
  }
}
var env, proxyUrl, agent, NodeWebSocket;
var init_net = __esm({
  "src/lib/net.ts"() {
    "use strict";
    env = process.env;
    proxyUrl = env.ORDERFLOW_PROXY || env.HTTPS_PROXY || env.https_proxy || env.HTTP_PROXY || env.http_proxy || void 0;
    NodeWebSocket = class extends WebSocketImpl {
      constructor(url, protocols, options2) {
        const a = proxyAgent();
        super(url, protocols, a ? { agent: a, ...options2 } : options2);
      }
    };
  }
});

// src/lib/config/coinListings.ts
var COIN_LISTINGS;
var init_coinListings = __esm({
  "src/lib/config/coinListings.ts"() {
    "use strict";
    COIN_LISTINGS = [
      { base: "BTC", name: "Bitcoin", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "deribit", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "ETH", name: "Ethereum", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "deribit", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "ZEC", name: "Zcash", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "SOL", name: "Solana", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "XRP", name: "XRP", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "INIT", name: "Initia", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures"], spot: ["binance-spot", "bybit-spot"], logo: false },
      { base: "HYPE", name: "Hyperliquid", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "NEAR", name: "NEAR Protocol", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "JCT", name: "Janction", perp: ["binance-futures", "bybit-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: [], logo: false },
      { base: "DOGE", name: "Dogecoin", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "PEPE", name: "Pepe", perp: [], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "UNI", name: "Uniswap", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "BNB", name: "BNB", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "ENA", name: "Ethena", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "ONE", name: "Harmony", perp: ["binance-futures", "okx-futures", "bitget-futures"], spot: ["binance-spot", "okx-spot", "htx-spot"], logo: true },
      { base: "SUI", name: "Sui", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "AVAX", name: "Avalanche", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "LINK", name: "Chainlink", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "WLD", name: "Worldcoin", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: false },
      { base: "ARB", name: "Arbitrum", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "PUMP", name: "Pump.fun", perp: ["binance-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: false },
      { base: "ADA", name: "Cardano", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "PIEVERSE", name: "Pieverse", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: [], logo: false },
      { base: "LIT", name: "Lighter", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures"], spot: ["bybit-spot", "okx-spot", "bitget-spot", "gate-spot", "kucoin-spot", "htx-spot"], logo: true },
      { base: "AAVE", name: "Aave", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "AKE", name: "Akedo", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures", "htx-futures"], spot: [], logo: false },
      { base: "INJ", name: "Injective", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: false },
      { base: "ARIA", name: "Aria.AI", perp: ["binance-futures", "bybit-futures", "bitget-futures"], spot: [], logo: false },
      { base: "TRUMP", name: "Official Trump", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "ONDO", name: "Ondo", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "CAP", name: "Cap", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: ["bybit-spot", "coinbase-spot"], logo: true },
      { base: "TAO", name: "Bittensor", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures"], spot: ["binance-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "CYBER", name: "CYBER", perp: ["binance-futures", "bybit-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "bitget-spot"], logo: true },
      { base: "GRAM", name: "Gram", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "bitget-spot", "gate-spot", "kucoin-spot"], logo: true },
      { base: "XMR", name: "Monero", perp: ["binance-futures", "bybit-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "kraken-futures"], spot: [], logo: true },
      { base: "BCH", name: "Bitcoin Cash", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "LTC", name: "Litecoin", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures", "htx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "FIL", name: "Filecoin", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "okx-spot", "coinbase-spot", "gate-spot", "kucoin-spot", "htx-spot"], logo: true },
      { base: "BTW", name: "Bitway", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures"], spot: [], logo: false },
      { base: "QNT", name: "Quant", perp: ["binance-futures", "bybit-futures", "bitget-futures"], spot: ["binance-spot", "bybit-spot", "coinbase-spot", "bitget-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "VVV", name: "Venice Token", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures"], spot: ["bybit-spot", "okx-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "TRX", name: "TRON", perp: ["binance-futures", "bybit-futures", "okx-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "XLM", name: "Stellar", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "ERA", name: "Caldera", perp: ["binance-futures", "bybit-futures", "bitget-futures"], spot: ["binance-spot", "bybit-spot"], logo: false },
      { base: "ZRO", name: "LayerZero", perp: ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "gate-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: false },
      { base: "DOT", name: "Polkadot", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "DASH", name: "Dash", perp: ["binance-futures", "bybit-futures", "okx-futures", "kucoin-futures"], spot: ["binance-spot", "okx-spot", "coinbase-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "ICP", name: "Internet Computer", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "PONS", name: "Pons", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid"], spot: ["bybit-spot", "okx-spot", "coinbase-spot", "bitget-spot", "gate-spot", "kucoin-spot"], logo: false },
      { base: "APT", name: "Aptos", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "kucoin-spot"], logo: true },
      { base: "HBAR", name: "Hedera", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "ASTER", name: "Aster", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: false },
      { base: "ETHFI", name: "Ether.fi", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid"], spot: ["binance-spot", "bybit-spot", "okx-spot"], logo: false },
      { base: "PENGU", name: "Pudgy Penguins", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "kucoin-spot"], logo: false },
      { base: "XPL", name: "Plasma", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid"], spot: ["binance-spot", "bybit-spot", "okx-spot", "gate-spot", "kraken-spot"], logo: false },
      { base: "USELESS", name: "Useless Coin", perp: ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "kucoin-futures"], spot: [], logo: false },
      { base: "AERO", name: "Aerodrome Finance", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid"], spot: ["binance-spot", "coinbase-spot", "bitget-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "UAI", name: "UnifAI Network", perp: ["binance-futures", "bybit-futures", "bitget-futures"], spot: [], logo: false },
      { base: "MERL", name: "Merlin Chain", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: ["bybit-spot", "okx-spot", "htx-spot"], logo: false },
      { base: "STRK", name: "Starknet", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot"], logo: true },
      { base: "OP", name: "Optimism", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot"], logo: true },
      { base: "WLFI", name: "World Liberty Financial", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid"], spot: ["binance-spot", "bybit-spot", "okx-spot", "gate-spot"], logo: false },
      { base: "TIA", name: "Celestia", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "htx-spot"], logo: true },
      { base: "CRV", name: "Curve DAO", perp: ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "JUP", name: "Jupiter", perp: ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "FET", name: "Artificial Superintelligence Alliance", perp: ["binance-futures", "okx-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "SOPH", name: "Sophon", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: ["binance-spot", "okx-spot"], logo: true },
      { base: "FARTCOIN", name: "Fartcoin", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "hyperliquid", "gate-futures", "kucoin-futures"], spot: [], logo: false },
      { base: "PARTI", name: "Particle Network", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot"], logo: false },
      { base: "EDGE", name: "edgeX", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["bybit-spot", "okx-spot", "bitget-spot"], logo: true },
      { base: "RENDER", name: "Render", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "kraken-spot"], logo: false },
      { base: "PYTH", name: "Pyth Network", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "gate-spot"], logo: true },
      { base: "ICNT", name: "Impossible Cloud Network Token", perp: ["binance-futures", "bybit-futures", "bitget-futures", "gate-futures", "kucoin-futures"], spot: [], logo: false },
      { base: "ACT", name: "Act I: The AI Prophecy", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["binance-spot", "okx-spot"], logo: true },
      { base: "MEGA", name: "MegaETH", perp: ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "gate-spot"], logo: false },
      { base: "ATOM", name: "Cosmos Hub", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "kucoin-spot"], logo: true },
      { base: "HUMA", name: "Huma Finance", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: [], logo: false },
      { base: "BMT", name: "Bubblemaps", perp: [], spot: ["binance-spot", "bybit-spot", "gate-spot"], logo: false },
      { base: "NIGHT", name: "Midnight", perp: ["binance-futures", "bybit-futures", "okx-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "gate-spot", "kucoin-spot", "kraken-spot"], logo: false },
      { base: "CT", name: "Concrete", perp: ["binance-futures", "bybit-futures", "okx-futures", "kucoin-futures"], spot: [], logo: false },
      { base: "ETC", name: "Ethereum Classic", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["binance-spot", "okx-spot"], logo: true },
      { base: "SAND", name: "The Sandbox", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: [], logo: true },
      { base: "MON", name: "Monad", perp: ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid"], spot: ["bybit-spot", "okx-spot", "coinbase-spot", "kraken-spot"], logo: false },
      { base: "GRASS", name: "Grass", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["bybit-spot", "okx-spot", "gate-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "POL", name: "POL (ex-MATIC)", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "WIF", name: "dogwifhat", perp: ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "kucoin-spot"], logo: false },
      { base: "MET", name: "Meteora", perp: ["binance-futures", "bybit-futures", "okx-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot"], logo: true },
      { base: "VIRTUAL", name: "Virtuals Protocol", perp: ["binance-futures", "bybit-futures", "okx-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "htx-spot"], logo: false },
      { base: "CHIP", name: "Chip", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot"], logo: false },
      { base: "RSR", name: "Reserve Rights", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["binance-spot", "okx-spot"], logo: true },
      { base: "STX", name: "Stacks", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot"], logo: true },
      { base: "ARX", name: "Arcium", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: [], logo: false },
      { base: "IRYS", name: "Irys", perp: ["binance-futures", "bybit-futures", "okx-futures", "gate-futures", "kucoin-futures"], spot: [], logo: false },
      { base: "MAGMA", name: "Magma Finance", perp: ["binance-futures", "bybit-futures", "bitget-futures"], spot: [], logo: false },
      { base: "CASHCAT", name: "Cash Cat", perp: ["bybit-futures", "okx-futures", "hyperliquid"], spot: [], logo: false },
      { base: "SHIB", name: "Shiba Inu", perp: [], spot: ["binance-spot", "bybit-spot", "okx-spot", "kucoin-spot", "kraken-spot"], logo: true },
      { base: "LDO", name: "Lido DAO", perp: ["binance-futures", "bybit-futures", "okx-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot"], logo: true },
      { base: "ALGO", name: "Algorand", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot", "kraken-spot", "htx-spot"], logo: true },
      { base: "AR", name: "Arweave", perp: ["binance-futures", "bybit-futures", "okx-futures"], spot: [], logo: true },
      { base: "APR", name: "aPriori", perp: ["binance-futures", "okx-futures", "bitget-futures"], spot: [], logo: false },
      { base: "JTO", name: "Jito", perp: [], spot: ["binance-spot", "bybit-spot", "okx-spot", "coinbase-spot"], logo: false },
      { base: "CC", name: "Canton", perp: [], spot: ["bybit-spot", "okx-spot", "kraken-spot"], logo: false },
      { base: "BSB", name: "Block Street", perp: ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"], spot: [], logo: false },
      { base: "BARD", name: "Lombard", perp: ["binance-futures", "bybit-futures", "okx-futures", "gate-futures", "kucoin-futures"], spot: ["binance-spot", "bybit-spot", "okx-spot"], logo: false },
      { base: "NXPC", name: "Nexpace", perp: [], spot: ["binance-spot", "bybit-spot"], logo: false },
      { base: "ORDI", name: "ORDI", perp: [], spot: ["binance-spot", "okx-spot", "htx-spot"], logo: true },
      { base: "PENDLE", name: "Pendle", perp: [], spot: ["binance-spot", "okx-spot", "htx-spot"], logo: true },
      { base: "CHZ", name: "Chiliz", perp: [], spot: ["binance-spot", "bybit-spot"], logo: true },
      { base: "ZEN", name: "Horizen", perp: [], spot: ["binance-spot", "bybit-spot", "htx-spot"], logo: true },
      { base: "EIGEN", name: "EigenCloud (prev. EigenLayer)", perp: [], spot: ["binance-spot", "bybit-spot"], logo: false },
      { base: "APE", name: "ApeCoin", perp: [], spot: ["binance-spot", "bybit-spot", "htx-spot"], logo: true },
      { base: "DATA", name: "Streamr", perp: [], spot: ["bybit-spot", "okx-spot"], logo: true },
      { base: "MORPHO", name: "Morpho", perp: [], spot: ["binance-spot", "okx-spot", "coinbase-spot"], logo: false },
      { base: "RAY", name: "Raydium", perp: [], spot: ["binance-spot", "okx-spot", "coinbase-spot", "htx-spot"], logo: true },
      { base: "BONK", name: "Bonk", perp: [], spot: ["binance-spot", "bybit-spot", "okx-spot", "gate-spot", "kucoin-spot", "htx-spot"], logo: false },
      { base: "SKY", name: "Sky", perp: [], spot: ["binance-spot", "bybit-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"], logo: false },
      { base: "CFG", name: "Centrifuge", perp: [], spot: ["binance-spot", "bybit-spot"], logo: true },
      { base: "ATH", name: "Aethir", perp: [], spot: ["bybit-spot", "okx-spot"], logo: true },
      { base: "KAIA", name: "Kaia", perp: [], spot: ["binance-spot", "bybit-spot"], logo: false },
      { base: "DEGEN", name: "Degen", perp: [], spot: ["bybit-spot", "okx-spot", "coinbase-spot"], logo: true },
      { base: "NFT", name: "APENFT", perp: [], spot: ["bybit-spot", "okx-spot", "htx-spot"], logo: false },
      { base: "FLR", name: "Flare", perp: [], spot: ["bybit-spot", "coinbase-spot"], logo: true }
    ];
  }
});

// src/lib/config/instruments.ts
function colorFor(base) {
  if (BRAND_COLORS[base]) return BRAND_COLORS[base];
  let h = 0;
  for (const ch of base) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h} 55% 42%)`;
}
function baseOf(symbol) {
  if (symbol.includes("/")) return symbol.split("/")[0].toUpperCase();
  return symbol.toUpperCase().replace(/(USDT|USDC|USD)$/, "");
}
function assetFor(symbol) {
  return BY_BASE.get(baseOf(symbol));
}
function venuesWithData(symbol, marketType) {
  const asset = assetFor(symbol);
  if (!asset || symbol.toUpperCase() !== `${asset.base}USDT`) return [];
  if (marketType === "perpetual") return asset.perp;
  if (marketType === "spot") return asset.spot;
  return [];
}
var BRAND_COLORS, COINS, METAL_VENUES, METALS, ALL_ASSETS, CRYPTO_SYMBOLS, PERP_SYMBOLS, SPOT_SYMBOLS, BY_BASE;
var init_instruments = __esm({
  "src/lib/config/instruments.ts"() {
    "use strict";
    init_coinListings();
    BRAND_COLORS = {
      BTC: "#F7931A",
      ETH: "#627EEA",
      XRP: "#23292F",
      BNB: "#F3BA2F",
      SOL: "#9945FF",
      DOGE: "#C2A633",
      TRX: "#FF060A",
      ADA: "#0033AD",
      HYPE: "#97FCE4",
      LINK: "#2A5ADA",
      SUI: "#4DA2FF",
      AVAX: "#E84142",
      BCH: "#8DC351",
      LTC: "#345D9D",
      DOT: "#E6007A",
      UNI: "#FF007A",
      NEAR: "#00C08B",
      APT: "#2ED8A7",
      AAVE: "#B6509E",
      ETC: "#328332",
      ENA: "#7C7C7C",
      ATOM: "#6F7390",
      ARB: "#28A0F0",
      OP: "#FF0420",
      INJ: "#0082FA",
      FIL: "#0090FF",
      SEI: "#9E1F19",
      TIA: "#7B2BF9",
      WIF: "#C69C6D",
      PEPE: "#3D9A3A",
      ZEC: "#ECB244",
      XMR: "#FF6600",
      XLM: "#14B6E7",
      TON: "#0098EA",
      SHIB: "#E42D04",
      BONK: "#F8A10B",
      TAO: "#2B2B2B",
      WLD: "#1B1B1B",
      ONDO: "#1A44C4",
      HBAR: "#3A3A3A",
      ICP: "#29ABE2",
      TRUMP: "#C9A13B"
    };
    COINS = COIN_LISTINGS.map((c) => ({
      base: c.base,
      name: c.name,
      color: colorFor(c.base),
      logo: c.logo,
      kind: "coin",
      perp: c.perp,
      spot: c.spot
    }));
    METAL_VENUES = ["binance-futures", "bybit-futures", "okx-futures", "bitget-futures"];
    METALS = [
      { base: "XAU", name: "Gold", color: "#C9A227", logo: false, kind: "metal", perp: METAL_VENUES, spot: [] },
      { base: "XAG", name: "Silver", color: "#9AA3AD", logo: false, kind: "metal", perp: METAL_VENUES, spot: [] }
    ];
    ALL_ASSETS = [...METALS, ...COINS];
    CRYPTO_SYMBOLS = ALL_ASSETS.map((asset) => `${asset.base}USDT`);
    PERP_SYMBOLS = ALL_ASSETS.filter((a) => a.perp.length > 0).map((a) => `${a.base}USDT`);
    SPOT_SYMBOLS = ALL_ASSETS.filter((a) => a.spot.length > 0).map((a) => `${a.base}USDT`);
    BY_BASE = new Map(ALL_ASSETS.map((asset) => [asset.base, asset]));
  }
});

// src/lib/adapters/capabilities.ts
function venueSupports(venue, symbol, marketType) {
  return venuesWithData(symbol, marketType).includes(venue);
}
function venuesForSelection(selection, marketType, symbol) {
  const venues = marketType === "perpetual" ? PERP_VENUES : SPOT_VENUES;
  if (selection !== "all-perps" && selection !== "all-spot") return [selection];
  return venues.filter((venue) => venueSupports(venue, symbol, marketType));
}
function venueBrandOf(venue) {
  return venue.replace(/-(futures|spot)$/, "");
}
function venueForMarket(venue, marketType) {
  const brand = venueBrandOf(venue);
  return (marketType === "perpetual" ? PERP_VENUES : SPOT_VENUES).find((v) => venueBrandOf(v) === brand);
}
var PERP_VENUES, SPOT_VENUES;
var init_capabilities = __esm({
  "src/lib/adapters/capabilities.ts"() {
    "use strict";
    init_instruments();
    PERP_VENUES = ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "bitget-futures", "deribit", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"];
    SPOT_VENUES = ["binance-spot", "coinbase-spot", "okx-spot", "bybit-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"];
  }
});

// src/lib/adapters/base.ts
import { EventEmitter } from "events";
function num(value) {
  if (value === null || value === void 0 || value === "") return void 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : void 0;
}
var BaseExchangeAdapter;
var init_base = __esm({
  "src/lib/adapters/base.ts"() {
    "use strict";
    BaseExchangeAdapter = class extends EventEmitter {
      ws = null;
      reconnectAttempts = 0;
      maxReconnectAttempts = 20;
      reconnectDelay = 1e3;
      pingInterval = null;
      reconnectTimer = null;
      lastHeartbeat = 0;
      staleThresholdMs = 3e4;
      symbol;
      status = "connecting";
      errorMessage;
      stateFlag;
      intentionallyOffline = false;
      /** Full in-memory book (price → size). Adapters with incremental books maintain these. */
      bids = /* @__PURE__ */ new Map();
      asks = /* @__PURE__ */ new Map();
      constructor(symbol) {
        super();
        this.symbol = symbol;
      }
      connect() {
        this.intentionallyOffline = false;
        this.clearReconnectTimer();
        this.stopPingInterval();
        this.setStatus("connecting");
        const ws = new WebSocket(this.buildWsUrl());
        this.ws = ws;
        ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.lastHeartbeat = Date.now();
          this.errorMessage = void 0;
          this.stateFlag = void 0;
          this.setStatus("live");
          this.startPingInterval();
          this.subscribe();
        };
        ws.onmessage = (event) => {
          this.lastHeartbeat = Date.now();
          if (this.status !== "live") this.setStatus("live");
          try {
            this.handleMessage(JSON.parse(event.data));
          } catch (error) {
            this.reportError(
              `Unable to parse ${this.venue} message: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        };
        ws.onerror = () => this.reportError(`${this.venue} WebSocket error`);
        ws.onclose = () => {
          this.stopPingInterval();
          this.ws = null;
          if (!this.intentionallyOffline) {
            this.setStatus("connecting");
            this.reconnect();
          }
        };
      }
      disconnect() {
        this.intentionallyOffline = true;
        this.clearReconnectTimer();
        this.stopPingInterval();
        this.setStatus("offline");
        this.ws?.close();
        this.ws = null;
      }
      subscribe() {
        throw new Error(`${this.venue} adapter does not implement subscribe()`);
      }
      reconnect() {
        if (this.intentionallyOffline || this.reconnectTimer) return;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.setStatus("offline");
          return;
        }
        const delay = Math.min(
          this.reconnectDelay * 2 ** this.reconnectAttempts,
          3e4
        );
        this.reconnectAttempts++;
        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          this.connect();
        }, delay);
      }
      setStatus(s) {
        this.status = s;
        const conn = {
          venue: this.venue,
          status: s,
          lastHeartbeat: this.lastHeartbeat,
          reconnectAttempts: this.reconnectAttempts,
          error: this.errorMessage,
          stateFlag: this.stateFlag
        };
        this.emit("status", conn);
      }
      reportError(message, stateFlag) {
        this.errorMessage = message;
        this.stateFlag = stateFlag;
        this.setStatus("error");
      }
      requestResubscribe() {
        this.setStatus("stale");
        this.ws?.close();
      }
      startPingInterval(intervalMs = 1e4) {
        this.stopPingInterval();
        this.pingInterval = setInterval(() => {
          if (Date.now() - this.lastHeartbeat > this.staleThresholdMs) {
            this.setStatus("stale");
            this.ws?.close();
            return;
          }
          this.sendPing();
        }, intervalMs);
      }
      stopPingInterval() {
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
      clearReconnectTimer() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      emitTrade(trade) {
        if (!Number.isFinite(trade.timestamp) || !Number.isFinite(trade.price) || trade.price <= 0 || !Number.isFinite(trade.quantity) || trade.quantity <= 0) {
          this.reportError(`Invalid ${this.venue} trade payload`);
          return;
        }
        this.emit("trade", trade);
      }
      emitOrderBook(book) {
        const isValidLevel = (level) => Number.isFinite(level.price) && level.price > 0 && Number.isFinite(level.size) && level.size > 0;
        const bids = book.bids.filter(isValidLevel);
        const asks = book.asks.filter(isValidLevel);
        if (bids.length === 0 && asks.length === 0) {
          this.reportError(`Invalid ${this.venue} order book payload`);
          return;
        }
        if (bids.length === 0 || asks.length === 0) return;
        this.emit("orderbook", { ...book, bids, asks });
      }
      emitLiquidation(liquidation) {
        const { price, quantity, timestamp } = liquidation;
        if (!(price > 0) || !(quantity > 0) || !Number.isFinite(timestamp)) return;
        this.emit("liquidation", {
          ...liquidation,
          venue: this.venue,
          localTimestamp: Date.now(),
          quoteVolume: price * quantity
        });
      }
      /** Emit a partial derivatives update; fields that failed to parse are dropped. */
      emitDerivatives(update) {
        const clean = { venue: this.venue, timestamp: update.timestamp ?? Date.now() };
        let any = false;
        for (const key2 of ["openInterest", "fundingRate", "fundingIntervalHours", "nextFundingTime", "markPrice", "indexPrice"]) {
          const value = update[key2];
          if (value === void 0 || !Number.isFinite(value)) continue;
          if (key2 !== "fundingRate" && value <= 0) continue;
          clean[key2] = value;
          any = true;
        }
        if (any) this.emit("derivatives", clean);
      }
      /**
       * The deepest book this adapter holds, for the resting-liquidity heatmap.
       * Emitted books are capped for the ladder; this is not. Null if empty.
       */
      depthSides() {
        return this.bids.size || this.asks.size ? { bids: this.bids, asks: this.asks } : null;
      }
      getStatus() {
        return {
          venue: this.venue,
          status: this.status,
          lastHeartbeat: this.lastHeartbeat,
          reconnectAttempts: this.reconnectAttempts,
          error: this.errorMessage,
          stateFlag: this.stateFlag
        };
      }
    };
  }
});

// src/lib/adapters/book.ts
function applyLevels(side, levels, multiplier) {
  for (const level of levels) {
    const price = parseFloat(level[0]);
    const qty = parseFloat(level[1]) * multiplier;
    if (!Number.isFinite(price)) continue;
    if (!(qty > 0)) side.delete(price);
    else side.set(price, qty);
  }
}
function parseBitgetTrades(data) {
  return data.map((t) => {
    if (Array.isArray(t)) {
      const [ts, price, size, side, tradeId] = t;
      return { ts, price, size, side, tradeId: tradeId ?? ts };
    }
    const o = t;
    return { ...o, tradeId: o.tradeId ?? o.ts };
  });
}
function emitBook(adapter, bidsMap, asksMap, emitFn) {
  const pending = pendingEmits.get(adapter);
  if (pending) {
    pending.args = [adapter, bidsMap, asksMap, emitFn];
    return;
  }
  const entry = {
    args: [adapter, bidsMap, asksMap, emitFn],
    timer: setTimeout(() => {
      pendingEmits.delete(adapter);
      const [a, b, s, fn] = entry.args;
      if (b.size || s.size) emitBookNow(a, b, s, fn);
    }, BOOK_EMIT_MS)
  };
  pendingEmits.set(adapter, entry);
}
function emitBookNow(adapter, bidsMap, asksMap, emitFn) {
  const bids = [...bidsMap.entries()].sort((a, b) => b[0] - a[0]).slice(0, BOOK_DEPTH).map(([price, size]) => ({ price, size, venue: adapter.venue }));
  const asks = [...asksMap.entries()].sort((a, b) => a[0] - b[0]).slice(0, BOOK_DEPTH).map(([price, size]) => ({ price, size, venue: adapter.venue }));
  emitFn({ venue: adapter.venue, symbol: adapter.symbol, timestamp: Date.now(), localTimestamp: Date.now(), bids, asks });
}
var BOOK_DEPTH, BOOK_EMIT_MS, pendingEmits;
var init_book = __esm({
  "src/lib/adapters/book.ts"() {
    "use strict";
    BOOK_DEPTH = 200;
    BOOK_EMIT_MS = 50;
    pendingEmits = /* @__PURE__ */ new WeakMap();
  }
});

// src/lib/adapters/siebly.ts
function quietLogger(tag) {
  return {
    trace: () => {
    },
    info: () => {
    },
    // One line per error: the SDKs attach whole socket objects as context.
    error: (message) => console.warn(`[${tag}]`, String(message).slice(0, 300))
  };
}
function disposeSieblyClient(client) {
  client.removeAllListeners();
  client.on("exception", () => {
  });
  const store = client.getWsStore();
  let checks = 0;
  const sweep = () => {
    const keys = store.getKeys();
    for (const key2 of keys) if (client.isConnected(key2)) client.close(key2, true);
    if (keys.length === 0 || ++checks > 120) clearInterval(timer);
  };
  const timer = setInterval(sweep, 250);
  sweep();
}
function exceptionMessage(err) {
  const e = err;
  const nested = e?.event;
  const text = e?.ret_msg ?? e?.msg ?? e?.message ?? nested?.msg ?? nested?.message ?? nested?.data ?? e?.data;
  return typeof text === "string" && text ? text : "WebSocket exception";
}
function swallow(result) {
  const items = Array.isArray(result) ? result : [result];
  for (const item of items) if (item instanceof Promise) item.catch(() => {
  });
}
var SieblyAdapter;
var init_siebly = __esm({
  "src/lib/adapters/siebly.ts"() {
    "use strict";
    init_base();
    SieblyAdapter = class extends BaseExchangeAdapter {
      events = { data: "update", reconnecting: "reconnect" };
      /** Shut a client down for good; classic clients need the sweep. */
      disposeClient(client) {
        disposeSieblyClient(client);
      }
      client = null;
      offline = false;
      generation = 0;
      watchdog = null;
      /** True until a book snapshot arrives; deltas before it would build a partial book. */
      awaitingSnapshot = true;
      /** Transport is owned by the SDK. */
      buildWsUrl() {
        return "";
      }
      /** The SDK sends pings and drops the socket when a pong is late. */
      sendPing() {
      }
      /** Async setup that must finish before subscribing (e.g. contract sizes). */
      async prepare() {
      }
      connect() {
        this.teardown();
        this.offline = false;
        this.resetBook();
        this.setStatus("connecting");
        const generation = ++this.generation;
        Promise.all([this.createClient(), this.prepare()]).then(([client]) => {
          if (generation !== this.generation || this.offline) {
            this.disposeClient(client);
            return;
          }
          this.client = client;
          this.wire(client);
          this.subscribeTopics(client, this.topics());
          this.watchdog = setInterval(() => this.checkStale(), 1e4);
        }).catch((error) => {
          if (generation !== this.generation) return;
          this.reportError(`${this.venue}: ${error instanceof Error ? error.message : String(error)}`);
        });
      }
      disconnect() {
        this.offline = true;
        this.generation++;
        this.teardown();
        this.setStatus("offline");
      }
      wire(client) {
        const on = client.on.bind(client);
        on(this.events.data, (msg) => {
          this.lastHeartbeat = Date.now();
          if (this.status !== "live") this.markLive();
          try {
            this.handleMessage(msg);
          } catch (error) {
            this.reportError(`Unable to parse ${this.venue} message: ${error instanceof Error ? error.message : String(error)}`);
          }
        });
        on("response", (res) => {
          const ack = this.ackOf(res);
          if (!ack) return;
          if (ack.ok) this.markLive();
          else this.reportError(`${this.venue} rejected subscription: ${ack.reason}`, "subscribe-rejected");
        });
        on(this.events.reconnecting, () => {
          if (this.offline) return;
          this.reconnectAttempts++;
          this.resetBook();
          this.setStatus("connecting");
        });
        on("close", () => {
          if (!this.offline) this.setStatus("connecting");
        });
        on("exception", (err) => {
          if (this.offline) return;
          this.reportError(`${this.venue}: ${exceptionMessage(err)}`);
        });
      }
      /** A sequence gap: drop the book and resubscribe for a fresh snapshot, keeping the socket. */
      requestResubscribe() {
        this.resetBook();
        this.setStatus("stale");
        this.resubscribe(this.bookTopics());
      }
      markLive() {
        this.reconnectAttempts = 0;
        this.lastHeartbeat = Date.now();
        this.errorMessage = void 0;
        this.stateFlag = void 0;
        if (this.status !== "live") this.setStatus("live");
      }
      /** The socket answers pings but no topic data has arrived for a while. */
      checkStale() {
        if (this.status !== "live" || Date.now() - this.lastHeartbeat <= this.staleThresholdMs) return;
        this.resetBook();
        this.setStatus("stale");
        this.resubscribe(this.topics());
      }
      resubscribe(topics) {
        const client = this.client;
        if (!client || topics.length === 0) return;
        swallow(this.unsubscribeTopics(client, topics));
        swallow(this.subscribeTopics(client, topics));
      }
      resetBook() {
        this.bids.clear();
        this.asks.clear();
        this.awaitingSnapshot = true;
        this.onBookReset();
      }
      /** Clear venue-specific book state (sequence numbers). */
      onBookReset() {
      }
      teardown() {
        if (this.watchdog) clearInterval(this.watchdog);
        this.watchdog = null;
        const client = this.client;
        this.client = null;
        if (client) this.disposeClient(client);
      }
    };
  }
});

// src/lib/adapters/bybit.ts
var BybitAdapter, BybitFuturesAdapter, BybitSpotAdapter;
var init_bybit = __esm({
  "src/lib/adapters/bybit.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    BybitAdapter = class extends SieblyAdapter {
      extraTopics() {
        return [];
      }
      lastSeq = 0;
      constructor(symbol) {
        super(symbol.toUpperCase());
      }
      async createClient() {
        const { WebsocketClient } = await import("bybit-api");
        return new WebsocketClient({ ...sieblyNet(), market: "v5", pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("bybit-api"));
      }
      get bookTopic() {
        return `orderbook.${this.bookTopicDepth}.${this.symbol}`;
      }
      topics() {
        return [`publicTrade.${this.symbol}`, this.bookTopic, ...this.extraTopics()];
      }
      bookTopics() {
        return [this.bookTopic];
      }
      subscribeTopics(client, topics) {
        return client.subscribeV5(topics, this.category);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribeV5(topics, this.category);
      }
      ackOf(response) {
        const res = response;
        if (res.op !== "subscribe") return null;
        return res.success ? { ok: true } : { ok: false, reason: res.ret_msg ?? "unknown reason" };
      }
      onBookReset() {
        this.lastSeq = 0;
      }
      handleMessage(raw) {
        const msg = raw;
        if (!msg.topic) return;
        if (msg.topic.startsWith("publicTrade.")) {
          for (const t of msg.data) {
            const price = parseFloat(t.p), qty = parseFloat(t.v);
            this.emitTrade({ id: `${this.tradeIdPrefix}-${t.i}`, venue: this.venue, symbol: t.s, timestamp: t.T, localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.S === "Buy" ? "buy" : "sell", marketType: this.marketType });
          }
        } else if (msg.topic.startsWith("orderbook.")) {
          const data = msg.data;
          if (msg.type === "snapshot") {
            this.bids.clear();
            this.asks.clear();
            this.awaitingSnapshot = false;
          } else if (this.awaitingSnapshot) {
            return;
          } else if (this.lastSeq > 0 && data.u > this.lastSeq + 1) {
            this.requestResubscribe();
            return;
          }
          applyLevels(this.bids, data.b, 1);
          applyLevels(this.asks, data.a, 1);
          this.lastSeq = data.u;
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        } else {
          this.handleExtraTopic?.(msg.topic, msg.data);
        }
      }
    };
    BybitFuturesAdapter = class extends BybitAdapter {
      venue = "bybit-futures";
      category = "linear";
      marketType = "perpetual";
      tradeIdPrefix = "bb";
      bookTopicDepth = 1e3;
      extraTopics() {
        return [`tickers.${this.symbol}`, `allLiquidation.${this.symbol}`];
      }
      handleExtraTopic(topic, data) {
        if (topic.startsWith("tickers.")) {
          const t = data;
          this.emitDerivatives({
            openInterest: num(t.openInterest),
            fundingRate: num(t.fundingRate),
            fundingIntervalHours: num(t.fundingIntervalHour),
            nextFundingTime: num(t.nextFundingTime),
            markPrice: num(t.markPrice),
            indexPrice: num(t.indexPrice)
          });
        } else if (topic.startsWith("allLiquidation.")) {
          for (const l of data) {
            this.emitLiquidation({ id: `bbl-${l.s}-${l.T}-${l.S}-${l.v}`, symbol: l.s, timestamp: l.T, price: parseFloat(l.p), quantity: parseFloat(l.v), side: l.S === "Buy" ? "long" : "short" });
          }
        }
      }
    };
    BybitSpotAdapter = class extends BybitAdapter {
      venue = "bybit-spot";
      category = "spot";
      marketType = "spot";
      tradeIdPrefix = "bbs";
      bookTopicDepth = 200;
    };
  }
});

// src/lib/adapters/okx.ts
function okxInstId(symbol, swap) {
  const s = symbol.toUpperCase();
  if (s.includes("-")) return s;
  const base = s.replace("USDT", "").replace("USD", "");
  return swap ? `${base}-USDT-SWAP` : `${base}-USDT`;
}
var OkxAdapter, OKXFuturesAdapter, OKXSpotAdapter;
var init_okx = __esm({
  "src/lib/adapters/okx.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    OkxAdapter = class extends SieblyAdapter {
      contractValue = 1;
      lastSeq = -1;
      async createClient() {
        const { WebsocketClient } = await import("okx-api");
        return new WebsocketClient({ ...sieblyNet(), market: "prod", pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("okx-api"));
      }
      bookTopics() {
        return [{ channel: "books", instId: this.symbol }];
      }
      subscribeTopics(client, topics) {
        return client.subscribe(topics);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics);
      }
      /** Rejections arrive as `event: "error"` exceptions, which the base reports. */
      ackOf(response) {
        return response.event === "subscribe" ? { ok: true } : null;
      }
      onBookReset() {
        this.lastSeq = -1;
      }
      handleMessage(raw) {
        const msg = raw;
        if (!msg.arg || !msg.data) return;
        const channel = msg.arg.channel;
        if (channel === "trades") {
          for (const t of msg.data) {
            const price = parseFloat(t.px), qty = parseFloat(t.sz) * this.contractValue;
            this.emitTrade({ id: `${this.tradeIdPrefix}-${t.tradeId}`, venue: this.venue, symbol: t.instId, timestamp: parseInt(t.ts), localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.side, marketType: this.marketType });
          }
        } else if (channel === "books") {
          const rows = msg.data;
          if (msg.action === "snapshot") {
            this.bids.clear();
            this.asks.clear();
            this.awaitingSnapshot = false;
          } else if (this.awaitingSnapshot) {
            return;
          }
          for (const d of rows) {
            if (msg.action !== "snapshot" && this.lastSeq >= 0 && d.prevSeqId !== void 0 && d.prevSeqId !== this.lastSeq) {
              this.requestResubscribe();
              return;
            }
            applyLevels(this.bids, d.bids, this.contractValue);
            applyLevels(this.asks, d.asks, this.contractValue);
            if (d.seqId !== void 0) this.lastSeq = d.seqId;
          }
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        } else {
          this.handleExtraChannel?.(channel, msg.data);
        }
      }
    };
    OKXFuturesAdapter = class extends OkxAdapter {
      venue = "okx-futures";
      marketType = "perpetual";
      tradeIdPrefix = "okx";
      constructor(symbol) {
        super(okxInstId(symbol, true));
      }
      topics() {
        const instId = this.symbol;
        return [
          { channel: "trades", instId },
          { channel: "books", instId },
          { channel: "open-interest", instId },
          { channel: "funding-rate", instId },
          { channel: "mark-price", instId },
          { channel: "index-tickers", instId: instId.replace(/-SWAP$/, "") },
          // Liquidations are only published for the whole instrument type.
          { channel: "liquidation-orders", instType: "SWAP" }
        ];
      }
      /** Swap sizes are in contracts; load the base-asset size of one contract first. */
      async prepare() {
        try {
          const response = await fetch(`https://www.okx.com/api/v5/public/instruments?instType=SWAP&instId=${encodeURIComponent(this.symbol)}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const body = await response.json();
          const value = Number(body.data?.[0]?.ctVal);
          if (Number.isFinite(value) && value > 0) this.contractValue = value;
        } catch (error) {
          this.reportError(`Unable to load OKX contract value: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      handleExtraChannel(channel, data) {
        if (channel === "open-interest") {
          for (const d of data) this.emitDerivatives({ openInterest: num(d.oiCcy), timestamp: num(d.ts) });
        } else if (channel === "funding-rate") {
          for (const d of data) {
            const next = num(d.fundingTime);
            const after = num(d.nextFundingTime);
            this.emitDerivatives({
              fundingRate: num(d.fundingRate),
              nextFundingTime: next,
              fundingIntervalHours: next && after && after > next ? (after - next) / 36e5 : void 0
            });
          }
        } else if (channel === "mark-price") {
          for (const d of data) this.emitDerivatives({ markPrice: num(d.markPx) });
        } else if (channel === "index-tickers") {
          for (const d of data) this.emitDerivatives({ indexPrice: num(d.idxPx) });
        } else if (channel === "liquidation-orders") {
          for (const item of data) {
            if (item.instId !== this.symbol) continue;
            for (const d of item.details ?? []) {
              const side = d.posSide === "long" || d.posSide !== "short" && d.side === "sell" ? "long" : "short";
              this.emitLiquidation({ id: `okxl-${item.instId}-${d.ts}-${d.sz}`, symbol: item.instId, timestamp: parseInt(d.ts), price: parseFloat(d.bkPx), quantity: parseFloat(d.sz) * this.contractValue, side });
            }
          }
        }
      }
    };
    OKXSpotAdapter = class extends OkxAdapter {
      venue = "okx-spot";
      marketType = "spot";
      tradeIdPrefix = "okxs";
      constructor(symbol) {
        super(okxInstId(symbol, false));
      }
      topics() {
        return [{ channel: "trades", instId: this.symbol }, { channel: "books", instId: this.symbol }];
      }
    };
  }
});

// src/lib/adapters/bitget.ts
var BitgetAdapter, BitgetFuturesAdapter, BitgetSpotAdapter;
var init_bitget = __esm({
  "src/lib/adapters/bitget.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    BitgetAdapter = class extends SieblyAdapter {
      channels() {
        return ["trade", "books"];
      }
      async createClient() {
        const { WebsocketClientV2 } = await import("bitget-api");
        return new WebsocketClientV2({ ...sieblyNet(), pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("bitget-api"));
      }
      topic(topic) {
        return { instType: this.instType, topic, instId: this.symbol };
      }
      topics() {
        return this.channels().map((c) => this.topic(c));
      }
      bookTopics() {
        return [this.topic("books")];
      }
      subscribeTopics(client, topics) {
        return topics.map((t) => client.subscribeTopic(t.instType, t.topic, t.instId));
      }
      unsubscribeTopics(client, topics) {
        return topics.map((t) => client.unsubscribeTopic(t.instType, t.topic, t.instId));
      }
      ackOf(response) {
        const res = response;
        if (res.event === "subscribe") return { ok: true };
        if (res.event === "error") return { ok: false, reason: res.msg ?? "unknown reason" };
        return null;
      }
      handleMessage(raw) {
        const msg = raw;
        if (!msg.arg || !msg.data) return;
        const channel = msg.arg.channel;
        if (channel === "trade") {
          if (msg.action === "snapshot") return;
          for (const t of parseBitgetTrades(msg.data)) {
            const price = parseFloat(t.price), qty = parseFloat(t.size);
            this.emitTrade({ id: `${this.tradeIdPrefix}-${t.tradeId}`, venue: this.venue, symbol: this.symbol, timestamp: parseInt(t.ts), localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.side === "buy" ? "buy" : "sell", marketType: this.marketType });
          }
        } else if (channel === "books") {
          if (msg.action === "snapshot") {
            this.bids.clear();
            this.asks.clear();
            this.awaitingSnapshot = false;
          } else if (this.awaitingSnapshot) {
            return;
          }
          for (const d of msg.data) {
            applyLevels(this.bids, d.bids, 1);
            applyLevels(this.asks, d.asks, 1);
          }
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        } else if (channel === "ticker") {
          this.handleTicker?.(msg.data);
        }
      }
    };
    BitgetFuturesAdapter = class extends BitgetAdapter {
      venue = "bitget-futures";
      instType = "USDT-FUTURES";
      marketType = "perpetual";
      tradeIdPrefix = "bg";
      constructor(symbol) {
        super(symbol.toUpperCase().replace("_UMCBL", ""));
      }
      channels() {
        return ["trade", "books", "ticker"];
      }
      handleTicker(rows) {
        for (const t of rows) {
          this.emitDerivatives({
            openInterest: num(t.holdingAmount),
            fundingRate: num(t.fundingRate),
            nextFundingTime: num(t.nextFundingTime),
            markPrice: num(t.markPrice),
            indexPrice: num(t.indexPrice),
            timestamp: num(t.ts)
          });
        }
      }
    };
    BitgetSpotAdapter = class extends BitgetAdapter {
      venue = "bitget-spot";
      instType = "SPOT";
      marketType = "spot";
      tradeIdPrefix = "bgs";
      constructor(symbol) {
        super(symbol.toUpperCase());
      }
    };
  }
});

// src/lib/adapters/hyperliquid.ts
function fillSide(side, levels) {
  for (const level of levels) {
    const [p, q] = Array.isArray(level) ? level : [level.px, level.sz];
    const price = parseFloat(p), qty = parseFloat(q);
    if (Number.isFinite(price) && qty > 0) side.set(price, qty);
  }
}
var HyperliquidAdapter;
var init_hyperliquid = __esm({
  "src/lib/adapters/hyperliquid.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    HyperliquidAdapter = class extends SieblyAdapter {
      venue = "hyperliquid";
      events = { data: "message", reconnecting: "reconnecting" };
      constructor(symbol) {
        let s = symbol.toUpperCase();
        if (s.endsWith("USDT")) s = s.replace("USDT", "");
        super(s);
      }
      async createClient() {
        const { WebsocketClient } = await import("@siebly/hyperliquid-api");
        return new WebsocketClient({ webSocketConstructor: NodeWebSocket, pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("hyperliquid-api"));
      }
      disposeClient(client) {
        client.removeAllListeners();
        client.on("exception", () => {
        });
        client.closeAll();
      }
      topics() {
        const coin = this.symbol;
        return [{ type: "trades", coin }, { type: "l2Book", coin }, { type: "activeAssetCtx", coin }];
      }
      /** l2Book pushes full snapshots, so a resubscribe is never needed for gaps. */
      bookTopics() {
        return [{ type: "l2Book", coin: this.symbol }];
      }
      subscribeTopics(client, topics) {
        return client.subscribe(topics);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics);
      }
      ackOf(response) {
        const res = response;
        return res.channel === "subscriptionResponse" && res.data?.method === "subscribe" ? { ok: true } : null;
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.channel === "trades") {
          for (const t of msg.data) {
            const price = parseFloat(t.px), qty = parseFloat(t.sz);
            this.emitTrade({ id: `hl-${t.tid}`, venue: this.venue, symbol: t.coin, timestamp: t.time, localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.side === "B" ? "buy" : "sell", marketType: "perpetual" });
          }
        } else if (msg.channel === "l2Book") {
          const book = msg.data;
          if (book.coin !== this.symbol) return;
          this.bids.clear();
          this.asks.clear();
          fillSide(this.bids, book.levels[0]);
          fillSide(this.asks, book.levels[1]);
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        } else if (msg.channel === "activeAssetCtx") {
          const { coin, ctx } = msg.data;
          if (coin !== this.symbol || !ctx) return;
          const hour = 36e5;
          this.emitDerivatives({
            openInterest: num(ctx.openInterest),
            fundingRate: num(ctx.funding),
            fundingIntervalHours: 1,
            nextFundingTime: Math.floor(Date.now() / hour) * hour + hour,
            markPrice: num(ctx.markPx),
            indexPrice: num(ctx.oraclePx)
          });
        }
      }
    };
  }
});

// src/lib/adapters/coinbase.ts
function coinbaseProductId(symbol) {
  const s = symbol.toUpperCase();
  if (s.includes("-")) return s;
  return `${s.replace("USDT", "").replace("USD", "")}-USD`;
}
var MARKET_DATA, CoinbaseSpotAdapter;
var init_coinbase = __esm({
  "src/lib/adapters/coinbase.ts"() {
    "use strict";
    init_book();
    init_siebly();
    init_net();
    MARKET_DATA = "advTradeMarketData";
    CoinbaseSpotAdapter = class extends SieblyAdapter {
      venue = "coinbase-spot";
      constructor(symbol) {
        super(coinbaseProductId(symbol));
      }
      async createClient() {
        const { WebsocketClient } = await import("coinbase-api");
        const client = new WebsocketClient({ ...sieblyNet(), pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("coinbase-api"));
        client.sendPingEvent = () => {
        };
        return client;
      }
      topic(topic) {
        return { topic, payload: { product_ids: [this.symbol] } };
      }
      topics() {
        return [this.topic("market_trades"), this.topic("level2"), { topic: "heartbeats" }];
      }
      bookTopics() {
        return [this.topic("level2")];
      }
      subscribeTopics(client, topics) {
        return client.subscribe(topics, MARKET_DATA);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics, MARKET_DATA);
      }
      /** Coinbase confirms with a "subscriptions" message; errors arrive as exceptions. */
      ackOf(response) {
        const res = response;
        return res.channel === "subscriptions" || res.type === "subscriptions" ? { ok: true } : null;
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.channel === "market_trades") {
          for (const event of msg.events ?? []) {
            if (event.type === "snapshot") continue;
            for (const tr of event.trades ?? []) {
              const price = parseFloat(tr.price), qty = parseFloat(tr.size);
              this.emitTrade({ id: `cb-${tr.trade_id}`, venue: this.venue, symbol: tr.product_id, timestamp: new Date(tr.time).getTime(), localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: tr.side === "BUY" ? "buy" : "sell", marketType: "spot" });
            }
          }
        } else if (msg.channel === "l2_data") {
          for (const event of msg.events ?? []) {
            if (event.product_id && event.product_id !== this.symbol) continue;
            if (event.type === "snapshot") {
              this.bids.clear();
              this.asks.clear();
              this.awaitingSnapshot = false;
            } else if (this.awaitingSnapshot) {
              continue;
            }
            const updates = event.updates ?? [];
            applyLevels(this.bids, updates.filter((u) => u.side === "bid").map((u) => [u.price_level, u.new_quantity]), 1);
            applyLevels(this.asks, updates.filter((u) => u.side !== "bid").map((u) => [u.price_level, u.new_quantity]), 1);
          }
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        }
      }
    };
  }
});

// src/lib/adapters/binance.ts
var REST, OI_POLL_MS, DEEP_BOOK_POLL_MS, BinanceAdapter, BinanceSpotAdapter, BinanceFuturesAdapter;
var init_binance = __esm({
  "src/lib/adapters/binance.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    REST = "https://fapi.binance.com";
    OI_POLL_MS = 5e3;
    DEEP_BOOK_POLL_MS = 5e3;
    BinanceAdapter = class extends SieblyAdapter {
      /** binance emits raw stream data as "message" ("formattedMessage" when beautify is on). */
      events = { data: "message", reconnecting: "reconnecting" };
      constructor(symbol) {
        super(symbol.toUpperCase());
      }
      async createClient() {
        const { WebsocketClient } = await import("binance");
        return new WebsocketClient({ ...sieblyNet(), beautify: false, pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("binance"));
      }
      bookTopics() {
        return [this.depthTopic];
      }
      subscribeTopics(client, topics) {
        return client.subscribe(topics, this.wsKey);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics, this.wsKey);
      }
      /** Binance answers SUBSCRIBE with { result: null, id }; errors arrive as exceptions. */
      ackOf(response) {
        const res = response;
        return "result" in (res ?? {}) && res.result === null && res.id !== void 0 ? { ok: true } : null;
      }
      /** Partial depth: every message is a full top-N snapshot. */
      applyDepth(msg) {
        this.bids.clear();
        this.asks.clear();
        for (const [p, q] of msg.b ?? msg.bids) {
          const price = parseFloat(p), qty = parseFloat(q);
          if (qty > 0) this.bids.set(price, qty);
        }
        for (const [p, q] of msg.a ?? msg.asks) {
          const price = parseFloat(p), qty = parseFloat(q);
          if (qty > 0) this.asks.set(price, qty);
        }
        emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
      }
    };
    BinanceSpotAdapter = class extends BinanceAdapter {
      venue = "binance-spot";
      wsKey = "main";
      get depthTopic() {
        return `${this.symbol.toLowerCase()}@depth20@100ms`;
      }
      topics() {
        return [`${this.symbol.toLowerCase()}@trade`, this.depthTopic];
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.e === "trade") {
          const price = parseFloat(msg.p), qty = parseFloat(msg.q);
          this.emitTrade({ id: `bs-${msg.t}`, venue: this.venue, symbol: msg.s, timestamp: msg.T, localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: msg.m ? "sell" : "buy", marketType: "spot", sequence: msg.t });
        } else if (msg.lastUpdateId && msg.bids && msg.asks) {
          this.applyDepth(msg);
        }
      }
    };
    BinanceFuturesAdapter = class extends BinanceAdapter {
      venue = "binance-futures";
      wsKey = "usdm";
      get depthTopic() {
        return `${this.symbol.toLowerCase()}@depth20@100ms`;
      }
      oiTimer = null;
      deepTimer = null;
      deepBids = /* @__PURE__ */ new Map();
      deepAsks = /* @__PURE__ */ new Map();
      fundingIntervalHours;
      active = false;
      topics() {
        const s = this.symbol.toLowerCase();
        return [`${s}@aggTrade`, `${s}@markPrice@1s`, `${s}@forceOrder`, this.depthTopic];
      }
      connect() {
        this.active = true;
        super.connect();
        this.startOpenInterestPolling();
        this.startDeepBookPolling();
        void this.loadFundingInterval();
      }
      disconnect() {
        this.active = false;
        if (this.oiTimer) clearInterval(this.oiTimer);
        this.oiTimer = null;
        if (this.deepTimer) clearInterval(this.deepTimer);
        this.deepTimer = null;
        super.disconnect();
      }
      startOpenInterestPolling() {
        if (this.oiTimer || typeof fetch === "undefined") return;
        const poll = async () => {
          try {
            const response = await fetch(`${REST}/fapi/v1/openInterest?symbol=${encodeURIComponent(this.symbol)}`);
            if (!response.ok) return;
            const body = await response.json();
            if (this.active) this.emitDerivatives({ openInterest: num(body.openInterest), timestamp: body.time });
          } catch {
          }
        };
        void poll();
        this.oiTimer = setInterval(poll, OI_POLL_MS);
      }
      /** The partial-depth stream stops at 20 levels; a REST snapshot gives the heatmap 1000. */
      startDeepBookPolling() {
        if (this.deepTimer || typeof fetch === "undefined") return;
        const poll = async () => {
          try {
            const response = await fetch(`${REST}/fapi/v1/depth?symbol=${encodeURIComponent(this.symbol)}&limit=1000`);
            if (!response.ok) return;
            const body = await response.json();
            const toMap = (levels = []) => new Map(levels.map(([p, q]) => [Number(p), Number(q)]).filter(([p, q]) => p > 0 && q > 0));
            if (!this.active) return;
            this.deepBids = toMap(body.bids);
            this.deepAsks = toMap(body.asks);
          } catch {
          }
        };
        void poll();
        this.deepTimer = setInterval(poll, DEEP_BOOK_POLL_MS);
      }
      /** Live top-20 inside its own range, the REST snapshot beyond it. */
      depthSides() {
        if (!this.bids.size && !this.asks.size) return null;
        const merge = (live, deep, side) => {
          if (!live.size) return deep;
          const prices = [...live.keys()];
          const edge = side === "bid" ? Math.min(...prices) : Math.max(...prices);
          const out = new Map(live);
          for (const [price, size] of deep) {
            if (side === "bid" ? price < edge : price > edge) out.set(price, size);
          }
          return out;
        };
        return { bids: merge(this.bids, this.deepBids, "bid"), asks: merge(this.asks, this.deepAsks, "ask") };
      }
      /** Most symbols fund every 8h; some use 4h or 1h, listed in fundingInfo. */
      async loadFundingInterval() {
        if (typeof fetch === "undefined") return;
        try {
          const response = await fetch(`${REST}/fapi/v1/fundingInfo`);
          if (!response.ok) return;
          const list = await response.json();
          this.fundingIntervalHours = list.find((item) => item.symbol === this.symbol)?.fundingIntervalHours ?? 8;
        } catch {
          this.fundingIntervalHours = 8;
        }
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.e === "aggTrade") {
          const price = parseFloat(msg.p), qty = parseFloat(msg.q);
          this.emitTrade({ id: `bf-${msg.a}`, venue: this.venue, symbol: msg.s, timestamp: msg.T, localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: msg.m ? "sell" : "buy", marketType: "perpetual", sequence: msg.a });
        } else if (msg.e === "depthUpdate" || msg.lastUpdateId && msg.bids && msg.asks) {
          this.applyDepth(msg);
        } else if (msg.e === "markPriceUpdate") {
          this.emitDerivatives({
            markPrice: num(msg.p),
            indexPrice: num(msg.i),
            fundingRate: num(msg.r),
            nextFundingTime: num(msg.T),
            fundingIntervalHours: this.fundingIntervalHours,
            timestamp: num(msg.E)
          });
        } else if (msg.e === "forceOrder" && msg.o) {
          const o = msg.o;
          const price = num(o.ap) || num(o.p) || 0;
          const quantity = num(o.z) || num(o.q) || 0;
          this.emitLiquidation({ id: `bfl-${o.s}-${o.T}-${o.S}`, symbol: o.s, timestamp: o.T, price, quantity, side: o.S === "SELL" ? "long" : "short" });
        }
      }
    };
  }
});

// src/lib/adapters/gate.ts
function gatePair(symbol) {
  const s = symbol.toUpperCase();
  if (s.includes("_")) return s;
  return `${s.replace(/USDT$/, "")}_USDT`;
}
var GateAdapter, GateSpotAdapter, GateFuturesAdapter;
var init_gate = __esm({
  "src/lib/adapters/gate.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    GateAdapter = class extends SieblyAdapter {
      constructor(symbol) {
        super(gatePair(symbol));
      }
      async createClient() {
        const { WebsocketClient } = await import("gateio-api");
        return new WebsocketClient({ ...sieblyNet(), pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("gateio-api"));
      }
      topic(channel, ...params) {
        return { topic: `${this.prefix}.${channel}`, payload: [this.symbol, ...params] };
      }
      bookTopics() {
        return [this.topic("order_book", "20", this.prefix === "spot" ? "100ms" : "0")];
      }
      subscribeTopics(client, topics) {
        return client.subscribe(topics, this.wsKey);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics, this.wsKey);
      }
      ackOf(response) {
        const res = response;
        if (res.event !== "subscribe") return null;
        if (res.error) return { ok: false, reason: res.error.message ?? "unknown reason" };
        return res.result?.status === "success" ? { ok: true } : null;
      }
      replaceBook(bids, asks) {
        this.bids.clear();
        this.asks.clear();
        for (const [price, size] of bids) if (price > 0 && size > 0) this.bids.set(price, size);
        for (const [price, size] of asks) if (price > 0 && size > 0) this.asks.set(price, size);
        emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
      }
    };
    GateSpotAdapter = class extends GateAdapter {
      venue = "gate-spot";
      wsKey = "spotV4";
      prefix = "spot";
      topics() {
        return [this.topic("trades"), ...this.bookTopics()];
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.channel === "spot.trades" && msg.event === "update") {
          const t = msg.result;
          const price = parseFloat(t.price), qty = parseFloat(t.amount);
          this.emitTrade({ id: `gts-${t.id}`, venue: this.venue, symbol: t.currency_pair, timestamp: Math.round(Number(t.create_time_ms)), localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.side, marketType: "spot" });
        } else if (msg.channel === "spot.order_book" && msg.event === "update") {
          const book = msg.result;
          if (book.s && book.s !== this.symbol) return;
          this.replaceBook(book.bids.map(([p, q]) => [+p, +q]), book.asks.map(([p, q]) => [+p, +q]));
        }
      }
    };
    GateFuturesAdapter = class extends GateAdapter {
      venue = "gate-futures";
      wsKey = "perpFuturesUSDTV4";
      prefix = "futures";
      multiplier = 1;
      fundingIntervalHours;
      nextFundingTime;
      topics() {
        return [this.topic("trades"), ...this.bookTopics(), this.topic("tickers"), this.topic("public_liquidates")];
      }
      /** Contract size (base units per contract) and the funding schedule. */
      async prepare() {
        try {
          const response = await fetch(`https://api.gateio.ws/api/v4/futures/usdt/contracts/${encodeURIComponent(this.symbol)}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const c = await response.json();
          const multiplier = Number(c.quanto_multiplier);
          if (multiplier > 0) this.multiplier = multiplier;
          if (c.funding_interval) this.fundingIntervalHours = c.funding_interval / 3600;
          if (c.funding_next_apply) this.nextFundingTime = c.funding_next_apply * 1e3;
        } catch (error) {
          this.reportError(`Unable to load Gate contract size: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.channel === "futures.trades" && msg.event === "update") {
          for (const t of msg.result) {
            const price = parseFloat(t.price), qty = Math.abs(t.size) * this.multiplier;
            this.emitTrade({ id: `gtf-${t.id}`, venue: this.venue, symbol: t.contract, timestamp: t.create_time_ms, localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.size > 0 ? "buy" : "sell", marketType: "perpetual" });
          }
        } else if (msg.channel === "futures.order_book" && msg.event === "all") {
          const book = msg.result;
          if (book.contract && book.contract !== this.symbol) return;
          const side = (levels) => levels.map(({ p, s }) => [+p, s * this.multiplier]);
          this.replaceBook(side(book.bids), side(book.asks));
        } else if (msg.channel === "futures.tickers" && msg.event === "update") {
          for (const t of msg.result) {
            if (t.contract !== this.symbol) continue;
            const contracts = num(t.total_size);
            this.emitDerivatives({
              openInterest: contracts !== void 0 ? contracts * this.multiplier : void 0,
              fundingRate: num(t.funding_rate),
              fundingIntervalHours: this.fundingIntervalHours,
              nextFundingTime: this.currentNextFunding(),
              markPrice: num(t.mark_price),
              indexPrice: num(t.index_price)
            });
          }
        } else if (msg.channel === "futures.public_liquidates" && msg.event === "update") {
          for (const l of msg.result) {
            if (l.contract !== this.symbol) continue;
            this.emitLiquidation({ id: `gtl-${l.contract}-${l.time_ms}-${l.size}`, symbol: l.contract, timestamp: l.time_ms, price: Number(l.price), quantity: Math.abs(l.size) * this.multiplier, side: l.size < 0 ? "long" : "short" });
          }
        }
      }
      /** funding_next_apply is fetched once; roll it forward by the interval as it passes. */
      currentNextFunding() {
        if (!this.nextFundingTime || !this.fundingIntervalHours) return this.nextFundingTime;
        const step = this.fundingIntervalHours * 36e5;
        while (this.nextFundingTime <= Date.now()) this.nextFundingTime += step;
        return this.nextFundingTime;
      }
    };
  }
});

// src/lib/adapters/kucoin.ts
function kucoinSymbol(symbol, futures) {
  const s = symbol.toUpperCase();
  const base = s.replace(/-?USDTM?$/, "");
  if (!futures) return s.includes("-") ? s : `${base}-USDT`;
  return s.endsWith("USDTM") ? s : `${base === "BTC" ? "XBT" : base}USDTM`;
}
var OI_POLL_MS2, KucoinAdapter, KucoinSpotAdapter, KucoinFuturesAdapter;
var init_kucoin = __esm({
  "src/lib/adapters/kucoin.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    OI_POLL_MS2 = 1e4;
    KucoinAdapter = class extends SieblyAdapter {
      async createClient() {
        const { WebsocketClient } = await import("kucoin-api");
        const client = new WebsocketClient({ ...sieblyNet(), pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("kucoin-api"));
        const market = this.market;
        client.getWSConnectionInfo = async () => {
          const response = await fetch(market === "spot" ? "https://api.kucoin.com/api/v1/bullet-public" : "https://api-futures.kucoin.com/api/v1/bullet-public", { method: "POST", signal: AbortSignal.timeout(8e3) });
          if (!response.ok) throw new Error(`KuCoin token request failed (${response.status})`);
          return response.json();
        };
        return client;
      }
      bookTopics() {
        return [this.depthTopic];
      }
      subscribeTopics(client, topics) {
        return client.subscribe(topics, this.wsKey);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics, this.wsKey);
      }
      /** KuCoin acknowledges each subscribe with { type: "ack" }; errors arrive as exceptions. */
      ackOf(response) {
        return response.type === "ack" ? { ok: true } : null;
      }
      replaceBook(data, multiplier) {
        this.bids.clear();
        this.asks.clear();
        for (const [p, q] of data.bids ?? []) {
          const price = Number(p), qty = Number(q) * multiplier;
          if (price > 0 && qty > 0) this.bids.set(price, qty);
        }
        for (const [p, q] of data.asks ?? []) {
          const price = Number(p), qty = Number(q) * multiplier;
          if (price > 0 && qty > 0) this.asks.set(price, qty);
        }
        emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
      }
    };
    KucoinSpotAdapter = class extends KucoinAdapter {
      venue = "kucoin-spot";
      wsKey = "spotPublicV1";
      market = "spot";
      constructor(symbol) {
        super(kucoinSymbol(symbol, false));
      }
      get depthTopic() {
        return `/spotMarket/level2Depth50:${this.symbol}`;
      }
      topics() {
        return [`/market/match:${this.symbol}`, this.depthTopic];
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.type !== "message" || !msg.data) return;
        if (msg.topic?.startsWith("/market/match:")) {
          const t = msg.data;
          const price = parseFloat(t.price), qty = parseFloat(t.size);
          this.emitTrade({ id: `kcs-${t.tradeId}`, venue: this.venue, symbol: t.symbol, timestamp: Math.round(Number(t.time) / 1e6), localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.side, marketType: "spot" });
        } else if (msg.topic === this.depthTopic) {
          this.replaceBook(msg.data, 1);
        }
      }
    };
    KucoinFuturesAdapter = class extends KucoinAdapter {
      venue = "kucoin-futures";
      wsKey = "futuresPublicV1";
      market = "futures";
      multiplier = 1;
      fundingIntervalHours;
      nextFundingTime;
      oiTimer = null;
      constructor(symbol) {
        super(kucoinSymbol(symbol, true));
      }
      get depthTopic() {
        return `/contractMarket/level2Depth50:${this.symbol}`;
      }
      topics() {
        return [`/contractMarket/execution:${this.symbol}`, this.depthTopic, `/contract/instrument:${this.symbol}`];
      }
      /** Contract size first: trades and books are quoted in contracts. */
      async prepare() {
        if (!await this.loadContract()) this.reportError("Unable to load KuCoin contract size");
      }
      connect() {
        super.connect();
        if (!this.oiTimer) this.oiTimer = setInterval(() => void this.loadContract(), OI_POLL_MS2);
      }
      disconnect() {
        if (this.oiTimer) clearInterval(this.oiTimer);
        this.oiTimer = null;
        super.disconnect();
      }
      /** Contract details carry the size multiplier, open interest (contracts) and funding schedule. */
      async loadContract() {
        try {
          const response = await fetch(`https://api-futures.kucoin.com/api/v1/contracts/${encodeURIComponent(this.symbol)}`, { signal: AbortSignal.timeout(8e3) });
          if (!response.ok) return false;
          const { data } = await response.json();
          if (!data) return false;
          const multiplier = num(data.multiplier);
          if (multiplier) this.multiplier = multiplier;
          const granularity = num(data.fundingRateGranularity);
          if (granularity) this.fundingIntervalHours = granularity / 36e5;
          this.nextFundingTime = num(data.nextFundingRateDateTime) ?? this.nextFundingTime;
          const oi = num(data.openInterest);
          this.emitDerivatives({
            openInterest: oi !== void 0 ? oi * this.multiplier : void 0,
            fundingIntervalHours: this.fundingIntervalHours,
            nextFundingTime: this.nextFundingTime
          });
          return true;
        } catch {
          return false;
        }
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.type !== "message" || !msg.data) return;
        if (msg.topic?.startsWith("/contractMarket/execution:")) {
          const t = msg.data;
          const price = parseFloat(t.price), qty = Number(t.size) * this.multiplier;
          this.emitTrade({ id: `kcf-${t.tradeId}`, venue: this.venue, symbol: t.symbol, timestamp: Math.round(Number(t.ts) / 1e6), localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.side, marketType: "perpetual" });
        } else if (msg.topic === this.depthTopic) {
          this.replaceBook(msg.data, this.multiplier);
        } else if (msg.topic?.startsWith("/contract/instrument:")) {
          if (msg.subject === "mark.index.price") {
            this.emitDerivatives({ markPrice: num(msg.data.markPrice), indexPrice: num(msg.data.indexPrice) });
          } else if (msg.subject === "funding.rate") {
            this.emitDerivatives({ fundingRate: num(msg.data.fundingRate), fundingIntervalHours: this.fundingIntervalHours, nextFundingTime: this.nextFundingTime });
          }
        }
      }
    };
  }
});

// src/lib/adapters/kraken.ts
function krakenSymbol(symbol, futures) {
  const s = symbol.toUpperCase();
  if (s.includes("/") || s.startsWith("PF_")) return s;
  const base = krakenBase(s);
  return futures ? `PF_${base === "BTC" ? "XBT" : base}USD` : `${base}/USD`;
}
var krakenBase, KrakenAdapter, KrakenSpotAdapter, KrakenFuturesAdapter;
var init_kraken = __esm({
  "src/lib/adapters/kraken.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    krakenBase = (symbol) => symbol.toUpperCase().replace(/USDT?$/, "");
    KrakenAdapter = class extends SieblyAdapter {
      events = { data: "message", reconnecting: "reconnecting" };
      subscribeTopics(client, topics) {
        return client.subscribe(topics, this.wsKey);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics, this.wsKey);
      }
    };
    KrakenSpotAdapter = class extends KrakenAdapter {
      venue = "kraken-spot";
      wsKey = "spotPublicV2";
      constructor(symbol) {
        super(krakenSymbol(symbol, false));
      }
      async createClient() {
        const { WebsocketClient } = await import("@siebly/kraken-api");
        return new WebsocketClient({ ...sieblyNet(), pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("kraken-api"));
      }
      topic(channel, extra = {}) {
        return { topic: channel, payload: { symbol: [this.symbol], ...extra } };
      }
      topics() {
        return [this.topic("trade", { snapshot: false }), ...this.bookTopics()];
      }
      bookTopics() {
        return [this.topic("book", { depth: 100 })];
      }
      ackOf(response) {
        const res = response;
        if (res.method !== "subscribe") return null;
        return res.success ? { ok: true } : { ok: false, reason: res.error ?? "unknown reason" };
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.channel === "trade" && msg.type === "update") {
          for (const t of msg.data ?? []) {
            if (t.symbol !== this.symbol) continue;
            this.emitTrade({ id: `krs-${t.trade_id}`, venue: this.venue, symbol: t.symbol, timestamp: Date.parse(t.timestamp), localTimestamp: Date.now(), price: t.price, quantity: t.qty, quoteVolume: t.price * t.qty, side: t.side, marketType: "spot" });
          }
        } else if (msg.channel === "book") {
          const rows = msg.data ?? [];
          if (msg.type === "snapshot") {
            this.bids.clear();
            this.asks.clear();
            this.awaitingSnapshot = false;
          } else if (this.awaitingSnapshot) {
            return;
          }
          for (const row of rows) {
            if (row.symbol !== this.symbol) continue;
            for (const { price, qty } of row.bids ?? []) {
              if (qty > 0) this.bids.set(price, qty);
              else this.bids.delete(price);
            }
            for (const { price, qty } of row.asks ?? []) {
              if (qty > 0) this.asks.set(price, qty);
              else this.asks.delete(price);
            }
          }
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        }
      }
    };
    KrakenFuturesAdapter = class extends KrakenAdapter {
      venue = "kraken-futures";
      wsKey = "derivativesPublicV1";
      lastSeq = -1;
      constructor(symbol) {
        super(krakenSymbol(symbol, true));
      }
      async createClient() {
        const { WebsocketClient } = await import("@siebly/kraken-api");
        const client = new WebsocketClient({ ...sieblyNet(), pingInterval: 1e4, pongTimeout: 15e3, reconnectTimeout: 1e3 }, quietLogger("kraken-api"));
        client.sendPingEvent = () => {
        };
        return client;
      }
      topic(feed) {
        return { topic: feed, payload: { product_ids: [this.symbol] } };
      }
      topics() {
        return [this.topic("trade"), ...this.bookTopics(), this.topic("ticker"), { topic: "heartbeat", payload: {} }];
      }
      bookTopics() {
        return [this.topic("book")];
      }
      ackOf(response) {
        const res = response;
        if (res.event === "subscribed") return { ok: true };
        if (res.event === "error") return { ok: false, reason: res.message ?? "unknown reason" };
        return null;
      }
      onBookReset() {
        this.lastSeq = -1;
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.product_id && msg.product_id !== this.symbol) return;
        if (msg.feed === "trade") {
          const t = msg;
          const price = Number(t.price), qty = Number(t.qty);
          if (t.type === "liquidation") {
            this.emitLiquidation({ id: `krl-${t.uid}`, symbol: this.symbol, timestamp: t.time, price, quantity: qty, side: t.side === "sell" ? "long" : "short" });
          }
          this.emitTrade({ id: `krf-${t.uid}`, venue: this.venue, symbol: this.symbol, timestamp: t.time, localTimestamp: Date.now(), price, quantity: qty, quoteVolume: price * qty, side: t.side, marketType: "perpetual" });
        } else if (msg.feed === "book_snapshot") {
          const book = msg;
          this.bids.clear();
          this.asks.clear();
          for (const { price, qty } of book.bids ?? []) if (qty > 0) this.bids.set(price, qty);
          for (const { price, qty } of book.asks ?? []) if (qty > 0) this.asks.set(price, qty);
          this.lastSeq = book.seq;
          this.awaitingSnapshot = false;
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        } else if (msg.feed === "book") {
          if (this.awaitingSnapshot) return;
          const u = msg;
          if (this.lastSeq >= 0 && u.seq !== this.lastSeq + 1) {
            this.requestResubscribe();
            return;
          }
          this.lastSeq = u.seq;
          const side = u.side === "buy" ? this.bids : this.asks;
          if (u.qty > 0) side.set(u.price, u.qty);
          else side.delete(u.price);
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        } else if (msg.feed === "ticker") {
          this.emitDerivatives({
            openInterest: num(msg.openInterest),
            fundingRate: num(msg.relative_funding_rate),
            fundingIntervalHours: 1,
            nextFundingTime: num(msg.next_funding_rate_time),
            markPrice: num(msg.markPrice),
            indexPrice: num(msg.index)
          });
        }
      }
    };
  }
});

// src/lib/adapters/htx.ts
var HTX_OPS, DERIVATIVES_POLL_MS, htxBase, HtxAdapter, HtxSpotAdapter, HtxFuturesAdapter;
var init_htx = __esm({
  "src/lib/adapters/htx.ts"() {
    "use strict";
    init_base();
    init_book();
    init_siebly();
    init_net();
    HTX_OPS = { contract: "swap_contract_info", oi: "swap_open_interest", funding: "swap_funding_rate" };
    DERIVATIVES_POLL_MS = 1e4;
    htxBase = (symbol) => symbol.toUpperCase().replace(/-?USDT$/, "");
    HtxAdapter = class extends SieblyAdapter {
      events = { data: "message", reconnecting: "reconnecting" };
      async createClient() {
        const { WebsocketClient } = await import("@siebly/htx-api");
        return new WebsocketClient({ ...sieblyNet(), wsEnvironment: "standard", pingInterval: 1e4, pongTimeout: 5e3, reconnectTimeout: 1e3 }, quietLogger("htx-api"));
      }
      get tradeTopic() {
        return `market.${this.symbol}.trade.detail`;
      }
      get depthTopic() {
        return `market.${this.symbol}.depth.step0`;
      }
      topics() {
        return [this.tradeTopic, this.depthTopic];
      }
      bookTopics() {
        return [this.depthTopic];
      }
      subscribeTopics(client, topics) {
        return client.subscribe(topics, this.wsKey);
      }
      unsubscribeTopics(client, topics) {
        return client.unsubscribe(topics, this.wsKey);
      }
      /** HTX confirms with { status: "ok", subbed }; errors arrive as exceptions. */
      ackOf(response) {
        const res = response;
        return res.status === "ok" && res.subbed ? { ok: true } : null;
      }
      replaceBook(tick, multiplier) {
        this.bids.clear();
        this.asks.clear();
        for (const [price, size] of tick.bids ?? []) if (price > 0 && size > 0) this.bids.set(price, size * multiplier);
        for (const [price, size] of tick.asks ?? []) if (price > 0 && size > 0) this.asks.set(price, size * multiplier);
        emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
      }
    };
    HtxSpotAdapter = class extends HtxAdapter {
      venue = "htx-spot";
      wsKey = "spotPublic";
      /** BTCUSDT → btcusdt. */
      constructor(symbol) {
        super(`${htxBase(symbol).toLowerCase()}usdt`);
      }
      handleMessage(raw) {
        const msg = raw;
        if (!msg.tick) return;
        if (msg.ch === this.tradeTopic) {
          for (const t of msg.tick.data ?? []) {
            this.emitTrade({ id: `hxs-${t.tradeId}`, venue: this.venue, symbol: this.symbol, timestamp: t.ts, localTimestamp: Date.now(), price: t.price, quantity: t.amount, quoteVolume: t.price * t.amount, side: t.direction, marketType: "spot" });
          }
        } else if (msg.ch === this.depthTopic) {
          this.replaceBook(msg.tick, 1);
        }
      }
    };
    HtxFuturesAdapter = class extends HtxAdapter {
      venue = "htx-futures";
      wsKey = "linearSwapPublic";
      contractSize = 1;
      timer = null;
      /** BTCUSDT → BTC-USDT. */
      constructor(symbol) {
        super(`${htxBase(symbol)}-USDT`);
      }
      /** Book sizes are in contracts: load the contract size before subscribing. */
      async prepare() {
        const data = await this.rest("contract");
        const size = num(data?.[0]?.contract_size);
        if (size) this.contractSize = size;
        else this.reportError("Unable to load HTX contract size");
      }
      connect() {
        super.connect();
        if (!this.timer) {
          void this.pollDerivatives();
          this.timer = setInterval(() => void this.pollDerivatives(), DERIVATIVES_POLL_MS);
        }
      }
      disconnect() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        super.disconnect();
      }
      async rest(op) {
        try {
          const response = await fetch(`https://api.hbdm.com/linear-swap-api/v1/${HTX_OPS[op]}?contract_code=${encodeURIComponent(this.symbol)}`, { signal: AbortSignal.timeout(8e3) });
          if (!response.ok) return void 0;
          const body = await response.json();
          return body.status === "ok" ? body.data : void 0;
        } catch {
          return void 0;
        }
      }
      /** Open interest (amount is in base units) and the current funding rate. */
      async pollDerivatives() {
        const [oi, funding] = await Promise.all([
          this.rest("oi"),
          this.rest("funding")
        ]);
        const next = num(funding?.funding_time);
        const after = num(funding?.next_funding_time);
        this.emitDerivatives({
          openInterest: num(oi?.[0]?.amount),
          fundingRate: num(funding?.funding_rate),
          nextFundingTime: next,
          fundingIntervalHours: next && after && after > next ? (after - next) / 36e5 : void 0
        });
      }
      handleMessage(raw) {
        const msg = raw;
        if (!msg.tick) return;
        if (msg.ch === this.tradeTopic) {
          const fills = msg.tick.data ?? [];
          fills.forEach((t, i) => {
            const qty = t.quantity ?? t.amount * this.contractSize;
            this.emitTrade({ id: `hxf-${msg.tick?.id}-${i}`, venue: this.venue, symbol: this.symbol, timestamp: t.ts, localTimestamp: Date.now(), price: t.price, quantity: qty, quoteVolume: t.price * qty, side: t.direction, marketType: "perpetual" });
          });
        } else if (msg.ch === this.depthTopic) {
          this.replaceBook(msg.tick, this.contractSize);
        }
      }
    };
  }
});

// src/lib/adapters/exchanges.ts
function createAdapter(venue, symbol) {
  switch (venue) {
    case "binance-futures":
      return new BinanceFuturesAdapter(symbol);
    case "bybit-futures":
      return new BybitFuturesAdapter(symbol);
    case "bybit-spot":
      return new BybitSpotAdapter(symbol);
    case "okx-futures":
      return new OKXFuturesAdapter(symbol);
    case "okx-spot":
      return new OKXSpotAdapter(symbol);
    case "binance-spot":
      return new BinanceSpotAdapter(symbol);
    case "hyperliquid":
      return new HyperliquidAdapter(symbol);
    case "bitget-futures":
      return new BitgetFuturesAdapter(symbol);
    case "bitget-spot":
      return new BitgetSpotAdapter(symbol);
    case "coinbase-spot":
      return new CoinbaseSpotAdapter(symbol);
    case "gate-futures":
      return new GateFuturesAdapter(symbol);
    case "gate-spot":
      return new GateSpotAdapter(symbol);
    case "kucoin-futures":
      return new KucoinFuturesAdapter(symbol);
    case "kucoin-spot":
      return new KucoinSpotAdapter(symbol);
    case "kraken-futures":
      return new KrakenFuturesAdapter(symbol);
    case "kraken-spot":
      return new KrakenSpotAdapter(symbol);
    case "htx-futures":
      return new HtxFuturesAdapter(symbol);
    case "htx-spot":
      return new HtxSpotAdapter(symbol);
    case "deribit":
      return new DeribitAdapter(symbol);
    default:
      return null;
  }
}
var DeribitAdapter;
var init_exchanges = __esm({
  "src/lib/adapters/exchanges.ts"() {
    "use strict";
    init_base();
    init_book();
    init_bybit();
    init_okx();
    init_bitget();
    init_hyperliquid();
    init_coinbase();
    init_binance();
    init_gate();
    init_kucoin();
    init_kraken();
    init_htx();
    DeribitAdapter = class extends BaseExchangeAdapter {
      venue = "deribit";
      BASE_WS = "wss://www.deribit.com/ws/api/v2";
      reqId = 1;
      constructor(symbol) {
        let s = symbol.toUpperCase();
        const base = s.replace("USDT", "").replace("USD", "");
        s = `${base}-PERPETUAL`;
        super(s);
      }
      buildWsUrl() {
        return this.BASE_WS;
      }
      connect() {
        this.setStatus("connecting");
        this.ws = new WebSocket(this.buildWsUrl());
        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.lastHeartbeat = Date.now();
          this.setStatus("live");
          this.send({ jsonrpc: "2.0", id: this.reqId++, method: "public/subscribe", params: { channels: [`trades.${this.symbol}.100ms`, `book.${this.symbol}.none.20.100ms`, `ticker.${this.symbol}.100ms`] } });
          this.startPing(15e3);
        };
        this.ws.onmessage = (e) => {
          this.lastHeartbeat = Date.now();
          if (this.status === "error" || this.status === "connecting") this.setStatus("live");
          try {
            this.handleMessage(JSON.parse(e.data));
          } catch {
          }
        };
        this.ws.onerror = () => this.setStatus("error");
        this.ws.onclose = () => {
          this.stopPing();
          if (this.status !== "offline") {
            this.setStatus("connecting");
            this.reconnect();
          }
        };
      }
      disconnect() {
        this.setStatus("offline");
        this.stopPing();
        this.ws?.close();
        this.ws = null;
      }
      send(obj) {
        if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(obj));
      }
      handleMessage(raw) {
        const msg = raw;
        if (msg.method !== "subscription" || !msg.params) return;
        const { channel, data } = msg.params;
        if (channel.startsWith("trades.")) {
          for (const t of data) {
            const quantity = t.amount / t.price;
            this.emitTrade({ id: `db-${t.trade_id}`, venue: this.venue, symbol: t.instrument_name, timestamp: t.timestamp, localTimestamp: Date.now(), price: t.price, quantity, quoteVolume: t.price * quantity, side: t.direction, marketType: "perpetual" });
            if (t.liquidation) {
              const takerSide = t.direction === "sell" ? "long" : "short";
              const makerSide = takerSide === "long" ? "short" : "long";
              const sides = t.liquidation === "M" ? [makerSide] : t.liquidation === "T" ? [takerSide] : [takerSide, makerSide];
              for (const side of sides) {
                this.emitLiquidation({ id: `dbl-${t.trade_id}-${side}`, symbol: t.instrument_name, timestamp: t.timestamp, price: t.price, quantity, side });
              }
            }
          }
        } else if (channel.startsWith("book.")) {
          const d = data;
          const isDelta = d.bids.concat(d.asks).some((level) => typeof level[0] === "string");
          if (!isDelta || d.type === "snapshot") {
            this.bids.clear();
            this.asks.clear();
          }
          for (const [side, levels] of [[this.bids, d.bids], [this.asks, d.asks]]) {
            for (const level of levels) {
              const price = Number(level.length === 3 ? level[1] : level[0]);
              const amount = Number(level.length === 3 ? level[2] : level[1]);
              const removed = level.length === 3 && level[0] === "delete";
              if (removed || !(amount > 0) || !(price > 0)) side.delete(price);
              else side.set(price, amount / price);
            }
          }
          emitBook(this, this.bids, this.asks, (b) => this.emitOrderBook(b));
        } else if (channel.startsWith("ticker.")) {
          const t = data;
          const mark = num(t.mark_price);
          const oiUsd = num(t.open_interest);
          this.emitDerivatives({
            openInterest: mark && oiUsd ? oiUsd / mark : void 0,
            fundingRate: num(t.funding_8h),
            fundingIntervalHours: 8,
            markPrice: mark,
            indexPrice: num(t.index_price),
            timestamp: num(t.timestamp)
          });
        }
      }
      sendPing() {
        this.send({ jsonrpc: "2.0", id: this.reqId++, method: "public/test", params: {} });
      }
      pingTimer = null;
      startPing(ms) {
        this.pingTimer = setInterval(() => this.sendPing(), ms);
      }
      stopPing() {
        if (this.pingTimer) clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
    };
  }
});

// src/lib/session/adapterPool.ts
function key(venue, symbol, marketType) {
  return `${venue}:${marketType}:${symbol.toUpperCase()}`;
}
function acquireAdapter(venue, symbol, marketType) {
  const poolKey = key(venue, symbol, marketType);
  const existing = pool.get(poolKey);
  if (existing) {
    existing.references++;
    return existing.adapter;
  }
  const adapter = createAdapter(venue, symbol);
  if (!adapter) return null;
  pool.set(poolKey, { adapter, references: 1 });
  adapter.connect();
  return adapter;
}
function releaseAdapter(venue, symbol, marketType) {
  const poolKey = key(venue, symbol, marketType);
  const pooled = pool.get(poolKey);
  if (!pooled) return;
  pooled.references--;
  if (pooled.references <= 0) {
    pooled.adapter.disconnect();
    pool.delete(poolKey);
  }
}
var pool;
var init_adapterPool = __esm({
  "src/lib/session/adapterPool.ts"() {
    "use strict";
    init_exchanges();
    pool = /* @__PURE__ */ new Map();
  }
});

// src/lib/aggregation/marketAggregation.ts
function aggregateBooks(books) {
  if (books.size === 0) return null;
  const bidMap = /* @__PURE__ */ new Map();
  const askMap = /* @__PURE__ */ new Map();
  const venues = [...books.keys()];
  for (const book of books.values()) {
    for (const level of book.bids) bidMap.set(level.price, (bidMap.get(level.price) ?? 0) + level.size);
    for (const level of book.asks) askMap.set(level.price, (askMap.get(level.price) ?? 0) + level.size);
  }
  const bids = toLevels(bidMap, "desc", venues);
  const asks = toLevels(askMap, "asc", venues);
  const bestBid = bids[0]?.price ?? 0;
  const bestAsk = asks[0]?.price ?? 0;
  const midPrice = bestBid && bestAsk ? (bestBid + bestAsk) / 2 : bestBid || bestAsk;
  const spread = bestBid && bestAsk ? bestAsk - bestBid : 0;
  return {
    bids,
    asks,
    venues,
    timestamp: Math.max(...[...books.values()].map((book) => book.timestamp)),
    spread,
    spreadPct: midPrice ? spread / midPrice * 100 : 0,
    midPrice
  };
}
function toLevels(levels, direction, venues) {
  return [...levels.entries()].sort((a, b) => direction === "desc" ? b[0] - a[0] : a[0] - b[0]).slice(0, 100).map(([price, size]) => ({ price, size, venue: venues.length === 1 ? venues[0] : void 0 }));
}
function computeBandObi(books, aggregate) {
  if (!aggregate.midPrice || books.size === 0) return { bidVolume: 0, askVolume: 0 };
  const coverage = [...books.values()].map((book) => {
    const distances = [
      ...book.bids.map((level) => Math.abs(level.price - aggregate.midPrice)),
      ...book.asks.map((level) => Math.abs(level.price - aggregate.midPrice))
    ];
    return distances.length ? Math.max(...distances) : 0;
  });
  const band = Math.min(...coverage);
  return {
    bidVolume: aggregate.bids.filter((level) => aggregate.midPrice - level.price <= band).reduce((sum, level) => sum + level.size, 0),
    askVolume: aggregate.asks.filter((level) => level.price - aggregate.midPrice <= band).reduce((sum, level) => sum + level.size, 0)
  };
}
var init_marketAggregation = __esm({
  "src/lib/aggregation/marketAggregation.ts"() {
    "use strict";
  }
});

// src/lib/engine/orderFlowEngine.ts
function getCandleOpenTime(timestamp, timeframe) {
  const ms = TIMEFRAME_MS[timeframe];
  return Math.floor(timestamp / ms) * ms;
}
function roundToTick(price, tickSize) {
  if (!Number.isFinite(price) || tickSize <= 0) return price;
  const index = Math.round(price / tickSize);
  const decimals = getTickDecimals(tickSize);
  return Number((index * tickSize).toFixed(decimals + 2));
}
function getTickDecimals(tickSize) {
  if (!Number.isFinite(tickSize) || tickSize <= 0) return 0;
  for (let decimals = 0; decimals <= 10; decimals++) {
    const scaled = tickSize * 10 ** decimals;
    if (Math.abs(scaled - Math.round(scaled)) < 1e-9 * Math.max(1, scaled)) return decimals;
  }
  return 10;
}
function createEmptyCandle(openTime, timeframe) {
  const ms = TIMEFRAME_MS[timeframe];
  return {
    openTime,
    closeTime: openTime + ms - 1,
    open: 0,
    high: -Infinity,
    low: Infinity,
    close: 0,
    volume: 0,
    delta: 0,
    cumulativeDelta: 0,
    levels: /* @__PURE__ */ new Map(),
    sortedPrices: [],
    tradeCount: 0,
    maxVolumeAtLevel: 0,
    complete: false,
    venueVolumes: {}
  };
}
function applyTradeToCandle(candle, trade, tickSize, imbalanceThreshold) {
  const roundedPrice = roundToTick(trade.price, tickSize);
  if (candle.open === 0) candle.open = trade.price;
  candle.close = trade.price;
  if (trade.price > candle.high) candle.high = trade.price;
  if (trade.price < candle.low) candle.low = trade.price;
  let level = candle.levels.get(roundedPrice);
  if (!level) {
    level = {
      price: roundedPrice,
      bidVolume: 0,
      askVolume: 0,
      totalVolume: 0,
      delta: 0,
      tradeCount: 0,
      buyTrades: 0,
      sellTrades: 0,
      maxTradeSize: 0,
      imbalance: "neutral",
      isHighVolume: false,
      zScore: 0
    };
    candle.levels.set(roundedPrice, level);
    insertSorted(candle.sortedPrices, roundedPrice);
  }
  if (trade.side === "buy") {
    level.askVolume += trade.quantity;
    level.buyTrades += 1;
  } else {
    level.bidVolume += trade.quantity;
    level.sellTrades += 1;
  }
  level.totalVolume += trade.quantity;
  level.delta = level.askVolume - level.bidVolume;
  level.tradeCount += 1;
  if (trade.quantity > level.maxTradeSize) level.maxTradeSize = trade.quantity;
  if (level.bidVolume > 0 && level.askVolume / level.bidVolume >= imbalanceThreshold) {
    level.imbalance = "ask";
  } else if (level.askVolume > 0 && level.bidVolume / level.askVolume >= imbalanceThreshold) {
    level.imbalance = "bid";
  } else {
    level.imbalance = "neutral";
  }
  candle.volume += trade.quantity;
  candle.venueVolumes[trade.venue] = (candle.venueVolumes[trade.venue] ?? 0) + trade.quantity;
  candle.tradeCount += 1;
  if (trade.side === "buy") {
    candle.delta += trade.quantity;
  } else {
    candle.delta -= trade.quantity;
  }
  if (level.totalVolume > candle.maxVolumeAtLevel) {
    candle.maxVolumeAtLevel = level.totalVolume;
  }
  return candle;
}
function applyZScores(candle, allLevels) {
  if (allLevels.length < 2) return;
  const volumes = allLevels.map((l) => l.totalVolume);
  const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const variance = volumes.reduce((a, b) => a + (b - mean) ** 2, 0) / volumes.length;
  const std = Math.sqrt(variance);
  if (std === 0) return;
  for (const level of candle.levels.values()) {
    level.zScore = (level.totalVolume - mean) / std;
    level.isHighVolume = level.zScore >= 2;
  }
}
function computeVolumeProfile(candles, valueAreaPct = 0.7) {
  const map = /* @__PURE__ */ new Map();
  for (const candle of candles) {
    for (const [price, level] of candle.levels) {
      const existing = map.get(price) ?? { bid: 0, ask: 0, trades: 0 };
      existing.bid += level.bidVolume;
      existing.ask += level.askVolume;
      existing.trades += level.tradeCount;
      map.set(price, existing);
    }
  }
  const prices = [...map.keys()].sort((a, b) => a - b);
  const totalVol = prices.reduce((s, p) => s + (map.get(p)?.bid ?? 0) + (map.get(p)?.ask ?? 0), 0);
  let pocPrice = prices[0] ?? 0;
  let pocVol = 0;
  for (const p of prices) {
    const d = map.get(p);
    const v = d.bid + d.ask;
    if (v > pocVol) {
      pocVol = v;
      pocPrice = p;
    }
  }
  const target = totalVol * valueAreaPct;
  let vah = pocPrice;
  let val = pocPrice;
  let accumulated = pocVol;
  let hi = prices.indexOf(pocPrice);
  let lo = hi;
  while (accumulated < target && (hi < prices.length - 1 || lo > 0)) {
    const nextHiVol = hi < prices.length - 1 ? ((d) => d.bid + d.ask)(map.get(prices[hi + 1])) : 0;
    const nextLoVol = lo > 0 ? ((d) => d.bid + d.ask)(map.get(prices[lo - 1])) : 0;
    if (nextHiVol >= nextLoVol && hi < prices.length - 1) {
      hi++;
      vah = prices[hi];
      accumulated += nextHiVol;
    } else if (lo > 0) {
      lo--;
      val = prices[lo];
      accumulated += nextLoVol;
    } else {
      break;
    }
  }
  const levels = prices.map((price) => {
    const d = map.get(price);
    const tv = d.bid + d.ask;
    return {
      price,
      totalVolume: tv,
      bidVolume: d.bid,
      askVolume: d.ask,
      delta: d.ask - d.bid,
      tradeCount: d.trades,
      isPOC: price === pocPrice,
      isVAH: price === vah,
      isVAL: price === val
    };
  });
  const buyVolume = levels.reduce((s, l) => s + l.askVolume, 0);
  const sellVolume = levels.reduce((s, l) => s + l.bidVolume, 0);
  return {
    levels,
    poc: pocPrice,
    vah,
    val,
    totalVolume: totalVol,
    buyVolume,
    sellVolume,
    delta: buyVolume - sellVolume
  };
}
function computeOBI(bidVolume, askVolume) {
  const total = bidVolume + askVolume;
  if (total === 0) return 0;
  return (bidVolume - askVolume) / total;
}
function insertSorted(arr, val) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + hi >>> 1;
    if (arr[mid] < val) lo = mid + 1;
    else hi = mid;
  }
  if (arr[lo] !== val) arr.splice(lo, 0, val);
}
var TIMEFRAME_MS;
var init_orderFlowEngine = __esm({
  "src/lib/engine/orderFlowEngine.ts"() {
    "use strict";
    TIMEFRAME_MS = {
      "1m": 6e4,
      "5m": 3e5,
      "15m": 9e5,
      "30m": 18e5,
      "1h": 36e5,
      "4h": 144e5
    };
  }
});

// src/lib/engine/analytics.ts
function secondsPerYear(_marketType) {
  return SECONDS_PER_YEAR.crypto;
}
function createFlowBar(time, price, cvd) {
  return {
    time,
    open: price,
    high: price,
    low: price,
    close: price,
    volume: 0,
    buyVolume: 0,
    sellVolume: 0,
    trades: 0,
    cvd
  };
}
function resampleBars(bars, seconds) {
  if (seconds <= 1) return bars;
  const bucketMs = seconds * 1e3;
  const out = [];
  let current = null;
  for (const bar of bars) {
    const bucket = Math.floor(bar.time / bucketMs) * bucketMs;
    if (!current || current.time !== bucket) {
      if (current) out.push(current);
      current = { ...bar, time: bucket };
      continue;
    }
    current.high = Math.max(current.high, bar.high);
    current.low = Math.min(current.low, bar.low);
    current.close = bar.close;
    current.volume += bar.volume;
    current.buyVolume += bar.buyVolume;
    current.sellVolume += bar.sellVolume;
    current.trades += bar.trades;
    current.cvd = bar.cvd;
  }
  if (current) out.push(current);
  return out;
}
function rollingVolumeZScores(bars, window, minSamples = Math.min(window, 10)) {
  const out = new Array(bars.length);
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < bars.length; i++) {
    const n = Math.min(i, window);
    let mean = null;
    let std = null;
    let z2 = null;
    if (n >= Math.max(2, minSamples)) {
      mean = sum / n;
      const variance = Math.max(0, (sumSq - n * mean * mean) / (n - 1));
      std = Math.sqrt(variance);
      z2 = std > 0 ? (bars[i].volume - mean) / std : 0;
    }
    out[i] = {
      time: bars[i].time,
      z: z2,
      volume: bars[i].volume,
      buyVolume: bars[i].buyVolume,
      sellVolume: bars[i].sellVolume,
      mean,
      std
    };
    sum += bars[i].volume;
    sumSq += bars[i].volume ** 2;
    if (i - window >= 0) {
      sum -= bars[i - window].volume;
      sumSq -= bars[i - window].volume ** 2;
    }
  }
  return out;
}
function rollingRealizedVolatility(bars, window, barSeconds, yearSeconds, minSamples = Math.min(window, 10)) {
  const annualize = Math.sqrt(yearSeconds / barSeconds);
  const returns2 = new Array(bars.length).fill(0);
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1].close;
    const curr = bars[i].close;
    returns2[i] = prev > 0 && curr > 0 ? Math.log(curr / prev) : 0;
  }
  const out = new Array(bars.length);
  let sumSq = 0;
  for (let i = 0; i < bars.length; i++) {
    if (i >= 1) sumSq += returns2[i] ** 2;
    if (i - window >= 1) sumSq -= returns2[i - window] ** 2;
    const n = Math.min(i, window);
    out[i] = {
      time: bars[i].time,
      value: n >= Math.max(2, minSamples) ? Math.sqrt(Math.max(0, sumSq) / n) * annualize * 100 : null
    };
  }
  return out;
}
function createSessionStats(startTime, price) {
  return {
    startTime,
    open: price,
    high: price,
    low: price,
    last: price,
    volume: 0,
    notional: 0,
    buyVolume: 0,
    sellVolume: 0,
    trades: 0,
    maxTrade: 0,
    vwap: price,
    vwapStd: 0,
    sumPQ: 0,
    sumP2Q: 0,
    lastTradeLagMs: 0
  };
}
function applyTradeToSession(stats, price, quantity, side, lagMs) {
  stats.last = price;
  if (price > stats.high) stats.high = price;
  if (price < stats.low) stats.low = price;
  stats.volume += quantity;
  stats.notional += price * quantity;
  if (side === "buy") stats.buyVolume += quantity;
  else stats.sellVolume += quantity;
  stats.trades += 1;
  if (quantity > stats.maxTrade) stats.maxTrade = quantity;
  stats.sumPQ += price * quantity;
  stats.sumP2Q += price * price * quantity;
  if (stats.volume > 0) {
    stats.vwap = stats.sumPQ / stats.volume;
    const variance = stats.sumP2Q / stats.volume - stats.vwap * stats.vwap;
    stats.vwapStd = Math.sqrt(Math.max(0, variance));
  }
  stats.lastTradeLagMs = lagMs;
}
function resolveTickSize(price, _marketType) {
  if (!Number.isFinite(price) || price <= 0) return 1;
  const raw = price * 1e-4;
  const exponent = Math.floor(Math.log10(raw));
  const magnitude = 10 ** exponent;
  const normalized = raw / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return Number((nice * magnitude).toPrecision(6));
}
var SECONDS_PER_YEAR;
var init_analytics = __esm({
  "src/lib/engine/analytics.ts"() {
    "use strict";
    SECONDS_PER_YEAR = {
      // Crypto trades 24/7.
      crypto: 365 * 86400
    };
  }
});

// src/lib/engine/derivatives.ts
function mergeDerivatives(previous, update) {
  const merged = { ...previous ?? { venue: update.venue }, timestamp: update.timestamp };
  for (const [key2, value] of Object.entries(update)) {
    if (value !== void 0) merged[key2] = value;
  }
  return merged;
}
function fundingRate8h(snapshot) {
  if (snapshot.fundingRate === void 0) return void 0;
  const hours = snapshot.fundingIntervalHours ?? DEFAULT_FUNDING_HOURS;
  return snapshot.fundingRate * (8 / hours);
}
function annualizeFunding(rate, intervalHours = DEFAULT_FUNDING_HOURS) {
  return rate * (24 / intervalHours) * 365;
}
function aggregateDerivatives(snapshots, primaryVenue, referencePrice, oiVenues) {
  if (!snapshots.length) return null;
  const primary = snapshots.find((s) => s.venue === primaryVenue) ?? snapshots[0];
  let oi = 0;
  let oiValue = 0;
  let oiCount = 0;
  for (const s of snapshots) {
    if (s.openInterest === void 0) continue;
    if (oiVenues && !oiVenues.has(s.venue)) continue;
    oi += s.openInterest;
    oiValue += s.openInterest * (s.markPrice ?? referencePrice ?? 0);
    oiCount++;
  }
  const weighted = (value) => {
    let sum = 0;
    let weight = 0;
    for (const s of snapshots) {
      const v = value(s);
      if (v === void 0 || !Number.isFinite(v)) continue;
      const w = s.openInterest && s.openInterest > 0 ? s.openInterest : 1;
      sum += v * w;
      weight += w;
    }
    return weight > 0 ? sum / weight : null;
  };
  return {
    timestamp: Math.max(...snapshots.map((s) => s.timestamp)),
    venues: snapshots,
    openInterest: oiCount ? oi : null,
    openInterestValue: oiCount && oiValue > 0 ? oiValue : null,
    fundingRate8h: weighted(fundingRate8h),
    nextFundingTime: primary.nextFundingTime ?? null,
    fundingIntervalHours: primary.fundingRate !== void 0 ? primary.fundingIntervalHours ?? DEFAULT_FUNDING_HOURS : null,
    primaryFundingRate: primary.fundingRate ?? null,
    markPrice: weighted((s) => s.markPrice),
    indexPrice: weighted((s) => s.indexPrice),
    basisBps: weighted((s) => s.markPrice && s.indexPrice ? (s.markPrice - s.indexPrice) / s.indexPrice * 1e4 : void 0)
  };
}
function classifyOIRegime(priceChange, oiChange, priceThreshold = 5e-4, oiThreshold = 1e-3) {
  if (Math.abs(priceChange) < priceThreshold || Math.abs(oiChange) < oiThreshold) return "neutral";
  if (priceChange > 0) return oiChange > 0 ? "new-longs" : "short-covering";
  return oiChange > 0 ? "new-shorts" : "long-unwind";
}
function oiWindowChange(history, windowMs) {
  if (history.length < 2) return null;
  const to = history[history.length - 1];
  const cutoff = to.time - windowMs;
  let lo = 0;
  let hi = history.length - 1;
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (history[mid].time < cutoff) lo = mid + 1;
    else hi = mid;
  }
  const from = history[lo];
  if (from === to || !(from.openInterest > 0) || !(from.price > 0)) return null;
  const priceChange = (to.price - from.price) / from.price;
  const oiChange = (to.openInterest - from.openInterest) / from.openInterest;
  return {
    priceChange,
    oiChange,
    oiDelta: to.openInterest - from.openInterest,
    regime: classifyOIRegime(priceChange, oiChange),
    from,
    to
  };
}
function bucketLiquidations(liquidations, bucketMs, count, now2) {
  const end = Math.floor(now2 / bucketMs) * bucketMs;
  const start = end - (count - 1) * bucketMs;
  const buckets = Array.from({ length: count }, (_, i) => ({
    time: start + i * bucketMs,
    longNotional: 0,
    shortNotional: 0,
    longQty: 0,
    shortQty: 0,
    count: 0
  }));
  for (const l of liquidations) {
    const index = Math.floor((l.timestamp - start) / bucketMs);
    if (index < 0 || index >= count) continue;
    const b = buckets[index];
    if (l.side === "long") {
      b.longNotional += l.quoteVolume;
      b.longQty += l.quantity;
    } else {
      b.shortNotional += l.quoteVolume;
      b.shortQty += l.quantity;
    }
    b.count++;
  }
  return buckets;
}
function summarizeLiquidations(liquidations, since) {
  const summary = { longNotional: 0, shortNotional: 0, count: 0, largest: null };
  for (let i = liquidations.length - 1; i >= 0; i--) {
    const l = liquidations[i];
    if (l.timestamp < since - ARRIVAL_SLACK_MS) break;
    if (l.timestamp < since) continue;
    if (l.side === "long") summary.longNotional += l.quoteVolume;
    else summary.shortNotional += l.quoteVolume;
    summary.count++;
    if (!summary.largest || l.quoteVolume > summary.largest.quoteVolume) summary.largest = l;
  }
  return summary;
}
function isLiquidationCascade(buckets, multiple = 5, floor = 0) {
  if (buckets.length < 4) return false;
  const last = buckets[buckets.length - 1];
  const total = last.longNotional + last.shortNotional;
  if (total <= floor) return false;
  const history = buckets.slice(0, -1).map((b) => b.longNotional + b.shortNotional).filter((v) => v > 0).sort((a, b) => a - b);
  if (history.length < 3) return false;
  const median = history[Math.floor(history.length / 2)];
  return total >= median * multiple;
}
var DEFAULT_FUNDING_HOURS, LIQUIDATION_FEED_VENUES, OI_REGIME_LABEL, OI_REGIME_HINT, ARRIVAL_SLACK_MS;
var init_derivatives = __esm({
  "src/lib/engine/derivatives.ts"() {
    "use strict";
    DEFAULT_FUNDING_HOURS = 8;
    LIQUIDATION_FEED_VENUES = /* @__PURE__ */ new Set([
      "binance-futures",
      "bybit-futures",
      "okx-futures",
      "deribit"
    ]);
    OI_REGIME_LABEL = {
      "new-longs": "New longs",
      "short-covering": "Short covering",
      "new-shorts": "New shorts",
      "long-unwind": "Long unwind",
      neutral: "Balanced"
    };
    OI_REGIME_HINT = {
      "new-longs": "Price up with rising open interest: fresh long positioning is driving the move.",
      "short-covering": "Price up with falling open interest: shorts are closing; the rally is driven by exits, not new demand.",
      "new-shorts": "Price down with rising open interest: fresh short positioning is driving the move.",
      "long-unwind": "Price down with falling open interest: longs are closing or being liquidated.",
      neutral: "Price or open interest is roughly flat over the window."
    };
    ARRIVAL_SLACK_MS = 6e4;
  }
});

// src/lib/session/RingBuffer.ts
var RingBuffer;
var init_RingBuffer = __esm({
  "src/lib/session/RingBuffer.ts"() {
    "use strict";
    RingBuffer = class {
      constructor(capacity) {
        this.capacity = capacity;
        this.values = new Array(capacity);
      }
      capacity;
      values;
      cursor = 0;
      length = 0;
      push(value) {
        this.values[this.cursor] = value;
        this.cursor = (this.cursor + 1) % this.capacity;
        this.length = Math.min(this.length + 1, this.capacity);
      }
      get size() {
        return this.length;
      }
      clear() {
        this.cursor = 0;
        this.length = 0;
      }
      newestFirst() {
        return Array.from({ length: this.length }, (_, index) => {
          const position = (this.cursor - 1 - index + this.capacity) % this.capacity;
          return this.values[position];
        });
      }
    };
  }
});

// src/lib/engine/depthHistory.ts
function bookSides(book) {
  return {
    bids: book.bids.map((l) => [l.price, l.size]),
    asks: book.asks.map((l) => [l.price, l.size])
  };
}
var DEPTH_INTERVAL_MS, DEPTH_BAND, DEPTH_CAPACITY, DepthHistory;
var init_depthHistory = __esm({
  "src/lib/engine/depthHistory.ts"() {
    "use strict";
    DEPTH_INTERVAL_MS = 1e3;
    DEPTH_BAND = 0.03;
    DEPTH_CAPACITY = 7200;
    DepthHistory = class {
      constructor(capacity = DEPTH_CAPACITY) {
        this.capacity = capacity;
        this.ring = new Array(capacity);
      }
      capacity;
      ring;
      nextSeq = 0;
      _tick = 0;
      /** Bumped on every change, so renderers know when to rebuild. */
      version = 0;
      /** Bumped when existing data is invalidated (tick change, clear). */
      epoch = 0;
      get tick() {
        return this._tick;
      }
      get size() {
        return Math.min(this.nextSeq, this.capacity);
      }
      get firstSeq() {
        return Math.max(0, this.nextSeq - this.capacity);
      }
      get lastSeq() {
        return this.nextSeq - 1;
      }
      clear() {
        this.ring = new Array(this.capacity);
        this.nextSeq = 0;
        this.version++;
        this.epoch++;
      }
      /**
       * Sum the venues' levels into tick buckets within ±DEPTH_BAND of `mid`
       * and append a snapshot. Returns the snapshot (for recording) or null.
       */
      add(time, sides, tick, mid) {
        if (!(tick > 0) || !(mid > 0)) return null;
        const lo = mid * (1 - DEPTH_BAND);
        const hi = mid * (1 + DEPTH_BAND);
        const buckets = /* @__PURE__ */ new Map();
        for (const side of sides) {
          for (const levels of [side.bids, side.asks]) {
            for (const [price, size2] of levels) {
              if (!(size2 > 0) || price < lo || price > hi) continue;
              const index2 = Math.round(price / tick);
              buckets.set(index2, (buckets.get(index2) ?? 0) + size2);
            }
          }
        }
        if (buckets.size === 0) return null;
        const sorted = [...buckets.entries()].sort((a, b) => a[0] - b[0]);
        const index = new Int32Array(sorted.length);
        const size = new Float32Array(sorted.length);
        sorted.forEach(([i, s], k) => {
          index[k] = i;
          size[k] = s;
        });
        return this.addSnapshot(time, index, size, tick);
      }
      /** Append prebuilt bucket arrays (used when replaying a recording). */
      addSnapshot(time, index, size, tick) {
        if (!(tick > 0) || !index.length) return null;
        if (tick !== this._tick) {
          this.clear();
          this._tick = tick;
        }
        const bucketTime = Math.floor(time / DEPTH_INTERVAL_MS) * DEPTH_INTERVAL_MS;
        const last = this.get(this.lastSeq);
        let snapshot;
        if (last && last.time === bucketTime) {
          snapshot = { seq: last.seq, time: bucketTime, index, size };
        } else {
          snapshot = { seq: this.nextSeq++, time: bucketTime, index, size };
        }
        this.ring[snapshot.seq % this.capacity] = snapshot;
        this.version++;
        return snapshot;
      }
      get(seq) {
        if (seq < this.firstSeq || seq > this.lastSeq) return void 0;
        return this.ring[seq % this.capacity];
      }
      /** First sequence number whose snapshot time is ≥ `time` (lastSeq + 1 if none). */
      seqAtOrAfter(time) {
        let lo = this.firstSeq;
        let hi = this.nextSeq;
        while (lo < hi) {
          const mid = lo + hi >> 1;
          if (this.get(mid).time < time) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }
    };
  }
});

// src/lib/engine/microstructure.ts
function sizeAt(levels, price) {
  for (const level of levels) if (level.price === price) return level.size;
  return 0;
}
var nextId, id, DEFAULT_ABSORPTION, AbsorptionDetector, DEFAULT_ICEBERG, IcebergDetector;
var init_microstructure = __esm({
  "src/lib/engine/microstructure.ts"() {
    "use strict";
    nextId = 0;
    id = (kind) => `${kind}-${++nextId}`;
    DEFAULT_ABSORPTION = {
      windowMs: 1e4,
      minRatio: 1,
      minShare: 0.5,
      slackTicks: 1,
      warmupWindows: 6
    };
    AbsorptionDetector = class {
      constructor(tick, options2 = DEFAULT_ABSORPTION) {
        this.tick = tick;
        this.options = options2;
      }
      tick;
      options;
      window = null;
      totals = [];
      setTick(tick) {
        if (tick === this.tick) return;
        this.tick = tick;
        this.window = null;
        this.totals = [];
      }
      /** Feed one trade; returns any absorption confirmed by a window that just closed. */
      onTrade(trade) {
        if (!(this.tick > 0)) return [];
        const start = Math.floor(trade.timestamp / this.options.windowMs) * this.options.windowMs;
        let events = [];
        if (this.window && start > this.window.start) {
          events = this.close(this.window);
          this.window = null;
        }
        if (!this.window) this.window = { start, buy: /* @__PURE__ */ new Map(), sell: /* @__PURE__ */ new Map(), buyTotal: 0, sellTotal: 0, high: -Infinity, low: Infinity, close: 0, closePrice: 0 };
        const w = this.window;
        const index = Math.round(trade.price / this.tick);
        const side = trade.side === "buy" ? w.buy : w.sell;
        side.set(index, (side.get(index) ?? 0) + trade.quantity);
        if (trade.side === "buy") w.buyTotal += trade.quantity;
        else w.sellTotal += trade.quantity;
        w.high = Math.max(w.high, index);
        w.low = Math.min(w.low, index);
        w.close = index;
        w.closePrice = trade.price;
        return events;
      }
      close(w) {
        const total = w.buyTotal + w.sellTotal;
        const prior = this.totals;
        const ready = prior.length >= this.options.warmupWindows;
        const average = ready ? prior.reduce((a, b) => a + b, 0) / prior.length : 0;
        prior.push(total);
        if (prior.length > 30) prior.shift();
        if (!ready || average <= 0) return [];
        const out = [];
        const { minRatio, minShare, slackTicks } = this.options;
        const end = w.start + this.options.windowMs;
        for (const [index, volume] of w.sell) {
          if (volume < average * minRatio || volume < w.sellTotal * minShare) continue;
          if (w.low < index - slackTicks || w.close < index) continue;
          const price = index * this.tick;
          out.push({ id: id("absorption"), kind: "absorption", side: "bid", price, time: end, start: w.start, volume, notional: volume * price, ratio: volume / average });
        }
        for (const [index, volume] of w.buy) {
          if (volume < average * minRatio || volume < w.buyTotal * minShare) continue;
          if (w.high > index + slackTicks || w.close > index) continue;
          const price = index * this.tick;
          out.push({ id: id("absorption"), kind: "absorption", side: "ask", price, time: end, start: w.start, volume, notional: volume * price, ratio: volume / average });
        }
        return out;
      }
    };
    DEFAULT_ICEBERG = {
      minTradedRatio: 1.5,
      minRefillShare: 0.5,
      idleMs: 3e3,
      maxAgeMs: 3e4
    };
    IcebergDetector = class {
      constructor(options2 = DEFAULT_ICEBERG) {
        this.options = options2;
      }
      options;
      candidates = /* @__PURE__ */ new Map();
      reset() {
        this.candidates.clear();
      }
      /** A print against a venue's book. `book` is that venue's latest book. */
      onTrade(trade, book) {
        if (!book) return;
        const side = trade.side === "sell" ? "bid" : "ask";
        const key2 = `${trade.venue}:${side}:${trade.price}`;
        let c = this.candidates.get(key2);
        if (!c) {
          const displayed = sizeAt(side === "bid" ? book.bids : book.asks, trade.price);
          if (!(displayed > 0)) return;
          c = { venue: trade.venue, side, price: trade.price, displayed, shown: displayed, traded: 0, refills: 0, first: trade.timestamp, last: trade.timestamp };
          this.candidates.set(key2, c);
        }
        c.traded += trade.quantity;
        c.last = trade.timestamp;
      }
      /** Track how the hit levels' displayed size evolves. */
      onBook(book) {
        for (const c of this.candidates.values()) {
          if (c.venue !== book.venue) continue;
          const size = sizeAt(c.side === "bid" ? book.bids : book.asks, c.price);
          if (size > c.shown) c.refills++;
          c.shown = size;
        }
      }
      /** Confirm or drop candidates. `minVolume` filters out small prints (e.g. 10× the average print). */
      evaluate(now2, minVolume) {
        const out = [];
        const { minTradedRatio, minRefillShare, idleMs, maxAgeMs } = this.options;
        for (const [key2, c] of this.candidates) {
          const idle = now2 - c.last >= idleMs;
          if (!idle && now2 - c.first < maxAgeMs) continue;
          this.candidates.delete(key2);
          if (c.traded < minVolume) continue;
          if (c.traded < c.displayed * minTradedRatio) continue;
          if (c.shown < c.displayed * minRefillShare || c.refills === 0) continue;
          out.push({
            id: id("iceberg"),
            kind: "iceberg",
            side: c.side,
            price: c.price,
            time: c.last,
            start: c.first,
            volume: c.traded,
            notional: c.traded * c.price,
            venue: c.venue,
            ratio: c.traded / c.displayed
          });
        }
        return out;
      }
    };
  }
});

// src/lib/engine/venues.ts
function grid(list, from, count) {
  const out = new Float64Array(count);
  let j = 0;
  let last = NaN;
  for (let i = 0; i < count; i++) {
    const t = from + i * VENUE_BUCKET_MS;
    while (j < list.length && list[j].time <= t) last = list[j++].close;
    out[i] = last;
  }
  return Number.isFinite(out[0]) ? out : null;
}
function returns(prices) {
  const r = new Float64Array(prices.length - 1);
  for (let i = 1; i < prices.length; i++) r[i - 1] = Math.log(prices[i] / prices[i - 1]);
  return r;
}
function laggedCorrelation(a, b, lag) {
  let sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0, n = 0;
  for (let t = Math.max(0, -lag); t < a.length && t + lag < b.length; t++) {
    const x = a[t];
    const y = b[t + lag];
    sa += x;
    sb += y;
    saa += x * x;
    sbb += y * y;
    sab += x * y;
    n++;
  }
  if (n < 10) return 0;
  const cov = sab / n - sa / n * (sb / n);
  const va = saa / n - (sa / n) ** 2;
  const vb = sbb / n - (sb / n) ** 2;
  return va > 0 && vb > 0 ? cov / Math.sqrt(va * vb) : 0;
}
function venueSummary(series, now2, windowMs = 6e4, leadWindowMs = 15e4, maxLag = 8, minCorr = 0.1) {
  const venues = Object.keys(series).filter((v) => series[v]?.length);
  const lasts = venues.map((v) => series[v][series[v].length - 1].close).sort((a, b) => a - b);
  const median = lasts.length ? lasts[Math.floor(lasts.length / 2)] : 0;
  const since = now2 - windowMs;
  let totalVolume = 0;
  const stats = venues.map((venue) => {
    const list = series[venue];
    let volume = 0;
    let delta = 0;
    for (let i = list.length - 1; i >= 0 && list[i].time >= since; i--) {
      volume += list[i].buy + list[i].sell;
      delta += list[i].buy - list[i].sell;
    }
    totalVolume += volume;
    const last = list[list.length - 1].close;
    return { venue, last, premiumBps: median ? (last - median) / median * 1e4 : 0, volume, share: 0, delta, leadMs: null, leadCorr: null };
  });
  for (const s of stats) s.share = totalVolume ? s.volume / totalVolume : 0;
  const sharedStart = Math.max(now2 - leadWindowMs, ...venues.map((v) => series[v][0].time));
  const from = Math.ceil(sharedStart / VENUE_BUCKET_MS) * VENUE_BUCKET_MS;
  const count = Math.floor((now2 - from) / VENUE_BUCKET_MS);
  if (venues.length >= 2 && count >= MIN_LEAD_BUCKETS) {
    const r = /* @__PURE__ */ new Map();
    for (const venue of venues) {
      const prices = grid(series[venue], from, count);
      if (prices) r.set(venue, returns(prices));
    }
    for (const stat of stats) {
      const own = r.get(stat.venue);
      const others = [...r.entries()].filter(([v]) => v !== stat.venue).map(([, x]) => x);
      if (!own || !others.length) continue;
      const ref = new Float64Array(own.length);
      for (const o of others) for (let i = 0; i < ref.length; i++) ref[i] += o[i] / others.length;
      let bestLag = 0;
      let best = laggedCorrelation(own, ref, 0);
      for (let lag = -maxLag; lag <= maxLag; lag++) {
        if (lag === 0) continue;
        const c = laggedCorrelation(own, ref, lag);
        if (c > best) {
          best = c;
          bestLag = lag;
        }
      }
      if (best < minCorr) continue;
      stat.leadMs = bestLag * VENUE_BUCKET_MS;
      stat.leadCorr = best;
    }
  }
  stats.sort((a, b) => b.volume - a.volume);
  const leaders = stats.filter((s) => s.leadMs !== null && s.leadMs > 0).sort((a, b) => b.leadMs - a.leadMs || b.leadCorr - a.leadCorr);
  return { stats, leader: leaders[0] ?? null };
}
var VENUE_BUCKET_MS, VENUE_BUCKETS, MIN_LEAD_BUCKETS, VenueTracker;
var init_venues = __esm({
  "src/lib/engine/venues.ts"() {
    "use strict";
    VENUE_BUCKET_MS = 250;
    VENUE_BUCKETS = 720;
    MIN_LEAD_BUCKETS = 120;
    VenueTracker = class {
      series = /* @__PURE__ */ new Map();
      clear() {
        this.series.clear();
      }
      onTrade(trade) {
        const time = Math.floor(trade.timestamp / VENUE_BUCKET_MS) * VENUE_BUCKET_MS;
        let list = this.series.get(trade.venue);
        if (!list) {
          list = [];
          this.series.set(trade.venue, list);
        }
        let bucket = list[list.length - 1];
        if (!bucket || time > bucket.time) {
          bucket = { time, close: trade.price, buy: 0, sell: 0, trades: 0 };
          list.push(bucket);
          if (list.length > VENUE_BUCKETS) list.splice(0, list.length - VENUE_BUCKETS);
        } else if (time < bucket.time) {
        } else {
          bucket.close = trade.price;
        }
        if (trade.side === "buy") bucket.buy += trade.quantity;
        else bucket.sell += trade.quantity;
        bucket.trades++;
      }
      snapshot() {
        const out = {};
        for (const [venue, list] of this.series) out[venue] = list.map((b) => ({ ...b }));
        return out;
      }
    };
  }
});

// src/lib/managers/marketDataManager.ts
var FLOW_BAR_MS, MAX_GAP_FILL_BARS, FLUSH_INTERVAL_MS, OI_SAMPLE_MS, OI_LOCK_GRACE_MS, MAX_LIQUIDATION_AGE_MS, BIG_TRADE_MIN_RATIO, BIG_TRADE_WARMUP_TRADES, ICEBERG_MIN_PRINT_RATIO, TAPE_LOG_SIZE, MarketDataManager;
var init_marketDataManager = __esm({
  "src/lib/managers/marketDataManager.ts"() {
    "use strict";
    init_capabilities();
    init_adapterPool();
    init_marketAggregation();
    init_orderFlowEngine();
    init_analytics();
    init_derivatives();
    init_RingBuffer();
    init_depthHistory();
    init_microstructure();
    init_venues();
    FLOW_BAR_MS = 1e3;
    MAX_GAP_FILL_BARS = 120;
    FLUSH_INTERVAL_MS = 50;
    OI_SAMPLE_MS = 1e3;
    OI_LOCK_GRACE_MS = 15e3;
    MAX_LIQUIDATION_AGE_MS = 6e4;
    BIG_TRADE_MIN_RATIO = 5;
    BIG_TRADE_WARMUP_TRADES = 50;
    ICEBERG_MIN_PRINT_RATIO = 10;
    TAPE_LOG_SIZE = 2e4;
    MarketDataManager = class {
      store;
      adapters = /* @__PURE__ */ new Map();
      books = /* @__PURE__ */ new Map();
      listeners = /* @__PURE__ */ new Map();
      currentSymbol = "";
      currentVenue = null;
      currentSelectedVenues = [];
      currentMarketType = "perpetual";
      currentTimeframe = "5m";
      currentTickSize = 10;
      tickResolved = false;
      currentImbalanceThreshold = 3;
      // Working candle state
      currentCandleRef = null;
      previousCandleRef = null;
      // last finalized candle, for late prints
      allLevels = [];
      // rolling window for level z-score
      cumulativeDelta = 0;
      // delta of all finalized candles
      // Flow bars & session
      liveBar = null;
      sessionCvd = 0;
      session = null;
      paused = false;
      flushTimer = null;
      pendingTrades = [];
      pendingOrderBook = null;
      pendingAggregatedBook = null;
      pendingConnections = /* @__PURE__ */ new Map();
      pendingCandle = null;
      profileDirty = false;
      pendingTicker = null;
      pendingOBI = null;
      pendingFlowBars = [];
      // Derivatives (perpetuals)
      derivatives = /* @__PURE__ */ new Map();
      derivativesDirty = false;
      pendingLiquidations = [];
      seenLiquidations = /* @__PURE__ */ new Set();
      pendingOIPoints = [];
      oiVenues = null;
      secondTimer = null;
      subscribedAt = 0;
      lastPrice = 0;
      // Big trades, export log, recording and replay
      pendingBigTrades = [];
      tapeLog = new RingBuffer(TAPE_LOG_SIZE);
      recorder = null;
      replaying = false;
      replayClock = 0;
      lastSecondSample = 0;
      // Microstructure
      /** One-second resting-liquidity snapshots for the heatmap (read by the footprint). */
      depthHistory = new DepthHistory();
      depthDirty = false;
      absorption = new AbsorptionDetector(0);
      icebergs = new IcebergDetector();
      pendingMicro = [];
      venueTracker = new VenueTracker();
      venueDirty = false;
      lastVenueCopy = 0;
      lastMid = 0;
      /** Wall time when live; the replay's virtual time during a replay. */
      clock = () => this.replaying ? this.replayClock : Date.now();
      constructor(store) {
        this.store = store;
      }
      subscribe(venue, symbol, marketType, timeframe, tickSize, imbalanceThreshold, selectedVenues) {
        if (this.replaying) return;
        const venues = selectedVenues?.length ? selectedVenues : venuesForSelection(venue, marketType, symbol);
        if (!venues.length || venues.some((selected) => !venueSupports(selected, symbol, marketType))) {
          this.store.getState().updateConnection({
            venue: venues[0] ?? "bybit-futures",
            status: "error",
            lastHeartbeat: 0,
            reconnectAttempts: 0,
            error: `${venue} does not support ${symbol} ${marketType}`
          });
          return;
        }
        if (this.adapters.size > 0 && this.currentVenue === venue && JSON.stringify(this.currentSelectedVenues) === JSON.stringify(venues) && this.currentSymbol === symbol && this.currentTimeframe === timeframe) {
          return;
        }
        this.disconnect();
        this.currentVenue = venue;
        this.currentSelectedVenues = [...venues];
        this.currentSymbol = symbol;
        this.currentMarketType = marketType;
        this.currentTimeframe = timeframe;
        this.currentTickSize = tickSize;
        this.tickResolved = false;
        this.currentImbalanceThreshold = imbalanceThreshold;
        for (const selectedVenue of venues) {
          const adapter = acquireAdapter(selectedVenue, symbol, marketType);
          if (!adapter) continue;
          const tradeListener = (trade) => this.onTrade(trade);
          const bookListener = (book) => this.onOrderBook(book);
          const statusListener = (conn) => {
            this.pendingConnections.set(conn.venue, conn);
            this.scheduleFlush();
          };
          const liquidationListener = (liquidation) => this.onLiquidation(liquidation);
          const derivativesListener = (snapshot) => this.onDerivatives(snapshot);
          adapter.on("trade", tradeListener);
          adapter.on("orderbook", bookListener);
          adapter.on("status", statusListener);
          adapter.on("liquidation", liquidationListener);
          adapter.on("derivatives", derivativesListener);
          this.adapters.set(selectedVenue, adapter);
          this.listeners.set(selectedVenue, { tradeListener, bookListener, statusListener, liquidationListener, derivativesListener });
        }
        this.subscribedAt = Date.now();
        this.secondTimer = setInterval(() => this.sampleSecond(Date.now()), OI_SAMPLE_MS);
      }
      /** Once-a-second work: open interest, depth snapshot, iceberg confirmation, venue stats. */
      sampleSecond(now2) {
        if (this.paused && !this.replaying) return;
        if (this.currentMarketType === "perpetual") this.sampleOpenInterest(now2);
        if (!this.replaying && this.tickResolved && this.books.size) {
          const sides = [];
          for (const [venue, book] of this.books) sides.push(this.adapters.get(venue)?.depthSides?.() ?? bookSides(book));
          const mid = this.lastMid || this.lastPrice;
          const snapshot = this.depthHistory.add(now2, sides, this.currentTickSize, mid);
          if (snapshot) {
            this.depthDirty = true;
            this.recorder?.depth({ tick: this.currentTickSize, index: snapshot.index, size: snapshot.size }, now2);
          }
        }
        if (this.session && this.session.trades >= BIG_TRADE_WARMUP_TRADES) {
          const average = this.session.volume / this.session.trades;
          const found = this.icebergs.evaluate(this.trackTime(), average * ICEBERG_MIN_PRINT_RATIO);
          if (found.length) this.pendingMicro.push(...found);
        }
        this.scheduleFlush();
      }
      /** Exchange-time "now" for detectors that compare against trade timestamps. */
      trackTime() {
        return this.session ? Math.max(this.clock(), this.session.startTime) : this.clock();
      }
      // ─── Recording ─────────────────────────────────────────────────
      setRecorder(recorder) {
        this.recorder = recorder;
        if (recorder) recorder.seed([...this.books.values()], [...this.derivatives.values()], this.clock());
      }
      get isRecording() {
        return this.recorder !== null;
      }
      get tapeLogSize() {
        return this.tapeLog.size;
      }
      /** Wall time each venue last delivered a trade or book update. */
      lastDataAt = /* @__PURE__ */ new Map();
      /** Latest normalized book per venue (read by the MCP server's per-venue views). */
      getBooks() {
        return this.books;
      }
      /** Full in-memory depth per venue, deeper than the emitted books where the adapter keeps one. */
      getDepthSides() {
        const out = /* @__PURE__ */ new Map();
        for (const [venue, book] of this.books) out.set(venue, this.adapters.get(venue)?.depthSides?.() ?? bookSides(book));
        return out;
      }
      /** Footprint row size in use (resolved from the first print's price). */
      get tickSize() {
        return this.currentTickSize;
      }
      /** Executed prints for export, newest first. */
      getTapeLog() {
        return this.tapeLog.newestFirst();
      }
      // ─── Replay ────────────────────────────────────────────────────
      /** Tear down the live feed and reset state so recorded events can be fed in. */
      beginReplay(config, startTime) {
        this.replaying = false;
        this.disconnect();
        this.replaying = true;
        this.replayClock = startTime;
        this.lastSecondSample = Math.floor(startTime / OI_SAMPLE_MS) * OI_SAMPLE_MS;
        this.subscribedAt = startTime;
        this.currentVenue = config.venue;
        this.currentSelectedVenues = [...config.selectedVenues];
        this.currentSymbol = config.symbol;
        this.currentMarketType = config.marketType;
        this.currentTimeframe = config.timeframe;
        this.currentImbalanceThreshold = config.imbalanceThreshold;
        this.tickResolved = false;
      }
      /** Feed one recorded event; `at` is its original arrival time. */
      ingest(kind, payload, at) {
        if (!this.replaying) return;
        this.advanceClock(at);
        if (kind === "h") {
          const depth = payload;
          if (this.depthHistory.addSnapshot(at, depth.index, depth.size, depth.tick)) this.depthDirty = true;
          this.scheduleFlush();
          return;
        }
        if (kind === "t") this.onTrade(payload);
        else if (kind === "b") this.onOrderBook(payload);
        else if (kind === "l") this.onLiquidation(payload);
        else this.onDerivatives(payload);
      }
      /** Move the virtual clock forward, running the once-a-second work for each second crossed. */
      advanceClock(time) {
        if (!this.replaying || time <= this.replayClock) return;
        this.replayClock = time;
        const target = Math.floor(time / OI_SAMPLE_MS) * OI_SAMPLE_MS;
        let next = Math.max(this.lastSecondSample + OI_SAMPLE_MS, target - 120 * OI_SAMPLE_MS);
        for (; next <= target; next += OI_SAMPLE_MS) this.sampleSecond(next);
        this.lastSecondSample = target;
      }
      /** Flush whatever is pending right away (used after a fast-forward). */
      flushNow() {
        if (this.flushTimer) clearTimeout(this.flushTimer);
        this.flushTimer = null;
        this.flush();
      }
      endReplay() {
        if (!this.replaying) return;
        this.disconnect();
        this.replaying = false;
        this.currentVenue = null;
        this.currentSelectedVenues = [];
        this.currentSymbol = "";
      }
      get isReplaying() {
        return this.replaying;
      }
      disconnect() {
        if (this.flushTimer) clearTimeout(this.flushTimer);
        this.flushTimer = null;
        this.pendingTrades = [];
        this.pendingOrderBook = null;
        this.pendingAggregatedBook = null;
        this.booksDirty = false;
        this.pendingCandle = null;
        this.profileDirty = false;
        this.pendingTicker = null;
        this.pendingOBI = null;
        this.pendingFlowBars = [];
        this.pendingConnections.clear();
        if (this.secondTimer) clearInterval(this.secondTimer);
        this.secondTimer = null;
        this.depthHistory.clear();
        this.depthDirty = false;
        this.lastMid = 0;
        this.absorption = new AbsorptionDetector(0);
        this.icebergs.reset();
        this.pendingMicro = [];
        this.venueTracker.clear();
        this.venueDirty = false;
        this.derivatives.clear();
        this.derivativesDirty = false;
        this.pendingLiquidations = [];
        this.seenLiquidations.clear();
        this.pendingOIPoints = [];
        this.oiVenues = null;
        this.lastPrice = 0;
        this.pendingBigTrades = [];
        this.tapeLog.clear();
        if (this.recorder) {
          const recorder = this.recorder;
          this.recorder = null;
          recorder.close();
        }
        for (const [venue, adapter] of this.adapters) {
          const listeners = this.listeners.get(venue);
          if (listeners) {
            adapter.removeListener("trade", listeners.tradeListener);
            adapter.removeListener("orderbook", listeners.bookListener);
            adapter.removeListener("status", listeners.statusListener);
            adapter.removeListener("liquidation", listeners.liquidationListener);
            adapter.removeListener("derivatives", listeners.derivativesListener);
          }
          releaseAdapter(venue, this.currentSymbol, this.currentMarketType);
        }
        this.adapters.clear();
        this.listeners.clear();
        this.books.clear();
        this.lastDataAt.clear();
        this.currentCandleRef = null;
        this.previousCandleRef = null;
        this.allLevels = [];
        this.cumulativeDelta = 0;
        this.liveBar = null;
        this.sessionCvd = 0;
        this.session = null;
        this.store.getState().resetMarketData();
      }
      get primaryVenue() {
        return this.currentSelectedVenues[0];
      }
      onTrade(trade) {
        if (this.paused && !this.replaying) return;
        if (!Number.isFinite(trade.price) || trade.price <= 0) return;
        this.lastDataAt.set(trade.venue, Date.now());
        this.recorder?.trade(trade, this.clock());
        const store = this.store.getState();
        this.lastPrice = trade.price;
        if (!this.tickResolved) {
          this.tickResolved = true;
          this.currentTickSize = resolveTickSize(trade.price, this.currentMarketType);
          if (store.tickSize !== this.currentTickSize) store.setTickSize(this.currentTickSize);
          this.absorption.setTick(this.currentTickSize);
        }
        const absorbed = this.absorption.onTrade(trade);
        if (absorbed.length) this.pendingMicro.push(...absorbed);
        this.icebergs.onTrade(trade, this.books.get(trade.venue));
        this.venueTracker.onTrade(trade);
        this.venueDirty = true;
        const candleOpenTime = getCandleOpenTime(trade.timestamp, this.currentTimeframe);
        if (this.currentCandleRef && candleOpenTime < this.currentCandleRef.openTime) {
          this.onLatePrint(trade, candleOpenTime);
          return;
        }
        if (!this.currentCandleRef || this.currentCandleRef.openTime !== candleOpenTime) {
          if (this.currentCandleRef) {
            const finalized = { ...this.currentCandleRef, complete: true };
            this.cumulativeDelta += finalized.delta;
            finalized.cumulativeDelta = this.cumulativeDelta;
            store.finalizeCandle(finalized);
            this.previousCandleRef = finalized;
            for (const level of finalized.levels.values()) this.allLevels.push(level);
            if (this.allLevels.length > 5e3) this.allLevels = this.allLevels.slice(-3e3);
          }
          this.currentCandleRef = createEmptyCandle(candleOpenTime, this.currentTimeframe);
        }
        this.currentCandleRef = applyTradeToCandle(
          this.currentCandleRef,
          trade,
          this.currentTickSize,
          this.currentImbalanceThreshold
        );
        this.currentCandleRef.cumulativeDelta = this.cumulativeDelta + this.currentCandleRef.delta;
        if (this.allLevels.length > 1) applyZScores(this.currentCandleRef, this.allLevels);
        if (!this.session) this.session = createSessionStats(trade.timestamp, trade.price);
        applyTradeToSession(
          this.session,
          trade.price,
          trade.quantity,
          trade.side,
          Math.max(0, trade.localTimestamp - trade.timestamp)
        );
        this.currentCandleRef.vwap = this.session.vwap;
        this.currentCandleRef.vwapStd = this.session.vwapStd;
        if (this.session.trades >= BIG_TRADE_WARMUP_TRADES) {
          const average = this.session.volume / this.session.trades;
          const ratio = average > 0 ? trade.quantity / average : 0;
          if (ratio >= BIG_TRADE_MIN_RATIO) this.pendingBigTrades.push({ ...trade, ratio });
        }
        this.tapeLog.push(trade);
        this.updateFlowBar(trade);
        this.pendingCandle = { ...this.currentCandleRef };
        this.profileDirty = true;
        const candle = this.currentCandleRef;
        this.pendingTicker = {
          venue: trade.venue,
          symbol: trade.symbol,
          price: trade.price,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          change: trade.price - candle.open,
          changePct: candle.open ? (trade.price - candle.open) / candle.open * 100 : 0,
          volume: candle.volume,
          timestamp: trade.timestamp
        };
        this.pendingTrades.push(trade);
        this.scheduleFlush();
      }
      /**
       * A print stamped before the current candle opened. If it belongs to the
       * candle that just closed, amend that candle so its footprint, delta and
       * CVD stay right; anything older is too stale to place and stays off the
       * footprint. Either way it still counts for the session, tape and flow bars.
       */
      onLatePrint(trade, candleOpenTime) {
        const store = this.store.getState();
        const previous = this.previousCandleRef;
        if (previous && previous.openTime === candleOpenTime) {
          applyTradeToCandle(previous, trade, this.currentTickSize, this.currentImbalanceThreshold);
          const signed = trade.side === "buy" ? trade.quantity : -trade.quantity;
          this.cumulativeDelta += signed;
          previous.cumulativeDelta = this.cumulativeDelta;
          store.amendLastCandle(previous);
          const current = this.currentCandleRef;
          current.cumulativeDelta = this.cumulativeDelta + current.delta;
          this.pendingCandle = { ...current };
          this.profileDirty = true;
        }
        if (!this.session) this.session = createSessionStats(trade.timestamp, trade.price);
        applyTradeToSession(this.session, trade.price, trade.quantity, trade.side, Math.max(0, trade.localTimestamp - trade.timestamp));
        if (this.session.trades >= BIG_TRADE_WARMUP_TRADES) {
          const average = this.session.volume / this.session.trades;
          const ratio = average > 0 ? trade.quantity / average : 0;
          if (ratio >= BIG_TRADE_MIN_RATIO) this.pendingBigTrades.push({ ...trade, ratio });
        }
        this.tapeLog.push(trade);
        this.updateFlowBar(trade);
        this.pendingTrades.push(trade);
        this.scheduleFlush();
      }
      /** Accumulate the trade into fixed 1-second flow bars, filling empty seconds. */
      updateFlowBar(trade) {
        const bucket = Math.floor(trade.timestamp / FLOW_BAR_MS) * FLOW_BAR_MS;
        if (this.liveBar && bucket < this.liveBar.time) {
        } else if (!this.liveBar || bucket > this.liveBar.time) {
          if (this.liveBar) {
            const previous = this.liveBar;
            this.pendingFlowBars.push(previous);
            const missing = Math.min(MAX_GAP_FILL_BARS, (bucket - previous.time) / FLOW_BAR_MS - 1);
            for (let i = 1; i <= missing; i++) {
              this.pendingFlowBars.push(
                createFlowBar(previous.time + i * FLOW_BAR_MS, previous.close, previous.cvd)
              );
            }
          }
          this.liveBar = createFlowBar(bucket, trade.price, this.sessionCvd);
        }
        const bar = this.liveBar;
        const signed = trade.side === "buy" ? trade.quantity : -trade.quantity;
        this.sessionCvd += signed;
        bar.high = Math.max(bar.high, trade.price);
        bar.low = Math.min(bar.low, trade.price);
        bar.close = trade.price;
        bar.volume += trade.quantity;
        if (trade.side === "buy") bar.buyVolume += trade.quantity;
        else bar.sellVolume += trade.quantity;
        bar.trades += 1;
        bar.cvd = this.sessionCvd;
      }
      onOrderBook(book) {
        if (this.paused && !this.replaying) return;
        this.recorder?.book(book, this.clock());
        this.lastDataAt.set(book.venue, Date.now());
        this.books.set(book.venue, book);
        this.icebergs.onBook(book);
        if (book.venue === this.primaryVenue || !this.primaryVenue) {
          this.pendingOrderBook = book;
        }
        this.booksDirty = true;
        this.scheduleFlush();
      }
      booksDirty = false;
      aggregatePendingBooks() {
        if (!this.booksDirty) return;
        this.booksDirty = false;
        const aggregate = aggregateBooks(this.books);
        if (!aggregate) return;
        const { bidVolume, askVolume } = computeBandObi(this.books, aggregate);
        this.pendingOBI = {
          timestamp: aggregate.timestamp,
          value: computeOBI(bidVolume, askVolume),
          bidVolume,
          askVolume
        };
        this.pendingAggregatedBook = aggregate;
        if (aggregate.midPrice > 0) this.lastMid = aggregate.midPrice;
      }
      onLiquidation(liquidation) {
        if (!this.replaying && (this.paused || !this.adapters.has(liquidation.venue))) return;
        if (liquidation.timestamp < this.clock() - MAX_LIQUIDATION_AGE_MS) return;
        if (this.seenLiquidations.has(liquidation.id)) return;
        this.seenLiquidations.add(liquidation.id);
        if (this.seenLiquidations.size > 1e4) {
          this.seenLiquidations = new Set([...this.seenLiquidations].slice(-5e3));
        }
        this.recorder?.liquidation(liquidation, this.clock());
        this.pendingLiquidations.push(liquidation);
        this.scheduleFlush();
      }
      onDerivatives(update) {
        if (!this.replaying && (this.paused || !this.adapters.has(update.venue))) return;
        const merged = mergeDerivatives(this.derivatives.get(update.venue), update);
        this.derivatives.set(update.venue, merged);
        this.recorder?.derivatives(merged, this.clock());
        this.derivativesDirty = true;
        this.scheduleFlush();
      }
      computeDerivatives() {
        return aggregateDerivatives(
          [...this.derivatives.values()],
          this.primaryVenue,
          this.lastPrice || void 0,
          this.oiVenues ?? void 0
        );
      }
      /** Sample summed open interest once a second, against the last traded price. */
      sampleOpenInterest(now2) {
        if (this.paused && !this.replaying || !this.lastPrice) return;
        const reporting = [...this.derivatives.values()].filter((s) => s.openInterest !== void 0).map((s) => s.venue);
        if (!this.oiVenues) {
          const allReported = this.currentSelectedVenues.every((v) => reporting.includes(v));
          if (!reporting.length || !allReported && now2 - this.subscribedAt < OI_LOCK_GRACE_MS) return;
          this.oiVenues = new Set(reporting);
          this.derivativesDirty = true;
        }
        const aggregate = this.computeDerivatives();
        if (aggregate?.openInterest == null) return;
        this.pendingOIPoints.push({
          time: Math.floor(now2 / OI_SAMPLE_MS) * OI_SAMPLE_MS,
          openInterest: aggregate.openInterest,
          price: this.lastPrice
        });
        this.scheduleFlush();
      }
      pause() {
        this.paused = true;
      }
      resume() {
        this.paused = false;
        this.scheduleFlush();
      }
      scheduleFlush() {
        if (this.flushTimer || this.paused && !this.replaying) return;
        this.flushTimer = setTimeout(() => {
          this.flushTimer = null;
          this.flush();
        }, FLUSH_INTERVAL_MS);
      }
      flush() {
        this.aggregatePendingBooks();
        const store = this.store.getState();
        const volumeProfile = this.profileDirty && this.currentCandleRef ? computeVolumeProfile([...store.candles, this.currentCandleRef], store.valueAreaPct) : null;
        const batch = {
          trades: this.pendingTrades,
          orderBook: this.pendingOrderBook,
          aggregatedBook: this.pendingAggregatedBook,
          candle: this.pendingCandle,
          volumeProfile,
          ticker: this.pendingTicker,
          obi: this.pendingOBI,
          flowBars: this.pendingFlowBars,
          liveBar: this.liveBar ? { ...this.liveBar } : null,
          session: this.session ? { ...this.session } : null,
          connections: [...this.pendingConnections.values()],
          liquidations: this.pendingLiquidations,
          derivatives: this.derivativesDirty ? this.computeDerivatives() : null,
          oiPoints: this.pendingOIPoints,
          bigTrades: this.pendingBigTrades,
          clock: this.clock(),
          depthVersion: this.depthDirty ? this.depthHistory.version : 0,
          microEvents: this.pendingMicro,
          // Per-venue buckets are only worth copying when several venues are compared.
          venueBuckets: this.venueDirty && this.currentSelectedVenues.length > 1 && this.lastVenueCopy + 1e3 <= this.clock() ? (this.lastVenueCopy = this.clock(), this.venueTracker.snapshot()) : null
        };
        store.applyMarketDataBatch(batch);
        this.pendingTrades = [];
        this.pendingOrderBook = null;
        this.pendingAggregatedBook = null;
        this.pendingCandle = null;
        this.profileDirty = false;
        this.pendingTicker = null;
        this.pendingOBI = null;
        this.pendingFlowBars = [];
        this.pendingConnections.clear();
        this.pendingLiquidations = [];
        this.pendingOIPoints = [];
        this.pendingBigTrades = [];
        this.derivativesDirty = false;
        this.depthDirty = false;
        this.pendingMicro = [];
        if (batch.venueBuckets) this.venueDirty = false;
      }
    };
  }
});

// src/lib/store/terminalStore.ts
import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
var MAX_FLOW_BARS, MAX_CANDLES, MAX_OBI_POINTS, MAX_LIQUIDATIONS, MAX_OI_POINTS, MAX_BIG_TRADES, MAX_MICRO_EVENTS, INITIAL_SETTINGS, INITIAL_MARKET, createTerminalStore;
var init_terminalStore = __esm({
  "src/lib/store/terminalStore.ts"() {
    "use strict";
    init_capabilities();
    init_RingBuffer();
    MAX_FLOW_BARS = 7200;
    MAX_CANDLES = 500;
    MAX_OBI_POINTS = 600;
    MAX_LIQUIDATIONS = 5e3;
    MAX_OI_POINTS = 7200;
    MAX_BIG_TRADES = 3e3;
    MAX_MICRO_EVENTS = 500;
    INITIAL_SETTINGS = {
      symbol: "BTCUSDT",
      venue: "bybit-futures",
      selectedVenues: ["bybit-futures"],
      marketType: "perpetual",
      timeframe: "5m",
      tickSize: 10,
      imbalanceThreshold: 3,
      stackedImbalanceLevels: 3,
      orderBookMode: "single",
      valueAreaPct: 0.7
    };
    INITIAL_MARKET = {
      candles: [],
      currentCandle: null,
      volumeProfile: null,
      recentTrades: [],
      orderBook: null,
      aggregatedBook: null,
      obiHistory: [],
      currentOBI: 0,
      flowBars: [],
      liveBar: null,
      session: null,
      connections: {},
      ticker: null,
      liquidations: [],
      derivatives: null,
      oiHistory: [],
      bigTrades: [],
      marketClock: 0,
      depthVersion: 0,
      microEvents: [],
      venueBuckets: {},
      crosshairTime: null,
      crosshairPrice: null
    };
    createTerminalStore = () => {
      const recentTradeBuffer = new RingBuffer(500);
      return createStore()(
        subscribeWithSelector((set) => ({
          ...INITIAL_SETTINGS,
          ...INITIAL_MARKET,
          recording: null,
          replay: null,
          setSymbol: (symbol) => set({ symbol, ...INITIAL_MARKET }),
          setVenue: (venue) => set((s) => ({
            venue,
            selectedVenues: venue === "all-perps" || venue === "all-spot" ? s.selectedVenues : [venue],
            orderBookMode: venue === "all-perps" || venue === "all-spot" ? "aggregated" : "single",
            ...INITIAL_MARKET
          })),
          setSelectedVenues: (selectedVenues) => set({ selectedVenues, ...INITIAL_MARKET }),
          setMarketType: (marketType) => set((s) => {
            if (marketType !== s.marketType) {
              const aggregate = s.venue === "all-perps" || s.venue === "all-spot";
              const venue = aggregate ? marketType === "perpetual" ? "all-perps" : "all-spot" : venueForMarket(s.venue, marketType);
              if (venue) {
                return {
                  marketType,
                  venue,
                  selectedVenues: aggregate ? venuesForSelection(venue, marketType, s.symbol) : [venue],
                  orderBookMode: aggregate ? s.orderBookMode : "single",
                  ...INITIAL_MARKET
                };
              }
            }
            const isValidVenue = marketType === "perpetual" ? s.venue.includes("futures") || s.venue === "hyperliquid" || s.venue === "deribit" || s.venue === "all-perps" : s.venue.includes("spot");
            const newVenue = isValidVenue ? s.venue : marketType === "perpetual" ? "bybit-futures" : "bybit-spot";
            return {
              marketType,
              venue: newVenue,
              selectedVenues: isValidVenue ? s.selectedVenues : [newVenue],
              orderBookMode: isValidVenue ? s.orderBookMode : "single",
              ...INITIAL_MARKET
            };
          }),
          setTimeframe: (timeframe) => set({ timeframe, ...INITIAL_MARKET }),
          setTickSize: (tickSize) => set({ tickSize }),
          setImbalanceThreshold: (imbalanceThreshold) => set({ imbalanceThreshold }),
          setOrderBookMode: (orderBookMode) => set({ orderBookMode }),
          setValueAreaPct: (valueAreaPct) => set({ valueAreaPct }),
          finalizeCandle: (candle) => set((s) => ({
            candles: [...s.candles, { ...candle, complete: true }].slice(-MAX_CANDLES),
            currentCandle: null
          })),
          amendLastCandle: (candle) => set((s) => {
            const last = s.candles[s.candles.length - 1];
            if (!last || last.openTime !== candle.openTime) return {};
            return { candles: [...s.candles.slice(0, -1), { ...candle, complete: true }] };
          }),
          updateConnection: (conn) => set((s) => ({ connections: { ...s.connections, [conn.venue]: conn } })),
          applyMarketDataBatch: (batch) => set((s) => {
            for (const trade of batch.trades) recentTradeBuffer.push(trade);
            return {
              recentTrades: batch.trades.length ? recentTradeBuffer.newestFirst() : s.recentTrades,
              orderBook: batch.orderBook ?? s.orderBook,
              aggregatedBook: batch.aggregatedBook ?? s.aggregatedBook,
              currentCandle: batch.candle ?? s.currentCandle,
              volumeProfile: batch.volumeProfile ?? s.volumeProfile,
              ticker: batch.ticker ?? s.ticker,
              currentOBI: batch.obi?.value ?? s.currentOBI,
              obiHistory: batch.obi ? [...s.obiHistory, batch.obi].slice(-MAX_OBI_POINTS) : s.obiHistory,
              flowBars: batch.flowBars.length ? [...s.flowBars, ...batch.flowBars].slice(-MAX_FLOW_BARS) : s.flowBars,
              liveBar: batch.liveBar ?? s.liveBar,
              session: batch.session ?? s.session,
              liquidations: batch.liquidations.length ? [...s.liquidations, ...batch.liquidations].slice(-MAX_LIQUIDATIONS) : s.liquidations,
              derivatives: batch.derivatives ?? s.derivatives,
              oiHistory: batch.oiPoints.length ? [...s.oiHistory, ...batch.oiPoints].slice(-MAX_OI_POINTS) : s.oiHistory,
              bigTrades: batch.bigTrades.length ? [...s.bigTrades, ...batch.bigTrades].slice(-MAX_BIG_TRADES) : s.bigTrades,
              marketClock: batch.clock || s.marketClock,
              depthVersion: batch.depthVersion || s.depthVersion,
              microEvents: batch.microEvents.length ? [...s.microEvents, ...batch.microEvents].slice(-MAX_MICRO_EVENTS) : s.microEvents,
              venueBuckets: batch.venueBuckets ?? s.venueBuckets,
              connections: batch.connections.length ? {
                ...s.connections,
                ...Object.fromEntries(batch.connections.map((c) => [c.venue, c]))
              } : s.connections
            };
          }),
          setCrosshair: (crosshairTime, crosshairPrice) => set({ crosshairTime, crosshairPrice }),
          resetMarketData: () => {
            recentTradeBuffer.clear();
            set(INITIAL_MARKET);
          }
        }))
      );
    };
  }
});

// src/resolve.ts
function normalizeSymbol(raw) {
  const cleaned = raw.trim().toUpperCase().replace(/[\s_\-/:.]/g, "");
  let base = cleaned.replace(/(PERPETUAL|PERP|SWAP|SPOT)$/, "").replace(/(USDT|USDC|USD)$/, "");
  if (base === "XBT") base = "BTC";
  if (!base) throw new MarketError(`Cannot read a symbol from "${raw}"`);
  return `${base}USDT`;
}
function resolveVenue(raw, marketType) {
  const v = (raw ?? "all").trim().toLowerCase();
  if (["all", "aggregate", "aggregated", "all-perps", "all-spot", "*", ""].includes(v)) {
    return marketType === "perpetual" ? "all-perps" : "all-spot";
  }
  const pool2 = marketType === "perpetual" ? PERP_VENUES2 : SPOT_VENUES2;
  const exact = pool2.find((venue) => venue === v);
  if (exact) return exact;
  const brand = v.replace(/[-_ ]?(futures|perp|perps|perpetual|swap|spot)$/, "");
  const match = pool2.find((venue) => venue.replace(/-(futures|spot)$/, "") === brand);
  if (match) return match;
  throw new MarketError(`Unknown ${marketType} venue "${raw}". Use one of: all, ${pool2.join(", ")}`);
}
function resolveMarket(rawSymbol, rawVenue, rawMarketType) {
  const symbol = normalizeSymbol(rawSymbol);
  const marketType = (rawMarketType ?? "").toLowerCase() === "spot" ? "spot" : "perpetual";
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
var PERP_VENUES2, SPOT_VENUES2, TIMEFRAMES, MarketError;
var init_resolve = __esm({
  "src/resolve.ts"() {
    "use strict";
    init_capabilities();
    init_instruments();
    PERP_VENUES2 = ["binance-futures", "bybit-futures", "okx-futures", "hyperliquid", "bitget-futures", "deribit", "gate-futures", "kucoin-futures", "kraken-futures", "htx-futures"];
    SPOT_VENUES2 = ["binance-spot", "coinbase-spot", "okx-spot", "bybit-spot", "bitget-spot", "gate-spot", "kucoin-spot", "kraken-spot", "htx-spot"];
    TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h"];
    MarketError = class extends Error {
    };
  }
});

// src/market.ts
var market_exports = {};
__export(market_exports, {
  BASE_TIMEFRAME: () => BASE_TIMEFRAME,
  LiveMarket: () => LiveMarket,
  MarketHub: () => MarketHub,
  TIMEFRAME_MS: () => TIMEFRAME_MS2,
  mergeCandles: () => mergeCandles
});
function mergeCandles(openTime, durationMs, list) {
  const first = list[0];
  const last = list[list.length - 1];
  const levels = /* @__PURE__ */ new Map();
  const venueVolumes = {};
  let high = -Infinity, low = Infinity, volume = 0, delta = 0, trades = 0;
  for (const c of list) {
    high = Math.max(high, c.high);
    low = Math.min(low, c.low);
    volume += c.volume;
    delta += c.delta;
    trades += c.tradeCount;
    for (const [venue, v] of Object.entries(c.venueVolumes)) venueVolumes[venue] = (venueVolumes[venue] ?? 0) + v;
    for (const [price, l] of c.levels) {
      const m = levels.get(price);
      if (!m) {
        levels.set(price, { ...l });
        continue;
      }
      m.bidVolume += l.bidVolume;
      m.askVolume += l.askVolume;
      m.totalVolume += l.totalVolume;
      m.delta += l.delta;
      m.tradeCount += l.tradeCount;
      m.buyTrades += l.buyTrades;
      m.sellTrades += l.sellTrades;
      m.maxTradeSize = Math.max(m.maxTradeSize, l.maxTradeSize);
    }
  }
  let maxVolumeAtLevel = 0;
  for (const l of levels.values()) maxVolumeAtLevel = Math.max(maxVolumeAtLevel, l.totalVolume);
  return {
    openTime,
    closeTime: openTime + durationMs - 1,
    open: first.open,
    high,
    low,
    close: last.close,
    volume,
    delta,
    cumulativeDelta: last.cumulativeDelta,
    levels,
    sortedPrices: [...levels.keys()].sort((a, b) => a - b),
    tradeCount: trades,
    maxVolumeAtLevel,
    complete: Date.now() > openTime + durationMs,
    vwap: last.vwap,
    vwapStd: last.vwapStd,
    venueVolumes
  };
}
var BASE_TIMEFRAME, TIMEFRAME_MS2, LiveMarket, MarketHub;
var init_market = __esm({
  "src/market.ts"() {
    "use strict";
    init_marketDataManager();
    init_terminalStore();
    init_orderFlowEngine();
    init_resolve();
    BASE_TIMEFRAME = "1m";
    TIMEFRAME_MS2 = {
      "1m": 6e4,
      "5m": 3e5,
      "15m": 9e5,
      "30m": 18e5,
      "1h": 36e5,
      "4h": 144e5
    };
    LiveMarket = class {
      /** `connect: false` builds the engine without opening exchange sockets (tests). */
      constructor(spec, connect = true) {
        this.spec = spec;
        this.store.setState({
          symbol: spec.symbol,
          venue: spec.selection,
          selectedVenues: spec.venues,
          marketType: spec.marketType,
          timeframe: BASE_TIMEFRAME,
          orderBookMode: spec.venues.length > 1 ? "aggregated" : "single"
        });
        if (connect) this.manager.subscribe(spec.selection, spec.symbol, spec.marketType, BASE_TIMEFRAME, 10, 3, spec.venues);
      }
      spec;
      store = createTerminalStore();
      manager = new MarketDataManager(this.store);
      startedAt = Date.now();
      lastAccess = Date.now();
      pinned = false;
      disposed = false;
      get state() {
        return this.store.getState();
      }
      get ageMs() {
        return Date.now() - this.startedAt;
      }
      touch() {
        this.lastAccess = Date.now();
        return this;
      }
      /** True once trades and a book have arrived. */
      get ready() {
        const s = this.state;
        return (s.session?.trades ?? 0) > 0 && s.aggregatedBook !== null;
      }
      connections() {
        const known = this.state.connections;
        return this.spec.venues.map(
          (venue) => known[venue] ?? { venue, status: "connecting", lastHeartbeat: 0, reconnectAttempts: 0 }
        );
      }
      /** True once every venue has delivered data or given up. */
      get settled() {
        const seen = this.manager.lastDataAt;
        return this.connections().every((c) => seen.has(c.venue) || c.status === "error" || c.status === "offline");
      }
      /**
       * Wait for a new stream to fill in, up to `timeoutMs`: until every venue
       * has delivered data (or failed). Returns whether any data has arrived.
       */
      async waitReady(timeoutMs) {
        const deadline = Date.now() + timeoutMs;
        while (!this.disposed && Date.now() < deadline) {
          if (this.ready && this.settled) break;
          const conns = this.connections();
          if (conns.length && conns.every((c) => c.status === "error" || c.status === "offline")) break;
          await new Promise((r) => setTimeout(r, 150));
        }
        if (this.ready) await new Promise((r) => setTimeout(r, 300));
        return this.ready;
      }
      /** Finalized 1m candles plus the live one, oldest first. */
      baseCandles() {
        const s = this.state;
        return s.currentCandle ? [...s.candles, s.currentCandle] : [...s.candles];
      }
      /** Footprint candles at `timeframe`, merged from 1m candles. */
      candles(timeframe) {
        const base = this.baseCandles();
        if (timeframe === BASE_TIMEFRAME) return base;
        const groups = /* @__PURE__ */ new Map();
        for (const candle of base) {
          const open = getCandleOpenTime(candle.openTime, timeframe);
          const list = groups.get(open);
          if (list) list.push(candle);
          else groups.set(open, [candle]);
        }
        return [...groups.entries()].map(([openTime, list]) => mergeCandles(openTime, TIMEFRAME_MS2[timeframe], list));
      }
      dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.manager.disconnect();
      }
    };
    MarketHub = class {
      constructor(options2) {
        this.options = options2;
        this.reaper = setInterval(() => this.reap(), 3e4);
        this.reaper.unref?.();
      }
      options;
      markets = /* @__PURE__ */ new Map();
      reaper;
      list() {
        return [...this.markets.values()];
      }
      find(spec) {
        return this.markets.get(spec.key);
      }
      /** Get (or start) the live market for a request. */
      open(symbol, venue, marketType) {
        const spec = resolveMarket(symbol, venue, marketType);
        const existing = this.markets.get(spec.key);
        if (existing) return { market: existing.touch(), created: false };
        if (this.markets.size >= this.options.maxMarkets) {
          const evictable = this.list().filter((m) => !m.pinned).sort((a, b) => a.lastAccess - b.lastAccess)[0];
          if (!evictable) {
            throw new Error(`Already streaming ${this.markets.size} pinned markets (max ${this.options.maxMarkets}). Unwatch one first.`);
          }
          this.close(evictable.spec.key);
        }
        const market = new LiveMarket(spec);
        this.markets.set(spec.key, market);
        return { market, created: true };
      }
      close(key2) {
        const market = this.markets.get(key2);
        if (!market) return false;
        market.dispose();
        this.markets.delete(key2);
        return true;
      }
      reap() {
        if (!(this.options.idleMs > 0)) return;
        const now2 = Date.now();
        for (const market of this.list()) {
          if (!market.pinned && now2 - market.lastAccess > this.options.idleMs) this.close(market.spec.key);
        }
      }
      dispose() {
        clearInterval(this.reaper);
        for (const key2 of [...this.markets.keys()]) this.close(key2);
      }
    };
  }
});

// src/lib/engine/imbalance.ts
function imbalanceOf(level, ratio) {
  if (level.bidVolume > 0 && level.askVolume / level.bidVolume >= ratio) return "buy";
  if (level.askVolume > 0 && level.bidVolume / level.askVolume >= ratio) return "sell";
  return null;
}
function stackedRuns(candle, ratio, minLevels) {
  const out = [];
  const prices = candle.sortedPrices;
  let dir = null;
  let startIndex = 0;
  const flush = (endIndex) => {
    if (dir && endIndex - startIndex + 1 >= minLevels) out.push({ dir, start: prices[startIndex], end: prices[endIndex] });
  };
  for (let i = 0; i < prices.length; i++) {
    const level = candle.levels.get(prices[i]);
    const d = level ? imbalanceOf(level, ratio) : null;
    if (d !== dir) {
      flush(i - 1);
      dir = d;
      startIndex = i;
    }
  }
  flush(prices.length - 1);
  return out;
}
var init_imbalance = __esm({
  "src/lib/engine/imbalance.ts"() {
    "use strict";
  }
});

// src/views.ts
function sig(x, digits = 5) {
  if (x === null || x === void 0 || !Number.isFinite(x)) return null;
  if (x === 0) return 0;
  return Number(x.toPrecision(digits));
}
function fixed(x, decimals) {
  if (x === null || x === void 0 || !Number.isFinite(x)) return null;
  return Number(x.toFixed(decimals));
}
function iso(ms) {
  if (!ms || !Number.isFinite(ms)) return null;
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}
function usd(x) {
  if (x === null || x === void 0 || !Number.isFinite(x)) return null;
  const a = Math.abs(x), sign = x < 0 ? "-" : "";
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(1)}K`;
  return `${sign}$${a.toFixed(0)}`;
}
function pricer(market) {
  const tick = market.manager.tickSize || 1;
  const decimals = Math.min(10, getTickDecimals(tick) + 1);
  return (p) => fixed(p, decimals);
}
function header(market) {
  const s = market.state;
  const age = Math.round(market.ageMs / 1e3);
  return {
    market: {
      symbol: market.spec.symbol,
      market_type: market.spec.marketType,
      venue_selection: market.spec.selection,
      venues: market.spec.venues
    },
    as_of: iso(s.marketClock || Date.now()),
    streaming_since: iso(market.startedAt),
    stream_age_s: age,
    warming_up: !market.ready || age < 60,
    tick_size: market.manager.tickSize
  };
}
function connectionsView(market) {
  const seen = market.manager.lastDataAt;
  return market.connections().map((c) => {
    const at = seen.get(c.venue);
    return {
      venue: c.venue,
      status: c.status,
      ...c.error && c.status !== "live" ? { error: c.error } : {},
      last_data_s_ago: at ? fixed((Date.now() - at) / 1e3, 1) : null
    };
  });
}
function referenceLast(market, tape = market.manager.getTapeLog()) {
  if (!tape.length) return null;
  const wanted = market.spec.venues.length;
  const cutoff = tape[0].timestamp - 6e4;
  const latest = /* @__PURE__ */ new Map();
  for (const t of tape) {
    if (t.timestamp < cutoff || latest.size >= wanted) break;
    if (!latest.has(t.venue)) latest.set(t.venue, t.price);
  }
  const prices = [...latest.values()].sort((a, b) => a - b);
  const m = prices.length >> 1;
  const price = prices.length % 2 ? prices[m] : (prices[m - 1] + prices[m]) / 2;
  return { price, print: tape[0].price, printVenue: tape[0].venue, venues: prices.length };
}
function sigmaFromVwapOf(market) {
  const session = market.state.session;
  const ref = referenceLast(market);
  if (!session || !ref || !(session.vwapStd > 0)) return null;
  return (ref.price - session.vwap) / session.vwapStd;
}
function referenceQuote(market) {
  const books = [...market.manager.getBooks().values()].filter((b) => b.bids[0] && b.asks[0]);
  if (!books.length) return null;
  const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  const mids = books.map((b) => (b.bids[0].price + b.asks[0].price) / 2);
  const spreads = books.map((b) => (b.asks[0].price - b.bids[0].price) / ((b.asks[0].price + b.bids[0].price) / 2) * 1e4);
  const agg = market.state.aggregatedBook;
  const crossed = !!agg && agg.bids[0] && agg.asks[0] ? agg.bids[0].price >= agg.asks[0].price : false;
  return {
    mid: median(mids),
    spread_bps: median(spreads),
    best_bid: Math.max(...books.map((b) => b.bids[0].price)),
    best_ask: Math.min(...books.map((b) => b.asks[0].price)),
    crossed,
    venues: books.length
  };
}
function allBars(market) {
  const s = market.state;
  return s.liveBar ? [...s.flowBars, s.liveBar] : [...s.flowBars];
}
function now(market) {
  return market.state.marketClock || Date.now();
}
function flowWindow(market, windowMs) {
  const bars = allBars(market);
  const since = now(market) - windowMs;
  let volume = 0, buy = 0, sell = 0, trades = 0, notional = 0;
  let first = null, last = null;
  let high = -Infinity, low = Infinity;
  for (let i = bars.length - 1; i >= 0 && bars[i].time >= since; i--) {
    const b = bars[i];
    if (!last) last = b;
    first = b;
    volume += b.volume;
    buy += b.buyVolume;
    sell += b.sellVolume;
    trades += b.trades;
    notional += b.volume * b.close;
    if (b.trades) {
      high = Math.max(high, b.high);
      low = Math.min(low, b.low);
    }
  }
  if (!first || !last) return null;
  const covered = Math.min(windowMs, last.time - first.time + 1e3);
  return {
    covered_s: Math.round(covered / 1e3),
    volume: sig(volume),
    notional_usd: usd(notional),
    notional_raw: notional,
    buy_volume: sig(buy),
    sell_volume: sig(sell),
    delta: sig(buy - sell),
    buy_pct: volume ? fixed(buy / volume * 100, 1) : null,
    trades,
    price_change_pct: first.open ? pct((last.close - first.open) / first.open) : null,
    high: Number.isFinite(high) ? high : null,
    low: Number.isFinite(low) ? low : null
  };
}
function publicWindow(w) {
  if (!w) return null;
  const { notional_raw: _raw, ...rest } = w;
  return rest;
}
function latestVolumeZ(market, seconds, window = 20) {
  const bars = resampleBars(market.state.flowBars, seconds);
  if (bars.length < 5) return null;
  const z2 = rollingVolumeZScores(bars, window);
  return fixed(z2[z2.length - 1]?.z ?? null, 2);
}
function realizedVol(market, seconds, window) {
  const bars = resampleBars(market.state.flowBars, seconds);
  if (bars.length < 12) return null;
  const rv = rollingRealizedVolatility(bars, window, seconds, secondsPerYear(market.spec.marketType));
  return fixed(rv[rv.length - 1]?.value ?? null, 1);
}
function depthWithin(market, mid, bands) {
  const sides = market.manager.getDepthSides();
  const out = bands.map((band) => ({ band_pct: band * 100, bid: 0, ask: 0 }));
  for (const side of sides.values()) {
    for (const [price, size] of side.bids) {
      const d = (mid - price) / mid;
      for (let i = 0; i < bands.length; i++) if (d >= 0 && d <= bands[i]) out[i].bid += size;
    }
    for (const [price, size] of side.asks) {
      const d = (price - mid) / mid;
      for (let i = 0; i < bands.length; i++) if (d >= 0 && d <= bands[i]) out[i].ask += size;
    }
  }
  return out.map((b) => ({
    band_pct: b.band_pct,
    bid_size: sig(b.bid),
    ask_size: sig(b.ask),
    bid_usd: usd(b.bid * mid),
    ask_usd: usd(b.ask * mid),
    imbalance: b.bid + b.ask ? fixed((b.bid - b.ask) / (b.bid + b.ask), 3) : null
  }));
}
function snapshotView(market) {
  const s = market.state;
  const p = pricer(market);
  const session = s.session;
  const book = s.aggregatedBook;
  const quote = referenceQuote(market);
  const profile = s.volumeProfile;
  const ref = referenceLast(market);
  const last = ref?.price ?? session?.last ?? s.ticker?.price ?? null;
  const t = now(market);
  const sigmaFromVwap = sigmaFromVwapOf(market);
  const valueLocation = profile && last ? last > profile.vah ? "above_value_area" : last < profile.val ? "below_value_area" : "inside_value_area" : null;
  const deriv = s.derivatives;
  const oi5 = oiWindowChange(s.oiHistory, 5 * 6e4);
  const liq5 = summarizeLiquidations(s.liquidations, t - 5 * 6e4);
  const big5 = s.bigTrades.filter((b) => b.timestamp >= t - 5 * 6e4);
  const micro = s.microEvents.filter((e) => e.time >= t - 15 * 6e4).slice(-5).reverse();
  const w1 = flowWindow(market, 6e4);
  const w5 = flowWindow(market, 5 * 6e4);
  const w15 = flowWindow(market, 15 * 6e4);
  const volZ1m = latestVolumeZ(market, 60);
  const bandDepth = quote?.mid ? depthWithin(market, quote.mid, [1e-3, 5e-3, 0.01]) : null;
  const signals = [];
  if (sigmaFromVwap !== null) {
    if (sigmaFromVwap >= 2) signals.push(`Price is ${sigmaFromVwap.toFixed(1)}\u03C3 above session VWAP (stretched).`);
    else if (sigmaFromVwap <= -2) signals.push(`Price is ${Math.abs(sigmaFromVwap).toFixed(1)}\u03C3 below session VWAP (stretched).`);
    else signals.push(`Price is ${sigmaFromVwap >= 0 ? "above" : "below"} session VWAP (${sigmaFromVwap.toFixed(2)}\u03C3).`);
  }
  if (valueLocation) signals.push(`Price is ${valueLocation.replace(/_/g, " ")} (VAL ${p(profile.val)} \u2013 VAH ${p(profile.vah)}, POC ${p(profile.poc)}).`);
  if (w5 && w5.buy_pct !== null) {
    if (w5.buy_pct >= 60) signals.push(`Aggressive buyers dominate the last 5m (${w5.buy_pct}% of volume).`);
    else if (w5.buy_pct <= 40) signals.push(`Aggressive sellers dominate the last 5m (${(100 - w5.buy_pct).toFixed(1)}% of volume).`);
    const pc = w5.price_change_pct ?? 0;
    if (w5.delta !== null && Math.abs(pc) > 0.05 && Math.sign(pc) !== Math.sign(w5.delta)) {
      signals.push(`Delta divergence over 5m: price ${pc > 0 ? "up" : "down"} ${Math.abs(pc)}% while delta is ${w5.delta > 0 ? "positive" : "negative"}.`);
    }
  }
  if (volZ1m !== null && volZ1m >= 2.5) signals.push(`Volume spike: last 1m volume z-score ${volZ1m}.`);
  if (s.currentOBI >= 0.3) signals.push(`Order book is bid-heavy near the touch (OBI ${s.currentOBI.toFixed(2)}).`);
  else if (s.currentOBI <= -0.3) signals.push(`Order book is ask-heavy near the touch (OBI ${s.currentOBI.toFixed(2)}).`);
  if (oi5 && oi5.regime !== "neutral") signals.push(`OI regime (5m): ${OI_REGIME_LABEL[oi5.regime]} \u2014 ${OI_REGIME_HINT[oi5.regime]}`);
  if (deriv?.fundingRate8h !== null && deriv?.fundingRate8h !== void 0 && Math.abs(deriv.fundingRate8h) >= 3e-4) {
    signals.push(`Funding is elevated: ${(deriv.fundingRate8h * 100).toFixed(4)}% per 8h (${deriv.fundingRate8h > 0 ? "longs pay shorts" : "shorts pay longs"}).`);
  }
  if (liq5.count) signals.push(`Liquidations last 5m: longs ${usd(liq5.longNotional)}, shorts ${usd(liq5.shortNotional)}.`);
  for (const e of micro.slice(0, 2)) {
    signals.push(`${e.kind === "absorption" ? "Absorption" : "Iceberg"} at ${p(e.price)}: the ${e.side === "bid" ? "bid held against selling" : "offer held against buying"} (${iso(e.time)}).`);
  }
  return {
    ...header(market),
    price: {
      last: p(last),
      ...ref && market.spec.venues.length > 1 ? { last_note: `median of ${ref.venues} venues' latest prints`, last_print: p(ref.print), last_print_venue: ref.printVenue } : {},
      mid: p(quote?.mid),
      spread_bps: fixed(quote?.spread_bps, 2),
      ...quote && quote.venues > 1 ? {
        highest_bid: p(quote.best_bid),
        lowest_ask: p(quote.best_ask),
        ...quote.crossed ? { cross_venue_crossed: true } : {}
      } : { best_bid: p(quote?.best_bid), best_ask: p(quote?.best_ask) }
    },
    session: session ? {
      open: p(session.open),
      high: p(session.high),
      low: p(session.low),
      change_pct: session.open && last ? pct((last - session.open) / session.open) : null,
      vwap: p(session.vwap),
      vwap_std: p(session.vwapStd),
      sigma_from_vwap: fixed(sigmaFromVwap, 2),
      volume: sig(session.volume),
      notional_usd: usd(session.notional),
      buy_volume: sig(session.buyVolume),
      sell_volume: sig(session.sellVolume),
      delta: sig(session.buyVolume - session.sellVolume),
      buy_pct: session.volume ? fixed(session.buyVolume / session.volume * 100, 1) : null,
      trades: session.trades,
      avg_trade: sig(session.volume / Math.max(1, session.trades)),
      max_trade: sig(session.maxTrade)
    } : null,
    flow: { last_1m: publicWindow(w1), last_5m: publicWindow(w5), last_15m: publicWindow(w15), volume_z_1m: volZ1m, realized_vol_5m_ann_pct: realizedVol(market, 5, 60) },
    volume_profile: profile ? { poc: p(profile.poc), vah: p(profile.vah), val: p(profile.val), location: valueLocation } : null,
    order_book: book ? { obi: fixed(s.currentOBI, 3), obi_note: "obi = (bid\u2212ask)/(bid+ask) size near the touch, within the shallowest venue's displayed depth; depth = all resting size within each band of mid", depth: bandDepth } : null,
    derivatives: market.spec.marketType === "perpetual" && deriv ? {
      open_interest: sig(deriv.openInterest),
      open_interest_usd: usd(deriv.openInterestValue),
      oi_change_5m_pct: oi5 ? pct(oi5.oiChange) : null,
      oi_regime_5m: oi5 ? oi5.regime : null,
      funding_8h_pct: pct(deriv.fundingRate8h, 5),
      funding_annualized_pct: deriv.fundingRate8h !== null ? fixed(annualizeFunding(deriv.fundingRate8h, 8) * 100, 2) : null,
      next_funding: iso(deriv.nextFundingTime),
      mark: p(deriv.markPrice),
      index: p(deriv.indexPrice),
      basis_bps: fixed(deriv.basisBps, 2)
    } : null,
    liquidations_5m: market.spec.marketType === "perpetual" ? { long_usd: usd(liq5.longNotional), short_usd: usd(liq5.shortNotional), count: liq5.count } : null,
    big_trades_5m: {
      count: big5.length,
      buy_usd: usd(big5.filter((b) => b.side === "buy").reduce((a, b) => a + b.quoteVolume, 0)),
      sell_usd: usd(big5.filter((b) => b.side === "sell").reduce((a, b) => a + b.quoteVolume, 0))
    },
    recent_micro_events: micro.map((e) => microRow(e, p)),
    signals,
    connections: connectionsView(market)
  };
}
function groupLevels(candle, rowSize) {
  const rows = /* @__PURE__ */ new Map();
  for (const l of candle.levels.values()) {
    const key2 = Math.floor(l.price / rowSize + 1e-9) * rowSize;
    const r = rows.get(key2) ?? { price: key2, bid: 0, ask: 0, trades: 0 };
    r.bid += l.bidVolume;
    r.ask += l.askVolume;
    r.trades += l.tradeCount;
    rows.set(key2, r);
  }
  return [...rows.values()].sort((a, b) => b.price - a.price);
}
function footprintView(market, o) {
  const p = pricer(market);
  const tick = market.manager.tickSize || 1;
  const candles = market.candles(o.timeframe).slice(-o.candles);
  const out = candles.map((c) => {
    const span = Math.max(1, Math.round((c.high - c.low) / tick) + 1);
    const ticksPerRow = o.rowTicks ?? Math.max(1, Math.ceil(span / o.maxRows));
    const rowSize = Number((ticksPerRow * tick).toPrecision(10));
    const rows = groupLevels(c, rowSize);
    let poc = null;
    for (const r of rows) if (!poc || r.bid + r.ask > poc.bid + poc.ask) poc = r;
    const pseudo = {
      ...c,
      levels: new Map(rows.map((r) => [r.price, { price: r.price, bidVolume: r.bid, askVolume: r.ask }])),
      sortedPrices: rows.map((r) => r.price).sort((a, b) => a - b)
    };
    const stacked = stackedRuns(pseudo, o.imbalanceRatio, o.stackedLevels);
    return {
      open_time: iso(c.openTime),
      complete: c.complete,
      open: p(c.open),
      high: p(c.high),
      low: p(c.low),
      close: p(c.close),
      volume: sig(c.volume),
      delta: sig(c.delta),
      delta_pct: c.volume ? fixed(c.delta / c.volume * 100, 1) : null,
      cvd: sig(c.cumulativeDelta),
      trades: c.tradeCount,
      poc: poc ? p(poc.price) : null,
      vwap: p(c.vwap),
      row_size: rowSize,
      stacked_imbalances: stacked.map((r) => ({ side: r.dir, from: p(r.start), to: p(r.end) })),
      ...o.includeRows ? {
        rows: rows.map((r) => {
          const imb = imbalanceOf({ bidVolume: r.bid, askVolume: r.ask }, o.imbalanceRatio);
          return [p(r.price), sig(r.bid, 4), sig(r.ask, 4), sig(r.ask - r.bid, 4), r.trades, imb ?? ""];
        })
      } : {}
    };
  });
  return {
    ...header(market),
    timeframe: o.timeframe,
    imbalance_ratio: o.imbalanceRatio,
    ...o.includeRows ? { row_columns: ["price_low", "bid_vol(sells)", "ask_vol(buys)", "delta", "trades", "imbalance"] } : {},
    note: "Rows run high\u2192low price. bid_vol = volume sold into the bid, ask_vol = volume bought at the ask. 'buy'/'sell' imbalance = one side \u2265 ratio\xD7 the other at that row.",
    candles: out
  };
}
function volumeProfileView(market, rows, valueAreaPct) {
  const p = pricer(market);
  const base = market.baseCandles();
  const profile = base.length ? computeVolumeProfile(base, valueAreaPct) : null;
  if (!profile || !profile.levels.length) return { ...header(market), profile: null };
  const tick = market.manager.tickSize || 1;
  const prices = profile.levels.map((l) => l.price);
  const lo = Math.min(...prices), hi = Math.max(...prices);
  const ticksPerRow = Math.max(1, Math.ceil((Math.round((hi - lo) / tick) + 1) / rows));
  const rowSize = Number((ticksPerRow * tick).toPrecision(10));
  const grouped = /* @__PURE__ */ new Map();
  for (const l of profile.levels) {
    const key2 = Math.floor(l.price / rowSize + 1e-9) * rowSize;
    const g = grouped.get(key2) ?? { vol: 0, bid: 0, ask: 0 };
    g.vol += l.totalVolume;
    g.bid += l.bidVolume;
    g.ask += l.askVolume;
    grouped.set(key2, g);
  }
  const list = [...grouped.entries()].sort((a, b) => b[0] - a[0]);
  const maxVol = Math.max(...list.map(([, g]) => g.vol));
  const byVol = [...list].sort((a, b) => b[1].vol - a[1].vol);
  return {
    ...header(market),
    value_area_pct: valueAreaPct * 100,
    poc: p(profile.poc),
    vah: p(profile.vah),
    val: p(profile.val),
    total_volume: sig(profile.totalVolume),
    buy_volume: sig(profile.buyVolume),
    sell_volume: sig(profile.sellVolume),
    delta: sig(profile.delta),
    high_volume_nodes: byVol.slice(0, 5).map(([price]) => p(price)),
    row_size: rowSize,
    columns: ["price_low", "volume", "buy_vol", "sell_vol", "delta", "pct_of_max"],
    rows: list.map(([price, g]) => [p(price), sig(g.vol, 4), sig(g.ask, 4), sig(g.bid, 4), sig(g.ask - g.bid, 4), Math.round(g.vol / maxVol * 100)])
  };
}
function groupBook(levels, step, side, depth) {
  const map = /* @__PURE__ */ new Map();
  for (const l of levels) {
    const key2 = side === "bid" ? Math.floor(l.price / step + 1e-9) * step : Math.ceil(l.price / step - 1e-9) * step;
    map.set(key2, (map.get(key2) ?? 0) + l.size);
  }
  return [...map.entries()].sort((a, b) => side === "bid" ? b[0] - a[0] : a[0] - b[0]).slice(0, depth);
}
function orderBookView(market, depth, groupTicks, perVenue) {
  const p = pricer(market);
  const book = market.state.aggregatedBook;
  const quote = referenceQuote(market);
  if (!book || !quote) return { ...header(market), order_book: null, connections: connectionsView(market) };
  const mid = quote.mid;
  const tick = market.manager.tickSize || 0;
  const step = groupTicks > 0 && tick > 0 ? Number((tick * groupTicks).toPrecision(10)) : 0;
  const bids = step ? groupBook(book.bids, step, "bid", depth) : book.bids.slice(0, depth).map((l) => [l.price, l.size]);
  const asks = step ? groupBook(book.asks, step, "ask", depth) : book.asks.slice(0, depth).map((l) => [l.price, l.size]);
  const sizes = [...book.bids, ...book.asks].map((l) => l.size).sort((a, b) => a - b);
  const median = sizes[Math.floor(sizes.length / 2)] || 0;
  const walls = [...book.bids.map((l) => ({ ...l, side: "bid" })), ...book.asks.map((l) => ({ ...l, side: "ask" }))].filter((l) => median > 0 && l.size >= median * 5).sort((a, b) => b.size - a.size).slice(0, 8).map((l) => ({ side: l.side, price: p(l.price), size: sig(l.size, 4), usd: usd(l.size * l.price), x_median: fixed(l.size / median, 1), distance_bps: fixed((l.price - mid) / mid * 1e4, 1) }));
  let cb = 0, ca = 0;
  const venues = perVenue ? [...market.manager.getBooks().values()].map((b) => ({
    venue: b.venue,
    best_bid: p(b.bids[0]?.price),
    best_ask: p(b.asks[0]?.price),
    spread_bps: b.bids[0] && b.asks[0] ? fixed((b.asks[0].price - b.bids[0].price) / ((b.asks[0].price + b.bids[0].price) / 2) * 1e4, 2) : null,
    bid_size_top10: sig(b.bids.slice(0, 10).reduce((a, l) => a + l.size, 0), 4),
    ask_size_top10: sig(b.asks.slice(0, 10).reduce((a, l) => a + l.size, 0), 4),
    levels_held: b.bids.length + b.asks.length,
    updated_s_ago: fixed((Date.now() - b.localTimestamp) / 1e3, 1)
  })) : void 0;
  return {
    ...header(market),
    mid: p(mid),
    spread_bps: fixed(quote.spread_bps, 2),
    ...quote.crossed ? { cross_venue_crossed: true, crossed_note: "Venues quote in USDT, USDC or USD, so the summed book overlaps by a few bps at the touch. mid and spread_bps are medians of each venue's own quote." } : {},
    obi: fixed(market.state.currentOBI, 3),
    group_size: step || "raw",
    columns: ["price", "size", "cumulative_size"],
    bids: bids.map(([price, size]) => [p(price), sig(size, 5), sig(cb += size, 5)]),
    asks: asks.map(([price, size]) => [p(price), sig(size, 5), sig(ca += size, 5)]),
    depth_bands: depthWithin(market, mid, [1e-3, 25e-4, 5e-3, 0.01, 0.02]),
    walls,
    ...venues ? { venues } : {},
    note: "Sizes are base-asset units summed across the venue selection. walls = single price levels \u22655\xD7 the median level size."
  };
}
function tradesView(market, limit, minNotional, side, venue) {
  const p = pricer(market);
  const tape = market.manager.getTapeLog();
  const rows = [];
  for (const t of tape) {
    if (rows.length >= limit) break;
    if (t.quoteVolume < minNotional) continue;
    if (side && t.side !== side) continue;
    if (venue && t.venue !== venue) continue;
    rows.push([iso(t.timestamp), t.venue, t.side, p(t.price), sig(t.quantity), sig(t.quoteVolume, 4)]);
  }
  return {
    ...header(market),
    tape_size: tape.length,
    columns: ["time", "venue", "aggressor", "price", "qty", "notional_usd"],
    trades: rows,
    note: "Newest first. aggressor 'buy' = market buy lifting the offer."
  };
}
function bigTradesView(market, limit, minRatio, windowMinutes) {
  const p = pricer(market);
  const since = now(market) - windowMinutes * 6e4;
  const list = market.state.bigTrades.filter((b) => b.ratio >= minRatio && b.timestamp >= since);
  const buy = list.filter((b) => b.side === "buy");
  const sell = list.filter((b) => b.side === "sell");
  const session = market.state.session;
  return {
    ...header(market),
    window_minutes: windowMinutes,
    min_ratio: minRatio,
    average_print: session ? sig(session.volume / Math.max(1, session.trades)) : null,
    summary: {
      count: list.length,
      buy_count: buy.length,
      sell_count: sell.length,
      buy_usd: usd(buy.reduce((a, b) => a + b.quoteVolume, 0)),
      sell_usd: usd(sell.reduce((a, b) => a + b.quoteVolume, 0))
    },
    columns: ["time", "venue", "aggressor", "price", "qty", "notional_usd", "x_avg_print"],
    trades: list.slice(-limit).reverse().map((b) => [iso(b.timestamp), b.venue, b.side, p(b.price), sig(b.quantity), sig(b.quoteVolume, 4), fixed(b.ratio, 1)]),
    note: "Prints at least min_ratio\xD7 the session's average print size (counted after a 50-trade warm-up). Newest first."
  };
}
function flowSeriesView(market, intervalSeconds, bars, zWindow) {
  const p = pricer(market);
  const resampled = resampleBars(allBars(market), intervalSeconds);
  const z2 = rollingVolumeZScores(resampled, zWindow);
  const rv = rollingRealizedVolatility(resampleBars(market.state.flowBars, 1), 300, 1, secondsPerYear(market.spec.marketType));
  const start = Math.max(0, resampled.length - bars);
  return {
    ...header(market),
    interval_s: intervalSeconds,
    volume_z_window: zWindow,
    realized_vol_5m_ann_pct: fixed(rv[rv.length - 1]?.value ?? null, 1),
    session_cvd: sig(resampled[resampled.length - 1]?.cvd ?? null),
    columns: ["time", "open", "high", "low", "close", "volume", "buy_vol", "sell_vol", "delta", "cvd", "trades", "volume_z"],
    bars: resampled.slice(start).map((b, i) => [
      iso(b.time),
      p(b.open),
      p(b.high),
      p(b.low),
      p(b.close),
      sig(b.volume, 4),
      sig(b.buyVolume, 4),
      sig(b.sellVolume, 4),
      sig(b.buyVolume - b.sellVolume, 4),
      sig(b.cvd, 5),
      b.trades,
      fixed(z2[start + i]?.z ?? null, 2)
    ]),
    note: "Oldest first. cvd = cumulative (buy \u2212 sell) volume since streaming began. The last bar may still be forming."
  };
}
function derivativesView(market, historyMinutes) {
  const p = pricer(market);
  const s = market.state;
  if (market.spec.marketType !== "perpetual") {
    return { ...header(market), derivatives: null, note: "Open interest and funding exist for perpetuals only (market_type=perp)." };
  }
  const d = s.derivatives;
  const windows = [1, 5, 15, 60].map((m) => {
    const c = oiWindowChange(s.oiHistory, m * 6e4);
    return c ? { window_m: m, oi_change_pct: pct(c.oiChange), oi_change: sig(c.oiDelta), price_change_pct: pct(c.priceChange), regime: c.regime, meaning: OI_REGIME_HINT[c.regime] } : { window_m: m, oi_change_pct: null };
  });
  const minute = /* @__PURE__ */ new Map();
  for (const pt of s.oiHistory) minute.set(Math.floor(pt.time / 6e4) * 6e4, { oi: pt.openInterest, price: pt.price });
  const series = [...minute.entries()].slice(-historyMinutes);
  return {
    ...header(market),
    aggregate: d ? {
      open_interest: sig(d.openInterest),
      open_interest_usd: usd(d.openInterestValue),
      funding_8h_pct: pct(d.fundingRate8h, 5),
      funding_annualized_pct: d.fundingRate8h !== null ? fixed(annualizeFunding(d.fundingRate8h, 8) * 100, 2) : null,
      next_funding: iso(d.nextFundingTime),
      mark: p(d.markPrice),
      index: p(d.indexPrice),
      basis_bps: fixed(d.basisBps, 2)
    } : null,
    oi_changes: windows,
    venues: (d?.venues ?? []).map((v) => ({
      venue: v.venue,
      open_interest: sig(v.openInterest ?? null),
      funding_pct: pct(v.fundingRate ?? null, 5),
      funding_interval_h: v.fundingIntervalHours ?? null,
      next_funding: iso(v.nextFundingTime),
      mark: p(v.markPrice),
      index: p(v.indexPrice)
    })),
    oi_history_columns: ["minute", "open_interest", "price"],
    oi_history: series.map(([t, v]) => [iso(t), sig(v.oi, 6), p(v.price)]),
    note: "OI is in base units, summed over venues that report it; funding and basis are OI-weighted. funding_8h normalizes each venue to an 8h interval."
  };
}
function liquidationsView(market, windowMinutes, limit) {
  const p = pricer(market);
  const s = market.state;
  const t = now(market);
  if (market.spec.marketType !== "perpetual") {
    return { ...header(market), liquidations: null, note: "Liquidations exist for perpetuals only (market_type=perp)." };
  }
  const summary = summarizeLiquidations(s.liquidations, t - windowMinutes * 6e4);
  const buckets = bucketLiquidations(s.liquidations, 6e4, Math.min(windowMinutes, 240), t);
  const feeds = market.spec.venues.filter((v) => LIQUIDATION_FEED_VENUES.has(v));
  return {
    ...header(market),
    window_minutes: windowMinutes,
    venues_with_liquidation_feed: feeds,
    summary: {
      long_liquidated_usd: usd(summary.longNotional),
      short_liquidated_usd: usd(summary.shortNotional),
      count: summary.count,
      largest: summary.largest ? { time: iso(summary.largest.timestamp), venue: summary.largest.venue, side: summary.largest.side, price: p(summary.largest.price), usd: usd(summary.largest.quoteVolume) } : null,
      cascade_now: isLiquidationCascade(buckets, 5, 1e5)
    },
    per_minute_columns: ["minute", "long_usd", "short_usd", "count"],
    per_minute: buckets.filter((b) => b.count).map((b) => [iso(b.time), sig(b.longNotional, 4), sig(b.shortNotional, 4), b.count]),
    recent_columns: ["time", "venue", "liquidated_side", "price", "qty", "usd"],
    recent: s.liquidations.slice(-limit).reverse().map((l) => [iso(l.timestamp), l.venue, l.side, p(l.price), sig(l.quantity), sig(l.quoteVolume, 4)]),
    note: "liquidated_side 'long' = a long was force-closed (forced sell). Coverage depends on which venues publish a liquidation stream."
  };
}
function microRow(e, p) {
  return {
    kind: e.kind,
    side: e.side,
    meaning: e.kind === "absorption" ? e.side === "bid" ? "passive bids absorbed aggressive selling (support)" : "passive offers absorbed aggressive buying (resistance)" : e.side === "bid" ? "hidden bid refilled (iceberg buyer)" : "hidden offer refilled (iceberg seller)",
    price: p(e.price),
    time: iso(e.time),
    duration_s: fixed((e.time - e.start) / 1e3, 1),
    volume: sig(e.volume),
    notional_usd: usd(e.notional),
    ratio: fixed(e.ratio, 2),
    ...e.venue ? { venue: e.venue } : {}
  };
}
function microView(market, kind, limit, windowMinutes) {
  const p = pricer(market);
  const since = now(market) - windowMinutes * 6e4;
  const events = market.state.microEvents.filter((e) => e.time >= since && (kind === "all" || e.kind === kind));
  return {
    ...header(market),
    window_minutes: windowMinutes,
    count: events.length,
    events: events.slice(-limit).reverse().map((e) => microRow(e, p)),
    definitions: {
      absorption: "In a 10s window, aggressive volume at one price \u2265 an average window's total and \u226550% of that side's flow, while price moved \u22641 tick through the level.",
      iceberg: "On one venue, more than 1.5\xD7 the displayed size (and \u226510\xD7 the average print) traded at a level that kept refilling."
    }
  };
}
function venuesView(market) {
  const p = pricer(market);
  const s = market.state;
  if (market.spec.venues.length < 2) {
    return { ...header(market), venues: null, note: "Venue comparison needs a multi-venue selection (venue='all')." };
  }
  const summary = venueSummary(s.venueBuckets, now(market));
  return {
    ...header(market),
    window_s: 60,
    leader: summary.leader ? { venue: summary.leader.venue, lead_ms: summary.leader.leadMs, corr: fixed(summary.leader.leadCorr, 2) } : null,
    columns: ["venue", "last", "premium_bps", "volume_60s", "share_pct", "delta_60s", "lead_ms", "lead_corr"],
    venues: summary.stats.map((v) => [v.venue, p(v.last), fixed(v.premiumBps, 2), sig(v.volume, 4), fixed(v.share * 100, 1), sig(v.delta, 4), v.leadMs, fixed(v.leadCorr, 2)]),
    connections: connectionsView(market),
    note: "premium vs the median venue price. lead_ms > 0: that venue's price moves first by that many ms (lagged return correlation over the last 2.5 min)."
  };
}
function heatmapView(market, minutes, rows, columns) {
  const p = pricer(market);
  const h = market.manager.depthHistory;
  const t = now(market);
  const from = h.seqAtOrAfter(t - minutes * 6e4);
  const to = h.lastSeq;
  if (to < from || h.size === 0) return { ...header(market), heatmap: null, note: "No depth snapshots yet (sampled once a second once trades and books arrive)." };
  const tick = h.tick;
  const mid = referenceQuote(market)?.mid || referenceLast(market)?.price || 0;
  const band = 0.01;
  const lo = mid * (1 - band), hi = mid * (1 + band);
  const ticksPerRow = Math.max(1, Math.ceil((hi - lo) / tick / rows));
  const rowSize = Number((ticksPerRow * tick).toPrecision(10));
  const rowOf = (price) => Math.floor(price / rowSize + 1e-9) * rowSize;
  const firstTime = h.get(from).time;
  const span = Math.max(1, h.get(to).time - firstTime + 1e3);
  const colMs = Math.ceil(span / columns / 1e3) * 1e3;
  const grid2 = /* @__PURE__ */ new Map();
  const colCount = Math.ceil(span / colMs);
  const samples = new Array(colCount).fill(0);
  for (let seq = from; seq <= to; seq++) {
    const snap = h.get(seq);
    if (!snap) continue;
    const col = Math.min(colCount - 1, Math.floor((snap.time - firstTime) / colMs));
    samples[col]++;
    for (let i = 0; i < snap.index.length; i++) {
      const price = snap.index[i] * tick;
      if (price < lo || price > hi) continue;
      const r = rowOf(price);
      let cell = grid2.get(r);
      if (!cell) {
        cell = { sum: new Array(colCount).fill(0), n: [] };
        grid2.set(r, cell);
      }
      cell.sum[col] += snap.size[i];
    }
  }
  const list = [...grid2.entries()].sort((a, b) => b[0] - a[0]).map(([price, cell]) => {
    const avg = cell.sum.map((v, i) => samples[i] ? v / samples[i] : 0);
    return { price, avg };
  });
  const overall = list.map((r) => ({ price: r.price, mean: r.avg.reduce((a, b) => a + b, 0) / colCount, first: r.avg[0], last: r.avg[colCount - 1] }));
  const sorted = [...overall].sort((a, b) => b.mean - a.mean);
  const median = [...overall].map((r) => r.mean).sort((a, b) => a - b)[Math.floor(overall.length / 2)] || 0;
  const walls = sorted.slice(0, 8).map((r) => ({
    price: p(r.price),
    side: r.price < mid ? "bid" : "ask",
    avg_size: sig(r.mean, 4),
    x_median: median ? fixed(r.mean / median, 1) : null,
    change_pct: r.first > 0 ? fixed((r.last - r.first) / r.first * 100, 0) : null,
    trend: r.first > 0 && r.last < r.first * 0.5 ? "pulled" : r.last > r.first * 1.5 ? "added" : "stable"
  }));
  return {
    ...header(market),
    minutes,
    mid: p(mid),
    row_size: rowSize,
    column_s: colMs / 1e3,
    column_times: Array.from({ length: colCount }, (_, i) => iso(firstTime + i * colMs)),
    persistent_walls: walls,
    columns: ["price_low", "avg_resting_size_per_column\u2026"],
    rows: list.map((r) => [p(r.price), ...r.avg.map((v) => sig(v, 3))]),
    note: "Average resting order-book size (base units, all selected venues) per price row and time column, within \xB11% of mid. trend compares the first and last column."
  };
}
function cascadeNow(market, windowMinutes = 30) {
  if (market.spec.marketType !== "perpetual") return false;
  const buckets = bucketLiquidations(market.state.liquidations, 6e4, windowMinutes, now(market));
  return isLiquidationCascade(buckets, 5, 1e5);
}
function scanRow(m, last = referenceLast(m)?.price) {
  const s = m.state;
  const t = s.marketClock || Date.now();
  const w5 = flowWindow(m, 5 * 6e4);
  const sigma = sigmaFromVwapOf(m);
  const bars = s.flowBars;
  let volumeZ = null;
  if (bars.length > 120) {
    const minutes = /* @__PURE__ */ new Map();
    for (const b of bars) minutes.set(Math.floor(b.time / 6e4), (minutes.get(Math.floor(b.time / 6e4)) ?? 0) + b.volume);
    const vols = [...minutes.values()];
    const lastVolume = vols[vols.length - 2];
    const base = vols.slice(Math.max(0, vols.length - 22), -2);
    if (base.length >= 3 && lastVolume !== void 0) {
      const mean = base.reduce((a, b) => a + b, 0) / base.length;
      const sd = Math.sqrt(base.reduce((a, b) => a + (b - mean) ** 2, 0) / (base.length - 1));
      volumeZ = sd > 0 ? (lastVolume - mean) / sd : 0;
    }
  }
  const oi5 = oiWindowChange(s.oiHistory, 5 * 6e4);
  const liq = summarizeLiquidations(s.liquidations, t - 5 * 6e4);
  return {
    symbol: m.spec.symbol,
    ready: m.ready,
    stream_age_s: Math.round(m.ageMs / 1e3),
    last: sig(last, 8),
    change_5m_pct: w5?.price_change_pct ?? null,
    delta_5m: w5?.delta ?? null,
    buy_pct_5m: w5?.buy_pct ?? null,
    notional_5m_usd: w5 ? Math.round(w5.notional_raw) : null,
    volume_z_1m: fixed(volumeZ, 2),
    sigma_from_vwap: fixed(sigma, 2),
    obi: m.ready ? fixed(s.currentOBI, 2) : null,
    funding_8h_pct: pct(s.derivatives?.fundingRate8h ?? null, 4),
    oi_change_5m_pct: oi5 ? pct(oi5.oiChange) : null,
    oi_regime_5m: oi5?.regime ?? null,
    liquidations_5m_usd: Math.round(liq.longNotional + liq.shortNotional),
    big_prints_5m: s.bigTrades.filter((b) => b.timestamp >= t - 5 * 6e4).length,
    live_venues: m.connections().filter((c) => c.status === "live").length + "/" + m.spec.venues.length
  };
}
var pct;
var init_views = __esm({
  "src/views.ts"() {
    "use strict";
    init_orderFlowEngine();
    init_imbalance();
    init_analytics();
    init_derivatives();
    init_venues();
    pct = (x, decimals = 3) => fixed(x === null || x === void 0 ? null : x * 100, decimals);
  }
});

// src/alerts.ts
function hasCondition(c) {
  return c.price_above !== void 0 || c.price_below !== void 0 || c.move_pct !== void 0 || !!c.liquidation_cascade || c.liquidations_usd !== void 0 || c.big_trade_usd !== void 0 || !!c.absorption || !!c.iceberg;
}
function checkConditions(market, c, since) {
  const s = market.state;
  const now2 = s.marketClock || Date.now();
  const at = iso(now2);
  const price = referenceLast(market, s.recentTrades)?.price ?? null;
  if (price !== null && c.price_above !== void 0 && price >= c.price_above) {
    return { condition: "price_above", detail: `Price ${sig(price, 8)} is at or above ${c.price_above}.`, time: at };
  }
  if (price !== null && c.price_below !== void 0 && price <= c.price_below) {
    return { condition: "price_below", detail: `Price ${sig(price, 8)} is at or below ${c.price_below}.`, time: at };
  }
  if (c.move_pct !== void 0) {
    const minutes = c.move_minutes ?? 5;
    const w = flowWindow(market, minutes * 6e4);
    if (w?.price_change_pct !== null && w?.price_change_pct !== void 0 && Math.abs(w.price_change_pct) >= c.move_pct) {
      return { condition: "move_pct", detail: `Price moved ${w.price_change_pct > 0 ? "+" : ""}${w.price_change_pct}% over the last ${minutes}m (threshold \xB1${c.move_pct}%).`, time: at };
    }
  }
  if (c.liquidation_cascade && cascadeNow(market)) {
    const liq = summarizeLiquidations(s.liquidations, now2 - 6e4);
    return {
      condition: "liquidation_cascade",
      detail: `Liquidation cascade: ${usd(liq.longNotional)} longs and ${usd(liq.shortNotional)} shorts liquidated in the last minute, at least 5\xD7 a typical minute over the last 30m.`,
      time: at
    };
  }
  if (c.liquidations_usd !== void 0) {
    const minutes = c.liquidations_minutes ?? 5;
    const liq = summarizeLiquidations(s.liquidations, now2 - minutes * 6e4);
    const total = liq.longNotional + liq.shortNotional;
    if (total >= c.liquidations_usd) {
      return { condition: "liquidations_usd", detail: `${usd(total)} liquidated in ${minutes}m (longs ${usd(liq.longNotional)}, shorts ${usd(liq.shortNotional)}).`, time: at };
    }
  }
  if (c.big_trade_usd !== void 0) {
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
      if (e.kind === "absorption" && c.absorption || e.kind === "iceberg" && c.iceberg) {
        const what = e.kind === "absorption" ? e.side === "bid" ? "Bids absorbed aggressive selling" : "Offers absorbed aggressive buying" : e.side === "bid" ? "Iceberg bid refilled" : "Iceberg offer refilled";
        return { condition: e.kind, detail: `${what} at ${sig(e.price, 8)} (${usd(e.notional)}, ratio ${fixed(e.ratio, 1)}).`, time: iso(e.time) };
      }
    }
  }
  return null;
}
var init_alerts = __esm({
  "src/alerts.ts"() {
    "use strict";
    init_derivatives();
    init_views();
  }
});

// src/server.ts
var server_exports = {};
__export(server_exports, {
  MarketError: () => MarketError,
  VERSION: () => VERSION,
  createServer: () => createServer
});
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
function json(value) {
  return { content: [{ type: "text", text: JSON.stringify(value) }] };
}
function fail(message) {
  return { content: [{ type: "text", text: JSON.stringify({ error: message }) }], isError: true };
}
function createServer(hub2, extras2 = {}) {
  const server = new McpServer({ name: "order-flow-mcp", version: VERSION }, { instructions: INSTRUCTIONS });
  async function withMarket(args, fn) {
    try {
      const { market, created } = hub2.open(args.symbol, args.venue, args.market_type);
      if (!market.ready || !market.settled && market.ageMs < 15e3) {
        await market.waitReady(Math.max(0, (args.wait_seconds ?? 10) * 1e3 - market.ageMs));
      }
      if (!market.ready) {
        return json({
          ...header(market),
          status: created ? "started_streaming_no_data_yet" : "no_data_yet",
          connections: connectionsView(market),
          hint: "The stream is connecting or the venues are unreachable/geo-blocked from this server. Retry in a few seconds, or pick another venue."
        });
      }
      return json(fn(market));
    } catch (error) {
      return fail(error instanceof Error ? error.message : String(error));
    }
  }
  const readOnly = { readOnlyHint: true, openWorldHint: true };
  server.registerTool("list_markets", {
    title: "List markets",
    description: "Supported crypto assets (plus gold and silver perpetuals), which exchanges list each as perpetual or spot, and timeframes. Filter with query (e.g. 'sol', 'meme').",
    inputSchema: { query: z.string().optional().describe("Case-insensitive filter on ticker or name."), limit: z.number().int().min(1).max(500).optional() },
    annotations: { readOnlyHint: true }
  }, async ({ query, limit }) => {
    const q = query?.trim().toLowerCase();
    const assets = ALL_ASSETS.filter((a) => !q || a.base.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
    return json({
      count: assets.length,
      columns: ["symbol", "name", "kind", "perp_venues", "spot_venues"],
      assets: assets.slice(0, limit ?? 200).map((a) => [`${a.base}USDT`, a.name, a.kind, a.perp.join(","), a.spot.join(",")]),
      perp_venues: PERP_VENUES2,
      spot_venues: SPOT_VENUES2,
      timeframes: TIMEFRAMES
    });
  });
  server.registerTool("get_market_snapshot", {
    title: "Market snapshot",
    description: "One-call overview of live order flow for a market: price/spread, session OHLC & VWAP (\u03C3 distance), buy/sell volume & delta over 1m/5m/15m, volume z-score, realized vol, POC/VAH/VAL, order-book imbalance and depth bands, open interest & regime, funding, basis, liquidations, big prints, absorption/iceberg events, plain-language signals and venue connection status.",
    inputSchema: marketArgs,
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => snapshotView(m)));
  server.registerTool("get_footprint", {
    title: "Footprint candles",
    description: "Footprint (bid \xD7 ask volume per price row) candles: OHLC, volume, delta, CVD, POC, VWAP, per-row bid/ask volume with imbalance flags, and stacked imbalances. Rows are grouped so each candle has at most max_rows rows.",
    inputSchema: {
      ...marketArgs,
      timeframe: z.enum(["1m", "5m", "15m", "30m", "1h", "4h"]).optional().describe("Candle timeframe (default 5m)."),
      candles: z.number().int().min(1).max(100).optional().describe("Most recent candles to return (default 6)."),
      max_rows: z.number().int().min(3).max(200).optional().describe("Max price rows per candle (default 24)."),
      row_ticks: z.number().int().min(1).max(1e4).optional().describe("Fixed row height in ticks (overrides max_rows)."),
      imbalance_ratio: z.number().min(1.1).max(20).optional().describe("Imbalance ratio: ask/bid or bid/ask volume at the same row (default 3)."),
      stacked_levels: z.number().int().min(2).max(10).optional().describe("Consecutive imbalanced rows that count as stacked (default 3)."),
      include_rows: z.boolean().optional().describe("Include per-row volumes (default true). False returns candle summaries only.")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => footprintView(m, {
    timeframe: args.timeframe ?? "5m",
    candles: args.candles ?? 6,
    maxRows: args.max_rows ?? 24,
    rowTicks: args.row_ticks,
    imbalanceRatio: args.imbalance_ratio ?? 3,
    stackedLevels: args.stacked_levels ?? 3,
    includeRows: args.include_rows ?? true
  })));
  server.registerTool("get_volume_profile", {
    title: "Session volume profile",
    description: "Volume at price for the streamed session: POC, value area high/low, high-volume nodes, and per-row buy/sell volume and delta.",
    inputSchema: {
      ...marketArgs,
      rows: z.number().int().min(5).max(300).optional().describe("Number of price rows (default 40)."),
      value_area_pct: z.number().min(50).max(95).optional().describe("Value area percentage (default 70).")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => volumeProfileView(m, args.rows ?? 40, (args.value_area_pct ?? 70) / 100)));
  server.registerTool("get_order_book", {
    title: "Order book",
    description: "Live aggregated order book: top levels with cumulative size, spread, imbalance, depth within 0.1\u20132% of mid, large resting walls, and optionally per-venue top of book.",
    inputSchema: {
      ...marketArgs,
      depth: z.number().int().min(1).max(100).optional().describe("Levels per side (default 20)."),
      group_ticks: z.number().int().min(0).max(1e4).optional().describe("Group levels into buckets of N footprint ticks (~1bp each). 0 = raw exchange levels (default)."),
      per_venue: z.boolean().optional().describe("Include each venue's top of book (default false).")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => orderBookView(m, args.depth ?? 20, args.group_ticks ?? 0, args.per_venue ?? false)));
  server.registerTool("get_trades", {
    title: "Time & sales",
    description: "Recent executed trades (tape), newest first, with aggressor side and notional. Filter by minimum notional, side or venue.",
    inputSchema: {
      ...marketArgs,
      limit: z.number().int().min(1).max(1e3).optional().describe("Max trades (default 50)."),
      min_notional_usd: z.number().min(0).optional().describe("Only trades at least this notional."),
      side: z.enum(["buy", "sell"]).optional(),
      only_venue: z.string().optional().describe("Only trades from this venue id, e.g. bybit-futures.")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => tradesView(m, args.limit ?? 50, args.min_notional_usd ?? 0, args.side, args.only_venue)));
  server.registerTool("get_big_trades", {
    title: "Big prints",
    description: "Block / whale prints: trades at least N\xD7 the session's average print size, with buy vs sell totals.",
    inputSchema: {
      ...marketArgs,
      min_ratio: z.number().min(5).max(1e3).optional().describe("Minimum multiple of the average print (default 10; at least 5)."),
      window_minutes: z.number().min(1).max(480).optional().describe("Look-back window (default 60)."),
      limit: z.number().int().min(1).max(500).optional().describe("Max prints listed (default 30).")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => bigTradesView(m, args.limit ?? 30, args.min_ratio ?? 10, args.window_minutes ?? 60)));
  server.registerTool("get_flow_series", {
    title: "Flow bars (CVD, volume z-score)",
    description: "Time bars of executed flow: OHLC, volume, buy/sell volume, delta, cumulative volume delta (CVD), trade count and rolling volume z-score, plus realized volatility. Built from 1-second bars (2h kept).",
    inputSchema: {
      ...marketArgs,
      interval_seconds: z.number().int().min(1).max(3600).optional().describe("Bar length in seconds (default 60)."),
      bars: z.number().int().min(1).max(500).optional().describe("Most recent bars (default 60)."),
      z_window: z.number().int().min(5).max(500).optional().describe("Bars in the volume z-score baseline (default 20).")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => flowSeriesView(m, args.interval_seconds ?? 60, args.bars ?? 60, args.z_window ?? 20)));
  server.registerTool("get_derivatives", {
    title: "Open interest & funding",
    description: "Perpetuals positioning: aggregate and per-venue open interest, funding (native and 8h-normalized, annualized), next funding, mark/index basis, OI change over 1m/5m/15m/60m with the price \xD7 OI regime (new longs, short covering, new shorts, long unwind), and per-minute OI history.",
    inputSchema: { ...marketArgs, history_minutes: z.number().int().min(1).max(120).optional().describe("Minutes of OI history (default 30).") },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => derivativesView(m, args.history_minutes ?? 30)));
  server.registerTool("get_liquidations", {
    title: "Liquidations",
    description: "Forced liquidations on perpetuals: long vs short notional over a window, per-minute buckets, largest liquidation, cascade flag and the latest events.",
    inputSchema: {
      ...marketArgs,
      window_minutes: z.number().min(1).max(240).optional().describe("Look-back window (default 30)."),
      limit: z.number().int().min(1).max(500).optional().describe("Recent events listed (default 20).")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => liquidationsView(m, args.window_minutes ?? 30, args.limit ?? 20)));
  server.registerTool("get_microstructure_events", {
    title: "Absorption & icebergs",
    description: "Detected absorption (passive side holding against aggressive flow without price moving) and iceberg orders (hidden size refilling at a level).",
    inputSchema: {
      ...marketArgs,
      kind: z.enum(["all", "absorption", "iceberg"]).optional(),
      window_minutes: z.number().min(1).max(480).optional().describe("Look-back window (default 60)."),
      limit: z.number().int().min(1).max(500).optional().describe("Max events (default 20).")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => microView(m, args.kind ?? "all", args.limit ?? 20, args.window_minutes ?? 60)));
  server.registerTool("get_venue_comparison", {
    title: "Venue comparison",
    description: "Cross-exchange view for an aggregated market: each venue's last price premium vs the median, 60s volume share and delta, and which venue leads price (lag in ms).",
    inputSchema: marketArgs,
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => venuesView(m)));
  server.registerTool("get_liquidity_heatmap", {
    title: "Resting liquidity heatmap",
    description: "Order-book depth over time (sampled every second) within \xB11% of mid: average resting size per price row and time column, plus persistent walls and whether they were pulled, added or held.",
    inputSchema: {
      ...marketArgs,
      minutes: z.number().min(1).max(120).optional().describe("Look-back (default 10)."),
      rows: z.number().int().min(5).max(100).optional().describe("Price rows (default 20)."),
      columns: z.number().int().min(1).max(60).optional().describe("Time columns (default 10).")
    },
    annotations: readOnly
  }, async (args) => withMarket(args, (m) => heatmapView(m, args.minutes ?? 10, args.rows ?? 20, args.columns ?? 10)));
  server.registerTool("scan_markets", {
    title: "Order-flow screener",
    description: "Screen several markets side by side: price change, 5m delta and buy %, 5m notional, 1m volume z-score, VWAP distance, book imbalance, funding, 5m OI change, 5m liquidations and big prints. Starts streams that are not running yet.",
    inputSchema: {
      symbols: z.array(z.string()).min(1).max(15).optional().describe("Symbols to screen (default BTC, ETH, SOL, XRP, DOGE, BNB, HYPE, SUI)."),
      venue: venueArg,
      market_type: marketTypeArg,
      sort_by: z.enum(["volume_z", "delta_5m", "buy_pct_5m", "change_5m", "notional_5m", "sigma_from_vwap", "oi_change_5m", "liquidations_5m"]).optional().describe("Sort column, descending by absolute value where signed (default notional_5m)."),
      wait_seconds: waitArg
    },
    annotations: readOnly
  }, async (args) => {
    const symbols = args.symbols ?? ["BTC", "ETH", "SOL", "XRP", "DOGE", "BNB", "HYPE", "SUI"];
    const errors = {};
    const markets = [];
    for (const symbol of symbols) {
      try {
        markets.push(hub2.open(symbol, args.venue, args.market_type).market);
      } catch (error) {
        errors[symbol] = error instanceof Error ? error.message : String(error);
      }
    }
    await Promise.all(markets.map((m) => m.ready && m.settled ? true : m.waitReady(Math.max(1e3, (args.wait_seconds ?? 10) * 1e3 - m.ageMs))));
    const rows = markets.map((m) => scanRow(m));
    const key2 = {
      volume_z: "volume_z_1m",
      delta_5m: "delta_5m",
      buy_pct_5m: "buy_pct_5m",
      change_5m: "change_5m_pct",
      notional_5m: "notional_5m_usd",
      sigma_from_vwap: "sigma_from_vwap",
      oi_change_5m: "oi_change_5m_pct",
      liquidations_5m: "liquidations_5m_usd"
    }[args.sort_by ?? "notional_5m"];
    const signed = key2 !== "buy_pct_5m" && key2 !== "notional_5m_usd" && key2 !== "liquidations_5m_usd";
    rows.sort((a, b) => {
      const av = a[key2], bv = b[key2];
      const x = av === null ? -Infinity : signed ? Math.abs(av) : av;
      const y = bv === null ? -Infinity : signed ? Math.abs(bv) : bv;
      return y - x;
    });
    const keys = rows.length ? Object.keys(rows[0]) : [];
    return json({
      as_of: iso(Date.now()),
      sorted_by: key2,
      columns: keys,
      rows: rows.map((r) => keys.map((k) => r[k])),
      ...Object.keys(errors).length ? { errors } : {},
      note: "Notional is base volume \xD7 price. Young streams (stream_age_s < 300) have incomplete 5m windows; delta is in base units."
    });
  });
  server.registerTool("watch_markets", {
    title: "Watch markets",
    description: "Start streaming markets now and keep them running (pinned, never idle-closed) so history accumulates for later analysis. Returns each market's status.",
    inputSchema: {
      symbols: z.array(z.string()).min(1).max(20),
      venue: venueArg,
      market_type: marketTypeArg
    },
    annotations: { readOnlyHint: false, openWorldHint: true }
  }, async ({ symbols, venue, market_type }) => {
    const out = symbols.map((symbol) => {
      try {
        const { market, created } = hub2.open(symbol, venue, market_type);
        market.pinned = true;
        return { symbol: market.spec.symbol, key: market.spec.key, venues: market.spec.venues, started: created, stream_age_s: Math.round(market.ageMs / 1e3) };
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
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false }
  }, async ({ symbol, venue, market_type }) => {
    try {
      const spec = resolveMarket(symbol, venue, market_type);
      return json({ stopped: hub2.close(spec.key), key: spec.key });
    } catch (error) {
      return fail(error instanceof Error ? error.message : String(error));
    }
  });
  server.registerTool("list_active_markets", {
    title: "Active streams",
    description: "Markets currently streaming on this server, with age, trade count, pin state and venue connection status.",
    inputSchema: {},
    annotations: { readOnlyHint: true }
  }, async () => json({
    max_markets: hub2.options.maxMarkets,
    idle_close_minutes: hub2.options.idleMs > 0 ? hub2.options.idleMs / 6e4 : "never",
    markets: hub2.list().map((m) => ({
      symbol: m.spec.symbol,
      market_type: m.spec.marketType,
      venue_selection: m.spec.selection,
      pinned: m.pinned,
      stream_age_s: Math.round(m.ageMs / 1e3),
      idle_s: Math.round((Date.now() - m.lastAccess) / 1e3),
      trades: m.state.session?.trades ?? 0,
      last: sig(referenceLast(m)?.price, 8),
      connections: connectionsView(m)
    }))
  }));
  server.registerTool("open_screener", {
    title: "Open the live screener",
    description: "Open a live screener page for the user: a watchlist of every streaming market whose prices, sparklines and order-flow stats (delta, buy %, book imbalance, funding, OI, liquidations, cascade alerts, big prints) update several times a second, plus a live tape of notable events. Pass symbols to add them to the watchlist first. Returns the page URL; on a local server it also opens it in the browser.",
    inputSchema: {
      symbols: z.array(z.string()).max(20).optional().describe('Markets to add and pin first, e.g. ["BTC", "ETH", "SOL"]. Markets already streaming are shown either way.'),
      venue: venueArg,
      market_type: marketTypeArg,
      open_browser: z.boolean().optional().describe("Open the page in the default browser of the machine running this server (default true). Set false when the server is remote.")
    },
    annotations: { readOnlyHint: false, openWorldHint: true }
  }, async ({ symbols, venue, market_type, open_browser }) => {
    if (!extras2.screener) return fail("The live screener is not available on this server.");
    const added = [];
    for (const symbol of symbols ?? []) {
      try {
        const { market } = hub2.open(symbol, venue, market_type);
        market.pinned = true;
        added.push({ symbol: market.spec.symbol, key: market.spec.key });
      } catch (error) {
        added.push({ symbol, error: error instanceof Error ? error.message : String(error) });
      }
    }
    try {
      const url = await extras2.screener();
      const opened = open_browser !== false && !!extras2.openBrowser?.(url);
      return json({
        url,
        opened_in_browser: opened,
        ...added.length ? { added } : {},
        markets_on_screen: hub2.list().map((m) => m.spec.key),
        note: opened ? "The screener is open in the user's browser and updates live. Tell the user the URL in case it opened behind other windows." : "Give the user this URL to open; the page updates live. It is served by this MCP server, so it works only while the server runs and from a machine that can reach it."
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
      liquidation_cascade: z.boolean().optional().describe("Fire on a liquidation cascade: the last minute's liquidations are \u2265 $100K and at least 5\xD7 a typical (median) minute over the last 30m (perps)."),
      liquidations_usd: z.number().positive().optional().describe("Fire when liquidations over liquidations_minutes reach this many USD (perps)."),
      liquidations_minutes: z.number().min(1).max(60).optional().describe("Window for liquidations_usd (default 5)."),
      big_trade_usd: z.number().positive().optional().describe("Fire on a single print of at least this many USD."),
      absorption: z.boolean().optional().describe("Fire on a new absorption event."),
      iceberg: z.boolean().optional().describe("Fire on a new iceberg event."),
      timeout_seconds: z.number().min(1).max(3600).optional().describe("Give up after this long (default 300). Clients may cut very long calls; on timed_out just call again.")
    },
    annotations: readOnly
  }, async (args, extra) => {
    const conditions = {
      price_above: args.price_above,
      price_below: args.price_below,
      move_pct: args.move_pct,
      move_minutes: args.move_minutes,
      liquidation_cascade: args.liquidation_cascade,
      liquidations_usd: args.liquidations_usd,
      liquidations_minutes: args.liquidations_minutes,
      big_trade_usd: args.big_trade_usd,
      absorption: args.absorption,
      iceberg: args.iceberg
    };
    if (!hasCondition(conditions)) return fail("Give at least one condition, e.g. liquidation_cascade: true or price_above: 100000.");
    const markets = [];
    const wasPinned = /* @__PURE__ */ new Map();
    const errors = {};
    for (const symbol of args.symbols) {
      try {
        const { market } = hub2.open(symbol, args.venue, args.market_type);
        if (!wasPinned.has(market)) wasPinned.set(market, market.pinned);
        market.pinned = true;
        markets.push(market);
      } catch (error) {
        errors[symbol] = error instanceof Error ? error.message : String(error);
      }
    }
    if (!markets.length) return fail(Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join("; "));
    await Promise.all(markets.map((m) => m.ready ? true : m.waitReady(1e4)));
    const started = Date.now();
    const timeoutMs = (args.timeout_seconds ?? 300) * 1e3;
    const since = new Map(markets.map((m) => [m, m.state.marketClock || Date.now()]));
    const progressToken = extra._meta?.progressToken;
    let nextProgress = started + 15e3;
    let hit = null;
    while (!extra.signal.aborted) {
      for (const m of markets) {
        const h = checkConditions(m.touch(), conditions, since.get(m));
        if (h) {
          hit = { market: m, hit: h };
          break;
        }
      }
      if (hit || Date.now() - started >= timeoutMs) break;
      if (progressToken !== void 0 && Date.now() >= nextProgress) {
        nextProgress += 15e3;
        await extra.sendNotification({
          method: "notifications/progress",
          params: { progressToken, progress: Date.now() - started, total: timeoutMs, message: "Watching " + markets.map((m) => m.spec.symbol).join(", ") }
        }).catch(() => {
        });
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    for (const [m, pinned] of wasPinned) m.pinned = pinned;
    const waited = fixed((Date.now() - started) / 1e3, 1);
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
        ...Object.keys(errors).length ? { errors } : {}
      });
    }
    return json({
      triggered: false,
      reason: extra.signal.aborted ? "cancelled" : "timed_out",
      waited_s: waited,
      rows: markets.map((m) => scanRow(m)),
      ...Object.keys(errors).length ? { errors } : {},
      note: "Nothing fired. Call wait_for again to keep watching."
    });
  });
  server.registerPrompt("analyze_order_flow", {
    title: "Analyze order flow",
    description: "Read the live order flow for a market and summarize who is in control, key levels and risks.",
    argsSchema: { symbol: z.string().describe("e.g. BTC"), timeframe: z.string().optional().describe("Footprint timeframe, default 5m") }
  }, ({ symbol, timeframe }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Analyze the live order flow for ${symbol}. Call get_market_snapshot first, then get_footprint (timeframe ${timeframe ?? "5m"}), get_volume_profile, get_order_book and, for perpetuals, get_derivatives and get_liquidations. Report: (1) who is in control (aggressor balance, delta/CVD trend, divergences), (2) key levels (POC, VAH/VAL, VWAP \xB1\u03C3, book walls, absorption/iceberg prices), (3) positioning (OI regime, funding, liquidations), (4) what would change the read. Mention stream_age_s and treat young streams with caution. This is analysis, not financial advice.`
      }
    }]
  }));
  return server;
}
var VERSION, INSTRUCTIONS, symbolArg, venueArg, marketTypeArg, waitArg, marketArgs;
var init_server = __esm({
  "src/server.ts"() {
    "use strict";
    init_instruments();
    init_alerts();
    init_resolve();
    init_views();
    VERSION = "0.1.0";
    INSTRUCTIONS = `Live crypto order-flow data streamed from up to 10 exchanges (Binance, Bybit, OKX, Bitget, Hyperliquid, Deribit, Coinbase, Gate, KuCoin, Kraken, HTX), normalized and aggregated.

How to use:
- Start with get_market_snapshot for a symbol (e.g. "BTC", "ETH", "SOL"). It returns price, session VWAP, delta, CVD windows, volume profile levels, order-book imbalance, open interest, funding, liquidations, big prints, absorption/iceberg events and plain-language signals.
- Drill down with get_footprint, get_volume_profile, get_order_book, get_flow_series (CVD / volume z-score), get_derivatives, get_liquidations, get_big_trades, get_trades, get_microstructure_events, get_venue_comparison and get_liquidity_heatmap.
- Use scan_markets to screen several symbols at once.
- To watch for something (a liquidation cascade, a price level, a big print, a sharp move), call wait_for: it blocks until the condition fires or times out, so you react within a fraction of a second without polling. Call it again to keep watching.
- When the user wants to see the market live, call open_screener: it opens a page that updates several times a second with prices, sparklines and order-flow stats for every streaming market.
- Defaults: market_type="perp" and venue="all" (every venue listing the market, aggregated). Pass venue="bybit" etc. for one exchange, market_type="spot" for spot.

Important: data is live and in-memory, and streams continuously while the server runs. The server's watchlist (BTC, ETH and SOL perpetuals by default) streams from startup; any other market starts streaming the first time it is requested and then keeps streaming. Session statistics cover only the time since a market began streaming (see stream_age_s; warming_up=true for the first minute), so wait before drawing conclusions from a young stream. list_active_markets shows what is streaming and for how long; watch_markets pins more markets. This is market data for analysis only; it cannot place orders.`;
    symbolArg = z.string().describe('Asset or symbol, e.g. "BTC", "ETHUSDT", "SOL-PERP".');
    venueArg = z.string().optional().describe('"all" (default, aggregate every venue listing the market) or one exchange: binance, bybit, okx, bitget, hyperliquid, deribit, coinbase, gate, kucoin, kraken, htx.');
    marketTypeArg = z.enum(["perp", "perpetual", "spot"]).optional().describe('"perp" (default) or "spot".');
    waitArg = z.number().min(0).max(30).optional().describe("Seconds to wait for first data when a market is not streaming yet (default 10).");
    marketArgs = { symbol: symbolArg, venue: venueArg, market_type: marketTypeArg, wait_seconds: waitArg };
  }
});

// src/screener-page.ts
var SCREENER_PAGE;
var init_screener_page = __esm({
  "src/screener-page.ts"() {
    "use strict";
    SCREENER_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark light">
<title>Order Flow Screener</title>
<style>
:root {
  --bg: #000; --fg: #fff; --muted: #8e8e93; --faint: #48484a; --line: #1c1c1e; --chip: #1c1c1e;
  --up: #30d158; --down: #ff453a; --up-pill: #34c759; --down-pill: #ff3b30; --pill-fg: #fff;
  --flat: #636366; --warn: #ffd60a;
}
@media (prefers-color-scheme: light) {
  :root { --bg: #fff; --fg: #000; --muted: #6c6c70; --faint: #c7c7cc; --line: #e5e5ea; --chip: #f2f2f7;
    --up: #248a3d; --down: #d70015; --flat: #8e8e93; --warn: #b25000; }
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--fg); }
body {
  font: 16px/1.3 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased; font-variant-numeric: tabular-nums;
  padding: 0 16px env(safe-area-inset-bottom);
}
main { max-width: 760px; margin: 0 auto; }
header {
  position: sticky; top: 0; z-index: 2; background: var(--bg);
  display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  padding: 20px 0 12px; border-bottom: 1px solid var(--line);
}
h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.sub { color: var(--muted); font-size: 14px; margin-top: 4px; display: flex; align-items: center; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--up); box-shadow: 0 0 0 0 var(--up); animation: beat 2s infinite; }
.dot.off { background: var(--flat); animation: none; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(48,209,88,.6); } 70% { box-shadow: 0 0 0 7px rgba(48,209,88,0); } 100% { box-shadow: 0 0 0 0 rgba(48,209,88,0); } }
.seg { display: inline-flex; background: var(--chip); border-radius: 9px; padding: 2px; }
.seg button {
  font: inherit; font-size: 13px; font-weight: 600; color: var(--muted); background: none; border: 0;
  padding: 6px 11px; border-radius: 7px; cursor: pointer;
}
.seg button[aria-pressed="true"] { background: var(--faint); color: var(--fg); }
.row {
  display: grid; grid-template-columns: minmax(0, 1fr) 128px minmax(108px, auto); column-gap: 16px; align-items: center;
  padding: 14px 0 12px; border-bottom: 1px solid var(--line);
}
.id { min-width: 0; }
.sym { font-size: 21px; font-weight: 700; letter-spacing: -0.01em; display: flex; align-items: center; gap: 7px; white-space: nowrap; }
.tag { font-size: 10px; font-weight: 700; color: var(--muted); border: 1px solid var(--faint); border-radius: 4px; padding: 1px 4px; letter-spacing: .04em; }
.name { color: var(--muted); font-size: 15px; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge { font-size: 10px; font-weight: 800; letter-spacing: .05em; border-radius: 4px; padding: 2px 5px; }
.badge.cascade { background: var(--down-pill); color: #fff; animation: blink 1s steps(2, start) infinite; }
.badge.warm { color: var(--warn); border: 1px solid currentColor; font-weight: 700; }
@keyframes blink { to { opacity: .45; } }
svg.spark { width: 128px; height: 46px; display: block; overflow: visible; }
.quote { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.px { font-size: 21px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; transition: color .5s; }
.px .d { border-radius: 3px; transition: background-color .6s, color .6s; }
.px.up .d { color: var(--up); background: rgba(48,209,88,.16); transition: none; }
.px.down .d { color: var(--down); background: rgba(255,69,58,.16); transition: none; }
.pill {
  font: inherit; font-size: 16px; font-weight: 600; min-width: 96px; text-align: right; color: var(--pill-fg);
  background: var(--flat); border: 0; border-radius: 7px; padding: 5px 9px; cursor: pointer; white-space: nowrap;
}
.pill.up { background: var(--up-pill); } .pill.down { background: var(--down-pill); }
.flow { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.chip { font-size: 12px; background: var(--chip); color: var(--muted); border-radius: 6px; padding: 3px 7px; white-space: nowrap; }
.chip b { font-weight: 600; color: var(--fg); }
.chip b.up { color: var(--up); } .chip b.down { color: var(--down); } .chip.hot { box-shadow: inset 0 0 0 1px var(--warn); }
.empty { color: var(--muted); padding: 40px 0; text-align: center; line-height: 1.6; }
.empty code { background: var(--chip); padding: 2px 6px; border-radius: 5px; color: var(--fg); }
section.tape { margin: 26px 0 10px; }
section.tape h2 { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; margin: 0 0 6px; }
.ev { display: grid; grid-template-columns: 70px 52px minmax(0, 1fr) auto; gap: 10px; font-size: 14px; padding: 7px 0; border-bottom: 1px solid var(--line); align-items: baseline; }
.ev .t { color: var(--muted); } .ev .b { font-weight: 700; } .ev .x { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ev .u.up { color: var(--up); } .ev .u.down { color: var(--down); }
.ev.new { animation: slide .5s ease-out; }
@keyframes slide { from { background: var(--chip); } to { background: transparent; } }
footer { color: var(--muted); font-size: 12px; padding: 18px 0 28px; line-height: 1.5; }
@media (max-width: 480px) {
  .row { grid-template-columns: minmax(0, 1fr) 84px minmax(96px, auto); column-gap: 10px; }
  svg.spark { width: 84px; }
  .sym, .px { font-size: 18px; }
  .pill { font-size: 14px; min-width: 82px; }
  .name { font-size: 13px; }
  .ev { grid-template-columns: 62px 44px minmax(0, 1fr) auto; font-size: 13px; }
  .chip.minor { display: none; }
  .chip { font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) { .dot, .badge.cascade, .ev.new { animation: none; } }
</style>
</head>
<body>
<main>
  <header>
    <div>
      <h1>Order Flow</h1>
      <div class="sub"><span class="dot off" id="dot"></span><span id="status">Connecting\u2026</span></div>
    </div>
    <nav class="seg" id="seg" aria-label="Change window">
      <button data-w="15m">15m</button><button data-w="1h">1h</button><button data-w="4h">4h</button><button data-w="session">Session</button>
    </nav>
  </header>
  <div id="list"></div>
  <section class="tape" id="tapeBox" hidden>
    <h2>Live tape</h2>
    <div id="tape"></div>
  </section>
  <footer>
    Prices are the median of each venue's latest print; change is measured from the start of the selected window
    (or from when the market began streaming). Markets appear here as soon as your agent streams them.
    Market data for analysis only, not financial advice.
  </footer>
</main>
<script>
(function () {
  "use strict";
  var params = new URLSearchParams(location.search);
  var token = params.get("token");
  var store = {
    get: function (k, d) { try { return localStorage.getItem("ofs." + k) || d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("ofs." + k, v); } catch (e) {} }
  };
  var win = params.get("window") || store.get("window", "1h");
  var pillMode = store.get("pill", "pct");
  var rows = new Map();     // key -> { data, el, refs }
  var seenEvents = new Set();
  var listEl = document.getElementById("list");
  var es = null, lastMsg = 0;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function svgEl(tag, attrs) {
    var e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function fmtPrice(x, d) {
    if (x === null || x === undefined) return "\u2014";
    return x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function fmtUsd(x) {
    var a = Math.abs(x), s = x < 0 ? "-" : "";
    if (a >= 1e9) return s + "$" + (a / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return s + "$" + (a / 1e6).toFixed(2) + "M";
    if (a >= 1e3) return s + "$" + (a / 1e3).toFixed(0) + "K";
    return s + "$" + a.toFixed(0);
  }
  function fmtNum(x) {
    var a = Math.abs(x);
    if (a >= 1e6) return (x / 1e6).toFixed(2) + "M";
    if (a >= 1e3) return (x / 1e3).toFixed(1) + "K";
    if (a >= 100) return x.toFixed(0);
    if (a >= 1) return x.toFixed(2);
    return x.toPrecision(2);
  }
  function signed(s, x) { return (x > 0 ? "+" : "") + s; }
  function dir(x) { return x > 0 ? "up" : x < 0 ? "down" : ""; }

  // \u2500\u2500\u2500 row DOM \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function makeRow(d) {
    var row = el("div", "row");
    var id = el("div", "id");
    var sym = el("div", "sym");
    var symText = el("span", "", d.base);
    var tag = el("span", "tag", d.market_type === "perp" ? "PERP" : "SPOT");
    var badges = el("span");
    sym.append(symText, tag, badges);
    var venue = d.venue.indexOf("all-") === 0 ? "all venues" : d.venue.replace(/-(futures|spot)$/, "");
    var name = el("div", "name", d.name + " \xB7 " + venue);
    id.append(sym, name);

    var svg = svgEl("svg", { class: "spark", viewBox: "0 0 128 46", preserveAspectRatio: "none" });
    var gid = "g" + Math.random().toString(36).slice(2);
    var defs = svgEl("defs", {});
    var grad = svgEl("linearGradient", { id: gid, x1: "0", y1: "0", x2: "0", y2: "1" });
    var s1 = svgEl("stop", { offset: "0%", "stop-opacity": "0.45" });
    var s2 = svgEl("stop", { offset: "100%", "stop-opacity": "0" });
    grad.append(s1, s2); defs.append(grad);
    var base = svgEl("line", { x1: "0", x2: "128", "stroke-dasharray": "3 3", "stroke-width": "1", "vector-effect": "non-scaling-stroke", opacity: "0.8" });
    var area = svgEl("path", { fill: "url(#" + gid + ")", stroke: "none" });
    var line = svgEl("path", { fill: "none", "stroke-width": "1.75", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" });
    svg.append(defs, area, base, line);

    var quote = el("div", "quote");
    var px = el("div", "px");
    var pill = el("button", "pill");
    pill.title = "Tap to switch between % and price change";
    pill.addEventListener("click", function () {
      pillMode = pillMode === "pct" ? "abs" : "pct";
      store.set("pill", pillMode);
      rows.forEach(function (r) { renderQuote(r, false); });
    });
    quote.append(px, pill);
    var flow = el("div", "flow");
    row.append(id, svg, quote, flow);
    return { el: row, refs: { badges: badges, s1: s1, s2: s2, base: base, area: area, line: line, px: px, pill: pill, flow: flow, svg: svg }, shown: null, flashTimer: 0 };
  }

  function renderSpark(r) {
    var d = r.data, refs = r.refs;
    var vals = d.spark.slice();
    if (d.last !== null && vals.length) vals[vals.length - 1] = d.last;
    var pts = [];
    var lo = Infinity, hi = -Infinity;
    for (var i = 0; i < vals.length; i++) if (vals[i] !== null) { lo = Math.min(lo, vals[i]); hi = Math.max(hi, vals[i]); }
    if (!isFinite(lo)) { refs.line.setAttribute("d", ""); refs.area.setAttribute("d", ""); refs.base.setAttribute("opacity", "0"); return; }
    if (d.baseline !== null) { lo = Math.min(lo, d.baseline); hi = Math.max(hi, d.baseline); }
    var pad = (hi - lo) * 0.08 || Math.abs(hi) * 0.0005 || 1;
    lo -= pad; hi += pad;
    var W = 128, H = 46, n = vals.length;
    function y(v) { return (H - ((v - lo) / (hi - lo)) * H).toFixed(2); }
    for (var j = 0; j < n; j++) if (vals[j] !== null) pts.push([(n > 1 ? (j / (n - 1)) * W : W).toFixed(2), y(vals[j])]);
    var lineD = "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L");
    refs.line.setAttribute("d", lineD);
    refs.area.setAttribute("d", lineD + " L" + pts[pts.length - 1][0] + " " + H + " L" + pts[0][0] + " " + H + " Z");
    var up = d.change === null || d.change >= 0;
    var c = getComputedStyle(document.documentElement).getPropertyValue(up ? "--up" : "--down");
    refs.line.setAttribute("stroke", c);
    refs.s1.setAttribute("stop-color", c); refs.s2.setAttribute("stop-color", c);
    refs.base.setAttribute("stroke", c);
    if (d.baseline !== null) { var by = y(d.baseline); refs.base.setAttribute("y1", by); refs.base.setAttribute("y2", by); refs.base.setAttribute("opacity", "0.8"); }
  }

  function renderQuote(r, flash) {
    var d = r.data, refs = r.refs;
    var text = fmtPrice(d.last, d.decimals);
    var prev = r.shown;
    refs.px.textContent = "";
    if (flash && prev && prev !== text && prev.length === text.length) {
      var k = 0;
      while (k < text.length && text[k] === prev[k]) k++;
      refs.px.append(document.createTextNode(text.slice(0, k)), el("span", "d", text.slice(k)));
      var moved = d.last - r.prevPrice;
      refs.px.classList.remove("up", "down");
      void refs.px.offsetWidth;
      refs.px.classList.add(moved >= 0 ? "up" : "down");
      clearTimeout(r.flashTimer);
      r.flashTimer = setTimeout(function () { refs.px.classList.remove("up", "down"); }, 450);
    } else {
      refs.px.append(el("span", "d", text));
    }
    r.shown = text;
    r.prevPrice = d.last;
    var ch = d.change;
    refs.pill.className = "pill " + (ch === null ? "" : dir(ch));
    if (ch === null) refs.pill.textContent = "\u2014";
    else if (pillMode === "pct") refs.pill.textContent = signed(d.change_pct.toFixed(2) + "%", d.change_pct);
    else refs.pill.textContent = signed(fmtPrice(ch, d.decimals), ch);
  }

  function chip(label, value, cls, hot, minor) {
    var c = el("span", "chip" + (hot ? " hot" : "") + (minor ? " minor" : ""));
    c.append(document.createTextNode(label + " "), el("b", cls || "", value));
    return c;
  }

  function renderFlow(r) {
    var d = r.data, refs = r.refs;
    var chips = [];
    if (d.delta_5m !== null) chips.push(chip("\u0394 5m", signed(fmtNum(d.delta_5m), d.delta_5m), dir(d.delta_5m)));
    if (d.buy_pct_5m !== null) chips.push(chip("Buy", d.buy_pct_5m.toFixed(0) + "%", d.buy_pct_5m >= 55 ? "up" : d.buy_pct_5m <= 45 ? "down" : ""));
    if (d.notional_5m_usd !== null) chips.push(chip("Vol 5m", fmtUsd(d.notional_5m_usd), "", false, true));
    if (d.volume_z_1m !== null) chips.push(chip("Vol z", d.volume_z_1m.toFixed(1), "", Math.abs(d.volume_z_1m) >= 3, Math.abs(d.volume_z_1m) < 3));
    if (d.obi !== null) chips.push(chip("Book", signed(d.obi.toFixed(2), d.obi), dir(d.obi)));
    if (d.sigma_from_vwap !== null) chips.push(chip("VWAP", signed(d.sigma_from_vwap.toFixed(1) + "\u03C3", d.sigma_from_vwap), "", Math.abs(d.sigma_from_vwap) >= 2, Math.abs(d.sigma_from_vwap) < 2));
    if (d.funding_8h_pct !== null) chips.push(chip("Fund 8h", d.funding_8h_pct.toFixed(4) + "%", dir(d.funding_8h_pct)));
    if (d.oi_change_5m_pct !== null) chips.push(chip("OI 5m", signed(d.oi_change_5m_pct.toFixed(2) + "%", d.oi_change_5m_pct), dir(d.oi_change_5m_pct)));
    if (d.market_type === "perp") {
      var liq = d.liq_long_5m_usd + d.liq_short_5m_usd;
      chips.push(chip("Liq 5m", liq ? "L " + fmtUsd(d.liq_long_5m_usd) + " \xB7 S " + fmtUsd(d.liq_short_5m_usd) : "$0", "", d.cascade));
    }
    if (d.big_prints_5m) chips.push(chip("Big prints", String(d.big_prints_5m), "", false, true));
    chips.push(chip("Live", d.live_venues, "", false, true));
    refs.flow.replaceChildren.apply(refs.flow, chips);

    var badges = [];
    if (d.cascade) badges.push(el("span", "badge cascade", "LIQ CASCADE"));
    if (!d.ready || d.stream_age_s < 60) badges.push(el("span", "badge warm", d.ready ? "WARMING UP" : "CONNECTING"));
    refs.badges.replaceChildren.apply(refs.badges, badges);
  }

  // \u2500\u2500\u2500 stream handling \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function onFull(msg) {
    var keys = new Set();
    msg.rows.forEach(function (d) {
      keys.add(d.key);
      var r = rows.get(d.key);
      if (!r) { r = makeRow(d); rows.set(d.key, r); }
      var flash = r.data && r.data.last !== d.last;
      r.data = d;
      renderQuote(r, flash);
      renderSpark(r);
      renderFlow(r);
    });
    rows.forEach(function (r, key) { if (!keys.has(key)) { r.el.remove(); rows.delete(key); } });
    // Keep DOM order equal to server order.
    var order = msg.rows.map(function (d) { return rows.get(d.key).el; });
    var same = order.length === listEl.children.length && order.every(function (e, i) { return listEl.children[i] === e; });
    if (!same) listEl.replaceChildren.apply(listEl, order);
    if (!msg.rows.length) {
      var empty = el("div", "empty");
      empty.append(document.createTextNode("No markets are streaming yet. Ask your agent to "), el("code", "", "watch_markets"), document.createTextNode(" or "), el("code", "", "open_screener"), document.createTextNode(" with some symbols."));
      listEl.replaceChildren(empty);
    }
    renderTape(msg.events || []);
    setStatus(true, msg.rows.length);
  }

  function onTick(msg) {
    for (var key in msg.p) {
      var r = rows.get(key);
      if (!r) continue;
      var d = r.data, p = msg.p[key];
      d.last = p;
      if (d.baseline !== null) { d.change = p - d.baseline; d.change_pct = d.baseline ? ((p - d.baseline) / d.baseline) * 100 : 0; }
      renderQuote(r, true);
      renderSpark(r);
    }
    lastMsg = Date.now();
  }

  function renderTape(events) {
    var box = document.getElementById("tapeBox"), tape = document.getElementById("tape");
    box.hidden = !events.length;
    var nodes = events.map(function (e) {
      var id = e.time + e.base + e.kind + e.usd;
      var row = el("div", "ev" + (seenEvents.size && !seenEvents.has(id) ? " new" : ""));
      var t = new Date(e.time);
      row.append(
        el("span", "t", t.toLocaleTimeString([], { hour12: false })),
        el("span", "b", e.base),
        el("span", "x", e.text),
        el("span", "u " + (e.side === "buy" ? "up" : "down"), fmtUsd(e.usd))
      );
      return { id: id, node: row };
    });
    nodes.forEach(function (n) { seenEvents.add(n.id); });
    if (seenEvents.size > 2000) seenEvents = new Set(nodes.map(function (n) { return n.id; }));
    tape.replaceChildren.apply(tape, nodes.map(function (n) { return n.node; }));
  }

  function setStatus(live, count) {
    lastMsg = Date.now();
    document.getElementById("dot").className = "dot" + (live ? "" : " off");
    document.getElementById("status").textContent = live
      ? "Live \xB7 " + count + (count === 1 ? " market" : " markets") + " \xB7 " + new Date().toLocaleTimeString([], { hour12: false })
      : "Reconnecting\u2026";
  }

  function connect() {
    if (es) es.close();
    var q = "window=" + encodeURIComponent(win) + (token ? "&token=" + encodeURIComponent(token) : "");
    es = new EventSource("/screener/stream?" + q);
    es.addEventListener("full", function (ev) { onFull(JSON.parse(ev.data)); });
    es.addEventListener("tick", function (ev) { onTick(JSON.parse(ev.data)); });
    es.onerror = function () { setStatus(false, 0); };
  }
  setInterval(function () { if (Date.now() - lastMsg > 5000) setStatus(false, 0); }, 2000);

  var seg = document.getElementById("seg");
  function markSeg() {
    Array.prototype.forEach.call(seg.children, function (b) { b.setAttribute("aria-pressed", String(b.dataset.w === win)); });
  }
  seg.addEventListener("click", function (ev) {
    var w = ev.target && ev.target.dataset && ev.target.dataset.w;
    if (!w || w === win) return;
    win = w; store.set("window", w); markSeg(); connect();
  });
  markSeg();
  connect();
})();
</script>
</body>
</html>
`;
  }
});

// src/screener.ts
var screener_exports = {};
__export(screener_exports, {
  SCREENER_WINDOWS: () => SCREENER_WINDOWS,
  ScreenerService: () => ScreenerService,
  listenScreener: () => listenScreener,
  openInBrowser: () => openInBrowser,
  screenerEvents: () => screenerEvents,
  screenerRow: () => screenerRow,
  screenerSnapshot: () => screenerSnapshot,
  screenerUrl: () => screenerUrl,
  sparkline: () => sparkline
});
import { createServer as createServer2 } from "http";
import { spawn } from "child_process";
function livePrice(market) {
  return referenceLast(market, market.state.recentTrades)?.price ?? null;
}
function sparkline(market, windowMs, points = SPARK_POINTS) {
  const s = market.state;
  const end = s.marketClock || Date.now();
  const span = windowMs > 0 ? windowMs : Math.max(6e4, end - market.startedAt);
  const start = end - span;
  const bars = s.liveBar ? [...s.flowBars, s.liveBar] : s.flowBars;
  const candles = market.baseCandles();
  const useBars = bars.length > 0 && (bars[0].time <= start + 1e3 || !candles.length || candles[0].openTime >= bars[0].time - 6e4);
  const series = useBars ? bars.filter((b) => b.time >= start && b.trades > 0) : candles.filter((c) => c.closeTime >= start).map((c) => ({ time: c.openTime, open: c.open, close: c.close }));
  if (!series.length) return null;
  const step = span / points;
  const values = [];
  let i = 0;
  let last = null;
  for (let k = 0; k < points; k++) {
    const bucketEnd = start + (k + 1) * step;
    while (i < series.length && series[i].time < bucketEnd) last = series[i++].close;
    values.push(last);
  }
  return { base: series[0].open, values };
}
function screenerRow(market, windowMs) {
  const s = market.state;
  const last = livePrice(market);
  const spark = sparkline(market, windowMs);
  const scan = scanRow(market, last ?? void 0);
  const t = s.marketClock || Date.now();
  const liq = summarizeLiquidations(s.liquidations, t - 5 * 6e4);
  const base = market.spec.symbol.replace(/USDT$/, "");
  const asset = assetFor(market.spec.symbol);
  const decimals = Math.min(8, getTickDecimals(market.manager.tickSize || 0.01));
  const baseline = spark?.base ?? null;
  return {
    key: market.spec.key,
    base,
    name: asset?.name ?? base,
    color: asset?.color ?? "#888",
    market_type: market.spec.marketType === "perpetual" ? "perp" : "spot",
    venue: market.spec.selection,
    decimals,
    ready: market.ready,
    stream_age_s: scan.stream_age_s,
    last: sig(last, 10),
    baseline: sig(baseline, 10),
    change: last !== null && baseline !== null ? last - baseline : null,
    change_pct: last !== null && baseline ? fixed((last - baseline) / baseline * 100, 3) : null,
    spark: spark?.values.map((v) => v === null ? null : sig(v, 10)) ?? [],
    delta_5m: scan.delta_5m,
    buy_pct_5m: scan.buy_pct_5m,
    notional_5m_usd: scan.notional_5m_usd,
    volume_z_1m: scan.volume_z_1m,
    sigma_from_vwap: scan.sigma_from_vwap,
    obi: scan.obi,
    funding_8h_pct: scan.funding_8h_pct,
    oi_change_5m_pct: scan.oi_change_5m_pct,
    liq_long_5m_usd: Math.round(liq.longNotional),
    liq_short_5m_usd: Math.round(liq.shortNotional),
    cascade: cascadeNow(market),
    big_prints_5m: scan.big_prints_5m,
    live_venues: scan.live_venues
  };
}
function screenerEvents(markets, limit = 14, windowMs = 15 * 6e4) {
  const out = [];
  for (const m of markets) {
    const s = m.state;
    const since = (s.marketClock || Date.now()) - windowMs;
    const base = m.spec.symbol.replace(/USDT$/, "");
    for (const b of s.bigTrades.slice(-20)) {
      if (b.timestamp >= since && b.quoteVolume >= 5e4) out.push({ time: b.timestamp, base, kind: "big", side: b.side, text: `${b.side === "buy" ? "Buy" : "Sell"} print ${fixed(b.ratio, 0)}\xD7 avg`, usd: b.quoteVolume });
    }
    for (const e of s.microEvents.slice(-10)) {
      if (e.time >= since) out.push({ time: e.time, base, kind: e.kind, side: e.side === "bid" ? "buy" : "sell", text: e.kind === "absorption" ? e.side === "bid" ? "Bids absorbing sellers" : "Offers absorbing buyers" : e.side === "bid" ? "Iceberg bid" : "Iceberg offer", usd: e.notional });
    }
    for (const l of s.liquidations.slice(-50)) {
      if (l.timestamp >= since && l.quoteVolume >= 1e5) out.push({ time: l.timestamp, base, kind: "liq", side: l.side === "long" ? "sell" : "buy", text: `${l.side === "long" ? "Long" : "Short"} liquidated`, usd: l.quoteVolume });
    }
  }
  return out.sort((a, b) => b.time - a.time).slice(0, limit);
}
function screenerSnapshot(hub2, window) {
  const markets = hub2.list();
  return {
    as_of: Date.now(),
    window,
    rows: markets.map((m) => screenerRow(m, SCREENER_WINDOWS[window])),
    events: screenerEvents(markets)
  };
}
function listenScreener(service, host, port) {
  return new Promise((resolve, reject) => {
    let attempt = 0;
    const tryPort = () => {
      const server = createServer2((req, res) => {
        if (!service.handle(req, res)) {
          res.writeHead(302, { location: "/screener" }).end();
        }
      });
      server.once("error", (error) => {
        if (error.code === "EADDRINUSE" && attempt < 9) {
          attempt++;
          tryPort();
        } else reject(error);
      });
      server.listen(port === 0 ? 0 : port + attempt, host, () => {
        server.unref();
        const bound = server.address();
        resolve({ url: screenerUrl(host, typeof bound === "object" && bound ? bound.port : port + attempt), server });
      });
    };
    tryPort();
  });
}
function screenerUrl(host, port, token) {
  const shown = host === "0.0.0.0" || host === "::" ? "localhost" : host.includes(":") ? `[${host}]` : host;
  return `http://${shown}:${port}/screener${token ? `?token=${encodeURIComponent(token)}` : ""}`;
}
function openInBrowser(url) {
  if (process.platform === "linux" && !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) return false;
  try {
    const [cmd, args] = process.platform === "darwin" ? ["open", [url]] : process.platform === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
    const child = spawn(cmd, args, { detached: true, stdio: "ignore" });
    child.on("error", () => {
    });
    child.unref();
    return true;
  } catch {
    return false;
  }
}
var SCREENER_WINDOWS, TICK_MS, FULL_MS, SPARK_POINTS, ScreenerService;
var init_screener = __esm({
  "src/screener.ts"() {
    "use strict";
    init_instruments();
    init_orderFlowEngine();
    init_derivatives();
    init_screener_page();
    init_views();
    SCREENER_WINDOWS = { "15m": 15 * 6e4, "1h": 60 * 6e4, "4h": 4 * 60 * 6e4, session: 0 };
    TICK_MS = 250;
    FULL_MS = 1e3;
    SPARK_POINTS = 90;
    ScreenerService = class {
      constructor(hub2, token) {
        this.hub = hub2;
        this.token = token;
      }
      hub;
      token;
      clients = /* @__PURE__ */ new Set();
      tickTimer = null;
      fullTimer = null;
      /** Handles /screener, /screener/stream and /screener/data.json; returns false for other paths. */
      handle(req, res) {
        const url = new URL(req.url ?? "/", "http://localhost");
        const path = url.pathname.replace(/\/+$/, "") || "/";
        if (path !== "/screener" && !path.startsWith("/screener/")) return false;
        if (this.token && url.searchParams.get("token") !== this.token && req.headers.authorization !== `Bearer ${this.token}`) {
          res.writeHead(401, { "content-type": "text/plain" }).end("unauthorized: open the screener link with ?token=<token>");
          return true;
        }
        if (req.method !== "GET") {
          res.writeHead(405, { "content-type": "text/plain" }).end("GET only");
          return true;
        }
        const window = url.searchParams.get("window") ?? "1h";
        const win = window in SCREENER_WINDOWS ? window : "1h";
        if (path === "/screener") {
          res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(SCREENER_PAGE);
        } else if (path === "/screener/data.json") {
          res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(screenerSnapshot(this.hub, win)));
        } else if (path === "/screener/stream") {
          this.attach(res, win);
        } else {
          res.writeHead(404, { "content-type": "text/plain" }).end("not found");
        }
        return true;
      }
      attach(res, window) {
        res.writeHead(200, {
          "content-type": "text/event-stream",
          "cache-control": "no-store",
          connection: "keep-alive",
          "x-accel-buffering": "no"
        });
        res.write("retry: 2000\n\n");
        const client = { res, window, prices: /* @__PURE__ */ new Map() };
        this.clients.add(client);
        res.on("close", () => {
          this.clients.delete(client);
          if (!this.clients.size) this.stop();
        });
        this.sendFull([client]);
        this.start();
      }
      start() {
        if (this.tickTimer) return;
        this.tickTimer = setInterval(() => this.sendTicks(), TICK_MS);
        this.fullTimer = setInterval(() => this.sendFull([...this.clients]), FULL_MS);
        this.tickTimer.unref?.();
        this.fullTimer.unref?.();
      }
      stop() {
        if (this.tickTimer) clearInterval(this.tickTimer);
        if (this.fullTimer) clearInterval(this.fullTimer);
        this.tickTimer = this.fullTimer = null;
      }
      sendFull(clients) {
        const byWindow = /* @__PURE__ */ new Map();
        for (const client of clients) {
          let payload = byWindow.get(client.window);
          if (!payload) {
            const snap = screenerSnapshot(this.hub, client.window);
            for (const row of snap.rows) client.prices.set(row.key, row.last);
            payload = `event: full
data: ${JSON.stringify(snap)}

`;
            byWindow.set(client.window, payload);
          }
          client.res.write(payload);
        }
      }
      sendTicks() {
        const prices = /* @__PURE__ */ new Map();
        for (const m of this.hub.list()) prices.set(m.spec.key, sig(livePrice(m), 10));
        for (const client of this.clients) {
          const changed = {};
          let any = false;
          for (const [key2, price] of prices) {
            if (price !== null && client.prices.get(key2) !== price) {
              changed[key2] = price;
              client.prices.set(key2, price);
              any = true;
            }
          }
          if (any) client.res.write(`event: tick
data: ${JSON.stringify({ t: Date.now(), p: changed })}

`);
        }
      }
      close() {
        this.stop();
        for (const client of this.clients) client.res.end();
        this.clients.clear();
      }
    };
  }
});

// src/index.ts
import { createServer as createHttpServer } from "http";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
var { installNetworking: installNetworking2 } = await Promise.resolve().then(() => (init_net(), net_exports));
await installNetworking2();
console.log = (...args) => console.error(...args);
console.info = (...args) => console.error(...args);
var { MarketHub: MarketHub2 } = await Promise.resolve().then(() => (init_market(), market_exports));
var { createServer: createServer3, VERSION: VERSION2 } = await Promise.resolve().then(() => (init_server(), server_exports));
var { ScreenerService: ScreenerService2, listenScreener: listenScreener2, openInBrowser: openInBrowser2, screenerUrl: screenerUrl2 } = await Promise.resolve().then(() => (init_screener(), screener_exports));
var DEFAULT_WATCH = "BTC,ETH,SOL";
function parseWatch(value) {
  if (value.trim().toLowerCase() === "none") return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}
function parseArgs(argv) {
  const env2 = process.env;
  const o = {
    http: env2.ORDERFLOW_TRANSPORT === "http",
    port: Number(env2.PORT ?? env2.ORDERFLOW_PORT ?? 3333),
    host: env2.ORDERFLOW_HOST ?? "127.0.0.1",
    watch: parseWatch(env2.ORDERFLOW_WATCH ?? DEFAULT_WATCH),
    idleMinutes: Number(env2.ORDERFLOW_IDLE_MINUTES ?? 0),
    maxMarkets: Number(env2.ORDERFLOW_MAX_MARKETS ?? 20),
    token: env2.ORDERFLOW_HTTP_TOKEN || void 0,
    screener: env2.ORDERFLOW_SCREENER === "1" || env2.ORDERFLOW_SCREENER === "true",
    screenerPort: Number(env2.ORDERFLOW_SCREENER_PORT ?? 3334)
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--http") o.http = true;
    else if (a === "--stdio") o.http = false;
    else if (a === "--port") o.port = Number(next());
    else if (a === "--host") o.host = next();
    else if (a === "--watch") o.watch = parseWatch(next());
    else if (a === "--idle-minutes") o.idleMinutes = Number(next());
    else if (a === "--max-markets") o.maxMarkets = Number(next());
    else if (a === "--token") o.token = next();
    else if (a === "--screener") o.screener = true;
    else if (a === "--screener-port") o.screenerPort = Number(next());
    else if (a === "--version" || a === "-v") {
      console.error(VERSION2);
      process.exit(0);
    } else if (a === "--help" || a === "-h") {
      console.error(`order-flow-mcp ${VERSION2} \u2014 live order flow for AI agents (MCP)

Usage: order-flow-mcp [options]

  --stdio                 Serve over stdio (default)
  --http                  Serve Streamable HTTP at /mcp
  --port <n>              HTTP port (default 3333, env PORT)
  --host <addr>           HTTP bind address (default 127.0.0.1)
  --token <secret>        Require "Authorization: Bearer <secret>" on HTTP (env ORDERFLOW_HTTP_TOKEN)
  --watch BTC,ETH         Markets that stream from startup (default BTC,ETH,SOL; "none" to disable;
                          env ORDERFLOW_WATCH)
  --idle-minutes <n>      Close unwatched markets after n idle minutes (default 0 = never)
  --max-markets <n>       Max concurrent markets (default 20)
  --screener              Start the live screener page at startup (otherwise it starts on the
                          first open_screener call; env ORDERFLOW_SCREENER=1)
  --screener-port <n>     Screener port in stdio mode (default 3334, next free port if taken;
                          env ORDERFLOW_SCREENER_PORT). Over --http it is served at /screener.
`);
      process.exit(0);
    }
  }
  return o;
}
var options = parseArgs(process.argv.slice(2));
var hub = new MarketHub2({ idleMs: options.idleMinutes * 6e4, maxMarkets: options.maxMarkets });
for (const symbol of options.watch) {
  try {
    hub.open(symbol).market.pinned = true;
  } catch (error) {
    console.error(`[order-flow-mcp] cannot watch ${symbol}: ${error instanceof Error ? error.message : error}`);
  }
}
if (options.watch.length) console.error(`[order-flow-mcp] streaming from startup: ${options.watch.join(", ")}`);
var screener = new ScreenerService2(hub, options.token);
var screenerStart = null;
function ensureScreener() {
  if (options.http) return Promise.resolve(screenerUrl2(options.host, options.port, options.token));
  screenerStart ??= listenScreener2(screener, "127.0.0.1", options.screenerPort).then(({ url }) => {
    console.error(`[order-flow-mcp] live screener at ${url}`);
    return url;
  }).catch((error) => {
    screenerStart = null;
    throw error;
  });
  return screenerStart;
}
var local = !options.http || ["127.0.0.1", "localhost", "::1"].includes(options.host);
var extras = { screener: ensureScreener, ...local ? { openBrowser: openInBrowser2 } : {} };
function shutdown() {
  screener.close();
  hub.dispose();
  setTimeout(() => process.exit(0), 200).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("unhandledRejection", (reason) => console.error("[order-flow-mcp] unhandled rejection:", reason instanceof Error ? reason.message : String(reason).slice(0, 300)));
process.on("uncaughtException", (error) => console.error("[order-flow-mcp] uncaught exception:", error));
if (!options.http) {
  const server = createServer3(hub, extras);
  await server.connect(new StdioServerTransport());
  process.stdin.on("close", shutdown);
  console.error(`[order-flow-mcp] ${VERSION2} ready on stdio`);
  if (options.screener) ensureScreener().catch((error) => console.error(`[order-flow-mcp] screener failed to start: ${error instanceof Error ? error.message : error}`));
} else {
  const readBody = (req) => new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) reject(new Error("body too large"));
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : void 0);
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
  const send = (res, status, body) => {
    res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(body));
  };
  const http = createHttpServer(async (req, res) => {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-headers", "content-type, authorization, mcp-session-id, mcp-protocol-version");
    res.setHeader("access-control-expose-headers", "mcp-session-id");
    if (req.method === "OPTIONS") return void res.writeHead(204).end();
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/health") {
      return send(res, 200, { ok: true, version: VERSION2, markets: hub.list().map((m) => m.spec.key) });
    }
    if (screener.handle(req, res)) return;
    if (url.pathname !== "/mcp") return send(res, 404, { error: "MCP endpoint is /mcp; the live screener is at /screener" });
    if (options.token && req.headers.authorization !== `Bearer ${options.token}`) {
      return send(res, 401, { error: "unauthorized" });
    }
    if (req.method !== "POST") {
      return send(res, 405, { jsonrpc: "2.0", error: { code: -32e3, message: "Method not allowed" }, id: null });
    }
    try {
      const body = await readBody(req);
      const server = createServer3(hub, extras);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: void 0, enableJsonResponse: true });
      res.on("close", () => {
        void transport.close();
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (error) {
      if (!res.headersSent) send(res, 500, { jsonrpc: "2.0", error: { code: -32603, message: String(error) }, id: null });
    }
  });
  http.listen(options.port, options.host, () => {
    console.error(`[order-flow-mcp] ${VERSION2} listening on http://${options.host}:${options.port}/mcp`);
    console.error(`[order-flow-mcp] live screener at ${screenerUrl2(options.host, options.port, options.token)}`);
  });
}
