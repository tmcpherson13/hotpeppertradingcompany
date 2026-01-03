import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import silkJadePassagesImg from '@/assets/consortium/silk-jade-passages.jpg';
import andeanDiasporaImg from '@/assets/consortium/andean-diaspora.jpg';
import letterOfMarqueImg from '@/assets/consortium/letter-of-marque.jpg';
import phoenicianLegacyImg from '@/assets/consortium/phoenician-legacy.jpg';
import atlanticProvenanceImg from '@/assets/consortium/atlantic-provenance.jpg';
import manilaGalleonImg from '@/assets/consortium/manila-galleon.jpg';
import oldNatchezTraceImg from '@/assets/consortium/old-natchez-trace.jpg';
import cradleOfFireImg from '@/assets/consortium/cradle-of-fire.jpg';
import southernCrucibleImg from '@/assets/consortium/southern-crucible.jpg';

interface Consortium {
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
}

const consortiums: Consortium[] = [
  {
    name: 'Cradle of Fire',
    region: 'Mesoamerica',
    tradeLot: 'CONSORTIUM № 001',
    weight: '3 oz / 85g',
    description: 'Where it all began—from wild chiltepin to cultivated diversity, the full arc of Mexican pepper heritage.',
    price: '$36',
    image: cradleOfFireImg,
    consortiumId: 'mesoamerica',
    regionLabel: 'MEXICO & CENTRAL AMERICA',
    shopifyHandle: 'cradle-of-fire-consortium',
  },
  {
    name: 'Southern Crucible',
    region: 'Pan-South America',
    tradeLot: 'CONSORTIUM № 002',
    weight: '3 oz / 85g',
    description: 'From Amazon to Andes—the continent that gave fire to the world. Every pepper traces its lineage here.',
    price: '$48',
    image: southernCrucibleImg,
    consortiumId: 'southamerica',
    regionLabel: 'SOUTH AMERICA',
    shopifyHandle: 'southern-crucible-consortium',
  },
  {
    name: 'Andean Diaspora',
    region: 'Global Migration',
    tradeLot: 'CONSORTIUM № 003',
    weight: '3 oz / 85g',
    description: 'Two cultivars, two directions—from the Andes to Aleppo and Korea, this is the story of peppers that traveled and those that stayed.',
    price: '$42',
    image: andeanDiasporaImg,
    consortiumId: 'andes',
    regionLabel: 'WESTERN SOUTH AMERICA',
    shopifyHandle: 'andean-diaspora-consortium',
  },
  {
    name: 'Embers of Africa',
    region: 'Pan-African Routes',
    tradeLot: 'CONSORTIUM № 004',
    weight: '3 oz / 85g',
    description: 'A layered symphony of heat from Urfa Biber to Trinidad—fruity, smoky, citrus, tropical, and an unforgettable slow-building inferno.',
    price: '$36',
    image: echoesOfAfricaImg,
    consortiumId: 'africa',
    regionLabel: 'WEST AFRICAN COAST',
    shopifyHandle: 'embers-of-africa-consortium',
  },
  {
    name: 'Phoenician Legacy',
    region: 'Mediterranean Basin',
    tradeLot: 'CONSORTIUM № 005',
    weight: '3 oz / 85g',
    description: 'Ancient routes, Mediterranean fire—from Aleppo to Calabria, the peppers that traveled the paths first carved by Phoenician traders.',
    price: '$36',
    image: phoenicianLegacyImg,
    consortiumId: 'mediterranean',
    regionLabel: 'MEDITERRANEAN',
    shopifyHandle: 'phoenician-legacy-consortium',
  },
  {
    name: 'Silk & Jade Passages',
    region: 'Silk Road & Maritime Routes',
    tradeLot: 'CONSORTIUM № 006',
    weight: '3 oz / 85g',
    description: 'Where the caravans met the sea—overland through Aleppo and Anatolia, by sail through India and Southeast Asia.',
    price: '$35',
    image: silkJadePassagesImg,
    consortiumId: 'asia',
    regionLabel: 'SILK ROAD & ASIAN SEAS',
    shopifyHandle: 'silk-jade-passages-consortium',
  },
  {
    name: 'Atlantic Provenance',
    region: 'Atlantic Triangle',
    tradeLot: 'CONSORTIUM № 007',
    weight: '2.5 oz / 70g',
    description: 'Mexico to Caribbean to West Africa—the triangular crossing where fire became jerk, pepper pot, and piri piri.',
    price: '$24',
    image: atlanticProvenanceImg,
    consortiumId: 'atlantic',
    regionLabel: 'ATLANTIC TRIANGLE',
    shopifyHandle: 'atlantic-provenance-consortium',
  },
  {
    name: 'Letter of Marque',
    region: 'Caribbean Archipelago',
    tradeLot: 'CONSORTIUM № 008',
    weight: '3 oz / 85g',
    description: 'Sanctioned fire from the Golden Age of Piracy—island heat that traveled under privateer sail from Kingston to Nassau.',
    price: '$38',
    image: letterOfMarqueImg,
    flipImage: true,
    consortiumId: 'caribbean',
    regionLabel: 'CARIBBEAN',
    shopifyHandle: 'letter-of-marque-consortium',
  },
  {
    name: 'Manila Galleon',
    region: 'Trans-Pacific Route',
    tradeLot: 'CONSORTIUM № 009',
    weight: '3 oz / 85g',
    description: 'Across the Pacific—from Acapulco to Manila to Asia. The longest trade route in history carried fire that transformed a continent.',
    price: '$44',
    image: manilaGalleonImg,
    consortiumId: 'manila',
    regionLabel: 'MARITIME SOUTHEAST ASIA',
    shopifyHandle: 'manila-galleon-consortium',
  },
  {
    name: 'Old Natchez Trace',
    region: 'Gulf to Highlands',
    tradeLot: 'CONSORTIUM № 010',
    weight: '3 oz / 85g',
    description: 'From Gulf port to highland trail—the fire that traveled America\'s earliest inland trade corridor by flatboat and footpath.',
    price: '$38',
    image: oldNatchezTraceImg,
    consortiumId: 'natchez',
    regionLabel: 'AMERICAN SOUTH',
    shopifyHandle: 'old-natchez-trace-consortium',
  },
];

