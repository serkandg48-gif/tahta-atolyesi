/* Ponpon: oyunların rehber karakteri. Yuvarlak, tüylü, mor bir arkadaş; tamamen bu siteye özgü çizim.
   T.ponpon(x, y, ops) -> { govde, eller } iki SVG <g>. Eller ayrı döner ki ipin önüne çizilip onu kavrasın.
   ops.kollar = [[x,y],[x,y]] ellerin sahnedeki yeri; ops.yuz = "gulen" | "dusunen" | "sasirmis"; ops.bak = [dx, dy] bakış. */
(function () {
  const S = T.svg;
  /* sabit tohumlu rastgele: her çizimde aynı tüyler */
  const tohum = (n) => () => ((n = (n * 16807) % 2147483647) / 2147483647);
  T.PONPON_DEFS = `<defs>
    <radialGradient id="pp-govde" cx="38%" cy="30%" r="78%"><stop offset="0" stop-color="#e6d2ff"/><stop offset=".35" stop-color="#b58bf0"/><stop offset=".75" stop-color="#8457cf"/><stop offset="1" stop-color="#5b3299"/></radialGradient>
    <radialGradient id="pp-karin" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#f3e9ff"/><stop offset="1" stop-color="#f3e9ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="pp-kol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7a3f7"/><stop offset=".6" stop-color="#9467da"/><stop offset="1" stop-color="#6a3fb0"/></linearGradient>
    <radialGradient id="pp-el" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#dcc3ff"/><stop offset=".6" stop-color="#a57be6"/><stop offset="1" stop-color="#7244c0"/></radialGradient>
    <radialGradient id="pp-goz" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".8" stop-color="#f1ecfb"/><stop offset="1" stop-color="#cfc3e8"/></radialGradient>
    <radialGradient id="pp-bebek" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#5a3d8f"/><stop offset=".5" stop-color="#2a1748"/><stop offset="1" stop-color="#120a22"/></radialGradient>
    <radialGradient id="pp-boynuz" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="#fff3d6"/><stop offset="1" stop-color="#e3b979"/></radialGradient>
    <filter id="pp-tuy" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="g"/><feDisplacementMap in="SourceGraphic" in2="g" scale="11" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="pp-tuy-ince" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="9" result="g"/><feDisplacementMap in="SourceGraphic" in2="g" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="pp-yumusak"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="pp-golge" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#3b2160" flood-opacity=".28"/></filter>
    <linearGradient id="bn-duvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdeedd"/><stop offset="1" stop-color="#f6d9bd"/></linearGradient>
    <linearGradient id="bn-masa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d99a63"/><stop offset="1" stop-color="#b9774a"/></linearGradient>
    <radialGradient id="bn-a" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#1f6fd1"/></radialGradient>
    <radialGradient id="bn-b" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="#e5781f"/></radialGradient>
    <radialGradient id="bn-c" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#9ff0b1"/><stop offset="1" stop-color="#2a9d55"/></radialGradient>
    <radialGradient id="bn-d" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffb3c8"/><stop offset="1" stop-color="#d9416e"/></radialGradient>
    <radialGradient id="bn-e" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#e6ccff"/><stop offset="1" stop-color="#8a55d4"/></radialGradient>
  </defs>`;
  /* tüy tutamları: bir alanın içinde dışa doğru kısa, kıvrık çizgiler */
  function tuyler(g, cx, cy, R, n, rnd, renkler, kalin) {
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * R, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      const yon = a + (rnd() - 0.5) * 0.9, l = 8 + rnd() * 12, kv = (rnd() - 0.5) * 8;
      const x2 = x + Math.cos(yon) * l, y2 = y + Math.sin(yon) * l + 2;
      g.append(S("path", { d: `M${x.toFixed(1)} ${y.toFixed(1)} q${(Math.cos(yon) * l / 2 - Math.sin(yon) * kv).toFixed(1)} ${(Math.sin(yon) * l / 2 + Math.cos(yon) * kv).toFixed(1)} ${(x2 - x).toFixed(1)} ${(y2 - y).toFixed(1)}`,
        stroke: renkler[Math.floor(rnd() * renkler.length)], "stroke-width": kalin * (0.6 + rnd() * 0.7), fill: "none", "stroke-linecap": "round", opacity: 0.35 + rnd() * 0.4 }));
    }
  }
  /* el: avuç, ipi saran üç parmak ve başparmak; sol el için ayna */
  function el(x, y, sag) {
    const g = S("g", { transform: `translate(${x} ${y}) scale(${sag ? -1 : 1} 1)` });
    g.append(S("ellipse", { cx: -14, cy: -4, rx: 24, ry: 21, fill: "url(#pp-el)", stroke: "#5b3299", "stroke-width": 2.5, filter: "url(#pp-tuy-ince)" }));
    g.append(S("path", { d: "M-20 -22 q-6 -14 6 -18 q10 -2 10 12 q2 8 -6 12Z", fill: "url(#pp-el)", stroke: "#5b3299", "stroke-width": 2.5 }));
    [[-4, -14], [2, -2], [-2, 10]].forEach(([fx, fy], i) => {
      g.append(S("path", { d: `M${fx - 10} ${fy - 6} q20 -6 22 6 q0 10 -14 9 q-8 -1 -8 -9Z`, fill: "url(#pp-el)", stroke: "#5b3299", "stroke-width": 2.5 }));
      g.append(S("path", { d: `M${fx + 4} ${fy - 3} q4 2 4 6`, stroke: "#fff", "stroke-width": 2, fill: "none", "stroke-linecap": "round", opacity: .6 }));
    });
    return g;
  }
  T.ponpon = function (x, y, ops = {}) {
    const rnd = tohum(7);
    const govde = S("g", { class: "ponpon", transform: `translate(${x} ${y})` });
    const R = 96;
    /* yer gölgesi */
    govde.append(S("ellipse", { cx: 0, cy: R + 8, rx: R * 0.9, ry: 14, fill: "#3b2160", opacity: .16, filter: "url(#pp-yumusak)" }));
    /* kollar: tüylü, uca doğru incelen */
    const eller = S("g", { class: "ponpon-eller" });
    (ops.kollar || [[x - 170, y + 40], [x + 170, y + 40]]).forEach(([hx, hy], i) => {
      const ex = hx - x, ey = hy - y, sx = (i ? 1 : -1) * 72, sy = 24, mx = (sx + ex) / 2, my = Math.max(sy, ey) + 30;
      const kol = S("g", { filter: "url(#pp-tuy)" });
      kol.append(S("path", { d: `M${sx} ${sy} Q${mx} ${my} ${ex + (i ? -16 : 16)} ${ey}`, fill: "none", stroke: "url(#pp-kol)", "stroke-width": 34, "stroke-linecap": "round" }));
      govde.append(kol);
      eller.append(el(hx, hy, i === 1));
    });
    /* boynuzlar */
    [-1, 1].forEach((s) => govde.append(S("path", { d: `M${s * 30} ${-R + 30} C${s * 30} ${-R - 10} ${s * 52} ${-R - 40} ${s * 72} ${-R - 46} C${s * 66} ${-R - 20} ${s * 70} ${-R + 4} ${s * 66} ${-R + 30}Z`, fill: "url(#pp-boynuz)", stroke: "#b88a4a", "stroke-width": 3 })));
    /* gövde: tüylü kenar (gürültüyle bozulmuş daire) ve 3B ışık */
    const gg = S("g", { filter: "url(#pp-golge)" });
    const kenar = S("g", { filter: "url(#pp-tuy)" });
    kenar.append(S("circle", { r: R + 6, fill: "#6a3fb0" }), S("circle", { r: R, fill: "url(#pp-govde)" }));
    gg.append(kenar);
    gg.append(S("ellipse", { cx: 0, cy: 34, rx: 58, ry: 46, fill: "url(#pp-karin)" }));
    /* yüzeydeki tüy dokusu */
    const doku = S("g", { filter: "url(#pp-tuy-ince)" }); tuyler(doku, 0, 0, R - 6, 260, rnd, ["#f0e3ff", "#d2b6fa", "#7d50c6", "#5f3399"], 2.2); gg.append(doku);
    /* tepe tutamı */
    const tepe = S("g", { filter: "url(#pp-tuy-ince)" });
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.16; tepe.append(S("path", { d: `M${Math.cos(a) * (R - 12)} ${Math.sin(a) * (R - 12)} q${Math.cos(a) * 18 + (i - 4) * 3} ${-20} ${Math.cos(a) * 30 + (i - 4) * 4} ${-26 - (i % 3) * 6}`, stroke: i % 2 ? "#c7a3f7" : "#9a6de0", "stroke-width": 7, fill: "none", "stroke-linecap": "round" })); }
    gg.append(tepe);
    /* ışık: sol üstte yumuşak parlama, sağ kenarda ince ışık */
    gg.append(S("ellipse", { cx: -34, cy: -46, rx: 36, ry: 24, fill: "#fff", opacity: .28, filter: "url(#pp-yumusak)" }));
    gg.append(S("path", { d: `M${R * 0.72} ${-R * 0.5} A${R} ${R} 0 0 1 ${R * 0.62} ${R * 0.74}`, stroke: "#f1e6ff", "stroke-width": 6, fill: "none", opacity: .45, filter: "url(#pp-yumusak)" }));
    govde.append(gg);
    /* yüz */
    const yuz = ops.yuz || "gulen", bak = ops.bak || [3, 6];
    [-33, 33].forEach((ex, i) => {
      govde.append(S("ellipse", { cx: ex + 2, cy: -12, rx: 29, ry: 33, fill: "#3b2160", opacity: .25, filter: "url(#pp-yumusak)" }));
      govde.append(S("ellipse", { cx: ex, cy: -18, rx: 27, ry: 32, fill: "url(#pp-goz)", stroke: "#3b2160", "stroke-width": 3 }));
      govde.append(S("circle", { cx: ex + bak[0], cy: -14 + bak[1], r: 14, fill: "url(#pp-bebek)", class: "pp-gozbebek" }));
      govde.append(S("circle", { cx: ex + bak[0] - 5, cy: -20 + bak[1], r: 5, fill: "#fff" }), S("circle", { cx: ex + bak[0] + 5, cy: -8 + bak[1], r: 2.2, fill: "#fff", opacity: .8 }));
      govde.append(S("path", { d: `M${ex - 26} ${-30} q26 -26 52 0`, fill: "none", stroke: "#5b3299", "stroke-width": 4, "stroke-linecap": "round", opacity: .5 }));
      if (yuz === "dusunen") govde.append(S("path", { d: `M${ex - 22} ${-62 + (i ? 4 : -2)} q22 ${i ? -10 : -14} 44 ${i ? -6 : 2}`, fill: "none", stroke: "#3b2160", "stroke-width": 6, "stroke-linecap": "round" }));
    });
    govde.append(S("ellipse", { cx: -60, cy: 20, rx: 15, ry: 9, fill: "#ff7aa6", opacity: .45, filter: "url(#pp-yumusak)" }), S("ellipse", { cx: 60, cy: 20, rx: 15, ry: 9, fill: "#ff7aa6", opacity: .45, filter: "url(#pp-yumusak)" }));
    if (yuz === "sasirmis") govde.append(S("ellipse", { cx: 0, cy: 36, rx: 14, ry: 17, fill: "#3d1530" }));
    else if (yuz === "dusunen") govde.append(S("path", { d: "M-16 36 q16 -6 32 2", fill: "none", stroke: "#3d1530", "stroke-width": 5, "stroke-linecap": "round" }));
    else {
      govde.append(S("path", { d: "M-32 22 q32 40 64 0 q-32 12 -64 0Z", fill: "#3d1530" }));
      govde.append(S("path", { d: "M-9 26 h16 v10 a3 3 0 0 1 -3 3 h-10 a3 3 0 0 1 -3 -3Z", fill: "#fff" }));
      govde.append(S("path", { d: "M-15 44 q15 12 30 0 q-15 -6 -30 0Z", fill: "#ff7a9c" }));
    }
    return { govde, eller };
  };
})();
