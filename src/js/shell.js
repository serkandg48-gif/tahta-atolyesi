/* Kabuk: üst çerçeve, ana sayfa, tebeşirlik, yönlendirme */
(function () {
  const { h } = T;

  T.sections.ekran = {
    title: "Ders ekranı", icon: "board", tone: "sun", desc: "Zamanlayıcı, isim çek, zar, trafik ışığı...",
    full: true,
    render(view) { T.board.render(view); },
  };

  T.applyTheme = function () {
    document.documentElement.setAttribute("data-kademe", T.store.kademe());
  };

  /* ---------- Üst çerçeve ---------- */
  function topbar() {
    const el = T.$("#topbar");
    const c = T.store.activeClass();
    const n = T.cal.dayNumber(), st = T.cal.status(), sp = T.cal.specialDay();
    const mark = T.svg("svg", { viewBox: "0 0 48 48", class: "brand-mark", "aria-hidden": "true" });
    mark.innerHTML = '<rect x="4" y="7" width="40" height="27" rx="4" fill="#1B2A4A"/><path d="M11 26l6-7 5 4 6-9 8 12" stroke="#E9A23B" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 41h12M24 34v7" stroke="#1B2A4A" stroke-width="3.2" stroke-linecap="round"/>';
    const clock = h("div.clock.num", { "aria-label": "Saat" });
    el.replaceChildren(
      h("button.brand", { onclick: () => T.go("ana"), "aria-label": "Ana sayfa" }, mark, h("span", "Tahta Atölyesi")),
      h("div.daychalk", { "aria-live": "polite" },
        st.kind === "okul" ? [h("span", "Okulun"), h("b", n + "."), h("span", "günü")] : h("span", st.text),
        h("span.opt", "· " + T.longDate()), sp ? h("span.opt", "· " + sp) : null),
      h("div.tb-right",
        h("button.chip-btn", { onclick: pickClass, "aria-label": "Sınıf değiştir" }, T.icon("class"), h("span.lbl", c.name)),
        clock));
    const tick = () => { const d = new Date(); clock.textContent = `${T.pad(d.getHours())}:${T.pad(d.getMinutes())}`; };
    tick(); clearInterval(T._clk); T._clk = setInterval(tick, 10000);
  }
  T.pickClass = () => pickClass();
  function pickClass() {
    const s = T.store.get(); let m;
    m = T.modal({ title: "Sınıf seç", body: h("div.tool-grid", s.classes.map((c) => h("button.tool-card.c-" + (c.grade >= 5 ? "sky" : "sun"), { onclick: () => { T.store.update((st) => (st.activeClassId = c.id)); T.applyTheme(); m.close(); T.route(); } }, T.icon("class"), h("span", c.name, h("small", c.grade + ". sınıf, " + c.students.length + " öğrenci"))))),
      actions: [{ label: "Sınıfları düzenle", onClick: () => T.go("sinif") }, { label: "Kapat" }] });
  }

  /* ---------- Tebeşirlik: seçili sınıfın düzeyine göre dersler ---------- */
  T.dersAdi = (g = T.store.grade()) => ({ sosyal: g <= 3 ? "Hayat Bilgisi" : "Sosyal Bilgiler" });
  T.menu = function (g = T.store.grade()) {
    const D = {
      turkce: ["turkce", "Türkçe", "Okuma hızı, metin uyarlama, anlama ve yazım araçları.", "turkce", "tomato"],
      matematik: ["matematik", "Matematik", "Sayı hissi, oyunlar, manipülatifler, simülasyonlar.", "math", "sun"],
      kesif: ["kesif", T.kesifAdi(g), "Gör-düşün-merak et, sınıflandırma, gözlem günlüğü ve sınıfına uygun etkinlikler.", "fen", "leaf"],
      ingilizce: ["ingilizce", "İngilizce", "Resimli kartlar, dinle ve seç.", "ingilizce", "grape"],
      zeka: ["zeka", "Düşünme soruları", "Gerçek hayat durumu, akıl yürütme.", "zeka", "pink"],
      duygu: ["duygu", "SDÖ araçlarımız", "Duygumetre, sakinleşme, yansıtma, çatışma çözme.", "heart", "pink"],
      olcme: ["olcme", "Ölçme ve değerlendirme", "Dereceleme ölçeği, kontrol listesi, hızlı yoklama, düşünme rutinleri.", "check", "grape"],
      kitaplar: ["kitaplar", "Ders kitapları", "MEB kitapları sınıfına göre, tahtada sayfa içinde açılır.", "book", "sky"],
      kultur: ["kultur", "Sınıf düzenimiz", "Basamak duvarı, Etkinliğim bitti, YZ düzeyi, anlama düzeyi.", "trophy", "sun"],
    };
    const ids = g <= 1 ? ["turkce", "matematik", "kesif"] : ["turkce", "matematik", "kesif", "ingilizce"];
    return ids.concat("kitaplar", "olcme", "duygu", "kultur").map((k) => D[k]);
  };
  /* Yüzen alt menü: Araçlar şeridi (hızlı sınıf araçları) ve Atölyeler şeridi (bölümler) */
  const ARACLAR = [["bg", "Arka plan", "bg"], ["yazitahtasi", "Yazı tahtası", "pen"], ["timer", "Zamanlayıcı"], ["name", "İsim çek"], ["dice", "Zar at"], ["groups", "Grup kur"], ["traffic", "Trafik ışığı"], ["noise", "Ses ölçer"], ["draw", "Çizim", "palet"], ["text", "Yönerge"], ["stopwatch", "Kronometre"], ["clock", "Saat"], ["takvim", "Takvim"], ["bitirdim", "Etkinliğim bitti"], ["mola", "Hareket molası"], ["dikkat", "Dikkat çağrıları"], ["sira", "Sıraya geçme"], ["hepsi", "Tüm araçlar", "plus"]];
  function dockMod() { try { return localStorage.getItem("ta-dock") || "atolye"; } catch (e) { return "atolye"; } }
  function dockYaz(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function aracAc(k) {
    if (k === "bg") { T.arkaPlanSec(); return; }
    if (k === "yazitahtasi") { T.yaziTahtasi.ac(); return; }
    const tahta = T.board.aktif() ? T.board : T.yuzen;
    k === "hepsi" ? tahta.openTray() : tahta.add(k);
  }
  /* Alt menü: tahtanın altında herkesin uzanabildiği tek şerit.
     Araçlar ve Dersler düğmeleri aşağıdan yükselen, gruplu bir panel açar; her şey tek bakışta görünür, kaydırma gerekmez.
     Şeritte son kullanılan dört şey hızlı erişim için durur. */
  const ARAC_GRUP = [
    ["Zaman", ["timer", "stopwatch", "clock", "takvim"]],
    ["Seçim ve gruplar", ["name", "dice", "groups"]],
    ["Sınıf düzeni", ["traffic", "noise", "dikkat", "sira", "mola", "bitirdim"]],
    ["Yazı ve panolar", ["yazitahtasi", "draw", "text", "@kesif-siniflandir|Sınıflandırma panosu|filter"]],
  ];
  const sonlar = () => { try { return JSON.parse(localStorage.getItem("ta-son") || "[]"); } catch (e) { return []; } };
  const sonEkle = (x) => { try { const l = sonlar().filter((y) => y.k !== x.k); l.unshift(x); localStorage.setItem("ta-son", JSON.stringify(l.slice(0, 8))); } catch (e) {} };
  const aracBilgi = (k) => {
    if (k[0] === "@") { const [r, l, ic] = k.slice(1).split("|"); return { k, l, ic, ac: () => T.go(r) }; }
    const sabit = ARACLAR.find((x) => x[0] === k);
    if (k !== "bg" && k !== "yazitahtasi" && !T.widgets[k]) return null;
    return { k, l: sabit ? sabit[1] : T.widgets[k].title, ic: (sabit && sabit[2]) || (T.widgets[k] && T.widgets[k].icon), ac: () => aracAc(k) };
  };
  const dersAd = { kitaplar: "Kitaplar", zeka: "Düşünme", duygu: "SDÖ", kultur: "Sınıf düzenimiz", olcme: "Ölçme" };
  const dersIk = { olcme: "chart" };
  const dersler = () => T.menu().map((m) => ({ k: m[0], l: dersAd[m[0]] || m[1], ic: dersIk[m[0]] || m[3], gizli: !T.bolumGorunur(m[0]), ac: () => T.go(m[0]) }))
    .concat({ k: "sabah", l: "Sabah rutini", ic: "sun", ac: () => T.go("sabah") }, { k: "sinif", l: "Sınıfım", ic: "class", ac: () => T.go("sinif") }, { k: "plan", l: "Plan", ic: "plan", ac: () => T.go("plan") });
  /* Alttaki menünün panelleri: her bölüm tek bir yerde durur */
  const PANEL = { ders: ["turkce", "matematik", "kesif", "ingilizce"], yasam: ["duygu", "kultur", "sabah"], ogretmen: ["olcme", "sinif", "plan", "kitaplar"] };
  let dockOrtam = null;
  const ortamOgeler = () => [
    { k: "bg", l: "Arka plan", ic: "bg", ac: () => aracAc("bg") },
    { k: "odak", l: "Odaklanarak çalışma", ic: "lotus", ac: () => T.ambiyans.sec() },
    { k: "muzik", l: "Müzik", ic: "music", ac: () => T.muzikListe(dockOrtam || document.body) },
  ];
  let acikPanel = null;
  function panelKapat() { T.$$(".altp-perde").forEach((x) => { x.classList.add("kapan"); setTimeout(() => x.remove(), 220); }); const p = T.$(".altp"); if (p) { p.classList.add("kapan"); setTimeout(() => p.remove(), 220); } acikPanel = null; T.$$(".dock-ana[aria-expanded]").forEach((b) => b.setAttribute("aria-expanded", "false")); }
  function panelAc(tur, cur) {
    if (acikPanel === tur) { panelKapat(); return; }
    T.$$(".altp, .altp-perde").forEach((x) => x.remove()); acikPanel = tur;
    T.$$(".dock-ana").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.tur === tur)));
    const dugme = (x, i, tip) => h("button.altp-oge", { style: { "--i": i }, "aria-current": cur === x.k ? "page" : null, onclick: () => { panelKapat(); sonEkle({ t: tip, k: x.k }); x.ac(); } }, T.icon3d(x.ic), h("span", x.l));
    let i = 0, gruplar;
    if (tur === "arac") gruplar = ARAC_GRUP.map(([ad, l]) => [ad, l.map(aracBilgi).filter(Boolean)]);
    else if (tur === "ortam") gruplar = [["", ortamOgeler()]];
    else { const D = dersler(); gruplar = [["", PANEL[tur].map((k) => D.find((x) => x.k === k)).filter(Boolean)]]; }
    const BAS = { arac: ["Araçlar", "Her derste kullanılan sınıf araçları"], ders: ["Dersler", "Derse git"], yasam: ["Sınıf yaşamı", "SDÖ, sınıf düzeni ve sabah rutini"], ogretmen: ["Öğretmen", "Ölçme ve düşünme rutinleri, sınıfım, plan, kitaplar"], ortam: ["Ortam", "Arka plan, odaklanarak çalışma ve müzik"] }[tur];
    const az = gruplar.reduce((t, [, l]) => t + l.length, 0) <= 8;
    const p = h("div.altp" + (az ? ".az" : ""), { role: "dialog", "aria-label": BAS[0] },
      h("div.altp-bas", h("b", BAS[0]), h("span.hint", BAS[1]), tur === "arac" ? h("button.btn.sm.c-chalk.altp-hepsi", { onclick: () => { panelKapat(); aracAc("hepsi"); } }, T.icon("plus"), "Tüm araçlar") : null, h("div.spacer"), h("button.altp-kapat", { "aria-label": "Kapat", onclick: panelKapat }, T.icon("close"))),
      h("div.altp-gruplar", gruplar.filter(([, l]) => l.length).map(([ad, l]) => h("section.altp-grup", ad ? h("h3", ad) : null, h("div.altp-izgara", l.map((x) => { const b = dugme(x, i++, tur === "arac" ? "a" : tur === "ortam" ? "o" : "d"); if (x.gizli) b.classList.add("gizli"); return b; }))))));
    /* arka plan karartması ve imlece yaklaşınca büyüyen kareler */
    const perde = h("div.altp-perde", { onclick: panelKapat }); document.body.append(perde);
    document.body.append(p);
    const ogeler = [...p.querySelectorAll(".altp-oge")];
    const buyut = (e) => ogeler.forEach((o) => { const r = o.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)), k = Math.max(0, 1 - d / 260); o.style.setProperty("--b", (1 + k * k * 0.22).toFixed(3)); o.style.zIndex = Math.round(k * 10); });
    p.addEventListener("pointermove", buyut); p.addEventListener("pointerleave", () => ogeler.forEach((o) => o.style.setProperty("--b", 1)));
    const dis = (e) => { if (!p.isConnected) { document.removeEventListener("pointerdown", dis, true); return; } if (!p.contains(e.target) && !e.target.closest(".dock")) { panelKapat(); document.removeEventListener("pointerdown", dis, true); } };
    setTimeout(() => document.addEventListener("pointerdown", dis, true), 0);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && acikPanel) panelKapat(); });
  /* ders sayfalarındaki kartlarda da imlece yaklaşınca büyüme */
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const g = e.target.closest && e.target.closest(".tool-grid"); const eski = T._buyuyenIzgara;
    if (eski && eski !== g) eski.querySelectorAll(".tool-card").forEach((o) => o.style.setProperty("--b", 1));
    T._buyuyenIzgara = g; if (!g) return;
    g.querySelectorAll(".tool-card").forEach((o) => { const r = o.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)), k = Math.max(0, 1 - d / 240); o.style.setProperty("--b", (1 + k * k * 0.16).toFixed(3)); });
  }, { passive: true });
  function dock(cur) {
    const el = T.$("#dock");
    document.documentElement.classList.add("alt-menu");
    panelKapat();
    const kucuk = (() => { try { return localStorage.getItem("ta-dock-kucuk") === "1"; } catch (e) { return false; } })();
    el.classList.toggle("kucuk", kucuk);
    if (kucuk) { el.replaceChildren(h("button.dock-ac", { "aria-label": "Menüyü aç", title: "Menüyü aç", onclick: () => { dockYaz("ta-dock-kucuk", "0"); dock(cur); } }, T.icon("grid"))); return; }
    const hizli = sonlar().filter((x) => x.k !== "bg").map((x) => x.t === "a" ? aracBilgi(x.k) && Object.assign(aracBilgi(x.k), { t: "a" }) : (dersler().find((d) => d.k === x.k) || null)).filter(Boolean).slice(0, 4);
    const ana = (tur, l, ic) => h("button.dock-ana", { "data-tur": tur, "aria-expanded": "false", onclick: () => panelAc(tur, cur) }, T.icon3d(ic), h("span", l), T.icon("up"));
    const git = (k, l, ic) => h("button.dock-item", { "aria-current": cur === k ? "page" : null, onclick: () => T.go(k) }, T.icon3d(ic), h("span", l));
    el.replaceChildren(
      git("ana", "Ana sayfa", "home"),
      ana("arac", "Araçlar", "aletkutusu"), ana("ders", "Dersler", "canta"), ana("yasam", "Sınıf yaşamı", "tokalasma"), ana("ogretmen", "Öğretmen", "teacher"),
      h("span.dock-sep", { "aria-hidden": "true" }),
      (() => { const cal = T.muzik && (T.muzik.aktif() || (T.spotify && T.spotify.acik())); const b = ana("ortam", "Ortam", "gundogumu"); b.classList.add("dock-muzik"); if (cal) { b.classList.add("caliyor"); b.prepend(h("i.mc-dalga.dock-dalga", h("i"), h("i"), h("i"))); } dockOrtam = b; return b; })(),
      git("ayarlar", "Ayarlar", "settings"),
      h("button.dock-kucult", { "aria-label": "Menüyü küçült", title: "Menüyü küçült", onclick: () => { dockYaz("ta-dock-kucuk", "1"); dock(cur); } }, T.icon("down")));
  }

  /* ---------- Ana sayfa ---------- */
  T.sections.ana = {
    title: "Ana sayfa", icon: "home", full: true,
    render(view) { T.kokpit.render(view); },
  };

  /* ---------- Yönlendirme ---------- */
  T.route = function () {
    T.cleanups.splice(0).forEach((f) => { try { f(); } catch (e) {} });
    if (T.sesCaliyor && T.sesCaliyor()) T.sesDur();
    T.$$("#layer > .scrim").forEach((x) => x.remove());
    const raw = (location.hash || "#ana").slice(1);
    const i = raw.indexOf("-");
    const id = i < 0 ? raw : raw.slice(0, i), sub = i < 0 ? null : raw.slice(i + 1);
    const sec = T.sections[id] || T.sections.ana;
    T.applyTheme();
    document.documentElement.classList.toggle("kokpitte", sec === T.sections.ana);
    document.documentElement.classList.toggle("ekranda", id === "ekran");
    topbar();
    dock(T.sections[id] ? id : "ana");
    const view = T.$("#view");
    view.replaceChildren();
    const anaMi = sec === T.sections.ana;
    view.classList.toggle("pencere", !anaMi);
    const TON = { turkce: "tomato", birinci: "tomato", matematik: "sun", sosyal: "sky", fen: "leaf", ingilizce: "grape", duygu: "pink", zeka: "pink", sabah: "sun", sinif: "sky", plan: "grape", ekran: "sun", ayarlar: "chalk" };
    view.dataset.ton = TON[id] || "chalk";
    if (!anaMi) view.append(h("div.pencere-ust", T.YARDIM[id] ? h("button.pencere-yardim", { onclick: () => T.yardimAc(id), "aria-label": "Bu sayfa ne işe yarar?", title: "Bu sayfa ne işe yarar?" }, "?") : null, h("button.pencere-kapat", { onclick: () => T.go("ana"), "aria-label": "Ana sayfaya dön", title: "Ana sayfaya dön" }, T.icon("close"), h("span", "Ana sayfaya dön"))));
    const cidNow = T.store.get().activeClassId;
    if (T._yuzenCid !== cidNow) { T._yuzenCid = cidNow; const y = T.$("#yuzen"); y.replaceChildren(); T.yuzen.render(y); }
    T.muzikDurum = () => { topbar(); T.calarCiz && T.calarCiz(); const d = T.$(".dock-ana[data-tur=ortam]"); if (d) dock((location.hash.slice(1).split("-")[0]) || "ana"); };
    view.scrollTop = 0;
    view.style.overflow = sec.full ? "hidden" : "auto";
    try { sec.render(view, sub); }
    catch (e) { console.error(e); view.append(h("div.view-inner", h("div.paper", { style: { padding: "20px" } }, h("p", "Bu bölüm açılırken bir sorun oldu: " + e.message), h("button.btn.c-chalk", { onclick: () => T.go("ana") }, "Ana sayfaya dön")))); }
    document.title = (sec.title && id !== "ana" ? sec.title + " · " : "") + "Tahta Atölyesi";
  };

  window.addEventListener("hashchange", T.route);
  document.addEventListener("cap", () => { if (["plan", "ayarlar", "zeka"].includes((location.hash || "#").slice(1).split("-")[0])) T.route(); });
  document.addEventListener("pointerdown", () => T.sound.unlock(), { once: true });
  T.store.load();
  T.arkaPlanUygula && T.arkaPlanUygula();
  T.route();
  // Gece yarısını geçince takvim yenilensin
  setInterval(() => { const d = T.isoDate(); if (d !== T._day) { T._day = d; if ((location.hash || "#ana") === "#ana") T.route(); else topbar(); } }, 60000);
  T._day = T.isoDate();
  setTimeout(() => T.hosgeldin && T.hosgeldin(), 700);
})();

