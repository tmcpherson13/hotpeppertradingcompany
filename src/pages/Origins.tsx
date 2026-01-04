import { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { peppers } from '@/data/peppers';
import { MapPin, Flame, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';
import { CompassRose } from '@/components/map/CompassRose';
import { AgedPaperOverlay, ShipSilhouette, SeaCreature, WindHead } from '@/components/map/NarrativeElements';

// Group peppers by origin with coordinates
interface OriginCluster {
  name: string;
  coordinates: [number, number];
  peppers: typeof peppers;
  region: string;
}

const originCoordinates: Record<string, [number, number]> = {
  'Mexico': [-102.5528, 23.6345],
  'Peru': [-75.0152, -9.1900],
  'Bolivia': [-64.9912, -16.2902],
  'Brazil': [-51.9253, -14.2350],
  'Trinidad': [-61.2225, 10.6918],
  'Jamaica': [-77.2975, 18.1096],
  'Guyana': [-58.9302, 4.8604],
  'India': [78.9629, 20.5937],
  'Thailand': [100.9925, 15.8700],
  'China': [104.1954, 35.8617],
  'Korea': [127.7669, 35.9078],
  'Japan': [138.2529, 36.2048],
  'Italy': [12.5674, 41.8719],
  'Spain': [-3.7492, 40.4637],
  'Hungary': [19.5033, 47.1625],
  'Turkey': [35.2433, 38.9637],
  'Syria': [38.9968, 34.8021],
  'South Africa': [22.9375, -30.5595],
  'Mozambique': [35.5296, -18.6657],
  'Ghana': [-1.0232, 7.9465],
  'USA': [-95.7129, 37.0902],
  'New Mexico': [-106.0183, 34.3071],
  'St Augustine, FL': [-81.3124, 29.8946],
  'Philippines': [121.7740, 12.8797],
  'Malaysia': [101.9758, 4.2105],
  'Bangladesh': [90.3563, 23.6850],
  'France': [2.2137, 46.2276],
  'Portugal': [-8.2245, 39.3999],
  'Ecuador': [-78.1834, -1.8312],
  'Caribbean': [-66.5901, 18.2208],
};

export default function Origins() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<OriginCluster | null>(null);

  // Group peppers by origin
  const originClusters = useMemo(() => {
    const clusters: Record<string, OriginCluster> = {};

    peppers.forEach(pepper => {
      const origin = pepper.origin;
      const coords = originCoordinates[origin];
      
      if (coords) {
        if (!clusters[origin]) {
          clusters[origin] = {
            name: origin,
            coordinates: coords,
            peppers: [],
            region: pepper.region
          };
        }
        clusters[origin].peppers.push(pepper);
      }
    });

    return Object.values(clusters).filter(c => c.peppers.length > 0);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Transparent map - antique artwork is the visual backdrop
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
              'background-color': 'rgba(0,0,0,0)'
            }
          }
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
      },
      center: [-20, 20],
      zoom: 1.8,
      minZoom: 1.5,
      maxZoom: 6
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add markers for each origin with antique styling
    originClusters.forEach(cluster => {
      const el = document.createElement('div');
      el.className = 'origin-marker';
      el.innerHTML = `
        <div class="relative cursor-pointer group">
          <div class="w-9 h-9 rounded-full bg-pepper-red border-2 border-gold flex items-center justify-center text-parchment font-bold text-xs shadow-[0_2px_8px_rgba(91,0,91,0.4),0_0_0_1px_rgba(91,0,91,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_12px_rgba(91,0,91,0.5)]">
            ${cluster.peppers.length}
          </div>
          <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-ink font-heading uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity bg-parchment/90 px-2 py-0.5 rounded-sm shadow-sm">
            ${cluster.name}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedOrigin(cluster);
        map.current?.flyTo({
          center: cluster.coordinates,
          zoom: 4,
          duration: 1000
        });
      });

      new maplibregl.Marker({ element: el })
        .setLngLat(cluster.coordinates)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [originClusters]);

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
    <div className="min-h-screen bg-parchment relative">
      {/* Global background pattern - parchment base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-parchment" />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235B005B' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
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
                          to={`/compendium?pepper=${pepper.id}`}
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
