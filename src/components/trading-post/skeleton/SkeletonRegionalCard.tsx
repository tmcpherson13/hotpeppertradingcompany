import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegionalBlend {
  name: string;
  region: string;
  flavorProfile: string;
  pepperCount: number;
  description: string;
  price: string;
  color: string;
}

const REGIONAL_BLENDS: RegionalBlend[] = [
  {
    name: "Mediterranean Selection",
    region: "Southern Europe & Levant",
    flavorProfile: "Smoky • Earthy • Warm",
    pepperCount: 3,
    description: "Sun-dried traditions from coastal terraces and ancient trade ports.",
    price: "$15.00",
    color: "from-amber-700 to-amber-900"
  },
  {
    name: "Caribbean Heat Trio",
    region: "Island Nations",
    flavorProfile: "Tropical • Fruity • Fierce",
    pepperCount: 3,
    description: "Island fire tempered by sugarcane sweetness and sea-salt breezes.",
    price: "$15.00",
    color: "from-orange-600 to-red-800"
  },
  {
    name: "Pacific Rim Blend",
    region: "East & Southeast Asia",
    flavorProfile: "Citrus • Bright • Complex",
    pepperCount: 3,
    description: "Spanning silk routes to volcanic islands—layers of aromatic depth.",
    price: "$15.00",
    color: "from-red-700 to-rose-900"
  }
];

interface SkeletonRegionalCardProps {
  index: number;
}

export function SkeletonRegionalCard({ index }: SkeletonRegionalCardProps) {
  const blend = REGIONAL_BLENDS[index];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative bg-parchment border-2 border-ink/20 shadow-md hover:shadow-lg transition-shadow">
        {/* Coming Soon Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-tyrian/90 px-3 py-1 rounded">
          <span className="text-[10px] uppercase tracking-wider text-gold font-heading">
            Coming Soon
          </span>
        </div>

        {/* Color gradient header */}
        <div className={`h-24 bg-gradient-to-br ${blend.color} relative overflow-hidden`}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`pattern-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="currentColor" className="text-parchment" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
            </svg>
          </div>
          
          {/* Pepper count badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-ink/80 backdrop-blur-sm px-2 py-1 rounded">
            <Package className="w-3 h-3 text-parchment/70" />
            <span className="text-xs text-parchment font-heading">{blend.pepperCount} Peppers</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-ink/20" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-ink/50 font-heading">
              {blend.region}
            </span>
            <div className="h-px flex-1 bg-ink/20" />
          </div>

          <h3 className="font-blackpearl text-lg text-ink text-center mb-1">
            {blend.name}
          </h3>

          <p className="text-[10px] uppercase tracking-wider text-tyrian font-heading text-center mb-3">
            {blend.flavorProfile}
          </p>

          <p className="font-body text-xs text-ink/60 leading-relaxed text-center mb-4 italic">
            "{blend.description}"
          </p>

          <div className="border-t border-dashed border-ink/20 pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-tyrian font-heading font-semibold">{blend.price}</span>
              <span className="text-[10px] uppercase tracking-wider text-ink/40 font-heading">
                Regional Blend
              </span>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              disabled
              className="w-full text-xs uppercase tracking-[0.1em] border-ink/20 text-ink/40"
            >
              Notify When Available
            </Button>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-ink/20" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-ink/20" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-ink/20" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-ink/20" />
      </div>
    </motion.div>
  );
}

export function SkeletonRegionalCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((index) => (
        <SkeletonRegionalCard key={index} index={index} />
      ))}
    </div>
  );
}
