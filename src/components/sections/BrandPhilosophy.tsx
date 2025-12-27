import { motion } from 'framer-motion';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';

export const BrandPhilosophy = () => {
  const paragraphs = [
    "Hot Pepper Trading Company was founded on an older idea of trade — when flavor moved by sail, spice followed routes rather than trends, and provenance mattered as much as heat. Long before peppers were reduced to Scoville ratings and bulk bins, they were cargo: carefully sourced, deliberately transported, and exchanged with intention.",
    "We operate as a modern trading company in the classic sense. Our work begins far from the shelf, tracing historic spice corridors, regional growing traditions, and the hands that cultivate them. Each collection we assemble reflects a route, a climate, and a story — not just an ingredient.",
    "This is not mass production, and it is not anonymous heat. Hot Pepper Trading Company exists to curate, preserve, and present peppers as trade goods once again — selected with discipline, named with purpose, and offered as part of a broader tradition of exchange."
  ];

  return (
    <section className="relative py-16 md:py-24 bg-card overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <TradeRoutePattern variant="subtle" />
      </div>
      
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 paper-texture opacity-40" />
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Decorative compass element */}
          <motion.div 
            className="flex justify-center mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              className="text-tyrian-500 opacity-60"
            >
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" strokeWidth="0.5" />
              <line x1="4" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="0.5" />
              <line x1="10" y1="10" x2="38" y2="38" stroke="currentColor" strokeWidth="0.3" />
              <line x1="38" y1="10" x2="10" y2="38" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4" />
            </svg>
          </motion.div>

          {/* Content paragraphs */}
          <div className="space-y-8">
            {paragraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <p className="font-body text-lg md:text-xl leading-relaxed text-foreground/90 text-center">
                  {index === 0 && (
                    <span className="float-left text-5xl md:text-6xl font-display text-tyrian-600 leading-none mr-3 mt-1">
                      {paragraph.charAt(0)}
                    </span>
                  )}
                  {index === 0 ? paragraph.slice(1) : paragraph}
                </p>
                
                {/* Decorative divider between paragraphs */}
                {index < paragraphs.length - 1 && (
                  <div className="flex items-center justify-center mt-8">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
                    <div className="mx-4 text-tyrian-500/40">◆</div>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Decorative bottom flourish */}
          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <svg 
              width="120" 
              height="20" 
              viewBox="0 0 120 20" 
              className="text-border"
            >
              <path 
                d="M0,10 Q30,0 60,10 Q90,20 120,10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
              />
              <circle cx="60" cy="10" r="2" fill="currentColor" opacity="0.5" />
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};
