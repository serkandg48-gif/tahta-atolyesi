/* Ders Ekranı: araçlar tahtaya serbestçe yerleştirilir, sürüklenir, boyutlandırılır.
   Düzen her sınıf için ayrı saklanır. */
function TahtaYap(MOD) {
  const BGS = [
    ["tahta", "Tebeşir tahtası"], ["kareli", "Kareli kağıt"], ["mantar", "Mantar pano"],
    ["gece", "Gece gökyüzü"], ["kis", "Kış"], ["cumhuriyet", "Bayrak kırmızısı"],
  ];
  let root = null, cleanup = []; const mode = MOD;
  function data() {
    const s = T.store.get(), cid = s.activeClassId;
    if (mode === "ana") { s.homeBoards = s.homeBoards || {}; if (!s.homeBoards[cid]) s.homeBoards[cid] = { widgets: [] }; return s.homeBoards[cid]; }
    if (!s.boards[cid]) s.boards[cid] = { bg: "tahta", widgets: [] };
    return s.boards[cid];
  }
  function save() { T.store.save(); }

  function render(view, opts = {}) {
    cleanup.forEach((f) => f()); cleanup = [];
    const d = data();
    root = T.h(mode === "ana" ? "div.board.home-board" : "div.board.board-bg-" + d.bg);
    view.append(root);
    if (mode === "ekran" && !d.widgets.length) root.append(T.h("div.board-empty", T.h("div", "Tahta boş.", T.h("br"), "Aşağıdaki Araçlar şeridinden ya da Araç ekle ile başla.")));
    d.widgets.forEach((w) => mount(w));
    if (mode === "ekran") root.append(toolbar());
    const onResize = () => d.widgets.forEach((w) => clampInto(w));
    window.addEventListener("resize", onResize);
    cleanup.push(() => window.removeEventListener("resize", onResize));
    if (mode === "ekran") T.onLeave(() => { cleanup.forEach((f) => f()); cleanup = []; });
  }

  function toolbar() {
    const quick = ["timer", "name", "dice", "groups", "traffic", "noise", "symbol", "text"];
    return T.h("div.board-tools",
      T.h("button.btn.c-sun", { onclick: openTray }, T.icon("plus"), "Araç ekle"),
      quick.map((k) => {
        const w = T.widgets[k];
        return T.h("button.btn.icon.c-chalk", { title: w.title, "aria-label": w.title + " ekle", onclick: () => add(k) }, T.icon(w.icon));
      }),
      T.h("button.btn.icon.c-chalk", { title: "Arka plan", "aria-label": "Arka planı değiştir", onclick: pickBg }, T.icon("bg")),
      T.h("button.btn.icon.c-chalk", { title: "Tam ekran", "aria-label": "Tam ekran", onclick: fullscreen }, T.icon("full")),
      T.h("button.btn.icon.c-tomato", { title: "Tahtayı temizle", "aria-label": "Tahtayı temizle", onclick: clearAll }, T.icon("trash"))
    );
  }
  function fullscreen() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => T.toast("Bu ortamda tam ekran kapalı"));
    } catch (e) { T.toast("Bu ortamda tam ekran kapalı"); }
  }
  function openTray() {
    const groups = {};
    for (const [k, w] of Object.entries(T.widgets).filter(([, x]) => x.group !== "Gizli")) (groups[w.group || "Sınıf yönetimi"] = groups[w.group || "Sınıf yönetimi"] || []).push([k, w]);
    let m;
    const body = T.h("div.stack", Object.entries(groups).map(([g, list]) => T.h("div.stack",
      T.h("h3", { style: { fontSize: "18px" } }, g),
      T.h("div.tool-grid", list.map(([k, w]) => T.h("button.tool-card.c-" + (w.tone || "sun"), { onclick: () => { add(k); m.close(); } }, T.icon(w.icon), T.h("span", w.title, T.h("small", w.desc || ""))))))));
    m = T.modal({ title: "Tahtaya araç ekle", body, wide: true, actions: [{ label: "Kapat" }] });
  }
  function pickBg() {
    let m;
    const d = data();
    m = T.modal({ title: "Arka plan", body: T.h("div.tool-grid", BGS.map(([k, n]) => T.h("button.tool-card", {
      onclick: () => { d.bg = k; save(); root.className = "board board-bg-" + k; m.close(); },
    }, T.h("span.board-bg-" + k, { style: { width: "40px", height: "40px", borderRadius: "8px", flex: "0 0 auto", background: k === "tahta" ? "var(--board)" : null } }), n))), actions: [{ label: "Kapat" }] });
  }
  async function clearAll() {
    if (!(await T.confirm("Tahtayı temizle", "Tahtadaki bütün araçlar kaldırılsın mı?", "Temizle"))) return;
    data().widgets = []; save(); T.route();
  }

  function add(type, init = {}) {
    const def = T.widgets[type]; if (!def) return;
    const d = data();
    const bw = root ? root.clientWidth : 1200, bh = root ? root.clientHeight : 700;
    const ww = Math.min(def.w || 320, bw - 20), wh = Math.min(def.h || 260, bh - 110);
    const best = place(d.widgets, ww, wh, bw, bh);
    const w = Object.assign({ id: T.uid(), type, w: ww, h: wh, x: best.x, y: best.y, data: def.init ? def.init() : {} }, init);
    d.widgets.push(w); save();
    if (root && T.$(".board-empty", root)) T.$(".board-empty", root).remove();
    if (root && root.isConnected) mount(w); else if (mode === "ekran") T.go("ekran");
    return w;
  }
  /* En az çakışan boş yeri bul */
  function place(list, ww, wh, bw, bh) {
    const x0 = mode === "ana" ? Math.min(380, Math.max(16, bw - ww - 16)) : 16, y0 = mode === "ana" ? 80 : 16;
    let best = { x: x0, y: y0, o: Infinity };
    outer: for (let y = y0; y <= Math.max(y0, bh - wh - 96); y += 24) for (let x = x0; x <= Math.max(x0, bw - ww - 16); x += 24) {
      let o = 0; for (const q of list) { const ix = Math.max(0, Math.min(x + ww, q.x + q.w) - Math.max(x, q.x)), iy = Math.max(0, Math.min(y + wh, q.y + q.h) - Math.max(y, q.y)); o += ix * iy; }
      if (o < best.o - 1) best = { x, y, o }; if (o === 0) break outer;
    }
    return best;
  }
  function clampInto(w) {
    if (!root) return;
    const bw = root.clientWidth, bh = root.clientHeight;
    w.w = Math.min(w.w, bw - 10); w.h = Math.min(w.h, bh - 90);
    w.x = T.clamp(w.x, 0, Math.max(0, bw - w.w)); w.y = T.clamp(w.y, 0, Math.max(0, bh - w.h - 80));
    const el = root.querySelector(`[data-w="${w.id}"]`);
    if (el) Object.assign(el.style, { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px" });
  }
  function mount(w) {
    const def = T.widgets[w.type];
    if (!def) return;
    const destroyers = [];
    const body = T.h("div.wd-body");
    const head = T.h("div.wd-head", T.icon(def.icon, ""), T.h("span.t", w.title || def.title),
      def.settings ? T.h("button", { title: "Ayarlar", "aria-label": "Ayarlar", onclick: () => def.settings(w, api) }, T.icon("settings")) : null,
      T.h("button", { title: "Kapat", "aria-label": "Aracı kapat", onclick: () => removeW(w.id) }, T.icon("close")));
    head.querySelector("svg").style.cssText = "width:22px;height:22px";
    const rz = T.h("div.wd-resize", { "aria-hidden": "true" });
    const el = T.h("section.wd.c-" + (def.tone || "sun"), { "data-w": w.id, "aria-label": def.title, style: { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px" } }, head, body, rz);
    root.append(el);
    const front = () => { T.$$(".wd.front", root).forEach((x) => x.classList.remove("front")); el.classList.add("front"); };
    el.addEventListener("pointerdown", front);
    T.dragMove(head, {
      onStart: () => ({ x: w.x, y: w.y }),
      onMove: (dx, dy, e, s) => { w.x = s.x + dx; w.y = s.y + dy; el.style.left = w.x + "px"; el.style.top = w.y + "px"; },
      onEnd: () => { clampInto(w); save(); },
    });
    T.dragMove(rz, {
      onStart: () => ({ w: w.w, h: w.h }),
      onMove: (dx, dy, e, s) => { w.w = Math.max(def.minW || 180, s.w + dx); w.h = Math.max(def.minH || 130, s.h + dy); el.style.width = w.w + "px"; el.style.height = w.h + "px"; api.resized && api.resized(); },
      onEnd: () => { clampInto(w); save(); api.resized && api.resized(); },
    });
    const api = {
      el, body, head,
      save,
      setTitle: (t) => { w.title = t; head.querySelector(".t").textContent = t; save(); },
      onDestroy: (f) => destroyers.push(f),
      rerender: () => { destroyers.splice(0).forEach((f) => f()); body.replaceChildren(); def.render(body, w, api); },
      cls: () => T.store.activeClass(),
    };
    w._destroy = () => destroyers.forEach((f) => { try { f(); } catch (e) {} });
    cleanup.push(w._destroy);
    def.render(body, w, api);
    requestAnimationFrame(() => clampInto(w));
  }
  function removeW(id) {
    const d = data(); const w = d.widgets.find((x) => x.id === id);
    if (w && w._destroy) w._destroy();
    d.widgets = d.widgets.filter((x) => x.id !== id); save();
    const el = root && root.querySelector(`[data-w="${id}"]`); el && el.remove();
  }
  /* Plan modülünden: tahtayı verilen araçlarla kur. */
  function setup(list) {
    const d = data();
    d.widgets.forEach((w) => w._destroy && w._destroy());
    d.widgets = [];
    const v = T.$("#view"), bw = v ? v.clientWidth : window.innerWidth, bh = v ? v.clientHeight : window.innerHeight - 170;
    list.forEach((it) => {
      const def = T.widgets[it.type]; if (!def) return;
      const ww = it.type === "text" ? 420 : it.type === "toollink" ? 260 : Math.min(def.w || 320, 380), wh = it.type === "toollink" ? 150 : Math.min(def.h || 260, 340);
      const p = place(d.widgets, ww, wh, bw, bh);
      d.widgets.push({ id: T.uid(), type: it.type, title: it.title, x: p.x, y: p.y, w: ww, h: wh, data: Object.assign(def.init ? def.init() : {}, it.data || {}) });
    });
    save(); T.go("ekran");
  }
  return { render, add, setup, BGS, openTray: () => openTray(), aktif: () => !!(root && root.isConnected) };
}
T.board = TahtaYap("ekran");
T.yuzen = TahtaYap("ana");
