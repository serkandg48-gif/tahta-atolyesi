/* Ölçme ve değerlendirme: Düşünme rutinleri.
   Her rutin A4 (dikey ya da yatay) bir şablon olarak çizilir; tahtada yansıtılır, üzerine yazılır, A4 yazdırılır.
   Çocuk yönergesi adımlardan, öğretmen yönergesi amaç ve kullanım notundan oluşur. Yazılanlar sınıfa göre bu cihazda kalır. */
(function () {
  const { h } = T;
  const KAT_SIRA = ["Temel Düşünme Rutinleri", "Fikirleri Tanıtma ve Keşfetme", "Fikirlerin Daha Derinlemesine İncelenmesi", "Nesnelerin ve Sistemlerin Araştırılması", "Perspektif Alma",
    "Tartışmaları, İkilemleri ve Perspektifleri Göz Önünde Bulundurma", "Olasılıklar ve Benzetmeler Üretmek", "Fikirleri Sentezleme ve Düzenleme", "Sanat, Resim ve Nesneleri Keşfetmek", "Uluslararası Düşünme"];
  const KAT_KISA = { "Temel Düşünme Rutinleri": "Temel", "Fikirleri Tanıtma ve Keşfetme": "Tanıtma ve keşfetme", "Fikirlerin Daha Derinlemesine İncelenmesi": "Derinlemesine inceleme", "Nesnelerin ve Sistemlerin Araştırılması": "Nesneler ve sistemler",
    "Perspektif Alma": "Bakış açısı alma", "Tartışmaları, İkilemleri ve Perspektifleri Göz Önünde Bulundurma": "Tartışma ve ikilemler", "Olasılıklar ve Benzetmeler Üretmek": "Olasılık ve benzetme",
    "Fikirleri Sentezleme ve Düzenleme": "Sentezleme ve düzenleme", "Sanat, Resim ve Nesneleri Keşfetmek": "Sanat ve nesneler", "Uluslararası Düşünme": "Küresel düşünme" };
  const RENK = ["#2E6FB0", "#D98A1F", "#2E8B57", "#B8456A", "#6B55B5", "#1F8A8A", "#C2453A", "#7A6A2E"];
  const ONERILEN = ["gor-dusun-merak-et", "dusun-esles-paylas", "eskiden-dusunurdum-simdi-dusunuyorum", "3-2-1-kopru", "dusun-sorgula-kesfet", "baglan-genislet-meydan-oku", "iddia-destek-soru", "pusula", "renk-sembol-gorsel", "basliklar", "gor-hisset-dusun-merak-et", "bakmak-on-kere-iki"];
  /* Maarif Modeli bağlantıları: rutin kategorisine göre destekleyebileceği kavramsal beceriler ve eğilimler */
  const MAARIF = {
    "Temel Düşünme Rutinleri": ["Gözlemleme (KB2.2)", "Sorgulama (KB2.8)", "Merak (E1.1)"],
    "Fikirleri Tanıtma ve Keşfetme": ["Gözlemleme (KB2.2)", "Merak (E1.1)", "Soru Sorma (E3.8)"],
    "Fikirlerin Daha Derinlemesine İncelenmesi": ["Yorumlama (KB2.14)", "Muhakeme (KB2.16)", "Gerçeği Arama (E3.4)"],
    "Nesnelerin ve Sistemlerin Araştırılması": ["Çözümleme (KB2.4)", "Analitiklik (E3.6)", "Sistematiklik (E3.7)"],
    "Perspektif Alma": ["Empati (E2.1)", "Açık Fikirlilik (E3.5)", "Yorumlama (KB2.14)"],
    "Tartışmaları, İkilemleri ve Perspektifleri Göz Önünde Bulundurma": ["Tartışma (KB2.18)", "Karar Verme (KB3.1)", "Eleştirel Bakma (E3.10)"],
    "Olasılıklar ve Benzetmeler Üretmek": ["Yaratıcılık (E3.3)", "Karşılaştırma (KB2.7)", "Problem Çözme (KB3.2)"],
    "Fikirleri Sentezleme ve Düzenleme": ["Özetleme (KB2.3)", "Sentezleme (KB2.20)", "Yansıtma (KB2.15)"],
    "Sanat, Resim ve Nesneleri Keşfetmek": ["Gözlemleme (KB2.2)", "Yorumlama (KB2.14)", "Yaratıcılık (E3.3)"],
    "Uluslararası Düşünme": ["Empati (E2.1)", "Sorumluluk (E2.2)", "Açık Fikirlilik (E3.5)"],
  };
  const OZEL_MAARIF = { "eskiden-dusunurdum-simdi-dusunuyorum": ["Yansıtma (KB2.15)"], "3-2-1-kopru": ["Yansıtma (KB2.15)"], "dusun-esles-paylas": ["Muhakeme (KB2.16)"], "iddia-destek-soru": ["Muhakeme (KB2.16)", "Şüphe Duyma (E3.9)"], "ogrenme-icin-alan-yaratma": ["Odaklanma (E3.2)"], "duygular-ve-secenekler": ["Empati (E2.1)"] };
  T.rutinMaarif = (r) => [...new Set((OZEL_MAARIF[r.id] || []).concat(...r.kat.map((k) => MAARIF[k] || [])))].slice(0, 4);
  const cid = () => T.store.activeClass().id;
  const rutin = (id) => T.RUTINLER.find((r) => r.id === id);

  /* ---------- Kayıt: sınıfa göre yazılanlar ve öğretmenin yönerge düzenlemeleri ---------- */
  const kayit = (rid) => (((T.store.get().rutin || {})[cid()] || {})[rid]) || {};
  const yaz = (rid, fn) => T.store.update((s) => { s.rutin = s.rutin || {}; const c = (s.rutin[cid()] = s.rutin[cid()] || {}); c[rid] = c[rid] || {}; fn(c[rid]); });
  const adimlar = (r) => { const o = kayit(r.id).ozel || {}; return r.adim.map(([b, q], i) => [(o[i] || [])[0] || b, (o[i] || [])[1] || q]); };

  /* ---------- Şablon parçaları ---------- */
  function sablon(r, ctx) {
    const A = adimlar(r), K = kayit(r.id), v = K.v || {};
    const alan = (k, ph, cls = "") => {
      const t = h("textarea.rt-yazi" + cls, { "aria-label": ph || "Yaz", placeholder: ctx.bos ? "" : "", spellcheck: "false" });
      t.value = v[k] || "";
      t.addEventListener("input", () => yaz(r.id, (x) => { x.v = x.v || {}; x.v[k] = t.value; }));
      return t;
    };
    const kutu = (i, extra = {}) => {
      const [b, q] = A[i] || ["", ""];
      return h("div.rt-kutu" + (extra.cls || ""), { style: Object.assign({ "--c": RENK[i % RENK.length] }, extra.style || {}) },
        h("div.rt-kb", h("span.rt-no", i + 1), h("b", b)), extra.soruYok ? null : h("small.rt-soru", q), alan("a" + i, b, extra.alanCls || ""));
    };
    const bos = (k, baslik, c = "#5B6B88", extra = {}) => h("div.rt-kutu" + (extra.cls || ""), { style: Object.assign({ "--c": c }, extra.style || {}) }, baslik ? h("div.rt-kb", h("b", baslik)) : null, alan(k, baslik || "Yaz"));
    const n = A.length, tip = r.tip;
    let govde;
    if (tip === "kolon") govde = h("div.rt-kolon", { style: { gridTemplateColumns: "repeat(" + n + ", 1fr)" } }, A.map((_, i) => kutu(i)));
    else if (tip === "satir" || tip === "liste" || tip === "gunluk") govde = h("div.rt-satir", A.map((_, i) => kutu(i, tip === "liste" && i === 0 ? { cls: ".buyuk", alanCls: ".cizgili" } : tip === "gunluk" && i === 0 ? { cls: ".buyuk", alanCls: ".cizgili" } : {})));
    else if (tip === "izgara") {
      const kol = n <= 4 ? 2 : 3;
      govde = h("div.rt-izgara", { style: { gridTemplateColumns: "repeat(" + kol + ", 1fr)" } }, A.map((_, i) => kutu(i, n === 5 && i >= 3 ? { style: { gridColumn: i === 3 ? "1 / 2" : "2 / 4" } } : n === 3 && i === 2 ? { style: { gridColumn: "1 / -1" } } : {})));
    } else if (tip === "tablo") {
      const sut = r.sutun || A.map((x) => x[0]), sat = r.satirlar || ["", "", "", "", ""];
      govde = h("div.rt-tablo", { style: { gridTemplateColumns: (r.satirlar ? "minmax(90px, .7fr) " : r.satir_adi ? "minmax(90px, .7fr) " : "") + "repeat(" + sut.length + ", 1fr)" } },
        r.satirlar || r.satir_adi ? h("div.rt-th", r.satir_adi || "") : null, sut.map((s, i) => h("div.rt-th", { style: { "--c": RENK[i % RENK.length] } }, s)),
        sat.map((sa, j) => [r.satirlar || r.satir_adi ? (r.satirlar ? h("div.rt-th.yan", sa) : h("div.rt-td", alan("s" + j, "Seçenek"))) : null].concat(sut.map((_, i) => h("div.rt-td", alan("t" + j + "_" + i, sut[i]))))).flat());
    } else if (tip === "merkez" || tip === "cember" || tip === "patlama") {
      const cevre = tip === "patlama" ? A.slice(0, 2) : A;
      const yer = ["1 / 2 / 2 / 3", "2 / 3 / 3 / 4", "3 / 2 / 4 / 3", "2 / 1 / 3 / 2", "1 / 1 / 2 / 2", "1 / 3 / 2 / 4", "3 / 1 / 4 / 2", "3 / 3 / 4 / 4"];
      const kutular = tip === "patlama" ? [0, 1, 2, 3, 4, 5, 6, 7].map((j) => bos("p" + j, j < 3 ? "Açık seçenek" : "Gizli seçenek", j < 3 ? RENK[0] : RENK[1], { style: { gridArea: yer[j] }, cls: ".kucuk" })) : cevre.map((_, i) => kutu(i, { style: { gridArea: yer[i] } }));
      govde = h("div", { style: { display: "grid", gap: "1.2cqw", height: "100%", gridTemplateRows: tip === "patlama" ? "1fr auto" : "1fr" } },
        h("div.rt-merkez" + (tip === "cember" ? ".yuvarlak" : ""), kutular, h("div.rt-cekirdek", { style: { gridArea: "2 / 2 / 3 / 3" } }, h("small", "Konu"), alan("konu", "Konu", ".orta"))),
        tip === "patlama" ? kutu(2, { cls: ".ince" }) : null);
    } else if (tip === "pusula") {
      govde = h("div.rt-pusula", kutu(2, { style: { gridArea: "1 / 2" } }), kutu(1, { style: { gridArea: "2 / 1" } }), h("div.rt-gul", { style: { gridArea: "2 / 2" } }, h("span.k", "K"), h("span.d", "D"), h("span.g", "G"), h("span.b", "B"), alan("konu", "Fikir ya da öneri", ".orta")), kutu(0, { style: { gridArea: "2 / 3" } }), kutu(3, { style: { gridArea: "3 / 2" } }));
    } else if (tip === "halka" || tip === "meyve" || tip === "hedef" || tip === "paket") {
      let ic = null; const sira = tip === "halka" || tip === "meyve" ? A.map((_, i) => i).filter((i) => !(tip === "halka" && i === n - 1 && /Neden|Ne öğren/.test(A[i][0]))) : A.map((_, i) => i);
      const son = tip === "halka" && sira.length < n ? n - 1 : null;
      const katman = tip === "hedef" ? sira.slice().reverse() : tip === "paket" ? sira.slice(1) : sira.slice().reverse();
      katman.forEach((i, j) => { ic = h("div.rt-halka" + (j === 0 ? ".ic" : ""), { style: { "--c": RENK[i % RENK.length] } }, h("div.rt-kb", h("span.rt-no", i + 1), h("b", A[i][0])), h("small.rt-soru", A[i][1]), alan("a" + i, A[i][0]), ic); });
      if (tip === "paket") ic = h("div.rt-halka", { style: { "--c": RENK[0] } }, h("div.rt-kb", h("span.rt-no", 1), h("b", A[0][0])), alan("a0", A[0][0]), ic);
      govde = h("div.rt-halkalar", ic, son != null ? kutu(son, { cls: ".ince" }) : null);
    } else if (tip === "oncesonra") {
      const bas = r.bas || [A[0][0], A[1][0]];
      govde = h("div.rt-satir", h("div.rt-iki", kutu(0), h("div.rt-ok", "→"), kutu(1)), A.slice(2).map((_, j) => kutu(j + 2, { cls: ".ince" })));
      void bas;
    } else if (tip === "kopru") {
      govde = h("div.rt-kopru", h("div.rt-kolon", { style: { gridTemplateColumns: "1fr 1fr" } },
        h("div.rt-yan", h("h4", "Öğrenmeden önce"), [0, 1, 2].map((i) => kutu(i))), h("div.rt-yan", h("h4", "Öğrendikten sonra"), [3, 4, 5].map((i) => kutu(i)))),
        h("div.rt-kopru-cizgi"), kutu(6, { cls: ".ince" }));
    } else if (tip === "baglanti") {
      govde = h("div.rt-satir", h("div.rt-iki", kutu(0, { alanCls: ".cizgili" }), h("div.rt-ok", "⇄"), kutu(1, { alanCls: ".cizgili" })), h("div.rt-kolon", { style: { gridTemplateColumns: "1fr 1fr" } }, kutu(2), kutu(3)));
    } else if (tip === "elmas") {
      govde = h("div.rt-elmas", kutu(3, { style: { gridArea: "1 / 2" } }), kutu(0, { style: { gridArea: "2 / 1" } }), h("div.rt-tas", { style: { gridArea: "2 / 2" } }, h("div"), alan("konu", "Karar", ".orta")), kutu(1, { style: { gridArea: "2 / 3" } }), kutu(2, { style: { gridArea: "3 / 2" } }), kutu(4, { style: { gridArea: "4 / 1 / 5 / 4" }, cls: ".ince" }));
    } else if (tip === "isik") {
      govde = h("div.rt-isik", h("div.rt-lamba", h("i", { style: { background: "#D9473B" } }), h("i", { style: { background: "#F0B429" } }), h("i", { style: { background: "#3FA35B" } })), h("div.rt-satir", A.map((_, i) => kutu(i))));
    } else if (tip === "daire") {
      govde = h("div.rt-daire-sar", h("div.rt-kenar", kutu(2)), h("div.rt-daire", h("div.rt-kb", h("b", "Aklımda ve kalbimde")), alan("d", "Aklımda ve kalbimde", ".orta"), h("div.rt-cekirdek.kucuk", h("small", "Merkezde tutuyorum"), alan("m", "Merkezde tut", ".orta"))), h("div.rt-kenar", kutu(0, { cls: ".ince" }), kutu(1, { cls: ".ince" }), kutu(3, { cls: ".ince" })));
    } else if (tip === "gazete") {
      govde = h("div.rt-gazete", h("div.rt-gz-ust", h("b", "SINIFIMIZIN GAZETESİ"), h("span", T.fmtDate ? T.fmtDate(new Date()) : new Date().toLocaleDateString("tr-TR"))), kutu(0, { cls: ".manset", alanCls: ".manset-yazi" }), h("div.rt-kolon", { style: { gridTemplateColumns: "1.4fr 1fr" } }, bos("haber", "Haberin ayrıntısı", "#333"), kutu(1)));
    } else if (tip === "hikaye") {
      govde = h("div.rt-kolon.rt-cizgi-roman", { style: { gridTemplateColumns: "repeat(3, 1fr)" } }, A.map((_, i) => kutu(i, { cls: ".pano" })));
    } else if (tip === "zincir") {
      govde = h("div.rt-satir", h("div.rt-zincir", A.slice(0, n - 1).map((_, i) => [i ? h("div.rt-ok", "→") : null, kutu(i)]).flat()), kutu(n - 1, { cls: ".ince" }));
    } else if (tip === "onx2") {
      const liste = (k, bas) => h("div.rt-kutu", { style: { "--c": RENK[k === "x" ? 0 : 2] } }, h("div.rt-kb", h("b", bas)), h("ol.rt-on", Array.from({ length: 10 }, (_, j) => h("li", alan(k + j, bas + " " + (j + 1), ".tek")))));
      govde = h("div.rt-satir", h("small.rt-soru", A[0][1]), h("div.rt-kolon", { style: { gridTemplateColumns: "1fr 1fr" } }, liste("x", "1. " + (r.duyu === "dinle" ? "dinleyiş" : "bakış")), liste("y", "2. " + (r.duyu === "dinle" ? "dinleyiş" : "bakış"))));
    } else if (tip === "eksen") {
      const e = r.eksen || ["", "", ""]; const iki = e.length > 3;
      govde = h("div.rt-satir", h("div.rt-eksen" + (iki ? ".iki" : ""), iki ? h("span.ey-ust", e[4]) : null, iki ? h("span.ey-alt", e[3]) : null, alan("eksen", "Kartları yerleştir", ".serbest"), h("div.rt-cizgi-ok"), h("div.rt-eksen-et", e.slice(0, 3).map((x) => h("span", x)))), h("div.rt-kolon", { style: { gridTemplateColumns: "repeat(" + (n - 1) + ", 1fr)" } }, A.slice(1).map((_, i) => kutu(i + 1, { cls: ".ince" }))));
    } else if (tip === "zaman") {
      const z = r.id.includes("yansitma") ? ["Geçmiş", "Şimdi", "Gelecek"] : null;
      govde = h("div.rt-satir", h("div.rt-zaman", A.slice(0, Math.min(3, n)).map((_, i) => kutu(i)), h("div.rt-zaman-ok")), A.slice(3).map((_, j) => kutu(j + 3, { cls: ".ince" })));
      void z;
    } else if (tip === "halat") {
      const u = r.uclar || ["", ""];
      govde = h("div.rt-satir", kutu(0, { cls: ".ince" }), kutu(3, { cls: ".ince" }), h("div.rt-halat", h("div.rt-kolon", { style: { gridTemplateColumns: "1fr 1fr" } }, kutu(1), kutu(2)), h("div.rt-ip", h("b", u[0]), h("i"), h("b", u[1]))), kutu(4, { cls: ".ince" }));
    } else govde = h("div.rt-satir", A.map((_, i) => kutu(i)));

    return h("div.rt-sayfa." + (r.yon === "dikey" ? "dikey" : "yatay"), { "data-rutin": r.id },
      h("div.rt-ust", h("div", h("h3", r.ad), h("small", (r.kat || []).map((k) => KAT_KISA[k] || k).join(", "))), h("div.rt-kim", h("span", "Ad:"), alan("ad", "Ad", ".tek"), h("span", "Konu:"), alan("konuust", "Konu", ".tek"))),
      h("div.rt-govde", govde),
      h("div.rt-alt", "Project Zero (Harvard) düşünme rutininden uyarlanmıştır. Tahta Atölyesi"));
  }

  /* ---------- Yönergeler ---------- */
  const cocukYonerge = (r, buyuk) => h("div.rt-yon.cocuk" + (buyuk ? ".buyuk" : ""), h("h4", "Ne yapacağız?"),
    r.secmeli ? h("p.rt-not", "Kutulardan birini seç ve yalnızca onu doldur.") : null,
    h("ol", adimlar(r).map(([b, q], i) => h("li", { style: { "--c": RENK[i % RENK.length] } }, h("b", b), h("span", q)))));
  const ogretmenYonerge = (r) => h("div.rt-yon.ogretmen", h("h4", "Öğretmene"), h("p", h("b", "Amaç: "), r.amac), h("p", h("b", "Ne zaman, nasıl: "), r.ne),
    h("p", h("b", "Maarif Modeli'nde destekleyebileceği: "), T.rutinMaarif(r).join(", ")),
    h("p.hint", "Şablon " + (r.yon === "dikey" ? "A4 dikey" : "A4 yatay") + " basılır. Tahtada kutulara dokunup yazabilirsiniz; yazılanlar bu sınıf için saklanır."));

  /* ---------- Yazdır ---------- */
  function yazdir(r, bos) {
    const kap = h("div#rt-baski");
    const sayfa = sablon(r, { bos });
    if (bos) sayfa.querySelectorAll("textarea").forEach((t) => { t.value = ""; t.removeAttribute("placeholder"); });
    kap.append(sayfa);
    const st = h("style#rt-baski-stil", "@page { size: A4 " + (r.yon === "dikey" ? "portrait" : "landscape") + "; margin: 8mm; }");
    document.head.append(st); document.body.append(kap);
    document.documentElement.classList.add("rt-yazdiriliyor");
    const bitir = () => { document.documentElement.classList.remove("rt-yazdiriliyor"); kap.remove(); st.remove(); window.removeEventListener("afterprint", bitir); };
    window.addEventListener("afterprint", bitir);
    setTimeout(() => { try { window.print(); } catch (e) {} setTimeout(bitir, 1500); }, 60);
  }

  /* ---------- Yansıt: tam ekran şablon ve çocuk yönergesi ---------- */
  function yansit(r) {
    const kapat = () => { try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {} el.remove(); document.removeEventListener("keydown", tus); T.route(); };
    const tus = (e) => { if (e.key === "Escape") kapat(); };
    let yonAcik = true;
    const yonKutu = h("aside.rt-yansit-yon", cocukYonerge(r, true));
    const el = h("div.rt-yansit", h("div.rt-yansit-ust", h("b", r.ad), h("div.grow"),
      h("button.btn.c-chalk", { onclick: () => { yonAcik = !yonAcik; yonKutu.hidden = !yonAcik; } }, T.icon("text"), "Yönerge"),
      h("button.btn.c-chalk", { onclick: async () => { if (await T.confirm("Bu şablondaki yazılar silinsin mi?")) { yaz(r.id, (x) => (x.v = {})); el.querySelectorAll(".rt-sayfa textarea").forEach((t) => (t.value = "")); } } }, T.icon("reset"), "Temizle"),
      h("button.btn.c-tomato", { onclick: kapat }, T.icon("close"), "Kapat")),
      h("div.rt-yansit-govde", h("div.rt-yansit-sayfa", sablon(r, {})), yonKutu));
    document.body.append(el); document.addEventListener("keydown", tus);
    try { el.requestFullscreen && el.requestFullscreen().catch(() => {}); } catch (e) {}
  }

  /* ---------- Yönergeyi düzenle (öğretmen kendi sözcükleriyle yazar) ---------- */
  function duzenle(r) {
    const A = adimlar(r);
    const alanlar = A.map(([b, q], i) => [h("input.in", { value: b, "aria-label": (i + 1) + ". adım başlığı" }), h("textarea.in", { "aria-label": (i + 1) + ". adım sorusu", style: { minHeight: "64px" } }, q)]);
    T.modal({ title: "Yönergeyi düzenle: " + r.ad, wide: true, body: h("div", { style: { display: "grid", gap: "12px" } },
      h("p.hint", "Başlıkları ve çocuk sorularını sınıfının diline göre değiştir. Değişiklik yalnızca bu sınıfta görünür."),
      alanlar.map(([a, b], i) => h("div.paper", { style: { padding: "10px 12px", display: "grid", gap: "6px", borderLeft: "6px solid " + RENK[i % RENK.length] } }, h("b", (i + 1) + ". adım"), a, b))),
      actions: [{ label: "Özgün yönergeye dön", onClick: () => { yaz(r.id, (x) => delete x.ozel); T.route(); } }, { label: "Kaydet", tone: "c-leaf", onClick: () => { yaz(r.id, (x) => { x.ozel = {}; alanlar.forEach(([a, b], i) => { if (a.value.trim() !== r.adim[i][0] || b.value.trim() !== r.adim[i][1]) x.ozel[i] = [a.value.trim(), b.value.trim()]; }); }); T.route(); } }] });
  }

  /* ---------- Rutin sayfası ---------- */
  function rutinSayfasi(view, r) {
    const wrap = h("div.view-inner.genis"); view.append(wrap);
    const sekme = { v: "cocuk" };
    const yon = h("div.rt-yon-kap");
    const yonCiz = () => yon.replaceChildren(h("div.seg", [["cocuk", "Çocuklar için"], ["ogretmen", "Öğretmene"]].map(([k, l]) => h("button", { "aria-pressed": String(sekme.v === k), onclick: () => { sekme.v = k; yonCiz(); } }, l))), sekme.v === "cocuk" ? cocukYonerge(r) : ogretmenYonerge(r));
    yonCiz();
    wrap.append(h("div.stage-bar", h("button.btn.icon.c-chalk", { "aria-label": "Geri", onclick: () => T.go("olcme") }, T.icon("back")), h("h2", r.ad), h("span.hint", r.yon === "dikey" ? "A4 dikey" : "A4 yatay"), h("div.grow"),
      h("button.btn.c-sky", { onclick: () => yansit(r) }, T.icon("board"), "Yansıt"),
      h("button.btn.c-chalk", { onclick: () => yazdir(r, true) }, T.icon("plan"), "Boş yazdır"),
      h("button.btn.c-chalk", { onclick: () => yazdir(r, false) }, T.icon("plan"), "Yazılarla yazdır"),
      h("button.btn.c-chalk", { onclick: () => duzenle(r) }, T.icon("edit"), "Yönergeyi düzenle")),
      h("div.rt-duzen", h("div.rt-sayfa-kap", sablon(r, {})), yon));
  }

  /* ---------- Bölüm: Ölçme ve değerlendirme ---------- */
  let filtre = "oneri", ara = "";
  T.sections.olcme = {
    title: "Ölçme ve değerlendirme", icon: "check", tone: "grape", desc: "Düşünme rutinleri: yansıt, üzerine yaz, A4 yazdır",
    render(view, sub) {
      if (sub && sub.startsWith("r-")) { const r = rutin(sub.slice(2)); if (r) return rutinSayfasi(view, r); }
      const wrap = h("div.view-inner"); view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Ölçme ve değerlendirme"), h("div.sub", "Düşünmeyi görünür kılan rutinler, öğrencinin nasıl düşündüğünü görmenin en kolay yolu. Bir rutine dokun: tahtada yansıt, birlikte yaz ya da A4 bas.")),
        h("div.seg.ders-sekme", { role: "tablist" }, h("button", { "aria-pressed": "true" }, "Düşünme rutinleri")));
      const aramaKutu = h("input.in", { placeholder: "Rutin ara, örneğin gör, bakış açısı, köprü", value: ara, "aria-label": "Rutin ara", style: { maxWidth: "420px" } });
      const cipler = h("div.rt-cipler");
      const liste = h("div.rt-liste");
      const ciz = () => {
        cipler.replaceChildren(h("button" + (filtre === "oneri" ? ".on" : ""), { onclick: () => { filtre = "oneri"; ciz(); } }, "İlkokul için önerilen 12"), h("button" + (!filtre ? ".on" : ""), { onclick: () => { filtre = null; ciz(); } }, "Tüm rutinler (" + T.RUTINLER.length + ")"),
          KAT_SIRA.filter((k) => T.RUTINLER.some((r) => r.kat.includes(k))).map((k) => h("button" + (filtre === k ? ".on" : ""), { onclick: () => { filtre = k; ciz(); } }, KAT_KISA[k] || k)));
        const q = ara.trim().toLocaleLowerCase("tr");
        const l = (filtre === "oneri" && !q ? ONERILEN.map(rutin).filter(Boolean) : T.RUTINLER.filter((r) => (!filtre || filtre === "oneri" || r.kat.includes(filtre)))).filter((r) => (!q || (r.ad + " " + r.adim.map((a) => a[0]).join(" ")).toLocaleLowerCase("tr").includes(q)));
        liste.replaceChildren(...l.map((r) => h("button.rt-kart", { onclick: () => T.go("olcme-r-" + r.id) },
          h("div.rt-mini." + (r.yon === "dikey" ? "dikey" : "yatay"), r.adim.slice(0, 6).map((_, i) => h("i", { style: { background: RENK[i % RENK.length] } }))),
          h("div", h("b", r.ad), h("small", r.adim.map((a) => a[0]).slice(0, 4).join(" · ")), h("span.rt-yontag", T.rutinMaarif(r).slice(0, 2).map((x) => x.replace(/ \(.*\)/, "")).join(" · ") + " · " + (r.yon === "dikey" ? "A4 dikey" : "A4 yatay"))))));
        if (!l.length) liste.append(h("p.hint", "Bu adla bir rutin bulunamadı."));
      };
      aramaKutu.addEventListener("input", () => { ara = aramaKutu.value; ciz(); });
      wrap.append(h("div.row", { style: { gap: "10px", flexWrap: "wrap", margin: "6px 0 10px" } }, aramaKutu), cipler, liste,
        h("p.hint", { style: { marginTop: "14px" } }, "Rutinler Harvard Project Zero'nun düşünme rutinlerinden, öğretmenin Türkçe kaynaklarına dayanarak uyarlanmıştır."));
      ciz();
    },
  };
  T.rutinYazdir = (id, bos) => yazdir(rutin(id), bos);
  T.YARDIM = T.YARDIM || {};
  T.YARDIM.olcme = ["Ölçme ve değerlendirme", "Düşünme rutinleri: her biri A4 şablon olarak çizili, tahtada yansıtılır, birlikte yazılır, basılır.", ["Rutine dokun, şablon ve çocuk yönergesi açılır.", "Yansıt ile tahtada tam ekran açılır, kutulara dokunup yazabilirsiniz.", "Boş yazdır ile A4 çalışma kâğıdı olarak basabilirsiniz.", "Yönergeyi düzenle ile soruları sınıfının diline göre değiştirebilirsin."]];
})();
