/* Matematik vitrin oyunu: Tavşan zıplıyor. Sayı doğrusunda ileri/geri ve atlayarak sayma.
   Canvas ile çizilen sahne: paralaks tepeler, bulutlar, sallanan çiçekler, esneyen tavşan, toz ve yıldız parçacıkları.
   Sınıf iki takım hâlinde oynar; çocuk tavşanın konacağı taşa dokunur. */
(function () {
  const { h } = T;
  const W = 1600, H = 900, ZEMIN = 640, ARALIK = 132;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  /* ---------- Ses (WebAudio, dosyasız) ---------- */
  let AC = null;
  const ac = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) {} return AC; };
  const ton = (f0, f1, sure, tip = "sine", ses = 0.18, gecik = 0) => {
    const a = ac(); if (!a || T.store.get().settings?.sessiz) return;
    const t = a.currentTime + gecik, o = a.createOscillator(), g = a.createGain();
    o.type = tip; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + sure);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(ses, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + sure + 0.05);
  };
  const SES = {
    zipla: () => { ton(260, 620, 0.22, "sine", 0.16); ton(520, 900, 0.12, "triangle", 0.05, 0.02); },
    kon: () => ton(180, 90, 0.12, "triangle", 0.12),
    dogru: () => [523, 659, 784, 1047].forEach((f, i) => ton(f, f * 1.01, 0.35, "triangle", 0.14, i * 0.09)),
    yanlis: () => { ton(330, 220, 0.25, "sine", 0.12); ton(262, 175, 0.3, "sine", 0.1, 0.18); },
    tik: () => ton(900, 700, 0.06, "square", 0.04),
  };

  /* ---------- Çizim yardımcıları ---------- */
  function tepe(ctx, kamX, oran, taban, gen, renk1, renk2, tohum) {
    const g = ctx.createLinearGradient(0, taban - gen, 0, taban + 80); g.addColorStop(0, renk1); g.addColorStop(1, renk2);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 16) { const wx = x + kamX * oran; const y = taban - gen * (0.55 + 0.25 * Math.sin(wx / 260 + tohum) + 0.2 * Math.sin(wx / 113 + tohum * 2.3)); ctx.lineTo(x, y); }
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  }
  function bulut(ctx, x, y, s, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(120,150,200,.25)"; ctx.shadowBlur = 20 * s; ctx.shadowOffsetY = 6 * s;
    ctx.beginPath(); [[0, 0, 42], [38, -16, 50], [86, -4, 40], [118, 8, 30], [-34, 10, 30]].forEach(([dx, dy, r]) => { ctx.moveTo(x + dx * s + r * s, y + dy * s); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); });
    ctx.fill(); ctx.restore();
  }
  function cicek(ctx, x, y, t, renk, boy) {
    const sal = Math.sin(t * 1.6 + x * 0.05) * 0.12;
    ctx.save(); ctx.translate(x, y); ctx.rotate(sal);
    ctx.strokeStyle = "#3E8E41"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(6, -boy / 2, 0, -boy); ctx.stroke();
    ctx.fillStyle = "#4FA552"; ctx.beginPath(); ctx.ellipse(7, -boy * 0.4, 9, 4, -0.6, 0, Math.PI * 2); ctx.fill();
    ctx.translate(0, -boy); ctx.fillStyle = renk;
    for (let i = 0; i < 5; i++) { ctx.rotate((Math.PI * 2) / 5); ctx.beginPath(); ctx.ellipse(0, -9, 6, 9, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#FFD447"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function tas(ctx, x, y, n, durum, t) {
    /* durum: 0 normal, 1 seçildi (çocuğun tahmini), 2 doğru hedef, 3 başlangıç */
    ctx.save();
    ctx.fillStyle = "rgba(40,60,30,.25)"; ctx.beginPath(); ctx.ellipse(x, y + 22, 56, 14, 0, 0, Math.PI * 2); ctx.fill();
    const yan = ctx.createLinearGradient(0, y - 4, 0, y + 22); yan.addColorStop(0, "#8C7B6B"); yan.addColorStop(1, "#5E5246");
    ctx.fillStyle = yan; ctx.beginPath(); ctx.ellipse(x, y + 8, 54, 22, 0, 0, Math.PI); ctx.lineTo(x - 54, y); ctx.ellipse(x, y, 54, 20, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
    const ust = ctx.createRadialGradient(x - 18, y - 10, 4, x, y, 60);
    const renk = durum === 1 ? ["#FFE38A", "#E9B23B"] : durum === 2 ? ["#C9F2B4", "#5DB65A"] : durum === 3 ? ["#CFE6FF", "#7FA8D9"] : ["#EDE6DC", "#B9AD9E"];
    ust.addColorStop(0, renk[0]); ust.addColorStop(1, renk[1]); ctx.fillStyle = ust; ctx.beginPath(); ctx.ellipse(x, y, 54, 20, 0, 0, Math.PI * 2); ctx.fill();
    if (durum === 1) { ctx.strokeStyle = "rgba(255,200,60," + (0.5 + 0.5 * Math.sin(t * 6)) + ")"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, 62, 26, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "rgba(30,40,60,.55)"; ctx.lineWidth = 6; ctx.font = "800 40px Nunito, 'Baloo 2', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.strokeText(n, x, y + 52); ctx.fillText(n, x, y + 52);
    ctx.restore();
  }
  function havuc(ctx, x, y, s, aci) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(aci || 0); ctx.scale(s, s);
    const g = ctx.createLinearGradient(-10, 0, 10, 0); g.addColorStop(0, "#FF9A3C"); g.addColorStop(1, "#E66A12");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-13, -10); ctx.quadraticCurveTo(0, -16, 13, -10); ctx.lineTo(2, 34); ctx.quadraticCurveTo(0, 38, -2, 34); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(150,60,10,.45)"; ctx.lineWidth = 2; [0, 9, 18].forEach((yy) => { ctx.beginPath(); ctx.moveTo(-8 + yy * 0.3, yy); ctx.lineTo(-2, yy + 2); ctx.stroke(); });
    ctx.fillStyle = "#3FA34D"; [[-6, -26, -0.5], [0, -30, 0], [6, -26, 0.5]].forEach(([lx, ly, r]) => { ctx.save(); ctx.translate(lx, -12); ctx.rotate(r); ctx.beginPath(); ctx.ellipse(0, ly / 2 + 6, 4, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
    ctx.restore();
  }
  /* Tavşan: sq dikey ölçek (esneme), yon 1 sağa -1 sola */
  function tavsan(ctx, x, y, o) {
    const { sq = 1, yon = 1, t = 0, kirp = 0, kulak = 0, gul = 0, havada = false } = o;
    ctx.save(); ctx.translate(x, y);
    if (!havada) { ctx.fillStyle = "rgba(30,50,20,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 50 / sq, 10, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.scale(yon / Math.sqrt(sq), sq);
    const nefes = havada ? 0 : Math.sin(t * 3) * 1.5;
    const kurk = "#F7F3EE", golge = "#DCD3C8", ic = "#F7B6C2";
    /* kuyruk */
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-46, -44, 16, 0, Math.PI * 2); ctx.fill();
    /* arka bacak */
    ctx.fillStyle = golge; ctx.beginPath(); ctx.ellipse(-22, -18, 32, 22, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = kurk; ctx.beginPath(); ctx.ellipse(-6, -4, 30, 9, 0, 0, Math.PI * 2); ctx.fill();
    /* gövde */
    const gv = ctx.createRadialGradient(-6, -70, 10, 0, -50, 70); gv.addColorStop(0, "#FFFFFF"); gv.addColorStop(1, golge);
    ctx.fillStyle = gv; ctx.beginPath(); ctx.ellipse(0, -48 - nefes, 44, 46 + nefes, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(16, -40 - nefes, 20, 26, 0.2, 0, Math.PI * 2); ctx.fill();
    /* ön ayak */
    ctx.fillStyle = kurk; ctx.beginPath(); ctx.ellipse(26, -6, 14, 8, 0, 0, Math.PI * 2); ctx.fill();
    /* kulaklar */
    const kul = (dx, aci, uz) => { ctx.save(); ctx.translate(dx, -128 - nefes); ctx.rotate(aci); ctx.fillStyle = golge; ctx.beginPath(); ctx.ellipse(0, -uz / 2, 15, uz / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = kurk; ctx.beginPath(); ctx.ellipse(-1, -uz / 2, 13, uz / 2 - 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = ic; ctx.beginPath(); ctx.ellipse(1, -uz / 2 + 4, 6, uz / 2 - 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
    const sw = Math.sin(t * 2.2) * 0.06 + kulak;
    kul(4, -0.32 - sw, 78); kul(26, 0.16 + sw * 1.4, 84);
    /* baş */
    const bs = ctx.createRadialGradient(16, -118, 6, 22, -104, 52); bs.addColorStop(0, "#FFFFFF"); bs.addColorStop(1, golge);
    ctx.fillStyle = bs; ctx.beginPath(); ctx.ellipse(22, -102 - nefes, 40, 34, 0, 0, Math.PI * 2); ctx.fill();
    /* yanak */
    ctx.fillStyle = "rgba(255,140,160,.45)"; ctx.beginPath(); ctx.ellipse(44, -90 - nefes, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
    /* göz */
    const gy = -108 - nefes;
    if (kirp > 0.5) { ctx.strokeStyle = "#2B2F3A"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(34, gy + 2, 8, 0.15 * Math.PI, 0.85 * Math.PI, gul > 0); ctx.stroke(); }
    else { ctx.fillStyle = "#2B2F3A"; ctx.beginPath(); ctx.ellipse(34, gy, 8, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(37, gy - 4, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(31, gy + 3, 1.6, 0, Math.PI * 2); ctx.fill(); }
    /* burun, ağız, bıyık */
    ctx.fillStyle = "#F08A9C"; ctx.beginPath(); ctx.moveTo(57, -98 - nefes); ctx.quadraticCurveTo(63, -96 - nefes, 60, -91 - nefes); ctx.quadraticCurveTo(55, -93 - nefes, 57, -98 - nefes); ctx.fill();
    ctx.strokeStyle = "#7A6A60"; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(58, -90 - nefes); ctx.quadraticCurveTo(56, -82 - nefes, gul ? 48 : 51, -84 - nefes + (gul ? 2 : 0)); ctx.stroke();
    ctx.strokeStyle = "rgba(120,110,100,.6)"; ctx.lineWidth = 1.6; [[-4, -2], [2, 4]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(56, -94 - nefes + a); ctx.lineTo(80, -98 - nefes + b * 2); ctx.stroke(); });
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
    short: "Sayı doğrusunda zıpla: ileri, geri, atlayarak sayma. İki takım havuç toplar.",
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
      let kamX = 0, parca = [], etiket = [], havuclar = [], zaman = 0, sonZ = performance.now(), cizBekle = 0;
      const tasX = (i) => i * ARALIK + 200;
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
      const soruMetni = (q) => "Tavşan " + ek(q.bas, "da") + ". " + q.k + " kez " + (q.d > 1 ? q.d + "'şer " : "") + (q.m === "ileri" ? "ileri" : "geri") + " zıplayacak. Nereye konar?";
      const afisCiz = () => {
        const q = S.soru;
        afis.replaceChildren(h("div.tv-soru", S.durum === "soru" ? soruMetni(q) : S.durum === "zipla" ? (q.m === "ileri" ? "+" : "−") + q.d + " … " + S.sayac + ". zıplama" : S.sonuc ? "Doğru! Tavşan " + ek(q.hedef, "e") + " kondu." : "Tavşan " + ek(q.hedef, "e") + " kondu. " + q.bas + (q.m === "ileri" ? " + " : " − ") + q.k * q.d + " = " + q.hedef),
          S.durum !== "zipla" ? h("div.tv-islem", q.bas + (q.d > 1 ? Array(q.k).fill((q.m === "ileri" ? " + " : " − ") + q.d).join("") : (q.m === "ileri" ? " + " : " − ") + q.k) + " = " + (S.durum === "bitti" ? q.hedef : "?")) : null);
      };
      const skorCiz = () => {
        if (!AYAR.takim) { skor.replaceChildren(h("div.tv-takim.tek", h("b", String(S.puan[0] + S.puan[1])), "havuç")); return; }
        skor.replaceChildren(...["Mavi takım", "Turuncu takım"].map((ad, i) => h("div.tv-takim.t" + i + (S.sira === i ? ".sirada" : ""), h("span", ad), h("b", String(S.puan[i])), h("i", "🥕"))));
      };
      const altCiz = () => {
        alt.replaceChildren(
          S.durum === "soru" ? h("div.tv-ipucu", (AYAR.takim ? (S.sira === 0 ? "Mavi" : "Turuncu") + " takım: " : "") + "tavşanın konacağı taşa dokun") : null,
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
        ac();
        if (S.durum !== "soru") return;
        const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W + kamX, y = ((e.clientY - r.top) / r.height) * H;
        if (y < ZEMIN - 160) return;
        const i = Math.round((x - 200) / ARALIK); if (i < 0 || i > enFazla() || i === S.soru.bas) return;
        S.tahmin = i; SES.tik(); basla();
      });
      const basla = () => {
        const q = S.soru; S.durum = "zipla"; S.hop = Array.from({ length: q.k }, (_, j) => q.bas + (q.m === "ileri" ? 1 : -1) * q.d * (j + 1)); S.hopT = -0.35; S.sayac = 0; afisCiz(); altCiz();
      };
      const toz = (x, y) => { for (let i = 0; i < 10; i++) parca.push({ x: x + rnd(-30, 30), y: y - 4, vx: rnd(-90, 90), vy: rnd(-90, -20), r: rnd(6, 13), omur: rnd(0.5, 0.8), y0: 0, tur: "toz", t: 0 }); };
      const kutla = (x, y) => { const R = ["#FFD447", "#FF8A5B", "#7FD1FF", "#B98CFF", "#7EE08A"]; for (let i = 0; i < 46; i++) { const a = rnd(0, Math.PI * 2), v = rnd(220, 560); parca.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 260, r: rnd(7, 13), omur: rnd(1.1, 1.8), tur: "yildiz", renk: R[i % 5], d: rnd(0, 6), t: 0 }); } };
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
        const hedefKam = T.clamp(tv.x - W * 0.42, 0, Math.max(0, tasX(enFazla()) + 200 - W));
        kamX += (hedefKam - kamX) * Math.min(1, dt * 3.2);
        parca.forEach((q) => { q.t += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += (q.tur === "toz" ? 60 : 700) * dt; q.vx *= q.tur === "toz" ? 0.94 : 0.995; });
        parca = parca.filter((q) => q.t < q.omur);
        etiket.forEach((q) => { q.t += dt; q.y -= 50 * dt; }); etiket = etiket.filter((q) => q.t < 1.2);
        havuclar.forEach((q) => { q.t += dt; q.vy += 900 * dt; q.y += q.vy * dt; if (q.y > ZEMIN - 30) { q.y = ZEMIN - 30; q.vy *= -0.35; } });
        havuclar = havuclar.filter((q) => q.t < 2.4);
      };
      const ciz = () => {
        const sc = cv.width / W; ctx.setTransform(sc, 0, 0, sc, 0, 0);
        /* gökyüzü */
        const gk = ctx.createLinearGradient(0, 0, 0, ZEMIN); gk.addColorStop(0, "#7EC8F7"); gk.addColorStop(0.7, "#BFE6FF"); gk.addColorStop(1, "#E9F7FF");
        ctx.fillStyle = gk; ctx.fillRect(0, 0, W, H);
        /* güneş */
        const gx = 1340 - kamX * 0.03, gn = ctx.createRadialGradient(gx, 140, 10, gx, 140, 170); gn.addColorStop(0, "rgba(255,246,190,1)"); gn.addColorStop(0.35, "rgba(255,230,120,.9)"); gn.addColorStop(1, "rgba(255,230,120,0)");
        ctx.fillStyle = gn; ctx.beginPath(); ctx.arc(gx, 140, 170, 0, Math.PI * 2); ctx.fill();
        /* bulutlar */
        for (let i = 0; i < 6; i++) { const bx = ((i * 420 + zaman * (12 + i * 3) - kamX * 0.12) % (W + 500) + W + 500) % (W + 500) - 250; bulut(ctx, bx, 90 + hash(i) * 170, 0.8 + hash(i + 9) * 0.7, 0.85); }
        /* tepeler */
        tepe(ctx, kamX, 0.15, 470, 170, "#A8D8B0", "#CDEBCF", 1.3);
        tepe(ctx, kamX, 0.35, 540, 150, "#7CC487", "#A9DBA9", 4.1);
        tepe(ctx, kamX, 0.6, 600, 110, "#5BAE5F", "#86C982", 7.7);
        /* çimen zemini */
        const cm = ctx.createLinearGradient(0, ZEMIN - 40, 0, H); cm.addColorStop(0, "#69BA5A"); cm.addColorStop(1, "#3F8E3B");
        ctx.fillStyle = cm; ctx.beginPath(); ctx.moveTo(0, ZEMIN - 30); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, ZEMIN - 30 + Math.sin((x + kamX) / 60) * 5); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
        /* çiçekler (arka) */
        const ilk = Math.floor(kamX / 70) - 1;
        for (let i = ilk; i < ilk + W / 70 + 3; i++) { if (hash(i) < 0.45) continue; const wx = i * 70 + hash(i + 3) * 40; cicek(ctx, wx - kamX, ZEMIN - 44 - hash(i + 5) * 10, zaman, ["#FF7AA2", "#FFFFFF", "#B48CFF", "#FFB347"][Math.floor(hash(i + 7) * 4)], 26 + hash(i + 1) * 26); }
        /* sayı taşları */
        const q = S.soru, i0 = Math.max(0, Math.floor((kamX - 200) / ARALIK) - 1), i1 = Math.min(enFazla(), Math.ceil((kamX + W - 200) / ARALIK) + 1);
        /* zıplama yayları (izler) */
        if (q && S.durum !== "soru") {
          ctx.save(); ctx.setLineDash([10, 12]); ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineCap = "round";
          const yapilan = S.sayac; for (let j = 0; j < yapilan; j++) { const a = q.bas + (q.m === "ileri" ? 1 : -1) * q.d * j, b = a + (q.m === "ileri" ? 1 : -1) * q.d; const xa = tasX(a) - kamX, xb = tasX(b) - kamX; ctx.beginPath(); ctx.moveTo(xa, ZEMIN - 30); ctx.quadraticCurveTo((xa + xb) / 2, ZEMIN - 260, xb, ZEMIN - 30); ctx.stroke(); }
          ctx.restore();
        }
        for (let i = i0; i <= i1; i++) {
          const durum = q && S.durum === "bitti" && i === q.hedef ? 2 : q && i === S.tahmin ? 1 : q && i === q.bas && S.durum === "soru" ? 3 : 0;
          tas(ctx, tasX(i) - kamX, ZEMIN + 6, i, durum, zaman);
        }
        /* havuçlar */
        havuclar.forEach((c) => havuc(ctx, c.x - kamX, c.y, 1.4, Math.sin(c.t * 8) * 0.2));
        /* tavşan */
        tavsan(ctx, tv.x - kamX, tv.y - 4, { sq: tv.sq, yon: tv.yon, t: zaman, kirp: tv.kirp || (S.sonuc && S.durum === "bitti" ? 1 : 0), kulak: tv.kulak + (tv.havada ? -0.25 : 0), gul: S.sonuc ? 1 : 0, havada: tv.havada });
        /* etiketler */
        etiket.forEach((e) => { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - e.t / 1.2); ctx.font = "900 54px Nunito, 'Baloo 2', system-ui, sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 9; ctx.strokeStyle = "rgba(30,40,70,.6)"; ctx.fillStyle = "#FFE066"; ctx.strokeText(e.metin, e.x - kamX, e.y); ctx.fillText(e.metin, e.x - kamX, e.y); ctx.restore(); });
        /* parçacıklar */
        parca.forEach((p) => {
          const a = 1 - p.t / p.omur; ctx.save(); ctx.globalAlpha = Math.max(0, a);
          if (p.tur === "toz") { ctx.fillStyle = "#E8DCC6"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + p.t * 1.5), 0, Math.PI * 2); ctx.fill(); }
          else { ctx.translate(p.x, p.y); ctx.rotate(p.d + p.t * 6); ctx.fillStyle = p.renk; ctx.beginPath(); for (let k = 0; k < 10; k++) { const rr = k % 2 ? p.r * 0.45 : p.r; const aa = (k / 10) * Math.PI * 2; ctx.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } ctx.fill(); }
          ctx.restore();
        });
        /* alt kenar gölgesi */
        const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,30,10,.18)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      };
      const dongu = (z) => {
        if (!cv.isConnected) return;
        const dt = Math.min(0.05, (z - sonZ) / 1000); sonZ = z;
        if (++cizBekle % 30 === 1) boyut();
        adim(dt); ciz(); requestAnimationFrame(dongu);
      };
      ayarCiz(); yeniSoru(); kamX = T.clamp(tv.x - W * 0.42, 0, 1e9);
      requestAnimationFrame((z) => { sonZ = z; boyut(); dongu(z); });
    },
  };
})();
