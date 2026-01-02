import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Flame, MapPin, Utensils, BookOpen } from "lucide-react";
import consortiumImage from "@/assets/consortium/atlantic-provenance.jpg";

interface AtlanticProvenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: "Ancho",
    origin: "Mexico",
    heat: "1,000–2,000 SHU",
    flavor: "Dried fruit, tobacco, mild chocolate",
    role: "Anchor — the foundation of mole and the baseline of this crossing"
  },
  {
    name: "De Árbol",
    origin: "Mexico",
    heat: "15,000–30,000 SHU",
    flavor: "Bright, nutty, grassy heat",
    role: "Bridge — adding sharp, clean fire to salsas and table sauces"
  },
  {
    name: "Datil",
    origin: "St. Augustine, Florida / Caribbean",
    heat: "100,000–300,000 SHU",
    flavor: "Sweet, fruity, tropical burn",
    role: "Body — Spanish colonial introduction with African roots"
  },
  {
    name: "Wiri Wiri",
    origin: "Guyana / West Africa",
    heat: "100,000–350,000 SHU",
    flavor: "Fruity, sharp, lingering heat",
    role: "Vanguard — completing the triangle where peppers became piri piri"
  },
  {
    name: "Red Scotch Bonnet",
    origin: "Jamaica & Caribbean",
    heat: "100,000–350,000 SHU",
    flavor: "Fruity, floral, intensely aromatic with classic Caribbean fire",
    role: "Flagship — defining Caribbean cuisine from jerk to pepper sauces"
  }
];

const pairings = [
  "Mole negro with slow-braised meats",
  "Jamaican jerk chicken and pork",
  "Guyanese pepper pot stew",
  "West African palm oil soups",
  "Caribbean hot pepper sauces",
  "Grilled seafood with citrus-pepper marinades"
];

export function AtlanticProvenanceModal({ open, onOpenChange }: AtlanticProvenanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-parchment border-2 border-ink/30">
        <ScrollArea className="max-h-[90vh]">
          {/* Hero Image */}
          <div className="relative w-full h-64 md:h-80">
            <img 
              src={consortiumImage} 
              alt="Atlantic Provenance consortium illustration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <Badge className="mb-2 bg-primary/90 text-primary-foreground border-none">
                № 009 · Atlantic Triangle
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl text-parchment uppercase tracking-wide drop-shadow-lg">
                Atlantic Provenance
              </h2>
              <p className="text-parchment/80 text-sm mt-1 font-body italic">
                Mexico → Caribbean → West Africa
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* The Consortium */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Flame className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl text-ink uppercase tracking-wide">
                  The Consortium
                </h3>
              </div>
              <div className="space-y-4">
                {pepperProfiles.map((pepper, index) => (
                  <div 
                    key={pepper.name}
                    className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-parchment border-2 border-primary/50 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-1">
                      <div>
                        <span className="font-display text-lg text-ink">{pepper.name}</span>
                        <span className="text-muted-foreground text-sm ml-2">· {pepper.origin}</span>
                      </div>
                      <Badge variant="outline" className="w-fit border-primary/50 text-primary text-xs">
                        {pepper.heat}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm font-body italic mb-1">{pepper.flavor}</p>
                    <p className="text-ink/80 text-sm font-body">{pepper.role}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="bg-ink/20" />

            {/* The Story */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl text-ink uppercase tracking-wide">
                  The Story
                </h3>
              </div>
              <div className="prose prose-sm max-w-none text-ink/80 font-body space-y-4">
                <p>
                  The Atlantic Provenance traces the path of fire across the waters that connected three continents. 
                  This consortium follows peppers from their Mexican homeland, through the crucible of the Caribbean, 
                  to their adoption along the West African coast—a journey shaped by trade winds, colonial ambition, 
                  and the resilience of culinary tradition.
                </p>
                <p>
                  It begins with the Ancho, the dried heart of the Poblano, foundation of countless Mexican sauces 
                  and the mild anchor of this collection. The De Árbol adds its bright, persistent heat—the 
                  accelerant that gave Mexican table sauces their signature fire. From Mexico, Spanish galleons 
                  carried these cultivars to Caribbean ports where they encountered the Datil, a pepper of 
                  mysterious origins brought to St. Augustine, possibly by Minorcan settlers with African connections.
                </p>
                <p>
                  From the Caribbean, peppers traveled onward to Guyana and the West African coast. The Wiri Wiri, 
                  a small berry-shaped pepper, emerged in this triangular exchange—eventually evolving into the 
                  Piri Piri that would define Portuguese African cooking. The crossing concludes with the 
                  Red Scotch Bonnet, the defining heat of Caribbean cuisine—fruity, floral, and ferocious. Its 
                  aromatic intensity became inseparable from jerk seasoning and the pepper sauces that grace 
                  every island table, standing as the flagship of this Atlantic journey.
                </p>
                <p>
                  The Hot Pepper Trading Company assembled this consortium to honor the Atlantic crossing—not as 
                  a celebration of colonial history, but as recognition of how peppers, like people, traveled these 
                  routes and transformed the cuisines of three continents in their passage.
                </p>
              </div>
            </section>

            <Separator className="bg-ink/20" />

            {/* Pairings */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl text-ink uppercase tracking-wide">
                  Pairings & Signature Dishes
                </h3>
              </div>
              <div className="bg-parchment-dark/30 border border-ink/10 rounded p-4">
                <ul className="grid md:grid-cols-2 gap-2">
                  {pairings.map((pairing, index) => (
                    <li key={index} className="flex items-center gap-2 text-ink/80 font-body">
                      <span className="text-primary">•</span>
                      <span>{pairing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <Separator className="bg-ink/20" />

            {/* Trade Details */}
            <section className="border-t border-dashed border-ink/20 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl text-ink uppercase tracking-wide">
                  Trade Details
                </h3>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-center">
                <div>
                  <span className="text-muted-foreground uppercase tracking-wider text-xs block mb-1">Net Weight</span>
                  <p className="text-ink font-display">2.5 oz (70g)</p>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase tracking-wider text-xs block mb-1">Price</span>
                  <p className="text-ink font-display">$24.00</p>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase tracking-wider text-xs block mb-1">Heat Range</span>
                  <p className="text-ink font-display">1,000–350,000 SHU</p>
                </div>
              </div>
            </section>

            {/* Closing Statement */}
            <div className="text-center pt-4 pb-2">
              <p className="text-muted-foreground text-sm font-body italic">
                Assembled by the Hot Pepper Trading Company
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
