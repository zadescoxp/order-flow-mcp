// The live screener page, served at /screener. Self-contained (no external
// requests): plain HTML, CSS and JS that render rows from the event stream.
// The inline script avoids template literals so this file can hold it in one.

export const SCREENER_PAGE = `<!doctype html>
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
      <div class="sub"><span class="dot off" id="dot"></span><span id="status">Connecting…</span></div>
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
    if (x === null || x === undefined) return "—";
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

  // ─── row DOM ───────────────────────────────────────────────
  function makeRow(d) {
    var row = el("div", "row");
    var id = el("div", "id");
    var sym = el("div", "sym");
    var symText = el("span", "", d.base);
    var tag = el("span", "tag", d.market_type === "perp" ? "PERP" : "SPOT");
    var badges = el("span");
    sym.append(symText, tag, badges);
    var venue = d.venue.indexOf("all-") === 0 ? "all venues" : d.venue.replace(/-(futures|spot)$/, "");
    var name = el("div", "name", d.name + " · " + venue);
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
    if (ch === null) refs.pill.textContent = "—";
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
    if (d.delta_5m !== null) chips.push(chip("Δ 5m", signed(fmtNum(d.delta_5m), d.delta_5m), dir(d.delta_5m)));
    if (d.buy_pct_5m !== null) chips.push(chip("Buy", d.buy_pct_5m.toFixed(0) + "%", d.buy_pct_5m >= 55 ? "up" : d.buy_pct_5m <= 45 ? "down" : ""));
    if (d.notional_5m_usd !== null) chips.push(chip("Vol 5m", fmtUsd(d.notional_5m_usd), "", false, true));
    if (d.volume_z_1m !== null) chips.push(chip("Vol z", d.volume_z_1m.toFixed(1), "", Math.abs(d.volume_z_1m) >= 3, Math.abs(d.volume_z_1m) < 3));
    if (d.obi !== null) chips.push(chip("Book", signed(d.obi.toFixed(2), d.obi), dir(d.obi)));
    if (d.sigma_from_vwap !== null) chips.push(chip("VWAP", signed(d.sigma_from_vwap.toFixed(1) + "σ", d.sigma_from_vwap), "", Math.abs(d.sigma_from_vwap) >= 2, Math.abs(d.sigma_from_vwap) < 2));
    if (d.funding_8h_pct !== null) chips.push(chip("Fund 8h", d.funding_8h_pct.toFixed(4) + "%", dir(d.funding_8h_pct)));
    if (d.oi_change_5m_pct !== null) chips.push(chip("OI 5m", signed(d.oi_change_5m_pct.toFixed(2) + "%", d.oi_change_5m_pct), dir(d.oi_change_5m_pct)));
    if (d.market_type === "perp") {
      var liq = d.liq_long_5m_usd + d.liq_short_5m_usd;
      chips.push(chip("Liq 5m", liq ? "L " + fmtUsd(d.liq_long_5m_usd) + " · S " + fmtUsd(d.liq_short_5m_usd) : "$0", "", d.cascade));
    }
    if (d.big_prints_5m) chips.push(chip("Big prints", String(d.big_prints_5m), "", false, true));
    chips.push(chip("Live", d.live_venues, "", false, true));
    refs.flow.replaceChildren.apply(refs.flow, chips);

    var badges = [];
    if (d.cascade) badges.push(el("span", "badge cascade", "LIQ CASCADE"));
    if (!d.ready || d.stream_age_s < 60) badges.push(el("span", "badge warm", d.ready ? "WARMING UP" : "CONNECTING"));
    refs.badges.replaceChildren.apply(refs.badges, badges);
  }

  // ─── stream handling ────────────────────────────────────────
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
      ? "Live · " + count + (count === 1 ? " market" : " markets") + " · " + new Date().toLocaleTimeString([], { hour12: false })
      : "Reconnecting…";
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
