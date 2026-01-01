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
import manilaGalleonImg from '@/assets/consortium/manila-galleon.jpg';

interface ManilaGalleonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Ancho',
    origin: 'Mexico (The Anchor)',
    heat: 'Mild (1,000–2,000 SHU)',
    flavor: 'Deep, sweet, raisin-like with subtle coffee and chocolate notes.',
    role: 'The Anchor—the dried poblano that Spanish galleons carried from Acapulco, the starting point of the trans-Pacific crossing.',
  },
  {
    name: 'Aji Amarillo',
    origin: 'Peru (The Golden Thread)',
    heat: 'Medium-Hot (30,000–50,000 SHU)',
    flavor: 'Fruity, bright, with notes of passion fruit and a distinctive golden color.',
    role: 'The Golden Thread—Peru\'s most beloved pepper, carried by Spanish ships to Manila as part of the silver-for-silk exchange.',
  },
  {
    name: 'Thai Bird\'s Eye',
    origin: 'Thailand (The Southeast Asian Fire)',
    heat: 'Very Hot (50,000–100,000 SHU)',
    flavor: 'Sharp, bright heat with citrus undertones and a quick, intense burn.',
    role: 'The Spark—Portuguese and Spanish traders introduced New World peppers to Southeast Asia, where they transformed local cuisines.',
  },
  {
    name: 'Gochugaru',
    origin: 'Korea (The Eastern Terminus)',
    heat: 'Mild-Medium (4,000–8,000 SHU)',
    flavor: 'Sweet, slightly smoky, with fruity undertones and a slow-building warmth.',
    role: 'The Convergence—arriving via both the sea routes through Manila and overland through China, Korean cuisine embraced the pepper completely.',
  },
  {
    name: 'Ghost Pepper',
    origin: 'India (The Legendary Fire)',
    heat: 'Extreme (855,000–1,041,000 SHU)',
    flavor: 'Initial fruity sweetness gives way to an overwhelming, long-lasting burn.',
    role: 'The Legend—Portuguese traders brought peppers to India, where they evolved into one of the world\'s most fearsome cultivars.',
  },
];

const pairings = [
  'Hatch chile verde with slow-braised pork',
  'Peruvian aji de gallina',
  'Thai pad krapao with holy basil',
  'Korean kimchi jjigae',
  'Vindaloo with Ghost pepper heat',
  'Sisig with Thai chili brightness',
  'Green chile breakfast burritos',
  'Gochujang-glazed grilled meats',
];

export function ManilaGalleonModal({ open, onOpenChange }: ManilaGalleonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={manilaGalleonImg}
                alt="The Manila Galleon Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-primary/90 text-primary-foreground border-none">
                  Pepper Consortium № 009
                </Badge>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
                    Manila Galleon
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  Across the Pacific—Silver, Silk, and Fire
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
                    For 250 years, the longest trade route in human history connected two worlds.
                  </p>
                  <p>
                    From 1565 to 1815, the Manila Galleons sailed annually between Acapulco and Manila—
                    a treacherous voyage of four to six months across the vast Pacific. They carried 
                    Mexican silver eastward and returned with Chinese silk, porcelain, and spices. But 
                    hidden among the cargo were the seeds that would transform Asian cuisine forever.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">The Manila Galleon</span> consortium traces 
                    this extraordinary journey. The Hatch chile descends from peppers the Spanish first 
                    cultivated in colonial New Mexico. Aji Amarillo traveled from Peru through Mexican 
                    ports. Once in Manila, these American peppers spread rapidly through Portuguese, 
                    Dutch, and local trading networks to Thailand, Korea, and India—where they evolved 
                    into entirely new forms.
                  </p>
                  <p>
                    The galleons are gone. Their fire burns on in every kitchen from Seoul to Chennai.
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
                  "The galleons are gone. Their fire burns on."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 009 • Limited Production • Trans-Pacific Route
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
                  <span className="font-display text-primary text-lg">$44</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">1,000–1,041,000 SHU</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
