import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SpreadTimeline, TimelineEvent, timelineEvents } from './SpreadTimeline';
import { CompassRose } from './CompassRose';
import { CartoucheBorder } from './CartoucheBorder';
import { ShipSilhouette, SeaCreature, WindHead, AgedPaperOverlay, NarrativeAnnotation } from './NarrativeElements';
import { smoothPath } from './routeGeometry';
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
      coordinates: [-9.139, 38.742] as [number, number],
      description: 'Hub of the Portuguese maritime empire. Center of the Carreira da Índia spice trade.',
      cultivars: ['Piri Piri', 'Portuguese varieties'],
      year: '1499',
    },
  ],
  destinations: [
    {
      name: 'Veracruz',
      coordinates: [-96.14, 19.19] as [number, number],
      description: 'Gulf port of departure — chilies travelled overland from the Mexican highlands before shipping across the Atlantic.',
      cultivars: ['New World peppers'],
      year: '1519',
    },
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
      coordinates: [73.897, 15.299] as [number, number],
      description: 'Portuguese capital of the Estado da Índia. Gateway to Asian spice trade.',
      cultivars: ['Kashmiri', 'Bhut Jolokia'],
      year: '1498',
    },
    {
      name: 'Cochin, India',
      coordinates: [76.25, 9.921] as [number, number],
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
      coordinates: [-66.086, 18.465] as [number, number],
      description: 'African and European pepper cultivars arrived via Atlantic trade routes, blending with native species.',
      cultivars: ['Scotch Bonnet', 'Caribbean Red', 'Datil'],
      year: '1510',
    },
    {
      name: 'Philippines',
      coordinates: [121.474, 12.88] as [number, number],
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
      coordinates: [40.683, -15.004] as [number, number],
      description: 'Key Portuguese resupply station on the Cape Route to India.',
      cultivars: ['Piri Piri', 'African varieties'],
      year: '1507',
    },
    {
      name: 'Hormuz',
      coordinates: [56.515, 27.181] as [number, number],
      description: 'Portuguese controlled this strategic strait, dominating Persian Gulf spice trade.',
      cultivars: ['Persian varieties'],
      year: '1515',
    },
    {
      name: 'Malacca',
      coordinates: [102.27, 2.19] as [number, number],
      description: 'Portuguese captured this strategic port in 1511, gateway to the Spice Islands.',
      cultivars: ['Southeast Asian varieties'],
      year: '1511',
    },
    {
      name: 'Ternate (Moluccas)',
      coordinates: [127.369, 0.799] as [number, number],
      description: 'The legendary Spice Islands. Portuguese reached here in 1522.',
      cultivars: ['Moluccan varieties'],
      year: '1522',
    },
    {
      name: 'Macao',
      coordinates: [113.544, 22.239] as [number, number],
      description: 'Portuguese trading post established in 1557, gateway to China.',
      cultivars: ['Chinese varieties'],
      year: '1557',
    },
    // === BRAZILIAN PORTS ===
    {
      name: 'Salvador (Bahia)',
      coordinates: [-38.472, -12.961] as [number, number],
      description: 'First capital of colonial Brazil. Major sugar and later spice export hub.',
      cultivars: ['Malagueta', 'Dedo de Moça'],
      year: '1549',
    },
    {
      name: 'Recife',
      coordinates: [-34.8811, -8.0476] as [number, number],
      description: 'Major sugar export port in northeast Brazil.',
      cultivars: ['Brazilian varieties'],
      year: '1537',
    },
    {
      name: 'Rio de Janeiro',
      coordinates: [-43.208, -22.887] as [number, number],
      description: 'Founded 1565, became major colonial port for gold and spices.',
      cultivars: ['Cumari', 'Biquinho'],
      year: '1565',
    },
    // === ADDITIONAL AFRICAN PORTS ===
    {
      name: 'Elmina (Gold Coast)',
      coordinates: [-1.334, 5.094] as [number, number],
      description: 'Portuguese fort established 1482. Key Gold Coast trading post.',
      cultivars: ['West African varieties'],
      year: '1482',
    },
    {
      name: 'Luanda',
      coordinates: [13.2343, -8.8390] as [number, number],
      description: 'Founded 1575. Major Portuguese trading post and gateway to Angolan ivory and spices.',
      cultivars: ['Angolan varieties'],
      year: '1575',
    },
    {
      name: 'São Tomé',
      coordinates: [6.7273, 0.3365] as [number, number],
      description: 'Portuguese sugar and spice colony. Key transit point for African pepper varieties.',
      cultivars: ['African peppers'],
      year: '1493',
    },
    {
      name: 'Cape Verde',
      coordinates: [-23.6052, 15.1111] as [number, number],
      description: 'Strategic resupply station on Atlantic routes to Africa and Americas.',
      cultivars: ['Malagueta'],
      year: '1462',
    },
    {
      name: 'Sofala',
      coordinates: [34.741, -20.131] as [number, number],
      description: 'Portuguese gold trading post on the Mozambique coast.',
      cultivars: ['East African varieties'],
      year: '1505',
    },
    {
      name: 'Mombasa',
      coordinates: [39.6682, -4.0435] as [number, number],
      description: 'East African port contested by Portuguese and Arabs. Fort Jesus built 1593.',
      cultivars: ['Swahili coast peppers'],
      year: '1505',
    },
  ],
  routes: [
    // Atlantic crossing to Spain, then to Aleppo via Mediterranean
    { from: [-96.14, 19.19] as [number, number], to: [37.1343, 36.2021] as [number, number], via: [[-95, 21], [-88, 22], [-83, 23.5], [-72, 28], [-45, 34], [-8, 36], [2, 38], [11, 38], [20, 35], [28, 34], [34, 35]] as [number, number][], establishedYear: 1600, destinationName: 'Aleppo, Syria' },
    // Portuguese route to Goa - around Cape of Good Hope
    { from: [-96.14, 19.19] as [number, number], to: [73.897, 15.299] as [number, number], via: [[-95, 21], [-88, 22], [-83, 23.5], [-74, 26], [-55, 18], [-40, 8], [-18, -8], [2, -28], [16, -36], [28, -37], [40, -34], [50, -28], [56, -12], [64, 2], [70, 10]] as [number, number][], establishedYear: 1498, destinationName: 'Goa, India' },
    // Atlantic to Spain, overland to Hungary
    { from: [-96.14, 19.19] as [number, number], to: [19.0402, 47.4979] as [number, number], via: [[-95, 21], [-88, 22], [-83, 23.5], [-72, 28], [-45, 34], [-6, 36], [-1, 37], [6, 40], [9, 43]] as [number, number][], establishedYear: 1569, destinationName: 'Hungary' },
    // Overland connector: Mexican highlands (origin) down to the Gulf port of Veracruz.
    { from: [-99.1332, 19.4326] as [number, number], to: [-96.14, 19.19] as [number, number], via: [[-97.6, 19.3]] as [number, number][], establishedYear: 1493, destinationName: 'Veracruz', isOverland: true },
    // Peru to West Africa - across Atlantic
    { from: [-68.1193, -16.4897] as [number, number], to: [-1.0232, 7.9465] as [number, number], via: [[-35, -15], [-20, -5]] as [number, number][], establishedYear: 1500, destinationName: 'West Africa' },
    // From Goa to Sichuan - coastal route
    { from: [73.897, 15.299] as [number, number], to: [104.0665, 30.5728] as [number, number], via: [[72, 12], [78, 4], [90, 9], [98, 16], [103, 22]] as [number, number][], establishedYear: 1570, destinationName: 'Sichuan, China' },
    // Silk Road route: From Persia/Ottoman to Samarkand (overland)
    { from: [37.1343, 36.2021] as [number, number], to: [66.9597, 39.6542] as [number, number], via: [[45, 37], [52, 36], [58, 38]] as [number, number][], establishedYear: 1550, destinationName: 'Samarkand (Silk Road)', isOverland: true },
    // Return route: West Africa to Caribbean - African cultivars cross back
    { from: [-1.0232, 7.9465] as [number, number], to: [-66.086, 18.465] as [number, number], via: [[-20, 8], [-40, 12]] as [number, number][], establishedYear: 1510, destinationName: 'Caribbean Islands' },
    // Return route: Spain/Portugal to Caribbean - European cultivation returns
    { from: [-6.3508, 36.7783] as [number, number], to: [-66.086, 18.465] as [number, number], via: [[-20, 32], [-45, 25]] as [number, number][], establishedYear: 1510, destinationName: 'Caribbean Islands' },
    // Manila-Acapulco Galleon Route - Pacific crossing from Acapulco to Manila (westward)
    // Using continuous westward coordinates past -180 to prevent antimeridian rendering issues
    // Manila (121.774°E) expressed as -238.226° for continuous westward path
    { from: [-99.9, 16.85] as [number, number], to: [-238.226, 12.8797] as [number, number], via: [[-110, 15], [-130, 12], [-150, 10], [-170, 8], [-190, 8], [-210, 10], [-225, 12]] as [number, number][], establishedYear: 1542, destinationName: 'Philippines' },
    // Columbus return voyage: La Isabela, Hispaniola to Sanlúcar de Barrameda, Spain (1493)
    { from: [-71.08, 19.82] as [number, number], to: [-6.3508, 36.7783] as [number, number], via: [[-55, 25], [-35, 32], [-20, 35]] as [number, number][], establishedYear: 1493, destinationName: 'Sanlúcar de Barrameda, Spain' },
    // Philippines to Thailand - South China Sea route
    { from: [121.474, 12.88] as [number, number], to: [100.5018, 13.7563] as [number, number], via: [[114, 11], [107, 7], [102, 8]] as [number, number][], establishedYear: 1550, destinationName: 'Thailand' },
    // Thailand to Cochin - across Bay of Bengal and around Sri Lanka
    { from: [100.5018, 13.7563] as [number, number], to: [76.25, 9.921] as [number, number], via: [[95, 8], [83, 4], [75.5, 7]] as [number, number][], establishedYear: 1550, destinationName: 'Cochin, India' },
    
    // === PORTUGUESE TRADE NETWORK ===
    
    // Carreira da Índia (Cape Route): Lisbon to Mozambique
    { from: [-9.139, 38.742] as [number, number], to: [40.683, -15.004] as [number, number], via: [[-12, 32], [-19, 30], [-23, 23], [-21, 13], [-19, 2], [5, -16], [12, -30], [20, -37], [30, -37], [38, -34], [41, -25], [41, -18]] as [number, number][], establishedYear: 1507, destinationName: 'Mozambique Island' },
    
    // Mozambique to Goa - continuation of Cape Route
    { from: [40.683, -15.004] as [number, number], to: [73.897, 15.299] as [number, number], via: [[45, -10], [50, 0], [60, 10], [68, 14]] as [number, number][], establishedYear: 1507, destinationName: 'Goa, India' },
    
    // Goa to Cochin - Malabar Coast trade
    { from: [73.897, 15.299] as [number, number], to: [76.25, 9.921] as [number, number], via: [[74, 12]] as [number, number][], establishedYear: 1503, destinationName: 'Cochin, India' },
    
    // Cochin to Mozambique - spices returning to Africa (1500)
    { from: [76.25, 9.921] as [number, number], to: [40.683, -15.004] as [number, number], via: [[68, 4], [56, -6], [45, -13], [42, -17]] as [number, number][], establishedYear: 1500, destinationName: 'Mozambique Island' },
    
    // Goa to Mozambique - direct route (1500)
    { from: [73.897, 15.299] as [number, number], to: [40.683, -15.004] as [number, number], via: [[64, 6], [54, -4], [45, -12], [42, -16]] as [number, number][], establishedYear: 1500, destinationName: 'Mozambique Island' },
    
    // Mozambique to Lisbon - Cape Route return voyage (1500)
    { from: [40.683, -15.004] as [number, number], to: [-9.139, 38.742] as [number, number], via: [[41, -20], [41, -27], [38, -34], [30, -37], [20, -37], [12, -30], [0, -14], [-19, 2], [-21, 13], [-23, 23], [-19, 30], [-12, 32]] as [number, number][], establishedYear: 1500, destinationName: 'Lisbon, Portugal' },
    
    // Mozambique to West Africa - along African coast (1500)
    { from: [40.683, -15.004] as [number, number], to: [-1.0232, 7.9465] as [number, number], via: [[41, -22], [40, -30], [30, -37], [18, -36], [5, -24], [-6, -6], [-4, 3]] as [number, number][], establishedYear: 1500, destinationName: 'West Africa' },
    
    // Mozambique to Caribbean - transatlantic via Cape (1500)
    { from: [40.683, -15.004] as [number, number], to: [-66.086, 18.465] as [number, number], via: [[41, -22], [40, -30], [30, -37], [16, -35], [0, -22], [-18, -6], [-38, 6], [-55, 14]] as [number, number][], establishedYear: 1500, destinationName: 'Caribbean Islands' },
    
    // Goa to Hormuz - Persian Gulf connection
    { from: [73.897, 15.299] as [number, number], to: [56.515, 27.181] as [number, number], via: [[67, 19], [61, 23], [58, 25]] as [number, number][], establishedYear: 1515, destinationName: 'Hormuz' },
    
    // Goa to Malacca - Bay of Bengal crossing
    { from: [73.897, 15.299] as [number, number], to: [102.27, 2.19] as [number, number], via: [[71, 12], [76, 5], [86, 4], [96, 7], [101, 3]] as [number, number][], establishedYear: 1511, destinationName: 'Malacca' },
    
    // Malacca to Ternate - through Indonesian archipelago
    { from: [102.27, 2.19] as [number, number], to: [127.369, 0.799] as [number, number], via: [[107.5, -4], [115, -6], [123, -7], [127, -2]] as [number, number][], establishedYear: 1522, destinationName: 'Ternate (Moluccas)' },
    
    // Malacca to Macao - South China Sea route
    { from: [102.27, 2.19] as [number, number], to: [113.544, 22.239] as [number, number], via: [[106, 6], [111, 12], [113, 18]] as [number, number][], establishedYear: 1557, destinationName: 'Macao' },
    
    // Goa to Lisbon - return voyage (full Carreira da Índia)
    { from: [73.897, 15.299] as [number, number], to: [-9.139, 38.742] as [number, number], via: [[64, 4], [56, -12], [50, -28], [38, -36], [28, -37], [18, -37], [8, -30], [0, -14], [-19, 2], [-21, 13], [-23, 23], [-19, 30], [-12, 32]] as [number, number][], establishedYear: 1499, destinationName: 'Lisbon, Portugal' },
    
    // South America (Peru/Bolivia) to Lisbon - direct Atlantic route via Brazil
    { from: [-68.1193, -16.4897] as [number, number], to: [-9.139, 38.742] as [number, number], via: [[-50, -20], [-35, -15], [-25, 0], [-18, 20], [-12, 35]] as [number, number][], establishedYear: 1500, destinationName: 'Lisbon, Portugal' },
    
    // === OVERLAND ASIAN ROUTES (1600) ===
    
    // Samarkand to Sichuan - Central Asian Silk Road
    { from: [66.9597, 39.6542] as [number, number], to: [104.0665, 30.5728] as [number, number], via: [[72, 40], [80, 38], [90, 35], [98, 32]] as [number, number][], establishedYear: 1600, destinationName: 'Sichuan, China', isOverland: true },
    
    // Hormuz to Aleppo - Persian overland route
    { from: [56.515, 27.181] as [number, number], to: [37.1343, 36.2021] as [number, number], via: [[52, 30], [48, 33], [44, 35]] as [number, number][], establishedYear: 1600, destinationName: 'Aleppo, Syria', isOverland: true },
    
    // Hormuz to Samarkand - through Persia to Central Asia
    { from: [56.515, 27.181] as [number, number], to: [66.9597, 39.6542] as [number, number], via: [[55, 32], [58, 35], [62, 38]] as [number, number][], establishedYear: 1600, destinationName: 'Samarkand (Silk Road)', isOverland: true },
    
    // Goa to Aleppo - overland via Persia
    { from: [73.897, 15.299] as [number, number], to: [37.1343, 36.2021] as [number, number], via: [[68, 22], [60, 28], [52, 32], [45, 35]] as [number, number][], establishedYear: 1600, destinationName: 'Aleppo, Syria', isOverland: true },
    
    // Macao to Sichuan - inland China route
    { from: [113.544, 22.239] as [number, number], to: [104.0665, 30.5728] as [number, number], via: [[110, 25], [107, 28]] as [number, number][], establishedYear: 1600, destinationName: 'Sichuan, China', isOverland: true },
    
    // Aleppo to Hungary - Ottoman/European overland
    { from: [37.1343, 36.2021] as [number, number], to: [19.0402, 47.4979] as [number, number], via: [[32, 38], [28, 41], [24, 44]] as [number, number][], establishedYear: 1600, destinationName: 'Hungary', isOverland: true },
    
    // Thailand to Sichuan - overland through Burma/Yunnan
    { from: [100.5018, 13.7563] as [number, number], to: [104.0665, 30.5728] as [number, number], via: [[100, 18], [101, 23], [102, 27]] as [number, number][], establishedYear: 1600, destinationName: 'Sichuan, China', isOverland: true },
    
    // === BRAZILIAN PORT ROUTES ===
    
    // Lisbon to Cape Verde - Atlantic island chain
    { from: [-9.139, 38.742] as [number, number], to: [-23.6052, 15.1111] as [number, number], via: [[-15, 30], [-20, 22]] as [number, number][], establishedYear: 1462, destinationName: 'Cape Verde' },
    
    // Cape Verde to Elmina (Gold Coast)
    { from: [-23.6052, 15.1111] as [number, number], to: [-1.334, 5.094] as [number, number], via: [[-18, 10], [-10, 6]] as [number, number][], establishedYear: 1482, destinationName: 'Elmina (Gold Coast)' },
    
    // Lisbon to Salvador (Bahia) - Brazil route
    { from: [-9.139, 38.742] as [number, number], to: [-38.472, -12.961] as [number, number], via: [[-20, 25], [-28, 10], [-35, -5]] as [number, number][], establishedYear: 1549, destinationName: 'Salvador (Bahia)' },
    
    // Lisbon to Recife
    { from: [-9.139, 38.742] as [number, number], to: [-34.8811, -8.0476] as [number, number], via: [[-22, 22], [-30, 8], [-32, -2]] as [number, number][], establishedYear: 1537, destinationName: 'Recife' },
    
    // Salvador to Lisbon - return voyage
    { from: [-38.472, -12.961] as [number, number], to: [-9.139, 38.742] as [number, number], via: [[-35, 0], [-25, 15], [-18, 30]] as [number, number][], establishedYear: 1549, destinationName: 'Lisbon, Portugal' },
    
    // Salvador to West Africa - triangular trade
    { from: [-38.472, -12.961] as [number, number], to: [-1.0232, 7.9465] as [number, number], via: [[-25, -8], [-15, 0], [-8, 5]] as [number, number][], establishedYear: 1550, destinationName: 'West Africa' },
    
    // Lisbon to Rio de Janeiro
    { from: [-9.139, 38.742] as [number, number], to: [-43.208, -22.887] as [number, number], via: [[-20, 25], [-28, 6], [-32, -10], [-42, -24]] as [number, number][], establishedYear: 1565, destinationName: 'Rio de Janeiro' },
    
    // === AFRICAN COASTAL ROUTES ===
    
    // Elmina to São Tomé
    { from: [-1.334, 5.094] as [number, number], to: [6.7273, 0.3365] as [number, number], via: [[2, 3]] as [number, number][], establishedYear: 1493, destinationName: 'São Tomé' },
    
    // São Tomé to Luanda
    { from: [6.7273, 0.3365] as [number, number], to: [13.2343, -8.8390] as [number, number], via: [[10, -4]] as [number, number][], establishedYear: 1575, destinationName: 'Luanda' },
    
    // Luanda to Salvador - transatlantic goods and spice route
    { from: [13.2343, -8.8390] as [number, number], to: [-38.472, -12.961] as [number, number], via: [[0, -10], [-20, -12]] as [number, number][], establishedYear: 1575, destinationName: 'Salvador (Bahia)' },
    
    // Sofala to Mozambique Island - East African coast
    { from: [34.741, -20.131] as [number, number], to: [40.683, -15.004] as [number, number], via: [[40, -18]] as [number, number][], establishedYear: 1505, destinationName: 'Mozambique Island' },
    
    // Mombasa to Mozambique Island
    { from: [39.6682, -4.0435] as [number, number], to: [40.683, -15.004] as [number, number], via: [[41.5, -9]] as [number, number][], establishedYear: 1505, destinationName: 'Mozambique Island' },
    
    // Lisbon to Sofala via Cape
    { from: [-9.139, 38.742] as [number, number], to: [34.741, -20.131] as [number, number], via: [[-12, 32], [-19, 30], [-23, 23], [-21, 13], [-19, 2], [5, -16], [12, -30], [20, -37], [30, -37], [36, -30], [37, -25]] as [number, number][], establishedYear: 1505, destinationName: 'Sofala' },
    
    // Goa to Mombasa - Indian Ocean route
    { from: [73.897, 15.299] as [number, number], to: [39.6682, -4.0435] as [number, number], via: [[62, 10], [50, 2], [45, -2]] as [number, number][], establishedYear: 1505, destinationName: 'Mombasa' },
  ] as RouteData[],
};

