import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, Compass, Anchor, Navigation } from 'lucide-react';
import antiqueMap from '@/assets/antique-map.jpg';

const regions = [
  {
    name: 'The Americas',
    region: 'Mexico & Central America',
    description: 'Origin point of all capsicum species. Domesticated circa 4000 BCE. Source of Poblano, Serrano, Habanero, and most commercial varieties.',
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
    description: 'Adopted capsicum within fifty years of introduction. Now produces Bird\'s Eye, Thai Dragon, and regional sambal varieties. High pungency cultivars.',
    icon: Ship,
    coordinates: '13°N 100°E',
  },
];

export function TradeRoutes() {
  return (
    <section id="routes" className="py-16 bg-background relative overflow-hidden">
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
            Each offers distinct varieties shaped by local climate, soil, and tradition.
          </p>
        </motion.div>

        {/* Featured Map Placeholder - Central Visual Element */}
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
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold" />
            
            {/* Inner Frame */}
            <div className="border-2 border-border/50 m-2">
              {/* Map Container */}
              <div className="relative aspect-[21/9] md:aspect-[3/1] overflow-hidden">
                {/* Background Map Image */}
                <img 
                  src={antiqueMap} 
                  alt="Antique trade route map" 
                  className="absolute inset-0 w-full h-full object-cover sepia-subtle opacity-60"
                />
                
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-transparent to-card/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-transparent to-card/40" />
                
                {/* Trade Route Lines SVG */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  {/* Main Trade Route */}
                  <motion.path
                    d="M80,200 Q200,150 350,180 T550,160 Q700,140 850,170 T1120,200"
                    fill="none"
                    stroke="hsl(var(--gold))"
                    strokeWidth="3"
                    strokeDasharray="15,10"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                  {/* Secondary Route */}
                  <motion.path
                    d="M100,280 Q250,240 400,260 T650,230 Q800,210 950,240 T1100,280"
                    fill="none"
                    stroke="hsl(var(--gold))"
                    strokeWidth="2"
                    strokeDasharray="8,12"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.8 }}
                  />
                  
                  {/* Origin Points */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                  >
                    <circle cx="120" cy="200" r="8" fill="hsl(var(--primary))" stroke="hsl(var(--gold))" strokeWidth="2" />
                    <circle cx="550" cy="160" r="8" fill="hsl(var(--primary))" stroke="hsl(var(--gold))" strokeWidth="2" />
                    <circle cx="950" cy="180" r="8" fill="hsl(var(--primary))" stroke="hsl(var(--gold))" strokeWidth="2" />
                  </motion.g>
                </svg>
                
                {/* Compass Rose */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6">
                  <svg width="60" height="60" viewBox="0 0 80 80" className="text-gold opacity-70">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    {/* Cardinal Points */}
                    <path d="M40,8 L43,35 L40,40 L37,35 Z" fill="currentColor" />
                    <path d="M40,72 L43,45 L40,40 L37,45 Z" fill="currentColor" opacity="0.5" />
                    <path d="M8,40 L35,37 L40,40 L35,43 Z" fill="currentColor" opacity="0.5" />
                    <path d="M72,40 L45,37 L40,40 L45,43 Z" fill="currentColor" opacity="0.5" />
                    {/* Ordinal Points */}
                    <path d="M17,17 L36,36 L40,40 L34,34 Z" fill="currentColor" opacity="0.3" />
                    <path d="M63,17 L44,36 L40,40 L46,34 Z" fill="currentColor" opacity="0.3" />
                    <path d="M17,63 L36,44 L40,40 L34,46 Z" fill="currentColor" opacity="0.3" />
                    <path d="M63,63 L44,44 L40,40 L46,46 Z" fill="currentColor" opacity="0.3" />
                    <circle cx="40" cy="40" r="4" fill="currentColor" />
                  </svg>
                </div>
                
                {/* Map Title Cartouche */}
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <div className="bg-card/90 border-2 border-border px-4 py-2 shadow-card">
                    <p className="font-display text-xs md:text-sm text-foreground tracking-wide">
                      CARTA UNIVERSALIS
                    </p>
                    <p className="font-body text-[10px] md:text-xs text-muted-foreground italic">
                      The Global Pepper Trade, Anno Domini MDXXI–Present
                    </p>
                  </div>
                </div>
                
                {/* Interactive Map Coming Soon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="text-center bg-card/95 border-2 border-gold/50 px-8 py-6 shadow-deep"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <Anchor className="w-8 h-8 text-gold mx-auto mb-3" />
                    <h3 className="font-display text-lg md:text-xl text-foreground mb-2">
                      Interactive Map in Development
                    </h3>
                    <p className="font-body text-sm text-muted-foreground max-w-md leading-relaxed">
                      A detailed cartographic tool documenting the historical spread of 
                      capsicum cultivation from the Americas to global trade networks.
                    </p>
                  </motion.div>
                </div>
              </div>
              
              {/* Map Legend Bar */}
              <div className="bg-muted/50 border-t-2 border-border px-4 py-3 flex flex-wrap items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-gold" style={{ borderStyle: 'dashed' }} />
                  <span className="font-body text-muted-foreground">Primary Trade Routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary border border-gold" />
                  <span className="font-body text-muted-foreground">Origin Ports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-gold" />
                  <span className="font-body text-muted-foreground">Maritime Passages</span>
                </div>
              </div>
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
