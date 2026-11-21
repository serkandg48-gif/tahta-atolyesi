/* Oyun sahneleri: her oyunun arkasında elle çizilmiş, yumuşak renkli bir mekân.
   Market, mutfak, çiftlik, bahçe, atölye, sınıf ve sanat odası. Ön plandaki oyun okunur kalsın diye renkler sakin. */
(function () {
  const ortak = `<defs>
    <linearGradient id="sz-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcdf2"/><stop offset="1" stop-color="#e8f6ff"/></linearGradient>
    <radialGradient id="sz-isik" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="sz-tahta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a06a"/><stop offset="1" stop-color="#b4784a"/></linearGradient>
    <filter id="sz-bulan"><feGaussianBlur stdDeviation="2.2"/></filter>
  </defs>`;
  const raf = (y, renkler, n, seed) => { let s = "", r = seed; const rn = () => ((r = (r * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < n; i++) { const x = 40 + i * (1120 / n) + rn() * 20, w = 30 + rn() * 36, h = 40 + rn() * 50, c = renkler[i % renkler.length]; s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="7" fill="${c}"/><rect x="${x + 5}" y="${y - h + 8}" width="${w - 10}" height="${Math.min(14, h / 4)}" rx="3" fill="#fff" opacity=".55"/>`; } return s; };
  const S = {
    market: `<rect width="1200" height="700" fill="#fff4e6"/><rect y="0" width="1200" height="70" fill="#f28f6b"/>${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 100} 70 q50 46 100 0Z" fill="${i % 2 ? "#fff" : "#f8b394"}"/>`).join("")}
      <g filter="url(#sz-bulan)" opacity=".85">${[200, 330, 460].map((y) => `<rect x="20" y="${y}" width="1160" height="14" rx="4" fill="#c98a5a"/>`).join("")}
      ${raf(200, ["#ff8a80", "#ffd166", "#7bdcb5", "#8ecae6", "#cdb4db"], 16, 3)}${raf(330, ["#ffb703", "#90be6d", "#f4978e", "#80ced7", "#e9c46a"], 16, 7)}${raf(460, ["#a2d2ff", "#ffafcc", "#bde0fe", "#f9c74f", "#43aa8b"], 16, 11)}</g>
      <rect y="560" width="1200" height="140" fill="#e9d5bd"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 100}" y="560" width="100" height="140" fill="${i % 2 ? "#e2c9ab" : "#efdcc4"}"/>`).join("")}<rect width="1200" height="700" fill="url(#sz-isik)"/>`,
    mutfak: `<rect width="1200" height="700" fill="#fff1e0"/>${Array.from({ length: 24 }, (_, i) => Array.from({ length: 7 }, (_, j) => `<rect x="${i * 50}" y="${j * 50 + 180}" width="48" height="48" rx="4" fill="${(i + j) % 2 ? "#ffffff" : "#f7e4cf"}"/>`).join("")).join("")}
      <g filter="url(#sz-bulan)"><rect x="40" y="30" width="420" height="140" rx="16" fill="#9ed8c3"/><rect x="60" y="48" width="180" height="104" rx="10" fill="#b8e6d6"/><rect x="260" y="48" width="180" height="104" rx="10" fill="#b8e6d6"/><circle cx="230" cy="100" r="6" fill="#f2c14e"/><circle cx="270" cy="100" r="6" fill="#f2c14e"/>
      <rect x="760" y="30" width="400" height="140" rx="16" fill="#9ed8c3"/><rect x="780" y="48" width="170" height="104" rx="10" fill="#b8e6d6"/><rect x="970" y="48" width="170" height="104" rx="10" fill="#b8e6d6"/>
      <rect x="520" y="40" width="180" height="120" rx="14" fill="#cfeeff" stroke="#e8c79a" stroke-width="10"/><path d="M610 40v120M520 100h180" stroke="#e8c79a" stroke-width="7"/>
      <circle cx="560" cy="250" r="34" fill="#f6c06b"/><circle cx="640" cy="250" r="26" fill="#ef8f6a"/><path d="M90 240h70v60h-70z" fill="#ffd9a8"/><path d="M1000 230q40-30 80 0v70h-80z" fill="#f2a65a"/></g>
      <rect y="540" width="1200" height="160" fill="url(#sz-tahta)"/><rect y="536" width="1200" height="12" fill="#c98a5a"/>`,
    ciftlik: `<rect width="1200" height="700" fill="url(#sz-gok)"/><circle cx="1040" cy="110" r="60" fill="#fff3b0"/><circle cx="1040" cy="110" r="90" fill="#fff3b0" opacity=".35"/>
      <g fill="#fff" opacity=".9"><ellipse cx="220" cy="120" rx="80" ry="28"/><ellipse cx="280" cy="100" rx="60" ry="34"/><ellipse cx="640" cy="80" rx="70" ry="24"/><ellipse cx="690" cy="66" rx="48" ry="28"/></g>
      <path d="M0 420 C200 340 380 380 560 350 C760 320 960 380 1200 340 V700 H0Z" fill="#a9d68c"/>
      <g filter="url(#sz-bulan)"><path d="M780 420 L780 270 L880 210 L980 270 L980 420Z" fill="#d9534f"/><path d="M770 276 L880 200 L990 276" stroke="#fff" stroke-width="14" fill="none" stroke-linejoin="round"/><rect x="845" y="320" width="70" height="100" fill="#fff"/><path d="M845 320l70 100M915 320l-70 100" stroke="#d9534f" stroke-width="8"/>
      <rect x="1010" y="300" width="60" height="120" rx="30" fill="#c9c3b8"/><path d="M1010 300q30-40 60 0" fill="#9e9789"/></g>
      <path d="M0 500 C260 450 520 490 760 460 C960 436 1080 470 1200 456 V700 H0Z" fill="#8cc56f"/>
      ${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 80}" y="470" width="12" height="70" rx="4" fill="#e6c9a0"/>`).join("")}<rect y="486" width="1200" height="10" fill="#e6c9a0"/><rect y="514" width="1200" height="10" fill="#e6c9a0"/>
      <path d="M0 600 C300 560 700 610 1200 570 V700 H0Z" fill="#79b65b"/>`,
    bahce: `<rect width="1200" height="700" fill="url(#sz-gok)"/><g fill="#fff" opacity=".9"><ellipse cx="300" cy="110" rx="90" ry="28"/><ellipse cx="360" cy="92" rx="60" ry="32"/><ellipse cx="900" cy="140" rx="80" ry="24"/></g>
      <path d="M0 380 C220 330 420 370 640 340 C860 310 1020 360 1200 330 V700 H0Z" fill="#b7df9a"/>
      <g filter="url(#sz-bulan)">${[[90, 360], [230, 330], [1080, 340], [960, 310]].map(([x, y]) => `<rect x="${x - 8}" y="${y - 10}" width="16" height="50" fill="#9b6b43"/><circle cx="${x}" cy="${y - 40}" r="46" fill="#6fb25a"/><circle cx="${x - 26}" cy="${y - 20}" r="30" fill="#7fc267"/><circle cx="${x + 28}" cy="${y - 24}" r="32" fill="#63a750"/>`).join("")}</g>
      <path d="M0 470 C300 430 600 480 900 450 C1040 436 1120 452 1200 446 V700 H0Z" fill="#9fd07f"/>
      ${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 97) % 1200}" cy="${560 + (i * 37) % 120}" r="7" fill="${["#ffd166", "#ff8fab", "#ffffff", "#cdb4db"][i % 4]}"/>`).join("")}`,
    atolye: `<rect width="1200" height="700" fill="#e7eef7"/><rect x="0" y="0" width="1200" height="420" fill="#dbe6f2"/>
      <g filter="url(#sz-bulan)" opacity=".9"><rect x="60" y="60" width="440" height="260" rx="14" fill="#c9a77d"/>${Array.from({ length: 9 }, (_, i) => Array.from({ length: 5 }, (_, j) => `<circle cx="${90 + i * 48}" cy="${90 + j * 48}" r="4" fill="#8a6a46"/>`).join("")).join("")}
      <path d="M120 120h70v16h-70z" fill="#7a8ca3"/><circle cx="300" cy="180" r="40" fill="none" stroke="#f2a541" stroke-width="16" stroke-dasharray="14 10"/><circle cx="410" cy="140" r="26" fill="none" stroke="#7ab3e8" stroke-width="12" stroke-dasharray="10 8"/><path d="M140 240l60-40 20 30-60 40z" fill="#e57373"/>
      <rect x="760" y="80" width="200" height="140" rx="14" fill="#cfeeff" stroke="#9fb3c8" stroke-width="10"/><path d="M860 80v140M760 150h200" stroke="#9fb3c8" stroke-width="7"/>
      <circle cx="1080" cy="160" r="54" fill="none" stroke="#b0bdcc" stroke-width="18" stroke-dasharray="16 12"/></g>
      <rect y="440" width="1200" height="260" fill="#c4d2e1"/><rect y="430" width="1200" height="20" fill="#9fb3c8"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${i * 200 + 20}" y="470" width="160" height="200" rx="12" fill="#b6c6d8"/><rect x="${i * 200 + 80}" y="490" width="40" height="10" rx="5" fill="#8fa3bb"/>`).join("")}`,
    sinif: `<rect width="1200" height="700" fill="#fdf3e3"/><rect y="520" width="1200" height="180" fill="#e8cfa9"/>${Array.from({ length: 13 }, (_, i) => `<rect x="${i * 96}" y="520" width="4" height="180" fill="#dcbf95"/>`).join("")}
      <g filter="url(#sz-bulan)"><rect x="260" y="60" width="680" height="300" rx="16" fill="#2f5d50" stroke="#b5835a" stroke-width="18"/><path d="M320 140h160M320 190h240M620 140q40-30 80 0" stroke="#fff" stroke-width="6" opacity=".5" fill="none" stroke-linecap="round"/>
      <rect x="40" y="120" width="160" height="380" rx="10" fill="#c98a5a"/>${[0, 1, 2, 3].map((j) => `<rect x="40" y="${200 + j * 90}" width="160" height="10" fill="#a86c3f"/>` + [0, 1, 2, 3, 4].map((i) => `<rect x="${52 + i * 28}" y="${140 + j * 90}" width="22" height="58" rx="3" fill="${["#ef6f6c", "#6cb4ee", "#f6c453", "#7bc67e", "#b58ce6"][(i + j) % 5]}"/>`).join("")).join("")}
      <rect x="1000" y="120" width="160" height="200" rx="12" fill="#cfeeff" stroke="#e8c79a" stroke-width="10"/><path d="M1080 120v200M1000 220h160" stroke="#e8c79a" stroke-width="7"/>
      ${Array.from({ length: 8 }, (_, i) => `<path d="M${280 + i * 85} 30 l30 30 l30 -30" fill="${["#ff8fab", "#ffd166", "#8ecae6", "#90be6d"][i % 4]}"/>`).join("")}<path d="M260 30h700" stroke="#b5835a" stroke-width="3"/></g>`,
    sanat: `<rect width="1200" height="700" fill="#fbeef6"/><rect y="520" width="1200" height="180" fill="#ead7e6"/>
      <g filter="url(#sz-bulan)"><path d="M120 520 L200 140 L280 520" stroke="#b5835a" stroke-width="12" fill="none"/><rect x="120" y="170" width="160" height="200" rx="6" fill="#fff" stroke="#e0c9a6" stroke-width="8"/><circle cx="170" cy="240" r="30" fill="#ffd166"/><path d="M135 340q50-70 130 0" fill="#90be6d"/>
      <ellipse cx="1000" cy="250" rx="110" ry="150" fill="#cfe8ff" stroke="#d9b36c" stroke-width="16"/><path d="M940 180q30-30 50-20" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>
      ${["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#9b5de5"].map((c, i) => `<circle cx="${480 + i * 70}" cy="${110 + (i % 2) * 30}" r="${26 + (i % 3) * 6}" fill="${c}" opacity=".55"/>`).join("")}
      <path d="M520 520q40-60 80 0z" fill="#9b5de5" opacity=".6"/><path d="M640 520q30-40 60 0z" fill="#ef476f" opacity=".6"/></g>`,
  };
  /* Canva'da üretilen resim gibi sahneler; olanlar çizim yerine kullanılır */
  const RESIM = { market: "/sahne/market.webp", mutfak: "/sahne/mutfak.webp", ciftlik: "/sahne/ciftlik.webp", bahce: "/sahne/bahce.webp", atolye: "/sahne/atolye.webp", sinif: "/sahne/sinif.webp", sanat: "/sahne/sanat.webp" };
  T.oyunSahnesi = (ad) => RESIM[ad] ? `url("${RESIM[ad]}")` : (S[ad] ? "url(\"data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">${ortak}${S[ad]}</svg>`) + "\")" : null);
  /* hangi oyun hangi sahnede */
  T.OYUN_SAHNE = { "Market kasası: tahmin et": "market", "Market kasası: para üstü": "market", "Fide bahçesi": "bahce", "Kurabiye paylaşımı": "mutfak", "Sayı makinesi": "atolye", "Çiftlik problemleri": "ciftlik",
    "Problem kurucu": "sinif", "Eşitlik terazisi": "atolye", "Cisim dedektifi": "atolye", "Şekil kutuları": "sinif", "Nokta tahtası": "sinif", "Karınca turu": "bahce", "Limonata standı": "mutfak",
    "Ayna avcısı": "sanat", "Ayna boyama": "sanat", "Kodla ve aynala": "atolye", "Sınıf anketi": "sinif" };
  /* Ponpon'u tek başına bir SVG olarak çiz (rehber köşesi için) */
  T.ponponSvg = function (yuz) {
    const s = T.svg("svg", { viewBox: "-150 -175 300 330", class: "dn-svg pp-rehber" });
    s.innerHTML = T.PONPON_DEFS; const pp = T.ponpon(0, 0, { yuz, kollar: [[-112, 70], [112, 70]], bak: [0, 4] }); s.append(pp.govde, pp.eller); return s;
  };
})();
