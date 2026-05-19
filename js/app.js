(function () {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function formatNumber(n) {
    return new Intl.NumberFormat("en-BE").format(Math.round(n));
  }

  function animateCount(el, target, duration) {
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNumber(from + (target - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count, 10);
        if (!Number.isFinite(target)) return;
        animateCount(el, target, 1400);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => {
    counterObserver.observe(el);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document
    .querySelectorAll("[data-animate], .mini-metric, .commerce-tile, .timeline")
    .forEach((el) => revealObserver.observe(el));

  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const items = timeline.querySelectorAll(".timeline__item");
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        timeline.classList.add("is-visible");
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add("is-visible"), i * 120);
        });
        timelineObserver.unobserve(timeline);
      },
      { threshold: 0.2 }
    );
    timelineObserver.observe(timeline);
  }

  const header = document.querySelector(".header");
  let lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (header) {
        header.style.boxShadow =
          y > 20 ? "0 4px 24px rgba(0,0,0,0.35)" : "none";
      }
      lastY = y;
    },
    { passive: true }
  );
})();
