import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export interface TimelineEvent {
  year: number;
  yearDisplay: string;
  location: string;
  region: string;
  description: string;
  coordinates: [number, number];
  isOrigin?: boolean;
  hasRoute?: boolean; // Whether this event has an associated trade route
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: -4000,
    yearDisplay: '4000 BCE',
    location: 'Mesoamerica',
    region: 'The Americas',
    description: 'Capsicum domesticated by indigenous peoples. Earliest evidence of cultivation.',
    coordinates: [-99.1332, 19.4326],
    isOrigin: true,
  },
  {
    year: -3000,
    yearDisplay: '3000 BCE',
    location: 'Peru & Bolivia',
    region: 'The Americas',
    description: 'Secondary center of capsicum diversity develops in the Andes.',
    coordinates: [-68.1193, -16.4897],
    isOrigin: true,
  },
  {
    year: 1493,
    yearDisplay: '1493',
    location: 'Sanlúcar de Barrameda, Spain',
    region: 'Europe',
    description: 'Columbus returns from second voyage, landing with pepper seeds from the New World.',
    coordinates: [-6.3508, 36.7783],
    hasRoute: true,
  },
  {
    year: 1498,
    yearDisplay: '1498',
    location: 'Goa, India',
    region: 'South Asia',
    description: 'Portuguese traders introduce peppers via maritime routes.',
    coordinates: [73.8567, 15.2993],
    hasRoute: true,
  },
  {
    year: 1499,
    yearDisplay: '1499',
    location: 'Lisbon, Portugal',
    region: 'Europe',
    description: 'Vasco da Gama returns with first pepper cargo, establishing the Carreira da Índia.',
    coordinates: [-9.1393, 38.7223],
    hasRoute: true,
  },
  {
    year: 1500,
    yearDisplay: '1500',
    location: 'West Africa',
    region: 'Africa',
    description: 'Portuguese establish pepper cultivation along trade posts.',
    coordinates: [-1.0232, 7.9465],
    hasRoute: true,
  },
  {
    year: 1503,
    yearDisplay: '1503',
    location: 'Cochin, India',
    region: 'South Asia',
    description: 'Portuguese establish fort and factory on the Malabar Coast.',
    coordinates: [76.2673, 9.9312],
    hasRoute: true,
  },
  {
    year: 1507,
    yearDisplay: '1507',
    location: 'Mozambique Island',
    region: 'Africa',
    description: 'Portuguese establish key resupply station on the Cape Route to India.',
    coordinates: [40.7347, -15.0344],
    hasRoute: true,
  },
  {
    year: 1510,
    yearDisplay: 'c. 1510',
    location: 'Caribbean Islands',
    region: 'The Americas',
    description: 'African and European pepper cultivars return to the New World, blending with native species.',
    coordinates: [-66.1057, 18.4655],
    hasRoute: true,
  },
  {
    year: 1511,
    yearDisplay: '1511',
    location: 'Malacca',
    region: 'Southeast Asia',
    description: 'Afonso de Albuquerque captures the strategic strait, gateway to the Spice Islands.',
    coordinates: [102.2501, 2.1896],
    hasRoute: true,
  },
  {
    year: 1515,
    yearDisplay: '1515',
    location: 'Hormuz',
    region: 'Persian Gulf',
    description: 'Portuguese seize control of the strait, dominating Persian Gulf spice trade.',
    coordinates: [56.4547, 27.0769],
    hasRoute: true,
  },
  {
    year: 1522,
    yearDisplay: '1522',
    location: 'Ternate (Moluccas)',
    region: 'Spice Islands',
    description: 'Portuguese reach the legendary Spice Islands, source of cloves and nutmeg.',
    coordinates: [127.3866, 0.7893],
    hasRoute: true,
  },
  {
    year: 1542,
    yearDisplay: '1542',
    location: 'Philippines',
    region: 'Southeast Asia',
    description: 'Manila-Acapulco galleon trade brings peppers across the Pacific from Mexico.',
    coordinates: [121.774, 12.8797],
    hasRoute: true,
  },
  {
    year: 1550,
    yearDisplay: '1550',
    location: 'Thailand',
    region: 'Southeast Asia',
    description: 'Chilies become essential to Thai cuisine within decades.',
    coordinates: [100.5018, 13.7563],
    hasRoute: true,
  },
  {
    year: 1550,
    yearDisplay: 'c. 1550',
    location: 'Samarkand (Silk Road)',
    region: 'Central Asia',
    description: 'Peppers travel overland via ancient Silk Road routes from Persia.',
    coordinates: [66.9597, 39.6542],
    hasRoute: true,
  },
  {
    year: 1557,
    yearDisplay: '1557',
    location: 'Macao',
    region: 'East Asia',
    description: 'Portuguese establish trading post in China, gateway to East Asian markets.',
    coordinates: [113.5439, 22.1987],
    hasRoute: true,
  },
  {
    year: 1569,
    yearDisplay: '1569',
    location: 'Hungary',
    region: 'Central Europe',
    description: 'Paprika cultivation begins, later defining Hungarian cuisine.',
    coordinates: [19.0402, 47.4979],
    hasRoute: true,
  },
  {
    year: 1570,
    yearDisplay: '1570',
    location: 'Sichuan, China',
    region: 'East Asia',
    description: 'Chilies transform regional cuisine, creating málà flavor profile.',
    coordinates: [104.0665, 30.5728],
    hasRoute: true,
  },
  {
    year: 1600,
    yearDisplay: '1600',
    location: 'Aleppo & Turkey',
    region: 'The Levant',
    description: 'Distinct regional cultivars emerge: Aleppo, Urfa, Marash peppers.',
    coordinates: [37.1343, 36.2021],
    hasRoute: true,
  },
];

