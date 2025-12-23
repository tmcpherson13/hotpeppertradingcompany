import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TradeRoutePattern, CompassRose } from '@/components/ui/TradeRoutePattern';

// Custom SVG icons for each historical era - Old nautical hand-drawn style
const ScrollIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    {/* Ancient scroll with curled ends */}
    <path 
      d="M6 6c0-2 2-3 4-3h12c2 0 4 1 4 3" 
      stroke="currentColor" 
      strokeWidth="1.2"
      fill="none"
    />
    <path 
      d="M6 6v20c0 2 2 3 4 3h12c2 0 4-1 4-3V6" 
      stroke="currentColor" 
      strokeWidth="1.2"
      fill="hsl(var(--parchment))"
    />
    {/* Top curl */}
    <ellipse cx="6" cy="6" rx="2.5" ry="3" stroke="currentColor" strokeWidth="1.2" fill="hsl(var(--parchment))" />
    <ellipse cx="26" cy="6" rx="2.5" ry="3" stroke="currentColor" strokeWidth="1.2" fill="hsl(var(--parchment))" />
    {/* Bottom curl */}
    <ellipse cx="6" cy="26" rx="2.5" ry="3" stroke="currentColor" strokeWidth="1.2" fill="hsl(var(--parchment))" />
    <ellipse cx="26" cy="26" rx="2.5" ry="3" stroke="currentColor" strokeWidth="1.2" fill="hsl(var(--parchment))" />
    {/* Text lines - wavy for hand-drawn feel */}
    <path d="M10 11c2 0.3 4 -0.3 6 0.2s4 -0.2 6 0" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
    <path d="M10 15c2 -0.2 4 0.4 6 0s4 0.3 6 0" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
    <path d="M10 19c2 0.2 4 -0.2 6 0.3s3 -0.3 4 0" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
    {/* Decorative seal */}
    <circle cx="16" cy="24" r="2" stroke="currentColor" strokeWidth="0.8" fill="hsl(var(--tyrian))" fillOpacity="0.3" />
  </svg>
);

const SailingShipIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    {/* Hull - curved wooden ship */}
    <path 
      d="M4 24c0 0 2 4 12 4s12-4 12-4l-2-6H6l-2 6z" 
      stroke="currentColor" 
      strokeWidth="1.2"
      fill="hsl(var(--parchment))"
    />
    {/* Hull details */}
    <path d="M8 21h16" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    <path d="M6 24h20" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    {/* Main mast */}
    <line x1="16" y1="4" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5" />
    {/* Crow's nest */}
    <ellipse cx="16" cy="5" rx="2" ry="1" stroke="currentColor" strokeWidth="0.8" fill="none" />
    {/* Main sail - billowing */}
    <path 
      d="M16 6c-5 1-8 5-8 10h8z" 
      stroke="currentColor" 
      strokeWidth="1"
      fill="hsl(var(--parchment))"
    />
    {/* Fore sail */}
    <path 
      d="M16 8c3 0.5 5 3 6 7l-6 1z" 
      stroke="currentColor" 
      strokeWidth="1"
      fill="hsl(var(--parchment))"
    />
    {/* Flag */}
    <path d="M16 4l4 1.5-4 1.5" stroke="currentColor" strokeWidth="0.8" fill="hsl(var(--tyrian))" fillOpacity="0.4" />
    {/* Bowsprit */}
    <line x1="6" y1="18" x2="3" y2="16" stroke="currentColor" strokeWidth="1" />
    {/* Rigging - ropes */}
    <path d="M8 18l8-12" stroke="currentColor" strokeWidth="0.4" opacity="0.6" strokeDasharray="1 1" />
    <path d="M22 17l-6-9" stroke="currentColor" strokeWidth="0.4" opacity="0.6" strokeDasharray="1 1" />
  </svg>
);

const OldGlobeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    {/* Stand base */}
    <path d="M10 30h12" stroke="currentColor" strokeWidth="1.2" />
    <path d="M12 30v-2c0-1 1.5-2 4-2s4 1 4 2v2" stroke="currentColor" strokeWidth="1" fill="none" />
    {/* Stand arc */}
    <path 
      d="M8 16c0 -8 3-12 8-14" 
      stroke="currentColor" 
      strokeWidth="1.2"
      fill="none"
    />
    <path 
      d="M24 16c0 -8 -3-12 -8-14" 
      stroke="currentColor" 
      strokeWidth="1.2"
      fill="none"
    />
    {/* Globe */}
    <circle cx="16" cy="14" r="10" stroke="currentColor" strokeWidth="1.2" fill="hsl(var(--parchment))" />
    {/* Equator */}
    <ellipse cx="16" cy="14" rx="10" ry="3" stroke="currentColor" strokeWidth="0.8" fill="none" />
    {/* Meridian */}
    <ellipse cx="16" cy="14" rx="3" ry="10" stroke="currentColor" strokeWidth="0.8" fill="none" />
    {/* Latitude lines */}
    <ellipse cx="16" cy="8" rx="8" ry="2" stroke="currentColor" strokeWidth="0.5" opacity="0.5" fill="none" />
    <ellipse cx="16" cy="20" rx="8" ry="2" stroke="currentColor" strokeWidth="0.5" opacity="0.5" fill="none" />
    {/* Decorative continents - rough shapes */}
    <path d="M12 10c1-1 3 0 4 1s1 2 0 3-2 0-3-1-2-2-1-3z" fill="hsl(var(--tyrian))" fillOpacity="0.2" stroke="none" />
    <path d="M19 12c1 0 2 1 2 2s-1 3-2 3-1-1-1-2 0-3 1-3z" fill="hsl(var(--tyrian))" fillOpacity="0.2" stroke="none" />
    {/* Axis point */}
    <circle cx="16" cy="4" r="1" fill="currentColor" />
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
                  <div className="relative h-full flex flex-col bg-parchment border-2 border-tyrian/30 p-6 lg:p-8
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
                      <fact.icon className="w-10 h-10 text-tyrian transition-transform duration-300 group-hover:scale-110" />
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
                    
                    {/* Description - flex-grow to push button down */}
                    <p className="font-body text-muted-foreground text-center leading-relaxed mb-6 text-sm flex-grow">
                      {fact.description}
                    </p>
                    
                    {/* CTA Button - always at bottom */}
                    <div className="text-center mt-auto">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 
                                      bg-tyrian/10 border border-tyrian/30 
                                      text-tyrian font-heading text-xs uppercase tracking-[0.15em]
                                      transition-all duration-300 
                                      group-hover:bg-tyrian group-hover:text-parchment
                                      group-hover:border-tyrian">
                        Explore History
                        <svg 
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                          viewBox="0 0 24 24" 
                          fill="none"
                        >
                          {/* Old nautical arrow - quill/compass style */}
                          <path 
                            d="M5 12h12" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                          />
                          <path 
                            d="M14 12l5 0-3-3M14 12l5 0-3 3" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          {/* Decorative tail feather */}
                          <path 
                            d="M5 12l2-2M5 12l2 2" 
                            stroke="currentColor" 
                            strokeWidth="1"
                            opacity="0.6"
                          />
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
