import { Pepper, speciesDisplayNames } from '@/data/peppers';
import { Package, ChevronRight } from 'lucide-react';

interface PepperLedgerProps {
  peppers: Pepper[];
  onSelectPepper: (pepper: Pepper) => void;
}

const getHeatColor = (level: string) => {
  switch (level) {
    case 'No Heat': return 'bg-gray-400';
    case 'Very Mild': return 'bg-green-500';
    case 'Mild': return 'bg-green-700';
    case 'Medium': return 'bg-yellow-600';
    case 'Hot': return 'bg-orange-500';
    case 'Very Hot': return 'bg-orange-600';
    case 'Extreme': return 'bg-red-600';
    case 'Superhot': return 'bg-red-900';
    default: return 'bg-muted';
  }
};

const formatScoville = (min: number, max: number) => {
  const formatNum = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return `${n}`;
  };
  return `${formatNum(min)}–${formatNum(max)}`;
};

const formatYear = (year: number) => {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
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
    <div className="space-y-4">
      {/* Archival Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {peppers.map((pepper) => (
          <button
            key={pepper.id}
            onClick={() => onSelectPepper(pepper)}
            className="group text-left bg-[#f8f3eb] border border-[#5a4a3a]/25 hover:border-[#5a4a3a]/40 
              transition-all duration-200 hover:shadow-lg relative overflow-hidden"
          >
            {/* Decorative corner stamps */}
            <div className="absolute top-0 left-0 w-8 h-8 border-b border-r border-[#5a4a3a]/10" />
            <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-[#5a4a3a]/10" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r border-[#5a4a3a]/10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l border-[#5a4a3a]/10" />

            {/* In Stock Badge */}
            {pepper.inStock && (
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1 px-2 py-1 bg-[#2d5a3d] text-[#f5efe6] 
                  text-[10px] font-heading uppercase tracking-wider border border-[#2d5a3d]/80
                  shadow-sm">
                  <Package className="w-3 h-3" />
                  <span>In Stock</span>
                </div>
              </div>
            )}

            {/* Card Header - Variety Name */}
            <div className="px-4 pt-4 pb-3 border-b border-[#5a4a3a]/15 bg-[#e8dcc4]/40">
              <h3 className="font-display text-base uppercase tracking-[0.08em] text-[#3a2a1a] 
                group-hover:text-[#8b2942] transition-colors leading-tight pr-16">
                {pepper.name}
              </h3>
              <p className="font-body text-xs italic text-[#5a4a3a]/70 mt-1">
                {speciesDisplayNames[pepper.species] || pepper.scientificName}
              </p>
            </div>

            {/* Card Body - Ledger Lines */}
            <div className="px-4 py-3 space-y-2">
              {/* Provenance Row */}
              <div className="flex items-baseline justify-between border-b border-dotted border-[#5a4a3a]/20 pb-1">
                <span className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/50">
                  Provenance
                </span>
                <span className="font-body text-sm text-[#3a2a1a]">
                  {pepper.origin}, {pepper.region}
                </span>
              </div>

              {/* Pungency Row */}
              <div className="flex items-center justify-between border-b border-dotted border-[#5a4a3a]/20 pb-1">
                <span className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/50">
                  Pungency
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getHeatColor(pepper.heatLevel)}`} />
                  <span className="font-body text-sm text-[#3a2a1a]">
                    {pepper.heatLevel}
                  </span>
                </div>
              </div>

              {/* Scoville Row */}
              <div className="flex items-baseline justify-between border-b border-dotted border-[#5a4a3a]/20 pb-1">
                <span className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/50">
                  Scoville
                </span>
                <span className="font-body text-sm text-[#3a2a1a]">
                  {formatScoville(pepper.scovilleMin, pepper.scovilleMax)} <span className="text-[#5a4a3a]/50 text-xs">SHU</span>
                </span>
              </div>

              {/* Introduced Row */}
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/50">
                  Introduced
                </span>
                <span className="font-body text-sm text-[#3a2a1a]">
                  {formatYear(pepper.yearIntroduced)}
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-2 bg-[#e8dcc4]/30 border-t border-[#5a4a3a]/10 
              flex items-center justify-between">
              <span className="font-body text-[10px] italic text-[#5a4a3a]/50">
                View full record
              </span>
              <ChevronRight className="w-4 h-4 text-[#5a4a3a]/30 group-hover:text-[#8b2942] 
                transition-colors group-hover:translate-x-0.5 transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Registry Footer */}
      <div className="px-6 py-3 bg-[#f5efe6] border border-[#5a4a3a]/15 flex items-center justify-between">
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
