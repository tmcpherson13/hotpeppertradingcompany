/**
 * Build-time prerendering (SSG).
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server). Renders a
 * fixed list of content routes to static HTML so search engines and social
 * crawlers receive real, per-page markup and meta tags instead of an empty
 * SPA shell. App-like routes (origins, trading-post, product, admin, wishlist)
 * are intentionally NOT prerendered — they stay client-rendered.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const serverEntry = path.join(distDir, 'server', 'entry-server.js');

const SITE_URL = 'https://hotpeppertradingcompany.com';

// A minimal localStorage shim so components/stores that touch it during render
// (zustand persist, image-preference lookups) don't crash under Node.
globalThis.localStorage ??= {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

const { render, pepperSlugs, fetchPublishedPeppers, setInjectedDbPeppers } = await import(serverEntry);

// Pull published database peppers (the growth beyond the static 190) and inject
// them so their detail pages render during prerender. Fails soft: if the DB is
// unconfigured/unreachable at build time, we simply prerender the static 190.
let dbPeppers = [];
try {
  dbPeppers = await fetchPublishedPeppers();
  setInjectedDbPeppers(dbPeppers);
  console.log(`  ✓ loaded ${dbPeppers.length} published DB peppers`);
} catch (err) {
  console.warn(`  ! DB peppers unavailable at build (${err.message}); using static 190 only`);
}

// Static content routes worth prerendering.
const staticRoutes = [
  '/',
  '/compendium',
  '/about',
  '/history/pre-columbian-origins',
  '/history/columbian-exchange',
  '/history/global-integration',
  '/guides/seed-starting',
];

// Union of static slugs and DB slugs, deduped (static wins).
const staticSlugSet = new Set(pepperSlugs);
const dbSlugs = dbPeppers.map((p) => p.id).filter((id) => !staticSlugSet.has(id));
const pepperRoutes = [...pepperSlugs, ...dbSlugs].map((slug) => `/peppers/${slug}`);
const prerenderRoutes = [...staticRoutes, ...pepperRoutes];

// Client-rendered but still indexable routes — included in the sitemap only.
const sitemapOnlyRoutes = ['/origins', '/trading-post'];

// Read the built client template and strip the static SEO tags that
// react-helmet now owns per page, to avoid duplicate <title>/<meta> in output.
let template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
template = template
  .replace(/<title>[\s\S]*?<\/title>/i, '')
  .replace(/<meta\s+name="description"[^>]*>/gi, '')
  .replace(/<meta\s+name="keywords"[^>]*>/gi, '')
  .replace(/<meta\s+name="author"[^>]*>/gi, '')
  .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
  .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
  .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');

let count = 0;
for (const url of prerenderRoutes) {
  let rendered;
  try {
    rendered = render(url);
  } catch (err) {
    console.warn(`  ! skipped ${url}: ${err.message}`);
    continue;
  }
  const { html, head } = rendered;

  const page = template
    .replace('</head>', `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outDir = url === '/' ? distDir : path.join(distDir, url);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  count++;
}

console.log(`  ✓ prerendered ${count} pages`);

// ---- sitemap.xml + robots sitemap line ----
const sitemapUrls = [...staticRoutes, ...sitemapOnlyRoutes, ...pepperRoutes];
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls
    .map((u) => {
      const loc = `${SITE_URL}${u === '/' ? '' : u}`;
      const priority = u === '/' ? '1.0' : u.startsWith('/peppers/') ? '0.7' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n') +
  `\n</urlset>\n`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log(`  ✓ wrote sitemap.xml (${sitemapUrls.length} urls)`);

// Clean up the server bundle — not needed in the deployed output.
fs.rmSync(path.join(distDir, 'server'), { recursive: true, force: true });
