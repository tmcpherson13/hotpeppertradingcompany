import React from 'react';

interface CartoucheBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'panel' | 'title';
}

export function CartoucheBorder({ children, className = '', variant = 'panel' }: CartoucheBorderProps) {
  if (variant === 'title') {
    return (
      <div className={`relative ${className}`}>
        {/* Decorative corner flourishes */}
        <svg className="absolute -top-1 -left-1 w-4 h-4" viewBox="0 0 20 20">
          <path d="M2,18 Q2,2 18,2" fill="none" stroke="#5a4a3a" strokeWidth="1" opacity="0.5" />
          <circle cx="2" cy="18" r="1.5" fill="#5a4a3a" opacity="0.4" />
        </svg>
        <svg className="absolute -top-1 -right-1 w-4 h-4" viewBox="0 0 20 20">
          <path d="M18,18 Q18,2 2,2" fill="none" stroke="#5a4a3a" strokeWidth="1" opacity="0.5" />
          <circle cx="18" cy="18" r="1.5" fill="#5a4a3a" opacity="0.4" />
        </svg>
        <svg className="absolute -bottom-1 -left-1 w-4 h-4" viewBox="0 0 20 20">
          <path d="M2,2 Q2,18 18,18" fill="none" stroke="#5a4a3a" strokeWidth="1" opacity="0.5" />
          <circle cx="2" cy="2" r="1.5" fill="#5a4a3a" opacity="0.4" />
        </svg>
        <svg className="absolute -bottom-1 -right-1 w-4 h-4" viewBox="0 0 20 20">
          <path d="M18,2 Q18,18 2,18" fill="none" stroke="#5a4a3a" strokeWidth="1" opacity="0.5" />
          <circle cx="18" cy="2" r="1.5" fill="#5a4a3a" opacity="0.4" />
        </svg>
        
        {/* Inner content */}
        <div className="border border-[#5a4a3a]/40 bg-[#e8dcc4]/95 px-4 py-2">
          <div className="border border-[#5a4a3a]/20 px-3 py-1.5">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Outer border with corner details */}
      <div className="absolute inset-0 border-2 border-[#5a4a3a]/30 pointer-events-none" />
      <div className="absolute inset-[3px] border border-[#5a4a3a]/20 pointer-events-none" />
      
      {/* Corner ornaments */}
      <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-[#5a4a3a]/50" />
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-[#5a4a3a]/50" />
      <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2 border-[#5a4a3a]/50" />
      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-[#5a4a3a]/50" />
      
      {/* Content */}
      <div className="relative bg-[#e8dcc4]/95 p-4">
        {children}
      </div>
    </div>
  );
}
