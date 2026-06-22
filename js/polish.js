/* ============================================================
   Ng Hang Portfolio — polish / animation layer
   ============================================================ */

const DESIGN_W = 1440;
const DESIGN_H = 20890;

const stage = document.getElementById("stage");
const viewport = document.getElementById("viewport");
const starfield = document.getElementById("starfield");
const progress = document.getElementById("scrollProgress");
const cursor = document.getElementById("cursor");
const loader = document.getElementById("loader");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(min-width: 900px) and (pointer: fine)").matches;
/* Native scrolling is used for reliability: the transform-based smooth-scroll
   broke painting of sections translated below the hero. Parallax + reveal run
   on the native scroll position instead. */
const smooth = false;

let scale = 1;

/* ---------- 1. Galaxy starfield (SVG) ---------- */
function buildStarfield() {
  starfield.setAttribute("viewBox", `0 0 ${DESIGN_W} ${DESIGN_H}`);
  starfield.setAttribute("preserveAspectRatio", "none");

  const COUNT = 620;
  const parts = [];
  for (let i = 0; i < COUNT; i++) {
    const x = Math.round(Math.random() * DESIGN_W);
    const y = Math.round(Math.random() * DESIGN_H);
    const r = (Math.random() * 1.4 + 0.4).toFixed(2);
    const twinkles = Math.random() < 0.6;
    if (twinkles) {
      const dur = (Math.random() * 3 + 2).toFixed(2);
      const delay = (-Math.random() * 5).toFixed(2);
      const min = (Math.random() * 0.25 + 0.1).toFixed(2);
      const max = (Math.random() * 0.3 + 0.7).toFixed(2);
      parts.push(
        `<circle class="star twinkle" cx="${x}" cy="${y}" r="${r}" style="--dur:${dur}s;--delay:${delay}s;--min:${min};--max:${max}"/>`
      );
    } else {
      parts.push(`<circle class="star" cx="${x}" cy="${y}" r="${r}" opacity="${(Math.random() * 0.4 + 0.3).toFixed(2)}"/>`);
    }
  }
  // a few brighter glow stars
  for (let i = 0; i < 26; i++) {
    const x = Math.round(Math.random() * DESIGN_W);
    const y = Math.round(Math.random() * DESIGN_H);
    const r = (Math.random() * 1.4 + 1.4).toFixed(2);
    const dur = (Math.random() * 2 + 2.5).toFixed(2);
    parts.push(
      `<circle class="star twinkle" cx="${x}" cy="${y}" r="${r}" style="--dur:${dur}s;--delay:${(-Math.random() * 4).toFixed(2)}s;--min:0.3;--max:1;filter:drop-shadow(0 0 4px rgba(180,210,255,.9))"/>`
    );
  }
  starfield.innerHTML = parts.join("");
}

/* ---------- 2. Scaling ---------- */
let scrollSpacer = null;
function fit() {
  scale = Math.min(1, window.innerWidth / DESIGN_W);
  stage.style.transform = `translateX(-50%) scale(${scale})`;
  const scaledH = DESIGN_H * scale;
  if (smooth) {
    if (scrollSpacer) scrollSpacer.style.height = scaledH + "px";
  } else {
    viewport.style.height = scaledH + "px";
  }
}

/* ---------- 3. Scroll reveal (rect based — robust inside scaled stage) ---------- */
let revealItems = [];
function setupReveal() {
  const items = Array.from(stage.querySelectorAll(".n, .t"));
  items.forEach((el) => {
    el.setAttribute("data-reveal", "");
    const animated = /\banim-/.test(el.className);
    if (!animated) {
      el.classList.add(el.classList.contains("t") ? "r-up" : "r-zoom");
    }
  });

  if (reduceMotion) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  revealItems = items;
  revealCheck();
}

function revealCheck() {
  if (!revealItems.length) return;
  const vh = window.innerHeight;
  revealItems = revealItems.filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > -40) {
      el.classList.add("is-in");
      return false;
    }
    return true;
  });
}

/* ---------- 4. Hover interactions ----------
   Hover feedback is reserved for things you can actually interact with
   (buttons). Decorative title plaques and gallery artwork are left alone
   so the page doesn't react under the cursor everywhere. */
function setupHover() {
  stage.querySelectorAll(".js-btn").forEach((e) => e.classList.add("btn-hover"));
}

/* ---------- 5. Custom cursor ---------- */
function setupCursor() {
  if (!finePointer) return;
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx;
  let ty = cy;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.classList.add("is-visible");
  });
  window.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(".btn-hover, .skill-chip, .verdant-btn")) {
      cursor.classList.add("is-active");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(".btn-hover, .skill-chip, .verdant-btn")) {
      cursor.classList.remove("is-active");
    }
  });

  function loop() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
    requestAnimationFrame(loop);
  }
  loop();
}

/* ---------- 6. Shooting stars ---------- */
function shootingStar() {
  if (reduceMotion) return;
  const star = document.createElement("div");
  star.className = "shooting-star";
  // place within currently visible stage region
  const top = current / scale + (Math.random() * 0.5) * (window.innerHeight / scale);
  const left = (0.4 + Math.random() * 0.55) * DESIGN_W;
  star.style.left = left + "px";
  star.style.top = top + "px";
  stage.appendChild(star);
  star.animate(
    [
      { transform: "translate(0,0) rotate(18deg)", opacity: 0 },
      { opacity: 1, offset: 0.15 },
      { transform: "translate(-360px,150px) rotate(18deg)", opacity: 0 }
    ],
    { duration: 900 + Math.random() * 500, easing: "ease-out" }
  ).onfinish = () => star.remove();
  setTimeout(shootingStar, 4500 + Math.random() * 6000);
}

/* ---------- 7. Scroll (smooth + parallax + progress) ---------- */
let current = 0;
let target = 0;

function maxScroll() {
  const h = smooth ? DESIGN_H * scale : viewport.scrollHeight;
  return Math.max(1, h - window.innerHeight);
}

function applyScroll() {
  const p = Math.min(1, target / maxScroll());
  progress.style.transform = `scaleX(${p})`;
  // parallax: starfield lags behind content for depth
  starfield.style.transform = `translateY(${current * 0.05}px)`;
}

function rafScroll() {
  current += (target - current) * 0.09;
  if (Math.abs(target - current) < 0.08) current = target;
  if (smooth) viewport.style.transform = `translateY(${-current}px)`;
  applyScroll();
  revealCheck();
  requestAnimationFrame(rafScroll);
}

function setupScroll() {
  if (smooth) {
    document.documentElement.classList.add("smooth");
    scrollSpacer = document.createElement("div");
    scrollSpacer.id = "scrollSpacer";
    document.body.appendChild(scrollSpacer);
  }
  window.addEventListener("scroll", () => {
    target = window.scrollY || window.pageYOffset;
    if (!smooth) current = target;
  }, { passive: true });
  rafScroll();
}

/* ---------- 8. Loader ---------- */
function hideLoader() {
  if (!loader) return;
  setTimeout(() => loader.classList.add("is-hidden"), reduceMotion ? 0 : 1500);
}

/* ---------- init ---------- */
buildStarfield();
setupScroll();   // creates the scroll spacer (must exist before fit sets its height)
fit();
setupReveal();
setupHover();
setupCursor();
window.addEventListener("resize", () => { fit(); revealCheck(); });
window.addEventListener("load", () => {
  hideLoader();
  shootingStar();
});
// fallback if load already fired
if (document.readyState === "complete") {
  hideLoader();
  shootingStar();
}
