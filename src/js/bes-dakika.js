/* 5 dakika kaldı: ders erken bitince ya da tören, servis beklenirken tek dokunuşla hazırlıksız bir etkinlik.
   Sınıf düzeyine göre üretilir; her açılışta farklı bir etkinlik gelir. */
(function () {
  const { h } = T;
  const r = (a, b) => T.rand(a, b), sec = (l) => l[r(0, l.length - 1)];
  /* sayılara doğru ek: 12'den, 30'dan, 3'er, 2'şer */
  const SON = { 0: "sıfır", 1: "bir", 2: "iki", 3: "üç", 4: "dört", 5: "beş", 6: "altı", 7: "yedi", 8: "sekiz", 9: "dokuz", 10: "on", 20: "yirmi", 30: "otuz", 40: "kırk", 50: "elli", 60: "altmış", 70: "yetmiş", 80: "seksen", 90: "doksan", 100: "yüz", 1000: "bin" };
  const okunus = (n) => { n = Math.abs(n); if (n === 0) return SON[0]; if (n % 1000 === 0) return SON[1000]; if (n % 100 === 0) return SON[100]; if (n % 10 === 0) return SON[n % 100]; return SON[n % 10]; };
  const ek = (n, tur) => { const w = okunus(n), sesli = [...w].reverse().find((c) => "aeıioöuü".includes(c)), ince = "eiöü".includes(sesli), son = w[w.length - 1], sert = "çfhkpsşt".includes(son), unlu = "aeıioöuü".includes(son);
    if (tur === "den") return n + "'" + (sert ? "t" : "d") + (ince ? "en" : "an");
    return n + "'" + (unlu ? "ş" : "") + (ince ? "er" : "ar"); };

  function islemZinciri(g) {
    const ust = g <= 1 ? 10 : g <= 2 ? 20 : g <= 3 ? 50 : 100;
    let x = r(2, Math.min(9, ust)); const adim = ["" + x];
    const n = g <= 2 ? 4 : 5;
    for (let i = 0; i < n; i++) {
      const islem = g >= 3 && x <= 12 && Math.random() < 0.3 ? "×" : g >= 3 && x % 2 === 0 && x > 4 && Math.random() < 0.3 ? "÷" : Math.random() < 0.5 && x > 3 ? "-" : "+";
      let s;
      if (islem === "×") { s = r(2, g >= 4 ? 5 : 3); x *= s; }
      else if (islem === "÷") { s = 2; x /= 2; }
      else if (islem === "-") { s = r(1, Math.min(x - 1, g <= 2 ? 5 : 15)); x -= s; }
      else { s = r(1, Math.max(1, Math.min(ust - x, g <= 2 ? 6 : 20))); x += s; }
      adim.push(islem + " " + s);
    }
    return { tur: "Zihinden işlem zinciri", yonerge: "Ben söylerim, siz kafanızda tutarsınız. Kâğıt kalem yok!", ana: adim.join("  →  "), cevap: "Sonuç: " + x, ipucu: "Her adımda bir öğrenciye ara sonucu sorun." };
  }
  const FARKLI = {
    k: [["elma", "armut", "havuç", "muz"], ["kedi", "köpek", "masa", "tavşan"], ["kırmızı", "mavi", "sarı", "kalem"], ["üçgen", "kare", "daire", "kitap"], ["pazartesi", "salı", "ocak", "cuma"], ["2", "4", "7", "8"], ["uçak", "gemi", "otobüs", "bulut"]],
    b: [["kartal", "penguen", "serçe", "güvercin"], ["Ankara", "İzmir", "Antalya", "Türkiye"], ["9", "15", "21", "24"], ["göl", "nehir", "deniz", "dağ"], ["koşmak", "yüzmek", "mutlu", "okumak"], ["balina", "yunus", "köpek balığı", "fok"], ["kilogram", "metre", "litre", "saat"]],
  };
  function hangisiFarkli(g) {
    const l = sec(g <= 2 ? FARKLI.k : FARKLI.b);
    return { tur: "Hangisi farklı?", yonerge: "Hangisi gruba uymuyor? Dikkat: birden fazla doğru cevap olabilir. Önemli olan nedenini söylemek.", ana: T.shuffle(l.slice()).join("   ·   "), cevap: "Farklı nedenler kabul edilir. En sıra dışı ama mantıklı açıklamayı alkışlayın.", ipucu: "Önce yanındaki arkadaşınla fısıldaşın." };
  }
  const IKILEM = [
    "Arkadaşın yeni resmini gösterdi ve beğenmedin. Ne söylersin?",
    "Yerde para buldun, kimse görmedi. Ne yaparsın?",
    "Oyunda takımın kaybediyor, bir arkadaşın kural dışı bir hareket öneriyor. Ne dersin?",
    "Hiç ödev olmasaydı daha mı çok öğrenirdik?",
    "Bir günlüğüne görünmez olsan bu gücü nasıl kullanırdın? Bu doğru olur muydu?",
    "Herkesin aynı şeyi alması mı, ihtiyacı olanın alması mı daha adil?",
    "Bir robot öğretmen olsaydı neyi daha iyi, neyi daha kötü yapardı?",
    "En yakın arkadaşın bir sırrını söyledi ama bu sır onu tehlikeye atıyor. Ne yaparsın?",
  ];
  const ikilem = () => ({ tur: "Ne yapardın?", yonerge: "Önce 30 saniye sessizce düşün. Sonra katılıyorsan elini kaldır, katılmıyorsan kollarını kavuştur.", ana: sec(IKILEM), cevap: "Tek doğru cevap yok. \"Neden?\" ve \"Başka nasıl olabilirdi?\" diye sorun.", ipucu: "İki farklı görüşü olan iki öğrenciye söz verin." });
  function ritim() {
    const P = ["👏", "👏", "🦶", "🙌"]; const n = r(4, 6); const l = Array.from({ length: n }, () => sec(P));
    return { tur: "Ritim tekrarı", yonerge: "Ben bir kez yaparım, siz tekrarlarsınız. Sonra biraz hızlanırız.", ana: l.join("  "), cevap: "👏 el çırp   🦶 ayak vur   🙌 iki el dizlere", ipucu: "Üçüncü turda ritmi bir öğrenci başlatsın." };
  }
  const kelimeZinciri = (g) => ({ tur: "Kelime zinciri", yonerge: "Söylenen kelimenin son harfiyle yeni bir kelime söyle. Sıra sınıfta dolaşsın.", ana: sec(g <= 2 ? ["kalem", "elma", "araba", "okul"] : ["kitap", "deniz", "kelebek", "masal", "yıldız"]), cevap: g <= 2 ? "Takılan olursa sınıf yardım etsin." : "Zorlaştır: yalnızca hayvan adları ya da yalnızca üç heceli kelimeler.", ipucu: "Tekrarlanan kelime olursa baştan başlayın." });
  const benKimim = () => ({ tur: "Aklımdan ne geçiyor?", yonerge: "Aklımdan bir şey tuttum. Yalnızca evet ya da hayır diye yanıtlanabilecek sorular sorun. 20 soruda bulabilecek misiniz?", ana: "Hayvan mı? Bitki mi? Eşya mı?", cevap: "Tutmak için öneriler: " + T.shuffle(["zürafa", "saksı", "şemsiye", "pusula", "ahtapot", "kum saati", "kaktüs", "fener"]).slice(0, 3).join(", "), ipucu: "Sorulan soruları tahtanın köşesinde sayın." });
  function sayiAtlama(g) {
    const adim = g <= 1 ? sec([1, 2]) : g <= 2 ? sec([2, 5, 10]) : g <= 3 ? sec([3, 4, 5, 25]) : sec([6, 7, 8, 9, 15, 25]);
    const geri = g >= 2 && Math.random() < 0.5, bas = geri ? adim * r(10, 15) : r(0, 3) * adim;
    return { tur: "Sırayla say", yonerge: "Sırayla birer sayı söyleyin. Takılan otursun, en son kalan kazanır.", ana: ek(bas, "den") + " başla, " + (geri ? "geriye doğru " : "") + ek(adim, "er") + " " + (geri ? "azalt" : "artır"), cevap: "İlk sayılar: " + Array.from({ length: 6 }, (_, i) => bas + (geri ? -1 : 1) * adim * i).join(", "), ipucu: "Zorlaştır: her 3. kişi sayı yerine el çırpsın." };
  }
  const URET = [islemZinciri, hangisiFarkli, ikilem, ritim, kelimeZinciri, benKimim, sayiAtlama];

  T.besDakika = function () {
    const g = T.store.grade(); let son = -1, bitis = Date.now() + 5 * 60000, cevapAcik = false, et;
    const kart = h("div.bd-kart"), bar = h("i"), sure = h("span.bd-sure");
    const yeni = () => { let i; do i = r(0, URET.length - 1); while (i === son && URET.length > 1); son = i; et = URET[i](g); cevapAcik = false; ciz(); };
    const ciz = () => kart.replaceChildren(h("small.bd-tur", et.tur), h("p.bd-yon", et.yonerge), h("div.bd-ana", et.ana),
      cevapAcik ? h("p.bd-cevap", et.cevap) : h("button.btn.c-chalk.bd-goster", { onclick: () => { cevapAcik = true; ciz(); } }, T.icon("eye"), "Cevabı göster"),
      h("p.bd-ipucu", et.ipucu));
    const iv = setInterval(() => { const k = Math.max(0, bitis - Date.now()); bar.style.width = (k / 3000) + "%"; sure.textContent = Math.floor(k / 60000) + ":" + T.pad(Math.floor(k / 1000) % 60); if (!k) { clearInterval(iv); T.sound.ok && T.sound.ok(); sure.textContent = "Süre doldu"; } }, 500);
    yeni();
    T.modal({ title: "5 dakika kaldı", wide: true, onClose: () => clearInterval(iv),
      body: h("div.bd", h("div.bd-bar", bar), h("div.bd-ust", sure, h("span.hint", g + ". sınıf için")), kart),
      actions: [{ label: "Başka etkinlik", tone: "c-sun", onClick: () => { yeni(); return false; } }, { label: "Kapat" }] });
  };
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "5 dakika kaldı", ic: "stopwatch", ac: () => T.besDakika(), ek: "Hazırlıksız kısa etkinlik" });
})();

