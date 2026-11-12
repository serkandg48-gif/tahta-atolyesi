/* Sınıf araçlarının 3B hâlleri: zar (keçe tepside yuvarlanan gerçek zarlar). three.js açılmazsa eski çizim kalır. */
(function () {
  const W = T.widgets, eski = W.dice && W.dice.render;
  if (!W.dice) return;
  const dokuYap = (THREE, w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const NOKTA = { 1: [[0.5, 0.5]], 2: [[0.27, 0.27], [0.73, 0.73]], 3: [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]], 4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], 5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]], 6: [[0.27, 0.25], [0.73, 0.25], [0.27, 0.5], [0.73, 0.5], [0.27, 0.75], [0.73, 0.75]] };
  const YUZ = [3, 4, 1, 6, 2, 5]; /* +x, -x, +y, -y, +z, -z */
  const RENK = [["#FFFFFF", "#E9ECF1", "#16181D"], ["#FFE38A", "#E9C24E", "#2A1A08"], ["#CFE9FB", "#93C6EA", "#0E2A44"], ["#E0453B", "#B5281F", "#FFFFFF"]];
  W.dice.w = Math.max(W.dice.w || 0, 460); W.dice.h = Math.max(W.dice.h || 0, 360);
  W.dice.render = function (body, w, api) {
    const d = w.data; body.style.gridTemplateRows = "1fr auto auto"; body.style.gap = "6px";
    const kap = T.h("div.zar3-kap"), sum = T.h("div.hint", { style: { textAlign: "center", fontSize: "16px", fontWeight: 700 } });
    body.append(kap, sum, T.h("div.row", { style: { justifyContent: "center" } }, T.h("button.btn.c-sun", { onclick: () => at() }, T.icon("dice"), "At"),
      [1, 2, 3, 4].map((n) => T.h("button.btn.sm.c-chalk", { "aria-pressed": String(d.n === n), onclick: (e) => { d.n = n; d.vals = Array.from({ length: n }, () => T.rand(1, 6)); api.save(); e.target.parentNode.querySelectorAll(".btn.sm").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); kur3 && kur3(); } }, n))));
    const toplamYaz = () => (sum.textContent = d.n > 1 ? "Toplam: " + d.vals.reduce((a, b) => a + b, 0) : "");
    let kur3 = null, at = () => {};
    if (!T.three) { eski && (body.replaceChildren(), eski(body, w, api)); return; }
    T.three().then((THREE) => {
      let r; try { r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { body.replaceChildren(); eski && eski(body, w, api); return; }
      r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMapping = THREE.ACESFilmicToneMapping; r.outputColorSpace = THREE.SRGBColorSpace;
      kap.append(r.domElement); r.domElement.className = "zar3-cv";
      const sahne = new THREE.Scene(), kamera = new THREE.PerspectiveCamera(35, 1.6, 0.1, 50); kamera.position.set(0, 7.2, 4.4); kamera.lookAt(0, 0, 0.2);
      { const env = dokuYap(THREE, 256, 128, (x, ww, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, "#FFFFFF"); g.addColorStop(0.5, "#D6DCE6"); g.addColorStop(1, "#4A5260"); x.fillStyle = g; x.fillRect(0, 0, ww, hh); }); env.mapping = THREE.EquirectangularReflectionMapping; const pm = new THREE.PMREMGenerator(r); sahne.environment = pm.fromEquirectangular(env).texture; pm.dispose(); }
      sahne.add(new THREE.HemisphereLight(0xffffff, 0x334455, 0.8)); const gun = new THREE.DirectionalLight(0xffffff, 2.2); gun.position.set(-3, 9, 4); gun.castShadow = true; gun.shadow.mapSize.set(1024, 1024); Object.assign(gun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 }); sahne.add(gun);
      /* keçe tepsi */
      const kece = dokuYap(THREE, 256, 256, (x, ww, hh) => { x.fillStyle = "#1E6B45"; x.fillRect(0, 0, ww, hh); for (let i = 0; i < 6000; i++) { x.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.08)"; x.fillRect(Math.random() * ww, Math.random() * hh, 1.5, 1.5); } }); kece.wrapS = kece.wrapT = THREE.RepeatWrapping; kece.repeat.set(4, 3);
      const zemin = new THREE.Mesh(new THREE.PlaneGeometry(11, 7.5), new THREE.MeshStandardMaterial({ map: kece, roughness: 1 })); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
      const tahtaM = new THREE.MeshStandardMaterial({ color: 0x7a4a26, roughness: 0.55 });
      [[0, -3.85, 11.4, 0.4], [0, 3.85, 11.4, 0.4], [-5.6, 0, 0.4, 7.3], [5.6, 0, 0.4, 7.3]].forEach(([x, z, sx, sz]) => { const k = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.5, sz), tahtaM); k.position.set(x, 0.25, z); k.castShadow = k.receiveShadow = true; sahne.add(k); });
      const malzeme = {}; const yuzler = (ri) => malzeme[ri] || (malzeme[ri] = YUZ.map((v) => new THREE.MeshPhysicalMaterial({ roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, map: dokuYap(THREE, 256, 256, (x, ww, hh) => { const [a, b, nk] = RENK[ri]; const g = x.createRadialGradient(ww * 0.4, hh * 0.35, 10, ww / 2, hh / 2, ww * 0.7); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, ww, hh); NOKTA[v].forEach(([px, py]) => { const gg = x.createRadialGradient(px * ww - 4, py * hh - 4, 1, px * ww, py * hh, 24); gg.addColorStop(0, nk === "#FFFFFF" ? "#FFFFFF" : "#3A3D45"); gg.addColorStop(1, nk); x.fillStyle = gg; x.beginPath(); x.arc(px * ww, py * hh, v === 1 && ri === 3 ? 34 : 24, 0, Math.PI * 2); x.fill(); }); }) })));
      /* yuvarlatılmış küp: kenarları yumuşatılmış kutu */
      const kupGeo = (() => { const g = new THREE.BoxGeometry(1, 1, 1, 6, 6, 6), p = g.attributes.position, v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = v.clone().clampScalar(-0.38, 0.38); const dv = v.clone().sub(k); if (dv.length() > 0) dv.setLength(0.12); v.copy(k.add(dv)); p.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals(); return g; })();
      const HEDEF = { 1: new THREE.Euler(0, 0, 0), 6: new THREE.Euler(Math.PI, 0, 0), 2: new THREE.Euler(-Math.PI / 2, 0, 0), 5: new THREE.Euler(Math.PI / 2, 0, 0), 3: new THREE.Euler(0, 0, Math.PI / 2), 4: new THREE.Euler(0, 0, -Math.PI / 2) };
      let zarlar = [];
      kur3 = () => { zarlar.forEach((z) => sahne.remove(z.m)); zarlar = d.vals.slice(0, d.n).map((v, i) => { const m = new THREE.Mesh(kupGeo, yuzler(i % 4)); m.scale.setScalar(1.55); m.castShadow = true; m.position.set((i - (d.n - 1) / 2) * 2.2, 0.78, 0); const q = new THREE.Quaternion().setFromEuler(HEDEF[v]); m.quaternion.copy(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.8).multiply(q)); sahne.add(m); return { m, v, uc: null }; }); toplamYaz(); };
      at = () => {
        T.Sahne && T.Sahne.ac && T.Sahne.ac(); d.vals = Array.from({ length: d.n }, () => T.rand(1, 6)); api.save(); if (zarlar.length !== d.n) kur3();
        zarlar.forEach((z, i) => { z.v = d.vals[i]; z.uc = { t: 0, sure: 1.1 + Math.random() * 0.4, p0: new THREE.Vector3(-4.2 + Math.random(), 3.5, 2.5 - Math.random()), p1: new THREE.Vector3((i - (d.n - 1) / 2) * 2.2 + (Math.random() - 0.5) * 0.6, 0.78, (Math.random() - 0.5) * 1.2), don: new THREE.Vector3(Math.random() * 14 + 8, Math.random() * 10, Math.random() * 14 + 8), son: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 1.2).multiply(new THREE.Quaternion().setFromEuler(HEDEF[z.v])) }; });
        sum.textContent = ""; T.sound && T.sound.drum && T.sound.drum();
      };
      kur3();
      let son = performance.now(), say = 0, tak = 0;
      const dongu = (zm) => {
        if (!r.domElement.isConnected) { r.dispose(); return; }
        const dt = Math.min(0.05, (zm - son) / 1000); son = zm;
        if (say++ % 15 === 0) { const b = kap.getBoundingClientRect(); if (b.width && b.height) { r.setSize(b.width, b.height, false); kamera.aspect = b.width / b.height; kamera.updateProjectionMatrix(); } }
        let biten = 0;
        zarlar.forEach((z) => { const u = z.uc; if (!u) { biten++; return; } u.t += dt; const p = Math.min(1, u.t / u.sure);
          const x = u.p0.x + (u.p1.x - u.p0.x) * (1 - Math.pow(1 - p, 2)), zz = u.p0.z + (u.p1.z - u.p0.z) * (1 - Math.pow(1 - p, 2));
          const zip = Math.abs(Math.sin(p * Math.PI * 2.5)) * (1 - p) * 2.6; z.m.position.set(x, 0.78 + zip + (1 - p) * (1 - p) * 2.5, zz);
          if (p < 0.8) { z.m.rotation.x += u.don.x * dt * (1 - p); z.m.rotation.y += u.don.y * dt * (1 - p); z.m.rotation.z += u.don.z * dt * (1 - p); }
          else z.m.quaternion.slerp(u.son, Math.min(1, dt * 12));
          if (zip < 0.05 && p > 0.15 && tak <= 0) { T.Sahne && T.Sahne.ton && T.Sahne.ton(900 + Math.random() * 300, 600, 0.05, "square", 0.04); tak = 0.12; }
          if (p >= 1) { z.m.quaternion.copy(u.son); z.uc = null; } });
        tak -= dt; if (biten === zarlar.length && !sum.textContent) toplamYaz();
        r.render(sahne, kamera); requestAnimationFrame(dongu);
      };
      requestAnimationFrame((zm) => { son = zm; dongu(zm); });
    });
  };
})();
