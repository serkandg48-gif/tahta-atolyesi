/* Lav atlaması (gerçekçi sürüm): yüzlük tablo, akan lavın üstünde bazalt taşlar.
   10 eklemek bir sıra aşağı atlamaktır; sonra birlikler için yana adım atılır. */
(function () {
  const Sh = T.Sahne, W = Sh.W, H = Sh.H, rnd = Sh.rnd;
  const X0 = 250, DX = 122, Y0 = 300, DY = 118, SATIR = 5;
  const kor = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 30 + Math.random() * 70, r: 1 + Math.random() * 3 }));
  let TAS = null;
  const tasSp = () => TAS || (TAS = [0, 1, 2].map((tur) => Sh.sprite(130, 90, (c) => {
    c.translate(65, 42);
    const renk = tur === 1 ? ["#FFE7A3", "#D9A53A", "#8A6416"] : tur === 2 ? ["#C9F2B4", "#5DAA52", "#2F6A27"] : ["#8A8580", "#4E4A47", "#26221F"];
    c.fillStyle = renk[2]; c.beginPath(); c.ellipse(0, 10, 54, 28, 0, 0, Math.PI * 2); c.fill();
    const g = c.createRadialGradient(-16, -14, 3, 0, 0, 60); g.addColorStop(0, renk[0]); g.addColorStop(0.65, renk[1]); g.addColorStop(1, renk[2]);
    c.fillStyle = g; c.beginPath(); for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, r = 1 + (Math.sin(i * 7.3 + tur) * 0.08); c.lineTo(Math.cos(a) * 54 * r, Math.sin(a) * 26 * r); } c.closePath(); c.fill();
    c.save(); c.clip(); for (let i = 0; i < 160; i++) { c.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.18)"; c.beginPath(); c.arc((Math.random() - 0.5) * 108, (Math.random() - 0.5) * 52, Math.random() * 2 + 0.4, 0, Math.PI * 2); c.fill(); } c.restore();
    c.strokeStyle = "rgba(255,170,80,.35)"; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 12, 54, 26, 0, 0.1, Math.PI - 0.1); c.stroke();
  })));

  const OYUN = T.tools["oyun-lav"]; if (!OYUN) return;
  OYUN.render = function (host) {
    const g = T.store.grade(); let L = g <= 1 ? 0 : g === 2 ? 1 : 2;
    const D = { takim: true, puan: [0, 0], sira: 0, simge: "💎" };
    const sh = Sh.olustur(host, "Lav atlaması sahnesi"), P = Sh.parcacik();
    const afis = T.h("div.tv-afis"), skor = T.h("div.tv-skor"), alt = T.h("div.tv-alt"); sh.ust.append(afis, skor, alt);
    const ayar = T.h("div.row.tv-ayar"); host.append(ayar);
    let R = null, durum = "soru", tahmin = null, yol = [], adim = null, etiket = [];
    const tv = { x: 0, y: 0, sq: 1, yon: 1, havada: false, kirp: 0, sk: 3, mutlu: 0 };
    const konum = (n) => { const r = Math.floor((n - 1) / 10) - R.ilk, c = (n - 1) % 10; return { x: X0 + c * DX, y: Y0 + r * DY }; };
    const yeni = () => {
      let a, k;
      for (let d = 0; d < 50; d++) { k = L === 0 ? 10 : L === 1 ? T.pick([10, 20, 30]) : T.pick([19, 21, 11, 29, 31, 9]); a = Math.floor(rnd(1, 101 - k)); if (a + k <= 100) break; }
      const ans = a + k, tens = k % 10 === 9 ? (k + 1) / 10 : Math.floor(k / 10), ones = k % 10 === 9 ? -1 : k % 10;
      const ilk = Math.max(0, Math.min(10 - SATIR, Math.floor((a - 1) / 10) - (Math.floor((ans - 1) / 10) - Math.floor((a - 1) / 10) >= SATIR - 1 ? 0 : 0)));
      R = { a, k, ans, tens, ones, ilk: Math.min(ilk, Math.floor((ans - 1) / 10)) };
      if (Math.floor((ans - 1) / 10) - R.ilk > SATIR - 1) R.ilk = Math.floor((ans - 1) / 10) - (SATIR - 1);
      yol = []; let n = a; for (let i = 0; i < tens; i++) { n += 10; yol.push([n, "+10"]); } for (let i = 0; i < Math.abs(ones); i++) { n += Math.sign(ones); yol.push([n, ones > 0 ? "+1" : "−1"]); }
      const p = konum(a); tv.x = p.x; tv.y = p.y; tv.yon = 1; durum = "soru"; tahmin = null; adim = null; tv.mutlu = 0; ciz();
    };
    const ciz = () => {
      afis.replaceChildren(T.h("div.tv-soru", durum === "soru" ? "Tavşan " + T.sayiEk(R.a, "da") + ". " + R.k + " eklersek hangi taşa varır?" : durum === "bitti" ? (tahmin === R.ans ? "Doğru! " : "Tavşan " + T.sayiEk(R.ans, "e") + " vardı. ") + R.a + " + " + R.k + " = " + R.ans : "Her sıra aşağısı 10 fazla..."),
        durum === "bitti" ? T.h("div.tv-islem", R.tens + " onluk aşağı" + (R.ones ? ", " + Math.abs(R.ones) + (R.ones > 0 ? " ileri" : " geri") : "")) : null);
      Sh.skor(skor, D);
      alt.replaceChildren(durum === "soru" ? T.h("div.tv-ipucu", (D.takim ? (D.sira ? "Turuncu" : "Mavi") + " takım: " : "") + "varacağı taşa dokun") : null,
        durum === "bitti" ? T.h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (D.takim) D.sira = 1 - D.sira; yeni(); } }, "Sonraki") : null);
      ayar.replaceChildren(T.h("div.seg", [[0, "+10"], [1, "+10, +20, +30"], [2, "+9, +11, +19, +21..."]].map(([k, l]) => T.h("button", { "aria-pressed": String(L === k), onclick: () => { L = k; yeni(); } }, l))),
        T.h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([k, l]) => T.h("button", { "aria-pressed": String(D.takim === k), onclick: () => { D.takim = k; ciz(); } }, l))),
        T.h("div.spacer"), T.h("button.btn.sm.c-chalk", { onclick: () => { D.puan = [0, 0]; ciz(); } }, T.icon("reset"), "Skoru sıfırla"), T.h("button.btn.sm.c-chalk", { onclick: sh.tamEkran }, T.icon("full"), "Tam ekran"));
    };
    sh.cv.addEventListener("pointerdown", (e) => {
      if (durum !== "soru") return; const p = sh.nokta(e);
      const c = Math.round((p.x - X0) / DX), r = Math.round((p.y - Y0) / DY); if (c < 0 || c > 9 || r < 0 || r >= SATIR) return;
      const n = (R.ilk + r) * 10 + c + 1; if (n === R.a) return;
      tahmin = n; durum = "zipla"; Sh.ses.tik(); adim = { i: 0, t: -0.2 }; ciz();
    });
    sh.baslat((dt) => {
      P.guncelle(dt); tv.sk -= dt; tv.kirp = tv.sk < 0 ? 1 : 0; if (tv.sk < -0.13) tv.sk = 2 + Math.random() * 3;
      etiket.forEach((e) => { e.t += dt; e.y -= 40 * dt; }); etiket = etiket.filter((e) => e.t < 1.1);
      if (durum === "zipla" && adim) {
        adim.t += dt / 0.55; const [hedef, et] = yol[adim.i], bas = adim.i ? yol[adim.i - 1][0] : R.a, p0 = konum(bas), p1 = konum(hedef);
        if (adim.t < 0) tv.sq = 0.85;
        else if (adim.t < 1) { if (!tv.havada) { tv.havada = true; Sh.ses.zipla(); } tv.yon = p1.x < p0.x ? -1 : p1.x > p0.x ? 1 : tv.yon; const e = Sh.ease(adim.t); tv.x = Sh.lerp(p0.x, p1.x, e); tv.y = Sh.lerp(p0.y, p1.y, e) - Math.sin(adim.t * Math.PI) * 110; tv.sq = 1.12; }
        else { tv.havada = false; tv.x = p1.x; tv.y = p1.y; tv.sq = 0.8; Sh.ses.kon(); P.toz(tv.x, tv.y); etiket.push({ x: p1.x, y: p1.y - 110, m: et, t: 0 }); adim.i++; adim.t = -0.15;
          if (adim.i >= yol.length) { adim = null; durum = "bitti"; if (tahmin === R.ans) { Sh.ses.dogru(); P.kutla(tv.x, tv.y - 80); tv.mutlu = 1; D.puan[D.takim ? D.sira : 0]++; } else Sh.ses.yanlis(); ciz(); } }
      } else if (!tv.havada) tv.sq += (1 - tv.sq) * Math.min(1, dt * 10);
    }, (ctx) => {
      const t = sh.zaman;
      const gk = ctx.createLinearGradient(0, 0, 0, H); gk.addColorStop(0, "#1B0B12"); gk.addColorStop(0.4, "#5A1A12"); gk.addColorStop(1, "#2A0E0A"); ctx.fillStyle = gk; ctx.fillRect(0, 0, W, H);
      /* uzakta volkan */
      ctx.fillStyle = "#170A0A"; ctx.beginPath(); ctx.moveTo(1000, 200); ctx.lineTo(1180, 60); ctx.lineTo(1260, 60); ctx.lineTo(1520, 200); ctx.fill();
      const pk = ctx.createRadialGradient(1220, 60, 4, 1220, 60, 120); pk.addColorStop(0, "rgba(255,160,60," + (0.7 + 0.2 * Math.sin(t * 3)) + ")"); pk.addColorStop(1, "rgba(255,90,30,0)"); ctx.fillStyle = pk; ctx.beginPath(); ctx.arc(1220, 60, 120, 0, Math.PI * 2); ctx.fill();
      /* lav akıntıları (satır araları) */
      for (let r = -1; r < SATIR; r++) {
        const y = Y0 + r * DY + DY / 2 + 6, lg = ctx.createLinearGradient(0, y - 30, 0, y + 30); lg.addColorStop(0, "rgba(120,20,5,0)"); lg.addColorStop(0.35, "#FF8A1F"); lg.addColorStop(0.5, "#FFD166"); lg.addColorStop(0.65, "#FF6A10"); lg.addColorStop(1, "rgba(120,20,5,0)");
        ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(0, y - 30); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, y - 22 + Math.sin(x / 70 + t * 1.6 + r) * 6); for (let x = W; x >= 0; x -= 24) ctx.lineTo(x, y + 22 + Math.sin(x / 60 - t * 1.3 + r) * 6); ctx.fill();
        ctx.strokeStyle = "rgba(255,240,180,.45)"; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x <= W; x += 30) { const yy = y + Math.sin(x / 40 + t * 3 + r * 2) * 4; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke();
      }
      /* taşlar */
      const sp = tasSp();
      for (let r = 0; r < SATIR; r++) for (let c = 0; c < 10; c++) {
        const n = (R.ilk + r) * 10 + c + 1, x = X0 + c * DX, y = Y0 + r * DY;
        const tur = durum === "bitti" && n === R.ans ? 2 : n === tahmin ? 1 : 0;
        const isik = ctx.createRadialGradient(x, y + 20, 10, x, y + 20, 80); isik.addColorStop(0, "rgba(255,120,40,.25)"); isik.addColorStop(1, "rgba(255,120,40,0)"); ctx.fillStyle = isik; ctx.beginPath(); ctx.arc(x, y + 20, 80, 0, Math.PI * 2); ctx.fill();
        ctx.drawImage(sp[tur], x - 65, y - 42);
        if (n === R.a && durum === "soru") { ctx.strokeStyle = "rgba(140,200,255,.9)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, 60, 30, 0, 0, Math.PI * 2); ctx.stroke(); }
        Sh.yazi(ctx, String(n), x, y + (Math.hypot(x - tv.x, y - tv.y) < 40 ? 48 : 0), 34, tur ? "#2A1A08" : "#FFE9D0", tur ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.55)");
      }
      /* yol izi */
      if (durum !== "soru") { ctx.save(); ctx.setLineDash([8, 10]); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 4; const yapildi = adim ? adim.i : yol.length; let p0 = konum(R.a); for (let i = 0; i < yapildi; i++) { const p1 = konum(yol[i][0]); ctx.beginPath(); ctx.moveTo(p0.x, p0.y - 20); ctx.quadraticCurveTo((p0.x + p1.x) / 2, Math.min(p0.y, p1.y) - 110, p1.x, p1.y - 20); ctx.stroke(); p0 = p1; } ctx.restore(); }
      /* tavşan */
      if (Sh.tavsan) { ctx.save(); ctx.translate(tv.x, tv.y - 6); ctx.scale(0.66, 0.66); Sh.tavsan(ctx, 0, 0, { sq: tv.sq, yon: tv.yon, t, kirp: tv.kirp, mutlu: tv.mutlu > 0.4 && durum === "bitti" ? 1 : 0, havada: tv.havada, kulak: tv.havada ? -0.3 : 0 }); ctx.restore(); }
      etiket.forEach((e) => { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - e.t / 1.1); Sh.yazi(ctx, e.m, e.x, e.y, 44, "#FFE066"); ctx.restore(); });
      kor.forEach((k) => { k.y -= k.v / 60; k.x += Math.sin(t * 3 + k.r) * 0.6; if (k.y < -5) { k.y = H; k.x = Math.random() * W; } ctx.fillStyle = "rgba(255," + (140 + Math.floor(k.r * 30)) + ",60," + (0.4 + k.r / 8) + ")"; ctx.beginPath(); ctx.arc(k.x, k.y, k.r, 0, Math.PI * 2); ctx.fill(); });
      P.ciz(ctx); Sh.vinyet(ctx);
    });
    yeni();
  };
})();
