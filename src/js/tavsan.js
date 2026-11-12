/* Matematik vitrin oyunu: Tavşan zıplıyor. Sayı doğrusunda ileri/geri ve atlayarak sayma.
   Canvas ile çizilen sahne: paralaks tepeler, bulutlar, sallanan çiçekler, esneyen tavşan, toz ve yıldız parçacıkları.
   Sınıf iki takım hâlinde oynar; çocuk tavşanın duracağı taşa dokunur. */
(function () {
  const { h } = T;
  const W = 1600, H = 900, ZEMIN = 640, ARALIK = 120;
  const ease = (t) => T.Sahne.ease(t), lerp = (a, b, t) => a + (b - a) * t, rnd = (a, b) => a + Math.random() * (b - a);

  const Sh = T.Sahne, SES = Sh.ses;

  /* ---------- Gerçekçi tavşan: tüylü parçalar bir kez çizilir, sonra dönüştürülerek kullanılır ---------- */
  const RENK = { taban: "#A98B70", acik: "#D2BC9F", koyu: "#6B5544", karin: "#F1E8DB", kulakIc: "#E4AFA2", uc: "#4A3C31" };
  const elips = (cx, cy, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); return p; };
  /* tüylü elips: gradyan dolgu + içte kısa tüy çizgileri + kenarda dışa taşan tüyler */
  function tuylu(c, cx, cy, rx, ry, rot, renk, isik = [-0.35, -0.45], yon = 0.6, yogun = 1) {
    const p = elips(cx, cy, rx, ry, rot);
    const g = c.createRadialGradient(cx + rx * isik[0], cy + ry * isik[1], 2, cx, cy, Math.max(rx, ry) * 1.15);
    g.addColorStop(0, renk[0]); g.addColorStop(0.65, renk[1]); g.addColorStop(1, renk[2]);
    c.fillStyle = g; c.fill(p);
    c.save(); c.clip(p);
    const n = Math.floor(rx * ry * 0.55 * yogun);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()), x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
      const l = 3 + Math.random() * 5, an = yon + rot + (Math.random() - 0.5) * 0.7;
      c.strokeStyle = Math.random() < 0.5 ? "rgba(255,248,235,.22)" : "rgba(60,40,25,.18)"; c.lineWidth = 1.1;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); c.stroke();
    }
    /* alt gölge */
    const go = c.createLinearGradient(0, cy - ry, 0, cy + ry); go.addColorStop(0.55, "rgba(40,25,15,0)"); go.addColorStop(1, "rgba(40,25,15,.28)"); c.fillStyle = go; c.fillRect(cx - rx - 4, cy - ry - 4, rx * 2 + 8, ry * 2 + 8);
    c.restore();
    /* kenar tüyleri */
    const m = Math.floor((rx + ry) * 1.6);
    for (let i = 0; i < m; i++) {
      const a = (i / m) * Math.PI * 2 + Math.random() * 0.05, ca = Math.cos(a), sa = Math.sin(a), cr = Math.cos(rot), sr = Math.sin(rot);
      const ex = ca * rx, ey = sa * ry, x = cx + ex * cr - ey * sr, y = cy + ex * sr + ey * cr;
      const nx = (ca / rx) * cr - (sa / ry) * sr, ny = (ca / rx) * sr + (sa / ry) * cr, nl = Math.hypot(nx, ny) || 1, l = 2 + Math.random() * 4.5;
      c.strokeStyle = sa < 0.2 ? renk[1] : renk[2]; c.globalAlpha = 0.85; c.lineWidth = 1.3;
      c.beginPath(); c.moveTo(x - (nx / nl) * 2, y - (ny / nl) * 2); c.lineTo(x + (nx / nl) * l + (Math.random() - 0.5) * 2, y + (ny / nl) * l); c.stroke(); c.globalAlpha = 1;
    }
  }
  let SPR = null;
  const spritelar = () => {
    if (SPR) return SPR;
    const A = [RENK.acik, RENK.taban, RENK.koyu];
    /* gövde: başlangıç noktası (200, 300) ayak ortası; sağa bakıyor */
    const govde = Sh.sprite(400, 330, (c) => {
      c.translate(200, 300);
      tuylu(c, -74, -66, 17, 16, 0, ["#FFFFFF", "#F2EEE8", "#D9D2C8"], undefined, 0, 1.4); /* kuyruk */
      tuylu(c, -30, -50, 54, 46, -0.15, A, [-0.2, -0.6], 0.3); /* arka but */
      tuylu(c, -2, -76, 50, 56, 0.4, A, [-0.1, -0.6], 0.9); /* gövde */
      tuylu(c, 26, -62, 24, 34, 0.2, [RENK.karin, "#E2D6C6", "#C6B6A2"], [0.2, -0.4], 1.4, 0.8); /* göğüs */
      tuylu(c, -8, -9, 46, 11, 0, A, [0, -0.6], 0); /* arka ayak */
      tuylu(c, 36, -12, 15, 10, 0.1, [RENK.karin, "#DCCDB9", "#B9A68F"], [0, -0.6], 0, 0.7); /* ön pati */
      tuylu(c, 44, -132, 38, 32, 0.12, A, [-0.1, -0.6], 0.8); /* baş */
      tuylu(c, 72, -120, 17, 15, 0, [RENK.karin, "#E8DCCB", "#C9B8A3"], [0.1, -0.4], 0, 0.8); /* ağız */
      tuylu(c, 54, -114, 13, 9, 0, ["rgba(255,255,255,.0)", "rgba(240,230,215,.55)", "rgba(200,185,165,.0)"], [0, 0], 0, 0.4);
      /* burun */
      c.fillStyle = "#B97A72"; c.beginPath(); c.moveTo(84, -128); c.quadraticCurveTo(91, -126, 88, -119); c.quadraticCurveTo(82, -121, 84, -128); c.fill();
      c.strokeStyle = "#5A4234"; c.lineWidth = 1.8; c.lineCap = "round"; c.beginPath(); c.moveTo(86, -119); c.quadraticCurveTo(84, -110, 77, -111); c.stroke();
      c.strokeStyle = "rgba(240,235,225,.7)"; c.lineWidth = 1; [[-3, -6], [1, 0], [4, 6]].forEach(([a, b]) => { c.beginPath(); c.moveTo(82, -121 + a); c.quadraticCurveTo(100, -124 + a, 116, -128 + b * 1.6); c.stroke(); });
    });
    const kulak = Sh.sprite(80, 150, (c) => {
      c.translate(40, 140);
      tuylu(c, 0, -66, 16, 62, 0, A, [-0.4, -0.3], -1.4);
      const ic = c.createLinearGradient(0, -120, 0, -10); ic.addColorStop(0, "rgba(228,175,162,.55)"); ic.addColorStop(1, "rgba(228,175,162,.95)");
      c.fillStyle = ic; c.beginPath(); c.ellipse(2, -62, 7, 50, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = RENK.uc; c.globalAlpha = 0.65; c.beginPath(); c.ellipse(0, -122, 12, 10, 0, Math.PI, 0); c.fill(); c.globalAlpha = 1;
    });
    SPR = { govde, kulak };
    return SPR;
  };
  /* tavşanı çiz: x,y ayak ortası */
  function tavsan(ctx, x, y, o) {
    const { sq = 1, yon = 1, t = 0, kirp = 0, kulak = 0, havada = false, mutlu = 0 } = o, sp = spritelar();
    ctx.save(); ctx.translate(x, y);
    if (!havada) { const g = ctx.createRadialGradient(0, 4, 4, 0, 4, 70); g.addColorStop(0, "rgba(20,35,10,.4)"); g.addColorStop(1, "rgba(20,35,10,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 4, 70 / sq, 14, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.scale(yon * 0.82 / Math.sqrt(sq), 0.82 * sq);
    const nefes = havada ? 0 : Math.sin(t * 3) * 0.012, burun = Math.sin(t * 9) > 0.7 ? 1 : 0;
    const kul = (dx, dy, aci, olcek) => { ctx.save(); ctx.translate(dx, dy); ctx.rotate(aci); ctx.scale(olcek, olcek); ctx.drawImage(sp.kulak, -40, -140); ctx.restore(); };
    const sw = Math.sin(t * 2.1) * 0.05 + kulak;
    kul(28, -150, -0.45 - sw * 1.2, 0.95); /* arka kulak */
    ctx.save(); ctx.scale(1, 1 + nefes); ctx.drawImage(sp.govde, -200, -300); ctx.restore();
    kul(44, -152, -0.12 + sw, 1);
    /* göz */
    const gx = 58, gy = -140;
    ctx.fillStyle = "#2A1C14"; ctx.beginPath(); ctx.ellipse(gx, gy, 8.5, 10, 0.1, 0, Math.PI * 2); ctx.fill();
    const ig = ctx.createRadialGradient(gx + 1, gy + 2, 1, gx, gy, 9); ig.addColorStop(0, "#5B3B26"); ig.addColorStop(1, "rgba(42,28,20,0)"); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(gx, gy, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(gx + 3, gy - 4, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.arc(gx - 3, gy + 4, 1.4, 0, Math.PI * 2); ctx.fill();
    if (kirp > 0.5 || mutlu > 0.5) { ctx.fillStyle = RENK.taban; ctx.beginPath(); ctx.ellipse(gx, gy - (mutlu > 0.5 ? 4 : 0), 11, mutlu > 0.5 ? 7 : 11.5, 0.1, Math.PI, mutlu > 0.5 ? 0 : Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#3D2C20"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(gx, gy + (mutlu > 0.5 ? 1 : 0), 9, mutlu > 0.5 ? 5 : 2, 0.1, mutlu > 0.5 ? Math.PI * 1.05 : 0, mutlu > 0.5 ? Math.PI * 1.95 : Math.PI); ctx.stroke(); }
    if (burun) { ctx.fillStyle = "rgba(185,122,114,.6)"; ctx.beginPath(); ctx.ellipse(86, -124, 4, 3, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function havuc(ctx, x, y, s, aci) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(aci || 0); ctx.scale(s, s);
    const g = ctx.createLinearGradient(-12, 0, 12, 0); g.addColorStop(0, "#FFA552"); g.addColorStop(0.5, "#F07D1F"); g.addColorStop(1, "#C45A0C");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-13, -10); ctx.quadraticCurveTo(0, -16, 13, -10); ctx.lineTo(2, 34); ctx.quadraticCurveTo(0, 38, -2, 34); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(140,55,8,.45)"; ctx.lineWidth = 1.6; [0, 8, 16, 24].forEach((yy) => { ctx.beginPath(); ctx.moveTo(-9 + yy * 0.32, yy); ctx.lineTo(-1, yy + 2); ctx.stroke(); });
    [[-6, -0.5, "#2F8A3A"], [0, 0, "#3FA34D"], [6, 0.5, "#2F8A3A"]].forEach(([lx, r, rn]) => { ctx.save(); ctx.translate(lx, -12); ctx.rotate(r); ctx.fillStyle = rn; ctx.beginPath(); ctx.ellipse(0, -12, 4.5, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
    ctx.restore();
  }

  /* Sayıya Türkçe ek: okunuşunun son sözcüğüne göre ünlü uyumu ve sertleşme */
  const BIR = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"], ON = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  const sonSoz = (n) => (n === 0 ? "sıfır" : n % 10 ? BIR[n % 10] : n % 100 ? ON[(n % 100) / 10] : n % 1000 ? "yüz" : "bin");
  const ek = (n, tur) => {
    const w = sonSoz(n), sesli = [...w].filter((c) => "aeıioöuü".includes(c)).pop(), kalin = "aıou".includes(sesli), son = w[w.length - 1], unluBiter = "aeıioöuü".includes(son), sert = "fstkçşhp".includes(son);
    if (tur === "da") return n + "'" + (sert ? "t" : "d") + (kalin ? "a" : "e");
    if (tur === "den") return n + "'" + (sert ? "t" : "d") + (kalin ? "a" : "e") + "n";
    return n + "'" + (unluBiter ? "y" : "") + (kalin ? "a" : "e");
  };
  T.sayiEk = ek;
  T.tools["tavsan-zipla"] = {
    title: "Tavşan zıplıyor", icon: "rocket", tone: "leaf", cat: "oyun", back: "matematik", grades: [1, 4],
    short: "Sayı doğrusunda ileri, geri ve atlayarak zıpla. İki takım havuç toplar.",
    render(host) {
      const g = T.store.grade();
      const AYAR = { mod: "ileri", adim: g <= 1 ? 1 : 2, takim: true };
      const sahne = h("div.tv-sahne"); const cv = h("canvas.tv-cv", { width: W, height: H, "aria-label": "Tavşan oyunu sahnesi" });
      const afis = h("div.tv-afis"), skor = h("div.tv-skor"), alt = h("div.tv-alt");
      sahne.append(cv, afis, skor, alt); host.append(sahne);
      const ayarlar = h("div.row.tv-ayar");
      host.append(ayarlar);
      const ctx = cv.getContext("2d");
      let dpr = 1;
      const boyut = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); const w = Math.max(320, Math.round(r.width * dpr)); if (cv.width !== w) { cv.width = w; cv.height = Math.round(w * H / W); } };
      /* oyun durumu */
      let S = { puan: [0, 0], sira: 0, soru: null, durum: "soru", konum: 0, tahmin: null, hop: [], hopT: 0, sayac: 0, sonuc: null };
      const tv = { x: 0, y: 0, sq: 1, yon: 1, havada: false, kirp: 0, sonrakiKirp: 2, kulak: 0, gul: 0 };
      let kamX = 0, P = Sh.parcacik(), etiket = [], havuclar = [], zaman = 0, sonZ = performance.now(), cizBekle = 0;
      /* taş birimi: 5'er ve 10'ar zıplamada her taş bir adım (15, 20, 25...) */
      const birim = () => (S.soru && S.soru.d >= 5 ? S.soru.d : 1), kayma = () => (S.soru ? ((S.soru.bas % birim()) + birim()) % birim() : 0);
      const tasX = (v) => ((v - kayma()) / birim()) * ARALIK + 200;
      const tasSay = () => Math.floor((enFazla() - kayma()) / birim());
      const enFazla = () => (g <= 1 ? 20 : g === 2 ? 50 : 100);
      const yeniSoru = () => {
        const m = AYAR.mod === "karisik" ? (Math.random() < 0.5 ? "ileri" : "geri") : AYAR.mod, d = AYAR.adim, mx = enFazla();
        let k = Math.floor(rnd(2, 6)), bas;
        if (m === "ileri") { bas = Math.floor(rnd(0, Math.max(1, mx - k * d))); if (d > 1 && Math.random() < 0.6) bas = Math.floor(bas / d) * d; }
        else { bas = Math.floor(rnd(k * d, mx + 1)); if (d > 1 && Math.random() < 0.6) bas = Math.ceil(bas / d) * d; bas = Math.min(bas, mx); }
        const hedef = m === "ileri" ? bas + k * d : bas - k * d;
        S.soru = { m, d, k, bas, hedef }; S.konum = bas; S.tahmin = null; S.durum = "soru"; S.sonuc = null; S.hop = []; S.sayac = 0;
        tv.x = tasX(bas); tv.y = ZEMIN; tv.yon = m === "ileri" ? 1 : -1;
        afisCiz(); altCiz(); skorCiz();
      };
      const soruMetni = (q) => "Tavşan " + ek(q.bas, "da") + ". " + q.k + " kez " + (q.d > 1 ? q.d + "'şer " : "") + (q.m === "ileri" ? "ileri" : "geri") + " zıplayacak. Hangi taşta durur?";
      const afisCiz = () => {
        const q = S.soru;
        afis.replaceChildren(h("div.tv-soru", S.durum === "soru" ? soruMetni(q) : S.durum === "zipla" ? (q.m === "ileri" ? "+" : "−") + q.d + " … " + S.sayac + ". zıplama" : S.sonuc ? "Doğru! Tavşan " + ek(q.hedef, "da") + " durdu." : "Tavşan " + ek(q.hedef, "da") + " durdu. " + q.bas + (q.m === "ileri" ? " + " : " − ") + q.k * q.d + " = " + q.hedef),
          S.durum !== "zipla" ? h("div.tv-islem", q.bas + (q.d > 1 ? Array(q.k).fill((q.m === "ileri" ? " + " : " − ") + q.d).join("") : (q.m === "ileri" ? " + " : " − ") + q.k) + " = " + (S.durum === "bitti" ? q.hedef : "?")) : null);
      };
      const skorCiz = () => {
        if (!AYAR.takim) { skor.replaceChildren(h("div.tv-takim.tek", h("b", String(S.puan[0] + S.puan[1])), "havuç")); return; }
        skor.replaceChildren(...["Mavi takım", "Turuncu takım"].map((ad, i) => h("div.tv-takim.t" + i + (S.sira === i ? ".sirada" : ""), h("span", ad), h("b", String(S.puan[i])), h("i", "🥕"))));
      };
      const altCiz = () => {
        alt.replaceChildren(
          S.durum === "soru" ? h("div.tv-ipucu", (AYAR.takim ? (S.sira === 0 ? "Mavi" : "Turuncu") + " takım: " : "") + "tavşanın duracağı taşa dokun") : null,
          S.durum === "bitti" ? h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (AYAR.takim) S.sira = 1 - S.sira; yeniSoru(); } }, "Sonraki soru") : null,
          S.durum === "soru" ? h("button.btn.sm.c-chalk.tv-oku", { onclick: () => T.speak(soruMetni(S.soru)) }, T.icon("speaker"), "Oku") : null);
      };
      const ayarCiz = () => {
        ayarlar.replaceChildren(
          h("div.seg", [["ileri", "İleri"], ["geri", "Geri"], ["karisik", "Karışık"]].map(([k, l]) => h("button", { "aria-pressed": String(AYAR.mod === k), onclick: () => { AYAR.mod = k; ayarCiz(); yeniSoru(); } }, l))),
          h("div.seg", [1, 2, 5, 10].filter((d) => g > 1 || d <= 2).map((d) => h("button", { "aria-pressed": String(AYAR.adim === d), onclick: () => { AYAR.adim = d; ayarCiz(); yeniSoru(); } }, d === 1 ? "Birer" : d + "'şer"))),
          h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([k, l]) => h("button", { "aria-pressed": String(AYAR.takim === k), onclick: () => { AYAR.takim = k; ayarCiz(); skorCiz(); altCiz(); } }, l))),
          h("div.spacer"),
          h("button.btn.sm.c-chalk", { onclick: () => { S.puan = [0, 0]; skorCiz(); } }, T.icon("reset"), "Skoru sıfırla"),
          h("button.btn.sm.c-chalk", { onclick: () => { try { (sahne.requestFullscreen || sahne.webkitRequestFullscreen).call(sahne); } catch (e) {} } }, T.icon("full"), "Tam ekran"));
      };
      /* dokunma */
      cv.addEventListener("pointerdown", (e) => {
        Sh.ac();
        if (S.durum !== "soru") return;
        const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W + kamX, y = ((e.clientY - r.top) / r.height) * H;
        if (y < ZEMIN - 160) return;
        const j = Math.round((x - 200) / ARALIK); if (j < 0 || j > tasSay()) return; const i = kayma() + j * birim(); if (i === S.soru.bas) return;
        S.tahmin = i; SES.tik(); basla();
      });
      const basla = () => {
        const q = S.soru; S.durum = "zipla"; S.hop = Array.from({ length: q.k }, (_, j) => q.bas + (q.m === "ileri" ? 1 : -1) * q.d * (j + 1)); S.hopT = -0.35; S.sayac = 0; afisCiz(); altCiz();
      };
      const toz = (x, y) => P.toz(x, y), kutla = (x, y) => P.kutla(x, y);
      const bitir = () => {
        const q = S.soru; S.sonuc = S.tahmin === q.hedef; S.durum = "bitti";
        if (S.sonuc) { S.puan[AYAR.takim ? S.sira : 0]++; SES.dogru(); kutla(tasX(q.hedef) - kamX, ZEMIN - 120); tv.gul = 1; havuclar.push({ x: tasX(q.hedef), y: ZEMIN - 240, vy: -300, t: 0 }); }
        else { SES.yanlis(); tv.kulak = 0.4; }
        afisCiz(); altCiz(); skorCiz();
      };
      /* döngü */
      const SURE = 0.62;
      const adim = (dt) => {
        zaman += dt;
        /* göz kırpma */
        tv.sonrakiKirp -= dt; if (tv.sonrakiKirp < 0) { tv.kirp = 1; if (tv.sonrakiKirp < -0.13) { tv.kirp = 0; tv.sonrakiKirp = rnd(2, 4.5); } }
        tv.kulak *= 0.96; tv.gul *= 0.995;
        if (S.durum === "zipla" && S.hop.length) {
          S.hopT += dt / SURE;
          const p = S.hopT, onceki = S.konum, sonraki = S.hop[0];
          if (p < 0) { tv.sq = 1 - 0.18 * Math.sin(((p + 0.35) / 0.35) * Math.PI * 0.5); }
          else if (p < 1) {
            if (!tv.havada) { tv.havada = true; SES.zipla(); }
            const e = ease(p); tv.x = lerp(tasX(onceki), tasX(sonraki), e); tv.y = ZEMIN - Math.sin(p * Math.PI) * 150; tv.sq = 1 + 0.16 * Math.sin(p * Math.PI) * (p < 0.5 ? 1 : 0.6);
          } else {
            tv.havada = false; tv.x = tasX(sonraki); tv.y = ZEMIN; tv.sq = 0.78; SES.kon(); toz(tv.x - kamX, ZEMIN);
            S.konum = sonraki; S.hop.shift(); S.sayac++; etiket.push({ x: tv.x, y: ZEMIN - 200, metin: (S.soru.m === "ileri" ? "+" : "−") + S.soru.d, t: 0 });
            afisCiz(); S.hopT = S.hop.length ? -0.18 : 0; if (!S.hop.length) setTimeout(bitir, 250);
          }
        } else if (!tv.havada) tv.sq += (1 - tv.sq) * Math.min(1, dt * 10);
        /* kamera: tavşan ve hedef görünsün */
        const odak = S.durum === "soru" || S.durum === "zipla" ? (S.soru.m === "ileri" ? tasX(S.soru.bas) - W * 0.1 : tasX(S.soru.bas) - W * 0.9) : tv.x - W * 0.5;
        const hedefKam = T.clamp(odak, 0, Math.max(0, tasX(kayma() + tasSay() * birim()) + 200 - W));
        kamX += (hedefKam - kamX) * Math.min(1, dt * 3.2);
        P.guncelle(dt);
        etiket.forEach((q) => { q.t += dt; q.y -= 50 * dt; }); etiket = etiket.filter((q) => q.t < 1.2);
        havuclar.forEach((q) => { q.t += dt; q.vy += 900 * dt; q.y += q.vy * dt; if (q.y > ZEMIN - 30) { q.y = ZEMIN - 30; q.vy *= -0.35; } });
        havuclar = havuclar.filter((q) => q.t < 2.4);
      };
      const ciz = () => {
        const sc = cv.width / W; ctx.setTransform(sc, 0, 0, sc, 0, 0);
        Sh.gok(ctx, zaman, kamX, ZEMIN); Sh.tepeler(ctx, kamX, ZEMIN); Sh.zemin(ctx, kamX, zaman, ZEMIN); Sh.cicekler(ctx, kamX, zaman, ZEMIN);
        /* kelebek */
        Sh.kelebek(ctx, (((zaman * 60 + 300) % (W + 400)) - 200), 330 + Math.sin(zaman * 0.9) * 70 + Math.sin(zaman * 2.3) * 20, zaman);
        /* sayı taşları */
        const q = S.soru, j0 = Math.max(0, Math.floor((kamX - 200) / ARALIK) - 1), j1 = Math.min(tasSay(), Math.ceil((kamX + W - 200) / ARALIK) + 1);
        /* zıplama yayları (izler) */
        if (q && S.durum !== "soru") {
          ctx.save(); ctx.setLineDash([10, 12]); ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineCap = "round";
          const yapilan = S.sayac; for (let j = 0; j < yapilan; j++) { const a = q.bas + (q.m === "ileri" ? 1 : -1) * q.d * j, b = a + (q.m === "ileri" ? 1 : -1) * q.d; const xa = tasX(a) - kamX, xb = tasX(b) - kamX; ctx.beginPath(); ctx.moveTo(xa, ZEMIN - 30); ctx.quadraticCurveTo((xa + xb) / 2, ZEMIN - 260, xb, ZEMIN - 30); ctx.stroke(); }
          ctx.restore();
        }
        for (let jj = j0; jj <= j1; jj++) { const i = kayma() + jj * birim();
          const durum = q && S.durum === "bitti" && i === q.hedef ? 2 : q && i === S.tahmin ? 1 : q && i === q.bas && S.durum === "soru" ? 3 : 0;
          Sh.tas(ctx, tasX(i) - kamX, ZEMIN + 6, i, durum, zaman);
        }
        /* havuçlar */
        havuclar.forEach((c) => havuc(ctx, c.x - kamX, c.y, 1.4, Math.sin(c.t * 8) * 0.2));
        /* tavşan */
        tavsan(ctx, tv.x - kamX, tv.y - 4, { sq: tv.sq, yon: tv.yon, t: zaman, kirp: tv.kirp, mutlu: S.sonuc && S.durum === "bitti" ? 1 : 0, kulak: tv.kulak + (tv.havada ? -0.3 : 0), havada: tv.havada });
        /* etiketler */
        etiket.forEach((e) => { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - e.t / 1.2); Sh.yazi(ctx, e.metin, e.x - kamX, e.y, 56, "#FFE066"); ctx.restore(); });
        P.ciz(ctx);
        Sh.onPlan(ctx, kamX, zaman);
        Sh.vinyet(ctx);
      };
      const dongu = (z) => {
        if (!cv.isConnected) return;
        const dt = Math.min(0.05, (z - sonZ) / 1000); sonZ = z;
        if (++cizBekle % 30 === 1) boyut();
        adim(dt); ciz(); requestAnimationFrame(dongu);
      };
      cv._tasEkran = (v) => tasX(v) - kamX; cv._soru = () => S.soru;
      ayarCiz(); yeniSoru(); kamX = T.clamp(S.soru.m === "ileri" ? tv.x - W * 0.1 : tv.x - W * 0.9, 0, 1e9);
      requestAnimationFrame((z) => { sonZ = z; boyut(); dongu(z); });
    },
  };
})();
