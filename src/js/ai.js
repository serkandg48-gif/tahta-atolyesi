/* Yapay zeka köprüsü.
   1) Sayfa Claude içinde açıldıysa: Claude (öğretmene ücretsiz, anahtar gerekmez).
   2) Kendi sitende: Ayarlar'a girilen Gemini anahtarı (Google AI Studio, ücretsiz katman).
   Öğrenci adları hiçbir zaman gönderilmez. */
T.ai = (function () {
  function mode() {
    if (T.cap.sample) return "claude";
    const k = T.store.get().settings.geminiKey;
    if (k && window.self === window.top) return "gemini";
    return null;
  }
  async function ask(prompt, { onText, images } = {}) {
    const m = mode();
    if (m === "claude") {
      const o = { modelTier: "default", onText: onText ? ({ text }) => onText(text) : undefined };
      if (images && images.length) o.images = images;
      const r = await T.cap.sample(prompt, o);
      return r.text;
    }
    if (m === "gemini") {
      const s = T.store.get().settings;
      const model = s.geminiModel || "gemini-flash-latest";
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": s.geminiKey },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }].concat(await Promise.all((images || []).map(async (b) => ({ inline_data: { mime_type: b.type || "image/jpeg", data: await blobB64(b) } })))) }], generationConfig: { temperature: 0.7 } }),
      });
      if (res.status === 429) throw { code: "rate_limited", message: "Günlük ücretsiz kota doldu. Yarın tekrar dene." };
      if (!res.ok) throw { code: "http", message: "Gemini yanıt vermedi (" + res.status + "). Anahtarı Ayarlar'dan kontrol et." };
      const j = await res.json();
      const text = (((j.candidates || [])[0] || {}).content || { parts: [] }).parts.map((p) => p.text || "").join("");
      onText && onText(text);
      return text;
    }
    throw { code: "none", message: "Yapay zeka bağlı değil." };
  }
  const blobB64 = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(b); });
  /* Metnin içindeki ilk JSON nesnesini çıkarır. */
  function parseJSON(text) {
    const t = text.replace(/```json|```/g, "");
    const a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a < 0 || b < a) throw { code: "parse", message: "Yanıt okunamadı. Bir kez daha dene." };
    return JSON.parse(t.slice(a, b + 1));
  }
  async function askJSON(prompt, opts) { return parseJSON(await ask(prompt + "\n\nYalnızca geçerli JSON döndür. Açıklama ekleme.", opts)); }
  function statusEl() {
    const m = mode();
    if (m === "claude") return T.h("div.ai-status", T.icon("spark"), "Yapay zeka hazır: Claude bu sayfada ücretsiz çalışıyor.");
    if (m === "gemini") return T.h("div.ai-status", T.icon("spark"), "Yapay zeka hazır: Gemini anahtarın kullanılıyor.");
    return T.h("div.ai-status", T.icon("spark"),
      T.h("span", "Yapay zeka bağlı değil. Örnek planı inceleyebilirsin. Kendi sitende ",
        T.h("button.btn.sm.plain", { onclick: () => T.go("ayarlar") }, "Ayarlar"), " bölümüne ücretsiz Gemini anahtarını gir."));
  }
  return { mode, ask, askJSON, parseJSON, statusEl };
})();
