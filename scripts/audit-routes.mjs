#!/usr/bin/env node
// Trade-route land-crossing + port-placement audit.
//
// Parses the routes and ports out of TradeRouteMap.tsx, densifies each route
// with the SAME Chaikin smoothing the map uses, then tests sampled points
// against the Natural Earth 50m land polygons (public/data/ne_50m_land.geojson).
//
// Reports:
//   1. maritime routes that slice through land (water -> land -> water)
//   2. ports (origins/destinations) whose marker falls in the ocean
//
// Usage: node scripts/audit-routes.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ---- Chaikin corner-cutting smooth (mirror of src/components/map/routeGeometry.ts) ----
function smoothPath(points, iterations = 3) {
  if (points.length < 3) return points;
  let pts = points;
  for (let it = 0; it < iterations; it++) {
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i];
      const q = pts[i + 1];
      out.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]]);
      out.push([0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}

// ---- Parse routes and ports out of the component ----
function parseComponent() {
  const src = readFileSync(join(root, 'src/components/map/TradeRouteMap.tsx'), 'utf8');
  const lines = src.split('\n');
  const routes = [];
  const ports = [];
  let lastName = null;
  for (const line of lines) {
    const nm = line.match(/name:\s*'([^']*)'/);
    if (nm) lastName = nm[1];

    // Port: a coordinates: [lon, lat] line (origins/destinations)
    const coord = line.match(/coordinates:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/);
    if (coord && lastName) {
      ports.push({ name: lastName, lon: parseFloat(coord[1]), lat: parseFloat(coord[2]) });
    }

    // Route line
    if (line.includes('from:') && line.includes('establishedYear')) {
      const from = line.match(/from:\s*\[\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\]/);
      const to = line.match(/to:\s*\[\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\]/);
      const viaBlock = line.match(/via:\s*(\[\[.*?\]\]|\[\])\s*as/);
      const name = line.match(/destinationName:\s*'([^']*)'/);
      const overland = /isOverland:\s*true/.test(line);
      if (from && to) {
        const via = [];
        if (viaBlock && viaBlock[1] !== '[]') {
          const pairRe = /\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g;
          let m;
          while ((m = pairRe.exec(viaBlock[1])) !== null) via.push([parseFloat(m[1]), parseFloat(m[2])]);
        }
        routes.push({
          name: name ? name[1] : '(unknown)',
          isOverland: overland,
          coords: [[parseFloat(from[1]), parseFloat(from[2])], ...via, [parseFloat(to[1]), parseFloat(to[2])]],
        });
      }
    }
  }
  return { routes, ports };
}

// ---- Land polygons with per-ring bbox for fast rejection ----
function loadLandRings() {
  const geo = JSON.parse(readFileSync(join(root, 'public/data/ne_50m_land.geojson'), 'utf8'));
  const rings = [];
  for (const f of geo.features) {
    const g = f.geometry;
    if (!g) continue;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const poly of polys) {
      const ring = poly[0];
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const [x, y] of ring) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      rings.push({ ring, minX, minY, maxX, maxY });
    }
  }
  return rings;
}

const normLon = (lon) => (((lon + 180) % 360) + 360) % 360 - 180;

function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

function onLand(lon, lat, rings) {
  const x = normLon(lon);
  for (const r of rings) {
    if (x < r.minX || x > r.maxX || lat < r.minY || lat > r.maxY) continue;
    if (pointInRing(x, lat, r.ring)) return true;
  }
  return false;
}

// Uniformly densify a polyline (~stepDeg spacing) so narrow crossings between
// sparse waypoints (isthmuses, small peninsulas) are actually sampled — this
// matches what MapLibre renders (straight segments between the path points).
function densify(path, stepDeg = 0.25) {
  const out = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [x1, y1] = path[i], [x2, y2] = path[i + 1];
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.ceil(dist / stepDeg));
    for (let s = 0; s < n; s++) out.push([x1 + ((x2 - x1) * s) / n, y1 + ((y2 - y1) * s) / n]);
  }
  out.push(path[path.length - 1]);
  return out;
}

// A real "sea route over land" is a run of on-land samples bounded by water on
// both sides. Runs touching an endpoint are just an inland port and are fine.
function interiorLandCrossings(path, rings) {
  const land = path.map(([lon, lat]) => onLand(lon, lat, rings));
  const crossings = [];
  let i = 0;
  while (i < land.length) {
    if (land[i]) {
      let j = i;
      while (j < land.length && land[j]) j++;
      if (i > 0 && !land[i - 1] && j < land.length && !land[j]) {
        crossings.push({ len: j - i, at: path[Math.floor((i + j) / 2)] });
      }
      i = j;
    } else i++;
  }
  return crossings;
}

// ---- Run ----
const rings = loadLandRings();
const { routes, ports } = parseComponent();
console.log(`Parsed ${routes.length} routes, ${ports.length} ports; ${rings.length} land rings (50m)\n`);

console.log('== Maritime routes slicing through land ==');
let offenders = 0;
for (const r of routes) {
  if (r.isOverland) continue;
  const crossings = interiorLandCrossings(densify(smoothPath(r.coords)), rings);
  if (crossings.length > 0) {
    offenders++;
    const spots = crossings.map((c) => `[${c.at[0].toFixed(1)}, ${c.at[1].toFixed(1)}]x${c.len}`).join('  ');
    console.log(`  x ${r.name}: ${spots}`);
  }
}
console.log(`  ${offenders} of ${routes.length} maritime routes cross land\n`);

console.log('== Ports rendering in the ocean (marker not on land) ==');
let water = 0;
for (const p of ports) {
  if (!onLand(p.lon, p.lat, rings)) {
    water++;
    console.log(`  o ${p.name}: [${p.lon}, ${p.lat}]`);
  }
}
console.log(`  ${water} of ${ports.length} ports are off-shore`);
