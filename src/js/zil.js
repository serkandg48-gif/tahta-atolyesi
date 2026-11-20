/* Zil koreografisi: ders bitmeden 3 dakika önce toparlanma hatırlatması,
   teneffüs bitmeden 1 dakika önce sıradaki ders ve hazırlanacak malzemeler. İsteğe bağlı, Ayarlar'dan açılır. */
(function () {
  const { h } = T;
  const AYAR = "ta-zil";
  const ayar = () => { try { return Object.assign({ acik: false, malzeme: {} }, JSON.parse(localStorage.getItem(AYAR) || "{}")); } catch (e) { return { acik: false, malzeme: {} }; } };
  const kaydet = (a) => { try { localStorage.setItem(AYAR, JSON.stringify(a)); } catch (e) {} };
  T.zilAyar = ayar; T.zilKaydet = kaydet;
  const gosterildi = new Set();
  let kart = null;
  const kapat = () => { if (kart) { kart.classList.add("kapan"); const k = kart; setTimeout(() => k.remove(), 400); kart = null; } };
  function goster(tur, baslik, metin, ekler) {
    kapat();
    kart = h("div.zil-kart." + tur, { role: "status" }, h("button.zil-x", { "aria-label": "Kapat", onclick: kapat }, T.icon("close")),
      h("small", tur === "toparla" ? "Ders bitiyor" : "Teneffüs bitiyor"), h("b", baslik), metin ? h("p", metin) : null,
      ekler && ekler.length ? h("div.zil-malzeme", ekler.map((m) => h("span", m))) : null);
    document.body.append(kart);
    T.sound.chime ? T.sound.chime() : T.sound.pop && T.sound.pop();
    setTimeout(() => { if (kart && kart.isConnected) kapat(); }, tur === "toparla" ? 90000 : 75000);
  }
  T.zilGoster = goster;
  function denetle() {
    const a = ayar(); if (!a.acik || !T.gunAkisi || (T.kilitliMi && T.kilitliMi() && false)) return;
    if (T.cal && T.cal.status && T.cal.status().kind !== "okul") return;
    const simdi = new Date(), dk = simdi.getHours() * 60 + simdi.getMinutes() + simdi.getSeconds() / 60;
    const akis = T.gunAkisi(simdi); if (!akis.length) return;
    akis.forEach((r, i) => {
      const b = T.akisDk(r.b), s = T.akisDk(r.s), kalan = s - dk, anahtar = T.isoDate() + ":" + i;
      if (r.tur === "ders" && kalan <= 3 && kalan > 0 && !gosterildi.has(anahtar)) {
        gosterildi.add(anahtar); goster("toparla", "Masamızı toparlayalım", "Kalemler kutuya, defterler çantaya, sandalyeler masaya.");
      }
      if (r.tur !== "ders" && kalan <= 1 && kalan > 0 && !gosterildi.has(anahtar)) {
        const sonraki = akis.slice(i + 1).find((x) => x.tur === "ders"); if (!sonraki) return;
        gosterildi.add(anahtar);
        const m = (a.malzeme[sonraki.ad] || "").split(",").map((x) => x.trim()).filter(Boolean);
        goster("sirada", "Sırada: " + sonraki.ad, m.length ? "Hazır mı?" : "Yerlerimize geçelim, sakinleşelim.", m);
      }
    });
  }
  setInterval(denetle, 15000); setTimeout(denetle, 3000);

  /* Ayarlar penceresi: aç/kapat ve ders başına malzemeler */
  T.zilPenceresi = function () {
    const a = ayar();
    const dersler = [...new Set([1, 2, 3, 4, 5].flatMap((g) => { const d = new Date(); d.setDate(d.getDate() + ((g - d.getDay() + 7) % 7)); return T.gunAkisi(d).filter((r) => r.tur === "ders").map((r) => r.ad); }))];
    const govde = h("div.zil-ayar",
      h("p.hint", "Ders bitmeden 3 dakika önce ekranın köşesinde toparlanma hatırlatması çıkar. Teneffüs bitmeden 1 dakika önce sıradaki ders ve hazırlanacak malzemeler görünür. Ses çok yumuşaktır."),
      h("div.seg", [[false, "Kapalı"], [true, "Açık"]].map(([v, l]) => h("button", { "aria-pressed": String(a.acik === v), onclick: (e) => { a.acik = v; kaydet(a); [...e.currentTarget.parentNode.children].forEach((b, i) => b.setAttribute("aria-pressed", String(i === (v ? 1 : 0)))); } }, l))),
      h("b", "Derslere göre malzemeler"), h("p.hint", { style: { margin: 0 } }, "Virgülle ayır. Örnek: defter, cetvel, kırmızı kalem"),
      dersler.length ? h("div.zil-liste", dersler.map((ad) => h("label.zil-satir", h("span", ad), h("input.in", { value: a.malzeme[ad] || "", placeholder: "Malzemeler", oninput: (e) => { a.malzeme[ad] = e.target.value; kaydet(a); } })))) : h("p.hint", "Önce Sabah rutini > Günün akışı'ndan ders programını yaz."),
      h("button.btn.sm.c-chalk", { style: { justifySelf: "start" }, onclick: () => goster("sirada", "Sırada: Matematik", "Hazır mı?", ["defter", "cetvel"]) }, "Örneğini göster"));
    T.modal({ title: "Zil hatırlatmaları", body: govde, actions: [{ label: "Tamam", tone: "c-leaf" }] });
  };
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Zil hatırlatmaları", ic: "bell", ac: () => T.zilPenceresi(), ek: "Ders sonu toparlanma, sıradaki ders ve malzemeler" });
})();
