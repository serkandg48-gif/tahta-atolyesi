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
    if (T.$(".ara-perde")) return;
    const L = katalog();
    const giris = h("input.ara-giris", { placeholder: "Ne açalım? Örneğin zamanlayıcı, kesir, duygu", "aria-label": "Ara", autocomplete: "off" });
    const liste = h("div.ara-liste", { role: "listbox" });
    let sonuc = [], sec = 0;
    const kapat = () => { perde.remove(); removeEventListener("keydown", tus, true); };
    const calistir = (x) => { kapat(); try { x.ac(); } catch (e) { console.error(e); } };
    const ciz = () => {
      const q = sade(giris.value.trim());
      sonuc = q ? L.map((x) => [puan(x, q), x]).filter((y) => y[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 30).map((y) => y[1]) : L.filter((x) => x.tur === "Araç" || x.tur === "Komut").slice(0, 14);
      sec = Math.min(sec, Math.max(0, sonuc.length - 1));
      liste.replaceChildren(...(sonuc.length ? sonuc.map((x, i) => h("button.ara-oge", { role: "option", "aria-selected": String(i === sec), onclick: () => calistir(x), onpointermove: () => { if (sec !== i) { sec = i; isaretle(); } } }, T.icon3d(x.ic || "spark"), h("span", h("b", x.ad), x.ek ? h("small", x.ek) : null), h("em", x.tur))) : [h("p.ara-bos", "Bulunamadı. Başka bir sözcük dene.")]));
    };
    const isaretle = () => [...liste.children].forEach((b, i) => { b.setAttribute("aria-selected", String(i === sec)); if (i === sec) b.scrollIntoView({ block: "nearest" }); });
    const tus = (e) => {
      if (e.key === "Escape") { e.preventDefault(); kapat(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); sec = Math.min(sec + 1, sonuc.length - 1); isaretle(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sec = Math.max(sec - 1, 0); isaretle(); }
      else if (e.key === "Enter" && sonuc[sec]) { e.preventDefault(); calistir(sonuc[sec]); }
    };
    giris.addEventListener("input", () => { sec = 0; ciz(); });
    const perde = h("div.ara-perde", { onclick: (e) => { if (e.target === perde) kapat(); } },
      h("div.ara-kutu", { role: "dialog", "aria-label": "Hızlı arama" }, h("div.ara-ust", T.icon("search"), giris, h("kbd", "Esc")), liste));
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

/* Öğrenci kilidi: tahta öğrenciye bırakılınca menü, kapatma ve sayfa değiştirme kapanır.
   Açmak için sağ alttaki kilide 2 saniye basılı tutulur. */
(function () {
  const h = T.h; let kilitHash = null, dug = null;
  const kilitli = () => document.documentElement.classList.contains("kilitli");
  T.kilitliMi = kilitli;
  T.kilit = function () {
    if (kilitli()) return;
    kilitHash = location.hash || "#ana";
    document.documentElement.classList.add("kilitli");
    let zam = null; const halka = h("i.kl-halka");
    const birak = () => { clearTimeout(zam); dug.classList.remove("basili"); };
    dug = h("button#kilit-dug", { "aria-label": "Kilidi açmak için 2 saniye basılı tut", title: "Açmak için 2 saniye basılı tut",
      onpointerdown: (e) => { e.preventDefault(); dug.classList.add("basili"); zam = setTimeout(() => { birak(); T.kilitAc(); }, 2000); },
      onpointerup: birak, onpointerleave: birak, onpointercancel: birak, oncontextmenu: (e) => e.preventDefault() }, halka, T.icon("lock"), h("span", "Öğrenci modu"));
    document.body.append(dug);
    T.toast("Öğrenci modu açık. Açmak için kilide 2 saniye basılı tut");
  };
  T.kilitAc = function () { document.documentElement.classList.remove("kilitli"); if (dug) dug.remove(); dug = null; kilitHash = null; T.toast("Öğrenci modu kapandı"); };
  /* kilitliyken başka bölüme geçilmez; aynı bölümün etkinlikleri açılabilir */
  addEventListener("hashchange", () => { const bol = (x) => (x || "#ana").slice(1).split("-")[0]; if (kilitli() && kilitHash && bol(location.hash) !== bol(kilitHash)) history.replaceState(null, "", kilitHash) || T.route(); }, true);
  addEventListener("keydown", (e) => { if (kilitli() && ((e.ctrlKey || e.metaKey) || e.key === "/" || e.key === "b" || e.key === "B" || e.key === "Escape")) { e.stopImmediatePropagation(); if (e.ctrlKey || e.metaKey || e.key === "/") e.preventDefault(); } }, true);
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Öğrenci modu (kilit)", ic: "lock", ac: () => T.kilit(), ek: "Menü ve kapatma düğmeleri gizlenir" });
})();

/* Okuma kolaylığı: okumakta zorlanan öğrenciler için harfleri ayırt etmesi kolay yazı tipi, geniş harf ve satır aralığı */
(function () {
  const anahtar = "ta-okuma-kolay";
  T.okumaKolay = () => { try { return localStorage.getItem(anahtar) === "1"; } catch (e) { return false; } };
  T.okumaKolayYap = (on) => { try { on ? localStorage.setItem(anahtar, "1") : localStorage.removeItem(anahtar); } catch (e) {} document.documentElement.classList.toggle("okuma-kolay", !!on); };
  document.documentElement.classList.toggle("okuma-kolay", T.okumaKolay());
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Okuma kolaylığı aç veya kapat", ic: "book", ac: () => { const on = !T.okumaKolay(); T.okumaKolayYap(on); T.toast(on ? "Okuma kolaylığı açık" : "Okuma kolaylığı kapalı"); }, ek: "Geniş aralık, kolay ayırt edilen harfler" });
})();

/* Yazdırma yardımcısı: verilen öğeyi tek başına kâğıda basar. Yeni çıktılar bunu kullanır. */
T.yazdir = function (icerik, yon = "portrait") {
  const kap = T.h("div#ta-baski", icerik);
  const st = T.h("style#ta-baski-stil", "@page { size: A4 " + yon + "; margin: 12mm; }");
  document.head.append(st); document.body.append(kap); document.documentElement.classList.add("ta-yazdiriliyor");
  const bitir = () => { document.documentElement.classList.remove("ta-yazdiriliyor"); kap.remove(); st.remove(); removeEventListener("afterprint", bitir); };
  addEventListener("afterprint", bitir);
  setTimeout(() => { try { window.print(); } catch (e) {} setTimeout(bitir, 1500); }, 80);
};

/* İnternet kesilince de açılsın diye service worker kaydı */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));

