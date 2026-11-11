/* Vitrinden gelen iki araç: yumurta kolisiyle 10'a tamamlama oyunu ve tavşanlı sayı doğrusu. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (t, a = {}, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mount = (host, html) => { const box = document.createElement("div"); box.className = "vt stage"; box.innerHTML = html; host.append(box); return (id) => box.querySelector("#" + id); };

  T.tools["oyun-yumurta-kolisi"] = {
    cat: "oyun", title: "Yumurta kolisi", icon: "star", tone: "sun", grades: [1, 2], short: "10'a tamamla, sürükle bırak",
    render(host) {
      const q = mount(host, '<div class="kitchen" id="kitchen">\n      <div class="wood"></div>\n      <div class="prompt" id="prompt">Kolide <b>6</b> yumurta var. Koliyi doldurmak için yumurta ekle.</div>\n      <svg id="carton" viewBox="0 0 640 300" aria-label="Yumurta kolisi"></svg>\n      <svg id="bowl" viewBox="0 0 260 170" aria-label="Yumurta sepeti"></svg>\n      <div class="eq" id="eq">6 + <span class="q">?</span> = 10</div>\n    </div>\n    <div class="ctl"><button class="btn" id="check"><svg class="ic" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>Kontrol et</button><button class="btn ghost" id="reset">Baştan</button><span class="msg" id="msg" aria-live="polite"></span><span class="steps" id="steps" aria-label="Turlar"></span><span class="note" style="margin-left:16px">Yumurtayı sepetten tutup koliye sürükle ya da boş göze dokun.</span></div>\n  ');

  const carton = q("carton"), bowl = q("bowl");
  const defs = el("defs", {}, carton);
  defs.innerHTML = `
    <linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9BFAF"/><stop offset="1" stop-color="#A99D8B"/></linearGradient>
    <radialGradient id="cup" cx=".5" cy=".38" r=".6"><stop offset="0" stop-color="#9E9281"/><stop offset=".7" stop-color="#B8AD9C"/><stop offset="1" stop-color="#CFC6B7"/></radialGradient>
    <radialGradient id="egg" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#FFF8EE"/><stop offset=".55" stop-color="#F1DCC2"/><stop offset="1" stop-color="#D2B08A"/></radialGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#3D3020" flood-opacity=".28"/></filter>
    <filter id="es" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#3D3020" flood-opacity=".35"/></filter>`;
  bowl.innerHTML = `<defs>${defs.innerHTML}<linearGradient id="wk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7895A"/><stop offset="1" stop-color="#8A6038"/></linearGradient></defs>`;
  el("rect", { x: 12, y: 24, width: 616, height: 252, rx: 26, fill: "url(#cb)", filter: "url(#sh)" }, carton);
  el("rect", { x: 22, y: 34, width: 596, height: 232, rx: 20, fill: "none", stroke: "#B3A794", "stroke-width": 2 }, carton);
  const cells = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
    const cx = 80 + c * 120, cy = 95 + r * 112;
    el("ellipse", { cx, cy: cy + 4, rx: 50, ry: 46, fill: "#A3978A" }, carton);
    el("ellipse", { cx, cy, rx: 46, ry: 42, fill: "url(#cup)" }, carton);
    cells.push({ cx, cy, egg: null });
  }
  const gEggs = el("g", {}, carton);
  const eggShape = (g, x, y, s = 1) => {
    const e = el("g", { transform: `translate(${x},${y}) scale(${s})`, filter: "url(#es)" }, g);
    el("path", { d: "M0,-40 C24,-40 34,-6 32,12 C30,32 16,42 0,42 C-16,42 -30,32 -32,12 C-34,-6 -24,-40 0,-40Z", fill: "url(#egg)" }, e);
    el("ellipse", { cx: -10, cy: -16, rx: 7, ry: 11, fill: "#fff", opacity: .55 }, e);
    return e;
  };
  /* Sepet */
  const basket = el("g", {}, bowl);
  el("ellipse", { cx: 130, cy: 150, rx: 118, ry: 16, fill: "#6E5235", opacity: .25 }, basket);
  el("path", { d: "M18,70 L242,70 L220,150 Q130,166 40,150 Z", fill: "url(#wk)" }, basket);
  for (let i = 0; i < 8; i++) el("path", { d: `M${26 + i * 28},74 L${46 + i * 25},148`, stroke: "#7A5530", "stroke-width": 2, opacity: .45 }, basket);
  for (let j = 0; j < 3; j++) el("path", { d: `M${24 + j * 6},${92 + j * 20} Q130,${104 + j * 22} ${236 - j * 6},${92 + j * 20}`, stroke: "#6E4C2A", "stroke-width": 2.5, fill: "none", opacity: .4 }, basket);
  el("ellipse", { cx: 130, cy: 70, rx: 112, ry: 16, fill: "#9C7246" }, basket);
  const bowlEggs = el("g", {}, bowl);

  let start = 6, round = 0; const ROUNDS = [6, 3, 8, 5, 7];
  const steps = q("steps"), msg = q("msg"), eq = q("eq"), prompt = q("prompt");
  const drawSteps = () => { if (!steps) return; steps.innerHTML = ROUNDS.map((_, i) => `<i class="${i < round ? "ok" : i === round ? "cur" : ""}"></i>`).join(""); };
  const filled = () => cells.filter((c) => c.egg).length;
  const update = () => { const add = filled() - start; eq.innerHTML = `${start} + <span class="q">${add > 0 ? add : "?"}</span> = ${filled() === 10 ? 10 : "10"}`; };
  function putEgg(cell, anim) {
    cell.egg = eggShape(gEggs, cell.cx, cell.cy - 2, .92);
    if (anim && !reduce) { const e = cell.egg, t0 = performance.now(); const f = (now) => { const t = Math.min(1, (now - t0) / 280), k = 1 - Math.pow(1 - t, 3); e.setAttribute("transform", `translate(${cell.cx},${cell.cy - 2 - 60 * (1 - k)}) scale(.92)`); if (t < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }
    update();
  }
  function removeEgg(cell) { cell.egg.remove(); cell.egg = null; update(); }
  function setup() {
    start = ROUNDS[round]; msg.textContent = ""; msg.className = "msg";
    cells.forEach((c) => c.egg && removeEgg(c));
    cells.slice(0, start).forEach((c) => { putEgg(c, false); c.fixed = true; });
    cells.slice(start).forEach((c) => (c.fixed = false));
    prompt.innerHTML = `Kolide <b>${start}</b> yumurta var. Koliyi doldurmak için yumurta ekle.`;
    bowlEggs.innerHTML = "";
    [[70, 60], [118, 52], [166, 60], [94, 44], [142, 42], [190, 50]].forEach(([x, y]) => {
      const e = eggShape(bowlEggs, x, y, .62); e.classList.add("egg-drag");
      e.addEventListener("pointerdown", drag);
    });
    drawSteps(); update();
  }
  /* Sürükle bırak: sepetteki yumurtayı en yakın boş göze bırakır */
  function drag(ev) {
    ev.preventDefault();
    const ghost = document.createElement("div");
    ghost.style.cssText = "position:fixed;width:52px;height:66px;pointer-events:none;z-index:20;transform:translate(-50%,-55%)";
    ghost.innerHTML = `<svg viewBox="-40 -46 80 92" width="52" height="66"><defs>${defs.innerHTML}</defs><g filter="url(#es)"><path d="M0,-40 C24,-40 34,-6 32,12 C30,32 16,42 0,42 C-16,42 -30,32 -32,12 C-34,-6 -24,-40 0,-40Z" fill="url(#egg)"/><ellipse cx="-10" cy="-16" rx="7" ry="11" fill="#fff" opacity=".55"/></g></svg>`;
    document.body.append(ghost);
    const mv = (e) => { ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px"; }; mv(ev);
    const up = (e) => {
      removeEventListener("pointermove", mv); removeEventListener("pointerup", up); ghost.remove();
      const pt = carton.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const p = pt.matrixTransform(carton.getScreenCTM().inverse());
      let best = null, bd = 1e9;
      cells.forEach((c) => { if (c.egg) return; const d = Math.hypot(c.cx - p.x, c.cy - p.y); if (d < bd) { bd = d; best = c; } });
      if (best && bd < 90) putEgg(best, true);
    };
    addEventListener("pointermove", mv); addEventListener("pointerup", up);
  }
  carton.addEventListener("click", (e) => {
    const pt = carton.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(carton.getScreenCTM().inverse());
    const c = cells.find((c) => Math.hypot(c.cx - p.x, c.cy - p.y) < 46); if (!c) return;
    if (c.egg && !c.fixed) removeEgg(c); else if (!c.egg) putEgg(c, true);
  });
  q("check").onclick = () => {
    if (filled() === 10) {
      msg.textContent = `Doğru. ${start} ile ${10 - start} birlikte 10 eder.`; msg.className = "msg ok-msg";
      setTimeout(() => { round = (round + 1) % ROUNDS.length; setup(); }, 1600);
    } else { msg.textContent = `Kolide ${10 - filled()} boş göz kaldı. Bir daha bak.`; msg.className = "msg no-msg"; }
  };
  q("reset").onclick = setup;
  setup();

    },
  };

  T.tools["tavsan-dogrusu"] = {
    cat: "manip", title: "Tavşanla sayı doğrusu", icon: "line", tone: "sky", grades: [1, 4], short: "Atlayarak toplama ve çıkarma",
    render(host) {
      const q = mount(host, '<div class="nl-ctl">\n      <label>Başla <input id="a" type="number" value="7" min="0" max="20"></label>\n      <div class="seg" id="op"><button aria-pressed="true" data-v="+">Topla +</button><button aria-pressed="false" data-v="-">Çıkar −</button></div>\n      <label><input id="b" type="number" value="5" min="0" max="20"></label>\n      <label>Strateji <div class="seg" id="st"><button aria-pressed="true" data-v="on">10\'a tamamla</button><button aria-pressed="false" data-v="bir">Birer birer</button><button aria-pressed="false" data-v="tek">Tek atlayış</button></div></label>\n      <label>Hayvan <div class="seg" id="hv"><button aria-pressed="true" data-v="tavsan">Tavşan</button><button aria-pressed="false" data-v="kus">Kuş</button></div></label>\n      <button class="btn" id="go" style="margin-left:auto"><svg class="ic" viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>Zıpla</button>\n    </div>\n    <div class="field"><svg id="nlsvg" viewBox="0 0 1260 520" aria-label="Sayı doğrusu"></svg><div class="nl-read" id="read"><small>Tavşan nerede?</small>7</div></div>\n  ');

  const svg = q("nlsvg"), read = q("read");
  const W = 1260, Y = 400, X0 = 70, MAX = 20, STEP = (W - 2 * X0) / MAX;
  const X = (n) => X0 + n * STEP;
  const defs = el("defs", {}, svg);
  defs.innerHTML = `
    <linearGradient id="ruler" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7EBD3"/><stop offset="1" stop-color="#E2CDA6"/></linearGradient>
    <radialGradient id="fur" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#E9E2D6"/><stop offset=".6" stop-color="#C8BBA6"/><stop offset="1" stop-color="#A39279"/></radialGradient>
    <radialGradient id="ear" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#E7B8AE"/><stop offset="1" stop-color="#C99A8F"/></radialGradient>
    <linearGradient id="feather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A78B8"/><stop offset="1" stop-color="#284B82"/></linearGradient>
    <filter id="ds" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2A3320" flood-opacity=".25"/></filter>`;
  /* Cetvel gibi sayı doğrusu */
  el("rect", { x: 30, y: Y - 6, width: W - 60, height: 54, rx: 10, fill: "url(#ruler)", filter: "url(#ds)" }, svg);
  el("line", { x1: 40, y1: Y, x2: W - 40, y2: Y, stroke: "#5B4A2E", "stroke-width": 3 }, svg);
  for (let n = 0; n <= MAX; n++) {
    el("line", { x1: X(n), y1: Y, x2: X(n), y2: Y + (n % 5 === 0 ? 22 : 14), stroke: "#5B4A2E", "stroke-width": n % 10 === 0 ? 3 : 2 }, svg);
    const t = el("text", { x: X(n), y: Y + 42, "text-anchor": "middle", "font-size": n % 10 === 0 ? 22 : 19, "font-weight": n % 10 === 0 ? 800 : 600, fill: n % 10 === 0 ? "#1B2A4A" : "#5B4A2E", "font-family": "Onest, sans-serif" }, svg);
    t.textContent = n;
  }
  const arcs = el("g", {}, svg);
  /* Tavşan: yandan görünüş, sakin ve gerçekçiye yakın */
  function rabbit() {
    const g = el("g", {});
    el("ellipse", { cx: 0, cy: 4, rx: 30, ry: 6, fill: "#2A3320", opacity: .18, class: "shadow" }, g);
    const b = el("g", { class: "body" }, g);
    el("ellipse", { cx: -6, cy: -30, rx: 30, ry: 24, fill: "url(#fur)" }, b);
    el("ellipse", { cx: -20, cy: -14, rx: 16, ry: 10, fill: "#BFB09A" }, b);
    el("circle", { cx: -36, cy: -38, r: 8, fill: "#F4F0EA" }, b);
    el("ellipse", { cx: 22, cy: -48, rx: 17, ry: 15, fill: "url(#fur)" }, b);
    el("path", { d: "M18,-60 C10,-96 18,-108 24,-104 C30,-98 30,-78 26,-60 Z", fill: "url(#fur)" }, b);
    el("path", { d: "M20,-64 C15,-92 20,-100 23,-98 C27,-93 26,-78 24,-64 Z", fill: "url(#ear)" }, b);
    el("path", { d: "M26,-60 C26,-92 36,-100 40,-95 C44,-88 38,-72 32,-58 Z", fill: "#B7A78F" }, b);
    el("circle", { cx: 29, cy: -50, r: 3.2, fill: "#1E1A16" }, b);
    el("circle", { cx: 30, cy: -51, r: 1, fill: "#fff" }, b);
    el("ellipse", { cx: 38, cy: -43, rx: 2.4, ry: 1.8, fill: "#B47C72" }, b);
    el("path", { d: "M2,-10 Q8,0 16,-2", stroke: "#A39279", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, b);
    return g;
  }
  function bird() {
    const g = el("g", {});
    el("ellipse", { cx: 0, cy: 4, rx: 22, ry: 5, fill: "#2A3320", opacity: .18, class: "shadow" }, g);
    const b = el("g", { class: "body" }, g);
    el("ellipse", { cx: 0, cy: -28, rx: 24, ry: 18, fill: "url(#feather)" }, b);
    el("ellipse", { cx: 4, cy: -22, rx: 14, ry: 10, fill: "#E9D9B8" }, b);
    el("circle", { cx: 18, cy: -42, r: 12, fill: "url(#feather)" }, b);
    el("path", { d: "M28,-44 L40,-40 L28,-37 Z", fill: "#E9A23B" }, b);
    el("circle", { cx: 21, cy: -45, r: 2.6, fill: "#111" }, b);
    el("path", { class: "wing", d: "M-6,-34 C-30,-46 -34,-20 -10,-22 Z", fill: "#1F3E6E" }, b);
    el("path", { d: "M-22,-28 L-40,-32 L-38,-22 Z", fill: "#284B82" }, b);
    el("path", { d: "M-2,-10 L-4,0 M6,-10 L6,0", stroke: "#7A5A2A", "stroke-width": 2.5 }, b);
    return g;
  }
  let animal = rabbit(), kind = "tavsan", pos = 7, busy = false, dir = 1;
  svg.append(animal);
  const place = (x, y = 0, sq = 1) => { animal.setAttribute("transform", `translate(${x},${Y - 8 + y}) scale(${dir},1)`); animal.querySelector(".body").setAttribute("transform", `scale(${2 - sq},${sq})`); };
  place(X(pos));
  const seg = (id) => { const s = q(id); let v = s.querySelector("[aria-pressed=true]").dataset.v; s.querySelectorAll("button").forEach((b) => b.onclick = () => { s.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b)); v = b.dataset.v; if (id === "hv") swap(v); }); return () => v; };
  const op = seg("op"), st = seg("st"); seg("hv");
  function swap(v) { kind = v; const x = X(pos); animal.remove(); animal = v === "kus" ? bird() : rabbit(); svg.append(animal); place(x); }
  const setRead = (n, label) => { read.innerHTML = `<small>${label || (kind === "kus" ? "Kuş" : "Tavşan") + " nerede?"}</small>${n}`; };
  function hop(from, to) {
    return new Promise((res) => {
      const x1 = X(from), x2 = X(to), d = Math.abs(to - from), h = Math.min(170, 40 + d * 16);
      const mid = (x1 + x2) / 2, top = Y - 10 - h;
      el("path", { d: `M${x1},${Y - 10} Q${mid},${top - h * .15} ${x2},${Y - 10}`, fill: "none", stroke: to > from ? "#1B2A4A" : "#C2453A", "stroke-width": 3, "stroke-dasharray": "2 9", "stroke-linecap": "round" }, arcs);
      const lbl = el("text", { x: mid, y: top - 10, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: to > from ? "#1B2A4A" : "#C2453A", "font-family": "Onest, sans-serif" }, arcs);
      lbl.textContent = (to > from ? "+" : "−") + d;
      if (reduce) { place(x2); return res(); }
      const T = 420 + d * 40, t0 = performance.now();
      dir = to >= from ? 1 : -1;
      const frame = (now) => {
        const t = Math.min(1, (now - t0) / T), x = x1 + (x2 - x1) * t, y = -4 * h * t * (1 - t);
        const sq = t < .12 ? 1 - .2 * (1 - t / .12) : t > .88 ? 1 - .2 * ((t - .88) / .12) : 1.06;
        place(x, y, sq);
        const sh = animal.querySelector(".shadow"); sh.setAttribute("transform", `translate(0,${-y}) scale(${1 - .5 * t * (1 - t) * 4})`);
        if (t < 1) requestAnimationFrame(frame); else { place(x2); res(); }
      };
      requestAnimationFrame(frame);
    });
  }
  async function go() {
    if (busy) return; busy = true; arcs.innerHTML = "";
    let a = Math.max(0, Math.min(MAX, +q("a").value || 0)), b = Math.max(0, +q("b").value || 0);
    const sign = op() === "+" ? 1 : -1; let target = a + sign * b;
    if (target < 0 || target > MAX) { setRead("?", `Sonuç 0 ile ${MAX} arasında olmalı`); busy = false; return; }
    pos = a; place(X(a)); setRead(a);
    let legs = [];
    if (st() === "tek") legs = [target];
    else if (st() === "bir") for (let i = 1; i <= b; i++) legs.push(a + sign * i);
    else { const ten = sign > 0 ? Math.ceil((a + (a % 10 === 0 ? 1 : 0)) / 10) * 10 : Math.floor((a - (a % 10 === 0 ? 1 : 0)) / 10) * 10; if ((sign > 0 && ten < target && ten > a) || (sign < 0 && ten > target && ten < a)) legs = [ten, target]; else legs = [target]; }
    await new Promise((r) => setTimeout(r, 250));
    for (const l of legs) { await hop(pos, l); pos = l; setRead(l); await new Promise((r) => setTimeout(r, 180)); }
    setRead(`${a} ${sign > 0 ? "+" : "−"} ${b} = ${target}`, "İşlem");
    busy = false;
  }
  q("go").onclick = go;
  ["a"].forEach((id) => q(id).addEventListener("change", () => { if (busy) return; arcs.innerHTML = ""; pos = Math.max(0, Math.min(MAX, +q("a").value || 0)); place(X(pos)); setRead(pos); }));

    },
  };
})();
