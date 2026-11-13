/* Tahta Atölyesi sunucusu (Cloudflare Worker).
   - /api/*  : Google ile giriş ve yapay zekâ köprüsü
   - geri kalan her şey: dist/ klasöründeki site

   Cloudflare panelinde tanımlanması gerekenler (Settings > Variables and Secrets):
   GEMINI_API_KEY   (Secret)  Google AI Studio anahtarı. Öğretmenler bu anahtarı hiç görmez.
   GOOGLE_CLIENT_ID (wrangler.jsonc içinde, gizli değil) Google ile giriş için istemci kimliği.
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
  const modeller = (env.TTS_MODEL ? [env.TTS_MODEL] : []).concat(["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"]);
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
async function gemini(env, prompt, images) {
  const model = env.GEMINI_MODEL || "gemini-flash-latest";
  const parts = [{ text: prompt }];
  for (const im of images.slice(0, MAX_IMG)) parts.push({ inline_data: { mime_type: im.mime, data: im.data } });
  const r = await fetch(`${env.GEMINI_BASE || "https://generativelanguage.googleapis.com"}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } }),
  });
  if (r.status === 429) return { fail: "busy" };
  if (!r.ok) return { fail: "upstream", status: r.status };
  const j = await r.json();
  const c = (j.candidates || [])[0];
  const text = ((c && c.content && c.content.parts) || []).map((p) => p.text || "").join("");
  if (!text) return { fail: "empty" };
  return { text };
}

async function api(request, env, path) {
  const clientId = env.GOOGLE_CLIENT_ID || "";
  const ready = Boolean(clientId && env.GEMINI_API_KEY);

  if (path === "/api/config" && request.method === "GET") return json({ clientId: ready ? clientId : "", ready });

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
    try { g = await gemini(env, prompt, images); } catch { g = { fail: "network" }; }
    if (g.fail) {
      await k.iade(gun); await gk.iade(gun);
      const back = { used: q.used - 1, limit: q.limit, left: q.left + 1 };
      if (g.fail === "busy") return json({ error: { code: "busy", message: "Yapay zekâ şu an çok yoğun. Birkaç dakika sonra tekrar dene, hakkından düşülmedi." }, quota: back }, 503);
      return json({ error: { code: "upstream", message: "Yapay zekâ yanıt vermedi. Biraz sonra tekrar dene, hakkından düşülmedi." }, quota: back }, 502);
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
