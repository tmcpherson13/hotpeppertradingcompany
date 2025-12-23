import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Anchor, Globe, History } from 'lucide-react';
import { TradeRoutePattern, CompassRose } from '@/components/ui/TradeRoutePattern';

const facts = [
  {
    icon: History,
    title: 'Pre-Columbian Origins',
    description: 'Archaeological evidence confirms capsicum cultivation in the Americas by 4000 BCE. The Aztecs and Maya developed sophisticated growing and preservation techniques.',
    link: '/history/pre-columbian-origins',
  },
  {
    icon: Anchor,
    title: 'The Columbian Exchange',
    description: 'Portuguese and Spanish traders introduced peppers to Africa, India, and Asia after 1492. By 1550, they had reached every major trading port.',
    link: '/history/columbian-exchange',
  },
  {
    icon: Globe,
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
                    
                    {/* Icon badge with compass star shape */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <svg viewBox="0 0 80 80" className="w-full h-full">
                        {/* 8-pointed star shape */}
                        <polygon 
                          points="40,4 46,30 72,30 52,48 58,74 40,58 22,74 28,48 8,30 34,30" 
                          fill="hsl(var(--parchment))"
                          stroke="hsl(var(--tyrian))" 
                          strokeWidth="1.5"
                          className="transition-all duration-300 group-hover:fill-tyrian/10"
                        />
                        {/* Inner circle */}
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="18" 
                          fill="none" 
                          stroke="hsl(var(--tyrian))" 
                          strokeWidth="0.75"
                          strokeOpacity="0.4"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <fact.icon className="w-8 h-8 text-tyrian transition-transform duration-300 group-hover:scale-110" />
                      </div>
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
