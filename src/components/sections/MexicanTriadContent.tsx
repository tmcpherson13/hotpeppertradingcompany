import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Utensils, BookOpen } from 'lucide-react';
import mexicanTriadImg from '@/assets/regional-blends/mexican-triad.jpg';

const pepperProfiles = [
  {
    name: 'Chipotle Morita',
    origin: 'Mexico',
    heat: 'Medium (5,000–10,000 SHU)',
    flavor: 'Smoky, rich, with deep chocolate and tobacco notes from the smoking process.',
    role: 'Anchor — the smoked jalapeño, smaller and smokier than chipotle meco.',
  },
  {
    name: 'Chile de Árbol',
    origin: 'Mexico',
    heat: 'Hot (15,000–30,000 SHU)',
    flavor: 'Bright, nutty, with grassy undertones and clean, direct heat.',
    role: 'Body — the "tree chile" with thin walls that dry to a translucent red.',
  },
  {
    name: 'Orange Habanero',
    origin: 'Mexico (Yucatán)',
    heat: 'Very Hot (100,000–350,000 SHU)',
    flavor: 'Intense tropical fruit with citrus notes and fierce, lingering heat.',
    role: 'Finisher — the Yucatán flame, bringing Caribbean fire to Mexican cuisine.',
  },
];

const pairings = [
  'Adobo sauces and marinades',
  'Mole negro and mole rojo',
  'Cochinita pibil',
  'Yucatán-style hot sauces',
  'Barbacoa and carnitas',
  'Smoky salsas',
];

export function MexicanTriadContent() {
  return (
    <>
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={mexicanTriadImg}
          alt="Mexican Triad Regional Blend"
          className="w-full h-full object-cover sepia-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-3 bg-tyrian/90 text-gold border-none">
            Regional Consortium • 3 Cultivars
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
            Mexican Triad
          </h2>
          <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
            Earthy • Bright • Essential
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
              From smoke to flame — Mexico's range of fire.
            </p>
            <p>
              Mexico is the cradle of pepper cultivation, with dozens of distinct varieties 
              developed over millennia. This blend spans Mexico's heat spectrum — from the 
              deep, smoky Chipotle Morita through the sharp Árbol to the tropical inferno 
              of the Orange Habanero from the Yucatán.
            </p>
            <p>
              Together, they form a journey through Mexican cooking traditions, from 
              the central highlands to the Caribbean coast.
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
            <span className="font-display text-primary text-lg">$13</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
            <span className="font-display text-ink">5,000–350,000 SHU</span>
          </div>
        </div>
      </div>
    </>
  );
}
