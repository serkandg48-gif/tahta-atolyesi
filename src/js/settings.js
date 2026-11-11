/* Ayarlar */
(function () {
  const { h } = T;
  T.sections.ayarlar = {
    title: "Ayarlar", icon: "settings", tone: "chalk", desc: "Kademe, takvim, yapay zeka, veriler",
    render(view) {
      const s = T.store.get(), st = s.settings;
      const wrap = h("div.view-inner"); view.append(wrap);
      const field = (label, el, hint) => h("label.f", h("span", label), el, hint ? h("small.hint", hint) : null);
      const inp = (key, ph, type = "text") => { const i = h("input.in", { type, value: st[key] || "", placeholder: ph }); i.addEventListener("change", () => { T.store.update(() => (st[key] = i.value.trim())); T.toast("Kaydedildi"); }); return i; };
      const kademe = h("div.seg", [["auto", "Sınıfa göre"], ["ilkokul", "İlkokul görünümü"], ["ortaokul", "Ortaokul görünümü"]].map(([v, l]) => h("button", { "aria-pressed": String(st.kademeMode === v), onclick: () => { T.store.update(() => (st.kademeMode = v)); T.applyTheme(); T.route(); } }, l)));
      const cal = s.calendar;
      const closed = h("textarea.in", { style: { minHeight: "170px", fontFamily: "monospace", fontSize: "14px" }, "aria-label": "Tatil günleri" });
      closed.value = cal.closed.map((c) => c.join(" | ")).join("\n");
      const cs = h("input.in", { type: "date", value: cal.start }), ce = h("input.in", { type: "date", value: cal.end });
      const backup = () => JSON.stringify(T.store.get());
      wrap.append(h("div.page-head", h("h1", "Ayarlar")),
        h("div", { style: { display: "grid", gap: "22px", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", alignItems: "start" } },
          h("section.paper", { style: { padding: "20px", display: "grid", gap: "14px" } }, h("h2", { style: { fontSize: "22px" } }, "Ben ve okulum"),
            field("Adım", inp("teacher", "Örnek: Ayşe Öğretmen"), "Ana sayfadaki selamlamada kullanılır."),
            field("Okulum", inp("school", "Örnek: Cumhuriyet İlkokulu")),
            field("Görünüm", kademe, "Sınıfa göre seçilirse 1-4. sınıflarda renkli, 5-8. sınıflarda sade görünüm açılır.")),
          h("section.paper", { style: { padding: "20px", display: "grid", gap: "14px" } }, h("h2", { style: { fontSize: "22px" } }, "Yapay zeka"),
            T.ai.statusEl(),
            field("Gemini API anahtarı", inp("geminiKey", "AIza...", "password"), "Kendi sitende kullanılır. Ücretsiz anahtarı Google AI Studio'dan (aistudio.google.com) alabilirsin. Anahtar yalnızca bu cihazda saklanır. Ücretsiz katmanda günlük sınır vardır."),
            field("Model", inp("geminiModel", "gemini-flash-latest"), "Boş bırakırsan güncel hızlı model kullanılır.")),
          h("section.paper", { style: { padding: "20px", display: "grid", gap: "14px" } }, h("h2", { style: { fontSize: "22px" } }, "Okul takvimi"),
            h("p.hint", { style: { margin: 0 } }, "MEB 2026-2027 çalışma takvimi yüklü. Okulunun takvimi farklıysa düzelt. Okulun kaçıncı günü ve yıllık plan bu takvimle hesaplanır."),
            h("div.form-grid", field("İlk ders günü", cs), field("Son ders günü", ce)),
            field("Okulun kapalı olduğu günler: başlangıç | bitiş | ad", closed),
            h("div.row", h("button.btn.c-leaf", { onclick: () => {
              const list = closed.value.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x[0]) && /^\d{4}-\d{2}-\d{2}$/.test(x[1]));
              T.store.update(() => { cal.start = cs.value; cal.end = ce.value; cal.closed = list.map((x) => [x[0], x[1], x[2] || "Tatil"]); });
              T.toast("Takvim kaydedildi. Bugün okulun " + T.cal.dayNumber() + ". günü.");
            } }, T.icon("save"), "Takvimi kaydet"),
              h("button.btn.c-chalk", { onclick: () => { T.store.update(() => (s.calendar = JSON.parse(JSON.stringify(T.cal.def)))); T.route(); } }, "MEB takvimine dön"))),
          h("section.paper", { style: { padding: "20px", display: "grid", gap: "14px" } }, h("h2", { style: { fontSize: "22px" } }, "Verilerim"),
            h("p", { style: { margin: 0 } }, "Sınıf listeleri, yoklama ve planlar şimdilik yalnızca bu cihazda, bu tarayıcıda tutulur. Google ile giriş açıldığında bütün cihazlarında eşitlenecek. O zamana kadar ara ara yedek al."),
            h("p.hint", { style: { margin: 0 } }, "Öğrenci fotoğrafı tutulmaz, yapay zekaya öğrenci adı gönderilmez."),
            h("div.row", h("button.btn.c-sky", { onclick: () => T.download("tahta-atolyesi-yedek.json", backup(), "application/json") }, T.icon("download"), "Yedek indir"),
              h("label.btn.c-chalk", { style: { cursor: "pointer" } }, T.icon("save"), "Yedekten yükle", h("input", { type: "file", accept: ".json,application/json", style: { display: "none" }, onchange: async (e) => {
                const f = e.target.files[0]; if (!f) return;
                try { const j = JSON.parse(await f.text()); if (!j.classes) throw 0; T.store.update((st2) => Object.assign(st2, j)); T.applyTheme(); T.toast("Yedek yüklendi"); T.route(); }
                catch (er) { T.toast("Bu dosya bir Tahta Atölyesi yedeği değil"); }
              } })),
              h("button.btn.c-tomato", { onclick: async () => { if (await T.confirm("Her şeyi sıfırla", "Bütün sınıflar, yoklamalar ve planlar silinip örnek verilere dönülsün mü?", "Sıfırla")) { T.store.reset(); T.store.load(); T.applyTheme(); T.go("ana"); } } }, T.icon("trash"), "Sıfırla"))),
          h("section.paper", { style: { padding: "20px", display: "grid", gap: "10px" } }, h("h2", { style: { fontSize: "22px" } }, "Kurulum"),
            h("p", { style: { margin: 0 } }, "Tahta Atölyesi tarayıcıda çalışır: Pardus ve Windows tahtalarda, Android tahtalarda, MacBook'ta ve telefonda. Kendi alan adında yayınlandığında tarayıcı menüsündeki Uygulamayı yükle ile masaüstüne eklenir ve internet olmadan da açılır."),
            h("p.hint", { style: { margin: 0 } }, "Çalışma adı: Tahta Atölyesi. Sürüm: prototip 0.1"))));
    },
  };
})();
