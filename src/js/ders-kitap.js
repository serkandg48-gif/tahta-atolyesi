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

  /* Kendi kitaplarım: öğretmenin yüklediği PDF'ler yalnızca bu cihazda (IndexedDB) saklanır, internetsiz de açılır. */
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open("ta-kitaplik", 1); r.onupgradeneeded = () => r.result.createObjectStore("pdf", { keyPath: "id" }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const idbIs = async (mod, fn) => { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction("pdf", mod), st = tx.objectStore("pdf"), r = fn(st); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(tx.error); }); };
  const kendiListe = () => idbIs("readonly", (st) => st.getAll()).then((l) => (l || []).sort((a, b) => b.t - a.t)).catch(() => []);
  const kendiEkle = (k) => idbIs("readwrite", (st) => st.put(k));
  const kendiSil = (id) => idbIs("readwrite", (st) => st.delete(id));
  let acikUrl = null;
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
      let sekme = yerel("ta-kitaplar-sekme") || "meb";
      let sec = yerel("ta-kitaplar-sec:" + cid());
      const cer = h("iframe.dk-cerceve", { title: "Ders kitabı", allow: "fullscreen; clipboard-write; autoplay", allowfullscreen: "true" });
      const katman = T.kalemKatmani(cer);
      const ust = h("div.dk-okuyucu-ust"); const okuyucu = h("div.dk-okuyucu", ust, katman);
      const solKap = h("div.dk-sol");
      const tamEkran = h("button.btn.sm.c-chalk", { onclick: () => { try { (okuyucu.requestFullscreen || okuyucu.webkitRequestFullscreen).call(okuyucu); } catch (e) {} } }, T.icon("full"), "Tam ekran");
      const goster = (u, ad, id) => {
        if (cer.getAttribute("src") !== u) { cer.setAttribute("src", u); katman.temizle(); }
        ust.replaceChildren(h("b", ad), h("div.grow"), tamEkran, h("a.btn.sm.c-chalk", { href: u, target: "_blank", rel: "noopener" }, T.icon("next"), "Yeni sekmede aç"));
        solKap.querySelectorAll(".dk-kitap").forEach((b) => b.classList.toggle("on", b.dataset.id === String(id)));
      };
      const acMeb = (k) => { sec = k[2]; yerel("ta-kitaplar-sec:" + cid(), sec); if (yerelKitap.has(sec)) { pdfAc("kitaplar/" + sec + ".pdf", k[3], sec); return; } mebGoster(); yerel("ta-kitaplar-sec:" + cid(), sec); goster(url(sec, "pdf"), k[3], sec); };
      /* Yüklenen PDF, tarayıcının PDF eklentisine bırakılmaz (akıllı tahtalardaki Android tarayıcıları çerçevede PDF göstermez); sayfalar pdf.js ile çizilir. */
      const pdfAlan = h("div.dk-pdf"), katman2 = T.kalemKatmani(pdfAlan);
      let jeton = 0, yerelKitap = new Set(); const izin = h("p.hint.dk-izin");
      fetch("kitaplar/liste.json").then((r) => (r.ok ? r.json() : [])).then((l) => { yerelKitap = new Set(l); if (l.length) izin.textContent = "MEB ders kitapları Talim ve Terbiye Kurulu Başkanlığının izniyle bu sitede sunulmaktadır. Kitapların tüm hakları MEB'e aittir."; if (sekme === "meb" && l.length) ciz(); }).catch(() => {});
      const acKendi = (k) => { if (acikUrl) URL.revokeObjectURL(acikUrl); acikUrl = URL.createObjectURL(k.blob); yerel("ta-kitaplar-kendi", k.id); pdfAc(acikUrl, k.ad, k.id, () => k.blob.arrayBuffer()); };
      const pdfAc = async (href, adi, id, veri) => {
        if (okuyucu.lastChild !== katman2) { cer.removeAttribute("src"); okuyucu.replaceChildren(ust, katman2); }
        ust.replaceChildren(h("b", adi), h("div.grow"), tamEkran, h("a.btn.sm.c-chalk", { href, target: "_blank", rel: "noopener" }, T.icon("next"), "Yeni sekmede aç"));
        solKap.querySelectorAll(".dk-kitap").forEach((b) => b.classList.toggle("on", b.dataset.id === String(id)));
        const j = ++jeton; pdfAlan.replaceChildren(h("p.hint", { style: { padding: "20px" } }, "Kitap hazırlanıyor...")); katman2.temizle && katman2.temizle(); pdfAlan.scrollTop = 0;
        try {
          const lib = await T.pdfKitaplik(); const doc = await lib.getDocument(veri ? { data: await veri() } : { url: href }).promise; if (j !== jeton) return;
          pdfAlan.replaceChildren();
          const gen = Math.max(400, pdfAlan.clientWidth - 24), d = Math.min(2, window.devicePixelRatio || 1);
          for (let n = 1; n <= doc.numPages; n++) {
            const pg = await doc.getPage(n); if (j !== jeton) return;
            const v0 = pg.getViewport({ scale: 1 }), v = pg.getViewport({ scale: (gen / v0.width) * d });
            const cv = h("canvas.dk-sayfa"); cv.width = v.width; cv.height = v.height; cv.style.width = gen + "px";
            pdfAlan.append(cv); await pg.render({ canvasContext: cv.getContext("2d"), viewport: v }).promise;
          }
        } catch (e) { if (j === jeton) pdfAlan.replaceChildren(h("p.hint", { style: { padding: "20px" } }, "Bu PDF açılamadı. Yeni sekmede açmayı dene.")); }
      };
      const mebGoster = () => { if (okuyucu.lastChild !== katman) { jeton++; okuyucu.replaceChildren(ust, katman); } };
      const sekmeler = () => h("div.seg.dk-sekme", [["meb", "MEB kitapları"], ["kendi", "Kendi kitaplarım"]].map(([k, l]) => h("button", { "aria-pressed": String(sekme === k), onclick: () => { sekme = k; yerel("ta-kitaplar-sekme", k); ciz(); } }, l)));
      function yukle() {
        const dosya = h("input", { type: "file", accept: "application/pdf", hidden: true });
        const ad = h("input.in", { placeholder: "Kitabın adı, ör. Türkçe 4 (1. kitap)" });
        const sinif = h("select.in", [1, 2, 3, 4].map((x) => h("option", { value: x, selected: x === g ? true : null }, x + ". sınıf")));
        const ders = h("select.in", Object.entries(DERS).map(([k, [l]]) => h("option", { value: k }, l)));
        const secildi = h("span.hint", "Henüz dosya seçilmedi");
        dosya.onchange = () => { const f = dosya.files[0]; if (!f) return; secildi.textContent = f.name + " (" + Math.round(f.size / 1048576) + " MB)"; if (!ad.value) ad.value = f.name.replace(/\.pdf$/i, ""); };
        T.modal({ title: "Kendi kitabını yükle", body: h("div", { style: { display: "grid", gap: "10px" } },
          h("p.hint", { style: { margin: 0 } }, "Bir PDF seç. Kitap yalnızca bu cihazda saklanır, internet olmadan da açılır. MEB kitabını bir kez indirip buraya yükleyebilirsin."),
          h("label.btn.c-sky", { style: { justifySelf: "start", cursor: "pointer" } }, T.icon("download"), "PDF seç", dosya), secildi, ad, h("div.row", { style: { gap: "8px" } }, sinif, ders)),
          actions: [{ label: "Vazgeç" }, { label: "Yükle", tone: "c-leaf", onClick: () => {
            const f = dosya.files[0]; if (!f) { T.toast("Önce bir PDF seç"); return false; }
            const k = { id: "k" + Date.now(), ad: ad.value.trim() || f.name, g: +sinif.value, d: ders.value, blob: f, t: Date.now() };
            kendiEkle(k).then(() => { sekme = "kendi"; yerel("ta-kitaplar-sekme", "kendi"); ciz(k.id); T.toast("Kitap eklendi"); }).catch(() => T.toast("Kitap kaydedilemedi. Cihazda yer kalmamış olabilir."));
          } }] });
      }
      async function ciz(acId) {
        if (sekme === "kendi") {
          const L = await kendiListe();
          solKap.replaceChildren(sekmeler(),
            h("button.btn.c-leaf", { onclick: yukle }, T.icon("plus"), "Kitap yükle (PDF)"),
            L.length ? h("div.dk-grup", L.map((k) => h("div.dk-satir", h("button.dk-kitap", { "data-id": k.id, onclick: () => acKendi(k) }, k.ad, h("small", " · " + k.g + ". sınıf")), h("button.dk-sil", { "aria-label": k.ad + " kitabını sil", onclick: async () => { if (await T.confirm("“" + k.ad + "” silinsin mi?", "Kitap bu cihazdan silinir.", "Sil")) { await kendiSil(k.id); ciz(); } } }, "×"))))
              : h("p.hint", "Henüz yüklediğin kitap yok. Kendi hazırladığın ya da indirdiğin PDF'leri buraya ekleyebilirsin."));
          const k = L.find((x) => x.id === (acId || yerel("ta-kitaplar-kendi"))) || L[0];
          if (k) acKendi(k); else { cer.removeAttribute("src"); katman.temizle(); ust.replaceChildren(h("b", "Bir PDF yükle")); }
          return;
        }
        const L = tumu().filter((k) => k[0] === g || (k[0] === 0 && g <= 2));
        const gruplar = {}; L.forEach((k) => (gruplar[k[1]] = gruplar[k[1]] || []).push(k));
        solKap.replaceChildren(sekmeler(),
          h("div.seg.dk-sinif", [1, 2, 3, 4].map((x) => h("button", { "aria-pressed": String(x === g), onclick: () => { g = x; yerel("ta-kitaplar-sinif:" + cid(), x); ciz(); } }, x + ". sınıf"))),
          Object.keys(gruplar).length ? Object.entries(gruplar).sort((a, b) => Object.keys(DERS).indexOf(a[0]) - Object.keys(DERS).indexOf(b[0])).map(([d, ks]) => h("div.dk-grup", h("div.dk-grup-bas", T.icon3d((DERS[d] || DERS.diger)[1]), (DERS[d] || DERS.diger)[0]),
            ks.map((k) => h("div.dk-satir", h("button.dk-kitap" + (k[2] === sec ? ".on" : ""), { "data-id": k[2], onclick: () => acMeb(k) }, k[3]), k[4] ? h("button.dk-sil", { "aria-label": k[3] + " kitabını listeden çıkar", onclick: async () => { if (await T.confirm("“" + k[3] + "” listeden çıkarılsın mı?")) { yerel("ta-kitap-ozel", ozeller().filter((x) => x.id !== k[2])); ciz(); } } }, "×") : null))))
            : h("p.hint", g + ". sınıf kitapları henüz listede yok."),
          h("div.dk-alt", h("button.btn.sm.c-chalk", { onclick: () => ekle(g, () => ciz()) }, T.icon("plus"), "MEB bağlantısı ekle"), h("a.btn.sm.c-chalk", { href: MK + "ders-kitaplari/temel-egitim", target: "_blank", rel: "noopener" }, "Tüm MEB kitapları")));
        const k = L.find((x) => x[2] === sec) || L[0];
        if (k) acMeb(k); else { cer.removeAttribute("src"); ust.replaceChildren(h("b", "Soldan bir kitap seç")); }
      }
      wrap.append(h("div.page-head", h("h1", "Kitaplar"), h("div.sub", "MEB kitapları ya da kendi yüklediğin PDF'ler tahtada açılır, üstüne kalemle yazabilirsin.")),
        h("div.dk-duzen", solKap, okuyucu),
        izin, h("p.hint", { style: { marginTop: "8px" } }, "MEB kitabı açılmazsa okulun ağı MEB sayfasını engelliyor olabilir. O kitabı MEB'den bir kez indirip Kendi kitaplarım'a yüklersen bağlantı olmadan açılır."));
      T.onLeave(() => { if (acikUrl) { URL.revokeObjectURL(acikUrl); acikUrl = null; } });
      ciz();
    },
  };
  T.YARDIM = T.YARDIM || {};
  T.YARDIM.kitaplar = ["Ders kitapları", "MEB'in Maarif Modeli ders kitapları sınıfına ve dersine göre listelenir, tahtada sayfanın içinde açılır.", ["Sınıfı seç, soldan kitaba dokun.", "Etkileşimli seçeneği MEB'in etkileşimli kitabını açar.", "Kitabın üstündeki kalem, fosforlu kalem ve silgiyle sayfanın üstüne yazabilirsin. Sayfayı çevirmek için el simgesine dokun; sayfa değişince çöp kutusuyla temizle.", "Tam ekran ile kitabı tahtanın tamamına yay.", "Listede olmayan bir kitabı, MEB bağlantısını yapıştırarak Kitap ekle ile kendin ekleyebilirsin."]];
})();
