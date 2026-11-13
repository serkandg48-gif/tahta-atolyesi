/* Harflerin yazılış yönü (dik temel harf) ve harf sesi.
   Her harf numaralı çizgilerden oluşur. Çizgiler sırayla, yazılış yönünde canlandırılır; başlangıç noktasında numara durur.
   Koordinatlar: üst çizgi y=20, orta çizgi y=60, taban y=100, alt çizgi y=140. */
(function () {
  const h = T.h;
  const P = (a) => (Math.PI / 180) * a;
  /* saat yönünün tersine tam daire: (cx,cy) merkez, bas: başlangıç açısı (matematik açısı, 0 = sağ, 90 = üst) */
  const daire = (cx, cy, rx, ry, bas = 40) => { const n = (a) => `${(cx + rx * Math.cos(P(a))).toFixed(2)} ${(cy - ry * Math.sin(P(a))).toFixed(2)}`; return `M${n(bas)} A${rx} ${ry} 0 0 0 ${n(bas + 180)} A${rx} ${ry} 0 0 0 ${n(bas + 352)}`; };
  const nokta = (x, y) => ({ nokta: [x, y] });
  const cubuk = (x, y1, y2) => `M${x} ${y1} L${x} ${y2}`;
  const yatay = (x1, x2, y) => `M${x1} ${y} L${x2} ${y}`;
  const cKucuk = "M44 68 C40 61 33 58 26 58 C13 58 5 68 5 80 C5 92 13 100 26 100 C33 100 40 97 44 91";
  const cBuyuk = "M54 32 C48 24 40 20 32 20 C15 20 5 38 5 60 C5 82 15 100 32 100 C40 100 48 96 54 88";
  const sKucuk = "M42 64 C38 59 32 58 25 58 C14 58 7 63 7 70 C7 78 15 80 25 80 C36 80 44 83 44 90 C44 97 36 100 25 100 C16 100 9 98 5 93";
  const sBuyuk = "M50 30 C45 22 38 20 30 20 C17 20 8 27 8 39 C8 52 20 57 31 60 C44 63 53 68 53 80 C53 93 43 100 30 100 C19 100 10 96 5 88";
  const cengel = (x) => `M${x} 100 L${x} 106 C${x + 7} 106 ${x + 10} 109 ${x + 10} 113 C${x + 10} 118 ${x + 5} 121 ${x - 3} 120`;
  const kemer = "M5 75 C5 63 14 58 25 58 C37 58 45 64 45 76 L45 100";
  const gobek = "M5 76 C9 64 16 58 26 58 C38 58 45 68 45 80 C45 92 38 100 26 100 C16 100 9 96 5 88";
  const uKucuk = "M5 60 L5 82 C5 94 13 100 25 100 C37 100 45 94 45 82 L45 60 L45 100";
  const uBuyuk = "M5 20 L5 72 C5 90 15 100 30 100 C45 100 55 90 55 72 L55 20";
  const kanca = (x) => `M${x} 60 L${x} 126 C${x} 136 ${x - 8} 142 ${x - 20} 142 C${x - 28} 142 ${x - 35} 139 ${x - 39} 134`;
  const gBuyuk = "M54 32 C48 24 40 20 32 20 C15 20 5 38 5 60 C5 82 15 100 32 100 C44 100 54 92 54 76 L54 64 L34 64";
  const K = {
    a: { g: 50, c: [daire(25, 80, 20, 20, 35), cubuk(45, 60, 100)] },
    n: { g: 50, c: [cubuk(5, 60, 100), kemer] },
    e: { g: 50, c: ["M5 80 L45 80 C45 66 37 58 25 58 C12 58 5 68 5 80 C5 93 14 100 26 100 C34 100 40 97 44 92"] },
    t: { g: 42, c: ["M18 30 L18 90 C18 97 23 100 30 100 C34 100 38 99 40 97", yatay(4, 36, 60)] },
    i: { g: 20, c: [cubuk(10, 60, 100), nokta(10, 44)] },
    l: { g: 30, c: ["M10 20 L10 90 C10 97 15 100 22 100 C25 100 28 99 30 97"] },
    o: { g: 50, c: [daire(25, 80, 20, 20, 40)] },
    k: { g: 46, c: [cubuk(5, 20, 100), "M40 60 L6 82 L42 100"] },
    u: { g: 50, c: [uKucuk] },
    r: { g: 42, c: [cubuk(5, 60, 100), "M5 76 C8 64 16 58 26 58 C32 58 36 60 40 63"] },
    "ı": { g: 20, c: [cubuk(10, 60, 100)] },
    m: { g: 64, c: [cubuk(5, 60, 100), "M5 74 C5 63 11 58 19 58 C27 58 32 63 32 72 L32 100", "M32 72 C32 63 38 58 46 58 C54 58 59 63 59 72 L59 100"] },
    "ü": { g: 50, c: [uKucuk, nokta(15, 45), nokta(35, 45)] },
    s: { g: 48, c: [sKucuk] },
    "ö": { g: 50, c: [daire(25, 80, 20, 20, 40), nokta(15, 45), nokta(35, 45)] },
    y: { g: 50, c: ["M5 60 L5 80 C5 92 13 98 24 98 C36 98 45 92 45 80", "M45 60 L45 128 C45 137 37 142 26 142 C18 142 11 139 7 134"] },
    d: { g: 50, c: [daire(25, 80, 20, 20, 35), cubuk(45, 20, 100)] },
    z: { g: 50, c: ["M6 60 L44 60 L6 100 L44 100"] },
    "ç": { g: 50, c: [cKucuk, cengel(26)] },
    b: { g: 50, c: [cubuk(5, 20, 100), gobek] },
    g: { g: 50, c: [daire(25, 80, 20, 20, 35), kanca(45)] },
    c: { g: 50, c: [cKucuk] },
    "ş": { g: 48, c: [sKucuk, cengel(25)] },
    p: { g: 50, c: [cubuk(5, 60, 140), gobek] },
    h: { g: 50, c: [cubuk(5, 20, 100), kemer] },
    v: { g: 50, c: ["M5 60 L25 100 L45 60"] },
    "ğ": { g: 50, c: [daire(25, 80, 20, 20, 35), kanca(45), "M15 38 C17 46 21 49 25 49 C29 49 33 46 35 38"] },
    f: { g: 42, c: ["M40 26 C37 21 33 20 29 20 C20 20 17 27 17 36 L17 100", yatay(5, 36, 60)] },
    j: { g: 34, c: [kanca(30).replace("M30 60", "M30 60"), nokta(30, 44)] },
  };
  const B = {
    A: { g: 60, c: ["M30 20 L5 100", "M30 20 L55 100", yatay(14, 46, 72)] },
    N: { g: 55, c: [cubuk(5, 20, 100), "M5 20 L50 100", cubuk(50, 20, 100)] },
    E: { g: 48, c: [cubuk(5, 20, 100), yatay(5, 45, 20), yatay(5, 40, 60), yatay(5, 45, 100)] },
    T: { g: 60, c: [yatay(5, 55, 20), cubuk(30, 20, 100)] },
    "İ": { g: 20, c: [cubuk(10, 20, 100), nokta(10, 6)] },
    L: { g: 48, c: [cubuk(5, 20, 100), yatay(5, 45, 100)] },
    O: { g: 64, c: [daire(32, 60, 27, 40, 40)] },
    K: { g: 54, c: [cubuk(5, 20, 100), "M48 20 L6 64 L50 100"] },
    U: { g: 60, c: [uBuyuk] },
    R: { g: 56, c: [cubuk(5, 20, 100), "M5 20 L30 20 C42 20 50 28 50 40 C50 52 42 60 30 60 L5 60", "M28 60 L52 100"] },
    I: { g: 20, c: [cubuk(10, 20, 100)] },
    M: { g: 68, c: [cubuk(5, 20, 100), "M5 20 L34 72", "M34 72 L63 20", cubuk(63, 20, 100)] },
    "Ü": { g: 60, c: [uBuyuk, nokta(20, 7), nokta(40, 7)] },
    S: { g: 58, c: [sBuyuk] },
    "Ö": { g: 64, c: [daire(32, 60, 27, 40, 40), nokta(22, 7), nokta(42, 7)] },
    Y: { g: 60, c: ["M5 20 L30 58", "M55 20 L30 58", cubuk(30, 58, 100)] },
    D: { g: 58, c: [cubuk(5, 20, 100), "M5 20 L22 20 C42 20 55 36 55 60 C55 84 42 100 22 100 L5 100"] },
    Z: { g: 60, c: ["M6 20 L54 20 L6 100 L54 100"] },
    "Ç": { g: 60, c: [cBuyuk, cengel(32)] },
    B: { g: 56, c: [cubuk(5, 20, 100), "M5 20 L28 20 C40 20 46 27 46 39 C46 51 39 58 28 58 L5 58 L31 58 C44 58 52 66 52 79 C52 92 44 100 31 100 L5 100"] },
    G: { g: 60, c: [gBuyuk] },
    C: { g: 60, c: [cBuyuk] },
    "Ş": { g: 58, c: [sBuyuk, cengel(30)] },
    P: { g: 54, c: [cubuk(5, 20, 100), "M5 20 L30 20 C43 20 51 28 51 41 C51 54 43 62 30 62 L5 62"] },
    H: { g: 54, c: [cubuk(5, 20, 100), cubuk(49, 20, 100), yatay(5, 49, 60)] },
    V: { g: 60, c: ["M5 20 L30 100 L55 20"] },
    "Ğ": { g: 60, c: [gBuyuk, "M22 2 C24 9 28 12 32 12 C36 12 40 9 42 2"] },
    F: { g: 48, c: [cubuk(5, 20, 100), yatay(5, 45, 20), yatay(5, 40, 60)] },
    J: { g: 50, c: ["M45 20 L45 78 C45 92 37 100 25 100 C14 100 7 94 4 86"] },
  };
  T.YAZILIS = { K, B };
  const NS = "http://www.w3.org/2000/svg";
  const el = (ad, at) => { const e = document.createElementNS(NS, ad); for (const k in at) e.setAttribute(k, at[k]); return e; };
  const RENK = ["#E8505B", "#2F80ED", "#27AE60", "#F2994A", "#9B51E0"];

  /* Tek harf: SVG + oynat(). Seçenek: { kalin } */
  function harfSvg(ch, o = {}) {
    const veri = K[ch] || B[ch]; if (!veri) return null;
    const g = veri.g, sol = -12, gen = g + 24;
    const svg = el("svg", { viewBox: `${sol} -12 ${gen} 162`, class: "yz-svg", "aria-label": ch + " harfinin yazılışı" });
    /* defter çizgileri */
    svg.append(el("rect", { x: sol, y: 60, width: gen, height: 40, fill: "#FCE7EC" }));
    [[20, "#C9D3E6", "4 4"], [60, "#E3A1B0", ""], [100, "#E3A1B0", ""], [140, "#C9D3E6", "4 4"]].forEach(([y, c, d]) => svg.append(el("line", { x1: sol, x2: sol + gen, y1: y, y2: y, stroke: c, "stroke-width": 1.2, "stroke-dasharray": d })));
    const kat = el("g", {}), ust = el("g", {}), isaret = el("g", {}); svg.append(kat, ust, isaret);
    const KAL = o.kalin || 10, parcalar = [];
    veri.c.forEach((c, i) => {
      if (c.nokta) {
        const [x, y] = c.nokta;
        kat.append(el("circle", { cx: x, cy: y, r: KAL * 0.62, fill: "#D9DEE8" }));
        const d = el("circle", { cx: x, cy: y, r: KAL * 0.62, fill: "#1B2A4A", opacity: 0 }); ust.append(d);
        parcalar.push({ nokta: true, d, bas: [x, y], i });
        return;
      }
      kat.append(el("path", { d: c, fill: "none", stroke: "#D9DEE8", "stroke-width": KAL, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      const p = el("path", { d: c, fill: "none", stroke: "#1B2A4A", "stroke-width": KAL, "stroke-linecap": "round", "stroke-linejoin": "round" }); ust.append(p);
      parcalar.push({ p, i });
    });
    svg._parcalar = parcalar; svg._isaret = isaret;
    return svg;
  }
  function isaretCiz(svg) {
    const ik = svg._isaret; ik.replaceChildren(); const yerler = [];
    svg._parcalar.forEach((pr) => {
      let x, y, ax = 0, ay = 0;
      if (pr.nokta) { [x, y] = pr.bas; x += 9; y -= 6; }
      else {
        const L = pr.p.getTotalLength(), a = pr.p.getPointAtLength(0), b = pr.p.getPointAtLength(Math.min(L, 6));
        ax = b.x - a.x; ay = b.y - a.y; const n = Math.hypot(ax, ay) || 1; ax /= n; ay /= n;
        /* numara, başlangıcın hemen dışında (yönün tersi tarafında, yana kaydırılmış) */
        const aday = [[-9, 8], [-9, -8], [-14, 0], [0, 12], [0, -12], [-18, 10], [-18, -10]].map(([g, y2]) => [a.x + ax * g - ay * y2, a.y + ay * g + ax * y2]);
        [x, y] = aday.find(([cx, cy]) => yerler.every(([px, py]) => Math.hypot(px - cx, py - cy) >= 12.5)) || aday[0];
        /* yol üstünde küçük ok: uzunluğun ortası */
        const m = pr.p.getPointAtLength(L * 0.55), m2 = pr.p.getPointAtLength(Math.min(L, L * 0.55 + 2)), dx = m2.x - m.x, dy = m2.y - m.y, nn = Math.hypot(dx, dy) || 1, ux = dx / nn, uy = dy / nn;
        const ox = m.x - uy * 9, oy = m.y + ux * 9;
        ik.append(el("path", { d: `M${(ox - ux * 5 - uy * 3).toFixed(1)} ${(oy - uy * 5 + ux * 3).toFixed(1)} L${(ox + ux * 2).toFixed(1)} ${(oy + uy * 2).toFixed(1)} L${(ox - ux * 5 + uy * 3).toFixed(1)} ${(oy - uy * 5 - ux * 3).toFixed(1)}`, fill: "none", stroke: RENK[pr.i % 5], "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      }
      yerler.push([x, y]); ik.append(el("circle", { cx: x, cy: y, r: 5.6, fill: RENK[pr.i % 5] }));
      const t = el("text", { x, y: y + 2.3, "text-anchor": "middle", "font-size": 7.5, "font-weight": 800, fill: "#fff", "font-family": "Onest, sans-serif" }); t.textContent = pr.i + 1; ik.append(t);
    });
  }
  /* sırayla çiz; kalem noktası çizginin ucunda ilerler */
  function oynat(svg, hiz = 1) {
    const no = (svg._no = (svg._no || 0) + 1);
    svg._parcalar.forEach((pr) => { if (pr.nokta) pr.d.setAttribute("opacity", 0); else { const L = pr.p.getTotalLength(); pr.L = L; pr.p.style.strokeDasharray = L + " " + L; pr.p.style.strokeDashoffset = L; } });
    let kalem = svg.querySelector(".yz-kalem"); if (!kalem) { kalem = el("circle", { r: 4.2, class: "yz-kalem", fill: "#FFB648", stroke: "#fff", "stroke-width": 1.5 }); svg.append(kalem); }
    kalem.setAttribute("opacity", 1);
    let i = 0;
    const sonraki = () => {
      if (no !== svg._no) return;
      if (i >= svg._parcalar.length) { kalem.setAttribute("opacity", 0); return; }
      const pr = svg._parcalar[i++];
      if (pr.nokta) { kalem.setAttribute("cx", pr.bas[0]); kalem.setAttribute("cy", pr.bas[1]); pr.d.setAttribute("opacity", 1); setTimeout(sonraki, 450 / hiz); return; }
      const sure = Math.max(500, pr.L * 11) / hiz, t0 = performance.now();
      const ad = (z) => { if (no !== svg._no) return; const p = Math.min(1, (z - t0) / sure), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; pr.p.style.strokeDashoffset = pr.L * (1 - e); const q = pr.p.getPointAtLength(pr.L * e); kalem.setAttribute("cx", q.x); kalem.setAttribute("cy", q.y); if (p < 1) requestAnimationFrame(ad); else setTimeout(sonraki, 260 / hiz); };
      requestAnimationFrame(ad);
    };
    setTimeout(sonraki, 250);
  }

  /* Bir harfin küçük ve büyük biçimini yan yana gösteren kart */
  T.harfYazilis = function (l, o = {}) {
    const buyuk = l.toLocaleUpperCase("tr-TR");
    const svgK = harfSvg(l), svgB = harfSvg(buyuk);
    const kart = h("div.yz-kart" + (o.kucuk ? ".kucuk" : ""), h("div.yz-ikili", h("figure.yz-fig", svgB, h("figcaption", "Büyük " + buyuk)), h("figure.yz-fig", svgK, h("figcaption", "Küçük " + l))));
    const goster = () => { [svgB, svgK].forEach((s) => s && isaretCiz(s)); oynat(svgB); setTimeout(() => oynat(svgK), o.birlikte ? 0 : 400 + svgB._parcalar.reduce((t, p) => t + (p.nokta ? 450 : Math.max(500, (p.p.getTotalLength() || 0) * 11) + 260), 0)); };
    kart._goster = goster;
    requestAnimationFrame(() => requestAnimationFrame(goster));
    return kart;
  };

  /* Harf sesi: harfin adı değil, kendisi ("nnn"). Sunucuda bir kez üretilir, sonra hep aynısı çalar. */
  const harfOnbellek = new Map();
  T.harfSesi = async function (l) {
    l = T.trLower(String(l || "")).trim(); if (!l) return;
    T.sesDur && T.sesDur();
    try {
      let url = harfOnbellek.get(l);
      if (!url) {
        if (T.sesTercih && T.sesTercih() === "cihaz") throw 0;
        const r = await fetch("/api/ses", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ metin: l, tur: "harf" }) });
        if (!r.ok) throw 0;
        url = URL.createObjectURL(await r.blob()); harfOnbellek.set(l, url);
      }
      const a = new Audio(url); T._calan = a; await a.play();
    } catch (e) {
      if ("aeıioöuü".includes(l)) T.speak(l);
      else T.toast("Harf sesi şu an çalınamıyor. Sesi siz verin: " + l + l + l);
    }
  };
})();
