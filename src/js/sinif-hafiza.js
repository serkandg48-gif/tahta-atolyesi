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
