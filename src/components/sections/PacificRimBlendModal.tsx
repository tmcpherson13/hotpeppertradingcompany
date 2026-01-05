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
import pacificRimImg from '@/assets/consortium/pacific-rim-blend.jpg';

interface PacificRimBlendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Gochugaru',
    origin: 'Korea',
    heat: 'Mild-Medium (4,000–8,000 SHU)',
    flavor: 'Sweet, slightly smoky with fruity notes and a slow-building warmth.',
    role: 'Anchor — the soul of Korean cuisine, essential for kimchi and gochujang.',
  },
  {
    name: 'Thai Bird\'s Eye',
    origin: 'Thailand & Southeast Asia',
    heat: 'Very Hot (50,000–100,000 SHU)',
    flavor: 'Sharp, bright heat with citrus undertones and clean, immediate fire.',
    role: 'Body — the backbone of Thai curries and stir-fries, adding electric intensity.',
  },
  {
    name: 'Tien Tsin',
    origin: 'China (Tianjin)',
    heat: 'Hot (50,000–75,000 SHU)',
    flavor: 'Clean, direct heat with a slight nuttiness when toasted in oil.',
    role: 'Finisher — the backbone of Sichuan and Hunan cooking, named for the great port city.',
  },
];

const pairings = [
  'Korean kimchi and banchan',
  'Thai green or red curry',
  'Kung Pao chicken and mapo tofu',
  'Stir-fried noodles and rice dishes',
  'Asian-inspired marinades',
  'Sichuan-style hot pot',
];

export function PacificRimBlendModal({ open, onOpenChange }: PacificRimBlendModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={pacificRimImg}
                alt="Pacific Rim Blend Regional Blend"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-tyrian/90 text-gold border-none">
                  Regional Blend • 3 Peppers
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Pacific Rim Blend
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Citrus • Bright • Complex
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 pb-16 space-y-8">
              {/* The Pepper Profiles */}
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

              {/* The Story */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-xl text-ink uppercase tracking-wide">The Story</h3>
                </div>
                <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed space-y-4">
                  <p className="italic text-ink/80">
                    Where the galleons landed, fire took root.
                  </p>
                  <p>
                    The Pacific Rim tells a story of connection. Spanish galleons carried peppers 
                    from Mexico to Manila, from there to the coasts of China, Korea, and beyond. 
                    Each culture transformed these new arrivals into something uniquely their own.
                  </p>
                  <p>
                    This blend captures that dynamic exchange — from Korea's sun-dried gochugaru 
                    to Thailand's electric bird's eye and China's essential Tien Tsin. Together, 
                    they represent centuries of adaptation and the bright, aromatic heat 
                    that defines Pacific Asian cuisine.
                  </p>
                </div>
              </section>

              <Separator className="bg-ink/20" />

              {/* Pairings */}
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

              {/* Trade Details */}
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
                  <span className="font-display text-ink">4,000–100,000 SHU</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
