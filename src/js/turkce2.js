/* Türkçe güçlendirme: okuma hızı (sayaçlı, kayan yazı, satır satır), metin uyarlayıcı (Diffit benzeri),
   5N1K çarkı, eş ve zıt anlam, noktalama ve büyük harf, dikte, hikâye zarları. Metinler bu uygulama için yazılmıştır. */
(function () {
  const { h } = T; const S = T.svg;
  const tool = (id, def) => (T.tools[id] = Object.assign({ back: "turkce", grades: [1, 4] }, def));
  const cid = () => T.store.activeClass().id;
  const present = () => { const s = T.store.get(), c = T.store.activeClass(); const day = (s.attendance[c.id] || {})[T.isoDate()] || {}; return c.students.filter((x) => day[x.id] !== "yok"); };
  const seg = (opts, cur, on) => h("div.seg", opts.map(([v, l]) => h("button", { "aria-pressed": String(v === cur), onclick: () => on(v) }, l)));

  /* ---------- Okuma metinleri (sınıf düzeyine göre) ---------- */
  const METIN = {
    1: [["Top", "Ela ile Ali parka gitti. Ali topu attı. Ela topu tuttu. İkisi de çok güldü."],
      ["Kek", "Annem kek yaptı. Kek sıcacıktı. Ben bir dilim aldım. Kardeşime de verdim."],
      ["Tekir", "Kedimiz Tekir pencerede uyur. Güneş onu ısıtır. Bir kuş gelince hemen uyanır. Kuşa bakar, sonra yine uyur."]],
    2: [["Bahçedeki domatesler", "Dedemin küçük bir bahçesi var. Her sabah domatesleri sular. Geçen hafta ben de ona yardım ettim. Toprağı birlikte çapaladık. Domatesler kızardığında birlikte toplayacağız. Dedem, sabırlı olanın bahçesi güzel olur, diyor."],
      ["Kayıp eldiven", "Okuldan dönerken bir eldiven buldum. Mavi ve yumuşaktı. Eldiveni okulun kapısındaki kayıp eşya kutusuna bıraktım. Ertesi gün sınıfımızdan Deniz, eldivenini bulduğu için çok sevindi. Bana teşekkür etti. Ben de çok mutlu oldum."]],
    3: [["Arıların dansı", "Arılar çiçeklerden nektar toplayarak bal yapar. Bir arı güzel çiçeklerle dolu bir yer bulduğunda kovana döner ve özel bir dans yapar. Bu dansla diğer arılara çiçeklerin hangi yönde ve ne kadar uzakta olduğunu anlatır. Diğer arılar dansı izler, sonra aynı yere uçar. Böylece kovandaki bütün arılar birlikte çalışır. Bir kavanoz bal için arıların binlerce çiçeği ziyaret etmesi gerekir. Bu yüzden balı israf etmemeliyiz."],
      ["Sınıf bitkimiz", "Sınıfımıza küçük bir fasulye fidesi getirdik. Her gün ölçüp boyunu bir tabloya yazdık. İlk hafta çok az uzadı. İkinci hafta onu pencerenin önüne taşıdık. Fidemiz güneşi görünce hızla büyümeye başladı. Yapraklarının güneşe doğru döndüğünü fark ettik. Öğretmenimiz, bitkilerin yaşamak için ışığa, suya ve havaya ihtiyaç duyduğunu söyledi. Şimdi her sabah ilk iş fidemize bakıyoruz."]],
    4: [["Deniz kaplumbağaları", "Deniz kaplumbağaları milyonlarca yıldır denizlerde yaşar. Dişi kaplumbağalar yumurtlamak için yumuşak kumlu sahillere gelir. Geceleri kuma çukur kazar, yumurtalarını bırakır ve üzerini örterek denize döner. Yaklaşık iki ay sonra yumurtalardan yavrular çıkar. Yavrular ay ışığının denizdeki parıltısını izleyerek suya ulaşır. Sahildeki parlak ışıklar onların yönünü şaşırtabilir. Bu yüzden yuvalama sahillerinde geceleri ışıkların kısılması ve kumda çukur bırakılmaması önemlidir. Küçük bir dikkat, binlerce yavrunun denize kavuşmasını sağlar."],
      ["Kütüphane günü", "Okulumuzda her ay bir kütüphane günü yapılır. O gün her sınıf, okuduğu bir kitabı diğer sınıflara tanıtır. Biz bu ay bir bilim insanının hayatını anlatan kitabı seçtik. Grubumuzla kitabın en heyecanlı bölümünü canlandırmaya karar verdik. Provalarda bazen güldük, bazen tartıştık. Sonunda herkesin fikrinden bir parça alarak gösterimizi hazırladık. Gösteriden sonra küçük sınıflardan birçok öğrenci kitabı ödünç almak için sıraya girdi. Bir kitabı paylaşmanın onu okumak kadar keyifli olduğunu o gün anladım."]],
  };
  T.okumaMetinleri = METIN;

  /* ---------- 1. Okuma hızı ---------- */
  tool("okuma-hizi", {
    title: "Okuma hızı", icon: "speed", tone: "sky", grades: [1, 8], short: "Sayaçlı okuma, kayan yazı, satır satır; hata işaretle, gelişimi izle",
    render(host) {
      const g = Math.min(4, Math.max(1, T.store.grade()));
      let metin = T._okumaMetni || METIN[g][0][1]; T._okumaMetni = null;
      let mod = "sayac", ogr = "", boyut = g <= 2 ? 40 : 32, hece = g <= 2, hiz = g <= 1 ? 30 : g === 2 ? 50 : g === 3 ? 70 : 90;
      let calisiyor = false, bas = 0, gecen = 0, iv = null, hatalar = new Set(), sonKelime = null, bitti = false, bekliyor = false;
      const box = h("div"); host.append(box);
      T.onLeave(() => { clearInterval(iv); cancelAnimationFrame(T._kyRaf); });
      const kelimeler = () => metin.trim().split(/\s+/).filter(Boolean);
      function kaynakSec() {
        const list = h("div", { style: { display: "grid", gap: "8px" } }, [1, 2, 3, 4].map((s) => h("div", h("b", s + ". sınıf"), h("div.row", { style: { gap: "6px", marginTop: "4px" } }, METIN[s].map(([ad, t]) => h("button.btn.sm.c-chalk", { onclick: () => { metin = t; sifirla(); m.close(); } }, ad))))));
        const ta = h("textarea.in", { placeholder: "Kendi metnini yapıştır", style: { minHeight: "120px", fontSize: "18px" } });
        const m = T.modal({ title: "Okuma metni seç", wide: true, body: h("div", { style: { display: "grid", gap: "14px" } }, list, h("b", "Kendi metnim"), ta, h("p.hint", "Yapay zekâ ile metin üretmek için Metin uyarlayıcıyı kullan; oradan 'Okuma hızında aç' ile buraya gelir.")), actions: [{ label: "Kapat" }, { label: "Bu metni kullan", tone: "c-leaf", onClick: () => { if (!ta.value.trim()) return false; metin = ta.value.trim(); sifirla(); } }] });
      }
      function sifirla() { clearInterval(iv); cancelAnimationFrame(T._kyRaf); calisiyor = false; gecen = 0; hatalar = new Set(); sonKelime = null; bitti = false; bekliyor = false; ciz(); }
      const kelimeSpan = (w, i) => {
        const parca = hece && w.replace(/[^a-zçğıöşüâîûA-ZÇĞİÖŞÜ]/g, "").length > 2 ? T.heceler(w) : [w];
        return h("span.ok-w" + (hatalar.has(i) ? ".hata" : "") + (sonKelime != null && i > sonKelime ? ".okunmadi" : "") + (sonKelime === i ? ".son" : ""), { "data-i": i },
          parca.map((p, j) => h("span" + (hece && parca.length > 1 ? (j % 2 ? ".h2" : ".h1") : ""), p)));
      };
      function sonuc() {
        const ws = kelimeler(); const okunan = sonKelime != null ? sonKelime + 1 : ws.length;
        const hata = [...hatalar].filter((i) => i < okunan).length, dk = gecen / 60000;
        const ddk = dk ? Math.round((okunan - hata) / dk) : 0, dog = okunan ? Math.round(((okunan - hata) / okunan) * 100) : 0;
        return { okunan, hata, ddk, dog, sn: Math.round(gecen / 1000) };
      }
      function gecmisCiz() {
        if (!ogr) return null;
        const st = T.store.activeClass().students.find((x) => x.id === ogr); if (!st) return null;
        const l = ((T.store.get().okuma || {})[cid()] || {})[ogr] || [];
        if (!l.length) return h("p.hint", st.name + " için henüz kayıtlı ölçüm yok.");
        const max = Math.max(...l.map((x) => x.ddk), 10);
        return h("div.sb-card", h("h3", st.name + ": okuma gelişimi"), h("div.ok-graf", l.slice(-12).map((x) => h("div", { title: x.d }, h("i", { style: { height: (x.ddk / max) * 100 + "%" } }), h("b", x.ddk), h("small", x.d.slice(5).split("-").reverse().join("."))))), h("p.hint", "Dakikada doğru okunan kelime sayısı. Çocuğu yalnızca kendi önceki ölçümüyle karşılaştır."));
      }
      function ciz() {
        const ws = kelimeler(); const st = T.store.activeClass().students;
        const ustBar = h("div.row", { style: { marginBottom: "12px" } },
          seg([["sayac", "Sayaçlı okuma"], ["kayan", "Kayan yazı"], ["satir", "Satır satır"]], mod, (v) => { mod = v; sifirla(); }),
          h("button.btn.sm.c-chalk", { onclick: kaynakSec }, T.icon("text"), "Metni değiştir"),
          h("select.in", { style: { width: "auto" }, onchange: (e) => { ogr = e.target.value; ciz(); }, "aria-label": "Öğrenci" }, h("option", { value: "" }, "Öğrenci seç (isteğe bağlı)"), st.map((x) => h("option", { value: x.id, selected: x.id === ogr ? true : null }, x.name))),
          h("div.spacer"),
          h("button.btn.sm.icon.c-chalk", { "aria-label": "Yazıyı küçült", onclick: () => { boyut = Math.max(20, boyut - 4); ciz(); } }, "A−"), h("button.btn.sm.icon.c-chalk", { "aria-label": "Yazıyı büyüt", onclick: () => { boyut = Math.min(72, boyut + 4); ciz(); } }, "A+"),
          h("button.btn.sm" + (hece ? "" : ".c-chalk"), { onclick: () => { hece = !hece; ciz(); } }, "Hece renkli"));
        let govde;
        if (mod === "sayac") {
          const s = Math.floor(gecen / 1000);
          const metinEl = h("div.ok-metin", { style: { fontSize: boyut + "px" } }, ws.map((w, i) => [kelimeSpan(w, i), " "]));
          metinEl.addEventListener("click", (e) => { const sp = e.target.closest(".ok-w"); if (!sp) return; const i = +sp.dataset.i; if (bekliyor) { sonKelime = i; bekliyor = false; bitti = true; ciz(); return; } if (!calisiyor && !bitti) return; hatalar.has(i) ? hatalar.delete(i) : hatalar.add(i); T.sound.tick && T.sound.tick(); ciz(); });
          const r = sonuc();
          govde = h("div.ok-grid",
            h("div", metinEl, bekliyor ? h("p.dy-tip", "Öğrencinin son okuduğu kelimeye dokun.") : calisiyor ? h("p.hint", "Öğrenci okurken takıldığı ya da yanlış okuduğu kelimeye dokun. Bir daha dokunursan işaret kalkar.") : null),
            h("div.ok-yan",
              h("div.ok-sure", `${Math.floor(s / 60)}:${T.pad(s % 60)}`),
              !calisiyor && !bitti && !bekliyor ? h("button.btn.big", { onclick: () => { calisiyor = true; bas = Date.now() - gecen; iv = setInterval(() => { gecen = Date.now() - bas; const el = box.querySelector(".ok-sure"); if (el) { const k = Math.floor(gecen / 1000); el.textContent = `${Math.floor(k / 60)}:${T.pad(k % 60)}`; } if (bir && gecen >= 60000) dur(true); }, 200); ciz(); } }, T.icon("play"), gecen ? "Devam" : "Başlat") : null,
              calisiyor ? h("button.btn.big.c-tomato", { onclick: () => dur(false) }, T.icon("check"), "Bitir") : null,
              h("label.ok-bir", h("input", { type: "checkbox", checked: bir ? true : null, onchange: (e) => (bir = e.target.checked) }), "1 dakikada dur"),
              bitti ? h("div.ok-sonuc", h("div", h("b", r.ddk), h("small", "doğru kelime / dakika")), h("div", h("b", "%" + r.dog), h("small", "doğruluk")), h("div", h("b", r.okunan), h("small", "okunan kelime")), h("div", h("b", r.hata), h("small", "hata")),
                ogr ? h("button.btn.c-leaf", { onclick: () => { T.store.update((s2) => { s2.okuma = s2.okuma || {}; s2.okuma[cid()] = s2.okuma[cid()] || {}; (s2.okuma[cid()][ogr] = s2.okuma[cid()][ogr] || []).push({ d: T.isoDate(), ddk: r.ddk, dog: r.dog, k: r.okunan }); }); T.toast("Kaydedildi"); ciz(); } }, T.icon("check"), "Öğrenciye kaydet") : h("p.hint", "Kaydetmek için yukarıdan öğrenci seç.")) : null,
              gecen || bitti ? h("button.btn.sm.c-chalk", { onclick: sifirla }, T.icon("reset"), "Sıfırla") : null));
        } else if (mod === "kayan") {
          const ic = h("div.ky-ic", { style: { fontSize: boyut + "px" } }, ws.map((w, i) => [kelimeSpan(w, i), " "]));
          const pencere = h("div.ky-pencere", h("div.ky-cizgi"), ic);
          let y = 0, son = 0;
          const oynat = () => { calisiyor = !calisiyor; btn.replaceChildren(T.icon(calisiyor ? "pause" : "play"), calisiyor ? "Durdur" : "Başlat"); if (calisiyor) { son = performance.now(); const f = (t) => { if (!calisiyor) return; const dt = (t - son) / 1000; son = t; const toplamPx = ic.scrollHeight, sure = (ws.length / hiz) * 60; y += (toplamPx / sure) * dt; ic.style.transform = `translateY(${pencere.clientHeight * 0.4 - y}px)`; if (y < toplamPx) T._kyRaf = requestAnimationFrame(f); else { calisiyor = false; btn.replaceChildren(T.icon("play"), "Baştan"); y = 0; } }; T._kyRaf = requestAnimationFrame(f); } };
          const btn = h("button.btn.big", { onclick: oynat }, T.icon("play"), "Başlat");
          setTimeout(() => (ic.style.transform = `translateY(${pencere.clientHeight * 0.4}px)`), 0);
          govde = h("div", pencere, h("div.row", { style: { marginTop: "12px" } }, btn, hizKontrol(), h("button.btn.c-chalk", { onclick: () => { calisiyor = false; y = 0; ic.style.transform = `translateY(${pencere.clientHeight * 0.4}px)`; btn.replaceChildren(T.icon("play"), "Başlat"); } }, T.icon("reset"), "Başa al"), h("span.hint", "Yazı seçtiğin hızda yukarı kayar. Çocuklar ortadaki çizgide okur.")));
        } else {
          const metinEl = h("div.ok-metin", { style: { fontSize: boyut + "px" } }, ws.map((w, i) => [kelimeSpan(w, i), " "]));
          let i = -1;
          const ilerle = () => { const sp = metinEl.querySelectorAll(".ok-w"); sp.forEach((x, j) => { x.classList.toggle("aktif", j === i); x.classList.toggle("gecti", j < i); }); };
          const oynat = () => { if (calisiyor) { calisiyor = false; clearInterval(iv); btn.replaceChildren(T.icon("play"), "Devam"); return; } calisiyor = true; btn.replaceChildren(T.icon("pause"), "Durdur"); iv = setInterval(() => { i++; if (i >= ws.length) { clearInterval(iv); calisiyor = false; btn.replaceChildren(T.icon("play"), "Baştan"); i = -1; } ilerle(); }, 60000 / hiz); };
          const btn = h("button.btn.big", { onclick: oynat }, T.icon("play"), "Başlat");
          govde = h("div", metinEl, h("div.row", { style: { marginTop: "12px" } }, btn, hizKontrol(), h("button.btn.c-chalk", { onclick: () => T.speak(metin.slice(0, 400)) }, T.icon("speaker"), "Örnek okuma dinle"), h("span.hint", "Vurgu seçtiğin hızda kelime kelime ilerler. Koro okuma ve izleyerek okuma için.")));
        }
        box.replaceChildren(ustBar, govde, gecmisCiz());
      }
      let bir = false;
      function dur(otomatik) { clearInterval(iv); calisiyor = false; gecen = otomatik ? 60000 : Date.now() - bas; bekliyor = true; T.sound.ok(); ciz(); }
      function hizKontrol() {
        const out = h("b", hiz + " kelime/dk");
        return h("label.ok-hiz", "Hız", h("input", { type: "range", min: 15, max: 160, step: 5, value: hiz, oninput: (e) => { hiz = +e.target.value; out.textContent = hiz + " kelime/dk"; } }), out);
      }
      ciz();
    },
  });

  /* ---------- 2. Metin uyarlayıcı (Diffit benzeri) ---------- */
  const ORNEK = { baslik: "Arıların dansı", metin: METIN[3][0][1], kelimeler: [{ k: "nektar", a: "Çiçeklerin içindeki tatlı sıvı." }, { k: "kovan", a: "Arıların birlikte yaşadığı yuva." }, { k: "israf", a: "Bir şeyi gereksiz yere harcamak." }],
    coktan: [{ s: "Arı diğer arılara çiçeklerin yerini nasıl anlatır?", c: ["Vızıldayarak", "Özel bir dans yaparak", "Çiçek getirerek", "Kovanın önünde bekleyerek"], d: 1 }, { s: "Bir kavanoz bal için ne gerekir?", c: ["Birkaç çiçek", "Yüzlerce arı", "Binlerce çiçeğin ziyaret edilmesi", "Bir gün"], d: 2 }],
    acik: ["Arıların birlikte çalışması bize ne anlatıyor?", "Balı neden israf etmemeliyiz? Kendi cümlelerinle açıkla."], dy: [{ i: "Arılar meyvelerden bal yapar.", d: false }, { i: "Arıların dansı yön ve uzaklık bilgisi verir.", d: true }],
    etkinlik: "Bir arının dans yolunu kâğıda çiz. Arkadaşına dansınla bir yerin yönünü anlatmayı dene." };
  tool("metin-uyarla", {
    title: "Metin uyarlayıcı", icon: "spark", tone: "grape", grades: [1, 8], short: "Konudan ya da metinden sınıfa uygun okuma, kelimeler, sorular",
    render(host) {
      const g = Math.min(4, Math.max(1, T.store.grade()));
      let kaynak = "konu", sonucV = null, sinif = g, uzunluk = "orta", tur = "bilgilendirici";
      const sec = { kelime: true, coktan: true, acik: true, dy: true, etkinlik: true };
      const konu = h("input.in", { placeholder: "Konu (ör. Deniz kaplumbağaları, Ramazan Bayramı, mıknatıslar)", style: { fontSize: "19px" } });
      const ta = h("textarea.in", { placeholder: "Uyarlanacak metni buraya yapıştır", style: { minHeight: "160px", fontSize: "17px" } });
      const durum = h("div"); const cikti = h("div");
      const box = h("div"); host.append(box);
      function form() {
        box.replaceChildren(h("div.mu-grid",
          h("div.sb-card.mu-form",
            h("h3", "Ne hazırlayalım?"),
            seg([["konu", "Konudan üret"], ["metin", "Metni uyarla"]], kaynak, (v) => { kaynak = v; form(); }),
            kaynak === "konu" ? konu : ta,
            h("label.mu-l", "Sınıf düzeyi", seg([1, 2, 3, 4].map((x) => [x, x + ". sınıf"]), sinif, (v) => { sinif = v; form(); })),
            h("label.mu-l", "Uzunluk", seg([["kisa", "Kısa"], ["orta", "Orta"], ["uzun", "Uzun"]], uzunluk, (v) => { uzunluk = v; form(); })),
            kaynak === "konu" ? h("label.mu-l", "Tür", seg([["bilgilendirici", "Bilgilendirici"], ["hikaye", "Hikâye"]], tur, (v) => { tur = v; form(); })) : null,
            h("div.mu-l", "Eklensin", h("div.mu-checks", [["kelime", "Anahtar kelimeler"], ["coktan", "Çoktan seçmeli"], ["acik", "Açık uçlu"], ["dy", "Doğru-yanlış"], ["etkinlik", "Etkinlik önerisi"]].map(([k, l]) => h("label", h("input", { type: "checkbox", checked: sec[k] ? true : null, onchange: (e) => (sec[k] = e.target.checked) }), l)))),
            h("button.btn.big", { onclick: uret }, T.icon("spark"), "Oluştur"), durum,
            h("p.hint", "Öğrenci adı ya da kişisel bilgi yazma. Kayıtlı metinler bu cihazda saklanır.")),
          h("div", cikti)));
        kayitlilar();
      }
      function kayitlilar() {
        const l = ((T.store.get().metinler || {})[cid()] || []);
        if (sonucV || !l.length) return;
        cikti.replaceChildren(h("div.sb-card", h("h3", "Kayıtlı metinlerim"), l.slice().reverse().map((x) => h("div.row", { style: { borderBottom: "1px solid var(--line)", padding: "8px 0" } }, h("b", { style: { flex: 1 } }, x.baslik), h("span.hint", x.sinif + ". sınıf"), h("button.btn.sm.c-chalk", { onclick: () => { sonucV = x; goster(); } }, "Aç")))));
      }
      async function uret() {
        const girdi = kaynak === "konu" ? konu.value.trim() : ta.value.trim();
        if (!girdi) { T.toast(kaynak === "konu" ? "Bir konu yaz" : "Bir metin yapıştır"); return; }
        if (!T.ai.mode()) { sonucV = Object.assign({ sinif: 3 }, ORNEK); durum.replaceChildren(h("p.hint", "Yapay zekâ bağlı değil; örnek çıktı gösteriliyor. Ayarlar'dan Google ile giriş yap.")); goster(); return; }
        durum.replaceChildren(h("div.ai-status", h("div.spinner"), "Hazırlanıyor..."));
        const kel = { 1: "toplam 40-60 kelime, cümleler 3-6 kelime, yalnızca sık kullanılan kelimeler", 2: "toplam 70-110 kelime, cümleler 5-9 kelime", 3: "toplam 110-160 kelime, cümleler 6-12 kelime", 4: "toplam 150-220 kelime, cümleler 8-15 kelime" }[sinif];
        const carpan = { kisa: 0.7, orta: 1, uzun: 1.4 }[uzunluk];
        try {
          const j = await T.ai.askJSON(`Sen Türkiye'de ilkokulda çalışan deneyimli bir sınıf öğretmenisin. ${sinif}. sınıf öğrencileri için okuma materyali hazırla.
${kaynak === "konu" ? `Konu: ${girdi}\nTür: ${tur === "hikaye" ? "özgün bir çocuk hikâyesi" : "bilgilendirici metin"}` : `Aşağıdaki metni ${sinif}. sınıf düzeyine uyarla. Bilgileri koru, dili sadeleştir, metni kopyalama, kendi cümlelerinle yeniden yaz:\n"""${girdi.slice(0, 6000)}"""`}
Metin ölçüsü: ${kel}; uzunluk çarpanı ${carpan}.
Kurallar: TDK yazım kurallarına uy. Doğal, akıcı Türkçe kullan; çeviri kokan cümle kurma. Bilgiler doğru olsun, emin olmadığın sayı ya da bilgi yazma. Gerçek kişilerden alıntı uydurma.
${sec.kelime ? "3-5 anahtar kelime ve çocuk diliyle kısa anlamları." : ""}${sec.coktan ? " 3 çoktan seçmeli soru (4 seçenek, tek doğru)." : ""}${sec.acik ? " 2 açık uçlu düşündüren soru." : ""}${sec.dy ? " 3 doğru-yanlış ifadesi." : ""}${sec.etkinlik ? " 1 kısa sınıf içi etkinlik önerisi (yazma, çizme ya da canlandırma)." : ""}
JSON: {"baslik":"", "metin":"", "kelimeler":[{"k":"","a":""}], "coktan":[{"s":"","c":["","","",""],"d":0}], "acik":[""], "dy":[{"i":"","d":true}], "etkinlik":""}`);
          sonucV = Object.assign({ sinif }, j); durum.replaceChildren(); goster();
        } catch (e) { durum.replaceChildren(h("p.hint", "Oluşturulamadı: " + (e.message || "bağlantı sorunu"))); }
      }
      function goster() {
        const r = sonucV; if (!r) return;
        const harf = "abcd";
        const kagit = h("div.mu-kagit",
          h("h2", r.baslik || "Okuma metni"), h("div.mu-metin", String(r.metin || "").split(/\n+/).map((p) => h("p", p))),
          (r.kelimeler || []).length ? h("div.mu-bolum", h("h3", "Anahtar kelimeler"), h("dl", r.kelimeler.map((x) => [h("dt", x.k), h("dd", x.a)]))) : null,
          (r.coktan || []).length ? h("div.mu-bolum", h("h3", "Soruları cevaplayalım"), h("ol", r.coktan.map((q) => h("li", h("p", q.s), h("div.mu-sec", (q.c || []).map((c, i) => h("span", harf[i] + ") " + c))))))) : null,
          (r.dy || []).length ? h("div.mu-bolum", h("h3", "Doğru mu, yanlış mı?"), h("ul.mu-dy", r.dy.map((x) => h("li", h("span.kutu"), x.i)))) : null,
          (r.acik || []).length ? h("div.mu-bolum", h("h3", "Düşünelim, yazalım"), h("ol", r.acik.map((x) => h("li", h("p", x), h("div.mu-satir"), h("div.mu-satir"))))) : null,
          r.etkinlik ? h("div.mu-bolum", h("h3", "Etkinlik"), h("p", r.etkinlik)) : null);
        const cevap = h("details.mu-cevap", h("summary", "Cevap anahtarı (öğretmen için)"), h("ol", (r.coktan || []).map((q) => h("li", harf[q.d] + ") " + (q.c || [])[q.d]))), h("ul", (r.dy || []).map((x) => h("li", x.i + " " + (x.d ? "Doğru" : "Yanlış")))));
        cikti.replaceChildren(
          h("div.row", { style: { marginBottom: "10px" } },
            h("button.btn", { onclick: () => { T._okumaMetni = r.metin; T.go("turkce-okuma-hizi"); } }, T.icon("speed"), "Okuma hızında aç"),
            h("button.btn.c-chalk", { onclick: () => yazdir(kagit, r.baslik) }, T.icon("download"), "Yazdır ya da PDF"),
            h("button.btn.c-chalk", { onclick: () => { T.store.update((s) => { s.metinler = s.metinler || {}; (s.metinler[cid()] = s.metinler[cid()] || []).push(Object.assign({ id: T.uid(), d: T.isoDate() }, r)); }); T.toast("Kaydedildi"); } }, T.icon("check"), "Kaydet"),
            h("button.btn.c-chalk", { onclick: () => T.speak(String(r.metin).slice(0, 400)) }, T.icon("speaker"), "Dinle"),
            h("button.btn.c-chalk", { onclick: () => { sonucV = null; cikti.replaceChildren(); kayitlilar(); } }, "Kapat")),
          kagit, cevap);
      }
      function yazdir(el, baslik) {
        const w = window.open("", "_blank"); if (!w) { T.toast("Açılır pencereye izin ver"); return; }
        w.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${baslik || "Okuma"}</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:30px auto;font-size:16pt;line-height:1.55;color:#111}h2{font-size:24pt}h3{font-size:15pt;margin-top:22px;border-bottom:1px solid #999}dt{font-weight:bold}dd{margin:0 0 8px 0}.mu-sec span{display:inline-block;margin-right:20px}.mu-satir{border-bottom:1px solid #aaa;height:32px}.mu-dy{list-style:none;padding:0}.kutu{display:inline-block;width:18px;height:18px;border:1.5px solid #333;margin-right:10px;vertical-align:-3px}</style></head><body>${el.innerHTML}</body></html>`);
        w.document.close(); setTimeout(() => w.print(), 300);
      }
      form();
    },
  });

  /* ---------- 3. 5N1K çarkı ---------- */
  const N1K = [["Kim?", "#3C8DD8", "Olayda kimler var?"], ["Ne?", "#E9A23B", "Ne oldu?"], ["Nerede?", "#2E8B57", "Olay nerede geçiyor?"], ["Ne zaman?", "#7A5BC7", "Olay ne zaman oldu?"], ["Neden?", "#C2453A", "Bu neden oldu?"], ["Nasıl?", "#D16BA5", "Nasıl oldu?"]];
  tool("5n1k", {
    title: "5N1K çarkı", icon: "dice", tone: "sun", short: "Çarkı çevir, soruyu ve cevaplayacak arkadaşı seç",
    render(host) {
      let aci = 0, secilen = null, kisi = null;
      const box = h("div"); host.append(box);
      function cark() {
        const s = S("svg", { viewBox: "-110 -110 220 220", class: "nk-cark" });
        const g = S("g", { style: `transform: rotate(${aci}deg); transition: transform 3s cubic-bezier(.2,.8,.2,1); transform-origin: 0 0` });
        N1K.forEach(([ad, renk], i) => { const a0 = (i * 60 - 90) * Math.PI / 180, a1 = ((i + 1) * 60 - 90) * Math.PI / 180;
          g.append(S("path", { d: `M0 0L${100 * Math.cos(a0)} ${100 * Math.sin(a0)}A100 100 0 0 1 ${100 * Math.cos(a1)} ${100 * Math.sin(a1)}Z`, fill: renk, stroke: "#fff", "stroke-width": 2 }));
          const am = (i * 60 - 60) * Math.PI / 180; const t = S("text", { x: 64 * Math.cos(am), y: 64 * Math.sin(am), "text-anchor": "middle", "dominant-baseline": "middle", fill: "#fff", "font-size": 13, "font-weight": 800, transform: `rotate(${i * 60 - 60 + 90} ${64 * Math.cos(am)} ${64 * Math.sin(am)})` }, ad); g.append(t); });
        s.append(g, S("circle", { r: 14, fill: "#fff", stroke: "#1B2A4A", "stroke-width": 3 }), S("path", { d: "M-10 -112L10 -112L0 -92Z", fill: "#1B2A4A" }));
        return s;
      }
      function ciz() {
        box.replaceChildren(h("div.nk-grid", h("div", cark()),
          h("div.sb-card", { style: { display: "grid", gap: "14px", alignContent: "start" } },
            secilen != null ? [h("div.nk-soru", { style: { "--c": N1K[secilen][1] } }, N1K[secilen][0]), h("p.sb-line", N1K[secilen][2])] : h("p.sb-line", "Okuduğumuz metin için çarkı çevir."),
            kisi ? h("div.sb-who", T.avatar(kisi.name, 48), h("b", { style: { fontSize: "26px" } }, kisi.name)) : null,
            h("div.row", h("button.btn.big", { onclick: () => { const k = T.rand(0, 5); aci += 1440 + (360 - k * 60 - 30) - (aci % 360); secilen = null; kisi = null; ciz(); setTimeout(() => { secilen = k; T.speak(N1K[k][0]); ciz(); }, 3000); } }, T.icon("dice"), "Çarkı çevir"),
              h("button.btn.c-chalk", { onclick: () => { kisi = T.pick(present()); if (kisi) T.speak(kisi.name); ciz(); } }, T.icon("class"), "Kim cevaplayacak?")))));
      }
      ciz();
    },
  });

  /* ---------- 4. Eş ve zıt anlam ---------- */
  const ES = [["büyük", "iri"], ["hızlı", "çabuk"], ["cevap", "yanıt"], ["kırmızı", "al"], ["siyah", "kara"], ["beyaz", "ak"], ["doktor", "hekim"], ["yıl", "sene"], ["ad", "isim"], ["armağan", "hediye"], ["misafir", "konuk"], ["yaşlı", "ihtiyar"], ["fakir", "yoksul"], ["okul", "mektep"], ["öğrenci", "talebe"], ["mutlu", "sevinçli"]];
  const ZIT = [["büyük", "küçük"], ["uzun", "kısa"], ["sıcak", "soğuk"], ["açık", "kapalı"], ["hızlı", "yavaş"], ["gece", "gündüz"], ["iyi", "kötü"], ["dolu", "boş"], ["ağır", "hafif"], ["ileri", "geri"], ["temiz", "kirli"], ["ince", "kalın"], ["erken", "geç"], ["alçak", "yüksek"], ["kolay", "zor"], ["eski", "yeni"], ["var", "yok"], ["genç", "yaşlı"]];
  tool("es-zit", {
    title: "Eş ve zıt anlam", icon: "turn", tone: "leaf", short: "Kelime çiftlerini eşleştir",
    render(host) {
      let tur = "zit", sol = [], sag = [], secSol = null, eslesen = new Set(), yanlis = null;
      const box = h("div"); host.append(box);
      const yeni = () => { const ciftler = T.shuffle((tur === "es" ? ES : ZIT).slice()).slice(0, 6); sol = ciftler.map((c) => c[0]); sag = T.shuffle(ciftler.map((c) => c[1])); box._c = ciftler; eslesen = new Set(); secSol = null; ciz(); };
      function ciz() {
        const c = box._c;
        box.replaceChildren(h("div.row", seg([["zit", "Zıt anlam"], ["es", "Eş anlam"]], tur, (v) => { tur = v; yeni(); }), h("button.btn.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeni kelimeler"), h("span.hint", "Soldan bir kelime seç, sonra sağdan " + (tur === "es" ? "eş anlamlısını" : "zıt anlamlısını") + " bul.")),
          h("div.ez-grid", h("div.ez-col", sol.map((w) => h("button.ez-k" + (eslesen.has(w) ? ".ok" : secSol === w ? ".on" : ""), { onclick: () => { if (eslesen.has(w)) return; secSol = w; T.speak(w); ciz(); } }, w))),
            h("div.ez-col", sag.map((w) => { const es = c.find((x) => x[1] === w); const tamam = eslesen.has(es[0]); return h("button.ez-k" + (tamam ? ".ok" : yanlis === w ? ".no" : ""), { onclick: () => { if (!secSol || tamam) return; if (c.find((x) => x[0] === secSol)[1] === w) { eslesen.add(secSol); T.sound.ok(); T.speak(secSol + ", " + w); secSol = null; if (eslesen.size === c.length) setTimeout(() => T.toast("Hepsi eşleşti!"), 300); } else { yanlis = w; T.sound.no(); setTimeout(() => { yanlis = null; ciz(); }, 600); } ciz(); } }, w); }))));
      }
      yeni();
    },
  });

  /* ---------- 5. Noktalama ve büyük harf ---------- */
  const SON = [["Bugün hava çok güzel", "."], ["Okula kaç yaşında başladın", "?"], ["Eyvah, süt taştı", "!"], ["Yarın parka gidecek miyiz", "?"], ["Kitabımı çantama koydum", "."], ["Ne kadar güzel bir resim", "!"], ["Adın ne", "?"], ["Kediler balık sever", "."], ["Dikkat et, düşeceksin", "!"], ["Bu kalem senin mi", "?"], ["Annem bize çorba yaptı", "."], ["Yaşasın, kar yağıyor", "!"]];
  const BUYUK = [["ayşe ile mehmet izmir'e gitti.", [0, 2, 3]], ["dedem her yaz antalya'ya gelir.", [0, 3]], ["köpeğimizin adı karabaş.", [0, 2]], ["atatürk 1881 yılında selanik'te doğdu.", [0, 3]], ["kardeşim zeynep çok kitap okur.", [0, 1]], ["yarın ege denizi'ne gideceğiz.", [0, 1, 2]], ["türkiye'nin başkenti ankara'dır.", [0, 2]], ["teyzem pazartesi günü bursa'dan geldi.", [0, 3]], ["sınıfımızın en uzun boylusu can.", [0, 4]]];
  tool("noktalama", {
    title: "Noktalama ve büyük harf", icon: "spell", tone: "sky", grades: [1, 4], short: "Cümle sonu işareti ve büyük harf avı",
    render(host) {
      let mod = "son", i = 0, cevap = null, secili = new Set(), kontrol = false;
      const sonL = T.shuffle(SON.slice()), bL = T.shuffle(BUYUK.slice());
      const box = h("div"); host.append(box);
      function ciz() {
        let ic;
        if (mod === "son") {
          const [c, d] = sonL[i % sonL.length];
          ic = h("div.dy-card", h("div.dy-durum", c, h("span.nt-bos", cevap || "_")),
            h("div.row", { style: { justifyContent: "center", gap: "14px" } }, [[".", "Nokta"], ["?", "Soru işareti"], ["!", "Ünlem"]].map(([k, l]) => h("button.btn.big" + (cevap ? (k === d ? ".c-leaf" : k === cevap ? ".c-tomato" : ".c-chalk") : ".c-chalk"), { onclick: () => { if (cevap) return; cevap = k; k === d ? T.sound.ok() : T.sound.no(); ciz(); } }, h("b", { style: { fontSize: "34px" } }, k), l))),
            cevap ? h("p.sb-line", cevap === d ? "Doğru!" : "Bu cümlenin sonuna " + { ".": "nokta", "?": "soru işareti", "!": "ünlem" }[d] + " gelir. Cümleyi o duyguyla bir daha okuyalım.") : null,
            h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => T.speak(c) }, T.icon("speaker"), "Dinle"), h("button.btn", { onclick: () => { i++; cevap = null; ciz(); } }, T.icon("next"), "Sıradaki")));
        } else {
          const [c, d] = bL[i % bL.length]; const ws = c.split(" ");
          ic = h("div.dy-card", h("p.sb-line", "Büyük harfle başlaması gereken kelimelere dokun."),
            h("div.nt-kel", ws.map((w, j) => { const on = secili.has(j); const dogru = d.includes(j); const goster = on ? w[0].toLocaleUpperCase("tr") + w.slice(1) : w; return h("button.nt-k" + (on ? ".on" : "") + (kontrol ? (dogru && on ? ".ok" : dogru !== on ? ".no" : "") : ""), { onclick: () => { if (kontrol) return; on ? secili.delete(j) : secili.add(j); ciz(); } }, goster); })),
            kontrol ? h("p.sb-line", d.every((x) => secili.has(x)) && secili.size === d.length ? "Harika, hepsi doğru!" : "Kırmızı olanlara bir daha bakalım: cümle başı, kişi, yer ve hayvan adları büyük harfle başlar.") : null,
            h("div.row", { style: { justifyContent: "center" } }, !kontrol ? h("button.btn.big", { onclick: () => { kontrol = true; ciz(); } }, T.icon("check"), "Kontrol et") : h("button.btn", { onclick: () => { i++; secili = new Set(); kontrol = false; ciz(); } }, T.icon("next"), "Sıradaki")));
        }
        box.replaceChildren(seg([["son", "Cümle sonu işareti"], ["buyuk", "Büyük harf avı"]], mod, (v) => { mod = v; i = 0; cevap = null; secili = new Set(); kontrol = false; ciz(); }), h("div", { style: { marginTop: "14px" } }, ic));
      }
      ciz();
    },
  });

  /* ---------- 6. Dikte ---------- */
  const DIKTE = { 1: ["el", "at", "ana", "nane", "kale", "elma", "kalem", "okul", "masa", "limon"], 2: ["bahçe", "çiçek", "kitap", "pencere", "kardeş", "yağmur", "şemsiye", "öğretmen", "ağaç", "güneş"], 3: ["kütüphane", "arkadaşlık", "yolculuk", "tırtıl", "kelebek", "gözlük", "değirmen", "buzdolabı", "şehir", "yeryüzü"], 4: ["sorumluluk", "bilgisayar", "cumhuriyet", "teşekkür", "merdiven", "özgürlük", "sağlıklı", "çevre", "deneyim", "gelecek"] };
  tool("dikte", {
    title: "Dikte", icon: "speaker", tone: "tomato", short: "Kelimeleri sesli okur, çocuklar yazar, sonra kontrol",
    render(host) {
      const g = Math.min(4, Math.max(1, T.store.grade()));
      let liste = DIKTE[g].slice(), i = -1, goster = false;
      const box = h("div"); host.append(box);
      const oku = (w) => { T.speak(w); setTimeout(() => T.speak(w), 2200); };
      function ciz() {
        const ta = h("textarea.in", { style: { minHeight: "70px", fontSize: "18px" }, placeholder: "Kendi kelimelerin ya da cümlelerin: her satıra bir tane" });
        box.replaceChildren(h("div.dk-grid",
          h("div.sb-card", { style: { display: "grid", gap: "14px", justifyItems: "center", textAlign: "center" } },
            h("div.dk-no", i < 0 ? "Hazır mıyız?" : i + 1 + " / " + liste.length),
            goster && i >= 0 ? h("div.dy-durum", liste[i]) : h("p.sb-line", "Dinle, defterine yaz."),
            h("div.row", { style: { justifyContent: "center" } },
              i >= 0 ? h("button.btn.c-chalk", { onclick: () => oku(liste[i]) }, T.icon("speaker"), "Tekrar oku") : null,
              h("button.btn.big", { onclick: () => { if (i < liste.length - 1) { i++; goster = false; oku(liste[i]); ciz(); } else { goster = true; ciz(); } } }, T.icon("next"), i < liste.length - 1 ? (i < 0 ? "Başla" : "Sıradaki") : "Bitti, kontrol edelim"),
              i >= 0 ? h("button.btn.c-chalk", { onclick: () => { goster = !goster; ciz(); } }, goster ? "Gizle" : "Göster") : null)),
          h("div.sb-card", h("h3", "Dikte listesi"), goster && i >= liste.length - 1 ? h("ol.dk-liste", liste.map((w) => h("li", w))) : h("p.hint", liste.length + " kelime. Bitince hepsi burada görünür; çocuklar kendi yazdıklarını kontrol eder."),
            h("div.row", Object.keys(DIKTE).map((s) => h("button.btn.sm.c-chalk", { onclick: () => { liste = DIKTE[s].slice(); i = -1; goster = false; ciz(); } }, s + ". sınıf listesi"))),
            ta, h("button.btn.sm.c-leaf", { onclick: () => { const l = ta.value.split("\n").map((x) => x.trim()).filter(Boolean); if (l.length) { liste = l; i = -1; goster = false; ciz(); } } }, "Bu listeyi kullan"))));
      }
      ciz();
    },
  });

  /* ---------- 7. Hikâye zarları ---------- */
  const ZAR = { Kahraman: ["meraklı bir kaplumbağa", "unutkan bir robot", "cesur küçük bir kız", "yaşlı bir balıkçı", "uykucu bir kedi", "uzaydan gelen bir çocuk", "konuşan bir ağaç", "utangaç bir ejderha"], Mekân: ["sisli bir ormanda", "bir uzay gemisinde", "okul bahçesinde", "denizin dibinde", "eski bir kütüphanede", "karla kaplı bir köyde", "kalabalık bir pazarda", "bir adanın kıyısında"], Sorun: ["yolunu kaybetti", "sihirli bir kutu buldu", "arkadaşı ona küstü", "büyük bir fırtına başladı", "bir yarışmaya katılmaya karar verdi", "saklı bir kapı buldu", "sesi kayboldu", "önemli bir mektup aldı"], Nesne: ["bir anahtar", "eski bir harita", "kırmızı bir şemsiye", "bir düdük", "parlayan bir taş", "bir fener", "yırtık bir defter", "bir pusula"] };
  tool("hikaye-zarlari", {
    title: "Hikâye zarları", icon: "dice", tone: "grape", short: "Kahraman, mekân, sorun, nesne: zarları at, hikâyeyi kur",
    render(host) {
      let z = {}; const box = h("div"); host.append(box);
      const at = () => { Object.keys(ZAR).forEach((k) => (z[k] = T.pick(ZAR[k]))); ciz(true); };
      function ciz(anim) {
        box.replaceChildren(h("div.hz-zarlar", Object.entries(ZAR).map(([k], i) => h("button.hz-zar" + (anim ? ".at" : ""), { style: { animationDelay: i * 0.12 + "s" }, onclick: () => { z[k] = T.pick(ZAR[k].filter((x) => x !== z[k])); ciz(); } }, h("small", k), h("b", z[k] || "?")))),
          h("div.row", { style: { justifyContent: "center", margin: "16px 0" } }, h("button.btn.big", { onclick: at }, T.icon("dice"), "Zarları at"), z.Kahraman ? h("button.btn.c-chalk", { onclick: () => T.speak(`Bir varmış bir yokmuş, ${z.Mekân} ${z.Kahraman} yaşarmış. Bir gün ${z.Sorun}.`) }, T.icon("speaker"), "Başlangıcı oku") : null),
          z.Kahraman ? h("div.sb-card", h("h3", "Hikâyemiz böyle başlıyor"), h("p.sb-quote", { style: { fontSize: "26px" } }, `Bir varmış bir yokmuş, ${z.Mekân} ${z.Kahraman} yaşarmış. Bir gün ${z.Sorun}. Yanında yalnızca ${z.Nesne} vardı...`),
            h("ul", { style: { fontSize: "19px" } }, h("li", "Kahramanımız ne hissetti?"), h("li", (() => { const n = z.Nesne.replace(/^bir /, ""); return n[0].toLocaleUpperCase("tr") + n.slice(1) + " ona nasıl yardım etti?"; })()), h("li", "Hikâye nasıl bitti?")), h("p.hint", "Tek bir zara dokunursan yalnızca o değişir.")) : h("p.sb-line", { style: { textAlign: "center" } }, "Zarları at, ortaya çıkan kahramanla birlikte bir hikâye kuralım."));
      }
      ciz();
    },
  });
})();
