import { chromium } from "playwright-core";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.CAPTURE_URL || "http://127.0.0.1:5173/";
const viewports = [
  [1440, 1200],
  [1280, 1000],
  [1024, 1000],
  [768, 1100],
  [430, 1100],
  [390, 1100],
  [360, 1100]
];

const browser = await chromium.launch({
  executablePath: edgePath,
  headless: true
});

const failures = [];

try {
  for (const [width, height] of viewports) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1
    });

    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const overflow = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));

    if (overflow.scrollWidth > overflow.innerWidth + 1) {
      failures.push(`Horizontal overflow at ${width}px: ${overflow.scrollWidth} > ${overflow.innerWidth}`);
    }

    if (consoleErrors.length) {
      failures.push(`Console errors at ${width}px: ${consoleErrors.join(" | ")}`);
    }

    if (width === 390) {
      await page.getByRole("button", { name: /open navigation/i }).click();
      const expanded = await page.getByRole("button", { name: /open navigation/i }).getAttribute("aria-expanded");
      if (expanded !== "true") failures.push("Mobile menu did not open");
      await page.locator('[data-mobile-menu] a[href="#work"]').click();
      const collapsed = await page.getByRole("button", { name: /open navigation/i }).getAttribute("aria-expanded");
      if (collapsed !== "false") failures.push("Mobile menu did not close after navigation");
    }

    if (width === 1440) {
      await page.locator("[data-lightbox]").first().click();
      const open = await page.locator("[data-lightbox-modal]").evaluate((node) => node.classList.contains("is-open"));
      if (!open) failures.push("Lightbox did not open");
      await page.keyboard.press("Escape");
      const closed = await page.locator("[data-lightbox-modal]").evaluate((node) => !node.classList.contains("is-open"));
      if (!closed) failures.push("Lightbox did not close with Escape");
    }

    await page.close();
  }

  const reducedMotionPage = await browser.newPage({
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 1
  });
  await reducedMotionPage.emulateMedia({ reducedMotion: "reduce" });
  await reducedMotionPage.goto(baseUrl, { waitUntil: "networkidle" });
  const hiddenRevealCount = await reducedMotionPage.locator(".reveal:not(.is-visible)").count();
  if (hiddenRevealCount > 0) {
    failures.push(`Reduced motion left ${hiddenRevealCount} reveal elements hidden`);
  }
  await reducedMotionPage.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Smoke checks passed");
