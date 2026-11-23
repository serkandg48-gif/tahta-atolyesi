/* İzometrik çizim: izometrik nokta kâğıdında küp yapıları kurma, yüz boyama, çizgi çizme, döndürme ve önden, yandan, üstten görünümler.
   Yapı 3B tamsayı koordinatlarıyla tutulur, izometrik izdüşümle çizilir. Özgün tasarım. */
(function () {
  const { h } = T; const S = T.svg;
  const RENK = ["#E8473A", "#F28C28", "#F6C431", "#8BC34A", "#2EA35B", "#1FB5B5", "#2E8FD6", "#3E5FD8", "#7A4FD6", "#C455C9", "#EE6FA8", "#9C6B3F", "#FFFFFF", "#B7BEC8", "#6B7480", "#2A2F38"];
  const VW = 1200, VH = 720, KENAR = 44, C = KENAR * Math.cos(Math.PI / 6), YH = KENAR / 2;
  const kar = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = (x) => Math.max(0, Math.min(255, Math.round(x * k))); return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((x) => f(x).toString(16).padStart(2, "0")).join(""); };
  const YON = { z: [0, 0, 1], x: [1, 0, 0], y: [0, 1, 0] };
  const anahtar = (x, y, z) => x + "," + y + "," + z;

  T.tools["izometrik"] = {
    cat: "manip", title: "İzometrik çizim", icon: "blocks", tone: "sky", grades: [1, 8], short: "Küplerle yapı kur, boya, döndür, görünümlere bak",
    render(host) {
      const D = (() => { try { return JSON.parse(localStorage.getItem("ta-izo") || "null"); } catch (e) { return null; } })() || { kup: {}, yuz: {}, cizgi: [] };
      let mod = "ekle", renk = RENK[6], gecmis = [], cizBas = null, gorunum = false;
      const kaydet = () => { try { localStorage.setItem("ta-izo", JSON.stringify(D)); } catch (e) {} };
      const an = () => { gecmis.push(JSON.stringify(D)); if (gecmis.length > 80) gecmis.shift(); };
      const ox = VW / 2, oy = 150;
      const P = (x, y, z) => [ox + (x - y) * C, oy + (x + y) * YH - z * KENAR];
      const svg = S("svg", { viewBox: `0 0 ${VW} ${VH}`, class: "izo-svg" });
      const pano = h("div.izo-pano", svg);
      const gorKap = h("div.izo-gor");

      /* nokta kâğıdı */
      function noktalar(g) {
        for (let m = -2; m * YH < VH + 20; m++) for (let k = -30; k < 30; k++) {
          if ((k + m) % 2) continue; const X = ox + k * C, Y = oy + m * YH - 2 * KENAR; if (X < -5 || X > VW + 5 || Y < -5 || Y > VH + 5) continue;
          g.append(S("circle", { cx: X, cy: Y, r: 2.2, fill: "#AEB8C6" }));
        }
      }
      const yakinNokta = (X, Y) => { const m = Math.round((Y - (oy - 2 * KENAR)) / YH); let k = Math.round((X - ox) / C); if ((k + m) % 2) k += (X - ox) / C > k ? 1 : -1; return [ox + k * C, oy - 2 * KENAR + m * YH]; };

      function ciz() {
        svg.replaceChildren();
        const zemin = S("g"); noktalar(zemin); svg.append(S("rect", { width: VW, height: VH, fill: "#FBFCFE" }), zemin);
        const L = Object.keys(D.kup).map((k) => k.split(",").map(Number)).sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]) || a[2] - b[2]);
        L.forEach(([x, y, z]) => {
          const temel = D.kup[anahtar(x, y, z)];
          const yuzler = [
            ["z", [[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], 1],
            ["y", [[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], 0.8],
            ["x", [[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], 0.64],
          ];
          yuzler.forEach(([d, kose, isik]) => {
            const [dx, dy, dz] = YON[d]; if (D.kup[anahtar(x + dx, y + dy, z + dz)]) return;
            const boya = D.yuz[anahtar(x, y, z) + d] || temel;
            const pl = S("polygon", { points: kose.map((p) => P(...p).join(",")).join(" "), fill: kar(boya, isik), stroke: kar(boya, 0.42), "stroke-width": 1.6, "stroke-linejoin": "round", class: "izo-yuz" });
            pl.addEventListener("pointerdown", (e) => { e.stopPropagation(); yuzTik(x, y, z, d, e); });
            svg.append(pl);
          });
        });
        D.cizgi.forEach(([x1, y1, x2, y2, r]) => svg.append(S("line", { x1, y1, x2, y2, stroke: r, "stroke-width": 5, "stroke-linecap": "round" })));
        if (cizBas) svg.append(S("circle", { cx: cizBas[0], cy: cizBas[1], r: 8, fill: renk, stroke: "#fff", "stroke-width": 3 }));
        bilgi.textContent = Object.keys(D.kup).length + " küp";
        if (gorunum) gorunumCiz();
      }
      function yuzTik(x, y, z, d) {
        if (mod === "ekle") { const [dx, dy, dz] = YON[d]; an(); D.kup[anahtar(x + dx, y + dy, z + dz)] = renk; T.sound.pop(); }
        else if (mod === "sil") { an(); delete D.kup[anahtar(x, y, z)]; ["x", "y", "z"].forEach((k) => delete D.yuz[anahtar(x, y, z) + k]); T.sound.tick(); }
        else if (mod === "boya") { an(); D.yuz[anahtar(x, y, z) + d] = renk; T.sound.tick(); }
        else if (mod === "kupboya") { an(); D.kup[anahtar(x, y, z)] = renk; ["x", "y", "z"].forEach((k) => delete D.yuz[anahtar(x, y, z) + k]); T.sound.tick(); }
        else return zeminTik(null);
        kaydet(); ciz();
      }
      function zeminTik(e) {
        const p = e ? T.svgPoint(svg, e.clientX, e.clientY) : null; if (!p) return;
        if (mod === "cizgi") { const n = yakinNokta(p.x, p.y); if (!cizBas) cizBas = n; else { if (n[0] !== cizBas[0] || n[1] !== cizBas[1]) { an(); D.cizgi.push([cizBas[0], cizBas[1], n[0], n[1], renk]); kaydet(); } cizBas = null; } ciz(); return; }
        if (mod !== "ekle") return;
        const a = (p.x - ox) / C, b = (p.y - oy) / YH, x = Math.floor((a + b) / 2), y = Math.floor((b - a) / 2);
        if (D.kup[anahtar(x, y, 0)]) return; an(); D.kup[anahtar(x, y, 0)] = renk; T.sound.pop(); kaydet(); ciz();
      }
      svg.addEventListener("pointerdown", zeminTik);
      /* düşey eksen çevresinde 90° döndür */
      function dondur(yon) {
        an(); const yk = {}, yy = {};
        Object.entries(D.kup).forEach(([k, v]) => { const [x, y, z] = k.split(",").map(Number); const [nx, ny] = yon > 0 ? [-y - 1, x] : [y, -x - 1]; yk[anahtar(nx, ny, z)] = v; });
        Object.entries(D.yuz).forEach(([k, v]) => { const d = k.slice(-1), [x, y, z] = k.slice(0, -1).split(",").map(Number); const [nx, ny] = yon > 0 ? [-y - 1, x] : [y, -x - 1]; let nd = d;
          if (d !== "z") { /* x yüzü döndükten sonra y yüzüne, y yüzü arkaya geçer: arka yüzler görünmez, rengi küpe bırakılır */ nd = yon > 0 ? (d === "x" ? "y" : null) : (d === "y" ? "x" : null); }
          if (nd) yy[anahtar(nx, ny, z) + nd] = v; });
        D.kup = yk; D.yuz = yy; D.cizgi = []; kaydet(); ciz();
      }
      /* önden, yandan, üstten görünüşler */
      function izGrid(baslik, hucreler, gen, yuk) {
        const s = Math.min(22, 160 / Math.max(gen, yuk, 1)), g = S("svg", { viewBox: `0 0 ${gen * s + 2} ${yuk * s + 2}`, class: "izo-iz" });
        for (let i = 0; i <= gen; i++) g.append(S("line", { x1: 1 + i * s, y1: 1, x2: 1 + i * s, y2: 1 + yuk * s, stroke: "#D5DCE6" }));
        for (let j = 0; j <= yuk; j++) g.append(S("line", { x1: 1, y1: 1 + j * s, x2: 1 + gen * s, y2: 1 + j * s, stroke: "#D5DCE6" }));
        hucreler.forEach(([i, j, r]) => g.append(S("rect", { x: 1 + i * s, y: 1 + j * s, width: s, height: s, fill: r, stroke: kar(r, 0.5) })));
        return h("figure.izo-gk", g, h("figcaption", baslik));
      }
      function gorunumCiz() {
        const L = Object.entries(D.kup).map(([k, v]) => [...k.split(",").map(Number), v]); if (!L.length) { gorKap.replaceChildren(h("p.hint", "Önce birkaç küp koy.")); return; }
        const mn = [0, 1, 2].map((i) => Math.min(...L.map((p) => p[i]))), mx = [0, 1, 2].map((i) => Math.max(...L.map((p) => p[i])));
        const W = mx[0] - mn[0] + 1, Dd = mx[1] - mn[1] + 1, Hh = mx[2] - mn[2] + 1;
        /* önden: +y yönünden bakılır (soldaki yüzler); en öndeki küpün rengi */
        const on = {}, yan = {}, ust = {};
        L.forEach(([x, y, z, r]) => {
          const ko = (x - mn[0]) + "," + (mx[2] - z); if (!on[ko] || on[ko][0] < y) on[ko] = [y, D.yuz[anahtar(x, y, z) + "y"] || r];
          const ky = (mx[1] - y) + "," + (mx[2] - z); if (!yan[ky] || yan[ky][0] < x) yan[ky] = [x, D.yuz[anahtar(x, y, z) + "x"] || r];
          const ku = (x - mn[0]) + "," + (y - mn[1]); if (!ust[ku] || ust[ku][0] < z) ust[ku] = [z, D.yuz[anahtar(x, y, z) + "z"] || r];
        });
        const hc = (o) => Object.entries(o).map(([k, [, r]]) => [...k.split(",").map(Number), r]);
        gorKap.replaceChildren(izGrid("Önden", hc(on), W, Hh), izGrid("Yandan", hc(yan), Dd, Hh), izGrid("Üstten", hc(ust), W, Dd));
      }

      const modBtn = (k, ic, ad) => h("button.izo-mod", { "data-k": k, "aria-pressed": String(mod === k), onclick: () => { mod = k; cizBas = null; arac.querySelectorAll(".izo-mod").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === k))); ciz(); } }, T.icon(ic), h("span", ad));
      const palet = h("div.izo-palet", RENK.map((r) => h("button.izo-renk" + (r === renk ? ".on" : ""), { style: { background: r }, "aria-label": "Renk", onclick: (e) => { renk = r; palet.querySelectorAll(".izo-renk").forEach((b) => b.classList.toggle("on", b === e.currentTarget)); if (cizBas) ciz(); } })));
      const bilgi = h("span.izo-bilgi");
      const arac = h("div.izo-arac",
        modBtn("ekle", "plus", "Küp ekle"), modBtn("kupboya", "blocks", "Küp boya"), modBtn("boya", "edit", "Yüz boya"), modBtn("cizgi", "pen", "Çizgi"), modBtn("sil", "trash", "Sil"),
        palet,
        h("div.izo-alt",
          h("button.izo-mod", { onclick: () => dondur(1) }, T.icon("rotate"), h("span", "Döndür")),
          h("button.izo-mod", { onclick: () => { const g = gecmis.pop(); if (g) { Object.assign(D, JSON.parse(g)); kaydet(); ciz(); } } }, T.icon("undo"), h("span", "Geri al")),
          h("button.izo-mod", { onclick: async () => { if (!Object.keys(D.kup).length && !D.cizgi.length) return; if (await T.confirm("Temizle", "Bütün küpler ve çizgiler silinsin mi?", "Temizle")) { an(); D.kup = {}; D.yuz = {}; D.cizgi = []; kaydet(); ciz(); } } }, T.icon("reset"), h("span", "Temizle")),
          h("button.izo-mod", { "aria-pressed": "false", onclick: (e) => { gorunum = !gorunum; e.currentTarget.setAttribute("aria-pressed", String(gorunum)); gorKap.hidden = !gorunum; ciz(); } }, T.icon("eye"), h("span", "Görünümler"))));
      gorKap.hidden = true;
      host.append(h("div.izo-kap", arac, h("div.izo-orta", pano, h("div.izo-durum", bilgi, h("span.hint", "Boş noktaya dokununca zemine küp gelir. Bir küpün yüzüne dokununca o yüzün üstüne yeni küp eklenir."))), gorKap));
      ciz();
    },
  };
})();
