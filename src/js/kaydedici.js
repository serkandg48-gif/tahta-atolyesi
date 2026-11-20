/* Sesli okuma kaydedici: öğrenci bir şiiri, kitap tanıtımını ya da gözlemini kaydeder.
   Kayıtlar yalnızca bu tarayıcıda (IndexedDB) durur, sunucuya hiç gitmez. Eski kayıtla yenisi yan yana dinlenir. */
(function () {
  const { h } = T;
  const vt = () => new Promise((res, rej) => { const r = indexedDB.open("ta-ses", 1); r.onupgradeneeded = () => r.result.createObjectStore("kayit", { keyPath: "id" }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const islem = async (mod, f) => { const d = await vt(); return new Promise((res, rej) => { const t = d.transaction("kayit", mod); const s = t.objectStore("kayit"); const q = f(s); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  const hepsi = () => islem("readonly", (s) => s.getAll());
  const ekle = (k) => islem("readwrite", (s) => s.put(k));
  const sil = (id) => islem("readwrite", (s) => s.delete(id));
  const sure = (sn) => Math.floor(sn / 60) + ":" + T.pad(Math.round(sn % 60));
  const TUR = ["Şiir", "Kitap tanıtımı", "Okuma metni", "Gözlem", "Sunum"];

  T.tools["ses-kaydedici"] = {
    back: "turkce", grup: "Okuma", grades: [1, 8], title: "Sesli okuma kaydedici", icon: "speaker", ikon3: "speaker", tone: "tomato",
    short: "Kaydet, dinle, iki ay önceki sesinle karşılaştır",
    render(host) {
      const kap = h("div.sk"); host.append(kap);
      const c = T.store.activeClass(); let ogr = "", tur = TUR[0], kayitci = null, parcalar = [], bas = 0, iv = null, akis = null, filtre = "";
      const urller = []; const url = (b) => { const u = URL.createObjectURL(b); urller.push(u); return u; };
      async function ciz() {
        let l = []; try { l = (await hepsi()).filter((x) => x.sinif === c.id).sort((a, b) => b.t - a.t); } catch (e) {}
        const kim = h("select.in", { "aria-label": "Öğrenci", onchange: (e) => { ogr = e.target.value; } }, h("option", { value: "" }, "Sınıf olarak"), c.students.map((x) => h("option", { value: x.id, selected: ogr === x.id ? true : null }, x.name)));
        const turSec = h("select.in", { "aria-label": "Tür", onchange: (e) => (tur = e.target.value) }, TUR.map((x) => h("option", { selected: x === tur ? true : null }, x)));
        const baslik = h("input.in", { placeholder: "Başlık, örneğin Ağaç şiiri", maxlength: 60 });
        const durum = h("div.sk-durum", kayitci ? "Kaydediliyor" : "Hazır");
        const dug = h("button.sk-kayit" + (kayitci ? ".acik" : ""), { "aria-label": kayitci ? "Kaydı bitir" : "Kayda başla", onclick: () => (kayitci ? bitir() : basla(baslik.value)) }, h("i"));
        const ad = (id) => (c.students.find((x) => x.id === id) || {}).name || "Sınıf";
        const gruplar = {}; l.filter((x) => !filtre || x.ogr === filtre).forEach((x) => (gruplar[x.ogr || ""] = gruplar[x.ogr || ""] || []).push(x));
        kap.replaceChildren(
          h("div.sk-kayit-kart", h("div.sk-sol", h("h2", "Yeni kayıt"), h("div.sk-alan", kim, turSec), baslik,
            h("p.hint", { style: { margin: 0 } }, "Kayıtlar yalnızca bu tahtada saklanır, internete gönderilmez.")),
            h("div.sk-sag", dug, durum)),
          h("div.row", { style: { gap: "8px" } }, h("h2", { style: { margin: 0, flex: 1 } }, "Kayıtlarımız"),
            h("select.in", { style: { maxWidth: "240px" }, "aria-label": "Öğrenciye göre", onchange: (e) => { filtre = e.target.value; ciz(); } }, h("option", { value: "" }, "Herkes"), c.students.map((x) => h("option", { value: x.id, selected: filtre === x.id ? true : null }, x.name)))),
          l.length ? h("div.sk-liste", Object.entries(gruplar).map(([id, ks]) => h("section.sk-grup", h("h3", ad(id), h("small", ks.length + " kayıt")),
            ks.length >= 2 ? h("div.sk-kiyas", h("b", "Gelişimi dinle"), h("div.sk-iki", [ks[ks.length - 1], ks[0]].map((k, i) => h("div", h("small", (i ? "En yeni · " : "İlk · ") + new Date(k.t).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })), h("audio", { controls: true, src: url(k.blob), preload: "none" }))))) : null,
            ks.map((k) => h("div.sk-kayit-satir", h("div", h("b", k.baslik || k.tur), h("small", k.tur + " · " + new Date(k.t).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) + " · " + sure(k.sn || 0))),
              h("audio", { controls: true, src: url(k.blob), preload: "none" }),
              h("button.btn.sm.c-chalk", { "aria-label": "Sil", onclick: async () => { if (await T.confirm("Kaydı sil", (k.baslik || k.tur) + " silinsin mi?", "Sil")) { await sil(k.id); ciz(); } } }, T.icon("trash")))))))
            : h("p.hint", "Henüz kayıt yok. Kırmızı düğmeye bas, oku, yeniden bas."));
      }
      async function basla(baslik) {
        if (T.muzik && T.muzik.aktif && T.muzik.aktif()) T.muzik.birak();
        try { akis = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
        catch (e) { return T.toast("Mikrofona izin verilmedi. Tarayıcının adres çubuğundan izin ver."); }
        const tip = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((x) => window.MediaRecorder && MediaRecorder.isTypeSupported(x)) || "";
        kayitci = new MediaRecorder(akis, tip ? { mimeType: tip, audioBitsPerSecond: 48000 } : undefined); parcalar = []; bas = Date.now();
        kayitci.ondataavailable = (e) => e.data.size && parcalar.push(e.data);
        kayitci.onstop = async () => {
          akis.getTracks().forEach((t) => t.stop()); clearInterval(iv);
          const blob = new Blob(parcalar, { type: kayitci.mimeType || "audio/webm" }), sn = (Date.now() - bas) / 1000; kayitci = null;
          if (sn < 1) { T.toast("Kayıt çok kısa"); return ciz(); }
          try { await ekle({ id: T.uid(), sinif: c.id, ogr, tur, baslik: (baslik || "").trim(), t: Date.now(), sn, blob }); T.toast("Kaydedildi"); } catch (e) { T.toast("Kaydedilemedi, cihazda yer kalmamış olabilir"); }
          ciz();
        };
        kayitci.start(1000); await ciz();
        iv = setInterval(() => { const d = kap.querySelector(".sk-durum"); if (d) d.textContent = "Kaydediliyor " + sure((Date.now() - bas) / 1000); if (Date.now() - bas > 10 * 60000) bitir(); }, 500);
      }
      const bitir = () => { if (kayitci && kayitci.state !== "inactive") kayitci.stop(); };
      ciz();
      const gozcu = setInterval(() => { if (!kap.isConnected) { bitir(); urller.forEach((u) => URL.revokeObjectURL(u)); clearInterval(gozcu); } }, 1500);
    },
  };
})();
