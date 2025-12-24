import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { ConsortiumDetailModal } from '@/components/sections/ConsortiumDetailModal';
import echoesOfAfricaImg from '@/assets/consortium/echoes-of-africa.jpg';
import spiceChili from '@/assets/spice-red-chili.jpg';
import spicePaprika from '@/assets/spice-paprika.jpg';
import spicePepper from '@/assets/spice-pepper.jpg';
import logoDark from '@/assets/logo-dark.svg';

interface Spice {
  name: string;
  origin: string;
  region: string;
  tradeLot: string;
  weight: string;
  description: string;
  price: string;
  image: string;
  isConsortium?: boolean;
}

const spices: Spice[] = [
  {
    name: 'Echoes of Africa',
    origin: 'Multi-Origin',
    region: 'Pan-African Routes',
    tradeLot: 'CONSORTIUM № 001',
    weight: '3 oz / 85g',
    description: 'A layered symphony of heat from Aleppo to Trinidad—fruity, smoky, citrus, tropical, and an unforgettable slow-building inferno.',
    price: '$36',
    image: echoesOfAfricaImg,
    isConsortium: true,
  },
  {
    name: 'Aleppo Pepper',
    origin: 'Syria',
    region: 'The Levant',
    tradeLot: 'LOT № 1847',
    weight: '4 oz / 113g',
    description: 'Sun-dried and hand-crushed. Moderate heat with fruity undertones of raisin and mild cumin. A foundation of Levantine cooking.',
    price: '$24',
    image: spiceChili,
  },
  {
    name: 'Pimentón de la Vera',
    origin: 'Extremadura, Spain',
    region: 'Iberian Peninsula',
    tradeLot: 'LOT № 2391',
    weight: '3 oz / 85g',
    description: 'Oak-smoked for two weeks using traditional methods. Deep, earthy character with sustained warmth. Essential to Spanish cuisine.',
    price: '$18',
    image: spicePaprika,
  },
  {
    name: 'Prik Kee Noo',
    origin: 'Thailand',
    region: 'Southeast Asia',
    tradeLot: 'LOT № 0762',
    weight: '2 oz / 57g',
    description: 'Intensely pungent with bright citrus notes. The defining heat of Thai cooking. Handle with appropriate care.',
    price: '$22',
    image: spicePepper,
  },
];

export function FeaturedSpices() {
  const [consortiumModalOpen, setConsortiumModalOpen] = useState(false);

  return (
    <section id="collection" className="relative py-20 bg-card paper-texture overflow-hidden">
      {/* Trade Route Background Pattern */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full" 
        variant="subtle" 
        opacity={0.05} 
      />
      
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
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <img 
              src={logoDark} 
              alt="" 
              className="h-12 w-auto transition-transform duration-300 hover:scale-110" 
              aria-hidden="true" 
            />
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <p className="text-muted-foreground font-heading text-sm uppercase tracking-[0.25em] mb-4 small-caps">
            The Cargo
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 text-engraved">
            Current Consignment
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Each cultivar is selected with intent—evaluated for flavor profile, pungency, and regional provenance. 
            Availability is considered not as volume, but as suitability, allowing us to assemble small, deliberate Pepper Consortiums rather than uniform stock.
          </p>
        </motion.div>

        {/* Trade Goods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spices.map((spice, index) => (
            <motion.article
              key={spice.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group merchant-label"
            >
              {/* Trade Label Card */}
              <div className="relative bg-parchment border-2 border-ink/30 shadow-deep">
                {/* Top decorative border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ink/20 to-transparent" />
                
                {/* Image with sepia overlay */}
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={spice.image}
                      alt={`${spice.name} from ${spice.origin}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.15]"
                    />
                  </div>
                  
                  {/* Archival Origin Stamp */}
                  <div className="absolute top-3 right-3 w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-primary/60 rounded-full" />
                    <div className="absolute inset-1 border border-primary/40 rounded-full" />
                    <div className="text-center">
                      <span className="block text-[8px] uppercase tracking-wider text-primary font-display">
                        {spice.isConsortium ? 'Blend' : 'Origin'}
                      </span>
                      <span className="block text-[10px] uppercase tracking-wide text-primary font-heading font-semibold leading-tight">
                        {spice.isConsortium ? 'Multi' : spice.origin.split(',')[0]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Trade Region Banner */}
                  <div className="absolute bottom-0 left-0 right-0 bg-ink/85 py-2 px-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-parchment/80 font-heading">
                        {spice.region}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-parchment/60 font-body">
                        {spice.tradeLot}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Merchant Label Content */}
                <div className="p-4 bg-parchment-dark/50">
                  {/* Decorative line */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-ink/20" />
                    <img 
                      src={logoDark} 
                      alt="" 
                      className="h-4 w-auto transition-transform duration-300 hover:scale-110" 
                      aria-hidden="true" 
                    />
                    <div className="flex-1 h-px bg-ink/20" />
                  </div>
                  
                  {/* Product Name - Engraved Style */}
                  <h3 className="font-display text-lg text-ink text-center uppercase tracking-wide mb-2">
                    {spice.name}
                  </h3>
                  
                  {/* Trade Details */}
                  <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-muted-foreground font-heading mb-3">
                    <span>{spice.weight}</span>
                    <span className="text-primary">•</span>
                    <span className="text-primary font-semibold">{spice.price}</span>
                  </div>
                  
                  {/* Description */}
                  <p className="font-body text-xs text-muted-foreground leading-relaxed text-center mb-4 italic">
                    "{spice.description}"
                  </p>
                  
                  {/* Bottom Decorative Border */}
                  <div className="border-t border-dashed border-ink/20 pt-3">
                    {spice.isConsortium ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs uppercase tracking-[0.15em] border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setConsortiumModalOpen(true)}
                      >
                        Examine Full Manifest
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs uppercase tracking-[0.15em] border-ink/30 text-ink hover:bg-ink hover:text-parchment"
                      >
                        Procure Stock
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-ink/30" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-ink/30" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-ink/30" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-ink/30" />
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All - Trade Record Style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-ink/30" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                Complete Inventory
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-ink/30" />
            </div>
            <Button variant="pepper" size="lg" asChild>
              <Link to="/compendium" onClick={() => window.scrollTo(0, 0)}>View All Cultivars</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Consortium Detail Modal */}
      <ConsortiumDetailModal 
        open={consortiumModalOpen} 
        onOpenChange={setConsortiumModalOpen} 
      />
    </section>
  );
}
