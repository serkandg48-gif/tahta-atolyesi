/* Öğrenci karakterleri: hayali çocuk figürleri. Gerçek bir kişiyi göstermez.
   Varsayılan görünüş adtan türetilir; çocuk saçını, ten rengini, kıyafetini ve aksesuarını kendisi seçebilir.
   T.avatar(ad, boy): yuvarlak çerçevede baş ve omuz. T.karakter(ad, boy): boydan figür. */
(function () {
  const TEN = ["#F6D3B3", "#EEC09A", "#DDA67C", "#C68A5E", "#A06A43", "#7A4B2C"];
  const SAC_RENK = ["#2B1D16", "#5A3A22", "#8A5A2B", "#C98B3A", "#E3C17A", "#B5462B"];
  const KIYAFET = ["#E4553F", "#F2A93B", "#3FA35B", "#2E8FD6", "#7B5CD0", "#E86FA0", "#1F9E9A", "#3B4A6B"];
  const SAC = ["Kısa", "Kıvırcık", "At kuyruğu", "İki örgü", "Uzun", "Topuz"];
  const AKS = ["Yok", "Gözlük", "Şapka", "Saç bandı"];
  T.KARAKTER = { TEN, SAC_RENK, KIYAFET, SAC, AKS };
  let say = 0;
  const kar = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = (x) => Math.max(0, Math.min(255, Math.round(x * k))); return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((x) => f(x).toString(16).padStart(2, "0")).join(""); };
  function ayar(seed) {
    let hs = 0; for (const c of String(seed)) hs = (hs * 31 + c.charCodeAt(0)) >>> 0;
    const o = { t: hs % TEN.length, s: (hs >>> 3) % SAC.length, r: (hs >>> 6) % 4, k: (hs >>> 9) % KIYAFET.length, a: (hs >>> 12) % 7 === 0 ? 1 : 0 };
    try { const st = T.store && T.store.get(), sec = st && st.avatarlar && (st.avatarlar[st.activeClassId] || {})[seed]; if (sec && sec.t != null) Object.assign(o, sec); } catch (e) {}
    return o;
  }
  T.karakterAyar = ayar;
  /* 100 × 140 kutuda boydan çocuk */
  function govde(o, id) {
    const ten = TEN[o.t], tenK = kar(ten, 0.86), sac = SAC_RENK[o.r], sacA = kar(sac, 1.35), giy = KIYAFET[o.k], giyK = kar(giy, 0.78), pan = "#34405A";
    const arka = [
      "", // kısa
      `<g fill="${sac}">${[[34, 26], [40, 18], [50, 15], [60, 18], [66, 26], [68, 36], [32, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8"/>`).join("")}</g>`,
      `<path d="M64 30 C80 34 78 58 70 64 C72 52 70 42 62 36 Z" fill="${sac}"/>`,
      `<path d="M33 36 C28 50 30 62 34 70 L38 70 C36 60 36 48 38 40 Z M67 36 C72 50 70 62 66 70 L62 70 C64 60 64 48 62 40 Z" fill="${sac}"/><circle cx="36" cy="71" r="3" fill="${KIYAFET[(o.k + 3) % 8]}"/><circle cx="64" cy="71" r="3" fill="${KIYAFET[(o.k + 3) % 8]}"/>`,
      `<path d="M31 32 C28 50 30 60 34 62 L66 62 C70 60 72 50 69 32 Z" fill="${sac}"/>`,
      `<circle cx="50" cy="12" r="8" fill="${sac}"/>`,
    ][o.s];
    const on = [
      `<path d="M33 34 C32 20 42 15 50 15 C60 15 68 20 67 34 C62 27 56 25 50 27 C44 24 38 27 33 34 Z" fill="${sac}"/>`,
      `<path d="M34 32 C34 22 42 17 50 17 C58 17 66 22 66 32 C60 26 40 26 34 32 Z" fill="${sac}"/>`,
      `<path d="M33 34 C32 20 42 15 50 15 C60 15 68 20 67 34 C62 24 52 22 44 26 C40 28 36 30 33 34 Z" fill="${sac}"/>`,
      `<path d="M33 35 C32 20 42 15 50 15 C58 15 68 20 67 35 C64 26 56 23 50 23 C44 23 36 26 33 35 Z" fill="${sac}"/><path d="M50 15 L50 24" stroke="${kar(sac, 0.7)}" stroke-width="1.2"/>`,
      `<path d="M32 36 C31 20 42 15 50 15 C60 15 69 20 68 36 C64 26 58 23 50 23 C44 23 38 26 32 36 Z" fill="${sac}"/>`,
      `<path d="M33 33 C33 21 42 17 50 17 C58 17 67 21 67 33 C61 26 39 26 33 33 Z" fill="${sac}"/>`,
    ][o.s];
    const parlak = `<path d="M40 21 C45 18 52 18 56 20" stroke="${sacA}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`;
    const aks = [
      "",
      `<g fill="none" stroke="#2B2B33" stroke-width="1.6"><circle cx="43" cy="36" r="5"/><circle cx="57" cy="36" r="5"/><path d="M48 36 h4 M38 35 l-4 -1 M62 35 l4 -1"/></g>`,
      `<path d="M31 27 C32 14 68 14 69 27 Z" fill="${KIYAFET[(o.k + 2) % 8]}"/><path d="M30 27 h30 c8 0 12 2 14 4 h-44 z" fill="${kar(KIYAFET[(o.k + 2) % 8], 0.8)}"/>`,
      `<path d="M33 27 C38 19 62 19 67 27" stroke="${KIYAFET[(o.k + 4) % 8]}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    ][o.a];
    return `<defs><linearGradient id="g${id}" x1="0" x2="1"><stop offset="0" stop-color="${giy}"/><stop offset="1" stop-color="${giyK}"/></linearGradient><radialGradient id="y${id}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="${kar(ten, 1.05)}"/><stop offset="1" stop-color="${tenK}"/></radialGradient></defs>
      ${arka}
      <path d="M38 116 h10 v-20 h-10 z M52 116 h10 v-20 h-10 z" fill="${pan}"/><path d="M49 98 v18" stroke="${kar(pan, 0.8)}" stroke-width="1"/>
      <path d="M35 121 c0 -5 3 -6 7 -6 h7 v6 z M65 121 c0 -5 -3 -6 -7 -6 h-7 v6 z" fill="#F4F6F8" stroke="#4A5468" stroke-width="1.2"/><path d="M35 121 h14 M51 121 h14" stroke="${KIYAFET[(o.k + 5) % 8]}" stroke-width="2"/>
      <path d="M30 62 C30 56 38 53 50 53 C62 53 70 56 70 62 L70 98 L30 98 Z" fill="url(#g${id})"/>
      <path d="M30 60 C24 66 22 80 24 92 L31 92 C30 82 31 72 34 66 Z M70 60 C76 66 78 80 76 92 L69 92 C70 82 69 72 66 66 Z" fill="${giyK}"/>
      <circle cx="27.5" cy="94" r="4.5" fill="${ten}"/><circle cx="72.5" cy="94" r="4.5" fill="${ten}"/>
      <path d="M44 53 h12 l-6 7 z" fill="${tenK}"/>
      <rect x="45" y="47" width="10" height="8" rx="3" fill="${tenK}"/>
      <circle cx="33" cy="37" r="4" fill="${tenK}"/><circle cx="67" cy="37" r="4" fill="${tenK}"/>
      <ellipse cx="50" cy="35" rx="16.5" ry="17.5" fill="url(#y${id})"/>
      <ellipse cx="43.5" cy="37" rx="2.2" ry="2.8" fill="#2B2B33"/><ellipse cx="56.5" cy="37" rx="2.2" ry="2.8" fill="#2B2B33"/>
      <circle cx="44.3" cy="36" r=".8" fill="#fff"/><circle cx="57.3" cy="36" r=".8" fill="#fff"/>
      <ellipse cx="39.5" cy="42.5" rx="3" ry="1.8" fill="#F08F8F" opacity=".45"/><ellipse cx="60.5" cy="42.5" rx="3" ry="1.8" fill="#F08F8F" opacity=".45"/>
      <path d="M48.5 40.5 q1.5 1.2 3 0" stroke="${kar(ten, 0.7)}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M45 45 q5 4 10 0" stroke="#7A3B2E" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      ${on}${parlak}${aks}`;
  }
  T.karakter = function (seed, boy = 120) {
    const id = "k" + ++say, s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 4 100 120"); s.setAttribute("height", boy); s.setAttribute("width", Math.round(boy * 100 / 120));
    s.setAttribute("class", "krk"); s.setAttribute("aria-hidden", "true"); s.innerHTML = govde(ayar(seed), id); return s;
  };
  /* baş ve omuz, yuvarlak çerçevede */
  T.avatar = function (seed, size = 64) {
    const o = ayar(seed), id = "a" + ++say, s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 64 64"); s.setAttribute("width", size); s.setAttribute("height", size); s.setAttribute("class", "av"); s.setAttribute("aria-hidden", "true");
    const zemin = kar(KIYAFET[(o.k + 4) % 8], 1.25);
    s.innerHTML = `<defs><clipPath id="c${id}"><circle cx="32" cy="32" r="31"/></clipPath></defs><circle cx="32" cy="32" r="31" fill="${zemin}"/><g clip-path="url(#c${id})"><g transform="translate(-12 2) scale(.88)">${govde(o, id)}</g></g><circle cx="32" cy="32" r="30.5" fill="none" stroke="rgba(0,0,0,.08)"/>`;
    return s;
  };
})();
