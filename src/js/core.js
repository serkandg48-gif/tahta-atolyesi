/* Çekirdek yardımcılar. Her şey tek bir T nesnesinde durur. */
"use strict";
const T = (window.T = {
  sections: {},     // bölüm kayıtları: id -> {title, icon, tone, render}
  widgets: {},      // ders ekranı araçları
  tools: {},        // tam ekran araçlar (manipülatif, simülasyon)
});

/* append/replaceChildren/prepend: null, false, undefined atlanır */
(function () {
  for (const name of ["append", "prepend", "replaceChildren"]) {
    for (const proto of [Element.prototype, DocumentFragment.prototype]) {
      const orig = proto[name];
      proto[name] = function (...k) { return orig.apply(this, k.flat(Infinity).filter((x) => x != null && x !== false)); };
    }
  }
})();

/* h('div.class#id', {attrs}, ...children) */
T.h = function h(tag, attrs, ...kids) {
  const m = /^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i.exec(tag) || [];
  const el = document.createElement(m[1] || "div");
  (m[2] || "").replace(/([.#])([\w-]+)/g, (_, k, v) => {
    if (k === ".") el.classList.add(v); else el.id = v;
  });
  if (attrs && (typeof attrs !== "object" || attrs instanceof Node || Array.isArray(attrs))) {
    kids.unshift(attrs); attrs = null;
  }
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k === "html") el.innerHTML = v;
      else if (k === "class") el.className += " " + v;
      else if (v === true) el.setAttribute(k, "");
      else el.setAttribute(k, v);
    }
  }
  T.append(el, kids);
  return el;
};
T.append = function (el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
  return el;
};
T.svg = function (tag, attrs = {}, ...kids) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const k of kids.flat(Infinity)) if (k != null) el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  return el;
};
T.$ = (s, r = document) => r.querySelector(s);
T.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
T.uid = () => Math.random().toString(36).slice(2, 9);
T.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
T.rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
T.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
T.shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
T.fmt = (n) => new Intl.NumberFormat("tr-TR").format(n);
T.money = (n) => new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " TL";
T.trLower = (s) => s.toLocaleLowerCase("tr-TR");
T.trUpper = (s) => s.toLocaleUpperCase("tr-TR");
T.pad = (n) => String(n).padStart(2, "0");
T.isoDate = (d = new Date()) => `${d.getFullYear()}-${T.pad(d.getMonth() + 1)}-${T.pad(d.getDate())}`;
T.GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
T.AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
T.longDate = (d = new Date()) => `${d.getDate()} ${T.AYLAR[d.getMonth()]} ${T.GUNLER[d.getDay()]}`;

/* ---------- Ses ---------- */
T.sound = (() => {
  let ctx = null;
  const ac = () => {
    try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    return ctx;
  };
  function tone(freq, dur = 0.15, type = "sine", vol = 0.2, when = 0) {
    const c = ac(); if (!c) return;
    try {
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime + when);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + when); o.stop(c.currentTime + when + dur + 0.02);
    } catch (e) {}
  }
  return {
    tick: () => tone(1200, 0.03, "square", 0.05),
    pop: () => tone(660, 0.08, "triangle", 0.15),
    ok: () => { tone(660, 0.12, "triangle", 0.18); tone(990, 0.18, "triangle", 0.18, 0.1); },
    no: () => tone(180, 0.25, "sawtooth", 0.08),
    bell: () => { [0, 0.35, 0.7].forEach((t) => { tone(880, 0.6, "sine", 0.25, t); tone(1320, 0.4, "sine", 0.08, t); }); },
    drum: () => { for (let i = 0; i < 10; i++) tone(120 + Math.random() * 60, 0.05, "square", 0.05, i * 0.06); },
    unlock: ac,
  };
})();

