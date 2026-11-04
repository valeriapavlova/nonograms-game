/* Renders README screenshots, the Open Graph image and PNG favicons.
   Needs Playwright (npx playwright / a global install) and a local server:
     npm start            # http://localhost:8000
     node scripts/screenshots.cjs                                         */
const { chromium } = require("playwright");
const path = require("path");

const BASE = process.env.BASE || "http://localhost:8000/";
const out = (f) => path.join(__dirname, "..", "assets", f);

async function shot(browser, { width, height, scale = 1, collection, mode, level = "easy", solve, file }) {
  const mobile = width < 600;   /* phone shots emulate touch, so the touch hint shows */
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile });
  await page.goto(BASE);
  await page.evaluate((m) => { localStorage.clear(); localStorage.setItem("punt:mode", JSON.stringify(m)); localStorage.setItem("punt:lang", "en"); }, mode);
  await page.reload();
  await page.click(`button[data-collection=${collection}]`);
  await page.click(`[data-level=${level}]`);
  if (solve) { await page.click("#solveBtn"); await page.waitForTimeout(1500); }
  else {
    /* a few moves so the board is not empty */
    for (const [r, c] of [[0, 4], [1, 4], [4, 4], [4, 5]]) await page.click(`.cell[data-r="${r}"][data-c="${c}"]`);
    await page.click('.cell[data-r="0"][data-c="0"]', { button: "right" });
    if (!mobile) await page.mouse.move(0, 0);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out(file), fullPage: true });
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  await shot(browser, { width: 1280, height: 860, collection: "ua", mode: "native", level: "medium", file: "screenshots/desktop-ukraine.png" });
  await shot(browser, { width: 1280, height: 860, collection: "va", mode: "native", level: "medium", solve: true, file: "screenshots/desktop-valencia-solved.png" });
  await shot(browser, { width: 390, height: 844, scale: 2, collection: "ua", mode: "alt", level: "medium", file: "screenshots/mobile-ukraine-alt.png" });
  await shot(browser, { width: 390, height: 844, scale: 2, collection: "va", mode: "alt", solve: true, file: "screenshots/mobile-valencia-alt-solved.png" });

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto(BASE + "design/og-image.html");
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: out("og-image.png") });

  for (const [size, file] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"]]) {
    const p = await browser.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<style>body{margin:0}</style><img src="${BASE}favicon.svg" width="${size}" height="${size}">`);
    await p.waitForTimeout(200);
    await p.screenshot({ path: out(file), omitBackground: true });
    await p.close();
  }
  await browser.close();
  console.log("assets updated");
})();
