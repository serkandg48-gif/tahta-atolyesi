/* Matematik sohbetleri: altı bölüm tek araçta.
   Kaç tane görüyorsun, Hangisi farklı, Ne fark ettin ne merak ediyorsun, Tahmin et, Sayı dizgisi, Eksik parça.
   Resimler bu uygulama için çizilir. "Ne fark ettin" ve "Tahmin et" bölümlerinde öğretmen Openverse'ten serbest lisanslı görsel arayabilir. */
(function () {
  const { h } = T; const S = T.svg;
  const eski = T.tools["matematik-konusmasi"] && T.tools["matematik-konusmasi"].render;
  const RENK = ["#E2412F", "#1F7AE0", "#F4B400", "#2FA84F", "#7B4FD6", "#EC5D9A"];
  const pul = (x, y, r, c) => S("circle", { cx: x, cy: y, r, fill: T.m3(c), filter: "url(#m3-golge-k)" });
  const fmt = (n) => (Math.round(n * 1000) / 1000).toLocaleString("tr-TR");
  const not = (yer) => { /* öğrencilerin söylediklerini yazan yapışkan notlar */
    const liste = h("div.ms-notlar"), inp = h("input.in", { placeholder: "Bir öğrencinin söylediğini yaz, Enter", "aria-label": "Not" });
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim()) { liste.append(h("div.ms-not", inp.value.trim())); inp.value = ""; } });
    return h("div.ms-notkap", h("b", yer), inp, liste);
  };
  const svgKap = () => { T.m3kur(); return S("svg", { viewBox: "0 0 1000 560", style: "width:100%;height:100%" }); };
  const ZAR = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };

  /* ---------- Openverse görsel arama ---------- */
  function gorselAra(sec) {
    const sonuc = h("div.ms-ara-sonuc"), durum = h("p.hint", "Serbest lisanslı fotoğraflar aranır. Görselin altında sahibi ve lisansı yazar.");
    const inp = h("input.in", { placeholder: "Ne arıyorsunuz? Örnek: yumurta kolisi", "aria-label": "Görsel ara" });
    const ara = async () => {
      const q = inp.value.trim(); if (!q) return; sonuc.replaceChildren(); durum.textContent = "Aranıyor...";
      let ing = q;
      try { if (T.ai && T.ai.mode && T.ai.mode()) { const j = await T.ai.askJSON(`Bu Türkçe görsel arama ifadesini kısa İngilizce arama kelimelerine çevir: "${q.replace(/"/g, "")}". JSON: {"q": "..."}`); if (j && j.q) ing = j.q; } } catch (e) { /* çeviri olmazsa Türkçe ara */ }
      try {
        const r = await fetch("https://api.openverse.org/v1/images/?page_size=24&mature=false&q=" + encodeURIComponent(ing));
        const j = await r.json(); const L = (j.results || []).filter((x) => x.url);
        durum.textContent = L.length ? "Bir görsele dokunun." : "Sonuç çıkmadı. Başka bir kelime deneyin.";
        sonuc.replaceChildren(...L.map((x) => h("button.ms-ara-k", { "aria-label": x.title || "Görsel", onclick: () => {
          const kunye = [x.title, x.creator, (x.license || "").toUpperCase() + (x.license_version ? " " + x.license_version : ""), x.source].filter(Boolean).join(" · ");
          kapat(); sec(x.url, kunye, x.thumbnail);
        } }, h("img", { src: x.thumbnail || x.url, alt: x.title || "", loading: "lazy" }))));
      } catch (e) { durum.textContent = "Arama yapılamadı. İnternet bağlantısını kontrol edin."; }
    };
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") ara(); });
    const pen = h("div.ms-ara", h("div.ms-ara-ic", h("div.row", { style: { gap: "8px" } }, inp, h("button.btn.c-sky", { onclick: ara }, T.icon("search"), "Ara"), h("button.btn.c-chalk", { onclick: () => kapat(), "aria-label": "Kapat" }, T.icon("close"))), durum, sonuc));
    const kapat = () => pen.remove();
    document.body.append(pen); setTimeout(() => inp.focus(), 30);
  }

  /* ---------- 1. Kaç tane görüyorsun ---------- */
  function kacTane(kap) {
    const g = T.store.grade(); let gruplar = [], gizli = true, cizgi = false, cevap = false, zaman = null;
    const sahne = h("div.ms-sahne"), bilgi = h("div.ms-bilgi");
    const uret = () => {
      const [mn, mx] = g <= 1 ? [4, 10] : g === 2 ? [7, 18] : [12, 30];
      let n = T.rand(mn, mx); gruplar = [];
      while (n > 0) { const k = Math.min(n, T.rand(g <= 1 ? 2 : 3, 6)); gruplar.push(k); n -= k; }
      if (gruplar.length > 6) gruplar = [gruplar.reduce((a, b) => a + b, 0)].flatMap((t) => { const o = []; while (t > 0) { o.push(Math.min(6, t)); t -= 6; } return o; });
      gizli = true; cizgi = false; cevap = false; ciz();
    };
    const ciz = () => {
      const s = svgKap(), n = gruplar.length, top = gruplar.reduce((a, b) => a + b, 0);
      s.append(S("rect", { width: 1000, height: 560, rx: 24, fill: "url(#m3-kagit)" }));
      const kol = Math.min(n, 3), sat = Math.ceil(n / kol), w = 1000 / kol, hh = 560 / sat, r = Math.min(30, w / 9, hh / 10.5);
      const renk = T.pick(RENK);
      gruplar.forEach((k, i) => {
        const cx = w * (i % kol) + w / 2, cy = hh * Math.floor(i / kol) + hh / 2 - (cizgi ? 14 : 0), d = r * 2.6;
        if (cizgi) s.append(S("rect", { x: cx - d * 1.55, y: cy - d * 1.55, width: d * 3.1, height: d * 3.1, rx: 26, fill: "none", stroke: RENK[(i + 1) % 6], "stroke-width": 5, "stroke-dasharray": "14 9" }), S("text", { x: cx, y: cy + d * 1.55 + 34, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 34, fill: "#1B2A4A" }, k));
        ZAR[k].forEach(([x, y]) => s.append(pul(cx + x * d, cy + y * d, r, renk)));
      });
      if (gizli) s.append(S("rect", { width: 1000, height: 560, rx: 24, fill: "#1B2A4A" }), S("text", { x: 500, y: 300, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 60, fill: "#fff" }, "Hazır olunca bak"));
      sahne.replaceChildren(s);
      bilgi.replaceChildren(
        h("p.ms-soru", "Kaç tane görüyorsun? Nasıl gördün?"),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap" } },
          h("button.btn.c-sun", { onclick: goster }, T.icon("eye"), "3 saniye göster"),
          h("button.btn.c-chalk", { onclick: () => { clearTimeout(zaman); gizli = false; ciz(); } }, "Açık bırak"),
          h("button.btn.c-chalk", { onclick: () => { cizgi = !cizgi; gizli = false; ciz(); } }, T.icon("groups"), "Bir görme yolu"),
          h("button.btn.c-leaf", { onclick: () => { cevap = !cevap; ciz(); } }, cevap ? top + " tane: " + gruplar.join(" + ") : "Cevabı göster"),
          h("button.btn.c-chalk", { onclick: uret }, T.icon("dice"), "Yeni resim")),
        not("Öğrencilerin gördüğü yollar"));
    };
    const goster = () => { clearTimeout(zaman); gizli = false; cizgi = false; ciz(); zaman = setTimeout(() => { gizli = true; ciz(); }, 3000); };
    kap.append(h("div.ms-duzen", sahne, bilgi)); uret();
  }

  /* ---------- 2. Hangisi farklı ---------- */
  const kart = (ic) => { const s = S("svg", { viewBox: "0 0 300 300", style: "width:100%;height:100%" }); ic(s); return s; };
  const sayiK = (n) => kart((s) => s.append(S("text", { x: 150, y: 190, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": String(n).length > 3 ? 90 : 130, fill: "#1B2A4A" }, String(n))));
  const SETLER = [
    { g: [1, 3], k: [() => kart((s) => ZAR[5].forEach(([x, y]) => s.append(pul(150 + x * 45, 150 + y * 45, 16, "#E2412F")))), () => kart((s) => [0, 1, 2, 3, 4].forEach((i) => s.append(pul(50 + i * 50, 150, 22, "#E2412F")))), () => kart((s) => ZAR[6].forEach(([x, y]) => s.append(pul(150 + x * 70, 150 + y * 70, 28, "#E2412F")))), () => kart((s) => ZAR[5].forEach(([x, y]) => s.append(pul(150 + x * 70, 150 + y * 70, 28, "#1F7AE0"))))],
      n: ["Pulları en küçük olan o.", "Pullar tek sıra hâlinde dizilmiş.", "6 pul var, ötekilerde 5.", "Mavi olan tek o."] },
    { g: [1, 4], k: [() => kart((s) => s.append(S("rect", { x: 60, y: 60, width: 180, height: 180, rx: 6, fill: T.m3d("#1F7AE0") }))), () => kart((s) => s.append(S("rect", { x: 30, y: 95, width: 240, height: 110, rx: 6, fill: T.m3d("#1F7AE0") }))), () => kart((s) => s.append(S("path", { d: "M150 45 L260 245 L40 245 Z", fill: T.m3d("#1F7AE0") }))), () => kart((s) => s.append(S("rect", { x: 100, y: 100, width: 100, height: 100, rx: 6, fill: T.m3d("#E2412F") })))],
      n: ["Büyük kare. Bütün kenarları eşit ve en büyük alan onun.", "Dikdörtgen. Kenarları eşit değil.", "Üçgen. Üç kenarı, üç köşesi var.", "Kırmızı ve en küçük olan o."] },
    { g: [2, 4], k: [() => sayiK(9), () => sayiK(16), () => sayiK(25), () => sayiK(43)], n: ["Tek basamaklı olan tek sayı.", "Çift olan tek sayı.", "5'in katı olan tek sayı.", "Kendisiyle çarpılınca bulunamayan tek sayı: 3×3, 4×4, 5×5 ama 43 öyle değil."] },
    { g: [2, 4], k: [() => sayiK(8), () => sayiK(21), () => sayiK(30), () => sayiK(44)], n: ["Tek basamaklı olan tek sayı.", "Tek sayı olan yalnız o.", "10'un katı olan yalnız o.", "Rakamları aynı olan yalnız o."] },
    { g: [3, 5], k: [
      () => kart((s) => { s.append(S("circle", { cx: 150, cy: 150, r: 110, fill: "#fff", stroke: "#1B2A4A", "stroke-width": 5 }), S("path", { d: "M150 40 A110 110 0 0 1 150 260 Z", fill: T.m3d("#F4B400"), stroke: "#1B2A4A", "stroke-width": 5 })); }),
      () => kart((s) => { [0, 1, 2, 3].forEach((i) => s.append(S("rect", { x: 30 + i * 60, y: 100, width: 60, height: 100, fill: i < 2 ? T.m3d("#F4B400") : "#fff", stroke: "#1B2A4A", "stroke-width": 5 }))); }),
      () => kart((s) => { s.append(S("circle", { cx: 150, cy: 150, r: 110, fill: "#fff", stroke: "#1B2A4A", "stroke-width": 5 }), S("path", { d: "M150 150 L150 40 A110 110 0 0 1 245.3 205 Z", fill: T.m3d("#F4B400"), stroke: "#1B2A4A", "stroke-width": 5 }), S("path", { d: "M150 150 L54.7 205", stroke: "#1B2A4A", "stroke-width": 5 })); }),
      () => kart((s) => { s.append(S("rect", { x: 50, y: 50, width: 200, height: 200, fill: "#fff", stroke: "#1B2A4A", "stroke-width": 5 }), S("path", { d: "M50 50 L250 250 L50 250 Z", fill: T.m3d("#F4B400"), stroke: "#1B2A4A", "stroke-width": 5 })); })],
      n: ["Yarım daire. Bütün iki parçaya bölünmüş.", "Dikdörtgen dört parçaya bölünmüş, 2/4 boyalı.", "Boyalı kısım 1/3. Ötekilerin hepsi yarım.", "Kare köşegenden bölünmüş, parçalar üçgen."] },
  ];
  function hangisi(kap) {
    const g = T.store.grade(); let L = SETLER.filter((x) => g >= x.g[0] && g <= x.g[1]); if (!L.length) L = SETLER;
    let i = 0, neden = false, sec = -1, kendi = null;
    const ic = h("div");
    const ciz = () => {
      const set = kendi || L[i];
      const hucre = (k, j) => h("button.ms-hf" + (sec === j ? ".sec" : ""), { onclick: () => { sec = sec === j ? -1 : j; T.sound.pop(); ciz(); } }, typeof k === "function" ? k() : sayiK(k), neden && set.n[j] ? h("small", set.n[j]) : null);
      const girdi = [0, 1, 2, 3].map((j) => h("input.in", { placeholder: (j + 1) + ". kutu", value: kendi ? kendi.k[j] : "", "aria-label": (j + 1) + ". kutu" }));
      ic.replaceChildren(
        h("p.ms-soru", "Hangisi farklı? Her biri farklı olabilir. Nedenini söyle."),
        h("div.ms-hf-kap", set.k.map(hucre)),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap" } },
          set.n.some(Boolean) ? h("button.btn.c-leaf", { onclick: () => { neden = !neden; ciz(); } }, T.icon("eye"), neden ? "Nedenleri gizle" : "Olası nedenler") : null,
          h("button.btn.c-chalk", { onclick: () => { kendi = null; i = (i + 1) % L.length; neden = false; sec = -1; ciz(); } }, T.icon("next"), "Başka dörtlü"),
          h("details.ms-kendi", h("summary", "Kendi dörtlünü yaz"), h("div.ms-kendi-ic", girdi, h("button.btn.c-sun", { onclick: () => { const k = girdi.map((x) => x.value.trim()); if (k.some((x) => !x)) return T.toast("Dört kutuyu da doldurun"); kendi = { k, n: ["", "", "", ""] }; neden = false; sec = -1; ciz(); } }, "Göster")))),
        not("Öğrencilerin nedenleri"));
    };
    kap.append(ic); ciz();
  }

  /* ---------- 4. Tahmin et ---------- */
  function tahmin(kap) {
    const g = T.store.grade(); let n = 0, tohum = [], ipucu = false, cevap = false, foto = null, fotoCevap = "";
    const sahne = h("div.ms-sahne"), bilgi = h("div.ms-bilgi");
    const uret = () => { n = T.rand(g <= 1 ? 15 : g === 2 ? 30 : 60, g <= 1 ? 30 : g === 2 ? 80 : 180); tohum = Array.from({ length: n }, () => [Math.random(), Math.random(), Math.random()]); ipucu = false; cevap = false; foto = null; ciz(); };
    const ciz = () => {
      if (foto) sahne.replaceChildren(h("figure.ms-foto", h("img", { src: foto.url, alt: "Seçilen fotoğraf", onerror: (e) => { if (foto.yedek && e.target.src !== foto.yedek) e.target.src = foto.yedek; } }), h("figcaption", foto.kunye)));
      else {
        const s = svgKap(); s.append(S("rect", { x: 60, y: 40, width: 880, height: 480, rx: 40, fill: "url(#m3-ahsap)", filter: "url(#m3-golge)" }), S("rect", { x: 90, y: 70, width: 820, height: 420, rx: 26, fill: "#F3E6CC" }));
        const r = Math.max(9, Math.min(22, Math.sqrt((820 * 420 * 0.38) / (n * Math.PI))));
        /* fasulyeleri tepsiye dağınık ama üst üste binmeden yerleştir */
        const yer = []; tohum.forEach(([a, b, c], k) => { let x, y, d = 0; do { x = 100 + r + Math.random() * (800 - 2 * r); y = 80 + r + Math.random() * (400 - 2 * r); d++; } while (d < 60 && yer.some(([p, q]) => (p - x) ** 2 + (q - y) ** 2 < (r * 1.9) ** 2)); yer.push([x, y]);
          const ilk10 = ipucu && k < 10;
          s.append(S("ellipse", { cx: x, cy: y, rx: r * 1.25, ry: r * 0.82, transform: `rotate(${c * 180} ${x} ${y})`, fill: T.m3(ilk10 ? "#2FA84F" : ["#7A3B1E", "#9C4E26", "#B8642E"][Math.floor(a * 3)]), stroke: ilk10 ? "#14532d" : "none", "stroke-width": 3 })); });
        if (cevap) s.append(S("rect", { x: 330, y: 230, width: 340, height: 100, rx: 20, fill: "rgba(27,42,74,.9)" }), S("text", { x: 500, y: 298, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 56, fill: "#fff" }, n + " fasulye"));
        sahne.replaceChildren(s);
      }
      const tahminSatiri = (et) => { const liste = h("div.ms-thl"), inp = h("input.in", { inputmode: "numeric", placeholder: et, "aria-label": et }); inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim()) { liste.append(h("span.ms-th", inp.value.trim())); inp.value = ""; } }); return h("div.ms-ts", h("b", et), inp, liste); };
      bilgi.replaceChildren(
        h("p.ms-soru", "Kaç tane olabilir? Önce çok az, sonra çok fazla, sonra en iyi tahminini söyle."),
        h("div.ms-tsler", tahminSatiri("Çok az"), tahminSatiri("Çok fazla"), tahminSatiri("En iyi tahmin")),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap" } },
          !foto ? h("button.btn.c-sun", { onclick: () => { ipucu = !ipucu; ciz(); } }, T.icon("spark"), ipucu ? "İpucunu gizle" : "İpucu: 10 tanesini göster") : null,
          foto ? h("input.in", { style: { width: "170px" }, inputmode: "numeric", placeholder: "Cevap (biliyorsanız)", value: fotoCevap, "aria-label": "Fotoğrafın cevabı", onchange: (e) => (fotoCevap = e.target.value) }) : null,
          h("button.btn.c-leaf", { onclick: () => { if (foto) { if (fotoCevap) T.toast("Cevap: " + fotoCevap); else T.toast("Fotoğraf için cevabı siz yazın"); return; } cevap = !cevap; ciz(); } }, T.icon("eye"), "Cevabı göster"),
          h("button.btn.c-chalk", { onclick: uret }, T.icon("dice"), "Yeni tepsi"),
          h("button.btn.c-sky", { onclick: () => gorselAra((url, kunye, yedek) => { foto = { url, kunye, yedek }; fotoCevap = ""; ciz(); }) }, T.icon("search"), "Görsel ara")),
        not("Tahminin nedenleri"));
    };
    kap.append(h("div.ms-duzen", sahne, bilgi)); uret();
  }

  /* ---------- 5. Sayı dizgisi ---------- */
  const DIZGI = { 1: [["5 + 5", "5 + 6", "5 + 4", "6 + 6", "6 + 7"], ["10 + 3", "10 + 8", "9 + 3", "9 + 8"], ["8 + 2", "8 + 3", "8 + 5", "18 + 5"]], 2: [["10 + 7", "20 + 7", "27 + 10", "27 + 9", "37 + 9"], ["20 − 5", "30 − 5", "32 − 5", "42 − 6"], ["50 + 50", "50 + 49", "48 + 49", "48 + 52"]], 3: [["4 × 5", "4 × 10", "4 × 20", "4 × 19", "4 × 21"], ["2 × 8", "4 × 8", "8 × 8", "8 × 7"], ["100 − 1", "100 − 9", "200 − 9", "201 − 9"]], 4: [["25 × 4", "25 × 8", "25 × 12", "50 × 12", "49 × 12"], ["60 ÷ 3", "120 ÷ 3", "123 ÷ 3", "1230 ÷ 3"], ["10 × 34", "9 × 34", "11 × 34", "20 × 34"]] };
  const hesap = (t) => { const k = t.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/,/g, "."); if (!/^[\d\s+\-*/.()]+$/.test(k)) return null; try { return Function("return (" + k + ")")(); } catch (e) { return null; } };
  function dizgi(kap) {
    const g = Math.max(1, Math.min(4, T.store.grade())); let L = DIZGI[g], i = 0, adim = 1, acik = {}, kendi = null;
    const ic = h("div");
    const ciz = () => {
      const d = kendi || L[i];
      ic.replaceChildren(
        h("p.ms-soru", "Her işlemi zihinden yap. Bir öncekinden nasıl yararlandın?"),
        h("div.ms-dizgi", d.slice(0, adim).map((t, j) => h("button.ms-dz" + (j === adim - 1 ? ".son" : ""), { onclick: () => { acik[j] = !acik[j]; ciz(); } }, h("span", t + " ="), h("b", acik[j] ? fmt(hesap(t)) : "?")))),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap" } },
          adim < d.length ? h("button.btn.c-sun", { onclick: () => { adim++; ciz(); } }, T.icon("next"), "Sonraki işlem") : h("span.hint", "Dizgi bitti. Hangi işlemler birbirine yardım etti?"),
          h("button.btn.c-chalk", { onclick: () => { kendi = null; i = (i + 1) % L.length; adim = 1; acik = {}; ciz(); } }, T.icon("dice"), "Başka dizgi"),
          h("details.ms-kendi", h("summary", "Kendi dizgini yaz"), h("div.ms-kendi-ic", h("textarea.in", { rows: 4, placeholder: "Her satıra bir işlem. Örnek:\n6 + 4\n16 + 4\n16 + 5", "aria-label": "Kendi dizgin", onchange: (e) => { const s2 = e.target.value.split("\n").map((x) => x.trim().replace(/[x*]/g, "×").replace(/\//g, "÷").replace(/-/g, "−")).filter((x) => x && hesap(x) != null); if (s2.length) { kendi = s2; adim = 1; acik = {}; ciz(); } else T.toast("İşlemleri satır satır yazın"); } })))),
        not("Kullanılan yollar"));
    };
    kap.append(ic); ciz();
  }

  /* ---------- 6. Eksik parça ---------- */
  function eksik(kap) {
    let butun = T.store.grade() <= 1 ? 10 : 20, gizli = 0, acik = false;
    const sahne = h("div.ms-sahne"), bilgi = h("div.ms-bilgi");
    const uret = () => { gizli = T.rand(1, butun - 1); acik = false; ciz(); };
    const ciz = () => {
      const s = svgKap(); s.append(S("rect", { width: 1000, height: 560, rx: 24, fill: "url(#m3-kagit)" }));
      const cerceve = butun === 5 ? 1 : butun === 10 ? 1 : 2, sat = butun === 5 ? 1 : 2, cw = cerceve === 2 ? 104 : 120, ox = 500 - (5 * cw) / 2;
      const gorunen = butun - gizli; let k = 0;
      for (let f = 0; f < cerceve; f++) { const oy = cerceve === 1 ? (sat === 1 ? 220 : 160) : 34 + f * 262;
        s.append(S("rect", { x: ox - 14, y: oy - 14, width: 5 * cw + 28, height: sat * cw + 28, rx: 14, fill: "url(#m3-ahsap)", filter: "url(#m3-golge)" }));
        for (let r = 0; r < sat; r++) for (let c = 0; c < 5; c++) { s.append(S("rect", { x: ox + c * cw + 5, y: oy + r * cw + 5, width: cw - 10, height: cw - 10, rx: 8, fill: "#F7EFDF" })); s.append(pul(ox + c * cw + cw / 2, oy + r * cw + cw / 2, cw * 0.35, k < gorunen ? "#E2412F" : "#1F7AE0")); k++; } }
      /* örtü: sondaki pulların üstünü kapatır */
      if (!acik) { let kk = 0; for (let f = 0; f < cerceve; f++) { const oy = cerceve === 1 ? (sat === 1 ? 220 : 160) : 34 + f * 262; for (let r = 0; r < sat; r++) for (let c = 0; c < 5; c++) { if (kk >= gorunen) s.append(S("rect", { x: ox + c * cw - 2, y: oy + r * cw - 2, width: cw + 4, height: cw + 4, fill: "url(#ms-ortu)" })); kk++; } } }
      const desen = S("pattern", { id: "ms-ortu", width: 24, height: 24, patternUnits: "userSpaceOnUse" }); desen.append(S("rect", { width: 24, height: 24, fill: "#3E6A8A" }), S("path", { d: "M0 12H24M12 0V24", stroke: "#5B88A8", "stroke-width": 6 }), S("path", { d: "M0 12H24M12 0V24", stroke: "#2F5572", "stroke-width": 1.5 }));
      s.prepend(S("defs", {}, desen)); sahne.replaceChildren(s);
      bilgi.replaceChildren(
        h("p.ms-soru", "Bütün " + butun + ". Örtünün altında kaç tane var? Nasıl buldun?"),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap" } },
          h("div.seg", [5, 10, 20].map((b) => h("button", { "aria-pressed": String(b === butun), onclick: () => { butun = b; uret(); } }, "Bütün " + b))),
          h("button.btn.c-leaf", { onclick: () => { acik = !acik; ciz(); } }, T.icon("eye"), acik ? "Örtüyü kapat" : "Örtüyü kaldır"),
          acik ? h("span.ms-esit", (butun - gizli) + " + " + gizli + " = " + butun) : null,
          h("button.btn.c-chalk", { onclick: uret }, T.icon("dice"), "Yeni")),
        not("Öğrencilerin yolları"));
    };
    kap.append(h("div.ms-duzen", sahne, bilgi)); uret();
  }

  /* ---------- 3. Ne fark ettin, ne merak ediyorsun: eski araç + görsel arama ---------- */
  function fark(kap) {
    const ic = h("div"); kap.append(h("div.row", { style: { justifyContent: "flex-end", marginBottom: "6px" } }, h("button.btn.c-sky", { onclick: () => gorselAra((url, kunye) => ic._fotoKoy && ic._fotoKoy(url, kunye)) }, T.icon("search"), "Görsel ara")), ic);
    if (eski) eski(ic);
  }

  const BOLUM = [["kac", "Kaç tane görüyorsun", kacTane], ["farkli", "Hangisi farklı", hangisi], ["fark", "Ne fark ettin, ne merak ediyorsun", fark], ["tahmin", "Tahmin et", tahmin], ["dizgi", "Sayı dizgisi", dizgi], ["eksik", "Eksik parça", eksik]];
  T.tools["matematik-konusmasi"] = Object.assign({}, T.tools["matematik-konusmasi"] || {}, {
    cat: "his", title: "Matematik sohbetleri", icon: "talk", tone: "sky", grades: [1, 8], short: "Kaç tane, hangisi farklı, ne fark ettin, tahmin, dizgi, eksik parça",
    render(host) {
      let b = "kac"; const govde = h("div.ms-govde"), seg = h("div.seg.ms-seg");
      const ac = (k) => { b = k; seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.k === k))); govde.replaceChildren(); BOLUM.find((x) => x[0] === k)[2](govde); };
      seg.append(...BOLUM.map(([k, l]) => h("button", { "data-k": k, "aria-pressed": String(k === b), onclick: () => ac(k) }, l)));
      host.append(seg, govde); ac(b);
    },
  });
})();
