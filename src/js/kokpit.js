/* Ana sayfa kokpiti: tam ekran arka plan, cam kartlar (günün özeti, merak kıvılcımı, günün akışı, hızlı not),
   sınıf atmosferi ve müzik istasyonu (Web Audio ile üretilen sesler). Araçlar şeridinden açılan araçlar bu tuvalin üstünde yüzer. */
(function () {
  const { h } = T;
  const cid = () => T.store.activeClass().id;
  const ayar = () => { const s = T.store.get(); s.kokpit = s.kokpit || {}; return s.kokpit; };
  const ayarYaz = (fn) => T.store.update((s) => { s.kokpit = s.kokpit || {}; fn(s.kokpit); });

  /* ---------- Arka planlar (çizilmiş sahneler; yerel dosya ya da bağlantı da olur) ---------- */
  const svgUrl = (svg) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  const TEMA = [
    ["doga", "Doğa", svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD3F2"/><stop offset=".6" stop-color="#E6F4F1"/><stop offset="1" stop-color="#F6EDD6"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><circle cx="1220" cy="230" r="90" fill="#FFE6A3"/><circle cx="1220" cy="230" r="150" fill="#FFE6A3" opacity=".3"/><path d="M0 560 C260 470 420 520 640 480 S1040 420 1260 470 1500 520 1600 500 V900 H0Z" fill="#A9CFA0"/><path d="M0 650 C300 580 520 640 800 600 S1240 560 1600 620 V900 H0Z" fill="#7FB37E"/><path d="M0 760 C360 700 700 760 1000 720 S1400 690 1600 730 V900 H0Z" fill="#5E9A64"/><g fill="#3F7A4A"><path d="M180 660 l40 -120 40 120z"/><path d="M240 680 l32 -95 32 95z"/><path d="M1380 650 l44 -130 44 130z"/></g></svg>`)],
    ["deniz", "Deniz", svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9D8B6"/><stop offset=".55" stop-color="#FCEBD8"/></linearGradient><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5BA3C9"/><stop offset="1" stop-color="#2E6F96"/></linearGradient></defs><rect width="1600" height="900" fill="url(#s)"/><circle cx="800" cy="520" r="120" fill="#FFC98A"/><rect y="520" width="1600" height="380" fill="url(#d)"/><g stroke="#ffffff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"><path d="M640 560h320M560 600h200M840 600h240M700 650h200"/></g><path d="M0 800 C400 760 900 820 1600 780 V900 H0Z" fill="#EBD6B0"/></svg>`)],
    ["uzay", "Uzay", (() => { let st = ""; for (let i = 0; i < 160; i++) st += `<circle cx="${(i * 397) % 1600}" cy="${(i * 233) % 900}" r="${(i % 5) * 0.5 + 0.6}" fill="#fff" opacity="${0.3 + (i % 7) / 10}"/>`; return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="u" cx=".7" cy=".3" r="1"><stop offset="0" stop-color="#3B3F7A"/><stop offset=".5" stop-color="#1B1E40"/><stop offset="1" stop-color="#0B0D22"/></radialGradient><radialGradient id="p" cx=".35" cy=".35"><stop offset="0" stop-color="#F2B880"/><stop offset="1" stop-color="#B5603A"/></radialGradient></defs><rect width="1600" height="900" fill="url(#u)"/>${st}<circle cx="1260" cy="640" r="120" fill="url(#p)"/><ellipse cx="1260" cy="640" rx="210" ry="38" fill="none" stroke="#E9C9A3" stroke-width="10" opacity=".7"/></svg>`); })()],
    ["sonbahar", "Sonbahar", (() => { let l = ""; for (let i = 0; i < 26; i++) l += `<ellipse cx="${(i * 613) % 1600}" cy="${(i * 347) % 900}" rx="16" ry="8" fill="${["#E07B3C", "#C9542E", "#E9A23B", "#B5402A"][i % 4]}" transform="rotate(${(i * 47) % 180} ${(i * 613) % 1600} ${(i * 347) % 900})" opacity=".8"/>`; return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6D7A7"/><stop offset="1" stop-color="#F2E6D0"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><path d="M0 640 C320 560 640 640 960 590 S1400 560 1600 600 V900 H0Z" fill="#D9925A"/><path d="M0 740 C400 690 800 760 1200 710 S1500 700 1600 720 V900 H0Z" fill="#B86B3A"/><g fill="#7A4A2A"><rect x="300" y="380" width="22" height="280"/><rect x="1240" y="400" width="20" height="240"/></g><circle cx="311" cy="360" r="120" fill="#D9672E"/><circle cx="1250" cy="380" r="110" fill="#E9A23B"/>${l}</svg>`); })()],
    ["atolye", "Sıcak ahşap atölye", "repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 2px, transparent 2px 180px), repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 7px), linear-gradient(180deg, #C89462, #A8733F)"],
    ["karatahta", "Kara tahta", "radial-gradient(ellipse 60% 40% at 25% 30%, rgba(255,255,255,.07), transparent 70%), radial-gradient(ellipse 50% 35% at 75% 70%, rgba(255,255,255,.05), transparent 70%), linear-gradient(#2F4F3E, #253F32)"],
    ["izgara", "Noktalı ızgara", "radial-gradient(circle, #C9CFDB 1.6px, transparent 1.8px) 0 0 / 28px 28px, #F7F8FB"],
    ["dingin", "Dingin renkler", "radial-gradient(at 15% 20%, #DCE9F7 0, transparent 50%), radial-gradient(at 85% 15%, #F7E3EC 0, transparent 50%), radial-gradient(at 70% 85%, #E2F2E4 0, transparent 50%), radial-gradient(at 20% 85%, #FBF0D9 0, transparent 50%), #F4F5F8"],
  ];
  const FOTO = [["kelebek", "Kelebek"], ["kizilgerdan", "Kızılgerdan"], ["karahindiba", "Karahindiba"], ["kaplumbaga", "Deniz kaplumbağası"], ["sonbahar", "Sisli göl"], ["uzay", "Uzay"], ["atolye", "Atölye masası"], ["suluboya", "Suluboya tepeler"], ["monstera", "Sakin duvar"]];
  const CIZIM = TEMA.filter((t) => ["karatahta", "izgara", "dingin", "doga"].includes(t[0]));
  let bgUrl = null, donenSecim = null;
  const ozelListe = () => ayar().ozelBg || [];
  function havuz() { return FOTO.map((f) => ({ tip: "foto", id: f[0] })).concat(ozelListe().map((id) => ({ tip: "dosya", id }))); }
  function donenSec() {
    const h2 = havuz(); const son = ayar().sonDonen;
    const aday = h2.filter((x) => x.tip + x.id !== son); const sec = aday[Math.floor(Math.random() * aday.length)] || h2[0];
    ayarYaz((k) => (k.sonDonen = sec.tip + sec.id)); return sec;
  }
  async function arkaPlanUygula(el = T.$("#tuval")) {
    if (!el) return;
    const k = ayar();
    let a = k.bg || { tip: "foto", id: "kelebek" };
    if (k.donen !== false) { if (!donenSecim) donenSecim = donenSec(); a = donenSecim; }
    el.style.background = ""; el.style.backgroundSize = "cover"; el.style.backgroundPosition = "center";
    if (a.tip === "foto") el.style.background = `#ccc url("arka/${a.id}.jpg") center / cover no-repeat`;
    else if (a.tip === "tema") { const t = TEMA.find((x) => x[0] === a.id) || TEMA[0]; el.style.background = t[2]; el.style.backgroundSize = t[2].startsWith("url") ? "cover" : ""; el.style.backgroundPosition = "center"; }
    else if (a.tip === "url") el.style.background = `#222 url("${a.url.replace(/"/g, "%22")}") center / cover no-repeat`;
    else if (a.tip === "dosya") { const b = T.gorselDepo && (await T.gorselDepo.get("kokpit:bg:" + (a.id || ""))) || (T.gorselDepo && (await T.gorselDepo.get("kokpit:bg"))); if (b) { if (bgUrl) URL.revokeObjectURL(bgUrl); bgUrl = URL.createObjectURL(b); el.style.background = `#222 url("${bgUrl}") center / cover no-repeat`; } else el.style.background = `#ccc url("arka/kelebek.jpg") center / cover no-repeat`; }
  }
  async function kucukResim(id) { const b = T.gorselDepo && (await T.gorselDepo.get("kokpit:bg:" + id)); return b ? URL.createObjectURL(b) : ""; }
  T.arkaPlanSec = function () {
    const url = h("input.in", { placeholder: "https://... görsel bağlantısı", value: (ayar().bg || {}).tip === "url" ? ayar().bg.url : "" });
    let m;
    const sec = (bg) => { ayarYaz((k) => { k.bg = bg; k.donen = false; }); donenSecim = null; arkaPlanUygula(); };
    const govde = h("div", { style: { display: "grid", gap: "16px" } });
    const etkin = (bg) => { const a = ayar(); return a.donen === false && a.bg && a.bg.tip === bg.tip && a.bg.id === bg.id; };
    function ciz() {
      const a = ayar();
      const ozel = h("div.kp-temalar");
      ozelListe().forEach(async (id) => { const u = await kucukResim(id); ozel.append(h("div.kp-tema-w", h("button.kp-tema" + (etkin({ tip: "dosya", id }) ? ".on" : ""), { onclick: () => { sec({ tip: "dosya", id }); m.close(); } }, h("span", { style: { background: `#ddd url("${u}") center / cover` } }), "Benim görselim"), h("button.kp-pinx", { "aria-label": "Sil", onclick: () => { ayarYaz((k) => (k.ozelBg = (k.ozelBg || []).filter((x) => x !== id))); T.gorselDepo.del("kokpit:bg:" + id); ciz(); } }, T.icon("close")))); });
      govde.replaceChildren(
        h("label.bt-madde" + (a.donen !== false ? ".on" : ""), { style: { cursor: "pointer" } }, h("input", { type: "checkbox", checked: a.donen !== false ? true : null, onchange: (e) => { ayarYaz((k) => (k.donen = e.target.checked)); donenSecim = null; arkaPlanUygula(); ciz(); } }), h("span", "Her açılışta değişsin (fotoğraflar ve benim görsellerim arasından)")),
        h("b", "Fotoğraflar"),
        h("div.kp-temalar", FOTO.map(([id, ad]) => h("button.kp-tema" + (etkin({ tip: "foto", id }) ? ".on" : ""), { onclick: () => { sec({ tip: "foto", id }); m.close(); } }, h("span", { style: { background: `#ddd url("arka/${id}-k.jpg") center / cover` } }), ad))),
        h("b", "Benim görsellerim"),
        ozel,
        h("div.row", h("label.btn.c-chalk", { style: { cursor: "pointer" } }, T.icon("download"), "Görsel ekle", h("input", { type: "file", accept: "image/*", multiple: true, style: { display: "none" }, onchange: async (e) => {
          for (const f of e.target.files) { const id = T.uid(); const ok = T.gorselDepo && (await T.gorselDepo.put("kokpit:bg:" + id, f)); if (ok) ayarYaz((k) => (k.ozelBg = (k.ozelBg || []).concat(id))); }
          T.toast("Görsel eklendi"); ciz();
        } })), h("span.hint", "Birden çok görsel seçebilirsin. Yalnızca bu cihazda saklanır.")),
        h("div.row", url, h("button.btn.c-leaf", { onclick: () => { const u = url.value.trim(); if (!/^https:\/\//.test(u)) { T.toast("https:// ile başlayan bir bağlantı yapıştır"); return; } sec({ tip: "url", url: u }); m.close(); } }, "Bağlantıyı kullan")),
        h("b", "Düz zeminler"),
        h("div.kp-temalar", CIZIM.map(([id, ad, css]) => h("button.kp-tema" + (etkin({ tip: "tema", id }) ? ".on" : ""), { onclick: () => { sec({ tip: "tema", id }); m.close(); } }, h("span", { style: { background: css, backgroundSize: "cover", backgroundPosition: "center" } }), ad))),
        h("p.hint", "Kendi eklediğin görselin ya da bağlantının kullanım hakkının sende olduğundan emin ol."));
    }
    ciz();
    m = T.modal({ title: "Arka plan", wide: true, body: govde, actions: [{ label: "Kapat" }] });
  };

  /* ---------- Müzik ve atmosfer (Web Audio) ---------- */
  /* Klasik çalma listesi: Pixabay lisanslı parçalar, dist/muzik içinde. Yalnızca çalınca indirilir. */
  const KLASIK = [["piyano-vals", "Piyano valsi", "Tunetank"], ["keman", "Keman", "Nastelbom"], ["sakin-klasik", "Sakin klasik", "AtlasAudio"], ["modern-klasik", "Modern klasik", "AtlasAudio"], ["yaylilar", "Yaylılar", "Nastelbom"], ["klasik-esinti", "Klasik esinti", "Starostin"], ["dag-klasik", "Dağ esintisi", "The Mountain"], ["kraliyet-ingiliz", "Kraliyet marşı", "Alex Morgan"], ["saray-bahcesi", "Saray bahçesi", "Mondamusic"], ["sinematik", "Sinematik", "Lexin Music"], ["stride-piyano", "Stride piyano", "Alex Morgan"], ["yayli-salon", "Yaylı salonu", "Cinematic Strings Hall"], ["moszkowski-etut", "Moszkowski, Etüt 7", "Lorenzo Buczek"], ["dingin-atmosfer", "Dingin atmosfer", "SigmaEffect"], ["sonbahar-ormani", "Sonbahar ormanı", "The Fealdo Project"], ["sakin-lofi", "Sakin lofi", "Velario Music"]];
  const Muzik = (function () {
    let ozelUrl = null, ctx, master, analyser, mod = null, audioEl = null, hacim = 0.5;
    function kur() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 1;
      analyser = ctx.createAnalyser(); analyser.fftSize = 1024;
      master.connect(analyser); analyser.connect(ctx.destination);
    }
    let sira = [], siraI = 0;
    function elKur() { if (!audioEl) { audioEl = new Audio(); audioEl.crossOrigin = "anonymous"; audioEl.volume = Math.min(1, hacim); audioEl.addEventListener("ended", () => { if (mod === "klasik") parca(1); }); try { ctx.createMediaElementSource(audioEl).connect(master); } catch (e) {} } }
    function parca(d) {
      if (!sira.length) { sira = KLASIK.map((_, i) => i).sort(() => Math.random() - 0.5); siraI = 0; } else siraI = (siraI + d + sira.length) % sira.length;
      const k = KLASIK[sira[siraI]]; audioEl.loop = false; audioEl.src = "muzik/" + k[0] + ".mp3";
      audioEl.play().catch(() => T.toast("Müzik çalınamadı")); T.muzikDurum && T.muzikDurum(); T.$$(".kp-parca").forEach((x) => (x.textContent = k[1] + " · " + k[2]));
    }
    function durdur() { if (audioEl) audioEl.pause(); mod = null; }
    function cal(m) {
      kur(); ctx.resume(); durdur(); mod = m;
      if (m === "klasik") { elKur(); sira = []; parca(0); return true; }
      if (m === "ozel") { const k = ozelUrl || ayar().muzikUrl; if (!k) return false; elKur(); audioEl.loop = true; audioEl.src = k; audioEl.play().catch(() => T.toast("Ses dosyası çalınamadı")); return true; }
      return false;
    }
    return { sonraki: () => mod === "klasik" && parca(1), onceki: () => mod === "klasik" && parca(-1), parcaAdi: () => (mod === "klasik" && sira.length ? KLASIK[sira[siraI]].slice(1).join(" · ") : ""), cal, durdur, aktif: () => mod, hacim: (v) => { hacim = v; if (audioEl) audioEl.volume = Math.min(1, v); }, analyser: () => analyser, dosya: (f) => { if (ozelUrl) URL.revokeObjectURL(ozelUrl); ozelUrl = URL.createObjectURL(f); }, ozelVar: () => !!(ozelUrl || ayar().muzikUrl), get hacimV() { return hacim; } };
  })();
  T.muzik = Muzik;

  /* Spotify: öğretmenin çalma listesi bağlantısı. Resmi gömülü oynatıcı; anahtar ya da hesap bilgisi istemez. Sayfa değişince kaybolmasın diye gövdeye eklenir. */
  const spotifyEmbed = (u) => { const m = String(u || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|show|episode|artist)\/([A-Za-z0-9]+)/); return m ? "https://open.spotify.com/embed/" + m[1] + "/" + m[2] + "?utm_source=generator" : null; };
  T.spotify = {
    ac(u) {
      const src = spotifyEmbed(u || ayar().spotify); if (!src) return false;
      Muzik.durdur();
      let k = document.getElementById("spotify-kutu");
      if (!k) {
        k = h("div#spotify-kutu", h("div.sp-bas", T.icon("music"), h("span", "Spotify"), h("button.kp-mini", { "aria-label": "Küçült", title: "Küçült", onclick: () => k.classList.toggle("kucuk") }, T.icon("minus")), h("button.kp-mini", { "aria-label": "Spotify'ı kapat", title: "Kapat", onclick: () => T.spotify.kapat() }, T.icon("close"))),
          h("iframe", { title: "Spotify oynatıcı", allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture", loading: "lazy" }));
        document.body.append(k);
      }
      const f = k.querySelector("iframe"); if (f.getAttribute("src") !== src) f.setAttribute("src", src);
      k.classList.remove("kucuk"); return true;
    },
    kapat() { const k = document.getElementById("spotify-kutu"); if (k) k.remove(); T.muzikDurum && T.muzikDurum(); },
    acik: () => !!document.getElementById("spotify-kutu"),
    baglantiSor(sonra) {
      const url = h("input.in", { placeholder: "https://open.spotify.com/playlist/...", value: ayar().spotify || "" });
      T.modal({ title: "Spotify çalma listesi", body: h("div", { style: { display: "grid", gap: "10px" } },
        h("p", "Spotify'da çalma listesinde Paylaş, sonra Bağlantıyı kopyala de ve buraya yapıştır. Albüm ya da şarkı bağlantısı da olur."), url,
        h("p.hint", "Bu tarayıcıda Spotify hesabına giriş yaptıysan şarkılar tam çalar, giriş yapmadıysan kısa önizleme çalar. Bağlantı yalnızca bu cihazda saklanır.")),
        actions: [{ label: "Vazgeç" }, { label: "Çal", tone: "c-leaf", onClick: () => { const u = url.value.trim(); if (!spotifyEmbed(u)) { T.toast("Spotify bağlantısı tanınmadı"); return false; } ayarYaz((x) => (x.spotify = u)); T.spotify.ac(u); sonra && sonra(); } }] });
      setTimeout(() => url.focus(), 50);
    },
  };

  /* ---------- Kıvılcımlar ---------- */
  const KIVILCIM = [
    ["Merak sorusu", "Bulutlar neden düşmez?", "Bulutlar çok küçük su damlacıklarından oluşur. Damlacıklar o kadar hafiftir ki yükselen hava onları taşır. Damlacıklar birleşip ağırlaşınca yağmur olarak düşer."],
    ["Merak sorusu", "Ay neden bazen yarım görünür?", "Ay kendisi ışık üretmez. Güneş'in aydınlattığı yüzünü her gün biraz farklı açıdan görürüz."],
    ["Merak sorusu", "Bir ağacın kaç yaşında olduğunu nasıl anlarız?", "Kesilmiş bir gövdedeki halkaları sayarak. Ağaç genellikle her yıl bir halka ekler."],
    ["Merak sorusu", "Bir karınca kendi ağırlığının kaç katını taşıyabilir?", "Önce tahmin edin. Karıncalar kendi ağırlıklarının çok katını taşıyabilir. Bunu birlikte araştırın."],
    ["Merak sorusu", "Kediler karanlıkta nasıl görür?", "Gözlerinin arkasındaki özel bir tabaka az ışığı yansıtır. Ama tamamen karanlıkta onlar da göremez."],
    ["Merak sorusu", "Arılar balı nasıl yapar?", "Çiçeklerden topladıkları nektarı kovanda işleyip suyunu azaltırlar. Böylece nektar yavaş yavaş bala dönüşür."],
    ["Felsefi soru", "Bir arkadaşın sana bir kez yalan söylerse yine de arkadaşın olur mu?", "Doğru ya da yanlış cevap yok. Fikrini söyle, sonra 'Neden böyle düşünüyorsun?' diye arkadaşına sor."],
    ["Felsefi soru", "Bir şeyin adil olduğunu nasıl anlarız?", "Herkesin aynı şeyi alması mı adil, herkesin ihtiyacı kadar alması mı? Örnekle konuşun."],
    ["Felsefi soru", "Hiç konuşmadan bir arkadaşına teşekkür edebilir misin?", "Yollarını bulun, bugün en az birini deneyin."],
    ["Felsefi soru", "Hayvanlar da bizim gibi düşünür mü?", "Gözlemlerinizden örnek verin. Hangi davranış düşündüklerini gösteriyor olabilir?"],
    ["Felsefi soru", "Mutluluk bir kutuda saklanabilir mi?", "Seni mutlu eden bir anı hatırla. O anı nasıl 'saklıyorsun'?"],
    ["Günün kelimesi", "merak", "Bir şeyi öğrenme, bilme isteği. Bugün neyi merak ediyorsun?"],
    ["Günün kelimesi", "sabır", "Bir şeyin olmasını kızmadan, sakin bekleyebilmek. Bugün nerede sabırlı olabilirsin?"],
    ["Günün kelimesi", "cesaret", "Korkulu bir durumda da doğru olanı yapabilme gücü. Cesaret gösterdiğin bir anı anlat."],
    ["Günün kelimesi", "empati", "Kendini başkasının yerine koyup onun duygusunu anlamak. Bugün kimi anlamaya çalışacaksın?"],
  ];

  /* ---------- Kartlar ---------- */
  const KARTLAR = [["ozet", "Günün özeti"], ["kivilcim", "Merak kıvılcımı"], ["akis", "Günün akışı"], ["pin", "Sabitlenen etkinlikler"], ["not", "Hızlı not"], ["muzik", "Atmosfer ve müzik"]];
  const gizli = () => ayar().gizli || {};
  function ozetKart() {
    const s = T.store.get(), c = T.store.activeClass(), n = T.cal.dayNumber(), st = T.cal.status();
    const day = (s.attendance[c.id] || {})[T.isoDate()] || {}; const taken = Object.keys(day).length > 0; const came = c.students.filter((x) => day[x.id] !== "yok").length;
    const gv = T.gorevliler(c);
    const tally = h("div.kp-tally", { "aria-hidden": "true" });
    for (let i = 0; i < Math.floor(Math.min(n, 100) / 5); i++) { const g = T.svg("svg", { viewBox: "0 0 40 30" }); g.innerHTML = '<path d="M5 3v24M12 3v24M19 3v24M26 3v24M1 24 32 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>'; tally.append(g); }
    for (let i = 0; i < n % 5 && n <= 100; i++) { const g = T.svg("svg", { viewBox: "0 0 8 30" }); g.innerHTML = '<path d="M4 3v24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'; tally.append(g); }
    const saat = h("b.kp-saat.num");
    const tick = () => { const d = new Date(); saat.textContent = `${T.pad(d.getHours())}:${T.pad(d.getMinutes())}`; }; tick(); const iv = setInterval(tick, 10000); T.onLeave(() => clearInterval(iv));
    const sp = T.cal.specialDay();
    return h("section.kp-kart.kp-ozet", { "aria-label": "Günün özeti" },
      h("div.kp-ust", h("button.kp-sinif", { onclick: () => T.pickClass(), "aria-label": "Sınıf değiştir" }, T.icon("class"), c.name), saat),
      st.kind === "okul" ? h("div.kp-gun", h("b", n), h("span", "Okulun " + n + ". günü", h("small", T.longDate()))) : h("div.kp-gun", h("span", st.text, h("small", T.longDate()))),
      st.kind === "okul" ? tally : null,
      h("div.kp-satirlar",
        h("button.kp-satir", { onclick: () => T.go("sinif") }, T.icon("check"), "Yoklama", h("b", taken ? came + " / " + c.students.length : "Al")),
        h("button.kp-satir", { onclick: () => T.gorevliPenceresi(c), title: "Görevlileri gör ve düzenle" }, T.icon("trophy"), "Görevliler", gv.length ? h("span.kp-yuzler", gv.slice(0, 4).map(([, st]) => T.avatar(st.name, 26))) : h("b", "Ekle")),
        (() => { const hv = ((s.sabah || {})[c.id + ":" + T.isoDate()] || {}).hava; const ad = hv && T.HAVA ? (T.HAVA.find((x) => x[0] === hv) || [])[1] : null; return h("button.kp-satir", { onclick: () => T.go("sabah-gunaydin") }, hv && T.havaSvg ? T.havaSvg(hv) : T.icon("sun"), "Hava", h("b", ad || "Seç")); })(),
        st.kind === "okul" ? h("button.kp-satir", { onclick: () => T.go("sabah-sayi") }, T.icon("spark"), "Bugünün sayısı", h("b", n)) : null,
        sp ? h("div.kp-satir", T.icon("star"), h("span", sp)) : null));
  }
  function kivilcimKart() {
    const k = ayar(); const ozel = (k.ozelKivilcim || {})[cid()];
    let i = k.kivilcimI != null ? k.kivilcimI : Math.floor(Date.now() / 864e5) % KIVILCIM.length;
    const item = () => (ozel && i === -1 ? ["Öğretmenin sorusu", ozel, "Birlikte düşünelim."] : KIVILCIM[((i % KIVILCIM.length) + KIVILCIM.length) % KIVILCIM.length]);
    const kart = h("div.kp-flip"); let dondu = false;
    const ciz = () => { const [tur, on, arka] = item(); kart.replaceChildren(h("div.kp-flip-ic" + (dondu ? ".dondu" : ""), h("div.kp-yuz.on", h("small", tur), h("b", on), h("span.kp-ipucu", "Çevirmek için dokun")), h("div.kp-yuz.arka", h("small", tur), h("p", arka)))); };
    kart.addEventListener("click", () => { dondu = !dondu; ciz(); });
    ciz();
    return h("section.kp-kart.kp-kivilcim", { "aria-label": "Merak kıvılcımı" }, h("div.kp-baslik", T.icon("spark"), "Günün kıvılcımı"), kart,
      h("div.row", { style: { gap: "6px" } },
        h("button.btn.sm", { onclick: () => { i = i < 0 ? 0 : i + 1; dondu = false; ayarYaz((x) => (x.kivilcimI = i)); ciz(); } }, T.icon("next"), "Yeni kıvılcım"),
        h("button.btn.sm.c-chalk", { onclick: () => { const inp = h("input.in", { placeholder: "Bugünün sorusu", value: ozel || "" }); T.modal({ title: "Kendi sorun", body: inp, actions: [{ label: "Vazgeç" }, { label: "Kaydet", tone: "c-leaf", onClick: () => { const v = inp.value.trim(); ayarYaz((x) => { x.ozelKivilcim = x.ozelKivilcim || {}; x.ozelKivilcim[cid()] = v; x.kivilcimI = v ? -1 : 0; }); T.route(); } }] }); } }, T.icon("edit"), "Kendi sorum")));
  }
  function akisKart() {
    const rows = T.gunAkisi ? T.gunAkisi() : [];
    const box = h("section.kp-kart.kp-akis", { "aria-label": "Günün akışı" });
    const ciz = () => {
      const m = new Date().getHours() * 60 + new Date().getMinutes(); const dk = T.akisDk;
      const dersler = rows.filter((r) => r.tur === "ders"); const kalan = dersler.filter((r) => dk(r.s) > m).length;
      const son = rows.length ? dk(rows[rows.length - 1].s) : 0;
      box.replaceChildren(
        h("div.kp-baslik", T.icon("clock"), "Şimdi ne yapıyoruz?", h("span.kp-kalan", !rows.length ? "Bugün ders yok" : m >= son ? "Dersler bitti" : "Eve " + kalan + " ders"), h("button.kp-mini", { onclick: () => T.go("sabah-akis"), "aria-label": "Akışı düzenle" }, T.icon("edit"))),
        rows.length ? h("div.kp-serit", rows.map((r) => { const su = dk(r.b) <= m && m < dk(r.s), gecti = dk(r.s) <= m; return h("div.kp-slot." + r.tur + (su ? ".su" : gecti ? ".gecti" : ""), h("small", r.b), h("b", r.ad)); })) : h("p.hint", "Günün akışını Sabah rutininden yazabilirsin."));
      const su = box.querySelector(".kp-slot.su"); if (su) su.scrollIntoView({ block: "nearest", inline: "center" });
    };
    ciz(); const iv = setInterval(ciz, 30000); T.onLeave(() => clearInterval(iv));
    return box;
  }
  function notKart() {
    const k = ayar(); const metin = (k.not || {})[cid()] || "";
    const alan = h("div.kp-not-ic", { contenteditable: "true", "aria-label": "Hızlı not", "data-yer": "Bugünün hedefi ya da hatırlatma..." }); alan.textContent = metin;
    alan.addEventListener("input", () => ayarYaz((x) => { x.not = x.not || {}; x.not[cid()] = alan.innerText; }));
    return h("section.kp-kart.kp-not", { "aria-label": "Hızlı not" }, alan);
  }
  function muzikKart() {
    const MOD = [["klasik", "Klasik müzik"], ["spotify", "Spotify"], ["ozel", "Kendi sesim"]];
    const box = h("section.kp-kart.kp-muzik", { "aria-label": "Sınıf atmosferi ve müzik" });
    const cv = h("canvas.kp-dalga", { width: 280, height: 44 });
    let raf;
    const ciz = () => {
      const a = Muzik.aktif();
      box.replaceChildren(h("div.kp-baslik", T.icon("music"), "Sınıf atmosferi", a ? h("button.kp-mini", { onclick: () => { Muzik.durdur(); ciz(); }, "aria-label": "Durdur" }, T.icon("pause")) : null),
        h("div.kp-modlar", MOD.map(([k, l]) => h("button" + (a === k || (k === "spotify" && T.spotify.acik()) ? ".on" : ""), { onclick: () => {
          if (k === "spotify") { if (T.spotify.acik()) T.spotify.kapat(); else if (!T.spotify.ac()) T.spotify.baglantiSor(ciz); ciz(); return; }
          if (a === k) { Muzik.durdur(); ciz(); return; }
          T.spotify.kapat();
          if (k === "ozel" && !Muzik.ozelVar()) { ozelSes(); return; }
          Muzik.cal(k); ciz();
        } }, l))),
        a ? cv : null,
        a === "klasik" ? h("div.kp-calar", h("button.kp-mini", { "aria-label": "Önceki parça", onclick: () => Muzik.onceki() }, T.icon("back")), h("span.kp-parca", Muzik.parcaAdi()), h("button.kp-mini", { "aria-label": "Sonraki parça", onclick: () => Muzik.sonraki() }, T.icon("next"))) : null,
        T.spotify.acik() || ayar().spotify ? h("button.kp-link", { onclick: () => T.spotify.baglantiSor(ciz) }, "Spotify bağlantısını değiştir") : null,
        h("div.row", { style: { gap: "8px" } }, h("span.hint", "Ses"), h("input", { type: "range", min: 0, max: 1, step: 0.05, value: Muzik.hacimV, style: { flex: 1 }, oninput: (e) => Muzik.hacim(+e.target.value), "aria-label": "Ses düzeyi" }), h("button.kp-mini", { onclick: ozelSes, title: "Kendi sesini ekle", "aria-label": "Kendi sesini ekle" }, T.icon("plus"))));
      cancelAnimationFrame(raf); if (a) dalga();
    };
    function dalga() {
      const an = Muzik.analyser(); if (!an) return; const d = new Uint8Array(an.fftSize); const g = cv.getContext("2d");
      const f = () => { an.getByteTimeDomainData(d); g.clearRect(0, 0, 280, 44); g.strokeStyle = "#1B2A4A"; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 280; i++) { const v = d[Math.floor((i / 280) * d.length)] / 128 - 1; g[i ? "lineTo" : "moveTo"](i, 22 + v * 40); } g.stroke(); raf = requestAnimationFrame(f); };
      f();
    }
    function ozelSes() {
      const url = h("input.in", { placeholder: "https://... .mp3 bağlantısı" });
      T.modal({ title: "Kendi sesini ekle", body: h("div", { style: { display: "grid", gap: "10px" } }, h("label.btn.c-chalk", { style: { cursor: "pointer", justifySelf: "start" } }, T.icon("download"), "Ses dosyası seç", h("input", { type: "file", accept: "audio/*", style: { display: "none" }, onchange: (e) => { const f = e.target.files[0]; if (f) { Muzik.dosya(f); Muzik.cal("ozel"); ciz(); T.$$("#layer > .scrim").forEach((x) => x.remove()); } } })), url, h("p.hint", "Seçtiğin dosya bu oturum boyunca çalar. Bağlantı verirsen kaydedilir.")),
        actions: [{ label: "Vazgeç" }, { label: "Çal", tone: "c-leaf", onClick: () => { const u = url.value.trim(); if (!/^https:\/\//.test(u)) { T.toast("https:// ile başlayan bir bağlantı yapıştır"); return false; } ayarYaz((x) => (x.muzikUrl = u)); Muzik.cal("ozel"); ciz(); } }] });
    }
    ciz(); T.onLeave(() => cancelAnimationFrame(raf));
    return box;
  }

  /* ---------- Ana sayfa ---------- */
  T.kokpit = {
    render(view) {
      const sade = !!ayar().sade, g = gizli();
      const kok = h("div.kokpit" + (sade ? ".sade" : ""));
      view.append(kok);
      const kontroller = h("div.kp-kontrol",
        h("button.kp-dugme", { onclick: () => { ayarYaz((x) => (x.sade = !x.sade)); T.route(); }, title: sade ? "Kartları göster" : "Görünümü sadeleştir" }, T.icon(sade ? "eye" : "eyeoff"), sade ? "Kartları göster" : "Sadeleştir"),
        !sade ? h("button.kp-dugme", { onclick: kartSec, title: "Kartları seç" }, T.icon("grid"), "Kartlar") : null,
        h("button.kp-dugme", { onclick: T.arkaPlanSec, title: "Arka planı değiştir" }, T.icon("bg"), "Arka plan"),
        h("button.kp-dugme", { onclick: () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch (e) {} }, title: "Tam ekran", "aria-label": "Tam ekran" }, T.icon("full")));
      kok.append(kontroller);
      if (!sade) {
        kok.append(h("div.kp-izgara",
          h("div.kp-sol", g.ozet ? null : ozetKart(), g.not ? null : notKart()),
          h("div.kp-orta", g.akis ? null : akisKart(), g.pin ? null : pinKart()),
          h("div.kp-sag", g.muzik ? null : muzikKart(), g.kivilcim ? null : kivilcimKart())));
      } else if (Muzik.aktif()) kok.append(h("div.kp-calan", T.icon("music"), "Atmosfer açık", h("button.kp-mini", { onclick: () => { Muzik.durdur(); T.route(); } }, T.icon("pause"))));
    },
  };
  T.arkaPlanUygula = () => arkaPlanUygula();

  /* ---------- Sabitlenen (pinlenen) etkinlikler ---------- */
  T.pinler = () => ((T.store.get().pinler || {})[cid()] || []);
  T.pinliMi = (r) => T.pinler().some((x) => x.r === r);
  T.pinDegis = (r, baslik, ikon, ton) => T.store.update((s) => { s.pinler = s.pinler || {}; const l = (s.pinler[cid()] = s.pinler[cid()] || []); const i = l.findIndex((x) => x.r === r); if (i >= 0) l.splice(i, 1); else l.push({ r, b: baslik, i: ikon, t: ton }); });
  /* Etkinlik kartı: köşesinde Ana tahtaya sabitle düğmesi */
  T.aracKart = (route, t, ton) => {
    const pin = h("button.tc-pin", { "aria-label": "Ana tahtaya sabitle", title: "Ana tahtaya sabitle", onclick: (e) => { e.stopPropagation(); T.pinDegis(route, t.title, t.icon, t.tone || ton); const on = T.pinliMi(route); pin.classList.toggle("on", on); T.toast(on ? "Ana tahtaya sabitlendi" : "Sabitleme kaldırıldı"); } }, T.icon("pin"));
    if (T.pinliMi(route)) pin.classList.add("on");
    return h("div.tc-wrap", h("button.tool-card.c-" + (t.tone || ton), { onclick: () => T.go(route) }, T.icon(t.icon), h("span", t.title, h("small", t.short || t.desc || ""))), pin);
  };
  function pinKart() {
    const l = T.pinler();
    return h("section.kp-kart.kp-pin", { "aria-label": "Sabitlenen etkinlikler" }, h("div.kp-baslik", T.icon("pin"), "Bugün için sabitlediklerim"),
      l.length ? h("div.kp-pinler", l.map((p) => h("div.kp-pinw", h("button.kp-pinb.c-" + (p.t || "sun"), { onclick: () => T.go(p.r) }, T.icon(p.i || "star"), h("span", p.b)), h("button.kp-pinx", { "aria-label": "Kaldır", onclick: () => { T.pinDegis(p.r); T.route(); } }, T.icon("close")))))
        : h("p.hint", "Türkçe, Matematik, Duygular gibi bölümlerde bir etkinlik kartının köşesindeki iğneye dokun; burada hızlı başlatma kartı olarak görünür."));
  }

  /* ---------- Her yerden müzik: üst bar düğmesi ---------- */
  T.muzikPanel = function () {
    const MOD = [["klasik", "Klasik müzik"]];
    let m;
    const govde = () => h("div", { style: { display: "grid", gap: "10px" } }, h("div.kp-modlar", MOD.map(([k, l]) => h("button" + (Muzik.aktif() === k ? ".on" : ""), { onclick: () => { if (Muzik.aktif() === k) Muzik.durdur(); else { T.spotify.kapat(); Muzik.cal(k); } m.close(); T.muzikDurum && T.muzikDurum(); } }, l)),
        h("button" + (T.spotify.acik() ? ".on" : ""), { onclick: () => { m.close(); if (T.spotify.acik()) T.spotify.kapat(); else if (!T.spotify.ac()) T.spotify.baglantiSor(); T.muzikDurum && T.muzikDurum(); } }, "Spotify")),
      Muzik.aktif() === "klasik" ? h("div.kp-calar", h("button.kp-mini", { "aria-label": "Önceki parça", onclick: () => Muzik.onceki() }, T.icon("back")), h("span.kp-parca", Muzik.parcaAdi()), h("button.kp-mini", { "aria-label": "Sonraki parça", onclick: () => Muzik.sonraki() }, T.icon("next"))) : null,
      h("div.row", h("span.hint", "Ses"), h("input", { type: "range", min: 0, max: 1, step: 0.05, value: Muzik.hacimV, style: { flex: 1 }, oninput: (e) => Muzik.hacim(+e.target.value) })),
      Muzik.aktif() ? h("button.btn.c-tomato", { onclick: () => { Muzik.durdur(); m.close(); T.muzikDurum && T.muzikDurum(); } }, T.icon("pause"), "Durdur") : null,
      h("p.hint", "Müzik bölümler arasında geçerken çalmaya devam eder. Spotify bağlantını değiştirmek ya da kendi sesini eklemek için ana sayfadaki atmosfer kartını kullan."));
    m = T.modal({ title: "Sınıf atmosferi", body: govde(), actions: [{ label: "Kapat" }] });
  };
  function kartSec() {
    const g = Object.assign({}, gizli());
    T.modal({ title: "Ana sayfa kartları", body: h("div", { style: { display: "grid", gap: "8px" } }, KARTLAR.map(([k, l]) => h("label.bt-madde", h("input", { type: "checkbox", checked: g[k] ? null : true, onchange: (e) => (g[k] = !e.target.checked) }), h("span", l)))),
      actions: [{ label: "Vazgeç" }, { label: "Uygula", tone: "c-leaf", onClick: () => { ayarYaz((x) => (x.gizli = g)); T.route(); } }] });
  }
})();
