import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Utensils, BookOpen } from 'lucide-react';
import africanFireImg from '@/assets/regional-blends/african-fire.jpg';

const pepperProfiles = [
  {
    name: 'Mombasa Chili',
    origin: 'Kenya (East African Coast)',
    heat: 'Medium-Hot (25,000–40,000 SHU)',
    flavor: 'Earthy, warm heat with subtle fruity undertones and a lingering warmth.',
    role: 'Anchor — the spice route pepper, traded from the ancient Swahili coast ports.',
  },
  {
    name: 'Peri Peri',
    origin: 'Mozambique & Southern Africa',
    heat: 'Hot (50,000–175,000 SHU)',
    flavor: 'Bright, citrusy heat with herbaceous notes and a clean, sharp finish.',
    role: 'Body — the Portuguese-African fusion that conquered the world from Nando\'s to home kitchens.',
  },
  {
    name: 'Malagueta',
    origin: 'Brazil (via West Africa)',
    heat: 'Hot (60,000–100,000 SHU)',
    flavor: 'Sharp, clean heat with slightly fruity, aromatic notes.',
    role: 'Finisher — the enslaved peoples\' pepper, carried across the Atlantic and back again.',
  },
];

const pairings = [
  'Peri peri grilled chicken',
  'Jollof rice and West African stews',
  'Grilled prawns with lemon',
  'Berbere spice blends',
  'Ethiopian injera accompaniments',
  'Mozambican piri piri marinades',
];

export function AfricanFireContent() {
  return (
    <>
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={africanFireImg}
          alt="African Fire Regional Blend"
          className="w-full h-full object-cover sepia-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-3 bg-tyrian/90 text-gold border-none">
            Regional Consortium • 3 Cultivars
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide">
            African Fire
          </h2>
          <p className="text-parchment/80 font-heading text-sm tracking-wide mt-2">
            Earthy • Citrus • Heritage
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
              Where Portuguese carracks brought New World fire to ancient kingdoms.
            </p>
            <p>
              Africa had no native Capsicum peppers — until the 16th century. Portuguese 
              traders introduced chilies from Brazil to their trading posts along the 
              African coast, and within generations, they became inseparable from local cuisines.
            </p>
            <p>
              This blend traces that fiery adoption — from the iconic Peri Peri of the 
              southern coast to the Mombasa chilies of the Swahili trade routes to the 
              Malagueta that traveled both ways across the Atlantic.
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
            <span className="font-display text-primary text-lg">$15</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
            <span className="font-display text-ink">25,000–175,000 SHU</span>
          </div>
        </div>
      </div>
    </>
  );
}
