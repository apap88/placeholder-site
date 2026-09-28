/*
  REALIZACJE – tu dodajesz nowe wesela.
  Kolejność w tablicy = kolejność na stronie.

  Pola:
    title   – imiona pary
    place   – miejsce (kościół / sala / miasto)
    date    – miesiąc i rok
    poster  – plakat WebP 1600×900 (pierwsza klatka teasera)
    teaser  – pętla MP4 960×540, 6 s, bez dźwięku
    film    – pełny teledysk:
                { type: "youtube", id: "ID_FILMU" }
                { type: "vimeo",   id: "123456789" }
                { type: "mp4",     src: "assets/video/..." }  (niezalecane dla długich filmów)
              Pusty id = w oknie odtworzy się teaser.
*/
window.PORTFOLIO = [
  {
    title: "Ola i Kuba",
    place: "Sala weselna, Limanowa",
    date: "wrzesień 2026",
    poster: "assets/img/portfolio/01.webp",
    teaser: "assets/video/portfolio/01-teaser.mp4",
    film: { type: "youtube", id: "" }
  },
  {
    title: "Marta i Paweł",
    place: "Kościół i dwór, Nowy Sącz",
    date: "sierpień 2026",
    poster: "assets/img/portfolio/02.webp",
    teaser: "assets/video/portfolio/02-teaser.mp4",
    film: { type: "youtube", id: "" }
  },
  {
    title: "Kasia i Michał",
    place: "Plener nad Dunajcem, Stary Sącz",
    date: "lipiec 2026",
    poster: "assets/img/portfolio/03.webp",
    teaser: "assets/video/portfolio/03-teaser.mp4",
    film: { type: "youtube", id: "" }
  },
  {
    title: "Ania i Bartek",
    place: "Stodoła weselna, Gorlice",
    date: "czerwiec 2026",
    poster: "assets/img/portfolio/04.webp",
    teaser: "assets/video/portfolio/04-teaser.mp4",
    film: { type: "youtube", id: "" }
  },
  {
    title: "Ewa i Tomek",
    place: "Hotel w górach, Krynica-Zdrój",
    date: "maj 2026",
    poster: "assets/img/portfolio/05.webp",
    teaser: "assets/video/portfolio/05-teaser.mp4",
    film: { type: "youtube", id: "" }
  },
  {
    title: "Julia i Adam",
    place: "Sala weselna, Grybów",
    date: "wrzesień 2025",
    poster: "assets/img/portfolio/06.webp",
    teaser: "assets/video/portfolio/06-teaser.mp4",
    film: { type: "youtube", id: "" }
  }
];