/* ---------- Bildirim ve pencere ---------- */
T.toast = function (msg, ms = 2600) {
  const el = T.h("div.toast", { role: "status" }, msg);
  T.$("#layer").append(el);
  setTimeout(() => el.remove(), ms);
};
T.modal = function ({ title, body, actions = [], wide = false, onClose }) {
  const close = () => { scrim.remove(); document.removeEventListener("keydown", onKey); onClose && onClose(); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  const box = T.h("div.modal", { role: "dialog", "aria-modal": "true", "aria-label": title, style: wide ? { width: "min(1100px, 100%)" } : null },
    title ? T.h("h2", title) : null,
    body,
    actions.length ? T.h("div.modal-actions", actions.map((a) =>
      T.h("button.btn." + (a.tone || "c-chalk"), { onclick: () => { const r = a.onClick ? a.onClick() : null; if (r !== false) close(); } }, a.label))) : null
  );
  const scrim = T.h("div.scrim", { onclick: (e) => { if (e.target === scrim) close(); } }, box);
  T.$("#layer").append(scrim);
  document.addEventListener("keydown", onKey);
  const f = box.querySelector("input, textarea, select, button");
  f && setTimeout(() => f.focus(), 30);
  return { close, box };
};
T.confirm = (title, text, yesLabel = "Evet") => new Promise((res) => {
  T.modal({ title, body: T.h("p", text), actions: [
    { label: "Vazgeç", onClick: () => res(false) },
    { label: yesLabel, tone: "c-tomato", onClick: () => res(true) },
  ], onClose: () => res(false) });
});

T.copyText = async function (text, okMsg = "Panoya kopyalandı") {
  try { await navigator.clipboard.writeText(text); T.toast(okMsg); return true; }
  catch (e) {
    const ta = T.h("textarea.in", { readonly: true, style: { minHeight: "240px" } }); ta.value = text;
    T.modal({ title: "Metni kopyala", body: T.h("div.stack", T.h("p.hint", "Bu ortamda otomatik kopyalama kapalı. Metni seçip kopyalayabilirsin."), ta), actions: [{ label: "Kapat" }] });
    setTimeout(() => ta.select(), 50);
    return false;
  }
};
/* Dosya indirme: kendi sitende çalışır; Claude içinde kopyalama penceresine düşer. */
T.download = async function (name, text, mime = "text/plain") {
  const blob = new Blob(["\ufeff" + text], { type: mime + ";charset=utf-8" });
  if (T.cap.downloads) {
    try { await T.cap.downloads.save({ filename: name, data: blob }); return; }
    catch (e) { if (e && e.code === "declined") return; T.copyText(text, "İndirme olmadı, metin panoya kopyalandı"); return; }
  }
  try {
    const a = T.h("a", { href: URL.createObjectURL(blob), download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    if (window.self !== window.top) setTimeout(() => T.copyText(text, "İndirme açılmadıysa metin panoya kopyalandı"), 300);
  } catch (e) { T.copyText(text); }
};

/* ---------- Konuşma: önce Claude sesi, yoksa tarayıcı sesi ---------- */
T.speak = async function (text, lang = "tr") {
  try {
    const tts = T.cap.tts;
    if (tts) { await tts.speak(text, { language: lang === "en" ? "en" : undefined }); return; }
  } catch (e) { /* tarayıcıya düş */ }
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "en" ? "en-US" : "tr-TR";
    u.rate = 0.9;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) { T.toast("Bu cihazda sesli okuma yok"); }
};

/* ---------- Claude yetenekleri (yalnızca Claude içinde açıksa) ---------- */
T.cap = { sample: null, tts: null, downloads: null };
(function () {
  let tries = 0;
  const probe = () => {
    try {
      if (window.claude && typeof window.claude.use === "function") {
        window.claude.use("sample").then((s) => { if (s) { T.cap.sample = s; document.dispatchEvent(new Event("cap")); } }).catch(() => {});
        window.claude.use("tts").then((s) => { if (s) T.cap.tts = s; }).catch(() => {});
        window.claude.use("downloads").then((s) => { if (s) T.cap.downloads = s; }).catch(() => {});
        return;
      }
    } catch (e) {}
    if (++tries < 20) setTimeout(probe, 250);
  };
  probe();
})();

/* ---------- Sürükleme ---------- */
/* el'i handle'dan tutup taşır. onMove(x,y) yoksa style.left/top yazar. */
T.dragMove = function (handle, { onStart, onMove, onEnd } = {}) {
  handle.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest("button, input, textarea, select, [data-nodrag]")) return;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    const ctx = onStart ? onStart(e) : null;
    handle.setPointerCapture(e.pointerId);
    const mv = (ev) => onMove && onMove(ev.clientX - sx, ev.clientY - sy, ev, ctx);
    const up = (ev) => {
      handle.removeEventListener("pointermove", mv);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      onEnd && onEnd(ev, ctx, Math.hypot(ev.clientX - sx, ev.clientY - sy));
    };
    handle.addEventListener("pointermove", mv);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  });
};
/* SVG içinde istemci koordinatını SVG koordinatına çevirir. */
T.svgPoint = function (svg, cx, cy) {
  const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
  const m = svg.getScreenCTM(); if (!m) return { x: cx, y: cy };
  const p = pt.matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
};

/* ---------- Basit gezinme: #bolum veya #bolum-arac ---------- */
T.go = function (hash) { if (location.hash.slice(1) === hash) T.route(); else location.hash = hash; };
T.cleanups = [];
T.onLeave = (fn) => T.cleanups.push(fn);

/* Türkçe sayı okuma (0 - 999 999) */
T.sayiOku = function (n) {
  const b = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  const o = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  if (n === 0) return "sıfır";
  if (n < 0) return "eksi " + T.sayiOku(-n);
  const uc = (x) => {
    const y = Math.floor(x / 100), r = x % 100;
    return [(y ? (y === 1 ? "" : b[y]) + "yüz" : ""), o[Math.floor(r / 10)], b[r % 10]].join("");
  };
  const bin = Math.floor(n / 1000), kalan = n % 1000;
  let s = "";
  if (bin) s += (bin === 1 ? "" : uc(bin)) + "bin";
  s += uc(kalan);
  // Boşluklu okunuş
  return s.replace(/(yüz|bin|on|yirmi|otuz|kırk|elli|altmış|yetmiş|seksen|doksan)(?=[a-zçğışöü])/g, "$1 ").trim();
};
