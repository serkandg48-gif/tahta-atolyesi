/* Simülasyonlar: terazi, market, kumbara, yol-hız-zaman, tarif, indirim, olasılık, alan-çevre */
(function () {
  const { h } = T; const S = T.svg;
  const tool = (id, def) => (T.tools[id] = Object.assign({ cat: "sim" }, def));
  const btn = (tone, icon, label, onclick) => h("button.btn.c-" + tone, { onclick }, icon ? T.icon(icon) : null, label);
  const seg = (opts, cur, on) => h("div.seg", opts.map(([v, l]) => h("button", { "aria-pressed": String(v === cur), onclick: (e) => { e.target.parentNode.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.target))); on(v); } }, l)));

  /* ---------- Terazi ve denklem ---------- */
  tool("terazi", {
    title: "Eşitlik terazisi", icon: "scale", tone: "sky", grades: [1, 8], short: "Kefeleri dengele, bilinmeyeni bul",
    render(host) {
      const g = T.store.grade();
      let mode = g >= 6 ? "denklem" : "esitlik";
      let L = [], R = [], xVal = T.rand(2, 9), revealX = false;
      const WTS = [1, 2, 5, 10];
      const svg = S("svg", { viewBox: "0 0 1000 560", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)" } }, svg);
      const ctrls = h("div.row");
      const out = h("div.readout", { style: { color: "var(--chalk)" } });
      const val = (side) => side.reduce((a, it) => a + (it === "x" ? xVal : it), 0);
      const expr = (side) => {
        const xs = side.filter((i) => i === "x").length, n = side.filter((i) => i !== "x").reduce((a, b) => a + b, 0);
        const parts = []; if (xs) parts.push((xs > 1 ? xs : "") + "x"); if (n || !xs) parts.push(n);
        return parts.join(" + ");
      };
      function newProblem() {
        if (mode === "esitlik") { L = [T.rand(1, 9), T.rand(1, 9)]; R = [T.rand(2, 10)]; }
        else { xVal = T.rand(1, g >= 7 ? 12 : 8); const k = T.rand(1, g >= 7 ? 3 : 2), c = T.rand(0, 9); L = Array(k).fill("x").concat(c ? [c] : []); const tot = k * xVal + c; R = []; let r = tot; while (r >= 10) { R.push(10); r -= 10; } while (r >= 5) { R.push(5); r -= 5; } while (r > 0) { R.push(1); r--; } }
        revealX = false; paint();
      }
      function paint() {
        const lv = val(L), rv = val(R), diff = T.clamp(rv - lv, -12, 12), tilt = diff * 1.6;
        svg.replaceChildren();
        T.m3kur(); svg.append(S("ellipse", { cx: 500, cy: 548, rx: 150, ry: 10, fill: "rgba(40,25,10,.25)" }), S("path", { d: "M420 545h160l-36-48h-88z", fill: "url(#m3-ahsap-koyu)", filter: "url(#m3-golge-k)" }));
        svg.append(S("rect", { x: 488, y: 170, width: 24, height: 330, fill: T.m3d("#C9A052"), stroke: "rgba(80,55,10,.5)", "stroke-width": 1.5 }));
        const beam = S("g", { transform: `rotate(${tilt} 500 170)` });
        beam.append(S("rect", { x: 110, y: 160, width: 780, height: 20, rx: 10, fill: T.m3d("#D4AC5A"), stroke: "rgba(80,55,10,.55)", "stroke-width": 1.5, filter: "url(#m3-golge-k)" }));
        beam.append(S("circle", { cx: 500, cy: 170, r: 16, fill: T.m3("#E8C060") }));
        svg.append(beam);
        const pan = (cx, items, side) => {
          const rad = (tilt * Math.PI) / 180, px = 500 + (cx - 500) * Math.cos(rad), py = 170 + (cx - 500) * Math.sin(rad);
          const gg = S("g", { transform: `translate(${px},${py})` });
          gg.append(S("path", { d: "M0 0L-120 170M0 0L120 170", stroke: "#8A7A5A", "stroke-width": 2.5, "stroke-dasharray": "5 2" }));
          gg.append(S("path", { d: "M-160 170h320a160 40 0 0 1-320 0z", fill: T.m3d("#D9B867"), stroke: "rgba(90,60,10,.5)", "stroke-width": 1.5, filter: "url(#m3-golge-k)" }));
          let x = -140, y = 150;
          items.forEach((it, i) => {
            const w = it === "x" ? 62 : it === 10 ? 58 : it === 5 ? 50 : it === 2 ? 42 : 36;
            if (x + w > 150) { x = -140; y -= 62; }
            const box = S("g", { transform: `translate(${x},${y - w})`, style: "cursor:pointer" });
            if (it === "x") { box.append(S("rect", { width: w, height: w, rx: 8, fill: T.m3d("#8a5cd0"), stroke: "rgba(0,0,0,.35)", "stroke-width": 1.5, filter: "url(#m3-golge-k)" })); box.append(S("text", { x: w / 2, y: w / 2, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 34, fill: "#fff" }, revealX ? xVal : "x")); }
            else { box.append(S("path", { d: `M${w * 0.2} 0h${w * 0.6}l${w * 0.2} ${w}h${-w}z`, fill: "url(#m3-metal)", stroke: "#4A525C", "stroke-width": 1.5, filter: "url(#m3-golge-k)" })); box.append(S("text", { x: w / 2, y: w * 0.62, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 24, fill: "#fff" }, it)); }
            box.addEventListener("click", () => { items.splice(i, 1); T.sound.tick(); paint(); });
            gg.append(box); x += w + 8;
          });
          return gg;
        };
        svg.append(pan(220, L, "L"), pan(780, R, "R"));
        const st = lv === rv ? "Denge" : lv > rv ? "Sol ağır" : "Sağ ağır";
        svg.append(S("text", { x: 500, y: 60, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 44, fill: lv === rv ? "#3fae5a" : "#2a2a2a" }, `${expr(L)}  ${lv === rv ? "=" : lv > rv ? ">" : "<"}  ${expr(R)}`));
        out.textContent = st;
        ctrls.replaceChildren(
          h("span.hint", { style: { color: "var(--chalk)" } }, "Sola ekle:"), ...WTS.map((w) => h("button.btn.sm.c-chalk", { onclick: () => { L.push(w); T.sound.pop(); paint(); } }, w)),
          mode === "denklem" ? h("button.btn.sm.c-grape", { onclick: () => { L.push("x"); paint(); } }, "x") : null,
          h("span.hint", { style: { color: "var(--chalk)", marginLeft: "14px" } }, "Sağa ekle:"), ...WTS.map((w) => h("button.btn.sm.c-chalk", { onclick: () => { R.push(w); T.sound.pop(); paint(); } }, w)),
          mode === "denklem" ? h("button.btn.sm.c-grape", { onclick: () => { R.push("x"); paint(); } }, "x") : null);
      }
      host.append(h("div.row", seg([["esitlik", "Eşitlik (ilkokul)"], ["denklem", "Denklem (ortaokul)"]], mode, (v) => { mode = v; newProblem(); }),
        btn("sky", "dice", "Yeni soru", newProblem),
        btn("chalk", "eye", "x'i göster / gizle", () => { revealX = !revealX; paint(); }), out),
        mat, ctrls,
        h("p.hint", "Kefedeki bir ağırlığa dokununca kalkar. Denklemde iki taraftan aynı şeyi çıkararak x'i yalnız bırakın: terazi dengede kalmalı."));
      newProblem();
    },
  });

  /* ---------- Market ---------- */
  const URUNLER = [["Ekmek", 15, "🍞"], ["Süt", 32.5, "🥛"], ["Elma (kg)", 40, "🍎"], ["Peynir", 95, "🧀"], ["Defter", 27.5, "📒"], ["Kalem", 12.75, "✏️"], ["Muz (kg)", 65, "🍌"], ["Yumurta (10'lu)", 58, "🥚"], ["Silgi", 8.5, "🧽"], ["Su", 7.25, "💧"], ["Simit", 17.5, "🥨"], ["Ayran", 14, "🥤"]];
  tool("market", {
    title: "Sınıf marketi", icon: "cart", tone: "tomato", grades: [2, 6], short: "Alışveriş, bütçe, para üstü",
    render(host) {
      const g = T.store.grade();
      let budget = g <= 2 ? 50 : g <= 4 ? 200 : 500, cart = {}, round = g <= 3;
      const items = URUNLER.map(([n, p, e]) => ({ n, p: round ? Math.round(p) : p, e }));
      const shelf = h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" } });
      const receipt = h("div.paper.m-fis", { style: { padding: "16px 18px", display: "grid", gap: "8px", alignContent: "start", fontFamily: "var(--hand)", fontSize: "21px", background: "#fffef8", borderRadius: "6px" } });
      function paint() {
        shelf.replaceChildren(...items.map((it) => h("button.paper.m-kart", { style: { border: 0, padding: "14px 10px", display: "grid", justifyItems: "center", gap: "4px", cursor: "pointer" }, onclick: () => { cart[it.n] = (cart[it.n] || 0) + 1; T.sound.pop(); paint(); } },
          h("span", { style: { fontSize: "48px", lineHeight: 1 } }, it.e), h("b", it.n), h("span.readout", { style: { fontSize: "22px" } }, T.money(it.p)))));
        const lines = Object.entries(cart).filter(([, q]) => q > 0);
        const total = lines.reduce((a, [n, q]) => a + q * items.find((i) => i.n === n).p, 0);
        const left = budget - total;
        receipt.replaceChildren(
          h("div", { style: { fontFamily: "var(--display)", fontWeight: 800, fontSize: "22px" } }, "Fiş"),
          ...lines.map(([n, q]) => { const it = items.find((i) => i.n === n); return h("div", { style: { display: "flex", gap: "8px", alignItems: "center" } }, h("span", { style: { flex: 1 } }, `${q} × ${n}`), h("span", T.money(q * it.p)), h("button.btn.sm.icon.c-chalk", { "aria-label": n + " çıkar", onclick: () => { cart[n]--; paint(); } }, T.icon("minus"))); }),
          h("hr", { style: { border: 0, borderTop: "2px dashed #999", width: "100%" } }),
          h("div", { style: { display: "flex" } }, h("span", { style: { flex: 1 } }, "Toplam"), h("b", T.money(total))),
          h("div", { style: { display: "flex" } }, h("span", { style: { flex: 1 } }, "Bütçe"), h("span", T.money(budget))),
          h("div", { style: { display: "flex", color: left < 0 ? "#c0392b" : "#1e6b33" } }, h("span", { style: { flex: 1 } }, left < 0 ? "Eksik" : "Para üstü"), h("b", T.money(Math.abs(left)))));
      }
      host.append(h("div.row", h("span.hint", { style: { color: "var(--chalk)" } }, "Bütçe:"), seg([[50, "50 TL"], [100, "100 TL"], [200, "200 TL"], [500, "500 TL"]], budget, (v) => { budget = v; paint(); }),
        seg([[true, "Tam sayı fiyatlar"], [false, "Kuruşlu fiyatlar"]], round, (v) => { round = v; items.forEach((it, i) => (it.p = v ? Math.round(URUNLER[i][1]) : URUNLER[i][1])); paint(); }),
        btn("chalk", "reset", "Sepeti boşalt", () => { cart = {}; paint(); }),
        btn("chalk", "dice", "Görev ver", () => { const a = T.pick(items), b = T.pick(items); T.modal({ title: "Alışveriş görevi", body: h("p", { style: { fontSize: "22px" } }, `${T.money(budget)} ile 2 ${a.n.replace(/ \(.*\)/, "")} ve 1 ${b.n.replace(/ \(.*\)/, "")} alınca ne kadar para üstü kalır? Önce tahmin edin, sonra sepete koyup kontrol edin.`), actions: [{ label: "Tamam" }] }); })),
        h("div", { style: { display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(260px,1fr)", gap: "18px", alignItems: "start" } }, shelf, receipt));
      paint();
    },
  });

  /* ---------- Kumbara ---------- */
  tool("kumbara", {
    title: "Kumbara", icon: "piggy", tone: "pink", grades: [2, 7], short: "Haftalık birikim, hedef, grafik",
    render(host) {
      let weekly = 20, start = 0, goal = 300, rate = 0;
      const svg = S("svg", { viewBox: "0 0 1000 420", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "440px" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "24px" } });
      const inp = (v, on, lbl, step = 1) => { const i = h("input.in", { type: "number", value: v, step, min: 0, style: { width: "120px" }, "aria-label": lbl }); i.addEventListener("input", () => { on(+i.value || 0); paint(); }); return h("label.f", h("span", lbl), i); };
      function paint() {
        const weeks = []; let m = start; let reach = null;
        for (let w = 0; w <= 26; w++) { weeks.push(m); if (reach == null && m >= goal) reach = w; m = m * (1 + rate / 100) + weekly; }
        const max = Math.max(goal * 1.15, weeks[weeks.length - 1]);
        svg.replaceChildren();
        const X = (w) => 70 + w * 34, Y = (v) => 380 - (v / max) * 340;
        for (let k = 0; k <= 4; k++) { const v = (max / 4) * k; svg.append(S("line", { x1: 60, y1: Y(v), x2: 970, y2: Y(v), stroke: "rgba(0,0,0,.08)" })); svg.append(S("text", { x: 52, y: Y(v), "text-anchor": "end", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 14, fill: "#55625b" }, Math.round(v))); }
        svg.append(S("line", { x1: 60, y1: Y(goal), x2: 970, y2: Y(goal), stroke: "#e2473b", "stroke-width": 3, "stroke-dasharray": "10 8" }));
        svg.append(S("text", { x: 966, y: Y(goal) - 10, "text-anchor": "end", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 20, fill: "#e2473b" }, "Hedef " + goal + " TL"));
        weeks.forEach((v, w) => { svg.append(S("rect", { x: X(w) - 12, y: Y(v), width: 24, height: 380 - Y(v), rx: 4, fill: reach != null && w >= reach ? "#6cc04a" : "#f27ba9" })); if (w % 4 === 0) svg.append(S("text", { x: X(w), y: 402, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 14, fill: "#55625b" }, w + ". hf")); });
        out.textContent = reach != null ? `Hedefe ${reach}. haftada ulaşılıyor.` : "26 haftada hedefe ulaşılmıyor. Haftalık tutarı artırmayı dene.";
      }
      host.append(h("div.row", inp(start, (v) => (start = v), "Başlangıç (TL)"), inp(weekly, (v) => (weekly = v), "Her hafta (TL)"), inp(goal, (v) => (goal = v), "Hedef (TL)"),
        T.store.grade() >= 6 ? inp(rate, (v) => (rate = v), "Haftalık faiz (%)", 0.5) : null), mat, out,
        h("p.hint", "Grafikteki her sütun bir haftanın sonundaki birikimdir. Hedefe ulaşılan haftadan sonra sütunlar yeşile döner."));
      paint();
    },
  });

  /* ---------- Yol, hız, zaman ---------- */
  tool("yol-hiz", {
    title: "Yol, hız, zaman", icon: "car", tone: "sky", grades: [4, 8], short: "İki aracın yarışı, kim önce varır?",
    render(host) {
      let dist = 120, v1 = 60, v2 = 80, t = 0, run = false, raf = 0, last = 0;
      const svg = S("svg", { viewBox: "0 0 1000 300", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "320px", background: "#e9efe3" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "22px" } });
      const inp = (v, on, lbl) => { const i = h("input.in", { type: "number", value: v, min: 1, style: { width: "110px" }, "aria-label": lbl }); i.addEventListener("input", () => { on(Math.max(1, +i.value || 1)); t = 0; paint(); }); return h("label.f", h("span", lbl), i); };
      const car = (col) => S("g", {}, S("path", { d: "M-40 -10l10-18h40l14 18h16v18h-80z", fill: col, stroke: "#2a2a2a", "stroke-width": 3 }), S("circle", { cx: -22, cy: 10, r: 9, fill: "#2a2a2a" }), S("circle", { cx: 22, cy: 10, r: 9, fill: "#2a2a2a" }));
      function paint() {
        svg.replaceChildren();
        [90, 210].forEach((y) => { svg.append(S("rect", { x: 40, y: y - 36, width: 900, height: 72, fill: "#5d6d7a" })); svg.append(S("line", { x1: 40, y1: y, x2: 940, y2: y, stroke: "#fff", "stroke-width": 3, "stroke-dasharray": "20 18" })); });
        svg.append(S("rect", { x: 930, y: 40, width: 14, height: 220, fill: "url(#fin)" }));
        svg.insertAdjacentHTML("afterbegin", '<defs><pattern id="fin" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#000"/><rect x="7" y="7" width="7" height="7" fill="#000"/><rect x="7" width="7" height="7" fill="#fff"/><rect y="7" width="7" height="7" fill="#fff"/></pattern></defs>');
        for (let k = 0; k <= 4; k++) svg.append(S("text", { x: 40 + k * 225, y: 290, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 16, fill: "#2a2a2a" }, Math.round((dist / 4) * k) + " km"));
        const p1 = Math.min(1, (v1 * t) / dist), p2 = Math.min(1, (v2 * t) / dist);
        const c1 = car("#ef5b3b"); c1.setAttribute("transform", `translate(${80 + p1 * 840},${92})`);
        const c2 = car("#ffc233"); c2.setAttribute("transform", `translate(${80 + p2 * 840},${212})`);
        svg.append(c1, c2);
        const mins = Math.round(t * 60);
        out.textContent = `Geçen süre: ${Math.floor(mins / 60)} sa ${mins % 60} dk   Kırmızı: ${Math.round(Math.min(dist, v1 * t))} km   Sarı: ${Math.round(Math.min(dist, v2 * t))} km`;
        if (p1 >= 1 && p2 >= 1) stop();
      }
      function loop(ts) { if (!run) return; if (last) t += ((ts - last) / 1000) * (dist / Math.max(v1, v2)) / 6; last = ts; paint(); raf = requestAnimationFrame(loop); }
      function stop() { run = false; cancelAnimationFrame(raf); last = 0; }
      host.append(h("div.row", inp(dist, (v) => (dist = v), "Yol (km)"), inp(v1, (v) => (v1 = v), "Kırmızı hız (km/sa)"), inp(v2, (v) => (v2 = v), "Sarı hız (km/sa)"),
        btn("leaf", "play", "Başlat", () => { if (run) return; if (Math.min(1, (v1 * t) / dist) >= 1 && Math.min(1, (v2 * t) / dist) >= 1) t = 0; run = true; raf = requestAnimationFrame(loop); }),
        btn("chalk", "pause", "Durdur", stop), btn("chalk", "reset", "Başa al", () => { stop(); t = 0; paint(); })),
        mat, out, h("p.hint", "Başlatmadan önce sorun: Sarı araç vardığında kırmızı nerede olur? Kaç dakika sonra varır? Sonra simülasyonla kontrol edin."));
      paint(); T.onLeave(stop);
    },
  });

  /* ---------- Tarif ölçekleme ---------- */
  tool("tarif", {
    title: "Tarif ölçekleme", icon: "recipe", tone: "sun", grades: [3, 7], short: "Kişi sayısına göre malzeme, kesirler",
    render(host) {
      const base = 4;
      const ing = [["Un", 2, "su bardağı"], ["Süt", 1.5, "su bardağı"], ["Yumurta", 2, "adet"], ["Şeker", 0.5, "su bardağı"], ["Kabartma tozu", 1, "paket"], ["Tereyağı", 0.25, "paket"]];
      let people = 6;
      const tbl = h("div.paper.m-defter", { style: { padding: "18px 22px" } });
      const frac = (x) => {
        const w = Math.floor(x + 1e-9), r = x - w;
        const fr = [[0, ""], [0.25, "1/4"], [1 / 3, "1/3"], [0.5, "1/2"], [2 / 3, "2/3"], [0.75, "3/4"], [1, ""]];
        let best = fr[0], bd = 9; fr.forEach((f) => { const d = Math.abs(f[0] - r); if (d < bd) { bd = d; best = f; } });
        const ww = best[0] === 1 ? w + 1 : w;
        const s = (ww ? ww + " " : "") + best[1];
        return (s.trim() || "0") + (bd > 0.04 ? " (yaklaşık)" : "");
      };
      function paint() {
        const k = people / base;
        tbl.replaceChildren(
          h("h3", { style: { fontSize: "22px", marginBottom: "6px" } }, `Kek: ${base} kişilik tarif → ${people} kişi (${T.fmt(Math.round(k * 100) / 100)} katı)`),
          h("table.table", h("thead", h("tr", h("th", "Malzeme"), h("th", base + " kişi"), h("th", people + " kişi"))),
            h("tbody", ing.map(([n, q, u]) => h("tr", h("td", n), h("td", frac(q) + " " + u), h("td", h("b", frac(q * k) + " " + u)))))));
      }
      const sl = h("input", { type: "range", min: 1, max: 24, value: people, "aria-label": "Kişi sayısı", oninput: (e) => { people = +e.target.value; lbl.textContent = people + " kişi"; paint(); } });
      const lbl = h("span.readout", { style: { color: "var(--chalk)" } }, people + " kişi");
      host.append(h("div.row", h("div", { style: { flex: 1, minWidth: "240px" } }, sl), lbl), tbl,
        h("p.hint", "Kaydırmadan önce sorun: 2 kişi için ne kadar un gerekir? 6 kişi için? Kesirlerin toplamını şeritlerle de gösterebilirsiniz."));
      paint();
    },
  });

  /* ---------- İndirim ve yüzde ---------- */
  tool("indirim", {
    title: "İndirim ve yüzde", icon: "percent", tone: "grape", grades: [5, 8], short: "Şerit modeliyle yüzde",
    render(host) {
      let price = 400, pct = 25;
      const svg = S("svg", { viewBox: "0 0 1000 260", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "280px" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "24px" } });
      function paint() {
        svg.replaceChildren();
        const w = 880, x0 = 60, cut = (w * pct) / 100;
        for (let i = 0; i < 10; i++) svg.append(S("rect", { x: x0 + (i * w) / 10, y: 70, width: w / 10, height: 90, fill: (i + 1) * 10 <= pct ? "#f27ba9" : "#fff", stroke: "#2a2a2a", "stroke-width": 2 }));
        if (pct % 10) svg.append(S("rect", { x: x0 + Math.floor(pct / 10) * (w / 10), y: 70, width: ((pct % 10) / 10) * (w / 10), height: 90, fill: "#f27ba9", stroke: "none" }));
        svg.append(S("rect", { x: x0, y: 70, width: w, height: 90, fill: "none", stroke: "#2a2a2a", "stroke-width": 5 }));
        for (let i = 0; i <= 10; i++) svg.append(S("text", { x: x0 + (i * w) / 10, y: 60, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 15, fill: "#55625b" }, "%" + i * 10));
        svg.append(S("path", { d: `M${x0} 180v20h${cut}v-20`, fill: "none", stroke: "#c0392b", "stroke-width": 3 }));
        svg.append(S("text", { x: x0 + cut / 2, y: 232, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 26, fill: "#c0392b" }, "İndirim " + T.money((price * pct) / 100)));
        svg.append(S("text", { x: x0 + cut + (w - cut) / 2, y: 232, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 26, fill: "#1e6b33" }, "Ödenen " + T.money(price - (price * pct) / 100)));
        out.textContent = `${T.money(price)} fiyatın %${pct}'i = ${T.money((price * pct) / 100)}`;
      }
      const pi = h("input.in", { type: "number", value: price, min: 1, style: { width: "130px" }, "aria-label": "Fiyat" });
      pi.addEventListener("input", () => { price = Math.max(1, +pi.value || 1); paint(); });
      const sl = h("input", { type: "range", min: 0, max: 100, value: pct, "aria-label": "İndirim yüzdesi", oninput: (e) => { pct = +e.target.value; pl.textContent = "%" + pct; paint(); } });
      const pl = h("span.readout", { style: { color: "var(--chalk)" } }, "%" + pct);
      host.append(h("div.row", h("label.f", h("span", "Etiket fiyatı (TL)"), pi), h("div", { style: { flex: 1, minWidth: "220px" } }, sl), pl), mat, out,
        h("p.hint", "Önce %10'u bulun, sonra %25 ve %75'e ondan ulaşın. Şerit her zaman bütünün 100 eşit parçasıdır."));
      paint();
    },
  });

  /* ---------- Olasılık deneyi ---------- */
  tool("olasilik", {
    title: "Olasılık deneyi", icon: "coinflip", tone: "leaf", grades: [3, 8], short: "Zar, para, çark; deneysel ve teorik",
    render(host) {
      let kind = "zar", counts = {}, n = 0;
      const K = { zar: ["1", "2", "3", "4", "5", "6"], para: ["Yazı", "Tura"], iki: Array.from({ length: 11 }, (_, i) => String(i + 2)), cark: ["Kırmızı", "Mavi", "Mavi", "Sarı"] };
      const theo = (k, o) => { if (k === "iki") { const s = +o; return (6 - Math.abs(7 - s)) / 36; } const arr = K[k]; return arr.filter((x) => x === o).length / arr.length; };
      const svg = S("svg", { viewBox: "0 0 1000 400", style: "width:100%;height:100%" });
      const mat = h("div.mat", { style: { height: "420px" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "22px" } });
      function once() { if (kind === "iki") return String(T.rand(1, 6) + T.rand(1, 6)); return T.pick(K[kind]); }
      function run(k) { for (let i = 0; i < k; i++) { const r = once(); counts[r] = (counts[r] || 0) + 1; n++; } T.sound.drum(); paint(); }
      function paint() {
        const outs = [...new Set(K[kind])];
        svg.replaceChildren();
        const bw = 880 / outs.length, X = (i) => 70 + i * bw;
        const maxP = Math.max(0.0001, ...outs.map((o) => Math.max((counts[o] || 0) / Math.max(1, n), theo(kind, o)))) * 1.15;
        const Y = (p) => 340 - (p / maxP) * 300;
        for (let k = 0; k <= 4; k++) { const p = (maxP / 4) * k; svg.append(S("line", { x1: 60, y1: Y(p), x2: 960, y2: Y(p), stroke: "rgba(0,0,0,.07)" })); svg.append(S("text", { x: 54, y: Y(p), "text-anchor": "end", "dominant-baseline": "central", "font-family": "Lexend, sans-serif", "font-size": 13, fill: "#55625b" }, "%" + Math.round(p * 100))); }
        outs.forEach((o, i) => {
          const p = n ? (counts[o] || 0) / n : 0, tp = theo(kind, o);
          svg.append(S("rect", { x: X(i) + bw * 0.18, y: Y(p), width: bw * 0.64, height: 340 - Y(p), rx: 4, fill: ["#ef5b3b", "#2e9bd6", "#ffc233", "#6cc04a", "#8a5cd0", "#f27ba9"][i % 6] }));
          svg.append(S("line", { x1: X(i) + bw * 0.1, y1: Y(tp), x2: X(i) + bw * 0.9, y2: Y(tp), stroke: "#2a2a2a", "stroke-width": 3, "stroke-dasharray": "8 5" }));
          svg.append(S("text", { x: X(i) + bw / 2, y: 366, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": outs.length > 8 ? 18 : 22 }, o));
          svg.append(S("text", { x: X(i) + bw / 2, y: 390, "text-anchor": "middle", "font-family": "Lexend, sans-serif", "font-size": 13, fill: "#55625b" }, counts[o] || 0));
        });
        out.textContent = n + " deneme. Kesik çizgi teorik olasılık, sütun deneysel sonuç.";
      }
      host.append(h("div.row", seg([["zar", "Zar"], ["para", "Para"], ["iki", "İki zar toplamı"], ["cark", "Çark (1 kırmızı, 2 mavi, 1 sarı)"]], kind, (v) => { kind = v; counts = {}; n = 0; paint(); }),
        btn("leaf", "dice", "1 kez", () => run(1)), btn("leaf", null, "10 kez", () => run(10)), btn("leaf", null, "100 kez", () => run(100)), btn("leaf", null, "1000 kez", () => run(1000)),
        btn("chalk", "reset", "Sıfırla", () => { counts = {}; n = 0; paint(); })), mat, out,
        h("p.hint", "Az denemede sütunlar teorik çizgiden uzak olabilir. Deneme sayısı arttıkça ne oluyor?"));
      paint();
    },
  });

  /* ---------- Alan ve çevre ---------- */
  tool("alan-cevre", {
    title: "Alan ve çevre", icon: "area", tone: "tomato", grades: [3, 7], short: "Dikdörtgeni boyutlandır, birim kareleri say",
    render(host) {
      let w = 6, hh = 4, fixed = "yok";
      const svg = S("svg", { viewBox: "0 0 760 520", style: "width:100%;height:100%;touch-action:none" });
      const mat = h("div.mat", { style: { height: "var(--stage-h)" } }, svg);
      const out = h("div.readout", { style: { color: "var(--chalk)", fontSize: "24px" } });
      const U = 40, ox = 60, oy = 40;
      function paint() {
        svg.replaceChildren();
        for (let i = 0; i <= 17; i++) svg.append(S("line", { x1: ox + i * U, y1: oy, x2: ox + i * U, y2: oy + 11 * U, stroke: "rgba(46,155,214,.25)" }));
        for (let j = 0; j <= 11; j++) svg.append(S("line", { x1: ox, y1: oy + j * U, x2: ox + 17 * U, y2: oy + j * U, stroke: "rgba(46,155,214,.25)" }));
        for (let i = 0; i < w; i++) for (let j = 0; j < hh; j++) svg.append(S("rect", { x: ox + i * U + 2, y: oy + j * U + 2, width: U - 4, height: U - 4, rx: 4, fill: "rgba(239,91,59,.28)" }));
        svg.append(S("rect", { x: ox, y: oy, width: w * U, height: hh * U, fill: "none", stroke: "#e2473b", "stroke-width": 6 }));
        svg.append(S("circle", { cx: ox + w * U, cy: oy + hh * U, r: 16, fill: "#e2473b", stroke: "#2a2a2a", "stroke-width": 3, style: "cursor:grab" }));
        svg.append(S("text", { x: ox + (w * U) / 2, y: oy + hh * U + 30, "text-anchor": "middle", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 24 }, w + " birim"));
        svg.append(S("text", { x: ox + w * U + 26, y: oy + (hh * U) / 2, "dominant-baseline": "central", "font-family": "'Baloo 2', sans-serif", "font-weight": 800, "font-size": 24 }, hh + " birim"));
        out.textContent = `Alan = ${w} × ${hh} = ${w * hh} birim kare     Çevre = 2 × (${w} + ${hh}) = ${2 * (w + hh)} birim`;
      }
      let drag = false;
      svg.addEventListener("pointerdown", (e) => { drag = true; svg.setPointerCapture(e.pointerId); mv(e); });
      svg.addEventListener("pointermove", (e) => drag && mv(e));
      svg.addEventListener("pointerup", () => (drag = false));
      function mv(e) {
        const p = T.svgPoint(svg, e.clientX, e.clientY);
        let nw = T.clamp(Math.round((p.x - ox) / U), 1, 16), nh = T.clamp(Math.round((p.y - oy) / U), 1, 10);
        if (fixed === "alan") { const A = w * hh; if (A % nw === 0 && A / nw <= 10) { nh = A / nw; } else return; }
        if (fixed === "cevre") { const P = w + hh; nh = P - nw; if (nh < 1 || nh > 10) return; }
        w = nw; hh = nh; paint();
      }
      host.append(h("div.row", h("span.hint", { style: { color: "var(--chalk)" } }, "Sabit tut:"),
        seg([["yok", "Serbest"], ["alan", "Alanı sabit tut"], ["cevre", "Çevreyi sabit tut"]], fixed, (v) => (fixed = v))), mat, out,
        h("p.hint", "Köşedeki kırmızı noktayı sürükle. Alanı sabit tutunca çevre değişir mi? Hangi dikdörtgenin çevresi en kısa?"));
      paint();
    },
  });
})();
