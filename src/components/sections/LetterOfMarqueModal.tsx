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
import letterOfMarqueImg from '@/assets/consortium/letter-of-marque.jpg';

interface LetterOfMarqueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Orange Scotch Bonnet',
    origin: 'Jamaica (Caribbean Route)',
    heat: 'Hot (100,000–350,000 SHU)',
    flavor: 'Brilliant sunset-hued pods with fruity, tropical heat that defines jerk seasoning and pepper sauces from Kingston to Port-au-Prince.',
    role: 'Anchor — the heartbeat of Caribbean cuisine, pulsing through every island dish.',
  },
  {
    name: 'Caribbean Red Habanero',
    origin: 'Trinidad & Tobago (Caribbean Route)',
    heat: 'Very Hot (300,000–475,000 SHU)',
    flavor: 'Intensely aromatic with tropical fruit notes and volcanic heat.',
    role: 'Bridge — bringing the intense heat that island cooks have wielded for generations.',
  },
  {
    name: 'Rocoto',
    origin: 'Peru (South American Route)',
    heat: 'Hot (30,000–100,000 SHU)',
    flavor: 'Apple-like crunch with bold, lingering heat and a distinctive black-seeded presence.',
    role: 'Body — the highland pepper that privateers discovered when raiding Spanish colonial ports.',
  },
  {
    name: 'Fatalii',
    origin: 'Central Africa (African Route)',
    heat: 'Extra Hot (125,000–400,000 SHU)',
    flavor: 'Intense citrus and habanero-like fruitiness with searing, persistent heat.',
    role: 'Vanguard — African fire that crossed the Atlantic on merchant vessels and trade routes.',
  },
  {
    name: 'Trinidad Scorpion',
    origin: 'Trinidad & Tobago (Caribbean Route)',
    heat: 'Super Hot (1,200,000–2,000,000 SHU)',
    flavor: 'Fruity and floral opening that gives way to devastating, world-record heat.',
    role: 'Flagship — Trinidad\'s volcanic soil yielded a pepper so fierce it once held the world record.',
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

export function LetterOfMarqueModal({ open, onOpenChange }: LetterOfMarqueModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={letterOfMarqueImg}
                alt="Letter of Marque Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15] scale-x-[-1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 008
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Letter of Marque
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Sanctioned Fire from the Golden Age of Piracy
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
                    Privateering under the colors of crown and commerce.
                  </p>
                  <p>
                    The Caribbean archipelago, scattered like emeralds across azure waters, became the proving ground
                    where privateers carried more than just cargo—they carried fire. Hot Pepper Trading Company 
                    assembled this consortium to honor that era of sanctioned seafaring, when a letter of marque
                    transformed a merchant vessel into an instrument of licensed plunder.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Letter of Marque</span> traces the peppers from 
                    the jerk pits of Jamaica to Port Royal's taverns, from Nassau's pirate republic to the 
                    pepperpots of the Spanish Main. Each cultivar was selected for its role in the island 
                    narrative—carrying the heat of cannon smoke, the memory of rum-soaked shores, and the 
                    defiant spirit of those who sailed under the black flag.
                  </p>
                  <p>
                    This is fire with a license—assembled with the same deliberate care as a captain provisioning for a long voyage.
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
                  "This is the fire of the privateer—sanctioned by crown, refined by voyage, and 
                  celebrated in every bite that carries the spirit of the Golden Age."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 008 • Limited Production • Multi-Origin
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
