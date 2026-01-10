import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface HeatFilterProps {
  minShu: number;
  maxShu: number;
  onRangeChange: (range: [number, number] | null) => void;
}

const HEAT_LEVELS = [
  { label: 'Mild', min: 0, max: 2500, color: 'bg-green-600' },
  { label: 'Medium', min: 2500, max: 30000, color: 'bg-yellow-500' },
  { label: 'Hot', min: 30000, max: 100000, color: 'bg-orange-500' },
  { label: 'Very Hot', min: 100000, max: 350000, color: 'bg-red-500' },
  { label: 'Extreme', min: 350000, max: 2200000, color: 'bg-red-800' },
];

export function HeatFilter({ minShu, maxShu, onRangeChange }: HeatFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<[number, number]>([minShu, maxShu]);
  const [isFiltering, setIsFiltering] = useState(false);

  const formatShu = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const handleSliderChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setRange(newRange);
    setIsFiltering(true);
    onRangeChange(newRange);
  };

  const handleClear = () => {
    setRange([minShu, maxShu]);
    setIsFiltering(false);
    onRangeChange(null);
  };

  const handleQuickSelect = (min: number, max: number) => {
    const newRange: [number, number] = [min, Math.min(max, maxShu)];
    setRange(newRange);
    setIsFiltering(true);
    onRangeChange(newRange);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-3">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`
              font-heading uppercase tracking-wider text-xs
              bg-tyrian/20 border-tyrian/40 text-ink hover:bg-tyrian/30
              ${isFiltering ? 'bg-tyrian/40 border-gold/50' : ''}
            `}
          >
            <Flame className="w-3.5 h-3.5 mr-1.5 text-pepper-red" />
            Heat Level
            {isFiltering && (
              <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-[10px] bg-gold/20 text-gold">
                Active
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        {isFiltering && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-parchment/60 hover:text-parchment text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <CollapsibleContent className="mt-4">
        <div className="bg-ink/80 border border-tyrian/30 rounded-sm p-4 space-y-4">
          {/* Quick select badges */}
          <div className="flex flex-wrap gap-2">
            {HEAT_LEVELS.map((level) => (
              <Badge
                key={level.label}
                variant="outline"
                className={`
                  cursor-pointer transition-all text-xs font-heading uppercase tracking-wider
                  ${range[0] <= level.min && range[1] >= level.max
                    ? 'bg-tyrian/30 border-gold/50 text-parchment'
                    : 'border-parchment/20 text-parchment/60 hover:border-parchment/40'
                  }
                `}
                onClick={() => handleQuickSelect(level.min, level.max)}
              >
                <span className={`w-2 h-2 rounded-full mr-1.5 ${level.color}`} />
                {level.label}
              </Badge>
            ))}
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <Slider
              value={range}
              min={minShu}
              max={maxShu}
              step={1000}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-parchment/60 font-heading">
              <span>{formatShu(range[0])} SHU</span>
              <span>{formatShu(range[1])} SHU</span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
