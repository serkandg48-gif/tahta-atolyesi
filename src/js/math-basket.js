/* Basamak basketbolu: 3B onluk taban bloklarının gösterdiği sayıyı bul, o sayının yazılı olduğu topu potaya at.
   Sahne three.js ile çizilir (T.sahne3). Pota solda, bloklar sağda, üç top önde. */
(function () {
  const { h } = T;
  T.IKON3D && T.IKON3D.add("basket");
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const karistir = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const SEVIYE = [[19, "19'a kadar", "#7A3FD1"], [29, "29'a kadar", "#2F7FE0"], [49, "49'a kadar", "#2FA84F"], [99, "99'a kadar", "#E0A21E"], [999, "999'a kadar", "#D9433A"]];

  function sayiSec(ust) { return ust === 999 ? rnd(100, 999) : rnd(ust > 19 ? 10 : 1, ust); }
  function celdiriciler(n, ust) {
    const s = String(n), aday = [];
    if (s.length > 1) { const ters = +s.split("").reverse().join(""); aday.push(ters); }
    if (s.length === 3) aday.push(+(s[0] + s[2] + s[1]), +(s[1] + s[0] + s[2]));
    aday.push(n + 10, n - 10, n + 1, n - 1);
    if (ust === 999) aday.push(n + 100, n - 100);
    const alt = ust === 999 ? 100 : 1;
    const temiz = [...new Set(aday)].filter((x) => x !== n && x >= alt && x <= ust);
    const sonuc = [];
    if (s.length > 1 && temiz[0] === aday[0]) sonuc.push(temiz[0]);
    karistir(temiz.filter((x) => !sonuc.includes(x))).forEach((x) => { if (sonuc.length < 2) sonuc.push(x); });
    while (sonuc.length < 2) { const x = rnd(alt, ust); if (x !== n && !sonuc.includes(x)) sonuc.push(x); }
    return sonuc;
  }

  T.tools["oyun-basamak-basket"] = {
    cat: "oyun", ilk: 0, tone: "sun", title: "Basamak basketbolu", icon: "basket", grades: [1, 4],
    short: "Blokların gösterdiği sayıyı bul, doğru topu potaya at",
    render(host, api) {
      const kap = h("div.ks-kap.mb-kap"), yuk = h("div.ot3-yuk", h("div.ot3-yuk-ic"), "Saha hazırlanıyor...");
      const puanEl = h("div.mb-puan"), balon = h("div.mb-balon"), menu = h("div.mb-menu");
      const ust = h("div.mb-ust",
        h("button.mb-dug", { onclick: () => menuAc() }, T.icon("grid"), "Seviye"),
        puanEl,
        h("button.mb-dug", { onclick: () => tamEkran() }, T.icon("full"), "Tam ekran"));
      const sahneEl = h("div.ks-sahne.mb-sahne", kap, ust, balon, menu, yuk);
      host.append(sahneEl);
      const tamEkran = () => { try { document.fullscreenElement ? document.exitFullscreen() : (sahneEl.requestFullscreen || sahneEl.webkitRequestFullscreen).call(sahneEl); } catch (e) { T.toast && T.toast("Bu ortamda tam ekran kapalı"); } };
      let seviye = null, soru = 0, dogru = 0, hedef = 0, denendi = false, kilit = true, c = null;
      const puanYaz = () => (puanEl.textContent = "Puan: " + dogru + " / " + soru);
      let balonZ = 0;
      const balonGoster = (t, iyi) => { balon.textContent = t; balon.className = "mb-balon acik" + (iyi ? " iyi" : " uyari"); clearTimeout(balonZ); balonZ = setTimeout(() => (balon.className = "mb-balon"), 1400); };

      function menuAc() {
        kilit = true;
        menu.replaceChildren(h("div.mb-menu-ic", h("b", "Basamak basketbolu"), h("p", "Oyunu seç:"),
          SEVIYE.map(([u, l, r]) => h("button.mb-sev", { style: { "--r": r }, onclick: () => { seviye = u; soru = 0; dogru = 0; puanYaz(); menu.classList.remove("acik"); yeniSoru(); } }, l))));
        menu.classList.add("acik");
      }

      T.sahne3(kap, { kamera: [0, 2.8, 10], bak: [0, 2.15, 0], fov: 40, env: ["#FFFFFF", "#BFD9F2", "#2A4A70"], sigdir: 10.05, oran: 1.78 }, api).then((cc) => {
        if (!cc) { yuk.textContent = "Bu cihazda 3B çizim açılamadı."; return; }
        c = cc; kur(); yuk.remove(); menuAc();
      });

      /* ---------- sahne ---------- */
      let THREE, sahne, cember, file, bloklar, kursu, toplar = [], ucan = [], fileSalla = 0;
      const RIM = { x: -4.0, y: 3.6, z: -0.3 }, TOP_R = 0.38, BASLA = [[-2.3, 2.6], [-0.5, 2.8], [1.3, 2.6]];
      function kur() {
        THREE = c.THREE; sahne = c.sahne; const r = c.r;
        r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMappingExposure = 1.05;
        const duvarD = c.doku(512, 512, (x, w, hh) => { const g = x.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, "#3C9BF0"); g.addColorStop(1, "#1F67C9"); x.fillStyle = g; x.fillRect(0, 0, w, hh); x.fillStyle = "rgba(255,255,255,.05)"; for (let i = 0; i < w; i += 64) x.fillRect(i, 0, 30, hh); });
        const duvar = new THREE.Mesh(new THREE.PlaneGeometry(40, 16), new THREE.MeshStandardMaterial({ map: duvarD, roughness: 0.95 })); duvar.position.set(0, 6, -3); duvar.receiveShadow = true; sahne.add(duvar);
        const zeminD = c.doku(1024, 1024, (x, w) => { for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? "#E2AE6C" : "#EDBD7E"; x.fillRect(0, i * w / 16, w, w / 16); } x.strokeStyle = "rgba(120,70,20,.18)"; x.lineWidth = 2; for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) { const xx = ((j * 260 + i * 97) % w); x.beginPath(); x.moveTo(xx, i * w / 16); x.lineTo(xx, (i + 1) * w / 16); x.stroke(); } });
        const zemin = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), new THREE.MeshStandardMaterial({ map: zeminD, roughness: 0.55 })); zemin.rotation.x = -Math.PI / 2; zemin.position.z = 5; zemin.receiveShadow = true; sahne.add(zemin);
        const serit = new THREE.Mesh(new THREE.PlaneGeometry(40, 0.5), new THREE.MeshStandardMaterial({ color: 0x3DBE4F, roughness: 0.7 })); serit.rotation.x = -Math.PI / 2; serit.position.set(0, 0.005, -2.4); sahne.add(serit);
        const cizgiM = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const yay = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.7, 64, 1, -Math.PI / 2, Math.PI), cizgiM); yay.rotation.x = -Math.PI / 2; yay.position.set(-4.0, 0.006, -1.4); sahne.add(yay);
        const orta = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.4, 64), cizgiM); orta.rotation.x = -Math.PI / 2; orta.position.set(2.6, 0.006, 1.6); sahne.add(orta);
        sahne.add(new THREE.HemisphereLight(0xffffff, 0x8a6a40, 1.0));
        const gun = new THREE.DirectionalLight(0xffffff, 2.2); gun.position.set(3, 9, 7); gun.castShadow = true; gun.shadow.mapSize.set(2048, 2048); Object.assign(gun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -4 }); gun.shadow.bias = -0.0004; sahne.add(gun);
        /* pota */
        const direk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.2, 20), new THREE.MeshStandardMaterial({ color: 0x8C96A3, metalness: 0.8, roughness: 0.35 })); direk.position.set(RIM.x, 2.6, -2.2); direk.castShadow = true; sahne.add(direk);
        const kol = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 1.2), direk.material); kol.position.set(RIM.x, 4.3, -1.6); sahne.add(kol);
        const panoD = c.doku(512, 340, (x, w, hh) => { x.fillStyle = "#FFFFFF"; x.fillRect(0, 0, w, hh); x.strokeStyle = "#D9433A"; x.lineWidth = 14; x.strokeRect(10, 10, w - 20, hh - 20); x.strokeRect(w * 0.34, hh * 0.46, w * 0.32, hh * 0.38); });
        const pano = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.55, 0.08), [0, 0, 0, 0, 1, 0].map((i) => i ? new THREE.MeshStandardMaterial({ map: panoD, roughness: 0.3 }) : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })));
        pano.position.set(RIM.x, RIM.y + 0.55, -1.0); pano.castShadow = true; sahne.add(pano);
        cember = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 14, 48), new THREE.MeshStandardMaterial({ color: 0xF26A1B, metalness: 0.4, roughness: 0.35 })); cember.rotation.x = Math.PI / 2; cember.position.set(RIM.x, RIM.y, RIM.z); cember.castShadow = true; sahne.add(cember);
        const tut = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.25), cember.material); tut.position.set(RIM.x, RIM.y, -0.88); sahne.add(tut);
        const fileD = c.doku(256, 128, (x, w, hh) => { x.clearRect(0, 0, w, hh); x.strokeStyle = "#FFFFFF"; x.lineWidth = 4; for (let i = -hh; i < w; i += 22) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + hh, hh); x.stroke(); x.beginPath(); x.moveTo(i + hh, 0); x.lineTo(i, hh); x.stroke(); } });
        fileD.wrapS = THREE.RepeatWrapping; fileD.repeat.set(3, 1);
        file = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.32, 0.75, 32, 1, true), new THREE.MeshStandardMaterial({ map: fileD, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9 }));
        file.position.set(RIM.x, RIM.y - 0.38, RIM.z); sahne.add(file);
        bloklar = new THREE.Group(); sahne.add(bloklar);
        /* blokların durduğu kürsü */
        kursu = new THREE.Group(); sahne.add(kursu);
        const ayak = new THREE.Mesh(new THREE.BoxGeometry(1, 1.3, 1.1), new THREE.MeshStandardMaterial({ color: 0xF4F6FA, roughness: 0.6 })); ayak.position.y = 0.65; ayak.castShadow = ayak.receiveShadow = true; kursu.add(ayak);
        const kapak = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.12, 1.16), new THREE.MeshStandardMaterial({ color: 0xFFD23F, roughness: 0.5 })); kapak.position.y = 1.36; kapak.receiveShadow = true; kursu.add(kapak);
        toplar = BASLA.map(([x, z], i) => topYap(x, z));
        const ray = new THREE.Raycaster(), nk = new THREE.Vector2();
        c.r.domElement.addEventListener("pointerdown", (e) => {
          if (kilit) return; const b = c.r.domElement.getBoundingClientRect(); nk.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); ray.setFromCamera(nk, c.kamera);
          const v = ray.intersectObjects(toplar.filter((t) => t.hazir).map((t) => t.m), true)[0]; if (!v) return;
          const t = toplar.find((t) => t.m === v.object || t.m === v.object.parent); if (t) at(t);
        });
        c.r.domElement.style.cursor = "pointer";
        c.kare = kare;
      }
      function topYap(x, z) {
        const topD = c.doku(512, 256, (g, w, hh) => { g.fillStyle = "#E8772E"; g.fillRect(0, 0, w, hh); for (let i = 0; i < 2400; i++) { g.fillStyle = Math.random() < 0.5 ? "rgba(0,0,0,.06)" : "rgba(255,255,255,.05)"; g.fillRect(Math.random() * w, Math.random() * hh, 2, 2); } g.strokeStyle = "#2A1A10"; g.lineWidth = 7; g.beginPath(); g.moveTo(0, hh / 2); g.lineTo(w, hh / 2); g.stroke(); [w / 4, w * 3 / 4].forEach((xx) => { g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx, hh); g.stroke(); }); [0, w / 2].forEach((xx) => { g.beginPath(); g.ellipse(xx + w / 4, hh / 2, w / 7, hh / 2, 0, -Math.PI / 2, Math.PI / 2, true); g.stroke(); }); });
        const m = new THREE.Mesh(new THREE.SphereGeometry(TOP_R, 48, 32), new THREE.MeshStandardMaterial({ map: topD, roughness: 0.75 })); m.castShadow = true;
        m.position.set(x, TOP_R, z); sahne.add(m);
        const yaziC = document.createElement("canvas"); yaziC.width = 256; yaziC.height = 128;
        const yaziD = new THREE.CanvasTexture(yaziC); yaziD.colorSpace = THREE.SRGBColorSpace;
        const yazi = new THREE.Sprite(new THREE.SpriteMaterial({ map: yaziD, transparent: true, depthTest: false })); yazi.scale.set(0.96, 0.48, 1); yazi.renderOrder = 5; sahne.add(yazi);
        return { m, yazi, yaziC, yaziD, ev: new THREE.Vector3(x, TOP_R, z), sayi: 0, hazir: false };
      }
      function topYazi(t, n) {
        t.sayi = n; const g = t.yaziC.getContext("2d"); g.clearRect(0, 0, 256, 128);
        g.font = "900 " + (String(n).length > 2 ? 84 : 100) + "px 'Fredoka', 'Baloo 2', system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.lineWidth = 14; g.strokeStyle = "#3A1C08"; g.strokeText(n, 128, 68); g.fillStyle = "#FFFFFF"; g.fillText(n, 128, 68); t.yaziD.needsUpdate = true;
      }
      /* onluk taban blokları */
      const izgara = (renk, koyu) => c.doku(64, 64, (x, w) => { x.fillStyle = renk; x.fillRect(0, 0, w, w); x.strokeStyle = koyu; x.lineWidth = 5; x.strokeRect(2.5, 2.5, w - 5, w - 5); x.fillStyle = "rgba(255,255,255,.18)"; x.fillRect(6, 6, w - 12, 10); });
      let DOK = null;
      function malz(tur, rx, ry) { const t = DOK[tur].clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.needsUpdate = true; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.5 }); }
      function bloklariKur(n) {
        if (!DOK) DOK = { y: izgara("#3F7BE6", "#1E4BA8"), o: izgara("#2FB24C", "#16752C"), b: izgara("#E2403A", "#9C1E1A") };
        bloklar.clear();
        const u = 0.2, yuz = Math.floor(n / 100), on = Math.floor((n % 100) / 10), bir = n % 10;
        const parca = [];
        const plaka = () => new THREE.Mesh(new THREE.BoxGeometry(10 * u, 10 * u, u), [malz("y", 1, 10), malz("y", 1, 10), malz("y", 10, 1), malz("y", 10, 1), malz("y", 10, 10), malz("y", 10, 10)]);
        const cubuk = () => new THREE.Mesh(new THREE.BoxGeometry(u, 10 * u, u), [malz("o", 1, 10), malz("o", 1, 10), malz("o", 1, 1), malz("o", 1, 1), malz("o", 1, 10), malz("o", 1, 10)]);
        const kup = () => new THREE.Mesh(new THREE.BoxGeometry(u, u, u), malz("b", 1, 1));
        let x = 0;
        for (let i = 0; i < yuz; i++) { const m = plaka(); m.position.set(x + 5 * u + i * 0.46, 5 * u, -i * 0.22); parca.push(m); }
        if (yuz) x += 10 * u + (yuz - 1) * 0.46 + 0.45;
        for (let i = 0; i < on; i++) { const m = cubuk(); m.position.set(x + u / 2, 5 * u, 0); parca.push(m); x += u + 0.1; }
        if (on) x += 0.35;
        for (let i = 0; i < bir; i++) { const sut = Math.floor(i / 5), sat = i % 5; const m = kup(); m.position.set(x + u / 2 + sut * (u + 0.08), u / 2 + sat * (u + 0.08), 0); parca.push(m); }
        if (bir) x += Math.ceil(bir / 5) * (u + 0.08);
        parca.forEach((m) => { m.castShadow = true; m.receiveShadow = true; bloklar.add(m); });
        const genis = Math.max(0.5, x), olcek = Math.min(1.25, 5.4 / genis);
        bloklar.scale.setScalar(olcek); bloklar.position.set(3.5 - (genis * olcek) / 2, 1.42, -0.9);
        kursu.scale.set(genis * olcek + 0.7, 1, 1); kursu.position.set(3.5, 0, -0.9);
        bloklar.userData.t = 0;
      }

      function yeniSoru() {
        hedef = sayiSec(seviye); denendi = false;
        bloklariKur(hedef);
        const secenek = karistir([hedef, ...celdiriciler(hedef, seviye)]);
        toplar.forEach((t, i) => { topYazi(t, secenek[i]); t.m.visible = t.yazi.visible = true; t.m.scale.setScalar(1); t.m.position.copy(t.ev).add(new THREE.Vector3(0, 2.5 + i * 0.4, 0)); t.dus = { v: 0 }; t.hazir = false; t.uc = null; });
        kilit = false;
      }
      function at(t) {
        t.hazir = false; kilit = true;
        const iyi = t.sayi === hedef;
        const p0 = t.m.position.clone(), p1 = iyi ? new THREE.Vector3(RIM.x, RIM.y + 0.08, RIM.z) : new THREE.Vector3(RIM.x + 0.52, RIM.y + 0.12, RIM.z + 0.12);
        t.uc = { t: 0, sure: 1.0, p0, p1, H: 2.4, iyi, faz: "uc", v: new THREE.Vector3() };
        T.sound && T.sound.pop && T.sound.pop();
      }
      function sonuc(t) {
        if (t.uc.iyi) {
          if (!denendi) dogru++; soru++; puanYaz(); fileSalla = 1;
          balonGoster(["Harika!", "Süper atış!", "Bravo!", "Tam isabet!"][rnd(0, 3)], true);
          T.sound && T.sound.ok && T.sound.ok();
          setTimeout(() => { toplar.forEach((o) => { if (o !== t) { o.uc = { faz: "git", t: 0 }; } }); setTimeout(yeniSoru, 700); }, 1100);
        } else {
          denendi = true; balonGoster(["Tekrar dene!", "Bir daha dene!", "Blokları say, sonra at!"][rnd(0, 2)], false);
          T.sound && T.sound.no && T.sound.no(); setTimeout(() => (kilit = false), 500);
        }
      }
      function kare(dt, zm) {
        bloklar.userData.t = Math.min(1, (bloklar.userData.t || 0) + dt * 2.5);
        const bt = bloklar.userData.t; bloklar.children.forEach((m, i) => { m.visible = bt * bloklar.children.length * 1.2 >= i; });
        if (fileSalla > 0) { fileSalla = Math.max(0, fileSalla - dt * 1.6); const s = 1 + Math.sin(fileSalla * 18) * 0.12 * fileSalla; file.scale.set(1 / s, s, 1 / s); file.position.y = RIM.y - 0.38 * s; }
        toplar.forEach((t) => {
          const u = t.uc;
          if (!u) { /* başlangıçta yukarıdan düşüp sekerek yerine oturur */
            if (t.dus) { t.dus.v -= 14 * dt; t.m.position.y += t.dus.v * dt; if (t.m.position.y <= TOP_R) { t.m.position.y = TOP_R; t.dus.v = -t.dus.v * 0.45; if (Math.abs(t.dus.v) < 0.8) { t.dus = null; t.hazir = true; } } }
            else if (t.hazir) t.m.position.y = TOP_R + Math.abs(Math.sin(zm * 2.4 + t.ev.x)) * 0.06;
          } else if (u.faz === "uc") {
            u.t += dt; const p = Math.min(1, u.t / u.sure);
            t.m.position.lerpVectors(u.p0, u.p1, p); t.m.position.y += 4 * u.H * p * (1 - p);
            t.m.rotation.x -= dt * 9; t.m.rotation.z += dt * 2;
            if (p >= 1) {
              if (u.iyi) { u.faz = "gec"; u.v.set(0, -2.2, 0); }
              else { u.faz = "sek"; u.v.set(2.4, 2.6, 2.2); }
              sonuc(t);
            }
          } else if (u.faz === "gec" || u.faz === "sek") {
            u.v.y -= 9.8 * dt; t.m.position.addScaledVector(u.v, dt); t.m.rotation.x -= dt * 6;
            if (u.faz === "gec") { const dx = RIM.x - t.m.position.x, dz = RIM.z - t.m.position.z; if (t.m.position.y > RIM.y - 0.9) { t.m.position.x += dx * dt * 6; t.m.position.z += dz * dt * 6; } }
            if (t.m.position.y < TOP_R) { t.m.position.y = TOP_R; u.v.y = -u.v.y * 0.55; u.v.x *= 0.8; u.v.z *= 0.8; u.zipla = (u.zipla || 0) + 1; }
            if ((u.zipla || 0) > 3) { u.faz = "git"; u.t = 0; }
          } else if (u.faz === "git") {
            u.t += dt; t.m.scale.setScalar(Math.max(0.01, 1 - u.t * 3)); if (u.t > 0.34) { t.m.visible = false; t.yazi.visible = false; t.m.scale.setScalar(1); t.uc = { faz: "bos" }; }
          }
          t.yazi.position.set(t.m.position.x, t.m.position.y + 0.02, t.m.position.z + TOP_R + 0.05);
          t.yazi.scale.set(0.96 * t.m.scale.x, 0.48 * t.m.scale.x, 1);
        });
      }
      sahneEl.mbAt = (iyi) => { const t = toplar.find((t) => t.hazir && (t.sayi === hedef) === iyi); if (t && !kilit) at(t); return !!t; };
      puanYaz();
    },
  };
})();
