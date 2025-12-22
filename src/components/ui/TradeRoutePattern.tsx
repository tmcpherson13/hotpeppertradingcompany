import { cn } from '@/lib/utils';

interface TradeRoutePatternProps {
  className?: string;
  variant?: 'subtle' | 'accent' | 'tyrian';
  opacity?: number;
}

export function TradeRoutePattern({ 
  className, 
  variant = 'subtle',
  opacity = 0.1 
}: TradeRoutePatternProps) {
  const strokeColor = {
    subtle: 'hsl(var(--border))',
    accent: 'hsl(var(--gold-accent))',
    tyrian: 'hsl(var(--tyrian))',
  }[variant];

  return (
    <svg 
      className={cn("absolute pointer-events-none", className)} 
      style={{ opacity }}
      viewBox="0 0 400 300" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main trade route curves */}
      <path
        d="M0,150 Q80,100 150,120 T250,80 Q320,60 400,100"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray="8,6"
        strokeLinecap="round"
      />
      <path
        d="M0,200 Q100,180 180,200 T300,160 Q360,140 400,180"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="6,8"
        strokeLinecap="round"
      />
      <path
        d="M0,100 Q60,80 120,100 T200,70 Q280,50 320,80 T400,60"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeDasharray="4,6"
        strokeLinecap="round"
      />
      
      {/* Waypoint markers */}
      <circle cx="150" cy="120" r="4" fill={strokeColor} />
      <circle cx="250" cy="80" r="4" fill={strokeColor} />
      <circle cx="180" cy="200" r="3" fill={strokeColor} />
      <circle cx="300" cy="160" r="3" fill={strokeColor} />
      <circle cx="120" cy="100" r="2.5" fill={strokeColor} />
      <circle cx="200" cy="70" r="2.5" fill={strokeColor} />
    </svg>
  );
}

export function TradeRouteDivider({ 
  className,
  showWaypoints = true 
}: { 
  className?: string;
  showWaypoints?: boolean;
}) {
  return (
    <div className={cn("relative flex items-center justify-center py-4", className)}>
      <svg 
        className="w-full max-w-md h-8" 
        viewBox="0 0 400 32" 
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Route line */}
        <path
          d="M0,16 Q50,8 100,16 T200,16 T300,16 Q350,24 400,16"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
        
        {/* Tyrian accent overlay */}
        <path
          d="M120,16 Q150,10 180,16 T240,16 T280,16"
          fill="none"
          stroke="hsl(var(--tyrian))"
          strokeWidth="1.5"
          strokeDasharray="6,4"
          opacity="0.6"
        />
        
        {showWaypoints && (
          <>
            {/* Waypoint markers */}
            <circle cx="100" cy="16" r="2" fill="hsl(var(--border))" />
            <circle cx="200" cy="16" r="3" fill="hsl(var(--tyrian))" opacity="0.8" />
            <circle cx="300" cy="16" r="2" fill="hsl(var(--border))" />
            
            {/* Center compass star */}
            <polygon 
              points="200,10 202,14 206,14 203,17 204,21 200,18 196,21 197,17 194,14 198,14" 
              fill="hsl(var(--tyrian))" 
              opacity="0.7"
            />
          </>
        )}
      </svg>
    </div>
  );
}

export function CompassRose({ 
  className,
  size = 80,
  variant = 'subtle'
}: { 
  className?: string;
  size?: number;
  variant?: 'subtle' | 'tyrian';
}) {
  const color = variant === 'tyrian' ? 'hsl(var(--tyrian))' : 'currentColor';
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={cn("pointer-events-none", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circles */}
      <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="0.3" opacity="0.4" />
      
      {/* Cardinal direction lines */}
      <line x1="50" y1="5" x2="50" y2="20" stroke={color} strokeWidth="2" />
      <line x1="50" y1="80" x2="50" y2="95" stroke={color} strokeWidth="1" />
      <line x1="5" y1="50" x2="20" y2="50" stroke={color} strokeWidth="1" />
      <line x1="80" y1="50" x2="95" y2="50" stroke={color} strokeWidth="1" />
      
      {/* Ordinal lines */}
      <line x1="15" y1="15" x2="26" y2="26" stroke={color} strokeWidth="0.5" opacity="0.7" />
      <line x1="85" y1="15" x2="74" y2="26" stroke={color} strokeWidth="0.5" opacity="0.7" />
      <line x1="15" y1="85" x2="26" y2="74" stroke={color} strokeWidth="0.5" opacity="0.7" />
      <line x1="85" y1="85" x2="74" y2="74" stroke={color} strokeWidth="0.5" opacity="0.7" />
      
      {/* Center star */}
      <polygon 
        points="50,35 53,45 63,45 55,52 58,62 50,55 42,62 45,52 37,45 47,45" 
        fill={color} 
        opacity="0.8"
      />
      
      {/* N marker */}
      <text x="50" y="14" textAnchor="middle" fill={color} fontSize="6" fontFamily="serif" fontWeight="bold">N</text>
    </svg>
  );
}
