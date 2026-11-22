/* Tahta Atölyesi sunucusu (Cloudflare Worker).
   - /api/*  : Google ile giriş ve yapay zekâ köprüsü
   - geri kalan her şey: dist/ klasöründeki site

   Cloudflare panelinde tanımlanması gerekenler (Settings > Variables and Secrets):
   GEMINI_API_KEY   (Secret)  Google AI Studio anahtarı. Öğretmenler bu anahtarı hiç görmez.
   GOOGLE_CLIENT_ID (wrangler.jsonc içinde, gizli değil) Google ile giriş için istemci kimliği.
   DEPO_ANAHTAR     (Secret)  Bulut kaydını kilitleyen uzun, rastgele bir metin. Bir kez yazılır, hiç değiştirilmez.
                              Değişirse ya da silinirse buluttaki kayıtlar okunamaz.
   İsteğe bağlı: DAILY_LIMIT (öğretmen başına günlük hak, varsayılan 10), GLOBAL_LIMIT (site geneli günlük tavan, varsayılan 400), GEMINI_MODEL, SESSION_SECRET. */
import { DurableObject } from "cloudflare:workers";

const JSON_H = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: JSON_H });
const err = (code, message, status) => json({ error: { code, message } }, status);

/* Türkiye saatine göre bugünün tarihi: hak her gece 00.00'da yenilenir. */
const today = () => new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);

/* ---------- base64url ---------- */
const enc = new TextEncoder();
function b64u(bytes) {
  let s = ""; const a = new Uint8Array(bytes);
  for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64u(str) {
  const s = atob(str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4));
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
}
const unb64uText = (s) => new TextDecoder().decode(unb64u(s));

/* ---------- Google kimlik jetonunu doğrulama ---------- */
let jwksCache = { at: 0, keys: [] };
async function googleKeys(force) {
  if (!force && Date.now() - jwksCache.at < 3600e3 && jwksCache.keys.length) return jwksCache.keys;
  const r = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!r.ok) throw new Error("jwks");
  jwksCache = { at: Date.now(), keys: (await r.json()).keys || [] };
  return jwksCache.keys;
}
export async function verifyGoogle(idToken, clientId) {
  const parts = String(idToken || "").split(".");
  if (parts.length !== 3) return null;
  let head, body;
  try { head = JSON.parse(unb64uText(parts[0])); body = JSON.parse(unb64uText(parts[1])); } catch { return null; }
  if (head.alg !== "RS256") return null;
  let jwk = (await googleKeys()).find((k) => k.kid === head.kid);
  if (!jwk) jwk = (await googleKeys(true)).find((k) => k.kid === head.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, unb64u(parts[2]), enc.encode(parts[0] + "." + parts[1]));
  if (!ok) return null;
  const now = Date.now() / 1000;
  if (body.aud !== clientId) return null;
  if (body.iss !== "accounts.google.com" && body.iss !== "https://accounts.google.com") return null;
  if (!(body.exp > now - 60)) return null;
  if (!body.email || body.email_verified === false) return null;
  return { email: String(body.email).toLowerCase(), name: body.name || "", picture: body.picture || "" };
}

/* ---------- Oturum jetonu (30 gün, HMAC imzalı) ---------- */
async function hmacKey(env) {
  const secret = env.SESSION_SECRET || ("oturum:" + (env.GEMINI_API_KEY || ""));
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
export async function makeSession(env, user) {
  const payload = b64u(enc.encode(JSON.stringify({ e: user.email, n: user.name, p: user.picture, x: Math.floor(Date.now() / 1000) + 30 * 86400 })));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(env), enc.encode(payload));
  return payload + "." + b64u(sig);
}
export async function readSession(env, request) {
  const m = /^Bearer\s+(.+)$/i.exec(request.headers.get("authorization") || "");
  if (!m) return null;
  const [payload, sig] = m[1].split(".");
  if (!payload || !sig) return null;
  let ok = false;
  try { ok = await crypto.subtle.verify("HMAC", await hmacKey(env), unb64u(sig), enc.encode(payload)); } catch { return null; }
  if (!ok) return null;
  let d; try { d = JSON.parse(unb64uText(payload)); } catch { return null; }
  if (!(d.x > Date.now() / 1000)) return null;
  return { email: d.e, name: d.n, picture: d.p };
}

