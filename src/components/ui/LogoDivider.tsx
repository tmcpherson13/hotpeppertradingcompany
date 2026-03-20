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
  sm: { logo: 'w-16 h-16', line: 'w-20', gap: 'gap-4' },
  md: { logo: 'w-24 h-24', line: 'w-28', gap: 'gap-5' },
  lg: { logo: 'w-32 h-32', line: 'w-36', gap: 'gap-6' },
};

export const LogoDivider = ({ variant = 'standard', size = 'md', className }: LogoDividerProps) => {
  const config = sizeConfig[size];

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <img src={logoDark} alt="" className={cn(config.logo, "object-contain opacity-80")} />
      </div>
    );
  }

  if (variant === 'standard') {
    return (
      <div className={cn("flex items-center justify-center", config.gap, className)}>
        <div className={cn("h-px bg-gradient-to-r from-transparent to-primary/40", config.line)} />
        <img src={logoDark} alt="" className={cn(config.logo, "object-contain opacity-80")} />
        <div className={cn("h-px bg-gradient-to-l from-transparent to-primary/40", config.line)} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", config.gap, className)}>
      <div className={cn("h-px bg-gradient-to-r from-transparent to-primary/40", config.line)} />
      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
      <img src={logoDark} alt="" className={cn(config.logo, "object-contain opacity-80")} />
      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
      <div className={cn("h-px bg-gradient-to-l from-transparent to-primary/40", config.line)} />
    </div>
  );
};