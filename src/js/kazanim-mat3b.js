/* Matematik 3. sınıf, 3-6. temalar: her kazanımın kendi oyunu (Math Playground örneği).
   Çizgi film tarzı: düz renkler, kalın yuvarlak lacivert çizgi, yumuşak gölge. Rehber: Bilge Baykuş.
   Ortak kabuk: oyunKabuk() tur sayar, puan tutar, balonla geri bildirim verir, sonunda yıldız gösterir. */
(function () {
  const { h } = T;
  const { rnd, karistir } = T.potaYardim;
  const farkli = T.KZ_FARKLI, CIZ = T.KZ_CIZ;
  const NS = "http://www.w3.org/2000/svg";
  const L = "#1B2A4A";
  const sv = (tag, a = {}, ...c) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); c.flat().forEach((x) => x && e.append(x)); return e; };
  const svgKok = (w, hh, ...c) => sv("svg", { viewBox: `0 0 ${w} ${hh}`, class: "dn-svg" }, ...c);
  const yazi = (x, y, t, px = 40, renk = L, ek = {}) => { const e = sv("text", Object.assign({ x, y, "font-size": px, fill: renk, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Fredoka, 'Baloo 2', system-ui, sans-serif", "font-weight": 800 }, ek)); e.textContent = t; return e; };

  /* ---------- Bilge Baykuş: sitenin çizgi film rehberi ---------- */
  function baykus(boy = 120) {
    return svgKok(120, 130,
      sv("ellipse", { cx: 60, cy: 124, rx: 34, ry: 6, fill: "rgba(0,0,0,.15)" }),
      sv("path", { d: "M22 54 Q20 18 42 14 L48 4 L54 16 Q60 14 66 16 L72 4 L78 14 Q100 18 98 54 Q102 104 60 118 Q18 104 22 54Z", fill: "#8A5A3B", stroke: L, "stroke-width": 4, "stroke-linejoin": "round" }),
      sv("path", { d: "M38 70 Q60 60 82 70 Q86 104 60 112 Q34 104 38 70Z", fill: "#F3D9B1" }),
      sv("circle", { cx: 44, cy: 44, r: 17, fill: "#fff", stroke: L, "stroke-width": 4 }), sv("circle", { cx: 76, cy: 44, r: 17, fill: "#fff", stroke: L, "stroke-width": 4 }),
      sv("circle", { cx: 47, cy: 46, r: 7, fill: L, class: "dn-goz" }), sv("circle", { cx: 73, cy: 46, r: 7, fill: L, class: "dn-goz" }),
      sv("path", { d: "M54 58 L60 70 L66 58Z", fill: "#F2A03D", stroke: L, "stroke-width": 3, "stroke-linejoin": "round" }),
      sv("path", { d: "M28 34 L44 20 L52 32", fill: "none", stroke: L, "stroke-width": 4, "stroke-linecap": "round" }),
      sv("path", { d: "M50 116 l-6 8 M60 118 v8 M70 116 l6 8", stroke: "#F2A03D", "stroke-width": 5, "stroke-linecap": "round" }));
  }

  /* ---------- ortak oyun kabuğu ---------- */
  function oyunKabuk(host, o) {
    const TUR = o.tur || 8;
    let tur = 0, dogru = 0, ilk = true;
    const puan = h("div.dn-puan"), turEl = h("div.dn-tur"), soru = h("div.dn-soru"), balon = h("div.dn-balon");
    const sahne = h("div.dn-sahne"), alt = h("div.dn-alt");
    const kok = h("div.dn-kok", { style: { "--dn": o.renk || "#2F7FE0", "--dn2": o.renk2 || "#BFE3FF" } },
      h("div.dn-ust", turEl, h("b.dn-baslik", o.baslik), puan),
      h("div.dn-gov", h("div.dn-rehber", baykus(), balon), h("div.dn-ana", soru, sahne, alt)));
    host.append(kok);
    if (o.arka) kok.style.backgroundImage = o.arka;
    const yaz = () => { puan.textContent = "⭐ " + dogru; turEl.textContent = "Tur " + Math.min(tur + 1, TUR) + " / " + TUR; };
    let bz = 0;
    const konus = (t, tip = "") => { balon.textContent = t; balon.className = "dn-balon acik " + tip; clearTimeout(bz); if (tip) bz = setTimeout(() => (balon.className = "dn-balon acik"), 2200); };
    const api = {
      sahne, alt, soru: (t) => (soru.textContent = t), konus,
      dogru(msg) { if (ilk) dogru++; yaz(); konus(msg || ["Harika!", "Süpersin!", "Tam isabet!", "Bravo!"][rnd(0, 3)], "iyi"); T.sound && T.sound.ok && T.sound.ok(); kok.classList.add("zipla"); setTimeout(() => kok.classList.remove("zipla"), 600); setTimeout(api.sonraki, 1500); },
      yanlis(msg) { ilk = false; konus(msg || ["Tekrar dene!", "Bir daha bak!"][rnd(0, 1)], "uyari"); T.sound && T.sound.no && T.sound.no(); sahne.classList.add("salla"); setTimeout(() => sahne.classList.remove("salla"), 450); },
      sonraki() {
        tur++; ilk = true;
        if (tur >= TUR) return bitir();
        yaz(); sahne.replaceChildren(); alt.replaceChildren(); o.yeni(api, tur);
      },
      secenek(liste, dogruMu, opt = {}) {
        alt.replaceChildren(h("div.dn-secenek", liste.map((x) => h("button.dn-dug", { onclick: (e) => { if (dogruMu(x)) { e.currentTarget.classList.add("iyi"); api.dogru(opt.iyi); } else { e.currentTarget.classList.add("kotu"); e.currentTarget.disabled = true; api.yanlis(opt.ipucu); } } }, String(x)))));
      },
      tuslar(dogruMu, opt = {}) {
        let deger = "";
        const ekran = h("div.dn-ekran", "?");
        const bas = (t) => { if (t === "⌫") deger = deger.slice(0, -1); else if (t === "Tamam") { if (!deger) return; if (dogruMu(+deger)) { ekran.classList.add("iyi"); api.dogru(opt.iyi); } else { api.yanlis(opt.ipucu); deger = ""; } } else if (deger.length < 5) deger += t; ekran.textContent = deger || "?"; };
        alt.replaceChildren(h("div.dn-tus-kap", ekran, h("div.dn-tuslar", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "Tamam"].map((t) => h("button" + (t === "Tamam" ? ".tamam" : ""), { onclick: () => bas(t) }, t))), opt.yardim || null));
      },
    };
    function bitir() {
      const yil = dogru >= TUR - 1 ? 3 : dogru >= TUR / 2 ? 2 : 1;
      sahne.replaceChildren(h("div.dn-son", h("div.dn-yildiz", [0, 1, 2].map((i) => h("span" + (i < yil ? ".on" : ""), "★"))), h("b", TUR + " turdan " + dogru + " tanesini ilk denemede bildin!"),
        h("button.btn.big.c-sun", { onclick: () => { tur = -1; dogru = 0; api.sonraki(); } }, T.icon("reset"), "Yeniden oyna")));
      alt.replaceChildren(); soru.textContent = ""; konus(yil === 3 ? "Muhteşemdin!" : "Güzel çalıştın, bir tur daha?", "iyi"); T.konfeti && yil === 3 && T.konfeti();
    }
    yaz(); konus(o.giris || "Hadi başlayalım!"); o.yeni(api, 0);
    return api;
  }

  /* ---------- sürükle bırak yardımcısı (dokunmatik ve fare) ---------- */
  function surukle(el, { bir, birak }) {
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault(); const r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
      const hayalet = el.cloneNode(true); hayalet.classList.add("dn-hayalet"); Object.assign(hayalet.style, { width: r.width + "px", height: r.height + "px", left: r.left + "px", top: r.top + "px" }); document.body.append(hayalet);
      el.classList.add("tasiniyor"); bir && bir();
      const mv = (ev) => { hayalet.style.left = ev.clientX - dx + "px"; hayalet.style.top = ev.clientY - dy + "px"; };
      const up = (ev) => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); hayalet.remove(); el.classList.remove("tasiniyor"); const hedef = document.elementsFromPoint(ev.clientX, ev.clientY).find((x) => x.dataset && x.dataset.hedef != null); birak(hedef || null); };
      addEventListener("pointermove", mv); addEventListener("pointerup", up);
    });
  }

  /* ---------- çizgi film nesneleri ---------- */
  const URUN = [["elma", "🍎"], ["süt", "🥛"], ["ekmek", "🍞"], ["peynir", "🧀"], ["muz", "🍌"], ["kalem", "✏️"], ["defter", "📒"], ["top", "⚽"], ["oyuncak ayı", "🧸"], ["çorap", "🧦"]];
  const etiket = (ad, fiyat) => h("div.dn-urun", h("span.dn-emoji", ad[1]), h("b", fiyat + " TL"), h("small", ad[0]));
  const kurabiye = () => h("div.dn-kurabiye", h("i"), h("i"), h("i"));
  const fide = (bos) => h("div.dn-fide" + (bos ? ".bos" : ""), bos ? "" : "🌱");
  const SEKIL = { 3: ["Üçgen", "M50 8 L92 86 L8 86Z"], 4: ["Dörtgen", "M14 14 H86 V86 H14Z"], 5: ["Beşgen", "M50 6 L94 38 L77 90 L23 90 L6 38Z"], 6: ["Altıgen", "M28 8 H72 L94 50 L72 92 H28 L6 50Z"] };
  const sekilSvg = (n, renk, don = 0, olc = 1) => { const yamuk = n === 4 && Math.random() < 0.5 ? "M8 80 L30 18 H74 L92 80Z" : null; return svgKok(100, 100, sv("path", { d: yamuk || SEKIL[n][1], fill: renk, stroke: L, "stroke-width": 5, "stroke-linejoin": "round", transform: `rotate(${don} 50 50) scale(${olc}) translate(${(1 - olc) * 50 / olc} ${(1 - olc) * 50 / olc})` })); };

  const OY = {};
  const oyun = (kod, def) => { OY[kod] = def; };

  /* MAT.3.2.1: Market kasası tahmini */
  oyun("MAT.3.2.1.", { ad: "Market kasası: tahmin et", ikon: "kasa", renk: "#E0692F", renk2: "#FFE2CC", giris: "Sepet yaklaşık kaç lira tutar? Önce yuvarla!",
    yeni(a) {
      const ur = karistir(URUN.slice()).slice(0, 2), f = [rnd(11, 89), rnd(11, 89)], top = f[0] + f[1], yuv = Math.round(f[0] / 10) * 10 + Math.round(f[1] / 10) * 10;
      a.soru("Sepetin tutarı yaklaşık kaç lira?");
      a.sahne.append(h("div.dn-market", h("div.dn-raf"), h("div.dn-sepet", ur.map((u, i) => etiket(u, f[i]))), h("div.dn-kasa", h("span", "KASA"), h("b", "? TL"))));
      a.secenek(farkli(yuv, yuv + 20, yuv - 20 > 0 ? yuv - 20 : yuv + 40, yuv + 50).sort((x, y) => x - y).map((x) => "≈ " + x + " TL"), (x) => x === "≈ " + yuv + " TL", { ipucu: "Fiyatları en yakın onluğa yuvarla, sonra topla!", iyi: "Evet! Gerçek tutar " + top + " TL, tahminin çok yakın." });
    } });
  /* MAT.3.2.2: Market kasası: üstünü ver */
  oyun("MAT.3.2.2.", { ad: "Market kasası: para üstü", ikon: "kasa", renk: "#E0692F", renk2: "#FFE2CC", giris: "Müşteriye para üstünü ver!",
    yeni(a, t) {
      const u = URUN[rnd(0, URUN.length - 1)], f = rnd(12, 480), ver = f < 100 ? 100 : f < 200 ? 200 : 500, toplamaMi = t % 3 === 2;
      if (toplamaMi) {
        const u2 = URUN[rnd(0, URUN.length - 1)], f2 = rnd(12, 400 - Math.min(f, 380));
        a.soru(u[0] + " ve " + u2[0] + " toplam kaç lira?");
        a.sahne.append(h("div.dn-market", h("div.dn-raf"), h("div.dn-sepet", etiket(u, f), etiket(u2, f2)), h("div.dn-kasa", h("span", "KASA"), h("b", "? TL"))));
        return a.tuslar((x) => x === f + f2, { ipucu: "Basamakları alt alta düşün: önce birlikler!" });
      }
      a.soru(u[0] + " " + f + " TL. Müşteri " + ver + " TL verdi. Para üstü kaç lira?");
      a.sahne.append(h("div.dn-market", h("div.dn-raf"), h("div.dn-sepet", etiket(u, f)), h("div.dn-kasa", h("span", "MÜŞTERİ VERDİ"), h("b", ver + " TL"))));
      a.tuslar((x) => x === ver - f, { ipucu: ver + " - " + f + " işlemini yap. Onluklara ayırabilirsin." });
    } });
  /* MAT.3.2.3: Fide bahçesi: çarpma tahmini */
  oyun("MAT.3.2.3.", { ad: "Fide bahçesi", ikon: "fide", renk: "#2FA84F", renk2: "#DDF5DF", giris: "Bahçede kaç fide var? Sıraları ve sütunları say!",
    yeni(a, t) {
      const s = rnd(2, 6), k = rnd(2, 9), bol = t % 2 === 1;
      a.sahne.append(h("div.dn-bahce", { style: { "--k": k } }, Array.from({ length: s * k }, () => fide())));
      if (bol) { a.soru(s * k + " fide " + s + " sıraya eşit dikildi. Her sırada kaç fide var?"); return a.secenek(farkli(k, k + 1, k - 1 || k + 2, s), (x) => x === k, { ipucu: "Bölme: " + s * k + " ÷ " + s }); }
      a.soru(s + " sıra, her sırada " + k + " fide. Toplam kaç fide?");
      a.secenek(farkli(s * k, s * k + k, s * k - s, s + k), (x) => x === s * k, { ipucu: s + " tane " + k + "'i topla ya da " + s + " × " + k + " yap!" });
    } });
  /* MAT.3.2.4: Kurabiye paylaştırma (sürükle) */
  oyun("MAT.3.2.4.", { ad: "Kurabiye paylaşımı", ikon: "kurabiye", renk: "#B8661A", renk2: "#FFEBCF", tur: 6, giris: "Kurabiyeleri tabaklara eşit paylaştır!",
    yeni(a) {
      const tabak = rnd(2, 4), her = rnd(2, 5), n = tabak * her, dolu = Array(tabak).fill(0);
      a.soru(n + " kurabiyeyi " + tabak + " tabağa eşit paylaştır. Kurabiyeleri tabaklara sürükle.");
      const kutu = h("div.dn-kavanoz"), tabaklar = Array.from({ length: tabak }, (_, i) => h("div.dn-tabak", { "data-hedef": i }, h("i.dn-tabak-say", "0")));
      a.sahne.append(h("div.dn-mutfak", kutu, h("div.dn-tabaklar", tabaklar)));
      for (let i = 0; i < n; i++) { const kb = kurabiye(); kutu.append(kb); surukle(kb, { birak: (hd) => { if (!hd) return; const j = +hd.dataset.hedef; dolu[j]++; hd.insertBefore(kb, hd.lastChild); hd.lastChild.textContent = dolu[j]; T.sound && T.sound.pop && T.sound.pop(); if (!kutu.children.length) kontrolEt(); } }); }
      a.alt.append(h("div.dn-ipucu", "Hepsini paylaştırınca her tabakta kaç kurabiye olduğunu yaz."));
      const kontrolEt = () => { if (dolu.every((x) => x === her)) { a.soru(n + " ÷ " + tabak + " = ?  Her tabakta kaç kurabiye var?"); a.tuslar((x) => x === her, { ipucu: "Bir tabaktaki kurabiyeleri say!" }); } else { a.yanlis("Tabaklar eşit değil! Yeniden dene."); setTimeout(() => { a.sahne.replaceChildren(); a.alt.replaceChildren(); OY["MAT.3.2.4."].yeni(a); }, 1400); } };
    } });
  /* MAT.3.2.5: Sayı makinesi (yönerge) */
  oyun("MAT.3.2.5.", { ad: "Sayı makinesi", ikon: "robot", renk: "#7A3FD1", renk2: "#EBDFFF", giris: "Makinenin yönergesini sırayla uygula!",
    yeni(a) {
      let x = rnd(2, 12); const bas = x, adim = [];
      for (let i = 0; i < 3; i++) { const op = [["+", rnd(2, 20)], ["-", rnd(1, 9)], ["×", rnd(2, 4)], ["÷", 2]][rnd(0, 3)];
        if (op[0] === "÷" && x % 2) { op[0] = "+"; op[1] = rnd(2, 9); } if (op[0] === "-" && x - op[1] < 0) op[0] = "+"; if (op[0] === "×" && x * op[1] > 200) op[0] = "+";
        x = op[0] === "+" ? x + op[1] : op[0] === "-" ? x - op[1] : op[0] === "×" ? x * op[1] : x / op[1]; adim.push(op); }
      a.soru("Makineye " + bas + " giriyor. Çıkan sayı kaç?");
      a.sahne.append(h("div.dn-makine", h("div.dn-giren", bas), adim.map((op, i) => h("div.dn-cark", { style: { "--i": i } }, h("b", op[0] + " " + op[1]))), h("div.dn-cikan", "?")));
      a.tuslar((y) => y === x, { ipucu: "Her dişliyi sırayla uygula!" });
    } });
  /* MAT.3.2.6: Problem çiftliği (günlük yaşam) */
  const PROBLEM = [
    () => { const a = rnd(3, 9), b = rnd(4, 9); return ["Çiftlikte " + a + " kümes var. Her kümeste " + b + " tavuk var. Toplam kaç tavuk var?", a * b, "🐔", a * b]; },
    () => { const a = rnd(120, 400), b = rnd(30, 110); return ["Ahırda " + a + " kg saman vardı. İneklere " + b + " kg verildi. Kaç kg saman kaldı?", a - b, "🌾", 8]; },
    () => { const k = rnd(2, 6), h2 = rnd(3, 8); return [k * h2 + " yumurta " + k + " koliye eşit konacak. Her koliye kaç yumurta konur?", h2, "🥚", k * h2]; },
    () => { const a = rnd(15, 60), b = rnd(15, 60); return ["Sabah " + a + " litre, akşam " + b + " litre süt sağıldı. Toplam kaç litre süt sağıldı?", a + b, "🥛", 6]; },
    () => { const a = rnd(3, 8), f = rnd(4, 12); return ["Bir torba yem " + f + " lira. Çiftçi " + a + " torba aldı. Kaç lira ödedi?", a * f, "💰", a]; },
  ];
  oyun("MAT.3.2.6.", { ad: "Çiftlik problemleri", ikon: "inek", renk: "#3B8E2E", renk2: "#E3F3D5", giris: "Önce problemi oku: ne verilmiş, ne isteniyor?",
    yeni(a) { const [t, c, em, adet] = PROBLEM[rnd(0, PROBLEM.length - 1)](); a.soru(t); a.sahne.append(h("div.dn-ciftlik", h("div.dn-ahir"), h("div.dn-hayvanlar", Array.from({ length: Math.min(adet, 24) }, () => h("span", em))))); a.tuslar((x) => x === c, { ipucu: "Hangi işlem gerekiyor? Toplama mı, çıkarma mı, çarpma mı, bölme mi?" }); } });
  /* MAT.3.2.7: Problem kurucu */
  oyun("MAT.3.2.7.", { ad: "Problem kurucu", ikon: "kalem", renk: "#2F7FE0", renk2: "#DCEBFF", giris: "Hangi hikâye bu işleme uyar?",
    yeni(a) {
      const x = rnd(3, 9), y = rnd(2, 6), tip = rnd(0, 3);
      const islem = [x * y + " + " + y, x * y + " - " + y, y + " × " + x, x * y + " ÷ " + y][tip];
      const H = [x * y + " bilyem vardı, " + y + " bilye daha aldım. Kaç bilyem oldu?", x * y + " bilyem vardı, " + y + " tanesini verdim. Kaç bilye kaldı?", y + " kutunun her birinde " + x + " bilye var. Toplam kaç bilye?", x * y + " bilyeyi " + y + " arkadaşa eşit paylaştırdım. Her biri kaç bilye aldı?"];
      a.soru("Bu işlemi gösteren problemi seç:  " + islem);
      a.sahne.append(h("div.dn-tahta", h("b", islem + " = ?")));
      a.secenek(karistir(H.slice()), (s) => s === H[tip], { ipucu: "İşaret ne anlatıyor? Eklemek, ayırmak, tekrar tekrar eklemek, paylaştırmak?" });
      a.alt.firstChild.classList.add("uzun");
    } });
  /* MAT.3.2.8: Eşitlik terazisi */
  oyun("MAT.3.2.8.", { ad: "Eşitlik terazisi", ikon: "terazi", renk: "#C98A1E", renk2: "#FFF0CF", giris: "Terazinin iki kefesi eşit olsun!",
    yeni(a) {
      const tip = rnd(0, 2); let sol, sagBas, cvp;
      if (tip === 0) { const p = rnd(3, 15), q = rnd(3, 15), r = rnd(2, p + q - 1); sol = p + " + " + q; sagBas = r + " + ?"; cvp = p + q - r; }
      else if (tip === 1) { const p = rnd(2, 6), q = rnd(2, 6) * 2; sol = p + " × " + q; sagBas = p * 2 + " × ?"; cvp = q / 2; }
      else { const p = rnd(20, 60), q = rnd(2, 15), r = rnd(2, 15); sol = p + " - " + q; sagBas = "? - " + r; cvp = p - q + r; }
      a.soru("Kefeler eşit olsun diye ? yerine hangi sayı gelmeli?");
      const kol = h("div.dn-kol"); a.sahne.append(h("div.dn-terazi", kol, h("div.dn-kefe.sol", h("b", sol)), h("div.dn-kefe.sag", h("b", sagBas)), h("div.dn-ayak")));
      kol.style.transform = "rotate(-6deg)";
      a.tuslar((x) => { const ok = x === cvp; kol.style.transform = ok ? "rotate(0)" : x > cvp ? "rotate(8deg)" : "rotate(-8deg)"; return ok; }, { ipucu: "Önce sol kefenin değerini bul!" });
    } });
  /* MAT.3.3.1: Cisim inceleme (3B, elle çevrilir) */
  const CISIM = [["Küp", 8, 6, 12, "Küpün"], ["Kare prizma", 8, 6, 12, "Kare prizmanın"], ["Üçgen prizma", 6, 5, 9, "Üçgen prizmanın"], ["Kare piramit", 5, 5, 8, "Kare piramidin"], ["Silindir", 0, 3, 2], ["Koni", 1, 2, 1], ["Küre", 0, 1, 0]];
  oyun("MAT.3.3.1.", { ad: "Cisim dedektifi", ikon: "kup", renk: "#0E8A8A", renk2: "#D6F3F3", giris: "Cismi parmağınla çevir, köşe, yüz ve ayrıtları say!",
    yeni(a) {
      const [ad, k, y, ay, ilgi] = CISIM[rnd(0, 3)], ne = rnd(0, 2), cvp = [k, y, ay][ne], kelime = ["köşesi", "yüzü", "ayrıtı"][ne];
      a.soru(ilgi + " kaç " + kelime + " var?");
      const kap = h("div.dn-cisim"); a.sahne.append(kap); cisimCiz(kap, ad);
      a.secenek(farkli(cvp, cvp + 1, cvp - 1, cvp + 2, cvp + 4), (x) => x === cvp, { ipucu: ne === 0 ? "Köşe: ayrıtların buluştuğu nokta." : ne === 1 ? "Yüz: cismin düz yüzeyleri." : "Ayrıt: iki yüzün birleştiği çizgi." });
    } });
  function cisimCiz(kap, ad) {
    T.sahne3(kap, { kamera: [3.6, 2.6, 5.2], bak: [0, 0, 0], fov: 38, env: ["#FFFFFF", "#D6F3F3", "#2A4A70"], sigdir: 6.2, oran: 1.6 }, null).then((c) => {
      if (!c) return; const THREE = c.THREE;
      const geo = ad === "Küp" ? new THREE.BoxGeometry(1.8, 1.8, 1.8) : ad === "Kare prizma" ? new THREE.BoxGeometry(1.4, 2.4, 1.4) : ad === "Üçgen prizma" ? new THREE.CylinderGeometry(1.2, 1.2, 2.2, 3) : new THREE.ConeGeometry(1.5, 2.2, 4);
      const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0x3DB9B9, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2, flatShading: true }));
      const ayrit = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x1B2A4A }));
      const kose = new THREE.Group(); const p = geo.attributes.position, gor = new Set();
      for (let i = 0; i < p.count; i++) { const key = [p.getX(i), p.getY(i), p.getZ(i)].map((v) => v.toFixed(2)).join(); if (gor.has(key)) continue; gor.add(key); const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshStandardMaterial({ color: 0xF2B705 })); s.position.set(p.getX(i), p.getY(i), p.getZ(i)); kose.add(s); }
      const g = new THREE.Group(); g.add(m, ayrit, kose); c.sahne.add(g); c.sahne.add(new THREE.HemisphereLight(0xffffff, 0x88a0b0, 1.2));
      const dl = new THREE.DirectionalLight(0xffffff, 1.8); dl.position.set(3, 5, 4); c.sahne.add(dl);
      let surt = null, hiz = 0.4;
      c.r.domElement.addEventListener("pointerdown", (e) => { surt = [e.clientX, e.clientY]; hiz = 0; });
      addEventListener("pointermove", (e) => { if (!surt) return; g.rotation.y += (e.clientX - surt[0]) * 0.01; g.rotation.x += (e.clientY - surt[1]) * 0.01; surt = [e.clientX, e.clientY]; });
      addEventListener("pointerup", () => (surt = null));
      c.kare = (dt) => { g.rotation.y += hiz * dt; };
    });
  }
  /* MAT.3.3.2: Şekil kutuları (sürükle) */
  oyun("MAT.3.3.2.", { ad: "Şekil kutuları", ikon: "sekil", renk: "#D9433A", renk2: "#FFE0DD", tur: 5, giris: "Şekilleri kenar sayısına göre kutulara taşı!",
    yeni(a) {
      const renk = ["#FFB547", "#5BC0EB", "#9BC53D", "#FA7921", "#C490D1", "#FF6F91"], kenar = karistir([3, 3, 4, 4, 5, 6, 3, 4, 5, 6].slice(0, 7)); let kalan = kenar.length, hata = 0;
      a.soru("Her şekli kenar sayısına uygun kutuya taşı.");
      const raf = h("div.dn-sekiller"), kutular = h("div.dn-kutular", [3, 4, 5, 6].map((n) => h("div.dn-kutu", { "data-hedef": n }, h("b", SEKIL[n][0]), h("small", n + " kenar"))));
      a.sahne.append(raf, kutular);
      kenar.forEach((n, i) => { const s = h("div.dn-sekil"); s.append(sekilSvg(n, renk[i % renk.length], rnd(-30, 30))); raf.append(s); surukle(s, { birak: (hd) => { if (!hd) return; if (+hd.dataset.hedef === n) { hd.append(s); s.classList.add("yerde"); T.sound && T.sound.pop && T.sound.pop(); if (--kalan === 0) a.dogru(hata ? "Bitti! Kenarları saymak işe yaradı." : "Hepsi doğru kutuda!"); } else { hata++; a.yanlis("Kenarları tek tek say!"); } } }); });
    } });
  /* MAT.3.3.3: Nokta tahtasında çiz */
  oyun("MAT.3.3.3.", { ad: "Nokta tahtası", ikon: "cetvel", renk: "#2F7FE0", renk2: "#DCEBFF", tur: 5, giris: "Noktaları birleştirerek istenen şekli çiz!",
    yeni(a) {
      const hedefN = [3, 4, 5, 6][rnd(0, 3)], N = 6, ara = 60, nokta = [], cizgi = []; let ilkN = null, sonN = null;
      a.soru(SEKIL[hedefN][0] + " çiz: noktalara sırayla dokun, başladığın noktada bitir.");
      const svg = svgKok(N * ara, N * ara), kat = sv("g"); svg.append(kat);
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const c = sv("circle", { cx: ara / 2 + i * ara, cy: ara / 2 + j * ara, r: 9, fill: "#9AA6BF", class: "dn-nokta" }); c.addEventListener("pointerdown", () => dokun(i, j, c)); svg.append(c); nokta.push(c); }
      const dokun = (i, j, c) => {
        if (!ilkN) { ilkN = [i, j]; sonN = [i, j]; c.setAttribute("fill", "#D9433A"); c.setAttribute("r", 13); return; }
        if (sonN[0] === i && sonN[1] === j) return;
        kat.append(sv("line", { x1: ara / 2 + sonN[0] * ara, y1: ara / 2 + sonN[1] * ara, x2: ara / 2 + i * ara, y2: ara / 2 + j * ara, stroke: "#2F7FE0", "stroke-width": 8, "stroke-linecap": "round" }));
        cizgi.push([sonN, [i, j]]); sonN = [i, j]; c.setAttribute("fill", "#2F7FE0");
        if (i === ilkN[0] && j === ilkN[1]) { const kenarSay = kenarlar(); if (kenarSay === hedefN) a.dogru(SEKIL[hedefN][0] + " oldu, " + hedefN + " kenarı var!"); else { a.yanlis("Senin şeklinin " + kenarSay + " kenarı var. Yeniden çiz!"); setTimeout(() => { kat.replaceChildren(); cizgi.length = 0; ilkN = sonN = null; nokta.forEach((n) => { n.setAttribute("fill", "#9AA6BF"); n.setAttribute("r", 9); }); }, 1200); } }
      };
      /* aynı doğrultudaki ardışık çizgiler tek kenar sayılır */
      const kenarlar = () => { const yon = cizgi.map(([p, q]) => { const dx = q[0] - p[0], dy = q[1] - p[1], g = Math.abs(gcd(dx, dy)) || 1; return dx / g + "," + dy / g; }); let n = 0; yon.forEach((y, k) => { if (y !== yon[(k - 1 + yon.length) % yon.length]) n++; }); return n || 1; };
      const gcd = (x, y) => (y ? gcd(y, x % y) : x);
      a.sahne.append(h("div.dn-nokta-kap", svg));
      a.alt.append(h("button.btn.c-chalk", { onclick: () => { kat.replaceChildren(); cizgi.length = 0; ilkN = sonN = null; nokta.forEach((n) => { n.setAttribute("fill", "#9AA6BF"); n.setAttribute("r", 9); }); } }, T.icon("reset"), "Sil, yeniden çiz"));
    } });
  /* MAT.3.3.4: Çevre tahmini, karınca yürür */
  oyun("MAT.3.3.4.", { ad: "Karınca turu", ikon: "karinca", renk: "#B8661A", renk2: "#FFEBCF", giris: "Karınca şeklin çevresini dolaşacak. Önce tahmin et!",
    yeni(a) {
      const w = rnd(2, 7), hh = rnd(2, 5), cevre = 2 * (w + hh), u = 44;
      a.soru("Her kare kenarı 1 cm. Karınca kaç cm yürür? Yaklaşık tahmin et.");
      const W = (w + 2) * u, H = (hh + 2) * u, svg = svgKok(W, H);
      for (let i = 0; i <= w + 2; i++) svg.append(sv("line", { x1: i * u, y1: 0, x2: i * u, y2: H, stroke: "#DDE3EE", "stroke-width": 2 }));
      for (let j = 0; j <= hh + 2; j++) svg.append(sv("line", { x1: 0, y1: j * u, x2: W, y2: j * u, stroke: "#DDE3EE", "stroke-width": 2 }));
      svg.append(sv("rect", { x: u, y: u, width: w * u, height: hh * u, fill: "#FFD9A8", stroke: L, "stroke-width": 5, rx: 4 }));
      const kar = yazi(u, u, "🐜", 34); svg.append(kar);
      a.sahne.append(h("div.dn-izgara", svg));
      const yuru = () => { const yol = [[u, u], [u + w * u, u], [u + w * u, u + hh * u], [u, u + hh * u], [u, u]]; let t = 0; const top = cevre * 140; const bas = performance.now(); const ad = () => { t = Math.min(1, (performance.now() - bas) / top); let d = t * cevre * u, i = 0; while (i < 4) { const L2 = Math.hypot(yol[i + 1][0] - yol[i][0], yol[i + 1][1] - yol[i][1]); if (d <= L2) break; d -= L2; i++; } i = Math.min(i, 3); const L2 = Math.hypot(yol[i + 1][0] - yol[i][0], yol[i + 1][1] - yol[i][1]) || 1, k = d / L2; kar.setAttribute("x", yol[i][0] + (yol[i + 1][0] - yol[i][0]) * k); kar.setAttribute("y", yol[i][1] + (yol[i + 1][1] - yol[i][1]) * k); if (t < 1) requestAnimationFrame(ad); }; ad(); };
      const sec = farkli(cevre, w * hh, cevre + 4, cevre - 4 > 2 ? cevre - 4 : cevre + 8, w + hh);
      a.alt.replaceChildren(h("div.dn-secenek", sec.map((x) => h("button.dn-dug", { onclick: (e) => { yuru(); if (x === cevre) { e.currentTarget.classList.add("iyi"); a.dogru("Karınca tam " + cevre + " cm yürüdü!"); } else { e.currentTarget.classList.add("kotu"); e.currentTarget.disabled = true; a.yanlis("Karıncayı izle: kenarları say ve topla!"); } } }, "≈ " + x + " cm"))));
    } });
  /* MAT.3.3.5: Sıvı tahmini, sürahi doldur */
  oyun("MAT.3.3.5.", { ad: "Limonata standı", ikon: "limon", renk: "#E0A21E", renk2: "#FFF4C9", giris: "Bir bardak 250 mililitre. Sürahi kaç bardak alır?",
    yeni(a, t) {
      const bardak = rnd(2, 8), ml = bardak * 250, litreSor = t % 2 === 1 && ml % 1000 === 0;
      a.soru(litreSor ? "Bu sürahi kaç litre limonata alır?" : "Bu sürahiye kaç mililitre limonata sığar? (1 bardak = 250 ml)");
      const sur = h("div.dn-surahi", { style: { "--d": 0 } }, h("i.dn-sivi")), bar = h("div.dn-bardaklar", Array.from({ length: bardak }, () => h("div.dn-bardak", h("i"))));
      a.sahne.append(h("div.dn-stand", sur, bar));
      setTimeout(() => { sur.style.setProperty("--d", 1); [...bar.children].forEach((b, i) => setTimeout(() => b.classList.add("dolu"), 300 + i * 220)); }, 200);
      if (litreSor) a.secenek(farkli(ml / 1000, ml / 1000 + 1, ml / 1000 + 2, 10).map((x) => x + " L"), (x) => x === ml / 1000 + " L", { ipucu: "4 bardak 1 litre eder!" });
      else a.secenek(farkli(ml, ml + 250, ml - 250 || 1000, bardak * 100).map((x) => x + " ml"), (x) => x === ml + " ml", { ipucu: "Bardakları say, her biri 250 ml!" });
    } });
  /* MAT.3.3.6: Simetri doğruları */
  oyun("MAT.3.3.6.", { ad: "Ayna avcısı", ikon: "ayna", renk: "#7A3FD1", renk2: "#EBDFFF", giris: "Şekli ikiye eş bölen ayna çizgilerini bul!",
    yeni(a) {
      const S = [["Kare", 4, "M30 30 H170 V170 H30Z", [[100, 10, 100, 190], [10, 100, 190, 100], [20, 20, 180, 180], [180, 20, 20, 180]]], ["Dikdörtgen", 2, "M14 50 H186 V150 H14Z", [[100, 20, 100, 180], [4, 100, 196, 100], [14, 50, 186, 150]]], ["Eşkenar üçgen", 3, "M100 22 L180 160 H20Z", [[100, 10, 100, 172], [20, 160, 140, 91], [180, 160, 60, 91]]]], [ad, cvp, d, cizgi] = S[rnd(0, 2)];
      a.soru(ad + " kaç simetri doğrusuna sahip? Dokunarak ayna çizgilerini dene.");
      const svg = svgKok(200, 200, sv("path", { d, fill: "#C9A7F2", stroke: L, "stroke-width": 5, "stroke-linejoin": "round" }));
      const cizgiler = cizgi.concat(ad === "Dikdörtgen" ? [] : []).map(([x1, y1, x2, y2], i) => { const c = sv("line", { x1, y1, x2, y2, stroke: "rgba(122,63,209,.25)", "stroke-width": 7, "stroke-dasharray": "10 8", "stroke-linecap": "round", class: "dn-ayna" }); c.addEventListener("pointerdown", () => { const dogru = !(ad === "Dikdörtgen" && i === 2); c.setAttribute("stroke", dogru ? "#2FA84F" : "#D9433A"); if (!dogru) a.konus("Köşegen dikdörtgeni eş iki parçaya bölmez, katla da bak!", "uyari"); }); return c; });
      cizgiler.forEach((c) => svg.append(c));
      a.sahne.append(h("div.dn-ayna-kap", svg));
      a.secenek([1, 2, 3, 4], (x) => x === cvp, { ipucu: "Şekli katladığını düşün: iki parça üst üste tam oturmalı." });
    } });
  /* MAT.3.3.7 ve 3.3.8: Simetri tamamla (3.3.8 kodlama yönergesiyle) */
  function simetri(a, kodlu) {
    const N = 6, yarim = 3, dolu = new Set(), istenen = new Set(); let kod = null;
    if (kodlu) { let x = rnd(0, 2), y = rnd(1, 4); istenen.add(x + "," + y); kod = []; for (let i = 0; i < 3; i++) { const yn = [["→", 1, 0], ["↑", 0, -1], ["↓", 0, 1]].filter(([, dx, dy]) => x + dx >= 0 && x + dx < yarim && y + dy >= 0 && y + dy < N)[0 + rnd(0, 1)] || ["↓", 0, 1]; x += yn[1]; y += yn[2]; if (y >= N || y < 0) break; kod.push(yn[0]); istenen.add(x + "," + y); } }
    else for (let i = 0; i < rnd(4, 7); i++) istenen.add(rnd(0, yarim - 1) + "," + rnd(0, N - 1));
    a.soru(kodlu ? "Önce kodu izle: kırmızı kareden başla, okları uygula. Sonra sağ yarıya simetriyi boya." : "Sol yarı hazır. Sağ yarıya simetrisini boya, ayna çizgisi ortada.");
    const izgara = h("div.dn-sim", { style: { "--n": N } });
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const key = i + "," + j, sol = i < yarim, hucre = h("button.dn-hucre" + (i === yarim ? ".ayna" : ""));
      if (sol && (!kodlu ? istenen.has(key) : [...istenen][0] === key)) hucre.classList.add(kodlu ? "bas" : "dolu");
      hucre.onclick = () => { if (sol && !kodlu) return; const k2 = i + "," + j; dolu.has(k2) ? dolu.delete(k2) : dolu.add(k2); hucre.classList.toggle(sol ? "sol-boya" : "dolu"); };
      izgara.append(hucre);
    }
    a.sahne.append(h("div.dn-sim-kap", kodlu ? h("div.dn-kod", h("b", "Kod:"), kod.map((k) => h("span", k))) : null, izgara));
    a.alt.replaceChildren(h("button.btn.big.c-leaf", { onclick: () => {
      const ayna = [...istenen].map((k) => { const [x, y] = k.split(",").map(Number); return N - 1 - x + "," + y; });
      const sagDolu = [...dolu].filter((k) => +k.split(",")[0] >= yarim), solDolu = [...dolu].filter((k) => +k.split(",")[0] < yarim);
      const solTamam = !kodlu || [...istenen].slice(1).every((k) => solDolu.includes(k)) && solDolu.length === istenen.size - 1;
      if (solTamam && sagDolu.length === ayna.length && ayna.every((k) => sagDolu.includes(k))) a.dogru("Ayna gibi oldu!"); else a.yanlis(kodlu && !solTamam ? "Önce kodu sol yarıda doğru boya." : "Ayna çizgisine uzaklıklar iki yanda aynı olmalı.");
    } }, T.icon("check"), "Kontrol et"));
  }
  oyun("MAT.3.3.7.", { ad: "Ayna boyama", ikon: "ayna", renk: "#C2457E", renk2: "#FFE1EE", tur: 5, giris: "Ayna çizgisinin öbür yanına aynısını boya!", yeni: (a) => simetri(a, false) });
  oyun("MAT.3.3.8.", { ad: "Kodla ve aynala", ikon: "robot", renk: "#0E8A8A", renk2: "#D6F3F3", tur: 5, giris: "Kodu takip et, sonra simetrisini oluştur!", yeni: (a) => simetri(a, true) });
  /* MAT.3.4.1: Sınıf anketi ve grafik */
  oyun("MAT.3.4.1.", { ad: "Sınıf anketi", ikon: "grafik", renk: "#2F7FE0", renk2: "#DCEBFF", tur: 3, giris: "Sınıfa soralım, verileri toplayıp grafik yapalım!",
    yeni(a) {
      const SORU = [["En sevdiğimiz meyve hangisi?", [["🍎", "Elma"], ["🍌", "Muz"], ["🍓", "Çilek"], ["🍊", "Portakal"]]], ["Okula nasıl geliyoruz?", [["🚶", "Yürüyerek"], ["🚌", "Servisle"], ["🚗", "Arabayla"], ["🚲", "Bisikletle"]]], ["En sevdiğimiz mevsim?", [["🌸", "İlkbahar"], ["☀️", "Yaz"], ["🍂", "Sonbahar"], ["❄️", "Kış"]]]][rnd(0, 2)];
      const say = SORU[1].map(() => 0);
      a.soru(SORU[0] + " Her öğrenci seçimine bir kez dokunsun.");
      const sutun = SORU[1].map(([em, ad], i) => { const bar = h("i.dn-bar"), n = h("b", "0"); const b = h("button.dn-sutun", { onclick: () => { say[i]++; n.textContent = say[i]; bar.style.height = Math.min(100, say[i] * 7) + "%"; T.sound && T.sound.pop && T.sound.pop(); } }, h("div.dn-bar-kap", bar), n, h("span", em), h("small", ad)); return b; });
      a.sahne.append(h("div.dn-grafik", sutun));
      a.alt.replaceChildren(h("button.btn.big.c-sun", { onclick: () => {
        const top = say.reduce((x, y) => x + y, 0); if (top < 3) return a.konus("Önce birkaç öğrenci oy versin!", "uyari");
        const en = Math.max(...say), i = say.indexOf(en), az = Math.min(...say), j = say.indexOf(az), sor = rnd(0, 2);
        if (sor === 0) { a.soru("Grafiğe bak: en çok hangisi seçildi?"); a.secenek(SORU[1].map((x) => x[1]), (x) => say[SORU[1].findIndex((y) => y[1] === x)] === en, { ipucu: "En uzun sütuna bak!" }); }
        else if (sor === 1) { a.soru("Kaç öğrenci oy verdi?"); a.tuslar((x) => x === top, { ipucu: "Bütün sütunları topla!" }); }
        else { a.soru(SORU[1][i][1] + " ile " + SORU[1][j][1] + " arasında kaç oy fark var?"); a.tuslar((x) => x === en - az, { ipucu: "Büyük sayıdan küçüğü çıkar!" }); }
      } }, T.icon("chart"), "Anket bitti, grafiği okuyalım"));
    } });

  /* ---------- kazanım kartlarına bağla: Keşfet, Oyna, Kontrol et ---------- */
  const id = (kod) => kod.toLowerCase().replace(/\./g, "-").replace(/-$/, "");
  const KESFET = {
    "MAT.3.2.1.": ["market", "yuzluk-tablo"], "MAT.3.2.2.": ["dort-islem", "taban-blok"], "MAT.3.2.3.": ["strateji-carpma-bolme", "onluk-cerceve"], "MAT.3.2.4.": ["strateji-carpma-bolme", "oyun-adil-paylasim"],
    "MAT.3.2.5.": ["dort-islem", "oyun-sifre"], "MAT.3.2.6.": ["oyun-problem-ciftligi", "market"], "MAT.3.2.7.": ["oyun-problem-ciftligi", "dort-islem"], "MAT.3.2.8.": ["terazi", "oyun-denge"],
    "MAT.3.3.1.": ["sekiller", "oyun-hacim"], "MAT.3.3.2.": ["sekiller", "geometri-tahtasi"], "MAT.3.3.3.": ["geometri-tahtasi", "serbest-kareli"], "MAT.3.3.4.": ["alan-cevre", "oyun-alan-avi"],
    "MAT.3.3.5.": ["tarif", "oyun-solucan"], "MAT.3.3.6.": ["geometri-tahtasi", "tangram"], "MAT.3.3.7.": ["serbest-kareli", "geometri-tahtasi"], "MAT.3.3.8.": ["serbest-kareli", "oruntu"], "MAT.3.4.1.": ["grafik-atolyesi", "oyun-grafik-dedektifi"],
  };
  /* Kontrol et için kısa sorular (2B kart) */
  const kart = (t, alt, ust) => CIZ.metin(t, alt, ust);
  const KONTROL = {
    "MAT.3.2.1.": () => { const x = rnd(21, 89), y = rnd(21, 89), c = Math.round(x / 10) * 10 + Math.round(y / 10) * 10; return { gorsel: kart(x + " + " + y, "Tahminî sonuç kaç?", "Önce en yakın onluğa yuvarla"), secenekler: farkli(c, c + 10, c - 10, c + 20), dogru: c }; },
    "MAT.3.2.2.": () => { const x = rnd(120, 680), y = rnd(25, 290), top = Math.random() < 0.5, c = top ? x + y : x - y; return { gorsel: kart(x + (top ? " + " : " - ") + y + " = ?"), secenekler: farkli(c, c + 10, c - 10, c + 100), dogru: c }; },
    "MAT.3.2.3.": () => { const x = rnd(2, 9), y = rnd(2, 9); return { gorsel: kart(x + " × " + y + " = ?", "Zihinden çarp"), secenekler: farkli(x * y, x * y + x, x * y - y, x + y), dogru: x * y }; },
    "MAT.3.2.4.": () => { const x = rnd(2, 9), y = rnd(2, 9); return { gorsel: kart(x * y + " ÷ " + x + " = ?", "Çarpmayı düşün: " + x + " × ? = " + x * y), secenekler: farkli(y, y + 1, y - 1 || y + 2, x), dogru: y }; },
    "MAT.3.2.5.": () => { const x = rnd(3, 12), y = rnd(2, 9), z = rnd(2, 3), c = (x + y) * z; return { gorsel: kart(x + " ile başla, " + y + " ekle, " + z + " ile çarp", "Sonuç kaç?"), secenekler: farkli(c, x + y * z, c + z, x * z + y), dogru: c }; },
    "MAT.3.2.6.": () => { const x = rnd(3, 8), y = rnd(4, 9); return { gorsel: kart(x + " kutu, her kutuda " + y + " kalem", "Toplam kaç kalem?"), secenekler: farkli(x * y, x + y, x * y + y, x * y - x), dogru: x * y }; },
    "MAT.3.2.7.": () => { const x = rnd(3, 9), y = rnd(2, 6); return { gorsel: kart(x * y + " ÷ " + y, "Bu işleme uyan hikâye hangisi?"), secenekler: ["Paylaştırma", "Ekleme", "Eksiltme"], dogru: "Paylaştırma" }; },
    "MAT.3.2.8.": () => { const p = rnd(4, 15), q = rnd(4, 15), r = rnd(2, 8), c = p + q - r; return { gorsel: kart(p + " + " + q + " = " + r + " + ?", "Eşitliği tamamla"), secenekler: farkli(c, p + q, c + 1, c - 2), dogru: c }; },
    "MAT.3.3.1.": () => { const [ad, k, y, ay] = CISIM[rnd(0, 3)], ne = rnd(0, 2), c = [k, y, ay][ne]; return { gorsel: kart(ad, "Kaç " + ["köşesi", "yüzü", "ayrıtı"][ne] + " var?"), secenekler: farkli(c, c + 1, c - 1, c + 2), dogru: c }; },
    "MAT.3.3.2.": () => { const n = rnd(3, 6); return { gorsel: { tur: "ciz", oran: 1.7, ciz: (g, w, hh) => { const p = new Path2D(SEKIL[n][1]); g.save(); g.translate(w / 2 - 170, hh / 2 - 170); g.scale(3.4, 3.4); g.fillStyle = "#FFB547"; g.fill(p); g.lineWidth = 2; g.strokeStyle = L; g.stroke(p); g.restore(); } }, secenekler: farkli(SEKIL[n][0], ...["Üçgen", "Dörtgen", "Beşgen", "Altıgen"].filter((x) => x !== SEKIL[n][0])), dogru: SEKIL[n][0] }; },
    "MAT.3.3.3.": () => { const n = rnd(3, 6); return { gorsel: kart(SEKIL[n][0] + " çizmek için", "Kaç kenar çizmelisin?"), secenekler: farkli(n, n + 1, n - 1, n + 2), dogru: n }; },
    "MAT.3.3.4.": () => { const w = rnd(2, 8), hh = rnd(2, 6), c = 2 * (w + hh); return { gorsel: kart(w + " cm × " + hh + " cm", "Dikdörtgenin çevresi kaç cm?"), secenekler: farkli(c, w * hh, w + hh, c + 2), dogru: c }; },
    "MAT.3.3.5.": () => { const L2 = [["Bir bardak su", "250 ml", "2 L", "20 L"], ["Bir kova su", "10 L", "100 ml", "1 ml"], ["Bir çay kaşığı şurup", "5 ml", "5 L", "500 ml"], ["Bir şişe su", "1 L", "10 L", "10 ml"]][rnd(0, 3)]; return { gorsel: kart(L2[0], "Yaklaşık ne kadar sıvı alır?"), secenekler: L2.slice(1), dogru: L2[1] }; },
    "MAT.3.3.6.": () => { const S = [["Kare", 4], ["Dikdörtgen", 2], ["Daire", "Sonsuz"]][rnd(0, 2)]; return { gorsel: kart(S[0], "Kaç simetri doğrusu var?"), secenekler: S[0] === "Daire" ? ["2", "4", "Sonsuz"] : farkli(S[1], 1, 2, 4, 3).map(String), dogru: String(S[1]) }; },
    "MAT.3.3.7.": () => ({ gorsel: kart("Ayna çizgisinden 2 kare uzak", "Simetriği ayna çizgisinden kaç kare uzakta olur?"), secenekler: ["2", "1", "4"], dogru: "2" }),
    "MAT.3.3.8.": () => ({ gorsel: kart("→ → ↓", "Ayna dikeyse bu kodun simetriği?"), secenekler: ["← ← ↓", "→ → ↑", "← ← ↑"], dogru: "← ← ↓" }),
    "MAT.3.4.1.": () => { const v = [rnd(2, 9), rnd(2, 9), rnd(2, 9)], ad = ["Elma", "Muz", "Çilek"], c = v[0] + v[1] + v[2]; return { gorsel: { tur: "ciz", oran: 1.7, ciz: (g, w, hh) => { v.forEach((x, i) => { const bx = 180 + i * 250, bh = x * 40; g.fillStyle = ["#E2403A", "#F2B705", "#C2457E"][i]; g.fillRect(bx, hh - 90 - bh, 140, bh); g.font = "800 40px Fredoka, sans-serif"; g.fillStyle = L; g.textAlign = "center"; g.fillText(ad[i], bx + 70, hh - 40); g.fillText(x, bx + 70, hh - 110 - bh); }); } }, secenekler: farkli(c, c + 1, c - 2, c + 3), dogru: c }; },
  };
  Object.entries(OY).forEach(([kod, o]) => {
    const kisa = id(kod);
    T.tools["kd-" + kisa] = { cat: "oyun", ilk: 10 + Object.keys(OY).indexOf(kod), title: o.ad, icon: o.ikon, tone: "sun", grades: [3, 4], short: o.giris, render(host) { oyunKabuk(host, Object.assign({ baslik: o.ad }, o)); } };
    const ad = (T.ciktilar.bul(kod) || {}).metin || o.ad;
    const k = { ad: o.ad.replace(/^[^:]*: /, "") === o.ad ? o.ad : o.ad, kesfet: KESFET[kod] || [], soru: KONTROL[kod], oyun: { id: "kd-" + kisa, ad: o.ad, ikon: o.ikon } };
    T.KAZANIM_KART[kod] = k;
    T.tools["kk-" + kisa] = { cat: "kazanim-gizli", title: o.ad + ": kontrol et", icon: "check", tone: "leaf", grades: [3, 3], short: kod, render(host) { T.KZ_KONTROL(host, kod, k); } };
  });
  ["kasa", "fide", "kurabiye", "robot", "inek", "terazi", "kup", "sekil", "cetvel", "karinca", "limon", "ayna", "grafik"].forEach((k) => T.IKON3D && T.IKON3D.add(k));
  T.oyunKabuk = oyunKabuk;
})();
