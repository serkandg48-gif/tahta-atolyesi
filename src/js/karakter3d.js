/* 3B karakterler: Meshy'de üretilip iskelet takılan modelleri sahneye koyar, animasyonları yumuşak geçişle oynatır.
   Her klip için ayaklar yere bassın diye zemin farkı ölçülür; dört ayaklılardaki ölçek ve konum izleri ayıklanır. */
(function () {
  const KLIP = { bekle: ["Happy_Sway_Standing", "Listening_Gesture"], yuru: ["Walking", "Armature|Unreal Take|baselayer"], kos: ["Running"], salla: ["Wave_One_Hand"], sevin: ["Cheer_with_Both_Hands", "Victory_Cheer"], zipla: ["happy_jump_m"], konus: ["Talk_with_Hands_Open"], cagir: ["Call_Gesture"], saskin: ["Look_Around_Dumbfounded"], hayir: ["Finger_Wag_No"], dans: ["FunnyDancing_01"], dinle: ["Listening_Gesture"], begen: ["Sit_Thumbs_Up_Right"] };
  T.karakter3B = async function (c, ad, ops = {}) {
    const { THREE } = c, { g, m } = await T.modelYukle(ad);
    const kok = new THREE.Group(), ic = new THREE.Group(); kok.add(ic);
    const model = m.SkeletonUtils.clone(g.scene); ic.add(model);
    model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false; if (o.material) { o.material.metalness = 0; o.material.roughness = Math.max(0.6, o.material.roughness || 0.8); } } });
    const dortAyak = !g.animations.some((a) => /Wave|Cheer|Talk/.test(a.name));
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
      const clip = typeof tur === "string" ? bul(tur) : tur;
      if (!clip) { if (dortAyak && (tur === "bekle" || !clip)) { if (aktif) aktif.fadeOut(o.gecis ?? 0.3); aktif = null; aktifK = null; hedefY = durusZemin; } return Promise.resolve(); }
      if (aktifK === clip && o.dongu !== false) return Promise.resolve();
      const ac = mixer.clipAction(clip); ac.reset(); ac.setLoop(o.dongu === false ? THREE.LoopOnce : THREE.LoopRepeat, Infinity); ac.clampWhenFinished = true; ac.timeScale = o.hiz || 1;
      ac.enabled = true; ac.setEffectiveWeight(1); ac.play();
      if (aktif && aktif !== ac) aktif.crossFadeTo(ac, o.gecis ?? 0.3, false); else ac.fadeIn(o.gecis ?? 0.2);
      aktif = ac; aktifK = clip; hedefY = zemin[clip.name] ?? (dortAyak ? durusZemin : 0);
      if (o.dongu === false) return new Promise((r) => (bitti = r));
      return Promise.resolve();
    }
    const nesne = {
      kok, model, klipler, dortAyak, mixer,
      var: (tur) => !!bul(tur),
      oynat,
      guncelle(dt) {
        mixer.update(dt);
        if (dortAyak && !aktif) model.traverse((o) => o.isBone && o.userData.q0 && o.quaternion.copy(o.userData.q0));
        simdiY += (hedefY - simdiY) * Math.min(1, dt * 8); ic.position.y = simdiY;
      },
    };
    if (dortAyak) { hedefY = simdiY = durusZemin; ic.position.y = simdiY; } else { await Promise.resolve(); oynat("bekle"); simdiY = hedefY; ic.position.y = simdiY; }
    return nesne;
  };
})();
