import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ConsortiumCard, Consortium } from '../ConsortiumCard';

// Import consortium images
import cradleOfFireImage from '@/assets/consortium/cradle-of-fire.jpg';
import manilaGalleonImage from '@/assets/consortium/manila-galleon.jpg';
import phoenicianLegacyImage from '@/assets/consortium/phoenician-legacy.jpg';
import atlanticProvenanceImage from '@/assets/consortium/atlantic-provenance.jpg';
import letterOfMarqueImage from '@/assets/consortium/letter-of-marque.jpg';
import silkJadePassagesImage from '@/assets/consortium/silk-jade-passages.jpg';
import echoesOfAfricaImage from '@/assets/consortium/echoes-of-africa.jpg';
import andeanDiasporaImage from '@/assets/consortium/andean-diaspora.jpg';
import southernCrucibleImage from '@/assets/consortium/southern-crucible.jpg';
import oldNatchezTraceImage from '@/assets/consortium/old-natchez-trace.jpg';

const CONSORTIUMS: Consortium[] = [
  {
    name: "Cradle of Fire",
    region: "Mesoamerican Origins",
    tradeLot: "№ 001",
    weight: "5 × 2oz",
    description: "Where the Capsicum genus first ignited the palates of ancient Mesoamerica.",
    price: "$21.00",
    image: cradleOfFireImage,
    consortiumId: "cradle-of-fire",
    regionLabel: "Mexico & Central America",
    shopifyHandle: "cradle-of-fire-consortium",
    heatTier: 4
  },
  {
    name: "Manila Galleon",
    region: "Pacific Trade Route",
    tradeLot: "№ 002",
    weight: "5 × 2oz",
    description: "Tracing the silver ships that carried New World fire to Asian shores.",
    price: "$19.00",
    image: manilaGalleonImage,
    consortiumId: "manila-galleon",
    regionLabel: "Maritime Southeast Asia",
    shopifyHandle: "manila-galleon-consortium",
    heatTier: 3
  },
  {
    name: "Phoenician Legacy",
    region: "Mediterranean Basin",
    tradeLot: "№ 005",
    weight: "5 × 2oz",
    description: "Ancient trade routes where East met West and spice became civilization.",
    price: "$17.00",
    image: phoenicianLegacyImage,
    consortiumId: "phoenician-legacy",
    regionLabel: "Mediterranean",
    shopifyHandle: "phoenician-legacy-consortium",
    heatTier: 2
  },
  {
    name: "Atlantic Provenance",
    region: "Atlantic Triangle",
    tradeLot: "№ 007",
    weight: "5 × 2oz",
    description: "The triangular trade that reshaped cuisines across three continents.",
    price: "$19.00",
    image: atlanticProvenanceImage,
    consortiumId: "atlantic-provenance",
    regionLabel: "Atlantic Triangle",
    shopifyHandle: "atlantic-provenance-consortium",
    heatTier: 3
  },
  {
    name: "Letter of Marque",
    region: "Caribbean Waters",
    tradeLot: "№ 008",
    weight: "5 × 2oz",
    description: "Privateer's cargo: the most prized cultivars from pirate-ruled waters.",
    price: "$23.00",
    image: letterOfMarqueImage,
    consortiumId: "letter-of-marque",
    regionLabel: "Caribbean",
    shopifyHandle: "letter-of-marque-consortium",
    heatTier: 5
  },
  {
    name: "Silk & Jade Passages",
    region: "Overland Routes",
    tradeLot: "№ 006",
    weight: "5 × 2oz",
    description: "From Chang'an to Constantinople, heat traveled the ancient roads.",
    price: "$19.00",
    image: silkJadePassagesImage,
    consortiumId: "silk-jade-passages",
    regionLabel: "Silk Road & Asian Seas",
    shopifyHandle: "silk-jade-passages-consortium",
    flipImage: true,
    heatTier: 3
  },
  {
    name: "Embers of Africa",
    region: "West African Coast",
    tradeLot: "№ 010",
    weight: "5 × 2oz",
    description: "Portuguese carrack routes brought new fire to ancient kingdoms.",
    price: "$19.00",
    image: echoesOfAfricaImage,
    consortiumId: "embers-of-africa",
    regionLabel: "West African Coast",
    shopifyHandle: "embers-of-africa-consortium",
    heatTier: 4
  },
  {
    name: "Andean Diaspora",
    region: "South American Highlands",
    tradeLot: "№ 003",
    weight: "5 × 2oz",
    description: "Two cultivars, two directions—how Andean peppers transformed the globe.",
    price: "$19.00",
    image: andeanDiasporaImage,
    consortiumId: "andean-diaspora",
    regionLabel: "Western South America",
    shopifyHandle: "andean-diaspora-consortium",
    heatTier: 3
  },
  {
    name: "Southern Crucible",
    region: "Brazilian Lowlands",
    tradeLot: "№ 004",
    weight: "5 × 2oz",
    description: "Where rainforest biodiversity meets Portuguese colonial cultivation.",
    price: "$19.00",
    image: southernCrucibleImage,
    consortiumId: "southern-crucible",
    regionLabel: "South America",
    shopifyHandle: "southern-crucible-consortium",
    heatTier: 4
  },
  {
    name: "Old Natchez Trace",
    region: "American South",
    tradeLot: "№ 009",
    weight: "5 × 2oz",
    description: "From the Kaintuck flatboats to Creole kitchens—American fire.",
    price: "$17.00",
    image: oldNatchezTraceImage,
    consortiumId: "old-natchez-trace",
    regionLabel: "American South",
    shopifyHandle: "old-natchez-trace-consortium",
    heatTier: 2
  }
];

interface ConsortiumCarouselProps {
  onViewManifest: (consortiumId: string) => void;
}

export function ConsortiumCarousel({ onViewManifest }: ConsortiumCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 320; // Approximate card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-ink/90 border border-gold/30 flex items-center justify-center text-gold hover:bg-ink transition-colors shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-ink/90 border border-gold/30 flex items-center justify-center text-gold hover:bg-ink transition-colors shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CONSORTIUMS.map((consortium, index) => (
          <div 
            key={consortium.consortiumId}
            className="flex-shrink-0 w-[300px] snap-start"
          >
            <ConsortiumCard
              consortium={consortium}
              onViewManifest={onViewManifest}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center gap-1 mt-4">
        {CONSORTIUMS.map((_, index) => (
          <div
            key={index}
            className="w-1.5 h-1.5 rounded-full bg-ink/20"
          />
        ))}
      </div>
    </div>
  );
}
