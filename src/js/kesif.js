/* Bölüm düzeni: Türkçe tek bölüm (ilk okuma yazma sekmesiyle), Hayat ve Fen tek bölüm (her ünitede kullanılan sorgulama araçlarıyla),
   SDÖ araçları Maarif sosyal duygusal öğrenme becerilerine göre, sınıf kültürü araçları ayrı. */
(function () {
  const { h } = T;
  const cid = () => T.store.activeClass().id;
  const fit = (t, g) => (t.grades ? g >= t.grades[0] && g <= t.grades[1] : true);
  const kartlar = (ids, ton) => h("div.tool-grid", { style: { marginBottom: "18px" } }, ids.filter(([, t]) => t).map(([r, t]) => T.aracKart(r, t, ton)));
  const grupBas = (b, alt) => h("div.section-title", h("h2", b), alt ? h("span.hint", alt) : null);
  const yerel = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };

  /* ---------- Türkçe: tek bölüm, en başta İlk okuma yazma sekmesi ---------- */
  const turkceAsil = T.sections.turkce.render;
  const turkceSekme = () => yerel("ta-turkce-sek:" + cid()) || (T.store.grade() <= 1 ? "ilk" : "turkce");
  T.sections.turkce.render = function (view, sub) {
    if (sub && T.tools[sub]) return T.toolPage(view, sub);
    const sek = turkceSekme();
    (sek === "ilk" ? T.sections.birinci.render : turkceAsil).call(this, view, sub);
    const inner = view.querySelector(".view-inner"); if (!inner) return;
    inner.prepend(h("div.seg.ders-sekme", { role: "tablist", "aria-label": "Türkçe bölümleri" },
      [["ilk", "İlk okuma yazma"], ["turkce", "Okuma, anlama, yazma"]].map(([k, l]) => h("button", { role: "tab", "aria-pressed": String(k === sek), onclick: () => { yerel("ta-turkce-sek:" + cid(), k); T.route(); } }, l))));
    const bas = inner.querySelector(".page-head h1"); if (bas) bas.textContent = "Türkçe";
  };
  T.sections.birinci.title = "Türkçe";

  /* ---------- Hayat ve Fen: her ünitede kullanılan sorgulama araçları ---------- */
  const tool = (id, def) => (T.tools[id] = Object.assign({ back: "kesif", grades: [1, 4], grup: "Her ünitede kullan" }, def));
  const konuSatiri = (k, yer) => { const s = T.store.get(); const v = ((s.pano || {})[cid()] || {})["konu:" + k] || "";
    return h("input.in.ks-konu", { value: v, placeholder: yer, "aria-label": "Konu ya da soru", onchange: (e) => T.store.update((st) => { st.pano = st.pano || {}; const c = (st.pano[cid()] = st.pano[cid()] || {}); c["konu:" + k] = e.target.value; }) }); };

  tool("gor-dusun-merak", {
    title: "Gör, düşün, merak et", icon: "eye", tone: "sky", short: "Bir görsele ya da nesneye bakıp sorgulamayı başlatır",
    render(host) {
      T.notPanosu(host, { anahtar: "gdm", ust: () => h("div", { style: { display: "grid", gap: "8px", marginBottom: "10px" } }, konuSatiri("gdm", "Ne inceliyoruz? Örneğin: bir yaprak, bir fotoğraf, bir harita"), h("p.sb-line", "Önce sadece gördüğümüzü söyleyelim, sonra yorum yapalım.")),
        kolonlar: [["Ne görüyorum?", "Sadece gözüne görüneni söyle.", "#2E7BB4"], ["Ne düşünüyorum?", "Bu neden böyle olabilir?", "#6DAF5A"], ["Neyi merak ediyorum?", "Hangi soruların var?", "#E9A23B"]],
        not: "Düşünme rutini. Görseli Ders modunda Görsel aracıyla tahtaya koyabilirsin." });
    },
  });
  tool("bil-merak-ogren", {
    title: "Biliyorum, merak ediyorum, öğrendim", icon: "brain", tone: "grape", short: "Ünite başında ve sonunda doldurulan merak panosu",
    render(host) {
      T.notPanosu(host, { anahtar: "bmo", ust: () => h("div", { style: { marginBottom: "10px" } }, konuSatiri("bmo", "Ünite ya da konu: örneğin Mevsimler")),
        kolonlar: [["Biliyorum", "Bu konu hakkında ne biliyoruz?", "#1B2A4A"], ["Merak ediyorum", "Neyi öğrenmek istiyoruz?", "#E07B3C"], ["Öğrendim", "Ünite sonunda: neyi öğrendik?", "#2E8B57"]],
        not: "İlk iki sütunu ünite başında, üçüncüsünü ünite sonunda doldurun. Merak sorularını işaretleyip yanıtlananları konuşun." });
    },
  });
  tool("tahmin-gozle-acikla", {
    title: "Tahmin et, gözle, açıkla", icon: "fen", tone: "leaf", grades: [2, 4], short: "Deneyden önce tahmin, sonra gözlem ve açıklama",
    render(host) {
      T.notPanosu(host, { anahtar: "tga", ust: () => h("div", { style: { display: "grid", gap: "8px", marginBottom: "10px" } }, konuSatiri("tga", "Deney sorusu: örneğin Buz suda batar mı?"), h("p.sb-line", "Tahminler değişmez, deneyden sonra karşılaştırırız.")),
        kolonlar: [["Tahminim", "Ne olacak? Neden böyle düşünüyorum?", "#5B7DB1"], ["Gözlemim", "Ne oldu? Gördüklerimi yazıyorum.", "#E9A23B"], ["Açıklamam", "Tahminim tuttu mu? Neden?", "#2E8B57"]],
        not: "Deney tutmazsa bu da veridir: neyin farklı olduğunu Açıklama sütununa yazın." });
    },
  });

  tool("siniflandir", {
    title: "Sınıflandırma panosu", icon: "filter", tone: "sun", short: "Kartları öğretmenin belirlediği gruplara ayırın",
    render(host) {
      const k = "sinif:" + cid();
      const oku = () => { const s = T.store.get(); return ((s.pano || {})[cid()] || {}).siniflandir || { gruplar: ["Canlı", "Cansız"], kartlar: ["kedi", "taş", "ağaç", "kalem", "kuş", "su"].map((t) => ({ t, g: null })) }; };
      const yaz = (fn) => T.store.update((st) => { st.pano = st.pano || {}; const c = (st.pano[cid()] = st.pano[cid()] || {}); const v = c.siniflandir || oku(); fn(v); c.siniflandir = v; });
      let secili = null; const box = h("div"); host.append(box);
      const ciz = () => {
        const v = oku();
        const kart = (x, i) => h("button.sn-kart" + (secili === i ? ".on" : ""), { onclick: () => { secili = secili === i ? null : i; ciz(); } }, x.t);
        const grupKutu = (g, gi) => h("div.sn-grup", { onclick: (e) => { if (secili == null || e.target.closest(".sn-kart")) return; yaz((x) => (x.kartlar[secili].g = gi)); secili = null; T.sound && T.sound.pop && T.sound.pop(); ciz(); } },
          h("input.sn-ad", { value: g, "aria-label": "Grup adı", onclick: (e) => e.stopPropagation(), onchange: (e) => yaz((x) => (x.gruplar[gi] = e.target.value)) }),
          h("div.sn-icerik", v.kartlar.map((x, i) => [x, i]).filter(([x]) => x.g === gi).map(([x, i]) => kart(x, i))));
        const yeni = h("input.in", { placeholder: "Yeni kart yaz, Enter", onkeydown: (e) => { if (e.key === "Enter" && e.target.value.trim()) { const t = e.target.value.trim(); yaz((x) => x.kartlar.push({ t, g: null })); ciz(); setTimeout(() => box.querySelector(".sn-ekle input").focus(), 20); } } });
        box.replaceChildren(
          h("p.sb-line", secili == null ? "Bir karta dokun, sonra ait olduğu gruba dokun." : "Şimdi gruba dokun. Vazgeçmek için karta tekrar dokun."),
          h("div.sn-havuz", { onclick: (e) => { if (secili == null || e.target.closest(".sn-kart")) return; yaz((x) => (x.kartlar[secili].g = null)); secili = null; ciz(); } }, h("small", "Yerleşmeyen kartlar"), h("div.sn-icerik", v.kartlar.map((x, i) => [x, i]).filter(([x]) => x.g == null).map(([x, i]) => kart(x, i)))),
          h("div.sn-gruplar", { style: { gridTemplateColumns: "repeat(" + v.gruplar.length + ", 1fr)" } }, v.gruplar.map(grupKutu)),
          h("div.row.sn-ekle", { style: { gap: "8px", flexWrap: "wrap" } }, yeni,
            h("button.btn.sm.c-chalk", { onclick: () => { if (v.gruplar.length >= 4) return T.toast("En fazla dört grup"); yaz((x) => x.gruplar.push("Yeni grup")); ciz(); } }, T.icon("plus"), "Grup ekle"),
            v.gruplar.length > 2 ? h("button.btn.sm.c-chalk", { onclick: () => { yaz((x) => { const n = x.gruplar.length - 1; x.gruplar.pop(); x.kartlar.forEach((c) => { if (c.g === n) c.g = null; }); }); ciz(); } }, "Son grubu sil") : null,
            h("button.btn.sm.c-chalk", { onclick: () => { yaz((x) => x.kartlar.forEach((c) => (c.g = null))); ciz(); } }, T.icon("reset"), "Kartları geri topla"),
            h("button.btn.sm.c-tomato", { onclick: async () => { if (await T.confirm("Bütün kartlar silinsin mi?")) { yaz((x) => (x.kartlar = [])); ciz(); } } }, T.icon("trash"), "Kartları sil")));
      };
      ciz();
    },
  });

  tool("gozlem-gunlugu", {
    title: "Gözlem günlüğü", icon: "calendar", tone: "leaf", short: "Bitki boyu, sıcaklık, hava: her gün bir ölçüm, grafik kendiliğinden",
    render(host) {
      const oku = () => { const s = T.store.get(); return ((s.pano || {})[cid()] || {}).gozlem || { ad: "Fasulyemizin boyu", birim: "cm", olcum: [] }; };
      const yaz = (fn) => T.store.update((st) => { st.pano = st.pano || {}; const c = (st.pano[cid()] = st.pano[cid()] || {}); const v = c.gozlem || oku(); fn(v); c.gozlem = v; });
      const box = h("div"); host.append(box);
      const ciz = () => {
        const v = oku(), l = v.olcum.slice().sort((a, b) => a.t.localeCompare(b.t)), mx = Math.max(1, ...l.map((x) => +x.d || 0));
        const deger = h("input.in", { type: "number", step: "any", placeholder: "Bugünkü ölçüm", style: { width: "170px", fontSize: "20px" } });
        const not = h("input.in", { placeholder: "Kısa not (isteğe bağlı)", style: { flex: 1 } });
        const ekle = () => { const d = parseFloat(String(deger.value).replace(",", ".")); if (!Number.isFinite(d)) return T.toast("Önce bir sayı yaz"); yaz((x) => { x.olcum = x.olcum.filter((o) => o.t !== T.isoDate()); x.olcum.push({ t: T.isoDate(), d, n: not.value.trim() }); }); ciz(); };
        box.replaceChildren(
          h("div.row", { style: { gap: "8px", flexWrap: "wrap", marginBottom: "10px" } },
            h("input.in", { value: v.ad, "aria-label": "Neyi gözlüyoruz?", style: { flex: 2, minWidth: "220px", fontWeight: 800, fontSize: "20px" }, onchange: (e) => yaz((x) => (x.ad = e.target.value)) }),
            h("input.in", { value: v.birim, "aria-label": "Birim", style: { width: "110px" }, onchange: (e) => { yaz((x) => (x.birim = e.target.value)); ciz(); } })),
          h("div.row", { style: { gap: "8px", flexWrap: "wrap" } }, deger, h("span", v.birim), not, h("button.btn.c-leaf", { onclick: ekle }, T.icon("plus"), "Bugünü kaydet")),
          l.length ? h("div.gz-grafik", l.map((x) => h("div.gz-sut", { title: x.n || "" }, h("b", String(x.d).replace(".", ",")), h("i", { style: { height: Math.max(4, (x.d / mx) * 100) + "%" } }), h("small", x.t.slice(8, 10) + "." + x.t.slice(5, 7))))) : h("p.hint", "Henüz ölçüm yok. Her gün aynı saatte ölçüp kaydedin, sütunlar burada büyür."),
          l.length ? h("div.gz-liste", l.slice().reverse().map((x) => h("div.row", { style: { gap: "10px" } }, h("b", x.t.split("-").reverse().join(".")), h("span", String(x.d).replace(".", ",") + " " + v.birim), h("span.hint", { style: { flex: 1 } }, x.n || ""),
            h("button.btn.sm.icon.c-chalk", { "aria-label": "Ölçümü sil", onclick: () => { yaz((o) => (o.olcum = o.olcum.filter((y) => y.t !== x.t))); ciz(); } }, T.icon("trash"))))) : null);
      };
      ciz();
    },
  });

  T.sections.kesif = {
    title: "Hayat ve Fen", icon: "fen", tone: "leaf", desc: "Sorgulama araçları, Hayat Bilgisi ve Fen etkinlikleri",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const g = T.store.grade(), wrap = h("div.view-inner"); view.append(wrap);
      const ad = T.kesifAdi(g);
      wrap.append(h("div.page-head", h("h1", ad), h("div.sub", "Önce her ünitede işe yarayan sorgulama araçları, sonra sınıf düzeyine uygun Hayat Bilgisi ve Fen etkinlikleri. Kendi konunu aracın içine yazarsın.")));
      const al = (back) => Object.entries(T.tools).filter(([, t]) => t.back === back).map(([k, t]) => [back + "-" + k, t]);
      const ortak = al("kesif"); wrap.append(grupBas("Her ünitede kullan", "Konudan bağımsız, her ünitede açılır"), kartlar(ortak, "leaf"));
      const hb = al("sosyal").filter(([, t]) => fit(t, g)), fen = al("fen").filter(([, t]) => fit(t, g));
      if (hb.length) wrap.append(grupBas(g <= 3 ? "Hayat Bilgisi" : "Sosyal Bilgiler"), kartlar(hb, "sky"));
      if (fen.length) wrap.append(grupBas("Fen Bilimleri"), kartlar(fen, "leaf"));
      const diger = al("sosyal").concat(al("fen")).filter(([, t]) => !fit(t, g));
      if (diger.length) wrap.append(h("details.ks-diger", h("summary", "Başka sınıflar için " + diger.length + " etkinlik"), kartlar(diger, "chalk")));
      wrap.append(h("p.hint", { style: { marginTop: "8px" } }, "MEB'in ders kitapları ve farklılaştırma etkinlikleri için: ", h("a", { href: "https://tymm.meb.gov.tr/ders-kitaplari", target: "_blank", rel: "noopener" }, "tymm.meb.gov.tr")));
    },
  };
  T.kesifAdi = (g = T.store.grade()) => (g <= 2 ? "Hayat Bilgisi" : g === 3 ? "Hayat ve Fen" : "Fen ve Sosyal");

  /* ---------- SDÖ: Maarif sosyal duygusal öğrenme becerilerine göre ---------- */
  const SDB = [
    ["Kendini tanıma", "SDB1.1", ["duygumetre", "bolgeler", "duygu-kartlari", "beynim"]],
    ["Kendini düzenleme", "SDB1.2", ["sakinlesme", "zihin-suzgeci", "dusunce-istasyonu", "sogusun"]],
    ["Kendine uyarlama ve yansıtma", "SDB1.3", ["gul-diken", "gelecek-teleskobu", "favori-hatalar", "ogrenme-cukuru"]],
    ["İletişim ve sosyal farkındalık", "SDB2.1, SDB2.3", ["iltifat", "seninle-mi"]],
    ["Sorumlu karar verme", "SDB3.3", ["sorun-boyutu", "catisma"]],
  ];
  const KULTUR = [
    ["Öğrenmeyi görünür kılma", ["anlama-duzeyi", "uc-adim", "takildim", "bump-it-up"]],
    ["Sınıf düzeni", ["bitirdim", "yz-duzeyi"]],
    ["Yansıtma panoları", ["calma-listesi", "bookflix"]],
  ];
  T.sections.duygu.title = "SDÖ araçlarımız";
  T.sections.duygu.render = function (view, sub) {
    if (sub && T.tools[sub]) return T.toolPage(view, sub);
    const wrap = h("div.view-inner"); view.append(wrap);
    wrap.append(h("div.page-head", h("h1", "SDÖ araçlarımız"), h("div.sub", "Sosyal duygusal öğrenme araçları, Maarif Modeli'ndeki sosyal duygusal öğrenme becerilerine göre gruplandı. Öğrencilerin seçimleri yalnızca bu cihazda kalır.")));
    SDB.forEach(([ad, kod, ids]) => wrap.append(grupBas(ad, kod), kartlar(ids.map((id) => ["duygu-" + id, T.tools[id]]), "pink")));
    wrap.append(h("p.hint", "Sınıf düzeni araçları (Basamak duvarı, Etkinliğim bitti, YZ düzeyi) artık ", h("a", { href: "#kultur", onclick: (e) => { e.preventDefault(); T.go("kultur"); } }, "Sınıf düzenimiz"), " bölümünde."));
  };
  T.sections.kultur = {
    title: "Sınıf düzenimiz", icon: "trophy", tone: "sun", desc: "Bump It Up, Etkinliğim bitti, YZ düzeyi, anlama düzeyi",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const wrap = h("div.view-inner"); view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Sınıf düzenimiz"), h("div.sub", "Öğrenmeyi görünür kılan, sınıfın birlikte kural ve düzen kurduğu panolar.")));
      KULTUR.forEach(([ad, ids]) => wrap.append(grupBas(ad), kartlar(ids.map((id) => ["kultur-" + id, T.tools[id]]), "sun")));
    },
  };

  /* ---------- MEB kitabı: aracın sağında açılır ---------- */
  const MK = "https://tymm.meb.gov.tr/kitap/";
  T.MEB_KITAP = [
    [1, "turkce", 31, "İlk Okuma Yazma Kitabı (1. kitap)"], [1, "turkce", 32, "İlk Okuma Yazma Kitabı (2. kitap)"], [1, "turkce", 29, "Türkçe 1 (1. kitap)"], [1, "turkce", 30, "Türkçe 1 (2. kitap)"],
    [1, "matematik", 23, "Matematik 1 (1. kitap)"], [1, "matematik", 24, "Matematik 1 (2. kitap)"], [1, "matematik", 85, "Matematik 1 farklılaştırma etkinlikleri"],
    [1, "hayat", 21, "Hayat Bilgisi 1 (1. kitap)"], [1, "hayat", 22, "Hayat Bilgisi 1 (2. kitap)"],
    [2, "turkce", 58, "Türkçe 2 (1. kitap)"], [2, "turkce", 59, "Türkçe 2 (2. kitap)"],
    [2, "matematik", 52, "Matematik 2 (1. kitap)"], [2, "matematik", 53, "Matematik 2 (2. kitap)"], [2, "matematik", 86, "Matematik 2 farklılaştırma etkinlikleri"],
    [2, "hayat", 50, "Hayat Bilgisi 2 (1. kitap)"], [2, "hayat", 51, "Hayat Bilgisi 2 (2. kitap)"],
    [2, "ingilizce", 151, "İngilizce 2 ders kitabı"], [2, "ingilizce", 152, "İngilizce 2 çalışma kitabı"],
    [3, "turkce", 286, "Türkçe 3 (2. kitap)"], [3, "turkce", 347, "Okuyorum Anlıyorum 3"],
    [3, "matematik", 278, "Matematik 3 (1. kitap)"], [3, "matematik", 279, "Matematik 3 (2. kitap)"],
    [3, "hayat", 275, "Hayat Bilgisi 3 (1. kitap)"], [3, "hayat", 276, "Hayat Bilgisi 3 (2. kitap)"], [3, "hayat", 363, "Hayat Bilgisi 3 farklılaştırma etkinlikleri"],
    [3, "fen", 270, "Fen Bilimleri 3 (1. kitap)"], [3, "fen", 271, "Fen Bilimleri 3 (2. kitap)"], [3, "fen", 361, "Fen Bilimleri 3 farklılaştırma etkinlikleri"],
    [0, "turkce", 141, "Okumaya Başlıyorum 1"], [0, "turkce", 142, "Okumaya Başlıyorum 2"], [0, "turkce", 143, "Okumaya Başlıyorum 3"], [0, "turkce", 144, "Okumaya Başlıyorum 4"],
  ];
  const KITAP_DERS = { turkce: ["turkce"], birinci: ["turkce"], matematik: ["matematik"], kesif: ["hayat", "fen"], sosyal: ["hayat"], fen: ["fen", "hayat"], ingilizce: ["ingilizce"] };
  T.kitapDersi = (back) => KITAP_DERS[back || "matematik"];
  T.kitapPaneli = function (back, kapat) {
    const dersler = T.kitapDersi(back) || [], g = T.store.grade();
    const hepsi = T.MEB_KITAP.filter((k) => dersler.includes(k[1]));
    const uygun = hepsi.filter((k) => k[0] === g || k[0] === 0); const liste = uygun.length ? uygun : hepsi;
    const anahtar = "ta-kitap:" + cid() + ":" + dersler[0];
    let sec = +yerel(anahtar) || (liste[0] || [])[2];
    const cer = h("iframe.ky-cerceve", { title: "MEB kitabı", loading: "lazy", referrerpolicy: "no-referrer" });
    const yeniSekme = h("a.btn.sm.c-chalk", { target: "_blank", rel: "noopener" }, T.icon("next"), "Yeni sekmede aç");
    const yukle = () => { const u = MK + sec + "/x"; if (cer.getAttribute("src") !== u) cer.setAttribute("src", u); yeniSekme.href = u; };
    const secici = h("select.in", { "aria-label": "Kitap seç", onchange: (e) => { sec = +e.target.value; yerel(anahtar, String(sec)); yukle(); } },
      liste.map((k) => h("option", { value: k[2], selected: k[2] === sec ? true : null }, k[3])));
    const panel = h("aside.kitap-yan", { "aria-label": "MEB kitabı" },
      h("div.ky-ust", T.icon("book"), h("b", "MEB kitabı"), h("div.grow"), h("button.btn.sm.icon.c-chalk", { "aria-label": "Kitabı kapat", title: "Kitabı kapat", onclick: kapat }, T.icon("close"))),
      liste.length ? secici : h("p.hint", "Bu sınıf için listede kitap yok."),
      h("div.row", { style: { gap: "8px", flexWrap: "wrap" } }, yeniSekme, h("a.btn.sm.c-chalk", { href: "https://tymm.meb.gov.tr/ders-kitaplari", target: "_blank", rel: "noopener" }, "Tüm MEB kitapları")),
      liste.length ? cer : null,
      h("p.hint.ky-not", "Kitap MEB'in kendi sitesinden açılır. Sayfa açılmazsa Yeni sekmede aç'a dokun."));
    if (liste.length) yukle();
    return panel;
  };

  T.YARDIM = T.YARDIM || {};
  Object.assign(T.YARDIM, {
    kesif: ["Hayat ve Fen", "Her ünitede kullanılan sorgulama araçları ve sınıf düzeyine uygun etkinlikler.", ["Gör, düşün, merak et ile bir görselden sorgulamayı başlat.", "Sınıflandırma panosunda grupları ve kartları sen yazarsın.", "Gözlem günlüğü her gün bir ölçüm kaydeder, grafiği kendisi çizer."]],
    duygu: ["SDÖ araçlarımız", "Duyguyu tanıma, sakinleşme, yansıtma ve çatışma çözme araçları. Maarif SDÖ becerilerine göre gruplu.", ["Duygumetreyi sabah ya da teneffüs dönüşü aç.", "Sorun ne büyüklükte? aracı şikâyetleri sınıflandırmaya yardım eder.", "Öğrencilerin seçimleri yalnızca bu cihazda kalır."]],
    kultur: ["Sınıf düzenimiz", "Bump It Up duvarı, Etkinliğim bitti menüsü, YZ düzeyi ve anlama düzeyi panoları.", ["Basamak duvarına kendi örnek fotoğraflarını yükleyebilirsin.", "Etkinliğim bitti menüsünü sınıfla birlikte oylayarak kurun."]],
  });
})();
