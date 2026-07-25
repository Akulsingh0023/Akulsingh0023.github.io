(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const storageKey = "akul-portfolio-theme";

  const root = document.documentElement;
  const yearEl = $("#year");
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const themeToggle = $("#themeToggle");
  const photo = $("[data-hero-photo]");
  const photoFallback = $("[data-hero-fallback]");
  const typewriterEl = $("[data-typewriter]");
  const revealEls = $$(".reveal");
  const skillCards = $$(".skill-card");
  const navLinks = $$(".nav__link");
  const contactForm = $("#contactForm");

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Ignore storage failures.
    }
  };

  const applyTheme = (theme) => {
    const resolved = theme === "dark" ? "dark" : "light";
    root.dataset.theme = resolved;
    if (themeToggle) {
      const nextLabel = resolved === "dark" ? "Switch to light theme" : "Switch to dark theme";
      themeToggle.setAttribute("aria-label", nextLabel);
      themeToggle.setAttribute("aria-pressed", String(resolved === "dark"));
      themeToggle.innerHTML = resolved === "dark"
        ? '<svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.76 4.84 4.96 3.05 3.55 4.46l1.79 1.8 1.42-1.42Zm-1.38 9.66H2v2h3.38v-2Zm10.62-8.7A7.96 7.96 0 0 0 12 3v2a6 6 0 1 1-6 6H4a8 8 0 1 0 12-6.2ZM20 11v2h3v-2h-3Zm-1.24-6.16-1.41 1.41 1.79 1.8 1.42-1.42-1.8-1.79ZM11 1h2v3h-2V1Zm0 19h2v3h-2v-3Zm7.24-2.24 1.8 1.8 1.41-1.42-1.79-1.79-1.42 1.41Z"/></svg>'
        : '<svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
    }
  };

  const initialTheme = getStoredTheme() || "light";
  applyTheme(initialTheme);

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const setMenuOpen = (isOpen) => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      setMenuOpen(!navMenu.classList.contains("is-open"));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
    });
  }

  if (typewriterEl) {
    const phrases = [
      "Full-Stack Developer",
      "MERN Stack Developer",
      "Software Engineer",
      "Backend Developer",
      "Open to Work",
    ];
    const typeSpeed = 90;
    const deleteSpeed = 50;
    const pauseAfterTyping = 1500;
    const pauseAfterDelete = 220;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const phrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex += 1;
        typewriterEl.textContent = phrase.slice(0, charIndex);

        if (charIndex === phrase.length) {
          isDeleting = true;
          window.setTimeout(tick, pauseAfterTyping);
          return;
        }

        window.setTimeout(tick, typeSpeed);
        return;
      }

      charIndex -= 1;
      typewriterEl.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, pauseAfterDelete);
        return;
      }

      window.setTimeout(tick, deleteSpeed);
    };

    typewriterEl.textContent = "";
    window.setTimeout(tick, 0);
  }

  if (photo) {
    const showFallback = () => {
      photo.hidden = true;
      if (photoFallback) {
        photoFallback.hidden = false;
      }
    };

    if (photo.complete && photo.naturalWidth === 0) {
      showFallback();
    } else {
      photo.addEventListener("error", showFallback, { once: true });
    }
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      skillCards.forEach((card) => card.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach((el) => observer.observe(el));
    }
  }

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        $$('[data-progress]', entry.target).forEach((bar) => {
          const percent = bar.getAttribute("data-progress") || "0%";
          bar.style.width = percent;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach((card) => {
    if (prefersReducedMotion) {
      card.classList.add("is-visible");
      $$('[data-progress]', card).forEach((bar) => {
        const percent = bar.getAttribute("data-progress") || "0%";
        bar.style.width = percent;
      });
    } else if ("IntersectionObserver" in window) {
      skillObserver.observe(card);
    } else {
      card.classList.add("is-visible");
      $$('[data-progress]', card).forEach((bar) => {
        const percent = bar.getAttribute("data-progress") || "0%";
        bar.style.width = percent;
      });
    }
  });

  const sections = ["home", "about", "skills", "projects", "education", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const linkMap = new Map(navLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));

    const setActiveLink = (id) => {
      navLinks.forEach((link) => link.classList.remove("is-active"));
      const active = linkMap.get(id);
      if (active) {
        active.classList.add("is-active");
      }
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.08 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      contactForm.querySelector("button[type='submit']")?.setAttribute("disabled", "true");
    });
  }
})();
