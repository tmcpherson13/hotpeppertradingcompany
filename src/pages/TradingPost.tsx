import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/trading-post/ProductCard";
import { HeatFilter } from "@/components/trading-post/HeatFilter";
import { QuickViewModal } from "@/components/trading-post/QuickViewModal";
import { JourneyGrid } from "@/components/trading-post/JourneyGrid";
import { RegionalBlendsSection } from "@/components/trading-post/RegionalBlendsSection";
import { ConsortiumHero } from "@/components/trading-post/ConsortiumHero";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Search, X, Crown, Package, LayoutGrid, Layers, Leaf, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsortiumManifestOverlay } from "@/components/ui/ConsortiumManifestOverlay";
import tradeRoutesBg from "@/assets/trade-routes-bg.jpg";

// Import consortium content components (numerically ordered № 001 - № 010)
import { CradleOfFireContent } from "@/components/sections/CradleOfFireContent";
import { SouthernCrucibleContent } from "@/components/sections/SouthernCrucibleContent";
import { AndeanDiasporaContent } from "@/components/sections/AndeanDiasporaContent";
import { EmbersOfAfricaContent } from "@/components/sections/EmbersOfAfricaContent";
import { PhoenicianLegacyContent } from "@/components/sections/PhoenicianLegacyContent";
import { SilkJadePassagesContent } from "@/components/sections/SilkJadePassagesContent";
import { AtlanticProvenanceContent } from "@/components/sections/AtlanticProvenanceContent";
import { LetterOfMarqueContent } from "@/components/sections/LetterOfMarqueContent";
import { ManilaGalleonContent } from "@/components/sections/ManilaGalleonContent";
import { OldNatchezTraceContent } from "@/components/sections/OldNatchezTraceContent";


type ViewMode = 'exhibition' | 'all';
type ManifestState = { open: false } | { open: true; consortiumId: string };

