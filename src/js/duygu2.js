/* Sınıf kültürü araçları (öğretmenin @egitimtech paylaşımlarından kurgulandı).
   Motorlar: düzey panosu, evet-hayır akışı, ayırma oyunu, yapışkan not panosu. Hepsi sınıfa göre bu cihazda saklanır. */
(function () {
  const { h } = T; const S = T.svg;
  const tool = (id, def) => (T.tools[id] = Object.assign({ back: "duygu", grades: [1, 4] }, def));
  const cid = () => T.store.activeClass().id;
  const present = () => { const s = T.store.get(), c = T.store.activeClass(); const day = (s.attendance[c.id] || {})[T.isoDate()] || {}; return c.students.filter((x) => day[x.id] !== "yok"); };
  const veri = (k) => { const s = T.store.get(); s.pano = s.pano || {}; s.pano[cid()] = s.pano[cid()] || {}; return s.pano[cid()][k]; };
  const yaz = (k, fn) => T.store.update((s) => { s.pano = s.pano || {}; const c = (s.pano[cid()] = s.pano[cid()] || {}); c[k] = fn(c[k]); });
  const seg = (opts, cur, on) => h("div.seg", opts.map(([v, l]) => h("button", { "aria-pressed": String(v === cur), onclick: () => on(v) }, l)));

  /* ---------- Küçük çizimler ---------- */
  const el = (n, c) => { // n parmaklı el
    const s = S("svg", { viewBox: "0 0 60 70", width: 58, height: 66, "aria-hidden": "true" });
    let g = `<rect x="10" y="34" width="40" height="30" rx="12" fill="${c}"/>`;
    const xs = [12, 21, 30, 39]; const up = n >= 5 ? 4 : n;
    xs.forEach((x, i) => { const on = i < up; g += `<rect x="${x}" y="${on ? 6 : 26}" width="8" height="${on ? 34 : 14}" rx="4" fill="${c}"/>`; });
    g += n >= 5 ? `<rect x="44" y="30" width="8" height="22" rx="4" fill="${c}" transform="rotate(35 48 41)"/>` : `<rect x="40" y="40" width="14" height="8" rx="4" fill="${c}"/>`;
    s.innerHTML = `<g stroke="rgba(27,42,74,.55)" stroke-width="1.6">${g}</g>`; return s;
  };
  const hava = (k) => { const s = S("svg", { viewBox: "0 0 80 60", width: 80, height: 60, "aria-hidden": "true" });
    const bulut = (x, y, c) => `<path d="M${x} ${y}a10 10 0 0 1 10-10a14 14 0 0 1 26 3a9 9 0 0 1 1 17H${x + 2}a9 9 0 0 1-2-10z" fill="${c}"/>`;
    s.innerHTML = { gunes: '<circle cx="28" cy="24" r="11" fill="#E9A23B"/>' + bulut(30, 40, "#D3D9E4"), bulut: bulut(14, 30, "#AEB8CB") + bulut(26, 42, "#D3D9E4"), firtina: bulut(14, 28, "#6F8FB0") + '<path d="M40 38l-6 11h7l-5 10" stroke="#E9A23B" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M22 42l-3 7M30 42l-3 7" stroke="#3B7DD8" stroke-width="3.5" stroke-linecap="round"/>' }[k]; return s; };
  const kart = (c, sim) => { const s = S("svg", { viewBox: "0 0 50 50", width: 52, height: 52, "aria-hidden": "true" }); s.innerHTML = `<rect x="6" y="6" width="38" height="38" rx="6" fill="${c}"/><text x="25" y="33" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">${sim}</text>`; return s; };

  /* =================== 1. DÜZEY PANOSU =================== */
  function duzeyPanosu(host, def) {
    const k = def.anahtar; let mod = "goster", ogr = null, set = 0;
    const box = h("div"); host.append(box);
    function ciz() {
      const sets = def.setler || [def];
      const d = sets[set];
      const kayit = veri(k) || {}; const bugun = (kayit.oy || {})[T.isoDate() + ":" + set] || {};
      const isaret = (kayit.isaret || {})[set];
      const sayac = {}; Object.values(bugun).forEach((v) => (sayac[v] = (sayac[v] || 0) + 1));
      const ps = present();
      const ust = h("div.row", { style: { marginBottom: "14px" } },
        sets.length > 1 ? seg(sets.map((x, i) => [i, x.ad]), set, (v) => { set = v; ciz(); }) : null,
        def.oy !== false ? seg([["goster", def.gosterAd || "Bugünkü düzey"], ["oy", "Sınıf yoklaması"]], mod, (v) => { mod = v; ogr = null; ciz(); }) : null,
        mod === "oy" ? h("button.btn.sm.c-chalk", { onclick: () => { yaz(k, (o) => { o = o || {}; o.oy = o.oy || {}; delete o.oy[T.isoDate() + ":" + set]; return o; }); ciz(); } }, T.icon("reset"), "Sıfırla") : null);
      const isimler = mod === "oy" ? h("div.dy-names", ps.map((st) => h("button" + (ogr === st.id ? ".on" : "") + (bugun[st.id] != null ? ".done" : ""), { onclick: () => { ogr = st.id; ciz(); } }, T.avatar(st.name, 30), st.name))) : null;
      const liste = h("div.dz-list" + (d.yatay ? ".yatay" : ""), d.duzeyler.map((z, i) => {
        const [ad, acik, renk, ikon] = z;
        const kimler = Object.entries(bugun).filter(([, v]) => v === i).map(([sid]) => ps.find((x) => x.id === sid) || T.store.activeClass().students.find((x) => x.id === sid)).filter(Boolean);
        return h("button.dz-item" + (isaret === i && mod === "goster" ? ".on" : ""), { style: { "--c": renk }, onclick: () => {
          if (mod === "oy") { if (!ogr) { T.toast("Önce bir arkadaşın adına dokun"); return; } const o2 = ogr; yaz(k, (o) => { o = o || {}; o.oy = o.oy || {}; const kk = T.isoDate() + ":" + set; o.oy[kk] = o.oy[kk] || {}; o.oy[kk][o2] = i; return o; }); T.sound.pop(); const sira = ps.findIndex((x) => x.id === ogr); const nx = ps.slice(sira + 1).find((x) => bugun[x.id] == null && x.id !== o2); ogr = nx ? nx.id : null; ciz(); }
          else { yaz(k, (o) => { o = o || {}; o.isaret = o.isaret || {}; o.isaret[set] = o.isaret[set] === i ? null : i; return o; }); T.speak(ad); ciz(); }
        } },
          h("div.dz-ikon", ikon ? ikon() : h("b", i)), h("div.dz-txt", h("b", ad), acik ? h("span", acik) : null),
          mod === "oy" ? h("div.dz-kim", sayac[i] ? h("b", sayac[i]) : null, kimler.slice(0, 8).map((x) => T.avatar(x.name, 26))) : isaret === i ? h("div.dz-ok", T.icon("back"), def.okAd || "Bugünkü düzey") : null);
      }));
      const alt = d.alt ? d.alt(isaret) : null;
      box.replaceChildren(ust, def.ust ? def.ust() : null, mod === "oy" && !ogr ? h("p.dy-tip", "Önce adına dokun, sonra kendi düzeyini seç.") : null, isimler, liste, alt);
    }
    ciz();
  }

  tool("anlama-duzeyi", {
    title: "Ne kadar anladım?", icon: "hands", tone: "sun", short: "Beş parmak ya da renkli kartla anlama düzeyi",
    render(host) {
      duzeyPanosu(host, { anahtar: "anlama", gosterAd: "Tahtada göster", okAd: "Şu an buradayız", setler: [
        { ad: "Beş parmak", duzeyler: [
          ["Anlamadım.", "Bir kere daha dinlemeye ihtiyacım var.", "#D16BA5", () => el(1, "#E7A9CB")],
          ["Anlamadığım yerler var.", "Yardıma ihtiyacım var.", "#E39A4C", () => el(2, "#F1C08E")],
          ["Sanırım anladım.", "Deneyeceğim.", "#E9C23B", () => el(3, "#F4DE8C")],
          ["Anladım.", "Gösterebilirim.", "#8DBE4A", () => el(4, "#C7E09A")],
          ["Çok iyi anladım.", "Ben öğretebilirim.", "#3C8DD8", () => el(5, "#9CC6F0")]] },
        { ad: "Renkli kartlar", duzeyler: [
          ["Yeşil kart", "Cevabı biliyorum.", "#2E8B57", () => kart("#2E8B57", "✓")],
          ["Sarı kart", "Bir fikrim var ama emin değilim.", "#E9A23B", () => kart("#E9A23B", "?")],
          ["Kırmızı kart", "Anlamadım, yardıma ihtiyacım var.", "#C2453A", () => kart("#C2453A", "!")]] }] });
      host.append(h("p.hint", "Konuşmaya çekinen çocuklar da sessizce düzeyini gösterebilir. Sınıf yoklamasında herkes kendi adına dokunup seçer; sonuç yalnızca bu cihazda kalır."));
    },
  });

  const YZ = [
    ["Düzey 0: Yapay zekâ yok", "Bu görevde hiçbir yapay zekâ aracından yararlanılmaz. Bütün çalışma kendi aklınla ve izin verilen kaynaklarla yürür.", "#5B7DB1", "Örnek: Hikâyeni baştan sona kendin yazarsın."],
    ["Düzey 1: Yardım ve anlama", "Kavramları anlamak, zor terimleri sadeleştirmek, tanım almak ya da netleştirici sorular sormak için yapay zekâdan yardım alabilirsin.", "#E9C23B", "Örnek: \"Fotosentez ne demek, basitçe anlat\" diye sorarsın. Cevabı ödevine kopyalamazsın."],
    ["Düzey 2: Geri bildirim ve düzenleme", "Kendi ürettiğin metin ve fikirlerin taslaklarını gözden geçirmek, dil ve akış geri bildirimi almak için yapay zekâyı kullanabilirsin.", "#6DAF5A", "Örnek: Önce kendin yazarsın, sonra \"Nerede yazım yanlışım var?\" diye sorarsın."],
    ["Düzey 3: Üretim ve tasarım ortağı", "Proje ya da tasarım görevinde yapay zekâ ile birlikte üretebilirsin. Nasıl ve hangi amaçla kullandığını ayrıntılı yazman gerekir.", "#E07B3C", "Örnek: Afişin için görsel fikri üretirsin ve altına \"Görseli yapay zekâ ile ürettim\" yazarsın."]];
  T.YZ_DUZEY = YZ;
  tool("yz-duzeyi", {
    title: "Yapay zekâ kullanım düzeyi", icon: "spark", tone: "grape", grades: [3, 8], short: "Bu görevde yapay zekâ ne kadar kullanılabilir?",
    render(host) {
      duzeyPanosu(host, { anahtar: "yz", oy: false, okAd: "Bugünkü düzey",
        ust: () => h("p.sb-line", "Her ödev ve araştırma görevinden önce hangi yapay zekâ kullanım düzeyinin geçerli olduğu açıkça belirtilir. Emin olmadığında çalışmaya başlamadan önce öğretmenine danış."),
        duzeyler: YZ.map(([ad, ac, r, ornek]) => [ad, ac + " " + ornek, r]) });
    },
  });

  const BOLGE = [
    ["Mavi bölge", "Yorgun, üzgün. Düşük enerji.", "#3C7DD8", ["Su molası", "Esneme", "Sarılma", "Kısa yürüyüş", "Temiz hava"]],
    ["Yeşil bölge", "Mutlu, sakin, odaklanmış. Öğrenmeye hazırım.", "#2E8B57", ["Hazır duruş", "Yardım et", "Olumlu iç ses", "Gülümse"]],
    ["Sarı bölge", "Heyecanlı, kaygılı, korkmuş. Enerji yükseliyor.", "#E0B020", ["Zıpla ya da koş", "Stres topu", "Derin nefes", "Gürültü kesici kulaklık"]],
    ["Kırmızı bölge", "Öfkeli, kontrolden çıkmak üzereyim. Enerji patlaması.", "#C2453A", ["Sakinleşme köşesine git", "Ona kadar say", "Derin nefes", "Bir yetişkinden yardım iste"]],
  ];
  /* ---------- Duygusal alet çantası: sınıf kendi yollarını ekler, her yol bir karttır, açılınca uygulanır ---------- */
  const NASIL = {
    "Su molası": "Sıranın yanından kalk, sessizce birkaç yudum su iç, sonra yerine dön.", "Esneme": "Kollarını tavana uzat, beşe kadar say. Sonra yana eğil, öbür yana eğil.",
    "Sarılma": "Kendine sıkıca sarıl ya da izin isteyerek bir arkadaşına sarıl.", "Kısa yürüyüş": "Öğretmenden izin al, sınıfın arkasında yavaşça bir tur yürü.",
    "Temiz hava": "Pencerenin yanına git, üç derin nefes al.", "Hazır duruş": "Sırtın dik, ayakların yerde, ellerin masada. Hazırım!",
    "Yardım et": "Bir arkadaşına ya da öğretmenine küçük bir yardım teklif et.", "Olumlu iç ses": "İçinden söyle: Bunu yapabilirim. Adım adım giderim.",
    "Gülümse": "Yanındaki arkadaşına gülümse, o da sana gülümsesin.", "Zıpla ya da koş": "Yerinde on kez hafifçe zıpla, sonra dur ve nefesini dinle.",
    "Stres topu": "Topu beş kez sık, bırak. Ellerin gevşesin.", "Gürültü kesici kulaklık": "Kulaklığı tak, gözlerini kapa, bir dakika sessizliği dinle.",
    "Ona kadar say": "Yavaşça ona kadar say. Her sayıda omuzlarını biraz daha gevşet.", "Bir yetişkinden yardım iste": "Öğretmenine yaklaş ve söyle: Şu an zorlanıyorum, yardım eder misin?",
  };
  const GIT = { "Derin nefes": "duygu-sakinlesme", "Sakinleşme köşesine git": "duygu-sakinlesme" };
  const aletler = () => { const v = veri("alet"); return BOLGE.map(([, , , def], i) => (v && v[i]) || def.slice()); };
  function aletUygula(ad, renk) {
    if (GIT[ad]) { T.go(GIT[ad]); return; }
    let kalan = 60, iv = null;
    const sure = h("div.alet-sure", "1:00"), bas = h("button.btn.big", { onclick: () => { if (iv) return; iv = setInterval(() => { kalan--; sure.textContent = `0:${T.pad(Math.max(0, kalan))}`; if (kalan <= 0) { clearInterval(iv); T.sound.bell(); bas.replaceChildren(T.icon("check"), "Bitti"); } }, 1000); } }, T.icon("play"), "Başlat");
    const m = T.modal({ title: ad, body: h("div.alet-uygula", { style: { "--c": renk } }, h("p", NASIL[ad] || "Bu yolu birlikte uygulayalım."), sure, bas), actions: [{ label: "Kapat" }] });
    const kapan = setInterval(() => { if (!document.body.contains(sure)) { clearInterval(iv); clearInterval(kapan); } }, 500);
  }
  /* bolgeNo: tek bölgenin çantası; yoksa hepsi */
  T.aletCantasi = function (bolgeNo) {
    const kap = h("div.sb-card.alet-kap"); let duzen = false;
    function ciz() {
      const A = aletler(), idler = bolgeNo == null ? BOLGE.map((_, i) => i) : [bolgeNo];
      kap.replaceChildren(h("div.row", h("h3", { style: { margin: 0 } }, "Duygusal alet çantam"), h("div.spacer"), h("button.btn.sm" + (duzen ? "" : ".c-chalk"), { onclick: () => { duzen = !duzen; ciz(); } }, T.icon(duzen ? "check" : "pen"), duzen ? "Tamam" : "Düzenle")),
        h("div.alet-sutun" + (idler.length === 1 ? ".tek" : ""), idler.map((i) => { const [ad, , renk] = BOLGE[i];
          const giris = h("input.in", { placeholder: "Yeni yol ekle", onkeydown: (e) => { if (e.key === "Enter") ekle(); } });
          const ekle = () => { const t = giris.value.trim(); if (!t) return; yaz("alet", (o) => { o = o || {}; const l = A[i].slice(); if (!l.includes(t)) l.push(t); o[i] = l; return o; }); ciz(); };
          return h("div.alet-bolge", { style: { "--c": renk } }, idler.length > 1 ? h("b", ad) : null,
            h("div.alet-kartlar", A[i].map((x) => h("div.alet-kart", h("button", { onclick: () => !duzen && aletUygula(x, renk) }, x),
              duzen ? h("button.alet-sil", { "aria-label": x + " sil", onclick: () => { yaz("alet", (o) => { o = o || {}; o[i] = A[i].filter((y) => y !== x); return o; }); ciz(); } }, "×") : null))),
            duzen ? h("div.row", giris, h("button.btn.sm", { onclick: ekle }, T.icon("plus"), "Ekle")) : null);
        })),
        duzen ? h("button.btn.sm.c-chalk", { onclick: () => { yaz("alet", () => null); ciz(); } }, T.icon("reset"), "Başlangıç listesine dön") : h("p.hint", { style: { margin: 0 } }, "Bir yola dokun, birlikte uygulayın. Sınıf kendi yollarını Düzenle ile ekleyebilir."));
    }
    ciz(); return kap;
  };
  T.BOLGE = BOLGE;

  tool("bolgeler", {
    title: "Düzenleme bölgeleri", icon: "heart", tone: "leaf", short: "Hangi bölgedeyim? Duygusal alet çantam",
    render(host) {
      duzeyPanosu(host, { anahtar: "bolge", gosterAd: "Bölgeyi göster", okAd: "Buradayım",
        duzeyler: BOLGE.map(([a, b, c]) => [a, b, c, () => { const s = S("svg", { viewBox: "0 0 40 40", width: 44, height: 44 }); s.innerHTML = `<circle cx="20" cy="20" r="17" fill="${c}"/>`; return s; }]),
        alt: (i) => h("div", { style: { marginTop: "14px" } }, T.aletCantasi(i == null ? null : i)) });
      host.append(h("p.hint", "Bölgeler iyi ya da kötü değildir; hepimiz gün içinde bölgeler arasında geziniriz. Amaç, hangi bölgede olduğunu fark etmek ve alet çantasından bir araç seçmek."));
    },
  });

  /* =================== 2. EVET-HAYIR AKIŞI =================== */
  function akis(host, def) {
    let i = 0, sonuc = null, gecmis = [];
    const box = h("div"); host.append(box);
    function ciz() {
      const adimlar = def.adimlar;
      const yan = h("div.ak-steps", adimlar.map((a, j) => h("div.ak-step" + (j < i ? ".done" : j === i && !sonuc ? ".on" : ""), { style: { "--c": a.renk || "var(--navy)" } }, h("span.n", a.no || j + 1), h("div", h("b", a.baslik), h("small", a.soru)))),
        def.son ? h("div.ak-step" + (sonuc === "son" ? ".on" : ""), { style: { "--c": def.son.renk || "var(--navy)" } }, h("span.n", T.icon("check")), h("div", h("b", def.son.baslik), h("small", def.son.metin))) : null);
      let merkez;
      if (sonuc === "son") merkez = h("div.ak-card.son", def.son.ikon ? def.son.ikon() : null, h("h3", def.son.baslik), h("p", def.son.metin), h("button.btn", { onclick: () => { i = 0; sonuc = null; ciz(); } }, T.icon("reset"), "Baştan"));
      else if (sonuc) merkez = h("div.ak-card.hayir", h("h3", sonuc.baslik || "Önce bunu yap"), h("p", sonuc.metin), h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => { sonuc = null; ciz(); } }, T.icon("back"), "Yaptım, soruya dön"), def.hayirBaslat ? h("button.btn.c-chalk", { onclick: () => { i = 0; sonuc = null; ciz(); } }, "Baştan") : null), def.kova ? def.kova() : null);
      else {
        const a = adimlar[i];
        merkez = h("div.ak-card", { style: { "--c": a.renk || "var(--navy)" } }, h("small.ak-lbl", a.baslik), h("h3", a.soru), a.not ? h("p.hint", a.not) : null,
          h("div.row", { style: { justifyContent: "center", gap: "14px" } },
            h("button.btn.big.ak-evet", { onclick: () => { T.sound.ok(); if (i + 1 < adimlar.length) i++; else sonuc = "son"; ciz(); } }, T.icon("check"), a.evet || "Evet"),
            h("button.btn.big.ak-hayir", { onclick: () => { sonuc = a.hayir; if (def.onHayir) def.onHayir(a); ciz(); } }, T.icon("close"), a.hayirAd || "Hayır")),
          h("button.btn.sm.c-chalk", { onclick: () => T.speak(a.soru) }, T.icon("speaker"), "Dinle"));
      }
      box.replaceChildren(def.ust ? def.ust() : null, h("div.ak-wrap", yan, merkez));
    }
    ciz();
  }

  tool("uc-adim", {
    title: "Öğretmene sormadan önce 3 adım", icon: "teacher", tone: "sky", short: "Beyin, etraf, arkadaş, sonra öğretmen",
    render(host) {
      akis(host, { ust: () => h("p.sb-line", "Amacımız: Seni bağımsızlaştırmak!"), adimlar: [
        { baslik: "Adım 1: Beyin", soru: "Kendine sordun mu? Yönergeyi okudun mu?", renk: "#D16BA5", hayir: { metin: "Yönergeyi bir kez daha oku ve kendine sor: Benden ne isteniyor?" } },
        { baslik: "Adım 2: Etraf", soru: "Panoya, tahtaya, kitaba baktın mı?", renk: "#E0B020", hayir: { metin: "Panoya, tahtaya ve kitabına bak. İpucu çoğu zaman oradadır." } },
        { baslik: "Adım 3: Arkadaş", soru: "Yanındaki arkadaşına fısıldayarak sordun mu?", renk: "#3C8DD8", hayir: { metin: "Yanındaki arkadaşına fısıldayarak sor." } }],
        son: { baslik: "Son durak: Öğretmen", metin: "Bunların hepsi evet ise bana gel!", renk: "#C2453A" } });
    },
  });
  tool("takildim", {
    title: "Takıldım, ne yapmalıyım?", icon: "help", tone: "sun", short: "Görevi anlamadığında adım adım yol",
    render(host) {
      akis(host, { ust: () => h("p.sb-line", "Başlangıç: \"Görevi anlamadım ya da ilerleyemiyorum.\""), adimlar: [
        { baslik: "Adım 1", soru: "Yönergeyi ya da soruyu içinden bir kez daha fısıldayarak okudun mu?", renk: "#2E8B57", hayir: { metin: "Yönergeye dön ve anahtar kelimelerin altını çiz." } },
        { baslik: "Adım 2", soru: "Masandaki ya da çevrendeki iki farklı arkadaşının nasıl başladığına baktın mı?", renk: "#E0B020", hayir: { metin: "Sessizce gözlem yap." } },
        { baslik: "Adım 3", soru: "Panodaki örnek çalışma modelini inceledin mi?", renk: "#7A5BC7", hayir: { metin: "Modeli incele ve kendi çalışmanla karşılaştır." } }],
        son: { baslik: "Sarı yardım kartı", metin: "Masana sarı yardım kartını koy ve öğretmen gelene kadar yapabildiğin diğer adıma geç.", renk: "#E9A23B", ikon: () => kart("#E9A23B", "?") } });
    },
  });
  tool("zihin-suzgeci", {
    title: "Zihin süzgeci", icon: "filter", tone: "sky", short: "Süzmeden söyleme: doğru mu, sırası mı, nazik mi?",
    render(host) {
      const kova = [];
      const inp = h("input.in", { placeholder: "Söylemek istediğin cümle (isteğe bağlı)", style: { fontSize: "20px" } });
      akis(host, {
        ust: () => h("div.row", { style: { marginBottom: "10px" } }, inp),
        adimlar: [
          { baslik: "1. süzgeç", soru: "Bu doğru mu?", renk: "#3C6FB5", hayir: { baslik: "Zihin kovasına", metin: "Doğru değilse bu sözcükler zihin kovasında bekler. Yeniden düşün." } },
          { baslik: "2. süzgeç", soru: "Şu an sırası mı? Acil mi?", not: "Söz kesiyor mu? Konu dışı mı? Acil değilse bekle.", renk: "#E0B020", hayir: { baslik: "Zihin kovasına", metin: "Sırası değilse ya da acil değilse bekle. Sözcüklerin zihin kovasında seni bekliyor." } },
          { baslik: "3. süzgeç", soru: "Nezaket kurallarına uygun mu?", not: "Birini üzer mi?", renk: "#D16BA5", hayir: { baslik: "Zihin kovasına", metin: "Nazik değilse daha nazik bir söyleyiş bul. Ne söylersen arkadaşın üzülmez?" } }],
        son: { baslik: "Sözcükler temizlendi!", metin: "Şimdi konuşabilirsin.", renk: "#2E8B57" },
        onHayir: () => { if (inp.value.trim()) { kova.push(inp.value.trim()); inp.value = ""; } },
        kova: () => kova.length ? h("div.zs-kova", h("b", "Zihin kovası: düşünce bekleme alanı"), kova.map((x) => h("div.dy-bubble", x))) : null,
      });
    },
  });

  /* Gelecek teleskobu: 10 dakika sonra ne olur? */
  const TELESKOP = [
    ["Teneffüste top oynarken arkadaşım topu bana vermedi.", "Topu elinden çekip alırsam", "Kavga çıkar, ikimiz de oyundan oluruz.", "Sıranın bende olduğunu söylersem", "Oyun devam eder, sıram gelince oynarım."],
    ["Ders sırasında aklıma çok komik bir şey geldi.", "Hemen yüksek sesle söylersem", "Ders bölünür, arkadaşlarım konuyu kaçırır.", "Teneffüse kadar aklımda tutarsam", "Teneffüste anlatırım, birlikte güleriz."],
    ["Ödevim çok zor geldi.", "Defterimi kapatıp bırakırsam", "Ödev yarım kalır, yarın daha da zorlanırım.", "Takıldım adımlarını uygularsam", "Bir yerden başlarım, yardım isterim, bitiririm."],
    ["Arkadaşım resmime yanlışlıkla su döktü.", "Ona bağırırsam", "Arkadaşım üzülür, resmim yine ıslak kalır.", "Derin nefes alıp ne yapabileceğimizi sorarsam", "Birlikte kurularız, belki yeni bir resim yaparız."],
    ["Sırada biri önüme geçti.", "Onu itersem", "Biri düşebilir, ikimiz de üzülürüz.", "Sıranın bende olduğunu sakince söylersem", "Arkadaşım fark eder, yerime geçerim."],
    ["Oyunu kaybettim.", "Oyunu bozup gidersem", "Kimse benimle oynamak istemez.", "Tebrik edip yeniden oynamak istersem", "Yeni bir oyun başlar, belki bu sefer ben kazanırım."],
    ["Grup çalışmasında fikrim seçilmedi.", "Küsüp çalışmazsam", "Grup zorlanır, ben de bir şey öğrenemem.", "Seçilen fikre kendi fikrimden bir parça eklersem", "Çalışma daha güzel olur, katkım görünür."],
    ["Arkadaşım kalemimi sormadan aldı.", "Elinden kapıp kızarsam", "Kalem kırılabilir, aramız bozulur.", "Kalemime ihtiyacım olduğunu söylersem", "Kalemimi geri verir, belki bir dahaki sefer sorar."],
    ["Öğretmen bir soru sordu, cevabı bilmiyorum.", "Bildiğimi söyleyip uydurursam", "Yanlış öğrenirim, sonra utanırım.", "Bilmiyorum ama düşünmek istiyorum dersem", "Öğretmen ipucu verir, birlikte buluruz."],
    ["Çok sinirlendim, kalbim hızlı atıyor.", "Hemen bağırırsam", "Söylediğime pişman olabilirim.", "Sakinleşme köşesine gidersem", "Birkaç dakika sonra ne istediğimi daha iyi anlatırım."],
    ["Yeni bir arkadaş sınıfa geldi, yalnız oturuyor.", "Onu görmezden gelirsem", "Arkadaşım kendini yalnız hisseder.", "Yanına gidip adını sorarsam", "Yeni bir arkadaşım olur, o da mutlu olur."],
    ["Bir yanlış yaptım ve arkadaşım üzüldü.", "Hiçbir şey olmamış gibi davranırsam", "Arkadaşım kırgın kalır.", "Özür dileyip ne yapabileceğimi sorarsam", "Arkadaşım rahatlar, aramız düzelir."],
    ["Teneffüs bitti ama oyunumuz yarım kaldı.", "Sınıfa girmeyip oynamaya devam edersem", "Derse geç kalırım, uyarı alırım.", "Bir sonraki teneffüste devam etmeyi önerirsem", "Derse zamanında girerim, oyun da bekler."],
    ["Bir arkadaşım beni oyuna almadı.", "Oyunlarını bozarsam", "Kimse eğlenemez, ben de alınmam.", "Katılabilir miyim diye sorar ya da başka bir oyun kurarsam", "Belki beni alırlar ya da yeni bir oyun başlar."],
    ["Yemekte sevmediğim bir yemek çıktı.", "Tabağı itip somurtursam", "Aç kalırım, masadakiler de rahatsız olur.", "Bir lokma tadıp kibarca söylersem", "Belki sevdiğim bir şey bulurum, kimse kırılmaz."],
    ["Arkadaşım benimle alay etti.", "Ben de onunla alay edersem", "Kavga büyür, ikimiz de üzülürüz.", "Bundan hoşlanmadığımı açıkça söylersem", "Arkadaşım ne hissettiğimi anlar, durur."],
    ["Defterimi evde unuttum.", "Saklayıp hiçbir şey söylemezsem", "Derste ne yapacağımı bilemem.", "Öğretmenime dürüstçe söylersem", "Bir çözüm buluruz, yarın getiririm."],
    ["Bir yarışmada ikinci oldum.", "Ödülümü atıp ağlarsam", "Emeğimi kendim küçültmüş olurum.", "Kazananı tebrik edip neyi geliştireceğimi düşünürsem", "Gururlanırım, bir dahakine daha hazır olurum."],
    ["Arkadaşım oyuncağımı bozdu.", "Onun oyuncağını da bozarsam", "İki oyuncak birden bozulur.", "Birlikte tamir etmeyi denersem", "Belki düzelir, birlikte oynarız."],
    ["Uzun bir sırayı beklemem gerekiyor.", "Sürekli itip kakarsam", "Sıra karışır, herkes daha çok bekler.", "Beklerken aklımdan bir oyun oynarsam", "Zaman çabuk geçer, sıram gelir."],
  ];
  const tum = (anahtar, taban) => taban.concat((veri(anahtar) || []).map((x) => x.v));
  /* Deste: maddeler karıştırılır, hepsi bitmeden tekrar gelmez */
  const deste = {};
  const desteCek = (ad, liste) => { const d = (deste[ad] = deste[ad] && deste[ad].length ? deste[ad] : T.shuffle(liste.map((_, i) => i))); return liste[d.pop()]; };
  function ekleFormu(baslik, alanlar, kaydet) {
    const inp = alanlar.map(([ad, yer]) => h("input.in", { placeholder: yer, "aria-label": ad }));
    T.modal({ title: baslik, body: h("div", { style: { display: "grid", gap: "10px" } }, inp, h("p.hint", "Eklenen durumlar bu sınıfın listesine girer. Çocuklar da önerebilir.")), actions: [{ label: "Vazgeç" }, { label: "Ekle", tone: "c-leaf", onClick: () => { const v = inp.map((x) => x.value.trim()); if (v.some((x) => !x)) { T.toast("Bütün kutuları doldurun"); return false; } kaydet(v); T.sound.pop(); } }] });
  }
  tool("gelecek-teleskobu", {
    title: "Gelecek teleskobu", icon: "telescope", tone: "grape", short: "Bunu yaparsam 10 dakika sonra ne olur?",
    render(host) {
      let cur = null, acik = {}, kendi = false;
      const box = h("div"); host.append(box);
      const yeni = () => { const L = tum("teleskop", TELESKOP); cur = desteCek("tel", L); acik = {}; kendi = false; };
      function ciz() {
        const [d, a1, s1, a2, s2] = cur;
        const yol = (k, a, s, kotu) => h("button.gt-yol" + (kotu ? ".kotu" : ".iyi") + (acik[k] ? ".open" : ""), { onclick: () => { acik[k] = true; T.speak(s); ciz(); } }, h("small", "Bunu yaparsam"), h("b", a), acik[k] ? h("div.gt-sonuc", h("small", "10 dakika sonra"), s) : h("span.hint", "Teleskoptan bak"));
        box.replaceChildren(h("div.dy-card", { style: { maxWidth: "1100px" } }, h("small.ak-lbl", "Gelecek teleskobu: 10 dakika sonrası"), h("div.dy-durum", d),
          kendi ? h("p.sb-line", "Sizce iki farklı davranış ne olabilir? 10 dakika sonra ne olur? Önce sınıf tahmin etsin, sonra teleskoba bakın.") : null,
          h("div.gt-yollar", yol("a", a1, s1, true), yol("b", a2, s2, false)),
          h("p.sb-line", "Bunu yaparsam 10 dakika sonra ne olur? Davranışımdan sonra ne olur?"),
          h("div.row", { style: { justifyContent: "center" } },
            h("button.btn", { onclick: () => { yeni(); ciz(); } }, T.icon("next"), "Yeni durum"),
            h("button.btn.c-chalk", { onclick: () => { acik = {}; kendi = true; ciz(); } }, T.icon("help"), "Önce biz tahmin edelim"),
            h("button.btn.c-chalk", { onclick: () => ekleFormu("Sınıfımızdan bir durum ekle", [["Durum", "Ne oldu? (ör. Arkadaşım sırama oturdu.)"], ["1. davranış", "Bunu yaparsam... (zorlayan davranış)"], ["1. sonuç", "10 dakika sonra ne olur?"], ["2. davranış", "Bunu yaparsam... (yardımcı davranış)"], ["2. sonuç", "10 dakika sonra ne olur?"]], (v) => { yaz("teleskop", (o) => (o || []).concat({ v })); cur = v; acik = {}; ciz(); }) }, T.icon("plus"), "Durum ekle")),
          h("p.hint", TELESKOP.length + " hazır durum ve sınıfın eklediği " + (veri("teleskop") || []).length + " durum sırayla gelir; hepsi bitmeden aynısı tekrar gelmez.")));
      }
      yeni(); ciz();
    },
  });

  /* Beynim: el modeli ve pedallar */
  tool("beynim", {
    title: "Beynimi tanıyorum", icon: "brain", tone: "pink", short: "Beynin el modeli, duygu ve mantık pedalları",
    render(host) {
      let mod = "el", kapak = false;
      const box = h("div"); host.append(box);
      function elSvg(acik) {
        const s = S("svg", { viewBox: "0 0 220 260", width: 220, height: 260 });
        s.innerHTML = acik
          ? '<rect x="70" y="150" width="80" height="100" rx="20" fill="#F0C9A0" stroke="#B9875A" stroke-width="3"/><g fill="#F0C9A0" stroke="#B9875A" stroke-width="3"><rect x="62" y="40" width="22" height="120" rx="11"/><rect x="88" y="22" width="22" height="135" rx="11"/><rect x="114" y="26" width="22" height="130" rx="11"/><rect x="140" y="44" width="22" height="115" rx="11"/></g><circle cx="110" cy="175" r="28" fill="#E25B4B" opacity=".75"/><rect x="96" y="150" width="20" height="44" rx="10" fill="#F0C9A0" stroke="#B9875A" stroke-width="3"/>'
          : '<rect x="70" y="150" width="80" height="100" rx="20" fill="#F0C9A0" stroke="#B9875A" stroke-width="3"/><path d="M58 150q0-60 52-62q52 2 52 62z" fill="#F0C9A0" stroke="#B9875A" stroke-width="3"/><path d="M70 120h80M70 135h80" stroke="#B9875A" stroke-width="2"/><rect x="86" y="120" width="18" height="40" rx="9" fill="#E6B38A" stroke="#B9875A" stroke-width="2"/>';
        return s;
      }
      function ciz() {
        let ic;
        if (mod === "el") ic = h("div.bn-grid",
          h("div.sb-card.bn-el", elSvg(kapak), h("button.btn.big", { onclick: () => { kapak = !kapak; ciz(); } }, kapak ? "Kapağı kapat" : "Kapağı kaldır")),
          h("div.sb-card", kapak
            ? [h("h3", "Kapak kalktı: mantık devre dışı"), h("p.sb-line", "Dört parmak kalktı. Ön beyin, yani düşünen beyin, devreden çıktı. Başparmak açıkta: alarm merkezi direksiyonda. Sadece panik hâlindeki duygu konuşuyor."), h("p.sb-line", h("b", "Altın kural: "), "Kapak kalkmışken açıklama yapma. Önce kapağın kapanmasına yardım et, dersi sonra ver.")]
            : [h("h3", "Her şey yolunda: kapalı el"), h("p.sb-line", "Dört parmak ön beyindir: mantıklı, düşünen beyin. İçteki başparmak duygusal beyindir, alarm merkezi. Bilek beyin sapına giden yoldur."), h("p.sb-line", "Mantıklı beyin duyguyu kucaklar. Çocuk sakindir, öğrenmeye açıktır.")],
            h("div.bn-tetik", h("b", "Kapak neden kalkar?"), h("ul", h("li", "Fiziksel: açlık, yorgunluk"), h("li", "Aile ve ev içi: gerginlik, tartışma, güvensizlik"), h("li", "Duygusal: utanma, dışlanma, hayal kırıklığı"), h("li", "Çevresel: gürültü, belirsizlik")))));
        else ic = h("div.bn-grid",
          h("div.sb-card.bn-pedal", h("div.bn-p.fren", h("b", "Fren"), "Düşünce, dur"), h("div.bn-p.gaz", h("b", "Gaz"), "Duygular pedalı")),
          h("div.sb-card", h("h3", "Beynimizin pedalları: duygu ve mantık"), h("p.sb-line", "Beyin arabamızın bir gaz pedalı var: duygularımız. Bir de fren pedalı: düşünce. Sınıf kurallarının virajına gelirken ikisini birlikte kullanırız."), h("div.dy-bubble", "Şu an çok hızlı gidiyorsun ve virajı alamayabilirsin. Lütfen biraz ön beyin frenine bas."), h("p.hint", "Nasihat yerine bu dili kullanmak, çocuğa dışarıdan kontrol yerine kendi frenini fark etmeyi öğretir.")));
        box.replaceChildren(seg([["el", "Beynin el modeli"], ["pedal", "Pedallar"]], mod, (v) => { mod = v; ciz(); }), h("div", { style: { marginTop: "14px" } }, ic));
      }
      ciz();
    },
  });

  /* =================== 3. AYIRMA OYUNLARI =================== */
  function ayir(host, def) {
    /* durumlar destelenir: hepsi bitmeden tekrar gelmez. Sınıf kendi durumunu ekleyebilir (def.anahtar).
       def.serbest: doğru cevap yok, sınıf birlikte karar verir; karar kaydedilir. */
    const liste = () => def.durumlar.concat(def.anahtar ? (veri(def.anahtar) || []).map((x) => [x.t, x.k]) : []);
    let sira = [], cur = null, secim = null;
    const sonraki = () => { if (!sira.length) sira = T.shuffle(liste().slice()); cur = sira.pop(); secim = null; };
    const box = h("div"); host.append(box);
    const kararlar = () => (def.serbest ? veri(def.anahtar + "-karar") || {} : {});
    function ciz() {
      const [t, dogru] = cur;
      const kutu = (k) => def.kutular.find((x) => x[0] === k);
      const once = kararlar()[t];
      const sonucKutu = def.serbest ? secim : dogru;
      box.replaceChildren(
        def.ust ? def.ust() : null,
        h("div.dy-card", { style: { maxWidth: "1100px" } },
          h("div.dy-durum", t),
          def.serbest && once && !secim ? h("p.hint", "Geçen sefer sınıfımız buna " + kutu(once)[1].toLocaleLowerCase("tr") + " demişti. Bugün de aynı mı düşünüyoruz?") : null,
          h("div.ay-kutular", def.kutular.map(([k, ad, renk, ikon, aciklama]) => h("button.ay-kutu" + (secim ? (def.serbest ? (k === secim ? ".right" : "") : k === dogru ? ".right" : k === secim ? ".wrong" : "") : ""), { style: { "--c": renk }, onclick: () => {
            if (secim && !def.serbest) return; secim = k;
            if (def.serbest) { T.sound.pop(); yaz(def.anahtar + "-karar", (o) => Object.assign(o || {}, { [t]: k })); } else k === dogru ? T.sound.ok() : T.sound.no();
            ciz(); } }, ikon ? ikon() : null, h("b", ad), aciklama ? h("span", aciklama) : null))),
          secim ? h("div.ay-sonuc", { style: { "--c": kutu(sonucKutu)[2] } }, def.sonuc(kutu(sonucKutu))) : null,
          secim && def.serbest ? h("p.sb-line", "Herkes aynı büyüklükte görmeyebilir. Farklı düşünen var mı? Neden?") : null,
          h("div.row", { style: { justifyContent: "center" } },
            h("button.btn.c-chalk", { onclick: () => T.speak(t) }, T.icon("speaker"), "Dinle"),
            h("button.btn", { onclick: () => { sonraki(); ciz(); } }, T.icon("next"), "Sıradaki durum"),
            def.anahtar ? h("button.btn.c-chalk", { onclick: () => durumEkle() }, T.icon("plus"), "Durum ekle") : null)),
        def.anahtar && (veri(def.anahtar) || []).length ? h("details.ks-diger", h("summary", "Sınıfımızın eklediği durumlar (" + veri(def.anahtar).length + ")"), h("div", { style: { display: "grid", gap: "6px" } }, veri(def.anahtar).map((x) => h("div.row", h("span", { style: { flex: 1 } }, x.t + (def.serbest ? "" : " · " + kutu(x.k)[1])), h("button.btn.sm.c-chalk", { "aria-label": "Sil", onclick: () => { yaz(def.anahtar, (o) => (o || []).filter((y) => y.t !== x.t)); sira = sira.filter((y) => y[0] !== x.t); ciz(); } }, T.icon("close")))))) : null);
    }
    function durumEkle() {
      const inp = h("input.in", { placeholder: "Durum (ör. Arkadaşım sıramı aldı.)" });
      let k = def.serbest ? null : def.kutular[0][0];
      const sec = def.serbest ? null : h("div.seg", def.kutular.map(([kk, ad]) => h("button", { "aria-pressed": String(kk === k), onclick: (e) => { k = kk; [...e.target.parentNode.children].forEach((b2) => b2.setAttribute("aria-pressed", String(b2 === e.target))); } }, ad)));
      T.modal({ title: "Sınıfımızdan bir durum ekle", body: h("div", { style: { display: "grid", gap: "10px" } }, inp, sec, h("p.hint", def.serbest ? "Büyüklüğüne sınıf, durum ekrana gelince birlikte karar verir." : "Bu durumun hangi kutuya girdiğini seçin.")), actions: [{ label: "Vazgeç" }, { label: "Ekle", tone: "c-leaf", onClick: () => { const v = inp.value.trim(); if (!v) return false; yaz(def.anahtar, (o) => (o || []).concat({ t: v, k })); cur = [v, k]; secim = null; T.sound.pop(); ciz(); } }] });
    }
    sonraki(); ciz();
  }

  /* Problem kalibrasyonu (eski "Sorunum ne büyüklükte?" aracının yerine) */
  const KALIB = [
    ["kucuk", "Küçük problem", "#6DAF5A", () => hava("gunes"), "Bence bu küçük bir problem. Kendimiz çözebiliriz.", ["Derin nefes alırım.", "Kibarca söylerim: Lütfen ...", "Sırayla yapmayı öneririm.", "Görmezden gelir, başka bir şeye geçerim."]],
    ["orta", "Orta problem", "#8E9BB4", () => hava("bulut"), "Bu konuda biriyle konuşmamız gerekiyor mu? Kendimiz çözebilir miyiz? Birlikte karar verelim.", ["Problem çözme basamağına git: Barış yolu.", "Ben diliyle ne olduğunu anlat.", "Olmadıysa biraz soğusun köşesine not bırak."]],
    ["buyuk", "Büyük problem", "#C2453A", () => hava("firtina"), "Denedik olmadı, sorun devam ediyor. Şiddet içeren sorunlar var. Tehlikedeyim.", ["Öğretmenden yardım al.", "Biri yaralandıysa hemen bir yetişkine söyle.", "Güvenli bir yerde bekle."]],
  ];
  const KALIB_DURUM = [["Suluk kapağım açılmıyor.", "kucuk"], ["Sırama biri oturmuş.", "kucuk"], ["Boyam bitti.", "kucuk"], ["Arkadaşım benden önce bitirdi.", "kucuk"], ["Oyunda ebe oldum.", "kucuk"], ["Ayakkabımın bağı çözüldü.", "kucuk"], ["İstediğim renk kalem başkasında.", "kucuk"], ["Yanımdaki arkadaş çok gürültü yapıyor.", "orta"], ["Arkadaşım sözünü tutmadı.", "orta"], ["Oyunda kurallara uyulmuyor.", "orta"], ["Grupta herkes işi bana bıraktı.", "orta"], ["Arkadaşım beni bir oyundan çıkardı.", "orta"], ["Biri eşyamı izinsiz aldı ve vermiyor.", "orta"], ["Kendimi çok kötü hissediyorum ve geçmiyor.", "buyuk"], ["Biri beni tehdit etti.", "buyuk"], ["Teneffüste biri kavga ediyor.", "buyuk"], ["Kalemimin ucu kırıldı.", "kucuk"], ["Oyunda ilk sırayı başkası aldı.", "kucuk"], ["Arkadaşım bana yanlışlıkla çarptı.", "kucuk"], ["Silgimi bulamıyorum.", "kucuk"], ["En sevdiğim oyunu oynayamadık.", "kucuk"],
    ["Arkadaşım oyuna beni almadı.", "orta"], ["Arkadaşım sırrımı başkalarına anlattı.", "orta"], ["Grupta herkes benim fikrimi dinlemiyor.", "orta"], ["İki gündür aynı arkadaşla tartışıyoruz.", "orta"],
    ["Biri her gün benimle alay ediyor, konuştuk ama durmadı.", "buyuk"], ["Bahçede bir arkadaşım düştü, dizi kanıyor.", "buyuk"], ["Bir arkadaşım beni itip vurdu.", "buyuk"], ["Okulda bir yabancı beni yanına çağırdı.", "buyuk"]];
  tool("sorun-boyutu", {
    title: "Problem kalibrasyonu", icon: "scale", tone: "sun", short: "Küçük mü, orta mı, büyük mü? Birlikte karar verelim",
    render(host) {
      let mod = "pano";
      const box = h("div"); host.append(box);
      function ciz() {
        box.replaceChildren(seg([["pano", "Pano"], ["oyun", "Birlikte karar verelim"]], mod, (v) => { mod = v; ciz(); }));
        const alan = h("div", { style: { marginTop: "14px" } }); box.append(alan);
        if (mod === "pano") alan.append(h("div.pk-pano", KALIB.map(([, ad, renk, ikon, metin, ne]) => h("div.pk-col", { style: { "--c": renk } }, ikon(), h("b", ad), h("p", metin), h("ul", ne.map((x) => h("li", x)))))), h("p.hint", "Sınıf içi çatışmada öğrenciler problemin büyüklüğüne birlikte karar verir. Aynı sorun herkese aynı büyüklükte gelmeyebilir; önemli olan tepkinin uygun olması."));
        else ayir(alan, { durumlar: KALIB_DURUM, anahtar: "kalib", serbest: true, ust: () => h("p.sb-line", "Doğru tek cevap yok. Durumu okuyun, problemin büyüklüğüne sınıfça karar verin."), kutular: KALIB.map(([k, ad, renk, ikon]) => [k, ad, renk, ikon]), sonuc: (b) => { const k = KALIB.find((x) => x[0] === b[0]); return [h("b", k[1] + ": "), k[4], h("ul", k[5].map((x) => h("li", x)))]; } });
      }
      ciz();
    },
  });

  tool("seninle-mi", {
    title: "Seninle mi ilgili?", icon: "help", tone: "leaf", short: "Şikâyet mi, bilgilendirme mi?",
    render(host) {
      ayir(host, {
        ust: () => h("p.sb-line", "Söylemeden önce sor: Bu seninle mi ilgili? Amacım korumak ya da kurtarmak mı?"),
        anahtar: "seninle",
        durumlar: [["Arkadaşım kalemini sıranın altına düşürdü.", "sikayet"], ["Okul kapısı açık kalmış, küçük kardeşler dışarı çıkıyor.", "bilgi"], ["Ece sırasını toplamamış.", "sikayet"], ["Bir arkadaş makasla oynuyor ve birini kesebilir.", "bilgi"], ["Kerem yanlış renkte kalem kullanıyor.", "sikayet"], ["Bir arkadaşım nefes almakta zorlanıyor.", "bilgi"], ["Selin şarkı mırıldanıyor.", "sikayet"], ["Bahçe kapısında tanımadığım biri çocukları çağırıyor.", "bilgi"], ["Arda benden daha büyük bir dilim aldı.", "sikayet"], ["Lavaboda yerler ıslak, biri kayabilir.", "bilgi"], ["Efe sırasında sallanıyor.", "sikayet"], ["Bir arkadaş kendini kapalı bir yere kilitlemiş.", "bilgi"], ["Asya oyunda hile yaptı ama kimse zarar görmedi.", "sikayet"], ["Prizden kıvılcım çıkıyor.", "bilgi"], ["Ahmet ödevini yapmamış.", "sikayet"], ["Ahmet düşmek üzere!", "bilgi"], ["Elif kalemini yere düşürdü.", "sikayet"], ["Bahçede kırık cam var.", "bilgi"], ["Can sırada konuşuyor.", "sikayet"], ["Bir arkadaş ağlıyor ve yardım istiyor.", "bilgi"],
          ["Mert yemeğini bitirmedi.", "sikayet"], ["Biri merdivenlerden düştü.", "bilgi"], ["Defne benden önce bitirdi.", "sikayet"], ["Biri bir arkadaşımıza her gün vuruyor.", "bilgi"], ["Zeynep resmini başka renge boyamış.", "sikayet"], ["Lavaboda su taşıyor.", "bilgi"]],
        kutular: [["sikayet", "Seninle ilgili değil", "#C2453A", null, "Şikâyet etme"], ["bilgi", "Bilgilendirme", "#2E8B57", null, "Rapor et"]],
        sonuc: (b) => b[0] === "sikayet" ? [h("b", "Seninle ilgili değil. "), "Kural: Kendine sakla. Kimse tehlikede değil; bunu söylemek kimseye yardım etmez."] : [h("b", "Bilgilendirme. "), "Amaç: korumak ya da kurtarmak. Biri yaralanabilir. Kural: Hemen söyle!"],
      });
    },
  });

  /* =================== 4. BARIŞ YOLU (çatışma çözüm köşesi) =================== */
  tool("catisma", {
    title: "Barış yolu", icon: "hands", tone: "sky", short: "İki arkadaş adım adım uzlaşır, el sıkışır",
    render(host, api) {
      let adim = 0, a = null, b = null, sayac = 10, t = null, secilen = {};
      const sahneKap = h("div.by-sahne"), box = h("div"); host.append(sahneKap, box);
      T.onLeave(() => clearInterval(t));
      const ADIM = [
        ["Dur ve nefes al", "Önce ikiniz de durun. 10 saniye bekleyip nefes alalım."],
        ["Ne oldu?", "Sırayla anlatın. Konuşan konuşurken diğeri sözünü kesmez.", ["Olan şuydu: ...", "Sen ... yaptığında ben ..."]],
        ["Ben ne hissettim?", "Kendine bak, duygunu adlandır.", ["Ben ... olunca ... hissettim."], "duygu"],
        ["Neye ihtiyacım var?", "İhtiyacını söyle.", ["Benim ihtiyacım ..."], ["sıramı beklemek", "oyuna katılmak", "eşyama sorulmadan dokunulmaması", "biraz yalnız kalmak", "dinlenmek", "bir özür"]],
        ["Bunu yapabilir misin?", "Arkadaşından bir şey iste. O da cevap versin.", ["Bir dahaki sefer ... yapabilir misin?", "Evet, yapabilirim.", "Şunu yapabilirim: ..."]],
        ["Tekrarlanırsa ne yaparız?", "Bir dahaki sefer için birlikte bir plan yapın.", ["Bir dahaki sefer ... yaparız.", "Önce durup nefes alırız, sonra konuşuruz."]],
        ["El sıkışalım", "Barış ve uzlaşma: el sıkışalım."],
      ];
      /* 3B yol: iki arkadaş yolun iki ucundan her adımda birbirine yaklaşır */
      let K = null;
      T.sahne3(sahneKap, { kamera: [0, 1.45, 5.2], bak: [0, 0.62, 0], fov: 34, env: ["#F4FBFF", "#CFE8C4", "#5F8A4E"], arka: ["#BFE3F7", "#EAF7FF"] }, api).then(async (c) => {
        if (!c) { sahneKap.remove(); return; }
        const { THREE, sahne } = c; c.r.shadowMap.enabled = true;
        sahne.add(new THREE.HemisphereLight(0xffffff, 0x88aa77, 1.4)); const gun = new THREE.DirectionalLight(0xfff2dc, 2.2); gun.position.set(3, 6, 4); gun.castShadow = true; gun.shadow.mapSize.set(1024, 1024); sahne.add(gun);
        const cim = new THREE.Mesh(new THREE.CircleGeometry(12, 48), new THREE.MeshStandardMaterial({ color: 0x8cc47a, roughness: 1 })); cim.rotation.x = -Math.PI / 2; cim.receiveShadow = true; sahne.add(cim);
        const izD = c.doku(256, 256, (x, w) => { x.fillStyle = "#EDE3D2"; x.beginPath(); x.arc(w / 2, w / 2, w / 2 - 4, 0, 7); x.fill(); x.fillStyle = "rgba(90,70,50,.35)"; const ayak = (cx, cy, r) => { x.beginPath(); x.ellipse(cx, cy, r * 0.5, r, 0, 0, 7); x.fill(); [[-0.35, -1.25], [0, -1.4], [0.35, -1.25]].forEach(([dx, dy]) => { x.beginPath(); x.arc(cx + dx * r, cy + dy * r, r * 0.16, 0, 7); x.fill(); }); }; ayak(w * 0.38, w * 0.58, 30); ayak(w * 0.62, w * 0.5, 30); });
        const taslar = ADIM.map((_, i) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.08, 40), [new THREE.MeshStandardMaterial({ color: 0xcdbfa6, roughness: 0.9 }), new THREE.MeshStandardMaterial({ map: izD, roughness: 0.9 }), new THREE.MeshStandardMaterial({ color: 0xcdbfa6 })]); m.receiveShadow = true; sahne.add(m); return m; });
        /* yol iki uçtan ortaya gelir: 0 (uç) ... 6 (orta) */
        const xAt = (i) => 3.0 - i * 0.46;
        taslar.forEach((m, i) => { m.position.set(i === 6 ? 0 : xAt(i), 0.05, 0); });
        const ayna = ADIM.slice(0, 6).map((_, i) => { const m = taslar[i].clone(); m.position.set(-xAt(i), 0.05, 0); sahne.add(m); return m; });
        const sol = await T.karakter3B(c, "erkek", { boy: 1.3 }), sag = await T.karakter3B(c, "kiz", { boy: 1.25 });
        sahne.add(sol.kok, sag.kok);
        const yer = (i) => (i >= 6 ? 0.36 : xAt(i));
        sol.kok.position.set(-yer(0), 0.1, 0); sag.kok.position.set(yer(0), 0.1, 0);
        const yonu = (k, bak) => (k.kok.rotation.y = bak);
        yonu(sol, 0.5); yonu(sag, -0.5); sol.oynat("dur"); sag.oynat("dur");
        let hedef = 0;
        c.kare = (dt) => {
          sol.guncelle(dt); sag.guncelle(dt);
          const hx = yer(hedef), yuru = (k, isaret) => { const p = k.kok.position, d = isaret * hx - p.x; if (Math.abs(d) > 0.02) { p.x += Math.sign(d) * Math.min(Math.abs(d), dt * 0.9); if (!k._yuruyor) { k._yuruyor = true; k.kok.rotation.y = d > 0 ? Math.PI / 2 : -Math.PI / 2; k.oynat("yuru"); } } else if (k._yuruyor) { k._yuruyor = false; p.x = isaret * hx; k.kok.rotation.y = hedef >= 6 ? isaret * -Math.PI / 2 : isaret * -0.5; if (hedef >= 6) k.oynat("salla", { dongu: false }).then(() => k.oynat("sevin", { dongu: false })).then(() => k.oynat("dur")); else k.oynat("dur"); } };
          yuru(sol, -1); yuru(sag, 1);
          taslar.concat(ayna).forEach((m) => { const i = taslar.includes(m) ? taslar.indexOf(m) : ayna.indexOf(m); const on = i === hedef; m.material[0].emissive = new THREE.Color(on ? 0xffd66b : 0x000000); m.material[0].emissiveIntensity = on ? 0.6 : 0; m.scale.setScalar(on ? 1.08 : 1); });
        };
        K = { git: (i) => (hedef = i) };
        K.git(adim);
      });
      function ciz() {
        clearInterval(t); K && K.git(adim);
        const st = T.store.activeClass().students;
        const secici = (cur, set, diger) => h("select.in", { onchange: (e) => { set(st.find((x) => x.id === e.target.value) || null); ciz(); } }, h("option", { value: "" }, "Seç"), st.filter((x) => !diger || x.id !== diger.id).map((x) => h("option", { value: x.id, selected: cur && cur.id === x.id ? true : null }, x.name)));
        const A = a ? a.name : "1. arkadaş", B = b ? b.name : "2. arkadaş";
        const adimlar = h("div.by-adimlar", ADIM.map(([l], i) => h("button" + (i === adim ? ".on" : i < adim ? ".done" : ""), { onclick: () => { adim = i; ciz(); } }, h("b", i + 1), h("span", l))));
        const [baslik, yon, bas, ek] = ADIM[adim];
        let ic = [h("h3", baslik), h("p.sb-line", yon)];
        if (adim === 0) {
          const big = h("div.dy-big", sayac);
          ic.push(big, h("button.btn", { onclick: () => { sayac = 10; big.textContent = sayac; clearInterval(t); t = setInterval(() => { sayac--; big.textContent = Math.max(0, sayac); if (sayac <= 0) { clearInterval(t); T.sound.ok(); } }, 1000); } }, T.icon("timer"), "10 saniye"),
            h("div.dy-pair", h("label", "Soldaki arkadaş", secici(a, (x) => (a = x), b)), h("label", "Sağdaki arkadaş", secici(b, (x) => (b = x), a))), h("p.hint", "İsim seçmek isteğe bağlı ve kaydedilmez."));
        } else if (adim < 6) {
          const kisi = (ad, yan) => {
            const anahtar = adim + ":" + yan, sec = secilen[anahtar];
            let ekEl = null;
            if (ek === "duygu") ekEl = h("div.by-cip", ["kizgin", "uzgun", "korkmus", "endiseli", "saskin"].map((k) => h("button", { "aria-pressed": String(sec === k), onclick: () => { secilen[anahtar] = sec === k ? null : k; ciz(); } }, T.yuz(k, 40))));
            else if (Array.isArray(ek)) ekEl = h("div.by-cip", ek.map((x) => h("button.yazi", { "aria-pressed": String(sec === x), onclick: () => { secilen[anahtar] = sec === x ? null : x; ciz(); } }, x)));
            return h("div.by-kisi", h("b", ad), h("div.by-bas", bas.map((x) => h("span", x))), ekEl);
          };
          ic.push(h("div.dy-ben", kisi(A, "a"), kisi(B, "b")));
        } else ic = [h("div.dy-bigicon", T.icon("hands")), h("h3", A + " ve " + B + " el sıkıştı!"), h("p.sb-line", "Şimdi nasıl hissediyorsunuz?"), h("button.btn", { onclick: () => { adim = 0; a = b = null; secilen = {}; ciz(); } }, T.icon("reset"), "Yeni çatışma")];
        box.replaceChildren(adimlar, h("div.dy-step.by-kart", ic),
          h("div.sb-nav", adim > 0 ? h("button.btn.c-chalk", { onclick: () => { adim--; ciz(); } }, T.icon("back"), "Önceki") : h("span"), adim < ADIM.length - 1 ? h("button.btn.big", { onclick: () => { adim++; ciz(); } }, ADIM[adim + 1][0], T.icon("next")) : h("span")));
      }
      ciz();
    },
  });

  /* =================== 5. YAPIŞKAN NOT PANOLARI =================== */
  const NOT_RENK = ["#FFF2A8", "#FFD3E1", "#CDEBFF", "#D8F5C8", "#FFE0B8", "#E6DAFF"];
  T.notPanosu = (host, def) => notPanosu(host, def);
  function notPanosu(host, def) {
    const k = def.anahtar;
    const box = h("div"); host.append(box);
    const notlar = () => (veri(k) || { n: [] }).n;
    function ekle(col) {
      const t = h("textarea.in", { placeholder: def.yerTutucu || "Kısa bir not", style: { minHeight: "90px", fontSize: "20px" } });
      const ek = def.alanlar ? def.alanlar.map(([ad, yer]) => h("input.in", { placeholder: yer, "aria-label": ad })) : [];
      let kim = ""; const ss = present();
      const kimSec = def.isim === false ? null : h("select.in", { onchange: (e) => (kim = e.target.value) }, h("option", { value: "" }, def.isimAd || "İsim yazma (isteğe bağlı)"), ss.map((x) => h("option", { value: x.name }, x.name)));
      T.modal({ title: (def.kolonlar[col] || [])[0] || "Not ekle", body: h("div", { style: { display: "grid", gap: "10px" } }, t, ek, kimSec), actions: [{ label: "Vazgeç" }, { label: "Ekle", tone: "c-leaf", onClick: () => { const v = t.value.trim(); if (!v) return false; yaz(k, (o) => { o = o || { n: [] }; o.n.push({ id: T.uid(), c: col, t: v, e: ek.map((x) => x.value.trim()), k: kim, r: NOT_RENK[o.n.length % NOT_RENK.length], d: T.isoDate() }); return o; }); T.sound.pop(); ciz(); } }] });
    }
    function ciz() {
      const ns = notlar();
      box.replaceChildren(
        def.ust ? def.ust() : null,
        h("div.np-pano" + (def.raf ? ".raf" : ""), { style: { "--n": def.kolonlar.length } }, def.kolonlar.map(([ad, soru, renk, ikon], ci) => h("div.np-col", { style: { "--c": renk } },
          h("div.np-head", ikon ? ikon() : null, h("div", h("b", ad), soru ? h("span", soru) : null), h("button.btn.sm.icon", { "aria-label": ad + " notu ekle", onclick: () => ekle(ci) }, T.icon("plus"))),
          h("div.np-notes", ns.filter((n) => n.c === ci).map((n) => h("div.np-note", { style: { "--r": n.r, transform: `rotate(${((n.id.charCodeAt(0) % 5) - 2) * 0.8}deg)` } },
            h("p", n.t), (n.e || []).filter(Boolean).map((x, j) => h("small", (def.alanlar[j] || [""])[0] + ": " + x)), n.k ? h("small.np-kim", n.k) : null,
            h("div.np-act",
              def.ilerlet && ci < def.kolonlar.length - 1 ? h("button", { "aria-label": "Sonraki aşamaya taşı", title: "Sonraki aşama", onclick: () => { yaz(k, (o) => { const x = o.n.find((y) => y.id === n.id); if (x) x.c++; return o; }); ciz(); } }, T.icon("next")) : null,
              h("button", { "aria-label": "Notu sil", onclick: () => { yaz(k, (o) => { o.n = o.n.filter((y) => y.id !== n.id); return o; }); ciz(); } }, T.icon("close"))))))))),
        h("div.row", { style: { marginTop: "12px" } }, ns.length ? h("button.btn.sm.c-chalk", { onclick: async () => { if (await T.confirm("Pano temizlensin mi?", "Bu sınıfın bu panodaki bütün notları silinir.", "Temizle")) { yaz(k, () => ({ n: [] })); ciz(); } } }, T.icon("reset"), "Panoyu temizle") : null, def.not ? h("span.hint", def.not) : null));
    }
    ciz();
  }

  tool("gul-diken", {
    title: "Gül, diken, tomurcuk", icon: "flower", tone: "pink", short: "Günün, haftanın ya da ünitenin analizi: dönüşümlü düşünme panosu",
    render(host) {
      const ZAMAN = { gun: ["Bugün", "Yarın"], hafta: ["Bu hafta", "Gelecek hafta"], unite: ["Bu ünitede", "Sonraki ünitede"] };
      const z = (veri("gdt-zaman") || "gun"), [bu, sonra] = ZAMAN[z];
      notPanosu(host, { anahtar: "gdt", ust: () => h("div", h("div.seg", [["gun", "Gün"], ["hafta", "Hafta"], ["unite", "Ünite"]].map(([k, ad]) => h("button", { "aria-pressed": String(k === z), onclick: () => { yaz("gdt-zaman", () => k); host.replaceChildren(); T.tools["gul-diken"].render(host); } }, ad))), h("p.sb-line", bu + " nasıl geçti? Birlikte düşünelim.")), kolonlar: [
        ["Gül", bu + " neyi iyi yaptık, neyi sevdik, neyle gurur duyduk?", "#C2453A"], ["Diken", bu + " bizi ne zorladı, ne üzdü, ne zor geldi?", "#8A6A3B"], ["Tomurcuk", sonra + " neyi merak ediyoruz, neyi geliştirmek, denemek istiyoruz?", "#2E8B57"]],
        not: "Her çocuk bir ya da üç kutuya not yazar. İsim isteğe bağlı." });
    },
  });
  tool("calma-listesi", {
    title: "Ünite çalma listemiz", icon: "music", tone: "grape", grades: [2, 8], short: "Ünite sonu yansıtma: tekrar çal, karıştır, sıradaki...",
    render(host) {
      const ik = (d) => () => { const s = S("svg", { viewBox: "0 0 48 48", width: 40, height: 40 }); s.innerHTML = `<g fill="none" stroke="#C8E64B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${d}</g>`; return s; };
      notPanosu(host, { anahtar: "calma", raf: false, ust: () => h("p.sb-line", "Ünite sonlarında, konu bitimlerinde ya da tatil çıkışlarında birlikte düşünelim."), kolonlar: [
        ["Tekrar çal", "Hangi yöntemi her ünitede yapmalıyız?", "#1B2A4A", ik('<path d="M38 18a15 15 0 0 0-27 3M10 30a15 15 0 0 0 27-3M38 9v9h-9M10 39v-9h9"/>')],
        ["Karıştır", "Hangi konuyu farklı bir şekilde denemeliyiz?", "#1B2A4A", ik('<path d="M6 14h8l20 20h8M6 34h8l20-20h8M36 8l6 6-6 6M36 28l6 6-6 6"/>')],
        ["Sıradaki", "Bizi ne heyecanlandırıyor? Merak listemizde ne var?", "#1B2A4A", ik('<path d="M8 10l20 14-20 14zM38 10v28"/>')],
        ["Sessize al", "Odaklanmayı engelleyen o gürültü nedir?", "#1B2A4A", ik('<path d="M8 18h8l10-8v28l-10-8H8zM34 18l10 12M44 18L34 30"/>')],
        ["Sesi aç", "Neyi daha fazla yapmalıyız?", "#1B2A4A", ik('<path d="M8 18h8l10-8v28l-10-8H8zM34 16a10 10 0 0 1 0 16M38 10a18 18 0 0 1 0 28"/>')]] });
    },
  });
  tool("bookflix", {
    title: "Sınıfın kitap önerileri", icon: "book", tone: "tomato", short: "Dizi platformu gibi raflar: arkadaşına kitap öner (Bookflix)",
    render(host) {
      notPanosu(host, { anahtar: "bookflix", raf: true, yerTutucu: "Kitabın adı", alanlar: [["Yazar", "Yazarı"], ["Neden?", "Neden öneriyorsun? (kısa)"]], isimAd: "Öneren (isteğe bağlı)",
        ust: () => h("div.bf-logo", "BOOKFLIX", h("small", "Sizden gelenler")),
        kolonlar: [["Çok popüler", null, "#E50914"], ["Macera sevenler için", null, "#E50914"], ["Komedi ve eğlence", null, "#E50914"], ["Yeniler ve keşfedilmeyi bekleyenler", null, "#E50914"]] });
    },
  });
  tool("favori-hatalar", {
    title: "Bizim favori hatalarımız", icon: "star", tone: "sun", short: "Hedefe atılan temel adım: H.A.T.A.",
    render(host) {
      notPanosu(host, { anahtar: "hata", isim: false, ilerlet: false, yerTutucu: "Hata neydi? (ör. 35 × 4 = 120)", alanlar: [["Doğrusu", "Doğrusu ne?"], ["Öğrendim", "Ne öğrendim? (ör. sağlama yaparım)"]],
        ust: () => h("div", h("p.sb-line", "Hata yapmak kâğıt uçağı yere çakmak gibidir. O an fikrini fırlatmak cesarettir. En iyi kâğıt uçaklar defalarca yanlış katlanıp düzeltilerek en dengeli hâline ulaşanlardır."), h("p.hint", "Bir hatayı karta yaz, doğrusunu ve ne öğrendiğinizi ekle. Kimin hatası olduğu yazılmaz; hata sınıfın ortak hazinesidir.")),
        kolonlar: [["Hata neydi?  ·  Doğrusu ne?  ·  Ne öğrendim?", null, "#3C8DD8"]] });
    },
  });
  tool("sogusun", {
    title: "Biraz soğusun", icon: "snow", tone: "sky", short: "Çatışmaları ertelemeden, görmezden gelmeden yönet",
    render(host) {
      notPanosu(host, { anahtar: "sogusun", ilerlet: true, yerTutucu: "Hatırlamak için kısacık bir not (ör. Top meselesi)", isimAd: "Kim yazdı? (isteğe bağlı)",
        ust: () => h("p.sb-line", "Çatışma anında duygular yoğundur ya da uzun dinlemeye zaman yoktur. Hemen çözmeye çalışmak yerine buraya kısa bir not bırak. Hiçbir çatışma gözden kaçmaz."),
        kolonlar: [["1. Bu çok sıcak", "Biraz soğumaya bırakalım: kısa bir not.", "#C2453A"], ["2. Kendi uzlaşma denememiz", "Bekleme sürecinde barış yolu şablonuyla konuşmayı deneyin.", "#E9A23B"], ["3. Anlamlı bir sohbet", "Öğretmenle sakin bir ortamda kısa ama derin bir sohbet.", "#3C8DD8"], ["4. Hâlâ sıcak", "Öğretmenle birlikte ileriye dönük olumlu eylemler belirleyin.", "#7A5BC7"], ["Çözüldü", "Biz konuşabiliriz!", "#2E8B57"]],
        not: "Notu sağ alttaki okla bir sonraki aşamaya taşı." });
    },
  });

  /* =================== 6. ÖĞRENME ÇUKURU =================== */
  const CUKUR = [["Atlama noktası", "Bu kolaymış.", 0.08, 0.28], ["Harika! Öğrenmenin başladığı yer", "Kafam karıştı, yapamıyorum, vazgeçeceğim.", 0.34, 0.72], ["Dip: kaos", "Harika, şu an buradasın. Demek ki öğrenmek üzeresin. Çıkmak için hangi aracı kullanacaksın?", 0.5, 0.86], ["Tırmanış", "Deniyorum, yardım alıyorum, anlıyorum.", 0.7, 0.56], ["Çıkış", "Başardım! Şimdi yeni bir çukura atlayabilirim.", 0.92, 0.26]];
  tool("ogrenme-cukuru", {
    title: "Öğrenme çukuru", icon: "pit", tone: "leaf", short: "Zorlanmak başarısızlık değildir!",
    render(host) {
      let ogr = null; const box = h("div"); host.append(box);
      function ciz() {
        const kay = (veri("cukur") || {})[T.isoDate()] || {}, ps = present();
        const W = 1000, H = 420;
        const svg = S("svg", { viewBox: `0 0 ${W} ${H}`, class: "oc-svg" });
        svg.innerHTML = `<path d="M0 ${H * 0.3} H${W * 0.2} C${W * 0.32} ${H * 0.3} ${W * 0.3} ${H * 0.92} ${W * 0.5} ${H * 0.92} C${W * 0.7} ${H * 0.92} ${W * 0.68} ${H * 0.3} ${W * 0.8} ${H * 0.3} H${W}" fill="none" stroke="#8A6A3B" stroke-width="8"/><path d="M0 ${H * 0.3} H${W * 0.2} C${W * 0.32} ${H * 0.3} ${W * 0.3} ${H * 0.92} ${W * 0.5} ${H * 0.92} C${W * 0.7} ${H * 0.92} ${W * 0.68} ${H * 0.3} ${W * 0.8} ${H * 0.3} H${W} V${H} H0z" fill="#EADBC4"/>`;
        const durak = CUKUR.map(([ad, soz, x, y], i) => {
          const kimler = Object.entries(kay).filter(([, v]) => v === i).map(([sid]) => T.store.activeClass().students.find((s) => s.id === sid)).filter(Boolean);
          return h("button.oc-durak", { style: { left: x * 100 + "%", top: y * 100 + "%" }, onclick: () => { if (!ogr) { T.speak(soz); return; } const o2 = ogr; yaz("cukur", (o) => { o = o || {}; o[T.isoDate()] = o[T.isoDate()] || {}; o[T.isoDate()][o2] = i; return o; }); ogr = null; T.sound.pop(); ciz(); } },
            h("b", ad), h("span", soz), h("div.oc-kim", kimler.map((s) => T.avatar(s.name, 28))));
        });
        box.replaceChildren(
          h("p.dy-tip", "Adına dokun, sonra şu an bulunduğun yere dokun."),
          h("div.dy-names", ps.map((st) => h("button" + (ogr === st.id ? ".on" : "") + (kay[st.id] != null ? ".done" : ""), { onclick: () => { ogr = st.id; ciz(); } }, T.avatar(st.name, 30), st.name))),
          h("div.oc-wrap", svg, durak),
          h("div.sb-card", h("h3", "Çıkış için araçlarım"), h("div.oc-arac", ["Arkadaşına sor", "Kitaba bak", "Tekrar dene", "Farklı bir yol bul"].map((x) => h("span.pill.info", { style: { fontSize: "18px", padding: "10px 16px" } }, x)))));
      }
      ciz();
    },
  });

  /* =================== 7. ETKİNLİĞİM BİTTİ =================== */
  const RUBRIK0 = ["Yönergeyi bir kez daha okudum.", "Bütün soruları ya da adımları yaptım.", "Adımı ve tarihi yazdım.", "Kontrol ettim, sağlamasını yaptım.", "Okunaklı ve düzenli.", "Masamı topladım."];
  const MENU0 = ["Kitap okurum.", "Bir arkadaşıma yardım ederim.", "Zekâ oyunu oynarım.", "Dönüşümlü düşünme defterime yazarım.", "Resim yaparım.", "Arkadaşlarıma bir soru hazırlarım."];
  function bitirdimVeri() { const v = veri("bitirdim"); return v || { r: RUBRIK0.slice(), m: MENU0.map((t) => ({ t, o: 0 })) }; }
  function bitirdimCiz(box, kucuk) {
    let tik = new Set(), duzen = false;
    function ciz() {
      const v = bitirdimVeri(); const hepsi = v.r.length && v.r.every((_, i) => tik.has(i));
      const rub = h("div.bt-rub", v.r.map((r, i) => h("button.bt-madde" + (tik.has(i) ? ".on" : ""), { onclick: () => { tik.has(i) ? tik.delete(i) : tik.add(i); T.sound.pop(); ciz(); } }, h("i", tik.has(i) ? T.icon("check") : null), h("span", r), duzen ? h("button.btn.sm.icon.c-chalk", { "aria-label": "Sil", onclick: (e) => { e.stopPropagation(); yaz("bitirdim", (o) => { o = o || bitirdimVeri(); o.r.splice(i, 1); return o; }); ciz(); } }, T.icon("close")) : null)));
      const sirali = v.m.map((x, i) => [x, i]).sort((a, b) => b[0].o - a[0].o);
      const menu = h("div.bt-menu", sirali.map(([x, i], j) => h("div.bt-sec" + (j < 3 && x.o ? ".top" : ""), h("span", x.t), h("button.btn.sm" + (kucuk ? ".icon" : ""), { "aria-label": "Oy ver", onclick: () => { yaz("bitirdim", (o) => { o = o || bitirdimVeri(); o.m[i].o++; return o; }); ciz(); } }, T.icon("plus"), kucuk ? null : String(x.o)), duzen ? h("button.btn.sm.icon.c-chalk", { "aria-label": "Sil", onclick: () => { yaz("bitirdim", (o) => { o = o || bitirdimVeri(); o.m.splice(i, 1); return o; }); ciz(); } }, T.icon("close")) : null)));
      const ekle = (alan, yer) => { const inp = h("input.in", { placeholder: yer }); return h("div.row", inp, h("button.btn.sm.c-leaf", { onclick: () => { const t = inp.value.trim(); if (!t) return; yaz("bitirdim", (o) => { o = o || bitirdimVeri(); alan === "r" ? o.r.push(t) : o.m.push({ t, o: 0 }); return o; }); ciz(); } }, T.icon("plus"), "Ekle")); };
      box.replaceChildren(
        h("div.bt-grid" + (kucuk ? ".kucuk" : ""),
          h("div.sb-card", h("h3", "Bitirdim mi? Önce kontrol et"), rub, duzen ? ekle("r", "Yeni ölçüt (ör. Başlık yazdım)") : null,
            h("div.bt-bitti" + (hepsi ? ".on" : ""), hepsi ? [T.icon("check"), "Bitirdim!"] : `${tik.size} / ${v.r.length} tamam`),
            hepsi ? h("button.btn.sm.c-chalk", { onclick: () => { tik = new Set(); ciz(); } }, "Sıradaki arkadaş") : null),
          h("div.sb-card", h("h3", "Etkinliğim bitti, şimdi ne yapabilirim?"), h("p.hint", "Seçenekleri sınıfça belirledik. Beğendiğin seçeneğe + ile oy ver; en çok oy alanlar üstte."), menu, duzen ? ekle("m", "Yeni seçenek önerisi") : null)),
        h("div.row", { style: { marginTop: "10px" } }, h("button.btn.sm.c-chalk", { onclick: () => { duzen = !duzen; ciz(); } }, T.icon("edit"), duzen ? "Düzenlemeyi bitir" : "Ölçütleri ve seçenekleri düzenle"), !kucuk ? h("span.hint", "Rubriği ve menüyü sınıfınla birlikte yazın. Her sınıf için ayrı saklanır.") : null));
    }
    ciz();
  }
  tool("bitirdim", { title: "Etkinliğim bitti", icon: "check", tone: "leaf", short: "Bitirme rubriği ve sınıfın seçtiği 'şimdi ne yapabilirim?' menüsü", render(host) { const b = h("div"); host.append(b); bitirdimCiz(b, false); } });

  /* =================== 8. BUMP IT UP DUVARI =================== */
  const idb = {
    open: () => new Promise((res, rej) => { try { const r = indexedDB.open("tahta-gorsel", 1); r.onupgradeneeded = () => r.result.createObjectStore("f"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }),
    async put(k, v) { try { const db = await this.open(); await new Promise((res, rej) => { const t = db.transaction("f", "readwrite"); t.objectStore("f").put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); return true; } catch (e) { return false; } },
    async get(k) { try { const db = await this.open(); return await new Promise((res) => { const t = db.transaction("f").objectStore("f").get(k); t.onsuccess = () => res(t.result); t.onerror = () => res(null); }); } catch (e) { return null; } },
    async del(k) { try { const db = await this.open(); db.transaction("f", "readwrite").objectStore("f").delete(k); } catch (e) {} },
  };
  T.gorselDepo = idb;
  async function kucult(file, max = 1100) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      return await new Promise((res) => c.toBlob(res, "image/jpeg", 0.82));
    } finally { URL.revokeObjectURL(url); }
  }
  const CICEK = ["#F29BB8", "#F4CF4B", "#F2994A", "#F5A8D0", "#E8474C", "#5AA9E6"];
  tool("bump-it-up", {
    title: "Basamak duvarı", icon: "stairs", tone: "sun", grades: [1, 8], short: "Örnek çalışmalarla bir üst basamağa (Bump It Up) çık",
    render(host) {
      let aktif = null, duzen = false, yonerge = false;
      const box = h("div"); host.append(box);
      const duvarlar = () => (veri("bump") || { d: [] }).d;
      const kaydetD = (fn) => yaz("bump", (o) => { o = o || { d: [] }; fn(o.d); return o; });
      async function foto(img, key) { const b = await idb.get(key); if (b) { const u = URL.createObjectURL(b); img.src = u; T.onLeave(() => URL.revokeObjectURL(u)); } }
      function yeni() {
        const ad = h("input.in", { placeholder: "Duvarın adı (ör. Hikâye yazma, Zikzak çizgi)" }), n = h("select.in", [3, 4, 5, 6].map((x) => h("option", { value: x, selected: x === 4 ? true : null }, x + " basamak")));
        T.modal({ title: "Yeni Bump It Up duvarı", body: h("div", { style: { display: "grid", gap: "10px" } }, ad, n, h("p.hint", "Basamakları sonra tek tek dolduracaksın: başlık, 'geliştirebilirim' maddeleri ve bir örnek fotoğraf.")), actions: [{ label: "Vazgeç" }, { label: "Oluştur", tone: "c-leaf", onClick: () => { const t = ad.value.trim() || "Gelişim duvarı"; const id = T.uid(); kaydetD((d) => d.push({ id, ad: t, b: Array.from({ length: +n.value }, (_, i) => ({ id: T.uid(), baslik: i + 1 + ". basamak", m: "" })) })); aktif = id; duzen = true; ciz(); } }] });
      }
      function yonergeKart() {
        return h("div.sb-card.bu-yon", h("h3", "Bump It Up duvarı nasıl kurulur?"),
          h("ol",
            h("li", "Bir beceri seç: hikâye yazma, zikzak çizgi, problem çözme adımları gibi. Tek bir beceri, tek bir duvar."),
            h("li", "Aynı görevden 3 ile 6 arasında örnek topla. En zayıftan en iyiye sırala. Öğrenci adlarını kapat ya da örneği kendin hazırla."),
            h("li", "Her basamağa çocuğun anlayacağı dille 'geliştirebilirim' maddeleri yaz: \"Basit cümleler kurabilirim. Büyük harf ve noktaya dikkat ederim.\" gibi."),
            h("li", "Her basamağa örneğin fotoğrafını yükle. Fotoğraflar yalnızca bu cihazda saklanır."),
            h("li", "Derste üç adımı kullan: 1. Kâğıdını incele. 2. Şimdi neredesin? Adını o basamağa yapıştır. 3. Bir sonraki basamağa çıkabilir misin? Hedef koy."),
            h("li", "Taslak kültürü: ilk iş çocuğun kapasitesi değildir, yalnızca bir taslaktır. Arkadaşınla değiş, birbirinize iki tane özel geri bildirim verin (güzel ya da kötü değil; şurası eğri, burası eksik gibi), sonra 2. taslağı yapın.")),
          h("button.btn.sm.c-chalk", { onclick: () => { yonerge = false; ciz(); } }, "Kapat"));
      }
      function ciz() {
        const ds = duvarlar(); const d = ds.find((x) => x.id === aktif);
        if (!d) {
          box.replaceChildren(
            yonerge || !ds.length ? yonergeKart() : h("button.btn.sm.c-chalk", { onclick: () => { yonerge = true; ciz(); } }, T.icon("help"), "Nasıl kurulur?"),
            h("div.tool-grid", { style: { marginTop: "14px" } }, ds.map((x) => h("button.tool-card.c-sun", { onclick: () => { aktif = x.id; duzen = false; ciz(); } }, T.icon("stairs"), h("span", x.ad, h("small", x.b.length + " basamak")))),
              h("button.tool-card.c-chalk", { onclick: yeni }, T.icon("plus"), h("span", "Yeni duvar", h("small", "Kendi basamaklarını kur")))));
          return;
        }
        const kay = (veri("bumpYer") || {})[d.id] || {};
        const ps = present();
        const basamaklar = h("div.bu-duvar", { style: { "--n": d.b.length } }, d.b.map((b, i) => {
          const img = h("img", { alt: b.baslik + " örneği" });
          foto(img, "bump:" + b.id);
          const kimler = Object.entries(kay).filter(([, v]) => v === i).map(([sid]) => T.store.activeClass().students.find((s) => s.id === sid)).filter(Boolean);
          return h("div.bu-bas", { style: { "--c": CICEK[i % 6], "--h": 40 + (i / Math.max(1, d.b.length - 1)) * 60 + "%" } },
            h("div.bu-cicek", h("b", i + 1)),
            h("div.bu-kutu",
              duzen ? h("input.in", { value: b.baslik, onchange: (e) => kaydetD((ds2) => { ds2.find((x) => x.id === d.id).b[i].baslik = e.target.value; }) }) : h("b", b.baslik),
              h("small", "Geliştirebilirim:"),
              duzen ? h("textarea.in", { value: b.m, placeholder: "Her satıra bir madde", style: { minHeight: "80px" }, onchange: (e) => kaydetD((ds2) => { ds2.find((x) => x.id === d.id).b[i].m = e.target.value; }) }) : h("ul", (b.m || "").split("\n").filter(Boolean).map((x) => h("li", x))),
              h("div.bu-foto", img, duzen ? h("label.btn.sm.c-chalk", { style: { cursor: "pointer" } }, T.icon("download"), "Örnek fotoğraf", h("input", { type: "file", accept: "image/*", style: { display: "none" }, onchange: async (e) => { const f = e.target.files[0]; if (!f) return; const bl = await kucult(f); await idb.put("bump:" + b.id, bl); T.toast("Fotoğraf eklendi"); ciz(); } })) : null),
              h("div.oc-kim", kimler.map((s) => h("span.pill", T.avatar(s.name, 22), s.name))),
              !duzen ? h("button.btn.sm.c-chalk", { onclick: () => { const sel = h("select.in", ps.map((s) => h("option", { value: s.id }, s.name))); T.modal({ title: "Şimdi neredesin?", body: h("div", { style: { display: "grid", gap: "8px" } }, h("p", b.baslik + " basamağına kimin adını yapıştıralım?"), sel), actions: [{ label: "Vazgeç" }, { label: "Yapıştır", tone: "c-leaf", onClick: () => { yaz("bumpYer", (o) => { o = o || {}; o[d.id] = o[d.id] || {}; o[d.id][sel.value] = i; return o; }); ciz(); } }] }); } }, T.icon("class"), "Adımı yapıştır") : null));
        }));
        box.replaceChildren(
          h("div.bu-adim", ["1. Kâğıdını incele.", "2. Şimdi neredesin? Yapıştır.", "3. Bir sonraki basamağa çıkabilir misin? Hedef koy."].map((x, i) => h("div", { style: { "--c": ["#F29BB8", "#8EC9EE", "#C8E64B"][i] } }, x))),
          h("div.row", { style: { margin: "12px 0" } }, h("button.btn.sm.c-chalk", { onclick: () => { aktif = null; ciz(); } }, T.icon("back"), "Duvarlar"), h("h2", { style: { margin: 0, fontSize: "24px" } }, d.ad), h("div.spacer"),
            h("button.btn.sm" + (duzen ? "" : ".c-chalk"), { onclick: () => { duzen = !duzen; ciz(); } }, T.icon("edit"), duzen ? "Bitti" : "Düzenle"),
            duzen ? h("button.btn.sm.c-chalk", { onclick: () => { kaydetD((ds2) => ds2.find((x) => x.id === d.id).b.push({ id: T.uid(), baslik: d.b.length + 1 + ". basamak", m: "" })); ciz(); } }, T.icon("plus"), "Basamak") : null,
            duzen ? h("button.btn.sm.c-tomato", { onclick: async () => { if (await T.confirm("Duvar silinsin mi?", d.ad + " duvarı ve fotoğrafları silinir.", "Sil")) { d.b.forEach((b) => idb.del("bump:" + b.id)); kaydetD((ds2) => ds2.splice(ds2.findIndex((x) => x.id === d.id), 1)); aktif = null; ciz(); } } }, T.icon("trash"), "Duvarı sil") : null,
            !duzen ? h("button.btn.sm.c-chalk", { onclick: () => { yaz("bumpYer", (o) => { o = o || {}; o[d.id] = {}; return o; }); ciz(); } }, T.icon("reset"), "İsimleri temizle") : null),
          duzen ? h("p.hint", "Başlıkları ve maddeleri yaz, her basamağa örnek fotoğraf yükle. Değişiklikler hemen kaydedilir.") : null,
          basamaklar);
      }
      ciz();
    },
  });

  /* =================== Ders ekranı araçları =================== */
  T.widgets.bitirdim = {
    title: "Etkinliğim bitti", icon: "check", tone: "leaf", w: 640, h: 460, minW: 420, minH: 320, group: "Sınıf kültürü", desc: "Bitirme rubriği ve ne yapabilirim menüsü",
    init: () => ({}), render(body) { body.style.overflow = "auto"; const b = h("div"); body.append(b); bitirdimCiz(b, true); },
  };
  T.widgets.yzduzey = {
    title: "Yapay zekâ düzeyi", icon: "spark", tone: "grape", w: 400, h: 330, minW: 280, minH: 220, group: "Sınıf kültürü", desc: "Bu görevin yapay zekâ kullanım düzeyi",
    init: () => ({ d: 0 }),
    render(body, w, api) {
      const p = () => { const [ad, ac, rk, ornek] = YZ[w.data.d]; body.style.overflow = "auto";
        body.replaceChildren(h("div.yzw", { style: { "--yz": rk } },
          h("div.yzw-sec", YZ.map((x, i) => h("button" + (i === w.data.d ? ".on" : ""), { style: { "--yz": x[2] }, "aria-label": x[0], title: x[0], onclick: () => { w.data.d = i; api.save(); p(); } }, String(i)))),
          h("b.yzw-ad", ad), h("p", ac), h("p.yzw-ornek", ornek))); };
      p();
    },
  };
  T.widgets.ucadim = {
    title: "Sormadan önce 3 adım", icon: "teacher", tone: "sky", w: 360, h: 330, minW: 260, minH: 260, group: "Sınıf kültürü", desc: "Beyin, etraf, arkadaş, öğretmen",
    init: () => ({}),
    render(body) { body.append(h("div.w3a", [["Son durak: Öğretmen", "#C2453A"], ["3. Arkadaş: fısıldayarak sordun mu?", "#3C8DD8"], ["2. Etraf: panoya, tahtaya, kitaba baktın mı?", "#E0B020"], ["1. Beyin: kendine sordun mu? Yönergeyi okudun mu?", "#D16BA5"]].map(([t, c], i) => h("div", { style: { background: c, width: 70 + i * 10 + "%" } }, t)))); },
  };
})();
