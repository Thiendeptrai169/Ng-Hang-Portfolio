const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initAnimations = () => {
  const progress = document.querySelector("[data-scroll-progress]");
  const revealItems = document.querySelectorAll(".reveal, .masked-reveal");
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  const tiltCards = document.querySelectorAll("[data-tilt]");
  const magneticItems = document.querySelectorAll(".magnetic");

  if (revealItems.length) {
    if (prefersReducedMotion.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
      );

      revealItems.forEach((item) => observer.observe(item));
    }
  }

  let ticking = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;

    if (!prefersReducedMotion.matches && window.innerWidth >= 768) {
      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax || 0);
        const rect = item.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const offset = clamp(center * speed * -0.08, -70, 70);
        item.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }

    ticking = false;
  };

  const requestScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", requestScroll);
  updateScroll();

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (prefersReducedMotion.matches || window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      if (prefersReducedMotion.matches || window.innerWidth < 768) return;
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate3d(${x * 0.08}px, ${y * 0.12 - 3}px, 0)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
};