/* Bölüm başlıkları (Okuma, Yazma, Kendini tanıma...) renkli sekmelere dönüşür: bir anda bir bölüm görünür */
(function () {
  const h = T.h;
  function uygula(kap) {
    if (kap.querySelector(":scope > .bolum-sekme")) return;
    const basliklar = [...kap.children].filter((e) => e.classList.contains("section-title") && e.nextElementSibling && e.nextElementSibling.classList.contains("tool-grid"));
    if (basliklar.length < 2) return;
    const bolumler = basliklar.map((b) => { const parca = [b]; let n = b.nextElementSibling; while (n && !n.classList.contains("section-title")) { if (n.classList.contains("tool-grid") || n.classList.contains("hint")) parca.push(n); else break; n = n.nextElementSibling; } return { ad: (b.querySelector("h2") || b).textContent.trim(), parca }; });
    const anahtar = "ta-bolum-" + location.hash;
    let sec = 0; try { sec = Math.min(+sessionStorage.getItem(anahtar) || 0, bolumler.length - 1); } catch (e) {}
    const goster = (i) => { sec = i; try { sessionStorage.setItem(anahtar, i); } catch (e) {} bolumler.forEach((b, j) => b.parca.forEach((el, k) => { el.hidden = j !== i || k === 0; })); dugmeler.forEach((d, j) => d.setAttribute("aria-selected", String(j === i))); };
    const dugmeler = bolumler.map((b, i) => h("button", { role: "tab", onclick: () => goster(i) }, b.ad));
    basliklar[0].before(h("div.tabs.bolum-sekme", { role: "tablist" }, dugmeler));
    goster(sec);
  }
  let bekliyor = false;
  const tara = () => { bekliyor = false; const v = document.getElementById("view"); if (!v) return; const kaplar = new Set([...v.querySelectorAll(".section-title + .tool-grid")].map((g) => g.parentElement)); kaplar.forEach(uygula); };
  const izle = () => { const v = document.getElementById("view"); if (!v) return setTimeout(izle, 300); new MutationObserver(() => { if (!bekliyor) { bekliyor = true; requestAnimationFrame(tara); } }).observe(v, { childList: true, subtree: true }); tara(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", izle); else izle();
})();

/* Plandan bir araca gidince "Plana dön" düğmesi çıkar; plana dönünce kaldığı yere kaydırır */
(function () {
  const h = T.h; let donus = null, dug = null;
  const kaydirici = () => [document.scrollingElement, document.querySelector(".view"), document.querySelector(".view-inner")].filter(Boolean);
  T.donusAyarla = (hash, etiket) => { donus = { hash, etiket, y: kaydirici().map((e) => e.scrollTop) }; };
  const yenile = () => {
    const burada = location.hash.replace(/^#/, "").split("/")[0];
    if (!donus) { if (dug) dug.remove(); dug = null; return; }
    if (burada === donus.hash) {
      const y = donus.y; donus = null; if (dug) dug.remove(); dug = null;
      setTimeout(() => kaydirici().forEach((e, i) => { if (y[i]) e.scrollTop = y[i]; }), 120);
      return;
    }
    if (!dug) {
      dug = h("div.donus-dug", h("button.donus-git", { onclick: () => T.go(donus.hash) }, T.icon("back"), donus.etiket),
        h("button.donus-kapat", { "aria-label": "Kapat", onclick: () => { donus = null; yenile(); } }, T.icon("close")));
      document.body.append(dug);
    }
  };
  window.addEventListener("hashchange", () => setTimeout(yenile, 30));
})();
