const getGalleryItems = () => Array.from(document.querySelectorAll("[data-lightbox]"));

export const initGallery = () => {
  const lightbox = document.querySelector("[data-lightbox-modal]");
  const image = lightbox?.querySelector("[data-lightbox-image]");
  const caption = lightbox?.querySelector("[data-lightbox-caption]");
  const closeButton = lightbox?.querySelector("[data-lightbox-close]");
  const items = getGalleryItems();
  let activeIndex = -1;

  if (!lightbox || !image || !caption || !closeButton || !items.length) return;

  const open = (index) => {
    const trigger = items[index];
    const img = trigger.querySelector("img");
    if (!trigger || !img) return;

    activeIndex = index;
    image.src = img.currentSrc || img.src;
    image.alt = img.alt;
    caption.textContent = trigger.dataset.caption || img.alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeButton.focus({ preventScroll: true });
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (activeIndex > -1) items[activeIndex].focus({ preventScroll: true });
    activeIndex = -1;
  };

  const step = (direction) => {
    if (activeIndex < 0) return;
    const nextIndex = (activeIndex + direction + items.length) % items.length;
    open(nextIndex);
  };

  items.forEach((item, index) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("click", () => open(index));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(index);
      }
    });
  });

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  });
};
