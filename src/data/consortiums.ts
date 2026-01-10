import { Consortium } from '@/components/trading-post/JourneyCard';

// Import all consortium images
import cradleOfFireImage from '@/assets/consortium/cradle-of-fire.jpg';
import southernCrucibleImage from '@/assets/consortium/southern-crucible.jpg';
import andeanDiasporaImage from '@/assets/consortium/andean-diaspora.jpg';
import embersOfAfricaImage from '@/assets/consortium/embers-of-africa.jpg';
import phoenicianLegacyImage from '@/assets/consortium/phoenician-legacy.jpg';
import silkJadePassagesImage from '@/assets/consortium/silk-jade-passages.jpg';
import atlanticProvenanceImage from '@/assets/consortium/atlantic-provenance.jpg';
import letterOfMarqueImage from '@/assets/consortium/letter-of-marque.jpg';
import manilaGalleonImage from '@/assets/consortium/manila-galleon.jpg';
import oldNatchezTraceImage from '@/assets/consortium/old-natchez-trace.jpg';

/**
 * Unified data source for all Consortium Journeys
 * 
 * Standard Format:
 * - tradeLot: "№ 001" through "№ 010"
 * - weight: "5 × 2oz" (5 cultivars × 2oz each = 10oz total)
 * - price: "$XX.00" with decimals per pricing memory ($17, $19, $21, $23)
 * - description: ~80-90 characters max for consistent card heights
 * - regionLabel: ALL CAPS
 * - heatTier: 1-5 based on master consortium list
 */
export const CONSORTIUMS: Consortium[] = [
  // № 001 - Cradle of Fire
  {
    name: "Cradle of Fire",
    region: "Mesoamerican Origins",
    tradeLot: "№ 001",
    weight: "2 oz (56.70g)",
    description: "Where the Capsicum genus first ignited the palates of ancient Mesoamerica.",
    price: "$21.00",
    image: cradleOfFireImage,
    consortiumId: "cradle-of-fire",
    regionLabel: "MEXICO & CENTRAL AMERICA",
    shopifyHandle: "cradle-of-fire-consortium",
    heatTier: 4
  },
  // № 002 - Southern Crucible
  {
    name: "Southern Crucible",
    region: "Pan-South America",
    tradeLot: "№ 002",
    weight: "2 oz (56.70g)",
    description: "From Amazon to Andes—the continent that gave fire to the world.",
    price: "$19.00",
    image: southernCrucibleImage,
    consortiumId: "southern-crucible",
    regionLabel: "SOUTH AMERICA",
    shopifyHandle: "southern-crucible-consortium",
    heatTier: 4
  },
  // № 003 - Andean Diaspora
  {
    name: "Andean Diaspora",
    region: "Global Migration",
    tradeLot: "№ 003",
    weight: "2 oz (56.70g)",
    description: "Two cultivars, two directions—how Andean peppers transformed the globe.",
    price: "$19.00",
    image: andeanDiasporaImage,
    consortiumId: "andean-diaspora",
    regionLabel: "WESTERN SOUTH AMERICA",
    shopifyHandle: "andean-diaspora-consortium",
    heatTier: 3
  },
  // № 004 - Embers of Africa
  {
    name: "Embers of Africa",
    region: "Pan-African Routes",
    tradeLot: "№ 004",
    weight: "2 oz (56.70g)",
    description: "Portuguese carrack routes brought New World fire to ancient kingdoms.",
    price: "$21.00",
    image: embersOfAfricaImage,
    consortiumId: "embers-of-africa",
    regionLabel: "WEST AFRICAN COAST",
    shopifyHandle: "embers-of-africa-consortium",
    heatTier: 4
  },
  // № 005 - Phoenician Legacy
  {
    name: "Phoenician Legacy",
    region: "Mediterranean Basin",
    tradeLot: "№ 005",
    weight: "2 oz (56.70g)",
    description: "Ancient trade routes where East met West and spice became civilization.",
    price: "$17.00",
    image: phoenicianLegacyImage,
    consortiumId: "phoenician-legacy",
    regionLabel: "MEDITERRANEAN",
    shopifyHandle: "phoenician-legacy-consortium",
    heatTier: 2
  },
  // № 006 - Silk & Jade Passages
  {
    name: "Silk & Jade Passages",
    region: "Overland Routes",
    tradeLot: "№ 006",
    weight: "2 oz (56.70g)",
    description: "From Chang'an to Constantinople, heat traveled the ancient roads.",
    price: "$17.00",
    image: silkJadePassagesImage,
    consortiumId: "silk-jade-passages",
    regionLabel: "SILK ROAD & ASIAN SEAS",
    shopifyHandle: "silk-jade-passages-consortium",
    flipImage: true,
    heatTier: 3
  },
  // № 007 - Atlantic Provenance
  {
    name: "Atlantic Provenance",
    region: "Atlantic Triangle",
    tradeLot: "№ 007",
    weight: "2 oz (56.70g)",
    description: "The triangular trade that reshaped cuisines across three continents.",
    price: "$21.00",
    image: atlanticProvenanceImage,
    consortiumId: "atlantic-provenance",
    regionLabel: "ATLANTIC TRIANGLE",
    shopifyHandle: "atlantic-provenance-consortium",
    heatTier: 3
  },
  // № 008 - Letter of Marque
  {
    name: "Letter of Marque",
    region: "Caribbean Waters",
    tradeLot: "№ 008",
    weight: "2 oz (56.70g)",
    description: "Privateer's cargo: the most prized cultivars from pirate-ruled waters.",
    price: "$23.00",
    image: letterOfMarqueImage,
    consortiumId: "letter-of-marque",
    regionLabel: "CARIBBEAN",
    shopifyHandle: "letter-of-marque-consortium",
    flipImage: true,
    heatTier: 5
  },
  // № 009 - Manila Galleon
  {
    name: "Manila Galleon",
    region: "Pacific Trade Route",
    tradeLot: "№ 009",
    weight: "2 oz (56.70g)",
    description: "Tracing the silver ships that carried New World fire to Asian shores.",
    price: "$19.00",
    image: manilaGalleonImage,
    consortiumId: "manila-galleon",
    regionLabel: "MARITIME SOUTHEAST ASIA",
    shopifyHandle: "manila-galleon-consortium",
    heatTier: 3
  },
  // № 010 - Old Natchez Trace
  {
    name: "Old Natchez Trace",
    region: "American South",
    tradeLot: "№ 010",
    weight: "2 oz (56.70g)",
    description: "From the Kaintuck flatboats to Creole kitchens—American fire.",
    price: "$21.00",
    image: oldNatchezTraceImage,
    consortiumId: "old-natchez-trace",
    regionLabel: "AMERICAN SOUTH",
    shopifyHandle: "old-natchez-trace-consortium",
    heatTier: 4
  }
];

/**
 * Helper to get a consortium by its ID
 */
export function getConsortiumById(consortiumId: string): Consortium | undefined {
  return CONSORTIUMS.find(c => c.consortiumId === consortiumId);
}

/**
 * Helper to get the last consortium (Old Natchez Trace for special grid placement)
 */
export function getLastConsortium(): Consortium {
  return CONSORTIUMS[CONSORTIUMS.length - 1];
}

/**
 * Get all consortiums except the last one (for main grid display)
 */
export function getMainConsortiums(): Consortium[] {
  return CONSORTIUMS.slice(0, -1);
}
