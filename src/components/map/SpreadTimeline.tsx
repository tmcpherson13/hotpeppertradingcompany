import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineEvent {
  year: number;
  yearDisplay: string;
  location: string;
  region: string;
  description: string;
  isOrigin?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: -4000,
    yearDisplay: '4000 BCE',
    location: 'Mesoamerica',
    region: 'The Americas',
    description: 'Capsicum domesticated by indigenous peoples. Earliest evidence of cultivation.',
    isOrigin: true,
  },
  {
    year: -3000,
    yearDisplay: '3000 BCE',
    location: 'Peru & Bolivia',
    region: 'The Americas',
    description: 'Secondary center of capsicum diversity develops in the Andes.',
    isOrigin: true,
  },
  {
    year: 1493,
    yearDisplay: '1493',
    location: 'Spain',
    region: 'Europe',
    description: 'Columbus returns from second voyage with pepper seeds.',
  },
  {
    year: 1498,
    yearDisplay: '1498',
    location: 'Goa, India',
    region: 'South Asia',
    description: 'Portuguese traders introduce peppers via maritime routes.',
  },
  {
    year: 1500,
    yearDisplay: '1500',
    location: 'West Africa',
    region: 'Africa',
    description: 'Portuguese establish pepper cultivation along trade posts.',
  },
  {
    year: 1542,
    yearDisplay: '1542',
    location: 'Philippines',
    region: 'Southeast Asia',
    description: 'Spanish galleon trade brings peppers from Mexico.',
  },
  {
    year: 1550,
    yearDisplay: '1550',
    location: 'Thailand',
    region: 'Southeast Asia',
    description: 'Chilies become essential to Thai cuisine within decades.',
  },
  {
    year: 1569,
    yearDisplay: '1569',
    location: 'Hungary',
    region: 'Central Europe',
    description: 'Paprika cultivation begins, later defining Hungarian cuisine.',
  },
  {
    year: 1570,
    yearDisplay: '1570',
    location: 'Sichuan, China',
    region: 'East Asia',
    description: 'Chilies transform regional cuisine, creating málà flavor profile.',
  },
  {
    year: 1600,
    yearDisplay: '1600',
    location: 'Aleppo & Turkey',
    region: 'The Levant',
    description: 'Distinct regional varieties emerge: Aleppo, Urfa, Marash peppers.',
  },
];

interface SpreadTimelineProps {
  onYearChange?: (year: number) => void;
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export function SpreadTimeline({ onYearChange, isPlaying: externalPlaying, onPlayingChange }: SpreadTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

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
    }, 2500);

    return () => clearInterval(interval);
  }, [playing, setPlaying]);

  useEffect(() => {
    if (onYearChange && timelineEvents[currentIndex]) {
      onYearChange(timelineEvents[currentIndex].year);
    }
  }, [currentIndex, onYearChange]);

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
        {/* Progress Bar */}
        <div className="relative h-2 bg-muted mb-3">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Event Markers */}
          <div className="absolute inset-0 flex items-center">
            {timelineEvents.map((event, index) => {
              const position = ((index + 1) / timelineEvents.length) * 100;
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => handleEventClick(index)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2"
                  style={{ left: `${position}%` }}
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
              );
            })}
          </div>
        </div>

        {/* Timeline Labels */}
        <div className="flex justify-between text-[10px] font-body text-muted-foreground mb-3">
          <span>4000 BCE</span>
          <span>1500</span>
          <span>1600</span>
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
      </div>
    </div>
  );
}