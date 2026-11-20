/* Evden tahtaya taşı: üyelik olmadan hazırlığı sıkıştırılmış bir bağlantıya ya da QR koda koyar.
   Bağlantı sunucuya gitmez; her şey adresin # kısmında durur. Tahtada açılınca hazırlık içe alınır. */
(function () {
  const { h } = T;
  const b64 = (u8) => { let s = ""; u8.forEach((c) => (s += String.fromCharCode(c))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64 = (s) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };
  const akis = async (veri, tur) => { const st = new Blob([veri]).stream().pipeThrough(tur); return new Uint8Array(await new Response(st).arrayBuffer()); };
  const paketle = async (o) => { const ham = new TextEncoder().encode(JSON.stringify(o)); return window.CompressionStream ? "z" + b64(await akis(ham, new CompressionStream("deflate-raw"))) : b64(ham); };
  const coz = async (s) => { const sik = s[0] === "z"; const u8 = unb64(sik ? s.slice(1) : s); const ham = sik && window.DecompressionStream ? await akis(u8, new DecompressionStream("deflate-raw")) : u8; return JSON.parse(new TextDecoder().decode(ham)); };
  T.tasiPaketle = paketle; T.tasiCoz = coz;

  T.tasiPenceresi = function () {
    const s = T.store.get(), cid = s.activeClassId, k = s.kokpit || {};
    const planlar = (s.plans || []).slice(0, 12);
    const sec = new Set(planlar.slice(0, 1).map((p) => p.id));
    const not = h("textarea.in", { rows: 3, placeholder: "Sabah tahtada görmek istediğin not ya da yönerge" }); not.value = ((k.not || {})[cid] || "").slice(0, 600);
    const soru = h("input.in", { placeholder: "Günün sorusu (isteğe bağlı)", value: (k.ozelKivilcim || {})[cid] || "" });
    const bilet = h("input.in", { placeholder: "Çıkış bileti sorusu (isteğe bağlı)" });
    const sonuc = h("div.ts-sonuc");
    const govde = h("div.ts",
      h("p.hint", { style: { margin: 0 } }, "Evde hazırladığını sabah tahtaya taşı. Hesap gerekmez: bilgiler bağlantının içinde durur, sunucuya gönderilmez. Öğrenci adları bağlantıya eklenmez."),
      planlar.length ? h("div", h("b", "Planlar"), h("div.ts-planlar", planlar.map((p) => h("label.ts-plan", h("input", { type: "checkbox", checked: sec.has(p.id) ? true : null, onchange: (e) => (e.target.checked ? sec.add(p.id) : sec.delete(p.id)) }), h("span", p.baslik || p.title || "Plan", h("small", (p.ders || "") + (p.at ? " · " + new Date(p.at).toLocaleDateString("tr-TR") : "")))))))
        : h("p.hint", "Kaydedilmiş planın yok. Plan bölümünde hazırlayıp kaydedebilirsin."),
      h("b", "Not"), not, h("b", "Günün sorusu"), soru, h("b", "Çıkış bileti"), bilet, sonuc);
    const uret = async () => {
      const o = { v: 1, plan: (s.plans || []).filter((p) => sec.has(p.id)).map((p) => { const c = Object.assign({}, p); delete c.id; return c; }), not: not.value.trim(), soru: soru.value.trim(), bilet: bilet.value.trim() };
      if (!o.plan.length && !o.not && !o.soru && !o.bilet) { T.toast("Taşınacak bir şey seç ya da yaz"); return; }
      const p = await paketle(o), url = location.origin + location.pathname + "#tasi=" + p;
      const qr = h("div.ts-qr");
      sonuc.replaceChildren(h("b", "Bağlantın hazır"), h("div.row", { style: { gap: "6px" } }, h("input.in", { value: url, readonly: true, onclick: (e) => e.target.select(), style: { flex: 1 } }),
        h("button.btn.sm.c-sky", { onclick: () => { navigator.clipboard && navigator.clipboard.writeText(url).then(() => T.toast("Bağlantı kopyalandı"), () => T.toast("Kopyalanamadı, elle seç")); } }, "Kopyala")),
        h("p.hint", { style: { margin: 0 } }, "Kendine e-postayla gönder ya da tahtanın kamerasıyla QR kodu okut. " + (url.length > 2300 ? "Bağlantı QR için uzun; kopyalayıp gönder." : "")), qr);
      if (url.length <= 2300 && window.QRCode) { try { new window.QRCode(qr, { text: url, width: 240, height: 240, correctLevel: window.QRCode.CorrectLevel.L }); } catch (e) {} }
    };
    T.modal({ title: "Evden tahtaya taşı", wide: true, body: govde, actions: [{ label: "Bağlantı oluştur", tone: "c-leaf", onClick: () => { uret(); return false; } }, { label: "Kapat" }] });
  };

  /* Tahtada açılış: #tasi= ile gelindiyse önce sor, sonra içe al */
  async function gelen(p) {
    let o; try { o = await coz(p); } catch (e) { T.toast("Bağlantı okunamadı"); return; }
    const parca = [o.plan && o.plan.length ? o.plan.length + " plan" : null, o.not ? "not" : null, o.soru ? "günün sorusu" : null, o.bilet ? "çıkış bileti" : null].filter(Boolean);
    T.modal({ title: "Evden gelen hazırlık", body: h("div", { style: { display: "grid", gap: "8px" } }, h("p", { style: { margin: 0 } }, "Bu bağlantıda " + parca.join(", ") + " var. " + T.store.activeClass().name + " sınıfına alınsın mı?"),
        o.not ? h("p.hint", { style: { margin: 0, whiteSpace: "pre-wrap" } }, "Not: " + o.not.slice(0, 200)) : null),
      actions: [{ label: "Vazgeç" }, { label: "İçe al", tone: "c-leaf", onClick: () => {
        T.store.update((s) => {
          const cid = s.activeClassId; s.kokpit = s.kokpit || {};
          (o.plan || []).forEach((p) => s.plans.unshift(Object.assign({}, p, { id: T.uid(), at: Date.now() })));
          if (o.not) { s.kokpit.not = s.kokpit.not || {}; s.kokpit.not[cid] = o.not; }
          if (o.soru) { s.kokpit.ozelKivilcim = s.kokpit.ozelKivilcim || {}; s.kokpit.ozelKivilcim[cid] = o.soru; s.kokpit.kivilcimI = -1; }
          if (o.bilet) s.tasiBilet = o.bilet;
        });
        T.toast("Hazırlık içe alındı"); T.go(o.plan && o.plan.length ? "plan" : "ana");
        if (o.bilet) setTimeout(() => { const t = T.board && T.board.aktif && T.board.aktif() ? T.board : T.yuzen; t && t.add("ticket", { data: { q: o.bilet, c: [0, 0, 0] } }); }, 600);
      } }] });
  }
  if (location.hash.startsWith("#tasi=")) { const p = location.hash.slice(6); history.replaceState(null, "", location.pathname + "#ana"); addEventListener("load", () => setTimeout(() => gelen(p), 900)); }
  addEventListener("hashchange", () => { if (location.hash.startsWith("#tasi=")) { const p = location.hash.slice(6); history.replaceState(null, "", location.pathname + "#ana"); T.route && T.route(); gelen(p); } });
  /* Zümre içi paylaşım: ölçek, plan, soru listesi ya da sahne bir bağlantıya dönüşür; açan öğretmen kendi sitesine alır */
  const TURAD = { olcek: "Ölçek", plan: "Plan", sorular: "Soru listesi", sahne: "Ekran sahnesi" };
  T.sablonPaylas = async function (tur, nesne, ad) {
    const p = await paketle({ v: 1, sablon: tur, ad: ad || "", veri: nesne }), url = location.origin + location.pathname + "#al=" + p;
    const qr = h("div.ts-qr");
    T.modal({ title: TURAD[tur] + " paylaş", body: h("div.ts", h("p.hint", { style: { margin: 0 } }, "Bu bağlantıyı açan öğretmen " + (ad ? "\"" + ad + "\" " : "") + TURAD[tur].toLocaleLowerCase("tr") + " şablonunu kendi sitesine alır. Öğrenci adı ve puanlar bağlantıda yer almaz."),
      h("div.row", { style: { gap: "6px" } }, h("input.in", { value: url, readonly: true, onclick: (e) => e.target.select(), style: { flex: 1 } }), h("button.btn.sm.c-sky", { onclick: () => navigator.clipboard && navigator.clipboard.writeText(url).then(() => T.toast("Bağlantı kopyalandı")) }, "Kopyala")),
      h("button.btn.sm.c-chalk", { style: { justifySelf: "start" }, onclick: () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify({ sablon: tur, ad, veri: nesne }, null, 1)], { type: "application/json" })); a.download = (ad || tur).replace(/[^\wçğıöşüÇĞİÖŞÜ -]/g, "").slice(0, 40) + ".tahta.json"; a.click(); } }, T.icon("download"), "Dosya olarak indir"), qr), actions: [{ label: "Kapat" }] });
    if (url.length <= 2300 && window.QRCode) { try { new window.QRCode(qr, { text: url, width: 220, height: 220, correctLevel: window.QRCode.CorrectLevel.L }); } catch (e) {} }
  };
  function sablonAl(o) {
    const v = o.veri || {};
    T.modal({ title: "Paylaşılan " + (TURAD[o.sablon] || "şablon").toLocaleLowerCase("tr"), body: h("p", { style: { margin: 0 } }, (o.ad ? "\"" + o.ad + "\" " : "") + "sitene eklensin mi?"),
      actions: [{ label: "Vazgeç" }, { label: "Ekle", tone: "c-leaf", onClick: () => {
        T.store.update((s) => {
          const cid = s.activeClassId;
          if (o.sablon === "plan") s.plans.unshift(Object.assign({}, v, { id: T.uid(), at: Date.now() }));
          else if (o.sablon === "olcek") { s.olcmeArac = s.olcmeArac || {}; const c = (s.olcmeArac[cid] = s.olcmeArac[cid] || { olcekler: [] }); c.olcekler = c.olcekler || []; c.olcekler.unshift({ id: "o" + Date.now().toString(36), tur: v.tur || "olcek", ad: v.ad || "Paylaşılan ölçek", ders: v.ders || "", kriter: (v.kriter || []).slice(0, 20), puan: {}, tarih: T.isoDate() }); }
          else if (o.sablon === "sorular") { s.kokpit = s.kokpit || {}; s.kokpit.ozelKivilcim = s.kokpit.ozelKivilcim || {}; s.kokpit.ozelKivilcim[cid] = (v.sorular || [])[0] || ""; s.kokpit.kivilcimI = -1; }
        });
        if (o.sablon === "sahne") { try { const l = JSON.parse(localStorage.getItem("ta-sahneler") || "[]"); l.unshift({ ad: o.ad || "Paylaşılan sahne", bg: v.bg, list: v.list || [] }); localStorage.setItem("ta-sahneler", JSON.stringify(l.slice(0, 24))); } catch (e) {} }
        T.toast("Eklendi"); T.go(o.sablon === "plan" ? "plan" : o.sablon === "olcek" ? "olcme" : o.sablon === "sahne" ? "ekran" : "ana");
      } }] });
  }
  const alKontrol = async () => { if (!location.hash.startsWith("#al=")) return; const p = location.hash.slice(4); history.replaceState(null, "", location.pathname + "#ana"); try { sablonAl(await coz(p)); } catch (e) { T.toast("Paylaşım bağlantısı okunamadı"); } };
  if (location.hash.startsWith("#al=")) addEventListener("load", () => setTimeout(alKontrol, 900));
  addEventListener("hashchange", alKontrol);
  T.sablonDosyaAl = (f) => f.text().then((t) => sablonAl(JSON.parse(t))).catch(() => T.toast("Dosya okunamadı"));

  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Paylaşılan şablon dosyasını aç", ic: "download", ac: () => { const i = h("input", { type: "file", accept: ".json,application/json", onchange: (e) => e.target.files[0] && T.sablonDosyaAl(e.target.files[0]) }); i.click(); }, ek: ".tahta.json" }, { ad: "Evden tahtaya taşı", ic: "qr", ac: () => T.tasiPenceresi(), ek: "Plan, not ve soruyu bağlantıyla taşı" });
})();
