/* Farklılaştırma: öğretmenin kendi dersine göre doldurduğu boş şablonlar.
   Hazır içerik yok. Her araç seçili sınıfa göre bu cihazda saklanır. Öğrenci adları hiçbir yere gönderilmez. */
(function () {
  const { h } = T;
  const cid = () => T.store.activeClass().id;
  const oku = (k, bos) => { const s = T.store.get(); const v = ((s.farkli || {})[cid()] || {})[k]; return v ? JSON.parse(JSON.stringify(v)) : bos(); };
  const yaz = (k, v) => T.store.update((s) => { s.farkli = s.farkli || {}; const c = (s.farkli[cid()] = s.farkli[cid()] || {}); c[k] = v; });
  const RENK = ["#E2412F", "#1F7AE0", "#F4B400", "#2FA84F", "#7B4FD6", "#EC5D9A", "#0E8A8A", "#E07A1F"];
  const metin = (deger, ph, f, cls = "") => { const t = h("textarea.fk-yaz" + cls, { rows: 2, placeholder: ph, "aria-label": ph }); t.value = deger || ""; t.addEventListener("input", () => f(t.value)); return t; };
  /* Üst şerit: başlık ve Düzenle / Sınıfta */
  const ust = (v, kaydet, mod, modYap, ek) => h("div.fk-ust",
    h("input.in.fk-baslik", { value: v.baslik || "", placeholder: "Konu ya da başlık yazın", "aria-label": "Başlık", oninput: (e) => { v.baslik = e.target.value; kaydet(); } }),
    h("div.seg", [["duzen", "Düzenle"], ["sinif", "Sınıfta göster"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => modYap(k) }, l))),
    ek || null);
  const bilgi = (yazi) => h("p.fk-bilgi", yazi);
  const sinifBaslik = (v) => (v.baslik ? h("h2.fk-sb", v.baslik) : null);

  /* ---------- Izgara seçim panosu: Tic-Tac-Toe (3×3) ve Bingo (5×5) ---------- */
  function izgara(n, anahtar, aciklama) {
    return (host) => {
      let v = oku(anahtar, () => ({ baslik: "", h: Array(n * n).fill(""), sec: [] })), mod = "duzen";
      const kaydet = () => yaz(anahtar, v); const kap = h("div"); host.append(kap);
      const cizgiler = () => { const L = []; for (let i = 0; i < n; i++) { L.push([...Array(n)].map((_, j) => i * n + j)); L.push([...Array(n)].map((_, j) => j * n + i)); } L.push([...Array(n)].map((_, j) => j * n + j)); L.push([...Array(n)].map((_, j) => j * n + n - 1 - j)); return L; };
      const ciz = () => {
        const tam = cizgiler().filter((l) => l.every((i) => v.sec.includes(i))).flat();
        kap.replaceChildren(ust(v, kaydet, mod, (k) => { mod = k; ciz(); }),
          mod === "duzen" ? bilgi(aciklama + " Kutulara görevleri yazın, sonra Sınıfta göster'e geçin.") : sinifBaslik(v),
          h("div.fk-izgara", { style: { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }, "data-n": n }, v.h.map((t, i) => mod === "duzen"
            ? metin(t, n > 3 ? String(i + 1) : (i + 1) + ". görev", (x) => { v.h[i] = x; kaydet(); })
            : h("button.fk-hucre" + (v.sec.includes(i) ? ".sec" : "") + (tam.includes(i) ? ".tam" : ""), { onclick: () => { v.sec = v.sec.includes(i) ? v.sec.filter((x) => x !== i) : v.sec.concat(i); kaydet(); T.sound.pop(); ciz(); } }, t || ""))),
          mod === "sinif" ? h("div.row", { style: { gap: "8px" } }, h("span.hint", tam.length ? "Bir sıra tamamlandı!" : "Yatay, dikey ya da çapraz bir sırayı tamamla."), h("button.btn.sm.c-chalk", { onclick: () => { v.sec = []; kaydet(); ciz(); } }, T.icon("reset"), "İşaretleri sil")) : null);
      };
      ciz();
    };
  }

  /* ---------- Liste yardımcıları ---------- */
  const listeDuzen = (dizi, ph, kaydet, yeniden) => h("div.fk-liste", dizi.map((t, i) => h("div.fk-satir", metin(t, ph, (x) => { dizi[i] = x; kaydet(); }), h("button.fk-sil", { "aria-label": "Sil", onclick: () => { dizi.splice(i, 1); kaydet(); yeniden(); } }, "×"))),
    h("button.fk-ekle", { onclick: () => { dizi.push(""); kaydet(); yeniden(); } }, T.icon("plus"), "Ekle"));

  /* ---------- Öğrenme menüsü ---------- */
  function menu(host) {
    let v = oku("menu", () => ({ baslik: "", ana: [""], yan: [""], tatli: [""], yanSay: 1, sec: {} })), mod = "duzen";
    const kaydet = () => yaz("menu", v); const kap = h("div"); host.append(kap);
    const BOL = [["ana", "Ana yemek", "Herkes hepsini yapar."], ["yan", "Yan yemek", ""], ["tatli", "Tatlı", "İsteyen yapar."]];
    const ciz = () => {
      kap.replaceChildren(ust(v, kaydet, mod, (k) => { mod = k; ciz(); }),
        mod === "duzen" ? bilgi("Ana yemek zorunlu görevler, yan yemek seçmeli görevler, tatlı ek görevlerdir.") : sinifBaslik(v),
        h("div.fk-menu", BOL.map(([k, ad, alt]) => h("section.fk-mb.fk-" + k, h("h3", ad), h("small", k === "yan" ? (mod === "duzen" ? h("label", "Kaç tane seçilsin? ", h("input.in", { type: "number", min: 1, max: 9, value: v.yanSay, style: { width: "64px" }, onchange: (e) => { v.yanSay = Math.max(1, +e.target.value || 1); kaydet(); } })) : v.yanSay + " tanesini seç.") : alt),
          mod === "duzen" ? listeDuzen(v[k], "Görev", kaydet, ciz) : h("div.fk-liste", v[k].filter(Boolean).map((t, i) => { const a = k + i; return h("button.fk-madde" + (v.sec[a] ? ".sec" : ""), { onclick: () => { v.sec[a] = !v.sec[a]; kaydet(); ciz(); } }, h("i", v.sec[a] ? "✓" : ""), t); }))))));
    };
    ciz();
  }

  /* ---------- 2-5-8 menüsü ---------- */
  function puanMenu(host) {
    let v = oku("p258", () => ({ baslik: "", hedef: 10, s: { 2: [""], 5: [""], 8: [""] }, sec: [] })), mod = "duzen";
    const kaydet = () => yaz("p258", v); const kap = h("div"); host.append(kap);
    const ciz = () => {
      const top = v.sec.reduce((a, k) => a + +k.split(":")[0], 0);
      kap.replaceChildren(ust(v, kaydet, mod, (k) => { mod = k; ciz(); }, mod === "duzen" ? h("label.fk-etiket", "Hedef puan ", h("input.in", { type: "number", value: v.hedef, style: { width: "70px" }, onchange: (e) => { v.hedef = +e.target.value || 10; kaydet(); } })) : null),
        mod === "duzen" ? bilgi("Görevleri zorluğuna göre 2, 5 ve 8 puanlık sütunlara yazın. Çocuk hedef puanı tamamlayacak kadar görev seçer.") : sinifBaslik(v),
        mod === "sinif" ? h("div.fk-puan" + (top >= v.hedef ? ".tamam" : ""), "Puanın: " + top + " / " + v.hedef) : null,
        h("div.fk-258", [2, 5, 8].map((p) => h("section", h("h3", p + " puan"), mod === "duzen" ? listeDuzen(v.s[p], p + " puanlık görev", kaydet, ciz)
          : h("div.fk-liste", v.s[p].filter(Boolean).map((t, i) => { const a = p + ":" + i, s = v.sec.includes(a); return h("button.fk-madde" + (s ? ".sec" : ""), { onclick: () => { v.sec = s ? v.sec.filter((x) => x !== a) : v.sec.concat(a); kaydet(); ciz(); } }, h("i", s ? "✓" : ""), t); }))))),
        mod === "sinif" ? h("button.btn.sm.c-chalk", { onclick: () => { v.sec = []; kaydet(); ciz(); } }, T.icon("reset"), "Seçimleri sil") : null);
    };
    ciz();
  }

  /* ---------- RAFT ---------- */
  function raft(host) {
    let v = oku("raft", () => ({ baslik: "", r: [["", "", "", ""]] })), mod = "duzen", sec = -1;
    const kaydet = () => yaz("raft", v); const kap = h("div"); host.append(kap);
    const BAS = [["R", "Rol", "Öğrenci kim olarak yazıyor?"], ["A", "Hedef kitle", "Kime yazıyor?"], ["F", "Biçim", "Mektup, afiş, günlük, haber..."], ["T", "Konu", "Ne hakkında yazıyor?"]];
    const ciz = () => {
      kap.replaceChildren(ust(v, kaydet, mod, (k) => { mod = k; sec = -1; ciz(); }),
        h("div.fk-aciklama", h("b", "RAFT nedir?"), " Çocuk bir yazma görevini dört seçimle kurar: ", BAS.map(([l, a, s]) => h("span.fk-harf", h("b", l), " " + a + ": " + s + " "))),
        h("table.fk-tablo", h("tr", BAS.map(([l, a]) => h("th", h("b", l), " " + a)), mod === "duzen" ? h("th") : null),
          v.r.map((row, i) => h("tr" + (sec === i ? ".sec" : ""), row.map((c, j) => h("td", mod === "duzen" ? metin(c, BAS[j][1], (x) => { v.r[i][j] = x; kaydet(); }) : h("button.fk-td", { onclick: () => { sec = sec === i ? -1 : i; ciz(); } }, c))),
            mod === "duzen" ? h("td", h("button.fk-sil", { "aria-label": "Satırı sil", onclick: () => { v.r.splice(i, 1); if (!v.r.length) v.r.push(["", "", "", ""]); kaydet(); ciz(); } }, "×")) : null))),
        h("div.row", { style: { gap: "8px" } }, mod === "duzen" ? h("button.fk-ekle", { onclick: () => { v.r.push(["", "", "", ""]); kaydet(); ciz(); } }, T.icon("plus"), "Satır ekle") : h("button.btn.c-sun", { onclick: () => { const L = v.r.map((_, i) => i).filter((i) => v.r[i].some(Boolean)); if (L.length) { sec = T.pick(L); T.sound.ding && T.sound.ding(); ciz(); } } }, T.icon("dice"), "Rastgele bir satır")));
    };
    ciz();
  }

  /* ---------- SCAMPER ---------- */
  function scamper(host) {
    const H = [["S", "Yerine koy", "Neyi başka bir şeyle değiştirebiliriz?"], ["C", "Birleştir", "Hangi iki fikri ya da parçayı birleştirebiliriz?"], ["A", "Uyarla", "Başka bir yerdeki çözümü buraya nasıl uyarlarız?"], ["M", "Değiştir", "Büyütsek, küçültsek, biçimini değiştirsek ne olur?"], ["P", "Başka amaçla kullan", "Bu başka ne işe yarayabilir?"], ["E", "Çıkar", "Neyi çıkarırsak daha sade olur?"], ["R", "Tersine çevir", "Sırasını ya da yönünü değiştirsek ne olur?"]];
    let v = oku("scamper", () => ({ baslik: "", s: Array(7).fill(""), not: H.map(() => []) })), mod = "duzen", acik = -1;
    const kaydet = () => yaz("scamper", v); const kap = h("div"); host.append(kap);
    const ciz = () => {
      kap.replaceChildren(ust(v, kaydet, mod, (k) => { mod = k; ciz(); }),
        h("div.fk-aciklama", h("b", "SCAMPER nedir?"), " Var olan bir şeyi yedi soruyla yeniden düşünme yolu. Her harf bir düşünme hamlesidir. Konuyu yazın, her harfe kendi sorunuzu ekleyin."),
        sinifBaslik(v),
        h("div.fk-scamper", H.map(([l, a, ip], i) => h("section.fk-sc" + (acik === i ? ".acik" : ""), { style: { "--c": RENK[i % 8] } }, h("div.fk-sc-bas", h("b", l), h("span", a)),
          mod === "duzen" ? metin(v.s[i], ip, (x) => { v.s[i] = x; kaydet(); }) : h("p", v.s[i] || ip),
          mod === "sinif" ? notKutu(v.not[i], kaydet, ciz) : null))));
    };
    ciz();
  }
  /* yapışkan not ekleyen küçük kutu */
  const notKutu = (dizi, kaydet, yeniden) => { const inp = h("input.in", { placeholder: "Fikir yaz, Enter", "aria-label": "Fikir" }); inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim()) { dizi.push(inp.value.trim()); kaydet(); yeniden(); } });
    return h("div.fk-notlar", dizi.map((t, i) => h("span.fk-not", t, h("button", { "aria-label": "Sil", onclick: () => { dizi.splice(i, 1); kaydet(); yeniden(); } }, "×"))), inp); };

  /* ---------- KWL ---------- */
  function kwl(host) {
    let v = oku("kwl", () => ({ baslik: "", k: [[], [], []] }));
    const kaydet = () => yaz("kwl", v); const kap = h("div"); host.append(kap);
    const S2 = [["K", "Biliyorum", "Bu konuda ne biliyoruz?"], ["W", "Merak ediyorum", "Ne öğrenmek istiyoruz?"], ["L", "Öğrendim", "Ne öğrendik?"]];
    const ciz = () => {
      kap.replaceChildren(h("div.fk-ust", h("input.in.fk-baslik", { value: v.baslik, placeholder: "Konu yazın", "aria-label": "Konu", oninput: (e) => { v.baslik = e.target.value; kaydet(); } })),
        h("div.fk-kwl", S2.map(([l, a, s], i) => h("section", { style: { "--c": RENK[i + 1] } }, h("h3", h("b", l), " " + a), h("small", s), notKutu(v.k[i], kaydet, ciz)))));
    };
    ciz();
  }

  /* ---------- Zarla seçilen altı görev: Düşünce noktaları ve Kübikleme ---------- */
  function zarli(anahtar, basliklar, aciklama) {
    return (host) => {
      let v = oku(anahtar, () => ({ baslik: "", g: Array(6).fill("") })), mod = "duzen", gelen = -1;
      const kaydet = () => yaz(anahtar, v); const kap = h("div"); host.append(kap);
      const nokta = (k) => h("span.fk-zar", { "data-n": k + 1 }, [...Array(k + 1)].map(() => h("i")));
      const ciz = () => {
        kap.replaceChildren(ust(v, kaydet, mod, (k) => { mod = k; gelen = -1; ciz(); }),
          bilgi(aciklama), mod === "sinif" ? sinifBaslik(v) : null,
          h("div.fk-alti", v.g.map((t, i) => h("section.fk-yuz" + (gelen === i ? ".gel" : ""), { style: { "--c": RENK[i] } }, h("div.fk-yuz-bas", nokta(i), basliklar ? h("b", basliklar[i][0]) : null),
            mod === "duzen" ? metin(t, basliklar ? basliklar[i][1] : (i + 1) + ". görev", (x) => { v.g[i] = x; kaydet(); }) : h("p", t || (basliklar ? basliklar[i][1] : ""))))),
          mod === "sinif" ? h("button.btn.big.c-sun", { onclick: () => { let k = 0; const dn = () => { gelen = T.rand(0, 5); ciz(); if (++k < 9) setTimeout(dn, 90); else T.sound.ding && T.sound.ding(); }; dn(); } }, T.icon("dice"), "Zar at") : null);
      };
      ciz();
    };
  }

  /* ---------- Farklılaştırma eşitleyici ---------- */
  const EKSEN = [["Temel", "Dönüştürücü"], ["Somut", "Soyut"], ["Basit", "Karmaşık"], ["Tek yönlü", "Çok yönlü"], ["Küçük adım", "Büyük sıçrama"], ["Yapılandırılmış", "Açık uçlu"], ["Desteğe bağlı", "Bağımsız"], ["Yavaş", "Hızlı"]];
  function esitleyici(host) {
    let v = oku("esit", () => ({ baslik: "", g: [{ ad: "", d: EKSEN.map(() => 50), not: "" }] }));
    const kaydet = () => yaz("esit", v); const kap = h("div"); host.append(kap);
    const ciz = () => {
      kap.replaceChildren(h("div.fk-ust", h("input.in.fk-baslik", { value: v.baslik, placeholder: "Ders ya da etkinlik", "aria-label": "Başlık", oninput: (e) => { v.baslik = e.target.value; kaydet(); } })),
        bilgi("Her grup için görevin nerede duracağını seçin. Sürgüyü sağa çektikçe görev zorlaşır."),
        h("div.fk-esit", v.g.map((g, gi) => h("section", { style: { "--c": RENK[gi % 8] } },
          h("div.row", { style: { gap: "6px" } }, h("input.in", { value: g.ad, placeholder: "Grup adı", "aria-label": "Grup adı", oninput: (e) => { g.ad = e.target.value; kaydet(); } }), v.g.length > 1 ? h("button.fk-sil", { "aria-label": "Grubu sil", onclick: () => { v.g.splice(gi, 1); kaydet(); ciz(); } }, "×") : null),
          EKSEN.map(([a, b], i) => h("label.fk-surgu", h("span", a), h("input", { type: "range", min: 0, max: 100, value: g.d[i], "aria-label": a + " ile " + b, oninput: (e) => { g.d[i] = +e.target.value; kaydet(); } }), h("span", b))),
          metin(g.not, "Bu grup ne yapacak?", (x) => { g.not = x; kaydet(); })))),
        v.g.length < 6 ? h("button.fk-ekle", { onclick: () => { v.g.push({ ad: "", d: EKSEN.map(() => 50), not: "" }); kaydet(); ciz(); } }, T.icon("plus"), "Grup ekle") : null);
    };
    ciz();
  }

  /* ---------- Öğrenci listesi yardımcıları (yalnız bu cihazda) ---------- */
  const ogrenciler = () => (T.store.activeClass().students || []).map((o) => ({ id: o.id, ad: o.name }));
  const karistir = (a) => T.shuffle ? T.shuffle(a.slice()) : a.slice().sort(() => Math.random() - 0.5);
  const bol = (L, n) => { const g = Array.from({ length: n }, () => []); L.forEach((x, i) => g[i % n].push(x)); return g; };

  /* ---------- İstasyon ve gruplama ---------- */
  function istasyon(host) {
    let v = oku("ist", () => ({ ist: ["", "", ""], gruplar: [], tur: 0, dk: 10 })), kalan = 0, zaman = null;
    const kaydet = () => yaz("ist", v); const kap = h("div"); host.append(kap);
    T.cleanups && T.cleanups.push(() => clearInterval(zaman));
    const ad = (id) => (ogrenciler().find((o) => o.id === id) || {}).ad || "?";
    const ciz = () => {
      const n = v.ist.length, sure = kalan > 0 ? Math.floor(kalan / 60) + ":" + String(kalan % 60).padStart(2, "0") : null;
      kap.replaceChildren(bilgi("İstasyonları yazın, grupları kurun. Süre dolunca her grup bir sonraki istasyona geçer."),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap" } },
          h("button.btn.c-sun", { onclick: () => { const L = karistir(ogrenciler().map((o) => o.id)); if (!L.length) return T.toast("Önce sınıf listesine öğrenci ekleyin"); v.gruplar = bol(L, n); v.tur = 0; kaydet(); ciz(); } }, T.icon("groups"), "Grupları kur"),
          h("button.btn.c-chalk", { onclick: () => { v.tur = (v.tur + 1) % n; kaydet(); T.sound.bell && T.sound.bell(); ciz(); } }, T.icon("rotate"), "Döndür"),
          h("label.fk-etiket", "Süre (dk) ", h("input.in", { type: "number", min: 1, max: 60, value: v.dk, style: { width: "64px" }, onchange: (e) => { v.dk = Math.max(1, +e.target.value || 10); kaydet(); } })),
          h("button.btn.c-leaf", { onclick: () => { clearInterval(zaman); kalan = v.dk * 60; zaman = setInterval(() => { kalan--; const z = kap.querySelector(".fk-sure"); if (z) z.textContent = Math.floor(kalan / 60) + ":" + String(kalan % 60).padStart(2, "0"); if (kalan <= 0) { clearInterval(zaman); T.sound.bell && T.sound.bell(); v.tur = (v.tur + 1) % n; kaydet(); ciz(); } }, 1000); ciz(); } }, T.icon("play"), "Süreyi başlat"),
          sure ? h("b.fk-sure", sure) : null),
        h("div.fk-istler", v.ist.map((t, i) => { const gi = (i - v.tur + n) % n, g = v.gruplar[gi];
          return h("section", { style: { "--c": RENK[i % 8] } }, h("div.row", { style: { gap: "6px" } }, h("input.in", { value: t, placeholder: (i + 1) + ". istasyon", "aria-label": (i + 1) + ". istasyon", oninput: (e) => { v.ist[i] = e.target.value; kaydet(); } }), n > 2 ? h("button.fk-sil", { "aria-label": "İstasyonu sil", onclick: () => { v.ist.splice(i, 1); v.gruplar = []; kaydet(); ciz(); } }, "×") : null),
            g ? h("div.fk-grup", h("small", "Grup " + (gi + 1)), h("div", g.map((id) => h("span.fk-ad", ad(id))))) : h("p.hint", "Grup yok")); })),
        v.ist.length < 8 ? h("button.fk-ekle", { onclick: () => { v.ist.push(""); v.gruplar = []; kaydet(); ciz(); } }, T.icon("plus"), "İstasyon ekle") : null);
    };
    ciz();
  }

  /* ---------- Yapboz (jigsaw) ---------- */
  function yapboz(host) {
    let v = oku("yap", () => ({ baslik: "", p: ["", "", "", ""], ev: [] })), evre = "ev";
    const kaydet = () => yaz("yap", v); const kap = h("div"); host.append(kap);
    const ad = (id) => (ogrenciler().find((o) => o.id === id) || {}).ad || "?";
    const ciz = () => {
      const n = v.p.length;
      const uzman = v.p.map((_, pi) => v.ev.map((g) => g[pi]).filter(Boolean));
      kap.replaceChildren(h("div.fk-ust", h("input.in.fk-baslik", { value: v.baslik, placeholder: "Konu", "aria-label": "Konu", oninput: (e) => { v.baslik = e.target.value; kaydet(); } })),
        bilgi("Konuyu parçalara bölün. Önce aynı parçayı alanlar uzman grubunda çalışır, sonra herkes ev grubuna dönüp kendi parçasını öğretir."),
        h("div.fk-parcalar", v.p.map((t, i) => h("div.fk-satir", { style: { "--c": RENK[i % 8] } }, h("b.fk-pb", String.fromCharCode(65 + i)), metin(t, String.fromCharCode(65 + i) + " parçası", (x) => { v.p[i] = x; kaydet(); }), n > 2 ? h("button.fk-sil", { "aria-label": "Sil", onclick: () => { v.p.splice(i, 1); v.ev = []; kaydet(); ciz(); } }, "×") : null)),
          n < 6 ? h("button.fk-ekle", { onclick: () => { v.p.push(""); v.ev = []; kaydet(); ciz(); } }, T.icon("plus"), "Parça ekle") : null),
        h("div.row", { style: { gap: "8px", flexWrap: "wrap" } },
          h("button.btn.c-sun", { onclick: () => { const L = karistir(ogrenciler().map((o) => o.id)); if (!L.length) return T.toast("Önce sınıf listesine öğrenci ekleyin"); const say = Math.ceil(L.length / n); v.ev = Array.from({ length: say }, (_, k) => L.slice(k * n, k * n + n)); kaydet(); ciz(); } }, T.icon("groups"), "Grupları kur"),
          v.ev.length ? h("div.seg", [["uzman", "1. Uzman grupları"], ["ev", "2. Ev grupları"]].map(([k, l]) => h("button", { "aria-pressed": String(evre === k), onclick: () => { evre = k; ciz(); } }, l))) : null),
        v.ev.length ? h("div.fk-istler", evre === "ev"
          ? v.ev.map((g, gi) => h("section", h("h3", "Ev grubu " + (gi + 1)), h("div", g.map((id, pi) => h("span.fk-ad", { style: { "--c": RENK[pi % 8] } }, h("b", String.fromCharCode(65 + pi)), " " + ad(id))))))
          : uzman.map((L, pi) => h("section", { style: { "--c": RENK[pi % 8] } }, h("h3", String.fromCharCode(65 + pi) + " uzmanları"), h("small", v.p[pi] || ""), h("div", L.map((id) => h("span.fk-ad", ad(id))))))) : null);
    };
    ciz();
  }

  /* ---------- Trafik ışığı: anlama durumu ---------- */
  function trafik(host) {
    let v = oku("trafik", () => ({ soru: "", d: {}, say: [0, 0, 0] })), isimli = true;
    const kaydet = () => yaz("trafik", v); const kap = h("div"); host.append(kap);
    const ISIK = [["kirmizi", "Takıldım", "#E2412F"], ["sari", "Biraz zorlanıyorum", "#F4B400"], ["yesil", "Anladım", "#2FA84F"]];
    const ciz = () => {
      const L = ogrenciler(), say = isimli ? ISIK.map((_, i) => L.filter((o) => v.d[o.id] === i).length) : v.say;
      kap.replaceChildren(h("div.fk-ust", h("input.in.fk-baslik", { value: v.soru, placeholder: "Neyi değerlendiriyoruz? Örnek: Eldeli toplama", "aria-label": "Konu", oninput: (e) => { v.soru = e.target.value; kaydet(); } }),
          h("div.seg", [[true, "İsimlerle"], [false, "İsimsiz sayaç"]].map(([k, l]) => h("button", { "aria-pressed": String(isimli === k), onclick: () => { isimli = k; ciz(); } }, l)))),
        h("div.fk-isiklar", ISIK.map(([k, a, c], i) => h("div.fk-isik", { style: { "--c": c } }, h("i"), h("b", a), h("span", say[i]), !isimli ? h("div.row", { style: { gap: "4px" } }, h("button.btn.sm.c-chalk", { onclick: () => { v.say[i] = Math.max(0, v.say[i] - 1); kaydet(); ciz(); } }, "−"), h("button.btn.sm.c-chalk", { onclick: () => { v.say[i]++; kaydet(); T.sound.pop(); ciz(); } }, "+")) : null))),
        isimli ? h("div.fk-adlar", L.length ? L.map((o) => { const d = v.d[o.id]; return h("button.fk-adb", { style: { "--c": d == null ? "#CBD3DE" : ISIK[d][2] }, onclick: () => { v.d[o.id] = d == null ? 2 : d === 0 ? null : d - 1; kaydet(); T.sound.pop(); ciz(); } }, h("i"), o.ad); }) : h("p.hint", "Sınıf listesine öğrenci ekleyin ya da isimsiz sayacı kullanın.")) : null,
        h("div.row", { style: { gap: "8px" } }, isimli ? h("span.hint", "İsme dokundukça yeşil, sarı, kırmızı olur.") : null, h("button.btn.sm.c-chalk", { onclick: () => { v.d = {}; v.say = [0, 0, 0]; kaydet(); ciz(); } }, T.icon("reset"), "Sıfırla")));
    };
    ciz();
  }

  /* ---------- Bitirenler köşesi ---------- */
  function bitiren(host) {
    let v = oku("bitir", () => ({ g: [""] })), mod = "duzen", oner = -1;
    const kaydet = () => yaz("bitir", v); const kap = h("div"); host.append(kap);
    const ciz = () => {
      const L = v.g.filter(Boolean);
      kap.replaceChildren(h("div.fk-ust", h("b", "İşini erken bitirenler için"), h("div.seg", [["duzen", "Düzenle"], ["sinif", "Sınıfta göster"]].map(([k, l]) => h("button", { "aria-pressed": String(mod === k), onclick: () => { mod = k; ciz(); } }, l)))),
        mod === "duzen" ? h("div", bilgi("Derse bağlı, kendi başına yapılabilen ek görevler yazın."), listeDuzen(v.g, "Ek görev", kaydet, ciz))
          : h("div", h("div.fk-kartlar", L.map((t, i) => h("div.fk-kart" + (oner === i ? ".gel" : ""), { style: { "--c": RENK[i % 8] } }, t))),
            L.length ? h("button.btn.big.c-sun", { onclick: () => { oner = T.rand(0, L.length - 1); T.sound.ding && T.sound.ding(); ciz(); } }, T.icon("dice"), "Bana bir görev öner") : null));
    };
    ciz();
  }

  /* ---------- Araçları kaydet ---------- */
  const A = [
    ["Seçim panoları", [
      ["fk-tictactoe", "Tic-Tac-Toe seçim panosu", "grid", "Çocuk bir sırayı tamamlayan üç görev seçer", izgara(3, "ttt", "Dokuz görev yazın. Çocuk yatay, dikey ya da çapraz bir sırayı tamamlar.")],
      ["fk-bingo", "Bingo seçim panosu", "grid100", "5×5 görev kartı, bir sırayı tamamla", izgara(5, "bingo", "Yirmi beş görev yazın. Çocuk bir sırayı tamamlar.")],
      ["fk-menu", "Öğrenme menüsü", "recipe", "Ana yemek, yan yemek, tatlı", menu],
      ["fk-258", "2-5-8 menüsü", "star", "Puanlı görevlerle hedefe ulaş", puanMenu]]],
    ["Görev ve ürün", [
      ["fk-raft", "RAFT", "pen", "Rol, hedef kitle, biçim, konu", raft],
      ["fk-scamper", "SCAMPER", "spark", "Yedi soruyla yeniden düşün", scamper],
      ["fk-nokta", "Düşünce noktaları", "dice", "Zarla gelen görev", zarli("nokta", null, "Altı görev yazın. Sınıfta zar atılır, gelen görev yapılır. Grupları farklı renkte zarlarla ayırabilirsiniz.")],
      ["fk-kup", "Kübikleme küpü", "blocks", "Bir konuya altı yönden bak", zarli("kup", [["Betimle", "Nasıl görünüyor?"], ["Karşılaştır", "Neye benziyor, neden farklı?"], ["İlişkilendir", "Aklına ne getiriyor?"], ["Çözümle", "Hangi parçalardan oluşuyor?"], ["Uygula", "Ne işe yarar, nasıl kullanılır?"], ["Savun", "Lehinde ya da aleyhinde ne söylersin?"]], "Küpün altı yüzü altı düşünme yoludur. Her yüze konunuza uygun görevi yazın.")]]],
    ["Gruplama ve süreç", [
      ["fk-istasyon", "İstasyon ve gruplama", "groups", "Gruplar istasyonlarda döner", istasyon],
      ["fk-yapboz", "Yapboz", "tangram", "Uzman grupları ve ev grupları", yapboz],
      ["fk-esit", "Farklılaştırma eşitleyici", "filter", "Görevi her gruba göre ayarla", esitleyici]]],
    ["Takip", [
      ["fk-kwl", "KWL", "talk", "Biliyorum, merak ediyorum, öğrendim", kwl],
      ["fk-trafik", "Trafik ışığı", "traffic", "Kim anladı, kim takıldı?", trafik],
      ["fk-bitiren", "Bitirenler köşesi", "trophy", "Erken bitirenlere ek görev", bitiren]]],
  ];
  A.forEach(([, L]) => L.forEach(([id, title, icon, short, render]) => { T.tools[id] = { cat: "farkli", back: "farkli", title, icon, tone: "grape", grades: [1, 8], short, render }; }));

  T.sections.farkli = {
    title: "Farklılaştırma", icon: "filter", tone: "grape", desc: "Seçim panoları, RAFT, SCAMPER, gruplama",
    render(view, sub) {
      if (sub && T.tools[sub]) return T.toolPage(view, sub);
      const wrap = h("div.view-inner"); view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Farklılaştırma"), h("div.sub", "Boş şablonlar. Kendi dersinize göre doldurun, sınıfta gösterin. Yazdıklarınız seçili sınıf için bu cihazda saklanır.")));
      A.forEach(([ad, L]) => wrap.append(h("div.section-title", h("h2", ad)), h("div.tool-grid", { style: { marginBottom: "18px" } }, L.map(([id]) => T.aracKart("farkli-" + id, T.tools[id], "grape")))));
    },
  };
})();
