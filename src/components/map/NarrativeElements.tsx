import React from 'react';

// Sailing ship silhouette for trade route visualization
export function ShipSilhouette({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 40" className={className} style={style}>
      {/* Hull */}
      <path 
        d="M5,30 Q10,35 30,35 Q50,35 55,30 L50,28 Q30,32 10,28 Z" 
        fill="#5a4a3a" 
        opacity="0.25"
      />
      {/* Main mast */}
      <line x1="30" y1="30" x2="30" y2="8" stroke="#5a4a3a" strokeWidth="1" opacity="0.3" />
      {/* Main sail */}
      <path 
        d="M30,10 Q40,15 38,25 L30,25 Z" 
        fill="#5a4a3a" 
        opacity="0.15"
      />
      {/* Fore mast */}
      <line x1="18" y1="30" x2="18" y2="14" stroke="#5a4a3a" strokeWidth="0.8" opacity="0.25" />
      {/* Fore sail */}
      <path 
        d="M18,15 Q26,18 24,24 L18,24 Z" 
        fill="#5a4a3a" 
        opacity="0.12"
      />
      {/* Flag */}
      <path 
        d="M30,8 L30,5 L36,6.5 L30,8" 
        fill="#8b2942" 
        opacity="0.3"
      />
    </svg>
  );
}

// Sea creature for oceanic decoration
export function SeaCreature({ className = '', variant = 'serpent' }: { className?: string; variant?: 'serpent' | 'whale' }) {
  if (variant === 'whale') {
    return (
      <svg viewBox="0 0 50 25" className={className}>
        <path 
          d="M5,15 Q10,8 20,10 Q35,8 45,12 Q48,15 45,18 Q30,22 15,20 Q8,20 5,15 M45,10 Q48,8 50,10" 
          fill="none" 
          stroke="#5a4a3a" 
          strokeWidth="0.8" 
          opacity="0.15"
        />
        {/* Spout */}
        <path 
          d="M42,8 Q44,4 43,2 M44,8 Q46,5 45,3" 
          fill="none" 
          stroke="#5a4a3a" 
          strokeWidth="0.5" 
          opacity="0.1"
        />
      </svg>
    );
  }
  
  return (
    <svg viewBox="0 0 80 30" className={className}>
      {/* Serpent body waves */}
      <path 
        d="M5,20 Q15,10 25,18 Q35,26 45,15 Q55,5 65,15 Q72,22 78,18" 
        fill="none" 
        stroke="#5a4a3a" 
        strokeWidth="1.2" 
        opacity="0.12"
        strokeLinecap="round"
      />
      {/* Head */}
      <circle cx="78" cy="18" r="3" fill="#5a4a3a" opacity="0.1" />
      {/* Eye */}
      <circle cx="79" cy="17" r="0.8" fill="#5a4a3a" opacity="0.15" />
    </svg>
  );
}

// Wind rose / wind head decoration
export function WindHead({ className = '', direction = 'east' }: { className?: string; direction?: 'east' | 'west' }) {
  const transform = direction === 'west' ? 'scale(-1, 1)' : '';
  
  return (
    <svg viewBox="0 0 40 30" className={className} style={{ transform }}>
      {/* Cherub/wind face */}
      <circle cx="12" cy="15" r="8" fill="#5a4a3a" opacity="0.08" />
      {/* Cheeks puffed */}
      <ellipse cx="10" cy="16" rx="3" ry="2.5" fill="#5a4a3a" opacity="0.06" />
      {/* Wind streams */}
      <path 
        d="M18,14 Q25,12 32,14 Q38,13 40,14" 
        fill="none" 
        stroke="#5a4a3a" 
        strokeWidth="1" 
        opacity="0.1"
      />
      <path 
        d="M18,16 Q26,18 34,15 Q38,16 40,15" 
        fill="none" 
        stroke="#5a4a3a" 
        strokeWidth="0.8" 
        opacity="0.08"
      />
      <path 
        d="M17,18 Q24,20 30,18" 
        fill="none" 
        stroke="#5a4a3a" 
        strokeWidth="0.6" 
        opacity="0.06"
      />
    </svg>
  );
}

// Aged paper stains and marks
export function AgedPaperOverlay({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Coffee/tea stain marks */}
      <div 
        className="absolute"
        style={{
          top: '15%',
          right: '20%',
          width: '120px',
          height: '100px',
          background: 'radial-gradient(ellipse at center, rgba(139, 90, 43, 0.04) 0%, rgba(139, 90, 43, 0.02) 40%, transparent 70%)',
          borderRadius: '50%',
          transform: 'rotate(-15deg)',
        }}
      />
      <div 
        className="absolute"
        style={{
          bottom: '25%',
          left: '10%',
          width: '80px',
          height: '70px',
          background: 'radial-gradient(ellipse at center, rgba(90, 74, 58, 0.03) 0%, transparent 60%)',
          borderRadius: '50%',
        }}
      />
      
      {/* Fold crease marks */}
      <div 
        className="absolute left-1/2 top-0 bottom-0 w-px opacity-[0.04]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #5a4a3a 20%, #5a4a3a 80%, transparent 100%)',
        }}
      />
      
      {/* Edge wear/foxing */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 opacity-[0.03]"
        style={{
          background: 'linear-gradient(to bottom, rgba(90, 74, 58, 0.5), transparent)',
        }}
      />
    </div>
  );
}

// Narrative annotation text
export function NarrativeAnnotation({ 
  text, 
  className = '',
  style = {}
}: { 
  text: string; 
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div 
      className={`font-body italic text-[10px] text-[#5a4a3a]/40 tracking-wide ${className}`}
      style={{
        fontFamily: 'Georgia, serif',
        ...style,
      }}
    >
      {text}
    </div>
  );
}
