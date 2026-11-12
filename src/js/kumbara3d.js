/* Kumbaram (3B): ahşap masaya dökülen gerçekçi TL madenî paralar ve banknotlar.
   Banknotlar TCMB çoğaltma kuralına göre çizilir: gerçek renk ve oran, portre yok, üzerinde "ÖRNEKTİR GEÇMEZ". */
(function () {
  const Sh = T.Sahne;
  let THREE_P = null;
  const three = () => THREE_P || (THREE_P = import(new URL("vendor/three/three.module.min.js", location.href).href));
  /* E9 emisyon: hâkim renkler ve oranlar (mm) */
  const BANKNOT = { 5: ["#6A4A7C", "#B38DBA", 130, 64], 10: ["#A3242E", "#E07D7C", 136, 64], 20: ["#1F7448", "#7EC496", 142, 68], 50: ["#C2681A", "#EFAE62", 148, 68], 100: ["#1F568F", "#7DAAD9", 154, 72], 200: ["#953A70", "#D98DB8", 160, 72] };
  const MADENI = { 0.01: ["kr", 1, "#B8763B", 16.5], 0.05: ["kr", 5, "#C9A24A", 17.5], 0.1: ["kr", 10, "#C9A24A", 18.5], 0.25: ["kr", 25, "#C9A24A", 20.5], 0.5: ["kr", 50, "#D9D9D9", 23.85], 1: ["TL", 1, "bimetal", 26.15] };
  const doku = (THREE, w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const GUILLOCHE = (c, x, y, r, renk, n = 36) => { c.strokeStyle = renk; c.lineWidth = 1; for (let k = 0; k < n; k++) { c.beginPath(); for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.05) { const rr = r * (0.6 + 0.4 * Math.sin(a * 6 + k * 0.35)); const px = x + Math.cos(a + k * 0.17) * rr, py = y + Math.sin(a + k * 0.17) * rr * 0.8; a ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); } };
  const GORSEL = {};
  const gorselAnahtar = (v) => "ta-banknot-" + v;
  const gorselYukle = (v) => new Promise((res) => { let d = null; try { d = localStorage.getItem(gorselAnahtar(v)); } catch (e) {} if (!d) return res(null); const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = d; });
  const ornekBandi = (c, w, h) => { c.save(); c.translate(w / 2, h / 2); c.rotate(-Math.atan2(h, w)); let fs = Math.round(h * 0.2); c.font = "900 " + fs + "px Arial, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; while (c.measureText("ÖRNEKTİR GEÇMEZ").width < Math.hypot(w, h) * 0.78) { fs += 4; c.font = "900 " + fs + "px Arial, sans-serif"; } c.strokeStyle = "rgba(160,20,20,.8)"; c.lineWidth = 5; c.strokeText("ÖRNEKTİR GEÇMEZ", 0, 0); c.fillStyle = "rgba(220,40,40,.35)"; c.fillText("ÖRNEKTİR GEÇMEZ", 0, 0); c.restore(); };
  const banknotDoku = (THREE, v) => { const [koyu, acik, gw, gh] = BANKNOT[v]; const im = GORSEL[v]; if (im) return doku(THREE, 1024, Math.round((1024 * gh) / gw), (c, w, h) => { const o = Math.max(w / im.width, h / im.height); c.drawImage(im, (w - im.width * o) / 2, (h - im.height * o) / 2, im.width * o, im.height * o); ornekBandi(c, w, h); }); return doku(THREE, 1024, Math.round((1024 * gh) / gw), (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, koyu); g.addColorStop(0.35, acik); g.addColorStop(0.65, acik); g.addColorStop(1, koyu); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.globalAlpha = 0.45; for (let i = 0; i < 70; i++) { c.strokeStyle = koyu; c.lineWidth = 0.8; c.beginPath(); for (let x = 0; x <= w; x += 8) { const y = (i / 70) * h + Math.sin(x / 40 + i * 0.5) * 10; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } c.globalAlpha = 1;
    c.globalAlpha = 0.55; GUILLOCHE(c, w * 0.28, h * 0.52, h * 0.34, koyu); GUILLOCHE(c, w * 0.85, h * 0.3, h * 0.18, koyu, 20); c.globalAlpha = 1;
    /* filigran alanı (portre yerine boş oval) */
    const fg = c.createRadialGradient(w * 0.72, h * 0.52, 4, w * 0.72, h * 0.52, h * 0.36); fg.addColorStop(0, "rgba(255,255,255,.85)"); fg.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = fg; c.beginPath(); c.ellipse(w * 0.72, h * 0.52, h * 0.28, h * 0.36, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = koyu; c.lineWidth = 6; c.strokeRect(14, 14, w - 28, h - 28); c.lineWidth = 1.5; c.strokeRect(26, 26, w - 52, h - 52);
    /* TCMB kuralı: köşegen ÖRNEKTİR GEÇMEZ (uzunluk ≥ %75, yükseklik ≥ genişliğin %15'i) */
    c.save(); c.translate(w / 2, h / 2); c.rotate(-Math.atan2(h, w)); c.font = "900 " + Math.round(h * 0.2) + "px Arial, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
    let fs = Math.round(h * 0.2); while (c.measureText("ÖRNEKTİR GEÇMEZ").width < Math.hypot(w, h) * 0.78) { fs += 4; c.font = "900 " + fs + "px Arial, sans-serif"; }
    c.strokeStyle = "rgba(160,20,20,.7)"; c.lineWidth = 4; c.strokeText("ÖRNEKTİR GEÇMEZ", 0, 0); c.fillStyle = "rgba(200,30,30,.28)"; c.fillText("ÖRNEKTİR GEÇMEZ", 0, 0); c.restore();
    c.fillStyle = koyu; c.font = "700 30px Georgia, serif"; c.textAlign = "left"; c.fillText("TÜRKİYE CUMHURİYET MERKEZ BANKASI", 48, 70);
    c.font = "900 190px Georgia, serif"; c.textAlign = "left"; c.lineWidth = 10; c.strokeStyle = "rgba(255,255,255,.9)"; c.strokeText(String(v), 52, h - 50); c.fillText(String(v), 52, h - 50); c.textAlign = "right"; c.font = "900 120px Georgia, serif"; c.lineWidth = 8; c.strokeStyle = "rgba(255,255,255,.9)"; c.strokeText(String(v), w - 50, 140); c.fillText(String(v), w - 50, 140);
    c.font = "700 34px Georgia, serif"; c.fillText(v === 5 ? "BEŞ TÜRK LİRASI" : v === 10 ? "ON TÜRK LİRASI" : v === 20 ? "YİRMİ TÜRK LİRASI" : v === 50 ? "ELLİ TÜRK LİRASI" : v === 100 ? "YÜZ TÜRK LİRASI" : "İKİ YÜZ TÜRK LİRASI", w - 50, h - 60);

  }); };
  const madeniYuz = (THREE, v) => { const [bir, sayi, renk] = MADENI[v]; return doku(THREE, 512, 512, (c, w, h) => {
    const m = (r, a, b) => { const g = c.createRadialGradient(w * 0.4, h * 0.35, 10, w / 2, h / 2, r); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
    if (renk === "bimetal") { c.fillStyle = m(256, "#F2F2F0", "#9A9A98"); c.fillRect(0, 0, w, h); c.fillStyle = m(170, "#F5DA86", "#B8902E"); c.beginPath(); c.arc(w / 2, h / 2, 170, 0, Math.PI * 2); c.fill(); }
    else { const [a, b] = renk === "#D9D9D9" ? ["#F4F4F2", "#9C9C9A"] : renk === "#B8763B" ? ["#E9A46A", "#8A4E1E"] : ["#F3D98A", "#A9852E"]; c.fillStyle = m(256, a, b); c.fillRect(0, 0, w, h); }
    for (let i = 0; i < 3000; i++) { c.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    const kabart = (metin, x, y, font) => { c.font = font; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "rgba(255,255,255,.55)"; c.fillText(metin, x - 2, y - 2); c.fillStyle = "rgba(40,30,10,.55)"; c.fillText(metin, x + 2, y + 2); c.fillStyle = "rgba(0,0,0,.08)"; c.fillText(metin, x, y); };
    c.strokeStyle = "rgba(40,30,10,.35)"; c.lineWidth = 6; c.beginPath(); c.arc(w / 2, h / 2, 236, 0, Math.PI * 2); c.stroke();
    const yazi = "TÜRKİYE CUMHURİYETİ • 2026 • "; c.font = "700 30px Georgia, serif"; for (let i = 0; i < yazi.length; i++) { const a = -Math.PI / 2 + (i / yazi.length) * Math.PI * 2; c.save(); c.translate(w / 2 + Math.cos(a) * 205, h / 2 + Math.sin(a) * 205); c.rotate(a + Math.PI / 2); c.fillStyle = "rgba(40,30,10,.5)"; c.fillText(yazi[i], 0, 0); c.restore(); }
    kabart(String(sayi), w / 2, h / 2 - 18, "900 " + (sayi >= 10 ? 170 : 200) + "px Georgia, serif");
    kabart(bir === "TL" ? "TÜRK LİRASI" : "KURUŞ", w / 2, h / 2 + 110, "800 44px Georgia, serif");
  }); };
  const tahta = (THREE) => doku(THREE, 1024, 1024, (c, w, h) => { c.fillStyle = "#8E5A32"; c.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++) { const y = Math.random() * h; c.strokeStyle = Math.random() < 0.5 ? "rgba(50,25,8,.2)" : "rgba(255,210,160,.1)"; c.lineWidth = 1 + Math.random() * 3; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 16) c.lineTo(x, y + Math.sin(x / 70 + i) * 5); c.stroke(); } for (let k = 1; k < 4; k++) { c.fillStyle = "rgba(30,15,5,.35)"; c.fillRect(0, (k * h) / 4, w, 3); } });

  const tl = (v) => (Math.round(v * 100) % 100 ? v.toFixed(2).replace(".", ",") : String(Math.round(v))) + " TL";
  const OYUN = T.tools["oyun-para-say"]; if (!OYUN) return;
  OYUN.render = function (host) {
    const g = T.store.grade(); let L = g <= 1 ? 0 : g <= 3 ? 1 : 2;
    const D = { takim: true, puan: [0, 0], sira: 0, simge: "🪙" };
    const kap = T.h("div.sh-kap.d3-kap"), ust = T.h("div.sh-ust"), yuk = T.h("div.d3-yuk", "Paralar masaya dökülüyor...");
    kap.append(yuk, ust); host.append(kap);
    const afis = T.h("div.tv-afis"), skor = T.h("div.tv-skor"), alt = T.h("div.tv-alt"); ust.append(afis, skor, alt);
    const ayar = T.h("div.row.tv-ayar"); host.append(ayar);
    Promise.all(Object.keys(BANKNOT).map((v) => gorselYukle(v).then((im) => (GORSEL[v] = im)))).then(three).then(kur).catch(() => (yuk.textContent = "Bu cihazda 3B çizim açılamadı."));
    function kur(THREE) {
      let r; try { r = new THREE.WebGLRenderer({ antialias: true }); } catch (e) { yuk.textContent = "Bu cihazda 3B çizim açılamadı."; return; }
      yuk.remove(); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.82; r.outputColorSpace = THREE.SRGBColorSpace;
      kap.prepend(r.domElement); r.domElement.className = "sh-cv";
      const sahne = new THREE.Scene(); sahne.background = new THREE.Color(0x3a2a1e);
      { const env = doku(THREE, 512, 256, (c, w, h) => { const gg = c.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, "#FFF6E6"); gg.addColorStop(0.5, "#C9B08A"); gg.addColorStop(1, "#3E2A18"); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.fillStyle = "#fff"; c.fillRect(w * 0.2, h * 0.1, w * 0.15, h * 0.25); }); env.mapping = THREE.EquirectangularReflectionMapping; const pm = new THREE.PMREMGenerator(r); sahne.environment = pm.fromEquirectangular(env).texture; pm.dispose(); }
      const kamera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 100); kamera.position.set(0, 11, 7.5); kamera.lookAt(0, 0, 0.4);
      sahne.add(new THREE.HemisphereLight(0xfff2dc, 0x553a22, 0.7));
      const gun = new THREE.DirectionalLight(0xfff0d8, 2.1); gun.position.set(-4, 10, 4); gun.castShadow = true; gun.shadow.mapSize.set(2048, 2048); Object.assign(gun.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7 }); gun.shadow.bias = -0.0005; sahne.add(gun);
      const td = tahta(THREE); td.wrapS = td.wrapT = THREE.RepeatWrapping; td.repeat.set(2, 1.2);
      const masa = new THREE.Mesh(new THREE.PlaneGeometry(30, 18), new THREE.MeshStandardMaterial({ map: td, roughness: 0.7 })); masa.rotation.x = -Math.PI / 2; masa.receiveShadow = true; sahne.add(masa);
      const OLCEK = 0.027; /* 1 mm = 0.045 birim */
      const nesneler = []; const onbellek = {};
      const madeni = (v) => {
        const [, , renk, cap] = MADENI[v], rad = (cap / 2) * OLCEK * 1.9, kal = 0.09;
        const yuz = onbellek["m" + v] || (onbellek["m" + v] = madeniYuz(THREE, v));
        const yan = new THREE.MeshStandardMaterial({ color: renk === "bimetal" ? 0xc8c8c6 : renk === "#D9D9D9" ? 0xd6d6d4 : renk === "#B8763B" ? 0xb8763b : 0xd2ad55, metalness: 1, roughness: 0.32 });
        const ust = new THREE.MeshStandardMaterial({ map: yuz, metalness: 0.85, roughness: 0.3 });
        const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, kal, 72), [yan, ust, ust]); m.castShadow = m.receiveShadow = true; m.userData = { v, y0: kal / 2 }; return m;
      };
      const kagit = (v) => {
        const [, , gw, gh] = BANKNOT[v], w = gw * OLCEK, hh = gh * OLCEK;
        const geo = new THREE.PlaneGeometry(w, hh, 24, 6); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / w) * Math.PI * 2) * 0.03 + Math.cos((p.getY(i) / hh) * Math.PI) * 0.02); geo.computeVertexNormals();
        const tx = onbellek["b" + v] || (onbellek["b" + v] = banknotDoku(THREE, v));
        const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tx, roughness: 0.85, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.castShadow = m.receiveShadow = true; m.userData = { v, y0: 0.03 }; return m;
      };
      let R = null, durum = "soru", sallama = 0;
      const temizle = () => { nesneler.forEach((n) => sahne.remove(n)); nesneler.length = 0; };
      const yeni = () => {
        const vals = L === 0 ? [1, 5, 10] : L === 1 ? [5, 10, 20, 50] : [0.25, 0.5, 1, 5, 10, 0.1];
        const n = Math.floor(Sh.rnd(2, L ? 6 : 5)), sec = Array.from({ length: n }, () => T.pick(vals)).sort((a, b) => b - a);
        const ans = Math.round(sec.reduce((a, b) => a + b, 0) * 100) / 100;
        const o = new Set([ans]); let k = 0; while (o.size < 4 && k++ < 50) { const d = T.pick(vals) * (Math.random() < 0.5 ? 1 : -1); const v = Math.round((ans + d) * 100) / 100; if (v > 0) o.add(v); }
        R = { sec, ans, opts: T.shuffle([...o]) }; durum = "soru"; temizle();
        const notlar = sec.filter((v) => v >= 5), paralar = sec.filter((v) => v < 5);
        notlar.forEach((v, i) => { const m = kagit(v); const sira = notlar.length > 3 ? (i < Math.ceil(notlar.length / 2) ? 0 : 1) : 0, ks = sira ? Math.floor(notlar.length / 2) : notlar.length > 3 ? Math.ceil(notlar.length / 2) : notlar.length, j = sira ? i - Math.ceil(notlar.length / 2) : i; m.position.set((j - (ks - 1) / 2) * 4.6 + Sh.rnd(-0.2, 0.2), 0, (notlar.length > 3 ? -2.5 : -1.6) + sira * 2.1 + Sh.rnd(-0.2, 0.2)); m.rotation.z = Sh.rnd(-0.25, 0.25); m.position.y = 3 + i * 0.6; m.userData.dusus = 0; m.userData.gecik = i * 0.12; sahne.add(m); nesneler.push(m); });
        paralar.forEach((v, i) => { const m = madeni(v); m.position.set((i - (paralar.length - 1) / 2) * 1.8 + Sh.rnd(-0.2, 0.2), 0, (notlar.length > 3 ? 2.3 : 1.2) + Sh.rnd(-0.2, 0.2)); m.rotation.set(Sh.rnd(-0.6, 0.6), Sh.rnd(0, 6), Sh.rnd(-0.6, 0.6)); m.position.y = 3 + i * 0.5; m.userData.dusus = 0; m.userData.gecik = 0.3 + i * 0.12; sahne.add(m); nesneler.push(m); });
        Sh.ses.hisirti(); ciz();
      };
      const ciz = () => {
        afis.replaceChildren(T.h("div.tv-soru", durum === "soru" ? "Masadaki paraların toplamı kaç lira?" : durum === "dogru" ? "Doğru! Toplam " + tl(R.ans) : "Doğrusu " + tl(R.ans) + ". Büyük paralardan başlayarak say."));
        Sh.skor(skor, D);
        alt.replaceChildren(...(durum === "soru" ? R.opts.map((v) => T.h("button.btn.big.c-chalk.d3-sec", { style: { fontSize: "clamp(20px,2.4vw,34px)" }, onclick: () => sec(v) }, tl(v))) : [T.h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (D.takim) D.sira = 1 - D.sira; yeni(); } }, "Sonraki")]));
        ayar.replaceChildren(T.h("div.seg", [[0, "1, 5, 10 lira"], [1, "5-50 lira"], [2, "Kuruşlar da"]].map(([k, l]) => T.h("button", { "aria-pressed": String(L === k), onclick: () => { L = k; yeni(); } }, l))),
          T.h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([k, l]) => T.h("button", { "aria-pressed": String(D.takim === k), onclick: () => { D.takim = k; ciz(); } }, l))),
          T.h("div.spacer"), T.h("button.btn.sm.c-chalk", { onclick: gorselPenceresi }, "Banknot görselleri"), T.h("button.btn.sm.c-chalk", { onclick: () => { D.puan = [0, 0]; ciz(); } }, T.icon("reset"), "Skoru sıfırla"),
          T.h("button.btn.sm.c-chalk", { onclick: () => { try { (kap.requestFullscreen || kap.webkitRequestFullscreen).call(kap); } catch (e) {} } }, T.icon("full"), "Tam ekran"));
      };
      const gorselPenceresi = () => {
        const satir = (v) => { const dur = T.h("span.hint", GORSEL[v] ? "Yüklendi" : "Çizim kullanılıyor");
          const inp = T.h("input", { type: "file", accept: "image/*", style: { display: "none" }, onchange: (e) => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { const c = document.createElement("canvas"), o = Math.min(1, 1100 / im.width); c.width = Math.round(im.width * o); c.height = Math.round(im.height * o); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); try { localStorage.setItem(gorselAnahtar(v), c.toDataURL("image/jpeg", 0.82)); GORSEL[v] = c; delete onbellek["b" + v]; dur.textContent = "Yüklendi"; yeni(); } catch (x) { dur.textContent = "Cihazda yer kalmadı, daha küçük bir görsel dene."; } URL.revokeObjectURL(im.src); }; im.src = URL.createObjectURL(f); } });
          return T.h("div.row", { style: { gap: "8px", alignItems: "center" } }, T.h("b", { style: { minWidth: "70px" } }, v + " TL"), T.h("button.btn.sm.c-chalk", { onclick: () => inp.click() }, "Görsel seç"), GORSEL[v] ? T.h("button.btn.sm.c-chalk", { onclick: () => { try { localStorage.removeItem(gorselAnahtar(v)); } catch (x) {} GORSEL[v] = null; delete onbellek["b" + v]; dur.textContent = "Çizim kullanılıyor"; yeni(); } }, "Kaldır") : null, dur, inp); };
        T.modal({ title: "Banknot görselleri", body: T.h("div", { style: { display: "grid", gap: "10px" } }, T.h("p.hint", { style: { margin: 0 } }, "Her banknotun ön yüz görselini kendi cihazından seç. Görseller yalnızca bu cihazda saklanır, internete gönderilmez. TCMB kuralı gereği üzerine ÖRNEKTİR GEÇMEZ yazısı kendiliğinden eklenir."), ...Object.keys(BANKNOT).map((v) => satir(+v))), actions: [{ label: "Tamam", tone: "c-leaf" }] });
      };
      const sec = (v) => { if (durum !== "soru") return; if (v === R.ans) { durum = "dogru"; Sh.ses.dogru(); T.konfeti && T.konfeti(); D.puan[D.takim ? D.sira : 0]++; } else { durum = "yanlis"; Sh.ses.yanlis(); sallama = 0.5; } ciz(); };
      r.domElement.addEventListener("pointerdown", () => Sh.ac());
      let son = performance.now(), say = 0, zaman = 0;
      const dongu = (z) => {
        if (!r.domElement.isConnected) { r.dispose(); return; }
        const dt = Math.min(0.05, (z - son) / 1000); son = z; zaman += dt;
        if (say++ % 20 === 0) { const b = kap.getBoundingClientRect(); if (b.width) { r.setSize(b.width, b.height, false); kamera.aspect = b.width / b.height; kamera.updateProjectionMatrix(); } }
        nesneler.forEach((m) => { const u = m.userData; if (u.bitti) return; u.dusus += dt; if (u.dusus < u.gecik) return; const p = Math.min(1, (u.dusus - u.gecik) / 0.45); const y = u.y0 + (1 - p * p) * 3; m.position.y = y; if (m.geometry.type === "CylinderGeometry") { m.rotation.x *= 0.9; m.rotation.z *= 0.9; } if (p >= 1) { u.bitti = true; m.position.y = u.y0; if (m.geometry.type === "CylinderGeometry") { m.rotation.x = 0; m.rotation.z = 0; Sh.ton(1800 + Math.random() * 600, 1500, 0.15, "sine", 0.05); } } });
        if (sallama > 0) { sallama -= dt; kamera.position.x = Math.sin(zaman * 60) * sallama * 0.2; } else kamera.position.x = Math.sin(zaman * 0.3) * 0.15;
        kamera.lookAt(0, 0, 0.4); r.render(sahne, kamera); requestAnimationFrame(dongu);
      };
      yeni(); requestAnimationFrame((z) => { son = z; dongu(z); });
    }
  };
})();
