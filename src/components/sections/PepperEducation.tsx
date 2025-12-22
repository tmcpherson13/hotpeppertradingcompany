import { motion } from 'framer-motion';
import { Anchor, Globe, History } from 'lucide-react';
import { TradeRoutePattern, CompassRose } from '@/components/ui/TradeRoutePattern';

const facts = [
  {
    icon: History,
    title: 'Pre-Columbian Origins',
    description: 'Archaeological evidence confirms capsicum cultivation in the Americas by 4000 BCE. The Aztecs and Maya developed sophisticated growing and preservation techniques.',
  },
  {
    icon: Anchor,
    title: 'The Columbian Exchange',
    description: 'Portuguese and Spanish traders introduced peppers to Africa, India, and Asia after 1492. By 1550, they had reached every major trading port.',
  },
  {
    icon: Globe,
    title: 'Global Integration',
    description: 'Today, hot peppers are cultivated on every inhabited continent. They define regional cuisines from Sichuan to Hungary to West Africa.',
  },
];

export function PepperEducation() {
  return (
    <section className="relative py-20 bg-card paper-texture overflow-hidden">
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

          {/* Educational Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {facts.map((fact, index) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 relative"
              >
                {/* Subtle route connector */}
                {index < facts.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/20 mb-6">
                  <fact.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground font-semibold mb-3">
                  {fact.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {fact.description}
                </p>
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
