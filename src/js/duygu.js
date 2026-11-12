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
    ["Duygularımı tanıyorum", ["duygumetre", "duygu-kartlari"]],
    ["Kendimi düzenliyorum", ["sakinlesme", "sorun-boyutu"]],
    ["Arkadaşlarımla", ["catisma", "iltifat"]],
  ];
  T.sections.duygu = {
    title: "Sosyal duygusal öğrenme", icon: "heart", tone: "pink", desc: "Duygumetre, çatışma çözme, sakinleşme",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const wrap = h("div.view-inner"); view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Sosyal duygusal öğrenme"), h("div.sub", "Duyguyu adlandırmak, sakinleşmek, sorunu büyüklüğüne göre ele almak ve arkadaşla anlaşmak için sınıf araçları. Öğrencilerin seçimleri yalnızca bu cihazda kalır.")));
      GRUPLAR.forEach(([g, ids]) => {
        wrap.append(h("div.section-title", h("h2", g)));
        wrap.append(h("div.tool-grid", { style: { marginBottom: "18px" } }, ids.map((id) => { const t = T.tools[id]; return h("button.tool-card.c-" + (t.tone || "pink"), { onclick: () => T.go("duygu-" + id) }, T.icon(t.icon), h("span", t.title, h("small", t.short || ""))); })));
      });
    },
  };

  const cid = () => T.store.activeClass().id;
  const present = () => { const s = T.store.get(), c = T.store.activeClass(); const day = (s.attendance[c.id] || {})[T.isoDate()] || {}; return c.students.filter((x) => day[x.id] !== "yok"); };

  /* 1. Duygumetre */
  tool("duygumetre", {
    title: "Duygumetre", icon: "heart", tone: "pink", short: "Nasıl hissediyorum, ne kadar? Sınıfın duygu haritası",
    render(host) {
      let mod = "tek", secili = null, siddet = 3, ogr = null;
      const box = h("div"); host.append(box);
      const kayitAl = () => { const s = T.store.get(); s.duygu = s.duygu || {}; return s.duygu[cid() + ":" + T.isoDate()] || {}; };
      function ciz() {
        const kayit = kayitAl();
        const faces = h("div.dy-faces", DUYGU.map(([k, l]) => h("button.dy-face", { "aria-pressed": String(secili === k), onclick: () => { secili = k; T.speak(l); ciz(); } }, T.yuz(k, 92), h("span", l))));
        const termo = h("div.dy-termo", h("div.dy-tlabel", "Ne kadar?"), h("div.dy-tbar", [1, 2, 3, 4, 5].map((n) => h("button", { "aria-pressed": String(n <= siddet), "aria-label": n + " / 5", onclick: () => { siddet = n; ciz(); } }, n))), h("div.dy-tends", h("span", "Biraz"), h("span", "Çok")));
        const cumle = secili ? h("div.dy-cumle", "Ben şu an ", h("b", (siddet >= 4 ? "çok " : siddet <= 2 ? "biraz " : "") + T.trLower(DUYGU.find((x) => x[0] === secili)[1])), " hissediyorum çünkü ...") : h("div.dy-cumle.hint", "Bir yüz seç, sonra ne kadar hissettiğini göster.");
        let isimler = null, alt = null;
        if (mod === "sinif") {
          const ps = present();
          const say = {}; Object.values(kayit).forEach((v) => (say[v.d] = (say[v.d] || 0) + 1));
          const toplam = Object.keys(kayit).length;
          isimler = h("div.dy-names", ps.map((st) => h("button" + (ogr === st.id ? ".on" : "") + (kayit[st.id] ? ".done" : ""), { onclick: () => { ogr = st.id; secili = (kayit[st.id] || {}).d || null; siddet = (kayit[st.id] || {}).s || 3; ciz(); } }, T.avatar(st.name, 30), st.name, kayit[st.id] ? T.yuz(kayit[st.id].d, 26) : null)));
          alt = h("div.dy-class",
            h("div.row", h("button.btn", { disabled: !(ogr && secili) ? true : null, onclick: () => { T.store.update((s) => { s.duygu = s.duygu || {}; const k = cid() + ":" + T.isoDate(); s.duygu[k] = s.duygu[k] || {}; s.duygu[k][ogr] = { d: secili, s: siddet }; }); T.sound.pop(); const sira = ps.findIndex((x) => x.id === ogr); const nx = ps.slice(sira + 1).concat(ps.slice(0, sira)).find((x) => !kayitAl()[x.id]); ogr = nx ? nx.id : null; secili = null; siddet = 3; ciz(); } }, T.icon("check"), "Kaydet, sıradaki"),
              h("span.hint", toplam + " / " + ps.length + " arkadaş seçti")),
            toplam ? h("div.dy-chart", DUYGU.filter(([k]) => say[k]).sort((a, b) => say[b[0]] - say[a[0]]).map(([k, l, c]) => h("div.dy-crow", T.yuz(k, 34), h("span", l), h("div.dy-cbar", h("i", { style: { width: (say[k] / toplam) * 100 + "%", background: c } })), h("b", say[k])))) : null,
            toplam ? h("p.hint", "Sınıfta en çok görülen duygu üzerine kısa bir sohbet açabilirsin. Kızgın ya da üzgün seçen arkadaşlarla teneffüste birebir konuşmak iyi olur.") : null);
        }
        box.replaceChildren(
          h("div.row", { style: { marginBottom: "14px" } }, h("div.seg", [["tek", "Tahtada birlikte"], ["sinif", "Sırayla herkes"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => { mod = k; ogr = null; secili = null; ciz(); } }, l))),
            mod === "sinif" ? h("button.btn.sm.c-chalk", { onclick: async () => { if (await T.confirm("Bugünün seçimleri silinsin mi?", "Bu sınıfın bugünkü duygumetre seçimleri silinir.", "Sil")) { T.store.update((s) => { if (s.duygu) delete s.duygu[cid() + ":" + T.isoDate()]; }); ciz(); } } }, T.icon("reset"), "Bugünü sıfırla") : null),
          mod === "sinif" && !ogr ? h("p.dy-tip", "Önce adına dokun, sonra yüzünü ve ne kadar hissettiğini seç.") : null,
          isimler,
          h("div.dy-main", faces, h("div.dy-side", termo, cumle)),
          alt);
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
  tool("duygu-kartlari", {
    title: "Duygu kartları", icon: "heart", tone: "pink", short: "Durumu oku, duyguyu bul, ne yapardın konuş",
    render(host) {
      let k = T.pick(DUYGU)[0], durum = T.pick(DURUMLAR[k]), acik = false;
      const box = h("div"); host.append(box);
      const ciz = () => {
        const d = DUYGU.find((x) => x[0] === k);
        box.replaceChildren(h("div.dy-card",
          h("div.dy-durum", durum),
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => T.speak(durum) }, T.icon("speaker"), "Dinle")),
          acik ? h("div.dy-reveal", T.yuz(k, 120), h("b", d[1])) : h("button.btn.big", { onclick: () => { acik = true; T.speak(d[1]); ciz(); } }, "Bu durumda nasıl hissederiz?"),
          acik ? h("div.dy-qs", h("p", "Sen de hiç böyle hissettin mi? Ne oldu?"), h("p", "Arkadaşın böyle hissetse ona ne söylerdin?"), h("p", "Bu duyguyla baş etmek için ne yapabiliriz?")) : null,
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => { k = T.pick(DUYGU.filter((x) => x[0] !== k))[0]; durum = T.pick(DURUMLAR[k]); acik = false; ciz(); } }, T.icon("next"), "Sıradaki kart"))));
      };
      ciz();
    },
  });

  /* 3. Sakinleşme köşesi */
  tool("sakinlesme", {
    title: "Sakinleşme köşesi", icon: "sun", tone: "sky", short: "Nefes balonu, 5-4-3-2-1, geriye sayma",
    render(host) {
      let mod = "nefes"; const box = h("div"); host.append(box); let timer = null;
      T.onLeave(() => clearTimeout(timer));
      function ciz() {
        clearTimeout(timer);
        const seg = h("div.seg", [["nefes", "Nefes balonu"], ["duyu", "5-4-3-2-1"], ["say", "Geriye say"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => { mod = k; ciz(); } }, l)));
        const alan = h("div.dy-calm");
        box.replaceChildren(seg, alan);
        if (mod === "nefes") {
          const top = h("div.dy-ball"), yazi = h("div.dy-breath", "Hazır olunca başla"), say = h("div.dy-count");
          let tur = 0, calisiyor = false;
          const adim = (i) => {
            const A = [["Burnundan nefes al", 4, 1.0], ["Tut", 2, 1.0], ["Ağzından yavaşça ver", 5, 0.45]];
            const [t, sn, sc] = A[i % 3];
            yazi.textContent = t; top.style.transition = `transform ${sn}s ease-in-out`; top.style.transform = `scale(${sc})`;
            let k = sn; say.textContent = k; const tick = () => { k--; if (k > 0) { say.textContent = k; timer = setTimeout(tick, 1000); } else { if (i % 3 === 2) tur++; if (tur >= 5) { yazi.textContent = "Harika! Şimdi nasıl hissediyorsun?"; say.textContent = ""; calisiyor = false; btn.textContent = "Bir daha"; return; } adim(i + 1); } };
            timer = setTimeout(tick, 1000);
          };
          const btn = h("button.btn.big", { onclick: () => { if (calisiyor) return; calisiyor = true; tur = 0; btn.textContent = "5 nefes"; adim(0); } }, "Başla");
          top.style.transform = "scale(.45)";
          alan.append(h("div.dy-ballwrap", top, say), yazi, btn, h("p.hint", "Balon büyürken nefes alıyoruz, küçülürken veriyoruz. 5 tur sürer."));
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

  /* 4. Sorunum ne büyüklükte? */
  const BOYUT = [
    ["kucuk", "Küçük sorun", "#2E8B57", "Kendim çözebilirim.", ["Derin nefes alırım.", "Görmezden gelirim ya da başka bir şeye geçerim.", "Kibarca söylerim: Lütfen ...", "Sırayla yapmayı öneririm."]],
    ["orta", "Orta sorun", "#E9A23B", "Bir yetişkinden yardım isteyebilirim.", ["Önce sakinleşirim.", "Ne olduğunu ben diliyle anlatırım.", "Öğretmenime ya da aileme söylerim.", "Birlikte bir çözüm buluruz."]],
    ["buyuk", "Büyük sorun", "#C2453A", "Hemen bir yetişkine haber veririm.", ["Biri yaralandıysa ya da tehlikedeyse beklemem.", "En yakın yetişkine hemen söylerim.", "Güvenli bir yerde beklerim."]],
  ];
  const SORUNLAR = [
    ["Kalemimin ucu kırıldı.", "kucuk"], ["Oyunda ilk sırayı başkası aldı.", "kucuk"], ["Arkadaşım bana yanlışlıkla çarptı.", "kucuk"], ["Beslenmemde sevmediğim bir yiyecek var.", "kucuk"],
    ["Silgimi bulamıyorum.", "kucuk"], ["Arkadaşım oyuna beni almadı.", "orta"], ["Biri her gün benimle alay ediyor.", "orta"], ["Ödevimi evde unuttum.", "orta"],
    ["Tuvaletim geldi ama ders devam ediyor.", "orta"], ["Bahçede bir arkadaşım düştü, dizi kanıyor.", "buyuk"], ["Okulda bir yabancı beni yanına çağırdı.", "buyuk"], ["Sınıfta duman kokusu var.", "buyuk"],
    ["Bir arkadaşım beni itip vurdu.", "buyuk"], ["En sevdiğim oyunu oynayamadık.", "kucuk"], ["Arkadaşım sırrımı başkalarına anlattı.", "orta"],
  ];
  tool("sorun-boyutu", {
    title: "Sorunum ne büyüklükte?", icon: "scale", tone: "sun", short: "Küçük, orta, büyük sorun ve uygun tepki",
    render(host) {
      let mod = "ogren", i = 0, secim = null, sira = T.shuffle(SORUNLAR.slice());
      const box = h("div"); host.append(box);
      const kart = ([k, l, c, ana, ne]) => h("div.dy-size", { style: { "--c": c } }, h("div.dy-sizehead", h("i"), h("b", l)), h("p.dy-ana", ana), h("ul", ne.map((x) => h("li", x))));
      function ciz() {
        const seg = h("div.seg", [["ogren", "Büyüklükler"], ["oyun", "Hangi büyüklükte?"], ["tepki", "Tepkim uygun mu?"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => { mod = k; secim = null; ciz(); } }, l)));
        let ic;
        if (mod === "ogren") ic = h("div.dy-sizes", BOYUT.map(kart));
        else if (mod === "oyun") {
          const [t, dogru] = sira[i % sira.length];
          ic = h("div.dy-card",
            h("div.dy-durum", t),
            h("div.dy-pick", BOYUT.map(([k, l, c]) => h("button" + (secim ? (k === dogru ? ".right" : k === secim ? ".wrong" : "") : ""), { style: { "--c": c }, onclick: () => { if (secim) return; secim = k; k === dogru ? T.sound.ok() : T.sound.no(); ciz(); } }, h("i"), l))),
            secim ? h("div", kart(BOYUT.find((x) => x[0] === dogru)), h("p.hint", "Sınıfta farklı düşünen var mı? Neden? Bazen aynı sorun kişiye göre farklı büyüklükte hissedilir; önemli olan tepkinin uygun olması.")) : null,
            h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => T.speak(t) }, T.icon("speaker"), "Dinle"), h("button.btn", { onclick: () => { i++; secim = null; ciz(); } }, T.icon("next"), "Sıradaki durum")));
        } else {
          let sorun = 1, tepki = 3;
          const g = h("div");
          const p = () => {
            const fark = tepki - sorun;
            const yorum = fark === 0 ? ["Tepki sorunun büyüklüğüne uygun.", "ok"] : fark > 0 ? ["Tepki sorundan büyük. Önce sakinleşmek işe yarar.", "warn"] : ["Tepki sorundan küçük kalmış. Büyük sorunlarda yardım istemek gerekir.", "info"];
            const olcek = (ad, v, set, etik) => h("div.dy-scale", h("b", ad), h("div.dy-steps", [1, 2, 3].map((n) => h("button", { "aria-pressed": String(n === v), style: { "--c": BOYUT[n - 1][2] }, onclick: () => { set(n); p(); } }, etik[n - 1]))));
            g.replaceChildren(olcek("Sorunun büyüklüğü", sorun, (n) => (sorun = n), ["Küçük", "Orta", "Büyük"]), olcek("Tepkimin büyüklüğü", tepki, (n) => (tepki = n), ["Sakin", "Üzgün, sesli", "Bağırma, ağlama"]), h("div.pill." + yorum[1], { style: { fontSize: "20px", padding: "12px 18px" } }, yorum[0]), h("p.hint", "Örnek: Kalemin ucu kırıldı (küçük) ve çok bağırdın (büyük). Bu ikisi uyuşuyor mu?"));
          };
          p(); ic = g;
        }
        box.replaceChildren(seg, h("div", { style: { marginTop: "16px" } }, ic));
      }
      ciz();
    },
  });

  /* 5. Çatışma çözüm köşesi */
  const COZUM = [["Sırayla yapalım", "turn"], ["Paylaşalım", "share"], ["Birlikte oynayalım", "class"], ["Özür dileyelim", "heart"], ["Ara verip sonra konuşalım", "timer"], ["Ortada buluşalım", "scale"], ["Öğretmenden yardım isteyelim", "teacher"], ["Zar atalım ya da kura çekelim", "dice"]];
  tool("catisma", {
    title: "Çatışma çözüm köşesi", icon: "class", tone: "sky", short: "İki arkadaş adım adım anlaşır",
    render(host) {
      let adim = 0, a = null, b = null, cozum = null;
      const box = h("div"); host.append(box);
      const ad = (x, yedek) => (x ? x.name : yedek);
      const ADIM = ["Dur ve sakinleş", "Ne oldu?", "Dinle ve tekrar et", "Çözüm seç", "Anlaştık"];
      function ciz() {
        const st = T.store.activeClass().students;
        const secici = (cur, set, diger) => h("select.in", { onchange: (e) => { set(st.find((x) => x.id === e.target.value) || null); ciz(); } }, h("option", { value: "" }, "Seç"), st.filter((x) => !diger || x.id !== diger.id).map((x) => h("option", { value: x.id, selected: cur && cur.id === x.id ? true : null }, x.name)));
        const A = ad(a, "1. arkadaş"), B = ad(b, "2. arkadaş");
        let ic;
        if (adim === 0) ic = h("div.dy-step", h("h3", "İkiniz de durun. Üç derin nefes alalım."), h("div.dy-ballwrap.sm", h("div.dy-ball.pulse")), h("p.sb-line", "Hazır mısınız? Kimse bağırmadan, sırayla konuşacağız."), h("div.dy-pair", h("label", "1. arkadaş", secici(a, (x) => (a = x), b)), h("label", "2. arkadaş", secici(b, (x) => (b = x), a))), h("p.hint", "İsim seçmek isteğe bağlı. Seçilen isimler kaydedilmez."));
        else if (adim === 1) ic = h("div.dy-step", h("h3", "Sırayla ben diliyle anlatın"), h("div.dy-ben", h("div", h("b", A), h("p", "\"Ben ... olunca ... hissettim.\""), h("p", "\"Benim isteğim ...\"")), h("div", h("b", B), h("p", "\"Ben ... olunca ... hissettim.\""), h("p", "\"Benim isteğim ...\""))), h("p.hint", "Suçlayan 'sen' cümleleri yerine kendi duygunu anlat. Konuşan konuşurken diğeri sözünü kesmez."), h("div.dy-faces.sm", DUYGU.map(([k, l]) => h("div.dy-face.mini", T.yuz(k, 52), h("span", l)))));
        else if (adim === 2) ic = h("div.dy-step", h("h3", "Arkadaşını anladığını göster"), h("div.dy-ben", h("div", h("b", A), h("p", "\"Sen ... olduğu için ... hissetmişsin.\"")), h("div", h("b", B), h("p", "\"Sen ... olduğu için ... hissetmişsin.\""))), h("p.hint", "Duyduğunu kendi cümlenle tekrar et. Doğru anladım mı diye sor."));
        else if (adim === 3) ic = h("div.dy-step", h("h3", "Birlikte bir çözüm seçin"), h("div.dy-sol", COZUM.map(([l, ic2]) => h("button", { "aria-pressed": String(cozum === l), onclick: () => { cozum = l; T.speak(l); ciz(); } }, T.icon(T.ICONS[ic2] ? ic2 : "star"), l))), h("p.hint", "İkinizin de kabul ettiği çözümü seçin. Anlaşamazsanız 'Öğretmenden yardım isteyelim'i seçin."));
        else ic = h("div.dy-step.dy-done", h("div.dy-bigicon", T.icon("hands")), h("h3", A + " ve " + B + " anlaştı!"), cozum ? h("p.sb-line", "Çözümümüz: ", h("b", cozum)) : null, h("p.sb-line", "Şimdi nasıl hissediyorsunuz?"), h("button.btn", { onclick: () => { adim = 0; a = b = cozum = null; ciz(); } }, T.icon("reset"), "Yeni çatışma"));
        box.replaceChildren(
          h("div.sb-steps", ADIM.map((l, i) => h("button", { "aria-selected": String(i === adim), class: i < adim ? "done" : "", onclick: () => { adim = i; ciz(); } }, h("span.n", i + 1), l))),
          ic,
          h("div.sb-nav", adim > 0 ? h("button.btn.c-chalk", { onclick: () => { adim--; ciz(); } }, T.icon("back"), "Önceki") : h("span"), adim < 4 ? h("button.btn.big", { onclick: () => { adim++; ciz(); } }, ADIM[adim + 1], T.icon("next")) : h("span")));
      }
      ciz();
    },
  });

  /* 6. İltifat çemberi */
  const ILTIFAT = ["Bana yardım ettiğin için teşekkür ederim.", "Çok güzel gülüyorsun.", "Oyunlarda herkesi düşünüyorsun.", "Fikirlerin çok yaratıcı.", "Arkadaşlarına karşı naziksin.", "Çok güzel resim yapıyorsun.", "Zor bir işte vazgeçmiyorsun.", "Seninle oynamak çok eğlenceli.", "Sınıfımızı güzelleştiriyorsun.", "Dikkatli dinliyorsun."];
  tool("iltifat", {
    title: "İltifat çemberi", icon: "star", tone: "sun", short: "Günün arkadaşına sınıfça güzel sözler",
    render(host) {
      let st = null; const sozler = []; const box = h("div"); host.append(box);
      const inp = h("input.in", { placeholder: "Arkadaşımız söylesin, sen yaz", style: { flex: 1, fontSize: "20px" } });
      function ciz() {
        box.replaceChildren(
          st ? h("div.dy-star", T.avatar(st.name, 96), h("div", h("small", "Günün arkadaşı"), h("b", st.name))) : h("p.sb-line", "Günün arkadaşını seçerek başla."),
          h("div.row", h("button.btn", { onclick: () => { const ps = present(); st = T.pick(ps.filter((x) => !st || x.id !== st.id)) || st; sozler.length = 0; if (st) T.speak(st.name); ciz(); } }, T.icon("class"), st ? "Başka arkadaş" : "Günün arkadaşını seç")),
          st ? h("div.row", { style: { marginTop: "14px" } }, inp, h("button.btn.c-leaf", { onclick: () => { if (inp.value.trim()) { sozler.push(inp.value.trim()); inp.value = ""; T.sound.pop(); ciz(); } } }, T.icon("plus"), "Ekle")) : null,
          st ? h("div.dy-hint", "Fikir: ", ILTIFAT.slice(0, 5).map((x) => h("button.btn.sm.c-chalk", { onclick: () => { sozler.push(x); ciz(); } }, x))) : null,
          h("div.dy-bubbles", sozler.map((x) => h("div.dy-bubble", x))));
        if (st) setTimeout(() => inp.focus(), 30);
      }
      ciz();
    },
  });
})();
