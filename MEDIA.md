# Materiały do strony – specyfikacja

Łącznie: **13 plików wideo** i **18 zdjęć**. Nazwy plików muszą być dokładnie takie jak w tabelach (małe litery, bez polskich znaków i spacji). Wtedy wystarczy wrzucić plik do folderu i strona sama go podchwyci. Jeśli pliku brakuje, strona pokazuje plakat i działa dalej.

## Wideo

| Plik | Rozdzielczość | Długość | Bitrate (Restrict to) | Docelowy rozmiar | Co na nim |
|---|---|---|---|---|---|
| `video/hero/hero-desktop.mp4` | 1920×1080 | 10–15 s | 4000 kb/s | ≤ 6 MB | Najmocniejsze ujęcia: dron, para, sala. Lewa strona kadru ciemniejsza i spokojna (tam jest tekst). |
| `video/hero/hero-mobile.mp4` | 720×1280 (pion) | 10–15 s | 2000 kb/s | ≤ 3 MB | Ten sam montaż przekadrowany do pionu. Dół kadru spokojny (tam jest tekst). |
| `video/services/dron.mp4` | 800×1000 | 6–8 s | 1500 kb/s | ≤ 1,5 MB | Przelot dronem nad kościołem/salą |
| `video/services/fpv.mp4` | 800×1000 | 6–8 s | 1800 kb/s | ≤ 1,5 MB | Fragment przelotu FPV (dużo ruchu = trochę wyższy bitrate) |
| `video/services/teledysk.mp4` | 800×1000 | 6–8 s | 1500 kb/s | ≤ 1,5 MB | Szybkie cięcia z teledysku |
| `video/services/zdjecia.mp4` | 800×1000 | 6–8 s | 1500 kb/s | ≤ 1,5 MB | Sesja w plenerze, zakulisowo (fotograf przy pracy) |
| `video/fpv/fpv.mp4` | 1920×1080 | 10–15 s | 4500 kb/s | ≤ 7 MB | Najlepszy przelot FPV w całości |
| `video/portfolio/01-teaser.mp4` … `06-teaser.mp4` | 960×540 | 6 s | 1500 kb/s | ≤ 1,2 MB | Po jednym teaserze z każdego wesela |

Pełne teledyski **nie** idą na serwer. Wrzucasz je na YouTube lub Vimeo i wpisujesz ID w `assets/js/portfolio-data.js`.

### Ustawienia w DaVinci Resolve (Deliver → Custom Export)

- **Format:** MP4, **Codec:** H.264 (nie H.265, bo Firefox i część Androidów go nie odtworzą).
- **Encoder:** NVIDIA / Intel QSV / Apple, jeśli jest; w przeciwnym razie Native.
- **Resolution:** Custom, wpisz wartości z tabeli. **Frame rate:** 25 fps.
- **Quality:** Restrict to … kb/s (wartość z tabeli). **Encoding Profile:** High. **Key Frames:** Automatic.
- **Network Optimization:** zaznaczone (plik zaczyna grać, zanim się cały pobierze).
- **Audio:** odznacz *Export Audio*. Pętle na stronie są zawsze wyciszone, a ścieżka to zbędne kilobajty.
- **Color:** zostaw Rec.709. Jeśli na Macu po eksporcie kolory są wyprane, ustaw *Output color space tag* na *Rec.709-A*.
- Przekadrowanie do pionu i 4:5: w Timeline Settings ustaw rozdzielczość docelową, a w *Mismatched resolution* wybierz *Scale full frame with crop*, potem dopasuj kadr w Inspectorze.

### Zasady montażu pętli

- Bez napisów i logo w wideo. Tekst jest w HTML, więc da się go czytać i indeksować.
- Pętla ma się nie „szarpać”: koniec klipu powinien pasować do początku. Najprościej zakończyć ujęciem podobnym do pierwszego albo dać 10–12 klatek przenikania na styku.
- Bez błysków i gwałtownych zmian jasności co chwilę (męczy i jest problemem dla osób wrażliwych na migotanie).
- Pierwsza klatka = plakat (patrz niżej), żeby nie było przeskoku, gdy wideo startuje.

## Zdjęcia

Wszystko w **WebP**. DaVinci nie eksportuje WebP, więc: eksportuj klatkę jako PNG, a potem konwertuj w [Squoosh](https://squoosh.app) (WebP, quality 75–80) albo hurtowo w XnConvert.

| Plik | Wymiar | Maks. rozmiar | Skąd |
|---|---|---|---|
| `img/hero/hero-poster-desktop.webp` | 1920×1080 | 250 KB | pierwsza klatka `hero-desktop.mp4` |
| `img/hero/hero-poster-mobile.webp` | 720×1280 | 150 KB | pierwsza klatka `hero-mobile.mp4` |
| `img/hero/frame-1.webp` … `frame-4.webp` | 600×800 | 90 KB | 4 zdjęcia pionowe 3:4, zjeżdżają się wokół wideo w headerze |
| `img/services/dron.webp`, `fpv.webp`, `teledysk.webp`, `zdjecia.webp` | 800×1000 | 120 KB | pierwsza klatka odpowiedniego wideo |
| `img/fpv/fpv-poster.webp` | 1920×1080 | 250 KB | pierwsza klatka `fpv.mp4` |
| `img/portfolio/01.webp` … `06.webp` | 1600×900 | 200 KB | pierwsza klatka teasera |
| `img/og-image.jpg` | 1200×630 | 200 KB | JPG q80; miniatura przy udostępnianiu linku |

Klatka w DaVinci: w zakładce Color prawy klik na podglądzie → *Grab Still*, potem w Gallery prawy klik → *Export* → PNG.

## Tymczasowo: Pexels

Pobieraj wersję HD (1920×1080) i przepuść przez DaVinci z ustawieniami jak wyżej, żeby od razu przetestować wagę strony. Frazy do wyszukania:

- hero: `wedding aerial`, `bride groom drone`, `wedding couple mountains`
- dron: `church aerial`, `drone countryside`
- FPV: `fpv drone`, `fpv indoor`, `drone flying through`
- teledysk: `wedding dance`, `wedding party`
- zdjęcia: `wedding photographer`, `photoshoot outdoor`
- portfolio: `wedding couple`, `wedding ceremony`, `first dance`
