/* Hece Mutfağı: 1. sınıf ilk okuma.
   Müşteri resimli bir kurabiye siparişi getirir, altında boş hece yerleri var. Çocuk kavanozlardaki heceleri doğru sırayla hamur kazanına atar.
   Kelime tamamlanınca o şekilde bir kurabiye pişer (tilki kurabiyesi, elma kurabiyesi...).
   Kelimeler öğrenilen seslerle okunabilenlerden seçilir (ses cep kartları, kelime tabloları, resimli kelimeler).
   Otomatik konuşma yok; "Dinle" yalnızca basılınca çalışır. */
(function () {
  const { h } = T;
  const dep = () => { const s = T.store.get(), id = T.store.activeClass().id; return ((s.mutfak || {})[id]) || {}; };
  const depYaz = (fn) => T.store.update((s) => { const id = T.store.activeClass().id; s.mutfak = s.mutfak || {}; fn((s.mutfak[id] = s.mutfak[id] || {})); });
  const TARIF_SAY = 5;

  T.tools["hece-mutfagi"] = {
    back: "birinci", grades: [1, 1], title: "Hece Mutfağı", icon: "hece", tone: "tomato",
    short: "Siparişteki kelimeyi heceleri sırayla kazana atarak kur, kurabiyesi pişsin",
    render(host, api) {
      const IO = T.ilkOkuma; if (!IO) { host.append(h("p", "İlk okuma verisi yüklenemedi.")); return; }
      const PIC = new Map(IO.PICS), BANKA = T.KELIME_BANKASI || {};
      const kap = h("div.ks-kap"), yuk = h("div.ot3-yuk", h("div.ot3-yuk-ic"), "Mutfak hazırlanıyor...");
      const ust = h("div.ks-ust"), tarif = h("div.hm-tarif"), raf = h("div.hm-raf"), alt = h("div.ks-alt");
      const sahneEl = h("div.ks-sahne.hm-sahne", kap, tarif, raf, ust, alt, yuk);
      host.append(sahneEl);
      Promise.all([T.sahne3(kap, { kamera: [0, 1.6, 6.2], bak: [0, 1.05, 0], fov: 36, env: ["#FFF6E8", "#F1D9B8", "#7A5638"] }, api), T.modelYukle("mutfak").catch(() => null), T.modelYukle("kiz"), T.modelYukle("erkek")])
        .then(([c, mut]) => { if (!c) { yuk.textContent = "Bu cihazda 3B çizim açılamadı."; return; } kur(c, mut).catch((e) => { console.error(e); yuk.textContent = "Mutfak kurulamadı."; }); })
        .catch((e) => { console.error(e); yuk.textContent = "Mutfak yüklenemedi. Sayfayı yenileyip tekrar dene."; });

      async function kur(c, mut) {
        const { THREE, sahne, kamera, r } = c;
        r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMappingExposure = 1.08;
        /* duvar ve zemin: sıcak, yumuşak */
        const duvarD = c.doku(512, 512, (x, w) => { const g = x.createLinearGradient(0, 0, 0, w); g.addColorStop(0, "#F8E7CF"); g.addColorStop(1, "#EFD2AE"); x.fillStyle = g; x.fillRect(0, 0, w, w); x.fillStyle = "rgba(255,255,255,.18)"; for (let i = 0; i < 8; i++) x.fillRect(i * 64 + 30, 0, 6, w); });
        const duvar = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), new THREE.MeshStandardMaterial({ map: duvarD, roughness: 1 })); duvar.position.set(0, 5, -2.2); duvar.receiveShadow = true; sahne.add(duvar);
        const zeminD = c.doku(512, 512, (x, w) => { const n = 8, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = (i + j) % 2 ? "#E9C9A0" : "#F6E2C4"; x.fillRect(i * s, j * s, s, s); } x.strokeStyle = "rgba(120,80,40,.15)"; x.lineWidth = 3; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo(i * s, 0); x.lineTo(i * s, w); x.moveTo(0, i * s); x.lineTo(w, i * s); x.stroke(); } });
        zeminD.wrapS = zeminD.wrapT = THREE.RepeatWrapping; zeminD.repeat.set(6, 4);
        const zemin = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshStandardMaterial({ map: zeminD, roughness: 0.85 })); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
        sahne.add(new THREE.HemisphereLight(0xfff4e0, 0x8a6040, 1.15));
        const gun = new THREE.DirectionalLight(0xffe9c8, 2.4); gun.position.set(3, 6, 5); gun.castShadow = true; gun.shadow.mapSize.set(2048, 2048); Object.assign(gun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -2 }); gun.shadow.bias = -0.0004; sahne.add(gun);
        const sicak = new THREE.PointLight(0xffa040, 0, 3, 2); sahne.add(sicak);
        /* mutfak tezgâhı (Meshy) ya da basit yedek */
        let tencere = new THREE.Vector3(0.1, 1.2, 0.2);
        if (mut) {
          const k = mut.g.scene.clone(true); k.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
          const b = new THREE.Box3().setFromObject(k), bo = b.getSize(new THREE.Vector3()), sc = 2.6 / bo.y; k.scale.multiplyScalar(sc);
          const b2 = new THREE.Box3().setFromObject(k), m2 = b2.getCenter(new THREE.Vector3()); k.position.x -= m2.x; k.position.z -= m2.z + 0.6; k.position.y -= b2.min.y;
          const g = new THREE.Group(); g.add(k); g.position.set(0.35, 0, 0); sahne.add(g);
          const b3 = new THREE.Box3().setFromObject(g), bo3 = b3.getSize(new THREE.Vector3());
          tencere = new THREE.Vector3(b3.min.x + bo3.x * 0.5, b3.min.y + bo3.y * 0.47, b3.max.z - bo3.z * 0.3);
        } else {
          const M = (cl) => new THREE.MeshStandardMaterial({ color: cl, roughness: 0.7 });
          const tez = new THREE.Mesh(T.yuvKutu(THREE, 3, 1, 1.1, 0.06), M(0xb5703e)); tez.position.set(0.3, 0.5, -0.6); tez.castShadow = tez.receiveShadow = true; sahne.add(tez);
          const ten = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.45, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0xc8682e, metalness: 0.4, roughness: 0.4, side: THREE.DoubleSide })); ten.position.set(0.3, 1.23, -0.5); sahne.add(ten);
          tencere = new THREE.Vector3(0.3, 1.45, -0.5);
        }
        sicak.position.copy(tencere).add(new THREE.Vector3(0, 0.2, 0.3));
        /* buhar */
        const buharD = c.doku(64, 64, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, w, w); });
        const buharlar = []; for (let i = 0; i < 16; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: buharD, transparent: true, depthWrite: false, opacity: 0 })); s.userData.t = Math.random() * 2; sahne.add(s); buharlar.push(s); }
        let buharGuc = 0.15;
        /* karakterler: aşçı kız, müşteri erkek */
        const asci = await T.karakter3B(c, "kiz", { boy: 1.25 }), musteri = await T.karakter3B(c, "erkek", { boy: 1.3 });
        asci.kok.position.set(-1.75, 0, 0.9); asci.kok.rotation.y = 0.5; sahne.add(asci.kok); asci.oynat("dur");
        musteri.kok.position.set(2.6, 0, 1.4); musteri.kok.rotation.y = -0.6; sahne.add(musteri.kok); musteri.kok.visible = false;
        let musteriHedef = null;
        c.kare = (dt) => {
          asci.guncelle(dt); musteri.guncelle(dt);
          if (musteriHedef) { const p = musteri.kok.position, d = musteriHedef.x - p.x; if (Math.abs(d) < 0.03) { p.x = musteriHedef.x; const f = musteriHedef.bitti; musteriHedef = null; f && f(); } else p.x += Math.sign(d) * Math.min(Math.abs(d), dt * 1.3); }
          buharlar.forEach((s) => { s.userData.t += dt * (0.5 + buharGuc); const t = s.userData.t % 2, k = t / 2; s.position.set(tencere.x + Math.sin(t * 3 + s.id) * 0.12 * k, tencere.y + 0.1 + k * (0.6 + buharGuc * 0.6), tencere.z); const sc = 0.18 + k * (0.35 + buharGuc * 0.3); s.scale.set(sc, sc, sc); s.material.opacity = Math.sin(k * Math.PI) * (0.25 + buharGuc * 0.55); });
          sicak.intensity += ((buharGuc > 0.5 ? 6 : 1.2) - sicak.intensity) * Math.min(1, dt * 3);
        };
        const ekranda = (v) => { const p = v.clone().project(kamera), b = kap.getBoundingClientRect(); return { x: (p.x * 0.5 + 0.5) * b.width, y: (-p.y * 0.5 + 0.5) * b.height }; };
        yuk.remove();

        /* kelime havuzu */
        const L = () => IO.learned();
        const sozcukler = () => { const s = new Set(IO.PICS.map(([w]) => w)); Object.values(BANKA).forEach((v) => { (v.kelime || []).forEach((w) => w === T.trLower(w) && s.add(w)); (v.tablo || []).forEach((w) => s.add(w)); }); return [...s]; };
        const havuz = () => { const l = L(), uz = dep().uzunluk || "2", resimli = dep().tur !== "hepsi";
          return sozcukler().filter((w) => /^[a-zçğıöşü]+$/.test(w) && IO.okWord(w, l)).filter((w) => { const n = T.heceler(w).length; return uz === "2" ? n === 2 : uz === "3" ? n === 3 : n >= 2 && n <= 4; }).filter((w) => !resimli || PIC.has(w)); };
        const deste = []; let son = "";
        const cek = () => { if (!deste.length) deste.push(...T.shuffle(havuz())); if (!deste.length) return null; let i = deste.findIndex((w) => w !== son); if (i < 0) i = 0; son = deste.splice(i, 1)[0]; return son; };
        const heceHavuzu = () => [...new Set(havuz().concat(sozcukler().filter((w) => IO.okWord(w, L()))).flatMap((w) => T.heceler(w)))];

        let kelime = "", hs = [], dolu = 0, pisen = 0, kilit = false, okuyan = null;
        function ustCiz() {
          const d = dep(), seg = (ad, deger, secenek, yaz) => h("div.ks-okuyan-sec", h("span", ad), h("div.seg", secenek.map(([v, t]) => h("button", { "aria-pressed": String(v === deger), onclick: () => { depYaz((k) => (k[yaz] = v)); deste.length = 0; ustCiz(); yeniTarif(); } }, t))));
          ust.replaceChildren(h("div.ks-araclar",
            seg("Hece", d.uzunluk || "2", [["2", "İki"], ["3", "Üç"], ["k", "Karışık"]], "uzunluk"),
            seg("Sipariş", d.tur || "resim", [["resim", "Resimli"], ["hepsi", "Hepsi"]], "tur"),
            h("button.ks-tam", { onclick: okuyanSec }, T.icon("name"), okuyan ? "Okuyan: " + okuyan : "Kim okuyacak?"),
            h("button.ks-tam", { onclick: tamEkran }, T.icon("full"), "Tam ekran")));
        }
        const tamEkran = () => { try { document.fullscreenElement ? document.exitFullscreen() : (sahneEl.requestFullscreen || sahneEl.webkitRequestFullscreen).call(sahneEl); } catch (e) { T.toast("Bu ortamda tam ekran kapalı"); } };
        /* okuyan: sınıf listesinden çarkla */
        let carkPano = null, ck = null, sira = [];
        async function okuyanSec() {
          const cls = T.store.activeClass(), gun = ((T.store.get().attendance || {})[cls.id] || {})[T.isoDate()] || {};
          const gelen = (cls.students || []).filter((st) => gun[st.id] !== "yok").map((st) => st.name);
          if (!gelen.length) { T.toast("Sınıf listesi boş. Öğrencileri Sınıfım sayfasından ekleyebilirsin."); return; }
          if (!sira.some((n) => gelen.includes(n))) sira = gelen.slice(); sira = sira.filter((n) => gelen.includes(n));
          if (!carkPano) carkPano = h("div.ks-cark", { "data-b": "1" }, h("div.ks-cark-bas", h("b", "Kim okuyacak?")), h("div.ks-cark-kap"), h("div.ks-cark-sonuc"), h("div.ks-yan"));
          sahneEl.append(carkPano); carkPano.hidden = false;
          const sonuc = carkPano.querySelector(".ks-cark-sonuc"), yan = carkPano.querySelector(".ks-yan"); sonuc.textContent = "";
          if (!ck) ck = await T.cark3B(carkPano.querySelector(".ks-cark-kap"), null, { sure: 3.2, arka: ["#FFFFFF", "#F3EEE4"] });
          const bitir = (ad) => { okuyan = ad; carkPano.hidden = true; ustCiz(); };
          if (!ck) return bitir(T.pick(sira));
          ck.kur(sira.map((ad) => ({ ad })));
          yan.replaceChildren(h("button.ks-yeni", { onclick: () => { if (ck.donuyor()) return; const i = Math.floor(Math.random() * sira.length); ck.cevir(i, () => { const ad = sira[i]; sonuc.textContent = ad; T.sound.ok(); sira = sira.filter((n) => n !== ad); setTimeout(() => bitir(ad), 1200); }); } }, T.icon("turn"), "Çarkı çevir"),
            h("button.ot-b.dinle", { onclick: () => (carkPano.hidden = true) }, "Kapat"));
        }

        function yeniTarif() {
          kelime = cek(); dolu = 0; kilit = false; buharGuc = 0.15;
          if (!kelime) {
            tarif.replaceChildren(h("div.hm-kart", h("b", "Sipariş yok"), h("p", "Bu ayarla okunabilen kelime yok. Daha çok ses öğrenince ya da \"Hepsi\" seçilince siparişler gelir.")));
            tarif.classList.add("acik"); raf.replaceChildren(); alt.replaceChildren(); return;
          }
          hs = T.heceler(kelime);
          const yabanci = T.shuffle(heceHavuzu().filter((x) => !hs.includes(x) && x.length <= 3)).slice(0, hs.length >= 3 ? 3 : 2);
          const ters = hs.length === 2 && hs[0].length === 2 ? hs[0][1] + hs[0][0] : null;
          if (ters && !hs.includes(ters) && /[aeıioöuü]/.test(ters) && IO.okWord(ters, L())) yabanci[0] = ters;
          /* müşteri kapıdan gelir */
          musteri.kok.visible = true; musteri.kok.position.x = 4.6; musteri.kok.rotation.y = -Math.PI / 2; musteri.oynat("yuru");
          tarif.classList.remove("acik"); raf.replaceChildren(); alt.replaceChildren();
          musteriHedef = { x: 2.3, bitti: () => { musteri.kok.rotation.y = -0.6; musteri.oynat("salla"); setTimeout(() => musteri.oynat("dur"), 1800); tarifCiz(); rafCiz(T.shuffle(hs.concat(yabanci))); } };
        }
        function tarifCiz() {
          const resim = PIC.get(kelime);
          tarif.replaceChildren(h("div.hm-kart",
            h("div.hm-kart-bas", h("b", "Sipariş " + Math.min(TARIF_SAY, pisen + 1) + " / " + TARIF_SAY), okuyan ? h("span", okuyan + " okuyor") : null),
            h("div.hm-govde", resim ? h("div.hm-resim", resim) : h("div.hm-resim.yok", T.icon("speaker")),
            h("div.hm-sag", h("div.hm-yerler", hs.map((x, i) => h("span.hm-yer" + (i < dolu ? ".dolu" : ""), i < dolu ? x : ""))),
            h("div.ks-yan", h("button.ot-b.dinle", { onclick: () => T.speak(kelime) }, T.icon("speaker"), "Dinle"),
              resim ? null : h("button.ot-b.dinle", { onclick: (e) => { e.currentTarget.replaceWith(h("b.hm-ipucu", kelime)); } }, T.icon("eye"), "Kelimeyi göster"))))));
          tarif.classList.add("acik");
        }
        const RENK = ["#E76F51", "#F4A261", "#2A9D8F", "#8E7DBE", "#E9C46A", "#90BE6D", "#5FA8D3"];
        function rafCiz(liste) {
          raf.replaceChildren(...liste.map((x, i) => {
            const b = h("button.hm-kavanoz", { style: { "--kr": RENK[i % RENK.length] }, onclick: () => sec(x, b) }, h("i.hm-kapak"), h("span.hm-etiket", x));
            return b;
          }));
        }
        function sec(x, b) {
          if (kilit || b.classList.contains("bos")) return;
          if (x !== hs[dolu]) {
            b.classList.remove("salla"); void b.offsetWidth; b.classList.add("salla"); T.sound.no();
            asci.oynat("hayir", { dongu: false }).then(() => asci.oynat("dur")); return;
          }
          kilit = true; b.classList.add("bos");
          /* hece kavanozdan tencereye uçar */
          const kb = kap.getBoundingClientRect(), bb = b.getBoundingClientRect(), hed = ekranda(tencere);
          const ucan = h("span.hm-ucan", x); ucan.style.left = bb.left - kb.left + bb.width / 2 + "px"; ucan.style.top = bb.top - kb.top + 10 + "px"; sahneEl.append(ucan);
          requestAnimationFrame(() => { ucan.style.transform = `translate(${hed.x - (bb.left - kb.left + bb.width / 2)}px, ${hed.y - (bb.top - kb.top + 10)}px) scale(.4)`; ucan.style.opacity = "0.2"; });
          asci.oynat("konus", { dongu: false }).then(() => asci.oynat("dur"));
          setTimeout(() => {
            ucan.remove(); dolu++; buharGuc = 0.15 + (dolu / hs.length) * 0.4; T.sound.ok(); tarifCiz(); kilit = false;
            if (dolu === hs.length) pisti();
          }, 650);
        }
        function pisti() {
          kilit = true; buharGuc = 1; pisen++;
          depYaz((k) => (k.toplam = (k.toplam || 0) + 1));
          const dv = h("button.ks-yeni", { onclick: () => devam() }, T.icon("next"), pisen >= TARIF_SAY ? "Menüyü bitir" : "Sıradaki müşteri");
          const res = PIC.get(kelime);
          raf.replaceChildren(res ? h("div.hm-kurabiye", res) : null, h("div.hm-pisti", h("b", kelime), h("span", res ? "kurabiyesi hazır!" : "Kelimeyi kurduk!")), dv);
          asci.oynat("sevin", { dongu: false }).then(() => asci.oynat("dur")); musteri.oynat("zipla", { dongu: false }).then(() => musteri.oynat("dur"));
          T.konfeti && T.konfeti();
          const devam = () => {
            okuyan = null; ustCiz();
            musteri.kok.rotation.y = Math.PI / 2; musteri.oynat("yuru");
            musteriHedef = { x: 4.8, bitti: () => { musteri.kok.visible = false; if (pisen >= TARIF_SAY) menuBitti(); else yeniTarif(); } };
            raf.replaceChildren();
          };
        }
        function menuBitti() {
          tarif.classList.remove("acik"); buharGuc = 0.15;
          asci.oynat("dans");
          raf.replaceChildren(h("div.hm-pisti", h("b", "Bugünkü siparişler tamam!"), h("span", TARIF_SAY + " sipariş hazır. Bu sınıfın toplamı: " + (dep().toplam || 0))), h("button.ks-yeni", { onclick: () => { pisen = 0; asci.oynat("dur"); yeniTarif(); } }, T.icon("reset"), "Yeni menü"));
        }
        T._mutfak = { kelime: () => kelime, hs: () => hs, sec: (x) => { const b = [...raf.querySelectorAll(".hm-kavanoz")].find((e) => e.textContent === x && !e.classList.contains("bos")); b && b.click(); }, havuz, tencere, ekranda };
        ustCiz(); yeniTarif();
      }
    },
  };
})();
