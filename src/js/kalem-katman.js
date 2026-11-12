/* Kitap üstü kalem katmanı: MEB kitabının (iframe) üstüne öğretmenin kendi kalemi.
   El modunda katman tıklamaları kitaba geçirir; kalem, fosforlu ve silgi modunda üstüne çizer. */
(function () {
  const { h } = T;
  const RENK = ["#E0302D", "#1D5FD1", "#1A1A1A", "#16A34A"];
  T.kalemKatmani = function (cerceve, opts = {}) {
    const kap = h("div.kk-kap"), cv = h("canvas.kk-cv");
    let mod = "el", renk = RENK[0], ciziyor = false, son = null, cizgiler = [], aktif = null;
    const boyut = () => { const r = kap.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); const w = Math.round(r.width * d), hh = Math.round(r.height * d); if (w && (cv.width !== w || cv.height !== hh)) { cv.width = w; cv.height = hh; yenidenCiz(); } };
    const ctx = cv.getContext("2d");
    const ciz1 = (c) => { const d = cv.width / (kap.clientWidth || 1); ctx.save(); ctx.scale(d, d); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.globalCompositeOperation = c.mod === "silgi" ? "destination-out" : "source-over"; ctx.globalAlpha = c.mod === "fosforlu" ? 0.35 : 1;
      ctx.strokeStyle = c.mod === "fosforlu" ? "#FFE13B" : c.renk; ctx.lineWidth = c.mod === "fosforlu" ? 22 : c.mod === "silgi" ? 34 : 4;
      ctx.beginPath(); c.n.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (c.n.length === 1) ctx.lineTo(c.n[0][0] + 0.1, c.n[0][1]); ctx.stroke(); ctx.restore(); };
    const yenidenCiz = () => { ctx.clearRect(0, 0, cv.width, cv.height); cizgiler.forEach(ciz1); };
    const nk = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener("pointerdown", (e) => { if (mod === "el") return; ciziyor = true; cv.setPointerCapture(e.pointerId); aktif = { mod, renk, n: [nk(e)] }; cizgiler.push(aktif); yenidenCiz(); e.preventDefault(); });
    cv.addEventListener("pointermove", (e) => { if (!ciziyor) return; aktif.n.push(nk(e)); yenidenCiz(); });
    const bitir = () => { ciziyor = false; aktif = null; };
    cv.addEventListener("pointerup", bitir); cv.addEventListener("pointercancel", bitir);
    const dugme = (k, ad, ic) => h("button.kk-d" + (mod === k ? ".on" : ""), { "aria-label": ad, title: ad, "aria-pressed": String(mod === k), onclick: () => { mod = k; ciz(); } }, ic);
    const arac = h("div.kk-arac");
    const ciz = () => {
      kap.classList.toggle("ciz", mod !== "el");
      arac.replaceChildren(
        dugme("el", "Kitabı kullan (sayfa çevir, kaydır)", "✋"),
        dugme("kalem", "Kalem", "✏️"),
        mod === "kalem" ? RENK.map((r) => h("button.kk-renk" + (r === renk ? ".on" : ""), { "aria-label": "Renk", style: { background: r }, onclick: () => { renk = r; ciz(); } })) : null,
        dugme("fosforlu", "Fosforlu kalem", h("span.kk-fos")), dugme("silgi", "Silgi", "🧽"),
        h("button.kk-d", { "aria-label": "Geri al", title: "Geri al", onclick: () => { cizgiler.pop(); yenidenCiz(); } }, "↶"),
        h("button.kk-d", { "aria-label": "Hepsini temizle", title: "Hepsini temizle (sayfa değiştirince)", onclick: () => { cizgiler = []; yenidenCiz(); } }, "🗑️"));
    };
    kap.append(cerceve, cv, arac); ciz();
    if (window.ResizeObserver) new ResizeObserver(boyut).observe(kap); else setInterval(boyut, 1000);
    setTimeout(boyut, 50);
    kap.temizle = () => { cizgiler = []; yenidenCiz(); };
    return kap;
  };
})();
