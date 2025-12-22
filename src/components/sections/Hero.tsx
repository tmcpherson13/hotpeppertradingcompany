import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-spice-trade.jpg';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ancient maritime spice trade scene with Phoenician ships and exotic spices"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 h-px bg-parchment/50" />
            <span className="text-gold text-2xl">✦</span>
            <span className="w-16 h-px bg-parchment/50" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-parchment/80 font-body text-sm md:text-base uppercase tracking-[0.4em] mb-6"
          >
            Established in the Ancient Tradition
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-parchment font-semibold leading-tight mb-6"
          >
            Where the World's <br />
            <span className="italic text-gold">Finest Spices</span> <br />
            Meet Their Legacy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-parchment/90 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From the ancient ports of the Mediterranean to your table—we trace 
            the routes of history to bring you spices of uncompromising provenance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="heritage" size="xl" className="min-w-[200px] bg-parchment text-ink hover:bg-parchment/90">
              Explore Collection
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px] border-parchment/50 text-parchment hover:bg-parchment/10">
              Our Heritage
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-parchment/60"
          >
            <span className="text-xs uppercase tracking-widest">Discover</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
