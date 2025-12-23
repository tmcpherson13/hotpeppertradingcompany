import { Pepper } from '@/data/peppers';
import { Flame, ChevronRight } from 'lucide-react';

interface PepperLedgerProps {
  peppers: Pepper[];
  onSelectPepper: (pepper: Pepper) => void;
}

const getHeatColor = (level: string) => {
  switch (level) {
    case 'Mild': return 'bg-green-700';
    case 'Medium': return 'bg-yellow-600';
    case 'Hot': return 'bg-orange-600';
    case 'Very Hot': return 'bg-red-600';
    case 'Extreme': return 'bg-red-800';
    default: return 'bg-muted';
  }
};

const getHeatTextColor = (level: string) => {
  switch (level) {
    case 'Mild': return 'text-green-700';
    case 'Medium': return 'text-yellow-600';
    case 'Hot': return 'text-orange-600';
    case 'Very Hot': return 'text-red-600';
    case 'Extreme': return 'text-red-800';
    default: return 'text-muted-foreground';
  }
};

const formatScoville = (min: number, max: number) => {
  if (min >= 1000) {
    return `${(min / 1000).toFixed(0)}k–${(max / 1000).toFixed(0)}k`;
  }
  return `${min}–${max}`;
};

const formatYear = (year: number) => {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year}`;
};

export function PepperLedger({ peppers, onSelectPepper }: PepperLedgerProps) {
  if (peppers.length === 0) {
    return (
      <div className="text-center py-16 bg-[#f5efe6] border border-[#5a4a3a]/20">
        <p className="font-body text-[#5a4a3a] italic">
          No entries match the current search criteria.
        </p>
        <p className="font-body text-sm text-[#5a4a3a]/60 mt-2">
          Adjust your filters or search terms to view registry entries.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5efe6] border border-[#5a4a3a]/20">
      {/* Ledger Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#e8dcc4] border-b-2 border-[#5a4a3a]/30">
        <div className="col-span-3">
          <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-[#5a4a3a]">
            Variety Name
          </span>
        </div>
        <div className="col-span-2">
          <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-[#5a4a3a]">
            Provenance
          </span>
        </div>
        <div className="col-span-2 text-center">
          <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-[#5a4a3a]">
            Pungency
          </span>
        </div>
        <div className="col-span-2 text-center">
          <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-[#5a4a3a]">
            Scoville
          </span>
        </div>
        <div className="col-span-2 text-center">
          <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-[#5a4a3a]">
            Introduced
          </span>
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Ledger Entries */}
      <div className="divide-y divide-[#5a4a3a]/10">
        {peppers.map((pepper, index) => (
          <button
            key={pepper.id}
            onClick={() => onSelectPepper(pepper)}
            className="w-full text-left px-6 py-4 hover:bg-[#e8dcc4]/50 transition-colors group"
          >
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <p className="font-display text-sm uppercase tracking-wide text-[#3a2a1a] group-hover:text-primary transition-colors">
                  {pepper.name}
                </p>
                <p className="font-body text-xs italic text-[#5a4a3a]/70">
                  {pepper.scientificName}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-body text-sm text-[#3a2a1a]">{pepper.origin}</p>
                <p className="font-body text-xs text-[#5a4a3a]/60">{pepper.region}</p>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getHeatColor(pepper.heatLevel)}`} />
                <span className={`font-body text-sm ${getHeatTextColor(pepper.heatLevel)}`}>
                  {pepper.heatLevel}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-body text-sm text-[#3a2a1a]">
                  {formatScoville(pepper.scovilleMin, pepper.scovilleMax)}
                </span>
                <span className="font-body text-xs text-[#5a4a3a]/60 ml-1">SHU</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-body text-sm text-[#3a2a1a]">
                  {formatYear(pepper.yearIntroduced)}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <ChevronRight className="w-4 h-4 text-[#5a4a3a]/40 group-hover:text-primary transition-colors" />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display text-sm uppercase tracking-wide text-[#3a2a1a]">
                    {pepper.name}
                  </p>
                  <p className="font-body text-xs italic text-[#5a4a3a]/70">
                    {pepper.origin} · {pepper.region}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${getHeatColor(pepper.heatLevel)}`} />
                  <span className={`font-body text-xs ${getHeatTextColor(pepper.heatLevel)}`}>
                    {pepper.heatLevel}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-body text-[#5a4a3a]">
                  {formatScoville(pepper.scovilleMin, pepper.scovilleMax)} SHU
                </span>
                <span className="font-body text-[#5a4a3a]/60">
                  {formatYear(pepper.yearIntroduced)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Ledger Footer */}
      <div className="px-6 py-3 bg-[#e8dcc4]/50 border-t border-[#5a4a3a]/20 flex items-center justify-between">
        <span className="font-body text-[10px] text-[#5a4a3a]/50 italic">
          {peppers.length} {peppers.length === 1 ? 'entry' : 'entries'} in registry
        </span>
        <span className="font-body text-[10px] text-[#5a4a3a]/50">
          Select entry to view full record
        </span>
      </div>
    </div>
  );
}