export function ConsortiumCards() {
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

  const handleConsortiumClick = (consortiumId: string) => {
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consortiums.map((consortium, index) => (
          <motion.article
            key={consortium.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="group"
          >
            {/* Trade Label Card */}
            <div className="relative bg-parchment border-2 border-ink/30 shadow-deep">
              {/* Top decorative border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ink/20 to-transparent" />
              
              {/* Image with sepia overlay */}
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={consortium.image}
                    alt={`${consortium.name} consortium`}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.15] ${consortium.flipImage ? 'scale-x-[-1] group-hover:scale-x-[-1.05]' : ''}`}
                  />
                </div>
                
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
              </div>

              {/* Merchant Label Content */}
              <div className="p-4 bg-parchment-dark">
                {/* Decorative line */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px bg-ink/20" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ink/60 font-heading">
                    {consortium.regionLabel}
                  </span>
                  <div className="flex-1 h-px bg-ink/20" />
                </div>
                
                {/* Product Name - Blackpearl Style */}
                <h3 className="font-blackpearl text-xl text-ink text-center mb-2">
                  {consortium.name}
                </h3>
                
                {/* Trade Details */}
                <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-ink/60 font-heading mb-3">
                  <span>{consortium.weight}</span>
                  <span className="text-tyrian">•</span>
                  <span className="text-tyrian font-semibold">{consortium.price}</span>
                </div>
                
                {/* Description */}
                <p className="font-body text-xs text-ink/70 leading-relaxed text-center mb-4 italic">
                  "{consortium.description}"
                </p>
                
                {/* Bottom Decorative Border - Two Buttons */}
                <div className="border-t border-dashed border-ink/20 pt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs uppercase tracking-[0.1em] border-ink/30 text-ink/70 hover:bg-ink hover:text-parchment"
                    onClick={() => handleConsortiumClick(consortium.consortiumId)}
                  >
                    View Manifest
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs uppercase tracking-[0.1em] border-tyrian/50 text-tyrian hover:bg-tyrian hover:text-parchment"
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
        ))}
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
    </>
  );
}
