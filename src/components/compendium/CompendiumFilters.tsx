import { Search } from 'lucide-react';
import { regions, heatLevels } from '@/data/peppers';

interface CompendiumFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedHeat: string;
  onHeatChange: (heat: string) => void;
}

export function CompendiumFilters({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedHeat,
  onHeatChange,
}: CompendiumFiltersProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Input */}
        <div className="md:col-span-1">
          <label className="block font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
            Search by Name or Origin
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a4a3a]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Enter search term..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#e8dcc4]/50 border border-[#5a4a3a]/20 
                font-body text-sm text-[#3a2a1a] placeholder:text-[#5a4a3a]/40
                focus:outline-none focus:border-[#d4a84b]/50 focus:bg-[#e8dcc4] transition-colors"
            />
          </div>
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
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a4a3a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region === 'All' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>

        {/* Heat Level Filter */}
        <div>
          <label className="block font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
            Filter by Pungency
          </label>
          <select
            value={selectedHeat}
            onChange={(e) => onHeatChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#e8dcc4]/50 border border-[#5a4a3a]/20 
              font-body text-sm text-[#3a2a1a] 
              focus:outline-none focus:border-[#d4a84b]/50 focus:bg-[#e8dcc4] transition-colors
              appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a4a3a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {heatLevels.map((heat) => (
              <option key={heat} value={heat}>
                {heat === 'All' ? 'All Heat Levels' : heat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters indicator */}
      {(searchQuery || selectedRegion !== 'All' || selectedHeat !== 'All') && (
        <div className="mt-4 pt-4 border-t border-[#5a4a3a]/10 flex items-center gap-4">
          <span className="font-body text-xs text-[#5a4a3a]/60">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="px-2 py-1 text-xs font-body bg-[#d4a84b]/20 border border-[#d4a84b]/30 text-[#3a2a1a]">
                "{searchQuery}"
              </span>
            )}
            {selectedRegion !== 'All' && (
              <span className="px-2 py-1 text-xs font-body bg-[#d4a84b]/20 border border-[#d4a84b]/30 text-[#3a2a1a]">
                {selectedRegion}
              </span>
            )}
            {selectedHeat !== 'All' && (
              <span className="px-2 py-1 text-xs font-body bg-[#d4a84b]/20 border border-[#d4a84b]/30 text-[#3a2a1a]">
                {selectedHeat}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onRegionChange('All');
              onHeatChange('All');
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
