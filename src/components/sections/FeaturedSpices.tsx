import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ConsortiumManifestOverlay } from '@/components/ui/ConsortiumManifestOverlay';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { HeatBadge, HeatTier } from '@/components/trading-post/HeatBadge';
import { EmbersOfAfricaContent } from '@/components/sections/EmbersOfAfricaContent';
import { SilkJadePassagesContent } from '@/components/sections/SilkJadePassagesContent';
import { AndeanDiasporaContent } from '@/components/sections/AndeanDiasporaContent';
import { PhoenicianLegacyContent } from '@/components/sections/PhoenicianLegacyContent';
import { LetterOfMarqueContent } from '@/components/sections/LetterOfMarqueContent';
import { AtlanticProvenanceContent } from '@/components/sections/AtlanticProvenanceContent';
import { ManilaGalleonContent } from '@/components/sections/ManilaGalleonContent';
import { OldNatchezTraceContent } from '@/components/sections/OldNatchezTraceContent';
import { CradleOfFireContent } from '@/components/sections/CradleOfFireContent';
import { SouthernCrucibleContent } from '@/components/sections/SouthernCrucibleContent';
import embersOfAfricaImg from '@/assets/consortium/embers-of-africa.jpg';
import silkJadePassagesImg from '@/assets/consortium/silk-jade-passages.jpg';
import andeanDiasporaImg from '@/assets/consortium/andean-diaspora.jpg';
import letterOfMarqueImg from '@/assets/consortium/letter-of-marque.jpg';
import phoenicianLegacyImg from '@/assets/consortium/phoenician-legacy.jpg';
import atlanticProvenanceImg from '@/assets/consortium/atlantic-provenance.jpg';
import manilaGalleonImg from '@/assets/consortium/manila-galleon.jpg';
import oldNatchezTraceImg from '@/assets/consortium/old-natchez-trace.jpg';
import cradleOfFireImg from '@/assets/consortium/cradle-of-fire.jpg';
import southernCrucibleImg from '@/assets/consortium/southern-crucible.jpg';
import logoDark from '@/assets/logo-dark.svg';
import antiqueMap from '@/assets/antique-map.jpg';

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
  consortiumId?: string;
  regionLabel?: string;
  flipImage?: boolean;
  heatTier?: HeatTier;
}

