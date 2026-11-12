/* Sınıfım: yoklama, davranış puanı, oturma planı, görevler, liste */
(function () {
  const { h } = T;
  const DUR = {
    var: { label: "Geldi", pill: "ok" },
    yok: { label: "Gelmedi", pill: "bad" },
    gec: { label: "Geç kaldı", pill: "warn" },
    izinli: { label: "İzinli", pill: "info" },
  };
  const ORDER = ["var", "yok", "gec", "izinli"];
  const POS = ["Derse katıldı", "Yardımlaştı", "Özenli çalıştı", "Sırasını bekledi", "Soru sordu", "Liderlik etti"];
  const WORK = ["Dikkatini topla", "Arkadaşını dinle", "Malzemeni hazırla"];
  let tab = "yoklama";
  let dateSel = T.isoDate();

  T.sections.sinif = {
    title: "Sınıfım", icon: "class", tone: "sky",
    desc: "Yoklama, puan, oturma planı",
    render(view) {
      const s = T.store.get(), c = T.store.activeClass();
      const wrap = h("div.view-inner");
      view.append(wrap);
      const tabs = [["yoklama", "Yoklama", "check"], ["puan", "Davranış puanı", "star"], ["oturma", "Oturma planı", "groups"], ["gorev", "Görevler", "trophy"], ["gecmis", "Devam özeti", "calendar"], ["dogum", "Doğum günleri", "star"], ["liste", "Sınıf listesi", "edit"]];
      wrap.append(
        h("div.page-head", h("h1", c.name + " sınıfı"), h("div.sub", c.students.length + " öğrenci. Kayıtlar bu cihazda tutulur; Google ile giriş açılınca bütün cihazlarında görünecek."), h("div.grow"), classPicker()),
        h("div.tabs", { role: "tablist" }, tabs.map(([k, l, ic]) => h("button", { role: "tab", "aria-selected": String(tab === k), onclick: () => { tab = k; T.route(); } }, T.icon(ic), l))));
      const area = h("div"); wrap.append(area);
      ({ yoklama, puan, oturma, gorev, gecmis, dogum, liste })[tab](area, s, c);
    },
  };

  function classPicker() {
    const s = T.store.get();
    return h("div.seg", s.classes.map((c) => h("button", { "aria-pressed": String(c.id === s.activeClassId), onclick: () => { T.store.update((st) => (st.activeClassId = c.id)); T.applyTheme(); T.route(); } }, c.name)));
  }
  T.classPicker = classPicker;

  /* ---------- Yoklama ---------- */
  function yoklama(area, s, c) {
    const att = (s.attendance[c.id] = s.attendance[c.id] || {});
    const day = (att[dateSel] = att[dateSel] || {});
    const d = new Date(dateSel + "T12:00:00");
    const school = T.cal.isSchoolDay(d);
    const counts = { var: 0, yok: 0, gec: 0, izinli: 0 };
    c.students.forEach((st) => counts[day[st.id] || "var"]++);
    const grid = h("div.students");
    c.students.forEach((st) => {
      const v = day[st.id] || "var";
      const b = h("button.stu.s-" + v, { "aria-label": `${st.name}: ${DUR[v].label}. Değiştirmek için dokun.`, onclick: () => {
        const nv = ORDER[(ORDER.indexOf(day[st.id] || "var") + 1) % ORDER.length];
        T.store.update(() => { day[st.id] = nv; }); T.sound.tick(); T.route();
      } }, T.avatar(st.name), st.name, h("span.pill.st." + DUR[v].pill, DUR[v].label));
      grid.append(b);
    });
    const absent = c.students.filter((st) => day[st.id] === "yok").map((st) => st.name);
    const late = c.students.filter((st) => day[st.id] === "gec").map((st) => st.name);
    const izin = c.students.filter((st) => day[st.id] === "izinli").map((st) => st.name);
    const summary = `${c.name} yoklama, ${T.longDate(d)}\nGelen: ${counts.var + counts.gec} / ${c.students.length}\nGelmeyen: ${absent.join(", ") || "yok"}\nGeç kalan: ${late.join(", ") || "yok"}\nİzinli: ${izin.join(", ") || "yok"}`;
    area.append(
      h("div.row", { style: { marginBottom: "18px", gap: "12px" } },
        h("input.in", { type: "date", value: dateSel, style: { width: "auto" }, "aria-label": "Tarih", onchange: (e) => { dateSel = e.target.value || T.isoDate(); T.route(); } }),
        h("div.legend", ORDER.map((k) => h("span.pill." + DUR[k].pill, DUR[k].label + ": " + counts[k]))),
        h("div.spacer"),
        h("button.btn.c-leaf", { onclick: () => { T.store.update(() => c.students.forEach((st) => (day[st.id] = "var"))); T.route(); } }, T.icon("check"), "Herkes geldi"),
        h("button.btn.c-chalk", { onclick: () => T.copyText(summary, "Yoklama özeti kopyalandı. e-Okul'a girerken kullanabilirsin.") }, T.icon("copy"), "Özeti kopyala")),
      !school ? h("p.hint", { style: { marginTop: "-6px" } }, "Bu tarih takvimde okul günü görünmüyor: " + (T.cal.closedReason(d) || "hafta sonu") + ".") : null,
      h("p.hint", "Kartlara dokundukça durum değişir: Geldi, Gelmedi, Geç kaldı, İzinli. Gelmeyenler isim çekme ve gruplara girmez."),
      grid);
  }

  /* ---------- Davranış puanı ---------- */
  function puan(area, s, c) {
    const pts = (s.points[c.id] = s.points[c.id] || {});
    const total = c.students.reduce((a, st) => a + (pts[st.id] || 0), 0);
    const goal = s.settings.classGoal || 100;
    const grid = h("div.students");
    c.students.forEach((st) => grid.append(h("button.stu", { onclick: () => give(st) }, h("span.points", pts[st.id] || 0), T.avatar(st.name), st.name)));
    area.append(
      h("div.paper", { style: { padding: "18px 20px", marginBottom: "20px", display: "grid", gap: "10px" } },
        h("div.row", h("h2", { style: { fontSize: "22px" } }, "Sınıf hedefi"), h("div.spacer"), h("span.readout", total + " / " + goal)),
        h("div.meter", { style: { height: "22px" } }, h("i", { style: { width: Math.min(100, (total / goal) * 100) + "%", background: "var(--sun)" } })),
        h("div.hint", total >= goal ? "Hedefe ulaşıldı. Ortak ödülü birlikte seçin." : "Hedefe " + (goal - total) + " puan kaldı. Her olumlu davranış sınıfın ortak hedefine eklenir."),
        h("div.row", h("button.btn.sm.c-chalk", { onclick: async () => { if (await T.confirm("Puanları sıfırla", "Bütün öğrencilerin puanı sıfırlansın mı?", "Sıfırla")) { T.store.update(() => { s.points[c.id] = {}; }); T.route(); } } }, T.icon("reset"), "Yeni dönem"),
          h("button.btn.sm.c-chalk", { onclick: () => { const v = prompt2("Sınıf hedefi kaç puan olsun?", goal); } }, "Hedefi değiştir"))),
      grid);
    function prompt2(q, val) {
      const inp = h("input.in", { type: "number", value: val, min: 10, step: 10 });
      T.modal({ title: q, body: inp, actions: [{ label: "Vazgeç" }, { label: "Kaydet", tone: "c-leaf", onClick: () => { T.store.update((st) => (st.settings.classGoal = Math.max(10, +inp.value || 100))); T.route(); } }] });
    }
    function give(st) {
      let m;
      const act = (label, delta) => {
        T.store.update((x) => {
          x.points[c.id][st.id] = (x.points[c.id][st.id] || 0) + delta;
          (x.behaviorLog[c.id] = x.behaviorLog[c.id] || []).push({ t: Date.now(), sid: st.id, label, d: delta });
        });
        if (delta > 0) T.sound.ok(); m.close(); T.route();
      };
      m = T.modal({ title: st.name, body: h("div.stack",
        h("div.row", T.avatar(st.name, 72), h("div", h("div.readout", (pts[st.id] || 0) + " puan"), h("div.hint", "Bir davranış seç"))),
        h("h3", { style: { fontSize: "17px" } }, "Teşekkürler"),
        h("div.row", POS.map((p) => h("button.btn.c-leaf", { onclick: () => act(p, 1) }, "+1 " + p))),
        h("h3", { style: { fontSize: "17px" } }, "Üzerinde çalışıyoruz"),
        h("div.row", WORK.map((p) => h("button.btn.c-chalk", { onclick: () => act(p, 0) }, p))),
        h("p.hint", "Üzerinde çalışıyoruz notları puan düşürmez; gelişim raporuna gözlem olarak düşer.")), actions: [{ label: "Kapat" }] });
    }
  }

  /* ---------- Oturma planı ---------- */
  function oturma(area, s, c) {
    let seats = s.seats[c.id];
    const perDesk = 2;
    const nDesk = Math.ceil(c.students.length / perDesk);
    if (!seats || seats.flat().length < c.students.length) {
      const ids = c.students.map((x) => x.id);
      seats = s.seats[c.id] = Array.from({ length: nDesk }, (_, i) => [ids[i * 2] || null, ids[i * 2 + 1] || null]);
      T.store.save();
    }
    const cols = c.students.length > 24 ? 4 : 3;
    let sel = null;
    const room = h("div.seats", { style: { gridTemplateColumns: `repeat(${cols}, 1fr)` } });
    function paint() {
      room.replaceChildren(...seats.map((desk, di) => h("div.desk", desk.map((sid, si) => {
        const st = sid && c.students.find((x) => x.id === sid);
        const isSel = sel && sel[0] === di && sel[1] === si;
        return h("button.seat" + (st ? "" : ".empty") + (isSel ? ".sel" : ""), { style: { border: 0 }, onclick: () => {
          if (!sel) { sel = [di, si]; paint(); return; }
          const [a, b] = sel; const tmp = seats[a][b]; seats[a][b] = seats[di][si]; seats[di][si] = tmp; sel = null; T.store.save(); T.sound.pop(); paint();
        } }, st ? st.name : "boş");
      }))));
    }
    area.append(
      h("div.row", { style: { marginBottom: "16px" } },
        h("button.btn.c-sun", { onclick: () => { const ids = T.shuffle(c.students.map((x) => x.id)); seats.forEach((d, i) => { d[0] = ids[i * 2] || null; d[1] = ids[i * 2 + 1] || null; }); T.store.save(); T.sound.drum(); paint(); } }, T.icon("dice"), "Karıştır"),
        h("span.hint", "İki öğrencinin yerini değiştirmek için önce birine, sonra diğerine dokun.")),
      h("div", { style: { textAlign: "center", fontFamily: "var(--hand)", fontSize: "24px", marginBottom: "10px", color: "var(--chalk)" } }, "Tahta burada"),
      room);
    paint();
  }

  /* ---------- Görevler ---------- */
  function gorev(area, s, c) {
    const dt = (s.duties[c.id] = s.duties[c.id] || {});
    const list = h("div.stack");
    const oto = T.nobetciOto(c);
    list.append(h("label.paper", { style: { padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" } }, h("input", { type: "checkbox", checked: oto ? true : null, onchange: (e) => { T.store.update((st) => { st.nobetOto = st.nobetOto || {}; st.nobetOto[c.id] = e.target.checked; }); T.route(); } }), h("div", h("b", "Nöbetçi her okul günü kendiliğinden değişsin"), h("div.hint", oto ? "Sıra listesine göre her gün bir sonraki öğrenci; o gün gelmeyen atlanır. Bugün: " + ((T.nobetci(c) || {}).name || "-") : "Kapalıyken nöbetçiyi aşağıdan sen seçersin."))));
    Object.entries(dt).forEach(([g, sid]) => {
      const otoN = g === "Nöbetçi" && oto;
      const sel = otoN ? h("div.hint", "Kendiliğinden değişiyor") : h("select.in", { "aria-label": g, onchange: (e) => { T.store.update(() => (dt[g] = e.target.value)); T.route(); } }, c.students.map((st) => h("option", { value: st.id, selected: st.id === sid }, st.name)));
      const st = otoN ? T.nobetci(c) : c.students.find((x) => x.id === sid);
      list.append(h("div.paper", { style: { padding: "12px 16px", display: "flex", alignItems: "center", gap: "14px" } },
        st ? T.avatar(st.name, 52) : null, h("div", { style: { flex: 1 } }, h("div", { style: { fontWeight: 800, fontSize: "18px" } }, g), sel),
        h("button.btn.sm.icon.c-tomato", { "aria-label": g + " görevini sil", onclick: () => { T.store.update(() => delete dt[g]); T.route(); } }, T.icon("trash"))));
    });
    const inp = h("input.in", { placeholder: "Yeni görev, örneğin Pencere sorumlusu", style: { maxWidth: "360px" } });
    area.append(
      h("div.row", { style: { marginBottom: "16px" } },
        h("button.btn.c-sun", { onclick: () => {
          const ids = c.students.map((x) => x.id);
          T.store.update(() => Object.keys(dt).forEach((g) => { dt[g] = ids[(ids.indexOf(dt[g]) + Object.keys(dt).length) % ids.length]; }));
          T.toast("Görevler bir sonraki öğrencilere geçti"); T.route();
        } }, T.icon("rotate"), "Haftalık devret"),
        inp, h("button.btn.c-chalk", { onclick: () => { const v = inp.value.trim(); if (!v) return; T.store.update(() => (dt[v] = c.students[0].id)); T.route(); } }, T.icon("plus"), "Ekle"),
        h("button.btn.c-chalk", { onclick: () => T.gorevliPenceresi(c) }, T.icon("edit"), "Görev adlarını düzenle"),
        h("button.btn.c-chalk", { onclick: () => T.board.add("duties") }, T.icon("board"), "Tahtaya koy")),
      list);
  }

  /* ---------- Devam özeti ---------- */
  function gecmis(area, s, c) {
    const att = s.attendance[c.id] || {};
    const dates = Object.keys(att).sort().reverse();
    const per = {}; c.students.forEach((st) => (per[st.id] = { yok: 0, gec: 0, izinli: 0 }));
    dates.forEach((d) => Object.entries(att[d]).forEach(([sid, v]) => { if (per[sid] && v !== "var") per[sid][v]++; }));
    const csv = ["Tarih;" + c.students.map((st) => st.name).join(";")].concat(dates.map((d) => d + ";" + c.students.map((st) => DUR[att[d][st.id] || "var"].label).join(";"))).join("\n");
    area.append(
      h("div.row", { style: { marginBottom: "16px" } },
        h("button.btn.c-chalk", { onclick: () => T.download(`${c.name}-devam.csv`, csv, "text/csv") }, T.icon("download"), "Excel için indir"),
        h("span.hint", dates.length + " gün kayıtlı")),
      h("div.paper", { style: { padding: "10px 16px", overflow: "auto" } },
        h("table.table", h("thead", h("tr", h("th", "Öğrenci"), h("th.num", "Gelmedi"), h("th.num", "Geç"), h("th.num", "İzinli"))),
          h("tbody", c.students.map((st) => h("tr", h("td", st.name),
            h("td.num", per[st.id].yok ? h("span.pill.bad", per[st.id].yok) : "0"),
            h("td.num", per[st.id].gec ? h("span.pill.warn", per[st.id].gec) : "0"),
            h("td.num", per[st.id].izinli ? h("span.pill.info", per[st.id].izinli) : "0")))))));
  }

  /* ---------- Liste ---------- */
  /* ---------- Doğum günleri ---------- */
  function dogum(area, s, c) {
    const AY = T.AYLAR, d = T.dogumlar(c);
    const yaz = (sid, v) => T.store.update((st) => { st.dogum = st.dogum || {}; const x = (st.dogum[c.id] = st.dogum[c.id] || {}); if (v) x[sid] = v; else delete x[sid]; });
    const satir = (st) => {
      const [ay, gun] = (d[st.id] || "-").split("-");
      const gs = h("select.in", { "aria-label": st.name + " doğum günü", style: { width: "90px" } }, h("option", { value: "" }, "Gün"), Array.from({ length: 31 }, (_, i) => h("option", { value: T.pad(i + 1), selected: T.pad(i + 1) === gun ? true : null }, i + 1)));
      const as = h("select.in", { "aria-label": st.name + " doğum ayı", style: { width: "140px" } }, h("option", { value: "" }, "Ay"), AY.map((a, i) => h("option", { value: T.pad(i + 1), selected: T.pad(i + 1) === ay ? true : null }, a)));
      const kaydet = () => { if (gs.value && as.value) yaz(st.id, as.value + "-" + gs.value); else if (!gs.value && !as.value) yaz(st.id, null); };
      gs.addEventListener("change", kaydet); as.addEventListener("change", kaydet);
      return h("div.dg-satir", T.avatar(st.name, 36), h("b", st.name), gs, as);
    };
    const bugun = T.dogumGunuOlanlar(c), yakin = T.yaklasanDogum(c, 30);
    area.append(h("div", { style: { display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start" } },
      h("div.paper", { style: { padding: "18px", display: "grid", gap: "8px" } }, h("h3", { style: { margin: 0 } }, "Doğum günlerini yaz"), h("p.hint", { style: { margin: 0 } }, "Yalnızca gün ve ay. Yıl istenmez, bilgiler bu cihazda kalır ve yapay zekâya gönderilmez."), c.students.map(satir)),
      h("div.paper", { style: { padding: "18px", display: "grid", gap: "10px" } }, h("h3", { style: { margin: 0 } }, "Yaklaşan doğum günleri"),
        bugun.length ? h("div.dg-bugun", "🎂 Bugün: ", bugun.map((x) => x.name).join(", ")) : null,
        yakin.length ? yakin.map(([st, n, t]) => h("div.dg-satir", T.avatar(st.name, 30), h("b", st.name), h("span", t.getDate() + " " + AY[t.getMonth()]), h("span.hint", n === 1 ? "yarın" : n + " gün sonra"))) : h("p.hint", "Önümüzdeki 30 günde doğum günü yok."),
        h("p.hint", { style: { margin: 0 } }, "Doğum günü olan arkadaş sabah rutininde ve ana sayfada kutlanır. Hafta sonuna denk gelenler cuma günü hatırlatılır."))));
  }
  function liste(area, s, c) {
    const ta = h("textarea.in", { style: { minHeight: "320px" }, "aria-label": "Öğrenci listesi" });
    ta.value = c.students.map((x) => x.name).join("\n");
    const nm = h("input.in", { value: c.name, "aria-label": "Sınıf adı" });
    const gr = h("select.in", { "aria-label": "Sınıf seviyesi" }, [1, 2, 3, 4, 5, 6, 7, 8].map((g) => h("option", { value: g, selected: g === c.grade }, g + ". sınıf")));
    area.append(h("div.paper", { style: { padding: "20px", display: "grid", gap: "14px", maxWidth: "760px" } },
      h("div.form-grid", h("label.f", h("span", "Sınıf adı"), nm), h("label.f", h("span", "Seviye"), gr)),
      h("label.f", h("span", "Her satıra bir öğrenci. e-Okul'dan kopyalayıp yapıştırabilirsin."), ta),
      h("p.hint", "Öğrenci fotoğrafı tutulmaz; herkese adına göre bir hayvan yüzü verilir. Yalnızca ad yazman yeterli."),
      h("div.row",
        h("button.btn.c-leaf", { onclick: () => {
          const names = ta.value.split(/\n+/).map((x) => x.trim()).filter(Boolean);
          T.store.update(() => {
            const old = c.students; c.name = nm.value.trim() || c.name; c.grade = +gr.value; c.kademe = c.grade >= 5 ? "ortaokul" : "ilkokul";
            c.students = names.map((n) => old.find((o) => o.name === n) || { id: T.uid(), name: n });
            delete s.seats[c.id];
          });
          T.applyTheme(); T.toast("Liste kaydedildi"); T.route();
        } }, T.icon("save"), "Kaydet"),
        h("button.btn.c-sky", { onclick: () => {
          T.store.update((st) => { const nc = { id: T.uid(), name: "Yeni sınıf", grade: 1, kademe: "ilkokul", students: [] }; st.classes.push(nc); st.activeClassId = nc.id; });
          T.route();
        } }, T.icon("plus"), "Yeni sınıf"),
        h("div.spacer"),
        s.classes.length > 1 ? h("button.btn.c-tomato", { onclick: async () => {
          if (!(await T.confirm("Sınıfı sil", c.name + " ve bütün kayıtları silinsin mi?", "Sil"))) return;
          T.store.update((st) => { st.classes = st.classes.filter((x) => x.id !== c.id); st.activeClassId = st.classes[0].id; });
          T.applyTheme(); T.route();
        } }, T.icon("trash"), "Sınıfı sil") : null)));
  }
})();
