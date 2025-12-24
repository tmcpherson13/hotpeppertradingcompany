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
import voicesOfTheAndesImg from '@/assets/consortium/voices-of-the-andes.jpg';

interface VoicesOfTheAndesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: 'Aji Amarillo',
    origin: 'Peru (Andean Highlands)',
    heat: 'Hot (30,000–50,000 SHU)',
    flavor: 'Fruity, tropical, bright with subtle berry notes.',
    role: 'The Heart—the golden soul of Peruvian cuisine for over 5,000 years.',
  },
  {
    name: 'Aji Limon',
    origin: 'Peru (Andean Trade Routes)',
    heat: 'Medium (15,000–30,000 SHU)',
    flavor: 'Citrusy, bright, with unmistakable lemon-like zest.',
    role: 'The Brightness—adding vibrant citrus notes that dance on the palate.',
  },
  {
    name: 'Rocoto',
    origin: 'Peru/Bolivia (High Andes)',
    heat: 'Very Hot (50,000–250,000 SHU)',
    flavor: 'Apple-like crunch with a fierce, lingering heat.',
    role: 'The Surprise—the only Capsicum pubescens, thriving in cold mountain air.',
  },
  {
    name: 'Aji Panca',
    origin: 'Peru (Coastal Valleys)',
    heat: 'Mild (500–1,500 SHU)',
    flavor: 'Deep, berry-like, with hints of dried fruit and subtle smokiness.',
    role: 'The Depth—providing rich, complex undertones without overwhelming heat.',
  },
  {
    name: 'Devil\'s Breath',
    origin: 'Ecuador (Northern Andes)',
    heat: 'Very Hot (150,000–200,000 SHU)',
    flavor: 'Intense, fruity, with floral notes and a delayed inferno.',
    role: 'The Peak—Ecuador\'s volcanic contribution that crowns the consortium.',
  },
];

const pairings = [
  'Traditional Peruvian ceviche',
  'Aji de gallina with rice',
  'Causa rellena (potato terrine)',
  'Lomo saltado (stir-fried beef)',
  'Rocoto relleno (stuffed peppers)',
  'Ecuadorian encebollado',
  'Anticuchos (grilled beef heart)',
  'Papa a la huancaína',
];

export function VoicesOfTheAndesModal({ open, onOpenChange }: VoicesOfTheAndesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={voicesOfTheAndesImg}
                alt="Voices of the Andes Pepper Consortium"
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
                    Voices of the Andes
                  </DialogTitle>
                </DialogHeader>
                <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
                  From Mountain Terraces to Coastal Markets
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
                    The mountains whisper. The peppers remember.
                  </p>
                  <p>
                    High above the clouds, where the Inca once built their terraces into impossible 
                    slopes, the aji has flourished for millennia. This is not merely a consortium—it 
                    is an excavation of flavor, a journey to the birthplace of the baccatum species 
                    where peppers grow in colors the conquistadors never imagined.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Voices of the Andes</span> gathers the 
                    treasures of Peru, Bolivia, and Ecuador—from the golden aji amarillo that colors 
                    Lima's markets to the cold-hardy rocoto that defies the thin mountain air. Each 
                    pepper is a voice from the past, singing of pre-Columbian feasts and Incan roads.
                  </p>
                  <p>
                    This is altitude. This is heritage. This is fire from the roof of the world.
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
                  "From the terraces of Machu Picchu to the markets of Lima—this is the fire that 
                  fueled empires and still burns in every ceviche today."
                </blockquote>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                  Consortium № 005 • Limited Production • Andean Origin
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
                  <span className="font-display text-primary text-lg">$42</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
                  <span className="font-display text-ink">Altitude</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
