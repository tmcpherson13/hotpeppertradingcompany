import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { BookOpen, Flame, MapPin, Calendar } from 'lucide-react';

const Compendium = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Old-World Styling */}
      <section className="pt-28 pb-16 bg-[#e8dcc4] relative overflow-hidden">
        {/* Decorative border frame */}
        <div className="absolute inset-4 md:inset-8 border-2 border-[#5a4a3a]/20 pointer-events-none" />
        <div className="absolute inset-6 md:inset-10 border border-[#5a4a3a]/10 pointer-events-none" />
        
        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#5a4a3a]/40 hidden md:block" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#5a4a3a]/40 hidden md:block" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[#5a4a3a]/40 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#5a4a3a]/40 hidden md:block" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative flourish */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-12 bg-[#5a4a3a]/40" />
              <BookOpen className="w-6 h-6 text-[#8b2942]" />
              <span className="h-px w-12 bg-[#5a4a3a]/40" />
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.2em] text-[#3a2a1a] mb-4">
              The Pepper Compendium
            </h1>
            
            <p className="font-body text-lg md:text-xl text-[#5a4a3a] max-w-2xl mx-auto italic">
              A scholarly collection of capsicum varieties, their histories, and culinary applications
            </p>
            
            {/* Decorative divider */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4a84b]" />
              <span className="w-2 h-2 rotate-45 bg-[#d4a84b]" />
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4a84b]" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="font-body text-lg leading-relaxed text-muted-foreground">
              Within these pages lies centuries of accumulated knowledge—a treasury of pungent fruits 
              that have shaped empires, ignited cuisines, and fueled the great maritime expeditions. 
              Each variety herein has been catalogued with the precision befitting scholarly pursuit, 
              noting provenance, character, and culinary virtue.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Compendium Categories */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Category Card: By Heat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background border border-border p-8 relative group hover:border-primary/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#5a4a3a]/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#5a4a3a]/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#5a4a3a]/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#5a4a3a]/40" />
              
              <Flame className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-xl uppercase tracking-wider text-foreground mb-3">
                By Pungency
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                From the gentle warmth of the Poblano to the fearsome intensity of the Carolina Reaper—
                varieties arranged by their Scoville measure.
              </p>
              <span className="font-heading text-xs uppercase tracking-[0.15em] text-primary/70">
                Coming Soon
              </span>
            </motion.div>
            
            {/* Category Card: By Origin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-background border border-border p-8 relative group hover:border-primary/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#5a4a3a]/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#5a4a3a]/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#5a4a3a]/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#5a4a3a]/40" />
              
              <MapPin className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-xl uppercase tracking-wider text-foreground mb-3">
                By Provenance
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                Peppers catalogued by their lands of origin—from the highlands of Oaxaca to the 
                fertile valleys of Calabria.
              </p>
              <span className="font-heading text-xs uppercase tracking-[0.15em] text-primary/70">
                Coming Soon
              </span>
            </motion.div>
            
            {/* Category Card: By Era */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-background border border-border p-8 relative group hover:border-primary/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#5a4a3a]/40" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#5a4a3a]/40" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#5a4a3a]/40" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#5a4a3a]/40" />
              
              <Calendar className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-xl uppercase tracking-wider text-foreground mb-3">
                By Historical Era
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                A chronological journey through capsicum cultivation—from pre-Columbian domestication 
                to modern hybrid cultivars.
              </p>
              <span className="font-heading text-xs uppercase tracking-[0.15em] text-primary/70">
                Coming Soon
              </span>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-[#e8dcc4]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-[0.15em] text-[#3a2a1a] mb-6">
              The Archives Await
            </h2>
            <p className="font-body text-[#5a4a3a] max-w-xl mx-auto mb-8">
              Our scholars are diligently expanding this compendium. Return often to discover 
              newly catalogued varieties and freshly transcribed historical accounts.
            </p>
            <a 
              href="/#collection" 
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-heading text-sm uppercase tracking-[0.15em] hover:bg-primary/90 transition-colors border border-primary"
            >
              Browse Current Inventory
            </a>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Compendium;
