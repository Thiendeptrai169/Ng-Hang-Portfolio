import { chromium } from "playwright-core";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.CAPTURE_URL || "http://127.0.0.1:5173/";

const shots = [
  { name: "desktop-home.png", width: 1440, height: 1200, hash: "" },
  { name: "desktop-work.png", width: 1440, height: 1200, hash: "#work" },
  { name: "tablet-about.png", width: 768, height: 1100, hash: "#about" },
  { name: "mobile-430.png", width: 430, height: 1100, hash: "" },
  { name: "mobile-390.png", width: 390, height: 1100, hash: "" },
  { name: "mobile-360.png", width: 360, height: 1100, hash: "" }
];

const browser = await chromium.launch({
  executablePath: edgePath,
  headless: true
});

try {
  for (const shot of shots) {
    const page = await browser.newPage({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: 1
    });

    await page.goto(`${baseUrl}${shot.hash}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `screenshots/${shot.name}`, fullPage: false });
    await page.close();
    console.log(`${shot.name} ${shot.width}x${shot.height}`);
  }
} finally {
  await browser.close();
}
