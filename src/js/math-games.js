/* Matematik oyunları: Tang Math'teki konu ve mekaniklerle özgün, Türkçe oyunlar.
   Her oyun bir tur üreticidir; ortak kabuk puanı, düzeyi, iki takım modunu ve geri bildirimi yönetir. */
(function () {
  const { h } = T; const S = T.svg;
  const R = T.rand, P = T.pick;
  const GAMES = (T.games = {});
  const game = (id, def) => { GAMES[id] = def; T.tools["oyun-" + id] = { cat: "oyun", title: def.title, icon: def.icon || "star", tone: def.tone || "sun", grades: def.grades, short: def.short, render: (host) => shell(host, id) }; };

  /* ---------- Çizim yardımcıları ---------- */
  const box = (vb, ...k) => S("svg", { viewBox: vb, style: "width:100%;height:100%;max-height:var(--stage-h)" }, ...k);
  const txt = (x, y, t, size = 40, col = "#2a2a2a", extra = {}) => S("text", Object.assign({ x, y, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": size, fill: col }, extra), t);
  function tenFrame(n, x0 = 0, y0 = 0, c1 = "#ef5b3b", n2 = 0, c2 = "#2e9bd6", cells = 10) {
    const g = S("g", { transform: `translate(${x0},${y0})` }), cw = 70, cols = 5, rows = cells / 5;
    for (let i = 0; i < cells; i++) {
      const x = (i % cols) * cw, y = Math.floor(i / cols) * cw;
      g.append(S("rect", { x, y, width: cw, height: cw, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 4 }));
      if (i < n) g.append(S("circle", { cx: x + cw / 2, cy: y + cw / 2, r: 25, fill: c1, stroke: "#2a2a2a", "stroke-width": 3 }));
      else if (i < n + n2) g.append(S("circle", { cx: x + cw / 2, cy: y + cw / 2, r: 25, fill: c2, stroke: "#2a2a2a", "stroke-width": 3 }));
    }
    return g;
  }
  const EMO = ["🍎", "⭐", "🐟", "🌼", "🎈", "🍓", "🐞", "🍪", "🚗", "🐥"];
  function objects(n, emo = P(EMO), perRow = 5, size = 64) {
    const rows = Math.ceil(n / perRow), w = perRow * size * 1.2, hh = rows * size * 1.2;
    const s = box(`0 0 ${w} ${Math.max(hh, size * 1.2)}`);
    for (let i = 0; i < n; i++) s.append(S("text", { x: (i % perRow) * size * 1.2 + size * 0.6, y: Math.floor(i / perRow) * size * 1.2 + size * 0.62, "text-anchor": "middle", "dominant-baseline": "central", "font-size": size }, emo));
    return s;
  }
  function dots(n, scatter = true) {
    const s = box("0 0 400 300"), pts = [];
    let tries = 0;
    while (pts.length < n && tries++ < 2000) { const p = [R(40, 360), R(40, 260)]; if (pts.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 62)) pts.push(p); }
    pts.forEach(([x, y]) => s.append(S("circle", { cx: x, cy: y, r: 24, fill: "#2a2a2a" })));
    return s;
  }
  function blocks(n) {
    const H = Math.floor(n / 100), Tn = Math.floor((n % 100) / 10), O = n % 10, U = 14;
    const w = H * (U * 10 + 14) + Tn * (U + 8) + Math.ceil(O / 5) * (U + 6) + 40;
    const s = box(`0 0 ${Math.max(w, 300)} ${U * 10 + 20}`); let x = 10;
    const cube = (cx, cy) => S("rect", { x: cx, y: cy, width: U, height: U, fill: "#8fd0f5", stroke: "#164e7a", "stroke-width": 1.5 });
    for (let i = 0; i < H; i++) { for (let a = 0; a < 10; a++) for (let b = 0; b < 10; b++) s.append(cube(x + a * U, 10 + b * U)); x += U * 10 + 14; }
    for (let i = 0; i < Tn; i++) { for (let b = 0; b < 10; b++) s.append(cube(x, 10 + b * U)); x += U + 8; }
    for (let i = 0; i < O; i++) s.append(cube(x + Math.floor(i / 5) * (U + 6), 10 + U * 9 - (i % 5) * (U + 4)));
    return s;
  }
  function bond(whole, a, b) {
    const s = box("0 0 500 340");
    const c = (x, y, v, col) => S("g", {}, S("circle", { cx: x, cy: y, r: 62, fill: v === "?" ? "#fff" : col, stroke: "#2a2a2a", "stroke-width": 5, "stroke-dasharray": v === "?" ? "10 8" : "none" }), txt(x, y + 2, v, 52));
    s.append(S("path", { d: "M250 100L130 240M250 100L370 240", stroke: "#2a2a2a", "stroke-width": 5 }));
    s.append(c(250, 82, whole, "#ffc233"), c(130, 250, a, "#8fd0f5"), c(370, 250, b, "#8fd0f5"));
    return s;
  }
  function clock(hh, mm) {
    const s = box("0 0 300 300");
    s.append(S("circle", { cx: 150, cy: 150, r: 140, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 8 }));
    for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6; s.append(txt(150 + 108 * Math.sin(a), 152 - 108 * Math.cos(a), i, 30)); }
    for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30, r1 = i % 5 ? 132 : 124; s.append(S("line", { x1: 150 + r1 * Math.sin(a), y1: 150 - r1 * Math.cos(a), x2: 150 + 138 * Math.sin(a), y2: 150 - 138 * Math.cos(a), stroke: "#2a2a2a", "stroke-width": i % 5 ? 1.5 : 4 })); }
    const ha = (((hh % 12) + mm / 60) * Math.PI) / 6, ma = (mm * Math.PI) / 30;
    s.append(S("line", { x1: 150, y1: 150, x2: 150 + 70 * Math.sin(ha), y2: 150 - 70 * Math.cos(ha), stroke: "#ef5b3b", "stroke-width": 11, "stroke-linecap": "round" }));
    s.append(S("line", { x1: 150, y1: 150, x2: 150 + 112 * Math.sin(ma), y2: 150 - 112 * Math.cos(ma), stroke: "#2e9bd6", "stroke-width": 7, "stroke-linecap": "round" }));
    s.append(S("circle", { cx: 150, cy: 150, r: 9, fill: "#2a2a2a" }));
    return s;
  }
  function numLine(a, b, step, mark, labels = true) {
    const s = box("0 0 900 200"), X = (v) => 60 + ((v - a) / (b - a)) * 780;
    s.append(S("line", { x1: 30, y1: 110, x2: 870, y2: 110, stroke: "#2a2a2a", "stroke-width": 5 }));
    const n = Math.round((b - a) / step);
    for (let i = 0; i <= n; i++) { const v = a + i * step, major = n <= 10 || i % 5 === 0; s.append(S("line", { x1: X(v), y1: major ? 92 : 100, x2: X(v), y2: major ? 128 : 120, stroke: "#2a2a2a", "stroke-width": major ? 4 : 2 })); if (labels && (i === 0 || i === n || (major && n <= 20))) s.append(txt(X(v), 160, T.fmt(v), 26)); }
    if (mark != null) s.append(S("path", { d: `M${X(mark)} 100l-16-40h32z`, fill: "#ef5b3b", stroke: "#2a2a2a", "stroke-width": 3 }));
    return s;
  }
  function fracShape(n, k, kind = "circle") {
    const s = box("0 0 300 300");
    if (kind === "circle") for (let i = 0; i < n; i++) { const a1 = (i / n) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2; s.append(S("path", { d: n === 1 ? "M150 20a130 130 0 1 1 -0.1 0z" : `M150 150L${150 + 130 * Math.cos(a1)} ${150 + 130 * Math.sin(a1)}A130 130 0 0 1 ${150 + 130 * Math.cos(a2)} ${150 + 130 * Math.sin(a2)}Z`, fill: i < k ? "#f27ba9" : "#fff", stroke: "#2a2a2a", "stroke-width": 4 })); }
    else for (let i = 0; i < n; i++) s.append(S("rect", { x: 20 + (i * 260) / n, y: 90, width: 260 / n, height: 120, fill: i < k ? "#ffc233" : "#fff", stroke: "#2a2a2a", "stroke-width": 4 }));
    return s;
  }
  function grid(w, hh) {
    const U = Math.min(50, 520 / Math.max(w, hh)), s = box(`0 0 ${w * U + 80} ${hh * U + 60}`);
    for (let i = 0; i < w; i++) for (let j = 0; j < hh; j++) s.append(S("rect", { x: 40 + i * U, y: 20 + j * U, width: U, height: U, fill: "#ffd9cf", stroke: "#e2473b", "stroke-width": 1.5 }));
    s.append(S("rect", { x: 40, y: 20, width: w * U, height: hh * U, fill: "none", stroke: "#2a2a2a", "stroke-width": 4 }));
    return s;
  }
  function prism(l, w, hh) {
    const U = 34, dx = U * 0.6, dy = U * 0.4, s = box(`0 0 ${l * U + w * dx + 60} ${hh * U + w * dy + 60}`), ox = 30, oy = 30 + w * dy;
    const face = (pts, col) => s.append(S("polygon", { points: pts.map((p) => p.join(",")).join(" "), fill: col, stroke: "#164e7a", "stroke-width": 1.5 }));
    for (let z = 0; z < hh; z++) for (let x = 0; x < l; x++) face([[ox + x * U, oy + (hh - z - 1) * U], [ox + (x + 1) * U, oy + (hh - z - 1) * U], [ox + (x + 1) * U, oy + (hh - z) * U], [ox + x * U, oy + (hh - z) * U]], "#8fd0f5");
    for (let y = 0; y < w; y++) for (let x = 0; x < l; x++) { const bx = ox + x * U + y * dx, by = oy - y * dy; face([[bx, by], [bx + U, by], [bx + U + dx, by - dy], [bx + dx, by - dy]], "#c3e6fa"); }
    for (let y = 0; y < w; y++) for (let z = 0; z < hh; z++) { const bx = ox + l * U + y * dx, by = oy + (hh - z) * U - y * dy; face([[bx, by], [bx + dx, by - dy], [bx + dx, by - dy - U], [bx, by - U]], "#5fb3e6"); }
    return s;
  }
  function picto(data, emo) {
    const s = box(`0 0 620 ${data.length * 80 + 20}`);
    data.forEach(([lab, v], i) => { s.append(S("text", { x: 130, y: 50 + i * 80, "text-anchor": "end", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 24 }, lab)); for (let k = 0; k < v; k++) s.append(S("text", { x: 170 + k * 52, y: 52 + i * 80, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 42 }, emo[i])); });
    return s;
  }
  const nearOpts = (ans, n = 4, spread = 3, min = 0) => { const o = new Set([ans]); let t = 0; while (o.size < n && t++ < 200) { const v = ans + R(-spread, spread); if (v >= min && v !== ans) o.add(v); } return T.shuffle([...o]); };
  const q = (prompt, visual, answer, options, explain) => ({ prompt, visual, answer, options: options || nearOpts(answer), explain });

  /* ===================== OYUNLAR ===================== */
  game("esini-bul", { title: "Eşini bul", icon: "dots", tone: "grape", grades: [1, 2], short: "Miktarı sayıyla eşleştir",
    round(L) { const max = [5, 10, 20][L]; const n = R(1, max); const k = P(L === 2 ? ["cerceve2", "nesne"] : ["cerceve", "nesne", "nokta"]);
      const v = k === "nokta" ? dots(n) : k === "nesne" ? objects(n, P(EMO), 5) : (() => { const s = box("0 0 760 300"); s.append(tenFrame(Math.min(n, 10), 20, 80)); if (n > 10 || k === "cerceve2") s.append(tenFrame(Math.max(0, n - 10), 400, 80)); return s; })();
      return q("Kaç tane?", v, n, nearOpts(n, 4, 3, 0), "Beşerli gruplara bakmak saymayı hızlandırır."); } });

  game("hizli-gor", { title: "Hızlı gör yarışı", icon: "speed", tone: "tomato", grades: [1, 2], short: "Çerçeveye bir an bak, sayıyı bul", flash: 1400,
    round(L) { if (L < 2) { const n = R(1, L ? 10 : 5); const s = box("0 0 380 160"); s.append(tenFrame(n, 15, 10)); return q("Kaç pul gördün?", s, n, nearOpts(n, 4, 2, 0), "5'ten fazla mı az mı? Önce üst sıraya bak."); }
      const a = R(3, 9), b = R(2, 9); const s = box("0 0 760 160"); s.append(tenFrame(a, 15, 10), tenFrame(b, 395, 10, "#2e9bd6")); return q("İkisi birlikte kaç?", s, a + b, nearOpts(a + b, 4, 3, 0), `${a} + ${b} = ${a + b}. 10'u tamamlayıp kalanı eklemek işe yarar.`); } });

  game("tirtil", { title: "Tırtıl sayıyor", icon: "line", tone: "leaf", grades: [1, 3], short: "İleri, geri ve ritmik sayma",
    round(L) { const step = [1, P([1, -1]), P([2, 5, 10, -1, -2])][L]; const start = step > 0 ? R(0, L ? 60 : 12) : R(12, L ? 90 : 20); const seq = Array.from({ length: 6 }, (_, i) => start + i * step); const miss = R(1, 4);
      const s = box("0 0 980 200");
      seq.forEach((v, i) => { const x = 90 + i * 150; s.append(S("circle", { cx: x, cy: 110, r: 66, fill: i % 2 ? "#9dd67a" : "#6cc04a", stroke: "#2a2a2a", "stroke-width": 4 })); s.append(txt(x, 112, i === miss ? "?" : v, 48)); });
      s.append(S("circle", { cx: 900, cy: 100, r: 60, fill: "#ffc233", stroke: "#2a2a2a", "stroke-width": 4 }), S("circle", { cx: 885, cy: 85, r: 8, fill: "#2a2a2a" }), S("circle", { cx: 920, cy: 85, r: 8, fill: "#2a2a2a" }), S("path", { d: "M880 115q20 16 40 0", stroke: "#2a2a2a", "stroke-width": 5, fill: "none" }));
      return q(step < 0 ? "Geriye doğru sayıyoruz. Eksik sayı kaç?" : "Eksik sayı kaç?", s, seq[miss], nearOpts(seq[miss], 4, Math.max(2, Math.abs(step)), 0), `Kural: her adımda ${step > 0 ? step + " artıyor" : -step + " azalıyor"}.`); } });

  game("sayi-bagi", { title: "Sayı bağı", icon: "groups", tone: "sky", grades: [1, 2], short: "Bütün ve parçalar, eksik parça",
    round(L) { const w = R(L ? 6 : 3, [5, 10, 20][L]); const a = R(0, w); const hideWhole = L === 2 && Math.random() < 0.3;
      return hideWhole ? q("Bütün kaç?", bond("?", a, w - a), w, null, `${a} ve ${w - a} birlikte ${w} eder.`) : q("Eksik parça kaç?", bond(w, a, "?"), w - a, nearOpts(w - a, 4, 3, 0), `${w}, ${a} ve ${w - a} parçalarına ayrılır.`); } });

  game("oruntu-treni", { title: "Örüntü treni", icon: "pattern", tone: "sun", grades: [1, 2], short: "Örüntüde sıradaki vagon",
    round(L) { const units = [["🔴", "🔵"], ["⭐", "⭐", "🌙"], ["🍎", "🍌", "🍇"], ["🟩", "🟨", "🟨", "🟥"]]; const u = L === 0 ? units[0] : L === 1 ? P(units.slice(0, 3)) : P(units);
      const items = Array.from({ length: 8 }, (_, i) => u[i % u.length]); const ans = u[8 % u.length];
      const s = box("0 0 1000 200");
      items.forEach((e, i) => { const x = 40 + i * 104; s.append(S("rect", { x, y: 60, width: 92, height: 80, rx: 12, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 4 }), S("circle", { cx: x + 22, cy: 150, r: 12, fill: "#2a2a2a" }), S("circle", { cx: x + 70, cy: 150, r: 12, fill: "#2a2a2a" }), S("text", { x: x + 46, y: 102, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 46 }, e)); });
      s.append(S("rect", { x: 872, y: 60, width: 92, height: 80, rx: 12, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 4, "stroke-dasharray": "10 6" }), txt(918, 102, "?", 52));
      return q("Sıradaki vagonda ne olmalı?", s, ans, T.shuffle([ans, ...T.shuffle([...new Set([...u, "🟣", "⚪"])].filter((v) => v !== ans)).slice(0, 3)]), "Örüntünün tekrar eden parçasını bul: " + u.join(" ")); } });

  game("onu-tamamla", { title: "Buzu kır: 10'u tamamla", icon: "frame", tone: "sky", grades: [1, 2], short: "10'a ve 20'ye tamamlama, 10 yapma stratejisi",
    round(L) {
      if (L < 2) { const t = L ? 20 : 10, n = R(1, t - 1); const s = box("0 0 760 160"); s.append(tenFrame(Math.min(n, 10), 15, 10, "#2e9bd6")); if (t === 20) s.append(tenFrame(Math.max(0, n - 10), 395, 10, "#2e9bd6")); return q(`${n} + ? = ${t}`, s, t - n, nearOpts(t - n, 4, 3, 0), `${n} ile ${t - n} birlikte ${t} eder.`); }
      const a = R(6, 9), b = R(3, 9); const need = 10 - a; const s = box("0 0 760 160"); s.append(tenFrame(a, 15, 10, "#ef5b3b", need, "#2e9bd6"), tenFrame(b - need, 395, 10, "#2e9bd6"));
      return q(`${a} + ${b} = 10 + ?`, s, a + b - 10, nearOpts(a + b - 10, 4, 3, 0), `${b} sayısından ${need} tanesi ${a}'yı 10 yapar, geriye ${b - need} kalır.`); } });

  game("denge", { title: "Denge cambazı", icon: "scale", tone: "grape", grades: [1, 4], short: "Eşitliğin iki yanını dengele",
    round(L) { const max = [10, 20, 100][L]; const a = R(1, max / 2), b = R(1, max / 2), c = R(1, Math.min(a + b - 1, max / 2)); const d = a + b - c;
      const s = box("0 0 900 300");
      s.append(S("path", { d: "M430 280h40l-20-40z", fill: "#8c5c2f" }), S("rect", { x: 100, y: 150, width: 700, height: 16, rx: 8, fill: "#b9834a", stroke: "#2a2a2a", "stroke-width": 3 }), S("rect", { x: 440, y: 160, width: 20, height: 90, fill: "#b9834a" }));
      s.append(S("rect", { x: 130, y: 60, width: 260, height: 80, rx: 14, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 4 }), txt(260, 101, `${a} + ${b}`, 46));
      s.append(S("rect", { x: 510, y: 60, width: 260, height: 80, rx: 14, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 4 }), txt(640, 101, `? + ${c}`, 46));
      return q("Terazinin dengede kalması için ? kaç olmalı?", s, d, nearOpts(d, 4, 4, 0), `${a} + ${b} = ${a + b}. ${a + b} − ${c} = ${d}.`); } });

  game("bilgi-arisi", { title: "Bilgi arısı", icon: "bolt", tone: "sun", grades: [1, 4], short: "Toplama, çıkarma, çarpma akıcılığı", timed: true,
    round(L) { const op = L === 0 ? P(["+", "−"]) : L === 1 ? P(["+", "−", "+"]) : P(["×", "×", "+", "−"]); let a, b, ans;
      if (op === "+") { a = R(0, L ? 50 : 10); b = R(0, L ? 49 : 10 - a); ans = a + b; } else if (op === "−") { a = R(L ? 10 : 2, L ? 99 : 10); b = R(0, a); ans = a - b; } else { a = R(2, 10); b = R(2, 10); ans = a * b; }
      const s = box("0 0 700 200"); s.append(txt(350, 100, `${a} ${op} ${b}`, 110)); return q("", s, ans, nearOpts(ans, 4, op === "×" ? 6 : 3, 0)); } });

  const NAMES = ["Ada", "Can", "Ece", "Mert", "Zeynep", "Efe", "Elif", "Kaan", "Umut", "Öykü"];
  T.ekIn = (name) => { const v = [...T.trLower(name)].filter((c) => "aeıioöuü".includes(c)).pop() || "e"; const e = { a: "ın", ı: "ın", e: "in", i: "in", o: "un", u: "un", ö: "ün", ü: "ün" }[v]; return name + "'" + ("aeıioöuü".includes(T.trLower(name).slice(-1)) ? "n" : "") + e; };
  game("problem-ciftligi", { title: "Problem çiftliği", icon: "talk", tone: "leaf", grades: [1, 4], short: "Ekleme, birleştirme, ayırma, karşılaştırma",
    round(L) { const max = [10, 20, 100][L]; const who = P(NAMES), who2 = P(NAMES.filter((x) => x !== who)); const things = P([["🐔", "tavuk"], ["🥚", "yumurta"], ["🐑", "koyun"], ["🍎", "elma"], ["🐄", "inek"]]);
      const kind = P(L ? ["ekle", "birlestir", "ayir", "karsilastir", "eksik"] : ["ekle", "birlestir", "ayir"]); let a = R(1, max / 2), b = R(1, max / 2), text, ans, vis;
      if (kind === "ekle") { text = `Çiftlikte ${a} ${things[1]} vardı. ${b} ${things[1]} daha geldi. Şimdi kaç ${things[1]} var?`; ans = a + b; }
      else if (kind === "birlestir") { text = `${who} ${a}, ${who2} ${b} ${things[1]} topladı. İkisi toplam kaç ${things[1]} topladı?`; ans = a + b; }
      else if (kind === "ayir") { if (b > a) [a, b] = [b, a]; text = `Bahçede ${a} ${things[1]} vardı. ${b} tanesi ahıra girdi. Bahçede kaç ${things[1]} kaldı?`; ans = a - b; }
      else if (kind === "karsilastir") { if (b > a) [a, b] = [b, a]; text = `${T.ekIn(who)} ${a}, ${T.ekIn(who2)} ${b} ${things[1]} çıkartması var. ${T.ekIn(who)} kaç fazla çıkartması var?`; ans = a - b; }
      else { const tot = a + b; text = `Çiftlikte ${a} ${things[1]} vardı. Birkaç ${things[1]} daha gelince ${tot} oldu. Kaç ${things[1]} geldi?`; ans = b; }
      vis = L === 2 ? null : objects(Math.min(kind === "ayir" || kind === "karsilastir" ? a : a + b, 20), things[0], 10, 54);
      return q(text, vis, ans, nearOpts(ans, 4, 3, 0), "Önce durumu çizerek düşün: artıyor mu, azalıyor mu, karşılaştırılıyor mu?"); } });

  const SHAPES = {
    "Kare": { pts: "60,60 240,60 240,240 60,240", kose: 4, kenar: 4, dik: true, esit: true },
    "Dikdörtgen": { pts: "30,90 270,90 270,210 30,210", kose: 4, kenar: 4, dik: true },
    "Üçgen": { pts: "150,40 270,250 30,250", kose: 3, kenar: 3 },
    "Daire": { circle: true, kose: 0, kenar: 0 },
    "Beşgen": { pts: "150,30 270,118 225,260 75,260 30,118", kose: 5, kenar: 5 },
    "Altıgen": { pts: "90,40 210,40 270,150 210,260 90,260 30,150", kose: 6, kenar: 6 },
  };
  const shapeSVG = (name, col = "#2e9bd6") => { const d = SHAPES[name], s = box("0 0 300 300"); s.append(d.circle ? S("circle", { cx: 150, cy: 150, r: 110, fill: col, stroke: "#2a2a2a", "stroke-width": 6 }) : S("polygon", { points: d.pts, fill: col, stroke: "#2a2a2a", "stroke-width": 6, "stroke-linejoin": "round" })); return s; };
  game("ayiyi-besle", { title: "Ayıyı besle", icon: "pattern", tone: "tomato", grades: [1, 3], short: "Şekillerin özellikleri", visualOptions: true,
    round(L) {
      const rules = [["3 köşesi olan şekli ver", (d) => d.kose === 3], ["4 kenarı olan bir şekil ver", (d) => d.kenar === 4], ["Köşesi olmayan şekli ver", (d) => d.kose === 0], ["5 köşesi olan şekli ver", (d) => d.kose === 5], ["6 kenarı olan şekli ver", (d) => d.kenar === 6], ["Bütün kenarları eşit, 4 dik köşesi olan şekli ver", (d) => d.esit]];
      const [txtR, f] = P(L ? rules : rules.slice(0, 3)); const names = Object.keys(SHAPES); const good = names.filter((n) => f(SHAPES[n])); const ans = P(good);
      const opts = T.shuffle([ans, ...T.shuffle(names.filter((n) => !f(SHAPES[n]))).slice(0, 3)]);
      const bear = box("0 0 300 220"); bear.innerHTML = '<circle cx="90" cy="60" r="34" fill="#a0673a" stroke="#2a2a2a" stroke-width="4"/><circle cx="210" cy="60" r="34" fill="#a0673a" stroke="#2a2a2a" stroke-width="4"/><circle cx="150" cy="120" r="90" fill="#b97a47" stroke="#2a2a2a" stroke-width="5"/><circle cx="120" cy="105" r="10" fill="#2a2a2a"/><circle cx="180" cy="105" r="10" fill="#2a2a2a"/><ellipse cx="150" cy="160" rx="40" ry="28" fill="#2a2a2a"/>';
      return { prompt: "Ayı diyor ki: " + txtR, visual: bear, answer: ans, options: opts, render: (o) => shapeSVG(o, P(["#2e9bd6", "#ffc233", "#6cc04a", "#f27ba9"])), explain: ans + ": " + SHAPES[ans].kose + " köşe, " + SHAPES[ans].kenar + " kenar." }; } });

  game("solucan", { title: "Solucanı ölç", icon: "ruler", tone: "leaf", grades: [1, 3], short: "Uzunluk ölçme ve karşılaştırma",
    round(L) { const a = R(2, 12), b = R(2, 12); const s = box("0 0 980 260"); const U = 70;
      const worm = (y, n, col) => { for (let i = 0; i < n; i++) s.append(S("circle", { cx: 50 + i * U + U / 2, cy: y, r: 30, fill: col, stroke: "#2a2a2a", "stroke-width": 3 })); s.append(S("circle", { cx: 50 + (n - 1) * U + U / 2 + 8, cy: y - 8, r: 5, fill: "#2a2a2a" })); };
      const ruler = (y) => { s.append(S("rect", { x: 50, y, width: 13 * U, height: 40, fill: "#ffe38a", stroke: "#2a2a2a", "stroke-width": 3 })); for (let i = 0; i <= 13; i++) { s.append(S("line", { x1: 50 + i * U, y1: y, x2: 50 + i * U, y2: y + 20, stroke: "#2a2a2a", "stroke-width": 3 })); s.append(txt(50 + i * U, y + 30, i, 18)); } };
      if (L === 0) { worm(90, a, "#f27ba9"); ruler(150); return q("Solucan kaç birim uzunluğunda?", s, a, nearOpts(a, 4, 2, 1), "Cetvelin 0 çizgisinden başla, solucanın bittiği yeri oku."); }
      worm(60, a, "#f27ba9"); worm(150, b, "#9dd67a"); ruler(200);
      if (a === b) return q("Pembe ile yeşil solucan arasındaki fark kaç birim?", s, 0, nearOpts(0, 4, 3, 0), "İkisi aynı uzunlukta.");
      return q("Uzun solucan, kısa olandan kaç birim daha uzun?", s, Math.abs(a - b), nearOpts(Math.abs(a - b), 4, 2, 0), `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)}`); } });

  game("bloklari-say", { title: "Blokları say", icon: "blocks", tone: "sky", grades: [1, 3], short: "Taban bloklarıyla basamak değeri",
    round(L) { const n = R(L === 0 ? 11 : 20, [50, 99, 999][L]); return q("Bloklar hangi sayıyı gösteriyor?", blocks(n), n, T.shuffle([n, n + 10 > 999 ? n - 20 : n + 10, Math.max(1, n - 1), Number(String(n).split("").reverse().join("")) === n ? n + 1 : Number(String(n).split("").reverse().join(""))].filter((v, i, a) => a.indexOf(v) === i)), "Önce yüzlükleri, sonra onlukları, en son birlikleri say."); } });

  game("timsah", { title: "Timsahın ağzı", icon: "odd", tone: "leaf", grades: [1, 4], short: "<, > ve = sembolleri",
    round(L) { let a = R(0, [10, 100, 1000][L]), b = R(0, [10, 100, 1000][L]); let la = a, lb = b;
      if (L === 2 && Math.random() < 0.5) { const x = R(1, 50), y = R(1, 50); a = x + y; const z = R(1, a - 1), w2 = Math.max(0, a - z + R(-2, 2)); la = `${x} + ${y}`; lb = `${z} + ${w2}`; b = z + w2; }
      if (Math.random() < 0.2) { b = a; lb = la; }
      const s = box("0 0 800 200"); s.append(txt(200, 100, la, 64), txt(600, 100, lb, 64), S("rect", { x: 340, y: 40, width: 120, height: 120, rx: 18, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 4, "stroke-dasharray": "10 6" }), txt(400, 100, "?", 64));
      return q("Timsah her zaman büyük olanı yemek ister.", s, a > b ? ">" : a < b ? "<" : "=", [">", "<", "="], `${a} ${a > b ? ">" : a < b ? "<" : "="} ${b}`); } });

  game("lav", { title: "Lav atlaması", icon: "grid100", tone: "tomato", grades: [1, 3], short: "10'ar atlama, onluklarla toplama",
    round(L) { const a = R(1, L ? 70 : 80), k = L === 0 ? 10 : L === 1 ? P([10, 20, 30]) : P([19, 21, 11, 29, 31]); const ans = a + k;
      const sv = box("0 0 520 530"); const start = Math.floor((a - 1) / 10) * 10 - (a > 50 ? 30 : 0), st = Math.max(0, Math.min(start, 50));
      for (let i = 0; i < 50; i++) { const n = st + i + 1, x = 10 + (i % 10) * 50, y = 10 + Math.floor(i / 10) * 100; const lava = Math.floor(i / 10) % 2 === 1; sv.append(S("rect", { x, y, width: 48, height: 48, rx: 6, fill: n === a ? "#ffc233" : lava ? "#ffd2c2" : "#fff", stroke: "#2a2a2a", "stroke-width": 2 }), txt(x + 24, y + 26, n, 20)); }
      return q(`${a} + ${k} = ?`, sv, ans, nearOpts(ans, 4, 10, 0).map((v) => v).concat().slice(0, 4).sort(() => 0) , `${k} eklemek için ${Math.floor(k / 10)} onluk ilerle${k % 10 ? ", sonra " + (k % 10 === 9 ? "1 geri gel" : k % 10 + " ileri git") : ""}.`); } });

  game("saat-treni", { title: "Saat treni", icon: "clock", tone: "sky", grades: [1, 3], short: "Saati okuma: tam, yarım, çeyrek, 5 dakika",
    round(L) { const hh = R(1, 12), mm = L === 0 ? P([0, 30]) : L === 1 ? P([0, 15, 30, 45]) : R(0, 11) * 5; const f = (a, b) => `${a}:${T.pad(b)}`;
      const ans = f(hh, mm); const o = new Set([ans]); while (o.size < 4) { const a = P([hh, (hh % 12) + 1, ((hh + 10) % 12) + 1]), b = L === 0 ? P([0, 30]) : P([0, 15, 30, 45, mm, (mm + 30) % 60]); o.add(f(a, b)); }
      return q("Saat kaç?", clock(hh, mm), ans, T.shuffle([...o]), T.saatOku ? T.saatOku(hh, mm) : ans); } });

  game("grafik-dedektifi", { title: "Grafik dedektifi", icon: "chart", tone: "sun", grades: [1, 4], short: "Resim grafiği okuma",
    round(L) { const cats = T.shuffle([["Elma", "🍎"], ["Muz", "🍌"], ["Çilek", "🍓"], ["Üzüm", "🍇"]]).slice(0, L ? 4 : 3); const data = cats.map(([n]) => [n, R(1, 8)]);
      const vis = picto(data, cats.map((c) => c[1]));
      const kind = P(L ? ["en", "fark", "toplam", "kac"] : ["en", "kac"]);
      const maxV = Math.max(...data.map((d) => d[1]));
      if (kind === "en" && data.filter((d) => d[1] === maxV).length === 1) { const a = data.find((d) => d[1] === maxV)[0]; return q("En çok hangi meyve sevilmiş?", vis, a, data.map((d) => d[0]), `${a}: ${maxV} kişi.`); }
      if (kind === "fark") { const [x, y] = T.shuffle(data).slice(0, 2); const big = x[1] >= y[1] ? x : y, sm = big === x ? y : x; return q(`${big[0]} sevenler, ${sm[0]} sevenlerden kaç fazla?`, vis, big[1] - sm[1], nearOpts(big[1] - sm[1], 4, 2, 0), `${big[1]} − ${sm[1]}`); }
      if (kind === "toplam") { const t = data.reduce((a, b) => a + b[1], 0); return q("Toplam kaç kişiye soruldu?", vis, t, nearOpts(t, 4, 3, 1)); }
      const d = P(data); return q(`${d[0]} sevenler kaç kişi?`, vis, d[1], nearOpts(d[1], 4, 2, 0)); } });

  game("dogru-atisi", { title: "Sayı doğrusu atışı", icon: "line", tone: "grape", grades: [2, 5], short: "Doğrudaki işaretin değeri",
    round(L) { const [a, b, step] = [[0, 20, 1], [0, 100, 10], [0, 1000, 100]][L]; const v = L === 0 ? R(1, 19) : L === 1 ? R(1, 99) : R(1, 99) * 10; const ans = v;
      return q("Ok hangi sayıyı gösteriyor?", numLine(a, b, step, v, true), ans, nearOpts(ans, 4, [2, 8, 80][L], 0), "En yakın çentiğe bak ve aradaki adımları say."); } });

  game("sifre", { title: "Şifreyi çöz", icon: "lock", tone: "grape", grades: [1, 4], short: "Çözümlenmiş gösterim, basamak değeri",
    round(L) { const n = R([11, 101, 1001][L], [99, 999, 9999][L]); const d = String(n).split("").map(Number); const parts = d.map((x, i) => x * 10 ** (d.length - 1 - i)).filter(Boolean);
      const rev = Math.random() < 0.5; const s = box("0 0 800 200");
      if (!rev) { s.append(txt(400, 100, parts.join(" + "), 64)); const sw = Number(String(n).split("").reverse().join("")); return q("Şifre hangi sayı?", s, n, T.shuffle([...new Set([n, sw, n + 10 ** (d.length - 2 || 0), n - 1])]), "Her parça bir basamağın değeridir."); }
      const k = R(0, d.length - 1); const val = d[k] * 10 ** (d.length - 1 - k); s.append(txt(400, 100, String(n).split("").map((c, i) => i === k ? "[" + c + "]" : c).join(" "), 80));
      return q("Köşeli parantezdeki rakamın basamak değeri kaç?", s, val, T.shuffle([...new Set([val, d[k], d[k] * 10, d[k] * 100 || 1, d[k] * 1000 || 2])]).slice(0, 4).concat().filter((v, i, a) => a.indexOf(v) === i), `${d[k]}, ${["birler", "onlar", "yüzler", "binler"][d.length - 1 - k]} basamağında: ${val}.`); } });

  game("kutup-yolu", { title: "Kutup yolu", icon: "odd", tone: "sky", grades: [1, 4], short: "Sayıları karşılaştır, sırala",
    round(L) { const max = [20, 100, 1000][L]; const nums = new Set(); while (nums.size < 3) nums.add(R(0, max)); const arr = [...nums]; const big = Math.random() < 0.5;
      const ans = big ? Math.max(...arr) : Math.min(...arr); return q(`Penguen ${big ? "en büyük" : "en küçük"} sayının olduğu buz kalıbına atlamalı.`, null, ans, arr, `Önce basamak sayısına, sonra soldaki rakamlara bak.`); } });

  game("ritmik", { title: "Ritmik sayma", icon: "timeline", tone: "leaf", grades: [2, 4], short: "2'şer, 5'er, 10'ar, 100'er",
    round(L) { const k = P(L === 0 ? [2, 5, 10] : L === 1 ? [3, 4, 5, 10] : [6, 7, 8, 9, 25, 100]); const st = k * R(0, 5); const seq = Array.from({ length: 6 }, (_, i) => st + i * k); const m = R(2, 5);
      const s = box("0 0 980 160"); seq.forEach((v, i) => { const x = 85 + i * 162; s.append(S("rect", { x: x - 70, y: 30, width: 140, height: 100, rx: 50, fill: "#d7ecfb", stroke: "#2a2a2a", "stroke-width": 4 }), txt(x, 82, i === m ? "?" : v, 46)); });
      return q("Örüntüdeki eksik sayı kaç?", s, seq[m], nearOpts(seq[m], 4, k, 0), `${k}'şer artıyor.`); } });

  game("adil-paylasim", { title: "Adil paylaşım", icon: "groups", tone: "pink", grades: [2, 4], short: "Eşit paylaşma ve bölme",
    round(L) { const k = R(2, L ? 6 : 4), each = R(1, L === 2 ? 9 : 5), tot = k * each; const s = box(`0 0 ${Math.max(600, k * 150)} 340`);
      for (let i = 0; i < tot; i++) s.append(S("text", { x: 40 + (i % 12) * 48, y: 50 + Math.floor(i / 12) * 52, "font-size": 40, "dominant-baseline": "central" }, "🍪"));
      for (let i = 0; i < k; i++) s.append(S("ellipse", { cx: 75 + i * 140, cy: 290, rx: 60, ry: 26, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 4 }));
      return q(`${tot} kurabiye ${k} tabağa eşit paylaşılırsa her tabakta kaç kurabiye olur?`, s, each, nearOpts(each, 4, 2, 1), `${tot} ÷ ${k} = ${each}`); } });

  game("kesri-boya", { title: "Kesir avcısı", icon: "fraction", tone: "pink", grades: [2, 5], short: "Boyalı parçanın kesri, denk kesirler",
    round(L) { const n = P(L === 0 ? [2, 3, 4] : [3, 4, 5, 6, 8]), k = R(1, n - 1); const kind = P(["circle", "rect"]);
      if (L === 2) { const m = P([2, 3]); const ans = `${k * m}/${n * m}`; const s = box("0 0 300 300"); s.append(fracShape(n, k, kind)); return q(`Boyalı kısım ${k}/${n}. Hangisi buna denktir?`, fracShape(n, k, kind), ans, T.shuffle([ans, `${k + 1}/${n * m}`, `${k * m}/${n}`, `${k}/${n * m}`].filter((v, i, a) => a.indexOf(v) === i)), `Pay ve paydayı ${m} ile çarp.`); }
      const ans = `${k}/${n}`; return q("Şeklin ne kadarı boyalı?", fracShape(n, k, kind), ans, T.shuffle([...new Set([ans, `${n - k}/${n}`, `${k}/${n + 1}`, `${Math.min(k + 1, n)}/${n}`])]).filter((v, i, a) => a.indexOf(v) === i), `${n} eşit parçanın ${k} tanesi boyalı.`); } });

  game("yuvarlama", { title: "Yuvarlama tepesi", icon: "line", tone: "sun", grades: [3, 4], short: "En yakın onluğa ve yüzlüğe yuvarla",
    round(L) { const to = L === 0 ? 10 : L === 1 ? P([10, 100]) : 100; const n = to === 10 ? R(11, 99) : R(101, 999); const lo = Math.floor(n / to) * to, hi = lo + to; const ans = n - lo >= to / 2 ? hi : lo;
      return q(`${n} sayısını en yakın ${to === 10 ? "onluğa" : "yüzlüğe"} yuvarla.`, numLine(lo, hi, to / 10, n, true), ans, T.shuffle([lo, hi, Math.round(n / (to / 10)) * (to / 10) === ans ? lo - to : Math.round(n / (to / 10)) * (to / 10)].filter((v, i, a) => a.indexOf(v) === i && v >= 0)), `${n}, ${lo} ile ${hi} arasında; ortası ${lo + to / 2}.`); } });

  game("deniz-canavari", { title: "Deniz canavarı", icon: "bolt", tone: "sky", grades: [3, 5], short: "Çarpma ve bölme akıcılığı", timed: true,
    round(L) { const a = R(2, L === 0 ? 5 : 10), b = R(2, L === 2 ? 12 : 10); const div = L > 0 && Math.random() < 0.5; const s = box("0 0 700 200");
      if (div) { s.append(txt(350, 100, `${a * b} ÷ ${a}`, 110)); return q("", s, b, nearOpts(b, 4, 3, 1)); }
      s.append(txt(350, 100, `${a} × ${b}`, 110)); return q("", s, a * b, nearOpts(a * b, 4, Math.max(a, b), 1)); } });

  game("alan-avi", { title: "Alan ve çevre avı", icon: "area", tone: "tomato", grades: [3, 6], short: "Kareli kağıtta alan ve çevre",
    round(L) { const w = R(2, L ? 9 : 6), hh = R(2, L ? 7 : 5); const per = Math.random() < 0.5; const ans = per ? 2 * (w + hh) : w * hh;
      return q(per ? "Dikdörtgenin çevresi kaç birim?" : "Dikdörtgenin alanı kaç birim kare?", grid(w, hh), ans, T.shuffle([...new Set([ans, per ? w * hh : 2 * (w + hh), w + hh, ans + 2])]), per ? `2 × (${w} + ${hh}) = ${ans}` : `${w} × ${hh} = ${ans}`); } });

  game("islem-sirasi", { title: "İşlem sırası", icon: "math", tone: "grape", grades: [4, 7], short: "Önce çarpma, bölme; sonra toplama, çıkarma",
    round(L) { const a = R(2, 9), b = R(2, 9), c = R(2, 9), d = R(1, 9); const forms = [[`${a} + ${b} × ${c}`, a + b * c, (a + b) * c], [`${a} × ${b} − ${c}`, a * b - c, a * (b - c)], [`(${a} + ${b}) × ${c}`, (a + b) * c, a + b * c], [`${a * b} ÷ ${b} + ${c}`, a + c, (a * b) / (b + c)]];
      if (L === 2) forms.push([`${a} + ${b} × ${c} − ${d}`, a + b * c - d, (a + b) * c - d]);
      const [e, ans, wrong] = P(forms); const s = box("0 0 800 200"); s.append(txt(400, 100, e, 72));
      return q("Sonuç kaç?", s, ans, T.shuffle([...new Set([ans, Number.isInteger(wrong) ? wrong : ans + 3, ans + 1, Math.max(0, ans - 2)])]), "Parantez varsa önce o; sonra çarpma ve bölme, en son toplama ve çıkarma."); } });

  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  game("asal-yaris", { title: "Asal yarışı", icon: "star", tone: "leaf", grades: [4, 7], short: "Asal sayılar ve katlar",
    round(L) { if (L === 0) { const k = R(2, 9), ans = k * R(2, 9); const o = new Set([ans]); while (o.size < 4) { const v = R(4, 90); if (v % k) o.add(v); } return q(`Hangisi ${k}'nın katıdır?`, null, ans, T.shuffle([...o]), `${ans} = ${k} × ${ans / k}`); }
      const pr = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97].filter((p) => (L === 1 ? p < 50 : true)); const ans = P(pr); const o = new Set([ans]); while (o.size < 4) { const v = R(10, L === 1 ? 50 : 99); if (!isPrime(v)) o.add(v); }
      return q("Hangisi asal sayıdır?", null, ans, T.shuffle([...o]), `${ans} yalnızca 1'e ve kendisine bölünür.`); } });

  game("carpan", { title: "Çarpan çifti", icon: "algebra", tone: "sun", grades: [3, 6], short: "Eksik çarpanı bul",
    round(L) { const a = R(2, L ? 12 : 9), b = R(2, L ? 12 : 9); const s = box("0 0 800 200"); s.append(txt(400, 100, `${a} × ? = ${a * b}`, 84)); return q("", s, b, nearOpts(b, 4, 3, 1), `${a * b} ÷ ${a} = ${b}`); } });

  game("kalanli", { title: "Kalanlı paylaşım", icon: "groups", tone: "pink", grades: [3, 5], short: "Bölme ve kalan",
    round(L) { const d = R(2, L ? 9 : 5), qq = R(1, L === 2 ? 12 : 6), r = R(0, d - 1), n = d * qq + r; const f = (a, b) => `${a}, kalan ${b}`; const ans = f(qq, r);
      const s = box("0 0 800 200"); s.append(txt(400, 100, `${n} ÷ ${d}`, 96));
      return q("Bölüm ve kalan nedir?", s, ans, T.shuffle([...new Set([ans, f(qq + 1, Math.max(0, r - 1)), f(qq, (r + 1) % d), f(Math.max(0, qq - 1), r + d < 10 ? r + d : r)])]), `${d} × ${qq} = ${d * qq}, ${n} − ${d * qq} = ${r}. Kalan bölenden küçük olmalı.`); } });

  game("hacim", { title: "Küp kulesi", icon: "blocks", tone: "sky", grades: [5, 6], short: "Dikdörtgenler prizmasının hacmi",
    round(L) { const l = R(2, L ? 5 : 4), w = R(1, L ? 4 : 2), hh = R(1, L ? 4 : 3); const ans = l * w * hh; return q("Prizma kaç birim küpten oluşuyor?", prism(l, w, hh), ans, T.shuffle([...new Set([ans, l * w + hh, ans + l, 2 * (l * w + w * hh + l * hh)])]), `${l} × ${w} × ${hh} = ${ans}`); } });

  game("para-say", { title: "Kumbaram", icon: "money", tone: "leaf", grades: [1, 4], short: "Paraları say, toplamı bul",
    round(L) { const vals = L === 0 ? [1, 5, 10] : L === 1 ? [5, 10, 20, 50] : [0.25, 0.5, 1, 5, 10]; const n = R(2, L ? 5 : 4); const coins = Array.from({ length: n }, () => P(vals)); const ans = Math.round(coins.reduce((a, b) => a + b, 0) * 100) / 100;
      const s = box(`0 0 ${n * 170 + 40} 200`);
      coins.forEach((v, i) => { const x = 100 + i * 170; const note = v >= 5; if (note) s.append(S("rect", { x: x - 75, y: 50, width: 150, height: 100, rx: 8, fill: { 5: "#9a7bc4", 10: "#e2675a", 20: "#59b37a", 50: "#f0a04b" }[v] || "#4d9bd6", stroke: "#2a2a2a", "stroke-width": 3 }), txt(x, 100, v + " TL", 32, "#fff")); else s.append(S("circle", { cx: x, cy: 100, r: 60, fill: "#e7c46f", stroke: "#2a2a2a", "stroke-width": 3 }), txt(x, 100, v < 1 ? v * 100 + " kr" : v + " TL", 30)); });
      const fmt = (x) => T.money(x); return q("Toplam kaç lira?", s, fmt(ans), T.shuffle([...new Set([ans, ans + P(vals), Math.max(0, ans - P(vals)), ans + 1])]).map(fmt).filter((v, i, a) => a.indexOf(v) === i), "Büyük paralardan başlayarak say."); } });

  /* ---------- Oyun kabuğu ---------- */
  const MODES = [["tek", "Tek oyuncu"], ["takim", "İki takım"]];
  function shell(host, id) {
    const g = GAMES[id], grade = T.store.grade();
    let L = grade <= (g.grades[0] + g.grades[1]) / 2 - 0.5 ? 0 : grade >= g.grades[1] ? 2 : 1;
    let mode = "tek", n = 0, score = [0, 0], turn = 0, cur = null, tries = 0, locked = false, timer = null, tLeft = 0;
    const ROUNDS = 10;
    const track = h("div", { style: { height: "54px", position: "relative", borderRadius: "28px", background: "rgba(0,0,0,.22)", overflow: "hidden" } });
    const stage = h("div.mat.mat-pad", { style: { minHeight: "auto", display: "grid", gap: "14px", justifyItems: "center", alignContent: "start" } });
    const scoreEl = h("div.row", { style: { gap: "10px" } });
    const seg = (opts, curV, on) => h("div.seg", opts.map(([v, l]) => h("button", { "aria-pressed": String(v === curV), onclick: (e) => { e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); on(v); } }, l)));
    host.append(h("div.row", seg([[0, "Kolay"], [1, "Orta"], [2, "Zor"]], L, (v) => { L = v; restart(); }), seg(MODES, mode, (v) => { mode = v; restart(); }), h("div.spacer"), scoreEl), track, stage);
    function paintTrack() {
      const pct = (n / ROUNDS) * 100;
      track.replaceChildren(h("div", { style: { position: "absolute", inset: "0", width: pct + "%", background: "linear-gradient(90deg, var(--leaf), var(--sun))", transition: "width .4s" } }),
        ...Array.from({ length: ROUNDS }, (_, i) => h("div", { style: { position: "absolute", left: `calc(${((i + 0.5) / ROUNDS) * 100}% - 7px)`, top: "20px", width: "14px", height: "14px", borderRadius: "50%", background: i < n ? "#fff" : "rgba(255,255,255,.35)" } })),
        h("div", { style: { position: "absolute", left: `calc(${pct}% - 26px)`, top: "3px", fontSize: "40px", transition: "left .4s", lineHeight: 1 } }, g.mascot || "🚀"));
      scoreEl.replaceChildren(mode === "tek" ? h("span.readout", { style: { color: "var(--chalk)" } }, `${score[0]} / ${ROUNDS}`)
        : [0, 1].map((t) => h("span.pill", { style: { fontSize: "20px", padding: "6px 14px", background: t === 0 ? "#f9d8d3" : "#d6e9f8", outline: turn === t ? "3px solid var(--sun)" : "none" } }, (t ? "Mavi" : "Kırmızı") + ": " + score[t])));
    }
    function restart() { n = 0; score = [0, 0]; turn = 0; next(); }
    function next() {
      clearInterval(timer);
      if (n >= ROUNDS) return finish();
      tries = 0; locked = false;
      let r = null; for (let k = 0; k < 6 && !r; k++) { try { r = g.round(L); if (!r || !r.options || r.options.length < 2 || !r.options.some((o) => String(o) === String(r.answer))) r = r && r.options ? Object.assign(r, { options: T.shuffle([...new Set([r.answer, ...r.options])]).slice(0, 4) }) : null; } catch (e) { console.error(e); r = null; } }
      cur = r; paintTrack();
      const opts = h("div", { style: { display: "grid", gridTemplateColumns: `repeat(${Math.min(4, r.options.length)}, minmax(0, 1fr))`, gap: "14px", width: "100%", maxWidth: "1000px" } });
      r.options.forEach((o) => {
        const b = h("button.btn.big.c-chalk", { style: { minHeight: g.visualOptions ? "140px" : "72px", fontSize: String(o).length > 8 ? "22px" : "36px", fontFamily: "var(--display)" }, onclick: () => pick(o, b) },
          r.render ? h("div", { style: { width: "120px", height: "120px" } }, r.render(o)) : String(o));
        opts.append(b);
      });
      const vis = r.visual ? h("div", { style: { width: "100%", maxWidth: "1000px", height: "min(30vh, 300px)", display: "grid", placeItems: "center" } }, r.visual) : null;
      const who = mode === "takim" ? h("div.pill", { style: { fontSize: "18px", background: turn ? "#d6e9f8" : "#f9d8d3" } }, (turn ? "Mavi" : "Kırmızı") + " takımın sırası") : null;
      const timerEl = g.timed ? h("div.readout", { style: { fontSize: "22px", color: "var(--ink-soft)" } }) : null;
      stage.replaceChildren(h("div.row", { style: { justifyContent: "center" } }, who, timerEl), r.prompt ? h("div", { style: { fontSize: "clamp(22px, 2.4vw, 32px)", fontWeight: 700, textAlign: "center", maxWidth: "60ch" } }, r.prompt) : null, vis, opts, h("div.fb", { style: { minHeight: "34px", fontSize: "19px", textAlign: "center" } }));
      if (g.flash && vis) setTimeout(() => { if (cur === r && !locked) vis.style.visibility = "hidden"; }, g.flash);
      if (g.timed) { tLeft = [12, 9, 7][L]; timerEl.textContent = tLeft + " sn"; timer = setInterval(() => { tLeft--; timerEl.textContent = tLeft + " sn"; if (tLeft <= 0) { clearInterval(timer); reveal(false); } }, 1000); }
    }
    function pick(o, b) {
      if (locked) return;
      if (String(o) === String(cur.answer)) { b.className = "btn big c-leaf"; T.sound.ok(); reveal(true); }
      else { tries++; b.className = "btn big c-tomato"; b.disabled = true; T.sound.no(); b.animate([{ transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "none" }], { duration: 260 });
        if (tries >= (mode === "takim" ? 1 : 2)) reveal(false); }
    }
    function reveal(ok) {
      locked = true; clearInterval(timer);
      if (ok) score[mode === "takim" ? turn : 0] += tries === 0 ? 1 : mode === "tek" ? 0.5 : 0;
      const vis = stage.querySelector("svg"); if (vis && vis.parentNode) vis.parentNode.style.visibility = "visible";
      stage.querySelectorAll(".btn.big").forEach((b) => { if (b.textContent === String(cur.answer) || (cur.render && b === [...stage.querySelectorAll(".btn.big")][cur.options.indexOf(cur.answer)])) b.className = "btn big c-leaf"; });
      const fb = stage.querySelector(".fb");
      fb.replaceChildren(h("b", { style: { color: ok ? "#1e6b33" : "#9b2218" } }, ok ? (tries ? "Buldun. " : "Harika! ") : "Doğru cevap: " + cur.answer + ". "), cur.explain || "");
      n++; if (mode === "takim") turn = 1 - turn;
      paintTrack();
      fb.append(" ", h("button.btn.sm.c-sun", { onclick: next }, n >= ROUNDS ? "Sonucu gör" : "Sonraki soru", T.icon("next")));
      if (ok && mode === "tek") setTimeout(() => { if (locked && stage.querySelector(".fb") === fb) next(); }, 2200);
    }
    function finish() {
      paintTrack();
      const msg = mode === "tek" ? `${ROUNDS} sorudan ${score[0]} puan aldın.` : score[0] === score[1] ? `Berabere: ${score[0]} - ${score[1]}` : `${score[0] > score[1] ? "Kırmızı" : "Mavi"} takım kazandı: ${Math.max(...score)} - ${Math.min(...score)}`;
      const stars = mode === "tek" ? Math.round((score[0] / ROUNDS) * 3) : 3;
      stage.replaceChildren(h("div", { style: { fontSize: "80px" } }, "⭐".repeat(Math.max(1, stars))), h("h2", { style: { fontSize: "40px" } }, msg),
        h("div.row", { style: { justifyContent: "center" } }, h("button.btn.big.c-sun", { onclick: restart }, T.icon("reset"), "Yeniden oyna"), L < 2 ? h("button.btn.big.c-leaf", { onclick: () => { L++; restart(); } }, "Bir üst düzey", T.icon("next")) : null));
      T.sound.bell();
    }
    T.onLeave(() => clearInterval(timer));
    restart();
  }
})();
