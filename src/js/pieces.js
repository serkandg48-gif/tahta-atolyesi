/* Sanal manipülatif tuvali (Polypad / Toy Theater tarzı).
   Parçalar SVG içinde sürüklenir, döndürülür, çevrilir, kopyalanır, çöpe atılır. */
T.pieceTypes = {};
T.defPiece = (type, def) => (T.pieceTypes[type] = Object.assign({ rotStep: 15, value: 0 }, def));

(function () {
  const S = (tag, a, ...k) => T.svg(tag, a, ...k);
  const STROKE = "#2a2a2a";

  /* --- Taban blokları --- */
  const U = 22; // birlik küp kenarı
  const cube = (x, y) => S("rect", { x, y, width: U, height: U, fill: "url(#gBlue)", stroke: "#164e7a", "stroke-width": 1.5 });
  T.defPiece("yuzluk", { w: U * 10, h: U * 10, value: 100, label: "Yüzlük", rotStep: 90,
    draw: () => { const g = S("g"); for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g.append(cube(-U * 5 + i * U, -U * 5 + j * U)); return g; } });
  T.defPiece("onluk", { w: U, h: U * 10, value: 10, label: "Onluk", rotStep: 90,
    draw: () => { const g = S("g"); for (let j = 0; j < 10; j++) g.append(cube(-U / 2, -U * 5 + j * U)); return g; } });
  T.defPiece("birlik", { w: U, h: U, value: 1, label: "Birlik", rotStep: 90, draw: () => cube(-U / 2, -U / 2) });
  T.defPiece("binlik", { w: U * 10 + 40, h: U * 10 + 40, value: 1000, label: "Binlik", rotStep: 90,
    draw: () => {
      const g = S("g"); const o = 6;
      for (let k = 9; k >= 0; k--) {
        const r = S("rect", { x: -U * 5 + k * o / 1.5 - 10, y: -U * 5 - k * o / 1.5 + 10, width: U * 10, height: U * 10, fill: k ? "#a9d3f0" : "url(#gBlue)", stroke: "#164e7a", "stroke-width": 1.5 });
        g.append(r);
      }
      return g;
    } });

  /* --- Pullar --- */
  T.defPiece("pul", { w: 50, h: 50, value: 1, label: "Pul", rotStep: 0,
    draw: (p) => S("circle", { r: 23, fill: p.flip ? "#ef5b3b" : "#ffc233", stroke: STROKE, "stroke-width": 2.5 }) });
  T.defPiece("arti", { w: 54, h: 54, value: 1, label: "+1", rotStep: 0,
    draw: () => S("g", {}, S("circle", { r: 25, fill: "#ffc233", stroke: STROKE, "stroke-width": 2.5 }), S("path", { d: "M-11 0h22M0 -11v22", stroke: STROKE, "stroke-width": 4, "stroke-linecap": "round" })) });
  T.defPiece("eksi", { w: 54, h: 54, value: -1, label: "−1", rotStep: 0,
    draw: () => S("g", {}, S("circle", { r: 25, fill: "#ef5b3b", stroke: STROKE, "stroke-width": 2.5 }), S("path", { d: "M-11 0h22", stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round" })) });

  /* --- Cebir karoları --- */
  const X = 120, B = 30;
  const tile = (w, h, neg, fillPos) => S("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 4, fill: neg ? "#ef5b3b" : fillPos, stroke: STROKE, "stroke-width": 2.5 });
  const lbl = (t, neg, size = 26) => S("text", { "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-weight": 600, "font-size": size, fill: neg ? "#fff" : "#1d2830" }, t);
  T.defPiece("x2", { w: X, h: X, label: "x²", rotStep: 90, value: 0,
    draw: (p) => S("g", {}, tile(X, X, p.flip, "#4aa3d8"), lbl(p.flip ? "−x²" : "x²", p.flip)) });
  T.defPiece("x", { w: B, h: X, label: "x", rotStep: 90, value: 0,
    draw: (p) => S("g", {}, tile(B, X, p.flip, "#26b3a0"), lbl(p.flip ? "−x" : "x", p.flip, 20)) });
  T.defPiece("bir", { w: B, h: B, label: "1", rotStep: 90, value: 0,
    draw: (p) => S("g", {}, tile(B, B, p.flip, "#f2a93b"), lbl(p.flip ? "−" : "1", p.flip, 18)) });

  /* --- Örüntü blokları (kenar 60) --- */
  const E = 60;
  const poly = (pts, fill) => S("polygon", { points: pts.map((p) => p.join(",")).join(" "), fill, stroke: STROKE, "stroke-width": 2.5, "stroke-linejoin": "round" });
  const polyC = (p, pts, fill) => poly(pts, (p && p.color) || fill);
  const reg = (n, r, rot = 0) => Array.from({ length: n }, (_, i) => { const a = rot + (i * 2 * Math.PI) / n; return [r * Math.cos(a), r * Math.sin(a)]; });
  const h3 = (E * Math.sqrt(3)) / 2;
  T.defPiece("altigen", { w: 2 * E, h: 2 * h3, label: "Altıgen", rotStep: 30, draw: (p) => polyC(p, reg(6, E), "#ffc233") });
  T.defPiece("yamuk", { w: 2 * E, h: h3, label: "Yamuk", rotStep: 30, draw: (p) => polyC(p, [[-E, h3 / 2], [E, h3 / 2], [E / 2, -h3 / 2], [-E / 2, -h3 / 2]], "#ef5b3b") });
  T.defPiece("esk", { w: E * 1.5, h: h3, label: "Eşkenar dörtgen", rotStep: 30, draw: (p) => polyC(p, [[-E * 0.75, h3 / 2], [E * 0.25, h3 / 2], [E * 0.75, -h3 / 2], [-E * 0.25, -h3 / 2]], "#2e9bd6") });
  T.defPiece("ince", { w: E * 1.9, h: E * 0.5, label: "İnce dörtgen", rotStep: 30, draw: (p) => { const a = Math.PI / 6; const dx = E * Math.cos(a), dy = E * Math.sin(a); return polyC(p, [[-(E + dx) / 2, dy / 2], [(E - dx) / 2, dy / 2], [(E + dx) / 2, -dy / 2], [-(E - dx) / 2, -dy / 2]], "#e9cf9e"); } });
  T.defPiece("kare", { w: E, h: E, label: "Kare", rotStep: 15, draw: (p) => polyC(p, [[-E / 2, -E / 2], [E / 2, -E / 2], [E / 2, E / 2], [-E / 2, E / 2]], "#ff9a3c") });
  T.defPiece("ucgen", { w: E, h: h3, label: "Üçgen", rotStep: 30, draw: (p) => polyC(p, [[-E / 2, h3 / 3], [E / 2, h3 / 3], [0, (-2 * h3) / 3]], "#6cc04a") });

  /* --- Tangram (büyük kare 300) --- */
  const Q = 300;
  const tg = (pts, fill) => () => poly(pts, fill);
  const cen = (pts) => { const c = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]); return pts.map((p) => [p[0] - c[0], p[1] - c[1]]); };
  const TG = {
    tb1: [cen([[0, 0], [Q, 0], [Q / 2, Q / 2]]), "#ef5b3b"],
    tb2: [cen([[0, 0], [Q / 2, Q / 2], [0, Q]]), "#2e9bd6"],
    tm: [cen([[Q, Q / 2], [Q, Q], [Q / 2, Q]]), "#8a5cd0"],
    ts1: [cen([[(3 * Q) / 4, Q / 4], [Q, 0], [Q, Q / 2]]), "#6cc04a"],
    ts2: [cen([[Q / 4, (3 * Q) / 4], [Q / 2, Q / 2], [(3 * Q) / 4, (3 * Q) / 4]]), "#f27ba9"],
    tsq: [cen([[Q / 2, Q / 2], [(3 * Q) / 4, Q / 4], [Q, Q / 2], [(3 * Q) / 4, (3 * Q) / 4]]), "#ffc233"],
    tpar: [cen([[0, Q], [Q / 4, (3 * Q) / 4], [(3 * Q) / 4, (3 * Q) / 4], [Q / 2, Q]]), "#26b3a0"],
  };
  for (const [k, [pts, fill]] of Object.entries(TG)) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const w = 2 * Math.max(...xs.map(Math.abs)), h = 2 * Math.max(...ys.map(Math.abs));
    T.defPiece(k, { w, h, label: "Tangram", rotStep: 45, draw: tg(pts, fill), flipX: true });
  }

  /* --- Para (biçimlendirilmiş, gerçek tasarım değil) --- */
  const coin = (r, fill, ring, txt, sub) => S("g", {},
    S("circle", { r, fill: ring, stroke: STROKE, "stroke-width": 2 }),
    S("circle", { r: r * 0.8, fill, stroke: "rgba(0,0,0,.25)", "stroke-width": 1.5 }),
    S("text", { "text-anchor": "middle", y: sub ? -2 : 0, "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": r * 0.62, fill: "#3a2a10" }, txt),
    sub ? S("text", { "text-anchor": "middle", y: r * 0.45, "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": r * 0.28, fill: "#3a2a10" }, sub) : null);
  const COINS = [[1, 16, "#d9a86a", "#c48d4c", "1", "kuruş"], [5, 19, "#e7c46f", "#cfa94e", "5", "kuruş"], [10, 21, "#e7c46f", "#cfa94e", "10", "kuruş"], [25, 24, "#e7c46f", "#cfa94e", "25", "kuruş"], [50, 27, "#dfe3e6", "#b9c0c6", "50", "kuruş"], [100, 30, "#e7c46f", "#c8ccd0", "1", "TL"]];
  COINS.forEach(([v, r, f, ring, t, sub]) => T.defPiece("k" + v, { w: r * 2, h: r * 2, value: v / 100, label: v === 100 ? "1 TL" : v + " kr", rotStep: 0, draw: () => coin(r, f, ring, t, sub) }));
  const NOTES = [[5, "#9a7bc4"], [10, "#e2675a"], [20, "#59b37a"], [50, "#f0a04b"], [100, "#4d9bd6"], [200, "#c76fa6"]];
  NOTES.forEach(([v, col]) => T.defPiece("b" + v, { w: 220, h: 110, value: v, label: v + " TL", rotStep: 90,
    draw: () => S("g", {},
      S("rect", { x: -110, y: -55, width: 220, height: 110, rx: 8, fill: col, stroke: STROKE, "stroke-width": 2 }),
      S("rect", { x: -100, y: -45, width: 200, height: 90, rx: 5, fill: "none", stroke: "rgba(255,255,255,.55)", "stroke-width": 2 }),
      S("circle", { cx: 50, cy: 0, r: 30, fill: "rgba(255,255,255,.3)" }),
      S("text", { x: -88, y: -18, "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 40, fill: "#fff" }, v),
      S("text", { x: -88, y: 22, "font-family": "Lexend, sans-serif", "font-size": 18, fill: "#fff" }, "TÜRK LİRASI"),
      S("text", { x: 50, y: 2, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 26, fill: "#fff" }, v)) }));

  /* --- Kesir şeritleri (bütün = 600) --- */
  const FC = { 1: "#ef5b3b", 2: "#ff9a3c", 3: "#ffc233", 4: "#6cc04a", 5: "#26b3a0", 6: "#2e9bd6", 8: "#8a5cd0", 10: "#f27ba9", 12: "#b98c5b" };
  Object.entries(FC).forEach(([n, col]) => {
    n = Number(n); const w = 600 / n;
    T.defPiece("f" + n, { w, h: 56, value: 1 / n, label: n === 1 ? "1" : "1/" + n, rotStep: 90,
      draw: () => S("g", {}, S("rect", { x: -w / 2, y: -28, width: w, height: 56, rx: 4, fill: col, stroke: STROKE, "stroke-width": 2 }),
        S("text", { "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": n > 8 ? 18 : 24, fill: "#1d1d1d" }, n === 1 ? "1" : "1/" + n)) });
  });

  /* --- Not kartı --- */
  T.defPiece("not", { w: 140, h: 90, label: "Not", rotStep: 15,
    draw: (p) => S("g", {}, S("rect", { x: -70, y: -45, width: 140, height: 90, rx: 6, fill: "#fff6b8", stroke: STROKE, "stroke-width": 2 }),
      S("text", { "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Patrick Hand', cursive", "font-size": 36, fill: "#2a2a2a" }, p.text || "?")) });
})();

/* Tuval: el, {palettes, readout(pieces) -> string|Node, extra(api) -> Node[], grid, height} */
/* --- Serbest şekiller: renklendirilebilir, enine boyuna esnetilebilir --- */
(function () {
  const S = (tag, a, ...k) => T.svg(tag, a, ...k);
  const st = (p, def) => ({ fill: p.color || def, stroke: "#2a2a2a", "stroke-width": 2.5, "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" });
  const sh = (type, label, w, h, col, mk) => T.defPiece(type, { w, h, label, rotStep: 15, stretch: true, colorable: true, draw: (p) => mk(p, col) });
  sh("s-kare", "Kare", 100, 100, "#ff9a3c", (p, c) => S("rect", Object.assign({ x: -50, y: -50, width: 100, height: 100 }, st(p, c))));
  sh("s-dikdortgen", "Dikdörtgen", 160, 90, "#2e9bd6", (p, c) => S("rect", Object.assign({ x: -80, y: -45, width: 160, height: 90 }, st(p, c))));
  sh("s-daire", "Daire", 100, 100, "#ef5b3b", (p, c) => S("circle", Object.assign({ r: 50 }, st(p, c))));
  sh("s-ucgen", "Üçgen", 110, 96, "#6cc04a", (p, c) => S("polygon", Object.assign({ points: "-55,48 55,48 0,-48" }, st(p, c))));
  sh("s-dik", "Dik üçgen", 110, 100, "#26b3a0", (p, c) => S("polygon", Object.assign({ points: "-55,50 55,50 -55,-50" }, st(p, c))));
  sh("s-besgen", "Beşgen", 104, 100, "#8a5cd0", (p, c) => S("polygon", Object.assign({ points: Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return (52 * Math.cos(a)).toFixed(1) + "," + (52 * Math.sin(a) + 4).toFixed(1); }).join(" ") }, st(p, c))));
  sh("s-yildiz", "Yıldız", 110, 106, "#ffc233", (p, c) => S("polygon", Object.assign({ points: Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 23 : 55; return (r * Math.cos(a)).toFixed(1) + "," + (r * Math.sin(a) + 4).toFixed(1); }).join(" ") }, st(p, c))));
  sh("s-cizgi", "Çizgi", 200, 14, "#2a2a2a", (p, c) => S("g", {}, S("rect", { x: -100, y: -7, width: 200, height: 14, fill: "transparent" }), S("line", { x1: -100, y1: 0, x2: 100, y2: 0, stroke: p.color || c, "stroke-width": 6, "stroke-linecap": "round", "vector-effect": "non-scaling-stroke" })));
  sh("s-ok", "Ok", 200, 40, "#2a2a2a", (p, c) => S("g", {}, S("rect", { x: -100, y: -20, width: 200, height: 40, fill: "transparent" }), S("path", { d: "M-100 0H90M70 -18 98 0 70 18", fill: "none", stroke: p.color || c, "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" })));
  ["kare", "ucgen", "altigen", "yamuk", "esk", "ince", "not"].forEach((k) => { T.pieceTypes[k].stretch = true; });
})();
T.PALET = ["#ef5b3b", "#ff9a3c", "#ffc233", "#6cc04a", "#26b3a0", "#2e9bd6", "#8a5cd0", "#f27ba9", "#ffffff", "#2a2a2a"];

/* Tuval: el, {palettes, readout(pieces) -> string|Node, grid, snap, background, initial, matHeight} */
T.Tuval = function (host, opts) {
  const W = opts.width || 1200, H = opts.height || 680;
  const norm = (p) => Object.assign({ id: T.uid(), rot: 0, flip: false, sx: 1, sy: 1 }, p);
  const state = { pieces: (opts.initial || []).map(norm), sel: null, hideValue: false };
  const svg = T.svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "full", style: "touch-action:none" });
  svg.innerHTML = `<defs><linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fd0f5"/><stop offset="1" stop-color="#3a9bd8"/></linearGradient></defs>`;
  if (opts.background) svg.append(opts.background(W, H));
  const layer = T.svg("g"); const over = T.svg("g"); svg.append(layer);
  const trash = T.svg("g", { transform: `translate(${W - 70},${H - 70})`, opacity: 0.55 },
    T.svg("circle", { r: 44, fill: "rgba(226,71,59,.12)", stroke: "rgba(226,71,59,.5)", "stroke-width": 3, "stroke-dasharray": "6 6" }),
    T.svg("path", { d: "M-14 -10h28M-10 -10l2 24h16l2-24M-5 -10v-6h10v6", stroke: "#c0392b", "stroke-width": 3, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }));
  svg.append(trash, over);

  const mat = T.h("div.mat" + (opts.grid ? ".grid-bg" : ""), { style: { height: opts.matHeight || "var(--stage-h)" } }, svg);
  const readout = T.h("div.readout", { style: { color: "var(--chalk)" } });
  const selBar = T.h("div.row");
  const paletteRow = T.h("div.row", { style: { gap: "8px" } });

  for (const pal of opts.palettes) {
    for (const type of pal.items) {
      const def = T.pieceTypes[type];
      const s = Math.min(1, 46 / Math.max(def.w, def.h));
      const mini = T.svg("svg", { viewBox: "-26 -26 52 52", width: 46, height: 46 });
      mini.innerHTML = svg.querySelector("defs").outerHTML;
      const g = def.draw({ flip: false, text: "?" }); g.setAttribute("transform", `scale(${s})`); mini.append(g);
      paletteRow.append(T.h("button.btn.c-chalk.sm", { title: def.label + " ekle", "aria-label": def.label + " ekle", style: { minHeight: "58px", padding: "4px 10px" }, onclick: () => add(type) }, mini, def.label.length < 11 ? T.h("span", def.label) : null));
    }
  }

  const tf = (p) => { const def = T.pieceTypes[p.type]; const fx = def.flipX && p.flip ? -1 : 1; return `translate(${p.x},${p.y}) rotate(${p.rot}) scale(${fx * p.sx},${p.sy})`; };
  function add(type, at) {
    const def = T.pieceTypes[type];
    const n = state.pieces.length;
    const p = norm({ type, x: at ? at.x : 160 + ((n * 37) % (W - 400)), y: at ? at.y : 140 + ((n * 53) % (H - 300)) });
    if (type === "not") p.text = "?";
    state.pieces.push(p); T.sound.pop(); select(p.id); change();
    return p;
  }
  function el(p) {
    const g = T.svg("g", { "data-id": p.id, style: "cursor:grab", transform: tf(p) });
    g.append(T.pieceTypes[p.type].draw(p));
    return g;
  }
  /* Seçim çerçevesi ve tutamaklar: svg koordinatında çizilir, parçayla birlikte döner */
  function drawOverlay() {
    over.replaceChildren();
    const p = state.pieces.find((x) => x.id === state.sel); if (!p) return;
    const def = T.pieceTypes[p.type];
    const hw = (def.w * p.sx) / 2 + 8, hh = (def.h * p.sy) / 2 + 8;
    const g = T.svg("g", { transform: `translate(${p.x},${p.y}) rotate(${p.rot})` });
    g.append(T.svg("rect", { x: -hw, y: -hh, width: hw * 2, height: hh * 2, rx: 8, fill: "none", stroke: "#2e9bd6", "stroke-width": 3, "stroke-dasharray": "8 6", "pointer-events": "none" }));
    const handle = (x, y, kind, col, title) => {
      const c = T.svg("g", { "data-h": kind, style: "cursor:pointer" },
        T.svg("circle", { cx: x, cy: y, r: 26, fill: "transparent" }),
        T.svg("circle", { cx: x, cy: y, r: 13, fill: col, stroke: "#fff", "stroke-width": 3 }));
      c.append(T.svg("title", {}, title)); g.append(c);
    };
    handle(hw, hh, "both", "#2e9bd6", "Boyutlandır");
    if (def.stretch) { handle(hw, 0, "x", "#ffc233", "Genişlet"); handle(0, hh, "y", "#ffc233", "Uzat"); }
    if (def.rotStep) { g.append(T.svg("line", { x1: 0, y1: -hh, x2: 0, y2: -hh - 34, stroke: "#3fae5a", "stroke-width": 3, "pointer-events": "none" })); handle(0, -hh - 40, "rot", "#3fae5a", "Döndür"); }
    over.append(g);
  }
  function draw() {
    state.pieces.forEach((q) => { if (q.sx == null) q.sx = 1; if (q.sy == null) q.sy = 1; });
    layer.replaceChildren(...state.pieces.map(el));
    drawOverlay();
    selBar.replaceChildren();
    const p = state.pieces.find((x) => x.id === state.sel);
    if (p) {
      const def = T.pieceTypes[p.type];
      if (def.rotStep) selBar.append(T.h("button.btn.sm.c-sky", { onclick: () => { p.rot = (p.rot + def.rotStep) % 360; draw(); change(); } }, T.icon("rotate"), "Döndür"));
      if (["pul", "x2", "x", "bir"].includes(p.type) || def.flipX) selBar.append(T.h("button.btn.sm.c-sun", { onclick: () => { p.flip = !p.flip; draw(); change(); } }, T.icon("reset"), p.type === "pul" ? "Renk" : def.flipX ? "Çevir" : "İşaret"));
      if (def.colorable || ["kare", "ucgen", "altigen", "yamuk", "esk", "ince"].includes(p.type)) selBar.append(T.h("div.row", { style: { gap: "4px" } }, T.PALET.map((c) => T.h("button", { "aria-label": "Renk", onclick: () => { p.color = c; draw(); }, style: { width: "30px", height: "30px", borderRadius: "50%", border: "3px solid #fff", outline: p.color === c ? "3px solid var(--ink)" : "1px solid rgba(0,0,0,.2)", background: c } }))));
      if (p.type === "not") selBar.append(T.h("button.btn.sm.c-sun", { onclick: () => editNote(p) }, T.icon("edit"), "Yaz"));
      if (def.onBreak) selBar.append(T.h("button.btn.sm.c-leaf", { onclick: () => def.onBreak(p, api) }, "Boz"));
      if (p.sx !== 1 || p.sy !== 1) selBar.append(T.h("button.btn.sm.c-chalk", { onclick: () => { p.sx = p.sy = 1; draw(); change(); } }, "Asıl boyut"));
      selBar.append(T.h("button.btn.sm.c-chalk", { onclick: () => { const c = Object.assign({}, p, { id: T.uid(), x: p.x + 30, y: p.y + 30 }); state.pieces.push(c); select(c.id); change(); } }, T.icon("copy"), "Kopyala"));
      selBar.append(T.h("button.btn.sm.c-tomato", { onclick: () => remove(p.id) }, T.icon("trash"), "Sil"));
    }
    if (opts.readout) {
      const r = state.hideValue ? "?" : opts.readout(state.pieces, api);
      readout.replaceChildren(r instanceof Node ? r : document.createTextNode(r ?? ""));
    }
  }
  function editNote(p) {
    const inp = T.h("input.in", { value: p.text || "", maxlength: 12 });
    T.modal({ title: "Kartı yaz", body: inp, actions: [{ label: "Vazgeç" }, { label: "Kaydet", tone: "c-leaf", onClick: () => { p.text = inp.value || "?"; draw(); } }] });
  }
  function select(id) { state.sel = id; draw(); }
  function remove(id) { state.pieces = state.pieces.filter((p) => p.id !== id); if (state.sel === id) state.sel = null; T.sound.tick(); draw(); change(); }
  function change() { opts.onChange && opts.onChange(state.pieces, api); }
  const local = (p, pt) => { const a = (-p.rot * Math.PI) / 180, dx = pt.x - p.x, dy = pt.y - p.y; return { x: dx * Math.cos(a) - dy * Math.sin(a), y: dx * Math.sin(a) + dy * Math.cos(a) }; };

  /* sürükleme, boyutlandırma, döndürme */
  let drag = null;
  svg.addEventListener("pointerdown", (e) => {
    const hEl = e.target.closest("[data-h]");
    const pt = T.svgPoint(svg, e.clientX, e.clientY);
    if (hEl) {
      const p = state.pieces.find((x) => x.id === state.sel); if (!p) return;
      e.preventDefault(); svg.setPointerCapture(e.pointerId);
      drag = { mode: hEl.dataset.h, p, l0: local(p, pt), sx0: p.sx, sy0: p.sy, rot0: p.rot, a0: Math.atan2(pt.y - p.y, pt.x - p.x) };
      return;
    }
    const g = e.target.closest("g[data-id]");
    if (!g) { if (state.sel) select(null); return; }
    const p = state.pieces.find((x) => x.id === g.dataset.id); if (!p) return;
    e.preventDefault();
    svg.setPointerCapture(e.pointerId);
    state.pieces = state.pieces.filter((x) => x !== p).concat(p);
    drag = { mode: "move", p, dx: pt.x - p.x, dy: pt.y - p.y, sx: e.clientX, sy: e.clientY };
    state.sel = p.id; draw();
  });
  svg.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const pt = T.svgPoint(svg, e.clientX, e.clientY), p = drag.p, def = T.pieceTypes[p.type];
    const lim = (v) => T.clamp(v, 0.25, 6);
    if (drag.mode === "move") {
      let x = pt.x - drag.dx, y = pt.y - drag.dy;
      if (opts.snap) { x = Math.round(x / opts.snap) * opts.snap; y = Math.round(y / opts.snap) * opts.snap; }
      p.x = T.clamp(x, 0, W); p.y = T.clamp(y, 0, H);
      const g = layer.querySelector(`g[data-id="${p.id}"]`); if (g) g.setAttribute("transform", tf(p));
      drawOverlay();
      trash.setAttribute("opacity", Math.hypot(p.x - (W - 70), p.y - (H - 70)) < 70 ? 1 : 0.55);
      return;
    }
    const l = local(p, pt), l0 = drag.l0;
    if (drag.mode === "both") { const k = Math.hypot(l.x, l.y) / Math.max(1, Math.hypot(l0.x, l0.y)); p.sx = lim(drag.sx0 * k); p.sy = lim(drag.sy0 * k); }
    else if (drag.mode === "x") { p.sx = lim(drag.sx0 * (l.x / (l0.x || 1))); }
    else if (drag.mode === "y") { p.sy = lim(drag.sy0 * (l.y / (l0.y || 1))); }
    else if (drag.mode === "rot") {
      let r = drag.rot0 + ((Math.atan2(pt.y - p.y, pt.x - p.x) - drag.a0) * 180) / Math.PI;
      const step = e.shiftKey ? 1 : def.rotStep || 15; r = Math.round(r / step) * step; p.rot = ((r % 360) + 360) % 360;
    }
    const g = layer.querySelector(`g[data-id="${p.id}"]`); if (g) g.setAttribute("transform", tf(p));
    drawOverlay();
  });
  const end = () => {
    if (!drag) return;
    const p = drag.p, mode = drag.mode; drag = null; trash.setAttribute("opacity", 0.55);
    if (mode === "move" && Math.hypot(p.x - (W - 70), p.y - (H - 70)) < 70) { remove(p.id); return; }
    draw(); change();
  };
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
  svg.addEventListener("dblclick", (e) => {
    const g = e.target.closest("g[data-id]"); if (!g) return;
    const p = state.pieces.find((x) => x.id === g.dataset.id);
    const def = p && T.pieceTypes[p.type];
    if (def && def.onBreak) def.onBreak(p, api);
    else if (p && p.type === "not") editNote(p);
    else if (p && def.rotStep) { p.rot = (p.rot + def.rotStep) % 360; draw(); change(); }
  });

  const api = {
    state, add, remove, draw, change, svg, W, H,
    clear() { state.pieces = []; state.sel = null; draw(); change(); },
    set(pieces) { state.pieces = pieces.map(norm); state.sel = null; draw(); change(); },
    toggleValue() { state.hideValue = !state.hideValue; draw(); return state.hideValue; },
  };

  host.append(
    T.h("div.row", paletteRow),
    mat,
    T.h("div.row", readout, T.h("div.spacer"), selBar),
    T.h("p.hint", "Parçayı seçince mavi tutamak boyutu, sarı tutamaklar enini ve boyunu, yeşil tutamak yönünü değiştirir.")
  );
  draw();
  return api;
};

/* Taban bloklarında bozma: yüzlük -> 10 onluk, onluk -> 10 birlik, binlik -> 10 yüzlük */
(function () {
  const brk = (into, n, gap) => (p, api) => {
    api.remove(p.id);
    for (let i = 0; i < n; i++) {
      const q = api.add(into, { x: p.x + (i % 10) * gap - gap * 4.5, y: p.y + Math.floor(i / 10) * gap });
      q.rot = p.rot;
    }
    api.draw();
  };
  T.pieceTypes.onluk.onBreak = brk("birlik", 10, 26);
  T.pieceTypes.yuzluk.onBreak = brk("onluk", 10, 26);
  T.pieceTypes.binlik.onBreak = brk("yuzluk", 10, 36);
})();
