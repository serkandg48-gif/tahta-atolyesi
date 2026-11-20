/* Hızlı arama: Ctrl+K ya da üst çubuktaki büyüteç. Araç, etkinlik, bölüm ve komutları tek kutuda bulur. */
(function () {
  const h = T.h;
  const sade = (s) => (s || "").toLocaleLowerCase("tr-TR").replace(/[âà]/g, "a").replace(/[îı]/g, "i").replace(/[ûü]/g, "u").replace(/ö/g, "o").replace(/ç/g, "c").replace(/ş/g, "s").replace(/ğ/g, "g");
  function katalog() {
    const l = [];
    Object.entries(T.sections).forEach(([k, s]) => { if (s.title && !["ekran"].includes(k)) l.push({ ad: (T.dersAdi()[k]) || s.title, tur: "Bölüm", ic: s.icon, ac: () => T.go(k) }); });
    Object.entries(T.widgets || {}).forEach(([k, w]) => { if (w.title) l.push({ ad: w.title, tur: "Araç", ic: w.icon, ac: () => { const t = T.board.aktif() ? T.board : T.yuzen; t.add(k); } }); });
    Object.entries(T.tools).forEach(([k, t]) => {
      if (!t.title || t.gizli || /^k[zk]-/.test(k)) return; const sec = t.back || "matematik"; if (!T.sections[sec]) return;
      l.push({ ad: t.title, tur: (T.sections[sec].title || sec), ek: t.short || t.desc || "", ic: t.ikon3 || t.icon, ac: () => T.go(sec + "-" + k) });
    });
    const komut = (ad, ic, ac, ek) => l.push({ ad, tur: "Komut", ic, ac, ek });
    komut("Ekran perdesi", "moon", () => T.perde(), "Kısayol: B");
    komut("Arka planı değiştir", "bg", () => T.arkaPlanSec && T.arkaPlanSec());
    komut("Odaklanarak çalışma", "lotus", () => T.ambiyans && T.ambiyans.sec());
    komut("Sınıf değiştir", "class", () => T.pickClass());
    komut("Tam ekran", "full", () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {}));
    (T.ekKomutlar || []).forEach((x) => l.push(Object.assign({ tur: "Komut" }, x)));
    const gor = new Set(); return l.filter((x) => { const a = x.tur + "|" + x.ad; if (gor.has(a)) return false; gor.add(a); return true; });
  }
  function puan(x, q) {
    const a = sade(x.ad), e = sade(x.ek + " " + x.tur);
    if (a === q) return 100; if (a.startsWith(q)) return 80;
    if (a.split(/\s+/).some((w) => w.startsWith(q))) return 60;
    if (a.includes(q)) return 40;
    const p = q.split(/\s+/).filter(Boolean); if (p.length && p.every((w) => a.includes(w) || e.includes(w))) return 20;
    return 0;
  }
  T.komutPaleti = function () {
    if (T.$(".kp-perde")) return;
    const L = katalog();
    const giris = h("input.kp-giris", { placeholder: "Ne açalım? Örneğin zamanlayıcı, kesir, duygu", "aria-label": "Ara", autocomplete: "off" });
    const liste = h("div.kp-liste", { role: "listbox" });
    let sonuc = [], sec = 0;
    const kapat = () => { perde.remove(); removeEventListener("keydown", tus, true); };
    const calistir = (x) => { kapat(); try { x.ac(); } catch (e) { console.error(e); } };
    const ciz = () => {
      const q = sade(giris.value.trim());
      sonuc = q ? L.map((x) => [puan(x, q), x]).filter((y) => y[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 30).map((y) => y[1]) : L.filter((x) => x.tur === "Araç" || x.tur === "Komut").slice(0, 14);
      sec = Math.min(sec, Math.max(0, sonuc.length - 1));
      liste.replaceChildren(...(sonuc.length ? sonuc.map((x, i) => h("button.kp-oge", { role: "option", "aria-selected": String(i === sec), onclick: () => calistir(x), onpointermove: () => { if (sec !== i) { sec = i; isaretle(); } } }, T.icon3d(x.ic || "spark"), h("span", h("b", x.ad), x.ek ? h("small", x.ek) : null), h("em", x.tur))) : [h("p.kp-bos", "Bulunamadı. Başka bir sözcük dene.")]));
    };
    const isaretle = () => [...liste.children].forEach((b, i) => { b.setAttribute("aria-selected", String(i === sec)); if (i === sec) b.scrollIntoView({ block: "nearest" }); });
    const tus = (e) => {
      if (e.key === "Escape") { e.preventDefault(); kapat(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); sec = Math.min(sec + 1, sonuc.length - 1); isaretle(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sec = Math.max(sec - 1, 0); isaretle(); }
      else if (e.key === "Enter" && sonuc[sec]) { e.preventDefault(); calistir(sonuc[sec]); }
    };
    giris.addEventListener("input", () => { sec = 0; ciz(); });
    const perde = h("div.kp-perde", { onclick: (e) => { if (e.target === perde) kapat(); } },
      h("div.kp-kutu", { role: "dialog", "aria-label": "Hızlı arama" }, h("div.kp-ust", T.icon("search"), giris, h("kbd", "Esc")), liste));
    document.body.append(perde); addEventListener("keydown", tus, true);
    ciz(); setTimeout(() => giris.focus(), 20);
  };
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); T.komutPaleti(); }
    else if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName || "") && !e.target.isContentEditable) { e.preventDefault(); T.komutPaleti(); }
  });
  /* üst çubuğa büyüteç */
  const ekle = () => { const r = T.$("#topbar .tb-right"); if (r && !r.querySelector(".tb-ara")) r.prepend(h("button.chip-btn.tb-ara", { onclick: () => T.komutPaleti(), "aria-label": "Ara (Ctrl+K)", title: "Ara (Ctrl+K)" }, T.icon("search"), h("span.lbl", "Ara"))); };
  new MutationObserver(ekle).observe(T.$("#topbar"), { childList: true }); ekle();
})();
