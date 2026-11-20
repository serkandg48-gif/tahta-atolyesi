/* Dersimi dolduracak öğretmene notlar.
   Öğretmen okula gelemeyeceği gün için notlarını, kitap sayfalarını ve dosyalarını hazırlar.
   Ders saatleri, görevliler, oturma planı ve sınıf listesi kendiliğinden eklenir.
   Gelen öğretmen "Notları aç" ile her şeyi tek sayfada görür, isterse yazdırır. Dosyalar bu cihazda saklanır. */
(function () {
  const { h } = T;
  const cid = () => T.store.get().activeClassId;
  /* dosyalar IndexedDB'de: PDF ve resimler localStorage'a sığmaz */
  const vt = () => new Promise((res, rej) => { const r = indexedDB.open("ta-vekil", 1); r.onupgradeneeded = () => r.result.createObjectStore("dosya"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const dosyaYaz = async (id, blob) => { const d = await vt(); return new Promise((res, rej) => { const t = d.transaction("dosya", "readwrite"); t.objectStore("dosya").put(blob, id); t.oncomplete = res; t.onerror = () => rej(t.error); }); };
  const dosyaAl = async (id) => { const d = await vt(); return new Promise((res) => { const q = d.transaction("dosya").objectStore("dosya").get(id); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); };
  const dosyaSil = async (id) => { const d = await vt(); d.transaction("dosya", "readwrite").objectStore("dosya").delete(id); };

  const veri = () => { const s = T.store.get(); s.vekil = s.vekil || {}; const v = (s.vekil[cid()] = s.vekil[cid()] || {}); v.gun = v.gun || T.isoDate(); v.not = v.not || ""; v.dersNot = v.dersNot || {}; v.sayfalar = v.sayfalar || []; v.dosyalar = v.dosyalar || []; v.kural = v.kural || ""; return v; };
  const yaz = (f) => T.store.update(() => f(veri()));
  const gunTarih = (iso) => new Date(iso + "T00:00");
  const uzunTarih = (iso) => gunTarih(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
  const dersler = (iso) => (T.gunAkisi ? T.gunAkisi(gunTarih(iso)) : []).map((r, i) => Object.assign({ i }, r)).filter((r) => r.tur === "ders");
  const KAYNAK = ["Türkçe ders kitabı", "Matematik ders kitabı", "Hayat Bilgisi ders kitabı", "Fen Bilimleri ders kitabı", "Sosyal Bilgiler ders kitabı", "İngilizce ders kitabı", "Çalışma kitabı", "Okuma kitabı", "Defter"];
  const boyutYaz = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB");

  async function dosyaAc(d) {
    const b = await dosyaAl(d.id); if (!b) return T.toast("Dosya bu cihazda bulunamadı");
    const url = URL.createObjectURL(b);
    const icerik = /^image\//.test(d.tur) ? h("img", { src: url, alt: d.ad, style: { maxWidth: "100%", maxHeight: "72vh", display: "block", margin: "0 auto" } })
      : /pdf/.test(d.tur) ? h("iframe", { src: url, title: d.ad, style: { width: "100%", height: "72vh", border: 0, borderRadius: "12px" } })
      : h("p", "Bu dosya türü burada açılamıyor. İndirip açabilirsin.");
    T.modal({ title: d.ad, body: icerik, wide: true, onClose: () => setTimeout(() => URL.revokeObjectURL(url), 1000),
      actions: [{ label: "İndir", onClick: () => { const a = document.createElement("a"); a.href = url; a.download = d.ad; a.click(); return false; } }, { label: "Kapat" }] });
  }

  /* ---------- Gelen öğretmenin göreceği sayfa ---------- */
  function okumaSayfasi(baski) {
    const s = T.store.get(), c = T.store.activeClass(), v = veri(), set = s.settings || {};
    const ad = (sid) => (c.students.find((x) => x.id === sid) || {}).name || "";
    const D = dersler(v.gun);
    const sayfaSatiri = (x) => h("li", h("b", x.kaynak || "Kaynak"), x.sayfa ? " · " + x.sayfa + ". sayfa" : "", x.ne ? ": " + x.ne : "",
      !baski && x.dosya && v.dosyalar.find((d) => d.id === x.dosya) ? h("button.btn.sm.c-sky.vk-dosya-ac", { onclick: () => dosyaAc(v.dosyalar.find((d) => d.id === x.dosya)) }, T.icon("book"), "Aç") : null);
    const sayfalarOf = (k) => v.sayfalar.filter((x) => x.ders === k);
    const gorev = Object.entries((s.duties || {})[c.id] || {}).filter(([, sid]) => ad(sid));
    const oturma = (s.seats || {})[c.id];
    const bolum = (baslik, ...ic) => h("section.vk-bolum", h("h2", baslik), ...ic);
    return h("div.vk-oku" + (baski ? ".baski" : ""),
      h("header.vk-mektup",
        h("small", uzunTarih(v.gun) + " · " + c.name + " sınıfı"),
        h("h1", "Hoş geldin, sevgili meslektaşım"),
        h("p", "Bugün sınıfımda olduğun için teşekkür ederim. Gün boyu işine yarayacak her şeyi buraya yazdım."),
        set.teacher ? h("p.vk-imza", set.teacher) : null),
      v.not.trim() ? bolum("Notlarım", h("p.vk-metin", v.not)) : null,
      bolum("Bugünün dersleri", D.length ? h("ol.vk-dersler", D.map((r) => h("li",
        h("div.vk-saat", r.b + " - " + r.s), h("div", h("b", r.ad), (v.dersNot[r.i] || "").trim() ? h("p.vk-metin", v.dersNot[r.i]) : null,
          sayfalarOf(String(r.i)).length ? h("ul.vk-sayfalar", sayfalarOf(String(r.i)).map(sayfaSatiri)) : null)))) : h("p.hint", "Bu gün için ders programı girilmemiş. Sabah rutini > Günün akışı bölümünden yazılabilir.")),
      sayfalarOf("genel").length ? bolum("Kitaplar ve sayfalar", h("ul.vk-sayfalar", sayfalarOf("genel").map(sayfaSatiri))) : null,
      v.kural.trim() ? bolum("Sınıfımızın alışkanlıkları", h("p.vk-metin", v.kural)) : null,
      gorev.length ? bolum("Görevliler", h("ul.vk-gorev", gorev.map(([g, sid]) => h("li", h("b", g), ": " + ad(sid))))) : null,
      oturma && oturma.length ? bolum("Oturma planı", h("p.hint", "Tahtaya bakan yerden görünüş."), h("div.vk-oturma", { style: { gridTemplateColumns: "repeat(" + (c.students.length > 24 ? 4 : 3) + ", 1fr)" } }, oturma.map((m) => h("div.vk-sira", m.map((sid) => h("span", ad(sid) || "·")))))) : null,
      !baski && v.dosyalar.length ? bolum("Dosyalar", h("div.vk-dosyalar", v.dosyalar.map((d) => h("button.btn.c-chalk", { onclick: () => dosyaAc(d) }, T.icon(/pdf/.test(d.tur) ? "book" : "frame"), d.ad)))) : null,
      baski && v.dosyalar.length ? bolum("Dosyalar", h("p", "Tahtadaki Dersimi dolduracak öğretmene notlar sayfasında: " + v.dosyalar.map((d) => d.ad).join(", "))) : null,
      bolum("Sınıf listesi (" + c.students.length + ")", h("p.vk-liste", c.students.map((x) => x.name).join(", "))));
  }

  /* ---------- Öğretmenin hazırladığı sayfa ---------- */
  function hazirla(wrap) {
    const v = veri();
    const D = dersler(v.gun);
    const alan = (deger, ph, kaydet, satir = 4) => { const t = h("textarea.in", { rows: satir, placeholder: ph }); t.value = deger || ""; t.addEventListener("input", () => yaz((x) => kaydet(x, t.value))); return t; };
    const tarih = h("input.in", { type: "date", value: v.gun, onchange: (e) => { if (e.target.value) { yaz((x) => (x.gun = e.target.value)); T.route(); } } });
    const liste = h("datalist#vk-kaynak", KAYNAK.concat(v.dosyalar.map((d) => d.ad)).map((k) => h("option", { value: k })));
    const dersSecenek = [["genel", "Genel"]].concat(D.map((r) => [String(r.i), r.b + " " + r.ad]));
    const sayfaKutu = h("div.vk-sayfa-liste");
    const sayfaCiz = () => sayfaKutu.replaceChildren(...veri().sayfalar.map((x) => {
      const ekle = (k, el) => { el.addEventListener("change", () => yaz((y) => { const z = y.sayfalar.find((q) => q.id === x.id); if (z) z[k] = el.value; })); return el; };
      return h("div.vk-sayfa",
        ekle("ders", h("select.in", { "aria-label": "Hangi ders" }, dersSecenek.map(([k, l]) => h("option", { value: k, selected: x.ders === k ? true : null }, l)))),
        ekle("kaynak", h("input.in", { list: "vk-kaynak", value: x.kaynak || "", placeholder: "Kitap ya da kaynak", "aria-label": "Kaynak" })),
        ekle("sayfa", h("input.in.vk-no", { value: x.sayfa || "", placeholder: "Sayfa", inputmode: "numeric", "aria-label": "Sayfa" })),
        ekle("ne", h("input.in", { value: x.ne || "", placeholder: "Ne yapılacak? Örneğin 3. etkinliği birlikte yapın", "aria-label": "Ne yapılacak" })),
        ekle("dosya", h("select.in", { "aria-label": "Bağlı dosya" }, [h("option", { value: "" }, "Dosya yok")].concat(veri().dosyalar.map((d) => h("option", { value: d.id, selected: x.dosya === d.id ? true : null }, d.ad))))),
        h("button.btn.sm.c-chalk", { "aria-label": "Satırı sil", onclick: () => { yaz((y) => (y.sayfalar = y.sayfalar.filter((q) => q.id !== x.id))); sayfaCiz(); } }, T.icon("trash")));
    }));
    sayfaCiz();
    const dosyaGir = h("input", { type: "file", multiple: true, accept: "application/pdf,image/*", hidden: true, onchange: async (e) => {
      const l = [...e.target.files]; let n = 0;
      for (const f of l) { if (f.size > 60 * 1048576) { T.toast(f.name + " çok büyük (en çok 60 MB)"); continue; } const id = T.uid(); try { await dosyaYaz(id, f); yaz((x) => x.dosyalar.push({ id, ad: f.name, tur: f.type, boyut: f.size })); n++; } catch (er) { T.toast("Dosya kaydedilemedi: " + f.name); } }
      if (n) { T.toast(n + " dosya eklendi"); T.route(); }
    } });
    const kart = (baslik, aciklama, ...ic) => h("section.paper.vk-kart", h("h2", baslik), aciklama ? h("p.hint", aciklama) : null, ...ic);
    wrap.append(
      kart("Hangi gün için?", "Okula gelemeyeceğin günü seç. Ders saatleri o güne göre gelir.", h("div.row", { style: { gap: "10px" } }, tarih, h("b", uzunTarih(v.gun)))),
      kart("Notlarım", "Gelen öğretmene ilk okuyacağı şeyi yaz: sınıfın genel durumu, dikkat edilecek bir şey, zil ve teneffüs düzeni.", alan(v.not, "Örnek: Sınıfım çok sevecendir. Teneffüs sonrası sakinleşmek için 1 dakika nefes çalışması yapıyoruz.", (x, t) => (x.not = t), 5)),
      kart("Dersler", D.length ? "Her ders için ne yapılacağını kısaca yaz." : "Bu gün için ders programı yok. Sabah rutini > Günün akışı'ndan programını yazınca dersler burada görünür.",
        D.length ? h("div.vk-ders-liste", D.map((r) => h("label.vk-ders", h("span", h("b", r.ad), h("small", r.b + " - " + r.s)), alan(v.dersNot[r.i], "Bu derste ne yapılacak?", (x, t) => (x.dersNot[r.i] = t), 2)))) : null),
      kart("Kitaplar ve sayfalar", "Hangi derste hangi kitabın kaçıncı sayfasının açılacağını yaz. İstersen yüklediğin bir dosyayı da bağla.",
        liste, sayfaKutu, h("button.btn.sm.c-leaf", { onclick: () => { yaz((x) => x.sayfalar.push({ id: T.uid(), ders: D[0] ? String(D[0].i) : "genel", kaynak: "", sayfa: "", ne: "", dosya: "" })); sayfaCiz(); } }, T.icon("plus"), "Sayfa ekle")),
      kart("Dosyalar", "PDF kitap, çalışma kâğıdı ya da resim yükle. Dosyalar yalnızca bu cihazda, bu tahtada saklanır.",
        v.dosyalar.length ? h("div.vk-dosyalar", v.dosyalar.map((d) => h("div.vk-dosya", h("button.btn.sm.c-chalk", { onclick: () => dosyaAc(d) }, T.icon(/pdf/.test(d.tur) ? "book" : "frame"), d.ad), h("small", boyutYaz(d.boyut || 0)),
          h("button.btn.sm.c-chalk", { "aria-label": d.ad + " dosyasını sil", onclick: async () => { if (!(await T.confirm("Dosyayı sil", d.ad + " silinsin mi?", "Sil"))) return; await dosyaSil(d.id); yaz((x) => { x.dosyalar = x.dosyalar.filter((y) => y.id !== d.id); x.sayfalar.forEach((y) => { if (y.dosya === d.id) y.dosya = ""; }); }); T.route(); } }, T.icon("trash"))))) : null,
        h("label.btn.c-sky", { style: { cursor: "pointer", justifySelf: "start" } }, T.icon("plus"), "Dosya yükle", dosyaGir)),
      kart("Sınıfımızın alışkanlıkları", "Sessizlik işareti, tuvalet izni, kalem açma gibi küçük kurallar. Gelen öğretmen sınıfı tanımadığı için çok işe yarar.", alan(v.kural, "Örnek: El kaldırıp beklemek. Sessizlik için iki kez el çırparım, onlar da bir kez çırpar.", (x, t) => (x.kural = t), 4)),
      h("p.hint", "Görevliler, oturma planı ve sınıf listesi Sınıfım bölümünden kendiliğinden eklenir."));
  }

  T.sections.vekil = {
    title: "Dersimi dolduracak öğretmene notlar", icon: "teacher", tone: "grape", desc: "Okula gelemediğin gün için notlar, sayfalar ve dosyalar",
    render(view, sub) {
      const wrap = h("div.view-inner.vk"); view.append(wrap);
      const oku = sub === "oku";
      wrap.append(h("div.page-head", h("h1", oku ? "Öğretmene notlar" : "Dersimi dolduracak öğretmene notlar"),
        h("div.sub", oku ? "Bugün sınıfa gelen öğretmen için hazırlandı." : "Okula gelemeyeceğin gün için hazırla. Gelen öğretmen Notları aç ile hepsini tek sayfada görür."),
        h("div.grow"),
        h("div.row", { style: { gap: "8px" } },
          oku ? h("button.btn.c-chalk", { onclick: () => T.go("vekil") }, T.icon("edit"), "Düzenle") : h("button.btn.c-grape", { onclick: () => T.go("vekil-oku") }, T.icon("eye"), "Notları aç"),
          h("button.btn.c-chalk", { onclick: () => T.yazdir(okumaSayfasi(true)) }, T.icon("download"), "Yazdır"))));
      if (oku) wrap.append(okumaSayfasi(false)); else hazirla(wrap);
    },
  };
})();
