/* Tahta Atölyesi service worker. Uygulama dosyaları önbellekte durur; internet kesilse de site açılır.
   Sayfa önce ağdan istenir, ağ yoksa önbellekten gelir. Yapay zekâ istekleri (/api) hiç önbelleğe alınmaz. */
const SURUM = "__SURUM__"; /* r2 */
const ANA = "ta-" + SURUM, EK = "ta-ek2";
const ON = __ONBELLEK__;
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
    /* bulunamayan dosya yerine gelen sayfayı (index.html) asla saklama */
    const html = (y.headers.get("content-type") || "").includes("text/html");
    if ((y.ok && !html) || y.type === "opaque") { const k = y.clone(); caches.open(yerel && /\/app\./.test(u.pathname) ? ANA : EK).then((c) => c.put(r, k)); }
    return y;
  });
  /* uygulama dosyaları sürüm adlı, değişmez; diğerleri önbellekten hemen gelir, arkada tazelenir */
  e.respondWith(caches.match(r).then((v) => { if (v) { if (!/\/app\./.test(u.pathname)) e.waitUntil(ag().catch(() => {})); return v; } return ag(); }));
});
