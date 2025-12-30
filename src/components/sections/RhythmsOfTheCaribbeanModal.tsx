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
import rhythmsOfTheCaribbeanImg from '@/assets/consortium/rhythms-of-the-caribbean.jpg';

interface RhythmsOfTheCaribbeanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Scotch Bonnet',
    origin: 'Jamaica (Caribbean Route)',
    heat: 'Hot (100,000–350,000 SHU)',
    flavor: 'Fruity, floral heat that defines jerk seasoning and pepper sauces from Kingston to Port-au-Prince.',
    role: 'The rhythm—the heartbeat of Caribbean cuisine, pulsing through every island dish.',
  },
  {
    name: 'Caribbean Red Habanero',
    origin: 'Trinidad & Tobago (Caribbean Route)',
    heat: 'Very Hot (300,000–475,000 SHU)',
    flavor: 'Intensely aromatic with tropical fruit notes and volcanic heat.',
    role: 'The fire—bringing the intense heat that island cooks have wielded for generations.',
  },
  {
    name: 'Datil Pepper',
    origin: 'St. Augustine, Florida (Atlantic Route)',
    heat: 'Hot (100,000–300,000 SHU)',
    flavor: 'Sweet and hot with hints of citrus and tropical fruit.',
    role: 'The memory—bridging the Caribbean to the American South through Minorcan heritage.',
  },
  {
    name: 'Wiri Wiri',
    origin: 'Guyana (Atlantic Route)',
    heat: 'Hot (100,000–350,000 SHU)',
    flavor: 'Sharp, citrus-forward, tangy with a distinctive fruity sting.',
    role: 'The soul—the secret weapon of Guyanese pepperpot and South American Caribbean kitchens.',
  },
  {
    name: 'Congo Pepper',
    origin: 'Trinidad (Caribbean Route)',
    heat: 'Extreme (300,000–500,000 SHU)',
    flavor: 'Initial fruity sweetness followed by devastating, beautiful heat.',
    role: 'The legend—named for the strength of enslaved Africans, carrying centuries of history.',
  },
];

const pairings = [
  'Jerk chicken with rice and peas',
  'Pepperpot stew with cassava bread',
  'Curry goat with roti',
  'Grilled plantains with honey drizzle',
  'Conch fritters with pepper sauce',
  'Callaloo with saltfish',
  'Oxtail with butter beans',
  'Rum-infused tropical cocktails',
];

export function RhythmsOfTheCaribbeanModal({ open, onOpenChange }: RhythmsOfTheCaribbeanModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={rhythmsOfTheCaribbeanImg}
                alt="Rhythms of the Caribbean Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 847
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Rhythms of the Caribbean
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Island Fire That Carries the Spirit of Resistance & Celebration
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
                    From turquoise waters to volcanic peaks.
                  </p>
                  <p>
                    The Caribbean archipelago, scattered like emeralds across azure waters, became the crucible 
                    where African, Indigenous, European, and Asian food traditions collided. Hot Pepper Trading 
                    Company assembled this consortium to honor that convergence—a collection curated by island 
                    route rather than commercial expedience.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Rhythms of the Caribbean</span> traces the peppers from 
                    the jerk pits of Jamaica to the pepperpots of Guyana. Each cultivar was selected for its role 
                    in the island narrative—carrying the rhythm of steel drums, the memory of sugar plantations, 
                    and the defiant spirit of peoples who transformed ingredients of survival into cuisines of celebration.
                  </p>
                  <p>
                    This is a release presenting resilience made edible, assembled with deliberate care.
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
                  "This is the fire of resilience—born from struggle, refined by time, and 
                  celebrated in every bite that carries the rhythm of the islands."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 847 • Limited Production • Multi-Origin
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
                  <span className="font-display text-ink">Intense</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
