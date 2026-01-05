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
import { ConsortiumTradeDetails } from '@/components/consortium/ConsortiumTradeDetails';
import phoenicianLegacyImg from '@/assets/consortium/phoenician-legacy.jpg';

interface PhoenicianLegacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Aleppo',
    origin: 'Syria (The Crossroads)',
    heat: 'Mild-Medium (8,000–12,000 SHU)',
    flavor: 'Fruity, sun-dried tomato notes with moderate, oily heat and raisin-like sweetness.',
    role: 'Anchor — from one of the oldest continuously inhabited cities on the ancient trade routes, where caravans rested and cultures converged.',
  },
  {
    name: 'Calabrian',
    origin: 'Italy (The Italian Toe)',
    heat: 'Hot (25,000–40,000 SHU)',
    flavor: 'Fruity, smoky, with a spicy kick that defines Southern Italian cuisine.',
    role: 'Bridge — brought by Spanish traders to the sun-drenched toe of Italy, where it became essential to Calabrian identity.',
  },
  {
    name: 'Urfa Biber',
    origin: 'Turkey (Anatolia)',
    heat: 'Medium (7,000–15,000 SHU)',
    flavor: 'Smoky, dried-currant sweetness with earthy, coffee, and chocolate undertones.',
    role: 'Body — cured in the ancient Anatolian sun, sweated overnight to develop its haunting complexity.',
  },
  {
    name: 'Peri Peri',
    origin: 'Portugal/Africa (The Cape Route)',
    heat: 'Very Hot (50,000–175,000 SHU)',
    flavor: 'Citrus-forward, bright, with intense, lingering heat.',
    role: 'Vanguard — Portuguese navigators carried peppers from the New World around the Cape, fusing Mediterranean and African traditions.',
  },
  {
    name: 'Cayenne',
    origin: 'French Guiana via Europe (The Atlantic Bridge)',
    heat: 'Hot (30,000–50,000 SHU)',
    flavor: 'Clean, pungent heat with subtle fruity undertones and sharp, direct character.',
    role: 'Flagship — Named for the port of Cayenne, this pepper became the workhorse of European spice cabinets, ground and traded across Mediterranean ports by the 16th century.',
  },
];

const pairings = [
  'Aleppo-rubbed lamb kebabs with tzatziki',
  'Calabrian \'nduja on crusty bread',
  'Urfa Biber on lahmacun or eggs',
  'Peri peri grilled prawns',
  'Cayenne-dusted grilled fish with lemon',
  'Mediterranean shakshuka',
  'Calabrian pasta alla diavola',
  'Levantine muhammara',
];

export function PhoenicianLegacyModal({ open, onOpenChange }: PhoenicianLegacyModalProps) {
  console.log('[PhoenicianLegacyModal] Rendering with open:', open);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent forceMount={open ? true : undefined} className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30 relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh] min-h-[200px]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={phoenicianLegacyImg}
                alt="The Phoenician Legacy Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 005
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Phoenician Legacy
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Ancient Routes, Mediterranean Fire
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
                    Before Rome, before Greece—there were the Phoenicians.
                  </p>
                  <p>
                    Long before capsicums arrived from the Americas, Phoenician traders had already woven the 
                    Mediterranean into a single commercial tapestry. Their routes—from Tyre and Sidon to 
                    Carthage, from the Levant to the Pillars of Hercules—became the highways along which 
                    peppers would later travel when Spanish galleons returned from the New World.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">The Phoenician Legacy</span> honors this continuity. 
                    The Aleppo pepper still sun-dries where ancient caravans once paused. Calabrian chilies 
                    flourish where Phoenician colonies once traded. Urfa Biber cures in the same Anatolian sun 
                    that warmed merchants crossing between East and West. Even the Portuguese peri peri and 
                    the cayenne that European traders distributed across Mediterranean ports trace their lineage through these ancient networks.
                  </p>
                  <p>
                    The routes change. The fire endures.
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
                  "The routes change. The fire endures."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 005 • Limited Production • Mediterranean Basin
                </p>
              </section>

              {/* Trade Details */}
              <ConsortiumTradeDetails consortiumId="phoenician-legacy" heatRange="7,000–175,000 SHU" />
              
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
