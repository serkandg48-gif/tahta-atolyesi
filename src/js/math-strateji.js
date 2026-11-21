/* Zihinden işlem stratejileri: beş oyun, Matematik > Oyunlar sekmesinin en başında.
   Ortak fikir: sayıyı parçala, ilişkiyi gör, aynı sonuca farklı yollarla var. */
(function () {
  const { h } = T;
  const S = T.svg;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const ok = () => T.sound && T.sound.ok && T.sound.ok();
  const no = () => T.sound && T.sound.no && T.sound.no();
  const kutla = () => T.konfeti && T.konfeti();
  const seg = (secenek, deger, sec) => h("div.seg", secenek.map(([v, l]) => h("button", { "aria-pressed": String(v === deger), onclick: () => sec(v) }, l)));
  /* Tahtaya uygun sayı tuş takımı */
  function sayiPad(onay, ops = {}) {
    let deger = "";
    const ekran = h("div.mz-pad-ekran", ops.yer || "?");
    const yaz = () => (ekran.textContent = deger || ops.yer || "?");
    const tus = (t, fn, cls = "") => h("button.mz-tus" + cls, { onclick: fn }, t);
    const kap = h("div.mz-pad", ekran, h("div.mz-tuslar",
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => tus(n, () => { if (deger.length < 6) { deger += n; yaz(); } })),
      ops.kesir ? tus("/", () => { if (deger && !deger.includes("/")) { deger += "/"; yaz(); } }) : tus("⌫", () => { deger = deger.slice(0, -1); yaz(); }, ".sil"),
      tus(0, () => { if (deger.length < 6) { deger += "0"; yaz(); } }),
      tus("✓", () => { if (deger) { onay(deger); deger = ""; yaz(); } }, ".tamam")),
      ops.kesir ? tus("⌫ Sil", () => { deger = deger.slice(0, -1); yaz(); }, ".sil.genis") : null);
    return kap;
  }
  const EK = { 2: "şer", 3: "er", 4: "er", 5: "er", 6: "şar", 7: "şer", 8: "er", 9: "ar" };
  const oyun = (id, sira, def) => (T.tools[id] = Object.assign({ cat: "oyun", ilk: sira, tone: "sun" }, def));

  /* ================= 1. Sayı doğrusu stratejileri ================= */
  oyun("strateji-sayi-dogrusu", 1, {
    title: "Sayı doğrusu stratejileri", icon: "line", grades: [1, 3], short: "Aynı işleme farklı zıplamalarla var",
    render(host) {
      let tur = "top", aralik = 100, a, b, hedef, konum, yol, yollar;
      const kap = h("div.mz-oyun"); host.append(kap);
      function yeni() {
        if (aralik === 20) { a = rnd(3, 12); b = rnd(3, 20 - a); } else { a = rnd(12, 58); b = rnd(13, 39); if (a % 10 === 0) a++; }
        if (tur === "cik") { const t = a + b; a = t; hedef = t - b; } else hedef = a + b;
        konum = a; yol = []; yollar = []; ciz();
      }
      const isaret = () => (tur === "top" ? "+" : "−");
      function cizgi(yolu, buyuk) {
        const ulasilan = [a, ...yolu.reduce((l, j) => (l.push(l[l.length - 1] + j), l), [a]).slice(1)];
        const lo = Math.floor((Math.min(...ulasilan, hedef) - 2) / 10) * 10, hi = Math.ceil((Math.max(...ulasilan, hedef) + 2) / 10) * 10;
        const W = 1000, X = (v) => 40 + ((v - lo) / (hi - lo)) * (W - 80), Y = buyuk ? 170 : 70;
        const s = S("svg", { viewBox: `0 0 ${W} ${buyuk ? 250 : 110}`, class: "mz-dogru" + (buyuk ? "" : " kucuk") });
        s.append(S("line", { x1: 20, y1: Y, x2: W - 20, y2: Y, stroke: "#1B2A4A", "stroke-width": 3 }));
        s.append(S("path", { d: `M${W - 20} ${Y} l-14 -8 v16z M20 ${Y} l14 -8 v16z`, fill: "#1B2A4A" }));
        for (let v = lo; v <= hi; v++) { const on = v % 10 === 0, bes = v % 5 === 0; s.append(S("line", { x1: X(v), y1: Y - (on ? 12 : bes ? 8 : 5), x2: X(v), y2: Y + (on ? 12 : bes ? 8 : 5), stroke: "#1B2A4A", "stroke-width": on ? 2.5 : 1.2 })); if (on && buyuk) { const t = S("text", { x: X(v), y: Y + 36, "text-anchor": "middle", class: "mz-on" }); t.textContent = v; s.append(t); } }
        let p = a;
        yolu.forEach((j, i) => {
          const q = p + j, x1 = X(p), x2 = X(q), yuk = Math.min(buyuk ? 120 : 50, 18 + Math.abs(x2 - x1) * 0.45), renk = j > 0 ? "#2E7DD1" : "#D1495B";
          s.append(S("path", { d: `M${x1} ${Y} Q${(x1 + x2) / 2} ${Y - yuk * 2} ${x2} ${Y}`, fill: "none", stroke: renk, "stroke-width": buyuk ? 4 : 3, class: buyuk && i === yolu.length - 1 ? "mz-yay yeni" : "mz-yay" }));
          const t = S("text", { x: (x1 + x2) / 2, y: Y - yuk - 8, "text-anchor": "middle", class: "mz-zip", fill: renk }); t.textContent = (j > 0 ? "+" : "−") + Math.abs(j); s.append(t);
          if (buyuk) { const tt = S("text", { x: x2, y: Y + 60, "text-anchor": "middle", class: "mz-ara" }); tt.textContent = q; s.append(tt); }
          p = q;
        });
        const nok = (v, cls, etiket) => { s.append(S("circle", { cx: X(v), cy: Y, r: buyuk ? 11 : 7, class: cls })); if (etiket && buyuk) { const t = S("text", { x: X(v), y: Y + 60, "text-anchor": "middle", class: "mz-ara kalin" }); t.textContent = v; s.append(t); } };
        if (!buyuk || konum === hedef) nok(hedef, "mz-hedef", true); nok(a, "mz-bas", true); if (buyuk) nok(konum, "mz-konum");
        return s;
      }
      function ciz() {
        const bitti = konum === hedef && yol.length;
        const zip = (aranan) => [1, 2, 5, 10, 20, 30].map((n) => h("button.mz-zipla", { onclick: () => { if (bitti) return; yol.push(aranan * n); konum += aranan * n; if (konum === hedef) { ok(); const k = yol.join(","); if (!yollar.some((y) => y.join(",") === k)) { yollar.push(yol.slice()); if (yollar.length === 3) kutla(); } } ciz(); } }, (aranan > 0 ? "+" : "−") + n));
        kap.replaceChildren(
          h("div.mz-ust", seg([["top", "Toplama"], ["cik", "Çıkarma"]], tur, (v) => { tur = v; yeni(); }), seg([[20, "20'ye kadar"], [100, "100'e kadar"]], aralik, (v) => { aralik = v; yeni(); }), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni işlem")),
          h("div.mz-soru", a + " " + isaret() + " " + b + " = ", h("b", bitti ? hedef : "?")),
          cizgi(yol, true),
          h("div.mz-durum" + (bitti ? ".iyi" : ""), bitti ? "Ulaştın! Bu bir yol. Şimdi başka bir yoldan dene." : (() => { const z = konum - a, ad = tur === "top" ? "ileri" : "geri", top = Math.abs(z); return a + " sayısından başladın. Toplam " + b + " " + ad + " zıplaman gerek. Şimdiye kadar " + (top ? (z > 0 ? "+" : "−") + top : "hiç") + " zıpladın" + (top ? ", şu an " + konum + " sayısındasın." : "."); })()),
          h("div.mz-zipsira", h("div", h("small", "İleri"), zip(1)), h("div", h("small", "Geri"), zip(-1))),
          h("div.row", { style: { justifyContent: "center" } },
            h("button.btn.c-chalk", { disabled: yol.length ? null : true, onclick: () => { konum -= yol.pop(); ciz(); } }, T.icon("back"), "Son zıplamayı sil"),
            h("button.btn" + (bitti ? ".c-leaf" : ".c-chalk"), { onclick: () => { konum = a; yol = []; ciz(); } }, T.icon("reset"), bitti ? "Başka bir yol" : "Baştan başla")),
          yollar.length ? h("div.mz-yollar", h("h3", "Bulduğumuz yollar (" + yollar.length + ")"), yollar.map((y, i) => h("div.mz-yol", h("b", (i + 1) + ". yol"), h("span", y.map((j) => (j > 0 ? "+" : "−") + Math.abs(j)).join(" ")), cizgi(y, false))),
            h("p.hint", "Hangi yol en kısa? Hangisi aklımızda tutması en kolay? Sen hangisini seçerdin?")) : null);
      }
      yeni();
    },
  });

  /* ================= 2. Sayı bağları ================= */
  const KESIR = { ekle: ([a, b], [c, d]) => { const n = a * d + c * b, m = b * d, g = (x, y) => (y ? g(y, x % y) : x), k = g(Math.abs(n), m) || 1; return [n / k, m / k]; }, oku: (t) => { const [a, b] = t.split("/").map(Number); return b ? [a, b] : [a, 1]; }, yaz: ([a, b]) => (b === 1 ? String(a) : a + "/" + b) };
  oyun("strateji-sayi-baglari", 2, {
    title: "Sayı bağları", icon: "dots", grades: [1, 4], short: "Parçala, eksik parçayı ya da bütünü bul",
    render(host) {
      let tur = T.store.grade() <= 2 ? "yirmi" : "yuz", mod = "karisik", buMod, hedef, parca, verilen, eksik, yollar, uyari = "", cozuldu = false;
      const kap = h("div.mz-oyun"); host.append(kap);
      const esit = (x, y) => x[0] * y[1] === y[0] * x[1];
      const toplamOf = (l) => l.reduce((t, p) => KESIR.ekle(t, p), [0, 1]);
      /* birim dönüşümü: 60 dk = 1 saat, 100 cm = 1 m; etiket otomatik */
      const satirlar = ([n, d]) => {
        if (tur === "kesir") return null;
        if (tur === "dakika") { const sa = Math.floor(n / 60), dk = n % 60; return [sa ? sa + " saat" : null, dk || !sa ? dk + " dk" : null].filter(Boolean); }
        if (tur === "metre") { const m = Math.floor(n / 100), cm = n % 100; return [m ? m + " m" : null, cm || !m ? cm + " cm" : null].filter(Boolean); }
        return [String(n)];
      };
      const metin = (p) => (tur === "kesir" ? KESIR.yaz(p) : satirlar(p).join(" "));
      /* soru üret: parçaları önce seç, bütün onların toplamı */
      function parcalarUret() {
        if (tur === "yirmi") { const w = rnd(5, 20), x = rnd(1, w - 1); return [[x, 1], [w - x, 1]]; }
        if (tur === "yuz") { const w = rnd(14, 99), x = rnd(2, w - 2); return [[x, 1], [w - x, 1]]; }
        if (tur === "bin") { const w = rnd(12, 99) * 10, x = rnd(1, w / 10 - 1) * 10 + T.pick([0, 0, 5]); return [[x, 1], [w - x, 1]].filter((p) => p[0] > 0); }
        if (tur === "dakika") return T.pick([[60, 15], [60, 30], [60, 60], [45, 60], [60, 60, 15], [90, 30], [60, 25], [120, 15], [60, 60, 30], [40, 60]]).map((x) => [x, 1]);
        if (tur === "metre") return T.pick([[150, 100], [100, 75], [100, 100, 50], [120, 80], [200, 35], [100, 60], [250, 100], [100, 100, 20]]).map((x) => [x, 1]);
        const d = T.pick([2, 3, 4, 5, 6, 8]), x = rnd(1, d - 1), y = rnd(1, d); return [[x, d], [y, d]];
      }
      function yeni() {
        buMod = mod === "karisik" ? T.pick(["parcala", "eksik", "butun"]) : mod;
        verilen = parcalarUret(); hedef = toplamOf(verilen); if (verilen.length < 2) return yeni();
        eksik = buMod === "eksik" ? rnd(0, verilen.length - 1) : -1;
        parca = []; yollar = []; uyari = ""; cozuldu = false; ciz();
      }
      function cevap(t) {
        const p = tur === "kesir" ? KESIR.oku(t) : [+t, 1]; if (!p[0] || !p[1]) return;
        if (buMod !== "parcala") {
          const dogru = buMod === "butun" ? hedef : verilen[eksik];
          if (esit(p, dogru)) { cozuldu = true; uyari = ""; ok(); kutla(); } else { uyari = metin(p) + " olmadı. Parçalarla bütüne yeniden bak."; no(); }
          return ciz();
        }
        const yeniT = KESIR.ekle(toplamOf(parca), p);
        if (yeniT[0] * hedef[1] > hedef[0] * yeniT[1]) { uyari = "Bu parça ile toplam " + metin(hedef) + " değerini geçiyor. Daha küçük bir parça dene."; no(); return ciz(); }
        parca.push(p); uyari = "";
        if (esit(yeniT, hedef)) { ok(); const k = parca.map(KESIR.yaz).sort().join("+"); if (parca.length < 2) uyari = "En az iki parçaya ayıralım."; else if (yollar.includes(k)) uyari = "Bu yolu zaten bulmuştuk. Başka türlü parçala."; else { yollar.push(k); if (yollar.length === 2) kutla(); } }
        ciz();
      }
      function dugum(sv, x, y, p, cls) {
        if (p && tur === "kesir" && p[1] !== 1) {
          sv.append(S("ellipse", { cx: x, cy: y, rx: 46, ry: 50, class: cls }));
          const u = S("text", { x, y: y - 10, "text-anchor": "middle", class: "mz-bag-t" }); u.textContent = p[0];
          const a2 = S("text", { x, y: y + 34, "text-anchor": "middle", class: "mz-bag-t" }); a2.textContent = p[1];
          sv.append(u, S("line", { x1: x - 22, y1: y, x2: x + 22, y2: y, stroke: "#1B2A4A", "stroke-width": 4, "stroke-linecap": "round" }), a2); return;
        }
        const L = p ? satirlar(p) || [KESIR.yaz(p)] : ["?"], uz = Math.max(...L.map((l) => l.length));
        sv.append(S("ellipse", { cx: x, cy: y, rx: Math.max(46, uz * 10 + 22), ry: L.length > 1 ? 52 : 46, class: cls }));
        L.forEach((l, i) => { const t = S("text", { x, y: y + 11 + (i - (L.length - 1) / 2) * 32, "text-anchor": "middle", class: "mz-bag-t" + (L.length > 1 ? " iki" : "") }); t.textContent = l; sv.append(t); });
      }
      /* Boncuk sahnesi: Ponpon boncuk dizisini iki elinde tutar; parçalar ayrı renkte, altta bağ baloncukları */
      function boncukSahne(altlar) {
        const W = 800, H = 430, sv = S("svg", { viewBox: `0 0 ${W} ${H}`, class: "bn-svg", role: "img", "aria-label": "Boncuk dizisiyle sayı bağı" });
        sv.innerHTML = T.PONPON_DEFS + '<rect width="800" height="430" fill="url(#bn-duvar)"/><rect x="0" y="300" width="800" height="130" fill="url(#bn-masa)"/><rect x="0" y="296" width="800" height="8" fill="#b97a48"/>'
          + '<g opacity=".55"><rect x="560" y="34" width="170" height="120" rx="14" fill="#cfeaff" stroke="#e8c79a" stroke-width="8"/><path d="M645 34v120M560 94h170" stroke="#e8c79a" stroke-width="6"/><circle cx="700" cy="62" r="14" fill="#fff6b5"/></g>'
          + '<g opacity=".5"><rect x="64" y="60" width="96" height="70" rx="8" fill="#fff" stroke="#e8c79a" stroke-width="6"/><path d="M80 112l22-26 18 18 12-12 18 20" stroke="#8cc28c" stroke-width="5" fill="none" stroke-linecap="round"/></g>';
        const pp = T.ponpon(400, 196, { kollar: [[120, 228], [680, 228]] }); sv.append(pp.govde);
        /* ip: iki el arasında sarkan eğri */
        const yol = (t) => { const x = 120 + t * 560, y = 228 + Math.sin(Math.PI * t) * 46; return [x, y]; };
        sv.append(S("path", { d: "M120 228 Q400 320 680 228", fill: "none", stroke: "#7a5232", "stroke-width": 4, "stroke-linecap": "round" }));
        /* boncuklar: 20 içinde her biri tek; 100 içinde büyük boncuk = 10 */
        const boncuk = [];
        const renkOf = (i) => ["a", "b", "c", "d", "e"][i % 5];
        const gizliParca = buMod === "eksik" && !cozuldu ? eksik : -1;
        if (buMod === "parcala") {
          let kalan = hedef[0]; parca.forEach((p, i) => { boncuklaraBol(p[0]).forEach((b) => boncuk.push([b, renkOf(i)])); kalan -= p[0]; });
          if (kalan > 0) boncuklaraBol(kalan).forEach((b) => boncuk.push([b, "bos"]));
        } else altlar.forEach((p, i) => boncuklaraBol(p[0]).forEach((b) => boncuk.push([b, i === gizliParca ? "gizli" : renkOf(i)])));
        const top = boncuk.reduce((t, [b]) => t + (b === 10 ? 1.7 : 1), 0); let k = 0;
        boncuk.forEach(([b, r]) => { const genis = b === 10 ? 1.7 : 1; const t = 0.08 + (k + genis / 2) / top * 0.84; k += genis; const [x, y] = yol(t);
          const g = S("g", { class: "bn-b " + r, transform: `translate(${x} ${y})` });
          if (b === 10) { g.append(S("rect", { x: -22, y: -17, width: 44, height: 34, rx: 17 })); const tx = S("text", { y: 7, "text-anchor": "middle", class: "bn-on" }); tx.textContent = "10"; g.append(tx); }
          else g.append(S("circle", { r: top > 22 ? 13 : 17 }));
          g.append(S("ellipse", { cx: -5, cy: -7, rx: 5, ry: 3.5, class: "bn-parla" })); sv.append(g); });
        sv.append(pp.eller);
        /* sayı bağı baloncukları */
        const kx = 400, ustBil = buMod !== "butun" || cozuldu, n = Math.max(2, altlar.length);
        const balon = (x, y, p, cls, kucuk) => { const g = S("g", { class: "bn-balon " + cls, transform: `translate(${x} ${y})` }); g.append(S("rect", { x: kucuk ? -58 : -70, y: -32, width: kucuk ? 116 : 140, height: 64, rx: 32 }));
          const t = S("text", { y: 12, "text-anchor": "middle" }); t.textContent = p ? metin(p) : "?"; g.append(t); sv.append(g); };
        const px = (i) => (n === 2 ? [170, 630][i] : 120 + i * (560 / (n - 1)));
        for (let i = 0; i < n; i++) sv.append(S("line", { x1: kx, y1: 368, x2: px(i), y2: 392, class: "bn-cizgi" }));
        balon(kx, 362, ustBil ? hedef : null, ustBil ? "butun" : "soru");
        for (let i = 0; i < n; i++) { let p = altlar[i]; const gz = buMod === "eksik" && i === eksik && !cozuldu; balon(px(i), 392, gz ? null : p, (gz || (!p && buMod !== "parcala")) ? "soru" : p ? "parca " + renkOf(i) : "bos", true); }
        return sv;
      }
      const boncuklaraBol = (v) => (tur === "yuz" ? [...Array(Math.floor(v / 10)).fill(10), ...Array(v % 10).fill(1)] : Array(v).fill(1));
      function ciz() {
        const altlar = buMod === "parcala" ? parca : verilen, n = Math.max(2, altlar.length), W = 760, sv = ["yirmi", "yuz"].includes(tur) ? null : S("svg", { viewBox: `0 0 ${W} 290`, class: "mz-bag" });
        if (sv) {
        const kx = W / 2, kutuX = (i) => 80 + (i + 0.5) * ((W - 160) / n), ustBil = buMod !== "butun" || cozuldu;
        for (let i = 0; i < n; i++) sv.append(S("line", { x1: kx, y1: 100, x2: kutuX(i), y2: 192, stroke: "#1B2A4A", "stroke-width": 3, opacity: buMod === "parcala" && !parca[i] ? 0.25 : 1 }));
        dugum(sv, kx, 60, ustBil ? hedef : null, ustBil ? "mz-bag-ust" : "mz-bag-soru");
        for (let i = 0; i < n; i++) {
          let p = altlar[i]; const gizli = buMod === "eksik" && i === eksik && !cozuldu;
          if (gizli) p = null;
          dugum(sv, kutuX(i), 232, p, p ? "mz-bag-alt" : buMod === "parcala" ? "mz-bag-bos" : "mz-bag-soru");
        }
        }
        const t = toplamOf(parca), parcTamam = buMod === "parcala" && esit(t, hedef) && parca.length > 1;
        const BIRIM = { dakika: "Dakika olarak yaz. 60 dakika = 1 saat.", metre: "Santimetre olarak yaz. 100 cm = 1 m.", kesir: "Kesir için / tuşunu kullan. Örnek: 3/4" }[tur] || "";
        let durum;
        if (buMod === "parcala") durum = parcTamam && !uyari ? "Oldu! " + metin(hedef) + " = " + parca.map(metin).join(" + ") : uyari || "Bütünü parçalara ayır. " + (parca.length ? "Şu ana kadar: " + metin(t) + ". " : "") + BIRIM;
        else if (cozuldu) durum = metin(hedef) + " = " + verilen.map(metin).join(" + ");
        else durum = uyari || (buMod === "butun" ? "Parçalar verildi. Bütün kaç? " : "Bütün ve bir parça verildi. Eksik parça kaç? ") + BIRIM;
        kap.replaceChildren(
          h("div.mz-ust", seg([["yirmi", "20 içinde"], ["yuz", "100 içinde"], ["bin", "1000 içinde"], ["dakika", "Saat ve dakika"], ["metre", "Metre ve santimetre"], ["kesir", "Kesirler"]], tur, (v) => { tur = v; yeni(); }),
            seg([["karisik", "Karışık"], ["parcala", "Parçala"], ["eksik", "Eksik parça"], ["butun", "Bütünü bul"]], mod, (v) => { mod = v; yeni(); }), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni soru")),
          h("div.mz-yan", h("div", sv || boncukSahne(altlar),
            h("div.mz-durum" + ((parcTamam && !uyari) || cozuldu ? ".iyi" : uyari ? ".kotu" : ""), durum),
            buMod === "parcala" ? h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { disabled: parca.length ? null : true, onclick: () => { parca.pop(); uyari = ""; ciz(); } }, T.icon("back"), "Son parçayı sil"), h("button.btn" + (parcTamam ? ".c-leaf" : ".c-chalk"), { onclick: () => { parca = []; uyari = ""; ciz(); } }, T.icon("reset"), parcTamam ? "Başka türlü parçala" : "Temizle")) : cozuldu ? h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-leaf", { onclick: yeni }, T.icon("next"), "Sıradaki")) : null,
            buMod === "parcala" && yollar.length ? h("div.mz-yollar", h("h3", "Bulduğumuz yollar (" + yollar.length + " / 2)"), yollar.map((y, i) => h("div.mz-yol", h("b", (i + 1) + ". yol"), h("span", metin(hedef) + " = " + y.split("+").map((x) => metin(KESIR.oku(x))).join(" + "))))) : null),
            cozuldu ? null : h("div.mz-padkap", h("small", buMod === "parcala" ? "Bir parça yaz" : buMod === "butun" ? "Bütünü yaz" : "Eksik parçayı yaz"), sayiPad(cevap, { kesir: tur === "kesir" }))));
      }
      yeni();
    },
  });

  /* ================= 3. Çarpma ve bölme ================= */
  oyun("strateji-carpma-bolme", 3, {
    title: "Çarpma ve bölme", icon: "fraction", grades: [3, 4], short: "Kolay parçalara ayırarak zihinden çarp ve böl",
    render(host) {
      let tur = "carp", a, b, parca, cevaplar, kalan, bolum, toplamOk = false, kesik = new Set();
      const kap = h("div.mz-oyun"); host.append(kap);
      function yeni() {
        if (tur === "carp") { a = T.pick([25, 12, 15, 14, 24, 35, 45, 18, 16, 21]); b = T.pick([16, 13, 14, 17, 12, 18, 23, 15]); parca = []; cevaplar = {}; toplamOk = false; kesik = new Set(); }
        else { b = T.pick([14, 16, 18, 26, 12, 15, 24, 32, 7, 13]); const q = T.pick([22, 31, 21, 14, 32, 42, 101, 23, 213, 12]); a = b * q; kalan = a; bolum = []; }
        ciz();
      }
      function carpCiz() {
        const top = parca.reduce((s, x) => s + x, 0), tamam = top === b;
        const hepsi = tamam && parca.every((x, i) => cevaplar[i] === a * x);
        /* birim kareler: a satır × b sütun; satır çoksa kareler biraz basık çizilir ki sütunlar kesilebilecek genişlikte kalsın */
        const W = 760, u = Math.min((W - 90) / b, 48), uy = Math.min(u, 280 / a), Hh = a * uy, s = S("svg", { viewBox: `0 0 ${60 + b * u + 20} ${Hh + 100}`, class: "mz-alan" });
        const renk = ["#5DADE8", "#F4A261", "#90BE6D", "#E76F51", "#8E7DBE"], y0 = 40;
        const izgara = (x0, sut, cizgi) => { let d = ""; for (let c = 1; c < sut; c++) d += `M${x0 + c * u} ${y0}V${y0 + Hh}`; for (let r = 1; r < a; r++) d += `M${x0} ${y0 + r * uy}H${x0 + sut * u}`; s.append(S("path", { d, stroke: cizgi, "stroke-width": u > 14 ? 1.2 : 0.7, fill: "none" })); };
        let x = 60;
        /* kesme aşaması: çocuk dikdörtgene dokunarak sütunların arasından keser */
        const kesiyor = !parca.length, kesL = [...kesik].sort((p1, p2) => p1 - p2), segler = kesiyor ? [...kesL, b].map((k, i, L) => k - (i ? L[i - 1] : 0)) : parca;
        segler.forEach((p, i) => {
          const w = p * u;
          s.append(S("rect", { x, y: y0, width: w, height: Hh, fill: renk[i % 5], opacity: 0.85 }));
          izgara(x, p, "rgba(255,255,255,.75)");
          s.append(S("rect", { x, y: y0, width: w, height: Hh, fill: "none", stroke: "#1B2A4A", "stroke-width": 3 }));
          (w < 140 ? [a, "×", p] : [a + " × " + p]).forEach((l, j, L) => { const t = S("text", { x: x + w / 2, y: y0 + Hh / 2 + 9 + (j - (L.length - 1) / 2) * 30, "text-anchor": "middle", class: "mz-alan-t golgeli" }); t.textContent = l; s.append(t); });
          const k = S("text", { x: x + w / 2, y: 28, "text-anchor": "middle", class: "mz-alan-k" }); k.textContent = p; s.append(k);
          x += w;
        });
        if (kesiyor) {
          kesL.forEach((k) => { const kx = 60 + k * u; s.append(S("line", { x1: kx, y1: y0 - 8, x2: kx, y2: y0 + Hh + 8, stroke: "#E4553F", "stroke-width": 5, "stroke-dasharray": "10 6", "stroke-linecap": "round" })); const m = S("text", { x: kx, y: y0 - 12, "text-anchor": "middle", "font-size": 22 }); m.textContent = "✂️"; s.append(m); });
          const ortu = S("rect", { x: 60, y: y0, width: b * u, height: Hh, fill: "transparent", style: "cursor: crosshair" });
          ortu.addEventListener("click", (e) => { const pt = s.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(s.getScreenCTM().inverse()); const k = Math.round((q.x - 60) / u); if (k <= 0 || k >= b) return; kesik.has(k) ? kesik.delete(k) : kesik.add(k); T.sound.pop && T.sound.pop(); ciz(); });
          s.append(ortu);
        }
        else if (top < b) { s.append(S("rect", { x, y: y0, width: (b - top) * u, height: Hh, fill: "#F4F6FA" })); izgara(x, b - top, "#D3DAE6"); s.append(S("rect", { x, y: y0, width: (b - top) * u, height: Hh, fill: "none", stroke: "#9AA4B5", "stroke-width": 2, "stroke-dasharray": "8 6" })); }
        const yan = S("text", { x: 18, y: y0 + Hh / 2 + 9, "text-anchor": "middle", class: "mz-alan-k" }); yan.textContent = a; s.append(yan);
        /* alt kenar: ikinci çarpanın tamamı, köşeli ayraçla */
        const yb = y0 + Hh + 14, xb = 60 + b * u;
        s.append(S("path", { d: `M60 ${yb} v10 H${xb} v-10`, fill: "none", stroke: "#1B2A4A", "stroke-width": 3 }));
        const alt = S("text", { x: (60 + xb) / 2, y: yb + 40, "text-anchor": "middle", class: "mz-alan-k" }); alt.textContent = b; s.append(alt);
        s.append(S("path", { d: `M44 ${y0} h-10 V${y0 + Hh} h10`, fill: "none", stroke: "#1B2A4A", "stroke-width": 3 }));
        return h("div",
          h("div.mz-soru", a + " × " + b + " = ", h("b", toplamOk ? a * b : "?")),
          h("div" + (tamam ? ".mz-yanyana" : ""), s, tamam ? h("div.mz-satirlar", parca.map((p, i) => h("div.mz-satir", h("span", a + " × " + p + " ="), cevaplar[i] === a * p ? h("b.dogru", a * p) : h("span.mz-girdi", sayiPadKucuk((v) => { if (+v === a * p) { cevaplar[i] = a * p; ok(); } else no(); ciz(); })))),
            hepsi ? h("div.mz-satir.toplam", h("span", parca.map((p) => a * p).join(" + ") + " ="), toplamOk ? h("b.dogru", a * b) : h("span.mz-girdi", sayiPadKucuk((v) => { if (+v === a * b) { toplamOk = true; ok(); kutla(); } else no(); ciz(); }))) : null,
            hepsi && !toplamOk ? h("div.mz-durum", "Şimdi parçaları topla.") : !hepsi ? h("div.mz-durum", "Her parçanın sonucunu yaz.") : null) : null),
          kesiyor && kesL.length ? h("div.mz-durum", b + " = " + segler.join(" + ")) : null,
          kesiyor ? h("div.row", { style: { justifyContent: "center", gap: "8px", flexWrap: "wrap" } },
            h("button.btn.c-leaf", { disabled: kesL.length ? null : true, onclick: () => { parca = segler.slice(); cevaplar = {}; toplamOk = false; ciz(); } }, T.icon("check"), "Bu parçalarla çarp"),
            b > 10 && !kesik.has(10) ? h("button.btn.c-chalk", { onclick: () => { kesik = new Set([10]); ciz(); } }, T.icon("spark"), "İpucu: 10'dan kes") : null) : null,
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => { parca = []; cevaplar = {}; toplamOk = false; kesik = new Set(); ciz(); } }, T.icon("reset"), toplamOk ? "Başka türlü parçala" : "Baştan")));
      }
      function bolCiz() {
        const q = bolum.reduce((s, x) => s + x, 0), tamam = kalan === 0;
        const kat = [100, 50, 20, 10, 5, 2, 1].filter((k) => b * k <= kalan).slice(0, 5);
        const W = 760, s = S("svg", { viewBox: `0 0 ${W} 90`, class: "mz-serit" });
        let x = 20; const bW = (W - 40) / a;
        bolum.forEach((k, i) => { const w = b * k * bW; s.append(S("rect", { x, y: 14, width: Math.max(2, w - 3), height: 60, rx: 6, fill: ["#5DADE8", "#F4A261", "#90BE6D", "#E76F51", "#8E7DBE"][i % 5] })); if (w > 50) { const t = S("text", { x: x + w / 2, y: 52, "text-anchor": "middle", class: "mz-alan-t kucuk" }); t.textContent = b * k; s.append(t); } x += w; });
        if (kalan) { s.append(S("rect", { x, y: 14, width: kalan * bW - 3, height: 60, rx: 6, fill: "#EEF1F5", stroke: "#C7CFDB", "stroke-dasharray": "8 6" })); const t = S("text", { x: x + (kalan * bW) / 2, y: 52, "text-anchor": "middle", class: "mz-alan-t kucuk koyu" }); t.textContent = kalan; s.append(t); }
        return h("div",
          h("div.mz-soru", a + " : " + b + " = ", h("b", tamam ? q : "?")),
          s,
          h("div.mz-durum" + (tamam ? ".iyi" : ""), tamam ? "Bitti! " + bolum.join(" + ") + " = " + q : "Kalan " + kalan + ". " + b + "'nın hangi katını çıkarabilirsin?"),
          !tamam ? h("div.mz-secimler", kat.map((k) => h("button.mz-kat", { onclick: () => { kalan -= b * k; bolum.push(k); if (!kalan) { ok(); kutla(); } ciz(); } }, h("b", b * k), h("small", b + " × " + k)))) : null,
          bolum.length ? h("div.mz-agac", h("div.mz-agac-ust", a + " : " + b), h("div.mz-agac-alt", bolum.map((k) => h("div.mz-agac-dal", h("span", b * k), h("i", "↓"), h("b", k)))), tamam ? h("div.mz-agac-son", bolum.join(" + ") + " = " + q) : null) : null,
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { disabled: bolum.length ? null : true, onclick: () => { kalan += b * bolum.pop(); ciz(); } }, T.icon("back"), "Son parçayı geri al"), h("button.btn.c-chalk", { onclick: () => { kalan = a; bolum = []; ciz(); } }, T.icon("reset"), tamam ? "Başka türlü parçala" : "Baştan")));
      }
      /* Adım adım yönerge: çocuk hangi adımda olduğunu görür */
      function yonerge() {
        /* kısa yönerge: yalnızca şu anki adım */
        let metin, no;
        if (tur === "carp") {
          const top = parca.reduce((t, x) => t + x, 0), tamam = top === b, hepsi = tamam && parca.every((x, i) => cevaplar[i] === a * x);
          no = !tamam ? 1 : !hepsi ? 2 : !toplamOk ? 3 : 0;
          metin = ["Bitti! Başka türlü parçalayıp yeniden dene.", "Dikdörtgeni kolay parçalara kes.", "Her parçayı ayrı çarp.", "Sonuçları topla."][no];
        } else {
          no = !bolum.length ? 1 : kalan !== 0 ? 2 : 0;
          metin = ["Bitti! Kartların alttaki sayılarını topla.", "Bir kart seç, " + a + " sayısından çıkar.", "Kalan sıfır olana kadar devam et."][no];
        }
        return h("div.mz-yonerge.kisa", no ? h("span.mz-adim-no", no) : h("span.mz-adim-no.bitti", "✓"), h("b", metin));
      }
      function ciz() {
        kap.replaceChildren(h("div.mz-ust", seg([["carp", "Çarpma"], ["bol", "Bölme"]], tur, (v) => { tur = v; yeni(); }), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni işlem")), yonerge(), tur === "carp" ? carpCiz() : bolCiz());
      }
      yeni();
    },
  });
  /* bir sayıyı onluk ve beşlik gibi kolay parçalara ayırmanın birkaç yolu */
  function ayirmalar(b) {
    const L = [], ekle = (x) => { x = x.filter((v) => v > 0); if (x.length > 1 && x.reduce((t, v) => t + v, 0) === b && !L.some((y) => y.join() === x.join())) L.push(x); };
    const on = Math.floor(b / 10) * 10, bir = b - on;
    ekle([on, bir]);
    if (on >= 20) ekle([...Array(on / 10).fill(10), bir]);
    if (bir > 5) ekle([on, 5, bir - 5]);
    if (bir >= 2 && bir < 5) ekle([on, 2, bir - 2].filter(Boolean));
    if (on >= 10) ekle([on - 10, 10, bir].filter(Boolean).length > 2 ? [on - 10, 10, bir] : []);
    ekle([10, b - 10]);
    if (b > 10 && b < 20) ekle([5, 5, b - 10]);
    return L.slice(0, 3);
  }
  function sayiPadKucuk(onay) {
    const inp = h("input.in.mz-kucuk-girdi", { inputmode: "numeric", placeholder: "?", onkeydown: (e) => { if (e.key === "Enter" && inp.value) onay(inp.value.trim()); } });
    return h("span.mz-girdi-kap", inp, h("button.btn.sm.c-leaf", { onclick: () => inp.value && onay(inp.value.trim()) }, T.icon("check")));
  }

})();
