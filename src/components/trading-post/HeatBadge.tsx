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

const tierColors: Record<HeatTier, string> = {
  1: 'text-gold',
  2: 'text-gold',
  3: 'text-orange-500',
  4: 'text-pepper-red',
  5: 'text-red-900',
};

// Custom Skull & Crossbones SVG component - realistic maritime danger aesthetic
function SkullAndCrossbones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 36" fill="none" className={className}>
      {/* Skull cranium - more anatomical shape */}
      <path 
        d="M16 2C9 2 4 7 4 14C4 18 6 21 9 23L8 26H24L23 23C26 21 28 18 28 14C28 7 23 2 16 2Z" 
        stroke="currentColor" 
        strokeWidth="1.5"
        fill="currentColor" 
        fillOpacity="0.15" 
      />
      {/* Cheekbones / temporal area */}
      <path 
        d="M6 15C6 15 4 16 4 18C4 19.5 5.5 21 8 22" 
        stroke="currentColor" 
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path 
        d="M26 15C26 15 28 16 28 18C28 19.5 26.5 21 24 22" 
        stroke="currentColor" 
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Left eye socket - deep orbital */}
      <ellipse cx="11" cy="12" rx="3" ry="3.5" fill="currentColor" />
      <ellipse cx="11" cy="11.5" rx="1.5" ry="2" fill="currentColor" fillOpacity="0.3" />
      {/* Right eye socket - deep orbital */}
      <ellipse cx="21" cy="12" rx="3" ry="3.5" fill="currentColor" />
      <ellipse cx="21" cy="11.5" rx="1.5" ry="2" fill="currentColor" fillOpacity="0.3" />
      {/* Nasal cavity - triangular aperture */}
      <path 
        d="M16 15L13.5 20L16 19L18.5 20L16 15Z" 
        fill="currentColor"
      />
      {/* Maxilla (upper jaw) ridge */}
      <path 
        d="M10 22H22" 
        stroke="currentColor" 
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Teeth - more anatomical */}
      <rect x="10" y="23" width="2" height="3" rx="0.5" fill="currentColor" />
      <rect x="13" y="23" width="2" height="3.5" rx="0.5" fill="currentColor" />
      <rect x="17" y="23" width="2" height="3.5" rx="0.5" fill="currentColor" />
      <rect x="20" y="23" width="2" height="3" rx="0.5" fill="currentColor" />
      
      {/* Crossbones - thicker with proper bone ends */}
      {/* Left-to-right bone */}
      <path 
        d="M4 29L28 33" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Right-to-left bone */}
      <path 
        d="M4 33L28 29" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Bone end knobs - epiphyses */}
      <circle cx="4" cy="29" r="2" fill="currentColor" />
      <circle cx="28" cy="33" r="2" fill="currentColor" />
      <circle cx="4" cy="33" r="2" fill="currentColor" />
      <circle cx="28" cy="29" r="2" fill="currentColor" />
      {/* Secondary knobs for realism */}
      <circle cx="5.5" cy="28" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="26.5" cy="34" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="5.5" cy="34" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="26.5" cy="28" r="1.2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function HeatBadge({ tier, className = '' }: HeatBadgeProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: tier }).map((_, i) => (
        <SkullAndCrossbones 
          key={i} 
          className={`w-4 h-5 ${tierColors[tier]}`} 
        />
      ))}
      <span className="text-[9px] uppercase tracking-wider text-parchment/70 font-heading ml-1">
        {tierLabels[tier]}
      </span>
    </div>
  );
}
