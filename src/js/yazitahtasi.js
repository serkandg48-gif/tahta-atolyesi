/* Yazı tahtası: tam ekran boş tahta. Boş, satırlı, kareli, noktalı, izometrik, yazı defteri ve koordinat zemini.
   Kalem, fosforlu kalem, nesne silgisi, metin kutusu, sayfalar, geri al. Sayfalar bu cihazda saklanır. */
(function () {
  const h = T.h;
  const ANAHTAR = "ta-yazi-tahtasi";
  const ZEMIN = [["bos", "Boş"], ["satir", "Satırlı"], ["defter", "Yazı defteri"], ["kare", "Kareli"], ["nokta", "Noktalı"], ["izo", "İzometrik"], ["koord", "Koordinat"]];
  const RENK_KAG = [["beyaz", "Beyaz", "#FFFFFF", "#1B2A4A"], ["krem", "Krem", "#FBF6EA", "#1B2A4A"], ["yesil", "Yeşil tahta", "#1F4D3A", "#F4F1E8"], ["siyah", "Kara tahta", "#1C2128", "#F4F1E8"]];
  const KALEM = ["#1B2A4A", "#E2473B", "#2E86DE", "#2E9E5B", "#F0A329", "#8E44AD"];
  const SANAL = 1600; /* çizimler sanal genişliğe göre saklanır, ekran değişince bozulmaz */
  const oku = () => { try { return JSON.parse(localStorage.getItem(ANAHTAR)) || null; } catch (e) { return null; } };
  const sakla = (d) => { try { localStorage.setItem(ANAHTAR, JSON.stringify(d)); } catch (e) { T.toast("Tahta kaydedilemedi: cihazda yer kalmamış olabilir."); } };
  const yeniSayfa = (z = "satir", k = "beyaz") => ({ z, k, a: 40, cizgi: [], yazi: [] });

  function ac() {
    let d = oku() || { s: [yeniSayfa()], i: 0 };
    let arac = "kalem", renk = KALEM[0], kalin = 4, geri = [];
    const sayfa = () => d.s[d.i];
    const zeminCv = h("canvas.yt-zemin"), cizCv = h("canvas.yt-ciz"), yaziKat = h("div.yt-yazilar");
    const sahne = h("div.yt-sahne", zeminCv, cizCv, yaziKat);
    const ust = h("div.yt-ust"), alt = h("div.yt-alt");
    const kok = h("div.yt-kok", ust, sahne, alt);
    document.body.append(kok);
    const kapat = () => { kaydet(); kok.remove(); document.removeEventListener("keydown", tus); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };
    const tus = (e) => { if (e.target.isContentEditable) return; if ((e.ctrlKey || e.metaKey) && e.key === "z") { geriAl(); e.preventDefault(); } if (e.key === "Escape") kapat(); };
    document.addEventListener("keydown", tus);
    let olc = 1, W = 0, H = 0;
    const zc = zeminCv.getContext("2d"), cc = cizCv.getContext("2d");
    function boyut() {
      const r = sahne.getBoundingClientRect(); W = r.width; H = r.height; olc = W / SANAL;
      [zeminCv, cizCv].forEach((c) => { c.width = W * devicePixelRatio; c.height = H * devicePixelRatio; });
      zemin(); ciz(); yazilar();
    }
    function zemin() {
      const s = sayfa(), [, , bg, ink] = RENK_KAG.find((x) => x[0] === s.k) || RENK_KAG[0], koyu = s.k === "yesil" || s.k === "siyah";
      const x = zc, D = devicePixelRatio, a = s.a * olc * D, w = W * D, hh = H * D;
      x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = bg; x.fillRect(0, 0, w, hh);
      const c1 = koyu ? "rgba(255,255,255,.22)" : "rgba(46,134,222,.28)", c2 = koyu ? "rgba(255,255,255,.4)" : "rgba(226,71,59,.45)";
      x.lineWidth = Math.max(1, D);
      const cizgi = (x1, y1, x2, y2, c, lw) => { x.strokeStyle = c; x.lineWidth = lw || Math.max(1, D); x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); };
      if (s.z === "satir") { for (let y = a * 2; y < hh; y += a) cizgi(0, y, w, y, c1); cizgi(a * 2.2, 0, a * 2.2, hh, c2); }
      else if (s.z === "defter") {
        /* ilkokul yazı defteri: üst, orta (kesikli) ve taban çizgisi; satırlar arası boşluk */
        const sat = a * 2.6;
        for (let y = a * 1.6; y + sat < hh; y += sat) { cizgi(0, y, w, y, c1); x.setLineDash([a * 0.25, a * 0.2]); cizgi(0, y + sat * 0.5 * 0.62, w, y + sat * 0.5 * 0.62, c1); x.setLineDash([]); cizgi(0, y + sat * 0.62, w, y + sat * 0.62, koyu ? "rgba(255,255,255,.45)" : "rgba(226,71,59,.5)", Math.max(1.5, D * 1.5)); }
      }
      else if (s.z === "kare" || s.z === "koord") {
        for (let X = 0; X < w; X += a) cizgi(X, 0, X, hh, c1); for (let Y = 0; Y < hh; Y += a) cizgi(0, Y, w, Y, c1);
        if (s.z === "koord") { const ox = Math.round(w / 2 / a) * a, oy = Math.round(hh / 2 / a) * a, ana = koyu ? "#F4F1E8" : "#1B2A4A"; cizgi(0, oy, w, oy, ana, 2.5 * D); cizgi(ox, 0, ox, hh, ana, 2.5 * D);
          x.fillStyle = ana; x.font = `${Math.round(a * 0.45)}px Onest, sans-serif`; x.textAlign = "center"; x.textBaseline = "top";
          for (let k = -Math.floor(ox / a); k * a + ox < w; k++) if (k) x.fillText(k, ox + k * a, oy + a * 0.12);
          x.textAlign = "right"; x.textBaseline = "middle"; for (let k = -Math.floor(oy / a); k * a + oy < hh; k++) if (k) x.fillText(-k, ox - a * 0.15, oy + k * a); }
      }
      else if (s.z === "nokta") { x.fillStyle = koyu ? "rgba(255,255,255,.45)" : "rgba(27,42,74,.35)"; for (let X = a; X < w; X += a) for (let Y = a; Y < hh; Y += a) { x.beginPath(); x.arc(X, Y, Math.max(1.6, a * 0.06), 0, 7); x.fill(); } }
      else if (s.z === "izo") { const dy = a, dx = a * Math.sqrt(3) / 2; x.fillStyle = koyu ? "rgba(255,255,255,.5)" : "rgba(27,42,74,.4)"; let sat = 0; for (let X = 0; X < w + dx; X += dx, sat++) for (let Y = (sat % 2) * dy / 2; Y < hh; Y += dy) { x.beginPath(); x.arc(X, Y, Math.max(1.6, a * 0.06), 0, 7); x.fill(); }
        x.strokeStyle = koyu ? "rgba(255,255,255,.12)" : "rgba(46,134,222,.15)"; for (let k = -hh; k < w + hh; k += dx * 2) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + hh * Math.sqrt(3), hh); x.stroke(); x.beginPath(); x.moveTo(k, 0); x.lineTo(k - hh * Math.sqrt(3), hh); x.stroke(); } }
      kok.style.setProperty("--yt-ink", ink);
    }
    function cizgiCiz(c, st) {
      const D = devicePixelRatio * olc; if (!st.p.length) return;
      c.globalAlpha = st.f ? 0.35 : 1; c.strokeStyle = st.r; c.lineWidth = st.w * D; c.lineCap = st.f ? "butt" : "round"; c.lineJoin = "round";
      c.beginPath(); c.moveTo(st.p[0][0] * D, st.p[0][1] * D);
      for (let i = 1; i < st.p.length - 1; i++) { const mx = (st.p[i][0] + st.p[i + 1][0]) / 2, my = (st.p[i][1] + st.p[i + 1][1]) / 2; c.quadraticCurveTo(st.p[i][0] * D, st.p[i][1] * D, mx * D, my * D); }
      if (st.p.length > 1) { const L = st.p[st.p.length - 1]; c.lineTo(L[0] * D, L[1] * D); } else c.lineTo(st.p[0][0] * D + 0.1, st.p[0][1] * D);
      c.stroke(); c.globalAlpha = 1;
    }
    function ciz() { cc.setTransform(1, 0, 0, 1, 0, 0); cc.clearRect(0, 0, cizCv.width, cizCv.height); sayfa().cizgi.forEach((st) => cizgiCiz(cc, st)); }
    function yazilar() {
      yaziKat.replaceChildren(...sayfa().yazi.map((y) => yaziKutu(y)));
    }
    function yaziKutu(y) {
      const el = h("div.yt-yazi" + (y.f === "harf" ? ".harf" : ""), { contentEditable: "true", spellcheck: false, style: { left: y.x * olc + "px", top: y.y * olc + "px", fontSize: y.s * olc + "px", color: y.r } });
      el.textContent = y.t;
      el.addEventListener("input", () => { y.t = el.innerText; kaydet(); });
      el.addEventListener("blur", () => { if (!el.innerText.trim()) { sayfa().yazi = sayfa().yazi.filter((z) => z !== y); el.remove(); kaydet(); } });
      el.addEventListener("pointerdown", (e) => { if (arac === "sil") { e.preventDefault(); geri.push(JSON.stringify(sayfa())); sayfa().yazi = sayfa().yazi.filter((z) => z !== y); el.remove(); kaydet(); return; } e.stopPropagation(); });
      /* sürükleme tutamacı */
      const tut = h("span.yt-tut", { contentEditable: "false", title: "Taşı" }, "⠿");
      tut.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); const x0 = e.clientX, y0 = e.clientY, a0 = y.x, b0 = y.y; tut.setPointerCapture(e.pointerId);
        const mv = (ev) => { y.x = a0 + (ev.clientX - x0) / olc; y.y = b0 + (ev.clientY - y0) / olc; el.style.left = y.x * olc + "px"; el.style.top = y.y * olc + "px"; };
        const up = () => { tut.removeEventListener("pointermove", mv); tut.removeEventListener("pointerup", up); kaydet(); };
        tut.addEventListener("pointermove", mv); tut.addEventListener("pointerup", up); });
      const kap = h("div.yt-yazi-kap", tut, el); kap.style.left = el.style.left; kap.style.top = el.style.top; el.style.left = el.style.top = "";
      const sync = new MutationObserver(() => { kap.style.left = y.x * olc + "px"; kap.style.top = y.y * olc + "px"; }); sync.observe(el, { attributes: true, attributeFilter: ["style"] });
      return kap;
    }
    let kayitT = null; const kaydet = () => { clearTimeout(kayitT); kayitT = setTimeout(() => sakla(d), 300); };
    /* çizim */
    let akt = null;
    const nokta = (e) => { const r = cizCv.getBoundingClientRect(); return [(e.clientX - r.left) / olc, (e.clientY - r.top) / olc]; };
    cizCv.addEventListener("pointerdown", (e) => {
      if (document.activeElement && document.activeElement.isContentEditable) document.activeElement.blur();
      const p = nokta(e);
      if (arac === "metin") { const y = { x: p[0], y: p[1] - 20, t: "", s: kalin * 9 + 18, r: renk, f: metinYazi }; sayfa().yazi.push(y); const k = yaziKutu(y); yaziKat.append(k); setTimeout(() => k.querySelector(".yt-yazi").focus(), 0); return; }
      cizCv.setPointerCapture(e.pointerId);
      if (arac === "sil") { geri.push(JSON.stringify(sayfa())); akt = { sil: true }; silAt(p); return; }
      geri.push(JSON.stringify(sayfa())); if (geri.length > 60) geri.shift();
      akt = { r: renk, w: arac === "fosfor" ? kalin * 5 + 10 : kalin, f: arac === "fosfor", p: [p] }; sayfa().cizgi.push(akt);
    });
    cizCv.addEventListener("pointermove", (e) => {
      if (!akt) return; const p = nokta(e);
      if (akt.sil) { silAt(p); return; }
      const L = akt.p[akt.p.length - 1]; if (Math.hypot(p[0] - L[0], p[1] - L[1]) < 1.2) return;
      akt.p.push(p); ciz();
    });
    const birak = () => { if (akt) { akt = null; ciz(); kaydet(); } };
    cizCv.addEventListener("pointerup", birak); cizCv.addEventListener("pointercancel", birak);
    function silAt(p) { const r = 18; const once = sayfa().cizgi.length; sayfa().cizgi = sayfa().cizgi.filter((st) => !st.p.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < r + st.w / 2)); if (sayfa().cizgi.length !== once) ciz(); }
    function geriAl() { if (!geri.length) return; d.s[d.i] = JSON.parse(geri.pop()); zemin(); ciz(); yazilar(); kaydet(); }
    let metinYazi = "harf";
    /* araç çubukları */
    function cubuk() {
      const s = sayfa();
      const btn = (ad, ikon, on, f, ek = "") => h("button.yt-b" + (on ? ".on" : "") + ek, { onclick: f, title: ad, "aria-label": ad }, ikon ? T.icon(ikon) : null, h("span", ad));
      ust.replaceChildren(
        h("div.yt-grup", ZEMIN.map(([k, ad]) => btn(ad, null, s.z === k, () => { s.z = k; zemin(); cubuk(); kaydet(); }))),
        h("div.yt-grup", RENK_KAG.map(([k, ad, bg]) => h("button.yt-kag" + (s.k === k ? ".on" : ""), { title: ad, "aria-label": ad, style: { background: bg }, onclick: () => { s.k = k; if ((k === "yesil" || k === "siyah") && renk === KALEM[0]) renk = "#F4F1E8"; if ((k === "beyaz" || k === "krem") && renk === "#F4F1E8") renk = KALEM[0]; zemin(); cubuk(); kaydet(); } }))),
        h("div.yt-grup", btn("Aralık −", null, false, () => { s.a = Math.max(20, s.a - 8); zemin(); kaydet(); }), btn("Aralık +", null, false, () => { s.a = Math.min(120, s.a + 8); zemin(); kaydet(); })),
        h("div.yt-bosluk"),
        btn("Tam ekran", "full", false, () => { try { document.fullscreenElement ? document.exitFullscreen() : kok.requestFullscreen(); } catch (e) {} }),
        btn("Kapat", "close", false, kapat, ".kapat"));
      const koyu = s.k === "yesil" || s.k === "siyah", renkler = koyu ? ["#F4F1E8"].concat(KALEM.slice(1)) : KALEM;
      alt.replaceChildren(
        h("div.yt-grup", btn("Kalem", "pen", arac === "kalem", () => { arac = "kalem"; cubuk(); }), btn("Fosforlu", "spark", arac === "fosfor", () => { arac = "fosfor"; cubuk(); }), btn("Metin", "text", arac === "metin", () => { arac = "metin"; cubuk(); }), btn("Silgi", "reset", arac === "sil", () => { arac = "sil"; cubuk(); })),
        h("div.yt-grup", renkler.map((c) => h("button.yt-renk" + (renk === c ? ".on" : ""), { style: { background: c }, "aria-label": "Renk", onclick: () => { renk = c; cubuk(); } }))),
        h("div.yt-grup", [2, 4, 8, 14].map((w) => h("button.yt-kalin" + (kalin === w ? ".on" : ""), { "aria-label": "Kalınlık " + w, onclick: () => { kalin = w; cubuk(); } }, h("i", { style: { width: w + 4 + "px", height: w + 4 + "px" } })))),
        arac === "metin" ? h("div.yt-grup", btn("Okul harfi", null, metinYazi === "harf", () => { metinYazi = "harf"; cubuk(); }), btn("Düz yazı", null, metinYazi === "duz", () => { metinYazi = "duz"; cubuk(); })) : null,
        h("div.yt-bosluk"),
        btn("Geri al", "back", false, geriAl),
        btn("Sayfayı temizle", "trash", false, async () => { if (await T.confirm("Sayfa temizlensin mi?", "Bu sayfadaki çizimler ve yazılar silinir.", "Temizle")) { geri.push(JSON.stringify(s)); s.cizgi = []; s.yazi = []; ciz(); yazilar(); kaydet(); } }),
        h("div.yt-grup.yt-sayfa", btn("Önceki", "back", false, () => { if (d.i > 0) { d.i--; geri = []; boyut(); cubuk(); kaydet(); } }), h("b", (d.i + 1) + " / " + d.s.length), btn("Sonraki", "next", false, () => { if (d.i < d.s.length - 1) { d.i++; geri = []; boyut(); cubuk(); kaydet(); } }), btn("Yeni sayfa", "plus", false, () => { d.s.splice(d.i + 1, 0, yeniSayfa(s.z, s.k)); d.i++; geri = []; boyut(); cubuk(); kaydet(); }),
          d.s.length > 1 ? btn("Sayfayı sil", "close", false, async () => { if (await T.confirm("Bu sayfa silinsin mi?", "Sayfa geri getirilemez.", "Sil")) { d.s.splice(d.i, 1); d.i = Math.max(0, d.i - 1); geri = []; boyut(); cubuk(); kaydet(); } }) : null));
      cizCv.style.cursor = arac === "metin" ? "text" : arac === "sil" ? "cell" : "crosshair";
    }
    const gozle = new ResizeObserver(() => boyut()); gozle.observe(sahne);
    cubuk(); requestAnimationFrame(boyut);
  }
  T.yaziTahtasi = { ac };
})();
