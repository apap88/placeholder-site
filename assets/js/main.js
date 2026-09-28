/* PlaceHolder – logika strony */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isMobilePortrait = window.matchMedia("(max-width: 767.98px) and (orientation: portrait)").matches;

  /* ---------- Nawigacja: tło po przewinięciu ---------- */
  const nav = document.querySelector(".site-nav");
  const onScroll = () => nav && nav.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Hero: osobne wideo dla desktopu i telefonu ---------- */
  const heroVideo = document.querySelector(".js-hero-video");
  if (heroVideo && !reduceMotion && !saveData) {
    heroVideo.src = isMobilePortrait ? heroVideo.dataset.srcMobile : heroVideo.dataset.srcDesktop;
    heroVideo.addEventListener("playing", () => heroVideo.classList.add("is-playing"), { once: true });
    // brak pliku = zostaje plakat, strona działa dalej
    heroVideo.addEventListener("error", () => heroVideo.remove(), { once: true });
    heroVideo.play().catch(() => {});
  }

  /* ---------- Realizacje: generowane z portfolio-data.js ---------- */
  const storiesRoot = document.querySelector(".js-stories");
  const items = Array.isArray(window.PORTFOLIO) ? window.PORTFOLIO : [];
  if (storiesRoot) {
    storiesRoot.innerHTML = items.map((item, i) => `
      <article class="story">
        <figure class="media story__media js-hover-media" tabindex="0" data-film-index="${i}"
                role="button" aria-label="Obejrzyj film: ${item.title}">
          <div class="story__media-inner">
            <img src="${item.poster}" alt="" width="1600" height="900" loading="lazy">
            <video muted loop playsinline preload="none" data-src="${item.teaser}" aria-hidden="true"></video>
          </div>
        </figure>
        <div class="story__text">
          <h3>${item.title}</h3>
          <p class="story__meta">${item.place}, ${item.date}</p>
          <button class="story__play" type="button" data-film-index="${i}">Obejrzyj teledysk</button>
        </div>
      </article>`).join("");
  }

  /* ---------- Wideo na hover (desktop) / w widoku (telefon) ---------- */
  const mediaEls = document.querySelectorAll(".js-hover-media");

  const loadVideo = (video) => {
    if (!video.getAttribute("src")) video.src = video.dataset.src;
  };
  const playIn = (fig) => {
    const v = fig.querySelector("video");
    if (!v || fig.classList.contains("no-video")) return;
    loadVideo(v);
    v.play().catch(() => {});
  };
  const pauseIn = (fig) => {
    const v = fig.querySelector("video");
    if (v && !v.paused) v.pause();
  };

  const viewObserver = ("IntersectionObserver" in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? playIn(e.target) : pauseIn(e.target)));
      }, { threshold: 0.6 })
    : null;

  mediaEls.forEach((fig) => {
    const v = fig.querySelector("video");
    if (!v) return;
    v.addEventListener("playing", () => fig.classList.add("is-playing"));
    v.addEventListener("pause", () => fig.classList.remove("is-playing"));
    v.addEventListener("error", () => fig.classList.add("no-video"));

    const autoInView = fig.classList.contains("js-autoplay-in-view");

    if (canHover && !autoInView) {
      fig.addEventListener("pointerenter", () => playIn(fig));
      fig.addEventListener("pointerleave", () => pauseIn(fig));
      fig.addEventListener("focus", () => playIn(fig));
      fig.addEventListener("blur", () => pauseIn(fig));
    } else if (viewObserver && !reduceMotion && !saveData) {
      // telefon nie ma hovera: odtwarzamy, gdy karta jest na ekranie
      viewObserver.observe(fig);
    }
  });

  /* ---------- Okno z pełnym filmem ---------- */
  const modalEl = document.getElementById("filmModal");
  const slot = modalEl && modalEl.querySelector(".js-film-slot");
  const titleEl = modalEl && modalEl.querySelector(".modal-title");

  const filmMarkup = (item) => {
    const f = item.film || {};
    if (f.type === "youtube" && f.id) {
      return `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(f.id)}?autoplay=1&rel=0"
               title="${item.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    }
    if (f.type === "vimeo" && f.id) {
      return `<iframe src="https://player.vimeo.com/video/${encodeURIComponent(f.id)}?autoplay=1&dnt=1"
               title="${item.title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
    const src = (f.type === "mp4" && f.src) ? f.src : item.teaser;
    return `<video src="${src}" poster="${item.poster}" controls autoplay playsinline></video>`;
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-film-index]");
    if (!trigger || !modalEl || !window.bootstrap) return;
    const item = items[Number(trigger.dataset.filmIndex)];
    if (!item) return;
    titleEl.textContent = item.title;
    slot.innerHTML = filmMarkup(item);
    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("figure[data-film-index]")) {
      e.preventDefault();
      e.target.click();
    }
  });
  if (modalEl) modalEl.addEventListener("hidden.bs.modal", () => { slot.innerHTML = ""; });

  /* ---------- Pakiet z przycisku trafia do formularza ---------- */
  const packageSelect = document.getElementById("f-package");
  document.querySelectorAll("[data-package]").forEach((btn) => {
    btn.addEventListener("click", () => { if (packageSelect) packageSelect.value = btn.dataset.package; });
  });

  /* ---------- Formularz ---------- */
  const form = document.querySelector(".contact__form");
  if (form) {
    form.addEventListener("submit", (e) => {
      const status = form.querySelector(".contact__status");
      if (!form.checkValidity()) {
        e.preventDefault();
        form.classList.add("was-validated");
        return;
      }
      // Szkic: brak backendu. Podmień action="#" na skrypt PHP / Formspree.
      if (form.getAttribute("action") === "#") {
        e.preventDefault();
        status.textContent = "Dziękujemy, odezwiemy się w ciągu 24 godzin.";
        form.reset();
        form.classList.remove("was-validated");
      }
    });
  }

  /* ---------- Animacje: GSAP + Lenis (tylko gdy się załadowały) ---------- */
  const startMotion = () => {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Płynny scroll
    let lenis = null;
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
          const id = a.getAttribute("href");
          if (id.length < 2) return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70, force: true });
        });
      });
      // zatrzymaj płynny scroll, gdy otwarte okno lub menu
      ["show.bs.modal", "show.bs.offcanvas"].forEach((ev) => document.addEventListener(ev, () => lenis.stop()));
      ["hidden.bs.modal", "hidden.bs.offcanvas"].forEach((ev) => document.addEventListener(ev, () => lenis.start()));
    }

    // Jedyne wejście przy ładowaniu: nagłówek hero
    gsap.from(".hero__line > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.15 });
    gsap.from(".hero__lead, .hero__actions", { opacity: 0, y: 16, duration: 0.9, ease: "power2.out", delay: 0.6, stagger: 0.08 });

    // HERO (bright-avenue): wideo zwęża się do okna, kadry zjeżdżają się z boków.
    // Parametry odczytane z ich strony: okno ~21% szer. x ~41% wys. ekranu,
    // wideo w środku skaluje się 1 -> 0.6, wszystko na jednej krzywej "ease-out".
    const hero = document.querySelector(".hero");
    const clip = document.querySelector(".js-hero-clip");
    const zoom = document.querySelector(".js-hero-zoom");
    const shade = document.querySelector(".js-hero-shade");
    const title = document.querySelector(".js-hero-title");
    const gallery = document.querySelector(".hero__gallery");
    const frames = gsap.utils.toArray(".hero__gframe");

    if (hero && clip && zoom) {
      const mm = gsap.matchMedia();
      mm.add({ desk: "(min-width: 768px)", mob: "(max-width: 767.98px)" }, (ctx) => {
        const { desk } = ctx.conditions;

        // TELEFON (waverunmedia): po lekkim scrollu hero zmienia się w kartę
        // scale 1 -> 0.949, rogi 0 -> 12px; przełącznik, nie scrub. Menu chowa się przy scrollu w dół.
        if (!desk) {
          const sticky = hero.querySelector(".hero__sticky");
          const toCard = (on) => gsap.to(sticky, {
            scale: on ? 0.949 : 1,
            borderRadius: on ? 12 : 0,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true
          });
          const cardST = ScrollTrigger.create({
            trigger: hero,
            start: "top+=30 top",
            onEnter: () => toCard(true),
            onLeaveBack: () => toCard(false)
          });
          const navST = ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
              if (!nav) return;
              nav.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 120);
            }
          });
          return () => {
            cardST.kill(); navST.kill();
            gsap.set(sticky, { clearProps: "transform,borderRadius" });
            if (nav) nav.classList.remove("is-hidden");
          };
        }

        hero.classList.add("is-scroll");
        hero.style.height = desk ? "260vh" : "190vh";

        const vw = () => window.innerWidth;
        const vh = () => window.innerHeight;
        // okno docelowe: pion 3:4 na desktopie, 4:5 na telefonie; na telefonie wyżej, żeby tekst był pod oknem
        const winH = () => (desk ? vh() * 0.42 : vh() * 0.34);
        const winW = () => (desk ? winH() * 0.75 : Math.min(vw() * 0.8, winH() * 0.8));
        const cy = () => vh() * (desk ? 0.37 : 0.27);
        const inset = () => {
          const top = cy() - winH() / 2;
          const bottom = vh() - (cy() + winH() / 2);
          const side = (vw() - winW()) / 2;
          return `inset(${top}px ${side}px ${bottom}px ${side}px round 6px)`;
        };

        // rozmiar kadrów galerii = trochę mniejsze niż okno wideo
        const setFrameVars = () => {
          if (!gallery) return;
          gallery.style.setProperty("--fw", `${winW() * 0.82}px`);
          gallery.style.setProperty("--fh", `${winH() * 0.82}px`);
          gallery.style.setProperty("--cy", `${cy()}px`);
        };
        setFrameVars();

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 1 },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: setFrameVars
          }
        });

        tl.fromTo(clip, { clipPath: "inset(0px 0px 0px 0px round 0px)" }, { clipPath: inset }, 0)
          .fromTo(zoom, { scale: 1 }, { scale: 0.6 }, 0)
          .fromTo(shade, { opacity: 1 }, { opacity: 0.25 }, 0)
          .fromTo(title, { scale: 1 }, { scale: desk ? 0.55 : 0.7 }, 0);

        if (desk) {
          const gap = () => vw() * 0.018;
          // slot: -2 -1 | wideo | 1 2 ; start: dalej od środka i niżej, każdy w innym tempie
          const startX = { "-2": -0.9, "-1": -0.55, "1": 0.6, "2": 1.0 };
          const startY = { "-2": 0.3, "-1": 0.1, "1": 0.4, "2": 0.8 };
          frames.forEach((f) => {
            const slot = Number(f.dataset.slot);
            const finalX = () => {
              const fw = winW() * 0.82;
              const inner = winW() / 2 + gap() + fw / 2;
              return Math.sign(slot) * (Math.abs(slot) === 1 ? inner : inner + fw + gap());
            };
            tl.fromTo(f,
              { x: () => finalX() + startX[slot] * vw(), y: () => startY[slot] * vh() },
              { x: finalX, y: 0 }, 0);
          });
        }

        return () => { hero.classList.remove("is-scroll"); hero.style.height = ""; };
      });
    }

    // Realizacje: kadr otwiera się i uspokaja przy przewijaniu (waverunmedia)
    gsap.utils.toArray(".story").forEach((story) => {
      const media = story.querySelector(".story__media");
      const inner = story.querySelector(".story__media-inner");
      gsap.fromTo(media,
        { clipPath: "inset(14% 10% 14% 10% round 6px)" },
        { clipPath: "inset(0% 0% 0% 0% round 6px)", ease: "none",
          scrollTrigger: { trigger: story, start: "top 90%", end: "top 35%", scrub: true } });
      gsap.fromTo(inner,
        { scale: 1.25 },
        { scale: 1, ease: "none",
          scrollTrigger: { trigger: story, start: "top bottom", end: "bottom top", scrub: true } });
    });
  };

  // skrypty CDN są defer i ładują się przed tym plikiem; gdy CDN nie odpowie, strona działa bez animacji
  startMotion();
})();
