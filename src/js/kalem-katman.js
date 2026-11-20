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
    cv.addEventListener("pointerdown", (e) => { if (mod === "el") return; if (eski) { eski = null; ciz(); } ciziyor = true; cv.setPointerCapture(e.pointerId); aktif = { mod, renk, n: [nk(e)] }; cizgiler.push(aktif); yenidenCiz(); e.preventDefault(); });
    cv.addEventListener("pointermove", (e) => { if (!ciziyor) return; aktif.n.push(nk(e)); yenidenCiz(); });
    /* Tahta hafızası: kitap başına mürekkep ve kaydırma yeri saklanır; ertesi gün "Kaldığın yerden" ile geri gelir */
    let anahtar = null, kaydirici = null, eski = null, zam = null;
    const HK = (a) => "ta-kalem:" + a;
    const sakla = () => { if (!anahtar || eski) return; clearTimeout(zam); zam = setTimeout(() => { try {
      const w = kap.clientWidth || 1, hh = kap.clientHeight || 1;
      const veri = { gun: T.isoDate(), kay: kaydirici ? kaydirici.scrollTop : 0, c: cizgiler.slice(-300).map((c) => ({ m: c.mod, r: c.renk, n: c.n.filter((_, i) => i % 2 === 0 || i === c.n.length - 1).map(([x, y]) => [+(x / w).toFixed(4), +(y / hh).toFixed(4)]) })) };
      if (!veri.c.length && !veri.kay) return localStorage.removeItem(HK(anahtar));
      localStorage.setItem(HK(anahtar), JSON.stringify(veri)); } catch (e) {} }, 400); };
    kap.hafiza = (a, kay) => {
      anahtar = a; kaydirici = kay || null; eski = null;
      try { const v = JSON.parse(localStorage.getItem(HK(a)) || "null"); if (v && (v.c.length || v.kay > 40)) eski = v; } catch (e) {}
      if (kaydirici && !kaydirici._hafiza) { kaydirici._hafiza = true; kaydirici.addEventListener("scroll", () => sakla(), { passive: true }); }
      ciz();
    };
    const geriYukle = () => {
      if (!eski) return; const w = kap.clientWidth || 1, hh = kap.clientHeight || 1;
      cizgiler = eski.c.map((c) => ({ mod: c.m, renk: c.r, n: c.n.map(([x, y]) => [x * w, y * hh]) }));
      if (kaydirici && eski.kay) kaydirici.scrollTop = eski.kay;
      eski = null; yenidenCiz(); ciz(); T.toast("Kaldığın yer geri yüklendi");
    };
    const bitir = () => { const vardi = ciziyor; ciziyor = false; aktif = null; if (vardi) sakla(); };
    cv.addEventListener("pointerup", bitir); cv.addEventListener("pointercancel", bitir);
    const dugme = (k, ad, ic) => h("button.kk-d" + (mod === k ? ".on" : ""), { "aria-label": ad, title: ad, "aria-pressed": String(mod === k), onclick: () => { mod = k; ciz(); } }, ic);
    const arac = h("div.kk-arac");
    /* Sayfa ile mürekkebi tek PNG'de birleştirir. Kitap aynı kaynaktan açılmışsa sayfa görüntüsü de alınır. */
    const indir = () => {
      const r = kap.getBoundingClientRect(), d = cv.width / (kap.clientWidth || 1);
      const o = document.createElement("canvas"); o.width = cv.width; o.height = cv.height; const c = o.getContext("2d");
      c.fillStyle = "#fff"; c.fillRect(0, 0, o.width, o.height);
      try {
        const fr = cerceve.tagName === "IFRAME" ? cerceve : cerceve.querySelector && cerceve.querySelector("iframe");
        const doc = fr && fr.contentDocument; const fx = fr ? fr.getBoundingClientRect() : r;
        const tuvaller = doc ? doc.querySelectorAll("canvas") : (cerceve.querySelectorAll ? cerceve.querySelectorAll("canvas") : []);
        tuvaller.forEach((t) => { const b = t.getBoundingClientRect(); const x = (doc ? fx.left - r.left : 0) + b.left - (doc ? 0 : r.left), y = (doc ? fx.top - r.top : 0) + b.top - (doc ? 0 : r.top); if (b.width) c.drawImage(t, x * d, y * d, b.width * d, b.height * d); });
      } catch (e) {}
      c.drawImage(cv, 0, 0);
      o.toBlob((b) => { if (!b) return T.toast("Resim hazırlanamadı"); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "tahta-" + T.isoDate() + ".png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); T.toast("Resim indirildi"); }, "image/png");
    };
    const ciz = () => {
      kap.classList.toggle("ciz", mod !== "el");
      arac.replaceChildren(
        dugme("el", "Kitabı kullan (sayfa çevir, kaydır)", "✋"),
        dugme("kalem", "Kalem", "✏️"),
        mod === "kalem" ? RENK.map((r) => h("button.kk-renk" + (r === renk ? ".on" : ""), { "aria-label": "Renk", style: { background: r }, onclick: () => { renk = r; ciz(); } })) : null,
        dugme("fosforlu", "Fosforlu kalem", h("span.kk-fos")), dugme("silgi", "Silgi", "🧽"),
        h("button.kk-d", { "aria-label": "Geri al", title: "Geri al", onclick: () => { cizgiler.pop(); yenidenCiz(); } }, "↶"),
        h("button.kk-d", { "aria-label": "Resim olarak indir", title: "Sayfayı ve kalemle yazdıklarını resim olarak indir", onclick: indir }, "⬇️"),
        h("button.kk-d", { "aria-label": "Hepsini temizle", title: "Hepsini temizle (sayfa değiştirince)", onclick: () => { cizgiler = []; yenidenCiz(); sakla(); } }, "🗑️"),
        eski ? h("button.kk-geri", { title: "Bu kitapta en son bıraktığın yer ve kalem notların", onclick: geriYukle }, "↺ Kaldığın yerden" + (eski.gun !== T.isoDate() ? " (" + new Date(eski.gun + "T00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + ")" : "")) : null);
    };
    kap.append(cerceve, cv, arac); ciz();
    if (window.ResizeObserver) new ResizeObserver(boyut).observe(kap); else setInterval(boyut, 1000);
    setTimeout(boyut, 50);
    kap.temizle = () => { cizgiler = []; yenidenCiz(); anahtar = null; eski = null; ciz(); };
    return kap;
  };
})();
