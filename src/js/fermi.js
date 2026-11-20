/* Fermi tahmin masası: günlük hayattan büyük tahmin soruları.
   Sınıfın ilk tahminleri sayı doğrusuna dizilir, ipuçları tek tek açılır, tahminler güncellenir, sonra yaklaşık cevap. */
(function () {
  const { h } = T;
  const n = () => (T.store.activeClass().students || []).length || 24;
  const bin = (x) => Math.round(x).toLocaleString("tr-TR");
  const SORU = [
    { g: [1, 8], s: "Sınıftaki herkes kollarını açıp el ele tutuşsa kaç metrelik bir zincir olur?", ip: () => ["Kollarını açan bir çocuk yaklaşık 1 metre 30 santimetre yer kaplar.", "Sınıfımızda " + n() + " öğrenci var.", "Tek kişinin uzunluğunu öğrenci sayısıyla çarpalım."], c: () => 1.3 * n(), b: "metre" },
    { g: [1, 4], s: "Bir avucumuza kaç kuru fasulye sığar?", ip: () => ["Bir fasulye yaklaşık 1,5 santimetre uzunluğundadır.", "Avucumuz yaklaşık 8 santimetreye 8 santimetredir.", "Deneyelim: bir öğrenci avucunu doldursun, birlikte sayalım."], c: () => 40, b: "fasulye (deneyerek bulun)" },
    { g: [2, 8], s: "Sınıfımızdaki herkesin yaşları toplamı kaçtır?", ip: () => ["Sınıfımızdaki çoğu öğrenci " + (T.store.grade() + 5) + " ya da " + (T.store.grade() + 6) + " yaşında.", "Sınıfımızda " + n() + " öğrenci var.", "Ortalama yaşı öğrenci sayısıyla çarpalım."], c: () => n() * (T.store.grade() + 5.5), b: "yaş" },
    { g: [3, 8], s: "Bir paket pirinçte kaç pirinç tanesi vardır?", ip: () => ["Paket 1 kilogram, yani 1000 gram.", "1 gram pirinçte yaklaşık 50 tane vardır.", "1000 ile 50'yi çarpalım."], c: () => 50000, b: "tane" },
    { g: [3, 8], s: "Bir A4 kâğıdının üstüne kaç tane 1 TL'yi üst üste binmeden dizebiliriz?", ip: () => ["A4 kâğıdı yaklaşık 21 santimetreye 30 santimetredir.", "1 TL'nin çapı yaklaşık 2,6 santimetredir.", "Bir satıra 8, bir sütuna 11 para sığar."], c: () => 88, b: "para" },
    { g: [3, 8], s: "Okulumuzda bir günde kaç bardak su içilir?", ip: () => ["Bir öğrenci okulda günde yaklaşık 3 bardak su içer.", "Okulumuzda kaç öğrenci var? Yaklaşık bir sayı söyleyin, örneğin 600.", "Öğrenci sayısını 3 ile çarpalım. Öğretmenleri de ekleyebiliriz."], c: () => 1800, b: "bardak (600 öğrenciyle)" },
    { g: [3, 8], s: "Sınıfımıza kaç basketbol topu sığar?", ip: () => ["Sınıfımız yaklaşık 8 metre uzunluğunda, 6 metre genişliğinde ve 3 metre yüksekliğinde.", "Bu, 8 × 6 × 3 = 144 metreküp eder.", "Toplar arasında boşluk kaldığı için 1 metreküpe yaklaşık 50 top sığar."], c: () => 144 * 50, b: "top" },
    { g: [4, 8], s: "Sınıfımız bir yılda kaç sayfa defter doldurur?", ip: () => ["Bir öğrenci günde yaklaşık 4 sayfa yazar.", "Bir yılda yaklaşık 180 okul günü var.", "Sınıfımızda " + n() + " öğrenci var. Üç sayıyı çarpalım."], c: () => 4 * 180 * n(), b: "sayfa" },
    { g: [4, 8], s: "Bir yılda kaç kez nefes alırız?", ip: () => ["Dinlenirken dakikada yaklaşık 15 kez nefes alırız. Bir dakika sayarak deneyin.", "Bir günde 24 × 60 = 1440 dakika vardır.", "Bir yılda 365 gün vardır."], c: () => 15 * 1440 * 365, b: "nefes" },
    { g: [4, 8], s: "Bir hikâye kitabında kaç harf vardır?", ip: () => ["Bir satırda yaklaşık 50 harf vardır.", "Bir sayfada yaklaşık 25 satır vardır.", "Kitap 120 sayfa olsun."], c: () => 50 * 25 * 120, b: "harf" },
    { g: [5, 8], s: "Türkiye'deki bütün öğrenciler yan yana dursa kaç kilometre olur?", ip: () => ["Türkiye'de yaklaşık 18 milyon öğrenci var.", "Yan yana duran bir öğrenci yaklaşık 50 santimetre yer kaplar.", "18.000.000 × 0,5 metre, sonra kilometreye çevirelim."], c: () => 9000, b: "kilometre" },
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
