/* Türkçe dil oyunları: Kelime fabrikası (yapım ekleriyle yeni kelime) ve Anlam treni (kelimeleri sıraya koyup anlamlı cümle). */
(function () {
  const { h } = T;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const karistir = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- Kelime fabrikası ---------- */
  /* [kök, doğru ek, anlam, yanlış ekler (başka anlama giden)] */
  const FABRIKA = [
    ["kitap", "çı", "Kitap satan kişi", ["lık", "lı", "sız"]],
    ["kitap", "lık", "Kitapların dizildiği raf ya da dolap", ["çı", "sız", "lı"]],
    ["tuz", "lu", "İçinde tuz olan", ["suz", "luk", "cu"]],
    ["tuz", "luk", "Sofrada tuz konan küçük kap", ["lu", "suz", "cu"]],
    ["su", "suz", "Suyu olmayan", ["lu", "cu", "luk"]],
    ["ses", "siz", "Hiç ses çıkarmayan", ["li", "çi", "lik"]],
    ["renk", "li", "Birçok rengi olan", ["siz", "çi", "lik"]],
    ["balık", "çı", "Balık tutan ya da satan kişi", ["lı", "lık", "sız"]],
    ["yol", "cu", "Yolculuk eden kişi", ["lu", "suz", "luk"]],
    ["süt", "çü", "Süt satan kişi", ["lü", "süz", "lük"]],
    ["göz", "lük", "Gözü korumak ya da iyi görmek için takılan araç", ["cü", "süz", "lü"]],
    ["kalem", "lik", "Kalemlerin konduğu kutu", ["ci", "li", "siz"]],
    ["bilgi", "li", "Çok şey bilen", ["siz", "ci", "lik"]],
    ["güç", "lü", "Kuvveti çok olan", ["süz", "çü", "lük"]],
    ["boya", "cı", "Duvarları boyayan kişi", ["lı", "sız", "lık"]],
    ["çiçek", "çi", "Çiçek satan kişi", ["li", "siz", "lik"]],
    ["akıl", "lı", "Aklını iyi kullanan", ["sız", "cı", "lık"]],
    ["yağmur", "luk", "Yağmurda giyilen giysi", ["lu", "suz", "cu"]],
    ["tat", "lı", "Şekerli, tadı güzel", ["sız", "çı", "lık"]],
    ["şeker", "siz", "İçine şeker konmamış", ["li", "ci", "lik"]],
    ["dost", "luk", "İki dostun arasındaki bağ", ["lu", "suz", "çu"]],
    ["iş", "çi", "Bir işte çalışan kişi", ["li", "siz", "lik"]],
    ["sağ", "lık", "Hasta olmama durumu", ["lı", "sız", "çı"]],
    ["kum", "sal", "Kumla kaplı yer", ["lu", "cu", "suz"]],
  ];
  /* ünsüz yumuşaması: kitap + ı gibi durumlar bu listede yok; yazılış kök + ek */
  const kelime = (k, e) => k + e;
  /* ünlü uyumu turu: aynı ekin dört biçimi */
  const BICIM = { lık: ["lık", "lik", "luk", "lük"], lı: ["lı", "li", "lu", "lü"], sız: ["sız", "siz", "suz", "süz"], cı: ["cı", "ci", "cu", "cü"], çı: ["çı", "çi", "çu", "çü"] };
  const aile = (e) => Object.entries(BICIM).find(([, L]) => L.includes(e));

  /* ---------- Anlam treni ---------- */
  const CUMLE = [
    "Kedi bahçede top oynuyor.", "Annem bana kek yaptı.", "Sabah erkenden okula gittik.", "Kuşlar ağaçta şarkı söylüyor.",
    "Babam arabayı yıkadı.", "Yağmur yağınca şemsiye açtık.", "Kardeşim resim yapmayı sever.", "Teneffüste ip atladık.",
    "Öğretmenimiz bize masal okudu.", "Kırmızı balon gökyüzüne uçtu.", "Dedem bahçeye domates ekti.", "Köpek kemiğini toprağa gömdü.",
    "Kışın kardan adam yaparız.", "Ali kütüphaneden kitap aldı.", "Arı çiçekten çiçeğe konuyor.", "Bu akşam yıldızları izleyeceğiz.",
    "Ayşe sınıfa yeni bir bitki getirdi.", "Tren istasyona tam zamanında geldi.", "Küçük kaplumbağa yavaş yavaş yürüdü.", "Hafta sonu ormanda yürüyüş yaptık.",
  ];

  const OYUN = {
    "kelime-fabrikasi": { ad: "Kelime fabrikası", renk: "#C2410C", renk2: "#FFE6D5", tur: 8, sahne: "atolye", giris: "Köke doğru eki ekle, fabrika yeni kelimeyi üretsin!",
      yeni(a, tur) {
        const bicimTuru = tur >= 4 && Math.random() < 0.5;
        const [kok, ek, anlam, yanlis] = FABRIKA[rnd(0, FABRIKA.length - 1)];
        const makine = h("div.kf-makine", h("div.kf-giris", h("span.kf-kok", kok), h("span.kf-arti", "+"), h("span.kf-ek", "?")), h("div.kf-govde", h("div.kf-disli", "⚙️"), h("div.kf-disli.ters", "⚙️")), h("div.kf-cikis", h("span.kf-sonuc", "?")));
        a.sahne.append(h("div.kf-sahne", h("div.kf-anlam", h("small", "Aranan kelime"), h("b", anlam)), makine));
        let secenek;
        if (bicimTuru && aile(ek)) { a.soru("\"" + kok + "\" köküne hangi ek uyar? Son hecedeki ünlüye kulak ver."); secenek = aile(ek)[1]; }
        else { a.soru("Hangi eki eklersek \"" + anlam.toLocaleLowerCase("tr") + "\" anlamına gelir?"); secenek = karistir([ek, ...yanlis]); }
        const goster = (e) => { makine.querySelector(".kf-ek").textContent = e; makine.querySelector(".kf-sonuc").textContent = kelime(kok, e); };
        a.alt.replaceChildren(h("div.dn-secenek", secenek.map((e) => h("button.dn-dug.kf-dug", { onclick: (ev) => {
          goster(e); makine.classList.remove("calis"); void makine.offsetWidth; makine.classList.add("calis");
          if (e === ek) { ev.currentTarget.classList.add("iyi"); a.dogru(kok + " + " + ek + " = " + kelime(kok, ek) + "!"); }
          else { ev.currentTarget.classList.add("kotu"); ev.currentTarget.disabled = true; makine.classList.add("bozuk"); setTimeout(() => makine.classList.remove("bozuk"), 700);
            a.yanlis(bicimTuru ? "Kökteki son ünlüye bak: " + kok + ". Ek ona uysun." : "\"" + kelime(kok, e) + "\" başka bir anlama geliyor. Tanımı yeniden oku."); } } }, "+" + e))));
      } },
    "anlam-treni": { ad: "Anlam treni", renk: "#1D4ED8", renk2: "#DBEAFE", tur: 8, sahne: "sinif", giris: "Kelimeleri sırayla vagonlara bindir, anlamlı bir cümle kur!",
      yeni(a, tur) {
        const L = CUMLE.filter((c) => c.split(" ").length <= (tur < 3 ? 4 : tur < 6 ? 5 : 7));
        const cumle = L[rnd(0, L.length - 1)], kel = cumle.split(" ");
        a.soru("Kelimelere sırayla dokun. Anlamlı bir cümle kuralım.");
        const vagonlar = h("div.at-vagonlar"), tren = h("div.at-tren", h("div.at-lokomotif", "🚂"), vagonlar), ray = h("div.at-ray", tren);
        let dizi = [];
        const havuz = h("div.at-havuz");
        const ciz = () => {
          vagonlar.replaceChildren(...kel.map((_, i) => h("div.at-vagon" + (dizi[i] != null ? ".dolu" : ""), { onclick: () => { if (dizi[i] == null) return; dizi = dizi.slice(0, i); ciz(); } }, dizi[i] != null ? karisik[dizi[i]] : "")));
          havuz.replaceChildren(...karisik.map((w, i) => h("button.at-kelime", { disabled: dizi.includes(i) ? true : null, onclick: () => { dizi.push(i); T.sound.pop && T.sound.pop(); ciz(); if (dizi.length === kel.length) kontrol(); } }, w)));
        };
        let karisik = karistir(kel); if (karisik.join(" ") === cumle) karisik = karistir(kel);
        const kontrol = () => { const kurulan = dizi.map((i) => karisik[i]).join(" ");
          if (kurulan === cumle) { tren.classList.add("gidiyor"); a.dogru("Tren yola çıktı: " + cumle); }
          else { a.yanlis("Cümle karıştı. Bir vagona dokunursan oradan sonrasını geri alırsın."); setTimeout(() => { dizi = []; ciz(); }, 1200); } };
        a.sahne.append(h("div.at-sahne", ray, havuz));
        a.alt.replaceChildren(h("div.row", { style: { justifyContent: "center", gap: "8px" } }, h("button.btn.c-chalk", { onclick: () => { dizi = []; ciz(); } }, T.icon("reset"), "Baştan"), h("button.btn.c-chalk", { onclick: () => { const dogruMu = dizi.every((v, k) => karisik[v] === kel[k]); if (!dogruMu) { dizi = []; a.konus("Baştan kuralım. İlk kelime büyük harfle başlar."); } if (dizi.length < kel.length) { const j = karisik.findIndex((w, i) => w === kel[dizi.length] && !dizi.includes(i)); dizi.push(j); } ciz(); if (dizi.length === kel.length) kontrol(); } }, T.icon("spark"), "İpucu")));
        ciz();
      } },
  };
  Object.entries(OYUN).forEach(([id, o]) => {
    T.tools[id] = { back: "turkce", grup: "Dil oyunları", grades: id === "anlam-treni" ? [1, 3] : [2, 4], title: o.ad, icon: id === "anlam-treni" ? "text" : "spell", ikon3: id === "anlam-treni" ? "kitap" : "disli", tone: "tomato", short: o.giris.replace(/[!.]+$/, ""),
      render(host) { T.oyunKabuk(host, Object.assign({ baslik: o.ad }, o)); } };
  });
})();
