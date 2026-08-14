import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const url = process.argv[2] || 'http://localhost:5173/';
const out = process.argv[3] || '/tmp/map-shot.png';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERR:', m.text()); });

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
// Bring the map section into view
await page.evaluate(() => document.querySelector('#routes')?.scrollIntoView({ block: 'center' }));
// Wait for the MapLibre canvas and for GeoJSON sources + routes to settle
await page.waitForSelector('.maplibregl-canvas', { timeout: 30000 });
await page.waitForTimeout(6000);

// Optionally click a region-focus button (Americas/Pacific/Levant/India/Asia/World)
const region = process.argv[4];
if (region) {
  await page.getByRole('button', { name: new RegExp(region, 'i') }).first().click().catch(() => {});
  await page.waitForTimeout(3500);
}

const frame = await page.$('#routes');
if (frame) {
  await frame.screenshot({ path: out });
} else {
  await page.screenshot({ path: out, fullPage: false });
}
console.log('shot saved:', out);
await browser.close();
