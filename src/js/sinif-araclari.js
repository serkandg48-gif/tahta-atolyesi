/* Sınıf yönetimi kolaylaştırıcıları: Kim getirdi?, Hareket molası çarkı, Dikkat çağrıları, Sıraya geçme. */
(function () {
  const { h } = T; const W = T.widgets;
  const bugunYok = (c) => ((T.store.get().attendance[c.id] || {})[T.isoDate()] || {});

  /* ---------- Kim getirdi? (Sınıfım sekmesi) ---------- */
  const HAZIR = ["İzin belgesi", "Kütüphane kitabı", "Ödev defteri", "Gezi ücreti", "Beden eğitimi kıyafeti", "Okuma kitabı"];
  T.kimGetirdi = function (area, s, c) {
    const listeler = ((s.getirdi || {})[c.id] || []);
    const yaz = (fn) => T.store.update((st) => { st.getirdi = st.getirdi || {}; st.getirdi[c.id] = st.getirdi[c.id] || []; fn(st.getirdi[c.id]); });
    let secili = T.kimGetirdi.secili && listeler.find((l) => l.id === T.kimGetirdi.secili) ? T.kimGetirdi.secili : (listeler[0] || {}).id;
    const yeni = (ad) => { ad = (ad || "").trim(); if (!ad) return; const id = "g" + Date.now().toString(36); yaz((l) => l.unshift({ id, ad, tarih: T.isoDate(), v: {} })); T.kimGetirdi.secili = id; T.route(); };
    const giris = h("input.in", { placeholder: "Ne toplanıyor? Ör. Gezi izin belgesi", "aria-label": "Yeni liste adı", onkeydown: (e) => { if (e.key === "Enter") yeni(e.target.value); } });
    area.append(h("div.card", { style: { padding: "14px 16px", marginBottom: "14px" } },
      h("div.row", { style: { gap: "8px", flexWrap: "wrap" } }, giris, h("button.btn.c-leaf", { onclick: () => yeni(giris.value) }, T.icon("plus"), "Liste aç")),
      h("div.row", { style: { gap: "6px", flexWrap: "wrap", marginTop: "8px" } }, h("span.hint", "Hızlı:"), HAZIR.map((a) => h("button.btn.sm.c-chalk", { onclick: () => yeni(a) }, a)))));
    const L = listeler.find((l) => l.id === secili);
    if (!L) { area.append(h("p.hint", "Bir şey toplarken liste aç. Getirenlerin adına dokun; kimin eksik olduğu hemen görünür.")); return; }
    if (listeler.length > 1) area.append(h("div.seg", { style: { marginBottom: "12px", flexWrap: "wrap" } }, listeler.slice(0, 8).map((l) => h("button", { "aria-pressed": String(l.id === secili), onclick: () => { T.kimGetirdi.secili = l.id; T.route(); } }, l.ad))));
    const yok = bugunYok(c), getiren = c.students.filter((st) => L.v[st.id]), eksik = c.students.filter((st) => !L.v[st.id]);
    const tarih = new Date(L.tarih + "T12:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    area.append(
      h("div.kg-bas", h("div", h("h2", L.ad), h("span.hint", tarih + " tarihinde açıldı")), h("div.kg-sayac", h("b", getiren.length), " / " + c.students.length, h("span", "getirdi")),
        h("div.kg-bar", h("i", { style: { width: (c.students.length ? (getiren.length / c.students.length) * 100 : 0) + "%" } }))),
      h("div.kg-izgara", c.students.map((st) => h("button.kg-ogr" + (L.v[st.id] ? ".on" : "") + (yok[st.id] === "yok" ? ".yok" : ""), { "aria-pressed": String(!!L.v[st.id]), onclick: () => { yaz((l) => { const x = l.find((q) => q.id === L.id); if (x.v[st.id]) delete x.v[st.id]; else x.v[st.id] = 1; }); T.sound.pop(); T.route(); } },
        T.avatar(st.name, 40), h("span", st.name), L.v[st.id] ? h("em", "✓") : yok[st.id] === "yok" ? h("small", "bugün yok") : null))),
      h("div.kg-eksik", h("b", eksik.length ? "Eksik (" + eksik.length + "): " : "Herkes getirdi. 🎉"), eksik.map((st) => st.name).join(", "),
        h("div.row", { style: { gap: "8px", marginTop: "10px", flexWrap: "wrap" } },
          eksik.length ? h("button.btn.sm.c-chalk", { onclick: () => { const m = L.ad + " henüz gelmeyenler: " + eksik.map((st) => st.name).join(", "); (navigator.clipboard ? navigator.clipboard.writeText(m) : Promise.reject()).then(() => T.toast && T.toast("Eksikler panoya kopyalandı."), () => T.toast && T.toast(m)); } }, T.icon("text"), "Eksikleri kopyala") : null,
          h("button.btn.sm.c-chalk", { onclick: () => { yaz((l) => { const x = l.find((q) => q.id === L.id); c.students.forEach((st) => (x.v[st.id] = 1)); }); T.route(); } }, T.icon("check"), "Hepsini işaretle"),
          h("button.btn.sm.c-chalk", { onclick: async () => { if (await T.confirm("“" + L.ad + "” listesi silinsin mi?")) { yaz((l) => l.splice(l.findIndex((q) => q.id === L.id), 1)); T.kimGetirdi.secili = null; T.route(); } } }, T.icon("reset"), "Listeyi sil"))),
      h("p.hint", { style: { marginTop: "8px" } }, "Eksik listesi yalnızca senin ekranında. Tahtaya yansıtırken çocuk adlarını göstermek istemezsen bu sekmeyi kapatman yeterli."));
  };

  /* ---------- Hareket molası çarkı ---------- */
  const MOLA = [
    ["🦩", "Flamingo dengesi", "Tek ayak üstünde 15 saniye dur, sonra öbür ayağa geç.", "hareket"],
    ["🐸", "Kurbağa sıçraması", "Yerinde 10 kez kurbağa gibi sıçra.", "hareket"],
    ["🎈", "Balon nefesi", "Dört sayıda burnundan al, karnını balon gibi şişir, dört sayıda ver. Beş kez.", "nefes"],
    ["🌳", "Ağaç duruşu", "Ayak tabanını öbür bacağına daya, kolların dal olsun. Rüzgârda sallan ama devrilme.", "nefes"],
    ["🤖", "Robot dansı", "Kollarını ve başını robot gibi kesik kesik oynat. Ses çıkarmadan!", "hareket"],
    ["🪞", "Ayna oyunu", "Eşinin karşısına geç, onun hareketlerini ayna gibi aynen yap. Sonra roller değişsin.", "hareket"],
    ["🔢", "Say ve zıpla", "Birlikte 1'den 20'ye sayın. Çift sayılarda zıpla, tek sayılarda alkışla.", "hareket"],
    ["🐝", "Arı nefesi", "Derin nefes al, ağzın kapalı vızıldayarak yavaşça ver. Üç kez.", "nefes"],
    ["🌀", "Omuz çevirme", "Omuzlarını beş kez öne, beş kez arkaya çevir. Sonra boynunu yavaşça sağa sola eğ.", "hareket"],
    ["🗿", "Heykel oyunu", "Yerinde dans et. Öğretmen “Heykel!” deyince olduğun yerde don.", "hareket"],
    ["🖐️", "Parmak nefesi", "Bir parmağınla öbür elinin parmaklarını çiz. Çıkarken nefes al, inerken ver.", "nefes"],
    ["🧗", "Dağa tırmanış", "Yerinde, kollarını ip çeker gibi oynatarak tepeye tırman. Zirvede derin bir nefes!", "hareket"],
  ];
  const RENK = ["#E0574B", "#2E6FB0", "#3FA35B", "#E9A23B", "#8A5BD6", "#1F8A8A"];
  W.mola = {
    title: "Hareket molası", icon: "bolt", tone: "leaf", w: 560, h: 420, desc: "Çark dönsün, bir dakikalık mola",
    init: () => ({ tur: "hepsi", aci: 0, son: null }),
    render(body, w, api) {
      const d = w.data; let sure = 60, iv = null;
      const liste = () => MOLA.filter((m) => d.tur === "hepsi" || m[3] === d.tur);
      const S = T.svg; const cark = h("div.ml-cark"); const sonuc = h("div.ml-sonuc");
      body.style.gridTemplateRows = "auto 1fr"; body.style.gap = "8px";
      const ciz = () => {
        const L = liste(), n = L.length, r = 100;
        const svg = S("svg", { viewBox: "-105 -105 210 210" });
        const g = S("g", { class: "ml-donen" }); g.style.transform = "rotate(" + d.aci + "deg)";
        L.forEach((m, i) => {
          const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2, am = (a0 + a1) / 2;
          g.append(S("path", { d: `M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`, fill: RENK[i % 6], stroke: "#fff", "stroke-width": 2 }));
          const t = S("text", { x: 66 * Math.cos(am), y: 66 * Math.sin(am) + 8, "text-anchor": "middle", "font-size": 24 }); t.textContent = m[0]; g.append(t);
        });
        svg.append(g, S("circle", { r: 14, fill: "#fff", stroke: "#1B2A4A", "stroke-width": 3 }), S("path", { d: "M-9 -108 L9 -108 L0 -88 Z", fill: "#1B2A4A" }));
        cark.replaceChildren(svg);
        const m = d.son != null ? L.find((x) => x[1] === d.son) : null;
        sonuc.replaceChildren(m ? h("div.ml-kart", h("span.ml-emo", m[0]), h("b", m[1]), h("p", m[2]), h("div.ml-sure", h("span", sure), " sn"),
          h("div.row", { style: { gap: "6px", justifyContent: "center" } }, h("button.btn.sm.c-leaf", { onclick: basla }, T.icon("timer"), iv ? "Sürüyor" : "Başlat"), h("button.btn.sm.c-chalk", { onclick: () => T.speak(m[1] + ". " + m[2]) }, T.icon("speaker"), "Oku")))
          : h("p.hint", { style: { textAlign: "center" } }, "Çevir düğmesine bas, çark molayı seçsin."));
      };
      function basla() { if (iv) return; sure = 60; iv = setInterval(() => { sure--; const el = body.querySelector(".ml-sure span"); if (el) el.textContent = sure; if (sure <= 0) { clearInterval(iv); iv = null; T.sound.bell && T.sound.bell(); ciz(); } }, 1000); ciz(); }
      const cevir = () => {
        const L = liste(), n = L.length, k = Math.floor(Math.random() * n);
        clearInterval(iv); iv = null; sure = 60; d.son = null; ciz();
        const hedef = 360 - ((k + 0.5) / n) * 360;
        d.aci = d.aci - (d.aci % 360) + 360 * 5 + hedef;
        const g = cark.querySelector(".ml-donen"); g.getBoundingClientRect(); g.style.transform = "rotate(" + d.aci + "deg)";
        T.sound.drum && T.sound.drum();
        setTimeout(() => { d.son = L[k][1]; api.save(); T.sound.ding && T.sound.ding(); ciz(); }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 3200);
      };
      body.append(h("div.row", { style: { gap: "6px", justifyContent: "center", flexWrap: "wrap" } },
        h("div.seg", [["hepsi", "Hepsi"], ["hareket", "Hareket"], ["nefes", "Nefes ve sakinleşme"]].map(([k, l]) => h("button", { "aria-pressed": String(d.tur === k), onclick: (e) => { d.tur = k; d.son = null; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); api.save(); ciz(); } }, l))),
        h("button.btn.c-sun", { onclick: cevir }, T.icon("turn"), "Çevir")),
        h("div.ml-govde", cark, sonuc));
      ciz();
    },
  };

  /* ---------- Dikkat çağrıları ---------- */
  const CAGRI = [["Sınıf, sınıf!", "Efendim, efendim!"], ["Bir, iki, üç, gözler bende!", "Bir, iki, gözler sende!"], ["Kulaklar?", "Dinliyor!"], ["Ağızlar?", "Fermuar!"], ["Eller?", "Dizlerde!"], ["Hop hop!", "Dur dur!"], ["Herkes hazır mı?", "Hazırız, hazırız!"], ["Şak, şak, şak-şak-şak!", "Şak-şak!"], ["Sessiz balık…", "Blup blup!"], ["Arılar, arılar!", "Vız vız, kovana!"]];
  W.dikkat = {
    title: "Dikkat çağrıları", icon: "hand", tone: "sky", w: 520, h: 330, desc: "Öğretmen söyler, sınıf cevaplar",
    init: () => ({ i: 0, ozel: [] }),
    render(body, w, api) {
      const d = w.data; d.ozel = d.ozel || []; let acik = false;
      const hepsi = () => CAGRI.concat(d.ozel);
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      const sahne = h("div.dk-sahne");
      const ciz = () => {
        const L = hepsi(); d.i = ((d.i % L.length) + L.length) % L.length; const [o, c] = L[d.i];
        sahne.replaceChildren(h("div.dk-ogretmen", h("small", "Öğretmen"), o), h("div.dk-sinif" + (acik ? ".acik" : ""), h("small", "Sınıf"), acik ? c : "…"));
      };
      body.append(sahne, h("div.row", { style: { gap: "6px", justifyContent: "center", flexWrap: "wrap" } },
        h("button.btn.sm.c-chalk", { "aria-label": "Önceki", onclick: () => { d.i--; acik = false; api.save(); ciz(); } }, "‹"),
        h("button.btn.c-sky", { onclick: () => { acik = true; T.sound.ding && T.sound.ding(); ciz(); } }, "Cevabı göster"),
        h("button.btn.sm.c-chalk", { "aria-label": "Sonraki", onclick: () => { d.i++; acik = false; api.save(); ciz(); } }, "›"),
        h("button.btn.sm.c-chalk", { onclick: () => {
          const a = h("input.in", { placeholder: "Öğretmenin sözü" }), b = h("input.in", { placeholder: "Sınıfın cevabı" });
          T.modal({ title: "Kendi çağrını ekle", body: h("div", { style: { display: "grid", gap: "8px" } }, a, b, d.ozel.length ? h("div.hint", "Eklediklerin: " + d.ozel.map((x) => x[0]).join(" · ")) : null),
            actions: [{ label: "Ekle", tone: "c-leaf", onClick: () => { if (!a.value.trim() || !b.value.trim()) return false; d.ozel.push([a.value.trim(), b.value.trim()]); d.i = hepsi().length - 1; acik = false; api.save(); ciz(); } }].concat(d.ozel.length ? [{ label: "Eklediklerimi sil", onClick: () => { d.ozel = []; d.i = 0; api.save(); ciz(); } }] : []) });
        } }, T.icon("plus"), "Ekle")));
      ciz();
    },
  };

  /* ---------- Sıraya geçme ---------- */
  W.sira = {
    title: "Sıraya geçme", icon: "train", tone: "grape", w: 460, h: 440, desc: "Hat başı her gün değişir",
    init: () => ({ mod: "gun", karisik: null, tarih: null }),
    render(body, w, api) {
      const d = w.data, c = api.cls();
      body.style.gridTemplateRows = "auto 1fr"; body.style.gap = "8px";
      const liste = h("ol.sr-liste");
      const sirala = () => {
        const yok = bugunYok(c); let L = c.students.filter((st) => yok[st.id] !== "yok");
        if (d.mod === "karisik" && d.karisik && d.tarih === T.isoDate()) L = d.karisik.map((id) => L.find((x) => x.id === id)).filter(Boolean).concat(L.filter((x) => !d.karisik.includes(x.id)));
        else if (L.length) { const n = (Math.max(1, T.cal.dayNumber()) - 1) % L.length; L = L.slice(n).concat(L.slice(0, n)); }
        return L;
      };
      const ciz = () => {
        const L = sirala();
        liste.replaceChildren(...(L.length ? L.map((st, i) => h("li" + (i === 0 ? ".bas" : i === L.length - 1 ? ".son" : ""), h("span.sr-no", i + 1), T.avatar(st.name, 30), h("span", st.name), i === 0 ? h("em", "Hat başı") : i === 1 ? h("em", "Kapıyı tutar") : i === L.length - 1 && L.length > 2 ? h("em", "Işıkları kapatır") : null)) : [h("div.hint", "Sınıf listesi boş.")]));
      };
      body.append(h("div.row", { style: { gap: "6px", flexWrap: "wrap", justifyContent: "center" } },
        h("div.seg", [["gun", "Her gün döner"], ["karisik", "Karışık"]].map(([k, l]) => h("button", { "aria-pressed": String(d.mod === k), onclick: (e) => { d.mod = k; if (k === "karisik" && d.tarih !== T.isoDate()) { d.karisik = T.shuffle(c.students.map((x) => x.id)); d.tarih = T.isoDate(); } e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); api.save(); ciz(); } }, l))),
        h("button.btn.sm.c-chalk", { onclick: () => { d.mod = "karisik"; d.karisik = T.shuffle(c.students.map((x) => x.id)); d.tarih = T.isoDate(); T.sound.drum && T.sound.drum(); api.save(); body.replaceChildren(); W.sira.render(body, w, api); } }, T.icon("turn"), "Yeniden karıştır")), liste);
      ciz();
    },
  };
})();
