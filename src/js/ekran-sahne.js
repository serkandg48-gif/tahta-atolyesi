/* Ders ekranı sahneleri: sık kullanılan araç düzenleri tek dokunuşla kurulur, öğretmen kendi düzenini de saklar.
   Yan yana ekran: iki aracı üst üste binmeden 50/50 ya da 70/30 böler. Öğrenci boyu: ekranı aşağı indirir. */
(function () {
  const { h } = T;
  const A = "ta-sahneler";
  const kayitli = () => { try { return JSON.parse(localStorage.getItem(A) || "[]"); } catch (e) { return []; } };
  const kaydet = (l) => { try { localStorage.setItem(A, JSON.stringify(l)); } catch (e) { T.toast("Kaydedilemedi"); } };
  const HAZIR = [
    ["Grup çalışması", "groups", [{ type: "groups", x: 0, y: 0, w: 0.55, h: 1 }, { type: "timer", x: 0.55, y: 0, w: 0.45, h: 0.55 }, { type: "noise", x: 0.55, y: 0.55, w: 0.45, h: 0.45 }]],
    ["Sessiz okuma", "book", [{ type: "timer", x: 0, y: 0, w: 0.6, h: 1, data: { mod: "mum", total: 900, left: 900 } }, { type: "text", x: 0.6, y: 0, w: 0.4, h: 0.55, data: { text: "Sessiz okuma zamanı\nKitabını seç, yerine otur, okumaya başla." } }, { type: "orman", x: 0.6, y: 0.55, w: 0.4, h: 0.45 }]],
    ["İstasyonlar", "groups", [{ type: "istasyon", x: 0, y: 0, w: 0.72, h: 1 }, { type: "noise", x: 0.72, y: 0, w: 0.28, h: 0.55 }, { type: "traffic", x: 0.72, y: 0.55, w: 0.28, h: 0.45 }]],
    ["Sınıf tartışması", "talk", [{ type: "sozagi", x: 0, y: 0, w: 0.6, h: 1 }, { type: "name", x: 0.6, y: 0, w: 0.4, h: 0.6 }, { type: "timer", x: 0.6, y: 0.6, w: 0.4, h: 0.4 }]],
    ["Bireysel çalışma", "pen", [{ type: "text", x: 0, y: 0, w: 0.5, h: 0.6, data: { text: "Bugünkü görevimiz\n1. \n2. \n3. " } }, { type: "timer", x: 0.5, y: 0, w: 0.5, h: 0.6 }, { type: "traffic", x: 0, y: 0.6, w: 0.5, h: 0.4 }, { type: "noise", x: 0.5, y: 0.6, w: 0.5, h: 0.4 }]],
  ];
  T.sahnePenceresi = function () {
    const govde = h("div.sh");
    const ciz = () => {
      const l = kayitli();
      govde.replaceChildren(
        h("b", "Hazır sahneler"), h("div.sh-izgara", HAZIR.map(([ad, ic, list]) => h("button.sh-kart", { onclick: () => { m.close(); T.board.sahneKur(list); } }, T.icon3d(ic), h("span", ad), h("small", list.map((x) => (T.widgets[x.type] || {}).title).filter(Boolean).join(", "))))),
        h("b", "Benim sahnelerim"),
        l.length ? h("div.sh-izgara", l.map((x, i) => h("div.sh-kart.kendi", h("button.sh-ac", { onclick: () => { m.close(); T.board.sahneKur(x.list, x.bg); } }, T.icon3d("star"), h("span", x.ad), h("small", x.list.length + " araç")),
          h("button.sh-sil.pay", { "aria-label": x.ad + " sahnesini paylaş", title: "Paylaş", onclick: () => T.sablonPaylas && T.sablonPaylas("sahne", { bg: x.bg, list: x.list }, x.ad) }, "↗"),
          h("button.sh-sil", { "aria-label": x.ad + " sahnesini sil", onclick: async () => { if (await T.confirm("Sahneyi sil", x.ad + " silinsin mi?", "Sil")) { const y = kayitli(); y.splice(i, 1); kaydet(y); ciz(); } } }, "×")))) : h("p.hint", { style: { margin: 0 } }, "Ders ekranında araçları istediğin gibi yerleştir, sonra aşağıdan sakla."),
        h("div.row", { style: { gap: "8px" } }, (() => { const inp = h("input.in", { placeholder: "Şu anki düzenin adı, ör. Kesir dersi", maxlength: 40 }); return [inp, h("button.btn.c-leaf", { onclick: () => { const v = T.board.sahneAl(); if (!v.list.length) return T.toast("Ders ekranında araç yok"); const y = kayitli(); y.unshift({ ad: inp.value.trim() || "Sahnem " + (y.length + 1), bg: v.bg, list: v.list }); kaydet(y.slice(0, 24)); T.toast("Sahne saklandı"); ciz(); } }, T.icon("save"), "Şu anki düzeni sakla")]; })()),
        h("b", "Yan yana ekran"), h("p.hint", { style: { margin: 0 } }, "İki aracı üst üste binmeden yan yana kur."), yanYana());
    };
    const m = T.modal({ title: "Sahneler", wide: true, body: govde, actions: [{ label: "Kapat" }] });
    ciz();
  };
  /* Yan yana: soldaki ve sağdaki aracı seç, oranı seç */
  function yanYana() {
    const secenek = Object.entries(T.widgets).filter(([, w]) => w.title && w.group !== "Gizli").sort((a, b) => a[1].title.localeCompare(b[1].title, "tr"));
    const sol = h("select.in", { "aria-label": "Sol araç" }, secenek.map(([k, w]) => h("option", { value: k, selected: k === "text" ? true : null }, w.title)));
    const sag = h("select.in", { "aria-label": "Sağ araç" }, secenek.map(([k, w]) => h("option", { value: k, selected: k === "draw" ? true : null }, w.title)));
    let oran = 0.5;
    const seg = h("div.seg", [[0.5, "50 / 50"], [0.7, "70 / 30"], [0.3, "30 / 70"]].map(([v, l]) => h("button", { "aria-pressed": String(v === oran), onclick: (e) => { oran = v; [...seg.children].forEach((b) => b.setAttribute("aria-pressed", String(b === e.currentTarget))); } }, l)));
    return h("div.sh-yan", sol, sag, seg, h("button.btn.c-sky", { onclick: () => { T.$$(".modal-wrap, #layer > .scrim").forEach((x) => x.remove()); T.board.sahneKur([{ type: sol.value, x: 0, y: 0, w: oran, h: 1 }, { type: sag.value, x: oran, y: 0, w: 1 - oran, h: 1 }]); } }, "Yan yana kur"));
  }
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Ders ekranı sahneleri", ic: "plan", ac: () => { T.go("ekran"); setTimeout(T.sahnePenceresi, 300); }, ek: "Grup çalışması, sessiz okuma, yan yana ekran" });

  /* Öğrenci boyu: küçük öğrenciler üst köşelere uzanamaz; sayfa ekranın alt bölümüne iner */
  T.ogrenciBoyu = function (on) {
    const html = document.documentElement; on = on == null ? !html.classList.contains("ogrenci-boyu") : on;
    html.classList.toggle("ogrenci-boyu", on);
    let d = document.getElementById("boy-dug");
    if (on && !d) document.body.append(h("button#boy-dug", { onclick: () => T.ogrenciBoyu(false), title: "Normal boya dön" }, "⬆ Normal boy"));
    if (!on && d) d.remove();
  };
  T.ekKomutlar.push({ ad: "Öğrenci boyu", ic: "hand", ac: () => T.ogrenciBoyu(), ek: "Ekranı aşağı indir, küçükler uzansın" });
})();