/* Derse iniş: teneffüsten dönen sınıf için bir dakikalık sakinleşme. Önce nefes halkası, sonra bir dikkat çapası. */
(function () {
  const { h } = T;
  const CAPA = ["Şu an sınıfta duyduğun üç sesi sessizce fark et.", "Gözlerini kapat. Ayaklarının yere bastığını hisset.", "Sınıfta mavi olan üç şey bul. Göstermeden, yalnızca bak.", "Ellerini dizlerine koy. Sıcak mı, soğuk mu?", "Bu dersten ne öğrenmek istediğini aklından geçir.", "En uzaktaki sesi duymaya çalış."];
  T.derseInis = function () {
    if (document.getElementById("derse-inis")) return;
    const halka = h("div.di-halka"), yazi = h("div.di-yazi", "Hazırlan"), alt = h("div.di-alt", "Bir dakika birlikte yavaşlıyoruz");
    const el = h("div#derse-inis", { role: "dialog", "aria-label": "Derse iniş" }, h("button.di-kapat", { "aria-label": "Kapat", onclick: () => bitir() }, T.icon("close")), halka, yazi, alt);
    document.body.append(el);
    const zam = []; const sonra = (ms, f) => zam.push(setTimeout(f, ms));
    const bitir = () => { zam.forEach(clearTimeout); el.classList.add("kapan"); setTimeout(() => el.remove(), 400); removeEventListener("keydown", tus); };
    const tus = (e) => { if (e.key === "Escape") bitir(); }; addEventListener("keydown", tus);
    /* 5 tur: 4 sn nefes al, 4 sn ver (40 sn), sonra 20 sn dikkat çapası */
    for (let i = 0; i < 5; i++) {
      sonra(1500 + i * 8000, () => { halka.className = "di-halka al"; yazi.textContent = "Nefes al"; alt.textContent = (i + 1) + ". nefes"; });
      sonra(1500 + i * 8000 + 4000, () => { halka.className = "di-halka ver"; yazi.textContent = "Nefes ver"; });
    }
    sonra(41500, () => { halka.className = "di-halka dur"; yazi.textContent = CAPA[T.rand(0, CAPA.length - 1)]; alt.textContent = "Sessizce"; });
    sonra(61500, () => { yazi.textContent = "Hazırız"; alt.textContent = "Derse başlayabiliriz"; T.sound.bell && T.sound.bell(); });
    sonra(65000, bitir);
  };
  T.ekKomutlar = (T.ekKomutlar || []).concat({ ad: "Derse iniş (1 dakika)", ic: "lotus", ac: () => T.derseInis(), ek: "Teneffüs sonrası nefes ve dikkat" });
})();
