import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchAllPeppersAdmin,
  upsertPepper,
  deletePepper,
  slugify,
  type DbPepperRow,
} from '@/data/dbPeppers';
import { regions, heatLevels, speciesList, speciesDisplayNames } from '@/data/pepperTypes';

// ---- helpers to move between comma/line text and string[] ----
const toArray = (s: string): string[] =>
  s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
const fromArray = (a?: string[] | null): string => (a ?? []).join(', ');

type FormState = {
  id: string;
  name: string;
  alternate_names: string;
  scientific_name: string;
  species: string;
  origin: string;
  region: string;
  scoville_min: string;
  scoville_max: string;
  scoville_source: string;
  heat_level: string;
  flavor_notes: string;
  aroma_notes: string;
  description: string;
  historical_notes: string;
  trade_route: string;
  trade_route_tags: string;
  year_introduced: string;
  culinary_uses: string;
  pairings: string;
  in_stock: boolean;
  image_url: string;
  source_citations: string;
  status: 'draft' | 'published';
  verified: boolean;
};

const emptyForm: FormState = {
  id: '', name: '', alternate_names: '', scientific_name: '', species: 'annuum',
  origin: '', region: 'Americas', scoville_min: '0', scoville_max: '0', scoville_source: '',
  heat_level: 'Medium', flavor_notes: '', aroma_notes: '', description: '', historical_notes: '',
  trade_route: '', trade_route_tags: '', year_introduced: '', culinary_uses: '', pairings: '',
  in_stock: false, image_url: '', source_citations: '', status: 'draft', verified: false,
};

function rowToForm(r: DbPepperRow): FormState {
  return {
    id: r.id,
    name: r.name,
    alternate_names: fromArray(r.alternate_names),
    scientific_name: r.scientific_name,
    species: r.species,
    origin: r.origin,
    region: r.region,
    scoville_min: String(r.scoville_min ?? 0),
    scoville_max: String(r.scoville_max ?? 0),
    scoville_source: r.scoville_source ?? '',
    heat_level: r.heat_level,
    flavor_notes: fromArray(r.flavor_notes),
    aroma_notes: fromArray(r.aroma_notes),
    description: r.description ?? '',
    historical_notes: r.historical_notes ?? '',
    trade_route: r.trade_route ?? '',
    trade_route_tags: fromArray(r.trade_route_tags),
    year_introduced: r.year_introduced != null ? String(r.year_introduced) : '',
    culinary_uses: fromArray(r.culinary_uses),
    pairings: fromArray(r.pairings),
    in_stock: r.in_stock,
    image_url: r.image_url ?? '',
    source_citations: Array.isArray(r.source_citations) ? (r.source_citations as string[]).join('\n') : '',
    status: r.status,
    verified: r.verified,
  };
}

const labelCls = 'font-heading text-xs uppercase tracking-wider text-ink/70';
const fieldWrap = 'flex flex-col gap-1.5';

