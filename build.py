#!/usr/bin/env python3
"""Kaynak dosyaları tek bir index.html'e birleştirir.

Kullanım: python3 build.py
Çıktı: dist/index.html
Kendi sitende istersen src/ klasörünü olduğu gibi de yayınlayabilirsin;
bu betik yalnızca tek dosyalık sürümü üretir.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"

# Yükleme sırası önemli: çekirdek önce, kabuk en son.
JS_ORDER = [
    "core.js",
    "calendar.js",
    "icons.js",
    "malzeme.js",
    "store.js",
    "ai.js",
    "ciktilar.js",
    "ciktilar-turkce.js",
    "pieces.js",
    "board.js",
    "widgets.js",
    "classroom.js",
    "sabah.js",
    "math-sense.js",
    "math-manip.js",
    "math-sims.js",
    "math-middle.js",
    "math-games.js",
    "grafik.js",
    "dort-islem.js",
    "sahne.js",
    "tavsan.js",
    "oyun-sahne.js",
    "kutup.js",
    "timsah.js",
    "lav.js",
    "ari.js",
    "denge3d.js",
    "kumbara3d.js",
    "oyun3d.js",
    "oyunlar3d.js",
    "kural.js",
    "araclar3d.js",
    "sinif-sohbet.js",
    "bes-dakika.js",
    "math-vitrin.js",
    "math-strateji.js",
    "math-basket.js",
    "kazanim-mat3.js",
    "kazanim-mat3b.js",
    "math-talks.js",
    "subjects.js",
    "turkce2.js",
    "tiyatro.js",
    "tiyatro3d.js",
    "karakter3d.js",
    "yazitahtasi.js", "kelime-bankasi.js", "yazilis.js", "kasaba.js", "mutfak.js",
    "fenhayat.js",
    "birinci.js",
    "duygu.js",
    "duygu2.js",
    "kesif.js",
    "sinif-hafiza.js",
    "rutin-veri.js",
    "rutin.js",
    "kitap-rapor.js",
    "olcme-arac.js",
    "sinif-araclari.js",
    "kalem-katman.js",
    "ders-kitap.js",
    "zeka.js",
    "plan.js",
    "settings.js",
    "vekil.js",
    "kokpit.js",
    "yardim.js",
    "shell.js",
    "ikon-duzen.js",
    "komut.js",
]


def main():
    html = (SRC / "index.html").read_text(encoding="utf-8")
    css = (SRC / "styles.css").read_text(encoding="utf-8") + "\n" + (SRC / "theme.css").read_text(encoding="utf-8")
    parts = []
    for name in JS_ORDER:
        p = SRC / "js" / name
        parts.append(f"/* ---- {name} ---- */\n" + p.read_text(encoding="utf-8"))
    js = "\n".join(parts)
    import hashlib
    surum = hashlib.sha1((css + js).encode("utf-8")).hexdigest()[:10]
    dist = ROOT / "dist"
    dist.mkdir(exist_ok=True)
    # CSS ve JS sürüm adlı ayrı dosyalara yazılır: tarayıcı önbelleğe alır, yalnızca değişince yeniden indirir.
    for eski in list(dist.glob("app.*.js")) + list(dist.glob("app.*.css")):
        eski.unlink()
    (dist / f"app.{surum}.css").write_text(css, encoding="utf-8")
    (dist / f"app.{surum}.js").write_text('window.SURUM="' + surum + '";\n' + js, encoding="utf-8")
    out = (html.replace("<style>\n/*__CSS__*/\n</style>", f'<link rel="stylesheet" href="app.{surum}.css">')
               .replace("<script>\n/*__JS__*/\n</script>", f'<script src="app.{surum}.js"></script>'))
    assert "/*__" not in out, "index.html yer tutucuları bulunamadı"
    (dist / "index.html").write_text(out, encoding="utf-8")
    # Ayrı statik sayfalar (gizlilik politikası vb.) olduğu gibi kopyalanır.
    for extra in ("gizlilik.html", "vitrin.html"):
        (ROOT / "dist" / extra).write_text((SRC / extra).read_text(encoding="utf-8"), encoding="utf-8")
    # Üçüncü taraf kütüphaneler (pdf.js) kendi sitemizden sunulur; okul ağları CDN'leri engelleyebiliyor.
    import shutil
    import json as _j2
    # Kaynakta silinen dosyalar dist içinde kalmasın: kopyalanan klasörler önce temizlenir.
    for d in ("vendor", "ikon3d", "kitaplar", "muzik", "ambiyans", "arka"):
        if (SRC / d).exists() and (dist / d).exists():
            shutil.rmtree(dist / d)
    if (SRC / "vendor").exists():
        shutil.copytree(SRC / "vendor", ROOT / "dist" / "vendor", dirs_exist_ok=True)
    if (SRC / "ikon3d").exists():
        shutil.copytree(SRC / "ikon3d", ROOT / "dist" / "ikon3d", dirs_exist_ok=True)
    if (SRC / "kitaplar").exists():
        shutil.copytree(SRC / "kitaplar", ROOT / "dist" / "kitaplar", dirs_exist_ok=True)
        import json as _j
        ids = sorted(int(f.stem) for f in (SRC / "kitaplar").glob("*.pdf") if f.stem.isdigit())
        (ROOT / "dist" / "kitaplar" / "liste.json").write_text(_j.dumps(ids))
    if (SRC / "muzik").exists():
        shutil.copytree(SRC / "muzik", ROOT / "dist" / "muzik", dirs_exist_ok=True)
    if (SRC / "ambiyans").exists():
        shutil.copytree(SRC / "ambiyans", ROOT / "dist" / "ambiyans", dirs_exist_ok=True)
    if (SRC / "arka").exists():
        shutil.copytree(SRC / "arka", ROOT / "dist" / "arka", dirs_exist_ok=True)
    # Uygulama gibi kurulum ve internet kesilince açılma: manifest, simgeler ve service worker
    if (dist / "pwa").exists():
        shutil.rmtree(dist / "pwa")
    shutil.copytree(SRC / "pwa", dist / "pwa")
    ikonlar = sorted("/ikon3d/" + f.name for f in (SRC / "ikon3d").glob("*") if f.is_file())
    on = ["/", f"/app.{surum}.css", f"/app.{surum}.js", "/pwa/ikon-192.png"] + ikonlar
    sw = (SRC / "sw.js").read_text(encoding="utf-8").replace("__SURUM__", surum).replace("__ONBELLEK__", _j2.dumps(on))
    (dist / "sw.js").write_text(sw, encoding="utf-8")
    print(f"dist/index.html {len(out)//1024} KB, app.{surum}.js {len(js)//1024} KB")


if __name__ == "__main__":
    main()
