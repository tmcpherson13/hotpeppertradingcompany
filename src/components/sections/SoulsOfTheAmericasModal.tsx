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
import soulsOfTheAmericasImg from '@/assets/consortium/souls-of-the-americas.jpg';

interface SoulsOfTheAmericasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Ancho',
    origin: 'Mexico (Spanish Atlantic Routes)',
    heat: 'Medium (1,000–2,000 SHU)',
    flavor: 'Earthy, sweet, with notes of dried fruit and mild cocoa undertones.',
    role: 'The Foundation—its deep, earthy sweetness anchors traditional moles and adobos.',
  },
  {
    name: 'Scotch Bonnet',
    origin: 'Jamaica (Caribbean Trade Routes)',
    heat: 'Very Hot (250,000–350,000 SHU)',
    flavor: 'Fruity, tropical, slightly floral with a fierce, lingering heat.',
    role: 'The Soul—the unmistakable pulse of Caribbean jerk and pepper sauces.',
  },
  {
    name: 'Datil',
    origin: 'St. Augustine, Florida (Atlantic Colonial Routes)',
    heat: 'Very Hot (100,000–300,000 SHU)',
    flavor: 'Sweet, fruity, tropical with a surprising Minorcan heritage.',
    role: 'The Surprise—Florida\'s secret contribution, bridging Old and New World flavors.',
  },
  {
    name: 'Hatch Green Chili',
    origin: 'New Mexico (Modern American)',
    heat: 'Mild (5,000–8,000 SHU)',
    flavor: 'Earthy, green, slightly sweet with a roasted character.',
    role: 'The Terroir—capturing the essence of the American Southwest\'s chile culture.',
  },
  {
    name: 'Trinidad Scorpion',
    origin: 'Trinidad (Caribbean Routes)',
    heat: 'Superhot (1,200,000–2,000,000 SHU)',
    flavor: 'Initial fruity sweetness followed by an intense, relentless wave of heat.',
    role: 'The Legend—the Caribbean\'s volcanic finale that commands respect.',
  },
];

const pairings = [
  'Traditional Mexican mole negro',
  'Jamaican jerk chicken or pork',
  'Florida-style datil pepper hot sauce',
  'New Mexico green chile stew',
  'Caribbean curry with rice and peas',
  'Grilled carne asada tacos',
  'Smoked brisket with chile rub',
  'Tropical fruit salsa with mango',
];

export function SoulsOfTheAmericasModal({ open, onOpenChange }: SoulsOfTheAmericasModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={soulsOfTheAmericasImg}
                alt="Souls of the Americas Pepper Consortium"
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
                    Souls of the Americas
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  From Aztec Markets to Caribbean Shores
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-8">
              {/* The Story */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">The Story</h3>
                </div>
                <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed space-y-4">
                  <p className="italic text-ink/80">
                    The ancestors knew. The gods demanded fire.
                  </p>
                  <p>
                    Before Columbus ever dreamed of spice, the peoples of Mesoamerica had cultivated 
                    chilies for five thousand years. Hot Pepper Trading Company assembled this consortium 
                    as a homecoming—a return to the birthplace of capsicum where every pepper tells a story 
                    of empire, trade, and transformation.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Souls of the Americas</span> spans from 
                    the ancient markets of Tenochtitlan to the sun-drenched islands of the Caribbean. 
                    Each cultivar was selected for its place in the ancestral lineage—curated by historical 
                    context rather than commercial convenience.
                  </p>
                  <p>
                    This is where it all began. A collection presented with the gravity it deserves.
                  </p>
                </div>
              </section>

              <Separator className="bg-ink/20" />

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
                  "From the temples of the Aztecs to the shores of the Caribbean—this is the fire 
                  that launched a thousand ships and changed cuisine forever."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 003 • Limited Production • Pan-American
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
                  <span className="font-display text-primary text-lg">$40</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">Ancestral</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
