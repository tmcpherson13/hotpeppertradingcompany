import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SpreadTimeline } from './SpreadTimeline';
import { CompassRose } from './CompassRose';
import { CartoucheBorder } from './CartoucheBorder';
import { ShipSilhouette, SeaCreature, WindHead, AgedPaperOverlay, NarrativeAnnotation } from './NarrativeElements';

interface RouteData {
  from: [number, number];
  to: [number, number];
  via: [number, number][];
  establishedYear: number;
  destinationName: string;
}

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
    { from: [-99.1332, 19.4326] as [number, number], to: [37.1343, 36.2021] as [number, number], via: [[-30, 35]] as [number, number][], establishedYear: 1600, destinationName: 'Aleppo, Syria' },
    { from: [-99.1332, 19.4326] as [number, number], to: [73.8567, 15.2993] as [number, number], via: [[-30, 10], [20, 0], [50, 10]] as [number, number][], establishedYear: 1498, destinationName: 'Goa, India' },
    { from: [-99.1332, 19.4326] as [number, number], to: [100.5018, 13.7563] as [number, number], via: [[-120, 20], [140, 10]] as [number, number][], establishedYear: 1550, destinationName: 'Thailand' },
    { from: [-99.1332, 19.4326] as [number, number], to: [19.0402, 47.4979] as [number, number], via: [[-30, 40]] as [number, number][], establishedYear: 1569, destinationName: 'Hungary' },
    { from: [-68.1193, -16.4897] as [number, number], to: [-1.0232, 7.9465] as [number, number], via: [[-30, -10]] as [number, number][], establishedYear: 1500, destinationName: 'West Africa' },
    { from: [73.8567, 15.2993] as [number, number], to: [104.0665, 30.5728] as [number, number], via: [[90, 25]] as [number, number][], establishedYear: 1570, destinationName: 'Sichuan, China' },
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

// Helper function to interpolate position along a route
const interpolateRoute = (route: RouteData, progress: number): [number, number] => {
  const coordinates = [route.from, ...route.via, route.to];
  const totalSegments = coordinates.length - 1;
  const segmentIndex = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
  const segmentProgress = (progress * totalSegments) - segmentIndex;
  
  const start = coordinates[segmentIndex];
  const end = coordinates[segmentIndex + 1];
  
  return [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress,
  ];
};

