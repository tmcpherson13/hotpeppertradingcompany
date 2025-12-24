import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import logoDark from '@/assets/logo-dark.svg';
import rhythmsOfTheCaribbeanImg from '@/assets/consortium/rhythms-of-the-caribbean.jpg';

// Import pepper images
import scotchBonnetImg from '@/assets/peppers/scotch-bonnet.jpg';
import habaneroImg from '@/assets/peppers/habanero.jpg';
import datilImg from '@/assets/peppers/datil.jpg';
import wiriWiriImg from '@/assets/peppers/wiri-wiri.jpg';
import congoPepperImg from '@/assets/peppers/congo-pepper.jpg';

interface RhythmsOfTheCaribbeanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const peppers = [
  {
    name: 'Scotch Bonnet',
    origin: 'Jamaica',
    scoville: '100,000–350,000 SHU',
    role: 'THE RHYTHM',
    description: 'The heartbeat of Caribbean cuisine—fruity, floral heat that defines jerk seasoning and pepper sauces from Kingston to Port-au-Prince.',
    image: scotchBonnetImg,
  },
  {
    name: 'Caribbean Red Habanero',
    origin: 'Trinidad & Tobago',
    scoville: '300,000–475,000 SHU',
    role: 'THE FIRE',
    description: 'Intensely aromatic with tropical fruit notes, this habanero brings the volcanic heat that island cooks have wielded for generations.',
    image: habaneroImg,
  },
  {
    name: 'Datil Pepper',
    origin: 'St. Augustine, Florida',
    scoville: '100,000–300,000 SHU',
    role: 'THE MEMORY',
    description: 'Brought by Minorcan settlers to the Florida coast, this sweet-hot treasure bridges the Caribbean to the American South.',
    image: datilImg,
  },
  {
    name: 'Wiri Wiri',
    origin: 'Guyana',
    scoville: '100,000–350,000 SHU',
    role: 'THE SOUL',
    description: 'Small, berry-shaped, and explosively hot—the secret weapon of Guyanese pepperpot and the pride of South American Caribbean kitchens.',
    image: wiriWiriImg,
  },
  {
    name: 'Congo Pepper',
    origin: 'Trinidad',
    scoville: '300,000–500,000 SHU',
    role: 'THE LEGEND',
    description: 'Named for the strength of enslaved Africans who cultivated it, this pepper carries centuries of history and devastating, beautiful heat.',
    image: congoPepperImg,
  },
];

export function RhythmsOfTheCaribbeanModal({ open, onOpenChange }: RhythmsOfTheCaribbeanModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 bg-parchment border-2 border-ink/30 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={rhythmsOfTheCaribbeanImg}
                alt="Rhythms of the Caribbean Pepper Consortium"
                className="w-full h-full object-cover sepia-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={logoDark} alt="" className="h-6 w-auto invert" aria-hidden="true" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-parchment/70 font-heading">
                      Consortium № 006
                    </span>
                  </div>
                  <DialogTitle className="font-display text-3xl md:text-4xl text-parchment tracking-wide">
                    Rhythms of the Caribbean
                  </DialogTitle>
                  <p className="text-parchment/80 font-body text-sm md:text-base mt-2 max-w-xl">
                    From turquoise waters to volcanic peaks—the peppers that define island fire and carry the spirit of resistance, resilience, and celebration.
                  </p>
                </DialogHeader>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Origin Story */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-px bg-primary/50" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                    The Story
                  </span>
                </div>
                <p className="font-body text-muted-foreground leading-relaxed text-sm md:text-base">
                  This is not just a consortium—it's a carnival of fire. The Caribbean archipelago, scattered like emeralds across azure waters, 
                  became the crucible where African, Indigenous, European, and Asian food traditions collided and created something entirely new. 
                  From the jerk pits of Jamaica to the pepperpots of Guyana, from the hot sauces of Trinidad to the datil preserves of Florida's 
                  Minorcan coast, these peppers carry the rhythm of steel drums, the memory of sugar plantations, and the defiant spirit of island peoples 
                  who transformed ingredients of survival into cuisines of celebration.
                </p>
              </motion.div>

              {/* Pepper Profiles */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-primary/50" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                    The Peppers
                  </span>
                </div>
                
                <div className="grid gap-4">
                  {peppers.map((pepper, index) => (
                    <motion.div
                      key={pepper.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex gap-4 p-4 bg-parchment-dark/30 border border-ink/10 rounded-sm"
                    >
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm border border-ink/20">
                        <img
                          src={pepper.image}
                          alt={pepper.name}
                          className="w-full h-full object-cover sepia-[0.1]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-display text-base text-ink">{pepper.name}</h4>
                          <span className="text-[9px] uppercase tracking-wider text-primary font-heading bg-primary/10 px-2 py-0.5 rounded-sm whitespace-nowrap">
                            {pepper.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground font-heading mb-2">
                          <span>{pepper.origin}</span>
                          <span className="text-primary">•</span>
                          <span>{pepper.scoville}</span>
                        </div>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed italic">
                          {pepper.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Suggested Pairings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-px bg-primary/50" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-heading">
                    Suggested Pairings
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Jerk Chicken', 'Pepperpot Stew', 'Curry Goat', 'Rice & Peas', 'Grilled Plantains', 'Conch Fritters', 'Callaloo', 'Rum Cocktails'].map((pairing) => (
                    <div
                      key={pairing}
                      className="text-center py-2 px-3 bg-ink/5 border border-ink/10 rounded-sm"
                    >
                      <span className="text-xs font-heading text-muted-foreground">{pairing}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Purchase Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="border-t border-dashed border-ink/20 pt-6"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-heading mb-1">
                      3 oz / 85g — Consortium № 006
                    </p>
                    <p className="font-display text-2xl text-primary">$38</p>
                  </div>
                  <Button 
                    variant="pepper" 
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Add to Manifest
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
