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
      {/* Crossbones - behind skull */}
      <g>
        {/* Bone 1: top-left to bottom-right */}
        <ellipse cx="8" cy="12" rx="5" ry="4" />
        <ellipse cx="8" cy="20" rx="5" ry="4" />
        <path d="M13 16 L87 84" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="92" cy="80" rx="5" ry="4" />
        <ellipse cx="92" cy="88" rx="5" ry="4" />
        
        {/* Bone 2: top-right to bottom-left */}
        <ellipse cx="92" cy="12" rx="5" ry="4" />
        <ellipse cx="92" cy="20" rx="5" ry="4" />
        <path d="M87 16 L13 84" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="8" cy="80" rx="5" ry="4" />
        <ellipse cx="8" cy="88" rx="5" ry="4" />
      </g>
      
      {/* Skull */}
      <g>
        {/* Cranium - dome with temporal narrowing */}
        <path d="
          M50 8
          C72 8 82 20 82 38
          C82 48 78 55 72 60
          L72 66
          C72 70 68 72 64 72
          L60 72 L60 78 L56 78 L56 72
          L44 72 L44 78 L40 78 L40 72
          L36 72
          C32 72 28 70 28 66
          L28 60
          C22 55 18 48 18 38
          C18 20 28 8 50 8
          Z
        " />
        
        {/* Left eye socket */}
        <ellipse cx="36" cy="38" rx="9" ry="11" fill="black" />
        
        {/* Right eye socket */}
        <ellipse cx="64" cy="38" rx="9" ry="11" fill="black" />
        
        {/* Nasal cavity - inverted heart shape */}
        <path d="M50 50 C46 50 44 54 44 58 L50 66 L56 58 C56 54 54 50 50 50 Z" fill="black" />
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
