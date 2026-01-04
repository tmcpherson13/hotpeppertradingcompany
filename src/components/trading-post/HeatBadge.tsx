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

// Color classes for each heat tier
const tierColors: Record<HeatTier, string> = {
  1: 'text-amber-500', // Gold
  2: 'text-amber-500', // Gold
  3: 'text-orange-500', // Orange
  4: 'text-red-600', // Red
  5: 'text-red-800', // Crimson
};

function SkullAndCrossbones({ className, tier }: { className?: string; tier: HeatTier }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} ${tierColors[tier]}`}
      fill="currentColor"
    >
      {/* Crossbones - rendered first (behind skull) */}
      {/* Left bone */}
      <ellipse cx="10" cy="82" rx="6" ry="5" />
      <ellipse cx="10" cy="92" rx="6" ry="5" />
      <ellipse cx="90" cy="8" rx="6" ry="5" />
      <ellipse cx="90" cy="18" rx="6" ry="5" />
      <path d="M15 87 L85 13" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      {/* Right bone */}
      <ellipse cx="90" cy="82" rx="6" ry="5" />
      <ellipse cx="90" cy="92" rx="6" ry="5" />
      <ellipse cx="10" cy="8" rx="6" ry="5" />
      <ellipse cx="10" cy="18" rx="6" ry="5" />
      <path d="M85 87 L15 13" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      
      {/* Skull - rendered on top */}
      {/* Main cranium - round shape */}
      <ellipse cx="50" cy="42" rx="32" ry="30" />
      {/* Lower jaw area - smooth continuation */}
      <ellipse cx="50" cy="58" rx="22" ry="14" />
      
      {/* Left eye socket - large oval */}
      <ellipse cx="38" cy="40" rx="10" ry="12" fill="black" />
      {/* Right eye socket - large oval */}
      <ellipse cx="62" cy="40" rx="10" ry="12" fill="black" />
      
      {/* Nasal cavity - heart/inverted triangle shape */}
      <path d="M50 52 L44 60 Q50 64 56 60 Z" fill="black" />
    </svg>
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
