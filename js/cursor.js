const canUsePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const initCursor = () => {
  const cursor = document.querySelector("[data-cursor]");
  if (!cursor || !canUsePointer || prefersReducedMotion) return;

  document.documentElement.classList.add("custom-cursor-enabled");

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;

  const animate = () => {
    cursorX += (targetX - cursorX) * 0.2;
    cursorY += (targetY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    document.documentElement.style.setProperty("--cursor-x", `${targetX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${targetY}px`);
    window.requestAnimationFrame(animate);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("is-visible");
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));

  document.querySelectorAll("a, button, [data-lightbox]").forEach((item) => {
    item.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
    item.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });

  animate();
};
