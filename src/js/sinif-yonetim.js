/* Sınıf yönetimi eklentileri:
   Adalet hafızası, gruplarda dönüşümlü roller, Düşün eşleş paylaş, Kim nerede, Yardım kuyruğu, gelmeyen öğrenciye özet mesaj.
   Öğrenci adları yalnızca bu cihazda (ve öğretmenin kilitli bulut kaydında) durur, yapay zekâya gönderilmez. */
(function () {
  const { h } = T; const W = T.widgets;
  const cid = () => T.store.get().activeClassId;
  const gelenler = (cls) => { const s = T.store.get(), a = (s.attendance[cls.id] || {})[T.isoDate()] || {}; return cls.students.filter((st) => a[st.id] !== "yok"); };
  const sure = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

  /* ---------- 1. Adalet hafızası ---------- */
  /* Dönem: Eylül-Ocak 1. dönem, Şubat-Ağustos 2. dönem */
  const donem = () => { const d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1; return m >= 9 ? y + "-1" : m === 1 ? y - 1 + "-1" : y - 1 + "-2"; };
  T.adalet = {
    sayac(tur, c = cid()) { const s = T.store.get(); const a = ((s.adalet || {})[c] || {})[donem()] || {}; return a[tur] || {}; },
    ekle(tur, sid, c = cid()) { if (!sid) return; T.store.update((s) => { s.adalet = s.adalet || {}; const k = (s.adalet[c] = s.adalet[c] || {}); const d = (k[donem()] = k[donem()] || {}); const t = (d[tur] = d[tur] || {}); t[sid] = (t[sid] || 0) + 1; }); },
    sifirla(c = cid()) { T.store.update((s) => { if (s.adalet && s.adalet[c]) delete s.adalet[c][donem()]; }); },
    /* az söz alan öne çıkar: en az alanla arasındaki fark büyüdükçe şans düşer */
    agirlik(liste, tur) { const say = this.sayac(tur), n = liste.map((st) => say[st.id] || 0), min = Math.min(...n); return n.map((x) => 1 / Math.pow(1 + (x - min), 2)); },
    /* görevleri bu dönem en az görev alanlara dağıt */
    devret(c, d) {
      const say = Object.assign({}, this.sayac("gorev", c.id)), havuz = (gelenler(c).length ? gelenler(c) : c.students).map((x) => x.id); if (!havuz.length) return;
      const kullanilan = new Set();
      Object.keys(d).forEach((g) => {
        if (g === "Nöbetçi" && T.nobetciOto(c)) return;
        const aday = havuz.filter((id) => !kullanilan.has(id) && id !== d[g]); const L = aday.length ? aday : havuz;
        const min = Math.min(...L.map((id) => say[id] || 0)); const en = T.shuffle(L.filter((id) => (say[id] || 0) === min));
        d[g] = en[0]; kullanilan.add(en[0]); say[en[0]] = (say[en[0]] || 0) + 1;
      });
      T.store.update((s) => { s.adalet = s.adalet || {}; const k = (s.adalet[c.id] = s.adalet[c.id] || {}); const dd = (k[donem()] = k[donem()] || {}); dd.gorev = say; });
    },
  };
  /* İsim çekme: öğretmen kurallarıyla birlikte az söz alanı öne çıkar ve seçileni sayar */
  const eskiSec = T.kuralIsimSec;
  T.kuralIsimSec = (liste) => {
    const k = T.kurallar ? T.kurallar() : { haric: [], oncelik: [] }, adil = T.adalet.agirlik(liste, "soz");
    const ag = liste.map((s, i) => (k.haric.includes(s.id) ? 0 : (k.oncelik.includes(s.id) ? 3 : 1) * adil[i]));
    const top = ag.reduce((a, b) => a + b, 0); let i = liste.length - 1;
    if (!top) i = eskiSec ? eskiSec(liste) : T.rand(0, liste.length - 1);
    else { let r = Math.random() * top; for (let j = 0; j < ag.length; j++) { r -= ag[j]; if (r < 0) { i = j; break; } } }
    if (liste[i]) T.adalet.ekle("soz", liste[i].id);
    return i;
  };
  /* Dönemlik sayılar: tartışma çıkınca öğretmen açıp gösterebilir */
  T.adaletPenceresi = () => {
    const c = T.store.activeClass(), soz = T.adalet.sayac("soz"), gor = T.adalet.sayac("gorev");
    const L = c.students.slice().sort((a, b) => (soz[a.id] || 0) + (gor[a.id] || 0) - (soz[b.id] || 0) - (gor[b.id] || 0));
    T.modal({ title: "Bu dönem kim kaç kez?", body: h("div", { style: { display: "grid", gap: "8px" } },
      h("p.hint", { style: { margin: 0 } }, "İsim çekme ve görev dağıtma, bu dönem en az söz ya da görev alanları kendiliğinden öne çıkarır."),
      h("table.ad-tablo", h("tr", h("th", "Öğrenci"), h("th", "Söz"), h("th", "Görev")), L.map((st) => h("tr", h("td", st.name), h("td", soz[st.id] || 0), h("td", gor[st.id] || 0))))),
      actions: [{ label: "Sayıları sıfırla", onClick: async () => { if (await T.confirm("Sıfırla", "Bu dönemin sayıları silinsin mi?", "Sıfırla")) T.adalet.sifirla(); } }, { label: "Tamam", tone: "c-leaf" }] });
  };

  /* ---------- 2. Gruplarda dönüşümlü roller (öğretmen belirler) ---------- */
  const VARSAYILAN_ROL = [["Sözcü", "Grubun bulduğunu sınıfa anlatır."], ["Zaman tutucu", "Süreyi izler, grubu zamanında bitirir."], ["Malzeme sorumlusu", "Malzemeleri getirir, toplar, yerine koyar."], ["Kayıtçı", "Grubun fikirlerini yazar."]];
  const roller = () => { const s = T.store.get(); return ((s.roller || {})[cid()]) || VARSAYILAN_ROL.map(([ad, is]) => ({ ad, is })); };
  const rollerYaz = (L) => T.store.update((s) => { s.roller = s.roller || {}; s.roller[cid()] = L; });
  function rolPenceresi(sonra) {
    let L = roller().map((r) => Object.assign({}, r));
    const govde = h("div", { style: { display: "grid", gap: "8px" } });
    const ciz = () => govde.replaceChildren(h("p.hint", { style: { margin: 0 } }, "Rolleri ve her rolün tek cümlelik görevini siz belirleyin. Gruptaki öğrenci sayısından fazla rol olursa fazlası boş kalır."),
      ...L.map((r, i) => h("div.rol-satir", h("input.in", { value: r.ad, placeholder: "Rol adı", "aria-label": "Rol adı", oninput: (e) => (r.ad = e.target.value) }), h("input.in", { value: r.is, placeholder: "Bu rol ne yapar?", "aria-label": "Görevi", oninput: (e) => (r.is = e.target.value) }), h("button.btn.sm.icon.c-tomato", { "aria-label": "Rolü sil", onclick: () => { L.splice(i, 1); ciz(); } }, T.icon("trash")))),
      h("div.row", { style: { gap: "8px" } }, h("button.btn.sm.c-chalk", { onclick: () => { L.push({ ad: "", is: "" }); ciz(); } }, T.icon("plus"), "Rol ekle"), h("button.btn.sm.c-chalk", { onclick: () => { L = VARSAYILAN_ROL.map(([ad, is]) => ({ ad, is })); ciz(); } }, "Başlangıç rolleri")));
    ciz();
    T.modal({ title: "Grup rolleri", body: govde, actions: [{ label: "Vazgeç" }, { label: "Kaydet", tone: "c-leaf", onClick: () => { rollerYaz(L.filter((r) => r.ad.trim())); sonra && sonra(); } }] });
  }
  if (W.groups) {
    const eski = W.groups.render;
    W.groups.render = function (body, w, api) {
      eski.call(this, body, w, api);
      const d = w.data, pano = body.querySelector(".gr3-pano"); if (!pano) return;
      d.rolKay = d.rolKay || 0;
      const rolBtn = h("button.btn.sm.c-chalk", { onclick: () => { d.rolAcik = !d.rolAcik; api.save(); suslen(); } });
      const kaydir = h("button.btn.sm.c-chalk", { title: "Herkes bir sonraki role geçer", onclick: () => { d.rolKay++; api.save(); T.sound.tick(); suslen(); } }, T.icon("rotate"), "Rolleri kaydır");
      const duzen = h("button.btn.sm.c-chalk", { onclick: () => rolPenceresi(suslen) }, T.icon("edit"), "Roller");
      const ikili = h("button.btn.sm.c-chalk", { onclick: () => T.board.add("dep") }, T.icon("talk"), "İkili eşleştir");
      const lejant = h("div.rol-lejant");
      body.style.gridTemplateRows = "auto auto 1fr auto";
      pano.before(h("div.row.rol-ust", { style: { gap: "6px", flexWrap: "wrap" } }, rolBtn, kaydir, duzen, ikili)); pano.after(lejant);
      const suslen = () => {
        const R = roller(); rolBtn.textContent = d.rolAcik ? "Roller: açık" : "Roller: kapalı"; kaydir.style.display = duzen.style.display = d.rolAcik ? "" : "none";
        pano.querySelectorAll(".gr3-kart").forEach((kart) => { kart.querySelectorAll(".gr3-ad").forEach((el, i) => { el.querySelector(".rol-rozet") && el.querySelector(".rol-rozet").remove(); if (!d.rolAcik || !R.length) return; const n = kart.querySelectorAll(".gr3-ad").length, j = (i + d.rolKay) % Math.max(n, 1); if (j < R.length) el.append(h("span.rol-rozet", R[j].ad)); }); });
        lejant.replaceChildren(...(d.rolAcik ? R.map((r) => h("span.rol-l", h("b", r.ad), " " + (r.is || ""))) : []));
      };
      new MutationObserver(() => { if (!pano._susleniyor) { pano._susleniyor = true; suslen(); pano._susleniyor = false; } }).observe(pano, { childList: true });
      suslen();
    };
  }

  /* ---------- 3. Düşün, eşleş, paylaş ---------- */
  W.dep = {
    title: "Düşün, eşleş, paylaş", icon: "talk", tone: "sky", w: 620, h: 520, desc: "Gelenleri ikili eşleştirir, sırayla konuşur",
    init: () => ({ ciftler: [], sn: 60, dusun: 30, evre: "bos", bitis: 0 }),
    render(body, w, api) {
      const d = w.data; let tik = null; api.onClose && api.onClose(() => clearInterval(tik));
      const ust = h("div.row", { style: { gap: "6px", flexWrap: "wrap" } }), saat = h("div.dep-saat"), liste = h("div.dep-liste");
      body.style.gridTemplateRows = "auto auto 1fr"; body.style.gap = "8px"; body.append(ust, saat, liste);
      const EVRE = { dusun: "Herkes sessizce düşünsün", sol: "Soldaki anlatır, sağdaki dinler", sag: "Sağdaki anlatır, soldaki dinler", bitti: "Paylaşma zamanı: birkaç ikili sınıfa anlatsın" };
      const eslestir = () => { const p = T.shuffle(gelenler(api.cls()).map((s) => s.id)); const c = []; for (let i = 0; i < p.length; i += 2) c.push(p.slice(i, i + 2)); if (c.length > 1 && c[c.length - 1].length === 1) c[c.length - 2].push(c.pop()[0]); d.ciftler = c; d.evre = "bos"; api.save(); T.sound.ok(); ciz(); };
      const basla = (evre) => { d.evre = evre; d.bitis = Date.now() + (evre === "dusun" ? d.dusun : d.sn) * 1000; api.save(); ciz(); calis(); };
      const calis = () => { clearInterval(tik); tik = setInterval(() => { if (!document.body.contains(body)) return clearInterval(tik); const k = d.bitis - Date.now(); if (k <= 0) { clearInterval(tik); T.sound.ding ? T.sound.ding() : T.sound.ok(); const s = { dusun: "sol", sol: "sag", sag: "bitti" }[d.evre]; if (s === "bitti") { d.evre = "bitti"; api.save(); ciz(); } else basla(s); } else saatYaz(); }, 250); };
      const saatYaz = () => { const k = d.bitis - Date.now(); saat.replaceChildren(h("b", EVRE[d.evre] || "Önce ikilileri eşleştir"), ["dusun", "sol", "sag"].includes(d.evre) ? h("span.dep-sayac", sure(k + 999)) : null); };
      const ciz = () => {
        const cls = api.cls(), ad = (id) => (cls.students.find((s) => s.id === id) || {}).name || "";
        ust.replaceChildren(h("button.btn.sm.c-leaf", { onclick: eslestir }, T.icon("groups"), "Eşleştir"),
          h("button.btn.sm.c-sun", { disabled: !d.ciftler.length || null, onclick: () => basla(d.dusun ? "dusun" : "sol") }, T.icon("play"), "Başlat"),
          h("label.hint", "Konuşma ", h("select.in", { onchange: (e) => { d.sn = +e.target.value; api.save(); } }, [30, 60, 90, 120].map((x) => h("option", { value: x, selected: x === d.sn || null }, x + " sn")))),
          h("label.hint", "Düşünme ", h("select.in", { onchange: (e) => { d.dusun = +e.target.value; api.save(); } }, [0, 15, 30, 60].map((x) => h("option", { value: x, selected: x === d.dusun || null }, x ? x + " sn" : "yok")))));
        saatYaz();
        liste.replaceChildren(...(d.ciftler.length ? d.ciftler.map((c) => h("div.dep-cift", c.map((id, i) => h("span.dep-ad" + ((d.evre === "sol" && i === 0) || (d.evre === "sag" && i > 0) ? ".konus" : ""), ad(id))))) : [h("p.hint", "Eşleştir'e bas. Gelmeyenler eşleşmeye girmez.")]));
      };
      ciz(); if (["dusun", "sol", "sag"].includes(d.evre) && d.bitis > Date.now()) calis();
    },
  };

  /* ---------- 4. Kim nerede (Lavabo, Revir) ---------- */
  W.kimnerede = {
    title: "Kim nerede?", icon: "clock", tone: "sky", w: 420, h: 420, desc: "Lavaboya ya da revire çıkanlar",
    init: () => ({ disari: [], esik: 7 }),
    render(body, w, api) {
      const d = w.data; let tik = null, acik = false;
      const serit = h("div.kn-serit"), cekmece = h("div.kn-cekmece");
      body.style.gridTemplateRows = "auto 1fr auto"; body.style.gap = "8px";
      const alt = h("div.row", { style: { gap: "6px" } }, h("button.btn.sm.c-chalk", { onclick: () => { acik = !acik; ciz(); } }, T.icon("plus"), "Çıkıyorum"), h("label.hint", "Uyarı ", h("select.in", { onchange: (e) => { d.esik = +e.target.value; api.save(); } }, [5, 7, 10, 15].map((x) => h("option", { value: x, selected: x === d.esik || null }, x + " dk")))));
      body.append(serit, cekmece, alt);
      const ciz = () => {
        const cls = api.cls();
        serit.replaceChildren(...(d.disari.length ? d.disari.map((o) => { const st = cls.students.find((s) => s.id === o.id); const gecen = Date.now() - o.t;
          return h("button.kn-kart" + (gecen > d.esik * 60000 ? ".uzun" : ""), { "data-t": o.t, title: "Döndü: dokun", onclick: () => { d.disari = d.disari.filter((x) => x !== o); api.save(); T.sound.tick(); ciz(); } }, T.icon(o.yer === "Revir" ? "heart" : "clock"), h("b", st ? st.name : "?"), h("small", o.yer), h("span.kn-sure", sure(gecen))); }) : [h("p.hint", { style: { margin: 0 } }, "Şu an herkes sınıfta.")]));
        cekmece.replaceChildren(...(acik ? gelenler(cls).filter((s) => !d.disari.some((o) => o.id === s.id)).map((s) => h("div.kn-ogr", h("span", s.name), ["Lavabo", "Revir"].map((yer) => h("button.btn.sm.c-chalk", { onclick: () => { d.disari.push({ id: s.id, yer, t: Date.now() }); acik = false; api.save(); T.sound.pop(); ciz(); } }, yer)))) : []));
        cekmece.style.display = acik ? "" : "none";
      };
      ciz(); tik = setInterval(() => { if (!document.body.contains(body)) return clearInterval(tik); serit.querySelectorAll(".kn-kart").forEach((k) => { const g = Date.now() - +k.dataset.t; k.querySelector(".kn-sure").textContent = sure(g); k.classList.toggle("uzun", g > d.esik * 60000); }); }, 1000);
    },
  };

  /* ---------- 5. Yardım bekliyorum ---------- */
  W.yardim = {
    title: "Yardım bekliyorum", icon: "hand", tone: "sun", w: 520, h: 460, desc: "Takılan öğrenci sıraya girer, yerine oturur",
    init: () => ({ sira: [] }),
    render(body, w, api) {
      const d = w.data; let acik = false;
      const sira = h("div.yd-sira"), izgara = h("div.yd-izgara");
      body.style.gridTemplateRows = "auto 1fr auto"; body.style.gap = "8px";
      body.append(sira, izgara, h("div.row", { style: { gap: "6px" } }, h("button.btn.sm.c-sun", { onclick: () => { acik = !acik; ciz(); } }, T.icon("hand"), "Sıraya gir"), h("button.btn.sm.c-chalk", { onclick: () => { d.sira = []; api.save(); ciz(); } }, "Sırayı temizle")));
      const ciz = () => {
        const cls = api.cls(), ad = (id) => (cls.students.find((s) => s.id === id) || {}).name || "?";
        sira.replaceChildren(...(d.sira.length ? d.sira.map((o, i) => h("button.yd-kart" + (i === 0 ? ".ilk" : ""), { title: "Yardım edildi: dokun", onclick: () => { d.sira = d.sira.filter((x) => x !== o); api.save(); T.sound.tick(); ciz(); } }, h("i", String(i + 1)), T.avatar(ad(o.id), 34), h("b", ad(o.id)))) : [h("p.hint", { style: { margin: 0 } }, "Sırada kimse yok.")]));
        izgara.replaceChildren(...(acik ? gelenler(cls).filter((s) => !d.sira.some((o) => o.id === s.id)).map((s) => h("button.yd-ogr", { onclick: () => { d.sira.push({ id: s.id, t: Date.now() }); acik = false; api.save(); T.sound.pop(); ciz(); } }, T.avatar(s.name, 40), h("span", s.name))) : []));
        izgara.style.display = acik ? "" : "none";
      };
      ciz();
    },
  };

  /* ---------- 6. Gelmeyen öğrenciye özet mesaj ---------- */
  T.gelmeyenMesaj = (c, st) => {
    const s = T.store.get(), bugun = T.isoDate(), anahtar = c.id + ":" + bugun;
    const dersler = (T.gunAkisi ? T.gunAkisi() : []).filter((r) => r.tur === "ders").map((r) => r.ad).filter((x, i, a) => a.indexOf(x) === i);
    const planlar = (s.plans || []).filter((p) => p.at && T.isoDate(new Date(p.at)) === bugun).map((p) => p.ders + ": " + p.baslik);
    const hizli = ((s.kokpit || {}).not || {})[c.id] || "";
    const odev = ((s.gunNotu || {})[anahtar]) || "";
    const ogretmen = s.settings.teacher || "";
    const metin = () => [
      "Merhaba,", st.name + " bugün okula gelemedi, kendisini özledik. Bugün yaptıklarımızı paylaşıyorum.",
      dersler.length ? "Bugün derslerimiz: " + dersler.join(", ") + "." : "",
      planlar.length ? "İşlediğimiz konular: " + planlar.join("; ") + "." : "",
      odevI.value.trim() ? "Ödev ve kitap sayfaları: " + odevI.value.trim() : "",
      hizli.trim() ? "Hatırlatma: " + hizli.trim() : "",
      "Yarın görüşmek üzere.", ogretmen ? ogretmen : ""].filter(Boolean).join("\n");
    const odevI = h("textarea.in", { rows: 2, placeholder: "Bugünün ödevi ya da işlenen kitap sayfaları (bütün gelmeyenler için bir kez yazılır)", "aria-label": "Ödev ve sayfalar" }); odevI.value = odev;
    const onizle = h("textarea.in.gm-onizle", { rows: 9, "aria-label": "Mesaj" });
    const yenile = () => (onizle.value = metin()); odevI.addEventListener("input", () => { T.store.update((x) => { x.gunNotu = x.gunNotu || {}; x.gunNotu[anahtar] = odevI.value; }); yenile(); }); yenile();
    T.modal({ title: st.name + " için özet mesaj", body: h("div", { style: { display: "grid", gap: "8px" } }, odevI, onizle, h("p.hint", { style: { margin: 0 } }, "Metni düzenleyebilirsiniz. Kopyalayıp veli mesajlaşma uygulamasına yapıştırın.")),
      actions: [{ label: "Kapat" }, { label: "Kopyala", tone: "c-leaf", onClick: () => T.copyText(onizle.value, "Mesaj kopyalandı") }] });
  };

  /* ---------- 7. Buradayım: çocuk kendi yoklamasını alır ---------- */
  T.avatarSec = (st, sonra) => {
    const c = T.store.activeClass(), K = T.KARAKTER; let sec = Object.assign({}, T.karakterAyar(st.name));
    const govde = h("div.av-kur");
    const yaz = () => T.store.update((s) => { s.avatarlar = s.avatarlar || {}; (s.avatarlar[c.id] = s.avatarlar[c.id] || {})[st.name] = Object.assign({}, sec); });
    const satir = (et, L, alan, ic) => h("div.av-satir", h("b", et), h("div.av-sira", L.map((x, i) => h("button.av-sec" + (sec[alan] === i ? ".on" : ""), { "aria-label": et + " " + (typeof x === "string" && !x.startsWith("#") ? x : i + 1), onclick: () => { sec[alan] = i; ciz(); } }, ic(x, i)))));
    const renk = (x) => h("i.av-renk", { style: { background: x } });
    const ciz = () => { yaz();
      govde.replaceChildren(h("div.av-onizle", T.karakter(st.name, 200)), h("div.av-secenek",
        satir("Ten", K.TEN, "t", renk), satir("Saç", K.SAC, "s", (x) => h("span", x)), satir("Saç rengi", K.SAC_RENK, "r", renk),
        satir("Kıyafet", K.KIYAFET, "k", renk), satir("Aksesuar", K.AKS, "a", (x) => h("span", x)))); };
    ciz();
    T.modal({ title: st.name + ", karakterini seç", body: govde, actions: [{ label: "Tamam", tone: "c-leaf", onClick: () => sonra && sonra() }], onClose: () => sonra && sonra() });
  };
  W.buradayim = {
    title: "Buradayım", icon: "check", tone: "leaf", w: 980, h: 620, desc: "Çocuklar gelince kendi karakterine dokunur",
    init: () => ({ tarih: "", gelen: [] }),
    render(body, w, api) {
      const d = w.data; if (d.tarih !== T.isoDate()) { d.tarih = T.isoDate(); d.gelen = []; api.save(); }
      const sahne = h("div.by-sahne"), sinif = h("div.by-sinif"), bahce = h("div.by-bahce"), bilgi = h("div.by-bilgi");
      let secMod = false;
      sahne.append(h("div.by-cati"), sinif, h("div.by-yol"), bahce);
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      body.append(sahne, h("div.row", { style: { gap: "8px", flexWrap: "wrap" } }, bilgi, h("div.spacer"),
        h("button.btn.sm.c-chalk", { onclick: () => { secMod = !secMod; ciz(); } }, T.icon("edit"), "Karakterimi seç"),
        h("button.btn.sm.c-leaf", { onclick: bitir }, T.icon("check"), "Yoklamaya işle")));
      const kart = (st) => h("button.by-cocuk", { "data-id": st.id, "aria-label": st.name }, T.karakter(st.name, api.cls().students.length > 20 ? 70 : 86), h("span", st.name));
      function gel(st, el) {
        if (secMod) return T.avatarSec(st, () => { secMod = false; ciz(); });
        if (d.gelen.includes(st.id)) return;
        const a = el.getBoundingClientRect(); d.gelen.push(st.id); api.save();
        T.store.update((s) => { const at = (s.attendance[api.cls().id] = s.attendance[api.cls().id] || {}); (at[T.isoDate()] = at[T.isoDate()] || {})[st.id] = "var"; });
        ciz(); const yeni = sinif.querySelector(`[data-id="${st.id}"]`); if (!yeni) return; const b = yeni.getBoundingClientRect();
        const dx = a.left - b.left, dy = a.top - b.top;
        /* zıplayarak sınıfa girer: üç sekme, son sekmede yerine oturur */
        yeni.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(1)` },
          { transform: `translate(${dx * 0.66}px, ${dy * 0.66 - 70}px) scale(1.1) rotate(-6deg)`, offset: 0.25 },
          { transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(.95, 1.05)`, offset: 0.45 },
          { transform: `translate(${dx * 0.18}px, ${dy * 0.18 - 50}px) scale(1.08) rotate(5deg)`, offset: 0.68 },
          { transform: "translate(0, 0) scale(1.1, .9)", offset: 0.88 },
          { transform: "translate(0, 0) scale(1)" }], { duration: 1100, easing: "ease-in-out" });
        T.sound.pop(); setTimeout(() => T.sound.ok(), 1000);
      }
      function ciz() {
        const cls = api.cls(), L = cls.students;
        sinif.replaceChildren(...L.filter((s) => d.gelen.includes(s.id)).map((st) => kart(st)));
        bahce.replaceChildren(...L.filter((s) => !d.gelen.includes(s.id)).map((st) => { const k = kart(st); k.onclick = () => gel(st, k); return k; }));
        if (secMod) sinif.querySelectorAll(".by-cocuk").forEach((k) => { const st = L.find((x) => x.id === k.dataset.id); k.onclick = () => T.avatarSec(st, () => { secMod = false; ciz(); }); });
        sahne.classList.toggle("sec", secMod);
        bilgi.textContent = secMod ? "Adına dokun, karakterini seç." : "Sınıfta: " + d.gelen.length + " / " + L.length + ". Gelince kendi karakterine dokun.";
      }
      async function bitir() {
        const cls = api.cls(), gelmeyen = cls.students.filter((s) => !d.gelen.includes(s.id));
        if (!(await T.confirm("Yoklamaya işle", gelmeyen.length ? "Dokunmayan " + gelmeyen.length + " öğrenci Gelmedi olarak işaretlensin mi? Sınıfım > Yoklama'dan değiştirebilirsiniz." : "Herkes gelmiş. Yoklama kaydedilsin mi?", "İşle"))) return;
        T.store.update((s) => { const at = (s.attendance[cls.id] = s.attendance[cls.id] || {}), g = (at[T.isoDate()] = at[T.isoDate()] || {}); cls.students.forEach((st) => (g[st.id] = d.gelen.includes(st.id) ? (g[st.id] === "gec" ? "gec" : "var") : "yok")); });
        T.toast("Yoklama kaydedildi");
      }
      ciz();
    },
  };

  /* ---------- 8. Konuşma ağı: kim kimden sonra konuştu, örümcek ağı gibi ---------- */
  W.konusma = {
    title: "Konuşma ağı", icon: "talk", tone: "grape", w: 760, h: 640, desc: "Tartışmada kim konuştu, söz nasıl dolaştı",
    init: () => ({ sira: [] }),
    render(body, w, api) {
      const d = w.data, S = T.svg, kap = h("div.ka-kap"), alan = h("div.ka-alan", kap), bilgi = h("div.ka-bilgi");
      body.style.gridTemplateRows = "minmax(0, 1fr) auto"; body.style.gap = "8px";
      /* ağ her zaman tam yuvarlak kalsın: alanın kısa kenarına göre kare */
      new ResizeObserver(() => { const r = alan.getBoundingClientRect(), k = Math.max(200, Math.min(r.width, r.height)); kap.style.width = kap.style.height = k + "px"; }).observe(alan);
      body.append(alan, h("div.row", { style: { gap: "6px", flexWrap: "wrap" } }, bilgi, h("div.spacer"),
        h("button.btn.sm.c-chalk", { onclick: () => { d.sira.pop(); api.save(); ciz(); } }, T.icon("undo"), "Geri al"),
        h("button.btn.sm.c-chalk", { onclick: () => { d.sira = []; api.save(); ciz(); } }, T.icon("reset"), "Temizle")));
      function ciz() {
        const L = gelenler(api.cls()), n = L.length, say = {}; d.sira.forEach((id) => (say[id] = (say[id] || 0) + 1));
        const R = 300, C = 360, poz = {}; L.forEach((st, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; poz[st.id] = [C + R * Math.cos(a), C + R * Math.sin(a)]; });
        const svg = S("svg", { viewBox: "0 0 720 720", style: "width:100%;height:100%" });
        /* ağın iplikleri: eskiler soluk, yeniler koyu */
        d.sira.forEach((id, i) => { if (!i) return; const a = poz[d.sira[i - 1]], b = poz[id]; if (!a || !b) return; const yeni = i / d.sira.length;
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, cx = mx + (C - mx) * 0.35, cy = my + (C - my) * 0.35;
          svg.append(S("path", { d: `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`, fill: "none", stroke: `hsl(${265 - yeni * 60} 70% ${62 - yeni * 22}%)`, "stroke-width": 2 + yeni * 3, "stroke-linecap": "round", opacity: 0.35 + yeni * 0.6 })); });
        kap.replaceChildren(svg);
        L.forEach((st) => { const [x, y] = poz[st.id], k = say[st.id] || 0, son = d.sira[d.sira.length - 1] === st.id;
          const b = h("button.ka-ogr" + (son ? ".son" : "") + (!k && d.sira.length > 3 ? ".sessiz" : ""), { style: { left: (x / 720) * 100 + "%", top: (y / 720) * 100 + "%" }, onclick: () => { d.sira.push(st.id); api.save(); T.sound.pop(); ciz(); } }, T.avatar(st.name, 46), h("span", st.name), k ? h("i", String(k)) : null);
          kap.append(b); });
        const konusan = Object.keys(say).length;
        bilgi.textContent = d.sira.length ? `${d.sira.length} söz, ${konusan} / ${n} öğrenci konuştu.` + (d.sira.length > 3 && konusan < n ? " Soluk görünenler henüz konuşmadı." : "") : "Konuşan öğrencinin adına dokun. Söz dolaştıkça ağ örülür.";
      }
      ciz();
    },
  };
})();
