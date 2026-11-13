/* El çizimi havasında, iki tonlu çizgi simgeler. 48x48 kutu. */
T.ICONS = {
  home: '<path class="f" d="M10 22 24 10l14 12v16H10z"/><path d="M7 23 24 8l17 15M11 20v19h26V20M20 39V28h8v11"/>',
  board: '<rect class="f" x="6" y="9" width="36" height="24" rx="3"/><rect x="6" y="9" width="36" height="24" rx="3"/><path d="M15 39l5-6M33 39l-5-6M12 17h10M12 23h16"/>',
  class: '<circle class="f" cx="17" cy="17" r="7"/><circle cx="17" cy="17" r="7"/><circle cx="33" cy="19" r="5"/><path d="M5 39c1-8 6-12 12-12s11 4 12 12M28 30c2-2 3-3 6-3 5 0 8 4 9 10"/>',
  math: '<rect class="f" x="7" y="7" width="34" height="34" rx="6"/><path d="M14 17h8M18 13v8M28 17h7M14 31l7-6M14 25l7 6M28 28h7M28 33h7"/>',
  turkce: '<path class="f" d="M8 10h13c2 0 3 1 3 3v26c0-2-1-3-3-3H8z"/><path d="M8 10h13c2 0 3 1 3 3v26c0-2-1-3-3-3H8zM40 10H27c-2 0-3 1-3 3v26c0-2 1-3 3-3h13zM12 17h7M12 23h7M29 17h7M29 23h7"/>',
  fen: '<path class="f" d="M14 30h20l4 8H10z"/><path d="M19 7h10M21 7v12L10 38h28L27 19V7M15 30h18"/><circle cx="22" cy="34" r="1.5"/><circle cx="28" cy="32" r="1.5"/>',
  sosyal: '<circle class="f" cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="16"/><path d="M8 24h32M24 8c5 5 7 10 7 16s-2 11-7 16c-5-5-7-10-7-16s2-11 7-16z"/>',
  ingilizce: '<path class="f" d="M7 11h26v18H17l-8 7v-7H7z"/><path d="M7 11h26v18H17l-8 7v-7H7zM37 18h4v16h-3v6l-6-6h-9"/><path d="M13 17v7M13 20h5M18 17v7M23 17v7"/>',
  zeka: '<path class="f" d="M24 6c-8 0-13 6-13 12 0 5 3 8 5 10 1 1 2 3 2 5h12c0-2 1-4 2-5 2-2 5-5 5-10 0-6-5-12-13-12z"/><path d="M24 6c-8 0-13 6-13 12 0 5 3 8 5 10 1 1 2 3 2 5h12c0-2 1-4 2-5 2-2 5-5 5-10 0-6-5-12-13-12zM19 38h10M21 42h6M24 14v8M20 20l4 4 4-4"/>',
  plan: '<path class="f" d="M11 7h20l6 6v28H11z"/><path d="M11 7h20l6 6v28H11zM31 7v6h6M17 20h14M17 26h14M17 32h8"/><path d="M33 31l8-8 3 3-8 8h-3z"/>',
  settings: '<circle class="f" cx="24" cy="24" r="7"/><circle cx="24" cy="24" r="7"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4.2 4.2M33.3 33.3l4.2 4.2M10.5 37.5l4.2-4.2M33.3 14.7l4.2-4.2"/>',
  timer: '<circle class="f" cx="24" cy="27" r="15"/><circle cx="24" cy="27" r="15"/><path d="M20 5h8M24 5v7M24 27l6-6M37 13l3-3"/>',
  name: '<rect class="f" x="7" y="12" width="34" height="24" rx="5"/><rect x="7" y="12" width="34" height="24" rx="5"/><path d="M14 22h12M14 28h20M34 6l-4 6M14 6l4 6"/>',
  dice: '<rect class="f" x="8" y="8" width="32" height="32" rx="7"/><rect x="8" y="8" width="32" height="32" rx="7"/><circle cx="17" cy="17" r="2.4"/><circle cx="31" cy="31" r="2.4"/><circle cx="24" cy="24" r="2.4"/><circle cx="31" cy="17" r="2.4"/><circle cx="17" cy="31" r="2.4"/>',
  groups: '<circle class="f" cx="14" cy="14" r="6"/><circle cx="14" cy="14" r="6"/><circle cx="34" cy="14" r="6"/><circle cx="14" cy="34" r="6"/><circle cx="34" cy="34" r="6"/><path d="M24 6v36M6 24h36" stroke-dasharray="3 4"/>',
  noise: '<rect class="f" x="18" y="6" width="12" height="22" rx="6"/><rect x="18" y="6" width="12" height="22" rx="6"/><path d="M11 22c0 8 6 13 13 13s13-5 13-13M24 35v7M17 42h14"/>',
  traffic: '<rect class="f" x="15" y="4" width="18" height="40" rx="6"/><rect x="15" y="4" width="18" height="40" rx="6"/><circle cx="24" cy="13" r="4"/><circle cx="24" cy="24" r="4"/><circle cx="24" cy="35" r="4"/>',
  hand: '<path class="f" d="M15 24V12a3 3 0 0 1 6 0v10V9a3 3 0 0 1 6 0v13-9a3 3 0 0 1 6 0v17c0 8-5 13-12 13-5 0-8-3-10-7l-5-8c-1-2 1-4 3-3z"/><path d="M15 24V12a3 3 0 0 1 6 0v10V9a3 3 0 0 1 6 0v13-9a3 3 0 0 1 6 0v17c0 8-5 13-12 13-5 0-8-3-10-7l-5-8c-1-2 1-4 3-3l6 5"/>',
  text: '<rect class="f" x="7" y="8" width="34" height="32" rx="4"/><rect x="7" y="8" width="34" height="32" rx="4"/><path d="M14 17h20M14 24h20M14 31h12"/>',
  trophy: '<path class="f" d="M14 7h20v10c0 6-4 11-10 11s-10-5-10-11z"/><path d="M14 7h20v10c0 6-4 11-10 11s-10-5-10-11zM14 11H7c0 6 3 9 7 9M34 11h7c0 6-3 9-7 9M24 28v7M16 41h16M18 41l2-6h8l2 6"/>',
  clock: '<circle class="f" cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="17"/><path d="M24 13v11l8 5"/>',
  qr: '<rect x="7" y="7" width="13" height="13" rx="2"/><rect x="28" y="7" width="13" height="13" rx="2"/><rect x="7" y="28" width="13" height="13" rx="2"/><path class="f" d="M28 28h6v6h-6zM35 35h6v6h-6z"/><path d="M28 28h6v6M35 41h6v-6M28 41v-3"/>',
  ticket: '<path class="f" d="M6 14h36v6a4 4 0 0 0 0 8v6H6v-6a4 4 0 0 0 0-8z"/><path d="M6 14h36v6a4 4 0 0 0 0 8v6H6v-6a4 4 0 0 0 0-8zM30 14v20" stroke-dasharray="3 3"/><path d="M13 24c2 2 6 2 8 0"/>',
  pen: '<path class="f" d="M30 8l10 10-20 20H10V28z"/><path d="M30 8l10 10-20 20H10V28zM26 12l10 10"/>',
  calendar: '<rect class="f" x="7" y="10" width="34" height="31" rx="4"/><rect x="7" y="10" width="34" height="31" rx="4"/><path d="M7 19h34M16 6v8M32 6v8M15 27h4M22 27h4M29 27h4M15 33h4M22 33h4"/>',
  plus: '<path d="M24 10v28M10 24h28"/>',
  close: '<path d="M13 13l22 22M35 13 13 35"/>',
  check: '<path d="M10 25l9 9 19-20"/>',
  play: '<path class="f" d="M15 9l24 15-24 15z"/><path d="M15 9l24 15-24 15z"/>',
  pause: '<rect class="f" x="12" y="9" width="8" height="30" rx="2"/><rect x="28" y="9" width="8" height="30" rx="2"/><rect x="12" y="9" width="8" height="30" rx="2"/>',
  reset: '<path d="M10 24a14 14 0 1 0 4-10M10 8v8h8"/>',
  copy: '<rect class="f" x="15" y="15" width="25" height="25" rx="4"/><rect x="15" y="15" width="25" height="25" rx="4"/><path d="M33 15V11a3 3 0 0 0-3-3H11a3 3 0 0 0-3 3v19a3 3 0 0 0 3 3h4"/>',
  download: '<path d="M24 8v22M15 21l9 9 9-9M9 38h30"/>',
  spark: '<path class="f" d="M24 6l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"/><path d="M24 6l4 12 12 4-12 4-4 12-4-12-12-4 12-4zM38 34l1 4 4 1-4 1-1 4-1-4-4-1 4-1z"/>',
  back: '<path d="M28 10 14 24l14 14"/>',
  next: '<path d="M20 10l14 14-14 14"/>',
  up: '<path d="M10 30l14-14 14 14"/>',
  down: '<path d="M10 18l14 14 14-14"/>',
  star: '<path class="f" d="M24 6l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/><path d="M24 6l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>',
  speaker: '<path class="f" d="M8 19h8l10-8v26l-10-8H8z"/><path d="M8 19h8l10-8v26l-10-8H8zM32 18c2 2 3 4 3 6s-1 4-3 6M37 13c3 3 5 7 5 11s-2 8-5 11"/>',
  mic: '<path d="M24 6a6 6 0 0 1 6 6v12a6 6 0 0 1-12 0V12a6 6 0 0 1 6-6zM12 22a12 12 0 0 0 24 0M24 34v8M17 42h14"/>',
  trash: '<path class="f" d="M12 14h24l-2 27H14z"/><path d="M8 14h32M12 14l2 27h20l2-27M19 14V8h10v6M20 21v13M28 21v13"/>',
  rotate: '<path d="M38 24a14 14 0 1 1-4-10M38 8v8h-8"/>',
  eye: '<path class="f" d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z"/><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z"/><circle cx="24" cy="24" r="5"/>',
  eyeoff: '<path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24zM8 8l32 32"/>',
  blocks: '<rect class="f" x="6" y="6" width="22" height="22"/><path d="M6 6h22v22H6zM6 13h22M6 20h22M13 6v22M20 6v22M33 6h5v22h-5zM33 13h5M33 20h5"/><rect x="33" y="33" width="5" height="5"/><rect x="6" y="33" width="5" height="5"/>',
  frame: '<rect class="f" x="5" y="14" width="38" height="20" rx="2"/><path d="M5 14h38v20H5zM5 24h38M12.6 14v20M20.2 14v20M27.8 14v20M35.4 14v20"/><circle cx="8.8" cy="19" r="2"/><circle cx="16.4" cy="19" r="2"/>',
  beads: '<path d="M6 12h36M6 24h36M6 36h36M6 8v32M42 8v32"/><circle class="f" cx="13" cy="12" r="3.5"/><circle cx="13" cy="12" r="3.5"/><circle cx="20" cy="12" r="3.5"/><circle cx="13" cy="24" r="3.5"/><circle cx="34" cy="24" r="3.5"/><circle cx="13" cy="36" r="3.5"/><circle cx="20" cy="36" r="3.5"/>',
  fraction: '<rect class="f" x="6" y="8" width="36" height="9"/><path d="M6 8h36v9H6zM6 20h36v9H6zM24 20v9M6 32h36v9H6zM18 32v9M30 32v9"/>',
  line: '<path d="M4 30h40M8 26v8M18 26v8M28 26v8M38 26v8M8 26c3-10 7-10 10 0M18 26c3-10 7-10 10 0"/>',
  grid100: '<rect class="f" x="8" y="8" width="32" height="32"/><path d="M8 8h32v32H8zM8 16h32M8 24h32M8 32h32M16 8v32M24 8v32M32 8v32"/>',
  geoboard: '<g class="f"><path d="M12 12 36 16 30 36z"/></g><path d="M12 12 36 16 30 36z"/><circle cx="12" cy="12" r="1.8"/><circle cx="24" cy="12" r="1.8"/><circle cx="36" cy="12" r="1.8"/><circle cx="12" cy="24" r="1.8"/><circle cx="24" cy="24" r="1.8"/><circle cx="36" cy="24" r="1.8"/><circle cx="12" cy="36" r="1.8"/><circle cx="24" cy="36" r="1.8"/><circle cx="36" cy="36" r="1.8"/>',
  money: '<rect class="f" x="5" y="13" width="30" height="18" rx="3"/><rect x="5" y="13" width="30" height="18" rx="3"/><circle cx="20" cy="22" r="4"/><circle cx="35" cy="32" r="8"/><path d="M35 28v8"/>',
  pattern: '<path class="f" d="M12 8h12l6 10-6 10H12L6 18z"/><path d="M12 8h12l6 10-6 10H12L6 18zM30 18h12l-6 10zM24 28l6 12H18z"/>',
  tangram: '<path class="f" d="M8 8h32L24 24z"/><path d="M8 8h32v32H8zM8 8l32 32M40 8 24 24M8 40l8-8M24 24l8 8"/>',
  scale: '<path d="M24 8v32M14 42h20M8 16h32M8 16l-5 12h10zM40 16l-5 12h10z"/><path class="f" d="M3 28h10a5 5 0 0 1-10 0zM35 28h10a5 5 0 0 1-10 0z"/>',
  cart: '<path class="f" d="M12 14h30l-4 14H15z"/><path d="M4 8h6l5 22h22l5-16H12"/><circle cx="18" cy="38" r="3"/><circle cx="34" cy="38" r="3"/>',
  piggy: '<path class="f" d="M10 24c0-8 6-12 14-12 9 0 15 5 15 12 0 4-2 7-5 9v5h-5v-3h-9v3h-5v-6c-3-2-5-4-5-8z"/><path d="M10 24c0-8 6-12 14-12 9 0 15 5 15 12 0 4-2 7-5 9v5h-5v-3h-9v3h-5v-6c-3-2-5-4-5-8zM39 22h4v5h-4M20 12l-2-5 6 4M23 6h6"/>',
  car: '<path class="f" d="M7 28l4-10h22l6 10z"/><path d="M5 28h38v8H5zM7 28l4-10h22l6 10"/><circle cx="14" cy="37" r="4"/><circle cx="34" cy="37" r="4"/>',
  recipe: '<path class="f" d="M8 22h32c0 9-7 16-16 16S8 31 8 22z"/><path d="M8 22h32c0 9-7 16-16 16S8 31 8 22zM18 16c0-3 2-3 2-6M26 16c0-3 2-3 2-6M14 42h20"/>',
  percent: '<circle class="f" cx="15" cy="15" r="6"/><circle cx="15" cy="15" r="6"/><circle cx="33" cy="33" r="6"/><path d="M36 10 12 38"/>',
  chart: '<path class="f" d="M12 26h7v14h-7zM22 16h7v24h-7zM32 22h7v18h-7z"/><path d="M6 6v36h36M12 26h7v14h-7zM22 16h7v24h-7zM32 22h7v18h-7z"/>',
  coord: '<path d="M24 4v40M4 24h40M40 20l4 4-4 4M20 8l4-4 4 4"/><circle class="f" cx="33" cy="15" r="4"/><circle cx="33" cy="15" r="4"/><circle cx="14" cy="32" r="3"/>',
  algebra: '<rect class="f" x="6" y="6" width="20" height="20"/><rect x="6" y="6" width="20" height="20"/><rect x="30" y="6" width="6" height="20"/><rect x="40" y="20" width="6" height="6"/><rect x="6" y="30" width="20" height="6"/>',
  integer: '<circle class="f" cx="15" cy="17" r="8"/><circle cx="15" cy="17" r="8"/><circle cx="33" cy="31" r="8"/><path d="M11 17h8M15 13v8M29 31h8"/>',
  map: '<path class="f" d="M6 10l12-4 12 4 12-4v32l-12 4-12-4-12 4z"/><path d="M6 10l12-4 12 4 12-4v32l-12 4-12-4-12 4zM18 6v32M30 10v32"/>',
  tree: '<rect class="f" x="18" y="5" width="12" height="9" rx="2"/><rect x="18" y="5" width="12" height="9" rx="2"/><rect x="5" y="34" width="12" height="9" rx="2"/><rect x="31" y="34" width="12" height="9" rx="2"/><path d="M24 14v10M11 34v-10h26v10"/>',
  timeline: '<path d="M4 24h40"/><circle class="f" cx="12" cy="24" r="4"/><circle cx="12" cy="24" r="4"/><circle cx="26" cy="24" r="4"/><circle cx="38" cy="24" r="4"/><path d="M12 20v-8M26 28v8M38 20v-8"/>',
  moon: '<path class="f" d="M30 6a18 18 0 1 0 12 26A15 15 0 0 1 30 6z"/><path d="M30 6a18 18 0 1 0 12 26A15 15 0 0 1 30 6z"/>',
  circuit: '<path d="M8 14h10M30 14h10v22H8V14M18 10v8M22 12v4"/><circle class="f" cx="24" cy="36" r="6"/><circle cx="24" cy="36" r="6"/><path d="M21 33l6 6M27 33l-6 6"/>',
  ruler: '<path class="f" d="M5 30 30 5l13 13-25 25z"/><path d="M5 30 30 5l13 13-25 25zM12 23l4 4M17 18l3 3M22 13l4 4M27 8l3 3"/>',
  thermo: '<path class="f" d="M20 8a4 4 0 0 1 8 0v20a8 8 0 1 1-8 0z"/><path d="M20 8a4 4 0 0 1 8 0v20a8 8 0 1 1-8 0zM24 18v16"/>',
  letters: '<path d="M6 38 15 10l9 28M9 29h12M28 38V10h7a7 7 0 0 1 0 14h-7 9a7 7 0 0 1 0 14z"/>',
  stopwatch: '<circle class="f" cx="24" cy="26" r="15"/><circle cx="24" cy="26" r="15"/><path d="M24 11V5M20 5h8M24 26v-8"/>',
  sun: '<circle class="f" cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="9"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4"/>',
  cloud: '<path class="f" d="M14 36h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 9 9 0 0 0-1 18z"/><path d="M14 36h22a8 8 0 0 0 0-16 11 11 0 0 0-21-2 9 9 0 0 0-1 18z"/>',
  dots: '<circle class="f" cx="24" cy="24" r="18"/><circle cx="16" cy="16" r="3"/><circle cx="32" cy="16" r="3"/><circle cx="24" cy="24" r="3"/><circle cx="16" cy="32" r="3"/><circle cx="32" cy="32" r="3"/>',
  talk: '<path class="f" d="M6 10h28v20H18l-8 7v-7H6z"/><path d="M6 10h28v20H18l-8 7v-7H6zM13 18h4M21 18h6M13 23h14"/>',
  jar: '<path class="f" d="M12 14h24v24a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z"/><path d="M15 6h18v8H15zM12 14h24v24a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z"/><circle cx="20" cy="30" r="2"/><circle cx="27" cy="25" r="2"/><circle cx="26" cy="34" r="2"/><circle cx="19" cy="22" r="2"/>',
  odd: '<rect class="f" x="27" y="27" width="14" height="14" rx="3"/><circle cx="14" cy="14" r="7"/><circle cx="34" cy="14" r="7"/><circle cx="14" cy="34" r="7"/><rect x="27" y="27" width="14" height="14" rx="3"/>',
  canvas: '<rect class="f" x="5" y="5" width="38" height="38" rx="5"/><rect x="5" y="5" width="38" height="38" rx="5"/><rect x="11" y="11" width="10" height="10"/><path d="M28 21l6-10 6 10zM12 36a5 5 0 1 0 10 0 5 5 0 1 0-10 0M28 30h10v8H28z"/>',
  graph: '<path d="M6 42V6M6 42h36"/><path class="f" d="M6 42c8-30 18-30 36-34v34z"/><path d="M6 40c8-30 18-30 36-32"/>',
  area: '<rect class="f" x="8" y="12" width="28" height="22"/><path d="M8 12h28v22H8zM8 40h28M36 6v6M8 37v6M36 37v6M42 12v22"/>',
  coinflip: '<ellipse class="f" cx="24" cy="24" rx="17" ry="17"/><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="12"/><path d="M24 17v14"/>',
  abc: '<rect class="f" x="5" y="10" width="38" height="28" rx="5"/><rect x="5" y="10" width="38" height="28" rx="5"/><path d="M11 31l4-12 4 12M12 27h6M23 19v12h4a3 3 0 0 0 0-6h-4 3a3 3 0 0 0 0-6zM40 21a5 5 0 1 0 0 8"/>',
  hece: '<rect class="f" x="4" y="16" width="12" height="16" rx="3"/><rect x="4" y="16" width="12" height="16" rx="3"/><rect x="18" y="16" width="12" height="16" rx="3"/><rect x="32" y="16" width="12" height="16" rx="3"/>',
  speed: '<path class="f" d="M6 34a18 18 0 0 1 36 0z"/><path d="M6 34a18 18 0 0 1 36 0M24 34l9-11"/><circle cx="24" cy="34" r="3"/>',
  wall: '<rect class="f" x="5" y="7" width="17" height="10" rx="2"/><path d="M5 7h17v10H5zM26 7h17v10H26zM5 21h12v10H5zM21 21h22v10H21zM5 35h22v8H5zM31 35h12v8H31z"/>',
  spell: '<path d="M8 36 16 12l8 24M11 28h10M30 18c0-4 10-4 10 0s-10 4-10 9 10 5 10 0"/><path class="f" d="M28 36h14v6H28z"/>',
  lock: '<rect class="f" x="10" y="21" width="28" height="20" rx="4"/><rect x="10" y="21" width="28" height="20" rx="4"/><path d="M16 21v-6a8 8 0 0 1 16 0v6M24 29v5"/>',
  full: '<path d="M8 18V8h10M30 8h10v10M40 30v10H30M18 40H8V30"/>',
  film: '<rect class="f" x="5" y="10" width="38" height="28" rx="5"/><rect x="5" y="10" width="38" height="28" rx="5"/><path d="M20 18v12l10-6z"/>',
  bg: '<rect class="f" x="6" y="8" width="36" height="32" rx="4"/><rect x="6" y="8" width="36" height="32" rx="4"/><path d="M6 32l10-10 8 8 6-6 12 12"/><circle cx="32" cy="17" r="3"/>',
  save: '<path class="f" d="M8 8h26l6 6v26H8z"/><path d="M8 8h26l6 6v26H8zM15 8v10h16V8M15 40V28h18v12"/>',
  user: '<circle class="f" cx="24" cy="17" r="8"/><circle cx="24" cy="17" r="8"/><path d="M8 42c1-9 8-14 16-14s15 5 16 14"/>',
  minus: '<path d="M10 24h28"/>',
  edit: '<path d="M30 8l10 10-20 20H10V28zM26 12l10 10"/>',
  highlighter: '<path class="f" d="M14 40h20v-4H14z"/><path d="M30 6l8 8-14 14h-8v-8zM16 20l12 12M12 41h24"/>',
  eraser: '<path class="f" d="M8 30 26 12l14 14-12 12H16z"/><path d="M8 30 26 12l14 14-12 12H16zM17 21l14 14M16 38h26"/>',
  arrow: '<path d="M9 39 37 11M20 11h17v17"/>',
  circle: '<circle class="f" cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="16"/>',
  square: '<rect class="f" x="8" y="10" width="32" height="28" rx="2"/><rect x="8" y="10" width="32" height="28" rx="2"/>',
  textT: '<path d="M10 12h28M24 12v26M18 38h12"/>',
  undo: '<path d="M16 12 8 20l8 8M8 20h20a11 11 0 0 1 0 22h-6"/>',
  heart: '<path class="f" d="M24 41S7 30 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 23-17 23z"/><path d="M24 41S7 30 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 23-17 23z"/>',
  turn: '<path d="M38 18a15 15 0 0 0-27 3M10 30a15 15 0 0 0 27-3M38 9v9h-9M10 39v-9h9"/>',
  share: '<circle class="f" cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="16"/><path d="M24 8v32M8 24h32"/>',
  teacher: '<circle class="f" cx="17" cy="14" r="6"/><circle cx="17" cy="14" r="6"/><path d="M6 40c0-9 5-14 11-14s11 5 11 14M26 10h16v14H30M30 18l6-4"/>',
  hands: '<path class="f" d="M8 28l10-10 8 6 8-6 6 6-14 14z"/><path d="M4 24l8-8 6 4M44 24l-8-8-8 6-6-4-8 8M14 30l4 4M19 26l6 6M24 22l6 6M20 36l4 4 10-10"/>',
  help: '<circle class="f" cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="18"/><path d="M18 19a6 6 0 1 1 8 5.6c-1.4.6-2 1.6-2 3V30M24 36v.5"/>',
  filter: '<path class="f" d="M6 10h36L28 26v14l-8-4V26z"/><path d="M6 10h36L28 26v14l-8-4V26z"/>',
  train: '<rect class="f" x="10" y="8" width="28" height="26" rx="6"/><rect x="10" y="8" width="28" height="26" rx="6"/><path d="M10 22h28M17 28v.5M31 28v.5M16 34l-5 7M32 34l5 7M18 14h12"/>',
  telescope: '<path class="f" d="M6 22l26-12 4 9-26 12z"/><path d="M6 22l26-12 4 9-26 12zM20 26l-6 16M22 26l6 16M36 19l6-3"/>',
  brain: '<path class="f" d="M24 10c-4-5-13-3-13 4-5 1-7 8-3 11-2 5 2 10 7 9 2 5 9 5 9 0z"/><path d="M24 10c-4-5-13-3-13 4-5 1-7 8-3 11-2 5 2 10 7 9 2 5 9 5 9 0zM24 10c4-5 13-3 13 4 5 1 7 8 3 11 2 5-2 10-7 9-2 5-9 5-9 0zM24 10v30"/>',
  flower: '<circle class="f" cx="24" cy="18" r="6"/><circle cx="24" cy="18" r="5"/><path d="M24 8a5 5 0 0 1 0 0M19 13a6 6 0 1 1 10 0a6 6 0 1 1-2 9a6 6 0 1 1-6 0a6 6 0 1 1-2-9zM24 24v18M24 36c-6 0-9-4-9-8 5 0 9 3 9 8"/>',
  music: '<path class="f" d="M18 34a5 5 0 1 1-10 0a5 5 0 0 1 10 0z"/><path d="M18 34a5 5 0 1 1-10 0a5 5 0 0 1 10 0zM40 30a5 5 0 1 1-10 0a5 5 0 0 1 10 0zM18 34V10l22-4v24"/>',
  book: '<path class="f" d="M6 10c7-2 13-1 18 3v28c-5-4-11-5-18-3z"/><path d="M6 10c7-2 13-1 18 3v28c-5-4-11-5-18-3zM42 10c-7-2-13-1-18 3v28c5-4 11-5 18-3z"/>',
  snow: '<path d="M24 6v36M8 15l32 18M8 33l32-18M20 9l4 4 4-4M20 39l4-4 4 4"/>',
  pit: '<path class="f" d="M4 16h8c4 0 4 22 12 22s8-22 12-22h8v26H4z"/><path d="M4 16h8c4 0 4 22 12 22s8-22 12-22h8"/><circle cx="24" cy="30" r="3"/>',
  stairs: '<path class="f" d="M6 42V34h10v-8h10v-8h10v-8h6v32z"/><path d="M6 42V34h10v-8h10v-8h10v-8h6"/>',
  magnet: '<path class="f" d="M10 8h10v18a4 4 0 0 0 8 0V8h10v18a14 14 0 0 1-28 0z"/><path d="M10 8h10v18a4 4 0 0 0 8 0V8h10v18a14 14 0 0 1-28 0zM10 15h10M28 15h10"/>',
  grid: '<rect x="8" y="8" width="32" height="32" rx="3"/><path d="M8 19h32M8 29h32M19 8v32M29 8v32"/>',
  leaf: '<path class="f" d="M40 8C20 8 8 18 8 32c0 4 1 6 2 8 14 0 30-6 30-32z"/><path d="M40 8C20 8 8 18 8 32c0 4 1 6 2 8 14 0 30-6 30-32zM10 40C18 30 26 22 34 15"/>',
  pin: '<path class="f" d="M16 6h16l-3 12 7 7H12l7-7z"/><path d="M16 6h16l-3 12 7 7H12l7-7zM24 25v17"/>',
  bolt: '<path class="f" d="M27 4 9 27h13l-3 17 20-25H26z"/><path d="M27 4 9 27h13l-3 17 20-25H26z"/>',
};
T.icon = function (name, cls = "") {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 48 48");
  s.setAttribute("fill", "none");
  s.setAttribute("stroke", "currentColor");
  s.setAttribute("stroke-width", "3");
  s.setAttribute("stroke-linecap", "round");
  s.setAttribute("stroke-linejoin", "round");
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("width", "24"); s.setAttribute("height", "24");
  if (cls) s.setAttribute("class", cls);
  s.innerHTML = (T.ICONS[name] || T.ICONS.star).replace(/class="f"/g, 'fill="currentColor" stroke="none" opacity=".2"');
  return s;
};