// Helper to calculate compressed timeline position
// Custom non-linear scale per user specification:
// - 4000 BCE at extreme left (2%)
// - 3000 BCE ~1.5cm from 4000 BCE (6%)
// - 1493 ~3cm from 3000 BCE (12%)
// - 1498-1600 spread from 18% to 82% (leaving room for Navigate button)
const getDisplayPosition = (year: number): number => {
  // Explicit positions for specific years
  if (year === -4000) return 2;       // 4000 BCE - extreme left
  if (year === -3000) return 6;       // 3000 BCE - ~1.5cm gap
  if (year === 1493) return 12;       // 1493 - ~3cm from 3000 BCE
  
  // Spread remaining events (1498-1600) across 18% to 82%
  // This ensures last event stays LEFT of Navigate button
  if (year >= 1498) {
    const minYear = 1498;
    const maxYear = 1600;
    const minPos = 18;
    const maxPos = 82; // Stop before Navigate button
    return minPos + ((year - minYear) / (maxYear - minYear)) * (maxPos - minPos);
  }
  
  // Fallback for any other years (interpolate between known points)
  if (year < 0) {
    // Between -4000 and -3000: interpolate 2% to 6%
    return 2 + ((year + 4000) / 1000) * 4;
  }
  // Between 0 and 1493: interpolate 6% to 12%
  return 6 + (year / 1493) * 6;
};

interface SpreadTimelineProps {
  onYearChange?: (year: number) => void;
  onEventChange?: (event: TimelineEvent) => void;
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  selectedEventIndex?: number; // External control for bidirectional sync
  onEventSelect?: (index: number) => void; // Callback when user clicks timeline event
}

