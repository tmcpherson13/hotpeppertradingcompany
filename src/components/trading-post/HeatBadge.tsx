import { Flame } from 'lucide-react';

export type HeatTier = 1 | 2 | 3 | 4;

interface HeatBadgeProps {
  tier: HeatTier;
  className?: string;
}

const tierLabels: Record<HeatTier, string> = {
  1: 'Mild',
  2: 'Medium',
  3: 'Hot',
  4: 'Extreme',
};

export function HeatBadge({ tier, className = '' }: HeatBadgeProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: tier }).map((_, i) => (
        <Flame
          key={i}
          className={`w-3 h-3 ${
            tier === 4 
              ? 'text-pepper-red fill-pepper-red' 
              : 'text-gold fill-gold/80'
          }`}
        />
      ))}
      <span className="text-[9px] uppercase tracking-wider text-parchment/70 font-heading ml-1">
        {tierLabels[tier]}
      </span>
    </div>
  );
}
