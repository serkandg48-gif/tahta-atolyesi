/* Sohbet ve düşünme araçları: Söz ağı (canlı tartışma haritası) */
(function () {
  const { h } = T; const W = T.widgets; const NS = "http://www.w3.org/2000/svg";
  const gelenler = (cls) => { const s = T.store.get(), a = (s.attendance[cls.id] || {})[T.isoDate()] || {}; return cls.students.filter((st) => a[st.id] !== "yok"); };
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };

  /* ---------- Söz ağı: konuşan öğrenciye dokundukça bir öncekinden ona çizgi uzanır ---------- */
  W.sozagi = {
    title: "Söz ağı", icon: "talk", tone: "grape", w: 640, h: 560, desc: "Tartışmada sözün sınıfa nasıl yayıldığını gösterir",
    init: () => ({ sira: [], ozet: false }),
    render(body, w, api) {
      const d = w.data; d.sira = d.sira || [];
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      const svg = el("svg", { viewBox: "0 0 600 470", class: "sa-svg", role: "img", "aria-label": "Söz ağı" });
      const bilgi = h("div.sa-bilgi");
      const ozetKutu = h("div.sa-ozet");
      body.append(h("div.sa-kap", svg, ozetKutu), h("div.row", { style: { gap: "6px", justifyContent: "center" } }, bilgi,
        h("button.btn.sm.c-chalk", { onclick: () => { d.sira.pop(); api.save(); ciz(); } }, T.icon("undo"), "Geri al"),
        h("button.btn.sm.c-grape", { onclick: () => { d.ozet = !d.ozet; api.save(); ciz(); } }, T.icon("chart"), "Sohbeti incele"),
        h("button.btn.sm.c-chalk", { onclick: async () => { if (d.sira.length && !(await T.confirm("Yeni sohbet", "Söz ağı temizlensin mi?", "Temizle"))) return; d.sira = []; d.ozet = false; api.save(); ciz(); } }, T.icon("reset"), "Yeni sohbet")));
      function ciz() {
        const st = gelenler(api.cls()); const n = st.length;
        const yer = { ogr: [300, 235] };
        st.forEach((s, i) => { const a = -Math.PI / 2 + (i / Math.max(1, n)) * Math.PI * 2; yer[s.id] = [300 + Math.cos(a) * 250, 235 + Math.sin(a) * 195]; });
        const say = {}; d.sira.forEach((x) => (say[x] = (say[x] || 0) + 1));
        const cift = {}; for (let i = 1; i < d.sira.length; i++) { const a = d.sira[i - 1], b = d.sira[i]; if (a === b) continue; const k = [a, b].sort().join("|"); cift[k] = (cift[k] || 0) + 1; }
        svg.replaceChildren();
        const tek = d.sira.length ? d.sira[d.sira.length - 1] : null;
        Object.entries(cift).forEach(([k, c]) => { const [a, b] = k.split("|"); if (!yer[a] || !yer[b]) return;
          svg.append(el("line", { x1: yer[a][0], y1: yer[a][1], x2: yer[b][0], y2: yer[b][1], class: "sa-cizgi" + (a === "ogr" || b === "ogr" ? " ogr" : ""), "stroke-width": Math.min(14, 2 + c * 2) })); });
        if (d.sira.length > 1) { const a = d.sira[d.sira.length - 2], b = tek; if (a !== b && yer[a] && yer[b]) svg.append(el("line", { x1: yer[a][0], y1: yer[a][1], x2: yer[b][0], y2: yer[b][1], class: "sa-son" })); }
        const dugum = (id, ad, kisa) => { const [x, y] = yer[id]; const c = say[id] || 0, r = 21 + Math.min(14, c * 2.5);
          const g = el("g", { class: "sa-dugum" + (c ? " konustu" : "") + (id === tek ? " simdi" : "") + (id === "ogr" ? " ogretmen" : ""), tabindex: "0", role: "button", "aria-label": ad });
          g.append(el("circle", { cx: x, cy: y, r }));
          const t = el("text", { x, y: y + 5, "text-anchor": "middle" }); t.textContent = kisa; g.append(t);
          if (c) { const b = el("text", { x: x + r - 4, y: y - r + 8, class: "sa-sayi", "text-anchor": "middle" }); b.textContent = c; g.append(b); }
          const sec = () => { d.sira.push(id); api.save(); T.sound.pop && T.sound.pop(); ciz(); };
          g.addEventListener("click", sec); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
          svg.append(g); };
        dugum("ogr", "Öğretmen", "Öğrt.");
        st.forEach((s) => dugum(s.id, s.name, s.name.split(" ")[0].slice(0, 7)));
        const konusan = st.filter((s) => say[s.id]).length;
        bilgi.textContent = d.sira.length ? konusan + " / " + n + " öğrenci söz aldı" : "Konuşana dokun";
        ozetKutu.hidden = !d.ozet;
        if (d.ozet) {
          const sessiz = st.filter((s) => !say[s.id]);
          const ogrSay = say.ogr || 0, ogrSiz = d.sira.length - ogrSay;
          const ard = (() => { let m = 0, c = 0; d.sira.forEach((x) => { if (x === "ogr") c = 0; else { c++; m = Math.max(m, c); } }); return m; })();
          const enCok = st.filter((s) => say[s.id]).sort((a, b) => say[b.id] - say[a.id]).slice(0, 3);
          ozetKutu.replaceChildren(h("h3", "Sohbetimiz nasıl geçti?"),
            h("p", d.sira.length + " kez söz alındı. " + ogrSay + " kez öğretmen, " + ogrSiz + " kez öğrenciler konuştu."),
            h("p", ard >= 3 ? "Öğretmene dönmeden en uzun " + ard + " öğrenci art arda konuştu. Söz öğrenciler arasında dolaştı." : "Söz çoğunlukla öğretmen üzerinden geçti. Bir dahaki sefere öğrencilerin birbirine yanıt vermesini deneyebiliriz."),
            enCok.length ? h("p", "En çok söz alanlar: " + enCok.map((s) => s.name + " (" + say[s.id] + ")").join(", ")) : null,
            sessiz.length ? h("p", "Henüz söz almayanlar: " + sessiz.map((s) => s.name).join(", ")) : h("p", "Herkes en az bir kez söz aldı."),
            h("button.btn.sm.c-chalk", { onclick: () => { d.ozet = false; api.save(); ciz(); } }, "Ağa dön"));
        }
      }
      ciz();
    },
  };

  /* ---------- Yavaş bakış: görsel parça parça açılır, her parçada gör, düşün, merak et ---------- */
  const SORU = ["Ne görüyorsun?", "Bu sana ne düşündürüyor?", "Neyi merak ediyorsun?", "Neden öyle düşünüyorsun?", "Yeni parça fikrini değiştirdi mi?"];
  W.yavasbakis = {
    title: "Yavaş bakış", icon: "eye", tone: "sky", w: 760, h: 560, desc: "Görsel parça parça açılır; gör, düşün, merak et",
    init: () => ({ n: 3, acik: [], gorsel: null }),
    render(body, w, api) {
      const d = w.data; d.acik = d.acik || [];
      body.style.gridTemplateRows = "auto 1fr auto"; body.style.gap = "8px";
      const soru = h("div.yb-soru"), sahne = h("div.yb-sahne"), alt = h("div.row", { style: { gap: "6px", justifyContent: "center" } });
      body.append(soru, sahne, alt);
      const dosya = h("input", { type: "file", accept: "image/*", hidden: true, onchange: async (e) => {
        const f = e.target.files[0]; if (!f) return;
        const b = T.gorselKucult ? await T.gorselKucult(f, 1600) : f; const k = "yb-" + w.id;
        if (!(await T.gorselDepo.put(k, b))) return T.toast("Görsel kaydedilemedi");
        d.gorsel = k; d.acik = []; api.save(); ciz();
      } });
      async function ciz() {
        const toplam = d.n * d.n, acik = d.acik.length;
        soru.textContent = !d.gorsel ? "Bir görsel seç: sanat eseri, doğa fotoğrafı, eski bir belge" : acik === 0 ? "Hazır mıyız? İlk parçayı açalım." : acik >= toplam ? "Bütün resim önünde. İlk tahminin neydi?" : SORU[(acik - 1) % SORU.length];
        alt.replaceChildren(
          h("label.btn.sm.c-chalk", { style: { cursor: "pointer" } }, T.icon("frame"), d.gorsel ? "Başka görsel" : "Görsel seç", dosya),
          d.gorsel ? h("div.seg", [3, 4, 5].map((n) => h("button", { "aria-pressed": String(d.n === n), onclick: () => { d.n = n; d.acik = []; api.save(); ciz(); } }, n + "×" + n))) : null,
          d.gorsel ? h("button.btn.sm.c-sky", { disabled: acik >= toplam ? true : null, onclick: () => { const kapali = [...Array(toplam).keys()].filter((i) => !d.acik.includes(i)); if (!kapali.length) return; d.acik.push(kapali[T.rand(0, kapali.length - 1)]); api.save(); ciz(); } }, T.icon("dice"), "Rastgele aç") : null,
          d.gorsel ? h("button.btn.sm.c-chalk", { onclick: () => { d.acik = acik >= toplam ? [] : [...Array(toplam).keys()]; api.save(); ciz(); } }, acik >= toplam ? "Yeniden kapat" : "Hepsini aç") : null);
        if (!d.gorsel) { sahne.replaceChildren(h("div.yb-bos", T.icon3d("buyutec"), h("p", "Öğrenciler önce küçük bir ayrıntıya bakar, gördüklerini ve tahminlerini paylaşır. Sen parçaları tek tek açarsın."))); return; }
        const b = await T.gorselDepo.get(d.gorsel); if (!b) { d.gorsel = null; api.save(); return ciz(); }
        if (sahne._url) URL.revokeObjectURL(sahne._url); sahne._url = URL.createObjectURL(b);
        const img = h("img", { src: sahne._url, alt: "Yavaş bakış görseli" });
        const izgara = h("div.yb-izgara", { style: { gridTemplateColumns: "repeat(" + d.n + ", 1fr)", gridTemplateRows: "repeat(" + d.n + ", 1fr)" } },
          [...Array(toplam).keys()].map((i) => h("button.yb-parca" + (d.acik.includes(i) ? ".acik" : ""), { "aria-label": (i + 1) + ". parça", onclick: () => { if (!d.acik.includes(i)) { d.acik.push(i); T.sound.pop && T.sound.pop(); } else d.acik = d.acik.filter((x) => x !== i); api.save(); ciz(); } }, d.acik.includes(i) ? null : h("span", i + 1))));
        const cer = h("div.yb-cerceve", img, izgara);
        img.onload = () => cer.style.setProperty("--r", (img.naturalWidth / img.naturalHeight).toFixed(4));
        sahne.replaceChildren(cer);
      }
      ciz();
      api.onDestroy && api.onDestroy(() => { if (sahne._url) URL.revokeObjectURL(sahne._url); });
    },
  };

  /* ---------- Doğa zamanlayıcısı: rakam yok; süre ilerledikçe güneş batar, çiçek açar ya da tekne dereyi geçer ---------- */
  const SAHNE = [["gunes", "Gün batımı"], ["cicek", "Çiçek açıyor"], ["tekne", "Kâğıt tekne"]];
  const karis = (a, b, t) => { const p = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16)); const A = p(a), B = p(b); return "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",") + ")"; };
  W.dogazaman = {
    title: "Doğa zamanlayıcısı", icon: "sun", tone: "leaf", w: 560, h: 470, desc: "Rakamsız sakin zamanlayıcı",
    init: () => ({ sahne: "gunes", total: 300, left: 300, running: false, endAt: 0 }),
    render(body, w, api) {
      const d = w.data;
      body.style.gridTemplateRows = "1fr auto auto"; body.style.gap = "8px";
      const svg = el("svg", { viewBox: "0 0 400 260", class: "dz-svg", preserveAspectRatio: "xMidYMid slice" });
      const oyna = h("button.btn.sm.c-leaf", { onclick: () => { T.sound.unlock(); if (d.running) { d.left = Math.max(0, (d.endAt - Date.now()) / 1000); d.running = false; } else { if (d.left <= 0) d.left = d.total; d.endAt = Date.now() + d.left * 1000; d.running = true; } api.save(); boya(); } });
      body.append(h("div.dz-kap", svg),
        h("div.row", { style: { justifyContent: "center", gap: "6px" } }, h("div.seg", SAHNE.map(([k, l]) => h("button", { "aria-pressed": String(d.sahne === k), onclick: () => { d.sahne = k; api.save(); api.rerender(); } }, l)))),
        h("div.row", { style: { justifyContent: "center", gap: "6px" } }, [1, 3, 5, 10, 15].map((m) => h("button.btn.sm.c-chalk", { "aria-pressed": String(d.total === m * 60), onclick: () => { d.total = d.left = m * 60; d.running = false; api.save(); api.rerender(); } }, m + " dk")), oyna));
      /* sahneyi bir kez kur, sonra yalnızca değerleri güncelle */
      const g = {};
      if (d.sahne === "gunes") {
        svg.append(g.gok = el("rect", { width: 400, height: 260 }), g.gunes = el("circle", { cx: 200, r: 34, fill: "#FFD45A" }),
          el("path", { d: "M0 190 Q80 150 160 180 T320 170 T400 180 V260 H0Z", fill: "#3d5a4a" }), el("path", { d: "M0 215 Q100 190 200 210 T400 205 V260 H0Z", fill: "#2c4337" }), g.gece = el("rect", { width: 400, height: 260, fill: "#0e1a33", opacity: 0 }));
      } else if (d.sahne === "cicek") {
        svg.append(el("rect", { width: 400, height: 260, fill: "#dff1fb" }), el("rect", { y: 215, width: 400, height: 45, fill: "#8fc977" }),
          g.sap = el("line", { x1: 200, y1: 216, x2: 200, y2: 216, stroke: "#4c9a4a", "stroke-width": 7, "stroke-linecap": "round" }),
          g.yap1 = el("ellipse", { rx: 0, ry: 0, fill: "#5fb35a" }), g.yap2 = el("ellipse", { rx: 0, ry: 0, fill: "#5fb35a" }), g.tac = el("g"));
        for (let i = 0; i < 8; i++) g.tac.append(el("ellipse", { cx: 0, cy: -22, rx: 11, ry: 22, fill: i % 2 ? "#F29BB8" : "#EE7FA6", transform: "rotate(" + i * 45 + ")" }));
        g.tac.append(el("circle", { r: 13, fill: "#F4CF4B" }));
      } else {
        svg.append(el("rect", { width: 400, height: 260, fill: "#cfe8d0" }), el("path", { d: "M-10 150 C80 110 140 200 220 160 S350 120 410 150 L410 210 C330 180 260 240 190 210 S60 170 -10 205Z", fill: "#7cc2e6" }),
          el("path", { d: "M-10 170 C80 130 140 215 220 180 S350 140 410 172", fill: "none", stroke: "#a8daf2", "stroke-width": 3, "stroke-dasharray": "14 12" }),
          el("rect", { x: 352, y: 118, width: 40, height: 70, rx: 6, fill: "#c98b54" }), el("path", { d: "M346 120 L372 96 L398 120Z", fill: "#b8473a" }),
          g.tekne = el("path", { d: "M-18 -6 L18 -6 L10 6 L-10 6Z M0 -6 L0 -26 L14 -8Z", fill: "#fff", stroke: "#8a96ae", "stroke-width": 1.5 }));
      }
      const yol = (t) => { const x = -10 + t * 370; const y = 175 - 22 * Math.sin((x + 30) / 60) ; return [x, y]; };
      let caldi = false;
      function boya() {
        const left = d.running ? Math.max(0, (d.endAt - Date.now()) / 1000) : d.left, t = 1 - left / d.total;
        if (d.running && left <= 0) { d.running = false; d.left = 0; api.save(); if (!caldi) { caldi = true; T.sound.bell(); } } if (left > 0) caldi = false;
        if (d.sahne === "gunes") { g.gok.setAttribute("fill", t < 0.6 ? karis("#8ec9ee", "#f6b26b", t / 0.6) : karis("#f6b26b", "#c4506a", (t - 0.6) / 0.4)); g.gunes.setAttribute("cy", 50 + t * 165); g.gunes.setAttribute("fill", karis("#FFE27A", "#F2673A", t)); g.gece.setAttribute("opacity", Math.max(0, (t - 0.85) * 2.4)); }
        else if (d.sahne === "cicek") { const boy = 20 + t * 130, ty = 216 - boy; g.sap.setAttribute("y2", ty); const ya = Math.min(1, t * 2.2);
          g.yap1.setAttribute("cx", 182); g.yap1.setAttribute("cy", 216 - boy * 0.4); g.yap1.setAttribute("rx", 18 * ya); g.yap1.setAttribute("ry", 8 * ya);
          g.yap2.setAttribute("cx", 218); g.yap2.setAttribute("cy", 216 - boy * 0.6); g.yap2.setAttribute("rx", 18 * ya); g.yap2.setAttribute("ry", 8 * ya);
          const ac = Math.max(0.15, Math.min(1, (t - 0.35) / 0.65)); g.tac.setAttribute("transform", "translate(200 " + ty + ") scale(" + ac + ")"); }
        else { const [x, y] = yol(Math.min(1, t)); g.tekne.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + (Math.cos((x + 30) / 60) * -12) + ")"); }
        oyna.replaceChildren(T.icon(d.running ? "pause" : "play"), d.running ? "Durdur" : left <= 0 ? "Yeniden" : "Başlat");
      }
      const iv = setInterval(boya, 300); api.onDestroy(() => clearInterval(iv)); boya();
    },
  };
})();