// Calculate bearing between two points for ship rotation
const calculateBearing = (start: [number, number], end: [number, number]): number => {
  const dLon = (end[0] - start[0]) * Math.PI / 180;
  const lat1 = start[1] * Math.PI / 180;
  const lat2 = end[1] * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

export function TradeRouteMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const markerElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const shipMarkersRef = useRef<Map<number, maplibregl.Marker>>(new Map());
  const shipAnimationsRef = useRef<Map<number, number>>(new Map());
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof tradeRoutes.origins[0] | null>(null);
  const [timelineYear, setTimelineYear] = useState<number>(-4000);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [baseMapError, setBaseMapError] = useState<string | null>(null);
  const previousVisibleRoutesRef = useRef<Set<number>>(new Set());
  const dashOffsetRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

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

  // Calculate visible routes for current year
  const visibleRoutes = useMemo(() => getVisibleRoutes(timelineYear), [timelineYear, getVisibleRoutes]);

  // Create ship marker element
  const createShipElement = useCallback(() => {
    const el = document.createElement('div');
    el.className = 'ship-marker';
    el.innerHTML = `
      <svg viewBox="0 0 32 24" width="28" height="20" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <!-- Ship hull -->
        <path d="M2 18 Q 8 22, 16 22 Q 24 22, 30 18 L 28 14 Q 16 16, 4 14 Z" fill="#5a4a3a" stroke="#3a2a1a" stroke-width="0.5"/>
        <!-- Ship deck -->
        <path d="M6 14 L 26 14 L 24 10 L 8 10 Z" fill="#8b7355" stroke="#5a4a3a" stroke-width="0.5"/>
        <!-- Mast -->
        <line x1="16" y1="10" x2="16" y2="2" stroke="#3a2a1a" stroke-width="1.5"/>
        <!-- Sail -->
        <path d="M16 3 Q 24 6, 16 10 Z" fill="#e8dcc4" stroke="#5a4a3a" stroke-width="0.5"/>
        <!-- Flag -->
        <path d="M16 2 L 20 3.5 L 16 5 Z" fill="#8b2942"/>
      </svg>
    `;
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    return el;
  }, []);

  // Animate ship along route
  const animateShipAlongRoute = useCallback((routeIndex: number, route: RouteData) => {
    if (!map.current) return;

    // Cancel any existing animation for this route
    const existingAnimation = shipAnimationsRef.current.get(routeIndex);
    if (existingAnimation) {
      cancelAnimationFrame(existingAnimation);
    }

    // Create or reuse ship marker
    let shipMarker = shipMarkersRef.current.get(routeIndex);
    if (!shipMarker) {
      const shipEl = createShipElement();
      shipMarker = new maplibregl.Marker({ element: shipEl, anchor: 'center' })
        .setLngLat(route.from)
        .addTo(map.current);
      shipMarkersRef.current.set(routeIndex, shipMarker);
    }

    const shipEl = shipMarker.getElement();
    shipEl.style.opacity = '1';
    shipEl.classList.add('ship-sailing');

    const duration = 6000; // 6 seconds to travel the route
    const startTime = performance.now();
    const coordinates = [route.from, ...route.via, route.to];

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth movement
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      const position = interpolateRoute(route, easedProgress);
      shipMarker!.setLngLat(position);

      // Calculate and set rotation based on direction
      const nextProgress = Math.min(easedProgress + 0.05, 1);
      const nextPosition = interpolateRoute(route, nextProgress);
      const bearing = calculateBearing(position, nextPosition);
      
      const svg = shipEl.querySelector('svg');
      if (svg) {
        svg.style.transform = `rotate(${bearing - 90}deg)`;
      }

      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        shipAnimationsRef.current.set(routeIndex, frameId);
      } else {
        // Animation complete - fade out ship and keep it at destination
        shipEl.classList.remove('ship-sailing');
        shipEl.style.opacity = '0.6';
        
        // Keep ship visible at destination with subtle bobbing
        shipEl.classList.add('ship-anchored');
      }
    };

    const frameId = requestAnimationFrame(animate);
    shipAnimationsRef.current.set(routeIndex, frameId);
  }, [createShipElement]);

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

      // Ghost opacity (barely visible hint for future routes)
      const ghostOpacity = 0.03;

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

            // Launch ship animation for newly visible route
            animateShipAlongRoute(index, route);
          } else {
            m.setPaintProperty(layerId, 'line-opacity', targetOpacity);
          }
        } catch (e) {
          // Layer may not exist yet
        }
      });

      // Hide ship if route becomes invisible
      if (!isVisible && wasVisible) {
        const shipMarker = shipMarkersRef.current.get(index);
        if (shipMarker) {
          const shipEl = shipMarker.getElement();
          shipEl.style.opacity = '0';
          shipEl.classList.remove('ship-sailing', 'ship-anchored');
        }
        // Cancel animation
        const animId = shipAnimationsRef.current.get(index);
        if (animId) {
          cancelAnimationFrame(animId);
          shipAnimationsRef.current.delete(index);
        }
      }

      // Sync marker animations
      const destMarkerEl = markerElementsRef.current.get(route.destinationName);
      if (destMarkerEl) {
        if (isNewlyVisible) {
          destMarkerEl.classList.add('marker-pulse');
          setTimeout(() => destMarkerEl.classList.remove('marker-pulse'), 1500);
        }
        destMarkerEl.style.opacity = isVisible ? '1' : '0.3';
        destMarkerEl.style.transform = isVisible ? 'scale(1)' : 'scale(0.7)';
      }
    });

    previousVisibleRoutesRef.current = new Set(currentVisible);
  }, [visibleRoutes, isMapLoaded, animateShipAlongRoute]);

  // Flowing dash animation
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const m = map.current;

    const animateDashes = () => {
      dashOffsetRef.current += 0.3;

      tradeRoutes.routes.forEach((route, index) => {
        if (visibleRoutes.has(index)) {
          const highlightLayerId = `route-highlight-${index}`;
          try {
            // Animate dash pattern offset by changing dasharray
            const offset = dashOffsetRef.current % 20;
            m.setPaintProperty(highlightLayerId, 'line-dasharray', [8 + offset * 0.1, 12 - offset * 0.05]);
          } catch (e) {
            // Layer may not exist
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animateDashes);
    };

    animateDashes();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMapLoaded, visibleRoutes]);

  const STYLE_VERSION = 'ne110m-local-v2';

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
    },
    layers: [
      // Parchment ocean background
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#e8dcc4',
        },
      },
      // Land mass fill
      {
        id: 'land',
        type: 'fill',
        source: 'land',
        paint: {
          'fill-color': '#c2ad82',
          'fill-opacity': 1,
        },
      },
      // Inland water (lakes)
      {
        id: 'lakes',
        type: 'fill',
        source: 'lakes',
        paint: {
          'fill-color': '#ddd0b8',
          'fill-opacity': 0.9,
        },
      },
      // Coastline - inked stroke
      {
        id: 'coastline',
        type: 'line',
        source: 'coastline',
        paint: {
          'line-color': '#5a4a3a',
          'line-width': 1.4,
          'line-opacity': 0.65,
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
        zoom: 2.5,
        center: [-25, 22], // Shifted west to show more Americas
        pitch: 10,
        bearing: 0,
        maxBounds: [[-120, -30], [100, 65]], // Expanded west to include Americas
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

          // Ghost opacity for routes not yet established
          const ghostOpacity = 0.03;

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
        el.addEventListener('click', () => setSelectedLocation(origin));
        markerElementsRef.current.set(origin.name, el);

        const marker = new maplibregl.Marker({ element: el }).setLngLat(origin.coordinates).addTo(m!);
        markersRef.current.push(marker);
      });

      // Add markers for destinations - styled as antique port markers
      tradeRoutes.destinations.forEach((dest) => {
        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.opacity = '0.3';
        el.style.transform = 'scale(0.7)';
        el.innerHTML = `
          <div class="marker-inner" style="
            width: 14px; 
            height: 14px; 
            background: radial-gradient(circle, #c4a86a 30%, #a08050 100%);
            border: 1.5px solid #5a4a3a; 
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(90,74,58,0.4), inset 0 1px 1px rgba(255,255,255,0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          "></div>
        `;
        el.addEventListener('click', () => setSelectedLocation(dest));
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
      // Cancel all ship animations
      shipAnimationsRef.current.forEach((animId) => cancelAnimationFrame(animId));
      shipAnimationsRef.current.clear();
      // Remove ship markers
      shipMarkersRef.current.forEach((marker) => marker.remove());
      shipMarkersRef.current.clear();
      if (map.current && handleMapError) {
        map.current.off('error', handleMapError);
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerElementsRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, [STYLE_VERSION]);

  return (
    <div className="relative">
      {/* CSS for marker and ship animations */}
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

        @keyframes shipSailing {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-2px); }
          75% { transform: translateY(2px); }
        }

        @keyframes shipBobbing {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-1px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(1px) rotate(2deg); }
        }

        .ship-marker {
          z-index: 5;
        }

        .ship-sailing {
          animation: shipSailing 0.8s ease-in-out infinite;
        }

        .ship-anchored {
          animation: shipBobbing 3s ease-in-out infinite;
        }

        .ship-marker svg {
          transition: transform 0.3s ease-out;
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
