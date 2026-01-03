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

// Custom Skull & Crossbones SVG component
function SkullAndCrossbones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 28" fill="none" className={className} strokeWidth="1.5">
      {/* Skull */}
      <ellipse cx="12" cy="10" rx="7" ry="8" stroke="currentColor" fill="currentColor" fillOpacity="0.2" />
      {/* Eye sockets */}
      <ellipse cx="9" cy="9" rx="2" ry="2.5" fill="currentColor" />
      <ellipse cx="15" cy="9" rx="2" ry="2.5" fill="currentColor" />
      {/* Nose */}
      <path d="M12 12 L11 14 L13 14 Z" fill="currentColor" />
      {/* Teeth */}
      <path d="M9 16 L9 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M11 16 L11 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M13 16 L13 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M15 16 L15 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Crossbones */}
      <path d="M4 22 L20 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 26 L20 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Bone ends */}
      <circle cx="4" cy="22" r="1.5" fill="currentColor" />
      <circle cx="20" cy="26" r="1.5" fill="currentColor" />
      <circle cx="4" cy="26" r="1.5" fill="currentColor" />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
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
