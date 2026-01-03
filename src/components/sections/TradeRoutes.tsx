import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { TradeRouteMap } from '@/components/map/TradeRouteMap';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';


export function TradeRoutes() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} id="routes" className="py-16 relative overflow-hidden">
      {/* Full Background Map Image with Parallax */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ 
          backgroundImage: `url(${tradeRoutesBg})`,
          y: backgroundY 
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-background/85" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Navigation className="w-6 h-6 text-gold" />
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <p className="text-foreground font-heading text-lg md:text-xl font-bold uppercase tracking-[0.3em] mb-3 small-caps">
            Sourcing Regions & Trading Ports
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 text-engraved">
            Principal Trade Routes
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We maintain direct supplier relationships in three major capsicum-producing regions. 
            Each offers distinct cultivars shaped by local climate, soil, and tradition.
          </p>
        </motion.div>

        {/* Interactive Trade Route Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-12"
        >
          {/* Outer Frame */}
          <div className="relative border-4 border-border bg-card shadow-deep">
            {/* Corner Ornaments */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold z-10" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold z-10" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold z-10" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold z-10" />
            
            {/* Inner Frame */}
            <div className="border-2 border-border/50 m-2 overflow-hidden">
              <TradeRouteMap />
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
