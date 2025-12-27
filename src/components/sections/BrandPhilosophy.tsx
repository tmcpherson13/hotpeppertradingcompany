import { motion } from 'framer-motion';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import logoDark from '@/assets/logo-dark.svg';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';

export const BrandPhilosophy = () => {
  const paragraphs = [
    "Hot Pepper Trading Company was founded on an older idea of trade — when flavor moved by sail, spice followed routes rather than trends, and provenance mattered as much as heat. Long before peppers were reduced to Scoville ratings and bulk bins, they were cargo: carefully sourced, deliberately transported, and exchanged with intention.",
    "We operate as a modern trading company in the classic sense. Our work begins far from the shelf, tracing historic spice corridors, regional growing traditions, and the hands that cultivate them. Each collection we assemble reflects a route, a climate, and a story — not just an ingredient.",
    "This is not mass production, and it is not anonymous heat. Hot Pepper Trading Company exists to curate, preserve, and present peppers as trade goods once again — selected with discipline, named with purpose, and offered as part of a broader tradition of exchange."
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={tradeRoutesBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-background/90" />
      </div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <TradeRoutePattern variant="subtle" />
      </div>
      
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 paper-texture opacity-30" />
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, hsla(var(--background)) 100%)'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo and decorative header */}
          <motion.div 
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <img 
                src={logoDark} 
                alt="" 
                className="h-12 w-auto transition-transform duration-300 hover:scale-110" 
                aria-hidden="true" 
              />
              <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <p className="font-body text-lg md:text-xl leading-relaxed text-foreground/85 text-center">
                  {index === 0 && (
                    <span className="float-left text-5xl md:text-6xl font-display text-primary leading-none mr-3 mt-1 text-engraved">
                      {paragraph.charAt(0)}
                    </span>
                  )}
                  {index === 0 ? paragraph.slice(1) : paragraph}
                </p>
                
                {/* Decorative divider between paragraphs */}
                {index < paragraphs.length - 1 && (
                  <div className="flex items-center justify-center mt-10">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-border/60" />
                    <svg width="20" height="20" viewBox="0 0 20 20" className="mx-4 text-primary/40">
                      <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="currentColor" />
                    </svg>
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-border/60" />
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
      
      {/* Decorative corner flourishes */}
      <div className="absolute top-8 left-8 opacity-10 pointer-events-none hidden md:block">
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-foreground">
          <path d="M0,60 Q15,45 30,45 Q45,45 45,30 Q45,15 60,0" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,50 Q12,38 25,38 Q38,38 38,25 Q38,12 50,0" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute top-8 right-8 opacity-10 pointer-events-none hidden md:block">
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-foreground" style={{ transform: 'scaleX(-1)' }}>
          <path d="M0,60 Q15,45 30,45 Q45,45 45,30 Q45,15 60,0" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,50 Q12,38 25,38 Q38,38 38,25 Q38,12 50,0" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};
