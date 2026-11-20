/* Sınıf hafızası: teşekkür panosu ve sınıfın birlikte biriktirdiği panolar */
(function () {
  const { h } = T;
  const cid = () => T.store.get().activeClassId;
  const tool = (id, def) => (T.tools[id] = Object.assign({ back: "kultur", grades: [1, 8] }, def));
  T.KULTUR && T.KULTUR.push(["Sınıf hafızası", []]);
  const grup = () => T.KULTUR && T.KULTUR.find((g) => g[0] === "Sınıf hafızası");
  const ekle = (id) => { const g = grup(); if (g && !g[1].includes(id)) g[1].push(id); };
  T.hafizaEkle = ekle;
  /* yılın kaçıncı haftası: aynı haftanın teşekkürleri bir arada durur */
  const hafta = (d = new Date()) => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const g = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - g); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return t.getUTCFullYear() + "-" + String(Math.ceil(((t - y) / 864e5 + 1) / 7)).padStart(2, "0"); };
  T.haftaNo = hafta;

  /* ---------- Cuma teşekkür panosu ---------- */
  const NEDEN = ["bana yardım etti", "beni güldürdü", "eşyasını paylaştı", "beni dinledi", "beni oyuna aldı", "bana bir şey öğretti", "üzgünken yanımdaydı", "işimi kolaylaştırdı"];
  const RENK = ["#FFE08A", "#BFE3C9", "#FFC9C2", "#C9DDFF", "#E5D2F7", "#FFD7A8"];
  ekle("tesekkur");
  tool("tesekkur", {
    title: "Teşekkür panosu", icon: "heart", ikon3: "parlakkalp", tone: "pink", short: "Haftanın sonunda arkadaşlara kısa teşekkürler",
    render(host) {
      const s0 = T.store.get(); s0.tesekkur = s0.tesekkur || {};
      const c = T.store.activeClass(), st = c.students; let hf = hafta(), ogrGor = false;
      const liste = () => { const s = T.store.get(); s.tesekkur = s.tesekkur || {}; return (s.tesekkur[cid() + ":" + hf] = s.tesekkur[cid() + ":" + hf] || []); };
      const ad = (id) => (st.find((x) => x.id === id) || {}).name || "Bir arkadaşım";
      const kap = h("div.tk"); host.append(kap);
      let kime = null, kimden = "", neden = "";
      function ciz(yeniId) {
        const v = document.querySelector('#view'), y = v ? v.scrollTop : 0, fy = kap.querySelector('.tk-form') ? kap.querySelector('.tk-form').scrollTop : 0;
        const l = liste();
        const pano = h("div.tk-pano", l.length ? l.map((x, i) => { const k = h("div.tk-not", { style: { "--r": ((i * 37) % 9 - 4) + "deg", background: RENK[i % RENK.length] } },
          h("b", ad(x.kime)), h("span", x.neden), h("small", x.kimden ? ad(x.kimden) : "Bir arkadaşın"));
          if (x.id === yeniId) k.animate([{ transform: "translate(-60vw, -30vh) rotate(-30deg) scale(.4)", opacity: 0 }, { transform: "translate(0,0) rotate(var(--r)) scale(1)", opacity: 1 }], { duration: 900, easing: "cubic-bezier(.2,.9,.3,1.1)" });
          return k; }) : [h("p.tk-bos", "Pano boş. Bu hafta kime teşekkür etmek istersin?")]);
        const kimeSec = h("div.tk-adlar", st.map((x) => h("button.tk-ad" + (kime === x.id ? ".on" : ""), { onclick: () => { kime = x.id; ciz(); } }, x.name)));
        const nedenSec = h("div.tk-nedenler", NEDEN.map((n) => h("button.tk-neden" + (neden === n ? ".on" : ""), { onclick: () => { neden = n; ciz(); } }, n)));
        const kendi = h("input.in", { placeholder: "Ya da kendin yaz (kısa)", maxlength: 70, value: NEDEN.includes(neden) ? "" : neden, oninput: (e) => { neden = e.target.value; } });
        const kimdenSec = h("select.in", { "aria-label": "Kimden", onchange: (e) => (kimden = e.target.value) }, h("option", { value: "" }, "Adımı yazma"), st.map((x) => h("option", { value: x.id, selected: kimden === x.id ? true : null }, x.name)));
        const gonder = h("button.btn.c-pink", { disabled: !kime ? true : null, onclick: () => {
          const n = (neden || "").trim(); if (!kime || !n) return T.toast("Kime ve neden teşekkür ettiğini seç");
          const id = T.uid(); T.store.update(() => liste().push({ id, kime, kimden, neden: n, t: Date.now() })); T.sound.ok && T.sound.ok(); kime = null; neden = ""; kimden = ""; ciz(id);
        } }, T.icon("heart"), "Panoya as");
        const alanlar = new Set(l.map((x) => x.kime)), almayan = st.filter((x) => !alanlar.has(x.id));
        kap.replaceChildren(
          h("div.tk-bas", h("h2", "Bu hafta bana yardım eden, işimi kolaylaştıran ya da beni güldüren arkadaşım"),
            h("div.row", { style: { gap: "6px" } }, h("span.hint", l.length + " teşekkür"),
              h("button.btn.sm.c-chalk", { onclick: () => { const d = new Date(); d.setDate(d.getDate() - 7 * (hf === hafta() ? 1 : 0)); hf = hf === hafta() ? hafta(d) : hafta(); ciz(); } }, hf === hafta() ? "Geçen hafta" : "Bu haftaya dön"),
              h("button.btn.sm.c-chalk", { onclick: () => { ogrGor = !ogrGor; ciz(); }, title: "Yalnızca öğretmen için" }, T.icon("eye"), ogrGor ? "Gizle" : "Öğretmen notu"))),
          ogrGor ? h("p.tk-ogr", almayan.length ? "Bu hafta teşekkür almayanlar: " + almayan.map((x) => x.name).join(", ") + ". Bu çocuklar için sınıfla küçük bir fırsat yaratabilirsin." : "Bu hafta herkes en az bir teşekkür aldı.") : null,
          h("div.tk-ana", pano,
            hf === hafta() ? h("div.tk-form", h("b", "Kime?"), kimeSec, h("b", "Neden?"), nedenSec, kendi, h("b", "Kimden?"), kimdenSec, gonder) : null));
        if (v) v.scrollTop = y; const f = kap.querySelector(".tk-form"); if (f) f.scrollTop = fy;
      }
      ciz();
    },
  });
})();

