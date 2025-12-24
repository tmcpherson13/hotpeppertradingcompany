import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Shovel, Leaf, X } from 'lucide-react';

interface ArchaeologicalSite {
  name: string;
  location: string;
  datesBP: number;
  evidenceType: 'macroremains' | 'starch fossils' | 'microfossils' | 'macrobotanical';
}

interface DomesticationEvent {
  species: string;
  scientificName: string;
  commonExamples: string[];
  dateRange: { earliest: number; confirmed: number };
  origin: string;
  coordinates: { lat: number; lng: number };
  archaeologicalSites: ArchaeologicalSite[];
  keyFindings: string;
  colorClass: string;
}

const domesticationEvents: DomesticationEvent[] = [
  {
    species: 'C. annuum',
    scientificName: 'Capsicum annuum',
    commonExamples: ['Jalapeño', 'Serrano', 'Poblano', 'Cayenne'],
    dateRange: { earliest: 7000, confirmed: 6000 },
    origin: 'Central-East Mexico',
    coordinates: { lat: 18.85, lng: -97.1 },
    archaeologicalSites: [
      { name: 'Tehuacán Valley', location: 'Puebla, Mexico', datesBP: 5600, evidenceType: 'macroremains' },
      { name: 'Ocampo Caves', location: 'Tamaulipas, Mexico', datesBP: 7000, evidenceType: 'macroremains' },
      { name: 'Coxcatlán Cave', location: 'Puebla, Mexico', datesBP: 5000, evidenceType: 'macroremains' }
    ],
    keyFindings: 'Oldest macroremains in Mesoamerica; starch fossils on grinding stones confirm processing for food preparation.',
    colorClass: 'bg-primary'
  },
  {
    species: 'C. chinense',
    scientificName: 'Capsicum chinense',
    commonExamples: ['Habanero', 'Scotch Bonnet', 'Ghost Pepper'],
    dateRange: { earliest: 6100, confirmed: 6000 },
    origin: 'Northern Lowland Amazonia',
    coordinates: { lat: -2.2, lng: -79.9 },
    archaeologicalSites: [
      { name: 'Loma Alta', location: 'Ecuador', datesBP: 6100, evidenceType: 'starch fossils' },
      { name: 'Loma Real', location: 'Ecuador', datesBP: 5500, evidenceType: 'microfossils' },
      { name: 'Las Vegas', location: 'Ecuador', datesBP: 6000, evidenceType: 'starch fossils' }
    ],
    keyFindings: 'Starch microfossils on milling stones indicate early processing; independently domesticated from C. annuum.',
    colorClass: 'bg-secondary'
  },
  {
    species: 'C. frutescens',
    scientificName: 'Capsicum frutescens',
    commonExamples: ['Tabasco', 'Piri Piri', 'Malagueta'],
    dateRange: { earliest: 6000, confirmed: 5500 },
    origin: 'Caribbean/Central America',
    coordinates: { lat: 24.5, lng: -77.8 },
    archaeologicalSites: [
      { name: 'Pre-contact Caribbean', location: 'The Bahamas', datesBP: 5000, evidenceType: 'macrobotanical' }
    ],
    keyFindings: 'Possibly derived from C. chinense; genetic studies suggest these species share a recent common ancestor.',
    colorClass: 'bg-[hsl(var(--tyrian))]'
  },
  {
    species: 'C. baccatum',
    scientificName: 'Capsicum baccatum',
    commonExamples: ['Ají Amarillo', 'Ají Limo', 'Bishop Crown'],
    dateRange: { earliest: 6000, confirmed: 4000 },
    origin: 'Lowland Bolivia/Peru',
    coordinates: { lat: -12.0, lng: -77.0 },
    archaeologicalSites: [
      { name: 'Huaca Prieta', location: 'Peru', datesBP: 4000, evidenceType: 'macrobotanical' },
      { name: 'Guitarrero Cave', location: 'Peru', datesBP: 4500, evidenceType: 'macroremains' }
    ],
    keyFindings: 'Distinctive "white spot" on flower petals; backbone of Andean cuisine for millennia.',
    colorClass: 'bg-[hsl(var(--gold-accent))]'
  },
  {
    species: 'C. pubescens',
    scientificName: 'Capsicum pubescens',
    commonExamples: ['Rocoto', 'Manzano', 'Locoto'],
    dateRange: { earliest: 6000, confirmed: 4000 },
    origin: 'Mid-elevation Southern Andes',
    coordinates: { lat: -16.5, lng: -68.15 },
    archaeologicalSites: [
      { name: 'Guitarrero Cave', location: 'Peru', datesBP: 4000, evidenceType: 'macroremains' }
    ],
    keyFindings: 'Only domesticated Capsicum with black seeds and cold tolerance; adapted to Andean highland cultivation above 1,500m.',
    colorClass: 'bg-emerald-700'
  }
];

// Convert BP to approximate calendar year for display
const bpToYear = (bp: number) => {
  const currentYear = 2000; // Reference year for BP dates
  return currentYear - bp;
};

// Timeline spans from 8000 BP to 3000 BP
const timelineStart = 8000;
const timelineEnd = 3000;
const timelineRange = timelineStart - timelineEnd;