/* Tahta hafızası: Türkçe ve Matematik'te en son açılan etkinlik bölüm sayfasının başında "Kaldığın yer" olarak durur */
(function () {
  const BOL = ["turkce", "matematik"]; const A = "ta-son-arac";
  const oku = () => { try { return JSON.parse(localStorage.getItem(A) || "{}"); } catch (e) { return {}; } };
  addEventListener("hashchange", () => { const m = location.hash.slice(1).match(/^(turkce|matematik)-(.+)$/); if (!m || !T.tools[m[2]] || /^k[zk]-/.test(m[2])) return; const v = oku(); v[T.store.get().activeClassId + ":" + m[1]] = { id: m[2], t: Date.now() }; try { localStorage.setItem(A, JSON.stringify(v)); } catch (e) {} });
  const ekle = () => {
    const b = location.hash.slice(1); if (!BOL.includes(b)) return;
    const bas = document.querySelector("#view .page-head"); if (!bas || bas.querySelector(".kaldigin")) return;
    const k = oku()[T.store.get().activeClassId + ":" + b]; if (!k || !T.tools[k.id]) return;
    const gun = new Date(k.t), bugun = T.isoDate(gun) === T.isoDate();
    bas.append(T.h("button.kaldigin", { onclick: () => T.go(b + "-" + k.id), title: "En son açtığın etkinlik" }, T.icon("turn"), T.h("span", "Kaldığın yer: ", T.h("b", T.tools[k.id].title)), bugun ? null : T.h("small", gun.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }))));
  };
  const v = document.getElementById("view"); if (v) new MutationObserver(ekle).observe(v, { childList: true, subtree: false });
})();