export function SpreadTimeline({ 
  onYearChange, 
  onEventChange, 
  isPlaying: externalPlaying, 
  onPlayingChange,
  selectedEventIndex,
  onEventSelect 
}: SpreadTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(6000); // Default 6s (middle of range)

  const playing = externalPlaying !== undefined ? externalPlaying : isPlaying;
  const setPlaying = onPlayingChange || setIsPlaying;

  // Sync with external selection (from map location clicks)
  useEffect(() => {
    if (selectedEventIndex !== undefined && selectedEventIndex !== currentIndex) {
      setCurrentIndex(selectedEventIndex);
      setHasStarted(true);
    }
  }, [selectedEventIndex]);

  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= timelineEvents.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [playing, setPlaying, animationSpeed]);

  useEffect(() => {
    const event = timelineEvents[currentIndex];
    if (event) {
      if (onYearChange) onYearChange(event.year);
      if (onEventChange) onEventChange(event);
    }
  }, [currentIndex, onYearChange, onEventChange]);

  const handlePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setCurrentIndex(0);
    }
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleReset = () => {
    setPlaying(false);
    setCurrentIndex(0);
    setHasStarted(false);
  };

  const handleEventClick = (index: number) => {
    setCurrentIndex(index);
    setHasStarted(true);
    onEventSelect?.(index); // Notify parent for bidirectional sync
  };

  const currentEvent = timelineEvents[currentIndex];
  const progress = ((currentIndex + 1) / timelineEvents.length) * 100;

  return (
    <div className="bg-card/95 border-2 border-border">
      {/* Current Event Display */}
      <div className="p-4 border-b border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-[80px]"
          >
            <div className="flex items-start gap-4">
              <div className="text-center">
                <div className={`font-display text-2xl ${currentEvent.isOrigin ? 'text-primary' : 'text-gold'}`}>
                  {currentEvent.yearDisplay}
                </div>
                <div className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                  {currentEvent.region}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-display text-base md:text-lg uppercase tracking-wide text-foreground mb-1">
                  {currentEvent.location}
                </h4>
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Timeline Bar */}
      <div className="px-4 py-3">
        {/* Compressed Non-Linear Timeline */}
        <div className="relative h-3 bg-muted/50 mb-10 rounded-sm">
          {/* Era sections background */}
          <div className="absolute inset-0 flex rounded-sm overflow-hidden">
            <div className="bg-primary/10" style={{ width: '15%' }} title="Ancient History" />
            <div className="bg-muted" style={{ width: '5%' }} title="Medieval" />
            <div className="bg-gold/10" style={{ width: '80%' }} title="Age of Exploration" />
          </div>
          
          {/* Progress bar based on compressed position */}
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary to-gold rounded-sm"
            initial={{ width: '5%' }}
            animate={{ width: `${getDisplayPosition(currentEvent.year)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Event Markers with Year Labels */}
          <div className="absolute inset-0">
            {timelineEvents.map((event, index) => {
              const position = getDisplayPosition(event.year);
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              // Stagger labels above/below to reduce overlap in clustered areas
              const labelBelow = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{ left: `${position}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  {/* Marker dot */}
                  <button
                    onClick={() => handleEventClick(index)}
                    className="relative z-10 cursor-pointer hover:scale-125 transition-transform"
                    title={`${event.yearDisplay}: ${event.location}`}
                  >
                    <motion.div
                      className={`rounded-full shadow-md ${
                        event.isOrigin 
                          ? 'bg-primary border-2 border-gold' 
                          : isActive 
                            ? 'bg-gold border-2 border-primary' 
                            : 'bg-muted-foreground/40 border border-border'
                      }`}
                      animate={{
                        width: isCurrent ? 16 : 10,
                        height: isCurrent ? 16 : 10,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gold/30"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </button>
                  
                  {/* Year label - staggered above/below */}
                  <div 
                    className={`absolute left-1/2 whitespace-nowrap pointer-events-none
                      ${labelBelow ? 'top-4' : '-top-6'}
                    `}
                    style={{ 
                      transform: event.year >= 1400 ? 'translateX(-50%) rotate(-35deg)' : 'translateX(-50%)',
                      transformOrigin: 'center'
                    }}
                  >
                    <span 
                      className={`text-[9px] font-body transition-colors ${
                        isCurrent 
                          ? 'font-semibold text-gold' 
                          : isActive 
                            ? 'text-foreground/70' 
                            : 'text-muted-foreground/60'
                      }`}
                    >
                      {event.yearDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Era labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex text-[8px] font-body text-muted-foreground/60">
            <div className="text-center" style={{ width: '15%' }}>Ancient</div>
            <div className="text-center" style={{ width: '5%' }}></div>
            <div className="text-center" style={{ width: '80%' }}>Age of Exploration</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 w-8 p-0 border-border"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          {playing ? (
            <Button
              variant="pepper"
              size="sm"
              onClick={handlePause}
              className="h-8 px-4"
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
          ) : (
            <Button
              variant="pepper"
              size="sm"
              onClick={handlePlay}
              className="h-8 px-4"
            >
              <Play className="w-4 h-4 mr-1" />
              {hasStarted ? 'Resume' : 'Play Timeline'}
            </Button>
          )}
          
          <div className="font-body text-xs text-muted-foreground ml-2">
            {currentIndex + 1} / {timelineEvents.length}
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3 mt-3 px-2">
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-body text-muted-foreground w-8">Fast</span>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            min={2000}
            max={10000}
            step={500}
            className="flex-1"
          />
          <span className="text-[10px] font-body text-muted-foreground w-8">Slow</span>
        </div>
      </div>
    </div>
  );
}