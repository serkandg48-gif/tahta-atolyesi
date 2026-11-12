/* Sabah rutini: öğretmen ve sınıf güne birlikte başlar.
   Adımlar: Günaydın (hava, soru, görevli) · Takvim (dün, bugün, yarın) · Belirli gün ve haftalar + günün sözü
   · Günün sayısı (işlemler + kim söyleyecek) · Günün akışı (eve kaç ders kaldı). */
(function () {
  const { h } = T; const S = T.svg;
  const GUN = T.GUNLER, AY = T.AYLAR;
  const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const mevsim = (m) => (m === 11 || m <= 1 ? "Kış" : m <= 4 ? "İlkbahar" : m <= 7 ? "Yaz" : "Sonbahar");

  /* ---------- Belirli gün ve haftalar ----------
     Kaynak: MEB Eğitim Kurumları Sosyal Etkinlikler Yönetmeliği EK-8 Belirli Gün ve Haftalar Çizelgesi
     (Değişik: RG-18/1/2023-32077). Diyanet'e bağlı ve yerel günler (Mevlid-i Nebî, mahallî kurtuluş günleri) listede yok. */
  const nthMon = (y, m, n) => { const d = new Date(y, m, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return d; };
  const lastMon = (y, m) => { const d = new Date(y, m + 1, 0); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d; };
  const nthWd = (y, m, wd, n) => { const d = new Date(y, m, 1); while (d.getDay() !== wd) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return d; };
  const weekOf = (d) => { const a = addDays(d, -((d.getDay() + 6) % 7)); return [a, addDays(a, 6)]; };
  const wk = (mon) => [mon, addDays(mon, 6)];
  const one = (d) => [d, d];
  const BGH = [
    ["Uluslararası Temiz Hava Günü", (y) => one(new Date(y, 8, 7))],
    ["Dünya İlk Yardım Günü", (y) => one(nthWd(y, 8, 6, 2))],
    ["İlköğretim Haftası", (y) => { const m = nthMon(y, 8, 3); return [m, addDays(m, 4)]; }],
    ["Öğrenciler Günü", (y) => one(addDays(nthMon(y, 8, 3), 4))],
    ["Gaziler Günü", (y) => one(new Date(y, 8, 19))],
    ["Dünya Okul Sütü Günü", (y) => one(new Date(y, 8, 28))],
    ["Disleksi Haftası", (y) => wk(nthMon(y, 9, 1))],
    ["Dünya Disleksi Günü", (y) => one(addDays(nthMon(y, 9, 1), 3))],
    ["Hayvanları Koruma Günü", (y) => one(new Date(y, 9, 4))],
    ["Ahilik Kültürü Haftası", (y) => [new Date(y, 9, 8), new Date(y, 9, 12)]],
    ["Dünya Afet Azaltma Günü", (y) => one(new Date(y, 9, 13))],
    ["Birleşmiş Milletler Günü", (y) => one(new Date(y, 9, 24))],
    ["Cumhuriyet Bayramı", (y) => one(new Date(y, 9, 29))],
    ["Kızılay Haftası", (y) => [new Date(y, 9, 29), new Date(y, 10, 4)]],
    ["Organ Bağışı ve Nakli Haftası", (y) => [new Date(y, 10, 3), new Date(y, 10, 9)]],
    ["Lösemili Çocuklar Haftası", (y) => [new Date(y, 10, 2), new Date(y, 10, 8)]],
    ["Atatürk Haftası", (y) => [new Date(y, 10, 10), new Date(y, 10, 16)]],
    ["Atatürk'ü Anma Günü", (y) => one(new Date(y, 10, 10))],
    ["Afet Eğitimi Hazırlık Günü", (y) => one(new Date(y, 10, 12))],
    ["Dünya Diyabet Günü", (y) => one(new Date(y, 10, 14))],
    ["Dünya Felsefe Günü", (y) => one(new Date(y, 10, 20))],
    ["Dünya Çocuk Hakları Günü", (y) => one(new Date(y, 10, 20))],
    ["Ağız ve Diş Sağlığı Haftası", (y) => [new Date(y, 10, 21), new Date(y, 10, 27)]],
    ["Öğretmenler Günü", (y) => one(new Date(y, 10, 24))],
    ["Dünya Engelliler Günü", (y) => one(new Date(y, 11, 3))],
    ["Dünya Madenciler Günü", (y) => one(new Date(y, 11, 4))],
    ["Türk Kadınına Seçme ve Seçilme Hakkının Verilişi", (y) => one(new Date(y, 11, 5))],
    ["Mevlana Haftası", (y) => [new Date(y, 11, 7), new Date(y, 11, 17)]],
    ["İnsan Hakları ve Demokrasi Haftası", (y) => weekOf(new Date(y, 11, 10))],
    ["Tutum, Yatırım ve Türk Malları Haftası", (y) => [new Date(y, 11, 12), new Date(y, 11, 18)]],
    ["Mehmet Akif Ersoy'u Anma Haftası", (y) => [new Date(y, 11, 20), new Date(y, 11, 27)]],
    ["Enerji Tasarrufu Haftası", (y) => wk(nthMon(y + 1, 0, 2))],
    ["Vergi Haftası", (y) => wk(lastMon(y + 1, 1))],
    ["Yeşilay Haftası", (y) => weekOf(new Date(y + 1, 2, 1))],
    ["Girişimcilik Haftası", (y) => wk(nthMon(y + 1, 2, 1))],
    ["Dünya Kadınlar Günü", (y) => one(new Date(y + 1, 2, 8))],
    ["Bilim ve Teknoloji Haftası", (y) => [new Date(y + 1, 2, 8), new Date(y + 1, 2, 14)]],
    ["İstiklâl Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü", (y) => one(new Date(y + 1, 2, 12))],
    ["Tüketiciyi Koruma Haftası", (y) => [new Date(y + 1, 2, 15), new Date(y + 1, 2, 21)]],
    ["Şehitler Günü", (y) => one(new Date(y + 1, 2, 18))],
    ["Yaşlılar Haftası", (y) => [new Date(y + 1, 2, 18), new Date(y + 1, 2, 24)]],
    ["Türk Dünyası ve Toplulukları Haftası", (y) => weekOf(new Date(y + 1, 2, 21))],
    ["Orman Haftası", (y) => [new Date(y + 1, 2, 21), new Date(y + 1, 2, 26)]],
    ["Dünya Su Günü", (y) => one(new Date(y + 1, 2, 22))],
    ["Dünya Tiyatrolar Günü", (y) => one(new Date(y + 1, 2, 27))],
    ["Kütüphaneler Haftası", (y) => wk(lastMon(y + 1, 2))],
    ["Kanser Haftası", (y) => [new Date(y + 1, 3, 1), new Date(y + 1, 3, 7)]],
    ["Dünya Otizm Farkındalık Günü", (y) => one(new Date(y + 1, 3, 2))],
    ["Kişisel Verileri Koruma Günü", (y) => one(new Date(y + 1, 3, 7))],
    ["Dünya Sağlık Haftası", (y) => [new Date(y + 1, 3, 7), new Date(y + 1, 3, 13)]],
    ["Turizm Haftası", (y) => [new Date(y + 1, 3, 15), new Date(y + 1, 3, 22)]],
    ["Ulusal Egemenlik ve Çocuk Bayramı", (y) => one(new Date(y + 1, 3, 23))],
    ["Dünya Fikrî Mülkiyet Günü", (y) => one(new Date(y + 1, 3, 26))],
    ["Kût'ül Amâre Zaferi", (y) => one(new Date(y + 1, 3, 29))],
    ["Bilişim Haftası", (y) => wk(nthMon(y + 1, 4, 1))],
    ["Trafik ve İlkyardım Haftası", (y) => wk(nthMon(y + 1, 4, 1))],
    ["İş Sağlığı ve Güvenliği Haftası", (y) => [new Date(y + 1, 4, 4), new Date(y + 1, 4, 10)]],
    ["Vakıflar Haftası", (y) => wk(nthMon(y + 1, 4, 2))],
    ["Anneler Günü", (y) => one(nthWd(y + 1, 4, 0, 2))],
    ["Engelliler Haftası", (y) => [new Date(y + 1, 4, 10), new Date(y + 1, 4, 16)]],
    ["Müzeler Haftası", (y) => [new Date(y + 1, 4, 18), new Date(y + 1, 4, 24)]],
    ["Atatürk'ü Anma ve Gençlik ve Spor Bayramı", (y) => one(new Date(y + 1, 4, 19))],
    ["Etik Günü", (y) => one(new Date(y + 1, 4, 25))],
    ["İstanbul'un Fethi", (y) => one(new Date(y + 1, 4, 29))],
    ["Hayat Boyu Öğrenme Haftası", (y) => wk(nthMon(y + 1, 5, 1))],
    ["Çevre ve İklim Değişikliği Haftası", (y) => wk(nthMon(y + 1, 5, 2))],
    ["Babalar Günü", (y) => one(nthWd(y + 1, 5, 0, 3))],
  ];
  T.belirliGunler = function (d = new Date()) {
    const y = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1; // eğitim yılının başladığı yıl
    const list = BGH.map(([ad, f]) => { const [a, b] = f(y); return { ad, a, b }; });
    // 15 Temmuz anma programları: ders yılının ikinci haftası
    try { const st = T.store.get().calendar.start.split("-").map(Number); const s0 = new Date(st[0], st[1] - 1, st[2]); const m = addDays(s0, 7 - ((s0.getDay() + 6) % 7)); list.push({ ad: "15 Temmuz Demokrasi ve Millî Birlik Günü anma programları", a: m, b: addDays(m, 4) }); } catch (e) {}
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const [wa, wb] = weekOf(day);
    const bugun = list.filter((x) => x.a <= day && day <= x.b);
    const hafta = list.filter((x) => !bugun.includes(x) && x.a <= wb && x.b >= wa);
    const yakin = list.filter((x) => x.a > wb && x.a <= addDays(day, 30)).sort((p, q) => p.a - q.a).slice(0, 4);
    return { bugun, hafta, yakin };
  };
  const tarihAraligi = (x) => (sameDay(x.a, x.b) ? `${x.a.getDate()} ${AY[x.a.getMonth()]}` : `${x.a.getDate()} ${x.a.getMonth() !== x.b.getMonth() ? AY[x.a.getMonth()] + " " : ""}- ${x.b.getDate()} ${AY[x.b.getMonth()]}`);

  /* ---------- Günün sözü: atasözleri ve 1929 öncesine ait sözler ---------- */
  const SOZLER = [
    ["Damlaya damlaya göl olur.", "Atasözü"], ["Bir elin nesi var, iki elin sesi var.", "Atasözü"], ["Ağaç yaşken eğilir.", "Atasözü"],
    ["Sakla samanı, gelir zamanı.", "Atasözü"], ["Tatlı dil yılanı deliğinden çıkarır.", "Atasözü"], ["İşleyen demir ışıldar.", "Atasözü"],
    ["Bugünün işini yarına bırakma.", "Atasözü"], ["Az olsun, öz olsun.", "Atasözü"], ["Bin işit, bir söyle.", "Atasözü"],
    ["Ayağını yorganına göre uzat.", "Atasözü"], ["Emek olmadan yemek olmaz.", "Atasözü"], ["Birlikten kuvvet doğar.", "Atasözü"],
    ["Dost kara günde belli olur.", "Atasözü"], ["Erken kalkan yol alır.", "Atasözü"], ["Ne ekersen onu biçersin.", "Atasözü"],
    ["Söz gümüşse sükût altındır.", "Atasözü"], ["Yalancının mumu yatsıya kadar yanar.", "Atasözü"], ["Her işin başı sağlık.", "Atasözü"],
    ["Bilmemek ayıp değil, öğrenmemek ayıptır.", "Atasözü"], ["Acele işe şeytan karışır.", "Atasözü"], ["Akıl akıldan üstündür.", "Atasözü"],
    ["El elden üstündür.", "Atasözü"], ["Kervan yolda düzülür.", "Atasözü"], ["Keskin sirke küpüne zarar.", "Atasözü"],
    ["Su akarken testiyi doldur.", "Atasözü"], ["Sora sora Bağdat bulunur.", "Atasözü"], ["Bir lisan bir insan, iki lisan iki insan.", "Atasözü"],
    ["Kendi düşen ağlamaz.", "Atasözü"], ["Taşıma su ile değirmen dönmez.", "Atasözü"], ["Zararın neresinden dönülse kârdır.", "Atasözü"],
    ["Gülü seven dikenine katlanır.", "Atasözü"], ["Hatasız kul olmaz.", "Atasözü"], ["Komşu komşunun külüne muhtaçtır.", "Atasözü"],
    ["Gülme komşuna, gelir başına.", "Atasözü"], ["Sabreden derviş muradına ermiş.", "Atasözü"], ["Ak akçe kara gün içindir.", "Atasözü"],
    ["Rüzgâr eken fırtına biçer.", "Atasözü"], ["Ummadığın taş baş yarar.", "Atasözü"], ["Çok yaşayan bilmez, çok gezen bilir.", "Atasözü"],
    ["Üzüm üzüme baka baka kararır.", "Atasözü"], ["İki dinle, bir söyle.", "Atasözü"], ["Az veren candan, çok veren maldan.", "Atasözü"],
    ["Hayatta en hakiki mürşit ilimdir.", "Mustafa Kemal Atatürk"], ["Yurtta sulh, cihanda sulh.", "Mustafa Kemal Atatürk"],
    ["Egemenlik kayıtsız şartsız milletindir.", "Mustafa Kemal Atatürk"], ["Öğretmenler! Yeni nesli siz yetiştireceksiniz.", "Mustafa Kemal Atatürk"],
    ["Küçük hanımlar, küçük beyler! Sizler hepiniz geleceğin bir gülü, yıldızı ve ikbal ışığısınız.", "Mustafa Kemal Atatürk"],
    ["Sanatsız kalan bir milletin hayat damarlarından biri kopmuş olur.", "Mustafa Kemal Atatürk"],
    ["Gelin tanış olalım, işi kolay kılalım; sevelim sevilelim, dünya kimseye kalmaz.", "Yunus Emre"],
    ["İlim ilim bilmektir, ilim kendin bilmektir.", "Yunus Emre"], ["Söz ola kese savaşı, söz ola kestire başı.", "Yunus Emre"],
  ];
  const SORULAR = ["Bugün seni ne gülümsetti?", "Bir süper gücün olsaydı ne olurdu?", "En sevdiğin mevsim hangisi, neden?", "Hafta sonu ne yaptın?", "Bir hayvan olsaydın hangisi olurdun?",
    "Bugün kime yardım edebilirsin?", "En sevdiğin oyun hangisi?", "Bir gün öğretmen olsaydın ne yapardın?", "Sınıfımızda en sevdiğin köşe neresi?", "Büyüyünce ne olmak istiyorsun?",
    "En son okuduğun kitap neydi?", "Bir arkadaşının en güzel yanı ne?", "Kahvaltıda ne yedin?", "Bugün öğrenmek istediğin bir şey var mı?", "Hangi renk sana mutluluk veriyor?",
    "Zaman makinen olsa nereye giderdin?", "En sevdiğin meyve hangisi?", "Bir icat yapsan ne icat ederdin?", "Dün seni ne mutlu etti?", "Tatilde nereye gitmek isterdin?",
    "Ailenle en sevdiğin etkinlik ne?", "Bulutlara bakınca neler görüyorsun?", "Sence iyi bir arkadaş nasıl olur?", "Bugün kendine hangi sözü verirsin?", "Bir şarkı olsaydın nasıl bir şarkı olurdun?",
    "En çok hangi sesi seviyorsun?", "Okula gelirken neler gördün?", "Bir gün sihirli değneğin olsa neyi değiştirirdin?", "Sınıfımız için bir kural önerin var mı?", "En sevdiğin ders hangisi, neden?"];
  const gununu = (arr, d = new Date()) => { const n = Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); return arr[((n % arr.length) + arr.length) % arr.length]; };

  /* ---------- Hava simgeleri ---------- */
  const HAVA = [["gunesli", "Güneşli"], ["parcali", "Parçalı bulutlu"], ["bulutlu", "Bulutlu"], ["yagmurlu", "Yağmurlu"], ["karli", "Karlı"], ["ruzgarli", "Rüzgârlı"], ["sisli", "Sisli"]];
  T.HAVA = HAVA; T.havaSvg = (k) => havaSvg(k);
  function havaSvg(k) {
    const s = S("svg", { viewBox: "0 0 64 64", width: 64, height: 64, "aria-hidden": "true" });
    const sun = (cx, cy, r) => { let g = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#E9A23B"/>`; for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; g += `<path d="M${cx + Math.cos(a) * (r + 4)} ${cy + Math.sin(a) * (r + 4)}L${cx + Math.cos(a) * (r + 10)} ${cy + Math.sin(a) * (r + 10)}" stroke="#E9A23B" stroke-width="3.5" stroke-linecap="round"/>`; } return g; };
    const cloud = (x, y, c = "#B9C3D6") => `<path d="M${x} ${y}a9 9 0 0 1 9-9a12 12 0 0 1 22 2a8 8 0 0 1 1 15H${x + 2}a8 8 0 0 1-2-8z" fill="${c}"/>`;
    s.innerHTML = {
      gunesli: sun(32, 32, 12),
      parcali: sun(24, 24, 9) + cloud(20, 44, "#C9D1E0"),
      bulutlu: cloud(12, 30, "#9DA9C0") + cloud(18, 44, "#C2CADB"),
      yagmurlu: cloud(12, 30, "#8E9BB4") + '<path d="M22 46l-3 8M32 46l-3 8M42 46l-3 8" stroke="#3B7DD8" stroke-width="3.5" stroke-linecap="round"/>',
      karli: cloud(12, 30, "#A9B4C8") + '<g fill="#5B8BD9"><circle cx="21" cy="50" r="3"/><circle cx="32" cy="55" r="3"/><circle cx="43" cy="50" r="3"/></g>',
      ruzgarli: '<path d="M8 24h30a7 7 0 1 0-7-7M8 34h42a7 7 0 1 1-7 7M8 44h22" stroke="#6C7A95" stroke-width="4" fill="none" stroke-linecap="round"/>',
      sisli: '<path d="M10 22h44M6 32h52M12 42h40M18 52h28" stroke="#9DA9C0" stroke-width="4.5" stroke-linecap="round"/>',
    }[k];
    return s;
  }

  /* ---------- Veriler (sınıfa göre) ---------- */
  const cid = () => T.store.activeClass().id;
  const gunVeri = () => { const s = T.store.get(); s.sabah = s.sabah || {}; const k = cid() + ":" + T.isoDate(); return (s.sabah[k] = s.sabah[k] || {}); };
  const kaydet = (fn) => T.store.update((s) => { s.sabah = s.sabah || {}; const k = cid() + ":" + T.isoDate(); s.sabah[k] = s.sabah[k] || {}; fn(s.sabah[k]); });
  const presentStudents = () => {
    const s = T.store.get(), c = T.store.activeClass();
    const day = (s.attendance[c.id] || {})[T.isoDate()] || {};
    return c.students.filter((x) => day[x.id] !== "yok");
  };

  /* Günün akışı: hafta içi her gün için satırlar {b, s, ad, tur} */
  const akisAl = () => { const s = T.store.get(); s.akis = s.akis || {}; return s.akis[cid()] || null; };
  function varsayilanAkis() {
    const g = T.store.grade();
    const gunler = { 1: ["Türkçe", "Türkçe", "Matematik", "Matematik", "Hayat Bilgisi", "Beden Eğitimi"], 2: ["Türkçe", "Türkçe", "Matematik", "Hayat Bilgisi", "Görsel Sanatlar", "Müzik"], 3: ["Matematik", "Matematik", "Türkçe", "Türkçe", "İngilizce", "Serbest Etkinlik"], 4: ["Türkçe", "Matematik", "Hayat Bilgisi", "Beden Eğitimi", "Beden Eğitimi", "Okuma"], 5: ["Türkçe", "Türkçe", "Matematik", "Matematik", "Hayat Bilgisi", "Serbest Etkinlik"] };
    if (g >= 3) Object.values(gunler).forEach((a) => { const i = a.indexOf("Hayat Bilgisi"); if (i >= 0 && g >= 4) a[i] = "Fen Bilimleri"; });
    const out = {};
    for (const d of [1, 2, 3, 4, 5]) out[d] = olustur({ bas: "08:40", ders: 40, ten: 10, sayi: 6, yemekSonra: 4, yemek: 40 }, gunler[d]);
    return out;
  }
  const dk = (t) => { const [a, b] = t.split(":").map(Number); return a * 60 + b; };
  const saat = (m) => `${T.pad(Math.floor(m / 60))}:${T.pad(m % 60)}`;
  function olustur(o, adlar = []) {
    const rows = []; let t = dk(o.bas);
    for (let i = 0; i < o.sayi; i++) {
      rows.push({ b: saat(t), s: saat(t + o.ders), ad: adlar[i] || (i + 1) + ". ders", tur: "ders" }); t += o.ders;
      if (i === o.sayi - 1) break;
      if (i + 1 === o.yemekSonra) { rows.push({ b: saat(t), s: saat(t + o.yemek), ad: "Öğle yemeği", tur: "yemek" }); t += o.yemek; }
      else { rows.push({ b: saat(t), s: saat(t + o.ten), ad: "Teneffüs", tur: "teneffus" }); t += o.ten; }
    }
    return rows;
  }

  T.gunAkisi = (d = new Date()) => { const a = akisAl() || varsayilanAkis(); const wd = d.getDay(); return wd >= 1 && wd <= 5 ? a[wd] || [] : []; };
  T.akisDk = (t) => dk(t);

  /* ---------- Bölüm ---------- */
  const ADIMLAR = [["gunaydin", "Günaydın"], ["takvim", "Takvim"], ["gunler", "Özel günler ve söz"], ["sayi", "Günün sayısı"], ["akis", "Günün akışı"]];
  let adim = 0;
  T.sections.sabah = {
    title: "Sabah rutini", icon: "sun", tone: "sun", desc: "Takvim, günün sözü, günün sayısı, günün akışı",
    render(view, sub) {
      if (sub) { const i = ADIMLAR.findIndex((a) => a[0] === sub); if (i >= 0) adim = i; }
      const wrap = h("div.view-inner.sb"); view.append(wrap);
      const body = h("div.sb-body");
      const steps = h("div.sb-steps", { role: "tablist" });
      const nav = h("div.sb-nav");
      function paint() {
        steps.replaceChildren(...ADIMLAR.map(([k, l], i) => h("button", { role: "tab", "aria-selected": String(i === adim), class: i < adim ? "done" : "", onclick: () => { adim = i; paint(); } }, h("span.n", i + 1), l)));
        body.replaceChildren(); clearInterval(T._sbTick);
        ({ gunaydin, takvim, gunler, sayi, akis })[ADIMLAR[adim][0]](body);
        nav.replaceChildren(
          adim > 0 ? h("button.btn.c-chalk", { onclick: () => { adim--; paint(); } }, T.icon("back"), "Önceki") : h("span"),
          adim < ADIMLAR.length - 1 ? h("button.btn.big", { onclick: () => { adim++; paint(); } }, ADIMLAR[adim + 1][1], T.icon("next")) : h("button.btn.big", { onclick: () => { adim = 0; T.go("ana"); } }, T.icon("check"), "Güne başlayalım"));
        view.scrollTop = 0;
      }
      wrap.append(h("div.sb-head", h("h1", "Sabah rutini"), h("div.sub", T.longDate() + " · " + T.store.activeClass().name)), steps, body, nav);
      const onKey = (e) => { if (e.target.matches("input, textarea, select")) return; if (e.key === "ArrowRight" && adim < ADIMLAR.length - 1) { adim++; paint(); } if (e.key === "ArrowLeft" && adim > 0) { adim--; paint(); } };
      document.addEventListener("keydown", onKey); T.onLeave(() => { document.removeEventListener("keydown", onKey); clearInterval(T._sbTick); });
      paint();
    },
  };

  /* 1. Günaydın: selam, hava, günün sorusu, görevliler */
  function gunaydin(body) {
    const s = T.store.get(), c = T.store.activeClass(), v = gunVeri();
    const day = (s.attendance[c.id] || {})[T.isoDate()] || {};
    const taken = Object.keys(day).length > 0;
    const yok = c.students.filter((x) => day[x.id] === "yok");
    const hr = new Date().getHours();
    const havaBox = h("div.sb-hava");
    const paintHava = () => havaBox.replaceChildren(...HAVA.map(([k, l]) => h("button", { "aria-pressed": String(gunVeri().hava === k), onclick: () => { kaydet((x) => (x.hava = k)); T.speak("Bugün hava " + T.trLower(l)); paintHava(); } }, havaSvg(k), h("span", l))));
    paintHava();
    const duties = T.gorevliler(c);
    body.append(
      h("div.sb-hero", h("div", h("div.sb-big", hr < 12 ? "Günaydın" : "Merhaba", ", " + c.name + "!"), h("p", `Bugün ${T.longDate()}. ${mevsim(new Date().getMonth())} mevsimindeyiz.`))),
      h("div.sb-grid2",
        h("div.sb-card", h("h3", "Bugün hava nasıl?"), h("p.hint", "Pencereden bakalım, birlikte seçelim."), havaBox),
        h("div.sb-card",
          h("h3", "Sınıfımız"),
          taken ? h("p.sb-line", h("b", c.students.length - yok.length + " / " + c.students.length), " arkadaşımız burada.", yok.length ? h("span.hint", " Bugün aramızda olmayanlar: " + yok.map((x) => x.name).join(", ") + ".") : " Herkes burada!") : h("p.sb-line", "Yoklama henüz alınmadı. ", h("button.btn.sm.c-chalk", { onclick: () => T.go("sinif") }, "Yoklama al")),
          duties.length ? h("div.sb-duties", duties.map(([g, st]) => h("div.sb-duty", T.avatar(st.name, 40), h("div", h("small", g), h("b", st.name))))) : h("p.hint", "Sınıfım bölümünden görevli atayabilirsin."))),
      h("div.sb-card.sb-soru", h("h3", "Günün sorusu"), h("div.sb-quote", gununu(SORULAR)), h("div.row", h("button.btn.c-chalk", { onclick: (e) => { const st = T.pick(presentStudents()); if (st) { e.currentTarget.closest(".sb-soru").querySelector(".sb-who").replaceChildren(T.avatar(st.name, 44), h("b", st.name)); T.speak(st.name); } } }, T.icon("class"), "Kim cevaplayacak?"), h("div.sb-who"))));
  }

  /* 2. Takvim: dün, bugün, yarın + ay takvimi */
  function takvim(body) {
    const now = new Date(), v = gunVeri(); const acik = v.acik || {};
    const kart = (k, etiket, d) => {
      const on = acik[k];
      return h("button.sb-day" + (k === "bugun" ? ".today" : ""), { onclick: () => { kaydet((x) => { x.acik = x.acik || {}; x.acik[k] = !x.acik[k]; }); if (!on) T.speak(etiket + " " + GUN[d.getDay()]); takvim2(); } },
        h("small", etiket), on ? h("b", GUN[d.getDay()]) : h("b.sb-q", "?"), on ? h("span", d.getDate() + " " + AY[d.getMonth()] + " " + d.getFullYear()) : h("span.hint", "Dokun, birlikte söyleyelim"));
    };
    const top = h("div.sb-days");
    const takvim2 = () => { Object.assign(acik, gunVeri().acik || {}); top.replaceChildren(kart("dun", "Dün", addDays(now, -1)), kart("bugun", "Bugün", now), kart("yarin", "Yarın", addDays(now, 1))); };
    takvim2();
    const n = T.cal.dayNumber(), st = T.cal.status();
    const info = h("div.sb-facts",
      h("div", h("small", "Ay"), h("b", AY[now.getMonth()])), h("div", h("small", "Mevsim"), h("b", mevsim(now.getMonth()))),
      h("div", h("small", "Haftanın"), h("b", ((now.getDay() + 6) % 7) + 1 + ". günü")), h("div", h("small", "Yılın"), h("b", Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(now.getFullYear(), 0, 0)) / 864e5) + ". günü")),
      st.kind === "okul" ? h("div", h("small", "Okulun"), h("b", n + ". günü")) : null);
    // Ay takvimi
    const y = now.getFullYear(), m = now.getMonth(), first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    const grid = h("div.sb-month", ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((g) => h("div.sb-wd", g)));
    for (let i = 0; i < (first.getDay() + 6) % 7; i++) grid.append(h("div.sb-e"));
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d), we = dt.getDay() === 0 || dt.getDay() === 6, closed = T.cal.closedReason(dt);
      grid.append(h("div" + (sameDay(dt, now) ? ".sb-t" : dt < now ? ".sb-p" : "") + (we ? ".sb-we" : "") + (closed ? ".sb-cl" : ""), { title: closed || "" }, d));
    }
    body.append(top, info, h("div.sb-card", h("h3", AY[m] + " " + y), grid, h("p.hint", "Geçen günler soluk, hafta sonları ve tatiller gri, bugün lacivert.")));
  }

  /* 3. Belirli gün ve haftalar + günün sözü */
  function gunler(body) {
    const b = T.belirliGunler(), soz = gununu(SOZLER, addDays(new Date(), 3));
    const satir = (x, cls) => h("div.sb-bgh" + (cls ? "." + cls : ""), h("b", x.ad), h("span", tarihAraligi(x)));
    body.append(
      h("div.sb-card",
        h("h3", "Belirli gün ve haftalar"),
        b.bugun.length ? h("div", h("div.sb-label", "Bugün"), b.bugun.map((x) => satir(x, "now"))) : null,
        b.hafta.length ? h("div", h("div.sb-label", "Bu hafta"), b.hafta.map((x) => satir(x))) : null,
        !b.bugun.length && !b.hafta.length ? h("p.sb-line", "Bu hafta MEB çizelgesinde bir gün ya da hafta yok.") : null,
        b.yakin.length ? h("div", h("div.sb-label", "Yaklaşanlar"), b.yakin.map((x) => satir(x, "soon"))) : null,
        h("p.hint", "Kaynak: MEB Belirli Gün ve Haftalar Çizelgesi. Okulunun yerel günlerini Ayarlar'daki takvimden ekleyebilirsin.")),
      h("div.sb-card.sb-sozcard",
        h("h3", "Günün sözü"),
        h("blockquote.sb-soz", soz[0]), h("div.sb-kim", soz[1]),
        h("div.row", h("button.btn.c-chalk", { onclick: () => T.speak(soz[0]) }, T.icon("speaker"), "Sesli oku"), h("span.hint", "Sizce ne anlatıyor? Hangi durumda söyleriz?"))));
  }

  /* 4. Günün sayısı: işlemler, kim söyleyecek */
  function sayi(body) {
    const g = T.store.grade(), now = new Date(), v = gunVeri();
    const okulGunu = Math.max(1, T.cal.dayNumber());
    const kaynak = v.kaynak || "okul";
    const n = kaynak === "okul" ? okulGunu : now.getDate();
    const ISLEM = [["1 fazlası", n + 1], ["1 eksiği", n - 1], ["10 fazlası", n + 10], ["10 eksiği", n - 10]];
    if (g >= 2) ISLEM.push(["Tek mi, çift mi?", n % 2 ? "Tek" : "Çift"]);
    if (g >= 2 && n >= 10) ISLEM.push(["Kaç onluk, kaç birlik?", Math.floor(n / 10) + " onluk " + (n % 10) + " birlik"]);
    if (g >= 3) ISLEM.push(["100 fazlası", n + 100], ["İki katı", n * 2]);
    if (g >= 3 && n % 2 === 0) ISLEM.push(["Yarısı", n / 2]);
    if (g >= 4) ISLEM.push(["En yakın onluğa yuvarla", Math.round(n / 10) * 10]);
    const durum = (v.islem = v.islem || {});
    const kim = (v.kim = v.kim || {});
    const used = new Set(Object.values(kim));
    const grid = h("div.sb-ops");
    const paintOps = () => grid.replaceChildren(...ISLEM.map(([ad, cev], i) => {
      const st = T.store.activeClass().students.find((x) => x.id === (gunVeri().kim || {})[i]);
      const acik = (gunVeri().islem || {})[i];
      return h("div.sb-op" + (acik ? ".open" : ""),
        h("small", ad),
        h("button.sb-ans", { onclick: () => { kaydet((x) => { x.islem = x.islem || {}; x.islem[i] = !x.islem[i]; }); if (!acik) { T.sound.ok(); T.speak(String(cev)); } paintOps(); } }, acik ? String(cev) : "?"),
        st ? h("div.sb-who", T.avatar(st.name, 34), h("b", st.name)) :
          h("button.btn.sm.c-chalk", { onclick: () => { const pool = presentStudents().filter((x) => !Object.values(gunVeri().kim || {}).includes(x.id)); const p = T.pick(pool.length ? pool : presentStudents()); if (!p) return; kaydet((x) => { x.kim = x.kim || {}; x.kim[i] = p.id; }); T.speak(p.name); paintOps(); } }, T.icon("class"), "Kim söyleyecek?"));
    }));
    paintOps();
    const H = Math.floor(n / 100), Tn = Math.floor((n % 100) / 10), O = n % 10;
    const blok = h("div.sb-blocks", Array.from({ length: H }, () => h("i.y")), Array.from({ length: Tn }, () => h("i.o")), Array.from({ length: O }, () => h("i.b")));
    body.append(
      h("div.sb-numhead",
        h("div.sb-num", n),
        h("div", h("div.seg", [["okul", "Okulun " + okulGunu + ". günü"], ["ay", "Ayın " + now.getDate() + ". günü"]].map(([k, l]) => h("button", { "aria-pressed": String(k === kaynak), onclick: () => { kaydet((x) => { x.kaynak = k; x.islem = {}; x.kim = {}; }); body.replaceChildren(); sayi(body); } }, l))),
          h("p.sb-line", "Önce kimin söyleyeceğini seç, cevabı çocuk söyledikten sonra kutuya dokun."),
          h("button.btn.sm.c-chalk", { onclick: () => { kaydet((x) => { x.islem = {}; x.kim = {}; }); paintOps(); } }, T.icon("reset"), "Baştan"))),
      blok, grid);
  }

  /* 5. Günün akışı: öğretmen yazar, eve kaç ders kaldı */
  function akis(body) {
    const now = new Date(), wd = now.getDay();
    let a = akisAl();
    const gunNo = wd >= 1 && wd <= 5 ? wd : 1;
    const box = h("div");
    body.append(box);
    function ciz() {
      a = akisAl() || varsayilanAkis();
      const rows = a[gunNo] || [];
      const m = new Date().getHours() * 60 + new Date().getMinutes();
      const dersler = rows.filter((r) => r.tur === "ders");
      const kalan = dersler.filter((r) => dk(r.s) > m).length;
      const simdi = rows.find((r) => dk(r.b) <= m && m < dk(r.s));
      const son = rows.length ? dk(rows[rows.length - 1].s) : 0;
      const yemek = rows.find((r) => r.tur === "yemek");
      const yemegeKadar = yemek && dk(yemek.b) > m ? dersler.filter((r) => dk(r.b) >= m && dk(r.s) <= dk(yemek.b) && dk(r.s) > m).length : null;
      const ozet = !rows.length ? "Bu gün için akış yok." :
        m >= son ? "Bugünün dersleri bitti. Yarın görüşmek üzere!" :
        m < dk(rows[0].b) ? `Dersler ${rows[0].b}'de başlıyor. Bugün ${dersler.length} dersimiz var.` :
        `Eve gitmemize ${kalan} ders kaldı.`;
      const bar = rows.length ? T.clamp((m - dk(rows[0].b)) / Math.max(1, son - dk(rows[0].b)), 0, 1) : 0;
      box.replaceChildren(
        h("div.sb-akishead",
          h("div", h("div.sb-big2", ozet), simdi ? h("p.sb-line", "Şimdi: ", h("b", simdi.ad), ` · bitmesine ${dk(simdi.s) - m} dakika`) : null,
            yemegeKadar != null && yemegeKadar > 0 ? h("p.sb-line", `Öğle yemeğine ${yemegeKadar} ders var.`) : null),
          h("div.row", h("button.btn.c-chalk", { onclick: () => T.speak(ozet) }, T.icon("speaker"), "Oku"), h("button.btn.c-chalk", { onclick: duzenle }, T.icon("edit"), "Akışı düzenle"))),
        h("div.meter.sb-meter", h("i", { style: { width: bar * 100 + "%" } })),
        h("div.sb-flow", rows.map((r, i) => {
          const gecti = dk(r.s) <= m, su = r === simdi;
          const no = r.tur === "ders" ? dersler.indexOf(r) + 1 : null;
          return h("div.sb-slot." + r.tur + (gecti ? ".past" : "") + (su ? ".now" : ""), h("span.t", r.b + " - " + r.s), h("b", r.ad), no ? h("small", no + ". ders") : null, gecti ? T.icon("check") : null);
        })),
        !akisAl() ? h("p.hint", "Bu örnek bir akış. 'Akışı düzenle' ile kendi programını yaz; her sınıf için ayrı saklanır.") : null);
    }
    function duzenle() {
      let cur = JSON.parse(JSON.stringify(akisAl() || varsayilanAkis())), gun = gunNo;
      const tabs = h("div.seg"), list = h("div.sb-edit");
      const gen = { bas: h("input.in", { type: "time", value: "08:40" }), ders: h("input.in", { type: "number", value: 40, min: 20, max: 60 }), ten: h("input.in", { type: "number", value: 10, min: 0, max: 30 }), sayi: h("input.in", { type: "number", value: 6, min: 1, max: 9 }), yemekSonra: h("input.in", { type: "number", value: 4, min: 0, max: 9 }), yemek: h("input.in", { type: "number", value: 40, min: 0, max: 90 }) };
      function p() {
        tabs.replaceChildren(...[1, 2, 3, 4, 5].map((d) => h("button", { "aria-pressed": String(d === gun), onclick: () => { gun = d; p(); } }, GUN[d])));
        list.replaceChildren(...(cur[gun] || []).map((r, i) => h("div.sb-erow",
          h("input.in", { type: "time", value: r.b, onchange: (e) => (r.b = e.target.value) }), h("input.in", { type: "time", value: r.s, onchange: (e) => (r.s = e.target.value) }),
          h("input.in", { value: r.ad, onchange: (e) => (r.ad = e.target.value), "aria-label": "Ad" }),
          h("select.in", { onchange: (e) => (r.tur = e.target.value) }, [["ders", "Ders"], ["teneffus", "Teneffüs"], ["yemek", "Yemek"], ["diger", "Diğer"]].map(([k, l]) => h("option", { value: k, selected: r.tur === k ? true : null }, l))),
          h("button.btn.icon.c-chalk", { "aria-label": "Sil", onclick: () => { cur[gun].splice(i, 1); p(); } }, T.icon("trash")))),
          h("div.row", h("button.btn.sm.c-chalk", { onclick: () => { const l = (cur[gun] || []).slice(-1)[0]; (cur[gun] = cur[gun] || []).push({ b: l ? l.s : "08:40", s: l ? saat(dk(l.s) + 40) : "09:20", ad: "Ders", tur: "ders" }); p(); } }, T.icon("plus"), "Satır ekle"),
            h("button.btn.sm.c-chalk", { onclick: () => { [1, 2, 3, 4, 5].forEach((d) => { if (d !== gun) cur[d] = JSON.parse(JSON.stringify(cur[gun])); }); T.toast("Bu günün akışı diğer günlere kopyalandı"); } }, "Bu günü tüm haftaya kopyala")));
      }
      p();
      const body2 = h("div", { style: { display: "grid", gap: "14px" } },
        h("details.sb-gen", h("summary", "Saatleri otomatik oluştur"),
          h("div.sb-genrow", h("label", "Başlangıç", gen.bas), h("label", "Ders (dk)", gen.ders), h("label", "Teneffüs (dk)", gen.ten), h("label", "Ders sayısı", gen.sayi), h("label", "Yemek kaçıncı dersten sonra", gen.yemekSonra), h("label", "Yemek (dk)", gen.yemek)),
          h("button.btn.sm", { onclick: () => { const o = { bas: gen.bas.value || "08:40", ders: +gen.ders.value || 40, ten: +gen.ten.value || 0, sayi: +gen.sayi.value || 6, yemekSonra: +gen.yemekSonra.value, yemek: +gen.yemek.value || 0 }; const adlar = (cur[gun] || []).filter((r) => r.tur === "ders").map((r) => r.ad); cur[gun] = olustur(o, adlar); p(); } }, "Bu gün için oluştur")),
        tabs, list);
      T.modal({ title: "Günün akışı", wide: true, body: body2, actions: [{ label: "Vazgeç" }, { label: "Kaydet", tone: "c-leaf", onClick: () => { T.store.update((s) => { s.akis = s.akis || {}; s.akis[cid()] = cur; }); ciz(); } }] });
    }
    ciz();
    T._sbTick = setInterval(ciz, 30000);
  }
})();
