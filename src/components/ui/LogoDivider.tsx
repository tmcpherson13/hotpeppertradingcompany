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
  sm: { logo: 'w-12 h-12', line: 'w-16', gap: 'gap-3' },
  md: { logo: 'w-16 h-16', line: 'w-20', gap: 'gap-4' },
  lg: { logo: 'w-24 h-24', line: 'w-28', gap: 'gap-5' },
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
