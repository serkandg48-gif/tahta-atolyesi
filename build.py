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
    "araclar3d.js",
    "math-vitrin.js",
    "math-talks.js",
    "subjects.js",
    "turkce2.js",
    "tiyatro.js",
    "tiyatro3d.js",
    "fenhayat.js",
    "birinci.js",
    "duygu.js",
    "duygu2.js",
    "kesif.js",
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
    "kokpit.js",
    "yardim.js",
    "shell.js",
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
    out = html.replace("/*__CSS__*/", css).replace("/*__JS__*/", 'window.SURUM="' + surum + '";\n' + js)
    (ROOT / "dist").mkdir(exist_ok=True)
    (ROOT / "dist" / "index.html").write_text(out, encoding="utf-8")
    # Ayrı statik sayfalar (gizlilik politikası vb.) olduğu gibi kopyalanır.
    for extra in ("gizlilik.html", "vitrin.html"):
        (ROOT / "dist" / extra).write_text((SRC / extra).read_text(encoding="utf-8"), encoding="utf-8")
    # Üçüncü taraf kütüphaneler (pdf.js) kendi sitemizden sunulur; okul ağları CDN'leri engelleyebiliyor.
    import shutil
    if (SRC / "vendor").exists():
        shutil.copytree(SRC / "vendor", ROOT / "dist" / "vendor", dirs_exist_ok=True)
    if (SRC / "ikon3d").exists():
        shutil.copytree(SRC / "ikon3d", ROOT / "dist" / "ikon3d", dirs_exist_ok=True)
    if (SRC / "muzik").exists():
        shutil.copytree(SRC / "muzik", ROOT / "dist" / "muzik", dirs_exist_ok=True)
    if (SRC / "ambiyans").exists():
        shutil.copytree(SRC / "ambiyans", ROOT / "dist" / "ambiyans", dirs_exist_ok=True)
    if (SRC / "arka").exists():
        shutil.copytree(SRC / "arka", ROOT / "dist" / "arka", dirs_exist_ok=True)
    print(f"dist/index.html {len(out)//1024} KB")


if __name__ == "__main__":
    main()
