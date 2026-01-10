import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Utensils, BookOpen } from 'lucide-react';
import americanFusionImg from '@/assets/regional-blends/american-fusion.jpg';

const pepperProfiles = [
  {
    name: 'Fresno',
    origin: 'California',
    heat: 'Medium (2,500–10,000 SHU)',
    flavor: 'Bright, slightly fruity with clean heat and thick, meaty walls.',
    role: 'Anchor — the California classic, fresher and fruitier than jalapeño.',
  },
  {
    name: 'Rocoto',
    origin: 'Peru (Andes highlands)',
    heat: 'Hot (30,000–100,000 SHU)',
    flavor: 'Apple-like crunch with intense, unique heat and thick, juicy walls.',
    role: 'Body — the black-seeded highlander, one of the oldest domesticated peppers.',
  },
  {
    name: 'Datil',
    origin: 'Florida (St. Augustine)',
    heat: 'Very Hot (100,000–300,000 SHU)',
    flavor: 'Sweet, tangy, with fruity complexity and a clean, sharp heat.',
    role: 'Finisher — the Minorcan legacy, bridging Spanish colonial history with New World fire.',
  },
];

const pairings = [
  'California-style salsas and tacos',
  'Peruvian rocoto relleno',
  'Florida datil hot sauce',
  'Grilled fish and seafood',
  'Fusion cuisine dishes',
  'Farm-to-table vegetable dishes',
];

export function AmericanFusionContent() {
  return (
    <>
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={americanFusionImg}
          alt="American Fusion Regional Blend"
          className="w-full h-full object-cover sepia-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-3 bg-tyrian/90 text-gold border-none">
            Regional Consortium • 3 Cultivars
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
            American Fusion
          </h2>
          <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
            Fresh • Fruity • Continental
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
              Where continents meet in the Americas.
            </p>
            <p>
              The Americas span from the Andean highlands to the Florida coast, 
              and this blend captures that continental range. From California's 
              fresh Fresno to the ancient Rocoto of Peru to the colonial mystery 
              of the Datil — each pepper represents a different chapter in American 
              pepper history.
            </p>
            <p>
              This blend celebrates fusion — the blending of indigenous, colonial, 
              and modern pepper cultivation that defines the Americas. Three peppers 
              from three distinct traditions, united by the New World.
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
            <span className="font-display text-primary text-lg">$16</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
            <span className="font-display text-ink">2,500–300,000 SHU</span>
          </div>
        </div>
      </div>
    </>
  );
}
