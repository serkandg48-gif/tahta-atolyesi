/* Tahta Atölyesi service worker. Uygulama dosyaları önbellekte durur; internet kesilse de site açılır.
   Sayfa önce ağdan istenir, ağ yoksa önbellekten gelir. Yapay zekâ istekleri (/api) hiç önbelleğe alınmaz. */
const SURUM = "07d6a90aef";
const ANA = "ta-" + SURUM, EK = "ta-ek";
const ON = ["/", "/app.07d6a90aef.css", "/app.07d6a90aef.js", "/pwa/ikon-192.png", "/ikon3d/LICENSE-fluentui-emoji.txt", "/ikon3d/abakus.webp", "/ikon3d/abc.webp", "/ikon3d/ahtapot.webp", "/ikon3d/aletkutusu.webp", "/ikon3d/algebra.webp", "/ikon3d/ampul.webp", "/ikon3d/area.webp", "/ikon3d/ari.webp", "/ikon3d/atac.webp", "/ikon3d/ates.webp", "/ikon3d/ayi.webp", "/ikon3d/ayna.webp", "/ikon3d/basket.webp", "/ikon3d/beads.webp", "/ikon3d/bg.webp", "/ikon3d/blocks.webp", "/ikon3d/board.webp", "/ikon3d/bolt.webp", "/ikon3d/book.webp", "/ikon3d/brain.webp", "/ikon3d/bulut.webp", "/ikon3d/buyutec.webp", "/ikon3d/buz.webp", "/ikon3d/calendar.webp", "/ikon3d/canta.webp", "/ikon3d/canvas.webp", "/ikon3d/car.webp", "/ikon3d/carpi.webp", "/ikon3d/cart.webp", "/ikon3d/cetvel.webp", "/ikon3d/chart.webp", "/ikon3d/check.webp", "/ikon3d/cikolata.webp", "/ikon3d/circuit.webp", "/ikon3d/civciv.webp", "/ikon3d/class.webp", "/ikon3d/clock.webp", "/ikon3d/coinflip.webp", "/ikon3d/coord.webp", "/ikon3d/dag.webp", "/ikon3d/damla.webp", "/ikon3d/dedektif.webp", "/ikon3d/dice.webp", "/ikon3d/donme.webp", "/ikon3d/dots.webp", "/ikon3d/dusunce.webp", "/ikon3d/dusunen.webp", "/ikon3d/elmas.webp", "/ikon3d/esittir.webp", "/ikon3d/eye.webp", "/ikon3d/fen.webp", "/ikon3d/fide.webp", "/ikon3d/filter.webp", "/ikon3d/firtina.webp", "/ikon3d/flower.webp", "/ikon3d/fraction.webp", "/ikon3d/frame.webp", "/ikon3d/geoboard.webp", "/ikon3d/gonye.webp", "/ikon3d/goz.webp", "/ikon3d/grafik.webp", "/ikon3d/graph.webp", "/ikon3d/grid100.webp", "/ikon3d/groups.webp", "/ikon3d/gul.webp", "/ikon3d/gundogumu.webp", "/ikon3d/gunesbulut.webp", "/ikon3d/hand.webp", "/ikon3d/hands.webp", "/ikon3d/havali.webp", "/ikon3d/heart.webp", "/ikon3d/hece.webp", "/ikon3d/help.webp", "/ikon3d/home.webp", "/ikon3d/inek.webp", "/ikon3d/ingilizce.webp", "/ikon3d/insaat.webp", "/ikon3d/integer.webp", "/ikon3d/jar.webp", "/ikon3d/kahraman.webp", "/ikon3d/kaktus.webp", "/ikon3d/kalem.webp", "/ikon3d/karinca.webp", "/ikon3d/kasa.webp", "/ikon3d/kitap.webp", "/ikon3d/konusma.webp", "/ikon3d/kulak.webp", "/ikon3d/kup.webp", "/ikon3d/kurabiye.webp", "/ikon3d/kutlama.webp", "/ikon3d/kutupayisi.webp", "/ikon3d/lale.webp", "/ikon3d/leaf.webp", "/ikon3d/letters.webp", "/ikon3d/limon.webp", "/ikon3d/line.webp", "/ikon3d/lock.webp", "/ikon3d/lotus.webp", "/ikon3d/magnet.webp", "/ikon3d/map.webp", "/ikon3d/maske.webp", "/ikon3d/math.webp", "/ikon3d/money.webp", "/ikon3d/moon.webp", "/ikon3d/music.webp", "/ikon3d/name.webp", "/ikon3d/noise.webp", "/ikon3d/not.webp", "/ikon3d/odd.webp", "/ikon3d/okyay.webp", "/ikon3d/ornek.webp", "/ikon3d/palet.webp", "/ikon3d/parlakkalp.webp", "/ikon3d/pattern.webp", "/ikon3d/pen.webp", "/ikon3d/percent.webp", "/ikon3d/piggy.webp", "/ikon3d/pit.webp", "/ikon3d/plan.webp", "/ikon3d/plus.webp", "/ikon3d/qr.webp", "/ikon3d/recipe.webp", "/ikon3d/robot.webp", "/ikon3d/ruler.webp", "/ikon3d/sarikart.webp", "/ikon3d/scale.webp", "/ikon3d/sekil.webp", "/ikon3d/sersem.webp", "/ikon3d/settings.webp", "/ikon3d/sicak.webp", "/ikon3d/snow.webp", "/ikon3d/soru.webp", "/ikon3d/sosyal.webp", "/ikon3d/spark.webp", "/ikon3d/speaker.webp", "/ikon3d/speed.webp", "/ikon3d/spell.webp", "/ikon3d/stairs.webp", "/ikon3d/star.webp", "/ikon3d/stopwatch.webp", "/ikon3d/sun.webp", "/ikon3d/susss.webp", "/ikon3d/talk.webp", "/ikon3d/tamam.webp", "/ikon3d/tangram.webp", "/ikon3d/tavsan.webp", "/ikon3d/teacher.webp", "/ikon3d/tekrar.webp", "/ikon3d/telescope.webp", "/ikon3d/teleskop.webp", "/ikon3d/terazi.webp", "/ikon3d/termometre.webp", "/ikon3d/text.webp", "/ikon3d/thermo.webp", "/ikon3d/ticket.webp", "/ikon3d/timeline.webp", "/ikon3d/timer.webp", "/ikon3d/timsah.webp", "/ikon3d/tirmanan.webp", "/ikon3d/tirtil.webp", "/ikon3d/tokalasma.webp", "/ikon3d/traffic.webp", "/ikon3d/trafik.webp", "/ikon3d/train.webp", "/ikon3d/tree.webp", "/ikon3d/trophy.webp", "/ikon3d/turkce.webp", "/ikon3d/turn.webp", "/ikon3d/turta.webp", "/ikon3d/ucgen.webp", "/ikon3d/uyari.webp", "/ikon3d/wall.webp", "/ikon3d/yapboz.webp", "/ikon3d/yaris.webp", "/ikon3d/yumurta.webp", "/ikon3d/zeka.webp", "/ikon3d/zincir.webp"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(ANA).then((c) => Promise.all(ON.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((l) => Promise.all(l.filter((k) => k.startsWith("ta-") && k !== ANA && k !== EK).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin === location.origin && u.pathname.startsWith("/api/")) return;
  if (r.headers.has("range")) return;
  if (u.origin === location.origin && /^\/(muzik|ambiyans)\//.test(u.pathname)) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then((y) => { const k = y.clone(); caches.open(ANA).then((c) => c.put("/", k)); return y; }).catch(() => caches.match("/")));
    return;
  }
  const yerel = u.origin === location.origin, font = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!yerel && !font) return;
  const ag = () => fetch(r).then((y) => {
    if (y.ok || y.type === "opaque") { const k = y.clone(); caches.open(yerel && /\/app\./.test(u.pathname) ? ANA : EK).then((c) => c.put(r, k)); }
    return y;
  });
  /* uygulama dosyaları sürüm adlı, değişmez; diğerleri önbellekten hemen gelir, arkada tazelenir */
  e.respondWith(caches.match(r).then((v) => { if (v) { if (!/\/app\./.test(u.pathname)) e.waitUntil(ag().catch(() => {})); return v; } return ag(); }));
});
