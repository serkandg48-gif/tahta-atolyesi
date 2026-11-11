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
        c("MAT.1.4.1.", "Kategorik veriye dayalı temel veri grubu ile çalışabilme ve veriye dayalı karar verebilme", ...veri("çetele, sıklık tablosu ve nesne grafiğini", "Kategorik veriye dayalı betimleme gerektirebilecek araştırma soruları oluşturur.").map((x, i) => i === 0 ? "Kategorik veriye dayalı istatiksel araştırma gerektiren günlük yaşam durumu belirler." : x)),
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


  /* Kaynak: MEB, Hayat Bilgisi Dersi Öğretim Programı (1, 2 ve 3. Sınıflar), 2026,
     mufredat.meb.gov.tr/Dosyalar/2026728143113646-Hayat BilgisiDÖP.pdf */
  const YORUM = (k) => [`${k} ilişkin verilen örnekleri inceler.`, `${k} ilişkin verilen örnekleri bağlamdan kopmadan özgün örneklere dönüştürür.`, `${k} ilişkin oluşturduğu özgün örnekleri kendi cümleleri ile ifade eder.`];
  const KAYNAK = (k) => [`${k} bilgi toplayacağı kaynakları belirler.`, `${k} belirlediği kaynaklardan bilgileri bulur.`, `${k} ulaştığı kaynakların uygunluğunu açıklar.`, `${k} kaynaklardan ulaştığı bilgileri kaydeder.`];
  const HayatBilgisi = {
    1: [
      { tema: "Ben ve Okulum", c: [
        c("HB.1.1.1.", "Öğretmeni ve arkadaşlarıyla tanışabilme"),
        c("HB.1.1.2.", "Sınıf ve okul ortamını tanıyabilme"),
        c("HB.1.1.3.", "Sınıf ve okul ortamında kurallara uygun davranabilme"),
        c("HB.1.1.4.", "Bireysel özelliklerini açıklayabilme"),
      ] },
      { tema: "Sağlığım ve Güvenliğim", c: [
        c("HB.1.2.1.", "Sağlıklı büyüme ve gelişme için yapılması gerekenleri belirleyebilme"),
        c("HB.1.2.2.", "Kişisel alan sınırlarını koruyabilme"),
        c("HB.1.2.3.", "Temel trafik kurallarına uygun davranabilme"),
        c("HB.1.2.4.", "Acil durumlarda yapılması gerekenleri belirleyebilme"),
      ] },
      { tema: "Ailem ve Toplum", c: [
        c("HB.1.3.1.", "Ailenin özelliklerini ifade edebilme"),
        c("HB.1.3.2.", "Aile yaşamında nezaket ve görgü kurallarına uygun davranabilme"),
        c("HB.1.3.3.", "Aile bireylerinin görev ve sorumluluklarını çözümleyebilme", "Aile içindeki görev ve sorumluluklarını belirler.", "Aile bireylerinin görev ve sorumlulukları ilişkilendirir."),
      ] },
      { tema: "Yaşadığım Yer ve Ülkem", c: [
        c("HB.1.4.1.", "Yaşadığı yerin ve ülkemizin genel özelliklerini açıklayabilme"),
        c("HB.1.4.2.", "Türk bayrağı ve İstiklâl Marşı'nın önemini ifade edebilme"),
        c("HB.1.4.3.", "Mustafa Kemal Atatürk'ün hayatıyla ilgili bilgileri ifade edebilme"),
        c("HB.1.4.4.", "Millî gün ve bayramlarda yaşadığı duyguları ifade edebilme"),
        c("HB.1.4.5.", "Dinî gün ve bayramlarda yaşadığı duyguları ifade edebilme"),
      ] },
      { tema: "Doğa ve Çevre", c: [
        c("HB.1.5.1.", "Yakın çevresinde bulunan doğadaki varlıkları gözlemleyebilme", "Doğadaki varlıkları gözlemleme amacını belirler.", "Doğadaki varlıklara ilişkin veri toplar.", "Doğadaki varlıklara ilişkin topladığı verileri sınıflandırarak kaydeder."),
        c("HB.1.5.2.", "Modeller üzerinden gök cisimlerini karşılaştırabilme", "Modeller üzerinden gök cisimlerinin (Güneş, Dünya ve Ay) özelliklerini belirler.", "Modeller üzerinden gök cisimlerinin (Güneş, Dünya ve Ay) benzerliklerini listeler.", "Modeller üzerinden gök cisimlerinin (Güneş, Dünya ve Ay) farklılıklarını listeler."),
        c("HB.1.5.3.", "Afet türlerini tanıyabilme"),
        c("HB.1.5.4.", "Geri dönüştürülebilen atıkları sınıflandırabilme", "Geri dönüştürülebilen atıkları belirler.", "Geri dönüştürülebilen atıkları ayrıştırır.", "Geri dönüştürülebilen atıkları tasnif eder.", "Geri dönüştürülebilen atıkları etiketler."),
      ] },
      { tema: "Bilim, Teknoloji ve Sanat", c: [
        c("HB.1.6.1.", "Bilimle ilgili merak ettiklerini sorabilme", "Bilim ile ilgili merak ettiği konuları belirler.", "Bilim ile ilgili merak ettiği konular hakkında sorular sorar."),
        c("HB.1.6.2.", "Teknoloji ile ilgili merak ettiklerini sorabilme", "Teknoloji ile ilgili merak ettiği konuları belirler.", "Teknoloji ile merak ettiği konular hakkında sorular sorar."),
        c("HB.1.6.3.", "Sanatla ilgili merak ettiklerini sorabilme", "Sanat ile ilgili merak ettiği konuları belirler.", "Sanat ile ilgili merak ettiği konular hakkında sorular sorar."),
      ] },
    ],
    2: [
      { tema: "Ben ve Okulum", c: [
        c("HB.2.1.1.", "Planlı olmanın kişisel yaşama etkilerini fark edebilme"),
        c("HB.2.1.2.", "Öğretmen ve arkadaşlarıyla etkili iletişim kurabilme"),
        c("HB.2.1.3.", "Arkadaşlık ilişkilerini düzenleyebilme"),
        c("HB.2.1.4.", "Sınıf içi karar alma süreçlerinde sosyal temas oluşturabilme", "Sınıf içi karar alma süreçlerinde grup iletişimini başlatır.", "Sınıf içi karar alma süreçlerinde grup etkileşimine katılır.", "Sınıf içi karar alma süreçlerinde grup iletişimine katkıda bulunur.", "Sınıf içi karar alma süreçlerinde grup iletişimini değerlendirir."),
      ] },
      { tema: "Sağlığım ve Güvenliğim", c: [
        c("HB.2.2.1.", "Sağlıklı büyüme ve gelişme ile alışkanlıkları arasındaki ilişkiyi çözümleyebilme", "Sağlıklı büyüme ve gelişmeye yönelik alışkanlıkları belirler.", "Sağlıklı büyüme ve gelişme ile alışkanlıkları arasındaki ilişkiyi belirler."),
        c("HB.2.2.2.", "Çevrim içi ortamlarda kişisel güvenliğini sağlayabilme"),
        c("HB.2.2.3.", "Temel trafik işaret levhalarını tanıyabilme"),
        c("HB.2.2.4.", "Acil bir durumda yetkililerle etkili iletişim kurabilme"),
      ] },
      { tema: "Ailem ve Toplum", c: [
        c("HB.2.3.1.", "Ailenin önemini yorumlayabilme", ...YORUM("Ailenin önemine")),
        c("HB.2.3.2.", "Toplumsal yaşamda nezaket ve görgü kurallarına uygun davranabilme"),
        c("HB.2.3.3.", "Yakın çevresinde üzerine düşen görev ve sorumlulukları günlük yaşamına yansıtabilme", "Yakın çevresinde üzerine düşen görev ve sorumluluklarını gözden geçirir.", "Yakın çevresinde üzerine düşen görev ve sorumluluklarına ilişkin çıkarımda bulunur.", "Yakın çevresinde üzerine düşen görev ve sorumluluklarına ilişkin değerlendirme yapar."),
      ] },
      { tema: "Yaşadığım Yer ve Ülkem", c: [
        c("HB.2.4.1.", "Yakın çevresinde bulunan tarihî mekân ve doğal güzellikleri belirleyebilme"),
        c("HB.2.4.2.", "Yaşadığı yerin yönetim birimleri ile ilgili kaynaklardan bilgi toplayabilme", ...KAYNAK("Yaşadığı yerin yönetim birimleri ile ilgili").map((x, i) => i === 2 ? "Yaşadığı yerin yönetim birimleri ile ilgili kullanacağı kaynakların uygunluğunu açıklar." : x)),
        c("HB.2.4.3.", "Mustafa Kemal Atatürk'ün öğrencilik hayatını ifade edebilme"),
        c("HB.2.4.4.", "Millî gün ve bayramların önemini yorumlayabilme", ...YORUM("Millî gün ve bayramların önemine")),
        c("HB.2.4.5.", "Dinî gün ve bayramların önemini yorumlayabilme", ...YORUM("Dinî gün ve bayramların önemine")),
      ] },
      { tema: "Doğa ve Çevre", c: [
        c("HB.2.5.1.", "Hava olayları ve mevsimler arasındaki ilişkiyi çözümleyebilme", "Hava olayları ve mevsimlerin özelliklerini belirler.", "Hava olayları ve mevsimler arasındaki ilişkiyi belirler."),
        c("HB.2.5.2.", "Doğadan yararlanarak yönünü belirleyebilme"),
        c("HB.2.5.3.", "Afetlere karşı alınması gereken önlemlere ilişkin bilgi toplayabilme", "Afetlere karşı alınması gereken önlemlere ilişkin bilgi toplamak için kullanacağı araçları belirler.", "Belirlediği araçları kullanarak afetlere karşı alınması gereken önlemlere ilişkin bilgileri bulur.", "Afetlere karşı alınması gereken önlemlere ilişkin bulduğu bilgileri doğrular.", "Afetlere karşı alınması gereken önlemlere ilişkin bulduğu bilgileri kaydeder."),
        c("HB.2.5.4.", "Doğal kaynakları tasarruflu kullanma davranışlarını günlük yaşamına yansıtabilme", "Doğal kaynakları kullanırken davranışlarını gözden geçirir.", "Doğal kaynakları tasarruflu kullanmaya yönelik çıkarımlarda bulunur.", "Doğal kaynakları tasarruflu kullanmaya yönelik ulaştığı çıkarımları değerlendirir."),
      ] },
      { tema: "Bilim, Teknoloji ve Sanat", c: [
        c("HB.2.6.1.", "Bilim insanlarının bilime katkılarına yönelik kaynaklardan bilgi toplayabilme", ...KAYNAK("Bilim insanlarının bilime katkılarına ilişkin")),
        c("HB.2.6.2.", "Teknolojik bir ürünün değişim ve sürekliliğine dair kanıta dayalı öngörüde bulunabilme", "Teknolojik bir ürünün zaman içindeki değişimini kanıtlara dayalı olarak ilişkilendirir.", "Teknolojik bir ürünün gelecekteki değişimine ilişkin çıkarım yapar."),
        c("HB.2.6.3.", "Sanatın günlük yaşamdaki yerini belirleyebilme"),
      ] },
    ],
    3: [
      { tema: "Ben ve Okulum", c: [
        c("HB.3.1.1.", "Güçlü ve gelişime açık olduğu alanlara karar verebilme", "Güçlü ve gelişime açık olduğu alanlara ilişkin karar vermeye yönelik amacını belirler.", "Güçlü ve gelişime açık olduğu alanlara ilişkin karar vermeye yönelik bilgi toplar.", "Güçlü ve gelişime açık olduğu alanlara ilişkin karar vermeye yönelik seçenekler oluşturur.", "Güçlü ve gelişime açık olduğu alanlara ilişkin karar vermeye yönelik seçenekler üzerinde mantıksal denetleme yapar.", "Güçlü ve gelişime açık olduğu alanlara ilişkin karar vermeye yönelik seçenekler arasından seçim yapar.", "Güçlü ve gelişime açık olduğu alanlara ilişkin verdiği karara yönelik yansıtma yapar."),
        c("HB.3.1.2.", "Okuldaki hak ve sorumluluklarına uygun davranabilme"),
        c("HB.3.1.3.", "Çocuk haklarını tanıtmak için fikirlerini eyleme dönüştürebilme", "Çocuk haklarını tanıtmak için plan yapar.", "Çocuk haklarını tanıtmak için yaptığı planı uygular.", "Çocuk haklarını tanıtmak için uyguladığı planı değerlendirir."),
      ] },
      { tema: "Sağlığım ve Güvenliğim", c: [
        c("HB.3.2.1.", "Sağlığını korumaya yönelik davranışlarını düzenleyebilme"),
        c("HB.3.2.2.", "Güvenliğini tehdit eden bir durumla karşılaştığında yapılması gerekenleri sorgulayabilme", "Güvenliğini tehdit eden durumları tanımlar.", "Güvenliğini tehdit eden bir durumla karşılaştığında yapılması gerekenler hakkında sorular sorar.", "Güvenliğini tehdit eden bir durumla karşılaştığında yapılması gerekenler hakkında bilgi toplar.", "Güvenliğini tehdit eden bir durumla karşılaştığında yapılması gerekenler hakkında topladığı bilgilerin doğruluğunu değerlendirir.", "Güvenliğini tehdit eden bir durumla karşılaştığında yapılması gerekenler hakkında çıkarım yapar."),
        c("HB.3.2.3.", "Trafik kurallarına uymanın önemine ilişkin özgün ürünler sentezleyebilme", "Trafik kurallarına uymanın önemini belirler.", "Trafik kurallarına uyma ile güvenliği arasında ilişki kurar.", "Trafik kurallarına uymanın önemine ilişkin özgün bir ürün oluşturur."),
      ] },
      { tema: "Ailem ve Toplum", c: [
        c("HB.3.3.1.", "Aile ve toplum arasındaki ilişkiyi çözümleyebilme", "Aile ve toplumun özelliklerini belirler.", "Aile ve toplum arasındaki ilişkiyi belirler."),
        c("HB.3.3.2.", "Yardıma ihtiyacı olan bireylerin yaşamını kolaylaştırmak için fikirlerini eyleme dönüştürebilme", "Yardıma ihtiyacı olan bireylerin yaşamını kolaylaştırmak için plan yapar.", "Yardıma ihtiyacı olan bireylerin yaşamını kolaylaştırmak için yaptığı planı uygular.", "Yardıma ihtiyacı olan bireylerin yaşamını kolaylaştırmak için yaptığı planı değerlendirir."),
        c("HB.3.3.3.", "Mesleklerin toplumsal yaşamdaki önemini yorumlayabilme", ...YORUM("Mesleklerin toplumsal yaşamdaki önemine")),
      ] },
      { tema: "Yaşadığım Yer ve Ülkem", c: [
        c("HB.3.4.1.", "Yakın çevresindeki tarihî mekân ve doğal güzelliklerin korunmasının önemini fark edebilme"),
        c("HB.3.4.2.", "Ülkemizin yönetim şekli ile ilgili kaynaklardan bilgi toplayabilme", ...KAYNAK("Ülkemizin yönetim şekli ile ilgili")),
        c("HB.3.4.3.", "Mustafa Kemal Atatürk'ün kişilik özelliklerini çözümleyebilme", "Mustafa Kemal Atatürk'ün kişilik özelliklerini ve elde ettiği başarıları belirler.", "Mustafa Kemal Atatürk'ün kişilik özellikleri ile başarıları arasında ilişki kurar."),
        c("HB.3.4.4.", "Millî birlik ve beraberliğimizin ülkemize katkılarını açıklayabilme"),
      ] },
      { tema: "Doğa ve Çevre", c: [
        c("HB.3.5.1.", "Doğadaki varlıkların insan yaşamı için önemini yorumlayabilme", ...YORUM("Doğadaki varlıkların insan yaşamı için önemine")),
        c("HB.3.5.2.", "Krokiyi kullanarak bulunduğu yerin konumunu algılayabilme", "Krokiyi kullanarak bulunduğu yerin konumunu belirler.", "Bulunduğu yerin konumsal görselleştirmesini yapar.", "Bulunduğu yerin konumsal özelliklerini özetler."),
        c("HB.3.5.3.", "Afetlere yönelik yapılması gerekenleri sınıflandırabilme", "Afetlere yönelik yapılması gerekenlere ilişkin ölçütleri afet öncesi, afet anı ve afet sonrası olarak belirler.", "Afetlere yönelik yapılması gerekenleri afet öncesi, afet anı ve afet sonrası olarak ayrıştırır.", "Afetlere yönelik yapılması gerekenleri afet öncesi, afet anı ve afet sonrası olarak tasnif eder.", "Afetlere yönelik yapılması gerekenleri afet öncesi, afet anı ve afet sonrası olarak etiketler."),
        c("HB.3.5.4.", "Çevresel sürdürülebilirliğe yönelik kaynaklardan bilgi toplayabilme", ...KAYNAK("Çevresel sürdürülebilirliğe yönelik")),
      ] },
      { tema: "Bilim, Teknoloji ve Sanat", c: [
        c("HB.3.6.1.", "Bilimsel gelişmelerin günlük yaşama etkisini yorumlayabilme", ...YORUM("Bilimsel gelişmelerin günlük yaşama etkisine")),
        c("HB.3.6.2.", "Teknolojik gelişmelerin günlük yaşama etkisini çözümleyebilme", "Teknolojik gelişmelerin günlük yaşama etkisini belirler.", "Teknolojik gelişmelerle günlük yaşam arasında ilişki kurar."),
        c("HB.3.6.3.", "Sanatçıların sanata katkılarına yönelik kaynaklardan bilgi toplayabilme", ...KAYNAK("Sanatçıların sanata katkılarına yönelik")),
      ] },
    ],
  };

  /* Kaynak: MEB, Fen Bilimleri Dersi Öğretim Programı (3-8. Sınıflar), 2026,
     mufredat.meb.gov.tr/Dosyalar/20268149031570-Fen Bilimleri (3-8) DÖP.pdf */
  const FenBilimleri = {
    3: [
      { tema: "Bilimsel Keşif Yolculuğu", c: [
        c("FB.3.1.1.", "Bilimsel bilgiye ulaşma yollarını sorgulayabilme", "Merak ettiği bilimsel bir konuyu tanımlar.", "İlgili konu hakkında sorular sorar.", "Sorularını cevaplamaya yönelik bilgi toplar."),
        c("FB.3.1.2.", "Bilim insanlarının özelliklerini genelleyebilme", "Bilim insanları hakkında bilgi toplar.", "Bilim insanlarının ortak özelliklerini belirler.", "Bilim insanlarının ortak olmayan özelliklerini belirler."),
      ] },
      { tema: "Canlılar Dünyasına Yolculuk", c: [
        c("FB.3.2.1.", "Canlıları; mikroskopla görülebilen canlılar, mantarlar, bitkiler ve hayvanlar olarak sınıflandırabilme", "Canlıların benzer ve farklı niteliklerini belirler.", "Canlıları niteliklerine göre ayırır.", "Canlıları gruplandırır."),
        c("FB.3.2.2.", "Canlıların çevrelerini farklı yollarla algılamaları konusunda bilimsel çıkarım yapabilme", "Canlıların çevrelerini algılama biçimlerine ilişkin nitelikleri tanımlar.", "Duyu organlarının işlevleri ile ilgili veri toplayarak kaydeder.", "Canlıların çevrelerini farklı biçimlerde algılamalarına ilişkin verileri yorumlayarak değerlendirir."),
        c("FB.3.2.3.", "Canlıların yaşam döngülerini açıklamada tümevarımsal akıl yürütebilme", "Canlıların yaşam döngüleri ile ilgili örüntüleri bulur.", "Canlıların yaşam döngüleri ile ilgili genelleme yapar."),
      ] },
      { tema: "Yer Bilimciler İş Başında", c: [
        c("FB.3.3.1.", "Kayaçlar, madenler ve mineraller ile ilgili tümdengelimsel akıl yürütebilme", "Kayaçlar, madenler ve mineralleri belirler.", "Kayaçlar, madenler ve mineraller arasında ilişki kurar.", "Kayaçlar, madenler ve mineraller arasında genelden genele veya genelden özele çıkarım yapar."),
        c("FB.3.3.2.", "Fosil oluşumu ile ilgili bilgileri sentezleyebilme", "Fosil oluşumunu gösteren sürecin bütün ve parçalarını belirler.", "Süreci oluşturan aşamalar arasında ilişki kurar.", "Fosillerin oluşum sürecini oluşturan aşamaları uygun sırayla bir bütün hâline getirir."),
      ] },
      { tema: "Maddeyi Tanıyalım, Karıştırıp Ayıralım", c: [
        c("FB.3.4.1.", "Çevresindeki maddeleri hâllerine göre sınıflandırabilme", "Çevresindeki maddelerin niteliklerini tanımlar.", "Çevresindeki maddeleri niteliklerine göre ayırır.", "Çevresindeki maddeleri hâllerine göre gruplandırır."),
        c("FB.3.4.2.", "Günlük yaşamda karşılaştığı karışımların ayrılmasında kullanılabilecek uygun yöntemleri kullanarak deney yapabilme", "Karışımların ayrılmasında kullanılabilecek yöntemlerle ilgili deney tasarlar.", "Deneyle ilgili ölçme ve veri analizi yapar."),
        c("FB.3.4.3.", "Atıkların ayrıştırılmasına ilişkin problem çözebilme", "Atıkların ayrıştırılmasına ilişkin problemi yapılandırır.", "Atıkların ayrıştırılmasına ilişkin problemi özetler.", "Atıkların ayrıştırılmasına ilişkin çözüm önerilerini gözleme ya da veriye dayalı tahmin eder."),
      ] },
      { tema: "Hareketi Keşfediyorum", c: [
        c("FB.3.5.1.", "Varlıkların hareket durumlarını gözleme dayalı tahmin edebilme", "Varlıkların hareket durumlarına ilişkin ön gözlem ve/veya deneyimlerini ilişkilendirir.", "Varlıkların hareket durumlarına ilişkin çıkarım yapar.", "Varlıkların hareket durumlarının sonuçlarına ilişkin yargıda bulunur."),
        c("FB.3.5.2.", "Kuvvetin varlıklar üzerindeki etkilerini bilimsel gözleme dayalı tahmin edebilme", "Varlıkların hareketinin ve şekil değiştirmesinin nedenine ilişkin ön bilgi ve deneyimleriyle önerme oluşturur.", "Varlıkların hareketinin ve şekil değiştirmesinin nedenine ilişkin gözleme dayalı olan önermeleri karşılaştırır.", "Kuvvetin varlıkların hareketine ve şekil değiştirmesine etkilerine ilişkin tahminlerini temellendirmek için gözlem verilerinden sonuç çıkarır."),
      ] },
      { tema: "Yaşamımızı Kolaylaştıran Elektrik", c: [
        c("FB.3.6.1.", "Bazı araç gerecin elektrikli olduğuna ilişkin bilimsel çıkarım yapabilme", "Farklı araç gerecin niteliklerini tanımlar.", "Elektrikli araç gereçle ilgili veri toplayarak kaydeder.", "Elektrikli araç gereçle ilgili verileri değerlendirir."),
        c("FB.3.6.2.", "Elektrikli araç gerecin güvenli kullanımı ile ilgili eleştirel düşünebilme", "Elektrikli araç gerecin güvenli kullanımı ile ilgili verilen bir olay/konu/problem veya durumu sorgular.", "Elektrikli araç gerecin kullanımında güvenliğin sağlanabileceğine yönelik akıl yürütür.", "Akıl yürütmeyle ulaştığı çıkarımları yansıtır."),
        c("FB.3.6.3.", "Elektriği tasarruflu kullanma konusunda bilimsel veriye dayalı tahmin edebilme", "Elektriği tasarruflu kullanma konusunda verilere ve/veya ön bilgilere dayalı önerme oluşturur.", "Elektriği tasarruflu kullanma üzerine nicel ölçüm verilerine dayalı önermelerini gerekçelendirir.", "Hesaplamalarına dayalı olarak tahmin eder."),
      ] },
      { tema: "Toprağı Tanıyorum, Tarımı Keşfediyorum", c: [
        c("FB.3.7.1.", "Toprak oluşumunu ve yapısını bilimsel olarak gözlemleyebilme", "Toprağın oluşumuna ve yapısına ilişkin nitelikleri tanımlar.", "Toprağın yapısına ilişkin veri toplayarak kaydeder.", "Toprağın yapısına ilişkin topladığı verileri açıklar."),
        c("FB.3.7.2.", "Bir bitkinin yetişmesi için gerekenleri genelleyebilme", "Çevresinde bulunan tarım ürünlerinin nasıl yetiştirildiği konusunda araştırma yaparak bilgi toplar.", "Bitki yetiştirmek için gerekli ortak özellikleri belirler.", "Farklı bitkilerin yetiştirilmesinde ortak olmayan özellikleri belirler."),
      ] },
      { tema: "Canlıların Yaşam Alanlarına Yolculuk", c: [
        c("FB.3.8.1.", "Canlıların yaşam alanlarının özelliklerini belirlemeye yönelik kanıt kullanabilme", "Canlıların yaşam alanlarının özelliklerine ilişkin veri toplayarak kaydeder.", "Canlıların yaşam alanlarına ilişkin veri setleri oluşturur.", "Canlıların yaşam alanlarının özelliklerine ilişkin veriye dayalı açıklama yapar."),
        c("FB.3.8.2.", "Yaşam alanındaki canlı çeşitliliğini operasyonel olarak tanımlayabilme", "Yaşam alanının özelliklerini tanımlar.", "Yaşam alanındaki canlı çeşitliliği ile ilgili ölçüm yapar.", "Canlı çeşitliliğinin tanımını yapar."),
        c("FB.3.8.3.", "Yaşam alanlarının korunması için yapılacakları sorgulayabilme", "Merak ettiği konuyu tanımlar.", "İlgili konu hakkında sorular sorar.", "İlgili konu hakkında bilgi toplar.", "Toplanan bilgilerin doğruluğunu değerlendirir.", "Toplanan bilgiler üzerinde çıkarım yapar."),
      ] },
    ],
    4: [
      { tema: "Bilime Yolculuk", c: [
        c("FB.4.1.1.", "Bilimin özellikleri ile ilgili deneyimlerini yansıtabilme", "Bilim ile ilgili bilgi ve deneyimini gözden geçirir.", "Bilimin özellikleri ile ilgili çıkarım yapar.", "Bilimin özellikleri ile ilgili ulaşılan çıkarımları değerlendirir."),
        c("FB.4.1.2.", "Bilgi kaynağının güvenilirliğini sorgulayabilme", "Merak ettiği bilimsel bir konuyu tanımlar.", "İlgili konu hakkında sorular sorar.", "İlgili konu hakkında teknolojik araçlar ve diğer kaynakları kullanarak bilgi toplar.", "Toplanan bilgilerden hareketle bilginin doğruluğunu değerlendirir.", "Yaptığı değerlendirmeler sonucunda bilgi kaynaklarının güvenilirliği ile ilgili çıkarım yapar."),
      ] },
      { tema: "Sağlıklı Besleniyorum", c: [
        c("FB.4.2.1.", "Besin içeriklerini ayırt etmek için deney yapabilme", "Besinlerdeki protein, karbohidrat, yağ ve su içeriğini ayırt etmek için deney tasarlar.", "Yaptığı deneyde ölçme ve veri analizi yapar."),
        c("FB.4.2.2.", "Besinlerde vitamin ve/veya mineral bulunması durumunu genelleyebilme", "Besinlerdeki vitamin ve mineraller ile ilgili bilgi toplar.", "Besinlerdeki ortak olan özellikleri belirler.", "Besinlerdeki ortak olmayan özellikleri belirler.", "Örüntüler üzerinden besinlerde vitamin ve/veya minerallerin bulunduğu önermesinde bulunur."),
        c("FB.4.2.3.", "Besinlerin işlevleri ile ilgili hipotez oluşturabilme", "Besinlerin işlevleri ile ilgili problemi tanımlar.", "Besinlerin işlevleri ve vücudumuzdaki görevleri arasındaki neden-sonuç ilişkilerini belirler.", "Besinlerin içerikleri ile ilgili verilen değişkenleri belirler.", "Besinlerin işlevleri ile ilgili değişkenleri kontrol eder.", "Besinlerin işlevleri ve sağlıklı yaşam arasındaki ilişkiye yönelik önerme sunar."),
      ] },
      { tema: "Dünyamızı Keşfedelim", c: [
        c("FB.4.3.1.", "Dünya'nın şekli ile ilgili bilimsel gözleme dayalı tahmin yapabilme", "Dünya'nın şekli ile ilgili ön bilgi ve deneyimlerine dayalı önerme oluşturur.", "Dünya'nın şekli ile ilgili gözleme dayalı olan önermeleri karşılaştırır.", "Dünya'nın şekli ile ilgili tahminlerini temellendirmek için gözlem verilerinden sonuç çıkarır.", "Dünya'nın şekli ile ilgili veriye dayalı tahminde bulunur.", "Dünya'nın şekli ile ilgili verilere dayalı tahminlerin geçerliğini sorgular."),
        c("FB.4.3.2.", "Dünya'nın yapısıyla ilgili bilimsel model oluşturabilme", "Dünya'nın yapısını açıklamak için model önerir.", "Dünya'nın yapısını açıklamak için yeni kanıtlarla modeli geliştirir."),
        c("FB.4.3.3.", "Dünya'nın hareketlerini gözlemlerine dayanarak tahmin edebilme", "Dünya'nın hareketleri ile ilgili önceki gözlem ve/veya deneyimini ilişkilendirir.", "Dünya'nın hareketlerine ilişkin çıkarım yapar.", "Dünya'nın hareketlerinin sonuçlarına ilişkin yargıda bulunur."),
      ] },
      { tema: "Maddenin Değişimi", c: [
        c("FB.4.4.1.", "Maddelerin hâl değişimine yönelik bilimsel çıkarım yapabilme", "Maddelerin hallerine yönelik nitelikleri tanımlar.", "Maddelerin hâl değişimine yönelik verileri kaydeder.", "Maddelerin hâl değişimine yönelik verileri yorumlayarak değerlendirir."),
        c("FB.4.4.2.", "Maddelerin ısı etkisiyle değişimine yönelik deney yapabilme", "Maddelerin ısı etkisiyle değişimine yönelik deney tasarlar.", "Maddelerin ısı etkisiyle değişimine yönelik ölçme veri analizi yapar."),
      ] },
      { tema: "Mıknatısı Keşfediyorum", c: [
        c("FB.4.5.1.", "Mıknatısın kutupları ve birbirleriyle etkileşimleri ile ilgili tümevarımsal akıl yürütebilme", "Mıknatıs çeşitlerinin kutupları ve birbiriyle etkileşimleri ile ilgili örüntü bulur.", "Mıknatısın kutupları ve birbiriyle etkileşimleri ile ilgili genelleme yapar."),
        c("FB.4.5.2.", "Mıknatısın etki ettiği maddelere ilişkin bilimsel gözleme dayalı tahmin yapabilme", "Mıknatısın etki ettiği maddelere ilişkin ön bilgi ve deneyimlerine dayanarak önerme oluşturur.", "Mıknatısın etki ettiği maddelere ilişkin gözleme dayalı önermeleri karşılaştırır.", "Mıknatısın etki ettiği maddelere ilişkin tahminlerini temellendirmek için gözlem verilerinden sonuç çıkarır.", "Mıknatısın etki ettiği maddelerle ilgili gözlemlenmemiş duruma ilişkin tahminde bulunur.", "Tahminlerin geçerliğini sorgular."),
        c("FB.4.5.3.", "Mıknatısın kullanım alanlarına yönelik bilimsel olarak sorgulayabilme", "Mıknatısın kullanım alanlarına yönelik bir soru veya problem tanımlar.", "Sorusunu/problemini cevaplamada kullanabileceği bir model geliştirir.", "Modelini oluşturmaya yönelik araştırma planlayarak gerçekleştirir.", "Oluşturduğu modele ilişkin verileri analiz ederek yorumlar.", "Oluşturduğu modelle ilgili sorunlara ilişkin kanıta dayalı açıklama yaparak çözüm üretir.", "Oluşturduğu modeli değerlendirerek paylaşır."),
      ] },
      { tema: "Elektrik ve Enerji Kaynakları", c: [
        c("FB.4.6.1.", "Basit bir elektrik devresi kurmaya ilişkin bilimsel olarak sorgulayabilme", "Devre elemanlarını kullanarak basit bir elektrik devresi kurmaya ilişkin soru veya problemi tanımlar.", "Sorusunu/problemini cevaplamada kullanacağı basit bir elektrik devresi modeli geliştirir.", "Basit bir elektrik devresinde devre elemanlarına ve işlevlerine ilişkin araştırmayı planlayarak gerçekleştirir.", "Basit bir elektrik devresine ilişkin verileri analiz ederek yorumlar.", "Elektrik devresinin çalışıp çalışmamasına yönelik kanıta dayalı açıklama yaparak çözüm üretir.", "Çalışan basit bir elektrik devresi kurmaya ilişkin bilgiyi değerlendirerek paylaşır."),
        c("FB.4.6.2.", "Elektrik üretiminde yenilenebilir ve yenilenemeyen enerji kaynaklarını kullanmaya ilişkin eleştirel düşünebilme", "Elektrik üretiminde yenilenebilir ve yenilenemeyen enerji kaynaklarını kullanmaya ilişkin bir durumu veya problemi sorgular.", "Elektrik üretiminde yenilenebilir ve yenilenemeyen enerji kaynaklarını kullanmaya ilişkin durum veya problemin canlılar ve çevre üzerine etkileri konusunda akıl yürütür.", "Enerji kaynaklarının sürdürülebilirliklerine ilişkin akıl yürütmeyle ulaştığı çıkarımları yansıtır."),
      ] },
      { tema: "Işığı Tanıyalım", c: [
        c("FB.4.7.1.", "Görme olayının gerçekleşebilmesi için ışığın rolüne ilişkin deney yapabilme", "Görme olayının gerçekleşebilmesi için ışığın rolüne ilişkin deney tasarlar.", "Görme olayında ışığın rolüne ilişkin deneyde ölçme ve veri analizi yapar."),
        c("FB.4.7.2.", "Doğal ve yapay ışık kaynaklarını karşılaştırabilme", "Çevresindeki ışık kaynaklarına ilişkin özellikleri belirler.", "Işık kaynaklarının benzerliklerini listeler.", "Işık kaynaklarının farklılıklarını listeler."),
        c("FB.4.7.3.", "Işık kirliliğinin canlılara etkisine ilişkin problemleri çözebilme", "Işık kirliliğinin canlılara etkisine ilişkin problemi yapılandırır.", "Problemi özetler.", "Problemin çözümüne yönelik gözleme dayalı/mevcut bilgiye/veriye dayalı tahmin eder.", "Problemin çözümüne yönelik önermeler üzerinden akıl yürütür.", "Problemin çözümüne ilişkin yansıtmada/değerlendirmede bulunur."),
      ] },
      { tema: "Sürdürülebilir Yaşam Alanları", c: [
        c("FB.4.8.1.", "Sürdürülebilir bir yaşam alanı kurmayı bilimsel olarak sorgulayabilme", "Sürdürülebilir bir yaşam alanı kurmaya ilişkin soru veya problem tanımlar.", "Sorusunu/problemini cevaplamada kullanabileceği bir sürdürülebilir yaşam alanı modeli geliştirir.", "Sürdürülebilir bir yaşam alanı kurmaya ilişkin araştırma planlayarak modelini gerçekleştirir.", "Yaşam alanının sürdürülebilirliğine ilişkin verileri analiz ederek yorumlar.", "Yaşam alanının sürdürülebilir olup olmadığına ilişkin kanıta dayalı açıklama yaparak çözüm üretir.", "Sürdürülebilir bir yaşam alanı kurmaya ilişkin bilgiyi değerlendirerek paylaşır."),
      ] },
    ],
  };

  const DATA = { Matematik, "Hayat Bilgisi": HayatBilgisi, "Fen Bilimleri": FenBilimleri };
  const HARF = "abcçdefgğhıijklmnoöprsştuüvyz";
  return {
    kaynak: { Matematik: "MEB İlkokul Matematik Dersi Öğretim Programı (1-4), Türkiye Yüzyılı Maarif Modeli", "Hayat Bilgisi": "MEB Hayat Bilgisi Dersi Öğretim Programı (1, 2 ve 3. sınıflar), Türkiye Yüzyılı Maarif Modeli", "Fen Bilimleri": "MEB Fen Bilimleri Dersi Öğretim Programı (3-8. sınıflar), Türkiye Yüzyılı Maarif Modeli" },
    birim: { "Hayat Bilgisi": "Öğrenme alanı", "Fen Bilimleri": "Ünite" },
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
