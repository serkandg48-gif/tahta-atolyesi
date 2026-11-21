/* Öğretmenin ayıkladığı araçlar: listelerde ve aramada görünmez. Kaynak kod duruyor, eski bağlantılar ana sayfaya döner. */
(function () {
  const KALDIR = [
    "kd-mat-3-2-3", "kd-mat-3-2-6", "kd-mat-3-2-7", "kd-mat-3-3-2", "kd-mat-3-3-3", "kd-mat-3-3-5", "kd-mat-3-3-6", "kd-mat-3-3-8",
    "kup-acinim", "oyun-islem-sirasi", "oyun-asal-yaris", "oyun-esini-bul", "oyun-onu-tamamla", "oyun-kalanli",
    "oyun-bilgi-arisi", "oyun-problem-ciftligi", "oyun-ayiyi-besle", "oyun-saat-treni", "oyun-grafik-dedektifi", "oyun-sifre",
    "oyun-kesri-boya", "oyun-kutup-yolu", "oyun-adil-paylasim", "oyun-deniz-canavari", "oyun-carpan", "sayi-konusmasi",
    "tangram", "sekiller", "serbest", "serbest-kareli",
  ];
  KALDIR.forEach((k) => delete T.tools[k]);
  /* matematik simülasyonları ve ortaokul sekmesi kaldırıldı */
  Object.keys(T.tools).forEach((k) => { const t = T.tools[k]; if ((t.cat === "sim" || t.cat === "orta" || t.cat === "tuval") && (t.back || "matematik") === "matematik") delete T.tools[k]; });
  const AD = { "kup-gorunum": "Önden, yandan, üstten", "oyun-lav": "Yüzlük tabloda zıpla", saat: "Saat", "matematik-konusmasi": "Matematik sohbetleri" };
  Object.entries(AD).forEach(([k, ad]) => { if (T.tools[k]) T.tools[k].title = ad; });
  if (T.tools["oyun-hizli-gor"]) T.tools["oyun-hizli-gor"].cat = "his";
})();
