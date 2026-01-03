import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/trading-post/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Filter, Package, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import tradeRoutesBg from "@/assets/trade-routes-bg.jpg";

type ProductFilter = "all" | "cultivars" | "consortiums";

export default function TradingPost() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProductFilter>("all");

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

  const filteredProducts = useMemo(() => {
    if (filter === "all") return products;
    if (filter === "cultivars") {
      return products.filter(p => p.node.productType !== "Pepper Consortium");
    }
    if (filter === "consortiums") {
      return products.filter(p => p.node.productType === "Pepper Consortium");
    }
    return products;
  }, [products, filter]);

  const cultivarCount = products.filter(p => p.node.productType !== "Pepper Consortium").length;
  const consortiumCount = products.filter(p => p.node.productType === "Pepper Consortium").length;

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background */}
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
            <p className="text-lg text-parchment/70 font-heading">
              Procure the finest cultivars and curated consortiums from our cargo holds
            </p>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-tyrian/30">
            <div className="flex items-center gap-2 text-parchment/60">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-heading uppercase tracking-wider">Filter by:</span>
            </div>
            
            <Tabs value={filter} onValueChange={(v) => setFilter(v as ProductFilter)} className="w-full sm:w-auto">
              <TabsList className="w-full sm:w-auto bg-tyrian/20 border border-tyrian/30">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 sm:flex-none data-[state=active]:bg-tyrian data-[state=active]:text-parchment font-heading uppercase tracking-wider text-sm"
                >
                  All ({products.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="cultivars" 
                  className="flex-1 sm:flex-none data-[state=active]:bg-tyrian data-[state=active]:text-parchment font-heading uppercase tracking-wider text-sm"
                >
                  <Package className="w-3 h-3 mr-1.5" />
                  Cultivars ({cultivarCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="consortiums" 
                  className="flex-1 sm:flex-none data-[state=active]:bg-tyrian data-[state=active]:text-parchment font-heading uppercase tracking-wider text-sm"
                >
                  <Boxes className="w-3 h-3 mr-1.5" />
                  Consortiums ({consortiumCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
              <p className="text-parchment/60 font-heading">Loading cargo manifest...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-24">
              <p className="text-pepper-red mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-parchment/30 text-parchment hover:bg-parchment/10"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-24">
              <Package className="w-12 h-12 text-parchment/30 mx-auto mb-4" />
              <p className="text-parchment/60 font-heading">No products found</p>
            </div>
          )}
          
          {/* Products Grid */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
