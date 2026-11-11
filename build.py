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
    "store.js",
    "ai.js",
    "ciktilar.js",
    "ciktilar-turkce.js",
    "pieces.js",
    "board.js",
    "widgets.js",
    "classroom.js",
    "math-sense.js",
    "math-manip.js",
    "math-sims.js",
    "math-middle.js",
    "math-games.js",
    "math-vitrin.js",
    "math-talks.js",
    "subjects.js",
    "birinci.js",
    "zeka.js",
    "plan.js",
    "settings.js",
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
    out = html.replace("/*__CSS__*/", css).replace("/*__JS__*/", js)
    (ROOT / "dist").mkdir(exist_ok=True)
    (ROOT / "dist" / "index.html").write_text(out, encoding="utf-8")
    # Ayrı statik sayfalar (gizlilik politikası vb.) olduğu gibi kopyalanır.
    for extra in ("gizlilik.html", "vitrin.html"):
        (ROOT / "dist" / extra).write_text((SRC / extra).read_text(encoding="utf-8"), encoding="utf-8")
    print(f"dist/index.html {len(out)//1024} KB")


if __name__ == "__main__":
    main()
