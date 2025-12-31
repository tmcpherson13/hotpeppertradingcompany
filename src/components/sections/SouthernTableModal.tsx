import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Flame, MapPin, Utensils, BookOpen, Ship } from "lucide-react";
import { LogoDivider } from "@/components/ui/LogoDivider";
import southernTableImg from "@/assets/consortium/southern-table.jpg";

interface SouthernTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: "Tabasco",
    origin: "Louisiana, USA",
    heat: "2,500–5,000 SHU",
    flavor: "Vinegary, bright, tangy",
    role: "The Foundation — Louisiana's gift to the world, fermented on Avery Island since 1868"
  },
  {
    name: "Cayenne",
    origin: "French Guiana → Louisiana",
    heat: "30,000–50,000 SHU",
    flavor: "Clean heat, earthy, slightly fruity",
    role: "The Workhorse — the backbone of Cajun and Creole cooking"
  },
  {
    name: "Datil",
    origin: "St. Augustine, Florida",
    heat: "100,000–300,000 SHU",
    flavor: "Sweet, fruity, tropical",
    role: "The Colonial Heirloom — Spanish Minorcan heritage in America's oldest city"
  },
  {
    name: "Hatch Green Chili",
    origin: "New Mexico, USA",
    heat: "1,000–8,000 SHU",
    flavor: "Earthy, roasted, smoky-sweet",
    role: "The Borderland — high desert terroir from the Rio Grande valley"
  },
  {
    name: "Ghost",
    origin: "Texas (via India)",
    heat: "855,000–1,041,427 SHU",
    flavor: "Slow-building, fruity, overwhelming",
    role: "The Modern Legend — adopted by Texas hot sauce culture as the ultimate challenge"
  }
];

const pairings = [
  "Louisiana Gumbo & Jambalaya",
  "Texas Brisket & Smoked Ribs",
  "Florida Datil Pepper Sauce",
  "New Mexican Green Chile Stew",
  "Cajun Blackened Redfish",
  "Low Country Shrimp Boil",
  "Nashville Hot Chicken",
  "Texas Chili con Carne"
];

export function SouthernTableModal({ open, onOpenChange }: SouthernTableModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-parchment border-2 border-ink/30 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img 
              src={southernTableImg} 
              alt="The Southern Table - American South pepper heritage"
              className="w-full h-full object-cover sepia-[0.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge className="mb-2 bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider">
                Consortium № 010
              </Badge>
              <h2 className="font-blackpearl text-3xl md:text-4xl text-parchment mb-2">
                The Southern Table
              </h2>
              <p className="text-parchment/80 font-heading text-sm uppercase tracking-wider">
                From Bayou to Borderland
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* The Consortium Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Ship className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
                  The Consortium
                </h3>
              </div>
              <div className="space-y-4">
                {pepperProfiles.map((pepper, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4 py-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-display text-base text-foreground">{pepper.name}</span>
                      <span className="text-xs text-muted-foreground font-body">•</span>
                      <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {pepper.origin}
                      </span>
                      <span className="text-xs text-muted-foreground font-body">•</span>
                      <span className="text-xs text-primary font-heading flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {pepper.heat}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body italic mb-1">
                      {pepper.flavor}
                    </p>
                    <p className="text-sm text-foreground/80 font-body">
                      {pepper.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <LogoDivider className="my-8" />

            {/* The Story Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
                  The Story
                </h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  The American South is not one cuisine but many—a patchwork of traditions stitched 
                  together by heat and memory. From the bayous of Louisiana where Tabasco peppers 
                  age in oak barrels on Avery Island, to the high desert valleys of New Mexico 
                  where Hatch chilies roast over open flame each autumn, this is a story of 
                  adaptation and fierce regional pride.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  The peppers of the Southern Table arrived by different paths. Tabasco came from 
                  Mexico, possibly via New Orleans, and became synonymous with Louisiana itself. 
                  Cayenne, named for a river in French Guiana, became the workhorse of Creole 
                  and Cajun kitchens—the invisible fire in every étouffée and blackened fish. 
                  The Datil pepper, brought to St. Augustine by Minorcan colonists in the 1700s, 
                  carries Spanish colonial heritage in every fruity, devastating bite.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  Hatch represents the borderland—the meeting of Indigenous, Spanish, and Mexican 
                  traditions in New Mexico's Rio Grande valley. And the Ghost pepper, though born 
                  in India, found its American home in Texas hot sauce culture, where extremity 
                  is a point of pride and suffering is a badge of honor.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Hot Pepper Trading Company assembled this consortium to honor the fire that 
                  built Southern cuisine—from Creole elegance to Texas swagger, from Florida's 
                  Spanish roots to New Mexico's desert terroir.
                </p>
              </div>
            </div>

            <LogoDivider className="my-8" />

            {/* Pairings Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
                  Pairings & Signature Dishes
                </h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pairings.map((pairing, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{pairing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-6 bg-ink/20" />

            {/* Trade Details */}
            <div className="text-center">
              <p className="font-body text-sm text-muted-foreground italic mb-4">
                "Where fire meets hospitality—the heat that built a cuisine."
              </p>
              <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-wider text-muted-foreground font-heading">
                <span>3 oz / 85g</span>
                <span className="text-primary">•</span>
                <span className="text-primary font-semibold">$38</span>
                <span className="text-primary">•</span>
                <span>1,000–1,041,427 SHU</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
