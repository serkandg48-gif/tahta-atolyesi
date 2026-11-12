/* Ders ekranı araçları (Classroomscreen benzeri) */
(function () {
  const { h } = T;
  const W = T.widgets;
  const present = (cls) => {
    const s = T.store.get(), a = (s.attendance[cls.id] || {})[T.isoDate()] || {};
    return cls.students.filter((st) => a[st.id] !== "yok");
  };

  /* ---------- Zamanlayıcı ---------- */
  W.timer = {
    title: "Zamanlayıcı", icon: "timer", tone: "tomato", w: 340, h: 370, minW: 240, minH: 260,
    desc: "Geri sayım, hazır süreler",
    init: () => ({ total: 300, left: 300, running: false, endAt: 0 }),
    render(body, w, api) {
      const d = w.data;
      const R = 88, C = 2 * Math.PI * R;
      const ring = T.svg("circle", { cx: 100, cy: 100, r: R, fill: "none", stroke: "var(--tomato)", "stroke-width": 16, "stroke-linecap": "round", transform: "rotate(-90 100 100)", "stroke-dasharray": C });
      const txt = T.svg("text", { x: 100, y: 108, "text-anchor": "middle", "dominant-baseline": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 46, fill: "var(--ink)" });
      const svg = T.svg("svg", { viewBox: "0 0 200 200", style: "width:100%;height:100%;cursor:pointer" },
        T.svg("circle", { cx: 100, cy: 100, r: R, fill: "none", stroke: "rgba(0,0,0,.08)", "stroke-width": 16 }), ring, txt);
      const playBtn = h("button.btn.sm.c-leaf", { onclick: toggle });
      const presets = h("div.row", { style: { justifyContent: "center", gap: "6px" } },
        [1, 3, 5, 10].map((m) => h("button.btn.sm.c-chalk", { onclick: () => setT(m * 60) }, m + " dk")));
      const ctl = h("div.row", { style: { justifyContent: "center", gap: "6px" } },
        h("button.btn.sm.icon.c-chalk", { "aria-label": "1 dakika azalt", onclick: () => setT(Math.max(10, d.total - 60)) }, T.icon("minus")),
        playBtn,
        h("button.btn.sm.icon.c-chalk", { "aria-label": "Sıfırla", onclick: () => setT(d.total) }, T.icon("reset")),
        h("button.btn.sm.icon.c-chalk", { "aria-label": "1 dakika ekle", onclick: () => setT(d.total + 60) }, T.icon("plus")));
      body.style.gridTemplateRows = "1fr auto auto"; body.style.gap = "8px";
      body.append(h("div", { style: { minHeight: 0 } }, svg), presets, ctl);
      svg.addEventListener("click", toggle);
      function setT(sec) { d.total = sec; d.left = sec; d.running = false; api.save(); paint(); }
      function toggle() {
        T.sound.unlock();
        if (d.running) { d.left = Math.max(0, (d.endAt - Date.now()) / 1000); d.running = false; }
        else { if (d.left <= 0) d.left = d.total; d.endAt = Date.now() + d.left * 1000; d.running = true; }
        api.save(); paint();
      }
      let rang = false;
      function paint() {
        let left = d.running ? Math.max(0, (d.endAt - Date.now()) / 1000) : d.left;
        if (d.running && left <= 0) { d.running = false; d.left = 0; api.save(); if (!rang) { rang = true; T.sound.bell(); api.el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 400, iterations: 3 }); } }
        if (left > 0) rang = false;
        const s = Math.ceil(left);
        txt.textContent = `${Math.floor(s / 60)}:${T.pad(s % 60)}`;
        ring.setAttribute("stroke-dashoffset", C * (1 - left / d.total));
        ring.setAttribute("stroke", left < 10 && left > 0 ? "var(--bad)" : left / d.total < 0.25 ? "var(--sun)" : "var(--leaf)");
        playBtn.replaceChildren(T.icon(d.running ? "pause" : "play"), d.running ? "Durdur" : "Başlat");
      }
      const iv = setInterval(paint, 250); api.onDestroy(() => clearInterval(iv)); paint();
    },
  };

  /* ---------- Kronometre ---------- */
  W.stopwatch = {
    title: "Kronometre", icon: "stopwatch", tone: "sky", w: 300, h: 200, desc: "İleri sayar, tur alır",
    init: () => ({ start: 0, acc: 0, running: false, laps: [] }),
    render(body, w, api) {
      const d = w.data;
      const big = h("div.fit-num", { style: { fontSize: "min(22cqw, 60cqh)" } });
      const laps = h("div.hint", { style: { textAlign: "center", fontSize: "13px" } });
      const b1 = h("button.btn.sm.c-leaf", { onclick: () => { if (d.running) { d.acc += Date.now() - d.start; d.running = false; } else { d.start = Date.now(); d.running = true; } api.save(); paint(); } });
      body.style.gridTemplateRows = "1fr auto auto";
      body.append(big, laps, h("div.row", { style: { justifyContent: "center" } }, b1,
        h("button.btn.sm.c-chalk", { onclick: () => { d.laps.push(now()); d.laps = d.laps.slice(-4); api.save(); paint(); } }, "Tur"),
        h("button.btn.sm.c-chalk", { onclick: () => { Object.assign(d, { start: 0, acc: 0, running: false, laps: [] }); api.save(); paint(); } }, T.icon("reset"))));
      const now = () => d.acc + (d.running ? Date.now() - d.start : 0);
      const f = (ms) => `${Math.floor(ms / 60000)}:${T.pad(Math.floor(ms / 1000) % 60)}.${Math.floor((ms % 1000) / 100)}`;
      function paint() { big.textContent = f(now()); laps.textContent = d.laps.map(f).join("  ·  "); b1.replaceChildren(T.icon(d.running ? "pause" : "play"), d.running ? "Durdur" : "Başlat"); }
      const iv = setInterval(paint, 100); api.onDestroy(() => clearInterval(iv)); paint();
    },
  };

  /* ---------- Rastgele isim ---------- */
  W.name = {
    title: "İsim çek", icon: "name", tone: "grape", w: 360, h: 300, desc: "Gelen öğrencilerden adil seçim",
    init: () => ({ used: [], fair: true, current: null }),
    render(body, w, api) {
      const d = w.data;
      const stage = h("div", { style: { display: "grid", placeItems: "center", gap: "6px", minHeight: 0 } });
      const info = h("div.hint", { style: { textAlign: "center", fontSize: "13px" } });
      const fairBtn = h("button.btn.sm.c-chalk", { onclick: () => { d.fair = !d.fair; api.save(); paint(); } });
      body.style.gridTemplateRows = "1fr auto auto"; body.style.gap = "6px";
      body.append(stage, info, h("div.row", { style: { justifyContent: "center" } },
        h("button.btn.c-grape", { onclick: spin }, T.icon("name"), "Çek"), fairBtn,
        h("button.btn.sm.c-chalk", { onclick: () => { d.used = []; api.save(); paint(); } }, "Baştan")));
      function pool() { const p = present(api.cls()); const rest = p.filter((s) => !d.used.includes(s.id)); return d.fair ? (rest.length ? rest : p) : p; }
      function show(st, final) {
        stage.replaceChildren(T.avatar(st.name, 84), h("div", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "min(15cqw, 22cqh)", lineHeight: 1 } }, st.name));
        if (final) stage.animate([{ transform: "scale(.8)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
      }
      function spin() {
        T.sound.unlock();
        const p = pool(); if (!p.length) { T.toast("Sınıf listesi boş"); return; }
        if (d.fair && p.every((s) => d.used.includes(s.id))) d.used = [];
        const winner = T.pick(p.filter((s) => !d.fair || !d.used.includes(s.id)).length ? p.filter((s) => !d.fair || !d.used.includes(s.id)) : p);
        let i = 0; const n = 14;
        const step = () => {
          if (i < n) { show(T.pick(p)); T.sound.tick(); i++; setTimeout(step, 40 + i * 12); }
          else { show(winner, true); T.sound.ok(); d.current = winner.id; if (d.fair && !d.used.includes(winner.id)) d.used.push(winner.id); api.save(); paint(); }
        };
        step();
      }
      function paint() {
        const p = present(api.cls());
        info.textContent = d.fair ? `Bu turda ${p.length - p.filter((s) => d.used.includes(s.id)).length} / ${p.length} öğrenci kaldı` : `${p.length} öğrenci arasından`;
        fairBtn.textContent = d.fair ? "Adil tur: açık" : "Adil tur: kapalı";
        if (!stage.firstChild) {
          const cur = d.current && api.cls().students.find((s) => s.id === d.current);
          if (cur) show(cur); else stage.replaceChildren(h("div", { style: { fontFamily: "var(--hand)", fontSize: "28px", color: "var(--ink-soft)" } }, "Kim olacak?"));
        }
      }
      paint();
    },
  };

  /* ---------- Zar ---------- */
  const PIPS = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]] };
  T.dieSVG = (v, col = "#fff") => T.svg("svg", { viewBox: "0 0 100 100", style: "width:100%;height:100%" },
    T.svg("rect", { x: 6, y: 6, width: 88, height: 88, rx: 18, fill: col, stroke: "#2a2a2a", "stroke-width": 4 }),
    ...(PIPS[v] || []).map(([x, y]) => T.svg("circle", { cx: x, cy: y, r: 8.5, fill: "#2a2a2a" })));
  W.dice = {
    title: "Zar", icon: "dice", tone: "sun", w: 360, h: 250, desc: "1-4 zar, toplam",
    init: () => ({ n: 2, vals: [3, 5] }),
    render(body, w, api) {
      const d = w.data;
      const row = h("div", { style: { display: "flex", gap: "4%", justifyContent: "center", alignItems: "center", minHeight: 0 } });
      const sum = h("div.hint", { style: { textAlign: "center", fontSize: "16px", fontWeight: 700 } });
      body.style.gridTemplateRows = "1fr auto auto"; body.style.gap = "6px";
      body.append(row, sum, h("div.row", { style: { justifyContent: "center" } },
        h("button.btn.c-sun", { onclick: roll }, T.icon("dice"), "At"),
        [1, 2, 3, 4].map((n) => h("button.btn.sm.c-chalk", { "aria-pressed": String(d.n === n), onclick: () => { d.n = n; d.vals = Array.from({ length: n }, () => T.rand(1, 6)); api.save(); paint(); } }, n))));
      function paint(anim) {
        row.replaceChildren(...d.vals.map((v, i) => {
          const c = h("div", { style: { width: `min(${90 / d.n}%, 60cqh)`, aspectRatio: "1" } }, T.dieSVG(v, ["#fff", "#ffe38a", "#cfe9fb", "#ffd3c7"][i]));
          if (anim) c.animate([{ transform: "rotate(-25deg) scale(.8)" }, { transform: "rotate(10deg) scale(1.06)" }, { transform: "none" }], { duration: 420, easing: "ease-out" });
          return c;
        }));
        sum.textContent = d.n > 1 ? "Toplam: " + d.vals.reduce((a, b) => a + b, 0) : "";
      }
      function roll() { T.sound.drum(); let k = 0; const iv = setInterval(() => { d.vals = d.vals.map(() => T.rand(1, 6)); paint(); if (++k > 6) { clearInterval(iv); d.vals = d.vals.map(() => T.rand(1, 6)); api.save(); paint(true); } }, 60); }
      paint();
    },
  };

  /* ---------- Grup oluştur ---------- */
  W.groups = {
    title: "Grup oluştur", icon: "groups", tone: "leaf", w: 560, h: 380, desc: "Gelenleri rastgele gruplara böler",
    init: () => ({ mode: "size", n: 4, groups: [] }),
    render(body, w, api) {
      const d = w.data;
      const grid = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px", overflow: "auto", minHeight: 0, alignContent: "start" } });
      const nLbl = h("span.readout", { style: { fontSize: "20px", minWidth: "30px", textAlign: "center" } });
      body.style.gridTemplateRows = "auto 1fr"; body.style.gap = "10px";
      body.append(h("div.row", { style: { gap: "6px" } },
        h("div.seg", ["size", "count"].map((m) => h("button", { "aria-pressed": String(d.mode === m), onclick: () => { d.mode = m; api.rerender(); api.save(); } }, m === "size" ? "Grup başına" : "Grup sayısı"))),
        h("button.btn.sm.icon.c-chalk", { "aria-label": "Azalt", onclick: () => { d.n = Math.max(2, d.n - 1); paint(); } }, T.icon("minus")), nLbl,
        h("button.btn.sm.icon.c-chalk", { "aria-label": "Artır", onclick: () => { d.n = Math.min(12, d.n + 1); paint(); } }, T.icon("plus")),
        h("div.spacer"), h("button.btn.sm.c-leaf", { onclick: make }, T.icon("groups"), "Grupla")), grid);
      const tones = ["sun", "tomato", "sky", "leaf", "grape", "pink"];
      function make() {
        const p = T.shuffle(present(api.cls()));
        const k = d.mode === "size" ? Math.max(1, Math.ceil(p.length / d.n)) : d.n;
        const gs = Array.from({ length: k }, () => []);
        p.forEach((s, i) => gs[i % k].push(s.id));
        d.groups = gs; api.save(); T.sound.ok(); paint();
      }
      function paint() {
        nLbl.textContent = d.n;
        const cls = api.cls();
        grid.replaceChildren(...d.groups.map((g, i) => h("div.c-" + tones[i % 6], { style: { background: "var(--tone)", borderRadius: "12px", padding: "8px 10px", boxShadow: "0 3px 0 var(--shade)" } },
          h("div", { style: { fontWeight: 800, fontFamily: "var(--display)", fontSize: "18px" } }, (i + 1) + ". grup"),
          g.map((id) => { const s = cls.students.find((x) => x.id === id); return s ? h("div", { style: { fontSize: "15px", fontWeight: 600 } }, s.name) : null; }))));
        if (!d.groups.length) grid.append(h("div.hint", "Grupla düğmesine bas. Gelmeyenler gruplara girmez."));
      }
      paint();
    },
  };

  /* Şşşş uyarısı: ses sınırı aşılınca ekranın üstünde büyük uyarı. Öğretmen dokunana kadar kalır. */
  T.sssUyari = function (sesli) {
    let el = document.getElementById("sss-uyari");
    if (!el) {
      el = h("button#sss-uyari", { "aria-live": "assertive", onclick: () => el.remove() },
        h("span.sss-parmak", { "aria-hidden": "true" }, "🤫"), h("span.sss-yazi", "Şşşş"), h("small", "Ses çok yükseldi. Kapatmak için dokun."), h("i.sss-say"));
      document.body.append(el); el._n = 0;
    }
    el._n++; el.querySelector(".sss-say").textContent = el._n > 1 ? el._n + ". uyarı" : "";
    el.classList.remove("sars"); void el.offsetWidth; el.classList.add("sars");
    if (sesli) { try { const c = new (window.AudioContext || window.webkitAudioContext)(), n = c.sampleRate * 1.4, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.min(1, i / 2500) * Math.min(1, (n - i) / 9000); const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 3800; f.Q.value = 0.9; const g = c.createGain(); g.gain.value = 0.5; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); s.onended = () => c.close(); } catch (e) {} }
  };
  /* ---------- Ses ölçer ---------- */
  W.noise = {
    title: "Ses ölçer", icon: "noise", tone: "sky", w: 340, h: 300, desc: "Mikrofonla sınıf sesini gösterir",
    init: () => ({ limit: 60, uyari: true, sesli: true }),
    render(body, w, api) {
      const d = w.data; if (d.uyari === undefined) { d.uyari = true; d.sesli = true; }
      const bar = h("div", { style: { position: "relative", height: "100%", borderRadius: "14px", background: "rgba(0,0,0,.06)", overflow: "hidden" } });
      const fill = h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "0%", background: "var(--leaf)", transition: "height .1s, background .3s" } });
      const line = h("div", { style: { position: "absolute", left: 0, right: 0, borderTop: "3px dashed var(--bad)" } });
      const face = h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--hand)", fontSize: "min(16cqw,30px)", textAlign: "center", padding: "10px" } }, "Mikrofonu aç");
      bar.append(fill, line, face);
      const slider = h("input", { type: "range", min: 20, max: 95, value: d.limit, "aria-label": "Ses sınırı", oninput: (e) => { d.limit = +e.target.value; api.save(); line.style.bottom = d.limit + "%"; } });
      line.style.bottom = d.limit + "%";
      const startBtn = h("button.btn.sm.c-sky", { onclick: start }, T.icon("noise"), "Dinle");
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      const sec = (k, l) => h("label.row", { style: { gap: "6px", fontSize: "14px", cursor: "pointer" } }, h("input", { type: "checkbox", checked: d[k] ? true : null, onchange: (e) => { d[k] = e.target.checked; api.save(); } }), l);
      body.style.gridTemplateRows = "1fr auto auto";
      body.append(bar, h("div.row", startBtn, h("label.f", { style: { flex: 1 } }, h("span", "Sınır"), slider)), h("div.row", { style: { gap: "14px" } }, sec("uyari", "Şşşş uyarısı"), sec("sesli", "Uyarı sesi")));
      let stream = null, raf = 0, over = 0, sonUyari = 0;
      async function start() {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const an = ctx.createAnalyser(); an.fftSize = 512;
          ctx.createMediaStreamSource(stream).connect(an);
          const buf = new Uint8Array(an.fftSize);
          startBtn.disabled = true;
          const loop = () => {
            an.getByteTimeDomainData(buf);
            let sum = 0; for (const v of buf) sum += (v - 128) ** 2;
            const lvl = T.clamp(Math.sqrt(sum / buf.length) * 2.4, 0, 100);
            fill.style.height = lvl + "%";
            const loud = lvl > d.limit;
            over = loud ? over + 1 : Math.max(0, over - 2);
            fill.style.background = loud ? "var(--bad)" : lvl > d.limit * 0.7 ? "var(--sun)" : "var(--leaf)";
            if (over > 45 && d.uyari && Date.now() - sonUyari > 6000) { sonUyari = Date.now(); T.sssUyari(d.sesli); }
            face.textContent = over > 30 ? "Biraz sessizlik lütfen" : lvl > d.limit * 0.7 ? "Dikkat, ses yükseliyor" : "Harika gidiyoruz";
            raf = requestAnimationFrame(loop);
          };
          loop();
          api.onDestroy(() => { cancelAnimationFrame(raf); stream && stream.getTracks().forEach((t) => t.stop()); ctx.close(); });
        } catch (e) {
          face.textContent = window.self !== window.top ? "Mikrofon bu önizlemede kapalı. Kendi sitende çalışır." : "Mikrofona izin verilmedi. Tarayıcı adres çubuğundan izin ver.";
          face.style.fontSize = "18px";
        }
      }
    },
  };

  /* ---------- Trafik ışığı ---------- */
  W.traffic = {
    title: "Trafik ışığı", icon: "traffic", tone: "leaf", w: 220, h: 400, minW: 160, desc: "Konuşma kuralı",
    init: () => ({ on: 2 }),
    render(body, w, api) {
      const d = w.data;
      const L = [["#e2473b", "Sessiz"], ["#f0a329", "Fısıltı"], ["#3fae5a", "Konuşabilirsin"]];
      const box = h("div", { style: { display: "grid", gridTemplateRows: "repeat(3, 1fr) auto", gap: "6%", background: "#2b2f33", borderRadius: "18px", padding: "8%", minHeight: 0 } });
      const lbl = h("div", { style: { textAlign: "center", color: "#fff", fontFamily: "var(--display)", fontWeight: 800, fontSize: "min(13cqw, 26px)" } });
      body.append(box);
      function paint() {
        box.replaceChildren(...L.map(([c], i) => h("button", { "aria-label": L[i][1], onclick: () => { d.on = i; api.save(); T.sound.pop(); paint(); },
          style: { border: 0, borderRadius: "50%", aspectRatio: "1", maxHeight: "100%", justifySelf: "center", height: "100%", background: d.on === i ? c : "#45494d", boxShadow: d.on === i ? `0 0 30px ${c}` : "inset 0 4px 10px rgba(0,0,0,.5)" } })), lbl);
        lbl.textContent = L[d.on][1];
      }
      paint();
    },
  };

  /* ---------- Çalışma sembolü ---------- */
  const SYM = [["Sessiz çalışma", "lock", "tomato"], ["Fısıltı", "talk", "sun"], ["Eşli çalışma", "class", "sky"], ["Grup çalışması", "groups", "leaf"], ["Öğretmeni dinle", "speaker", "grape"], ["Söz almak için el kaldır", "hand", "pink"]];
  W.symbol = {
    title: "Çalışma şekli", icon: "hand", tone: "pink", w: 320, h: 280, desc: "Sessiz, eşli, grup...",
    init: () => ({ i: 0 }),
    render(body, w, api) {
      const d = w.data;
      const big = h("div", { style: { display: "grid", placeItems: "center", gap: "6px", minHeight: 0, textAlign: "center" } });
      const sel = h("div.row", { style: { justifyContent: "center", gap: "6px" } });
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      body.append(big, sel);
      function paint() {
        const [t, ic, tone] = SYM[d.i];
        const svg = T.icon(ic); svg.style.cssText = `width:min(40cqw,48cqh);height:min(40cqw,48cqh);color:var(--${tone})`;
        big.replaceChildren(svg, h("div", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "min(11cqw, 30px)", lineHeight: 1.05 } }, t));
        sel.replaceChildren(...SYM.map(([tt, icn], i) => h("button.btn.sm.icon.c-chalk", { title: tt, "aria-label": tt, "aria-pressed": String(i === d.i), class: i === d.i ? "on" : "", onclick: () => { d.i = i; api.save(); paint(); } }, T.icon(icn))));
      }
      paint();
    },
  };

  /* ---------- Yönerge ---------- */
  W.text = {
    title: "Yönerge", icon: "text", tone: "sun", w: 420, h: 300, desc: "Adım adım yönergeler, işaretlenebilir",
    init: () => ({ items: [{ t: "Kitabını 42. sayfada aç", done: false }, { t: "Etkinliği eşinle oku", done: false }, { t: "Cevabını defterine yaz", done: false }], size: 24 }),
    render(body, w, api) {
      const d = w.data;
      const list = h("ol", { style: { margin: 0, paddingLeft: "1.4em", overflow: "auto", minHeight: 0, display: "grid", gap: "6px", alignContent: "start" } });
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      body.append(list, h("div.row", { style: { gap: "6px" } },
        h("button.btn.sm.c-sun", { onclick: () => { d.items.push({ t: "Yeni adım", done: false }); api.save(); paint(true); } }, T.icon("plus"), "Adım"),
        h("button.btn.sm.icon.c-chalk", { "aria-label": "Yazıyı küçült", onclick: () => { d.size = Math.max(14, d.size - 3); api.save(); paint(); } }, "A−"),
        h("button.btn.sm.icon.c-chalk", { "aria-label": "Yazıyı büyüt", onclick: () => { d.size = Math.min(60, d.size + 3); api.save(); paint(); } }, "A+"),
        h("div.spacer"),
        h("button.btn.sm.c-chalk", { onclick: () => { d.items.forEach((x) => (x.done = false)); api.save(); paint(); } }, "İşaretleri sil")));
      function paint(focusLast) {
        list.replaceChildren(...d.items.map((it, i) => {
          const tx = h("span", { contenteditable: "true", spellcheck: "false", style: { outline: "none", flex: 1, textDecoration: it.done ? "line-through" : "none", opacity: it.done ? 0.5 : 1 },
            oninput: (e) => { it.t = e.target.textContent; api.save(); },
            onkeydown: (e) => { if (e.key === "Enter") { e.preventDefault(); d.items.splice(i + 1, 0, { t: "", done: false }); api.save(); paint(); list.children[i + 1].querySelector("[contenteditable]").focus(); } if (e.key === "Backspace" && !it.t && d.items.length > 1) { e.preventDefault(); d.items.splice(i, 1); api.save(); paint(); } } }, it.t);
          return h("li", { style: { fontSize: d.size + "px", fontWeight: 600, lineHeight: 1.25 } },
            h("div", { style: { display: "flex", gap: "8px", alignItems: "flex-start" } }, tx,
              h("button.btn.sm.icon." + (it.done ? "c-leaf" : "c-chalk"), { "aria-label": "Tamamlandı", style: { flex: "0 0 auto" }, onclick: () => { it.done = !it.done; api.save(); paint(); if (it.done) T.sound.pop(); } }, T.icon("check"))));
        }));
        if (focusLast) { const e = list.lastChild && list.lastChild.querySelector("[contenteditable]"); if (e) { e.focus(); document.getSelection().selectAllChildren(e); } }
      }
      paint();
    },
  };

  /* ---------- Puan tablosu ---------- */
  W.score = {
    title: "Puan tablosu", icon: "trophy", tone: "sun", w: 460, h: 260, desc: "Takım puanları",
    init: () => ({ teams: [{ n: "Kırmızılar", p: 0, c: "tomato" }, { n: "Maviler", p: 0, c: "sky" }, { n: "Yeşiller", p: 0, c: "leaf" }] }),
    render(body, w, api) {
      const d = w.data;
      const row = h("div", { style: { display: "grid", gap: "8px", minHeight: 0 } });
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      body.append(row, h("div.row", { style: { gap: "6px" } },
        h("button.btn.sm.c-chalk", { onclick: () => { const cs = ["sun", "grape", "pink"]; if (d.teams.length < 6) d.teams.push({ n: "Takım " + (d.teams.length + 1), p: 0, c: cs[d.teams.length % 3] }); api.save(); paint(); } }, T.icon("plus"), "Takım"),
        h("button.btn.sm.c-chalk", { onclick: () => { d.teams.forEach((t) => (t.p = 0)); api.save(); paint(); } }, T.icon("reset"), "Sıfırla")));
      function paint() {
        row.style.gridTemplateColumns = `repeat(${d.teams.length}, 1fr)`;
        const max = Math.max(...d.teams.map((t) => t.p));
        row.replaceChildren(...d.teams.map((t, i) => h("div.c-" + t.c, { style: { background: "var(--tone)", borderRadius: "14px", padding: "8px", display: "grid", gridTemplateRows: "auto 1fr auto", textAlign: "center", boxShadow: "0 3px 0 var(--shade)", minHeight: 0 } },
          h("div", { contenteditable: "true", spellcheck: "false", style: { fontWeight: 800, fontSize: "15px", outline: "none" }, oninput: (e) => { t.n = e.target.textContent; api.save(); } }, t.n),
          h("div.fit-num", { style: { fontSize: "min(18cqw, 40cqh)", alignSelf: "center" } }, t.p, t.p === max && max > 0 ? h("span", { style: { fontSize: ".4em", verticalAlign: "top" } }, " ★") : null),
          h("div.row", { style: { justifyContent: "center", gap: "4px" } },
            h("button.btn.sm.icon.c-chalk", { "aria-label": t.n + " bir puan azalt", onclick: () => { t.p--; api.save(); paint(); } }, T.icon("minus")),
            h("button.btn.sm.icon.c-chalk", { "aria-label": t.n + " bir puan ekle", onclick: () => { t.p++; T.sound.pop(); api.save(); paint(); } }, T.icon("plus"))))));
      }
      paint();
    },
  };

  /* ---------- Saat ---------- */
  W.clock = {
    title: "Saat", icon: "clock", tone: "sky", w: 300, h: 320, desc: "Analog ve dijital saat",
    render(body, w, api) {
      const svg = T.svg("svg", { viewBox: "0 0 200 200", style: "width:100%;height:100%" });
      const face = T.svg("g");
      face.append(T.svg("circle", { cx: 100, cy: 100, r: 92, fill: "#fff", stroke: "#2a2a2a", "stroke-width": 6 }));
      for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6; face.append(T.svg("text", { x: 100 + 72 * Math.sin(a), y: 100 - 72 * Math.cos(a), "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 20, fill: "#2a2a2a" }, i)); }
      for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30; const r1 = i % 5 ? 86 : 82; face.append(T.svg("line", { x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a), x2: 100 + 90 * Math.sin(a), y2: 100 - 90 * Math.cos(a), stroke: "#2a2a2a", "stroke-width": i % 5 ? 1 : 3 })); }
      const hh = T.svg("line", { x1: 100, y1: 100, stroke: "#ef5b3b", "stroke-width": 8, "stroke-linecap": "round" });
      const mm = T.svg("line", { x1: 100, y1: 100, stroke: "#2e9bd6", "stroke-width": 6, "stroke-linecap": "round" });
      const ss = T.svg("line", { x1: 100, y1: 100, stroke: "#2a2a2a", "stroke-width": 2, "stroke-linecap": "round" });
      svg.append(face, hh, mm, ss, T.svg("circle", { cx: 100, cy: 100, r: 6, fill: "#2a2a2a" }));
      const dig = h("div.fit-num", { style: { fontSize: "min(12cqw,30px)" } });
      body.style.gridTemplateRows = "1fr auto"; body.append(h("div", { style: { minHeight: 0 } }, svg), dig);
      const set = (l, ang, len) => { l.setAttribute("x2", 100 + len * Math.sin(ang)); l.setAttribute("y2", 100 - len * Math.cos(ang)); };
      function paint() {
        const n = new Date(), s = n.getSeconds(), m = n.getMinutes() + s / 60, hr = (n.getHours() % 12) + m / 60;
        set(hh, (hr * Math.PI) / 6, 48); set(mm, (m * Math.PI) / 30, 68); set(ss, (s * Math.PI) / 30, 74);
        dig.textContent = `${T.pad(n.getHours())}:${T.pad(n.getMinutes())}`;
      }
      const iv = setInterval(paint, 1000); api.onDestroy(() => clearInterval(iv)); paint();
    },
  };

  /* ---------- QR ---------- */
  W.qr = {
    title: "QR kod", icon: "qr", tone: "chalk", w: 320, h: 380, desc: "Bir bağlantıyı öğrenci cihazına taşı",
    init: () => ({ url: "" }),
    render(body, w, api) {
      const d = w.data;
      const box = h("div", { style: { display: "grid", placeItems: "center", minHeight: 0, background: "#fff", borderRadius: "10px" } });
      const inp = h("input.in", { placeholder: "https://...", value: d.url, "aria-label": "Bağlantı" });
      inp.addEventListener("change", () => { d.url = inp.value.trim(); api.save(); paint(); });
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      body.append(box, inp);
      function paint() {
        box.replaceChildren();
        if (!d.url) { box.append(h("div.hint", { style: { textAlign: "center", padding: "10px" } }, "Bağlantıyı aşağıya yapıştır")); return; }
        if (!window.QRCode) { box.append(h("div.hint", "QR kütüphanesi yüklenemedi. İnternet bağlantısını kontrol et.")); return; }
        const holder = h("div"); box.append(holder);
        const size = Math.max(120, Math.min(body.clientWidth, body.clientHeight - 60) - 20);
        try { new window.QRCode(holder, { text: d.url, width: size, height: size, correctLevel: window.QRCode.CorrectLevel.M }); } catch (e) { holder.textContent = "Bağlantı çok uzun"; }
      }
      api.resized = () => { clearTimeout(api._q); api._q = setTimeout(paint, 150); };
      setTimeout(paint, 30);
    },
  };

  /* ---------- Çıkış bileti ---------- */
  W.ticket = {
    title: "Çıkış bileti", icon: "ticket", tone: "grape", w: 440, h: 320, desc: "Ders sonu anlık geri bildirim",
    init: () => ({ q: "Bugünkü konuyu ne kadar anladım?", c: [0, 0, 0] }),
    render(body, w, api) {
      const d = w.data;
      const faces = [["Anladım", "#3fae5a", "M30 58c8 10 32 10 40 0"], ["Biraz", "#f0a329", "M32 62h36"], ["Yardım lazım", "#e2473b", "M30 66c8-10 32-10 40 0"]];
      const q = h("div", { contenteditable: "true", spellcheck: "false", style: { fontWeight: 700, fontSize: "18px", outline: "none", textAlign: "center" }, oninput: (e) => { d.q = e.target.textContent; api.save(); } }, d.q);
      const row = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", minHeight: 0 } });
      const total = h("div.hint", { style: { textAlign: "center" } });
      body.style.gridTemplateRows = "auto 1fr auto auto"; body.style.gap = "8px";
      body.append(q, row, total, h("div.row", { style: { justifyContent: "center" } }, h("button.btn.sm.c-chalk", { onclick: () => { d.c = [0, 0, 0]; api.save(); paint(); } }, T.icon("reset"), "Sıfırla")));
      function paint() {
        const t = d.c.reduce((a, b) => a + b, 0);
        row.replaceChildren(...faces.map(([lbl, col, mouth], i) => h("button", { "aria-label": lbl, onclick: () => { d.c[i]++; api.save(); T.sound.pop(); paint(); }, style: { border: 0, background: "transparent", display: "grid", gridTemplateRows: "1fr auto auto", justifyItems: "center", minHeight: 0, padding: 0 } },
          (() => { const s = T.svg("svg", { viewBox: "0 0 100 100", style: "height:100%;max-width:100%" }); s.innerHTML = `<circle cx="50" cy="50" r="44" fill="${col}" stroke="#2a2a2a" stroke-width="4"/><circle cx="36" cy="40" r="5" fill="#2a2a2a"/><circle cx="64" cy="40" r="5" fill="#2a2a2a"/><path d="${mouth}" stroke="#2a2a2a" stroke-width="5" fill="none" stroke-linecap="round"/>`; return s; })(),
          h("span", { style: { fontWeight: 700, fontSize: "14px" } }, lbl),
          h("span.readout", { style: { fontSize: "22px" } }, t ? Math.round((d.c[i] / t) * 100) + "%" : "0"))));
        total.textContent = t ? `${t} yanıt. Öğrenciler sırayla gelip yüzüne dokunur.` : "Öğrenciler çıkarken kendi yüzüne dokunur.";
      }
      paint();
    },
  };

  /* ---------- Çizim ---------- */
  W.draw = {
    title: "Çizim", icon: "pen", tone: "chalk", w: 520, h: 380, desc: "Serbest çizim ve not",
    init: () => ({ img: "" }),
    render(body, w, api) {
      const d = w.data;
      const cv = h("canvas", { style: { width: "100%", height: "100%", background: "#fff", borderRadius: "10px", touchAction: "none", display: "block" } });
      let color = "#2a2a2a", size = 5, erase = false;
      const tools = h("div.row", { style: { gap: "6px" } },
        ["#2a2a2a", "#e2473b", "#2e9bd6", "#3fae5a", "#f0a329"].map((c) => h("button", { "aria-label": "Renk", onclick: () => { color = c; erase = false; }, style: { width: "34px", height: "34px", borderRadius: "50%", border: "3px solid #fff", outline: "2px solid rgba(0,0,0,.15)", background: c } })),
        h("button.btn.sm.c-chalk", { onclick: () => (erase = true) }, "Silgi"),
        h("button.btn.sm.c-chalk", { onclick: () => { size = size === 5 ? 12 : 5; } }, "Kalınlık"),
        h("div.spacer"),
        h("button.btn.sm.c-tomato", { onclick: () => { ctx.clearRect(0, 0, cv.width, cv.height); d.img = ""; api.save(); } }, T.icon("trash")));
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      body.append(h("div", { style: { minHeight: 0 } }, cv), tools);
      const ctx = cv.getContext("2d");
      function fit() {
        const r = cv.getBoundingClientRect(); if (!r.width) return;
        const keep = d.img;
        cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio;
        if (keep) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, cv.width, cv.height); im.src = keep; }
      }
      api.resized = () => { clearTimeout(api._t); api._t = setTimeout(fit, 120); };
      setTimeout(fit, 30);
      let last = null;
      cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); last = pos(e); });
      cv.addEventListener("pointermove", (e) => {
        if (!last) return; const p = pos(e);
        ctx.globalCompositeOperation = erase ? "destination-out" : "source-over";
        ctx.strokeStyle = color; ctx.lineWidth = (erase ? 28 : size) * devicePixelRatio; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p;
      });
      const up = () => { if (last) { last = null; try { d.img = cv.toDataURL("image/png"); api.save(); } catch (e) {} } };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      function pos(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * devicePixelRatio, y: (e.clientY - r.top) * devicePixelRatio }; }
    },
  };

  /* ---------- Okulun kaçıncı günü ---------- */
  W.daycount = {
    title: "Okulun kaçıncı günü", icon: "calendar", tone: "leaf", w: 300, h: 240, desc: "Bugün, kalan gün, özel gün",
    render(body) {
      const n = T.cal.dayNumber(), tot = T.cal.total(), sp = T.cal.specialDay();
      body.style.alignContent = "center"; body.style.textAlign = "center";
      body.append(
        h("div.fit-num", { style: { fontSize: "min(30cqw, 55cqh)", color: "var(--leaf)" } }, n),
        h("div", { style: { fontFamily: "var(--hand)", fontSize: "min(9cqw, 26px)" } }, "Okulun " + n + ". günü"),
        h("div.hint", "Yıl sonuna " + Math.max(0, tot - n) + " okul günü var"),
        sp ? h("div.pill.info", { style: { justifySelf: "center", marginTop: "6px" } }, sp) : null);
    },
  };

  /* ---------- Görev panosu ---------- */
  W.duties = {
    title: "Sınıf görevleri", icon: "star", tone: "sun", w: 360, h: 260, desc: "Nöbetçi ve sorumlular",
    render(body, w, api) {
      const s = T.store.get(), c = api.cls(), dt = s.duties[c.id] || {};
      body.style.alignContent = "start"; body.style.gap = "8px";
      const rows = T.gorevliler(c).map(([g, st]) => { return st ? h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, T.avatar(st.name, 44), h("div", h("div", { style: { fontWeight: 800, fontSize: "18px" } }, st.name), h("div.hint", g))) : null; });
      body.append(...(rows.length ? rows : [h("div.hint", "Henüz görevli yok.")]), h("button.btn.sm.c-chalk", { style: { justifySelf: "start" }, onclick: () => T.gorevliPenceresi(c, () => { body.replaceChildren(); W.duties.render(body, w, api); }) }, T.icon("edit"), "Düzenle"));
    },
  };
})();
