/* Okuma tiyatrosu 3B: gerçek dokulu, iskeletli kedi modeli, ışıklı sahne. WebGL ya da model açılmazsa çizim sürüm çalışır. */
(function () {
  const arac = T.tools["okuma-tiyatrosu"]; if (!arac) return;
  const eskiRender = arac.render, { h } = T;
  const io = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2), cik = (t) => 1 - Math.pow(1 - t, 3), lerp = (a, b, t) => a + (b - a) * t;
  let YUK = null;
  T.modelYukle = (ad) => {
    YUK = YUK || T.three().then(() => import(new URL("vendor/three/yukleyici.module.min.js", location.href).href));
    T._modeller = T._modeller || {};
    return T._modeller[ad] || (T._modeller[ad] = YUK.then((m) => new Promise((ok, red) => { const L = new m.GLTFLoader(); L.setMeshoptDecoder(m.MeshoptDecoder); L.load(new URL("vendor/modeller/" + ad + ".glb", location.href).href, (g) => ok({ g, m }), undefined, red); })));
  };

  /* ---- cümle kurucu: eylemler parçalardan kurulur, yanlış oyun tek ayrıntıda ayrışır ---- */
  const SAYI = ["", "bir", "iki", "üç"];
  const RENK = { kirmizi: "kırmızı", mavi: "mavi" };
  const E = {
    zipla: { no: (p) => "zıplama", e: (p) => (p.n > 1 ? `${SAYI[p.n]} kez zıpla` : "zıpla"), f: (p) => (p.n > 1 ? `${SAYI[p.n]} kez zıpladı` : "zıpladı"), o: () => "zıplamadı", p: () => ({ n: T.pick([1, 2, 3]) }) },
    masa: { no: (p) => "masaya zıplama", e: () => "masaya zıpla", f: () => "masaya zıpladı", o: () => "masaya zıplamadı" },
    kutu: { no: (p) => "kutuya girme", e: () => "kutuya gir", f: () => "kutuya girdi", o: () => "kutuya girmedi" },
    saklan: { no: (p) => "kutunun arkasına saklanma", e: () => "kutunun arkasına saklan", f: () => "kutunun arkasına saklandı", o: () => "kutunun arkasına saklanmadı" },
    masaAlt: { no: (p) => "masanın altına girme", e: () => "masanın altına gir", f: () => "masanın altına girdi", o: () => "masanın altına girmedi" },
    top: { no: (p) => `${RENK[p.renk]} topla oynama`, e: (p) => `${RENK[p.renk]} topla oyna`, f: (p, sv) => `${RENK[p.renk]} topla oynadı`, o: (p) => `${RENK[p.renk]} topla oynamadı`, p: () => ({ renk: T.pick(["kirmizi", "mavi"]) }) },
    sut: { no: (p) => "sütünü içme", e: () => "sütünü iç", f: () => "sütünü içti", o: () => "sütünü içmedi" },
    uyku: { no: (p) => "halıda uyuma", e: () => "halıda uyu", f: () => "halıda uyudu", o: () => "halıda uyumadı" },
    miyav: { no: (p) => "miyavlama", e: (p) => (p.n > 1 ? `${SAYI[p.n]} kez miyavla` : "miyavla"), f: (p) => (p.n > 1 ? `${SAYI[p.n]} kez miyavladı` : "miyavladı"), o: () => "miyavlamadı", p: () => ({ n: T.pick([1, 2, 3]) }) },
    pencere: { no: (p) => "pencereden bakma", e: () => "pencereden dışarı bak", f: () => "pencereden dışarı baktı", o: () => "pencereden bakmadı" },
    kos: { no: (p) => "halının etrafında koşma", e: () => "halının etrafında koş", f: () => "halının etrafında koştu", o: () => "halının etrafında koşmadı" },
    kuyruk: { no: (p) => "kuyruğunu sallama", e: () => "kuyruğunu salla", f: () => "kuyruğunu salladı", o: () => "kuyruğunu sallamadı" },
    don: { no: (p) => "kendi etrafında dönme", e: (p) => (p.n > 1 ? `kendi etrafında ${SAYI[p.n]} kez dön` : "kendi etrafında dön"), f: (p) => (p.n > 1 ? `kendi etrafında ${SAYI[p.n]} kez döndü` : "kendi etrafında döndü"), o: () => "kendi etrafında dönmedi", p: () => ({ n: T.pick([1, 2]) }) },
    kase: { no: (p) => "kâseye gitme", e: (p) => (p.hiz === "yavas" ? "kâseye doğru yavaş yavaş yürü" : "kâseye doğru hızlıca koş"), f: (p) => (p.hiz === "yavas" ? "kâseye doğru yavaş yavaş yürüdü" : "kâseye doğru hızlıca koştu"), o: () => "kâseye gitmedi", p: () => ({ hiz: T.pick(["yavas", "hizli"]) }) },
  };
  const yap = (t, p) => ({ t, p: p || (E[t].p ? E[t].p() : {}) });
  const uygun = () => Object.keys(E);
  const cumleBas = (s) => "Kedi " + s;
  /* tek bir ayrıntıyı bozan değişiklik */
  function boz(e, sv, yasak, yon) {
    const CD = yon ? "Yönergede" : "Cümlede";
    const k = E[e.t];
    if (sv > 1 && e.p.n) { const n = T.pick([1, 2, 3].filter((x) => x !== e.p.n)); return { e: yap(e.t, { n }), fark: `${CD} ${e.p.n > 1 ? SAYI[e.p.n] + " kez" : "bir kez"} yazıyordu, kedi ${n > 1 ? SAYI[n] + " kez" : "bir kez"} yaptı.` }; }
    if (sv > 1 && e.p.renk) { const r = e.p.renk === "mavi" ? "kirmizi" : "mavi"; return { e: yap("top", { renk: r }), fark: `${CD} ${RENK[e.p.renk]} top yazıyordu, kedi ${RENK[r]} topla oynadı.` }; }
    if (sv > 1 && e.p.hiz) { const hz = e.p.hiz === "yavas" ? "hizli" : "yavas"; return { e: yap("kase", { hiz: hz }), fark: `${CD} ${e.p.hiz === "yavas" ? "yavaş yavaş yürüdü" : "hızlıca koştu"} yazıyordu, kedi ${hz === "yavas" ? "yavaş yürüdü" : "koştu"}.` }; }
    const t = T.pick(uygun().filter((x) => x !== e.t && !yasak.includes(x)));
    const y = yap(t);
    return { e: y, fark: `${CD} "${yon ? k.e(e.p) : k.f(e.p, sv)}" yazıyordu, kedi ${E[t].f(y.p, 3)}.` };
  }
  const buyuk = (x) => x.charAt(0).toLocaleUpperCase("tr-TR") + x.slice(1);
  function soruUret(sv, yonerge) {
    const kip = sv === 4 ? T.pick(["uc", "olumsuz"]) : sv === 3 ? "iki" : "tek";
    const n = kip === "uc" ? 3 : kip === "iki" ? 2 : 1;
    let havuz = uygun();
    if (sv === 2) havuz = havuz.filter((k) => E[k].p);
    const sec = T.shuffle(havuz.slice()).slice(0, n + (kip === "olumsuz" ? 1 : 0));
    const dogru = sec.slice(0, n).map((t) => yap(t)), olumsuz = kip === "olumsuz" ? yap(sec[n]) : null;
    const ff = (e) => (yonerge ? E[e.t].e(e.p) : E[e.t].f(e.p, sv)), nf = (e) => (yonerge ? E[e.t].no(e.p) : E[e.t].o(e.p));
    let govde;
    if (kip === "tek") govde = ff(dogru[0]);
    else if (kip === "iki") govde = `önce ${ff(dogru[0])}, sonra ${ff(dogru[1])}`;
    else if (kip === "uc") govde = `önce ${ff(dogru[0])}, sonra ${ff(dogru[1])}, en son ${ff(dogru[2])}`;
    else govde = `${nf(olumsuz)}, ${ff(dogru[0])}`;
    const cumle = (yonerge ? "Kedi, " : "Kedi ") + govde + ".";
    const soru = { cumle, dogru, oyun: dogru.slice(), fark: "" };
    const CD = yonerge ? "Yönergede" : "Cümlede";
    if (Math.random() < 0.45) {
      if (olumsuz && Math.random() < 0.6) { soru.oyun = [olumsuz]; soru.fark = `${CD} "${nf(olumsuz)}" yazıyordu ama kedi tam bunu yaptı.`; }
      else if (n > 1 && Math.random() < 0.45) { const i = T.rand(0, n - 2); soru.oyun = dogru.slice(); [soru.oyun[i], soru.oyun[i + 1]] = [soru.oyun[i + 1], soru.oyun[i]]; soru.fark = `Sıra karıştı. Kedi önce ${E[dogru[i].t].f(dogru[i].p, 3)}, sonra ${E[dogru[i + 1].t].f(dogru[i + 1].p, 3)}.`; }
      else { const i = T.rand(0, n - 1), b = boz(dogru[i], sv === 1 ? 1 : 2, dogru.map((x) => x.t).concat(olumsuz ? [olumsuz.t] : []), yonerge); soru.oyun = dogru.slice(); soru.oyun[i] = b.e; soru.fark = b.fark; }
    }
    soru.dogruMu = JSON.stringify(soru.oyun) === JSON.stringify(soru.dogru);
    return soru;
  }

  /* sahne yerleşimi (birim: kedi boyu yaklaşık 1) */
  const P = { ev: 0.1, kutu: -2.75, top: -1.55, sut: 1.75, masa: 2.95, masaY: 1.2, hali: 0.15 };

  function sahneyiKur(c) {
    const { THREE, sahne, r } = c;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMappingExposure = 1.05;
    const D = (w, hh, fn, tekrar) => { const t = c.doku(w, hh, fn); if (tekrar) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...tekrar); } return t; };
    const M = (o) => new THREE.MeshStandardMaterial(o), MF = (o) => new THREE.MeshPhysicalMaterial(o);
    const ekle = (geo, mat, poz, gol = true, al = true) => { const m = new THREE.Mesh(geo, mat); if (poz) m.position.set(...poz); m.castShadow = gol; m.receiveShadow = al; sahne.add(m); return m; };
    const gurultu = (x, w, hh, n, renkler, boy = 2) => { for (let i = 0; i < n; i++) { x.fillStyle = renkler[i % renkler.length]; x.fillRect(Math.random() * w, Math.random() * hh, boy, boy); } };
    sahne.fog = new THREE.Fog(0x1a1220, 14, 30);
    /* zemin: ahşap parke */
    const parke = D(1024, 1024, (x, w, hh) => {
      const sira = 8, yuk = hh / sira;
      for (let s = 0; s < sira; s++) { let px = -Math.random() * 300; while (px < w) { const uz = 260 + Math.random() * 240, ton = 150 + Math.random() * 40; x.fillStyle = `rgb(${ton + 30},${ton - 30},${ton - 85})`; x.fillRect(px, s * yuk, uz, yuk);
        for (let i = 0; i < 26; i++) { x.strokeStyle = `rgba(${70 + Math.random() * 40},${35 + Math.random() * 20},10,${0.12 + Math.random() * 0.22})`; x.lineWidth = 0.6 + Math.random() * 1.8; x.beginPath(); const yy = s * yuk + Math.random() * yuk; x.moveTo(px, yy); x.bezierCurveTo(px + uz * 0.3, yy + (Math.random() - 0.5) * 10, px + uz * 0.6, yy + (Math.random() - 0.5) * 10, px + uz, yy + (Math.random() - 0.5) * 6); x.stroke(); }
        if (Math.random() < 0.35) { x.strokeStyle = "rgba(70,35,12,.35)"; x.lineWidth = 1.5; x.beginPath(); x.ellipse(px + Math.random() * uz, s * yuk + yuk / 2, 10 + Math.random() * 10, 4 + Math.random() * 4, 0, 0, 7); x.stroke(); }
        x.fillStyle = "rgba(40,18,6,.85)"; x.fillRect(px + uz - 2, s * yuk, 3, yuk); px += uz; }
        x.fillStyle = "rgba(40,18,6,.9)"; x.fillRect(0, s * yuk, w, 3); }
      const g = x.createLinearGradient(0, 0, w, hh); g.addColorStop(0, "rgba(255,230,190,.06)"); g.addColorStop(1, "rgba(0,0,0,.08)"); x.fillStyle = g; x.fillRect(0, 0, w, hh);
    }, [3, 2.2]);
    const zemin = ekle(new THREE.PlaneGeometry(18, 9), MF({ map: parke, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35 }), [0, 0, -0.2], false); zemin.rotation.x = -Math.PI / 2;
    const onKenar = ekle(new THREE.BoxGeometry(18, 0.5, 0.3), M({ color: 0x3a1d0e, roughness: 0.6 }), [0, -0.25, 3.45], false);
    /* arka duvar: duvar kâğıdı ve lambri */
    const kagit = D(512, 512, (x, w, hh) => {
      x.fillStyle = "#3E6E73"; x.fillRect(0, 0, w, hh);
      for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.04)"; x.fillRect(i * 64, 0, 32, hh); }
      for (let yy = 0; yy < 4; yy++) for (let xx = 0; xx < 4; xx++) { const cx = xx * 128 + (yy % 2) * 64 + 32, cy = yy * 128 + 64; x.save(); x.translate(cx, cy); x.fillStyle = "rgba(235,215,160,.22)"; for (let k = 0; k < 4; k++) { x.rotate(Math.PI / 2); x.beginPath(); x.ellipse(0, -16, 6, 14, 0, 0, 7); x.fill(); } x.beginPath(); x.arc(0, 0, 5, 0, 7); x.fill(); x.restore(); }
      gurultu(x, w, hh, 5000, ["rgba(0,0,0,.05)", "rgba(255,255,255,.04)"]);
    }, [7, 2.6]);
    ekle(new THREE.PlaneGeometry(18, 8), M({ map: kagit, roughness: 0.92 }), [0, 4, -3], false);
    const lambriD = D(512, 256, (x, w, hh) => { x.fillStyle = "#6B3E22"; x.fillRect(0, 0, w, hh); for (let i = 0; i < 4; i++) { x.fillStyle = "rgba(0,0,0,.22)"; x.fillRect(i * 128 + 14, 30, 100, hh - 60); x.fillStyle = "#7A4828"; x.fillRect(i * 128 + 20, 36, 88, hh - 72); } gurultu(x, w, hh, 3000, ["rgba(0,0,0,.08)", "rgba(255,220,170,.06)"]); }, [5, 1]);
    ekle(new THREE.BoxGeometry(18, 1.3, 0.12), M({ map: lambriD, roughness: 0.55 }), [0, 0.65, -2.95], false);
    ekle(new THREE.BoxGeometry(18, 0.1, 0.22), M({ color: 0x8a5532, roughness: 0.4 }), [0, 1.33, -2.9], false);
    /* pencere: dışarıda gök, tepeler */
    const gok = D(512, 384, (x, w, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, "#5DB3F0"); g.addColorStop(0.7, "#BFE6FB"); g.addColorStop(1, "#E9F7FF"); x.fillStyle = g; x.fillRect(0, 0, w, hh);
      x.fillStyle = "rgba(255,240,180,.9)"; x.beginPath(); x.arc(390, 80, 34, 0, 7); x.fill(); x.fillStyle = "rgba(255,240,180,.25)"; x.beginPath(); x.arc(390, 80, 64, 0, 7); x.fill();
      x.fillStyle = "#fff"; [[90, 90], [250, 140], [440, 190]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 56, 20, 0, 0, 7); x.ellipse(a - 24, b - 12, 30, 22, 0, 0, 7); x.ellipse(a + 20, b - 16, 34, 26, 0, 0, 7); x.fill(); });
      x.fillStyle = "#7CC47A"; x.beginPath(); x.moveTo(0, 300); x.quadraticCurveTo(140, 240, 280, 290); x.quadraticCurveTo(400, 250, 512, 280); x.lineTo(512, 384); x.lineTo(0, 384); x.fill();
      x.fillStyle = "#56A65A"; x.beginPath(); x.moveTo(0, 340); x.quadraticCurveTo(200, 300, 350, 335); x.quadraticCurveTo(450, 320, 512, 330); x.lineTo(512, 384); x.lineTo(0, 384); x.fill(); });
    const pencere = new THREE.Group(); pencere.position.set(0.4, 3.05, -2.93); sahne.add(pencere);
    const camM = new THREE.MeshBasicMaterial({ map: gok, toneMapped: false }); camM.color.setScalar(1.15);
    pencere.add(new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.9), camM));
    const cerM = M({ color: 0xf1e3c6, roughness: 0.5 });
    [[0, 1.0, 2.9, 0.14], [0, -1.0, 2.9, 0.14], [-1.38, 0, 0.14, 2.14], [1.38, 0, 0.14, 2.14], [0, 0, 0.08, 1.9], [0, 0, 2.6, 0.08]].forEach(([px, py, sx, sy]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, 0.14), cerM); m.position.set(px, py, 0.06); m.castShadow = true; pencere.add(m); });
    const pervaz = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 0.36), cerM); pervaz.position.set(0, -1.1, 0.16); pencere.add(pervaz);
    /* güneş huzmesi */
    const huzD = D(64, 256, (x, w, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, "rgba(255,240,200,.55)"); g.addColorStop(1, "rgba(255,240,200,0)"); x.fillStyle = g; x.fillRect(0, 0, w, hh); });
    const huzme = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 4.8), new THREE.MeshBasicMaterial({ map: huzD, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35, side: THREE.DoubleSide }));
    huzme.position.set(0.9, 1.9, -1.4); huzme.rotation.set(-0.55, 0, -0.25); sahne.add(huzme);
    /* duvarda tablo ve raf */
    const tablo = new THREE.Group(); tablo.position.set(-2.7, 3.15, -2.92); sahne.add(tablo);
    const resim = D(256, 200, (x, w, hh) => { x.fillStyle = "#FBE8C8"; x.fillRect(0, 0, w, hh); x.fillStyle = "#F2A54A"; x.beginPath(); x.arc(190, 54, 22, 0, 7); x.fill(); x.fillStyle = "#6FAE68"; x.beginPath(); x.moveTo(10, 190); x.lineTo(90, 80); x.lineTo(150, 150); x.lineTo(190, 110); x.lineTo(250, 190); x.fill(); x.fillStyle = "#4E8B4F"; x.beginPath(); x.moveTo(40, 190); x.lineTo(110, 120); x.lineTo(170, 190); x.fill(); });
    tablo.add(new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.0, 0.08), M({ color: 0xc99637, roughness: 0.35, metalness: 0.6 })));
    const rm = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.8), M({ map: resim, roughness: 0.8 })); rm.position.z = 0.045; tablo.add(rm); tablo.children.forEach((m) => (m.castShadow = true));
    const raf = new THREE.Group(); raf.position.set(3.25, 2.75, -2.75); sahne.add(raf);
    const rafM = M({ color: 0x8a532b, roughness: 0.5 }); const rb = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.42), rafM); raf.add(rb);
    [[-0.72, 0xe45c4c, 0.5], [-0.55, 0x4c8fe0, 0.42], [-0.38, 0xf1b941, 0.56], [-0.22, 0x6aa86b, 0.46]].forEach(([px, col, yy]) => { const k = new THREE.Mesh(new THREE.BoxGeometry(0.14, yy, 0.32), M({ color: col, roughness: 0.6 })); k.position.set(px, yy / 2 + 0.04, 0); raf.add(k); });
    const saksi = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.26, 24), M({ color: 0xc9733e, roughness: 0.7 })); saksi.position.set(0.5, 0.17, 0); raf.add(saksi);
    const yaprakM = M({ color: 0x4f9a4c, roughness: 0.6 });
    for (let i = 0; i < 7; i++) { const y2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), yaprakM); y2.scale.set(0.6, 1.8, 0.4); const a = i / 7 * Math.PI * 2; y2.position.set(0.5 + Math.cos(a) * 0.08, 0.44, Math.sin(a) * 0.06); y2.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); raf.add(y2); }
    raf.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    /* perdeler */
    const kadife = MF({ color: 0x9c1726, roughness: 0.78, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(0xff7a86) });
    const perde = (x, gen) => { const g = new THREE.PlaneGeometry(gen, 7.4, 90, 6), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const px = p.getX(i), py = p.getY(i); const kat = 1 + (3.7 - py) * 0.05; p.setZ(i, Math.sin(px * 9) * 0.13 * kat + Math.sin(px * 3.1) * 0.06); } g.computeVertexNormals(); const m = ekle(g, kadife, [x, 3.7, 2.0], true, true); m.material.side = THREE.DoubleSide; return m; };
    perde(-3.25, 1.5); perde(3.25, 1.5);
    const ust = new THREE.PlaneGeometry(14, 1.0, 160, 4), up = ust.attributes.position; for (let i = 0; i < up.count; i++) { const px = up.getX(i), py = up.getY(i); up.setZ(i, Math.sin(px * 7) * 0.08); if (py < 0) up.setY(i, py - (0.5 + 0.5 * Math.cos(px * 2.4)) * 0.28); } ust.computeVertexNormals();
    const val = ekle(ust, kadife, [0, 3.05, 2.05], false, false); val.material.side = THREE.DoubleSide;
    const pusM = M({ color: 0xe3b04b, roughness: 0.3, metalness: 0.8 }); ekle(new THREE.CylinderGeometry(0.035, 0.035, 14, 8), pusM, [0, 3.42, 2.1], false).rotation.z = Math.PI / 2;
    /* halı */
    const haliD = D(512, 512, (x, w, hh) => { const cx = w / 2; [["#2E6F62", 250], ["#F0C66A", 232], ["#2E6F62", 224], ["#B94A3D", 180], ["#2E6F62", 166], ["#F0C66A", 120], ["#E9DDBF", 108], ["#B94A3D", 44]].forEach(([col, rr]) => { x.fillStyle = col; x.beginPath(); x.arc(cx, cx, rr, 0, 7); x.fill(); });
      x.strokeStyle = "rgba(240,198,106,.7)"; x.lineWidth = 6; x.setLineDash([14, 10]); x.beginPath(); x.arc(cx, cx, 200, 0, 7); x.stroke(); x.setLineDash([]);
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; x.fillStyle = "#F0C66A"; x.beginPath(); x.ellipse(cx + Math.cos(a) * 145, cx + Math.sin(a) * 145, 12, 7, a, 0, 7); x.fill(); }
      gurultu(x, w, hh, 20000, ["rgba(0,0,0,.08)", "rgba(255,255,255,.06)"], 1.5); });
    const hali = ekle(new THREE.CylinderGeometry(1.55, 1.55, 0.035, 72), M({ map: haliD, roughness: 0.98 }), [P.hali, 0.018, 0.75], false); hali.scale.set(0.85, 1, 0.5);
    /* masa */
    const masaD = c.doku(512, 256, (x, w, hh) => { x.fillStyle = "#8E5530"; x.fillRect(0, 0, w, hh); for (let i = 0; i < 90; i++) { x.strokeStyle = Math.random() < 0.6 ? "rgba(70,32,10,.35)" : "rgba(255,210,160,.15)"; x.lineWidth = 0.6 + Math.random() * 2.4; x.beginPath(); const yy = Math.random() * hh; x.moveTo(0, yy); x.bezierCurveTo(w * 0.3, yy + (Math.random() - 0.5) * 16, w * 0.6, yy + (Math.random() - 0.5) * 16, w, yy + (Math.random() - 0.5) * 8); x.stroke(); } });
    const masaM = MF({ map: masaD, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25 });
    const masa = new THREE.Group(); masa.position.set(P.masa, 0, -0.35); sahne.add(masa);
    const tabla = new THREE.Mesh(T.yuvKutu(THREE, 2.1, 0.13, 1.25, 0.05), masaM); tabla.position.y = P.masaY - 0.065; masa.add(tabla);
    [[-0.88, -0.48], [0.88, -0.48], [-0.88, 0.48], [0.88, 0.48]].forEach(([px, pz]) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, P.masaY - 0.13, 16), masaM); b.position.set(px, (P.masaY - 0.13) / 2, pz); masa.add(b); });
    const etek = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 1.05), masaM); etek.position.y = P.masaY - 0.155; masa.add(etek);
    const vazo = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.13, 0], [0.17, 0.12], [0.12, 0.3], [0.07, 0.36], [0.09, 0.42]].map(([a, b]) => new THREE.Vector2(a, b)), 32), MF({ color: 0xf3ede2, roughness: 0.15, clearcoat: 1 })); vazo.position.set(0.62, P.masaY, -0.25); masa.add(vazo);
    const sapM = M({ color: 0x4f8f45, roughness: 0.6 });
    [[0.58, 0.72, -0.24, 0xf0718b], [0.68, 0.66, -0.22, 0xffc94a], [0.63, 0.78, -0.3, 0xf7a3b5]].forEach(([px, py, pz, col]) => { const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, py - 0.34, 6), sapM); s2.position.set(px, P.masaY + 0.34 + (py - 0.34) / 2, pz); masa.add(s2); const ci = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 2), M({ color: col, roughness: 0.55 })); ci.position.set(px, P.masaY + py, pz); masa.add(ci); });
    masa.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    /* karton kutu */
    const kartonD = D(512, 256, (x, w, hh) => { x.fillStyle = "#C8955B"; x.fillRect(0, 0, w, hh); for (let i = 0; i < w; i += 6) { x.fillStyle = "rgba(120,80,40,.08)"; x.fillRect(i, 0, 3, hh); } gurultu(x, w, hh, 6000, ["rgba(90,55,20,.12)", "rgba(255,235,200,.08)"]);
      x.fillStyle = "rgba(225,205,165,.85)"; x.fillRect(w / 2 - 34, 0, 68, hh); x.fillStyle = "rgba(255,255,255,.25)"; x.fillRect(w / 2 - 34, 0, 68, 6);
      x.font = "800 64px 'Baloo 2', sans-serif"; x.textAlign = "center"; x.fillStyle = "rgba(90,45,15,.55)"; x.fillText("KUTU", w * 0.24, hh * 0.62); x.strokeStyle = "rgba(90,45,15,.4)"; x.lineWidth = 4; x.strokeRect(w * 0.24 - 90, hh * 0.62 - 62, 180, 82); });
    const kartonM = M({ map: kartonD, roughness: 0.88, side: THREE.DoubleSide }), icM = M({ color: 0x9b6a3a, roughness: 0.95, side: THREE.DoubleSide });
    const kutu = new THREE.Group(); kutu.position.set(P.kutu, 0, 0.1); sahne.add(kutu);
    const KG = 1.55, KD = 1.15, KY = 0.74;
    const duvar = (sx, sz, px, pz, ry, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, KY, 0.035), mat); m.position.set(px, KY / 2, pz); m.rotation.y = ry; kutu.add(m); return m; };
    duvar(KG, 0, 0, KD / 2, 0, [icM, icM, icM, icM, kartonM, icM]); duvar(KG, 0, 0, -KD / 2, 0, [icM, icM, icM, icM, icM, kartonM]);
    duvar(KD, 0, -KG / 2, 0, Math.PI / 2, kartonM); duvar(KD, 0, KG / 2, 0, Math.PI / 2, kartonM);
    const taban = new THREE.Mesh(new THREE.BoxGeometry(KG, 0.03, KD), icM); taban.position.y = 0.015; kutu.add(taban);
    const kapak = (gen, uz, px, pz, eksen, aci) => { const pv = new THREE.Group(); pv.position.set(px, KY, pz); const m = new THREE.Mesh(new THREE.BoxGeometry(eksen === "x" ? gen : 0.03, 0.03, eksen === "x" ? 0.03 : gen), kartonM); const p2 = new THREE.Mesh(new THREE.BoxGeometry(eksen === "x" ? gen : uz, 0.025, eksen === "x" ? uz : gen), kartonM); p2.position.set(eksen === "x" ? 0 : Math.sign(px) * uz / 2, 0, eksen === "x" ? Math.sign(pz) * uz / 2 : 0); pv.add(p2); if (eksen === "x") pv.rotation.x = Math.sign(pz) * aci; else pv.rotation.z = -Math.sign(px) * aci; kutu.add(pv); };
    kapak(KG, 0.5, 0, KD / 2, "x", 1.95); kapak(KG, 0.5, 0, -KD / 2, "x", 1.7); kapak(KD, 0.45, -KG / 2, 0, "z", 1.85); kapak(KD, 0.45, KG / 2, 0, "z", 2.05);
    kutu.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    /* süt kâsesi */
    const kase = new THREE.Group(); kase.position.set(P.sut, 0, 0.85); sahne.add(kase);
    const prof = [[0, 0.01], [0.2, 0.01], [0.24, 0.03], [0.32, 0.16], [0.35, 0.2], [0.33, 0.215], [0.29, 0.17], [0.2, 0.06], [0, 0.06]].map(([a, b]) => new THREE.Vector2(a, b));
    const kaseM = MF({ color: 0xd8414c, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
    const km = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), kaseM); km.castShadow = true; km.receiveShadow = true; kase.add(km);
    const sutM = MF({ color: 0xfffdf6, roughness: 0.12, clearcoat: 0.6, sheen: 0.3 });
    const sutY = new THREE.Mesh(new THREE.CircleGeometry(1, 40), sutM); sutY.rotation.x = -Math.PI / 2; kase.add(sutY);
    const sutAyar = (d) => { const yy = lerp(0.075, 0.175, d); sutY.position.y = yy; const rr = lerp(0.215, 0.3, (yy - 0.06) / 0.11); sutY.scale.setScalar(rr); };
    sutAyar(1);
    /* top */
    const topDoku = (ana, ikinci) => c.doku(512, 256, (x, w, hh) => { x.fillStyle = ana; x.fillRect(0, 0, w, hh); x.fillStyle = ikinci; x.fillRect(0, hh / 2 - 18, w, 36); x.fillStyle = "#fff"; [0.25, 0.75].forEach((u) => { x.beginPath(); x.arc(w * u, hh * 0.5, 30, 0, 7); x.fill(); }); x.fillStyle = "rgba(255,255,255,.18)"; x.fillRect(0, 0, w, 18); });
    const TR = 0.26, topYap = (ana, ikinci) => { const m = new THREE.Mesh(new THREE.SphereGeometry(TR, 48, 32), MF({ map: topDoku(ana, ikinci), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 })); m.castShadow = true; sahne.add(m); return m; };
    const toplarM = { kirmizi: topYap("#E8333C", "#FFD84A"), mavi: topYap("#2F7DE1", "#FFFFFF") };
    /* ışıklar */
    sahne.add(new THREE.HemisphereLight(0xffe9d0, 0x2a1a22, 0.32));
    const spot = new THREE.SpotLight(0xffeccc, 420, 30, 0.5, 0.7, 1.6); spot.position.set(0.6, 8.5, 6.0); spot.target.position.set(0.3, 0.4, 0); sahne.add(spot, spot.target);
    spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -0.0004; spot.shadow.normalBias = 0.02; spot.shadow.radius = 4; spot.shadow.camera.near = 3; spot.shadow.camera.far = 22;
    const pen = new THREE.DirectionalLight(0xbfe1ff, 1.0); pen.position.set(0.5, 4.5, -6); pen.target.position.set(0.5, 0, 1); sahne.add(pen, pen.target);
    const sol = new THREE.PointLight(0xff9a5c, 6, 9, 1.5); sol.position.set(-4.4, 2.2, 1.8); sahne.add(sol);
    const sag = new THREE.PointLight(0x8fb8ff, 4, 9, 1.5); sag.position.set(4.6, 2.6, 1.5); sahne.add(sag);
    /* ön ışıklar */
    const ampM = new THREE.MeshBasicMaterial({ color: 0xffe2a0 });
    for (let i = 0; i < 11; i++) { const a = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), ampM); a.position.set(-5 + i * 1, 0.05, 3.2); sahne.add(a); }
    return { toplarM, TR, sutAyar, spot };
  }

  arac.render = function (host, api) {
    if (!T.three || !T.sahne3) return eskiRender.call(this, host, api);
    const kap = h("div.ot3-kap"), yukleniyor = h("div.ot3-yuk", h("div.ot3-yuk-ic"), "Sahne hazırlanıyor...");
    const kart = h("div.ot-kart"), dugme = h("div.ot-dugme"), skorEl = h("div.ot-skor"), balon = h("div.ot3-balon", "Miyav!"), zz = h("div.ot3-zz", h("span", "Z"), h("span", "z"), h("span", "z"));
    const sahneKap = h("div.ot-kap.ot3", kap, balon, zz, kart, h("div.ot-alt", dugme), yukleniyor);
    host.append(sahneKap, skorEl);
    let bitti = false;
    const gecis = () => { if (bitti) return; bitti = true; sahneKap.remove(); skorEl.remove(); eskiRender.call(this, host, api); };
    const zaman = setTimeout(gecis, 25000);
    Promise.all([T.sahne3(kap, { kamera: [0, 1.95, 7.3], bak: [0.05, 1.0, 0], fov: 30, env: ["#FFF4E2", "#8A6E6A", "#20141C"], sigdir: 7.36, oran: 1.85 }, api), T.modelYukle("kedi")]).then(([c, mod]) => {
      clearTimeout(zaman); if (bitti) { c && (c.durdu = true); return; }
      if (!c) return gecis();
      calis(c, mod);
    }).catch(() => { clearTimeout(zaman); gecis(); });

    function calis(c, mod) {
      const { THREE, sahne, kamera } = c;
      const S = sahneyiKur(c);
      /* kedi: konum > yön > yatış > model */
      const kok = new THREE.Group(), yonG = new THREE.Group(), yatG = new THREE.Group();
      kok.add(yonG); yonG.add(yatG); sahne.add(kok);
      const kedi = mod.m.SkeletonUtils.clone(mod.g.scene); yatG.add(kedi);
      kedi.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; if (o.material) { o.material.roughness = 0.85; o.material.metalness = 0; o.material.envMapIntensity = 0.9; o.material.emissiveIntensity = 0; } } });
      kok.updateMatrixWorld(true); kedi.traverse((o) => o.isSkinnedMesh && o.skeleton.update()); const kutuB = new THREE.Box3().setFromObject(kedi, true), boy = kutuB.getSize(new THREE.Vector3()).y, olc = 1.18 / boy;
      kedi.scale.setScalar(olc); kedi.position.y = -kutuB.min.y * olc;
      const B = {}; kedi.traverse((o) => { if (o.isBone) { B[o.name] = o; o.userData.q0 = o.quaternion.clone(); } });
      const YAT = [["frontleg0", -1.45], ["frontleg1", 0.1], ["frontleg2", 0.5], ["backleg0", -1.1], ["backleg1", 2.2], ["backleg2", -0.6]];
      const mixer = new THREE.AnimationMixer(kedi), yuruA = mixer.clipAction(mod.g.animations[0]); yuruA.play(); yuruA.setEffectiveWeight(0);
      const d = { x: P.ev, y: 0, z: 0.25, yon: 0, yonH: 0, yuru: 0, hiz: 1, sx: 1, sy: 1, yat: 0, egil: 0, basX: 0, basY: 0, kuyruk: 1, pati: 0, gorunur: 1, uyku: 0, zipla: 0 };
      const TOP0 = { kirmizi: [P.top, 0.55], mavi: [-0.95, 1.75] };
      const YON = { kirmizi: [0.15, 1], mavi: [1, 0.1] };
      const toplar = { kirmizi: { x: TOP0.kirmizi[0], z: TOP0.kirmizi[1], y: S.TR, r: 0 }, mavi: { x: TOP0.mavi[0], z: TOP0.mavi[1], y: S.TR, r: 0 } }, sut = { d: 1 };
      const ex = new THREE.Vector3(1, 0, 0), ey = new THREE.Vector3(0, 1, 0), ez = new THREE.Vector3(0, 0, 1), q = new THREE.Quaternion();
      const don = (b, ax, a) => { if (!b || !a) return; q.setFromAxisAngle(ax, a); b.quaternion.multiply(q); };
      let t0 = 0, mesgul = false;
      const yanson = (o) => { const v = new THREE.Vector3(); o.getWorldPosition(v); v.project(kamera); const b = kap.getBoundingClientRect(); return [(v.x * 0.5 + 0.5) * b.width, (-v.y * 0.5 + 0.5) * b.height]; };
      c.kare = (dt, zm) => {
        t0 += dt;
        yuruA.setEffectiveWeight(d.yuru); yuruA.timeScale = d.hiz;
        mixer.update(dt);
        if (d.yuru < 0.01) for (const n in B) B[n].quaternion.copy(B[n].userData.q0);
        /* nefes, baş, kuyruk */
                don(B.head, ex, d.basX + Math.sin(t0 * 0.7) * 0.05 * (1 - d.uyku)); don(B.head, ey, d.basY + Math.sin(t0 * 0.45) * 0.12 * (1 - d.uyku) * (1 - d.yuru));
        const kh = d.uyku ? 0.05 : 0.22 * d.kuyruk; const ks = Math.sin(t0 * (d.uyku ? 1.2 : 3.2));
        ["tailstart", "tail1", "tail2", "tail3"].forEach((n, i) => { don(B[n], ez, ks * kh * (0.6 + i * 0.3)); if (d.kuyruk < 1) don(B[n], ex, (1 - d.kuyruk) * 0.45); if (d.uyku) don(B[n], ez, 0.35 * d.uyku); });
        if (d.pati) { don(B.frontleg, ex, -1.2 * d.pati); don(B.frontleg1, ex, 0.6 * d.pati); }
        if (d.yat > 0) YAT.forEach(([n, a]) => { don(B[n], ex, a * d.yat); don(B["R_" + n], ex, a * d.yat); });
        if (d.uyku) { const nf = Math.sin(t0 * 1.7) * 0.03 * d.uyku; don(B.chest, ex, nf); }
        /* gövde */
        d.yonH += (d.yon - d.yonH) * Math.min(1, dt * 9);
        kok.position.set(d.x, d.y, d.z); yonG.rotation.y = d.yonH;
        yatG.rotation.set(d.egil, 0, 0); yatG.position.y = -d.yat * 0.243;
                kedi.visible = d.gorunur > 0.02;
        /* top, süt */
        for (const k in toplar) { const tp = toplar[k], m = S.toplarM[k]; m.position.set(tp.x, tp.y, tp.z); m.rotation.set(tp.r, 0, tp.r * 0.35); } S.sutAyar(sut.d);
        /* balon ve Zz konumu */
        if (balon.classList.contains("acik") || zz.classList.contains("acik")) { const [bx, by] = yanson(B.head || kedi); balon.style.transform = `translate(${bx + 30}px, ${by - 150}px)`; zz.style.transform = `translate(${bx + 10}px, ${by - 110}px)`; }
      };
      yukleniyor.remove();
      /* yardımcılar */
      const tw = (ms, fn, e = io) => new Promise((res) => { const s0 = performance.now(); const ad = (z) => { const p = Math.min(1, (z - s0) / ms); fn(e(p)); if (p < 1 && !c.durdu) requestAnimationFrame(ad); else res(); }; requestAnimationFrame(ad); });
      const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
      const ses = (f, sure = 0.12, tip = "triangle", v = 0.12) => { try { const a = T.sound.unlock(); if (!a) return; const o = a.createOscillator(), g = a.createGain(); o.type = tip; o.frequency.setValueAtTime(f, a.currentTime); o.frequency.exponentialRampToValueAtTime(f * 1.6, a.currentTime + sure); g.gain.setValueAtTime(v, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + sure); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + sure + 0.02); } catch (e) {} };
      const miyavSes = () => { try { const a = T.sound.unlock(); if (!a) return; const o = a.createOscillator(), o2 = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain(), n = a.currentTime; o.type = "sawtooth"; o2.type = "triangle"; f.type = "bandpass"; f.Q.value = 3; [o, o2].forEach((x, i) => { x.frequency.setValueAtTime(520 * (i ? 2 : 1), n); x.frequency.linearRampToValueAtTime(880 * (i ? 2 : 1), n + 0.18); x.frequency.linearRampToValueAtTime(600 * (i ? 2 : 1), n + 0.55); }); f.frequency.setValueAtTime(900, n); f.frequency.linearRampToValueAtTime(1800, n + 0.2); f.frequency.linearRampToValueAtTime(1100, n + 0.55); g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(0.22, n + 0.06); g.gain.exponentialRampToValueAtTime(0.0001, n + 0.6); o.connect(f); o2.connect(f); f.connect(g).connect(a.destination); o.start(); o2.start(); o.stop(n + 0.65); o2.stop(n + 0.65); } catch (e) {} };
      async function zipla(x, y, z = d.z, yuk = 1.0, sure = 700) { if (Math.hypot(x - d.x, z - d.z) > 0.05) d.yon = yonA(Math.atan2(x - d.x, z - d.z)); await tw(200, (t) => (d.egil = 0.12 * t)); ses(330, 0.25, "sine", 0.1); const x0 = d.x, y0 = d.y, z0 = d.z; await tw(sure, (t) => { d.x = lerp(x0, x, t); d.z = lerp(z0, z, t); d.y = lerp(y0, y, t) + Math.sin(t * Math.PI) * yuk; d.egil = lerp(-0.3, 0.2, t) * Math.sin(t * Math.PI); }, (t) => t); ses(140, 0.1, "square", 0.04); await tw(160, (t) => (d.egil = 0.08 * (1 - t))); d.egil = 0; }
      const yonA = (a) => { const k = Math.PI * 2; return a + k * Math.round((d.yonH - a) / k); };
      const bak = (x, z) => (d.yon = yonA(Math.atan2(x - d.x, z - d.z)));
      const kameraya = () => (d.yon = yonA(0));
      async function git(x, z, hiz = 1.55) { const uz = Math.hypot(x - d.x, z - d.z); if (uz < 0.03) return; bak(x, z); await bekle(120); d.hiz = hiz / 1.25; await tw(160, (t) => (d.yuru = t)); const x0 = d.x, z0 = d.z; await tw(uz / hiz * 1000, (t) => { d.x = lerp(x0, x, t); d.z = lerp(z0, z, t); }, (t) => t); await tw(180, (t) => (d.yuru = 1 - t)); d.yuru = 0; }
      async function yol(noktalar, hiz) { for (const [x, z] of noktalar) await git(x, z, hiz); }
      const miyavla = async () => { await tw(260, (t) => (d.basX = -0.45 * t)); miyavSes(); balon.classList.remove("acik"); void balon.offsetWidth; balon.classList.add("acik"); await bekle(900); balon.classList.remove("acik"); await tw(260, (t) => (d.basX = -0.45 * (1 - t))); await bekle(150); };
      async function oyna(e) {
        await hazirla(); const a = e.t, p = e.p;
        if (a === "masa") { await git(P.masa - 1.75, 0.05); await zipla(P.masa - 0.6, P.masaY, -0.3, 1.2, 760); kameraya(); await tw(500, (t) => (d.basX = -0.25 * Math.sin(t * Math.PI))); }
        else if (a === "kutu") { await git(P.kutu + 1.8, 0.15); await zipla(P.kutu, 0.06, 0.1, 1.15, 760); d.yon = yonA(0.25); await bekle(300); for (let i = 0; i < 2; i++) await tw(260, (t) => (d.basY = Math.sin(t * Math.PI) * 0.5 * (i ? -1 : 1))); }
        else if (a === "saklan") { await yol([[P.kutu + 1.6, -0.75], [P.kutu + 0.2, -0.95]]); kameraya(); await bekle(350); await tw(400, (t) => (d.basY = 0.45 * Math.sin(t * Math.PI))); }
        else if (a === "masaAlt") { await yol([[P.masa - 1.7, 0.6], [P.masa - 1.45, -0.35]], 1.3); await tw(350, (t) => (d.yat = 0.65 * t)); d.yuru = 0; await git(P.masa - 0.1, -0.35, 0.9); kameraya(); await bekle(300); await tw(400, (t) => (d.basY = -0.35 * Math.sin(t * Math.PI))); }
        else if (a === "top") {
          const tp = toplar[p.renk], x0 = tp.x, z0 = tp.z, [ux, uz] = YON[p.renk], ul = Math.hypot(ux, uz), kx = ux / ul, kz = uz / ul;
          await git(tp.x - kx * 0.72, tp.z - kz * 0.72); bak(tp.x, tp.z); await bekle(220);
          await tw(260, (t) => (d.pati = Math.sin(t * Math.PI))); ses(520, 0.08);
          await tw(1000, (t) => { tp.x = x0 + kx * 0.9 * t; tp.z = z0 + kz * 0.9 * t; tp.r = Math.hypot(tp.x - x0, tp.z - z0) / S.TR; tp.y = S.TR + Math.abs(Math.sin(t * Math.PI * 2)) * 0.18 * (1 - t); }, cik);
          await git(tp.x - kx * 0.62, tp.z - kz * 0.62, 2.0); bak(tp.x, tp.z); await tw(240, (t) => (d.pati = Math.sin(t * Math.PI))); ses(600, 0.08);
          const x1 = tp.x, z1 = tp.z; await tw(600, (t) => { tp.x = x1 + kx * 0.2 * t; tp.z = z1 + kz * 0.2 * t; tp.r = Math.hypot(tp.x - x0, tp.z - z0) / S.TR; }, cik);
          kameraya();
        }
        else if (a === "sut") { await git(P.sut - 0.72, 0.85); bak(P.sut, 0.85); await tw(420, (t) => { d.basX = 0.55 * t; d.egil = 0.22 * t; }); for (let i = 0; i < 5; i++) { await tw(220, (t) => (d.basX = 0.55 + 0.1 * Math.sin(t * Math.PI))); ses(900, 0.05, "sine", 0.05); sut.d = Math.max(0.1, sut.d - 0.18); } await tw(420, (t) => { d.basX = 0.55 * (1 - t); d.egil = 0.22 * (1 - t); }); }
        else if (a === "uyku") { await git(P.hali, 0.7); d.yon = yonA(0.35); await bekle(250); await tw(1100, (t) => { d.yat = t; d.basX = 0.42 * t; d.uyku = t; }); zz.classList.add("acik"); await bekle(1600); }
        else if (a === "miyav") { kameraya(); await bekle(250); for (let i = 0; i < p.n; i++) await miyavla(); }
        else if (a === "zipla") { kameraya(); await bekle(250); for (let i = 0; i < p.n; i++) { await zipla(d.x, 0, d.z, 0.55, 480); kameraya(); await bekle(160); } }
        else if (a === "pencere") { await git(0.4, -2.05); d.yon = yonA(Math.PI); await bekle(300); await tw(500, (t) => (d.basX = -0.5 * t)); d.kuyruk = 1.6; await bekle(1300); await tw(400, (t) => (d.basX = -0.5 * (1 - t))); d.kuyruk = 1; }
        else if (a === "kos") { const cx = P.hali, cz = 0.8, rx = 1.05, rz = 0.8; await git(cx + rx, cz, 2.2); d.hiz = 2.4; await tw(160, (t) => (d.yuru = t)); await tw(3200, (t) => { const u = t * Math.PI * 2; d.x = cx + Math.cos(u) * rx; d.z = cz + Math.sin(u) * rz; d.yon = yonA(Math.atan2(-Math.sin(u) * rx, Math.cos(u) * rz)); }, (t) => t); await tw(200, (t) => (d.yuru = 1 - t)); d.yuru = 0; kameraya(); }
        else if (a === "kuyruk") { kameraya(); await bekle(250); d.kuyruk = 3.2; await bekle(1800); d.kuyruk = 1; }
        else if (a === "don") { kameraya(); await bekle(300); const y0 = d.yon; d.hiz = 1.6; d.yuru = 0.6; await tw(1300 * p.n, (t) => { d.yon = y0 + t * Math.PI * 2 * p.n; d.yonH = d.yon; }, io); d.yuru = 0; d.yon = d.yonH = y0; }
        else if (a === "kase") { await git(P.sut - 0.75, 0.85, p.hiz === "yavas" ? 0.7 : 3.2); bak(P.sut, 0.85); await bekle(300); }
      }
      async function hazirla() {
        balon.classList.remove("acik"); zz.classList.remove("acik");
        const masaAlti = d.z < -0.2 && Math.abs(d.x - P.masa) < 1.2 && d.y < 0.3;
        if (d.yat > 0.01 && !masaAlti) { const y0 = d.yat; await tw(600, (t) => { d.yat = y0 * (1 - t); d.uyku = Math.max(0, d.uyku - t); d.basX = 0.42 * (1 - t); }); d.yat = 0; }
        d.uyku = 0; d.basX = 0; d.basY = 0;
        if (d.y > 0.3) await zipla(P.masa - 1.6, 0, 0.3, 0.6, 650);
        else if (Math.abs(d.x - P.kutu) < 0.9 && Math.abs(d.z - 0.1) < 0.6) await zipla(P.kutu + 1.3, 0, 0.3, 1.0, 700);
        else if (d.z < -0.7 && d.x < P.kutu + 1.2) await git(P.kutu + 1.4, -0.55);
        else if (d.z < -0.2 && Math.abs(d.x - P.masa) < 1.2) { await git(P.masa - 1.45, -0.35, 0.9); await tw(300, (t) => (d.yat = d.yat * (1 - t))); d.yat = 0; }
      }
      async function sifirla(ani = true) {
        if (ani) {
          await hazirla();
          const bas = Object.fromEntries(Object.entries(toplar).map(([k, v]) => [k, [v.x, v.z]])), sd = sut.d;
          await Promise.all([git(P.ev, 0.25, 1.9), tw(900, (t) => { for (const k in toplar) { const tp = toplar[k], [bx, bz] = bas[k]; tp.x = lerp(bx, TOP0[k][0], t); tp.z = lerp(bz, TOP0[k][1], t); tp.r += 0.04; tp.y = S.TR; } sut.d = lerp(sd, 1, t); })]);
          kameraya(); await bekle(250);
        }
        balon.classList.remove("acik"); zz.classList.remove("acik");
        Object.assign(d, { x: P.ev, y: 0, z: 0.25, yuru: 0, yat: 0, egil: 0, basX: 0, basY: 0, kuyruk: 1, pati: 0, uyku: 0 });
        if (!ani) d.yon = d.yonH = 0;
        for (const k in toplar) Object.assign(toplar[k], { x: TOP0[k][0], z: TOP0[k][1], y: S.TR });
        sut.d = 1;
      }
      async function sevin() { kameraya(); await bekle(200); for (let i = 0; i < 2; i++) { await zipla(d.x, d.y, d.z, 0.5, 460); kameraya(); } await tw(300, (t) => (d.basY = Math.sin(t * Math.PI * 2) * 0.4)); }
      async function uzul() { kameraya(); await tw(450, (t) => { d.basX = 0.45 * t; d.kuyruk = 1 - t; }); await bekle(700); await tw(400, (t) => { d.basX = 0.45 * (1 - t); d.kuyruk = t; }); d.kuyruk = 1; }
      /* akış */
      let seviye = 1, yonerge = false, soru = null, skor = 0;
      const SEV = [[1, "Kısa cümle"], [2, "Ayrıntı"], [3, "İki adım"], [4, "Üç adım (2. sınıf)"]];
      function yeniSoru() { soru = soruUret(seviye, yonerge); ciz("oku"); }
      function ciz(asama, sonuc) {
        kart.replaceChildren(h("div.ot-cumle", soru.cumle)); kart.classList.toggle("kucuk", asama !== "oku");
        const b = (cls, ic, fn, lbl) => h("button.ot-b." + cls, { onclick: fn }, ic ? T.icon(ic) : null, lbl);
        const sor = yonerge ? "Kedi yönergeyi doğru uyguladı mı?" : "Kedi rolünü doğru yaptı mı?";
        if (asama === "oku") dugme.replaceChildren(b("dinle", "speaker", () => T.speak(soru.cumle), "Dinle"), b("oyna", "next", oynat, "Okuduk, sahneye çıksın"));
        else if (asama === "oynuyor") dugme.replaceChildren(h("div.ot-not", yonerge ? "Kedi yönergeyi uyguluyor, dikkatle izleyin..." : "Kedi rolünü oynuyor, dikkatle izleyin..."));
        else if (asama === "karar") dugme.replaceChildren(h("div.ot-soru", sor), b("evet", "check", () => karar(true), yonerge ? "Doğru uyguladı" : "Rolünü doğru yaptı"), b("hayir", "close", () => karar(false), yonerge ? "Yanlış uyguladı" : "Rolünü yanlış yaptı"));
        else if (asama === "sonuc") {
          const msg = sonuc ? (soru.dogruMu ? "Harika! Dikkatli okudunuz." : "Harika! Yanlışı yakaladınız. " + soru.fark) : soru.dogruMu ? (yonerge ? "Aslında kedi yönergeyi doğru uyguladı. Bir daha okuyalım." : "Aslında kedi rolünü doğru yaptı. Bir daha okuyalım.") : "Kedi yanlış yaptı. " + soru.fark;
          dugme.replaceChildren(h("div.ot-sonuc" + (sonuc ? ".iyi" : ""), msg), soru.dogruMu ? null : b("dinle", "eye", dogrusunuGoster, "Doğrusunu göster"), b("oyna", "next", async () => { if (mesgul) return; mesgul = true; await sifirla(); mesgul = false; yeniSoru(); }, "Yeni cümle"));
        }
        const degis = async (fn) => { if (mesgul) return; fn(); mesgul = true; await sifirla(); mesgul = false; yeniSoru(); };
        skorEl.replaceChildren(
          h("div.seg", [[false, "Cümle oku"], [true, "Yönerge oku"]].map(([v, l]) => h("button", { "aria-pressed": String(yonerge === v), onclick: () => degis(() => (yonerge = v)) }, l))),
          h("div.seg", SEV.map(([v, l]) => h("button", { "aria-pressed": String(seviye === v), onclick: () => degis(() => (seviye = v)) }, l))),
          h("b.ot-puan", "⭐ " + String(skor)));
      }
      async function oynat() { if (mesgul) return; mesgul = true; T.sound.unlock(); ciz("oynuyor"); await sifirla(true); await bekle(200); for (const e of soru.oyun) { await oyna(e); await bekle(500); } mesgul = false; ciz("karar"); }
      async function ayaga() { balon.classList.remove("acik"); zz.classList.remove("acik"); if (d.yat) await tw(500, (t) => { d.yat = 1 - t; d.uyku = 1 - t; d.basX = 0.42 * (1 - t); }); d.yat = d.uyku = 0; }
      async function karar(dediDogru) {
        if (mesgul) return; mesgul = true;
        const iyi = dediDogru === soru.dogruMu;
        if (iyi) { skor++; T.sound.ok(); T.konfeti && T.konfeti(); ciz("sonuc", true); await ayaga(); if (d.y < 0.3) await sevin(); }
        else { T.sound.no(); ciz("sonuc", false); await uzul(); }
        mesgul = false;
      }
      async function dogrusunuGoster() { if (mesgul) return; mesgul = true; await sifirla(); for (const e of soru.dogru) { await oyna(e); await bekle(500); } await ayaga(); if (d.y < 0.3) await sevin(); mesgul = false; }
      T._tiyatro = { d, toplar, sut, oyna, sifirla, kamera, B, soruUret };
      sifirla(false); yeniSoru();
    }
  };
})();
