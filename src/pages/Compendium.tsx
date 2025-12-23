import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CompendiumFilters } from '@/components/compendium/CompendiumFilters';
import { PepperLedger } from '@/components/compendium/PepperLedger';
import { PepperDetailModal } from '@/components/compendium/PepperDetailModal';
import { peppers, Pepper } from '@/data/peppers';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const Compendium = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedHeat, setSelectedHeat] = useState('All');
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedPepper, setSelectedPepper] = useState<Pepper | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPeppers = useMemo(() => {
    return peppers.filter((pepper) => {
      // In Stock filter
      if (showInStockOnly && !pepper.inStock) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = pepper.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Region filter
      if (selectedRegion !== 'All' && pepper.region !== selectedRegion) {
        return false;
      }

      // Heat filter
      if (selectedHeat !== 'All' && pepper.heatLevel !== selectedHeat) {
        return false;
      }

      // Species filter
      if (selectedSpecies !== 'All' && pepper.species !== selectedSpecies) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedHeat, selectedSpecies, showInStockOnly]);

  const handleSelectPepper = (pepper: Pepper) => {
    setSelectedPepper(pepper);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Header - Restrained with Cartographic Elements */}
      <section className="pt-24 pb-12 bg-[#e8dcc4] relative overflow-hidden">
        {/* Subtle cartographic grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #5a4a3a 1px, transparent 1px),
              linear-gradient(to bottom, #5a4a3a 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Latitude/longitude style lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-0 right-0 h-px bg-[#5a4a3a]/[0.06]" />
          <div className="absolute top-[40%] left-0 right-0 h-px bg-[#5a4a3a]/[0.06]" />
          <div className="absolute top-[60%] left-0 right-0 h-px bg-[#5a4a3a]/[0.06]" />
          <div className="absolute top-[80%] left-0 right-0 h-px bg-[#5a4a3a]/[0.06]" />
          <div className="absolute left-[20%] top-0 bottom-0 w-px bg-[#5a4a3a]/[0.06]" />
          <div className="absolute left-[40%] top-0 bottom-0 w-px bg-[#5a4a3a]/[0.06]" />
          <div className="absolute left-[60%] top-0 bottom-0 w-px bg-[#5a4a3a]/[0.06]" />
          <div className="absolute left-[80%] top-0 bottom-0 w-px bg-[#5a4a3a]/[0.06]" />
        </div>

        {/* Decorative border */}
        <div className="absolute inset-4 md:inset-6 border border-[#5a4a3a]/15 pointer-events-none" />

        {/* Corner ornaments */}
        <div className="absolute top-6 left-6 w-6 h-6 border-t border-l border-[#5a4a3a]/30 hidden md:block" />
        <div className="absolute top-6 right-6 w-6 h-6 border-t border-r border-[#5a4a3a]/30 hidden md:block" />
        <div className="absolute bottom-6 left-6 w-6 h-6 border-b border-l border-[#5a4a3a]/30 hidden md:block" />
        <div className="absolute bottom-6 right-6 w-6 h-6 border-b border-r border-[#5a4a3a]/30 hidden md:block" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Decorative flourish */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-10 bg-[#5a4a3a]/30" />
              <BookOpen className="w-5 h-5 text-[#8b2942]" />
              <span className="h-px w-10 bg-[#5a4a3a]/30" />
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-[#3a2a1a] mb-6">
              The Pepper Compendium
            </h1>

            <div className="font-body text-lg md:text-xl text-[#5a4a3a] leading-relaxed max-w-2xl mx-auto space-y-4">
              <p>
                The Pepper Compendium is the trading house's record of peppers — their origins, 
                character, heat, and the routes by which they traveled the world.
              </p>
              <p>
                Before modern supply chains, peppers moved by sail and caravan, shaped by geography, 
                climate, and culture. This archive records where each pepper came from, how it tastes, 
                how fiercely it burns, and how it entered global cuisine.
              </p>
              <p>
                Some peppers listed here are currently held in our stores. Others appear for reference 
                alone. All are included for understanding.
              </p>
            </div>

            {/* Sub-line */}
            <p className="mt-6 font-heading text-sm font-bold italic text-[#5a4a3a]/70 tracking-wide">
              "An archive for those who value flavor, heat, and history in equal measure."
            </p>

            {/* Decorative divider */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4a84b]/50" />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#d4a84b]/70" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4a84b]/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Filters */}
            <CompendiumFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              selectedHeat={selectedHeat}
              onHeatChange={setSelectedHeat}
              selectedSpecies={selectedSpecies}
              onSpeciesChange={setSelectedSpecies}
              showInStockOnly={showInStockOnly}
              onInStockChange={setShowInStockOnly}
            />

            {/* Ledger */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="h-px flex-1 bg-border" />
                <h2 className="font-heading text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Registry of Varieties
                </h2>
                <span className="h-px flex-1 bg-border" />
              </div>

              <PepperLedger
                peppers={filteredPeppers}
                onSelectPepper={handleSelectPepper}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      <PepperDetailModal
        pepper={selectedPepper}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <Footer />
    </div>
  );
};

export default Compendium;
