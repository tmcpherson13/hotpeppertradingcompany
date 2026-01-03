import { ChevronDown } from 'lucide-react';

interface ScrollDownIndicatorProps {
  className?: string;
}

export function ScrollDownIndicator({ className = '' }: ScrollDownIndicatorProps) {
  return (
    <div 
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none ${className}`}
    >
      <div className="flex flex-col items-center gap-1 animate-bounce">
        <span className="text-[10px] uppercase tracking-wider text-ink/50 font-heading">
          More below
        </span>
        <div className="p-2 rounded-full bg-parchment/90 border border-ink/20 shadow-sm">
          <ChevronDown className="h-4 w-4 text-ink/60" />
        </div>
      </div>
    </div>
  );
}
