import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewports = [
  { name: '1280x960', width: 1280, height: 960 },
  { name: '390x844', width: 390, height: 844 },
  { name: '844x390', width: 844, height: 390 },
  { name: '820x1180', width: 820, height: 1180 },
  { name: '1024x768', width: 1024, height: 768 }
];

async function capture() {
  const browser = await chromium.launch();
  const filePath = path.resolve(__dirname, '../hero-reference/index.html');
  const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;

  console.log(`Loading reference file: ${fileUrl}`);

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height }
    });

    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

    // Wait for entrance animation to finish (failsafe is 3500ms, total anim duration is ~2000ms after start)
    try {
      await page.waitForFunction(() => {
        const hidden = document.querySelectorAll('.pg-entrance-hidden');
        const anims = document.getAnimations();
        return hidden.length === 0 && anims.every(a => a.playState === 'finished');
      }, { timeout: 10000 });
    } catch {
      // If failsafe fired or any anim pending, wait 2 more seconds
      await page.waitForTimeout(2000);
    }
    // Give a buffer frame for browser render
    await page.waitForTimeout(500);

    // Check horizontal scroll & gutter/overflow
    const metrics = await page.evaluate(() => {
      const title = document.querySelector('.pg-title');
      const titleRect = title ? title.getBoundingClientRect() : null;
      const nav = document.querySelector('.pg-nav-pill');
      const navDisplay = nav ? window.getComputedStyle(nav).display : null;
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        titleRight: titleRect ? titleRect.right : null,
        navDisplay
      };
    });

    console.log(`Viewport ${vp.name}: clientWidth=${metrics.clientWidth}, scrollWidth=${metrics.scrollWidth}, navDisplay=${metrics.navDisplay}`);

    const outPath = path.resolve(__dirname, `../verification/reference/${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved screenshot: ${outPath}`);

    await page.close();
  }

  await browser.close();
  console.log('Finished capturing all Gate A screenshots');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
