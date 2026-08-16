/**
 * Database-backed peppers: everything added beyond the original 190 (which live
 * in ./peppers.ts as a frozen, build-time fallback). This module maps rows from
 * the `peppers` Supabase table into the app's Pepper shape and exposes a fetch
 * plus a small module-level store used to inject data during prerendering.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Pepper, Species, HeatLevel, PepperImage } from '@/data/pepperTypes';

// The generated Supabase types are produced from the current schema and do not
// yet include the new `peppers` table. Until types are regenerated, this module
// is the single boundary that talks to that table, via a loosely-typed client.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;
export const PEPPERS_TABLE = 'peppers';

/** Row shape of the public.peppers table (snake_case). */
export interface DbPepperRow {
  id: string;
  name: string;
  alternate_names: string[] | null;
  scientific_name: string;
  species: string;
  origin: string;
  region: string;
  scoville_min: number;
  scoville_max: number;
  scoville_source: string | null;
  heat_level: string;
  flavor_notes: string[] | null;
  aroma_notes: string[] | null;
  description: string | null;
  historical_notes: string | null;
  trade_route: string | null;
  trade_route_tags: string[] | null;
  year_introduced: number | null;
  culinary_uses: string[] | null;
  pairings: string[] | null;
  in_stock: boolean;
  image_url: string | null;
  gallery: PepperImage[] | null;
  source_citations: unknown;
  status: 'draft' | 'published';
  verified: boolean;
  data_source: string;
  enrichment_version?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

/** Convert a DB row into the Pepper shape the UI already understands. */
export function mapDbRowToPepper(row: DbPepperRow): Pepper {
  const gallery: PepperImage[] =
    row.gallery && row.gallery.length > 0
      ? row.gallery
      : row.image_url
        ? [{ id: `${row.id}-primary`, url: row.image_url, type: 'photo', isPrimary: true, source: 'user-contributed' }]
        : [];

  return {
    id: row.id,
    name: row.name,
    alternateNames: row.alternate_names ?? undefined,
    scientificName: row.scientific_name,
    species: row.species as Species,
    origin: row.origin,
    region: row.region as Pepper['region'],
    scovilleMin: row.scoville_min,
    scovilleMax: row.scoville_max,
    heatLevel: row.heat_level as HeatLevel,
    flavorNotes: row.flavor_notes ?? [],
    aromaNotes: row.aroma_notes ?? undefined,
    description: row.description ?? '',
    historicalNotes: row.historical_notes ?? undefined,
    tradeRoute: row.trade_route ?? '',
    tradeRouteTags: row.trade_route_tags ?? undefined,
    yearIntroduced: row.year_introduced ?? 0,
    culinaryUses: row.culinary_uses ?? [],
    pairings: row.pairings ?? undefined,
    inStock: row.in_stock,
    gallery: gallery.length > 0 ? gallery : undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

/**
 * Fetch all PUBLISHED database peppers, mapped to the Pepper shape.
 * Returns [] on any error (unconfigured env, network, RLS) so the site always
 * falls back cleanly to the static 190.
 */
export async function fetchPublishedPeppers(): Promise<Pepper[]> {
  try {
    const { data, error } = await db
      .from(PEPPERS_TABLE)
      .select('*')
      .eq('status', 'published');
    if (error || !data) return [];
    return (data as DbPepperRow[]).map(mapDbRowToPepper);
  } catch {
    return [];
  }
}

/** Slugify a name into a stable url id: "Carolina Reaper" -> "carolina-reaper". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Admin: fetch every pepper row (drafts included) for the management list. */
export async function fetchAllPeppersAdmin(): Promise<DbPepperRow[]> {
  const { data, error } = await db
    .from(PEPPERS_TABLE)
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbPepperRow[];
}

/** Admin: insert or update a pepper (keyed by id). */
export async function upsertPepper(row: Partial<DbPepperRow> & { id: string }): Promise<void> {
  const { error } = await db.from(PEPPERS_TABLE).upsert(row, { onConflict: 'id' });
  if (error) throw error;
}

/**
 * Admin: insert or update many peppers in one round-trip (keyed by id).
 * Callers are responsible for setting status/data_source/verified on each row.
 */
export async function bulkUpsertPeppers(
  rows: Array<Partial<DbPepperRow> & { id: string }>,
): Promise<void> {
  const { error } = await db.from(PEPPERS_TABLE).upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

/** Admin: delete a pepper by id. */
export async function deletePepper(id: string): Promise<void> {
  const { error } = await db.from(PEPPERS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

/**
 * Admin: make an image the pepper's canonical display image for ALL visitors.
 *
 * The compendium card and full record read a pepper's default image from a
 * single field — `peppers.image_url` for DB-backed peppers and
 * `pepper_overrides.image_url` for the original static 190. Writing both keeps
 * the "image on the left" choice global instead of living only in the curating
 * browser's localStorage. Both writes are RLS-guarded (admin-only); the DB-row
 * update is a no-op for static peppers that have no `peppers` row.
 */
export async function setPepperPrimaryImage(
  pepperId: string,
  image: { url: string; sourceUrl?: string | null; license?: string | null; author?: string | null },
): Promise<void> {
  const now = new Date().toISOString();

  const { error: pepperError } = await db
    .from(PEPPERS_TABLE)
    .update({ image_url: image.url, updated_at: now })
    .eq('id', pepperId);
  if (pepperError) throw pepperError;

  const { error: overrideError } = await db
    .from('pepper_overrides')
    .upsert(
      {
        pepper_id: pepperId,
        image_url: image.url,
        image_source_url: image.sourceUrl ?? null,
        image_license: image.license ?? null,
        image_author: image.author ?? null,
        updated_at: now,
      },
      { onConflict: 'pepper_id' },
    );
  if (overrideError) throw overrideError;
}

// ---- SSR / prerender injection store ----
// During build-time prerendering there is no React Query; the prerender script
// fetches DB peppers once and injects them here so components render them.
let injectedDbPeppers: Pepper[] = [];

export function setInjectedDbPeppers(list: Pepper[]): void {
  injectedDbPeppers = list ?? [];
}

export function getInjectedDbPeppers(): Pepper[] {
  return injectedDbPeppers;
}
