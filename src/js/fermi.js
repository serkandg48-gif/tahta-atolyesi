/* Fermi tahmin masası: günlük hayattan büyük tahmin soruları.
   Sınıfın ilk tahminleri sayı doğrusuna dizilir, ipuçları tek tek açılır, tahminler güncellenir, sonra yaklaşık cevap. */
(function () {
  const { h } = T;
  const n = () => (T.store.activeClass().students || []).length || 24;
  const bin = (x) => Math.round(x).toLocaleString("tr-TR");
  /* bil: soruyla birlikte en baştan görünen veriler. ip: düşünmeyi yönlendiren ipuçları. */
  const SORU = [
    { g: [1, 8], s: "Sınıftaki herkes kollarını açıp el ele tutuşsa kaç metrelik bir zincir olur?", bil: () => ["Sınıfımızda " + n() + " öğrenci var.", "Kollarını açan bir çocuk yaklaşık 1 metre 30 santimetre yer kaplar.", "1 metre, 100 santimetredir."], ip: () => ["Önce 10 çocuk kaç metre eder, onu bulalım.", "Tek kişinin uzunluğunu öğrenci sayısıyla çarpalım."], c: () => 1.3 * n(), b: "metre" },
    { g: [1, 4], s: "Bir avucumuza kaç kuru fasulye sığar?", bil: () => ["Bir fasulye yaklaşık 1,5 santimetre uzunluğundadır.", "Avucumuz yaklaşık 8 santimetreye 8 santimetredir.", "Fasulyeler üst üste de durabilir."], ip: () => ["Avucun bir kenarına kaç fasulye sığar? Sonra kaç sıra olur?", "Deneyelim: bir öğrenci avucunu doldursun, birlikte sayalım."], c: () => 40, b: "fasulye (deneyerek bulun)" },
    { g: [2, 8], s: "Sınıfımızdaki herkesin yaşları toplamı kaçtır?", bil: () => ["Sınıfımızda " + n() + " öğrenci var.", "Sınıfımızdaki çoğu öğrenci " + (T.store.grade() + 5) + " ya da " + (T.store.grade() + 6) + " yaşında."], ip: () => ["Herkes aynı yaşta olsaydı toplam ne olurdu?", "Ortalama yaşı öğrenci sayısıyla çarpalım."], c: () => n() * (T.store.grade() + 5.5), b: "yaş" },
    { g: [3, 8], s: "Bir paket pirinçte kaç pirinç tanesi vardır?", bil: () => ["Paket 1 kilogram, yani 1000 gram.", "Bir çay kaşığı pirinç yaklaşık 5 gramdır.", "Bir çay kaşığında yaklaşık 250 tane pirinç vardır."], ip: () => ["1 gramda kaç tane var? 250'yi 5'e bölelim.", "Bir gramdaki tane sayısını 1000 ile çarpalım."], c: () => 50000, b: "tane" },
    { g: [3, 8], s: "Bir A4 kâğıdının üstüne kaç tane 1 TL'yi üst üste binmeden dizebiliriz?", bil: () => ["A4 kâğıdı yaklaşık 21 santimetreye 30 santimetredir.", "1 TL'nin çapı yaklaşık 2,6 santimetredir.", "Paralar kare düzende sıralanacak."], ip: () => ["Kısa kenara kaç para sığar? 21'in içinde kaç tane 2,6 var?", "Uzun kenara kaç para sığar? Sonra satır ile sütunu çarpalım."], c: () => 88, b: "para" },
    { g: [3, 8], s: "Okulumuzda bir günde kaç bardak su içilir?", bil: () => ["Okulumuzda yaklaşık 600 öğrenci var. Kendi okulunuzun sayısını yazabilirsiniz.", "Bir öğrenci okulda günde yaklaşık 3 bardak su içer.", "Okulda yaklaşık 50 öğretmen ve çalışan var."], ip: () => ["Önce yalnız öğrencilerin içtiği suyu bulalım.", "Öğretmenleri ve çalışanları da ekleyelim."], c: () => 1800, b: "bardak (600 öğrenciyle)" },
    { g: [3, 8], s: "Sınıfımıza kaç basketbol topu sığar?", bil: () => ["Sınıfımız yaklaşık 8 metre uzunluğunda, 6 metre genişliğinde, 3 metre yüksekliğinde.", "Bir basketbol topunun çapı yaklaşık 24 santimetredir.", "1 metreye yan yana yaklaşık 4 top dizilir."], ip: () => ["1 metreküplük bir kutuya kaç top sığar? 4 × 4 × 4", "Sınıfın hacmi 8 × 6 × 3 metreküp. İki sayıyı çarpalım."], c: () => 144 * 64, b: "top" },
    { g: [4, 8], s: "Sınıfımız bir yılda kaç sayfa defter doldurur?", bil: () => ["Sınıfımızda " + n() + " öğrenci var.", "Bir öğrenci günde yaklaşık 4 sayfa yazar.", "Bir yılda yaklaşık 180 okul günü var."], ip: () => ["Bir öğrenci bir yılda kaç sayfa yazar?", "Bunu öğrenci sayısıyla çarpalım."], c: () => 4 * 180 * n(), b: "sayfa" },
    { g: [4, 8], s: "Bir yılda kaç kez nefes alırız?", bil: () => ["Dinlenirken dakikada yaklaşık 15 kez nefes alırız. Bir dakika sayarak deneyin.", "Bir saatte 60 dakika, bir günde 24 saat vardır.", "Bir yılda 365 gün vardır."], ip: () => ["Bir saatte kaç nefes? Bir günde kaç nefes?", "Günlük nefes sayısını 365 ile çarpalım."], c: () => 15 * 1440 * 365, b: "nefes" },
    { g: [3, 8], s: "Bir hikâye kitabında kaç harf vardır?", bil: () => ["Kitap 48 sayfa.", "Sayfalar yarım A4 boyutunda.", "Bir satırda yaklaşık 40 harf, bir sayfada yaklaşık 20 satır var.", "Resimli sayfalarda yazı daha az olur."], ip: () => ["Bir sayfada kaç harf var? 40 × 20", "Bir sayfadaki harf sayısını sayfa sayısıyla çarpalım. Resimler için biraz azaltabiliriz."], c: () => 40 * 20 * 48, b: "harf" },
    { g: [5, 8], s: "Türkiye'deki bütün öğrenciler yan yana dursa kaç kilometre olur?", bil: () => ["Türkiye'de yaklaşık 18 milyon öğrenci var.", "Yan yana duran bir öğrenci yaklaşık 50 santimetre yer kaplar.", "1 kilometre 1000 metredir."], ip: () => ["2 öğrenci 1 metre eder. 18 milyon öğrenci kaç metre eder?", "Metreyi 1000'e bölüp kilometreye çevirelim."], c: () => 9000, b: "kilometre" },
  ];
  T.tools["fermi"] = {
    back: "matematik", cat: "his", grades: [1, 8], title: "Fermi tahmin masası", icon: "scale", ikon3: "buyutec", tone: "sky", ilk: 3,
    short: "Büyük sorulara akıllıca tahmin", desc: "Önce tahmin, sonra ipuçlarıyla tahmini güncelleme",
    render(host) {
      const g = T.store.grade(); const L = SORU.filter((q) => g >= q.g[0] && g <= q.g[1]);
      let qi = Math.floor(Date.now() / 864e5) % L.length, ilk = [], son = [], acik = 0, cevap = false;
      const kap = h("div.fm"); host.append(kap);
      const sayiOku = (v) => { const x = Number(String(v).replace(/\./g, "").replace(",", ".")); return isFinite(x) && x > 0 ? x : null; };
      function dogru() {
        const q = L[qi], c = q.c(); const hepsi = ilk.concat(son, cevap ? [c] : []); if (!hepsi.length) return h("div.fm-dogru.bos", "Tahminler burada sayı doğrusuna dizilecek");
        let mn = Math.min(...hepsi), mx = Math.max(...hepsi); if (mn === mx) { mn = mn / 2; mx = mx * 2; }
        const log = mx / Math.max(mn, 1e-9) > 40, f = (v) => log ? (Math.log(v) - Math.log(mn)) / (Math.log(mx) - Math.log(mn)) : (v - mn) / (mx - mn);
        const yer = (v) => 4 + f(v) * 92 + "%";
        const nokta = (v, cls, i) => h("div.fm-n." + cls, { style: { left: yer(v), "--y": (i % 3) * 22 + "px" }, title: bin(v) }, h("span", bin(v)));
        return h("div.fm-dogru", h("div.fm-cizgi"), h("small.fm-uc.sol", bin(mn)), h("small.fm-uc.sag", bin(mx)), log ? h("small.fm-log", "Sayılar çok farklı olduğu için doğru 10'ar kat büyüyerek ilerler") : null,
          ilk.map((v, i) => nokta(v, "ilk", i)), son.map((v, i) => nokta(v, "son", i)), cevap ? nokta(c, "cevap", 0) : null);
      }
      function ciz() {
        const q = L[qi], ip = q.ip(), tur = acik === 0 ? ilk : son;
        const inp = h("input.in.fm-in", { inputmode: "numeric", placeholder: acik === 0 ? "İlk tahmin" : "Yeni tahmin", "aria-label": "Tahmin" });
        const ekle = () => { const v = sayiOku(inp.value); if (!v) return T.toast("Bir sayı yaz"); tur.push(v); ciz(); setTimeout(() => kap.querySelector(".fm-in") && kap.querySelector(".fm-in").focus(), 0); };
        inp.addEventListener("keydown", (e) => { if (e.key === "Enter") ekle(); });
        const enAz = ilk.length ? Math.min(...ilk) : null, enCok = ilk.length ? Math.max(...ilk) : null;
        kap.replaceChildren(
          h("div.fm-soru", h("small", "Tahmin sorusu"), h("h2", q.s), h("div.row", { style: { gap: "6px" } },
            h("button.btn.sm.c-chalk", { onclick: () => { qi = (qi + 1) % L.length; ilk = []; son = []; acik = 0; cevap = false; ciz(); } }, T.icon("next"), "Başka soru"))),
          h("div.fm-bil", h("b", "Bildiklerimiz"), h("ul", q.bil().map((t) => h("li", t)))),
          dogru(),
          ilk.length ? h("p.fm-ozet", "En küçük tahmin " + bin(enAz) + ", en büyük " + bin(enCok) + ". " + (enCok / enAz >= 10 ? "Aralarında " + Math.round(enCok / enAz) + " kat fark var!" : "")) : null,
          h("div.fm-alt",
            h("div.fm-gir", h("b", acik === 0 ? "1. Önce herkes tahmin etsin" : "3. İpuçlarından sonra tahminini güncelle"), h("div.row", { style: { gap: "6px" } }, inp, h("button.btn.c-sky", { onclick: ekle }, T.icon("plus"), "Ekle")),
              h("p.hint", { style: { margin: 0 } }, acik === 0 ? "Turuncu noktalar ilk tahminler." : "Mavi noktalar yeni tahminler.")),
            h("div.fm-ipuclari", h("b", "2. İpuçları"), ip.slice(0, acik).map((t, i) => h("p.fm-ip", h("span", i + 1), t)),
              acik < ip.length ? h("button.btn.sm.c-sun", { onclick: () => { acik++; ciz(); } }, T.icon("spark"), acik === 0 ? "İlk ipucunu aç" : "Sonraki ipucu") : null,
              acik >= 1 && !cevap ? h("button.btn.sm.c-leaf", { onclick: () => { cevap = true; ciz(); } }, T.icon("eye"), "Yaklaşık cevap") : null,
              cevap ? h("p.fm-cevap", "Yaklaşık " + bin(q.c()) + " " + q.b + ". Tam sayı değil, akıllıca bir tahmin. Kimin tahmini kanıtlarla en çok değişti?") : null)));
      }
      ciz();
    },
  };
})();
