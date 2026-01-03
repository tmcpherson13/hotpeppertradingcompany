import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollDownIndicator } from "@/components/ui/ScrollDownIndicator";
import { Flame, MapPin, Utensils, BookOpen, Ship } from "lucide-react";
import { LogoDivider } from "@/components/ui/LogoDivider";
import oldNatchezTraceImg from "@/assets/consortium/old-natchez-trace.jpg";

interface OldNatchezTraceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pepperProfiles = [
  {
    name: "Tabasco",
    origin: "Louisiana, USA",
    heat: "30,000–50,000 SHU",
    flavor: "Vinegary, bright, tangy",
    role: "Anchor — born in Avery Island marshlands, aged in oak barrels since 1868"
  },
  {
    name: "Pequin",
    origin: "Mexico → Texas",
    heat: "40,000–60,000 SHU",
    flavor: "Citrusy, nutty, smoky with sharp heat",
    role: "Bridge — tiny wild chiles gathered along the borderlands, prized by frontier settlers"
  },
  {
    name: "Hatch Green Chili",
    origin: "New Mexico, USA",
    heat: "1,000–8,000 SHU",
    flavor: "Earthy, roasted, smoky-sweet",
    role: "Body — Southwestern influence along the trail's western reach"
  },
  {
    name: "Red Jalapeño",
    origin: "Mexico → Texas",
    heat: "2,500–8,000 SHU",
    flavor: "Bright, grassy, moderate heat",
    role: "Vanguard — workhorse of Southern kitchens from Texas to Tennessee"
  },
  {
    name: "Datil",
    origin: "St. Augustine, Florida",
    heat: "100,000–300,000 SHU",
    flavor: "Sweet, fruity, tropical",
    role: "Flagship — Minorcan settlers' gift to America's oldest city"
  }
];

const pairings = [
  "Cajun Jambalaya & Gumbo",
  "Mississippi Delta Hot Tamales",
  "Nashville Hot Chicken",
  "New Orleans Remoulade & Po'boys",
  "Appalachian Chow-Chow & Pickled Peppers",
  "Low Country Shrimp Boil",
  "Texas Chili con Carne",
  "Florida Datil Pepper Sauce"
];

export function OldNatchezTraceModal({ open, onOpenChange }: OldNatchezTraceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-parchment border-2 border-ink/30 overflow-hidden relative">
        <ScrollDownIndicator />
        <ScrollArea className="max-h-[90vh]">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img 
              src={oldNatchezTraceImg} 
              alt="The Old Natchez Trace - America's earliest inland trade corridor"
              className="w-full h-full object-cover sepia-[0.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge className="mb-2 bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider">
                Consortium № 010
              </Badge>
              <h2 className="font-blackpearl text-3xl md:text-4xl text-parchment mb-2">
                Old Natchez Trace
              </h2>
              <p className="text-parchment/80 font-heading text-sm uppercase tracking-wider">
                From Gulf Port to Highland Trail
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 pb-16">
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
                  The Old Natchez Trace was America's earliest inland trade corridor—a 440-mile 
                  path carved first by bison, then by Native Americans, and finally by the 
                  "Kaintuck" boatmen who floated goods down the Mississippi and walked home 
                  through wilderness. From the bustling port of Natchez to the frontier settlement 
                  of Nashville, this was the highway of a young nation.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  The peppers of the Old Natchez Trace arrived by water and dispersed by land. 
                  Tabasco came upriver from Louisiana's coastal marshes, where it had been 
                  fermenting in oak barrels on Avery Island since the Civil War. The tiny Pequin 
                  chiles grew wild along the borderlands, gathered by frontier settlers who 
                  prized their sharp, citrusy heat. The Datil pepper, that mysterious 
                  Minorcan heirloom, traveled from St. Augustine with settlers seeking new 
                  frontiers.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  From the borderlands came Hatch—roasted over open flame in New Mexico's 
                  Rio Grande valley—and the Red Jalapeño, the dependable companion that 
                  followed settlers from Texas through Tennessee. Along the Trace, French, 
                  Spanish, and Native American foodways converged, creating the foundations 
                  of what we now call Southern cuisine.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Hot Pepper Trading Company assembled this consortium to honor the fire 
                  that traveled the Old Natchez Trace—from Creole elegance in New Orleans 
                  to the fiery resilience of Appalachian preserves, from Mississippi Delta 
                  tamales to Nashville's legendary hot chicken.
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
                "Where the river met the trail—fire that traveled by flatboat and footpath."
              </p>
              <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-wider text-muted-foreground font-heading">
                <span>3 oz / 85g</span>
                <span className="text-primary">•</span>
                <span className="text-primary font-semibold">$38</span>
                <span className="text-primary">•</span>
                <span>1,000–300,000 SHU</span>
              </div>
            </div>
            
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
