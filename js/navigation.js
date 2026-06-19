export const initNavigation = () => {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-mobile-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const links = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setScrolled = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", setScrolled, { passive: true });
  setScrolled();

  toggle?.addEventListener("click", () => {
    const isOpen = menu?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      menu?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => observer.observe(section));
  }
};
