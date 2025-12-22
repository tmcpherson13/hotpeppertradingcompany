import { motion } from 'framer-motion';
import { Anchor, Globe, History } from 'lucide-react';
import { TradeRoutePattern, CompassRose } from '@/components/ui/TradeRoutePattern';

const facts = [
  {
    icon: History,
    title: 'Ancient Origins',
    description: 'Hot peppers originated in the Americas over 6,000 years ago. The Aztecs and Mayans cultivated chilies long before European contact.',
  },
  {
    icon: Anchor,
    title: 'The Columbian Exchange',
    description: 'After 1492, hot peppers spread rapidly across the globe. Within 50 years, they had transformed cuisines from India to Hungary to Korea.',
  },
  {
    icon: Globe,
    title: 'Global Transformation',
    description: 'Today, hot peppers are grown on every continent except Antarctica. They are essential to cuisines that never knew them existed.',
  },
];

export function PepperEducation() {
  return (
    <section className="relative py-24 bg-card paper-texture overflow-hidden">
      {/* Trade Route Background */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full" 
        variant="tyrian" 
        opacity={0.05} 
      />
      
      {/* Decorative Compass */}
      <CompassRose 
        className="absolute top-16 right-8 md:right-16 opacity-10 text-tyrian" 
        size={100}
        variant="tyrian"
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
              <span className="w-16 h-px bg-gradient-to-r from-transparent via-tyrian/40 to-transparent" />
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-tyrian">
                <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="currentColor" />
              </svg>
              <span className="w-16 h-px bg-gradient-to-r from-transparent via-tyrian/40 to-transparent" />
            </div>
            <p className="text-muted-foreground font-body text-sm uppercase tracking-[0.3em] mb-4">
              The Fire of the Americas
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground font-semibold mb-6">
              How Hot Peppers Changed the World
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Born in the Americas, hot peppers traveled with explorers and traders 
              to every corner of the globe. No other food has so completely 
              transformed world cuisine in such a short time.
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
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-tyrian/30 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-tyrian/10 border border-tyrian/20 rounded-full mb-6">
                  <fact.icon className="w-7 h-7 text-tyrian" />
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
            className="relative border-l-4 border-tyrian pl-8 py-4"
          >
            <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed mb-4">
              "The chile pepper is the king of everything, and it makes 
              other foods appetizing."
            </p>
            <footer className="font-body text-muted-foreground">
              — Bernardino de Sahagún, <cite>General History of the Things of New Spain</cite>, 1569
            </footer>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}
