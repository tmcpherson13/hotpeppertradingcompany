import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Utensils, BookOpen } from 'lucide-react';
import andeanHeightsImg from '@/assets/regional-blends/andean-heights.jpg';

const pepperProfiles = [
  {
    name: 'Aji Panca',
    origin: 'Peru (Coastal)',
    heat: 'Mild (500–1,500 SHU)',
    flavor: 'Deep, berry-like sweetness with smoky, sun-dried complexity and mild warmth.',
    role: 'Anchor — the dark jewel of Peru, essential to adobos and anticuchos.',
  },
  {
    name: 'Aji Amarillo',
    origin: 'Peru',
    heat: 'Hot (40,000–50,000 SHU)',
    flavor: 'Fruity, tropical complexity with a building warmth and golden-orange hue.',
    role: 'Body — the cornerstone of Peruvian cuisine for 5,000 years, essential to ají de gallina.',
  },
  {
    name: "Devil's Breath",
    origin: 'Ecuador',
    heat: 'Extreme (1,500,000+ SHU)',
    flavor: 'Intense, fruity aromatics with devastating heat that unfolds in waves.',
    role: 'Finisher — the volcanic fire of the Andes, handle with reverence.',
  },
];

const pairings = [
  'Peruvian ceviche with fresh lime',
  'Ají de gallina (Peruvian chicken)',
  'Lomo saltado',
  'Grilled alpaca or lamb',
  'Quinoa bowls with roasted vegetables',
  'Tropical fruit salsas',
];

export function AndeanHeightsContent() {
  return (
    <>
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={andeanHeightsImg}
          alt="Andean Heights Regional Blend"
          className="w-full h-full object-cover sepia-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-3 bg-tyrian/90 text-gold border-none">
            Regional Consortium • 3 Cultivars
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
            Andean Heights
          </h2>
          <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
            Citrus • Tropical • Volcanic
          </p>
        </div>
      </div>

      {/* Content */}
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
              From the terraced slopes where peppers first learned to climb.
            </p>
            <p>
              The Andes gave the world the Capsicum baccatum species — peppers bred for 
              flavor as much as fire. For millennia, Andean peoples cultivated varieties 
              with citrus notes, tropical sweetness, and complex heat profiles.
            </p>
            <p>
              This blend spans the Andean heat spectrum from the bright, accessible 
              Aji Limon to the ancient Aji Amarillo to the modern volcanic intensity 
              of Devil's Breath. A journey from the valleys to the volcanic peaks.
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
            <span className="font-display text-primary text-lg">$17</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
            <span className="font-display text-ink">500–1,500,000+ SHU</span>
          </div>
        </div>
      </div>
    </>
  );
}
