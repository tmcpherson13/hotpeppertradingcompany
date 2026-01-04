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
        {/* Cranium - wider dome with temporal narrowing */}
        <path d="
          M50 6
          C75 6 88 20 88 40
          C88 52 82 58 74 62
          L74 68
          C74 72 70 74 66 74
          L62 74 L62 80 L56 80 L56 74
          L44 74 L44 80 L38 80 L38 74
          L34 74
          C30 74 26 72 26 68
          L26 62
          C18 58 12 52 12 40
          C12 20 25 6 50 6
          Z
        " />
        
        {/* Left eye socket - larger */}
        <ellipse cx="34" cy="38" rx="12" ry="14" fill="black" />
        
        {/* Right eye socket - larger */}
        <ellipse cx="66" cy="38" rx="12" ry="14" fill="black" />
        
        {/* Nasal cavity - inverted heart shape */}
        <path d="M50 52 C45 52 42 56 42 60 L50 70 L58 60 C58 56 55 52 50 52 Z" fill="black" />
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
