import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TradeRoutePattern, TradeRouteDivider } from '@/components/ui/TradeRoutePattern';
import spiceChili from '@/assets/spice-red-chili.jpg';
import spicePaprika from '@/assets/spice-paprika.jpg';
import spicePepper from '@/assets/spice-pepper.jpg';
import spiceSaffron from '@/assets/spice-saffron.jpg';

const spices = [
  {
    name: 'Aleppo Hot Pepper',
    origin: 'Syria',
    description: 'Sun-dried, hand-crushed. Notes of raisin and cumin with moderate heat.',
    price: '$24',
    image: spiceChili,
  },
  {
    name: 'Smoked Paprika',
    origin: 'La Vera, Spain',
    description: 'Oak-smoked for weeks. Deep, earthy sweetness with lasting warmth.',
    price: '$18',
    image: spicePaprika,
  },
  {
    name: 'Bird\'s Eye Chili',
    origin: 'Thailand',
    description: 'Intense, fiery heat with bright citrus notes. A Southeast Asian staple.',
    price: '$22',
    image: spicePepper,
  },
  {
    name: 'Carolina Reaper',
    origin: 'South Carolina, USA',
    description: 'The world\'s hottest pepper. Fruity sweetness followed by extreme heat.',
    price: '$48',
    image: spiceSaffron,
  },
];

export function FeaturedSpices() {
  return (
    <section id="collection" className="relative py-20 bg-background paper-texture overflow-hidden">
      {/* Trade Route Background Pattern */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full" 
        variant="tyrian" 
        opacity={0.06} 
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
          <TradeRouteDivider className="mb-8" />
          <p className="text-muted-foreground font-heading text-sm uppercase tracking-[0.25em] mb-4 small-caps">
            The Hot Pepper Consortium
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 text-engraved">
            Regional Selections
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Curated through historical trade networks and partnerships with 
            artisan growers across three continents.
          </p>
        </motion.div>

        {/* Spice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {spices.map((spice, index) => (
            <motion.article
              key={spice.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden bg-card border-2 border-border shadow-card mb-3">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={spice.image}
                    alt={`${spice.name} from ${spice.origin}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Origin Badge */}
                <div className="absolute top-3 left-3 bg-ink/90 px-3 py-1 border border-ink/50">
                  <span className="text-xs uppercase tracking-[0.15em] text-parchment font-heading">
                    {spice.origin}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-heading text-xl text-foreground">
                    {spice.name}
                  </h3>
                  <span className="font-display text-lg text-tyrian">
                    {spice.price}
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {spice.description}
                </p>
                <Button 
                  variant="parchment" 
                  size="sm" 
                  className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Add to Cart
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button variant="pepper" size="lg">
            Browse Full Inventory
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
