import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DropCap } from '@/components/ui/DropCap';
import { LogoDivider } from '@/components/ui/LogoDivider';

export const TradingCompany = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const ornamentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.6, 0.6, 0.3]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background with subtle texture */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/30"
        style={{ y: backgroundY }}
      />

      {/* Decorative corner flourishes */}
      <motion.div 
        className="absolute top-8 left-8 w-24 h-24 opacity-20"
        style={{ opacity: ornamentOpacity }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path 
            d="M5 5 L5 40 M5 5 L40 5" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
          />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
          <path 
            d="M10 10 Q25 10 25 25" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            fill="none"
            opacity="0.6"
          />
        </svg>
      </motion.div>

      <motion.div 
        className="absolute top-8 right-8 w-24 h-24 opacity-20 rotate-90"
        style={{ opacity: ornamentOpacity }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path 
            d="M5 5 L5 40 M5 5 L40 5" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
          />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 left-8 w-24 h-24 opacity-20 -rotate-90"
        style={{ opacity: ornamentOpacity }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path 
            d="M5 5 L5 40 M5 5 L40 5" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
          />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 right-8 w-24 h-24 opacity-20 rotate-180"
        style={{ opacity: ornamentOpacity }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <path 
            d="M5 5 L5 40 M5 5 L40 5" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
          />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="container relative z-10 max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo divider above title */}
          <LogoDivider variant="standard" size="sm" className="mb-6" />

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground tracking-wide mb-4">
            The Trading Company
          </h2>
          
          <p className="text-primary/80 uppercase tracking-[0.3em] text-xs md:text-sm font-medium">
            Tradition, Method, and Intent
          </p>

          {/* Logo divider below subtitle */}
          <LogoDivider variant="minimal" size="sm" className="mt-6" />
        </motion.div>

        {/* Body Content */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DropCap className="text-foreground/90 text-lg md:text-xl text-center md:text-left">
            A trading company is defined less by what it sells than by how it selects. Hot Pepper Trading Company operates within that older definition, drawing from a tradition where flavor moved along routes rather than trends, and goods were chosen with purpose rather than volume.
          </DropCap>

          <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-body">
            Our approach is rooted in curation. Peppers are not treated as interchangeable commodities, but as trade goods shaped by region, climate, and cultivation. Each collection is assembled to reflect a specific lineage — geographic, cultural, or historical — and presented as part of a broader body of work rather than a standalone product.
          </p>

          <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-body">
            By operating as a trading company rather than a mass-market brand, we prioritize restraint over scale. Selection, naming, and presentation are deliberate, preserving context as much as character. This philosophy guides how offerings are assembled and how they are introduced, ensuring that every release carries both origin and intent.
          </p>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div 
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <LogoDivider variant="ornate" size="md" />
        </motion.div>
      </div>
    </section>
  );
};
