/* Ses Kasabası: 1. sınıf ilk okuma yazma. Her yeni seste kasabaya o sesle başlayan bir yer açılır.
   Kasabalılar yalnızca öğrenilmiş seslerle konuşur; okunan her cümle ve bulunan her kelime o yere yıldız kazandırır. */
(function () {
  const { h } = T;
  /* ses: [yer adı, gövde rengi, çatı rengi, çatı tipi, kat] */
  const YER = {
    a: ["Arı kovanı evi", "#F6C445", "#B5651D", "kubbe", 1], n: ["Nalbur", "#7FA7C9", "#3D5A80", "ucgen", 1], e: ["Eczane", "#F2F2F2", "#2E9E5B", "duz", 2], t: ["Tren garı", "#C96F4A", "#5B3A29", "kule", 1],
    i: ["İtfaiye", "#D94B3D", "#7A1F1A", "duz", 2], l: ["Lokanta", "#F4A261", "#9C3D2B", "ucgen", 1], o: ["Okul", "#F1D7A8", "#B23A48", "kule", 2], k: ["Kütüphane", "#8E7DBE", "#4B3F72", "ucgen", 2],
    u: ["Uçurtma dükkânı", "#9ED9CC", "#E76F51", "ucgen", 1], r: ["Radyo evi", "#E9C46A", "#264653", "kule", 1], "ı": ["Irmak köprüsü evi", "#8ECAE6", "#219EBC", "duz", 1], m: ["Manav", "#90BE6D", "#577590", "ucgen", 1],
    "ü": ["Üzüm bağı evi", "#B392AC", "#5E3C58", "ucgen", 1], s: ["Su kulesi", "#A8DADC", "#457B9D", "kule", 2], "ö": ["Ördek göleti evi", "#FFE8A3", "#6C9A8B", "kubbe", 1], y: ["Yel değirmeni", "#F7EDE2", "#A0522D", "degirmen", 2],
    d: ["Dondurmacı", "#FFC8DD", "#CDB4DB", "kubbe", 1], z: ["Zeytinlik evi", "#C9D6A3", "#5F7161", "ucgen", 1], "ç": ["Çiçekçi", "#FFAFCC", "#2A9D8F", "ucgen", 1], b: ["Bakkal", "#F4D35E", "#EE964B", "duz", 1],
    g: ["Gözlemevi", "#DDE5ED", "#3A506B", "kubbe", 2], "ş": ["Şekerci", "#FFD6E0", "#D1495B", "ucgen", 1], c: ["Ceviz bahçesi evi", "#D4A373", "#6F4E37", "ucgen", 1], p: ["Pastane", "#FFF1E6", "#E07A5F", "kubbe", 2],
    h: ["Hastane", "#FFFFFF", "#E63946", "duz", 2], "ğ": ["Dağ evi", "#B7B7A4", "#6B705C", "ucgen", 1], v: ["Veteriner", "#CDEAC0", "#4F772D", "duz", 1], f: ["Fırın", "#E9B872", "#8C4A2F", "kubbe", 1], j: ["Jimnastik salonu", "#BDE0FE", "#3A86FF", "duz", 2],
  };
  const BUYUK = (l) => l.toLocaleUpperCase("tr-TR");
  const deps = () => { const s = T.store.get(); const id = T.store.activeClass().id; s.kasaba = s.kasaba || {}; return (s.kasaba[id] = s.kasaba[id] || { yildiz: {} }); };
  const yildizEkle = (l, n = 1) => T.store.update((s) => { const id = T.store.activeClass().id; s.kasaba = s.kasaba || {}; const k = (s.kasaba[id] = s.kasaba[id] || { yildiz: {} }); k.yildiz[l] = (k.yildiz[l] || 0) + n; });

  T.tools["ses-kasabasi"] = {
    back: "birinci", grades: [1, 1], title: "Ses Kasabası", icon: "home", tone: "leaf",
    short: "Her yeni seste kasabaya yeni bir yer açılır. Kasabalılar öğrendiğiniz seslerle konuşur.",
    render(host, api) {
      const IO = T.ilkOkuma; if (!IO) { host.append(h("p", "İlk okuma verisi yüklenemedi.")); return; }
      const kap = h("div.ks-kap"), yuk = h("div.ot3-yuk", h("div.ot3-yuk-ic"), "Kasaba kuruluyor...");
      const panel = h("div.ks-panel"), ust = h("div.ks-ust"), balon = h("div.ks-balon");
      const sahneEl = h("div.ks-sahne", kap, balon, ust, panel, yuk);
      host.append(sahneEl);
      Promise.all([T.sahne3(kap, { kamera: [0, 17, 21], bak: [0, 0, 0.5], fov: 38, env: ["#DDF3FF", "#A6D9A0", "#4C6B3C"], oran: 1.8, sigdir: 27 }, api), T.modelYukle("sincap"), T.modelYukle("kedi"), T.modelYukle("kopek")])
        .then(([c]) => { if (!c) { yuk.textContent = "Bu cihazda 3B çizim açılamadı."; return; } kur(c); })
        .catch((e) => { console.error(e); yuk.textContent = "Kasaba yüklenemedi. Sayfayı yenileyip tekrar dene."; });

      async function kur(c) {
        const { THREE, sahne, kamera, r } = c;
        r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMappingExposure = 1.08;
        sahne.fog = new THREE.Fog(0xcfe9f7, 40, 85);
        const M = (o) => new THREE.MeshStandardMaterial(o);
        const ekle = (geo, mat, poz, ust = sahne) => { const m = new THREE.Mesh(geo, mat); if (poz) m.position.set(...poz); m.castShadow = true; m.receiveShadow = true; ust.add(m); return m; };
        /* gökyüzü ve zemin */
        const gok = c.doku(16, 256, (x, w, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, "#6EC1F2"); g.addColorStop(0.55, "#BFE6FA"); g.addColorStop(1, "#F2FAFF"); x.fillStyle = g; x.fillRect(0, 0, w, hh); });
        const kubbe = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 16), new THREE.MeshBasicMaterial({ map: gok, side: THREE.BackSide, fog: false })); sahne.add(kubbe);
        const cimen = c.doku(1024, 1024, (x, w, hh) => { x.fillStyle = "#7DBB5A"; x.fillRect(0, 0, w, hh); for (let i = 0; i < 22000; i++) { const t = Math.random(); x.fillStyle = t < 0.5 ? "rgba(70,120,40,.18)" : "rgba(190,230,120,.16)"; x.fillRect(Math.random() * w, Math.random() * hh, 2 + Math.random() * 3, 2); } for (let i = 0; i < 140; i++) { x.fillStyle = ["#FFFFFF", "#FFE066", "#FF8FAB", "#C3A6FF"][i % 4]; x.beginPath(); x.arc(Math.random() * w, Math.random() * hh, 2.2, 0, 7); x.fill(); } });
        cimen.wrapS = cimen.wrapT = THREE.RepeatWrapping; cimen.repeat.set(6, 6);
        const ada = new THREE.Mesh(new THREE.CylinderGeometry(30, 31, 1.2, 64), M({ map: cimen, roughness: 0.95 })); ada.position.y = -0.6; ada.receiveShadow = true; sahne.add(ada);
        const kenar = new THREE.Mesh(new THREE.CylinderGeometry(31, 27, 4, 64), M({ color: 0x8b6a4b, roughness: 1 })); kenar.position.y = -3.2; sahne.add(kenar);
        const su = new THREE.Mesh(new THREE.CircleGeometry(80, 48), M({ color: 0x5fb6d9, roughness: 0.2, metalness: 0.1 })); su.rotation.x = -Math.PI / 2; su.position.y = -2.6; sahne.add(su);
        /* yollar */
        const yolM = M({ color: 0xe8dcc2, roughness: 0.9 });
        const COL = 6, ROW = 5, DX = 4.4, DZ = 4.6, x0 = -((COL - 1) * DX) / 2, z0 = -((ROW - 1) * DZ) / 2 - 0.5;
        for (let r2 = 0; r2 <= ROW; r2++) { const y = new THREE.Mesh(new THREE.BoxGeometry(COL * DX + 1.2, 0.04, 0.9), yolM); y.position.set(0, 0.02, z0 + r2 * DZ - DZ / 2 + 0.25); y.receiveShadow = true; sahne.add(y); }
        for (let c2 = 0; c2 <= COL; c2++) { const y = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, ROW * DZ), yolM); y.position.set(x0 + c2 * DX - DX / 2, 0.021, z0 + (ROW * DZ) / 2 - DZ / 2 + 0.25); y.receiveShadow = true; sahne.add(y); }
        /* ağaçlar ve bulutlar */
        const agacM = [M({ color: 0x4f9a4a, roughness: 0.8 }), M({ color: 0x6cb35a, roughness: 0.8 }), M({ color: 0x3f8a5a, roughness: 0.8 })], govM = M({ color: 0x8b5a2b });
        const agac = (x, z, s = 1) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); ekle(new THREE.CylinderGeometry(0.12, 0.18, 1, 8), govM, [0, 0.5, 0], g); const t = Math.random(); if (t < 0.5) { ekle(new THREE.SphereGeometry(0.75, 16, 12), agacM[(Math.random() * 3) | 0], [0, 1.45, 0], g); ekle(new THREE.SphereGeometry(0.5, 14, 10), agacM[(Math.random() * 3) | 0], [0.35, 1.85, 0.1], g); } else { ekle(new THREE.ConeGeometry(0.7, 1.6, 12), agacM[2], [0, 1.6, 0], g); ekle(new THREE.ConeGeometry(0.55, 1.2, 12), agacM[0], [0, 2.2, 0], g); } sahne.add(g); };
        for (let i = 0; i < 46; i++) { const a = (i / 46) * Math.PI * 2 + Math.random() * 0.1, rr = 23 + Math.random() * 5; agac(Math.cos(a) * rr, Math.sin(a) * rr, 0.9 + Math.random() * 0.7); }
        const bulutlar = [];
        const bulutM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: 0xffffff, emissiveIntensity: 0.25 });
        for (let i = 0; i < 7; i++) { const g = new THREE.Group(); for (let j = 0; j < 4; j++) { const s2 = new THREE.Mesh(new THREE.SphereGeometry(1.2 + Math.random(), 14, 10), bulutM); s2.position.set(j * 1.3 - 2, Math.random() * 0.6, Math.random() * 0.6); g.add(s2); } g.position.set(-40 + i * 13, 14 + Math.random() * 6, -30 - Math.random() * 15); sahne.add(g); bulutlar.push(g); }
        /* ışık */
        sahne.add(new THREE.HemisphereLight(0xdff3ff, 0x5a7a40, 0.55));
        const gunes = new THREE.DirectionalLight(0xfff1d8, 3.1); gunes.position.set(-14, 26, 14); gunes.castShadow = true; gunes.shadow.mapSize.set(2048, 2048); const sc = gunes.shadow.camera; sc.left = -18; sc.right = 18; sc.top = 16; sc.bottom = -16; sc.near = 5; sc.far = 70; gunes.shadow.bias = -0.0005; gunes.shadow.normalBias = 0.03; sahne.add(gunes);
        /* yerler */
        const yerler = {};
        const tabelaDoku = (l, ad) => c.doku(512, 256, (x, w, hh) => { x.fillStyle = "#FFF8EC"; x.beginPath(); x.roundRect(6, 6, w - 12, hh - 12, 36); x.fill(); x.lineWidth = 10; x.strokeStyle = "#5B3A29"; x.stroke(); x.fillStyle = "#D1495B"; x.font = "900 150px 'Baloo 2', sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(BUYUK(l) + l, w / 2, hh * 0.42); x.fillStyle = "#3A2A20"; x.font = "800 44px 'Baloo 2', sans-serif"; x.fillText(ad, w / 2, hh * 0.82); });
        function bina(l, poz) {
          const [ad, govde, cati, tip, kat] = YER[l];
          const g = new THREE.Group(); g.position.set(poz.x, 0, poz.z);
          const tas = ekle(new THREE.BoxGeometry(3.4, 0.08, 3.4), M({ color: 0xd9cdb6, roughness: 0.9 }), [0, 0.04, 0], g);
          const bina3 = new THREE.Group(); g.add(bina3);
          const gm = M({ color: govde, roughness: 0.75 }), cm = M({ color: cati, roughness: 0.6 }), cam = new THREE.MeshStandardMaterial({ color: 0xbfe7ff, roughness: 0.1, metalness: 0.2, emissive: 0x335577, emissiveIntensity: 0.25 }), kapM = M({ color: 0x6b4226, roughness: 0.6 }), beyaz = M({ color: 0xffffff, roughness: 0.6 });
          const Y = 1.3 * kat;
          ekle(T.yuvKutu(THREE, 2.4, Y, 2.0, 0.12), gm, [0, Y / 2 + 0.08, 0], bina3);
          ekle(new THREE.BoxGeometry(0.62, 0.95, 0.08), kapM, [0, 0.55, 1.02], bina3);
          ekle(new THREE.SphereGeometry(0.04, 8, 6), M({ color: 0xffd166, metalness: 0.8, roughness: 0.3 }), [0.2, 0.55, 1.07], bina3);
          for (let k = 0; k < kat; k++) [-0.75, 0.75].forEach((px) => { if (k === 0 && Math.abs(px) < 0.5) return; ekle(new THREE.BoxGeometry(0.5, 0.5, 0.06), cam, [px, 0.75 + k * 1.3, 1.01], bina3); ekle(new THREE.BoxGeometry(0.6, 0.08, 0.14), beyaz, [px, 0.47 + k * 1.3, 1.03], bina3); });
          const cy = Y + 0.08;
          if (tip === "ucgen") { const cg = new THREE.ConeGeometry(1.85, 1.2, 4, 1); cg.rotateY(Math.PI / 4); const m = ekle(cg, cm, [0, cy + 0.6, 0], bina3); m.scale.set(1, 1, 0.85); }
          else if (tip === "kubbe") ekle(new THREE.SphereGeometry(1.15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), cm, [0, cy, 0], bina3);
          else if (tip === "duz") { ekle(new THREE.BoxGeometry(2.6, 0.18, 2.2), cm, [0, cy + 0.09, 0], bina3); ekle(new THREE.BoxGeometry(2.4, 0.3, 0.06), cm, [0, cy - 0.12, 1.06], bina3); }
          else if (tip === "kule") { ekle(new THREE.BoxGeometry(2.5, 0.16, 2.1), cm, [0, cy + 0.08, 0], bina3); ekle(T.yuvKutu(THREE, 0.8, 1.1, 0.8, 0.06), gm, [0.6, cy + 0.7, -0.3], bina3); ekle(new THREE.ConeGeometry(0.62, 0.8, 4), cm, [0.6, cy + 1.65, -0.3], bina3).rotation.y = Math.PI / 4; }
          else if (tip === "degirmen") { ekle(new THREE.ConeGeometry(1.1, 1, 16), cm, [0, cy + 0.5, 0], bina3); const kan = new THREE.Group(); kan.position.set(0, cy - 0.2, 1.15); for (let i = 0; i < 4; i++) { const p = ekle(new THREE.BoxGeometry(0.22, 1.5, 0.04), beyaz, [0, 0.8, 0]); const ko = new THREE.Group(); ko.rotation.z = (i * Math.PI) / 2; ko.add(p); kan.add(ko); } bina3.add(kan); g.userData.pervane = kan; }
          /* tabela */
          const tab = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.95), new THREE.MeshStandardMaterial({ map: tabelaDoku(l, ad), roughness: 0.7 }));
          tab.position.set(0, Y + (tip === "ucgen" ? 0.55 : 0.35) + 0.08, 1.09); if (tip === "ucgen" || tip === "kubbe") tab.position.set(0, Y - 0.2 + 0.08, 1.06);
          if (kat === 1 && (tip === "ucgen" || tip === "kubbe")) { tab.position.set(0, 1.62, 1.6); const dir = ekle(new THREE.CylinderGeometry(0.04, 0.04, 1.7, 6), kapM, [-0.85, 0.85, 1.6], g); const dir2 = ekle(new THREE.CylinderGeometry(0.04, 0.04, 1.7, 6), kapM, [0.85, 0.85, 1.6], g); g.add(tab); } else bina3.add(tab);
          /* süs: yıldızlara göre */
          const sus = new THREE.Group(); g.add(sus);
          sahne.add(g);
          return { g, bina3, sus, l, ad, Y };
        }
        function bosArsa(l, poz) {
          const g = new THREE.Group(); g.position.set(poz.x, 0, poz.z);
          const cizgi = c.doku(256, 256, (x, w) => { x.clearRect(0, 0, w, w); x.strokeStyle = "rgba(255,255,255,.85)"; x.lineWidth = 10; x.setLineDash([22, 16]); x.strokeRect(14, 14, w - 28, w - 28); x.fillStyle = "rgba(255,255,255,.95)"; x.font = "900 110px 'Baloo 2', sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("?", w / 2, w / 2 + 6); });
          const p = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({ map: cizgi, transparent: true, opacity: 0.45, depthWrite: false })); p.rotation.x = -Math.PI / 2; p.position.y = 0.06; g.add(p);
          sahne.add(g); return { g, bos: true, l };
        }
        const ORDER = IO.ORDER, POZ = {};
        ORDER.forEach((l, i) => { const rr = Math.floor(i / COL), cc = rr % 2 ? COL - 1 - (i % COL) : i % COL; POZ[l] = { x: x0 + cc * DX, z: z0 + (ROW - 1 - rr) * DZ }; });
        /* meydan: son boş hücre */
        const meydan = new THREE.Group(); { const i = ORDER.length, rr = Math.floor(i / COL), cc = rr % 2 ? COL - 1 - (i % COL) : i % COL; meydan.position.set(x0 + cc * DX, 0, z0 + (ROW - 1 - rr) * DZ); }
        ekle(new THREE.CylinderGeometry(1.2, 1.35, 0.4, 32), M({ color: 0xcfd8dc, roughness: 0.6 }), [0, 0.2, 0], meydan); ekle(new THREE.CylinderGeometry(1.0, 1.0, 0.05, 32), M({ color: 0x6fc3ef, roughness: 0.1, metalness: 0.2 }), [0, 0.42, 0], meydan); ekle(new THREE.CylinderGeometry(0.15, 0.25, 1, 12), M({ color: 0xcfd8dc }), [0, 0.9, 0], meydan); ekle(new THREE.SphereGeometry(0.32, 16, 10), M({ color: 0x6fc3ef, roughness: 0.1 }), [0, 1.5, 0], meydan); sahne.add(meydan);
        const L0 = IO.learned();
        ORDER.forEach((l) => { yerler[l] = L0.includes(l) ? bina(l, POZ[l]) : bosArsa(l, POZ[l]); });
        const yildizlar = new Map();
        const yildizCiz = (l) => {
          const y = yerler[l]; if (!y || y.bos) return; const n = deps().yildiz[l] || 0;
          y.sus.clear();
          const cicekM = [M({ color: 0xff8fab }), M({ color: 0xffd166 }), M({ color: 0xc3a6ff })];
          if (n >= 1) for (let i = 0; i < Math.min(6, n + 1); i++) { const cc = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), cicekM[i % 3]); cc.position.set(-1.4 + (i % 3) * 0.2, 0.18, 1.35 - Math.floor(i / 3) * 0.25); cc.castShadow = true; y.sus.add(cc); const cc2 = cc.clone(); cc2.position.x *= -1; y.sus.add(cc2); }
          if (n >= 3) { const dir = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), M({ color: 0xdddddd, metalness: 0.6 })); dir.position.set(1.4, y.Y + 0.9, -0.8); y.sus.add(dir); const bay = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.38), M({ color: 0xe63946, side: THREE.DoubleSide })); bay.position.set(1.72, y.Y + 1.42, -0.8); y.sus.add(bay); y.g.userData.bayrak = bay; }
          if (n >= 5) for (let i = 0; i < 9; i++) { const lamba = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshStandardMaterial({ color: 0xfff2b0, emissive: ["#FFD166", "#FF8FAB", "#90E0EF"][i % 3], emissiveIntensity: 1.6 })); lamba.position.set(-1.2 + i * 0.3, y.Y + 0.15 - Math.sin((i / 8) * Math.PI) * 0.25, 1.12); y.sus.add(lamba); }
          let sp = yildizlar.get(l);
          if (n > 0) { if (!sp) { sp = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, transparent: true })); sp.renderOrder = 5; sahne.add(sp); yildizlar.set(l, sp); } const tx = c.doku(256, 128, (x, w, hh) => { x.fillStyle = "rgba(255,255,255,.95)"; x.beginPath(); x.roundRect(4, 14, w - 8, hh - 28, 50); x.fill(); x.fillStyle = "#F4A100"; x.font = "900 74px 'Baloo 2', sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("★ " + n, w / 2, hh / 2 + 4); }); sp.material.map = tx; sp.material.needsUpdate = true; sp.scale.set(1.3, 0.65, 1); sp.position.set(POZ[l].x + 1.25, y.Y + 2.6, POZ[l].z); }
        };
        ORDER.forEach(yildizCiz);
        /* karakterler */
        const rehber = await T.karakter3B(c, "sincap", { boy: 1.25 }), kedi = await T.karakter3B(c, "kedi", { boy: 0.55 }), kopek = await T.karakter3B(c, "kopek", { boy: 0.62 });
        [rehber, kedi, kopek].forEach((k) => sahne.add(k.kok));
        rehber.kok.position.set(meydan.position.x + 1.8, 0, meydan.position.z + 1.6);
        kedi.kok.position.set(-3, 0, 2.2); kopek.kok.position.set(3, 0, -2);
        const gezenler = [{ k: kedi, hiz: 1.2 }, { k: kopek, hiz: 1.5 }];
        const yolNoktasi = () => { const cc = Math.floor(Math.random() * (COL + 1)), rr = Math.floor(Math.random() * (ROW + 1)); return Math.random() < 0.5 ? { x: x0 + cc * DX - DX / 2, z: z0 + Math.random() * (ROW - 1) * DZ } : { x: x0 + Math.random() * (COL - 1) * DX, z: z0 + rr * DZ - DZ / 2 + 0.25 }; };
        gezenler.forEach((gz) => { gz.hedef = yolNoktasi(); gz.bekle = Math.random() * 2; });
        let rehberHedef = null, rehberCb = null;
        const rehberGit = (x, z) => new Promise((res) => { rehberHedef = { x, z }; rehberCb = res; rehber.oynat("yuru"); });
        /* kamera: sürükle, yakınlaş, odakla */
        const kam = { hx: 0, hz: 0.5, uz: 1, hedef: null };
        const kamGuncelle = (dt) => { if (kam.hedef) { kam.hx += (kam.hedef.x - kam.hx) * Math.min(1, dt * 3); kam.hz += (kam.hedef.z - kam.hz) * Math.min(1, dt * 3); kam.uz += (kam.hedef.uz - kam.uz) * Math.min(1, dt * 3); } const u = kam.uz; kamera.position.set(kam.hx, 17 * u, kam.hz + 20.5 * u); kamera.lookAt(kam.hx, 0, kam.hz); };
        const cv = kap.querySelector("canvas"); let surukle = null;
        const pm = (e) => hareket(e), pu = (e) => birak(e); window.addEventListener("pointermove", pm); window.addEventListener("pointerup", pu); T.onLeave && T.onLeave(() => { window.removeEventListener("pointermove", pm); window.removeEventListener("pointerup", pu); });
        cv.addEventListener("pointerdown", (e) => { surukle = { x: e.clientX, y: e.clientY, hx: kam.hx, hz: kam.hz, oynadi: false }; });
        function hareket(e) { if (!surukle) return; const dx = e.clientX - surukle.x, dy = e.clientY - surukle.y; if (Math.hypot(dx, dy) > 6) surukle.oynadi = true; if (!surukle.oynadi) return; const k = (0.045 * kam.uz * 900) / Math.max(400, cv.clientHeight); kam.hedef = null; kam.hx = T.clamp(surukle.hx - dx * k, -14, 14); kam.hz = T.clamp(surukle.hz - dy * k, -10, 10); }
        function birak(e) { const s = surukle; surukle = null; if (s && !s.oynadi) tikla(e); }
        cv.addEventListener("wheel", (e) => { e.preventDefault(); kam.hedef = null; kam.uz = T.clamp(kam.uz * (e.deltaY > 0 ? 1.1 : 0.9), 0.35, 1.25); }, { passive: false });
        const isin = new THREE.Raycaster(), fare = new THREE.Vector2();
        function tikla(e) {
          const b = cv.getBoundingClientRect(); fare.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); isin.setFromCamera(fare, kamera);
          const hits = isin.intersectObjects(Object.values(yerler).map((y) => y.g), true);
          if (!hits.length) return; let o = hits[0].object; while (o && !Object.values(yerler).some((y) => y.g === o)) o = o.parent;
          const y = Object.values(yerler).find((y2) => y2.g === o); if (y) yerAc(y.l);
        }
        /* üst şerit: öğrenilen sesler ve sıradaki ses */
        function ustCiz() {
          const L = IO.learned(), sira = ORDER.find((l) => !L.includes(l)), top = Object.values(deps().yildiz).reduce((a, b) => a + b, 0);
          ust.replaceChildren(h("div.ks-baslik", h("b", "Ses Kasabası"), h("span", L.length + " yer açıldı · ★ " + top)),
            sira ? h("button.ks-yeni", { onclick: () => yeniSes(sira) }, T.icon("plus"), BUYUK(sira) + sira + " sesini kasabaya getir") : h("span.ks-tamam", "Kasaba tamamlandı!"),
            h("button.ks-mini", { onclick: () => { kam.hedef = { x: 0, z: 0.5, uz: 1.1 }; panel.classList.remove("acik"); balon.classList.remove("acik"); }, title: "Bütün kasabayı göster" }, T.icon("full")));
        }
        async function yeniSes(l) {
          if (meşgul) return; meşgul = true;
          IO.setLearned(IO.learned().concat(l));
          const eski = yerler[l]; sahne.remove(eski.g);
          const y = (yerler[l] = bina(l, POZ[l])); y.bina3.scale.set(1, 0.001, 1);
          kam.hedef = { x: POZ[l].x, z: POZ[l].z + 1, uz: 0.55 };
          ustCiz(); panel.classList.remove("acik"); balon.classList.remove("acik");
          await bekle(700);
          const toz = []; for (let i = 0; i < 26; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.12 + Math.random() * 0.15, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf2e6cf, transparent: true, opacity: 0.9 })); const a = Math.random() * Math.PI * 2; p.position.set(POZ[l].x + Math.cos(a) * 1.4, 0.2, POZ[l].z + Math.sin(a) * 1.4); p.userData.v = [Math.cos(a) * 2, 1.5 + Math.random(), Math.sin(a) * 2]; sahne.add(p); toz.push(p); }
          T.sound.drum && T.sound.drum();
          await tw(900, (t) => { const e2 = 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2); y.bina3.scale.set(1, Math.max(0.001, e2), 1); toz.forEach((p) => { p.position.x += p.userData.v[0] * 0.016; p.position.y += p.userData.v[1] * 0.016; p.position.z += p.userData.v[2] * 0.016; p.userData.v[1] -= 0.05; p.material.opacity = 0.9 * (1 - t); }); });
          toz.forEach((p) => sahne.remove(p));
          T.sound.ok(); T.konfeti && T.konfeti();
          await rehberGit(POZ[l].x + 1.6, POZ[l].z + 2);
          rehber.kok.rotation.y = 0; rehber.oynat("sevin"); acikYer = l;
          const cum = `Kasabamıza ${YER[l][0].toLocaleLowerCase("tr-TR")} geldi! ${YER[l][0]} ${BUYUK(l)} sesiyle başlar.`;
          balonGoster(cum, l); T.speak(cum);
          await bekle(2600); rehber.oynat("bekle"); meşgul = false; yerAc(l);
        }
        let meşgul = false, acikYer = null;
        function balonGoster(metin, l) {
          balon.replaceChildren(...isaretle(metin, l)); balon.classList.add("acik");
        }
        const isaretle = (metin, l) => [...metin].map((ch) => (T.trLower(ch) === l ? h("span.ks-ses", ch) : document.createTextNode(ch)));
        /* bir yeri açınca: kasabalı okunabilir bir cümle söyler, ardından kelime avı */
        async function yerAc(l) {
          const y = yerler[l]; if (meşgul) return;
          if (!y || y.bos) { T.toast(BUYUK(l) + " sesini öğrenince burası açılacak."); return; }
          acikYer = l; kam.hedef = { x: POZ[l].x, z: POZ[l].z + 0.6, uz: 0.5 };
          if (Math.hypot(rehber.kok.position.x - POZ[l].x - 1.6, rehber.kok.position.z - POZ[l].z - 2) > 0.3) rehberGit(POZ[l].x + 1.6, POZ[l].z + 2).then(() => { rehber.kok.rotation.y = 0; rehber.oynat("konus"); });
          okumaTuru(l);
        }
        const L = () => IO.learned();
        const okunur = (w) => IO.okWord(w, L());
        function okumaTuru(l) {
          const cumleler = IO.SENTENCES.filter((s) => okunur(s) && T.trLower(s).includes(l));
          const kelimeler = IO.WORDS.filter((w) => okunur(w) && w.includes(l));
          const metin = cumleler.length ? T.pick(cumleler) : kelimeler.length ? T.pick(kelimeler) : BUYUK(l) + l;
          balonGoster(metin, l);
          panel.replaceChildren(
            h("div.ks-pbas", h("span.ks-harf", BUYUK(l) + l), h("div", h("b", YER[l][0]), h("small", "Kasabalı ne diyor? Balonu birlikte okuyun."))),
            h("div.ks-dugmeler",
              h("button.ot-b.dinle", { onclick: () => T.speak(metin) }, T.icon("speaker"), "Dinle"),
              h("button.ot-b.oyna", { onclick: async () => { yildizEkle(l); yildizCiz(l); ustCiz(); T.sound.ok(); rehber.oynat("sevin", { dongu: false }).then(() => rehber.oynat("bekle")); okumaTuru(l); } }, T.icon("check"), "Okuduk!"),
              h("button.ot-b.evet", { onclick: () => kelimeAvi(l) }, T.icon("eye"), "Kelime avı"),
              h("button.ks-kapat", { onclick: () => { panel.classList.remove("acik"); balon.classList.remove("acik"); kam.hedef = genel(); acikYer = null; }, "aria-label": "Kapat" }, T.icon("close"))));
          panel.classList.add("acik");
        }
        function kelimeAvi(l) {
          const icinde = T.shuffle(IO.WORDS.filter((w) => okunur(w) && w.includes(l))).slice(0, 2);
          const disinda = T.shuffle(IO.WORDS.filter((w) => okunur(w) && !w.includes(l) && w.length <= 6)).slice(0, 4 - icinde.length);
          if (!icinde.length || !disinda.length) { T.toast("Bu sesle okunacak kelime henüz az. Biraz daha ses öğrenince açılır."); return; }
          const kartlar = T.shuffle(icinde.concat(disinda)); let bulunan = 0;
          balonGoster(`İçinde ${BUYUK(l)} sesi olan kelimeleri bulur musunuz?`, "\u0000");
          T.speak(`İçinde ${l} sesi olan kelimeleri bulur musunuz?`);
          panel.replaceChildren(h("div.ks-pbas", h("span.ks-harf", BUYUK(l) + l), h("div", h("b", "Kelime avı"), h("small", "İçinde " + BUYUK(l) + l + " olan kelimelere dokunun."))),
            h("div.ks-kartlar", kartlar.map((w) => h("button.ks-kart", { onclick: (e) => {
              const b = e.currentTarget; if (b.disabled) return;
              if (w.includes(l)) { b.classList.add("iyi"); b.disabled = true; b.replaceChildren(...isaretle(w, l)); bulunan++; T.sound.pop && T.sound.pop(); if (bulunan === icinde.length) { yildizEkle(l, 2); yildizCiz(l); ustCiz(); T.sound.ok(); T.konfeti && T.konfeti(); rehber.oynat("sevin", { dongu: false }).then(() => rehber.oynat("bekle")); setTimeout(() => okumaTuru(l), 1800); } }
              else { b.classList.add("kotu"); T.sound.no(); rehber.oynat("saskin", { dongu: false }).then(() => rehber.oynat("bekle")); setTimeout(() => b.classList.remove("kotu"), 600); }
            } }, w))),
            h("div.ks-dugmeler", h("button.ot-b.dinle", { onclick: () => okumaTuru(l) }, T.icon("back"), "Geri")));
        }
        /* döngü */
        const tw = (ms, fn) => new Promise((res) => { const s0 = performance.now(); const ad = (z) => { const p = Math.min(1, (z - s0) / ms); fn(p); if (p < 1 && !c.durdu) requestAnimationFrame(ad); else res(); }; requestAnimationFrame(ad); });
        const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
        const v3 = new THREE.Vector3();
        let t0 = 0;
        c.kare = (dt) => {
          t0 += dt;
          kamGuncelle(dt);
          bulutlar.forEach((b, i) => { b.position.x += dt * (0.3 + i * 0.05); if (b.position.x > 50) b.position.x = -50; });
          Object.values(yerler).forEach((y) => { if (y.g.userData.pervane) y.g.userData.pervane.rotation.z += dt * 1.2; if (y.g.userData.bayrak) y.g.userData.bayrak.rotation.y = Math.sin(t0 * 3) * 0.25; });
          [rehber, kedi, kopek].forEach((k) => k.guncelle(dt));
          if (rehberHedef) { const p = rehber.kok.position, dx = rehberHedef.x - p.x, dz = rehberHedef.z - p.z, d = Math.hypot(dx, dz); if (d < 0.08) { rehberHedef = null; rehber.oynat("bekle"); const f = rehberCb; rehberCb = null; f && f(); } else { const hz = Math.min(d, dt * 2.6); p.x += (dx / d) * hz; p.z += (dz / d) * hz; rehber.kok.rotation.y = Math.atan2(dx, dz); } }
          gezenler.forEach((gz) => { const p = gz.k.kok.position; if (gz.bekle > 0) { gz.bekle -= dt; if (gz.bekle <= 0) gz.k.oynat("yuru"); return; } const dx = gz.hedef.x - p.x, dz = gz.hedef.z - p.z, d = Math.hypot(dx, dz); if (d < 0.1) { gz.hedef = yolNoktasi(); gz.bekle = 1.5 + Math.random() * 3; gz.k.oynat("bekle"); return; } const hz = Math.min(d, dt * gz.hiz); p.x += (dx / d) * hz; p.z += (dz / d) * hz; const hedefA = Math.atan2(dx, dz); let fa = hedefA - gz.k.kok.rotation.y; fa = Math.atan2(Math.sin(fa), Math.cos(fa)); gz.k.kok.rotation.y += fa * Math.min(1, dt * 6); });
          if (balon.classList.contains("acik")) { if (acikYer && POZ[acikYer]) v3.set(POZ[acikYer].x, (yerler[acikYer].Y || 1.3) + 1.9, POZ[acikYer].z + 0.4); else { rehber.kok.getWorldPosition(v3); v3.y += 1.55; } v3.project(kamera); const b = kap.getBoundingClientRect(); balon.style.transform = `translate(${(v3.x * 0.5 + 0.5) * b.width}px, ${(-v3.y * 0.5 + 0.5) * b.height}px) translate(-50%, -100%)`; }
        };
        gezenler.forEach((gz) => gz.k.oynat("bekle"));
        const genel = () => { const L1 = IO.learned(); const xs = L1.map((l) => POZ[l]); const cx = xs.reduce((a, p) => a + p.x, 0) / xs.length, cz = xs.reduce((a, p) => a + p.z, 0) / xs.length; return { x: T.clamp(cx, -8, 8), z: cz - 2.2 * (1 - Math.min(1, xs.length / 18)), uz: T.clamp(0.5 + xs.length * 0.03, 0.62, 1.05) }; };
        Object.assign(kam, genel()); kam.hedef = null;
        yuk.remove(); ustCiz();
        T._kasaba = { yerler, yeniSes, yerAc, rehber, kam };
      }
    },
  };
})();