/* ---------- Bugün sınıfta ne oldu? kartpostalı ---------- */
(function () {
  const { h } = T;
  const ciz = (cv, o, cumle, tema) => {
    const W = 1600, H = 1000, x = cv.getContext("2d"); cv.width = W; cv.height = H;
    const TEMA = { gunes: ["#FFF4D6", "#F2B33D", "#1B2A4A"], deniz: ["#E3F2FB", "#3B83C4", "#14304d"], cayir: ["#EAF6E4", "#4C9A4A", "#1f3a24"], gul: ["#FCEAF1", "#D9628E", "#4a1f33"] }[tema];
    x.fillStyle = TEMA[0]; x.fillRect(0, 0, W, H);
    /* kenar çerçevesi ve pul */
    x.strokeStyle = TEMA[1]; x.lineWidth = 14; x.setLineDash([36, 18]); x.strokeRect(40, 40, W - 80, H - 80); x.setLineDash([]);
    x.save(); x.translate(W - 230, 90); x.rotate(0.06); x.fillStyle = "#fff"; x.fillRect(0, 0, 150, 180); x.strokeStyle = TEMA[1]; x.lineWidth = 6; x.setLineDash([10, 8]); x.strokeRect(10, 10, 130, 160); x.setLineDash([]);
    x.fillStyle = TEMA[1]; x.font = "800 64px Inter, sans-serif"; x.textAlign = "center"; x.fillText(o.gun ? String(o.gun) : "★", 75, 105); x.font = "700 20px Inter, sans-serif"; x.fillText(o.gun ? ". gün" : "", 75, 140); x.restore();
    x.textAlign = "left"; x.fillStyle = TEMA[2];
    x.font = "700 34px Inter, sans-serif"; x.fillText(o.tarih + " · " + o.sinif, 110, 140);
    x.font = "800 82px Inter, sans-serif"; x.fillText("Bugün sınıfta ne oldu?", 110, 240);
    const sar = (metin, mx, my, gen, sat, font) => { x.font = font; const k = metin.split(/\s+/); let l = "", yy = my, n = 0; for (const w of k) { const t = l ? l + " " + w : w; if (x.measureText(t).width > gen && l) { x.fillText(l, mx, yy); l = w; yy += sat; n++; if (n > 3) return yy; } else l = t; } if (l) x.fillText(l, mx, yy); return yy + sat; };
    let y = 330;
    if (cumle) { x.fillStyle = TEMA[1]; x.fillRect(110, y - 46, 10, 120); x.fillStyle = TEMA[2]; y = sar(cumle, 145, y, 1260, 62, "700 48px Inter, sans-serif") + 20; }
    const kutu = (bx, by, bw, baslik, deger) => { x.fillStyle = "#fff"; x.beginPath(); x.roundRect(bx, by, bw, 170, 26); x.fill(); x.fillStyle = TEMA[1]; x.font = "800 26px Inter, sans-serif"; x.fillText(baslik, bx + 28, by + 50); x.fillStyle = TEMA[2]; sar(String(deger), bx + 28, by + 108, bw - 56, 44, "800 40px Inter, sans-serif"); };
    const ky = Math.max(y + 10, 560), kb = (W - 220 - 40) / 3;
    kutu(110, ky, kb, "Günün sayısı", o.sayi);
    kutu(110 + kb + 20, ky, kb, o.hava ? "Hava" : "Gün", o.hava || new Date().toLocaleDateString("tr-TR", { weekday: "long" }));
    kutu(110 + 2 * (kb + 20), ky, kb, "Sınıfımız", o.ogrenci + " öğrenci");
    x.fillStyle = TEMA[2]; x.font = "800 26px Inter, sans-serif"; x.fillStyle = TEMA[1]; x.fillText("Günün sorusu", 110, ky + 230);
    x.fillStyle = TEMA[2]; sar(o.soru || "", 110, ky + 280, 1380, 46, "700 38px Inter, sans-serif");
    x.fillStyle = "rgba(0,0,0,.35)"; x.font = "600 22px Inter, sans-serif"; x.textAlign = "right"; x.fillText("Tahta Atölyesi", W - 70, H - 64);
  };
  T.kartpostal = function () {
    const o = T.gununOzeti(); let tema = "gunes";
    const cv = h("canvas.kpo-cv");
    const inp = h("input.in", { maxlength: 120, placeholder: "Tek cümleyle bugün: Bugün kesirleri pizzayla keşfettik.", value: o.not.split("\n")[0].slice(0, 120) });
    const yenile = () => ciz(cv, o, inp.value.trim(), tema);
    inp.addEventListener("input", yenile);
    const temalar = h("div.seg", [["gunes", "Güneş"], ["deniz", "Deniz"], ["cayir", "Çayır"], ["gul", "Gül"]].map(([k, l]) => h("button", { "aria-pressed": String(k === tema), onclick: (e) => { tema = k; [...temalar.children].forEach((b) => b.setAttribute("aria-pressed", String(b === e.currentTarget))); yenile(); } }, l)));
    T.modal({ title: "Bugün sınıfta ne oldu?", wide: true,
      body: h("div.kpo", h("p.hint", { style: { margin: 0 } }, "Ana sayfadaki bilgilerden hazırlanır. Öğrenci adı yer almaz; panoya asabilir ya da velilerle paylaşabilirsin."), inp, temalar, cv),
      actions: [{ label: "Resim olarak indir", tone: "c-leaf", onClick: () => { cv.toBlob((b) => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "sinifta-bugun-" + T.isoDate() + ".png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); T.toast("Kartpostal indirildi"); }); return false; } }, { label: "Kapat" }] });
    document.fonts && document.fonts.ready.then(yenile); yenile();
  };
  T.hafizaEkle && T.hafizaEkle("kartpostal");
  T.tools.kartpostal = { back: "kultur", grades: [1, 8], title: "Bugün sınıfta ne oldu?", icon: "frame", ikon3: "frame", tone: "sun", short: "Günün özeti tek kartpostalda", render(host) { host.append(h("div.paper", { style: { padding: "24px", display: "grid", gap: "12px", justifyItems: "start" } }, h("p", "Günün sayısı, havası, sorusu ve senin tek cümlenle bir kartpostal hazırlanır."), h("button.btn.c-leaf", { onclick: () => T.kartpostal() }, T.icon("frame"), "Kartpostalı hazırla"))); T.kartpostal(); } };
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Bugün sınıfta ne oldu? kartpostalı", ic: "frame", ac: () => T.kartpostal(), ek: "Günün özeti PNG" });
})();
