import { cn } from '@/lib/utils';
import logoDark from '@/assets/logo-dark.svg';

type LogoDividerVariant = 'minimal' | 'standard' | 'ornate';
type LogoDividerSize = 'sm' | 'md' | 'lg';

interface LogoDividerProps {
  variant?: LogoDividerVariant;
  size?: LogoDividerSize;
  className?: string;
}

const sizeConfig = {
  sm: { logo: 'w-6 h-6', line: 'w-8', gap: 'gap-2' },
  md: { logo: 'w-8 h-8', line: 'w-12', gap: 'gap-3' },
  lg: { logo: 'w-12 h-12', line: 'w-16', gap: 'gap-4' },
};

/**
 * LogoDivider component - A decorative divider using the company logo.
 * Replaces generic dividers (diamonds, circles, stars) with branded elements.
 * 
 * Variants:
 * - minimal: Logo only
 * - standard: Logo with gradient lines on both sides
 * - ornate: Logo with gradient lines and decorative dots
 */
export const LogoDivider = ({ 
  variant = 'standard', 
  size = 'md',
  className 
}: LogoDividerProps) => {
  const config = sizeConfig[size];

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <img 
          src={logoDark} 
          alt="" 
          className={cn(config.logo, "object-contain opacity-60")} 
        />
      </div>
    );
  }

  if (variant === 'standard') {
    return (
      <div className={cn("flex items-center justify-center", config.gap, className)}>
        <div className={cn("h-px bg-gradient-to-r from-transparent to-primary/40", config.line)} />
        <img 
          src={logoDark} 
          alt="" 
          className={cn(config.logo, "object-contain opacity-60")} 
        />
        <div className={cn("h-px bg-gradient-to-l from-transparent to-primary/40", config.line)} />
      </div>
    );
  }

  // ornate variant
  return (
    <div className={cn("flex items-center justify-center", config.gap, className)}>
      <div className={cn("h-px bg-gradient-to-r from-transparent to-primary/40", config.line)} />
      <span className="w-1 h-1 rounded-full bg-primary/50" />
      <img 
        src={logoDark} 
        alt="" 
        className={cn(config.logo, "object-contain opacity-60")} 
      />
      <span className="w-1 h-1 rounded-full bg-primary/50" />
      <div className={cn("h-px bg-gradient-to-l from-transparent to-primary/40", config.line)} />
    </div>
  );
};
