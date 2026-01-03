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
import silkJadePassagesImg from '@/assets/consortium/silk-jade-passages.jpg';

interface SilkJadePassagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Gochugaru',
    origin: 'Korea (Eastern Terminus)',
    heat: 'Mild (4,000–8,000 SHU)',
    flavor: 'Sweet, smoky, with subtle fruit notes and a gentle warmth.',
    role: 'Anchor — where overland caravans and maritime traders both arrived, transforming a New World fruit into the soul of Korean cuisine.',
  },
  {
    name: 'Urfa Biber',
    origin: 'Turkey (Anatolian Passage)',
    heat: 'Medium (30,000–50,000 SHU)',
    flavor: 'Smoky, dried-currant sweetness with earthy, coffee undertones.',
    role: 'Bridge — slow-dried in Anatolia, carrying the last warmth of the Silk Road before the eastern mountains.',
  },
  {
    name: 'Aleppo',
    origin: 'Syria (The Crossroads)',
    heat: 'Mild-Medium (10,000–25,000 SHU)',
    flavor: 'Fruity, sun-dried tomato notes with moderate, oily heat.',
    role: 'Body — the caravanserai where overland traders rested before the final passage east.',
  },
  {
    name: "Thai Bird's Eye",
    origin: 'Thailand (Maritime Southeast Asia)',
    heat: 'Hot (50,000–100,000 SHU)',
    flavor: 'Sharp, bright, peppery with an immediate, clean heat.',
    role: 'Vanguard — arriving by sea, it became the defining fire of Southeast Asian woks.',
  },
  {
    name: 'Ghost',
    origin: 'India (Assam Valley)',
    heat: 'Superhot (855,000–1,041,427 SHU)',
    flavor: 'Fruity, slightly sweet, with a slow-building volcanic intensity.',
    role: "Flagship — from Assam's remote valleys, the pepper that proved maritime routes reached the wildest extremes.",
  },
];

const pairings = [
  'Turkish lahmacun with Urfa Biber',
  'Aleppo-rubbed lamb kebabs',
  'Thai basil stir-fry (pad krapao)',
  'Korean kimchi and gochujang',
  'Indian ghost pepper curry',
  'Levantine muhammara',
  'Korean fried chicken',
  'Thai green or red curry',
];

export function SilkJadePassagesModal({ open, onOpenChange }: SilkJadePassagesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={silkJadePassagesImg}
                alt="Silk & Jade Passages Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 006
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Silk & Jade Passages
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Where the Caravans Met the Sea
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
                    Some peppers traveled by camel. Others, by sail.
                  </p>
                  <p>
                    When Portuguese traders brought capsicum to Asia in the 16th century, they sparked 
                    a culinary revolution that unfolded along two distinct paths. The overland <span className="font-semibold text-ink">Silk Road</span> carried 
                    peppers from Mediterranean ports through Aleppo and Anatolia, while the maritime <span className="font-semibold text-ink">Jade Passage</span> 
                    delivered them through India and Southeast Asia to the eastern shores.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">The Silk & Jade Passages</span> honors both journeys.
                    From the Levantine crossroads where caravans rested, to the volcanic valleys of Assam where 
                    maritime routes reached their most extreme expression—each pepper marks a waypoint in the 
                    eastward migration of heat.
                  </p>
                  <p>
                    By silk or by jade, the fire found its way east—and there it stayed.
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
                  "By silk or by jade, the fire found its way east—and there it stayed."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 006 • Limited Production • Silk Road & Maritime Routes
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
                  <span className="font-display text-primary text-lg">$35</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">4,000–1,041,427 SHU</span>
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
