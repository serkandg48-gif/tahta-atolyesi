/* Kazanım kartları: her öğrenme çıktısı için Keşfet (sahne ya da manipülatif), Oyna (pota oyunu) ve Kontrol et (sınıfça mini yoklama).
   İlk kurulan: Matematik 3. sınıf, 1. tema (MAT.3.1.1 - MAT.3.1.16). Sorular her açılışta yeniden üretilir. */
(function () {
  const { h } = T;
  const { rnd, karistir, celdiriciler } = T.potaYardim;
  const FONT = "'Fredoka', 'Baloo 2', system-ui, sans-serif";
  const LACI = "#1B2A4A", MAVI = "#2F7FE0", KIR = "#D9433A", YES = "#2FA84F", SARI = "#F2B705";

  /* ---------- panoya çizilen kartlar (2B tuval) ---------- */
  const yaz = (g, t, x, y, px, renk = LACI, agirlik = 800) => { g.font = agirlik + " " + px + "px " + FONT; g.fillStyle = renk; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, x, y); };
  const sigdirYaz = (g, t, x, y, enFazla, px, renk, ag) => { g.font = (ag || 800) + " " + px + "px " + FONT; while (g.measureText(t).width > enFazla && px > 20) { px -= 4; g.font = (ag || 800) + " " + px + "px " + FONT; } yaz(g, t, x, y, px, renk, ag); };
  const CIZ = {
    metin: (ana, alt, ust) => ({ tur: "ciz", oran: 1.7, ciz: (g, w, hh) => {
      if (ust) sigdirYaz(g, ust, w / 2, hh * 0.2, w * 0.9, 46, "#5B6680", 700);
      sigdirYaz(g, ana, w / 2, hh * (ust ? 0.52 : 0.45), w * 0.9, 150, LACI, 900);
      if (alt) sigdirYaz(g, alt, w / 2, hh * 0.82, w * 0.9, 50, MAVI, 700);
    } }),
    noktalar: (n, ust) => ({ tur: "ciz", oran: 1.7, ciz: (g, w, hh) => {
      if (ust) sigdirYaz(g, ust, w / 2, 50, w * 0.9, 44, "#5B6680", 700);
      const yer = [], r = Math.max(12, 34 - n * 0.2);
      for (let k = 0; k < n; k++) { let x, y, d = 0; do { x = rnd(r + 20, w - r - 20); y = rnd(r + 100, hh - r - 20); d++; } while (d < 300 && yer.some(([a, b]) => (a - x) ** 2 + (b - y) ** 2 < (2.3 * r) ** 2)); yer.push([x, y]); }
      yer.forEach(([x, y], i) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = ["#E2403A", "#2F7FE0", "#2FA84F", "#F2B705"][i % 4]; g.fill(); });
    } }),
    ciftler: (n, ust) => ({ tur: "ciz", oran: 1.7, ciz: (g, w, hh) => {
      if (ust) sigdirYaz(g, ust, w / 2, 56, w * 0.9, 46, "#5B6680", 700);
      const sut = Math.ceil(n / 2), r = Math.min(40, (w - 80) / sut / 2.6), ax = (w - sut * r * 2.6) / 2 + r * 1.3;
      for (let i = 0; i < n; i++) { const x = ax + Math.floor(i / 2) * r * 2.6, y = hh * 0.5 + (i % 2 ? r * 1.4 : -r * 1.4); g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = i === n - 1 && n % 2 ? KIR : MAVI; g.fill(); }
    } }),
    pasta: (pay, payda, ust) => ({ tur: "ciz", oran: 1.7, ciz: (g, w, hh) => {
      if (ust) sigdirYaz(g, ust, w / 2, 50, w * 0.9, 44, "#5B6680", 700);
      const cx = w / 2, cy = hh * 0.56, R = hh * 0.36;
      g.fillStyle = "rgba(0,0,0,.12)"; g.beginPath(); g.ellipse(cx, cy + R * 0.12, R, R * 0.98, 0, 0, 7); g.fill();
      for (let i = 0; i < payda; i++) { const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / payda, a1 = a0 + (2 * Math.PI) / payda; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0, a1); g.closePath(); g.fillStyle = i < pay ? "#F2A03D" : "#FFF3DC"; g.fill(); g.lineWidth = 8; g.strokeStyle = "#8A4B12"; g.stroke(); }
      g.beginPath(); g.arc(cx, cy, R, 0, 7); g.lineWidth = 12; g.strokeStyle = "#8A4B12"; g.stroke();
    } }),
    saat: (sa, dk, ust) => ({ tur: "ciz", oran: 1.7, ciz: (g, w, hh) => {
      if (ust) sigdirYaz(g, ust, w / 2, 50, w * 0.9, 44, "#5B6680", 700);
      const cx = w / 2, cy = hh * 0.56, R = hh * 0.38;
      g.beginPath(); g.arc(cx, cy, R + 16, 0, 7); g.fillStyle = MAVI; g.fill(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fillStyle = "#fff"; g.fill();
      for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30, u = i % 5 ? 0.93 : 0.86; g.beginPath(); g.moveTo(cx + Math.sin(a) * R * u, cy - Math.cos(a) * R * u); g.lineTo(cx + Math.sin(a) * R * 0.98, cy - Math.cos(a) * R * 0.98); g.lineWidth = i % 5 ? 3 : 7; g.strokeStyle = LACI; g.stroke(); }
      for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6; yaz(g, String(i), cx + Math.sin(a) * R * 0.72, cy - Math.cos(a) * R * 0.72 + 4, R * 0.17, LACI, 800); }
      const el = (a, boy, kal, renk) => { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(a) * boy, cy - Math.cos(a) * boy); g.lineWidth = kal; g.lineCap = "round"; g.strokeStyle = renk; g.stroke(); };
      el(((sa % 12) + dk / 60) * (Math.PI / 6), R * 0.5, 16, LACI); el(dk * (Math.PI / 30), R * 0.8, 10, KIR);
      g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.fillStyle = LACI; g.fill();
    } }),
    para: (liste, ust) => ({ tur: "ciz", oran: 1.7, ciz: (g, w, hh) => {
      if (ust) sigdirYaz(g, ust, w / 2, 46, w * 0.9, 42, "#5B6680", 700);
      const kagit = liste.filter((p) => p >= 500), madeni = liste.filter((p) => p < 500), bw = 360, bh = 180;
      const kW = kagit.length ? bw + (kagit.length - 1) * bw * 0.8 : 0, rr = (p) => (p >= 100 ? 92 : 76), mW = madeni.reduce((t, p) => t + rr(p) * 2 + 16, -16);
      const ust0 = ust ? 96 : 30, toplamH = (kagit.length ? bh + 30 : 0) + (madeni.length ? 200 : 0), y0 = ust0 + Math.max(0, (hh - ust0 - toplamH) / 2);
      let x = (w - kW) / 2;
      kagit.forEach((p, i) => { const y = y0 + (i % 2) * 22; g.fillStyle = { 500: "#8E6BC4", 1000: "#D9433A", 2000: "#2FA84F", 5000: "#E08A1E" }[p] || "#888"; g.fillRect(x, y, bw, bh); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 6; g.strokeRect(x + 12, y + 12, bw - 24, bh - 24); yaz(g, p / 100 + " TL", x + bw / 2, y + bh / 2 - 12, 76, "#fff", 900); yaz(g, "ÖRNEKTİR GEÇMEZ", x + bw / 2, y + bh - 32, 24, "#fff", 800); x += bw * 0.8; });
      let mx = (w - mW) / 2; const my = y0 + (kagit.length ? bh + 40 : 0);
      madeni.forEach((p) => { const r = rr(p); g.beginPath(); g.arc(mx + r, my + r, r, 0, 7); g.fillStyle = p >= 100 ? "#D9B14A" : "#C9CDD3"; g.fill(); g.lineWidth = 7; g.strokeStyle = "rgba(0,0,0,.25)"; g.stroke(); yaz(g, p >= 100 ? p / 100 + " TL" : p + " kr", mx + r, my + r - 6, r * 0.5, LACI, 900); yaz(g, "ÖRNEKTİR", mx + r, my + r * 1.5, 18, LACI, 700); mx += r * 2 + 16; });
    } }),
    blok2d: (n, ust) => ({ tur: "ciz", oran: 1.7, ciz: (g, w, hh) => {
      if (ust) sigdirYaz(g, ust, w / 2, 46, w * 0.9, 42, "#5B6680", 700);
      const yuz = Math.floor(n / 100), on = Math.floor((n % 100) / 10), bir = n % 10, u = Math.min(15, (w - 80) / (yuz * 10.6 + on * 1.5 + 4));
      const kare = (x, y, r1, r2) => { g.fillStyle = r1; g.fillRect(x, y, u, u); g.strokeStyle = r2; g.lineWidth = 1.5; g.strokeRect(x + 0.5, y + 0.5, u - 1, u - 1); };
      let x = 40; const y0 = hh * 0.25;
      for (let p = 0; p < yuz; p++) { for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) kare(x + i * u, y0 + j * u, "#3F7BE6", "#1E4BA8"); x += u * 10.6; }
      for (let p = 0; p < on; p++) { for (let j = 0; j < 10; j++) kare(x, y0 + j * u, "#2FB24C", "#16752C"); x += u * 1.5; }
      for (let p = 0; p < bir; p++) kare(x + Math.floor(p / 5) * u * 1.4, y0 + (p % 5) * u * 1.4, "#E2403A", "#9C1E1A");
    } }),
  };
  const sayiSecenek = (n, ust, alt = 1) => [n, ...celdiriciler(n, ust).filter((x) => x >= alt)].slice(0, 3);
  const farkli = (dogru, ...aday) => { const s = [dogru]; karistir(aday).forEach((x) => { if (s.length < 3 && !s.map(String).includes(String(x))) s.push(x); }); return s; };
  const TL = (kr) => (kr % 100 ? Math.floor(kr / 100) + "," + String(kr % 100).padStart(2, "0") + " TL" : kr / 100 + " TL");

  /* ---------- Matematik 3. sınıf, 1. tema ---------- */
  const K = {
    "MAT.3.1.1.": { ad: "1000'e kadar sayıların temsilleri", kesfet: ["taban-blok", "oyun-basamak-basket"],
      soru: () => { const n = rnd(100, 999); return { gorsel: { tur: "blok", n }, gorsel2: CIZ.blok2d(n, "Bloklar hangi sayıyı gösteriyor?"), secenekler: sayiSecenek(n, 999, 100), dogru: n }; }, ipucu: "Yüzlükleri, onlukları, birlikleri say!" },
    "MAT.3.1.2.": { ad: "Sayıları basamaklarına ayırma", kesfet: ["taban-blok", "strateji-sayi-baglari"],
      soru: () => {
        const n = rnd(111, 999), s = String(n), i = rnd(0, 2), d = +s[i], bd = d * [100, 10, 1][i];
        if (Math.random() < 0.5 && d) return { gorsel: CIZ.metin(s, s[i] + " rakamının basamak değeri kaç?", "Sayıya bak"), secenekler: farkli(bd, d, d * 10, d * 100, d * 1000), dogru: bd };
        const yz = +s[0], o = +s[1], b = +s[2];
        return { gorsel: CIZ.metin(yz + " yüzlük " + o + " onluk " + b + " birlik", "Hangi sayı?"), secenekler: farkli(n, +(b + "" + o + yz) || n + 10, +(yz + "" + b + o), n + 100 > 999 ? n - 100 : n + 100), dogru: n };
      }, ipucu: "Basamak tablosunu düşün!" },
    "MAT.3.1.3.": { ad: "Sayıları sıralama", kesfet: ["sayi-dogrusu", "dogruda-nerede"],
      soru: () => {
        const tur = rnd(0, 2), n = rnd(120, 980);
        if (tur === 0) { const s = karistir([n, n + rnd(1, 40), n - rnd(1, 40)]); const b = Math.max(...s); return { gorsel: CIZ.metin("En büyüğü hangisi?", null, "Üç sayıyı karşılaştır"), secenekler: s, dogru: b }; }
        if (tur === 1) { const s = karistir([n, n + rnd(1, 40), n - rnd(1, 40)]); const k = Math.min(...s); return { gorsel: CIZ.metin("En küçüğü hangisi?", null, "Üç sayıyı karşılaştır"), secenekler: s, dogru: k }; }
        const ileri = Math.random() < 0.5; return { gorsel: CIZ.metin(ileri ? n + " → ?" : "? ← " + n, ileri ? "Hemen sonra gelen sayı" : "Hemen önce gelen sayı"), secenekler: farkli(ileri ? n + 1 : n - 1, ileri ? n - 1 : n + 1, ileri ? n + 10 : n - 10), dogru: ileri ? n + 1 : n - 1 };
      }, ipucu: "Sayı doğrusunu düşün!" },
    "MAT.3.1.4.": { ad: "İleriye ve geriye ritmik sayma", kesfet: ["oyun-ritmik", "sayi-dogrusu"],
      soru: () => { const adim = [6, 7, 8, 9, 10, 100][rnd(0, 5)], ileri = Math.random() < 0.6, bas = adim === 100 ? rnd(1, 4) * 100 : rnd(1, 5) * adim, dizi = [0, 1, 2, 3].map((k) => bas + (ileri ? k : -k) * adim).filter((x) => x >= 0), cvp = dizi[dizi.length - 1] + (ileri ? adim : -adim);
        if (cvp < 0) return K["MAT.3.1.4."].soru();
        return { gorsel: CIZ.metin(dizi.join(", ") + ", ?", (ileri ? "İleriye " : "Geriye ") + adim + "'er sayıyoruz"), secenekler: farkli(cvp, cvp + 1, cvp - 1, cvp + adim, cvp + (ileri ? -adim : adim) * 2, cvp + 10), dogru: cvp }; }, ipucu: "Kaçar kaçar arttığına bak!" },
    "MAT.3.1.5.": { ad: "Tek ve çift sayılar", kesfet: ["yuzluk-tablo", "onluk-cerceve"],
      soru: () => {
        if (Math.random() < 0.5) { const n = rnd(5, 19); return { gorsel: CIZ.ciftler(n, n + " nesneyi ikişer eşledik"), secenekler: ["Tek", "Çift"], dogru: n % 2 ? "Tek" : "Çift" }; }
        const cift = Math.random() < 0.5, hedefS = rnd(50, 499) * 2 + (cift ? 0 : 1), d1 = rnd(50, 249) * 2 + (cift ? 1 : 0), d2 = rnd(250, 499) * 2 + (cift ? 1 : 0);
        return { gorsel: CIZ.metin(cift ? "Çift sayıyı at!" : "Tek sayıyı at!", "Birler basamağına bak"), secenekler: [hedefS, d1, d2], dogru: hedefS };
      }, ipucu: "İkişer eşle, artan var mı?" },
    "MAT.3.1.6.": { ad: "Tek ve çift sayıların toplamı", kesfet: ["onluk-cerceve", "yuzluk-tablo"],
      soru: () => { const a = rnd(0, 1), b = rnd(0, 1), ad = (x) => (x ? "Tek" : "Çift"); return { gorsel: CIZ.metin(ad(a) + " + " + ad(b) + " = ?", "Örnek dene: " + (a ? 3 : 4) + " + " + (b ? 5 : 2)), secenekler: ["Tek", "Çift"], dogru: ad((a + b) % 2) }; }, ipucu: "Küçük sayılarla dene!" },
    "MAT.3.1.7.": { ad: "Sayı ve şekil örüntüleri", kesfet: ["oruntu", "oyun-oruntu-treni"],
      soru: () => { const art = rnd(2, 9), bas = rnd(1, 20), dizi = [0, 1, 2, 3].map((k) => bas + k * art), cvp = bas + 4 * art; return { gorsel: CIZ.metin(dizi.join("  ") + "  ?", "Örüntüde sıradaki sayı"), secenekler: farkli(cvp, cvp + 1, cvp - 1, cvp + art, cvp - art), dogru: cvp }; }, ipucu: "Kurala bak: kaç artıyor?" },
    "MAT.3.1.8.": { ad: "100'e kadar nesne sayısını tahmin", kesfet: ["tahmin", "oyun-hizli-gor"],
      soru: () => { const n = rnd(12, 70), y = Math.round(n / 10) * 10 || 10; return { gorsel: CIZ.noktalar(n, "Saymadan tahmin et: yaklaşık kaç?"), secenekler: farkli(y, y > 30 ? y - 20 : y + 40, y + 30, y < 60 ? y + 50 : y - 30), dogru: y }; }, ipucu: "Önce 10 tanesine bak, sonra katla!" },
    "MAT.3.1.9.": { ad: "Bütün, yarım ve çeyrek", kesfet: ["kesir-duvari", "oyun-kesri-boya"],
      soru: () => { const t = rnd(0, 2), m = [[4, 4, "Bütün"], [1, 2, "Yarım"], [1, 4, "Çeyrek"]][t], payda = t === 0 ? [1, 2, 4][rnd(0, 2)] : m[1]; return { gorsel: CIZ.pasta(t === 0 ? payda : m[0], payda, "Boyalı kısım pastanın ne kadarı?"), secenekler: ["Bütün", "Yarım", "Çeyrek"], dogru: m[2] }; }, ipucu: "Pasta kaç eş parçaya bölünmüş?" },
    "MAT.3.1.10.": { ad: "Birim kesirler", kesfet: ["kesir-serit", "kesir-duvari"],
      soru: () => { const p = [2, 3, 4, 5, 6, 8, 10][rnd(0, 6)]; return { gorsel: CIZ.pasta(1, p, "Boyalı parça hangi birim kesir?"), secenekler: farkli("1/" + p, "1/" + (p + 1), "1/" + (p - 1 || 3), "1/" + (p + 2), p + "/1"), dogru: "1/" + p }; }, ipucu: "Eş parçaları say!" },
    "MAT.3.1.11.": { ad: "Pay ve payda", kesfet: ["kesir-duvari", "kesir-serit"],
      soru: () => { const p = rnd(3, 8), k = rnd(1, p - 1); return { gorsel: CIZ.pasta(k, p, "Boyalı kısmı gösteren kesir"), secenekler: farkli(k + "/" + p, p + "/" + k, (p - k) + "/" + p, k + "/" + (p + 1)), dogru: k + "/" + p }; }, ipucu: "Pay boyalı, payda bütün parça!" },
    "MAT.3.1.12.": { ad: "Analog ve dijital saat okuma", kesfet: ["saat", "oyun-saat-treni"],
      soru: () => { const s = rnd(1, 12), d = [0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55][rnd(0, 11)], yazS = (a, b) => a + ":" + String(b).padStart(2, "0"); return { gorsel: CIZ.saat(s, d, "Saat kaçı gösteriyor?"), secenekler: farkli(yazS(s, d), yazS(d / 5 || 12, s * 5 % 60), yazS(s % 12 + 1, d), yazS(s, (d + 30) % 60)), dogru: yazS(s, d) }; }, ipucu: "Önce kısa kola, sonra uzun kola bak!" },
    "MAT.3.1.13.": { ad: "Zaman ölçü birimleri", kesfet: ["saat", "takvim"],
      soru: () => { const L = [["1 saat", 60, "dakika"], ["1 dakika", 60, "saniye"], ["1 gün", 24, "saat"], ["1 hafta", 7, "gün"], ["1 yıl", 12, "ay"], ["2 saat", 120, "dakika"], ["3 hafta", 21, "gün"], ["2 gün", 48, "saat"]], [a, b, c] = L[rnd(0, L.length - 1)];
        return { gorsel: CIZ.metin(a + " = ? " + c, "Zaman birimleri"), secenekler: farkli(b, b + 10, b / 2, b * 2, 100, 30).map(String), dogru: String(b) }; }, ipucu: "Saati ve takvimi düşün!" },
    "MAT.3.1.14.": { ad: "Olayların süresini tahmin etme", kesfet: ["timer", "saat"],
      soru: () => { const L = [["Dişlerini fırçalamak", "2 dakika", "2 saat", "2 gün"], ["Bir film izlemek", "2 saat", "2 dakika", "2 hafta"], ["Bir fidanın ağaç olması", "Yıllar", "Dakikalar", "Saatler"], ["Göz kırpmak", "1 saniye", "1 saat", "1 gün"], ["Okul tatili (yaz)", "Aylar", "Dakikalar", "Saniyeler"], ["Ayakkabı bağlamak", "1 dakika", "1 hafta", "1 saat"]], [o, d, ...y] = L[rnd(0, L.length - 1)];
        return { gorsel: CIZ.metin(o, "Yaklaşık ne kadar sürer?"), secenekler: [d, ...y], dogru: d }; }, ipucu: "Kendi gününü düşün!" },
    "MAT.3.1.15.": { ad: "Uzunluk ve kütle birimleri", kesfet: ["oyun-solucan", "terazi"],
      soru: () => { const L = [["1 m = ? cm", 100], ["1 kg = ? g", 1000], ["2 m = ? cm", 200], ["3 kg = ? g", 3000], ["1 m 50 cm = ? cm", 150], ["500 g + 500 g = ? kg", 1], ["300 cm = ? m", 3]], [a, b] = L[rnd(0, L.length - 1)];
        return { gorsel: CIZ.metin(a, "Birimleri dönüştür"), secenekler: farkli(b, b * 10, b / 10 || 10, b + 50, 10).map(String), dogru: String(b) }; }, ipucu: "1 metre 100 santimetre, 1 kilogram 1000 gram!" },
    "MAT.3.1.16.": { ad: "Paralarımız", kesfet: ["para", "oyun-para-say"],
      soru: () => { const kagit = karistir([500, 1000, 2000, 5000]).slice(0, rnd(0, 2)), madeni = Array.from({ length: rnd(1, 4) }, () => [100, 100, 50, 25, 10][rnd(0, 4)]), top = [...kagit, ...madeni].reduce((a, b) => a + b, 0);
        return { gorsel: CIZ.para([...kagit, ...madeni], "Toplam kaç lira?"), secenekler: farkli(TL(top), TL(top + 100), TL(top - 50 > 0 ? top - 50 : top + 50), TL(top + 1000)), dogru: TL(top) }; }, ipucu: "Önce kâğıt paraları, sonra madenîleri topla!" },
  };
  T.KAZANIM_KART = Object.assign(T.KAZANIM_KART || {}, K);

  const id = (kod) => kod.toLowerCase().replace(/\./g, "-").replace(/-$/, "");
  /* Her kazanım için iki gizli araç: oyun (pota) ve kontrol (mini yoklama) */
  Object.entries(K).forEach(([kod, k]) => {
    T.tools["kz-" + id(kod)] = { cat: "kazanim-gizli", title: k.ad, icon: "basket", tone: "sun", grades: [3, 3], short: kod,
      render(host, api) { T.potaOyunu(host, api, { baslik: k.ad, seviyeler: [["tek", "Başla", MAVI]], soru: k.soru, ipucu: k.ipucu }); } };
    T.tools["kk-" + id(kod)] = { cat: "kazanim-gizli", title: k.ad + ": kontrol et", icon: "check", tone: "leaf", grades: [3, 3], short: kod, render(host) { kontrol(host, kod, k); } };
  });

  /* ---------- Kontrol et: tahtada sınıfça 5 soru ---------- */
  function kontrol(host, kod, k) {
    const SAY = 5; let i = 0, dogru = 0, s = null, cevaplandi = false;
    const kutu = h("div.kk-kap"); host.append(kutu);
    const tuval = () => { const gv = s.gorsel2 || s.gorsel; const cv = h("canvas.kk-tuval", { width: 1024, height: Math.round(1024 / (gv.oran || 1.7)) }); const g = cv.getContext("2d"); g.fillStyle = "#F7F9FC"; g.fillRect(0, 0, cv.width, cv.height); if (gv.tur === "blok") CIZ.blok2d(gv.n).ciz(g, cv.width, cv.height); else gv.ciz(g, cv.width, cv.height); return cv; };
    function ciz() {
      if (i >= SAY) {
        kutu.replaceChildren(h("div.kk-son", h("b", SAY + " sorudan " + dogru + " doğru"), h("p", dogru >= 4 ? "Sınıf bu kazanımda iyi gidiyor." : dogru >= 2 ? "Biraz daha çalışalım: önce Keşfet, sonra Oyna." : "Bu kazanıma yeniden dönelim: Keşfet ile başlayın."),
          h("div.row", h("button.btn.big.c-sun", { onclick: () => { i = 0; dogru = 0; yeni(); } }, T.icon("reset"), "Yeniden"), h("button.btn.big.c-chalk", { onclick: () => T.go("matematik") }, T.icon("back"), "Kazanımlara dön"))));
        return;
      }
      const sec = karistir(s.secenekler.slice(0, 3).map(String));
      kutu.replaceChildren(h("div.kk-ust", h("span", kod.replace(/\.$/, "")), h("b", "Soru " + (i + 1) + " / " + SAY), h("span", "Doğru: " + dogru)), tuval(),
        h("div.kk-secenek", sec.map((x, j) => h("button.kk-dug", { onclick: (e) => sec_(e.currentTarget, x) }, h("i", "ABC"[j]), x))),
        h("p.hint", "Sınıfla birlikte karar verin, sonra cevaba dokunun."));
    }
    function sec_(b, x) {
      if (cevaplandi) return; cevaplandi = true;
      const iyi = x === String(s.dogru); if (iyi) dogru++;
      b.classList.add(iyi ? "iyi" : "kotu");
      if (!iyi) [...kutu.querySelectorAll(".kk-dug")].forEach((d) => { if (d.textContent.slice(1) === String(s.dogru)) d.classList.add("iyi"); });
      setTimeout(() => { i++; yeni(); }, iyi ? 900 : 1800);
    }
    function yeni() { cevaplandi = false; s = k.soru(); ciz(); }
    yeni();
  }

  /* ---------- Matematik sayfasında Kazanımlar sekmesi ---------- */
  let temaSec = 0;
  T.kazanimSekmesi = function (wrap, ders, g) {
    const temalar = (T.ciktilar && T.ciktilar.temalar(ders, g)) || [];
    if (!temalar.length) { wrap.append(h("p.hint", "Bu sınıfın kazanımları yakında eklenecek.")); return; }
    if (temaSec >= temalar.length) temaSec = 0;
    wrap.append(h("div.kz-tema", temalar.map((t, i) => h("button" + (i === temaSec ? ".on" : ""), { onclick: () => { temaSec = i; T.route(); } }, h("small", (i + 1) + ". tema"), t.tema))));
    const tema = temalar[temaSec];
    wrap.append(h("div.kz-liste", tema.c.map((x) => {
      const k = K[x.kod], kesfet = k ? k.kesfet.map((t) => { const w = T.widgets[t], a = T.tools[t]; if (!w && !a) return null; return h("button.kz-cip", { onclick: () => { T.donusAyarla && T.donusAyarla("matematik", "Kazanımlara dön"); w ? T.board.add(t) : T.go((a.back || "matematik") + "-" + t); } }, T.icon3d((w || a).icon), (w || a).title); }) : [];
      return h("article.kz-kart" + (k ? "" : ".bos"),
        h("div.kz-bas", h("span.kz-kod", x.kod.replace(/\.$/, "")), h("h3", k ? k.ad : x.metin)), k ? h("p.kz-metin", x.metin) : null,
        k ? h("div.kz-adim",
          h("div.kz-blok.kesfet", h("b", "1. Keşfet"), h("div.kz-cipler", kesfet)),
          h("div.kz-blok.oyna", h("b", "2. Oyna"), h("button.kz-ana", { onclick: () => { T.donusAyarla && T.donusAyarla("matematik", "Kazanımlara dön"); T.go("matematik-kz-" + id(x.kod)); } }, T.icon3d("basket"), "Pota oyunu")),
          h("div.kz-blok.kontrol", h("b", "3. Kontrol et"), h("button.kz-ana", { onclick: () => { T.donusAyarla && T.donusAyarla("matematik", "Kazanımlara dön"); T.go("matematik-kk-" + id(x.kod)); } }, T.icon3d("tamam"), "5 soruluk yoklama")))
          : h("p.hint", "Bu kazanımın etkinlikleri hazırlanıyor. Şimdilik plan yazabilirsin."),
        h("button.kz-plan", { onclick: () => { T.planOnSecim = { ders, sinif: g, kod: x.kod }; T.go("plan"); } }, T.icon("plan"), "Bu kazanıma plan yaz"));
    })));
  };
})();
