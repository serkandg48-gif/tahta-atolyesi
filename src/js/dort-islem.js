/* Matematik: Dört işlem atölyesi. İşlemi önce modelle yap, yazılı işlem yanında adım adım oluşsun.
   Toplama ve çıkarma onluk bloklarla (eldeli toplama, onluk bozma), çarpma dizi ve alan modeliyle, bölme eşit paylaştırmayla. */
(function () {
  const { h } = T;
  const BAS = ["Birlik", "Onluk", "Yüzlük"];
  const rnd = T.rand;
  const COGUL_I = ["birlikleri", "onlukları", "yüzlükleri"], TEKIL_I = ["birliği", "onluğu", "yüzlüğü"], DEN = ["birlikten", "onluktan", "yüzlükten"], E_ = ["birliğe", "onluğa", "yüzlüğe"], COGUL = ["birlikler", "onluklar", "yüzlükler"];
  const buyuk = (x) => x[0].toLocaleUpperCase("tr") + x.slice(1);
  const basamak = (n) => [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10];
  const ISIM = ["Ada", "Can", "Ece", "Mert", "Zeynep", "Efe", "Defne", "Kerem"];
  const HIKAYE = {
    top: (a, b, ad) => `${ad} ${a} ceviz topladı, sonra ${b} ceviz daha buldu. Kaç cevizi oldu?`,
    cik: (a, b) => `Kütüphanede ${a} kitap vardı. Çocuklar ${b} kitabı ödünç aldı. Rafta kaç kitap kaldı?`,
    car: (a, b) => `Bahçede ${a} sıra fide var, her sırada ${b} fide. Toplam kaç fide var?`,
    bol: (a, b) => `${a} kurabiye ${b} tabağa eşit paylaştırılacak. Her tabağa kaçar kurabiye düşer?`,
  };
  const uret = (op, g) => {
    if (op === "top") { const m = g <= 1 ? 20 : g === 2 ? 99 : 999; let a = rnd(Math.floor(m / 4), Math.floor(m * 0.6)), b = rnd(Math.max(1, Math.floor(m / 8)), m - a); return [a, b]; }
    if (op === "cik") { const m = g <= 1 ? 20 : g === 2 ? 99 : 999; const a = rnd(Math.floor(m / 2), m), b = rnd(1, a - 1); return [a, b]; }
    if (op === "car") return g >= 4 && Math.random() < 0.5 ? [rnd(12, 39), rnd(2, 6)] : [rnd(2, g <= 2 ? 5 : 9), rnd(2, g <= 2 ? 5 : 10)];
    const k = rnd(2, g <= 2 ? 4 : 6), q = rnd(2, g <= 2 ? 5 : 9), r = g >= 3 && Math.random() < 0.4 ? rnd(1, k - 1) : 0; return [k * q + r, k];
  };
  const blok = (bi, n, cls = "") => Array.from({ length: n }, () => h("i.di-b.di-b" + bi + cls));

  T.tools["dort-islem"] = {
    title: "Dört işlem atölyesi", icon: "math", tone: "sun", cat: "manip", back: "matematik", grades: [1, 4],
    short: "İşlemi modelle yap: onluk bozma, elde, dizi, eşit paylaştırma",
    render(host) {
      const g = T.store.grade();
      let op = "top", a = 0, b = 0, hikaye = true, S = null, ad = "Ada";
      const box = h("div"); host.append(box);
      const yeni = (x, y) => { ad = T.pick(ISIM); [a, b] = x != null ? [x, y] : uret(op, g); S = baslat(); ciz(); };
      const baslat = () => {
        if (op === "top") return { i: 0, t1: basamak(a), t2: basamak(b), el: [0, 0, 0, 0], eldeNot: [0, 0, 0, 0], kol: [0, 0, 0, 0], hazir: false, bitti: false, sonuc: [null, null, null] };
        if (op === "cik") return { i: 0, U: basamak(a), cikan: [0, 0, 0], bozma: [0, 0, 0], bitti: false, sonuc: [null, null, null] };
        if (op === "car") return { satir: 0 };
        return { dagitilan: 0 };
      };
      const hane = () => Math.max(String(a).length, String(b).length);
      /* Yazılı işlem: dikey */
      const yazili = (isaret, sonucDizi, ustNot) => {
        const n = Math.max(hane(), sonucDizi.filter((x) => x != null).length);
        const hucre = (s, cls = "") => h("span.di-h" + cls, s == null ? "" : s instanceof Node ? s : String(s));
        const satir = (sayi) => { const d = String(sayi).padStart(n, " ").split(""); return d.map((c) => hucre(c.trim())); };
        return h("div.di-yazili", { style: { "--n": n + 1 } },
          h("span.di-h"), (ustNot || []).slice().reverse().slice(3 - n).map((x) => hucre(x || "", ".not")),
          h("span.di-h"), satir(a), hucre(isaret, ".isaret"), satir(b), h("div.di-cizgi"),
          h("span.di-h"), Array.from({ length: n }, (_, j) => hucre(sonucDizi[n - 1 - j], ".sonuc")));
      };
      const ciz = () => {
        const segOp = h("div.seg", [["top", "Toplama"], ["cik", "Çıkarma"], ["car", "Çarpma"], ["bol", "Bölme"]].map(([k, l]) => h("button", { "aria-pressed": String(op === k), onclick: () => { op = k; yeni(); } }, l)));
        const giris = (v, et, f, cur) => h("input.in.di-giris", { type: "number", min: 0, value: v, "aria-label": et, onchange: (e) => { const y = +e.target.value || 0; if (y !== cur()) f(y); } });
        const isa = { top: "+", cik: "−", car: "×", bol: "÷" }[op];
        let govde, yazi, mesaj = "", dugmeler = [];
        if (op === "top" || op === "cik") {
          const B = basamak(b), n = op === "top" ? Math.min(3, String(a + b).length) : Math.min(3, hane());
          const kolon = (j, ic) => h("div.di-kol" + (j === S.i && !S.bitti ? ".aktif" : ""), h("div.di-kb", BAS[j]), ic);
          /* Dokun ya da sürükle: kısa dokunuş da bırakma da aynı işi yapar */
          const tasinir = (el, hedef, f) => {
            el.classList.add("tasinir"); let bas = null;
            el.addEventListener("pointerdown", (e) => { bas = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); el.classList.add("tut"); });
            el.addEventListener("pointermove", (e) => { if (bas) el.style.transform = `translate(${e.clientX - bas.x}px,${e.clientY - bas.y}px)`; });
            el.addEventListener("pointerup", (e) => { if (!bas) return; const d = Math.hypot(e.clientX - bas.x, e.clientY - bas.y); bas = null; el.style.pointerEvents = "none";
              const alt = document.elementFromPoint(e.clientX, e.clientY); el.style.pointerEvents = ""; el.style.transform = ""; el.classList.remove("tut");
              if (d < 10 || !hedef || (alt && alt.closest(hedef))) f(); });
          };
          const yazKutu = (dogru, sonra) => {
            const inp = h("input.di-yaz", { type: "text", inputmode: "numeric", maxlength: 1, "aria-label": "Basamağa yazılacak rakam" });
            inp.addEventListener("input", () => { if (inp.value === "") return; if (+inp.value === dogru) { T.sound.ok(); sonra(); } else { T.sound.no(); inp.classList.add("yanlis"); setTimeout(() => { inp.value = ""; inp.classList.remove("yanlis"); }, 600); } });
            setTimeout(() => inp.focus({ preventScroll: true }), 50); return inp;
          };
          const sonrakiSutun = (son) => { if (son) { S.bitti = true; T.sound.ding && T.sound.ding(); } else { S.i++; S.hazir = false; } ciz(); };
          let yazilacak = null;
          if (op === "top") {
            const i = S.i, bekleyen = S.t1[i] + S.t2[i] + S.el[i];
            const kols = [2, 1, 0].slice(3 - n).map((j) => {
              const aktif = j === i && !S.bitti;
              const sat = (et, sayi, anahtar, cls = "") => h("div.di-satir" + cls, { "data-et": et }, blok(j, sayi, anahtar === "el" ? ".yeni" : "").map((el) => { if (aktif && !S.hazir) tasinir(el, ".di-kol.aktif .toplam", () => { S[anahtar][j]--; S.kol[j]++; T.sound.pop(); ciz(); }); return el; }));
              const sonucSatir = h("div.di-satir.toplam", { "data-et": "Sonuç" }, blok(j, S.kol[j]));
              if (aktif && S.hazir) { const o = h("i.di-b.di-b" + (j + 1) + ".yeni.hazir"); tasinir(o, ".di-kol[data-j='" + (j + 1) + "']", () => { S.hazir = false; S.el[j + 1]++; S.eldeNot[j + 1] = 1; T.sound.ok(); ciz(); }); sonucSatir.append(o); }
              const k = kolon(j, [sat("1. sayı", S.t1[j], "t1"), sat("2. sayı", S.t2[j], "t2"), S.el[j] ? sat("Elde", S.el[j], "el", ".elde") : null, sonucSatir]); k.dataset.j = j; return k;
            });
            govde = h("div.di-tablo", kols);
            if (!S.bitti) {
              const bl = BAS[i].toLowerCase();
              if (bekleyen > 0) mesaj = buyuk(COGUL_I[i]) + " sonuç satırına taşı. Bloklara dokun ya da sürükle.";
              else if (S.hazir) mesaj = "Yeni " + TEKIL_I[i + 1] + " " + COGUL[i + 1] + " sütununa taşı.";
              else if (S.kol[i] > 9 && i < 2) { mesaj = "9'dan fazla " + bl + " oldu. Bir basamakta en çok 9 olabilir. 10 " + TEKIL_I[i] + " birleştirip 1 " + BAS[i + 1].toLowerCase() + " yap."; dugmeler.push(h("button.btn.c-sun", { onclick: () => { S.kol[i] -= 10; S.hazir = true; T.sound.ok(); ciz(); } }, "Birleştir")); }
              else { const son = i >= n - 1; mesaj = BAS[i] + " basamağına hangi rakamı yazarız? Sonuç satırındaki " + COGUL_I[i] + " say ve yaz."; yazilacak = [i, yazKutu(S.kol[i], () => { S.sonuc[i] = S.kol[i]; sonrakiSutun(son); })]; }
            } else mesaj = a + " + " + b + " = " + (a + b);
            const son = S.sonuc.slice(); if (yazilacak) son[yazilacak[0]] = yazilacak[1];
            yazi = yazili(isa, son, S.eldeNot.slice(0, 3).map((e) => (e ? "1" : "")));
          } else {
            const i = S.i, U = S.U;
            const kols = [2, 1, 0].slice(3 - n).map((j) => {
              const aktif = j === i && !S.bitti, cikmaz = !S.bitti && U[i] < B[i];
              const bloklar = blok(j, U[j]).map((el, k) => {
                if (k >= U[j] - S.cikan[j]) el.classList.add("cikti");
                else if (aktif && U[i] >= B[i] && S.cikan[j] < B[j]) tasinir(el, null, () => { S.cikan[j]++; T.sound.pop(); ciz(); });
                else if (cikmaz && (j === i + 1 || (j === i + 2 && U[i + 1] === 0)) && U[j] > 0 && k === U[j] - 1) { el.classList.add("bozulur"); tasinir(el, null, () => { U[j]--; U[j - 1] += 10; S.bozma[j] = 1; S.bozma[j - 1] = 1; T.sound.ok(); ciz(); }); }
                return el;
              });
              return kolon(j, [h("div.di-satir", { "data-et": "Elimizde" }, bloklar), h("div.di-satir.ince", { "data-et": "Çıkacak" }, h("b.di-sayi", B[j]))]);
            });
            govde = h("div.di-tablo", kols);
            if (!S.bitti) {
              const bl = BAS[i].toLowerCase();
              if (U[i] < B[i]) { const ust = U[i + 1] > 0 ? i + 1 : i + 2; mesaj = U[i] + " " + DEN[i] + " " + B[i] + " " + bl + " çıkmaz. " + (ust === i + 1 ? "Parlayan " + E_[i + 1] + " dokun, bozup 10 " + bl + " yap." : "Önce parlayan " + E_[i + 2] + " dokun, 10 " + BAS[i + 1].toLowerCase() + " olsun."); }
              else if (S.cikan[i] < B[i]) mesaj = B[i] + " " + bl + " çıkaracağız. Çıkacak " + (i === 1 ? "onluklara" : i === 2 ? "yüzlüklere" : "birliklere") + " dokunarak al. (" + S.cikan[i] + " / " + B[i] + ")";
              else { const son = i >= n - 1; mesaj = BAS[i] + " basamağına hangi rakamı yazarız? Kalan " + COGUL_I[i] + " say."; yazilacak = [i, yazKutu(U[i] - B[i], () => { S.sonuc[i] = U[i] - B[i]; sonrakiSutun(son); })]; }
            } else mesaj = a + " − " + b + " = " + (a - b);
            const son = S.sonuc.map((x, j) => (S.bitti && j >= String(a - b).length && x === 0 ? null : x)); if (yazilacak) son[yazilacak[0]] = yazilacak[1];
            yazi = yazili(isa, son, U.map((x, j) => (S.bozma[j] ? String(x) : "")));
          }
        } else if (op === "car") {
          const alan = a > 12 || b > 12;
          if (!alan) {
            govde = h("div.di-dizi", { style: { gridTemplateColumns: "repeat(" + b + ", 1fr)" } }, Array.from({ length: a * b }, (_, k) => h("i.di-nokta" + (Math.floor(k / b) < S.satir ? ".on" : ""))));
            const say = Array.from({ length: S.satir }, (_, k) => (k + 1) * b);
            mesaj = S.satir < a ? a + " sıra, her sırada " + b + ". Satır satır sayalım: " + (say.join(", ") || "...") : a + " tane " + b + " = " + a * b;
            if (S.satir < a) dugmeler.push(h("button.btn.c-leaf", { onclick: () => { S.satir++; T.sound.pop(); ciz(); } }, "Bir satır say"), h("button.btn.c-chalk", { onclick: () => { S.satir = a; ciz(); } }, "Hepsini göster"));
          } else {
            const on = Math.floor(a / 10) * 10, bir = a % 10;
            govde = h("div.di-alan", { style: { gridTemplateColumns: on + "fr " + Math.max(bir, 1) + "fr" } },
              h("div.di-parca", h("small", on + " × " + b), S.satir >= 1 ? h("b", on * b) : h("b", "?")), bir ? h("div.di-parca.iki", h("small", bir + " × " + b), S.satir >= 2 ? h("b", bir * b) : h("b", "?")) : null);
            mesaj = S.satir === 0 ? a + " sayısını " + on + " ve " + bir + " olarak ayıralım. Önce " + on + " × " + b : S.satir === 1 && bir ? "Şimdi " + bir + " × " + b : on * b + " + " + bir * b + " = " + a * b;
            if (S.satir < (bir ? 2 : 1)) dugmeler.push(h("button.btn.c-leaf", { onclick: () => { S.satir++; T.sound.pop(); ciz(); } }, "Sonraki parça"));
          }
          yazi = h("div.di-esit", a + " × " + b + " = " + (S.satir >= (a > 12 || b > 12 ? (a % 10 ? 2 : 1) : a) ? a * b : "?"));
        } else {
          const k = b, q = Math.floor(a / k), r = a % k, d = S.dagitilan, tur = Math.floor(d / k);
          govde = h("div.di-bolme", h("div.di-havuz", h("small", "Paylaştırılacak"), h("div", blok(0, a - d))),
            h("div.di-tabaklar", Array.from({ length: k }, (_, t) => h("div.di-tabak", h("div", blok(0, tur + (t < d % k ? 1 : 0))), h("small", (tur + (t < d % k ? 1 : 0)) + "")))));
          const bitti = d >= q * k;
          mesaj = !bitti ? "Her tabağa birer birer dağıtalım. " + d + " tane dağıtıldı." : "Her tabağa " + q + " düştü" + (r ? ", " + r + " tane arttı. Kalan " + r + "." : ".");
          if (!bitti) dugmeler.push(h("button.btn.c-leaf", { onclick: () => { S.dagitilan = Math.min(q * k, S.dagitilan + k); T.sound.pop(); ciz(); } }, "Her tabağa birer ver"), h("button.btn.c-chalk", { onclick: () => { S.dagitilan = q * k; ciz(); } }, "Hepsini dağıt"));
          yazi = h("div.di-esit", a + " ÷ " + b + " = " + (bitti ? q : "?"), bitti && r ? h("small", "kalan " + r) : null, bitti ? h("div.di-kontrol", "Kontrol: " + b + " × " + q + (r ? " + " + r : "") + " = " + a) : null);
        }
        box.replaceChildren(
          h("div.row", { style: { gap: "8px", flexWrap: "wrap", alignItems: "center" } }, segOp,
            h("div.di-islem", giris(a, "Birinci sayı", (v) => yeni(op === "cik" ? Math.max(v, b) : Math.min(v, op === "bol" ? 60 : op === "car" ? 39 : 999), b), () => a), h("b", isa), giris(b, "İkinci sayı", (v) => yeni(a, op === "cik" ? Math.min(v, a) : op === "bol" ? T.clamp(v, 1, 10) : op === "car" ? T.clamp(v, 1, op === "car" && a > 12 ? 9 : 12) : Math.min(v, 999 - a)), () => b)),
            h("button.btn.c-chalk", { onclick: () => yeni() }, T.icon("dice"), "Yeni işlem"),
            h("label.di-hk", h("input", { type: "checkbox", checked: hikaye ? true : null, onchange: (e) => { hikaye = e.target.checked; ciz(); } }), "Problem cümlesi"),
            h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: () => { S = baslat(); ciz(); } }, T.icon("reset"), "Baştan")),
          hikaye ? h("p.di-hikaye", HIKAYE[op](a, b, ad)) : null,
          h("div.di-duzen", h("div.di-model", govde), h("div.di-yan", yazi)),
          h("div.di-mesaj", h("span", mesaj), h("div.row", { style: { gap: "8px" } }, dugmeler)));
      };
      yeni();
    },
  };
})();
