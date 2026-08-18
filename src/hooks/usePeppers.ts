/**
 * useAllPeppers — the unified pepper source for the app.
 *
 * Returns the frozen static 190 UNION the published database peppers, deduped by
 * id (static wins on collision). Works in both environments:
 *  - Browser: React Query fetches DB peppers and merges them reactively.
 *  - Prerender (SSR): React Query effects don't run, so it uses initialData
 *    seeded from the injection store the prerender script populated.
 */
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { peppers as staticPeppers } from '@/data/peppers';
import type { Pepper } from '@/data/pepperTypes';
import { canonicalHeatLevel } from '@/data/pepperTypes';
import { fetchPublishedPeppers, getInjectedDbPeppers, setInjectedDbPeppers } from '@/data/dbPeppers';

// Derive each pepper's heat level from its Scoville max so the whole catalogue
// uses one consistent scale (hand-entered labels had drifted out of agreement).
function withCanonicalHeat(p: Pepper): Pepper {
  const heat = canonicalHeatLevel(p.scovilleMax);
  return heat && heat !== p.heatLevel ? { ...p, heatLevel: heat } : p;
}

function mergePeppers(dbPeppers: Pepper[]): Pepper[] {
  const seen = new Set(staticPeppers.map((p) => p.id));
  const extras = dbPeppers.filter((p) => !seen.has(p.id));
  return [...staticPeppers, ...extras].map(withCanonicalHeat);
}

export function useAllPeppers() {
  const { data, isLoading } = useQuery({
    queryKey: ['peppers', 'published'],
    queryFn: async () => {
      const rows = await fetchPublishedPeppers();
      // Keep the SSR/injection store in sync for any non-hook consumers.
      setInjectedDbPeppers(rows);
      return rows;
    },
    // Seed from the injection store so prerendered pages include DB peppers.
    initialData: getInjectedDbPeppers,
    staleTime: 5 * 60 * 1000,
  });

  const peppers = useMemo(() => mergePeppers(data ?? []), [data]);
  return { peppers, isLoading };
}
