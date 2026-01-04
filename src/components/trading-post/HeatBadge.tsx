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

// Custom Skull & Crossbones SVG component - clean anatomical maritime design
function SkullAndCrossbones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Crossbones behind skull */}
      <path 
        d="M3 19L21 5" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      <path 
        d="M3 5L21 19" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Bone end knobs */}
      <circle cx="3" cy="19" r="1.8" fill="currentColor" />
      <circle cx="21" cy="5" r="1.8" fill="currentColor" />
      <circle cx="3" cy="5" r="1.8" fill="currentColor" />
      <circle cx="21" cy="19" r="1.8" fill="currentColor" />
      
      {/* Skull cranium */}
      <ellipse 
        cx="12" 
        cy="9" 
        rx="7" 
        ry="6.5" 
        fill="currentColor" 
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Eye sockets */}
      <circle cx="9" cy="8" r="2" fill="currentColor" />
      <circle cx="15" cy="8" r="2" fill="currentColor" />
      
      {/* Nasal cavity - heart/triangle shape */}
      <path 
        d="M12 11L10.5 14L12 13.5L13.5 14L12 11Z" 
        fill="currentColor"
      />
      
      {/* Jaw area */}
      <path 
        d="M7 14C7 14 9 16 12 16C15 16 17 14 17 14" 
        stroke="currentColor" 
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
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
