import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, UploadCloud, AlertTriangle, CheckCircle2, Copy, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchAllPeppersAdmin,
  bulkUpsertPeppers,
  slugify,
  type DbPepperRow,
} from '@/data/dbPeppers';
import { peppers } from '@/data/peppers';
import { regions, heatLevels, speciesList } from '@/data/pepperTypes';

// ---- seed record schema (what the admin pastes) ----
interface SeedRecord {
  id?: string;
  name: string;
  species: string;
  scientific_name: string;
  origin: string;
  region: string;
  heat_level: string;
  scoville_min?: number;
  scoville_max?: number;
  scoville_source?: string;
  alternate_names?: string[];
  description?: string;
  flavor_notes?: string[];
  source_citations?: string[];
}

// A row that passed validation and is ready to import.
interface ReadyRow {
  slug: string;
  seed: SeedRecord;
  // GBIF normalization results (best-effort)
  gbifCanonical?: string;
  gbifMismatch?: boolean;
  gbifError?: boolean;
}

interface InvalidRow {
  index: number;
  name: string;
  reason: string;
}

interface PreviewResult {
  ready: ReadyRow[];
  duplicates: string[]; // slugs skipped
  invalid: InvalidRow[];
  useGbifNames: boolean; // whether to apply GBIF canonical names on import
}

const labelCls = 'font-heading text-xs uppercase tracking-wider text-ink/70';

// Build a set of every id already known to the app (static 190 + DB rows).
function existingSlugSet(dbRows: DbPepperRow[]): Set<string> {
  const set = new Set<string>();
  for (const p of peppers) set.add(p.id);
  for (const r of dbRows) set.add(r.id);
  return set;
}

// Validate a single seed record; returns an error reason string, or null if OK.
function validateSeed(rec: unknown): { reason: string | null; seed?: SeedRecord } {
  if (typeof rec !== 'object' || rec === null || Array.isArray(rec)) {
    return { reason: 'not a JSON object' };
  }
  const r = rec as Record<string, unknown>;

  const requiredStrings: Array<keyof SeedRecord> = [
    'name',
    'species',
    'scientific_name',
    'origin',
    'region',
    'heat_level',
  ];
  for (const field of requiredStrings) {
    const v = r[field];
    if (typeof v !== 'string' || v.trim() === '') {
      return { reason: `missing or empty required field "${field}"` };
    }
  }

  if (!(speciesList as readonly string[]).includes(r.species as string)) {
    return { reason: `invalid species "${String(r.species)}" (expected one of: ${speciesList.join(', ')})` };
  }
  if (!(regions as readonly string[]).includes(r.region as string)) {
    return { reason: `invalid region "${String(r.region)}" (expected one of: ${regions.join(', ')})` };
  }
  if (!(heatLevels as readonly string[]).includes(r.heat_level as string)) {
    return { reason: `invalid heat_level "${String(r.heat_level)}" (expected one of: ${heatLevels.join(', ')})` };
  }

  const numOrUndefined = (v: unknown): boolean => v === undefined || typeof v === 'number';
  if (!numOrUndefined(r.scoville_min)) return { reason: 'scoville_min must be a number' };
  if (!numOrUndefined(r.scoville_max)) return { reason: 'scoville_max must be a number' };

  const strArrayOrUndefined = (v: unknown): boolean =>
    v === undefined || (Array.isArray(v) && v.every((x) => typeof x === 'string'));
  if (!strArrayOrUndefined(r.alternate_names)) return { reason: 'alternate_names must be a string array' };
  if (!strArrayOrUndefined(r.flavor_notes)) return { reason: 'flavor_notes must be a string array' };
  if (!strArrayOrUndefined(r.source_citations)) return { reason: 'source_citations must be a string array' };

  return { reason: null, seed: r as unknown as SeedRecord };
}

// Best-effort GBIF taxonomy match with a small concurrency limit.
async function normalizeViaGbif(rows: ReadyRow[]): Promise<void> {
  const CONCURRENCY = 5;
  let cursor = 0;

  const worker = async () => {
    while (cursor < rows.length) {
      const idx = cursor++;
      const row = rows[idx];
      const name = row.seed.scientific_name.trim();
      try {
        const res = await fetch(
          `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}`,
        );
        if (!res.ok) {
          row.gbifError = true;
          continue;
        }
        const data = (await res.json()) as { canonicalName?: string; matchType?: string };
        if (data.canonicalName && data.matchType && data.matchType !== 'NONE') {
          row.gbifCanonical = data.canonicalName;
          row.gbifMismatch = data.canonicalName.trim() !== name;
        }
      } catch {
        row.gbifError = true;
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, rows.length) }, worker));
}

