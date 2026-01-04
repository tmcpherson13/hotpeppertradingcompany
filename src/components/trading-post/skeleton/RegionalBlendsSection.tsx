import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShopifyProduct } from '@/lib/shopify';
import { HeatBadge } from '../HeatBadge';
import { MediterraneanSelectionModal } from '@/components/sections/MediterraneanSelectionModal';
import { CaribbeanHeatTrioModal } from '@/components/sections/CaribbeanHeatTrioModal';
import { PacificRimBlendModal } from '@/components/sections/PacificRimBlendModal';

// Map product handles to region labels and flavor profiles
const REGIONAL_META: Record<string, { region: string; flavorProfile: string }> = {
  'mediterranean-selection': { 
    region: 'Southern Europe & Levant', 
    flavorProfile: 'Smoky • Earthy • Warm' 
  },
  'caribbean-heat-trio': { 
    region: 'Island Nations', 
    flavorProfile: 'Tropical • Fruity • Fierce' 
  },
  'pacific-rim-blend': { 
    region: 'East & Southeast Asia', 
    flavorProfile: 'Citrus • Bright • Complex' 
  },
};

// Get heat tier from SHU tag
function getHeatTierFromProduct(product: ShopifyProduct): 1 | 2 | 3 | 4 | 5 | undefined {
  const tags = product.node.tags || [];
  for (const tag of tags) {
    const match = tag.match(/shu[:\s]*(\d+)/i);
    if (match) {
      const shu = parseInt(match[1], 10);
      if (shu < 2500) return 1;
      if (shu < 30000) return 2;
      if (shu < 100000) return 3;
      if (shu < 350000) return 4;
      return 5;
    }
  }
  return undefined;
}

interface RegionalBlendCardProps {
  product: ShopifyProduct;
  index: number;
  onViewBlend: (handle: string) => void;
}

function RegionalBlendCard({ product, index, onViewBlend }: RegionalBlendCardProps) {
  const handle = product.node.handle;
  const meta = REGIONAL_META[handle] || { region: 'Regional Blend', flavorProfile: '' };
  const imageUrl = product.node.images?.edges?.[0]?.node?.url;
  const price = product.node.priceRange.minVariantPrice.amount;
  const heatTier = getHeatTierFromProduct(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative bg-parchment border-2 border-ink/20 shadow-md hover:shadow-lg transition-shadow">
        {/* Image */}
        <Link to={`/product/${handle}`} className="block relative">
          <div className="aspect-[4/3] overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.node.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.15]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ink/20 to-ink/40 flex items-center justify-center">
                <Package className="w-12 h-12 text-ink/30" />
              </div>
            )}
          </div>

          {/* Heat Badge */}
          {heatTier && (
            <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-sm px-2 py-1.5 rounded">
              <HeatBadge tier={heatTier} />
            </div>
          )}

          {/* 3-Pepper badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-tyrian/90 backdrop-blur-sm px-2 py-1 rounded">
            <Package className="w-3 h-3 text-gold" />
            <span className="text-xs text-gold font-heading">3 Peppers</span>
          </div>

          {/* Region Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-ink/85 py-2 px-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-parchment/80 font-heading">
              {meta.region}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 bg-parchment-dark">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-ink/20" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-tyrian font-heading">
              Regional Blend
            </span>
            <div className="h-px flex-1 bg-ink/20" />
          </div>

          <h3 className="font-blackpearl text-lg text-ink text-center mb-1">
            {product.node.title}
          </h3>

          <p className="text-[10px] uppercase tracking-wider text-tyrian/80 font-heading text-center mb-3">
            {meta.flavorProfile}
          </p>

          <div className="border-t border-dashed border-ink/20 pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-tyrian font-heading font-semibold">
                ${parseFloat(price).toFixed(2)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-ink/50 font-heading">
                3 × 2oz
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="w-full text-[10px] uppercase tracking-[0.1em] border-ink/30 text-ink/70 hover:bg-ink hover:text-parchment py-2"
                onClick={() => onViewBlend(handle)}
              >
                View Blend
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="w-full text-[10px] uppercase tracking-[0.1em] border-tyrian/50 text-tyrian hover:bg-tyrian hover:text-parchment py-2"
                asChild
              >
                <Link to={`/product/${handle}`}>
                  Procure Stock
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-ink/20" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-ink/20" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-ink/20" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-ink/20" />
      </div>
    </motion.article>
  );
}

interface RegionalBlendsSectionProps {
  products: ShopifyProduct[];
}

export function RegionalBlendsSection({ products }: RegionalBlendsSectionProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Filter for Regional Consortium products
  const regionalBlends = products.filter(p => 
    p.node.productType?.toLowerCase().includes('regional')
  );

  if (regionalBlends.length === 0) return null;

  const handleViewBlend = (handle: string) => {
    setActiveModal(handle);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <section className="py-16 relative z-10 border-y border-tyrian/20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-3">
            <Sparkles className="w-6 h-6 text-tyrian" />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-blackpearl text-3xl text-ink">Regional Blends</h2>
                <span className="text-[10px] uppercase tracking-wider bg-tyrian/20 text-tyrian px-2 py-1 rounded font-heading">
                  New
                </span>
              </div>
              <p className="text-ink/60 font-heading text-sm uppercase tracking-wider">
                Curated 3-pepper selections by geography & flavor
              </p>
            </div>
          </div>

          <p className="text-ink/70 font-body max-w-2xl mb-8">
            A middle tier between individual cultivars and flagship journeys — 
            focused blends that showcase regional character without the commitment of a full consortium.
          </p>

          {/* Regional Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regionalBlends.map((product, index) => (
              <RegionalBlendCard 
                key={product.node.id} 
                product={product} 
                index={index}
                onViewBlend={handleViewBlend}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Regional Blend Modals */}
      <MediterraneanSelectionModal 
        open={activeModal === 'mediterranean-selection'} 
        onOpenChange={(open) => !open && closeModal()} 
      />
      <CaribbeanHeatTrioModal 
        open={activeModal === 'caribbean-heat-trio'} 
        onOpenChange={(open) => !open && closeModal()} 
      />
      <PacificRimBlendModal 
        open={activeModal === 'pacific-rim-blend'} 
        onOpenChange={(open) => !open && closeModal()} 
      />
    </>
  );
}
