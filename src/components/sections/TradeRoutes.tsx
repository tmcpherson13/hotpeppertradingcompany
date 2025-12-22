import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, Compass } from 'lucide-react';

const regions = [
  {
    name: 'The Americas',
    region: 'Mexico & South America',
    description: 'The birthplace of all hot peppers. From the ancient Aztecs to the Columbian Exchange, these lands gifted the world its fire.',
    icon: MapPin,
  },
  {
    name: 'The Levant',
    region: 'Syria & Turkey',
    description: 'Crossroads of empires. Aleppo hot peppers, Urfa biber, and Maraş have seasoned the cuisines of Byzantium, the Caliphate, and the Ottoman Empire.',
    icon: Compass,
  },
  {
    name: 'Southeast Asia',
    region: 'Thailand & Indonesia',
    description: 'Where hot peppers found their second home. Bird\'s eye chilies and fiery sambals became essential to regional cuisines.',
    icon: Ship,
  },
];

export function TradeRoutes() {
  return (
    <section id="routes" className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="compass-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#compass-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 h-px bg-primary-foreground/30" />
            <span className="text-gold text-xl">✦</span>
            <span className="w-16 h-px bg-primary-foreground/30" />
          </div>
          <p className="text-primary-foreground/70 font-body text-sm uppercase tracking-[0.3em] mb-4">
            Geography as Story
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-primary-foreground font-semibold mb-6">
            The Trade Routes
          </h2>
          <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Our spices come from the same lands that supplied the ancient world. 
            Explore the geography that shaped human history.
          </p>
        </motion.div>

        {/* Regions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {regions.map((route, index) => (
            <motion.div
              key={route.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-primary-foreground/5 border border-primary-foreground/20 p-8 text-center hover:bg-primary-foreground/10 transition-colors duration-300"
            >
              <route.icon className="w-10 h-10 text-gold mx-auto mb-4" />
              <p className="text-primary-foreground/60 font-body text-xs uppercase tracking-[0.3em] mb-2">
                {route.region}
              </p>
              <h3 className="font-display text-xl text-primary-foreground font-semibold mb-4">
                {route.name}
              </h3>
              <p className="font-body text-sm text-primary-foreground/80 leading-relaxed">
                {route.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-primary-foreground/70 font-body text-sm mb-6">
            Coming soon: An interactive map of the global hot pepper routes
          </p>
          <Button variant="parchment" size="lg">
            Join the Expedition
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
