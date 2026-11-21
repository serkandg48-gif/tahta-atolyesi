/* Küp yapı oyunları: birim küplerden yapılara farklı yönlerden bakma.
   1) Hangi yönden? Yapıyı çevir, istenen görünümü seç.  2) Görünüme göre kur: ön, sağ ve üst görünüme uyan yapıyı kur. */
(function () {
  const { h } = T;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const N = 3, RENK = [0x4F9CF0, 0xF2A93B, 0x3FA36B, 0xE4553F, 0x9B6BE0, 0xF06FA8];
  /* yapı: H[x][z] yükseklik; x soldan sağa, z arkadan öne (z=N-1 öndedir) */
  const yeniYapi = () => {
    for (;;) {
      const H = Array.from({ length: N }, () => Array(N).fill(0));
      const say = rnd(4, 8); let k = 0; H[1][1] = 1; k = 1;
      while (k < say) { const x = rnd(0, N - 1), z = rnd(0, N - 1); const kom = (H[x - 1] || [])[z] || (H[x + 1] || [])[z] || H[x][z - 1] || H[x][z + 1] || H[x][z]; if (!kom || H[x][z] >= 3) continue; H[x][z]++; k++; }
      const v = gorunumler(H); if (new Set(Object.values(v).map(String)).size >= 4) return H;
    }
  };
  const kupSay = (H) => H.flat().reduce((a, b) => a + b, 0);
  /* görünümler: dizi, soldan sağa sütun yükseklikleri; üst: satır satır dolu mu (üstte arka, altta ön) */
  function gorunumler(H) {
    const r = (n) => [...Array(N).keys()].map(n);
    const on = r((x) => Math.max(...H[x]));
    const sag = r((i) => { const z = N - 1 - i; return Math.max(...H.map((c) => c[z])); });
    const ust = r((z) => r((x) => (H[x][z] > 0 ? 1 : 0)));
    return { on: JSON.stringify(on), arka: JSON.stringify([...on].reverse()), sag: JSON.stringify(sag), sol: JSON.stringify([...sag].reverse()), ust: JSON.stringify(ust) };
  }
  const YON = { on: "önden", arka: "arkadan", sag: "sağdan", sol: "soldan", ust: "üstten" };
  /* 2B görünüm çizimi */
  function gorunumSvg(v, tur, renk = "#4F9CF0") {
    const a = JSON.parse(v), k = 30, ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", `-4 -4 ${N * k + 8} ${N * k + 8}`); svg.setAttribute("class", "ky-gor");
    const kare = (x, y, dolu) => { const r = document.createElementNS(ns, "rect"); Object.entries({ x, y, width: k, height: k, rx: 3, fill: dolu ? renk : "none", stroke: dolu ? "#1B2A4A" : "#d5dbe5", "stroke-width": dolu ? 2.5 : 1.2, "stroke-dasharray": dolu ? "" : "3 3" }).forEach(([a, b]) => r.setAttribute(a, b)); svg.append(r); };
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      if (tur === "ust") kare(i * k, j * k, a[j][i]);
      else kare(i * k, (N - 1 - j) * k, j < a[i]);
    }
    return svg;
  }
  /* 3B yapı */
  function yapi3B(kap, H, opt = {}) {
    const durum = { H, guncelle: null };
    T.sahne3(kap, { kamera: [5.2, 4.6, 6.4], bak: [0, 0.9, 0], fov: 36, env: ["#FFFFFF", "#DCE8F6", "#3C4A60"], sigdir: 7.5, oran: 1.4 }, null).then((c) => {
      if (!c) { kap.append(h("p.hint", "3B görünüm açılamadı.")); return; }
      const THREE = c.THREE, g = new THREE.Group(); c.sahne.add(g);
      c.sahne.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.3)); const dl = new THREE.DirectionalLight(0xffffff, 1.9); dl.position.set(4, 8, 5); c.sahne.add(dl);
      const zemin = new THREE.Mesh(new THREE.BoxGeometry(N + 0.6, 0.12, N + 0.6), new THREE.MeshStandardMaterial({ color: 0xE9EEF5, roughness: 0.9 })); zemin.position.y = -0.06; g.add(zemin);
      /* ön işareti */
      const ok = c.doku(256, 64, (x, w, hh) => { x.fillStyle = "#1B2A4A"; x.font = "800 40px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("ÖN", w / 2, hh / 2); });
      const onYazi = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), new THREE.MeshBasicMaterial({ map: ok, transparent: true })); onYazi.rotation.x = -Math.PI / 2; onYazi.position.set(0, 0.01, N / 2 + 0.55); g.add(onYazi);
      const geo = T.yuvKutu(THREE, 0.96, 0.96, 0.96, 0.08), kenar = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.97, 0.97, 0.97));
      const mats = RENK.map((r) => new THREE.MeshPhysicalMaterial({ color: r, roughness: 0.35, clearcoat: 0.6 })), cizgiM = new THREE.LineBasicMaterial({ color: 0x1B2A4A, transparent: true, opacity: 0.35 });
      const kupler = new THREE.Group(); g.add(kupler);
      durum.guncelle = (H2) => { durum.H = H2; kupler.clear();
        for (let x = 0; x < N; x++) for (let z = 0; z < N; z++) for (let y = 0; y < H2[x][z]; y++) {
          const m = new THREE.Mesh(geo, mats[(x + z * 2 + y) % mats.length]); m.position.set(x - (N - 1) / 2, y + 0.5, z - (N - 1) / 2); kupler.add(m);
          const e = new THREE.LineSegments(kenar, cizgiM); e.position.copy(m.position); kupler.add(e);
        } };
      durum.guncelle(durum.H);
      g.rotation.y = opt.don != null ? opt.don : A - 0.6;
      let surt = null, hedef = null;
      c.r.domElement.style.touchAction = "none";
      c.r.domElement.addEventListener("pointerdown", (e) => { surt = e.clientX; hedef = null; });
      addEventListener("pointermove", (e) => { if (surt == null) return; g.rotation.y += (e.clientX - surt) * 0.012; surt = e.clientX; });
      addEventListener("pointerup", () => (surt = null));
      durum.cevir = (aci) => (hedef = aci);
      c.kare = (dt) => { if (hedef != null) { const f = hedef - g.rotation.y; g.rotation.y += f * Math.min(1, dt * 5); if (Math.abs(f) < 0.002) hedef = null; } };
    });
    return durum;
  }
  const A = Math.atan2(5.2, 6.4), ACI = { on: A, sag: A - Math.PI / 2, arka: A - Math.PI, sol: A + Math.PI / 2, ust: A - 0.6 };
  const yonDugmeleri = (d) => h("div.ky-yonler", [["Önden", ACI.on], ["Sağdan", ACI.sag], ["Arkadan", ACI.arka], ["Soldan", ACI.sol], ["Çapraz", ACI.ust]].map(([l, a]) => h("button.btn.sm.c-chalk", { onclick: () => d.cevir && d.cevir(a) }, l)));

  const oyunlar = {
    "kup-gorunum": { ad: "Küp yapının görünümleri", ikon: "kup", renk: "#2F7FE0", renk2: "#DCEBFF", tur: 8, giris: "Yapıyı parmağınla çevir. İstenen yönden nasıl görünür?",
      yeni(a, tur) {
        const H = yeniYapi(), v = gorunumler(H), yonlar = tur < 3 ? ["on", "ust", "sag"] : ["on", "arka", "sag", "sol", "ust"], yon = yonlar[rnd(0, yonlar.length - 1)];
        a.soru("Bu yapı " + YON[yon] + " bakınca nasıl görünür?");
        const kap = h("div.ky-3b"), d = yapi3B(kap, H); a.sahne.append(h("div.ky-sahne", kap, yonDugmeleri(d)));
        const turu = yon === "ust" ? "ust" : "yan";
        let aday = [v[yon]];
        const ekle = (x) => { if (x && !aday.includes(x) && aday.length < 4) aday.push(x); };
        Object.keys(v).filter((k) => k !== yon && (k === "ust") === (yon === "ust")).forEach((k) => ekle(v[k]));
        let dene = 0;
        while (aday.length < 4 && dene++ < 60) { const b = JSON.parse(v[yon]);
          if (turu === "ust") { const i = rnd(0, N - 1), j = rnd(0, N - 1); b[i][j] = 1 - b[i][j]; if (b.flat().some(Boolean)) ekle(JSON.stringify(b)); }
          else { const i = rnd(0, N - 1); b[i] = Math.max(0, Math.min(3, b[i] + (Math.random() < 0.5 ? 1 : -1))); if (b.some(Boolean)) ekle(JSON.stringify(b)); } }
        aday = aday.sort(() => Math.random() - 0.5);
        a.alt.replaceChildren(h("div.ky-secenek", aday.map((x) => h("button.ky-dug", { onclick: (e) => { if (x === v[yon]) { e.currentTarget.classList.add("iyi"); d.cevir && d.cevir(ACI[yon]); a.dogru(); } else { e.currentTarget.classList.add("kotu"); e.currentTarget.disabled = true; a.yanlis(yon === "ust" ? "Yapıya tam tepeden baktığını düşün: hangi kareler dolu?" : "Önce yapıyı o yöne çevir, sonra en yüksek sütunlara bak."); } } }, gorunumSvg(x, turu)))));
      } },
    "kup-kur": { ad: "Görünüme göre kur", ikon: "kup", renk: "#0E8A8A", renk2: "#D6F3F3", tur: 5, giris: "Görünümlere bak, aynı yapıyı küplerle kur!",
      yeni(a, tur) {
        const H = yeniYapi(), v = gorunumler(H), bos = Array.from({ length: N }, () => Array(N).fill(0));
        a.soru("Önden, sağdan ve üstten görünüşü bu olan yapıyı kur. Kareye her dokunuşta bir küp eklenir.");
        const hedefler = h("div.ky-hedef", [["on", "Önden"], ["sag", "Sağdan"], ["ust", "Üstten"]].map(([k, l]) => h("figure", gorunumSvg(v[k], k === "ust" ? "ust" : "yan", "#0E8A8A"), h("figcaption", l))));
        const kap = h("div.ky-3b"), d = yapi3B(kap, bos.map((r) => r.slice()));
        const izgara = h("div.ky-izgara");
        const ciz = () => izgara.replaceChildren(...[...Array(N * N).keys()].map((i) => { const x = i % N, z = Math.floor(i / N), n = d.H[x][z];
          return h("button.ky-hucre" + (n ? ".dolu" : ""), { "aria-label": (z + 1) + ". sıra " + (x + 1) + ". sütun, " + n + " küp", onclick: () => { d.H[x][z] = (n + 1) % 4; d.guncelle ? d.guncelle(d.H) : null; ciz(); } }, n ? String(n) : ""); }));
        ciz();
        a.sahne.append(h("div.ky-kur", hedefler, h("div.ky-sahne", kap, yonDugmeleri(d)), h("div.ky-ust-plan", h("small", "Üstten plan (aşağısı ön)"), izgara)));
        a.alt.replaceChildren(h("div.row", { style: { justifyContent: "center", gap: "8px" } },
          h("button.btn.c-chalk", { onclick: () => { d.H = bos.map((r) => r.slice()); d.guncelle && d.guncelle(d.H); ciz(); } }, T.icon("reset"), "Temizle"),
          h("button.btn.big.c-leaf", { onclick: () => { const s = gorunumler(d.H);
            if (s.on === v.on && s.sag === v.sag && s.ust === v.ust) a.dogru(kupSay(d.H) === kupSay(H) ? "Aynı yapı oldu!" : "Görünümler tuttu! " + kupSay(d.H) + " küp kullandın.");
            else a.yanlis(s.ust !== v.ust ? "Üstten görünüşü karşılaştır: hangi karelerde küp var?" : s.on !== v.on ? "Önden görünüşte sütun yükseklikleri farklı." : "Sağdan görünüşü kontrol et."); } }, T.icon("check"), "Kontrol et")));
      } },
  };
  Object.entries(oyunlar).forEach(([id, o], i) => {
    T.tools[id] = { cat: "oyun", ilk: 40 + i, title: o.ad, icon: o.ikon, ikon3: "kup", tone: "sky", grades: [2, 3, 4, 5], short: o.giris.replace(/[!.]+$/, ""), render(host) { T.oyunKabuk(host, Object.assign({ baslik: o.ad, sahne: "sinif" }, o)); } };
  });
})();
