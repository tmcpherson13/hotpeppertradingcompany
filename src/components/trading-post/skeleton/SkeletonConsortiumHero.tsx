import { motion } from 'framer-motion';
import { Crown, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cradleOfFireImage from '@/assets/consortium/cradle-of-fire.jpg';

interface SkeletonConsortiumHeroProps {
  onExplore?: () => void;
}

export function SkeletonConsortiumHero({ onExplore }: SkeletonConsortiumHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-lg border-2 border-tyrian/30 bg-ink shadow-deep"
    >
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-gold/90 backdrop-blur-sm px-3 py-1.5 rounded">
        <Crown className="w-4 h-4 text-ink" />
        <span className="text-xs uppercase tracking-wider text-ink font-heading font-semibold">
          Featured Journey
        </span>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Image Side */}
        <div className="relative aspect-[4/3] md:aspect-auto">
          <img
            src={cradleOfFireImage}
            alt="Cradle of Fire consortium"
            className="w-full h-full object-cover sepia-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/90" />
        </div>

        {/* Content Side */}
        <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gold/30" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-heading">
              Mexico & Central America
            </span>
            <div className="h-px flex-1 bg-gold/30" />
          </div>

          <h2 className="font-blackpearl text-3xl md:text-4xl lg:text-5xl text-parchment mb-4">
            Cradle of Fire
          </h2>

          <p className="text-parchment/70 font-body leading-relaxed mb-6 italic text-sm md:text-base">
            "Where the Capsicum genus first ignited the palates of ancient Mesoamerica. 
            Five cultivars tracing the origins of heat itself."
          </p>

          <div className="flex items-center gap-6 mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-pepper-red" />
              <span className="text-sm text-parchment/60 font-heading">5 Cultivars</span>
            </div>
            <div className="text-gold font-heading text-lg">$21.00</div>
          </div>

          <Button 
            onClick={onExplore}
            className="w-fit bg-tyrian hover:bg-tyrian/90 text-gold uppercase tracking-wider font-heading text-sm px-6 py-3"
          >
            Explore This Journey
          </Button>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/30" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold/30" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold/30" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/30" />
    </motion.div>
  );
}
