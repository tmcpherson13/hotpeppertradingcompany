import React from 'react';

export function CompassRose({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      style={{ filter: 'drop-shadow(0 1px 2px rgba(90,74,58,0.3))' }}
    >
      {/* Outer decorative ring */}
      <circle 
        cx="50" cy="50" r="46" 
        fill="none" 
        stroke="#5a4a3a" 
        strokeWidth="0.5" 
        opacity="0.4"
      />
      <circle 
        cx="50" cy="50" r="42" 
        fill="none" 
        stroke="#5a4a3a" 
        strokeWidth="0.3" 
        opacity="0.3"
      />
      
      {/* Degree markers */}
      {[...Array(32)].map((_, i) => {
        const angle = (i * 360) / 32;
        const isCardinal = i % 8 === 0;
        const isIntercardinal = i % 4 === 0 && !isCardinal;
        const length = isCardinal ? 8 : isIntercardinal ? 5 : 3;
        const x1 = 50 + Math.sin((angle * Math.PI) / 180) * (42 - length);
        const y1 = 50 - Math.cos((angle * Math.PI) / 180) * (42 - length);
        const x2 = 50 + Math.sin((angle * Math.PI) / 180) * 42;
        const y2 = 50 - Math.cos((angle * Math.PI) / 180) * 42;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#5a4a3a"
            strokeWidth={isCardinal ? 0.8 : 0.4}
            opacity={isCardinal ? 0.6 : 0.35}
          />
        );
      })}
      
      {/* Main compass star - North pointer (dark) */}
      <polygon
        points="50,8 53,45 50,38 47,45"
        fill="#3a2a1a"
        opacity="0.8"
      />
      
      {/* South pointer (light) */}
      <polygon
        points="50,92 53,55 50,62 47,55"
        fill="#a08060"
        opacity="0.6"
      />
      
      {/* East pointer */}
      <polygon
        points="92,50 55,53 62,50 55,47"
        fill="#8a7a5a"
        opacity="0.5"
      />
      
      {/* West pointer */}
      <polygon
        points="8,50 45,53 38,50 45,47"
        fill="#8a7a5a"
        opacity="0.5"
      />
      
      {/* Intercardinal points - NE */}
      <polygon
        points="79,21 57,43 52,48 43,57"
        fill="none"
        stroke="#6a5a4a"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <line x1="50" y1="50" x2="75" y2="25" stroke="#6a5a4a" strokeWidth="0.8" opacity="0.4" />
      
      {/* NW */}
      <line x1="50" y1="50" x2="25" y2="25" stroke="#6a5a4a" strokeWidth="0.8" opacity="0.4" />
      
      {/* SE */}
      <line x1="50" y1="50" x2="75" y2="75" stroke="#6a5a4a" strokeWidth="0.8" opacity="0.4" />
      
      {/* SW */}
      <line x1="50" y1="50" x2="25" y2="75" stroke="#6a5a4a" strokeWidth="0.8" opacity="0.4" />
      
      {/* Center decoration */}
      <circle cx="50" cy="50" r="6" fill="#e8dcc4" stroke="#5a4a3a" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="3" fill="#5a4a3a" opacity="0.4" />
      <circle cx="50" cy="50" r="1.5" fill="#d4a84b" opacity="0.6" />
      
      {/* Cardinal direction labels */}
      <text x="50" y="20" textAnchor="middle" fontSize="6" fontFamily="serif" fontStyle="italic" fill="#3a2a1a" opacity="0.7">N</text>
      <text x="50" y="86" textAnchor="middle" fontSize="5" fontFamily="serif" fontStyle="italic" fill="#5a4a3a" opacity="0.5">S</text>
      <text x="84" y="52" textAnchor="middle" fontSize="5" fontFamily="serif" fontStyle="italic" fill="#5a4a3a" opacity="0.5">E</text>
      <text x="16" y="52" textAnchor="middle" fontSize="5" fontFamily="serif" fontStyle="italic" fill="#5a4a3a" opacity="0.5">W</text>
    </svg>
  );
}
