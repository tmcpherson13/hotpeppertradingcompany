import { motion } from 'framer-motion';
import { Anchor, Globe, History } from 'lucide-react';

const facts = [
  {
    icon: History,
    title: 'Ancient Currency',
    description: 'In medieval Europe, pepper was so valuable it was used as currency. Rents, dowries, and taxes were often paid in peppercorns.',
  },
  {
    icon: Anchor,
    title: 'Maritime Empires',
    description: 'The pepper trade built empires. Portuguese, Dutch, and British companies waged wars for control of the Malabar Coast.',
  },
  {
    icon: Globe,
    title: 'Global Journey',
    description: 'From India to Rome, pepper traveled over 4,000 miles by sea and caravan before reaching European tables.',
  },
];

export function PepperEducation() {
  return (
    <section className="py-24 bg-card paper-texture">
      <div className="container mx-auto px-4">
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
              <span className="w-16 h-px bg-border" />
              <span className="text-tyrian text-xl">✦</span>
              <span className="w-16 h-px bg-border" />
            </div>
            <p className="text-muted-foreground font-body text-sm uppercase tracking-[0.3em] mb-4">
              The King of Spices
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground font-semibold mb-6">
              How Pepper Changed the World
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Long before petroleum, before gold, there was pepper. This humble 
              berry from India's Malabar Coast sparked voyages of discovery, 
              built trading empires, and connected the ancient world.
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
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-border rounded-full mb-6">
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
            className="relative border-l-4 border-tyrian pl-8 py-4"
          >
            <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed mb-4">
              "There is no nation under the sky that does not use pepper; 
              it is sought after even by the farthest peoples."
            </p>
            <footer className="font-body text-muted-foreground">
              — Pliny the Elder, <cite>Natural History</cite>, 77 AD
            </footer>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}
