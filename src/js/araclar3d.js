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

/* Trafik ışığı, isim çarkı, kum saati, ses ölçer: ortak 3B sahne kurucu. three.js açılmazsa eski çizim kalır. */
(function () {
  const W = T.widgets;
  const dokuYap = (THREE, w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const yuvKutu = (THREE, sx, sy, sz, rr) => {
    rr = Math.min(rr, sx / 2, sy / 2, sz / 2); const g = new THREE.BoxGeometry(sx, sy, sz, 8, 8, 8), p = g.attributes.position, v = new THREE.Vector3(), ust = new THREE.Vector3(sx / 2 - rr, sy / 2 - rr, sz / 2 - rr), alt = ust.clone().negate();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = v.clone().clamp(alt, ust), dv = v.clone().sub(k); if (dv.lengthSq() > 0) dv.setLength(rr); v.copy(k.add(dv)); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); return g;
  };
  const gelenler = (cls) => { const s = T.store.get(), a = (s.attendance[cls.id] || {})[T.isoDate()] || {}; return cls.students.filter((st) => a[st.id] !== "yok"); };
  const sahne3 = (kap, o, api) => (T.three ? T.three() : Promise.reject()).then((THREE) => {
    let r; try { r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.toneMapping = THREE.ACESFilmicToneMapping; r.outputColorSpace = THREE.SRGBColorSpace;
    kap.append(r.domElement); r.domElement.className = "zar3-cv";
    const sahne = new THREE.Scene(), kamera = new THREE.PerspectiveCamera(o.fov || 34, 1, 0.1, 80);
    kamera.position.set(...o.kamera); const bak = new THREE.Vector3(...o.bak); kamera.lookAt(bak);
    const e = o.env || ["#FFFFFF", "#C9D0DA", "#3C4350"];
    { const env = dokuYap(THREE, 256, 128, (x, ww, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, e[0]); g.addColorStop(0.5, e[1]); g.addColorStop(1, e[2]); x.fillStyle = g; x.fillRect(0, 0, ww, hh); x.fillStyle = "rgba(255,255,255,.9)"; x.fillRect(40, 18, 60, 22); x.fillRect(150, 22, 40, 16); }); env.mapping = THREE.EquirectangularReflectionMapping; const pm = new THREE.PMREMGenerator(r); sahne.environment = pm.fromEquirectangular(env).texture; pm.dispose(); }
    if (o.arka) sahne.background = dokuYap(THREE, 16, 256, (x, ww, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, o.arka[0]); g.addColorStop(1, o.arka[1]); x.fillStyle = g; x.fillRect(0, 0, ww, hh); });
    const c = { THREE, r, sahne, kamera, doku: (w, h, fn) => dokuYap(THREE, w, h, fn), kare: null, durdu: false };
    api && api.onDestroy && api.onDestroy(() => (c.durdu = true));
    let son = performance.now(), say = 0, goruldu = false;
    const dongu = (zm) => {
      const bagli = r.domElement.isConnected; if (bagli) goruldu = true;
      if (c.durdu || (!bagli && (goruldu || say > 300))) { r.dispose(); return; }
      const dt = Math.min(0.05, (zm - son) / 1000); son = zm;
      if (say++ % 15 === 0) { const b = kap.getBoundingClientRect(); if (b.width && b.height) { r.setSize(b.width, b.height, false); kamera.aspect = b.width / b.height; if (o.sigdir) { const yak = o.sigdir / Math.min(1, kamera.aspect / (o.oran || 1)); kamera.position.copy(bak).add(new THREE.Vector3(...o.kamera).sub(bak).setLength(yak)); kamera.lookAt(bak); } kamera.updateProjectionMatrix(); } }
      try { c.kare && c.kare(dt, zm / 1000); } catch (er) { console.error(er); }
      r.render(sahne, kamera); requestAnimationFrame(dongu);
    };
    requestAnimationFrame((zm) => { son = zm; dongu(zm); });
    return c;
  }).catch(() => null);
  const isikla = (c, guc = 1.6, poz = [4, 7, 8]) => { const { THREE, sahne } = c; sahne.add(new THREE.HemisphereLight(0xffffff, 0x3a3430, 0.7)); const g = new THREE.DirectionalLight(0xffffff, guc); g.position.set(...poz); sahne.add(g); return g; };
  const ahsapDoku = (c, a = "#B07A45", b = "#8A5A30") => c.doku(256, 256, (x, ww, hh) => { x.fillStyle = a; x.fillRect(0, 0, ww, hh); for (let i = 0; i < 70; i++) { x.strokeStyle = Math.random() < 0.5 ? b : "rgba(255,230,190,.25)"; x.globalAlpha = 0.25 + Math.random() * 0.4; x.lineWidth = 1 + Math.random() * 3; x.beginPath(); const y = Math.random() * hh; x.moveTo(0, y); x.bezierCurveTo(ww * 0.3, y + (Math.random() - 0.5) * 20, ww * 0.6, y + (Math.random() - 0.5) * 20, ww, y + (Math.random() - 0.5) * 10); x.stroke(); } x.globalAlpha = 1; });

  /* ---------- Trafik ışığı: yanan lambalı gerçek sinyal ---------- */
  if (W.traffic) {
    const eski = W.traffic.render; W.traffic.w = Math.max(W.traffic.w || 0, 240); W.traffic.h = Math.max(W.traffic.h || 0, 440);
    W.traffic.render = function (body, w, api) {
      const d = w.data, L = [["#FF3B2F", "Sessiz"], ["#FFB21E", "Fısıltı"], ["#2FD563", "Konuşabilirsin"]];
      const kap = T.h("div.zar3-kap.tr3-kap"), lbl = T.h("div.tr3-yazi"), sec = T.h("div.row", { style: { justifyContent: "center", gap: "8px" } });
      body.style.gridTemplateRows = "1fr auto auto"; body.style.gap = "6px"; body.append(kap, lbl, sec);
      const yak = (i) => { d.on = i; api.save(); T.sound.pop(); paint(); };
      function paint() { lbl.textContent = L[d.on][1]; lbl.style.color = L[d.on][0]; sec.replaceChildren(...L.map(([cc, ad], i) => T.h("button.tr3-dug", { "aria-label": ad, title: ad, "aria-pressed": String(i === d.on), style: { "--r": cc }, onclick: () => yak(i) }))); }
      paint();
      sahne3(kap, { kamera: [3.4, 1.4, 13.6], bak: [0, -0.2, 0], fov: 30, arka: ["#33465E", "#121821"], env: ["#FFFFFF", "#7E8796", "#14171D"], sigdir: 14.1, oran: 0.62 }, api).then((c) => {
        if (!c) { body.replaceChildren(); eski(body, w, api); return; }
        const { THREE, sahne } = c; isikla(c, 1.3, [5, 6, 9]);
        const kasaM = new THREE.MeshStandardMaterial({ color: 0x1b1f24, roughness: 0.42, metalness: 0.55 });
        sahne.add(new THREE.Mesh(yuvKutu(THREE, 2.1, 5.6, 1.2, 0.24), kasaM));
        const levha = new THREE.Mesh(yuvKutu(THREE, 3.0, 6.4, 0.12, 0.14), new THREE.MeshStandardMaterial({ color: 0x0e1013, roughness: 0.75 })); levha.position.z = -0.66; sahne.add(levha);
        const serit = new THREE.Mesh(yuvKutu(THREE, 3.22, 6.62, 0.08, 0.16), new THREE.MeshStandardMaterial({ color: 0xf3f3f3, roughness: 0.5 })); serit.position.z = -0.72; sahne.add(serit);
        const direk = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 9, 28), new THREE.MeshStandardMaterial({ color: 0x9aa1aa, metalness: 0.85, roughness: 0.3 })); direk.position.set(0, -7.4, -1.0); sahne.add(direk);
        const kelepce = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.5), kasaM); kelepce.position.set(0, -3.05, -0.9); sahne.add(kelepce);
        const parilti = c.doku(128, 128, (x) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.22, "rgba(255,255,255,.55)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
        const halka = c.doku(64, 512, (x, ww, hh) => { x.fillStyle = "#fff"; x.fillRect(0, 0, ww, hh); for (let y = 0; y < hh * 0.24; y += hh * 0.012) { x.fillStyle = "rgba(0,0,0,.16)"; x.fillRect(0, y, ww, hh * 0.004); } });
        const R = 0.94, TH = Math.PI * 0.22, merkezZ = 0.6 - R * Math.cos(TH);
        const lambalar = L.map(([cc], i) => {
          const y = 1.75 - i * 1.75, renk = new THREE.Color(cc);
          const yuva = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.07, 12, 48), new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 0.35, metalness: 0.7 })); yuva.position.set(0, y, 0.6); sahne.add(yuva);
          const ic = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), new THREE.MeshStandardMaterial({ color: 0x050505, emissive: renk, emissiveIntensity: 0 })); ic.position.set(0, y, 0.56); sahne.add(ic);
          const camM = new THREE.MeshPhysicalMaterial({ color: renk.clone().multiplyScalar(0.1), emissive: renk, emissiveIntensity: 0, emissiveMap: halka, map: halka, roughness: 0.12, envMapIntensity: 0.5, clearcoat: 1, clearcoatRoughness: 0.04, transparent: true, opacity: 0.94 });
          const cam = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 16, 0, Math.PI * 2, 0, TH), camM); cam.rotation.x = Math.PI / 2; cam.position.set(0, y, merkezZ); sahne.add(cam);
          const siper = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.85, 40, 1, true, Math.PI / 2 - 0.35, Math.PI + 0.7), new THREE.MeshStandardMaterial({ color: 0x15181c, roughness: 0.5, metalness: 0.5, side: THREE.DoubleSide })); siper.rotation.x = Math.PI / 2; siper.position.set(0, y, 1.02); sahne.add(siper);
          const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: parilti, color: renk, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })); spr.scale.setScalar(3.4); spr.position.set(0, y, 1.0); sahne.add(spr);
          const isik = new THREE.PointLight(renk, 0, 7, 1.6); isik.position.set(0, y - 0.2, 1.7); sahne.add(isik);
          return { cam, camM, ic, spr, isik, deger: d.on === i ? 1 : 0 };
        });
        c.kare = (dt) => lambalar.forEach((l, i) => { const h = i === d.on ? 1 : 0; l.deger += (h - l.deger) * Math.min(1, dt * 14); l.camM.emissiveIntensity = 0.02 + l.deger * 0.95; l.ic.material.emissiveIntensity = l.deger * 1.0; l.spr.material.opacity = l.deger * 0.55; l.isik.intensity = l.deger * 9; });
        const ray = new THREE.Raycaster(), nk = new THREE.Vector2();
        c.r.domElement.addEventListener("pointerdown", (e) => { const b = c.r.domElement.getBoundingClientRect(); nk.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); ray.setFromCamera(nk, c.kamera); const v = ray.intersectObjects(lambalar.map((l) => l.cam))[0]; if (v) yak(lambalar.findIndex((l) => l.cam === v.object)); });
        c.r.domElement.style.cursor = "pointer";
      });
    };
  }

  /* ---------- Ortak ahşap çark: T.cark3B(kap, api) → { kur(dilimler), cevir(i, bitti), donuyor } ---------- */
  const RENKLER = ["#E4553F", "#F2B33D", "#3FA36B", "#3B83C4", "#8C5BB8", "#E07AA0", "#2FA6A0", "#E58A3A"];
  T.cark3B = (kap, api, o = {}) => sahne3(kap, { kamera: [0, 0.4, 15], bak: [0, -0.4, 0], fov: 30, arka: o.arka || ["#F4E9D6", "#D8C3A2"], env: ["#FFFFFF", "#E8DCC8", "#6B5A48"], sigdir: 15, oran: 0.95 }, api).then((c) => {
    if (!c) return null;
    const { THREE, sahne } = c; isikla(c, 1.7, [3, 6, 10]);
    const R = 3.3, ahsap = ahsapDoku(c), koyu = ahsapDoku(c, "#6E4424", "#4A2A14");
    const cark = new THREE.Group(); sahne.add(cark);
    const govde = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.16, R + 0.16, 0.42, 96), new THREE.MeshStandardMaterial({ map: koyu, roughness: 0.5 })); govde.rotation.x = Math.PI / 2; cark.add(govde);
    const yuzM = new THREE.MeshStandardMaterial({ roughness: 0.48 }), yuz = new THREE.Mesh(new THREE.CircleGeometry(R, 120), yuzM); yuz.position.z = 0.215; cark.add(yuz);
    const pirinc = new THREE.MeshStandardMaterial({ color: 0xd4a648, metalness: 0.9, roughness: 0.25 });
    const jant = new THREE.Mesh(new THREE.TorusGeometry(R + 0.1, 0.1, 12, 120), pirinc); jant.position.z = 0.22; cark.add(jant);
    const gobek = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.3, 40), pirinc); gobek.rotation.x = Math.PI / 2; gobek.position.z = 0.36; sahne.add(gobek);
    const civiler = new THREE.Group(); cark.add(civiler);
    const ayak = new THREE.Mesh(new THREE.BoxGeometry(0.7, 5.2, 0.5), new THREE.MeshStandardMaterial({ map: ahsap, roughness: 0.6 })); ayak.position.set(0, -2.7, -0.55); sahne.add(ayak);
    const taban = new THREE.Mesh(yuvKutu(THREE, 4.6, 0.5, 2.0, 0.12), new THREE.MeshStandardMaterial({ map: koyu, roughness: 0.55 })); taban.position.set(0, -5.3, -0.2); sahne.add(taban);
    const sh = new THREE.Shape(); sh.moveTo(0, -0.6); sh.lineTo(0.4, 0.3); sh.quadraticCurveTo(0, 0.55, -0.4, 0.3); sh.closePath();
    const dil = new THREE.Group(); dil.position.set(0, R + 0.62, 0.42); dil.scale.setScalar(1.45); sahne.add(dil);
    dil.add(new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.16, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3 }), new THREE.MeshPhysicalMaterial({ color: 0xc8261b, roughness: 0.3, clearcoat: 1 })));
    const vida = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), pirinc); vida.position.set(0, 0.15, 0.22); dil.add(vida);
    let liste = [], doku = null, donus = null, flap = 0, sonDilim = -1;
    const ciz = () => {
      const n = Math.max(1, liste.length), s = (Math.PI * 2) / n, S = 1024, m = S / 2, rad = S / 2 - 4;
      doku && doku.dispose();
      doku = c.doku(S, S, (x) => {
        x.fillStyle = "#f3e7d2"; x.fillRect(0, 0, S, S);
        for (let i = 0; i < n; i++) { const a0 = i * s; x.beginPath(); x.moveTo(m, m); x.arc(m, m, rad, -a0, -(a0 + s), true); x.closePath(); x.fillStyle = (liste[i] && liste[i].renk) || RENKLER[(i + (n > 1 && n % RENKLER.length === 1 && i === n - 1 ? 1 : 0)) % RENKLER.length]; x.fill(); }
        for (let i = 0; i < 260; i++) { x.strokeStyle = Math.random() < 0.5 ? "rgba(0,0,0,.07)" : "rgba(255,255,255,.07)"; x.lineWidth = 1 + Math.random() * 2; x.beginPath(); x.arc(m, m, Math.random() * rad, 0, Math.PI * 2); x.stroke(); }
        if (n > 1) for (let i = 0; i < n; i++) { const a = -i * s; x.strokeStyle = "rgba(255,248,230,.9)"; x.lineWidth = 5; x.beginPath(); x.moveTo(m, m); x.lineTo(m + Math.cos(a) * rad, m + Math.sin(a) * rad); x.stroke(); }
        for (let i = 0; i < n; i++) { const ad2 = liste[i] ? liste[i].ad : "?"; let fs = Math.min(n <= 8 ? 96 : 76, rad * 0.55 * s * 0.9); x.font = `800 ${fs}px "Baloo 2", sans-serif`; while (fs > 14 && x.measureText(ad2).width > rad * 0.66) { fs -= 2; x.font = `800 ${fs}px "Baloo 2", sans-serif`; }
          x.save(); x.translate(m, m); x.rotate(-(i * s + s / 2)); x.textAlign = "right"; x.textBaseline = "middle"; x.fillStyle = "rgba(0,0,0,.25)"; x.fillText(ad2, rad * 0.9 + 2, 3); x.fillStyle = "#FFFFFF"; x.fillText(ad2, rad * 0.9, 0); x.restore(); }
        const g = x.createRadialGradient(m, m, rad * 0.6, m, m, rad); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.18)"); x.fillStyle = g; x.beginPath(); x.arc(m, m, rad, 0, Math.PI * 2); x.fill();
      });
      yuzM.map = doku; yuzM.needsUpdate = true;
      civiler.clear(); if (n > 1) for (let i = 0; i < n; i++) { const a = i * s, cv = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.26, 10), pirinc); cv.rotation.x = Math.PI / 2; cv.position.set(Math.cos(a) * (R - 0.14), Math.sin(a) * (R - 0.14), 0.34); civiler.add(cv); }
    };
    c.kare = (dt) => {
      if (donus) {
        donus.t += dt; const p = Math.min(1, donus.t / donus.sure), e2 = 1 - Math.pow(1 - p, 4);
        cark.rotation.z = donus.f0 + (donus.f1 - donus.f0) * e2;
        const s = (Math.PI * 2) / Math.max(1, liste.length), k = Math.floor((((Math.PI / 2 - cark.rotation.z) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / s);
        if (k !== sonDilim) { sonDilim = k; if (liste.length > 1) { flap = Math.min(0.6, flap + 0.35); T.sound.tick(); } }
        if (p >= 1) { const b = donus.bitti, i = donus.i; donus = null; b && b(i); }
      }
      flap *= Math.exp(-dt * 10); dil.rotation.z = flap;
    };
    return {
      r: c.r,
      donuyor: () => !!donus,
      kur(l) { if (donus) return; liste = l; ciz(); },
      cevir(wi, bitti) {
        if (donus) return; const s = (Math.PI * 2) / Math.max(1, liste.length);
        const f0 = cark.rotation.z % (Math.PI * 2); cark.rotation.z = f0;
        let f1 = Math.PI / 2 - (wi + 0.5) * s + (Math.random() - 0.5) * s * 0.6; while (f1 > f0 - Math.PI * 2 * 5) f1 -= Math.PI * 2;
        donus = { t: 0, sure: o.sure || 4.6 + Math.random() * 0.8, f0, f1, i: wi, bitti };
      },
    };
  });

  /* ---------- Yazılı zarlar (hikâye zarları): T.metinZar3B(kap, n, dokun) → { at(zarlar, hangi) } ---------- */
  T.metinZar3B = (kap, n, dokun) => sahne3(kap, { kamera: [0, 9.8, 3.4], bak: [0, 0, 0.2], fov: 34, env: ["#FFFFFF", "#D6DCE6", "#4A5260"], sigdir: 10.6, oran: 2.4 }, null).then((c) => {
    if (!c) return null;
    const { THREE, sahne } = c; c.r.shadowMap.enabled = true; c.r.shadowMap.type = THREE.PCFSoftShadowMap;
    sahne.add(new THREE.HemisphereLight(0xffffff, 0x334455, 0.8)); const gun = new THREE.DirectionalLight(0xffffff, 2.0); gun.position.set(-3, 10, 5); gun.castShadow = true; gun.shadow.mapSize.set(1024, 1024); Object.assign(gun.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6 }); sahne.add(gun);
    const kece = c.doku(256, 256, (x, ww, hh) => { x.fillStyle = "#5A3A7A"; x.fillRect(0, 0, ww, hh); for (let i = 0; i < 6000; i++) { x.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.08)"; x.fillRect(Math.random() * ww, Math.random() * hh, 1.5, 1.5); } }); kece.wrapS = kece.wrapT = THREE.RepeatWrapping; kece.repeat.set(5, 3);
    const zemin = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), new THREE.MeshStandardMaterial({ map: kece, roughness: 1 })); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
    const tahtaM = new THREE.MeshStandardMaterial({ map: ahsapDoku(c, "#7A4A26", "#5A3418"), roughness: 0.55 });
    [[0, -3.6, 14.4, 0.4], [0, 3.6, 14.4, 0.4], [-7.0, 0, 0.4, 6.8], [7.0, 0, 0.4, 6.8]].forEach(([x, z, sx, sz]) => { const k = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.5, sz), tahtaM); k.position.set(x, 0.25, z); k.castShadow = k.receiveShadow = true; sahne.add(k); });
    const geo = yuvKutu(THREE, 1, 1, 1, 0.12), BOY = 2.25, ARA = 3.1;
    const yuzDoku = (baslik, metin, renk) => c.doku(512, 512, (x, ww, hh) => {
      const g = x.createRadialGradient(ww * 0.4, hh * 0.35, 20, ww / 2, hh / 2, ww * 0.75); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#EFE9DE"); x.fillStyle = g; x.fillRect(0, 0, ww, hh);
      x.fillStyle = renk; x.fillRect(0, 0, ww, 92); x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle"; x.font = '800 54px "Baloo 2", sans-serif'; x.fillText(baslik, ww / 2, 50);
      const kel = metin.split(" "); let fs = 78, satir;
      const sar = () => { satir = []; let cur = ""; x.font = `800 ${fs}px "Baloo 2", sans-serif`; kel.forEach((k) => { const t = cur ? cur + " " + k : k; if (x.measureText(t).width > ww * 0.84 && cur) { satir.push(cur); cur = k; } else cur = t; }); satir.push(cur); };
      sar(); while (fs > 30 && (satir.length * fs * 1.08 > hh - 150 || satir.some((l) => x.measureText(l).width > ww * 0.9))) { fs -= 4; sar(); }
      x.fillStyle = "#1B2A4A"; const y0 = 92 + (hh - 92) / 2 - ((satir.length - 1) * fs * 1.08) / 2; satir.forEach((l, i) => x.fillText(l, ww / 2, y0 + i * fs * 1.08));
    });
    const zarlar = Array.from({ length: n }, (_, i) => { const m = new THREE.Mesh(geo, Array.from({ length: 6 }, () => new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6 }))); m.scale.setScalar(BOY); m.castShadow = true; m.position.set((i - (n - 1) / 2) * ARA, BOY / 2, 0); sahne.add(m); return { m, uc: null }; });
    c.kare = (dt) => zarlar.forEach((z) => { const u = z.uc; if (!u) return; u.t += dt; const p = Math.min(1, u.t / u.sure);
      const x = u.p0.x + (u.p1.x - u.p0.x) * (1 - Math.pow(1 - p, 2)), zz = u.p0.z + (u.p1.z - u.p0.z) * (1 - Math.pow(1 - p, 2));
      const zip = Math.abs(Math.sin(p * Math.PI * 2.5)) * (1 - p) * 2.4; z.m.position.set(x, BOY / 2 + zip + (1 - p) * (1 - p) * 2.5, zz);
      if (p < 0.8) { z.m.rotation.x += u.don.x * dt * (1 - p); z.m.rotation.y += u.don.y * dt * (1 - p); z.m.rotation.z += u.don.z * dt * (1 - p); } else z.m.quaternion.slerp(u.son, Math.min(1, dt * 12));
      if (p >= 1) { z.m.quaternion.copy(u.son); z.uc = null; } });
    const ray = new THREE.Raycaster(), nk = new THREE.Vector2();
    c.r.domElement.addEventListener("pointerdown", (e) => { const b = c.r.domElement.getBoundingClientRect(); nk.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); ray.setFromCamera(nk, c.kamera); const v = ray.intersectObjects(zarlar.map((z) => z.m))[0]; if (v && dokun) dokun(zarlar.findIndex((z) => z.m === v.object)); });
    c.r.domElement.style.cursor = "pointer";
    return {
      at(liste, hangi, ani = true) {
        (hangi || liste.map((_, i) => i)).forEach((i) => {
          const z = zarlar[i], L = liste[i]; if (!z || !L) return;
          const diger = T.shuffle(L.digerleri.filter((t) => t !== L.secilen)).slice(0, 5); while (diger.length < 5) diger.push(L.secilen);
          const yuzler = [diger[0], diger[1], L.secilen, diger[2], diger[3], diger[4]];
          z.m.material.forEach((mt, k) => { mt.map && mt.map.dispose(); mt.map = yuzDoku(L.baslik, yuzler[k], L.renk); mt.needsUpdate = true; });
          const son = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.25);
          if (!ani) { z.m.quaternion.copy(son); return; }
          z.uc = { t: 0, sure: 1.1 + Math.random() * 0.4, p0: new THREE.Vector3(-6 + Math.random(), 3.5, 2.5 - Math.random()), p1: new THREE.Vector3((i - (n - 1) / 2) * ARA + (Math.random() - 0.5) * 0.3, BOY / 2, (Math.random() - 0.5) * 0.6), don: new THREE.Vector3(Math.random() * 14 + 8, Math.random() * 10, Math.random() * 14 + 8), son };
        });
        if (ani) T.sound.drum();
      },
    };
  });

  /* ---------- İsim çek: dönen ahşap çark ---------- */
  if (W.name) {
    const eski = W.name.render; W.name.w = Math.max(W.name.w || 0, 420); W.name.h = Math.max(W.name.h || 0, 480);
    W.name.render = function (body, w, api) {
      const d = w.data;
      const kap = T.h("div.zar3-kap.cark3-kap"), ad = T.h("div.cark3-ad"), info = T.h("div.hint", { style: { textAlign: "center", fontSize: "13px" } });
      const fairBtn = T.h("button.btn.sm.c-chalk", { onclick: () => { d.fair = !d.fair; api.save(); yaz(); yeniden(); } });
      body.style.gridTemplateRows = "1fr auto auto auto"; body.style.gap = "6px";
      body.append(kap, ad, info, T.h("div.row", { style: { justifyContent: "center" } }, T.h("button.btn.c-grape", { onclick: () => cevir() }, T.icon("name"), "Çevir"), fairBtn, T.h("button.btn.sm.c-chalk", { onclick: () => { d.used = []; api.save(); yaz(); yeniden(); } }, "Baştan")));
      const havuz = () => { const p = gelenler(api.cls()); const kalan = p.filter((s) => !d.used.includes(s.id)); return d.fair ? (kalan.length ? kalan : p) : p; };
      function yaz() { const p = gelenler(api.cls()); info.textContent = d.fair ? `Bu turda ${p.length - p.filter((s) => d.used.includes(s.id)).length} / ${p.length} öğrenci kaldı` : `${p.length} öğrenci arasından`; fairBtn.textContent = d.fair ? "Adil tur: açık" : "Adil tur: kapalı"; }
      const cur = d.current && api.cls().students.find((s) => s.id === d.current); ad.textContent = cur ? cur.name : "Kim olacak?";
      let yeniden = () => {}, cevir = () => T.toast("Çark hazırlanıyor");
      yaz();
      T.cark3B(kap, api).then((ck) => {
        if (!ck) { body.replaceChildren(); eski(body, w, api); return; }
        let liste = [];
        const kur = () => { liste = havuz(); ck.kur(liste.map((st) => ({ ad: st.name }))); };
        yeniden = () => { if (!ck.donuyor()) kur(); };
        cevir = () => {
          if (ck.donuyor()) return; T.sound.unlock();
          const p = gelenler(api.cls()); if (!p.length) { T.toast("Sınıf listesi boş"); return; }
          if (d.fair && p.every((st) => d.used.includes(st.id))) d.used = [];
          kur(); yaz(); ad.textContent = "…";
          ck.cevir(T.rand(0, liste.length - 1), (i) => { const st = liste[i]; ad.textContent = st.name; ad.animate([{ transform: "scale(.7)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 420, easing: "ease-out" }); T.sound.ok(); d.current = st.id; if (d.fair && !d.used.includes(st.id)) d.used.push(st.id); api.save(); yaz(); });
        };
        kur(); ck.r.domElement.style.cursor = "pointer"; ck.r.domElement.addEventListener("click", () => cevir());
      });
    };
  }

  /* ---------- Zamanlayıcı: kumu akan kum saati ---------- */
  if (W.timer) {
    const eski = W.timer.render; W.timer.h = Math.max(W.timer.h || 0, 440); W.timer.w = Math.max(W.timer.w || 0, 340);
    W.timer.render = function (body, w, api) {
      const d = w.data;
      const kap = T.h("div.zar3-kap.kum3-kap"), txt = T.h("div.kum3-sure");
      const playBtn = T.h("button.btn.sm.c-leaf", { onclick: toggle });
      const presets = T.h("div.row", { style: { justifyContent: "center", gap: "6px" } }, [1, 3, 5, 10].map((m) => T.h("button.btn.sm.c-chalk", { onclick: () => setT(m * 60) }, m + " dk")));
      const ctl = T.h("div.row", { style: { justifyContent: "center", gap: "6px" } },
        T.h("button.btn.sm.icon.c-chalk", { "aria-label": "1 dakika azalt", onclick: () => setT(Math.max(10, d.total - 60)) }, T.icon("minus")), playBtn,
        T.h("button.btn.sm.icon.c-chalk", { "aria-label": "Sıfırla", onclick: () => setT(d.total) }, T.icon("reset")),
        T.h("button.btn.sm.icon.c-chalk", { "aria-label": "1 dakika ekle", onclick: () => setT(d.total + 60) }, T.icon("plus")));
      body.style.gridTemplateRows = "1fr auto auto auto"; body.style.gap = "6px"; body.append(kap, txt, presets, ctl);
      kap.addEventListener("click", toggle);
      function setT(sec) { d.total = sec; d.left = sec; d.running = false; api.save(); paint(); }
      function toggle() { T.sound.unlock(); if (d.running) { d.left = Math.max(0, (d.endAt - Date.now()) / 1000); d.running = false; } else { if (d.left <= 0) d.left = d.total; d.endAt = Date.now() + d.left * 1000; d.running = true; } api.save(); paint(); }
      const kalan = () => (d.running ? Math.max(0, (d.endAt - Date.now()) / 1000) : d.left);
      let rang = false;
      function paint() {
        const left = kalan();
        if (d.running && left <= 0) { d.running = false; d.left = 0; api.save(); if (!rang) { rang = true; T.sound.bell(); api.el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 400, iterations: 3 }); } }
        if (left > 0) rang = false;
        const s = Math.ceil(left); txt.textContent = `${Math.floor(s / 60)}:${T.pad(s % 60)}`; txt.style.color = left < 10 && left > 0 ? "var(--bad)" : "";
        playBtn.replaceChildren(T.icon(d.running ? "pause" : "play"), d.running ? "Durdur" : "Başlat");
      }
      const iv = setInterval(paint, 250); api.onDestroy(() => clearInterval(iv)); paint();
      sahne3(kap, { kamera: [0, 0.8, 12], bak: [0, 0, 0], fov: 32, arka: ["#F7F0E4", "#E2D1B6"], env: ["#FFFFFF", "#EDE3D3", "#7A6650"], sigdir: 12.9, oran: 0.8 }, api).then((c) => {
        if (!c) { body.replaceChildren(); eski(body, w, api); return; }
        const { THREE, sahne } = c; isikla(c, 1.8, [-4, 6, 8]);
        const H = 1.95, rIc = (y) => 0.085 + 1.06 * Math.sin(Math.min(1, Math.abs(y) / H) * Math.PI * 0.62);
        const saat = new THREE.Group(); saat.rotation.y = 0.3; sahne.add(saat);
        const camNok = []; for (let k = 0; k <= 48; k++) { const y = -H + (2 * H * k) / 48; camNok.push(new THREE.Vector2(rIc(y) + 0.045, y)); }
        const cam = new THREE.Mesh(new THREE.LatheGeometry(camNok, 56), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0.03, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 })); cam.renderOrder = 3; saat.add(cam);
        const kumDoku = c.doku(128, 128, (x) => { x.fillStyle = "#DDB062"; x.fillRect(0, 0, 128, 128); for (let i = 0; i < 2500; i++) { x.fillStyle = Math.random() < 0.5 ? "rgba(255,240,200,.35)" : "rgba(120,80,30,.25)"; x.fillRect(Math.random() * 128, Math.random() * 128, 1, 1); } });
        kumDoku.wrapS = kumDoku.wrapT = THREE.RepeatWrapping; kumDoku.repeat.set(3, 2);
        const kumM = new THREE.MeshStandardMaterial({ map: kumDoku, roughness: 1 });
        const ust = new THREE.Mesh(new THREE.BufferGeometry(), kumM), alt = new THREE.Mesh(new THREE.BufferGeometry(), kumM); saat.add(ust, alt);
        const akis = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 8), kumM); saat.add(akis);
        const ahsap = ahsapDoku(c, "#7A4A28", "#4E2C14"), ahM = new THREE.MeshStandardMaterial({ map: ahsap, roughness: 0.45, metalness: 0.05 });
        [H + 0.18, -H - 0.18].forEach((y) => { const k = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 56), ahM); k.position.y = y; saat.add(k); const k2 = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.4, 0.12, 48), ahM); k2.position.y = y > 0 ? y - 0.2 : y + 0.2; if (y < 0) k2.rotation.x = Math.PI; saat.add(k2); });
        const sutNok = []; for (let k = 0; k <= 30; k++) { const t = k / 30, y = -H + 2 * H * t; sutNok.push(new THREE.Vector2(0.075 + 0.04 * Math.pow(Math.sin(t * Math.PI * 5), 2) + (t < 0.06 || t > 0.94 ? 0.04 : 0), y)); }
        const sutG = new THREE.LatheGeometry(sutNok, 16);
        [0.5, 2.6, 4.7].forEach((a) => { const s = new THREE.Mesh(sutG, ahM); s.position.set(Math.cos(a) * 1.38, 0, Math.sin(a) * 1.38); saat.add(s); });
        let sonF = -1;
        const kur = (f) => {
          ust.geometry.dispose(); alt.geometry.dispose();
          if (f > 0.004) { const yT = 0.05 + (H - 0.12) * Math.pow(f, 0.72), nk = [new THREE.Vector2(0.0001, 0.02)]; for (let k = 0; k <= 16; k++) { const y = 0.02 + ((yT - 0.02) * k) / 16; nk.push(new THREE.Vector2(rIc(y) - 0.012, y)); } nk.push(new THREE.Vector2(rIc(yT) * 0.45, yT - 0.04), new THREE.Vector2(0.0001, yT - 0.1 * Math.min(1, f * 3))); ust.geometry = new THREE.LatheGeometry(nk, 48); ust.visible = true; } else ust.visible = false;
          const hA = (H - 0.25) * Math.pow(1 - f, 0.8);
          if (hA > 0.01) { const y0 = -H + 0.02, nk = [new THREE.Vector2(0.0001, y0)]; for (let k = 0; k <= 10; k++) { const y = y0 + (hA * 0.42 * k) / 10; nk.push(new THREE.Vector2(rIc(y) - 0.012, y)); } nk.push(new THREE.Vector2(0.0001, y0 + hA)); alt.geometry = new THREE.LatheGeometry(nk, 48); alt.visible = true; akis.userData.tepe = y0 + hA; } else { alt.visible = false; akis.userData.tepe = -H; }
        };
        c.kare = (dt, zm) => {
          const f = d.total ? Math.min(1, kalan() / d.total) : 0;
          if (Math.abs(f - sonF) > 0.002 || (f === 0 && sonF !== 0) || (f === 1 && sonF !== 1)) { kur(f); sonF = f; }
          const ak = d.running && f > 0.003; akis.visible = ak;
          if (ak) { const tepe = akis.userData.tepe, boy = 0.02 - tepe; akis.scale.set(0.8 + Math.sin(zm * 40) * 0.25, boy, 0.8 + Math.cos(zm * 37) * 0.25); akis.position.y = 0.02 - boy / 2; }
        };
      });
    };
  }

  /* ---------- Ses ölçer: ibreli analog gösterge ---------- */
  if (W.noise) {
    const eski = W.noise.render; W.noise.w = Math.max(W.noise.w || 0, 380); W.noise.h = Math.max(W.noise.h || 0, 380);
    W.noise.render = function (body, w, api) {
      const d = w.data; if (d.uyari === undefined) { d.uyari = true; d.sesli = true; }
      const kap = T.h("div.zar3-kap.vu3-kap"), yuz = T.h("div.vu3-yazi", "Mikrofonu aç");
      const slider = T.h("input", { type: "range", min: 20, max: 95, value: d.limit, "aria-label": "Ses sınırı", oninput: (e) => { d.limit = +e.target.value; api.save(); } });
      const startBtn = T.h("button.btn.sm.c-sky", { onclick: start }, T.icon("noise"), "Dinle");
      const sec = (k, l) => T.h("label.row", { style: { gap: "6px", fontSize: "14px", cursor: "pointer" } }, T.h("input", { type: "checkbox", checked: d[k] ? true : null, onchange: (e) => { d[k] = e.target.checked; api.save(); } }), l);
      body.style.gridTemplateRows = "1fr auto auto auto"; body.style.gap = "6px";
      body.append(kap, yuz, T.h("div.row", startBtn, T.h("label.f", { style: { flex: 1 } }, T.h("span", "Sınır"), slider)), T.h("div.row", { style: { gap: "14px" } }, sec("uyari", "Şşşş uyarısı"), sec("sesli", "Uyarı sesi")));
      let seviye = 0, yuksek = false, stream = null, raf = 0, over = 0, sonUyari = 0;
      async function start() {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const ctx = new (window.AudioContext || window.webkitAudioContext)(), an = ctx.createAnalyser(); an.fftSize = 512; ctx.createMediaStreamSource(stream).connect(an);
          const buf = new Uint8Array(an.fftSize); startBtn.disabled = true;
          const loop = () => {
            an.getByteTimeDomainData(buf); let sum = 0; for (const v of buf) sum += (v - 128) ** 2;
            seviye = T.clamp(Math.sqrt(sum / buf.length) * 2.4, 0, 100); yuksek = seviye > d.limit;
            over = yuksek ? over + 1 : Math.max(0, over - 2);
            if (over > 45 && d.uyari && Date.now() - sonUyari > 6000) { sonUyari = Date.now(); T.sssUyari(d.sesli); }
            yuz.textContent = over > 30 ? "Biraz sessizlik lütfen" : seviye > d.limit * 0.7 ? "Dikkat, ses yükseliyor" : "Harika gidiyoruz";
            raf = requestAnimationFrame(loop);
          };
          loop(); api.onDestroy(() => { cancelAnimationFrame(raf); stream && stream.getTracks().forEach((t) => t.stop()); ctx.close(); });
        } catch (e) { yuz.textContent = window.self !== window.top ? "Mikrofon bu önizlemede kapalı. Kendi sitende çalışır." : "Mikrofona izin verilmedi. Tarayıcı adres çubuğundan izin ver."; yuz.style.fontSize = "17px"; }
      }
      sahne3(kap, { kamera: [0.8, 0.6, 11], bak: [0, 0, 0], fov: 32, arka: ["#2F3B47", "#171D24"], env: ["#FFFFFF", "#B7BEC8", "#2A2F37"], sigdir: 8.6, oran: 1.35 }, api).then((c) => {
        if (!c) { body.replaceChildren(); eski(body, w, api); return; }
        const { THREE, sahne } = c; isikla(c, 1.6, [-3, 5, 9]);
        const ceviz = ahsapDoku(c, "#5E3A20", "#3A2210");
        sahne.add(new THREE.Mesh(yuvKutu(THREE, 4.8, 3.6, 1.2, 0.26), new THREE.MeshStandardMaterial({ map: ceviz, roughness: 0.42 })));
        const cer = new THREE.Mesh(yuvKutu(THREE, 4.25, 2.82, 0.2, 0.08), new THREE.MeshStandardMaterial({ color: 0xc9ccd1, metalness: 0.9, roughness: 0.25 })); cer.position.set(0, 0.25, 0.52); sahne.add(cer);
        const FW = 4.0, FH = 2.6, CW = 1024, CH = Math.round((CW * FH) / FW), PX = CW / 2, PY = CH - 70, AR = 440, DEG = Math.PI / 180;
        const kadran = c.doku(CW, CH, (x) => {
          const g = x.createLinearGradient(0, 0, 0, CH); g.addColorStop(0, "#FBF4DF"); g.addColorStop(1, "#EADBB8"); x.fillStyle = g; x.fillRect(0, 0, CW, CH);
          const yay = (a, b, renk, lw, rr) => { x.strokeStyle = renk; x.lineWidth = lw; x.beginPath(); x.arc(PX, PY, rr, -Math.PI / 2 + (a - 50) * DEG, -Math.PI / 2 + (b - 50) * DEG); x.stroke(); };
          yay(0, 60, "#3FA35B", 26, AR - 30); yay(60, 80, "#E8A92A", 26, AR - 30); yay(80, 100, "#D8382C", 26, AR - 30); yay(0, 100, "#2A2420", 4, AR);
          x.fillStyle = "#2A2420"; x.textAlign = "center"; x.textBaseline = "middle";
          for (let v = 0; v <= 100; v += 5) { const a = -Math.PI / 2 + (v - 50) * DEG, uz = v % 10 === 0 ? 34 : 18; x.lineWidth = v % 10 === 0 ? 6 : 3; x.beginPath(); x.moveTo(PX + Math.cos(a) * AR, PY + Math.sin(a) * AR); x.lineTo(PX + Math.cos(a) * (AR + uz), PY + Math.sin(a) * (AR + uz)); x.stroke(); if (v % 20 === 0) { x.font = '700 50px "Baloo 2", sans-serif'; x.fillText(String(v), PX + Math.cos(a) * (AR + 72), PY + Math.sin(a) * (AR + 72)); } }
          x.font = '800 76px "Baloo 2", sans-serif'; x.fillStyle = "#4A3E34"; x.fillText("Sınıf sesi", PX, PY - 200);
          x.font = '700 48px "Baloo 2", sans-serif'; x.fillStyle = "#3FA35B"; x.fillText("sakin", PX - 290, PY - 50); x.fillStyle = "#D8382C"; x.fillText("yüksek", PX + 290, PY - 50);
        });
        const kadranM = new THREE.Mesh(new THREE.PlaneGeometry(FW, FH), new THREE.MeshStandardMaterial({ map: kadran, roughness: 0.7 })); kadranM.position.set(0, 0.25, 0.64); sahne.add(kadranM);
        const pivotY = 0.25 + FH / 2 - (PY / CH) * FH, olc = FW / CW;
        const ibre = new THREE.Group(); ibre.position.set(0, pivotY, 0.68); sahne.add(ibre);
        const ig = new THREE.BoxGeometry(0.055, AR * olc * 1.02, 0.025); ig.translate(0, (AR * olc * 1.02) / 2, 0);
        ibre.add(new THREE.Mesh(ig, new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4 })));
        const kapak = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 })); kapak.rotation.x = Math.PI / 2; kapak.position.set(0, pivotY, 0.7); sahne.add(kapak);
        const sinir = new THREE.Group(); sinir.position.copy(ibre.position); sahne.add(sinir);
        const sk = new THREE.Shape(); sk.moveTo(0, 0); sk.lineTo(0.1, 0.18); sk.lineTo(-0.1, 0.18); sk.closePath();
        const isaret = new THREE.Mesh(new THREE.ShapeGeometry(sk), new THREE.MeshBasicMaterial({ color: 0xd8382c })); isaret.position.set(0, (AR + 40) * olc, 0.0); sinir.add(isaret);
        const cam = new THREE.Mesh(new THREE.PlaneGeometry(FW, FH), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.02, clearcoat: 1, depthWrite: false, envMapIntensity: 2 })); cam.position.set(0, 0.25, 0.74); sahne.add(cam);
        const lambaM = new THREE.MeshPhysicalMaterial({ color: 0x501010, emissive: 0xff2a1a, emissiveIntensity: 0, roughness: 0.15, clearcoat: 1 });
        const lamba = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), lambaM); lamba.position.set(1.85, -1.45, 0.6); sahne.add(lamba);
        const lambaIsik = new THREE.PointLight(0xff2a1a, 0, 3); lambaIsik.position.set(1.85, -1.3, 1.1); sahne.add(lambaIsik);
        let konum = 0, hiz = 0, parla = 0;
        c.kare = (dt) => {
          for (let i = 0; i < 4; i++) { const h2 = dt / 4; hiz += ((seviye - konum) * 160 - hiz * 16) * h2; konum += hiz * h2; }
          konum = T.clamp(konum, -2, 102); ibre.rotation.z = (50 - konum) * DEG; sinir.rotation.z = (50 - d.limit) * DEG;
          parla += ((yuksek ? 1 : 0) - parla) * Math.min(1, dt * 10); lambaM.emissiveIntensity = parla * 3; lambaIsik.intensity = parla * 4;
        };
      });
    };
  }

  /* ---------- Grup oluştur: mantar panoya iğnelenmiş kartlar ---------- */
  if (W.groups) {
    const TON = ["#E4553F", "#F2B33D", "#3B83C4", "#3FA36B", "#8C5BB8", "#E07AA0"];
    W.groups.h = Math.max(W.groups.h || 0, 470);
    W.groups.render = function (body, w, api) {
      const d = w.data;
      const pano = T.h("div.gr3-pano"), nLbl = T.h("span.readout", { style: { fontSize: "20px", minWidth: "30px", textAlign: "center" } });
      body.style.gridTemplateRows = "auto 1fr"; body.style.gap = "10px";
      body.append(T.h("div.row", { style: { gap: "6px" } },
        T.h("div.seg", ["size", "count"].map((m) => T.h("button", { "aria-pressed": String(d.mode === m), onclick: () => { d.mode = m; api.rerender(); api.save(); } }, m === "size" ? "Grup başına" : "Grup sayısı"))),
        T.h("button.btn.sm.icon.c-chalk", { "aria-label": "Azalt", onclick: () => { d.n = Math.max(2, d.n - 1); paint(); } }, T.icon("minus")), nLbl,
        T.h("button.btn.sm.icon.c-chalk", { "aria-label": "Artır", onclick: () => { d.n = Math.min(12, d.n + 1); paint(); } }, T.icon("plus")),
        T.h("div.spacer"), T.h("button.btn.sm.c-leaf", { onclick: make }, T.icon("groups"), "Grupla")), pano);
      function make() {
        const p = T.shuffle(gelenler(api.cls())), k = d.mode === "size" ? Math.max(1, Math.ceil(p.length / d.n)) : d.n, gs = Array.from({ length: k }, () => []);
        p.forEach((s, i) => gs[i % k].push(s.id)); d.groups = gs; d.aci = gs.map(() => +(Math.random() * 4 - 2).toFixed(1)); api.save(); T.sound.ok(); paint(true);
      }
      function paint(anim) {
        nLbl.textContent = String(d.n); const cls = api.cls();
        pano.replaceChildren(...d.groups.map((g, i) => { const kart = T.h("div.gr3-kart", { style: { "--r": ((d.aci && d.aci[i]) || 0) + "deg", "--c": TON[i % TON.length] } }, T.h("i.gr3-pim"),
          T.h("div.gr3-bas", (i + 1) + ". grup"), g.map((id) => { const s = cls.students.find((x) => x.id === id); return s ? T.h("div.gr3-ad", s.name) : null; }));
          if (anim) kart.animate([{ transform: `translateY(-40px) rotate(${(d.aci && d.aci[i]) || 0}deg)`, opacity: 0 }, { transform: `translateY(0) rotate(${(d.aci && d.aci[i]) || 0}deg)`, opacity: 1 }], { duration: 380, delay: i * 70, easing: "cubic-bezier(.2,1.3,.4,1)", fill: "backwards" });
          return kart; }));
        if (!d.groups.length) pano.append(T.h("div.gr3-bos", "Grupla düğmesine bas. Gelmeyenler gruplara girmez."));
      }
      paint();
    };
  }
})();
