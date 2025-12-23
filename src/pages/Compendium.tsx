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
            
            <p className="font-heading text-xs uppercase tracking-[0.2em] text-[#5a4a3a]/70 mb-3">
              Est. 1493 · Documented for the Discerning Merchant
            </p>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.2em] text-[#3a2a1a] mb-4">
              The Pepper Compendium
            </h1>
            
            <p className="font-body text-lg md:text-xl text-[#5a4a3a] max-w-2xl mx-auto italic">
              An Authoritative Reference of Capsicum Varieties Maintained by the Trading House
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
      
      {/* Introduction Section - Archival Merchant Tone */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Section heading */}
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px flex-1 bg-border" />
              <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Foreword from the Counting House
              </h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            
            <div className="space-y-4 text-center">
              <p className="font-body text-lg leading-relaxed text-foreground">
                This compendium serves as the official registry of the Hot Pepper Trading Company, 
                documenting each variety of capsicum that has passed through our warehouses and 
                counting houses since our establishment.
              </p>
              
              <p className="font-body leading-relaxed text-muted-foreground">
                Herein, the merchant or scholar shall find precise records of each pepper{"'"}s native 
                origins, its measure of pungency according to the Scoville method, its characteristic 
                flavors and aromas, and the historical trade routes by which it journeyed from the 
                New World to kitchens across the globe. We have spared no effort in verifying 
                provenance and documenting the circumstances of each variety{"'"}s introduction to 
                the markets of Europe, Asia, and Africa.
              </p>
              
              <p className="font-body text-sm leading-relaxed text-muted-foreground italic">
                Let this volume serve those who seek not merely to purchase, but to understand—for 
                in knowledge of origin lies appreciation of value, and in appreciation, fair commerce.
              </p>
            </div>
            
            {/* Decorative seal */}
            <div className="mt-8 flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#5a4a3a]/30 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-[#d4a84b]/50 flex items-center justify-center">
                  <span className="font-display text-xs text-[#5a4a3a]/70">HPTC</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Compendium Categories - Registry Sections */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          {/* Section heading */}
          <div className="flex items-center gap-4 mb-10 max-w-3xl mx-auto">
            <span className="h-px flex-1 bg-border" />
            <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Registry Indices
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>
          
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
                Index by Pungency
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                Varieties arranged according to their capsaicin concentration, measured in Scoville 
                Heat Units. From mild cultivars suitable for delicate palates to specimens requiring 
                considerable fortitude.
              </p>
              <span className="font-heading text-xs uppercase tracking-[0.15em] text-primary/70">
                Transcription in Progress
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
                Index by Provenance
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                Geographical cataloguing of varieties by their lands of cultivation—noting both 
                original New World habitats and the regions to which they were subsequently 
                transplanted by trade.
              </p>
              <span className="font-heading text-xs uppercase tracking-[0.15em] text-primary/70">
                Transcription in Progress
              </span>
            </motion.div>
            
            {/* Category Card: By Trade Route */}
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
                Index by Trade Route
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                Documentation of the maritime and overland passages by which each variety reached 
                its current markets—the Portuguese Cape Route, Spanish Manila Galleons, and the 
                ancient Silk Road.
              </p>
              <span className="font-heading text-xs uppercase tracking-[0.15em] text-primary/70">
                Transcription in Progress
              </span>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Closing Note - Archival Footer */}
      <section className="py-20 bg-[#e8dcc4]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-[0.15em] text-[#3a2a1a] mb-6">
              A Living Document
            </h2>
            <p className="font-body text-[#5a4a3a] mb-4">
              This registry is under continuous expansion as our agents acquire new specimens and 
              our archivists complete their transcriptions of historical trading records. The 
              discerning reader is invited to return as new entries are added to these pages.
            </p>
            <p className="font-body text-sm text-[#5a4a3a]/70 italic mb-8">
              For inquiries regarding specific varieties or trading terms, consult our inventory 
              or direct correspondence to the counting house.
            </p>
            <a 
              href="/" 
              className="inline-block px-8 py-3 bg-transparent text-[#3a2a1a] font-heading text-sm uppercase tracking-[0.15em] hover:bg-[#5a4a3a]/10 transition-colors border border-[#5a4a3a]/50"
            >
              Return to Trading House
            </a>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Compendium;
