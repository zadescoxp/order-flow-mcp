// orderflow MCP site: agent picker, copy buttons, demo footprint, star count.

const PKG = "github:zadescoxp/order-flow-mcp";
const REPO = "zadescoxp/order-flow-mcp";

const jsonConfig = (key = "mcpServers", extra = "") => `{
  "${key}": {
    "orderflow": {${extra}
      "command": "npx",
      "args": ["-y", "${PKG}"]
    }
  }
}`;

/** Every agent: where the setup goes and exactly what to paste. */
const AGENTS = [
  {
    id: "claude-code", name: "Claude Code", logo: "claude-code.svg", kind: "CLI",
    where: "Run this in your terminal",
    step1: "Add the server with one command:",
    code: `claude mcp add orderflow -- npx -y ${PKG}`,
    step2: "Start a new Claude Code session. Type <code>/mcp</code> to see orderflow connected.",
  },
  {
    id: "codex", name: "Codex", logo: "codex.svg", kind: "CLI",
    where: "Run this in your terminal",
    step1: "Add the server with one command:",
    code: `codex mcp add orderflow -- npx -y ${PKG}`,
    step2: "Start Codex. Prefer config files? Add <code>[mcp_servers.orderflow]</code> to <code>~/.codex/config.toml</code> with the same command.",
  },
  {
    id: "claude-desktop", name: "Claude Desktop", logo: "claude.svg", kind: "App",
    where: "Settings → Developer → Edit Config",
    step1: "Paste this into <code>claude_desktop_config.json</code>:",
    code: jsonConfig(),
    step2: "Save the file and fully quit and reopen Claude Desktop.",
  },
  {
    id: "cursor", name: "Cursor", logo: "cursor.svg", kind: "Editor",
    where: "Settings → MCP → Add new server",
    step1: "Paste this into <code>~/.cursor/mcp.json</code>:",
    code: jsonConfig(),
    step2: "Cursor picks it up automatically. Check it shows green under Settings → MCP.",
  },
  {
    id: "vscode", name: "VS Code", logo: "copilot.svg", kind: "Copilot",
    where: "GitHub Copilot agent mode",
    step1: "Create <code>.vscode/mcp.json</code> in your project:",
    code: `{
  "servers": {
    "orderflow": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "${PKG}"]
    }
  }
}`,
    step2: "Open Copilot Chat, switch to Agent mode, and start the server from the tools list.",
  },
  {
    id: "windsurf", name: "Windsurf", logo: "windsurf.svg", kind: "Editor",
    where: "Cascade → MCP servers → Configure",
    step1: "Paste this into <code>~/.codeium/windsurf/mcp_config.json</code>:",
    code: jsonConfig(),
    step2: "Press refresh in Cascade's MCP panel.",
  },
  {
    id: "gemini", name: "Gemini CLI", logo: "gemini.svg", kind: "CLI",
    where: "Edit your Gemini settings file",
    step1: "Add this to <code>~/.gemini/settings.json</code>:",
    code: jsonConfig(),
    step2: "Start <code>gemini</code> and run <code>/mcp</code> to see the tools.",
  },
  {
    id: "cline", name: "Cline", logo: "cline.svg", kind: "Extension",
    where: "Cline → MCP Servers → Configure",
    step1: "Paste this into <code>cline_mcp_settings.json</code>:",
    code: jsonConfig(),
    step2: "Cline reloads it on save.",
  },
  {
    id: "any", name: "Any MCP client", logo: "mcp.svg", kind: "HTTP",
    where: "Run one server, connect from anywhere",
    step1: "Start it as a shared HTTP server:",
    code: `npx -y ${PKG} --http --port 3333`,
    step2: "Point your client at <code>http://localhost:3333/mcp</code>. Add <code>--token &lt;secret&gt;</code> when other machines can reach it; Docker works too (see the README).",
  },
];

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Tiny highlighter for the snippets: JSON keys, strings and # comments. */
function highlight(code) {
  return escapeHtml(code)
    .split("\n")
    .map((line) => {
      if (/^\s*#/.test(line)) return `<span class="c">${line}</span>`;
      return line
        .replace(/"([^"]*)"(\s*:)/g, '<span class="k">"$1"</span>$2')
        .replace(/(:\s*|\[|,\s*)"([^"]*)"/g, '$1<span class="s">"$2"</span>');
    })
    .join("\n");
}

// ── Agent picker ─────────────────────────────────────────────
const list = document.querySelector("[data-agents]");
const panel = {
  logo: document.querySelector("[data-panel-logo]"),
  name: document.querySelector("[data-panel-name]"),
  where: document.querySelector("[data-panel-where]"),
  step1: document.querySelector("[data-panel-step1]"),
  code: document.querySelector("[data-panel-code]"),
  step2: document.querySelector("[data-panel-step2]"),
};

function selectAgent(id, focus = false) {
  const agent = AGENTS.find((a) => a.id === id) ?? AGENTS[0];
  for (const button of list.querySelectorAll(".agent")) {
    const on = button.dataset.id === agent.id;
    button.setAttribute("aria-selected", String(on));
    button.tabIndex = on ? 0 : -1;
    if (on && focus) button.focus();
  }
  panel.logo.src = `assets/agents/${agent.logo}`;
  panel.name.textContent = agent.name;
  panel.where.textContent = agent.where;
  panel.step1.innerHTML = agent.step1;
  panel.code.innerHTML = highlight(agent.code);
  panel.step2.innerHTML = agent.step2;
  try { localStorage.setItem("of-agent", agent.id); } catch { /* storage unavailable */ }
}

