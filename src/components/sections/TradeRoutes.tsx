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
    <section id="routes" className="py-20 bg-primary relative overflow-hidden">
      {/* Enhanced Background with Trade Routes */}
      <div className="absolute inset-0">
        {/* Tyrian Purple trade route lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <path
            d="M100,300 Q300,200 500,280 T800,250 Q1000,220 1100,300"
            fill="none"
            stroke="hsl(300 100% 18%)"
            strokeWidth="2"
            strokeDasharray="12,8"
            opacity="0.2"
          />
          <path
            d="M150,400 Q350,350 550,380 T850,350 Q1050,320 1150,380"
            fill="none"
            stroke="hsl(300 100% 18%)"
            strokeWidth="1.5"
            strokeDasharray="8,10"
            opacity="0.15"
          />
          <circle cx="500" cy="280" r="6" fill="hsl(300 100% 18%)" opacity="0.25" />
          <circle cx="800" cy="250" r="6" fill="hsl(300 100% 18%)" opacity="0.25" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-tyrian/50 to-transparent" />
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-gold">
              <polygon points="12,2 14,10 22,10 16,14 18,22 12,17 6,22 8,14 2,10 10,10" fill="currentColor" />
            </svg>
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-tyrian/50 to-transparent" />
          </div>
          <p className="text-primary-foreground/70 font-heading text-sm uppercase tracking-[0.25em] mb-4 small-caps">
            Geography as Story
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-primary-foreground mb-6 text-engraved">
            The Trade Routes
          </h2>
          <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Our hot peppers come from the same lands that transformed global cuisine. 
            Explore the geography that shaped human history.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {regions.map((route, index) => (
            <motion.div
              key={route.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative bg-primary-foreground/5 border border-tyrian/30 p-8 text-center hover:bg-primary-foreground/10 hover:border-tyrian/50 transition-colors duration-300"
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
