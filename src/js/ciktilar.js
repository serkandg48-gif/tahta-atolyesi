/* Maarif Modeli öğrenme çıktıları.
   Kaynak: MEB, Türkiye Yüzyılı Maarif Modeli İlkokul Matematik Dersi Öğretim Programı (1-4),
   mufredat.meb.gov.tr/Dosyalar/20268149102521-Matematik (1-4) DÖP.pdf
   Metinler programdaki gibi aktarılmıştır. Yapı: ders > sınıf > tema > çıktılar (kod, ifade, süreç bileşenleri). */
T.ciktilar = (function () {
  const c = (kod, metin, ...b) => ({ kod, metin, b });
  const TOPLA_CIKAR_TAHMIN = ["Toplama ve çıkarma işlemlerine ilişkin ögeleri belirler.", "Toplama ve çıkarma işlemlerine ilişkin ögeler arasındaki ilişkileri belirler."];
  const PROBLEM = ["Problemi anlayarak verilenleri ve istenilenleri belirler.", "Problemde verilenlerin ve istenilenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler.", "Probleme ilişkin verilenleri belirleyerek uygun matematiksel temsillere dönüştürür.", "Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar.", "Problemlerin sonucuna ilişkin tahminde bulunarak işlemleri gerçekleştirmek için stratejiler geliştirir.", "Belirlenen strateji ya da stratejileri çözüm için uygular.", "Çözüm yollarını kontrol ederek çözüme ulaştırmayan stratejiyi değiştirir.", "Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir.", "Çözüme ulaştıran stratejilerin hangi problemlere uygulanabileceğini geneller.", "Genellemenin geçerliliğini matematiksel örneklerle değerlendirir."];
  const ORUNTU = ["Örüntüde kullanılan sayılar ve sayı temsiline dönüşen şekiller arasındaki ilişkiye yönelik varsayımda bulunur.", "Belirlediği varsayıma göre sayı ve sayı temsiline dönüşen şekil örüntülerini örnekler üzerinde listeler.", "Gösterilen örüntünün varsayımı karşılayıp karşılamadığını örneklerle sınar.", "Karşılaştırılan sayı ve sayı temsiline dönüşen şekil örüntülerinin kuralını sözlü olarak ifade eder.", "Gösterilen örüntü ile ilgili değerlendirmede bulunur."];
  const TAHMIN_COKLUK = ["Bir çokluktaki parça-bütün ve dağılım ilişkisini gözlem ve deneyimleri ile ilişkilendirir.", "Bir çokluğun büyüklüğünü stratejiye dayanarak tahmin eder.", "Tahmini ile sayma sonucunu karşılaştırarak tahmininin doğruluğuna yönelik bir yargıda bulunur."];
  const VERI = (arac, ozne = "Kategorik veriye dayalı") => [`${ozne} istatistiksel araştırma gerektiren günlük yaşam durumu belirler.`, null, "Kategorik verileri toplamak için plan yapar.", "Kategorik verileri toplar ve analize hazırlar.", `Toplanan verileri analiz etmek için görselleştirme araçlarından ${arac} seçer.`, "Seçtiği araçlarla verileri görselleştirerek analiz eder.", "Araştırma sonuçlarını yorumlar.", "Araştırma sonuçlarını araştırma sorularına göre değerlendirir."];
  const veri = (arac, soru, ozne) => { const v = VERI(arac, ozne); v[1] = soru; return v; };

  const Matematik = {
    1: [
      { tema: "Sayılar ve Nicelikler (1)", c: [
        c("MAT.1.1.1.", "Rakamları ve 20'ye kadar olan sayıları (20 dâhil), niceliklerin büyüklüklerini temsil etmek için kullanabilme", "Niceliklerin büyüklüklerinin farklı temsillerini tanır.", "Karşılaştığı niceliklerin büyüklüklerini, farklı temsilleri bağlamında belirler.", "Karşılaştığı niceliklerin büyüklüklerini rakam ve sayılarla okur ve yazar."),
        c("MAT.1.1.2.", "Ögeleri dağınık veya düzenli bir şekilde bulunan bir nesne grubunu sayarken parçalar arasında ilişkileri çözümleyebilme", "Ögeleri dağınık veya düzenli bir şekilde bulunan bir nesne grubunun parçalarını belirler.", "Ögeleri dağınık veya düzenli bir şekilde bulunan bir nesne grubunu sayarken parçalar arasındaki ilişkileri belirler."),
        c("MAT.1.1.3.", "Nesnelerin sıra sayısını gösterebilme"),
        c("MAT.1.1.4.", "İki niceliğin büyüklüğünü \"çok\", \"daha çok\", \"az\", \"daha az\" veya \"eşit\" terimleriyle karşılaştırabilme", "İki niceliğin büyüklüğünü \"çok\", \"daha çok\", \"az\", \"daha az\" veya \"eşit\" terimleriyle ifade eder.", "İfade edilen büyüklüklere ilişkin benzerlikleri listeler.", "İfade edilen büyüklüklere ilişkin farklılıkları listeler."),
        c("MAT.1.1.5.", "100'e kadar ileriye ve 20'den geriye doğru ritmik sayabilme"),
        c("MAT.1.1.6.", "Artan veya azalan sayı ve şekil örüntülerini çözümleyebilme", "Sayı ve şekil örüntülerinin ardışık ögelerini belirler.", "Sayı ve şekil örüntülerinin ardışık ögeleri arasındaki ilişkiyi belirler."),
        c("MAT.1.1.7.", "Verilen bir çokluktaki ilişkilerden yararlanarak 20'ye kadar (20 dâhil) olan nesnelerin sayısını tahmin edebilme", "Verilen bir çokluktaki ilişkileri gözlem ve deneyimleri ile ilişkilendirir.", "Bir çokluğun büyüklüğünü stratejiye dayanarak tahmin eder.", "Tahmin edilen sonuç ile sayma sonucunu karşılaştırarak yargıda bulunur."),
      ] },
      { tema: "Sayılar ve Nicelikler (2)", c: [
        c("MAT.1.1.8.", "Standart olmayan uygun ölçme araçları ile nesnelerin uzunluğunu ve tartacağı kütlenin ölçüm sonuçlarını tahmin edebilme", "Ölçeceği uzunluğa ve kütleye uygun standart olmayan ölçme aracını belirler.", "Ölçeceği uzunluğun ve tartacağı kütlenin ölçüm sonuçlarını belirlenen standart olmayan ölçü birimi cinsinden tahmin eder.", "Tahmininin doğruluğuna ilişkin yargıda bulunur."),
      ] },
      { tema: "Sayılar ve Nicelikler (3)", c: [
        c("MAT.1.1.9.", "Paraların (1 TL, 5 TL, 10 TL, 20 TL, 50 TL, 100 TL ve 200 TL) temsil ettiği büyüklükleri tanıyabilme"),
      ] },
      { tema: "İşlemlerden Cebirsel Düşünmeye", c: [
        c("MAT.1.2.1.", "Günlük yaşamın içerdiği toplama ve çıkarma işlemlerini çözümleyebilme", "Günlük yaşam durumunun toplama ve çıkarma işlemlerinden hangisini gerektirdiğini fark eder.", "Günlük yaşam durumuna karşılık gelen toplama ve çıkarma işlemlerini birbiri ile ilişkilendirir."),
        c("MAT.1.2.2.", "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", ...TOPLA_CIKAR_TAHMIN, "Toplama ve çıkarma işlemlerine yönelik tahmin ve zihinden işlem sonuçları arasında ilişki kurar.", "Tahmin ve zihinden işlem sonuçlarının tutarlılığını ifade eder."),
        c("MAT.1.2.3.", "Eşit işaretinin anlamını toplama ve çıkarma işlemi bağlamında yorumlayabilme", "Toplama ve çıkarma işlemlerinde eşit işaretinin kullanımını inceler.", "Eşit işaretinin anlamını kullanarak bir toplama ya da çıkarma işlemini dönüştürür.", "Dönüştürdüğü toplama ve çıkarma işlemlerini kendi cümleleriyle ifade eder."),
        c("MAT.1.2.4.", "Toplama ve çıkarma işlemlerinin ilişkisini yorumlayabilme", "Toplama ve çıkarma işlemlerinin ilişkisini inceler.", "Toplama ve çıkarma işlemlerini tersine dönüştürür.", "Toplama ve çıkarma işlemlerinin ilişkisini yeniden ifade eder."),
      ] },
      { tema: "Nesnelerin Geometrisi (1)", c: [
        c("MAT.1.3.1.", "Hedefe ulaşmak için mesafeleri ve yönleri içeren yönergeleri çözümleyebilme", "Yönergede yer alan mesafe ve yönleri içeren kavramları belirler.", "Yönergeleri kullanarak başlangıç noktası ve hedef arasında ilişki kurar."),
        c("MAT.1.3.2.", "Nesnelerin eşliğini değerlendirebilme", "Nesnelerin eşliği için bir ölçüt belirler.", "Ölçüte uygun bilgileri kullanarak ölçme yapar.", "Yapılan ölçmeye dayalı olarak elde ettiği sonuçları ölçüt ile karşılaştırır.", "Karşılaştırmalarına ilişkin olarak yargıda bulunur."),
      ] },
      { tema: "Nesnelerin Geometrisi (2)", c: [
        c("MAT.1.3.3.", "Günlük yaşamdaki nesneleri biçimsel özelliklerine göre ayırt edebilme"),
        c("MAT.1.3.4.", "Günlük yaşamda karşılaşılan geometrik yapılardaki geometrik şekilleri çözümleyebilme", "Geometrik yapılardaki şekilleri belirler.", "Şekiller arasında ilişki kurar."),
        c("MAT.1.3.5.", "Biçimsel özelliklerine göre geometrik şekilleri sınıflandırabilme", "Geometrik şekillerin biçimsel özelliklerini belirler.", "Geometrik şekilleri biçimsel özelliklerine göre ayırır.", "Geometrik şekilleri tasnif eder.", "Geometrik şekilleri adlandırır."),
      ] },
      { tema: "Veriye Dayalı Araştırma", c: [
        c("MAT.1.4.1.", "Kategorik veriye dayalı temel veri grubu ile çalışabilme ve veriye dayalı karar verebilme", ...veri("çetele, sıklık tablosu ve nesne grafiğini", "Kategorik veriye dayalı betimleme gerektirebilecek araştırma soruları oluşturur.")),
      ] },
    ],
    2: [
      { tema: "Sayılar ve Nicelikler (1)", c: [
        c("MAT.2.1.1.", "100'e kadar olan niceliklerin büyüklüklerini temsil etmede sayıların sembolik temsillerinden yararlanabilme", "Niceliklerin büyüklüklerinin farklı temsillerini tanır.", "Niceliklerin büyüklüklerine uygun sayı temsillerini belirler.", "Niceliklerin büyüklüklerine karşılık gelen sayıları okur ve yazar."),
        c("MAT.2.1.2.", "İki basamaklı sayıları çözümleyebilme", "İki basamaklı sayıların basamak ve basamak değerini belirler.", "İki basamaklı sayıların basamak ve basamak değerleri arasındaki ilişkileri belirler."),
        c("MAT.2.1.3.", "Sayıların sırasını belirleyebilme"),
        c("MAT.2.1.4.", "İleriye ve geriye doğru ritmik sayabilme", "Yüzlük tablo üzerinde ileriye ve geriye doğru ritmik saymaya ilişkin gözlem yapar.", "20 içinde ikişer, 30 içinde üçer, 40 içinde dörder, 100 içinde beşer ileriye ve geriye doğru ritmik sayarken örüntü bulur.", "İleriye ve geriye doğru ritmik sayarken bulduğu örüntüyü geneller."),
        c("MAT.2.1.5.", "Sayı ve sayı temsiline dönüşen şekil örüntülerine dayalı çıkarım yapabilme", ...ORUNTU),
        c("MAT.2.1.6.", "Bir çokluktaki ilişkilerden yararlanarak 50'ye kadar olan nesnelerin sayısını tahmin edebilme", ...TAHMIN_COKLUK),
      ] },
      { tema: "Sayılar ve Nicelikler (2)", c: [
        c("MAT.2.1.7.", "Bütün, yarım ve çeyrek arasındaki ilişkiyi çözümleyebilme", "Bir bütünün yarım ve çeyrek parçalarını belirler.", "Bütün, yarım ve çeyrek arasındaki ilişkileri belirler."),
        c("MAT.2.1.8.", "Paraları değerlerine göre ilişkilendirerek çözümleyebilme", "Paraları değerlerine göre inceleyerek madenî paraları belirler.", "Kuruş ve Türk lirası arasındaki ilişkileri belirler."),
        c("MAT.2.1.9.", "Zaman ölçü birimlerini okuyabilme ve yazabilme"),
        c("MAT.2.1.10.", "Standart uzunluk ve kütle ölçme araçlarının ve birimlerinin gerekliliğini yansıtabilme", "Standart olmayan araçlarla ilgili deneyimlerinden yola çıkarak standart ölçme araçlarına olan ihtiyacı gözden geçirir.", "Deneyimlerine dayalı olarak standart ölçme araçlarının gerekliliğine ilişkin çıkarımda bulunur.", "Standart ölçme araçlarına ilişkin ulaştığı çıkarımlar doğrultusunda standart ölçü birimlerinin gerekliliğini değerlendirir."),
        c("MAT.2.1.11.", "Standart uzunluk ve kütle ölçü birimleri cinsinden uzunlukları ve kütleleri tahmin edebilme", "Standart ölçü birimlerine ilişkin deneyimini, tahmine konu olan uzunluk ve kütle ile ilişkilendirir.", "Nesnelerin uzunluğunu ve kütlesini standart ölçü birim cinsinden tahmin eder.", "Tahminini ölçüm sonuçlarıyla karşılaştırarak tahminine ilişkin yargıda bulunur."),
      ] },
      { tema: "İşlemlerden Cebirsel Düşünmeye", c: [
        c("MAT.2.2.1.", "Toplama ve çıkarma işlemleri gerektiren günlük yaşam problemlerini çözebilme", ...PROBLEM),
        c("MAT.2.2.2.", "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", ...TOPLA_CIKAR_TAHMIN, "Toplama ve çıkarma işlemine yönelik tahmin ve zihinden işlem sonuçları arasında ilişki kurar.", "Tahmin ve zihinden işlem sonuçlarının tutarlılığını ifade eder."),
        c("MAT.2.2.3.", "Toplama ve çıkarma işlemlerinin ilişkisini yorumlayabilme", "Toplama ve çıkarma işlemlerinin ilişkisini inceler.", "Toplama ve çıkarma işlemlerini tersine dönüştürür.", "Toplama ve çıkarma işlemlerinin ilişkisini yeniden ifade eder."),
        c("MAT.2.2.4.", "Çarpma ve bölme işlemlerini toplama ve çıkarma işlemlerine dayalı olarak çözümleyebilme", "Çarpma ve bölme işlemlerinin anlamlarının toplama ve çıkarma işlemleriyle ilişkili olduğunu fark eder.", "Çarpma ve bölme işlemlerini toplama ve çıkarma işlemleriyle ilişkilendirir."),
        c("MAT.2.2.5.", "Çarpma ve bölme işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", "Çarpma ve bölme işlemlerine ilişkin bileşenleri belirler.", "Çarpma ve bölme işlemlerine ilişkin bileşenler arasındaki ilişkileri belirler.", "Çarpma ve bölme işlemine yönelik tahmin ve zihinden işlem sonuçlarını ifade eder.", "Tahmin ve zihinden işlem sonuçlarını açıklar."),
        c("MAT.2.2.6.", "Dört işlem bağlamında eşitliğin farklı anlamlarını yorumlayabilme", "Dört işlemde eşitliği farklı anlamlarına göre inceler.", "Dört işlem bağlamında aynı sonucu veren durumları eşitliğin anlamını kullanarak farklı sayılarla ifade eder.", "Eşitliğin anlamlarını dört işlem bağlamında ifade eder."),
      ] },
      { tema: "Nesnelerin Geometrisi (1)", c: [
        c("MAT.2.3.1.", "Günlük yaşamda kullanılan nesneleri biçimsel özelliklerine göre geometrik cisim olarak sınıflandırabilme", "Günlük yaşamda kullanılan nesnelerin biçimsel özelliklerini belirler.", "Farklı nesneleri biçimsel özelliklerine göre ayırır.", "Nesneleri geometrik cisim olarak tasnif eder.", "Geometrik cisimleri adlandırır."),
        c("MAT.2.3.2.", "Geometrik cisim modellerini kullanarak yapılar sentezleyebilme", "Geometrik yapılardaki geometrik cisimleri belirler.", "Geometrik cisimler arasında ilişki kurar.", "Geometrik cisimleri birleştirerek özgün bir yapı oluşturur."),
        c("MAT.2.3.3.", "Geometrik şekiller kullanarak modeller sentezleyebilme", "Geometrik yapılardaki geometrik şekilleri belirler.", "Geometrik şekiller arasında ilişki kurar.", "Geometrik şekilleri birleştirerek özgün model oluşturur."),
        c("MAT.2.3.4.", "Geometrik şekil ve cisimlerin yön, konum veya büyüklükleri değiştiğinde biçimsel özelliklerinin değişmediğini yorumlayabilme", "Geometrik şekil ve cisimlerin mevcut yön, konum veya büyüklüklerini inceler.", "Geometrik şekil ve cisimlerin mevcut yön, konum veya büyüklüklerini biçimsel özelliklerinden kopmadan farklı büyüklüklere veya farklı yönlere dönüştürerek gösterir.", "Geometrik şekil ve cisimlerin yön, konum veya büyüklükleri değişse de geometrik şekil ve cisim olarak aynı kaldığını ifade eder."),
        c("MAT.2.3.5.", "Standart olmayan sıvı ölçme araçları ile sıvı miktarını tahmin edebilme", "Standart olmayan sıvı ölçme araçlarına ilişkin deneyimini, tahmine konu olan sıvı miktarı ile ilişkilendirir.", "Belirlenen standart olmayan sıvı ölçme araçlarına göre sıvının miktarını tahmin eder.", "Tahminini ölçüm sonuçlarıyla karşılaştırarak tahminine ilişkin yargıda bulunur."),
      ] },
      { tema: "Nesnelerin Geometrisi (2)", c: [
        c("MAT.2.3.6.", "Mesafe ve yönleri içerecek şekilde hedefe ulaşmak için uygun stratejilere karar verebilme", "Hedefe ulaşmak için ölçüt belirler.", "Belirlediği ölçüte uygun bilgileri toplar.", "Topladığı bilgilerden ölçüte yönelik seçenekler oluşturur.", "Oluşturduğu seçenekler üzerinde mantıksal denetleme yapar.", "Seçenekler arasından ölçüte uygun seçim yapar.", "Ölçüt değişikliği durumunu sürece yansıtır."),
        c("MAT.2.3.7.", "Verilen şekiller arasından simetrik olanları ayırt edebilme"),
      ] },
      { tema: "Veriye Dayalı Araştırma", c: [
        c("MAT.2.4.1.", "Kategorik veriye dayalı en çok iki veri grubu ile çalışabilme ve veriye dayalı karar verebilme", ...veri("çetele tablosu, sıklık tablosu ve şekil grafiğini", "Kategorik veriye dayalı betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.")),
      ] },
    ],
    3: [
      { tema: "Sayılar ve Nicelikler (1)", c: [
        c("MAT.3.1.1.", "Niceliklerin büyüklüklerine karşılık gelen 1000'e kadar olan sayıların temsillerinden yararlanabilme", "Niceliklerin büyüklüklerinin temsillerini tanır.", "Niceliklerin büyüklüklerine uygun sayı temsillerini belirler.", "Niceliklerin büyüklüklerine karşılık gelen uygun sayıları okur ve yazar."),
        c("MAT.3.1.2.", "1000'e kadar olan sayıları çözümleyebilme", "Üç basamaklı sayıların basamaklarını belirler.", "Üç basamaklı sayıların basamak ve basamak değerleri arasındaki ilişkileri belirler."),
        c("MAT.3.1.3.", "Sayıları sıralayabilme", "1000'e kadar olan sayıları öncelik/sonralık ilişkisine göre belirler.", "1000'e kadar olan sayıları bulundukları onluklara ve yüzlüklere göre ayırır.", "1000'e kadar olan sayıları en yakın onluklara ve yüzlüklere göre tasnif eder.", "1000'e kadar olan sayıları en yakın onluklara ve yüzlüklere göre ifade eder."),
        c("MAT.3.1.4.", "Sayıları ileriye ve geriye doğru ritmik sayabilme", "Modeller üzerinde ileriye ve geriye doğru ritmik saymaya ilişkin gözlem yapar.", "60 içinde altışar, 70 içinde yedişer, 80 içinde sekizer, 90 içinde dokuzar; 1000 içinde onar ve yüzer ileriye ve geriye doğru ritmik sayarken örüntü bulur.", "İleriye ve geriye doğru ritmik sayarken bulduğu örüntüyü geneller."),
        c("MAT.3.1.5.", "Sayıları tek-çift olarak sınıflandırabilme", "Sayıları tek-çift ilişkisine göre belirler.", "Sayıları tek-çift olma durumlarına göre ayırt eder.", "Sayıları tek-çift olma durumlarına göre tasnif eder.", "Sayıları tek-çift sayı olarak ifade eder."),
        c("MAT.3.1.6.", "Tek ve çift sayıların toplamlarının tek ya da çift olma durumu arasındaki ilişkiye yönelik tümevarımsal akıl yürütebilme", "Tek ve çift sayıların toplamlarına yönelik örnek durumların tek ya da çift olma özelliklerini belirler.", "Toplanan sayılar ile elde edilen toplamın tek ya da çift olma durumları arasındaki örüntüyü belirler.", "Tek ve çift sayıların toplamlarının tek ya da çift olma durumuna ilişkin genelleme yapar."),
        c("MAT.3.1.7.", "Sayı ve sayı temsiline dönüşen şekil örüntülerine dayalı çıkarım yapabilme", ...ORUNTU),
        c("MAT.3.1.8.", "Bir çokluktaki ilişkilerden yararlanarak 100'e kadar olan nesnelerin sayısını tahmin edebilme", ...TAHMIN_COKLUK),
      ] },
      { tema: "Sayılar ve Nicelikler (2)", c: [
        c("MAT.3.1.9.", "Bütün, yarım ve çeyreğin kesirle gösterimi için modellerden yararlanabilme", "Bütün, yarım ve çeyrek modellerinin temsillerini tanır.", "Bütün, yarım ve çeyrek modellerine uygun kesir temsillerini belirler.", "Belirlediği temsili bütün, yarım ve çeyrek modelleri için kullanır."),
        c("MAT.3.1.10.", "Bir bütünü eş parçalar oluşturacak şekilde birim kesir olarak çözümleyebilme", "Bir bütünü oluşturan eş parçaları belirler.", "Bütün ile eş parçaların her biri arasındaki ilişkiyi belirler."),
        c("MAT.3.1.11.", "Bir kesrin payı ile paydası arasındaki ilişkiyi çözümleyebilme", "Bir kesrin pay ve paydasına ait parçaları belirler.", "Bir kesrin pay ve paydasına ait parçalar arasındaki ilişkiyi belirler."),
        c("MAT.3.1.12.", "Analog ve dijital saatlerde zamanı okuyabilme ve yazabilme"),
        c("MAT.3.1.13.", "Zaman ölçü birimlerini çözümleyebilme", "Zaman ölçü birimlerini (yıl, ay, hafta, gün, saat, dakika, saniye) belirler.", "Zaman ölçü birimleri arasındaki ilişkileri belirler."),
        c("MAT.3.1.14.", "Olayların oluş sürelerini tahmin ederek yargıda bulunabilme", "Olayların oluş sürelerini birbirleriyle ilişkilendirir.", "Olayların oluş sürelerine ilişkin deneyimlerinden faydalanarak çıkarım yapar.", "Olayların oluş sürelerine ilişkin yapılan çıkarımla gerçekte olan sürelerine ilişkin yargıda bulunur."),
        c("MAT.3.1.15.", "Uzunluk ve kütle birimleri arasındaki ilişkileri kullanarak bu birimleri kendi içerisinde çözümleyebilme", "Standart kütle ve uzunluk birimlerine ilişkin parçaları belirler.", "Santimetre, metre, kilometre ve gram, kilogram ve ton arasındaki ilişkileri kendi içerisinde belirler."),
        c("MAT.3.1.16.", "Madenî ve kâğıt paraları değerlerine göre ilişkilendirerek yorumlayabilme", "Paraları değerlerine göre inceler.", "Madenî paraları ve kâğıt paraları değerlerine göre dönüştürür.", "Paranın değerini, anlamını değiştirmeyecek şekilde yeniden ifade eder."),
      ] },
      { tema: "İşlemlerden Cebirsel Düşünmeye", c: [
        c("MAT.3.2.1.", "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", ...TOPLA_CIKAR_TAHMIN, "Toplama ve çıkarma işlemine yönelik tahminî ve zihinden işlem sonuçları arasında ilişki kurar.", "Tahminî ve zihinden işlem sonuçlarının tutarlılığını ifade eder."),
        c("MAT.3.2.2.", "Toplama ve çıkarma işlemlerini çözümleyebilme", "Toplama ve çıkarma işlemlerinin adımlarını belirler.", "Toplama ve çıkarmanın işlem süreçlerini birbiri ile ilişkilendirir."),
        c("MAT.3.2.3.", "Çarpma ve bölme işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", "Çarpma ve bölme işlemlerine ilişkin bileşenleri belirler.", "Çarpma ve bölme işlemlerine ilişkin bileşenler arasındaki ilişkileri belirler.", "Çarpma ve bölme işlemine yönelik tahminî ve zihinden işlem sonuçlarını ifade eder.", "Tahminî ve zihinden işlem sonuçlarını kendi cümleleri ile açıklar."),
        c("MAT.3.2.4.", "Çarpma ve bölme işlemlerini çözümleyebilme", "Çarpma ve bölme işlemlerinin adımlarını belirler.", "Çarpma ve bölme işlemlerini birbiri ile ilişkilendirir."),
        c("MAT.3.2.5.", "Dört işlem gerektiren durumlar için verilen yönergeleri takip ederek yorumlayabilme", "Dört işleme ait bileşenleri inceler.", "İncelediği bileşenleri işlem diline dönüştürür.", "Oluşturduğu yapıyı temsillerle yeniden ifade eder."),
        c("MAT.3.2.6.", "Dört işlem gerektiren günlük yaşam problemlerini çözebilme", ...PROBLEM),
        c("MAT.3.2.7.", "Dört işlem gerektiren problem durumlarını yapılandırabilme", "Dört işlem gerektiren problem durumlarına yönelik hiyerarşik, nedensel ya da mantıksal ilişkiler ortaya koyar.", "Dört işlem yapmayı gerektiren deneyimleriyle elde ettiği ilişkilere dayalı bir problem oluşturur."),
        c("MAT.3.2.8.", "Dört işlem bağlamında eşitliğin farklı anlamlarını yorumlayabilme", "Dört işlemde eşitliğin kullanımını inceler.", "Aynı sonucu veren dört işlemi eşitliğin anlamını kullanarak farklı sayılarla ifade eder.", "Eşitliğin anlamlarını dört işlem bağlamında ifade eder."),
      ] },
      { tema: "Nesnelerin Geometrisi (1)", c: [
        c("MAT.3.3.1.", "Geometrik cisimlerin özelliklerini yorumlayabilme", "Geometrik cisimlerin özelliklerini inceler.", "Geometrik cisimlerin köşe, yüz ve ayrıt özelliklerini ifade eder.", "Köşe, yüz ve ayrıt terimlerini kendi ifadeleri ile açıklar."),
        c("MAT.3.3.2.", "Kenar sayılarına göre geometrik şekilleri sınıflandırabilme", "Geometrik şekillerin kenarlarını belirler.", "Geometrik şekilleri kenar sayılarına göre ayırır.", "Geometrik şekilleri kenar sayılarına göre tasnif eder.", "Geometrik şekilleri kenar sayılarına göre adlandırır."),
        c("MAT.3.3.3.", "Matematiksel araç ve teknolojileri kullanarak çeşitli geometrik şekilleri ve cisimleri çizebilme", "Geometrik şekil ve cisim çizmeyi gerektiren matematiksel araç ve teknolojileri tanır.", "Geometrik şekil ve cisim çizmek için gerekli araçları ve teknolojiyi belirler.", "Belirlenen araç ve teknolojiyi kullanır."),
        c("MAT.3.3.4.", "Standart olmayan ve standart ölçme araçları ile geometrik şekillerin çevre uzunluğunu tahmin edebilme", "Standart olmayan ve standart uzunluk ölçme araçlarına ilişkin deneyimini, tahmine konu olan şeklin çevre uzunluğu ile ilişkilendirir.", "Belirlenen standart olmayan ve standart uzunluk ölçme aracına göre çevre uzunluğuna ilişkin tahminde bulunur.", "Tahminini ölçüm sonuçlarıyla karşılaştırarak tahminine ilişkin yargıda bulunur."),
        c("MAT.3.3.5.", "Standart sıvı ölçü birimleri cinsinden sıvı miktarını tahmin edebilme", "Standart sıvı ölçü birimlerine ilişkin deneyimini tahmine konu olan sıvı miktarı ile ilişkilendirir.", "Belirlenen standart sıvı ölçü birimi cinsinden sıvının miktarına ilişkin tahminde bulunur.", "Tahminini ölçüm sonuçlarıyla karşılaştırarak tahminine ilişkin yargıda bulunur."),
      ] },
      { tema: "Nesnelerin Geometrisi (2)", c: [
        c("MAT.3.3.6.", "Birden fazla simetri doğrusu olan şekilleri çözümleyebilme", "Kare, dikdörtgen ve dairenin birden fazla simetri doğrusu olduğunu belirler.", "Simetri doğrusuna göre oluşan parçaların birbirine eş olduğunu belirler."),
        c("MAT.3.3.7.", "Bir parçası verilen simetrik şekli simetri doğrusuna göre yapılandırabilme", "Bir parçası verilen simetrik şekli inceleyerek mantıksal ilişkiler ortaya koyar.", "Bir parçası verilen simetrik şekli yatay ve dikey simetri doğrusuna göre tamamlar."),
        c("MAT.3.3.8.", "Yönerge ile yapılandırılan ve bir parçası verilen bir şekli tamamlayarak simetrisini oluşturmaya ilişkin kodlama stratejilerini kullanarak yargıda bulunabilme", "Bir parçası verilen şekli tamamlayarak simetrisini oluşturmaya ilişkin yönergeleri yeniden ifade eder.", "Yönergeleri takip ederek bir parçası verilen şekli tamamlayarak simetrisini oluşturur.", "Bir şeklin simetrisini oluşturmaya ilişkin yargıda bulunur."),
      ] },
      { tema: "Veriye Dayalı Araştırma", c: [
        c("MAT.3.4.1.", "Kategorik ve sayma ile elde edilen nicel veriye dayalı tek veri grubu ile çalışabilme ve veriye dayalı karar verebilme", "Kategorik ve nicel veriye dayalı istatistiksel araştırma gerektiren günlük yaşam durumları belirler.", "Kategorik ve nicel veriye dayalı betimleme gerektirebilecek araştırma soruları oluşturur.", "Kategorik ve nicel verileri toplamak için plan yapar.", "Kategorik verileri toplar ve analize hazırlar.", "Toplanan verileri analiz etmek için görselleştirme araçlarından çetele, sıklık tablosu veya nokta grafiğini seçer.", "Seçtiği araçlarla verileri görselleştirerek analiz eder.", "Araştırma sonuçlarını yorumlar.", "Araştırma sonuçlarını araştırma sorularına göre değerlendirir."),
      ] },
    ],
    4: [
      { tema: "Sayılar ve Nicelikler (1)", c: [
        c("MAT.4.1.1.", "Niceliklerin büyüklükleri için en fazla altı basamaklı olan sayıların temsillerinden yararlanabilme", "Niceliklerin büyüklüklerinin temsillerini tanır.", "Niceliklerin büyüklüklerine uygun sayı temsillerini belirler.", "Niceliklerin büyüklüklerine karşılık gelen uygun sayıları okur ve yazar."),
        c("MAT.4.1.2.", "En fazla altı basamaklı sayıları çözümleyebilme", "En fazla altı basamaklı sayıların basamaklarını ve bölüklerini belirler.", "En fazla altı basamaklı sayıların basamak, bölük ile basamak ve sayı değerleri arasındaki ilişkileri belirler."),
        c("MAT.4.1.3.", "Sayıları sıralayabilme", "En fazla altı basamaklı sayıları öncelik/sonralık ilişkisine göre sembol kullanarak belirler.", "En fazla altı basamaklı sayıları onluklara, yüzlüklere ve binliklere göre basamaklarına ayırır.", "En fazla dört basamaklı sayıları en yakın onluğa, yüzlüğe ve binliğe göre yuvarlayarak tasnif eder.", "Tasnif edilen sayı gruplarını birler ve binler bölüğü şeklinde ifade eder."),
        c("MAT.4.1.4.", "İleriye ve geriye doğru ritmik saymayı yapılandırabilme", "Sayıları ileriye ve geriye doğru ritmik sayarken hiyerarşik ilişkiler ortaya koyar.", "Ritmik saymaya ilişkin öz bilgisine dayanarak yüzer ve biner ileriye ve geriye doğru hedeflenen sayıya ulaşır."),
        c("MAT.4.1.5.", "Artan azalan sayı örüntüleri ve şekil örüntülerindeki değişimi genelleyebilme", "Verilen örüntünün adımı ve örüntüde kullanılan sayılar ya da şekiller arasındaki ilişkiye yönelik bilgi toplar.", "Verilen örüntüde kullanılan sayıların ya da şekillerin ortak olan özelliklerini belirler.", "Verilen örüntüde kullanılan sayıların ya da şekillerin ortak olmayan özelliklerini belirler.", "Karşılaştırılan sayı ve şekil örüntülerindeki artma, azalma ve tekrar etme durumlarını sözlü olarak ifade eder."),
      ] },
      { tema: "Sayılar ve Nicelikler (2)", c: [
        c("MAT.4.1.6.", "Basit, bileşik ve tam sayılı kesirleri kullanmak için matematiksel temsillerden yararlanabilme", "Basit, bileşik ve tam sayılı kesirlerin temsillerini tanır.", "Günlük yaşam durumuna uygun basit, bileşik ve tam sayılı kesir temsillerini belirler.", "Belirlediği basit, bileşik ve tam sayılı kesirlerin temsillerini kullanır."),
        c("MAT.4.1.7.", "Denk kesirleri kullanmak için matematiksel temsillerden yararlanabilme", "Denk kesirlerin temsillerini tanır.", "Denk kesirlere uygun temsilleri belirler.", "Belirlediği denk kesirlerin temsillerini kullanır."),
        c("MAT.4.1.8.", "Birim kesirlerin büyüklük küçüklük ilişkilerini çözümleyebilme", "Birim kesirleri büyüklük küçüklük bağlamında ifade eder.", "Birim kesirler arasındaki büyüklük küçüklük ilişkisini belirler."),
        c("MAT.4.1.9.", "Paydaları eşit olan kesirlerin büyüklük küçüklük ilişkilerini çözümleyebilme", "Paydaları eşit kesirleri büyüklük küçüklük bağlamında ifade eder.", "Paydaları eşit kesirler arasındaki büyüklük küçüklük ilişkisini belirler."),
        c("MAT.4.1.10.", "Bir çokluğun basit kesir kadarını ve bir basit kesir kadarı verilen çokluğun tamamını çözümleyebilme", "Bir çokluğu oluşturan eş parçaları ve eş parçaları verilen bir çokluğu kesire uygun olacak şekilde belirler.", "Çokluk ile eş parçalar ve eş parçalar ile çokluk arasındaki ilişkiyi belirler."),
        c("MAT.4.1.11.", "Paydaları eşit kesirlerle toplama ve çıkarma işlemini yapılandırabilme", "Paydaları eşit kesirlerle toplama ve çıkarma işleminde mantıksal ilişkileri ortaya koyar.", "Paydaları eşit kesirlerle toplama ve çıkarma işleminde kendi öz bilgisi ile elde ettiği ilişkilere dayalı bir bütün oluşturur."),
        c("MAT.4.1.12.", "Paydaları eşit kesirlerle toplama ve çıkarma işlemi gerektiren günlük yaşam problemlerine çözüm geliştirebilme", "Problemin çözümü için uygun stratejiyi oluşturur.", "Problemi çözmek için uygun stratejiyi kullanır.", "Problemin çözümünü kontrol eder."),
        c("MAT.4.1.13.", "Uzunluk ve kütle birimlerinin kendi içerisindeki dönüşümlerini yorumlayabilme", "Uzunluk ve kütle birimlerinin kendi içindeki ilişkileri inceler.", "Uzunluk ve kütle birimlerini kendi içinde birbirine dönüştürür.", "Uzunluk ve kütle birimlerini kendi içinde farklı birim cinsinden yeniden ifade eder."),
      ] },
      { tema: "İşlemlerden Cebirsel Düşünmeye", c: [
        c("MAT.4.2.1.", "Toplama ve çıkarma işlemlerini zihinden yaparak çözümleyebilme", "Zihinden toplama ve çıkarma işlemlerinde sayıların uygun bir biçimde parçalarını belirler.", "Sayıların parçalarına ait özellikleri ilişkilendirir."),
        c("MAT.4.2.2.", "En çok dört basamaklı sayılarla toplama ve çıkarma işlemlerini yapılandırabilme", "Toplama ve çıkarma işlemlerinin algoritmasına yönelik hiyerarşik, nedensel ya da mantıksal ilişkiler ortaya koyar.", "Toplama ve çıkarma işlemlerinin algoritmasına yönelik kendi öz bilgisi ile elde ettiği ilişkilere dayalı bir bütün oluşturur."),
        c("MAT.4.2.3.", "Çarpma ve bölme işlemlerinin sonucunu tahmin edebilme", "Çarpma ve bölme işlemlerinin sonucunu deneyimleri ile ilişkilendirir.", "Çarpma ve bölme işlemlerinin sonucuna ilişkin çıkarım yapar.", "Çarpma ve bölme işlemlerinin sonucuna ilişkin yargıda bulunur."),
        c("MAT.4.2.4.", "Zihinden çözümlenen çarpma ve bölme işlemleri ile bu işlemlerin kısa yollarını yapılandırabilme", "Zihinden çözümlenen çarpma ve bölme işlemlerinin algoritmasına yönelik hiyerarşik, nedensel ya da mantıksal ilişkiler ortaya koyar.", "Zihinden çözümlenen çarpma ve bölme işlemlerinin algoritmasına yönelik kendi öz bilgisi ile elde ettiği ilişkilere dayalı bir bütün oluşturur."),
        c("MAT.4.2.5.", "Çarpma ve bölme işlemlerini çözümleyebilme", "Çarpma ve bölme işlemlerini fark eder.", "Çarpma ve bölme işlemlerini birbiri ile ilişkilendirir."),
        c("MAT.4.2.6.", "Dört işlem içeren yönergeler oluşturarak süreci yorumlayabilme", "Dört işlem içeren durumları inceler.", "İncelediği durumları yönergelere dönüştürür.", "Oluşturduğu yönergeyi yeniden ifade eder."),
        c("MAT.4.2.7.", "Dört işlem gerektiren problemleri çözebilme", ...PROBLEM),
        c("MAT.4.2.8.", "Dört işlem gerektiren problem durumlarını yapılandırabilme", "Dört işlem gerektiren problem durumlarına yönelik hiyerarşik, nedensel ya da mantıksal ilişkiler ortaya koyar.", "Dört işlem gerektiren problemleri kendi öz bilgisi ile elde ettiği ilişkilere dayalı olarak oluşturur."),
        c("MAT.4.2.9.", "Dört işlem bağlamında eşitliğin farklı anlamlarını yorumlayabilme", "Dört işlem bağlamında eşitlik kavramını inceler.", "Günlük yaşam durumlarını dört işleme dönüştürür.", "Dört işlem içeren günlük yaşam durumunu eşitlik kavramı bağlamında ifade eder."),
      ] },
      { tema: "Nesnelerin Geometrisi (1)", c: [
        c("MAT.4.3.1.", "Geometrik cisimlerin açınımlarını yapılandırabilme", "Geometrik cisimlerin açınımlarını inceleyerek yüzler arasında mantıksal ilişkiler ortaya koyar.", "Ortaya koyduğu ilişkilerden yola çıkarak geometrik cismi oluşturur."),
        c("MAT.4.3.2.", "Geometrik şekilleri kenar ve köşelerine göre yorumlayabilme", "Üçgen, kare ve dikdörtgenin kenar ve köşelerini belirler.", "Üçgen, kare ve dikdörtgenin kenar ve köşeleri arasında ilişki kurar.", "Kenarlarına göre üçgen çeşitlerini ve kare ile dikdörtgen ilişkisini ifade eder."),
        c("MAT.4.3.3.", "Geometrik şekillerin çevre uzunluğunu ölçmede matematiksel araç ve teknolojiden yararlanabilme", "Geometrik şekillerin çevre uzunluğunu ölçmede kullanılabilecek matematiksel araç ve teknolojiyi tanır.", "Üçgen, kare ve dikdörtgenin çevre uzunluğunu ölçmede kullanılabilecek matematiksel araç ve teknolojiyi belirler.", "Üçgen, kare ve dikdörtgenin çevre uzunluğunu ölçmek için ilgili matematiksel araç ve teknolojiyi kullanır."),
        c("MAT.4.3.4.", "Standart olmayan ölçü birimleri cinsinden şekillerin alanlarını tahmin edebilme", "Standart olmayan ölçü birimlerine ilişkin deneyimini, tahmine konu olan şeklin alanıyla ilişkilendirir.", "Belirlenen standart olmayan ölçü birimini kullanarak şeklin alanına ilişkin tahminde bulunur.", "Tahminini ölçüm sonuçlarıyla karşılaştırarak tahminine ilişkin yargıda bulunur."),
      ] },
      { tema: "Nesnelerin Geometrisi (2)", c: [
        c("MAT.4.3.5.", "Günlük yaşamdan örneklerle açıyı bir dönme miktarı olarak yorumlayabilme", "Günlük hayattan örneklerle açıyı belirler.", "Açıları bağlamından koparmadan günlük yaşam durumlarına dönüştürür.", "Açıyı bir dönme miktarı olarak yeniden ifade eder."),
        c("MAT.4.3.6.", "Açı ölçümüne ilişkin standart ölçme araçlarının gerekliliğini değerlendirebilme", "Açı ölçümü için bir ölçüt belirler.", "Ölçüte uygun olarak standart olmayan ölçü birimlerini kullanarak ölçme yapar.", "Standart olmayan ölçü birimlerine dayalı olarak elde ettiği sonuçları ölçüt ile karşılaştırır.", "Karşılaştırmalarına ilişkin olarak standart ölçme araçlarının gerekliliğine ilişkin yargıda bulunur."),
        c("MAT.4.3.7.", "Dik açıyı referans alarak açıları dar ve geniş olarak sınıflandırabilme", "Dik açının özelliklerini belirler.", "Dik açıyı referans alarak açı çeşitlerini dar ve geniş açı olarak ayırır.", "Dar ve geniş açının özelliklerini tasnif eder.", "Dar ve geniş açıyı adlandırır."),
      ] },
      { tema: "Nesnelerin Geometrisi (3)", c: [
        c("MAT.4.3.8.", "Geometrik nesneler ve şekiller üzerinden doğruya göre simetriyi yorumlayabilme", "Geometrik şekiller ve modeller üzerinden aynaya göre simetrinin özelliklerini inceler.", "Aynaya göre simetri ile doğruya göre simetri arasındaki ilişkiyi fark eder.", "Aynaya göre simetriyi, anlamını değiştirmeden kendi ifadeleriyle doğruya göre simetri olarak yeniden ifade eder."),
        c("MAT.4.3.9.", "Bir şeklin doğruya göre simetrisini yapılandırabilme", "Simetri doğrusunun özelliklerini inceleyerek doğruya göre simetriye ilişkin mantıksal ilişkiler ortaya koyar.", "Ortaya koyduğu ilişkilerden yola çıkarak şeklin doğruya göre simetrisini oluşturur."),
        c("MAT.4.3.10.", "Geometrik şekillere dayalı bir yapı oluşturabilmek için kodlama stratejilerini yapılandırabilme", "Geometrik şekil ve yapı bilgisi arasında mantıksal ilişkiler ortaya koyar.", "Ortaya koyduğu ilişkilerden yola çıkarak kodlama stratejisi oluşturur."),
      ] },
      { tema: "Olayların Olasılığı ve Veriye Dayalı Araştırma", c: [
        c("MAT.4.4.1.", "Günlük yaşamdan herhangi bir olayın olasılığını \"imkânsız, olabilir, kesin\" olarak belirleyebilme"),
        c("MAT.4.4.2.", "Kategorik veriye ve sayma ile elde edilen nicel veriye dayalı en çok iki veri grubu ile çalışabilme ve veriye dayalı karar verebilme", "Kategorik ve nicel veriye dayalı istatistiksel araştırma gerektiren günlük yaşam ile ilgili bir problem belirler.", "Kategorik ve nicel veriye dayalı betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.", "Kategorik ve nicel verileri toplamak için plan yapar.", "Kategorik verileri toplar ve analize hazırlar.", "Toplanan verileri analiz etmek için uygun görselleştirme araçlarını (çetele ve sıklık tablosu ile nesne, şekil ve nokta grafiği) seçer.", "Seçtiği araçlarla verileri görselleştirerek analiz eder.", "Araştırma sonuçlarını yorumlar.", "Araştırma sonuçlarını araştırma sorularına göre değerlendirir."),
      ] },
    ],
  };

  const DATA = { Matematik };
  const HARF = "abcçdefgğhıijklmnoöprsştuüvyz";
  return {
    kaynak: { Matematik: "MEB İlkokul Matematik Dersi Öğretim Programı (1-4), Türkiye Yüzyılı Maarif Modeli" },
    temalar: (ders, sinif) => (DATA[ders] && DATA[ders][sinif]) || null,
    var: (ders, sinif) => Boolean(DATA[ders] && DATA[ders][sinif]),
    bul(kod) {
      for (const d of Object.values(DATA)) for (const s of Object.values(d)) for (const t of s) for (const x of t.c) if (x.kod === kod) return Object.assign({ tema: t.tema }, x);
      return null;
    },
    /* Süreç bileşenlerini programdaki gibi a), b), c), ç) ile harfler. */
    harfli: (b) => b.map((x, i) => HARF[i] + ") " + x),
  };
})();
