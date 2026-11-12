/* Ölçme ve değerlendirme araçları (MEB biçimlendirici değerlendirme kılavuzlarındaki yapıya göre):
   dereceleme ölçeği (1-3: Geliştirilmeli, Orta, İyi), kontrol listesi (+/−), öz ve akran değerlendirme formları,
   hızlı yoklama ve gelişim takibi. Puanlar yalnızca bu cihazda, sınıfa göre saklanır. */
(function () {
  const { h } = T;
  const cid = () => T.store.activeClass().id;
  const DUZEY = [["gel", "Geliştirilmeli", "#C2453A"], ["orta", "Orta", "#D98A1F"], ["iyi", "İyi", "#2E8B57"]];
  const GERI = { gel: "Bu ölçütlerde biraz daha çalışmaya ihtiyacın var. Birlikte bir adım daha atalım.", orta: "Güzel bir yoldasın. Eksik kalan ölçütlere odaklanırsan daha da iyi olacak.", iyi: "Harika! Ölçütlerin hepsini başarıyla gösterdin. Bir arkadaşına da yol gösterebilirsin." };
  const SABLON = [
    ["Sunum", ["Konuyu açık anlattı", "Sesini duyulur kullandı", "Dinleyenlerle göz teması kurdu", "Süreyi iyi kullandı"]],
    ["Poster ya da ürün", ["Konuyla ilgili bilgi doğru", "Başlık ve görseller uyumlu", "Düzenli ve okunaklı", "Özgün bir fikir var"]],
    ["Grup çalışması", ["Görevini yerine getirdi", "Arkadaşlarını dinledi", "Fikirlerini paylaştı", "Malzemeyi paylaştı ve topladı"]],
    ["Deney ve gözlem", ["Tahminde bulundu", "Gözlemini doğru kaydetti", "Sonucu açıkladı", "Güvenlik kurallarına uydu"]],
    ["Sesli okuma", ["Akıcı okudu", "Noktalamaya uydu", "Vurgu ve tonlama yaptı", "Okuduğunu anlattı"]],
    ["Yazma", ["Başlık koydu", "Giriş, gelişme, sonuç var", "Büyük harf ve noktalama doğru", "Kelimeleri doğru yazdı"]],
  ];
  const oku = () => ((T.store.get().olcmeArac || {})[cid()]) || { olcekler: [], yoklama: null };
  const yaz = (fn) => T.store.update((s) => { s.olcmeArac = s.olcmeArac || {}; const c = (s.olcmeArac[cid()] = s.olcmeArac[cid()] || { olcekler: [] }); fn(c); });
  const olcek = (id) => oku().olcekler.find((o) => o.id === id);
  /* MEB kılavuzlarındaki gibi: toplam puan aralığı üçe bölünür */
  const duzey = (o, p) => {
    const k = o.kriter.length; if (!k) return null;
    const v = o.kriter.map((_, i) => p && p[i]); if (v.some((x) => !x && x !== 0)) return null;
    if (o.tur === "liste") { const n = v.filter((x) => x === 1).length, oran = n / k; return { top: n + " / " + k, d: oran < 0.5 ? 0 : oran < 0.85 ? 1 : 2 }; }
    const t = v.reduce((a, b) => a + b, 0), alt = k, ust = 3 * k, adim = (ust - alt + 1) / 3;
    return { top: t + " / " + ust, d: t < alt + adim ? 0 : t < alt + 2 * adim ? 1 : 2 };
  };
  const tarihYaz = (iso) => new Date(iso + "T12:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long" });

  /* ---------- Yazdırma ---------- */
  function yazdir(dugum, yon) {
    document.querySelectorAll("#rt-baski, #rt-baski-stil").forEach((x) => x.remove());
    const kap = h("div#rt-baski.oa-baski", dugum);
    const st = h("style#rt-baski-stil", "@page { size: A4 " + (yon === "dikey" ? "portrait" : "landscape") + "; margin: 10mm; }");
    document.head.append(st); document.body.append(kap); document.documentElement.classList.add("rt-yazdiriliyor");
    const bitir = () => { window.removeEventListener("afterprint", bitir); if (!kap.isConnected) return; document.documentElement.classList.remove("rt-yazdiriliyor"); kap.remove(); st.remove(); };
    window.addEventListener("afterprint", bitir);
    setTimeout(() => { try { window.print(); } catch (e) {} setTimeout(bitir, 1500); }, 60);
  }
  T.olcmeYazdir = yazdir;
  const formUst = (baslik, alt) => h("div.oa-f-ust", h("div", h("h2", baslik), alt ? h("small", alt) : null), h("div.oa-f-kim", "Sınıf: " + T.store.activeClass().name, h("span", "Tarih: ........................")));
  const formOlcek = (o, dolu) => {
    const ogr = T.store.activeClass().students;
    return h("div.oa-f", formUst(o.ad, (o.tur === "liste" ? "Kontrol listesi (+ / −)" : "Dereceleme ölçeği: 1 Geliştirilmeli, 2 Orta, 3 İyi") + (o.ders ? " · " + o.ders : "")),
      h("table.oa-f-tablo", h("tr", h("th", "Öğrenci"), o.kriter.map((k) => h("th", k)), h("th", "Puan"), h("th", "Düzey")),
        ogr.map((st) => { const p = (o.puan || {})[st.id] || {}, d = dolu ? duzey(o, p) : null; return h("tr", h("td", st.name), o.kriter.map((_, i) => h("td", dolu && p[i] != null ? (o.tur === "liste" ? (p[i] ? "+" : "−") : p[i]) : "")), h("td", d ? d.top : ""), h("td", d ? DUZEY[d.d][1] : "")); })),
      h("div.oa-f-alt", "Tahta Atölyesi · MEB biçimlendirici değerlendirme kılavuzlarındaki yapıya göre"));
  };
  const YUZ = [["😊", "Yapabiliyorum"], ["🙂", "Biraz yardımla"], ["😐", "Henüz değil"]];
  const ozForm = (o, akran) => h("div.oa-f.oa-oz", formUst(akran ? "Arkadaşımı değerlendiriyorum" : "Kendimi değerlendiriyorum", o.ad),
    h("div.oa-oz-kim", akran ? ["Benim adım: ", h("i"), " Arkadaşımın adı: ", h("i")] : ["Adım: ", h("i")]),
    h("table.oa-oz-tablo", h("tr", h("th", akran ? "Arkadaşım..." : "Ben..."), YUZ.map(([e, l]) => h("th", h("span", e), l))), o.kriter.map((k) => h("tr", h("td", k), YUZ.map(() => h("td", h("b.oa-yuvarlak")))))),
    akran ? h("div.oa-yildiz", h("div", h("b", "⭐ ⭐ İki yıldız"), h("small", "Arkadaşının en iyi yaptığı iki şey"), h("i"), h("i")), h("div", h("b", "🌱 Bir dilek"), h("small", "Bir dahaki sefere şunu deneyebilir"), h("i")))
      : h("div.oa-yildiz", h("div", h("b", "En çok neyi başardım?"), h("i"), h("i")), h("div", h("b", "Bir dahaki sefere neyi deneyeceğim?"), h("i"), h("i"))),
    h("div.oa-f-alt", "Tahta Atölyesi"));
  const geriFisleri = (o) => {
    const ogr = T.store.activeClass().students.filter((st) => duzey(o, (o.puan || {})[st.id]));
    return h("div.oa-fisler", ogr.map((st) => { const d = duzey(o, o.puan[st.id]); return h("div.oa-fis", h("b", st.name), h("small", o.ad + " · " + DUZEY[d.d][1]), h("p", (o.geri || GERI)[DUZEY[d.d][0]])); }));
  };

  /* ---------- Ölçek sayfası ---------- */
  function olcekSayfasi(view, o) {
    const wrap = h("div.view-inner.genis"); view.append(wrap);
    const ogr = T.store.activeClass().students;
    let duzen = false;
    const ciz = () => {
      o = olcek(o.id); if (!o) return T.go("olcme");
      const say = [0, 0, 0]; ogr.forEach((st) => { const d = duzey(o, (o.puan || {})[st.id]); if (d) say[d.d]++; });
      const hucre = (st, i) => {
        const v = ((o.puan || {})[st.id] || {})[i];
        const et = o.tur === "liste" ? (v === 1 ? "+" : v === 0 ? "−" : "") : v || "";
        return h("td", h("button.oa-hucre" + (v != null ? ".d" + (o.tur === "liste" ? (v ? 2 : 0) : v - 1) : ""), { "aria-label": st.name + ", " + o.kriter[i], onclick: () => {
          yaz((c) => { const x = c.olcekler.find((q) => q.id === o.id); x.puan = x.puan || {}; const p = (x.puan[st.id] = x.puan[st.id] || {}); const cur = p[i]; p[i] = o.tur === "liste" ? (cur === 1 ? 0 : cur === 0 ? null : 1) : cur == null ? 3 : cur === 1 ? null : cur - 1; if (p[i] == null) delete p[i]; });
          T.sound.tick && T.sound.tick(); ciz();
        } }, et));
      };
      const kriterDuzen = duzen ? h("div.oa-duzen",
        h("label", "Ölçeğin adı", h("input.in", { value: o.ad, onchange: (e) => yaz((c) => (c.olcekler.find((q) => q.id === o.id).ad = e.target.value)) })),
        h("label", "Ders ya da konu", h("input.in", { value: o.ders || "", onchange: (e) => yaz((c) => (c.olcekler.find((q) => q.id === o.id).ders = e.target.value)) })),
        h("b", "Ölçütler"), o.kriter.map((k, i) => h("div.row", { style: { gap: "6px" } }, h("input.in", { value: k, onchange: (e) => yaz((c) => (c.olcekler.find((q) => q.id === o.id).kriter[i] = e.target.value)) }),
          h("button.btn.sm.c-chalk", { "aria-label": "Ölçütü sil", onclick: () => { yaz((c) => { const x = c.olcekler.find((q) => q.id === o.id); x.kriter.splice(i, 1); Object.values(x.puan || {}).forEach((p) => { for (let j = i; j < 12; j++) { if (p[j + 1] != null) p[j] = p[j + 1]; else delete p[j]; } }); }); ciz(); } }, "×"))),
        o.kriter.length < 8 ? h("button.btn.sm.c-chalk", { onclick: () => { yaz((c) => c.olcekler.find((q) => q.id === o.id).kriter.push("Yeni ölçüt")); ciz(); } }, T.icon("plus"), "Ölçüt ekle") : null,
        h("b", "Düzeylere göre geri bildirim"), DUZEY.map(([k, l]) => h("label", l, h("textarea.in", { rows: 2, value: (o.geri || GERI)[k], onchange: (e) => yaz((c) => { const x = c.olcekler.find((q) => q.id === o.id); x.geri = Object.assign({}, GERI, x.geri || {}); x.geri[k] = e.target.value; }) })))) : null;
      wrap.replaceChildren(
        h("div.stage-bar", h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go("olcme") }, T.icon("back")), h("h2", o.ad), h("span.hint", (o.tur === "liste" ? "Kontrol listesi" : "Dereceleme ölçeği") + " · " + tarihYaz(o.tarih)), h("div.grow"),
          h("button.btn.c-chalk" + (duzen ? ".on" : ""), { onclick: () => { duzen = !duzen; ciz(); } }, T.icon("edit"), duzen ? "Düzenlemeyi bitir" : "Ölçütleri düzenle")),
        h("div.oa-dz", kriterDuzen ? kriterDuzen : null, h("div.oa-tablo-kap",
          h("p.hint", { style: { margin: "0 0 8px" } }, o.tur === "liste" ? "Hücreye dokun: + (var), − (yok), boş." : "Hücreye dokun: 3 İyi, 2 Orta, 1 Geliştirilmeli, boş. Satır dolunca düzey kendiliğinden hesaplanır."),
          h("table.oa-tablo", h("tr", h("th", "Öğrenci"), o.kriter.map((k) => h("th", k)), h("th", "Düzey")),
            ogr.map((st) => { const d = duzey(o, (o.puan || {})[st.id]); return h("tr", h("td.oa-ad", T.avatar(st.name, 26), st.name), o.kriter.map((_, i) => hucre(st, i)), h("td", d ? h("span.oa-rozet", { style: { background: DUZEY[d.d][2] } }, DUZEY[d.d][1], h("small", d.top)) : h("span.hint", "…"))); })))),
        h("div.oa-ozet", DUZEY.map(([, l, c], i) => h("div", { style: { "--c": c } }, h("b", String(say[i])), l)), h("div.grow"),
          h("button.btn.sm.c-chalk", { onclick: () => yazdir(formOlcek(o, false), "yatay") }, T.icon("plan"), "Boş form"),
          h("button.btn.sm.c-chalk", { onclick: () => yazdir(formOlcek(o, true), "yatay") }, T.icon("plan"), "Sonuçları yazdır"),
          h("button.btn.sm.c-chalk", { onclick: () => yazdir(geriFisleri(o), "dikey") }, T.icon("plan"), "Geri bildirim fişleri"),
          h("button.btn.sm.c-chalk", { onclick: () => yazdir(h("div", ozForm(o, false), ozForm(o, false)), "dikey") }, T.icon("plan"), "Öz değerlendirme formu"),
          h("button.btn.sm.c-chalk", { onclick: () => yazdir(h("div", ozForm(o, true), ozForm(o, true)), "dikey") }, T.icon("plan"), "Akran değerlendirme formu")));
    };
    ciz();
  }

  /* ---------- Hızlı yoklama ---------- */
  function yoklamaSayfasi(view) {
    const wrap = h("div.view-inner.genis"); view.append(wrap);
    let y = oku().yoklama || { soru: "", tur: "harf", say: {}, dogru: null, goster: false };
    const kaydet = () => yaz((c) => (c.yoklama = y));
    const SEC = { harf: ["A", "B", "C", "D"], basparmak: ["👍 Anladım", "✋ Biraz", "👎 Anlamadım"], dogruyanlis: ["Doğru", "Yanlış"] };
    const ciz = () => {
      const s = SEC[y.tur], top = s.reduce((a, k) => a + (y.say[k] || 0), 0), mx = Math.max(1, ...s.map((k) => y.say[k] || 0));
      const dogruOran = y.dogru && top ? Math.round(((y.say[y.dogru] || 0) / top) * 100) : null;
      wrap.replaceChildren(
        h("div.stage-bar", h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go("olcme") }, T.icon("back")), h("h2", "Hızlı yoklama"), h("span.hint", "Çocuklar parmak ya da kartla cevap verir, sen sayarsın"), h("div.grow"),
          h("button.btn.sm.c-chalk", { onclick: () => { y.say = {}; y.goster = false; kaydet(); ciz(); } }, T.icon("reset"), "Sayımı sıfırla")),
        h("input.in.oa-y-soru", { value: y.soru, placeholder: "Soruyu yaz (ör. 3 × 4 kaçtır?) ya da sözlü sor", onchange: (e) => { y.soru = e.target.value; kaydet(); } }),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap", margin: "10px 0" } },
          h("div.seg", [["harf", "A B C D"], ["basparmak", "Başparmak"], ["dogruyanlis", "Doğru / Yanlış"]].map(([k, l]) => h("button", { "aria-pressed": String(y.tur === k), onclick: () => { y.tur = k; y.say = {}; y.dogru = null; y.goster = false; kaydet(); ciz(); } }, l))),
          y.tur !== "basparmak" ? h("div.row", { style: { gap: "6px" } }, h("span.hint", "Doğru cevap:"), s.map((k) => h("button.btn.sm" + (y.dogru === k ? ".c-leaf" : ".c-chalk"), { onclick: () => { y.dogru = y.dogru === k ? null : k; kaydet(); ciz(); } }, k))) : null,
          h("div.spacer"), h("button.btn.c-sky", { onclick: () => { y.goster = !y.goster; kaydet(); ciz(); } }, T.icon("eye"), y.goster ? "Sonucu gizle" : "Sonucu göster")),
        h("div.oa-y-izgara", s.map((k) => h("div.oa-y-sec" + (y.goster && y.dogru === k ? ".dogru" : ""),
          h("div.oa-y-ad", k), h("div.oa-y-sayac", h("button", { "aria-label": k + " azalt", onclick: () => { y.say[k] = Math.max(0, (y.say[k] || 0) - 1); kaydet(); ciz(); } }, "−"), h("b", String(y.say[k] || 0)), h("button", { "aria-label": k + " artır", onclick: () => { y.say[k] = (y.say[k] || 0) + 1; T.sound.pop(); kaydet(); ciz(); } }, "+")),
          y.goster ? h("div.oa-y-bar", h("i", { style: { height: ((y.say[k] || 0) / mx) * 100 + "%" } })) : null))),
        y.goster && top ? h("div.oa-y-karar", dogruOran != null ? [h("b", "%" + dogruOran + " doğru. "), dogruOran >= 80 ? "Sınıfın çoğu anladı, devam edebilirsin." : dogruOran >= 50 ? "Yarı yarıya. Yanlış seçeneği seçenlerle kısa bir tekrar iyi olur." : "Çoğu henüz anlamadı. Konuyu farklı bir yolla yeniden anlatmayı dene."]
          : y.tur === "basparmak" ? [h("b", (y.say[s[0]] || 0) + " / " + top + " anladığını söyledi. "), (y.say[s[2]] || 0) > top / 4 ? "Anlamadım diyenlerle küçük grup çalışması yapabilirsin." : "Devam edebilirsin."] : "Doğru cevabı işaretlersen yüzde hesaplanır.") : null);
    };
    ciz();
  }

  /* ---------- Gelişim takibi ---------- */
  function gelisimSayfasi(view) {
    const wrap = h("div.view-inner.genis"); view.append(wrap);
    const ogr = T.store.activeClass().students, ol = oku().olcekler.slice().sort((a, b) => (a.tarih < b.tarih ? -1 : 1));
    wrap.append(h("div.stage-bar", h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go("olcme") }, T.icon("back")), h("h2", "Gelişim takibi"), h("span.hint", "Her öğrencinin ölçeklerdeki düzeyi, tarih sırasıyla")),
      ol.length ? h("div.oa-tablo-kap", h("table.oa-tablo.oa-gelisim", h("tr", h("th", "Öğrenci"), ol.map((o) => h("th", o.ad, h("small", tarihYaz(o.tarih))))),
        ogr.map((st) => h("tr", h("td.oa-ad", T.avatar(st.name, 26), st.name), ol.map((o) => { const d = duzey(o, (o.puan || {})[st.id]); return h("td", d ? h("i.oa-nokta", { title: DUZEY[d.d][1], style: { background: DUZEY[d.d][2] } }, DUZEY[d.d][1][0]) : h("span.hint", "·")); })))))
        : h("p.hint", "Henüz ölçek yok. Bir dereceleme ölçeği ya da kontrol listesi oluşturup puanladıkça burada görünür."),
      h("p.hint", { style: { marginTop: "10px" } }, "G: Geliştirilmeli, O: Orta, İ: İyi. Veli görüşmesinden önce bakmak için."));
  }

  /* ---------- Liste: Ölçme bölümündeki "Değerlendirme araçları" sekmesi ---------- */
  T.olcmeAraclari = function (wrap) {
    const ol = oku().olcekler;
    const yeniOlcek = (tur) => {
      const ad = h("input.in", { placeholder: "Ölçeğin adı, ör. Hayvanlar posteri" }), ders = h("input.in", { placeholder: "Ders ya da konu (isteğe bağlı)" });
      let sec = SABLON[0];
      const sablonlar = h("div.oa-sablon", SABLON.map((s) => h("button" + (s === sec ? ".on" : ""), { onclick: (e) => { sec = s; e.target.parentNode.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === e.target)); } }, s[0])), h("button", { onclick: (e) => { sec = ["Boş", ["Ölçüt 1", "Ölçüt 2", "Ölçüt 3"]]; e.target.parentNode.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === e.target)); } }, "Boş başla"));
      T.modal({ title: tur === "liste" ? "Yeni kontrol listesi" : "Yeni dereceleme ölçeği", body: h("div", { style: { display: "grid", gap: "8px" } }, ad, ders, h("b", "Hazır ölçütler"), sablonlar, h("p.hint", { style: { margin: 0 } }, "Ölçütleri sonra kendi sözcüklerinle değiştirebilirsin.")),
        actions: [{ label: "Oluştur", tone: "c-leaf", onClick: () => { const id = "o" + Date.now().toString(36); yaz((c) => c.olcekler.unshift({ id, tur, ad: ad.value.trim() || sec[0], ders: ders.value.trim(), kriter: sec[1].slice(), puan: {}, tarih: T.isoDate() })); setTimeout(() => T.go("olcme-a-" + id), 30); } }] });
    };
    const kart = (ic, ad, ac, onclick) => h("button.oa-kart", { onclick }, T.icon3d(ic), h("b", ad), h("small", ac));
    wrap.append(
      h("div.oa-kartlar",
        kart("scale", "Dereceleme ölçeği", "Ölçüt başına 1-3 puan; düzey ve geri bildirim kendiliğinden", () => yeniOlcek("olcek")),
        kart("check", "Kontrol listesi", "Ölçüt var mı yok mu: + / −", () => yeniOlcek("liste")),
        kart("hand", "Hızlı yoklama", "A B C D, başparmak ya da doğru/yanlış; sınıfın ne kadarı anladı?", () => T.go("olcme-a-yoklama")),
        kart("chart", "Gelişim takibi", "Her öğrencinin düzeyleri tarih sırasıyla", () => T.go("olcme-a-gelisim")),
        kart("ticket", "Çıkış bileti", "Dersin sonunda tek soruluk kart (tahtada araç olarak açılır)", () => { T.go("ana"); setTimeout(() => T.yuzen && T.yuzen.add("ticket"), 200); })),
      h("p.hint", "Öz değerlendirme ve akran değerlendirme formları her ölçeğin içinden, aynı ölçütlerle çocuk diline çevrilmiş olarak basılır."),
      h("h2.oa-bas", "Ölçeklerim"),
      ol.length ? h("div.oa-liste", ol.map((o) => { const n = T.store.activeClass().students.filter((st) => duzey(o, (o.puan || {})[st.id])).length; return h("button.oa-satir", { onclick: () => T.go("olcme-a-" + o.id) }, h("b", o.ad), h("span", (o.tur === "liste" ? "Kontrol listesi" : "Dereceleme ölçeği") + (o.ders ? " · " + o.ders : "")), h("span", tarihYaz(o.tarih)), h("span", n + " / " + T.store.activeClass().students.length + " puanlandı")); }))
        : h("p.hint", "Henüz ölçek yok. Yukarıdan bir dereceleme ölçeği ya da kontrol listesi oluştur."),
      h("p.hint", { style: { marginTop: "12px" } }, "Düzeyler MEB'in biçimlendirici değerlendirme kılavuzlarındaki gibi Geliştirilmeli, Orta ve İyi olarak hesaplanır: toplam puan aralığı üçe bölünür."));
  };
  T.olcmeAracSayfa = function (view, id) {
    if (id === "yoklama") return yoklamaSayfasi(view);
    if (id === "gelisim") return gelisimSayfasi(view);
    const o = olcek(id); if (!o) return false;
    olcekSayfasi(view, o); return true;
  };
})();
