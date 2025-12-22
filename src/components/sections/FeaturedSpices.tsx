import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    <section id="collection" className="py-24 bg-background paper-texture">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="vintage-divider mb-8">
            <span className="text-tyrian text-xl px-4">✦</span>
          </div>
          <p className="text-muted-foreground font-body text-sm uppercase tracking-[0.3em] mb-4">
            The Hot Pepper Consortium
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground font-semibold mb-6">
            Regional Selections
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
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
              <div className="relative overflow-hidden bg-card border border-border rounded-sm shadow-card mb-4">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={spice.image}
                    alt={`${spice.name} from ${spice.origin}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Origin Badge */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 border border-border">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-body">
                    {spice.origin}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl text-foreground font-semibold">
                    {spice.name}
                  </h3>
                  <span className="font-display text-lg text-accent font-semibold">
                    {spice.price}
                  </span>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {spice.description}
                </p>
                <Button 
                  variant="parchment" 
                  size="sm" 
                  className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
