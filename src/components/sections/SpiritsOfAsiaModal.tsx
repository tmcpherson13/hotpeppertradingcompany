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
import spiritsOfAsiaImg from '@/assets/consortium/spirits-of-asia.jpg';

interface SpiritsOfAsiaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Gochugaru',
    origin: 'Korea (Asian Trade Routes)',
    heat: 'Mild (4,000–8,000 SHU)',
    flavor: 'Sweet, smoky, with subtle fruit notes and a gentle warmth.',
    role: 'The Soul—the essential Korean pepper that defines kimchi and gochujang.',
  },
  {
    name: 'Thai Bird\'s Eye',
    origin: 'Thailand (Southeast Asian Routes)',
    heat: 'Hot (50,000–100,000 SHU)',
    flavor: 'Sharp, bright, peppery with an immediate, clean heat.',
    role: 'The Spark—the defining fire of Southeast Asian curries and stir-fries.',
  },
  {
    name: 'Afterglow',
    origin: 'China (Asian Spice Routes)',
    heat: 'Medium (5,000–10,000 SHU)',
    flavor: 'Warm, aromatic, with lingering complexity.',
    role: 'The Bridge—connecting mild and hot with its persistent, warming presence.',
  },
  {
    name: 'Siling Labuyo',
    origin: 'Philippines (Maritime Southeast Asia)',
    heat: 'Very Hot (80,000–100,000 SHU)',
    flavor: 'Sharp, citrusy, with an intense bite that fades quickly.',
    role: 'The Wild Card—the untamed Philippine pepper that adds unpredictable fire.',
  },
  {
    name: 'Tien Tsin',
    origin: 'China (Silk Road)',
    heat: 'Hot (50,000–75,000 SHU)',
    flavor: 'Sharp, clean heat with a slightly smoky finish.',
    role: 'The Classic—the iconic Chinese dried chili essential to Sichuan cuisine.',
  },
];

const pairings = [
  'Korean kimchi and banchan',
  'Thai green or red curry',
  'Sichuan mapo tofu',
  'Filipino adobo with vinegar',
  'Korean fried chicken',
  'Pad Thai or pad krapao',
  'Chinese kung pao chicken',
  'Japanese tantanmen ramen',
];

export function SpiritsOfAsiaModal({ open, onOpenChange }: SpiritsOfAsiaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={spiritsOfAsiaImg}
                alt="Spirits of Asia Pepper Consortium"
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
                    Spirits of Asia
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  From the Silk Road to the Spice Islands
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
                    The caravans moved slowly. The ships sailed faster.
                  </p>
                  <p>
                    When Portuguese traders brought capsicum to Asia in the 16th century, they sparked 
                    a culinary revolution. This is not merely a consortium—it is a testament to how 
                    a New World fruit became the heart of a continent's cuisine in just four centuries.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Spirits of Asia</span> traces the routes 
                    from Korean kimchi pots to Thai street woks, from Sichuan pepper mills to Philippine 
                    marketplaces. Each pepper represents a culture that embraced the fire and made it 
                    entirely their own.
                  </p>
                  <p>
                    This is adaptation. This is mastery. This is heat perfected through generations.
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
                      className="flex items-start gap-2 p-3 bg-parchment-dark/30 rounded border border-ink/10"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span className="font-body text-sm text-muted-foreground">{pairing}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="bg-ink/20" />

              {/* Closing Statement */}
              <section className="text-center py-4">
                <blockquote className="font-body text-lg text-ink/80 italic max-w-2xl mx-auto leading-relaxed">
                  "From fermented clay pots to blazing woks—this is the fire that crossed oceans 
                  and became the soul of a continent."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 004 • Limited Production • Pan-Asian
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
                  <span className="font-display text-ink">Harmonious</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
