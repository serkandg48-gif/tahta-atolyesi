/* Sohbet ve düşünme araçları: Söz ağı (canlı tartışma haritası) */
(function () {
  const { h } = T; const W = T.widgets; const NS = "http://www.w3.org/2000/svg";
  const gelenler = (cls) => { const s = T.store.get(), a = (s.attendance[cls.id] || {})[T.isoDate()] || {}; return cls.students.filter((st) => a[st.id] !== "yok"); };
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };

  /* ---------- Söz ağı: konuşan öğrenciye dokundukça bir öncekinden ona çizgi uzanır ---------- */
  W.sozagi = {
    title: "Söz ağı", icon: "talk", tone: "grape", w: 640, h: 560, desc: "Tartışmada sözün sınıfa nasıl yayıldığını gösterir",
    init: () => ({ sira: [], ozet: false }),
    render(body, w, api) {
      const d = w.data; d.sira = d.sira || [];
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      const svg = el("svg", { viewBox: "0 0 600 470", class: "sa-svg", role: "img", "aria-label": "Söz ağı" });
      const bilgi = h("div.sa-bilgi");
      const ozetKutu = h("div.sa-ozet");
      body.append(h("div.sa-kap", svg, ozetKutu), h("div.row", { style: { gap: "6px", justifyContent: "center" } }, bilgi,
        h("button.btn.sm.c-chalk", { onclick: () => { d.sira.pop(); api.save(); ciz(); } }, T.icon("undo"), "Geri al"),
        h("button.btn.sm.c-grape", { onclick: () => { d.ozet = !d.ozet; api.save(); ciz(); } }, T.icon("chart"), "Sohbeti incele"),
        h("button.btn.sm.c-chalk", { onclick: async () => { if (d.sira.length && !(await T.confirm("Yeni sohbet", "Söz ağı temizlensin mi?", "Temizle"))) return; d.sira = []; d.ozet = false; api.save(); ciz(); } }, T.icon("reset"), "Yeni sohbet")));
      function ciz() {
        const st = gelenler(api.cls()); const n = st.length;
        const yer = { ogr: [300, 235] };
        st.forEach((s, i) => { const a = -Math.PI / 2 + (i / Math.max(1, n)) * Math.PI * 2; yer[s.id] = [300 + Math.cos(a) * 250, 235 + Math.sin(a) * 195]; });
        const say = {}; d.sira.forEach((x) => (say[x] = (say[x] || 0) + 1));
        const cift = {}; for (let i = 1; i < d.sira.length; i++) { const a = d.sira[i - 1], b = d.sira[i]; if (a === b) continue; const k = [a, b].sort().join("|"); cift[k] = (cift[k] || 0) + 1; }
        svg.replaceChildren();
        const tek = d.sira.length ? d.sira[d.sira.length - 1] : null;
        Object.entries(cift).forEach(([k, c]) => { const [a, b] = k.split("|"); if (!yer[a] || !yer[b]) return;
          svg.append(el("line", { x1: yer[a][0], y1: yer[a][1], x2: yer[b][0], y2: yer[b][1], class: "sa-cizgi" + (a === "ogr" || b === "ogr" ? " ogr" : ""), "stroke-width": Math.min(14, 2 + c * 2) })); });
        if (d.sira.length > 1) { const a = d.sira[d.sira.length - 2], b = tek; if (a !== b && yer[a] && yer[b]) svg.append(el("line", { x1: yer[a][0], y1: yer[a][1], x2: yer[b][0], y2: yer[b][1], class: "sa-son" })); }
        const dugum = (id, ad, kisa) => { const [x, y] = yer[id]; const c = say[id] || 0, r = 21 + Math.min(14, c * 2.5);
          const g = el("g", { class: "sa-dugum" + (c ? " konustu" : "") + (id === tek ? " simdi" : "") + (id === "ogr" ? " ogretmen" : ""), tabindex: "0", role: "button", "aria-label": ad });
          g.append(el("circle", { cx: x, cy: y, r }));
          const t = el("text", { x, y: y + 5, "text-anchor": "middle" }); t.textContent = kisa; g.append(t);
          if (c) { const b = el("text", { x: x + r - 4, y: y - r + 8, class: "sa-sayi", "text-anchor": "middle" }); b.textContent = c; g.append(b); }
          const sec = () => { d.sira.push(id); api.save(); T.sound.pop && T.sound.pop(); ciz(); };
          g.addEventListener("click", sec); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
          svg.append(g); };
        dugum("ogr", "Öğretmen", "Öğrt.");
        st.forEach((s) => dugum(s.id, s.name, s.name.split(" ")[0].slice(0, 7)));
        const konusan = st.filter((s) => say[s.id]).length;
        bilgi.textContent = d.sira.length ? konusan + " / " + n + " öğrenci söz aldı" : "Konuşana dokun";
        ozetKutu.hidden = !d.ozet;
        if (d.ozet) {
          const sessiz = st.filter((s) => !say[s.id]);
          const ogrSay = say.ogr || 0, ogrSiz = d.sira.length - ogrSay;
          const ard = (() => { let m = 0, c = 0; d.sira.forEach((x) => { if (x === "ogr") c = 0; else { c++; m = Math.max(m, c); } }); return m; })();
          const enCok = st.filter((s) => say[s.id]).sort((a, b) => say[b.id] - say[a.id]).slice(0, 3);
          ozetKutu.replaceChildren(h("h3", "Sohbetimiz nasıl geçti?"),
            h("p", d.sira.length + " kez söz alındı. " + ogrSay + " kez öğretmen, " + ogrSiz + " kez öğrenciler konuştu."),
            h("p", ard >= 3 ? "Öğretmene dönmeden en uzun " + ard + " öğrenci art arda konuştu. Söz öğrenciler arasında dolaştı." : "Söz çoğunlukla öğretmen üzerinden geçti. Bir dahaki sefere öğrencilerin birbirine yanıt vermesini deneyebiliriz."),
            enCok.length ? h("p", "En çok söz alanlar: " + enCok.map((s) => s.name + " (" + say[s.id] + ")").join(", ")) : null,
            sessiz.length ? h("p", "Henüz söz almayanlar: " + sessiz.map((s) => s.name).join(", ")) : h("p", "Herkes en az bir kez söz aldı."),
            h("button.btn.sm.c-chalk", { onclick: () => { d.ozet = false; api.save(); ciz(); } }, "Ağa dön"));
        }
      }
      ciz();
    },
  };

  /* ---------- Yavaş bakış: görsel parça parça açılır, her parçada gör, düşün, merak et ---------- */
  const SORU = ["Ne görüyorsun?", "Bu sana ne düşündürüyor?", "Neyi merak ediyorsun?", "Neden öyle düşünüyorsun?", "Yeni parça fikrini değiştirdi mi?"];
  W.yavasbakis = {
    title: "Yavaş bakış", icon: "eye", tone: "sky", w: 760, h: 560, desc: "Görsel parça parça açılır; gör, düşün, merak et",
    init: () => ({ n: 3, acik: [], gorsel: null, tip: "zoom", adim: 0 }),
    render(body, w, api) {
      const d = w.data; d.acik = d.acik || []; d.tip = d.tip || "parca"; d.adim = d.adim || 0;
      const OLCEK = [8, 5, 3.2, 2.2, 1.5, 1];
      const yeniOdak = () => { d.odak = { x: T.rand(18, 82), y: T.rand(18, 82) }; d.adim = 0; };
      if (!d.odak) yeniOdak();
      body.style.gridTemplateRows = "auto 1fr auto"; body.style.gap = "8px";
      const soru = h("div.yb-soru"), sahne = h("div.yb-sahne"), alt = h("div.row", { style: { gap: "6px", justifyContent: "center" } });
      body.append(soru, sahne, alt);
      const dosya = h("input", { type: "file", accept: "image/*", hidden: true, onchange: async (e) => {
        const f = e.target.files[0]; if (!f) return;
        const b = T.gorselKucult ? await T.gorselKucult(f, 1600) : f; const k = "yb-" + w.id;
        if (!(await T.gorselDepo.put(k, b))) return T.toast("Görsel kaydedilemedi");
        d.gorsel = k; d.acik = []; yeniOdak(); api.save(); ciz();
      } });
      const ZSORU = ["Bu ne olabilir? Sadece gördüğünü söyle.", "Biraz daha görünüyor. Tahminin değişti mi?", "Yeni ne fark ettin?", "Bu parça neyin parçası olabilir?", "Neredeyse tamam. Hangi ipucu seni yönlendirdi?", "Bütün resim önünde. İlk tahminin neydi?"];
      async function zoomCiz() {
        const son = d.adim >= OLCEK.length - 1;
        soru.textContent = ZSORU[Math.min(d.adim, ZSORU.length - 1)];
        alt.replaceChildren(
          h("label.btn.sm.c-chalk", { style: { cursor: "pointer" } }, T.icon("frame"), "Başka görsel", dosya),
          tipSec(),
          h("button.btn.sm.c-chalk", { disabled: d.adim <= 0 ? true : null, "aria-label": "Yakınlaş", onclick: () => { d.adim = Math.max(0, d.adim - 1); api.save(); uygula(); } }, T.icon("plus")),
          h("button.btn.sm.c-sky", { disabled: son ? true : null, onclick: () => { d.adim = Math.min(OLCEK.length - 1, d.adim + 1); api.save(); uygula(); } }, T.icon("minus"), "Uzaklaş"),
          h("button.btn.sm.c-chalk", { onclick: () => { yeniOdak(); api.save(); uygula(); } }, T.icon("dice"), "Başka ayrıntı"));
        const b = await T.gorselDepo.get(d.gorsel); if (!b) { d.gorsel = null; api.save(); return ciz(); }
        if (sahne._url) URL.revokeObjectURL(sahne._url); sahne._url = URL.createObjectURL(b);
        const img = h("img", { src: sahne._url, alt: "Yavaş bakış görseli", draggable: false });
        const cer = h("div.yb-cerceve.yb-zoom", img, h("div.yb-ipucu", "Tam resimde bir yere dokunursan oraya yakınlaşır"));
        img.onload = () => cer.style.setProperty("--r", (img.naturalWidth / img.naturalHeight).toFixed(4));
        cer.addEventListener("click", (e) => { if (d.adim < OLCEK.length - 1) return; const r = cer.getBoundingClientRect(); d.odak = { x: Math.round((e.clientX - r.left) / r.width * 100), y: Math.round((e.clientY - r.top) / r.height * 100) }; d.adim = 0; api.save(); uygula(); });
        function uygula() { img.style.transformOrigin = d.odak.x + "% " + d.odak.y + "%"; img.style.transform = "scale(" + OLCEK[d.adim] + ")"; cer.classList.toggle("tam", d.adim >= OLCEK.length - 1); soru.textContent = ZSORU[Math.min(d.adim, ZSORU.length - 1)];
          const [yk, uz] = alt.querySelectorAll("button[aria-label=Yakınlaş], .c-sky"); if (yk) yk.disabled = d.adim <= 0; if (uz) uz.disabled = d.adim >= OLCEK.length - 1; }
        sahne.replaceChildren(cer); uygula();
      }
      const tipSec = () => h("div.seg", [["zoom", "Yakından"], ["parca", "Parça parça"]].map(([k, l]) => h("button", { "aria-pressed": String(d.tip === k), onclick: () => { d.tip = k; api.save(); ciz(); } }, l)));
      async function ciz() {
        if (d.gorsel && d.tip === "zoom") return zoomCiz();
        const toplam = d.n * d.n, acik = d.acik.length;
        soru.textContent = !d.gorsel ? "Bir görsel seç: sanat eseri, doğa fotoğrafı, eski bir belge" : acik === 0 ? "Hazır mıyız? İlk parçayı açalım." : acik >= toplam ? "Bütün resim önünde. İlk tahminin neydi?" : SORU[(acik - 1) % SORU.length];
        alt.replaceChildren(
          h("label.btn.sm.c-chalk", { style: { cursor: "pointer" } }, T.icon("frame"), d.gorsel ? "Başka görsel" : "Görsel seç", dosya),
          d.gorsel ? tipSec() : null,
          d.gorsel ? h("div.seg", [3, 4, 5].map((n) => h("button", { "aria-pressed": String(d.n === n), onclick: () => { d.n = n; d.acik = []; api.save(); ciz(); } }, n + "×" + n))) : null,
          d.gorsel ? h("button.btn.sm.c-sky", { disabled: acik >= toplam ? true : null, onclick: () => { const kapali = [...Array(toplam).keys()].filter((i) => !d.acik.includes(i)); if (!kapali.length) return; d.acik.push(kapali[T.rand(0, kapali.length - 1)]); api.save(); ciz(); } }, T.icon("dice"), "Rastgele aç") : null,
          d.gorsel ? h("button.btn.sm.c-chalk", { onclick: () => { d.acik = acik >= toplam ? [] : [...Array(toplam).keys()]; api.save(); ciz(); } }, acik >= toplam ? "Yeniden kapat" : "Hepsini aç") : null);
        if (!d.gorsel) { sahne.replaceChildren(h("div.yb-bos", T.icon3d("buyutec"), h("p", "Görsel çok yakından açılır. Öğrenciler küçük bir ayrıntıya bakıp tahmin eder, sen adım adım uzaklaşırsın. İstersen parça parça açma biçimine de geçebilirsin."))); return; }
        const b = await T.gorselDepo.get(d.gorsel); if (!b) { d.gorsel = null; api.save(); return ciz(); }
        if (sahne._url) URL.revokeObjectURL(sahne._url); sahne._url = URL.createObjectURL(b);
        const img = h("img", { src: sahne._url, alt: "Yavaş bakış görseli" });
        const izgara = h("div.yb-izgara", { style: { gridTemplateColumns: "repeat(" + d.n + ", 1fr)", gridTemplateRows: "repeat(" + d.n + ", 1fr)" } },
          [...Array(toplam).keys()].map((i) => h("button.yb-parca" + (d.acik.includes(i) ? ".acik" : ""), { "aria-label": (i + 1) + ". parça", onclick: () => { if (!d.acik.includes(i)) { d.acik.push(i); T.sound.pop && T.sound.pop(); } else d.acik = d.acik.filter((x) => x !== i); api.save(); ciz(); } }, d.acik.includes(i) ? null : h("span", i + 1))));
        const cer = h("div.yb-cerceve", img, izgara);
        img.onload = () => cer.style.setProperty("--r", (img.naturalWidth / img.naturalHeight).toFixed(4));
        sahne.replaceChildren(cer);
      }
      ciz();
      api.onDestroy && api.onDestroy(() => { if (sahne._url) URL.revokeObjectURL(sahne._url); });
    },
  };

  /* ---------- Sessiz orman: sınıf sakin çalıştıkça orman canlanır; ses yükselince canlılar ürküp uzaklaşır ----------
     Görseller 3B emoji (Fluent). Sahne katmanlı: gökyüzü, uzak tepeler, ağaçlar, çayır; çiçekler sakinlik arttıkça açar. */
  const OR = (a) => "/orman/" + a + ".webp";
  /* gelecek canlılar sırasıyla: [resim, tür, x%, y%, boy(% yükseklik), uçan mı] */
  const DAVET = [
    ["butterfly", "kelebek", 36, 64, 8, 1], ["bird", "kus", 15, 30, 9, 1], ["lady_beetle", "bocek", 58, 94, 6, 0],
    ["rabbit", "tavsan", 66, 88, 15, 0], ["butterfly", "kelebek", 60, 58, 7, 1], ["chipmunk", "sincap", 30, 90, 13, 0],
    ["dove", "kus", 80, 30, 10, 1], ["hedgehog", "kirpi", 46, 95, 12, 0], ["butterfly", "kelebek", 88, 62, 7, 1],
    ["deer", "geyik", 52, 80, 26, 0], ["bird", "kus", 44, 46, 7, 1], ["snail", "salyangoz", 22, 97, 8, 0], ["fox", "tilki", 86, 96, 17, 0],
  ];
  const CICEK = [["blossom", 12, 96, 7], ["sunflower", 38, 88, 12], ["herb", 54, 98, 7], ["mushroom", 72, 97, 7], ["blossom", 92, 98, 7], ["sunflower", 26, 99, 10], ["herb", 8, 99, 7]];
  const AGAC = [["evergreen_tree", 27, 70, 34, .55], ["deciduous_tree", 44, 68, 32, .5], ["evergreen_tree", 61, 69, 30, .5], ["evergreen_tree", 4, 84, 56, .85], ["deciduous_tree", 17, 80, 58, .8], ["deciduous_tree", 79, 82, 62, .85], ["evergreen_tree", 95, 86, 58, .9]];
  W.orman = {
    title: "Sessiz orman", icon: "tree", tone: "leaf", w: 760, h: 520, desc: "Sakin çalıştıkça orman canlanır",
    init: () => ({ limit: 55, gece: false }),
    render(body, w, api) {
      const d = w.data;
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      const sahne = h("div.so" + (d.gece ? ".gece" : ""));
      const yazi = h("div.so-yazi", "Mikrofonu açınca orman dinlemeye başlar");
      const olcer = h("div.so-olcer", h("i"), h("b", { style: { left: d.limit + "%" } }));
      const startBtn = h("button.btn.sm.c-leaf", { onclick: basla }, T.icon("noise"), "Ormanı uyandır");
      const slider = h("input", { type: "range", min: 20, max: 90, value: d.limit, "aria-label": "Hassasiyet", oninput: (e) => { d.limit = +e.target.value; olcer.lastChild.style.left = d.limit + "%"; api.save(); } });
      body.append(h("div.so-kap", sahne, yazi, olcer), h("div.row", { style: { gap: "8px" } }, startBtn,
        h("label.f", { style: { flex: 1 } }, h("span", "Hassasiyet"), slider),
        h("button.btn.sm.c-chalk", { onclick: () => { d.gece = !d.gece; api.save(); sahne.classList.toggle("gece", d.gece); } }, T.icon("moon"), "Gece/gündüz")));
      /* sabit katmanlar */
      sahne.append(h("div.so-gok"), h("div.so-gunes"), h("div.so-bulut.b1"), h("div.so-bulut.b2"),
        (() => { const t = T.svg("svg", { viewBox: "0 0 1000 400", preserveAspectRatio: "none", class: "so-tepeler" }); t.innerHTML = '<path d="M0 230 C120 170 220 190 330 160 C460 120 560 200 680 170 C800 140 900 180 1000 150 V400 H0Z" class="t1"/><path d="M0 290 C140 240 260 270 380 245 C520 215 640 275 760 250 C870 228 940 255 1000 240 V400 H0Z" class="t2"/><path d="M0 330 C160 300 330 325 500 305 C680 285 840 318 1000 300 V400 H0Z" class="t3"/>'; return t; })());
      AGAC.forEach(([r, x, y, b, z], i) => sahne.append(h("img.so-agac", { src: OR(r), alt: "", draggable: false, style: { left: x + "%", top: y + "%", height: b + "%", "--z": z, "--g": (i * 0.37) % 1.4 + "s", zIndex: Math.round(z * 10) } })));
      const cicekler = CICEK.map(([r, x, y, b], i) => { const c = h("img.so-cicek", { src: OR(r), alt: "", draggable: false, style: { left: x + "%", top: y + "%", height: b + "%", "--g": i * 0.4 + "s" } }); sahne.append(c); return c; });
      sahne.append(h("div.so-on"));
      const canli = []; let sakin = 0, gurultu = 0, seviye = 0, dinliyor = false, stream = null, ctx = null, an = null, buf = null, iv = 0, sonGelis = 0;
      const ekle = () => {
        const kalan = DAVET.filter((x) => !canli.some((c) => c.def === x && !c.kac)); if (!kalan.length) return;
        const def = kalan[0], [r, tur, x, y, b, ucan] = def, sol = x > 50;
        const el = h("img.so-canli." + tur, { src: OR(r), alt: "", draggable: false, style: { left: x + "%", top: y + "%", height: b + "%", zIndex: Math.round(y) } });
        if (!sol) el.classList.add("ayna");
        sahne.append(el);
        const bas = ucan ? { transform: `translate(${sol ? 60 : -60}vw, -40vh) scale(.6)`, opacity: 0 } : { transform: `translate(${sol ? 40 : -40}vw, 0)`, opacity: 0 };
        el.animate([bas, { transform: "translate(0,0)", opacity: 1 }], { duration: ucan ? 2600 : 3200, easing: "cubic-bezier(.25,.8,.3,1)" });
        canli.push({ def, el, kac: false });
      };
      const kacir = () => {
        const l = canli.filter((c) => !c.kac).slice(-2);
        l.forEach((c) => { c.kac = true; const ucan = c.def[5], sol = c.def[2] > 50;
          const a = c.el.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: "translate(0,-6%)", opacity: 1, offset: .12 }, { transform: ucan ? `translate(${sol ? 50 : -50}vw, -50vh) scale(.5)` : `translate(${sol ? 45 : -45}vw, 0)`, opacity: 0 }], { duration: ucan ? 1600 : 1900, easing: "cubic-bezier(.5,0,.8,.4)", fill: "forwards" });
          a.onfinish = () => { c.el.remove(); canli.splice(canli.indexOf(c), 1); }; });
        sahne.classList.add("titre"); setTimeout(() => sahne.classList.remove("titre"), 900);
      };
      function adim() {
        if (dinliyor && an) { an.getByteTimeDomainData(buf); let t = 0; for (const v of buf) t += (v - 128) ** 2; seviye = T.clamp(Math.sqrt(t / buf.length) * 2.4, 0, 100); }
        const yuksek = dinliyor && seviye > d.limit, dt = 0.2;
        if (dinliyor) { if (yuksek) { gurultu += dt; sakin = Math.max(0, sakin - dt * 3); } else { sakin += dt; gurultu = Math.max(0, gurultu - dt * 2); } }
        if (gurultu > 0.8) { kacir(); gurultu = 0.2; }
        const var_ = canli.filter((c) => !c.kac).length, hedef = Math.min(DAVET.length, Math.floor(sakin / 5) + (dinliyor ? 1 : 0));
        if (dinliyor && !yuksek && var_ < hedef && Date.now() - sonGelis > 2500) { ekle(); sonGelis = Date.now(); }
        cicekler.forEach((c, i) => c.classList.toggle("acik", sakin > 8 + i * 9));
        olcer.firstChild.style.width = seviye + "%"; olcer.classList.toggle("yuksek", yuksek); olcer.hidden = !dinliyor;
        if (dinliyor) yazi.textContent = yuksek ? "Şşş… canlılar ürküyor" : var_ ? var_ + " canlı ormanımızda" : "Sessizce bekleyelim, biri geliyor";
      }
      async function basla() {
        if (T.muzik && T.muzik.aktif && T.muzik.aktif()) { T.muzik.birak(); T.toast("Orman hoparlörü duymasın diye müzik durduruldu"); }
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); ctx = new (window.AudioContext || window.webkitAudioContext)(); an = ctx.createAnalyser(); an.fftSize = 512; ctx.createMediaStreamSource(stream).connect(an); buf = new Uint8Array(an.fftSize); dinliyor = true; startBtn.disabled = true; adim(); }
        catch (e) { yazi.textContent = "Mikrofona izin verilmedi. Tarayıcının adres çubuğundan izin ver."; }
      }
      olcer.hidden = true;
      iv = setInterval(adim, 200);
      api.onDestroy(() => { clearInterval(iv); stream && stream.getTracks().forEach((t) => t.stop()); ctx && ctx.close(); });
      T.ormanTest = { sakin: (s) => { dinliyor = true; sakin = s; }, gurultu: () => { gurultu = 1; } };
    },
  };

  /* ---------- İstasyon döndürücü: gruplar istasyonlarda çalışır, süre bitince 45 saniyelik geçişle bir sonrakine kayar ---------- */
  const IST_RENK = ["#4F8FE8", "#3FA36B", "#E9A23B", "#E07AA0", "#8C5BB8", "#2BB3B1"];
  W.istasyon = {
    title: "İstasyonlar", icon: "groups", tone: "sun", w: 900, h: 600, desc: "Gruplar istasyonlar arasında sırayla döner",
    init: () => ({ n: 4, dk: 8, adlar: ["Okuma köşesi", "Matematik oyunu", "Deney masası", "Yazma masası", "Çizim", "Bilgisayar"], gorev: ["", "", "", "", "", ""], gruplar: [], tur: 0, durum: "hazir", bitis: 0 }),
    render(body, w, api) {
      const d = w.data; d.gorev = d.gorev || [];
      body.style.gridTemplateRows = "auto 1fr auto"; body.style.gap = "8px";
      const ust = h("div.is-ust"), pano = h("div.is-pano"), alt = h("div.row", { style: { gap: "6px", justifyContent: "center", flexWrap: "wrap" } });
      body.append(ust, pano, alt);
      const ad = (id) => ((api.cls().students.find((x) => x.id === id) || {}).name || "").split(" ")[0];
      const grupla = () => { const p = T.shuffle(gelenler(api.cls())); const gs = Array.from({ length: d.n }, () => []); p.forEach((s, i) => gs[i % d.n].push(s.id)); if (T.kuralGrupla) T.kuralGrupla(gs); d.gruplar = gs; d.tur = 0; d.durum = "hazir"; api.save(); ciz(); };
      const basla = () => { if (!d.gruplar.length) grupla(); T.sound.unlock(); d.durum = "calis"; d.bitis = Date.now() + d.dk * 60000; api.save(); ciz(); };
      const gecis = () => { d.durum = "gecis"; d.bitis = Date.now() + 45000; T.sound.bell(); api.save(); ciz(); };
      const ilerle = () => { d.tur = (d.tur + 1) % d.n; if (d.tur === 0) { d.durum = "bitti"; T.sound.ok && T.sound.ok(); api.save(); return ciz(); } basla(); };
      function ciz() {
        const kalan = Math.max(0, d.bitis - Date.now()), sn = Math.ceil(kalan / 1000);
        ust.replaceChildren(
          d.durum === "calis" ? h("div.is-durum", h("b", (d.tur + 1) + ". tur"), h("span.is-sure", Math.floor(sn / 60) + ":" + T.pad(sn % 60)), h("i.is-bar", h("i", { style: { width: (kalan / (d.dk * 600)) + "%" } })))
          : d.durum === "gecis" ? h("div.is-durum.gecis", h("b", "Toparlan ve bir sonraki masaya geç"), h("span.is-sure", sn), h("i.is-bar", h("i", { style: { width: (kalan / 450) + "%" } })))
          : d.durum === "bitti" ? h("div.is-durum.bitti", h("b", "Bütün istasyonlar tamamlandı. Harika iş!"))
          : h("div.is-durum", h("b", d.gruplar.length ? "Hazır. Başlat'a bas." : "Önce grupları kur.")));
        pano.style.gridTemplateColumns = "repeat(" + Math.min(d.n, d.n > 4 ? 3 : d.n) + ", 1fr)";
        pano.replaceChildren(...Array.from({ length: d.n }, (_, i) => {
          const gi = ((i - d.tur) % d.n + d.n) % d.n, g = d.gruplar[gi] || [];
          const sonraki = ((i + 1) % d.n);
          return h("div.is-kart" + (d.durum === "gecis" ? ".gecis" : ""), { style: { "--c": IST_RENK[i % IST_RENK.length] } },
            h("input.is-ad", { value: d.adlar[i] || "", "aria-label": (i + 1) + ". istasyon adı", onchange: (e) => { d.adlar[i] = e.target.value; api.save(); } }),
            h("input.is-gorev", { value: d.gorev[i] || "", placeholder: "Görev (isteğe bağlı)", "aria-label": (i + 1) + ". istasyon görevi", onchange: (e) => { d.gorev[i] = e.target.value; api.save(); } }),
            g.length ? h("div.is-grup", h("small", (gi + 1) + ". grup"), h("p", g.map(ad).join(", "))) : h("div.is-grup.bos", "Grup yok"),
            d.durum === "gecis" ? h("div.is-ok", "→ " + (d.adlar[sonraki] || (sonraki + 1) + ". istasyon")) : null);
        }));
        alt.replaceChildren(
          h("label.f", h("span", "İstasyon"), h("div.seg", [3, 4, 5, 6].map((n) => h("button", { "aria-pressed": String(d.n === n), onclick: () => { d.n = n; d.gruplar = []; d.durum = "hazir"; api.save(); ciz(); } }, n)))),
          h("label.f", h("span", "Süre"), h("div.seg", [5, 8, 10, 15].map((m) => h("button", { "aria-pressed": String(d.dk === m), onclick: () => { d.dk = m; api.save(); ciz(); } }, m + " dk")))),
          h("button.btn.sm.c-chalk", { onclick: grupla }, T.icon("dice"), "Grupları kur"),
          d.durum === "calis" ? h("button.btn.sm.c-sun", { onclick: gecis }, T.icon("next"), "Şimdi geç") : d.durum === "gecis" ? h("button.btn.sm.c-leaf", { onclick: ilerle }, T.icon("play"), "Hazırız") : h("button.btn.sm.c-leaf", { onclick: basla }, T.icon("play"), d.durum === "bitti" ? "Yeniden başlat" : "Başlat"));
      }
      const iv = setInterval(() => { if ((d.durum === "calis" || d.durum === "gecis") && Date.now() >= d.bitis) { d.durum === "calis" ? gecis() : ilerle(); } else if (d.durum === "calis" || d.durum === "gecis") { const k = Math.max(0, d.bitis - Date.now()), sn = Math.ceil(k / 1000); const s_ = ust.querySelector(".is-sure"), b_ = ust.querySelector(".is-bar > i"); if (s_) s_.textContent = d.durum === "gecis" ? sn : Math.floor(sn / 60) + ":" + T.pad(sn % 60); if (b_) b_.style.width = (k / (d.durum === "gecis" ? 450 : d.dk * 600)) + "%"; } }, 500);
      api.onDestroy(() => clearInterval(iv));
      ciz();
    },
  };
})();
