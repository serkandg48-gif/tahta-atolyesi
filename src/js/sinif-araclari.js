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

  /* ---------- Hareket molası çarkı ----------
     Büyük bir havuzdan her gün 8 dilim seçilir; son günlerde çıkanlar bir süre gelmez. Bazı dilimler hareket değil oyun biçimidir. */
  const MOLA = [
    /* hareket */
    ["🦩", "Flamingo dengesi", "Tek ayak üstünde 15 saniye dur, sonra öbür ayağa geç.", "hareket"],
    ["🐸", "Kurbağa sıçraması", "Yerinde 10 kez kurbağa gibi sıçra.", "hareket"],
    ["🤖", "Robot dansı", "Kollarını ve başını robot gibi kesik kesik oynat. Ses çıkarmadan!", "hareket"],
    ["🔢", "Say ve zıpla", "Birlikte 1'den 20'ye sayın. Çift sayılarda zıpla, tek sayılarda alkışla.", "hareket"],
    ["🌀", "Omuz çevirme", "Omuzlarını beş kez öne, beş kez arkaya çevir. Sonra boynunu yavaşça sağa sola eğ.", "hareket"],
    ["🧗", "Dağa tırmanış", "Yerinde, kollarını ip çeker gibi oynatarak tepeye tırman. Zirvede derin bir nefes!", "hareket"],
    ["🐻", "Ayı yürüyüşü", "Ellerin ve ayakların yerde, sıranın yanında üç adım ileri, üç adım geri yürü.", "hareket"],
    ["🦘", "Kanguru", "Ayaklarını birleştir, beş kez ileri, beş kez geri sıçra.", "hareket"],
    ["🏃", "Yerinde koşu", "20 saniye yerinde koş. Öğretmen 'Hızlı!' deyince hızlan, 'Yavaş!' deyince yavaşla.", "hareket"],
    ["⭐", "Yıldız zıplaması", "Kollarını ve bacaklarını açıp kapatarak 10 kez yıldız zıplaması yap.", "hareket"],
    ["🦒", "Zürafa uzanması", "Parmak uçlarında yüksel, kollarını tavana uzat. Beşe kadar say, in. Üç kez.", "hareket"],
    ["🐢", "Ağır çekim", "Bir futbolcunun gol sevincini ağır çekimde canlandır.", "hareket"],
    ["🏊", "Kuru yüzme", "Önce kurbağalama, sonra serbest stil yüzer gibi kollarını çevir.", "hareket"],
    ["🚲", "Hayali bisiklet", "Sandalyende otur, bacaklarınla 20 kez pedal çevir.", "hareket"],
    ["🥊", "Gölge boksu", "Havaya 10 sağ, 10 sol yumruk at. Kimseye değmeden!", "hareket"],
    ["🦀", "Yengeç adımı", "Yan yan iki adım sağa, iki adım sola git. Elinle kıskaç yap.", "hareket"],
    ["🧍", "Kalk otur", "Sandalyeden 8 kez yavaşça kalk ve otur. Ellerini kullanma.", "hareket"],
    ["🌪️", "Kasırga", "Kollarını iki yana aç, yerinde yavaşça üç tur dön. Sonra ters yöne.", "hareket"],
    ["🐧", "Penguen yürüyüşü", "Kollarını yanına yapıştır, küçük adımlarla sıranın çevresinde yürü.", "hareket"],
    ["🏋️", "Hayali halter", "Ağır bir halteri yerden kaldır, başının üstünde tut, yavaşça indir. Beş kez.", "hareket"],
    ["🎯", "Burun dokunuşu", "Gözlerin kapalı, sağ elinle burnuna, sol elinle kulağına dokun. Hızla değiştir.", "hareket"],
    ["🦵", "Diz alkışı", "Dizini kaldır, altında alkışla. Sağ, sol, sağ, sol. 16 kez.", "hareket"],
    ["🐱", "Kedi gerinmesi", "Ellerin masada, sırtını kedi gibi kamburlaştır, sonra çukurlaştır. Beş kez.", "hareket"],
    ["🌊", "Dalga", "Sıra sıra ayağa kalkıp kollarınızla stadyum dalgası yapın. İki tur.", "hareket"],
    ["🥁", "Davul ritmi", "Öğretmenin dizlerine vurduğu ritmi aynen tekrarla. Dört ritim.", "hareket"],
    ["🧊", "Eriyen dondurma", "Dimdik dur, sonra güneşte eriyen dondurma gibi yavaşça çök.", "hareket"],
    ["✍️", "Havaya yaz", "Adını havaya önce sağ elinle, sonra sol elinle, sonra dirseğinle yaz.", "hareket"],
    ["🦅", "Kartal kanatları", "Kollarını kanat gibi aç, yavaşça çırp. Bir yöne süzül, sonra öbür yöne.", "hareket"],
    ["🧹", "Sihirli süpürge", "Görünmez süpürgeye bin, dizlerini kaldırarak sınıfın üstünde uç.", "hareket"],
    ["🔤", "Harf bedeni", "Bedeninle T, Y, O ve L harflerini yap.", "hareket"],
    /* nefes ve sakinleşme */
    ["🎈", "Balon nefesi", "Dört sayıda burnundan al, karnını balon gibi şişir, dört sayıda ver. Beş kez.", "nefes"],
    ["🌳", "Ağaç duruşu", "Ayak tabanını öbür bacağına daya, kolların dal olsun. Rüzgârda sallan ama devrilme.", "nefes"],
    ["🐝", "Arı nefesi", "Derin nefes al, ağzın kapalı vızıldayarak yavaşça ver. Üç kez.", "nefes"],
    ["🖐️", "Parmak nefesi", "Bir parmağınla öbür elinin parmaklarını çiz. Çıkarken nefes al, inerken ver.", "nefes"],
    ["🌸", "Çiçek ve mum", "Bir çiçeği koklar gibi burnundan al, bir mumu üfler gibi ağzından ver. Beş kez.", "nefes"],
    ["🐍", "Yılan nefesi", "Derin nefes al, 'sssss' diyerek uzun uzun ver. En uzun kim yapacak?", "nefes"],
    ["🟦", "Kare nefes", "Havaya bir kare çiz: dört sayıda al, dört tut, dört ver, dört bekle.", "nefes"],
    ["🪶", "Tüy", "Elindeki hayali tüyü üfleyerek havada tut. Yavaş ve uzun üfle.", "nefes"],
    ["🦁", "Aslan nefesi", "Derin nefes al, ağzını kocaman aç, dilini çıkar ve sessizce 'haaa' diye ver.", "nefes"],
    ["👂", "Sesleri say", "Gözlerini kapat. Bir dakika boyunca duyduğun sesleri parmaklarınla say.", "nefes"],
    ["🧸", "Ayıcık nefesi", "Elini karnına koy. Nefes alırken elin yükselsin, verirken insin. Ayıcığı uyut.", "nefes"],
    ["🌈", "Gökkuşağı", "Kollarını yandan yukarı kaldırırken nefes al, indirirken ver. Her turda bir renk say.", "nefes"],
    ["🍋", "Limon sıkma", "Ellerinde limon var. Sımsıkı sık, beşe kadar say, bırak. Ayaklarla da yap.", "nefes"],
    ["🐢", "Kaplumbağa", "Omuzlarını kulaklarına kaldır, kabuğuna saklan. Yavaşça bırak, başını çıkar. Üç kez.", "nefes"],
    ["☁️", "Bulut", "Gözlerin kapalı, bir buluta bindiğini düşün. Üç derin nefes boyunca nereye uçtuğunu hayal et.", "nefes"],
    ["🍝", "Spagetti", "Önce çiğ makarna gibi dimdik ol, sonra pişmiş makarna gibi gevşe.", "nefes"],
    /* oyun biçimleri */
    ["🐾", "Ponpon der ki", "Ponpon der ki ile başlayan komutu yap. Başında Ponpon der ki yoksa kıpırdama!", "oyun", "ponpon"],
    ["🗿", "Donma dansı", "Ritim çalınca dans et. Ritim durunca olduğun yerde heykel ol!", "oyun", "donma"],
    ["🪞", "Ayna oyunu", "Önde bir öğrenci hareket eder, sınıf onu ayna gibi aynen taklit eder.", "oyun", "ayna"],
    ["🎲", "Zar kadar", "Zar at, çıkan sayı kadar hareketi tekrarla.", "oyun", "zar"],
    ["📖", "Hikâyeli hareket", "Öğretmen hikâyeyi okur. Renkli kelimeyi duyunca o hareketi yap!", "oyun", "hikaye"],
    ["🔁", "Hareket zinciri", "Biri bir hareket yapar, sonraki onu yapıp bir tane ekler. Zincir ne kadar uzayacak?", "oyun", "zincir"],
  ];
  const RENK = ["#E0574B", "#2E6FB0", "#3FA35B", "#E9A23B", "#8A5BD6", "#1F8A8A"];
  /* tohumlu karıştırma: aynı gün aynı çark */
  const tohumlu = (dizi, tohum) => { const a = dizi.slice(); let x = tohum >>> 0 || 1; const r = () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const GECMIS = "ta-mola-gecmis";
  const gecmisOku = () => { try { return JSON.parse(localStorage.getItem(GECMIS) || "{}"); } catch (e) { return {}; } };
  const gecmisYaz = (ad) => { try { const g = gecmisOku(); g[ad] = T.isoDate(); const l = Object.entries(g).sort((x, y) => (x[1] < y[1] ? 1 : -1)).slice(0, 60); localStorage.setItem(GECMIS, JSON.stringify(Object.fromEntries(l))); } catch (e) {} };
  const gunFarki = (iso) => Math.round((new Date(T.isoDate()) - new Date(iso)) / 864e5);
  /* oyun biçimlerinin içerikleri */
  const KOMUT = ["ellerini başına koy", "tek ayak üstünde dur", "üç kez zıpla", "burnuna dokun", "kollarını kanat yap", "otur", "ayağa kalk", "kulaklarını tut", "bir tur dön", "dizlerine vur", "gülümse", "omuzlarını kaldır", "ellerini çırp", "kollarını yukarı uzat", "parmak uçlarında yüksel"];
  const ZAR_HAREKET = [(n) => n + " kez zıpla", (n) => n + " kez çömel kalk", (n) => n + " kez alkışla", (n) => n * 5 + " saniye yerinde koş", (n) => n + " kez kollarını çevir", (n) => n + " kez dizini kaldır"];
  const HIKAYE = [
    { k: { "kuş": "🕊️ kollarını çırp", "rüzgâr": "🌬️ sallan", "ağaç": "🌳 kollarını aç", "yağmur": "🌧️ parmaklarınla yağmur yağdır" },
      t: "Bir sabah küçük bir kuş uyandı. Ağaç dalları rüzgâr ile sallanıyordu. Kuş havalandı, bir ağaç tepesine kondu. Birden yağmur başladı. Kuş, yaprakların altına saklandı. Rüzgâr dindi, yağmur durdu. Kuş yeniden uçtu ve en yüksek ağaç dalına kondu. Oradan bir kuş daha selam verdi." },
    { k: { "araba": "🚗 direksiyon çevir", "korna": "📯 iki kez alkışla", "kırmızı": "🛑 donup kal", "yeşil": "🟢 yerinde koş" },
      t: "Kırmızı bir araba yola çıktı. Işık yeşil yandı, araba hızlandı. Önüne bir kedi çıktı, korna çaldı. Işık kırmızı oldu, araba durdu. Sonra yeşil yandı. Araba köprüden geçti, korna çaldı. Akşam olunca kırmızı araba garaja girdi." },
    { k: { "roket": "🚀 kollarını birleştirip yukarı uzat", "yıldız": "⭐ yıldız zıplaması", "ay": "🌙 bir tur dön", "uzaylı": "👽 komik bir yüz yap" },
      t: "Roket fırlatma rampasında bekliyordu. Geri sayım bitti ve roket havalandı. Yolda binlerce yıldız gördüler. Sonunda ay göründü. Ay yüzeyine indiklerinde bir uzaylı el salladı. Uzaylı onlara bir yıldız hediye etti. Roket yeniden havalandı ve dünyaya döndü." },
  ];
  W.mola = {
    title: "Hareket molası", icon: "bolt", tone: "leaf", w: 600, h: 440, desc: "Her gün yeni dilimler: hareket, nefes ve oyunlar",
    init: () => ({ tur: "hepsi", aci: 0, son: null, ek: 0 }),
    render(body, w, api) {
      const d = w.data; d.ek = d.ek || 0; let sure = 60, iv = null, oyunIv = null;
      const temizle = () => { clearInterval(iv); iv = null; clearInterval(oyunIv); oyunIv = null; clearTimeout(oyunIv); };
      api.onDestroy && api.onDestroy(temizle);
      const gunNo = () => Math.floor(new Date(T.isoDate()).getTime() / 864e5);
      /* bugünün 8 dilimi: son 4 günde çıkanlar dışarıda kalır; hepside 2 oyun, 6 hareket ya da nefes */
      const liste = () => {
        const g = gecmisOku(), taze = (m) => !g[m[1]] || gunFarki(g[m[1]]) >= 4;
        const tohum = gunNo() * 31 + d.ek * 977 + { hepsi: 1, hareket: 2, nefes: 3, oyun: 4 }[d.tur];
        const sec = (tur, n) => { const havuz = MOLA.filter((m) => m[3] === tur || (tur === "hepsi" && m[3] !== "oyun")); const k = tohumlu(havuz.filter(taze), tohum).concat(tohumlu(havuz.filter((m) => !taze(m)), tohum)); return k.slice(0, n); };
        if (d.tur === "hepsi") return tohumlu(sec("hepsi", 6).concat(sec("oyun", 2)), tohum + 7);
        return sec(d.tur, d.tur === "oyun" ? 6 : 8);
      };
      let L = liste();
      const S = T.svg; const cark = h("div.ml-cark"); const sonuc = h("div.ml-sonuc");
      body.style.gridTemplateRows = "auto 1fr"; body.style.gap = "8px";
      const ciz = () => {
        const n = L.length, r = 100;
        const svg = S("svg", { viewBox: "-105 -105 210 210" });
        const g = S("g", { class: "ml-donen" }); g.style.transform = "rotate(" + d.aci + "deg)";
        L.forEach((m, i) => {
          const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2, am = (a0 + a1) / 2;
          g.append(S("path", { d: `M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`, fill: m[3] === "oyun" ? "#1B2A4A" : RENK[i % 6], stroke: "#fff", "stroke-width": 2 }));
          const t = S("text", { x: 66 * Math.cos(am), y: 66 * Math.sin(am) + 8, "text-anchor": "middle", "font-size": 24 }); t.textContent = m[0]; g.append(t);
        });
        svg.append(g, S("circle", { r: 14, fill: "#fff", stroke: "#1B2A4A", "stroke-width": 3 }), S("path", { d: "M-9 -108 L9 -108 L0 -88 Z", fill: "#1B2A4A" }));
        cark.replaceChildren(svg);
        const m = d.son != null ? MOLA.find((x) => x[1] === d.son) : null;
        if (!m) { sonuc.replaceChildren(h("p.hint", { style: { textAlign: "center" } }, "Çevir düğmesine bas, çark molayı seçsin. Koyu dilimler oyundur.")); return; }
        if (m[4]) return oyunCiz(m);
        sonuc.replaceChildren(h("div.ml-kart", h("span.ml-emo", m[0]), h("b", m[1]), h("p", m[2]), h("div.ml-sure", h("span", sure), " sn"),
          h("div.row", { style: { gap: "6px", justifyContent: "center" } }, h("button.btn.sm.c-leaf", { onclick: basla }, T.icon("timer"), iv ? "Sürüyor" : "Başlat"))));
      };
      function basla() { if (iv) return; sure = 60; iv = setInterval(() => { sure--; const el = body.querySelector(".ml-sure span"); if (el) el.textContent = sure; if (sure <= 0) { clearInterval(iv); iv = null; T.sound.alarm ? T.sound.alarm("nazik") : T.sound.bell(); ciz(); } }, 1000); ciz(); }
      /* oyun biçimleri */
      function oyunCiz(m) {
        const kart = h("div.ml-kart.ml-oyun", h("span.ml-emo", m[0]), h("b", m[1]), h("p", m[2]));
        const alan = h("div.ml-oyun-alan"), dug = h("div.row", { style: { gap: "6px", justifyContent: "center", flexWrap: "wrap" } });
        kart.append(alan, dug); sonuc.replaceChildren(kart);
        const tur = m[4];
        if (tur === "ponpon") {
          const komutVer = () => { const der = Math.random() < 0.65, k = KOMUT[T.rand(0, KOMUT.length - 1)]; alan.replaceChildren(h("div.ml-komut" + (der ? ".der" : ".demez"), T.ponponSvg ? T.ponponSvg(der ? "gulen" : "sasirmis") : null, h("span", (der ? "Ponpon der ki: " : "") + k + "!"))); T.sound.pop && T.sound.pop(); };
          let akiyor = false;
          dug.append(h("button.btn.sm.c-sun", { onclick: komutVer }, T.icon("next"), "Yeni komut"), h("button.btn.sm.c-chalk", { onclick: (e) => { akiyor = !akiyor; clearInterval(oyunIv); if (akiyor) { komutVer(); oyunIv = setInterval(komutVer, 4500); } e.currentTarget.lastChild.textContent = akiyor ? "Durdur" : "Kendiliğinden aksın"; } }, T.icon("play"), h("span", "Kendiliğinden aksın")));
          komutVer();
        } else if (tur === "donma") {
          let calisiyor = false, beat = 0;
          const durum = h("div.ml-donma", "Hazır mısınız?");
          alan.replaceChildren(durum);
          const tur1 = () => { const dans = T.rand(5, 11) * 1000, dur = T.rand(3, 5) * 1000; durum.className = "ml-donma dans"; durum.textContent = "Dans et!"; clearInterval(beat); beat = setInterval(() => { T.sound.alarm && T.sound.alarm("tik"); }, 420);
            oyunIv = setTimeout(() => { clearInterval(beat); durum.className = "ml-donma dur"; durum.textContent = "DUR! Heykel ol!"; T.sound.alarm && T.sound.alarm("dijital"); oyunIv = setTimeout(() => calisiyor && tur1(), dur); }, dans); };
          dug.append(h("button.btn.sm.c-leaf", { onclick: (e) => { calisiyor = !calisiyor; clearTimeout(oyunIv); clearInterval(beat); if (calisiyor) tur1(); else { durum.className = "ml-donma"; durum.textContent = "Oyun durdu"; } e.currentTarget.lastChild.textContent = calisiyor ? "Bitir" : "Başlat"; } }, T.icon("play"), h("span", "Başlat")));
          api.onDestroy && api.onDestroy(() => clearInterval(beat));
          T.sound.unlock && T.sound.unlock();
        } else if (tur === "zar") {
          const at = () => { const n = T.rand(1, 6), hr = ZAR_HAREKET[T.rand(0, ZAR_HAREKET.length - 1)]; alan.replaceChildren(h("div.ml-zar", h("span.ml-zar-yuz", "⚀⚁⚂⚃⚄⚅"[n - 1]), h("b", hr(n)))); T.sound.drum && T.sound.drum(); };
          dug.append(h("button.btn.sm.c-sun", { onclick: at }, T.icon("dice"), "Zar at")); at();
        } else if (tur === "hikaye") {
          let hi = T.rand(0, HIKAYE.length - 1);
          const goster = () => { const hk = HIKAYE[hi], re = new RegExp("(?<!\\p{L})(" + Object.keys(hk.k).join("|") + ")(?!\\p{L})", "giu");
            alan.replaceChildren(h("div.ml-hikaye-anahtar", Object.entries(hk.k).map(([kel, har]) => h("span", h("b", kel), " " + har))),
              h("p.ml-hikaye", hk.t.split(re).map((p, i) => (i % 2 ? h("mark", p) : p)))); };
          dug.append(h("button.btn.sm.c-chalk", { onclick: () => { hi = (hi + 1) % HIKAYE.length; goster(); } }, T.icon("next"), "Başka hikâye")); goster();
        } else if (tur === "ayna" || tur === "zincir") {
          const isimSec = () => { const c = api.cls && api.cls(); const L2 = c && c.students ? c.students : []; if (!L2.length) { alan.replaceChildren(h("p.hint", "Sınıf listesi boş. Gönüllü biri öne çıksın.")); return; } const st = L2[T.rand(0, L2.length - 1)]; alan.replaceChildren(h("div.ml-lider", T.avatar(st.name, 48), h("b", st.name), h("small", tur === "ayna" ? "önde, herkes onu taklit etsin" : "zinciri başlatıyor"))); T.sound.pop && T.sound.pop(); };
          dug.append(h("button.btn.sm.c-sun", { onclick: isimSec }, T.icon("name"), tur === "ayna" ? "Lider seç" : "Başlatan seç")); isimSec();
        }
      }
      const cevir = () => {
        const n = L.length, k = Math.floor(Math.random() * n);
        temizle(); sure = 60; d.son = null; ciz();
        const hedef = 360 - ((k + 0.5) / n) * 360;
        d.aci = d.aci - (d.aci % 360) + 360 * 5 + hedef;
        const g = cark.querySelector(".ml-donen"); g.getBoundingClientRect(); g.style.transform = "rotate(" + d.aci + "deg)";
        T.sound.unlock && T.sound.unlock(); T.sound.drum && T.sound.drum();
        setTimeout(() => { d.son = L[k][1]; gecmisYaz(L[k][1]); api.save(); ciz(); }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 3200);
      };
      const yenile = () => { temizle(); d.son = null; L = liste(); d.aci = 0; api.save(); ciz(); };
      body.append(h("div.row", { style: { gap: "6px", justifyContent: "center", flexWrap: "wrap" } },
        h("div.seg", [["hepsi", "Hepsi"], ["hareket", "Hareket"], ["nefes", "Nefes"], ["oyun", "Oyunlar"]].map(([k, l]) => h("button", { "aria-pressed": String(d.tur === k), onclick: (e) => { d.tur = k; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); yenile(); } }, l))),
        h("button.btn.sm.c-chalk", { title: "Çarka başka dilimler gelsin", onclick: () => { d.ek++; yenile(); } }, T.icon("reset"), "Yeni dilimler"),
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
      const liste = h("ol.sr-liste"), ipucu = h("p.hint.sr-ipucu");
      const sirala = () => {
        const yok = bugunYok(c); let L = c.students.filter((st) => yok[st.id] !== "yok");
        if (d.mod === "ogretmen") { const oz = d.ozel || []; L = oz.map((id) => L.find((x) => x.id === id)).filter(Boolean).concat(L.filter((x) => !oz.includes(x.id))); }
        else if (d.mod === "karisik" && d.karisik && d.tarih === T.isoDate()) L = d.karisik.map((id) => L.find((x) => x.id === id)).filter(Boolean).concat(L.filter((x) => !d.karisik.includes(x.id)));
        else if (L.length) { const n = (Math.max(1, T.cal.dayNumber()) - 1) % L.length; L = L.slice(n).concat(L.slice(0, n)); }
        return L;
      };
      let secili = null;
      const tasi = (id, hedef) => { const L = sirala().map((x) => x.id); const tum = (d.ozel || []).filter((x) => !L.includes(x)); const i = L.indexOf(id); if (i < 0) return; L.splice(i, 1); L.splice(Math.max(0, Math.min(L.length, hedef)), 0, id); d.ozel = L.concat(tum); api.save(); ciz(); };
      const ciz = () => {
        const L = sirala();
        if (d.mod === "ogretmen") {
          liste.classList.add("sr-duzen");
          liste.replaceChildren(...(L.length ? L.map((st, i) => h("li" + (i === 0 ? ".bas" : "") + (secili === st.id ? ".secili" : ""), { onclick: () => { if (secili && secili !== st.id) { const s0 = secili; secili = null; tasi(s0, i); } else { secili = secili === st.id ? null : st.id; ciz(); } } },
            h("span.sr-no", i + 1), T.avatar(st.name, 30), h("span", st.name),
            h("span.sr-ok", h("button.btn.sm.icon.c-chalk", { "aria-label": st.name + " yukarı", disabled: i === 0 ? true : null, onclick: (e) => { e.stopPropagation(); tasi(st.id, i - 1); } }, "▲"),
              h("button.btn.sm.icon.c-chalk", { "aria-label": st.name + " aşağı", disabled: i === L.length - 1 ? true : null, onclick: (e) => { e.stopPropagation(); tasi(st.id, i + 1); } }, "▼")))) : [h("p.hint", "Sınıf listesi boş.")]));
          ipucu.textContent = secili ? "Şimdi gideceği yere dokun" : "Bir isme dokun, sonra gideceği yere dokun. Oklarla da taşıyabilirsin.";
          return;
        }
        liste.classList.remove("sr-duzen"); ipucu.textContent = "";
        liste.replaceChildren(...(L.length ? L.map((st, i) => h("li" + (i === 0 ? ".bas" : i === L.length - 1 ? ".son" : ""), h("span.sr-no", i + 1), T.avatar(st.name, 30), h("span", st.name), i === 0 ? h("em", "Hat başı") : i === 1 ? h("em", "Kapıyı tutar") : i === L.length - 1 && L.length > 2 ? h("em", "Işıkları kapatır") : null)) : [h("div.hint", "Sınıf listesi boş.")]));
      };
      body.append(h("div.row", { style: { gap: "6px", flexWrap: "wrap", justifyContent: "center" } },
        h("div.seg", [["gun", "Her gün döner"], ["karisik", "Karışık"], ["ogretmen", "Ben belirlerim"]].map(([k, l]) => h("button", { "aria-pressed": String(d.mod === k), onclick: (e) => { d.mod = k; if (k === "ogretmen" && !d.ozel) d.ozel = sirala().map((x) => x.id); if (k === "karisik" && d.tarih !== T.isoDate()) { d.karisik = T.shuffle(c.students.map((x) => x.id)); d.tarih = T.isoDate(); } e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); api.save(); ciz(); } }, l))),
        h("button.btn.sm.c-chalk", { onclick: () => { d.mod = "karisik"; d.karisik = T.shuffle(c.students.map((x) => x.id)); d.tarih = T.isoDate(); T.sound.drum && T.sound.drum(); api.save(); body.replaceChildren(); W.sira.render(body, w, api); } }, T.icon("turn"), "Yeniden karıştır")), h("div.sr-govde", ipucu, liste));
      ciz();
    },
  };
})();
