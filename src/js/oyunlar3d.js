/* 3B oyunlar (ortak iskelet T.oyun3B ile). */
(function () {
  const R = (a, b) => Math.floor(a + Math.random() * (b - a + 1)), P = (l) => l[Math.floor(Math.random() * l.length)];
  /* üleştirme eki: 2'şer, 3'er, 6'şar, 9'ar, 10'ar */
  const er = (k) => { const BIR = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"], ON = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"]; const w = k % 10 ? BIR[k % 10] : k % 100 ? ON[(k % 100) / 10] : "yüz"; const sesli = [...w].filter((ch) => "aeıioöuü".includes(ch)).pop(), kalin = "aıou".includes(sesli), unlu = "aeıioöuü".includes(w[w.length - 1]); return k + "'" + (unlu ? "ş" : "") + (kalin ? "ar" : "er"); };
  const yakin = (ans, n = 4, sp = 3, min = 0) => { const o = new Set([ans]); let t = 0; while (o.size < n && t++ < 200) { const v = ans + R(-sp, sp); if (v >= min && v !== ans) o.add(v); } return T.shuffle([...o]); };

  /* ---------- Ortak 3B parçalar ---------- */
  const PARCA = {};
  PARCA.cerceve = (c, grup, n, x0, z0, renk1 = 0xd8342a, n2 = 0, renk2 = 0x2a6fd8, buz = false) => {
    const { THREE } = c, tm = new THREE.MeshStandardMaterial({ map: c.tahta(), roughness: 0.6 }), cw = 1.05;
    const kasa = new THREE.Mesh(new THREE.BoxGeometry(cw * 5 + 0.3, 0.3, cw * 2 + 0.3), tm); kasa.position.set(x0, 0.15, z0); c.golge(kasa); grup.add(kasa);
    const bm = new THREE.MeshStandardMaterial({ color: 0x5a3a1e, roughness: 0.8 });
    for (let i = 0; i < 10; i++) { const x = x0 + ((i % 5) - 2) * cw, z = z0 + (Math.floor(i / 5) - 0.5) * cw;
      const cuk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 32), bm); cuk.position.set(x, 0.31, z); grup.add(cuk);
      if (i < n + n2) { const mat = buz ? new THREE.MeshPhysicalMaterial({ color: i < n ? 0x9fd6ff : 0x5fb0f0, transmission: 0.35, roughness: 0.12, thickness: 0.6, ior: 1.31, clearcoat: 1 }) : new THREE.MeshPhysicalMaterial({ color: i < n ? renk1 : renk2, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 });
        const top = new THREE.Mesh(buz ? new THREE.BoxGeometry(0.66, 0.66, 0.66) : new THREE.SphereGeometry(0.38, 32, 24), mat); top.position.set(x, buz ? 0.66 : 0.7, z); if (buz) top.rotation.y = Math.random() * 0.4; c.golge(top); top.userData.dus = 3 + Math.random(); top.userData.y0 = top.position.y; top.position.y += top.userData.dus; grup.add(top); } }
  };
  PARCA.dusur = (grup, dt) => grup.traverse((o) => { if (o.userData && o.userData.dus > 0) { o.userData.dus = Math.max(0, o.userData.dus - dt * 9); o.position.y = o.userData.y0 + o.userData.dus * o.userData.dus * 0.25; } });
  PARCA.elma = (c) => { const { THREE } = c, g = new THREE.Group();
    const k = new THREE.Mesh(new THREE.SphereGeometry(0.5, 40, 28), new THREE.MeshPhysicalMaterial({ color: 0xc8201c, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 })); k.scale.set(1, 0.92, 1); g.add(k);
    const sap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x5a3a1a })); sap.position.y = 0.55; sap.rotation.z = 0.2; g.add(sap);
    const yp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 8), new THREE.MeshStandardMaterial({ color: 0x3f9a3a, roughness: 0.6 })); yp.scale.set(1.6, 0.25, 0.7); yp.position.set(0.16, 0.6, 0); yp.rotation.z = -0.4; g.add(yp); return c.golge(g); };
  PARCA.disk = (c, metin, renk, kesik) => { const { THREE } = c, g = new THREE.Group();
    const d = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.35, 64), new THREE.MeshStandardMaterial({ color: renk, roughness: 0.45, metalness: 0.1 })); d.rotation.x = Math.PI / 2; g.add(d);
    const yuz = new THREE.Mesh(new THREE.CircleGeometry(0.98, 64), new THREE.MeshStandardMaterial({ map: c.sayiDoku(metin, "#FFFFFF", kesik ? "#E5E9F0" : "#EEF3F8", "#1B2A4A", true), roughness: 0.4 })); yuz.position.z = 0.181; g.add(yuz); g.userData.yuz = yuz; return c.golge(g); };
  PARCA.blok = (c, grup, n, x0 = -6) => { const { THREE } = c, U = 0.34;
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x7fc6f2, roughness: 0.35, clearcoat: 0.6 }), cizgi = new THREE.LineBasicMaterial({ color: 0x2b6a99 });
    const kup = (x, y, z, sx, sy, sz) => { const geo = new THREE.BoxGeometry(sx * U, sy * U, sz * U); const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); c.golge(m); grup.add(m);
      const kenar = new THREE.LineSegments(new THREE.EdgesGeometry(geo), cizgi); m.add(kenar);
      /* birim çizgileri */
      const pts = []; for (let i = 1; i < sx; i++) { const xx = -sx * U / 2 + i * U; pts.push(xx, sy * U / 2 + 0.002, -sz * U / 2, xx, sy * U / 2 + 0.002, sz * U / 2); } for (let j = 1; j < sz; j++) { const zz = -sz * U / 2 + j * U; pts.push(-sx * U / 2, sy * U / 2 + 0.002, zz, sx * U / 2, sy * U / 2 + 0.002, zz); }
      if (pts.length) { const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); m.add(new THREE.LineSegments(lg, cizgi)); }
      m.userData.dus = 2 + Math.random(); m.userData.y0 = y; m.position.y += m.userData.dus; };
    const Y = Math.floor(n / 100), O = Math.floor((n % 100) / 10), B = n % 10; let x = x0;
    for (let i = 0; i < Y; i++) { kup(x + 5 * U, U / 2, 0, 10, 1, 10); x += 10 * U + 0.4; }
    for (let i = 0; i < O; i++) { kup(x + U / 2, U / 2, 0, 1, 1, 10); x += U + 0.22; }
    x += 0.3; for (let i = 0; i < B; i++) kup(x + Math.floor(i / 5) * (U + 0.18), U / 2, -1.2 + (i % 5) * (U + 0.18), 1, 1, 1);
  };
  PARCA.saat = (c, grup) => { const { THREE } = c, g = new THREE.Group();
    const cerceve = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.28, 24, 96), new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.45, map: c.tahta() })); g.add(cerceve);
    const yuz = new THREE.Mesh(new THREE.CircleGeometry(2.55, 96), new THREE.MeshStandardMaterial({ roughness: 0.6, map: c.doku(1024, 1024, (x, w, h) => { x.fillStyle = "#FBF8F1"; x.fillRect(0, 0, w, h); x.translate(w / 2, h / 2); for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30; x.strokeStyle = "#222"; x.lineWidth = i % 5 ? 4 : 12; x.beginPath(); x.moveTo(Math.sin(a) * (i % 5 ? 470 : 440), -Math.cos(a) * (i % 5 ? 470 : 440)); x.lineTo(Math.sin(a) * 500, -Math.cos(a) * 500); x.stroke(); } x.font = "800 110px Georgia, serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#1B2A4A"; for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6; x.fillText(String(i), Math.sin(a) * 365, -Math.cos(a) * 365 + 6); } }) }));
    yuz.position.z = 0.02; g.add(yuz);
    const akrep = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.35, 0.06), new THREE.MeshStandardMaterial({ color: 0xc0392b, metalness: 0.3, roughness: 0.4 })); akrep.geometry.translate(0, 0.6, 0); akrep.position.z = 0.1;
    const yelkovan = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.0, 0.05), new THREE.MeshStandardMaterial({ color: 0x1f4f8a, metalness: 0.3, roughness: 0.4 })); yelkovan.geometry.translate(0, 0.9, 0); yelkovan.position.z = 0.16;
    const pim = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 24), new THREE.MeshStandardMaterial({ color: 0xc9a24a, metalness: 1, roughness: 0.3 })); pim.rotation.x = Math.PI / 2; pim.position.z = 0.22;
    const cam = new THREE.Mesh(new THREE.CircleGeometry(2.55, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, roughness: 0.05, thickness: 0.1, transparent: true, opacity: 0.25 })); cam.position.z = 0.3;
    g.add(akrep, yelkovan, pim, cam); c.golge(g); grup.add(g); return { g, akrep, yelkovan };
  };

  /* ---------- Eşini bul ---------- */
  T.oyun3B("esini-bul", { ortam: "masa", seviyeler: ["5'e kadar", "10'a kadar", "20'ye kadar"], kamera: { poz: [0, 9, 9], bak: [0, 0.5, 0.5], fov: 38 },
    tur(L, c) { const max = [5, 10, 20][L], n = R(1, max), tur = P(n > 10 ? ["cerceve", "elma"] : ["cerceve", "elma"]);
      return { soru: "Masada kaç tane var?", cevap: n, secenekler: yakin(n, 4, 3, 0), aciklama: "Beşerli gruplara bakmak saymayı hızlandırır.",
        goster(c, grup) { if (tur === "cerceve") { PARCA.cerceve(c, grup, Math.min(n, 10), n > 10 ? -3.3 : 0, 0); if (n > 10) PARCA.cerceve(c, grup, n - 10, 3.3, 0); }
          else for (let i = 0; i < n; i++) { const e = PARCA.elma(c); const sx = (i % 5) - 2, sz = Math.floor(i / 5) - (Math.ceil(n / 5) - 1) / 2; e.position.set(sx * 1.35 + (Math.random() - 0.5) * 0.3, 0.46, sz * 1.3 + (Math.random() - 0.5) * 0.2); e.rotation.y = Math.random() * 6; e.userData.dus = 3 + i * 0.15; e.userData.y0 = 0.46; e.position.y += e.userData.dus; grup.add(e); } },
        adim(c, grup, dt) { PARCA.dusur(grup, dt); } }; } });

  /* ---------- Hızlı gör ---------- */
  T.oyun3B("hizli-gor", { ortam: "masa", seviyeler: ["5'e kadar", "10'a kadar", "İki çerçeve"], kamera: { poz: [0, 9, 8], bak: [0, 0.4, 0.3], fov: 36 },
    tur(L, c) { const iki = L === 2, a = iki ? R(3, 9) : R(1, L ? 10 : 5), b = iki ? R(2, 9) : 0, ans = a + b; let sure = 1.6;
      return { soru: iki ? "İyi bak! İki tepside birlikte kaç bilye var?" : "İyi bak! Tepside kaç bilye var?", cevap: ans, secenekler: yakin(ans, 4, 2, 0), aciklama: iki ? a + " + " + b + " = " + ans + ". 10'u tamamlamak işe yarar." : "Önce üst sıraya bak: 5'ten fazla mı az mı?",
        goster(c, grup) { PARCA.cerceve(c, grup, a, iki ? -3.3 : 0, 0); if (iki) PARCA.cerceve(c, grup, b, 3.3, 0, 0x2a6fd8); grup.userData.ortu = null; },
        adim(c, grup, dt, durum) { PARCA.dusur(grup, dt); sure -= dt; const { THREE } = c; if (sure < 0 && !grup.userData.ortu && durum === "soru") { const o = new THREE.Mesh(new THREE.BoxGeometry(iki ? 13.5 : 6.6, 1.2, 3.2), new THREE.MeshStandardMaterial({ color: 0x2b3a5a, roughness: 0.7 })); o.position.set(0, 4, 0); o.userData.in = 1; c.golge(o); grup.add(o); grup.userData.ortu = o; }
          const o = grup.userData.ortu; if (o) { if (durum !== "soru" && durum !== "yanlis") o.position.y += (5 - o.position.y) * Math.min(1, dt * 6); else o.position.y += (0.75 - o.position.y) * Math.min(1, dt * 8); } } }; } });

  /* ---------- Sayı bağı ---------- */
  T.oyun3B("sayi-bagi", { ortam: "masa", seviyeler: ["5'e kadar", "10'a kadar", "20'ye kadar"], kamera: { poz: [0, 6, 10], bak: [0, 2.2, 0], fov: 38 },
    tur(L, c) { const w = R(L ? 6 : 3, [5, 10, 20][L]), a = R(0, w), butun = L === 2 && Math.random() < 0.3, ans = butun ? w : w - a;
      return { soru: butun ? "Parçaları birleştir: bütün kaç?" : "Bütün ve bir parça belli. Eksik parça kaç?", cevap: ans, secenekler: yakin(ans, 4, 3, 0), aciklama: w + ", " + a + " ve " + (w - a) + " parçalarına ayrılır.",
        goster(c, grup) { const { THREE } = c; const ust = PARCA.disk(c, butun ? "?" : String(w), 0xe9a23b), s1 = PARCA.disk(c, String(a), 0x3e86d6), s2 = PARCA.disk(c, butun ? String(w - a) : "?", 0x3e86d6, true);
          ust.position.set(0, 4.3, 0); s1.position.set(-2.8, 1.4, 0); s2.position.set(2.8, 1.4, 0); grup.add(ust, s1, s2); grup.userData.soruDisk = butun ? ust : s2;
          const cub = (a1, b1) => { const v = new THREE.Vector3().subVectors(b1, a1), m = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, v.length(), 16), new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 0.5, metalness: 0.2 })); m.position.copy(a1).add(v.multiplyScalar(0.5)); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(b1, a1).normalize()); m.position.z = -0.3; c.golge(m); grup.add(m); };
          cub(new THREE.Vector3(0, 4.3, 0), new THREE.Vector3(-2.8, 1.4, 0)); cub(new THREE.Vector3(0, 4.3, 0), new THREE.Vector3(2.8, 1.4, 0)); },
        dogru(c, grup) { const d = grup.userData.soruDisk; const yuz = d.userData.yuz.material; yuz.map.dispose(); yuz.map = c.sayiDoku(String(ans), "#FFF6B0", "#FFD84A", "#3A2A00", true); yuz.needsUpdate = true; grup.userData.zip = 1; },
        adim(c, grup, dt) { const d = grup.userData.soruDisk; if (!d) return; d.rotation.y = grup.userData.zip ? Math.sin(c.zaman * 10) * 0.3 * grup.userData.zip : Math.sin(c.zaman * 1.5) * 0.08; if (grup.userData.zip) grup.userData.zip = Math.max(0, grup.userData.zip - dt * 0.7); } }; } });

  /* ---------- Buzu kır: 10'u tamamla ---------- */
  T.oyun3B("onu-tamamla", { ortam: "masa", seviyeler: ["10'a tamamla", "20'ye tamamla", "10 yap stratejisi"], kamera: { poz: [0, 9, 8], bak: [0, 0.4, 0.3], fov: 36 },
    tur(L, c) { if (L < 2) { const t = L ? 20 : 10, n = R(1, t - 1); return { soru: "Buz tepsisinde " + n + " buz var. " + t + " olması için kaç buz daha lazım?", cevap: t - n, secenekler: yakin(t - n, 4, 3, 0), aciklama: n + " ile " + (t - n) + " birlikte " + t + " eder.",
        goster(c, grup) { PARCA.cerceve(c, grup, Math.min(n, 10), t === 20 ? -3.3 : 0, 0, 0, 0, 0, true); if (t === 20) PARCA.cerceve(c, grup, Math.max(0, n - 10), 3.3, 0, 0, 0, 0, true); }, adim(c, grup, dt) { PARCA.dusur(grup, dt); } }; }
      const a = R(6, 9), b = R(3, 9), need = 10 - a; return { soru: a + " + " + b + " = 10 + ?", cevap: a + b - 10, secenekler: yakin(a + b - 10, 4, 3, 0), aciklama: b + " sayısından " + need + " tanesi " + a + "'yı 10 yapar, geriye " + (b - need) + " kalır.",
        goster(c, grup) { PARCA.cerceve(c, grup, a, -3.3, 0, 0, need, 0, true); PARCA.cerceve(c, grup, b - need, 3.3, 0, 0, 0, 0, true); }, adim(c, grup, dt) { PARCA.dusur(grup, dt); } }; } });

  /* ---------- Blokları say ---------- */
  T.oyun3B("bloklari-say", { ortam: "masa", seviyeler: ["50'ye kadar", "99'a kadar", "999'a kadar"], kamera: { poz: [0, 6.2, 6.4], bak: [0, 0.2, -0.3], fov: 40 },
    tur(L, c) { const n = R(L === 0 ? 11 : 20, [50, 99, 999][L]), ters = Number(String(n).split("").reverse().join(""));
      const o = new Set([n, n + 10 > 999 ? n - 20 : n + 10, Math.max(1, n - 1), ters === n ? n + 1 : ters]); let k = 0; while (o.size < 4 && k++ < 30) o.add(n + R(-12, 12));
      return { soru: "Bloklar hangi sayıyı gösteriyor?", cevap: n, secenekler: T.shuffle([...o]).slice(0, 4), aciklama: (n >= 100 ? Math.floor(n / 100) + " yüzlük, " : "") + Math.floor((n % 100) / 10) + " onluk, " + (n % 10) + " birlik.",
        goster(c, grup) { const gen = Math.floor(n / 100) * 3.8 + Math.floor((n % 100) / 10) * 0.56 + 1.5; PARCA.blok(c, grup, n, -gen / 2); }, adim(c, grup, dt) { PARCA.dusur(grup, dt); } }; } });

  /* ---------- Saat treni ---------- */
  T.oyun3B("saat-treni", { ortam: "masa", seviyeler: ["Tam ve yarım", "Çeyrekler", "5 dakika"], kamera: { poz: [0, 3.6, 12], bak: [0, 2.8, 0], fov: 40 },
    tur(L, c) { const hh = R(1, 12), mm = L === 0 ? P([0, 30]) : L === 1 ? P([0, 15, 30, 45]) : R(0, 11) * 5, f = (a, b) => a + ":" + T.pad(b), ans = f(hh, mm);
      const o = new Set([ans]); while (o.size < 4) o.add(f(P([hh, (hh % 12) + 1, ((hh + 10) % 12) + 1]), L === 0 ? P([0, 30]) : P([0, 15, 30, 45, mm, (mm + 30) % 60])));
      let sa = null; return { soru: "Duvardaki saat kaçı gösteriyor?", cevap: ans, secenekler: T.shuffle([...o]), aciklama: T.saatOku ? T.saatOku(hh, mm) : ans,
        goster(c, grup) { sa = PARCA.saat(c, grup); sa.g.position.set(0, 3.3, 0); sa.hedefA = -(((hh % 12) + mm / 60) * Math.PI) / 6; sa.hedefY = -(mm * Math.PI) / 30; sa.akrep.rotation.z = sa.hedefA + 1.5; sa.yelkovan.rotation.z = sa.hedefY - 4; },
        adim(c, grup, dt) { if (!sa) return; sa.akrep.rotation.z += (sa.hedefA - sa.akrep.rotation.z) * Math.min(1, dt * 6); sa.yelkovan.rotation.z += (sa.hedefY - sa.yelkovan.rotation.z) * Math.min(1, dt * 6); } }; } });

  /* ---------- Örüntü treni: ahşap tren, vagonlarda geometrik cisimler ---------- */
  const CISIM = { kk: ["Kırmızı top", 0xd8342a, "kure"], mk: ["Mavi küp", 0x2a6fd8, "kup"], sk: ["Sarı küp", 0xf2b51b, "kup"], mo: ["Mavi koni", 0x2a6fd8, "koni"], ys: ["Yeşil silindir", 0x2e9b4f, "sil"], ss: ["Sarı koni", 0xf2b51b, "koni"], ks: ["Kırmızı silindir", 0xd8342a, "sil"], yk: ["Yeşil top", 0x2e9b4f, "kure"] };
  const cisim = (c, k) => { const { THREE } = c, [, renk, tur] = CISIM[k], m = new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.25, clearcoat: 0.8 });
    const geo = tur === "kure" ? new THREE.SphereGeometry(0.42, 32, 24) : tur === "kup" ? new THREE.BoxGeometry(0.7, 0.7, 0.7) : tur === "koni" ? new THREE.ConeGeometry(0.42, 0.85, 32) : new THREE.CylinderGeometry(0.35, 0.35, 0.8, 32); const o = new THREE.Mesh(geo, m); o.castShadow = true; return o; };
  T.oyun3B("oruntu-treni", { ortam: "masa", seviyeler: ["İki öğe", "Üç öğe", "Dört öğe"], kamera: { poz: [-1.5, 4.5, 13], bak: [-1.5, 1, 0], fov: 40 },
    tur(L, c) { const units = [["kk", "mk"], ["sk", "sk", "mo"], ["kk", "ys", "ss"], ["yk", "ks", "ks", "mk"]]; const u = L === 0 ? units[0] : L === 1 ? P(units.slice(0, 3)) : P(units);
      const dizi = Array.from({ length: 7 }, (_, i) => u[i % u.length]), ans = u[7 % u.length];
      const secK = T.shuffle([ans, ...T.shuffle(Object.keys(CISIM).filter((k) => k !== ans)).slice(0, 3)]);
      return { soru: "Örüntüye bak. Son vagona hangi cisim gelmeli?", cevap: CISIM[ans][0], secenekler: secK.map((k) => CISIM[k][0]), aciklama: "Tekrar eden parça: " + u.map((k) => CISIM[k][0].toLocaleLowerCase("tr")).join(", ") + ".",
        goster(c, grup) { const { THREE } = c, tm = new THREE.MeshStandardMaterial({ map: c.tahta(), roughness: 0.55 }), tekM = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.4 }), kirmizi = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.4 });
          const ray = new THREE.Mesh(new THREE.BoxGeometry(22, 0.08, 0.15), tekM); [-0.55, 0.55].forEach((z) => { const r2 = ray.clone(); r2.position.set(0, 0.04, z); grup.add(r2); });
          for (let i = -11; i < 11; i += 0.8) { const tr = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 1.6), tm); tr.position.set(i, 0.02, 0); tr.receiveShadow = true; grup.add(tr); }
          const tren = new THREE.Group(); grup.add(tren); grup.userData.tren = tren;
          const lok = new THREE.Group(); const gv = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.1), kirmizi); gv.position.y = 0.85; lok.add(gv); const kz = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 24), new THREE.MeshStandardMaterial({ color: 0x2a6fd8, roughness: 0.4 })); kz.rotation.z = Math.PI / 2; kz.position.set(0.55, 1.0, 0); lok.add(kz); const bc = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.6, 16), tekM); bc.position.set(0.95, 1.8, 0); lok.add(bc); const kab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 1.1), tm); kab.position.set(-0.5, 1.6, 0); lok.add(kab); lok.position.x = 4.6; tren.add(lok);
          const teker = (p, x) => [-0.6, 0.6].forEach((z) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24), tekM); t.rotation.x = Math.PI / 2; t.position.set(x, 0.3, z); p.add(t); });
          [-0.5, 0.5].forEach((x) => teker(lok, x));
          dizi.concat(["?"]).forEach((k, i) => { const v = new THREE.Group(); const kasa = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 1.1), tm); kasa.position.y = 0.6; v.add(kasa); [-0.3, 0.3].forEach((x) => teker(v, x)); v.position.x = 3.1 - i * 1.35;
            if (k !== "?") { const o = cisim(c, k); o.position.y = 1.25; v.add(o); } else { const q2 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: c.sayiDoku("?", "#FFFFFF", "#EEF3F8", "#1B2A4A", true), transparent: true })); q2.position.set(0, 1.3, 0.3); v.add(q2); grup.userData.son = v; }
            tren.add(v); });
          c.golge(tren); tren.position.x = 14; },
        dogru(c, grup) { const v = grup.userData.son; v.children.filter((o) => o.geometry && o.geometry.type === "PlaneGeometry").forEach((o) => v.remove(o)); const o = cisim(c, ans); o.position.y = 3; o.userData.dus = 1; v.add(o); grup.userData.yeni = o; },
        adim(c, grup, dt, durum) { const t = grup.userData.tren; if (!t) return; const hedef = durum === "dogru" ? -16 : 0.2; t.position.x += (hedef - t.position.x) * Math.min(1, dt * (durum === "dogru" ? 0.6 : 1.2)); const o = grup.userData.yeni; if (o && o.position.y > 1.25) o.position.y = Math.max(1.25, o.position.y - dt * 6); } }; } });

  /* ---------- Ritmik sayma: sayılı balonlar ---------- */
  T.oyun3B("ritmik", { ortam: "cayir", seviyeler: ["2, 5, 10", "3, 4, 5, 10", "6-9, 25, 100"], kamera: { poz: [0, 3.5, 14], bak: [0, 3.6, 0], fov: 40 },
    tur(L, c) { const k = P(L === 0 ? [2, 5, 10] : L === 1 ? [3, 4, 5, 10] : [6, 7, 8, 9, 25, 100]), st = k * R(0, 5), seq = Array.from({ length: 6 }, (_, i) => st + i * k), m = R(2, 5);
      return { soru: "Balonlarda " + er(k) + " ritmik sayıyoruz. Eksik balonda hangi sayı var?", cevap: seq[m], secenekler: yakin(seq[m], 4, k, 0), aciklama: "Her balonda " + k + " artıyor.",
        goster(c, grup) { const { THREE } = c, RN = [0xe0452b, 0x2a6fd8, 0xf2b51b, 0x2e9b4f, 0x8a5bd6, 0xff7aa2]; grup.userData.b = [];
          seq.forEach((v, i) => { const b = new THREE.Group(); const kure = new THREE.Mesh(new THREE.SphereGeometry(0.95, 40, 28), new THREE.MeshPhysicalMaterial({ color: RN[i], roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.3 })); kure.scale.set(1, 1.18, 1); b.add(kure);
            const dg = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.25, 12), kure.material); dg.position.y = -1.18; dg.rotation.x = Math.PI; b.add(dg);
            const ip = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 3.2, 4), new THREE.MeshBasicMaterial({ color: 0xffffff })); ip.position.y = -2.85; b.add(ip);
            const pl = new THREE.Mesh(new THREE.CircleGeometry(0.62, 40), new THREE.MeshStandardMaterial({ map: c.sayiDoku(i === m ? "?" : String(v), "#FFFFFF", "#F4F4F4", "#1B2A4A", true), transparent: true })); pl.position.z = 0.97; b.add(pl);
            b.position.set(-6.25 + i * 2.5, 4.3 + (i % 2) * 0.5, 0); b.userData = { y0: b.position.y, f: Math.random() * 6, pl }; c.golge(b); grup.add(b); grup.userData.b.push(b); }); },
        dogru(c, grup) { const pl = grup.userData.b[m].userData.pl; pl.material.map.dispose(); pl.material.map = c.sayiDoku(String(seq[m]), "#FFF6B0", "#FFD84A", "#3A2A00", true); pl.material.needsUpdate = true; grup.userData.ucur = 1; },
        adim(c, grup, dt) { (grup.userData.b || []).forEach((b, i) => { const u = b.userData; if (grup.userData.ucur && i === m) u.y0 += dt * 0.8; b.position.y = u.y0 + Math.sin(c.zaman * 1.2 + u.f) * 0.18; b.rotation.z = Math.sin(c.zaman * 0.9 + u.f) * 0.06; }); } }; } });

  /* ---------- Sayı doğrusu atışı: ahşap cetvel ve dart ---------- */
  T.oyun3B("dogru-atisi", { ortam: "masa", seviyeler: ["0-20", "0-100", "0-1000"], kamera: { poz: [0, 4.6, 12], bak: [0, 1.4, 0], fov: 42 },
    tur(L, c) { const [a, b, step] = [[0, 20, 1], [0, 100, 10], [0, 1000, 100]][L], v = L === 0 ? R(1, 19) : L === 1 ? R(1, 99) : R(1, 99) * 10;
      return { soru: "Dart cetvelde hangi sayıya saplandı?", cevap: v, secenekler: yakin(v, 4, [2, 8, 80][L], 0), aciklama: "En yakın çentiğe bak, aradaki adımları say.",
        goster(c, grup) { const { THREE } = c, X = (n) => -6.5 + ((n - a) / (b - a)) * 13;
          const cetvel = new THREE.Mesh(new THREE.BoxGeometry(14.2, 1.2, 0.35), new THREE.MeshStandardMaterial({ map: c.doku(2048, 180, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#F3D9A4"); g.addColorStop(1, "#D9B16A"); x.fillStyle = g; x.fillRect(0, 0, w, h); const P0 = (n) => ((X(n) + 7.1) / 14.2) * w; const adim = (b - a) / 20; for (let n = a; n <= b + 1e-9; n += (b - a) / (L === 0 ? 20 : 100)) { const maj = Math.abs(((n - a) / step) - Math.round((n - a) / step)) < 1e-6; x.strokeStyle = "#3A2A10"; x.lineWidth = maj ? 5 : 2; x.beginPath(); x.moveTo(P0(n), 0); x.lineTo(P0(n), maj ? h * 0.42 : h * 0.22); x.stroke(); if (maj && (L > 0 || Math.round(n) % 5 === 0)) { x.font = "800 52px Nunito, sans-serif"; x.textAlign = "center"; x.fillStyle = "#2A1A08"; x.fillText(String(Math.round(n)), P0(n), h * 0.8); } } }), roughness: 0.6 }));
          cetvel.position.set(0, 1.0, 0); cetvel.rotation.x = -0.15; c.golge(cetvel); grup.add(cetvel);
          const dart = new THREE.Group(); const uc = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xcfd6de, metalness: 1, roughness: 0.25 })); uc.rotation.x = Math.PI; uc.position.y = -0.25; dart.add(uc);
          const gv = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.1, 16), new THREE.MeshStandardMaterial({ color: 0xd8342a, roughness: 0.35 })); gv.position.y = 0.55; dart.add(gv);
          for (let k = 0; k < 3; k++) { const kn = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.36), new THREE.MeshStandardMaterial({ color: 0xf2b51b, roughness: 0.5 })); kn.position.y = 1.2; kn.rotation.y = (k * Math.PI) / 3; dart.add(kn); }
          c.golge(dart); dart.position.set(X(v), 1.95 + 8, 0.2); dart.rotation.x = -0.15; dart.userData.y0 = 1.95; grup.add(dart); grup.userData.dart = dart; },
        adim(c, grup, dt) { const d = grup.userData.dart; if (d && d.position.y > d.userData.y0) { d.position.y = Math.max(d.userData.y0, d.position.y - dt * 22); if (d.position.y === d.userData.y0) T.Sahne.ses.kon(); } } }; } });

  /* ---------- Problem çiftliği: sepetlerde yumurtalar ---------- */
  const yumurta = (c) => { const { THREE } = c, m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 24), new THREE.MeshPhysicalMaterial({ color: P([0xf4e4cc, 0xfbf6ee, 0xe9c9a2]), roughness: 0.5, sheen: 0.4 })); m.scale.set(1, 1.3, 1); m.castShadow = true; return m; };
  const sepet = (c) => { const { THREE } = c, pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector2(1.2 + t * 0.5, t * 0.9)); } const g = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), new THREE.MeshStandardMaterial({ color: 0xb07a45, roughness: 0.8, side: THREE.DoubleSide, map: c.doku(256, 256, (x, w, h) => { x.fillStyle = "#B07A45"; x.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? "rgba(70,40,15,.35)" : "rgba(255,220,170,.15)"; x.fillRect(0, (i / 16) * h, w, h / 32); } for (let i = 0; i < 24; i++) { x.fillStyle = "rgba(70,40,15,.3)"; x.fillRect((i / 24) * w, 0, 3, h); } }) })); const t2 = new THREE.Mesh(new THREE.CircleGeometry(1.2, 48), g.material); t2.rotation.x = -Math.PI / 2; t2.position.y = 0.01; const gr = new THREE.Group(); gr.add(g, t2); return c.golge(gr); };
  T.oyun3B("problem-ciftligi", { ortam: "cayir", seviyeler: ["10'a kadar", "20'ye kadar", "100'e kadar"], kamera: { poz: [0, 6.5, 10], bak: [0, 0.8, 0], fov: 40 },
    tur(L, c) { const max = [10, 20, 100][L], NM = ["Ada", "Can", "Ece", "Mert", "Zeynep", "Efe", "Elif", "Kaan"], who = P(NM), who2 = P(NM.filter((x) => x !== who));
      const kind = P(L ? ["ekle", "birlestir", "ayir", "karsilastir", "eksik"] : ["ekle", "birlestir", "ayir"]); let a = R(1, max / 2), b = R(1, max / 2), text, ans;
      if (kind === "ayir" && b > a) [a, b] = [b, a]; if (kind === "karsilastir" && a === b) a++;
      if (kind === "ekle") { text = `Kümeste ${a} yumurta vardı. Tavuklar ${b} yumurta daha yumurtladı. Şimdi kaç yumurta var?`; ans = a + b; }
      else if (kind === "birlestir") { text = `${who} ${a}, ${who2} ${b} yumurta topladı. İkisi toplam kaç yumurta topladı?`; ans = a + b; }
      else if (kind === "ayir") { text = `Sepette ${a} yumurta vardı. ${who} ${b} tanesini kahvaltıda kullandı. Kaç yumurta kaldı?`; ans = a - b; }
      else if (kind === "karsilastir") { text = `${who}'nın sepetinde ${Math.max(a, b)}, ${who2}'nın sepetinde ${Math.min(a, b)} yumurta var. Aradaki fark kaç?`; ans = Math.abs(a - b); }
      else { const t = a + b; text = `${who} ${t} yumurta topladı. ${a} tanesini sepete koydu, gerisini kovaya. Kovada kaç yumurta var?`; ans = b; }
      const goster = Math.max(a, b) <= 20;
      return { soru: text, cevap: ans, secenekler: yakin(ans, 4, 3, 0), aciklama: kind === "ayir" ? a + " − " + b + " = " + ans : kind === "karsilastir" ? "Büyükten küçüğü çıkarırız." : kind === "eksik" ? a + " + ? = " + (a + b) : a + " + " + b + " = " + ans,
        goster(c, grup) { const s1 = sepet(c), s2 = sepet(c); s1.position.x = -3; s2.position.x = 3; grup.add(s1, s2); if (!goster) return;
          const doldur = (n, x, gizle) => { for (let i = 0; i < n; i++) { const y = yumurta(c), a2 = i * 2.4, r = 0.25 + Math.sqrt(i) * 0.28; y.position.set(x + Math.cos(a2) * Math.min(r, 1.1), 0.4 + Math.floor(i / 12) * 0.45, Math.sin(a2) * Math.min(r, 1.1)); y.rotation.set(Math.random(), Math.random(), Math.random() * 0.5 + 1.2); y.userData.dus = 2 + i * 0.08; y.userData.y0 = y.position.y; y.position.y += y.userData.dus; if (gizle) y.material.opacity = 0.35, (y.material.transparent = true); grup.add(y); } };
          if (kind === "ayir") { doldur(a - b, -3); doldur(b, 3, true); } else if (kind === "eksik") doldur(a, -3); else { doldur(a, -3); doldur(b, 3); } },
        adim(c, grup, dt) { PARCA.dusur(grup, dt); } }; } });

  /* ---------- Solucanı ölç ---------- */
  T.oyun3B("solucan", { ortam: "cayir", seviyeler: ["Ölç", "Karşılaştır", "Fark"], kamera: { poz: [0, 7, 9], bak: [0, 0.3, 0.4], fov: 42 },
    tur(L, c) { let a = R(2, 12), b = R(2, 12); if (L && a === b) b = a === 12 ? a - 1 : a + 1; const U = 0.95, X0 = -6;
      const r = L === 0 ? { soru: "Pembe solucan kaç birim uzunluğunda?", cevap: a, secenekler: yakin(a, 4, 2, 1), aciklama: "Cetvelin 0 çizgisinden başla, solucanın bittiği yeri oku." }
        : L === 1 ? { soru: "Hangi solucan daha uzun?", cevap: a > b ? "Pembe" : "Yeşil", secenekler: ["Pembe", "Yeşil"], aciklama: "Pembe " + a + ", yeşil " + b + " birim." }
        : { soru: "Pembe ile yeşil solucan arasında kaç birim fark var?", cevap: Math.abs(a - b), secenekler: yakin(Math.abs(a - b), 4, 3, 0), aciklama: "Pembe " + a + ", yeşil " + b + " birim: fark " + Math.abs(a - b) + "." };
      return Object.assign(r, {
        goster(c, grup) { const { THREE } = c;
          const cetvel = new THREE.Mesh(new THREE.BoxGeometry(13 * U + 0.4, 0.12, 0.9), new THREE.MeshStandardMaterial({ map: c.doku(2048, 160, (x, w, h) => { x.fillStyle = "#F2D27A"; x.fillRect(0, 0, w, h); for (let i = 0; i <= 13; i++) { const px = 0.2 / (13 * U + 0.4) * w + (i / 13) * (13 * U) / (13 * U + 0.4) * w; x.strokeStyle = "#2a2a2a"; x.lineWidth = 6; x.beginPath(); x.moveTo(px, 0); x.lineTo(px, h * 0.45); x.stroke(); x.font = "800 60px Nunito, sans-serif"; x.textAlign = "center"; x.fillStyle = "#2a2a2a"; x.fillText(String(i), px, h * 0.85); } }), roughness: 0.6 }));
          cetvel.position.set(X0 + (13 * U) / 2, 0.06, 2.0); c.golge(cetvel); grup.add(cetvel);
          const solucan = (n, z, renk) => { const g2 = new THREE.Group(); for (let i = 0; i < n; i++) { const k = new THREE.Mesh(new THREE.SphereGeometry(U * 0.52, 32, 20), new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.35, clearcoat: 0.6 })); k.scale.set(1, 0.85, 0.9); k.position.set(X0 + i * U + U / 2, 0.45, z); k.castShadow = true; g2.add(k); }
            const gz = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: 0x111111 })); gz.position.set(X0 + (n - 0.25) * U, 0.75, z + 0.28); g2.add(gz); grup.add(g2); return g2; };
          grup.userData.s = [solucan(a, L ? -0.9 : 0.6, 0xf27ba9)]; if (L) grup.userData.s.push(solucan(b, 0.75, 0x8fd16a)); },
        adim(c, grup) { (grup.userData.s || []).forEach((g2, k) => g2.children.forEach((m, i) => { if (m.geometry.type === "SphereGeometry" && m.scale.y < 0.9) m.position.y = 0.45 + Math.max(0, Math.sin(c.zaman * 3 - i * 0.6 + k)) * 0.08; })); } }); } });

  /* ---------- Grafik dedektifi: meyve kasası sütunları ---------- */
  T.oyun3B("grafik-dedektifi", { ortam: "masa", seviyeler: ["Üç meyve", "Dört meyve", "Dört meyve, işlemli"], kamera: { poz: [0, 5.5, 11], bak: [0, 2, 0], fov: 40 },
    tur(L, c) { const cats = T.shuffle([["Elma", 0xc8201c], ["Portakal", 0xf08a24], ["Limon", 0xf2d33a], ["Üzüm", 0x6a3aa8]]).slice(0, L ? 4 : 3), data = cats.map(([n]) => [n, R(1, 8)]);
      const kind = P(L === 2 ? ["fark", "toplam", "kac"] : L ? ["en", "fark", "kac"] : ["en", "kac"]), mx = Math.max(...data.map((d) => d[1]));
      const tekEn = data.filter((d) => d[1] === mx).length === 1; let soru, cevap, sec;
      if (kind === "en" && tekEn) { soru = "Hangi meyveden en çok var?"; cevap = data.find((d) => d[1] === mx)[0]; sec = data.map((d) => d[0]); }
      else if (kind === "fark") { const [x, y] = T.shuffle(data).slice(0, 2); soru = x[0] + " ile " + y[0] + " arasında kaç fark var?"; cevap = Math.abs(x[1] - y[1]); sec = yakin(cevap, 4, 2, 0); }
      else if (kind === "toplam") { soru = "Masada toplam kaç meyve var?"; cevap = data.reduce((s2, d) => s2 + d[1], 0); sec = yakin(cevap, 4, 3, 1); }
      else { const d = P(data); soru = "Kaç tane " + d[0].toLocaleLowerCase("tr") + " var?"; cevap = d[1]; sec = yakin(cevap, 4, 2, 1); }
      return { soru, cevap, secenekler: sec, aciklama: data.map((d) => d[0] + " " + d[1]).join(", ") + ".",
        goster(c, grup) { const { THREE } = c;
          cats.forEach(([ad, renk], i) => { const x = (i - (cats.length - 1) / 2) * 2.6, n = data[i][1];
            const kasa = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.2), new THREE.MeshStandardMaterial({ map: c.tahta(), roughness: 0.6 })); kasa.position.set(x, 0.2, 0); c.golge(kasa); grup.add(kasa);
            const et = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), new THREE.MeshStandardMaterial({ map: c.doku(512, 160, (x2, w, h) => { x2.fillStyle = "#FFF8EC"; x2.fillRect(0, 0, w, h); x2.font = "800 80px Nunito, sans-serif"; x2.textAlign = "center"; x2.textBaseline = "middle"; x2.fillStyle = "#3A2A10"; x2.fillText(ad, w / 2, h / 2); }) })); et.position.set(x, 0.22, 0.61); grup.add(et);
            for (let k = 0; k < n; k++) { const m = ad === "Üzüm" ? new THREE.Group() : new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 24), new THREE.MeshPhysicalMaterial({ color: renk, roughness: ad === "Elma" ? 0.3 : 0.6, clearcoat: ad === "Elma" ? 0.7 : 0.1 }));
              if (ad === "Üzüm") for (let j = 0; j < 7; j++) { const ta = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.25, clearcoat: 0.8 })); ta.position.set(Math.cos(j) * 0.14, -Math.floor(j / 3) * 0.15, Math.sin(j) * 0.14); m.add(ta); }
              if (ad === "Limon") m.scale.set(1, 0.85, 0.85); m.position.set(x, 0.75 + k * 0.62, 0); m.userData.dus = 2 + k * 0.25; m.userData.y0 = m.position.y; m.position.y += m.userData.dus; c.golge(m); grup.add(m); } }); },
        adim(c, grup, dt) { PARCA.dusur(grup, dt); } }; } });

  /* ---------- Tırtıl sayıyor: yaprak üstünde tüylü tırtıl, her boğumda bir sayı ---------- */
  T.oyun3B("tirtil", {
    ortam: "cayir", simge: "🍃", seviyeler: ["Birer ileri", "İleri ve geri", "Ritmik sayma"],
    kamera: { poz: [0, 4.2, 15], bak: [0, 1.2, 0], fov: 36 }, pozlama: 0.82,
    kur(c) {
      const { THREE, sahne } = c;
      /* büyük yaprak */
      const sekil = new THREE.Shape(); sekil.moveTo(-7.5, 0); sekil.bezierCurveTo(-5, 3.4, 5, 3.4, 7.8, 0); sekil.bezierCurveTo(5, -3.4, -5, -3.4, -7.5, 0);
      const ygeo = new THREE.ExtrudeGeometry(sekil, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.06, bevelSegments: 2, curveSegments: 48 });
      const ydoku = c.doku(1024, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#3F8A30"); g.addColorStop(0.5, "#5AA845"); g.addColorStop(1, "#347A28"); x.fillStyle = g; x.fillRect(0, 0, w, h); x.strokeStyle = "rgba(200,235,160,.45)"; x.lineWidth = 8; x.beginPath(); x.moveTo(0, h / 2); x.lineTo(w, h / 2); x.stroke(); x.lineWidth = 3; x.strokeStyle = "rgba(200,235,160,.3)"; for (let i = 1; i < 12; i++) { const px = (i / 12) * w; x.beginPath(); x.moveTo(px, h / 2); x.quadraticCurveTo(px + 30, h / 2 - 80, px + 70, h * 0.12); x.moveTo(px, h / 2); x.quadraticCurveTo(px + 30, h / 2 + 80, px + 70, h * 0.88); x.stroke(); } });
      ydoku.wrapS = ydoku.wrapT = THREE.RepeatWrapping; ydoku.repeat.set(1 / 15.6, 1 / 7); ydoku.offset.set(0.48, 0.5);
      const yaprak = new THREE.Mesh(ygeo, new THREE.MeshStandardMaterial({ map: ydoku, roughness: 0.55, side: THREE.DoubleSide })); yaprak.rotation.x = -Math.PI / 2; yaprak.position.y = 0.05; c.golge(yaprak); sahne.add(yaprak);
      const sap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0x4a8a35 })); sap.rotation.z = Math.PI / 2; sap.position.set(8.8, 0.12, 0); sahne.add(sap);
    },
    tur(L, c) {
      const { THREE } = c;
      const step = [1, P([1, -1]), P([2, 5, 10, -2])][L]; const start = step > 0 ? R(0, L ? 60 : 12) : R(Math.abs(step) * 6, L ? 90 : 20);
      const seq = Array.from({ length: 6 }, (_, i) => start + i * step), miss = R(1, 4);
      const RENK = [0x6cc04a, 0x8fd16a];
      return {
        soru: step < 0 ? "Tırtıl geriye doğru sayıyor. Eksik boğumda hangi sayı var?" : "Tırtılın eksik boğumunda hangi sayı var?",
        cevap: seq[miss], secenekler: yakin(seq[miss], 4, Math.max(2, Math.abs(step)), 0),
        aciklama: "Kural: her boğumda " + (step > 0 ? step + " artıyor." : -step + " azalıyor."), ipucu: "Komşu boğumlara bak, kaçar kaçar değişiyor?",
        goster(c, grup) {
          const boguklar = [];
          seq.forEach((v, i) => {
            const b = new THREE.Group(); b.position.set(-6.2 + i * 1.95, 0.95, 0);
            const kure = new THREE.Mesh(new THREE.SphereGeometry(0.92, 48, 32), new THREE.MeshPhysicalMaterial({ color: RENK[i % 2], roughness: 0.85, sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color(0xd8ffb0) })); kure.castShadow = true; b.add(kure);
            /* tüy telleri */
            const tg = new THREE.CylinderGeometry(0.012, 0.012, 0.28, 4), tm = new THREE.MeshStandardMaterial({ color: 0x3b7a28 });
            for (let k = 0; k < 14; k++) { const t = new THREE.Mesh(tg, tm), a = (k / 14) * Math.PI * 2; t.position.set(Math.cos(a) * 0.4, 0.88, Math.sin(a) * 0.4); t.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); b.add(t); }
            /* ayaklar */
            [-0.35, 0.35].forEach((z) => { const a = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshStandardMaterial({ color: 0x2f6b22, roughness: 0.8 })); a.position.set(0, -0.82, z); b.add(a); });
            /* sayı plakası */
            const pl = new THREE.Mesh(new THREE.CircleGeometry(0.66, 48), new THREE.MeshStandardMaterial({ map: c.sayiDoku(i === miss ? "?" : String(v), "#FFFFFF", "#E8F6DC", "#1F4D15", true), transparent: true, roughness: 0.5 }));
            pl.position.set(0, 0.05, 0.95); pl.renderOrder = 2; b.add(pl); b.userData = { pl, v, i }; boguklar.push(b); grup.add(b);
          });
          /* baş */
          const bas = new THREE.Group(); bas.position.set(5.75, 1.35, 0.2);
          const bk = new THREE.Mesh(new THREE.SphereGeometry(1.08, 48, 32), new THREE.MeshPhysicalMaterial({ color: 0xffc233, roughness: 0.7, sheen: 0.8, sheenColor: new THREE.Color(0xfff0b0) })); bk.castShadow = true; bas.add(bk);
          [-0.38, 0.38].forEach((x) => { const g1 = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })); g1.position.set(x, 0.25, 0.9); bas.add(g1); const g2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 })); g2.position.set(x, 0.25, 1.12); bas.add(g2); const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); p.position.set(x + 0.05, 0.32, 1.25); bas.add(p);
            const an = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), new THREE.MeshStandardMaterial({ color: 0x5a3a10 })); an.position.set(x * 1.2, 1.35, 0); an.rotation.z = -x * 0.8; bas.add(an); const ub = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), new THREE.MeshStandardMaterial({ color: 0xe0452b })); ub.position.set(x * 1.75, 1.75, 0); bas.add(ub); });
          const agiz = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 8, 24, Math.PI), new THREE.MeshStandardMaterial({ color: 0x7a2a10 })); agiz.position.set(0, -0.28, 0.98); agiz.rotation.z = Math.PI; bas.add(agiz);
          grup.add(bas); grup.userData = { boguklar, bas, mutlu: 0, salla: 0 };
        },
        dogru(c, grup) { const u = grup.userData, b = u.boguklar[miss]; b.userData.pl.material.map.dispose(); b.userData.pl.material.map = c.sayiDoku(String(seq[miss]), "#FFF6B0", "#FFD84A", "#3A2A00", true); b.userData.pl.material.needsUpdate = true; u.mutlu = 1.6; },
        yanlis(c, grup) { grup.userData.salla = 0.8; },
        adim(c, grup, dt) {
          const u = grup.userData; if (!u.boguklar) return; const t = c.zaman; u.mutlu = Math.max(0, u.mutlu - dt); u.salla = Math.max(0, u.salla - dt);
          u.boguklar.forEach((b, i) => { const dalga = Math.sin(t * 3 - i * 0.7); b.position.y = 0.95 + Math.max(0, dalga) * 0.18 + (u.mutlu ? Math.abs(Math.sin(t * 12 - i)) * 0.5 : 0); b.scale.set(1 - dalga * 0.03, 1 + dalga * 0.04, 1); });
          u.bas.position.y = 1.35 + Math.sin(t * 3 - 4.2) * 0.1 + (u.mutlu ? Math.abs(Math.sin(t * 12)) * 0.5 : 0); u.bas.rotation.y = u.salla ? Math.sin(t * 25) * 0.35 : Math.sin(t * 0.8) * 0.12; u.bas.rotation.z = Math.sin(t * 1.3) * 0.06;
        },
      };
    },
  });
})();
