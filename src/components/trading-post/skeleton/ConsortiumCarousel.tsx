import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ConsortiumCard, Consortium } from '../ConsortiumCard';
import { cn } from '@/lib/utils';

// Import consortium images
import cradleOfFireImage from '@/assets/consortium/cradle-of-fire.jpg';
import manilaGalleonImage from '@/assets/consortium/manila-galleon.jpg';
import phoenicianLegacyImage from '@/assets/consortium/phoenician-legacy.jpg';
import atlanticProvenanceImage from '@/assets/consortium/atlantic-provenance.jpg';
import letterOfMarqueImage from '@/assets/consortium/letter-of-marque.jpg';
import silkJadePassagesImage from '@/assets/consortium/silk-jade-passages.jpg';
import embersOfAfricaImage from '@/assets/consortium/embers-of-africa.jpg';
import andeanDiasporaImage from '@/assets/consortium/andean-diaspora.jpg';
import southernCrucibleImage from '@/assets/consortium/southern-crucible.jpg';
import oldNatchezTraceImage from '@/assets/consortium/old-natchez-trace.jpg';

const CONSORTIUMS: Consortium[] = [
  // № 001 - Cradle of Fire
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
  // № 002 - Southern Crucible
  {
    name: "Southern Crucible",
    region: "Brazilian Lowlands",
    tradeLot: "№ 002",
    weight: "5 × 2oz",
    description: "Where rainforest biodiversity meets Portuguese colonial cultivation.",
    price: "$19.00",
    image: southernCrucibleImage,
    consortiumId: "southern-crucible",
    regionLabel: "South America",
    shopifyHandle: "southern-crucible-consortium",
    heatTier: 4
  },
  // № 003 - Andean Diaspora
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
  // № 004 - Embers of Africa
  {
    name: "Embers of Africa",
    region: "West African Coast",
    tradeLot: "№ 004",
    weight: "5 × 2oz",
    description: "Portuguese carrack routes brought new fire to ancient kingdoms.",
    price: "$19.00",
    image: embersOfAfricaImage,
    consortiumId: "embers-of-africa",
    regionLabel: "West African Coast",
    shopifyHandle: "embers-of-africa-consortium",
    heatTier: 4
  },
  // № 005 - Phoenician Legacy
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
  // № 006 - Silk & Jade Passages
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
  // № 007 - Atlantic Provenance
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
  // № 008 - Letter of Marque
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
  // № 009 - Manila Galleon
  {
    name: "Manila Galleon",
    region: "Pacific Trade Route",
    tradeLot: "№ 009",
    weight: "5 × 2oz",
    description: "Tracing the silver ships that carried New World fire to Asian shores.",
    price: "$19.00",
    image: manilaGalleonImage,
    consortiumId: "manila-galleon",
    regionLabel: "Maritime Southeast Asia",
    shopifyHandle: "manila-galleon-consortium",
    heatTier: 3
  },
  // № 010 - Old Natchez Trace
  {
    name: "Old Natchez Trace",
    region: "American South",
    tradeLot: "№ 010",
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      containScroll: false
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-ink/90 border border-gold/30 flex items-center justify-center text-gold hover:bg-ink hover:border-gold/60 transition-all shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-ink/90 border border-gold/30 flex items-center justify-center text-gold hover:bg-ink hover:border-gold/60 transition-all shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Viewport */}
      {/* Carousel Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6">
          {CONSORTIUMS.map((consortium, index) => (
            <div 
              key={consortium.consortiumId}
              className="pl-6 flex-[0_0_300px]"
            >
              <ConsortiumCard
                consortium={consortium}
                onViewManifest={onViewManifest}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === selectedIndex 
                ? "bg-gold scale-110" 
                : "bg-ink/30 hover:bg-ink/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
