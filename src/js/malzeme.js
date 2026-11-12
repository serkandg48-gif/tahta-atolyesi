/* SVG için gerçek malzeme: parlak boncuk ve pul degradeleri, ahşap, metal, cam, gölge. Tanımlar belgede bir kez durur, her SVG kullanabilir. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  let defs = null; const yapilan = new Set();
  const el = (tag, a = {}, ...k) => { const e = document.createElementNS(NS, tag); Object.entries(a).forEach(([x, v]) => e.setAttribute(x, v)); k.forEach((c) => e.append(c)); return e; };
  const karistir = (hex, hedef, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const a = p(hex), b = p(hedef); return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const tam = (c) => { if (c[0] !== "#") return "#888888"; return c.length === 4 ? "#" + [...c.slice(1)].map((x) => x + x).join("") : c.slice(0, 7); };
  function kur() {
    if (defs && defs.isConnected) return defs;
    const svg = el("svg", { width: 0, height: 0, "aria-hidden": "true", style: "position:absolute;width:0;height:0;overflow:hidden" });
    defs = el("defs"); svg.append(defs); document.body.append(svg); yapilan.clear();
    defs.append(
      el("filter", { id: "m3-golge", filterUnits: "userSpaceOnUse", x: -3000, y: -3000, width: 8000, height: 8000 }, el("feDropShadow", { dx: 0, dy: 5, stdDeviation: 4, "flood-color": "#2a1a08", "flood-opacity": 0.35 })),
      el("filter", { id: "m3-golge-k", filterUnits: "userSpaceOnUse", x: -3000, y: -3000, width: 8000, height: 8000 }, el("feDropShadow", { dx: 0, dy: 2, stdDeviation: 1.6, "flood-color": "#2a1a08", "flood-opacity": 0.35 })),
      el("filter", { id: "m3-ic", x: "-10%", y: "-10%", width: "120%", height: "120%" }, el("feOffset", { dx: 0, dy: 3 }), el("feGaussianBlur", { stdDeviation: 3, result: "b" }), el("feComposite", { operator: "out", in: "SourceGraphic", in2: "b", result: "o" }), el("feFlood", { "flood-color": "#000", "flood-opacity": 0.28 }), el("feComposite", { operator: "in", in2: "o" }), el("feComposite", { operator: "over", in2: "SourceGraphic" })),
      el("linearGradient", { id: "m3-metal", x1: 0, y1: 0, x2: 0, y2: 1 }, el("stop", { offset: 0, "stop-color": "#F4F6F8" }), el("stop", { offset: 0.45, "stop-color": "#9AA3AD" }), el("stop", { offset: 0.55, "stop-color": "#7C858F" }), el("stop", { offset: 1, "stop-color": "#C9CFD6" })),
      el("radialGradient", { id: "m3-halka", cx: 0.5, cy: 0.5, r: 0.5 }, el("stop", { offset: 0.86, "stop-color": "#5E6670" }), el("stop", { offset: 0.92, "stop-color": "#E9EDF1" }), el("stop", { offset: 0.97, "stop-color": "#8C949D" }), el("stop", { offset: 1, "stop-color": "#454B52" })),
      el("radialGradient", { id: "m3-kadran", cx: 0.45, cy: 0.4, r: 0.65 }, el("stop", { offset: 0, "stop-color": "#FFFFFF" }), el("stop", { offset: 1, "stop-color": "#EDE6D6" })),
      el("linearGradient", { id: "m3-cam", x1: 0, y1: 0, x2: 1, y2: 1 }, el("stop", { offset: 0, "stop-color": "#fff", "stop-opacity": 0.55 }), el("stop", { offset: 0.45, "stop-color": "#fff", "stop-opacity": 0.08 }), el("stop", { offset: 1, "stop-color": "#fff", "stop-opacity": 0 })),
      el("linearGradient", { id: "m3-kagit", x1: 0, y1: 0, x2: 0, y2: 1 }, el("stop", { offset: 0, "stop-color": "#FFFDF7" }), el("stop", { offset: 1, "stop-color": "#F3EBDA" })),
    );
    [["m3-ahsap", "#C99A5E", "#A87843"], ["m3-ahsap-koyu", "#8A5A32", "#6B4224"], ["m3-ahsap-acik", "#EBCB98", "#D7B07A"]].forEach(([id, a, b]) => {
      const p = el("pattern", { id, width: 220, height: 60, patternUnits: "userSpaceOnUse" });
      p.append(el("rect", { width: 220, height: 60, fill: a }));
      for (let i = 0; i < 9; i++) { const y = 4 + i * 6.5 + Math.sin(i) * 2; p.append(el("path", { d: `M0 ${y} C 60 ${y + 3}, 120 ${y - 3}, 220 ${y + 1}`, stroke: i % 3 ? b : "rgba(255,240,210,.35)", "stroke-width": i % 2 ? 1.2 : 2.2, fill: "none", opacity: 0.55 })); }
      defs.append(p);
    });
    return defs;
  }
  /* parlak plastik/boncuk degradesi */
  T.m3 = (renk) => {
    const c = tam(String(renk || "#888")), id = "m3-p" + c.slice(1); kur();
    if (!yapilan.has(id) || !document.getElementById(id)) {
      yapilan.add(id);
      defs.append(el("radialGradient", { id, cx: 0.36, cy: 0.3, r: 0.75 }, el("stop", { offset: 0, "stop-color": karistir(c, "#ffffff", 0.75) }), el("stop", { offset: 0.18, "stop-color": karistir(c, "#ffffff", 0.25) }), el("stop", { offset: 0.65, "stop-color": c }), el("stop", { offset: 1, "stop-color": karistir(c, "#000000", 0.45) })));
    }
    return `url(#${id})`;
  };
  /* boyanmış ahşap/karton yüzey (doğrusal) */
  T.m3d = (renk) => {
    const c = tam(String(renk || "#888")), id = "m3-d" + c.slice(1); kur();
    if (!yapilan.has(id) || !document.getElementById(id)) { yapilan.add(id); defs.append(el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, el("stop", { offset: 0, "stop-color": karistir(c, "#ffffff", 0.35) }), el("stop", { offset: 0.5, "stop-color": c }), el("stop", { offset: 1, "stop-color": karistir(c, "#000000", 0.22) }))); }
    return `url(#${id})`;
  };
  T.m3kur = kur;
})();
