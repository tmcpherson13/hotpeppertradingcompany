import { useState } from 'react';
import { ConsortiumCard, Consortium } from './ConsortiumCard';
import { EmbersOfAfricaModal } from '@/components/sections/EmbersOfAfricaModal';
import { SilkJadePassagesModal } from '@/components/sections/SilkJadePassagesModal';
import { AndeanDiasporaModal } from '@/components/sections/AndeanDiasporaModal';
import { PhoenicianLegacyModal } from '@/components/sections/PhoenicianLegacyModal';
import { LetterOfMarqueModal } from '@/components/sections/LetterOfMarqueModal';
import { AtlanticProvenanceModal } from '@/components/sections/AtlanticProvenanceModal';
import { ManilaGalleonModal } from '@/components/sections/ManilaGalleonModal';
import { OldNatchezTraceModal } from '@/components/sections/OldNatchezTraceModal';
import { CradleOfFireModal } from '@/components/sections/CradleOfFireModal';
import { SouthernCrucibleModal } from '@/components/sections/SouthernCrucibleModal';
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

const consortiums: Consortium[] = [
  {
    name: 'Cradle of Fire',
    region: 'Mesoamerica',
    tradeLot: 'CONSORTIUM № 001',
    weight: '3 oz / 85g',
    description: 'Where it all began—from wild chiltepin to cultivated diversity, the full arc of Mexican pepper heritage.',
    price: '$19',
    image: cradleOfFireImg,
    consortiumId: 'mesoamerica',
    regionLabel: 'MEXICO & CENTRAL AMERICA',
    shopifyHandle: 'cradle-of-fire-consortium',
    heatTier: 2,
  },
  {
    name: 'Southern Crucible',
    region: 'Pan-South America',
    tradeLot: 'CONSORTIUM № 002',
    weight: '3 oz / 85g',
    description: 'From Amazon to Andes—the continent that gave fire to the world. Every pepper traces its lineage here.',
    price: '$19',
    image: southernCrucibleImg,
    consortiumId: 'southamerica',
    regionLabel: 'SOUTH AMERICA',
    shopifyHandle: 'southern-crucible-consortium',
    heatTier: 2,
  },
  {
    name: 'Andean Diaspora',
    region: 'Global Migration',
    tradeLot: 'CONSORTIUM № 003',
    weight: '3 oz / 85g',
    description: 'Two cultivars, two directions—from the Andes to Aleppo and Korea, this is the story of peppers that traveled and those that stayed.',
    price: '$19',
    image: andeanDiasporaImg,
    consortiumId: 'andes',
    regionLabel: 'WESTERN SOUTH AMERICA',
    shopifyHandle: 'andean-diaspora-consortium',
    heatTier: 2,
  },
  {
    name: 'Embers of Africa',
    region: 'Pan-African Routes',
    tradeLot: 'CONSORTIUM № 004',
    weight: '3 oz / 85g',
    description: 'A layered symphony of heat from Urfa Biber to Trinidad—fruity, smoky, citrus, tropical, and an unforgettable slow-building inferno.',
    price: '$21',
    image: embersOfAfricaImg,
    consortiumId: 'africa',
    regionLabel: 'WEST AFRICAN COAST',
    shopifyHandle: 'embers-of-africa-consortium',
    heatTier: 3,
  },
  {
    name: 'Phoenician Legacy',
    region: 'Mediterranean Basin',
    tradeLot: 'CONSORTIUM № 005',
    weight: '3 oz / 85g',
    description: 'Ancient routes, Mediterranean fire—from Aleppo to Calabria, the peppers that traveled the paths first carved by Phoenician traders.',
    price: '$17',
    image: phoenicianLegacyImg,
    consortiumId: 'mediterranean',
    regionLabel: 'MEDITERRANEAN',
    shopifyHandle: 'phoenician-legacy-consortium',
    heatTier: 1,
  },
  {
    name: 'Silk & Jade Passages',
    region: 'Silk Road & Maritime Routes',
    tradeLot: 'CONSORTIUM № 006',
    weight: '3 oz / 85g',
    description: 'Where the caravans met the sea—overland through Aleppo and Anatolia, by sail through India and Southeast Asia.',
    price: '$17',
    image: silkJadePassagesImg,
    consortiumId: 'asia',
    regionLabel: 'SILK ROAD & ASIAN SEAS',
    shopifyHandle: 'silk-jade-passages-consortium',
    heatTier: 1,
  },
  {
    name: 'Atlantic Provenance',
    region: 'Atlantic Triangle',
    tradeLot: 'CONSORTIUM № 007',
    weight: '2.5 oz / 70g',
    description: 'Mexico to Caribbean to West Africa—the triangular crossing where fire became jerk, pepper pot, and piri piri.',
    price: '$21',
    image: atlanticProvenanceImg,
    consortiumId: 'atlantic',
    regionLabel: 'ATLANTIC TRIANGLE',
    shopifyHandle: 'atlantic-provenance-consortium',
    heatTier: 3,
  },
  {
    name: 'Letter of Marque',
    region: 'Caribbean Archipelago',
    tradeLot: 'CONSORTIUM № 008',
    weight: '3 oz / 85g',
    description: 'Sanctioned fire from the Golden Age of Piracy—island heat that traveled under privateer sail from Kingston to Nassau.',
    price: '$23',
    image: letterOfMarqueImg,
    flipImage: true,
    consortiumId: 'caribbean',
    regionLabel: 'CARIBBEAN',
    shopifyHandle: 'letter-of-marque-consortium',
    heatTier: 5,
  },
  {
    name: 'Manila Galleon',
    region: 'Trans-Pacific Route',
    tradeLot: 'CONSORTIUM № 009',
    weight: '3 oz / 85g',
    description: 'Across the Pacific—from Acapulco to Manila to Asia. The longest trade route in history carried fire that transformed a continent.',
    price: '$19',
    image: manilaGalleonImg,
    consortiumId: 'manila',
    regionLabel: 'MARITIME SOUTHEAST ASIA',
    shopifyHandle: 'manila-galleon-consortium',
    heatTier: 2,
  },
  {
    name: 'Old Natchez Trace',
    region: 'Gulf to Highlands',
    tradeLot: 'CONSORTIUM № 010',
    weight: '3 oz / 85g',
    description: 'From Gulf port to highland trail—the fire that traveled America\'s earliest inland trade corridor by flatboat and footpath.',
    price: '$21',
    image: oldNatchezTraceImg,
    consortiumId: 'natchez',
    regionLabel: 'AMERICAN SOUTH',
    shopifyHandle: 'old-natchez-trace-consortium',
    heatTier: 4,
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
        {consortiums.slice(0, -1).map((consortium, index) => (
          <ConsortiumCard
            key={consortium.name}
            consortium={consortium}
            onViewManifest={handleConsortiumClick}
            index={index}
          />
        ))}
      </div>
      
      {/* Old Natchez Trace - Centered in its own row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="hidden lg:block" /> {/* Empty spacer for left */}
        <ConsortiumCard
          consortium={consortiums[9]}
          onViewManifest={handleConsortiumClick}
          index={10}
          className="md:col-start-1 md:col-end-2 lg:col-start-2 lg:col-end-3"
        />
        <div className="hidden lg:block" /> {/* Empty spacer for right */}
      </div>

      {/* Consortium Detail Modals */}
      <EmbersOfAfricaModal 
        open={africaModalOpen} 
        onOpenChange={setAfricaModalOpen} 
      />
      <SilkJadePassagesModal
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
