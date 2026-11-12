/* Fen Bilimleri ve Hayat Bilgisi araçları: sınıflandırma ve sıralama oyunları, maddenin hâlleri, ışık ve gölge,
   karışımları ayıralım, hava takvimi, güvenli yaya. Temalar Maarif programlarındaki ünite adlarına göre gruplanmıştır. */
(function () {
  const { h } = T; const S = T.svg;
  const tool = (sec, id, def) => (T.tools[id] = Object.assign({ back: sec }, def));
  const seg = (opts, cur, on) => h("div.seg", opts.map(([v, l]) => h("button", { "aria-pressed": String(v === cur), onclick: () => on(v) }, l)));

  /* =================== Sınıflandırma motoru =================== */
  function siniflandir(host, def) {
    let kalan, yerlesen, sec = null, yanlis = null;
    const box = h("div"); host.append(box);
    const yeni = () => { kalan = T.shuffle(def.ogeler.slice()).slice(0, def.adet || 12); yerlesen = {}; def.kutular.forEach((k) => (yerlesen[k[0]] = [])); sec = null; ciz(); };
    function ciz() {
      const bitti = !kalan.length;
      box.replaceChildren(
        def.ust ? h("p.sb-line", def.ust) : null,
        h("div.sn-havuz", bitti ? h("div.sn-bitti", T.icon("check"), "Hepsi yerleşti!", h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeniden")) : kalan.map((o) => h("button.sn-oge" + (sec === o ? ".on" : "") + (yanlis === o ? ".no" : ""), { onclick: () => { sec = o; T.speak(o[0]); ciz(); } }, o[0]))),
        h("div.sn-kutular", { style: { "--n": def.kutular.length } }, def.kutular.map(([k, ad, renk, alt]) => h("button.sn-kutu", { style: { "--c": renk }, onclick: () => {
          if (!sec) { T.toast("Önce yukarıdan bir kart seç"); return; }
          if (sec[1] === k) { yerlesen[k].push(sec); kalan = kalan.filter((x) => x !== sec); T.sound.ok(); sec = null; }
          else { yanlis = sec; T.sound.no(); const n = def.ipucu ? def.ipucu(sec) : null; if (n) T.toast(n, 3200); setTimeout(() => { yanlis = null; ciz(); }, 700); }
          ciz();
        } }, h("div.sn-baslik", h("b", ad), alt ? h("small", alt) : null), h("div.sn-icerik", yerlesen[k].map((o) => h("span.sn-yer", o[0])))))),
        def.alt ? h("p.hint", def.alt) : null);
    }
    yeni();
  }
  const sinifTool = (sec, id, title, short, grades, grup, def) => tool(sec, id, { title, short, grades, grup, icon: def.icon || "blocks", tone: def.tone || "leaf", render(host) { siniflandir(host, def); } });

  sinifTool("fen", "canli-cansiz", "Canlı mı, cansız mı?", "Kartları doğru kutuya yerleştir", [3, 4], "Canlılar dünyası", {
    icon: "fen", ust: "Canlılar beslenir, büyür, çoğalır ve hareket eder. Kartı seç, kutusuna dokun.",
    kutular: [["c", "Canlı", "#2E8B57"], ["n", "Cansız", "#8E9BB4"]],
    ogeler: [["kedi", "c"], ["ağaç", "c"], ["taş", "n"], ["mantar", "c"], ["su", "n"], ["bulut", "n"], ["kuş", "c"], ["çiçek", "c"], ["masa", "n"], ["balık", "c"], ["kum", "n"], ["solucan", "c"], ["çimen", "c"], ["kalem", "n"], ["arı", "c"], ["oyuncak araba", "n"]],
    ipucu: (o) => o[0] === "oyuncak araba" ? "Hareket ediyor ama büyüyor mu, besleniyor mu?" : o[0] === "mantar" ? "Mantar da beslenir, büyür ve çoğalır." : null,
  });
  sinifTool("fen", "duyu-organlari", "Hangi duyu organı?", "Durumu doğru duyu organıyla eşleştir", [3, 4], "Canlılar dünyası", {
    icon: "eye", kutular: [["g", "Göz", "#3C8DD8", "görme"], ["k", "Kulak", "#7A5BC7", "işitme"], ["b", "Burun", "#E9A23B", "koklama"], ["d", "Dil", "#C2453A", "tatma"], ["r", "Deri", "#2E8B57", "dokunma"]],
    ogeler: [["gökkuşağının renkleri", "g"], ["kuş cıvıltısı", "k"], ["çiçeğin kokusu", "b"], ["limonun ekşiliği", "d"], ["kedinin yumuşak tüyü", "r"], ["sobanın sıcaklığı", "r"], ["zil sesi", "k"], ["taze ekmek kokusu", "b"], ["çikolatanın tadı", "d"], ["trafik ışığının rengi", "g"], ["buzun soğukluğu", "r"], ["yağmurun sesi", "k"]],
  });
  sinifTool("fen", "yasam-alani", "Nerede yaşar?", "Canlıyı yaşam alanıyla eşleştir", [3, 4], "Canlıların yaşam alanları", {
    icon: "leaf", kutular: [["s", "Deniz", "#3C8DD8"], ["o", "Orman", "#2E8B57"], ["c", "Çöl", "#E0B020"], ["k", "Kutup", "#9DB7D6"]],
    ogeler: [["balık", "s"], ["yunus", "s"], ["ahtapot", "s"], ["sincap", "o"], ["ayı", "o"], ["baykuş", "o"], ["geyik", "o"], ["deve", "c"], ["akrep", "c"], ["penguen", "k"], ["kutup ayısı", "k"]],
    alt: "Bazı canlılar birden fazla yerde yaşayabilir. Farklı düşünen olursa nedenini konuşun.",
  });
  sinifTool("fen", "madde-hal", "Katı mı, sıvı mı, gaz mı?", "Maddeleri hâllerine göre ayır", [3, 4], "Madde", {
    icon: "blocks", kutular: [["k", "Katı", "#7A5BC7", "belirli şekli var"], ["s", "Sıvı", "#3C8DD8", "bulunduğu kabın şeklini alır"], ["g", "Gaz", "#8E9BB4", "bulunduğu yeri doldurur"]],
    ogeler: [["taş", "k"], ["süt", "s"], ["su buharı", "g"], ["buz", "k"], ["meyve suyu", "s"], ["balondaki hava", "g"], ["kalem", "k"], ["zeytinyağı", "s"], ["bal", "s"], ["gazozdaki kabarcıklar", "g"], ["tahta kaşık", "k"], ["sirke", "s"]],
  });
  sinifTool("fen", "miknatis", "Mıknatıs çeker mi?", "Mıknatısın çektiği ve çekmediği cisimler", [3, 4], "Mıknatıs", {
    icon: "magnet", kutular: [["e", "Çeker", "#C2453A"], ["h", "Çekmez", "#8E9BB4"]],
    ogeler: [["demir çivi", "e"], ["ataş", "e"], ["toplu iğne", "e"], ["demir vida", "e"], ["çelik makas", "e"], ["plastik cetvel", "h"], ["tahta kalem", "h"], ["cam bilye", "h"], ["alüminyum folyo", "h"], ["bakır tel", "h"], ["kâğıt", "h"], ["silgi", "h"]],
    ipucu: (o) => o[0] === "alüminyum folyo" || o[0] === "bakır tel" ? "Her metali mıknatıs çekmez. Alüminyum ve bakırı dene!" : null,
    alt: "Tahmin ettikten sonra sınıftaki gerçek mıknatısla deneyin. Deney sonucu tahminimizden önemlidir.",
  });
  sinifTool("fen", "isik-kaynagi", "Işık kaynağı mı?", "Doğal, yapay ya da ışık kaynağı değil", [4, 4], "Işık", {
    icon: "sun", kutular: [["d", "Doğal ışık kaynağı", "#E9A23B"], ["y", "Yapay ışık kaynağı", "#3C8DD8"], ["n", "Işık kaynağı değil", "#8E9BB4"]],
    ogeler: [["Güneş", "d"], ["yıldızlar", "d"], ["ateş böceği", "d"], ["şimşek", "d"], ["el feneri", "y"], ["mum", "y"], ["lamba", "y"], ["televizyon ekranı", "y"], ["Ay", "n"], ["ayna", "n"], ["pencere camı", "n"]],
    ipucu: (o) => o[0] === "Ay" ? "Ay kendi ışığını üretmez; Güneş'ten aldığı ışığı yansıtır." : o[0] === "ayna" ? "Ayna ışığı yansıtır ama üretmez." : null,
  });
  sinifTool("fen", "enerji-kaynagi", "Yenilenebilir mi?", "Enerji kaynaklarını ayır", [4, 4], "Elektrik ve enerji", {
    icon: "bolt", kutular: [["y", "Yenilenebilir", "#2E8B57", "tükenmez"], ["t", "Yenilenemez", "#6B4E3D", "bir gün tükenir"]],
    ogeler: [["güneş", "y"], ["rüzgâr", "y"], ["akarsu", "y"], ["jeotermal", "y"], ["dalga", "y"], ["kömür", "t"], ["petrol", "t"], ["doğal gaz", "t"]],
  });
  sinifTool("fen", "geri-donusum", "Sıfır atık kutuları", "Atığı doğru renkli kutuya at", [1, 4], "Sürdürülebilir yaşam", {
    icon: "turn", kutular: [["k", "Kâğıt", "#3C7DD8", "mavi"], ["p", "Plastik", "#E0B020", "sarı"], ["c", "Cam", "#2E8B57", "yeşil"], ["m", "Metal", "#8E9BB4", "gri"], ["o", "Organik", "#8A6A3B", "kahverengi"]],
    ogeler: [["gazete", "k"], ["karton kutu", "k"], ["defter yaprağı", "k"], ["pet şişe", "p"], ["yoğurt kabı", "p"], ["reçel kavanozu", "c"], ["cam şişe", "c"], ["konserve kutusu", "m"], ["içecek kutusu", "m"], ["elma kabuğu", "o"], ["muz kabuğu", "o"], ["çay posası", "o"]],
  });
  sinifTool("sosyal", "besin-gruplari", "Besin grupları", "Besinleri gruplarına yerleştir, dengeli tabak kur", [1, 4], "Sağlığım ve güvenliğim", {
    icon: "leaf", kutular: [["s", "Sebze ve meyve", "#2E8B57"], ["t", "Tahıllar", "#E0B020"], ["e", "Et, yumurta, baklagil", "#C2453A"], ["u", "Süt ve süt ürünleri", "#3C8DD8"]],
    ogeler: [["elma", "s"], ["havuç", "s"], ["ıspanak", "s"], ["portakal", "s"], ["ekmek", "t"], ["pirinç", "t"], ["bulgur", "t"], ["makarna", "t"], ["yumurta", "e"], ["tavuk", "e"], ["mercimek", "e"], ["nohut", "e"], ["süt", "u"], ["yoğurt", "u"], ["peynir", "u"], ["ayran", "u"]],
    alt: "Dengeli bir öğünde her gruptan bir besin bulunur. Kendi kahvaltı tabağınızı bu dört gruba göre konuşun.",
  });
  sinifTool("sosyal", "mevsimler", "Hangi mevsim?", "Olayları mevsimlerle eşleştir", [1, 3], "Doğa ve çevre", {
    icon: "sun", kutular: [["i", "İlkbahar", "#6DAF5A"], ["y", "Yaz", "#E9A23B"], ["s", "Sonbahar", "#B86B2E"], ["k", "Kış", "#5B9BD5"]],
    ogeler: [["ağaçlar çiçek açar", "i"], ["kırlangıçlar geri döner", "i"], ["denize gireriz", "y"], ["karpuz ve kiraz yeriz", "y"], ["yapraklar sararır ve dökülür", "s"], ["okullar açılır", "s"], ["kestane toplarız", "s"], ["kardan adam yaparız", "k"], ["kalın mont giyeriz", "k"], ["günler en uzun olur", "y"], ["göçmen kuşlar güneye gider", "s"], ["kar yağar", "k"]],
  });

  /* =================== Sıralama motoru =================== */
  function sirala(host, def) {
    let set = 0, sira, secilen;
    const box = h("div"); host.append(box);
    const yeni = () => { sira = T.shuffle(def.setler[set][1].map((x, i) => [x, i])); secilen = []; ciz(); };
    function ciz() {
      const [ad, adimlar] = def.setler[set];
      const tamam = secilen.length === adimlar.length;
      box.replaceChildren(
        def.setler.length > 1 ? seg(def.setler.map((x, i) => [i, x[0]]), set, (v) => { set = v; yeni(); }) : null,
        h("p.sb-line", "Doğru sırayla dokun: önce ne olur, sonra ne olur?"),
        h("div.sr-hedef", adimlar.map((_, i) => h("div.sr-yuva" + (secilen[i] ? ".dolu" : ""), h("span.n", i + 1), secilen[i] ? secilen[i][0] : ""))),
        h("div.sn-havuz", tamam ? h("div.sn-bitti", T.icon("check"), ad + ": doğru sıra!", h("button.btn.sm.c-chalk", { onclick: yeni }, T.icon("reset"), "Yeniden")) : sira.filter((x) => !secilen.includes(x)).map((x) => h("button.sn-oge", { onclick: (e) => { if (x[1] === secilen.length) { secilen.push(x); T.sound.ok(); T.speak(x[0]); ciz(); } else { T.sound.no(); e.currentTarget.classList.add("no"); setTimeout(ciz, 600); } } }, x[0]))));
    }
    yeni();
  }
  tool("fen", "yasam-dongusu", { title: "Yaşam döngüleri", icon: "leaf", tone: "leaf", grades: [3, 4], grup: "Canlılar dünyası", short: "Kelebek, kurbağa, fasulye: evreleri sırala",
    render(host) { sirala(host, { setler: [["Kelebek", ["Yumurta", "Tırtıl", "Pupa (koza)", "Kelebek"]], ["Kurbağa", ["Yumurta", "İribaş", "Bacaklı iribaş", "Yavru kurbağa", "Kurbağa"]], ["Fasulye", ["Tohum", "Kökün çıkması (çimlenme)", "Fide", "Yapraklı bitki", "Çiçek ve meyve"]]] }); } });
  tool("sosyal", "saglik-sirasi", { title: "Adım adım sağlık", icon: "check", tone: "sky", grades: [1, 3], grup: "Sağlığım ve güvenliğim", short: "El yıkama ve diş fırçalama adımlarını sırala",
    render(host) { sirala(host, { setler: [["El yıkama", ["Ellerimi ıslatırım.", "Sabunlarım.", "En az 20 saniye ovalarım.", "Bol suyla durularım.", "Temiz havluyla kurularım."]], ["Diş fırçalama", ["Fırçaya nohut kadar macun sürerim.", "Dişlerimi iki dakika fırçalarım.", "Ağzımı çalkalarım.", "Fırçamı yıkayıp yerine koyarım."]], ["Karşıdan karşıya geçme", ["Yaya geçidine giderim.", "Kaldırımın kenarında dururum.", "Önce sola, sonra sağa, sonra yine sola bakarım.", "Araç yoksa dikkatle karşıya geçerim."]]] }); } });

  /* =================== Maddenin hâlleri (tanecik) =================== */
  tool("fen", "tanecik", { title: "Maddenin hâlleri", icon: "blocks", tone: "sky", grades: [3, 4], grup: "Madde", short: "Isıt, soğut: tanecikler nasıl hareket ediyor?",
    render(host) {
      let t = -10, onceki = "katı";
      const cv = h("canvas", { width: 900, height: 420, style: { width: "100%", maxWidth: "900px", borderRadius: "18px", background: "#fff", border: "1px solid var(--line)", display: "block" } });
      const etiket = h("div.tn-etiket"), olay = h("div.tn-olay");
      const out = h("b", t + " °C");
      const sl = h("input", { type: "range", min: -20, max: 130, value: t, style: { flex: 1 }, oninput: (e) => { t = +e.target.value; out.textContent = t + " °C"; } });
      host.append(h("div.row", { style: { gap: "16px", marginBottom: "10px", maxWidth: "900px" } }, h("span", "Soğuk"), sl, h("span", "Sıcak"), out), h("div", { style: { position: "relative", maxWidth: "900px" } }, cv, etiket, olay),
        h("p.hint", "Su üzerinde düşünelim: 0 °C altında buz, 0 ile 100 °C arasında sıvı su, 100 °C üstünde su buharı. Isı arttıkça tanecikler daha hızlı hareket eder ve birbirinden uzaklaşır."));
      const N = 64, ctx = cv.getContext("2d"), W = 900, H = 420;
      const P = Array.from({ length: N }, (_, i) => ({ gx: 330 + (i % 8) * 30, gy: 190 + Math.floor(i / 8) * 28, x: 330 + (i % 8) * 30, y: 190 + Math.floor(i / 8) * 28, vx: 0, vy: 0 }));
      let raf, olayT = 0;
      const hal = () => (t < 0 ? "katı" : t < 100 ? "sıvı" : "gaz");
      function adim() {
        const hl = hal();
        if (hl !== onceki) { const ad = { "katı>sıvı": "Erime", "sıvı>katı": "Donma", "sıvı>gaz": "Buharlaşma (kaynama)", "gaz>sıvı": "Yoğuşma", "katı>gaz": "Erime ve buharlaşma", "gaz>katı": "Yoğuşma ve donma" }[onceki + ">" + hl]; olay.textContent = ad; olayT = 120; onceki = hl; }
        if (olayT > 0) { olayT--; olay.style.opacity = Math.min(1, olayT / 30); } else olay.style.opacity = 0;
        etiket.textContent = { katı: "Katı: buz", sıvı: "Sıvı: su", gaz: "Gaz: su buharı" }[hl];
        const hiz = (t + 30) / 40;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#EEF3FA"; ctx.fillRect(140, 30, 620, 370); ctx.strokeStyle = "#B9C3D6"; ctx.lineWidth = 4; ctx.strokeRect(140, 30, 620, 370);
        for (const p of P) {
          if (hl === "katı") { p.x += (p.gx - p.x) * 0.2 + (Math.random() - 0.5) * hiz * 2; p.y += (p.gy - p.y) * 0.2 + (Math.random() - 0.5) * hiz * 2; }
          else {
            p.vx += (Math.random() - 0.5) * hiz * 0.6; p.vy += (Math.random() - 0.5) * hiz * 0.6 + (hl === "sıvı" ? 0.12 : 0);
            const lim = hl === "gaz" ? hiz * 2.4 : hiz * 1.1; p.vx = T.clamp(p.vx, -lim, lim); p.vy = T.clamp(p.vy, -lim, lim);
            p.x += p.vx; p.y += p.vy;
            const top = hl === "sıvı" ? 250 : 44;
            if (p.x < 152) { p.x = 152; p.vx *= -1; } if (p.x > 748) { p.x = 748; p.vx *= -1; }
            if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy); } if (p.y > 388) { p.y = 388; p.vy *= hl === "sıvı" ? -0.9 : -0.6; }
          }
          ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, Math.PI * 2); ctx.fillStyle = hl === "katı" ? "#6E95D1" : hl === "sıvı" ? "#3C7DD8" : "#9DB7E6"; ctx.fill();
        }
        ctx.fillStyle = t < 0 ? "#5B9BD5" : t < 60 ? "#E9A23B" : "#C2453A"; ctx.fillRect(140, 404, 620 * T.clamp((t + 20) / 150, 0, 1), 10);
        raf = requestAnimationFrame(adim);
      }
      adim(); T.onLeave(() => cancelAnimationFrame(raf));
    } });

  /* =================== Işık ve gölge =================== */
  tool("fen", "isik-golge", { title: "Işık ve gölge", icon: "sun", tone: "sun", grades: [3, 4], grup: "Işık", short: "Işık kaynağını yaklaştır, uzaklaştır: gölge nasıl değişir?",
    render(host) {
      let lx = 220;
      const svg = S("svg", { viewBox: "0 0 1000 420", style: "width:100%;max-width:1000px;background:#fff;border:1px solid var(--line);border-radius:18px;touch-action:none" });
      const bilgi = h("p.sb-line");
      function ciz() {
        const ox = 560, oTop = 190, oBot = 330, ekran = 900, ly = 250;
        const k = (ekran - lx) / (ox - lx);
        const sTop = ly + (oTop - ly) * k, sBot = ly + (oBot - ly) * k;
        svg.innerHTML = `<rect x="${ekran}" y="20" width="24" height="380" fill="#E2E5EC"/>
          <polygon points="${lx},${ly} ${ox},${oTop} ${ekran},${Math.max(20, sTop)} ${ekran},${Math.min(400, sBot)} ${ox},${oBot}" fill="#FFE9A8" opacity=".55"/>
          <rect x="${ekran}" y="${Math.max(20, sTop)}" width="24" height="${Math.min(400, sBot) - Math.max(20, sTop)}" fill="#2B3440" opacity=".85"/>
          <rect x="${ox - 18}" y="${oTop}" width="36" height="${oBot - oTop}" rx="6" fill="#7A5BC7"/>
          <g transform="translate(${lx},${ly})" style="cursor:grab"><circle r="30" fill="#E9A23B"/><circle r="44" fill="#E9A23B" opacity=".25"/><rect x="-12" y="30" width="24" height="70" fill="#8E9BB4"/></g>
          <text x="${lx}" y="${ly + 130}" text-anchor="middle" font-size="18" fill="#4A5568">Işık kaynağı (sürükle)</text><text x="${ox}" y="${oBot + 30}" text-anchor="middle" font-size="18" fill="#4A5568">Cisim</text><text x="${ekran + 12}" y="414" text-anchor="middle" font-size="16" fill="#4A5568">Perde</text>`;
        const oran = (sBot - sTop) / (oBot - oTop);
        bilgi.textContent = `Gölge, cismin yaklaşık ${oran.toFixed(1)} katı büyüklüğünde. ${oran > 2 ? "Işık cisme çok yakın: gölge büyüdü." : oran < 1.4 ? "Işık uzaklaştı: gölge küçüldü ve cisme benzedi." : "Işık kaynağını yaklaştırıp uzaklaştır, farkı gözle."}`;
      }
      const tasi = (e) => { const r = svg.getBoundingClientRect(); lx = T.clamp(((e.clientX - r.left) / r.width) * 1000, 60, 500); ciz(); };
      svg.addEventListener("pointerdown", (e) => { svg.setPointerCapture(e.pointerId); tasi(e); svg.onpointermove = tasi; });
      svg.addEventListener("pointerup", () => (svg.onpointermove = null));
      host.append(svg, bilgi, h("p.hint", "Işık saydam olmayan bir cisimden geçemez, cismin arkasında gölge oluşur. Tahmin et: Işığı cisme yaklaştırırsak gölge büyür mü, küçülür mü?"));
      ciz();
    } });

  /* =================== Karışımları ayıralım =================== */
  const KARISIM = [
    ["Demir tozu ve kum", "miknatis", "Mıknatıs demir tozunu çeker, kum kalır."],
    ["Kum ve çakıl taşı", "elek", "Elek küçük kum tanelerini geçirir, büyük çakılları tutar."],
    ["Su ve kum", "suzgec", "Süzgeç kâğıdı suyu geçirir, kumu tutar."],
    ["Tuzlu su", "buhar", "Su buharlaşır, kabın dibinde tuz kalır."],
    ["Ataş ve pirinç", "miknatis", "Mıknatıs çelik ataşları çeker, pirinç taneleri kalır."],
    ["Un ve fasulye", "elek", "Elekten un geçer, fasulyeler üstte kalır."],
  ];
  const YONTEM = [["miknatis", "Mıknatısla", "magnet"], ["elek", "Elekle", "grid"], ["suzgec", "Süzerek", "filter"], ["buhar", "Buharlaştırarak", "sun"]];
  tool("fen", "karisim", { title: "Karışımları ayıralım", icon: "filter", tone: "grape", grades: [3, 4], grup: "Madde", short: "Hangi karışım hangi yöntemle ayrılır?",
    render(host) {
      let i = 0, sec = null; const l = T.shuffle(KARISIM.slice());
      const box = h("div"); host.append(box);
      function ciz() {
        const [ad, dogru, neden] = l[i % l.length];
        box.replaceChildren(h("div.dy-card", h("small.ak-lbl", "Karışım"), h("div.dy-durum", ad), h("p.sb-line", "Bu karışımı en kolay nasıl ayırırız?"),
          h("div.ay-kutular", YONTEM.map(([k, y, ic]) => h("button.ay-kutu" + (sec ? (k === dogru ? ".right" : k === sec ? ".wrong" : "") : ""), { style: { "--c": "#7A5BC7" }, onclick: () => { if (sec) return; sec = k; k === dogru ? T.sound.ok() : T.sound.no(); ciz(); } }, T.icon(T.ICONS[ic] ? ic : "star"), h("b", y)))),
          sec ? h("div.ay-sonuc", { style: { "--c": "#2E8B57" } }, h("b", sec === dogru ? "Doğru! " : "Bir daha düşünelim. "), neden) : null,
          h("button.btn", { onclick: () => { i++; sec = null; ciz(); } }, T.icon("next"), "Sıradaki karışım")));
      }
      ciz();
    } });

  /* =================== Hava takvimi (sabah rutiniyle bağlantılı) =================== */
  tool("sosyal", "hava-takvimi", { title: "Hava takvimi", icon: "sun", tone: "sky", grades: [1, 4], grup: "Doğa ve çevre", short: "Sabah rutininde seçilen havalar ayın grafiğine dönüşür",
    render(host) {
      let ay = new Date(); ay = new Date(ay.getFullYear(), ay.getMonth(), 1);
      const box = h("div"); host.append(box);
      const cid = () => T.store.activeClass().id;
      function ciz() {
        const s = T.store.get(); const sb = s.sabah || {};
        const gunSay = new Date(ay.getFullYear(), ay.getMonth() + 1, 0).getDate();
        const say = {}; const grid = h("div.sb-month", ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((g) => h("div.sb-wd", g)));
        for (let k = 0; k < (ay.getDay() + 6) % 7; k++) grid.append(h("div.sb-e"));
        for (let d = 1; d <= gunSay; d++) {
          const dt = new Date(ay.getFullYear(), ay.getMonth(), d), key = cid() + ":" + T.isoDate(dt), hv = (sb[key] || {}).hava;
          if (hv) say[hv] = (say[hv] || 0) + 1;
          grid.append(h("button.ht-gun", { onclick: () => { const m = T.modal({ title: d + " " + T.AYLAR[ay.getMonth()], body: h("div.sb-hava", T.HAVA.map(([k, l]) => h("button", { "aria-pressed": String(hv === k), onclick: () => { T.store.update((st) => { st.sabah = st.sabah || {}; st.sabah[key] = st.sabah[key] || {}; st.sabah[key].hava = k; }); m.close(); ciz(); } }, T.havaSvg(k), h("span", l)))), actions: [{ label: "Kapat" }] }); } }, h("small", d), hv ? T.havaSvg(hv) : null));
        }
        const toplam = Object.values(say).reduce((a, b) => a + b, 0);
        const max = Math.max(1, ...Object.values(say));
        box.replaceChildren(
          h("div.row", h("button.btn.sm.icon.c-chalk", { "aria-label": "Önceki ay", onclick: () => { ay = new Date(ay.getFullYear(), ay.getMonth() - 1, 1); ciz(); } }, T.icon("back")), h("h2", { style: { margin: 0 } }, T.AYLAR[ay.getMonth()] + " " + ay.getFullYear()), h("button.btn.sm.icon.c-chalk", { "aria-label": "Sonraki ay", onclick: () => { ay = new Date(ay.getFullYear(), ay.getMonth() + 1, 1); ciz(); } }, T.icon("next")), h("span.hint", "Sabah rutininde seçtiğiniz hava buraya kendiliğinden gelir. Bir güne dokunup değiştirebilirsin.")),
          h("div.ht-grid", h("div.sb-card", grid),
            h("div.sb-card", h("h3", "Bu ay hava nasıldı?"), toplam ? h("div.ht-graf", T.HAVA.map(([k, l]) => h("div", h("div.ht-bar", h("i", { style: { height: ((say[k] || 0) / max) * 100 + "%" } })), h("b", say[k] || 0), T.havaSvg(k), h("small", l)))) : h("p.hint", "Bu ay için henüz hava kaydı yok."),
              toplam ? h("p.sb-line", (() => { const en = Object.entries(say).sort((a, b) => b[1] - a[1])[0]; return `Bu ay en çok ${T.trLower(T.HAVA.find((x) => x[0] === en[0])[1])} gün oldu (${en[1]} gün).`; })()) : null)));
      }
      ciz();
    } });

  /* =================== Güvenli yaya =================== */
  const TRAFIK = [
    ["Yaya ışığı kırmızı yanıyor. Ne yaparsın?", ["Beklerim.", "Koşarak geçerim.", "Araç yoksa geçerim."], 0, "k"],
    ["Yaya ışığı yeşil yandı. Ne yaparsın?", ["Hemen koşarım.", "Sola, sağa, sonra yine sola bakıp dikkatle geçerim.", "Telefonuma bakarak geçerim."], 1, "y"],
    ["Okula yürürken yaya kaldırımı yok. Nerede yürürsün?", ["Yolun ortasında.", "Yolun en kenarında, gelen araçları görecek şekilde.", "Arkadaşımla yan yana yolun içinde."], 1, null],
    ["Servis aracından iniyorsun. Ne yaparsın?", ["Aracın önünden hemen geçerim.", "Araç gidene kadar kaldırımda beklerim.", "Arkasından koşarım."], 1, null],
    ["Arabada yolculuk yapıyorsun. Ne yaparsın?", ["Emniyet kemerimi takarım.", "Ön koltukta otururum.", "Başımı camdan çıkarırım."], 0, null],
    ["Topun yola kaçtı. Ne yaparsın?", ["Hemen peşinden koşarım.", "Durur, bir yetişkinden yardım isterim.", "Gözümü kapatıp koşarım."], 1, null],
  ];
  tool("sosyal", "guvenli-yaya", { title: "Güvenli yaya", icon: "traffic", tone: "tomato", grades: [1, 3], grup: "Sağlığım ve güvenliğim", short: "Trafikte doğru davranış: durumu oku, seç",
    render(host) {
      let i = 0, sec = null; const l = T.shuffle(TRAFIK.slice());
      const box = h("div"); host.append(box);
      const isik = (r) => { const s = S("svg", { viewBox: "0 0 60 120", width: 60, height: 120 }); s.innerHTML = `<rect x="4" y="4" width="52" height="112" rx="12" fill="#2B3440"/><circle cx="30" cy="34" r="18" fill="${r === "k" ? "#E5483B" : "#5A3330"}"/><circle cx="30" cy="84" r="18" fill="${r === "y" ? "#3DBB61" : "#24402E"}"/>`; return s; };
      function ciz() {
        const [soru, sk, d, r] = l[i % l.length];
        box.replaceChildren(h("div.dy-card", r ? isik(r) : null, h("div.dy-durum", soru),
          h("div.gy-sec", sk.map((x, j) => h("button.ay-kutu" + (sec != null ? (j === d ? ".right" : j === sec ? ".wrong" : "") : ""), { style: { "--c": "#3C8DD8" }, onclick: () => { if (sec != null) return; sec = j; j === d ? T.sound.ok() : T.sound.no(); ciz(); } }, h("b", x)))),
          h("div.row", { style: { justifyContent: "center" } }, h("button.btn.c-chalk", { onclick: () => T.speak(soru) }, T.icon("speaker"), "Dinle"), h("button.btn", { onclick: () => { i++; sec = null; ciz(); } }, T.icon("next"), "Sıradaki"))));
      }
      ciz();
    } });
  /* Mevcut araçları ünitelere yerleştir */
  [["deney", "Bilimsel keşif"], ["birim", "Bilimsel keşif"], ["ay", "Dünyamız"], ["devre", "Elektrik ve enerji"], ["zaman", "Ailem ve toplum"], ["aile", "Ailem ve toplum"], ["harita", "Yaşadığım yer ve ülkem"]].forEach(([k, g]) => { if (T.tools[k]) T.tools[k].grup = g; });
})();