// Route layer IDs for each route index (reduced from 5 to 2 layers to prevent LineAtlas exhaustion)
const getRouteLayerIds = (index: number) => [
  `route-glow-${index}`,
  `route-line-${index}`,
];

// Precomputed smoothed geometry for every route — shared by the static
// rendering and the voyage animation so both trace the exact same curve.
const routePaths: [number, number][][] = tradeRoutes.routes.map(
  (r) => smoothPath([r.from, ...r.via, r.to]) as [number, number][]
);

// Bounding box of a path as [[minLng, minLat], [maxLng, maxLat]].
function pathBounds(path: [number, number][]): [[number, number], [number, number]] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of path) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [[minX, minY], [maxX, maxY]];
}

// Follow-cam zoom scaled to the voyage's geographic span (closer for short hops,
// wider for ocean crossings) so the "ship" stays framed as the camera tracks it.
function followZoomFor(path: [number, number][]): number {
  const [[a, b], [c, d]] = pathBounds(path);
  const span = Math.max(c - a, d - b);
  if (span > 140) return 2.1;
  if (span > 80) return 2.6;
  if (span > 40) return 3.1;
  if (span > 18) return 3.7;
  if (span > 8) return 4.3;
  return 5;
}

// The route to animate for a timeline event: one whose destination matches the
// event location, preferring the latest established on or before the event year.
function heroRouteForEvent(ev: TimelineEvent): number {
  const key = ev.location.split(/[,(]/)[0].trim().toLowerCase();
  let best = -1, bestYear = -Infinity;
  tradeRoutes.routes.forEach((r, i) => {
    const dn = r.destinationName.toLowerCase();
    const dnKey = dn.split(/[,(]/)[0].trim();
    if ((dn.includes(key) || key.includes(dnKey)) && r.establishedYear <= ev.year && r.establishedYear > bestYear) {
      best = i;
      bestYear = r.establishedYear;
    }
  });
  return best;
}

// Every named port (origins + destinations), for resolving a route endpoint
// coordinate back to a human-readable place name.
const allPorts = [...tradeRoutes.origins, ...tradeRoutes.destinations];
function portNameAt(coord: [number, number]): string {
  const p = allPorts.find(
    (pt) => Math.abs(pt.coordinates[0] - coord[0]) < 0.25 && Math.abs(pt.coordinates[1] - coord[1]) < 0.25
  );
  return p ? p.name : '';
}

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
  const [activeVoyage, setActiveVoyage] = useState<{ from: string; to: string } | null>(null);
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
    '1462': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde'],
    '1482': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)'],
    '1493': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé'],
    '1498': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India'],
    '1499': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal'],
    '1500': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India'],
    '1503': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India'],
    '1505': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India', 'Sofala', 'Mombasa'],
    '1507': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India', 'Sofala', 'Mombasa'],
    '1510': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Mozambique Island', 'Cochin, India', 'Sofala', 'Mombasa', 'Caribbean Islands'],
    '1511': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca'],
    '1515': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz'],
    '1522': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)'],
    '1537': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife'],
    '1542': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines'],
    '1549': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)'],
    '1550': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)', 'Thailand', 'Samarkand (Silk Road)'],
    '1557': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)', 'Thailand', 'Samarkand (Silk Road)', 'Macao'],
    '1565': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Rio de Janeiro'],
    '1569': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Rio de Janeiro', 'Hungary'],
    '1570': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Rio de Janeiro', 'Hungary', 'Sichuan, China'],
    '1575': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Rio de Janeiro', 'Hungary', 'Sichuan, China', 'Luanda'],
    '1600': ['Mesoamerica', 'Peru & Bolivia', 'Cape Verde', 'Elmina (Gold Coast)', 'Sanlúcar de Barrameda, Spain', 'La Isabela, Hispaniola', 'São Tomé', 'Goa, India', 'Lisbon, Portugal', 'West Africa', 'Cochin, India', 'Mozambique Island', 'Sofala', 'Mombasa', 'Caribbean Islands', 'Malacca', 'Hormuz', 'Ternate (Moluccas)', 'Recife', 'Philippines', 'Salvador (Bahia)', 'Thailand', 'Samarkand (Silk Road)', 'Macao', 'Rio de Janeiro', 'Hungary', 'Sichuan, China', 'Luanda', 'Aleppo, Syria', 'Gaziantep, Turkey'],
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

  // --- Voyage animation: progressively draw a route while the camera tracks the
  //     drawing tip (zoomed in), then pull back to frame the whole journey. ---
  const voyageRafRef = useRef<number | null>(null);
  const voyageTokenRef = useRef(0);
  const animatingRouteRef = useRef<number | null>(null);

  const animateVoyage = useCallback((routeIndex: number) => {
    const m = map.current;
    if (!m || !isMapLoaded) return;
    const path = routePaths[routeIndex];
    if (!path || path.length < 2) return;
    const src = m.getSource(`route-${routeIndex}`) as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    // Label the journey by its departure and arrival ports.
    const routeMeta = tradeRoutes.routes[routeIndex];
    setActiveVoyage({ from: portNameAt(routeMeta.from) || 'Origin', to: routeMeta.destinationName });

    // Supersede any voyage already in flight.
    const token = ++voyageTokenRef.current;
    if (voyageRafRef.current) { cancelAnimationFrame(voyageRafRef.current); voyageRafRef.current = null; }
    animatingRouteRef.current = routeIndex;

    const lineId = `route-line-${routeIndex}`;
    const glowId = `route-glow-${routeIndex}`;
    const setLine = (coords: [number, number][]) =>
      src.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });

    // Reveal the route's layers and reset it to the departure point.
    try {
      m.setPaintProperty(lineId, 'line-opacity', 0.85);
      m.setPaintProperty(glowId, 'line-opacity', 0.16);
    } catch { /* layer may not exist yet */ }
    setLine([path[0], path[0]]);

    const followZoom = followZoomFor(path);
    const drawMs = Math.min(5400, Math.max(2400, path.length * 18));

    // Phase 1 — sweep in to the port of departure.
    m.easeTo({ center: path[0], zoom: followZoom, duration: 1150, easing: (t) => t * (2 - t) });

    // Phase 2 — draw the line while the camera follows its leading edge.
    const startDraw = () => {
      if (token !== voyageTokenRef.current) return;
      let startTs: number | null = null;
      const frame = (ts: number) => {
        if (token !== voyageTokenRef.current) return;
        if (startTs === null) startTs = ts;
        const p = Math.min(1, (ts - startTs) / drawMs);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
        const k = Math.max(1, Math.round(eased * (path.length - 1)));
        setLine(path.slice(0, k + 1));
        m.setCenter(path[k]);
        if (p < 1) {
          voyageRafRef.current = requestAnimationFrame(frame);
        } else {
          setLine(path);
          // Phase 3 — pull back to reveal the full voyage.
          m.fitBounds(pathBounds(path), {
            padding: { top: 90, bottom: 140, left: 90, right: 90 },
            duration: 1950,
            maxZoom: 5.5,
            easing: (t) => t * (2 - t),
          });
          voyageRafRef.current = null;
          animatingRouteRef.current = null;
        }
      };
      voyageRafRef.current = requestAnimationFrame(frame);
    };
    window.setTimeout(startDraw, 1180);
  }, [isMapLoaded]);

  // Keep a stable ref so the (once-registered) map click handler always calls
  // the latest animateVoyage without a stale closure.
  const animateVoyageRef = useRef(animateVoyage);
  useEffect(() => { animateVoyageRef.current = animateVoyage; }, [animateVoyage]);
  useEffect(() => () => { if (voyageRafRef.current) cancelAnimationFrame(voyageRafRef.current); }, []);

  // Calculate visible routes for current year
  const visibleRoutes = useMemo(() => getVisibleRoutes(timelineYear), [timelineYear, getVisibleRoutes]);


  // Update route visibility and trigger shimmer effects
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const m = map.current;
    const prevVisible = previousVisibleRoutesRef.current;
    const currentVisible = visibleRoutes;

    tradeRoutes.routes.forEach((route, index) => {
      // The route currently being hand-animated controls its own source + opacity.
      if (animatingRouteRef.current === index) return;
      const isVisible = currentVisible.has(index);
      const wasVisible = prevVisible.has(index);
      const isNewlyVisible = isVisible && !wasVisible;

      const layerIds = getRouteLayerIds(index);

      // Base opacities for each layer type
      const baseOpacities: Record<string, number> = {
        'aura': 0.08,
        'glow-outer': 0.12,
        'glow-inner': 0.25,
        'line': 0.8,
        'highlight': 0.4,
      };

      // Ghost opacity - hide routes until their timeline year is reached
      const ghostOpacity = 0;

      layerIds.forEach((layerId) => {
        try {
          const layerType = layerId.includes('aura') ? 'aura' :
                           layerId.includes('glow') ? 'glow-outer' :
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

    // Animate the voyage for this event (progressive draw + follow-cam). Events
    // with no associated route (e.g. Columbus's first landfall) just pan there.
    const heroIdx = currentEvent.hasRoute ? heroRouteForEvent(currentEvent) : -1;
    if (heroIdx >= 0) {
      animateVoyage(heroIdx);
    } else {
      m.easeTo({
        center: currentEvent.coordinates,
        duration: 1000,
        easing: (t) => t * (2 - t), // ease-out-quad
      });
    }

  }, [currentEvent, isMapLoaded, animateVoyage]);

  // Flowing dash animation - STABILIZED to prevent MapLibre crashes
  // Uses constant dasharray with opacity pulse instead of mutating dasharray values
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const m = map.current;
    // Dash animation removed - was causing LineAtlas exhaustion errors
    // Routes now use static styling for better stability

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMapLoaded, visibleRoutes]);

  const STYLE_VERSION = 'ne50m-local-v1';

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
        data: '/data/ne_50m_land.geojson',
      },
      lakes: {
        type: 'geojson',
        data: '/data/ne_50m_lakes.geojson',
      },
      coastline: {
        type: 'geojson',
        data: '/data/ne_50m_coastline.geojson',
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
      // Graticule lines - delicate hand-drawn navigational grid (solid to reduce LineAtlas usage)
      {
        id: 'graticule-lines',
        type: 'line',
        source: 'graticule',
        filter: ['!=', ['get', 'type'], 'special'],
        paint: {
          'line-color': '#5a4a3a',
          'line-width': 0.3,
          'line-opacity': 0.12,
        },
      },
      // Special latitude lines (Equator, Tropics) - subtle emphasis (solid to reduce LineAtlas usage)
      {
        id: 'graticule-special',
        type: 'line',
        source: 'graticule',
        filter: ['==', ['get', 'type'], 'special'],
        paint: {
          'line-color': '#3a2a1a',
          'line-width': 0.5,
          'line-opacity': 0.15,
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
        pitch: 0, // Flat chart — a tilt reads as a modern web map, not an antique chart
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
          // Shared smoothed geometry (also used by the voyage animation).
          const coordinates = routePaths[index];

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
          
          // Color scheme based on route type
          const isOverland = route.isOverland === true;
          // Muted, ink-like palette — a faded oxblood/tyrian for sea lanes and a
          // sienna for overland, so lines read as aged chart ink, not neon.
          const colors = isOverland
            ? { aura: '#7a4a24', glowOuter: '#8a5a2e', glowInner: '#CD853F', main: '#7c4a1f', accent: '#DAA520' }  // Sienna for overland
            : { aura: '#5c2340', glowOuter: '#6a2846', glowInner: '#8B2A8B', main: '#6a2444', accent: '#c8a24a' }; // Faded oxblood/tyrian for maritime

          // Single glow layer - combined effect (reduced from 3 layers to prevent LineAtlas exhaustion)
          m?.addLayer({
            id: `route-glow-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': colors.glowOuter,
              'line-width': 5,
              'line-opacity': ghostOpacity,
              'line-blur': 2.5,
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
              'line-color': colors.main,
              'line-width': 1.8,
              'line-opacity': ghostOpacity,
              ...(isOverland ? { 'line-dasharray': [6, 4] } : {}), // Dashed only for overland routes
            },
          });
        });

        // Add click handler for routes - clicking a route selects it and advances timeline
        // USES REFS to avoid stale closure issues with state values
        m?.on('click', (e) => {
          // Query all route layers at click point
          const routeLayerIds: string[] = [];
          tradeRoutes.routes.forEach((_, index) => {
            routeLayerIds.push(`route-line-${index}`, `route-glow-${index}`);
          });
          
          const features = m?.queryRenderedFeatures(e.point, {
            layers: routeLayerIds.filter(id => m?.getLayer(id))
          });
          
          if (features && features.length > 0) {
            // Extract route index from layer ID
            const layerId = features[0].layer?.id;
            const match = layerId?.match(/route-(?:line|glow)-(\d+)/);
            if (match) {
              const routeIndex = parseInt(match[1], 10);
              const route = tradeRoutes.routes[routeIndex];
              
              if (route) {
                // Find the destination in our data
                const destination = tradeRoutes.destinations.find(d => d.name === route.destinationName);
                if (destination) {
                  setSelectedLocation(destination);
                }

                // Animate the clicked voyage (draw + follow-cam).
                animateVoyageRef.current(routeIndex);
                
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
        el.title = origin.name;
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
        el.title = dest.name;
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

      {/* Active voyage banner — names the departing and arriving ports */}
      {activeVoyage && (
        <div className="absolute top-[3.75rem] left-1/2 -translate-x-1/2 z-20 hidden md:block pointer-events-none">
          <div className="bg-[#f0e6d2]/95 border border-[#5a4a3a]/40 px-4 py-1.5 shadow-md flex items-center gap-2.5">
            <span className="font-heading text-[11px] uppercase tracking-[0.12em] text-[#3a2a1a] whitespace-nowrap">
              {activeVoyage.from}
            </span>
            <span className="text-[#8b2942] text-sm leading-none">→</span>
            <span className="font-heading text-[11px] uppercase tracking-[0.12em] text-[#3a2a1a] whitespace-nowrap">
              {activeVoyage.to}
            </span>
          </div>
        </div>
      )}
      
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