/* ---------- Günlük hak sayacı: her öğretmen için ayrı ---------- */
export class Kota extends DurableObject {
  async durum(gun, limit) {
    const k = await this.ctx.storage.get("k") || { gun, sayi: 0 };
    const used = k.gun === gun ? k.sayi : 0;
    return { used, limit, left: Math.max(0, limit - used) };
  }
  async kullan(gun, limit) {
    const k = await this.ctx.storage.get("k") || { gun, sayi: 0 };
    const used = k.gun === gun ? k.sayi : 0;
    if (used >= limit) return { ok: false, used, limit, left: 0 };
    await this.ctx.storage.put("k", { gun, sayi: used + 1 });
    return { ok: true, used: used + 1, limit, left: limit - used - 1 };
  }
  async iade(gun) {
    const k = await this.ctx.storage.get("k");
    if (k && k.gun === gun && k.sayi > 0) await this.ctx.storage.put("k", { gun, sayi: k.sayi - 1 });
  }
}
/* ---------- Doğal ses: Gemini TTS, üretilen ses kalıcı olarak saklanır ---------- */
export class SesDeposu extends DurableObject {
  async al(k) { return (await this.ctx.storage.get("s:" + k)) || null; }
  async koy(k, v) { await this.ctx.storage.put("s:" + k, v); }
}
async function sha(t) { return b64u(await crypto.subtle.digest("SHA-256", enc.encode(t))); }
function wav(pcm, rate = 24000) {
  const h = new ArrayBuffer(44), v = new DataView(h), n = pcm.length;
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, "RIFF"); v.setUint32(4, 36 + n, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n, true);
  const out = new Uint8Array(44 + n); out.set(new Uint8Array(h), 0); out.set(pcm, 44); return out;
}
async function ses(env, metin, istem, ses_) {
  const modeller = (env.TTS_MODEL ? [env.TTS_MODEL] : []).concat(["gemini-3.8-flash-lite-tts", "gemini-3.8-flash-tts", "gemini-3.1-flash-tts-preview"]);
  let son = { fail: "upstream" };
  for (const model of modeller) { const r = await sesModel(env, metin, model, istem, ses_); if (!r.fail) return r; son = r; if (r.fail === "busy") continue; }
  return son;
}
/* Harf sesi: harfin adı ("ne") değil, sesin kendisi ("nnn"). Sonuç önbelleğe girer, her seferinde aynı ses çalar. */
const SUREKLI = "nmlrsşzfvyhğj", PATLAMALI = "bcçdgkpt", SESLI = "aeıioöuü";
function harfIstemi(l) {
  if (SESLI.includes(l)) return `Bir ilkokul öğretmeni gibi Türkçedeki "${l}" ünlüsünü tek başına, net ve biraz uzatarak söyle: «${l.repeat(3)}». Başka hiçbir şey söyleme.`;
  if (SUREKLI.includes(l)) return `Bir ilkokul öğretmeni harfleri çocuklara ses olarak öğretiyor. Türkçedeki "${l}" sesini çıkar. Harfin adını söyleme (örneğin "${l}e" deme). Önüne ya da arkasına ünlü ekleme. Yalnızca ünsüz sesi yaklaşık bir saniye kesintisiz uzat: «${l.repeat(5)}». Başka hiçbir şey söyleme.`;
  return `Bir ilkokul öğretmeni harfleri çocuklara ses olarak öğretiyor. Türkçedeki "${l}" sesini çıkar. Harfin adını söyleme (örneğin "${l}e" deme). Bu patlamalı bir ünsüz: tek, kısa ve hafif bir patlama olarak söyle, arkasına neredeyse hiç ünlü gelmesin. Başka hiçbir şey söyleme.`;
}
async function sesModel(env, metin, model, istem, ses_) {
  /* Dil açıkça Türkçe verilir; "fare", "su", "pide" gibi kelimeler İngilizce okunmasın. */
  const istek = (dilKodu) => fetch(`${env.GEMINI_BASE || "https://generativelanguage.googleapis.com"}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: istem || "Aşağıdaki metin Türkçedir. İngilizce kelimeye benzese bile Türkçe harf sesleriyle, Türkiye Türkçesi telaffuzuyla oku. Sıcak ve net bir sesle, ilkokul öğretmeninin çocuklara okuması gibi, doğal hızda söyle. Metin: «" + metin + "»" }] }],
      generationConfig: { responseModalities: ["AUDIO"], speechConfig: Object.assign({ voiceConfig: { prebuiltVoiceConfig: { voiceName: ses_ || env.TTS_VOICE || "Kore" } } }, dilKodu ? { languageCode: "tr-TR" } : {}) },
    }),
  });
  let r = await istek(true);
  if (r.status === 400) r = await istek(false);
  if (r.status === 404) return { fail: "model" };
  if (r.status === 429) return { fail: "busy" };
  if (!r.ok) return { fail: "upstream" };
  const j = await r.json();
  const part = (((j.candidates || [])[0] || {}).content || { parts: [] }).parts.find((p) => p.inlineData || p.inline_data);
  if (!part) return { fail: "empty" };
  const d = part.inlineData || part.inline_data;
  const rate = parseInt((/rate=(\d+)/.exec(d.mimeType || d.mime_type || "") || [])[1], 10) || 24000;
  return { wav: wav(unb64u(d.data.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")), rate) };
}
const SES_MAX = 240;
/* Oyun karakterlerinin sabit sözleri: yalnızca bu listedekiler, çocuk sesiyle üretilir ve saklanır. */
const KARAKTER = { kiz: "Leda", erkek: "Puck" };
const KARAKTER_SOZ = ["Teşekkür ederim!", "Harikasın!", "Tekrar dene!", "Çok güzel!", "Afiyet olsun!", "Merhaba!", "Süper!", "Hadi hece ve kelime oluşturalım!"];
const karakterIstemi = (kim, soz) => `Sen ${kim === "kiz" ? "yedi yaşında neşeli bir kız" : "yedi yaşında neşeli bir erkek"} çocuksun. Türkiye Türkçesiyle, sevinçli ve doğal bir çocuk sesiyle yalnızca şunu söyle: «${soz}» Başka hiçbir şey söyleme.`;

const kota = (env, email) => env.KOTA.get(env.KOTA.idFromName("ogretmen:" + email));
const limitOf = (env) => Math.max(1, parseInt(env.DAILY_LIMIT, 10) || 10);
/* Site geneli günlük tavan: ücretsiz kotayı korur, ödeme çıkmasını önler. */
const genel = (env) => env.KOTA.get(env.KOTA.idFromName("genel"));
const globalOf = (env) => Math.max(1, parseInt(env.GLOBAL_LIMIT, 10) || 400);

/* ---------- Gemini ---------- */
const MAX_IMG = 4, MAX_PROMPT = 24000;
async function gemini(env, prompt, images, json) {
  /* Bir model hata verirse ya da yoğunsa sıradakini dener */
  const modeller = [...new Set([env.GEMINI_MODEL, "gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.1-flash-lite", "gemini-flash-latest"].filter(Boolean))];
  let son = { fail: "upstream" };
  for (const model of modeller) {
    for (let deneme = 0; deneme < 2; deneme++) {
      let r;
      try { r = await geminiModel(env, model, prompt, images, json); } catch { r = { fail: "network" }; }
      if (!r.fail) return r;
      son = r;
      if (r.fail === "model" || r.fail === "bad") break;
      if (deneme === 0 && (r.fail === "busy" || r.fail === "upstream" || r.fail === "network")) { await new Promise((ok) => setTimeout(ok, 900)); continue; }
      break;
    }
  }
  return son;
}
async function geminiModel(env, model, prompt, images, json) {
  const parts = [{ text: prompt }];
  for (const im of images.slice(0, MAX_IMG)) parts.push({ inline_data: { mime_type: im.mime, data: im.data } });
  const r = await fetch(`${env.GEMINI_BASE || "https://generativelanguage.googleapis.com"}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: Object.assign({ temperature: 0.7, maxOutputTokens: 20000 }, json ? { responseMimeType: "application/json" } : {}) }),
  });
  if (r.status === 429 || r.status === 503) return { fail: "busy", status: r.status };
  if (r.status === 404) return { fail: "model", status: 404 };
  if (r.status === 400) return { fail: "bad", status: 400 };
  if (!r.ok) return { fail: "upstream", status: r.status };
  const j = await r.json();
  const c = (j.candidates || [])[0];
  const text = ((c && c.content && c.content.parts) || []).filter((p) => !p.thought).map((p) => p.text || "").join("");
  if (!text) return { fail: "empty", status: (c && c.finishReason) || "bos" };
  return { text };
}

