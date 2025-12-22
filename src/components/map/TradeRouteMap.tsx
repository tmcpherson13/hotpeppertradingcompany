import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SpreadTimeline } from './SpreadTimeline';
import { CompassRose } from './CompassRose';
import { CartoucheBorder } from './CartoucheBorder';
import { ShipSilhouette, SeaCreature, WindHead, AgedPaperOverlay, NarrativeAnnotation } from './NarrativeElements';

const tradeRoutes = {
  origins: [
    {
      name: 'Mesoamerica',
      coordinates: [-99.1332, 19.4326] as [number, number],
      description: 'Origin of all capsicum species. Domesticated by 4000 BCE.',
      varieties: ['Poblano', 'Serrano', 'Habanero', 'Jalapeño'],
      year: '4000 BCE',
    },
    {
      name: 'Peru & Bolivia',
      coordinates: [-68.1193, -16.4897] as [number, number],
      description: 'Secondary center of capsicum diversity.',
      varieties: ['Ají Amarillo', 'Rocoto'],
      year: '3000 BCE',
    },
  ],
  destinations: [
    {
      name: 'Aleppo, Syria',
      coordinates: [37.1343, 36.2021] as [number, number],
      description: 'Primary source for Aleppo pepper since 1600.',
      varieties: ['Aleppo Pepper'],
      year: '1600',
    },
    {
      name: 'Gaziantep, Turkey',
      coordinates: [37.3781, 37.0662] as [number, number],
      description: 'Renowned for Urfa biber and Marash peppers.',
      varieties: ['Urfa Biber', 'Marash'],
      year: '1600',
    },
    {
      name: 'Goa, India',
      coordinates: [73.8567, 15.2993] as [number, number],
      description: 'Portuguese introduced peppers via trade routes.',
      varieties: ['Kashmiri', 'Bhut Jolokia'],
      year: '1498',
    },
    {
      name: 'Sichuan, China',
      coordinates: [104.0665, 30.5728] as [number, number],
      description: 'Chilies transformed regional cuisine.',
      varieties: ['Facing Heaven', 'Erjingtiao'],
      year: '1570',
    },
    {
      name: 'Thailand',
      coordinates: [100.5018, 13.7563] as [number, number],
      description: 'Adopted capsicum within fifty years of introduction.',
      varieties: ["Bird's Eye", 'Thai Dragon'],
      year: '1550',
    },
    {
      name: 'Hungary',
      coordinates: [19.0402, 47.4979] as [number, number],
      description: 'Paprika became defining spice of Hungarian cuisine.',
      varieties: ['Hungarian Paprika'],
      year: '1569',
    },
    {
      name: 'West Africa',
      coordinates: [-1.0232, 7.9465] as [number, number],
      description: 'Chilies spread via Portuguese traders.',
      varieties: ['Scotch Bonnet', 'Piri Piri'],
      year: '1500',
    },
  ],
  routes: [
    { from: [-99.1332, 19.4326], to: [37.1343, 36.2021], via: [[-30, 35]] },
    { from: [-99.1332, 19.4326], to: [73.8567, 15.2993], via: [[-30, 10], [20, 0], [50, 10]] },
    { from: [-99.1332, 19.4326], to: [100.5018, 13.7563], via: [[-120, 20], [140, 10]] },
    { from: [-99.1332, 19.4326], to: [19.0402, 47.4979], via: [[-30, 40]] },
    { from: [-68.1193, -16.4897], to: [-1.0232, 7.9465], via: [[-30, -10]] },
    { from: [73.8567, 15.2993], to: [104.0665, 30.5728], via: [[90, 25]] },
  ],
};

