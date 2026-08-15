/**
 * Pepper → Consortium blend mapping. Connects the educational catalogue to the
 * shop: given a pepper, find the Consortium Journeys that contain it so we can
 * cross-link "study this cultivar" → "buy a blend built around it".
 *
 * Source of truth: .memory/features/consortium/master-consortium-list.md (the
 * LOCKED 10-Journey lineup). Pepper display names there are resolved to static
 * pepper ids below. A few named peppers in the manifests have no matching
 * catalogue entry yet (e.g. Devil's Breath, Caribbean Red Habanero) and are
 * simply omitted — they add no link rather than a broken one.
 */
import { CONSORTIUMS, getConsortiumById } from '@/data/consortiums';
import type { Consortium } from '@/components/trading-post/JourneyCard';

/** consortiumId → the static pepper ids it contains. */
export const CONSORTIUM_PEPPER_IDS: Record<string, string[]> = {
  'cradle-of-fire':      ['chiltepin', 'ancho', 'chipotle-morita', 'serrano', 'habanero'],
  'southern-crucible':   ['aji-limon', 'aji-amarillo', 'wiri-wiri', 'aji-panca', 'rocoto'],
  'andean-diaspora':     ['aji-limon', 'aji-amarillo', 'aleppo-pepper', 'gochugaru'],
  'windward-passage':    ['peri-peri', 'urfa-biber', 'scotch-bonnet', 'wiri-wiri', 'trinidad-scorpion'],
  'phoenician-legacy':   ['aleppo-pepper', 'calabrian', 'urfa-biber', 'peri-peri', 'cayenne'],
  'silk-jade-passages':  ['gochugaru', 'urfa-biber', 'aleppo-pepper', 'thai', 'ghost'],
  'atlantic-provenance': ['ancho', 'de-arbol', 'datil', 'wiri-wiri', 'scotch-bonnet'],
  'letter-of-marque':    ['scotch-bonnet', 'rocoto', 'fatalii', 'trinidad-scorpion'],
  'manila-galleon':      ['ancho', 'aji-amarillo', 'thai', 'gochugaru', 'ghost'],
  'old-natchez-trace':   ['tabasco', 'pequin', 'hatch-green-chili', 'jalapeno-red', 'datil'],
};

/** Reverse index: pepper id → consortiumIds that contain it. Built once. */
const PEPPER_TO_CONSORTIUMS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const [consortiumId, pepperIds] of Object.entries(CONSORTIUM_PEPPER_IDS)) {
    for (const pid of pepperIds) {
      (map[pid] ??= []).push(consortiumId);
    }
  }
  return map;
})();

/** The Consortium Journeys that feature a given pepper (by id). Empty if none. */
export function getConsortiumsForPepper(pepperId: string): Consortium[] {
  const ids = PEPPER_TO_CONSORTIUMS[pepperId];
  if (!ids) return [];
  return ids.map((id) => getConsortiumById(id)).filter((c): c is Consortium => Boolean(c));
}

/** The shop route (product page) for a consortium. */
export function consortiumShopPath(c: Consortium): string {
  return `/product/${c.shopifyHandle}`;
}

/**
 * Curated essay → Consortium pairing for the "Taste this era" CTA at the end of
 * each history article. One representative Journey per era.
 */
export const ESSAY_CONSORTIUM: Record<string, string> = {
  'pre-columbian-origins': 'cradle-of-fire',    // Mesoamerican origins
  'columbian-exchange':    'atlantic-provenance', // the Atlantic triangle
  'global-integration':    'silk-jade-passages',  // modern global palate
};

export function getEssayConsortium(essaySlug: string): Consortium | undefined {
  const id = ESSAY_CONSORTIUM[essaySlug];
  return id ? getConsortiumById(id) : undefined;
}

export { CONSORTIUMS };
