// Geometry helpers for the trade-route chart.

export type LngLat = [number, number];

/**
 * Chaikin corner-cutting smoothing.
 *
 * Each iteration replaces every interior corner with two points at 1/4 and 3/4
 * along its adjacent segments, keeping the original endpoints. The resulting
 * curve stays strictly inside the original polyline's convex hull, so it rounds
 * the hand-placed dogleg waypoints into elegant rhumb-line curves WITHOUT ever
 * overshooting into land — unlike interpolating splines (e.g. Catmull-Rom),
 * which bulge past their control points on sharp turns.
 *
 * Kept in sync with the reference implementation in scripts/audit-routes.mjs,
 * which uses it to verify that no smoothed sea lane slices through a landmass.
 */
export function smoothPath(points: LngLat[], iterations = 3): LngLat[] {
  if (points.length < 3) return points;
  let pts = points;
  for (let it = 0; it < iterations; it++) {
    const out: LngLat[] = [pts[0]];
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
