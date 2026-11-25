/* İki 3B oyun: Cetvelle ölç (en yakın santimetre) ve Kesir havuzu (eş parçalara bölünmüş havuzu doldur).
   Ortak iskelet T.oyun3B kullanılır. Tasarım özgündür. */
(function () {
  const R = (a, b) => Math.floor(a + Math.random() * (b - a + 1)), P = (l) => l[Math.floor(Math.random() * l.length)];
  const yakin = (ans, n = 4, sp = 3, min = 1) => { const o = new Set([ans]); let t = 0; while (o.size < n && t++ < 200) { const v = ans + R(-sp, sp); if (v >= min && v !== ans) o.add(v); } return T.shuffle([...o]); };
  const kayit = (id, title, icon, tone, grades, short) => { T.tools["oyun-" + id] = { cat: "oyun", title, icon, tone, grades, short, render() {} }; };
  kayit("kesir-dogru", "Kesir sayı doğrusu", "lale", "leaf", [2, 4], "Uğur böceği taştan taşa zıplar: basit ve bileşik kesirler");
  kayit("cetvel", "Cetvelle ölç", "cetvel", "sky", [1, 4], "Nesneyi cetvelle ölç, en yakın santimetreyi bul");
  kayit("havuz", "Kesirle doldur", "damla", "sea", [2, 4], "Havuz, sürahi, buz kalıbı: eş parçaları doldur, kesri oku");

  /* dar ekranda (telefon dikey) sahnenin genişliği sığsın diye kamerayı geri çeker */
  const genisSigdir = (c, yg, poz, bak) => { const K = c.kamera, v = (K.fov * Math.PI) / 360, h = Math.atan(Math.tan(v) * K.aspect), d0 = Math.hypot(poz[0] - bak[0], poz[1] - bak[1], poz[2] - bak[2]);
    const k = Math.max(1, yg / Math.tan(h) / d0); K.position.set(bak[0] + (poz[0] - bak[0]) * k, bak[1] + (poz[1] - bak[1]) * k, bak[2] + (poz[2] - bak[2]) * k); K.lookAt(bak[0], bak[1], bak[2]); };
  /* ---------- Cetvelle ölç ---------- */
  const U = 0.56, CM = 20, X0 = -(CM * U) / 2;
  function cetvelKur(c, grup) {
    const { THREE } = c, W = CM * U + 0.7, pay = 0.35;
    const doku = c.doku(4096, 300, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#F7FBFE"); g.addColorStop(1, "#DCEBF6"); x.fillStyle = g; x.fillRect(0, 0, w, h);
      const px = (mm) => ((pay + (mm / 10) * U) / W) * w;
      x.strokeStyle = "#1E3A66"; x.fillStyle = "#1E3A66";
      for (let mm = 0; mm <= CM * 10; mm++) { const uz = mm % 10 === 0 ? 0.42 : mm % 5 === 0 ? 0.3 : 0.18; x.lineWidth = mm % 10 === 0 ? 7 : 4; x.beginPath(); x.moveTo(px(mm), h); x.lineTo(px(mm), h * (1 - uz)); x.stroke(); }
      x.font = "800 92px Nunito, 'Baloo 2', system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "alphabetic";
      for (let i = 0; i <= CM; i++) x.fillText(String(i), px(i * 10), h * 0.47);
      x.textAlign = "left"; x.font = "800 70px Nunito, system-ui, sans-serif"; x.fillStyle = "#5B7699"; x.fillText("cm", 18, h * 0.24);
    });
    const mat = new THREE.MeshPhysicalMaterial({ map: doku, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 });
    const yan = new THREE.MeshPhysicalMaterial({ color: 0xcfe2f1, roughness: 0.3, clearcoat: 0.8 });
    const cv = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, 1.5), [yan, yan, mat, yan, yan, yan]);
    cv.position.set(X0 - pay + W / 2, 0.05, -1.9); c.golge(cv); grup.add(cv);
  }
  /* nesneler: uzunluk birim cinsinden, sol uçları x = 0'da, +x yönüne uzanır */
  function kalem(c, L) {
    const { THREE } = c, g = new THREE.Group(), r = 0.2, uc = Math.min(0.9, L * 0.16), lastik = 0.42, govde = L - uc - lastik;
    const sari = new THREE.MeshStandardMaterial({ color: P([0xf2c230, 0x2f7fd8, 0xe0483a, 0x3aa65a]), roughness: 0.45 });
    const g1 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, govde, 6), sari); g1.rotation.z = Math.PI / 2; g1.position.x = lastik + govde / 2; g.add(g1);
    const met = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.03, r * 1.03, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.85, roughness: 0.3 })); met.rotation.z = Math.PI / 2; met.position.x = 0.32; g.add(met);
    const las = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.98, r * 0.98, 0.24, 24), new THREE.MeshStandardMaterial({ color: 0xf29bb2, roughness: 0.8 })); las.rotation.z = Math.PI / 2; las.position.x = 0.11; g.add(las);
    const ah = new THREE.Mesh(new THREE.CylinderGeometry(0.03, r, uc, 6), new THREE.MeshStandardMaterial({ color: 0xe8c79a, roughness: 0.7 })); ah.rotation.z = -Math.PI / 2; ah.position.x = L - uc / 2; g.add(ah);
    const kur = new THREE.Mesh(new THREE.CylinderGeometry(0.0, 0.06, uc * 0.3, 12), new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4 })); kur.rotation.z = -Math.PI / 2; kur.position.x = L - uc * 0.15; g.add(kur);
    g.position.y = r; return g;
  }
  function silgi(c, L) {
    const { THREE } = c, g = new THREE.Group(), h = 0.32, d = 0.9;
    const beyaz = new THREE.Mesh(new THREE.BoxGeometry(L, h, d), new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.9 })); beyaz.position.set(L / 2, h / 2, 0); g.add(beyaz);
    const kilif = new THREE.Mesh(new THREE.BoxGeometry(L * 0.62, h + 0.03, d + 0.03), new THREE.MeshStandardMaterial({ color: P([0xe0483a, 0x2f7fd8, 0x3aa65a]), roughness: 0.6 })); kilif.position.set(L - L * 0.31, h / 2, 0); g.add(kilif);
    return g;
  }
  function pastel(c, L) {
    const { THREE } = c, g = new THREE.Group(), r = 0.2, uc = 0.45, renk = P([0x8a4fd6, 0xe0483a, 0x2ea35b, 0xf28c28, 0x1fb5b5]);
    const m = new THREE.MeshStandardMaterial({ color: renk, roughness: 0.75 });
    const gv = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L - uc, 24), m); gv.rotation.z = Math.PI / 2; gv.position.x = (L - uc) / 2; g.add(gv);
    const kag = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.04, r * 1.04, (L - uc) * 0.7, 24), new THREE.MeshStandardMaterial({ color: 0xf3ead6, roughness: 0.9 })); kag.rotation.z = Math.PI / 2; kag.position.x = (L - uc) * 0.45; g.add(kag);
    const ser = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.06, r * 1.06, 0.12, 24), m); ser.rotation.z = Math.PI / 2; ser.position.x = (L - uc) * 0.45; g.add(ser);
    const uc3 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, r, uc, 24), m); uc3.rotation.z = -Math.PI / 2; uc3.position.x = L - uc / 2; g.add(uc3);
    g.position.y = r; return g;
  }
  function makas(c, L) {
    const { THREE } = c, g = new THREE.Group(), sap = Math.min(3.0, L * 0.42), bicak = L - sap;
    const celik = new THREE.MeshStandardMaterial({ color: 0xd9dde3, metalness: 0.9, roughness: 0.22 });
    const kirmizi = new THREE.MeshPhysicalMaterial({ color: P([0xe0483a, 0x2f7fd8, 0xf28c28]), roughness: 0.35, clearcoat: 0.7 });
    [-1, 1].forEach((s) => {
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(bicak, s * 0.05); sh.lineTo(0, s * 0.34); sh.lineTo(0, 0);
      const b = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false }), celik); b.rotation.x = -Math.PI / 2; b.position.set(sap, 0.08 + (s > 0 ? 0.06 : 0), 0); g.add(b);
      const h = new THREE.Mesh(new THREE.TorusGeometry(sap * 0.38, 0.11, 14, 40), kirmizi); h.rotation.x = Math.PI / 2; h.scale.set(1.15, 0.8, 1); h.position.set(sap * 0.45, 0.12, s * sap * 0.33); g.add(h);
      const bag = new THREE.Mesh(new THREE.BoxGeometry(sap * 0.25, 0.12, 0.16), kirmizi); bag.position.set(sap * 0.88, 0.12, s * 0.12); g.add(bag);
    });
    const vida = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.26, 20), celik); vida.position.set(sap + 0.2, 0.12, 0); g.add(vida);
    return g;
  }
  const NESNE = [["kalem", kalem, 7, 17, 2.1], ["silgi", silgi, 3, 6, 1.6], ["pastel boya", pastel, 5, 9, 2.1], ["makas", makas, 9, 15, 1.15]];

  T.oyun3B("cetvel", { ortam: "masa",
    surukle(c, grup, Rr, x, y) { const sg = grup.userData.surgu; if (!sg || !sg.visible) return; const { THREE } = c, ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(x, y), c.kamera);
      const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), p)) return; sg.position.x = Math.max(X0, Math.min(X0 + CM * U, p.x)); }, seviyeler: ["0'dan başlar", "En yakın santimetre", "0'dan başlamıyor"], kamera: { poz: [0, 12.6, 0.35], bak: [0, 0, -0.45], fov: 40 },
    seviye: (g) => (g <= 1 ? 0 : g <= 3 ? 1 : 2),
    tur(L) {
      const [ad, yap, a, b, olc] = P(NESNE); const n = R(a, b);
      const kesir = L === 1 ? P([0.2, 0.3, 0.7, 0.8]) : 0, bas = L === 2 ? R(1, Math.max(1, CM - n - 1)) : 0;
      const gercek = n + kesir, cevap = Math.round(gercek), son = bas + gercek;
      const soru = L === 0 ? `Bu ${ad} kaç santimetre?` : L === 1 ? `Bu ${ad} yaklaşık kaç santimetre? En yakın santimetreye yuvarla.` : `Bu ${ad} kaç santimetre? Dikkat: 0'dan başlamıyor.`;
      const aciklama = L === 0 ? `Ucu ${cevap} çizgisinde.` : L === 1 ? `Ucu ${n} ile ${n + 1} arasında, ${kesir < 0.5 ? n : n + 1} çizgisine daha yakın.` : `Başı ${bas}, ucu ${son} çizgisinde: ${son} − ${bas} = ${cevap} santimetre.`;
      return { soru, cevap: cevap + " cm", secenekler: yakin(cevap, 4, L === 2 ? 3 : 2, 1).map((v) => v + " cm"), aciklama,
        ipucu: (L === 2 ? "Başladığı çizgiyi de hesaba kat. " : "") + "Mavi noktayı sürükle, nesnenin ucuna getir, cetvelden oku.", ikinciSans: true,
        goster(c, grup) {
          const { THREE } = c; cetvelKur(c, grup);
          const o = yap(c, gercek * U); o.position.x = X0 + bas * U; o.position.z = 0.7; o.scale.y = o.scale.z = olc; c.golge(o); o.userData.y0 = o.position.y * olc; o.userData.in = 1; grup.add(o); grup.userData.o = o;
          /* başlangıç ve bitiş kılavuz çizgileri */
          const kilavuz = (x, renk) => { const pts = []; for (let z = -1.1; z < 2.3; z += 0.14) pts.push(new THREE.Vector3(x, 0.03, z), new THREE.Vector3(x, 0.03, z + 0.07)); const l = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: renk })); grup.add(l); return l; };
          grup.userData.son = kilavuz(X0 + son * U, 0x2ea35b); grup.userData.son.visible = false;
          /* sürgü: yanlış cevaptan sonra çıkar, çocuk nesnenin ucuna sürükler */
          const surgu = new THREE.Group(); surgu.add(kilavuz(0, 0x1e3a66));
          const isaret = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), new THREE.MeshStandardMaterial({ color: 0x8fc3ff, emissive: 0x2a5fa8, emissiveIntensity: 0.45 })); isaret.position.set(0, 0.2, 2.35); surgu.add(isaret);
          const cubuk = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 3.5), new THREE.MeshBasicMaterial({ color: 0x1e3a66, transparent: true, opacity: 0.35 })); cubuk.position.set(0, 0.03, 0.6); surgu.add(cubuk);
          surgu.position.x = X0; surgu.visible = false; grup.add(surgu); grup.userData.surgu = surgu; grup.userData.isaret = isaret;
        },
        adim(c, grup, dt) { genisSigdir(c, CM * U / 2 + 0.9, [0, 12.6, 0.35], [0, 0, -0.45]); const o = grup.userData.o; if (o && o.userData.in > 0) { o.userData.in = Math.max(0, o.userData.in - dt * 2.2); o.position.y = o.userData.y0 + o.userData.in * o.userData.in * 3; }
          const is = grup.userData.isaret; if (is && grup.userData.surgu.visible) is.scale.setScalar(1 + Math.sin(c.zaman * 4) * 0.12); },
        yanlis(c, grup) { const sg = grup.userData.surgu; if (sg && !sg.visible) { sg.visible = true; sg.position.x = X0 + (bas ? bas : 0) * U - U * 1.5; } },
        dogru(c, grup) { const s = grup.userData.son; if (s) s.visible = true; },
      };
    } });

  /* ---------- Kesir sayı doğrusu: bahçe yolunda taşlar, uğur böceği zıplar ---------- */
  function ugur(c) {
    const { THREE } = c, g = new THREE.Group();
    const kab = new THREE.Mesh(new THREE.SphereGeometry(0.42, 36, 20, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xd8261c, roughness: 0.25, clearcoat: 1 })); kab.scale.set(1.1, 0.8, 1); g.add(kab);
    const nok = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.4 });
    [[0.15, 0.2], [-0.15, 0.2], [0.22, -0.12], [-0.22, -0.12], [0, -0.25]].forEach(([x, z]) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), nok); d.position.set(x, Math.sqrt(Math.max(0, 0.42 * 0.42 - x * x - z * z)) * 0.8 + 0.005, z); d.scale.y = 0.3; g.add(d); });
    const cizgi = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.84), nok); cizgi.position.y = 0.34; g.add(cizgi);
    const bas = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), nok); bas.position.set(0, 0.06, 0.42); g.add(bas);
    [-0.08, 0.08].forEach((x) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshStandardMaterial({ color: 0xffffff })); e.position.set(x, 0.14, 0.56); g.add(e); const an = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), nok); an.position.set(x * 1.5, 0.3, 0.5); an.rotation.x = 0.5; an.rotation.z = -x * 4; g.add(an); });
    g.rotation.y = Math.PI / 2; c.golge(g); return g;
  }
  T.oyun3B("kesir-dogru", { ortam: "cayir", seviyeler: ["Böcek nerede?", "Taşı bul (0-1)", "Bileşik kesir (0-2)"], kamera: { poz: [0, 5.6, 8.2], bak: [0, 0.3, 0.6], fov: 40 },
    seviye: (g) => (g <= 2 ? 0 : g <= 3 ? 1 : 2),
    tur(L) {
      const n = L === 2 ? P([2, 3, 4]) : P([2, 3, 4, 5, 6, 8]), ust = L === 2 ? 2 : 1, top = n * ust;
      let k = L === 2 ? P([...Array(top - 1)].map((_, i) => i + 1).filter((i) => i !== n && i > n - 1)) : R(1, n - 1);
      const f = k + "/" + n;
      const yanlis = new Set([f]); [k > 1 ? (k - 1) + "/" + n : null, k + 1 < top ? (k + 1) + "/" + n : null, k + "/" + (n + 1), (n - k > 0 && n - k !== k ? (n - k) + "/" + n : null), k + 2 < top ? (k + 2) + "/" + n : null, k + "/" + (n + 2)].forEach((v) => { if (v && yanlis.size < 4) yanlis.add(v); });
      while (yanlis.size < 4) { const q = R(2, 9), pp = R(1, q - 1); yanlis.add(pp + "/" + q); }
      const tam = Math.floor(k / n), kalan = k % n;
      const aciklama = L === 2 ? `Her bütün ${n} eş parça. ${f}, ${tam} bütün ve ${kalan}/${n} eder.` : `0 ile 1 arası ${n} eş parçaya bölündü. ${k} zıplamada ${f}.`;
      const X0 = -6, W = 12, adim = W / top;
      const R0 = { soru: L === 0 ? `0 ile 1 arası ${n} eş parçaya bölündü. Uğur böceği hangi kesirde?` : `${f} nerede? Doğru taşa dokun.`,
        cevap: f, secenekler: L === 0 ? T.shuffle([...yanlis]) : [], aciklama, ipucu: L === 0 ? "0'dan başlayıp böceğe kadar kaç zıplama var, say." : "Her taş bir parça. 0'dan başlayıp say.",
        goster(c, grup) {
          const { THREE } = c, u = grup.userData; u.tas = []; T._d3k = { c, grup };
          const yol = new THREE.Mesh(new THREE.BoxGeometry(W + 1.6, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: 0xcdb48a, roughness: 1 })); yol.position.set(0, 0.04, 0); yol.receiveShadow = true; grup.add(yol);
          const tasM = new THREE.MeshStandardMaterial({ color: 0xa9a49a, roughness: 0.85 }), tamM = new THREE.MeshStandardMaterial({ color: 0x6e8fb8, roughness: 0.6 });
          for (let i = 0; i <= top; i++) {
            const x = X0 + i * adim, butun = i % n === 0;
            const t = new THREE.Mesh(new THREE.CylinderGeometry(butun ? 0.48 : 0.4, butun ? 0.52 : 0.44, 0.22, 28), butun ? tamM : tasM); t.position.set(x, 0.15, 0); t.scale.z = 0.8; c.golge(t); grup.add(t);
            const v = new THREE.Mesh(new THREE.CylinderGeometry(Math.min(0.6, adim * 0.48), Math.min(0.6, adim * 0.48), 0.8, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); v.position.set(x, 0.3, 0); v.userData.i = i; grup.add(v); u.tas.push({ t, v, x });
            if (butun) { const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: c.sayiDoku(String(i / n), "#FFFFFF", "#EEF3F8", "#1B2A4A", true), transparent: true })); lab.rotation.x = -Math.PI / 2.6; lab.position.set(x, 0.32, 1.25); grup.add(lab); }
            else { const tick = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.4), new THREE.MeshBasicMaterial({ color: 0x1b2a4a })); tick.position.set(x, 0.1, 0.95); grup.add(tick); }
          }
          const cizgi = new THREE.Mesh(new THREE.BoxGeometry(W, 0.03, 0.06), new THREE.MeshBasicMaterial({ color: 0x1b2a4a })); cizgi.position.set(0, 0.1, 0.95); grup.add(cizgi);
          const b = ugur(c); grup.add(b); u.bocek = b; u.konum = L === 0 ? k : 0; u.hedef = u.konum; u.X0 = X0; u.adimW = adim; u.zip = 0;
          b.position.set(X0 + u.konum * adim, 0.27, 0);
        },
        adim(c, grup, dt) {
          genisSigdir(c, 7.2, [0, 5.6, 8.2], [0, 0.3, 0.6]); const u = grup.userData, b = u.bocek; if (!b) return;
          if (u.konum !== u.hedef) { u.zip += dt * 2.6; const yon = Math.sign(u.hedef - u.konum); if (u.zip >= 1) { u.zip = 0; u.konum += yon; T.Sahne.ses.zipla(); } const x = u.X0 + (u.konum + yon * u.zip) * u.adimW; b.position.set(x, 0.27 + Math.sin(Math.PI * u.zip) * 0.9, 0); }
          else b.position.y = 0.27 + Math.abs(Math.sin(c.zaman * 3)) * 0.04;
        },
        dogru(c, grup) { const u = grup.userData; if (L) { u.konum = 0; u.hedef = k; } else { u.konum = 0; u.hedef = k; }
          /* zıplama yayları */
          const { THREE } = c; for (let i = 0; i < k; i++) { const x0 = u.X0 + i * u.adimW, x1 = x0 + u.adimW; const yol = new THREE.QuadraticBezierCurve3(new THREE.Vector3(x0, 0.3, -0.5), new THREE.Vector3((x0 + x1) / 2, 1.3, -0.5), new THREE.Vector3(x1, 0.3, -0.5)); const m = new THREE.Mesh(new THREE.TubeGeometry(yol, 20, 0.03, 6), new THREE.MeshBasicMaterial({ color: 0xe0483a })); grup.add(m); }
          u.tas[k].t.material = new THREE.MeshStandardMaterial({ color: 0x3aa65a, roughness: 0.6 });
          const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ map: c.sayiDoku(f, "#E9F8EC", "#BFE8C8", "#1B5E2F", true), transparent: true })); lab.position.set(u.tas[k].x, 1.6, -0.2); lab.lookAt(c.kamera.position); grup.add(lab); },
      };
      return R0;
    },
    dokun(c, grup, Rr, x, y) {
      const u = grup.userData; if (!u.tas || Rr.secenekler.length) return null;
      const { THREE } = c, ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(x, y), c.kamera);
      const hit = ray.intersectObjects(u.tas.map((t) => t.v))[0]; if (!hit) return null;
      const i = hit.object.userData.i, n = +Rr.cevap.split("/")[1];
      return i + "/" + n;
    } });

  /* ---------- Kesir havuzu ---------- */
  const HW = 9.6, HD = 4.4, DER = 1.15;
  const ebob = (a, b) => (b ? ebob(b, a % b) : a);
  function havuzKur(c, grup, n) {
    const { THREE } = c;
    const tas = c.doku(512, 512, (x, w, h) => { x.fillStyle = "#EFEBE4"; x.fillRect(0, 0, w, h); for (let i = 0; i < 4000; i++) { x.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.35)" : "rgba(120,110,95,.12)"; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); } x.strokeStyle = "rgba(150,140,125,.35)"; x.lineWidth = 3; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * w / 4, 0); x.lineTo(i * w / 4, h); x.stroke(); } });
    tas.wrapS = tas.wrapT = THREE.RepeatWrapping; tas.repeat.set(4, 1);
    const fayans = c.doku(512, 512, (x, w, h) => { x.fillStyle = "#C9D3DA"; x.fillRect(0, 0, w, h); const k = w / 8; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.fillStyle = `hsl(${200 + Math.random() * 10},${12 + Math.random() * 10}%,${86 + Math.random() * 6}%)`; x.fillRect(i * k + 2, j * k + 2, k - 4, k - 4); } });
    fayans.wrapS = fayans.wrapT = THREE.RepeatWrapping; fayans.repeat.set(3, 1.4);
    const tasM = new THREE.MeshStandardMaterial({ map: tas, roughness: 0.8 }), fayM = new THREE.MeshStandardMaterial({ map: fayans, roughness: 0.35 });
    const ken = 0.6, Y0 = DER + 0.3;
    /* çevre: taş kenarlar */
    [[0, -(HD / 2 + ken / 2), HW + ken * 2, ken], [0, HD / 2 + ken / 2, HW + ken * 2, ken], [-(HW / 2 + ken / 2), 0, ken, HD], [HW / 2 + ken / 2, 0, ken, HD]].forEach(([x, z, w, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, Y0 + 0.3, d), tasM); m.position.set(x, (Y0 + 0.3) / 2, z); c.golge(m); grup.add(m); });
    /* zemin güverte */
    const gM = new THREE.MeshStandardMaterial({ map: c.tahta(), roughness: 0.7 });
    const guverte = new THREE.Mesh(new THREE.BoxGeometry(HW + 5, 0.16, HD + 3.4), gM); guverte.position.set(0, 0.08, 0); guverte.receiveShadow = true; grup.add(guverte);
    const govde = new THREE.Mesh(new THREE.BoxGeometry(HW, Y0 - DER - 0.05, HD), tasM); govde.position.set(0, (Y0 - DER - 0.05) / 2, 0); grup.add(govde);
    /* havuz içi: taban ve iç duvarlar */
    const taban = new THREE.Mesh(new THREE.BoxGeometry(HW, 0.1, HD), fayM); taban.position.set(0, Y0 - DER, 0); taban.receiveShadow = true; grup.add(taban);
    [[0, -HD / 2, HW, 0.06], [0, HD / 2, HW, 0.06], [-HW / 2, 0, 0.06, HD], [HW / 2, 0, 0.06, HD]].forEach(([x, z, w, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, DER, d), fayM); m.position.set(x, Y0 - DER / 2, z); m.receiveShadow = true; grup.add(m); });
    /* bölme duvarları */
    const bw = HW / n, bolme = [];
    for (let i = 1; i < n; i++) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.12, DER + 0.04, HD), tasM); d.position.set(-HW / 2 + i * bw, Y0 - DER / 2 + 0.02, 0); c.golge(d); grup.add(d); }
    const suM = () => new THREE.MeshPhysicalMaterial({ color: 0x1590d8, transmission: 0.25, roughness: 0.04, thickness: 1.2, ior: 1.33, transparent: true, opacity: 0.9, clearcoat: 1 });
    for (let i = 0; i < n; i++) {
      const x = -HW / 2 + bw * (i + 0.5);
      const su = new THREE.Mesh(new THREE.BoxGeometry(bw - 0.14, 1, HD - 0.1), suM()); su.position.set(x, Y0 - DER, 0); su.scale.y = 0.001; su.visible = false; grup.add(su);
      const vur = new THREE.Mesh(new THREE.BoxGeometry(bw, DER, HD), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); vur.position.set(x, Y0 - DER / 2, 0); vur.userData.i = i; grup.add(vur);
      bolme.push({ su, vur, dolu: false, h: 0 });
    }
    /* merdiven */
    const krom = new THREE.MeshStandardMaterial({ color: 0xdfe4ea, metalness: 0.95, roughness: 0.15 });
    [-0.35, 0.35].forEach((dz) => { const b = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 10, 24, Math.PI), krom); b.position.set(HW / 2 - 0.1, Y0 + 0.2, HD / 2 - 1 + dz); b.rotation.y = Math.PI / 2; grup.add(b); });
    grup.userData.bolme = bolme; grup.userData.Y0 = Y0;
    return bolme;
  }
  /* sürahi: alttan yukarı eş düzeyler; bir düzeye dokununca su o düzeye kadar dolar */
  function surahiKur(c, grup, n) {
    const { THREE } = c, H = 4.6, Rr = 1.35, Y = 0.95;
    c.kamera.position.set(0, 5.6, 13.6); c.kamera.lookAt(0, 3.5, 0); grup.userData.kam = [3.6, [0, 5.6, 13.6], [0, 3.5, 0]];
    const masa = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.3, 48), new THREE.MeshStandardMaterial({ map: c.tahta(), roughness: 0.6 })); masa.position.y = 0.65; c.golge(masa); grup.add(masa);
    const ayak = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 0.6, 20), new THREE.MeshStandardMaterial({ color: 0x6b4a2b })); ayak.position.y = 0.3; grup.add(ayak);
    const cam = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.92, roughness: 0.04, thickness: 0.2, ior: 1.5, transparent: true, opacity: 0.35, side: THREE.DoubleSide, clearcoat: 1 });
    const gv = new THREE.Mesh(new THREE.CylinderGeometry(Rr * 1.05, Rr, H, 48, 1, true), cam); gv.position.y = Y + H / 2; grup.add(gv);
    const dip = new THREE.Mesh(new THREE.CylinderGeometry(Rr, Rr, 0.12, 48), cam); dip.position.y = Y + 0.06; grup.add(dip);
    const kulp = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.12, 14, 32, Math.PI), cam); kulp.position.set(Rr + 0.2, Y + H * 0.55, 0); kulp.rotation.z = -Math.PI / 2; grup.add(kulp);
    const agiz = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.5, 3, 1, true), cam); agiz.position.set(-Rr - 0.15, Y + H - 0.05, 0); agiz.rotation.z = Math.PI / 2; grup.add(agiz);
    const cizM = new THREE.MeshBasicMaterial({ color: 0x1e3a66 }), dh = (H - 0.3) / n, bolme = [];
    for (let i = 1; i < n; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(Rr * 1.01 + (i * dh / H) * Rr * 0.05, 0.025, 6, 60, Math.PI * 0.9), cizM); t.rotation.x = Math.PI / 2; t.rotation.z = Math.PI * 0.05; t.position.y = Y + 0.15 + i * dh; grup.add(t); }
    const suyu = new THREE.Mesh(new THREE.CylinderGeometry(Rr * 0.96, Rr * 0.95, 1, 48), new THREE.MeshPhysicalMaterial({ color: P([0xf59a23, 0x3cb8e8, 0xe0483a]), transmission: 0.35, roughness: 0.15, transparent: true, opacity: 0.85 }));
    suyu.position.y = Y + 0.15; suyu.scale.y = 0.001; grup.add(suyu);
    for (let i = 0; i < n; i++) { const v = new THREE.Mesh(new THREE.CylinderGeometry(Rr * 1.3, Rr * 1.3, dh, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); v.position.y = Y + 0.15 + (i + 0.5) * dh; v.userData.i = i; grup.add(v); bolme.push({ vur: v, dolu: false }); }
    grup.userData.dikey = true; grup.userData.adim = (cc, dt) => { const k = bolme.filter((b) => b.dolu).length, hd = Math.max(0.001, k * dh); suyu.scale.y += (hd - suyu.scale.y) * Math.min(1, dt * 4); suyu.position.y = Y + 0.15 + suyu.scale.y / 2; suyu.visible = suyu.scale.y > 0.01; };
    return bolme;
  }
  /* buz kalıbı: gözlere tek tek su konur */
  function kalipKur(c, grup, n) {
    const { THREE } = c, sira = n > 5 ? 2 : 1, sut = Math.ceil(n / sira), G = 1.25, Y = 0.95;
    c.kamera.position.set(0, 8.6, 6.4); c.kamera.lookAt(0, 0.8, 0.3); grup.userData.kam = [4.5, [0, 8.6, 6.4], [0, 0.8, 0.3]];
    const masa = new THREE.Mesh(new THREE.BoxGeometry(sut * G + 4, 0.3, sira * G + 3), new THREE.MeshStandardMaterial({ map: c.tahta(), roughness: 0.6 })); masa.position.y = 0.65; c.golge(masa); grup.add(masa);
    const pM = new THREE.MeshPhysicalMaterial({ color: P([0x7fd0ee, 0xf7a6c4, 0xa7e3a1]), roughness: 0.3, clearcoat: 0.6, transmission: 0.2 });
    const tab = new THREE.Mesh(new THREE.BoxGeometry(sut * G + 0.3, 0.12, sira * G + 0.3), pM); tab.position.y = Y + 0.06; c.golge(tab); grup.add(tab);
    for (let i = 0; i <= sut; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, sira * G + 0.3), pM); w.position.set(-sut * G / 2 + i * G, Y + 0.33, 0); grup.add(w); }
    for (let j = 0; j <= sira; j++) { const w = new THREE.Mesh(new THREE.BoxGeometry(sut * G + 0.3, 0.55, 0.1), pM); w.position.set(0, Y + 0.33, -sira * G / 2 + j * G); grup.add(w); }
    const bolme = [];
    for (let k = 0; k < sut * sira; k++) {
      const x = -sut * G / 2 + (k % sut + 0.5) * G, z = -sira * G / 2 + (Math.floor(k / sut) + 0.5) * G;
      if (k >= n) { const kapak = new THREE.Mesh(new THREE.BoxGeometry(G - 0.1, 0.5, G - 0.1), pM); kapak.position.set(x, Y + 0.33, z); grup.add(kapak); continue; }
      const su = new THREE.Mesh(new THREE.BoxGeometry(G - 0.16, 1, G - 0.16), new THREE.MeshPhysicalMaterial({ color: 0x38b6e6, transmission: 0.5, roughness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 })); su.position.set(x, Y + 0.12, z); su.scale.y = 0.001; grup.add(su);
      const v = new THREE.Mesh(new THREE.BoxGeometry(G, 0.6, G), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); v.position.set(x, Y + 0.33, z); v.userData.i = bolme.length; grup.add(v);
      bolme.push({ su, vur: v, dolu: false, h: 0, y0: Y + 0.12, max: 0.42 });
    }
    return bolme;
  }
  /* kesrin okunuşu: "beşte ikisini", "beşte ikisi" */
  const PAYDA = ["", "birde", "ikide", "üçte", "dörtte", "beşte", "altıda", "yedide", "sekizde", "dokuzda", "onda", "on birde", "on ikide"];
  const PAY_I = ["", "biri", "ikisi", "üçü", "dördü", "beşi", "altısı", "yedisi", "sekizi", "dokuzu", "onu"];
  const PAY_NI = ["", "birini", "ikisini", "üçünü", "dördünü", "beşini", "altısını", "yedisini", "sekizini", "dokuzunu", "onunu"];
  const oku = (f, hal) => { const [a, b] = f.split("/").map(Number); return PAYDA[b] + " " + (hal === "ni" ? PAY_NI : PAY_I)[a] + " (" + f + ")"; };
  /* boya karışımı: kavanoza parça parça boya dökülür, sonra karışır */
  const RENK = { kırmızı: 0xe0483a, mavi: 0x2f6fd8, sarı: 0xf6c431 };
  const KARISIM = { "kırmızı+mavi": [0x7b3fb0, "mor"], "kırmızı+sarı": [0xf08a24, "turuncu"], "mavi+sarı": [0x3aa65a, "yeşil"] };
  const karisimOf = (a, b) => KARISIM[[a, b].sort((x, y) => Object.keys(RENK).indexOf(x) - Object.keys(RENK).indexOf(y)).join("+")];
  function boyaKur(c, grup, n) {
    const { THREE } = c, H = 4.2, Rr = 1.25, Y = 0.95;
    c.kamera.position.set(0, 5.8, 13.8); c.kamera.lookAt(0, 3.1, 0); grup.userData.kam = [5.8, [0, 5.8, 13.8], [0, 3.1, 0]];
    const masa = new THREE.Mesh(new THREE.BoxGeometry(11, 0.3, 4.6), new THREE.MeshStandardMaterial({ map: c.tahta(), roughness: 0.6 })); masa.position.y = 0.65; c.golge(masa); grup.add(masa);
    [-4.8, 4.8].forEach((x) => [-1.8, 1.8].forEach((z) => { const a = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.3), new THREE.MeshStandardMaterial({ color: 0x6b4a2b })); a.position.set(x, 0.3, z); grup.add(a); }));
    const cam = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.92, roughness: 0.04, thickness: 0.2, ior: 1.5, transparent: true, opacity: 0.3, side: THREE.DoubleSide, clearcoat: 1 });
    const gv = new THREE.Mesh(new THREE.CylinderGeometry(Rr, Rr, H, 48, 1, true), cam); gv.position.y = Y + H / 2; grup.add(gv);
    const boyun = new THREE.Mesh(new THREE.TorusGeometry(Rr * 0.98, 0.09, 10, 48), cam); boyun.rotation.x = Math.PI / 2; boyun.position.y = Y + H; grup.add(boyun);
    const dip = new THREE.Mesh(new THREE.CylinderGeometry(Rr, Rr, 0.12, 48), cam); dip.position.y = Y + 0.06; grup.add(dip);
    const dh = (H - 0.3) / n, cizM = new THREE.MeshBasicMaterial({ color: 0x1e3a66 }), dilim = [], bolme = [];
    for (let i = 1; i < n; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(Rr * 1.01, 0.022, 6, 60, Math.PI * 0.9), cizM); t.rotation.x = Math.PI / 2; t.rotation.z = Math.PI * 0.05; t.position.y = Y + 0.15 + i * dh; grup.add(t); }
    for (let i = 0; i < n; i++) {
      const d = new THREE.Mesh(new THREE.CylinderGeometry(Rr * 0.95, Rr * 0.95, dh, 48), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })); d.position.y = Y + 0.15 + (i + 0.5) * dh; d.visible = false; d.scale.y = 0.01; grup.add(d); dilim.push(d);
      const v = new THREE.Mesh(new THREE.CylinderGeometry(Rr * 1.25, Rr * 1.25, dh, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); v.position.y = d.position.y; v.userData.i = i; grup.add(v); bolme.push({ vur: v });
    }
    /* boya kutuları */
    const kutular = Object.entries(RENK).map(([ad, renk], k) => {
      const g = new THREE.Group(), x = [-4.0, 3.3, -2.25][k], z = [0.3, 0.4, 0.9][k];
      const govde = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.1, 40), new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.8, roughness: 0.35 })); govde.position.y = 0.55; g.add(govde);
      const etiket = new THREE.Mesh(new THREE.CylinderGeometry(0.765, 0.765, 0.6, 40, 1, true), new THREE.MeshStandardMaterial({ color: renk, roughness: 0.6 })); etiket.position.y = 0.55; g.add(etiket);
      const yuz = new THREE.Mesh(new THREE.CircleGeometry(0.68, 40), new THREE.MeshStandardMaterial({ color: renk, roughness: 0.25 })); yuz.rotation.x = -Math.PI / 2; yuz.position.y = 1.11; g.add(yuz);
      const sap = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.03, 8, 30, Math.PI), new THREE.MeshStandardMaterial({ color: 0x888c94, metalness: 0.9 })); sap.position.y = 1.1; g.add(sap);
      const vur = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.8, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); vur.position.y = 0.7; vur.userData.renk = ad; g.add(vur);
      g.position.set(x, 0.8, z); c.golge(g); grup.add(g); g.userData.renk = ad; g.userData.vur = vur; return g;
    });
    const u = grup.userData; u.boya = true; u.katman = []; u.dilim = dilim; u.kutular = kutular; u.secili = null; u.karis = -1; u.n = n;
    u.adim = (cc, dt) => {
      dilim.forEach((d, i) => { const r = u.katman[i]; if (r) { d.visible = true; d.scale.y = Math.min(1, d.scale.y + dt * 5); if (u.karis < 0) d.material.color.setHex(RENK[r]); } else { d.visible = false; d.scale.y = 0.01; } });
      if (u.karis >= 0 && u.karis < 1) { u.karis = Math.min(1, u.karis + dt * 0.8); const hedef = new THREE.Color(u.karisRenk), e = u.karis * u.karis * (3 - 2 * u.karis); dilim.forEach((d, i) => { if (!d.visible) return; if (!d.userData.c0) d.userData.c0 = new THREE.Color(RENK[u.katman[i]]); d.material.color.copy(d.userData.c0).lerp(hedef, e); }); }
      kutular.forEach((g) => { const s = g.userData.renk === u.secili; g.position.y = 0.8 + (s ? 0.25 + Math.sin(cc.zaman * 5) * 0.06 : 0); });
    };
    return bolme;
  }
  const iyelik = (f) => { const pay = +f.split("/")[0]; return { 1: "i", 2: "si", 3: "ü", 4: "ü", 5: "i", 6: "sı", 7: "si", 8: "i", 9: "u" }[pay] || "i"; };
  const sade = (a, b) => { const g = ebob(a, b); return a / g + "/" + b / g; };
  function boyaTur(L) {
    const renkler = T.shuffle(Object.keys(RENK)).slice(0, 2), n = L === 2 ? P([4, 8]) : P([3, 4, 5, 6]);
    let a = R(1, n - 1), b = R(1, n - a); if (L === 2) { a = n / 2; b = P([n / 4, n / 2]); if (a + b > n) b = n / 4; }
    const [r1, r2] = renkler, [kr, kad] = karisimOf(r1, r2), sonra = (u) => { u.karisRenk = kr; };
    const ortak = { goster(c, grup) { T._d3 = { c, grup }; const B = boyaKur(c, grup, n); grup.userData.bolme = B; }, adim: suAdim };
    if (L === 0) {
      const k = a, yanlis = new Set([k + "/" + n]); [b + "/" + n, k + "/" + (n + 1), a + b + "/" + n, (n - k) + "/" + n, k > 1 ? (k - 1) + "/" + n : null].forEach((v) => { if (v && yanlis.size < 4 && v !== k + "/" + n) yanlis.add(v); });
      while (yanlis.size < 4) yanlis.add(R(1, n) + "/" + (n + R(1, 3)));
      return Object.assign({}, ortak, { soru: `Kavanoz ${n} eş parçaya bölündü. Kavanozun kaçta kaçı ${r1} boya?`, cevap: k + "/" + n, secenekler: T.shuffle([...yanlis]),
        aciklama: `${n} parçanın ${k} tanesi ${r1}. Karıştırınca ${kad} oldu.`, ipucu: `Yalnızca ${r1} parçaları say.`,
        goster(c, grup) { ortak.goster(c, grup); const u = grup.userData; u.katman = Array(a).fill(r1).concat(Array(b).fill(r2)); },
        dogru(c, grup) { const u = grup.userData; sonra(u); u.karis = 0; } });
    }
    const f1 = L === 2 ? sade(a, n) : a + "/" + n, f2 = L === 2 ? sade(b, n) : b + "/" + n;
    return Object.assign({}, ortak, { soru: `Kavanozun ${oku(f1)} ${r1}, ${oku(f2)} ${r2} boya olsun. Önce boya kutusuna, sonra kavanoza dokun.`, cevap: "__", cevapYazi: "ekranda", secenekler: ["Tamam"],
      aciklama: (L === 2 ? `${f1} = ${a}/${n}` + (f2 !== f1 ? `, ${f2} = ${b}/${n}` : "") + ". " : "") + `${r1[0].toLocaleUpperCase("tr") + r1.slice(1)} ve ${r2} karışınca ${kad} oldu.`,
      ipucu: L === 2 ? `Kavanoz ${n} parça. ${f1} kaç parça eder?` : "Her renkten kaç parça döktüğünü say.",
      _boya: { [r1]: a, [r2]: b },
      dogru(c, grup, goster) { const u = grup.userData; if (goster) u.katman = Array(a).fill(r1).concat(Array(b).fill(r2)); sonra(u); u.karis = 0; } });
  }
  const KAP = [
    { ad: "havuz", tam: "Havuzun", kur: (c, grup, n) => { c.kamera.position.set(0, 9.4, 8.6); c.kamera.lookAt(0, 0.4, 0.3); grup.userData.kam = [7.0, [0, 9.4, 8.6], [0, 0.4, 0.3]]; return havuzKur(c, grup, n); }, nler: [2, 3, 4, 5, 6, 8] },
    { ad: "sürahi", tam: "Sürahinin", kur: surahiKur, nler: [2, 3, 4, 5, 6] },
    { ad: "buz kalıbı", tam: "Buz kalıbının", kur: kalipKur, nler: [2, 3, 4, 5, 6, 8, 10] },
    { ad: "boya", boya: true },
  ];
  let kapSira = [];
  const kapSec = () => { if (!kapSira.length) kapSira = T.shuffle(KAP.slice()); return kapSira.pop(); };
  T.oyun3B("havuz", { ortam: "cayir", seviyeler: ["Kaçta kaçı dolu?", "Kesir kadar doldur", "Denk kesir"], kamera: { poz: [0, 8.2, 8.4], bak: [0, -0.6, 0.2], fov: 42 },
    seviye: (g) => (g <= 2 ? 0 : g <= 3 ? 1 : 2),
    tur(L) {
      const kap = kapSec(); if (kap.boya) return boyaTur(L); let n, k, hp, hk;
      if (L === 2) { const ad = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]].flatMap(([p2, q]) => [2, 3, 4].filter((m) => kap.nler.includes(q * m)).map((m) => [p2, q, m])); const [p2, q, m] = P(ad); hp = p2; hk = q; n = q * m; k = p2 * m; }
      else { n = P(kap.nler); k = R(1, n - 1); }
      const kesir = (a, b) => a + "/" + b, Ad = kap.ad[0].toLocaleUpperCase("tr") + kap.ad.slice(1);
      const kurBas = (c, grup) => { T._d3 = { c, grup }; const B = kap.kur(c, grup, n); grup.userData.bolme = B; grup.userData.kap = kap; return B; };
      if (L === 0) {
        const yanlis = new Set([kesir(k, n)]); [kesir(n - k, n), kesir(k, n + 1), k > 1 ? kesir(k - 1, n) : null, k + 1 < n ? kesir(k + 1, n) : null, n - 1 > k ? kesir(k, n - 1) : null, kesir(k, n + 2), kesir(k + 1, n + 1)].forEach((v) => { if (v && yanlis.size < 4) yanlis.add(v); });
        return { soru: `${Ad} ${n} eş parçaya bölündü. ${kap.tam} kaçta kaçı dolu?`, cevap: kesir(k, n), secenekler: T.shuffle([...yanlis]), aciklama: `${n} eş parçanın ${k} tanesi dolu: ${k}/${n}.`, ipucu: "Önce bütün parçaları say, sonra dolu olanları.",
          goster(c, grup) { kurBas(c, grup).forEach((b, i) => { b.dolu = i < k; }); }, adim: suAdim };
      }
      const hedef = L === 2 ? kesir(hp, hk) : kesir(k, n);
      return { soru: `${kap.tam} ${oku(hedef, "ni")} doldur. Parçalara dokun, sonra Tamam'a bas.`, cevap: "__", cevapYazi: "ekranda", secenekler: ["Tamam"], tebrik: "Doğru! ",
        aciklama: L === 2 ? `${hedef} = ${k}/${n}. ${n} eş parçanın ${k} tanesi doldu.` : `${n} eş parçanın ${k} tanesi doldu.`,
        ipucu: L === 2 ? `Parçalar ${n} tane. ${hedef} kaç parça eder?` : "Kaç parça dolu, say.",
        goster(c, grup) { kurBas(c, grup); }, adim: suAdim,
        dogru(c, grup, goster) { if (goster) grup.userData.bolme.forEach((b, i) => { b.dolu = i < k; }); }, _k: k };
    },
    dokun(c, grup, Rr, x, y) {
      const B = grup.userData.bolme; if (!B || Rr.secenekler[0] !== "Tamam") return null;
      const { THREE } = c, ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(x, y), c.kamera);
      const u = grup.userData;
      if (u.boya) {
        const kutu = ray.intersectObjects(u.kutular.map((g) => g.userData.vur))[0];
        if (kutu) { u.secili = kutu.object.userData.renk; T.Sahne.ses.tik(); return null; }
        const kv = ray.intersectObjects(B.map((b) => b.vur))[0]; if (!kv) return null;
        const i = kv.object.userData.i, say = u.katman.length;
        if (i < say) u.katman.pop(); /* boyalı kısma dokunmak en üstteki parçayı geri alır, boş kısma dokunmak boya döker */
        else if (!u.secili) { T.toast && T.toast("Önce bir boya kutusuna dokun."); return null; }
        else if (say < u.n) u.katman.push(u.secili);
        T.Sahne.ses.pop();
        const hedef = Rr._boya, sayim = {}; u.katman.forEach((r) => (sayim[r] = (sayim[r] || 0) + 1));
        const tamam = Object.keys(RENK).every((r) => (sayim[r] || 0) === (hedef[r] || 0));
        Rr.cevap = tamam ? "Tamam" : "__"; Rr._elendi = []; document.querySelectorAll(".d3-sec[disabled]").forEach((d) => d.removeAttribute("disabled"));
        return null;
      }
      const hit = ray.intersectObjects(B.map((b) => b.vur))[0]; if (!hit) return null;
      const i = hit.object.userData.i;
      if (grup.userData.dikey) { const k = B.filter((b) => b.dolu).length, yeni = k === i + 1 ? i : i + 1; B.forEach((b, j) => { b.dolu = j < yeni; }); }
      else B[i].dolu = !B[i].dolu;
      T.Sahne && T.Sahne.ses && T.Sahne.ses.pop && T.Sahne.ses.pop();
      Rr.cevap = B.filter((b) => b.dolu).length === Rr._k ? "Tamam" : "__"; Rr._elendi = [];
      document.querySelectorAll(".d3-sec[disabled]").forEach((d) => d.removeAttribute("disabled"));
      return null;
    } });
  /* "beşte üçünü": ek, payın okunuşuna göre gelir */
  function ek(f) { const pay = +f.split("/")[0]; return { 1: "ini", 2: "sini", 3: "ünü", 4: "ünü", 5: "ini", 6: "sını", 7: "sini", 8: "ini", 9: "unu" }[pay] || "ini"; }
  function suAdim(c, grup, dt) {
    const km = grup.userData.kam; if (km) genisSigdir(c, km[0], km[1], km[2]);
    if (grup.userData.adim) return grup.userData.adim(c, dt);
    const B = grup.userData.bolme; if (!B) return; const Y0 = grup.userData.Y0, max = DER - 0.18;
    B.forEach((b, i) => { const m = b.max != null ? b.max : max, y0 = b.y0 != null ? b.y0 : Y0 - DER + 0.05; const hd = b.dolu ? m : 0; b.h += (hd - b.h) * Math.min(1, dt * 4); b.su.visible = b.h > 0.01; b.su.scale.y = Math.max(0.001, b.h); b.su.position.y = y0 + b.h / 2 + Math.sin(c.zaman * 2 + i) * 0.01; });
  }
})();
