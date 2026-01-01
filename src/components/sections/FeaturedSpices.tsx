import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { ConsortiumDetailModal } from '@/components/sections/ConsortiumDetailModal';
import { SpiritsOfAsiaModal } from '@/components/sections/SpiritsOfAsiaModal';
import { AndeanDiasporaModal } from '@/components/sections/AndeanDiasporaModal';
import { PhoenicianLegacyModal } from '@/components/sections/PhoenicianLegacyModal';
import { LetterOfMarqueModal } from '@/components/sections/LetterOfMarqueModal';
import { AtlanticProvenanceModal } from '@/components/sections/AtlanticProvenanceModal';
import { ManilaGalleonModal } from '@/components/sections/ManilaGalleonModal';
import { OldNatchezTraceModal } from '@/components/sections/OldNatchezTraceModal';
import { CradleOfFireModal } from '@/components/sections/CradleOfFireModal';
import { SouthernCrucibleModal } from '@/components/sections/SouthernCrucibleModal';
import echoesOfAfricaImg from '@/assets/consortium/echoes-of-africa.jpg';
import spiritsOfAsiaImg from '@/assets/consortium/spirits-of-asia.jpg';
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
}

const spices: Spice[] = [
  // Chronological Order: Locked per user request (2026-01-01)
  {
    name: 'Cradle of Fire',
    origin: 'Multi-Origin',
    region: 'Mesoamerica',
    tradeLot: 'CONSORTIUM № 001',
    weight: '3 oz / 85g',
    description: 'Where it all began—from wild chiltepin to cultivated diversity, the full arc of Mexican pepper heritage.',
    price: '$36',
    image: cradleOfFireImg,
    isConsortium: true,
    consortiumId: 'mesoamerica',
    regionLabel: 'MESOAMERICA',
  },
  {
    name: 'Southern Crucible',
    origin: 'Multi-Origin',
    region: 'Pan-South America',
    tradeLot: 'CONSORTIUM № 002',
    weight: '3 oz / 85g',
    description: 'From Amazon to Andes—the continent that gave fire to the world. Every pepper traces its lineage here.',
    price: '$48',
    image: southernCrucibleImg,
    isConsortium: true,
    consortiumId: 'southamerica',
    regionLabel: 'SOUTH AMERICA',
  },
  {
    name: 'Andean Diaspora',
    origin: 'Multi-Origin',
    region: 'Global Migration',
    tradeLot: 'CONSORTIUM № 003',
    weight: '3 oz / 85g',
    description: 'Two cultivars, two directions—from the Andes to Aleppo and Korea, this is the story of peppers that traveled and those that stayed.',
    price: '$42',
    image: andeanDiasporaImg,
    isConsortium: true,
    consortiumId: 'andes',
    regionLabel: 'WESTERN SOUTH AMERICA',
  },
  {
    name: 'Echoes of Africa',
    origin: 'Multi-Origin',
    region: 'Pan-African Routes',
    tradeLot: 'CONSORTIUM № 004',
    weight: '3 oz / 85g',
    description: 'A layered symphony of heat from Aleppo to Trinidad—fruity, smoky, citrus, tropical, and an unforgettable slow-building inferno.',
    price: '$36',
    image: echoesOfAfricaImg,
    isConsortium: true,
    consortiumId: 'africa',
    regionLabel: 'WEST AFRICAN COAST',
  },
  {
    name: 'Phoenician Legacy',
    origin: 'Multi-Origin',
    region: 'Mediterranean Basin',
    tradeLot: 'CONSORTIUM № 005',
    weight: '3 oz / 85g',
    description: 'Ancient routes, Mediterranean fire—from Aleppo to Calabria, the peppers that traveled the paths first carved by Phoenician traders.',
    price: '$36',
    image: phoenicianLegacyImg,
    isConsortium: true,
    consortiumId: 'mediterranean',
    regionLabel: 'MEDITERRANEAN',
  },
  {
    name: 'Silk & Jade Passages',
    origin: 'Multi-Origin',
    region: 'Silk Road & Maritime Routes',
    tradeLot: 'CONSORTIUM № 006',
    weight: '3 oz / 85g',
    description: 'Where the caravans met the sea—overland through Aleppo and Anatolia, by sail through India and Southeast Asia.',
    price: '$35',
    image: spiritsOfAsiaImg,
    isConsortium: true,
    consortiumId: 'asia',
    regionLabel: 'SILK ROAD & ASIAN SEAS',
  },
  {
    name: 'Atlantic Provenance',
    origin: 'Multi-Origin',
    region: 'Atlantic Triangle',
    tradeLot: 'CONSORTIUM № 007',
    weight: '2.5 oz / 70g',
    description: 'Mexico to Caribbean to West Africa—the triangular crossing where fire became jerk, pepper pot, and piri piri.',
    price: '$24',
    image: atlanticProvenanceImg,
    isConsortium: true,
    consortiumId: 'atlantic',
    regionLabel: 'ATLANTIC TRIANGLE',
  },
  {
    name: 'Letter of Marque',
    origin: 'Multi-Origin',
    region: 'Caribbean Archipelago',
    tradeLot: 'CONSORTIUM № 008',
    weight: '3 oz / 85g',
    description: 'Sanctioned fire from the Golden Age of Piracy—island heat that traveled under privateer sail from Kingston to Nassau.',
    price: '$38',
    image: letterOfMarqueImg,
    flipImage: true,
    isConsortium: true,
    consortiumId: 'caribbean',
    regionLabel: 'CARIBBEAN',
  },
  {
    name: 'Manila Galleon',
    origin: 'Multi-Origin',
    region: 'Trans-Pacific Route',
    tradeLot: 'CONSORTIUM № 009',
    weight: '3 oz / 85g',
    description: 'Across the Pacific—from Acapulco to Manila to Asia. The longest trade route in history carried fire that transformed a continent.',
    price: '$44',
    image: manilaGalleonImg,
    isConsortium: true,
    consortiumId: 'manila',
    regionLabel: 'MARITIME SOUTHEAST ASIA',
  },
  {
    name: 'Old Natchez Trace',
    origin: 'Multi-Origin',
    region: 'Gulf to Highlands',
    tradeLot: 'CONSORTIUM № 010',
    weight: '3 oz / 85g',
    description: 'From Gulf port to highland trail—the fire that traveled America\'s earliest inland trade corridor by flatboat and footpath.',
    price: '$38',
    image: oldNatchezTraceImg,
    isConsortium: true,
    consortiumId: 'natchez',
    regionLabel: 'AMERICAN SOUTH',
  },
];

