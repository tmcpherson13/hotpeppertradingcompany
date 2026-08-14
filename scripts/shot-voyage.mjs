import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const url = process.argv[2] || 'http://localhost:5173/';
const outBase = process.argv[3] || '/tmp/voyage';
const dotTitle = process.argv[4] || '1498: Goa, India'; // timeline dot to trigger

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERR:', m.text()); });

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.querySelector('#routes')?.scrollIntoView({ block: 'center' }));
await page.waitForSelector('.maplibregl-canvas', { timeout: 30000 });
await page.waitForTimeout(4500); // base map + sources settle

const frame = () => page.$('#routes');

// Trigger a single voyage by clicking its timeline dot.
const dot = page.locator(`[title="${dotTitle}"]`).first();
await dot.click({ timeout: 10000 }).catch((e) => console.log('dot click failed:', e.message));

// Capture the draw -> follow -> pull-back sequence.
const stamps = [700, 1600, 2600, 3800, 5600];
let prev = 0;
for (let i = 0; i < stamps.length; i++) {
  await page.waitForTimeout(stamps[i] - prev);
  prev = stamps[i];
  const f = await frame();
  await (f || page).screenshot({ path: `${outBase}-${i + 1}.png` });
  console.log('captured', `${outBase}-${i + 1}.png`, `@${stamps[i]}ms`);
}
await browser.close();
