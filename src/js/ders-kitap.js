/* Ders kitapları: MEB'in Maarif kitapları sınıfa ve derse göre; tahtada sayfa içinde açılır. Kitap dosyası kopyalanmaz, MEB'in sitesinden açılır. */
(function () {
  const { h } = T;
  const MK = "https://tymm.meb.gov.tr/";
  const DERS = { turkce: ["Türkçe", "turkce"], matematik: ["Matematik", "math"], hayat: ["Hayat Bilgisi", "sosyal"], fen: ["Fen Bilimleri", "fen"], sosyal: ["Sosyal Bilgiler", "map"], ingilizce: ["İngilizce", "ingilizce"], diger: ["Diğer", "book"] };
  const cid = () => T.store.activeClass().id;
  const yerel = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  const ozeller = () => yerel("ta-kitap-ozel") || [];
  const tumu = () => T.MEB_KITAP.concat(ozeller().map((k) => [k.g, k.d, k.id, k.ad, true]));
  const url = (id, mod) => (mod === "etk" ? MK + "etkilesimli-kitap/_shared/index.html?kitap=" + id : MK + "kitap/" + id + "/x");

  function ekle(gv, sonra) {
    const link = h("input.in", { placeholder: "MEB kitap bağlantısı (tymm.meb.gov.tr/kitap/...)" });
    const ad = h("input.in", { placeholder: "Kitabın adı, ör. Türkçe 4 (1. kitap)" });
    const sinif = h("select.in", [1, 2, 3, 4].map((g) => h("option", { value: g, selected: g === gv ? true : null }, g + ". sınıf")));
    const ders = h("select.in", Object.entries(DERS).map(([k, [l]]) => h("option", { value: k }, l)));
    const hata = h("p.hint");
    T.modal({ title: "Kitap ekle", body: h("div", { style: { display: "grid", gap: "8px" } },
      h("p.hint", { style: { margin: 0 } }, "tymm.meb.gov.tr/ders-kitaplari sayfasında kitabı açıp adres çubuğundaki bağlantıyı buraya yapıştır."), link, ad, h("div.row", { style: { gap: "8px" } }, sinif, ders), hata),
      actions: [{ label: "Ekle", tone: "c-leaf", onClick: () => {
        const m = (link.value.match(/kitap(?:\/|=)(\d+)/) || [])[1];
        if (!m) { hata.textContent = "Bağlantıda kitap numarası bulunamadı. Adres /kitap/ ile devam etmeli."; return false; }
        const l = ozeller(); l.push({ id: +m, ad: ad.value.trim() || "Kitap " + m, g: +sinif.value, d: ders.value }); yerel("ta-kitap-ozel", l); sonra && sonra();
      } }] });
  }

  T.sections.kitaplar = {
    title: "Ders kitapları", icon: "book", tone: "sky", desc: "MEB kitapları sınıfına göre, tahtada sayfa içinde",
    render(view) {
      const wrap = h("div.view-inner.genis"); view.append(wrap);
      let g = +yerel("ta-kitaplar-sinif:" + cid()) || T.store.grade(); if (g < 1 || g > 4) g = 1;
      let sec = yerel("ta-kitaplar-sec:" + cid()), mod = yerel("ta-kitaplar-mod") || "pdf";
      const cer = h("iframe.dk-cerceve", { title: "Ders kitabı", referrerpolicy: "no-referrer", allowfullscreen: "true" });
      const ust = h("div.dk-okuyucu-ust"); const okuyucu = h("div.dk-okuyucu", ust, cer);
      const solKap = h("div.dk-sol");
      const ac = (k) => {
        sec = k[2]; yerel("ta-kitaplar-sec:" + cid(), sec);
        const u = url(sec, mod); if (cer.getAttribute("src") !== u) cer.setAttribute("src", u);
        ust.replaceChildren(h("b", k[3]), h("div.grow"),
          h("div.seg", [["pdf", "Kitap"], ["etk", "Etkileşimli"]].map(([m, l]) => h("button", { "aria-pressed": String(mod === m), onclick: () => { mod = m; yerel("ta-kitaplar-mod", m); ac(k); } }, l))),
          h("button.btn.sm.c-chalk", { onclick: () => { try { (okuyucu.requestFullscreen || okuyucu.webkitRequestFullscreen).call(okuyucu); } catch (e) {} } }, T.icon("full"), "Tam ekran"),
          h("a.btn.sm.c-chalk", { href: url(sec, mod), target: "_blank", rel: "noopener" }, T.icon("next"), "Yeni sekmede aç"));
        solKap.querySelectorAll(".dk-kitap").forEach((b) => b.classList.toggle("on", +b.dataset.id === sec));
      };
      const ciz = () => {
        const L = tumu().filter((k) => k[0] === g || (k[0] === 0 && g <= 2));
        const gruplar = {}; L.forEach((k) => (gruplar[k[1]] = gruplar[k[1]] || []).push(k));
        solKap.replaceChildren(
          h("div.seg.dk-sinif", [1, 2, 3, 4].map((x) => h("button", { "aria-pressed": String(x === g), onclick: () => { g = x; yerel("ta-kitaplar-sinif:" + cid(), x); ciz(); } }, x + ". sınıf"))),
          Object.keys(gruplar).length ? Object.entries(gruplar).sort((a, b) => Object.keys(DERS).indexOf(a[0]) - Object.keys(DERS).indexOf(b[0])).map(([d, ks]) => h("div.dk-grup", h("div.dk-grup-bas", T.icon3d((DERS[d] || DERS.diger)[1]), (DERS[d] || DERS.diger)[0]),
            ks.map((k) => h("div.dk-satir", h("button.dk-kitap" + (k[2] === sec ? ".on" : ""), { "data-id": k[2], onclick: () => ac(k) }, k[3]), k[4] ? h("button.dk-sil", { "aria-label": k[3] + " kitabını listeden çıkar", onclick: async () => { if (await T.confirm("“" + k[3] + "” listeden çıkarılsın mı?")) { yerel("ta-kitap-ozel", ozeller().filter((x) => x.id !== k[2])); T.route(); } } }, "×") : null))))
            : h("p.hint", g + ". sınıf kitapları henüz listede yok. MEB'den kitabı açıp bağlantısını ekleyebilirsin."),
          h("div.dk-alt", h("button.btn.sm.c-leaf", { onclick: () => ekle(g, () => T.route()) }, T.icon("plus"), "Kitap ekle"), h("a.btn.sm.c-chalk", { href: MK + "ders-kitaplari/temel-egitim", target: "_blank", rel: "noopener" }, "Tüm MEB kitapları")));
        const k = L.find((x) => x[2] === sec) || L[0];
        if (k) ac(k); else { cer.removeAttribute("src"); ust.replaceChildren(h("b", "Soldan bir kitap seç")); }
      };
      wrap.append(h("div.page-head", h("h1", "Ders kitapları"), h("div.sub", "Maarif Modeli ders kitapları MEB'in kendi sitesinden, tahtada sayfa içinde açılır.")),
        h("div.dk-duzen", solKap, okuyucu),
        h("p.hint", { style: { marginTop: "8px" } }, "Kitap açılmazsa okulun ağı MEB sayfasını çerçevede engelliyor olabilir; Yeni sekmede aç her zaman çalışır."));
      ciz();
    },
  };
  T.YARDIM = T.YARDIM || {};
  T.YARDIM.kitaplar = ["Ders kitapları", "MEB'in Maarif Modeli ders kitapları sınıfına ve dersine göre listelenir, tahtada sayfanın içinde açılır.", ["Sınıfı seç, soldan kitaba dokun.", "Etkileşimli seçeneği MEB'in etkileşimli kitabını açar.", "Tam ekran ile kitabı tahtanın tamamına yay.", "Listede olmayan bir kitabı, MEB bağlantısını yapıştırarak Kitap ekle ile kendin ekleyebilirsin."]];
})();
