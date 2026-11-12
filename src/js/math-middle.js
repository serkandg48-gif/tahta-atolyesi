/* Ortaokul araçları: cebir karoları, tam sayı pulları, koordinat düzlemi, grafik, veri */
(function () {
  const { h } = T; const S = T.svg;
  const tool = (id, def) => (T.tools[id] = Object.assign({ cat: "orta" }, def));
  const btn = (tone, icon, label, onclick) => h("button.btn.c-" + tone, { onclick }, icon ? T.icon(icon) : null, label);
  const seg = (opts, cur, on) => h("div.seg", opts.map(([v, l]) => h("button", { "aria-pressed": String(v === cur), onclick: (e) => { e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); on(v); } }, l)));

  const polyStr = (a, b, c) => {
    const t = []; const term = (k, s) => { if (!k) return; const sign = k < 0 ? "−" : "+"; const abs = Math.abs(k); t.push({ sign, txt: (abs === 1 && s ? "" : abs) + s }); };
    term(a, "x²"); term(b, "x"); term(c, "");
    if (!t.length) return "0";
    return t.map((x, i) => (i === 0 ? (x.sign === "−" ? "−" : "") : " " + x.sign + " ") + x.txt).join("");
  };

  tool("cebir-karolari", {
    title: "Cebir karoları", icon: "algebra", tone: "sky", grades: [6, 8], short: "x², x, 1 karoları; ifade ve çarpanlar",
    render(host) {
      const tv = T.Tuval(host, {
        palettes: [{ items: ["x2", "x", "bir"] }], grid: true, snap: 5,
        readout: (ps) => {
          let a = 0, b = 0, c = 0; ps.forEach((p) => { const s = p.flip ? -1 : 1; if (p.type === "x2") a += s; if (p.type === "x") b += s; if (p.type === "bir") c += s; });
          return polyStr(a, b, c);
        },
      });
      host.append(h("div.row",
        btn("leaf", "check", "Sıfır çiftlerini kaldır", () => {
          let ps = tv.state.pieces.slice();
          for (const ty of ["x2", "x", "bir"]) {
            let pos = ps.filter((p) => p.type === ty && !p.flip), neg = ps.filter((p) => p.type === ty && p.flip);
            const k = Math.min(pos.length, neg.length);
            const rm = new Set([...pos.slice(0, k), ...neg.slice(0, k)]);
            ps = ps.filter((p) => !rm.has(p));
          }
          tv.state.pieces = ps; T.sound.ok(); tv.draw(); tv.change();
        }),
        btn("sky", "dice", "Örnek: (x + 2)(x + 3)", () => {
          const ps = [{ type: "x2", x: 300, y: 260 }];
          for (let i = 0; i < 3; i++) ps.push({ type: "x", x: 375 + i * 30, y: 260 });
          for (let j = 0; j < 2; j++) ps.push({ type: "x", x: 300, y: 335 + j * 30, rot: 90 });
          for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) ps.push({ type: "bir", x: 375 + i * 30, y: 335 + j * 30 });
          tv.set(ps);
        }),
        btn("tomato", "trash", "Temizle", () => tv.clear()),
        h("span.hint", "Seçili karoyu İşaret ile negatife çevir. Dikdörtgen oluşturunca kenarları çarpanları verir.")));
    },
  });

  tool("tam-sayi", {
    title: "Tam sayı pulları", icon: "integer", tone: "tomato", grades: [6, 7], short: "Artı ve eksi pullar, sıfır çifti",
    render(host) {
      const tv = T.Tuval(host, {
        palettes: [{ items: ["arti", "eksi"] }], grid: true,
        readout: (ps) => { const p = ps.filter((x) => x.type === "arti").length, n = ps.filter((x) => x.type === "eksi").length; return `(+${p}) + (−${n}) = ${p - n >= 0 ? "+" : "−"}${Math.abs(p - n)}`; },
      });
      host.append(h("div.row",
        btn("leaf", "check", "Sıfır çiftlerini kaldır", () => {
          const p = tv.state.pieces.filter((x) => x.type === "arti"), n = tv.state.pieces.filter((x) => x.type === "eksi"); const k = Math.min(p.length, n.length);
          const rm = new Set([...p.slice(0, k), ...n.slice(0, k)]); tv.state.pieces = tv.state.pieces.filter((x) => !rm.has(x)); T.sound.ok(); tv.draw(); tv.change();
        }),
        btn("sky", "plus", "5 sıfır çifti ekle", () => { for (let i = 0; i < 5; i++) { tv.add("arti", { x: 700 + i * 64, y: 520 }); tv.add("eksi", { x: 700 + i * 64, y: 590 }); } }),
        btn("tomato", "trash", "Temizle", () => tv.clear()),
        h("span.hint", "(+3) − (−5) gibi bir işlemde çıkarılacak eksi pul yoksa önce sıfır çifti ekleyin, sonra 5 eksi pulu alın.")));
    },
  });

  /* ---------- Koordinat düzlemi ---------- */
  tool("koordinat", {
    title: "Koordinat düzlemi", icon: "coord", tone: "grape", grades: [5, 8], short: "Nokta, şekil, öteleme, yansıma",
    render(host) {
      let pts = [], img = null, R = 10;
      const svg = S("svg", { viewBox: "0 0 640 640", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)", aspectRatio: "1", margin: "0 auto", maxWidth: "100%" } }, svg);
      const list = h("div.readout", { style: { color: "var(--chalk)", fontSize: "20px" } });
      const P = (v) => 320 + (v * 300) / R, Q = (v) => 320 - (v * 300) / R;
      function paint() {
        svg.replaceChildren();
        for (let i = -R; i <= R; i++) { svg.append(S("line", { x1: P(i), y1: 20, x2: P(i), y2: 620, stroke: i ? "rgba(0,0,0,.08)" : "#2a2a2a", "stroke-width": i ? 1 : 3 })); svg.append(S("line", { x1: 20, y1: Q(i), x2: 620, y2: Q(i), stroke: i ? "rgba(0,0,0,.08)" : "#2a2a2a", "stroke-width": i ? 1 : 3 }));
          if (i && i % 2 === 0) { svg.append(S("text", { x: P(i), y: 340, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 13 }, i)); svg.append(S("text", { x: 306, y: Q(i), "text-anchor": "end", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 13 }, i)); } }
        svg.append(S("text", { x: 626, y: 312, "text-anchor": "end", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 20 }, "x"), S("text", { x: 330, y: 30, "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 20 }, "y"));
        const shape = (arr, col, lbl) => {
          if (arr.length > 1) svg.append(S("polygon", { points: arr.map(([x, y]) => P(x) + "," + Q(y)).join(" "), fill: col, "fill-opacity": arr.length > 2 ? 0.2 : 0, stroke: col, "stroke-width": 4, "stroke-linejoin": "round" }));
          arr.forEach(([x, y], i) => { svg.append(S("circle", { cx: P(x), cy: Q(y), r: 8, fill: col, stroke: "#2a2a2a", "stroke-width": 2 })); svg.append(S("text", { x: P(x) + 10, y: Q(y) - 12, "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 18, fill: col }, String.fromCharCode(65 + i) + lbl + `(${x}, ${y})`)); });
        };
        shape(pts, "#8a5cd0", ""); if (img) shape(img, "#ef5b3b", "′");
        list.textContent = pts.length ? pts.map(([x, y], i) => `${String.fromCharCode(65 + i)}(${x}, ${y})`).join("  ") : "Noktayı koymak için düzleme dokun.";
      }
      svg.addEventListener("pointerdown", (e) => {
        const p = T.svgPoint(svg, e.clientX, e.clientY);
        const x = Math.round(((p.x - 320) * R) / 300), y = Math.round(((320 - p.y) * R) / 300);
        const i = pts.findIndex(([a, b]) => a === x && b === y);
        if (i >= 0) pts.splice(i, 1); else if (pts.length < 8) pts.push([x, y]);
        img = null; T.sound.tick(); paint();
      });
      const dx = h("input.in", { type: "number", value: 3, style: { width: "80px" }, "aria-label": "x ötelemesi" });
      const dy = h("input.in", { type: "number", value: -2, style: { width: "80px" }, "aria-label": "y ötelemesi" });
      host.append(mat, list, h("div.row",
        h("label.f", h("span", "Öteleme x"), dx), h("label.f", h("span", "Öteleme y"), dy),
        btn("tomato", "next", "Ötele", () => { img = pts.map(([x, y]) => [x + +dx.value, y + +dy.value]); paint(); }),
        btn("tomato", null, "x eksenine göre yansıt", () => { img = pts.map(([x, y]) => [x, -y]); paint(); }),
        btn("tomato", null, "y eksenine göre yansıt", () => { img = pts.map(([x, y]) => [-x, y]); paint(); }),
        btn("chalk", "reset", "Temizle", () => { pts = []; img = null; paint(); })));
      paint();
    },
  });

  /* ---------- Grafik çizici ---------- */
  tool("grafik", {
    title: "Doğrusal grafik", icon: "graph", tone: "leaf", grades: [7, 8], short: "y = mx + n, eğim ve tablo",
    render(host) {
      let m = 1, n = 2, kind = "dogru", a = 1;
      const svg = S("svg", { viewBox: "0 0 640 640", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)", aspectRatio: "1", maxWidth: "100%" } }, svg);
      const R = 10, P = (v) => 320 + (v * 300) / R, Q = (v) => 320 - (v * 300) / R;
      const eq = h("div.readout", { style: { color: "var(--chalk)" } });
      const tbl = h("div.paper", { style: { padding: "12px 16px", alignSelf: "start" } });
      const f = (x) => (kind === "dogru" ? m * x + n : a * x * x + n);
      function paint() {
        svg.replaceChildren();
        for (let i = -R; i <= R; i++) { svg.append(S("line", { x1: P(i), y1: 20, x2: P(i), y2: 620, stroke: i ? "rgba(0,0,0,.08)" : "#2a2a2a", "stroke-width": i ? 1 : 3 })); svg.append(S("line", { x1: 20, y1: Q(i), x2: 620, y2: Q(i), stroke: i ? "rgba(0,0,0,.08)" : "#2a2a2a", "stroke-width": i ? 1 : 3 })); }
        let d = "", prev = false;
        for (let i = 0; i <= 400; i++) { const x = -R + (i * 2 * R) / 400, y = f(x); const ok = Math.abs(y) <= R * 1.2; if (ok) d += (prev ? "L" : "M") + P(x).toFixed(1) + " " + Q(y).toFixed(1) + " "; prev = ok; }
        svg.append(S("path", { d: d || "M0 0", fill: "none", stroke: "#26b3a0", "stroke-width": 5, "stroke-linecap": "round" }));
        svg.append(S("circle", { cx: P(0), cy: Q(n), r: 9, fill: "#ef5b3b", stroke: "#2a2a2a", "stroke-width": 2 }));
        const fm = (v) => (Math.round(v * 10) / 10).toLocaleString("tr-TR");
        eq.textContent = kind === "dogru" ? `y = ${fm(m)}x ${n >= 0 ? "+" : "−"} ${fm(Math.abs(n))}` : `y = ${fm(a)}x² ${n >= 0 ? "+" : "−"} ${fm(Math.abs(n))}`;
        tbl.replaceChildren(h("table.table", h("thead", h("tr", h("th", "x"), h("th.num", "y"))), h("tbody", [-2, -1, 0, 1, 2, 3].map((x) => h("tr", h("td", x), h("td.num", fm(f(x))))))));
      }
      const sl = (lbl, v, min, max, step, on) => { const o = h("span.readout", { style: { fontSize: "20px", minWidth: "50px" } }, v); const i = h("input", { type: "range", min, max, step, value: v, "aria-label": lbl, oninput: (e) => { on(+e.target.value); o.textContent = e.target.value; paint(); } }); return h("label.f", { style: { color: "var(--chalk)", minWidth: "200px", flex: 1 } }, h("span", { style: { color: "var(--chalk-dim)" } }, lbl), h("div.row", i, o)); };
      const sliders = h("div.row");
      function sliderSet() { sliders.replaceChildren(kind === "dogru" ? sl("Eğim (m)", m, -5, 5, 0.5, (v) => (m = v)) : sl("a", a, -3, 3, 0.25, (v) => (a = v)), sl("Kesişim (n)", n, -8, 8, 1, (v) => (n = v))); }
      host.append(h("div.row", seg([["dogru", "Doğru: y = mx + n"], ["parabol", "Parabol (zenginleştirme)"]], kind, (v) => { kind = v; sliderSet(); paint(); }), eq), sliders,
        h("div", { style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) 220px", gap: "16px" } }, mat, tbl),
        h("p.hint", "Eğimi değiştirince doğru ne yöne döner? Kırmızı nokta y eksenini kestiği yerdir."));
      sliderSet(); paint();
    },
  });

  /* ---------- Veri analizi ---------- */
  tool("veri", {
    title: "Sınıf verisi", icon: "chart", tone: "sun", grades: [2, 8], short: "Veri topla, sütun grafiği, ortalama",
    render(host) {
      let title = "En sevdiğimiz meyve", cats = [["Elma", 6], ["Muz", 4], ["Çilek", 8], ["Portakal", 3]], mode = "sutun";
      const svg = S("svg", { viewBox: "0 0 900 440", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "460px" } }, svg);
      const ed = h("div.paper", { style: { padding: "14px 16px", display: "grid", gap: "8px", alignContent: "start" } });
      const stats = h("div.readout", { style: { color: "var(--chalk)", fontSize: "20px" } });
      const cols = ["#ef5b3b", "#ffc233", "#6cc04a", "#2e9bd6", "#8a5cd0", "#f27ba9", "#ff9a3c", "#26b3a0"];
      function paint() {
        svg.replaceChildren(S("text", { x: 450, y: 34, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 28 }, title));
        const max = Math.max(1, ...cats.map((c) => c[1])), n = cats.length, bw = 760 / Math.max(1, n);
        if (mode === "sutun") {
          const Y = (v) => 380 - (v / max) * 300;
          for (let k = 0; k <= max; k += Math.max(1, Math.ceil(max / 6))) { svg.append(S("line", { x1: 70, y1: Y(k), x2: 860, y2: Y(k), stroke: "rgba(0,0,0,.08)" })); svg.append(S("text", { x: 62, y: Y(k), "text-anchor": "end", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 14 }, k)); }
          cats.forEach(([c, v], i) => { const x = 90 + i * bw; svg.append(S("rect", { x: x + bw * 0.12, y: Y(v), width: bw * 0.76, height: 380 - Y(v), rx: 5, fill: T.m3d(cols[i % 8]), filter: (T.m3kur(), "url(#m3-golge-k)") })); svg.append(S("text", { x: x + bw / 2, y: Y(v) - 10, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 22 }, v)); svg.append(S("text", { x: x + bw / 2, y: 408, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 16 }, c)); });
        } else {
          cats.forEach(([c, v], i) => { svg.append(S("text", { x: 150, y: 90 + i * 44, "text-anchor": "end", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 18 }, c)); for (let k = 0; k < v; k++) svg.append(S("circle", { cx: 180 + k * 40, cy: 90 + i * 44, r: 15, fill: cols[i % 8], stroke: "#2a2a2a", "stroke-width": 2 })); });
        }
        const vals = cats.map((c) => c[1]), tot = vals.reduce((a, b) => a + b, 0), sorted = vals.slice().sort((a, b) => a - b);
        const med = sorted.length ? (sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : 0;
        const tepe = cats.filter((c) => c[1] === Math.max(...vals)).map((c) => c[0]).join(", ");
        stats.textContent = `Toplam ${tot}   Ortalama ${(tot / Math.max(1, n)).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}   Ortanca ${med}   En çok: ${tepe}   Açıklık ${Math.max(...vals) - Math.min(...vals)}`;
        ed.replaceChildren(h("label.f", h("span", "Başlık"), (() => { const i = h("input.in", { value: title }); i.addEventListener("input", () => { title = i.value; paint2(); }); return i; })()),
          ...cats.map((c, i) => h("div.row", { style: { gap: "6px" } },
            (() => { const i2 = h("input.in", { value: c[0], style: { flex: 1, minWidth: "90px" }, "aria-label": "Kategori" }); i2.addEventListener("input", () => { c[0] = i2.value; paint2(); }); return i2; })(),
            h("button.btn.sm.icon.c-chalk", { "aria-label": "Azalt", onclick: () => { c[1] = Math.max(0, c[1] - 1); paint(); } }, T.icon("minus")),
            h("span.readout", { style: { fontSize: "20px", minWidth: "28px", textAlign: "center" } }, c[1]),
            h("button.btn.sm.icon.c-leaf", { "aria-label": "Artır", onclick: () => { c[1]++; T.sound.pop(); paint(); } }, T.icon("plus")),
            h("button.btn.sm.icon.c-tomato", { "aria-label": "Sil", onclick: () => { cats.splice(i, 1); paint(); } }, T.icon("trash")))),
          h("button.btn.sm.c-chalk", { onclick: () => { if (cats.length < 8) cats.push(["Yeni", 0]); paint(); } }, T.icon("plus"), "Kategori"));
      }
      let tm; const paint2 = () => { clearTimeout(tm); tm = setTimeout(() => { const f = document.activeElement; const idx = [...ed.querySelectorAll("input")].indexOf(f); paint(); const n2 = ed.querySelectorAll("input")[idx]; if (n2) { n2.focus(); n2.setSelectionRange(n2.value.length, n2.value.length); } }, 250); };
      host.append(h("div.row", seg([["sutun", "Sütun grafiği"], ["nesne", "Nesne grafiği"]], mode, (v) => { mode = v; paint(); }), stats),
        h("div", { style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: "16px" } }, mat, ed),
        h("p.hint", "Sınıfa bir soru sorun, el kaldıranları sayıp artı düğmesine basın. Grafik kendiliğinden çizilir."));
      paint();
    },
  });
})();
