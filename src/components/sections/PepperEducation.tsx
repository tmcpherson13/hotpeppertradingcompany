import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TradeRoutePattern, CompassRose } from '@/components/ui/TradeRoutePattern';

// Custom SVG icons for each historical era
const ScrollIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 3c0-1 1-2 2-2h10c1 0 2 1 2 2v18c0 1-1 2-2 2H7c-1 0-2-1-2-2V3z" />
    <path d="M5 5c-1.5 0-3 1-3 2.5S3.5 10 5 10" />
    <path d="M19 5c1.5 0 3 1 3 2.5S20.5 10 19 10" />
    <path d="M5 19c-1.5 0-3-1-3-2.5S3.5 14 5 14" />
    <path d="M19 19c1.5 0 3-1 3-2.5S20.5 14 19 14" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
    <line x1="9" y1="15" x2="12" y2="15" />
  </svg>
);

const SailingShipIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 20h20" />
    <path d="M4 17h16c0 0-1-4-3-6l-5-8-5 8c-2 2-3 6-3 6z" />
    <path d="M12 3v14" />
    <path d="M8 9l4-6" />
    <path d="M16 9l-4-6" />
    <path d="M6 14h12" />
  </svg>
);

const OldGlobeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="3" ry="9" />
    <path d="M3 12h18" />
    <path d="M5 7h14" />
    <path d="M5 17h14" />
    <path d="M4 4l2 2" />
    <path d="M18 4l2 2" />
    <line x1="12" y1="2" x2="12" y2="4" />
  </svg>
);

const facts = [
  {
    icon: ScrollIcon,
    title: 'Pre-Columbian Origins',
    description: 'Archaeological evidence confirms capsicum cultivation in the Americas by 4000 BCE. The Aztecs and Maya developed sophisticated growing and preservation techniques.',
    link: '/history/pre-columbian-origins',
  },
  {
    icon: SailingShipIcon,
    title: 'The Columbian Exchange',
    description: 'Portuguese and Spanish traders introduced peppers to Africa, India, and Asia after 1492. By 1550, they had reached every major trading port.',
    link: '/history/columbian-exchange',
  },
  {
    icon: OldGlobeIcon,
    title: 'Global Integration',
    description: 'Today, hot peppers are cultivated on every inhabited continent. They define regional cuisines from Sichuan to Hungary to West Africa.',
    link: '/history/global-integration',
  },
];

export function PepperEducation() {
  return (
    <section id="pepper-education" className="relative py-20 bg-background paper-texture overflow-hidden">
      {/* Trade Route Background */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full" 
        variant="subtle" 
        opacity={0.06} 
      />
      
      {/* Decorative Compass */}
      <CompassRose 
        className="absolute top-16 right-8 md:right-16 opacity-10 text-primary" 
        size={100}
        variant="subtle"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary">
                <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="currentColor" />
              </svg>
              <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <p className="text-muted-foreground font-heading text-sm uppercase tracking-[0.25em] mb-4 small-caps">
              Historical Context
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 text-engraved">
              The Global Spread of Capsicum
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              No other cultivated plant has achieved such rapid global adoption. 
              Within a century of first contact, capsicum peppers had become 
              indispensable to cuisines across four continents.
            </p>
          </div>

          {/* Educational Content - Nautical Themed Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {facts.map((fact, index) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Route connector between cards */}
                {index < facts.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 lg:-right-4 w-6 lg:w-8 items-center justify-center z-10">
                    <div className="w-full h-px border-t-2 border-dashed border-tyrian/40" />
                    <svg className="absolute w-3 h-3" viewBox="0 0 12 12">
                      <polygon 
                        points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" 
                        fill="hsl(var(--tyrian))" 
                        fillOpacity="0.5"
                      />
                    </svg>
                  </div>
                )}

                <Link 
                  to={fact.link} 
                  className="block group h-full"
                >
                  <div className="relative h-full bg-parchment border-2 border-tyrian/30 p-6 lg:p-8
                                  transition-all duration-300 hover:border-tyrian/60 
                                  hover:shadow-[0_8px_30px_-10px_hsl(var(--tyrian)/0.3)]
                                  group-hover:scale-[1.02]">
                    
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-tyrian/50" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-tyrian/50" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-tyrian/50" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-tyrian/50" />
                    
                    {/* Inner border for cartouche effect */}
                    <div className="absolute inset-[8px] border border-tyrian/15 pointer-events-none" />
                    
                    {/* Small corner dots */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-tyrian/40 rounded-full" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-tyrian/40 rounded-full" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-tyrian/40 rounded-full" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-tyrian/40 rounded-full" />
                    
                    {/* Icon container - simple circle */}
                    <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center
                                    border-2 border-tyrian/40 rounded-full bg-parchment
                                    transition-all duration-300 group-hover:border-tyrian/70 group-hover:bg-tyrian/5">
                      <fact.icon className="w-8 h-8 text-tyrian transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    
                    {/* Category label */}
                    <p className="font-heading text-[10px] uppercase tracking-[0.25em] text-tyrian/70 mb-2 text-center small-caps">
                      Historical Era
                    </p>
                    
                    {/* Title */}
                    <h3 className="font-display text-xl text-tyrian text-center mb-3 text-engraved">
                      {fact.title}
                    </h3>
                    
                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="w-8 h-px bg-gradient-to-r from-transparent to-tyrian/40" />
                      <svg className="w-2 h-2" viewBox="0 0 8 8">
                        <polygon points="4,0 5,3 8,4 5,5 4,8 3,5 0,4 3,3" fill="hsl(var(--tyrian))" fillOpacity="0.5" />
                      </svg>
                      <span className="w-8 h-px bg-gradient-to-l from-transparent to-tyrian/40" />
                    </div>
                    
                    {/* Description */}
                    <p className="font-body text-muted-foreground text-center leading-relaxed mb-6 text-sm">
                      {fact.description}
                    </p>
                    
                    {/* CTA Button */}
                    <div className="text-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 
                                      bg-tyrian/10 border border-tyrian/30 
                                      text-tyrian font-heading text-xs uppercase tracking-[0.15em]
                                      transition-all duration-300 
                                      group-hover:bg-tyrian group-hover:text-parchment
                                      group-hover:border-tyrian">
                        Explore History
                        <svg 
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quote Block */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative border-l-4 border-primary pl-8 py-4"
          >
            <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed mb-4">
              "The chile pepper is the king of everything, and it makes 
              other foods appetizing."
            </p>
            <footer className="font-body text-muted-foreground">
              — Bernardino de Sahagún, <cite>Florentine Codex</cite>, 1569
            </footer>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}
