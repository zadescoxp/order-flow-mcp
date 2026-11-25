// Outbound networking for Node: honours HTTPS_PROXY / HTTP_PROXY (corporate
// proxies, sandboxes) for exchange WebSockets and REST calls. Without a proxy
// configured, everything connects directly.

import { HttpsProxyAgent } from "https-proxy-agent";
import WebSocketImpl from "ws";

const env = process.env;
export const proxyUrl: string | undefined =
  env.ORDERFLOW_PROXY || env.HTTPS_PROXY || env.https_proxy || env.HTTP_PROXY || env.http_proxy || undefined;

let agent: HttpsProxyAgent<string> | undefined;
/** Agent for `ws` connections, or undefined when no proxy is configured. */
export function proxyAgent(): HttpsProxyAgent<string> | undefined {
  if (!proxyUrl) return undefined;
  agent ??= new HttpsProxyAgent(proxyUrl);
  return agent;
}

/** Spread into a Siebly WebsocketClient's options. */
export function sieblyNet(): { wsOptions?: { agent: HttpsProxyAgent<string> } } {
  const a = proxyAgent();
  return a ? { wsOptions: { agent: a } } : {};
}

/** A WebSocket constructor (browser-style API) that goes through the proxy when one is set. */
export class NodeWebSocket extends WebSocketImpl {
  constructor(url: string | URL, protocols?: string | string[], options?: WebSocketImpl.ClientOptions) {
    const a = proxyAgent();
    super(url, protocols, a ? { agent: a, ...options } : options);
  }
}

/** Install the global WebSocket and a proxy-aware fetch dispatcher. Call once at startup. */
export async function installNetworking(): Promise<void> {
  (globalThis as { WebSocket?: unknown }).WebSocket = NodeWebSocket;
  if (proxyUrl) {
    const { EnvHttpProxyAgent, setGlobalDispatcher } = await import("undici");
    setGlobalDispatcher(new EnvHttpProxyAgent());
  }
}
