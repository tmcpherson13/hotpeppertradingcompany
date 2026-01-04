import { useState, useMemo } from 'react';
import { Flame } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify';
import { ProductCard } from '../ProductCard';

interface SkeletonCultivarSectionProps {
  cultivars: ShopifyProduct[];
  onQuickView: (product: ShopifyProduct) => void;
}

type HeatTab = 'all' | 'mild' | 'medium' | 'hot' | 'extra-hot' | 'extreme';

const HEAT_TABS: { id: HeatTab; label: string; range: [number, number] | null; color: string }[] = [
  { id: 'all', label: 'All', range: null, color: 'text-ink' },
  { id: 'mild', label: 'Mild', range: [0, 2500], color: 'text-green-600' },
  { id: 'medium', label: 'Medium', range: [2500, 30000], color: 'text-yellow-600' },
  { id: 'hot', label: 'Hot', range: [30000, 100000], color: 'text-orange-600' },
  { id: 'extra-hot', label: 'Extra Hot', range: [100000, 350000], color: 'text-red-600' },
  { id: 'extreme', label: 'Extreme', range: [350000, 3000000], color: 'text-red-800' },
];

// Helper to extract SHU from product tags
function getShuFromProduct(product: ShopifyProduct): number | null {
  const tags = product.node.tags || [];
  for (const tag of tags) {
    const match = tag.match(/shu[:\s]*(\d+)/i);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

export function SkeletonCultivarSection({ cultivars, onQuickView }: SkeletonCultivarSectionProps) {
  const [activeTab, setActiveTab] = useState<HeatTab>('all');

  const filteredCultivars = useMemo(() => {
    if (activeTab === 'all') return cultivars;
    
    const tab = HEAT_TABS.find(t => t.id === activeTab);
    if (!tab?.range) return cultivars;
    
    const [min, max] = tab.range;
    return cultivars.filter(product => {
      const shu = getShuFromProduct(product);
      if (shu === null) return false;
      return shu >= min && shu < max;
    });
  }, [cultivars, activeTab]);

  // Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<HeatTab, number> = {
      all: cultivars.length,
      mild: 0,
      medium: 0,
      hot: 0,
      'extra-hot': 0,
      extreme: 0,
    };
    
    cultivars.forEach(product => {
      const shu = getShuFromProduct(product);
      if (shu === null) return;
      
      if (shu < 2500) counts.mild++;
      else if (shu < 30000) counts.medium++;
      else if (shu < 100000) counts.hot++;
      else if (shu < 350000) counts['extra-hot']++;
      else counts.extreme++;
    });
    
    return counts;
  }, [cultivars]);

  return (
    <div>
      {/* Heat Level Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-ink/5 border border-ink/10 rounded-lg w-fit">
        {HEAT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-heading text-sm uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-ink text-parchment'
                : 'text-ink/60 hover:text-ink hover:bg-ink/10'
            }`}
          >
            {tab.id !== 'all' && <Flame className={`w-3 h-3 ${tab.color}`} />}
            <span>{tab.label}</span>
            <span className={`text-xs ${activeTab === tab.id ? 'text-parchment/60' : 'text-ink/40'}`}>
              ({tabCounts[tab.id]})
            </span>
          </button>
        ))}
      </div>

      {/* Cultivar Grid */}
      {filteredCultivars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCultivars.map((product) => (
            <ProductCard 
              key={product.node.id} 
              product={product} 
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-ink/20 rounded-lg">
          <Flame className="w-8 h-8 text-ink/30 mx-auto mb-3" />
          <p className="text-ink/50 font-heading">No cultivars at this heat level</p>
        </div>
      )}
    </div>
  );
}
