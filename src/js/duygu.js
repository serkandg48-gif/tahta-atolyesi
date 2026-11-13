/* Sosyal duygusal öğrenme: duygumetre, sorunum ne büyüklükte, çatışma çözüm köşesi, sakinleşme köşesi, duygu kartları, iltifat çemberi.
   Öğrenci duyguları yalnızca bu cihazda tutulur, hiçbir yere gönderilmez. */
(function () {
  const { h } = T; const S = T.svg;
  const tool = (id, def) => (T.tools[id] = Object.assign({ back: "duygu", grades: [1, 4] }, def));

  /* ---------- Duygular ve yüz çizimleri ---------- */
  const DUYGU = [
    ["mutlu", "Mutlu", "#E9A23B"], ["sakin", "Sakin", "#2E8B57"], ["heyecanli", "Heyecanlı", "#D9822B"], ["gururlu", "Gururlu", "#7A5BC7"],
    ["saskin", "Şaşkın", "#3C8DBC"], ["yorgun", "Yorgun", "#7D8597"], ["endiseli", "Endişeli", "#B08A2E"], ["uzgun", "Üzgün", "#4A6FA5"],
    ["korkmus", "Korkmuş", "#6B5B95"], ["kizgin", "Kızgın", "#C2453A"],
  ];
  T.yuz = function (k, size = 88) {
    const d = DUYGU.find((x) => x[0] === k) || DUYGU[0], c = d[2];
    const s = S("svg", { viewBox: "0 0 100 100", width: size, height: size, "aria-hidden": "true" });
    const eye = { normal: '<circle cx="36" cy="42" r="5"/><circle cx="64" cy="42" r="5"/>', closed: '<path d="M29 43q7 5 14 0M57 43q7 5 14 0" stroke-width="4" fill="none"/>', wide: '<circle cx="36" cy="41" r="7" fill="#fff" stroke-width="3.5"/><circle cx="64" cy="41" r="7" fill="#fff" stroke-width="3.5"/><circle cx="36" cy="42" r="3.2"/><circle cx="64" cy="42" r="3.2"/>', half: '<path d="M29 43h14M57 43h14" stroke-width="4"/><circle cx="36" cy="46" r="3"/><circle cx="64" cy="46" r="3"/>' };
    const F = {
      mutlu: [eye.normal, '<path d="M30 60q20 22 40 0" stroke-width="5" fill="none"/>', ""],
      sakin: [eye.closed, '<path d="M36 64q14 8 28 0" stroke-width="4.5" fill="none"/>', ""],
      heyecanli: [eye.wide, '<path d="M30 58h40q-2 22-20 22t-20-22z" fill="#fff" stroke-width="4"/>', ""],
      gururlu: [eye.closed, '<path d="M33 61q17 15 34 0" stroke-width="5" fill="none"/>', '<path d="M26 32l14 3M74 32l-14 3" stroke-width="4"/>'],
      saskin: [eye.wide, '<ellipse cx="50" cy="68" rx="7" ry="9" fill="#fff" stroke-width="4"/>', '<path d="M26 28q10-6 18 0M56 28q10-6 18 0" stroke-width="4" fill="none"/>'],
      yorgun: [eye.half, '<path d="M38 68h24" stroke-width="4.5"/>', ""],
      endiseli: [eye.normal, '<path d="M34 70q4-6 8 0t8 0t8 0t8 0" stroke-width="4" fill="none"/>', '<path d="M28 31l14-4M72 31l-14-4" stroke-width="4"/>'],
      uzgun: [eye.normal, '<path d="M32 72q18-16 36 0" stroke-width="5" fill="none"/>', '<path d="M28 30l14 5M72 30l-14 5" stroke-width="4"/>'],
      korkmus: [eye.wide, '<path d="M36 70q14-10 28 0" stroke-width="4.5" fill="none"/>', '<path d="M27 27l15 6M73 27l-15 6" stroke-width="4"/>'],
      kizgin: [eye.normal, '<path d="M34 72q16-12 32 0" stroke-width="5" fill="none"/>', '<path d="M26 30l16 8M74 30l-16 8" stroke-width="5"/>'],
    }[d[0]];
    s.innerHTML = `<circle cx="50" cy="50" r="44" fill="${c}" opacity=".18"/><circle cx="50" cy="50" r="44" fill="none" stroke="${c}" stroke-width="4"/><g fill="#1B2A4A" stroke="#1B2A4A" stroke-linecap="round" stroke-linejoin="round">${F[2]}${F[0]}${F[1]}</g>`;
    return s;
  };

  /* ---------- Bölüm ---------- */
  const GRUPLAR = [
    ["Duygularımı tanıyorum", ["duygumetre", "bolgeler", "duygu-kartlari", "beynim"]],
    ["Kendimi düzenliyorum", ["sakinlesme", "zihin-suzgeci", "gelecek-teleskobu"]],
    ["Arkadaşlarımla", ["catisma", "sorun-boyutu", "seninle-mi", "sogusun", "iltifat"]],
    ["Öğrenme kültürü", ["anlama-duzeyi", "uc-adim", "takildim", "ogrenme-cukuru", "favori-hatalar", "bitirdim", "bump-it-up", "yz-duzeyi"]],
    ["Yansıtma panoları", ["gul-diken", "calma-listesi", "bookflix"]],
  ];
  T.sections.duygu = {
    title: "Sosyal duygusal öğrenme ve sınıf kültürü", icon: "heart", tone: "pink", desc: "Duygumetre, çatışma çözme, sakinleşme",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const wrap = h("div.view-inner"); view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Sosyal duygusal öğrenme"), h("div.sub", "Duyguyu adlandırmak, sakinleşmek, sorunu büyüklüğüne göre ele almak, arkadaşla anlaşmak ve hatadan öğrenmek için sınıf araçları. Öğrencilerin seçimleri ve yüklenen fotoğraflar yalnızca bu cihazda kalır.")));
      GRUPLAR.forEach(([g, ids]) => {
        wrap.append(h("div.section-title", h("h2", g)));
        wrap.append(h("div.tool-grid", { style: { marginBottom: "18px" } }, ids.filter((id) => T.tools[id]).map((id) => { const t = T.tools[id]; return T.aracKart("duygu-" + id, t, "pink"); })));
      });
    },
  };

  const cid = () => T.store.activeClass().id;
  const present = () => { const s = T.store.get(), c = T.store.activeClass(); const day = (s.attendance[c.id] || {})[T.isoDate()] || {}; return c.students.filter((x) => day[x.id] !== "yok"); };

  /* 1. Duygumetre */
  /* Duygudan bölgeye: duyguyu fark et, nedenini söyle, alet çantasından bir yol seç */
  const NEDEN = [["arkadas", "Arkadaşlarım"], ["ev", "Evim, ailem"], ["ders", "Derslerim"], ["oyun", "Oyun"], ["uyku", "Uykum, yorgunluk"], ["saglik", "Bedenim"], ["baska", "Başka bir şey"]];
  const bolgeOf = (d, siddet) => ({ yorgun: 0, uzgun: 0, mutlu: 1, sakin: 1, gururlu: 1, heyecanli: 2, saskin: 2, endiseli: 2, korkmus: siddet >= 5 ? 3 : 2, kizgin: siddet >= 3 ? 3 : 2 })[d] ?? 1;
  T.duyguBolge = bolgeOf;
  tool("duygumetre", {
    title: "Duygumetre", icon: "heart", tone: "pink", short: "Nasılım, neden, ne yapabilirim?",
    render(host) {
      let mod = "tek", secili = null, siddet = 3, ogr = null, neden = null;
      const box = h("div"); host.append(box);
      const kayitAl = (gun = T.isoDate()) => { const s = T.store.get(); s.duygu = s.duygu || {}; return s.duygu[cid() + ":" + gun] || {}; };
      function ozet() {
        const gunler = []; for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); gunler.push(T.isoDate(d)); }
        const say = {}, nsay = {}, bsay = [0, 0, 0, 0], zor = {}; let top = 0, gunSay = 0;
        gunler.forEach((g) => { const k = kayitAl(g), v = Object.entries(k); if (v.length) gunSay++; v.forEach(([sid, x]) => { top++; say[x.d] = (say[x.d] || 0) + 1; if (x.n) nsay[x.n] = (nsay[x.n] || 0) + 1; bsay[bolgeOf(x.d, x.s)]++; if (["kizgin", "uzgun", "korkmus", "endiseli"].includes(x.d)) zor[sid] = (zor[sid] || 0) + 1; }); });
        if (!top) return h("div.sb-card", h("h3", "Son 7 gün"), h("p.hint", "Henüz kayıt yok. \"Sırayla herkes\" ile çocuklar duygusunu seçtikçe özet burada oluşur."));
        const st = T.store.activeClass().students, bar = (n, c) => h("div.dy-cbar", h("i", { style: { width: (n / top) * 100 + "%", background: c } }));
        const izle = Object.entries(zor).filter(([, n]) => n >= 2).map(([sid, n]) => [st.find((x) => x.id === sid), n]).filter(([x]) => x);
        return h("div.dy-ozet",
          h("div.sb-card", h("h3", "Son 7 gün: duygular"), h("p.hint", gunSay + " günde " + top + " seçim"), h("div.dy-chart", DUYGU.filter(([k]) => say[k]).sort((x, y) => say[y[0]] - say[x[0]]).map(([k, l, c]) => h("div.dy-crow", T.yuz(k, 34), h("span", l), bar(say[k], c), h("b", say[k]))))),
          h("div.sb-card", h("h3", "Bölgeler"), h("div.dy-chart", T.BOLGE.map(([ad, , c], i) => h("div.dy-crow", h("i.dy-bnokta", { style: { background: c } }), h("span", ad), bar(bsay[i], c), h("b", bsay[i])))),
            Object.keys(nsay).length ? h("h3", { style: { marginTop: "14px" } }, "Nedenler") : null, h("div.dy-chart", NEDEN.filter(([k]) => nsay[k]).sort((x, y) => nsay[y[0]] - nsay[x[0]]).map(([k, l]) => h("div.dy-crow", h("i.dy-bnokta", { style: { background: "#8E7DBE" } }), h("span", l), bar(nsay[k], "#8E7DBE"), h("b", nsay[k]))))),
          h("div.sb-card", h("h3", "Birebir konuşmak iyi olabilir"), izle.length ? h("div.dy-names", izle.map(([x, n]) => h("span.dy-izle", T.avatar(x.name, 28), x.name, h("small", n + " kez zor duygu")))) : h("p.hint", "Bu hafta zor duyguyu iki kez ya da daha çok seçen öğrenci yok."),
            h("p.hint", "Bu özet yalnızca bu cihazda tutulur, hiçbir yere gönderilmez.")));
      }
      function ciz() {
        const kayit = kayitAl();
        if (mod === "bolge") { box.replaceChildren(ustBar()); T.tools.bolgeler.render(box); return; }
        if (mod === "ozet") { box.replaceChildren(ustBar(), ozet()); return; }
        const faces = h("div.dy-faces", DUYGU.map(([k, l]) => h("button.dy-face", { "aria-pressed": String(secili === k), onclick: () => { secili = k; neden = null; T.speak(l); ciz(); } }, T.yuz(k, 92), h("span", l))));
        const termo = h("div.dy-termo", h("div.dy-tlabel", "Ne kadar?"), h("div.dy-tbar", [1, 2, 3, 4, 5].map((n) => h("button", { "aria-pressed": String(n <= siddet), "aria-label": n + " / 5", onclick: () => { siddet = n; ciz(); } }, n))), h("div.dy-tends", h("span", "Biraz"), h("span", "Çok")));
        const dAd = secili ? T.trLower(DUYGU.find((x) => x[0] === secili)[1]) : "";
        const cumle = secili ? h("div.dy-cumle", "Ben şu an ", h("b", (siddet >= 4 ? "çok " : siddet <= 2 ? "biraz " : "") + dAd), " hissediyorum", neden ? [" çünkü ", h("b", T.trLower(NEDEN.find((x) => x[0] === neden)[1])), " ile ilgili bir şey oldu."] : " çünkü ...") : h("div.dy-cumle.hint", "Bir yüz seç, sonra ne kadar hissettiğini göster.");
        const nedenEl = secili ? h("div.dy-neden", h("div.dy-tlabel", "Neden?"), h("div.dy-nchips", NEDEN.map(([k, l]) => h("button", { "aria-pressed": String(neden === k), onclick: () => { neden = neden === k ? null : k; ciz(); } }, l)))) : null;
        const bi = secili ? bolgeOf(secili, siddet) : null;
        const bolgeEl = secili ? h("div.dy-bolge", { style: { "--c": T.BOLGE[bi][2] } }, h("i"), h("div", h("b", T.BOLGE[bi][0]), h("span", T.BOLGE[bi][1]))) : null;
        let isimler = null, alt = null;
        if (mod === "sinif") {
          const ps = present();
          const say = {}; Object.values(kayit).forEach((v) => (say[v.d] = (say[v.d] || 0) + 1));
          const toplam = Object.keys(kayit).length;
          isimler = h("div.dy-names", ps.map((st) => h("button" + (ogr === st.id ? ".on" : "") + (kayit[st.id] ? ".done" : ""), { onclick: () => { ogr = st.id; const k = kayit[st.id] || {}; secili = k.d || null; siddet = k.s || 3; neden = k.n || null; ciz(); } }, T.avatar(st.name, 30), st.name, kayit[st.id] ? T.yuz(kayit[st.id].d, 26) : null)));
          alt = h("div.dy-class",
            h("div.row", h("button.btn", { disabled: !(ogr && secili) ? true : null, onclick: () => { T.store.update((s) => { s.duygu = s.duygu || {}; const k = cid() + ":" + T.isoDate(); s.duygu[k] = s.duygu[k] || {}; s.duygu[k][ogr] = { d: secili, s: siddet, n: neden }; }); T.sound.pop(); const sira = ps.findIndex((x) => x.id === ogr); const nx = ps.slice(sira + 1).concat(ps.slice(0, sira)).find((x) => !kayitAl()[x.id] && x.id !== ogr); ogr = nx ? nx.id : null; secili = null; siddet = 3; neden = null; ciz(); } }, T.icon("check"), "Kaydet, sıradaki"),
              h("span.hint", toplam + " / " + ps.length + " arkadaş seçti")),
            toplam ? h("div.dy-chart", DUYGU.filter(([k]) => say[k]).sort((a, b) => say[b[0]] - say[a[0]]).map(([k, l, c]) => h("div.dy-crow", T.yuz(k, 34), h("span", l), h("div.dy-cbar", h("i", { style: { width: (say[k] / toplam) * 100 + "%", background: c } })), h("b", say[k])))) : null);
        }
        box.replaceChildren(ustBar(),
          mod === "sinif" && !ogr ? h("p.dy-tip", "Önce adına dokun, sonra yüzünü, ne kadar hissettiğini ve nedenini seç.") : null,
          isimler,
          h("div.dy-main", faces, h("div.dy-side", termo, nedenEl, cumle, bolgeEl)),
          secili ? h("div", { style: { marginTop: "14px" } }, T.aletCantasi(bi)) : null,
          alt);
      }
      function ustBar() {
        return h("div.row", { style: { marginBottom: "14px" } }, h("div.seg", [["tek", "Tahtada birlikte"], ["sinif", "Sırayla herkes"], ["bolge", "Bölgeler ve alet çantası"], ["ozet", "Haftalık özet"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => { mod = k; ogr = null; secili = null; neden = null; ciz(); } }, l))),
          mod === "sinif" ? h("button.btn.sm.c-chalk", { onclick: async () => { if (await T.confirm("Bugünün seçimleri silinsin mi?", "Bu sınıfın bugünkü duygumetre seçimleri silinir.", "Sil")) { T.store.update((s) => { if (s.duygu) delete s.duygu[cid() + ":" + T.isoDate()]; }); ciz(); } } }, T.icon("reset"), "Bugünü sıfırla") : null);
      }
      ciz();
    },
  });

  /* 2. Duygu kartları */
  const DURUMLAR = {
    mutlu: ["Doğum gününde arkadaşların sana sürpriz yaptı.", "Uzun zamandır beklediğin oyuncağı aldın."], sakin: ["Yağmur sesini dinleyerek kitap okuyorsun.", "Parkta bankta oturmuş, kuşları izliyorsun."],
    heyecanli: ["Yarın sınıfça geziye gideceksiniz.", "İlk kez sahneye çıkmak üzeresin."], gururlu: ["Zorlandığın bir problemi kendi başına çözdün.", "Resmin okul panosuna asıldı."],
    saskin: ["Kapıyı açtın, karşında hiç beklemediğin bir misafir vardı.", "Öğretmenin bugün sınıfa bir kaplumbağa getirdi."], yorgun: ["Bütün gün parkta koşup oynadın.", "Dün gece geç uyudun."],
    endiseli: ["Yarın sınıfın önünde sunum yapacaksın.", "Annen seni okuldan almaya geç kaldı."], uzgun: ["En yakın arkadaşın başka bir şehre taşınıyor.", "Çok sevdiğin kalemin kırıldı."],
    korkmus: ["Gece büyük bir gök gürültüsü duydun.", "Kalabalık bir yerde ailene bir an göremedin."], kizgin: ["Biri sıranı almadan öne geçti.", "Arkadaşın yaptığın kuleyi izin almadan yıktı."],
  };
  [["mutlu", "Teneffüste yeni bir arkadaşla oyun kurdunuz.", "Bütün gün beklediğin yağmur dindi, dışarı çıktın."], ["sakin", "Okuldan eve döndün, en sevdiğin köşende dinleniyorsun.", "Ders bitti, sınıf sessizce kitap okuyor."],
   ["heyecanli", "Bugün sınıfa yeni bir öğrenci gelecek.", "Okul gösterisinde sıra sana gelmek üzere."], ["gururlu", "Bisiklete kimse tutmadan binebildin.", "Kardeşine okumayı öğrettin."],
   ["saskin", "Sabah uyandın, her yer karla kaplanmıştı.", "Arkadaşın senin doğum gününü hatırlayıp hediye getirdi."], ["yorgun", "Uzun bir yolculuktan yeni döndün.", "Beden eğitimi dersinde çok koştun."],
   ["endiseli", "Evcil hayvanın bugün biraz hasta.", "Yeni bir okula başlayacaksın."], ["uzgun", "Oyunda seni aralarına almadılar.", "Çok sevdiğin çiçeğin kurudu."],
   ["korkmus", "Köpek bir anda havlayarak sana doğru koştu.", "Elektrikler kesildi, her yer karardı."], ["kizgin", "Kardeşin resmini karaladı.", "Oyunda biri kuralı bozdu ve kazandı."]].forEach(([k, ...l]) => DURUMLAR[k].push(...l));
  const kartVeri = () => { const s = T.store.get(); return ((s.duyguKart || {})[cid()]) || []; };
  const kartYaz = (fn) => T.store.update((s) => { s.duyguKart = s.duyguKart || {}; s.duyguKart[cid()] = fn(s.duyguKart[cid()] || []); });
  tool("duygu-kartlari", {
    title: "Duygu kartları", icon: "heart", tone: "pink", short: "Durumu oku, duyguyu bul, konuş",
    render(host) {
      /* deste: bütün kartlar karışır, bitmeden hiçbiri tekrar gelmez, aynı duygu art arda gelmez */
      let deste = [], son = null, kart = null, acik = false;
      const hepsi = () => Object.entries(DURUMLAR).flatMap(([k, l]) => l.map((t) => ({ k, t }))).concat(kartVeri().map((x) => ({ k: x.k, t: x.t, sinif: true })));
      const cek = () => { if (!deste.length) deste = T.shuffle(hepsi()); let i = deste.findIndex((x) => !son || x.k !== son.k); if (i < 0) i = 0; kart = son = deste.splice(i, 1)[0]; acik = false; };
      const box = h("div"); host.append(box);
      function ekle() {
        const ta = h("textarea.in", { placeholder: "Bir durum yaz. Örnek: Teneffüste topun çatıya kaçtı.", style: { minHeight: "90px", fontSize: "19px" } });
        let dk = "mutlu"; const sec = h("div.dy-faces.kucuk", DUYGU.map(([k, l]) => h("button.dy-face", { "aria-pressed": String(k === dk), onclick: (e) => { dk = k; sec.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.currentTarget))); } }, T.yuz(k, 46), h("span", l))));
        T.modal({ title: "Sınıfın kartı", wide: true, body: h("div", { style: { display: "grid", gap: "10px" } }, ta, h("b", "Bu durumda nasıl hissederiz?"), sec), actions: [{ label: "Vazgeç" }, { label: "Kartı ekle", tone: "c-leaf", onClick: () => { const t = ta.value.trim(); if (!t) return false; kartYaz((l) => l.concat({ id: T.uid(), k: dk, t })); deste = []; ciz(); } }] });
      }
      function liste() {
        const l = kartVeri();
        T.modal({ title: "Sınıfın eklediği kartlar", wide: true, body: l.length ? h("div.dy-kliste", l.map((x) => h("div", T.yuz(x.k, 34), h("span", x.t), h("button.btn.sm.c-chalk", { onclick: (e) => { kartYaz((y) => y.filter((z) => z.id !== x.id)); e.currentTarget.parentNode.remove(); deste = []; } }, T.icon("trash"), "Sil")))) : h("p", "Henüz sınıfın eklediği kart yok."), actions: [{ label: "Kapat" }] });
      }
      const ciz = () => {
        if (!kart) cek();
        const d = DUYGU.find((x) => x[0] === kart.k), n = hepsi().length;
        box.replaceChildren(h("div.row", { style: { marginBottom: "10px" } }, h("span.hint", n + " kart, " + (n - deste.length) + ". kart"), h("div.spacer"),
            h("button.btn.sm.c-chalk", { onclick: ekle }, T.icon("plus"), "Kart ekle"), kartVeri().length ? h("button.btn.sm.c-chalk", { onclick: liste }, T.icon("text"), "Sınıfın kartları (" + kartVeri().length + ")") : null),
          h("div.dy-card",
          kart.sinif ? h("span.pill", "Sınıfımızın kartı") : null,
          h("div.dy-durum", kart.t),
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => T.speak(kart.t) }, T.icon("speaker"), "Dinle")),
          acik ? h("div.dy-reveal", T.yuz(kart.k, 120), h("b", d[1])) : h("button.btn.big", { onclick: () => { acik = true; ciz(); } }, "Bu durumda nasıl hissederiz?"),
          acik ? h("div.dy-qs", h("p", "Sen de hiç böyle hissettin mi? Ne oldu?"), h("p", "Arkadaşın böyle hissetse ona ne söylerdin?"), h("p", "Bu duyguyla baş etmek için ne yapabiliriz?")) : null,
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => { cek(); ciz(); } }, T.icon("next"), "Sıradaki kart"))));
      };
      ciz();
    },
  });

  /* 3. Sakinleşme köşesi */
  tool("sakinlesme", {
    title: "Sakinleşme köşesi", icon: "sun", tone: "sky", short: "Nefes balonu, 5-4-3-2-1, geriye sayma",
    render(host, api) {
      let mod = "nefes", turSay = 5; const box = h("div.dy-sakin"); host.append(box); let timer = null;
      T.onLeave(() => clearTimeout(timer));
      /* rehber: erkek öğrenci balonla birlikte nefes alır (göğsü ve omuzları yükselir) */
      let rehber = null, nefesHedef = 0, nefesSimdi = 0;
      const rehberKur = (kap) => {
        T.sahne3(kap, { kamera: [0, 0.85, 3.3], bak: [0, 0.7, 0], fov: 34, env: ["#FFFFFF", "#DCE8F6", "#6E95D1"] }, api).then(async (c) => {
          if (!c) return; c.sahne.add(new c.THREE.HemisphereLight(0xffffff, 0x9fb5d6, 2.2)); const L = new c.THREE.DirectionalLight(0xffffff, 1.6); L.position.set(1, 3, 3); c.sahne.add(L);
          const k = await T.karakter3B(c, "erkek", { boy: 1.35 }).catch(() => null); if (!k) return;
          k.kok.rotation.y = 0.15; c.sahne.add(k.kok); k.oynat("dur"); rehber = k;
          /* nefes: kemiklere dokunmadan, gövde hafifçe yükselir ve genişler */
          c.kare = (dt) => { k.guncelle(dt); nefesSimdi += (nefesHedef - nefesSimdi) * Math.min(1, dt * 1.6); k.kok.scale.set(1 + nefesSimdi * 0.018, 1 + nefesSimdi * 0.025, 1 + nefesSimdi * 0.03); };
        });
      };
      const tamEkran = () => { try { document.fullscreenElement ? document.exitFullscreen() : (box.requestFullscreen || box.webkitRequestFullscreen).call(box); } catch (e) { T.toast("Bu ortamda tam ekran kapalı"); } };
      function ciz() {
        clearTimeout(timer); rehber = null; nefesHedef = 0;
        const seg = h("div.row", h("div.seg", [["nefes", "Nefes balonu"], ["duyu", "5-4-3-2-1"], ["say", "Geriye say"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => { mod = k; ciz(); } }, l))),
          mod === "nefes" ? h("div.seg", [[3, "3 nefes"], [5, "5 nefes"], [10, "10 nefes"]].map(([k, l]) => h("button", { "aria-pressed": String(turSay === k), onclick: () => { turSay = k; ciz(); } }, l))) : null,
          h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: tamEkran }, T.icon("full"), "Tam ekran"));
        const alan = h("div.dy-calm");
        box.replaceChildren(seg, alan);
        if (mod === "nefes") {
          const top = h("div.dy-ball"), yazi = h("div.dy-breath", "Hazır olunca başla"), say = h("div.dy-count");
          let tur = 0, calisiyor = false;
          const adim = (i) => {
            const A = [["Burnundan nefes al", 4, 1.0, 1], ["Tut", 2, 1.0, 1], ["Ağzından yavaşça ver", 5, 0.45, 0]];
            const [t, sn, sc, nf] = A[i % 3];
            yazi.textContent = t; top.style.transition = `transform ${sn}s ease-in-out`; top.style.transform = `scale(${sc})`; nefesHedef = nf;
            let k = sn; say.textContent = k; const tick = () => { k--; if (k > 0) { say.textContent = k; timer = setTimeout(tick, 1000); } else { if (i % 3 === 2) tur++; if (tur >= turSay) { yazi.textContent = "Harika! Şimdi nasıl hissediyorsun?"; say.textContent = ""; calisiyor = false; btn.textContent = "Bir daha"; nefesHedef = 0; if (rehber) rehber.oynat("salla", { dongu: false }).then(() => rehber && rehber.oynat("dur")); return; } adim(i + 1); } };
            timer = setTimeout(tick, 1000);
          };
          const btn = h("button.btn.big", { onclick: () => { if (calisiyor) return; calisiyor = true; tur = 0; btn.textContent = turSay + " nefes"; adim(0); } }, "Başla");
          top.style.transform = "scale(.45)";
          const kap3 = h("div.dy-rehber");
          alan.append(h("div.dy-nefes-sahne", kap3, h("div.dy-ballwrap", top, say)), yazi, btn, h("p.hint", "Balon büyürken nefes alıyoruz, küçülürken veriyoruz. Arkadaşımız da bizimle nefes alıyor."));
          rehberKur(kap3);
        } else if (mod === "duyu") {
          const A = [[5, "şey görüyorum", "Etrafına bak, gördüğün 5 şeyi say."], [4, "şeye dokunabiliyorum", "Dokunabildiğin 4 şeyi say."], [3, "ses duyuyorum", "Duyduğun 3 sesi söyle."], [2, "koku alıyorum", "Alabildiğin 2 kokuyu düşün."], [1, "tat hissediyorum", "Ağzındaki 1 tadı düşün."]];
          let i = 0;
          const p = () => { const [n, t, a] = A[i]; alan.replaceChildren(h("div.dy-big", n), h("div.dy-breath", n + " " + t), h("p.sb-line", a), h("div.row", { style: { justifyContent: "center" } }, i > 0 ? h("button.btn.c-chalk", { onclick: () => { i--; p(); } }, "Önceki") : null, i < 4 ? h("button.btn.big", { onclick: () => { i++; p(); T.speak(A[i][2]); } }, "Sıradaki") : h("button.btn.big", { onclick: () => { i = 0; p(); } }, "Baştan"))); };
          p(); T.speak(A[0][2]);
        } else {
          let n = 10; const big = h("div.dy-big", n), yazi = h("div.dy-breath", "Her sayıda bir nefes");
          const run = () => { big.textContent = n; T.speak(String(n)); if (n > 0) { n--; timer = setTimeout(run, 1800); } else { yazi.textContent = "Sakinleştik. Şimdi konuşmaya hazırız."; } };
          alan.append(big, yazi, h("button.btn.big", { onclick: () => { clearTimeout(timer); n = 10; yazi.textContent = "Her sayıda bir nefes"; run(); } }, "Başla"));
        }
      }
      ciz();
    },
  });

  /* 6. İltifat çemberi */
  const ILTIFAT = ["Bana yardım ettiğin için teşekkür ederim.", "Oyunlarda herkesi düşünüyorsun.", "Fikirlerin çok yaratıcı.", "Arkadaşlarına karşı naziksin.", "Zor bir işte vazgeçmiyorsun.", "Seninle oynamak çok eğlenceli.", "Dikkatli dinliyorsun.", "Sıranı sabırla bekliyorsun.", "Malzemelerini paylaşıyorsun.", "Yeni gelenlere arkadaşlık ediyorsun."];
  const BASLAT = ["Bugün bana ... yardım ettin.", "... yaptığında çok mutlu oldum.", "Senden ... öğrendim.", "Oyunda ... yaptığın için teşekkür ederim.", "... konusunda çok emek veriyorsun."];
  tool("iltifat", {
    title: "İltifat çemberi", icon: "star", tone: "sun", short: "Günün arkadaşına sınıfça güzel sözler",
    render(host) {
      let st = null; const sozler = []; const box = h("div.dy-iltifat"); host.append(box);
      const kap3 = h("div.dy-ilt-cark"); let ck = null, sira = [];
      const inp = h("input.in", { placeholder: "Arkadaşımız söylesin, sen yaz", style: { flex: 1, fontSize: "20px" } });
      const ekle = (x) => { if (!x) return; sozler.push(x); T.sound.pop(); ciz(); };
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { ekle(inp.value.trim()); inp.value = ""; } });
      async function cevir() {
        const ps = present(); if (!ps.length) { T.toast("Sınıf listesi boş"); return; }
        if (!sira.some((x) => ps.find((y) => y.id === x.id))) sira = ps.slice();
        sira = sira.filter((x) => ps.find((y) => y.id === x.id));
        if (!ck) { st = T.pick(sira); sira = sira.filter((x) => x !== st); sozler.length = 0; ciz(); return; }
        if (ck.donuyor()) return;
        ck.kur(sira.map((x) => ({ ad: x.name })));
        const i = Math.floor(Math.random() * sira.length);
        ck.cevir(i, () => { st = sira[i]; sira = sira.filter((x) => x !== st); sozler.length = 0; T.sound.ok(); ciz(); });
      }
      function ciz() {
        box.replaceChildren(
          h("div.dy-ilt-ust", kap3, h("div.dy-ilt-sag",
            st ? h("div.dy-star", T.avatar(st.name, 96), h("div", h("small", "Günün arkadaşı"), h("b", st.name))) : h("p.sb-line", "Çarkı çevirip günün arkadaşını seçelim."),
            h("button.btn", { onclick: cevir }, T.icon("turn"), st ? "Çarkı yeniden çevir" : "Çarkı çevir"),
            h("p.hint", "Seçilen arkadaş, herkes seçilene kadar çarktan çıkar."))),
          st ? h("div.row", { style: { marginTop: "14px" } }, inp, h("button.btn.c-leaf", { onclick: () => { ekle(inp.value.trim()); inp.value = ""; } }, T.icon("plus"), "Ekle")) : null,
          st ? h("div.dy-hint", h("b", "Cümleye böyle başlayabilirsin: "), BASLAT.map((x) => h("button.btn.sm.c-chalk", { onclick: () => { inp.value = x; inp.focus(); } }, x))) : null,
          st ? h("div.dy-hint", h("b", "Hazır sözler: "), ILTIFAT.map((x) => h("button.btn.sm.c-chalk", { onclick: () => ekle(x) }, x))) : null,
          st ? h("p.hint", "Görünüşe değil, yaptığı şeylere ve davranışına bakalım.") : null,
          h("div.dy-bubbles", sozler.map((x) => h("div.dy-bubble", x))));
        if (st) setTimeout(() => inp.focus(), 30);
      }
      ciz();
      const ps0 = present(); if (ps0.length) T.cark3B(kap3, null, { sure: 3.2, arka: ["#FFFFFF", "#FFF6DE"] }).then((c) => { if (!c) return; ck = ck || c; sira = ps0.slice(); ck.kur(sira.map((x) => ({ ad: x.name }))); });
    },
  });
})();
