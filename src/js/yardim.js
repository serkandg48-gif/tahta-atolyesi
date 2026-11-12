/* Yardım: her sayfada "?" düğmesi ve ilk açılışta üç adımlı karşılama. Dil öğretmenin dili. */
(function () {
  const { h } = T;
  T.YARDIM = Object.assign({
    sabah: ["Sabah rutini", "Güne başlarken sırayla aç: günaydın, takvim, özel gün, günün sayısı, günün akışı.", ["Sıradaki adıma geçmek için üstteki numaralara dokun.", "Günün sayısında \"Kendi sayım\" ile sayıyı elle değiştirebilirsin.", "Günün akışına ders programını bir kez yaz, ana sayfa her gün onu gösterir."]],
    sinif: ["Sınıfım", "Yoklama, davranış puanı, oturma planı ve görevliler burada.", ["Öğrenci adlarını Sınıf listesi sekmesinden yaz ya da yapıştır.", "Adlar yalnızca bu cihazda kalır, yapay zekâya gönderilmez.", "Görevlileri ana sayfadaki Görevliler satırından da düzenleyebilirsin."]],
    turkce: ["Türkçe", "Okuma, anlama, yazma ve söz varlığı için sınıfta açılan etkinlikler.", ["Bir karta dokun, etkinlik tahtada açılır.", "Kartın köşesindeki iğne o etkinliği ana sayfadaki kısayollara ekler.", "Metin uyarlayıcı bir konudan sınıfına uygun okuma metni hazırlar."]],
    birinci: ["Türkçe (1. sınıf)", "İlk okuma yazma için ses, hece ve kelime etkinlikleri.", ["Ses grubunu seç, etkinlikler o seslerle çalışır.", "Kartın köşesindeki iğne etkinliği ana sayfaya ekler."]],
    matematik: ["Matematik", "Sayı hissi, somut materyaller, oyunlar ve simülasyonlar.", ["Üstteki sekmelerden konu seç.", "Kartlar sınıf seviyene göre sıralanır, hepsi her sınıfta açılır.", "Kartın köşesindeki iğne etkinliği ana sayfaya ekler."]],
    fen: ["Fen Bilimleri", "Deney, gözlem ve modelleme etkinlikleri.", ["Bir karta dokun, etkinlik tahtada açılır.", "Kartın köşesindeki iğne etkinliği ana sayfaya ekler."]],
    sosyal: ["Hayat Bilgisi ve Sosyal", "Okul, aile, çevre ve zaman konularında sınıf etkinlikleri.", ["Bir karta dokun, etkinlik tahtada açılır.", "Kartın köşesindeki iğne etkinliği ana sayfaya ekler."]],
    ingilizce: ["İngilizce", "Kelime, dinleme ve konuşma etkinlikleri.", ["Kelimeleri dinletmek için hoparlör simgesine dokun."]],
    duygu: ["Duygular ve sınıf kültürü", "Duygumetre, çatışma çözümü, Bump It Up duvarı, Etkinliğim bitti menüsü.", ["Duygumetreyi sabah ya da teneffüs dönüşü aç.", "Bump It Up duvarına kendi örnek fotoğraflarını yükleyebilirsin.", "Etkinliğim bitti menüsünü sınıfla birlikte oylayarak kurun."]],
    zeka: ["Düşünme soruları", "Gerçek hayattan bir durum ve ona bağlı sorular. Ezber değil, akıl yürütme.", ["Kartı aç, durumu birlikte okuyun, soruları tek tek konuşun."]],
    plan: ["Plan", "Günlük ve yıllık plan, Maarif öğrenme çıktılarıyla.", ["Dersi, sınıfı ve çıktıyı seç; plan hazırlanır.", "Kaydettiğin planı tek dokunuşla ders ekranına dönüştürebilirsin.", "Yapay zekâ için Ayarlar'dan Google ile giriş yapman yeterli, ücret yok."]],
    ayarlar: ["Ayarlar", "Okul takvimi, sınıflar, ses ve giriş.", ["Okul takvimini bir kez gir, \"okulun kaçıncı günü\" buradan hesaplanır."]],
    ekran: ["Ders ekranı", "Tamamen boş bir tahta. Plandan kurulan dersler de burada açılır.", ["Alttaki Araç ekle düğmesiyle zamanlayıcı, isim çekme, yönerge gibi araçlar koy.", "Araçları sürükleyip büyütebilirsin."]],
  }, T.YARDIM || {});
  delete T.YARDIM.birinci;
  T.yardimAc = function (id) {
    const y = T.YARDIM[id]; if (!y) return;
    T.modal({ title: y[0], body: h("div", { style: { display: "grid", gap: "10px" } }, h("p", { style: { fontSize: "18px", margin: 0 } }, y[1]), h("ul.yardim-liste", y[2].map((x) => h("li", x)))), actions: [{ label: "Anladım", tone: "c-leaf" }] });
  };

  /* İlk açılış karşılaması */
  const gordu = () => { try { return localStorage.getItem("ta-hosgeldin") === "1"; } catch (e) { return true; } };
  T.hosgeldin = function (zorla) {
    if (!zorla && gordu()) return;
    try { localStorage.setItem("ta-hosgeldin", "1"); } catch (e) {}
    const adim = (no, ikon, bas, ac, dugme, fn) => h("div.hg-adim", h("span.hg-no", no), T.icon3d(ikon), h("div", h("b", bas), h("p", ac)), h("button.btn.c-chalk", { onclick: () => { m.close(); fn(); } }, dugme));
    const m = T.modal({ title: "Tahta Atölyesi'ne hoş geldin", body: h("div", { style: { display: "grid", gap: "12px" } },
      h("p", { style: { margin: 0, fontSize: "17px" } }, "Her şey ücretsiz. Üç adımda sınıfın hazır olur, sonra her sabah ana sayfa seni karşılar."),
      adim("1", "class", "Sınıfını kur", "Sınıf adını ve öğrenci adlarını yaz. Adlar yalnızca bu cihazda kalır.", "Sınıfıma git", () => T.go("sinif-liste")),
      adim("2", "clock", "Ders programını yaz", "Bir kez yaz, ana sayfa her gün \"şimdi hangi ders, zile kaç dakika\" gösterir.", "Programı yaz", () => T.go("sabah-akis")),
      adim("3", "timer", "Bir araç dene", "Soldaki çantadan Zamanlayıcı'ya dokun. Araçlar her sayfanın üstünde kalır.", "Zamanlayıcı aç", () => { T.go("ana"); setTimeout(() => T.yuzen.add("timer"), 200); }),
      h("p.hint", { style: { margin: 0 } }, "Her sayfanın sağ üstündeki ? düğmesi o sayfanın ne işe yaradığını anlatır.")),
      actions: [{ label: "Kendim keşfedeceğim" }] });
  };
})();
