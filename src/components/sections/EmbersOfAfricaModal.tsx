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
import embersOfAfricaImg from '@/assets/consortium/embers-of-africa.jpg';

interface EmbersOfAfricaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Peri Peri',
    origin: 'Mozambique / Angola (Indian Ocean Route)',
    heat: 'Medium-Hot (50,000–175,000 SHU)',
    flavor: 'Smoky, zesty, herbaceous. A favorite in grilled meats and marinades.',
    role: 'Anchor — brings smoky complexity and sets the foundation for the blend.',
  },
  {
    name: 'Urfa Biber',
    origin: 'Turkey (Levant Route)',
    heat: 'Medium (10,000–30,000 SHU)',
    flavor: 'Smoky, raisin-like, with earthy depth and mild heat.',
    role: 'Bridge — sun-dried Turkish pepper, adding dark fruit and smoky mystery.',
  },
  {
    name: 'Scotch Bonnet',
    origin: 'Caribbean / West Africa (Transatlantic Route)',
    heat: 'Hot (100,000–350,000 SHU)',
    flavor: 'Sweet, tropical, slightly floral. A defining flavor of Caribbean cuisine.',
    role: 'Body — its tropical sweetness creates an unmistakable island pulse.',
  },
  {
    name: 'Wiri Wiri',
    origin: 'Guyana (Atlantic Route)',
    heat: 'Hot (100,000–350,000 SHU)',
    flavor: 'Sharp, citrus-forward, tangy. Distinctive fruity sting.',
    role: 'Vanguard — its citrus bite lifts the blend with bright, unexpected fire.',
  },
  {
    name: 'Trinidad Scorpion',
    origin: 'Trinidad (Caribbean Route)',
    heat: 'Extreme (1,200,000–2,000,000 SHU)',
    flavor: 'Initial fruity notes followed by an intense, relentless wave of heat.',
    role: 'Flagship — a fiery crescendo that lingers long after the last bite.',
  },
];

const pairings = [
  'Grilled lamb or goat with mint yogurt',
  'Slow-roasted chicken with preserved lemon',
  'Black bean stew with coconut rice',
  'Braised oxtail or curried goat',
  'Charred plantains with a drizzle of honey',
  'Spiced flatbreads or injera',
  'Tropical fruit salsa (mango, papaya, pineapple)',
  'Okra-based dishes or gumbo',
];

export function EmbersOfAfricaModal({ open, onOpenChange }: EmbersOfAfricaModalProps) {
  console.log('[EmbersOfAfricaModal] Rendering with open:', open);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent preventAutoClose forceMount={open ? true : undefined} className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh] min-h-[200px]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={embersOfAfricaImg}
                alt="Embers of Africa Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 004
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Embers of Africa
                  </DialogTitle>
                  <DialogDescription className="sr-only">Details about the Embers of Africa pepper consortium</DialogDescription>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  A Layered Symphony of Heat Across Trade Routes
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
                    Close your eyes. Breathe.
                  </p>
                  <p>
                    Feel the sun on ancient soil. The hum of distant markets. The sizzle of meat on open flame. 
                    Hot Pepper Trading Company assembled this consortium as a passage through time—across deserts 
                    and oceans, woven from the hands of growers, traders, and cooks who understood one truth: heat is memory.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Embers of Africa</span> traces the routes that peppers 
                    traveled from Africa's coasts to the Caribbean, from the Levant to the New World. Each pepper 
                    was selected with intent—not for volume, but for its role in the layered narrative of flavor 
                    and provenance.
                  </p>
                  <p>
                    This is more than a collection. It is a conversation between continents, curated by route and lineage.
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
                  "This is not heat for heat's sake. It is a slow, deliberate burn that tells you where 
                  it's been—and invites you to follow."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 004 • Limited Production • Multi-Origin
                </p>
              </section>

              {/* Trade Details */}
              <ConsortiumTradeDetails consortiumId="embers-of-africa" heatRange="10,000–2,000,000 SHU" />
              
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