const spices: Spice[] = [
  // Chronological Order: Locked per user request (2026-01-01)
  {
    name: 'Cradle of Fire',
    origin: 'Multi-Origin',
    region: 'Mesoamerica',
    tradeLot: '№ 001',
    weight: '2 oz (56.70g)',
    description: 'Where it all began—from wild chiltepin to cultivated diversity, the full arc of Mexican pepper heritage.',
    price: '$21.00',
    image: cradleOfFireImg,
    isConsortium: true,
    consortiumId: 'mesoamerica',
    regionLabel: 'MEXICO & CENTRAL AMERICA',
    heatTier: 4,
  },
  {
    name: 'Southern Crucible',
    origin: 'Multi-Origin',
    region: 'Pan-South America',
    tradeLot: '№ 002',
    weight: '2 oz (56.70g)',
    description: 'From Amazon to Andes—the continent that gave fire to the world.',
    price: '$19.00',
    image: southernCrucibleImg,
    isConsortium: true,
    consortiumId: 'southamerica',
    regionLabel: 'SOUTH AMERICA',
    heatTier: 4,
  },
  {
    name: 'Andean Diaspora',
    origin: 'Multi-Origin',
    region: 'Global Migration',
    tradeLot: '№ 003',
    weight: '2 oz (56.70g)',
    description: 'Two cultivars, two directions—how Andean peppers transformed the globe.',
    price: '$19.00',
    image: andeanDiasporaImg,
    isConsortium: true,
    consortiumId: 'andes',
    regionLabel: 'WESTERN SOUTH AMERICA',
    heatTier: 3,
  },
  {
    name: 'Embers of Africa',
    origin: 'Multi-Origin',
    region: 'Pan-African Routes',
    tradeLot: '№ 004',
    weight: '2 oz (56.70g)',
    description: 'Portuguese carrack routes brought New World fire to ancient kingdoms.',
    price: '$21.00',
    image: embersOfAfricaImg,
    isConsortium: true,
    consortiumId: 'africa',
    regionLabel: 'WEST AFRICAN COAST',
    heatTier: 4,
  },
  {
    name: 'Phoenician Legacy',
    origin: 'Multi-Origin',
    region: 'Mediterranean Basin',
    tradeLot: '№ 005',
    weight: '2 oz (56.70g)',
    description: 'Ancient trade routes where East met West and spice became civilization.',
    price: '$17.00',
    image: phoenicianLegacyImg,
    isConsortium: true,
    consortiumId: 'mediterranean',
    regionLabel: 'MEDITERRANEAN',
    heatTier: 2,
  },
  {
    name: 'Silk & Jade Passages',
    origin: 'Multi-Origin',
    region: 'Silk Road & Maritime Routes',
    tradeLot: '№ 006',
    weight: '2 oz (56.70g)',
    description: 'From Chang\'an to Constantinople, heat traveled the ancient roads.',
    price: '$17.00',
    image: silkJadePassagesImg,
    isConsortium: true,
    consortiumId: 'asia',
    regionLabel: 'SILK ROAD & ASIAN SEAS',
    heatTier: 3,
  },
  {
    name: 'Atlantic Provenance',
    origin: 'Multi-Origin',
    region: 'Atlantic Triangle',
    tradeLot: '№ 007',
    weight: '2 oz (56.70g)',
    description: 'The triangular trade that reshaped cuisines across three continents.',
    price: '$21.00',
    image: atlanticProvenanceImg,
    isConsortium: true,
    consortiumId: 'atlantic',
    regionLabel: 'ATLANTIC TRIANGLE',
    heatTier: 3,
  },
  {
    name: 'Letter of Marque',
    origin: 'Multi-Origin',
    region: 'Caribbean Archipelago',
    tradeLot: '№ 008',
    weight: '2 oz (56.70g)',
    description: 'Privateer\'s cargo: the most prized cultivars from pirate-ruled waters.',
    price: '$23.00',
    image: letterOfMarqueImg,
    flipImage: true,
    isConsortium: true,
    consortiumId: 'caribbean',
    regionLabel: 'CARIBBEAN',
    heatTier: 5,
  },
  {
    name: 'Manila Galleon',
    origin: 'Multi-Origin',
    region: 'Trans-Pacific Route',
    tradeLot: '№ 009',
    weight: '2 oz (56.70g)',
    description: 'Tracing the silver ships that carried New World fire to Asian shores.',
    price: '$19.00',
    image: manilaGalleonImg,
    isConsortium: true,
    consortiumId: 'manila',
    regionLabel: 'MARITIME SOUTHEAST ASIA',
    heatTier: 3,
  },
  {
    name: 'Old Natchez Trace',
    origin: 'Multi-Origin',
    region: 'Gulf to Highlands',
    tradeLot: '№ 010',
    weight: '2 oz (56.70g)',
    description: 'From the Kaintuck flatboats to Creole kitchens—American fire.',
    price: '$21.00',
    image: oldNatchezTraceImg,
    isConsortium: true,
    consortiumId: 'natchez',
    regionLabel: 'AMERICAN SOUTH',
    heatTier: 4,
  },
];

type ManifestState = { open: false } | { open: true; consortiumId: string };