/* ---------- Cep kumandası: tahta ile telefon arasında kısa ömürlü WebSocket köprüsü ----------
   Oda adı tahtanın ürettiği 22 karakterlik rastgele anahtardır (QR'ın içinde). Hiçbir mesaj, fotoğraf ya da kayıt saklanmaz.
   Oda 3 saat sonra kendiliğinden kapanır. */
export class Eslesme extends DurableObject {
  async fetch(request) {
    const url = new URL(request.url), rol = url.searchParams.get("rol") === "tahta" ? "tahta" : "telefon";
    if (request.headers.get("Upgrade") !== "websocket") return new Response("websocket gerekli", { status: 426 });
    const pair = new WebSocketPair();
    const eski = this.ctx.getWebSockets(rol);
    if (rol === "tahta") eski.forEach((w) => { try { w.close(4000, "yeni tahta"); } catch (e) {} });
    if (rol === "telefon" && eski.length >= 3) return new Response("dolu", { status: 429 });
    if (rol === "telefon" && !this.ctx.getWebSockets("tahta").length) return new Response("tahta yok", { status: 404 });
    this.ctx.acceptWebSocket(pair[1], [rol]);
    if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(Date.now() + 3 * 3600e3);
    const bildir = (r, m) => this.ctx.getWebSockets(r).forEach((w) => { try { w.send(m); } catch (e) {} });
    if (rol === "telefon") bildir("tahta", JSON.stringify({ t: "baglandi", n: this.ctx.getWebSockets("telefon").length }));
    return new Response(null, { status: 101, webSocket: pair[0] });
  }
  webSocketMessage(ws, msg) {
    if (typeof msg === "string" && msg.length > 1500000) return;
    const rol = this.ctx.getTags(ws)[0], hedef = rol === "tahta" ? "telefon" : "tahta";
    this.ctx.getWebSockets(hedef).forEach((w) => { try { w.send(msg); } catch (e) {} });
  }
  webSocketClose(ws) {
    const rol = this.ctx.getTags(ws)[0];
    if (rol === "telefon") this.ctx.getWebSockets("tahta").forEach((w) => { try { w.send(JSON.stringify({ t: "ayrildi", n: Math.max(0, this.ctx.getWebSockets("telefon").length - 1) })); } catch (e) {} });
    if (rol === "tahta") this.ctx.getWebSockets("telefon").forEach((w) => { try { w.close(4001, "tahta kapandı"); } catch (e) {} });
  }
  async alarm() { this.ctx.getWebSockets().forEach((w) => { try { w.close(4002, "süre doldu"); } catch (e) {} }); await this.ctx.storage.deleteAll(); }
}


