/* Denge cambazı (3B): ahşap masa üstünde pirinç terazi. Kefeler zincirle asılı, sayılar ahşap küplerde.
   Doğru küp kefeye düşünce terazi yaylanarak dengeye gelir. three.js (MIT) yalnızca bu oyun açılınca yüklenir. */
(function () {
  const Sh = T.Sahne;
  let THREE_P = null;
  const three = () => THREE_P || (THREE_P = import(new URL("vendor/three/three.module.min.js", location.href).href));
  const kanvasDoku = (THREE, w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const tahta = (THREE, ton = "#B07A45") => kanvasDoku(THREE, 512, 512, (c, w, h) => {
    c.fillStyle = ton; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { const y = Math.random() * h; c.strokeStyle = Math.random() < 0.5 ? "rgba(80,45,15,.18)" : "rgba(255,220,170,.12)"; c.lineWidth = 1 + Math.random() * 3; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 16) c.lineTo(x, y + Math.sin(x / 60 + i) * 4 + Math.sin(x / 13 + i * 3) * 1.2); c.stroke(); }
    for (let k = 0; k < 3; k++) { const x = Math.random() * w, y = Math.random() * h; for (let r = 4; r < 26; r += 3) { c.strokeStyle = "rgba(70,40,12,.15)"; c.beginPath(); c.ellipse(x, y, r * 2.2, r, 0, 0, Math.PI * 2); c.stroke(); } }
  });
  const kupYuzu = (THREE, metin, renk) => kanvasDoku(THREE, 256, 256, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, renk[0]); g.addColorStop(1, renk[1]); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { const y = Math.random() * h; c.strokeStyle = "rgba(90,50,15,.12)"; c.lineWidth = 1 + Math.random() * 2; c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(w / 3, y + 6, w * 2 / 3, y - 6, w, y + 2); c.stroke(); }
    c.strokeStyle = "rgba(60,30,10,.35)"; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 10);
    c.font = "900 " + (String(metin).length > 2 ? 96 : 130) + "px Nunito, 'Baloo 2', system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "rgba(255,240,215,.55)"; c.fillText(metin, w / 2 + 3, h / 2 + 5); c.fillStyle = "#3A1E0A"; c.fillText(metin, w / 2, h / 2);
  });

  const OYUN = T.tools["oyun-denge"]; if (!OYUN) return;
  OYUN.render = function (host) {
    const g = T.store.grade(); let L = g <= 1 ? 0 : g <= 3 ? 1 : 2;
    const D = { takim: true, puan: [0, 0], sira: 0, simge: "⭐" };
    const kap = T.h("div.sh-kap.d3-kap"), ust = T.h("div.sh-ust"), yukleniyor = T.h("div.d3-yuk", "Terazi kuruluyor...");
    kap.append(yukleniyor, ust); host.append(kap);
    const afis = T.h("div.tv-afis"), skor = T.h("div.tv-skor"), alt = T.h("div.tv-alt"); ust.append(afis, skor, alt);
    const ayar = T.h("div.row.tv-ayar"); host.append(ayar);
    three().then((THREE) => kur(THREE)).catch(() => { yukleniyor.textContent = "Bu cihazda 3B çizim açılamadı."; });

    function kur(THREE) {
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); } catch (e) { yukleniyor.textContent = "Bu cihazda 3B çizim açılamadı."; return; }
      yukleniyor.remove();
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.92; renderer.outputColorSpace = THREE.SRGBColorSpace;
      kap.prepend(renderer.domElement); renderer.domElement.className = "sh-cv";
      const sahne = new THREE.Scene();
      sahne.background = kanvasDoku(THREE, 16, 512, (c, w, h) => { const gg = c.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, "#E9DCC8"); gg.addColorStop(0.6, "#D8C4A6"); gg.addColorStop(1, "#BFA585"); c.fillStyle = gg; c.fillRect(0, 0, w, h); });
      sahne.fog = new THREE.Fog(0xd8c4a6, 14, 30);
      { const env = kanvasDoku(THREE, 512, 256, (c, w, h) => { const gg = c.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, "#FFF8EA"); gg.addColorStop(0.45, "#E8D2AE"); gg.addColorStop(0.55, "#8A6A45"); gg.addColorStop(1, "#3E2A18"); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.fillStyle = "rgba(255,255,255,.95)"; c.fillRect(w * 0.15, h * 0.12, w * 0.12, h * 0.22); c.fillRect(w * 0.62, h * 0.1, w * 0.18, h * 0.2); });
        env.mapping = THREE.EquirectangularReflectionMapping; const pm = new THREE.PMREMGenerator(renderer); sahne.environment = pm.fromEquirectangular(env).texture; pm.dispose(); }
      const kamera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 100); kamera.position.set(0, 3.2, 10.5); kamera.lookAt(0, 2.1, 0);
      /* ışıklar */
      sahne.add(new THREE.HemisphereLight(0xfff4e0, 0x6b5238, 0.9));
      const gunes = new THREE.DirectionalLight(0xfff1d6, 2.4); gunes.position.set(-5, 9, 6); gunes.castShadow = true; gunes.shadow.mapSize.set(2048, 2048);
      Object.assign(gunes.shadow.camera, { left: -8, right: 8, top: 8, bottom: -4, near: 1, far: 30 }); gunes.shadow.bias = -0.0004; gunes.shadow.radius = 4; sahne.add(gunes);
      const dolgu = new THREE.PointLight(0xffd9a8, 18, 20); dolgu.position.set(5, 4, 4); sahne.add(dolgu);
      /* masa */
      const tahtaDoku = tahta(THREE); tahtaDoku.wrapS = tahtaDoku.wrapT = THREE.RepeatWrapping; tahtaDoku.repeat.set(3, 1.5);
      const masa = new THREE.Mesh(new THREE.BoxGeometry(22, 0.5, 10), new THREE.MeshStandardMaterial({ map: tahtaDoku, roughness: 0.62, metalness: 0 }));
      masa.position.set(0, -0.25, 0); masa.receiveShadow = true; sahne.add(masa);
      /* duvar */
      const duvar = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: 0xe6d6bf, roughness: 0.95 })); duvar.position.set(0, 8, -5); duvar.receiveShadow = true; sahne.add(duvar);
      /* pirinç */
      const pirinc = new THREE.MeshStandardMaterial({ color: 0xc9a24a, metalness: 0.95, roughness: 0.28 });
      const koyuPirinc = new THREE.MeshStandardMaterial({ color: 0x8f6c25, metalness: 0.9, roughness: 0.38 });
      const golgele = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
      const taban = golgele(new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.45, 0.32, 64), koyuPirinc)); taban.position.y = 0.16; sahne.add(taban);
      const taban2 = golgele(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.05, 0.3, 64), pirinc)); taban2.position.y = 0.46; sahne.add(taban2);
      const direk = golgele(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 3.6, 32), pirinc)); direk.position.y = 2.4; sahne.add(direk);
      const tepe = golgele(new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 16), pirinc)); tepe.position.y = 4.3; sahne.add(tepe);
      /* kol (dönen) */
      const kol = new THREE.Group(); kol.position.y = 4.25; sahne.add(kol);
      const kolGeo = new THREE.BoxGeometry(7.4, 0.16, 0.22); const kolM = golgele(new THREE.Mesh(kolGeo, pirinc)); kol.add(kolM);
      [-1, 1].forEach((s) => { const uc = golgele(new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 12), pirinc)); uc.position.x = s * 3.7; kol.add(uc); });
      const ibre = golgele(new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.9, 16), koyuPirinc)); ibre.position.y = 0.55; kol.add(ibre);
      /* kefeler */
      const kefeProfil = []; for (let i = 0; i <= 12; i++) { const t = i / 12; kefeProfil.push(new THREE.Vector2(0.05 + t * 1.65, Math.pow(t, 2.2) * 0.36)); }
      const kefeGeo = new THREE.LatheGeometry(kefeProfil, 64);
      const kefeler = [-1, 1].map((s) => {
        const grup = new THREE.Group(); sahne.add(grup);
        const kefe = golgele(new THREE.Mesh(kefeGeo, new THREE.MeshStandardMaterial({ color: 0xd5b25c, metalness: 0.95, roughness: 0.22, side: THREE.DoubleSide }))); kefe.position.y = -2.4; grup.add(kefe);
        /* zincirler: halkalar */
        const halkaGeo = new THREE.TorusGeometry(0.05, 0.016, 8, 16);
        for (let k = 0; k < 3; k++) {
          const a = [0, Math.PI, -Math.PI / 2][k], ux = Math.cos(a) * 1.58, uz = Math.sin(a) * 1.58, n = 30;
          for (let j = 0; j < n; j++) { const t = (j + 0.5) / n, h = golgele(new THREE.Mesh(halkaGeo, koyuPirinc)); h.position.set(ux * t, -t * 2.05, uz * t); h.rotation.set(j % 2 ? Math.PI / 2 : 0, a, 0); grup.add(h); }
        }
        const kanca = golgele(new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 24), koyuPirinc)); kanca.rotation.x = Math.PI / 2; grup.add(kanca);
        return { grup, s, kupler: [] };
      });
      /* küpler */
      const KS = 0.74, kupGeo = new THREE.BoxGeometry(KS, KS, KS);
      const RENK = [["#E8BE84", "#B98348"], ["#E9C98F", "#C4925A"], ["#D9A86E", "#A06A35"]];
      const kup = (metin, k = 0, soru = false) => {
        const doku = kupYuzu(THREE, metin, soru ? ["#F4F1EA", "#D7D2C6"] : RENK[k % 3]);
        const m = golgele(new THREE.Mesh(kupGeo, new THREE.MeshStandardMaterial({ map: doku, roughness: soru ? 0.4 : 0.7, transparent: soru, opacity: soru ? 0.75 : 1 })));
        m.userData = { hedefY: 0, vy: 0, dusus: false }; return m;
      };
      const kefeyeKoy = (kf, m, i, n) => { m.position.set((i - (n - 1) / 2) * 0.8, -2.4 + 0.33 + KS / 2, 0.15); kf.grup.add(m); kf.kupler.push(m); };
      const temizle = () => kefeler.forEach((kf) => { kf.kupler.forEach((m) => { kf.grup.remove(m); m.geometry !== kupGeo && m.geometry.dispose(); m.material.map && m.material.map.dispose(); m.material.dispose(); }); kf.kupler = []; });

      let R = null, durum = "soru", aci = 0, hiz = 0, hedefAci = 0, deneme = 0, soruKup = null, dusen = null;
      const toplam = () => [R.a + R.b, (dusen ? dusen.userData.deger : 0) + R.c];
      const yeni = () => {
        const mx = [10, 20, 100][L]; let a, b, c, d;
        for (let i = 0; i < 50; i++) { a = Math.floor(Sh.rnd(1, mx / 2 + 1)); b = Math.floor(Sh.rnd(1, mx / 2 + 1)); c = Math.floor(Sh.rnd(1, Math.min(a + b - 1, mx / 2) + 1)); d = a + b - c; if (d > 0) break; }
        const o = new Set([d]); let k = 0; while (o.size < 4 && k++ < 100) { const v = d + Math.floor(Sh.rnd(-4, 5)); if (v > 0) o.add(v); }
        R = { a, b, c, d, opts: T.shuffle([...o]) }; durum = "soru"; deneme = 0; dusen = null;
        temizle(); kefeyeKoy(kefeler[0], kup(a, 0), 0, 2); kefeyeKoy(kefeler[0], kup(b, 1), 1, 2);
        soruKup = kup("?", 0, true); kefeyeKoy(kefeler[1], soruKup, 0, 2); kefeyeKoy(kefeler[1], kup(c, 2), 1, 2);
        hedefAci = egim(a + b, c); ciz();
      };
      const egim = (sol, sag) => THREE.MathUtils.clamp((sol - sag) * 0.035, -0.32, 0.32);
      const ciz = () => {
        afis.replaceChildren(T.h("div.tv-soru", durum === "soru" ? "Terazinin dengede kalması için ? kaç olmalı?" : durum === "bitti" ? (deneme === 0 ? "Denge! " : "Doğrusu " + R.d + ". ") + R.a + " + " + R.b + " = " + R.d + " + " + R.c : durum === "yanlis" ? (dusen && dusen.userData.deger > R.d ? "Sağ taraf ağır geldi. Daha küçük bir sayı dene." : "Sol taraf ağır geldi. Daha büyük bir sayı dene.") : "Bakalım terazi ne yapacak?"));
        Sh.skor(skor, D);
        alt.replaceChildren(...(durum === "soru" ? R.opts.map((v) => T.h("button.btn.big.c-chalk.d3-sec", { onclick: () => sec(v) }, String(v))) : durum === "bitti" ? [T.h("button.btn.c-leaf.tv-sonraki", { onclick: () => { if (D.takim) D.sira = 1 - D.sira; yeni(); } }, "Sonraki")] : []));
        ayar.replaceChildren(T.h("div.seg", [[0, "10'a kadar"], [1, "20'ye kadar"], [2, "100'e kadar"]].map(([k, l]) => T.h("button", { "aria-pressed": String(L === k), onclick: () => { L = k; yeni(); } }, l))),
          T.h("div.seg", [[true, "İki takım"], [false, "Tek sınıf"]].map(([k, l]) => T.h("button", { "aria-pressed": String(D.takim === k), onclick: () => { D.takim = k; ciz(); } }, l))),
          T.h("div.spacer"), T.h("button.btn.sm.c-chalk", { onclick: () => { D.puan = [0, 0]; ciz(); } }, T.icon("reset"), "Skoru sıfırla"),
          T.h("button.btn.sm.c-chalk", { onclick: () => { try { (kap.requestFullscreen || kap.webkitRequestFullscreen).call(kap); } catch (e) {} } }, T.icon("full"), "Tam ekran"));
      };
      const sec = (v) => {
        if (durum !== "soru") return; durum = "dus"; Sh.ses.tik();
        soruKup.visible = false;
        dusen = kup(v, 1); dusen.userData.deger = v; dusen.userData.dusus = true; dusen.userData.vy = 0;
        kefeyeKoy(kefeler[1], dusen, 0, 2); dusen.userData.hedefY = dusen.position.y; dusen.position.y += 4.5; dusen.rotation.set(0.4, 0.6, 0.2);
        ciz();
      };
      const kondu = () => {
        const [sol, sag] = toplam(); hedefAci = egim(sol, sag); hiz += (sag - sol) * 0.004; Sh.ses.kon();
        setTimeout(() => {
          if (dusen.userData.deger === R.d) { durum = "bitti"; Sh.ses.dogru(); T.konfeti && T.konfeti(); D.puan[D.takim ? D.sira : 0]++; ciz(); }
          else {
            Sh.ses.yanlis(); deneme++; durum = "yanlis"; ciz();
            setTimeout(() => {
              kefeler[1].grup.remove(dusen); kefeler[1].kupler = kefeler[1].kupler.filter((m) => m !== dusen); dusen = null;
              if (deneme >= (D.takim ? 1 : 2)) { /* doğru küpü göster */ dusen = kup(R.d, 1); dusen.userData.deger = R.d; dusen.userData.dusus = true; kefeyeKoy(kefeler[1], dusen, 0, 2); kefeler[1].kupler.pop(); dusen.userData.hedefY = dusen.position.y; dusen.position.y += 4.5; durum = "goster"; }
              else { soruKup.visible = true; hedefAci = egim(R.a + R.b, R.c); durum = "soru"; } ciz();
            }, 1300);
          }
        }, 700);
      };
      /* sürükleyince hafifçe döndür */
      let surukle = null, bakis = 0, bakisHedef = 0;
      renderer.domElement.addEventListener("pointerdown", (e) => { Sh.ac(); surukle = e.clientX; });
      window.addEventListener("pointerup", () => (surukle = null));
      renderer.domElement.addEventListener("pointermove", (e) => { if (surukle == null) return; bakisHedef = THREE.MathUtils.clamp(bakisHedef + (e.clientX - surukle) * 0.004, -0.7, 0.7); surukle = e.clientX; });
      let son = performance.now(), say = 0;
      const dongu = (z) => {
        if (!renderer.domElement.isConnected) { renderer.dispose(); return; }
        const dt = Math.min(window.__testDt || 0.05, (z - son) / 1000); son = z; window.__d3kare = (window.__d3kare || 0) + 1;
        if (say++ % 20 === 0) { const r = kap.getBoundingClientRect(); if (r.width) { renderer.setSize(r.width, r.height, false); kamera.aspect = r.width / r.height; kamera.updateProjectionMatrix(); } }
        /* yaylı kol: açısal yay + sönüm */
        for (let kalan = dt; kalan > 1e-6; kalan -= 1 / 120) { const hs = Math.min(1 / 120, kalan); hiz += ((hedefAci - aci) * 30 - hiz * 3.2) * hs; aci += hiz * hs; } kol.rotation.z = aci;
        kefeler.forEach((kf) => { const x = kf.s * 3.7 * Math.cos(aci), y = 4.25 + kf.s * 3.7 * Math.sin(aci); kf.grup.position.set(x, y, 0); kf.grup.rotation.z = Math.sin(z / 600 + kf.s) * 0.01 - THREE.MathUtils.clamp(hiz, -1, 1) * 0.03; });
        if (dusen && dusen.userData.dusus) {
          const u = dusen.userData; u.vy -= 22 * dt; dusen.position.y += u.vy * dt; dusen.rotation.x *= 0.9; dusen.rotation.y *= 0.9; dusen.rotation.z *= 0.9;
          if (dusen.position.y <= u.hedefY) { dusen.position.y = u.hedefY; if (u.vy < -2.5 && (u.sek = (u.sek || 0) + 1) <= 2) { u.vy = -u.vy * 0.28; } else { u.dusus = false; dusen.rotation.set(0, 0, 0); if (durum === "dus") kondu(); else if (durum === "goster") { const [s1, s2] = toplam(); hedefAci = egim(s1, s2); durum = "bitti"; ciz(); } } }
        }
        bakis += (bakisHedef - bakis) * Math.min(1, dt * 4); bakisHedef *= 0.995;
        kamera.position.set(Math.sin(bakis + Math.sin(z / 4000) * 0.05) * 10.5, 3.2, Math.cos(bakis) * 10.5); kamera.lookAt(0, 2.1, 0);
        renderer.render(sahne, kamera); requestAnimationFrame(dongu);
      };
      yeni(); requestAnimationFrame((z) => { son = z; dongu(z); });
    }
  };
})();
