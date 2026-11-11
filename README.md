# Tahta Atölyesi (çalışma adı)

Akıllı tahta için ders ekranı, yoklama, sınıf yönetimi, matematik manipülatifleri, ders araçları ve yapay zekayla plan.

## Klasörler

- `src/index.html`: sayfa iskeleti
- `src/styles.css`: bütün görünüm (ilkokul ve ortaokul temaları)
- `src/js/`: modüller. Yükleme sırası `build.py` içinde yazılı.
- `dist/index.html`: tek dosyalık derlenmiş sürüm

## Derleme

```
python3 build.py
```

## Kendi sitende yayınlama (ücretsiz)

1. GitHub'da yeni bir depo aç, bu klasörü yükle.
2. Cloudflare Pages'te depoyu bağla. Yayın klasörü: `dist`.
3. Adres `projeadi.pages.dev` olur. Alan adını sonra bağlarsın.

## Sıradaki adımlar

- Firebase ile Google girişi ve bulut kayıt (`src/js/store.js` içindeki load/save).
- Gemini anahtarını sunucu tarafına taşıma (Cloudflare Pages Functions).
- Yazı tiplerini dosyaya gömme ve internetsiz çalışma (PWA).