export function PepperManager() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<FormState | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'peppers'],
    queryFn: fetchAllPeppersAdmin,
  });

  const set = (patch: Partial<FormState>) => setEditing((f) => (f ? { ...f, ...patch } : f));

  const startNew = () => { setEditing({ ...emptyForm }); setIsNew(true); };
  const startEdit = (r: DbPepperRow) => { setEditing(rowToForm(r)); setIsNew(false); };
  const cancel = () => { setEditing(null); setIsNew(false); };

  const onNameChange = (name: string) => {
    // Auto-fill the slug from the name only for new, untouched entries.
    if (isNew && (editing?.id === '' || editing?.id === slugify(editing?.name ?? ''))) {
      set({ name, id: slugify(name) });
    } else {
      set({ name });
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.id.trim() || !editing.scientific_name.trim()) {
      toast.error('Name, slug, and scientific name are required.');
      return;
    }
    if (editing.status === 'published' && !editing.verified) {
      toast.error('Verify the entry (Scoville, scientific name, dates) before publishing.');
      return;
    }
    setSaving(true);
    try {
      await upsertPepper({
        id: slugify(editing.id),
        name: editing.name.trim(),
        alternate_names: toArray(editing.alternate_names),
        scientific_name: editing.scientific_name.trim(),
        species: editing.species,
        origin: editing.origin.trim(),
        region: editing.region,
        scoville_min: Number(editing.scoville_min) || 0,
        scoville_max: Number(editing.scoville_max) || 0,
        scoville_source: editing.scoville_source.trim() || null,
        heat_level: editing.heat_level,
        flavor_notes: toArray(editing.flavor_notes),
        aroma_notes: toArray(editing.aroma_notes),
        description: editing.description.trim(),
        historical_notes: editing.historical_notes.trim() || null,
        trade_route: editing.trade_route.trim(),
        trade_route_tags: toArray(editing.trade_route_tags),
        year_introduced: editing.year_introduced ? Number(editing.year_introduced) : null,
        culinary_uses: toArray(editing.culinary_uses),
        pairings: toArray(editing.pairings),
        in_stock: editing.in_stock,
        image_url: editing.image_url.trim() || null,
        source_citations: toArray(editing.source_citations),
        status: editing.status,
        verified: editing.verified,
        data_source: 'manual',
        updated_by: user?.id ?? null,
        ...(isNew ? { created_by: user?.id ?? null } : {}),
      });
      toast.success(isNew ? 'Cultivar created.' : 'Cultivar updated.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'peppers'] });
      queryClient.invalidateQueries({ queryKey: ['peppers'] });
      cancel();
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: DbPepperRow) => {
    if (!confirm(`Delete "${r.name}"? This cannot be undone.`)) return;
    try {
      await deletePepper(r.id);
      toast.success('Cultivar deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'peppers'] });
      queryClient.invalidateQueries({ queryKey: ['peppers'] });
    } catch (e) {
      toast.error(`Delete failed: ${(e as Error).message}`);
    }
  };

  // ---- editor form ----
  if (editing) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg uppercase tracking-wider text-ink">
            {isNew ? 'New Cultivar' : `Editing: ${editing.name}`}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={cancel} disabled={saving}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing.status === 'published' ? 'Save & Publish' : 'Save Draft'}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className={fieldWrap}>
            <Label className={labelCls}>Name *</Label>
            <Input value={editing.name} onChange={(e) => onNameChange(e.target.value)} placeholder="Carolina Reaper" />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Slug (URL id) *</Label>
            <Input value={editing.id} onChange={(e) => set({ id: e.target.value })} disabled={!isNew} placeholder="carolina-reaper" />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Scientific Name *</Label>
            <Input value={editing.scientific_name} onChange={(e) => set({ scientific_name: e.target.value })} placeholder="Capsicum chinense" />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Species</Label>
            <select className="h-10 border border-ink/20 bg-parchment px-3 text-sm" value={editing.species} onChange={(e) => set({ species: e.target.value })}>
              {speciesList.map((s) => <option key={s} value={s}>{speciesDisplayNames[s]}</option>)}
            </select>
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Alternate Names (comma-separated)</Label>
            <Input value={editing.alternate_names} onChange={(e) => set({ alternate_names: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Origin *</Label>
            <Input value={editing.origin} onChange={(e) => set({ origin: e.target.value })} placeholder="South Carolina, USA" />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Region</Label>
            <select className="h-10 border border-ink/20 bg-parchment px-3 text-sm" value={editing.region} onChange={(e) => set({ region: e.target.value })}>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Heat Level</Label>
            <select className="h-10 border border-ink/20 bg-parchment px-3 text-sm" value={editing.heat_level} onChange={(e) => set({ heat_level: e.target.value })}>
              {heatLevels.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Scoville Min</Label>
            <Input type="number" value={editing.scoville_min} onChange={(e) => set({ scoville_min: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Scoville Max</Label>
            <Input type="number" value={editing.scoville_max} onChange={(e) => set({ scoville_max: e.target.value })} />
          </div>
          <div className={`${fieldWrap} md:col-span-2`}>
            <Label className={labelCls}>Scoville Source (citation — required to verify)</Label>
            <Input value={editing.scoville_source} onChange={(e) => set({ scoville_source: e.target.value })} placeholder="Guinness World Records 2013 / PuckerButt Pepper Co." />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Year Introduced (negative = BCE)</Label>
            <Input type="number" value={editing.year_introduced} onChange={(e) => set({ year_introduced: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Trade Route</Label>
            <Input value={editing.trade_route} onChange={(e) => set({ trade_route: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Flavor Notes (comma-separated)</Label>
            <Input value={editing.flavor_notes} onChange={(e) => set({ flavor_notes: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Aroma Notes (comma-separated)</Label>
            <Input value={editing.aroma_notes} onChange={(e) => set({ aroma_notes: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Culinary Uses (comma-separated)</Label>
            <Input value={editing.culinary_uses} onChange={(e) => set({ culinary_uses: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Pairings (comma-separated)</Label>
            <Input value={editing.pairings} onChange={(e) => set({ pairings: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Trade Route Tags (comma-separated)</Label>
            <Input value={editing.trade_route_tags} onChange={(e) => set({ trade_route_tags: e.target.value })} />
          </div>
          <div className={fieldWrap}>
            <Label className={labelCls}>Image URL</Label>
            <Input value={editing.image_url} onChange={(e) => set({ image_url: e.target.value })} placeholder="https://…" />
          </div>
        </div>

        <div className={fieldWrap}>
          <Label className={labelCls}>Description</Label>
          <Textarea rows={3} value={editing.description} onChange={(e) => set({ description: e.target.value })} />
        </div>
        <div className={fieldWrap}>
          <Label className={labelCls}>Historical Notes</Label>
          <Textarea rows={4} value={editing.historical_notes} onChange={(e) => set({ historical_notes: e.target.value })} />
        </div>
        <div className={fieldWrap}>
          <Label className={labelCls}>Source Citations (one per line)</Label>
          <Textarea rows={3} value={editing.source_citations} onChange={(e) => set({ source_citations: e.target.value })} placeholder="https://source-one.example&#10;Author (Year). Title. Publication." />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-ink/15">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={editing.in_stock} onCheckedChange={(v) => set({ in_stock: !!v })} />
            <span className={labelCls}>In Cargo (in stock)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={editing.verified} onCheckedChange={(v) => set({ verified: !!v })} />
            <span className={labelCls}>Facts verified (SHU, name, dates)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className={labelCls}>Status</span>
            <select className="h-9 border border-ink/20 bg-parchment px-3 text-sm" value={editing.status} onChange={(e) => set({ status: e.target.value as 'draft' | 'published' })}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (live)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // ---- list view ----
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-body text-ink/60 text-sm">
          {rows.length} cultivar{rows.length === 1 ? '' : 's'} in the database (beyond the built-in 190).
        </p>
        <Button onClick={startNew}><Plus className="w-4 h-4 mr-2" />New Cultivar</Button>
      </div>

      {error && (
        <p className="font-body text-pepper-red text-sm">
          Could not load database peppers. The peppers table may not be migrated yet.
        </p>
      )}
      {isLoading && <Loader2 className="w-5 h-5 animate-spin text-ink/50" />}

      {!isLoading && rows.length === 0 && !error && (
        <div className="border border-dashed border-ink/25 p-8 text-center">
          <p className="font-body text-ink/60">No database cultivars yet. Add one, or run the enrichment/import pipeline.</p>
        </div>
      )}

      <div className="divide-y divide-ink/10">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-3 gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading text-ink truncate">{r.name}</span>
                <span className={`text-[10px] font-heading uppercase tracking-wider px-1.5 py-0.5 border ${r.status === 'published' ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-amber-700 border-amber-300 bg-amber-50'}`}>
                  {r.status}
                </span>
                {r.verified && <span className="text-[10px] font-heading uppercase tracking-wider px-1.5 py-0.5 border text-tyrian border-tyrian/30 bg-tyrian/5">verified</span>}
              </div>
              <span className="font-body text-xs italic text-ink/50">{r.scientific_name} · {r.origin}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {r.status === 'published' && (
                <a href={`/peppers/${r.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-ink/50 hover:text-tyrian" title="View page">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => startEdit(r)} className="p-2 text-ink/50 hover:text-tyrian" title="Edit"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(r)} className="p-2 text-ink/50 hover:text-pepper-red" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
