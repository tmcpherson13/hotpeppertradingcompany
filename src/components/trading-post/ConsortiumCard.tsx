import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeatBadge, HeatTier } from './HeatBadge';

export interface Consortium {
  name: string;
  region: string;
  tradeLot: string;
  weight: string;
  description: string;
  price: string;
  image: string;
  consortiumId: string;
  regionLabel: string;
  shopifyHandle: string;
  flipImage?: boolean;
  heatTier?: 1 | 2 | 3 | 4 | 5;
}

interface ConsortiumCardProps {
  consortium: Consortium;
  onViewManifest: (consortiumId: string) => void;
  index?: number;
  className?: string;
}

export function ConsortiumCard({ 
  consortium, 
  onViewManifest, 
  index = 0,
  className = ''
}: ConsortiumCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className={`group ${className}`}
    >
      {/* Trade Label Card */}
      <div className="relative bg-parchment border-2 border-ink/30 shadow-deep">
        {/* Top decorative border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ink/20 to-transparent" />
        
        {/* Image with sepia overlay - Clickable */}
        <Link to={`/product/${consortium.shopifyHandle}`} className="relative block cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={consortium.image}
              alt={`${consortium.name} consortium`}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.15] ${consortium.flipImage ? 'scale-x-[-1] group-hover:scale-x-[-1.05]' : ''}`}
            />
          </div>
          
          {/* Heat Badge */}
          {consortium.heatTier && (
            <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-sm px-2 py-1.5 rounded">
              <HeatBadge tier={consortium.heatTier} />
            </div>
          )}
          
          {/* Archival Origin Stamp */}
          <div className="absolute top-3 right-3 w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-tyrian/60 rounded-full" />
            <div className="absolute inset-1 border border-tyrian/40 rounded-full" />
            <div className="text-center">
              <span className="block text-[8px] uppercase tracking-wider text-tyrian font-display">
                Blend
              </span>
              <span className="block text-[10px] uppercase tracking-wide text-tyrian font-heading font-semibold leading-tight">
                Multi
              </span>
            </div>
          </div>
          
          {/* Trade Region Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-ink/85 py-2 px-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-parchment/80 font-heading">
                {consortium.region}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-parchment/60 font-body">
                {consortium.tradeLot}
              </span>
            </div>
          </div>
        </Link>

        {/* Merchant Label Content */}
        <div className="p-4 bg-parchment-dark flex flex-col h-[330px]">
          {/* Decorative line - fixed height for 2-line labels */}
          <div className="flex items-start gap-2 mb-3 min-h-[2.25rem]">
            <div className="flex-1 h-px bg-ink/20 mt-[0.35rem]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink/60 font-heading text-center leading-tight max-w-[70%]">
              {consortium.regionLabel}
            </span>
            <div className="flex-1 h-px bg-ink/20 mt-[0.35rem]" />
          </div>
          
          {/* Product Name - Blackpearl Style */}
          <h3 className={`font-blackpearl text-xl text-ink text-center ${
            consortium.name === 'Silk & Jade Passages' || consortium.name === 'Atlantic Provenance' || consortium.name === 'Andean Diaspora'
              ? 'mb-2' 
              : 'mb-5'
          }`}>
            {consortium.name}
          </h3>
          
          {/* Trade Details */}
          <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-ink/60 font-heading mb-3">
            <span>{consortium.weight}</span>
            <span className="text-tyrian">•</span>
            <span className="text-tyrian font-semibold">{consortium.price}</span>
          </div>
          
          {/* Description - Fixed height for consistent card sizes */}
          <p className="font-body text-xs text-ink/70 leading-relaxed text-center mb-4 italic line-clamp-2 min-h-[2.5rem]">
            "{consortium.description}"
          </p>
          
          {/* Bottom Decorative Border - Two Buttons */}
          <div className="border-t border-dashed border-ink/20 pt-3 flex flex-col gap-2 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-[10px] uppercase tracking-[0.1em] border-ink/30 text-ink/70 hover:bg-ink hover:text-parchment py-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewManifest(consortium.consortiumId);
              }}
            >
              View Manifest
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-[10px] uppercase tracking-[0.1em] border-tyrian/50 text-tyrian hover:bg-tyrian hover:text-parchment py-2"
              asChild
            >
              <Link to={`/product/${consortium.shopifyHandle}`}>
                Procure Stock
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Corner Decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-ink/30" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-ink/30" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-ink/30" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-ink/30" />
      </div>
    </motion.article>
  );
}
