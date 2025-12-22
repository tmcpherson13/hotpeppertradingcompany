import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';
import { SpreadTimeline } from './SpreadTimeline';

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
      // Parchment ocean background
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#e8dcc4',
        },
      },
      // Subtle ocean texture effect with water layer
      {
        id: 'water',
        type: 'fill',
        source: 'natural-earth',
        'source-layer': 'water',
        paint: {
          'fill-color': '#ddd0b8',
          'fill-opacity': 0.6,
        },
      },
      // Inked landmass base
      {
        id: 'land',
        type: 'fill',
        source: 'natural-earth',
        'source-layer': 'landcover',
        paint: {
          'fill-color': '#c4b59a',
          'fill-opacity': 0.4,
        },
      },
      // Main landmass with engraved look
      {
        id: 'landuse',
        type: 'fill',
        source: 'natural-earth',
        'source-layer': 'landuse',
        paint: {
          'fill-color': '#bfad8f',
          'fill-opacity': 0.3,
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
      // Place labels in antique style
      {
        id: 'place-labels',
        type: 'symbol',
        source: 'natural-earth',
        'source-layer': 'place',
        filter: ['==', ['get', 'class'], 'country'],
        layout: {
          'text-field': ['get', 'name:en'],
          'text-font': ['Stadia Regular'],
          'text-size': 10,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.15,
        },
        paint: {
          'text-color': '#6a5a4a',
          'text-opacity': 0.6,
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
        zoom: 2.8,
        center: [-5, 25], // Mediterranean, Iberia, West Africa focus
        pitch: 15,
        bearing: -5,
        maxBounds: [[-80, -20], [120, 65]], // Constrain to Atlantic-Mediterranean view
        attributionControl: false,
      });

      map.current.addControl(
        new maplibregl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

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
      <div ref={mapContainer} className="aspect-[21/9] md:aspect-[2.5/1]" />
      
      {/* Vignette overlay - de-emphasizes Asia/edges, focuses on Mediterranean */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 80% at 35% 50%,
              transparent 0%,
              transparent 40%,
              rgba(232, 220, 196, 0.3) 60%,
              rgba(232, 220, 196, 0.6) 80%,
              rgba(232, 220, 196, 0.85) 100%
            )
          `,
        }}
      />
      
      {/* Right edge fade - stronger de-emphasis for Asia */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to left,
              rgba(232, 220, 196, 0.9) 0%,
              rgba(232, 220, 196, 0.6) 15%,
              rgba(232, 220, 196, 0.2) 30%,
              transparent 50%
            )
          `,
        }}
      />
      
      {/* Selected Location Info Panel */}
      {selectedLocation && !isTimelinePlaying && (
        <div className="absolute top-4 left-4 bg-card/95 border-2 border-border p-4 max-w-xs shadow-deep z-10">
          <button 
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-lg leading-none"
          >
            ×
          </button>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h4 className="font-display text-sm uppercase tracking-wide text-foreground">
              {selectedLocation.name}
            </h4>
          </div>
          <p className="font-body text-xs text-muted-foreground mb-2 italic">
            Established: {selectedLocation.year}
          </p>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
            {selectedLocation.description}
          </p>
          <div className="border-t border-border pt-2">
            <p className="font-heading text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Notable Varieties
            </p>
            <p className="font-body text-xs text-foreground">
              {selectedLocation.varieties.join(' • ')}
            </p>
          </div>
        </div>
      )}

      {/* Timeline Panel */}
      <div className="border-t-2 border-border">
        <SpreadTimeline 
          onYearChange={setTimelineYear}
          isPlaying={isTimelinePlaying}
          onPlayingChange={setIsTimelinePlaying}
        />
      </div>

      {/* Legend - styled as antique cartouche */}
      <div className="absolute top-4 right-14 bg-[#e8dcc4]/95 border border-[#5a4a3a] px-4 py-2.5 text-xs z-10 shadow-md">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-primary to-primary/80 border border-[#5a4a3a] shadow-sm" />
            <span className="font-body text-[#5a4a3a] tracking-wide">Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#c4a86a] to-[#a08050] border border-[#5a4a3a] shadow-sm" />
            <span className="font-body text-[#5a4a3a] tracking-wide">Trade Port</span>
          </div>
        </div>
      </div>
    </div>
  );
}
