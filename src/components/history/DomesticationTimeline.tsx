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

export function DomesticationTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<DomesticationEvent | null>(null);

  // Convert BP to approximate calendar year for display
  const bpToYear = (bp: number) => {
    const currentYear = 2000; // Reference year for BP dates
    return currentYear - bp;
  };

  return (
    <div className="relative">
      {/* Species Cards */}
      <div className="bg-background/50 border border-border p-6 md:p-8 paper-texture">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Leaf className="w-4 h-4" />
            <span className="font-heading text-sm uppercase tracking-wider">Domesticated Species</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shovel className="w-4 h-4" />
            <span className="font-body text-sm italic">Archaeological Evidence</span>
          </div>
        </div>

        {/* Species Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {domesticationEvents.map((event, index) => (
            <motion.button
              key={event.species}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedEvent(event)}
              className={`text-left p-4 bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group ${
                selectedEvent?.species === event.species ? 'ring-2 ring-primary border-primary' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full ${event.colorClass} group-hover:scale-110 transition-transform`} />
                <span className="font-heading text-sm italic text-foreground group-hover:text-primary transition-colors">
                  {event.species}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground mb-2">
                {event.origin}
              </p>
              <div className="flex items-center gap-1 text-primary">
                <Calendar className="w-3 h-3" />
                <span className="font-body text-xs font-semibold">
                  ~{event.dateRange.confirmed.toLocaleString()} BP
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-2 line-clamp-2">
                {event.commonExamples.slice(0, 3).join(', ')}
              </p>
            </motion.button>
          ))}
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
