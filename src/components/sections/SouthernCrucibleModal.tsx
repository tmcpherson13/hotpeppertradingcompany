import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Utensils, BookOpen } from 'lucide-react';
import southernCrucibleImg from '@/assets/consortium/southern-crucible.jpg';

interface SouthernCrucibleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Aji Limon',
    origin: 'Peru',
    heat: 'Moderate (30,000–50,000 SHU)',
    flavor: 'Bright citrus, lemon zest, clean fruity heat.',
    role: "Anchor — Peru's lemon drop, where citrus meets fire.",
  },
  {
    name: 'Aji Panca',
    origin: 'Peruvian Coast',
    heat: 'Mild (500–1,500 SHU)',
    flavor: 'Smoky, berry-like, with deep earthy sweetness.',
    role: 'Bridge — sun-dried coastal pepper, the color of Peruvian cuisine.',
  },
  {
    name: 'Rocoto',
    origin: 'Andean Highlands, Peru & Bolivia',
    heat: 'Very Hot (30,000–100,000 SHU)',
    flavor: 'Apple-like crunch, intense heat, slight vegetal sweetness.',
    role: 'Body — the only pepper that thrives in the cold Andean highlands.',
  },
  {
    name: 'Aji Amarillo',
    origin: 'Peru',
    heat: 'Moderate (30,000–50,000 SHU)',
    flavor: 'Fruity, slightly tropical, with a warm, lingering heat.',
    role: 'Vanguard — the golden soul of Peruvian cuisine.',
  },
  {
    name: 'Wiri Wiri',
    origin: 'Guyana & Suriname',
    heat: 'Hot (100,000–350,000 SHU)',
    flavor: 'Intense, fruity, with tropical sweetness and searing heat.',
    role: 'Flagship — Amazonian fire from the Guyanese frontier.',
  },
];

const pairings = [
  // Brazilian
  'Feijoada completa',
  'Moqueca de peixe',
  'Acarajé with vatapá',
  'Churrasco marinades',
  // Peruvian
  'Ceviche tigre',
  'Aji de gallina',
  'Rocoto relleno',
  'Lomo saltado',
  // Pan-South American
  'Chimichurri variations',
  'Empanada salsas',
];

export function SouthernCrucibleModal({ open, onOpenChange }: SouthernCrucibleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={southernCrucibleImg}
                alt="Southern Crucible Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 002
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Southern Crucible
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Where Every Pepper Was Born
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-8">
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
                    Every pepper on earth traces its lineage to South America. This is the crucible where fire was born.
                  </p>
                  <p>
                    Long before peppers traveled the globe, they evolved in the forests, mountains, 
                    and river valleys of South America. From the steaming jungles of the Amazon basin 
                    to the sun-baked coasts of Peru, from the wild Guyanese interior to the 
                    frost-touched highlands of Bolivia—Capsicum diversified into forms as varied 
                    as the continent itself.
                  </p>
                  <p>
                    The aji limon brings bright citrus fire to ceviche. The aji amarillo, Peru's 
                    golden pepper, defines the nation's cuisine from aji de gallina to causa. 
                    The wiri wiri, small and fierce, carries the heat of the Guyanese frontier. 
                    The sun-dried aji panca colors Peruvian cuisine burgundy-red. And high in the 
                    Andes, where other peppers cannot survive, the rocoto thrives in the cold, 
                    its black seeds a mark of the pubescens species found nowhere else.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Hot Pepper Trading Company</span> assembled 
                    this consortium to honor the source. From Amazon to Andes, from Peru to Guyana, 
                    these five cultivars represent the geographic and genetic diversity of the 
                    continent that gave fire to the world.
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
                  "The world borrowed fire from these lands. Every chili grown from Korea to 
                  Calabria is a descendant of South American soil."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 002 • Limited Production • Pan-South American Heritage
                </p>
              </section>

              {/* Trade Details */}
              <div className="flex items-center justify-center gap-8 py-4 border-t border-dashed border-ink/20">
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Weight</span>
                  <span className="font-display text-ink">3 oz / 85g</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Price</span>
                  <span className="font-display text-primary text-lg">$48</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">500–350,000 SHU</span>
                </div>
              </div>
              
              {/* Scroll indicator - at bottom of card */}
              <div className="flex justify-center pb-4 animate-bounce">
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-ink/40">
                  <path d="M2 2L12 11L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
