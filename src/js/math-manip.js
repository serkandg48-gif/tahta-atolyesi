/* Sanal manipülatifler */
(function () {
  const { h } = T; const S = T.svg;
  const tool = (id, def) => (T.tools[id] = Object.assign({ cat: "manip" }, def));
  const btn = (tone, icon, label, onclick) => h("button.btn.c-" + tone, { onclick }, icon ? T.icon(icon) : null, label);

  /* ---------- Onluk çerçeve ---------- */
  tool("onluk-cerceve", {
    title: "Onluk çerçeve", icon: "frame", tone: "tomato", grades: [1, 2], short: "5'lik, 10'luk ve çift çerçeve",
    render(host) {
      let type = 10, cells = [], showN = true;
      const COLS = { 0: null, 1: "#ef5b3b", 2: "#ffc233" };
      const svg = S("svg", { viewBox: "0 0 1000 520", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)" } });
      let pen = 1;
      function setType(t) { type = t; cells = Array(t === 20 ? 20 : t).fill(0); paint(); }
      function paint() {
        svg.replaceChildren();
        const frames = type === 20 ? 2 : 1, cols = type === 5 ? 5 : 5, rows = type === 5 ? 1 : 2, cw = 150;
        T.m3kur && T.m3kur();
        for (let f = 0; f < frames; f++) {
          const ox = 500 - (cols * cw) / 2, oy = (frames === 1 ? (rows === 1 ? 185 : 110) : 20 + f * 260);
          svg.append(S("rect", { x: ox - 18, y: oy - 18, width: cols * cw + 36, height: rows * cw + 36, rx: 16, fill: "url(#m3-ahsap)", filter: "url(#m3-golge)" }));
          for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            const i = f * 10 + r * cols + c;
            const g = S("g", { style: "cursor:pointer" });
            g.append(S("rect", { x: ox + c * cw + 5, y: oy + r * cw + 5, width: cw - 10, height: cw - 10, rx: 8, fill: "#F7EFDF", stroke: "#8A6238", "stroke-width": 2, filter: "url(#m3-ic)" }));
            if (cells[i]) g.append(S("circle", { cx: ox + c * cw + cw / 2, cy: oy + r * cw + cw / 2, r: 54, fill: T.m3 ? T.m3(COLS[cells[i]]) : COLS[cells[i]], filter: "url(#m3-golge)" }));
            g.addEventListener("click", () => { cells[i] = cells[i] === pen ? 0 : pen; T.sound.pop(); paint(); });
            svg.append(g);
          }
        }
        const a = cells.filter((x) => x === 1).length, b = cells.filter((x) => x === 2).length;
        out.textContent = showN ? (b ? `${a} + ${b} = ${a + b}` : `${a}`) + `   (boş: ${cells.length - a - b})` : "";
      }
      host.append(
        h("div.row", h("div.seg", [[5, "5'lik"], [10, "10'luk"], [20, "İki çerçeve"]].map(([t, l]) => h("button", { "aria-pressed": String(t === type), onclick: (e) => { e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); setType(t); } }, l))),
          h("div.seg", [[1, "Kırmızı pul"], [2, "Sarı pul"]].map(([p, l]) => h("button", { "aria-pressed": String(p === pen), onclick: (e) => { pen = p; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); } }, l)))),
        mat,
        h("div.row", btn("tomato", "dice", "Rastgele doldur", () => { const n = T.rand(1, cells.length); cells = cells.map((_, i) => (i < n ? 1 : 0)); paint(); }),
          btn("chalk", "reset", "Boşalt", () => { cells = cells.map(() => 0); paint(); }),
          btn("chalk", "eye", "Sayıyı gizle / göster", () => { showN = !showN; paint(); }), out));
      setType(10);
    },
  });

  /* ---------- Taban blokları ---------- */
  tool("taban-blok", {
    title: "Taban blokları", icon: "blocks", tone: "sky", grades: [1, 5], short: "Birlik, onluk, yüzlük, binlik; boz ve grupla",
    render(host) {
      const tv = T.Tuval(host, {
        palettes: [{ items: ["birlik", "onluk", "yuzluk", "binlik"] }], grid: true,
        readout: (ps) => {
          const c = { binlik: 0, yuzluk: 0, onluk: 0, birlik: 0 }; ps.forEach((p) => c[p.type] !== undefined && c[p.type]++);
          const sum = c.binlik * 1000 + c.yuzluk * 100 + c.onluk * 10 + c.birlik;
          return `${T.fmt(sum)}  =  ${c.binlik ? c.binlik + " binlik + " : ""}${c.yuzluk} yüzlük + ${c.onluk} onluk + ${c.birlik} birlik`;
        },
      });
      const num = h("input.in", { type: "number", min: 0, max: 9999, placeholder: "Sayı yaz", style: { width: "140px" }, "aria-label": "Oluşturulacak sayı" });
      host.append(h("div.row",
        num, btn("sky", "blocks", "Bloklarla göster", () => {
          const n = T.clamp(+num.value || 0, 0, 9999); const ps = [];
          let cx = 40;
          const col = (type, k, w, hgt, gap, perCol) => { for (let i = 0; i < k; i++) { const c = Math.floor(i / perCol), r = i % perCol; ps.push({ type, x: cx + w / 2 + c * (w + gap), y: 30 + hgt / 2 + r * (hgt + gap) }); } if (k) cx += Math.ceil(k / perCol) * (w + gap) + 30; };
          col("binlik", Math.floor(n / 1000), 260, 260, 20, 2);
          col("yuzluk", Math.floor((n % 1000) / 100), 220, 220, 14, 2);
          col("onluk", Math.floor((n % 100) / 10), 22, 220, 8, 1);
          col("birlik", n % 10, 22, 22, 6, 5);
          tv.set(ps);
        }),
        btn("leaf", "groups", "10'ları grupla", () => {
          const ps = tv.state.pieces; let changed = true;
          const up = [["birlik", "onluk"], ["onluk", "yuzluk"], ["yuzluk", "binlik"]];
          while (changed) {
            changed = false;
            for (const [a, b] of up) {
              const list = ps.filter((p) => p.type === a);
              if (list.length >= 10) {
                const take = list.slice(0, 10); const x = take.reduce((s, p) => s + p.x, 0) / 10, y = take.reduce((s, p) => s + p.y, 0) / 10;
                tv.state.pieces = tv.state.pieces.filter((p) => !take.includes(p)); tv.state.pieces.push({ id: T.uid(), type: b, x, y, rot: 0 });
                changed = true; break;
              }
            }
            if (changed) { ps.length = 0; ps.push(...tv.state.pieces); }
          }
          T.sound.ok(); tv.draw(); tv.change();
        }),
        btn("chalk", "eye", "Toplamı gizle", () => tv.toggleValue()),
        btn("tomato", "trash", "Temizle", () => tv.clear()),
        h("span.hint", "Bir bloğa iki kez dokun: onluğu 10 birliğe, yüzlüğü 10 onluğa bozar.")));
      num.value = Math.max(1, T.cal.dayNumber()); num.nextSibling.click();
    },
  });

  /* ---------- Rekenrek (sayı boncuğu) ---------- */
  tool("rekenrek", {
    title: "Sayı boncuğu", icon: "beads", tone: "grape", grades: [1, 2], short: "Rekenrek: 20'lik ve 100'lük",
    render(host) {
      let rowsN = 2; let left = [];
      const svg = S("svg", { viewBox: "0 0 1000 560", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)", background: "#f3ead9" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)" } });
      function setRows(n) { rowsN = n; left = Array(n).fill(0); paint(); }
      function paint() {
        svg.replaceChildren();
        T.m3kur && T.m3kur();
        svg.append(S("rect", { x: 40, y: 20, width: 920, height: 520, rx: 18, fill: "url(#m3-ahsap)", filter: "url(#m3-golge)" }));
        svg.append(S("rect", { x: 70, y: 46, width: 860, height: 468, rx: 8, fill: "#FBF3E2", filter: "url(#m3-ic)" }));
        const gap = 468 / rowsN, r = Math.min(30, gap * 0.36);
        for (let row = 0; row < rowsN; row++) {
          const y = 46 + gap * (row + 0.5);
          svg.append(S("rect", { x: 66, y: y - 4, width: 868, height: 8, rx: 4, fill: "url(#m3-metal)" }));
          for (let k = 0; k < 10; k++) {
            const isLeft = k < left[row];
            const x = isLeft ? 110 + k * r * 2.1 + (k >= 5 ? 6 : 0) : 890 - (9 - k) * r * 2.1 - (k < 5 ? 6 : 0);
            const c = S("circle", { cx: x, cy: y, r, fill: T.m3(k < 5 ? "#e2473b" : "#f4f1ea"), filter: "url(#m3-golge-k)", style: "cursor:pointer" });
            c.addEventListener("click", () => { left[row] = isLeft ? k : k + 1; T.sound.tick(); paint(); });
            svg.append(c);
          }
        }
        out.textContent = left.reduce((a, b) => a + b, 0) + (rowsN === 2 ? `  (${left[0]} + ${left[1]})` : "");
      }
      host.append(h("div.row", h("div.seg", [[2, "20'lik"], [10, "100'lük"]].map(([n, l]) => h("button", { "aria-pressed": String(n === rowsN), onclick: (e) => { e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); setRows(n); } }, l)))),
        mat, h("div.row", btn("chalk", "reset", "Hepsini sağa it", () => setRows(rowsN)), out,
          h("span.hint", "Bir boncuğa dokun: o boncuk ve solundakiler bir hamlede kayar. 5'li renk grupları saymadan görmeyi sağlar.")));
      setRows(2);
    },
  });

  /* ---------- Kesir duvarı ---------- */
  tool("kesir-duvari", {
    title: "Kesir duvarı", icon: "fraction", tone: "sun", grades: [2, 6], short: "Denk kesirler, karşılaştırma",
    render(host) {
      const dens = [1, 2, 3, 4, 5, 6, 8, 10, 12];
      const COL = ["#ef5b3b", "#ff9a3c", "#ffc233", "#6cc04a", "#26b3a0", "#2e9bd6", "#8a5cd0", "#f27ba9", "#b98c5b"];
      let shaded = {}, labels = "kesir";
      const svg = S("svg", { viewBox: "0 0 1000 620", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "22px" } });
      function paint() {
        svg.replaceChildren();
        const rh = 600 / dens.length;
        dens.forEach((d, ri) => {
          for (let k = 0; k < d; k++) {
            const key = d + ":" + k, on = shaded[key];
            const w = 960 / d, x = 20 + k * w, y = 10 + ri * rh;
            const g = S("g", { style: "cursor:pointer" });
            g.append(S("rect", { x, y, width: w, height: rh - 6, fill: on ? COL[ri] : "#fff", stroke: "#2a2a2a", "stroke-width": 2.5 }));
            const t = labels === "kesir" ? (d === 1 ? "1" : "1/" + d) : labels === "ondalik" ? (1 / d).toLocaleString("tr-TR", { maximumFractionDigits: 2 }) : labels === "yuzde" ? "%" + Math.round(100 / d) : "";
            if (t) g.append(S("text", { x: x + w / 2, y: y + rh / 2 - 2, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": d >= 10 ? 18 : 24, fill: "#2a2a2a" }, t));
            g.addEventListener("click", () => { shaded[key] = !shaded[key]; T.sound.pop(); paint(); });
            svg.append(g);
          }
        });
        const rows = dens.map((d) => [d, Array.from({ length: d }, (_, k) => shaded[d + ":" + k]).filter(Boolean).length]).filter(([, n]) => n);
        out.textContent = rows.map(([d, n]) => (d === 1 ? n : n + "/" + d)).join("   ");
      }
      host.append(h("div.row", h("div.seg", [["kesir", "Kesir"], ["ondalik", "Ondalık"], ["yuzde", "Yüzde"], ["yok", "Etiketsiz"]].map(([k, l]) => h("button", { "aria-pressed": String(k === labels), onclick: (e) => { labels = k; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); paint(); } }, l)))),
        mat, h("div.row", btn("chalk", "reset", "Boyaları sil", () => { shaded = {}; paint(); }), out,
          h("span.hint", "Parçaları boyayarak denk kesirleri bulun: 1/2 kadar yer kaplayan başka hangi parçalar var?")));
      paint();
    },
  });

  tool("kesir-serit", {
    title: "Kesir şeritleri", icon: "fraction", tone: "leaf", grades: [3, 7], short: "Sürüklenebilir kesir parçaları",
    render(host) {
      T.Tuval(host, {
        palettes: [{ items: ["f1", "f2", "f3", "f4", "f5", "f6", "f8", "f10", "f12"] }], grid: true, snap: 5,
        background: (W) => S("g", {}, S("rect", { x: 300, y: 40, width: 600, height: 56, fill: "none", stroke: "#2a2a2a", "stroke-width": 3, "stroke-dasharray": "8 6" }), S("text", { x: 290, y: 75, "text-anchor": "end", "font-family": "Lexend, sans-serif", "font-size": 18, fill: "#55625b" }, "1 bütün")),
        readout: (ps) => {
          const sum = ps.reduce((a, p) => a + (T.pieceTypes[p.type].value || 0), 0);
          return "Toplam ≈ " + (Math.round(sum * 1000) / 1000).toLocaleString("tr-TR") + (Math.abs(sum - 1) < 1e-9 ? "  (tam 1 bütün)" : "");
        },
      });
    },
  });

  /* ---------- Sayı doğrusu ---------- */
  tool("sayi-dogrusu", {
    title: "Sayı doğrusu", icon: "line", tone: "sky", grades: [1, 8], short: "Atlamalar, aralıklar, negatifler",
    render(host) {
      const g = T.store.grade();
      let a = g >= 6 ? -10 : 0, b = g <= 1 ? 20 : g <= 3 ? 100 : g <= 5 ? 1000 : 10, step = g <= 1 ? 1 : g <= 3 ? 10 : g <= 5 ? 100 : 1;
      let jumps = [], from = null, labelsOn = true;
      const svg = S("svg", { viewBox: "0 0 1100 340", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "360px" } }, svg);
      const X = (v) => 60 + ((v - a) / (b - a)) * 980;
      const V = (x) => a + ((x - 60) / 980) * (b - a);
      const ia = h("input.in", { type: "number", value: a, style: { width: "100px" }, "aria-label": "Başlangıç" });
      const ib = h("input.in", { type: "number", value: b, style: { width: "100px" }, "aria-label": "Bitiş" });
      const is = h("input.in", { type: "number", value: step, style: { width: "100px" }, "aria-label": "Aralık" });
      [ia, ib, is].forEach((i) => i.addEventListener("change", () => { const na = +ia.value, nb = +ib.value, ns = Math.abs(+is.value) || 1; if (nb > na && (nb - na) / ns <= 100) { a = na; b = nb; step = ns; jumps = []; paint(); } else T.toast("Aralık en fazla 100 çentik olmalı"); }));
      function snap(v) { const sub = step / (((b - a) / step) <= 20 ? 1 : 1); return Math.round(v / sub) * sub; }
      function paint() {
        svg.replaceChildren();
        svg.append(S("line", { x1: 30, y1: 240, x2: 1070, y2: 240, stroke: "#2a2a2a", "stroke-width": 5, "stroke-linecap": "round" }));
        svg.append(S("path", { d: "M1070 240l-16-10v20zM30 240l16-10v20z", fill: "#2a2a2a" }));
        const n = Math.round((b - a) / step);
        for (let i = 0; i <= n; i++) {
          const v = a + i * step, x = X(v), major = n <= 20 || i % 5 === 0;
          svg.append(S("line", { x1: x, y1: 240 - (major ? 18 : 10), x2: x, y2: 240 + (major ? 18 : 10), stroke: v === 0 ? "#e2473b" : "#2a2a2a", "stroke-width": major ? 4 : 2 }));
          if (labelsOn && major) svg.append(S("text", { x, y: 292, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 700, "font-size": n > 20 ? 20 : 26, fill: v < 0 ? "#c0392b" : "#2a2a2a" }, T.fmt(Math.round(v * 1000) / 1000)));
        }
        jumps.forEach(([p, q], k) => {
          const x1 = X(p), x2 = X(q), hgt = Math.min(150, 40 + Math.abs(x2 - x1) * 0.35);
          const col = ["#2e9bd6", "#ef5b3b", "#6cc04a", "#8a5cd0", "#f0a329"][k % 5];
          svg.append(S("path", { d: `M${x1} 228 Q ${(x1 + x2) / 2} ${228 - hgt * 1.6} ${x2} 228`, fill: "none", stroke: col, "stroke-width": 5, "stroke-linecap": "round" }));
          svg.append(S("path", { d: `M${x2} 228l${x2 > x1 ? -14 : 14} -10v16z`, fill: col }));
          const d = Math.round((q - p) * 1000) / 1000;
          svg.append(S("text", { x: (x1 + x2) / 2, y: 228 - hgt * 0.8 - 10, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 28, fill: col }, (d > 0 ? "+" : "") + T.fmt(d)));
        });
        if (from != null) svg.append(S("circle", { cx: X(from), cy: 240, r: 12, fill: "#2e9bd6", stroke: "#2a2a2a", "stroke-width": 3 }));
      }
      svg.addEventListener("pointerdown", (e) => {
        const p = T.svgPoint(svg, e.clientX, e.clientY);
        const v = T.clamp(snap(V(p.x)), a, b);
        if (from == null) { from = v; } else { if (v !== from) jumps.push([from, v]); from = jumps.length ? v : null; T.sound.pop(); }
        paint();
      });
      host.append(h("div.row", h("label.f", h("span", "Başlangıç"), ia), h("label.f", h("span", "Bitiş"), ib), h("label.f", h("span", "Çentik aralığı"), is)),
        mat, h("div.row", btn("chalk", "back", "Son atlamayı geri al", () => { jumps.pop(); from = jumps.length ? jumps[jumps.length - 1][1] : null; paint(); }),
          btn("chalk", "reset", "Temizle", () => { jumps = []; from = null; paint(); }),
          btn("chalk", "eye", "Sayıları gizle / göster", () => { labelsOn = !labelsOn; paint(); }),
          h("span.hint", "Başlangıç noktasına, sonra varış noktasına dokun. Atlamalar birbirine eklenir.")));
      paint();
    },
  });

  /* ---------- Yüzlük tablo ---------- */
  tool("yuzluk-tablo", {
    title: "Yüzlük tablo", icon: "grid100", tone: "leaf", grades: [1, 5], short: "Örüntüler, katlar, gizli sayı",
    render(host) {
      let start = 1, col = "#ffc233", marks = {}, hide = false, hidden = {};
      const grid = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "3px", background: "#2a2a2a", padding: "3px", borderRadius: "12px", boxShadow: "var(--lift)" } });
      function paint() {
        grid.replaceChildren(...Array.from({ length: 100 }, (_, i) => {
          const n = start + i;
          return h("button", { style: { aspectRatio: "1.6", border: 0, background: marks[n] || "#fff", fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(14px, 2vw, 28px)", color: "#2a2a2a", borderRadius: "4px" },
            onclick: () => { if (hide) { hidden[n] = !hidden[n]; } else { marks[n] = marks[n] === col ? null : col; T.sound.tick(); } paint(); } },
            hidden[n] ? "?" : n);
        }));
      }
      const colors = ["#ffc233", "#ef5b3b", "#6cc04a", "#2e9bd6", "#f27ba9"];
      host.append(
        h("div.row", h("div.seg", [[1, "1-100"], [0, "0-99"], [101, "101-200"]].map(([s, l]) => h("button", { "aria-pressed": String(s === start), onclick: (e) => { start = s; marks = {}; hidden = {}; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); paint(); } }, l))),
          colors.map((c) => h("button", { "aria-label": "Renk seç", onclick: () => { col = c; hide = false; }, style: { width: "44px", height: "44px", borderRadius: "50%", border: "4px solid #fff", background: c } }))),
        grid,
        h("div.row",
          h("span.hint", { style: { color: "var(--chalk)" } }, "Katlarını boya:"), [2, 3, 4, 5, 9, 10].map((k) => h("button.btn.sm.c-chalk", { onclick: () => { for (let i = 0; i < 100; i++) { const n = start + i; if (n && n % k === 0) marks[n] = col; } paint(); } }, k + "'nin")),
          btn("chalk", "eyeoff", "Gizleme modu", () => { hide = !hide; T.toast(hide ? "Saklanacak sayılara dokun" : "Boyama moduna dönüldü"); }),
          btn("chalk", "dice", "Rastgele 10 gizle", () => { hidden = {}; for (let i = 0; i < 10; i++) hidden[start + T.rand(0, 99)] = true; paint(); }),
          btn("chalk", "reset", "Temizle", () => { marks = {}; hidden = {}; paint(); })));
      paint();
    },
  });

  /* ---------- Geometri tahtası ---------- */
  tool("geometri-tahtasi", {
    title: "Geometri tahtası", icon: "geoboard", tone: "grape", grades: [2, 7], short: "Lastiklerle şekil, alan ve çevre",
    render(host) {
      let N = 9, bands = [[[1, 1], [5, 1], [5, 4], [1, 4]]], cur = 0;
      const COLS = ["#ef5b3b", "#2e9bd6", "#6cc04a", "#8a5cd0", "#f0a329"];
      const svg = S("svg", { viewBox: "0 0 600 600", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)", aspectRatio: "1", background: "#5b7f9a", margin: "0 auto", width: "auto", maxWidth: "100%" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "22px" } });
      const P = (i) => 40 + (i * 520) / (N - 1);
      function area(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += x1 * y2 - x2 * y1; } return Math.abs(s) / 2; }
      function perim(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += Math.hypot(x2 - x1, y2 - y1); } return s; }
      function paint() {
        svg.replaceChildren(S("rect", { x: 10, y: 10, width: 580, height: 580, rx: 20, fill: "#f4f0e6", stroke: "#2a2a2a", "stroke-width": 4 }));
        bands.forEach((b, k) => {
          if (b.length > 1) svg.append(S("polygon", { points: b.map(([i, j]) => P(i) + "," + P(j)).join(" "), fill: COLS[k % 5], "fill-opacity": b.length > 2 ? 0.25 : 0, stroke: COLS[k % 5], "stroke-width": 7, "stroke-linejoin": "round" }));
        });
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
          const c = S("circle", { cx: P(i), cy: P(j), r: 9, fill: "#2a2a2a", style: "cursor:pointer" });
          c.addEventListener("pointerdown", () => { const b = bands[cur]; const idx = b.findIndex(([x, y]) => x === i && y === j); if (idx >= 0) b.splice(idx, 1); else b.push([i, j]); T.sound.tick(); paint(); });
          svg.append(c);
          svg.append(S("circle", { cx: P(i), cy: P(j), r: 24, fill: "transparent", style: "cursor:pointer", onpointerdown: () => { const b = bands[cur]; const idx = b.findIndex(([x, y]) => x === i && y === j); if (idx >= 0) b.splice(idx, 1); else b.push([i, j]); T.sound.tick(); paint(); } }));
        }
        const b = bands[cur];
        out.textContent = b.length >= 3 ? `Alan: ${T.fmt(area(b))} birim kare   Çevre ≈ ${T.fmt(Math.round(perim(b) * 100) / 100)} birim   Köşe: ${b.length}` : "Çivilere sırayla dokun, lastik şekli sarar.";
      }
      host.append(h("div.row", h("div.seg", [[5, "5×5"], [9, "9×9"], [11, "11×11"]].map(([n, l]) => h("button", { "aria-pressed": String(n === N), onclick: (e) => { N = n; bands = [[]]; cur = 0; e.target.parentNode.querySelectorAll("button").forEach((bb) => bb.setAttribute("aria-pressed", String(bb === e.target))); paint(); } }, l))),
        btn("sky", "plus", "Yeni lastik", () => { bands.push([]); cur = bands.length - 1; paint(); }),
        btn("chalk", "back", "Son çiviyi çıkar", () => { bands[cur].pop(); paint(); }),
        btn("chalk", "reset", "Hepsini kaldır", () => { bands = [[]]; cur = 0; paint(); })),
        mat, out);
      paint();
    },
  });

  /* ---------- Açı ölçer ---------- */
  tool("aci", {
    title: "Açı ve iletki", icon: "ruler", tone: "tomato", grades: [3, 8], short: "Kolları sürükle, açıyı ölç",
    render(host) {
      let ang = 50, showP = true, showV = true;
      const svg = S("svg", { viewBox: "0 0 900 520", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)" } }, svg);
      const O = [450, 430], R = 340;
      const kind = (a) => a === 0 ? "Sıfır açı" : a < 90 ? "Dar açı" : a === 90 ? "Dik açı" : a < 180 ? "Geniş açı" : "Doğru açı";
      function paint() {
        svg.replaceChildren();
        if (showP) {
          svg.append(S("path", { d: `M${O[0] - R} ${O[1]} A ${R} ${R} 0 0 1 ${O[0] + R} ${O[1]} Z`, fill: "rgba(46,155,214,.12)", stroke: "#2e9bd6", "stroke-width": 3 }));
          for (let d = 0; d <= 180; d++) {
            const a = (d * Math.PI) / 180, len = d % 10 === 0 ? 28 : d % 5 === 0 ? 18 : 10;
            svg.append(S("line", { x1: O[0] + Math.cos(a) * R, y1: O[1] - Math.sin(a) * R, x2: O[0] + Math.cos(a) * (R - len), y2: O[1] - Math.sin(a) * (R - len), stroke: "#1c6e9d", "stroke-width": d % 10 ? 1 : 2 }));
            if (d % 10 === 0) svg.append(S("text", { x: O[0] + Math.cos(a) * (R - 48), y: O[1] - Math.sin(a) * (R - 48), "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 15, fill: "#1c6e9d" }, d));
          }
        }
        const a = (ang * Math.PI) / 180;
        svg.append(S("path", { d: `M${O[0]} ${O[1]} L ${O[0] + 90} ${O[1]} A 90 90 0 0 0 ${O[0] + Math.cos(a) * 90} ${O[1] - Math.sin(a) * 90} Z`, fill: "rgba(239,91,59,.25)" }));
        svg.append(S("line", { x1: O[0], y1: O[1], x2: O[0] + R + 30, y2: O[1], stroke: "#2a2a2a", "stroke-width": 7, "stroke-linecap": "round" }));
        svg.append(S("line", { x1: O[0], y1: O[1], x2: O[0] + Math.cos(a) * (R + 30), y2: O[1] - Math.sin(a) * (R + 30), stroke: "#ef5b3b", "stroke-width": 7, "stroke-linecap": "round" }));
        const hd = S("circle", { cx: O[0] + Math.cos(a) * (R + 30), cy: O[1] - Math.sin(a) * (R + 30), r: 22, fill: "#ef5b3b", stroke: "#2a2a2a", "stroke-width": 3, style: "cursor:grab" });
        svg.append(hd, S("circle", { cx: O[0], cy: O[1], r: 8, fill: "#2a2a2a" }));
        if (showV) svg.append(S("text", { x: 40, y: 60, "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 46, fill: "#2a2a2a" }, ang + "°  " + kind(ang)));
      }
      let drag = false;
      svg.addEventListener("pointerdown", (e) => { drag = true; svg.setPointerCapture(e.pointerId); mv(e); });
      svg.addEventListener("pointermove", (e) => drag && mv(e));
      svg.addEventListener("pointerup", () => (drag = false));
      function mv(e) { const p = T.svgPoint(svg, e.clientX, e.clientY); let d = (Math.atan2(O[1] - p.y, p.x - O[0]) * 180) / Math.PI; if (d < -90) d = 180; ang = T.clamp(Math.round(d), 0, 180); paint(); }
      host.append(mat, h("div.row",
        btn("chalk", "eye", "İletkiyi gizle / göster", () => { showP = !showP; paint(); }),
        btn("chalk", "eyeoff", "Ölçüyü gizle / göster", () => { showV = !showV; paint(); }),
        btn("tomato", "dice", "Rastgele açı", () => { ang = T.rand(5, 175); paint(); }),
        h("span.hint", "Ölçüyü gizleyip önce tahmin ettirin: dik açıdan büyük mü küçük mü?")));
      paint();
    },
  });

  /* ---------- Saat ---------- */
  const SAAT_I = ["on ikiyi", "biri", "ikiyi", "üçü", "dördü", "beşi", "altıyı", "yediyi", "sekizi", "dokuzu", "onu", "on biri", "on ikiyi"];
  const SAAT_E = ["on ikiye", "bire", "ikiye", "üçe", "dörde", "beşe", "altıya", "yediye", "sekize", "dokuza", "ona", "on bire", "on ikiye"];
  const SAAT_Y = ["on iki", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on", "on bir", "on iki"];
  T.saatOku = function (hh, mm) {
    const h12 = hh % 12;
    const dk = (n) => (n === 15 ? "çeyrek" : T.sayiOku(n));
    if (mm === 0) return `Saat ${SAAT_Y[h12]}.`;
    if (mm === 30) return h12 === 0 ? "Saat yarım." : `Saat ${SAAT_Y[h12]} buçuk.`;
    if (mm < 30) return `Saat ${SAAT_I[h12]} ${dk(mm)} geçiyor.`;
    return `Saat ${SAAT_E[(h12 + 1) % 12]} ${dk(60 - mm)} var.`;
  };
  tool("saat", {
    title: "Öğretim saati", icon: "clock", tone: "sky", grades: [1, 4], short: "Akrep ve yelkovanı sürükle, Türkçe okunuş",
    render(host) {
      let t = 3 * 60 + 15, snap = 5, h24 = false, showDig = true, showRead = true;
      const svg = S("svg", { viewBox: "0 0 520 520", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(240px, .8fr)", alignItems: "center" } });
      const side = h("div", { style: { padding: "20px", display: "grid", gap: "12px" } });
      mat.append(h("div", { style: { height: "var(--stage-h)", minHeight: 0 } }, svg), side);
      function paint() {
        const hh = Math.floor(t / 60) % 24, mm = t % 60;
        T.m3kur && T.m3kur(); svg.replaceChildren(S("circle", { cx: 260, cy: 266, r: 250, fill: "rgba(40,25,10,.25)", filter: "url(#m3-golge)" }), S("circle", { cx: 260, cy: 260, r: 252, fill: "url(#m3-halka)" }), S("circle", { cx: 260, cy: 260, r: 232, fill: "url(#m3-kadran)", filter: "url(#m3-ic)" }));
        for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30; svg.append(S("line", { x1: 260 + 222 * Math.sin(a), y1: 260 - 222 * Math.cos(a), x2: 260 + (i % 5 ? 210 : 196) * Math.sin(a), y2: 260 - (i % 5 ? 210 : 196) * Math.cos(a), stroke: "#2a2a2a", "stroke-width": i % 5 ? 2 : 5 })); }
        for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6; svg.append(S("text", { x: 260 + 165 * Math.sin(a), y: 262 - 165 * Math.cos(a), "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 44, fill: "#2a2a2a" }, i));
          if (h24) svg.append(S("text", { x: 260 + 122 * Math.sin(a), y: 262 - 122 * Math.cos(a), "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 18, fill: "#2e9bd6" }, i + 12 === 24 ? "00" : i + 12)); }
        const ma = (mm * Math.PI) / 30, ha = (((hh % 12) + mm / 60) * Math.PI) / 6;
        svg.append(S("line", { x1: 260, y1: 260, x2: 260 + 120 * Math.sin(ha), y2: 260 - 120 * Math.cos(ha), stroke: "#ef5b3b", "stroke-width": 16, "stroke-linecap": "round", "data-hand": "h", filter: "url(#m3-golge-k)", style: "cursor:grab" }));
        svg.append(S("line", { x1: 260, y1: 260, x2: 260 + 190 * Math.sin(ma), y2: 260 - 190 * Math.cos(ma), stroke: "#2e9bd6", "stroke-width": 11, "stroke-linecap": "round", "data-hand": "m", filter: "url(#m3-golge-k)", style: "cursor:grab" }));
        svg.append(S("circle", { cx: 260, cy: 260, r: 16, fill: "url(#m3-metal)", stroke: "#3a3a3a", "stroke-width": 2 }), S("path", { d: "M 70 200 A 200 200 0 0 1 330 50 A 230 230 0 0 0 90 260 Z", fill: "url(#m3-cam)", "pointer-events": "none" }));
        side.replaceChildren(
          showDig ? h("div", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "72px", lineHeight: 1 } }, `${T.pad(h24 ? hh : hh % 12 || 12)}:${T.pad(mm)}`) : null,
          showRead ? h("div", { style: { fontSize: "26px", fontWeight: 600 } }, T.saatOku(hh, mm)) : null,
          h("div.hint", "Kırmızı akrep, mavi yelkovan. Yelkovanı çevirince akrep de ilerler."),
          h("div.row", h("button.btn.c-sky", { onclick: () => T.speak(T.saatOku(hh, mm)) }, T.icon("speaker"), "Oku")));
      }
      let which = null, lastAng = null;
      svg.addEventListener("pointerdown", (e) => { which = e.target.dataset.hand || "m"; svg.setPointerCapture(e.pointerId); lastAng = null; mv(e); });
      svg.addEventListener("pointermove", (e) => which && mv(e));
      svg.addEventListener("pointerup", () => { which = null; t = Math.round(t / snap) * snap; paint(); });
      function mv(e) {
        const p = T.svgPoint(svg, e.clientX, e.clientY);
        let a = Math.atan2(p.x - 260, 260 - p.y); if (a < 0) a += 2 * Math.PI;
        if (which === "m") {
          const m = Math.round((a / (2 * Math.PI)) * 60) % 60, curM = t % 60;
          let diff = m - curM; if (diff > 30) diff -= 60; if (diff < -30) diff += 60;
          t = (t + diff + 1440) % 1440;
        } else {
          const tot12 = Math.round((a / (2 * Math.PI)) * 720) % 720, base = t >= 720 ? 720 : 0;
          t = (base + tot12) % 1440;
        }
        paint();
      }
      host.append(mat, h("div.row",
        h("div.seg", [[1, "Dakika dakika"], [5, "5 dakika"], [15, "Çeyrek"], [30, "Yarım"]].map(([v, l]) => h("button", { "aria-pressed": String(v === snap), onclick: (e) => { snap = v; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); } }, l))),
        btn("sky", "dice", "Rastgele saat", () => { t = T.rand(0, 1439); t = Math.round(t / snap) * snap; paint(); }),
        btn("chalk", "eye", "Dijitali gizle / göster", () => { showDig = !showDig; paint(); }),
        btn("chalk", "talk", "Okunuşu gizle / göster", () => { showRead = !showRead; paint(); }),
        btn("chalk", "clock", "24 saat", () => { h24 = !h24; paint(); })));
      paint();
    },
  });

  /* ---------- Para ---------- */
  tool("para", {
    title: "Paralarımız", icon: "money", tone: "leaf", grades: [1, 4], short: "Madeni para ve banknotlarla toplam",
    render(host) {
      T.Tuval(host, {
        palettes: [{ items: ["k1", "k5", "k10", "k25", "k50", "k100", "b5", "b10", "b20", "b50", "b100", "b200"] }],
        readout: (ps) => "Toplam: " + T.money(ps.reduce((a, p) => a + (T.pieceTypes[p.type].value || 0), 0)),
      });
      host.append(h("p.hint", "Paralar öğretim amaçlı sadeleştirilmiş çizimlerdir. Bir fiyat söyleyin, öğrenciler farklı yollarla o tutarı oluştursun."));
    },
  });

  /* ---------- Örüntü blokları ---------- */
  tool("oruntu", {
    title: "Örüntü blokları", icon: "pattern", tone: "sun", grades: [1, 6], short: "Altıgen, yamuk, üçgen... döndür, birleştir",
    render(host) {
      T.Tuval(host, { palettes: [{ items: ["altigen", "yamuk", "esk", "ince", "kare", "ucgen"] }], snap: 2,
        readout: (ps) => { const c = {}; ps.forEach((p) => (c[T.pieceTypes[p.type].label] = (c[T.pieceTypes[p.type].label] || 0) + 1)); return Object.entries(c).map(([k, v]) => v + " " + k.toLocaleLowerCase("tr-TR")).join(", "); } });
      host.append(h("p.hint", "Bir altıgeni kaç üçgen kaplar? Kaç yamuk? Bu, kesirlere hazırlıktır: üçgen altıgenin 1/6'sıdır."));
    },
  });

  /* ---------- Tangram ---------- */
  tool("tangram", {
    title: "Tangram", icon: "tangram", tone: "tomato", grades: [1, 7], short: "Yedi parça, bir kare",
    render(host) {
      let target = "kare";
      const TG = { kare: "M780 160h300v300H780z", ucgen: "M740 480h424L740 56z", ev: "M820 500V300l140-140 140 140v200z" };
      const tv = T.Tuval(host, {
        palettes: [{ items: ["tb1", "tb2", "tm", "ts1", "ts2", "tsq", "tpar"] }], snap: 2,
        background: () => { const g = S("g", { id: "tg-target" }); return g; },
      });
      const paintTarget = () => { const g = tv.svg.querySelector("#tg-target"); g.replaceChildren(S("path", { d: TG[target], fill: "rgba(0,0,0,.07)", stroke: "rgba(0,0,0,.35)", "stroke-width": 3, "stroke-dasharray": "10 8" })); };
      tv.set([
        { type: "tb1", x: 160, y: 140 }, { type: "tb2", x: 140, y: 380 }, { type: "tm", x: 420, y: 520 },
        { type: "ts1", x: 420, y: 140 }, { type: "ts2", x: 560, y: 300 }, { type: "tsq", x: 400, y: 330 }, { type: "tpar", x: 220, y: 580 },
      ]);
      host.append(h("div.row", h("span.hint", { style: { color: "var(--chalk)" } }, "Hedef şekil:"),
        h("div.seg", [["kare", "Kare"], ["ucgen", "Üçgen"], ["ev", "Ev"]].map(([k, l]) => h("button", { "aria-pressed": String(k === target), onclick: (e) => { target = k; e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); paintTarget(); } }, l))),
        h("span.hint", "Parçayı seçip Döndür ile 45° çevir. Paralelkenarı Çevir ile ters yüz et.")));
      paintTarget();
    },
  });

  /* ---------- Serbest tuval ---------- */
  T.tools["serbest"] = {
    cat: "tuval", title: "Serbest manipülatif tuvali", icon: "canvas", tone: "grape", grades: [1, 8], short: "Bütün parçalar tek tuvalde",
    render(host) {
      T.Tuval(host, {
        palettes: [{ items: ["s-kare", "s-dikdortgen", "s-daire", "s-ucgen", "s-dik", "s-besgen", "s-yildiz", "s-cizgi", "s-ok", "not", "birlik", "onluk", "yuzluk", "pul", "arti", "eksi", "f2", "f3", "f4", "altigen", "yamuk", "esk", "x2", "x", "bir", "k25", "k100", "b10"] }],
        grid: true, matHeight: "var(--stage-h)",
      });
      host.append(h("p.hint", "Not kartına iki kez dokunup sayı ya da kelime yazabilirsin. Parçayı çöpe sürükleyerek silersin."));
    },
  };
  tool("sekiller", {
    title: "Şekil tuvali", icon: "pattern", tone: "sky", grades: [1, 8], short: "Kare, daire, üçgen... boyutlandır, renklendir",
    render(host) {
      T.Tuval(host, { palettes: [{ items: ["s-kare", "s-dikdortgen", "s-daire", "s-ucgen", "s-dik", "s-besgen", "s-yildiz", "s-cizgi", "s-ok", "not"] }], grid: true, snap: 5,
        initial: [{ type: "s-kare", x: 300, y: 300 }, { type: "s-daire", x: 520, y: 300, sx: 1.4, sy: 1.4 }, { type: "s-ucgen", x: 760, y: 300 }] });
    },
  });
  T.tools["serbest-kareli"] = {
    cat: "tuval", title: "Kareli tuval: sayılar ve şekiller", icon: "grid100", tone: "sky", grades: [1, 8], short: "Not kartları, pullar ve şekillerle düşünme alanı",
    render(host) {
      T.Tuval(host, { palettes: [{ items: ["not", "pul", "kare", "ucgen", "altigen", "f2", "f4", "onluk", "birlik"] }], grid: true, snap: 15, matHeight: "var(--stage-h)" });
    },
  };
})();
