/* Veri katmanı. Şimdilik cihazda (localStorage) tutar.
   Firebase bağlanınca yalnızca load/save değişecek; geri kalan kod aynı kalır. */
T.store = (function () {
  const KEY = "tahta-atolyesi-v1";
  const ADLAR = {
    "3-B": ["Ada", "Ali Can", "Asya", "Berk", "Beren", "Can", "Defne", "Deniz", "Efe", "Elif", "Emir", "Eylül", "Göktuğ", "Hira", "Kerem", "Lina", "Mert", "Nehir", "Ömer", "Selin", "Taylan", "Zeynep"],
    "6-A": ["Arda", "Ayşe", "Bora", "Buse", "Cemre", "Doruk", "Duru", "Ece", "Ege", "Emre", "Esila", "Furkan", "Hamza", "İpek", "Kaan", "Melis", "Miray", "Onur", "Poyraz", "Rüzgar", "Sena", "Tuana", "Umut", "Yağız", "Yaren", "Yusuf"],
    "7-C": ["Alp", "Azra", "Batu", "Cansu", "Çağan", "Dila", "Eren", "Gizem", "Hakan", "Irmak", "Kuzey", "Lara", "Mina", "Nil", "Oğuz", "Öykü", "Rana", "Sarp", "Şule", "Toprak", "Ufuk", "Vera", "Yiğit", "Zehra"],
  };
  const mk = (name, kademe, grade) => ({
    id: T.uid(), name, kademe, grade,
    students: ADLAR[name].map((n) => ({ id: T.uid(), name: n })),
  });
  function defaults() {
    const c1 = mk("3-B", "ilkokul", 3), c2 = mk("6-A", "ortaokul", 6), c3 = mk("7-C", "ortaokul", 7);
    return {
      v: 1,
      settings: { teacher: "", school: "", kademeMode: "auto", subject: "Matematik" },
      classes: [c1, c2, c3],
      activeClassId: c1.id,
      attendance: {},   // classId -> date -> studentId -> durum
      points: {},       // classId -> studentId -> sayı
      behaviorLog: {},  // classId -> [{t, sid, label, d}]
      notes: {},        // classId -> studentId -> [{t, text}]
      seats: {},        // classId -> [[sid|null, sid|null], ...]
      duties: {},       // classId -> {görev: sid}
      boards: {},       // classId -> {bg, widgets:[...]}
      plans: [],        // kaydedilen planlar
      calendar: JSON.parse(JSON.stringify(T.cal.def)),
      sampleDone: false,
    };
  }
  let state = null, mem = null;
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) state = JSON.parse(raw); } catch (e) { state = mem; }
    if (!state || state.v !== 1) state = defaults();
    // eksik alanları tamamla
    const d = defaults();
    for (const k of Object.keys(d)) if (state[k] === undefined) state[k] = d[k];
    if (state.settings) { delete state.settings.geminiKey; delete state.settings.geminiModel; }
    if (!state.sampleDone) seedSample();
    return state;
  }
  /* İlk açılışta "gerçekçi çalışma hâli": bugünün yoklaması, birkaç puan. */
  function seedSample() {
    const c = state.classes[0], today = T.isoDate();
    const a = (state.attendance[c.id] = state.attendance[c.id] || {});
    if (!a[today] && T.cal.isSchoolDay(new Date())) {
      a[today] = {};
      c.students.forEach((s, i) => { a[today][s.id] = i === 4 ? "yok" : i === 11 ? "gec" : "var"; });
    }
    const p = (state.points[c.id] = {});
    c.students.forEach((s, i) => { p[s.id] = [3, 5, 2, 4, 1, 6, 3, 2][i % 8]; });
    state.duties[c.id] = { "Nöbetçi": c.students[2].id, "Kitaplık sorumlusu": c.students[7].id, "Işık sorumlusu": c.students[13].id };
    state.sampleDone = true;
  }
  function save() {
    mem = state;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    subs.forEach((f) => { try { f(state); } catch (e) {} });
  }
  const subs = new Set();
  return {
    get: () => state || load(),
    load, save,
    update(fn) { fn(state || load()); save(); },
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
    reset() { state = defaults(); save(); },
    activeClass() { const s = state || load(); return s.classes.find((c) => c.id === s.activeClassId) || s.classes[0]; },
    kademe() {
      const s = state || load();
      if (s.settings.kademeMode !== "auto") return s.settings.kademeMode;
      const c = this.activeClass(); return c && c.grade >= 5 ? "ortaokul" : "ilkokul";
    },
    grade() { const c = this.activeClass(); return c ? c.grade : 3; },
    student(cid, sid) { const c = (state || load()).classes.find((x) => x.id === cid); return c && c.students.find((s) => s.id === sid); },
  };
})();
