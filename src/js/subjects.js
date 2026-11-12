/* Türkçe, Fen, Sosyal ve Hayat Bilgisi, İngilizce */
(function () {
  const { h } = T; const S = T.svg;
  const btn = (tone, icon, label, onclick) => h("button.btn.c-" + tone, { onclick }, icon ? T.icon(icon) : null, label);
  const seg = (opts, cur, on) => h("div.seg", opts.map(([v, l]) => h("button", { "aria-pressed": String(v === cur), onclick: (e) => { e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); on(v); } }, l)));

  function subjectSection(id, title, icon, tone, desc, intro) {
    T.sections[id] = {
      title, icon, tone, desc,
      render(view, sub) {
        if (sub && T.tools[sub]) return T.toolPage(view, sub);
        const wrap = h("div.view-inner"); view.append(wrap);
        wrap.append(h("div.page-head", h("h1", (T.dersAdi()[id]) || title), h("div.sub", intro)));
        const g = T.store.grade();
        const list = Object.entries(T.tools).filter(([, t]) => t.back === id).sort((a, b) => (fit(b[1], g) - fit(a[1], g)));
        const gruplar = {}; list.filter(([, t]) => fit(t, g)).concat(list.filter(([, t]) => !fit(t, g))).forEach((x) => { const gr = fit(x[1], g) ? x[1].grup || "Diğer araçlar" : "Başka sınıflar için"; (gruplar[gr] = gruplar[gr] || []).push(x); });
        const tek = Object.keys(gruplar).length === 1;
        const sira = (T.grupSira || {})[id] || [];
        Object.entries(gruplar).sort((a, b) => { const ia = sira.indexOf(a[0]), ib = sira.indexOf(b[0]); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); }).forEach(([gr, l]) => wrap.append(tek ? null : h("div.section-title", h("h2", gr)), h("div.tool-grid", { style: { marginBottom: "18px" } }, l.map(([k, t]) => h("button.tool-card.c-" + (t.tone || tone), { onclick: () => T.go(id + "-" + k) }, T.icon(t.icon), h("span", t.title, h("small", t.short || "")))))));
      },
    };
  }
  const fit = (t, g) => (t.grades && g >= t.grades[0] && g <= t.grades[1] ? 1 : 0);
  const tool = (sec, id, def) => (T.tools[id] = Object.assign({ back: sec }, def));

  /* ===================== TÜRKÇE ===================== */
  subjectSection("turkce", "Türkçe", "turkce", "tomato", "Okuma hızı, metin uyarlayıcı, yazım", "Okuma hızı, yapay zekâ ile metin uyarlama, anlama, söz varlığı ve yazım için sınıf araçları.");
  const VOW = "aeıioöuüâîû";
  T.heceler = function (word) {
    const w = word.toLocaleLowerCase("tr-TR");
    const v = []; for (let i = 0; i < w.length; i++) if (VOW.includes(w[i])) v.push(i);
    if (v.length <= 1) return [word];
    const cuts = [];
    for (let k = 0; k < v.length - 1; k++) {
      const a = v[k], b = v[k + 1], c = b - a - 1;
      cuts.push(c <= 1 ? a + 1 : b - 1);
    }
    const out = []; let s = 0; cuts.forEach((c) => { out.push(word.slice(s, c)); s = c; }); out.push(word.slice(s));
    return out;
  };
  tool("turkce", "hece", {
    title: "Hecelere ayır", icon: "hece", tone: "tomato", grades: [1, 4], short: "Kelimeyi renkli hece kartlarına böler",
    render(host) {
      const inp = h("input.in", { value: "Kelebek bahçede uçuyor", style: { fontSize: "22px" }, "aria-label": "Kelime ya da cümle" });
      const out = h("div.mat.mat-pad", { style: { minHeight: "300px", display: "flex", flexWrap: "wrap", gap: "28px 36px", alignContent: "center", justifyContent: "center" } });
      const cols = ["#ffc233", "#2e9bd6", "#6cc04a", "#f27ba9", "#ff9a3c"];
      let mix = false;
      function paint() {
        out.replaceChildren(...inp.value.split(/\s+/).filter(Boolean).map((wd) => {
          const clean = wd.replace(/[.,!?;:"'()]/g, "");
          let hs = T.heceler(clean); if (mix) hs = T.shuffle(hs);
          return h("div", { style: { display: "flex", gap: "6px" } }, hs.map((x, i) => h("button", { onclick: () => T.speak(x), style: { border: 0, background: cols[i % 5], color: "#2a2a2a", fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(36px,5vw,72px)", padding: "6px 18px", borderRadius: "12px", boxShadow: "0 5px 0 rgba(0,0,0,.25)", lineHeight: 1.1 } }, x)));
        }));
      }
      inp.addEventListener("input", paint);
      host.append(inp, out, h("div.row", btn("tomato", "speaker", "Oku", () => T.speak(inp.value)), btn("chalk", "dice", "Heceleri karıştır / düzelt", () => { mix = !mix; paint(); }),
        h("span.hint", "Bir heceye dokununca sesli okunur. Karıştır ile öğrenciler heceleri doğru sıraya dizmeye çalışır.")));
      paint();
    },
  });

  const SES = [["e", "el, ev, ekmek"], ["l", "lale, ela, lamba"], ["a", "al, ana, araba"], ["k", "kale, kek, kalem"], ["i", "iki, ilk, inek"], ["n", "nane, nine, nar"],
    ["o", "ok, oyun, okul"], ["m", "mama, masa, mum"], ["u", "un, uçak, uzun"], ["t", "top, tat, tavuk"], ["ü", "üzüm, ütü, üç"], ["y", "yol, yay, yemek"],
    ["ö", "ördek, öykü, önlük"], ["r", "renk, resim, roket"], ["ı", "ılık, ırmak, ışık"], ["d", "dede, dal, deniz"], ["s", "su, saat, simit"], ["b", "balık, bebek, bulut"],
    ["z", "zil, zar, zeytin"], ["ç", "çiçek, çay, çanta"], ["g", "gemi, göz, güneş"], ["ş", "şeker, şapka, şemsiye"], ["c", "cam, ceviz, ceket"], ["p", "pul, pasta, pencere"],
    ["h", "hava, halı, horoz"], ["ğ", "dağ, ağaç, yağmur"], ["v", "vazo, ver, vapur"], ["f", "fil, fare, fener"], ["j", "jeton, jöle, jilet"]];
  const SIRA = ["a", "n", "e", "t", "i", "l", "o", "k", "u", "r", "ı", "m", "ü", "s", "ö", "y", "d", "z", "ç", "b", "g", "ş", "c", "p", "h", "ğ", "v", "f", "j"];
  SES.sort((x, y) => SIRA.indexOf(x[0]) - SIRA.indexOf(y[0]));
  tool("turkce", "ses", {
    title: "Ses kartları", icon: "letters", tone: "sun", grades: [1, 2], short: "İlk okuma yazma ses grupları",
    render(host) {
      let i = 0, upper = false;
      const card = h("div.mat", { style: { minHeight: "420px", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center" } });
      const strip = h("div.row", { style: { gap: "6px" } });
      function paint() {
        const [l, ex] = SES[i];
        card.replaceChildren(
          h("button", { onclick: () => T.speak(l), style: { border: 0, background: "transparent", fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(160px,22vw,300px)", lineHeight: 1, color: "#ef5b3b" } }, upper ? T.trUpper(l) : l, h("span", { style: { color: "#2e9bd6", fontSize: ".5em" } }, " " + (upper ? l : T.trUpper(l)))),
          h("div", { style: { padding: "20px", display: "grid", gap: "14px" } }, h("div.hint", (i + 1) + ". ses"),
            ...ex.split(", ").map((w) => h("button.btn.c-chalk", { style: { justifyContent: "flex-start", fontSize: "30px", minHeight: "64px" }, onclick: () => T.speak(w) }, T.icon("speaker"), w.split("").map((ch) => ch === l ? h("span", { style: { color: "#ef5b3b" } }, ch) : ch)))));
        strip.replaceChildren(...SES.map(([x], k) => h("button.btn.sm" + (k === i ? ".c-sun" : ".c-chalk"), { style: { minWidth: "44px", fontSize: "20px" }, onclick: () => { i = k; paint(); } }, x)));
      }
      host.append(card, strip, h("div.row", btn("chalk", "back", "Önceki", () => { i = (i + SES.length - 1) % SES.length; paint(); }), btn("sun", "next", "Sonraki", () => { i = (i + 1) % SES.length; paint(); }), btn("chalk", "letters", "Büyük / küçük harf", () => { upper = !upper; paint(); }),
        h("span.hint", "Sıralama Maarif Modeli 1. sınıf ilk okuma yazma kitabını izler: a, n, e, t, i, l, o, k, u, r, ı, m...")));
      paint();
    },
  });

  tool("turkce", "kelime-duvari", {
    title: "Kelime duvarı", icon: "wall", tone: "grape", grades: [1, 8], short: "Sınıfın kelime duvarı, harfe göre",
    render(host) {
      const key = "wordwall";
      const s = T.store.get(); s.wordwall = s.wordwall || ["merak", "sorgulamak", "gözlem", "tahmin", "deney", "kanıt", "sonuç", "kavram", "öğrenme", "araştırma"];
      const inp = h("input.in", { placeholder: "Yeni kelime yaz, Enter'a bas", style: { maxWidth: "380px" } });
      const wall = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "14px" } });
      const tones = ["#ffc233", "#ef5b3b", "#2e9bd6", "#6cc04a", "#8a5cd0", "#f27ba9"];
      function paint() {
        const by = {}; s.wordwall.slice().sort((a, b) => a.localeCompare(b, "tr")).forEach((w) => { const l = T.trUpper(w[0]); (by[l] = by[l] || []).push(w); });
        wall.replaceChildren(...Object.entries(by).map(([l, ws], i) => h("div.paper", { style: { padding: "12px 14px", borderTop: `10px solid ${tones[i % 6]}` } },
          h("div", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "36px", lineHeight: 1 } }, l),
          ws.map((w) => h("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "20px", fontWeight: 600 } }, h("span", { style: { flex: 1 } }, w),
            h("button.btn.sm.icon.c-chalk", { "aria-label": w + " oku", onclick: () => T.speak(w) }, T.icon("speaker")),
            h("button.btn.sm.icon.c-chalk", { "aria-label": w + " sil", onclick: () => { s.wordwall = s.wordwall.filter((x) => x !== w); T.store.save(); paint(); } }, T.icon("close")))))));
      }
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim()) { s.wordwall.push(inp.value.trim()); T.store.save(); inp.value = ""; paint(); } });
      host.append(h("div.row", inp, btn("grape", "name", "Rastgele kelime", () => { const w = T.pick(s.wordwall); T.modal({ title: "Kelime", body: h("div", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "80px", textAlign: "center" } }, w), actions: [{ label: "Oku", onClick: () => { T.speak(w); return false; } }, { label: "Kapat" }] }); })), wall);
      paint();
    },
  });

  const YAZIM = [
    ["Ben ___ seninle geleceğim.", "de", "ayrı", "Bağlaç olan de ayrı yazılır. Cümleden çıkarınca anlam daralır ama bozulmaz."],
    ["Kitabım çanta___ duruyor.", "da", "bitişik", "Bulunma eki da bitişik yazılır: çantada."],
    ["Okul___ bayram coşkusu vardı.", "da", "bitişik", "Okulda: bulunma eki."],
    ["Annem ___ babam da bizi bekliyor.", "de", "ayrı", "Bağlaç olan de, kendinden önceki kelimeden ayrı yazılır."],
    ["Biliyorum ___ bu işi başaracaksın.", "ki", "ayrı", "Bağlaç olan ki ayrı yazılır."],
    ["Masadaki kalem benim. Senin___ nerede?", "", "bitişik", "Aitlik bildiren -ki eki bitişik yazılır: seninki."],
        ["Bugün hava güzel ___?", "mi", "ayrı", "Soru eki mi her zaman ayrı yazılır."],
    ["Sen ___ yaptın bu resmi?", "mi", "ayrı", "Soru eki mi ayrı yazılır ve kendinden önceki kelimeye göre uyum gösterir."],
    ["Ev___ herkes uyuyordu.", "deki", "bitişik", "Evdeki: bulunma eki ve -ki eki kelimeye bitişik yazılır."],
    ["Dün akşam ___ yağmur yağdı.", "da", "ayrı", "Bağlaç olan da ayrı yazılır."],
    ["Müze___ eski paralar sergileniyor.", "de", "bitişik", "Müzede: bulunma eki."],
  ].filter((x) => x[2]);
  tool("turkce", "yazim", {
    title: "Ayrı mı bitişik mi?", icon: "spell", tone: "leaf", grades: [2, 8], short: "de/da, ki, mi alıştırması",
    render(host) {
      let i = 0, score = 0, answered = false;
      const box = h("div.mat.mat-pad", { style: { minHeight: "320px", display: "grid", gap: "20px", alignContent: "center", justifyItems: "center", textAlign: "center" } });
      function paint() {
        const [q, part, ans, why] = YAZIM[i];
        answered = false;
        const sentence = h("div", { style: { fontSize: "clamp(28px,3.6vw,48px)", fontWeight: 600 } }, q.replace("___", part ? " [" + part + "] " : " [ki] "));
        const fb = h("div", { style: { fontSize: "20px", minHeight: "60px", maxWidth: "60ch" } });
        const choose = (c) => { if (answered) return; answered = true; const ok = c === ans; if (ok) { score++; T.sound.ok(); } else T.sound.no(); fb.replaceChildren(h("b", { style: { color: ok ? "#1e6b33" : "#9b2218" } }, ok ? "Doğru. " : "Bu sefer olmadı. "), why); };
        box.replaceChildren(h("div.hint", `${i + 1} / ${YAZIM.length}   Puan: ${score}`), sentence,
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.big.c-sky", { onclick: () => choose("ayrı") }, "Ayrı yazılır"), h("button.btn.big.c-sun", { onclick: () => choose("bitişik") }, "Bitişik yazılır")), fb);
      }
      host.append(box, h("div.row", btn("chalk", "back", "Önceki", () => { i = (i + YAZIM.length - 1) % YAZIM.length; paint(); }), btn("leaf", "next", "Sonraki", () => { i = (i + 1) % YAZIM.length; paint(); }), btn("chalk", "reset", "Puanı sıfırla", () => { score = 0; paint(); })));
      paint();
    },
  });

  /* ===================== FEN ===================== */
  subjectSection("fen", "Fen Bilimleri", "fen", "leaf", "Deney tablosu, birim, ay, devre", "Deneyde ölçüm almak ve gözlemi görselleştirmek için.");
  tool("fen", "deney", {
    title: "Deney ve ölçüm tablosu", icon: "thermo", tone: "leaf", grades: [3, 8], short: "Zamanlayıcıyla ölç, tablo ve grafik",
    render(host) {
      let rows = [[0, 22], [2, 26], [4, 31], [6, 35]], xl = "Zaman (dk)", yl = "Sıcaklık (°C)", title = "Isıtılan suyun sıcaklığı";
      const svg = S("svg", { viewBox: "0 0 700 420", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "440px" } }, svg);
      const tb = h("div.paper", { style: { padding: "14px", display: "grid", gap: "8px", alignContent: "start" } });
      function paint() {
        svg.replaceChildren(S("text", { x: 350, y: 30, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 24 }, title));
        const xs = rows.map((r) => r[0]), ys = rows.map((r) => r[1]);
        const x0 = Math.min(0, ...xs), x1 = Math.max(1, ...xs), y0 = Math.min(0, ...ys), y1 = Math.max(1, ...ys) * 1.1;
        const X = (v) => 70 + ((v - x0) / (x1 - x0 || 1)) * 590, Y = (v) => 370 - ((v - y0) / (y1 - y0 || 1)) * 310;
        for (let k = 0; k <= 5; k++) { const v = y0 + ((y1 - y0) / 5) * k; svg.append(S("line", { x1: 70, y1: Y(v), x2: 660, y2: Y(v), stroke: "rgba(0,0,0,.08)" })); svg.append(S("text", { x: 62, y: Y(v), "text-anchor": "end", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 13 }, Math.round(v * 10) / 10)); }
        svg.append(S("text", { x: 365, y: 410, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 15 }, xl), S("text", { x: 18, y: 210, "text-anchor": "middle", transform: "rotate(-90 18 210)", "font-family": "Lexend, sans-serif", "font-size": 15 }, yl));
        const sorted = rows.slice().sort((a, b) => a[0] - b[0]);
        if (sorted.length > 1) svg.append(S("polyline", { points: sorted.map(([x, y]) => X(x) + "," + Y(y)).join(" "), fill: "none", stroke: "#26b3a0", "stroke-width": 4, "stroke-linejoin": "round" }));
        sorted.forEach(([x, y]) => { svg.append(S("circle", { cx: X(x), cy: Y(y), r: 7, fill: "#26b3a0", stroke: "#2a2a2a", "stroke-width": 2 })); svg.append(S("text", { x: X(x), y: 392, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 13 }, x)); });
        const mk = (v, on, w = "100%") => { const i = h("input.in", { value: v, style: { width: w, minHeight: "38px", padding: "4px 8px" } }); i.addEventListener("change", () => { on(i.value); paint(); }); return i; };
        tb.replaceChildren(mk(title, (v) => (title = v)), h("div.row", { style: { gap: "6px", flexWrap: "nowrap" } }, mk(xl, (v) => (xl = v)), mk(yl, (v) => (yl = v))),
          ...rows.map((r, i) => h("div.row", { style: { gap: "6px", flexWrap: "nowrap" } }, mk(r[0], (v) => (r[0] = +v || 0)), mk(r[1], (v) => (r[1] = +String(v).replace(",", ".") || 0)), h("button.btn.sm.icon.c-tomato", { "aria-label": "Satırı sil", onclick: () => { rows.splice(i, 1); paint(); } }, T.icon("trash")))),
          h("button.btn.sm.c-chalk", { onclick: () => { const last = rows[rows.length - 1] || [0, 0]; rows.push([last[0] + (rows.length > 1 ? rows[rows.length - 1][0] - rows[rows.length - 2][0] : 1), last[1]]); paint(); } }, T.icon("plus"), "Ölçüm ekle"));
      }
      host.append(h("div", { style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: "16px" } }, mat, tb),
        h("div.row", btn("leaf", "timer", "Ders ekranına zamanlayıcı koy", () => T.board.add("stopwatch")), btn("chalk", "reset", "Tabloyu boşalt", () => { rows = [[0, 0]]; paint(); }),
          h("span.hint", "Beklenen sonuç çıkmazsa tabloyu silmeyin: farklı çıkan ölçüm, neyin değiştiğini konuşmak için en iyi kanıttır.")));
      paint();
    },
  });

  const BIRIM = {
    "Uzunluk": [["mm", 0.001], ["cm", 0.01], ["dm", 0.1], ["m", 1], ["km", 1000]],
    "Kütle": [["mg", 0.001], ["g", 1], ["kg", 1000], ["ton", 1e6]],
    "Hacim": [["mL", 0.001], ["L", 1], ["cm³", 0.001], ["m³", 1000]],
    "Zaman": [["saniye", 1], ["dakika", 60], ["saat", 3600], ["gün", 86400]],
  };
  tool("fen", "birim", {
    title: "Birim çevirici", icon: "ruler", tone: "sky", grades: [3, 8], short: "Uzunluk, kütle, hacim, zaman, sıcaklık",
    render(host) {
      let kind = "Uzunluk", from = "m", val = 1.5;
      const out = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "12px" } });
      const inp = h("input.in", { type: "number", value: val, style: { fontSize: "26px", maxWidth: "220px" }, "aria-label": "Değer" });
      const sel = h("select.in", { style: { maxWidth: "200px" }, "aria-label": "Birim" });
      const fmt = (x) => (Math.abs(x) >= 1e6 || (Math.abs(x) < 0.001 && x) ? x.toExponential(3).replace(".", ",") : (Math.round(x * 1e6) / 1e6).toLocaleString("tr-TR"));
      function paint() {
        val = +inp.value || 0;
        if (kind === "Sıcaklık") {
          const c = from === "°C" ? val : from === "°F" ? ((val - 32) * 5) / 9 : val - 273.15;
          out.replaceChildren(...[["°C", c], ["°F", (c * 9) / 5 + 32], ["K", c + 273.15]].map(([u, v]) => h("div.paper", { style: { padding: "14px 16px" } }, h("div.hint", u), h("div.readout", fmt(v)))));
          return;
        }
        const list = BIRIM[kind], base = val * list.find((u) => u[0] === from)[1];
        out.replaceChildren(...list.map(([u, f]) => h("div.paper", { style: { padding: "14px 16px", outline: u === from ? "3px solid var(--sky)" : "none" } }, h("div.hint", u), h("div.readout", fmt(base / f)))));
      }
      function setKind(k) { kind = k; const units = k === "Sıcaklık" ? ["°C", "°F", "K"] : BIRIM[k].map((u) => u[0]); from = units[k === "Uzunluk" ? 3 : 0]; sel.replaceChildren(...units.map((u) => h("option", { value: u, selected: u === from }, u))); paint(); }
      inp.addEventListener("input", paint); sel.addEventListener("change", () => { from = sel.value; paint(); });
      host.append(seg(Object.keys(BIRIM).concat("Sıcaklık").map((k) => [k, k]), kind, setKind), h("div.row", inp, sel), out);
      setKind("Uzunluk");
    },
  });

  tool("fen", "ay", {
    title: "Ay'ın evreleri", icon: "moon", tone: "grape", grades: [4, 8], short: "Gün gün Ay'ın görünüşü",
    render(host) {
      let d = 7;
      const svg = S("svg", { viewBox: "0 0 900 420", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "440px", background: "#141a33" } }, svg);
      const name = h("div.readout", { style: { color: "var(--chalk)" } });
      const NAMES = [[1, "Yeni Ay"], [6.4, "Hilal (büyüyen)"], [8.4, "İlk Dördün"], [13.8, "Şişkin Ay (büyüyen)"], [15.8, "Dolunay"], [21.1, "Şişkin Ay (küçülen)"], [23.1, "Son Dördün"], [28.5, "Hilal (küçülen)"], [29.6, "Yeni Ay"]];
      function paint() {
        const ph = (d % 29.53) / 29.53, R = 150, cx = 260, cy = 210;
        svg.replaceChildren();
        for (let i = 0; i < 60; i++) svg.append(S("circle", { cx: (i * 137) % 900, cy: (i * 71) % 420, r: (i % 3) + 0.6, fill: "#fff", opacity: 0.6 }));
        svg.append(S("circle", { cx, cy, r: R, fill: "#2b2f45" }));
        const k = Math.cos(ph * 2 * Math.PI), waxing = ph < 0.5;
        const rx = Math.abs(k) * R, sweepLit = waxing ? 1 : 0;
        const p = `M${cx} ${cy - R} A ${R} ${R} 0 0 ${sweepLit} ${cx} ${cy + R} A ${rx} ${R} 0 0 ${(k > 0) === waxing ? 0 : 1} ${cx} ${cy - R}`;
        svg.append(S("path", { d: p, fill: "#f4efd8" }));
        // Güneş ve Dünya düzeni
        const ox = 690, oy = 210;
        svg.append(S("circle", { cx: ox, cy: oy, r: 120, fill: "none", stroke: "rgba(255,255,255,.3)", "stroke-dasharray": "6 6" }));
        svg.append(S("circle", { cx: ox, cy: oy, r: 26, fill: "#2e9bd6" }), S("text", { x: ox, y: oy + 48, "text-anchor": "middle", fill: "#fff", "font-family": "Lexend, sans-serif", "font-size": 15 }, "Dünya"));
        const a = ph * 2 * Math.PI;
        svg.append(S("circle", { cx: ox + Math.cos(a) * 120, cy: oy - Math.sin(a) * 120, r: 14, fill: "#f4efd8" }));
        svg.append(S("text", { x: 890, y: 30, "text-anchor": "end", fill: "#ffc233", "font-family": "Lexend, sans-serif", "font-size": 16 }, "Güneş ışığı ←"));
        name.textContent = `${Math.round(d)}. gün: ${NAMES.find((n) => d < n[0])[1]}`;
      }
      const sl = h("input", { type: "range", min: 0, max: 29.5, step: 0.5, value: d, "aria-label": "Gün", oninput: (e) => { d = +e.target.value; paint(); } });
      host.append(mat, sl, name, h("p.hint", "Sağdaki çizimde Güneş ışığı soldan gelir. Ay Dünya'nın etrafında döndükçe aydınlık yüzünün ne kadarını gördüğümüz değişir."));
      paint();
    },
  });

  tool("fen", "devre", {
    title: "Basit elektrik devresi", icon: "circuit", tone: "sun", grades: [4, 8], short: "Pil, anahtar, ampul; seri ve paralel",
    render(host) {
      let pil = 1, ampul = 2, anahtar = true, paralel = false;
      const svg = S("svg", { viewBox: "0 0 900 440", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "460px" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "22px" } });
      function bulb(x, y, b) {
        const g = S("g", { transform: `translate(${x},${y})` });
        if (b > 0) g.append(S("circle", { r: 40 + b * 30, fill: "#ffe27a", opacity: 0.15 + b * 0.35 }));
        g.append(S("circle", { r: 30, fill: b > 0 ? `rgba(255,214,64,${0.35 + b * 0.65})` : "#eef0f2", stroke: "#2a2a2a", "stroke-width": 3 }));
        g.append(S("path", { d: "M-10 6l5-14 5 10 5-10 5 14", fill: "none", stroke: "#2a2a2a", "stroke-width": 2.5 }));
        g.append(S("rect", { x: -14, y: 28, width: 28, height: 16, fill: "#9aa3ab", stroke: "#2a2a2a", "stroke-width": 2 }));
        return g;
      }
      function paint() {
        svg.replaceChildren();
        const closed = anahtar && pil > 0 && ampul > 0;
        const br = closed ? (paralel ? Math.min(1, pil * 0.6) : Math.min(1, (pil * 0.9) / ampul)) : 0;
        const wire = closed ? "#e2473b" : "#2a2a2a";
        svg.append(S("rect", { x: 100, y: 80, width: 700, height: 280, fill: "none", stroke: wire, "stroke-width": 5, rx: 8 }));
        // pil
        for (let i = 0; i < pil; i++) { const x = 90 + i * 0; const y = 150 + i * 60; svg.append(S("rect", { x: 70, y, width: 60, height: 40, rx: 6, fill: "#2a2a2a" }), S("rect", { x: 70, y, width: 60, height: 14, rx: 4, fill: "#f0a329" }), S("text", { x: 140, y: y + 26, "font-family": "Lexend, sans-serif", "font-size": 14, fill: "#2a2a2a" }, "1,5 V")); }
        if (!pil) svg.append(S("text", { x: 100, y: 220, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 16, fill: "#c0392b" }, "Pil yok"));
        // anahtar
        svg.append(S("rect", { x: 330, y: 340, width: 120, height: 40, fill: "#fff" }));
        svg.append(S("circle", { cx: 340, cy: 360, r: 7, fill: "#2a2a2a" }), S("circle", { cx: 440, cy: 360, r: 7, fill: "#2a2a2a" }));
        svg.append(S("line", { x1: 340, y1: 360, x2: anahtar ? 440 : 425, y2: anahtar ? 360 : 310, stroke: "#2a2a2a", "stroke-width": 6, "stroke-linecap": "round" }));
        svg.append(S("text", { x: 390, y: 410, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 15 }, anahtar ? "Anahtar kapalı (akım geçer)" : "Anahtar açık"));
        if (!paralel) for (let i = 0; i < ampul; i++) { const x = 300 + i * (400 / Math.max(1, ampul)); svg.append(S("rect", { x: x - 32, y: 50, width: 64, height: 60, fill: "#fff" })); svg.append(bulb(x, 56, br)); }
        else for (let i = 0; i < ampul; i++) { const x = 300 + i * 170; svg.append(S("line", { x1: x, y1: 80, x2: x, y2: 230, stroke: wire, "stroke-width": 5 }), S("line", { x1: x, y1: 230, x2: x + 0, y2: 360, stroke: wire, "stroke-width": 5 })); svg.append(bulb(x, 200, br)); }
        out.textContent = closed ? (paralel ? "Paralel bağlı ampullerin her biri pilin gerilimini alır, parlaklık azalmaz." : ampul > 1 ? "Seri bağlı ampul sayısı arttıkça her biri daha sönük yanar." : "Devre tamamlandı, ampul yanıyor.") : "Devre açık. Akımın geçmesi için yol kesintisiz olmalı.";
      }
      const counter = (lbl, get, set, min, max) => h("div.row", { style: { gap: "6px" } }, h("span.hint", { style: { color: "var(--chalk)" } }, lbl), h("button.btn.sm.icon.c-chalk", { "aria-label": lbl + " azalt", onclick: () => { set(Math.max(min, get() - 1)); paint(); } }, T.icon("minus")), h("button.btn.sm.icon.c-chalk", { "aria-label": lbl + " artır", onclick: () => { set(Math.min(max, get() + 1)); paint(); } }, T.icon("plus")));
      host.append(h("div.row", counter("Pil", () => pil, (v) => (pil = v), 0, 3), counter("Ampul", () => ampul, (v) => (ampul = v), 0, 3),
        btn("sun", "bolt", "Anahtarı aç / kapat", () => { anahtar = !anahtar; T.sound.tick(); paint(); }),
        seg([[false, "Seri"], [true, "Paralel"]], paralel, (v) => { paralel = v; paint(); })), mat, out);
      paint();
    },
  });

  /* ===================== SOSYAL / HAYAT ===================== */
  subjectSection("sosyal", "Hayat Bilgisi ve Sosyal", "sosyal", "sky", "Zaman şeridi, aile ağacı, harita", "Zamanı, yakın çevreyi ve haritayı somutlaştıran araçlar.");
  tool("sosyal", "zaman", {
    title: "Zaman şeridi", icon: "timeline", tone: "sky", grades: [1, 8], short: "Olayları sıraya diz",
    render(host) {
      const s = T.store.get();
      s.timeline = s.timeline || [[1919, "Atatürk Samsun'a çıktı"], [1920, "TBMM açıldı"], [1923, "Cumhuriyet ilan edildi"], [1928, "Harf Devrimi"], [1934, "Soyadı Kanunu"]];
      const svg = S("svg", { viewBox: "0 0 1100 360", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "380px" } }, svg);
      const yi = h("input.in", { type: "number", placeholder: "Yıl", style: { width: "110px" }, "aria-label": "Yıl" });
      const ti = h("input.in", { placeholder: "Olay", style: { maxWidth: "340px" }, "aria-label": "Olay" });
      function paint() {
        const ev = s.timeline.slice().sort((a, b) => a[0] - b[0]);
        svg.replaceChildren(S("line", { x1: 40, y1: 180, x2: 1060, y2: 180, stroke: "#2a2a2a", "stroke-width": 6, "stroke-linecap": "round" }));
        if (!ev.length) return;
        const a = ev[0][0], b = ev[ev.length - 1][0], X = (y) => (a === b ? 550 : 80 + ((y - a) / (b - a)) * 940);
        ev.forEach(([y, t], i) => {
          const up = i % 2 === 0, x = X(y), col = ["#ef5b3b", "#2e9bd6", "#6cc04a", "#8a5cd0", "#f0a329"][i % 5];
          svg.append(S("line", { x1: x, y1: 180, x2: x, y2: up ? 100 : 260, stroke: col, "stroke-width": 3 }), S("circle", { cx: x, cy: 180, r: 11, fill: col, stroke: "#2a2a2a", "stroke-width": 3 }));
          svg.append(S("text", { x, y: up ? 88 : 290, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 26, fill: col }, y));
          const words = t.split(" "), lines = []; let cur = ""; words.forEach((w) => { if ((cur + " " + w).trim().length > 16) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); lines.push(cur);
          lines.forEach((ln, k) => svg.append(S("text", { x, y: up ? 60 - (lines.length - 1 - k) * 20 : 312 + k * 20, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 16, fill: "#2a2a2a" }, ln)));
        });
      }
      host.append(mat, h("div.row", yi, ti, btn("sky", "plus", "Ekle", () => { if (!yi.value || !ti.value.trim()) return; s.timeline.push([+yi.value, ti.value.trim()]); T.store.save(); yi.value = ti.value = ""; paint(); }),
        btn("chalk", "back", "Son olayı sil", () => { s.timeline.pop(); T.store.save(); paint(); }), btn("chalk", "reset", "Boşalt", () => { s.timeline = []; T.store.save(); paint(); }),
        h("span.hint", "Yıl yerine çocuğun yaşını da yazabilirsin: 0 doğdum, 3 kardeşim oldu, 6 okula başladım.")));
      paint();
    },
  });

  tool("sosyal", "aile", {
    title: "Aile ağacı", icon: "tree", tone: "leaf", grades: [1, 5], short: "Kutulara yaz, kuşakları konuş",
    render(host) {
      const s = T.store.get();
      s.family = s.family || { "Büyükanne (anne tarafı)": "", "Büyükbaba (anne tarafı)": "", "Büyükanne (baba tarafı)": "", "Büyükbaba (baba tarafı)": "", Anne: "", Baba: "", Ben: "", Kardeş: "" };
      const f = s.family;
      const box = (k, x, y, tone) => {
        const i = h("input", { value: f[k], placeholder: k, "aria-label": k, style: { width: "100%", border: 0, background: "transparent", textAlign: "center", fontFamily: "var(--display)", fontWeight: 800, fontSize: "22px", color: "#2a2a2a", outline: "none" } });
        i.addEventListener("input", () => { f[k] = i.value; T.store.save(); });
        return h("div", { style: { position: "absolute", left: x + "%", top: y + "%", width: "21%", transform: "translateX(-50%)", background: tone, borderRadius: "14px", padding: "10px 8px", boxShadow: "0 4px 0 rgba(0,0,0,.25)", textAlign: "center" } }, i, h("div.hint", { style: { fontSize: "12px" } }, k));
      };
      const lines = S("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", style: "position:absolute;inset:0;width:100%;height:100%" });
      lines.innerHTML = '<path d="M14 18v10h22V18M64 18v10h22V18M25 28v12h50V28M50 40v22M50 62v10M38 72h24" fill="none" stroke="#2a2a2a" stroke-width=".5"/>';
      const mat = h("div.mat", { style: { height: "560px" } }, lines,
        box("Büyükanne (anne tarafı)", 14, 6, "#f9d7e4"), box("Büyükbaba (anne tarafı)", 36, 6, "#d7ecfb"), box("Büyükanne (baba tarafı)", 64, 6, "#f9d7e4"), box("Büyükbaba (baba tarafı)", 86, 6, "#d7ecfb"),
        box("Anne", 25, 36, "#ffe5a8"), box("Baba", 75, 36, "#ffe5a8"), box("Ben", 38, 72, "#c9efb9"), box("Kardeş", 62, 72, "#c9efb9"));
      host.append(mat, h("p.hint", "Tahtada boş şablonla örnek yapın. Öğrenci adları ya da aile bilgileri buraya kaydedilmek zorunda değil; ders sonunda Temizle ile silin."),
        h("div.row", btn("chalk", "reset", "Temizle", () => { Object.keys(f).forEach((k) => (f[k] = "")); T.store.save(); T.route(); })));
    },
  });

  tool("sosyal", "harita", {
    title: "Harita okuma", icon: "map", tone: "tomato", grades: [2, 6], short: "Yön, koordinat, lejant",
    render(host) {
      const SYMS = [["Okul", "#ef5b3b", "M-14 10V-4L0-14 14-4V10z"], ["Park", "#6cc04a", "M0-14a10 10 0 1 1 0 20 10 10 0 1 1 0-20M0 6v8"], ["Hastane", "#2e9bd6", "M-12-12h24v24h-24zM-3-8h6v5h5v6h-5v5h-6v-5h-5v-6h5z"], ["Market", "#f0a329", "M-14-6h28l-3 16h-22zM-8-6l3-8M8-6l-3-8"], ["Kütüphane", "#8a5cd0", "M-12-12h10v24h-10zM2-12h10v24H2z"], ["Durak", "#2a2a2a", "M-3-14h6v28h-6zM-10-14h20v8h-20z"], ["Ev", "#b9834a", "M-12 12V-2L0-12 12-2v14z"], ["Cami", "#26b3a0", "M-10 12V0a10 10 0 0 1 20 0v12zM12-14v26"]];
      const C = 8, R = 6;
      let map = [], q = null;
      function gen() { map = []; const cells = T.shuffle(Array.from({ length: C * R }, (_, i) => i)).slice(0, 12); cells.forEach((c, i) => map.push({ c: c % C, r: Math.floor(c / C), s: SYMS[i % SYMS.length] })); q = null; paint(); }
      const svg = S("svg", { viewBox: "0 0 900 620", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)", background: "#eef4e6" } }, svg);
      const qbox = h("div.readout", { style: { color: "var(--chalk)", fontSize: "24px" } });
      const L = "ABCDEFGH";
      function paint() {
        svg.replaceChildren();
        const ox = 80, oy = 60, U = 80;
        for (let i = 0; i <= C; i++) svg.append(S("line", { x1: ox + i * U, y1: oy, x2: ox + i * U, y2: oy + R * U, stroke: "rgba(0,0,0,.2)" }));
        for (let j = 0; j <= R; j++) svg.append(S("line", { x1: ox, y1: oy + j * U, x2: ox + C * U, y2: oy + j * U, stroke: "rgba(0,0,0,.2)" }));
        for (let i = 0; i < C; i++) svg.append(S("text", { x: ox + i * U + U / 2, y: oy - 14, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 22 }, L[i]));
        for (let j = 0; j < R; j++) svg.append(S("text", { x: ox - 18, y: oy + j * U + U / 2, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 22 }, j + 1));
        map.forEach((m) => { const g = S("g", { transform: `translate(${ox + m.c * U + U / 2},${oy + m.r * U + U / 2}) scale(1.4)` }); g.append(S("path", { d: m.s[2], fill: m.s[1], stroke: "#2a2a2a", "stroke-width": 1.5 })); svg.append(g); });
        const cx = 820, cy = 120;
        svg.append(S("circle", { cx, cy, r: 50, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 3 }), S("path", { d: `M${cx} ${cy - 44}l10 44h-20z`, fill: "#e2473b" }), S("path", { d: `M${cx} ${cy + 44}l10-44h-20z`, fill: "#2a2a2a" }));
        [["K", 0, -62], ["G", 0, 70], ["D", 64, 6], ["B", -64, 6]].forEach(([t, dx, dy]) => svg.append(S("text", { x: cx + dx, y: cy + dy, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 22 }, t)));
        SYMS.forEach((s, i) => { const g = S("g", { transform: `translate(${762},${230 + i * 46}) scale(.9)` }); g.append(S("path", { d: s[2], fill: s[1], stroke: "#2a2a2a", "stroke-width": 1.5 })); svg.append(g, S("text", { x: 784, y: 236 + i * 46, "font-family": "Lexend, sans-serif", "font-size": 16 }, s[0])); });
      }
      function ask() {
        const a = T.pick(map), kinds = ["coord", "dir"]; const k = T.pick(kinds);
        if (k === "coord") q = `${L[a.c]}${a.r + 1} karesinde ne var?  Cevap: ${a.s[0]}`;
        else { const b = T.pick(map.filter((m) => m !== a)); const ns = b.r < a.r ? "kuzeyinde" : b.r > a.r ? "güneyinde" : ""; const ew = b.c > a.c ? "doğusunda" : b.c < a.c ? "batısında" : ""; q = `${b.s[0]}, ${a.s[0]} binasının hangi yönünde?  Cevap: ${[ns, ew].filter(Boolean).join(" ve ")}`; }
        const [soru, cevap] = q.split("  Cevap: ");
        qbox.replaceChildren(soru, " ", h("button.btn.sm.c-chalk", { onclick: (e) => { e.target.replaceWith(h("span", { style: { color: "var(--sun)" } }, cevap)); } }, "Cevabı göster"));
      }
      host.append(mat, h("div.row", btn("tomato", "dice", "Soru sor", ask), btn("chalk", "reset", "Yeni harita", gen), qbox));
      gen();
    },
  });

  /* ===================== İNGİLİZCE ===================== */
  subjectSection("ingilizce", "İngilizce", "ingilizce", "grape", "Kelime kartları, dinle ve seç", "Resimli kelime kartları, sesli telaffuz ve dinleme oyunu.");
  const VOCAB = {
    "Colors": [["red", "kırmızı", "🟥"], ["blue", "mavi", "🟦"], ["green", "yeşil", "🟩"], ["yellow", "sarı", "🟨"], ["orange", "turuncu", "🟧"], ["purple", "mor", "🟪"], ["black", "siyah", "⬛"], ["white", "beyaz", "⬜"]],
    "Animals": [["cat", "kedi", "🐱"], ["dog", "köpek", "🐶"], ["bird", "kuş", "🐦"], ["fish", "balık", "🐟"], ["rabbit", "tavşan", "🐰"], ["horse", "at", "🐴"], ["cow", "inek", "🐮"], ["lion", "aslan", "🦁"]],
    "Fruits": [["apple", "elma", "🍎"], ["banana", "muz", "🍌"], ["grapes", "üzüm", "🍇"], ["orange", "portakal", "🍊"], ["strawberry", "çilek", "🍓"], ["pear", "armut", "🍐"], ["cherry", "kiraz", "🍒"], ["watermelon", "karpuz", "🍉"]],
    "Classroom": [["book", "kitap", "📘"], ["pencil", "kurşun kalem", "✏️"], ["eraser", "silgi", "🧽"], ["bag", "çanta", "🎒"], ["ruler", "cetvel", "📏"], ["scissors", "makas", "✂️"], ["notebook", "defter", "📓"], ["board", "tahta", "🟫"]],
    "Weather": [["sunny", "güneşli", "☀️"], ["rainy", "yağmurlu", "🌧️"], ["snowy", "karlı", "❄️"], ["cloudy", "bulutlu", "☁️"], ["windy", "rüzgârlı", "🌬️"], ["stormy", "fırtınalı", "⛈️"]],
    "Numbers": [["one", "bir", "1"], ["two", "iki", "2"], ["three", "üç", "3"], ["four", "dört", "4"], ["five", "beş", "5"], ["six", "altı", "6"], ["seven", "yedi", "7"], ["eight", "sekiz", "8"], ["nine", "dokuz", "9"], ["ten", "on", "10"]],
    "Body": [["head", "baş", "🙂"], ["eye", "göz", "👁️"], ["ear", "kulak", "👂"], ["nose", "burun", "👃"], ["mouth", "ağız", "👄"], ["hand", "el", "✋"], ["foot", "ayak", "🦶"], ["leg", "bacak", "🦵"]],
    "Feelings": [["happy", "mutlu", "😊"], ["sad", "üzgün", "😢"], ["angry", "kızgın", "😠"], ["tired", "yorgun", "😴"], ["scared", "korkmuş", "😨"], ["surprised", "şaşırmış", "😮"]],
  };
  tool("ingilizce", "kelime", {
    title: "Kelime kartları", icon: "ingilizce", tone: "grape", grades: [2, 8], short: "Resimli kart, sesli okuma",
    render(host) {
      let set = "Animals", i = 0, showTr = false;
      const card = h("div.mat.flash");
      function paint() {
        const [en, tr, pic] = VOCAB[set][i];
        card.replaceChildren(h("div.pic", pic), h("div.word", en), showTr ? h("div.tr", tr) : null, h("div.hint", `${i + 1} / ${VOCAB[set].length}`));
      }
      host.append(seg(Object.keys(VOCAB).map((k) => [k, k]), set, (v) => { set = v; i = 0; paint(); }), card,
        h("div.row", btn("chalk", "back", "Previous", () => { i = (i + VOCAB[set].length - 1) % VOCAB[set].length; paint(); }),
          btn("grape", "speaker", "Listen", () => T.speak(VOCAB[set][i][0], "en")),
          btn("grape", "next", "Next", () => { i = (i + 1) % VOCAB[set].length; paint(); T.speak(VOCAB[set][i][0], "en"); }),
          btn("chalk", "eye", "Türkçesi", () => { showTr = !showTr; paint(); })));
      paint();
    },
  });
  tool("ingilizce", "dinle", {
    title: "Dinle ve seç", icon: "speaker", tone: "sky", grades: [2, 8], short: "Duyduğun kelimenin resmine dokun",
    render(host) {
      let set = "Fruits", ans = null, score = 0, tries = 0;
      const grid = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" } });
      const info = h("div.readout", { style: { color: "var(--chalk)" } });
      function next() {
        const opts = T.shuffle(VOCAB[set]).slice(0, 4); ans = T.pick(opts);
        grid.replaceChildren(...opts.map((o) => h("button.paper", { style: { border: 0, fontSize: "clamp(70px,10vw,130px)", padding: "18px", cursor: "pointer", lineHeight: 1 }, onclick: (e) => {
          tries++; if (o === ans) { score++; T.sound.ok(); e.currentTarget.style.outline = "6px solid var(--ok)"; setTimeout(next, 900); } else { T.sound.no(); e.currentTarget.style.opacity = ".35"; }
          info.textContent = `Puan: ${score} / ${tries}`;
        } }, o[2])));
        setTimeout(() => T.speak(ans[0], "en"), 200);
      }
      host.append(seg(Object.keys(VOCAB).map((k) => [k, k]), set, (v) => { set = v; next(); }), grid,
        h("div.row", btn("sky", "speaker", "Tekrar dinle", () => ans && T.speak(ans[0], "en")), btn("chalk", "next", "Başka kelime", next), info,
          h("span.hint", "Ses çıkmıyorsa cihazın İngilizce sesi kapalı olabilir; öğretmen kelimeyi kendisi söyleyebilir.")));
      next();
    },
  });
})();
