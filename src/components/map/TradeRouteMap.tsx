import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SpreadTimeline, TimelineEvent, timelineEvents } from './SpreadTimeline';
import { CompassRose } from './CompassRose';
import { CartoucheBorder } from './CartoucheBorder';
import { ShipSilhouette, SeaCreature, WindHead, AgedPaperOverlay, NarrativeAnnotation } from './NarrativeElements';
import { Globe, Anchor, Ship, MapPin, Compass } from 'lucide-react';

// Region focus presets for quick navigation
interface RegionPreset {
  id: string;
  name: string;
  shortName: string;
  center: [number, number];
  zoom: number;
  icon: React.ReactNode;
  description: string;
}

const regionPresets: RegionPreset[] = [
  {
    id: 'americas',
    name: 'The Americas (Origin)',
    shortName: 'Americas',
    center: [-85, 5],
    zoom: 3.2,
    icon: <MapPin className="w-3.5 h-3.5" />,
    description: 'Birthplace of all capsicum species',
  },
  {
    id: 'pacific',
    name: 'Pacific & Manila Galleon',
    shortName: 'Pacific',
    center: [-150, 15],
    zoom: 2.5,
    icon: <Ship className="w-3.5 h-3.5" />,
    description: 'Trans-Pacific galleon trade 1542-1815',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean & Levant',
    shortName: 'Levant',
    center: [28, 38],
    zoom: 4,
    icon: <Anchor className="w-3.5 h-3.5" />,
    description: 'Aleppo, Gaziantep, Hungary',
  },
  {
    id: 'india',
    name: 'India & Trade Hub',
    shortName: 'India',
    center: [75, 18],
    zoom: 4,
    icon: <Ship className="w-3.5 h-3.5" />,
    description: 'Portuguese gateway to Asia',
  },
  {
    id: 'eastasia',
    name: 'East Asia',
    shortName: 'Asia',
    center: [105, 25],
    zoom: 3.5,
    icon: <Compass className="w-3.5 h-3.5" />,
    description: 'Sichuan, Thailand, Philippines',
  },
  {
    id: 'global',
    name: 'Global Overview',
    shortName: 'World',
    center: [-30, 15],
    zoom: 1.8,
    icon: <Globe className="w-3.5 h-3.5" />,
    description: 'Full world view including Pacific',
  },
];

interface RouteData {
  from: [number, number];
  to: [number, number];
  via: [number, number][];
  establishedYear: number;
  destinationName: string;
  isOverland?: boolean;
}

// Convert timeline year (negative for BCE) to comparable year
const parseTimelineYear = (year: number): number => year;

