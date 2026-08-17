import { useMemo, useState, useEffect } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { peppers as staticPeppers } from '@/data/peppers';
import { usePepperOverrides } from '@/hooks/usePepperOverrides';
import { upsertPepper } from '@/data/dbPeppers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, RotateCcw, Database, FileText } from 'lucide-react';
import { toast } from 'sonner';

const HEAT_LEVELS = ['No Heat', 'Very Mild', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme', 'Superhot'];

const joinTags = (arr?: string[] | null) => (arr && arr.length ? arr.join(', ') : '');
const splitTags = (s: string) => s.split(',').map((t) => t.trim()).filter(Boolean);

interface EditableRecordPanelProps {
  pepper: Pepper;
}

/**
 * A directly-editable form of a pepper's core record, shown as soon as a pepper
 * is selected — no enrichment API call required for a small manual fix. Writes
 * to the correct store: pepper_overrides for the static catalog, or the peppers
 * table for database-backed cultivars. The full-enrichment action lives in the
 * Research & Synthesis panel just below.
 */
export function EditableRecordPanel({ pepper }: EditableRecordPanelProps) {
  const { getOverride, saveOverride, isSaving } = usePepperOverrides();
  const isStatic = useMemo(() => staticPeppers.some((p) => p.id === pepper.id), [pepper.id]);
  const override = getOverride(pepper.id);

  // Current effective values (override wins for the static catalog).
  const initial = useMemo(() => ({
    description: override?.description ?? pepper.description ?? '',
    historical_notes: override?.historical_notes ?? pepper.historicalNotes ?? '',
    trade_route: override?.trade_route ?? pepper.tradeRoute ?? '',
    origin: override?.origin ?? pepper.origin ?? '',
    heat_level: override?.heat_level ?? pepper.heatLevel ?? '',
    scoville_min: (override?.scoville_min ?? pepper.scovilleMin ?? 0).toString(),
    scoville_max: (override?.scoville_max ?? pepper.scovilleMax ?? 0).toString(),
    flavor_notes: override?.flavor_notes ?? joinTags(pepper.flavorNotes),
    aroma_notes: override?.aroma_notes ?? joinTags(pepper.aromaNotes),
    culinary_uses: override?.culinary_uses ?? joinTags(pepper.culinaryUses),
  }), [pepper, override]);

  const [form, setForm] = useState(initial);
  const [savingDb, setSavingDb] = useState(false);

  // Reset the form whenever a different pepper is selected.
  useEffect(() => { setForm(initial); }, [initial]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const busy = isSaving || savingDb;

  const handleSave = async () => {
    const scMin = parseInt(form.scoville_min, 10) || 0;
    const scMax = parseInt(form.scoville_max, 10) || 0;

    if (isStatic) {
      // Static catalog → store deltas in pepper_overrides (tags as text).
      const ok = await saveOverride(pepper.id, {
        description: form.description,
        historical_notes: form.historical_notes,
        trade_route: form.trade_route,
        origin: form.origin,
        heat_level: form.heat_level,
        scoville_min: scMin,
        scoville_max: scMax,
        flavor_notes: form.flavor_notes,
        aroma_notes: form.aroma_notes,
        culinary_uses: form.culinary_uses,
      });
      if (ok) window.dispatchEvent(new CustomEvent('pepper-override-saved', { detail: { pepperId: pepper.id } }));
    } else {
      // Database cultivar → update the peppers row directly (tags as arrays).
      setSavingDb(true);
      try {
        await upsertPepper({
          id: pepper.id,
          description: form.description,
          historical_notes: form.historical_notes,
          trade_route: form.trade_route,
          origin: form.origin,
          heat_level: form.heat_level,
          scoville_min: scMin,
          scoville_max: scMax,
          flavor_notes: splitTags(form.flavor_notes),
          aroma_notes: splitTags(form.aroma_notes),
          culinary_uses: splitTags(form.culinary_uses),
        });
        toast.success('Record saved');
      } catch (err) {
        console.error('Failed to save pepper record:', err);
        toast.error('Failed to save record');
      } finally {
        setSavingDb(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink/50">
          {isStatic ? <FileText className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
          {isStatic ? 'Static catalog · saved as an override' : 'Database cultivar · edits the record directly'}
        </span>
        <div className="flex items-center gap-2">
          {dirty && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setForm(initial)} disabled={busy}>
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
          )}
          <Button size="sm" className="text-xs" onClick={handleSave} disabled={!dirty || busy}>
            <Save className="w-3 h-3 mr-1" /> {busy ? 'Saving…' : 'Save Record'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Field label="Description">
          <Textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
        <Field label="Historical Notes">
          <Textarea rows={4} value={form.historical_notes} onChange={(e) => set('historical_notes', e.target.value)} />
        </Field>
        <Field label="Trade Route">
          <Textarea rows={2} value={form.trade_route} onChange={(e) => set('trade_route', e.target.value)} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Origin">
            <Input value={form.origin} onChange={(e) => set('origin', e.target.value)} />
          </Field>
          <Field label="Heat Level">
            <select
              value={form.heat_level}
              onChange={(e) => set('heat_level', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {HEAT_LEVELS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Scoville Min">
              <Input type="number" value={form.scoville_min} onChange={(e) => set('scoville_min', e.target.value)} />
            </Field>
            <Field label="Scoville Max">
              <Input type="number" value={form.scoville_max} onChange={(e) => set('scoville_max', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Flavor Notes (comma-separated)">
            <Input value={form.flavor_notes} onChange={(e) => set('flavor_notes', e.target.value)} placeholder="Sweet, Earthy, Dried fruit" />
          </Field>
          <Field label="Aroma Notes (comma-separated)">
            <Input value={form.aroma_notes} onChange={(e) => set('aroma_notes', e.target.value)} placeholder="Grassy, Fresh" />
          </Field>
          <Field label="Culinary Uses (comma-separated)">
            <Input value={form.culinary_uses} onChange={(e) => set('culinary_uses', e.target.value)} placeholder="Roasting, Hot sauce" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-wider text-ink/60">{label}</Label>
      {children}
    </div>
  );
}
