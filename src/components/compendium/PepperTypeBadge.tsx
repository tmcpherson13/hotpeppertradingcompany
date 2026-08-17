import { PepperType, pepperTypeLabels, pepperTypeGlossary } from '@/data/pepperTypes';

const TYPE_STYLES: Record<PepperType, string> = {
  'wild-species': 'bg-[#3f5a3a]/12 text-[#3f5a3a] border-[#3f5a3a]/25',
  'landrace': 'bg-[#6F2027]/10 text-[#6F2027] border-[#6F2027]/25',
  'heirloom': 'bg-[#8a5a2b]/12 text-[#7a4a1e] border-[#8a5a2b]/25',
  'f1-hybrid': 'bg-[#2b5a6f]/12 text-[#234e60] border-[#2b5a6f]/25',
  'modern-cultivar': 'bg-[#5a4a3a]/12 text-[#5a4a3a] border-[#5a4a3a]/25',
  'ornamental': 'bg-[#7a3a6f]/12 text-[#6a2f60] border-[#7a3a6f]/25',
};

/** Small classification chip; hover shows the plain-English definition. */
export function PepperTypeBadge({ type, className = '' }: { type: PepperType; className?: string }) {
  return (
    <span
      title={pepperTypeGlossary[type]}
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 font-heading text-[10px] uppercase tracking-wider cursor-help ${TYPE_STYLES[type]} ${className}`}
    >
      {pepperTypeLabels[type]}
    </span>
  );
}

const ALL_TYPES: PepperType[] = ['wild-species', 'landrace', 'heirloom', 'f1-hybrid', 'modern-cultivar', 'ornamental'];

/** A legend explaining the six classifications, for the Compendium page. */
export function PepperTypeLegend() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
      {ALL_TYPES.map((t) => (
        <div key={t} className="flex items-start gap-2">
          <PepperTypeBadge type={t} className="mt-0.5 shrink-0" />
          <span className="font-body text-xs text-[#5a4a3a]/80 leading-snug">{pepperTypeGlossary[t]}</span>
        </div>
      ))}
    </div>
  );
}
