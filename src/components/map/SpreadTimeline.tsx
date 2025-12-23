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
    year: 1500,
    yearDisplay: '1500',
    location: 'West Africa',
    region: 'Africa',
    description: 'Portuguese establish pepper cultivation along trade posts.',
    coordinates: [-1.0232, 7.9465],
    hasRoute: true,
  },
  {
    year: 1510,
    yearDisplay: 'c. 1510',
    location: 'Caribbean Islands',
    region: 'The Americas',
    description: 'African and European pepper varieties return to the New World, blending with native species.',
    coordinates: [-66.1057, 18.4655],
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
    description: 'Distinct regional varieties emerge: Aleppo, Urfa, Marash peppers.',
    coordinates: [37.1343, 36.2021],
    hasRoute: true,
  },
];

// Helper to calculate date-proportional position on timeline
const MIN_YEAR = -4000; // 4000 BCE
const MAX_YEAR = 1600;  // 1600 CE
const TOTAL_SPAN = MAX_YEAR - MIN_YEAR; // 5600 years

const getProportionalPosition = (year: number): number => {
  return ((year - MIN_YEAR) / TOTAL_SPAN) * 100;
};

interface SpreadTimelineProps {
  onYearChange?: (year: number) => void;
  onEventChange?: (event: TimelineEvent) => void;
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export function SpreadTimeline({ onYearChange, onEventChange, isPlaying: externalPlaying, onPlayingChange }: SpreadTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(6000); // Default 6s (middle of range)

  const playing = externalPlaying !== undefined ? externalPlaying : isPlaying;
  const setPlaying = onPlayingChange || setIsPlaying;

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
                <h4 className="font-display text-sm uppercase tracking-wide text-foreground mb-1">
                  {currentEvent.location}
                </h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Timeline Bar */}
      <div className="px-4 py-3">
        {/* Date-Proportional Timeline */}
        <div className="relative h-2 bg-muted mb-8">
          {/* Progress bar based on proportional position */}
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-gold"
            initial={{ width: 0 }}
            animate={{ width: `${getProportionalPosition(currentEvent.year)}%` }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Event Markers with Year Labels */}
          <div className="absolute inset-0">
            {timelineEvents.map((event, index) => {
              const position = getProportionalPosition(event.year);
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              // Stagger labels above/below to reduce overlap
              const labelBelow = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${position}%`, top: '50%' }}
                >
                  {/* Marker dot */}
                  <button
                    onClick={() => handleEventClick(index)}
                    className="transform -translate-y-1/2"
                  >
                    <motion.div
                      className={`rounded-full transition-colors ${
                        event.isOrigin 
                          ? 'bg-primary border-2 border-gold' 
                          : isActive 
                            ? 'bg-gold border-2 border-primary' 
                            : 'bg-muted-foreground/30 border border-border'
                      }`}
                      animate={{
                        width: isCurrent ? 14 : 8,
                        height: isCurrent ? 14 : 8,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                  
                  {/* Year label */}
                  <div 
                    className={`absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap
                      ${labelBelow ? 'top-3' : '-top-5'}
                      ${isCurrent ? 'font-semibold text-gold' : 'text-muted-foreground'}
                    `}
                  >
                    <span 
                      className={`text-[8px] font-body ${
                        event.year < 0 ? '' : 'rotate-[-45deg] inline-block origin-top-left'
                      }`}
                      style={event.year >= 0 ? { transform: 'rotate(-45deg)', transformOrigin: 'center' } : {}}
                    >
                      {event.yearDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Range Labels */}
        <div className="flex justify-between text-[10px] font-body text-muted-foreground mb-3">
          <span>4000 BCE</span>
          <span className="text-center flex-1">← Thousands of Years →</span>
          <span>1600 CE</span>
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