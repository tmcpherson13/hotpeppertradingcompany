import { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { peppers } from '@/data/peppers';
import { MapPin, Flame, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';

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

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'land': {
            type: 'geojson',
            data: '/data/ne_110m_land.geojson'
          }
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#1a1410'
            }
          },
          {
            id: 'land',
            type: 'fill',
            source: 'land',
            paint: {
              'fill-color': '#2a2420',
              'fill-opacity': 0.9
            }
          },
          {
            id: 'land-outline',
            type: 'line',
            source: 'land',
            paint: {
              'line-color': '#5B005B',
              'line-width': 1,
              'line-opacity': 0.3
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

    // Add markers for each origin
    originClusters.forEach(cluster => {
      const el = document.createElement('div');
      el.className = 'origin-marker';
      el.innerHTML = `
        <div class="relative cursor-pointer group">
          <div class="w-8 h-8 rounded-full bg-pepper-red border-2 border-gold flex items-center justify-center text-parchment font-bold text-xs shadow-lg transition-transform group-hover:scale-110">
            ${cluster.peppers.length}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-parchment/70 font-heading uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
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
      case 'Mild': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-500';
      case 'Hot': return 'bg-orange-500';
      case 'Very Hot': return 'bg-red-500';
      case 'Extreme': return 'bg-red-800';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-ink relative">
      {/* Global background pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img 
          src={tradeRoutesBg} 
          alt="" 
          className="w-full h-full object-cover opacity-8"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/90 to-ink" />
      </div>
      
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-8 overflow-hidden z-10">
        <div className="absolute inset-0">
          <img 
            src={tradeRoutesBg} 
            alt="" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="text-gold font-heading text-sm uppercase tracking-widest">Geographic Heritage</span>
            </div>
            <h1 className="font-blackpearl text-4xl md:text-5xl text-parchment mb-4">
              Origins of Fire
            </h1>
            <p className="text-parchment/60 font-heading">
              Explore the geographic origins of pepper cultivars across the globe
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative pb-16 z-10">
        <div className="container mx-auto px-4">
          <div className="relative rounded-sm overflow-hidden border border-tyrian/30">
            <div 
              ref={mapContainer} 
              className="w-full h-[500px] md:h-[600px]"
            />

            {/* Selected Origin Panel */}
            {selectedOrigin && (
              <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] bg-ink/95 border border-tyrian/40 rounded-sm overflow-hidden shadow-xl">
                <div className="p-4 border-b border-tyrian/30 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg text-parchment">{selectedOrigin.name}</h3>
                    <span className="text-xs text-parchment/60 font-heading uppercase tracking-wider">
                      {selectedOrigin.region} • {selectedOrigin.peppers.length} cultivar{selectedOrigin.peppers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedOrigin(null)}
                    className="text-parchment/60 hover:text-parchment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {selectedOrigin.peppers.slice(0, 10).map(pepper => (
                    <Link
                      key={pepper.id}
                      to={`/compendium?pepper=${pepper.id}`}
                      className="block p-2 hover:bg-tyrian/20 rounded transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getHeatColor(pepper.heatLevel)}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-parchment text-sm font-heading truncate">{pepper.name}</p>
                          <p className="text-parchment/50 text-xs">
                            {pepper.scovilleMin.toLocaleString()}–{pepper.scovilleMax.toLocaleString()} SHU
                          </p>
                        </div>
                        <Flame className={`w-3 h-3 ${getHeatColor(pepper.heatLevel).replace('bg-', 'text-')}`} />
                      </div>
                    </Link>
                  ))}

                  {selectedOrigin.peppers.length > 10 && (
                    <p className="text-center text-parchment/40 text-xs py-2 font-heading">
                      + {selectedOrigin.peppers.length - 10} more cultivars
                    </p>
                  )}
                </div>

                <div className="p-3 border-t border-tyrian/30">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full border-parchment/30 text-parchment hover:bg-parchment/10 text-xs font-heading uppercase tracking-wider"
                  >
                    <Link to={`/compendium?origin=${encodeURIComponent(selectedOrigin.name)}`}>
                      <ExternalLink className="w-3 h-3 mr-2" />
                      View in Compendium
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-parchment/60">
              <div className="w-6 h-6 rounded-full bg-pepper-red border-2 border-gold flex items-center justify-center text-parchment text-[10px] font-bold">
                N
              </div>
              <span className="font-heading">Number of cultivars from origin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t border-tyrian/20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-blackpearl text-3xl text-gold mb-1">{originClusters.length}</div>
              <div className="text-parchment/60 font-heading text-sm uppercase tracking-wider">Origins</div>
            </div>
            <div>
              <div className="font-blackpearl text-3xl text-gold mb-1">{peppers.length}</div>
              <div className="text-parchment/60 font-heading text-sm uppercase tracking-wider">Cultivars</div>
            </div>
            <div>
              <div className="font-blackpearl text-3xl text-gold mb-1">5</div>
              <div className="text-parchment/60 font-heading text-sm uppercase tracking-wider">Continents</div>
            </div>
            <div>
              <div className="font-blackpearl text-3xl text-gold mb-1">6000+</div>
              <div className="text-parchment/60 font-heading text-sm uppercase tracking-wider">Years of History</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
