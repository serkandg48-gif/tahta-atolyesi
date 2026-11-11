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
      h("button.brand", { onclick: () => T.go("ana"), "aria-label": "Ana sayfa" }, mark, h("span", "Tahta Atölyesi"), h("small", "prototip")),
      h("div.daychalk", { "aria-live": "polite" },
        st.kind === "okul" ? [h("span", "Okulun"), h("b", n + "."), h("span", "günü")] : h("span", st.text),
        h("span.opt", "· " + T.longDate()), sp ? h("span.opt", "· " + sp) : null),
      h("div.tb-right",
        h("button.chip-btn", { onclick: pickClass, "aria-label": "Sınıf değiştir" }, T.icon("class"), h("span.lbl", c.name)),
        clock));
    const tick = () => { const d = new Date(); clock.textContent = `${T.pad(d.getHours())}:${T.pad(d.getMinutes())}`; };
    tick(); clearInterval(T._clk); T._clk = setInterval(tick, 10000);
  }
  function pickClass() {
    const s = T.store.get(); let m;
    m = T.modal({ title: "Sınıf seç", body: h("div.tool-grid", s.classes.map((c) => h("button.tool-card.c-" + (c.grade >= 5 ? "sky" : "sun"), { onclick: () => { T.store.update((st) => (st.activeClassId = c.id)); T.applyTheme(); m.close(); T.route(); } }, T.icon("class"), h("span", c.name, h("small", c.grade + ". sınıf, " + c.students.length + " öğrenci"))))),
      actions: [{ label: "Sınıfları düzenle", onClick: () => T.go("sinif") }, { label: "Kapat" }] });
  }

  /* ---------- Tebeşirlik ---------- */
  const DOCK = [["ana", "Ana sayfa", "home", "chalk"], ["ekran", "Ders ekranı", "board", "sun"], ["sinif", "Sınıfım", "class", "sky"], "|", ["birinci", "1. sınıf", "letters", "tomato"],
    ["matematik", "Matematik", "math", "sun"], ["turkce", "Türkçe", "turkce", "tomato"], ["fen", "Fen", "fen", "leaf"], ["sosyal", "Hayat / Sosyal", "sosyal", "sky"], ["ingilizce", "İngilizce", "ingilizce", "grape"], ["zeka", "Bağlam soruları", "zeka", "pink"], "|",
    ["plan", "Plan", "plan", "grape"], ["ayarlar", "Ayarlar", "settings", "chalk"]];
  function dock(cur) {
    T.$("#dock").replaceChildren(...DOCK.map((d) => d === "|" ? h("span.dock-sep", { "aria-hidden": "true" }) :
      h("button.dock-item.c-" + d[3], { "aria-current": cur === d[0] ? "page" : null, onclick: () => T.go(d[0]) }, T.icon(d[2]), d[1])));
  }

  /* ---------- Ana sayfa ---------- */
  T.sections.ana = {
    title: "Ana sayfa", icon: "home",
    render(view) {
      const s = T.store.get(), c = T.store.activeClass();
      const n = T.cal.dayNumber(), st = T.cal.status(), nb = T.cal.nextBreak(), tot = T.cal.total();
      const hr = new Date().getHours();
      const sel = hr < 11 ? "Günaydın" : hr < 17 ? "İyi dersler" : "İyi akşamlar";
      const wrap = h("div.view-inner"); view.append(wrap);
      const day = (s.attendance[c.id] || {})[T.isoDate()] || {};
      const taken = Object.keys(day).length > 0;
      const came = c.students.filter((x) => day[x.id] !== "yok").length;
      const nobetci = (s.duties[c.id] || {})["Nöbetçi"];
      const nob = nobetci && c.students.find((x) => x.id === nobetci);
      const tally = h("div.tally", { "aria-hidden": "true" });
      for (let i = 0; i < Math.floor(Math.min(n, 120) / 5); i++) { const g = T.svg("svg", { viewBox: "0 0 40 30" }); g.innerHTML = '<path d="M5 3v24M12 3v24M19 3v24M26 3v24M1 24 32 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>'; tally.append(g); }
      wrap.append(h("div.home-hero",
        h("div.greet",
          h("h1", `${sel}${s.settings.teacher ? ", " + s.settings.teacher : ""}`),
          h("p", `${c.name} sınıfı, ${c.students.length} öğrenci. ${T.longDate()}.`),
          st.kind === "okul"
            ? h("div.daycount", h("div.daycount-big", n), h("div.daycount-txt", "Okulun " + n + ". günü", h("small", `${tot} okul gününün ${tot - n} günü kaldı${nb ? `. ${nb.name} öncesi ${nb.days} okul günü var` : ""}.`)))
            : h("div.daycount", h("div.daycount-txt", st.text, h("small", `Okulun ${n}. gününden sonra.${nb ? " Sıradaki: " + nb.name : ""}`))),
          tally),
        h("div.paper.today-card.taped",
          h("h2", "Bugün"),
          h("div.today-row", T.icon("check", ""), "Yoklama", taken ? h("span.pill.ok", `${came} / ${c.students.length} geldi`) : h("button.btn.sm.c-sky.pill", { onclick: () => T.go("sinif") }, "Yoklama al")),
          taken ? h("div.meter", h("i", { style: { width: (came / Math.max(1, c.students.length)) * 100 + "%" } })) : null,
          nob ? h("div.today-row", T.avatar(nob.name, 40), "Nöbetçi: " + nob.name) : null,
          T.cal.specialDay() ? h("div.today-row", T.icon("star"), T.cal.specialDay()) : null,
          h("div.today-row", T.icon("spark"), "Bugünün sayısı", h("button.btn.sm.c-leaf.pill", { onclick: () => T.go("matematik-gunun-sayisi") }, "Aç")))));
      wrap.querySelectorAll(".today-row > svg").forEach((x) => (x.style.cssText = "width:28px;height:28px;color:var(--ink-soft)"));

      wrap.append(h("div.section-title", h("h2", "Hemen tahtaya")),
        h("div.quick", [["timer", "Zamanlayıcı", "tomato"], ["name", "İsim çek", "grape"], ["dice", "Zar at", "sun"], ["groups", "Grup kur", "leaf"], ["traffic", "Trafik ışığı", "leaf"], ["noise", "Ses ölçer", "sky"]].map(([k, l, t]) =>
          h("button.btn.big.c-" + t, { onclick: () => { T.go("ekran"); setTimeout(() => T.board.add(k), 60); } }, T.icon(T.widgets[k].icon), l))));

      const tiles = [["birinci", "1. sınıf", "Kitabım, sesler, harf yazma, hece oyunları.", "letters", "tomato", 0.9], ["ekran", "Ders ekranı", "Araçları tahtaya diz, sürükle, büyüt.", "board", "sun", -1.2],
        ["sinif", "Sınıfım", "Yoklama, davranış puanı, oturma planı.", "class", "sky", 0.8],
        ["matematik", "Matematik", "Sayı hissi, oyunlar, manipülatifler, simülasyonlar.", "math", "sun", -0.6],
        ["turkce", "Türkçe", "Hece kartları, okuma hızı, yazım.", "turkce", "tomato", 1.1],
        ["fen", "Fen", "Ölçüm tablosu, ay evreleri, devre.", "fen", "leaf", -0.9],
        ["sosyal", "Hayat / Sosyal", "Zaman şeridi, aile ağacı, harita.", "sosyal", "sky", 0.6],
        ["ingilizce", "İngilizce", "Resimli kartlar, dinle ve seç.", "ingilizce", "grape", -1],
        ["zeka", "Bağlam soruları", "Gerçek hayat durumu, akıl yürütme.", "zeka", "pink", 1.3],
        ["plan", "Plan", "Yapay zekayla günlük ve yıllık plan.", "plan", "grape", -0.4]];
      wrap.append(h("div.section-title", h("h2", "Atölyeler")),
        h("div.tiles", tiles.map(([id, t, d, ic, tone, tilt]) => h("button.tile.c-" + tone, { style: { "--tilt": tilt + "deg" }, onclick: () => T.go(id) }, T.icon(ic, "ic"), h("div", h("h3", t), h("p", d))))));
    },
  };

  /* ---------- Yönlendirme ---------- */
  T.route = function () {
    T.cleanups.splice(0).forEach((f) => { try { f(); } catch (e) {} });
    const raw = (location.hash || "#ana").slice(1);
    const i = raw.indexOf("-");
    const id = i < 0 ? raw : raw.slice(0, i), sub = i < 0 ? null : raw.slice(i + 1);
    const sec = T.sections[id] || T.sections.ana;
    T.applyTheme();
    topbar();
    dock(T.sections[id] ? id : "ana");
    const view = T.$("#view");
    view.replaceChildren();
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
  T.route();
  // Gece yarısını geçince takvim yenilensin
  setInterval(() => { const d = T.isoDate(); if (d !== T._day) { T._day = d; if ((location.hash || "#ana") === "#ana") T.route(); else topbar(); } }, 60000);
  T._day = T.isoDate();
})();
