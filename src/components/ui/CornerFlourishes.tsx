import { motion, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

type CornerFlourishesVariant = 'simple' | 'ornate';
type CornerFlourishesSize = 'sm' | 'md' | 'lg';

interface CornerFlourishesProps {
  variant?: CornerFlourishesVariant;
  size?: CornerFlourishesSize;
  animated?: boolean;
  className?: string;
  scrollOpacity?: MotionValue<number>;
}

const sizeConfig = {
  sm: { wrapper: 'w-16 h-16', viewBox: '0 0 60 60' },
  md: { wrapper: 'w-24 h-24', viewBox: '0 0 80 80' },
  lg: { wrapper: 'w-32 h-32', viewBox: '0 0 100 100' },
};

/**
 * CornerFlourishes component - Decorative corner elements for sections.
 * 
 * Variants:
 * - simple: L-shaped corners with dots (lighter, for product sections)
 * - ornate: Curved flourishes with multiple layers (for decorative sections)
 */
export const CornerFlourishes = ({
  variant = 'ornate',
  size = 'md',
  animated = true,
  className,
  scrollOpacity,
}: CornerFlourishesProps) => {
  const config = sizeConfig[size];

  if (variant === 'simple') {
    return (
      <>
        {/* Top Left */}
        <motion.div
          className={cn("absolute top-8 left-8 opacity-20 pointer-events-none hidden md:block", config.wrapper, className)}
          style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <path d="M5 5 L5 40 M5 5 L40 5" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="3" fill="currentColor" />
            <path d="M10 10 Q25 10 25 25" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Top Right */}
        <motion.div
          className={cn("absolute top-8 right-8 opacity-20 rotate-90 pointer-events-none hidden md:block", config.wrapper, className)}
          style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <path d="M5 5 L5 40 M5 5 L40 5" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="3" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Bottom Left */}
        <motion.div
          className={cn("absolute bottom-8 left-8 opacity-20 -rotate-90 pointer-events-none hidden md:block", config.wrapper, className)}
          style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <path d="M5 5 L5 40 M5 5 L40 5" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="3" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Bottom Right */}
        <motion.div
          className={cn("absolute bottom-8 right-8 opacity-20 rotate-180 pointer-events-none hidden md:block", config.wrapper, className)}
          style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
            <path d="M5 5 L5 40 M5 5 L40 5" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="3" fill="currentColor" />
          </svg>
        </motion.div>
      </>
    );
  }

  // Ornate variant
  const animationProps = animated
    ? {
        animate: { rotate: [0, 1, -1, 0] },
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  return (
    <>
      {/* Top Left */}
      <motion.div
        className={cn("absolute top-8 left-8 opacity-15 pointer-events-none hidden md:block", className)}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
      >
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="text-foreground"
          {...animationProps}
        >
          <path d="M0,80 Q20,60 40,60 Q60,60 60,40 Q60,20 80,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0,65 Q15,50 32,50 Q50,50 50,32 Q50,15 65,0" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <path d="M0,50 Q10,40 25,40 Q40,40 40,25 Q40,10 50,0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.4" />
        </motion.svg>
      </motion.div>

      {/* Top Right */}
      <motion.div
        className={cn("absolute top-8 right-8 opacity-15 pointer-events-none hidden md:block", className)}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
      >
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="text-foreground"
          style={{ transform: 'scaleX(-1)' }}
          {...(animated ? { animate: { rotate: [0, -1, 1, 0] }, transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 } } : {})}
        >
          <path d="M0,80 Q20,60 40,60 Q60,60 60,40 Q60,20 80,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0,65 Q15,50 32,50 Q50,50 50,32 Q50,15 65,0" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <path d="M0,50 Q10,40 25,40 Q40,40 40,25 Q40,10 50,0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.4" />
        </motion.svg>
      </motion.div>

      {/* Bottom Left */}
      <motion.div
        className={cn("absolute bottom-8 left-8 opacity-15 pointer-events-none hidden md:block", className)}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
      >
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="text-foreground"
          style={{ transform: 'scaleY(-1)' }}
          {...(animated ? { animate: { rotate: [0, 1, -1, 0] }, transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 1 } } : {})}
        >
          <path d="M0,80 Q20,60 40,60 Q60,60 60,40 Q60,20 80,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0,65 Q15,50 32,50 Q50,50 50,32 Q50,15 65,0" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <path d="M0,50 Q10,40 25,40 Q40,40 40,25 Q40,10 50,0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.4" />
        </motion.svg>
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        className={cn("absolute bottom-8 right-8 opacity-15 pointer-events-none hidden md:block", className)}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
      >
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="text-foreground"
          style={{ transform: 'scale(-1, -1)' }}
          {...(animated ? { animate: { rotate: [0, -1, 1, 0] }, transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const, delay: 1.5 } } : {})}
        >
          <path d="M0,80 Q20,60 40,60 Q60,60 60,40 Q60,20 80,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0,65 Q15,50 32,50 Q50,50 50,32 Q50,15 65,0" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <path d="M0,50 Q10,40 25,40 Q40,40 40,25 Q40,10 50,0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.4" />
        </motion.svg>
      </motion.div>
    </>
  );
};