/* ---------- Bulut kaydı: her öğretmenin verisi kendi kasasında, kilitli ---------- */
const DEPO_MAX = 6e6, PARCA = 500000;
async function depoAnahtar(env, email) {
  const ham = await crypto.subtle.importKey("raw", enc.encode(env.DEPO_ANAHTAR), "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: enc.encode("tahta-atolyesi-depo"), info: enc.encode(email) }, ham, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
export class Depo extends DurableObject {
  async meta() { return (await this.ctx.storage.get("m")) || { surum: 0, zaman: 0, n: 0 }; }
  async al() {
    const m = await this.meta(); if (!m.surum) return { surum: 0, zaman: 0 };
    const p = await this.ctx.storage.get(Array.from({ length: m.n }, (_, i) => "p" + i));
    return { surum: m.surum, zaman: m.zaman, iv: m.iv, veri: Array.from({ length: m.n }, (_, i) => p.get("p" + i) || "").join("") };
  }
  async koy(taban, iv, veri) {
    const m = await this.meta();
    if (taban !== m.surum) return { cakisma: true, surum: m.surum, zaman: m.zaman };
    /* günde bir kez önceki hâlin kopyasını sakla: yanlışlıkla silinen veri geri alınabilsin */
    const onceki = await this.ctx.storage.get("om");
    if (m.surum && (!onceki || new Date(onceki.alindi + 3 * 3600e3).toISOString().slice(0, 10) !== new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10))) {
      const p = await this.ctx.storage.get(Array.from({ length: m.n }, (_, i) => "p" + i)), kopya = { om: Object.assign({}, m, { alindi: Date.now() }) };
      for (let i = 0; i < m.n; i++) kopya["op" + i] = p.get("p" + i) || "";
      if (onceki && onceki.n > m.n) await this.ctx.storage.delete(Array.from({ length: onceki.n - m.n }, (_, i) => "op" + (m.n + i)));
      await this.ctx.storage.put(kopya);
    }
    const n = Math.ceil(veri.length / PARCA), yeni = { surum: m.surum + 1, zaman: Date.now(), n, iv }, kayit = { m: yeni };
    for (let i = 0; i < n; i++) kayit["p" + i] = veri.slice(i * PARCA, (i + 1) * PARCA);
    await this.ctx.storage.put(kayit);
    if (m.n > n) await this.ctx.storage.delete(Array.from({ length: m.n - n }, (_, i) => "p" + (n + i)));
    return { surum: yeni.surum, zaman: yeni.zaman };
  }
  async onceki() {
    const m = await this.ctx.storage.get("om"); if (!m) return { surum: 0 };
    const p = await this.ctx.storage.get(Array.from({ length: m.n }, (_, i) => "op" + i));
    return { surum: m.surum, zaman: m.zaman, iv: m.iv, veri: Array.from({ length: m.n }, (_, i) => p.get("op" + i) || "").join("") };
  }
  async sil() { await this.ctx.storage.deleteAll(); return { ok: true }; }
}
const depo = (env, email) => env.DEPO.get(env.DEPO.idFromName("depo:" + email));
async function depoApi(request, env, path) {
  if (!env.DEPO || !env.DEPO_ANAHTAR) return err("depo_kapali", "Bulut kaydı henüz kurulmadı.", 503);
  const user = await readSession(env, request);
  if (!user) return err("login", "Önce Google ile giriş yap.", 401);
  const kasa = depo(env, user.email);
  if (request.method === "GET") {
    const onc = new URL(request.url).searchParams.get("onceki") === "1";
    const d = onc ? await kasa.onceki() : await kasa.al(); if (!d.surum) return json({ surum: 0 });
    const k = await depoAnahtar(env, user.email);
    let duz; try { duz = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64u(d.iv) }, k, unb64u(d.veri))); }
    catch { return err("depo_okunamadi", "Buluttaki kayıt açılamadı.", 500); }
    return json({ surum: d.surum, zaman: d.zaman, veri: duz, onceki: onc || undefined });
  }
  if (request.method === "PUT") {
    const boy = +(request.headers.get("content-length") || 0); if (boy > DEPO_MAX) return err("buyuk", "Kayıt çok büyük.", 413);
    const metin = await request.text(); if (metin.length > DEPO_MAX) return err("buyuk", "Kayıt çok büyük.", 413);
    let b; try { b = JSON.parse(metin); } catch { return err("bad_request", "İstek okunamadı.", 400); }
    if (typeof b.veri !== "string" || !Number.isInteger(b.taban)) return err("bad_request", "Eksik bilgi.", 400);
    const q = await env.KOTA.get(env.KOTA.idFromName("depo:" + user.email)).kullan(today(), 2000);
    if (!q.ok) return err("limit", "Bugün çok fazla kayıt yapıldı. Yarın yeniden eşitlenecek.", 429);
    const k = await depoAnahtar(env, user.email), iv = crypto.getRandomValues(new Uint8Array(12));
    const kilitli = b64u(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, enc.encode(b.veri)));
    const r = await kasa.koy(b.taban, b64u(iv), kilitli);
    return r.cakisma ? json({ error: { code: "cakisma", message: "Başka bir cihazda daha yeni bir kayıt var." }, surum: r.surum, zaman: r.zaman }, 409) : json(r);
  }
  if (request.method === "DELETE") { await kasa.sil(); return json({ ok: true }); }
  return err("not_found", "Böyle bir adres yok.", 404);
}

