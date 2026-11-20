"""Duman testi: her bölümü ve her etkinliği açar, sayfa hatalarını listeler.
Kullanım: cd dist && python3 -m http.server 8811  (ayrı pencerede), sonra python3 tests/smoke.py"""
import sys
from playwright.sync_api import sync_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8811/"
with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 1366, "height": 900}, service_workers="block")
    hatalar = []; simdi = {"r": ""}
    pg.on("pageerror", lambda e: hatalar.append((simdi["r"], str(e)[:160])))
    pg.goto(URL); pg.evaluate("localStorage.setItem('ta-hosgeldin','1')"); pg.goto(URL); pg.wait_for_timeout(1500)
    rotalar = pg.evaluate("""() => { const l = Object.keys(T.sections).filter(k => k !== 'ekran');
      Object.entries(T.tools).forEach(([k, t]) => { const s = t.back || 'matematik'; if (T.sections[s]) l.push(s + '-' + k); }); return l; }""")
    araclar = pg.evaluate("Object.keys(T.widgets)")
    print(len(rotalar), "sayfa,", len(araclar), "araç")
    for r in rotalar:
        simdi["r"] = r; pg.evaluate("h => { location.hash = h }", r); pg.wait_for_timeout(350)
        bos = pg.evaluate("document.querySelector('#view').innerText.trim().length < 5")
        if bos: hatalar.append((r, "sayfa boş"))
    pg.evaluate("location.hash='#ana'"); pg.wait_for_timeout(800)
    for k in araclar:
        simdi["r"] = "arac:" + k
        try: pg.evaluate("k => { (T.board.aktif() ? T.board : T.yuzen).add(k) }", k); pg.wait_for_timeout(250)
        except Exception as e: hatalar.append((k, str(e)[:160]))
    pg.evaluate("T.$$('.wd, .yz-w').forEach(x => x.remove())")
    for r, h in hatalar: print("HATA", r, "->", h)
    print("bitti,", len(hatalar), "hata")
    sys.exit(1 if hatalar else 0)
