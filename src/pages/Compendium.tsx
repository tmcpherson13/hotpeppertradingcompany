import { useState, useMemo, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CompendiumFilters } from '@/components/compendium/CompendiumFilters';
import { PepperLedger } from '@/components/compendium/PepperLedger';
import { PepperDetailModal } from '@/components/compendium/PepperDetailModal';
import { peppers, Pepper, ancestralSpeciesList, AncestralSpecies, HeatLevel } from '@/data/peppers';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LogoDivider } from '@/components/ui/LogoDivider';
import antiqueMap from '@/assets/antique-map.jpg';

export type SortField = 'name' | 'heat' | 'scoville' | 'region' | 'species';
export type SortDirection = 'asc' | 'desc';

const heatOrder: Record<HeatLevel, number> = {
  'No Heat': 0,
  'Very Mild': 1,
  'Mild': 2,
  'Medium': 3,
  'Hot': 4,
  'Very Hot': 5,
  'Extreme': 6,
  'Superhot': 7,
};

const Compendium = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedHeat, setSelectedHeat] = useState('All');
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedPepper, setSelectedPepper] = useState<Pepper | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const filteredPeppers = useMemo(() => {
    return peppers
      .filter((pepper) => {
        // In Stock filter
        if (showInStockOnly && !pepper.inStock) {
          return false;
        }

        // Search filter - includes alternate names
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = pepper.name.toLowerCase().includes(query);
          const matchesAlternate = pepper.alternateNames?.some(
            altName => altName.toLowerCase().includes(query)
          ) || false;
          if (!matchesName && !matchesAlternate) return false;
        }

        // Region filter
        if (selectedRegion !== 'All' && pepper.region !== selectedRegion) {
          return false;
        }

        // Heat filter
        if (selectedHeat !== 'All' && pepper.heatLevel !== selectedHeat) {
          return false;
        }

        // Species filter - handle "ancestral" as a group filter
        if (selectedSpecies !== 'All') {
          if (selectedSpecies === 'ancestral') {
            if (!ancestralSpeciesList.includes(pepper.species as AncestralSpecies)) {
              return false;
            }
          } else if (pepper.species !== selectedSpecies) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'heat':
            comparison = heatOrder[a.heatLevel] - heatOrder[b.heatLevel];
            break;
          case 'scoville':
            comparison = a.scovilleMax - b.scovilleMax;
            break;
          case 'region':
            comparison = a.region.localeCompare(b.region);
            break;
          case 'species':
            comparison = a.species.localeCompare(b.species);
            break;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [searchQuery, selectedRegion, selectedHeat, selectedSpecies, showInStockOnly, sortField, sortDirection]);

  const handleSelectPepper = (pepper: Pepper) => {
    setSelectedPepper(pepper);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Header - with parallax background */}
      <section ref={heroRef} className="pt-24 pb-12 relative overflow-hidden">
        {/* Parallax background image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${antiqueMap})`,
            y: backgroundY 
          }}
        />
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-[#e8dcc4]/90" />
        
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
            {/* Logo divider */}
            <LogoDivider variant="standard" size="sm" className="mb-4" />

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

            {/* Logo divider */}
            <LogoDivider variant="ornate" size="sm" className="mt-6" />
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
              sortField={sortField}
              onSortFieldChange={setSortField}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
            />

            {/* Ledger */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="h-px flex-1 bg-border" />
                <h2 className="font-heading text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Registry of Cultivars
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
        onSelectPepper={handleSelectPepper}
      />

      <Footer />
    </div>
  );
};

export default Compendium;