const tradeRoutes = {
  origins: [
    {
      name: 'Mesoamerica',
      coordinates: [-99.1332, 19.4326] as [number, number],
      description: 'Origin of all capsicum species. Domesticated by 4000 BCE.',
      cultivars: ['Poblano', 'Serrano', 'Habanero', 'Jalapeño'],
      year: '4000 BCE',
    },
    {
      name: 'Peru & Bolivia',
      coordinates: [-68.1193, -16.4897] as [number, number],
      description: 'Secondary center of capsicum diversity.',
      cultivars: ['Ají Amarillo', 'Rocoto'],
      year: '3000 BCE',
    },
    {
      name: 'La Isabela, Hispaniola',
      coordinates: [-71.08, 19.82] as [number, number],
      description: 'Columbus departed here in 1493 with pepper seeds for Spain.',
      cultivars: ['Caribbean peppers'],
      year: '1493',
    },
    {
      name: 'Lisbon, Portugal',
      coordinates: [-9.1393, 38.7223] as [number, number],
      description: 'Hub of the Portuguese maritime empire. Center of the Carreira da Índia spice trade.',
      cultivars: ['Piri Piri', 'Portuguese varieties'],
      year: '1499',
    },
  ],
  destinations: [
    {
      name: 'Aleppo, Syria',
      coordinates: [37.1343, 36.2021] as [number, number],
      description: 'Primary source for Aleppo pepper since 1600.',
      cultivars: ['Aleppo Pepper'],
      year: '1600',
    },
    {
      name: 'Gaziantep, Turkey',
      coordinates: [37.3781, 37.0662] as [number, number],
      description: 'Renowned for Urfa biber and Marash peppers.',
      cultivars: ['Urfa Biber', 'Marash'],
      year: '1600',
    },
    {
      name: 'Goa, India',
      coordinates: [73.8567, 15.2993] as [number, number],
      description: 'Portuguese capital of the Estado da Índia. Gateway to Asian spice trade.',
      cultivars: ['Kashmiri', 'Bhut Jolokia'],
      year: '1498',
    },
    {
      name: 'Cochin, India',
      coordinates: [76.2673, 9.9312] as [number, number],
      description: 'Major spice trading port on the Malabar Coast. Portuguese fort established 1503.',
      cultivars: ['Kerala varieties'],
      year: '1503',
    },
    {
      name: 'Sichuan, China',
      coordinates: [104.0665, 30.5728] as [number, number],
      description: 'Chilies transformed regional cuisine.',
      cultivars: ['Facing Heaven', 'Erjingtiao'],
      year: '1570',
    },
    {
      name: 'Thailand',
      coordinates: [100.5018, 13.7563] as [number, number],
      description: 'Adopted capsicum within fifty years of introduction.',
      cultivars: ["Bird's Eye", 'Thai Dragon'],
      year: '1550',
    },
    {
      name: 'Hungary',
      coordinates: [19.0402, 47.4979] as [number, number],
      description: 'Paprika became defining spice of Hungarian cuisine.',
      cultivars: ['Hungarian Paprika'],
      year: '1569',
    },
    {
      name: 'West Africa',
      coordinates: [-1.0232, 7.9465] as [number, number],
      description: 'Chilies spread via Portuguese traders.',
      cultivars: ['Scotch Bonnet', 'Piri Piri'],
      year: '1500',
    },
    {
      name: 'Samarkand (Silk Road)',
      coordinates: [66.9597, 39.6542] as [number, number],
      description: 'Chilies reached Central Asia via overland Silk Road routes from Persia.',
      cultivars: ['Central Asian cultivars'],
      year: '1550',
    },
    {
      name: 'Caribbean Islands',
      coordinates: [-66.1057, 18.4655] as [number, number],
      description: 'African pepper cultivars returned via slave trade, blending with native species.',
      cultivars: ['Scotch Bonnet', 'Caribbean Red', 'Datil'],
      year: '1510',
    },
    {
      name: 'Philippines',
      coordinates: [121.774, 12.8797] as [number, number],
      description: 'Manila-Acapulco galleon trade brought peppers across the Pacific from Mexico.',
      cultivars: ['Siling Labuyo', 'Siling Haba'],
      year: '1542',
    },
    {
      name: 'Sanlúcar de Barrameda, Spain',
      coordinates: [-6.3508, 36.7783] as [number, number],
      description: 'Columbus returned here in 1493 with pepper seeds from the New World.',
      cultivars: ['First European peppers'],
      year: '1493',
    },
    {
      name: 'Mozambique Island',
      coordinates: [40.7347, -15.0344] as [number, number],
      description: 'Key Portuguese resupply station on the Cape Route to India.',
      cultivars: ['Piri Piri', 'African varieties'],
      year: '1507',
    },
    {
      name: 'Hormuz',
      coordinates: [56.4547, 27.0769] as [number, number],
      description: 'Portuguese controlled this strategic strait, dominating Persian Gulf spice trade.',
      cultivars: ['Persian varieties'],
      year: '1515',
    },
    {
      name: 'Malacca',
      coordinates: [102.2501, 2.1896] as [number, number],
      description: 'Portuguese captured this strategic port in 1511, gateway to the Spice Islands.',
      cultivars: ['Southeast Asian varieties'],
      year: '1511',
    },
    {
      name: 'Ternate (Moluccas)',
      coordinates: [127.3866, 0.7893] as [number, number],
      description: 'The legendary Spice Islands. Portuguese reached here in 1522.',
      cultivars: ['Moluccan varieties'],
      year: '1522',
    },
    {
      name: 'Macao',
      coordinates: [113.5439, 22.1987] as [number, number],
      description: 'Portuguese trading post established in 1557, gateway to China.',
      cultivars: ['Chinese varieties'],
      year: '1557',
    },
  ],
  routes: [
    // Atlantic crossing to Spain, then to Aleppo via Mediterranean
    { from: [-99.1332, 19.4326] as [number, number], to: [37.1343, 36.2021] as [number, number], via: [[-40, 32], [-10, 36], [10, 37], [25, 36]] as [number, number][], establishedYear: 1600, destinationName: 'Aleppo, Syria' },
    // Portuguese route to Goa - around Cape of Good Hope
    { from: [-99.1332, 19.4326] as [number, number], to: [73.8567, 15.2993] as [number, number], via: [[-40, 10], [-20, -5], [0, -30], [18, -35], [30, -30], [45, -15], [55, 5]] as [number, number][], establishedYear: 1498, destinationName: 'Goa, India' },
    // Atlantic to Spain, overland to Hungary
    { from: [-99.1332, 19.4326] as [number, number], to: [19.0402, 47.4979] as [number, number], via: [[-40, 32], [-10, 38], [5, 42]] as [number, number][], establishedYear: 1569, destinationName: 'Hungary' },
    // Peru to West Africa - across Atlantic
    { from: [-68.1193, -16.4897] as [number, number], to: [-1.0232, 7.9465] as [number, number], via: [[-35, -15], [-20, -5]] as [number, number][], establishedYear: 1500, destinationName: 'West Africa' },
    // From Goa to Sichuan - coastal route
    { from: [73.8567, 15.2993] as [number, number], to: [104.0665, 30.5728] as [number, number], via: [[85, 15], [95, 18]] as [number, number][], establishedYear: 1570, destinationName: 'Sichuan, China' },
    // Silk Road route: From Persia/Ottoman to Samarkand (overland)
    { from: [37.1343, 36.2021] as [number, number], to: [66.9597, 39.6542] as [number, number], via: [[45, 37], [52, 36], [58, 38]] as [number, number][], establishedYear: 1550, destinationName: 'Samarkand (Silk Road)', isOverland: true },
    // Return route: West Africa to Caribbean - African cultivars cross back
    { from: [-1.0232, 7.9465] as [number, number], to: [-66.1057, 18.4655] as [number, number], via: [[-20, 8], [-40, 12]] as [number, number][], establishedYear: 1510, destinationName: 'Caribbean Islands' },
    // Return route: Spain/Portugal to Caribbean - European cultivation returns
    { from: [-6.3508, 36.7783] as [number, number], to: [-66.1057, 18.4655] as [number, number], via: [[-20, 32], [-45, 25]] as [number, number][], establishedYear: 1510, destinationName: 'Caribbean Islands' },
    // Manila-Acapulco Galleon Route - Pacific crossing from Acapulco to Manila (westward)
    // Using continuous westward coordinates past -180 to prevent antimeridian rendering issues
    // Manila (121.774°E) expressed as -238.226° for continuous westward path
    { from: [-99.9, 16.85] as [number, number], to: [-238.226, 12.8797] as [number, number], via: [[-110, 15], [-130, 12], [-150, 10], [-170, 8], [-190, 8], [-210, 10], [-225, 12]] as [number, number][], establishedYear: 1542, destinationName: 'Philippines' },
    // Columbus return voyage: La Isabela, Hispaniola to Sanlúcar de Barrameda, Spain (1493)
    { from: [-71.08, 19.82] as [number, number], to: [-6.3508, 36.7783] as [number, number], via: [[-55, 25], [-35, 32], [-20, 35]] as [number, number][], establishedYear: 1493, destinationName: 'Sanlúcar de Barrameda, Spain' },
    // Philippines to Thailand - South China Sea route
    { from: [121.774, 12.8797] as [number, number], to: [100.5018, 13.7563] as [number, number], via: [[115, 10], [108, 8], [105, 10]] as [number, number][], establishedYear: 1550, destinationName: 'Thailand' },
    // Thailand to Cochin - across Bay of Bengal and around Sri Lanka
    { from: [100.5018, 13.7563] as [number, number], to: [76.2673, 9.9312] as [number, number], via: [[92, 10], [85, 8], [80, 8]] as [number, number][], establishedYear: 1550, destinationName: 'Cochin, India' },
    
    // === PORTUGUESE TRADE NETWORK ===
    
    // Carreira da Índia (Cape Route): Lisbon to Mozambique
    { from: [-9.1393, 38.7223] as [number, number], to: [40.7347, -15.0344] as [number, number], via: [[-15, 30], [-18, 15], [-10, 0], [0, -15], [15, -30], [25, -35], [35, -25]] as [number, number][], establishedYear: 1507, destinationName: 'Mozambique Island' },
    
    // Mozambique to Goa - continuation of Cape Route
    { from: [40.7347, -15.0344] as [number, number], to: [73.8567, 15.2993] as [number, number], via: [[45, -10], [50, 0], [60, 10], [68, 14]] as [number, number][], establishedYear: 1507, destinationName: 'Goa, India' },
    
    // Goa to Cochin - Malabar Coast trade
    { from: [73.8567, 15.2993] as [number, number], to: [76.2673, 9.9312] as [number, number], via: [[74, 12]] as [number, number][], establishedYear: 1503, destinationName: 'Cochin, India' },
    
    // Cochin to Mozambique - spices returning to Africa (1500)
    { from: [76.2673, 9.9312] as [number, number], to: [40.7347, -15.0344] as [number, number], via: [[68, 5], [55, -5], [48, -12]] as [number, number][], establishedYear: 1500, destinationName: 'Mozambique Island' },
    
    // Goa to Mozambique - direct route (1500)
    { from: [73.8567, 15.2993] as [number, number], to: [40.7347, -15.0344] as [number, number], via: [[65, 8], [55, 0], [48, -8]] as [number, number][], establishedYear: 1500, destinationName: 'Mozambique Island' },
    
    // Mozambique to Lisbon - Cape Route return voyage (1500)
    { from: [40.7347, -15.0344] as [number, number], to: [-9.1393, 38.7223] as [number, number], via: [[30, -28], [18, -35], [5, -35], [-10, -25], [-15, -5], [-15, 20], [-12, 35]] as [number, number][], establishedYear: 1500, destinationName: 'Lisbon, Portugal' },
    
    // Mozambique to West Africa - along African coast (1500)
    { from: [40.7347, -15.0344] as [number, number], to: [-1.0232, 7.9465] as [number, number], via: [[25, -25], [15, -30], [5, -25], [-5, -10], [-5, 0]] as [number, number][], establishedYear: 1500, destinationName: 'West Africa' },
    
    // Mozambique to Caribbean - transatlantic via Cape (1500)
    { from: [40.7347, -15.0344] as [number, number], to: [-66.1057, 18.4655] as [number, number], via: [[25, -28], [10, -35], [-10, -30], [-30, -15], [-45, 5], [-55, 15]] as [number, number][], establishedYear: 1500, destinationName: 'Caribbean Islands' },
    
    // Goa to Hormuz - Persian Gulf connection
    { from: [73.8567, 15.2993] as [number, number], to: [56.4547, 27.0769] as [number, number], via: [[68, 18], [62, 22]] as [number, number][], establishedYear: 1515, destinationName: 'Hormuz' },
    
    // Goa to Malacca - Bay of Bengal crossing
    { from: [73.8567, 15.2993] as [number, number], to: [102.2501, 2.1896] as [number, number], via: [[80, 12], [88, 8], [95, 5]] as [number, number][], establishedYear: 1511, destinationName: 'Malacca' },
    
    // Malacca to Ternate - through Indonesian archipelago
    { from: [102.2501, 2.1896] as [number, number], to: [127.3866, 0.7893] as [number, number], via: [[108, 0], [115, -2], [122, 0]] as [number, number][], establishedYear: 1522, destinationName: 'Ternate (Moluccas)' },
    
    // Malacca to Macao - South China Sea route
    { from: [102.2501, 2.1896] as [number, number], to: [113.5439, 22.1987] as [number, number], via: [[105, 8], [108, 15]] as [number, number][], establishedYear: 1557, destinationName: 'Macao' },
    
    // Goa to Lisbon - return voyage (full Carreira da Índia)
    { from: [73.8567, 15.2993] as [number, number], to: [-9.1393, 38.7223] as [number, number], via: [[60, 10], [45, -5], [30, -25], [18, -35], [0, -30], [-10, -10], [-15, 20], [-12, 35]] as [number, number][], establishedYear: 1499, destinationName: 'Lisbon, Portugal' },
    
    // South America (Peru/Bolivia) to Lisbon - direct Atlantic route via Brazil
    { from: [-68.1193, -16.4897] as [number, number], to: [-9.1393, 38.7223] as [number, number], via: [[-50, -20], [-35, -15], [-25, 0], [-18, 20], [-12, 35]] as [number, number][], establishedYear: 1500, destinationName: 'Lisbon, Portugal' },
  ] as RouteData[],
};

