import { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAllPeppers } from '@/hooks/usePeppers';
import type { Pepper } from '@/data/pepperTypes';
import { MapPin, Flame, ExternalLink, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';
import antiqueMap from '@/assets/antique-map.jpg';
import { CompassRose } from '@/components/map/CompassRose';
import { AgedPaperOverlay, ShipSilhouette, SeaCreature, WindHead, NarrativeAnnotation } from '@/components/map/NarrativeElements';

// Group peppers by origin with coordinates
interface OriginCluster {
  name: string;
  coordinates: [number, number];
  peppers: Pepper[];
  region: string;
}

// Coordinates for every place/country a cultivar can resolve to. Longitudes are
// nudged ~+10° east of true position to align markers with the trade-routes-bg.jpg
// artwork (MapLibre center [12,15], zoom 1.35). Cultivars are clustered to a
// country (or a broad region) so free-text origins like "Oaxaca, Mexico" or
// "Andes of Ecuador" all land on a single, sensible marker.
const placeCoords: Record<string, [number, number]> = {
  // Americas
  'Mexico': [-92, 23],
  'United States': [-88, 38],
  'Peru': [-66, -9],
  'Bolivia': [-55, -16],
  'Brazil': [-40, -10],
  'Ecuador': [-68, -1],
  'Colombia': [-63, 4],
  'Venezuela': [-56, 7],
  'Guatemala': [-80, 15],
  'Honduras': [-76, 15],
  'Argentina': [-54, -35],
  'Paraguay': [-48, -23],
  'Trinidad': [-51, 10],
  'Jamaica': [-67, 18],
  'Puerto Rico': [-56, 18],
  'Caribbean': [-58, 17],
  'Guyana': [-48, 6],
  'Andes': [-60, -13],
  'South America': [-50, -12],
  'North America': [-90, 42],
  // Europe
  'Italy': [12, 43],
  'Spain': [-4, 40],
  'Portugal': [-8, 39],
  'France': [2, 46],
  'Hungary': [19, 47],
  'Bulgaria': [25, 43],
  'Serbia': [21, 44],
  'Romania': [25, 46],
  'Poland': [19, 52],
  'Czech Republic': [15, 50],
  'Netherlands': [5, 52],
  'North Macedonia': [22, 41.6],
  'Balkans': [20, 44],
  'United Kingdom': [-2, 54],
  'Central Europe': [16, 49],
  'Europe': [10, 50],
  // Middle East / Mediterranean
  'Turkey': [33, 39],
  'Syria': [38, 35],
  'Georgia': [43, 42],
  // Africa
  'South Africa': [24, -29],
  'Mozambique': [35, -18],
  'Ghana': [0, 8],
  'Nigeria': [8, 9],
  'Cameroon': [12, 6],
  'Angola': [18, -12],
  'Ethiopia': [40, 9],
  'Zimbabwe': [30, -19],
  'Africa': [20, 3],
  // Asia
  'India': [78, 22],
  'Bangladesh': [90, 24],
  'Thailand': [101, 15],
  'China': [105, 34],
  'Korea': [127, 36],
  'Japan': [138, 36],
  'Philippines': [121, 12],
  'Malaysia': [101, 4],
  'Indonesia': [113, -2],
  'Asia': [95, 30],
  // Oceania
  'Australia': [134, -25],
};

// Ordered keyword rules mapping a free-text origin to a cluster key. First match
// wins, so more specific keywords (e.g. "new mexico") must precede generic ones
// ("mexico"). A cultivar whose origin matches nothing here falls back to its
// region centroid, so every pepper in the catalogue is represented.
const ORIGIN_RULES: [string, string][] = [
  ['new mexico', 'United States'], ['united states', 'United States'], ['usa', 'United States'],
  ['augustine', 'United States'], ['american', 'United States'],
  ['puerto rico', 'Puerto Rico'],
  ['mexic', 'Mexico'],
  ['trinidad', 'Trinidad'], ['jamaica', 'Jamaica'],
  ['antilles', 'Caribbean'], ['margarita island', 'Caribbean'], ['caribbean', 'Caribbean'],
  ['peru', 'Peru'], ['bolivia', 'Bolivia'], ['brazil', 'Brazil'], ['ecuador', 'Ecuador'],
  ['colombia', 'Colombia'], ['venezuela', 'Venezuela'], ['guatemala', 'Guatemala'],
  ['honduras', 'Honduras'], ['guyana', 'Guyana'], ['argentin', 'Argentina'], ['paraguay', 'Paraguay'],
  ['andes', 'Andes'], ['south america', 'South America'], ['north america', 'North America'],
  ['italy', 'Italy'], ['italian', 'Italy'],
  ['spain', 'Spain'], ['basque', 'Spain'], ['navarra', 'Spain'],
  ['portugal', 'Portugal'], ['france', 'France'],
  ['hungar', 'Hungary'], ['bulgaria', 'Bulgaria'], ['serbia', 'Serbia'], ['romania', 'Romania'],
  ['poland', 'Poland'], ['czech', 'Czech Republic'], ['netherlands', 'Netherlands'],
  ['macedonia', 'North Macedonia'], ['balkans', 'Balkans'],
  ['united kingdom', 'United Kingdom'], ['england', 'United Kingdom'], ['wales', 'United Kingdom'],
  ['dorset', 'United Kingdom'], [' uk', 'United Kingdom'],
  ['central europe', 'Central Europe'],
  ['turkey', 'Turkey'], ['syria', 'Syria'], ['georgia', 'Georgia'],
  ['india', 'India'], ['bangladesh', 'Bangladesh'], ['thailand', 'Thailand'],
  ['china', 'China'], ['guizhou', 'China'], ['sichuan', 'China'],
  ['japan', 'Japan'], ['kyoto', 'Japan'], ['niigata', 'Japan'],
  ['korea', 'Korea'], ['philippines', 'Philippines'], ['malaysia', 'Malaysia'],
  ['indonesia', 'Indonesia'], ['java', 'Indonesia'],
  ['south africa', 'South Africa'], ['mozambique', 'Mozambique'], ['ghana', 'Ghana'],
  ['nigeria', 'Nigeria'], ['cameroon', 'Cameroon'], ['angola', 'Angola'],
  ['ethiopia', 'Ethiopia'], ['zimbabwe', 'Zimbabwe'],
  ['australia', 'Australia'],
  ['europe', 'Europe'], ['asia', 'Asia'], ['africa', 'Africa'],
];

// Region centroids — the fallback cluster for origins with no recognizable place
// (e.g. "ornamental", "bred hybrid"), so those cultivars still appear on the map.
const REGION_FALLBACK: Record<string, [number, number]> = {
  'Americas': [-72, 6],
  'Europe': [10, 50],
  'Asia': [95, 30],
  'Africa': [20, 3],
  'Middle East': [45, 32],
  'Oceania': [134, -25],
};

// Resolve a cultivar's free-text origin to a cluster { key, coordinates }.
function resolveOrigin(origin: string, region: string): { key: string; coords: [number, number] } | null {
  const o = (origin || '').toLowerCase();
  for (const [needle, place] of ORIGIN_RULES) {
    if (o.includes(needle) && placeCoords[place]) {
      return { key: place, coords: placeCoords[place] };
    }
  }
  const fb = REGION_FALLBACK[region];
  if (fb) return { key: region, coords: fb };
  return null;
}

export default function Origins() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, HTMLElement>>(new Map());
  const [selectedOrigin, setSelectedOrigin] = useState<OriginCluster | null>(null);
  const [highlightedOrigin, setHighlightedOrigin] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Full catalogue: static 190 merged with the published database peppers.
  const { peppers } = useAllPeppers();

  // Group every cultivar by its resolved origin cluster (country or region).
  const originClusters = useMemo(() => {
    const clusters: Record<string, OriginCluster> = {};

    peppers.forEach(pepper => {
      const resolved = resolveOrigin(pepper.origin, pepper.region);
      if (!resolved) return;

      if (!clusters[resolved.key]) {
        clusters[resolved.key] = {
          name: resolved.key,
          coordinates: resolved.coords,
          peppers: [],
          region: pepper.region,
        };
      }
      clusters[resolved.key].peppers.push(pepper);
    });

    return Object.values(clusters)
      .filter(c => c.peppers.length > 0)
      .sort((a, b) => b.peppers.length - a.peppers.length);
  }, [peppers]);

  // Check for highlight parameter from Compendium return
  useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      setHighlightedOrigin(highlight);
      // Clear the param from URL after reading
      searchParams.delete('highlight');
      setSearchParams(searchParams, { replace: true });
      
      // Auto-select the origin after a brief delay for visual effect
      setTimeout(() => {
        const cluster = originClusters.find(c => c.name === highlight);
        if (cluster) {
          setSelectedOrigin(cluster);
        }
      }, 500);
      
      // Clear highlight after animation completes
      setTimeout(() => {
        setHighlightedOrigin(null);
      }, 3000);
    }
  }, [searchParams, setSearchParams, originClusters]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Hybrid approach: CSS background for visuals, MapLibre for marker positioning
    // The map bounds are calibrated to match the trade-routes-bg.jpg artwork
    // Image shows world from approximately -130W to 155E longitude, -55S to 75N latitude
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': 'rgba(0,0,0,0)' // Fully transparent
            }
          }
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
      },
      center: [12, 15], // Center calibrated for the artwork
      zoom: 1.35,
      minZoom: 1.35,
      maxZoom: 1.35, // Lock zoom to keep markers aligned
      pitchWithRotate: false,
      dragRotate: false
    });

    // Disable all interactions to keep artwork/marker alignment
    map.current.scrollZoom.disable();
    map.current.boxZoom.disable();
    map.current.dragPan.disable();
    map.current.keyboard.disable();
    map.current.doubleClickZoom.disable();
    map.current.touchZoomRotate.disable();

    // Add markers for each origin
    map.current.on('load', () => {
      originClusters.forEach(cluster => {
        const el = document.createElement('div');
        el.className = 'origin-marker';
        el.dataset.origin = cluster.name;
        el.innerHTML = `
          <div class="relative cursor-pointer group origin-marker-inner">
            <div class="marker-circle w-9 h-9 rounded-full bg-pepper-red border-2 border-gold flex items-center justify-center text-parchment font-bold text-xs shadow-[0_2px_8px_rgba(91,0,91,0.4),0_0_0_1px_rgba(91,0,91,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_12px_rgba(91,0,91,0.5)]">
              ${cluster.peppers.length}
            </div>
            <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-ink font-heading uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity bg-parchment/90 px-2 py-0.5 rounded-sm shadow-sm">
              ${cluster.name}
            </div>
          </div>
        `;

        // Store reference for highlighting
        markersRef.current.set(cluster.name, el);

        el.addEventListener('click', () => {
          setSelectedOrigin(cluster);
        });

        new maplibregl.Marker({ element: el })
          .setLngLat(cluster.coordinates)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
      markersRef.current.clear();
    };
  }, [originClusters]);

  // Apply highlight effect to marker
  useEffect(() => {
    markersRef.current.forEach((el, name) => {
      const circle = el.querySelector('.marker-circle');
      if (circle) {
        if (name === highlightedOrigin) {
          circle.classList.add('origin-highlight-pulse');
        } else {
          circle.classList.remove('origin-highlight-pulse');
        }
      }
    });
  }, [highlightedOrigin]);

  const getHeatColor = (heatLevel: string) => {
    switch (heatLevel) {
      case 'Mild': return 'bg-green-700';
      case 'Medium': return 'bg-yellow-600';
      case 'Hot': return 'bg-orange-600';
      case 'Very Hot': return 'bg-red-600';
      case 'Extreme': return 'bg-red-900';
      default: return 'bg-stone-500';
    }
  };

  const getHeatTextColor = (heatLevel: string) => {
    switch (heatLevel) {
      case 'Mild': return 'text-green-700';
      case 'Medium': return 'text-yellow-600';
      case 'Hot': return 'text-orange-600';
      case 'Very Hot': return 'text-red-600';
      case 'Extreme': return 'text-red-900';
      default: return 'text-stone-500';
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEO
        title="Origins Map — Where Chili Peppers Come From"
        description="Explore an interactive map charting pepper cultivars by geographic origin and historic trade route, from the Americas across Africa, Europe, and Asia."
        path="/origins"
      />
      {/* Global background pattern - matching Compendium style */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img 
          src={antiqueMap} 
          alt="" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/95 to-background" />
      </div>
      
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-8 overflow-hidden z-10">
        <div className="absolute inset-0">
          <img 
            src={tradeRoutesBg} 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-parchment via-parchment/95 to-parchment" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-tyrian" />
              <span className="text-tyrian font-heading text-sm uppercase tracking-widest">Geographic Heritage</span>
            </div>
            <h1 className="font-blackpearl text-4xl md:text-5xl text-ink mb-4">
              Origins of Fire
            </h1>
            <p className="text-ink/60 font-heading">
              Explore the geographic origins of pepper cultivars across the globe
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative pb-16 z-10">
        <div className="container mx-auto px-4">
          {/* Ornate Map Frame */}
          <div className="relative">
            {/* Outer decorative border */}
            <div className="absolute -inset-3 border-2 border-tyrian/30 rounded-sm pointer-events-none" />
            <div className="absolute -inset-2 border border-tyrian/20 rounded-sm pointer-events-none" />
            
            {/* Corner ornaments */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-tyrian/50 pointer-events-none" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-tyrian/50 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-tyrian/50 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-tyrian/50 pointer-events-none" />
            
            {/* Main map container */}
            <div className="relative rounded-sm overflow-hidden border border-tyrian/40 shadow-xl">
              {/* Antique map artwork as background */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={tradeRoutesBg} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                {/* Subtle vignette overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(228,213,183,0.3) 70%, rgba(228,213,183,0.6) 100%)'
                  }}
                />
                {/* Aged paper overlay */}
                <AgedPaperOverlay className="opacity-30" />
              </div>

              {/* Large decorative compass behind map - matching Compendium */}
              <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
                <CompassRose className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] opacity-[0.08]" />
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-4 left-4 z-10 opacity-40 pointer-events-none">
                <CompassRose className="w-24 h-24" />
              </div>
              
              <div className="absolute top-16 left-8 z-10 opacity-20 pointer-events-none rotate-12">
                <ShipSilhouette className="w-16 h-12 text-tyrian" />
              </div>
              
              <div className="absolute bottom-20 right-12 z-10 opacity-15 pointer-events-none">
                <SeaCreature className="w-20 h-10 text-tyrian" variant="whale" />
              </div>
              
              <div className="absolute top-8 right-8 z-10 opacity-20 pointer-events-none">
                <WindHead className="w-12 h-12 text-tyrian" direction="west" />
              </div>

              {/* Latin annotations */}
              <NarrativeAnnotation 
                text="Terra Incognita" 
                className="absolute top-6 left-1/4 z-10 opacity-30 pointer-events-none"
                style={{ transform: 'rotate(-5deg)' }}
              />
              <NarrativeAnnotation 
                text="Novus Mundus" 
                className="absolute top-1/3 left-[8%] z-10 opacity-25 pointer-events-none"
                style={{ transform: 'rotate(-8deg)' }}
              />
              <NarrativeAnnotation 
                text="Mare Atlanticum" 
                className="absolute top-[45%] left-[30%] z-10 opacity-20 pointer-events-none"
                style={{ transform: 'rotate(2deg)' }}
              />
              <NarrativeAnnotation 
                text="Orbis Terrarum" 
                className="absolute bottom-16 right-[20%] z-10 opacity-25 pointer-events-none"
                style={{ transform: 'rotate(3deg)' }}
              />

              {/* MapLibre container - transparent, just for markers */}
              <div 
                ref={mapContainer} 
                className="relative w-full h-[500px] md:h-[600px] z-20"
              />

              {/* Selected Origin Panel - Parchment styled */}
              {selectedOrigin && (
                <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] z-30 overflow-hidden shadow-xl">
                  {/* Panel border frame */}
                  <div className="relative bg-parchment border-2 border-tyrian/40 rounded-sm">
                    {/* Inner decorative border */}
                    <div className="absolute inset-1 border border-tyrian/20 rounded-sm pointer-events-none" />
                    
                    {/* Header */}
                    <div className="relative p-4 border-b border-tyrian/30 flex items-center justify-between bg-gradient-to-b from-parchment-light to-parchment">
                      <div>
                        <h3 className="font-heading text-lg text-ink">{selectedOrigin.name}</h3>
                        <span className="text-xs text-ink/60 font-heading uppercase tracking-wider">
                          {selectedOrigin.region} • {selectedOrigin.peppers.length} cultivar{selectedOrigin.peppers.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedOrigin(null)}
                        className="text-ink/50 hover:text-ink transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Pepper list */}
                    <div className="max-h-80 overflow-y-auto p-2 bg-parchment">
                      {selectedOrigin.peppers.slice(0, 10).map(pepper => (
                        <Link
                          key={pepper.id}
                          to={`/compendium?pepper=${pepper.id}&from=origins`}
                          className="block p-2 hover:bg-tyrian/10 rounded transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${getHeatColor(pepper.heatLevel)}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-ink text-sm font-heading truncate">{pepper.name}</p>
                              <p className="text-ink/50 text-xs">
                                {pepper.scovilleMin.toLocaleString()}–{pepper.scovilleMax.toLocaleString()} SHU
                              </p>
                            </div>
                            <Flame className={`w-3 h-3 ${getHeatTextColor(pepper.heatLevel)}`} />
                          </div>
                        </Link>
                      ))}

                      {selectedOrigin.peppers.length > 10 && (
                        <p className="text-center text-ink/40 text-xs py-2 font-heading">
                          + {selectedOrigin.peppers.length - 10} more cultivars
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-tyrian/30 bg-parchment-light">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full border-tyrian/40 text-tyrian hover:bg-tyrian/10 text-xs font-heading uppercase tracking-wider"
                      >
                        <Link to={`/compendium?origin=${encodeURIComponent(selectedOrigin.name)}`}>
                          <ExternalLink className="w-3 h-3 mr-2" />
                          View in Compendium
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-ink/60">
              <div className="w-7 h-7 rounded-full bg-pepper-red border-2 border-gold flex items-center justify-center text-parchment text-[10px] font-bold shadow-sm">
                N
              </div>
              <span className="font-heading">Number of cultivars from origin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t border-tyrian/20 relative z-10 bg-parchment-light/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-blackpearl text-3xl text-tyrian mb-1">{originClusters.length}</div>
              <div className="text-ink/60 font-heading text-sm uppercase tracking-wider">Origins</div>
            </div>
            <div>
              <div className="font-blackpearl text-3xl text-tyrian mb-1">{peppers.length}</div>
              <div className="text-ink/60 font-heading text-sm uppercase tracking-wider">Cultivars</div>
            </div>
            <div>
              <div className="font-blackpearl text-3xl text-tyrian mb-1">5</div>
              <div className="text-ink/60 font-heading text-sm uppercase tracking-wider">Continents</div>
            </div>
            <div>
              <div className="font-blackpearl text-3xl text-tyrian mb-1">6000+</div>
              <div className="text-ink/60 font-heading text-sm uppercase tracking-wider">Years of History</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
