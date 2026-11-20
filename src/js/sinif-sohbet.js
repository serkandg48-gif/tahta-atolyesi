/* Sohbet ve düşünme araçları: Söz ağı (canlı tartışma haritası) */
(function () {
  const { h } = T; const W = T.widgets; const NS = "http://www.w3.org/2000/svg";
  const gelenler = (cls) => { const s = T.store.get(), a = (s.attendance[cls.id] || {})[T.isoDate()] || {}; return cls.students.filter((st) => a[st.id] !== "yok"); };
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };

  /* ---------- Söz ağı: konuşan öğrenciye dokundukça bir öncekinden ona çizgi uzanır ---------- */
  W.sozagi = {
    title: "Söz ağı", icon: "talk", tone: "grape", w: 640, h: 560, desc: "Tartışmada sözün sınıfa nasıl yayıldığını gösterir",
    init: () => ({ sira: [], ozet: false }),
    render(body, w, api) {
      const d = w.data; d.sira = d.sira || [];
      body.style.gridTemplateRows = "1fr auto"; body.style.gap = "8px";
      const svg = el("svg", { viewBox: "0 0 600 470", class: "sa-svg", role: "img", "aria-label": "Söz ağı" });
      const bilgi = h("div.sa-bilgi");
      const ozetKutu = h("div.sa-ozet");
      body.append(h("div.sa-kap", svg, ozetKutu), h("div.row", { style: { gap: "6px", justifyContent: "center" } }, bilgi,
        h("button.btn.sm.c-chalk", { onclick: () => { d.sira.pop(); api.save(); ciz(); } }, T.icon("undo"), "Geri al"),
        h("button.btn.sm.c-grape", { onclick: () => { d.ozet = !d.ozet; api.save(); ciz(); } }, T.icon("chart"), "Sohbeti incele"),
        h("button.btn.sm.c-chalk", { onclick: async () => { if (d.sira.length && !(await T.confirm("Yeni sohbet", "Söz ağı temizlensin mi?", "Temizle"))) return; d.sira = []; d.ozet = false; api.save(); ciz(); } }, T.icon("reset"), "Yeni sohbet")));
      function ciz() {
        const st = gelenler(api.cls()); const n = st.length;
        const yer = { ogr: [300, 235] };
        st.forEach((s, i) => { const a = -Math.PI / 2 + (i / Math.max(1, n)) * Math.PI * 2; yer[s.id] = [300 + Math.cos(a) * 250, 235 + Math.sin(a) * 195]; });
        const say = {}; d.sira.forEach((x) => (say[x] = (say[x] || 0) + 1));
        const cift = {}; for (let i = 1; i < d.sira.length; i++) { const a = d.sira[i - 1], b = d.sira[i]; if (a === b) continue; const k = [a, b].sort().join("|"); cift[k] = (cift[k] || 0) + 1; }
        svg.replaceChildren();
        const tek = d.sira.length ? d.sira[d.sira.length - 1] : null;
        Object.entries(cift).forEach(([k, c]) => { const [a, b] = k.split("|"); if (!yer[a] || !yer[b]) return;
          svg.append(el("line", { x1: yer[a][0], y1: yer[a][1], x2: yer[b][0], y2: yer[b][1], class: "sa-cizgi" + (a === "ogr" || b === "ogr" ? " ogr" : ""), "stroke-width": Math.min(14, 2 + c * 2) })); });
        if (d.sira.length > 1) { const a = d.sira[d.sira.length - 2], b = tek; if (a !== b && yer[a] && yer[b]) svg.append(el("line", { x1: yer[a][0], y1: yer[a][1], x2: yer[b][0], y2: yer[b][1], class: "sa-son" })); }
        const dugum = (id, ad, kisa) => { const [x, y] = yer[id]; const c = say[id] || 0, r = 21 + Math.min(14, c * 2.5);
          const g = el("g", { class: "sa-dugum" + (c ? " konustu" : "") + (id === tek ? " simdi" : "") + (id === "ogr" ? " ogretmen" : ""), tabindex: "0", role: "button", "aria-label": ad });
          g.append(el("circle", { cx: x, cy: y, r }));
          const t = el("text", { x, y: y + 5, "text-anchor": "middle" }); t.textContent = kisa; g.append(t);
          if (c) { const b = el("text", { x: x + r - 4, y: y - r + 8, class: "sa-sayi", "text-anchor": "middle" }); b.textContent = c; g.append(b); }
          const sec = () => { d.sira.push(id); api.save(); T.sound.pop && T.sound.pop(); ciz(); };
          g.addEventListener("click", sec); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
          svg.append(g); };
        dugum("ogr", "Öğretmen", "Öğrt.");
        st.forEach((s) => dugum(s.id, s.name, s.name.split(" ")[0].slice(0, 7)));
        const konusan = st.filter((s) => say[s.id]).length;
        bilgi.textContent = d.sira.length ? konusan + " / " + n + " öğrenci söz aldı" : "Konuşana dokun";
        ozetKutu.hidden = !d.ozet;
        if (d.ozet) {
          const sessiz = st.filter((s) => !say[s.id]);
          const ogrSay = say.ogr || 0, ogrSiz = d.sira.length - ogrSay;
          const ard = (() => { let m = 0, c = 0; d.sira.forEach((x) => { if (x === "ogr") c = 0; else { c++; m = Math.max(m, c); } }); return m; })();
          const enCok = st.filter((s) => say[s.id]).sort((a, b) => say[b.id] - say[a.id]).slice(0, 3);
          ozetKutu.replaceChildren(h("h3", "Sohbetimiz nasıl geçti?"),
            h("p", d.sira.length + " kez söz alındı. " + ogrSay + " kez öğretmen, " + ogrSiz + " kez öğrenciler konuştu."),
            h("p", ard >= 3 ? "Öğretmene dönmeden en uzun " + ard + " öğrenci art arda konuştu. Söz öğrenciler arasında dolaştı." : "Söz çoğunlukla öğretmen üzerinden geçti. Bir dahaki sefere öğrencilerin birbirine yanıt vermesini deneyebiliriz."),
            enCok.length ? h("p", "En çok söz alanlar: " + enCok.map((s) => s.name + " (" + say[s.id] + ")").join(", ")) : null,
            sessiz.length ? h("p", "Henüz söz almayanlar: " + sessiz.map((s) => s.name).join(", ")) : h("p", "Herkes en az bir kez söz aldı."),
            h("button.btn.sm.c-chalk", { onclick: () => { d.ozet = false; api.save(); ciz(); } }, "Ağa dön"));
        }
      }
      ciz();
    },
  };
})();