/* Öğrenci avatarı: fotoğraf yerine isme göre sabit bir hayvan yüzü. KVKK dostu. */
T.avatar = function (seed, size = 64) {
  let hsh = 0; for (const c of String(seed)) hsh = (hsh * 31 + c.charCodeAt(0)) >>> 0;
  const tones = ["#ffc233", "#ef5b3b", "#2e9bd6", "#6cc04a", "#8a5cd0", "#f27ba9", "#ff9a3c", "#26b3a0"];
  const faces = ["#f3c89b", "#e0a878", "#c98c5f", "#f6d7b5", "#ffffff", "#ffe08a"];
  const bg = tones[hsh % tones.length], face = faces[(hsh >> 3) % faces.length];
  const kind = (hsh >> 6) % 5; // 0 kedi, 1 ayı, 2 tavşan, 3 baykuş, 4 tilki
  const ears = [
    `<path d="M14 22 16 8l10 9M50 22 48 8l-10 9" fill="${face}" stroke="#2a2a2a" stroke-width="2.5" stroke-linejoin="round"/>`,
    `<circle cx="17" cy="17" r="7" fill="${face}" stroke="#2a2a2a" stroke-width="2.5"/><circle cx="47" cy="17" r="7" fill="${face}" stroke="#2a2a2a" stroke-width="2.5"/>`,
    `<ellipse cx="23" cy="10" rx="5" ry="11" fill="${face}" stroke="#2a2a2a" stroke-width="2.5"/><ellipse cx="41" cy="10" rx="5" ry="11" fill="${face}" stroke="#2a2a2a" stroke-width="2.5"/>`,
    `<path d="M16 18 20 10l6 8M48 18l-4-8-6 8" fill="${face}" stroke="#2a2a2a" stroke-width="2.5" stroke-linejoin="round"/>`,
    `<path d="M13 24 12 6l13 11M51 24l1-18-13 11" fill="#ef7d3b" stroke="#2a2a2a" stroke-width="2.5" stroke-linejoin="round"/>`,
  ][kind];
  const eyeY = 33, mouth = kind === 3
    ? `<path d="M29 40l3 4 3-4z" fill="#f0a329" stroke="#2a2a2a" stroke-width="2"/>`
    : `<path d="M27 41c2 3 8 3 10 0" stroke="#2a2a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="32" cy="38" r="2" fill="#2a2a2a"/>`;
  const eyes = kind === 3
    ? `<circle cx="24" cy="${eyeY}" r="6" fill="#fff" stroke="#2a2a2a" stroke-width="2"/><circle cx="40" cy="${eyeY}" r="6" fill="#fff" stroke="#2a2a2a" stroke-width="2"/><circle cx="24" cy="${eyeY}" r="2.5" fill="#2a2a2a"/><circle cx="40" cy="${eyeY}" r="2.5" fill="#2a2a2a"/>`
    : `<circle cx="25" cy="${eyeY}" r="2.8" fill="#2a2a2a"/><circle cx="39" cy="${eyeY}" r="2.8" fill="#2a2a2a"/><circle cx="20" cy="40" r="3" fill="#f59a9a" opacity=".55"/><circle cx="44" cy="40" r="3" fill="#f59a9a" opacity=".55"/>`;
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 64 64"); s.setAttribute("width", size); s.setAttribute("height", size);
  s.setAttribute("class", "av"); s.setAttribute("aria-hidden", "true");
  s.innerHTML = `<circle cx="32" cy="32" r="31" fill="${bg}"/>${ears}<circle cx="32" cy="35" r="19" fill="${face}" stroke="#2a2a2a" stroke-width="2.5"/>${eyes}${mouth}`;
  return s;
};

