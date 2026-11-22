/* Yapay zekâ köprüsü ve Google ile giriş.
   1) Sayfa Claude içinde açıldıysa: Claude.
   2) Sitede: öğretmen Google ile giriş yapar, istek sitenin sunucusuna gider.
      Gemini anahtarı yalnızca sunucuda durur; öğretmen anahtar görmez, girmez.
   Öğrenci adları hiçbir zaman gönderilmez. */
T.auth = (function () {
  const KEY = "tahta-atolyesi-oturum";
  let cfg = null;            // { clientId, ready } ya da sunucu yoksa false
  let sess = null;           // { token, user, quota }
  try { sess = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { sess = null; }
  const listeners = new Set();
  const emit = () => listeners.forEach((f) => { try { f(); } catch (e) {} });
  const save = () => { try { sess ? localStorage.setItem(KEY, JSON.stringify(sess)) : localStorage.removeItem(KEY); } catch (e) {} emit(); };
  const onWeb = /^https?:$/.test(location.protocol) && window.self === window.top;

  async function call(path, opts = {}) {
    const headers = { "content-type": "application/json" };
    if (sess && sess.token) headers.authorization = "Bearer " + sess.token;
    const r = await fetch(path, Object.assign({ headers }, opts));
    let j = {}; try { j = await r.json(); } catch (e) {}
    if (j.quota && sess) { sess.quota = j.quota; save(); }
    if (r.status === 401 && path !== "/api/login") { sess = null; save(); }
    if (!r.ok) throw Object.assign({ status: r.status }, j.error || { code: "http", message: "Sunucu yanıt vermedi (" + r.status + ")." });
    return j;
  }

  const ready = (async () => {
    if (!onWeb) { cfg = false; return; }
    try { const r = await fetch("/api/config", { headers: { accept: "application/json" } }); cfg = r.ok ? await r.json() : false; }
    catch (e) { cfg = false; }
    if (cfg && !cfg.ready) cfg = false;
    if (cfg && sess) call("/api/me").catch(() => {});
    emit();
  })();

  let gsi = null;
  function loadGsi() {
    if (gsi) return gsi;
    gsi = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client"; s.async = true;
      s.onload = () => {
        window.google.accounts.id.initialize({
          client_id: cfg.clientId, auto_select: false, cancel_on_tap_outside: true, use_fedcm_for_prompt: true,
          callback: async (resp) => {
            try {
              const j = await call("/api/login", { method: "POST", body: JSON.stringify({ credential: resp.credential }) });
              sess = { token: j.token, user: j.user, quota: j.quota }; save();
              T.toast("Hoş geldin " + (j.user.name || j.user.email));
            } catch (e) { T.toast(e.message || "Giriş yapılamadı"); }
          },
        });
        res(window.google);
      };
      s.onerror = () => { gsi = null; rej(new Error("gsi")); };
      document.head.append(s);
    });
    return gsi;
  }

  /* Google'ın kendi düğmesi: görünümü Google kurallarına uygun, tıklayınca hesap seçme penceresi açılır. */
  function button() {
    const box = T.h("div.gbtn", { style: { minHeight: "44px" } });
    loadGsi().then((g) => g.accounts.id.renderButton(box, { theme: "outline", size: "large", text: "signin_with", shape: "pill", locale: "tr" }))
      .catch(() => box.replaceChildren(T.h("span.hint", "Google girişi yüklenemedi. İnternet bağlantını kontrol et.")));
    return box;
  }
  function signOut() {
    sess = null; save();
    try { window.google && window.google.accounts.id.disableAutoSelect(); } catch (e) {}
    T.toast("Çıkış yapıldı");
  }
  return {
    ready, call, button, signOut,
    on: (f) => { listeners.add(f); return () => listeners.delete(f); },
    available: () => Boolean(cfg),
    user: () => (cfg && sess ? sess.user : null),
    quota: () => (sess && sess.quota) || null,
    token: () => (sess && sess.token) || "",
    depo: () => !!(cfg && cfg.depo),
  };
})();

