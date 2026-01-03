import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/trading-post/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Search, X, Anchor, Crown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import tradeRoutesBg from "@/assets/trade-routes-bg.jpg";

export default function TradingPost() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Categorize products
  const { cultivars, consortiums, merchandise } = useMemo(() => {
    const cultivars = products.filter(p => 
      p.node.productType !== "Pepper Consortium" && 
      p.node.productType !== "Merchandise"
    );
    const consortiums = products.filter(p => p.node.productType === "Pepper Consortium");
    const merchandise = products.filter(p => p.node.productType === "Merchandise");
    
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
                  <ProductCard key={product.node.id} product={product} />
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
      
      {/* Categorized Products */}
      {!isLoading && !error && !isSearching && (
        <>
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
                    <ProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Consortiums Section - Premium Tier */}
          {consortiums.length > 0 && (
            <section className="py-16 bg-gradient-to-b from-ink to-ink/95">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-5 h-5 text-gold" />
                    <span className="text-gold font-heading text-sm uppercase tracking-widest">Curated Collections</span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl text-parchment mb-4">
                    The Pepper Consortiums
                  </h2>
                  <p className="text-parchment/60 leading-relaxed">
                    For the discerning collector, our consortiums represent the pinnacle of deliberate curation. 
                    Each collection tells a story—tracing trade routes, honoring regional traditions, 
                    or exploring the evolution of a single species across continents.
                  </p>
                  <p className="text-parchment/40 text-sm mt-4 font-heading italic">
                    Five cultivars per consortium, selected for complementary heat profiles and culinary applications
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {consortiums.map((product) => (
                    <ProductCard key={product.node.id} product={product} />
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
                    <ProductCard key={product.node.id} product={product} />
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
    </div>
  );
}
