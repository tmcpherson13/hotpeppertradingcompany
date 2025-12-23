import { Search, Package } from 'lucide-react';
import { regions, heatLevels, speciesList, speciesDisplayNames } from '@/data/peppers';
import { Switch } from '@/components/ui/switch';

interface CompendiumFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedHeat: string;
  onHeatChange: (heat: string) => void;
  selectedSpecies: string;
  onSpeciesChange: (species: string) => void;
  showInStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
}

export function CompendiumFilters({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedHeat,
  onHeatChange,
  selectedSpecies,
  onSpeciesChange,
  showInStockOnly,
  onInStockChange,
}: CompendiumFiltersProps) {
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a4a3a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  return (
    <div className="bg-[#f5efe6] border border-[#5a4a3a]/20 p-6">
      {/* Section heading */}
      <div className="flex items-center gap-4 mb-6">
        <span className="h-px flex-1 bg-[#5a4a3a]/20" />
        <h3 className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#5a4a3a]/70">
          Registry Search
        </h3>
        <span className="h-px flex-1 bg-[#5a4a3a]/20" />
      </div>

      {/* In Stock Toggle - Prominent */}
      <div className="mb-6 p-4 bg-[#e8dcc4]/60 border border-[#5a4a3a]/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-[#8b2942]" />
          <div>
            <span className="font-heading text-sm uppercase tracking-wider text-[#3a2a1a]">
              Show In Stock Only
            </span>
            <p className="font-body text-xs text-[#5a4a3a]/60 mt-0.5">
              Display only peppers currently held in our stores
            </p>
          </div>
        </div>
        <Switch
          checked={showInStockOnly}
          onCheckedChange={onInStockChange}
          className="data-[state=checked]:bg-[#8b2942]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
            Search by Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a4a3a]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Enter pepper name..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#e8dcc4]/50 border border-[#5a4a3a]/20 
                font-body text-sm text-[#3a2a1a] placeholder:text-[#5a4a3a]/40
                focus:outline-none focus:border-[#d4a84b]/50 focus:bg-[#e8dcc4] transition-colors"
            />
          </div>
        </div>

        {/* Heat Level Filter */}
        <div>
          <label className="block font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
            Filter by Heat Band
          </label>
          <select
            value={selectedHeat}
            onChange={(e) => onHeatChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#e8dcc4]/50 border border-[#5a4a3a]/20 
              font-body text-sm text-[#3a2a1a] 
              focus:outline-none focus:border-[#d4a84b]/50 focus:bg-[#e8dcc4] transition-colors
              appearance-none cursor-pointer"
            style={selectStyle}
          >
            <option value="All">All Heat Levels</option>
            {heatLevels.map((heat) => (
              <option key={heat} value={heat}>
                {heat}
              </option>
            ))}
          </select>
        </div>

        {/* Species Filter */}
        <div>
          <label className="block font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
            Filter by Species
          </label>
          <select
            value={selectedSpecies}
            onChange={(e) => onSpeciesChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#e8dcc4]/50 border border-[#5a4a3a]/20 
              font-body text-sm text-[#3a2a1a] 
              focus:outline-none focus:border-[#d4a84b]/50 focus:bg-[#e8dcc4] transition-colors
              appearance-none cursor-pointer"
            style={selectStyle}
          >
            <option value="All">All Species</option>
            {speciesList.map((species) => (
              <option key={species} value={species}>
                {speciesDisplayNames[species]}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
            Filter by Provenance
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#e8dcc4]/50 border border-[#5a4a3a]/20 
              font-body text-sm text-[#3a2a1a] 
              focus:outline-none focus:border-[#d4a84b]/50 focus:bg-[#e8dcc4] transition-colors
              appearance-none cursor-pointer"
            style={selectStyle}
          >
            <option value="All">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters indicator */}
      {(searchQuery || selectedRegion !== 'All' || selectedHeat !== 'All' || selectedSpecies !== 'All' || showInStockOnly) && (
        <div className="mt-4 pt-4 border-t border-[#5a4a3a]/10 flex items-center gap-4 flex-wrap">
          <span className="font-body text-xs text-[#5a4a3a]/60">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {showInStockOnly && (
              <span className="px-2 py-1 text-xs font-body bg-[#8b2942]/20 border border-[#8b2942]/30 text-[#8b2942]">
                In Stock Only
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-1 text-xs font-body bg-[#d4a84b]/20 border border-[#d4a84b]/30 text-[#3a2a1a]">
                "{searchQuery}"
              </span>
            )}
            {selectedHeat !== 'All' && (
              <span className="px-2 py-1 text-xs font-body bg-[#d4a84b]/20 border border-[#d4a84b]/30 text-[#3a2a1a]">
                {selectedHeat}
              </span>
            )}
            {selectedSpecies !== 'All' && (
              <span className="px-2 py-1 text-xs font-body bg-[#d4a84b]/20 border border-[#d4a84b]/30 text-[#3a2a1a]">
                {speciesDisplayNames[selectedSpecies]}
              </span>
            )}
            {selectedRegion !== 'All' && (
              <span className="px-2 py-1 text-xs font-body bg-[#d4a84b]/20 border border-[#d4a84b]/30 text-[#3a2a1a]">
                {selectedRegion}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onRegionChange('All');
              onHeatChange('All');
              onSpeciesChange('All');
              onInStockChange(false);
            }}
            className="ml-auto font-heading text-[10px] uppercase tracking-wider text-[#5a4a3a]/60 hover:text-primary transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