T.ai = (function () {
  function mode() {
    if (T.cap.sample) return "claude";
    if (T.auth.user()) return "site";
    return null;
  }
  async function ask(prompt, { onText, images, json } = {}) {
    const m = mode();
    if (m === "claude") {
      const o = { modelTier: "default", onText: onText ? ({ text }) => onText(text) : undefined };
      if (images && images.length) o.images = images;
      const r = await T.cap.sample(prompt, o);
      return r.text;
    }
    if (m === "site") {
      const imgs = await Promise.all((images || []).map(async (b) => ({ mime: b.type || "image/jpeg", data: await blobB64(await shrink(b)) })));
      const j = await T.auth.call("/api/ai", { method: "POST", body: JSON.stringify({ prompt, images: imgs, json: !!json }) });
      onText && onText(j.text);
      return j.text;
    }
    throw { code: "none", message: T.auth.available() ? "Yapay zekâyı kullanmak için Google ile giriş yap." : "Yapay zekâ bu ortamda kullanılamıyor." };
  }
  const blobB64 = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(b); });
  /* Büyük fotoğrafları göndermeden önce küçültür (en uzun kenar 1280 px). */
  async function shrink(b) {
    if (!b.type || !/^image\/(jpeg|png|webp)$/.test(b.type) || b.size < 600e3) return b;
    try {
      const bmp = await createImageBitmap(b);
      const k = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
      return await new Promise((res) => c.toBlob((x) => res(x || b), "image/jpeg", 0.85));
    } catch (e) { return b; }
  }
  /* Bozuk JSON'u onarır: dizgi içindeki satır sonları, kaçırılmamış tırnaklar, sondaki virgüller */
  function onar(t) {
    let o = "", ic = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (ic) {
        if (c === "\\") { o += c + (t[i + 1] || ""); i++; continue; }
        if (c === "\n") { o += "\\n"; continue; }
        if (c === "\r") continue;
        if (c === "\t") { o += "\\t"; continue; }
        if (c === '"') {
          let j = i + 1; while (j < t.length && /\s/.test(t[j])) j++;
          if (j >= t.length || ",}]:".includes(t[j])) { ic = false; o += c; } else o += '\\"';
          continue;
        }
        o += c;
      } else { if (c === '"') ic = true; o += c; }
    }
    return o.replace(/,\s*([}\]])/g, "$1");
  }
  function parseJSON(text) {
    const t = text.replace(/```json|```/g, "");
    const a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a < 0 || b < a) throw { code: "parse", message: "Yanıt okunamadı. Bir kez daha dene." };
    const govde = t.slice(a, b + 1);
    try { return JSON.parse(govde); } catch (e) {}
    try { return JSON.parse(onar(govde)); } catch (e) { throw { code: "parse", message: "Yapay zekânın yanıtı okunamadı. Bir kez daha dene." }; }
  }
  async function askJSON(prompt, opts) {
    const o = Object.assign({}, opts, { json: true });
    try { return parseJSON(await ask(prompt + "\n\nYalnızca geçerli JSON döndür. Açıklama ekleme. Metinlerin içinde çift tırnak kullanma.", o)); }
    catch (e) { if (e && e.code === "parse") return parseJSON(await ask(prompt + "\n\nYalnızca geçerli JSON döndür. Metinlerin içinde çift tırnak ve satır sonu kullanma.", o)); throw e; }
  }

  /* Durum kutusu: oturum değişince kendini yeniler. */
  function statusEl() {
    const box = T.h("div.ai-status");
    const draw = () => {
      const m = mode(), q = T.auth.quota(), u = T.auth.user();
      if (m === "claude") return box.replaceChildren(T.icon("spark"), T.h("span", "Yapay zekâ hazır: Claude bu sayfada çalışıyor."));
      if (m === "site") return box.replaceChildren(T.icon("spark"),
        T.h("span", "Yapay zekâ hazır. ", u.name ? u.name + " olarak giriş yaptın. " : "", q ? "Bugün kalan hakkın: " + q.left + " / " + q.limit + "." : ""));
      if (T.auth.available()) return box.replaceChildren(T.icon("spark"), T.h("span", "Yapay zekâyı kullanmak için Google ile giriş yap. Anahtar ya da şifre gerekmez."), T.auth.button());
      box.replaceChildren(T.icon("spark"), T.h("span", navigator.onLine === false ? "İnternet bağlantısı yok. Bağlanınca yeniden dene. Bu arada örnekleri inceleyebilirsin." : "Yapay zekâ sunucusu şu an yanıt vermiyor. Biraz sonra yeniden dene. Bu arada örnekleri inceleyebilirsin."));
    };
    draw();
    const off = T.auth.on(() => { if (!box.isConnected) return off(); draw(); });
    T.auth.ready.then(draw);
    return box;
  }
  return { mode, ask, askJSON, parseJSON, statusEl };
})();
