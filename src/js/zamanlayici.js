/* Tek zamanlayıcı: kum saati, dijital, mum, yarış, kronometre, aralık ve takım saati tek pencerede.
   Geri sayan biçimler aynı süreyi paylaşır; biçim değiştirmek süreyi bozmaz. */
(function () {
  const { h } = T; const W = T.widgets;
  const kumRender = W.timer.render, kronoRender = W.stopwatch.render;
  const MODLAR = [["kum", "Kum saati"], ["dijital", "Dijital"], ["mum", "Mum"], ["kronometre", "Kronometre"], ["aralik", "Aralık"], ["takim", "Takım saati"]];
  const mmss = (s) => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s / 60); return (m >= 60 ? Math.floor(m / 60) + ":" + T.pad(m % 60) : m) + ":" + T.pad(s % 60); };
  const img = (ad) => h("img", { src: "/oyun3d/" + ad + ".webp", alt: "", draggable: false });

  /* ortak geri sayım motoru */
  function sayac(d, api, cizici) {
    const kalan = () => (d.running ? Math.max(0, (d.endAt - Date.now()) / 1000) : d.left);
    let caldi = false;
    const ctl = {
      kalan, oran: () => (d.total ? 1 - kalan() / d.total : 0),
      ayarla: (sn) => { d.total = sn; d.left = sn; d.running = false; api.save(); ciz(); },
      dugme: () => { T.sound.unlock(); if (d.running) { d.left = kalan(); d.running = false; } else { if (d.left <= 0) d.left = d.total; d.endAt = Date.now() + d.left * 1000; d.running = true; } api.save(); ciz(); },
      sifirla: () => { d.left = d.total; d.running = false; api.save(); ciz(); },
    };
    function ciz() {
      const k = kalan();
      if (d.running && k <= 0) { d.running = false; d.left = 0; api.save(); if (!caldi) { caldi = true; T.sound.alarm(d.ses || "zil"); api.el && api.el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 400, iterations: 3 }); } }
      if (k > 0) caldi = false;
      cizici(k, ctl);
    }
    ctl.ciz = ciz;
    return ctl;
  }
  /* süre ayarı ve kontrol düğmeleri */
  function kontroller(d, ctl, hazir = [1, 3, 5, 10]) {
    const oyna = h("button.btn.sm.c-leaf", { onclick: () => ctl.dugme() });
    const sure = h("input.zm-sure", { type: "text", inputmode: "numeric", value: mmss(d.total), "aria-label": "Süre (dakika:saniye)", title: "Süreyi yaz, örneğin 2:30",
      onchange: (e) => { const p = e.target.value.split(":").map((x) => parseInt(x, 10) || 0); const sn = p.length > 1 ? p[0] * 60 + p[1] : p[0] * 60; if (sn > 0) ctl.ayarla(Math.min(sn, 24 * 3600)); } });
    const el = h("div.zm-kontrol",
      h("div.row", { style: { justifyContent: "center", gap: "6px" } }, hazir.map((m) => h("button.btn.sm.c-chalk", { onclick: () => { ctl.ayarla(m * 60); sure.value = mmss(m * 60); } }, m + " dk")), sure),
      h("div.row", { style: { justifyContent: "center", gap: "6px" } }, oyna, h("button.btn.sm.icon.c-chalk", { "aria-label": "Sıfırla", onclick: () => ctl.sifirla() }, T.icon("reset"))));
    el.guncelle = () => { oyna.replaceChildren(T.icon(d.running ? "pause" : "play"), d.running ? "Durdur" : ctl.kalan() <= 0 ? "Yeniden" : "Başlat"); if (document.activeElement !== sure) sure.value = mmss(d.total); };
    return el;
  }

  const CIZ = {
    dijital(kap, d, api) {
      /* Masa saati gibi: metal çerçeve, dakika çizgileri, süre azaldıkça kısalan renkli halka ve ucunda parlayan düğme */
      const R = 92, C = 2 * Math.PI * R;
      const svg = T.svg("svg", { viewBox: "0 0 240 240", class: "zm-halka" });
      let cizgi = ""; for (let i = 0; i < 60; i++) { const aci = (i / 60) * 2 * Math.PI, uzun = i % 5 === 0, r1 = uzun ? 101 : 104, r2 = 109; cizgi += `<line x1="${120 + r1 * Math.sin(aci)}" y1="${120 - r1 * Math.cos(aci)}" x2="${120 + r2 * Math.sin(aci)}" y2="${120 - r2 * Math.cos(aci)}" stroke="${uzun ? "#5a6478" : "#aab3c2"}" stroke-width="${uzun ? 2.4 : 1.2}" stroke-linecap="round"/>`; }
      svg.innerHTML = `<defs><radialGradient id="zm-yuz" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6eaf1"/></radialGradient>
        <linearGradient id="zm-cer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6fa"/><stop offset=".5" stop-color="#b9c1cf"/><stop offset="1" stop-color="#7d8798"/></linearGradient>
        <filter id="zm-gol" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1b2a4a" flood-opacity=".35"/></filter>
        <filter id="zm-isik" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter></defs>
        <circle cx="120" cy="120" r="118" fill="url(#zm-cer)"/><circle cx="120" cy="120" r="112" fill="url(#zm-yuz)"/>${cizgi}
        <circle cx="120" cy="120" r="${R}" fill="none" stroke="#e3e8ef" stroke-width="16"/>
        <circle class="zm-ilerle-isik" cx="120" cy="120" r="${R}" fill="none" stroke-width="16" stroke-linecap="round" stroke-dasharray="${C}" transform="rotate(-90 120 120)" filter="url(#zm-isik)" opacity=".55"/>
        <circle class="zm-ilerle" cx="120" cy="120" r="${R}" fill="none" stroke-width="16" stroke-linecap="round" stroke-dasharray="${C}" transform="rotate(-90 120 120)"/>
        <circle class="zm-dugme" r="10" fill="#fff" stroke="#c9d1dc" stroke-width="2" filter="url(#zm-gol)"/>`;
      const yazi = h("div.zm-dijital"); const kk = h("div.zm-dij-kap", svg, yazi);
      let k;
      const ctl = sayac(d, api, (kalan, c) => { const o = c.oran(), renk = kalan <= 0 ? "#c9d1dc" : kalan < 10 ? "#E4553F" : kalan < 60 ? "#F2A93B" : "#2FA36B", aci = (1 - o) * 2 * Math.PI;
        svg.querySelectorAll(".zm-ilerle, .zm-ilerle-isik").forEach((e) => { e.setAttribute("stroke-dashoffset", C * o); e.setAttribute("stroke", renk); e.style.opacity = o >= 0.999 ? 0 : ""; });
        const dg = svg.querySelector(".zm-dugme"); dg.setAttribute("cx", 120 + R * Math.sin(aci)); dg.setAttribute("cy", 120 - R * Math.cos(aci)); dg.style.display = kalan <= 0 ? "none" : "";
        yazi.textContent = mmss(kalan); yazi.classList.toggle("az", kalan > 0 && kalan < 10); k.guncelle(); });
      k = kontroller(d, ctl); kk.addEventListener("click", () => ctl.dugme());
      kap.append(kk, k); return ctl;
    },
    mum(kap, d, api) {
      /* Gerçeğe yakın mum: içten ışıyan mum gövdesi, eriyen tepe çukuru, akan damlalar, titreyen alev ve odaya vuran ışık */
      const svg = T.svg("svg", { viewBox: "0 0 240 320", class: "zm-mum" });
      svg.innerHTML = `<defs>
        <linearGradient id="zm-govde" x1="0" x2="1"><stop offset="0" stop-color="#d9b98c"/><stop offset=".18" stop-color="#f6e6c8"/><stop offset=".45" stop-color="#fff6e6"/><stop offset=".75" stop-color="#f1dcb8"/><stop offset="1" stop-color="#c79f6c"/></linearGradient>
        <linearGradient id="zm-ici" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset=".25" stop-color="#ffe2a8" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <radialGradient id="zm-cukur" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#ffe9b0"/><stop offset=".7" stop-color="#f3d39a"/><stop offset="1" stop-color="#d9b07a"/></radialGradient>
        <radialGradient id="zm-oda" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".55"/><stop offset=".45" stop-color="#ffb347" stop-opacity=".18"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
        <radialGradient id="zm-alev-dis" cx="50%" cy="75%" r="65%"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#ffb43a"/><stop offset=".85" stop-color="#ff6a00" stop-opacity=".55"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient>
        <radialGradient id="zm-alev-ic" cx="50%" cy="80%" r="60%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#fff6cf"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>
        <radialGradient id="zm-mavi" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#4f7bff" stop-opacity=".85"/><stop offset="1" stop-color="#4f7bff" stop-opacity="0"/></radialGradient>
        <linearGradient id="zm-tabak" x1="0" x2="1"><stop offset="0" stop-color="#8a5a1e"/><stop offset=".35" stop-color="#e8c06a"/><stop offset=".6" stop-color="#b98a35"/><stop offset="1" stop-color="#6e4515"/></linearGradient>
        <filter id="zm-bulanik"><feGaussianBlur stdDeviation="2.2"/></filter>
        <filter id="zm-cokbulanik" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter></defs>
        <circle class="zm-oda" cx="120" cy="80" r="140" fill="url(#zm-oda)"/>
        <ellipse cx="120" cy="300" rx="92" ry="12" fill="#000" opacity=".18" filter="url(#zm-bulanik)"/>
        <ellipse cx="120" cy="292" rx="86" ry="16" fill="url(#zm-tabak)"/><ellipse cx="120" cy="288" rx="74" ry="11" fill="#c89a45"/><ellipse cx="120" cy="287" rx="66" ry="8" fill="#d8ac58"/>
        <g class="zm-mum-g">
          <rect class="zm-govde" x="80" y="90" width="80" height="196" fill="url(#zm-govde)"/>
          <rect class="zm-govde-isik" x="80" y="90" width="80" height="196" fill="url(#zm-ici)"/>
          <g class="zm-tepe">
            <path d="M80 0 Q80 10 92 12 Q120 16 148 12 Q160 10 160 0Z" fill="#f3dfbd"/>
            <ellipse cx="120" cy="0" rx="40" ry="9" fill="#fbeed6"/><ellipse cx="120" cy="1.5" rx="31" ry="6.2" fill="url(#zm-cukur)"/>
            <path d="M83 2 q-3 14 -1 30 q2 6 4 0 q1 -14 2 -26Z" fill="#f7e8cc"/><path d="M151 4 q4 10 2 44 q-2 8 -5 1 q0 -20 -1 -42Z" fill="#f4e2c2"/><path d="M118 8 q2 6 0 16 q-3 4 -4 0 q0 -8 0 -14Z" fill="#fbf0dc" opacity=".8"/>
            <path class="zm-fitil" d="M120 2 C120 -4 118 -8 121 -14" stroke="#2b1d12" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="121" cy="-14" r="1.8" fill="#ff7a2a"/>
            <g class="zm-alev-g">
              <ellipse cx="121" cy="-40" rx="30" ry="44" fill="#ffb84a" opacity=".45" filter="url(#zm-cokbulanik)"/>
              <ellipse cx="121" cy="-12" rx="7" ry="5" fill="url(#zm-mavi)"/>
              <path d="M121 -78 C134 -52 138 -30 131 -18 C127 -11 115 -11 111 -18 C104 -30 109 -52 121 -78Z" fill="url(#zm-alev-dis)"/>
              <path d="M121 -54 C128 -38 129 -26 125 -19 C123 -16 119 -16 117 -19 C113 -26 114 -38 121 -54Z" fill="url(#zm-alev-ic)"/>
            </g>
            <path class="zm-duman" d="M121 -16 C116 -30 128 -44 120 -60 C113 -74 126 -86 119 -104" stroke="#9aa3ad" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/>
          </g>
        </g>`;
      const yazi = h("div.zm-alt-yazi"); let k;
      const ctl = sayac(d, api, (kalan, c) => { const o = c.oran(), bitti = kalan <= 0 && d.total, hgt = 196 * (1 - o * 0.8), y = 286 - hgt;
        const g1 = svg.querySelector(".zm-govde"), g2 = svg.querySelector(".zm-govde-isik"); [g1, g2].forEach((e) => { e.setAttribute("y", y); e.setAttribute("height", hgt); });
        svg.querySelector(".zm-tepe").setAttribute("transform", `translate(0 ${y})`);
        const al = svg.querySelector(".zm-alev-g"); al.style.display = bitti ? "none" : ""; al.classList.toggle("yaniyor", !!d.running);
        svg.querySelector(".zm-oda").setAttribute("cy", y - 40); svg.querySelector(".zm-oda").style.opacity = bitti ? 0 : 1; svg.querySelector(".zm-oda").classList.toggle("titrek", !!d.running);
        svg.querySelector(".zm-duman").classList.toggle("tutsun", !!bitti);
        yazi.textContent = bitti ? "Mum söndü, süre bitti" : mmss(kalan); k.guncelle(); });
      k = kontroller(d, ctl); svg.addEventListener("click", () => ctl.dugme());
      kap.append(h("div.zm-sahne.zm-mum-sahne", svg), yazi, k); return ctl;
    },
    yaris(kap, d, api) {
      /* 3B yarış pisti: canlandırılmış hayvanlar koşar. 3B açılmazsa düz çizim. Kazanan rastgele, herkes süre bitince varır. */
      if (!T.sahne3 || !T.karakter3B) return CIZ.yaris2d(kap, d, api);
      const KOS = [["kedi", "Kedi", 1.35], ["kopek", "Köpek", 1.5], ["sincap", "Sincap", 1.7], ["robot", "Robot", 1.7]];
      d.yaris = d.yaris || { tohum: Math.random() };
      const kazananI = () => Math.floor(d.yaris.tohum * KOS.length);
      const konum = (i, o) => { const s2 = d.yaris.tohum * 1000 + i * 17.3; const dal = Math.sin(o * 9 + s2) * 0.06 + Math.sin(o * 23 + s2 * 2) * 0.03; const son = i === kazananI() ? 1 : 0.9 + ((s2 * 7) % 1) * 0.08; return Math.max(0, Math.min(1, o * son + dal * Math.sin(Math.PI * o))); };
      const sahneK = h("div.zm-3b"), bilgi = h("div.zm-3b-bilgi", "Koşucular piste geliyor..."), yazi = h("div.zm-alt-yazi");
      let k, kosucular = null, sonDurum = "";
      const ctl = sayac(d, api, (kalan, c) => {
        const bitti = kalan <= 0 && d.total;
        yazi.textContent = bitti ? "Kazanan: " + KOS[kazananI()][1] + "!" : mmss(kalan); k.guncelle();
        if (!kosucular) return;
        const o = c.oran(), durum = bitti ? "bitti" : d.running ? "kos" : "dur";
        kosucular.forEach((kc, i) => { const p = bitti ? (i === kazananI() ? 1 : Math.min(0.97, konum(i, 1))) : konum(i, o); kc.hedefX = -5.6 + p * 11.2; });
        if (durum !== sonDurum) { sonDurum = durum;
          kosucular.forEach((kc, i) => { if (durum === "kos") kc.n.oynat(kc.n.var("kos") ? "kos" : "yuru", { hiz: kc.n.var("kos") ? 1 : 1.6 }); else if (durum === "bitti" && i === kazananI() && kc.n.var("sevin")) kc.n.oynat("sevin"); else kc.n.oynat(kc.n.dortAyak ? "bekle" : "dur"); }); }
      });
      k = kontroller(d, ctl);
      const yeni = h("button.btn.sm.c-chalk", { onclick: () => { d.yaris.tohum = Math.random(); sonDurum = ""; ctl.sifirla(); } }, T.icon("dice"), "Yeni yarış");
      k.lastChild.append(yeni);
      kap.append(h("div.zm-sahne.zm-3b-kap", sahneK, bilgi), yazi, k);
      T.sahne3(sahneK, { kamera: [-1.2, 4.4, 8.6], bak: [0.4, 0.5, 0], fov: 40, env: ["#EAF6FF", "#BFE3A8", "#4E7A3A"], arka: ["#8FCBF2", "#E8F6FF"], sigdir: 10, oran: 1.5 }, api).then(async (c) => {
        if (!c) { kap.replaceChildren(); return CIZ.yaris2d(kap, d, api); }
        const { THREE, sahne, r } = c; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
        sahne.add(new THREE.HemisphereLight(0xffffff, 0x6b8f4e, 1.1));
        const gun = new THREE.DirectionalLight(0xfff3dd, 2.2); gun.position.set(-6, 12, 8); gun.castShadow = true; gun.shadow.mapSize.set(1024, 1024); Object.assign(gun.shadow.camera, { left: -12, right: 12, top: 8, bottom: -8 }); sahne.add(gun);
        const cimen = c.doku(512, 512, (x, w) => { x.fillStyle = "#79b957"; x.fillRect(0, 0, w, w); for (let i = 0; i < 9000; i++) { x.strokeStyle = Math.random() < 0.5 ? "rgba(50,100,35,.25)" : "rgba(190,230,130,.25)"; const px = Math.random() * w, py = Math.random() * w; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.random() * 3 - 1.5, py - 4 - Math.random() * 4); x.stroke(); } });
        cimen.wrapS = cimen.wrapT = THREE.RepeatWrapping; cimen.repeat.set(8, 8);
        const zemin = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ map: cimen, roughness: 1 })); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
        const N = KOS.length, SER = 1.7;
        const pist = c.doku(1024, 256, (x, w, hh) => { x.fillStyle = "#c4553b"; x.fillRect(0, 0, w, hh); for (let i = 0; i < 20000; i++) { x.fillStyle = Math.random() < 0.5 ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.07)"; x.fillRect(Math.random() * w, Math.random() * hh, 2, 2); } });
        const pistM = new THREE.Mesh(new THREE.PlaneGeometry(14, N * SER), new THREE.MeshStandardMaterial({ map: pist, roughness: 0.9 })); pistM.rotation.x = -Math.PI / 2; pistM.position.y = 0.01; pistM.receiveShadow = true; sahne.add(pistM);
        const cizgiM = new THREE.MeshBasicMaterial({ color: 0xffffff }); for (let i = 0; i <= N; i++) { const cz = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.07), cizgiM); cz.rotation.x = -Math.PI / 2; cz.position.set(0, 0.015, -N * SER / 2 + i * SER); sahne.add(cz); }
        const dama = c.doku(64, 256, (x, w, hh) => { const kk = 16; for (let i = 0; i < w / kk; i++) for (let j = 0; j < hh / kk; j++) { x.fillStyle = (i + j) % 2 ? "#111" : "#fff"; x.fillRect(i * kk, j * kk, kk, kk); } });
        const bitis = new THREE.Mesh(new THREE.PlaneGeometry(0.6, N * SER), new THREE.MeshStandardMaterial({ map: dama })); bitis.rotation.x = -Math.PI / 2; bitis.position.set(6.1, 0.02, 0); sahne.add(bitis);
        const baslangic = new THREE.Mesh(new THREE.PlaneGeometry(0.12, N * SER), new THREE.MeshBasicMaterial({ color: 0xffffff })); baslangic.rotation.x = -Math.PI / 2; baslangic.position.set(-6.1, 0.02, 0); sahne.add(baslangic);
        /* bitiş kemeri */
        const direkM = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.5 });
        [-1, 1].forEach((y) => { const dk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2, 12), direkM); dk.position.set(6.1, 1.6, y * (N * SER / 2 + 0.3)); dk.castShadow = true; sahne.add(dk); });
        const pankart = c.doku(512, 96, (x, w, hh) => { x.fillStyle = "#1B2A4A"; x.fillRect(0, 0, w, hh); x.fillStyle = "#FFD45A"; x.font = "800 58px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("BİTİŞ", w / 2, hh / 2 + 2); });
        const pk = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, N * SER + 0.6), [direkM, new THREE.MeshStandardMaterial({ map: pankart }), direkM, direkM, direkM, direkM]); pk.position.set(6.1, 3.0, 0); sahne.add(pk);
        /* çevre: çit ve ağaçlar */
        for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(new THREE.SphereGeometry(0.9 + Math.random() * 0.5, 14, 10), new THREE.MeshStandardMaterial({ color: [0x4f9a3c, 0x5fae47, 0x3f8a33][i % 3], roughness: 1 })); t.position.set(-9 + i * 2.3, 1.6, -N * SER / 2 - 3 - Math.random()); t.castShadow = true; sahne.add(t); const gv = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x7a4f2a })); gv.position.set(t.position.x, 0.6, t.position.z); sahne.add(gv); }
        try {
          const yuklu = await Promise.all(KOS.map(([ad, , boy]) => T.karakter3B(c, ad, { boy })));
          kosucular = yuklu.map((n, i) => { const z = (i - (N - 1) / 2) * SER; n.kok.position.set(-5.6, 0, z); n.kok.rotation.y = Math.PI / 2; sahne.add(n.kok);
            /* modelin gövdesi kendi merkezinde olmayabilir: kulvarın ortasına hizala */
            n.kok.updateMatrixWorld(true); const kt = new THREE.Box3().setFromObject(n.model, true), mz = (kt.min.z + kt.max.z) / 2; if (isFinite(mz)) n.kok.position.z += z - mz; return { n, hedefX: -5.6 }; });
          bilgi.replaceChildren(...KOS.map(([, ad], i) => h("span", ad))); bilgi.classList.add("adlar");
          sonDurum = ""; ctl.ciz();
        } catch (e) { console.error(e); bilgi.textContent = "Koşucular yüklenemedi"; }
        c.kare = (dt) => { if (!kosucular) return; kosucular.forEach((kc) => { const p = kc.n.kok.position; p.x += (kc.hedefX - p.x) * Math.min(1, dt * 4); kc.n.guncelle(dt); }); };
      });
      return ctl;
    },
    yaris2d(kap, d, api) {
      const KOS = [["kaplumbaga", "Kaplumbağa"], ["rabbit", "Tavşan"], ["snail", "Salyangoz"], ["hedgehog", "Kirpi"], ["penguen", "Penguen"]];
      const src = (a) => (["rabbit", "snail", "hedgehog"].includes(a) ? "/orman/" + a + ".webp" : "/oyun3d/" + a + ".webp");
      d.yaris = d.yaris || { tohum: Math.random() };
      const pist = h("div.zm-pist", KOS.map(([a, ad], i) => h("div.zm-kulvar", h("span.zm-ad", ad), h("img.zm-kosucu", { src: src(a), alt: ad, draggable: false, "data-i": i }), h("img.zm-bayrak", { src: "/oyun3d/bayrak.webp", alt: "" }))));
      const yazi = h("div.zm-alt-yazi"); let k;
      /* her koşucunun hızı tura göre değişen dalgalı bir eğri; kazanan rastgele, hepsi süre bitince varır */
      const konum = (i, o) => { const s = d.yaris.tohum * 1000 + i * 17.3; const dal = Math.sin(o * 9 + s) * 0.06 + Math.sin(o * 23 + s * 2) * 0.03; const son = (i === Math.floor(d.yaris.tohum * KOS.length) ? 1 : 0.9 + ((s * 7) % 1) * 0.08); return Math.max(0, Math.min(1, o * son + dal * Math.sin(Math.PI * o))); };
      const ctl = sayac(d, api, (kalan, c) => { const o = c.oran(); const kos = pist.querySelectorAll(".zm-kosucu");
        kos.forEach((e, i) => { const p = kalan <= 0 ? (i === Math.floor(d.yaris.tohum * KOS.length) ? 1 : konum(i, 1)) : konum(i, o); e.style.left = `calc(${p * 100}% * .74)`; e.classList.toggle("kazandi", kalan <= 0 && i === Math.floor(d.yaris.tohum * KOS.length)); });
        yazi.textContent = kalan <= 0 && d.total ? "Kazanan: " + KOS[Math.floor(d.yaris.tohum * KOS.length)][1] + "!" : mmss(kalan); k.guncelle(); });
      k = kontroller(d, ctl);
      const yeni = h("button.btn.sm.c-chalk", { onclick: () => { d.yaris.tohum = Math.random(); ctl.sifirla(); } }, T.icon("dice"), "Yeni yarış");
      kap.append(pist, yazi, k); k.lastChild.append(yeni); return ctl;
    },
    aralik(kap, d, api) {
      d.ar = d.ar || { calis: 300, mola: 60, tekrar: 3, bas: 0, running: false, gecen: 0 };
      const a = d.ar; const ust = h("div.zm-ar-ust"), yazi = h("div.zm-dijital"), bar = h("div.zm-ar-bar");
      const say = (k, l, min, max, adim) => h("label.zm-ar-ayar", h("span", l), h("div.row", h("button.btn.sm.icon.c-chalk", { onclick: () => { a[k] = Math.max(min, a[k] - adim); api.save(); ciz(); } }, T.icon("minus")), h("b", { "data-k": k }), h("button.btn.sm.icon.c-chalk", { onclick: () => { a[k] = Math.min(max, a[k] + adim); api.save(); ciz(); } }, T.icon("plus"))));
      const oyna = h("button.btn.sm.c-leaf", { onclick: () => { T.sound.unlock(); if (a.running) { a.gecen += (Date.now() - a.bas) / 1000; a.running = false; } else { a.bas = Date.now(); a.running = true; } api.save(); ciz(); } });
      const gecen = () => a.gecen + (a.running ? (Date.now() - a.bas) / 1000 : 0);
      let sonEvre = null;
      function ciz() {
        const t = gecen(), tur = a.calis + a.mola, top = tur * a.tekrar;
        if (t >= top) { if (a.running) { a.running = false; a.gecen = top; api.save(); T.sound.alarm(d.ses || "zil"); } }
        const ti = Math.min(a.tekrar - 1, Math.floor(t / tur)), ic = t - ti * tur, calismada = ic < a.calis, bitti = t >= top;
        const evre = bitti ? "bitti" : (calismada ? "c" : "m") + ti; if (sonEvre && evre !== sonEvre && a.running && evre !== "bitti") T.sound.alarm(calismada ? "nazik" : "kus"); sonEvre = evre;
        ust.textContent = bitti ? "Bitti!" : (calismada ? "Çalışma" : "Mola") + " · " + (ti + 1) + ". tur / " + a.tekrar;
        ust.className = "zm-ar-ust " + (bitti ? "bitti" : calismada ? "calis" : "mola");
        yazi.textContent = bitti ? "0:00" : mmss(calismada ? a.calis - ic : tur - ic);
        bar.replaceChildren(...Array.from({ length: a.tekrar }, (_, i) => h("div.zm-ar-tur", h("i.c", { style: { flex: a.calis, opacity: i < ti || bitti ? .45 : 1 } }), h("i.m", { style: { flex: a.mola, opacity: i < ti || bitti ? .45 : 1 } }))));
        kap.querySelectorAll("[data-k]").forEach((b) => (b.textContent = b.dataset.k === "tekrar" ? a.tekrar + " tur" : mmss(a[b.dataset.k])));
        oyna.replaceChildren(T.icon(a.running ? "pause" : "play"), a.running ? "Durdur" : "Başlat");
      }
      kap.append(ust, yazi, bar, h("div.zm-ar-ayarlar", say("calis", "Çalışma", 30, 3600, 30), say("mola", "Mola", 10, 1200, 10), say("tekrar", "Tekrar", 1, 12, 1)),
        h("div.row", { style: { justifyContent: "center", gap: "6px" } }, oyna, h("button.btn.sm.icon.c-chalk", { "aria-label": "Sıfırla", onclick: () => { a.gecen = 0; a.running = false; api.save(); ciz(); } }, T.icon("reset"))));
      return { ciz };
    },
    takim(kap, d, api) {
      /* Takım saati: 2-6 takım. Sözü biten takım kendi kutusuna dokunur, süre sıradaki takıma geçer. */
      const HARF = "ABCDEF";
      d.tk = d.tk || { sure: 300, kalan: [300, 300], sira: -1, bas: 0, adlar: ["Takım A", "Takım B"] };
      const t = d.tk;
      const kalan = (i) => t.kalan[i] - (t.sira === i ? (Date.now() - t.bas) / 1000 : 0);
      const dondur = () => { if (t.sira >= 0) t.kalan[t.sira] = Math.max(0, kalan(t.sira)); };
      const gec = (i) => { dondur(); t.sira = i; t.bas = Date.now(); T.sound.pop && T.sound.pop(); api.save(); ciz(); };
      const sonraki = (i) => { const n = t.adlar.length; for (let k = 1; k <= n; k++) { const j = (i + k) % n; if (t.kalan[j] > 0) return j; } return -1; };
      const alan = h("div.zm-takimlar");
      let kutular = [];
      function kur() {
        alan.style.setProperty("--n", t.adlar.length);
        kutular = t.adlar.map((ad, i) => h("div.zm-takim", { role: "button", tabindex: 0, onclick: () => { if (t.sira === i) { const j = sonraki(i); if (j >= 0) gec(j); else { dondur(); t.sira = -1; api.save(); ciz(); } } else gec(i); } },
          h("input.zm-takim-ad", { value: ad, "aria-label": (i + 1) + ". takımın adı", onclick: (e) => e.stopPropagation(), onchange: (e) => { t.adlar[i] = e.target.value; api.save(); } }),
          h("b"), h("small", "Sözü bitince dokun"),
          t.adlar.length > 2 ? h("button.zm-takim-sil", { "aria-label": ad + " takımını çıkar", title: "Takımı çıkar", onclick: (e) => { e.stopPropagation(); dondur(); t.adlar.splice(i, 1); t.kalan.splice(i, 1); t.sira = t.sira === i ? -1 : t.sira > i ? t.sira - 1 : t.sira; if (t.sira >= 0) t.bas = Date.now(); api.save(); kur(); ciz(); } }, T.icon("close")) : null));
        alan.replaceChildren(...kutular);
        ekle.disabled = t.adlar.length >= 6;
      }
      function ciz() {
        kutular.forEach((kt, i) => { const k = Math.max(0, kalan(i)); kt.querySelector("b").textContent = mmss(k); kt.classList.toggle("aktif", t.sira === i); kt.classList.toggle("bitti", k <= 0);
          if (t.sira === i && k <= 0) { t.kalan[i] = 0; t.sira = -1; api.save(); T.sound.alarm(d.ses || "zil"); } });
      }
      const ekle = h("button.btn.sm.c-chalk", { onclick: () => { if (t.adlar.length >= 6) return; const kul = new Set(t.adlar); const harf = [...HARF].find((x) => !kul.has("Takım " + x)) || t.adlar.length + 1; t.adlar.push("Takım " + harf); t.kalan.push(t.sure); api.save(); kur(); ciz(); } }, T.icon("plus"), "Takım ekle");
      kap.append(alan, h("div.row", { style: { justifyContent: "center", gap: "6px", flexWrap: "wrap" } },
        h("button.btn.sm.c-leaf", { onclick: () => gec(t.sira >= 0 ? t.sira : Math.max(0, sonraki(-1))) }, T.icon("play"), "Başlat"),
        h("button.btn.sm.c-chalk", { onclick: () => { dondur(); t.sira = -1; api.save(); ciz(); } }, T.icon("pause"), "Durdur"),
        ekle,
        h("div.seg", [3, 5, 10].map((m) => h("button", { "aria-pressed": String(t.sure === m * 60), onclick: (e) => { t.sure = m * 60; t.kalan = t.adlar.map(() => m * 60); t.sira = -1; api.save(); e.currentTarget.parentNode.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === e.currentTarget))); ciz(); } }, m + " dk")))));
      kur();
      return { ciz };
    },
  };

  W.timer.title = "Zamanlayıcı"; W.timer.desc = "Kum saati, dijital, mum, kronometre, aralık ve takım saati";
  W.timer.w = Math.max(W.timer.w || 0, 460); W.timer.h = Math.max(W.timer.h || 0, 520);
  W.timer.render = function (body, w, api) {
    const d = w.data; d.mod = d.mod && d.mod !== "yaris" ? d.mod : "kum"; if (!d.total) { d.total = 300; d.left = 300; }
    d.sw = d.sw || { start: 0, acc: 0, running: false, laps: [] };
    body.style.gridTemplateRows = "auto 1fr"; body.style.gap = "8px";
    const sekme = h("div.zm-sekmeler", { role: "tablist" });
    const ic = h("div.zm-ic");
    const sesSec = h("label.zm-ses", { title: "Süre bitince çalacak ses" }, T.icon("speaker"),
      h("select", { "aria-label": "Bitiş sesi", onchange: (e) => { d.ses = e.target.value; api.save(); T.sound.alarm(d.ses); } }, T.sound.ALARMLAR.map(([k, l]) => h("option", { value: k, selected: (d.ses || "zil") === k ? true : null }, l))));
    const modSec = h("select.zm-mod-sec", { "aria-label": "Zamanlayıcı biçimi", onchange: (e) => { d.mod = e.target.value; api.save(); kur(); } }, MODLAR.map(([k, l]) => h("option", { value: k }, l)));
    body.append(h("div.zm-ust", sekme, modSec, sesSec), ic);
    let yerel = [], iv = 0;
    const subApi = Object.assign({}, api, { onDestroy: (f) => yerel.push(f) });
    function kur() {
      yerel.forEach((f) => { try { f(); } catch (e) {} }); yerel = []; clearInterval(iv); ic.replaceChildren(); ic.className = "zm-ic mod-" + d.mod; ic.removeAttribute("style");
      sekme.replaceChildren(...MODLAR.map(([k, l]) => h("button", { role: "tab", "aria-selected": String(d.mod === k), onclick: () => { d.mod = k; api.save(); kur(); } }, l)));
      modSec.value = d.mod;
      if (d.mod === "kum") return kumRender.call(W.timer, ic, w, subApi);
      if (d.mod === "kronometre") return kronoRender.call(W.stopwatch, ic, Object.assign({}, w, { data: d.sw }), subApi);
      const ctl = CIZ[d.mod](ic, d, subApi);
      iv = setInterval(() => ctl.ciz(), d.mod === "yaris" ? 120 : 250); ctl.ciz();
    }
    api.onDestroy(() => { yerel.forEach((f) => { try { f(); } catch (e) {} }); clearInterval(iv); });
    kur();
  };
})();
/* Kronometre artık zamanlayıcının içinde: ayrı listede görünmesin, eski panolardaki kronometreler yine açılır. */
T.widgets.stopwatch.group = "Gizli";
/* sürüm: önbellek yenileme */
