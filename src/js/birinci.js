/* 1. sınıf: etkileşimli kitap ve ilk okuma yazma oyunları.
   Ses sırası Maarif Modeli 1. sınıf ilk okuma yazma kitabını izler. Oyun içerikleri bu uygulama için yazılmıştır. */
(function () {
  const { h } = T; const S = T.svg;
  const ORDER = ["a", "n", "e", "t", "i", "l", "o", "k", "u", "r", "ı", "m", "ü", "s", "ö", "y", "d", "z", "ç", "b", "g", "ş", "c", "p", "h", "ğ", "v", "f", "j"];
  const VOW = "aeıioöuü";
  // 1. kitapta seslerin başladığı PDF sayfaları (246 sayfalık 1. kitap)
  const BOOK1 = { pages: 246, start: { a: 54, n: 66, e: 82, t: 100, i: 122, l: 136, o: 154, k: 166, u: 182, r: 200, ı: 212, m: 226 } };

  const learned = () => { const s = T.store.get().settings; return s.learned || ORDER.slice(0, 6); };
  const setLearned = (arr) => T.store.update((s) => (s.settings.learned = ORDER.filter((l) => arr.includes(l))));
  const okWord = (w, L) => [...T.trLower(w).replace(/[^a-zçğıöşüâîû]/g, "")].every((c) => L.includes(c));

  const WORDS = ("an at ata ana anne nane nine tane ten et en net tat tatlı ne in ilet ile ilan lale ela al ala el ilk ilik iki kek kel kil kale kalem kalın kına koli kol kot kule kum kuru kurt kutu kulak kumru kukla lokum limon mama masal mum mutlu nar not nota okul oku okur olur on onu otel otur oturan ırmak inek kemer kimi kare tekne teli tel ter tren termos tok tutum kemik kirli tilki ütü üzüm üç ördek öykü ses su simit sabun saat sarı sıra soru süt yol yıl yılan yumurta yaprak deniz dede dal davul ders zil zar zeytin çanta çay çiçek bebek balık bal bulut bilgi gemi göz güneş gül şeker şapka cam ceviz ceket pasta pul hava halı horoz dağ ağaç yağmur vazo vapur fil fare fener jeton jöle elma armut kitap kalemlik minare roket robot tamam ninni anahtar mektup kurabiye").split(" ");
  const NAMES = ["Ali", "Ela", "Nil", "Lale", "Ata", "Ilgın", "Tolga", "Kemal", "Ömer", "Nur", "Mine", "Melek", "Tarık", "Kerem", "Umut", "Ümit", "Mert", "Arda", "Nurten", "Emre"];
  const SENTENCES = ["Ela, nane al.", "Ali, nane al.", "Anne, lale al.", "Ela, limon al.", "Ali, kalem al.", "Ela, kalemi al.", "Melek, lokum al.", "Nur, kuru erik al.", "Okul tatil oldu.", "Tarık kumu eler.", "Kerem kulaklarını tıkar.", "Ali kalemini tut.", "Nurten limonata alır.", "Anne ekmek alır.", "Ümit okula erken iner.", "Ömer tren ile okula iner.", "Mert ile Ela kumda oynar.", "Kedi mama ile oynar.", "Kemal okul kitabını okur.", "Lale ile Nil okulda oturur.", "Dedem bize simit aldı.", "Bulut gibi yumuşak bir kedimiz var.", "Sabah erkenden okula gittik.", "Güneş doğunca kuşlar öttü.", "Çiçekleri her gün sularız."];
  const PICS = [["at", "🐴"], ["ana", "👩"], ["nane", "🌿"], ["el", "✋"], ["elma", "🍎"], ["etek", "👗"], ["ekmek", "🍞"], ["inek", "🐮"], ["ilaç", "💊"], ["limon", "🍋"], ["lale", "🌷"], ["ok", "🏹"], ["okul", "🏫"], ["kalem", "✏️"], ["kek", "🍰"], ["kedi", "🐱"], ["kitap", "📘"], ["kule", "🗼"], ["kutu", "📦"], ["uçak", "✈️"], ["roket", "🚀"], ["robot", "🤖"], ["ırmak", "🏞️"], ["ışık", "💡"], ["mum", "🕯️"], ["muz", "🍌"], ["mantar", "🍄"], ["üzüm", "🍇"], ["simit", "🥨"], ["saat", "⌚"], ["ördek", "🦆"], ["yumurta", "🥚"], ["yıldız", "⭐"], ["deniz", "🌊"], ["davul", "🥁"], ["zil", "🔔"], ["zürafa", "🦒"], ["çanta", "🎒"], ["çiçek", "🌸"], ["balık", "🐟"], ["bulut", "☁️"], ["gemi", "🚢"], ["güneş", "☀️"], ["şeker", "🍬"], ["şapka", "👒"], ["ceviz", "🌰"], ["pasta", "🎂"], ["peynir", "🧀"], ["havuç", "🥕"], ["horoz", "🐓"], ["dağ", "⛰️"], ["ağaç", "🌳"], ["vazo", "🏺"], ["fil", "🐘"], ["fare", "🐭"], ["tavuk", "🐔"], ["top", "⚽"], ["tren", "🚂"], ["karpuz", "🍉"], ["kiraz", "🍒"], ["anahtar", "🔑"], ["arı", "🐝"], ["ayı", "🐻"], ["aslan", "🦁"], ["araba", "🚗"], ["tilki", "🦊"]];
  const emojiOf = (w) => (PICS.find((p) => p[0] === T.trLower(w)) || [])[1];

  /* ---------- Bölüm ---------- */
  T.sections.birinci = {
    title: "Türkçe (1. sınıf)", icon: "letters", tone: "tomato", desc: "Kitabım, sesler, harf yazma, hece ve kelime oyunları",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const wrap = h("div.view-inner"); view.append(wrap);
      const L = learned();
      wrap.append(h("div.page-head", h("h1", "Türkçe: ilk okuma yazma"), h("div.sub", "Oyunlar yalnızca öğrendiğiniz seslerle çalışır. Yeni bir ses öğrenince aşağıdan işaretle.")));
      wrap.append(h("div.paper", { style: { padding: "16px 18px", marginBottom: "22px", display: "grid", gap: "10px" } },
        h("div.row", h("b", { style: { fontSize: "18px" } }, "Öğrendiğimiz sesler"), h("span.pill.ok", L.length + " ses"), h("div.spacer"),
          h("button.btn.sm.c-chalk", { onclick: () => { const nx = ORDER.find((l) => !L.includes(l)); if (nx) { setLearned(L.concat(nx)); T.route(); } } }, T.icon("plus"), "Sıradaki sesi ekle")),
        h("div.row", { style: { gap: "6px" } }, ORDER.map((l) => h("button.btn.sm" + (L.includes(l) ? ".c-sun" : ".c-chalk"), { style: { minWidth: "46px", fontSize: "22px", fontFamily: "var(--display)", opacity: L.includes(l) ? 1 : 0.55 }, "aria-pressed": String(L.includes(l)), onclick: () => { setLearned(L.includes(l) ? L.filter((x) => x !== l) : L.concat(l)); T.route(); } }, l))),
        h("div.hint", `Bu seslerle okunabilecek ${WORDS.filter((w) => okWord(w, L)).length} kelime ve ${SENTENCES.filter((s) => okWord(s, L)).length} cümle var.`)));
      const groups = [["Kitabım", ["kitap"]], ["Sesi hissedelim", ["ses-avi", "ses-nerede", "turkce-ses"]], ["Yazalım", ["harf-yaz", "rakam-yaz", "cizgi"]], ["Hece, sözcük, cümle", ["hece-makinesi", "kelime-kur", "cumle-kur", "okuma-kartlari", "turkce-hece"]], ["Okuma ve anlama", ["turkce-okuma-tiyatrosu", "turkce-okuma-hizi", "turkce-metin-uyarla", "turkce-dikte", "turkce-noktalama", "turkce-5n1k", "turkce-hikaye-zarlari"]], ["Matematik", ["matematik-onluk-cerceve", "matematik-rekenrek", "matematik-oyun-esini-bul", "matematik-oyun-hizli-gor", "matematik-oyun-sayi-bagi", "matematik-gunun-sayisi"]]];
      wrap.append(h("button.tile.c-tomato", { style: { width: "100%", minHeight: "130px", gridTemplateColumns: "auto 1fr", gridTemplateRows: "auto", alignItems: "center", gap: "20px", marginBottom: "26px", "--tilt": "-0.4deg" }, onclick: () => T.go("birinci-kitap") }, T.icon("turkce", "ic"), h("div", h("h3", "Kitabım"), h("p", { style: { fontSize: "16px" } }, "Ders kitabını tahtada aç. Üzerine yaz, çiz, perdeyle ört, spotla göster. Kelimeye dokununca okunsun ve hecelensin."))));
      groups.shift();
      groups.forEach(([g, ids]) => {
        wrap.append(h("div.section-title", h("h2", g)));
        wrap.append(h("div.tool-grid", { style: { marginBottom: "18px" } }, ids.map((id) => {
          const [sec, key] = id.includes("-") && T.sections[id.split("-")[0]] && !T.tools[id] ? [id.split("-")[0], id.slice(id.indexOf("-") + 1)] : ["birinci", id];
          const t = T.tools[key]; if (!t) return null;
          return T.aracKart(sec + "-" + key, t, "tomato");
        })));
      });
    },
  };
  const tool = (id, def) => (T.tools[id] = Object.assign({ back: "birinci", grades: [1, 1] }, def));
  const letterPicker = (cur, on, list = learned()) => h("div.row", { style: { gap: "6px" } }, list.map((l) => h("button.btn.sm.m-harf" + (l === cur ? ".on" : ""), { style: { minWidth: "46px", fontSize: "22px", fontFamily: "var(--display)" }, onclick: () => on(l) }, l)));

  /* ---------- Ses avı ---------- */
  tool("ses-avi", { title: "Ses avı", icon: "eye", tone: "tomato", short: "Adında bu ses olan resimleri bul",
    render(host) {
      let L = learned(), target = L[L.length - 1], where = "icinde", items = [], found = new Set(), checked = false;
      const grid = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" } });
      const info = h("div.readout", { style: { color: "var(--chalk)", fontSize: "24px" } });
      const has = (w) => (where === "basinda" ? T.trLower(w)[0] === target : T.trLower(w).includes(target));
      function gen() { const yes = T.shuffle(PICS.filter((p) => has(p[0]))).slice(0, 3); const no = T.shuffle(PICS.filter((p) => !has(p[0]))).slice(0, 8 - yes.length); items = T.shuffle(yes.concat(no)); found = new Set(); checked = false; paint(); }
      function paint() {
        grid.replaceChildren(...items.map(([w, e]) => { const on = found.has(w), ok = has(w);
          return h("button.paper.m-kart", { style: { border: 0, padding: "14px 8px", display: "grid", justifyItems: "center", gap: "4px", cursor: "pointer", outline: on ? `6px solid ${checked ? (ok ? "var(--ok)" : "var(--bad)") : "var(--sky)"}` : checked && ok ? "6px dashed var(--ok)" : "none" },
            onclick: () => { T.speak(w); if (checked) return; on ? found.delete(w) : found.add(w); paint(); } },
            h("span", { style: { fontSize: "clamp(56px,7vw,96px)", lineHeight: 1 } }, e), checked || on ? h("b", { style: { fontSize: "22px" } }, [...w].map((c) => c === target ? h("span", { style: { color: "#e2473b" } }, c) : c)) : h("b", { style: { fontSize: "22px", opacity: 0 } }, "."));
        }));
        const right = items.filter(([w]) => has(w)).length;
        info.textContent = checked ? `${items.filter(([w]) => has(w) && found.has(w)).length} / ${right} doğru buldun` : `"${target}" sesini ${where === "basinda" ? "başında" : "içinde"} duyduğun resimlere dokun.`;
      }
      host.append(h("div.row", letterPicker(target, (l) => { target = l; gen(); }, ORDER), h("div.seg", [["icinde", "İçinde"], ["basinda", "Başında"]].map(([v, l]) => h("button", { "aria-pressed": String(v === where), onclick: (e) => { where = v; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); gen(); } }, l)))),
        info, grid,
        h("div.row", h("button.btn.big.c-leaf", { onclick: () => { checked = true; paint(); T.sound.ok(); } }, T.icon("check"), "Kontrol et"), h("button.btn.c-chalk", { onclick: gen }, T.icon("reset"), "Yeni resimler"), h("span.hint", "Resme dokununca adı sesli okunur.")));
      gen();
    } });

  /* ---------- Ses nerede? ---------- */
  tool("ses-nerede", { title: "Ses nerede?", icon: "speaker", tone: "sky", short: "Ses kelimenin başında mı, ortasında mı, sonunda mı?",
    render(host) {
      let target = learned()[learned().length - 1], cur = null, score = 0, n = 0;
      const box = h("div.mat.mat-pad.m-kart", { style: { minHeight: "auto", display: "grid", gap: "18px", justifyItems: "center" } });
      const pos = (w) => { const i = T.trLower(w).indexOf(target); return i === 0 ? "bas" : i === w.length - 1 ? "son" : "orta"; };
      function next() {
        const pool = PICS.filter(([w]) => T.trLower(w).includes(target)); if (!pool.length) { box.replaceChildren(h("p", "Bu ses için resim yok, başka bir ses seç.")); return; }
        cur = T.pick(pool); T.speak(cur[0]);
        const slots = h("div.row", { style: { gap: "6px", justifyContent: "center" } }, [...cur[0]].map(() => h("div", { style: { width: "56px", height: "56px", borderRadius: "10px", border: "4px dashed #c9c2b2" } })));
        const fb = h("div", { style: { fontSize: "22px", minHeight: "34px" } });
        const choose = (p) => { n++; const ok = p === pos(cur[0]); if (ok) { score++; T.sound.ok(); } else T.sound.no(); slots.replaceChildren(...[...cur[0]].map((c) => h("div", { style: { width: "56px", height: "56px", borderRadius: "10px", display: "grid", placeItems: "center", fontFamily: "var(--display)", fontWeight: 800, fontSize: "36px", background: c === target ? "#ffd2c2" : "#fff", border: "3px solid #2a2a2a" } }, c))); fb.replaceChildren(h("b", ok ? "Doğru. " : "Dinleyelim: "), cur[0], ` (${score} / ${n})`); setTimeout(next, 2200); };
        box.replaceChildren(h("div", { style: { fontSize: "130px", lineHeight: 1 } }, cur[1]), slots,
          h("div.row", { style: { justifyContent: "center" } }, ["bas", "orta", "son"].map((p) => h("button.btn.big.c-" + { bas: "sun", orta: "sky", son: "leaf" }[p], { onclick: () => choose(p) }, { bas: "Başında", orta: "Ortasında", son: "Sonunda" }[p])), h("button.btn.c-chalk", { onclick: () => T.speak(cur[0]) }, T.icon("speaker"), "Tekrar dinle")), fb);
      }
      host.append(letterPicker(target, (l) => { target = l; next(); }, ORDER), box);
      next();
    } });

  /* ---------- Yazma tuvali (harf, rakam, çizgi) ---------- */
  function writingPad(host, { guide, extra }) {
    const cv = h("canvas", { style: { width: "100%", height: "100%", display: "block", touchAction: "none" } });
    const mat = h("div.mat.m-kart.m-yazi", { style: { height: "calc(var(--stage-h) - 70px)", minHeight: "260px" } }, cv);
    const ctx = cv.getContext("2d");
    let strokes = [], color = "#2e9bd6", guideMask = null;
    function fit() { const r = mat.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; paint(); }
    function paint() {
      const W = cv.width, H = cv.height; ctx.clearRect(0, 0, W, H);
      ctx.save(); guide(ctx, W, H); ctx.restore();
      // kılavuz maskesi (puanlama için)
      const off = document.createElement("canvas"); off.width = W / 4; off.height = H / 4; const o = off.getContext("2d"); o.scale(0.25, 0.25); guide(o, W, H, true); guideMask = o.getImageData(0, 0, off.width, off.height);
      strokes.forEach((s) => { ctx.strokeStyle = s.c; ctx.lineWidth = 14 * devicePixelRatio; ctx.lineCap = ctx.lineJoin = "round"; ctx.beginPath(); s.p.forEach(([x, y], i) => (i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H))); ctx.stroke(); });
    }
    let curS = null;
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); curS = { c: color, p: [pt(e)] }; strokes.push(curS); paint(); });
    cv.addEventListener("pointermove", (e) => { if (!curS) return; curS.p.push(pt(e)); paint(); });
    cv.addEventListener("pointerup", () => (curS = null));
    function score() {
      if (!guideMask) return 0;
      const W = guideMask.width, H = guideMask.height, d = guideMask.data;
      const drawn = document.createElement("canvas"); drawn.width = W; drawn.height = H; const c2 = drawn.getContext("2d");
      c2.lineWidth = 9; c2.lineCap = c2.lineJoin = "round"; c2.strokeStyle = "#000";
      strokes.forEach((s) => { c2.beginPath(); s.p.forEach(([x, y], i) => (i ? c2.lineTo(x * W, y * H) : c2.moveTo(x * W, y * H))); c2.stroke(); });
      const dd = c2.getImageData(0, 0, W, H).data; let g = 0, hit = 0, out = 0;
      for (let i = 3; i < d.length; i += 4) { const isG = d[i] > 40, isD = dd[i] > 40; if (isG) { g++; if (isD) hit++; } else if (isD) out++; }
      return g ? Math.max(0, hit / g - (out / g) * 0.15) : 0;
    }
    const colors = ["#2e9bd6", "#e2473b", "#3fae5a", "#8a5cd0", "#2a2a2a"];
    const result = h("div.readout", { style: { color: "var(--chalk)" } });
    host.append(mat, h("div.row",
      colors.map((c) => h("button", { "aria-label": "Renk", onclick: () => (color = c), style: { width: "46px", height: "46px", borderRadius: "50%", border: "4px solid #fff", background: c } })),
      h("button.btn.c-chalk", { onclick: () => { strokes.pop(); paint(); } }, T.icon("back"), "Geri al"),
      h("button.btn.c-chalk", { onclick: () => { strokes = []; result.textContent = ""; paint(); } }, T.icon("trash"), "Sil"),
      h("button.btn.c-leaf", { onclick: () => { const s = score(); const st = s > 0.75 ? 3 : s > 0.5 ? 2 : s > 0.25 ? 1 : 0; result.textContent = st ? "⭐".repeat(st) + (st === 3 ? " Çok güzel!" : " Bir daha deneyelim mi?") : "Noktalı çizginin üzerinden git."; if (st) T.sound.ok(); } }, T.icon("check"), "Bitti"),
      result, ...(extra ? extra() : [])));
    setTimeout(fit, 30); const ro = new ResizeObserver(() => fit()); ro.observe(mat); T.onLeave(() => ro.disconnect());
    try { document.fonts.load('600 120px "Lexend"').then(() => fit()); } catch (e) {}
    return { repaint: () => { strokes = []; result.textContent = ""; paint(); } };
  }
  function linedGuide(ctx, W, H) {
    const top = H * 0.18, base = H * 0.78, mid = (top + base) / 2;
    ctx.strokeStyle = "rgba(46,155,214,.35)"; ctx.lineWidth = 2 * devicePixelRatio;
    [top, mid, base].forEach((y, i) => { ctx.setLineDash(i === 1 ? [10, 10] : []); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); });
    ctx.strokeStyle = "rgba(226,71,59,.45)"; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(0, base + H * 0.1); ctx.lineTo(W, base + H * 0.1); ctx.stroke();
    return { top, base };
  }
  function letterGuide(text) {
    return (ctx, W, H, mask) => {
      const { top, base } = mask ? { top: H * 0.18, base: H * 0.78 } : linedGuide(ctx, W, H);
      const size = (base - top) * 1.32;
      ctx.font = `600 ${size}px Lexend, "Segoe UI", sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      const n = text.length, gap = W / (n + 1);
      [...text].forEach((ch, i) => {
        const x = gap * (i + 1);
        if (mask) { ctx.lineWidth = size * 0.11; ctx.strokeStyle = "#000"; ctx.strokeText(ch, x, base); ctx.fillStyle = "#000"; ctx.fillText(ch, x, base); }
        else { ctx.fillStyle = "rgba(0,0,0,.06)"; ctx.fillText(ch, x, base); ctx.setLineDash([size * 0.03, size * 0.04]); ctx.lineWidth = Math.max(3, size * 0.012); ctx.strokeStyle = "rgba(0,0,0,.45)"; ctx.strokeText(ch, x, base); ctx.setLineDash([]); }
      });
    };
  }
  tool("harf-yaz", { title: "Harf yazalım", icon: "pen", tone: "grape", short: "Noktalı harfin üzerinden parmakla yaz",
    render(host) {
      let L = learned(), ch = L[L.length - 1], mode = "kucuk", text = ch;
      const bar = h("div.row");
      const update = () => { text = mode === "kucuk" ? ch : mode === "buyuk" ? T.trUpper(ch) : (T.trUpper(ch) + ch); paintBar(); pad.repaint(); };
      const pad = writingPad(host, { guide: (ctx, W, H, m) => letterGuide(text)(ctx, W, H, m) });
      function paintBar() { bar.replaceChildren(letterPicker(ch, (l) => { ch = l; update(); }, ORDER), h("div.seg", [["kucuk", "Küçük"], ["buyuk", "Büyük"], ["ikisi", "İkisi"]].map(([v, l]) => h("button", { "aria-pressed": String(v === mode), onclick: () => { mode = v; update(); } }, l))), h("button.btn.c-sky", { onclick: () => T.speak(ch) }, T.icon("speaker"), "Sesini dinle")); }
      host.prepend(bar); paintBar();
    } });
  tool("rakam-yaz", { title: "Rakam yazalım", icon: "math", tone: "sun", short: "Rakamı say, yaz",
    render(host) {
      let d = 1;
      const bar = h("div.row"); const objs = h("div", { style: { fontSize: "54px", lineHeight: 1.1, minHeight: "64px" } });
      const pad = writingPad(host, { guide: (ctx, W, H, m) => letterGuide(String(d))(ctx, W, H, m) });
      function paintBar() { bar.replaceChildren(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => h("button.btn.sm.m-harf" + (x === d ? ".on" : ""), { style: { minWidth: "48px", fontSize: "24px", fontFamily: "var(--display)" }, onclick: () => { d = x; paintBar(); pad.repaint(); } }, x)), h("button.btn.c-sky", { onclick: () => T.speak(T.sayiOku(d)) }, T.icon("speaker"), "Oku")); objs.textContent = d ? "🍎".repeat(d) : "Hiç elma yok: sıfır"; }
      host.prepend(bar, objs); paintBar();
    } });
  const LINES = [
    ["Dik çizgi", (c, W, H) => { for (let i = 1; i < 9; i++) { c.moveTo((W * i) / 9, H * 0.2); c.lineTo((W * i) / 9, H * 0.8); } }],
    ["Yatay çizgi", (c, W, H) => { for (let i = 1; i < 5; i++) { c.moveTo(W * 0.08, (H * i) / 5); c.lineTo(W * 0.92, (H * i) / 5); } }],
    ["Eğik çizgi", (c, W, H) => { for (let i = 0; i < 8; i++) { c.moveTo(W * 0.08 + (W * i) / 9, H * 0.8); c.lineTo(W * 0.16 + (W * i) / 9, H * 0.2); } }],
    ["Zikzak", (c, W, H) => { c.moveTo(W * 0.05, H * 0.7); for (let i = 1; i <= 12; i++) c.lineTo(W * 0.05 + (W * 0.9 * i) / 12, i % 2 ? H * 0.3 : H * 0.7); }],
    ["Dalga", (c, W, H) => { c.moveTo(W * 0.05, H * 0.5); for (let x = 0; x <= 1; x += 0.01) c.lineTo(W * 0.05 + W * 0.9 * x, H * 0.5 - Math.sin(x * Math.PI * 8) * H * 0.18); }],
    ["Halka", (c, W, H) => { for (let i = 0; i < 5; i++) { const cx = W * 0.14 + (W * 0.72 * i) / 4; c.moveTo(cx + H * 0.15, H * 0.5); c.arc(cx, H * 0.5, H * 0.15, 0, Math.PI * 2); } }],
    ["İlmek", (c, W, H) => { c.moveTo(W * 0.05, H * 0.7); for (let t = 0; t <= 1; t += 0.004) { const a = t * Math.PI * 2 * 7; c.lineTo(W * 0.05 + W * 0.85 * t + Math.sin(a) * H * 0.08, H * 0.55 - Math.cos(a) * H * 0.17 + H * 0.02); } }],
    ["Merdiven", (c, W, H) => { let x = W * 0.06, y = H * 0.8; c.moveTo(x, y); for (let i = 0; i < 7; i++) { y -= H * 0.08; c.lineTo(x, y); x += W * 0.12; c.lineTo(x, y); } }],
  ];
  tool("cizgi", { title: "Çizgi çalışması", icon: "line", tone: "leaf", short: "Dik, eğik, dalga, halka, ilmek",
    render(host) {
      let k = 0;
      const bar = h("div.row");
      const pad = writingPad(host, { guide: (ctx, W, H, mask) => { ctx.beginPath(); LINES[k][1](ctx, W, H); if (mask) { ctx.lineWidth = 28; ctx.strokeStyle = "#000"; ctx.stroke(); } else { ctx.setLineDash([14, 12]); ctx.lineWidth = 6 * devicePixelRatio; ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.lineCap = "round"; ctx.stroke(); ctx.setLineDash([]); } } });
      function paintBar() { bar.replaceChildren(h("div.seg", LINES.map(([n], i) => h("button", { "aria-pressed": String(i === k), onclick: () => { k = i; paintBar(); pad.repaint(); } }, n)))); }
      host.prepend(bar); paintBar();
    } });

  /* ---------- Hece makinesi ---------- */
  tool("hece-makinesi", { title: "Hece makinesi", icon: "hece", tone: "sky", short: "Öğrenilen seslerle bütün heceler",
    render(host) {
      const L = learned(), vs = L.filter((c) => VOW.includes(c)), cs = L.filter((c) => !VOW.includes(c));
      let order = "uu"; // ünsüz+ünlü
      const tbl = h("div.paper.m-masa", { style: { padding: "14px", overflowX: "auto" } });
      function paint() {
        if (!vs.length || !cs.length) { tbl.replaceChildren(h("p", "Hece kurmak için en az bir ünlü ve bir ünsüz ses öğrenilmiş olmalı.")); return; }
        const cell = (t) => h("button.m-blok", { onclick: () => T.speak(t), style: { "--c": "#F6E4C0", fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(26px,3vw,40px)", padding: "8px 14px", minWidth: "84px" } }, t);
        tbl.replaceChildren(h("table", { style: { borderCollapse: "separate", borderSpacing: "8px" } },
          h("tr", h("td"), vs.map((v) => h("th", { style: { fontFamily: "var(--display)", fontSize: "28px", color: "#e2473b" } }, v))),
          cs.map((c) => h("tr", h("th", { style: { fontFamily: "var(--display)", fontSize: "28px", color: "#2e9bd6", paddingRight: "8px" } }, c), vs.map((v) => h("td", cell(order === "uu" ? c + v : order === "uu2" ? v + c : c + v + c)))))));
      }
      host.append(h("div.row", h("div.seg", [["uu", "ünsüz + ünlü (na)"], ["uu2", "ünlü + ünsüz (an)"], ["uuu", "ünsüz + ünlü + ünsüz (nan)"]].map(([v, l]) => h("button", { "aria-pressed": String(v === order), onclick: (e) => { order = v; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); paint(); } }, l))),
        h("span.hint", { style: { color: "var(--chalk)" } }, "Heceye dokununca sesli okunur. Kırmızılar ünlü, maviler ünsüz.")), tbl);
      paint();
    } });

  /* ---------- Kelime kur ---------- */
  tool("kelime-kur", { title: "Kelime kuralım", icon: "hece", tone: "pink", short: "Karışık heceleri sıraya diz",
    render(host) {
      const L = learned(); const pool = WORDS.filter((w) => okWord(w, L) && T.heceler(w).length > 1);
      const box = h("div.mat.mat-pad.m-masa", { style: { minHeight: "auto", display: "grid", gap: "20px", justifyItems: "center" } });
      let score = 0;
      function next() {
        if (!pool.length) { box.replaceChildren(h("p", { style: { fontSize: "20px" } }, "Bu seslerle iki heceli kelime çıkmıyor. Birkaç ses daha öğrenince oyun açılacak.")); return; }
        const w = T.pick(pool), hs = T.heceler(w); let picked = [];
        let mixed = T.shuffle(hs.map((x, i) => ({ x, i }))); if (hs.length > 1 && mixed.every((m, i) => m.i === i)) mixed.reverse();
        const slot = h("div.row", { style: { justifyContent: "center", minHeight: "90px", gap: "8px" } });
        const cards = h("div.row", { style: { justifyContent: "center", gap: "10px" } });
        const paintC = () => {
          slot.replaceChildren(...hs.map((_, i) => h("div", { style: { minWidth: "110px", height: "84px", borderRadius: "14px", border: picked[i] ? "0" : "4px dashed #c9c2b2", background: picked[i] ? "#ffc233" : "transparent", display: "grid", placeItems: "center", fontFamily: "var(--display)", fontWeight: 800, fontSize: "44px" } }, picked[i] ? picked[i].x : "")));
          cards.replaceChildren(...mixed.map((m) => h("button.btn.big.m-blok", { style: { "--c": "#5DADE2", fontSize: "44px", minWidth: "110px", fontFamily: "var(--display)", visibility: picked.includes(m) ? "hidden" : "visible" }, onclick: () => {
            T.speak(m.x); picked.push(m); paintC();
            if (picked.length === hs.length) { const ok = picked.map((p) => p.x).join("") === w; if (ok) { score++; T.sound.ok(); setTimeout(() => T.speak(w), 400); setTimeout(next, 2000); } else { T.sound.no(); setTimeout(() => { picked = []; paintC(); }, 900); } }
          } }, m.x)));
        };
        const e = emojiOf(w);
        box.replaceChildren(h("div.hint", "Puan: " + score), e ? h("div", { style: { fontSize: "110px", lineHeight: 1 } }, e) : h("button.btn.c-chalk", { onclick: () => T.speak(w) }, T.icon("speaker"), "Kelimeyi dinle"), slot, cards,
          h("div.row", h("button.btn.c-chalk", { onclick: () => { picked = []; paintC(); } }, T.icon("reset"), "Baştan"), h("button.btn.c-chalk", { onclick: next }, T.icon("next"), "Başka kelime")));
        paintC();
      }
      host.append(box); next();
    } });

  /* ---------- Cümle kur ---------- */
  tool("cumle-kur", { title: "Cümle kuralım", icon: "text", tone: "leaf", short: "Karışık kelimeleri sıraya diz",
    render(host) {
      const L = learned(); const pool = SENTENCES.filter((s) => okWord(s, L));
      const box = h("div.mat.mat-pad.m-masa", { style: { minHeight: "auto", display: "grid", gap: "20px", justifyItems: "center" } });
      function next() {
        if (!pool.length) { box.replaceChildren(h("p", { style: { fontSize: "20px" } }, "Bu seslerle henüz cümle kurulamıyor. Kelime kuralım oyunuyla devam edin; birkaç ses sonra cümleler açılacak.")); return; }
        const sent = T.pick(pool), words = sent.split(" "); let picked = [];
        let mixed = T.shuffle(words.map((x, i) => ({ x, i }))); if (mixed.every((m, i) => m.i === i) && words.length > 1) mixed.reverse();
        const line = h("div", { style: { minHeight: "80px", fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(32px,4vw,54px)", textAlign: "center" } });
        const cards = h("div.row", { style: { justifyContent: "center", gap: "10px" } });
        const paintC = () => {
          line.textContent = picked.map((p) => p.x).join(" ") || " ";
          cards.replaceChildren(...mixed.map((m) => h("button.btn.big.m-blok", { style: { "--c": "#F2B33D", fontSize: "34px", fontFamily: "var(--display)", visibility: picked.includes(m) ? "hidden" : "visible" }, onclick: () => {
            picked.push(m); T.speak(m.x.replace(/[.,]/g, "")); paintC();
            if (picked.length === words.length) { if (picked.map((p) => p.x).join(" ") === sent) { T.sound.ok(); setTimeout(() => T.speak(sent), 300); line.style.color = "#1e6b33"; } else { T.sound.no(); setTimeout(() => { picked = []; line.style.color = ""; paintC(); }, 1000); } }
          } }, m.x)));
        };
        box.replaceChildren(line, cards, h("div.row", h("button.btn.c-chalk", { onclick: () => { picked = []; line.style.color = ""; paintC(); } }, T.icon("reset"), "Baştan"), h("button.btn.c-chalk", { onclick: next }, T.icon("next"), "Başka cümle"), h("span.hint", "Büyük harfle başlayan kelime cümlenin başıdır; noktalı kelime sonudur.")));
        paintC();
      }
      host.append(box); next();
    } });

  /* ---------- Okuma kartları ---------- */
  tool("okuma-kartlari", { title: "Okuma kartları", icon: "abc", tone: "grape", short: "Öğrenilen seslerle kelime okuma",
    render(host) {
      const L = learned(); const pool = T.shuffle(WORDS.filter((w) => okWord(w, L)).concat(NAMES.filter((w) => okWord(w, L))));
      let i = 0, split = false;
      const card = h("div.mat.flash.m-kart");
      function paint() {
        if (!pool.length) { card.replaceChildren(h("p", "Önce birkaç ses işaretleyin.")); return; }
        const w = pool[i % pool.length];
        card.replaceChildren(h("div.word", { style: { fontSize: "clamp(64px,9vw,140px)" } }, split ? T.heceler(w).join(" - ") : w), emojiOf(w) && split ? h("div.pic", emojiOf(w)) : null, h("div.hint", `${(i % pool.length) + 1} / ${pool.length}`));
      }
      host.append(card, h("div.row", h("button.btn.big.c-grape", { onclick: () => { i++; split = false; paint(); } }, T.icon("next"), "Sonraki"), h("button.btn.c-chalk", { onclick: () => { split = !split; paint(); } }, T.icon("hece"), "Hecele"), h("button.btn.c-chalk", { onclick: () => T.speak(pool[i % pool.length]) }, T.icon("speaker"), "Dinle"),
        h("span.hint", "Öğrenci önce kendisi okur; takılırsa Hecele, sonra Dinle.")));
      paint();
    } });

  /* ===================== KİTABIM: etkileşimli PDF ===================== */
  const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  const PDFJS = /^https?:$/.test(location.protocol) ? "/vendor/pdfjs/" : PDFJS_CDN;
  let pdfLib = null;
  function loadPdfJs() {
    if (pdfLib) return Promise.resolve(pdfLib);
    if (window.pdfjsLib) return Promise.resolve((pdfLib = setupWorker(window.pdfjsLib)));
    return new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = PDFJS + "pdf.min.js";
      s.onload = () => res((pdfLib = setupWorker(window.pdfjsLib)));
      s.onerror = () => rej(new Error("PDF okuyucu yüklenemedi. İnternet bağlantısını kontrol et."));
      document.head.append(s);
    });
  }
  function setupWorker(lib) {
    if (PDFJS !== PDFJS_CDN) { lib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; return lib; }
    try { const blob = new Blob([`importScripts("${PDFJS}pdf.worker.min.js");`], { type: "text/javascript" }); lib.GlobalWorkerOptions.workerPort = new Worker(URL.createObjectURL(blob)); }
    catch (e) { lib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; }
    return lib;
  }
  /* Kitap dosyasını bu tarayıcıda hatırla (IndexedDB) */
  const idb = {
    open: () => new Promise((res, rej) => { try { const r = indexedDB.open("tahta-kitap", 1); r.onupgradeneeded = () => r.result.createObjectStore("f"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }),
    async put(k, v) { try { const db = await this.open(); await new Promise((res, rej) => { const t = db.transaction("f", "readwrite"); t.objectStore("f").put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); return true; } catch (e) { return false; } },
    async get(k) { try { const db = await this.open(); return await new Promise((res) => { const t = db.transaction("f").objectStore("f").get(k); t.onsuccess = () => res(t.result); t.onerror = () => res(null); }); } catch (e) { return null; } },
  };
  const annKey = (doc) => "tahta-ann:" + doc.name + ":" + doc.size;
  const loadAnn = (doc) => { try { return JSON.parse(localStorage.getItem(annKey(doc)) || "{}"); } catch (e) { return {}; } };
  const saveAnn = (doc, a) => { try { localStorage.setItem(annKey(doc), JSON.stringify(a)); } catch (e) {} };

  tool("kitap", { title: "Kitabım", icon: "turkce", tone: "tomato", grades: [1, 8], compact: true, short: "Ders kitabını aç, üzerinde çalış, dokununca sesli okusun",
    render(host) {
      const st = { pdf: null, doc: null, page: 1, zoom: 1, tool: "el", color: "#e2473b", width: 5, ann: {}, blank: false, curtain: 0, spot: null, undo: [] };
      const pageWrap = h("div", { style: { position: "relative", margin: "0 auto", boxShadow: "0 10px 30px rgba(0,0,0,.35)", background: "#fff" } });
      const scroller = h("div", { style: { height: "calc(100vh - var(--top-h) - var(--dock-h) - 96px)", minHeight: "360px", overflow: "auto", borderRadius: "var(--r-lg)", background: "rgba(0,0,0,.18)", padding: "16px", position: "relative" } }, pageWrap);
      const pcv = h("canvas", { style: { display: "block" } });
      const tl = h("div.textLayer");
      const acv = h("canvas", { style: { position: "absolute", inset: "0", touchAction: "none", zIndex: 3 } });
      const curtain = h("div", { style: { position: "absolute", left: 0, right: 0, top: 0, height: "0", background: "#2b3540", display: "none", zIndex: 5 } }, h("div", { style: { position: "absolute", left: "50%", bottom: "-22px", transform: "translateX(-50%)", width: "120px", height: "44px", borderRadius: "0 0 14px 14px", background: "#2b3540", color: "#fff", display: "grid", placeItems: "center", cursor: "ns-resize", fontWeight: 700 }, "data-handle": "1" }, "Perde"));
      const spotEl = h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", display: "none", zIndex: 4 } });
      pageWrap.append(pcv, tl, acv, curtain, spotEl);
      const pageInfo = h("span.readout", { style: { color: "var(--chalk)", fontSize: "20px" } });
      const chip = h("div", { style: { position: "absolute", zIndex: 8, display: "none", background: "var(--ink)", color: "var(--paper)", padding: "10px 14px", borderRadius: "12px", fontSize: "22px", fontWeight: 700, boxShadow: "0 6px 16px rgba(0,0,0,.4)" } });
      scroller.append(chip);

      /* Yan araç çubuğu */
      const TOOLS = [["el", "hand", "Dokun ve dinle", "Dinle"], ["kalem", "pen", "Kalem", "Kalem"], ["vurgu", "highlighter", "Fosforlu kalem", "Fosforlu"], ["silgi", "eraser", "Silgi", "Silgi"], ["cizgi", "line", "Çizgi", "Çizgi"], ["kutu", "square", "Kutu", "Kutu"], ["daire", "circle", "Daire", "Daire"], ["ok", "arrow", "Ok", "Ok"], ["yazi", "textT", "Yazı", "Yazı"], ["damga", "star", "Yıldız", "Yıldız"], ["onay", "check", "Onay işareti", "Onay"], ["spot", "sun", "Spot ışığı", "Spot"]];
      const lab = (t) => h("span", { style: { fontSize: "11px", fontWeight: 600, lineHeight: 1 } }, t);
      const tb = { width: "52px", minHeight: "54px", flexDirection: "column", gap: "3px", padding: "4px 2px" };
      const side = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 52px)", gap: "6px", alignContent: "start", overflowY: "auto", maxHeight: "calc(100vh - var(--top-h) - var(--dock-h) - 96px)" } });
      function paintSide() {
        side.replaceChildren(
          ...TOOLS.map(([k, ic, l, kisa]) => h("button.btn.icon" + (st.tool === k ? ".c-sun" : ".c-chalk"), { title: l, "aria-label": l, "aria-pressed": String(st.tool === k), style: tb, onclick: () => { st.tool = k; spotEl.style.display = k === "spot" ? "block" : "none"; if (k === "spot") paintSpot(); paintSide(); acv.style.pointerEvents = k === "el" ? "none" : "auto"; } }, T.icon(ic), lab(kisa))),
          h("div", { style: { gridColumn: "1 / -1", height: "2px" } }),
          ...["#e2473b", "#2e9bd6", "#3fae5a", "#ffc233", "#8a5cd0", "#2a2a2a"].map((c) => h("button", { "aria-label": "Renk", onclick: () => { st.color = c; paintSide(); }, style: { width: "52px", height: "30px", borderRadius: "10px", border: st.color === c ? "4px solid #fff" : "2px solid rgba(255,255,255,.3)", background: c } })),
          h("button.btn.icon.c-chalk", { title: "Kalınlık", "aria-label": "Kalınlık", style: tb, onclick: () => { st.width = st.width === 5 ? 10 : st.width === 10 ? 3 : 5; paintSide(); } }, h("span", { style: { width: st.width * 2 + "px", height: st.width * 2 + "px", borderRadius: "50%", background: "var(--ink)" } }), lab("Kalınlık")),
          h("button.btn.icon" + (st.curtain ? ".c-sun" : ".c-chalk"), { title: "Perde", "aria-label": "Perde", style: tb, onclick: () => { st.curtain = st.curtain ? 0 : 0.5; paintCurtain(); paintSide(); } }, T.icon("eyeoff"), lab("Perde")),
          h("button.btn.icon.c-chalk", { title: "Geri al", "aria-label": "Geri al", style: tb, onclick: () => { const ops = curOps(); ops.pop(); commit(); } }, T.icon("undo" in T.ICONS ? "undo" : "back"), lab("Geri al")),
          h("button.btn.icon.c-tomato", { title: "Sayfadaki çizimleri sil", "aria-label": "Sayfadaki çizimleri sil", style: tb, onclick: () => { st.ann[key()] = []; commit(); } }, T.icon("reset"), lab("Temizle")));
      }
      const key = () => (st.blank ? "b" : "") + st.page;
      const curOps = () => (st.ann[key()] = st.ann[key()] || []);
      const commit = () => { if (st.doc) saveAnn(st.doc, st.ann); drawAnn(); };

      /* Çizimler sayfaya göre 0-1 koordinatta saklanır; yakınlaştırınca bozulmaz */
      function drawAnn(live) {
        const c = acv.getContext("2d"), W = acv.width, H = acv.height; c.clearRect(0, 0, W, H);
        const list = curOps().concat(live ? [live] : []);
        for (const o of list) {
          c.save(); c.strokeStyle = c.fillStyle = o.c; c.lineWidth = o.w * (W / 900) * 1.4; c.lineCap = c.lineJoin = "round";
          if (o.k === "vurgu") { c.globalAlpha = 0.35; c.lineWidth = o.w * (W / 900) * 5; }
          const P = ([x, y]) => [x * W, y * H];
          if (o.k === "kalem" || o.k === "vurgu") { c.beginPath(); o.p.forEach((pt, i) => { const [x, y] = P(pt); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
          else if (o.k === "cizgi" || o.k === "ok") { const [x1, y1] = P(o.a), [x2, y2] = P(o.b); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); if (o.k === "ok") { const a = Math.atan2(y2 - y1, x2 - x1), L = 18 + o.w * 3; c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)); c.moveTo(x2, y2); c.lineTo(x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)); c.stroke(); } }
          else if (o.k === "kutu") { const [x1, y1] = P(o.a), [x2, y2] = P(o.b); c.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1)); }
          else if (o.k === "daire") { const [x1, y1] = P(o.a), [x2, y2] = P(o.b); c.beginPath(); c.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) / 2 || 1, Math.abs(y2 - y1) / 2 || 1, 0, 0, Math.PI * 2); c.stroke(); }
          else if (o.k === "yazi") { const [x, y] = P(o.a); c.font = `700 ${o.w * 7 * (W / 900)}px Lexend, sans-serif`; c.textBaseline = "top"; c.fillText(o.t, x, y); }
          else if (o.k === "damga" || o.k === "onay") { const [x, y] = P(o.a); c.font = `${60 * (W / 900)}px sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.globalAlpha = 1; c.fillText(o.k === "damga" ? "⭐" : "✅", x, y); }
          c.restore();
        }
      }
      let draft = null;
      const npt = (e) => { const r = acv.getBoundingClientRect(); return [T.clamp((e.clientX - r.left) / r.width, 0, 1), T.clamp((e.clientY - r.top) / r.height, 0, 1)]; };
      acv.addEventListener("pointerdown", (e) => {
        if (st.tool === "el") return;
        acv.setPointerCapture(e.pointerId); const p = npt(e);
        if (st.tool === "spot") { st.spot = p; paintSpot(); draft = { k: "spot" }; return; }
        if (st.tool === "silgi") { erase(p); draft = { k: "silgi" }; return; }
        if (st.tool === "yazi") { const inp = h("input.in", { placeholder: "Yazı" }); T.modal({ title: "Sayfaya yaz", body: inp, actions: [{ label: "Vazgeç" }, { label: "Ekle", tone: "c-leaf", onClick: () => { if (inp.value.trim()) { curOps().push({ k: "yazi", a: p, t: inp.value.trim(), c: st.color, w: st.width }); commit(); } } }] }); return; }
        if (st.tool === "damga" || st.tool === "onay") { curOps().push({ k: st.tool, a: p, c: st.color, w: st.width }); T.sound.pop(); commit(); return; }
        draft = st.tool === "kalem" || st.tool === "vurgu" ? { k: st.tool, p: [p], c: st.color, w: st.width } : { k: st.tool, a: p, b: p, c: st.color, w: st.width };
      });
      acv.addEventListener("pointermove", (e) => {
        if (!draft) return; const p = npt(e);
        if (draft.k === "spot") { st.spot = p; paintSpot(); return; }
        if (draft.k === "silgi") { erase(p); return; }
        if (draft.p) draft.p.push(p); else draft.b = p;
        drawAnn(draft);
      });
      const up = () => { if (!draft) return; if (draft.k !== "spot" && draft.k !== "silgi") curOps().push(draft); draft = null; commit(); };
      acv.addEventListener("pointerup", up); acv.addEventListener("pointercancel", up);
      function erase([x, y]) {
        const ops = curOps(), r = 0.025, near = (pt) => Math.hypot(pt[0] - x, pt[1] - y) < r;
        const keep = ops.filter((o) => !(o.p ? o.p.some(near) : near(o.a) || (o.b && near(o.b)) || (o.a && o.b && near([(o.a[0] + o.b[0]) / 2, (o.a[1] + o.b[1]) / 2]))));
        if (keep.length !== ops.length) { st.ann[key()] = keep; commit(); }
      }
      function paintSpot() { const [x, y] = st.spot || [0.5, 0.4]; spotEl.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, transparent 0 130px, rgba(0,0,0,.78) 135px)`; }
      function paintCurtain() { curtain.style.display = st.curtain ? "block" : "none"; curtain.style.height = st.curtain * 100 + "%"; }
      T.dragMove(curtain, { onStart: () => ({ h: st.curtain, H: pageWrap.clientHeight }), onMove: (dx, dy, e, s) => { st.curtain = T.clamp(s.h + dy / s.H, 0.04, 1); paintCurtain(); } });

      /* Dokun ve dinle: metin katmanındaki kelimeye dokununca okunur, hecelenir */
      tl.addEventListener("click", (e) => {
        if (st.tool !== "el") return;
        const span = e.target.closest("span"); if (!span) return;
        let text = span.textContent.trim();
        // tıklanan kelimeyi bul
        try { const rng = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null; if (rng && rng.startContainer.nodeType === 3) { const s = rng.startContainer.textContent, i = rng.startOffset; const a = s.slice(0, i).search(/[^\s.,!?;:"'()]*$/), m = s.slice(i).match(/^[^\s.,!?;:"'()]*/); const w = (s.slice(a, i) + (m ? m[0] : "")).trim(); if (w.length > 1) text = w; } } catch (er) {}
        if (!text) return;
        T.speak(text);
        const r = scroller.getBoundingClientRect();
        chip.style.display = "block"; chip.style.left = (e.clientX - r.left + scroller.scrollLeft + 10) + "px"; chip.style.top = (e.clientY - r.top + scroller.scrollTop + 16) + "px";
        chip.replaceChildren(text.split(/\s+/).length === 1 ? T.heceler(text).join(" - ") : text);
        clearTimeout(chip._t); chip._t = setTimeout(() => (chip.style.display = "none"), 3500);
      });

      async function render() {
        const page = await st.pdf.getPage(st.page);
        const avail = scroller.clientWidth - 32, availH = scroller.clientHeight - 32;
        const vp0 = page.getViewport({ scale: 1 });
        const fit = Math.min(avail / vp0.width, availH / vp0.height);
        const scale = fit * st.zoom;
        const vp = page.getViewport({ scale });
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        pcv.width = vp.width * dpr; pcv.height = vp.height * dpr; pcv.style.width = vp.width + "px"; pcv.style.height = vp.height + "px";
        acv.width = vp.width * dpr; acv.height = vp.height * dpr; acv.style.width = vp.width + "px"; acv.style.height = vp.height + "px";
        pageWrap.style.width = vp.width + "px"; pageWrap.style.height = vp.height + "px";
        const ctx = pcv.getContext("2d");
        if (st.blank) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, pcv.width, pcv.height); tl.replaceChildren(); }
        else {
          if (st.task) try { st.task.cancel(); } catch (e) {}
          st.task = page.render({ canvasContext: ctx, viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null });
          try { await st.task.promise; } catch (e) { return; }
          tl.replaceChildren(); tl.style.width = vp.width + "px"; tl.style.height = vp.height + "px"; tl.style.setProperty("--scale-factor", scale);
          try { const tc = await page.getTextContent(); pdfLib.renderTextLayer({ textContentSource: tc, container: tl, viewport: vp, textDivs: [] }); } catch (e) {}
        }
        pageInfo.textContent = st.blank ? "Boş sayfa" : `${st.page} / ${st.pdf.numPages}`;
        const ji = nav.querySelector("input[type=number]"); if (ji) ji.value = st.page;
        drawAnn(); paintCurtain();
        try { localStorage.setItem("tahta-kitap-sayfa", String(st.page)); } catch (e) {}
      }
      const go = (n) => { if (!st.pdf) return; st.page = T.clamp(n, 1, st.pdf.numPages); st.blank = false; render(); };
      async function open(file, remember = true) {
        loading.replaceChildren(h("div.ai-status", { style: { background: "var(--paper)" } }, h("div.spinner"), "Kitap açılıyor..."));
        try {
          const lib = await loadPdfJs();
          const buf = await file.arrayBuffer();
          st.pdf = await lib.getDocument({ data: buf }).promise;
          st.doc = { name: file.name || "kitap.pdf", size: file.size || buf.byteLength }; st.ann = loadAnn(st.doc);
          let last = 1; try { last = +localStorage.getItem("tahta-kitap-sayfa") || 1; } catch (e) {}
          st.page = T.clamp(last, 1, st.pdf.numPages);
          if (remember) idb.put("son", { name: st.doc.name, blob: file });
          loading.replaceChildren(); paintNav(); render();
        } catch (e) { loading.replaceChildren(h("div.paper", { style: { padding: "16px" } }, "Kitap açılamadı: " + (e.message || e))); }
      }
      const loading = h("div");
      const nav = h("div.row");
      function paintNav() {
        const jump = h("input.in", { type: "number", min: 1, max: st.pdf ? st.pdf.numPages : 1, value: st.page, style: { width: "90px" }, "aria-label": "Sayfa" });
        jump.addEventListener("change", () => go(+jump.value));
        const isBook1 = st.pdf && st.pdf.numPages === BOOK1.pages;
        nav.replaceChildren(
          h("button.btn.c-chalk", { onclick: () => go(st.page - 1), "aria-label": "Önceki sayfa" }, T.icon("back")),
          pageInfo, h("button.btn.c-chalk", { onclick: () => go(st.page + 1), "aria-label": "Sonraki sayfa" }, T.icon("next")), jump,
          h("button.btn.icon.c-chalk", { "aria-label": "Uzaklaştır", onclick: () => { st.zoom = Math.max(0.5, st.zoom - 0.25); render(); } }, T.icon("minus")),
          h("button.btn.icon.c-chalk", { "aria-label": "Yakınlaştır", onclick: () => { st.zoom = Math.min(4, st.zoom + 0.25); render(); } }, T.icon("plus")),
          h("button.btn.c-chalk", { onclick: () => { st.zoom = 1; render(); } }, "Sığdır"), h("button.btn.c-chalk", { onclick: () => { const pg = st.pdf && st.zoom; st.zoom = (scroller.clientWidth - 32) / Math.max(1, pcv.clientWidth / st.zoom); render(); } }, "Ene sığdır"),
          h("button.btn" + (st.blank ? ".c-sun" : ".c-chalk"), { onclick: () => { st.blank = !st.blank; paintNav(); render(); } }, T.icon("board"), st.blank ? "Kitaba dön" : "Boş tahta"),
          h("button.btn.icon.c-chalk", { onclick: fullscreen, title: "Tam ekran", "aria-label": "Tam ekran" }, T.icon("full")),
          isBook1 ? h("div.row", { style: { gap: "4px" } }, h("span.hint", { style: { color: "var(--chalk)" } }, "Sese git:"), Object.entries(BOOK1.start).map(([l, p]) => h("button.btn.sm.c-sun", { style: { minWidth: "34px", padding: "4px 8px", fontSize: "19px" }, onclick: () => go(p) }, l))) : null,
          h("label.btn.icon.c-chalk", { style: { cursor: "pointer" }, title: "Başka kitap aç", "aria-label": "Başka kitap aç" }, T.icon("download"), fileInput()));
      }
      function fullscreen() { try { (document.fullscreenElement ? document.exitFullscreen() : host.closest(".view").requestFullscreen()).catch(() => T.toast("Bu ortamda tam ekran kapalı")); } catch (e) { T.toast("Bu ortamda tam ekran kapalı"); } }
      const fileInput = () => h("input", { type: "file", accept: "application/pdf,.pdf", style: { display: "none" }, onchange: (e) => { const f = e.target.files[0]; if (f) open(f); } });
      const onKey = (e) => { if (e.target.matches("input, textarea")) return; if (e.key === "ArrowRight" || e.key === "PageDown") go(st.page + 1); if (e.key === "ArrowLeft" || e.key === "PageUp") go(st.page - 1); };
      document.addEventListener("keydown", onKey); T.onLeave(() => document.removeEventListener("keydown", onKey));
      let rt; const ro = new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => st.pdf && render(), 200); }); ro.observe(scroller); T.onLeave(() => ro.disconnect());

      const empty = h("div.paper", { style: { padding: "26px", display: "grid", gap: "14px", maxWidth: "760px", margin: "30px auto" } },
        h("h2", { style: { fontSize: "26px" } }, "Ders kitabını aç"),
        h("p", { style: { margin: 0 } }, "Kitabın PDF dosyasını seç. EBA ya da MEB sitesinden indirdiğin kitaplar olur. Kitap yalnızca bu cihazda açılır, bir yere yüklenmez; bir dahaki sefere kaldığın sayfadan açılır."),
        h("label.btn.big.c-tomato", { style: { cursor: "pointer", justifySelf: "start" } }, T.icon("turkce"), "PDF seç", fileInput()),
        h("p.hint", { style: { margin: 0 } }, "Sayfa üstünde kalem, fosforlu kalem, kutu, ok, yazı ve yıldız kullanabilirsin. Perde sayfanın bir kısmını örter, spot ışığı bir yeri öne çıkarır. El aracındayken bir kelimeye dokununca kelime okunur ve hecelenir."));
      scroller.addEventListener("dragover", (e) => e.preventDefault());
      scroller.addEventListener("drop", (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && /pdf$/i.test(f.name)) open(f); });
      (host._bar || host).append(nav); host.append(loading, h("div", { style: { display: "grid", gridTemplateColumns: "110px minmax(0,1fr)", gap: "12px" } }, side, scroller));
      pageWrap.style.display = "none"; scroller.append(empty);
      const origRender = render;
      render = async () => { empty.remove(); pageWrap.style.display = "block"; return origRender(); };
      paintSide(); acv.style.pointerEvents = "none";
      idb.get("son").then((rec) => { if (rec && rec.blob) open(new File([rec.blob], rec.name || "kitap.pdf", { type: "application/pdf" }), false); });
    } });
})();
