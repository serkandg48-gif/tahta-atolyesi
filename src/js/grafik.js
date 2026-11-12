/* Matematik: Grafik atölyesi. Sınıfça veri topla (oylama ya da sayma), resim grafiği, sütun grafiği, çetele tablosu. */
(function () {
  const { h } = T;
  const cid = () => T.store.activeClass().id;
  const HAZIR = {
    meyve: ["En sevdiğimiz meyve hangisi?", [["🍎", "Elma"], ["🍌", "Muz"], ["🍊", "Portakal"], ["🍇", "Üzüm"], ["🍓", "Çilek"]]],
    ulasim: ["Okula nasıl geliyoruz?", [["🚶", "Yürüyerek"], ["🚌", "Servisle"], ["🚗", "Arabayla"], ["🚲", "Bisikletle"]]],
    mevsim: ["En sevdiğimiz mevsim hangisi?", [["🌸", "İlkbahar"], ["☀️", "Yaz"], ["🍂", "Sonbahar"], ["❄️", "Kış"]]],
    hayvan: ["Hangi evcil hayvanı severiz?", [["🐱", "Kedi"], ["🐶", "Köpek"], ["🐦", "Kuş"], ["🐟", "Balık"], ["🐰", "Tavşan"]]],
    renk: ["En sevdiğimiz renk hangisi?", [["🟥", "Kırmızı"], ["🟦", "Mavi"], ["🟩", "Yeşil"], ["🟨", "Sarı"], ["🟪", "Mor"]]],
  };
  const RENK = ["#E0574B", "#2E6FB0", "#3FA35B", "#E9A23B", "#8A5BD6", "#1F8A8A"];
  const oku = () => { const s = T.store.get(); return ((s.pano || {})[cid()] || {}).grafik || { soru: HAZIR.meyve[0], kat: HAZIR.meyve[1].map(([e, a]) => ({ e, a, n: 0 })), oy: {} }; };
  const yaz = (fn) => T.store.update((st) => { st.pano = st.pano || {}; const c = (st.pano[cid()] = st.pano[cid()] || {}); const v = c.grafik || oku(); fn(v); c.grafik = v; });
  const sayi = (v, i) => v.kat[i].n + Object.values(v.oy || {}).filter((x) => x === i).length;

  T.tools["grafik-atolyesi"] = {
    title: "Grafik atölyesi", icon: "chart", tone: "sun", cat: "oyun", grades: [1, 4], back: "matematik", short: "Sınıfça oy verin, resim ve sütun grafiği birlikte oluşsun",
    render(host) {
      let tur = "resim", mod = "sayi", olcek = 1, cevapAcik = {}, secOgr = null;
      const box = h("div"); host.append(box);
      const ciz = () => {
        const v = oku(), ns = v.kat.map((_, i) => sayi(v, i)), mx = Math.max(1, ...ns), toplam = ns.reduce((a, b) => a + b, 0);
        const ogr = T.store.activeClass().students;
        /* Üst: soru ve hazır konular */
        const ust = h("div.gr-ust",
          h("input.in.gr-soru", { value: v.soru, "aria-label": "Grafik sorusu", onchange: (e) => { yaz((x) => (x.soru = e.target.value)); } }),
          h("div.row", { style: { gap: "6px", flexWrap: "wrap" } }, h("span.hint", "Hazır konu:"), Object.entries(HAZIR).map(([k, [s, l]]) => h("button.btn.sm.c-chalk", { onclick: async () => { if (toplam && !(await T.confirm("Yeni konu", "Şimdiki veriler silinsin mi?", "Evet"))) return; yaz((x) => { x.soru = s; x.kat = l.map(([e, a]) => ({ e, a, n: 0 })); x.oy = {}; }); ciz(); } }, l[0][0] + " " + ({meyve:"Meyve",ulasim:"Ulaşım",mevsim:"Mevsim",hayvan:"Hayvan",renk:"Renk"})[k]))));
        /* Veri girişi */
        const kategoriler = h("div.gr-kat", v.kat.map((k, i) => h("div.gr-kk", { style: { "--c": RENK[i % 6] } },
          h("input.gr-emo", { value: k.e, "aria-label": "Simge", maxlength: 4, onchange: (e) => { yaz((x) => (x.kat[i].e = e.target.value || "⭐")); ciz(); } }),
          h("input.gr-ad", { value: k.a, "aria-label": "Seçenek adı", onchange: (e) => { yaz((x) => (x.kat[i].a = e.target.value)); ciz(); } }),
          mod === "sayi" ? h("div.gr-sayac", h("button", { "aria-label": k.a + " azalt", onclick: () => { yaz((x) => (x.kat[i].n = Math.max(0, x.kat[i].n - 1))); ciz(); } }, "−"), h("b", ns[i]), h("button", { "aria-label": k.a + " artır", onclick: () => { yaz((x) => x.kat[i].n++); T.sound && T.sound.pop && T.sound.pop(); ciz(); } }, "+"))
            : h("button.gr-oyver", { disabled: !secOgr ? true : null, onclick: () => { if (!secOgr) return; const s = secOgr; yaz((x) => { x.oy = x.oy || {}; x.oy[s] = i; }); T.sound && T.sound.pop && T.sound.pop(); const sira = ogr.findIndex((o) => o.id === s); const sonraki = ogr.slice(sira + 1).find((o) => oku().oy[o.id] == null); secOgr = sonraki ? sonraki.id : null; ciz(); } }, h("b", ns[i]), " oy"),
          v.kat.length > 2 ? h("button.gr-sil", { "aria-label": k.a + " seçeneğini sil", onclick: () => { yaz((x) => { x.kat.splice(i, 1); Object.keys(x.oy || {}).forEach((o) => { if (x.oy[o] === i) delete x.oy[o]; else if (x.oy[o] > i) x.oy[o]--; }); }); ciz(); } }, "×") : null)),
          v.kat.length < 6 ? h("button.gr-ekle", { onclick: () => { yaz((x) => x.kat.push({ e: "⭐", a: "Yeni", n: 0 })); ciz(); } }, T.icon("plus"), "Seçenek ekle") : null);
        const oylama = mod === "oy" ? h("div.gr-ogr", h("p.hint", { style: { margin: "0 0 6px" } }, secOgr ? "Şimdi " + (ogr.find((o) => o.id === secOgr) || {}).name + " seçiyor: bir seçeneğe dokun." : "Oy verecek arkadaşın adına dokun."),
          h("div.dy-names", ogr.map((o) => h("button" + (secOgr === o.id ? ".on" : "") + (v.oy && v.oy[o.id] != null ? ".done" : ""), { onclick: () => { secOgr = o.id; ciz(); } }, T.avatar(o.name, 26), o.name, v.oy && v.oy[o.id] != null ? " " + v.kat[v.oy[o.id]].e : "")))) : null;
        /* Grafik */
        let grafik;
        if (tur === "resim") {
          grafik = h("div.gr-resim", v.kat.map((k, i) => h("div.gr-rsatir", h("div.gr-retiket", h("span", k.e), k.a), h("div.gr-remo", Array.from({ length: Math.ceil(ns[i] / olcek) }, (_, j) => h("span" + (olcek === 2 && j === Math.ceil(ns[i] / 2) - 1 && ns[i] % 2 ? ".yarim" : ""), k.e))))),
            h("div.gr-anahtar", "Anahtar: ", v.kat[0] ? v.kat[0].e : "⭐", " = " + olcek + " kişi"));
        } else if (tur === "sutun") {
          const ust2 = Math.max(5, Math.ceil(mx / 5) * 5);
          grafik = h("div.gr-sutun", h("div.gr-eksen", Array.from({ length: ust2 + 1 }, (_, j) => ust2 - j).filter((x) => ust2 <= 10 || x % 2 === 0).map((x) => h("span", x))),
            h("div.gr-alan", { style: { "--ust": ust2 } }, v.kat.map((k, i) => h("div.gr-bar", h("div.gr-dolu", { style: { height: (ns[i] / ust2) * 100 + "%", background: RENK[i % 6] } }, h("b", ns[i] || "")), h("div.gr-bet", h("span", k.e), k.a)))));
        } else {
          const cetele = (n) => { const o = []; for (let j = 0; j < Math.floor(n / 5); j++) o.push(h("span.gr-5", "||||")); for (let j = 0; j < n % 5; j++) o.push(h("span.gr-1", "|")); return o; };
          grafik = h("table.gr-cetele", h("tr", h("th", "Seçenek"), h("th", "Çetele"), h("th", "Sayı")), v.kat.map((k, i) => h("tr", h("td", k.e + " " + k.a), h("td.gr-ct", cetele(ns[i])), h("td", h("b", ns[i])))), h("tr", h("td", h("b", "Toplam")), h("td"), h("td", h("b", toplam))));
        }
        /* Grafiği okuyalım */
        const sirali = v.kat.map((k, i) => [k, ns[i]]).sort((a, b) => b[1] - a[1]);
        const sorular = toplam ? [
          ["En çok hangisi seçildi?", sirali[0][1] === (sirali[1] || [0, -1])[1] ? "Eşitlik var: " + sirali.filter((x) => x[1] === sirali[0][1]).map((x) => x[0].a).join(" ve ") : sirali[0][0].a + " (" + sirali[0][1] + ")"],
          ["En az hangisi seçildi?", sirali[sirali.length - 1][0].a + " (" + sirali[sirali.length - 1][1] + ")"],
          ["Toplam kaç kişi katıldı?", String(toplam)],
          sirali.length > 1 ? ["En çok seçilenle en az seçilen arasında kaç fark var?", String(sirali[0][1] - sirali[sirali.length - 1][1])] : null,
          sirali.length > 1 ? [sirali[0][0].a + " ile " + sirali[1][0].a + " birlikte kaç kişi?", String(sirali[0][1] + sirali[1][1])] : null,
        ].filter(Boolean) : [];
        box.replaceChildren(ust,
          h("div.row", { style: { gap: "8px", flexWrap: "wrap", margin: "10px 0" } },
            h("div.seg", [["sayi", "Sayarak gir"], ["oy", "Sınıf oylaması"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => { mod = k; secOgr = k === "oy" ? (ogr.find((o) => (oku().oy || {})[o.id] == null) || {}).id || null : null; ciz(); } }, l))),
            h("div.seg", [["resim", "Resim grafiği"], ["sutun", "Sütun grafiği"], ["cetele", "Çetele tablosu"]].map(([k, l]) => h("button", { "aria-pressed": String(tur === k), onclick: () => { tur = k; ciz(); } }, l))),
            tur === "resim" ? h("div.seg", [[1, "1 resim = 1"], [2, "1 resim = 2"]].map(([k, l]) => h("button", { "aria-pressed": String(olcek === k), onclick: () => { olcek = k; ciz(); } }, l))) : null,
            h("div.spacer"),
            h("button.btn.sm.c-chalk", { onclick: async () => { if (await T.confirm("Verileri sıfırla", "Sayılar ve oylar silinsin mi?", "Sıfırla")) { yaz((x) => { x.kat.forEach((k) => (k.n = 0)); x.oy = {}; }); cevapAcik = {}; ciz(); } } }, T.icon("reset"), "Sıfırla")),
          h("div.gr-duzen", h("div", kategoriler, oylama), h("div.gr-kart", h("h3", v.soru), toplam ? grafik : h("p.hint", "Veri girdikçe grafik burada büyüyecek."))),
          sorular.length ? h("div.gr-oku", h("h3", "Grafiği okuyalım"), sorular.map(([s, c], j) => h("div.gr-oku-s", h("span", s), h("button.btn.sm" + (cevapAcik[j] ? ".c-leaf" : ".c-chalk"), { onclick: () => { cevapAcik[j] = !cevapAcik[j]; ciz(); } }, cevapAcik[j] ? c : "Cevabı göster")))) : null);
      };
      ciz();
    },
  };
})();
