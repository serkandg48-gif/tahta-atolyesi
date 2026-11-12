/* Matematik atölyesi kabuğu + Sayı hissi rutinleri */
(function () {
  const { h } = T;
  T.toolPage = function (view, id) {
    const t = T.tools[id];
    const wrap = h("div.view-inner");
    const host = h("div.stage-wrap");
    if (t.compact) {
      const bar = h("div.stage-bar", h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go(t.back || "matematik") }, T.icon("back")));
      host._bar = bar; wrap.style.paddingTop = "14px"; wrap.style.paddingBottom = "10px"; wrap.style.maxWidth = "none";
      wrap.append(bar, host); view.append(wrap); t.render(host); return;
    }
    wrap.append(h("div.stage-bar",
      h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go(t.back || "matematik") }, T.icon("back")),
      h("h2", t.title), t.desc ? h("span.hint", t.desc) : null, h("div.grow"),
      h("button.btn.sm.c-chalk", { onclick: () => T.board.add("toollink", { data: { tool: id }, w: 280, h: 170 }) }, T.icon("board"), "Ders ekranına kısayol")), host);
    view.append(wrap);
    t.render(host);
  };
  /* Ders ekranında aracı açan küçük kısayol */
  T.widgets.toollink = {
    title: "Araç kısayolu", icon: "math", tone: "sky", w: 280, h: 170, group: "Gizli",
    init: () => ({ tool: "gunun-sayisi" }),
    render(body, w) {
      const t = T.tools[w.data.tool] || {};
      body.style.placeItems = "center";
      body.append(h("button.btn.big.c-sky", { onclick: () => T.go((t.back || "matematik") + "-" + w.data.tool) }, T.icon(t.icon || "math"), t.title || "Aç"));
    },
  };

  const CATS = [
    ["his", "Sayı hissi", "dots"], ["oyun", "Oyunlar", "star"], ["manip", "Manipülatifler", "blocks"], ["sim", "Simülasyonlar", "scale"],
    ["orta", "Ortaokul", "algebra"], ["tuval", "Serbest tuval", "canvas"],
  ];
  let cat = "his";
  T.sections.matematik = {
    title: "Matematik", icon: "math", tone: "sun",
    desc: "Sayı hissi, manipülatifler, simülasyonlar",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const g = T.store.grade();
      const wrap = h("div.view-inner");
      view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Matematik atölyesi"), h("div.sub", "Sınıfın: " + g + ". sınıf. Araçlar sınıf seviyesine göre sıralanır; hepsi her sınıfta açılabilir.")),
        h("div.tabs", { role: "tablist" }, CATS.map(([k, l, ic]) => h("button", { role: "tab", "aria-selected": String(cat === k), onclick: () => { cat = k; T.route(); } }, T.icon(ic), l))));
      const list = Object.entries(T.tools).filter(([, t]) => t.cat === cat && (t.back || "matematik") === "matematik")
        .sort((a, b) => fitScore(b[1], g) - fitScore(a[1], g));
      wrap.append(h("div.tool-grid", list.map(([k, t]) => T.aracKart("matematik-" + k, Object.assign({}, t, { short: t.short || (t.grades ? t.grades[0] + "-" + t.grades[1] + ". sınıf" : "") }), "sun"))));
    },
  };
  const fitScore = (t, g) => (t.grades && g >= t.grades[0] && g <= t.grades[1] ? 1 : 0);

  const tool = (id, def) => (T.tools[id] = def);
  const S = T.svg;

  /* ---------- Günün sayısı (okulun kaçıncı günü) ---------- */
  tool("gunun-sayisi", {
    title: "Günün sayısı", icon: "calendar", tone: "leaf", cat: "his", grades: [1, 4], short: "Okulun kaçıncı günü, her gün bir sayı",
    render(host) {
      let n = Math.max(1, T.cal.dayNumber());
      const out = h("div");
      host.append(out);
      function blocks(n) {
        const H = Math.floor(n / 100), Tn = Math.floor((n % 100) / 10), O = n % 10;
        const s = S("svg", { viewBox: `0 0 ${Math.max(300, H * 118 + Tn * 18 + Math.ceil(O / 5) * 18 + 40)} 120`, style: "width:100%;max-height:150px" });
        let x = 4;
        for (let i = 0; i < H; i++) { s.append(S("rect", { x, y: 4, width: 110, height: 110, fill: "#8fd0f5", stroke: "#164e7a", "stroke-width": 2 })); for (let k = 1; k < 10; k++) { s.append(S("line", { x1: x + k * 11, y1: 4, x2: x + k * 11, y2: 114, stroke: "#164e7a", "stroke-width": 0.6 })); s.append(S("line", { x1: x, y1: 4 + k * 11, x2: x + 110, y2: 4 + k * 11, stroke: "#164e7a", "stroke-width": 0.6 })); } x += 118; }
        for (let i = 0; i < Tn; i++) { s.append(S("rect", { x, y: 4, width: 11, height: 110, fill: "#8fd0f5", stroke: "#164e7a", "stroke-width": 2 })); for (let k = 1; k < 10; k++) s.append(S("line", { x1: x, y1: 4 + k * 11, x2: x + 11, y2: 4 + k * 11, stroke: "#164e7a", "stroke-width": 0.6 })); x += 18; }
        for (let i = 0; i < O; i++) s.append(S("rect", { x: x + Math.floor(i / 5) * 18, y: 103 - (i % 5) * 16, width: 11, height: 11, fill: "#8fd0f5", stroke: "#164e7a", "stroke-width": 2 }));
        return s;
      }
      function tally(n) {
        const s = h("div.tally");
        const k = Math.min(n, 200);
        for (let i = 0; i < Math.floor(k / 5); i++) { const g = S("svg", { viewBox: "0 0 40 30" }); g.innerHTML = '<path d="M5 3v24M12 3v24M19 3v24M26 3v24M1 24 32 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>'; s.append(g); }
        if (k % 5) { const g = S("svg", { viewBox: "0 0 40 30" }); g.innerHTML = Array.from({ length: k % 5 }, (_, i) => `<path d="M${5 + i * 7} 3v24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`).join(""); s.append(g); }
        return s;
      }
      const fact = (label, val) => h("div.paper", { style: { padding: "12px 16px" } }, h("div.hint", label), h("div.readout", { style: { fontSize: "26px" } }, val));
      function paint() {
        const H = Math.floor(n / 100), Tn = Math.floor((n % 100) / 10), O = n % 10;
        out.replaceChildren(
          h("div.home-hero", { style: { marginBottom: "18px" } },
            h("div.greet", h("div.daycount", h("div.daycount-big", n), h("div.daycount-txt", "Okulun " + n + ". günü", h("small", T.sayiOku(n)))), tally(n)),
            h("div.paper", { style: { padding: "18px", display: "grid", gap: "10px", alignContent: "start" } },
              h("div.hint", "Basamaklar"), blocks(n),
              h("div.row", h("span.pill", H + " yüzlük"), h("span.pill", Tn + " onluk"), h("span.pill", O + " birlik")))),
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))", gap: "14px" } },
            fact("Bir önceki", n - 1), fact("Bir sonraki", n + 1), fact("10 fazlası", n + 10), fact("10 eksiği", Math.max(0, n - 10)),
            fact("Tek mi çift mi?", n % 2 ? "Tek" : "Çift"), fact("En yakın onluk", Math.round(n / 10) * 10),
            fact("100'e kaç kaldı?", n <= 100 ? 100 - n : "Geçtik"), fact("Yıl sonuna", Math.max(0, T.cal.total() - T.cal.dayNumber()) + " gün")),
          h("div.row", { style: { marginTop: "18px" } },
            h("button.btn.c-chalk", { onclick: () => { n = Math.max(0, n - 1); paint(); } }, T.icon("minus")),
            h("button.btn.c-chalk", { onclick: () => { n++; paint(); } }, T.icon("plus")),
            h("button.btn.c-leaf", { onclick: () => { n = Math.max(1, T.cal.dayNumber()); paint(); } }, T.icon("calendar"), "Bugüne dön"),
            h("button.btn.c-sun", { onclick: () => T.speak(T.sayiOku(n)) }, T.icon("speaker"), "Oku"),
            h("span.hint", "Her sabah sınıfça: sayıyı okuyun, bloklarla gösterin, bir önceki ve sonrakini bulun.")));
      }
      paint();
    },
  });

  /* ---------- Nokta konuşması ---------- */
  tool("nokta", {
    title: "Nokta konuşması", icon: "dots", tone: "grape", cat: "his", grades: [1, 5], short: "Kısa süre göster, nasıl saydın?",
    render(host) {
      const g = T.store.grade();
      let lvl = g <= 1 ? 1 : g <= 2 ? 2 : 3, secs = 3, shown = true, pts = [];
      const mat = h("div.mat", { style: { height: "var(--stage-h)", display: "grid", placeItems: "center" } });
      const cnt = h("div.readout", { style: { color: "var(--chalk)" } });
      function gen() {
        const W = 800, H = 500; pts = [];
        const add = (cx, cy, arr, r = 26) => arr.forEach(([x, y]) => pts.push([cx + x * r * 2.4, cy + y * r * 2.4]));
        const kinds = lvl === 1 ? ["zar", "cerceve", "grup2"] : lvl === 2 ? ["cerceve2", "grup3", "zar2"] : ["grup4", "dizi", "zar3"];
        const k = T.pick(kinds);
        const DIE = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
        if (k.startsWith("zar")) { const m = k === "zar" ? 1 : k === "zar2" ? 2 : 3; for (let i = 0; i < m; i++) add(W / (m + 1) * (i + 1), H / 2, DIE[T.rand(m === 1 ? 2 : 3, 6)], 22); }
        else if (k.startsWith("cerceve")) {
          const fr = k === "cerceve" ? 1 : 2;
          for (let f = 0; f < fr; f++) { const n = T.rand(fr === 1 ? 3 : 5, 10); for (let i = 0; i < n; i++) pts.push([W / 2 - 220 + (i % 5) * 110, H / 2 - (fr === 2 ? 140 : 55) + f * 170 + Math.floor(i / 5) * 110]); }
        } else if (k === "dizi") { const r = T.rand(3, 5), c = T.rand(4, 7); for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) pts.push([W / 2 - (c - 1) * 35 + j * 70, H / 2 - (r - 1) * 35 + i * 70]); }
        else { const m = +k.slice(-1); for (let i = 0; i < m; i++) { const cx = 140 + (i % 2) * 360 + T.rand(0, 120), cy = 130 + Math.floor(i / 2) * 230 + T.rand(-20, 20); add(cx, cy, DIE[T.rand(2, 5)], 20); } }
        shown = true; paint();
        if (secs) setTimeout(() => { shown = false; paint(); }, secs * 1000);
      }
      function paint() {
        const s = S("svg", { viewBox: "0 0 800 500", style: "width:100%;height:100%" });
        if (shown) pts.forEach(([x, y]) => s.append(S("circle", { cx: x, cy: y, r: 24, fill: "#2a2a2a" })));
        else s.append(S("text", { x: 400, y: 250, "text-anchor": "middle", "dominant-baseline": "middle", "font-family": "'Patrick Hand', cursive", "font-size": 54, fill: "#55625b" }, "Kaç nokta gördün? Nasıl gördün?"));
        mat.replaceChildren(s);
        cnt.textContent = shown && !secs ? pts.length + " nokta" : "";
      }
      host.append(
        h("div.row", h("div.seg", [1, 2, 3].map((l) => h("button", { "aria-pressed": String(l === lvl), onclick: () => { lvl = l; T.route(); } }, l + ". düzey"))),
          h("div.seg", [[2, "2 sn"], [3, "3 sn"], [5, "5 sn"], [0, "Hep açık"]].map(([v, l]) => h("button", { "aria-pressed": String(v === secs), onclick: (e) => { secs = v; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); } }, l)))),
        mat,
        h("div.row", h("button.btn.big.c-grape", { onclick: gen }, T.icon("dots"), "Yeni noktalar"),
          h("button.btn.c-chalk", { onclick: () => { shown = true; paint(); cnt.textContent = pts.length + " nokta"; } }, T.icon("eye"), "Tekrar göster"), cnt,
          h("span.hint", "Öğrenciler saymadan, gruplayarak görmeye çalışır. Sonra her biri nasıl gördüğünü tahtada çizerek anlatır.")));
      gen();
    },
  });

  /* ---------- Sayı konuşması (number talks) ---------- */
  const STRINGS = {
    1: [["5 + 5", "5 + 6", "5 + 4", "6 + 6", "6 + 7"], ["10 + 3", "9 + 3", "9 + 4", "9 + 8"], ["7 + 3", "7 + 4", "8 + 4", "8 + 5"]],
    2: [["20 + 30", "21 + 30", "21 + 29", "39 + 21"], ["40 − 10", "40 − 9", "41 − 9", "52 − 19"], ["8 + 8", "8 + 9", "18 + 9", "28 + 19"]],
    3: [["4 × 5", "4 × 10", "4 × 9", "4 × 19"], ["100 − 30", "100 − 29", "200 − 29", "200 − 99"], ["5 × 6", "5 × 12", "10 × 12", "15 × 12"]],
    4: [["25 × 4", "25 × 8", "25 × 12", "25 × 16"], ["120 ÷ 4", "240 ÷ 4", "240 ÷ 8", "480 ÷ 8"], ["99 × 3", "99 × 6", "101 × 6", "199 × 6"]],
    5: [["1/2 + 1/4", "1/2 + 3/4", "3/4 + 3/4", "1 1/2 + 3/4"], ["0,5 × 8", "0,5 × 16", "0,25 × 16", "0,25 × 48"], ["%10'u 80", "%20'si 80", "%5'i 80", "%15'i 80"]],
    6: [["12 × 15", "12 × 25", "12 × 35", "12 × 45"], ["3/4 · 8", "3/4 · 16", "3/8 · 16", "5/8 · 16"], ["%25'i 60", "%50'si 60", "%75'i 60", "%125'i 60"]],
    7: [["−3 + 5", "−8 + 5", "−8 − 5", "−8 − (−5)"], ["(−4) · 3", "(−4) · (−3)", "(−4) · (−6)", "(−12) ÷ (−3)"], ["2x = 10", "2x + 1 = 11", "2x + 1 = 21", "3x − 2 = 19"]],
    8: [["2³", "2⁴", "2⁵", "2⁶ ÷ 2²"], ["√16", "√25", "√36", "√50 hangi iki tam sayı arasında?"], ["(x + 1)²  x = 9", "x² + 2x + 1  x = 9", "101²", "99²"]],
  };
  tool("sayi-konusmasi", {
    title: "Sayı konuşması", icon: "talk", tone: "sky", cat: "his", grades: [1, 8], short: "Zihinden işlem dizisi, strateji paylaşımı",
    render(host) {
      const g = T.store.grade();
      let set = T.pick(STRINGS[g] || STRINGS[3]), i = 0;
      const strategies = [];
      const big = h("div", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(56px, 9vw, 140px)", textAlign: "center", lineHeight: 1, color: "var(--ink)" } });
      const prev = h("div.row", { style: { justifyContent: "center", gap: "18px", fontFamily: "var(--display)", fontSize: "28px", color: "var(--ink-soft)" } });
      const notes = h("div", { style: { display: "flex", flexWrap: "wrap", gap: "12px" } });
      const inp = h("input.in", { placeholder: "Bir öğrencinin stratejisini yaz, Enter'a bas. Örnek: Elif: 9'u 10 yaptım, 1 çıkardım", "aria-label": "Strateji" });
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim()) { strategies.push({ t: inp.value.trim(), p: set[i] }); inp.value = ""; paintNotes(); } });
      function paint() { big.textContent = set[i]; prev.replaceChildren(...set.slice(0, i).map((x) => h("span", x))); }
      function paintNotes() { notes.replaceChildren(...strategies.filter((s) => s.p === set[i]).map((s, k) => h("div", { style: { background: ["#fff6b8", "#d7f0ff", "#ffe0d6", "#e3f7d9"][k % 4], color: "#2a2a2a", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--hand)", fontSize: "22px", boxShadow: "0 3px 0 rgba(0,0,0,.2)", transform: `rotate(${(k % 3) - 1}deg)` } }, s.t))); }
      host.append(
        h("div.mat.mat-pad", { style: { minHeight: "auto", display: "grid", gap: "18px" } },
          prev, big,
          h("div.row", { style: { justifyContent: "center" } },
            h("button.btn.c-chalk", { onclick: () => { if (i > 0) { i--; paint(); paintNotes(); } } }, T.icon("back"), "Önceki"),
            h("button.btn.big.c-sky", { onclick: () => { if (i < set.length - 1) { i++; paint(); paintNotes(); } else T.toast("Dizi bitti. Diziler arasındaki ilişkiyi konuşun."); } }, "Sonraki işlem", T.icon("next")),
            h("button.btn.c-chalk", { onclick: () => { set = T.pick(STRINGS[g] || STRINGS[3]); i = 0; strategies.length = 0; paint(); paintNotes(); } }, T.icon("reset"), "Başka dizi"),
            h("button.btn.c-chalk", { onclick: () => T.board.add("timer", { data: { total: 60, left: 60, running: false, endAt: 0 } }) }, T.icon("timer"), "Düşünme süresi")),
          inp, notes),
        h("p.hint", "Kural: Cevabı bulan başparmağını göğsünün önünde kaldırır, başka yol bulan bir parmak daha açar. Cevaplar önce, stratejiler sonra paylaşılır. Dizideki işlemler birbirine yaslanır; öğrenciler bir öncekini kullanmaya teşvik edilir."));
      paint();
    },
  });

  /* ---------- Hangisi farklı? ---------- */
  tool("hangisi-farkli", {
    title: "Hangisi farklı?", icon: "odd", tone: "pink", cat: "his", grades: [1, 8], short: "Doğru cevap tek değil, gerekçe önemli",
    render(host) {
      const sets = [
        { kind: "num", items: ["9", "16", "25", "43"], hint: "Tek kare olmayan, tek çift olan, iki basamaklı olmayan..." },
        { kind: "num", items: ["6", "15", "21", "28"], hint: "Üçün katı olmayan, çift olan, üçgensel sayılar..." },
        { kind: "num", items: ["1/2", "2/4", "3/5", "50%"], hint: "Değeri farklı olan, yüzde olarak yazılan..." },
        { kind: "num", items: ["12", "18", "24", "35"], hint: "Tek olan, 6'nın katı olmayan..." },
        { kind: "num", items: ["2 + 7", "3 × 3", "18 − 9", "4 + 4"], hint: "Sonucu farklı olan, çarpma olan..." },
        { kind: "shape", items: ["kare", "dikdortgen", "esk", "ucgen"], hint: "Dik açısı olmayan, üç kenarlı olan, bütün kenarları eşit olanlar..." },
        { kind: "shape", items: ["altigen", "kare", "daire", "ucgen"], hint: "Köşesi olmayan, kenar sayısı tek olan..." },
        { kind: "num", items: ["−4", "0", "4", "−0,5"], hint: "Tam sayı olmayan, pozitif olan, işaretsiz olan..." },
      ];
      let k = 0;
      const box = h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", background: "var(--ink)", borderRadius: "var(--r-lg)", overflow: "hidden", height: "var(--stage-h)", boxShadow: "var(--lift)" } });
      const hint = h("p.hint");
      const shapeSVG = (n) => {
        const s = S("svg", { viewBox: "0 0 200 200", style: "width:60%;height:60%" });
        const st = { fill: "#2e9bd6", stroke: "#2a2a2a", "stroke-width": 5, "stroke-linejoin": "round" };
        const P = { kare: "40,40 160,40 160,160 40,160", dikdortgen: "20,60 180,60 180,140 20,140", esk: "100,20 175,100 100,180 25,100", ucgen: "100,25 180,170 20,170", altigen: "60,30 140,30 180,100 140,170 60,170 20,100" }[n];
        s.append(n === "daire" ? S("circle", Object.assign({ cx: 100, cy: 100, r: 72 }, st)) : S("polygon", Object.assign({ points: P }, st)));
        return s;
      };
      function paint() {
        const s = sets[k];
        box.replaceChildren(...T.shuffle(s.items).map((it) => h("div", { style: { background: "var(--paper)", display: "grid", placeItems: "center", fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(42px,6vw,96px)", color: "var(--ink)" } }, s.kind === "shape" ? shapeSVG(it) : it)));
        hint.textContent = "Öğretmen için olası gerekçeler: " + s.hint;
        hint.style.visibility = "hidden";
      }
      host.append(box, h("div.row",
        h("button.btn.big.c-pink", { onclick: () => { k = (k + 1) % sets.length; paint(); } }, T.icon("reset"), "Yeni dörtlü"),
        h("button.btn.c-chalk", { onclick: () => (hint.style.visibility = "visible") }, T.icon("eye"), "Gerekçe önerileri"),
        h("span.hint", "Her kutu için bir gerekçe bulunabilir. Öğrenciler hangisini seçtiğini değil, neden seçtiğini anlatır.")), hint);
      paint();
    },
  });

  /* ---------- Tahmin kavanozu ---------- */
  tool("tahmin", {
    title: "Tahmin kavanozu", icon: "jar", tone: "sun", cat: "his", grades: [1, 6], short: "Tahmin et, onluk gruplarla say",
    render(host) {
      const g = T.store.grade();
      let n = 0, grouped = false, reveal = false, seed = [];
      const mat = h("div.mat", { style: { height: "var(--stage-h)" } });
      const out = h("div.readout", { style: { color: "var(--chalk)" } });
      function gen() {
        n = T.rand(g <= 1 ? 8 : g <= 2 ? 20 : 40, g <= 1 ? 20 : g <= 2 ? 60 : g <= 4 ? 150 : 300);
        seed = Array.from({ length: n }, () => [Math.random(), Math.random(), T.pick(["#ef5b3b", "#ffc233", "#6cc04a", "#2e9bd6", "#8a5cd0", "#f27ba9"])]);
        grouped = false; reveal = false; paint();
      }
      function paint() {
        const s = S("svg", { viewBox: "0 0 900 560", style: "width:100%;height:100%" });
        if (!grouped) {
          s.append(S("path", { d: "M300 80h300v40c40 20 60 60 60 110v270a30 30 0 0 1-30 30H270a30 30 0 0 1-30-30V230c0-50 20-90 60-110z", fill: "rgba(170,220,240,.35)", stroke: "#2a2a2a", "stroke-width": 5 }));
          s.append(S("rect", { x: 290, y: 50, width: 320, height: 40, rx: 8, fill: "#b9834a", stroke: "#2a2a2a", "stroke-width": 4 }));
          const r = n > 150 ? 9 : n > 60 ? 12 : 16;
          seed.forEach(([a, b, c], i) => {
            // tabandan yukarı doğru doldur
            const cols = Math.floor(380 / (r * 2.1)); const row = Math.floor(i / cols);
            const x = 260 + r + (i % cols) * r * 2.1 + (row % 2 ? r : 0) + a * 4;
            const y = 512 - r - row * r * 1.8 - b * 3;
            s.append(S("ellipse", { cx: Math.min(x, 640 - r), cy: Math.max(y, 140), rx: r, ry: r * 0.8, fill: c, stroke: "rgba(0,0,0,.35)", "stroke-width": 1.5 }));
          });
        } else {
          const tens = Math.floor(n / 10), ones = n % 10;
          for (let t = 0; t < tens; t++) {
            const gx = 30 + (t % 10) * 86, gy = 30 + Math.floor(t / 10) * 120;
            s.append(S("rect", { x: gx - 6, y: gy - 6, width: 76, height: 104, rx: 10, fill: "none", stroke: "#2e9bd6", "stroke-width": 3, "stroke-dasharray": "6 5" }));
            for (let k = 0; k < 10; k++) s.append(S("circle", { cx: gx + 14 + (k % 2) * 36, cy: gy + 10 + Math.floor(k / 2) * 19, r: 8, fill: seed[t * 10 + k][2] }));
          }
          for (let k = 0; k < ones; k++) s.append(S("circle", { cx: 40 + k * 26, cy: 530, r: 9, fill: seed[tens * 10 + k][2] }));
        }
        mat.replaceChildren(s);
        out.textContent = reveal ? n + " şeker" + (grouped ? ` = ${Math.floor(n / 10)} onluk ${n % 10} birlik` : "") : "";
      }
      host.append(mat, h("div.row",
        h("button.btn.big.c-sun", { onclick: gen }, T.icon("jar"), "Yeni kavanoz"),
        h("button.btn.c-chalk", { onclick: () => { grouped = true; reveal = true; paint(); } }, T.icon("groups"), "Onarlı grupla"),
        h("button.btn.c-chalk", { onclick: () => { reveal = true; paint(); } }, T.icon("eye"), "Sayıyı göster"), out),
        h("p.hint", "Önce herkes çok az, çok fazla ve en iyi tahminini söyler. Tahminler sayı doğrusuna yazılır. Sonra onarlı gruplayıp birlikte sayın."));
      gen();
    },
  });

  /* ---------- Doğruda nerede? ---------- */
  tool("dogruda-nerede", {
    title: "Doğruda nerede?", icon: "line", tone: "tomato", cat: "his", grades: [2, 8], short: "Sayı doğrusunda konum tahmini",
    render(host) {
      const g = T.store.grade();
      const ranges = g <= 2 ? [[0, 20], [0, 100]] : g <= 4 ? [[0, 100], [0, 1000], [0, 1]] : g <= 6 ? [[0, 1], [0, 10], [0, 1000]] : [[-10, 10], [-1, 1], [0, 1]];
      let [a, b] = T.pick(ranges), target = 0, guess = null, show = false;
      const svg = S("svg", { viewBox: "0 0 1000 260", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "300px" } }, svg);
      const msg = h("div.readout", { style: { color: "var(--chalk)", fontSize: "24px" } });
      const nice = (v) => (Math.abs(b - a) <= 1 ? (Math.round(v * 100) / 100).toLocaleString("tr-TR") : Math.round(v).toLocaleString("tr-TR"));
      function gen() {
        [a, b] = T.pick(ranges);
        const span = b - a;
        target = span <= 2 ? Math.round((a + Math.random() * span) * 20) / 20 : Math.round(a + Math.random() * span);
        guess = null; show = false; paint();
      }
      const X = (v) => 80 + ((v - a) / (b - a)) * 840;
      function paint() {
        svg.replaceChildren(
          S("line", { x1: 60, y1: 160, x2: 940, y2: 160, stroke: "#2a2a2a", "stroke-width": 5, "stroke-linecap": "round" }),
          S("line", { x1: 80, y1: 140, x2: 80, y2: 180, stroke: "#2a2a2a", "stroke-width": 5 }),
          S("line", { x1: 920, y1: 140, x2: 920, y2: 180, stroke: "#2a2a2a", "stroke-width": 5 }),
          S("text", { x: 80, y: 220, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 36 }, nice(a)),
          S("text", { x: 920, y: 220, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 36 }, nice(b)),
          S("text", { x: 500, y: 60, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 52, fill: "#ef5b3b" }, nice(target) + " nerede?"));
        if (guess != null) svg.append(S("path", { d: `M${X(guess)} 160l-14-34h28z`, fill: "#2e9bd6", stroke: "#2a2a2a", "stroke-width": 3 }));
        if (show) svg.append(S("path", { d: `M${X(target)} 160l-14 34h28z`, fill: "#ef5b3b", stroke: "#2a2a2a", "stroke-width": 3 }));
        msg.textContent = show && guess != null ? `Fark: ${nice(Math.abs(guess - target))}` : "";
      }
      svg.addEventListener("pointerdown", (e) => { const p = T.svgPoint(svg, e.clientX, e.clientY); guess = a + T.clamp((p.x - 80) / 840, 0, 1) * (b - a); show = false; paint(); });
      host.append(mat, h("div.row",
        h("button.btn.big.c-tomato", { onclick: gen }, T.icon("reset"), "Yeni sayı"),
        h("button.btn.c-chalk", { onclick: () => { show = true; paint(); } }, T.icon("eye"), "Doğru yeri göster"), msg),
        h("p.hint", "Bir öğrenci doğruya dokunarak tahminini işaretler, sınıf gerekçesini tartışır: yarısından önce mi sonra mı?"));
      gen();
    },
  });
})();
