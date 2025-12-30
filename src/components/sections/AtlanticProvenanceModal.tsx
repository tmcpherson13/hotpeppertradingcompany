import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LogoDivider } from "@/components/ui/LogoDivider";
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
    role: "The Anchor — the foundation of mole and the baseline of this crossing"
  },
  {
    name: "De Árbol",
    origin: "Mexico",
    heat: "15,000–30,000 SHU",
    flavor: "Bright, nutty, grassy heat",
    role: "The Accelerant — adding sharp, clean fire to salsas and table sauces"
  },
  {
    name: "Datil",
    origin: "St. Augustine, Florida / Caribbean",
    heat: "100,000–300,000 SHU",
    flavor: "Sweet, fruity, tropical burn",
    role: "The Caribbean Gateway — Spanish colonial introduction with African roots"
  },
  {
    name: "Scotch Bonnet",
    origin: "Jamaica & Caribbean",
    heat: "100,000–350,000 SHU",
    flavor: "Fruity, floral, intensely aromatic",
    role: "The Island Heart — defining Caribbean cuisine from jerk to pepper sauces"
  },
  {
    name: "Wiri Wiri",
    origin: "Guyana / West Africa",
    heat: "100,000–350,000 SHU",
    flavor: "Fruity, sharp, lingering heat",
    role: "The African Arrival — completing the triangle where peppers became piri piri"
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-parchment-light border-2 border-spice-brown/30 p-0">
        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-80">
          <img 
            src={consortiumImage} 
            alt="Atlantic Provenance consortium illustration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-parchment-dark/90 via-parchment-dark/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <Badge className="mb-2 bg-spice-paprika/90 text-parchment-light border-none">
              № 007 · Atlantic Triangle
            </Badge>
            <h2 className="font-blackpearl text-3xl md:text-4xl text-parchment-light drop-shadow-lg">
              The Atlantic Provenance
            </h2>
            <p className="text-parchment-light/80 text-sm mt-1 font-crimson italic">
              Mexico → Caribbean → West Africa
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* The Consortium */}
          <section>
            <h3 className="font-playfair text-xl text-spice-brown mb-4 tracking-wide uppercase">
              The Consortium
            </h3>
            <div className="grid gap-4">
              {pepperProfiles.map((pepper, index) => (
                <div 
                  key={pepper.name}
                  className="bg-parchment-dark/20 border border-spice-brown/20 rounded p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                    <div>
                      <span className="font-playfair text-lg text-spice-brown">{pepper.name}</span>
                      <span className="text-spice-brown/60 text-sm ml-2">· {pepper.origin}</span>
                    </div>
                    <Badge variant="outline" className="w-fit border-spice-paprika/50 text-spice-paprika text-xs">
                      {pepper.heat}
                    </Badge>
                  </div>
                  <p className="text-spice-brown/70 text-sm font-crimson italic mb-1">{pepper.flavor}</p>
                  <p className="text-spice-brown/80 text-sm">{pepper.role}</p>
                </div>
              ))}
            </div>
          </section>

          <LogoDivider variant="minimal" />

          {/* The Story */}
          <section>
            <h3 className="font-playfair text-xl text-spice-brown mb-4 tracking-wide uppercase">
              The Story
            </h3>
            <div className="prose prose-sm max-w-none text-spice-brown/80 font-crimson space-y-4">
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
                In Jamaica and across the islands, the Scotch Bonnet emerged as the defining heat of Caribbean 
                cuisine—fruity, floral, and ferocious. Its aromatic intensity became inseparable from jerk 
                seasoning and the pepper sauces that grace every island table. The crossing concludes in Guyana 
                and West Africa with the Wiri Wiri, a small berry-shaped pepper that completed the triangular 
                exchange, eventually evolving into the Piri Piri that would define Portuguese African cooking.
              </p>
              <p>
                The Hot Pepper Trading Company assembled this consortium to honor the Atlantic crossing—not as 
                a celebration of colonial history, but as recognition of how peppers, like people, traveled these 
                routes and transformed the cuisines of three continents in their passage.
              </p>
            </div>
          </section>

          <LogoDivider variant="minimal" />

          {/* Pairings */}
          <section>
            <h3 className="font-playfair text-xl text-spice-brown mb-4 tracking-wide uppercase">
              Pairings & Signature Dishes
            </h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {pairings.map((pairing, index) => (
                <li key={index} className="flex items-center gap-2 text-spice-brown/80 font-crimson">
                  <span className="w-1.5 h-1.5 rounded-full bg-spice-paprika/60 flex-shrink-0" />
                  <span>{pairing}</span>
                </li>
              ))}
            </ul>
          </section>

          <LogoDivider variant="minimal" />

          {/* Trade Details */}
          <section className="bg-parchment-dark/30 rounded p-4 border border-spice-brown/20">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-spice-brown/60 uppercase tracking-wider text-xs">Net Weight</span>
                <p className="text-spice-brown font-playfair">2.5 oz (70g)</p>
              </div>
              <div>
                <span className="text-spice-brown/60 uppercase tracking-wider text-xs">Price</span>
                <p className="text-spice-brown font-playfair">$24.00</p>
              </div>
              <div>
                <span className="text-spice-brown/60 uppercase tracking-wider text-xs">Heat Range</span>
                <p className="text-spice-brown font-playfair">1,000–350,000 SHU</p>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