export function TradeRouteMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof tradeRoutes.origins[0] | null>(null);
  const [timelineYear, setTimelineYear] = useState<number>(-4000);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);

  // Year to locations mapping for timeline sync
  const yearToLocations: Record<number, string[]> = {
    '-4000': ['Mesoamerica'],
    '-3000': ['Mesoamerica', 'Peru & Bolivia'],
    '1493': ['Mesoamerica', 'Peru & Bolivia'],
    '1498': ['Mesoamerica', 'Peru & Bolivia', 'Goa, India'],
    '1500': ['Mesoamerica', 'Peru & Bolivia', 'Goa, India', 'West Africa'],
    '1542': ['Mesoamerica', 'Peru & Bolivia', 'Goa, India', 'West Africa'],
    '1550': ['Mesoamerica', 'Peru & Bolivia', 'Goa, India', 'West Africa', 'Thailand'],
    '1569': ['Mesoamerica', 'Peru & Bolivia', 'Goa, India', 'West Africa', 'Thailand', 'Hungary'],
    '1570': ['Mesoamerica', 'Peru & Bolivia', 'Goa, India', 'West Africa', 'Thailand', 'Hungary', 'Sichuan, China'],
    '1600': ['Mesoamerica', 'Peru & Bolivia', 'Goa, India', 'West Africa', 'Thailand', 'Hungary', 'Sichuan, China', 'Aleppo, Syria', 'Gaziantep, Turkey'],
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

  // Custom antique nautical chart style
  const antiqueMapStyle: maplibregl.StyleSpecification = {
    version: 8,
    name: 'Antique Nautical Chart',
    sources: {
      'natural-earth': {
        type: 'vector',
        url: 'https://tiles.stadiamaps.com/data/openmaptiles.json',
      },
    },
    glyphs: 'https://tiles.stadiamaps.com/fonts/{fontstack}/{range}.pbf',
    layers: [
      // Parchment background (land mass)
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#c2ad82', // Darker parchment so land reads clearly
        },
      },
      // Ocean water polygons (lighter parchment so sea reads distinct from land)
      {
        id: 'water',
        type: 'fill',
        source: 'natural-earth',
        'source-layer': 'water',
        paint: {
          'fill-color': '#eee4cf',
          'fill-opacity': 1,
          'fill-outline-color': '#5a4a3a',
        },
      },
      // Landcover adds subtle texture variation on land
      {
        id: 'landcover',
        type: 'fill',
        source: 'natural-earth',
        'source-layer': 'landcover',
        paint: {
          'fill-color': '#a7936a',
          'fill-opacity': 0.22,
        },
      },
      // Landuse for additional land detail
      {
        id: 'landuse',
        type: 'fill',
        source: 'natural-earth',
        'source-layer': 'landuse',
        paint: {
          'fill-color': '#a89870',
          'fill-opacity': 0.2,
        },
      },
      // Coastline - hand-drawn inked effect
      {
        id: 'coastline',
        type: 'line',
        source: 'natural-earth',
        'source-layer': 'water',
        paint: {
          'line-color': '#5a4a3a',
          'line-width': 1.5,
          'line-opacity': 0.7,
        },
      },
      // Rivers with old map styling
      {
        id: 'waterway',
        type: 'line',
        source: 'natural-earth',
        'source-layer': 'waterway',
        paint: {
          'line-color': '#8a7a6a',
          'line-width': 0.8,
          'line-opacity': 0.5,
        },
      },
      // Country labels - engraved old-world style
      {
        id: 'country-labels',
        type: 'symbol',
        source: 'natural-earth',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'country'],
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Stadia Italic'], // Serif italic for old-world feel
          'text-size': 11,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.25,
          'text-max-width': 8,
        },
        paint: {
          'text-color': '#4a3a2a',
          'text-opacity': 0.5,
          'text-halo-color': '#e8dcc4',
          'text-halo-width': 1.5,
          'text-halo-blur': 0.5,
        },
      },
      // Sea and ocean labels - flowing script style
      {
        id: 'water-labels',
        type: 'symbol',
        source: 'natural-earth',
        'source-layer': 'water_name',
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Stadia Italic'],
          'text-size': 13,
          'text-letter-spacing': 0.4,
          'text-max-width': 10,
          'symbol-placement': 'point',
        },
        paint: {
          'text-color': '#5a4a3a',
          'text-opacity': 0.35,
          'text-halo-color': '#ddd0b8',
          'text-halo-width': 1,
        },
      },
      // City/place labels - smaller engraved style
      {
        id: 'city-labels',
        type: 'symbol',
        source: 'natural-earth',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'city'],
        minzoom: 4,
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Stadia Italic'],
          'text-size': 9,
          'text-letter-spacing': 0.1,
        },
        paint: {
          'text-color': '#5a4a3a',
          'text-opacity': 0.45,
          'text-halo-color': '#e8dcc4',
          'text-halo-width': 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: antiqueMapStyle,
        zoom: 2.5,
        center: [-25, 22], // Shifted west to show more Americas
        pitch: 10,
        bearing: 0,
        maxBounds: [[-120, -30], [100, 65]], // Expanded west to include Americas
        attributionControl: false,
      });

      // Remove modern navigation controls for historical immersion
      // Users can still pan/drag the map

      map.current.scrollZoom.disable();

      map.current.on('load', () => {
        // Add trade route lines with antique styling
        tradeRoutes.routes.forEach((route, index) => {
          const coordinates = [route.from, ...route.via, route.to];
          
          map.current?.addSource(`route-${index}`, {
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

          // Outermost diffuse glow - prestige aura
          map.current?.addLayer({
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
              'line-opacity': 0.08,
              'line-blur': 8,
            },
          });

          // Secondary glow layer - rich purple halo
          map.current?.addLayer({
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
              'line-opacity': 0.15,
              'line-blur': 4,
            },
          });

          // Inner glow - concentrated prestige
          map.current?.addLayer({
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
              'line-opacity': 0.25,
              'line-blur': 2,
            },
          });

          // Main route line - bold and intentional
          map.current?.addLayer({
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
              'line-opacity': 0.9,
            },
          });

          // Highlight stroke - precious metal accent
          map.current?.addLayer({
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
              'line-opacity': 0.4,
              'line-dasharray': [8, 12],
            },
          });
        });

        setIsMapLoaded(true);
      });

      // Add markers for origins - styled as compass roses
      tradeRoutes.origins.forEach((origin) => {
        const el = document.createElement('div');
        el.className = 'origin-marker';
        el.innerHTML = `
          <div style="
            width: 22px; 
            height: 22px; 
            background: radial-gradient(circle, #8b2942 40%, #6b1a32 100%);
            border: 2px solid #5a4a3a; 
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(90,74,58,0.5), inset 0 1px 2px rgba(255,255,255,0.2);
            position: relative;
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
        el.addEventListener('click', () => setSelectedLocation(origin));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(origin.coordinates)
          .addTo(map.current!);
        markersRef.current.push(marker);
      });

      // Add markers for destinations - styled as antique port markers
      tradeRoutes.destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.innerHTML = `
          <div style="
            width: 14px; 
            height: 14px; 
            background: radial-gradient(circle, #c4a86a 30%, #a08050 100%);
            border: 1.5px solid #5a4a3a; 
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(90,74,58,0.4), inset 0 1px 1px rgba(255,255,255,0.15);
          "></div>
        `;
        el.addEventListener('click', () => setSelectedLocation(dest));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(dest.coordinates)
          .addTo(map.current!);
        markersRef.current.push(marker);
      });

      // Removed auto-rotation to maintain narrative focus on Mediterranean region

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative">
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
      
      <div ref={mapContainer} className="aspect-[21/9] md:aspect-[2.5/1]" />
      
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
        <ShipSilhouette className="w-12 h-8 opacity-60" style={{ transform: 'rotate(25deg)' }} />
      </div>
      <div className="absolute pointer-events-none hidden md:block" style={{ top: '55%', left: '18%' }}>
        <ShipSilhouette className="w-10 h-6 opacity-40" style={{ transform: 'rotate(-15deg)' }} />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ top: '40%', left: '45%' }}>
        <ShipSilhouette className="w-8 h-5 opacity-30" style={{ transform: 'rotate(10deg)' }} />
      </div>
      
      {/* Sea creatures - period cartographic decoration */}
      <div className="absolute pointer-events-none hidden md:block" style={{ bottom: '30%', left: '8%' }}>
        <SeaCreature className="w-16 h-6" variant="serpent" />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ top: '60%', right: '35%' }}>
        <SeaCreature className="w-12 h-6" variant="whale" />
      </div>
      
      {/* Wind heads - classical cartographic element */}
      <div className="absolute pointer-events-none hidden md:block" style={{ top: '20%', right: '8%' }}>
        <WindHead className="w-10 h-8" direction="west" />
      </div>
      <div className="absolute pointer-events-none hidden lg:block" style={{ bottom: '35%', left: '3%' }}>
        <WindHead className="w-8 h-6" direction="east" />
      </div>
      
      {/* Narrative annotations - subtle period text */}
      <NarrativeAnnotation 
        text="Terra Incognita" 
        className="absolute hidden lg:block"
        style={{ bottom: '25%', left: '8%', transform: 'rotate(-5deg)' }}
      />
      <NarrativeAnnotation 
        text="Mare Atlanticum" 
        className="absolute hidden md:block text-[11px]"
        style={{ top: '42%', left: '32%', transform: 'rotate(-2deg)', letterSpacing: '0.2em' }}
      />
      <NarrativeAnnotation 
        text="Via delle Spezie" 
        className="absolute hidden lg:block"
        style={{ top: '32%', right: '22%', transform: 'rotate(3deg)' }}
      />
      <NarrativeAnnotation 
        text="Novus Mundus" 
        className="absolute hidden md:block text-[11px]"
        style={{ top: '35%', left: '12%', transform: 'rotate(-8deg)', letterSpacing: '0.15em' }}
      />
      
      {/* Compass Rose - bottom left */}
      <div className="absolute bottom-16 left-4 z-10">
        <CompassRose className="w-20 h-20 md:w-24 md:h-24 opacity-70" />
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
            <div className="border-t border-[#5a4a3a]/30 pt-2">
              <p className="font-heading text-[10px] uppercase tracking-wider text-[#6a5a4a] mb-1">
                Notable Varieties
              </p>
              <p className="font-body text-xs text-[#3a2a1a]">
                {selectedLocation.varieties.join(' • ')}
              </p>
            </div>
          </CartoucheBorder>
        </div>
      )}

      {/* Timeline Panel */}
      <div className="border-t-2 border-[#5a4a3a]/30">
        <SpreadTimeline 
          onYearChange={setTimelineYear}
          isPlaying={isTimelinePlaying}
          onPlayingChange={setIsTimelinePlaying}
        />
      </div>

      {/* Legend - styled as antique cartouche */}
      <div className="absolute top-4 right-14 z-10">
        <div className="relative">
          <div className="absolute inset-0 border border-[#5a4a3a]/30" />
          <div className="absolute inset-[2px] border border-[#5a4a3a]/15" />
          <div className="bg-[#e8dcc4]/95 px-4 py-2.5 text-xs">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-primary to-primary/80 border border-[#5a4a3a] shadow-sm" />
                <span className="font-body text-[#4a3a2a] tracking-wide italic">Origin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#c4a86a] to-[#a08050] border border-[#5a4a3a] shadow-sm" />
                <span className="font-body text-[#4a3a2a] tracking-wide italic">Trade Port</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
