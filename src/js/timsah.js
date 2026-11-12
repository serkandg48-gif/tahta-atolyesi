/* Timsahın ağzı (gerçekçi sürüm): bataklıkta timsah büyük sayıya döner, çenesini açıp kapatır.
   Çene açıklığı > ya da < sembolünü oluşturur; eşitlikte timsah iki yana bakıp gülümser. */
(function () {
  const Sh = T.Sahne, W = Sh.W, H = Sh.H, SU = 560, rnd = Sh.rnd;
  /* ---------- Timsah parçaları (sağa bakar; orijin çene eklemi) ---------- */
  let TS = null;
  const pul = (c, path, n, a, b) => { c.save(); c.clip(path); for (let i = 0; i < n; i++) { const x = (Math.random() - 0.3) * 460, y = (Math.random() - 0.5) * 140, r = 3 + Math.random() * 7; const g = c.createRadialGradient(x - r * 0.3, y - r * 0.4, 0, x, y, r); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r * 1.2, r, 0, 0, Math.PI * 2); c.fill(); } c.restore(); };
  const parcalar = () => TS || (TS = {
    ust: Sh.sprite(520, 200, (c) => {
      c.translate(80, 130);
      const p = new Path2D(); p.moveTo(-60, -10); p.quadraticCurveTo(-40, -90, 60, -86); p.quadraticCurveTo(200, -66, 330, -38); p.quadraticCurveTo(410, -26, 420, -6); p.quadraticCurveTo(400, 10, 300, 8); p.lineTo(-40, 14); p.closePath();
      const g = c.createLinearGradient(0, -90, 0, 14); g.addColorStop(0, "#5B7A3A"); g.addColorStop(0.6, "#3E5A28"); g.addColorStop(1, "#2A3E1B"); c.fillStyle = g; c.fill(p);
      pul(c, p, 420, "rgba(140,170,90,.55)", "rgba(40,60,25,0)");
      /* dişler */
      c.fillStyle = "#F4EFE0"; for (let x = 20; x < 400; x += 22) { c.beginPath(); c.moveTo(x, 8); c.lineTo(x + 6, 24 - (x > 340 ? 6 : 0)); c.lineTo(x + 12, 8); c.fill(); }
      /* burun delikleri ve göz tepesi */
      c.fillStyle = "#1E2A12"; c.beginPath(); c.ellipse(392, -26, 6, 3, 0, 0, Math.PI * 2); c.fill();
      const gt = c.createRadialGradient(40, -96, 2, 44, -86, 34); gt.addColorStop(0, "#7E9B52"); gt.addColorStop(1, "#33491F"); c.fillStyle = gt; c.beginPath(); c.ellipse(44, -88, 32, 22, 0, 0, Math.PI * 2); c.fill();
    }),
    alt: Sh.sprite(520, 160, (c) => {
      c.translate(80, 30);
      const p = new Path2D(); p.moveTo(-50, -6); p.lineTo(300, -6); p.quadraticCurveTo(400, -4, 410, 8); p.quadraticCurveTo(390, 34, 300, 40); p.quadraticCurveTo(100, 60, -40, 50); p.closePath();
      const g = c.createLinearGradient(0, -6, 0, 60); g.addColorStop(0, "#4A6A2E"); g.addColorStop(0.5, "#C9C08A"); g.addColorStop(1, "#9D9462"); c.fillStyle = g; c.fill(p);
      pul(c, p, 200, "rgba(220,215,170,.4)", "rgba(120,110,70,0)");
      c.fillStyle = "#F4EFE0"; for (let x = 30; x < 390; x += 22) { c.beginPath(); c.moveTo(x, -6); c.lineTo(x + 6, -22); c.lineTo(x + 12, -6); c.fill(); }
      c.fillStyle = "#B4485A"; c.beginPath(); c.ellipse(120, 2, 120, 6, 0, 0, Math.PI); c.fill();
    }),
    sirt: Sh.sprite(520, 120, (c) => {
      c.translate(260, 90);
      const p = new Path2D(); p.ellipse(0, 0, 250, 48, 0, Math.PI, 0); p.closePath();
      const g = c.createLinearGradient(0, -48, 0, 0); g.addColorStop(0, "#4E6C30"); g.addColorStop(1, "#2B3F1B"); c.fillStyle = g; c.fill(p); pul(c, p, 300, "rgba(130,160,80,.5)", "rgba(40,60,25,0)");
      c.fillStyle = "#34491F"; for (let x = -220; x < 220; x += 30) { c.beginPath(); c.moveTo(x, -38 + Math.abs(x) * 0.04); c.lineTo(x + 10, -58 + Math.abs(x) * 0.05); c.lineTo(x + 20, -38 + Math.abs(x) * 0.04); c.fill(); }
    }),
  });
  function timsah(ctx, x, y, o) {
    const { yon = 1, acik = 0, kirp = 0, t = 0, mutlu = 0, saskin = 0 } = o, p = parcalar();
    ctx.save(); ctx.translate(x, y);
    ctx.save(); ctx.beginPath(); ctx.rect(-700, -400, 1400, 424); ctx.clip(); ctx.scale(yon, 1); ctx.drawImage(p.sirt, -460, -70);
    /* alt çene, sonra üst çene dönerek açılır */
    ctx.drawImage(p.alt, -80, -30);
    ctx.save(); ctx.rotate(-acik * 0.55); ctx.drawImage(p.ust, -80, -130);
    /* göz */
    const gx = 44, gy = -94;
    ctx.fillStyle = "#E6C64A"; ctx.beginPath(); ctx.ellipse(gx, gy, 14, 11, 0, 0, Math.PI * 2); ctx.fill();
    if (kirp) { ctx.fillStyle = "#4E6C30"; ctx.beginPath(); ctx.ellipse(gx, gy, 15, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#1E2A12"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx - 13, gy); ctx.lineTo(gx + 13, gy); ctx.stroke(); }
    else { ctx.fillStyle = "#111"; ctx.beginPath(); ctx.ellipse(gx + 2, gy, 3, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(gx - 4, gy - 4, 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore(); ctx.restore();
    if (saskin) { Sh.yazi(ctx, "?", yon * 60, -170 - Math.sin(t * 6) * 6, 54, "#fff"); Sh.yazi(ctx, "?", yon * 110, -150 + Math.sin(t * 6) * 6, 40, "#fff"); }
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = -480; i <= 480; i += 20) ctx.lineTo(i, 22 + Math.sin(i / 30 + t * 3) * 2); ctx.stroke();
    ctx.restore();
  }
  function bataklik(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, SU); g.addColorStop(0, "#9CC7C4"); g.addColorStop(1, "#E3EFD8"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, SU);
    /* sisli ağaçlar */
    for (let k = 0; k < 2; k++) for (let i = 0; i < 9; i++) { const x = i * 200 + (k ? 100 : 0) + Sh.hash(i + k * 9) * 60, y = SU - 20, s = (k ? 1.2 : 0.8) * (0.8 + Sh.hash(i) * 0.4); ctx.fillStyle = k ? "rgba(70,100,70,.55)" : "rgba(110,140,115,.45)"; ctx.fillRect(x - 6 * s, y - 200 * s, 12 * s, 200 * s); ctx.beginPath(); ctx.ellipse(x, y - 210 * s, 70 * s, 90 * s, 0, 0, Math.PI * 2); ctx.fill(); }
    const sis = ctx.createLinearGradient(0, SU - 160, 0, SU); sis.addColorStop(0, "rgba(235,245,235,0)"); sis.addColorStop(1, "rgba(235,245,235,.75)"); ctx.fillStyle = sis; ctx.fillRect(0, SU - 160, W, 160);
    /* su */
    const s = ctx.createLinearGradient(0, SU, 0, H); s.addColorStop(0, "#6E9C86"); s.addColorStop(0.4, "#3D6E5E"); s.addColorStop(1, "#1C4538"); ctx.fillStyle = s; ctx.fillRect(0, SU, W, H - SU);
    ctx.strokeStyle = "rgba(255,255,255,.15)"; ctx.lineWidth = 2; for (let j = 0; j < 10; j++) { const y = SU + 12 + j * j * 3; ctx.beginPath(); for (let x = 0; x <= W; x += 30) { const yy = y + Math.sin(x / (50 + j * 8) + t + j) * 2; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
    /* sazlar */
    for (let i = 0; i < 26; i++) { const x = (i < 13 ? i * 18 : W - (i - 13) * 18) + Sh.hash(i) * 10, b = 120 + Sh.hash(i + 2) * 120, sal = Math.sin(t * 1.3 + i) * 6; ctx.strokeStyle = i % 2 ? "#4F7A3A" : "#6E9A4A"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, SU + 40); ctx.quadraticCurveTo(x + sal * 0.5, SU + 40 - b * 0.6, x + sal, SU + 40 - b); ctx.stroke(); if (i % 3 === 0) { ctx.fillStyle = "#6B4A2A"; ctx.beginPath(); ctx.ellipse(x + sal, SU + 40 - b, 5, 16, 0, 0, Math.PI * 2); ctx.fill(); } }
    /* nilüferler */
    [[260, 820], [1340, 840], [700, 870], [1000, 800]].forEach(([x, y], i) => { const yy = y + Math.sin(t + i) * 3; ctx.fillStyle = "#3F8A45"; ctx.beginPath(); ctx.ellipse(x, yy, 60, 18, 0, 0.3, Math.PI * 2 - 0.1); ctx.lineTo(x, yy); ctx.fill(); if (i % 2 === 0) { for (let k = 0; k < 8; k++) { ctx.save(); ctx.translate(x - 10, yy - 10); ctx.rotate((k / 8) * Math.PI * 2); ctx.fillStyle = k % 2 ? "#FFD3E0" : "#FFB3C9"; ctx.beginPath(); ctx.ellipse(0, -10, 6, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } ctx.fillStyle = "#FFE066"; ctx.beginPath(); ctx.arc(x - 10, yy - 10, 5, 0, Math.PI * 2); ctx.fill(); } });
  }
  function levha(ctx, x, y, metin, sallan, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(sallan ? Math.sin(t * 30) * 0.06 : 0);
    ctx.fillStyle = "#5B3A1E"; ctx.fillRect(-8, 20, 16, 120);
    const g = ctx.createLinearGradient(0, -80, 0, 40); g.addColorStop(0, "#C8925A"); g.addColorStop(1, "#8E5B2E"); ctx.fillStyle = g;
    const w = Math.max(200, metin.length * 34); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-w / 2, -80, w, 110, 14) : ctx.rect(-w / 2, -80, w, 110); ctx.fill();
    ctx.strokeStyle = "rgba(60,35,15,.35)"; ctx.lineWidth = 2; for (let k = -60; k < 30; k += 22) { ctx.beginPath(); ctx.moveTo(-w / 2 + 10, k); ctx.quadraticCurveTo(0, k + 6, w / 2 - 10, k); ctx.stroke(); }
    ctx.font = "900 " + (metin.length > 6 ? 50 : 66) + "px Nunito, 'Baloo 2', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#FFF6E0"; ctx.strokeStyle = "rgba(50,25,10,.6)"; ctx.lineWidth = 8; ctx.strokeText(metin, 0, -24); ctx.fillText(metin, 0, -24);
    ctx.restore();
  }

  const OYUN = T.tools["oyun-timsah"]; if (!OYUN) return;
  OYUN.render = function (host) {
    const g = T.store.grade(); let L = g <= 1 ? 0 : g <= 3 ? 1 : 2;
    const D = { takim: true, puan: [0, 0], sira: 0, simge: "⭐" };
    const sh = Sh.olustur(host, "Timsahın ağzı sahnesi"), P = Sh.parcacik();
    const afis = T.h("div.tv-afis"), skor = T.h("div.tv-skor"), alt = T.h("div.tv-alt"); sh.ust.append(afis, skor, alt);
    const ayar = T.h("div.row.tv-ayar"); host.append(ayar);
    let R = null, durum = "soru", sec = null, ts = { yon: 1, hedefYon: 1, acik: 0.15, kirp: 0, sk: 3, saskin: 0, mutlu: 0 }, anim = 0;
    const yeni = () => {
      const mx = [10, 100, 1000][L]; let a = Math.floor(rnd(0, mx + 1)), b = Math.floor(rnd(0, mx + 1)), la = String(a), lb = String(b);
      if (L === 2 && Math.random() < 0.5) { const x = Math.floor(rnd(1, 50)), y = Math.floor(rnd(1, 50)); a = x + y; const z = Math.floor(rnd(1, a)), w2 = Math.max(0, a - z + Math.floor(rnd(-2, 3))); la = x + " + " + y; lb = z + " + " + w2; b = z + w2; }
      if (Math.random() < 0.2) { b = a; lb = la; }
      R = { a, b, la, lb, cevap: a > b ? ">" : a < b ? "<" : "=" }; durum = "soru"; sec = null; ts.saskin = 0; ts.mutlu = 0; ts.hedefYon = 1; ciz();
    };
    const sembol = (s) => (s === ">" ? "Soldakini yer" : s === "<" ? "Sağdakini yer" : "Eşit");
    const ciz = () => {
      afis.replaceChildren(T.h("div.tv-soru", durum === "soru" ? "Timsah her zaman büyük olanı yer. Hangisini yesin?" : durum === "bitti" && sec === R.cevap ? "Doğru! " + R.a + " " + R.cevap + " " + R.b : durum === "bitti" ? "Doğrusu: " + R.a + " " + R.cevap + " " + R.b : "Hap!"),
        durum === "bitti" ? T.h("div.tv-islem", R.la + "  " + R.cevap + "  " + R.lb) : null);
      Sh.skor(skor, D);
      alt.replaceChildren(...(durum === "soru" ? [">", "=", "<"].map((s) => T.h("button.btn.big.c-chalk.tm-d", { onclick: () => sec_(s) }, T.h("b", s), T.h("small", sembol(s)))) : durum === "bitti" ? [T.h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (D.takim) D.sira = 1 - D.sira; yeni(); } }, "Sonraki")] : []));
      ayar.replaceChildren(T.h("div.seg", [[0, "10'a kadar"], [1, "100'e kadar"], [2, "1000 ve işlemler"]].map(([k, l]) => T.h("button", { "aria-pressed": String(L === k), onclick: () => { L = k; yeni(); } }, l))),
        T.h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([k, l]) => T.h("button", { "aria-pressed": String(D.takim === k), onclick: () => { D.takim = k; ciz(); } }, l))),
        T.h("div.spacer"), T.h("button.btn.sm.c-chalk", { onclick: () => { D.puan = [0, 0]; ciz(); } }, T.icon("reset"), "Skoru sıfırla"), T.h("button.btn.sm.c-chalk", { onclick: sh.tamEkran }, T.icon("full"), "Tam ekran"));
    };
    const sec_ = (s) => { if (durum !== "soru") return; sec = s; durum = "hap"; anim = 0; ts.hedefYon = s === ">" ? -1 : 1; Sh.ses.tik(); ciz(); };
    sh.cv.addEventListener("pointerdown", (e) => { if (durum !== "soru") return; const n = sh.nokta(e); if (n.y < 300 || n.y > 760) return; if (n.x < 520) sec_(">"); else if (n.x > 1080) sec_("<"); });
    sh.baslat((dt) => {
      P.guncelle(dt); ts.sk -= dt; ts.kirp = ts.sk < 0 ? 1 : 0; if (ts.sk < -0.15) ts.sk = 2.5 + Math.random() * 3;
      ts.yon += (ts.hedefYon - ts.yon) * Math.min(1, dt * 7);
      if (durum === "soru") ts.acik = 0.12 + Math.sin(sh.zaman * 1.5) * 0.05;
      if (durum === "hap") {
        anim += dt;
        if (sec === "=") { ts.yon = Math.sin(anim * 9) > 0 ? 1 : -1; ts.acik = 0.15; }
        else ts.acik = anim < 0.5 ? Sh.ease(anim / 0.5) : anim < 0.62 ? 1 - (anim - 0.5) / 0.12 : 0.05;
        if (sec !== "=" && anim > 0.5 && anim - dt <= 0.5) { Sh.ses.pop(); Sh.ses.hisirti(); P.damla(W / 2 + ts.hedefYon * 300, SU + 30, 12); }
        if (anim > 1) {
          const ok = sec === R.cevap; durum = "bitti";
          if (ok) { Sh.ses.dogru(); P.kutla(W / 2, 360); ts.mutlu = 1; D.puan[D.takim ? D.sira : 0]++; } else { Sh.ses.yanlis(); ts.saskin = 1; }
          ts.hedefYon = R.cevap === ">" ? -1 : 1; ts.acik = R.cevap === "=" ? 0.15 : 0.9; ciz();
        }
      }
    }, (ctx) => {
      const t = sh.zaman; bataklik(ctx, t);
      const yenen = durum === "hap" && anim > 0.5 && sec !== "=" ? (sec === ">" ? 0 : 1) : -1;
      levha(ctx, 300, SU - 10, R.la, yenen === 0, t); levha(ctx, 1300, SU - 10, R.lb, yenen === 1, t);
      timsah(ctx, W / 2 - ts.yon * 40, SU + 110 + Math.sin(t * 1.2) * 4, { yon: ts.yon >= 0 ? Math.max(0.05, ts.yon) : Math.min(-0.05, ts.yon), acik: ts.acik, kirp: ts.kirp, t, saskin: ts.saskin });
      P.ciz(ctx); Sh.vinyet(ctx);
    });
    yeni();
  };
})();
