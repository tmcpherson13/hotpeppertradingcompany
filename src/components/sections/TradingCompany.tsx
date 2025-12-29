import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DropCap } from '@/components/ui/DropCap';
import { LogoDivider } from '@/components/ui/LogoDivider';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';

export const TradingCompany = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "10%"]);
  const ornamentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.6, 0.6, 0.3]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background image with parallax - increased visibility */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: imageY }}
      >
        <img 
          src={tradeRoutesBg} 
          alt="" 
          className="w-full h-[120%] object-cover opacity-30 sepia-[0.3]"
          aria-hidden="true"
        />
      </motion.div>

      {/* Trade Route Pattern overlay */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full z-[1]" 
        variant="tyrian" 
        opacity={0.08} 
      />

      {/* Gradient overlay for text readability - reduced opacity for more visible background */}
      <motion.div 
        className="absolute inset-0 z-[2] bg-gradient-to-b from-background/75 via-background/70 to-background/75"
        style={{ y: backgroundY }}
      />

      {/* Aged paper texture */}
      <div className="absolute inset-0 z-[3] paper-texture opacity-40" />

      {/* Decorative vignette */}
      <div className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsla(28, 35%, 12%, 0.15) 100%)'
        }}
      />

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
