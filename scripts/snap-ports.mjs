#!/usr/bin/env node
// One-shot: snap off-shore port coordinates onto land in TradeRouteMap.tsx.
// Replaces every [lon, lat] literal that matches a known port (within a small
// tolerance) with its snapped coordinate — updating both the marker position
// and any route from/to that references the same port. Value-tolerant so it
// isn't tripped up by trailing-zero formatting differences.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'src/components/map/TradeRouteMap.tsx');

// [oldLon, oldLat, newLon, newLat]
const SNAPS = [
  [-9.1393, 38.7223, -9.139, 38.742],
  [73.8567, 15.2993, 73.897, 15.299],
  [76.2673, 9.9312, 76.25, 9.921],
  [-66.1057, 18.4655, -66.086, 18.465],
  [121.774, 12.8797, 121.474, 12.88],
  [40.7347, -15.0344, 40.683, -15.004],
  [56.4547, 27.0769, 56.515, 27.181],
  [102.2501, 2.1896, 102.27, 2.19],
  [127.3866, 0.7893, 127.369, 0.799],
  [113.5439, 22.1987, 113.544, 22.239],
  [-38.5108, -12.9714, -38.472, -12.961],
  [-43.1729, -22.9068, -43.208, -22.887],
  [-1.3509, 5.084, -1.334, 5.094],
  [34.7459, -20.1503, 34.741, -20.131],
];

const near = (a, b) => Math.abs(a - b) < 0.0006;

let src = readFileSync(file, 'utf8');
const counts = new Map();

src = src.replace(/\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/g, (m, lonS, latS) => {
  const lon = parseFloat(lonS), lat = parseFloat(latS);
  for (const [ol, oa, nl, na] of SNAPS) {
    if (near(lon, ol) && near(lat, oa)) {
      counts.set(`${ol},${oa}`, (counts.get(`${ol},${oa}`) || 0) + 1);
      return `[${nl}, ${na}]`;
    }
  }
  return m;
});

writeFileSync(file, src);
for (const [k, v] of counts) console.log(`  ${k} -> replaced ${v} occurrence(s)`);
console.log(`Snapped ${counts.size}/${SNAPS.length} ports.`);
