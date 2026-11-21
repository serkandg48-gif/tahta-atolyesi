/* Tek zamanlayıcı: kum saati, dijital, mum, yarış, kronometre, aralık ve takım saati tek pencerede.
   Geri sayan biçimler aynı süreyi paylaşır; biçim değiştirmek süreyi bozmaz. */
(function () {
  const { h } = T; const W = T.widgets;
  const kumRender = W.timer.render, kronoRender = W.stopwatch.render;
  const MODLAR = [["kum", "Kum saati"], ["dijital", "Dijital"], ["mum", "Mum"], ["yaris", "Yarış"], ["kronometre", "Kronometre"], ["aralik", "Aralık"], ["takim", "Takım saati"]];
  const mmss = (s) => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s / 60); return (m >= 60 ? Math.floor(m / 60) + ":" + T.pad(m % 60) : m) + ":" + T.pad(s % 60); };
  const img = (ad) => h("img", { src: "/oyun3d/" + ad + ".webp", alt: "", draggable: false });

  /* ortak geri sayım motoru */
  function sayac(d, api, cizici) {
    const kalan = () => (d.running ? Math.max(0, (d.endAt - Date.now()) / 1000) : d.left);
    let caldi = false;
    const ctl = {
      kalan, oran: () => (d.total ? 1 - kalan() / d.total : 0),
      ayarla: (sn) => { d.total = sn; d.left = sn; d.running = false; api.save(); ciz(); },
      dugme: () => { T.sound.unlock(); if (d.running) { d.left = kalan(); d.running = false; } else { if (d.left <= 0) d.left = d.total; d.endAt = Date.now() + d.left * 1000; d.running = true; } api.save(); ciz(); },
      sifirla: () => { d.left = d.total; d.running = false; api.save(); ciz(); },
    };
    function ciz() {
      const k = kalan();
      if (d.running && k <= 0) { d.running = false; d.left = 0; api.save(); if (!caldi) { caldi = true; T.sound.bell(); api.el && api.el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 400, iterations: 3 }); } }
      if (k > 0) caldi = false;
      cizici(k, ctl);
    }
    ctl.ciz = ciz;
    return ctl;
  }
  /* süre ayarı ve kontrol düğmeleri */
  function kontroller(d, ctl, hazir = [1, 3, 5, 10]) {
    const oyna = h("button.btn.sm.c-leaf", { onclick: () => ctl.dugme() });
    const sure = h("input.zm-sure", { type: "text", inputmode: "numeric", value: mmss(d.total), "aria-label": "Süre (dakika:saniye)", title: "Süreyi yaz, örneğin 2:30",
      onchange: (e) => { const p = e.target.value.split(":").map((x) => parseInt(x, 10) || 0); const sn = p.length > 1 ? p[0] * 60 + p[1] : p[0] * 60; if (sn > 0) ctl.ayarla(Math.min(sn, 24 * 3600)); } });
    const el = h("div.zm-kontrol",
      h("div.row", { style: { justifyContent: "center", gap: "6px" } }, hazir.map((m) => h("button.btn.sm.c-chalk", { onclick: () => { ctl.ayarla(m * 60); sure.value = mmss(m * 60); } }, m + " dk")), sure),
      h("div.row", { style: { justifyContent: "center", gap: "6px" } }, oyna, h("button.btn.sm.icon.c-chalk", { "aria-label": "Sıfırla", onclick: () => ctl.sifirla() }, T.icon("reset"))));
    el.guncelle = () => { oyna.replaceChildren(T.icon(d.running ? "pause" : "play"), d.running ? "Durdur" : ctl.kalan() <= 0 ? "Yeniden" : "Başlat"); if (document.activeElement !== sure) sure.value = mmss(d.total); };
    return el;
  }

  const CIZ = {
    dijital(kap, d, api) {
      const R = 88, C = 2 * Math.PI * R;
      const svg = T.svg("svg", { viewBox: "0 0 220 220", class: "zm-halka" });
      svg.innerHTML = `<circle cx="110" cy="110" r="${R}" fill="none" stroke="#e8ecf3" stroke-width="18"/><circle class="zm-ilerle" cx="110" cy="110" r="${R}" fill="none" stroke="#3FA36B" stroke-width="18" stroke-linecap="round" stroke-dasharray="${C}" transform="rotate(-90 110 110)"/>`;
      const yazi = h("div.zm-dijital"); const kk = h("div.zm-dij-kap", svg, yazi);
      let k;
      const ctl = sayac(d, api, (kalan, c) => { const o = c.oran(); svg.querySelector(".zm-ilerle").setAttribute("stroke-dashoffset", C * o); svg.querySelector(".zm-ilerle").setAttribute("stroke", kalan < 10 ? "#E4553F" : kalan < 60 ? "#F2A93B" : "#3FA36B"); yazi.textContent = mmss(kalan); yazi.classList.toggle("az", kalan > 0 && kalan < 10); k.guncelle(); });
      k = kontroller(d, ctl); kk.addEventListener("click", () => ctl.dugme());
      kap.append(kk, k); return ctl;
    },
    mum(kap, d, api) {
      const svg = T.svg("svg", { viewBox: "0 0 200 260", class: "zm-mum" });
      svg.innerHTML = `<defs><linearGradient id="zm-mumg" x1="0" x2="1"><stop offset="0" stop-color="#f7d9a8"/><stop offset=".5" stop-color="#fff3dc"/><stop offset="1" stop-color="#e8c08a"/></linearGradient><radialGradient id="zm-alev" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#fff7c2"/><stop offset=".5" stop-color="#ffc23d"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient></defs>
        <ellipse cx="100" cy="246" rx="70" ry="10" fill="#b38a5a" opacity=".35"/><ellipse cx="100" cy="240" rx="62" ry="12" fill="#c9a06a"/>
        <g class="zm-mum-g"><rect class="zm-govde" x="66" y="60" width="68" height="180" rx="10" fill="url(#zm-mumg)" stroke="#d2a66d" stroke-width="2"/><ellipse class="zm-ust" cx="100" cy="60" rx="34" ry="8" fill="#fff6e4" stroke="#d2a66d" stroke-width="2"/>
        <line class="zm-fitil" x1="100" y1="60" x2="100" y2="46" stroke="#3b2a1a" stroke-width="3" stroke-linecap="round"/><g class="zm-alev-g"><ellipse cx="100" cy="30" rx="26" ry="36" fill="url(#zm-alev)" opacity=".5"/><path d="M100 4 C114 24 116 38 100 48 C84 38 86 24 100 4Z" fill="#ffb000"/><path d="M100 18 C107 30 107 38 100 44 C93 38 93 30 100 18Z" fill="#fff4b0"/></g></g>`;
      const yazi = h("div.zm-alt-yazi"); let k;
      const ctl = sayac(d, api, (kalan, c) => { const o = c.oran(), hgt = 180 * (1 - o * 0.85), y = 240 - hgt;
        svg.querySelector(".zm-govde").setAttribute("y", y); svg.querySelector(".zm-govde").setAttribute("height", hgt); svg.querySelector(".zm-ust").setAttribute("cy", y);
        svg.querySelector(".zm-fitil").setAttribute("y1", y); svg.querySelector(".zm-fitil").setAttribute("y2", y - 14);
        const al = svg.querySelector(".zm-alev-g"); al.setAttribute("transform", `translate(0 ${y - 60})`); al.style.display = kalan <= 0 ? "none" : ""; al.classList.toggle("yaniyor", d.running);
        yazi.textContent = kalan <= 0 ? "Süre bitti" : mmss(kalan); k.guncelle(); });
      k = kontroller(d, ctl); svg.addEventListener("click", () => ctl.dugme());
      kap.append(h("div.zm-sahne", svg), yazi, k); return ctl;
    },
    yaris(kap, d, api) {
      const KOS = [["kaplumbaga", "Kaplumbağa"], ["rabbit", "Tavşan"], ["snail", "Salyangoz"], ["hedgehog", "Kirpi"], ["penguen", "Penguen"]];
      const src = (a) => (["rabbit", "snail", "hedgehog"].includes(a) ? "/orman/" + a + ".webp" : "/oyun3d/" + a + ".webp");
      d.yaris = d.yaris || { tohum: Math.random() };
      const pist = h("div.zm-pist", KOS.map(([a, ad], i) => h("div.zm-kulvar", h("span.zm-ad", ad), h("img.zm-kosucu", { src: src(a), alt: ad, draggable: false, "data-i": i }), h("img.zm-bayrak", { src: "/oyun3d/bayrak.webp", alt: "" }))));
      const yazi = h("div.zm-alt-yazi"); let k;
      /* her koşucunun hızı tura göre değişen dalgalı bir eğri; kazanan rastgele, hepsi süre bitince varır */
      const konum = (i, o) => { const s = d.yaris.tohum * 1000 + i * 17.3; const dal = Math.sin(o * 9 + s) * 0.06 + Math.sin(o * 23 + s * 2) * 0.03; const son = (i === Math.floor(d.yaris.tohum * KOS.length) ? 1 : 0.9 + ((s * 7) % 1) * 0.08); return Math.max(0, Math.min(1, o * son + dal * Math.sin(Math.PI * o))); };
      const ctl = sayac(d, api, (kalan, c) => { const o = c.oran(); const kos = pist.querySelectorAll(".zm-kosucu");
        kos.forEach((e, i) => { const p = kalan <= 0 ? (i === Math.floor(d.yaris.tohum * KOS.length) ? 1 : konum(i, 1)) : konum(i, o); e.style.left = `calc(${p * 100}% * .74)`; e.classList.toggle("kazandi", kalan <= 0 && i === Math.floor(d.yaris.tohum * KOS.length)); });
        yazi.textContent = kalan <= 0 && d.total ? "Kazanan: " + KOS[Math.floor(d.yaris.tohum * KOS.length)][1] + "!" : mmss(kalan); k.guncelle(); });
      k = kontroller(d, ctl);
      const yeni = h("button.btn.sm.c-chalk", { onclick: () => { d.yaris.tohum = Math.random(); ctl.sifirla(); } }, T.icon("dice"), "Yeni yarış");
      kap.append(pist, yazi, k); k.lastChild.append(yeni); return ctl;
    },
    aralik(kap, d, api) {
      d.ar = d.ar || { calis: 300, mola: 60, tekrar: 3, bas: 0, running: false, gecen: 0 };
      const a = d.ar; const ust = h("div.zm-ar-ust"), yazi = h("div.zm-dijital"), bar = h("div.zm-ar-bar");
      const say = (k, l, min, max, adim) => h("label.zm-ar-ayar", h("span", l), h("div.row", h("button.btn.sm.icon.c-chalk", { onclick: () => { a[k] = Math.max(min, a[k] - adim); api.save(); ciz(); } }, T.icon("minus")), h("b", { "data-k": k }), h("button.btn.sm.icon.c-chalk", { onclick: () => { a[k] = Math.min(max, a[k] + adim); api.save(); ciz(); } }, T.icon("plus"))));
      const oyna = h("button.btn.sm.c-leaf", { onclick: () => { T.sound.unlock(); if (a.running) { a.gecen += (Date.now() - a.bas) / 1000; a.running = false; } else { a.bas = Date.now(); a.running = true; } api.save(); ciz(); } });
      const gecen = () => a.gecen + (a.running ? (Date.now() - a.bas) / 1000 : 0);
      let sonEvre = null;
      function ciz() {
        const t = gecen(), tur = a.calis + a.mola, top = tur * a.tekrar;
        if (t >= top) { if (a.running) { a.running = false; a.gecen = top; api.save(); T.sound.bell(); } }
        const ti = Math.min(a.tekrar - 1, Math.floor(t / tur)), ic = t - ti * tur, calismada = ic < a.calis, bitti = t >= top;
        const evre = bitti ? "bitti" : (calismada ? "c" : "m") + ti; if (sonEvre && evre !== sonEvre && a.running) T.sound.bell(); sonEvre = evre;
        ust.textContent = bitti ? "Bitti!" : (calismada ? "Çalışma" : "Mola") + " · " + (ti + 1) + ". tur / " + a.tekrar;
        ust.className = "zm-ar-ust " + (bitti ? "bitti" : calismada ? "calis" : "mola");
        yazi.textContent = bitti ? "0:00" : mmss(calismada ? a.calis - ic : tur - ic);
        bar.replaceChildren(...Array.from({ length: a.tekrar }, (_, i) => h("div.zm-ar-tur", h("i.c", { style: { flex: a.calis, opacity: i < ti || bitti ? .45 : 1 } }), h("i.m", { style: { flex: a.mola, opacity: i < ti || bitti ? .45 : 1 } }))));
        kap.querySelectorAll("[data-k]").forEach((b) => (b.textContent = b.dataset.k === "tekrar" ? a.tekrar + " tur" : mmss(a[b.dataset.k])));
        oyna.replaceChildren(T.icon(a.running ? "pause" : "play"), a.running ? "Durdur" : "Başlat");
      }
      kap.append(ust, yazi, bar, h("div.zm-ar-ayarlar", say("calis", "Çalışma", 30, 3600, 30), say("mola", "Mola", 10, 1200, 10), say("tekrar", "Tekrar", 1, 12, 1)),
        h("div.row", { style: { justifyContent: "center", gap: "6px" } }, oyna, h("button.btn.sm.icon.c-chalk", { "aria-label": "Sıfırla", onclick: () => { a.gecen = 0; a.running = false; api.save(); ciz(); } }, T.icon("reset"))));
      return { ciz };
    },
    takim(kap, d, api) {
      d.tk = d.tk || { sure: 300, kalan: [300, 300], sira: -1, bas: 0, adlar: ["Takım A", "Takım B"] };
      const t = d.tk;
      const kalan = (i) => t.kalan[i] - (t.sira === i ? (Date.now() - t.bas) / 1000 : 0);
      const gec = (i) => { if (t.sira >= 0) t.kalan[t.sira] = Math.max(0, kalan(t.sira)); t.sira = i; t.bas = Date.now(); T.sound.pop && T.sound.pop(); api.save(); ciz(); };
      const kutular = [0, 1].map((i) => h("button.zm-takim", { onclick: () => gec(1 - i) }, h("input.zm-takim-ad", { value: t.adlar[i], onclick: (e) => e.stopPropagation(), onchange: (e) => { t.adlar[i] = e.target.value; api.save(); } }), h("b"), h("small", "Sözü bitince dokun")));
      function ciz() {
        [0, 1].forEach((i) => { const k = Math.max(0, kalan(i)); kutular[i].querySelector("b").textContent = mmss(k); kutular[i].classList.toggle("aktif", t.sira === i); kutular[i].classList.toggle("bitti", k <= 0);
          if (t.sira === i && k <= 0) { t.kalan[i] = 0; t.sira = -1; api.save(); T.sound.bell(); } });
      }
      kap.append(h("div.zm-takimlar", kutular), h("div.row", { style: { justifyContent: "center", gap: "6px" } },
        h("button.btn.sm.c-leaf", { onclick: () => gec(0) }, T.icon("play"), "Başlat"), h("button.btn.sm.c-chalk", { onclick: () => { if (t.sira >= 0) t.kalan[t.sira] = kalan(t.sira); t.sira = -1; api.save(); ciz(); } }, T.icon("pause"), "Durdur"),
        h("div.seg", [3, 5, 10].map((m) => h("button", { "aria-pressed": String(t.sure === m * 60), onclick: () => { t.sure = m * 60; t.kalan = [m * 60, m * 60]; t.sira = -1; api.save(); W.timer.render._yenile && W.timer.render._yenile(); ciz(); } }, m + " dk")))));
      return { ciz };
    },
  };

  W.timer.title = "Zamanlayıcı"; W.timer.desc = "Kum saati, dijital, mum, yarış, kronometre, aralık ve takım saati";
  W.timer.w = Math.max(W.timer.w || 0, 460); W.timer.h = Math.max(W.timer.h || 0, 520);
  W.timer.render = function (body, w, api) {
    const d = w.data; d.mod = d.mod || "kum"; if (!d.total) { d.total = 300; d.left = 300; }
    d.sw = d.sw || { start: 0, acc: 0, running: false, laps: [] };
    body.style.gridTemplateRows = "auto 1fr"; body.style.gap = "8px";
    const sekme = h("div.zm-sekmeler", { role: "tablist" });
    const ic = h("div.zm-ic");
    body.append(sekme, ic);
    let yerel = [], iv = 0;
    const subApi = Object.assign({}, api, { onDestroy: (f) => yerel.push(f) });
    function kur() {
      yerel.forEach((f) => { try { f(); } catch (e) {} }); yerel = []; clearInterval(iv); ic.replaceChildren(); ic.className = "zm-ic mod-" + d.mod; ic.removeAttribute("style");
      sekme.replaceChildren(...MODLAR.map(([k, l]) => h("button", { role: "tab", "aria-selected": String(d.mod === k), onclick: () => { d.mod = k; api.save(); kur(); } }, l)));
      if (d.mod === "kum") return kumRender.call(W.timer, ic, w, subApi);
      if (d.mod === "kronometre") return kronoRender.call(W.stopwatch, ic, Object.assign({}, w, { data: d.sw }), subApi);
      const ctl = CIZ[d.mod](ic, d, subApi);
      iv = setInterval(() => ctl.ciz(), d.mod === "yaris" ? 120 : 250); ctl.ciz();
    }
    api.onDestroy(() => { yerel.forEach((f) => { try { f(); } catch (e) {} }); clearInterval(iv); });
    kur();
  };
})();
/* Kronometre artık zamanlayıcının içinde: ayrı listede görünmesin, eski panolardaki kronometreler yine açılır. */
T.widgets.stopwatch.group = "Gizli";