export function FeaturedSpices() {
  const sectionRef = useRef<HTMLElement>(null);
  const [manifest, setManifest] = useState<ManifestState>({ open: false });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const patternY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const handleConsortiumClick = (consortiumId?: string) => {
    if (consortiumId) {
      setManifest({ open: true, consortiumId });
    }
  };

  const closeModal = () => setManifest({ open: false });

  return (
    <section ref={sectionRef} id="collection" className="relative py-20 overflow-hidden">
      {/* Background image with parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: patternY }}
      >
        <img 
          src={antiqueMap} 
          alt="" 
          className="w-full h-[120%] object-cover opacity-12 sepia-[0.4]"
          aria-hidden="true"
        />
      </motion.div>

      {/* Base card background */}
      <div className="absolute inset-0 z-[1] bg-card/95" />

      {/* Trade Route Background Pattern with Parallax */}
      <motion.div style={{ y: patternY }} className="z-[2]">
        <TradeRoutePattern 
          className="inset-0 w-full h-full" 
          variant="tyrian" 
          opacity={0.05} 
        />
      </motion.div>

      {/* Paper texture overlay */}
      <div className="absolute inset-0 z-[3] paper-texture" />

      {/* Decorative vignette */}
      <div className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, hsla(28, 35%, 12%, 0.08) 100%)'
        }}
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
          <h2 className="font-blackpearl text-3xl md:text-5xl text-foreground mb-2">
            Current Consignment
          </h2>
          <p className="text-primary font-heading text-xs uppercase tracking-[0.3em] mb-6">
            Consortium Journeys
          </p>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hot Pepper Trading Company assembles its collections with deliberate restraint. Each cultivar 
            is evaluated for flavor profile, pungency, and regional provenance—selected not for volume, 
            but for suitability. These are not products; they are releases, curated by route and lineage.
          </p>
        </motion.div>

        {/* Trade Goods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.15] ${spice.flipImage ? 'scale-x-[-1] group-hover:scale-x-[-1.05]' : ''}`}
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
                <div className="p-4 bg-parchment-dark">
                  {/* Decorative line */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-ink/20" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-heading">
                      {spice.regionLabel}
                    </span>
                    <div className="flex-1 h-px bg-ink/20" />
                  </div>
                  
                  {/* Product Name - Blackpearl Style */}
                  <h3 className="font-blackpearl text-xl text-ink text-center mb-2">
                    {spice.name}
                  </h3>
                  
                  {/* Heat Badge */}
                  {spice.heatTier && (
                    <div className="flex justify-center mb-2">
                      <div className="bg-ink/80 backdrop-blur-sm px-2 py-1 rounded">
                        <HeatBadge tier={spice.heatTier} />
                      </div>
                    </div>
                  )}

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
                        onClick={() => handleConsortiumClick(spice.consortiumId)}
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
                Full Compendium
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-ink/30" />
            </div>
            <Button variant="pepper" size="lg" asChild>
              <Link to="/compendium" onClick={() => window.scrollTo(0, 0)}>Consult the Compendium</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Manifest Modal */}
      <ConsortiumManifestOverlay open={manifest.open} onClose={closeModal}>
        {manifest.open && manifest.consortiumId === 'mesoamerica' && <CradleOfFireContent />}
        {manifest.open && manifest.consortiumId === 'southamerica' && <SouthernCrucibleContent />}
        {manifest.open && manifest.consortiumId === 'andes' && <AndeanDiasporaContent />}
        {manifest.open && manifest.consortiumId === 'africa' && <EmbersOfAfricaContent />}
        {manifest.open && manifest.consortiumId === 'mediterranean' && <PhoenicianLegacyContent />}
        {manifest.open && manifest.consortiumId === 'asia' && <SilkJadePassagesContent />}
        {manifest.open && manifest.consortiumId === 'atlantic' && <AtlanticProvenanceContent />}
        {manifest.open && manifest.consortiumId === 'caribbean' && <LetterOfMarqueContent />}
        {manifest.open && manifest.consortiumId === 'manila' && <ManilaGalleonContent />}
        {manifest.open && manifest.consortiumId === 'natchez' && <OldNatchezTraceContent />}
      </ConsortiumManifestOverlay>
    </section>
  );
}
