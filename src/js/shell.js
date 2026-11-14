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
    return ids.concat("kitaplar", "olcme", "duygu", "kultur", "zeka").map((k) => D[k]);
  };
  /* Yüzen alt menü: Araçlar şeridi (hızlı sınıf araçları) ve Atölyeler şeridi (bölümler) */
  const ARACLAR = [["bg", "Arka plan", "bg"], ["yazitahtasi", "Yazı tahtası", "pen"], ["timer", "Zamanlayıcı"], ["name", "İsim çek"], ["dice", "Zar at"], ["groups", "Grup kur"], ["traffic", "Trafik ışığı"], ["noise", "Ses ölçer"], ["draw", "Çizim"], ["text", "Yönerge"], ["stopwatch", "Kronometre"], ["clock", "Saat"], ["takvim", "Takvim"], ["bitirdim", "Etkinliğim bitti"], ["mola", "Hareket molası"], ["dikkat", "Dikkat çağrıları"], ["sira", "Sıraya geçme"], ["hepsi", "Tüm araçlar", "plus"]];
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
  const dersler = () => T.menu().map((m) => ({ k: m[0], l: dersAd[m[0]] || m[1], ic: m[3], gizli: !T.bolumGorunur(m[0]), ac: () => T.go(m[0]) }));
  let acikPanel = null;
  function panelKapat() { const p = T.$(".altp"); if (p) { p.classList.add("kapan"); setTimeout(() => p.remove(), 220); } acikPanel = null; T.$$(".dock-ana[aria-expanded]").forEach((b) => b.setAttribute("aria-expanded", "false")); }
  function panelAc(tur, cur) {
    if (acikPanel === tur) { panelKapat(); return; }
    T.$$(".altp").forEach((x) => x.remove()); acikPanel = tur;
    T.$$(".dock-ana").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.tur === tur)));
    const dugme = (x, i, tip) => h("button.altp-oge", { style: { "--i": i }, "aria-current": cur === x.k ? "page" : null, onclick: () => { panelKapat(); sonEkle({ t: tip, k: x.k }); x.ac(); } }, T.icon3d(x.ic), h("span", x.l));
    let i = 0, gruplar;
    if (tur === "arac") gruplar = ARAC_GRUP.map(([ad, l]) => [ad, l.map(aracBilgi).filter(Boolean)]).concat([["", [{ k: "hepsi", l: "Tüm araçlar", ic: "plus", ac: () => aracAc("hepsi") }]]]);
    else {
      const D = dersler(), dersK = ["turkce", "matematik", "kesif", "ingilizce", "kitaplar"];
      gruplar = tur === "ders" ? [["", D.filter((x) => dersK.includes(x.k))]]
        : [["", D.filter((x) => !dersK.includes(x.k)).concat({ k: "sabah", l: "Sabah rutini", ic: "sun", ac: () => T.go("sabah") }, { k: "sinif", l: "Sınıfım", ic: "class", ac: () => T.go("sinif") })]];
    }
    const BAS = { arac: ["Araçlar", "Her derste kullanılan sınıf araçları"], ders: ["Dersler", "Derse git"], yasam: ["Sınıf yaşamı", "SDÖ, ölçme, sınıf düzeni ve günlük rutinler"] }[tur];
    const p = h("div.altp", { role: "dialog", "aria-label": BAS[0] },
      h("div.altp-bas", h("b", BAS[0]), h("span.hint", BAS[1]), h("div.spacer"), h("button.altp-kapat", { "aria-label": "Kapat", onclick: panelKapat }, T.icon("close"))),
      h("div.altp-gruplar", gruplar.filter(([, l]) => l.length).map(([ad, l]) => h("section.altp-grup", ad ? h("h3", ad) : null, h("div.altp-izgara", l.map((x) => { const b = dugme(x, i++, tur === "arac" ? "a" : "d"); if (x.gizli) b.classList.add("gizli"); return b; }))))));
    document.body.append(p);
    const dis = (e) => { if (!p.isConnected) { document.removeEventListener("pointerdown", dis, true); return; } if (!p.contains(e.target) && !e.target.closest(".dock")) { panelKapat(); document.removeEventListener("pointerdown", dis, true); } };
    setTimeout(() => document.addEventListener("pointerdown", dis, true), 0);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && acikPanel) panelKapat(); });
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
      ana("arac", "Araçlar", "timer"), ana("ders", "Dersler", "book"), ana("yasam", "Sınıf yaşamı", "heart"),
      hizli.length ? h("span.dock-sep", { "aria-hidden": "true" }) : null,
      hizli.length ? h("div.dock-hizli", hizli.map((x) => h("button.dock-item", { title: x.l, "aria-current": cur === x.k ? "page" : null, onclick: () => { sonEkle({ t: x.t === "a" ? "a" : "d", k: x.k }); x.ac(); } }, T.icon3d(x.ic), h("span", x.l)))) : null,
      h("span.dock-sep", { "aria-hidden": "true" }),
      h("button.dock-item", { onclick: () => aracAc("bg") }, T.icon3d("bg"), h("span", "Arka plan")),
      h("button.dock-item", { onclick: () => T.ambiyans.sec() }, T.icon3d("lotus"), h("span", "Odaklanarak çalışma")),
      (() => { const cal = T.muzik && (T.muzik.aktif() || (T.spotify && T.spotify.acik())); const b = h("button.dock-item.dock-muzik" + (cal ? ".caliyor" : ""), { onclick: () => T.muzikListe(b) }, cal ? h("i.mc-dalga.buyuk", h("i"), h("i"), h("i")) : T.icon3d("music"), h("span", cal ? "Çalıyor" : "Müzik")); return b; })(),
      git("plan", "Plan", "plan"), git("ayarlar", "Ayarlar", "settings"),
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
    T.muzikDurum = () => { topbar(); T.calarCiz && T.calarCiz(); const d = T.$(".dock-muzik"); if (d) dock((location.hash.slice(1).split("-")[0]) || "ana"); };
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
