/* Bilgi arısı (gerçekçi sürüm): işlem akıcılığı. Arı doğru cevabın yazdığı çiçeğe uçar ve bal toplar.
   Süre bir kum saati gibi azalır; yanlış çiçek kapanır. */
(function () {
  const Sh = T.Sahne, W = Sh.W, H = Sh.H, ZEMIN = 700, rnd = Sh.rnd;
  let ASP = null;
  const ariSp = () => ASP || (ASP = Sh.sprite(220, 160, (c) => {
    c.translate(110, 90);
    const tuy = (cx, cy, rx, ry, renk) => { for (let i = 0; i < rx * ry * 0.9; i++) { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()), x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r; c.strokeStyle = renk[Math.floor(Math.random() * renk.length)]; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 3, y + Math.sin(a) * 3); c.stroke(); } };
    /* karın: sarı-siyah bantlar */
    const k = new Path2D(); k.ellipse(-26, 6, 52, 38, 0.15, 0, Math.PI * 2);
    c.save(); c.clip(k); const g = c.createRadialGradient(-36, -10, 4, -26, 6, 60); g.addColorStop(0, "#FFE27A"); g.addColorStop(1, "#D69A12"); c.fillStyle = g; c.fillRect(-90, -40, 130, 90);
    c.fillStyle = "#231A10"; [-52, -26, 0].forEach((x) => { c.beginPath(); c.ellipse(x, 6, 9, 44, 0.15, 0, Math.PI * 2); c.fill(); }); c.restore();
    tuy(-26, 6, 50, 36, ["rgba(255,230,140,.35)", "rgba(30,20,10,.3)"]);
    c.fillStyle = "#1A120A"; c.beginPath(); c.moveTo(-76, 10); c.lineTo(-92, 14); c.lineTo(-74, 18); c.fill();
    /* göğüs */
    const go = c.createRadialGradient(28, -4, 2, 30, 0, 30); go.addColorStop(0, "#E9B43A"); go.addColorStop(1, "#5A3C12"); c.fillStyle = go; c.beginPath(); c.ellipse(30, 0, 28, 26, 0, 0, Math.PI * 2); c.fill(); tuy(30, 0, 27, 25, ["rgba(255,220,120,.5)", "rgba(60,40,10,.4)"]);
    /* baş */
    const b = c.createRadialGradient(58, -6, 2, 62, 0, 24); b.addColorStop(0, "#4A3518"); b.addColorStop(1, "#130C05"); c.fillStyle = b; c.beginPath(); c.ellipse(64, 2, 22, 21, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#0B0703"; c.beginPath(); c.ellipse(72, -4, 9, 12, 0.2, 0, Math.PI * 2); c.fill(); c.fillStyle = "rgba(255,255,255,.75)"; c.beginPath(); c.arc(75, -8, 3, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#1A120A"; c.lineWidth = 2.5; c.lineCap = "round"; c.beginPath(); c.moveTo(66, -18); c.quadraticCurveTo(74, -44, 88, -46); c.moveTo(60, -18); c.quadraticCurveTo(62, -46, 74, -54); c.stroke();
    /* bacaklar */
    c.strokeStyle = "#2A1C0C"; c.lineWidth = 3; [[16, 22, 6, 46], [30, 24, 26, 50], [44, 20, 50, 44]].forEach(([x1, y1, x2, y2]) => { c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo((x1 + x2) / 2 - 8, y2 - 6, x2, y2); c.stroke(); });
  }));
  function ari(ctx, x, y, t, yon = 1, olcek = 0.8) {
    ctx.save(); ctx.translate(x, y); ctx.scale(yon * olcek, olcek); ctx.rotate(Math.sin(t * 5) * 0.06);
    const k = Math.sin(t * 60) * 0.5 + 0.5;
    [[-1, 0.55], [1, 1]].forEach(([s, a]) => { ctx.save(); ctx.translate(18, -20); ctx.rotate(-0.4 - k * 0.7 * a); const g = ctx.createLinearGradient(0, 0, -20, -70); g.addColorStop(0, "rgba(230,245,255,.65)"); g.addColorStop(1, "rgba(200,230,255,.25)"); ctx.fillStyle = g; ctx.strokeStyle = "rgba(120,150,180,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(-14, -36, 20 * a + 6, 40 * a + 4, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); });
    ctx.drawImage(ariSp(), -110, -90);
    ctx.restore();
  }
  function cicekBuyuk(ctx, x, y, t, renk, acik, metin, durum) {
    const sal = Math.sin(t * 1.2 + x) * 0.04;
    ctx.save(); ctx.translate(x, ZEMIN + 40);
    ctx.strokeStyle = "#3B7F31"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(14, (y - ZEMIN - 40) / 2, Math.sin(t + x) * 6, y - ZEMIN - 40); ctx.stroke();
    ctx.fillStyle = "#4C9A40"; ctx.beginPath(); ctx.ellipse(26, (y - ZEMIN - 40) * 0.45, 34, 12, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(-24, (y - ZEMIN - 40) * 0.65, 30, 11, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.translate(x + Math.sin(t + x) * 6, y); ctx.rotate(sal);
    const n = 12, ac = 0.35 + 0.65 * acik;
    for (let i = 0; i < n; i++) { ctx.save(); ctx.rotate((i / n) * Math.PI * 2); ctx.scale(1, ac); const g = ctx.createLinearGradient(0, -20, 0, -100); g.addColorStop(0, renk[1]); g.addColorStop(1, renk[0]); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, -62, 22, 44, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, -98); ctx.stroke(); ctx.restore(); }
    const m = ctx.createRadialGradient(-10, -10, 4, 0, 0, 52); m.addColorStop(0, durum === "dogru" ? "#FFF1A8" : "#FFD24A"); m.addColorStop(1, "#C98A12"); ctx.fillStyle = m; ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(120,70,10,.25)"; for (let i = 0; i < 40; i++) { const a = i * 2.4, r = Math.sqrt(i) * 7; ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2, 0, Math.PI * 2); ctx.fill(); }
    if (durum === "dogru") { ctx.strokeStyle = "rgba(90,220,120,.95)"; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, 0, 56 + Math.sin(t * 8) * 4, 0, Math.PI * 2); ctx.stroke(); }
    Sh.yazi(ctx, String(metin), 0, 2, String(metin).length > 3 ? 36 : 46, "#3A2208", "rgba(255,255,255,.75)");
    ctx.restore();
  }
  function kavanoz(ctx, x, y, dolu) {
    ctx.save(); ctx.translate(x, y);
    const g = ctx.createLinearGradient(-40, 0, 40, 0); g.addColorStop(0, "rgba(255,255,255,.35)"); g.addColorStop(0.5, "rgba(255,255,255,.12)"); g.addColorStop(1, "rgba(255,255,255,.35)");
    const yuk = 90 * Math.min(1, dolu); const bal = ctx.createLinearGradient(0, 50 - yuk, 0, 50); bal.addColorStop(0, "#FFC23A"); bal.addColorStop(1, "#C77708");
    ctx.fillStyle = bal; ctx.fillRect(-36, 50 - yuk, 72, yuk);
    ctx.fillStyle = g; ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.rect(-38, -44, 76, 96); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#B5342A"; ctx.fillRect(-42, -56, 84, 16); ctx.restore();
  }

  const OYUN = T.tools["oyun-bilgi-arisi"]; if (!OYUN) return;
  OYUN.render = function (host) {
    const g = T.store.grade(); let L = g <= 1 ? 0 : g <= 3 ? 1 : 2;
    const D = { takim: true, puan: [0, 0], sira: 0, simge: "🍯" };
    const sh = Sh.olustur(host, "Bilgi arısı sahnesi"), P = Sh.parcacik();
    const afis = T.h("div.tv-afis"), skor = T.h("div.tv-skor"), alt = T.h("div.tv-alt"); sh.ust.append(afis, skor, alt);
    const ayar = T.h("div.row.tv-ayar"); host.append(ayar);
    const CX = [330, 650, 970, 1290], CY = [470, 430, 450, 420];
    const RENK = [["#FF8FB1", "#E0457B"], ["#C9A7FF", "#7F52D9"], ["#9ED4FF", "#3E86D6"], ["#FFFFFF", "#E2E6EE"]];
    let R = null, durum = "soru", sec = -1, sure = 0, toplamSure = 12, acik = [1, 1, 1, 1], bal = [0, 0];
    const a_ = { x: 800, y: 330, yon: 1, ucus: null };
    const yeni = () => {
      const op = L === 0 ? T.pick(["+", "−"]) : L === 1 ? T.pick(["+", "−", "+"]) : T.pick(["×", "×", "+", "−"]); let a, b, ans;
      if (op === "+") { a = Math.floor(rnd(0, L ? 51 : 11)); b = Math.floor(rnd(0, L ? 50 : 11 - a)); ans = a + b; } else if (op === "−") { a = Math.floor(rnd(L ? 10 : 2, L ? 100 : 11)); b = Math.floor(rnd(0, a + 1)); ans = a - b; } else { a = Math.floor(rnd(2, 11)); b = Math.floor(rnd(2, 11)); ans = a * b; }
      const o = new Set([ans]); let d = 0; while (o.size < 4 && d++ < 100) { const v = ans + Math.floor(rnd(-(op === "×" ? 6 : 3), (op === "×" ? 6 : 3) + 1)); if (v >= 0) o.add(v); }
      const opts = T.shuffle([...o]);
      R = { a, b, op, ans, opts, cevap: opts.indexOf(ans) }; durum = "soru"; sec = -1; acik = [1, 1, 1, 1]; toplamSure = [12, 9, 7][L]; sure = toplamSure; ciz();
    };
    const ciz = () => {
      afis.replaceChildren(T.h("div.ar-soru", R.a + " " + R.op + " " + R.b), durum === "bitti" ? T.h("div.tv-soru", sec === R.cevap ? "Bal toplandı! " + R.a + " " + R.op + " " + R.b + " = " + R.ans : (sec < 0 ? "Süre bitti. " : "") + "Doğrusu " + R.ans) : null);
      Sh.skor(skor, D);
      alt.replaceChildren(durum === "soru" ? T.h("div.tv-ipucu", (D.takim ? (D.sira ? "Turuncu" : "Mavi") + " takım: " : "") + "arıyı doğru çiçeğe gönder") : null,
        durum === "bitti" ? T.h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (D.takim) D.sira = 1 - D.sira; yeni(); } }, "Sonraki") : null);
      ayar.replaceChildren(T.h("div.seg", [[0, "10'a kadar + −"], [1, "100'e kadar + −"], [2, "Çarpma da"]].map(([k, l]) => T.h("button", { "aria-pressed": String(L === k), onclick: () => { L = k; yeni(); } }, l))),
        T.h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([k, l]) => T.h("button", { "aria-pressed": String(D.takim === k), onclick: () => { D.takim = k; ciz(); } }, l))),
        T.h("div.spacer"), T.h("button.btn.sm.c-chalk", { onclick: () => { D.puan = [0, 0]; bal = [0, 0]; ciz(); } }, T.icon("reset"), "Skoru sıfırla"), T.h("button.btn.sm.c-chalk", { onclick: sh.tamEkran }, T.icon("full"), "Tam ekran"));
    };
    const bitir = () => {
      durum = "bitti";
      if (sec === R.cevap) { Sh.ses.dogru(); P.kutla(CX[sec], CY[sec]); const tk = D.takim ? D.sira : 0; D.puan[tk]++; bal[tk] = Math.min(1, bal[tk] + 0.1); }
      else { Sh.ses.yanlis(); if (sec >= 0) acik[sec] = 0; }
      ciz();
    };
    sh.cv.addEventListener("pointerdown", (e) => {
      if (durum !== "soru") return; const n = sh.nokta(e);
      const i = CX.findIndex((x, k) => Math.hypot(n.x - x, n.y - CY[k]) < 120); if (i < 0) return;
      sec = i; durum = "uc"; a_.ucus = { x0: a_.x, y0: a_.y, x1: CX[i] - 20, y1: CY[i] - 70, t: 0 }; Sh.ses.tik(); ciz();
    });
    let vizz = 0;
    sh.baslat((dt) => {
      P.guncelle(dt);
      if (durum === "soru") { sure -= dt; if (sure <= 0) { sure = 0; sec = -1; bitir(); } }
      acik = acik.map((v, i) => v + ((durum === "bitti" && i === sec && sec !== R.cevap ? 0 : 1) - v) * Math.min(1, dt * 4));
      if (a_.ucus) { const u = a_.ucus; u.t += dt / 0.9; const p = Math.min(1, u.t), e = Sh.ease(p); const nx = Sh.lerp(u.x0, u.x1, e) + Math.sin(p * Math.PI * 3) * 40, ny = Sh.lerp(u.y0, u.y1, e) - Math.sin(p * Math.PI) * 120; a_.yon = nx >= a_.x ? 1 : -1; a_.x = nx; a_.y = ny; if (p >= 1) { a_.ucus = null; bitir(); } }
      else if (durum !== "uc") { a_.x += Math.cos(sh.zaman * 1.3) * 1.2; a_.y += Math.sin(sh.zaman * 2.1) * 0.8; }
      vizz -= dt; if (durum === "uc" && vizz < 0) { Sh.ton(220, 240, 0.25, "sawtooth", 0.02); vizz = 0.22; }
    }, (ctx) => {
      const t = sh.zaman; Sh.gok(ctx, t, 0, ZEMIN); Sh.tepeler(ctx, 0, ZEMIN); Sh.zemin(ctx, 0, t, ZEMIN);
      CX.forEach((x, i) => cicekBuyuk(ctx, x, CY[i], t, RENK[i], acik[i], R.opts[i], durum === "bitti" && i === R.cevap ? "dogru" : ""));
      ari(ctx, a_.x, a_.y, t, a_.yon);
      Sh.onPlan(ctx, 0, t);
      /* kavanozlar */
      if (D.takim) { kavanoz(ctx, 120, 790, bal[0]); kavanoz(ctx, W - 120, 790, bal[1]); }
      /* süre çubuğu: bal damlası şeklinde azalır */
      const oran = sure / toplamSure; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(500, 860, 600, 14); ctx.fillStyle = oran > 0.33 ? "#F2A71B" : "#E0452B"; ctx.fillRect(500, 860, 600 * oran, 14);
      P.ciz(ctx); Sh.vinyet(ctx);
    });
    yeni();
  };
})();
