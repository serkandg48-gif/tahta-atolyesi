/* Bağlam temelli düşünme soruları (MATBEG tarzı): bir gerçek hayat durumu, ona bağlı sorular. */
(function () {
  const { h } = T;
  const BANK = [
    { g: [1, 2], title: "Kuyruk", ctx: "Ayşe, Bora ve Can kantin kuyruğuna girdi. Can en önde duruyor. Bora, Ayşe'nin hemen arkasında.", qs: [
      { q: "En arkada kim var?", o: ["Ayşe", "Bora", "Can"], a: 1, w: "Sıra önden arkaya: Can, Ayşe, Bora." },
      { q: "Ayşe'nin önünde kaç kişi var?", o: ["0", "1", "2"], a: 1, w: "Ayşe'nin önünde yalnızca Can var." }] },
    { g: [1, 2], title: "Sınıf bahçesi", ctx: "Sınıfımız bahçeye 3 sıra lale dikti. Her sırada 4 lale var.", qs: [
      { q: "Bahçede toplam kaç lale var?", o: ["7", "12", "16"], a: 1, w: "4 + 4 + 4 = 12. Üç sıra, her birinde dört lale." },
      { q: "Bir sıra daha dikersek kaç lale olur?", o: ["13", "15", "16"], a: 2, w: "12'ye bir sıra, yani 4 lale eklenir: 16." }] },
    { g: [2, 3], title: "Okul servisi", ctx: "Okul servisi sabah 08.10'da evimizin önünden kalkıyor. Okula varması 25 dakika sürüyor. İlk ders 08.40'ta başlıyor.", qs: [
      { q: "Servis okula saat kaçta varır?", o: ["08.25", "08.35", "08.45"], a: 1, w: "08.10'a 25 dakika eklenince 08.35 olur." },
      { q: "Servisten indikten sonra derse kaç dakika kalır?", o: ["5", "10", "15"], a: 0, w: "08.35'ten 08.40'a 5 dakika vardır." },
      { q: "Yol 10 dakika uzarsa öğrenciler derse yetişir mi?", o: ["Yetişir", "5 dakika geç kalır", "10 dakika geç kalır"], a: 1, w: "Servis 08.45'te varır. Ders 08.40'ta başladığı için 5 dakika geç kalınır." }] },
    { g: [3, 4], title: "Kantin alışverişi", ctx: "Kantinde simit 10 TL, ayran 8 TL. Elif'in 50 TL'si var. Elif, kendisi ve kardeşi için 2 simit ve 2 ayran alıyor.", qs: [
      { q: "Elif kaç lira öder?", o: ["18 TL", "36 TL", "40 TL"], a: 1, w: "2 × 10 + 2 × 8 = 20 + 16 = 36 TL." },
      { q: "Elif'e kaç lira para üstü verilir?", o: ["14 TL", "16 TL", "24 TL"], a: 0, w: "50 − 36 = 14 TL." },
      { q: "Kalan parayla bir ayran daha alırsa kaç lirası kalır?", o: ["2 TL", "4 TL", "6 TL"], a: 2, w: "14 − 8 = 6 TL." }] },
    { g: [3, 4], title: "Okuma etkinliği", ctx: "Ece 90 sayfalık bir kitabı okumaya başladı. Her gün 12 sayfa okuyor.", qs: [
      { q: "Ece 5 günde kaç sayfa okur?", o: ["50", "60", "72"], a: 1, w: "5 × 12 = 60 sayfa." },
      { q: "Ece kitabı en erken kaçıncı gün bitirir?", o: ["7. gün", "8. gün", "9. gün"], a: 1, w: "7 günde 84 sayfa okunur, 6 sayfa kalır. Bu sayfalar 8. gün biter." }] },
    { g: [3, 5], title: "Kasım takvimi", ctx: "2026 yılında 1 Kasım pazar gününe denk geliyor. Okulumuz 24 Kasım'da Öğretmenler Günü için bir tören hazırlıyor.", qs: [
      { q: "8 Kasım hangi güne denk gelir?", o: ["Cumartesi", "Pazar", "Pazartesi"], a: 1, w: "Bir hafta 7 gündür. 1 Kasım pazarsa 8 Kasım da pazardır." },
      { q: "Tören hangi gün yapılacak?", o: ["Pazartesi", "Salı", "Çarşamba"], a: 1, w: "1, 8, 15 ve 22 Kasım pazar. 23 pazartesi, 24 salı." }] },
    { g: [4, 5], title: "Pizza paylaşımı", ctx: "Aynı büyüklükte iki pizza var. Birincisi 4 eşit dilime, ikincisi 8 eşit dilime bölündü. Ali birinci pizzadan 1 dilim, Can ikinci pizzadan 3 dilim yedi.", qs: [
      { q: "Kim daha çok pizza yedi?", o: ["Ali", "Can", "Eşit yediler"], a: 1, w: "Ali 1/4 = 2/8 pizza yedi. Can 3/8 pizza yedi. 3/8, 2/8'den büyüktür." },
      { q: "İkisi birlikte bir pizzanın ne kadarını yedi?", o: ["4/12", "5/8", "4/8"], a: 1, w: "2/8 + 3/8 = 5/8. Paydaları eşitlemeden toplamak yanlış sonuç verir." }] },
    { g: [5, 6], title: "Damlayan musluk", ctx: "Okulun lavabosundaki bir musluk damlatıyor. Ölçtüğümüzde 1 saatte yarım litre su boşa aktığını gördük.", qs: [
      { q: "Bir günde kaç litre su boşa akar?", o: ["12 L", "24 L", "6 L"], a: 0, w: "Bir gün 24 saattir. 24 × 0,5 = 12 L." },
      { q: "Musluk bir hafta tamir edilmezse kaç litre su boşa akar?", o: ["72 L", "84 L", "168 L"], a: 1, w: "12 × 7 = 84 L." },
      { q: "1,5 litrelik şişeyle düşünürsek bir haftada kaç şişe su boşa gider?", o: ["42", "56", "84"], a: 1, w: "84 ÷ 1,5 = 56 şişe." }] },
    { g: [5, 7], title: "Kibrit örüntüsü", ctx: "Kibritlerle yan yana kareler yapıyoruz. 1 kare için 4, 2 kare için 7, 3 kare için 10 kibrit gerekiyor.", qs: [
      { q: "4 kare için kaç kibrit gerekir?", o: ["12", "13", "16"], a: 1, w: "Her yeni kare 3 kibrit ekler: 10 + 3 = 13." },
      { q: "10 kare için kaç kibrit gerekir?", o: ["30", "31", "40"], a: 1, w: "İlk karede 4, sonraki 9 karede 3'er kibrit: 4 + 27 = 31. Kural 3n + 1." }] },
    { g: [6, 7], title: "Sınıf başkanlığı seçimi", ctx: "30 kişilik sınıfta başkanlık seçimi yapıldı. Herkes oy kullandı. Deniz 12, Mert 10, Lara 8 oy aldı.", qs: [
      { q: "Deniz oyların yüzde kaçını aldı?", o: ["%12", "%36", "%40"], a: 2, w: "12 / 30 = 0,4 = %40." },
      { q: "Lara'nın kazanabilmesi için en az kaç oyunun daha ona gitmesi gerekirdi? (Oylar Deniz'den gelsin.)", o: ["3", "4", "5"], a: 0, w: "Deniz'den 3 oy gelirse Lara 11, Deniz 9, Mert 10 olur. Lara tek başına en çok oyu alır." }] },
    { g: [7, 8], title: "Telefon paketleri", ctx: "A paketi her ay 100 TL. B paketi her ay 40 TL ve konuşulan her dakika için 2 TL.", qs: [
      { q: "Kaç dakika konuşulursa iki paketin ücreti eşit olur?", o: ["20", "30", "50"], a: 1, w: "40 + 2x = 100 ise 2x = 60, x = 30 dakika." },
      { q: "Ayda 45 dakika konuşan biri için hangisi daha ucuzdur?", o: ["A paketi", "B paketi", "Eşit"], a: 0, w: "B: 40 + 90 = 130 TL. A: 100 TL. A daha ucuz." }] },
    { g: [7, 8], title: "İki zarlı oyun", ctx: "Bir masa oyununda iki zar atılıp üst yüzlerdeki sayılar toplanıyor. Toplam 7 gelen oyuncu bir hak daha kazanıyor.", qs: [
      { q: "Toplamın 7 olma olasılığı nedir?", o: ["1/6", "1/12", "7/36"], a: 0, w: "36 eşit olası durumdan 6'sı toplam 7 verir: 6/36 = 1/6." },
      { q: "Hangi toplamın gelme olasılığı en düşüktür?", o: ["2 ya da 12", "6", "11"], a: 0, w: "2 yalnızca 1+1, 12 yalnızca 6+6 ile gelir: her biri 1/36." }] },
  ];

  T.sections.zeka = {
    title: "Düşünme soruları", icon: "zeka", tone: "pink", desc: "Gerçek hayat durumu, ona bağlı sorular",
    render(view) {
      const g = T.store.grade();
      const wrap = h("div.view-inner"); view.append(wrap);
      const list = BANK.filter((b) => g >= b.g[0] && g <= b.g[1]);
      const rest = BANK.filter((b) => !list.includes(b));
      let cur = (list[0] || BANK[0]);
      const holder = h("div");
      wrap.append(h("div.page-head", h("h1", "Düşünme soruları"), h("div.sub", "Her kart bir gerçek hayat durumu anlatır. Sorular o duruma bağlıdır; ezber değil, akıl yürütme ister.")));
      const pickRow = h("div.row", { style: { marginBottom: "16px" } });
      wrap.append(pickRow, holder);
      function picks() {
        pickRow.replaceChildren(
          ...list.map((b) => h("button.btn.sm" + (b === cur ? ".c-pink" : ".c-chalk"), { onclick: () => { cur = b; show(); } }, b.title)),
          rest.length ? h("select.in", { style: { width: "auto" }, "aria-label": "Diğer sınıflar", onchange: (e) => { if (e.target.value) { cur = rest[+e.target.value]; show(); } } }, h("option", { value: "" }, "Diğer sınıflar"), rest.map((b, i) => h("option", { value: i }, `${b.title} (${b.g[0]}-${b.g[1]})`))) : null,
          h("button.btn.sm.c-sun", { onclick: gen }, T.icon("spark"), "Yapay zekayla yenisini üret"));
      }
      function show() {
        picks();
        holder.replaceChildren(h("div.paper.scenario",
          h("div.row", h("h2", { style: { fontSize: "30px" } }, cur.title), h("span.pill", cur.g[0] + "-" + cur.g[1] + ". sınıf"), h("div.spacer"), h("button.btn.sm.c-chalk", { onclick: () => T.speak(cur.ctx) }, T.icon("speaker"), "Oku")),
          h("p.ctx", cur.ctx),
          h("div.qs", cur.qs.map((q, i) => {
            const el = h("div.q");
            const ans = h("div.ans", h("b", "Çözüm: "), q.w);
            el.append(h("div", { style: { fontWeight: 700, fontSize: "20px" } }, (i + 1) + ". " + q.q),
              h("div.opts", q.o.map((o, k) => h("button", { onclick: (e) => { e.target.classList.add(k === q.a ? "right" : "wrong"); if (k === q.a) { T.sound.ok(); el.classList.add("show"); } else T.sound.no(); } }, String.fromCharCode(65 + k) + ") " + o))),
              ans);
            return el;
          }))));
      }
      async function gen() {
        if (!T.ai.mode()) { T.modal({ title: "Yapay zeka bağlı değil", body: T.ai.statusEl(), actions: [{ label: "Tamam" }] }); return; }
        const theme = h("input.in", { placeholder: "Konu, örneğin: okul gezisi bütçesi, fidan dikimi, maç skoru" });
        let m;
        m = T.modal({ title: "Yeni bağlam sorusu", body: h("div.stack", h("p", g + ". sınıf için Türkçe, gerçek hayat bağlamlı bir durum ve ona bağlı 2-3 soru üretilecek."), theme), actions: [{ label: "Vazgeç" }, { label: "Üret", tone: "c-sun", onClick: () => { run(theme.value); } }] });
        async function run(topic) {
          holder.replaceChildren(h("div.paper.scenario", h("div.ai-status", h("div.spinner"), "Soru hazırlanıyor...")));
          try {
            const j = await T.ai.askJSON(`Türkiye'de ${g}. sınıf öğrencileri için MATBEG tarzı, bağlam temelli bir matematik/akıl yürütme sorusu hazırla.
Konu: ${topic || "okul hayatından bir durum"}.
Kurallar: TDK yazımına uy. Durum metni 2-4 kısa cümle olsun, gerçekçi sayılar kullan, Türk lirası ve metrik birimler kullan.
Durum metni bütün soruların cevabı için gerekli bilgiyi içersin. 2 ya da 3 soru yaz. Her soruda 3 seçenek ve yalnızca bir doğru cevap olsun.
Her sorunun çözümünü kısa ve adım adım yaz. Cevabı kendin hesapla ve doğrula.
JSON biçimi: {"title": "kısa başlık", "ctx": "durum metni", "qs": [{"q": "soru", "o": ["A", "B", "C"], "a": doğru seçeneğin sırası (0'dan başlar), "w": "çözüm"}]}`);
            if (!j.qs || !j.qs.length) throw { message: "Soru çıkmadı" };
            cur = { g: [g, g], title: j.title || "Yeni durum", ctx: j.ctx, qs: j.qs.map((q) => ({ q: q.q, o: q.o, a: +q.a, w: q.w })) };
            list.push(cur); show();
          } catch (e) { holder.replaceChildren(h("div.paper.scenario", h("p", "Soru üretilemedi: " + (e.message || "bilinmeyen hata")), h("button.btn.c-chalk", { onclick: show }, "Geri dön"))); }
        }
      }
      show();
    },
  };
})();
