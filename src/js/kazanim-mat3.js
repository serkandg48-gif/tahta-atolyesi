/* Kazanım kartları: her öğrenme çıktısı için Keşfet (sahne ya da manipülatif), Oyna (pota oyunu) ve Kontrol et (sınıfça mini yoklama).
   İlk kurulan: Matematik 3. sınıf, 1. tema (MAT.3.1.1 - MAT.3.1.16). Sorular her açılışta yeniden üretilir. */
(function () {
  const { h } = T;
  const { rnd, karistir } = T.potaYardim;
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
  const farkli = (dogru, ...aday) => { const s = [dogru]; karistir(aday).forEach((x) => { if (s.length < 3 && !s.map(String).includes(String(x))) s.push(x); }); return s; };
  /* Oyunlar'daki çizgi film oyunlarının ortak çizim parçaları ve seçenek yardımcısı */
  T.KZ_CIZ = CIZ; T.KZ_FARKLI = farkli;
})();
