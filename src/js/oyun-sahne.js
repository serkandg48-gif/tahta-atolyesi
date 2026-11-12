/* Oyunların arka plan sahneleri: her oyun temasına göre canlı, gerçekçi bir dünya.
   Sahne içeriğin arkasında "cover" ölçekle çizilir; maskot (çayırda tavşan) doğru ve yanlışa tepki verir. */
(function () {
  const Sh = T.Sahne, W = Sh.W, H = Sh.H, ZEMIN = 700;
  const TEMA = {
    "kutup-yolu": "kutup", "onu-tamamla": "kutup", "hacim": "kutup",
    "deniz-canavari": "deniz", "timsah": "deniz", "solucan": "cayir",
    "lav": "volkan", "islem-sirasi": "volkan",
    "asal-yaris": "gece", "sifre": "gece", "carpan": "gece", "kalanli": "gece",
  };
  Sh.oyunTemasi = (id) => TEMA[id] || "cayir";

  /* ---------- Kutup ---------- */
  const kar = Array.from({ length: 140 }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 3.2, v: 25 + Math.random() * 50, s: Math.random() * 6 }));
  function kutup(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, ZEMIN); g.addColorStop(0, "#0E2A4D"); g.addColorStop(0.45, "#2D5F8F"); g.addColorStop(1, "#BFDDF0"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    /* kuzey ışıkları */
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let x = 0; x <= W; x += 20) { const y = 140 + k * 50 + Math.sin(x / 210 + t * 0.4 + k) * 40 + Math.sin(x / 90 + t * 0.7) * 12; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } for (let x = W; x >= 0; x -= 20) ctx.lineTo(x, 260 + k * 50 + Math.sin(x / 170 + t * 0.3 + k) * 50); ctx.closePath();
      const a = ctx.createLinearGradient(0, 120, 0, 360); a.addColorStop(0, ["rgba(90,255,180,0)", "rgba(120,200,255,0)", "rgba(190,120,255,0)"][k]); a.addColorStop(0.5, ["rgba(90,255,180,.22)", "rgba(120,200,255,.16)", "rgba(190,120,255,.12)"][k]); a.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = a; ctx.fill(); }
    ctx.restore();
    /* dağlar */
    [[0.0, 520, 250, "#DDEAF5", "#9DB8D3", 2.1], [0.0, 600, 180, "#F4F9FD", "#B9CFE3", 5.3]].forEach(([, taban, gen, r1, r2, tohum]) => {
      const gg = ctx.createLinearGradient(0, taban - gen, 0, taban + 60); gg.addColorStop(0, r1); gg.addColorStop(1, r2); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 40) ctx.lineTo(x, taban - gen * (0.4 + 0.6 * Math.abs(Math.sin(x / 300 + tohum)) * (0.7 + 0.3 * Math.sin(x / 77 + tohum)))); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    });
    /* buz zemini */
    const bz = ctx.createLinearGradient(0, ZEMIN - 40, 0, H); bz.addColorStop(0, "#EAF5FC"); bz.addColorStop(1, "#A9CBE4"); ctx.fillStyle = bz; ctx.fillRect(0, ZEMIN - 40, W, H);
    ctx.strokeStyle = "rgba(120,160,200,.35)"; ctx.lineWidth = 2; for (let i = 0; i < 14; i++) { const x = Sh.hash(i) * W, y = ZEMIN + Sh.hash(i + 3) * 180; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 60 * Sh.hash(i + 5), y + 20 * Sh.hash(i + 6)); ctx.lineTo(x + 100 * Sh.hash(i + 7), y - 10); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(0, ZEMIN - 40, W, 6);
    /* kar */
    kar.forEach((k) => { k.y += k.v / 60; k.x += Math.sin(t + k.s) * 0.4; if (k.y > H) { k.y = -5; k.x = Math.random() * W; } ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.arc(k.x, k.y, k.r, 0, Math.PI * 2); ctx.fill(); });
  }
  /* ---------- Deniz ---------- */
  const kabarcik = Array.from({ length: 40 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 2 + Math.random() * 7, v: 30 + Math.random() * 60 }));
  const baliklar = Array.from({ length: 7 }, (_, i) => ({ y: 200 + i * 70, v: 40 + Math.random() * 70, x: Math.random() * W, yon: i % 2 ? 1 : -1, s: 0.6 + Math.random() * 0.8, renk: [["#FFB347", "#E0742B"], ["#7FD1FF", "#2E6FB0"], ["#FFE066", "#D9A400"], ["#FF8FB1", "#C2457A"]][i % 4] }));
  function balik(ctx, x, y, s, yon, renk, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * yon, s);
    const g = ctx.createLinearGradient(0, -18, 0, 18); g.addColorStop(0, renk[0]); g.addColorStop(1, renk[1]); ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, 0, 34, 17, 0, 0, Math.PI * 2); ctx.fill();
    const k = Math.sin(t * 9) * 6; ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(-52, -16 + k); ctx.lineTo(-52, 16 + k); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(4, -6, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(20, -4, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#123"; ctx.beginPath(); ctx.arc(21, -4, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function deniz(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#5CC6E8"); g.addColorStop(0.5, "#1B7FB3"); g.addColorStop(1, "#0B3E66"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    /* ışık huzmeleri */
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 7; i++) { const x = 150 + i * 230 + Math.sin(t * 0.3 + i) * 40; const gr = ctx.createLinearGradient(0, 0, 0, H * 0.9); gr.addColorStop(0, "rgba(220,250,255,.22)"); gr.addColorStop(1, "rgba(220,250,255,0)"); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 140, H * 0.9); ctx.lineTo(x - 40, H * 0.9); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    /* yüzey dalgası */
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.moveTo(0, 0); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 18 + Math.sin(x / 60 + t * 2) * 6); ctx.lineTo(W, 0); ctx.fill();
    baliklar.forEach((b) => { b.x += b.yon * b.v / 60; if (b.x > W + 80) b.x = -80; if (b.x < -80) b.x = W + 80; balik(ctx, b.x, b.y + Math.sin(t + b.y) * 10, b.s, b.yon, b.renk, t); });
    /* kum */
    const kz = ctx.createLinearGradient(0, ZEMIN, 0, H); kz.addColorStop(0, "#E8D39C"); kz.addColorStop(1, "#B8975B"); ctx.fillStyle = kz; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, ZEMIN + Math.sin(x / 140) * 18 + Math.sin(x / 47) * 5); ctx.lineTo(W, H); ctx.fill();
    /* yosun ve mercan */
    for (let i = 0; i < 16; i++) { const x = Sh.hash(i) * W, b = 120 + Sh.hash(i + 1) * 160, y = ZEMIN + 10 + Sh.hash(i + 2) * 40; ctx.strokeStyle = i % 3 ? "#2F8F5B" : "#4DB37A"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); for (let j = 1; j <= 8; j++) ctx.lineTo(x + Math.sin(t * 1.2 + j * 0.6 + i) * j * 3, y - (b * j) / 8); ctx.stroke(); }
    for (let i = 0; i < 6; i++) { const x = Sh.hash(i + 30) * W, y = ZEMIN + 40; ctx.fillStyle = ["#FF7A6B", "#FFA35C", "#F06292"][i % 3]; for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.ellipse(x + (j - 2) * 14, y - 20 - Math.abs(j - 2) * -8, 9, 30 - Math.abs(j - 2) * 6, (j - 2) * 0.3, 0, Math.PI * 2); ctx.fill(); } }
    kabarcik.forEach((k) => { k.y -= k.v / 60; k.x += Math.sin(t * 2 + k.r) * 0.5; if (k.y < -10) { k.y = H + 10; k.x = Math.random() * W; } ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(k.x, k.y, k.r, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.arc(k.x - k.r * 0.35, k.y - k.r * 0.35, k.r * 0.3, 0, Math.PI * 2); ctx.fill(); });
  }
  /* ---------- Volkan ---------- */
  const kor = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 30 + Math.random() * 80, r: 1 + Math.random() * 3 }));
  function volkan(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2A0F1F"); g.addColorStop(0.5, "#7A2418"); g.addColorStop(1, "#E2592A"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    /* volkan */
    ctx.fillStyle = "#2B1A1A"; ctx.beginPath(); ctx.moveTo(380, ZEMIN); ctx.lineTo(720, 260); ctx.lineTo(880, 260); ctx.lineTo(1240, ZEMIN); ctx.closePath(); ctx.fill();
    const tepe = ctx.createRadialGradient(800, 260, 10, 800, 260, 260); tepe.addColorStop(0, "rgba(255,170,60," + (0.75 + 0.2 * Math.sin(t * 3)) + ")"); tepe.addColorStop(1, "rgba(255,90,30,0)"); ctx.fillStyle = tepe; ctx.beginPath(); ctx.arc(800, 260, 260, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,120,40,.8)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(790, 265); ctx.quadraticCurveTo(770 + Math.sin(t) * 10, 450, 720, ZEMIN); ctx.stroke();
    /* duman */
    for (let i = 0; i < 6; i++) { const yy = ((t * 30 + i * 60) % 360), x = 800 + Math.sin(i + t * 0.3) * 40 + yy * 0.3; ctx.fillStyle = "rgba(60,40,40," + (0.35 * (1 - yy / 360)) + ")"; ctx.beginPath(); ctx.arc(x, 230 - yy, 40 + yy * 0.25, 0, Math.PI * 2); ctx.fill(); }
    /* kayalık zemin ve lav nehri */
    ctx.fillStyle = "#1E1414"; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, ZEMIN - 20 + Sh.hash(x) * 30); ctx.lineTo(W, H); ctx.fill();
    const lv = ctx.createLinearGradient(0, H - 90, 0, H); lv.addColorStop(0, "#FFD166"); lv.addColorStop(0.4, "#FF7A1A"); lv.addColorStop(1, "#B8260F"); ctx.fillStyle = lv; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H - 70 + Math.sin(x / 80 + t * 1.5) * 8); ctx.lineTo(W, H); ctx.fill();
    kor.forEach((k) => { k.y -= k.v / 60; k.x += Math.sin(t * 3 + k.r) * 0.6; if (k.y < -5) { k.y = H; k.x = Math.random() * W; } ctx.fillStyle = "rgba(255," + (150 + Math.floor(k.r * 30)) + ",60," + (0.5 + k.r / 8) + ")"; ctx.beginPath(); ctx.arc(k.x, k.y, k.r, 0, Math.PI * 2); ctx.fill(); });
  }
  /* ---------- Gece ---------- */
  const yildiz = Array.from({ length: 160 }, () => ({ x: Math.random() * W, y: Math.random() * 560, r: Math.random() * 1.8 + 0.3, f: Math.random() * 6 }));
  const atesbocegi = Array.from({ length: 24 }, () => ({ x: Math.random() * W, y: 500 + Math.random() * 300, f: Math.random() * 6 }));
  function gece(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, ZEMIN); g.addColorStop(0, "#070B24"); g.addColorStop(0.6, "#1B2A5C"); g.addColorStop(1, "#3D4F86"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    yildiz.forEach((s) => { ctx.fillStyle = "rgba(255,255,255," + (0.5 + 0.5 * Math.sin(t * 2 + s.f)) + ")"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); });
    const ay = ctx.createRadialGradient(1280, 150, 10, 1280, 150, 160); ay.addColorStop(0, "rgba(255,250,225,1)"); ay.addColorStop(0.3, "rgba(255,245,210,.9)"); ay.addColorStop(0.32, "rgba(255,245,210,.25)"); ay.addColorStop(1, "rgba(255,245,210,0)"); ctx.fillStyle = ay; ctx.beginPath(); ctx.arc(1280, 150, 160, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(200,195,170,.35)"; [[1265, 140, 9], [1295, 168, 6], [1300, 128, 5]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
    [[560, 160, "#1F2D52", 3.1], [640, 110, "#16223F", 6.2]].forEach(([taban, gen, r, tohum]) => { ctx.fillStyle = r; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 14) ctx.lineTo(x, taban - gen * (0.55 + 0.25 * Math.sin(x / 260 + tohum) + 0.2 * Math.sin(x / 113 + tohum * 2.3))); ctx.lineTo(W, H); ctx.fill(); });
    ctx.fillStyle = "#0F1830"; ctx.fillRect(0, ZEMIN, W, H);
    atesbocegi.forEach((a, i) => { const x = a.x + Math.sin(t * 0.6 + a.f) * 40, y = a.y + Math.cos(t * 0.8 + a.f) * 20, p = 0.5 + 0.5 * Math.sin(t * 3 + a.f); const gg = ctx.createRadialGradient(x, y, 0, x, y, 14); gg.addColorStop(0, "rgba(230,255,140," + p + ")"); gg.addColorStop(1, "rgba(230,255,140,0)"); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill(); });
  }
  /* ---------- Çayır (tavşanlı) ---------- */
  function cayir(ctx, t, m) {
    Sh.gok(ctx, t, 0, ZEMIN); Sh.tepeler(ctx, 0, ZEMIN); Sh.zemin(ctx, 0, t, ZEMIN); Sh.cicekler(ctx, 0, t, ZEMIN);
    Sh.kelebek(ctx, ((t * 50 + 200) % (W + 300)) - 150, 360 + Math.sin(t * 0.9) * 60, t);
    Sh.onPlan(ctx, 0, t);
  }
  const CIZ = { cayir, kutup, deniz, volkan, gece };

  /* Arka planı kur: kap içeriğin arkasında; dönen nesne tepki(ok) verir */
  Sh.arkaPlan = (kap, tema) => {
    const cv = T.h("canvas.oy-arka", { "aria-hidden": "true" }); kap.prepend(cv);
    const ctx = cv.getContext("2d"), P = Sh.parcacik();
    const m = { x: 150, y: ZEMIN + 80, sq: 1, kirp: 0, sonKirp: 3, mutlu: 0, kulak: 0, zip: 0 };
    let son = performance.now(), zaman = 0, i = 0;
    const azalt = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dongu = (z) => {
      if (!cv.isConnected) return;
      const dt = Math.min(0.05, (z - son) / 1000); son = z; zaman += azalt ? dt * 0.15 : dt;
      if (i++ % 20 === 0) { const r = kap.getBoundingClientRect(), d = Math.min(1.5, window.devicePixelRatio || 1); const w = Math.round(r.width * d), hh = Math.round(r.height * d); if (w && (cv.width !== w || cv.height !== hh)) { cv.width = w; cv.height = hh; } }
      m.sonKirp -= dt; m.kirp = m.sonKirp < 0 ? 1 : 0; if (m.sonKirp < -0.13) m.sonKirp = 2 + Math.random() * 3;
      m.mutlu *= 0.985; m.kulak *= 0.97;
      if (m.zip > 0) { m.zip -= dt; const p = 1 - m.zip / 0.6; m.y = ZEMIN + 80 - Math.sin(Math.min(1, p) * Math.PI) * 120; m.sq = 1 + 0.12 * Math.sin(p * Math.PI); if (m.zip <= 0) { m.y = ZEMIN + 80; m.sq = 0.8; P.toz(m.x, ZEMIN + 80); } } else m.sq += (1 - m.sq) * Math.min(1, dt * 10);
      P.guncelle(dt);
      const sc = Math.max(cv.width / W, cv.height / H), ox = (cv.width - W * sc) / 2, oy = cv.height - H * sc;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#9DD0F5"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.setTransform(sc, 0, 0, sc, ox, oy);
      (CIZ[tema] || cayir)(ctx, zaman, m); P.ciz(ctx); Sh.vinyet(ctx);
      requestAnimationFrame(dongu);
    };
    requestAnimationFrame((z) => { son = z; dongu(z); });
    return {
      tepki(ok) {
        if (ok) { m.mutlu = 1; m.zip = 0.6; Sh.ses.dogru(); P.kutla(W / 2, 420); }
        else { m.kulak = 0.5; Sh.ses.yanlis(); }
      },
    };
  };
})();
