import { initAnimations } from "./animations.js";
import { initCursor } from "./cursor.js";
import { initGallery } from "./gallery.js";
import { initNavigation } from "./navigation.js";

const initLoader = () => {
  const loader = document.querySelector("[data-loader]");
  if (!loader) return;

  const hide = () => loader.classList.add("is-hidden");
  window.addEventListener("load", () => window.setTimeout(hide, 150), { once: true });
  window.setTimeout(hide, 1400);
};

initLoader();
initNavigation();
initCursor();
initAnimations();
initGallery();