/* 3B ikonlar: Microsoft Fluent Emoji 3D (MIT lisansı, dist/ikon3d). Yoksa çizgi ikona düşer. */
T.IKON3D = new Set(["abc", "algebra", "area", "beads", "bg", "blocks", "board", "bolt", "book", "brain", "calendar", "canvas", "car", "cart", "chart", "check", "circuit", "class", "clock", "coinflip", "coord", "dice", "dots", "eye", "fen", "filter", "flower", "fraction", "frame", "geoboard", "graph", "grid100", "groups", "hand", "hands", "heart", "hece", "help", "home", "ingilizce", "integer", "jar", "leaf", "letters", "line", "lock", "magnet", "map", "math", "money", "moon", "music", "name", "noise", "odd", "pattern", "pen", "percent", "piggy", "pit", "plan", "plus", "qr", "recipe", "ruler", "scale", "settings", "snow", "sosyal", "spark", "speaker", "speed", "spell", "stairs", "star", "stopwatch", "sun", "talk", "tangram", "teacher", "telescope", "text", "thermo", "ticket", "timeline", "timer", "traffic", "train", "tree", "trophy", "turkce", "turn", "wall", "zeka"]);
T.icon3d = function (name, cls = "") {
  if (!T.IKON3D.has(name)) return T.icon(name, cls);
  return T.h("img.ikon3d" + (cls ? "." + cls : ""), { src: "ikon3d/" + name + ".webp", alt: "", "aria-hidden": "true", draggable: "false", width: 48, height: 48, decoding: "async" });
};
