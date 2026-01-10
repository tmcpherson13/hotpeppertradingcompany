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
      viewBox="0 0 100 110" 
      className={`${className} ${tierColors[tier]}`}
      fill="currentColor"
    >
      {/* Skull */}
      <path d="
        M50 2
        C25 2 12 18 12 38
        C12 52 18 62 28 68
        L28 78
        L36 78 L36 72
        L44 72 L44 78
        L56 78 L56 72
        L64 72 L64 78
        L72 78
        L72 68
        C82 62 88 52 88 38
        C88 18 75 2 50 2
        Z
      " />
      
      {/* Left eye socket */}
      <ellipse cx="35" cy="38" rx="10" ry="12" fill="black" />
      
      {/* Right eye socket */}
      <ellipse cx="65" cy="38" rx="10" ry="12" fill="black" />
      
      {/* Nasal cavity - triangular */}
      <path d="M50 52 L42 66 L58 66 Z" fill="black" />
      
      {/* Crossbones - below skull */}
      <g transform="translate(0, 10)">
        {/* Bone 1: top-left to bottom-right */}
        <ellipse cx="12" cy="72" rx="6" ry="5" />
        <ellipse cx="12" cy="80" rx="6" ry="5" />
        <path d="M18 76 L82 100" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="88" cy="96" rx="6" ry="5" />
        <ellipse cx="88" cy="104" rx="6" ry="5" />
        
        {/* Bone 2: top-right to bottom-left */}
        <ellipse cx="88" cy="72" rx="6" ry="5" />
        <ellipse cx="88" cy="80" rx="6" ry="5" />
        <path d="M82 76 L18 100" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="12" cy="96" rx="6" ry="5" />
        <ellipse cx="12" cy="104" rx="6" ry="5" />
      </g>
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