export function DomesticationTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<DomesticationEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const getPositionPercent = (bp: number) => {
    return ((timelineStart - bp) / timelineRange) * 100;
  };

  return (
    <div className="relative">
      {/* Timeline Container */}
      <div className="bg-background/50 border border-border p-6 md:p-8 paper-texture">
        {/* Timeline Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-heading text-sm uppercase tracking-wider">Years Before Present</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shovel className="w-4 h-4" />
            <span className="font-body text-sm italic">Archaeological Evidence</span>
          </div>
        </div>

        {/* Timeline Scale - Desktop */}
        <div className="hidden md:block relative mb-4">
          <div className="flex justify-between text-sm font-heading text-muted-foreground uppercase tracking-wide">
            <span>8,000 BP</span>
            <span>7,000 BP</span>
            <span>6,000 BP</span>
            <span>5,000 BP</span>
            <span>4,000 BP</span>
            <span>3,000 BP</span>
          </div>
        </div>

        {/* Main Timeline - Desktop */}
        <div className="hidden md:block relative h-24 mb-8">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          {/* Era markers */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between">
            {[8000, 7000, 6000, 5000, 4000, 3000].map((bp) => (
              <div key={bp} className="w-px h-3 bg-border" />
            ))}
          </div>

          {/* Domestication event markers */}
          {domesticationEvents.map((event, index) => {
            const confirmedPos = getPositionPercent(event.dateRange.confirmed);
            const earliestPos = getPositionPercent(event.dateRange.earliest);
            const rangeWidth = confirmedPos - earliestPos;
            
            return (
              <motion.div
                key={event.species}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${earliestPos}%` }}
              >
                {/* Date range bar */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 h-2 ${event.colorClass} opacity-30 rounded-full`}
                  style={{ width: `${(rangeWidth / 100) * 800}px` }}
                />
                
                {/* Main marker */}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEvent(event)}
                  onMouseEnter={() => setHoveredEvent(event.species)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  className={`relative z-10 w-5 h-5 rounded-full ${event.colorClass} border-2 border-background shadow-md cursor-pointer
                    ${hoveredEvent === event.species ? 'ring-2 ring-offset-2 ring-offset-background ring-primary/50' : ''}`}
                  aria-label={`View details for ${event.scientificName}`}
                />
                
                {/* Species label - stagger vertically to avoid overlap */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                  style={{ 
                    top: index % 2 === 0 ? '2.5rem' : undefined,
                    bottom: index % 2 === 1 ? '2.5rem' : undefined
                  }}
                >
                  <span className="font-heading text-xs italic text-foreground">{event.species}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Timeline - Vertical Cards */}
        <div className="md:hidden space-y-4">
          {domesticationEvents.map((event, index) => (
            <motion.button
              key={event.species}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedEvent(event)}
              className="w-full text-left p-4 bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full ${event.colorClass} mt-1.5`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm italic text-foreground">{event.scientificName}</span>
                    <span className="font-body text-xs text-muted-foreground">
                      ~{event.dateRange.confirmed.toLocaleString()} BP
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-1">{event.origin}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {domesticationEvents.map((event) => (
              <button
                key={event.species}
                onClick={() => setSelectedEvent(event)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <div className={`w-3 h-3 rounded-full ${event.colorClass}`} />
                <span className="font-heading text-xs italic text-muted-foreground group-hover:text-foreground transition-colors">
                  {event.scientificName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-card border border-border p-6 md:p-8 relative"
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Species Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${selectedEvent.colorClass}`} />
                  <h4 className="font-display text-xl text-foreground">
                    <em>{selectedEvent.scientificName}</em>
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Common Cultivars
                    </p>
                    <p className="font-body text-foreground">
                      {selectedEvent.commonExamples.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Center of Origin
                      </p>
                      <p className="font-body text-foreground">{selectedEvent.origin}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Domestication Period
                      </p>
                      <p className="font-body text-foreground">
                        {selectedEvent.dateRange.earliest.toLocaleString()}–{selectedEvent.dateRange.confirmed.toLocaleString()} BP
                        <span className="text-muted-foreground text-sm ml-2">
                          ({Math.abs(bpToYear(selectedEvent.dateRange.earliest))}–{Math.abs(bpToYear(selectedEvent.dateRange.confirmed))} BCE)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Key Findings
                      </p>
                      <p className="font-body text-foreground text-sm leading-relaxed">
                        {selectedEvent.keyFindings}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Archaeological Sites */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shovel className="w-4 h-4 text-primary" />
                  <h5 className="font-heading text-sm uppercase tracking-wider text-foreground">
                    Archaeological Sites
                  </h5>
                </div>

                <div className="space-y-3">
                  {selectedEvent.archaeologicalSites.map((site, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-background/50 border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-heading text-sm font-semibold text-foreground">
                            {site.name}
                          </p>
                          <p className="font-body text-xs text-muted-foreground">
                            {site.location}
                          </p>
                        </div>
                        <span className="font-body text-xs text-primary font-semibold">
                          ~{site.datesBP.toLocaleString()} BP
                        </span>
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-2 capitalize">
                        Evidence: {site.evidenceType.replace('-', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructional text */}
      <p className="mt-4 font-body text-sm text-muted-foreground text-center italic">
        Click on a marker or species name to view detailed archaeological evidence.
      </p>
    </div>
  );
}
