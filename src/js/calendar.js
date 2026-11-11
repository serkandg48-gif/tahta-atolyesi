/* MEB 2026-2027 çalışma takvimi.
   Kaynak: MEB 13 Haziran 2026 genelgesi (açılış 14 Eylül 2026, kapanış 25 Haziran 2027,
   ara tatiller 16-20 Kasım 2026 ve 8-12 Mart 2027, yarıyıl 25 Ocak - 5 Şubat 2027)
   ve Diyanet 2027 dini günler takvimi. Öğretmen Ayarlar'dan düzeltebilir. */
T.cal = (function () {
  const D = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const def = {
    start: "2026-09-14",
    end: "2027-06-25",
    term1End: "2027-01-22",
    term2Start: "2027-02-08",
    closed: [
      ["2026-10-29", "2026-10-29", "Cumhuriyet Bayramı"],
      ["2026-11-16", "2026-11-20", "1. dönem ara tatili"],
      ["2027-01-01", "2027-01-01", "Yılbaşı"],
      ["2027-01-25", "2027-02-05", "Yarıyıl tatili"],
      ["2027-03-08", "2027-03-12", "2. dönem ara tatili ve Ramazan Bayramı"],
      ["2027-04-23", "2027-04-23", "Ulusal Egemenlik ve Çocuk Bayramı"],
      ["2027-05-17", "2027-05-19", "Kurban Bayramı ve 19 Mayıs"],
    ],
  };
  const special = {
    "09-15": "Demokrasi ve Millî Birlik Günü",
    "10-29": "Cumhuriyet Bayramı",
    "11-10": "Atatürk'ü Anma Günü",
    "11-24": "Öğretmenler Günü",
    "12-03": "Dünya Engelliler Günü",
    "03-12": "İstiklal Marşı'nın Kabulü",
    "03-18": "Çanakkale Zaferi",
    "04-23": "Ulusal Egemenlik ve Çocuk Bayramı",
    "05-19": "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
    "06-05": "Dünya Çevre Günü",
  };
  function cfg() { return (T.store && T.store.get().calendar) || def; }
  function closedReason(d) {
    const c = cfg(), iso = T.isoDate(d);
    for (const [a, b, why] of c.closed) if (iso >= a && iso <= b) return why;
    return null;
  }
  function isSchoolDay(d) {
    const c = cfg(), iso = T.isoDate(d), wd = d.getDay();
    if (wd === 0 || wd === 6) return false;
    if (iso < c.start || iso > c.end) return false;
    return !closedReason(d);
  }
  function countBetween(a, b) { // a ve b dahil
    let n = 0; const d = new Date(a);
    while (d <= b) { if (isSchoolDay(d)) n++; d.setDate(d.getDate() + 1); }
    return n;
  }
  function dayNumber(d = new Date()) {
    const c = cfg(), s = D(c.start);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day < s) return 0;
    return countBetween(s, day);
  }
  function total() { const c = cfg(); return countBetween(D(c.start), D(c.end)); }
  function status(d = new Date()) {
    const c = cfg();
    const iso = T.isoDate(d);
    if (iso < c.start) return { kind: "once", text: "Okulların açılmasına " + Math.ceil((D(c.start) - d) / 864e5) + " gün var" };
    if (iso > c.end) return { kind: "sonra", text: "Eğitim yılı tamamlandı" };
    const why = closedReason(d);
    if (why) return { kind: "tatil", text: why };
    if (d.getDay() === 0 || d.getDay() === 6) return { kind: "haftasonu", text: "Hafta sonu" };
    return { kind: "okul", text: "" };
  }
  function nextBreak(d = new Date()) {
    const iso = T.isoDate(d);
    const nx = cfg().closed.find(([a]) => a > iso);
    if (!nx) return null;
    return { name: nx[2], days: countBetween(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1), new Date(D(nx[0]).getTime() - 864e5)), date: D(nx[0]) };
  }
  function specialDay(d = new Date()) { return special[`${T.pad(d.getMonth() + 1)}-${T.pad(d.getDate())}`] || null; }
  /* Yıllık plan için: eğitim haftaları (pazartesi tarihleri, tatil olmayanlar) */
  function weeks() {
    const c = cfg(); const out = []; const d = D(c.start);
    while (T.isoDate(d) <= c.end) {
      const mon = new Date(d); const fri = new Date(d); fri.setDate(fri.getDate() + 4);
      let n = 0; const x = new Date(mon);
      for (let i = 0; i < 5; i++) { if (isSchoolDay(x)) n++; x.setDate(x.getDate() + 1); }
      out.push({ monday: T.isoDate(mon), friday: T.isoDate(fri), schoolDays: n, closed: n === 0 ? closedReason(mon) || "Tatil" : null });
      d.setDate(d.getDate() + 7);
    }
    return out;
  }
  return { def, isSchoolDay, dayNumber, total, status, nextBreak, specialDay, weeks, closedReason };
})();