export function FeaturedSpices() {
  const sectionRef = useRef<HTMLElement>(null);
  const [africaModalOpen, setAfricaModalOpen] = useState(false);
  const [asiaModalOpen, setAsiaModalOpen] = useState(false);
  const [andesModalOpen, setAndesModalOpen] = useState(false);
  const [caribbeanModalOpen, setCaribbeanModalOpen] = useState(false);
  const [mediterraneanModalOpen, setMediterraneanModalOpen] = useState(false);
  const [atlanticModalOpen, setAtlanticModalOpen] = useState(false);
  const [manilaModalOpen, setManilaModalOpen] = useState(false);
  const [natchezModalOpen, setNatchezModalOpen] = useState(false);
  const [mesoamericaModalOpen, setMesoamericaModalOpen] = useState(false);
  const [southamericaModalOpen, setSouthamericaModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const patternY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const handleConsortiumClick = (consortiumId?: string) => {
    switch (consortiumId) {
      case 'africa':
        setAfricaModalOpen(true);
        break;
      case 'asia':
        setAsiaModalOpen(true);
        break;
      case 'andes':
        setAndesModalOpen(true);
        break;
      case 'caribbean':
        setCaribbeanModalOpen(true);
        break;
      case 'mediterranean':
        setMediterraneanModalOpen(true);
        break;
      case 'atlantic':
        setAtlanticModalOpen(true);
        break;
      case 'manila':
        setManilaModalOpen(true);
        break;
      case 'natchez':
        setNatchezModalOpen(true);
        break;
      case 'mesoamerica':
        setMesoamericaModalOpen(true);
        break;
      case 'southamerica':
        setSouthamericaModalOpen(true);
        break;
    }
  };

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
            Regional Consortiums
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

      {/* Consortium Detail Modals */}
      <ConsortiumDetailModal 
        open={africaModalOpen} 
        onOpenChange={setAfricaModalOpen} 
      />
      <SpiritsOfAsiaModal
        open={asiaModalOpen} 
        onOpenChange={setAsiaModalOpen} 
      />
      <AndeanDiasporaModal 
        open={andesModalOpen} 
        onOpenChange={setAndesModalOpen} 
      />
      <LetterOfMarqueModal 
        open={caribbeanModalOpen} 
        onOpenChange={setCaribbeanModalOpen} 
      />
      <PhoenicianLegacyModal 
        open={mediterraneanModalOpen} 
        onOpenChange={setMediterraneanModalOpen} 
      />
      <AtlanticProvenanceModal 
        open={atlanticModalOpen} 
        onOpenChange={setAtlanticModalOpen} 
      />
      <ManilaGalleonModal 
        open={manilaModalOpen} 
        onOpenChange={setManilaModalOpen} 
      />
      <OldNatchezTraceModal 
        open={natchezModalOpen} 
        onOpenChange={setNatchezModalOpen} 
      />
      <CradleOfFireModal 
        open={mesoamericaModalOpen} 
        onOpenChange={setMesoamericaModalOpen} 
      />
      <SouthernCrucibleModal 
        open={southamericaModalOpen} 
        onOpenChange={setSouthamericaModalOpen} 
      />
    </section>
  );
}
