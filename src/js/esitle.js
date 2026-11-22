/* Bulut kaydı (yerel öncelikli eşitleme).
   Her değişiklik önce bu cihaza yazılır. Öğretmen Google ile giriş yaptıysa 2,5 saniye sonra sessizce buluta gider.
   İnternet yoksa bekler, bağlantı gelince gönderir. Sunucu kaydı kilitli saklar.
   İsteğe bağlı parola: kayıt cihazdan çıkmadan önce öğretmenin parolasıyla da kilitlenir; o zaman sunucu bile açamaz.
   Yapay zekâya hiçbir şey gönderilmez. */
T.esitle = (function () {
  const DURUM = "ta-esitle", KILIT = "ta-kilit-anahtar";
  const STORE = "tahta-atolyesi-v1";
  /* bu cihaza özgü ayarlar eşitlenmez */
  const HARIC = /^(tahta-atolyesi-oturum|tahta-atolyesi-v1|ta-esitle|ta-kilit-anahtar|ta-ses-cihaz|ta-calar-|ta-dock-kucuk|ta-hosgeldin|ta-kitap-acik|ta-son)/;
  const oku = () => { try { return Object.assign({ surum: 0, zaman: 0, kirli: false, bagli: false }, JSON.parse(localStorage.getItem(DURUM) || "{}")); } catch (e) { return { surum: 0, zaman: 0, kirli: false, bagli: false }; } };
  const yazD = (d) => { try { localStorage.setItem(DURUM, JSON.stringify(d)); } catch (e) {} dinleyen.forEach((f) => { try { f(); } catch (e) {} }); };
  const dinleyen = new Set();
  let d = oku(), zaman = null, uygulaniyor = false, gidiyor = false, hata = "", ekIz = "";

  const acik = () => !!(T.auth && T.auth.user() && T.auth.depo && T.auth.depo());
  /* eşitlenen paket: ana kayıt + öğretmenin yazdığı diğer ayarlar */
  function paket() {
    const ek = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (!/^(ta-|tahta-)/.test(k) || HARIC.test(k)) continue; const v = localStorage.getItem(k); if (v && v.length < 300000) ek[k] = v; }
    return { v: 1, store: T.store.get(), ek };
  }
  const ekImza = () => { let s = ""; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^(ta-|tahta-)/.test(k) && !HARIC.test(k)) s += k + ":" + (localStorage.getItem(k) || "").length + ";"; } return s; };

  /* ---------- isteğe bağlı parola kilidi (tarayıcıda) ---------- */
  const b64 = (u) => { let s = ""; const a = new Uint8Array(u); for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function paroladanAnahtar(parola) {
    const ham = await crypto.subtle.importKey("raw", new TextEncoder().encode(parola), "PBKDF2", false, ["deriveKey"]);
    const tuz = new TextEncoder().encode("tahta-atolyesi:" + ((T.auth.user() || {}).email || ""));
    return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: tuz, iterations: 210000 }, ham, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  }
  async function kilitAnahtari() { try { const j = localStorage.getItem(KILIT); return j ? crypto.subtle.importKey("jwk", JSON.parse(j), { name: "AES-GCM" }, true, ["encrypt", "decrypt"]) : null; } catch (e) { return null; } }
  async function kilitle(metin) {
    const k = await kilitAnahtari(); if (!k) return metin;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    return JSON.stringify({ kilit: 1, iv: b64(iv), veri: b64(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, new TextEncoder().encode(metin))) });
  }
  async function ac(metin) {
    let j; try { j = JSON.parse(metin); } catch (e) { return null; }
    if (!j || !j.kilit) return j;
    let k = await kilitAnahtari();
    for (let deneme = 0; deneme < 3; deneme++) {
      if (!k) { const p = await parolaSor("Buluttaki kayıt parolayla kilitli", "Sınıf listesini açmak için parolanı yaz."); if (!p) return null; k = await paroladanAnahtar(p); }
      try { const duz = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(j.iv) }, k, unb64(j.veri))); localStorage.setItem(KILIT, JSON.stringify(await crypto.subtle.exportKey("jwk", k))); return JSON.parse(duz); }
      catch (e) { k = null; T.toast("Parola yanlış"); }
    }
    return null;
  }
  function parolaSor(baslik, metin) {
    return new Promise((res) => {
      const inp = T.h("input.in", { type: "password", autocomplete: "current-password", "aria-label": "Parola" });
      let bitti = false; const son = (v) => { if (!bitti) { bitti = true; res(v); } };
      T.modal({ title: baslik, body: T.h("div", { style: { display: "grid", gap: "10px" } }, T.h("p", { style: { margin: 0 } }, metin), inp),
        actions: [{ label: "Vazgeç", onClick: () => son(null) }, { label: "Aç", tone: "c-leaf", onClick: () => son(inp.value || null) }], onClose: () => son(null) });
      setTimeout(() => inp.focus(), 50);
    });
  }

  /* ---------- gönder / al ---------- */
  async function gonder() {
    clearTimeout(zaman); zaman = null;
    if (!acik() || gidiyor || !d.bagli) return;
    if (!navigator.onLine) { hata = "Çevrimdışı. Bağlantı gelince gönderilecek."; yazD(d); return; }
    gidiyor = true;
    try {
      const veri = await kilitle(JSON.stringify(paket()));
      const r = await fetch("/api/depo", { method: "PUT", headers: { "content-type": "application/json", authorization: "Bearer " + T.auth.token() }, body: JSON.stringify({ taban: d.surum, veri }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 409) { gidiyor = false; return cakisma(); }
      if (r.status === 401) { hata = "Oturum kapandı. Yeniden Google ile giriş yap."; return; }
      if (!r.ok) { hata = (j.error && j.error.message) || "Gönderilemedi."; return; }
      d.surum = j.surum; d.zaman = j.zaman; d.kirli = false; hata = ""; ekIz = ekImza();
    } catch (e) { hata = "Gönderilemedi. Biraz sonra yeniden denenecek."; zamanla(30000); }
    finally { gidiyor = false; yazD(d); }
  }
  const zamanla = (ms = 2500) => { clearTimeout(zaman); zaman = setTimeout(gonder, ms); };
  function degisti() { if (uygulaniyor) return; d.kirli = true; yazD(d); if (acik() && d.bagli) zamanla(); }

  async function cek(onceki) {
    const r = await fetch("/api/depo" + (onceki ? "?onceki=1" : ""), { headers: { authorization: "Bearer " + T.auth.token() } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((j.error && j.error.message) || "Bulut kaydı alınamadı.");
    return j;
  }
  async function uygula(j) {
    const p = await ac(j.veri); if (!p || !p.store) { T.toast("Buluttaki kayıt açılamadı"); return false; }
    uygulaniyor = true;
    try {
      localStorage.setItem(STORE, JSON.stringify(p.store));
      Object.entries(p.ek || {}).forEach(([k, v]) => { if (!HARIC.test(k)) try { localStorage.setItem(k, v); } catch (e) {} });
      T.store.load(); T.store.update(() => {});
    } finally { uygulaniyor = false; }
    if (!j.onceki) { d.surum = j.surum; d.zaman = j.zaman; }
    d.kirli = !!j.onceki; ekIz = ekImza(); yazD(d);
    T.applyTheme && T.applyTheme(); T.route && T.route();
    if (j.onceki) zamanla(500);
    return true;
  }
  /* ilk bağlanış: cihazda ve bulutta veri varsa öğretmen seçer */
  async function bagla() {
    if (!acik()) return;
    let j; try { j = await cek(); } catch (e) { hata = e.message; yazD(d); return; }
    if (!j.surum) { d.bagli = true; d.surum = 0; yazD(d); return gonder(); }
    if (d.bagli && !d.kirli) { if (j.surum !== d.surum) await uygula(j); return; }
    if (d.bagli && d.kirli && j.surum === d.surum) return gonder();
    const tarih = new Date(j.zaman).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
    T.modal({ title: "Bulutta kaydın var",
      body: T.h("div", { style: { display: "grid", gap: "10px" } }, T.h("p", { style: { margin: 0 } }, "Hesabında " + tarih + " tarihli bir kayıt var. Bu cihazda da veri var. Hangisiyle devam edelim?"),
        T.h("p.hint", { style: { margin: 0 } }, "Seçmediğin taraf silinmez: bulut önceki hâlini bir gün saklar.")),
      actions: [
        { label: "Bu cihazdakini buluta aktar", tone: "c-chalk", onClick: () => { d.bagli = true; d.surum = j.surum; d.kirli = true; yazD(d); gonder(); } },
        { label: "Buluttakini buraya indir", tone: "c-leaf", onClick: () => { d.bagli = true; yazD(d); uygula(j); } }] });
  }
  async function cakisma() {
    let j; try { j = await cek(); } catch (e) { return; }
    const tarih = new Date(j.zaman).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
    T.modal({ title: "Başka bir cihazda daha yeni kayıt var",
      body: T.h("p", { style: { margin: 0 } }, "Bu sırada başka bir cihazda (" + tarih + ") değişiklik yapılmış. Hangisi kalsın?"),
      actions: [
        { label: "Bu cihazdaki kalsın", tone: "c-chalk", onClick: () => { d.surum = j.surum; yazD(d); gonder(); } },
        { label: "Diğer cihazdaki gelsin", tone: "c-leaf", onClick: () => uygula(j) }] });
  }

  /* ---------- tetikleyiciler ---------- */
  T.store.subscribe(degisti);
  setInterval(() => { if (!acik() || !d.bagli) return; const s = ekImza(); if (ekIz && s !== ekIz) { ekIz = s; degisti(); } else if (!ekIz) ekIz = s; }, 20000);
  window.addEventListener("online", () => { if (d.kirli) zamanla(500); });
  /* başka cihazdaki değişiklikler: sekmeye dönünce bak */
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && acik() && d.bagli && !d.kirli) cek().then((j) => { if (j.surum && j.surum !== d.surum) uygula(j); }).catch(() => {}); });
  window.addEventListener("pagehide", () => { if (d.kirli && acik() && d.bagli) gonder(); });
  let oncekiKul = null;
  const kontrol = () => { const u = T.auth.user(), e = u && u.email; if (e === oncekiKul) return; oncekiKul = e;
    if (e && d.hesap && d.hesap !== e) { d = { surum: 0, zaman: 0, kirli: true, bagli: false, hesap: e }; try { localStorage.removeItem(KILIT); } catch (er) {} yazD(d); }
    if (e) { d.hesap = e; yazD(d); bagla(); } };
  T.auth.ready.then(() => { kontrol(); T.auth.on(kontrol); });

  return {
    durum: () => ({ acik: acik(), bagli: d.bagli, kirli: d.kirli, zaman: d.zaman, gidiyor, hata, kilit: !!localStorage.getItem(KILIT) }),
    on: (f) => { dinleyen.add(f); return () => dinleyen.delete(f); },
    simdi: () => { if (!d.bagli) return bagla(); d.kirli = true; return gonder(); },
    async parolaKoy() {
      const p1 = await parolaSor("Parolayla kilitle", "Bu parola yalnızca sende kalır. Unutursan buluttaki kaydı kimse açamaz. En az 8 karakter yaz."); if (!p1) return;
      if (p1.length < 8) return T.toast("En az 8 karakter olmalı");
      const p2 = await parolaSor("Parolayı tekrar yaz", "Yanlış yazılmadığından emin olalım."); if (p1 !== p2) return T.toast("Parolalar aynı değil");
      localStorage.setItem(KILIT, JSON.stringify(await crypto.subtle.exportKey("jwk", await paroladanAnahtar(p1))));
      d.kirli = true; yazD(d); await gonder(); T.toast("Kayıt artık parolanla kilitli");
    },
    async parolaKaldir() { if (!(await T.confirm("Parola kilidini kaldır", "Kayıt yine kilitli saklanır ama anahtarı sunucuda durur. Devam edilsin mi?", "Kaldır"))) return; localStorage.removeItem(KILIT); d.kirli = true; yazD(d); await gonder(); T.toast("Parola kilidi kaldırıldı"); },
    async dunkuHal() {
      let j; try { j = await cek(true); } catch (e) { return T.toast(e.message); }
      if (!j.surum) return T.toast("Bulutta önceki bir hâl yok");
      const tarih = new Date(j.zaman).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
      if (await T.confirm("Önceki hâle dön", tarih + " tarihli kayıt bu cihaza gelsin mi? Şimdiki veriler onunla değişir.", "Geri getir")) uygula(j);
    },
    async bulutuSil() {
      if (!(await T.confirm("Buluttaki kaydı sil", "Hesabındaki bütün bulut kaydı silinsin mi? Bu cihazdaki veriler kalır.", "Sil"))) return;
      try { await fetch("/api/depo", { method: "DELETE", headers: { authorization: "Bearer " + T.auth.token() } }); d = { surum: 0, zaman: 0, kirli: true, bagli: false, hesap: d.hesap }; yazD(d); T.toast("Buluttaki kayıt silindi. Eşitleme durdu."); }
      catch (e) { T.toast("Silinemedi"); }
    },
    durdur() { d.bagli = false; yazD(d); },
  };
})();
