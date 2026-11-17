/* Aynı görünen ikonları ayırır: bir menüde ya da sekmede iki kart aynı resmi taşımasın */
(function () {
  ["aletkutusu", "canta", "gundogumu", "palet", "donme", "not", "yapboz", "dusunce", "abakus", "tirtil", "okyay", "dag", "gonye", "timsah", "kutupayisi", "zincir", "carpi", "ari", "ahtapot", "ayi", "insaat", "dedektif", "turta", "atac", "esittir", "yaris", "yumurta", "cikolata", "tavsan", "elmas", "ucgen", "civciv", "damla"].forEach((k) => T.IKON3D.add(k));
  const YENI = {
    "5N1K çarkı": "donme", "Noktalama ve büyük harf": "not",
    "Hangisi farklı?": "yapboz", "Matematik konuşması": "dusunce", "Sayı dizileri": "abakus",
    "Tırtıl sayıyor": "tirtil", "Sayı doğrusu atışı": "okyay", "Yuvarlama tepesi": "dag", "Alan ve çevre avı": "gonye",
    "Timsahın ağzı": "timsah", "Kutup yolu": "kutupayisi", "Eşini bul": "zincir", "Çarpma ve bölme": "carpi",
    "Bilgi arısı": "ari", "Deniz canavarı": "ahtapot", "Ayıyı besle": "ayi", "Örüntü treni": "train", "Küp kulesi": "insaat",
    "Grafik dedektifi": "dedektif", "Kalanlı paylaşım": "turta", "Sayı bağı": "atac", "İşlem sırası": "esittir",
    "Asal yarışı": "yaris", "Yumurta kolisi": "yumurta", "Kesir şeritleri": "cikolata", "Tavşanla sayı doğrusu": "tavsan",
    "Şekil tuvali": "elmas", "Tangram": "ucgen", "Hava takvimi": "gunesbulut", "Yaşam döngüleri": "civciv", "Maddenin hâlleri": "damla",
  };
  Object.values(T.tools).forEach((t) => { if (t && YENI[t.title]) t.icon = YENI[t.title]; });
  if (T.widgets && T.widgets.draw) T.widgets.draw.icon = "palet";
})();
