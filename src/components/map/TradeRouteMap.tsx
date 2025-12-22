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

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        zoom: 1.8,
        center: [20, 20],
        pitch: 25,
      });

      map.current.addControl(
        new maplibregl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

      map.current.scrollZoom.disable();

      map.current.on('load', () => {
        // Add trade route lines
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

          map.current?.addLayer({
            id: `route-line-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#d4a84b',
              'line-width': 2,
              'line-dasharray': [2, 2],
              'line-opacity': 0.7,
            },
          });
        });

        setIsMapLoaded(true);
      });

      // Add markers for origins
      tradeRoutes.origins.forEach((origin) => {
        const el = document.createElement('div');
        el.className = 'origin-marker';
        el.innerHTML = `
          <div style="
            width: 20px; 
            height: 20px; 
            background: #8b2942; 
            border: 3px solid #d4a84b; 
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          "></div>
        `;
        el.addEventListener('click', () => setSelectedLocation(origin));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(origin.coordinates)
          .addTo(map.current!);
        markersRef.current.push(marker);
      });

      // Add markers for destinations
      tradeRoutes.destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.innerHTML = `
          <div style="
            width: 14px; 
            height: 14px; 
            background: #d4a84b; 
            border: 2px solid #8b2942; 
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>
        `;
        el.addEventListener('click', () => setSelectedLocation(dest));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(dest.coordinates)
          .addTo(map.current!);
        markersRef.current.push(marker);
      });

      // Slow rotation animation
      const secondsPerRevolution = 180;
      let userInteracting = false;

      function spinMap() {
        if (!map.current) return;
        const zoom = map.current.getZoom();
        if (!userInteracting && zoom < 4) {
          const center = map.current.getCenter();
          center.lng -= 360 / secondsPerRevolution;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('mouseup', () => { userInteracting = false; spinMap(); });
      map.current.on('dragend', () => { userInteracting = false; spinMap(); });
      map.current.on('moveend', spinMap);

      spinMap();

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

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card/90 border border-border px-3 py-2 text-xs z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary border-2 border-gold" />
            <span className="font-body text-muted-foreground">Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold border-2 border-primary" />
            <span className="font-body text-muted-foreground">Trade Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
}
