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
import inspirationsOfIndiaImg from '@/assets/consortium/inspirations-of-india.jpg';

interface InspirationsOfIndiaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Kashmiri Chili',
    origin: 'Kashmir Valley (Indian Ocean Route)',
    heat: 'Mild (1,000–2,000 SHU)',
    flavor: 'Low heat, brilliant crimson color, slightly fruity with sweet undertones.',
    role: 'The Canvas—its vivid red paints tandoori and rogan josh with their signature color.',
  },
  {
    name: 'Byadgi',
    origin: 'Karnataka, India (Indian Ocean Route)',
    heat: 'Medium (10,000–20,000 SHU)',
    flavor: 'Aromatic, deep red, complex fragrance with earthy undertones.',
    role: 'The Aromatic—adds depth and mahogany richness without overwhelming heat.',
  },
  {
    name: 'Guntur Sannam',
    origin: 'Andhra Pradesh, India (Indian Ocean Route)',
    heat: 'Hot (30,000–40,000 SHU)',
    flavor: 'Hot, slightly sweet, pungent with a clean, direct heat.',
    role: 'The Backbone—the spice market\'s workhorse, providing reliable, clean heat.',
  },
  {
    name: 'Naga Morich',
    origin: 'Bengal Region, India/Bangladesh',
    heat: 'Extreme (800,000–1,200,000 SHU)',
    flavor: 'Fruity, intense, with a delayed but devastating burn.',
    role: 'The Fire—Bengal\'s volcanic contribution that bridges regional and superhot.',
  },
  {
    name: 'Ghost Pepper (Bhut Jolokia)',
    origin: 'Northeast India (Assam/Nagaland)',
    heat: 'Extreme (1,000,000+ SHU)',
    flavor: 'Initial fruitiness followed by relentless, smoky intensity.',
    role: 'The Legend—the world-famous finale that lingers like a monsoon memory.',
  },
];

const pairings = [
  'Tandoori chicken or lamb seekh kebabs',
  'Lamb rogan josh with fragrant basmati rice',
  'Chicken tikka masala or butter chicken',
  'Spiced lentil dal with ghee',
  'Mango or lime achaar (pickle)',
  'Hyderabadi biryani with cooling raita',
  'Samosas with mint chutney',
  'Paneer tikka or palak paneer',
];

export function InspirationsOfIndiaModal({ open, onOpenChange }: InspirationsOfIndiaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={inspirationsOfIndiaImg}
                alt="Inspirations of India Pepper Consortium"
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
                    Inspirations of India
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  A Chromatic Journey from Kashmir to Assam
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
                    Listen. The monsoon drums against clay tiles.
                  </p>
                  <p>
                    In the crimson valleys of Kashmir, merchants have measured saffron by the gram and chilies 
                    by the handful since before the Mughals crossed the passes. Hot Pepper Trading Company 
                    assembled this consortium as an odyssey through the subcontinent—from the misty highlands 
                    where color is currency to the volcanic northeast where heat defies comprehension.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Inspirations of India</span> traces the ancient 
                    spice routes that made kingdoms rich and cuisines immortal. Each pepper was selected for 
                    its role in the chromatic spectrum—curated not as inventory, but as a deliberate progression 
                    from color to aroma to fire.
                  </p>
                  <p>
                    This is a release assembled with restraint, honoring centuries of cultivation and trade.
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
                  "From the painter's palette to the pit of fire—this is India's full spectrum, 
                  measured not in miles but in Scoville."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 002 • Limited Production • Indian Subcontinent
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
                  <span className="font-display text-primary text-lg">$38</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">Chromatic</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
