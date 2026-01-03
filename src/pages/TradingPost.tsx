import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/trading-post/ProductCard";
import { HeatFilter } from "@/components/trading-post/HeatFilter";
import { QuickViewModal } from "@/components/trading-post/QuickViewModal";
import { ConsortiumCards } from "@/components/trading-post/ConsortiumCards";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Search, X, Anchor, Crown, Package, LayoutGrid, Layers, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import tradeRoutesBg from "@/assets/trade-routes-bg.jpg";

type ViewMode = 'categorized' | 'all';

export default function TradingPost() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [heatRange, setHeatRange] = useState<[number, number] | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopifyProduct | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('tradingpost-view-mode');
    return (saved === 'all' || saved === 'categorized') ? saved : 'categorized';
  });

  // Persist view mode preference
  useEffect(() => {
    localStorage.setItem('tradingpost-view-mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProducts(100);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Helper to get product category
  const getProductCategory = (product: ShopifyProduct): 'cultivar' | 'consortium' | 'merchandise' => {
    const type = product.node.productType?.toLowerCase() || '';
    if (type.includes('consortium')) return 'consortium';
    if (type.includes('merchandise') || type.includes('merch') || type.includes('apparel')) return 'merchandise';
    return 'cultivar';
  };

  // Categorize products by product type
  const { cultivars, consortiums, merchandise } = useMemo(() => {
    const cultivars = products.filter(p => getProductCategory(p) === 'cultivar');
    const consortiums = products.filter(p => getProductCategory(p) === 'consortium');
    const merchandise = products.filter(p => getProductCategory(p) === 'merchandise');
    
    // Sort cultivars by price (lowest first for accessibility)
    cultivars.sort((a, b) => 
      parseFloat(a.node.priceRange.minVariantPrice.amount) - 
      parseFloat(b.node.priceRange.minVariantPrice.amount)
    );
    
    // Sort consortiums by price (lowest first within premium tier)
    consortiums.sort((a, b) => 
      parseFloat(a.node.priceRange.minVariantPrice.amount) - 
      parseFloat(b.node.priceRange.minVariantPrice.amount)
    );
    
    return { cultivars, consortiums, merchandise };
  }, [products]);

  // All products combined and sorted by price
  const allProducts = useMemo(() => {
    return [...products].sort((a, b) => 
      parseFloat(a.node.priceRange.minVariantPrice.amount) - 
      parseFloat(b.node.priceRange.minVariantPrice.amount)
    );
  }, [products]);

  // Search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(p => 
      p.node.title.toLowerCase().includes(query) ||
      p.node.description.toLowerCase().includes(query) ||
      (p.node.tags && p.node.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [products, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  // Get category icon for unified view
  const CategoryBadge = ({ product }: { product: ShopifyProduct }) => {
    const category = getProductCategory(product);
    if (category === 'consortium') {
      return (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-tyrian/90 backdrop-blur-sm px-2 py-1 rounded">
          <Crown className="w-3 h-3 text-gold" />
          <span className="text-xs text-gold font-heading uppercase tracking-wider">Consortium</span>
        </div>
      );
    }
    if (category === 'merchandise') {
      return (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-ink/90 backdrop-blur-sm px-2 py-1 rounded border border-parchment/20">
          <Package className="w-3 h-3 text-parchment/70" />
          <span className="text-xs text-parchment/70 font-heading uppercase tracking-wider">Merch</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={tradeRoutesBg} 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-blackpearl text-5xl md:text-7xl text-parchment mb-4">
              The Trading Post
            </h1>
            <p className="text-lg text-parchment/70 font-heading max-w-2xl mx-auto">
              From single cultivars to curated consortiums, each selection reflects centuries of horticultural tradition and deliberate curation
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-parchment/40" />
              <Input
                type="text"
                placeholder="Search the manifest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-11 py-6 bg-ink/80 border-tyrian/40 text-parchment placeholder:text-parchment/40 focus:border-gold/50 font-heading text-center"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment/40 hover:text-parchment transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & View Toggle Section */}
      {!isLoading && !error && (
        <section className="py-4 border-b border-tyrian/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-ink/50 border border-tyrian/30 rounded-lg">
                <button
                  onClick={() => setViewMode('categorized')}
                  className={`flex items-center gap-2 px-4 py-2 rounded font-heading text-sm uppercase tracking-wider transition-all ${
                    viewMode === 'categorized'
                      ? 'bg-tyrian text-gold'
                      : 'text-parchment/60 hover:text-parchment hover:bg-tyrian/20'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">By Category</span>
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded font-heading text-sm uppercase tracking-wider transition-all ${
                    viewMode === 'all'
                      ? 'bg-tyrian text-gold'
                      : 'text-parchment/60 hover:text-parchment hover:bg-tyrian/20'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">All Products</span>
                  <span className="text-xs opacity-70">({products.length})</span>
                </button>
              </div>

              {/* Heat Filter */}
              <HeatFilter
                minShu={0}
                maxShu={2200000}
                onRangeChange={setHeatRange}
              />
            </div>
          </div>
        </section>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <section className="py-24">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
            <p className="text-parchment/60 font-heading">Loading cargo manifest...</p>
          </div>
        </section>
      )}
      
      {/* Error State */}
      {error && !isLoading && (
        <section className="py-24">
          <div className="text-center">
            <p className="text-pepper-red mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-parchment/30 text-parchment hover:bg-parchment/10"
            >
              Try Again
            </Button>
          </div>
        </section>
      )}
      
      {/* Search Results */}
      {!isLoading && !error && isSearching && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <p className="text-parchment/60 font-heading text-sm uppercase tracking-wider">
                {searchResults?.length} result{searchResults?.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
            
            {searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <div key={product.node.id} className="relative">
                    <CategoryBadge product={product} />
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-parchment/30 mx-auto mb-4" />
                <p className="text-parchment/60 font-heading">No products match your search</p>
                <Button
                  variant="ghost"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-gold hover:text-gold/80"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* All Products View */}
      {!isLoading && !error && !isSearching && viewMode === 'all' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-parchment mb-4">
                Complete Manifest
              </h2>
              <p className="text-parchment/60 leading-relaxed">
                All available goods from the Trading Company, sorted by price from most accessible to premium collections.
              </p>
            </div>
            
            {allProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProducts.map((product) => (
                  <div key={product.node.id} className="relative">
                    <CategoryBadge product={product} />
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-parchment/30 mx-auto mb-4" />
                <p className="text-parchment/60 font-heading">The cargo holds are currently empty</p>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Categorized Products */}
      {!isLoading && !error && !isSearching && viewMode === 'categorized' && (
        <>
          {/* Consortium Cards Section - Heritage Cards */}
          <section className="py-16 bg-parchment/5">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <ScrollText className="w-5 h-5 text-gold" />
                  <span className="text-gold font-heading text-sm uppercase tracking-widest">The Cargo</span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl text-parchment mb-4">
                  Consortium Journeys
                </h2>
                <p className="text-parchment/60 leading-relaxed">
                  Hot Pepper Trading Company assembles its collections with deliberate restraint. Each cultivar 
                  is evaluated for flavor profile, pungency, and regional provenance—selected not for volume, 
                  but for suitability. These are not products; they are releases, curated by route and lineage.
                </p>
              </div>
              
              <ConsortiumCards />
            </div>
          </section>

          {/* Cultivars Section - Entry Point */}
          {cultivars.length > 0 && (
            <section className="py-16 border-b border-tyrian/20">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <Anchor className="w-5 h-5 text-gold" />
                    <span className="text-gold font-heading text-sm uppercase tracking-widest">Individual Cultivars</span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl text-parchment mb-4">
                    Single-Origin Seeds
                  </h2>
                  <p className="text-parchment/60 leading-relaxed">
                    Begin your collection with individual cultivars, each selected for exceptional provenance and flavor profile. 
                    From approachable everyday varieties to rare specimens sought by collectors.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cultivars.map((product) => (
                    <ProductCard key={product.node.id} product={product} onQuickView={setQuickViewProduct} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          
          {/* Merchandise Section - If exists */}
          {merchandise.length > 0 && (
            <section className="py-16 border-t border-tyrian/20">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-5 h-5 text-gold" />
                    <span className="text-gold font-heading text-sm uppercase tracking-widest">Trading Company Goods</span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl text-parchment mb-4">
                    Merchandise
                  </h2>
                  <p className="text-parchment/60 leading-relaxed">
                    Carry the mark of the Trading Company beyond the garden.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {merchandise.map((product) => (
                    <ProductCard key={product.node.id} product={product} onQuickView={setQuickViewProduct} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Empty State */}
          {cultivars.length === 0 && consortiums.length === 0 && merchandise.length === 0 && (
            <section className="py-24">
              <div className="text-center">
                <Package className="w-12 h-12 text-parchment/30 mx-auto mb-4" />
                <p className="text-parchment/60 font-heading">The cargo holds are currently empty</p>
              </div>
            </section>
          )}
        </>
      )}
      
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
