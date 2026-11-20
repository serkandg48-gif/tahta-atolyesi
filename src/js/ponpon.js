/* Ponpon: oyunların rehber karakteri. Yuvarlak, tüylü, mor bir arkadaş. Tamamen bu siteye özgü çizim.
   T.ponpon(x, y, ops) bir SVG <g> döndürür; ops.kollar = [[x,y],[x,y]] elleri o noktalara uzatır, ops.yuz = "gulen" | "dusunen" | "sasirmis". */
(function () {
  const S = T.svg;
  const tuy = (cx, cy, r, n, d) => { let p = ""; for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2, a2 = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, kx = cx + Math.cos(a2) * (r + d), ky = cy + Math.sin(a2) * (r + d);
    p += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ""; if (i < n) { const nx = cx + Math.cos(((i + 1) / n) * Math.PI * 2 - Math.PI / 2) * r, ny = cy + Math.sin(((i + 1) / n) * Math.PI * 2 - Math.PI / 2) * r; p += `Q${kx.toFixed(1)} ${ky.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`; } }
    return p + "Z"; };
  T.PONPON_DEFS = `<defs>
    <radialGradient id="pp-govde" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#d9bcff"/><stop offset=".55" stop-color="#a97de6"/><stop offset="1" stop-color="#7a4fc0"/></radialGradient>
    <radialGradient id="pp-kol" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#c9a6f7"/><stop offset="1" stop-color="#8459cc"/></radialGradient>
    <radialGradient id="pp-goz" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e9e4f5"/></radialGradient>
    <linearGradient id="bn-duvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdeedd"/><stop offset="1" stop-color="#f6d9bd"/></linearGradient>
    <linearGradient id="bn-masa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d99a63"/><stop offset="1" stop-color="#b9774a"/></linearGradient>
    <radialGradient id="bn-a" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#1f6fd1"/></radialGradient>
    <radialGradient id="bn-b" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="#e5781f"/></radialGradient>
    <radialGradient id="bn-c" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#9ff0b1"/><stop offset="1" stop-color="#2a9d55"/></radialGradient>
    <radialGradient id="bn-d" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffb3c8"/><stop offset="1" stop-color="#d9416e"/></radialGradient>
    <radialGradient id="bn-e" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#e6ccff"/><stop offset="1" stop-color="#8a55d4"/></radialGradient>
    <filter id="pp-golge" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#5a3a1a" flood-opacity=".22"/></filter>
  </defs>`;
  T.ponpon = function (x, y, ops = {}) {
    const g = S("g", { class: "ponpon", transform: `translate(${x} ${y})`, filter: "url(#pp-golge)" });
    const R = 92;
    /* kollar gövdenin arkasında başlar */
    (ops.kollar || [[-150, 40], [150, 40]]).forEach(([hx, hy], i) => {
      const ex = hx - x, ey = hy - y, sx = (i ? 1 : -1) * 70, sy = 26;
      const mx = (sx + ex) / 2, my = Math.max(sy, ey) + 26;
      g.append(S("path", { d: `M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}`, fill: "none", stroke: "url(#pp-kol)", "stroke-width": 26, "stroke-linecap": "round" }));
      g.append(S("circle", { cx: ex, cy: ey, r: 19, fill: "#b48ae9", stroke: "#7a4fc0", "stroke-width": 3 }));
      g.append(S("path", { d: `M${ex - 8} ${ey - 14} q-6 10 2 22`, fill: "none", stroke: "#8a5fd1", "stroke-width": 3, "stroke-linecap": "round", opacity: .6 }));
    });
    /* gövde: tüylü kenar, iki tutam kulak, tepe tutamı */
    g.append(S("path", { d: "M-58 -70 q-30 -46 -6 -78 q14 30 40 52Z", fill: "#9b6fe0" }));
    g.append(S("path", { d: "M58 -70 q30 -46 6 -78 q-14 30 -40 52Z", fill: "#9b6fe0" }));
    g.append(S("path", { d: tuy(0, 0, R, 30, 9), fill: "url(#pp-govde)", stroke: "#6d43b3", "stroke-width": 3, "stroke-linejoin": "round" }));
    g.append(S("path", { d: "M-10 -96 q4 -26 22 -30 q-6 14 4 30 q-12 -6 -26 0Z", fill: "#c4a0f5", stroke: "#6d43b3", "stroke-width": 2.5 }));
    g.append(S("ellipse", { cx: 0, cy: 36, rx: 54, ry: 40, fill: "#e7d6ff", opacity: .55 }));
    /* yüz */
    const yuz = ops.yuz || "gulen";
    [-32, 32].forEach((ex, i) => {
      g.append(S("ellipse", { cx: ex, cy: -18, rx: 26, ry: 30, fill: "url(#pp-goz)", stroke: "#4a2a85", "stroke-width": 3 }));
      const bak = ops.bak || [4, 6];
      g.append(S("circle", { cx: ex + bak[0], cy: -14 + bak[1], r: 13, fill: "#2b1a4a", class: "pp-gozbebek" }));
      g.append(S("circle", { cx: ex + bak[0] - 4, cy: -19 + bak[1], r: 4.5, fill: "#fff" }));
      if (yuz === "dusunen") g.append(S("path", { d: `M${ex - 22} ${-56 + (i ? 4 : -2)} q22 ${i ? -10 : -14} 44 ${i ? -6 : 2}`, fill: "none", stroke: "#4a2a85", "stroke-width": 5, "stroke-linecap": "round" }));
    });
    g.append(S("ellipse", { cx: -58, cy: 18, rx: 13, ry: 8, fill: "#ff8fb1", opacity: .55 }), S("ellipse", { cx: 58, cy: 18, rx: 13, ry: 8, fill: "#ff8fb1", opacity: .55 }));
    if (yuz === "sasirmis") g.append(S("ellipse", { cx: 0, cy: 34, rx: 14, ry: 17, fill: "#4a1f3a" }));
    else if (yuz === "dusunen") g.append(S("path", { d: "M-16 34 q16 -6 32 2", fill: "none", stroke: "#4a1f3a", "stroke-width": 5, "stroke-linecap": "round" }));
    else { g.append(S("path", { d: "M-30 22 q30 34 60 0 q-30 12 -60 0Z", fill: "#4a1f3a" })); g.append(S("path", { d: "M-8 26 h14 v9 a3 3 0 0 1 -3 3 h-8 a3 3 0 0 1 -3 -3Z", fill: "#fff" })); g.append(S("path", { d: "M-14 40 q14 10 28 0", fill: "#ff7a9c" })); }
    return g;
  };
})();
