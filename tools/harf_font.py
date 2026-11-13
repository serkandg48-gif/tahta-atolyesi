"""Yazılış çizgilerinden (src/js/yazilis.js) "Tahta Harf" yazı tipini üretir.
Böylece fişler, şıklar ve yazılış kartı aynı harf biçimini kullanır.
Çalıştırma: python3 tools/harf_font.py  (node, shapely, svgpathtools, fonttools gerekir)"""
import json, subprocess, pathlib
from svgpathtools import parse_path
from shapely.geometry import LineString, Point
from shapely.ops import unary_union
from shapely.geometry.polygon import orient
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

KOK = pathlib.Path(__file__).resolve().parent.parent
js = (KOK / "src/js/yazilis.js").read_text()
veri = json.loads(subprocess.check_output(["node", "-e", "global.T={h(){}};global.document={};" + js + ";console.log(JSON.stringify(T.YAZILIS))"]))

S = 9.0          # yazılış birimi -> yazı tipi birimi
YARI = 5.0       # çizgi kalınlığının yarısı (yazılışta 10)
NOKTA = 6.2
KENAR = 5        # harfin iki yanındaki boşluk (yazılış birimi)

def sekil(c):
    parca = []
    for st in c:
        if isinstance(st, dict) and "nokta" in st:
            x, y = st["nokta"]; parca.append(Point(x, y).buffer(NOKTA, 24)); continue
        yol = parse_path(st)
        for seg in yol:
            n = max(8, int(seg.length() / 1.5))
            pts = [seg.point(i / n) for i in range(n + 1)]
            parca.append(LineString([(p.real, p.imag) for p in pts]).buffer(YARI, 16, cap_style=1, join_style=1))
    return unary_union(parca).simplify(0.15)

def ciz(pen, geom, ox):
    polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    for poly in polys:
        poly = orient(poly, 1.0)  # dış saat yönü tersi (y aşağı) -> y çevrilince saat yönü
        for ring in [poly.exterior] + list(poly.interiors):
            pts = list(ring.coords)[:-1]
            pts = [(round((x + ox) * S), round((100 - y) * S)) for x, y in pts]
            pen.moveTo(pts[0])
            for p in pts[1:]: pen.lineTo(p)
            pen.closePath()

harfler = {**veri["K"], **veri["B"], **veri["N"]}
adlar = [".notdef", "space"] + ["u%04X" % ord(ch) for ch in harfler]
fb = FontBuilder(1000, isTTF=True)
fb.setupGlyphOrder(adlar)
fb.setupCharacterMap({32: "space", **{ord(ch): "u%04X" % ord(ch) for ch in harfler}})
glifler, olcu = {}, {}
bos = TTGlyphPen(None); glifler[".notdef"] = bos.glyph(); olcu[".notdef"] = (500, 0)
bos = TTGlyphPen(None); glifler["space"] = bos.glyph(); olcu["space"] = (int(19 * S), 0)
for ch, d in harfler.items():
    pen = TTGlyphPen(None)
    g = sekil(d["c"]); minx = g.bounds[0]
    ox = KENAR - minx
    ciz(pen, g, ox)
    ad = "u%04X" % ord(ch)
    glifler[ad] = pen.glyph()
    olcu[ad] = (int(round((g.bounds[2] - minx + 2 * KENAR) * S)), int(round(KENAR * S)))
fb.setupGlyf(glifler)
fb.setupHorizontalMetrics(olcu)
fb.setupHorizontalHeader(ascent=880, descent=-420)
fb.setupNameTable({"familyName": "Tahta Harf", "styleName": "Regular"})
fb.setupOS2(sTypoAscender=880, sTypoDescender=-420, usWinAscent=1000, usWinDescent=420, sxHeight=int(40 * S), sCapHeight=int(80 * S))
fb.setupPost()
cikti = KOK / "src/vendor/tahta-harf"; cikti.mkdir(parents=True, exist_ok=True)
ttf = cikti / "tahta-harf.ttf"; fb.save(str(ttf))
f = TTFont(str(ttf)); f.flavor = "woff"; f.save(str(cikti / "tahta-harf.woff")); ttf.unlink()
print("ok", len(harfler), "harf")
