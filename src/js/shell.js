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
        h("button.chip-btn" + (T.muzik && (T.muzik.aktif() || (T.spotify && T.spotify.acik())) ? ".caliyor" : ""), { onclick: () => T.muzikPanel(), "aria-label": "Müzik", title: "Müzik" }, T.icon("music"), h("span.lbl", T.muzik && (T.muzik.aktif() || (T.spotify && T.spotify.acik())) ? "Çalıyor" : "Müzik")),
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
      olcme: ["olcme", "Ölçme ve değerlendirme", "Düşünme rutinleri: yansıt, birlikte yaz, A4 yazdır.", "check", "grape"],
      kitaplar: ["kitaplar", "Ders kitapları", "MEB kitapları sınıfına göre, tahtada sayfa içinde açılır.", "book", "sky"],
      kultur: ["kultur", "Sınıf düzenimiz", "Basamak duvarı, Etkinliğim bitti, YZ düzeyi, anlama düzeyi.", "trophy", "sun"],
    };
    const ids = g <= 1 ? ["turkce", "matematik", "kesif"] : ["turkce", "matematik", "kesif", "ingilizce"];
    return ids.concat("kitaplar", "olcme", "duygu", "kultur", "zeka").map((k) => D[k]);
  };
  /* Yüzen alt menü: Araçlar şeridi (hızlı sınıf araçları) ve Atölyeler şeridi (bölümler) */
  const ARACLAR = [["bg", "Arka plan", "bg"], ["timer", "Zamanlayıcı"], ["name", "İsim çek"], ["dice", "Zar at"], ["groups", "Grup kur"], ["traffic", "Trafik ışığı"], ["noise", "Ses ölçer"], ["draw", "Çizim"], ["text", "Yönerge"], ["stopwatch", "Kronometre"], ["clock", "Saat"], ["takvim", "Takvim"], ["bitirdim", "Etkinliğim bitti"], ["mola", "Hareket molası"], ["dikkat", "Dikkat çağrıları"], ["sira", "Sıraya geçme"], ["hepsi", "Tüm araçlar", "plus"]];
  function dockMod() { try { return localStorage.getItem("ta-dock") || "atolye"; } catch (e) { return "atolye"; } }
  function dockYaz(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function aracAc(k) {
    if (k === "bg") { T.arkaPlanSec(); return; }
    const tahta = T.board.aktif() ? T.board : T.yuzen;
    k === "hepsi" ? tahta.openTray() : tahta.add(k);
  }
  function dock(cur) {
    const el = T.$("#dock");
    let mod = dockMod();
    if (cur === "ekran" || cur === "ana") { if (!T._dockSecildi) mod = "arac"; }
    const kucuk = (() => { try { return localStorage.getItem("ta-dock-kucuk") === "1"; } catch (e) { return false; } })();
    el.classList.toggle("kucuk", kucuk);
    if (kucuk) { el.replaceChildren(h("button.dock-ac", { "aria-label": "Menüyü aç", title: "Menüyü aç", onclick: () => { dockYaz("ta-dock-kucuk", "0"); dock(cur); } }, T.icon("grid"))); return; }
    const atolye = [["ana", "Ana sayfa", "home"], ["sabah", "Sabah rutini", "sun"], ["sinif", "Sınıfım", "class"], "|"]
      .concat(T.menu().filter((m) => T.bolumGorunur(m[0]) || cur === m[0]).map((m) => [m[0], { kitaplar: "Kitaplar", zeka: "Düşünme", duygu: "SDÖ", kultur: "Sınıf düzenimiz", olcme: "Ölçme" }[m[0]] || m[1], m[3]]), "|", [["plan", "Plan", "plan"], ["ayarlar", "Ayarlar", "settings"]]);
    const sade = T.gorunum().mod === "sade";
    const ARAC_SADE = ["timer", "name", "dice", "groups", "traffic", "noise", "text", "hepsi"];
    const serit = h("div.dock-serit", mod === "arac"
      ? ARACLAR.filter(([k]) => (k === "bg" || k === "hepsi" || T.widgets[k]) && (!sade || ARAC_SADE.includes(k))).map(([k, l, ic]) => h("button.dock-item", { onclick: () => aracAc(k), title: l }, T.icon3d(ic || T.widgets[k].icon), h("span", l)))
      : atolye.map((d) => d === "|" ? h("span.dock-sep", { "aria-hidden": "true" }) : h("button.dock-item", { "aria-current": cur === d[0] ? "page" : null, onclick: () => T.go(d[0]) }, T.icon3d(d[2]), h("span", d[1]))),
      h("button.dock-item.dock-tam", { onclick: () => { T.gorunumYaz((g) => (g.mod = g.mod === "sade" ? "tam" : "sade")); T.toast(T.gorunum().mod === "sade" ? "Sade görünüm: her gün kullanılanlar" : "Tüm araçlar ve bölümler açıldı"); T.route(); }, title: sade ? "Tüm araçları ve bölümleri göster" : "Yalnızca her gün kullanılanları göster" }, T.icon(sade ? "plus" : "minus"), h("span", sade ? "Tümünü göster" : "Sadeleştir")));
    const kay = (yon) => serit.scrollBy({ top: yon * serit.clientHeight * 0.7, behavior: "smooth" });
    const sol = h("button.dock-ok", { "aria-label": "Yukarı kaydır", onclick: () => kay(-1) }, T.icon("up")), sag = h("button.dock-ok", { "aria-label": "Aşağı kaydır", onclick: () => kay(1) }, T.icon("down"));
    const oklar = () => { sol.hidden = serit.scrollTop < 4; sag.hidden = serit.scrollTop + serit.clientHeight >= serit.scrollHeight - 4; };
    serit.addEventListener("scroll", oklar, { passive: true });
    // Fareyle sürükleyerek kaydırma
    let sx = null, sl = 0, surukledi = false;
    serit.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; sx = e.clientY; sl = serit.scrollTop; surukledi = false; });
    serit.addEventListener("pointermove", (e) => { if (sx == null) return; const d = e.clientY - sx; if (Math.abs(d) > 6) surukledi = true; serit.scrollTop = sl - d; });
    window.addEventListener("pointerup", () => (sx = null));
    serit.addEventListener("click", (e) => { if (surukledi) { e.stopPropagation(); e.preventDefault(); surukledi = false; } }, true);
    el.replaceChildren(
      h("div.dock-sec", { role: "tablist" }, [["arac", "Araçlar", "timer"], ["atolye", "Dersler", "book"]].map(([k, l, ic]) => h("button", { role: "tab", "aria-selected": String(mod === k), onclick: () => { T._dockSecildi = true; dockYaz("ta-dock", k); dock(cur); } }, T.icon(ic), l))),
      sol, serit, sag,
      h("button.dock-kucult", { "aria-label": "Menüyü küçült", title: "Menüyü küçült", onclick: () => { dockYaz("ta-dock-kucuk", "1"); dock(cur); } }, T.icon("close")));
    requestAnimationFrame(() => { const a = serit.querySelector('[aria-current="page"]'); if (a) a.scrollIntoView({ block: "center", inline: "nearest" }); oklar(); });
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
    T.muzikDurum = () => topbar();
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
