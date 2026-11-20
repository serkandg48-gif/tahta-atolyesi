/* Öğretmenin gizli kuralları: kura, grup ve oturma planı tahtada rastgele görünür ama öğretmenin dengesini korur.
   Kurallar yalnızca öğretmen ekranında, ayarlar penceresinde görünür. */
(function () {
  const { h } = T;
  const cid = () => T.store.get().activeClassId;
  T.kurallar = () => { const s = T.store.get(); s.kurallar = s.kurallar || {}; const k = (s.kurallar[cid()] = s.kurallar[cid()] || {}); ["ayri", "birlikte"].forEach((x) => (k[x] = k[x] || [])); ["oncelik", "haric", "on"].forEach((x) => (k[x] = k[x] || [])); return k; };
  const varMi = () => { const k = T.kurallar(); return k.ayri.length + k.birlikte.length + k.oncelik.length + k.haric.length + k.on.length > 0; };
  T.kuralVar = varMi;

  /* İsim çek: önceliklilerin şansı üç kat, "bugün seçilmesin" denenler hiç çıkmaz (başka kimse kalmadıysa çıkar) */
  T.kuralIsimSec = (liste) => {
    const k = T.kurallar(); const ag = liste.map((s) => (k.haric.includes(s.id) ? 0 : k.oncelik.includes(s.id) ? 3 : 1));
    let top = ag.reduce((a, b) => a + b, 0); if (!top) return T.rand(0, liste.length - 1);
    let r = Math.random() * top; for (let i = 0; i < ag.length; i++) { r -= ag[i]; if (r < 0) return i; } return liste.length - 1;
  };
  /* Gruplar: önce rastgele dağıt, sonra kuralları bozan çiftleri takasla düzelt */
  T.kuralGrupla = (gs) => {
    const k = T.kurallar(); if (!k.ayri.length && !k.birlikte.length) return gs;
    const yer = () => { const m = {}; gs.forEach((g, i) => g.forEach((id) => (m[id] = i))); return m; };
    const ceza = () => { const m = yer(); let c = 0; k.ayri.forEach(([a, b]) => { if (m[a] != null && m[a] === m[b]) c++; }); k.birlikte.forEach(([a, b]) => { if (m[a] != null && m[b] != null && m[a] !== m[b]) c++; }); return c; };
    let c = ceza();
    for (let t = 0; t < 600 && c > 0; t++) {
      const i = T.rand(0, gs.length - 1), j = T.rand(0, gs.length - 1); if (i === j || !gs[i].length || !gs[j].length) continue;
      const a = T.rand(0, gs[i].length - 1), b = T.rand(0, gs[j].length - 1);
      [gs[i][a], gs[j][b]] = [gs[j][b], gs[i][a]]; const y = ceza();
      if (y <= c) c = y; else [gs[i][a], gs[j][b]] = [gs[j][b], gs[i][a]];
    }
    return gs;
  };
  /* Oturma planı: "ön sırada" denenler ilk sıralara, ayrı tutulacaklar aynı sıraya düşmez */
  T.kuralOturma = (ids, siraSayisi, kolon) => {
    const k = T.kurallar(); const onlar = ids.filter((x) => k.on.includes(x)), digerleri = ids.filter((x) => !k.on.includes(x));
    let l = T.shuffle(onlar).concat(T.shuffle(digerleri));
    const masalar = Array.from({ length: siraSayisi }, (_, i) => [l[i * 2] || null, l[i * 2 + 1] || null]);
    const ayri = (a, b) => k.ayri.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    for (let t = 0; t < 400; t++) {
      const bozuk = masalar.findIndex((m) => m[0] && m[1] && ayri(m[0], m[1])); if (bozuk < 0) break;
      const j = T.rand(onlar.length ? Math.ceil(onlar.length / 2) : 0, masalar.length - 1); if (j === bozuk) continue;
      const s = T.rand(0, 1); [masalar[bozuk][1], masalar[j][s]] = [masalar[j][s], masalar[bozuk][1]];
    }
    return masalar;
  };

  /* Kural penceresi */
  T.kuralPenceresi = function () {
    const c = T.store.activeClass(), st = c.students, ad = (id) => (st.find((x) => x.id === id) || {}).name || "?";
    const sec = (ph) => h("select.in", { "aria-label": ph }, h("option", { value: "" }, ph), st.map((x) => h("option", { value: x.id }, x.name)));
    const govde = h("div.kr");
    const ciz = () => {
      const k = T.kurallar();
      const yaz = (f) => { T.store.update(() => f(T.kurallar())); ciz(); };
      const ciftBolum = (anahtar, baslik, aciklama, bag) => {
        const a = sec("Öğrenci"), b = sec("Öğrenci");
        return h("section.kr-bolum", h("h3", baslik), h("p.hint", aciklama),
          h("div.kr-satir", a, h("span", bag), b, h("button.btn.sm.c-leaf", { onclick: () => { if (!a.value || !b.value || a.value === b.value) return T.toast("İki farklı öğrenci seç"); yaz((x) => x[anahtar].push([a.value, b.value])); } }, T.icon("plus"), "Ekle")),
          k[anahtar].length ? h("div.kr-etiketler", k[anahtar].map(([x, y], i) => h("span.kr-etiket", ad(x) + " " + bag + " " + ad(y), h("button", { "aria-label": "Kaldır", onclick: () => yaz((z) => z[anahtar].splice(i, 1)) }, "×")))) : null);
      };
      const tekBolum = (anahtar, baslik, aciklama) => {
        const a = sec("Öğrenci ekle"); a.addEventListener("change", () => { if (a.value && !k[anahtar].includes(a.value)) yaz((x) => x[anahtar].push(a.value)); });
        return h("section.kr-bolum", h("h3", baslik), h("p.hint", aciklama), a,
          k[anahtar].length ? h("div.kr-etiketler", k[anahtar].map((id) => h("span.kr-etiket", ad(id), h("button", { "aria-label": "Kaldır", onclick: () => yaz((z) => (z[anahtar] = z[anahtar].filter((q) => q !== id))) }, "×")))) : null);
      };
      govde.replaceChildren(
        h("p.kr-giris", "Bu kurallar tahtada görünmez. Çark, grup ve oturma planı yine rastgele görünür; arkada senin dengen korunur."),
        ciftBolum("ayri", "Ayrı tutulsun", "Grup kurarken ve oturma planında yan yana düşmesinler.", "ile"),
        ciftBolum("birlikte", "Birlikte olsun", "Grup kurarken aynı gruba düşsünler. Örneğin destek olan bir arkadaş.", "ile"),
        tekBolum("on", "Ön sırada otursun", "Oturma planında Karıştır'a basınca ilk sıralara yerleşir."),
        tekBolum("oncelik", "İsim çekmede öncelik", "Söz almakta çekingen olanlar. Çarkta çıkma şansları üç kat olur."),
        tekBolum("haric", "İsim çekmede çıkmasın", "Bugün söz almak istemeyen ya da hazır olmayan bir öğrenci. İşin bitince kaldırmayı unutma."));
    };
    ciz();
    T.modal({ title: c.name + " · Öğretmenin kuralları", body: govde, actions: [{ label: "Tamam", tone: "c-leaf" }] });
  };
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Öğretmenin kuralları (kura ve grup)", ic: "lock", ac: () => T.kuralPenceresi(), ek: "Ayrı tutulsun, birlikte olsun, ön sıra, öncelik" });
})();
