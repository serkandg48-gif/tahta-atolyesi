/* Ortak 3B oyun iskeleti: three.js (MIT) ile ışık, gölge, ortam, takımlar, cevap düğmeleri, yavaş tahta güvenliği.
   Her oyun yalnızca kendi nesnelerini kurar: T.oyun3B(id, { ortam, kamera, kur, tur, adim }). */
(function () {
  const Sh = T.Sahne;
  let THREE_P = null;
  T.three = () => THREE_P || (THREE_P = import(new URL("vendor/three/three.module.min.js", location.href).href));
  const doku = (THREE, w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  /* hazır ortamlar */
  const ORTAM = {
    masa(c) {
      const { THREE, sahne } = c;
      sahne.background = doku(THREE, 16, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#EADFCB"); g.addColorStop(1, "#BFA585"); x.fillStyle = g; x.fillRect(0, 0, w, h); });
      const td = c.tahta(); td.wrapS = td.wrapT = THREE.RepeatWrapping; td.repeat.set(3, 1.5);
      const masa = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 14), new THREE.MeshStandardMaterial({ map: td, roughness: 0.62 })); masa.position.y = -0.25; masa.receiveShadow = true; sahne.add(masa);
      const duvar = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ color: 0xe6d6bf, roughness: 0.95 })); duvar.position.set(0, 10, -7); sahne.add(duvar);
    },
    cayir(c) {
      const { THREE, sahne } = c;
      sahne.background = doku(THREE, 16, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#5DA9E9"); g.addColorStop(0.7, "#BFE3F7"); g.addColorStop(1, "#E8F5FB"); x.fillStyle = g; x.fillRect(0, 0, w, h); });
      sahne.fog = new THREE.Fog(0xcfe9f5, 18, 45);
      const cim = doku(THREE, 512, 512, (x, w, h) => { x.fillStyle = "#5FA84C"; x.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { x.strokeStyle = ["rgba(40,100,35,.4)", "rgba(150,210,110,.35)", "rgba(80,150,60,.45)", "rgba(210,220,120,.2)"][i % 4]; x.lineWidth = 1.2; const px = Math.random() * w, py = Math.random() * h; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (Math.random() - 0.5) * 3, py - 3 - Math.random() * 6); x.stroke(); } });
      cim.wrapS = cim.wrapT = THREE.RepeatWrapping; cim.repeat.set(14, 14);
      const zemin = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ map: cim, roughness: 0.95 })); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
      /* uzak tepeler ve ağaçlar */
      const tepeM = new THREE.MeshStandardMaterial({ color: 0x7cbf7a, roughness: 1 });
      for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(new THREE.SphereGeometry(9 + Math.random() * 6, 24, 12), tepeM); t.position.set(-40 + i * 10 + Math.random() * 4, -6, -30 - Math.random() * 8); t.scale.y = 0.55; sahne.add(t); }
      const govdeM = new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 0.9 }), yaprakM = new THREE.MeshStandardMaterial({ color: 0x3f8f3f, roughness: 0.85 });
      for (let i = 0; i < 12; i++) { const g = new THREE.Group(), s = 0.8 + Math.random() * 0.8; const gv = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.22 * s, 1.6 * s, 8), govdeM); gv.position.y = 0.8 * s; g.add(gv); [[0, 2.2, 0, 1.1], [-0.5, 1.8, 0.2, 0.8], [0.5, 1.9, -0.1, 0.85]].forEach(([x, y, z, r]) => { const y2 = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), yaprakM); y2.position.set(x * s, y * s, z * s); y2.castShadow = true; g.add(y2); }); g.position.set(-22 + i * 4 + Math.random() * 2, 0, -14 - Math.random() * 6); gv.castShadow = true; sahne.add(g); }
    },
  };
  ORTAM.deniz = (c) => {
    const { THREE, sahne } = c;
    sahne.background = doku(THREE, 16, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#5CC6E8"); g.addColorStop(0.5, "#1B7FB3"); g.addColorStop(1, "#0B3E66"); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    sahne.fog = new THREE.FogExp2(0x1b6f9e, 0.035);
    const kum = doku(THREE, 512, 512, (x, w, h) => { x.fillStyle = "#D9C089"; x.fillRect(0, 0, w, h); for (let i = 0; i < 8000; i++) { x.fillStyle = Math.random() < 0.5 ? "rgba(255,240,200,.3)" : "rgba(120,90,40,.25)"; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }); kum.wrapS = kum.wrapT = THREE.RepeatWrapping; kum.repeat.set(10, 10);
    const zemin = new THREE.Mesh(new THREE.PlaneGeometry(120, 120, 60, 60), new THREE.MeshStandardMaterial({ map: kum, roughness: 1 })); const zp = zemin.geometry.attributes.position; for (let i = 0; i < zp.count; i++) zp.setZ(i, Math.sin(zp.getX(i) * 0.4) * 0.15 + Math.cos(zp.getY(i) * 0.3) * 0.15); zemin.geometry.computeVertexNormals(); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
    const yosunM = new THREE.MeshStandardMaterial({ color: 0x2f8f5b, roughness: 0.8 }); c._yosun = [];
    for (let i = 0; i < 26; i++) { const y = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 2 + Math.random() * 3, 6, 8), yosunM); y.position.set(-16 + Math.random() * 32, 1.4, -4 - Math.random() * 10); sahne.add(y); c._yosun.push(y); }
    const merM = [0xff7a6b, 0xffa35c, 0xf06292].map((col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.7 }));
    for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + Math.random() * 0.6, 1), merM[i % 3]); m.position.set(-14 + Math.random() * 28, 0.3, -2 - Math.random() * 8); m.scale.y = 1.4; sahne.add(m); }
    c._kabarcik = []; const kb = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.05, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 40; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.05 + Math.random() * 0.12, 12, 8), kb); b.position.set(-12 + Math.random() * 24, Math.random() * 10, -1 - Math.random() * 8); sahne.add(b); c._kabarcik.push(b); }
  };
  /* sayılı yüzey dokusu */
  const sayiDoku = (THREE, metin, a = "#FFFFFF", b = "#E9EEF5", yazi = "#1B2A4A", yuvarlak = false) => doku(THREE, 256, 256, (x, w, h) => {
    if (yuvarlak) { const g = x.createRadialGradient(w * 0.4, h * 0.35, 6, w / 2, h / 2, w / 2); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.beginPath(); x.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2); x.fill(); }
    else { const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    x.font = "900 " + (String(metin).length > 3 ? 84 : String(metin).length > 2 ? 104 : 140) + "px Nunito, 'Baloo 2', system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillStyle = "rgba(255,255,255,.55)"; x.fillText(metin, w / 2 + 3, h / 2 + 6); x.fillStyle = yazi; x.fillText(metin, w / 2, h / 2 + 3);
  });

  T.oyun3B = function (id, def) {
    const OY = T.tools["oyun-" + id] || T.tools[id]; if (!OY) return;
    OY.render = function (host) {
      const g = T.store.grade(); let L = def.seviye ? def.seviye(g) : g <= 1 ? 0 : g <= 3 ? 1 : 2;
      const D = { takim: true, puan: [0, 0], sira: 0, simge: def.simge || "⭐" };
      const kap = T.h("div.sh-kap.d3-kap"), ust = T.h("div.sh-ust"), yuk = T.h("div.d3-yuk", def.yukleniyor || "Sahne kuruluyor...");
      kap.append(yuk, ust); host.append(kap);
      const afis = T.h("div.tv-afis"), skor = T.h("div.tv-skor"), alt = T.h("div.tv-alt"); ust.append(afis, skor, alt);
      const ayar = T.h("div.row.tv-ayar"); host.append(ayar);
      T.three().then(kur).catch(() => (yuk.textContent = "Bu cihazda 3B çizim açılamadı."));
      function kur(THREE) {
        let r; try { r = new THREE.WebGLRenderer({ antialias: true }); } catch (e) { yuk.textContent = "Bu cihazda 3B çizim açılamadı."; return; }
        yuk.remove(); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = def.pozlama || 0.95; r.outputColorSpace = THREE.SRGBColorSpace;
        kap.prepend(r.domElement); r.domElement.className = "sh-cv";
        const sahne = new THREE.Scene();
        { const env = doku(THREE, 512, 256, (x, w, h) => { const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, "#FFF8EA"); gg.addColorStop(0.45, "#E8D2AE"); gg.addColorStop(0.55, "#8A6A45"); gg.addColorStop(1, "#3E2A18"); x.fillStyle = gg; x.fillRect(0, 0, w, h); x.fillStyle = "#fff"; x.fillRect(w * 0.15, h * 0.12, w * 0.12, h * 0.22); x.fillRect(w * 0.62, h * 0.1, w * 0.18, h * 0.2); }); env.mapping = THREE.EquirectangularReflectionMapping; const pm = new THREE.PMREMGenerator(r); sahne.environment = pm.fromEquirectangular(env).texture; pm.dispose(); }
        const k = def.kamera || { poz: [0, 4, 11], bak: [0, 1.6, 0], fov: 36 };
        const kamera = new THREE.PerspectiveCamera(k.fov || 36, 16 / 9, 0.1, 200); kamera.position.set(...k.poz); kamera.lookAt(...k.bak);
        sahne.add(new THREE.HemisphereLight(0xfff4e0, 0x5a4630, 0.85));
        const gun = new THREE.DirectionalLight(0xfff1d6, 2.3); gun.position.set(-6, 12, 8); gun.castShadow = true; gun.shadow.mapSize.set(2048, 2048); Object.assign(gun.shadow.camera, { left: -14, right: 14, top: 12, bottom: -6, near: 1, far: 50 }); gun.shadow.bias = -0.0004; gun.shadow.radius = 4; sahne.add(gun);
        const c = { THREE, sahne, kamera, renderer: r, zaman: 0, D,
          doku: (w, h, fn) => doku(THREE, w, h, fn), sayiDoku: (...a) => sayiDoku(THREE, ...a),
          tahta: () => doku(THREE, 512, 512, (x, w, h) => { x.fillStyle = "#B07A45"; x.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { const y = Math.random() * h; x.strokeStyle = Math.random() < 0.5 ? "rgba(80,45,15,.18)" : "rgba(255,220,170,.12)"; x.lineWidth = 1 + Math.random() * 3; x.beginPath(); x.moveTo(0, y); for (let px = 0; px <= w; px += 16) x.lineTo(px, y + Math.sin(px / 60 + i) * 4); x.stroke(); } }),
          golge: (m) => { m.traverse ? m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }) : 0; return m; },
          kutla: () => { Sh.ses.dogru(); T.konfeti && T.konfeti(); },
        };
        (ORTAM[def.ortam || "masa"] || ORTAM.masa)(c);
        def.kur && def.kur(c);
        let R = null, grup = null, durum = "soru", deneme = 0;
        const yeni = () => {
          if (grup) { sahne.remove(grup); grup.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); [].concat(o.material).forEach((m) => { m.map && m.map.dispose(); m.dispose(); }); } }); }
          R = def.tur(L, c); grup = new THREE.Group(); sahne.add(grup); R.goster && R.goster(c, grup); durum = "soru"; deneme = 0; ciz();
        };
        const ciz = () => {
          afis.replaceChildren(T.h("div.tv-soru", durum === "soru" ? R.soru : durum === "dogru" ? (R.tebrik || "Doğru! ") + (R.aciklama || "") : durum === "yanlis" ? (R.ipucu || "Bir daha dene.") : "Doğrusu " + R.cevap + ". " + (R.aciklama || "")));
          Sh.skor(skor, D);
          alt.replaceChildren(...(durum === "soru" || durum === "yanlis" ? R.secenekler.map((v) => T.h("button.btn.big.c-chalk.d3-sec", { style: String(v).length > 6 ? { fontSize: "clamp(16px, 1.8vw, 26px)", minWidth: "0" } : null, disabled: R._elendi && R._elendi.includes(v) ? true : null, onclick: () => sec(v) }, String(v))) : [T.h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (D.takim) D.sira = 1 - D.sira; yeni(); } }, "Sonraki")]));
          ayar.replaceChildren(T.h("div.seg", (def.seviyeler || ["Kolay", "Orta", "Zor"]).map((l, kk) => T.h("button", { "aria-pressed": String(L === kk), onclick: () => { L = kk; yeni(); } }, l))),
            T.h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([kk, l]) => T.h("button", { "aria-pressed": String(D.takim === kk), onclick: () => { D.takim = kk; ciz(); } }, l))),
            T.h("div.spacer"), T.h("button.btn.sm.c-chalk", { onclick: () => { D.puan = [0, 0]; ciz(); } }, T.icon("reset"), "Skoru sıfırla"),
            T.h("button.btn.sm.c-chalk", { onclick: () => { try { (kap.requestFullscreen || kap.webkitRequestFullscreen).call(kap); } catch (e) {} } }, T.icon("full"), "Tam ekran"));
        };
        const sec = (v) => {
          if (durum !== "soru" && durum !== "yanlis") return; Sh.ac();
          if (String(v) === String(R.cevap)) { durum = "dogru"; if (deneme === 0) D.puan[D.takim ? D.sira : 0]++; c.kutla(); R.dogru && R.dogru(c, grup); }
          else { deneme++; Sh.ses.yanlis(); R._elendi = (R._elendi || []).concat(v); R.yanlis && R.yanlis(c, grup, v); durum = deneme >= (D.takim ? 1 : 2) ? "goster" : "yanlis"; if (durum === "goster") R.dogru && R.dogru(c, grup, true); }
          ciz();
        };
        r.domElement.addEventListener("pointerdown", (e) => { Sh.ac(); if (def.dokun && (durum === "soru" || durum === "yanlis")) { const b = r.domElement.getBoundingClientRect(); const v = def.dokun(c, grup, R, ((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); if (v != null) sec(v); } });
        let son = performance.now(), say = 0;
        const dongu = (z) => {
          if (!r.domElement.isConnected) { r.dispose(); return; }
          const dt = Math.min(0.05, (z - son) / 1000); son = z; c.zaman += dt;
          if (say++ % 20 === 0) { const b = kap.getBoundingClientRect(); if (b.width) { r.setSize(b.width, b.height, false); kamera.aspect = b.width / b.height; kamera.updateProjectionMatrix(); } }
          for (let kalan = dt; kalan > 1e-6; kalan -= 1 / 60) { const h = Math.min(1 / 60, kalan); def.adim && def.adim(c, grup, R, h, durum); R && R.adim && R.adim(c, grup, h, durum); }
          (c._kabarcik || []).forEach((b) => { b.position.y += dt * 0.8; if (b.position.y > 11) b.position.y = 0; }); (c._yosun || []).forEach((y, i) => (y.rotation.z = Math.sin(c.zaman * 1.1 + i) * 0.12));
          r.render(sahne, kamera); requestAnimationFrame(dongu);
        };
        yeni(); requestAnimationFrame((z) => { son = z; dongu(z); });
      }
    };
  };
})();
