import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, Compass, Navigation } from 'lucide-react';
import { TradeRouteMap } from '@/components/map/TradeRouteMap';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';

const regions = [
  {
    name: 'The Americas',
    region: 'Mexico & Central America',
    description: 'Origin point of all capsicum species. Domesticated circa 4000 BCE. Source of Poblano, Serrano, Habanero, and most commercial cultivars.',
    icon: MapPin,
    coordinates: '19°N 99°W',
  },
  {
    name: 'The Levant',
    region: 'Syria & Turkey',
    description: 'Primary source for Aleppo pepper, Urfa biber, and Marash. Cultivation established by 1600. Distinct terroir produces unique flavor profiles.',
    icon: Compass,
    coordinates: '36°N 37°E',
  },
  {
    name: 'Southeast Asia',
    region: 'Thailand & Indonesia',
    description: 'Adopted capsicum within fifty years of introduction. Now produces Bird\'s Eye, Thai Dragon, and regional sambal cultivars. High pungency cultivars.',
    icon: Ship,
    coordinates: '13°N 100°E',
  },
];

export function TradeRoutes() {
  return (
    <section id="routes" className="py-16 relative overflow-hidden">
      {/* Full Background Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${tradeRoutesBg})` }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-background/85" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Navigation className="w-6 h-6 text-gold" />
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <p className="text-muted-foreground font-heading text-xs uppercase tracking-[0.3em] mb-3 small-caps">
            Sourcing Regions
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4 text-engraved">
            Principal Trade Routes
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We maintain direct supplier relationships in three major capsicum-producing regions. 
            Each offers distinct cultivars shaped by local climate, soil, and tradition.
          </p>
        </motion.div>

        {/* Interactive Trade Route Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-12"
        >
          {/* Outer Frame */}
          <div className="relative border-4 border-border bg-card shadow-deep">
            {/* Corner Ornaments */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold z-10" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold z-10" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold z-10" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold z-10" />
            
            {/* Inner Frame */}
            <div className="border-2 border-border/50 m-2 overflow-hidden">
              <TradeRouteMap />
            </div>
          </div>
        </motion.div>

        {/* Region Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {regions.map((route, index) => (
            <motion.div
              key={route.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative bg-card border-2 border-border p-6 text-center hover:border-gold/50 transition-colors duration-300 shadow-card"
            >
              {/* Coordinate Badge */}
              <div className="absolute top-3 right-3 bg-muted/80 border border-border px-2 py-1">
                <span className="font-body text-[10px] text-muted-foreground tracking-wider">
                  {route.coordinates}
                </span>
              </div>
              
              <route.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="text-muted-foreground font-body text-xs uppercase tracking-[0.25em] mb-2">
                {route.region}
              </p>
              <h3 className="font-display text-lg text-foreground font-semibold mb-3">
                {route.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {route.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button variant="parchment" size="lg">
            Request Trade Information
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
