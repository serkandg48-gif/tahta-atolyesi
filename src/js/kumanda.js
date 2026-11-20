/* Cep kumandası ve defter kamerası: öğretmen tahtadaki QR'ı telefonuyla okutur (uygulama yok, giriş yok).
   Telefon sınıfın arkasından isim çeker, zamanlayıcıyı ve perdeyi yönetir, defter fotoğrafını tahtaya yansıtır.
   Bağlantı kısa ömürlüdür; fotoğraflar sunucuda saklanmaz. */
(function () {
  const { h } = T;
  let ws = null, oda = null, dur = false, gosterge = null, bagli = 0, deneme = 0;
  const yeniOda = () => { const a = new Uint8Array(16); crypto.getRandomValues(a); let s = ""; a.forEach((c) => (s += String.fromCharCode(c))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const tahta = () => (T.board.aktif() ? T.board : T.yuzen);
  const widgetEl = (tip) => document.querySelector(`[data-w][data-type="${tip}"]`);
  const dugmeBas = (tip, metinler) => {
    let el = widgetEl(tip);
    const bas = () => { el = widgetEl(tip); if (!el) return; const b = [...el.querySelectorAll("button")].find((x) => metinler.some((m) => x.textContent.trim().startsWith(m))); b && b.click(); };
    if (!el) { tahta().add(tip); setTimeout(bas, 700); } else bas();
  };
  function fotoGoster(d) {
    fotoKapat();
    const img = h("img", { src: d, alt: "Defter fotoğrafı" });
    const cer = h("div.kf-cer", img);
    const katman = T.kalemKatmani ? T.kalemKatmani(cer) : cer;
    document.body.append(h("div#kumanda-foto", h("div.kf-ust", h("b", "📷 Defterden"), h("button.btn.c-chalk", { onclick: fotoKapat }, T.icon("close"), "Kapat")), katman));
  }
  const fotoKapat = () => { const e = document.getElementById("kumanda-foto"); if (e) e.remove(); };
  function komut(k) {
    if (k === "isim") dugmeBas("name", ["Çevir", "Çek"]);
    else if (k === "zaman") dugmeBas("timer", ["Başlat", "Durdur", "Devam"]);
    else if (k === "perde") T.perde && T.perde();
    else if (k === "sus") T.sssUyari && T.sssUyari(true);
    else if (k === "geri" || k === "ileri") dispatchEvent(new KeyboardEvent("keydown", { key: k === "geri" ? "ArrowLeft" : "ArrowRight", bubbles: true }));
    else if (k === "fotokapat") fotoKapat();
  }
  function gostergeCiz() {
    if (!oda || dur) { gosterge && gosterge.remove(); gosterge = null; return; }
    if (!gosterge) { gosterge = h("div#kumanda-gosterge"); document.body.append(gosterge); }
    gosterge.replaceChildren(h("span", bagli ? "📱 Kumanda bağlı" : "📱 Telefon bekleniyor"), h("button", { onclick: () => T.kumanda(), title: "QR kodu göster" }, "QR"), h("button", { onclick: kapat, title: "Kumandayı kapat" }, "×"));
  }
  function baglan() {
    const p = location.protocol === "https:" ? "wss:" : "ws:";
    try { ws = new WebSocket(p + "//" + location.host + "/api/kumanda?oda=" + oda + "&rol=tahta"); } catch (e) { T.toast("Kumanda bağlantısı kurulamadı"); return; }
    ws.onopen = () => { deneme = 0; gostergeCiz(); };
    ws.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch (er) { return; }
      if (m.t === "baglandi") { bagli = m.n; T.toast("Telefon bağlandı"); const md = document.querySelector(".km-durum"); if (md) md.textContent = "Telefon bağlandı. Bu pencereyi kapatabilirsin."; }
      else if (m.t === "ayrildi") bagli = m.n;
      else if (m.t === "komut") komut(m.k);
      else if (m.t === "foto" && typeof m.d === "string" && m.d.startsWith("data:image/")) fotoGoster(m.d);
      gostergeCiz(); };
    ws.onclose = (e) => { ws = null; if (dur || e.code === 4000) return; if (deneme++ < 6) setTimeout(() => !dur && oda && baglan(), 2000 * deneme); else { T.toast("Kumanda bağlantısı koptu"); kapat(); } };
  }
  function kapat() { dur = true; try { ws && ws.close(); } catch (e) {} ws = null; oda = null; bagli = 0; gostergeCiz(); }
  T.kumanda = function () {
    if (!oda) { dur = false; oda = yeniOda(); baglan(); }
    const url = location.origin + "/kumanda.html#" + oda;
    const qr = h("div.km-qr");
    T.modal({ title: "Cep kumandası", body: h("div.km", h("p", { style: { margin: 0 } }, "Telefonunun kamerasıyla bu kodu okut. Uygulama ya da giriş gerekmez."), qr,
      h("p.km-durum", bagli ? "Telefon bağlı." : "Telefon bekleniyor…"),
      h("p.hint", { style: { margin: 0 } }, "Telefondan isim çekebilir, zamanlayıcıyı ve ekran perdesini yönetebilir, defterdeki bir çözümü fotoğraflayıp tahtaya yansıtabilirsin. Fotoğraflar hiçbir yerde saklanmaz; bağlantı en çok 3 saat sürer.")),
      actions: [{ label: "Kumandayı kapat", onClick: () => kapat() }, { label: "Tamam", tone: "c-leaf" }] });
    if (window.QRCode) { try { new window.QRCode(qr, { text: url, width: 240, height: 240, correctLevel: window.QRCode.CorrectLevel.M }); } catch (e) { qr.textContent = url; } } else qr.append(h("input.in", { value: url, readonly: true }));
    gostergeCiz();
  };
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Cep kumandası ve defter kamerası", ic: "qr", ac: () => T.kumanda(), ek: "Telefondan isim çek, fotoğraf yansıt" });
})();
