/* Matematik atölyesi kabuğu + Sayı hissi rutinleri */
(function () {
  const { h } = T;
  T.toolPage = function (view, id) {
    const t = T.tools[id];
    const wrap = h("div.view-inner");
    const host = h("div.stage-wrap");
    if (t.compact) {
      const bar = h("div.stage-bar.tek-serit", h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go(t.back || "matematik") }, T.icon("back")), h("h2", t.title), h("div.grow"), h("div.serit-yuva"), T.seritSonu ? T.seritSonu(id) : null);
      host._bar = bar.querySelector(".serit-yuva"); wrap.style.paddingTop = "14px"; wrap.style.paddingBottom = "10px"; wrap.style.maxWidth = "none";
      wrap.append(bar, host); view.append(wrap); const pu = view.querySelector(".pencere-ust"); if (pu) bar.append(pu); t.render(host); T.sigdir(host); return;
    }
    const kitapVar = false; /* MEB kitabı yalnızca Kitaplar bölümünde açılır */
    const kitapAcik = () => { try { return localStorage.getItem("ta-kitap-acik") === "1"; } catch (e) { return false; } };
    const govde = h("div.arac-govde", host);
    const kitapDugme = kitapVar ? h("button.btn.sm.c-chalk", { "aria-pressed": "false", onclick: () => kitapYap(!govde.classList.contains("kitapli")) }, T.icon("book"), "MEB kitabı") : null;
    const kitapYap = (ac) => {
      try { localStorage.setItem("ta-kitap-acik", ac ? "1" : "0"); } catch (e) {}
      const eski = govde.querySelector(".kitap-yan"); if (eski) eski.remove();
      govde.classList.toggle("kitapli", ac); wrap.classList.toggle("genis", ac); if (kitapDugme) kitapDugme.setAttribute("aria-pressed", String(ac));
      if (ac) govde.append(T.kitapPaneli(t.back, () => kitapYap(false)));
    };
    const bar = h("div.stage-bar.tek-serit",
      h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go(t.back || "matematik") }, T.icon("back")),
      h("h2", t.title), t.desc ? h("span.hint", t.desc) : null, h("div.grow"), kitapDugme, h("div.serit-yuva"),
      T.seritSonu ? T.seritSonu(id) : null);
    wrap.append(bar, govde);
    view.append(wrap);
    const pu = view.querySelector(".pencere-ust"); if (pu) bar.append(pu);
    t.render(host); T.sigdir(host);
    if (kitapVar && kitapAcik()) kitapYap(true);
  };
  /* Araç ekrana sığmıyorsa tam ekrana gerek kalmadan küçülterek sığdırır (alt menünün üstünde kalır). Telefonda kapalı. */
  T.sigdir = function (host) {
    let z = 1, bekle = 0;
    const olc = () => {
      bekle = 0; if (!host.isConnected) return gozcu.disconnect();
      if (innerWidth <= 760) { if (z !== 1) { z = 1; host.style.zoom = ""; } return; }
      const r = host.getBoundingClientRect(), dogal = r.height / z; if (dogal < 50) return;
      const dock = document.querySelector("#dock"), dr = dock && dock.offsetParent !== null ? dock.getBoundingClientRect() : null;
      const alt = dr && dr.top < innerHeight && dr.top > r.top ? dr.top - 10 : innerHeight - 10;
      const ust = r.top + (document.querySelector("#view") || document.documentElement).scrollTop * 0;
      const yer = alt - ust; const yeni = dogal > yer + 4 ? Math.max(0.62, Math.floor((yer / dogal) * 100) / 100) : 1;
      if (Math.abs(yeni - z) > 0.015) { z = yeni; host.style.zoom = z === 1 ? "" : String(z); }
    };
    const iste = () => { if (!bekle) bekle = requestAnimationFrame(olc); };
    const gozcu = new ResizeObserver(iste); gozcu.observe(host); Array.from(host.children).forEach((c) => gozcu.observe(c));
    new MutationObserver(() => { Array.from(host.children).forEach((c) => gozcu.observe(c)); iste(); }).observe(host, { childList: true });
    addEventListener("resize", iste); setTimeout(iste, 60); setTimeout(iste, 600); setTimeout(iste, 1800);
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
    ["oyun", "Oyunlar", "star"], ["his", "Sayı hissi", "dots"], ["manip", "Manipülatifler", "blocks"],
  ];
  let cat = "oyun";
  /* oyunları konulara ayır: menü aynı kalır, Oyunlar sekmesinin üstünde konu düğmeleri çıkar */
  const OYUN_KONU = [["sayi", "Sayılar ve basamak"], ["islem", "İşlemler"], ["kesir", "Kesirler"], ["olcme", "Ölçme ve para"], ["geo", "Geometri ve örüntü"], ["veri", "Veri"]];
  const KONU_HARITA = {
    sayi: ["oyun-tirtil", "oyun-sayi-bagi", "strateji-sayi-baglari", "oyun-bloklari-say", "onluk-blok", "oyun-yumurta-kolisi", "oyun-timsah", "oyun-lav", "oyun-ritmik", "oyun-yuvarlama", "oyun-basamak-basket"],
    islem: ["oyun-denge", "kd-mat-3-2-8", "oyun-dogru-atisi", "tavsan-zipla", "strateji-sayi-dogrusu", "strateji-carpma-bolme", "kd-mat-3-2-4", "kd-mat-3-2-5", "kd-mat-3-2-1"],
    kesir: ["oyun-kesir-dogru", "oyun-havuz", "oyun-kesir-model"],
    olcme: ["oyun-solucan", "oyun-cetvel", "oyun-alan-avi", "oyun-hacim", "oyun-para-say", "kd-mat-3-2-2"],
    geo: ["oyun-oruntu-treni", "kd-mat-3-3-1", "kd-mat-3-3-4", "kd-mat-3-3-7", "kup-gorunum", "kup-kur", "kup-say"],
    veri: ["grafik-atolyesi", "kd-mat-3-4-1"],
  };
  const oyunKonu = (id) => { for (const [k, l] of Object.entries(KONU_HARITA)) if (l.includes(id)) return k; return "sayi"; };
  T.sections.matematik = {
    title: "Matematik", icon: "math", tone: "sun",
    desc: "Sayı hissi, manipülatifler, simülasyonlar",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const g = T.store.grade();
      if (!CATS.some(([k]) => k === cat)) cat = "oyun";
      const wrap = h("div.view-inner");
      view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Matematik"), h("div.sub", "Oyunlar, sayı hissi, manipülatifler ve simülasyonlar.")),
        h("div.tabs", { role: "tablist" }, CATS.map(([k, l, ic]) => h("button", { role: "tab", "aria-selected": String(cat === k), onclick: () => { cat = k; T.route(); } }, T.icon(ic), l)),
          T.tools["dort-islem"] ? h("a.dort-kisayol", { href: "#matematik-dort-islem", title: "Toplama, çıkarma, çarpma ve bölmeyi modelle yap" }, T.icon("math"), "Dört işlem atölyesi") : null));
      let list = Object.entries(T.tools).filter(([, t]) => t.cat === cat && (t.back || "matematik") === "matematik")
        .sort((a, b) => (a[1].ilk || 99) - (b[1].ilk || 99));
      if (cat === "oyun") {
        let konu = "hepsi"; try { konu = localStorage.getItem("ta-oyun-konu") || "hepsi"; } catch (e) {}
        const say = (k) => list.filter(([id]) => oyunKonu(id) === k).length;
        if (konu !== "hepsi" && !say(konu)) konu = "hepsi";
        wrap.append(h("div.seg.oyun-konu", { role: "group", "aria-label": "Oyun konusu" }, [["hepsi", "Tümü", list.length]].concat(OYUN_KONU.map(([k, l]) => [k, l, say(k)])).filter((x) => x[2]).map(([k, l, n]) =>
          h("button", { "aria-pressed": String(konu === k), onclick: () => { try { localStorage.setItem("ta-oyun-konu", k); } catch (e) {} T.route(); } }, l, h("small", String(n))))));
        if (konu !== "hepsi") list = list.filter(([id]) => oyunKonu(id) === konu);
      }
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
        for (let i = 0; i < H; i++) { s.append(S("rect", { x, y: 4, width: 110, height: 110, fill: T.m3d("#5DADE8"), stroke: "#1B5D93", "stroke-width": 1.5 })); for (let k = 1; k < 10; k++) { s.append(S("line", { x1: x + k * 11, y1: 4, x2: x + k * 11, y2: 114, stroke: "#164e7a", "stroke-width": 0.6 })); s.append(S("line", { x1: x, y1: 4 + k * 11, x2: x + 110, y2: 4 + k * 11, stroke: "#164e7a", "stroke-width": 0.6 })); } x += 118; }
        for (let i = 0; i < Tn; i++) { s.append(S("rect", { x, y: 4, width: 11, height: 110, fill: T.m3d("#5DADE8"), stroke: "#1B5D93", "stroke-width": 1.5 })); for (let k = 1; k < 10; k++) s.append(S("line", { x1: x, y1: 4 + k * 11, x2: x + 11, y2: 4 + k * 11, stroke: "#164e7a", "stroke-width": 0.6 })); x += 18; }
        for (let i = 0; i < O; i++) s.append(S("rect", { x: x + Math.floor(i / 5) * 18, y: 103 - (i % 5) * 16, width: 11, height: 11, fill: T.m3d("#5DADE8"), stroke: "#1B5D93", "stroke-width": 1.5 }));
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
            h("div.greet", h("div.daycount", h("div.daycount-big", n), h("div.daycount-txt", (n === Math.max(1, T.cal.dayNumber()) ? "Okulun " + n + ". günü" : "Günün sayısı"), h("small", T.sayiOku(n)))), tally(n)),
            h("div.paper", { style: { padding: "18px", display: "grid", gap: "10px", alignContent: "start" } },
              h("div.hint", "Basamaklar"), blocks(n),
              h("div.row", h("span.pill", H + " yüzlük"), h("span.pill", Tn + " onluk"), h("span.pill", O + " birlik")))),
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))", gap: "14px" } },
            fact("Bir önceki", n - 1), fact("Bir sonraki", n + 1), fact("10 fazlası", n + 10), fact("10 eksiği", Math.max(0, n - 10)),
            fact("Tek mi çift mi?", n % 2 ? "Tek" : "Çift"), fact("En yakın onluk", Math.round(n / 10) * 10),
            fact("100'e kaç kaldı?", n <= 100 ? 100 - n : "Geçtik"), fact("Yıl sonuna", Math.max(0, T.cal.total() - T.cal.dayNumber()) + " gün")),
          h("div.row", { style: { marginTop: "18px" } },
            h("button.btn.c-chalk", { "aria-label": "Bir azalt", onclick: () => { n = Math.max(0, n - 1); paint(); } }, T.icon("minus")),
            h("button.btn.c-chalk", { "aria-label": "Bir artır", onclick: () => { n++; paint(); } }, T.icon("plus")),
            h("button.btn.c-leaf", { onclick: () => { n = Math.max(1, T.cal.dayNumber()); paint(); } }, T.icon("calendar"), "Bugüne dön"),
            h("label.gs-gir", "Sayıyı yaz:", h("input.in", { type: "number", min: 0, max: 9999, value: n, "aria-label": "Günün sayısı", onchange: (e) => { const v = parseInt(e.target.value, 10); if (v >= 0) { n = Math.min(9999, v); paint(); } } })),
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
      const mat = h("div.mat.nk-mat", { style: { display: "grid", placeItems: "center" } });
      const cnt = h("div.readout", { style: { color: "var(--chalk)" } });
      let zm = 0;
      function gen() {
        const W = 800, H = 500; pts = []; clearTimeout(zm);
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
        if (secs) zm = setTimeout(() => { shown = false; paint(); }, secs * 1000);
      }
      function paint() {
        const s = S("svg", { viewBox: "0 0 800 500", style: "width:100%;height:100%" });
        if (shown) pts.forEach(([x, y]) => (T.m3kur(), s.append(S("circle", { cx: x, cy: y, r: 24, fill: T.m3("#E4553F"), filter: "url(#m3-golge-k)" }))));
        else s.append(S("text", { x: 400, y: 250, "text-anchor": "middle", "dominant-baseline": "middle", "font-family": "'Patrick Hand', cursive", "font-size": 54, fill: "#55625b" }, "Kaç nokta gördün? Nasıl gördün?"));
        mat.replaceChildren(s);
        cnt.textContent = shown && !secs ? pts.length + " nokta" : "";
      }
      host.append(
        h("div.row", h("div.seg", [1, 2, 3].map((l) => h("button", { "aria-pressed": String(l === lvl), onclick: () => { lvl = l; T.route(); } }, l + ". düzey"))),
          h("div.seg", [[2, "2 sn"], [3, "3 sn"], [5, "5 sn"], [0, "Hep açık"]].map(([v, l]) => h("button", { "aria-pressed": String(v === secs), onclick: (e) => { secs = v; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); } }, l)))),
        mat,
        h("div.row", h("button.btn.big.c-grape", { onclick: gen }, T.icon("dots"), "Yeni noktalar"),
          h("button.btn.c-chalk", { onclick: () => { clearTimeout(zm); shown = true; paint(); if (secs) zm = setTimeout(() => { shown = false; paint(); }, secs * 1000); } }, T.icon("eye"), "Tekrar göster"),
          h("button.btn.c-leaf", { onclick: () => { clearTimeout(zm); shown = true; paint(); cnt.textContent = pts.length + " nokta"; } }, T.icon("check"), "Cevabı göster"), cnt,
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
      const big = h("div.tebesir-yazi", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(56px, 9vw, 140px)", textAlign: "center", lineHeight: 1, color: "#F4F1E6" } });
      const prev = h("div.row", { style: { justifyContent: "center", gap: "18px", fontFamily: "var(--display)", fontSize: "28px", color: "rgba(244,241,230,.6)" } });
      const notes = h("div", { style: { display: "flex", flexWrap: "wrap", gap: "12px" } });
      const inp = h("input.in", { placeholder: "Bir öğrencinin stratejisini yaz, Enter'a bas. Örnek: Elif: 9'u 10 yaptım, 1 çıkardım", "aria-label": "Strateji" });
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim()) { strategies.push({ t: inp.value.trim(), p: set[i] }); inp.value = ""; paintNotes(); } });
      function paint() { big.textContent = set[i]; prev.replaceChildren(...set.slice(0, i).map((x) => h("span", x))); }
      function paintNotes() { notes.replaceChildren(...strategies.filter((s) => s.p === set[i]).map((s, k) => h("div", { style: { background: ["#fff6b8", "#d7f0ff", "#ffe0d6", "#e3f7d9"][k % 4], color: "#2a2a2a", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--hand)", fontSize: "22px", boxShadow: "0 3px 0 rgba(0,0,0,.2)", transform: `rotate(${(k % 3) - 1}deg)` } }, s.t))); }
      host.append(
        h("div.mat.mat-pad.m-kara", { style: { minHeight: "auto", display: "grid", gap: "18px" } },
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
      const box = h("div.m-mantar.hf-pano", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", height: "var(--stage-h)" } });
      const hint = h("p.hint");
      const shapeSVG = (n) => {
        const s = S("svg", { viewBox: "0 0 200 200", style: "width:60%;height:60%" });
        const st = { fill: T.m3d("#2e9bd6"), stroke: "rgba(0,0,0,.35)", "stroke-width": 2, "stroke-linejoin": "round" };
        const P = { kare: "40,40 160,40 160,160 40,160", dikdortgen: "20,60 180,60 180,140 20,140", esk: "100,20 175,100 100,180 25,100", ucgen: "100,25 180,170 20,170", altigen: "60,30 140,30 180,100 140,170 60,170 20,100" }[n];
        s.append(n === "daire" ? S("circle", Object.assign({ cx: 100, cy: 100, r: 72 }, st)) : S("polygon", Object.assign({ points: P }, st)));
        return s;
      };
      function paint() {
        const s = sets[k];
        box.replaceChildren(...T.shuffle(s.items).map((it, j) => h("div.m-kart.hf-kart", { style: { "--r": (j % 2 ? 1 : -1) * (0.6 + j * 0.3) + "deg", background: "var(--paper)", display: "grid", placeItems: "center", fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(42px,6vw,96px)", color: "var(--ink)" } }, s.kind === "shape" ? shapeSVG(it) : it)));
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
          /* Gerçeğe yakın cam kavanoz: kalın cam kenar, yansıma, metal kapak, parlak boncuklar */
          const RN = ["#E2412F", "#F4B400", "#2FA84F", "#1F7AE0", "#7B4FD6", "#EC5D9A"];
          const defs = S("defs");
          RN.forEach((c, i) => { const g = S("radialGradient", { id: "tk-b" + i, cx: "35%", cy: "30%", r: "75%" }); g.append(S("stop", { offset: "0", "stop-color": "#fff", "stop-opacity": ".95" }), S("stop", { offset: ".18", "stop-color": c }), S("stop", { offset: ".8", "stop-color": T.m3d ? c : c }), S("stop", { offset: "1", "stop-color": "#000", "stop-opacity": ".55" })); defs.append(g); });
          const cam = S("linearGradient", { id: "tk-cam", x1: "0", x2: "1" }); [["0", ".55"], [".08", ".15"], [".5", ".04"], [".9", ".12"], ["1", ".5"]].forEach(([o, op]) => cam.append(S("stop", { offset: o, "stop-color": "#D8F0FA", "stop-opacity": op }))); defs.append(cam);
          const kapak = S("linearGradient", { id: "tk-kap", x1: "0", x2: "1" }); [["0", "#8A9096"], [".2", "#E9ECEF"], [".45", "#B4BAC0"], [".7", "#F4F6F8"], ["1", "#7E848A"]].forEach(([o, c]) => kapak.append(S("stop", { offset: o, "stop-color": c }))); defs.append(kapak);
          const golge = S("radialGradient", { id: "tk-golge" }); golge.append(S("stop", { offset: "0", "stop-color": "#000", "stop-opacity": ".28" }), S("stop", { offset: "1", "stop-color": "#000", "stop-opacity": "0" })); defs.append(golge);
          const govde = "M318 118 L582 118 Q586 150 612 168 Q660 200 660 260 L660 488 Q660 528 620 530 L280 530 Q240 528 240 488 L240 260 Q240 200 288 168 Q314 150 318 118 Z";
          const kesit = S("clipPath", { id: "tk-ic" }); kesit.append(S("path", { d: govde })); defs.append(kesit);
          s.append(defs, S("ellipse", { cx: 450, cy: 536, rx: 250, ry: 22, fill: "url(#tk-golge)" }));
          s.append(S("path", { d: govde, fill: "rgba(225,242,250,.35)" }));
          /* boncukları alttan yukarı sık istifle */
          const ici = S("g", { "clip-path": "url(#tk-ic)" });
          const r = Math.max(7.5, Math.min(20, Math.sqrt((400 * 330 * 0.62) / (n * Math.PI))));
          const genis = (y) => (y > 250 ? [246, 654] : [246 + ((250 - y) / 120) * 60, 654 - ((250 - y) / 120) * 60]);
          let i = 0, satir = 0;
          while (i < n && satir < 80) {
            const y = 526 - r - satir * r * 1.72; const [x0, x1] = genis(y); const kay = satir % 2 ? r : 0;
            for (let x = x0 + r + kay; x <= x1 - r && i < n; x += r * 2.02) { const [ra, rb, c] = seed[i]; const ci = Math.abs(["#ef5b3b", "#ffc233", "#6cc04a", "#2e9bd6", "#8a5cd0", "#f27ba9"].indexOf(c)); ici.append(S("circle", { cx: x + (ra - 0.5) * r * 0.25, cy: y + (rb - 0.5) * r * 0.2, r: r * (0.93 + rb * 0.07), fill: `url(#tk-b${ci})` })); i++; }
            satir++;
          }
          s.append(ici);
          /* cam: kenar kalınlığı, ön yansımalar */
          s.append(S("path", { d: govde, fill: "url(#tk-cam)", stroke: "rgba(150,190,210,.9)", "stroke-width": 5 }),
            S("path", { d: "M262 270 Q262 225 296 196 L296 500 Q266 496 262 470 Z", fill: "#fff", opacity: ".32" }),
            S("path", { d: "M628 290 L636 290 L636 480 L628 480 Z", fill: "#fff", opacity: ".22" }),
            S("path", { d: "M300 520 L600 520", stroke: "rgba(255,255,255,.5)", "stroke-width": 3 }));
          /* vida dişli kapak */
          s.append(S("rect", { x: 300, y: 70, width: 300, height: 54, rx: 9, fill: "url(#tk-kap)", stroke: "#6E747A", "stroke-width": 2 }));
          for (let k = 0; k < 4; k++) s.append(S("line", { x1: 304, y1: 82 + k * 11, x2: 596, y2: 82 + k * 11, stroke: "rgba(0,0,0,.18)", "stroke-width": 2 }));
        } else {
          const tens = Math.floor(n / 10), ones = n % 10;
          for (let t = 0; t < tens; t++) {
            const gx = 30 + (t % 10) * 86, gy = 30 + Math.floor(t / 10) * 120;
            s.append(S("rect", { x: gx - 6, y: gy - 6, width: 76, height: 104, rx: 10, fill: "none", stroke: "#2e9bd6", "stroke-width": 3, "stroke-dasharray": "6 5" }));
            for (let k = 0; k < 10; k++) s.append(S("circle", { cx: gx + 14 + (k % 2) * 36, cy: gy + 10 + Math.floor(k / 2) * 19, r: 8, fill: T.m3(seed[t * 10 + k][2]) }));
          }
          for (let k = 0; k < ones; k++) s.append(S("circle", { cx: 40 + k * 26, cy: 530, r: 9, fill: T.m3(seed[tens * 10 + k][2]) }));
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
    title: "Doğruda nerede?", icon: "line", tone: "tomato", cat: "his", grades: [1, 4], short: "Sayı doğrusunda konum tahmini",
    render(host) {
      /* aralığı öğretmen seçer; negatif sayı yok */
      let ust = T.store.grade() <= 2 ? 10 : 100, a = 0, b = ust, target = 0, guess = null, show = false;
      const svg = S("svg", { viewBox: "0 0 1000 260", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "300px" } }, svg);
      const msg = h("div.readout", { style: { color: "var(--chalk)", fontSize: "24px" } });
      const nice = (v) => Math.round(v).toLocaleString("tr-TR");
      const secim = h("div.seg", [10, 100, 1000].map((u) => h("button", { "aria-pressed": String(u === ust), onclick: (e) => { ust = u; secim.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === e.currentTarget))); gen(); } }, "0 ile " + u.toLocaleString("tr-TR"))));
      function gen() {
        a = 0; b = ust;
        const adim = ust === 10 ? 1 : ust === 100 ? (Math.random() < 0.5 ? 1 : 5) : (Math.random() < 0.5 ? 10 : 50);
        do { target = Math.round((Math.random() * ust) / adim) * adim; } while (target <= 0 || target >= ust);
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
      host.append(h("div.row", secim), mat, h("div.row",
        h("button.btn.big.c-tomato", { onclick: gen }, T.icon("reset"), "Yeni sayı"),
        h("button.btn.c-chalk", { onclick: () => { show = true; paint(); } }, T.icon("eye"), "Doğru yeri göster"), msg),
        h("p.hint", "Bir öğrenci doğruya dokunarak tahminini işaretler, sınıf gerekçesini tartışır: yarısından önce mi sonra mı?"));
      gen();
    },
  });
})();
