import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollDownIndicator } from '@/components/ui/ScrollDownIndicator';
import { Flame, MapPin, Utensils, BookOpen } from 'lucide-react';
import { ConsortiumTradeDetails } from '@/components/consortium/ConsortiumTradeDetails';
import andeanDiasporaImg from '@/assets/consortium/andean-diaspora.jpg';

interface AndeanDiasporaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Aji Amarillo',
    origin: 'Peru (Andean Trade Routes)',
    heat: 'Hot (30,000–50,000 SHU)',
    flavor: 'Fruity, tropical, golden with subtle berry notes.',
    role: 'Anchor — the golden soul of Peruvian cuisine for over 5,000 years, where our diaspora begins.',
  },
  {
    name: 'Gochugaru',
    origin: 'Korea (East Asia)',
    heat: 'Mild (1,500–6,000 SHU)',
    flavor: 'Sweet, smoky, mild with lingering warmth.',
    role: 'Bridge — annuum at the Silk Road\'s terminus, the sweet-smoky backbone of kimchi.',
  },
  {
    name: 'Aleppo',
    origin: 'Syria (Levant)',
    heat: 'Mild (10,000 SHU)',
    flavor: 'Fruity, oily, sun-dried with cumin-like undertones.',
    role: 'Body — where annuum met the Levantine sun and found new character.',
  },
  {
    name: 'Aji Limon',
    origin: 'Peru (Andean Highlands)',
    heat: 'Medium (15,000–30,000 SHU)',
    flavor: 'Bright citrus, unmistakable lemon zest, clean heat.',
    role: 'Vanguard — the baccatum that stayed home in the Peruvian highlands, unchanged and bright.',
  },
  {
    name: "Devil's Breath",
    origin: 'Ecuador (Northern Andes)',
    heat: 'Very Hot (186,000 SHU)',
    flavor: 'Intense, fruity, floral with delayed inferno.',
    role: "Flagship — Ecuador's chinense that climbed the heat ladder to 186,000 SHU.",
  },
];

const pairings = [
  // Andean
  'Traditional Peruvian ceviche',
  'Aji de gallina',
  'Papa a la huancaína',
  // Levantine
  'Muhammara (walnut-pepper dip)',
  'Fattoush with Aleppo finish',
  'Grilled lamb with Aleppo',
  // Korean
  'Traditional kimchi',
  'Gochujang preparations',
  // Fusion
  'Cross-cultural hot sauce crafting',
];

export function AndeanDiasporaModal({ open, onOpenChange }: AndeanDiasporaModalProps) {
  console.log('[AndeanDiasporaModal] Rendering with open:', open);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent preventAutoClose forceMount={open ? true : undefined} className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh] min-h-[200px]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={andeanDiasporaImg}
                alt="The Andean Diaspora Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 003
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Andean Diaspora
                  </DialogTitle>
                  <DialogDescription className="sr-only">Details about the Andean Diaspora pepper consortium</DialogDescription>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Two Cultivars, Two Directions
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
                    The annuum that left the mountains did not return unchanged.
                  </p>
                  <p>
                    Long before the galleons, the Andes blazed. Three cultivars of Capsicum — annuum, 
                    baccatum, and chinense — arose in the mountain valleys of Peru and Ecuador. What 
                    happened next would reshape cuisines from Seoul to Aleppo.
                  </p>
                  <p>
                    Some peppers stayed. The baccatum cultivars — Aji Limon and Aji Amarillo — remained 
                    in Peru, their bright, fruity heat unchanged for five millennia. The chinense climbed 
                    higher, becoming Ecuador's Devil's Breath. But the annuum departed. Portuguese traders 
                    carried it westward to the Levant, where centuries of sun transformed it into the 
                    fruity complexity of Aleppo. Other ships carried it eastward — to India, to China, 
                    and finally to Korea, where it arrived via Japanese invasions in the 1590s and became 
                    the sweet-smoky soul of kimchi.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Hot Pepper Trading Company</span> assembled 
                    this consortium as a chronicle of migration and transformation. From the roof of the 
                    world to the Silk Road's terminus, from the Andes to Anatolia to Asia — this is the 
                    story of peppers that traveled, and those that stayed behind to burn brighter.
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
                  "In Aleppo, centuries of Levantine sun transformed it — tempered its heat, deepened 
                  its fruit. What returns to the Americas is not what left. This is the nature of diaspora."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 003 • Limited Production • Global Migration
                </p>
              </section>

              {/* Trade Details */}
              <ConsortiumTradeDetails consortiumId="andean-diaspora" heatRange="1,500–186,000 SHU" />
              
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
