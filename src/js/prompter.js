/* Rol okuma prompteri: kısa bir diyalogda her karakter kendi renginde, roller sınıf listesinden dağıtılır,
   metin prompter gibi akar; sırası gelen öğrencinin adı ve repliği büyür. */
(function () {
  const { h } = T;
  const ORNEK = [
    ["Kayıp kalem", `Anlatıcı: Teneffüs zili çaldı. Ece çantasını karıştırıyordu.
Ece: Kırmızı kalemim yok! Az önce buradaydı.
Mert: Belki masanın altına düşmüştür. Birlikte bakalım mı?
Ece: Baktım ama göremedim.
Öğretmen: Peki en son nerede kullandın?
Ece: Resim yaparken… Evet, resim köşesinde!
Anlatıcı: İkisi resim köşesine koştu. Kalem boya kutusunun yanındaydı.
Mert: İşte burada! Gördün mü, sakin olunca bulunuyor.
Ece: Teşekkür ederim Mert. Sen olmasan vazgeçecektim.`],
    ["Bahçedeki tohum", `Anlatıcı: Toprağın altında küçük bir tohum uyuyordu.
Tohum: Burası çok karanlık. Dışarıda ne var acaba?
Yağmur: Tıp tıp! Sana biraz su getirdim, küçük tohum.
Tohum: Ooo, ne güzel! İçimde bir şey kıpırdıyor.
Güneş: Şimdi de ben ısıtayım seni. Yukarı doğru uzan.
Tohum: Uzanıyorum… uzanıyorum… Işığı görüyorum!
Anlatıcı: Birkaç gün sonra toprağın üstünde yeşil bir filiz vardı.
Yağmur: Bak, artık bir fidansın!
Güneş: Sabırla bekleyen her tohum bir gün büyür.`],
    ["Pazar yerinde", `Anlatıcı: Cumartesi sabahı Zeynep annesiyle pazara gitti.
Satıcı: Buyurun, taze domates, kıpkırmızı elma!
Annesi: Bir kilo domates kaç lira?
Satıcı: Kırk lira efendim.
Zeynep: Anne, iki kilo alırsak kaç lira öderiz?
Annesi: Sen hesapla bakalım.
Zeynep: Kırk artı kırk… seksen lira!
Satıcı: Aferin sana! Bu elma da benden hediye.
Zeynep: Çok teşekkür ederim. Afiyetle yiyeceğim.`],
  ];
  const RENK = ["#E4553F", "#3B83C4", "#3FA36B", "#8C5BB8", "#E9A23B", "#2BB3B1", "#D9628E"];
  const coz = (metin) => metin.split(/\n+/).map((l) => l.trim()).filter(Boolean).map((l) => { const m = l.match(/^([^:]{1,24}):\s*(.+)$/); return m ? { rol: m[1].trim(), soz: m[2].trim() } : { rol: "Anlatıcı", soz: l }; });
  T.tools["rol-prompter"] = {
    back: "turkce", grup: "Okuma", grades: [2, 8], title: "Rollü okuma", icon: "talk", ikon3: "konusma", tone: "grape",
    short: "Diyaloğu rollere böl, sırası gelenin repliği büyüsün",
    render(host) {
      let metin = ORNEK[0][1], satir = coz(metin), atama = {}, i = 0, akis = false, zam = null, hiz = 1;
      const kap = h("div.rp"); host.append(kap);
      const roller = () => [...new Set(satir.map((x) => x.rol))];
      const renk = (r) => RENK[roller().indexOf(r) % RENK.length];
      const dagit = () => { const s = T.shuffle(T.store.activeClass().students.slice()); atama = {}; roller().forEach((r, k) => { if (s[k]) atama[r] = s[k].name.split(" ")[0]; }); };
      const dur = () => { akis = false; clearTimeout(zam); };
      const ileri = () => { if (i < satir.length - 1) { i++; sahne(); if (akis) planla(); } else { dur(); sahne(); } };
      const planla = () => { clearTimeout(zam); const kelime = satir[i].soz.split(/\s+/).length; zam = setTimeout(ileri, (1500 + kelime * 550) / hiz); };
      const sahneKap = h("div.rp-sahne"), kontrol = h("div.rp-kontrol");
      function sahne() {
        sahneKap.replaceChildren(...satir.map((x, k) => {
          const el = h("div.rp-satir" + (k === i ? ".simdi" : k < i ? ".gecti" : ""), { style: { "--c": renk(x.rol) }, onclick: () => { i = k; sahne(); if (akis) planla(); } },
            h("div.rp-kim", h("b", x.rol), atama[x.rol] ? h("span", atama[x.rol]) : null), h("p", x.soz));
          return el;
        }));
        const s = sahneKap.querySelector(".simdi"); if (s) s.scrollIntoView({ block: "center", behavior: "smooth" });
        kontrol.replaceChildren(
          h("button.btn.c-chalk", { onclick: () => { i = Math.max(0, i - 1); sahne(); if (akis) planla(); } }, T.icon("back"), "Geri"),
          h("button.btn.c-grape", { onclick: () => { if (akis) dur(); else { akis = true; planla(); } sahne(); } }, T.icon(akis ? "pause" : "play"), akis ? "Durdur" : "Kendiliğinden aksın"),
          h("button.btn.c-leaf", { onclick: ileri }, "Sonraki", T.icon("next")),
          h("div.seg", [[0.7, "Yavaş"], [1, "Orta"], [1.4, "Hızlı"]].map(([v, l]) => h("button", { "aria-pressed": String(hiz === v), onclick: () => { hiz = v; sahne(); if (akis) planla(); } }, l))),
          h("span.hint", (i + 1) + " / " + satir.length));
      }
      function ciz() {
        const sec = h("div.seg", ORNEK.map(([ad, m]) => h("button", { "aria-pressed": String(metin === m), onclick: () => { dur(); metin = m; satir = coz(m); i = 0; dagit(); ciz(); } }, ad)));
        kap.replaceChildren(
          h("div.rp-ust", sec,
            h("button.btn.sm.c-chalk", { onclick: () => { const t = h("textarea.in", { rows: 12, placeholder: "Her satıra bir replik: Karakter: söz\nAnlatıcı: Bir gün…\nAli: Merhaba!" }); t.value = metin;
              T.modal({ title: "Kendi diyaloğun", wide: true, body: h("div", { style: { display: "grid", gap: "8px" } }, h("p.hint", { style: { margin: 0 } }, "Her satır bir replik. Satırın başına karakterin adını ve iki nokta yaz."), t),
                actions: [{ label: "Kullan", tone: "c-leaf", onClick: () => { const y = coz(t.value); if (!y.length) return false; dur(); metin = t.value; satir = y; i = 0; dagit(); ciz(); } }] }); } }, T.icon("edit"), "Kendi metnin"),
            h("button.btn.sm.c-sun", { onclick: () => { dagit(); ciz(); } }, T.icon("dice"), "Rolleri dağıt")),
          h("div.rp-roller", roller().map((r) => h("span.rp-rol", { style: { "--c": renk(r) } }, h("b", r), atama[r] ? " · " + atama[r] : ""))),
          sahneKap, kontrol);
        sahne();
      }
      dagit(); ciz();
      const tus = (e) => { if (!kap.isConnected) return removeEventListener("keydown", tus); if (/INPUT|TEXTAREA/.test(e.target.tagName)) return; if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); ileri(); } else if (e.key === "ArrowLeft") { i = Math.max(0, i - 1); sahne(); } };
      addEventListener("keydown", tus);
    },
  };
})();
