/* Plan: yapay zekayla günlük plan, takvime oturan yıllık plan. Plan, ders ekranını kurar. */
(function () {
  const { h } = T;
  const DERSLER = {
    ilkokul: ["Türkçe", "Matematik", "Hayat Bilgisi", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce", "Görsel Sanatlar", "Müzik", "Beden Eğitimi ve Oyun"],
    ortaokul: ["Türkçe", "Matematik", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce", "Bilişim Teknolojileri ve Yazılım", "Görsel Sanatlar", "Müzik", "Beden Eğitimi ve Spor"],
  };
  let tab = "gunluk";
  let current = null, shownSample = false;

  const SAMPLE = {
    baslik: "Eşit gruplar ve çarpmanın anlamı", ders: "Matematik", sinif: "3", sure: "40 dakika",
    ciktilar: ["Çarpma işlemini eşit grupların tekrarlı toplamı olarak açıklar.", "Bir çarpma durumunu nesne, şekil ve sembolle gösterir."],
    kavramlar: ["eşit grup", "tekrarlı toplama", "çarpım"],
    materyaller: ["Bir kavanoz düğme (ya da fasulye)", "Altı küçük kâse", "Ders ekranı: zamanlayıcı, grup oluştur, çıkış bileti"],
    akis: [
      { dk: 5, baslik: "Dikkat çekme", metin: "Öğretmen sınıfın ortasına bir kavanoz düğme ve altı küçük kâse koyar. Hiçbir şey söylemeden her kâseye dörder düğme koymaya başlar. Üçüncü kâsede durur ve kalan kâseleri öğrencilere uzatır. Öğrenciler kâseleri doldurur, sınıf toplam düğme sayısını tahmin eder.\nTahminler tahtaya yazılır. Saymadan bulmanın yolu var mı, sorusu ders boyunca açık kalır.", arac: ["timer"] },
      { dk: 12, baslik: "Keşfetme", metin: "Öğrenciler dörderli gruplara ayrılır. Her gruba bir kart verilir: 3 kâsede 5'er, 4 kâsede 2'şer gibi. Gruplar düğmeleri kâselere dağıtır, toplamı bulur ve bulduğu yolu kâğıda çizer.\nBir grup kâselere eşit olmayan sayıda düğme koyarsa öğretmen düzeltmez; o grubun çizimini paylaşım sırasında diğerlerinin yanına koyar. Eşit olmayan grubun neden tek bir çarpmayla yazılamadığını sınıf kendi bulur.", arac: ["groups", "symbol"] },
      { dk: 10, baslik: "Anlamı aktarma", metin: "Grupların çizimleri tahtaya asılır. Öğretmen sayı doğrusunda 4'er atlamayı gösterir, öğrenciler aynı toplamı tekrarlı toplama ve çarpma olarak yazar: 4 + 4 + 4 + 4 + 4 + 4 = 6 × 4.\nSembol ilk kez burada, nesne ve çizimden sonra gelir. Öğrenciler kendi kartının çarpma cümlesini yazar.", arac: ["sayi-dogrusu"] },
      { dk: 8, baslik: "Uygulama", metin: "Her öğrenci sınıftan bir eşit grup örneği bulur: sıralardaki iki kişi, pencere camındaki bölmeler. Bulduğu durumu bir çizim ve bir çarpma cümlesiyle dönüşümlü düşünme defterine yazar.\nErken bitirenler, aynı toplamı veren iki farklı çarpma bulmaya çalışır: 12 = 3 × 4 = 2 × 6.", arac: ["timer"] },
      { dk: 5, baslik: "Kapanış", metin: "Öğrenciler sınıftan çıkarken çıkış biletinde kendilerine en uygun yüzü seçer. Yardım lazım diyenler bir sonraki derse küçük grupla başlar.", arac: ["ticket"] },
    ],
    farklilastirma: { destek: "Toplamı sayarak bulmakta zorlanan öğrenciye onluk çerçeve verilir; her kâse bir sıra olur.", zenginlestirme: "Kâse sayısını ve kâsedeki düğme sayısını yer değiştirince toplamın değişip değişmediği araştırılır." },
    degerlendirme: "Öğrencilerin kart çizimleri ve defterlerindeki çarpma cümleleri incelenir. Hangi çalışmanın portfolyoya gireceğine öğrenci karar verir.",
    sorun: "Düğmeler yetmezse kâse sayısı azaltılır ya da kalem kapakları kullanılır. Gruplar aynı kartla çalışmak isterse kartlar değiştirilir; amaç farklı toplamları karşılaştırmaktır.",
  };

  T.sections.plan = {
    title: "Plan", icon: "plan", tone: "grape", desc: "Günlük ve yıllık plan, yapay zekayla",
    render(view) {
      const wrap = h("div.view-inner"); view.append(wrap);
      wrap.append(h("div.page-head", h("h1", "Planlarım"), h("div.sub", "Plan yaz, tek dokunuşla o dersin ekranını kur.")),
        h("div.tabs", { role: "tablist" }, [["gunluk", "Günlük plan", "plan"], ["yillik", "Yıllık plan", "calendar"], ["kayit", "Kayıtlı planlar", "save"]].map(([k, l, ic]) => h("button", { role: "tab", "aria-selected": String(tab === k), onclick: () => { tab = k; T.route(); } }, T.icon(ic), l))));
      const area = h("div"); wrap.append(area);
      ({ gunluk, yillik, kayit })[tab](area);
    },
  };

  /* ---------- Günlük plan ---------- */
  function gunluk(area) {
    const c = T.store.activeClass(), k = T.store.kademe();
    const ders = h("select.in", { "aria-label": "Ders" }, DERSLER[k].map((d) => h("option", { selected: d === (T.store.get().settings.subject || "Matematik") }, d)));
    const sinif = h("select.in", { "aria-label": "Sınıf" }, [1, 2, 3, 4, 5, 6, 7, 8].map((g) => h("option", { value: g, selected: g === c.grade }, g + ". sınıf")));
    const konu = h("input.in", { placeholder: "Konu ya da öğrenme çıktısı. Örnek: Kesirleri sayı doğrusunda gösterir.", "aria-label": "Konu" });
    const sure = h("select.in", { "aria-label": "Süre" }, ["40 dakika", "2 ders saati (80 dakika)", "30 dakika"].map((s) => h("option", s)));
    const not = h("textarea.in", { placeholder: "Sınıfın hakkında bir iki cümle (isteğe bağlı). Örnek: Kalabalık bir sınıf, iki öğrencim okumada geride, ellerinde düğme ve kâse var.", style: { minHeight: "80px" }, "aria-label": "Sınıf notu" });
    const out = h("div");
    /* Öğrenme çıktısı seçici: ders ve sınıf için programdaki çıktılar kendiliğinden gelir. */
    let secili = [];
    const secim = h("div.oc-box");
    const drawSecim = () => {
      const temalar = T.ciktilar.temalar(ders.value, +sinif.value);
      /* Seçim anahtarı "temaSırası|kod": Türkçede aynı kod her temada farklı bileşenlerle geçer. */
      secili = secili.filter((k) => { const [ti, kod] = k.split("|"); return temalar && temalar[ti] && temalar[ti].c.some((x) => x.kod === kod); });
      if (!temalar) {
        secim.replaceChildren(h("p.hint", { style: { margin: 0 } }, ders.value + " " + sinif.value + ". sınıf öğrenme çıktıları henüz eklenmedi. Konuyu kendin yazabilirsin."));
        return;
      }
      const temaSec = h("select.in", { "aria-label": "Tema" }, temalar.map((t, i) => h("option", { value: i }, /^İlk Okuma/.test(t.tema) ? t.tema : (i + 1 - (temalar.some((y) => /^İlk Okuma/.test(y.tema)) ? 1 : 0)) + ". " + ((T.ciktilar.birim || {})[ders.value] || "Tema") + ": " + t.tema)));
      if (secim._tema != null && secim._tema < temalar.length) temaSec.value = secim._tema;
      const liste = h("div.oc-list");
      const drawListe = () => {
        secim._tema = +temaSec.value;
        liste.replaceChildren(...temalar[+temaSec.value].c.map((x) => {
          const key = temaSec.value + "|" + x.kod;
          const cb = h("input", { type: "checkbox", checked: secili.includes(key), onchange: () => {
            secili = cb.checked ? secili.concat(key) : secili.filter((k) => k !== key);
            sayac.textContent = secili.length ? secili.length + " çıktı seçildi" : "";
          } });
          return h("div.oc-item", h("label", cb, h("span.oc-kod", x.kod), h("span", x.metin)),
            x.b.length ? h("details", h("summary", "Süreç bileşenleri"), h("ul", T.ciktilar.harfli(x.b).map((y) => h("li", y)))) : null);
        }));
      };
      temaSec.addEventListener("change", drawListe);
      const sayac = h("span.hint", secili.length ? secili.length + " çıktı seçildi" : "");
      drawListe();
      secim.replaceChildren(h("div.row", { style: { alignItems: "end" } }, h("label.f", { style: { flex: "1" } }, h("span", "Öğrenme çıktıları (Maarif)"), temaSec), sayac), liste,
        h("small.hint", "Kaynak: " + (T.ciktilar.kaynak[ders.value] || "MEB öğretim programı")));
    };
    ders.addEventListener("change", () => { secim._tema = null; drawSecim(); });
    sinif.addEventListener("change", () => { secim._tema = null; drawSecim(); });
    drawSecim();
    area.append(h("div.paper", { style: { padding: "20px", display: "grid", gap: "14px", marginBottom: "22px" } },
      T.ai.statusEl(),
      h("div.form-grid", h("label.f", h("span", "Ders"), ders), h("label.f", h("span", "Sınıf"), sinif), h("label.f", h("span", "Süre"), sure)),
      secim,
      h("label.f", h("span", "Konu ya da odak (isteğe bağlı)"), konu),
      h("label.f", h("span", "Sınıfın"), not),
      h("div.row", h("button.btn.big.c-grape", { onclick: () => generate() }, T.icon("spark"), "Planı hazırla"),
        h("button.btn.c-chalk", { onclick: () => { current = JSON.parse(JSON.stringify(SAMPLE)); renderPlan(out, current); } }, T.icon("eye"), "Örnek planı göster"),
        h("span.hint", "Öğrenci adları yapay zekaya gönderilmez."))), out);
    if (!current && !shownSample) { shownSample = true; current = JSON.parse(JSON.stringify(SAMPLE)); }
    if (current) renderPlan(out, current);
    async function generate() {
      if (!konu.value.trim() && !secili.length) { T.toast("Bir öğrenme çıktısı seç ya da konuyu yaz"); konu.focus(); return; }
      const temalarS = T.ciktilar.temalar(ders.value, +sinif.value) || [];
      const secCikti = secili.map((k) => { const [ti, kod] = k.split("|"); const t = temalarS[ti]; const x = t && t.c.find((y) => y.kod === kod); return x && Object.assign({ tema: t.tema }, x); }).filter(Boolean);
      if (!T.ai.mode()) { current = JSON.parse(JSON.stringify(SAMPLE)); renderPlan(out, current); T.toast("Yapay zeka bağlı değil, örnek plan gösteriliyor"); return; }
      const live = h("pre", { style: { whiteSpace: "pre-wrap", fontSize: "13px", maxHeight: "200px", overflow: "auto", color: "var(--ink-soft)" } });
      out.replaceChildren(h("div.paper", { style: { padding: "20px" } }, h("div.ai-status", h("div.spinner"), "Plan hazırlanıyor. Bu 20-40 saniye sürebilir."), live));
      const tools = Object.entries(T.widgets).filter(([, w]) => w.group !== "Gizli").map(([id, w]) => `${id}: ${w.title}`)
        .concat(Object.entries(T.tools).map(([id, t]) => `${id}: ${t.title}`)).join("\n");
      try {
        const j = await T.ai.askJSON(`Sen Türkiye Yüzyılı Maarif Modeli'ni iyi bilen deneyimli bir sınıf ve branş öğretmenisin. Aşağıdaki ders için günlük ders planı yaz.
Ders: ${ders.value}
Sınıf: ${sinif.value}. sınıf
Süre: ${sure.value}
${secCikti.length ? "Tema: " + secCikti[0].tema + "\nÖğrenme çıktıları (programdaki gibi, kodlarıyla):\n" + secCikti.map((x) => x.kod + " " + x.metin + (x.b.length ? "\n  Süreç bileşenleri: " + T.ciktilar.harfli(x.b).join(" ") : "")).join("\n") + "\n" : ""}Konu / odak: ${konu.value || "seçilen çıktılar"}
Öğretmenin sınıf notu: ${not.value || "yok"}

Pedagojik ilkeler:
- Ders tek bir somut iş ve malzeme üzerine kurulsun. Dikkat çekme, sınıfın ortasına getirilen tek bir basit malzemeyle başlasın.
- Sorgulamayı etkinlik ve malzeme taşısın; "öğretmen sorar, öğrenci söyler" zinciri kurma, soru sayısını az tut.
- Akış her adımda öğretmenin ne yapacağını eksiksiz anlatan paragraflarla yazılsın, madde işareti kullanma. Bir adımın içinde konu değişirse yeni satıra geç.
- Beklenmedik durumlarda (malzeme yetmezse, deney beklendiği gibi çıkmazsa, öğrenci yanlış yola saparsa) ne yapılacağını yaz.
- Değerlendirmede "gözlem formu" deme. Öğrencinin hangi çalışmasının portfolyoya gireceğine kendisinin karar verdiğini, öğrencinin dönüşümlü düşünme defterine yazdığını belirt.
- Öğrenme çıktısı kodu uydurma. Çıktılar verildiyse dersi o çıktılara ve süreç bileşenlerine göre kur; verilmediyse yalnızca çıktıyı cümle olarak yaz.
- TDK yazım kurallarına uy, kısa ve net cümleler kur.

Her adıma, derste tahtada açılacak uygun araçları aşağıdaki listeden id ile ekle (en fazla 2):
${tools}

JSON biçimi:
{"baslik": "...", "ders": "...", "sinif": "...", "sure": "...", "ciktilar": ["..."], "kavramlar": ["..."], "materyaller": ["..."],
 "akis": [{"dk": 5, "baslik": "Dikkat çekme", "metin": "paragraflar, satır sonu için \\n", "arac": ["timer"]}],
 "farklilastirma": {"destek": "...", "zenginlestirme": "..."}, "degerlendirme": "...", "sorun": "beklenmedik durumlarda ne yapılır"}
Adım sürelerinin toplamı ders süresine eşit olsun.`, { onText: (t) => (live.textContent = t.slice(-1200)) });
        if (secCikti.length) j.ciktilar = secCikti.map((x) => x.kod + " " + x.metin);
        current = j; renderPlan(out, j);
      } catch (e) {
        out.replaceChildren(h("div.paper", { style: { padding: "20px" } }, h("p", "Plan hazırlanamadı: " + (e.message || "bağlantı sorunu") + "."), h("button.btn.c-chalk", { onclick: generate }, T.icon("reset"), "Tekrar dene")));
      }
    }
  }

  function planText(p) {
    const L = [];
    L.push(`${p.ders} · ${p.sinif}. sınıf · ${p.sure}`, p.baslik, "");
    L.push("Öğrenme çıktıları:", ...(p.ciktilar || []).map((x) => "- " + x), "");
    if (p.kavramlar) L.push("Kavramlar: " + p.kavramlar.join(", "), "");
    if (p.materyaller) L.push("Materyaller: " + p.materyaller.join(", "), "");
    (p.akis || []).forEach((s) => L.push(`${s.baslik} (${s.dk} dk)`, s.metin, ""));
    if (p.farklilastirma) L.push("Farklılaştırma", "Destek: " + p.farklilastirma.destek, "Zenginleştirme: " + p.farklilastirma.zenginlestirme, "");
    L.push("Değerlendirme", p.degerlendirme || "", "");
    if (p.sorun) L.push("Beklenmedik durumlarda", p.sorun);
    return L.join("\n");
  }
  function planHTML(p) {
    const esc = (s) => String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])).replace(/\n/g, "<br>");
    return `<html><head><meta charset="utf-8"><title>${esc(p.baslik)}</title></head><body style="font-family:Calibri,Arial;font-size:11pt">
<h2>${esc(p.baslik)}</h2><p>${esc(p.ders)} · ${esc(p.sinif)}. sınıf · ${esc(p.sure)}</p>
<table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
<tr><td><b>Öğrenme çıktıları</b></td><td>${(p.ciktilar || []).map(esc).join("<br>")}</td></tr>
<tr><td><b>Kavramlar</b></td><td>${esc((p.kavramlar || []).join(", "))}</td></tr>
<tr><td><b>Materyaller</b></td><td>${esc((p.materyaller || []).join(", "))}</td></tr>
${(p.akis || []).map((s) => `<tr><td><b>${esc(s.baslik)}</b><br>${s.dk} dk</td><td>${esc(s.metin)}</td></tr>`).join("")}
<tr><td><b>Farklılaştırma</b></td><td>Destek: ${esc(p.farklilastirma && p.farklilastirma.destek)}<br>Zenginleştirme: ${esc(p.farklilastirma && p.farklilastirma.zenginlestirme)}</td></tr>
<tr><td><b>Değerlendirme</b></td><td>${esc(p.degerlendirme)}</td></tr>
<tr><td><b>Beklenmedik durumlarda</b></td><td>${esc(p.sorun)}</td></tr></table></body></html>`;
  }
  function boardFor(p) {
    const list = [{ type: "text", title: "Bugünkü dersimiz", data: { items: (p.akis || []).map((s) => ({ t: `${s.baslik} (${s.dk} dk)`, done: false })), size: 22 } }];
    const seen = new Set();
    (p.akis || []).forEach((s) => (s.arac || []).forEach((id) => {
      if (seen.has(id)) return; seen.add(id);
      if (T.widgets[id]) list.push({ type: id, data: id === "timer" ? { total: s.dk * 60, left: s.dk * 60, running: false, endAt: 0 } : undefined });
      else if (T.tools[id]) list.push({ type: "toollink", data: { tool: id } });
    }));
    return list.slice(0, 7);
  }
  function renderPlan(out, p) {
    const toolChip = (id) => {
      const w = T.widgets[id], t = T.tools[id];
      if (!w && !t) return null;
      return h("button.btn.sm.c-chalk", { onclick: () => (w ? T.board.add(id) : T.go((t.back || "matematik") + "-" + id)) }, T.icon((w || t).icon), (w || t).title);
    };
    out.replaceChildren(
      h("div.row", { style: { marginBottom: "14px" } },
        h("button.btn.big.c-sun", { onclick: () => T.board.setup(boardFor(p)) }, T.icon("board"), "Ders ekranını kur"),
        h("button.btn.c-chalk", { onclick: () => { T.store.update((s) => s.plans.unshift(Object.assign({ id: T.uid(), at: Date.now() }, p))); T.toast("Plan kaydedildi"); } }, T.icon("save"), "Kaydet"),
        h("button.btn.c-chalk", { onclick: () => T.copyText(planText(p), "Plan metni kopyalandı") }, T.icon("copy"), "Metni kopyala"),
        h("button.btn.c-chalk", { onclick: () => T.download((p.baslik || "plan") + ".doc", planHTML(p), "application/msword") }, T.icon("download"), "Word olarak indir")),
      h("article.paper.plan-doc",
        h("div.hint", `${p.ders} · ${p.sinif}. sınıf · ${p.sure}`),
        h("h2", p.baslik),
        h("h3", "Öğrenme çıktıları"), h("ul", (p.ciktilar || []).map((x) => h("li", x))),
        p.kavramlar ? h("p", h("b", "Kavramlar: "), p.kavramlar.join(", ")) : null,
        p.materyaller ? h("p", h("b", "Materyaller: "), p.materyaller.join(", ")) : null,
        h("h3", "Ders akışı"),
        (p.akis || []).map((s) => h("div.plan-step", h("div.min", s.dk + " dk"), h("div", h("b", s.baslik), String(s.metin || "").split("\n").map((para) => h("p", para)), h("div.tools", (s.arac || []).map(toolChip))))),
        p.farklilastirma ? [h("h3", "Farklılaştırma"), h("p", h("b", "Destek: "), p.farklilastirma.destek), h("p", h("b", "Zenginleştirme: "), p.farklilastirma.zenginlestirme)] : null,
        h("h3", "Değerlendirme"), h("p", p.degerlendirme),
        p.sorun ? [h("h3", "Beklenmedik durumlarda"), h("p", p.sorun)] : null));
  }

  /* ---------- Yıllık plan ---------- */
  function yillik(area) {
    const c = T.store.activeClass(), k = T.store.kademe();
    const ders = h("select.in", { "aria-label": "Ders" }, DERSLER[k].map((d) => h("option", { selected: d === "Matematik" }, d)));
    const saat = h("input.in", { type: "number", value: k === "ilkokul" ? 5 : 5, min: 1, max: 12, "aria-label": "Haftalık ders saati" });
    const temalar = h("textarea.in", { "aria-label": "Temalar", style: { minHeight: "160px" } });
    temalar.value = "Sayılar ve Nicelikler (1) | 6\nSayılar ve Nicelikler (2) | 6\nİşlemlerden Cebirsel Düşünmeye | 7\nNesnelerin Geometrisi | 5\nGeometrik Nicelikler | 5\nVeriye Dayalı Araştırma | 4\nSayılar ve Nicelikler (3) | 3";
    const out = h("div");
    area.append(h("div.paper", { style: { padding: "20px", display: "grid", gap: "14px", marginBottom: "22px" } },
      h("p", { style: { margin: 0 } }, "Yıllık plan, MEB 2026-2027 çalışma takvimine oturur. Ara tatiller, yarıyıl ve resmî tatiller kendiliğinden atlanır. Tema adlarını ve hafta sayılarını öğretim programından al; yapay zeka varsa her haftanın konusunu da önerir."),
      h("div.form-grid", h("label.f", h("span", "Ders"), ders), h("label.f", h("span", "Sınıf"), h("input.in", { value: c.grade + ". sınıf", readonly: true })), h("label.f", h("span", "Haftalık ders saati"), saat)),
      h("label.f", h("span", "Temalar / üniteler: her satıra Ad | hafta sayısı. Aşağıdakiler örnektir; kendi öğretim programındakilerle değiştir."), temalar),
      h("div.row", h("button.btn.big.c-grape", { onclick: () => build(false) }, T.icon("calendar"), "Takvime yerleştir"),
        h("button.btn.c-sun", { onclick: () => build(true) }, T.icon("spark"), "Haftalık konuları da yapay zekayla doldur"))), out);
    async function build(useAI) {
      const items = temalar.value.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((x) => x[0]).map(([n, w]) => ({ n, w: Math.max(1, +w || 1) }));
      const weeks = T.cal.weeks();
      const rows = []; let ti = 0, used = 0;
      weeks.forEach((wk, i) => {
        if (!wk.schoolDays) { rows.push({ wk, tema: wk.closed, tatil: true }); return; }
        const it = items[ti];
        rows.push({ wk, tema: it ? it.n : "Genel tekrar ve proje", hafta: it ? used + 1 : null, konu: "" });
        if (it) { used++; if (used >= it.w) { ti++; used = 0; } }
      });
      const need = items.reduce((a, b) => a + b.w, 0), have = weeks.filter((w) => w.schoolDays).length;
      paint(rows, need, have);
      if (useAI) {
        if (!T.ai.mode()) { T.toast("Yapay zeka bağlı değil. Takvim hazır, konuları sen yazabilirsin."); return; }
        const status = h("div.ai-status", h("div.spinner"), "Haftalık konular hazırlanıyor...");
        out.prepend(status);
        try {
          const list = rows.filter((r) => !r.tatil).map((r, i) => `${i + 1}. hafta (${r.wk.monday}): ${r.tema}${r.hafta ? ", temanın " + r.hafta + ". haftası" : ""}`).join("\n");
          const j = await T.ai.askJSON(`${c.grade}. sınıf ${ders.value} dersi için yıllık planın haftalık konu satırlarını yaz. Haftalık ${saat.value} ders saati var.
Türkiye Yüzyılı Maarif Modeli temalarına göre sıralı ve tekrar etmeyen kısa konu başlıkları öner. Öğrenme çıktısı kodu uydurma. TDK yazımına uy. Her satır en fazla 12 kelime.
Haftalar:
${list}
JSON: {"konular": ["1. haftanın konusu", "2. haftanın konusu", ...]}`);
          let k2 = 0; rows.forEach((r) => { if (!r.tatil) r.konu = (j.konular || [])[k2++] || ""; });
          paint(rows, need, have);
        } catch (e) { status.replaceChildren("Konular üretilemedi: " + (e.message || "bağlantı sorunu")); }
      }
    }
    function paint(rows, need, have) {
      const ay = (iso) => { const d = new Date(iso + "T12:00:00"); return d.getDate() + " " + T.AYLAR[d.getMonth()]; };
      const csv = ["Hafta;Tarih;Tema;Konu"].concat(rows.map((r, i) => `${i + 1};${ay(r.wk.monday)} - ${ay(r.wk.friday)};${r.tema || ""};${r.konu || ""}`)).join("\n");
      out.replaceChildren(
        h("div.row", { style: { marginBottom: "12px" } },
          h("span.pill" + (need > have ? ".warn" : ".ok"), `${have} eğitim haftası, temalar ${need} hafta istiyor`),
          need > have ? h("span.hint", { style: { color: "var(--chalk)" } }, "Fazla haftalar sığmadı; tema sürelerini kısalt.") : null,
          h("div.spacer"), h("button.btn.c-chalk", { onclick: () => T.download(`${ders.value}-yillik-plan.csv`, csv, "text/csv") }, T.icon("download"), "Excel için indir"),
          h("button.btn.c-chalk", { onclick: () => T.copyText(csv.replace(/;/g, "\t")) }, T.icon("copy"), "Kopyala")),
        h("div.paper", { style: { padding: "6px 14px", overflow: "auto" } }, h("table.table",
          h("thead", h("tr", h("th", "Hafta"), h("th", "Tarih"), h("th", "Tema"), h("th", "Konu"))),
          h("tbody", rows.map((r, i) => h("tr", { style: r.tatil ? { background: "#f3efe6", color: "#7a6f5d" } : null },
            h("td", r.tatil ? "" : rows.slice(0, i + 1).filter((x) => !x.tatil).length), h("td", ay(r.wk.monday) + " - " + ay(r.wk.friday)),
            h("td", r.tatil ? h("i", r.tema) : [r.tema, r.hafta ? h("span.hint", " (" + r.hafta + ". hafta)") : null]),
            h("td", { contenteditable: r.tatil ? null : "true", oninput: (e) => (r.konu = e.target.textContent) }, r.konu || "")))))));
    }
  }

  /* ---------- Kayıtlı planlar ---------- */
  function kayit(area) {
    const s = T.store.get();
    if (!s.plans.length) { area.append(h("div.paper", { style: { padding: "22px" } }, h("p", "Henüz kayıtlı plan yok. Günlük plan sekmesinde bir plan hazırlayıp Kaydet'e bas."))); return; }
    area.append(h("div.tool-grid", s.plans.map((p) => h("div.paper", { style: { padding: "16px", display: "grid", gap: "8px" } },
      h("div.hint", `${p.ders} · ${p.sinif}. sınıf · ${new Date(p.at).toLocaleDateString("tr-TR")}`),
      h("b", { style: { fontSize: "18px" } }, p.baslik),
      h("div.row", h("button.btn.sm.c-sun", { onclick: () => { current = p; tab = "gunluk"; T.route(); } }, "Aç"),
        h("button.btn.sm.c-chalk", { onclick: () => T.board.setup(boardFor(p)) }, T.icon("board"), "Ekranı kur"),
        h("button.btn.sm.icon.c-tomato", { "aria-label": "Sil", onclick: () => { T.store.update((st) => (st.plans = st.plans.filter((x) => x.id !== p.id))); T.route(); } }, T.icon("trash")))))));
  }
})();