if (list) {
  list.innerHTML = AGENTS.map((a) => `
    <button class="agent" type="button" role="tab" data-id="${a.id}" aria-selected="false" tabindex="-1">
      <img src="assets/agents/${a.logo}" alt="" width="26" height="26">
      <span>${a.name}<small>${a.kind}</small></span>
    </button>`).join("");
  list.addEventListener("click", (e) => {
    const button = e.target.closest(".agent");
    if (!button) return;
    selectAgent(button.dataset.id);
    // On narrow screens the instructions sit below the tiles: bring them into view.
    if (window.matchMedia("(max-width: 1020px)").matches) {
      document.querySelector("[data-panel]")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  });
  list.addEventListener("keydown", (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const ids = AGENTS.map((a) => a.id);
    const current = ids.indexOf(list.querySelector('[aria-selected="true"]')?.dataset.id);
    selectAgent(ids[(current + keys[e.key] + ids.length) % ids.length], true);
  });
  let saved = null;
  try { saved = localStorage.getItem("of-agent"); } catch { /* storage unavailable */ }
  selectAgent(saved ?? "claude-code");
}

// ── Copy buttons ─────────────────────────────────────────────
document.addEventListener("click", async (e) => {
  const button = e.target.closest("[data-copy]");
  if (!button) return;
  const source = button.closest("[data-copy-wrap]")?.querySelector("[data-copy-src]");
  if (!source) return;
  const text = source.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = Object.assign(document.createElement("textarea"), { value: text });
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  const label = button.querySelector("span");
  const icon = button.querySelector("use");
  button.classList.add("done");
  if (label) label.textContent = "Copied";
  icon?.setAttribute("href", "#i-check");
  clearTimeout(button._t);
  button._t = setTimeout(() => {
    button.classList.remove("done");
    if (label) label.textContent = "Copy";
    icon?.setAttribute("href", "#i-copy");
  }, 1600);
});

// ── Demo footprint (illustrative numbers that drift like a live candle) ──
const fp = document.querySelector("[data-footprint]");
const rows = [
  { px: 59230, bid: 2.1, ask: 9.8 },
  { px: 59210, bid: 4.4, ask: 12.6 },
  { px: 59190, bid: 6.0, ask: 18.3 },
  { px: 59170, bid: 14.2, ask: 31.7 },
  { px: 59150, bid: 11.8, ask: 16.1 },
  { px: 59130, bid: 9.6, ask: 7.2 },
  { px: 59110, bid: 12.9, ask: 3.1 },
  { px: 59090, bid: 5.3, ask: 2.4 },
];

function renderFootprint() {
  if (!fp) return;
  const max = Math.max(...rows.flatMap((r) => [r.bid, r.ask]));
  const poc = rows.reduce((a, r) => (r.bid + r.ask > a.bid + a.ask ? r : a));
  fp.innerHTML = rows.map((r) => {
    const delta = r.ask - r.bid;
    const cls = [r === poc ? "poc" : "", r.ask >= r.bid * 3 ? "imb-buy" : "", r.bid >= r.ask * 3 ? "imb-sell" : ""].join(" ");
    return `<li class="${cls}">
      <span class="px">${r.px.toLocaleString("en-US")}</span>
      <span class="bar bid"><i style="width:${(r.bid / max) * 100}%"></i><b>${r.bid.toFixed(1)}</b></span>
      <span class="bar ask"><i style="width:${(r.ask / max) * 100}%"></i><b>${r.ask.toFixed(1)}</b></span>
      <span class="d ${delta >= 0 ? "up" : "down"}">${delta >= 0 ? "+" : ""}${delta.toFixed(1)}</span>
    </li>`;
  }).join("");
}

renderFootprint();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (fp && !reduceMotion) {
  setInterval(() => {
    const r = rows[Math.floor(Math.random() * rows.length)];
    if (Math.random() < 0.62) r.ask += Math.random() * 1.4;
    else r.bid += Math.random() * 1.2;
    renderFootprint();
  }, 1400);
}

// ── Flowing lines for the "It stays live" card ──────────────
const waves = document.querySelector("[data-waves]");
if (waves) {
  const paths = [];
  for (let i = 0; i < 26; i++) {
    const y = 20 + i * 4.6;
    const a = 18 + i * 0.9;
    paths.push(`<path d="M0 ${y} C 90 ${y - a}, 150 ${y + a}, 220 ${y - a * 0.4} S 340 ${y + a * 0.7}, 400 ${y - a * 0.3}"
      stroke="url(#wg)" stroke-width="0.9" fill="none" opacity="${0.25 + (i / 26) * 0.6}"/>`);
  }
  waves.innerHTML = `<defs><linearGradient id="wg" x1="0" x2="1"><stop offset="0" stop-color="#9cc21e"/><stop offset=".5" stop-color="#2fb5a5"/><stop offset="1" stop-color="#1b7f74"/></linearGradient></defs>${paths.join("")}`;
}

// ── Nav border on scroll ────────────────────────────────────
const nav = document.querySelector(".nav");
const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ── GitHub star count (best effort) ──────────────────────────
fetch(`https://api.github.com/repos/${REPO}`)
  .then((r) => (r.ok ? r.json() : null))
  .then((repo) => {
    if (!repo || typeof repo.stargazers_count !== "number" || repo.stargazers_count < 1) return;
    const n = repo.stargazers_count;
    for (const el of document.querySelectorAll("[data-stars]")) {
      el.textContent = n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
      el.hidden = false;
    }
  })
  .catch(() => {});
