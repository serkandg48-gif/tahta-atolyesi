/* 3B karakterler: Meshy'de üretilip iskelet takılan modelleri sahneye koyar, animasyonları yumuşak geçişle oynatır.
   Her klip için ayaklar yere bassın diye zemin farkı ölçülür; dört ayaklılardaki ölçek ve konum izleri ayıklanır. */
(function () {
  const KLIP = { bekle: ["Idle_3", "Idle_9", "Happy_Sway_Standing", "Listening_Gesture"], yuru: ["Walking", "Armature|Unreal Take|baselayer"], kos: ["Running"], salla: ["Wave_One_Hand"], sevin: ["Cheer_with_Both_Hands", "Cheer_with_Both_Hands_Up", "Victory_Cheer"], zipla: ["happy_jump_m", "Happy_jump_f"], konus: ["Talk_with_Hands_Open", "Discuss_While_Moving"], cagir: ["Call_Gesture"], saskin: ["Look_Around_Dumbfounded"], hayir: ["Finger_Wag_No"], dans: ["FunnyDancing_01", "FunnyDancing_02"], dinle: ["Listening_Gesture"], begen: ["Sit_Thumbs_Up_Right", "Half_Squat_with_Thumb_Up"], alkis: ["Clapping", "Clapping_Run"] };
  const AYAR = { kiz: { bacak: 0.06 } }; /* modele özel düzeltmeler */
  T.karakter3B = async function (c, ad, ops = {}) {
    ops = Object.assign({}, AYAR[ad], ops);
    const { THREE } = c, { g, m } = await T.modelYukle(ad);
    const kok = new THREE.Group(), ic = new THREE.Group(); kok.add(ic);
    const model = m.SkeletonUtils.clone(g.scene); ic.add(model);
    model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false; if (o.material) { o.material.metalness = 0; o.material.roughness = Math.max(0.6, o.material.roughness || 0.8); } } });
    const dortAyak = !g.animations.some((a) => /Wave|Cheer|Talk/.test(a.name));
    /* Otomatik iskelette bazı fazla kemikler (ikinci bir kol zinciri, cebe bağlı bir kemik) hiç canlanmaz.
       Örgü bunlara bağlıyken kol ya da cep yerinde kalıp gerilir. Bu kemiklerin ağırlığı en yakın canlanan kemiğe aktarılır. */
    if (!dortAyak && !g.userData.agirlikDuzeldi) {
      g.userData.agirlikDuzeldi = true;
      const canli = new Set(); g.animations.forEach((a) => a.tracks.forEach((t) => t.name.endsWith(".quaternion") && canli.add(t.name.split(".")[0])));
      const ELLE = { Bone_055: "mixamorigHips" };
      g.scene.updateMatrixWorld(true);
      g.scene.traverse((o) => {
        if (!o.isSkinnedMesh) return;
        const kemik = o.skeleton.bones, poz = kemik.map((b) => b.getWorldPosition(new THREE.Vector3()));
        const esle = kemik.map((b, i) => {
          if (canli.has(b.name)) return i;
          if (ELLE[b.name]) { const j = kemik.findIndex((x) => x.name === ELLE[b.name]); if (j >= 0) return j; }
          let en = i, ed = Infinity; kemik.forEach((x, j) => { if (!canli.has(x.name)) return; const dd = poz[i].distanceTo(poz[j]); if (dd < ed) { ed = dd; en = j; } }); return en;
        });
        const si = o.geometry.attributes.skinIndex;
        for (let v = 0; v < si.count; v++) for (let k = 0; k < 4; k++) { const j = si.getComponent(v, k), y = esle[j]; if (y !== j) si.setComponent(v, k, y); }
        si.needsUpdate = true;
        /* Dizleri birbirine değen modellerde otomatik ağırlık iki bacağa birden yayılır; diz yürürken yapışık kalır.
           Her köşe, bulunduğu taraftaki bacağa bağlanır, öbür bacağın payı silinir. */
        const yan = kemik.map((b) => (/Left(UpLeg|Leg|Foot|ToeBase)/.test(b.name) ? "L" : /Right(UpLeg|Leg|Foot|ToeBase)/.test(b.name) ? "R" : ""));
        const iL = kemik.findIndex((b) => /LeftUpLeg$/.test(b.name)), iR = kemik.findIndex((b) => /RightUpLeg$/.test(b.name));
        if (iL >= 0 && iR >= 0) {
          const sw = o.geometry.attributes.skinWeight, pos = o.geometry.attributes.position, v3 = new THREE.Vector3();
          const xL = poz[iL].x, xR = poz[iR].x, orta = (xL + xR) / 2, isaret = Math.sign(xL - xR);
          for (let v = 0; v < si.count; v++) {
            let varL = false, varR = false; for (let k = 0; k < 4; k++) { if (sw.getComponent(v, k) <= 0) continue; const t = yan[si.getComponent(v, k)]; if (t === "L") varL = true; if (t === "R") varR = true; }
            if (!varL || !varR) continue;
            v3.fromBufferAttribute(pos, v).applyMatrix4(o.matrixWorld);
            const sil = (v3.x - orta) * isaret > 0 ? "R" : "L"; let top = 0;
            for (let k = 0; k < 4; k++) { if (yan[si.getComponent(v, k)] === sil) sw.setComponent(v, k, 0); top += sw.getComponent(v, k); }
            if (top > 0) for (let k = 0; k < 4; k++) sw.setComponent(v, k, sw.getComponent(v, k) / top);
          }
          sw.needsUpdate = true;
        }
      });
    }
    const klipler = {};
    g.animations.forEach((a) => { const k = a.clone(); if (dortAyak) k.tracks = k.tracks.filter((t) => !t.name.endsWith(".scale") && !t.name.endsWith(".position")); else { k.tracks = k.tracks.filter((t) => !t.name.endsWith(".scale")); k.tracks.forEach((t) => { if (!t.name.endsWith(".position")) return; const kemik = model.getObjectByName(t.name.slice(0, -9)); if (!kemik) return; const v = t.values, x0 = kemik.position.x, z0 = kemik.position.z; for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; } }); } klipler[a.name] = k; });
    const bul = (tur) => { for (const n of KLIP[tur] || [tur]) if (klipler[n]) return klipler[n]; return null; };
    const mixer = new THREE.AnimationMixer(model);
    const kutu = new THREE.Box3(), olcu = (dt) => { kok.updateMatrixWorld(true); model.traverse((o) => o.isSkinnedMesh && o.skeleton.update()); kutu.setFromObject(model, true); return kutu; };
    /* boy: ilk bekleme pozunda ölçülür */
    const ilk = bul("bekle") || bul("yuru");
    let a0 = ilk ? mixer.clipAction(ilk) : null;
    if (a0 && !dortAyak) { a0.play(); mixer.update(0.01); }
    const b0 = olcu().clone(), boy = b0.max.y - b0.min.y, s = (ops.boy || 1) / boy;
    model.scale.multiplyScalar(s);
    /* her klibin zemin farkı */
    const zemin = {};
    const zeminOlc = (clip) => { if (zemin[clip.name] != null) return zemin[clip.name]; const ac = mixer.clipAction(clip); mixer.stopAllAction(); ac.reset().play(); let enAz = Infinity; for (let i = 0; i < 4; i++) { ac.time = (clip.duration * i) / 4; mixer.update(0); enAz = Math.min(enAz, olcu().min.y); } ac.stop(); return (zemin[clip.name] = -enAz); };
    let durusZemin = 0;
    if (dortAyak) { mixer.stopAllAction(); model.traverse((o) => { if (o.isBone) o.userData.q0 = o.quaternion.clone(); }); durusZemin = -olcu().min.y; }
    const yuruK = bul("yuru"); if (yuruK) zeminOlc(yuruK); Object.values(klipler).forEach((k) => { if (!dortAyak) zeminOlc(k); });
    mixer.stopAllAction();
    let aktif = null, aktifK = null, hedefY = 0, simdiY = 0, bitti = null;
    mixer.addEventListener("finished", (e) => { if (e.action === aktif && bitti) { const f = bitti; bitti = null; f(); } });
    function oynat(tur, o = {}) {
      /* "dur": sakin duruş. Bekleme klibinin ilk karesi donar; sürekli sallanma olmaz. */
      if (tur === "dur") {
        if (dortAyak) return oynat("bekle", o);
        const k = bul("bekle"); if (!k) return Promise.resolve();
        if (aktifK === k && aktif && aktif.timeScale === 0) return Promise.resolve();
        const ac = mixer.clipAction(k); ac.reset(); ac.setLoop(THREE.LoopRepeat, Infinity); ac.time = 0; ac.timeScale = 0; ac.enabled = true; ac.setEffectiveWeight(1); ac.play();
        if (aktif && aktif !== ac) aktif.crossFadeTo(ac, o.gecis ?? 0.4, false); else ac.fadeIn(o.gecis ?? 0.2);
        aktif = ac; aktifK = k; hedefY = zemin[k.name] ?? 0; return Promise.resolve();
      }
      const clip = typeof tur === "string" ? bul(tur) : tur;
      if (!clip) { if (dortAyak && (tur === "bekle" || !clip)) { if (aktif) aktif.fadeOut(o.gecis ?? 0.3); aktif = null; aktifK = null; hedefY = durusZemin; } return Promise.resolve(); }
      if (aktifK === clip && o.dongu !== false && aktif && aktif.timeScale !== 0) return Promise.resolve();
      const ac = mixer.clipAction(clip); ac.reset(); ac.setLoop(o.dongu === false ? THREE.LoopOnce : THREE.LoopRepeat, Infinity); ac.clampWhenFinished = true; ac.timeScale = o.hiz || 1;
      ac.enabled = true; ac.setEffectiveWeight(1); ac.play();
      if (aktif && aktif !== ac) aktif.crossFadeTo(ac, o.gecis ?? 0.3, false); else ac.fadeIn(o.gecis ?? 0.2);
      aktif = ac; aktifK = clip; hedefY = zemin[clip.name] ?? (dortAyak ? durusZemin : 0);
      if (o.dongu === false) return new Promise((r) => (bitti = r));
      return Promise.resolve();
    }
    /* Bazı modellerde dizler içe kapanır (X bacak). Uyluk dışa, baldır içe biraz döndürülerek bacak düzeltilir. */
    let duzelt = null;
    if (ops.bacak && !dortAyak) {
      const kem = {}; model.traverse((o) => { if (o.isBone) kem[o.name] = o; });
      const ileri = new THREE.Vector3(), q = new THREE.Quaternion(), pq = new THREE.Quaternion(), mq = new THREE.Quaternion();
      /* Döndürme, modelin önden arkaya ekseni etrafında ve kemiğin üst kemiği uzayında yapılır; baldır aynı açıyla geri döner, ayak yerinde kalır. */
      const cevir = (b, aci) => { b.parent.getWorldQuaternion(pq); model.getWorldQuaternion(mq); ileri.set(0, 0, 1).applyQuaternion(mq).applyQuaternion(pq.invert()); q.setFromAxisAngle(ileri, aci); b.quaternion.premultiply(q); b.updateMatrixWorld(true); };
      const ciftler = [["mixamorigLeftUpLeg", "mixamorigLeftLeg", 1], ["mixamorigRightUpLeg", "mixamorigRightLeg", -1]].filter(([u, l]) => kem[u] && kem[l]);
      duzelt = () => { model.updateMatrixWorld(true); ciftler.forEach(([u, l, y]) => { cevir(kem[u], y * ops.bacak); cevir(kem[l], -y * ops.bacak); }); };
    }
    const nesne = {
      kok, model, klipler, dortAyak, mixer,
      var: (tur) => !!bul(tur),
      oynat,
      guncelle(dt) {
        mixer.update(dt);
        if (duzelt) duzelt();
        if (dortAyak && !aktif) model.traverse((o) => o.isBone && o.userData.q0 && o.quaternion.copy(o.userData.q0));
        simdiY += (hedefY - simdiY) * Math.min(1, dt * 8); ic.position.y = simdiY;
      },
    };
    if (dortAyak) { hedefY = simdiY = durusZemin; ic.position.y = simdiY; } else { await Promise.resolve(); oynat("bekle"); simdiY = hedefY; ic.position.y = simdiY; }
    return nesne;
  };
})();
