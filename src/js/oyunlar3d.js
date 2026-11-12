/* 3B oyunlar (ortak iskelet T.oyun3B ile). */
(function () {
  const R = (a, b) => Math.floor(a + Math.random() * (b - a + 1)), P = (l) => l[Math.floor(Math.random() * l.length)];
  const yakin = (ans, n = 4, sp = 3, min = 0) => { const o = new Set([ans]); let t = 0; while (o.size < n && t++ < 200) { const v = ans + R(-sp, sp); if (v >= min && v !== ans) o.add(v); } return T.shuffle([...o]); };

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
