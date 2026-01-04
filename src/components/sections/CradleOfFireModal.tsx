import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollDownIndicator } from '@/components/ui/ScrollDownIndicator';
import { Flame, MapPin, Utensils, BookOpen } from 'lucide-react';
import { ConsortiumTradeDetails } from '@/components/consortium/ConsortiumTradeDetails';
import cradleOfFireImg from '@/assets/consortium/cradle-of-fire.jpg';

interface CradleOfFireModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Chiltepin',
    origin: 'Sonora, Mexico (Wild Ancestor)',
    heat: 'Hot (50,000–100,000 SHU)',
    flavor: 'Sharp, smoky, quick-fading heat with berry undertones.',
    role: 'Anchor — the wild mother pepper, unchanged for 10,000 years.',
  },
  {
    name: 'Ancho',
    origin: 'Puebla, Mexico',
    heat: 'Mild (1,000–2,000 SHU)',
    flavor: 'Deep, sweet, raisin-like with subtle coffee notes.',
    role: 'Bridge — the dried poblano that defines Mexican mole.',
  },
  {
    name: 'Chipotle Morita',
    origin: 'Chihuahua, Mexico',
    heat: 'Medium (2,500–8,000 SHU)',
    flavor: 'Smoky, sweet, with dried fruit and chocolate undertones.',
    role: 'Body — the shorter-smoked jalapeño that defines adobo depth.',
  },
  {
    name: 'Serrano',
    origin: 'Puebla & Hidalgo, Mexico',
    heat: 'Hot (10,000–25,000 SHU)',
    flavor: 'Bright, crisp, grassy with clean, immediate heat.',
    role: 'Vanguard — the fresh pepper of Mexican street food.',
  },
  {
    name: 'Habanero',
    origin: 'Yucatán Peninsula, Mexico',
    heat: 'Very Hot (100,000–350,000 SHU)',
    flavor: 'Intensely fruity, floral, tropical with searing heat.',
    role: 'Flagship — Yucatán\'s fierce chinense, the summit of Mexican heat.',
  },
];

const pairings = [
  // Traditional Mexican
  'Mole negro oaxaqueño',
  'Adobo de chipotle',
  'Tinga de pollo',
  'Chiles rellenos',
  // Street Food & Grilled
  'Tacos al pastor',
  'Barbacoa and smoked meats',
  'Carne asada with salsa morita',
  // Yucatecan
  'Cochinita pibil',
  'Xcatic and habanero salsas',
  // Modern Applications
  'Smoked chili chocolate desserts',
];

export function CradleOfFireModal({ open, onOpenChange }: CradleOfFireModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={cradleOfFireImg}
                alt="Cradle of Fire Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 001
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Cradle of Fire
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  The Mesoamerican Origin Story
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 pb-16 space-y-8">
              {/* The Pepper Profiles */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">The Consortium</h3>
                </div>
                <div className="space-y-6">
                  {pepperProfiles.map((pepper, index) => (
                    <div 
                      key={pepper.name}
                      className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-parchment border-2 border-primary/50 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display text-lg text-ink">{pepper.name}</h4>
                          <Badge variant="outline" className="text-[10px] border-ink/30">
                            {pepper.heat}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {pepper.origin}
                        </div>
                        <p className="font-body text-sm text-muted-foreground">
                          <span className="font-semibold text-ink/80">Flavor:</span> {pepper.flavor}
                        </p>
                        <p className="font-body text-sm text-primary/90 italic">
                          {pepper.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="bg-ink/20" />

              {/* The Story */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">The Story</h3>
                </div>
                <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed space-y-4">
                  <p className="italic text-ink/80">
                    Before Columbus, before the galleons, before the world knew fire — there was Mexico.
                  </p>
                  <p>
                    Ten thousand years ago, in the sun-scorched canyons of Sonora, humans first 
                    encountered the wild chiltepin. Birds had scattered its seeds for millennia, 
                    but it was here, in Mesoamerica, that cultivation began. From this tiny, 
                    fierce ancestor, the Aztec, Maya, and Olmec civilizations would breed the 
                    diversity that now spans the globe.
                  </p>
                  <p>
                    The dried ancho became the soul of mole. The chipotle morita brought smoke 
                    and sweetness to adobo. The serrano brought everyday heat to the streets and markets. 
                    And in the humid jungles of the Yucatán, the habanero evolved separately — 
                    a chinense cultivar that climbed to extraordinary heights of heat while 
                    retaining tropical, floral complexity.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Hot Pepper Trading Company</span> assembled 
                    this consortium as homage to the source. These five cultivars represent the full 
                    arc of Mexican pepper culture — from wild ancestor to cultivated foundation to 
                    the searing culmination of Yucatecan fire. This is where it all began.
                  </p>
                </div>
              </section>

              <Separator className="bg-ink/20" />

              {/* Pairings & Signature Dishes */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Utensils className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">Pairings & Signature Dishes</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pairings.map((pairing) => (
                    <div 
                      key={pairing}
                      className="flex items-center gap-2 p-3 bg-parchment-dark/30 rounded border border-ink/10"
                    >
                      <span className="text-primary">•</span>
                      <span className="font-body text-sm text-muted-foreground">{pairing}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="bg-ink/20" />

              {/* Closing Statement */}
              <section className="text-center py-4">
                <blockquote className="font-body text-lg text-ink/80 italic max-w-2xl mx-auto leading-relaxed">
                  "Every pepper on earth traces its lineage to these lands. What the world calls 
                  chili, Mexico simply calls home."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 001 • Limited Production • Mesoamerican Heritage
                </p>
              </section>

              {/* Trade Details */}
              <ConsortiumTradeDetails consortiumId="cradle-of-fire" heatRange="Origin" />
              
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
