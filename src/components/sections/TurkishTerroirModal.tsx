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
import turkishTerroirImg from '@/assets/regional-blends/turkish-terroir.jpg';

interface TurkishTerroirModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Aleppo',
    origin: 'Syria/Turkey (Hatay)',
    heat: 'Medium (8,000–12,000 SHU)',
    flavor: 'Fruity, sun-dried tomato notes with moderate, oily heat and raisin-like sweetness.',
    role: 'Anchor — the Silk Road pepper, crushed with olive oil for its signature oily texture.',
  },
  {
    name: 'Urfa Biber',
    origin: 'Turkey (Şanlıurfa)',
    heat: 'Medium (7,000–15,000 SHU)',
    flavor: 'Smoky, earthy, with deep chocolate and raisin notes from sun-sweat curing.',
    role: 'Body — the dark jewel of Anatolia, sweated nightly to develop its sultry depth.',
  },
  {
    name: 'Marash Biber',
    origin: 'Turkey (Kahramanmaraş)',
    heat: 'Medium (2,500–5,000 SHU)',
    flavor: 'Warm, complex heat with sun-dried tomato sweetness and subtle smokiness.',
    role: 'Finisher — the silky red flakes of Maraş, gentler than Aleppo with deeper warmth.',
  },
];

const pairings = [
  'Turkish kebabs and köfte',
  'Lahmacun and pide',
  'Hummus and baba ganoush',
  'Eggs with olive oil',
  'Grilled vegetables',
  'Yogurt-based dips',
];

export function TurkishTerroirModal({ open, onOpenChange }: TurkishTerroirModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={turkishTerroirImg}
                alt="Turkish Terroir Regional Blend"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-tyrian/90 text-gold border-none">
                  Regional Consortium • 3 Cultivars
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Turkish Terroir
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Smoky • Earthy • Ancient
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 pb-16 space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">The Blend</h3>
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

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">The Story</h3>
                </div>
                <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed space-y-4">
                  <p className="italic text-ink/80">
                    Where the Silk Road met Ottoman kitchens.
                  </p>
                  <p>
                    The crossroads of continents, Turkey developed unique pepper varieties 
                    and curing techniques found nowhere else. The sun-sweat process of Urfa, 
                    the olive oil crush of Aleppo, the gentle drying of Marash — these are 
                    ancient traditions preserved by generations of pepper masters.
                  </p>
                  <p>
                    This blend celebrates pure Anatolian terroir — three Turkish treasures 
                    that showcase the region's mastery of pepper preservation and flavor 
                    development, each with its own distinct character.
                  </p>
                </div>
              </section>

              <Separator className="bg-ink/20" />

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Utensils className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">Suggested Pairings</h3>
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

              <div className="flex items-center justify-center gap-8 py-4 border-t border-dashed border-ink/20">
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Weight</span>
                  <span className="font-display text-ink">3 × 2oz</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Price</span>
                  <span className="font-display text-primary text-lg">$15</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">2,500–15,000 SHU</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
