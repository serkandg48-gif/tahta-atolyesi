/* Ortak sahne motoru: oyunların gerçekçi canvas sahnesi.
   Mantıksal çözünürlük 1600×900; ekrana göre ölçeklenir. Gökyüzü, güneş ışınları, bulut, sisli tepeler, ağaçlar,
   dokulu çimen, ön plan otları, çiçek, kelebek, nehir taşı, parçacıklar, WebAudio sesleri, takım skoru. */
(function () {
  const W = 1600, H = 900;
  const S = (T.Sahne = { W, H });
  S.hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  S.rnd = (a, b) => a + Math.random() * (b - a);
  S.ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  S.lerp = (a, b, t) => a + (b - a) * t;
  S.sprite = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); return c; };

  /* ---------- Ses ---------- */
  let AC = null;
  S.ac = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) {} return AC; };
  S.ton = (f0, f1, sure, tip = "sine", ses = 0.18, gecik = 0) => {
    const a = S.ac(); if (!a) return; const st = T.store.get().settings || {}; if (st.sessiz || st.sound === false) return;
    const t = a.currentTime + gecik, o = a.createOscillator(), g = a.createGain();
    o.type = tip; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + sure);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(ses, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + sure + 0.05);
  };
  S.gurultu = (sure, ses = 0.08, filtre = 900, gecik = 0) => {
    const a = S.ac(); if (!a) return; const n = Math.floor(a.sampleRate * sure), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); f.type = "lowpass"; f.frequency.value = filtre; g.gain.value = ses;
    s.buffer = b; s.connect(f).connect(g).connect(a.destination); s.start(a.currentTime + gecik);
  };
  S.ses = {
    zipla: () => { S.ton(240, 560, 0.2, "sine", 0.14); S.gurultu(0.12, 0.04, 2500); },
    kon: () => { S.gurultu(0.18, 0.09, 600); S.ton(150, 80, 0.12, "sine", 0.1); },
    dogru: () => [523, 659, 784, 1047].forEach((f, i) => { S.ton(f, f, 0.42, "triangle", 0.12, i * 0.085); S.ton(f * 2, f * 2, 0.3, "sine", 0.03, i * 0.085); }),
    yanlis: () => { S.ton(330, 247, 0.28, "sine", 0.11); S.ton(262, 196, 0.34, "sine", 0.09, 0.2); },
    tik: () => S.ton(1100, 800, 0.05, "square", 0.035),
    pop: () => S.ton(500, 1200, 0.08, "sine", 0.12),
    hisirti: () => S.gurultu(0.35, 0.05, 1800),
  };

  /* ---------- Sahne kurulumu ---------- */
  S.olustur = (host, ad) => {
    const kap = T.h("div.sh-kap"), cv = T.h("canvas.sh-cv", { width: W, height: H, "aria-label": ad || "Oyun sahnesi" }), ust = T.h("div.sh-ust");
    kap.append(cv, ust); host.append(kap);
    const ctx = cv.getContext("2d");
    const boyut = () => { const r = cv.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1); const w = Math.max(320, Math.round(r.width * dpr)); if (w && cv.width !== w) { cv.width = w; cv.height = Math.round((w * H) / W); } };
    const nokta = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };
    const sh = { kap, cv, ctx, ust, boyut, nokta, zaman: 0,
      tamEkran: () => { try { (kap.requestFullscreen || kap.webkitRequestFullscreen).call(kap); } catch (e) {} },
      baslat(adimFn, cizFn) {
        let son = performance.now(), say = 0;
        const d = (z) => { if (!cv.isConnected) return; const dt = Math.min(0.05, (z - son) / 1000); son = z; sh.zaman += dt; if (say++ % 30 === 0) boyut(); adimFn(dt); const sc = cv.width / W; ctx.setTransform(sc, 0, 0, sc, 0, 0); cizFn(ctx); requestAnimationFrame(d); };
        requestAnimationFrame((z) => { son = z; boyut(); d(z); });
      } };
    cv.addEventListener("pointerdown", () => S.ac(), { capture: true });
    return sh;
  };

  /* ---------- Gökyüzü ---------- */
  S.gok = (ctx, t, kamX, ufuk = 640) => {
    const g = ctx.createLinearGradient(0, 0, 0, ufuk); g.addColorStop(0, "#5DA9E9"); g.addColorStop(0.55, "#9DD0F5"); g.addColorStop(1, "#E4F3FB");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const gx = 1330 - kamX * 0.02, gy = 150;
    /* ışınlar */
    ctx.save(); ctx.translate(gx, gy); ctx.rotate(t * 0.02); ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 14; i++) { ctx.rotate((Math.PI * 2) / 14); const gr = ctx.createLinearGradient(0, 0, 700, 0); gr.addColorStop(0, "rgba(255,245,200,.16)"); gr.addColorStop(1, "rgba(255,245,200,0)"); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(700, -36 - 18 * S.hash(i)); ctx.lineTo(700, 36 + 18 * S.hash(i + 4)); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    const gn = ctx.createRadialGradient(gx, gy, 0, gx, gy, 220); gn.addColorStop(0, "rgba(255,255,240,1)"); gn.addColorStop(0.18, "rgba(255,248,205,1)"); gn.addColorStop(0.4, "rgba(255,236,160,.45)"); gn.addColorStop(1, "rgba(255,236,160,0)");
    ctx.fillStyle = gn; ctx.beginPath(); ctx.arc(gx, gy, 220, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 7; i++) { const sp = 8 + i * 2.5, bx = (((i * 390 + t * sp - kamX * (0.05 + i * 0.01)) % (W + 600)) + W + 600) % (W + 600) - 300; S.bulut(ctx, bx, 70 + S.hash(i) * 190, 0.7 + S.hash(i + 9) * 0.8, i); }
  };
  const BULUT = [];
  S.bulut = (ctx, x, y, s, tohum) => {
    if (!BULUT[tohum % 4]) BULUT[tohum % 4] = S.sprite(520, 240, (c) => {
      const tl = [];
      for (let i = 0; i < 16; i++) tl.push([90 + S.hash(i + tohum * 13) * 330, 120 + (S.hash(i * 3 + tohum) - 0.5) * 70 - Math.sin((i / 16) * Math.PI) * 30, 40 + S.hash(i * 7 + tohum) * 50]);
      tl.forEach(([x0, y0, r]) => { const g = c.createRadialGradient(x0 - r * 0.3, y0 - r * 0.4, r * 0.1, x0, y0, r); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.7, "rgba(248,251,255,.95)"); g.addColorStop(1, "rgba(220,232,245,0)"); c.fillStyle = g; c.beginPath(); c.arc(x0, y0, r, 0, Math.PI * 2); c.fill(); });
      const alt = c.createLinearGradient(0, 120, 0, 200); alt.addColorStop(0, "rgba(180,200,225,0)"); alt.addColorStop(1, "rgba(170,190,220,.35)"); c.globalCompositeOperation = "source-atop"; c.fillStyle = alt; c.fillRect(0, 0, 520, 240);
    });
    ctx.drawImage(BULUT[tohum % 4], x - 260 * s, y - 120 * s, 520 * s, 240 * s);
  };

  /* ---------- Tepeler ve ağaçlar ---------- */
  const tepeY = (wx, taban, gen, tohum) => taban - gen * (0.55 + 0.25 * Math.sin(wx / 260 + tohum) + 0.2 * Math.sin(wx / 113 + tohum * 2.3));
  const agac = (ctx, x, y, s, renk, koyu) => {
    ctx.fillStyle = koyu; ctx.fillRect(x - 3 * s, y - 18 * s, 6 * s, 20 * s);
    [[0, -40, 22], [-12, -30, 16], [12, -30, 16], [0, -56, 15]].forEach(([dx, dy, r], i) => { const g = ctx.createRadialGradient(x + dx * s - r * s * 0.4, y + dy * s - r * s * 0.4, 1, x + dx * s, y + dy * s, r * s); g.addColorStop(0, renk); g.addColorStop(1, koyu); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); ctx.fill(); });
  };
  S.tepeler = (ctx, kamX, ufuk = 640) => {
    const kat = [[0.12, ufuk - 170, 170, "#B9D9C8", "#D6EBDF", 1.3, 0.6, "#A6CDB6", "#8FB9A1"], [0.3, ufuk - 100, 150, "#88C08C", "#AEDAA9", 4.1, 0.8, "#6FAE6F", "#4E8B52"], [0.55, ufuk - 40, 110, "#5FA85C", "#7FC173", 7.7, 1.1, "#4F9848", "#2F6B32"]];
    kat.forEach(([oran, taban, gen, r1, r2, tohum, as, ar, ak], k) => {
      const g = ctx.createLinearGradient(0, taban - gen, 0, ufuk + 40); g.addColorStop(0, r1); g.addColorStop(1, r2);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 12) ctx.lineTo(x, tepeY(x + kamX * oran, taban, gen, tohum));
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      const ilk = Math.floor((kamX * oran) / 90);
      for (let i = ilk - 1; i < ilk + W / 90 + 2; i++) { if (S.hash(i * 1.7 + k * 11) < 0.62) continue; const wx = i * 90 + S.hash(i + k) * 60, x = wx - kamX * oran; agac(ctx, x, tepeY(wx, taban, gen, tohum) + 6, as * (0.7 + S.hash(i * 3 + k) * 0.6), ar, ak); }
      /* sis */
      const sis = ctx.createLinearGradient(0, taban - 20, 0, taban + gen); sis.addColorStop(0, "rgba(230,244,250,0)"); sis.addColorStop(1, "rgba(230,244,250," + (0.35 - k * 0.1) + ")"); ctx.fillStyle = sis; ctx.fillRect(0, taban - 20, W, gen + 60);
    });
  };

  /* ---------- Zemin ---------- */
  let CIM_DOKU = null;
  S.zemin = (ctx, kamX, t, ufuk = 640) => {
    if (!CIM_DOKU) CIM_DOKU = ctx.createPattern(S.sprite(256, 256, (c) => { c.fillStyle = "#5FAE4E"; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 2600; i++) { const x = Math.random() * 256, y = Math.random() * 256; c.strokeStyle = ["rgba(40,100,35,.35)", "rgba(140,200,100,.35)", "rgba(80,150,60,.4)", "rgba(200,220,120,.2)"][i % 4]; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (Math.random() - 0.5) * 3, y - 3 - Math.random() * 5); c.stroke(); } }), "repeat");
    ctx.save(); ctx.beginPath(); ctx.moveTo(0, ufuk - 30); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, ufuk - 30 + Math.sin((x + kamX) / 60) * 5); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.clip();
    ctx.translate(-(kamX % 256), 0); ctx.fillStyle = CIM_DOKU; ctx.fillRect(0, ufuk - 50, W + 256, H); ctx.translate(kamX % 256, 0);
    const g = ctx.createLinearGradient(0, ufuk - 40, 0, H); g.addColorStop(0, "rgba(160,220,120,.35)"); g.addColorStop(0.4, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(10,50,15,.45)"); ctx.fillStyle = g; ctx.fillRect(0, ufuk - 50, W, H);
    ctx.restore();
    /* arka ot öbekleri */
    const ilk = Math.floor(kamX / 26);
    for (let i = ilk - 1; i < ilk + W / 26 + 2; i++) { const wx = i * 26 + S.hash(i) * 20, x = wx - kamX, y = ufuk - 30 + S.hash(i + 2) * 10; S.ot(ctx, x, y, t, 14 + S.hash(i + 5) * 16, S.hash(i + 8), 0.75); }
  };
  S.ot = (ctx, x, y, t, boy, tohum, aci = 1) => {
    const n = 3 + Math.floor(tohum * 3);
    for (let j = 0; j < n; j++) {
      const sal = Math.sin(t * 1.8 + x * 0.03 + j) * 4 * aci, dx = (j - n / 2) * 3, b = boy * (0.7 + S.hash(tohum * 50 + j) * 0.5);
      ctx.strokeStyle = j % 2 ? "#3F8C35" : "#6DBA4F"; ctx.lineWidth = 2.4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.quadraticCurveTo(x + dx + sal * 0.5, y - b * 0.6, x + dx + sal + (j - n / 2) * 2, y - b); ctx.stroke();
    }
  };
  S.onPlan = (ctx, kamX, t) => {
    const ilk = Math.floor((kamX * 1.25) / 34);
    for (let i = ilk - 1; i < ilk + W / 34 + 2; i++) {
      const x = i * 34 + S.hash(i + 40) * 26 - kamX * 1.25, y = H + 6, b = 40 + S.hash(i + 41) * 50;
      for (let j = 0; j < 5; j++) { const sal = Math.sin(t * 1.5 + i + j * 0.7) * 6; ctx.strokeStyle = ["#2E6B28", "#3D8433", "#24591F"][j % 3]; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + j * 5, y); ctx.quadraticCurveTo(x + j * 5 + sal * 0.4, y - b * 0.6, x + j * 5 + sal + (j - 2) * 6, y - b); ctx.stroke(); }
    }
  };

  /* ---------- Çiçek, kelebek ---------- */
  S.cicek = (ctx, x, y, t, renk, boy) => {
    const sal = Math.sin(t * 1.6 + x * 0.05) * 0.1;
    ctx.save(); ctx.translate(x, y); ctx.rotate(sal);
    ctx.strokeStyle = "#3A7F33"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(5, -boy / 2, 0, -boy); ctx.stroke();
    ctx.fillStyle = "#4C9A40"; ctx.beginPath(); ctx.ellipse(6, -boy * 0.4, 8, 3.5, -0.6, 0, Math.PI * 2); ctx.fill();
    ctx.translate(0, -boy);
    for (let i = 0; i < 6; i++) { ctx.rotate((Math.PI * 2) / 6); const g = ctx.createLinearGradient(0, 0, 0, -16); g.addColorStop(0, renk[1]); g.addColorStop(1, renk[0]); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, -8, 5, 9, 0, 0, Math.PI * 2); ctx.fill(); }
    const m = ctx.createRadialGradient(-1, -1, 0, 0, 0, 6); m.addColorStop(0, "#FFE680"); m.addColorStop(1, "#D99A1B"); ctx.fillStyle = m; ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };
  S.CICEK_RENK = [["#FF8FB1", "#E0457B"], ["#FFFFFF", "#D9DDE8"], ["#C9A7FF", "#7F52D9"], ["#FFD08A", "#F08A24"], ["#9ED4FF", "#3E86D6"]];
  S.cicekler = (ctx, kamX, t, ufuk = 640) => {
    const ilk = Math.floor(kamX / 64) - 1;
    for (let i = ilk; i < ilk + W / 64 + 3; i++) { if (S.hash(i) < 0.5) continue; const wx = i * 64 + S.hash(i + 3) * 40; S.cicek(ctx, wx - kamX, ufuk - 40 - S.hash(i + 5) * 12, t, S.CICEK_RENK[Math.floor(S.hash(i + 7) * 5)], 22 + S.hash(i + 1) * 24); }
  };
  S.kelebek = (ctx, x, y, t, renk = ["#FFB347", "#E0742B"]) => {
    const kanat = Math.abs(Math.sin(t * 14)) * 0.85 + 0.15;
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * 0.2);
    [-1, 1].forEach((yan) => { ctx.save(); ctx.scale(yan * kanat, 1); const g = ctx.createRadialGradient(8, -6, 1, 10, -4, 16); g.addColorStop(0, renk[0]); g.addColorStop(1, renk[1]); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(10, -6, 12, 9, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(8, 6, 8, 6, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.arc(13, -8, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
    ctx.fillStyle = "#3B2A20"; ctx.beginPath(); ctx.ellipse(0, 0, 2.5, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#3B2A20"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(-5, -16); ctx.moveTo(0, -9); ctx.lineTo(5, -16); ctx.stroke(); ctx.restore();
  };

  /* ---------- Nehir taşı ---------- */
  const TAS = {};
  S.tas = (ctx, x, y, n, durum = 0, t = 0, buyuk = 1) => {
    const k = durum + ":" + Math.round(buyuk * 10);
    if (!TAS[k]) {
      const renk = [["#D9D2C7", "#9C9285", "#6E665B"], ["#FFE7A3", "#E3B241", "#9E7516"], ["#D4F2C2", "#69B85A", "#36782B"], ["#D9E8F7", "#8EAFD4", "#516F95"]][durum];
      TAS[k] = S.sprite(160, 90, (c) => {
        c.translate(80, 40); c.scale(buyuk, buyuk);
        c.fillStyle = renk[2]; c.beginPath(); c.ellipse(0, 10, 60, 26, 0, 0, Math.PI * 2); c.fill();
        const g = c.createRadialGradient(-20, -12, 4, 0, 0, 66); g.addColorStop(0, renk[0]); g.addColorStop(0.7, renk[1]); g.addColorStop(1, renk[2]);
        c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 60, 22, 0, 0, Math.PI * 2); c.fill();
        c.save(); c.clip(); for (let i = 0; i < 260; i++) { c.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.14)" : "rgba(40,30,20,.12)"; c.beginPath(); c.arc((Math.random() - 0.5) * 120, (Math.random() - 0.5) * 44, Math.random() * 1.8 + 0.4, 0, Math.PI * 2); c.fill(); }
        if (durum === 0) { c.fillStyle = "rgba(90,140,60,.5)"; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(-50 + Math.random() * 30, 6 + Math.random() * 12, Math.random() * 4 + 1, 0, Math.PI * 2); c.fill(); } }
        c.restore();
        c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 2; c.beginPath(); c.ellipse(-8, -6, 40, 11, 0, Math.PI * 1.05, Math.PI * 1.75); c.stroke();
      });
    }
    ctx.fillStyle = "rgba(20,45,15,.32)"; ctx.beginPath(); ctx.ellipse(x + 6, y + 22, 64 * buyuk, 14 * buyuk, 0, 0, Math.PI * 2); ctx.fill();
    ctx.drawImage(TAS[k], x - 80, y - 40);
    if (durum === 1) { ctx.strokeStyle = "rgba(255,210,80," + (0.45 + 0.45 * Math.sin(t * 6)) + ")"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, 70, 30, 0, 0, Math.PI * 2); ctx.stroke(); }
    if (n != null) S.yazi(ctx, String(n), x, y + 58, 40);
  };

  /* ---------- Yazı ---------- */
  S.yazi = (ctx, m, x, y, boy, renk = "#fff", kenar = "rgba(25,35,55,.6)") => {
    ctx.save(); ctx.font = "800 " + boy + "px Nunito, 'Baloo 2', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    ctx.lineWidth = boy * 0.18; ctx.strokeStyle = kenar; ctx.strokeText(m, x, y); ctx.fillStyle = renk; ctx.fillText(m, x, y); ctx.restore();
  };

  /* ---------- Parçacıklar ---------- */
  S.parcacik = () => {
    let L = [];
    const P = {
      toz(x, y, n = 12) { for (let i = 0; i < n; i++) L.push({ x: x + S.rnd(-34, 34), y: y - 4, vx: S.rnd(-110, 110), vy: S.rnd(-80, -15), r: S.rnd(6, 14), omur: S.rnd(0.5, 0.9), tur: "toz", t: 0 }); },
      kutla(x, y, n = 56) { const R = ["#FFD447", "#FF8A5B", "#7FD1FF", "#B98CFF", "#7EE08A", "#FFFFFF"]; for (let i = 0; i < n; i++) { const a = S.rnd(0, Math.PI * 2), v = S.rnd(240, 620); L.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 280, r: S.rnd(7, 14), omur: S.rnd(1.1, 1.9), tur: i % 3 ? "yildiz" : "konfeti", renk: R[i % 6], d: S.rnd(0, 6), t: 0 }); } },
      damla(x, y, n = 14) { for (let i = 0; i < n; i++) L.push({ x, y, vx: S.rnd(-160, 160), vy: S.rnd(-380, -160), r: S.rnd(4, 8), omur: S.rnd(0.6, 1), tur: "damla", t: 0 }); },
      guncelle(dt) { L.forEach((q) => { q.t += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += (q.tur === "toz" ? 50 : 760) * dt; q.vx *= q.tur === "toz" ? 0.93 : 0.992; }); L = L.filter((q) => q.t < q.omur); },
      ciz(ctx) {
        L.forEach((p) => {
          const a = Math.max(0, 1 - p.t / p.omur); ctx.save(); ctx.globalAlpha = a;
          if (p.tur === "toz") { const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (1 + p.t * 1.6)); g.addColorStop(0, "rgba(230,215,190,.9)"); g.addColorStop(1, "rgba(230,215,190,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + p.t * 1.6), 0, Math.PI * 2); ctx.fill(); }
          else if (p.tur === "damla") { ctx.fillStyle = "rgba(180,225,255,.9)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
          else { ctx.translate(p.x, p.y); ctx.rotate(p.d + p.t * 7); ctx.fillStyle = p.renk; ctx.shadowColor = p.renk; ctx.shadowBlur = 8; ctx.beginPath(); if (p.tur === "konfeti") ctx.rect(-p.r * 0.5, -p.r * 0.25, p.r, p.r * 0.5); else for (let k = 0; k < 10; k++) { const rr = k % 2 ? p.r * 0.45 : p.r, aa = (k / 10) * Math.PI * 2; ctx.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } ctx.fill(); }
          ctx.restore();
        });
      },
    };
    return P;
  };
  S.vinyet = (ctx) => { const vg = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.45, W / 2, H / 2, H * 1.05); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(10,30,10,.22)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); };

  /* ---------- Takım skoru (DOM) ---------- */
  S.skor = (kap, durum) => {
    if (!durum.takim) return kap.replaceChildren(T.h("div.sh-takim.tek", T.h("b", String(durum.puan[0] + durum.puan[1])), durum.simge || "⭐"));
    kap.replaceChildren(...["Mavi takım", "Turuncu takım"].map((ad, i) => T.h("div.sh-takim.t" + i + (durum.sira === i ? ".sirada" : ""), T.h("span", ad), T.h("b", String(durum.puan[i])), T.h("i", durum.simge || "⭐"))));
  };
})();
