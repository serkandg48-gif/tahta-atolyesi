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
        nok(hedef, "mz-hedef", true); nok(a, "mz-bas", true); if (buyuk) nok(konum, "mz-konum");
        return s;
      }
      function ciz() {
        const bitti = konum === hedef && yol.length;
        const zip = (aranan) => [1, 2, 5, 10, 20, 30].map((n) => h("button.mz-zipla", { onclick: () => { if (bitti) return; yol.push(aranan * n); konum += aranan * n; if (konum === hedef) { ok(); const k = yol.join(","); if (!yollar.some((y) => y.join(",") === k)) { yollar.push(yol.slice()); if (yollar.length === 3) kutla(); } } ciz(); } }, (aranan > 0 ? "+" : "−") + n));
        kap.replaceChildren(
          h("div.mz-ust", seg([["top", "Toplama"], ["cik", "Çıkarma"]], tur, (v) => { tur = v; yeni(); }), seg([[20, "20'ye kadar"], [100, "100'e kadar"]], aralik, (v) => { aralik = v; yeni(); }), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni işlem")),
          h("div.mz-soru", a + " " + isaret() + " " + b + " = ", h("b", bitti ? hedef : "?")),
          cizgi(yol, true),
          h("div.mz-durum" + (bitti ? ".iyi" : ""), bitti ? "Ulaştın! Bu bir yol. Şimdi başka bir yoldan dene." : "Şu an " + konum + " sayısındasın. Hedef: " + hedef),
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
  const KESIR = { ekle: ([a, b], [c, d]) => { const n = a * d + c * b, m = b * d, g = (x, y) => (y ? g(y, x % y) : x), k = g(Math.abs(n), m); return [n / k, m / k]; }, oku: (t) => { const [a, b] = t.split("/").map(Number); return b ? [a, b] : [a, 1]; }, yaz: ([a, b]) => (b === 1 ? String(a) : a + "/" + b) };
  oyun("strateji-sayi-baglari", 2, {
    title: "Sayı bağları", icon: "dots", grades: [1, 4], short: "Sayıyı parçalara ayır, iki farklı yol bul",
    render(host) {
      let tur = "sayi", hedef, parca, yollar, uyari = "";
      const kap = h("div.mz-oyun"); host.append(kap);
      const birim = () => (tur === "dakika" ? " dk" : "");
      function yeni() {
        if (tur === "sayi") hedef = [rnd(13, 98), 1];
        else if (tur === "basamak") { const l = [1111, 2340, 1205, 3456, 999, 1010, 2222, 4508]; hedef = [T.pick(l), 1]; }
        else if (tur === "dakika") hedef = [T.pick([75, 90, 105, 120, 135, 150, 165, 80, 145]), 1];
        else { const l = [[5, 4], [7, 4], [3, 2], [5, 3], [7, 6], [4, 3], [9, 8], [5, 6]]; hedef = T.pick(l); }
        parca = []; yollar = []; uyari = ""; ciz();
      }
      const toplam = () => parca.reduce((s, p) => KESIR.ekle(s, p), [0, 1]);
      const esit = (x, y) => x[0] * y[1] === y[0] * x[1];
      function ekle(t) {
        const p = tur === "kesir" ? KESIR.oku(t) : [+t, 1];
        if (!p[0] || !p[1]) return;
        const yeniT = KESIR.ekle(toplam(), p);
        if (yeniT[0] * hedef[1] > hedef[0] * yeniT[1]) { uyari = "Bu parça ile toplam " + KESIR.yaz(hedef) + birim() + " sayısını geçiyor. Daha küçük bir parça dene."; no(); ciz(); return; }
        parca.push(p); uyari = "";
        if (esit(yeniT, hedef)) { ok(); const k = parca.map(KESIR.yaz).sort().join("+"); if (parca.length < 2) uyari = "Sayıyı en az iki parçaya ayıralım."; else if (yollar.includes(k)) uyari = "Bu yolu zaten bulmuştuk. Başka türlü parçala."; else { yollar.push(k); if (yollar.length === 2) kutla(); } }
        ciz();
      }
      function ciz() {
        const t = toplam(), tamam = esit(t, hedef) && parca.length > 1;
        const n = Math.max(2, parca.length), W = 760, ust = S("svg", { viewBox: `0 0 ${W} 260`, class: "mz-bag" });
        const kx = W / 2;
        const daire = (x, y, r, metin, cls) => { ust.append(S("ellipse", { cx: x, cy: y, rx: r + Math.max(0, metin.length - 3) * 9, ry: r, class: cls })); const tt = S("text", { x, y: y + 11, "text-anchor": "middle", class: "mz-bag-t" }); tt.textContent = metin; ust.append(tt); };
        const kutuX = (i) => 80 + (i + 0.5) * ((W - 160) / n);
        for (let i = 0; i < n; i++) ust.append(S("line", { x1: kx, y1: 92, x2: kutuX(i), y2: 182, stroke: "#1B2A4A", "stroke-width": 3, opacity: parca[i] ? 1 : 0.25 }));
        daire(kx, 60, 46, KESIR.yaz(hedef) + birim(), "mz-bag-ust");
        for (let i = 0; i < n; i++) daire(kutuX(i), 210, 36, parca[i] ? KESIR.yaz(parca[i]) + birim() : "?", parca[i] ? "mz-bag-alt" : "mz-bag-bos");
        const ipucu = { sayi: "Onluk ve birliklere ya da işine yarayan parçalara ayır.", basamak: "Basamaklara ya da kolay hesaplanan parçalara ayır.", dakika: "1 saat = 60 dakika. Saatleri ayırmayı dene.", kesir: "Kesir yazmak için / tuşunu kullan. Örnek: 1/4" }[tur];
        kap.replaceChildren(
          h("div.mz-ust", seg([["sayi", "Sayılar"], ["basamak", "Basamaklar"], ["dakika", "Dakikalar"], ["kesir", "Kesirler"]], tur, (v) => { tur = v; yeni(); }), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni sayı")),
          h("div.mz-yan", h("div", ust,
            h("div.mz-durum" + (tamam ? ".iyi" : uyari ? ".kotu" : ""), tamam && !uyari ? "Oldu! " + KESIR.yaz(hedef) + birim() + " = " + parca.map((p) => KESIR.yaz(p) + birim()).join(" + ") : uyari || ("Parçaların toplamı: " + KESIR.yaz(t) + birim() + ". " + ipucu)),
            h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { disabled: parca.length ? null : true, onclick: () => { parca.pop(); uyari = ""; ciz(); } }, T.icon("back"), "Son parçayı sil"), h("button.btn" + (tamam ? ".c-leaf" : ".c-chalk"), { onclick: () => { parca = []; uyari = ""; ciz(); } }, T.icon("reset"), tamam ? "Başka türlü parçala" : "Temizle")),
            yollar.length ? h("div.mz-yollar", h("h3", "Bulduğumuz yollar (" + yollar.length + " / 2)"), yollar.map((y, i) => h("div.mz-yol", h("b", (i + 1) + ". yol"), h("span", KESIR.yaz(hedef) + birim() + " = " + y.split("+").join(" + "))))) : null),
            h("div.mz-padkap", h("small", "Bir parça yaz"), sayiPad(ekle, { kesir: tur === "kesir" }))));
      }
      yeni();
    },
  });

  /* ================= 3. Çarpma ve bölme ================= */
  oyun("strateji-carpma-bolme", 3, {
    title: "Çarpma ve bölme", icon: "fraction", grades: [3, 4], short: "Kolay parçalara ayırarak zihinden çarp ve böl",
    render(host) {
      let tur = "carp", a, b, parca, cevaplar, kalan, bolum;
      const kap = h("div.mz-oyun"); host.append(kap);
      function yeni() {
        if (tur === "carp") { a = T.pick([25, 12, 15, 14, 24, 35, 45, 18, 16, 21]); b = T.pick([16, 13, 14, 17, 12, 18, 23, 15]); parca = []; cevaplar = {}; }
        else { b = T.pick([14, 16, 18, 26, 12, 15, 24, 32, 7, 13]); const q = T.pick([22, 31, 21, 14, 32, 42, 101, 23, 213, 12]); a = b * q; kalan = a; bolum = []; }
        ciz();
      }
      function carpCiz() {
        const top = parca.reduce((s, x) => s + x, 0), tamam = top === b;
        const hepsi = tamam && parca.every((x, i) => cevaplar[i] === a * x);
        const W = 760, s = S("svg", { viewBox: `0 0 ${W} 170`, class: "mz-alan" });
        const renk = ["#5DADE8", "#F4A261", "#90BE6D", "#E76F51", "#8E7DBE"];
        let x = 60; const birimW = (W - 90) / b;
        parca.forEach((p, i) => { const w = p * birimW; s.append(S("rect", { x, y: 40, width: w - 4, height: 110, rx: 8, fill: renk[i % 5], opacity: 0.85 })); const t = S("text", { x: x + w / 2, y: 105, "text-anchor": "middle", class: "mz-alan-t" }); t.textContent = a + " × " + p; s.append(t); const u = S("text", { x: x + w / 2, y: 28, "text-anchor": "middle", class: "mz-alan-k" }); u.textContent = p; s.append(u); x += w; });
        if (top < b) s.append(S("rect", { x, y: 40, width: (b - top) * birimW - 4, height: 110, rx: 8, fill: "#EEF1F5", stroke: "#C7CFDB", "stroke-dasharray": "8 6" }));
        const yan = S("text", { x: 30, y: 105, "text-anchor": "middle", class: "mz-alan-k" }); yan.textContent = a; s.append(yan);
        return h("div",
          h("div.mz-soru", a + " × " + b + " = ", h("b", hepsi ? a * b : "?")),
          s,
          !tamam ? h("div.mz-durum", parca.length ? "Kalan: " + (b - top) + ". " + b + " sayısını parçalamaya devam et." : b + " sayısını kolay parçalara ayır. Örnek: 10 ve " + (b - 10)) : null,
          !tamam ? h("div.mz-secimler", [10, 5, 2, 1, b - top].filter((x, i, l) => x > 0 && x <= b - top && l.indexOf(x) === i).map((x) => h("button.mz-zipla", { onclick: () => { parca.push(x); ciz(); } }, x === b - top && x !== 10 && x !== 5 && x !== 2 && x !== 1 ? "Kalanın hepsi (" + x + ")" : "+" + x))) : null,
          tamam ? h("div.mz-satirlar", parca.map((p, i) => h("div.mz-satir", h("span", a + " × " + p + " ="), cevaplar[i] === a * p ? h("b.dogru", a * p) : h("span.mz-girdi", sayiPadKucuk((v) => { if (+v === a * p) { cevaplar[i] = a * p; ok(); if (parca.every((x, j) => cevaplar[j] === a * x)) kutla(); } else no(); ciz(); })))),
            hepsi ? h("div.mz-satir.toplam", h("span", parca.map((p) => a * p).join(" + ") + " ="), h("b.dogru", a * b)) : null) : null,
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => { parca = []; cevaplar = {}; ciz(); } }, T.icon("reset"), hepsi ? "Başka türlü parçala" : "Baştan")));
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
      function ciz() {
        kap.replaceChildren(h("div.mz-ust", seg([["carp", "Çarpma"], ["bol", "Bölme"]], tur, (v) => { tur = v; yeni(); }), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni işlem")), tur === "carp" ? carpCiz() : bolCiz());
      }
      yeni();
    },
  });
  function sayiPadKucuk(onay) {
    const inp = h("input.in.mz-kucuk-girdi", { inputmode: "numeric", placeholder: "?", onkeydown: (e) => { if (e.key === "Enter" && inp.value) onay(inp.value.trim()); } });
    return h("span.mz-girdi-kap", inp, h("button.btn.sm.c-leaf", { onclick: () => inp.value && onay(inp.value.trim()) }, T.icon("check")));
  }

})();
