import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pepper } from '@/data/peppers';
import { Flame, MapPin, Calendar, Ship } from 'lucide-react';

interface PepperDetailModalProps {
  pepper: Pepper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getHeatColor = (level: string) => {
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
  if (min === max) return min.toLocaleString();
  return `${min.toLocaleString()} – ${max.toLocaleString()}`;
};

const formatYear = (year: number) => {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
};

export function PepperDetailModal({ pepper, open, onOpenChange }: PepperDetailModalProps) {
  if (!pepper) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#f5efe6] border-2 border-[#5a4a3a]/30 p-0 overflow-hidden">
        {/* Header with parchment styling */}
        <div className="bg-[#e8dcc4] px-6 py-5 border-b border-[#5a4a3a]/20 relative">
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#5a4a3a]/30" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#5a4a3a]/30" />
          
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#5a4a3a]/60">
                Registry Entry
              </span>
              <span className="h-px flex-1 bg-[#5a4a3a]/20" />
              <span className="font-body text-xs text-[#5a4a3a]/60 italic">
                {pepper.id.toUpperCase()}
              </span>
            </div>
            <DialogTitle className="font-display text-2xl uppercase tracking-[0.1em] text-[#3a2a1a]">
              {pepper.name}
            </DialogTitle>
            <p className="font-body text-sm italic text-[#5a4a3a]">
              {pepper.scientificName}
            </p>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Quick facts grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#e8dcc4]/50 border border-[#5a4a3a]/10">
              <Flame className={`w-5 h-5 mx-auto mb-1 ${getHeatColor(pepper.heatLevel)}`} />
              <p className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60">Pungency</p>
              <p className={`font-body text-sm font-medium ${getHeatColor(pepper.heatLevel)}`}>
                {pepper.heatLevel}
              </p>
            </div>
            <div className="text-center p-3 bg-[#e8dcc4]/50 border border-[#5a4a3a]/10">
              <MapPin className="w-5 h-5 mx-auto mb-1 text-[#8b2942]" />
              <p className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60">Origin</p>
              <p className="font-body text-sm font-medium text-[#3a2a1a]">{pepper.origin}</p>
            </div>
            <div className="text-center p-3 bg-[#e8dcc4]/50 border border-[#5a4a3a]/10">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-[#d4a84b]" />
              <p className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60">Introduced</p>
              <p className="font-body text-sm font-medium text-[#3a2a1a]">{formatYear(pepper.yearIntroduced)}</p>
            </div>
            <div className="text-center p-3 bg-[#e8dcc4]/50 border border-[#5a4a3a]/10">
              <Ship className="w-5 h-5 mx-auto mb-1 text-[#4a7c59]" />
              <p className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60">Region</p>
              <p className="font-body text-sm font-medium text-[#3a2a1a]">{pepper.region}</p>
            </div>
          </div>

          {/* Scoville */}
          <div className="border-t border-b border-[#5a4a3a]/15 py-4">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60">
                Scoville Heat Units
              </span>
              <span className="font-display text-lg text-[#3a2a1a]">
                {formatScoville(pepper.scovilleMin, pepper.scovilleMax)} SHU
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
              Historical Account
            </h4>
            <p className="font-body text-sm leading-relaxed text-[#3a2a1a]">
              {pepper.description}
            </p>
          </div>

          {/* Trade Route */}
          <div className="bg-[#e8dcc4]/30 p-4 border border-[#5a4a3a]/10">
            <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
              Trade Passage
            </h4>
            <p className="font-body text-sm italic text-[#5a4a3a]">
              {pepper.tradeRoute}
            </p>
          </div>

          {/* Flavor & Culinary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
                Flavor Character
              </h4>
              <div className="flex flex-wrap gap-2">
                {pepper.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2 py-1 text-xs font-body bg-[#e8dcc4] border border-[#5a4a3a]/20 text-[#3a2a1a]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
                Culinary Applications
              </h4>
              <div className="flex flex-wrap gap-2">
                {pepper.culinaryUses.map((use) => (
                  <span
                    key={use}
                    className="px-2 py-1 text-xs font-body bg-[#d4a84b]/10 border border-[#d4a84b]/30 text-[#3a2a1a]"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#e8dcc4]/50 px-6 py-3 border-t border-[#5a4a3a]/15 flex items-center justify-between">
          <span className="font-body text-[10px] text-[#5a4a3a]/50 italic">
            Catalogued by the Hot Pepper Trading Company
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-1.5 text-xs font-heading uppercase tracking-wider border border-[#5a4a3a]/30 text-[#5a4a3a] hover:bg-[#5a4a3a]/10 transition-colors"
          >
            Close Registry
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
