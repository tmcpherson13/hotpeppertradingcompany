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
        {/* Cranium - smoother dome with cheekbones */}
        <path d="
          M50 5
          C78 5 90 22 90 42
          C90 54 84 62 76 66
          C76 68 76 70 74 72
          L68 72 L68 80 L62 80 L62 72
          L56 72 L56 80 L50 80 L50 72
          L44 72 L44 80 L38 80 L38 72
          L32 72
          C30 70 26 68 26 66
          C18 62 10 54 10 42
          C10 22 22 5 50 5
          Z
        " />
        
        {/* Left eye socket - large oval */}
        <ellipse cx="32" cy="36" rx="13" ry="15" fill="black" />
        
        {/* Right eye socket - large oval */}
        <ellipse cx="68" cy="36" rx="13" ry="15" fill="black" />
        
        {/* Nasal cavity - classic inverted heart */}
        <path d="M50 54 C44 54 40 58 40 64 L50 76 L60 64 C60 58 56 54 50 54 Z" fill="black" />
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
