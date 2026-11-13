/* Okuma tiyatrosu: çocuk cümleyi okur, kedi sahnede canlandırır, sınıf doğru oynayıp oynamadığına karar verir.
   Çizimler ve hareketler tamamen kod; internetsiz çalışır. */
(function () {
  const { h } = T;
  const NS = "http://www.w3.org/2000/svg";
  const S = (tag, a = {}, ...k) => { const e = document.createElementNS(NS, tag); for (const [x, v] of Object.entries(a)) e.setAttribute(x, v); k.forEach((c) => c && e.append(c)); return e; };
  const io = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2), cik = (t) => 1 - Math.pow(1 - t, 3), yay = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  const ZEMIN = 500, EV = 600, KUTU = 215, MASA = 960, MASA_UST = 378, TOP0 = 430, SUT = 760, HALI = 600;
  const EYLEM = {
    masa: { cumle: "Kedi masaya zıpladı.", kisa: "masaya zıpladı" },
    kutu: { cumle: "Kedi kutuya girdi.", kisa: "kutuya girdi" },
    top: { cumle: "Kedi topla oynadı.", kisa: "topla oynadı" },
    sut: { cumle: "Kedi sütünü içti.", kisa: "sütünü içti" },
    uyku: { cumle: "Kedi halıda uyudu.", kisa: "halıda uyudu" },
    miyav: { cumle: "Kedi yüksek sesle miyavladı.", kisa: "miyavladı" },
  };
  const IKILI = [["kutu", "masa"], ["sut", "uyku"], ["top", "miyav"], ["masa", "miyav"], ["sut", "top"], ["kutu", "uyku"]];
  const iki = (a, b) => `Kedi önce ${EYLEM[a].kisa}, sonra ${EYLEM[b].kisa}.`;

  function sahneKur(svg) {
    const defs = S("defs");
    const lg = (id, stops, x2 = 0, y2 = 1) => S("linearGradient", { id, x1: 0, y1: 0, x2, y2 }, ...stops.map(([o, c]) => S("stop", { offset: o, "stop-color": c })));
    const rg = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) => S("radialGradient", { id, cx, cy, r }, ...stops.map(([o, c, op]) => S("stop", { offset: o, "stop-color": c, "stop-opacity": op ?? 1 })));
    defs.append(
      lg("ot-duvar", [[0, "#3B2F5C"], [0.55, "#5A3F73"], [1, "#2A2140"]]),
      lg("ot-zemin", [[0, "#B9773E"], [1, "#7A4521"]]),
      lg("ot-gok", [[0, "#7EC8F2"], [1, "#CDEBFA"]]),
      lg("ot-kedi", [[0, "#FFB25A"], [1, "#E5782A"]]),
      lg("ot-kutu", [[0, "#D9A266"], [1, "#B37B43"]]),
      lg("ot-kutu-on", [[0, "#E7B57A"], [1, "#C48C52"]]),
      lg("ot-masa", [[0, "#9C5C2E"], [1, "#6E3B18"]]),
      lg("ot-perdeK", [[0, "#B3202E"], [0.5, "#E03A44"], [1, "#9A1622"]], 1, 0),
      rg("ot-spot", [[0, "#FFF6D8", 0.55], [0.55, "#FFE9A8", 0.18], [1, "#FFE9A8", 0]], 0.5, 0.15, 0.85),
      rg("ot-vinyet", [[0.55, "#000", 0], [1, "#000", 0.55]]),
      rg("ot-top", [[0, "#FFFFFF"], [0.3, "#7FD3FF"], [1, "#1E7FC2"]], 0.35, 0.3, 0.75),
      rg("ot-hali", [[0, "#3E8F7A"], [0.7, "#2E7563"], [1, "#225A4C"]]),
      S("filter", { id: "ot-golge", x: "-50%", y: "-50%", width: "200%", height: "200%" }, S("feGaussianBlur", { stdDeviation: 6 })),
      S("filter", { id: "ot-yumusak", x: "-20%", y: "-20%", width: "140%", height: "140%" }, S("feDropShadow", { dx: 0, dy: 6, stdDeviation: 6, "flood-color": "#1a0f05", "flood-opacity": 0.35 })),
      S("pattern", { id: "ot-desen", width: 60, height: 60, patternUnits: "userSpaceOnUse" }, S("path", { d: "M30 8 l6 10 -6 10 -6 -10z", fill: "rgba(255,255,255,.06)" }), S("circle", { cx: 0, cy: 45, r: 3, fill: "rgba(255,255,255,.05)" }), S("circle", { cx: 60, cy: 45, r: 3, fill: "rgba(255,255,255,.05)" })));
    svg.append(defs);
    const k = {};
    /* duvar ve pencere */
    svg.append(S("rect", { width: 1200, height: ZEMIN, fill: "url(#ot-duvar)" }), S("rect", { width: 1200, height: ZEMIN, fill: "url(#ot-desen)" }));
    const pencere = S("g", { transform: "translate(470 70)" });
    const gok = S("g", { "clip-path": "url(#ot-pclip)" });
    defs.append(S("clipPath", { id: "ot-pclip" }, S("rect", { x: 0, y: 0, width: 260, height: 190, rx: 14 })));
    gok.append(S("rect", { width: 260, height: 190, fill: "url(#ot-gok)" }), S("circle", { cx: 200, cy: 50, r: 26, fill: "#FFE27A" }), S("circle", { cx: 200, cy: 50, r: 40, fill: "#FFE27A", opacity: 0.25 }));
    k.bulutlar = [0, 1, 2].map((i) => { const b = S("g", { opacity: 0.95 }, S("ellipse", { cx: 0, cy: 0, rx: 34, ry: 14, fill: "#fff" }), S("ellipse", { cx: -14, cy: -8, rx: 18, ry: 14, fill: "#fff" }), S("ellipse", { cx: 12, cy: -10, rx: 20, ry: 16, fill: "#fff" })); gok.append(b); return { b, x: i * 110, y: 40 + i * 38, v: 6 + i * 3 }; });
    gok.append(S("path", { d: "M0 160 Q 60 130 130 150 T 260 140 V190 H0z", fill: "#6CC26B" }), S("path", { d: "M0 175 Q 80 150 160 170 T 260 165 V190 H0z", fill: "#4FA853" }));
    pencere.append(S("rect", { x: -12, y: -12, width: 284, height: 214, rx: 20, fill: "#F3E2C2", filter: "url(#ot-yumusak)" }), gok, S("rect", { x: 126, y: 0, width: 8, height: 190, fill: "#F3E2C2" }), S("rect", { x: 0, y: 92, width: 260, height: 8, fill: "#F3E2C2" }), S("rect", { x: -22, y: 196, width: 304, height: 14, rx: 7, fill: "#E6CFA6" }));
    svg.append(pencere);
    /* çerçeveli resim ve raf */
    svg.append(S("g", { transform: "translate(120 120)", filter: "url(#ot-yumusak)" }, S("rect", { width: 120, height: 92, rx: 6, fill: "#D8A23F" }), S("rect", { x: 10, y: 10, width: 100, height: 72, fill: "#FCE9C9" }), S("path", { d: "M18 74 l26 -30 20 22 14 -14 24 22z", fill: "#7BB36F" }), S("circle", { cx: 86, cy: 30, r: 9, fill: "#F2A54A" })));
    svg.append(S("g", { transform: "translate(870 150)" }, S("rect", { x: 0, y: 60, width: 200, height: 12, rx: 4, fill: "#8A532B", filter: "url(#ot-yumusak)" }), S("rect", { x: 20, y: 18, width: 22, height: 42, rx: 3, fill: "#E45C4C" }), S("rect", { x: 46, y: 26, width: 18, height: 34, rx: 3, fill: "#4C8FE0" }), S("rect", { x: 68, y: 14, width: 24, height: 46, rx: 3, fill: "#F1B941" }), S("path", { d: "M130 60 q -4 -30 16 -36 q 20 6 16 36z", fill: "#6FB56A" }), S("rect", { x: 128, y: 48, width: 36, height: 14, rx: 4, fill: "#C9733E" })));
    /* zemin */
    svg.append(S("rect", { y: ZEMIN, width: 1200, height: 120, fill: "url(#ot-zemin)" }));
    for (let i = 0; i < 16; i++) svg.append(S("line", { x1: i * 80 - 40, y1: ZEMIN, x2: i * 95 - 160, y2: 620, stroke: "rgba(60,25,5,.35)", "stroke-width": 2 }));
    svg.append(S("rect", { y: ZEMIN - 8, width: 1200, height: 10, fill: "#5A3417" }));
    svg.append(S("ellipse", { cx: HALI, cy: ZEMIN + 40, rx: 230, ry: 34, fill: "url(#ot-hali)" }), S("ellipse", { cx: HALI, cy: ZEMIN + 40, rx: 205, ry: 25, fill: "none", stroke: "#F4D58A", "stroke-width": 3, "stroke-dasharray": "10 8", opacity: 0.8 }));
    /* masa */
    const masa = S("g", { filter: "url(#ot-yumusak)" });
    masa.append(S("rect", { x: MASA - 120, y: MASA_UST, width: 240, height: 22, rx: 8, fill: "url(#ot-masa)" }), S("rect", { x: MASA - 120, y: MASA_UST, width: 240, height: 6, rx: 3, fill: "#B97543" }), S("rect", { x: MASA - 104, y: MASA_UST + 20, width: 18, height: ZEMIN - MASA_UST + 18, rx: 6, fill: "#6E3B18" }), S("rect", { x: MASA + 86, y: MASA_UST + 20, width: 18, height: ZEMIN - MASA_UST + 18, rx: 6, fill: "#6E3B18" }));
    masa.append(S("path", { d: `M${MASA + 40} ${MASA_UST} q -2 -36 22 -44 q 24 8 22 44z`, fill: "#F7EFE3" }), S("path", { d: `M${MASA + 52} ${MASA_UST - 40} q -8 -20 4 -34 M${MASA + 60} ${MASA_UST - 42} q 10 -16 2 -30`, stroke: "#5DA35A", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }), S("circle", { cx: MASA + 56, cy: MASA_UST - 76, r: 9, fill: "#F0718B" }), S("circle", { cx: MASA + 62, cy: MASA_UST - 74, r: 8, fill: "#F7A3B5" }));
    svg.append(masa);
    /* kutu: arka */
    svg.append(S("g", { filter: "url(#ot-yumusak)" }, S("path", { d: `M${KUTU - 90} ${ZEMIN - 110} l 20 -28 h 140 l 20 28z`, fill: "#A06A35" }), S("rect", { x: KUTU - 90, y: ZEMIN - 112, width: 180, height: 10, fill: "#8C5C2C" })));
    /* süt kasesi */
    const kase = S("g", { transform: `translate(${SUT} ${ZEMIN + 6})` });
    k.sut = S("ellipse", { cx: 0, cy: -26, rx: 40, ry: 8, fill: "#FFFFFF" });
    kase.append(S("ellipse", { cx: 0, cy: 4, rx: 54, ry: 9, fill: "rgba(0,0,0,.25)", filter: "url(#ot-golge)" }), S("path", { d: "M-50 -28 q 4 32 50 32 q 46 0 50 -32z", fill: "#E9525B" }), S("ellipse", { cx: 0, cy: -28, rx: 50, ry: 11, fill: "#C83D47" }), k.sut, S("path", { d: "M-30 -14 q 10 8 26 9", stroke: "rgba(255,255,255,.6)", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }));
    svg.append(kase);
    /* top */
    k.topG = S("g"); k.topI = S("g");
    k.topI.append(S("circle", { r: 26, fill: "url(#ot-top)" }), S("path", { d: "M-26 0 q 26 -14 52 0", stroke: "#FFD84A", "stroke-width": 6, fill: "none" }), S("path", { d: "M-18 16 q 18 -8 36 0", stroke: "#FF6F6F", "stroke-width": 5, fill: "none" }));
    k.topGolge = S("ellipse", { rx: 26, ry: 6, fill: "rgba(0,0,0,.28)", filter: "url(#ot-golge)" });
    svg.append(k.topGolge, k.topG); k.topG.append(k.topI);
    /* kedi */
    k.kediGolge = S("ellipse", { rx: 64, ry: 10, fill: "rgba(0,0,0,.32)", filter: "url(#ot-golge)" });
    svg.append(k.kediGolge);
    k.kedi = kediYap(); svg.append(k.kedi.g);
    /* kutu: ön yüz (kedi içine girince önde kalır) */
    svg.append(S("g", {}, S("rect", { x: KUTU - 92, y: ZEMIN - 104, width: 184, height: 112, rx: 6, fill: "url(#ot-kutu-on)" }), S("path", { d: `M${KUTU - 92} ${ZEMIN - 104} l -26 34 l 30 6z`, fill: "#C8925A" }), S("path", { d: `M${KUTU + 92} ${ZEMIN - 104} l 26 34 l -30 6z`, fill: "#B98247" }), S("rect", { x: KUTU - 14, y: ZEMIN - 104, width: 28, height: 112, fill: "rgba(255,240,200,.35)" }), S("text", { x: KUTU, y: ZEMIN - 34, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 26, fill: "rgba(90,50,15,.55)" }, "KUTU")));
    /* uyku harfleri, konuşma balonu */
    k.zz = S("g", { opacity: 0 }); svg.append(k.zz);
    ["Z", "z", "z"].forEach((t, i) => k.zz.append(S("text", { x: i * 22, y: -i * 26, "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 34 - i * 6, fill: "#CFE3FF" }, t)));
    k.balon = S("g", { opacity: 0 }); svg.append(k.balon);
    k.balon.append(S("path", { d: "M-80 -60 h160 a18 18 0 0 1 18 18 v44 a18 18 0 0 1 -18 18 h-110 l-24 22 4 -22 h-30 a18 18 0 0 1 -18 -18 v-44 a18 18 0 0 1 18 -18z", fill: "#fff", filter: "url(#ot-yumusak)" }), S("text", { x: 0, y: -12, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 40, fill: "#E5782A" }, "Miyav!"));
    /* ışık, perde kenarları, ön ışıklar, vinyet */
    k.spot = S("ellipse", { cx: EV, cy: 300, rx: 520, ry: 380, fill: "url(#ot-spot)", "pointer-events": "none" }); svg.append(k.spot);
    svg.append(S("path", { d: "M0 0 h120 q -30 160 10 300 q 30 120 -40 320 h-90z", fill: "url(#ot-perdeK)" }), S("path", { d: "M1200 0 h-120 q 30 160 -10 300 q -30 120 40 320 h90z", fill: "url(#ot-perdeK)" }), S("path", { d: "M0 0 h1200 v40 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0 q -60 30 -120 0z", fill: "#C12A36" }));
    for (let i = 0; i < 9; i++) svg.append(S("ellipse", { cx: 120 + i * 120, cy: 612, rx: 22, ry: 8, fill: "#FFE7A0", opacity: 0.9 }));
    svg.append(S("rect", { width: 1200, height: 620, fill: "url(#ot-vinyet)", "pointer-events": "none" }));
    k.parcacik = S("g", { "pointer-events": "none" }); svg.append(k.parcacik);
    return k;
  }

  function kediYap() {
    const g = S("g"), govde = S("g"), kuyruk = S("g"), bas = S("g"), on1 = S("g"), on2 = S("g"), ar1 = S("g"), ar2 = S("g");
    const bacak = (gr, x, renk) => { gr.setAttribute("transform", `translate(${x} -40)`); gr.append(S("rect", { x: -8, y: 0, width: 16, height: 42, rx: 8, fill: renk }), S("ellipse", { cx: 2, cy: 40, rx: 11, ry: 6, fill: "#FFF1DE" })); };
    bacak(ar2, -30, "#D96E24"); bacak(on2, 34, "#D96E24");
    kuyruk.setAttribute("transform", "translate(-58 -62)");
    kuyruk.append(S("path", { d: "M0 0 C -34 -6 -52 -40 -34 -82", stroke: "#E5782A", "stroke-width": 15, fill: "none", "stroke-linecap": "round" }), S("path", { d: "M-40 -52 q -4 -16 4 -30", stroke: "#FFF1DE", "stroke-width": 9, fill: "none", "stroke-linecap": "round" }));
    govde.append(S("ellipse", { cx: 0, cy: -60, rx: 66, ry: 36, fill: "url(#ot-kedi)" }), S("ellipse", { cx: 12, cy: -46, rx: 36, ry: 18, fill: "#FFF1DE" }), S("path", { d: "M-34 -92 q 6 14 0 26 M-14 -96 q 6 14 0 28 M6 -95 q 5 12 0 24", stroke: "#C9631E", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }));
    bacak(ar1, -44, "#EE8A38"); bacak(on1, 22, "#EE8A38");
    bas.setAttribute("transform", "translate(56 -98)");
    const goz = (x) => { const gg = S("g", { transform: `translate(${x} -6)` }); gg.append(S("ellipse", { rx: 9, ry: 11, fill: "#fff" }), S("circle", { cx: 2, cy: 1, r: 6, fill: "#2B1B10" }), S("circle", { cx: 4, cy: -2, r: 2.2, fill: "#fff" })); return gg; };
    const g1 = goz(2), g2 = goz(26), agiz = S("path", { d: "M14 16 q -6 6 -12 2 M14 16 q 6 6 12 2", stroke: "#5A2C12", "stroke-width": 3, fill: "none", "stroke-linecap": "round" });
    const agizA = S("ellipse", { cx: 14, cy: 20, rx: 8, ry: 0, fill: "#8C2A2A" }), dil = S("ellipse", { cx: 22, cy: 22, rx: 0, ry: 5, fill: "#F2788A" });
    bas.append(
      S("path", { d: "M-26 -20 L-30 -62 L-2 -36z", fill: "#E5782A" }), S("path", { d: "M-22 -26 L-24 -50 L-8 -36z", fill: "#F7A7B2" }),
      S("path", { d: "M8 -38 L22 -68 L32 -28z", fill: "#E5782A" }), S("path", { d: "M14 -36 L22 -56 L28 -32z", fill: "#F7A7B2" }),
      S("circle", { r: 40, fill: "url(#ot-kedi)" }), S("path", { d: "M-6 -38 q 4 10 0 18 M6 -39 q 4 9 0 17", stroke: "#C9631E", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }),
      S("ellipse", { cx: 16, cy: 12, rx: 22, ry: 14, fill: "#FFF1DE" }), g1, g2,
      S("ellipse", { cx: -8, cy: 12, rx: 7, ry: 4, fill: "#F7A7B2", opacity: 0.8 }), S("ellipse", { cx: 36, cy: 12, rx: 6, ry: 4, fill: "#F7A7B2", opacity: 0.8 }),
      S("path", { d: "M10 6 h8 l-4 5z", fill: "#E8607A" }), agizA, agiz, dil,
      S("path", { d: "M30 10 l26 -4 M30 15 l26 3 M0 10 l-22 -4 M0 15 l-22 3", stroke: "rgba(90,45,20,.45)", "stroke-width": 1.6 }));
    g.append(kuyruk, ar2, on2, govde, ar1, on1, bas);
    const d = { x: EV, y: ZEMIN, s: 1, yon: 1, sx: 1, sy: 1, rot: 0, basRot: 0, basY: 0, yuru: 0, faz: 0, goz: 1, agiz: 0, dil: 0, pati: 0, gorunur: 1, uyku: 0, kuyruk: 1 };
    let kirp = 0, zaman = 0;
    function ciz(dt) {
      zaman += dt; kirp -= dt; if (kirp < -0.12) kirp = 2 + Math.random() * 3;
      const nefes = Math.sin(zaman * 2.4) * (d.uyku ? 0.04 : 0.018);
      d.faz += dt * 11 * d.yuru;
      const ac = Math.sin(d.faz) * 28 * d.yuru;
      g.setAttribute("transform", `translate(${d.x} ${d.y}) rotate(${d.rot}) scale(${d.yon * d.s * d.sx} ${d.s * (d.sy + nefes)})`);
      g.setAttribute("opacity", d.gorunur);
      on1.setAttribute("transform", `translate(22 -40) rotate(${ac - d.pati * 70})`); on2.setAttribute("transform", `translate(34 -40) rotate(${-ac})`);
      ar1.setAttribute("transform", `translate(-44 -40) rotate(${-ac})`); ar2.setAttribute("transform", `translate(-30 -40) rotate(${ac})`);
      kuyruk.setAttribute("opacity", d.kuyruk); kuyruk.setAttribute("transform", `translate(-58 -62) rotate(${Math.sin(zaman * (d.uyku ? 1 : 3)) * (d.uyku ? 4 : 14)})`);
      bas.setAttribute("transform", `translate(56 ${-98 + d.basY + Math.abs(Math.sin(d.faz)) * -4 * d.yuru}) rotate(${d.basRot})`);
      const gz = Math.min(d.goz, kirp < 0 ? 0.1 : 1);
      g1.setAttribute("transform", `translate(2 -6) scale(1 ${Math.max(0.08, gz)})`); g2.setAttribute("transform", `translate(26 -6) scale(1 ${Math.max(0.08, gz)})`);
      agizA.setAttribute("ry", 9 * d.agiz); dil.setAttribute("rx", 7 * d.dil);
    }
    return { g, d, ciz };
  }

  T.tools["okuma-tiyatrosu"] = {
    back: "turkce", title: "Okuma tiyatrosu", icon: "text", tone: "grape", grades: [1, 2], grup: "Okuma",
    short: "Cümleyi ya da yönergeyi oku, kedi sahnede canlandırsın. Doğru yaptı mı?",
    render(host) {
      const svg = S("svg", { viewBox: "0 0 1200 620", class: "ot-sahne", role: "img", "aria-label": "Okuma tiyatrosu sahnesi" });
      const kart = h("div.ot-kart"), dugme = h("div.ot-dugme"), skorEl = h("div.ot-skor");
      host.append(h("div.ot-kap", svg, kart, h("div.ot-alt", dugme)), skorEl);
      const k = sahneKur(svg), kd = k.kedi.d;
      let seviye = 1, soru = null, mesgul = false, skor = 0, tur = 0, son = performance.now(), canli = true;
      const top = { x: TOP0, y: ZEMIN - 26, r: 0 };
      const sut = { d: 1 };
      /* sürekli çizim */
      const dongu = (zm) => {
        if (!svg.isConnected && tur > 0) { canli = false; return; }
        const dt = Math.min(0.05, (zm - son) / 1000); son = zm;
        k.kedi.ciz(dt);
        k.kediGolge.setAttribute("cx", kd.x); k.kediGolge.setAttribute("cy", kd.y > ZEMIN - 2 ? ZEMIN + 4 : (kd.x > MASA - 130 && kd.x < MASA + 130 && kd.y < MASA_UST + 10 ? MASA_UST + 2 : ZEMIN + 4)); k.kediGolge.setAttribute("opacity", kd.gorunur * (kd.y < ZEMIN - 30 && !(kd.x > MASA - 130 && kd.x < MASA + 130) ? 0.5 : 1));
        k.topG.setAttribute("transform", `translate(${top.x} ${top.y})`); k.topI.setAttribute("transform", `rotate(${top.r})`);
        k.topGolge.setAttribute("cx", top.x); k.topGolge.setAttribute("cy", ZEMIN + 2);
        k.sut.setAttribute("ry", 8 * sut.d); k.sut.setAttribute("rx", 40 * (0.6 + 0.4 * sut.d)); k.sut.setAttribute("cy", -26 + (1 - sut.d) * 12);
        k.bulutlar.forEach((b) => { b.x += b.v * dt; if (b.x > 300) b.x = -50; b.b.setAttribute("transform", `translate(${b.x} ${b.y})`); });
        if (canli) requestAnimationFrame(dongu);
      };
      requestAnimationFrame((z) => { son = z; dongu(z); });
      tur = 1;
      const tw = (ms, fn, e = io) => new Promise((res) => { const t0 = performance.now(); const ad = (z) => { const p = Math.min(1, (z - t0) / ms); fn(e(p)); if (p < 1 && canli) requestAnimationFrame(ad); else res(); }; requestAnimationFrame(ad); });
      const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
      const ses = (f, d = 0.12, tip = "triangle", v = 0.12) => { try { const c = T.sound.unlock(); if (!c) return; const o = c.createOscillator(), gg = c.createGain(); o.type = tip; o.frequency.setValueAtTime(f, c.currentTime); o.frequency.exponentialRampToValueAtTime(f * 1.6, c.currentTime + d); gg.gain.setValueAtTime(v, c.currentTime); gg.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d); o.connect(gg).connect(c.destination); o.start(); o.stop(c.currentTime + d + 0.02); } catch (e) {} };
      /* hareketler */
      async function yuru(x, hiz = 330) { const x0 = kd.x, sure = Math.abs(x - x0) / hiz * 1000; if (sure < 30) return; kd.yon = x > x0 ? 1 : -1; kd.yuru = 1; await tw(sure, (t) => (kd.x = lerp(x0, x, t)), (t) => t); kd.yuru = 0; }
      async function zipla(x, y, yuk = 170) { await tw(160, (t) => { kd.sy = 1 - 0.2 * t; kd.sx = 1 + 0.1 * t; }); ses(320, 0.25, "sine", 0.1); const x0 = kd.x, y0 = kd.y; kd.yon = x >= x0 ? 1 : -1; await tw(620, (t) => { kd.x = lerp(x0, x, t); kd.y = lerp(y0, y, t) - Math.sin(t * Math.PI) * yuk; kd.sy = 0.8 + 0.35 * Math.sin(t * Math.PI); kd.sx = 1.1 - 0.15 * Math.sin(t * Math.PI); kd.rot = Math.sin(t * Math.PI * 2) * -8 * kd.yon; }, (t) => t); kd.rot = 0; ses(140, 0.1, "square", 0.05); await tw(120, (t) => { kd.sy = 0.8 + 0.2 * t; kd.sx = 1.12 - 0.12 * t; }); kd.sy = kd.sx = 1; }
      async function oyna(a) {
        if (a === "masa") { await yuru(MASA - 230); await zipla(MASA - 10, MASA_UST); await tw(300, (t) => (kd.basRot = -12 * Math.sin(t * Math.PI))); }
        else if (a === "kutu") { await yuru(KUTU + 200); await zipla(KUTU, ZEMIN - 70, 150); kd.yon = 1; await tw(420, (t) => (kd.y = lerp(ZEMIN - 70, ZEMIN - 4, cik(t)))); for (let i = 0; i < 3; i++) await tw(120, (t) => (kd.rot = Math.sin(t * Math.PI) * 6 * (i % 2 ? 1 : -1))); kd.rot = 0; }
        else if (a === "top") { await yuru(top.x - 125); kd.yon = 1; await bekle(150); await tw(220, (t) => (kd.pati = Math.sin(t * Math.PI))); ses(500, 0.08); const x0 = top.x; await tw(900, (t) => { top.x = lerp(x0, x0 + 190, t); top.r = t * 520; top.y = ZEMIN - 26 - Math.abs(Math.sin(t * Math.PI * 2)) * 40 * (1 - t); }, cik); await yuru(top.x - 120, 420); await zipla(top.x - 45, ZEMIN, 90); await tw(220, (t) => (kd.pati = Math.sin(t * Math.PI))); }
        else if (a === "sut") { await yuru(SUT - 130); kd.yon = 1; await tw(360, (t) => { kd.basRot = 24 * t; kd.basY = 34 * t; }); for (let i = 0; i < 4; i++) { await tw(200, (t) => (kd.dil = Math.sin(t * Math.PI))); ses(900, 0.05, "sine", 0.05); sut.d = Math.max(0.15, sut.d - 0.2); } await tw(360, (t) => { kd.basRot = 24 * (1 - t); kd.basY = 34 * (1 - t); }); await tw(300, (t) => (kd.dil = Math.sin(t * Math.PI) * 0.8)); }
        else if (a === "uyku") { await yuru(HALI); await tw(500, (t) => { kd.sy = 1 - 0.28 * t; kd.sx = 1 + 0.14 * t; kd.goz = 1 - t; kd.basY = 20 * t; }); kd.uyku = 1; k.zz.setAttribute("transform", `translate(${kd.x + 60 * kd.yon} ${kd.y - 150})`); await tw(1400, (t) => { k.zz.setAttribute("opacity", Math.min(1, t * 3)); k.zz.setAttribute("transform", `translate(${kd.x + 60 * kd.yon + t * 30} ${kd.y - 150 - t * 40})`); }, (t) => t); }
        else if (a === "miyav") { await tw(260, (t) => { kd.basRot = -18 * t; kd.agiz = t; }); k.balon.setAttribute("transform", `translate(${kd.x + 80 * kd.yon} ${kd.y - 210})`); ses(620, 0.35, "sawtooth", 0.05); ses(880, 0.3, "triangle", 0.06); await tw(300, (t) => k.balon.setAttribute("opacity", t), cik); await bekle(800); await tw(260, (t) => { kd.basRot = -18 * (1 - t); kd.agiz = 1 - t; }); }
      }
      async function sifirla(ani = true) {
        if (ani) await tw(250, (t) => (kd.gorunur = 1 - t));
        Object.assign(kd, { x: EV, y: ZEMIN, yon: 1, sx: 1, sy: 1, rot: 0, basRot: 0, basY: 0, yuru: 0, goz: 1, agiz: 0, dil: 0, pati: 0, uyku: 0, kuyruk: 1 });
        Object.assign(top, { x: TOP0, y: ZEMIN - 26, r: 0 }); sut.d = 1; k.zz.setAttribute("opacity", 0); k.balon.setAttribute("opacity", 0);
        if (ani) await tw(250, (t) => (kd.gorunur = t)); else kd.gorunur = 1;
      }
      async function sevin() { for (let i = 0; i < 2; i++) await zipla(kd.x, kd.y, 70); await tw(300, (t) => (kd.agiz = Math.sin(t * Math.PI) * 0.6)); }
      async function uzul() { await tw(400, (t) => { kd.basY = 16 * t; kd.basRot = 14 * t; }); await bekle(500); await tw(300, (t) => { kd.basY = 16 * (1 - t); kd.basRot = 14 * (1 - t); }); }
      const yildiz = (x, y) => { for (let i = 0; i < 14; i++) { const p = S("path", { d: "M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3z", fill: ["#FFD84A", "#FF8FA3", "#8FE3FF", "#B5F28A"][i % 4] }); k.parcacik.append(p); const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 160; tw(900, (t) => { p.setAttribute("transform", `translate(${x + Math.cos(a) * v * t} ${y + Math.sin(a) * v * t + 200 * t * t}) rotate(${t * 360}) scale(${1 - t * 0.6})`); p.setAttribute("opacity", 1 - t); }, (t) => t).then(() => p.remove()); } };
      /* akış */
      function yeniSoru() {
        if (seviye === 1) { const a = T.pick(Object.keys(EYLEM)); soru = { cumle: EYLEM[a].cumle, dogru: [a] }; }
        else { const [a, b] = T.pick(IKILI); soru = { cumle: iki(a, b), dogru: [a, b] }; }
        const yanlis = Math.random() < 0.45;
        if (!yanlis) soru.oyun = soru.dogru.slice();
        else if (soru.dogru.length === 2 && Math.random() < 0.5) soru.oyun = soru.dogru.slice().reverse();
        else { soru.oyun = soru.dogru.slice(); const i = T.rand(0, soru.oyun.length - 1); soru.oyun[i] = T.pick(Object.keys(EYLEM).filter((x) => !soru.dogru.includes(x))); }
        soru.dogruMu = soru.oyun.join() === soru.dogru.join();
        ciz("oku");
      }
      function ciz(asama, sonuc) {
        kart.replaceChildren(h("div.ot-cumle", soru.cumle));
        const b = (cls, ic, fn, lbl) => h("button.ot-b." + cls, { onclick: fn }, ic ? T.icon(ic) : null, lbl);
        if (asama === "oku") dugme.replaceChildren(b("dinle", "speaker", () => T.speak(soru.cumle), "Dinle"), b("oyna", "next", oynat, "Hadi kedi, oyna!"));
        else if (asama === "oynuyor") dugme.replaceChildren(h("div.ot-not", "Kedi rolünü oynuyor, dikkatle izleyin..."));
        else if (asama === "karar") dugme.replaceChildren(h("div.ot-soru", "Kedi rolünü doğru yaptı mı?"), b("evet", "check", () => karar(true), "Rolünü doğru yaptı"), b("hayir", "close", () => karar(false), "Rolünü yanlış yaptı"));
        else if (asama === "sonuc") dugme.replaceChildren(h("div.ot-sonuc" + (sonuc ? ".iyi" : ""), sonuc ? "Harika! Dikkatli okudunuz." : soru.dogruMu ? "Aslında kedi rolünü doğru yaptı. Cümleyi bir daha okuyalım." : "Kedi rolünü yanlış yaptı. Cümle neyi anlatıyordu, bir daha okuyalım."), soru.dogruMu ? null : b("dinle", "eye", dogrusunuGoster, "Doğrusunu göster"), b("oyna", "next", async () => { await sifirla(); yeniSoru(); }, "Yeni cümle"));
        skorEl.replaceChildren(h("span", "Seviye"), h("div.seg", [[1, "Tek cümle"], [2, "İki olay"]].map(([v, l]) => h("button", { "aria-pressed": String(seviye === v), onclick: async () => { if (mesgul) return; seviye = v; await sifirla(); yeniSoru(); } }, l))), h("b.ot-puan", "⭐ " + String(skor)));
      }
      async function oynat() { if (mesgul) return; mesgul = true; T.sound.unlock(); ciz("oynuyor"); await sifirla(false); await bekle(300); for (const a of soru.oyun) { await oyna(a); await bekle(500); } mesgul = false; ciz("karar"); }
      async function karar(dediDogru) {
        if (mesgul) return; mesgul = true;
        const iyi = dediDogru === soru.dogruMu;
        if (iyi) { skor++; T.sound.ok(); yildiz(kd.x, kd.y - 140); ciz("sonuc", true); await sevin(); }
        else { T.sound.no(); ciz("sonuc", false); await uzul(); }
        mesgul = false;
      }
      async function dogrusunuGoster() { if (mesgul) return; mesgul = true; await sifirla(); for (const a of soru.dogru) { await oyna(a); await bekle(500); } await sevin(); mesgul = false; }
      sifirla(false); yeniSoru();
    },
  };
})();
