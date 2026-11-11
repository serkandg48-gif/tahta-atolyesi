/* Türkçe 1-4 öğrenme çıktıları. Kaynak: MEB, Türkiye Yüzyılı Maarif Modeli İlkokul Türkçe Dersi Öğretim Programı (1-4), 2026,
   mufredat.meb.gov.tr/Dosyalar/202681493354625-Türkçe (1-4) DÖP TTKB.pdf
   Programda aynı öğrenme çıktısı her temada farklı süreç bileşenleriyle yer alır; harfler programdaki gibidir.
   Biçim: "S|sınıf", "TEMA|ad", "kod|çıktı|a) ...;; c) ..." */
(function () {
  const N1 = "Yazılarında noktalama işaretlerini (nokta, kesme işareti, soru işareti, virgül ve ünlem) kuralına uygun kullanır.";
  const N2 = "Yazılarında noktalama işaretlerini (nokta, kesme işareti, virgül, iki nokta, ünlem, tırnak işareti, soru işareti ve kısa çizgi) kuralına uygun kullanır.";
  const N3 = "Yazılarında noktalama işaretlerini (nokta, kesme işareti, virgül, iki nokta, ünlem, tırnak işareti, soru işareti, kısa çizgi, konuşma çizgisi, yay ayraç, üç nokta ve eğik çizgi) kuralına uygun kullanır.";
  const D11 = "T.D.1.1.|Dinlemeyi/izlemeyi yönetebilme|a) Verilen görseller arasından öğrendiği sesin geçtiği görseli/görselleri seçer.;; c) Dinleme kurallarına uygun olarak dinler.;; ç) Dinleme esnasında konuşmaya dâhil olmak için uygun zamanda söz alır.";
  const D12 = "T.D.1.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Sese karşılık gelen sembolü/harfi tanır.;; c) Görselden/görsellerden hareketle dinleyeceği/izleyeceği metin hakkında tahminde bulunur.;; ç) Dinlediklerini yaşantı ve ön bilgileriyle karşılaştırarak çıkarımda bulunur.;; d) Dinlediği sesin bulunduğu sözcüklere örnekler verir.;; f) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.";
  const D13 = "T.D.1.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Seslere karşılık gelen sembolleri/harfleri ayırt eder.;; c) Dinlediği/izlediği metnin konusunu bulur.";
  const D14 = "T.D.1.4.|Dinleme/izleme sürecini değerlendirebilme|c) Dinlemesindeki/izlemesindeki uygun davranışlarını sonraki dinlemelerine aktarır.";
  const K12 = "T.K.1.2.|Konuşmalarında içerik oluşturabilme|a) Ön bilgilerinden hareketle dinlediği sesin içinde geçtiği sözcükler hakkında konuşur.;; b) Dinlediği/izlediği metni anlatır.";
  const K13 = "T.K.1.3.|Konuşma kurallarını uygulayabilme|a) Öğrendiği ses, hece, sözcük, cümleleri işitilebilir bir ses düzeyinde söyler.;; c) Dinlediğini/izlediğini telaffuza dikkat ederek anlatır.";
  const O11 = "T.O.1.1.|Okuma sürecini yönetebilme|a) Harf ve heceleri doğru seslendirir.;; b) Sözcükleri doğru okur.;; c) Basit ve kısa cümleleri doğru okur.;; ç) Telaffuza dikkat ederek okur.;; d) Öğrendiği ses, hece, sözcük veya cümleleri işitilebilir bir ses düzeyinde okur.";
  const Y11 = "T.Y.1.1.|Yazılı anlatım becerilerini yönetebilme|a) Yazma materyalini kurala uygun kullanır.;; c) Hece, sözcük veya cümleler yazar.";
  const Y12 = "T.Y.1.2.|Yazılarında içerik oluşturabilme|a) Görsellerle ilgili sözcük veya cümleler yazar.";
  const ISL = "T.O.1.1.|Okuma sürecini yönetebilme|e) Okuyacağı metnin başlığı ve görsellerini inceler.;; f) Kuralına uygun sesli ve sessiz okur.;; g) Anlaşılabilir ve uygun bir hızda sesli okur.;; ğ) Bir dizi kısa metin içerisinden seçtiği metni okur.;; h) Noktalama işaretlerine dikkat ederek okur.";
  const T1_78 = (d13) => `T.D.1.1.|Dinlemeyi/izlemeyi yönetebilme|b) Dinleyeceklerini/izleyeceklerini amacına uygun olarak seçer.;; c) Dinleme kurallarına uygun olarak dinler.;; ç) Dinleme esnasında konuşmaya dâhil olmak için uygun zamanda söz alır.
T.D.1.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|c) Görselden/görsellerden hareketle dinleyeceği/izleyeceği metin hakkında tahminde bulunur.;; ç) Dinlediklerini yaşantı ve ön bilgileriyle karşılaştırarak çıkarımda bulunur.;; e) Dinlediklerinde/izlediklerinde geçen olayların öncesi hakkında tahminde bulunur.;; f) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.;; g) Dinlediklerindeki/izlediklerindeki iletileri doğruluk, gerçeklik açısından ön bilgileriyle karşılaştırır.;; ğ) Dinlediklerindeki/izlediklerindeki nesneleri fiziksel özelliklerine göre sınıflandırır.
T.D.1.3.|Dinlediklerini/izlediklerini çözümleyebilme|c) Dinlediği/izlediği metnin konusunu bulur.;; ç) ${d13};; d) Dinlediğindeki/izlediğindeki söylem ve görsel arasındaki ilişkiyi belirler.
T.D.1.4.|Dinleme/izleme sürecini değerlendirebilme|a) Dinleme/izleme sürecindeki hatalarını belirler.;; b) Dinlemesinde/izlemesinde belirlediği hatalarını düzeltir.;; c) Dinlemesindeki/izlemesindeki uygun davranışlarını sonraki dinlemelerine aktarır.
T.K.1.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; c) İletişim sırasında uygun zamanda söz alır.;; ç) Konuşmalarında selamlaşma ve hitap ile ilgili ifadeler kullanır.
T.K.1.2.|Konuşmalarında içerik oluşturabilme|e) Konuşmalarında geçen nesneleri fiziksel özelliklerine göre karşılaştırır.;; f) Konuşmalarında nesneleri fiziksel özelliklerine göre sınıflandırır.;; ğ) Sözlü iletişimde kabul etmediği konulara ilişkin önerilerde bulunur.;; i) Dinleyicilere ne anlatacağını dikkate alarak konuşur.;; j) Konuşmalarında benzetmelere yer verir.
T.K.1.3.|Konuşma kurallarını uygulayabilme|e) Konuşmalarını mimiklerle destekler.;; f) Konuşmalarını desteklemek için beden dilini kullanır.
T.K.1.4.|Konuşma sürecini değerlendirebilme|a) Konuşmasındaki hatalarını fark eder.;; b) Konuşmasında fark ettiği hataları düzeltir.;; c) Konuşmasındaki olumlu davranışları sonraki konuşmalarına aktarır.`;
  const T1_78b = `T.O.1.2.|Okudukları ile ilgili anlam oluşturabilme|a) Metni okurken ön bilgilerini kullanır.;; c) Okuyacağı metnin başlığından ve görsellerinden hareketle metnin konusu hakkında tahminde bulunur.;; ç) Okuduğu metindeki yönergeleri uygular.
T.O.1.3.|Okuduklarını çözümleyebilme|a) Okuduğu metnin konusunu bulur.
T.O.1.4.|Okuma sürecine etki eden durumları gözden geçirebilme|a) Okuduğu ortamın fiziksel özelliklerini açıklar.
T.O.1.5.|Okuma sürecini değerlendirebilme|a) Okuma sürecindeki hatalarını belirler.;; b) Okuma sürecinde belirlediği hatalarını düzeltir.;; c) Okuma sürecindeki olumlu davranışlarını sonraki okumalarına aktarır.
T.Y.1.1.|Yazılı anlatım becerilerini yönetebilme|c) Hece, sözcük veya cümleler yazar.;; ç) Kısa metinler yazar.;; e) Söylenen sözcük ve cümleleri yazar.;; f) Yazışmalarını selamlaşma ve hitap ifadeleriyle başlatır.
T.Y.1.2.|Yazılarında içerik oluşturabilme|b) Sözcük ve cümlelerde eksik bırakılan yerleri ön bilgileri doğrultusunda yazarak tamamlar.;; c) Yazılarını karşıdakinin iletilerinden yola çıkarak devam ettirir.;; ç) Yazılarında geçen nesneleri fiziksel özelliklerine göre karşılaştırır.;; d) Yazılarında nesneleri fiziksel özelliklerine göre sınıflandırır.;; f) Yazılı anlatımlarını zenginleştirmek için görseller kullanır.;; ğ) Muhatabına ne yazacağını dikkate alarak yazma çalışmaları yapar.;; h) Yazılarında benzetmelere yer verir.`;
  const Y14 = "T.Y.1.4.|Yazma sürecini değerlendirebilme|a) Yazılarında hatalarını bulur.;; b) Yazılarında belirlediği hataları düzeltir.;; c) Yazılarındaki uygun davranışları sonraki yazılarına aktarır.";
  const Y25 = "T.Y.2.5.|Yazma sürecini değerlendirebilme|a) Yazılarında hatalarını bulur.;; b) Yazılarında belirlediği hataları düzeltir.;; c) Yazılarındaki uygun davranışları sonraki yazılarına aktarır.";
  const Y45 = "T.Y.4.5.|Yazma sürecini değerlendirebilme|a) Yazılarında hatalarını bulur.;; b) Yazılarında belirlediği hataları düzeltir.;; c) Yazılarındaki uygun davranışları sonraki yazılarına aktarır.";
  const D21 = "T.D.2.1.|Dinlemeyi/izlemeyi yönetebilme|b) Dinleme kurallarına uygun olarak dinler.;; c) Dinleme esnasında konuşmaya dâhil olmak için uygun zamanda söz alır.";
  const K23 = "T.K.2.3.|Konuşma kurallarını uygulayabilme|a) Konuşmalarında konuşma hızını ayarlar.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) Konuşmalarında anlamlı ve kurallı cümleler kullanır.";
  const O21 = "T.O.2.1.|Okuma sürecini yönetebilme|a) Okuyacağı metnin başlığı ve görsellerini inceler.;; c) Kuralına uygun sesli ve sessiz okur.;; ç) Noktalama işaretlerine dikkat ederek okur.";
  const O22 = "T.O.2.2.|Okudukları ile ilgili anlam oluşturabilme|b) Okuyacağı metnin başlığından ve görsellerinden hareketle metnin konusu hakkında tahminde bulunur.;; c) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.";
  const K21 = "T.K.2.1.|Konuşmalarını yönetebilme|ç) Konuşma sırasında dinleyiciler ile göz teması kurar.;; d) İletişim sırasında uygun zamanda söz alır.";
  const D3 = "T.D.3.1.|Dinlemeyi/izlemeyi yönetebilme|c) Dinleme kurallarına uygun olarak dinler.;; ç) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.";
  const D33 = "T.D.3.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metindeki ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.";
  const K31 = "T.K.3.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; ç) Konuşma kurallarına uygun (ses düzeyi, nezaket ifadeleri, göz teması) bir biçimde iletişimi sürdürür.";
  const O31 = "T.O.3.1.|Okuma sürecini yönetebilme|a) Okuyacağı metnin başlığı ve görsellerini inceler.;; b) Noktalama işaretlerine dikkat ederek okur.";
  const O33 = "T.O.3.3.|Okuduklarını çözümleyebilme|a) Okuduğu metindeki karakter, olay, bilgi veya duyguları açıklar.;; b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metinde ana fikri/ana duyguyu bulur.";
  const D34 = "T.D.3.4.|Dinleme/izleme sürecine etki eden durumları gözden geçirebilme|a) Dinleme/izleme yapacağı ortamın uygunluğunu gözden geçirir.;; b) Dinleme/izleme ortamının dinleme sürecindeki duygu, düşünce ve davranışlarına etkisini açıklar.";
  const D41 = "T.D.4.1.|Dinlemeyi/izlemeyi yönetebilme|b) Dinleme kurallarına uygun olarak dinler.;; c) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.";
  const D43 = "T.D.4.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metindeki ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.";
  const D43f = "T.D.4.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metindeki ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.;; ç) Dinlediği/izlediği farklı metinlerdeki iletilerin benzerlik ve farklılıklarını belirler.;; d) Dinlediği/izlediği farklı metinlerdeki iletileri benzerlik ve farklılık yönüyle ilişkilendirir.";
  const D42a = "a) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.";
  const D42d = "d) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.";
  const K43 = "T.K.4.3.|Konuşma kurallarını uygulayabilme|c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; e) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; ğ) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; h) Konuşmalarında içeriğe uygun zaman ifadelerini kullanır.;; ı) Konuşmalarında anlamlı ve kurallı cümleler kullanır.";
  const O41 = "T.O.4.1.|Okuma sürecini yönetebilme|a) Okuma amacına ve ilgi alanına göre okuyacağı metni seçer.;; c) Noktalama işaretlerine dikkat ederek okur.";
  const O43 = "T.O.4.3.|Okuduklarını çözümleyebilme|a) Okuduğu metindeki karakter, olay, bilgi veya duyguları analiz eder.;; b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metindeki ana fikri/ana duyguyu bulur.";
  const O45 = "T.O.4.5.|Okuma sürecini değerlendirebilme|a) Okuma sürecinde belirlediği hatalarını düzeltir.;; b) Okuma sürecindeki olumlu davranışlarını sonraki okumalarına aktarır.";
  const Y41s = "T.Y.4.1.|Yazılı anlatım becerilerini yönetebilme|a) Serbest yazma çalışmaları yapar.;; b) Amacına uygun yazma stratejisini seçer.;; c) Belirlediği yazma ortamına (kâğıt/çevrim içi) uygun strateji seçer.;; ç) Seçtiği yazma stratejisine uygun yazma çalışması yapar.";
  const OJ = "j) Okuyacağı metnin başlığı ve görsellerinden hareketle metnin içeriği hakkında görüş oluşturur.";
  const OK = "k) Okuyacağı metnin biçimsel ve tanıtıcı özelliklerinden hareketle metnin içeriği hakkında görüş oluşturur.";
  const OC4 = "c) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.";
  const OÇ4 = "ç) Okuma sırasında metinde verilen bilgilerden hareketle metinde geçen bilgilerin/olayların öncesi ve sonrası hakkında tahminde bulunur.";

  const METIN = `S|1
TEMA|İlk Okuma Yazmaya Hazırlık
T.D.1.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|b) Dinlediği sesin kaynağını tahmin eder.
T.D.1.3.|Dinlediklerini/izlediklerini çözümleyebilme|a) Doğal ve yapay ses kaynaklarından çıkan sesleri ayırt eder.
T.Y.1.1.|Yazılı anlatım becerilerini yönetebilme|a) Yazma materyalini kurala uygun kullanır.;; b) Boyama ve çizgi çalışmaları yapar.
TEMA|Güzel Davranışlarımız
${D11}
${D12}
${D13}
${D14}
${K12}
T.K.1.3.|Konuşma kurallarını uygulayabilme|a) Öğrendiği ses, hece, sözcük veya cümleleri işitilebilir bir ses düzeyinde söyler.;; c) Dinlediğini/izlediğini telaffuza dikkat ederek anlatır.
T.O.1.1.|Okuma sürecini yönetebilme|a) Harf ve heceleri doğru seslendirir.;; b) Sözcükleri doğru okur.;; ç) Telaffuza dikkat ederek okur.;; d) Öğrendiği ses, hece, sözcük veya cümleleri işitilebilir bir ses düzeyinde okur.
${Y11}
${Y12}
T.Y.1.3.|Yazma kurallarını uygulayabilme|b) Harfleri temel formuna ve yazım yönlerine göre yazar.;; c) Rakamları temel formuna ve yazım yönlerine göre yazar.;; ç) Harf, sözcük veya cümleler arasında uygun boşluk bırakır.;; d) Harflerin büyük yazılışını yerinde kullanır.;; ı) Büyük harfleri kuralına uygun yazar.
TEMA|Mustafa Kemal'den Atatürk'e
${D11}
T.D.1.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Sese karşılık gelen sembolü/harfi tanır.;; c) Görselden/görsellerden hareketle dinleyeceği/izleyeceği hakkında tahminde bulunur.;; ç) Dinlediklerini yaşantı ve ön bilgileriyle karşılaştırarak çıkarımda bulunur.;; d) Dinlediği sesin bulunduğu sözcüklere örnekler verir.;; f) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.
${D13}
${D14}
${K12}
${K13}
${O11}
${Y11}
${Y12}
T.Y.1.3.|Yazma kurallarını uygulayabilme|b) Harfleri temel formuna ve yazım yönlerine göre yazar.;; c) Rakamları temel formuna ve yazım yönlerine göre yazar.;; ç) Harf, sözcük veya cümleler arasında uygun boşluk bırakır.;; d) Harflerin büyük yazılışını yerinde kullanır.;; ı) Büyük harfleri kuralına uygun yazar.;; k) ${N1}
TEMA|Çevremizdeki Yaşam
${D11}
${D12}
${D13}
${D14}
${K12};; g) Dinlediklerini, izlediklerini veya okuduklarını kendi cümleleriyle ifade eder.
${K13}
${O11}
${Y11}
${Y12}
T.Y.1.3.|Yazma kurallarını uygulayabilme|b) Harfleri temel formuna ve yazım yönlerine göre yazar.;; ç) Harf, sözcük veya cümleler arasında uygun boşluk bırakır.;; d) Harflerin büyük yazılışını yerinde kullanır.;; ı) Büyük harfleri kuralına uygun yazar.;; k) ${N1}
TEMA|Yol Arkadaşımız Kitaplar
${D11}
T.D.1.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Sese karşılık gelen sembolü/harfi tanır.;; c) Görselden/görsellerden hareketle dinleyeceği/izleyeceği metin hakkında tahminde bulunur.;; ç) Dinlediklerini yaşantı ve ön bilgileriyle karşılaştırarak çıkarımda bulunur.;; d) Dinlediği sesin bulunduğu sözcüklere örnekler verir.;; f) Dinledikleri/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.
T.D.1.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Sese karşılık gelen sembolü/harfi ayırt eder.;; c) Dinlediği/izlediği metnin konusunu bulur.
${D14}
${K12};; g) Dinlediklerini, izlediklerini veya okuduklarını kendi cümleleriyle ifade eder.
${K13}
${O11}
T.Y.1.1.|Yazılı anlatım becerilerini yönetebilme|c) Hece, sözcük veya cümleler yazar.
T.Y.1.3.|Yazma kurallarını uygulayabilme|b) Harfleri temel formuna ve yazım yönlerine göre yazar.;; ç) Harf, sözcük veya cümleler arasında uygun boşluk bırakır.;; d) Harflerin büyük yazılışını yerinde kullanır.;; ı) Büyük harfleri kuralına uygun yazar.;; k) ${N1}
TEMA|Yeteneklerimizi Keşfediyoruz
T.D.1.1.|Dinlemeyi/izlemeyi yönetebilme|c) Dinleme kurallarına uygun olarak dinler.
T.D.1.3.|Dinlediklerini/izlediklerini çözümleyebilme|c) Dinlediği/izlediği metnin konusunu bulur.
T.K.1.1.|Konuşmalarını yönetebilme|b) Konuşma sırasında dinleyiciler ile göz teması kurar.
T.K.1.2.|Konuşmalarında içerik oluşturabilme|c) Kendisi ve ailesi hakkında konuşmalar yapar.;; ç) Dinlediklerini/izlediklerini ifade ederken ön bilgilerini kullanır.;; h) İlgi alanına yönelik seçtiği bir konu hakkında konuşur.;; ı) Konuşmalarını desteklemek için görseller kullanır.
T.K.1.3.|Konuşma kurallarını uygulayabilme|b) Konuşmalarında konuşma hızını ayarlar.;; d) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.
T.O.1.1.|Okuma sürecini yönetebilme|e) Okuyacağı metnin başlığı ve görsellerini inceler.;; f) Kuralına uygun sesli ve sessiz okur.;; g) Anlaşılabilir ve uygun bir hızda sesli okur.;; h) Noktalama işaretlerine dikkat ederek okur.
T.O.1.2.|Okudukları ile ilgili anlam oluşturabilme|b) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; c) Okuyacağı metnin başlığından ve görsellerinden hareketle metnin konusu hakkında tahminde bulunur.
T.O.1.3.|Okuduklarını çözümleyebilme|a) Okuduğu metnin konusunu bulur.
T.Y.1.1.|Yazılı anlatım becerilerini yönetebilme|c) Hece, sözcük veya cümleler yazar.;; d) Verilen bir metni metne bakarak yazar.
T.Y.1.2.|Yazılarında içerik oluşturabilme|e) Dinlediği/izlediği veya okuduğu bir metindeki olayları oluş sırasına göre kendi ifadeleriyle yazar.;; g) Seçtiği görselden hareketle kısa bir metin yazar.
T.Y.1.3.|Yazma kurallarını uygulayabilme|e) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; h) Rakam ve sayıları kuralına uygun yazar.
TEMA|Minik Kâşifler
T.D.1.1.|Dinlemeyi/izlemeyi yönetebilme|c) Dinleme kurallarına uygun olarak dinler.;; ç) Dinleme esnasında konuşmaya dâhil olmak için uygun zamanda söz alır.
T.D.1.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|f) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.;; ğ) Dinlediklerindeki/izlediklerindeki nesneleri fiziksel özelliklerine göre sınıflandırır.
T.D.1.3.|Dinlediklerini/izlediklerini çözümleyebilme|c) Dinlediği/izlediği metnin konusunu bulur.
T.K.1.1.|Konuşmalarını yönetebilme|b) Konuşma sırasında dinleyiciler ile göz teması kurar.;; c) İletişim sırasında uygun zamanda söz alır.
T.K.1.2.|Konuşmalarında içerik oluşturabilme|ç) Dinlediklerini/izlediklerini ifade ederken ön bilgilerini kullanır.;; d) Görselden/görsellerden hareketle dinleyeceği/izleyeceği metin hakkında tahminde bulunur.
T.K.1.3.|Konuşma kurallarını uygulayabilme|d) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.
${ISL}
T.O.1.2.|Okudukları ile ilgili anlam oluşturabilme|b) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; c) Okuyacağı metnin başlığından ve görsellerinden hareketle metnin konusu hakkında tahminde bulunur.;; ç) Okuduğu metindeki yönergeleri uygular.
T.O.1.3.|Okuduklarını çözümleyebilme|a) Okuduğu metnin konusunu bulur.
T.Y.1.1.|Yazılı anlatım becerilerini yönetebilme|c) Hece, sözcük veya cümleler yazar.;; ç) Kısa metinler yazar.;; e) Söylenen sözcük ve cümleleri yazar.
T.Y.1.2.|Yazılarında içerik oluşturabilme|b) Sözcük ve cümlelerde eksik bırakılan yerleri ön bilgileri doğrultusunda yazarak tamamlar.;; f) Yazılı anlatımlarını zenginleştirmek için görseller kullanır.
T.Y.1.3.|Yazma kurallarını uygulayabilme|a) Anlamlı ve kurallı cümleler yazar.;; ç) Harf, sözcük veya cümleler arasında uygun boşluk bırakır.;; e) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; f) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.
TEMA|Atalarımızın İzleri
${T1_78("Dinlediği/izlediği metindeki iletilerin benzerliklerini belirler.")}
${ISL}
${T1_78b}
T.Y.1.3.|Yazma kurallarını uygulayabilme|a) Anlamlı ve kurallı cümleler yazar.;; d) Harflerin büyük yazılışını yerinde kullanır.;; e) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; f) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; g) Yazışmalarında mesajlarını açık ve anlaşılır şekilde ifade eder.;; i) Yazılarında harf, sözcük ve satırlar arasında uygun boşluk bırakır.;; j) Soru edatını (mı, mi) kuralına uygun yazar.;; k) ${N1}
${Y14}
TEMA|Sorumluluklarımızın Farkındayız
${T1_78("Dinlediği/izlediği farklı metinlerdeki iletilerin benzerliklerini belirler.")}
T.O.1.1.|Okuma sürecini yönetebilme|e) Okuyacağı metnin başlığı ve görsellerini inceler.;; f) Kuralına uygun sesli ve sessiz okur.;; g) Anlaşılabilir ve uygun bir hızda sesli okur.;; h) Noktalama işaretlerine dikkat ederek okur.
${T1_78b}
T.Y.1.3.|Yazma kurallarını uygulayabilme|e) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; f) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; g) Yazışmalarında mesajlarını açık ve anlaşılır şekilde ifade eder.;; ğ) Yazılarında anlamlı ve kurallı cümleler kullanır.;; i) Yazılarında harf, sözcük ve satırlar arasında uygun boşluk bırakır.;; j) Soru edatını (mı, mi) kuralına uygun yazar.;; k) ${N1}
${Y14}
S|2
TEMA|Değerlerimizle Varız
T.D.2.1.|Dinlemeyi/izlemeyi yönetebilme|a) Dinleyeceklerini/izleyeceklerini amacına ve ilgi alanına uygun olarak seçer.;; b) Dinleme kurallarına uygun olarak dinler.;; c) Dinleme esnasında konuşmaya dâhil olmak için uygun zamanda söz alır.
T.D.2.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; c) Dinlediklerinde/izlediklerinde geçen olayların öncesi hakkında tahminde bulunur.;; ç) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|a) Dinlediği/izlediği metindeki olayları belirler.;; b) Dinlediği/izlediği metnin konusunu bulur.
${K21}
T.K.2.2.|Konuşmalarında içerik oluşturabilme|a) Dinlediklerini/izlediklerini ifade ederken ön bilgilerini kullanır.;; e) Dinlediği/izlediği veya okuduğu bir metindeki olayları oluş sırasına göre kendi ifadeleriyle anlatır.;; h) Konuşmalarını desteklemek için görseller kullanır.
${K23}
${O21}
T.O.2.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Okuyacağı metnin başlığından ve görsellerinden hareketle metnin konusu hakkında tahminde bulunur.;; c) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.
T.O.2.3.|Okuduklarını çözümleyebilme|a) Okuduğu metindeki karakter, olay ve bilgileri açıklar.;; b) Okuduğu metnin konusunu bulur.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.
T.Y.2.2.|Yazılarında içerik oluşturabilme|a) Bir metinde eksik bırakılan cümleleri ön bilgilerini kullanarak yazar.;; b) Yarım bırakılan bir metni ön bilgilerinden hareketle yazar.;; c) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; f) Yazılarında sözcükleri anlamına uygun kullanır.;; g) Dinlediği/izlediği veya okuduğu bir metindeki olayları oluş sırasına göre kendi ifadeleriyle yazar.;; ğ) Basit yönergeler yazar.
T.Y.2.3.|Yazma kurallarını uygulayabilme|b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.;; g) Yazılarında yazım alanını uygun şekilde (yazıyı sayfaya hizalama, paragraf başı, satır sonuna sığmayan sözcükler vb.) kullanır.;; ğ) ${N2}
TEMA|Atatürk ve Çocuk
${D21}
T.D.2.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Dinlediklerini yaşantı ve ön bilgileriyle karşılaştırarak çıkarımda bulunur.;; b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; e) Dinlediklerindeki/izlediklerindeki iletileri doğruluk, gerçeklik açısından ön bilgileriyle karşılaştırır.;; ğ) Dinlediklerine/izlediklerine yönelik düşüncelerini ifade eder.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metnin konusunu bulur.
${K21};; e) Konuşmalarında selamlaşma ve hitap ile ilgili ifadeler kullanır.
T.K.2.2.|Konuşmalarında içerik oluşturabilme|b) Görsellerden hareketle olayların oluş sırası hakkında tahminlerde bulunur.;; c) Dinledikleri/izledikleri veya okudukları metinlerdeki kişilerin benzer ve farklı yönlerini açıklar.
${K23}
${O21}
T.O.2.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Okuyacağı metnin başlığından ve görsellerinden hareketle metnin konusu hakkında tahminde bulunur.;; c) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; d) Okuduğu metindeki iletileri ön bilgileri ile karşılaştırır.;; f) Okuduğu metindeki zıt anlamlı sözcükleri bulur.
T.O.2.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.
T.Y.2.2.|Yazılarında içerik oluşturabilme|c) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; ç) Eksik bırakılan bir metni tahminleri doğrultusunda yazarak tamamlar.;; f) Yazılarında sözcükleri anlamına uygun kullanır.;; l) Yazılarında örneklendirmeye yer verir.;; m) Dinlediği/izlediği veya okuduğu metindeki neden-sonuç ilişkisini yazar.
T.Y.2.3.|Yazma kurallarını uygulayabilme|b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.;; f) Büyük harfleri kuralına uygun yazar.;; ğ) ${N2}
TEMA|Doğada Neler Oluyor?
${D21}
T.D.2.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; g) Dinlediklerindeki/izlediklerindeki farklı nesne ve karakterleri özelliklerine göre sınıflandırır.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metnin konusunu bulur.
T.K.2.1.|Konuşmalarını yönetebilme|c) Konuşma amacına göre konuşmasını belirler.;; ç) Konuşma sırasında dinleyiciler ile göz teması kurar.;; d) İletişim sırasında uygun zamanda söz alır.
T.K.2.2.|Konuşmalarında içerik oluşturabilme|ç) Verilen görsellerden hareketle karakterleri veya nesneleri benzer özelliklerine göre sınıflandırarak anlatır.;; ğ) Dinlediği/izlediği veya okuduğu metindeki neden-sonuç ilişkisini söyler.
${K23}
T.K.2.5.|Konuşma sürecini değerlendirebilme|a) Konuşmasında fark ettiği hataları düzeltir.;; c) Konuşmasındaki olumlu davranışları sonraki konuşmalarına aktarır.
${O21}
${O22};; e) Okuduğu metindeki nesne ve kişileri özelliklerine göre sınıflandırır.;; g) Okuduğu metindeki iletilere katılıp katılmadığını ifade eder.
T.O.2.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.
T.Y.2.2.|Yazılarında içerik oluşturabilme|c) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; f) Yazılarında sözcükleri anlamına uygun kullanır.;; i) Yazılı anlatımlarını desteklemek için görseller kullanır.;; k) Yazılarında benzetmelere yer verir.
T.Y.2.3.|Yazma kurallarını uygulayabilme|b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.;; ç) Yazışmalarında mesajlarını birden çok cümleyle açık ve anlaşılır şekilde ifade eder.;; d) Soru edatını (mı, mi) kuralına uygun yazar.
TEMA|Okuma Serüvenimiz
${D21}
T.D.2.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; f) Dinlediği/izlediği metnin içindeki bilgileri doğruluk, gerçeklik açısından karşılaştırır.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metnin konusunu bulur.
T.D.2.4.|Dinleme/izleme sürecine etki eden durumları gözden geçirebilme|a) Dinleme/izleme yapacağı ortamın uygunluğunu gözden geçirir.
T.D.2.5.|Dinleme/izleme sürecini değerlendirebilme|a) Dinleme/izleme sürecindeki hatalarını belirler.;; b) Dinlemesinde/izlemesinde belirlediği hatalarını düzeltir.
${K21}
T.K.2.2.|Konuşmalarında içerik oluşturabilme|a) Dinlediklerini/izlediklerini ifade ederken ön bilgilerini kullanır.
T.K.2.3.|Konuşma kurallarını uygulayabilme|a) Konuşmalarında konuşma hızını ayarlar.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; d) Günlük hayatta karşılaştığı bir olayla ilgili düşüncelerini açık ve anlaşılır cümlelerle ifade eder.;; e) Konuşmalarında anlamlı ve kurallı cümleler kullanır.;; g) Konuşmalarını jest ve mimiklerle destekler.;; ğ) Konuşmalarını desteklemek için beden dilini kullanır.;; h) Konuşma sürecinde beden dilini yerinde kullanır.
${O21}
${O22}
T.O.2.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.;; ç) Okuduğu metindeki içerik ve görsel (tablo, grafik vb.) arasındaki ilişkiyi belirler.
T.O.2.4.|Okuma sürecine etki eden durumları gözden geçirebilme|b) Okuma yapacağı ortamın fiziksel özelliklerini dikkate alarak okur.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.
T.Y.2.2.|Yazılarında içerik oluşturabilme|f) Yazılarında sözcükleri anlamına uygun kullanır.
T.Y.2.3.|Yazma kurallarını uygulayabilme|b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.;; e) Kısaltmaları kuralına uygun yazar.
${Y25}
TEMA|Yeteneklerimizi Tanıyoruz
${D21}
T.D.2.2.|Dinledikleri ile ilgili anlam oluşturabilme|b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|a) Dinlediği/izlediği metindeki olayları belirler.;; b) Dinlediği/izlediği metnin konusunu bulur.;; c) Dinlediği/izlediği farklı metinlerdeki iletilerin benzerlik ve farklılıklarını belirler.
${K21};; f) Belirlenen bir konuda konuşma planı hazırlar.
T.K.2.2.|Konuşmalarında içerik oluşturabilme|a) Dinlediklerini/izlediklerini ifade ederken ön bilgilerini kullanır.
T.K.2.3.|Konuşma kurallarını uygulayabilme|a) Konuşmalarında konuşma hızını ayarlar.;; b) Dinleyici kitlesi ve konunun özelliğine göre hazırladığı plana uygun konuşur.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) Konuşmalarında anlamlı ve kurallı cümleler kullanır.;; h) Konuşma sürecinde beden dilini yerinde kullanır.
T.O.2.1.|Okuma sürecini yönetebilme|a) Okuyacağı metnin başlığı ve görsellerini inceler.;; b) Okuyacağı metni ilgi alanına göre seçer.;; c) Kuralına uygun sesli ve sessiz okur.;; ç) Noktalama işaretlerine dikkat ederek okur.
T.O.2.2.|Okumaları ile ilgili anlam oluşturabilme|b) Okuyacağı metnin başlığından ve görsellerinden hareketle metnin konusu hakkında tahminde bulunur.;; c) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.
T.O.2.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metindeki iletilerin benzerlik ve/veya farklılıklarını belirler.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.;; b) Verilen bir yazma görevini belirlediği yazı türüne göre yazar.;; c) Yazışmalarını selamlaşma ve hitap ifadeleriyle başlatır.;; ç) Yazışmalarını uygun ifadeleri kullanarak sonlandırır.
T.Y.2.2.|Yazılarında içerik oluşturabilme|f) Yazılarında sözcükleri anlamına uygun kullanır.;; g) Dinlediği/izlediği veya okuduğu bir metindeki olayları oluş sırasına göre kendi ifadeleriyle yazar.
T.Y.2.3.|Yazma kurallarını uygulayabilme|b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.;; ğ) ${N2}
T.Y.2.4.|Yazma sürecine etki eden durumları gözden geçirebilme|a) Yazma yapacağı ortamın uygunluğunu gözden geçirir.
TEMA|Mucit Çocuk
${D21}
T.D.2.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; c) Dinlediklerinde/izlediklerinde geçen olayların öncesi hakkında tahminde bulunur.;; ç) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metnin konusunu bulur.;; ç) Dinlediğindeki/izlediğindeki söylem ve görsel arasındaki ilişkiyi belirler.
${K21}
T.K.2.2.|Konuşmalarında içerik oluşturabilme|d) Konuşmalarında zıt anlamlı sözcükleri kullanır.
${K23};; f) Konuşmalarında bağlama ögelerini (ile, ve, ama, çünkü) doğru kullanır.
T.K.2.4.|Konuşma sürecine etki eden durumları gözden geçirebilme|a) Konuşma yapacağı ortamın uygunluğunu gözden geçirir.
${O21}
${O22};; ç) Okuduğu metindeki verilerden yararlanarak içeriğe uygun çıkarımlar yapar.
T.O.2.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.
T.Y.2.2.|Yazılarında içerik oluşturabilme|d) Yazılarında kişi ve nesneleri benzerlik ve/veya farklılık bakımından karşılaştırır.;; e) Verilen görsellerden hareketle karakterleri veya nesneleri benzer özelliklerine göre sınıflandırarak yazar.;; f) Yazılarında sözcükleri anlamına uygun kullanır.
T.Y.2.3.|Yazma kurallarını uygulayabilme|b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.
TEMA|Kültür Hazinemiz
${D21}
T.D.2.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; d) Dinlediklerindeki/izlediklerindeki iletilerden ilgi alanına uygun çıkarımlar yapar.;; e) Dinlediklerindeki/izlediklerindeki iletileri doğruluk, gerçeklik açısından ön bilgileriyle karşılaştırır.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metnin konusunu bulur.
T.K.2.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; ç) Konuşma sırasında dinleyiciler ile göz teması kurar.;; d) İletişim sırasında uygun zamanda söz alır.
T.K.2.2.|Konuşmalarında içerik oluşturabilme|f) Dinlediği/izlediği bir olaydaki veya okuduğu bir metindeki görüşlere katılıp katılmadığını nedenleriyle ifade eder.;; g) Konuşmalarında benzetmelere yer verir.
${K23}
${O21}
${O22}
T.O.2.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.
T.O.2.5.|Okuma sürecini değerlendirebilme|a) Okuma sürecindeki hatalarını belirler.;; b) Okuma sürecinde belirlediği hatalarını düzeltir.;; c) Okuma sürecindeki olumlu davranışlarını sonraki okumalarına aktarır.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.
T.Y.2.2.|Yazılarında içerik oluşturabilme|ğ) Basit yönergeler yazar.;; h) Dinlediği/izlediği veya okuduğu bir metindeki görüşlere katılıp katılmadığını nedenleriyle yazar.
T.Y.2.3.|Yazma kurallarını uygulayabilme|b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.
TEMA|Haklarımızı Biliyoruz
${D21}
T.D.2.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|b) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; g) Dinlediklerindeki/izlediklerindeki farklı nesne ve karakterleri özelliklerine göre sınıflandırır.
T.D.2.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metnin konusunu bulur.
T.D.2.5.|Dinleme/izleme sürecini değerlendirebilme|a) Dinleme/izleme sürecindeki hatalarını belirler.;; b) Dinlemesinde/izlemesinde belirlediği hataları düzeltir.;; c) Dinlemesindeki/izlemesindeki uygun davranışlarını sonraki dinlemelerine aktarır.
T.K.2.1.|Konuşmalarını yönetebilme|b) Konuşma türüne göre konuşmasını belirler.;; ç) Konuşma sırasında dinleyiciler ile göz teması kurar.;; d) İletişim sırasında uygun zamanda söz alır.
T.K.2.2.|Konuşmalarında içerik oluşturabilme|a) Dinlediklerini/izlediklerini ifade ederken ön bilgilerini kullanır.
${K23}
T.K.2.5.|Konuşma sürecini değerlendirebilme|a) Konuşmasında fark ettiği hataları düzeltir.;; b) Konuşmasındaki olumlu davranışları fark eder.;; c) Konuşmasındaki olumlu davranışları sonraki konuşmalarına aktarır.
${O21}
${O22}
T.O.2.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.
T.O.2.4.|Okuma sürecine etki eden durumları gözden geçirebilme|a) Okuduğu ortamın okumasına etkisini açıklar.
T.O.2.5.|Okuma sürecini değerlendirebilme|c) Okuma sürecindeki olumlu davranışlarını sonraki okumalarına aktarır.
T.Y.2.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevini hazırlık yaparak yazar.;; d) Belirlenen bir konuda yazma planı hazırlar.
T.Y.2.2.|Yazılarında içerik oluşturabilme|f) Yazılarında sözcükleri anlamına uygun kullanır.;; ı) İstek ve önerilerini yazarak (tebrik, mektup ve anlık ileti) ifade eder.;; j) Görsellerle destekleyerek oluşturduğu mektup, anlık ileti türlerindeki yazılarını sunar.
T.Y.2.3.|Yazma kurallarını uygulayabilme|a) Hedef kitle ve konunun özelliğine göre hazırladığı plana uygun yazar.;; b) Anlamını bilmediği sözcüğün anlamını çevrim içi veya basılı kaynaklardan araştırarak yazar.;; c) Yazılarında sözcükleri yerinde kullanır.
S|3
TEMA|Değerlerimizle Yaşıyoruz
${D3}
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|c) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.;; ç) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; ğ) Dinlediklerine/izlediklerine yönelik düşüncelerini nedenleriyle ifade eder.;; h) Dinlediklerindeki/izlediklerindeki iletilere ilişkin önerilerde bulunur.
${D33}
${K31}
T.K.3.2.|Konuşmalarında içerik oluşturabilme|a) Konuşmanın içeriğine uygun olarak yaşantı ve ön bilgilerinden örnekler verir.;; b) Dinlediği bir konuşmanın nasıl sonuçlanacağına dair tahminlerde bulunur.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; g) Konuşmalarında anlamlı ve kurallı cümleler kullanır.
${O31}
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; ç) Okuma sırasında metinde verilen bilgilerden ve görsellerden hareketle metinde geçen bilgilerin/olayların sırası hakkında tahminde bulunur.;; ${OJ}
T.O.3.3.|Okuduklarını çözümleyebilme|a) Okuduğu metindeki karakter, olay, bilgi veya duyguları açıklar.;; b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metindeki ana fikri/ana duyguyu bulur.
T.Y.3.2.|Yazılarında içerik oluşturabilme|b) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; g) Dinlediği/izlediği bir olayı veya okuduklarını kendi ifadeleriyle yazar.
T.Y.3.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; f) Büyük harfleri kuralına uygun yazar.;; g) ${N3}
TEMA|Atatürk ve Kahramanlarımız
${D3}
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; ç) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; e) Dinlediklerindeki/izlediklerindeki iletileri doğruluk, gerçeklik açısından ön bilgileriyle karşılaştırır.;; f) Dinlediği/izlediği metnin içindeki bilgileri doğruluk, gerçeklik açısından karşılaştırır.
T.D.3.3.|Dinlediklerini/izlediklerini çözümleyebilme|a) Dinlediği/izlediği metindeki olayları belirler.;; b) Dinlediği/izlediği metindeki ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.
${K31}
T.K.3.2.|Konuşmalarında içerik oluşturabilme|l) Dinlediği/izlediği veya okuduğu metindeki neden-sonuç ilişkisini söyler.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; h) Konuşmalarını jest ve mimiklerle destekler.;; ı) Konuşma sürecinde beden dilini yerinde kullanır.
${O31}
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; d) Okuma sırasında metinde verilen bilgilerden ve görsellerden hareketle metinde geçen bilgilerin/olayların sonrası hakkında tahminde bulunur.;; f) Okuduğu metindeki iletileri ön bilgileri ile karşılaştırır.;; g) Okuduğu metindeki iletileri metnin içindeki diğer bilgilerle karşılaştırır.;; ğ) Okuduğu metindeki olay, nesne ve kişileri özelliklerine göre sınıflandırır.;; h) Okuduğu metindeki zıt ve eş anlamlı sözcükleri bulur.;; ${OJ}
T.O.3.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metinde ana fikri/ana duyguyu bulur.
T.Y.3.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevine uygun biçimde hazırlıksız yazı yazar.;; c) Yazışmalarını içeriğe ve amacına uygun ifadelerle sürdürür.;; e) İmzasında adını ve soyadını özgün bir şekilde kullanır.
T.Y.3.2.|Yazılarında içerik oluşturabilme|b) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; ç) Yazılarında kişi ve nesneleri benzerlik ve/veya farklılık bakımından karşılaştırır.;; e) Yazılarında zıt anlamlı sözcükleri kullanır.
T.Y.3.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; d) Kısaltmalara gelen ekleri kuralına uygun yazar.;; g) ${N3}
TEMA|Doğayı Tanıyoruz
${D3}
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; b) Dinlediklerinde/izlediklerinde geçen olayların öncesi hakkında tahminde bulunur.;; ç) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; g) Dinledikleri ve izlediklerindeki farklı durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; ı) Dinlediklerine/izlediklerine ilişkin düşüncelerini sözlü ve sözsüz iletişim unsurları ile ifade eder.
${D33}
T.D.3.5.|Dinleme/izleme sürecini değerlendirebilme|c) Dinlemesindeki/izlemesindeki uygun davranışlarını sonraki dinlemelerine aktarır.
T.K.3.1.|Konuşmalarını yönetebilme|ç) Konuşma kurallarına uygun (ses düzeyi, nezaket ifadeleri, göz teması) bir biçimde iletişimi sürdürür.
T.K.3.2.|Konuşmalarında içerik oluşturabilme|ç) Dinledikleri/izledikleri veya okudukları metinlerdeki nesne ve kişileri karşılaştırır.;; d) Konuşmalarında farklı karakter, olay ve nesneleri özelliklerine göre sınıflandırır.;; e) Konuşmalarında zıt anlamlı sözcükleri kullanır.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; f) Konuşmalarında içeriğe uygun zaman ifadelerini kullanır.
T.K.3.5.|Konuşma sürecini değerlendirebilme|a) Başkalarının konuşmalarındaki hataları fark eder.
T.O.3.1.|Okuma sürecini yönetebilme|a) Okuyacağı metnin başlığı ve görsellerini inceler.
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; c) Okuduğu metinde geçen bilgilerin/olayların öncesi hakkında tahminde bulunur.;; ${OJ}
T.O.3.3.|Okuduklarını çözümleyebilme|a) Okuduğu metindeki karakter, olay, bilgi veya duyguları açıklar.;; b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metindeki ana fikri/ana duyguyu bulur.
T.O.3.5.|Okuma sürecini değerlendirebilme|a) Okuma sürecinde belirlediği hatalarını düzeltir.;; b) Okuma sürecindeki olumlu davranışlarını sonraki okumalarına aktarır.
T.Y.3.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevine uygun biçimde hazırlıksız yazı yazar.;; f) Belirlenen bir konuda yazma planı hazırlar.
T.Y.3.2.|Yazılarında içerik oluşturabilme|a) Metnin eksik bırakılan bölümlerini ön bilgilerinden hareketle devam ettirir.;; d) Yazılarında karakter, olay ve nesneleri özelliklerine göre sınıflandırır.;; f) Yazılarında eş anlamlı sözcükleri kullanır.;; ğ) Ayrıntılı yönergeler yazar.
T.Y.3.3.|Yazma kurallarını uygulayabilme|a) Hedef kitle ve konunun özelliğine göre hazırladığı plana uygun yazar.;; b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; f) Büyük harfleri kuralına uygun yazar.;; g) ${N3}
TEMA|Bilgi Hazinemiz
${D3}
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; ç) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.
T.D.3.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metindeki ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.;; ç) Dinlediği/izlediği farklı metinlerdeki iletilerin benzerlik ve farklılıklarını belirler.;; d) Dinlediği/izlediği farklı metinlerdeki iletileri benzerlik ve farklılık yönüyle ilişkilendirir.
${K31}
T.K.3.2.|Konuşmalarında içerik oluşturabilme|f) Konuşmalarında eş anlamlı sözcükler kullanır.;; g) Dinlediklerini, izlediklerini veya okuduklarını mantıksal ilişkilere bağlı olarak kendi cümleleriyle ifade eder.;; ğ) Sözlü iletişimde katılmadığı görüşlere ilişkin nedenleri ifade eder.;; i) Konuşmalarında örneklendirmelere yer verir.;; l) Dinlediği/izlediği veya okuduğu metindeki neden-sonuç ilişkisini söyler.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; ğ) Konuşmalarında bağlama ögelerini (ile, ve, veya, ya da, ama, çünkü) doğru kullanır.
${O31}
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; ç) Okuma sırasında metinde verilen bilgilerden ve görsellerden hareketle metinde geçen bilgilerin/olayların sırası hakkında tahminde bulunur.;; ${OJ}
T.O.3.3.|Okuduklarını çözümleyebilme|a) Okuduğu metindeki karakter, olay, bilgi veya duyguları açıklar.;; b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metindeki ana fikri/ana duyguyu bulur.;; ç) Okuduğu metindeki iletileri benzerlik ve/veya farklılık yönüyle ilişkilendirir.
T.Y.3.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevine uygun biçimde hazırlıksız yazı yazar.;; ç) Yazışmayı başlatma, sürdürme ve sonlandırmayla ilgili uygun ifadeler kullanır.
T.Y.3.2.|Yazılarında içerik oluşturabilme|ı) İstek, şikâyet ve önerilerini yazarak (mektup, dilekçe, tebrik, anlık ileti) ifade eder.;; o) Dinlediği/izlediği veya okuduğu metindeki neden-sonuç ilişkisini yazar.
T.Y.3.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; g) ${N3}
T.Y.3.5.|Yazma sürecini değerlendirebilme|a) Yazılarında hatalarını bulur.;; b) Yazılarında belirlediği hataları düzeltir.;; c) Yazılarındaki uygun davranışları sonraki yazılarına aktarır.
TEMA|Yeteneklerimizi Kullanıyoruz
T.D.3.1.|Dinlemeyi/izlemeyi yönetebilme|a) Dinleyeceklerini/izleyeceklerini amacına ve ilgi alanına uygun olarak seçer.;; c) Dinleme kurallarına uygun olarak dinler.;; ç) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|ç) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; d) Dinlediklerindeki/izlediklerindeki iletilerden amacına ve ilgi alanına uygun çıkarımlar yapar.
T.D.3.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metindeki ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.;; e) Dinlediğindeki/izlediğindeki söylem ve görsel arasındaki ilişkiyi açıklar.
${K31};; d) Belirlenen bir konuda konuşma planı hazırlar.
T.K.3.2.|Konuşmalarında içerik oluşturabilme|ı) Konuşmalarında benzetmelere yer verir.;; k) Dinleyici grubunun özelliklerini dikkate alarak belirli bir konuda sunum yapar.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; b) Dinleyici kitlesi ve konunun özelliğine göre hazırladığı plana uygun konuşur.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; h) Konuşmalarını jest ve mimiklerle destekler.;; ı) Konuşma sürecinde beden dilini yerinde kullanır.
${O31}
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; d) Okuma sırasında metinde verilen bilgilerden ve görsellerden hareketle metinde geçen bilgilerin/olayların sonrası hakkında tahminde bulunur.;; e) Okuduğu metindeki verilerden yararlanarak metnin amacına uygun çıkarım yapar.
${O33}
T.Y.3.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevine uygun biçimde hazırlıksız yazı yazar.
T.Y.3.2.|Yazılarında içerik oluşturabilme|b) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; c) Dinlediği/izlediği veya okuduğu bir metne ilişkin çıkarımlarını planlı bir biçimde yazar.;; j) Edindiği bilginin kaynağını yazar.;; k) Hedef kitleye görsellerle desteklenmiş açıklayıcı türdeki yazılarını sunar.;; m) Dijital araçları kullanarak hedef kitleye uygun türde yazılarını sunar.;; n) Yazılarında benzetme ve örneklendirmeye yer verir.
T.Y.3.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; g) ${N3}
TEMA|Bilim Yolculuğu
T.D.3.1.|Dinlemeyi/izlemeyi yönetebilme|a) Dinleyeceklerini/izleyeceklerini amacına ve ilgi alanına uygun olarak seçer.;; b) Konuya ve amacına uygun olarak dinleme/izleme stratejisini seçer.;; c) Dinleme kurallarına uygun olarak dinler.;; ç) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; ç) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.
T.D.3.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metinde ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.
${D34}
T.D.3.5.|Dinleme/izleme sürecini değerlendirebilme|a) Dinlemelerinde/izlemelerinde tercih ettiği dinleme/izleme stratejilerini açıklar.
T.K.3.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; b) Konuşma türüne göre konuşmasını belirler.;; c) Konuşma amacına göre konuşmasını belirler.;; ç) Konuşma kurallarına uygun (ses düzeyi, nezaket ifadeleri, göz teması) bir biçimde iletişimi sürdürür.
T.K.3.2.|Konuşmalarında içerik oluşturabilme|m) Sık karşılaşılan atasözlerinin anlamlarını söyler.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; d) Sık karşılaşılan atasözlerini konuşma bağlamına uygun kullanır.
T.O.3.1.|Okuma sürecini yönetebilme|a) Okuyacağı metnin başlığı ve görsellerini inceler.;; b) Noktalama işaretlerine dikkat ederek okur.;; c) Okuyacağı metni ilgi alanına ve amacına göre seçer.;; ç) Okuyacağı konuya veya okuma amacına göre okuma stratejisine karar verir.
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; c) Okuduğu metinde geçen bilgilerin/olayların öncesi hakkında tahminde bulunur.;; ı) Okuduğu metindeki iletilere katılıp katılmadığını nedenleriyle ifade eder.;; i) Okuduğu metindeki içeriğe ilişkin farklı önerilerde bulunur.;; ${OJ}
${O33};; d) Gerçek ve mecaz anlamlı sözcüklerin metinle ilişkisini belirler.
T.O.3.5.|Okuma sürecini değerlendirebilme|c) Tür veya ilgi alanına göre okuma tercihini belirtir.
T.Y.3.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevine uygun biçimde hazırlıksız yazı yazar.;; b) Verilen bir yazma görevini belirlediği yazı türüne göre yazar.;; d) Çevrim içi yazılarında yazışmayı başlatma, sürdürme ve sonlandırmayla ilgili uygun ifadeler kullanır.
T.Y.3.2.|Yazılarında içerik oluşturabilme|b) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; ı) İstek, şikâyet ve önerilerini yazarak (mektup, dilekçe, tebrik, anlık ileti) ifade eder.
T.Y.3.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; c) Yazılarında sık karşılaşılan deyim ve atasözlerini içeriğe uygun kullanır.;; ç) Yazışmalarında/çevrim içi yazışmalarında mesajlarını birden çok cümleyle açık ve anlaşılır şekilde ifade eder.;; g) ${N3}
TEMA|Millî Kültürümüz
T.D.3.1.|Dinlemeyi/izlemeyi yönetebilme|b) Konuya ve amacına uygun olarak dinleme/izleme stratejisini seçer.;; c) Dinleme kurallarına uygun olarak dinler.;; ç) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; ç) Dinlediklerindeki/izlediklerindeki bilgiler ile ön bilgileri arasında bağlantı kurar.
${D33}
${D34}
T.D.3.5.|Dinleme/izleme sürecini değerlendirebilme|a) Dinlemelerinde/izlemelerinde tercih ettiği dinleme/izleme stratejilerini açıklar.
${K31}
T.K.3.2.|Konuşmalarında içerik oluşturabilme|c) Bir konu hakkında hazırladığı konuşma planına uygun konuşur.;; ğ) Sözlü iletişimde katılmadığı görüşlere ilişkin nedenleri ifade eder.;; h) Sözlü iletişimde katılmadığı görüşlere ilişkin önerilerde bulunur.;; j) Görsellerden hareketle konuşma içeriği oluşturur.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.
T.O.3.1.|Okuma sürecini yönetebilme|a) Okuyacağı metnin başlığı ve görsellerini inceler.;; b) Noktalama işaretlerine dikkat ederek okur.;; c) Okuyacağı metni ilgi alanına ve amacına göre seçer.;; ç) Okuyacağı konuya veya okuma amacına göre okuma stratejisine karar verir.
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; ı) Okuduğu metindeki iletilere katılıp katılmadığını nedenleriyle ifade eder.;; i) Okuduğu metindeki içeriğe ilişkin farklı önerilerde bulunur.;; ${OJ}
${O33}
T.Y.3.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevine uygun biçimde hazırlıksız yazı yazar.
T.Y.3.2.|Yazılarında içerik oluşturabilme|h) Yazılı iletişimde katılmadığı görüşlere ilişkin önerilerde bulunur.;; i) Yazılı anlatımlarının içeriğini oluşturmak için görseller kullanır.;; l) Hedef kitleye görsellerle desteklenmiş öyküleyici türdeki yazılarını sunar.
T.Y.3.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; g) ${N3}
TEMA|Hak ve Sorumluluklarımız
${D3}
T.D.3.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|a) Görsellerden hareketle dinleyeceği/izleyeceği metnin konusunu tahmin eder.;; ç) Dinlediklerindeki/izlediklerindeki bilgilerle ön bilgileri arasında bağlantı kurar.
T.D.3.3.|Dinlediklerini/izlediklerini çözümleyebilme|b) Dinlediği/izlediği metinde ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.
${D34}
T.D.3.5.|Dinleme/izleme sürecini değerlendirebilme|b) Dinleyecekleri/izleyecekleri türü tercih nedenleri ile belirtir.
${K31}
T.K.3.2.|Konuşmalarında içerik oluşturabilme|b) Dinlediği bir konuşmanın nasıl sonuçlanacağına dair tahminlerde bulunur.
T.K.3.3.|Konuşma kurallarını uygulayabilme|a) Konuşmanın özelliğine uygun olarak ses düzeyini ayarlar.;; ç) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.
T.K.3.4.|Konuşma sürecine etki eden durumları gözden geçirebilme|a) Konuşma yapacağı ortamın uygunluğunu gözden geçirir.;; b) Konuşma ortamının konuşma sürecindeki duygu, düşünce ve davranışlarına etkisini açıklar.
T.K.3.5.|Konuşma sürecini değerlendirebilme|b) Konuşmasındaki olumlu davranışları sonraki konuşmalarına aktarır.
${O31}
T.O.3.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Metnin başlığı ve görsellerinden hareketle metinde geçen bilgiler/olaylar hakkında tahminde bulunur.;; ${OJ}
${O33};; e) Okuduğu metindeki noktalama işaretlerinin içerikle ilişkisini belirler.
T.O.3.4.|Okuma sürecine etki eden durumları gözden geçirebilme|a) Okuma yapacağı ortamın uygunluğunu değerlendirir.;; b) Okuma yapacağı ortamın fiziksel özelliklerini dikkate alarak okur.
T.O.3.5.|Okuma sürecini değerlendirebilme|ç) Basılı materyali okuma sürecindeki olumlu davranışlarını çevrim içi okuma sürecine aktarır.
T.Y.3.1.|Yazılı anlatım becerilerini yönetebilme|a) Verilen bir yazma görevine uygun biçimde hazırlıksız yazı yazar.
T.Y.3.2.|Yazılarında içerik oluşturabilme|b) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; ğ) Ayrıntılı yönergeler yazar.
T.Y.3.3.|Yazma kurallarını uygulayabilme|a) Hedef kitle ve konunun özelliğine göre hazırladığı plana uygun yazar.;; b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) Pekiştirmeli sözcükleri doğru yazar.;; g) ${N3}
T.Y.3.4.|Yazma sürecine etki eden durumları gözden geçirebilme|a) Yazma yapacağı ortamın uygunluğunu gözden geçirir.;; b) Yazma ortamının yazma sürecindeki duygu, düşünce ve davranışlarına etkisini açıklar.
S|4
TEMA|Erdemler
${D41}
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42a};; b) Dinlediği/izlediği metnin günlük yaşamla bağlantısını kurar.;; ç) Dinlediklerinde/izlediklerinde geçen olayların sonrası hakkında tahminde bulunur.;; ${D42d};; h) Dinlediklerine/izlediklerine katılıp katılmadığını nedenleriyle ifade eder.;; ı) Dinlediklerinde/izlediklerinde kabul etmediği konulara ilişkin önerilerde bulunur.
${D43}
T.K.4.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; ç) Yüz yüze iletişimde konuşma kurallarına uygun biçimde iletişimi sürdürür.;; e) Yüz yüze iletişim sürecini uygun nezaket ifadelerini kullanarak sürdürür.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|a) Belirlenen bir konu hakkında konuşurken yaşantı ve ön bilgilerinden yararlanır.;; c) Dinlediklerindeki/izlediklerindeki yarım kalan bir konuşmayı tahminleri ile devam ettirir.
T.K.4.3.|Konuşma kurallarını uygulayabilme|a) Konuşmalarında sesinin düzeyini dikkat çekmek amacıyla kullanır.;; ç) Belirli bir konuda beden dilini, ses tonunu ve dinleyici özelliklerini dikkate alarak sunum yapar.;; ğ) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; h) Konuşmalarında içeriğe uygun zaman ifadelerini kullanır.;; ı) Konuşmalarında anlamlı ve kurallı cümleler kullanır.
${O41}
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; b) Okuduğu metnin günlük yaşamla bağlantısını kurar.;; ${OC4};; ${OÇ4};; ${OJ};; ${OK}
T.O.4.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metindeki ana fikri/ana duyguyu bulur.
T.Y.4.1.|Yazılı anlatım becerilerini yönetebilme|a) Serbest yazma çalışmaları yapar.;; b) Amacına uygun yazma stratejisini seçer.;; c) Belirlediği yazma ortamına (kâğıt/çevrim içi) uygun strateji seçer.;; ç) Seçtiği yazma stratejisine uygun yazma çalışması yapar.
T.Y.4.2.|Yazılarında içerik oluşturabilme|c) Dinlediği/izlediği veya okuduğu metnin günlük yaşamla ilişkisini yazar.;; ç) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; j) Dinlediği/izlediği bir olayı veya okuduğu bir metni mantıksal ilişkilere uygun şekilde kendi ifadeleriyle yazar.;; m) Dinledikleri/izledikleri veya okuduklarındaki görüşlere katılma veya katılmama kararını nedenleriyle yazar.
T.Y.4.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; d) Yazım kurallarına uygun yazar.;; e) ${N3}
T.Y.4.4.|Yazma sürecine etki eden durumları gözden geçirebilme|a) Yazma ortamının yazma sürecindeki duygu, düşünce ve davranışlarına etkisini açıklar.;; b) Yazma yapacağı ortamın fiziksel özelliklerini dikkate alarak yazar.
${Y45}
TEMA|Millî Mücadele ve Atatürk
T.D.4.1.|Dinlemeyi/izlemeyi yönetebilme|b) Dinleme kurallarına uygun olarak dinler.
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42a};; ${D42d};; f) Dinlediklerindeki/izlediklerindeki iletileri doğruluk, gerçeklik açısından ön bilgileriyle karşılaştırır.;; g) Dinlediği/izlediği metnin içindeki bilgileri doğruluk, gerçeklik açısından karşılaştırır.
T.D.4.3.|Dinlediklerini/izlediklerini çözümleyebilme|a) Dinlediği/izlediği metindeki olayları belirler.;; b) Dinlediği/izlediği metindeki ana fikri/ana duyguyu bulur.;; c) Dinlediği/izlediği metnin konusunu bulur.
T.K.4.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; ç) Yüz yüze iletişimde konuşma kurallarına uygun biçimde iletişimi sürdürür.;; d) Çevrim içi iletişimde konuşma kurallarına uygun biçimde iletişimi sürdürür.;; f) Çevrim içi iletişim sürecini uygun nezaket ifadelerini kullanarak sürdürür.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|i) Dinledikleri/izledikleri veya okuduklarındaki görüşlere katılma veya katılmama kararını nedenleriyle ifade eder.
${K43}
${O41}
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|${OC4};; ${OÇ4};; f) Okuduğu metindeki iletileri ön bilgileriyle karşılaştırır.;; g) Okuduğu metindeki iletileri değerlendirir.;; h) Okuduğu metindeki eş anlamlı, zıt anlamlı veya eş sesli sözcükleri sınıflandırır.;; ${OJ};; ${OK}
T.O.4.3.|Okuduklarını çözümleyebilme|b) Okuduğu metnin konusunu bulur.;; c) Okuduğu metindeki ana fikri/ana duyguyu bulur.
T.Y.4.1.|Yazılı anlatım becerilerini yönetebilme|a) Serbest yazma çalışmaları yapar.;; f) İmzasında adını ve soyadını özgün bir şekilde kullanır.
T.Y.4.2.|Yazılarında içerik oluşturabilme|b) Ön bilgilerinden hareketle metin yazar.;; c) Dinlediği, izlediği veya okuduğu metnin günlük yaşamla ilişkisini yazar.;; ç) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; h) Yazılarında zıt anlamlı sözcükleri kullanır.;; i) Yazılarında eş sesli sözcükleri kullanır.;; m) Dinledikleri/izledikleri veya okuduklarındaki görüşlere katılma veya katılmama kararını nedenleriyle yazar.;; n) Serbest yazma çalışmalarında görüş ve düşüncelerini nedenleriyle açıklar.;; t) Yazılarında benzetme ve örneklendirmeye yer verir.
T.Y.4.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) ${N3}
${Y45}
TEMA|Doğa ve İnsan
${D41}
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42a};; c) Dinlediklerinde/izlediklerinde geçen olayların öncesi hakkında tahminde bulunur.;; ${D42d};; e) Dinledikleri/izledikleri içerikten hareketle uygun çıkarımlar yapar.;; ğ) Dinlediklerindeki/izlediklerindeki olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; i) Dinlediklerine/izlediklerine ilişkin düşüncelerini sözlü ve sözsüz iletişim unsurları ile ifade eder.
${D43f}
T.K.4.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; ç) Yüz yüze iletişimde konuşma kurallarına uygun biçimde iletişimi sürdürür.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|b) Dinlediği, izlediği veya okuduğu metnin günlük yaşamla ilişkisini ifade eder.;; d) Konuşmalarında dinlediklerinden/izlediklerinden veya okuduğu metinlerden yola çıkarak nesne ve kişileri karşılaştırır.;; e) Konuşmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; f) Çevrim içi konuşmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; g) Konuşmalarında zıt anlamlı sözcükleri kullanır.;; i) Dinledikleri/izledikleri veya okuduklarındaki görüşlere katılma veya katılmama kararını nedenleriyle ifade eder.
${K43}
${O41}
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; ${OC4};; ${OÇ4};; ğ) Okuduklarındaki olay, durum, nesne ve kişileri özelliklerine göre sınıflandırır.;; ${OJ};; ${OK}
${O43}
${O45}
${Y41s}
T.Y.4.2.|Yazılarında içerik oluşturabilme|a) Metnin eksik bırakılan bölümlerini ön bilgilerinden hareketle devam ettirir.;; c) Dinlediği, izlediği veya okuduğu metnin günlük yaşamla ilişkisini yazar.;; g) Yazışmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; ı) Yazılarında eş anlamlı sözcükleri kullanır.;; k) Ayrıntılı yönergeler yazar.
T.Y.4.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; e) ${N3}
TEMA|Kütüphanemiz
T.D.4.1.|Dinlemeyi/izlemeyi yönetebilme|a) Konuya, amacına ve ilişkinin türüne uygun olarak dinleme/izleme stratejisini seçer.;; b) Dinleme kurallarına uygun olarak dinler.;; c) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42a};; ${D42d}
${D43}
T.D.4.5.|Dinleme/izleme sürecini değerlendirebilme|b) Dinlediği/izlediği metinde verilen bilginin ve kaynağının doğruluğunu sorgular.;; c) Dinlemesindeki/izlemesindeki uygun davranışlarını sonraki dinlemelerine aktarır.
T.K.4.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; b) Konuşma türüne göre konuşmasını belirler.;; c) Konuşma amacına göre konuşmasını belirler.;; ç) Yüz yüze iletişimde konuşma kurallarına uygun biçimde iletişimi sürdürür.;; e) Yüz yüze iletişim sürecini uygun nezaket ifadelerini kullanarak sürdürür.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|ö) Sık karşılaşılan atasözlerinin anlamlarını söyler.
T.K.4.3.|Konuşma kurallarını uygulayabilme|c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; e) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; g) Atasözlerini konuşma bağlamına uygun kullanır.;; ğ) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; h) Konuşmalarında içeriğe uygun zaman ifadelerini kullanır.;; ı) Konuşmalarında anlamlı ve kurallı cümleler kullanır.
T.K.4.5.|Konuşma sürecini değerlendirebilme|a) Başkalarının konuşmalarındaki hataları fark eder.;; b) Başkalarının konuşmalarındaki hataları düzeltir.
${O41}
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|${OC4};; ${OÇ4};; d) Okuduğu metindeki verilerden yararlanarak ilgi alanına uygun çıkarım yapar.;; e) Okuduğu metindeki verilerden yararlanarak metnin amacına uygun çıkarım yapar.;; f) Okuduğu metindeki iletileri ön bilgileri ile karşılaştırır.;; ${OJ};; ${OK}
${O43};; d) Gerçek, mecaz ve terim anlamlı sözcüklerin metinle ilişkisini belirler.
T.O.4.5.|Okuma sürecini değerlendirebilme|ç) Tür veya ilgi alanına göre okuma tercihini belirtir.
T.Y.4.1.|Yazılı anlatım becerilerini yönetebilme|a) Serbest yazma çalışmaları yapar.;; d) Yazışmayı başlatma, sürdürme ve sonlandırmayla ilgili uygun ifadeler kullanır.;; e) Çevrim içi yazılarında yazışmayı başlatma, sürdürme ve sonlandırmayla ilgili uygun ifadeler kullanır.;; g) Yazacağı metnin türüne uygun yazma planı hazırlar.
T.Y.4.2.|Yazılarında içerik oluşturabilme|d) Dinlediği/izlediği veya okuduğu bir metne ilişkin çıkarımlarını planlı bir biçimde yazar.;; g) Yazışmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; j) Dinlediği, izlediği bir olayı veya okuduğu bir metni mantıksal ilişkilere uygun şekilde kendi ifadeleriyle yazar.;; l) Çevrim içi ortamda dijital mahremiyete dikkat ederek yazar.;; n) Serbest yazma çalışmalarında görüş ve düşüncelerini nedenleriyle açıklar.;; o) İstek, şikâyet ve önerilerini yazarak (mektup, dilekçe, tebrik, anlık ileti) ifade eder.;; p) Edindiği bilginin kaynağını yazar.;; r) Hedef kitleye görsellerle desteklenmiş açıklayıcı türdeki yazılarını sunar.;; s) Hedef kitleye görsellerle desteklenmiş öyküleyici türdeki yazılarını sunar.;; ş) Dijital araçları kullanarak hedef kitleye uygun türde yazılarını sunar.
T.Y.4.3.|Yazma kurallarını uygulayabilme|a) Yazacağı metin türünün özelliğine göre hazırladığı plana uygun yazar.;; b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; c) Yazılarında deyim ve atasözlerini içeriğe uygun kullanır.;; ç) Yazışmalarında/çevrim içi yazışmalarında mesajlarını birden çok cümleyle açık ve anlaşılır şekilde ifade eder.;; e) ${N3}
TEMA|Kendimizi Geliştiriyoruz
T.D.4.1.|Dinlemeyi/izlemeyi yönetebilme|c) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42a}
${D43f}
T.D.4.5.|Dinleme/izleme sürecini değerlendirebilme|b) Dinlediği/izlediği metinde verilen bilginin ve kaynağının doğruluğunu sorgular.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|ğ) Konuşmalarında eş anlamlı sözcükleri kullanır.;; ı) Dinlediklerini/izlediklerini veya okuduklarını mantıksal ilişkilere bağlı olarak kendi cümleleriyle ifade eder.;; m) Konuşmasında örneklendirmeye yer verir.
T.K.4.3.|Konuşma kurallarını uygulayabilme|d) Dinlediği/izlediği veya okuduğu metindeki neden-sonuç ilişkisini söyler.;; e) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; i) Konuşmalarında bağlama ögelerini (ile, ve, veya, ya da, ama, çünkü, de, ki) doğru kullanır.
T.O.4.1.|Okuma sürecini yönetebilme|c) Noktalama işaretlerine dikkat ederek okur.
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|${OÇ4};; ${OJ}
${O43};; ç) Okuduğu metindeki iletileri benzerlik ve/veya farklılık yönüyle ilişkilendirir.
T.O.4.5.|Okuma sürecini değerlendirebilme|c) Okuduğu metinde verilen bilginin ve kaynağının doğruluğunu sorgular.
T.Y.4.1.|Yazılı anlatım becerilerini yönetebilme|a) Serbest yazma çalışmaları yapar.;; d) Yazışmayı başlatma, sürdürme ve sonlandırmayla ilgili uygun ifadeler kullanır.;; e) Çevrim içi yazılarında yazışmayı başlatma, sürdürme ve sonlandırmayla ilgili uygun ifadeler kullanır.
T.Y.4.2.|Yazılarında içerik oluşturabilme|b) Ön bilgilerinden hareketle metin yazar.;; ç) Bir sözcüğün anlamına ilişkin tahminlerini bağlamdan yararlanarak yazar.;; e) Yazışmalarında kişi ve nesneleri benzerlik ve/veya farklılık bakımından karşılaştırır.;; f) Çevrim içi yazışmalarında kişi ve nesneleri benzerlik ve farklılık bakımından karşılaştırır.;; ğ) Çevrim içi yazışmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; j) Dinlediği, izlediği bir olayı veya okuduğu bir metni mantıksal ilişkilere uygun şekilde kendi ifadeleriyle yazar.;; n) Serbest yazma çalışmalarında görüş ve düşüncelerini nedenleriyle açıklar.;; u) Dinlediği/izlediği veya okuduğu metindeki neden-sonuç ilişkisini yazar.
T.Y.4.3.|Yazma kurallarını uygulayabilme|e) ${N3}
${Y45}
TEMA|Bilim ve Teknoloji
T.D.4.1.|Dinlemeyi/izlemeyi yönetebilme|b) Dinleme kurallarına uygun olarak dinler.
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42d}
${D43f};; e) Dinlediğindeki/izlediğindeki söylem ve görsel arasındaki ilişkiyi değerlendirir.
T.D.4.4.|Dinleme/izleme sürecine etki eden durumları gözden geçirebilme|a) Dinleme/izleme ortamının dinleme sürecindeki duygu, düşünce ve davranışlarına etkisini açıklar.;; b) Dinleme/izleme yapacağı ortamın fiziksel özelliklerini dikkate alarak dinler.
T.K.4.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|ç) Dinlediği/izlediği bir konuya ilişkin çıkarımlarını planlayarak konuşur.;; h) Konuşmalarında eş sesli sözcükleri kullanır.;; l) Konuşmalarında benzetmelere yer verir.
T.K.4.3.|Konuşma kurallarını uygulayabilme|ı) Konuşmalarında anlamlı ve kurallı cümleler kullanır.
T.K.4.4.|Konuşma sürecine etki eden durumları gözden geçirebilme|a) Konuşma ortamının konuşma sürecindeki duygu, düşünce ve davranışlarına etkisini açıklar.;; b) Konuşma yapacağı ortamın fiziksel özelliklerini dikkate alarak konuşur.
T.K.4.5.|Konuşma sürecini değerlendirebilme|ç) Metni yazar rolünde değerlendirerek ifade eder.
T.O.4.1.|Okuma sürecini yönetebilme|c) Noktalama işaretlerine dikkat ederek okur.
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|${OJ};; l) Okuduğu metinlerde "de" ve "ki" bağlaçlarının anlam üzerindeki etkisini fark eder.
${O43};; f) Çevrim içi okumada aradığı bilginin yerini doğru olarak bulur.;; g) Okuduğu metindeki noktalama işaretlerinin içerikle ilişkisini belirler.;; ğ) Okuduğu metindeki içerik ve görsel (tablo, grafik vb.) arasındaki ilişkiyi belirler.
T.O.4.4.|Okuma sürecine etki eden durumları gözden geçirebilme|a) Okuma sürecini etkileyen fiziksel etmenleri düzenler.;; b) Okuma yapacağı ortamın fiziksel özelliklerini dikkate alarak okur.
T.O.4.5.|Okuma sürecini değerlendirebilme|d) Basılı materyali okuma sürecindeki olumlu davranışlarını çevrim içi okuma sürecine aktarır.
T.Y.4.1.|Yazılı anlatım becerilerini yönetebilme|a) Serbest yazma çalışmaları yapar.
T.Y.4.2.|Yazılarında içerik oluşturabilme|b) Ön bilgilerinden hareketle metin yazar.;; f) Çevrim içi yazışmalarında kişi ve nesneleri benzerlik ve farklılık bakımından karşılaştırır.;; k) Ayrıntılı yönergeler yazar.;; n) Serbest yazma çalışmalarında görüş ve düşüncelerini nedenleriyle açıklar.;; ü) Yazılarında "de" ve "ki" bağlaçlarını kuralına uygun kullanır.
T.Y.4.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; d) Yazım kurallarına uygun yazar.;; e) ${N3}
T.Y.4.5.|Yazma sürecini değerlendirebilme|d) Dinlediği/izlediği veya okuduğu metni yazarın gözünden değerlendirdiği yazılar yazar.
TEMA|Geçmişten Geleceğe Mirasımız
${D41}
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42a};; c) Dinlediklerinde/izlediklerinde geçen olayların öncesi hakkında tahminde bulunur.;; ${D42d};; ğ) Dinlediklerindeki/izlediklerindeki olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; i) Dinlediklerine/izlediklerine ilişkin düşüncelerini sözlü ve sözsüz iletişim unsurları ile ifade eder.
${D43}
T.K.4.1.|Konuşmalarını yönetebilme|a) Konunun özelliğine göre konuşma üslubunu belirler.;; e) Yüz yüze iletişimde konuşma kurallarına uygun biçimde iletişimi sürdürür.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|b) Dinlediği, izlediği veya okuduğu metnin günlük yaşamla ilişkisini ifade eder.;; e) Konuşmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; f) Çevrim içi konuşmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; g) Konuşmalarında zıt anlamlı sözcükleri kullanır.
T.K.4.3.|Konuşma kurallarını uygulayabilme|c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; e) Konuşmalarında sözcükleri yerinde ve anlamına uygun kullanır.;; ğ) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; h) Konuşmalarında içeriğe uygun zaman ifadelerini kullanır.;; ı) Konuşmalarında anlamlı ve kurallı cümleler kurar.
T.O.4.1.|Okuma sürecini yönetebilme|c) Noktalama işaretlerine dikkat ederek okur.
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; ${OC4};; ${OÇ4};; ğ) Okuduklarındaki olay, durum, nesne ve kişileri özelliklerine göre sınıflandırır.;; ${OJ};; k) Okuyacağı metnin biçimsel ve tanıtıcı özelliklerden hareketle metnin içeriği hakkında görüş oluşturur.;; l) Okuduğu metinlerde "de" ve "ki" bağlaçlarının anlam üzerindeki etkisini fark eder.
${O43}
${O45}
${Y41s}
T.Y.4.2.|Yazılarında içerik oluşturabilme|a) Metnin eksik bırakılan bölümlerini ön bilgilerinden hareketle devam ettirir.;; g) Yazışmalarında olay, durum, nesne ve karakterleri özelliklerine göre sınıflandırır.;; ı) Yazılarında eş anlamlı sözcükleri kullanır.;; k) Ayrıntılı yönergeler yazar.;; ü) Yazılarında "de" ve "ki" bağlaçlarını kuralına uygun kullanır.
T.Y.4.3.|Yazma kurallarını uygulayabilme|b) Yazılarında sözcükleri yerinde ve anlamına uygun kullanır.;; d) Yazım kurallarına uygun yazar.;; e) ${N3}
TEMA|Demokratik Yaşam
T.D.4.1.|Dinlemeyi/izlemeyi yönetebilme|a) Konuya, amacına ve ilişkinin türüne uygun olarak dinleme/izleme stratejisini seçer.;; b) Dinleme kurallarına uygun olarak dinler.;; c) Dinlediği konuya ilişkin düşüncelerini belirtmek için uygun zamanda söz alır.
T.D.4.2.|Dinledikleri/izledikleri ile ilgili anlam oluşturabilme|${D42a};; ${D42d}
${D43}
T.D.4.5.|Dinleme/izleme sürecini değerlendirebilme|a) Dinlemelerinde/izlemelerinde tercih ettiği dinleme/izleme stratejilerini açıklar.;; c) Dinlemesindeki/izlemesindeki uygun davranışlarını sonraki dinlemelerine aktarır.
T.K.4.1.|Konuşmalarını yönetebilme|ç) Yüz yüze iletişimde konuşma kurallarına uygun bir biçimde iletişimi sürdürür.;; e) Yüz yüze iletişim sürecini uygun nezaket ifadelerini kullanarak sürdürür.;; g) Dinleyici kitlesi ve konunun özelliğine uygun konuşma planı hazırlar.
T.K.4.2.|Konuşmalarında içerik oluşturabilme|j) Serbest konuşma çalışmalarında görüş ve düşüncelerini nedenleriyle açıklar.;; k) Sözlü iletişimde kabul etmediği konulara ilişkin önerilerde bulunur.;; n) Konuşmalarını görsel/dijital içeriklerle destekler.;; o) Sık karşılaşılan deyimlerin anlamını söyler.
T.K.4.3.|Konuşma kurallarını uygulayabilme|b) Dinleyici kitlesi ve konunun özelliğine göre hazırladığı plana uygun konuşma yapar.;; c) Konuşmalarında vurgu ve tonlamaya dikkat eder.;; f) Deyimleri konuşma bağlamına uygun kullanır.;; ğ) Konuşmasındaki mesajları açık ve anlaşılır cümlelerle ifade eder.;; h) Konuşmalarında içeriğe uygun zaman ifadelerini kullanır.;; ı) Konuşmalarında anlamlı ve kurallı cümleler kullanır.;; j) Konuşmalarını jest ve mimiklerle destekler.;; k) Konuşma sürecinde beden dilini yerinde kullanır.
T.K.4.5.|Konuşma sürecini değerlendirebilme|c) Konuşmasındaki olumlu davranışları sonraki konuşmalarına aktarır.
T.O.4.1.|Okuma sürecini yönetebilme|a) Okuma amacına ve ilgi alanına göre okuyacağı metni seçer.;; b) Okuyacağı konuya veya okuma amacına göre okuma stratejisini seçer.;; c) Noktalama işaretlerine dikkat ederek okur.
T.O.4.2.|Okudukları ile ilgili anlam oluşturabilme|a) Okuduğu metindeki bilgiler ile ön bilgileri arasında bağlantı kurar.;; ${OC4};; ${OÇ4};; ı) Okuduğu metindeki iletilere katılıp katılmadığını nedenleriyle ifade eder.;; i) Okuduğu metnin kurgusuna ilişkin farklı önerilerde bulunur.;; ${OJ};; ${OK};; l) Okuduğu metinlerde "de" ve "ki" bağlaçlarının anlam üzerindeki etkisini fark eder.
${O43};; e) Yan anlamlı sözcükleri metinde bulur.
${Y41s}
T.Y.4.2.|Yazılarında içerik oluşturabilme|ö) Yazılarını görsel/dijital içeriklerle destekler.;; ü) Yazılarında "de" ve "ki" bağlaçlarını kuralına uygun kullanır.
T.Y.4.3.|Yazma kurallarını uygulayabilme|c) Yazılarında deyim ve atasözlerini içeriğe uygun kullanır.;; d) Yazım kurallarına uygun yazar.;; e) ${N3}
T.Y.4.5.|Yazma sürecini değerlendirebilme|ç) Tür veya ilgi alanına göre yazma tercihini belirtir.`;

  const veri = {};
  let sinif = null, tema = null;
  for (const satir of METIN.split("\n")) {
    const p = satir.split("|");
    if (p[0] === "S") { sinif = veri[p[1]] = []; continue; }
    if (p[0] === "TEMA") { tema = { tema: p[1], c: [] }; sinif.push(tema); continue; }
    if (p.length >= 3) tema.c.push({ kod: p[0], metin: p[1], b: p.slice(2).join("|").split(";; ").map((x) => x.trim()).filter(Boolean) });
  }
  /* Kod aramada temalar karışmasın: aynı kod birden çok temada var. */
  T.ciktilar.ekle("Türkçe", veri, "MEB İlkokul Türkçe Dersi Öğretim Programı (1-4), Türkiye Yüzyılı Maarif Modeli", "Tema");
})();
