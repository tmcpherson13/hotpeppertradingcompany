import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { DropCap } from '@/components/ui/DropCap';
import logoDark from '@/assets/logo-dark.svg';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';

export const BrandPhilosophy = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "15%"]);

  const paragraphs = [
    "Hot Pepper Trading Company was founded on an older idea of trade — when flavor moved by sail, spice followed routes rather than trends, and provenance mattered as much as heat. Long before peppers were reduced to Scoville ratings and bulk bins, they were cargo: carefully sourced, deliberately transported, and exchanged with intention.",
    "We operate as a modern trading company in the classic sense. Our work begins far from the shelf, tracing historic spice corridors, regional growing traditions, and the hands that cultivate them. Each collection we assemble reflects a route, a climate, and a story — not just an ingredient.",
    "This is not mass production, and it is not anonymous heat. Hot Pepper Trading Company exists to curate, preserve, and present peppers as trade goods once again — selected with discipline, named with purpose, and offered as part of a broader tradition of exchange."
  ];

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image with parallax effect */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <img
          src={tradeRoutesBg}
          alt=""
          className="w-full h-full object-cover scale-110"
          aria-hidden="true"
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </motion.div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05]">
        <TradeRoutePattern variant="tyrian" />
      </div>
      
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 paper-texture opacity-25" />
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Enhanced vignette effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, hsla(var(--background) / 0.6) 70%, hsla(var(--background)) 100%)'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Larger Logo and decorative header */}
          <motion.div 
            className="flex flex-col items-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-6 mb-6">
              <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <motion.img 
                src={logoDark} 
                alt="" 
                className="h-20 md:h-24 w-auto" 
                aria-hidden="true"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            {/* Decorative compass element */}
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 40 40" 
              className="text-primary opacity-50"
            >
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              <line x1="20" y1="2" x2="20" y2="38" stroke="currentColor" strokeWidth="0.5" />
              <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="0.5" />
              <line x1="6" y1="6" x2="34" y2="34" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
              <line x1="34" y1="6" x2="6" y2="34" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
              <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3" />
            </svg>
          </motion.div>

          {/* Content paragraphs */}
          <div className="space-y-10">
            {paragraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              >
                {index === 0 ? (
                  <DropCap className="text-lg md:text-xl text-foreground/85 text-center">
                    {paragraph}
                  </DropCap>
                ) : (
                  <p className="font-body text-lg md:text-xl leading-relaxed text-foreground/85 text-center">
                    {paragraph}
                  </p>
                )}
                
                {/* Decorative divider with subtle logo between paragraphs */}
                {index < paragraphs.length - 1 && (
                  <div className="flex items-center justify-center mt-10">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-border/50" />
                    <motion.img 
                      src={logoDark} 
                      alt="" 
                      className="h-6 w-auto mx-4 opacity-25"
                      aria-hidden="true"
                      animate={{ opacity: [0.25, 0.35, 0.25] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ 
                        opacity: 0.5, 
                        filter: "drop-shadow(0 0 8px rgba(139, 69, 19, 0.3))"
                      }}
                    />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-border/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Decorative bottom flourish */}
          <motion.div 
            className="flex justify-center mt-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <svg 
              width="140" 
              height="24" 
              viewBox="0 0 140 24" 
              className="text-border"
            >
              {/* Left flourish */}
              <path 
                d="M0,12 Q20,4 40,12 Q50,16 60,12" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.75"
              />
              {/* Right flourish */}
              <path 
                d="M80,12 Q90,8 100,12 Q120,20 140,12" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.75"
              />
              {/* Center diamond */}
              <polygon points="70,6 76,12 70,18 64,12" fill="none" stroke="currentColor" strokeWidth="0.75" />
              <circle cx="70" cy="12" r="2" fill="currentColor" opacity="0.5" />
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};