export function PepperImporter() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [raw, setRaw] = useState('');
  const [useGbif, setUseGbif] = useState(false);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);

  const resetPreview = () => {
    setPreview(null);
    setParseError(null);
  };

  const runPreview = async () => {
    setValidating(true);
    setParseError(null);
    setPreview(null);
    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        setParseError(`Invalid JSON: ${(e as Error).message}`);
        return;
      }
      if (!Array.isArray(parsed)) {
        setParseError('Top-level JSON must be an array of seed records.');
        return;
      }
      if (parsed.length === 0) {
        setParseError('The array is empty — nothing to import.');
        return;
      }

      // Fetch existing DB rows for dedup (fall back to just the static set on error).
      let dbRows: DbPepperRow[] = [];
      try {
        dbRows = await fetchAllPeppersAdmin();
      } catch {
        toast.error('Could not load existing DB peppers for dedup — checking against the built-in set only.');
      }
      const existing = existingSlugSet(dbRows);

      const ready: ReadyRow[] = [];
      const duplicates: string[] = [];
      const invalid: InvalidRow[] = [];
      const seenInBatch = new Set<string>();

      parsed.forEach((rec, index) => {
        const { reason, seed } = validateSeed(rec);
        const displayName =
          typeof (rec as Record<string, unknown>)?.name === 'string'
            ? ((rec as Record<string, unknown>).name as string)
            : `row ${index + 1}`;
        if (reason || !seed) {
          invalid.push({ index: index + 1, name: displayName, reason: reason ?? 'invalid' });
          return;
        }
        const slug =
          seed.id && seed.id.trim() ? slugify(seed.id) : slugify(seed.name);
        if (!slug) {
          invalid.push({ index: index + 1, name: displayName, reason: 'name produced an empty slug' });
          return;
        }
        if (existing.has(slug) || seenInBatch.has(slug)) {
          duplicates.push(slug);
          return;
        }
        seenInBatch.add(slug);
        ready.push({ slug, seed });
      });

      if (useGbif && ready.length > 0) {
        await normalizeViaGbif(ready);
      }

      setPreview({ ready, duplicates, invalid, useGbifNames: useGbif });
    } finally {
      setValidating(false);
    }
  };

  const runImport = async () => {
    if (!preview || preview.ready.length === 0) return;
    setImporting(true);
    try {
      const rows: Array<Partial<DbPepperRow> & { id: string }> = preview.ready.map((row) => {
        const s = row.seed;
        const scientificName =
          preview.useGbifNames && row.gbifCanonical ? row.gbifCanonical : s.scientific_name.trim();
        return {
          id: row.slug,
          name: s.name.trim(),
          alternate_names: s.alternate_names ?? [],
          scientific_name: scientificName,
          species: s.species,
          origin: s.origin.trim(),
          region: s.region,
          scoville_min: typeof s.scoville_min === 'number' ? s.scoville_min : 0,
          scoville_max: typeof s.scoville_max === 'number' ? s.scoville_max : 0,
          scoville_source: s.scoville_source?.trim() || null,
          heat_level: s.heat_level,
          flavor_notes: s.flavor_notes ?? [],
          description: s.description?.trim() || null,
          source_citations: s.source_citations ?? [],
          status: 'draft',
          verified: false,
          data_source: 'imported',
          created_by: user?.id ?? null,
          updated_by: user?.id ?? null,
        };
      });

      await bulkUpsertPeppers(rows);
      toast.success(`Imported ${rows.length} cultivar${rows.length === 1 ? '' : 's'} as drafts`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'peppers'] });
      queryClient.invalidateQueries({ queryKey: ['peppers'] });
      setRaw('');
      resetPreview();
    } catch (e) {
      const msg = (e as Error).message || 'Unknown error';
      if (/row-level security|permission|denied|policy/i.test(msg)) {
        toast.error('Import blocked by permissions (RLS). You may lack rights to write cultivars.');
      } else {
        toast.error(`Import failed: ${msg}`);
      }
    } finally {
      setImporting(false);
    }
  };

  const readyCount = preview?.ready.length ?? 0;

  return (
    <div className="space-y-5">
      {/* Trust banner */}
      <div className="flex gap-3 border border-amber-300 bg-amber-50 p-4">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="font-body text-sm text-amber-900 space-y-1">
          <p className="font-heading uppercase tracking-wider text-xs text-amber-800">
            Imports land as unverified drafts
          </p>
          <p>
            Bulk-imported cultivars are saved as <strong>drafts</strong> and are never published
            automatically. Their facts — especially Scoville ranges and scientific names — must be
            reviewed and the entry marked <strong>verified</strong> in the Catalog editor before it
            can go live. This preserves the compendium's trust workflow.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className={labelCls}>Seed records — paste a JSON array</Label>
        <Textarea
          rows={12}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            if (preview || parseError) resetPreview();
          }}
          placeholder={`[\n  {\n    "name": "Example Pepper",\n    "species": "annuum",\n    "scientific_name": "Capsicum annuum",\n    "origin": "Somewhere",\n    "region": "Americas",\n    "heat_level": "Medium",\n    "scoville_min": 1000,\n    "scoville_max": 5000,\n    "scoville_source": "cite your source"\n  }\n]`}
          className="font-mono text-xs"
        />
        <p className="font-body text-xs text-ink/50">
          Required per row: name, species, scientific_name, origin, region, heat_level. See{' '}
          <code className="text-ink/70">docs/pepper-import-format.md</code> for the full schema and
          valid enum values. Slugs derive from <code className="text-ink/70">name</code> unless an{' '}
          <code className="text-ink/70">id</code> is supplied.
        </p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox checked={useGbif} onCheckedChange={(v) => setUseGbif(!!v)} />
        <span className={labelCls}>Validate scientific names via GBIF (authoritative taxonomy)</span>
      </label>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={runPreview} disabled={validating || importing || !raw.trim()}>
          {validating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Validate &amp; preview
        </Button>
        <Button onClick={runImport} disabled={importing || validating || readyCount === 0}>
          {importing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4 mr-2" />
          )}
          Import {readyCount} as draft{readyCount === 1 ? '' : 's'}
        </Button>
      </div>

      {parseError && (
        <div className="flex gap-2 border border-pepper-red/40 bg-pepper-red/5 p-3">
          <AlertTriangle className="w-4 h-4 text-pepper-red shrink-0 mt-0.5" />
          <p className="font-body text-sm text-pepper-red">{parseError}</p>
        </div>
      )}

      {preview && (
        <div className="space-y-4 border-t border-ink/15 pt-4">
          {/* Summary chips */}
          <div className="flex flex-wrap gap-3 font-heading text-xs uppercase tracking-wider">
            <span className="flex items-center gap-1.5 px-2 py-1 border border-emerald-300 bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {preview.ready.length} ready to import
            </span>
            <span className="px-2 py-1 border border-amber-300 bg-amber-50 text-amber-700">
              {preview.duplicates.length} duplicate{preview.duplicates.length === 1 ? '' : 's'} (skipped)
            </span>
            <span className="px-2 py-1 border border-pepper-red/40 bg-pepper-red/5 text-pepper-red">
              {preview.invalid.length} invalid
            </span>
          </div>

          {/* Ready table */}
          {preview.ready.length > 0 && (
            <div className="overflow-x-auto border border-ink/15">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-parchment-dark/30 text-left font-heading text-[10px] uppercase tracking-wider text-ink/60">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Species</th>
                    <th className="px-3 py-2">Region</th>
                    <th className="px-3 py-2">Heat</th>
                    <th className="px-3 py-2">SHU</th>
                    {preview.useGbifNames && <th className="px-3 py-2">GBIF</th>}
                  </tr>
                </thead>
                <tbody className="font-body text-ink/80">
                  {preview.ready.map((row) => (
                    <tr key={row.slug} className="border-t border-ink/10">
                      <td className="px-3 py-2">
                        <span className="font-heading text-ink">{row.seed.name}</span>
                        <span className="block text-[11px] italic text-ink/45">{row.slug}</span>
                      </td>
                      <td className="px-3 py-2">{row.seed.species}</td>
                      <td className="px-3 py-2">{row.seed.region}</td>
                      <td className="px-3 py-2">{row.seed.heat_level}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {(row.seed.scoville_min ?? 0).toLocaleString()}–
                        {(row.seed.scoville_max ?? 0).toLocaleString()}
                      </td>
                      {preview.useGbifNames && (
                        <td className="px-3 py-2 text-xs">
                          {row.gbifError ? (
                            <span className="text-ink/40">skipped</span>
                          ) : row.gbifCanonical ? (
                            <span className={row.gbifMismatch ? 'text-amber-700' : 'text-emerald-700'}>
                              {row.gbifMismatch ? `GBIF: ${row.gbifCanonical}` : 'match'}
                            </span>
                          ) : (
                            <span className="text-ink/40">no match</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preview.useGbifNames && preview.ready.some((r) => r.gbifMismatch) && (
            <p className="flex items-center gap-1.5 font-body text-xs text-amber-800">
              <Wand2 className="w-3.5 h-3.5" />
              GBIF suggests different canonical names (highlighted above). Importing will use the GBIF
              canonical name where a match was found.
            </p>
          )}

          {/* Duplicates */}
          {preview.duplicates.length > 0 && (
            <div>
              <p className="font-heading text-xs uppercase tracking-wider text-ink/60 mb-1 flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" />
                Duplicate slugs skipped (already in the compendium)
              </p>
              <p className="font-mono text-xs text-ink/60 break-words">
                {preview.duplicates.join(', ')}
              </p>
            </div>
          )}

          {/* Invalid */}
          {preview.invalid.length > 0 && (
            <div>
              <p className="font-heading text-xs uppercase tracking-wider text-pepper-red mb-1">
                Invalid rows (not imported)
              </p>
              <ul className="space-y-1">
                {preview.invalid.map((row) => (
                  <li key={row.index} className="font-body text-xs text-ink/70">
                    <span className="font-heading text-ink">#{row.index} {row.name}</span> —{' '}
                    <span className="text-pepper-red">{row.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