async function api(request, env, path) {
  if (path === "/api/kumanda" && env.ESLESME) {
    const oda = new URL(request.url).searchParams.get("oda") || "";
    if (!/^[A-Za-z0-9_-]{22}$/.test(oda)) return err("oda", "Geçersiz bağlantı.", 400);
    return env.ESLESME.get(env.ESLESME.idFromName(oda)).fetch(request);
  }
  const clientId = env.GOOGLE_CLIENT_ID || "";
  const ready = Boolean(clientId && env.GEMINI_API_KEY);

  if (path === "/api/config" && request.method === "GET") return json({ clientId: ready ? clientId : "", ready, depo: Boolean(env.DEPO && env.DEPO_ANAHTAR) });
  if (path === "/api/depo") {
    const o = request.headers.get("origin"); if (o && o !== new URL(request.url).origin) return err("origin", "İzin verilmeyen kaynak.", 403);
    return depoApi(request, env, path);
  }

  if (path === "/api/login" && request.method === "POST") {
    if (!ready) return err("not_configured", "Google ile giriş henüz kurulmadı.", 503);
    let b; try { b = await request.json(); } catch { return err("bad_request", "İstek okunamadı.", 400); }
    const user = await verifyGoogle(b.credential, clientId);
    if (!user) return err("bad_login", "Google girişi doğrulanamadı. Bir kez daha dene.", 401);
    const token = await makeSession(env, user);
    const q = await kota(env, user.email).durum(today(), limitOf(env));
    return json({ token, user, quota: q });
  }

  /* Doğal ses: giriş gerekmez; IP ve günlük sınırla korunur, okunan cümle saklanır. */
  if (path === "/api/ses" && request.method === "POST") {
    let b; try { b = await request.json(); } catch { return err("bad_request", "İstek okunamadı.", 400); }
    const metin = String(b.metin || "").replace(/\s+/g, " ").trim().slice(0, SES_MAX);
    if (!metin) return err("bad_request", "Okunacak metin yok.", 400);
    const harf = b.tur === "harf" ? metin.toLocaleLowerCase("tr") : "";
    if (harf && !(SUREKLI + PATLAMALI + SESLI).includes(harf)) return err("bad_request", "Harf tanınmadı.", 400);
    const kim = b.tur === "karakter" ? String(b.kim || "") : "";
    if (kim && (!KARAKTER[kim] || !KARAKTER_SOZ.includes(metin))) return err("bad_request", "Bu söz tanınmadı.", 400);
    const istem = harf ? harfIstemi(harf) : kim ? karakterIstemi(kim, metin) : null, sesAdi = kim ? KARAKTER[kim] : null;
    const anahtar = await sha((harf ? "harf1|" : kim ? "kar1|" + kim + "|" : "v2|") + (sesAdi || env.TTS_VOICE || "Kore") + "|" + metin.toLocaleLowerCase("tr"));
    const depo = env.SES.get(env.SES.idFromName("ses:" + anahtar.slice(0, 2)));
    const varolan = await depo.al(anahtar);
    const ses_h = { "content-type": "audio/wav", "cache-control": "public, max-age=31536000, immutable" };
    if (varolan) return new Response(unb64u(varolan), { headers: ses_h });
    const ip = request.headers.get("cf-connecting-ip") || "x";
    const iq = await genel(env).kullan(today() + ":ses:" + (await sha(ip)).slice(0, 16), Math.max(1, parseInt(env.TTS_IP_LIMIT, 10) || 150));
    if (!iq.ok) return err("tts_limit", "Doğal ses bugünlük doldu, cihazın sesi kullanılıyor.", 429);
    const gq = await genel(env).kullan(today() + ":ses", Math.max(1, parseInt(env.TTS_LIMIT, 10) || 300));
    if (!gq.ok) return err("tts_limit", "Doğal ses bugünlük doldu, cihazın sesi kullanılıyor.", 429);
    let g; try { g = await ses(env, metin, istem, sesAdi); } catch { g = { fail: "network" }; }
    if (g.fail) { await genel(env).iade(today() + ":ses"); return err("tts_" + g.fail, "Doğal ses şu an üretilemedi.", 503); }
    if (g.wav.length < 120000) await depo.koy(anahtar, b64u(g.wav));
    return new Response(g.wav, { headers: ses_h });
  }

  const user = await readSession(env, request);
  if (!user) return err("signed_out", "Oturum kapandı. Google ile yeniden giriş yap.", 401);

  if (path === "/api/me" && request.method === "GET") {
    return json({ user, quota: await kota(env, user.email).durum(today(), limitOf(env)) });
  }

  if (path === "/api/ai" && request.method === "POST") {
    let b; try { b = await request.json(); } catch { return err("bad_request", "İstek okunamadı.", 400); }
    const prompt = String(b.prompt || "").slice(0, MAX_PROMPT);
    if (!prompt.trim()) return err("bad_request", "Boş istek gönderildi.", 400);
    const images = (Array.isArray(b.images) ? b.images : [])
      .filter((x) => x && /^image\/(jpeg|png|webp|heic|heif)$/.test(x.mime) && typeof x.data === "string" && x.data.length < 6e6);
    const gun = today(), k = kota(env, user.email), gk = genel(env);
    const q = await k.kullan(gun, limitOf(env));
    if (!q.ok) return json({ error: { code: "limit", message: `Bugünlük ${q.limit} yapay zekâ hakkının hepsini kullandın. Hakkın gece 00.00'da yenilenir.` }, quota: q }, 429);
    const gq = await gk.kullan(gun, globalOf(env));
    if (!gq.ok) {
      await k.iade(gun);
      return json({ error: { code: "global_limit", message: "Sitenin bugünlük ortak yapay zekâ hakkı doldu. Yarın yeniden açılacak, senin hakkından düşülmedi." }, quota: { used: q.used - 1, limit: q.limit, left: q.left + 1 } }, 429);
    }
    let g;
    try { g = await gemini(env, prompt, images, !!b.json); } catch { g = { fail: "network" }; }
    if (g.fail) {
      await k.iade(gun); await gk.iade(gun);
      const back = { used: q.used - 1, limit: q.limit, left: q.left + 1 };
      if (g.fail === "busy") return json({ error: { code: "busy", message: "Yapay zekâ şu an çok yoğun. Birkaç dakika sonra tekrar dene, hakkından düşülmedi." }, quota: back }, 503);
      return json({ error: { code: "upstream", message: "Yapay zekâ yanıt vermedi (" + g.fail + " " + (g.status || "") + "). Biraz sonra tekrar dene, hakkından düşülmedi." }, quota: back }, 502);
    }
    return json({ text: g.text, quota: q });
  }

  return err("not_found", "Böyle bir adres yok.", 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try { return await api(request, env, url.pathname); }
      catch (e) { return err("server", "Sunucuda bir sorun çıktı. Biraz sonra tekrar dene.", 500); }
    }
    return env.ASSETS.fetch(request);
  },
};
