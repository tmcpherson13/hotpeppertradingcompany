// Domesticated species
export type DomesticatedSpecies = 'annuum' | 'chinense' | 'frutescens' | 'baccatum' | 'pubescens';

// Ancestral/wild species
export type AncestralSpecies =
  | 'chacoense' | 'galapagoense' | 'praetermissum' | 'eximium' | 'tovarii' | 'cardenasii' | 'glabriusculum' | 'rhomboideum'
  // Additional recognized wild Capsicum species (PhytoKeys monograph)
  | 'caballeroi' | 'neei' | 'coccineum' | 'flexuosum' | 'recurvatum' | 'cornutum' | 'friburgense' | 'hookerianum'
  | 'lanceolatum' | 'minutiflorum' | 'mirabile' | 'parvifolium' | 'schottianum' | 'villosum' | 'ceratocalyx'
  | 'geminifolium' | 'campylopodium' | 'rabenii' | 'regale' | 'dimorphum';

// All species
export type Species = DomesticatedSpecies | AncestralSpecies;

export type HeatLevel = 'No Heat' | 'Very Mild' | 'Mild' | 'Medium' | 'Hot' | 'Very Hot' | 'Extreme' | 'Superhot';

// How a cultivar came to be — surfaced as a badge with a plain-English glossary.
export type PepperType =
  | 'wild-species'
  | 'landrace'
  | 'heirloom'
  | 'f1-hybrid'
  | 'modern-cultivar'
  | 'ornamental';

export const pepperTypeLabels: Record<PepperType, string> = {
  'wild-species': 'Wild species',
  'landrace': 'Landrace',
  'heirloom': 'Heirloom',
  'f1-hybrid': 'Hybrid (F1)',
  'modern-cultivar': 'Modern cultivar',
  'ornamental': 'Ornamental',
};

// One-sentence, reader-friendly definitions for the Compendium legend/tooltips.
export const pepperTypeGlossary: Record<PepperType, string> = {
  'wild-species': 'An ancestral chile that grows in the wild, not created by growers.',
  'landrace': 'A traditional local variety shaped over generations by a region’s growers and climate — a chile of place, never formally bred.',
  'heirloom': 'An open-pollinated variety with a documented history; save its seed and it grows back true to type.',
  'f1-hybrid': 'A deliberate first-generation cross of two parents — vigorous and uniform, but its saved seed won’t grow true.',
  'modern-cultivar': 'Bred from a cross, then grown out for years until it breeds true — most superhots, like the Carolina Reaper.',
  'ornamental': 'Bred mainly for looks — colorful foliage or upright pods — though still edible.',
};

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
  // Classification + color/strain lineage
  pepperType?: PepperType;
  variantOf?: string;      // parent pepper id, when this is a color/strain variant
  variantLabel?: string;   // short descriptor, e.g. "Chocolate", "Yellow"
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
export const ancestralSpeciesList = ['glabriusculum', 'chacoense', 'galapagoense', 'praetermissum', 'eximium', 'tovarii', 'cardenasii', 'rhomboideum',
  'caballeroi', 'neei', 'coccineum', 'flexuosum', 'recurvatum', 'cornutum', 'friburgense', 'hookerianum',
  'lanceolatum', 'minutiflorum', 'mirabile', 'parvifolium', 'schottianum', 'villosum', 'ceratocalyx',
  'geminifolium', 'campylopodium', 'rabenii', 'regale', 'dimorphum'] as const;
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
  caballeroi: 'Capsicum caballeroi',
  neei: 'Capsicum neei',
  coccineum: 'Capsicum coccineum',
  flexuosum: 'Capsicum flexuosum',
  recurvatum: 'Capsicum recurvatum',
  cornutum: 'Capsicum cornutum',
  friburgense: 'Capsicum friburgense',
  hookerianum: 'Capsicum hookerianum',
  lanceolatum: 'Capsicum lanceolatum',
  minutiflorum: 'Capsicum minutiflorum',
  mirabile: 'Capsicum mirabile',
  parvifolium: 'Capsicum parvifolium',
  schottianum: 'Capsicum schottianum',
  villosum: 'Capsicum villosum',
  ceratocalyx: 'Capsicum ceratocalyx',
  geminifolium: 'Capsicum geminifolium',
  campylopodium: 'Capsicum campylopodium',
  rabenii: 'Capsicum rabenii',
  regale: 'Capsicum regale',
  dimorphum: 'Capsicum dimorphum',
};