export default function TradingPost() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [heatRange, setHeatRange] = useState<[number, number] | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopifyProduct | null>(null);
  const [manifest, setManifest] = useState<ManifestState>({ open: false });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('tradingpost-view-mode');
    return (saved === 'all' || saved === 'exhibition') ? saved : 'exhibition';
  });

  // Dev-only: allow opening a manifest via URL for debugging (e.g. /trading-post?debugModal=cradle-of-fire)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const debugModal = new URLSearchParams(window.location.search).get('debugModal');
    if (debugModal) {
      console.log('[Modal][DEV] Opening from URL:', debugModal);
      setManifest({ open: true, consortiumId: debugModal });
    }
  }, []);

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
  const getProductCategory = (product: ShopifyProduct): 'cultivar' | 'consortium' | 'regional' | 'merchandise' => {
    const type = product.node.productType?.toLowerCase() || '';
    if (type.includes('regional')) return 'regional';
    if (type.includes('consortium')) return 'consortium';
    if (type.includes('merchandise') || type.includes('merch') || type.includes('apparel')) return 'merchandise';
    return 'cultivar';
  };

  const handleViewManifest = useCallback((consortiumId: string) => {
    console.log('[Modal] Opening:', consortiumId);
    setManifest({ open: true, consortiumId });
  }, []);

  const closeModal = useCallback(() => {
    console.log('[Modal] Closing');
    setManifest({ open: false });
  }, []);

  // Note: Escape key handling is now in ConsortiumManifestOverlay

  // Categorize products by product type
  const { cultivars, consortiums, merchandise } = useMemo(() => {
    const cultivars = products.filter(p => getProductCategory(p) === 'cultivar');
    const consortiums = products.filter(p => getProductCategory(p) === 'consortium');
    const merchandise = products.filter(p => getProductCategory(p) === 'merchandise');
    
    cultivars.sort((a, b) => 
      parseFloat(a.node.priceRange.minVariantPrice.amount) - 
      parseFloat(b.node.priceRange.minVariantPrice.amount)
    );
    
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

  // Render consortium content based on ID
  const renderConsortiumContent = () => {
    if (!manifest.open) return null;
    switch (manifest.consortiumId) {
      case 'cradle-of-fire': return <CradleOfFireContent />;
      case 'southern-crucible': return <SouthernCrucibleContent />;
      case 'andean-diaspora': return <AndeanDiasporaContent />;
      case 'embers-of-africa': return <EmbersOfAfricaContent />;
      case 'phoenician-legacy': return <PhoenicianLegacyContent />;
      case 'silk-jade-passages': return <SilkJadePassagesContent />;
      case 'atlantic-provenance': return <AtlanticProvenanceContent />;
      case 'letter-of-marque': return <LetterOfMarqueContent />;
      case 'manila-galleon': return <ManilaGalleonContent />;
      case 'old-natchez-trace': return <OldNatchezTraceContent />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-parchment relative">
      {/* Global background - light map with purple grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-parchment" />
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="global-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(300 100% 18%)" strokeWidth="0.5" />
            </pattern>
            <pattern id="global-grid-major" width="320" height="320" patternUnits="userSpaceOnUse">
              <path d="M 320 0 L 0 0 0 320" fill="none" stroke="hsl(300 100% 18%)" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#global-grid)" />
          <rect width="100%" height="100%" fill="url(#global-grid-major)" />
        </svg>
        <img src={tradeRoutesBg} alt="" className="w-full h-full object-cover opacity-8 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <svg viewBox="0 0 400 400" className="w-[120vw] h-[120vw] max-w-[2000px] max-h-[2000px] text-tyrian">
            <circle cx="200" cy="200" r="195" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" fill="none" />
            <polygon points="200,10 215,80 200,60 185,80" fill="currentColor" />
            <polygon points="200,390 215,320 200,340 185,320" fill="currentColor" />
            <polygon points="390,200 320,215 340,200 320,185" fill="currentColor" />
            <polygon points="10,200 80,215 60,200 80,185" fill="currentColor" />
            <polygon points="342,58 290,95 295,90 290,85" fill="currentColor" opacity="0.7" />
            <polygon points="58,58 110,95 105,90 110,85" fill="currentColor" opacity="0.7" />
            <polygon points="342,342 290,305 295,310 290,315" fill="currentColor" opacity="0.7" />
            <polygon points="58,342 110,305 105,310 110,315" fill="currentColor" opacity="0.7" />
            <circle cx="200" cy="200" r="20" fill="currentColor" opacity="0.3" />
            <circle cx="200" cy="200" r="8" fill="currentColor" />
            {Array.from({ length: 72 }).map((_, i) => {
              const angle = (i * 5 * Math.PI) / 180;
              const r1 = i % 2 === 0 ? 175 : 178;
              const r2 = 185;
              return (
                <line key={i} x1={200 + r1 * Math.sin(angle)} y1={200 - r1 * Math.cos(angle)} x2={200 + r2 * Math.sin(angle)} y2={200 - r2 * Math.cos(angle)} stroke="currentColor" strokeWidth={i % 6 === 0 ? 2 : 0.5} />
              );
            })}
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/30 via-transparent to-ink/30" />
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-parchment/90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-blackpearl text-5xl md:text-7xl text-ink mb-4">The Trading Post</h1>
            <p className="text-lg text-ink/70 font-heading max-w-2xl mx-auto mb-6">
              Purveyors of artisan hot pepper flake blends—curated consortiums ranging from our 3-cultivar Regional selections to our flagship 5-cultivar Journeys—alongside single-origin cultivars for the discerning palate
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Button 
                variant="gold" 
                size="lg"
                onClick={() => document.getElementById('journeys')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-2 min-w-[160px] font-heading"
              >
                <Crown className="w-4 h-4" /> Journeys
              </Button>
              <Button 
                variant="tyrian" 
                size="lg"
                onClick={() => document.getElementById('regional')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-2 min-w-[160px] font-heading"
              >
                <Compass className="w-4 h-4" /> Regional
              </Button>
              <Button 
                variant="ink" 
                size="lg"
                onClick={() => document.getElementById('cultivars')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-2 min-w-[160px] font-heading"
              >
                <Leaf className="w-4 h-4" /> Cultivars
              </Button>
            </div>
            
            <div className="relative max-w-md mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <Input type="text" placeholder="Search the manifest..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 pr-11 py-6 bg-parchment border-ink/30 text-ink placeholder:text-ink/40 focus:border-tyrian/50 font-heading text-center" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & View Toggle Section */}
      {!isLoading && !error && (
        <section className="py-4 border-b border-tyrian/20 relative z-10">
          <div className="container mx-auto px-4 py-4 bg-parchment/90 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1 p-1 bg-tyrian/20 border border-tyrian/40 rounded-lg">
                <button onClick={() => setViewMode('exhibition')} className={`flex items-center gap-2 px-4 py-2 rounded font-heading text-sm uppercase tracking-wider transition-all ${viewMode === 'exhibition' ? 'bg-tyrian text-gold' : 'text-ink/60 hover:text-ink hover:bg-tyrian/20'}`}>
                  <Layers className="w-4 h-4" /><span className="hidden sm:inline">Exhibition Hall</span>
                </button>
                <button onClick={() => setViewMode('all')} className={`flex items-center gap-2 px-4 py-2 rounded font-heading text-sm uppercase tracking-wider transition-all ${viewMode === 'all' ? 'bg-tyrian text-gold' : 'text-ink/60 hover:text-ink hover:bg-tyrian/20'}`}>
                  <LayoutGrid className="w-4 h-4" /><span className="hidden sm:inline">All Products</span><span className="text-xs opacity-70">({products.length})</span>
                </button>
              </div>
              <HeatFilter minShu={0} maxShu={2200000} onRangeChange={setHeatRange} />
            </div>
          </div>
        </section>
      )}
      
      {isLoading && (
        <section className="py-24 relative z-10">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-tyrian animate-spin mb-4" />
            <p className="text-ink/60 font-heading">Loading cargo manifest...</p>
          </div>
        </section>
      )}
      
      {error && !isLoading && (
        <section className="py-24 relative z-10">
          <div className="text-center">
            <p className="text-pepper-red mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-tyrian/30 text-ink hover:bg-tyrian/10">Try Again</Button>
          </div>
        </section>
      )}
      
      {!isLoading && !error && isSearching && (
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="mb-8"><p className="text-ink/60 font-heading text-sm uppercase tracking-wider">{searchResults?.length} result{searchResults?.length !== 1 ? 's' : ''} for "{searchQuery}"</p></div>
            {searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => (<div key={product.node.id} className="relative"><CategoryBadge product={product} /><ProductCard product={product} onQuickView={setQuickViewProduct} /></div>))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-ink/30 mx-auto mb-4" />
                <p className="text-ink/60 font-heading">No products match your search</p>
                <Button variant="ghost" onClick={() => setSearchQuery("")} className="mt-4 text-tyrian hover:text-tyrian/80">Clear search</Button>
              </div>
            )}
          </div>
        </section>
      )}
      
      {!isLoading && !error && !isSearching && viewMode === 'all' && (
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-ink mb-4">Complete Manifest</h2>
              <p className="text-ink/60 leading-relaxed">All available goods from the Trading Company, sorted by price from most accessible to premium collections.</p>
            </div>
            {allProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProducts.map((product) => (<div key={product.node.id} className="relative"><CategoryBadge product={product} /><ProductCard product={product} onQuickView={setQuickViewProduct} /></div>))}
              </div>
            ) : (
              <div className="text-center py-16"><Package className="w-12 h-12 text-ink/30 mx-auto mb-4" /><p className="text-ink/60 font-heading">The cargo holds are currently empty</p></div>
            )}
          </div>
        </section>
      )}
      
      {!isLoading && !error && !isSearching && viewMode === 'exhibition' && (
        <>
          <section id="journeys" className="py-16 relative z-10 scroll-mt-24">
            <div className="container mx-auto px-4 bg-parchment/90 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-8">
                <Crown className="w-6 h-6 text-gold" />
                <div><h2 className="font-blackpearl text-3xl text-ink">Consortium Journeys</h2><p className="text-ink/60 font-heading text-sm uppercase tracking-wider">Flagship 5-pepper collections • 10 unique voyages</p></div>
              </div>
              <div className="mb-12"><ConsortiumHero onExplore={() => handleViewManifest('cradle-of-fire')} /></div>
              <JourneyGrid onViewManifest={handleViewManifest} />
            </div>
          </section>
          <RegionalBlendsSection products={products} />
          {cultivars.length > 0 && (
            <section id="cultivars" className="py-16 relative z-10 scroll-mt-24">
              <div className="container mx-auto px-4 bg-parchment/90 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-8">
                  <Leaf className="w-6 h-6 text-green-700" />
                  <div><h2 className="font-blackpearl text-3xl text-ink">Individual Cultivars</h2><p className="text-ink/60 font-heading text-sm uppercase tracking-wider">Single-origin peppers • {cultivars.length} varieties</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cultivars.map((product) => (<ProductCard key={product.node.id} product={product} onQuickView={setQuickViewProduct} />))}
                </div>
              </div>
            </section>
          )}
          {merchandise.length > 0 && (
            <section className="py-16 border-t border-tyrian/20 relative z-10">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                  <Package className="w-6 h-6 text-tyrian" />
                  <div><h2 className="font-blackpearl text-3xl text-ink">Merchandise</h2><p className="text-ink/60 font-heading text-sm uppercase tracking-wider">Trading Company goods</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {merchandise.map((product) => (<ProductCard key={product.node.id} product={product} onQuickView={setQuickViewProduct} />))}
                </div>
              </div>
            </section>
          )}
          {cultivars.length === 0 && consortiums.length === 0 && merchandise.length === 0 && (
            <section className="py-24 relative z-10"><div className="text-center"><Package className="w-12 h-12 text-ink/30 mx-auto mb-4" /><p className="text-ink/60 font-heading">The cargo holds are currently empty</p></div></section>
          )}
        </>
      )}
      
      <Footer />

      <QuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      {/* Consortium Manifest Modal */}
      <ConsortiumManifestOverlay open={manifest.open} onClose={closeModal}>
        {renderConsortiumContent()}
      </ConsortiumManifestOverlay>
    </div>
  );
}
