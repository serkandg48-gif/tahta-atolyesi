/* Türkçe, okuma sevgisi: Kitap raporu seçenekleri. Çocuk okuduğu kitabı nasıl anlatacağını kendisi seçer.
   Her seçenek A4 şablon: tahtada yansıtılır, üzerine yazılır, boş ya da dolu yazdırılır (rutin şablon motoru). */
(function () {
  const { h } = T;
  const ALT = "Kitap raporu seçenekleri. Tahta Atölyesi";
  const K = (id, emo, ad, kisa, tur, tip, yon, adim, ogretmen, ek) => Object.assign({ id: "kr-" + id, emo, ad, kisa, tur, tip, yon, adim, ogretmen, kat: [], konuAd: "Kitap", alt: ALT }, ek || {});
  const RAPORLAR = [
    K("mektup", "💌", "Kahramana mektup", "Kitabın kahramanına bir mektup yaz.", ["yaz"], "gunluk", "dikey",
      [["Sevgili ...", "Kahramana ne söylemek istersin? Ona neler sormak istersin? Kitapta en çok hangi davranışını sevdin?"], ["Ben olsaydım", "Senin yerinde olsaydım şunu yapardım..."], ["Sevgilerimle", "Adını yaz, bir de küçük bir resim çiz."]],
      "Karakterle bağ kurmayı ve duygu dilini destekler. Mektup biçimini (hitap, gövde, kapanış) birlikte hatırlayın."),
    K("afis", "🎬", "Film afişi", "Kitap film olsaydı afişini sen tasarla.", ["ciz"], "afis", "dikey",
      [["Filmin adı", "Kitabın adını afiş gibi büyük yaz ya da yeni bir ad bul."], ["Oyuncular", "Hangi karakterler var?"], ["Tek cümle", "Bu film ne anlatıyor? Sonunu söyleme!"], ["Yıldız", "Kaç yıldız verirsin?"]],
      "Ana fikri tek cümleye sığdırmayı ve görsel anlatımı birleştirir. Afişleri sınıf koridorunda sergileyebilirsiniz."),
    K("kimlik", "🪪", "Karakter kimlik kartı", "En sevdiğin karakterin kimlik kartını hazırla.", ["yaz", "ciz"], "kimlik", "yatay",
      [["Adı", "Karakterin adı ne?"], ["Görünüşü", "Neye benziyor? Nasıl giyiniyor?"], ["Özellikleri", "Nasıl biri? Üç sözcükle anlat."], ["Sevdiği şeyler", "Neyi seviyor, neyden hoşlanmıyor?"], ["En önemli anı", "Kitapta başına gelen en önemli olay ne?"]],
      "Karakter özelliklerini kanıta dayalı betimlemeye yöneltir. Sözcükleri kitaptan bulmasını isteyin."),
    K("harita", "🗺️", "Hikâye haritası", "Hikâyenin yolculuğunu adım adım çiz.", ["yaz"], "izgara", "yatay",
      [["Kahramanlar", "Kimler var?"], ["Yer ve zaman", "Nerede, ne zaman geçiyor?"], ["Sorun", "Kahramanın karşılaştığı sorun ne?"], ["Olaylar", "Sonra neler oldu?"], ["Çözüm", "Sorun nasıl çözüldü?"], ["Bence", "Sence nasıl bitti? Beğendin mi?"]],
      "Hikâye unsurlarını (5N1K, giriş-gelişme-sonuç) düzenler. Anlama becerisinde temel bir yapı iskelesidir."),
    K("cizgi", "💥", "Çizgi roman", "En sevdiğin bölümü altı karede çiz.", ["ciz"], "hikaye", "yatay",
      [["1. kare", "Başlangıç"], ["2. kare", "Sonra"], ["3. kare", "Sonra"], ["4. kare", "Heyecanlı an"], ["5. kare", "Çözüm"], ["6. kare", "Son"]],
      "Olay sıralamasını görselleştirir; yazmakta zorlanan çocuklar için güçlü bir seçenektir. Konuşma balonu eklemelerini isteyin."),
    K("yeni-son", "🔀", "Yeni son yazıyorum", "Kitabın sonunu değiştir, kendi sonunu yaz.", ["yaz"], "oncesonra", "dikey",
      [["Kitabın sonu", "Kitap nasıl bitiyordu? Kısaca yaz."], ["Benim sonum", "Sen olsan nasıl bitirirdin?"], ["Neden?", "Neden bu sonu seçtin?"]],
      "Yaratıcı yazma ve neden-sonuç ilişkisi kurmayı destekler. Yeni sonun hikâyeyle uyumlu olmasına dikkat çekin."),
    K("kutu", "🎁", "Kitap kutusu", "Kitabı anlatan beş nesne seç, kutuya koy.", ["ciz", "anlat"], "izgara", "yatay",
      [["1. nesne", "Ne? Neden?"], ["2. nesne", "Ne? Neden?"], ["3. nesne", "Ne? Neden?"], ["4. nesne", "Ne? Neden?"], ["5. nesne", "Ne? Neden?"], ["Kutumun üstü", "Kutunun üstüne ne çizerdin?"]],
      "Sembolik düşünmeyi destekler. İsteyen çocuk gerçek bir kutu hazırlayıp sınıfa anlatabilir; şablon plan olarak kullanılır."),
    K("pizza", "🍕", "Kitap pizzası", "Her dilime kitaptan bir parça koy.", ["yaz"], "cember", "yatay",
      [["Kahraman", "Kim?"], ["Yer", "Nerede?"], ["Sorun", "Ne oldu?"], ["Çözüm", "Nasıl çözüldü?"], ["Sevdiğim bölüm", "Hangisi, neden?"], ["Önerim", "Kime önerirsin?"]],
      "Kısa yanıtlarla bütün kitabı özetletir; 1. ve 2. sınıflar için uygundur. Pizzayı birlikte tahtada doldurup örnek gösterin.", { merkezAd: "Kitabın adı" }),
    K("gazete", "📰", "Kitap gazetesi", "Kitaptaki en büyük olayı haber yap.", ["yaz"], "gazete", "dikey",
      [["Manşet", "Olayı anlatan kısa ve çarpıcı bir başlık."], ["Röportaj", "Kahramana bir soru sor, cevabını o yazmış gibi yaz."]],
      "Olayı nesnel aktarmayı ve 5N1K sorularını kullanmayı öğretir. Haberin ayrıntısında 'kim, ne, nerede, ne zaman' olsun."),
    K("kelime", "🔎", "Kelime avcısı", "Kitapta yeni öğrendiğin kelimeleri avla.", ["yaz"], "tablo", "dikey",
      [["Kelime", ""], ["Anlamı", ""], ["Benim cümlem", ""]],
      "Söz varlığını geliştirir. Anlamı önce bağlamdan tahmin etmesini, sonra sözlükten kontrol etmesini isteyin.", { sutun: ["Kelime", "Anlamı", "Benim cümlem"], satirlar: ["1", "2", "3", "4", "5"], satir_adi: "#" }),
    K("yildiz", "⭐", "Yıldızlarla puanla", "Kitaba puan ver ve nedenini anlat.", ["yaz"], "yildiz", "dikey",
      [["En sevdiğim", "Kitapta en çok neyi sevdim?"], ["Sevmediğim", "Neyi değiştirmek isterdim?"], ["Kime öneririm?", "Bu kitabı kime, neden öneririm?"]],
      "Gerekçeli görüş bildirmeyi destekler. Puanlar Sınıfın kitap önerileri panosuna taşınabilir."),
    K("reklam", "🎤", "30 saniyelik tanıtım", "Kitabı arkadaşlarına sunarak tanıt.", ["anlat"], "satir", "dikey",
      [["Dikkat çek", "Bir soruyla ya da ilginç bir cümleyle başla."], ["Ne anlatıyor?", "Kitabı iki cümleyle anlat. Sonunu söyleme!"], ["Kime göre?", "Kimler bu kitabı sever?"], ["Sloganım", "Sunumu bitiren kısa bir cümle."]],
      "Sözlü anlatım ve topluluk önünde konuşmayı destekler. Kum saatini 30 saniyeye kurup sunum yaptırın."),
  ];
  T.KITAP_RAPOR = RAPORLAR;
  const TUR = { yaz: ["✏️", "Yazarak"], ciz: ["🎨", "Çizerek"], anlat: ["🎤", "Anlatarak"] };
  const cid = () => T.store.activeClass().id;
  const yerel = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };

  function detay(box, r, geri) {
    const yon = h("div.rt-yon-kap", T.rutinCocukYonerge(r), h("div.rt-yon.ogretmen", h("h4", "Öğretmene"), h("p", r.ogretmen), h("p.hint", "A4 " + (r.yon === "dikey" ? "dikey" : "yatay") + " basılır. Tahtada kutulara dokunup yazabilirsiniz; yazılanlar bu sınıf için saklanır.")));
    box.replaceChildren(h("div.stage-bar", h("button.btn.icon.c-chalk", { "aria-label": "Seçeneklere dön", onclick: geri }, T.icon("back")), h("h2", r.emo + " " + r.ad), h("span.hint", r.yon === "dikey" ? "A4 dikey" : "A4 yatay"), h("div.grow"),
      h("button.btn.c-sky", { onclick: () => T.rutinYansitR(r) }, T.icon("board"), "Yansıt"),
      h("button.btn.c-chalk", { onclick: () => T.rutinYazdirR(r, true) }, T.icon("plan"), "Boş yazdır"),
      h("button.btn.c-chalk", { onclick: () => T.rutinYazdirR(r, false) }, T.icon("plan"), "Yazılarla yazdır"),
      h("button.btn.c-chalk", { onclick: async () => { if (await T.confirm("Bu şablondaki yazılar silinsin mi?")) { T.rutinTemizle(r.id); detay(box, r, geri); } } }, T.icon("reset"), "Temizle")),
      h("div.rt-duzen", h("div.rt-sayfa-kap", T.rutinSablon(r, {})), yon));
    let sk = box.parentElement; while (sk && sk.scrollHeight <= sk.clientHeight + 2) sk = sk.parentElement; sk && sk.scrollTo && sk.scrollTo({ top: 0 });
  }

  T.tools["kitap-raporu"] = {
    title: "Kitap raporu seçenekleri", icon: "book", tone: "tomato", back: "turkce", grup: "Okuma", grades: [1, 4],
    short: "Okuduğu kitabı nasıl anlatacağını çocuk seçsin: afiş, mektup, çizgi roman...",
    render(host) {
      let filtre = "hepsi", secim = yerel("ta-kr-tahta:" + cid()) || [];
      const box = h("div"); host.append(box);
      const ciz = () => {
        const liste = RAPORLAR.filter((r) => filtre === "hepsi" || r.tur.includes(filtre));
        const kart = (r, ekst) => h("button.kr-kart" + (ekst || ""), { onclick: () => detay(box, r, ciz) }, h("span.kr-emo", r.emo), h("b", r.ad), h("span.kr-kisa", r.kisa), h("span.kr-tur", r.tur.map((t) => TUR[t][0] + " " + TUR[t][1]).join("  ")));
        /* 3x3 seçim tahtası: sınıfın bu ayki tahtası, öğretmen dokuz seçeneği sabitleyebilir */
        const tahta = RAPORLAR.slice(0, 9).map((r, i) => h("button.kr-hucre" + (secim.includes(i) ? ".on" : ""), { "aria-pressed": String(secim.includes(i)), onclick: () => { secim = secim.includes(i) ? secim.filter((x) => x !== i) : secim.concat(i); yerel("ta-kr-tahta:" + cid(), secim); ciz(); } }, h("span", r.emo), r.ad));
        const cizgiVar = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].some((l) => l.every((x) => secim.includes(x)));
        box.replaceChildren(
          h("div.kr-ust", h("div", h("h2", "Bu kitabı nasıl anlatmak istersin?"), h("p.hint", "Kitabını bitiren çocuk bir seçenek seçer. Şablon tahtada yansıtılabilir ya da A4 basılabilir.")),
            h("button.btn.c-sun", { onclick: () => { const el = [...box.querySelectorAll(".kr-izgara .kr-kart")]; if (!el.length) return; let i = 0, tur = 14 + Math.floor(Math.random() * el.length); const adim = () => { el.forEach((e) => e.classList.remove("kr-sans")); el[i % el.length].classList.add("kr-sans"); if (tur-- > 0) { i++; setTimeout(adim, 90 + (14 - Math.min(tur, 14)) * 12); } else { T.sound && T.sound.ding && T.sound.ding(); setTimeout(() => detay(box, liste[i % el.length], ciz), 500); } }; adim(); } }, "🎲 Şansıma ne çıkacak?")),
          h("div.seg", { style: { margin: "6px 0 12px" } }, [["hepsi", "Hepsi"], ["yaz", "✏️ Yazarak"], ["ciz", "🎨 Çizerek"], ["anlat", "🎤 Anlatarak"]].map(([k, l]) => h("button", { "aria-pressed": String(filtre === k), onclick: () => { filtre = k; ciz(); } }, l))),
          h("div.kr-izgara", liste.map((r) => kart(r))),
          h("details.kr-tahta-sar", h("summary", "Seçim tahtası (3×3): üç seçeneği yan yana getiren tahtayı tamamlar"),
            h("p.hint", "Dönem boyunca çocuk okuduğu her kitap için bir kare seçer. Yan yana, alt alta ya da çapraz üç kare tamamlanınca kutlarız. Tahtada birlikte işaretleyebilirsiniz."),
            h("div.kr-tahta", tahta),
            cizgiVar ? h("p.kr-tamam", "🎉 Üç kare tamam! Tebrikler.") : null,
            h("button.btn.sm.c-chalk", { onclick: () => { secim = []; yerel("ta-kr-tahta:" + cid(), secim); ciz(); } }, T.icon("reset"), "Tahtayı temizle")));
        if (cizgiVar && T.konfeti && !ciz.kutlandi) { ciz.kutlandi = true; T.konfeti(); } if (!cizgiVar) ciz.kutlandi = false;
      };
      ciz();
    },
  };
  T.YARDIM = T.YARDIM || {};
})();
