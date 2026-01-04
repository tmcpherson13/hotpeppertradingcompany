import skullIcon from '@/assets/icons/skull-crossbones.png';

export type HeatTier = 1 | 2 | 3 | 4 | 5;

interface HeatBadgeProps {
  tier: HeatTier;
  className?: string;
}

const tierLabels: Record<HeatTier, string> = {
  1: 'Mild',
  2: 'Medium',
  3: 'Hot',
  4: 'Very Hot',
  5: 'Extreme',
};

// CSS filter values to colorize the black icon to match heat tiers
const tierFilters: Record<HeatTier, string> = {
  1: 'sepia(1) saturate(3) hue-rotate(10deg) brightness(0.9)', // Gold
  2: 'sepia(1) saturate(3) hue-rotate(10deg) brightness(0.9)', // Gold
  3: 'sepia(1) saturate(5) hue-rotate(350deg) brightness(0.95)', // Orange
  4: 'sepia(1) saturate(8) hue-rotate(330deg) brightness(0.8)', // Red
  5: 'sepia(1) saturate(10) hue-rotate(320deg) brightness(0.6)', // Crimson
};

function SkullAndCrossbones({ className, tier }: { className?: string; tier: HeatTier }) {
  return (
    <img 
      src={skullIcon} 
      alt="Heat level indicator" 
      className={className}
      style={{ filter: tierFilters[tier] }}
    />
  );
}

export function HeatBadge({ tier, className = '' }: HeatBadgeProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: tier }).map((_, i) => (
        <SkullAndCrossbones 
          key={i} 
          tier={tier}
          className="w-4 h-5" 
        />
      ))}
      <span className="text-[9px] uppercase tracking-wider text-parchment/70 font-heading ml-1">
        {tierLabels[tier]}
      </span>
    </div>
  );
}
