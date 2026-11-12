/* Kutup yolu (gerçekçi sürüm): penguen sayıları karşılaştırarak buz kütleleri arasında atlar.
   Doğru buzda balık kazanır; yanlış buz çatlar, penguen suya düşer ve geri tırmanır. */
(function () {
  const Sh = T.Sahne, W = Sh.W, H = Sh.H, SU = 600;
  const rnd = Sh.rnd;
  /* ---------- Penguen ---------- */
  let PSPR = null;
  const pSprite = () => PSPR || (PSPR = Sh.sprite(240, 300, (c) => {
    c.translate(120, 290);
    const tuy = (path, renkA, renkB, n, l) => { c.save(); c.clip(path); for (let i = 0; i < n; i++) { const x = (Math.random() - 0.5) * 200, y = -Math.random() * 280; c.strokeStyle = Math.random() < 0.5 ? renkA : renkB; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (Math.random() - 0.5) * 2, y + l); c.stroke(); } c.restore(); };
    /* gövde */
    const g = new Path2D(); g.ellipse(0, -110, 62, 108, 0, 0, Math.PI * 2);
    const gg = c.createRadialGradient(-20, -170, 10, 0, -110, 130); gg.addColorStop(0, "#3A4655"); gg.addColorStop(1, "#0E141C"); c.fillStyle = gg; c.fill(g); tuy(g, "rgba(255,255,255,.06)", "rgba(0,0,0,.25)", 900, 4);
    /* karın */
    const k = new Path2D(); k.ellipse(10, -92, 44, 86, 0, 0, Math.PI * 2);
    const kg = c.createRadialGradient(0, -120, 6, 10, -90, 100); kg.addColorStop(0, "#FFFFFF"); kg.addColorStop(0.7, "#EEF1F4"); kg.addColorStop(1, "#C9D1DA"); c.fillStyle = kg; c.fill(k); tuy(k, "rgba(180,190,205,.35)", "rgba(255,255,255,.6)", 700, 3);
    /* boyun sarısı */
    const sg = c.createRadialGradient(22, -178, 2, 22, -178, 34); sg.addColorStop(0, "rgba(255,196,60,.95)"); sg.addColorStop(1, "rgba(255,196,60,0)"); c.fillStyle = sg; c.beginPath(); c.ellipse(24, -176, 30, 22, 0.3, 0, Math.PI * 2); c.fill();
    /* baş */
    const b = new Path2D(); b.ellipse(14, -206, 40, 36, 0, 0, Math.PI * 2); const bg = c.createRadialGradient(0, -222, 4, 14, -206, 48); bg.addColorStop(0, "#344050"); bg.addColorStop(1, "#0C1118"); c.fillStyle = bg; c.fill(b);
    /* yanak beyazı */
    c.fillStyle = "rgba(240,244,248,.95)"; c.beginPath(); c.ellipse(30, -196, 15, 13, 0, 0, Math.PI * 2); c.fill();
    /* gaga */
    const gk = c.createLinearGradient(44, -212, 76, -196); gk.addColorStop(0, "#2A2A2A"); gk.addColorStop(0.5, "#E9A13B"); gk.addColorStop(1, "#C7681E"); c.fillStyle = gk; c.beginPath(); c.moveTo(46, -214); c.quadraticCurveTo(72, -208, 80, -198); c.quadraticCurveTo(66, -196, 46, -200); c.closePath(); c.fill();
    /* ayaklar */
    c.fillStyle = "#E58A2A"; [-20, 26].forEach((x) => { c.beginPath(); c.ellipse(x, -4, 22, 8, 0, 0, Math.PI * 2); c.fill(); });
  }));
  function penguen(ctx, x, y, o) {
    const { egim = 0, kanat = 0, kirp = 0, yon = 1, olcek = 0.62, mutlu = 0 } = o, sp = pSprite();
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(10,40,70,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 60 * olcek * 1.4, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.scale(yon * olcek, olcek); ctx.rotate(egim);
    /* kanatlar */
    [[-54, -1], [54, 1]].forEach(([dx, s]) => { ctx.save(); ctx.translate(dx * 0.95, -150); ctx.rotate(s * (0.18 + kanat)); const kg = ctx.createLinearGradient(0, 0, 0, 100); kg.addColorStop(0, "#1C2530"); kg.addColorStop(1, "#06090E"); ctx.fillStyle = kg; ctx.beginPath(); ctx.ellipse(s * 6, 46, 14, 56, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
    ctx.drawImage(sp, -120, -290);
    const gx = 32, gy = -214;
    if (kirp || mutlu) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(gx, gy + 2, 6, mutlu ? Math.PI * 1.1 : 0.1, mutlu ? Math.PI * 1.9 : Math.PI - 0.1); ctx.stroke(); }
    else { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(gx, gy, 7.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#1A1208"; ctx.beginPath(); ctx.arc(gx + 1.5, gy, 4.8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(gx + 3, gy - 2.5, 1.8, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  /* ---------- Buz kütlesi ---------- */
  const BUZ = {};
  const buzSprite = (tohum) => BUZ[tohum] || (BUZ[tohum] = Sh.sprite(300, 160, (c) => {
    c.translate(150, 70); const n = 11, pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, r = 1 + (Sh.hash(tohum * 9 + i) - 0.5) * 0.22; pts.push([Math.cos(a) * 118 * r, Math.sin(a) * 36 * r]); }
    const yol = (dy) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y + dy) : c.moveTo(x, y + dy))); c.closePath(); };
    yol(26); const yan = c.createLinearGradient(0, 0, 0, 70); yan.addColorStop(0, "#7CC4E4"); yan.addColorStop(1, "#2E7FA8"); c.fillStyle = yan; c.fill();
    for (let k = 26; k > 0; k -= 2) { yol(k); c.fillStyle = "rgba(150,210,235,.25)"; c.fill(); }
    yol(0); const ust = c.createRadialGradient(-40, -14, 6, 0, 0, 130); ust.addColorStop(0, "#FFFFFF"); ust.addColorStop(0.6, "#E6F4FB"); ust.addColorStop(1, "#B5DCEF"); c.fillStyle = ust; c.fill();
    c.save(); c.clip(); for (let i = 0; i < 160; i++) { c.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.55)" : "rgba(140,190,220,.18)"; c.beginPath(); c.arc((Math.random() - 0.5) * 230, (Math.random() - 0.5) * 70, Math.random() * 2.2, 0, Math.PI * 2); c.fill(); } c.restore();
  }));
  function buz(ctx, x, y, n, durum, t, cat) {
    const sal = Math.sin(t * 1.4 + x * 0.01) * 4;
    ctx.save(); ctx.translate(x, y + sal + (durum === "bat" ? cat * 40 : 0));
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.ellipse(0, 34, 140, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.drawImage(buzSprite(Math.abs(Math.round(x)) % 5), -150, -70);
    if (durum === "dogru") { ctx.strokeStyle = "rgba(120,255,160,.9)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, 0, 128, 42, 0, 0, Math.PI * 2); ctx.stroke(); }
    if (durum === "bat" || durum === "catla") { ctx.strokeStyle = "rgba(40,90,130,.8)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-60, -8); ctx.lineTo(-10, 6); ctx.lineTo(20, -12); ctx.lineTo(70, 8); ctx.moveTo(-10, 6); ctx.lineTo(0, 24); ctx.stroke(); }
    ctx.font = "900 " + (String(n).length > 3 ? 46 : 56) + "px Nunito, 'Baloo 2', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillText(n, 1, 2); ctx.fillStyle = "#1D5B85"; ctx.fillText(n, 0, 0);
    ctx.restore();
  }
  function sahne(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, SU); g.addColorStop(0, "#132F57"); g.addColorStop(0.5, "#3D78A8"); g.addColorStop(1, "#CFE6F4"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, SU);
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let x = 0; x <= W; x += 20) { const y = 110 + k * 46 + Math.sin(x / 210 + t * 0.35 + k) * 40 + Math.sin(x / 90 + t * 0.6) * 12; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } for (let x = W; x >= 0; x -= 20) ctx.lineTo(x, 230 + k * 50 + Math.sin(x / 170 + t * 0.3 + k) * 50); ctx.closePath(); const a = ctx.createLinearGradient(0, 90, 0, 330); a.addColorStop(0, "rgba(0,0,0,0)"); a.addColorStop(0.5, ["rgba(90,255,180,.24)", "rgba(120,200,255,.16)", "rgba(190,120,255,.13)"][k]); a.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = a; ctx.fill(); }
    ctx.restore();
    /* uzak buzdağları */
    [[180, 470, 1.1], [620, 500, 0.7], [1180, 460, 1.3], [1460, 510, 0.6]].forEach(([x, y, s]) => { const gg = ctx.createLinearGradient(x, y - 160 * s, x + 80 * s, y); gg.addColorStop(0, "#F7FBFE"); gg.addColorStop(1, "#9CC4DF"); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(x - 140 * s, SU); ctx.lineTo(x - 60 * s, y - 90 * s); ctx.lineTo(x - 10 * s, y - 150 * s); ctx.lineTo(x + 40 * s, y - 110 * s); ctx.lineTo(x + 130 * s, SU); ctx.closePath(); ctx.fill(); });
    /* deniz */
    const d = ctx.createLinearGradient(0, SU, 0, H); d.addColorStop(0, "#5FA8CF"); d.addColorStop(0.3, "#2B6E9C"); d.addColorStop(1, "#0D3556"); ctx.fillStyle = d; ctx.fillRect(0, SU, W, H - SU);
    ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 2;
    for (let j = 0; j < 14; j++) { const y = SU + 10 + j * j * 1.6; ctx.beginPath(); for (let x = 0; x <= W; x += 24) { const yy = y + Math.sin(x / (40 + j * 6) + t * (1 + j * 0.05) + j) * (2 + j * 0.3); x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.globalAlpha = 0.5 - j * 0.02; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  const OYUN = T.tools["oyun-kutup-yolu"];
  if (!OYUN) return;
  OYUN.render = function (host) {
    const g = T.store.grade();
    let L = g <= 2 ? 0 : g === 3 ? 1 : 2;
    const D = { takim: true, puan: [0, 0], sira: 0, simge: "🐟" };
    const sh = Sh.olustur(host, "Kutup yolu sahnesi"), P = Sh.parcacik();
    const afis = T.h("div.tv-afis"), skor = T.h("div.tv-skor"), alt = T.h("div.tv-alt"); sh.ust.append(afis, skor, alt);
    const ayar = T.h("div.row.tv-ayar"); host.append(ayar);
    const BX = [560, 960, 1360], BY = SU + 120;
    let R = null, durum = "soru", secim = -1, pen = { x: 200, y: BY - 34, egim: 0, kanat: 0, kirp: 0, sk: 3, mutlu: 0, ucus: null, dus: 0 }, kaySayi = 0, tur = 0;
    const yeni = () => {
      const max = [20, 100, 1000][L], s = new Set(); while (s.size < 3) s.add(Math.floor(rnd(0, max + 1)));
      const arr = [...s], big = Math.random() < 0.5, ans = big ? Math.max(...arr) : Math.min(...arr);
      R = { arr, big, ans, cevap: arr.indexOf(ans) }; durum = "soru"; secim = -1; pen.x = 200; pen.y = BY - 34; pen.dus = 0; pen.mutlu = 0; kaySayi = 1; tur++;
      ciz();
    };
    const ciz = () => {
      afis.replaceChildren(T.h("div.tv-soru", durum === "soru" ? "Penguen " + (R.big ? "en büyük" : "en küçük") + " sayının yazdığı buza atlasın!" : durum === "bitti" && secim === R.cevap ? "Harika! " + R.ans + " " + (R.big ? "en büyük" : "en küçük") + " sayı." : durum === "bitti" ? "Hay aksi! Doğru buz " + R.ans + ". Önce basamak sayısına bak." : durum === "dusuyor" ? "Eyvah, buz çatladı! Penguen suya düştü." : "Atlıyor..."));
      Sh.skor(skor, D);
      alt.replaceChildren(durum === "soru" ? T.h("div.tv-ipucu", (D.takim ? (D.sira ? "Turuncu" : "Mavi") + " takım: " : "") + "doğru buza dokun") : null,
        durum === "bitti" ? T.h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (D.takim) D.sira = 1 - D.sira; yeni(); } }, "Sonraki") : null);
      ayar.replaceChildren(
        T.h("div.seg", [[0, "20'ye kadar"], [1, "100'e kadar"], [2, "1000'e kadar"]].map(([k, l]) => T.h("button", { "aria-pressed": String(L === k), onclick: () => { L = k; yeni(); } }, l))),
        T.h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([k, l]) => T.h("button", { "aria-pressed": String(D.takim === k), onclick: () => { D.takim = k; ciz(); } }, l))),
        T.h("div.spacer"), T.h("button.btn.sm.c-chalk", { onclick: () => { D.puan = [0, 0]; ciz(); } }, T.icon("reset"), "Skoru sıfırla"), T.h("button.btn.sm.c-chalk", { onclick: sh.tamEkran }, T.icon("full"), "Tam ekran"));
    };
    sh.cv.addEventListener("pointerdown", (e) => {
      if (durum !== "soru") return; const n = sh.nokta(e);
      const i = BX.findIndex((x) => Math.abs(n.x - x) < 150 && Math.abs(n.y - BY) < 110); if (i < 0) return;
      secim = i; durum = "atla"; Sh.ses.tik(); pen.ucus = { x0: pen.x, x1: BX[i] - 70, t: 0 }; ciz();
    });
    sh.baslat((dt) => {
      P.guncelle(dt);
      pen.sk -= dt; pen.kirp = pen.sk < 0 ? 1 : 0; if (pen.sk < -0.13) pen.sk = 2 + Math.random() * 3;
      pen.mutlu *= 0.99;
      if (pen.ucus) {
        const u = pen.ucus; u.t += dt / 0.9; const p = Math.min(1, u.t);
        if (u.t < 0.02) Sh.ses.zipla();
        pen.x = Sh.lerp(u.x0, u.x1, Sh.ease(p)); pen.y = BY - 34 - Math.sin(p * Math.PI) * 190; pen.kanat = Math.sin(p * Math.PI) * 0.9; pen.egim = (p - 0.5) * 0.5;
        if (p >= 1) {
          pen.ucus = null; pen.kanat = 0; pen.egim = 0;
          if (secim === R.cevap) { Sh.ses.kon(); Sh.ses.dogru(); P.kutla(pen.x, BY - 160); pen.mutlu = 1; D.puan[D.takim ? D.sira : 0]++; durum = "bitti"; }
          else { durum = "dusuyor"; Sh.ses.yanlis(); setTimeout(() => { Sh.ses.hisirti(); P.damla(pen.x, SU + 70, 26); }, 380); }
          ciz();
        }
      } else if (durum === "dusuyor") { pen.dus += dt; if (pen.dus > 0.4) pen.y += 380 * dt; if (pen.dus > 1.4) { durum = "bitti"; pen.ucus = { x0: pen.x, x1: BX[R.cevap] - 70, t: 0 }; secim = -2; pen.y = BY - 34; ciz(); } }
      else if (durum === "soru") { pen.egim = Math.sin(sh.zaman * 4) * 0.05; }
    }, (ctx) => {
      const t = sh.zaman; sahne(ctx, t);
      buz(ctx, 200, BY, "", "", t, 0);
      BX.forEach((x, i) => { const st = durum === "bitti" && i === R.cevap ? "dogru" : durum === "dusuyor" && i === secim ? "bat" : ""; buz(ctx, x, BY, R.arr[i], st, t, Math.min(1, pen.dus)); });
      if (durum === "bitti" && secim === -2) {} /* yeniden doğru buza taşındı */
      const suda = durum === "dusuyor" && pen.dus > 0.4;
      if (suda) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, SU + 96); ctx.clip(); }
      penguen(ctx, pen.x, pen.y + Math.sin(t * 1.4 + pen.x * 0.01) * 4, { egim: pen.egim, kanat: pen.kanat, kirp: pen.kirp, mutlu: pen.mutlu > 0.4 ? 1 : 0 });
      if (suda) ctx.restore();
      P.ciz(ctx); Sh.vinyet(ctx);
    });
    yeni();
  };
})();
