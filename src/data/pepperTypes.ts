// Domesticated species
export type DomesticatedSpecies = 'annuum' | 'chinense' | 'frutescens' | 'baccatum' | 'pubescens';

// Ancestral/wild species
export type AncestralSpecies = 'chacoense' | 'galapagoense' | 'praetermissum' | 'eximium' | 'tovarii' | 'cardenasii' | 'glabriusculum' | 'rhomboideum';

// All species
export type Species = DomesticatedSpecies | AncestralSpecies;

export type HeatLevel = 'No Heat' | 'Very Mild' | 'Mild' | 'Medium' | 'Hot' | 'Very Hot' | 'Extreme' | 'Superhot';

export type ImageSource = 'ai-generated' | 'wikimedia' | 'user-contributed' | 'stock';
export type ImageType = 'illustration' | 'photo' | 'dried' | 'plant' | 'user-upload';

export interface PepperImage {
  id: string;
  url: string;
  type: ImageType;
  isPrimary?: boolean;
  source: ImageSource;
  license?: string;
  author?: string;
  sourceUrl?: string;
}

export interface Pepper {
  id: string;
  name: string;
  alternateNames?: string[];
  scientificName: string;
  species: Species;
  origin: string;
  region: 'Americas' | 'Asia' | 'Africa' | 'Europe' | 'Middle East';
  scovilleMin: number;
  scovilleMax: number;
  heatLevel: HeatLevel;
  flavorNotes: string[];
  aromaNotes?: string[];
  description: string;
  historicalNotes?: string;
  tradeRoute: string;
  tradeRouteTags?: string[];
  yearIntroduced: number;
  culinaryUses: string[];
  pairings?: string[];
  inStock: boolean;
  gallery?: PepperImage[];
  // Legacy fields - kept for backward compatibility during migration
  imageUrl?: string;
  imageLicense?: string;
  attributionText?: string;
}

// Filter data constants
export const regions = ['Americas', 'Asia', 'Africa', 'Europe', 'Middle East'] as const;
export const heatLevels = ['No Heat', 'Very Mild', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme', 'Superhot'] as const;

// Domesticated species list
export const domesticatedSpeciesList = ['annuum', 'chinense', 'frutescens', 'baccatum', 'pubescens'] as const;
// Ancestral species list
export const ancestralSpeciesList = ['glabriusculum', 'chacoense', 'galapagoense', 'praetermissum', 'eximium', 'tovarii', 'cardenasii', 'rhomboideum'] as const;
// Combined list for backward compatibility
export const speciesList = [...domesticatedSpeciesList, ...ancestralSpeciesList] as const;

export const speciesDisplayNames: Record<Species, string> = {
  // Domesticated
  annuum: 'Capsicum annuum',
  chinense: 'Capsicum chinense',
  frutescens: 'Capsicum frutescens',
  baccatum: 'Capsicum baccatum',
  pubescens: 'Capsicum pubescens',
  // Ancestral
  glabriusculum: 'C. annuum var. glabriusculum',
  chacoense: 'Capsicum chacoense',
  galapagoense: 'Capsicum galapagoense',
  praetermissum: 'Capsicum praetermissum',
  eximium: 'Capsicum eximium',
  tovarii: 'Capsicum tovarii',
  cardenasii: 'Capsicum cardenasii',
  rhomboideum: 'Capsicum rhomboideum',
};
