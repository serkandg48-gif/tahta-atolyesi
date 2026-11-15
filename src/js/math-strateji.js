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

  /* ================= 4. İlişki ve problem ================= */
  oyun("strateji-iliski-problem", 4, {
    title: "İlişki ve problem", icon: "scale", grades: [2, 4], short: "Şerit modeliyle eşitlik, eksilen-çıkan-fark, problem",
    render(host) {
      let tur = "esit", veri, durum;
      const kap = h("div.mz-oyun"); host.append(kap);
      function yeni() {
        if (tur === "esit") { const x = rnd(6, 18), y = rnd(2, 8), d = T.pick([-2, -1, 1, 2, 3]); veri = { ust: [x, y], alt: x - d, dogru: y + d }; durum = { k: 0 }; }
        else if (tur === "fark") { const e = rnd(4, 18) * 5, c = rnd(1, e / 5 - 1) * 5; veri = { e, c, f: e - c, bil: T.pick(["e", "c", "f"]) }; durum = { cozuldu: false }; }
        else { const n = rnd(2, 4), kalan = T.pick([5, 3, 4, 6, 10]); const kisi = ["babama", "anneme", "ablama", "kardeşime"].slice(0, n); veri = { n, kalan, kisi, top: kalan * 2 ** n }; durum = { adim: 0, cozuldu: false }; }
        ciz();
      }
      const serit = (parcalar, W, birim, y, ops = {}) => { const g = S("g"); let x = 20; parcalar.forEach(([v, renk, etiket]) => { const w = v * birim; g.append(S("rect", { x, y, width: Math.max(4, w - 3), height: 56, rx: 6, fill: renk })); const t = S("text", { x: x + w / 2, y: y + 38, "text-anchor": "middle", class: "mz-serit-t" }); t.textContent = etiket ?? v; g.append(t); x += w; }); return g; };
      function esitCiz() {
        const [x, y] = veri.ust, k = durum.k, sol = x + y, sag = veri.alt + k, W = 760, birim = (W - 40) / Math.max(sol, sag, 1) * 0.95;
        const s = S("svg", { viewBox: `0 0 ${W} 170`, class: "mz-serit" });
        s.append(serit([[y, "#F08A3C"], [x, "#C9C21E"]], W, birim, 14), serit([[k || 0.001, "#D1495B", k || "?"], [veri.alt, "#2FA552"]], W, birim, 84));
        const esit = sol === sag;
        return h("div",
          h("div.mz-soru", x + " + " + y + " = " + veri.alt + " + ", h("b", esit ? k : "?")),
          s,
          h("div.mz-durum" + (esit ? ".iyi" : ""), esit ? (x > veri.alt ? x + "'dan " + veri.alt + "'a " + (x - veri.alt) + " azaldı, bu yüzden " + y + "'den " + k + "'ye " + (k - y) + " arttı." : veri.alt + " daha büyük, bu yüzden öbür parça " + (y - k) + " küçüldü.") : "Kırmızı parçayı büyütüp küçülterek iki şeridi eşitle."),
          !esit ? h("div.row", { style: { justifyContent: "center" } }, h("button.mz-zipla", { onclick: () => { if (durum.k > 0) { durum.k--; ciz(); } } }, "−1"), h("button.mz-zipla", { onclick: () => { durum.k++; if (veri.alt + durum.k === sol) { ok(); kutla(); } ciz(); } }, "+1")) : null);
      }
      function farkCiz() {
        const { e, c, f, bil } = veri, W = 760, birim = (W - 40) / e, coz = durum.cozuldu;
        const et = (k, ad, v) => (bil === k && !coz ? ad + ": ?" : ad + ": " + v);
        const s = S("svg", { viewBox: `0 0 ${W} 170`, class: "mz-serit" });
        s.append(serit([[e, "#C9C21E", et("e", "Eksilen", e)]], W, birim, 14), serit([[c, "#3C82E8", et("c", "Çıkan", c)], [f, "#D1495B", et("f", "Fark", f)]], W, birim, 84));
        const dogru = { e, c, f }[bil];
        return h("div",
          h("div.mz-soru", bil === "e" ? "? − " + c + " = " + f : bil === "c" ? e + " − ? = " + f : e + " − " + c + " = ?", coz ? h("b", "  (" + dogru + ")") : null),
          s,
          h("div.mz-durum" + (coz ? ".iyi" : ""), coz ? "Eksilen = çıkan + fark. " + e + " = " + c + " + " + f : bil === "e" ? "Eksilen, çıkan ile farkın toplamıdır. Şeritlere bak." : "Çıkan ile fark yan yana gelince eksileni oluşturur."),
          !coz ? h("div.mz-padkap.orta", sayiPad((v) => { if (+v === dogru) { durum.cozuldu = true; ok(); kutla(); } else no(); ciz(); })) : null);
      }
      function problemCiz() {
        const { n, kalan, kisi, top } = veri, ad = durum.adim, coz = durum.cozuldu;
        const metin = "Paramın yarısını " + kisi[0] + (n > 1 ? ", " + kisi.slice(1).map((k) => "kalanın yarısını " + k).join(", ") : "") + " verdim. Cebimde " + kalan + " TL kaldı. Başlangıçta kaç TL param vardı?";
        /* kare model: her adımda kalan alan ikiye bölünür (sırayla dikey, yatay) */
        const W = 360, s = S("svg", { viewBox: `0 0 ${W + 20} ${W + 20}`, class: "mz-kare" });
        let x = 10, y = 10, w = W, hh = W; const tutar = (i) => top / 2 ** (i + 1);
        for (let i = 0; i < Math.min(ad, n); i++) {
          const dikey = i % 2 === 0; let px, py, pw, ph;
          if (dikey) { pw = w / 2; ph = hh; px = x; py = y; x += pw; w -= pw; } else { pw = w; ph = hh / 2; px = x; py = y; y += ph; hh -= ph; }
          s.append(S("rect", { x: px, y: py, width: pw, height: ph, fill: ["#BFE0EE", "#FBE3CC", "#D8F0C8", "#EEDCF7"][i], stroke: "#1E66B8", "stroke-width": 4 }));
          const t = S("text", { x: px + pw / 2, y: py + ph / 2 + 8, "text-anchor": "middle", class: "mz-kare-t" }); t.textContent = coz ? tutar(i) + " TL" : kisi[i].replace(/m[ae]$/, "m").replace("babam", "Baba").replace("annem", "Anne").replace("ablam", "Abla").replace("kardeşim", "Kardeş"); s.append(t);
        }
        s.append(S("rect", { x, y, width: w, height: hh, fill: ad >= n ? "#FFF4B8" : "#fff", stroke: "#1E66B8", "stroke-width": 4 }));
        if (ad >= n) { const t = S("text", { x: x + w / 2, y: y + hh / 2 + 8, "text-anchor": "middle", class: "mz-kare-t" }); t.textContent = kalan + " TL"; s.append(t); }
        return h("div",
          h("p.mz-problem", metin),
          h("div.mz-yan", s, h("div",
            ad < n ? h("div", h("p.mz-durum", "Bütün paramızı bir kare olarak düşünelim. Her adımda kalanı ikiye bölelim."), h("button.btn.big", { onclick: () => { durum.adim++; ciz(); } }, T.icon("next"), (ad + 1) + ". adım: yarısını " + kisi[ad] + " ver"))
              : coz ? h("div.mz-durum.iyi", "Evet! " + top + " TL. Her parça bir öncekinin yarısı: " + Array.from({ length: n }, (_, i) => tutar(i)).join(", ") + " ve kalan " + kalan + ".")
                : h("div", h("p.mz-durum", "Model hazır. En küçük parça " + kalan + " TL. Ondan geriye doğru giderek başlangıçtaki parayı bul."), h("div.mz-padkap.orta", sayiPad((v) => { if (+v === top) { durum.cozuldu = true; ok(); kutla(); } else no(); ciz(); }))))));
      }
      function ciz() {
        kap.replaceChildren(h("div.mz-ust", seg([["esit", "Eşitlik"], ["fark", "Eksilen, çıkan, fark"], ["problem", "Problem modeli"]], tur, (v) => { tur = v; yeni(); }), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni soru")),
          tur === "esit" ? esitCiz() : tur === "fark" ? farkCiz() : problemCiz());
      }
      yeni();
    },
  });

  /* ================= 5. Ritmik sayma boncukları ================= */
  oyun("strateji-ritmik-boncuk", 5, {
    title: "Ritmik sayma boncukları", icon: "beads", grades: [1, 3], short: "Beşlik ve kalanla ritmik say: 5+1, 10+2, 15+3...",
    render(host) {
      let n = 6, acik = 0, tahmin = false;
      const kap = h("div.mz-oyun"); host.append(kap);
      function ciz() {
        const W = 900, satir = 10, s = S("svg", { viewBox: `0 0 ${W} ${satir * 62 + 20}`, class: "mz-abakus" });
        const kirmizi = Math.min(5, n), mavi = Math.max(0, n - 5);
        for (let r = 0; r < satir; r++) {
          const y = 40 + r * 62, on = r < acik;
          s.append(S("line", { x1: 150, y1: y, x2: W - 20, y2: y, stroke: "#8A93A6", "stroke-width": 4 }));
          s.append(S("rect", { x: 146, y: y - 26, width: 6, height: 52, fill: "#5B6478" }), S("rect", { x: W - 24, y: y - 26, width: 6, height: 52, fill: "#5B6478" }));
          for (let i = 0; i < 10; i++) {
            const solda = on && i < n, cx = solda ? 180 + i * 46 : W - 50 - (9 - i) * 46 - (on ? 0 : 0);
            const renk = i < 5 ? "#E8483F" : "#F2EDE6";
            const g = S("circle", { cx: on ? (i < n ? 180 + i * 46 : W - 50 - (9 - i) * 46) : W - 50 - (9 - i) * 46 - (10 - n > 0 ? 0 : 0), cy: y, r: 21, fill: i < 5 ? (solda ? "#E8483F" : "#F4C9C4") : solda ? "#FFFFFF" : "#F2EDE6", stroke: i < 5 ? "#B8322B" : "#C9BFB2", "stroke-width": 2, class: "mz-boncuk" });
            s.append(g);
          }
          if (on) { const t = S("text", { x: 135, y: y + 10, "text-anchor": "end", class: "mz-ab-sol" }); t.textContent = (5 * (r + 1)) + (mavi ? " + " + mavi * (r + 1) : ""); if (n > 5) s.append(t);
            const t2 = S("rect", { x: 180 + n * 46 + 4, y: y - 26, width: 86, height: 52, rx: 12, fill: "#fff" }); s.append(t2); const t3 = S("text", { x: 180 + n * 46 + 47, "text-anchor": "middle", y: y + 12, class: "mz-ab-sayi" + (tahmin && r === acik - 1 && !satirAcik[r] ? " gizli" : "") }); t3.textContent = tahmin && !satirAcik[r] ? "?" : n * (r + 1); s.append(t3); }
          const hedefAlan = S("rect", { x: 0, y: y - 30, width: W, height: 60, fill: "transparent", class: "mz-ab-tik" }); hedefAlan.addEventListener("click", () => satirTik(r)); s.append(hedefAlan);
        }
        kap.replaceChildren(
          h("div.mz-ust", h("span.mz-etiket", "Kaçar sayalım?"), seg([2, 3, 4, 5, 6, 7, 8, 9].map((x) => [x, x + "'" + EK[x]]), n, (v) => { n = v; acik = 0; satirAcik = {}; ciz(); }),
            h("label.mz-kutu", h("input", { type: "checkbox", checked: tahmin ? true : null, onchange: (e) => { tahmin = e.target.checked; ciz(); } }), "Önce tahmin edelim"), h("div.spacer"),
            h("button.btn.sm.c-chalk", { onclick: () => { acik = 0; satirAcik = {}; ciz(); } }, T.icon("reset"), "Baştan")),
          h("div.mz-durum", acik === 0 ? "Bir sonraki satıra dokun, " + n + " boncuk sola kaysın." + (n > 5 ? " Her satırda 5 kırmızı ve " + mavi + " beyaz var." : "") : acik === satir ? "10 satır tamam: " + n + " × 10 = " + n * 10 : (tahmin && !satirAcik[acik - 1] ? "Toplam kaç oldu? Tahmin edin, sonra satıra yeniden dokunun." : n + "'" + EK[n] + " sayıyoruz: " + Array.from({ length: acik }, (_, i) => n * (i + 1)).join(", "))),
          s);
      }
      let satirAcik = {};
      function satirTik(r) {
        if (r === acik && acik < 10) { acik++; if (!tahmin) { satirAcik[r] = true; T.sound && T.sound.pop && T.sound.pop(); } if (acik === 10 && !tahmin) kutla(); }
        else if (tahmin && r === acik - 1 && !satirAcik[r]) { satirAcik[r] = true; ok(); if (acik === 10) kutla(); }
        ciz();
      }
      ciz();
    },
  });
})();