// Route layer IDs for each route index
const getRouteLayerIds = (index: number) => [
  `route-aura-${index}`,
  `route-glow-outer-${index}`,
  `route-glow-inner-${index}`,
  `route-line-${index}`,
  `route-highlight-${index}`,
];

export function TradeRouteMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const markerElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const eventMarkerRef = useRef<maplibregl.Marker | null>(null);
  const eventMarkerElementRef = useRef<HTMLDivElement | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof tradeRoutes.origins[0] | null>(null);
  const [timelineYear, setTimelineYear] = useState<number>(-4000);
  const [currentEvent, setCurrentEvent] = useState<TimelineEvent | null>(null);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [baseMapError, setBaseMapError] = useState<string | null>(null);
  const [focusedRegion, setFocusedRegion] = useState<string | null>(null);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number | undefined>(undefined);
  const previousVisibleRoutesRef = useRef<Set<number>>(new Set());
  const dashOffsetRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  
  // REFS TO FIX STALE CLOSURES - MapLibre event handlers capture these refs, not stale state
  const timelineYearRef = useRef<number>(timelineYear);
  const selectedTimelineIndexRef = useRef<number | undefined>(selectedTimelineIndex);
  
  // Keep refs in sync with state
  useEffect(() => {
    timelineYearRef.current = timelineYear;
  }, [timelineYear]);
  
  useEffect(() => {
    selectedTimelineIndexRef.current = selectedTimelineIndex;
  }, [selectedTimelineIndex]);

  // Handle region focus button click
  const handleRegionFocus = useCallback((region: RegionPreset) => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: region.center,
      zoom: region.zoom,
      duration: 1500,
      essential: true,
      easing: (t) => t * (2 - t), // ease-out-quad
    });
    
    setFocusedRegion(region.id);
  }, []);

  // Year to locations mapping for timeline sync
  const yearToLocations: Record<number, string[]> = {
    '-4000': ['Mesoamerica'],
    '-3000': ['Mesoamerica', 'Peru & Bolivia'],
    '1493': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola'],
    '1498': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India'],
    '1499': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal'],
    '1500': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India'],
    '1503': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India'],
    '1507': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India'],
    '1510': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India', 'Caribbean Islands'],
    '1511': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca'],
    '1515': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz'],
    '1522': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)'],
    '1542': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Philippines'],
    '1550': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Philippines', 'Thailand', 'Samarkand (Silk Road)'],
    '1557': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Philippines', 'Thailand', 'Samarkand (Silk Road)', 'Macao'],
    '1569': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Philippines', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Hungary'],
    '1570': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Philippines', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Hungary', 'Sichuan, China'],
    '1600': ['Mesoamerica', 'Peru & Bolivia', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Philippines', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Hungary', 'Sichuan, China', 'Aleppo, Syria', 'Gaziantep, Turkey'],
  };

  const getVisibleLocations = useCallback((year: number): string[] => {
    const years = Object.keys(yearToLocations).map(Number).sort((a, b) => a - b);
    let visibleYear = years[0];
    for (const y of years) {
      if (y <= year) visibleYear = y;
      else break;
    }
    return yearToLocations[String(visibleYear)] || [];
  }, []);

  // Get visible routes based on timeline year
  const getVisibleRoutes = useCallback((year: number): Set<number> => {
    const visibleRoutes = new Set<number>();
    tradeRoutes.routes.forEach((route, index) => {
      if (year >= route.establishedYear) {
        visibleRoutes.add(index);
      }
    });
    return visibleRoutes;
  }, []);

  // Find timeline event index by location name
  const findTimelineEventByLocation = useCallback((locationName: string): number => {
    return timelineEvents.findIndex(event => 
      event.location === locationName || 
      event.location.includes(locationName) || 
      locationName.includes(event.location.split(',')[0])
    );
  }, []);

  // Handle location click -> sync with timeline
  // IMPORTANT: Never move timeline backward to prevent routes from disappearing
  // Uses refs to get current values, not stale closure values
  const handleLocationClick = useCallback((location: typeof tradeRoutes.origins[0]) => {
    setSelectedLocation(location);
    
    // Find matching timeline event
    const eventIndex = findTimelineEventByLocation(location.name);
    if (eventIndex !== -1) {
      const clickedEvent = timelineEvents[eventIndex];
      // Use REF to get current timeline year (not stale closure value)
      const currentYear = timelineYearRef.current;
      
      // Only advance timeline forward (by comparing YEARS, not indices)
      // This prevents routes from disappearing when clicking earlier locations
      if (clickedEvent.year > currentYear) {
        setSelectedTimelineIndex(eventIndex);
      }
      // If clicking an earlier location, just select it but keep timeline where it is
    }
  }, [findTimelineEventByLocation]);

  // Handle timeline event selection (from clicking timeline markers)
  const handleTimelineEventSelect = useCallback((index: number) => {
    setSelectedTimelineIndex(index);
  }, []);

  // Calculate visible routes for current year
  const visibleRoutes = useMemo(() => getVisibleRoutes(timelineYear), [timelineYear, getVisibleRoutes]);


  // Update route visibility and trigger shimmer effects
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const m = map.current;
    const prevVisible = previousVisibleRoutesRef.current;
    const currentVisible = visibleRoutes;

    tradeRoutes.routes.forEach((route, index) => {
      const isVisible = currentVisible.has(index);
      const wasVisible = prevVisible.has(index);
      const isNewlyVisible = isVisible && !wasVisible;

      const layerIds = getRouteLayerIds(index);

      // Base opacities for each layer type
      const baseOpacities: Record<string, number> = {
        'aura': 0.08,
        'glow-outer': 0.15,
        'glow-inner': 0.25,
        'line': 0.9,
        'highlight': 0.4,
      };

      // Ghost opacity - hide routes until their timeline year is reached
      const ghostOpacity = 0;

      layerIds.forEach((layerId) => {
        try {
          const layerType = layerId.includes('aura') ? 'aura' :
                           layerId.includes('glow-outer') ? 'glow-outer' :
                           layerId.includes('glow-inner') ? 'glow-inner' :
                           layerId.includes('highlight') ? 'highlight' : 'line';

          const targetOpacity = isVisible ? baseOpacities[layerType] : ghostOpacity;

          if (isNewlyVisible) {
            // Shimmer effect: flash brighter then settle
            const shimmerOpacity = Math.min(1, baseOpacities[layerType] * 3);
            m.setPaintProperty(layerId, 'line-opacity', shimmerOpacity);

            // Settle to normal opacity after shimmer
            setTimeout(() => {
              if (m.getLayer(layerId)) {
                m.setPaintProperty(layerId, 'line-opacity', targetOpacity);
              }
            }, 800);
          } else {
            m.setPaintProperty(layerId, 'line-opacity', targetOpacity);
          }
        } catch (e) {
          // Layer may not exist yet
        }
      });

      // Sync marker animations - target inner div to avoid conflicting with MapLibre's positioning transform
      const destMarkerEl = markerElementsRef.current.get(route.destinationName);
      if (destMarkerEl) {
        const innerEl = destMarkerEl.querySelector('.marker-inner') as HTMLElement;
        if (isNewlyVisible) {
          destMarkerEl.classList.add('marker-pulse');
          setTimeout(() => destMarkerEl.classList.remove('marker-pulse'), 1500);
        }
        destMarkerEl.style.opacity = isVisible ? '1' : '0.3';
        // Apply scale to inner element only, not the outer marker wrapper
        if (innerEl) {
          innerEl.style.transform = isVisible ? 'scale(1)' : 'scale(0.7)';
        }
      }
    });

    previousVisibleRoutesRef.current = new Set(currentVisible);
  }, [visibleRoutes, isMapLoaded]);

  // Event marker animation - highlights the current timeline event location
  useEffect(() => {
    if (!map.current || !isMapLoaded || !currentEvent) return;

    const m = map.current;

    // Create or update event marker
    if (!eventMarkerElementRef.current) {
      const el = document.createElement('div');
      el.className = 'event-marker';
      el.innerHTML = `
        <div class="event-marker-pulse"></div>
        <div class="event-marker-ring"></div>
        <div class="event-marker-core"></div>
      `;
      eventMarkerElementRef.current = el;
    }

    const el = eventMarkerElementRef.current;

    // Style based on event type
    const isOrigin = currentEvent.isOrigin;
    const hasRoute = currentEvent.hasRoute;
    
    // Remove previous marker
    if (eventMarkerRef.current) {
      eventMarkerRef.current.remove();
    }

    // Create new marker at event location
    eventMarkerRef.current = new maplibregl.Marker({ 
      element: el,
      anchor: 'center'
    })
      .setLngLat(currentEvent.coordinates)
      .addTo(m);

    // Trigger animation by removing and re-adding class
    el.classList.remove('event-active');
    void el.offsetWidth; // Force reflow
    el.classList.add('event-active');

    // Set colors based on event type
    if (isOrigin) {
      el.style.setProperty('--event-color', '#8b2942');
      el.style.setProperty('--event-glow', 'rgba(139, 41, 66, 0.6)');
    } else if (hasRoute) {
      el.style.setProperty('--event-color', '#d4a84b');
      el.style.setProperty('--event-glow', 'rgba(212, 168, 75, 0.6)');
    } else {
      // Special events without routes (Columbus, Philippines)
      el.style.setProperty('--event-color', '#4a7c59');
      el.style.setProperty('--event-glow', 'rgba(74, 124, 89, 0.6)');
    }

    // Pan map to focus on event
    m.easeTo({
      center: currentEvent.coordinates,
      duration: 1000,
      easing: (t) => t * (2 - t), // ease-out-quad
    });

  }, [currentEvent, isMapLoaded]);

  // Flowing dash animation - STABILIZED to prevent MapLibre crashes
  // Uses constant dasharray with opacity pulse instead of mutating dasharray values
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const m = map.current;
    let frameCount = 0;

    const animateDashes = () => {
      frameCount++;
      
      // Only update every 10th frame to reduce load and prevent instability
      if (frameCount % 10 === 0) {
        tradeRoutes.routes.forEach((route, index) => {
          if (visibleRoutes.has(index)) {
            const highlightLayerId = `route-highlight-${index}`;
            try {
              // Check if layer exists before setting property
              if (!m.getLayer(highlightLayerId)) return;
              
              // Use sinusoidal variation that ALWAYS stays positive (min 4, max 12)
              // This prevents zero/negative dasharray values that crash MapLibre
              const phase = (frameCount * 0.02) % (Math.PI * 2);
              const dashLength = 8 + Math.sin(phase) * 2;  // Range: 6 to 10
              const gapLength = 12 + Math.cos(phase) * 2;  // Range: 10 to 14
              
              // Extra safety: clamp values to ensure they're always valid
              const safeDash = Math.max(4, dashLength);
              const safeGap = Math.max(4, gapLength);
              
              m.setPaintProperty(highlightLayerId, 'line-dasharray', [safeDash, safeGap]);
            } catch (e) {
              // Layer may not exist or map may be in transition - silently ignore
            }
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(animateDashes);
    };

    animateDashes();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMapLoaded, visibleRoutes]);

  const STYLE_VERSION = 'ne110m-local-v3';

  // Generate graticule (lat/long grid lines) GeoJSON for nautical navigation feel
  const generateGraticule = (): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = [];
    
    // Longitude lines (meridians) every 30 degrees
    for (let lon = -180; lon <= 180; lon += 30) {
      const coords: [number, number][] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        coords.push([lon, lat]);
      }
      features.push({
        type: 'Feature',
        properties: { type: 'meridian', value: lon },
        geometry: { type: 'LineString', coordinates: coords },
      });
    }
    
    // Latitude lines (parallels) every 30 degrees
    for (let lat = -60; lat <= 60; lat += 30) {
      const coords: [number, number][] = [];
      for (let lon = -180; lon <= 180; lon += 5) {
        coords.push([lon, lat]);
      }
      features.push({
        type: 'Feature',
        properties: { type: 'parallel', value: lat },
        geometry: { type: 'LineString', coordinates: coords },
      });
    }
    
    // Special lines: Equator, Tropics, Arctic/Antarctic circles
    const specialLatitudes = [
      { lat: 0, name: 'Equator' },
      { lat: 23.5, name: 'Tropic of Cancer' },
      { lat: -23.5, name: 'Tropic of Capricorn' },
    ];
    
    specialLatitudes.forEach(({ lat, name }) => {
      const coords: [number, number][] = [];
      for (let lon = -180; lon <= 180; lon += 2) {
        coords.push([lon, lat]);
      }
      features.push({
        type: 'Feature',
        properties: { type: 'special', name, value: lat },
        geometry: { type: 'LineString', coordinates: coords },
      });
    });
    
    return { type: 'FeatureCollection', features };
  };

  // Custom antique nautical chart style using bundled Natural Earth GeoJSON (no external tile auth)
  const antiqueMapStyle: maplibregl.StyleSpecification = {
    version: 8,
    name: 'Antique Nautical Chart (Local)',
    sources: {
      land: {
        type: 'geojson',
        data: '/data/ne_110m_land.geojson',
      },
      lakes: {
        type: 'geojson',
        data: '/data/ne_110m_lakes.geojson',
      },
      coastline: {
        type: 'geojson',
        data: '/data/ne_110m_coastline.geojson',
      },
      graticule: {
        type: 'geojson',
        data: generateGraticule(),
      },
    },
    layers: [
      // Parchment ocean background - aged paper with subtle texture effect
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#e4d5b7', // Warmer, more aged parchment
        },
      },
      // Graticule lines - delicate hand-drawn navigational grid
      {
        id: 'graticule-lines',
        type: 'line',
        source: 'graticule',
        filter: ['!=', ['get', 'type'], 'special'],
        paint: {
          'line-color': '#5a4a3a',
          'line-width': 0.3,
          'line-opacity': 0.12,
          'line-dasharray': [8, 12],
        },
      },
      // Special latitude lines (Equator, Tropics) - subtle emphasis
      {
        id: 'graticule-special',
        type: 'line',
        source: 'graticule',
        filter: ['==', ['get', 'type'], 'special'],
        paint: {
          'line-color': '#3a2a1a',
          'line-width': 0.5,
          'line-opacity': 0.15,
          'line-dasharray': [12, 8],
        },
      },
      // Land mass fill - aged vellum appearance
      {
        id: 'land',
        type: 'fill',
        source: 'land',
        paint: {
          'fill-color': '#c9b896', // Softer, more authentic parchment land
          'fill-opacity': 1,
        },
      },
      // Inland water (lakes)
      {
        id: 'lakes',
        type: 'fill',
        source: 'lakes',
        paint: {
          'fill-color': '#d8ccb4',
          'fill-opacity': 0.9,
        },
      },
      // Coastline - hand-inked stroke appearance
      {
        id: 'coastline',
        type: 'line',
        source: 'coastline',
        paint: {
          'line-color': '#4a3a2a',
          'line-width': 1.6,
          'line-opacity': 0.7,
        },
      },
    ],
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    setBaseMapError(null);

    let handleMapError: ((e: unknown) => void) | null = null;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: antiqueMapStyle,
        zoom: 1.8,
        center: [-30, 15], // Centered to show all trade routes including Pacific
        pitch: 10,
        bearing: 0,
        attributionControl: false,
      });

      const m = map.current;

      // If the basemap sources fail to load, surface it in-UI (avoid silent failures)
      handleMapError = (e: any) => {
        const sourceId = e?.sourceId;
        const isBasemapSource = sourceId === 'land' || sourceId === 'lakes' || sourceId === 'coastline' || !sourceId;
        if (e?.error && isBasemapSource) {
          setBaseMapError('Base chart unavailable (failed to load map data).');
        }
      };
      m?.on('error', handleMapError);

      // Remove modern navigation controls for historical immersion
      // Users can still pan/drag the map

      m?.scrollZoom.disable();

      m?.on('load', () => {
        setBaseMapError(null);

        // Add trade route lines with antique styling
        tradeRoutes.routes.forEach((route, index) => {
          const coordinates = [route.from, ...route.via, route.to];

          m?.addSource(`route-${index}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates,
              },
            },
          });

          // Initial opacity - routes hidden until their timeline year is reached
          const ghostOpacity = 0;

          // Outermost diffuse glow - prestige aura
          m?.addLayer({
            id: `route-aura-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#5B005B', // Tyrian Purple
              'line-width': 18,
              'line-opacity': ghostOpacity,
              'line-blur': 8,
            },
          });

          // Secondary glow layer - rich purple halo
          m?.addLayer({
            id: `route-glow-outer-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#7B1A7B', // Lighter Tyrian Purple
              'line-width': 10,
              'line-opacity': ghostOpacity,
              'line-blur': 4,
            },
          });

          // Inner glow - concentrated prestige
          m?.addLayer({
            id: `route-glow-inner-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#8B2A8B',
              'line-width': 6,
              'line-opacity': ghostOpacity,
              'line-blur': 2,
            },
          });

          // Main route line - bold and intentional
          m?.addLayer({
            id: `route-line-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#5B005B', // Tyrian Purple
              'line-width': 3,
              'line-opacity': ghostOpacity,
            },
          });

          // Highlight stroke - precious metal accent
          m?.addLayer({
            id: `route-highlight-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#d4a84b', // Gold accent
              'line-width': 1,
              'line-opacity': ghostOpacity,
              'line-dasharray': [8, 12],
            },
          });
        });

        // Add click handler for routes - clicking a route selects it and advances timeline
        // USES REFS to avoid stale closure issues with state values
        m?.on('click', (e) => {
          // Query all route layers at click point
          const routeLayerIds: string[] = [];
          tradeRoutes.routes.forEach((_, index) => {
            routeLayerIds.push(`route-line-${index}`, `route-highlight-${index}`);
          });
          
          const features = m?.queryRenderedFeatures(e.point, {
            layers: routeLayerIds.filter(id => m?.getLayer(id))
          });
          
          if (features && features.length > 0) {
            // Extract route index from layer ID
            const layerId = features[0].layer?.id;
            const match = layerId?.match(/route-(?:line|highlight)-(\d+)/);
            if (match) {
              const routeIndex = parseInt(match[1], 10);
              const route = tradeRoutes.routes[routeIndex];
              
              if (route) {
                // Find the destination in our data
                const destination = tradeRoutes.destinations.find(d => d.name === route.destinationName);
                if (destination) {
                  setSelectedLocation(destination);
                }
                
                // USE REF to get current timeline year (not stale closure value)
                const currentYear = timelineYearRef.current;
                
                // If current timeline year is BEFORE this route's year, advance to show the route
                if (currentYear < route.establishedYear) {
                  // Find the timeline event for this route's year
                  const eventIndex = timelineEvents.findIndex(ev => ev.year >= route.establishedYear);
                  if (eventIndex !== -1) {
                    setSelectedTimelineIndex(eventIndex);
                  }
                }
                // If timeline is already past this route's year, route should already be visible
                // No need to move timeline backward
              }
            }
          }
        });

        setIsMapLoaded(true);
      });

      // Add markers for origins - styled as compass roses
      tradeRoutes.origins.forEach((origin) => {
        const el = document.createElement('div');
        el.className = 'origin-marker';
        el.innerHTML = `
          <div class="marker-inner" style="
            width: 22px; 
            height: 22px; 
            background: radial-gradient(circle, #8b2942 40%, #6b1a32 100%);
            border: 2px solid #5a4a3a; 
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(90,74,58,0.5), inset 0 1px 2px rgba(255,255,255,0.2);
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 6px;
              height: 6px;
              background: #d4a84b;
              border-radius: 50%;
            "></div>
          </div>
        `;
        el.addEventListener('click', () => handleLocationClick(origin));
        markerElementsRef.current.set(origin.name, el);

        const marker = new maplibregl.Marker({ element: el }).setLngLat(origin.coordinates).addTo(m!);
        markersRef.current.push(marker);
      });

      // Add markers for destinations - styled as antique port markers
      tradeRoutes.destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '0.3';
        // Do NOT set transform on outer element - it will override MapLibre's positioning
        el.innerHTML = `
          <div class="marker-inner" style="
            width: 14px; 
            height: 14px; 
            background: radial-gradient(circle, #c4a86a 30%, #a08050 100%);
            border: 1.5px solid #5a4a3a; 
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(90,74,58,0.4), inset 0 1px 1px rgba(255,255,255,0.15);
            transform: scale(0.7);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          "></div>
        `;
        el.addEventListener('click', () => handleLocationClick(dest));
        markerElementsRef.current.set(dest.name, el);

        const marker = new maplibregl.Marker({ element: el }).setLngLat(dest.coordinates).addTo(m!);
        markersRef.current.push(marker);
      });

      // Removed auto-rotation to maintain narrative focus on Mediterranean region

    } catch (error) {
      console.error('Error initializing map:', error);
      setBaseMapError('Base chart unavailable (map failed to initialize).');
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (map.current && handleMapError) {
        map.current.off('error', handleMapError);
      }
      // Clean up event marker
      if (eventMarkerRef.current) {
        eventMarkerRef.current.remove();
        eventMarkerRef.current = null;
      }
      eventMarkerElementRef.current = null;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerElementsRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, [STYLE_VERSION]);

  return (
    <div className="relative">
      {/* CSS for marker animations */}
      <style>{`
        @keyframes markerPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(212, 168, 75, 0.7);
          }
          50% {
            transform: scale(1.3);
            box-shadow: 0 0 20px 10px rgba(212, 168, 75, 0.4);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(212, 168, 75, 0);
          }
        }
        
        .marker-pulse .marker-inner {
          animation: markerPulse 1.5s ease-out;
        }
        
        .origin-marker:hover .marker-inner,
        .destination-marker:hover .marker-inner {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(90, 74, 58, 0.6), 0 0 20px rgba(212, 168, 75, 0.3);
        }

        /* Event marker styles */
        .event-marker {
          --event-color: #d4a84b;
          --event-glow: rgba(212, 168, 75, 0.6);
          position: relative;
          width: 80px;
          height: 80px;
          pointer-events: none;
        }

        .event-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--event-glow);
          opacity: 0;
        }

        .event-marker-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid var(--event-color);
          opacity: 0;
        }

        .event-marker-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--event-color);
          border: 2px solid #5a4a3a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          opacity: 0;
        }

        @keyframes eventPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }

        @keyframes eventRing {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }

        @keyframes eventCore {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          30% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        .event-marker.event-active .event-marker-pulse {
          animation: eventPulse 2s ease-out infinite;
        }

        .event-marker.event-active .event-marker-ring {
          animation: eventRing 2s ease-out infinite;
          animation-delay: 0.3s;
        }

        .event-marker.event-active .event-marker-core {
          animation: eventCore 0.6s ease-out forwards;
        }
      `}</style>

      {/* Engraved border frame */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 border-4 border-[#5a4a3a]/20" />
        <div className="absolute inset-[4px] border border-[#5a4a3a]/15" />
        <div className="absolute inset-[8px] border border-[#5a4a3a]/10" />
        
        {/* Corner ornaments */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#5a4a3a]/40" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#5a4a3a]/40" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#5a4a3a]/40" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#5a4a3a]/40" />
      </div>

      {baseMapError && (
        <div className="absolute top-4 left-4 z-30 max-w-xs">
          <CartoucheBorder variant="panel">
            <p className="font-body text-xs text-muted-foreground">{baseMapError}</p>
          </CartoucheBorder>
        </div>
      )}
      
      <div key={STYLE_VERSION} ref={mapContainer} className="aspect-[21/9] md:aspect-[2.5/1]" />
      
      {/* Subtle engraved grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #5a4a3a 1px, transparent 1px),
            linear-gradient(to bottom, #5a4a3a 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Vignette overlay - balanced focus on Atlantic trade corridor */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 85% 90% at 45% 50%,
              transparent 0%,
              transparent 50%,
              rgba(232, 220, 196, 0.25) 65%,
              rgba(232, 220, 196, 0.5) 80%,
              rgba(232, 220, 196, 0.75) 100%
            )
          `,
        }}
      />
      
      {/* Right edge fade - de-emphasis for distant East */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to left,
              rgba(232, 220, 196, 0.85) 0%,
              rgba(232, 220, 196, 0.5) 12%,
              rgba(232, 220, 196, 0.15) 25%,
              transparent 45%
            )
          `,
        }}
      />
      
      {/* Aged paper overlay - stains, creases, foxing */}
      <AgedPaperOverlay />
      
      {/* Decorative ship silhouettes suggesting trade movement */}
      <div className="absolute pointer-events-none hidden md:block" style={{ top: '35%', left: '28%' }}>
        <ShipSilhouette className="w-14 h-10 opacity-50" style={{ transform: 'rotate(25deg)' }} />
      </div>
      <div className="absolute pointer-events-none hidden md:block" style={{ top: '55%', left: '18%' }}>
        <ShipSilhouette className="w-12 h-8 opacity-35" style={{ transform: 'rotate(-15deg)' }} />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ top: '40%', left: '45%' }}>
        <ShipSilhouette className="w-10 h-7 opacity-25" style={{ transform: 'rotate(10deg)' }} />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ top: '28%', right: '30%' }}>
        <ShipSilhouette className="w-9 h-6 opacity-20" style={{ transform: 'rotate(-5deg) scaleX(-1)' }} />
      </div>
      
      {/* Sea creatures - period cartographic decoration */}
      <div className="absolute pointer-events-none hidden md:block" style={{ bottom: '28%', left: '6%' }}>
        <SeaCreature className="w-20 h-8" variant="serpent" />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ top: '58%', right: '32%' }}>
        <SeaCreature className="w-14 h-8" variant="whale" />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ bottom: '35%', right: '12%' }}>
        <SeaCreature className="w-16 h-6" variant="serpent" />
      </div>
      
      {/* Wind heads - classical cartographic element */}
      <div className="absolute pointer-events-none hidden md:block" style={{ top: '18%', right: '6%' }}>
        <WindHead className="w-12 h-10 opacity-80" direction="west" />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ bottom: '32%', left: '2%' }}>
        <WindHead className="w-10 h-8 opacity-70" direction="east" />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ top: '65%', left: '5%' }}>
        <WindHead className="w-9 h-7 opacity-50" direction="east" />
      </div>
      
      {/* Narrative annotations - subtle period text */}
      <NarrativeAnnotation 
        text="Terra Incognita" 
        className="absolute hidden lg:block"
        style={{ bottom: '22%', left: '6%', transform: 'rotate(-5deg)' }}
      />
      <NarrativeAnnotation 
        text="Mare Atlanticum" 
        className="absolute hidden md:block text-[12px]"
        style={{ top: '40%', left: '30%', transform: 'rotate(-2deg)', letterSpacing: '0.25em' }}
      />
      <NarrativeAnnotation 
        text="Via delle Spezie" 
        className="absolute hidden lg:block"
        style={{ top: '30%', right: '20%', transform: 'rotate(3deg)' }}
      />
      <NarrativeAnnotation 
        text="Novus Mundus" 
        className="absolute hidden md:block text-[12px]"
        style={{ top: '32%', left: '10%', transform: 'rotate(-8deg)', letterSpacing: '0.18em' }}
      />
      <NarrativeAnnotation 
        text="Oceanus Indicus" 
        className="absolute hidden lg:block text-[11px]"
        style={{ top: '55%', right: '28%', transform: 'rotate(5deg)', letterSpacing: '0.2em' }}
      />
      
      {/* Compass Rose - bottom left */}
      <div className="absolute bottom-16 left-4 z-10">
        <CompassRose className="w-20 h-20 md:w-24 md:h-24 opacity-70" />
      </div>
      
      {/* Region Quick-Focus Buttons - bottom right */}
      <div className="absolute bottom-16 right-4 z-10 hidden md:block">
        <div className="relative">
          {/* Decorative border */}
          <div className="absolute inset-0 border border-[#5a4a3a]/40 -m-0.5" />
          <div className="absolute inset-0 border border-[#5a4a3a]/20 -m-1" />
          
          <div className="bg-[#e8dcc4]/95 p-2 space-y-1.5">
            <p className="font-display text-[9px] uppercase tracking-[0.2em] text-[#5a4a3a]/70 text-center mb-2 border-b border-[#5a4a3a]/20 pb-1">
              Navigate
            </p>
            {regionPresets.map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionFocus(region)}
                className={`
                  w-full flex items-center gap-2 px-2.5 py-1.5 
                  border transition-all duration-200
                  font-body text-[10px] tracking-wide
                  group relative
                  ${focusedRegion === region.id 
                    ? 'bg-[#d4a84b]/20 border-[#d4a84b] text-[#3a2a1a]' 
                    : 'bg-transparent border-[#5a4a3a]/30 text-[#5a4a3a] hover:bg-[#d4a84b]/10 hover:border-[#d4a84b]/50'
                  }
                `}
                title={region.description}
              >
                <span className={`
                  transition-colors duration-200
                  ${focusedRegion === region.id ? 'text-[#d4a84b]' : 'text-[#5a4a3a]/60 group-hover:text-[#d4a84b]/80'}
                `}>
                  {region.icon}
                </span>
                <span className="flex-1 text-left">{region.shortName}</span>
                {focusedRegion === region.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4a84b]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Cartouche Title Element */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <CartoucheBorder variant="title">
          <h3 className="font-display text-xs uppercase tracking-[0.3em] text-[#3a2a1a] whitespace-nowrap">
            The Spice Trade Routes
          </h3>
        </CartoucheBorder>
      </div>
      
      {/* Selected Location Info Panel with Cartouche styling */}
      {selectedLocation && !isTimelinePlaying && (
        <div className="absolute top-16 left-4 z-10 max-w-xs">
          <CartoucheBorder variant="panel">
            <button 
              onClick={() => setSelectedLocation(null)}
              className="absolute top-2 right-2 text-[#5a4a3a] hover:text-[#3a2a1a] text-lg leading-none z-10"
            >
              ×
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary/80 border border-[#5a4a3a]" />
              <h4 className="font-display text-sm uppercase tracking-wide text-[#3a2a1a]">
                {selectedLocation.name}
              </h4>
            </div>
            <p className="font-body text-xs text-[#5a4a3a] mb-2 italic">
              Established: {selectedLocation.year}
            </p>
            <p className="font-body text-sm text-[#5a4a3a] leading-relaxed mb-3">
              {selectedLocation.description}
            </p>
            <div className="border-t border-[#5a4a3a]/30 pt-2 mb-2">
              <p className="font-heading text-[10px] uppercase tracking-wider text-[#6a5a4a] mb-1">
                Notable Cultivars
              </p>
              <p className="font-body text-xs text-[#3a2a1a]">
                {selectedLocation.cultivars.join(' • ')}
              </p>
            </div>
            {/* View in Timeline button */}
            {findTimelineEventByLocation(selectedLocation.name) !== -1 && (
              <button
                onClick={() => {
                  const eventIndex = findTimelineEventByLocation(selectedLocation.name);
                  if (eventIndex !== -1) {
                    setSelectedTimelineIndex(eventIndex);
                    setSelectedLocation(null);
                  }
                }}
                className="w-full mt-2 px-3 py-1.5 text-[10px] font-body uppercase tracking-wider
                  bg-[#d4a84b]/20 border border-[#d4a84b]/50 text-[#5a4a3a]
                  hover:bg-[#d4a84b]/30 hover:border-[#d4a84b] transition-colors"
              >
                ↓ View in Timeline
              </button>
            )}
          </CartoucheBorder>
        </div>
      )}

      {/* Timeline Panel */}
      <div className="border-t-2 border-[#5a4a3a]/30">
        <SpreadTimeline 
          onYearChange={setTimelineYear}
          onEventChange={setCurrentEvent}
          isPlaying={isTimelinePlaying}
          onPlayingChange={setIsTimelinePlaying}
          selectedEventIndex={selectedTimelineIndex}
          onEventSelect={handleTimelineEventSelect}
        />
      </div>

      {/* Legend - styled as antique cartouche */}
      <div className="absolute top-4 right-14 z-10">
        <div className="relative">
          <div className="absolute inset-0 border border-[#5a4a3a]/30" />
          <div className="absolute inset-[2px] border border-[#5a4a3a]/15" />
          <div className="bg-[#e8dcc4]/95 px-4 py-2.5 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-primary to-primary/80 border border-[#5a4a3a] shadow-sm" />
                <span className="font-body text-[#4a3a2a] tracking-wide italic">Origin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#c4a86a] to-[#a08050] border border-[#5a4a3a] shadow-sm" />
                <span className="font-body text-[#4a3a2a] tracking-wide italic">Trade Port</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4a7c59] border border-[#5a4a3a] shadow-sm" />
                <span className="font-body text-[#4a3a2a] tracking-wide italic">Key Event</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#8b5a2b] border-dashed border-t border-[#5a4a3a]" style={{ borderStyle: 'dashed' }} />
                <span className="font-body text-[#4a3a2a] tracking-wide italic">Silk Road</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
