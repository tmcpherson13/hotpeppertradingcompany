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
import indianSubcontinentImg from '@/assets/regional-blends/indian-subcontinent.jpg';

interface IndianSubcontinentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Kashmiri Chili',
    origin: 'India (Kashmir Valley)',
    heat: 'Mild (1,000–2,000 SHU)',
    flavor: 'Sweet, slightly fruity with brilliant crimson color and gentle warmth.',
    role: 'Anchor — the color king of Indian cuisine, essential for tandoori\'s signature hue.',
  },
  {
    name: 'Ghost Pepper',
    origin: 'Northeast India (Assam)',
    heat: 'Extreme (855,000–1,041,000 SHU)',
    flavor: 'Slow-building, devastating heat with fruity, smoky complexity.',
    role: 'Body — the Bhut Jolokia, once the world\'s hottest, used sparingly for depth.',
  },
  {
    name: 'Naga Viper',
    origin: 'England (from Indian genetics)',
    heat: 'Superhot (1,349,000+ SHU)',
    flavor: 'Intense, complex heat with floral notes and a slow, creeping burn.',
    role: 'Finisher — the British-bred hybrid, a cross of Naga Morich, Bhut Jolokia, and Trinidad Scorpion.',
  },
];

const pairings = [
  'Tandoori chicken and lamb',
  'Rogan josh and Kashmiri curries',
  'Vindaloo and phaal (for the brave)',
  'Extreme curry challenges',
  'Indian pickles and chutneys',
  'Chocolate-chili fusions',
];

export function IndianSubcontinentModal({ open, onOpenChange }: IndianSubcontinentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={indianSubcontinentImg}
                alt="Indian Subcontinent Regional Blend"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-tyrian/90 text-gold border-none">
                  Regional Blend • 3 Peppers
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Indian Subcontinent
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Aromatic • Colorful • Intense
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
                    From the highlands of Kashmir to the volcanic intensity of the Naga lands.
                  </p>
                  <p>
                    India is the world's largest producer and consumer of chili peppers, and 
                    its northeastern states gave birth to the superhot revolution. The Bhut 
                    Jolokia, Naga Morich, and their descendants represent the pinnacle of 
                    Capsicum chinense development.
                  </p>
                  <p>
                    This blend explores India's extremes — from the gentle, color-rich Kashmiri 
                    to the legendary Ghost Pepper and the British-bred Naga Viper that combines 
                    Indian genetics into something even more intense. Handle with reverence.
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
                  <span className="font-display text-primary text-lg">$17</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">1,000–1,349,000+ SHU</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
