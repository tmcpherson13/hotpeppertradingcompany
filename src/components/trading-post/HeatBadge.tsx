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
      {/* Skull */}
      <ellipse cx="50" cy="35" rx="28" ry="25" />
      {/* Jaw */}
      <path d="M30 45 Q30 65 40 65 L40 55 L45 55 L45 65 L55 65 L55 55 L60 55 L60 65 L70 65 Q70 45 70 45" />
      {/* Left eye socket */}
      <ellipse cx="40" cy="32" rx="8" ry="9" fill="black" />
      {/* Right eye socket */}
      <ellipse cx="60" cy="32" rx="8" ry="9" fill="black" />
      {/* Nose */}
      <path d="M47 42 L50 50 L53 42 Z" fill="black" />
      {/* Crossbones */}
      <path d="M10 75 Q5 70 10 65 L85 20 Q95 15 95 25 Q95 30 90 30 L18 73 Q13 78 10 75 Z" />
      <path d="M90 75 Q95 70 90 65 L15 20 Q5 15 5 25 Q5 30 10 30 L82 73 Q87 78 90 75 Z" />
      {/* Bone ends */}
      <circle cx="8" cy="70" r="6" />
      <circle cx="8" cy="22" r="6" />
      <circle cx="92" cy="70" r="6" />
      <circle cx="92" cy="22" r="6" />
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
