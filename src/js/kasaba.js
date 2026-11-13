/* Ses Kasabası: 1. sınıf ilk okuma yazma.
   Her ses grubu bir mahalle, her ses bir dükkân. Dükkânın dört basamağı var: ses, hece, kelime, cümle.
   Müşteriler fişle gelir, çocuklar fişi okuyup doğru ürünü verir. Dört basamak bitince dükkân açılır, sıradaki dükkâna geçilir.
   Otomatik konuşma yok; "Dinle" yalnızca basılınca çalışır. */
(function () {
  const { h } = T;
  const YER = {
    a: ["Arıcı", "#F6C445", "#B5651D", "kubbe"], n: ["Nalbur", "#7FA7C9", "#3D5A80", "ucgen"], e: ["Eczane", "#F2F2F2", "#2E9E5B", "duz"], t: ["Tren garı", "#C96F4A", "#5B3A29", "kule"],
    i: ["İtfaiye", "#D94B3D", "#7A1F1A", "duz"], l: ["Lokanta", "#F4A261", "#9C3D2B", "ucgen"], o: ["Okul", "#F1D7A8", "#B23A48", "kule"], k: ["Kütüphane", "#8E7DBE", "#4B3F72", "ucgen"],
    u: ["Uçurtmacı", "#9ED9CC", "#E76F51", "ucgen"], r: ["Radyo evi", "#E9C46A", "#264653", "kule"], "ı": ["Irmak evi", "#8ECAE6", "#219EBC", "duz"], m: ["Manav", "#90BE6D", "#577590", "ucgen"],
    "ü": ["Üzümcü", "#B392AC", "#5E3C58", "ucgen"], s: ["Su kulesi", "#A8DADC", "#457B9D", "kule"], "ö": ["Ördek göleti", "#FFE8A3", "#6C9A8B", "kubbe"], y: ["Yel değirmeni", "#F7EDE2", "#A0522D", "degirmen"],
    d: ["Dondurmacı", "#FFC8DD", "#CDB4DB", "kubbe"], z: ["Zeytinci", "#C9D6A3", "#5F7161", "ucgen"], "ç": ["Çiçekçi", "#FFAFCC", "#2A9D8F", "ucgen"], b: ["Bakkal", "#F4D35E", "#EE964B", "duz"],
    g: ["Gözlemevi", "#DDE5ED", "#3A506B", "kubbe"], "ş": ["Şekerci", "#FFD6E0", "#D1495B", "ucgen"], c: ["Cevizci", "#D4A373", "#6F4E37", "ucgen"], p: ["Pastane", "#FFF1E6", "#E07A5F", "kubbe"],
    h: ["Hastane", "#FFFFFF", "#E63946", "duz"], "ğ": ["Dağ evi", "#B7B7A4", "#6B705C", "ucgen"], v: ["Veteriner", "#CDEAC0", "#4F772D", "duz"], f: ["Fırın", "#E9B872", "#8C4A2F", "kubbe"], j: ["Jimnastik salonu", "#BDE0FE", "#3A86FF", "duz"],
  };
  const MAHALLE = [["Çınar Mahallesi", "anetil"], ["Lale Mahallesi", "okurım"], ["Deniz Mahallesi", "üsöydz"], ["Güneş Mahallesi", "çbgcş"], ["Yıldız Mahallesi", "phvğfj"]];
  const ASAMA = [["ses", "Ses"], ["hece", "Hece"], ["kelime", "Kelime"], ["cumle", "Cümle"]];
  const MUSTERI_SAY = { ses: 4, hece: 4, kelime: 4, cumle: 3 };
  const BUYUK = (l) => l.toLocaleUpperCase("tr-TR");
  const adOf = (l) => BUYUK(l) + " dükkânı";
  const dep = () => { const s = T.store.get(); const id = T.store.activeClass().id; s.kasaba2 = s.kasaba2 || {}; return s.kasaba2[id] || { asama: {} }; };
  const depYaz = (fn) => T.store.update((s) => { const id = T.store.activeClass().id; s.kasaba2 = s.kasaba2 || {}; const k = (s.kasaba2[id] = s.kasaba2[id] || { asama: {} }); fn(k); });
  const asamaOf = (l) => dep().asama[l] || 0; /* 0-4, 4 = dükkân açıldı */

  T.tools["ses-kasabasi"] = {
    back: "birinci", grades: [1, 1], title: "Ses Kasabası", icon: "home", tone: "leaf",
    short: "Her ses bir dükkân: müşterilerin fişini oku, doğru ürünü ver. Ses, hece, kelime, cümle.",
    render(host, api) {
      const IO = T.ilkOkuma; if (!IO) { host.append(h("p", "İlk okuma verisi yüklenemedi.")); return; }
      const ORDER = IO.ORDER, PIC = new Map(IO.PICS);
      const kap = h("div.ks-kap"), yuk = h("div.ot3-yuk", h("div.ot3-yuk-ic"), "Kasaba kuruluyor...");
      const ust = h("div.ks-ust"), alt = h("div.ks-alt"), fis = h("div.ks-fis"), basamak = h("div.ks-basamak");
      host.append(h("div.ks-sahne", kap, fis, ust, basamak, alt, yuk));
      let mahalleI = Math.max(0, MAHALLE.findIndex(([, ls]) => [...ls].some((l) => asamaOf(l) < 4)));
      Promise.all([T.sahne3(kap, { kamera: [0, 5, 16], bak: [0, 1.4, -3], fov: 40, env: ["#E8F6FF", "#A9D6A0", "#4C6B3C"] }, api), T.modelYukle("sincap"), T.modelYukle("kedi"), T.modelYukle("kopek"), T.modelYukle("robot"), T.modelYukle("baykus")])
        .then(([c]) => { if (!c) { yuk.textContent = "Bu cihazda 3B çizim açılamadı."; return; } kur(c).catch((e) => { console.error(e); yuk.textContent = "Kasaba kurulamadı."; }); })
        .catch((e) => { console.error(e); yuk.textContent = "Kasaba yüklenemedi. Sayfayı yenileyip tekrar dene."; });

      async function kur(c) {
        const { THREE, sahne, kamera, r } = c;
        r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMappingExposure = 1.05;
        sahne.fog = new THREE.Fog(0xd7eefb, 30, 75);
        const M = (o) => new THREE.MeshStandardMaterial(o);
        const ekle = (geo, mat, poz, ust2 = sahne) => { const m = new THREE.Mesh(geo, mat); if (poz) m.position.set(...poz); m.castShadow = true; m.receiveShadow = true; ust2.add(m); return m; };
        const rnd = (a, b) => a + Math.random() * (b - a);
        /* gök */
        const gokD = c.doku(16, 256, (x, w, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, "#5FB4EE"); g.addColorStop(0.5, "#A9DBF7"); g.addColorStop(0.8, "#E7F6FE"); g.addColorStop(1, "#F8FCFF"); x.fillStyle = g; x.fillRect(0, 0, w, hh); });
        sahne.add(new THREE.Mesh(new THREE.SphereGeometry(110, 32, 16), new THREE.MeshBasicMaterial({ map: gokD, side: THREE.BackSide, fog: false })));
        const bulutM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: 0xffffff, emissiveIntensity: 0.35, fog: false });
        const bulutlar = []; for (let i = 0; i < 8; i++) { const g = new THREE.Group(); for (let j = 0; j < 5; j++) { const s2 = new THREE.Mesh(new THREE.SphereGeometry(rnd(1.4, 2.4), 14, 10), bulutM); s2.position.set(j * 1.6 - 3, rnd(0, 0.9), rnd(0, 0.8)); s2.scale.y = 0.75; g.add(s2); } g.position.set(-60 + i * 16, rnd(16, 24), rnd(-60, -45)); sahne.add(g); bulutlar.push(g); }
        /* uzak tepeler */
        const tepeM = [M({ color: 0x86c27a, roughness: 1 }), M({ color: 0x6fae6a, roughness: 1 }), M({ color: 0x9fd08f, roughness: 1 })];
        for (let i = 0; i < 9; i++) { const t2 = new THREE.Mesh(new THREE.SphereGeometry(rnd(8, 14), 24, 12), tepeM[i % 3]); t2.position.set(-48 + i * 12, -rnd(3, 6), rnd(-44, -34)); t2.scale.y = 0.55; sahne.add(t2); }
        /* çimen: doğal, lekeli, çiçekli */
        const cimenD = c.doku(1024, 1024, (x, w) => {
          x.fillStyle = "#7DBB5A"; x.fillRect(0, 0, w, w);
          for (let i = 0; i < 70; i++) { const cx = rnd(0, w), cy = rnd(0, w), g = x.createRadialGradient(cx, cy, 0, cx, cy, rnd(60, 200)); const k = Math.random() < 0.5; g.addColorStop(0, k ? "rgba(140,200,90,.35)" : "rgba(80,140,55,.3)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, w, w); }
          for (let i = 0; i < 26000; i++) { x.strokeStyle = Math.random() < 0.5 ? "rgba(60,110,40,.25)" : "rgba(180,225,120,.22)"; x.lineWidth = 1.2; const px = rnd(0, w), py = rnd(0, w); x.beginPath(); x.moveTo(px, py); x.lineTo(px + rnd(-2, 2), py - rnd(3, 7)); x.stroke(); }
          for (let i = 0; i < 260; i++) { x.fillStyle = ["#FFFFFF", "#FFE066", "#FF8FAB", "#C3A6FF"][i % 4]; x.beginPath(); x.arc(rnd(0, w), rnd(0, w), rnd(1.5, 3), 0, 7); x.fill(); }
        });
        cimenD.wrapS = cimenD.wrapT = THREE.RepeatWrapping; cimenD.repeat.set(10, 10);
        const zemin = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), M({ map: cimenD, roughness: 0.95 })); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
        /* kıvrımlı arnavut kaldırımı sokak */
        const kaldirimD = c.doku(512, 512, (x, w) => { x.fillStyle = "#A99B88"; x.fillRect(0, 0, w, w); for (let yy = 0; yy < 16; yy++) for (let xx = -1; xx < 16; xx++) { const ton = 175 + rnd(-22, 22); x.fillStyle = `rgb(${ton + 12},${ton},${ton - 18})`; const ox = (yy % 2) * 16; x.beginPath(); x.roundRect(xx * 32 + ox + 2, yy * 32 + 2, 28, 28, 8); x.fill(); x.fillStyle = "rgba(255,255,255,.12)"; x.fillRect(xx * 32 + ox + 5, yy * 32 + 4, 18, 4); } });
        kaldirimD.wrapS = kaldirimD.wrapT = THREE.RepeatWrapping;
        const yolEgri = (x) => 2.2 + Math.sin(x * 0.12) * 1.1;
        const seritYap = (gen, yukari, mat, ofs) => { const n = 120, g = new THREE.BufferGeometry(), pos = [], uv = [], idx = []; for (let i = 0; i <= n; i++) { const x = -30 + (60 * i) / n, z = yolEgri(x) + ofs; pos.push(x, yukari, z - gen / 2, x, yukari, z + gen / 2); uv.push(x / 2, 0, x / 2, gen / 2); if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } } g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); m.receiveShadow = true; sahne.add(m); return m; };
        seritYap(3.6, 0.03, M({ map: kaldirimD, roughness: 0.85 }), 0);
        seritYap(1.2, 0.06, M({ color: 0xdcd3c3, roughness: 0.9 }), -2.4);
        /* ağaçlar, fenerler, banklar, çiçek tarhları */
        const agacM = [M({ color: 0x4f9a4a, roughness: 0.85 }), M({ color: 0x6cb35a, roughness: 0.85 }), M({ color: 0x3f8a5a, roughness: 0.85 })], govM = M({ color: 0x7b4f2a, roughness: 0.9 });
        const agac = (x, z, s = 1) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); ekle(new THREE.CylinderGeometry(0.14, 0.22, 1.3, 8), govM, [0, 0.65, 0], g); for (let i = 0; i < 4; i++) ekle(new THREE.IcosahedronGeometry(rnd(0.55, 0.8), 1), agacM[i % 3], [rnd(-0.4, 0.4), 1.6 + rnd(0, 0.6), rnd(-0.3, 0.3)], g); sahne.add(g); return g; };
        const fenerM = M({ color: 0x2f3e46, roughness: 0.4, metalness: 0.6 }), isikM = new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffd77a, emissiveIntensity: 0.6 });
        const fener = (x, z) => { ekle(new THREE.CylinderGeometry(0.05, 0.08, 2.4, 8), fenerM, [x, 1.2, z]); ekle(new THREE.SphereGeometry(0.2, 12, 10), isikM, [x, 2.5, z]); ekle(new THREE.ConeGeometry(0.26, 0.2, 8), fenerM, [x, 2.72, z]); };
        const ahsapM = M({ color: 0xa0683a, roughness: 0.7 });
        const bank = (x, z, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; ekle(new THREE.BoxGeometry(1.4, 0.08, 0.4), ahsapM, [0, 0.45, 0], g); ekle(new THREE.BoxGeometry(1.4, 0.35, 0.06), ahsapM, [0, 0.7, -0.2], g); [-0.6, 0.6].forEach((px) => ekle(new THREE.BoxGeometry(0.06, 0.45, 0.4), fenerM, [px, 0.22, 0], g)); sahne.add(g); };
        const cicekRenk = [0xff8fab, 0xffd166, 0xc3a6ff, 0xffffff, 0xff6b6b];
        const tarh = (x, z) => { for (let i = 0; i < 9; i++) { const cc = ekle(new THREE.IcosahedronGeometry(0.11, 1), M({ color: cicekRenk[i % 5], roughness: 0.6 }), [x + rnd(-0.6, 0.6), 0.16, z + rnd(-0.25, 0.25)]); ekle(new THREE.CylinderGeometry(0.015, 0.015, 0.15, 4), agacM[1], [cc.position.x, 0.07, cc.position.z]); } };
        for (let i = 0; i < 24; i++) agac(rnd(-34, 34), rnd(-16, -9), rnd(1, 1.7));
        for (let i = 0; i < 8; i++) { const x = (i % 2 ? 1 : -1) * rnd(15, 30); agac(x, yolEgri(x) + rnd(4, 9), rnd(0.9, 1.4)); }
        for (let i = 0; i < 7; i++) { const x = -13.2 + i * 4.4; fener(x, yolEgri(x) - 3.4); }
        bank(-17, yolEgri(-17) + 2.7, Math.PI); bank(17, yolEgri(17) + 2.7, Math.PI); tarh(-16, yolEgri(-16) - 3); tarh(16, yolEgri(16) - 3);
        /* ışık */
        sahne.add(new THREE.HemisphereLight(0xe3f4ff, 0x5a7a40, 0.6));
        const gunes = new THREE.DirectionalLight(0xfff0d6, 3.0); gunes.position.set(-12, 20, 16); gunes.castShadow = true; gunes.shadow.mapSize.set(2048, 2048); const sc = gunes.shadow.camera; sc.left = -20; sc.right = 20; sc.top = 14; sc.bottom = -10; sc.near = 4; sc.far = 60; gunes.shadow.bias = -0.0005; gunes.shadow.normalBias = 0.03; sahne.add(gunes);

        /* dükkânlar */
        const tabelaDoku = (l, ad, kilitli) => c.doku(512, 256, (x, w, hh) => { x.fillStyle = kilitli ? "#E6E6E6" : "#FFF8EC"; x.beginPath(); x.roundRect(6, 6, w - 12, hh - 12, 36); x.fill(); x.lineWidth = 10; x.strokeStyle = kilitli ? "#9A9A9A" : "#5B3A29"; x.stroke(); x.fillStyle = kilitli ? "#A0A0A0" : "#D1495B"; x.font = "150px 'Tahta Harf', Andika, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(BUYUK(l) + l, w / 2, hh * 0.42); x.fillStyle = kilitli ? "#8A8A8A" : "#3A2A20"; x.font = "700 44px Onest, sans-serif"; x.fillText(kilitli ? "Yakında" : ad, w / 2, hh * 0.82); });
        const tenteD = (renk) => c.doku(256, 64, (x, w, hh) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? "#FFFFFF" : renk; x.fillRect((i * w) / 8, 0, w / 8 + 1, hh); } });
        let dukkanlar = [], mahalleGrup = null;
        const acikMi = (l) => { const i = ORDER.indexOf(l); return i === 0 || asamaOf(l) > 0 || asamaOf(ORDER[i - 1]) >= 4 || IO.learned().includes(l); };
        function dukkan(l, i) {
          const [, govde, cati, tip] = YER[l], ad = BUYUK(l) + " sesi", kilit = !acikMi(l);
          const x = -11 + i * 4.4, z = yolEgri(x) - 4.6, g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.sin(x * 0.12) * -0.12; mahalleGrup.add(g);
          const gm = M({ color: kilit ? 0xcfcfcf : govde, roughness: 0.75 }), cm = M({ color: kilit ? 0x9e9e9e : cati, roughness: 0.6 });
          const camM = new THREE.MeshStandardMaterial({ color: 0xbfe7ff, roughness: 0.1, metalness: 0.2, emissive: 0xffc45c, emissiveIntensity: asamaOf(l) >= 4 ? 0.9 : 0.05 }), kapM = M({ color: 0x6b4226, roughness: 0.6 }), beyaz = M({ color: 0xffffff, roughness: 0.6 });
          const Y = 2.5;
          ekle(T.yuvKutu(THREE, 3.2, Y, 2.4, 0.12), gm, [0, Y / 2, 0], g);
          ekle(new THREE.BoxGeometry(0.8, 1.35, 0.08), kapM, [-0.8, 0.68, 1.22], g);
          ekle(new THREE.BoxGeometry(1.3, 1.0, 0.06), camM, [0.65, 1.0, 1.22], g); ekle(new THREE.BoxGeometry(1.4, 0.1, 0.2), beyaz, [0.65, 0.45, 1.27], g);
          [-0.75, 0.75].forEach((px) => ekle(new THREE.BoxGeometry(0.55, 0.45, 0.06), camM, [px, 2.05, 1.22], g));
          if (tip === "ucgen") { const cg = new THREE.ConeGeometry(2.4, 1.4, 4, 1); cg.rotateY(Math.PI / 4); ekle(cg, cm, [0, Y + 0.7, 0], g).scale.set(1, 1, 0.78); }
          else if (tip === "kubbe") ekle(new THREE.SphereGeometry(1.45, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), cm, [0, Y, 0], g).scale.z = 0.78;
          else if (tip === "duz") ekle(new THREE.BoxGeometry(3.4, 0.22, 2.6), cm, [0, Y + 0.11, 0], g);
          else if (tip === "kule") { ekle(new THREE.BoxGeometry(3.3, 0.2, 2.5), cm, [0, Y + 0.1, 0], g); ekle(T.yuvKutu(THREE, 1, 1.3, 1, 0.06), gm, [0.8, Y + 0.85, -0.3], g); ekle(new THREE.ConeGeometry(0.8, 0.9, 4), cm, [0.8, Y + 1.95, -0.3], g).rotation.y = Math.PI / 4; }
          else if (tip === "degirmen") { ekle(new THREE.ConeGeometry(1.5, 1.2, 16), cm, [0, Y + 0.6, 0], g); const kan = new THREE.Group(); kan.position.set(0, Y + 0.3, 1.35); for (let k = 0; k < 4; k++) { const ko = new THREE.Group(); ko.rotation.z = (k * Math.PI) / 2; ekle(new THREE.BoxGeometry(0.28, 1.8, 0.04), beyaz, [0, 0.95, 0], ko); kan.add(ko); } g.add(kan); g.userData.pervane = kan; }
          const tente = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 0.9), new THREE.MeshStandardMaterial({ map: tenteD(kilit ? "#BDBDBD" : cati), side: THREE.DoubleSide, roughness: 0.8 })); tente.position.set(0, 1.78, 1.55); tente.rotation.x = -0.65; tente.castShadow = true; g.add(tente);
          const tab = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.0), new THREE.MeshStandardMaterial({ map: tabelaDoku(l, ad, kilit), roughness: 0.7 })); tab.position.set(0, 2.72, 1.42); g.add(tab);
          const tez = new THREE.Group(); tez.position.set(0.3, 0, 2.6); g.add(tez);
          ekle(T.yuvKutu(THREE, 2.2, 0.95, 0.7, 0.05), ahsapM, [0, 0.48, 0], tez); ekle(new THREE.BoxGeometry(2.35, 0.08, 0.85), M({ color: 0xc8925a, roughness: 0.5 }), [0, 0.99, 0], tez);
          return { l, i, g, x, z, kilit, camM, tez };
        }
        function mahalleKur(mi) {
          if (mahalleGrup) sahne.remove(mahalleGrup);
          mahalleGrup = new THREE.Group(); sahne.add(mahalleGrup);
          dukkanlar = [...MAHALLE[mi][1]].map((l, i) => dukkan(l, i));
        }
        /* karakterler */
        const [rehber, kedi, kopek, robot, baykus] = await Promise.all([T.karakter3B(c, "sincap", { boy: 1.75 }), T.karakter3B(c, "kedi", { boy: 0.95 }), T.karakter3B(c, "kopek", { boy: 1.05 }), T.karakter3B(c, "robot", { boy: 1.6 }), T.karakter3B(c, "baykus", { boy: 1.45 })]);
        const musteriler = [kedi, robot, kopek, baykus];
        [rehber, ...musteriler].forEach((k) => { sahne.add(k.kok); k.kok.visible = false; });
        try { await Promise.all([document.fonts.load("100px 'Tahta Harf'", "AaÇçĞğ"), document.fonts.load("700 40px Onest", "Aa")]); } catch (e) {}
        mahalleKur(mahalleI);
        /* kamera */
        const kam = { p: new THREE.Vector3(0, 5.2, 15.5), b: new THREE.Vector3(0, 1.4, -2.6), hp: null, hb: null };
        const genelKam = () => { kam.hp = new THREE.Vector3(0, 5.2, 15.5); kam.hb = new THREE.Vector3(0, 1.4, -2.6); };
        const dukkanKam = (d) => { const w = d.g.localToWorld(new THREE.Vector3(0.6, 0, 2.6)); kam.hp = new THREE.Vector3(w.x + 0.3, 2.2, w.z + 5.6); kam.hb = new THREE.Vector3(w.x + 0.1, 0.8, w.z - 0.4); };
        /* dükkâna dokun */
        const cv = kap.querySelector("canvas"), isin = new THREE.Raycaster(), fare = new THREE.Vector2();
        cv.addEventListener("click", (e) => { if (aktif) return; const b = cv.getBoundingClientRect(); fare.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); isin.setFromCamera(fare, kamera); const hit = isin.intersectObjects(dukkanlar.map((d) => d.g), true)[0]; if (!hit) return; const d = dukkanlar.find((d2) => { let p = hit.object; while (p) { if (p === d2.g) return true; p = p.parent; } return false; }); if (d) dukkanGir(d); });
        /* yardımcılar */
        const tw = (ms, fn) => new Promise((res) => { const s0 = performance.now(); const ad = (zz) => { const p = Math.min(1, (zz - s0) / ms); fn(p); if (p < 1 && !c.durdu) requestAnimationFrame(ad); else res(); }; requestAnimationFrame(ad); });
        const bekle = (ms) => new Promise((r2) => setTimeout(r2, ms));
        const yurut = (k, hedef, hiz = 1.8) => new Promise((res) => { k.hedef = { x: hedef.x, z: hedef.z, hiz, res }; k.oynat("yuru"); });
        const cumulative = (l) => ORDER.slice(0, ORDER.indexOf(l) + 1);
        const okur = (w, L) => IO.okWord(w, L);
        const hecele = (w) => { const v = (ch) => IO.VOW.includes(ch), a = [...w], out = []; let cur = ""; a.forEach((ch, i) => { const sinir = i > 0 && cur && ((!v(ch) && v(a[i + 1] || "") ) || (v(ch) && v(a[i - 1]))); if (sinir && [...cur].some(v)) { out.push(cur); cur = ""; } cur += ch; }); if (cur) { if ([...cur].some(v) || !out.length) out.push(cur); else out[out.length - 1] += cur; } return out; };
        /* Okuyan: sınıf listesinden sırayla rastgele (bugün gelmeyenler hariç) ya da öğretmen seçer */
        let okuyanSirasi = [];
        /* Okuyacak öğrenciyi çarkla seç. Okuyanlar listeden düşer, herkes okuyunca çark yeniden dolar. */
        let carkPano = null, ck = null;
        const kalanlar = () => { const c = T.store.activeClass(), s = T.store.get(), gun = ((s.attendance || {})[c.id] || {})[T.isoDate()] || {}; const gelen = (c.students || []).filter((st) => gun[st.id] !== "yok").map((st) => st.name); if (!okuyanSirasi.length || !okuyanSirasi.some((n) => gelen.includes(n))) okuyanSirasi = gelen.slice(); okuyanSirasi = okuyanSirasi.filter((n) => gelen.includes(n)); return okuyanSirasi; };
        function okuyanCark() {
          return new Promise(async (bitir) => {
            if ((dep().okuyan || "liste") !== "liste") return bitir(null);
            const liste = kalanlar(); if (!liste.length) return bitir(null);
            if (!carkPano) { carkPano = h("div.ks-cark", h("b", "Kim okuyacak?"), h("div.ks-cark-kap"), h("div.ks-cark-sonuc"), h("div.ks-yan")); }
            const sahneEl = host.querySelector(".ks-sahne"); sahneEl.append(carkPano); carkPano.hidden = false;
            const sonuc = carkPano.querySelector(".ks-cark-sonuc"), yan = carkPano.querySelector(".ks-yan"); sonuc.textContent = "";
            if (!ck) { ck = await T.cark3B(carkPano.querySelector(".ks-cark-kap"), null, { sure: 3.2, arka: ["#FFFFFF", "#F3EEE4"] }); if (!ck) { carkPano.hidden = true; return bitir(T.pick(liste)); } }
            ck.kur(liste.map((ad) => ({ ad })));
            const cevir = () => { if (ck.donuyor()) return; yan.replaceChildren(); const i = Math.floor(Math.random() * liste.length); ck.cevir(i, () => { const ad = liste[i]; sonuc.textContent = ad; T.sound.ok(); okuyanSirasi = okuyanSirasi.filter((n) => n !== ad); setTimeout(() => { carkPano.hidden = true; bitir(ad); }, 1300); }); };
            yan.replaceChildren(h("button.ks-yeni", { onclick: cevir }, T.icon("turn"), "Çarkı çevir"), h("button.ot-b.dinle", { onclick: () => { carkPano.hidden = true; bitir(null); } }, "Atla"));
          });
        }
        const tamEkran = () => { const el2 = host.querySelector(".ks-sahne"); try { (document.fullscreenElement ? document.exitFullscreen() : (el2.requestFullscreen || el2.webkitRequestFullscreen).call(el2)); } catch (e) { T.toast("Bu ortamda tam ekran kapalı"); } };
        function ustCiz() {
          const mod = dep().okuyan || "liste";
          ust.replaceChildren(h("div.ks-araclar",
              h("div.ks-okuyan-sec", h("span", "Okuyan"), h("div.seg", [["liste", "Çarkla seç"], ["ogretmen", "Öğretmen seçer"]].map(([v, ad]) => h("button", { "aria-pressed": String(v === mod), onclick: () => { depYaz((k) => (k.okuyan = v)); okuyanSirasi = []; ustCiz(); } }, ad)))),
              h("button.ks-tam", { onclick: tamEkran }, T.icon("full"), "Tam ekran")),
            h("div.ks-mahalleler", MAHALLE.map(([ad, ls], mi) => h("button.ks-mah" + (mi === mahalleI ? ".on" : ""), { onclick: () => { if (aktif) return; mahalleI = mi; mahalleKur(mi); genelKam(); ustCiz(); altCiz(); } }, h("b", ad), h("span", [...ls].map((l) => h("i" + (asamaOf(l) >= 4 ? ".ok" : ""), l)))))));
        }
        function altCiz() {
          fis.classList.remove("acik"); basamak.classList.remove("acik");
          const sira = dukkanlar.find((d) => asamaOf(d.l) < 4);
          alt.replaceChildren(h("div.ks-ipucu", sira ? (sira.kilit ? "Bu mahallenin dükkânları, önceki mahalle bitince açılır." : `Her dükkânda o sesin olduğu şeyler satılır. Sıradaki: ${adOf(sira.l)}`) : "Bu mahallenin bütün dükkânları açıldı. Harika!"),
            sira && !sira.kilit ? h("button.ks-yeni", { onclick: () => dukkanGir(sira) }, T.icon("next"), adOf(sira.l) + "na gir") : null);
        }
        /* dükkân içi oyun */
        let aktif = null, mi_ = 0, sayac = 0, kilitSec = false, sonFis = "";
        async function dukkanGir(d) {
          if (!d) return;
          if (d.kilit) { T.toast("Önce sıradaki dükkânları açın."); return; }
          aktif = d; sayac = 0; dukkanKam(d); host.querySelector(".ks-sahne").classList.add("icerde");
          const w = d.g.localToWorld(new THREE.Vector3(-1.45, 0, 2.75));
          rehber.kok.position.copy(w); rehber.kok.rotation.y = d.g.rotation.y + 0.55; rehber.kok.visible = true; rehber.oynat("salla");
          if (!IO.learned().includes(d.l)) IO.setLearned(IO.learned().concat(d.l));
          setTimeout(() => aktif === d && rehber.oynat("dur"), 2400);
          if (asamaOf(d.l) === 0 && sayac === 0) yazilisGoster(d, true); else { alt.replaceChildren(); oyunTuru(); }
        }
        /* Dükkâna ilk girişte: harfin yazılış yönü ve sesi. Oyun sırasında da açılabilir. */
        function yazilisGoster(d, ilk) {
          fis.classList.remove("acik");
          const kart = T.harfYazilis(d.l);
          const kapat = () => { pano.remove(); if (ilk) { alt.replaceChildren(); oyunTuru(); } };
          const pano = h("div.ks-yazilis", h("div.ks-yz-bas", h("b", adOf(d.l)), h("span", "Önce harfimizin yazılışına bakalım. Numaralı noktadan başla, ok yönünde yaz.")), kart,
            h("div.ks-yan", h("button.ot-b.dinle", { onclick: () => kart._goster() }, T.icon("reset"), "Tekrar göster"), h("button.ot-b.dinle", { onclick: () => T.harfSesi(d.l) }, T.icon("speaker"), "Sesi dinle"),
              h("button.ks-yeni", { onclick: kapat }, T.icon(ilk ? "next" : "check"), ilk ? "Müşterileri al" : "Tamam")));
          kap.parentNode.append(pano);
        }
        function dukkandanCik() {
          const yp = host.querySelector(".ks-yazilis"); if (yp) yp.remove(); if (carkPano) carkPano.hidden = true;
          aktif = null; host.querySelector(".ks-sahne").classList.remove("icerde"); rehber.kok.visible = false; musteriler.forEach((k) => { k.kok.visible = false; k.hedef = null; });
          genelKam(); mahalleKur(mahalleI); ustCiz(); altCiz();
        }
        /* Soru bankası: öğretmenin verdiği ses cep kartları ve kelime tabloları (T.KELIME_BANKASI) */
        const BANKA = T.KELIME_BANKASI || {};
        const kucukMu = (w) => w === T.trLower(w);
        function soruUret(l, asama) {
          const L = cumulative(l), b = BANKA[l] || { hece: [], kelime: [], cumle: [], soru: [] }, oku = (w) => okur(T.trLower(w), L);
          if (asama === "ses") {
            const goster = Math.random() < 0.5 ? BUYUK(l) : l, digerler = T.shuffle(ORDER.filter((x) => x !== l && L.includes(x))).concat(T.shuffle(ORDER.filter((x) => !L.includes(x)))).slice(0, 2);
            return { fis: goster, soz: goster === l ? "Bu harfin büyüğünü istiyorum:" : "Bu harfin küçüğünü istiyorum:", fisTur: "harf", secenek: T.shuffle([l, ...digerler]).map((x) => ({ id: x, gorunum: x === l ? (goster === l ? BUYUK(l) : l) : Math.random() < 0.5 ? BUYUK(x) : x, harf: true })), dogru: l };
          }
          if (asama === "hece") {
            /* birleştirme: fişte "n + i" yazar, çocuk "ni" hecesini seçer. Çeldirici: ters sıra ve aynı sesin başka hecesi */
            const heceler = b.hece.filter((x) => x.length === 2 && x.includes(l) && oku(x));
            if (!heceler.length) return null;
            const hedef = T.pick(heceler), ters = hedef[1] + hedef[0], dis = [];
            if (ters !== hedef) dis.push(ters);
            const yedek = b.hece.filter((x) => x.length === 2 && x.includes(l)).concat(Object.values(BANKA).flatMap((v) => v.hece.filter((x) => x.length === 2 && x.includes(hedef[0] === l ? l : hedef[0])))).filter((x) => [...x].every((ch) => ORDER.indexOf(ch) <= ORDER.indexOf(l) + 5));
            T.shuffle(heceler).concat(T.shuffle(yedek)).forEach((x) => dis.length < 2 && x !== hedef && x !== ters && !dis.includes(x) && dis.push(x));
            if (dis.length < 2) return null;
            return { fis: hedef[0] + " + " + hedef[1], soz: "Bu iki sesi birleştir, heceyi ver:", dinle: hedef, fisTur: "hece", secenek: T.shuffle([hedef, ...dis]).map((x) => ({ id: x, gorunum: x })), dogru: hedef };
          }
          if (asama === "kelime") {
            const havuz = [...new Set(b.kelime.filter(kucukMu).concat(b.tablo || []))].filter((w) => w.includes(l) && oku(w));
            const resimli = havuz.filter((w) => PIC.has(w));
            if (resimli.length && Math.random() < 0.6) { const hedef = T.pick(resimli), dis = T.shuffle(IO.PICS.map(([w2]) => w2).filter((w2) => w2 !== hedef)).slice(0, 2); return { fis: hedef, soz: "Fişi oku, resmini ver:", fisTur: "kelime", secenek: T.shuffle([hedef, ...dis]).map((x) => ({ id: x, resim: PIC.get(x) })), dogru: hedef }; }
            /* resmi olmayan kelimede: fişte heceler ayrı yazar (ka + lem), çocuk birleşmiş kelimeyi seçer */
            const kart = b.kelime.filter(kucukMu).filter((w) => oku(w) && hecele(w).length > 1), cok = havuz.filter((w) => hecele(w).length > 1 && hecele(w).length <= 3); if (!cok.length && !kart.length) return null;
            const hedef = kart.length && (Math.random() < 0.6 || !cok.length) ? T.pick(kart) : T.pick(cok), hc = hecele(hedef);
            const benzer = T.shuffle(havuz.filter((w) => w !== hedef && Math.abs(w.length - hedef.length) <= 2)), dis = [];
            benzer.forEach((w) => dis.length < 2 && dis.push(w));
            if (dis.length < 2) return null;
            return { fis: hc.join(" + "), soz: "Heceleri birleştir, kelimeyi ver:", dinle: hedef, fisTur: "kelime", secenek: T.shuffle([hedef, ...dis]).map((x) => ({ id: x, gorunum: x })), dogru: hedef };
          }
          if (asama === "cumle") {
            /* kartlardaki cümle ve sorusu: "Ata ile Ali at al." / "Ata ne al?" */
            const sorular = (b.soru || []).filter(([c2, s2, o]) => oku(c2.replace(/[.,?]/g, "").replace(/\s+/g, "")) && o.every(oku));
            if (!sorular.length) return null;
            const [cumle, soru, ops, dogru] = T.pick(sorular);
            const ek = b.kelime.filter(kucukMu).filter((w) => oku(w) && !ops.includes(w) && !cumle.toLocaleLowerCase("tr").includes(w));
            const secenek = ops.concat(ek.length && kucukMu(dogru) ? [T.pick(ek)] : []);
            return { fis: cumle, soz: "Fişimi oku:", soru, dinle: cumle + " " + soru, fisTur: "cumle", secenek: T.shuffle(secenek).map((x) => ({ id: x, gorunum: x })), dogru };
          }
        }
        const isaretle = (metin, l) => [...metin].map((ch) => (T.trLower(ch) === l ? h("span.ks-ses", ch) : document.createTextNode(ch)));
        async function oyunTuru() {
          const d = aktif; if (!d) return;
          const ai = asamaOf(d.l);
          if (ai >= 4) return dukkanAcildi(d, true);
          const [asama, asamaAd] = ASAMA[ai];
          let q = null; for (let i = 0; i < 8; i++) { const q2 = soruUret(d.l, asama); if (q2) q = q2; if (q && q.fis !== sonFis) break; } if (q) sonFis = q.fis;
          basamakCiz(d, ai);
          if (!q) { alt.replaceChildren(h("div.ks-ipucu", asamaAd + " basamağı için bu seslerle henüz yeterli kelime yok. Birkaç ses sonra daha çok olacak."), h("button.ks-yeni", { onclick: () => { depYaz((k) => (k.asama[d.l] = ai + 1)); sayac = 0; oyunTuru(); } }, T.icon("next"), "Sonraki basamağa geç")); return; }
          const k = musteriler[mi_++ % musteriler.length];
          const w = d.g.localToWorld(new THREE.Vector3(1.75, 0, 3.4)), giris = d.g.localToWorld(new THREE.Vector3(8, 0, 4.6));
          k.kok.position.copy(giris); k.kok.visible = true;
          alt.replaceChildren(h("div.ks-ipucu", "Bir müşteri geliyor..."));
          await yurut(k, w, 2.4); if (aktif !== d) return;
          k.kok.rotation.y = d.g.rotation.y - 1.25; k.oynat("dur");
          alt.replaceChildren(h("div.ks-ipucu", (dep().okuyan || "liste") === "liste" ? "Çarkı çevirip okuyacak arkadaşı seçin." : "Okuyacak öğrenciyi seçin."));
          const okuyan = await okuyanCark(); if (aktif !== d) return;
          fis.replaceChildren(okuyan ? h("div.ks-okuyan", T.icon("hand"), h("b", okuyan), h("button", { onclick: async (e) => { e.stopPropagation(); const y = await okuyanCark(); if (y) fis.querySelector(".ks-okuyan b").textContent = y; } }, "Başkası")) : null, h("small.ok-yazi", q.soz), h("b.ks-fis-" + q.fisTur, ...(q.fisTur === "harf" ? [q.fis] : isaretle(q.fis, d.l))), q.soru ? h("div.ks-fis-soru.ok-yazi", q.soru) : null);
          fis.classList.add("acik"); fis._k = k;
          alt.replaceChildren(
            h("div.ks-tepsi", q.secenek.map((s2) => h("button.ks-urun" + (s2.harf ? ".harf" : s2.resim ? ".resim" : ""), { onclick: (e) => sec(e.currentTarget, s2.id === q.dogru, k, d) }, s2.resim ? h("span.ks-emoji", s2.resim) : s2.gorunum))),
            h("div.ks-yan",
              h("button.ot-b.dinle", { onclick: () => (asama === "ses" ? T.harfSesi(d.l) : T.speak(q.dinle || q.fis)) }, T.icon("speaker"), "Dinle"),
              h("button.ot-b.dinle", { onclick: () => yazilisGoster(d, false), "aria-label": "Harfin yazılışı" }, T.icon("pen"), "Yazılış"),
              h("button.ks-kapat", { onclick: () => dukkandanCik(), "aria-label": "Dükkândan çık" }, T.icon("close"))),
          );
        }
        async function sec(btn, dogru, k, d) {
          if (kilitSec) return;
          if (!dogru) { btn.classList.add("kotu"); T.sound.no(); setTimeout(() => btn.classList.remove("kotu"), 500); if (k.var("hayir")) k.oynat("hayir", { dongu: false }).then(() => k.oynat("dur")); else { const y0 = k.kok.rotation.y; tw(600, (t) => (k.kok.rotation.y = y0 + Math.sin(t * Math.PI * 4) * 0.35)); } return; }
          kilitSec = true; btn.classList.add("iyi"); T.sound.ok();
          fis.classList.remove("acik");
          rehber.oynat("sevin", { dongu: false }).then(() => aktif && rehber.oynat("dur"));
          if (k.var("sevin")) { k.oynat("sevin", { dongu: false }); await bekle(1400); } else { await tw(600, (t) => (k.kok.position.y = Math.abs(Math.sin(t * Math.PI * 2)) * 0.35)); k.kok.position.y = 0; }
          const cikis = d.g.localToWorld(new THREE.Vector3(-8, 0, 4.6));
          yurut(k, cikis, 2.6).then(() => { k.kok.visible = false; });
          sayac++;
          const ai = asamaOf(d.l), asama = ASAMA[ai][0];
          basamakCiz(d, ai);
          if (sayac >= MUSTERI_SAY[asama]) { sayac = 0; depYaz((s2) => (s2.asama[d.l] = ai + 1)); basamakCiz(d, ai + 1, true); if (ai + 1 < 4) { T.konfeti && T.konfeti(); } await bekle(900); }
          kilitSec = false;
          if (aktif === d) oyunTuru();
        }
        function basamakCiz(d, ai, kutla) {
          basamak.replaceChildren(h("div.ks-dk", h("span.ks-harf", BUYUK(d.l) + d.l), h("b", adOf(d.l))),
            h("div.ks-adimlar", ASAMA.map(([, ad], i) => h("div.ks-adim" + (i < ai ? ".bitti" : i === ai ? ".simdi" : ""), h("i", i < ai ? "✓" : String(i + 1)), ad))),
            ai < 4 ? h("div.ks-sayac", Array.from({ length: MUSTERI_SAY[ASAMA[ai][0]] }, (_, i) => h("i" + (i < sayac ? ".ok" : "")))) : null);
          basamak.classList.add("acik"); if (kutla) { basamak.classList.remove("kutla"); void basamak.offsetWidth; basamak.classList.add("kutla"); }
        }
        function dukkanAcildi(d, zaten) {
          fis.classList.remove("acik");
          d.camM.emissiveIntensity = 0.9; basamakCiz(d, 4);
          if (!zaten) { T.sound.ok(); T.konfeti && T.konfeti(); }
          rehber.oynat("sevin");
          const sonraki = ORDER[ORDER.indexOf(d.l) + 1];
          alt.replaceChildren(h("div.ks-acildi", h("b", adOf(d.l) + " açıldı!"), h("span", "Ses, hece, kelime ve cümle basamaklarını bitirdiniz.")),
            h("div.ks-yan",
              h("button.ot-b.dinle", { onclick: () => { depYaz((k) => (k.asama[d.l] = 0)); sayac = 0; oyunTuru(); } }, T.icon("reset"), "Baştan oyna"),
              sonraki ? h("button.ks-yeni", { onclick: () => { const mi = MAHALLE.findIndex(([, ls]) => ls.includes(sonraki)); if (mi !== mahalleI) { mahalleI = mi; mahalleKur(mi); ustCiz(); } else mahalleKur(mi); const d2 = dukkanlar.find((x) => x.l === sonraki); d2.kilit = false; rehber.oynat("dur"); dukkanGir(d2); } }, T.icon("next"), "Sıradaki: " + adOf(sonraki)) : null,
              h("button.ks-kapat", { onclick: () => dukkandanCik(), "aria-label": "Dükkândan çık" }, T.icon("close"))));
          setTimeout(() => aktif === d && rehber.oynat("dur"), 2600);
        }
        /* döngü */
        const v3 = new THREE.Vector3();
        c.kare = (dt) => {
          if (kam.hp) { kam.p.lerp(kam.hp, Math.min(1, dt * 2.5)); kam.b.lerp(kam.hb, Math.min(1, dt * 2.5)); }
          const uz = 1 / Math.min(1, kamera.aspect / 1.75); kamera.position.copy(kam.b).add(v3.copy(kam.p).sub(kam.b).multiplyScalar(uz)); kamera.lookAt(kam.b);
          bulutlar.forEach((b, i) => { b.position.x += dt * (0.4 + i * 0.05); if (b.position.x > 70) b.position.x = -70; });
          dukkanlar.forEach((d) => { if (d.g.userData.pervane) d.g.userData.pervane.rotation.z += dt * 1.1; });
          [rehber, ...musteriler].forEach((k) => {
            k.guncelle(dt);
            if (k.hedef) { const p = k.kok.position, dx = k.hedef.x - p.x, dz = k.hedef.z - p.z, dd = Math.hypot(dx, dz); if (dd < 0.06) { const f = k.hedef.res; k.hedef = null; k.oynat("dur"); f && f(); } else { const st = Math.min(dd, dt * k.hedef.hiz); p.x += (dx / dd) * st; p.z += (dz / dd) * st; let fa = Math.atan2(dx, dz) - k.kok.rotation.y; fa = Math.atan2(Math.sin(fa), Math.cos(fa)); k.kok.rotation.y += fa * Math.min(1, dt * 8); } }
          });
          if (false) { fis._k.kok.getWorldPosition(v3); v3.y += fis._k.dortAyak ? 1.35 : 1.85; v3.project(kamera); const b = kap.getBoundingClientRect(); fis.style.transform = `translate(${(v3.x * 0.5 + 0.5) * b.width}px, ${(-v3.y * 0.5 + 0.5) * b.height}px) translate(-50%, -100%)`; }
        };
        yuk.remove(); ustCiz(); altCiz();
        T._kasaba = { dukkanGir: (l) => dukkanGir(dukkanlar.find((d) => d.l === l)), dukkanlar, soruUret, sec, musteriler, rehber };
      }
    },
  };
})();
