import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuickViewModal } from "@/components/trading-post/QuickViewModal";
import { SkeletonConsortiumHero } from "@/components/trading-post/skeleton/SkeletonConsortiumHero";
import { SkeletonRegionalCards } from "@/components/trading-post/skeleton/SkeletonRegionalCard";
import { ConsortiumCarousel } from "@/components/trading-post/skeleton/ConsortiumCarousel";
import { SkeletonCultivarSection } from "@/components/trading-post/skeleton/SkeletonCultivarSection";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Search, X, Crown, Sparkles, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import tradeRoutesBg from "@/assets/trade-routes-bg.jpg";

// Import consortium modals
import { CradleOfFireModal } from "@/components/sections/CradleOfFireModal";
import { ManilaGalleonModal } from "@/components/sections/ManilaGalleonModal";
import { PhoenicianLegacyModal } from "@/components/sections/PhoenicianLegacyModal";
import { AtlanticProvenanceModal } from "@/components/sections/AtlanticProvenanceModal";
import { LetterOfMarqueModal } from "@/components/sections/LetterOfMarqueModal";
import { SilkJadePassagesModal } from "@/components/sections/SilkJadePassagesModal";
import { AndeanDiasporaModal } from "@/components/sections/AndeanDiasporaModal";
import { SouthernCrucibleModal } from "@/components/sections/SouthernCrucibleModal";
import { OldNatchezTraceModal } from "@/components/sections/OldNatchezTraceModal";

export default function TradingPostSkeleton() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<ShopifyProduct | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
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

  // Filter cultivars only (not consortiums)
  const cultivars = useMemo(() => {
    return products.filter(p => {
      const type = p.node.productType?.toLowerCase() || '';
      return !type.includes('consortium') && !type.includes('merchandise');
    });
  }, [products]);

  const handleViewManifest = (consortiumId: string) => {
    setActiveModal(consortiumId);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-parchment relative">
      {/* Global Background */}
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
            <pattern id="skeleton-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(300 100% 18%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#skeleton-grid)" />
        </svg>
        <img 
          src={tradeRoutesBg} 
          alt="" 
          className="w-full h-full object-cover opacity-8 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink opacity-40" />
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden z-10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-parchment" />
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(300 100% 18%)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
          <img 
            src={tradeRoutesBg} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Preview Badge */}
            <div className="inline-flex items-center gap-2 bg-tyrian/20 border border-tyrian/40 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs uppercase tracking-wider text-tyrian font-heading">
                Layout Preview — Concept C
              </span>
            </div>

            <h1 className="font-blackpearl text-5xl md:text-7xl text-parchment mb-4">
              The Trading Post
            </h1>
            <p className="text-lg text-parchment/70 font-heading max-w-2xl mx-auto">
              Three tiers of curated selections: flagship journeys, regional blends, and single cultivars
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment/40 hover:text-parchment"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="py-24 relative z-10">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-tyrian animate-spin mb-4" />
            <p className="text-ink/60 font-heading">Loading cargo manifest...</p>
          </div>
        </section>
      ) : error ? (
        <section className="py-24 relative z-10">
          <div className="text-center">
            <p className="text-pepper-red">{error}</p>
          </div>
        </section>
      ) : (
        <>
          {/* TIER 1: Consortium Journeys */}
          <section className="py-16 relative z-10 bg-ink/5">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <Crown className="w-6 h-6 text-gold" />
                <div>
                  <h2 className="font-blackpearl text-3xl text-ink">Consortium Journeys</h2>
                  <p className="text-ink/60 font-heading text-sm uppercase tracking-wider">
                    Flagship 5-pepper collections • 10 unique voyages
                  </p>
                </div>
              </div>

              {/* Featured Hero Card */}
              <div className="mb-12">
                <SkeletonConsortiumHero />
              </div>

              {/* Carousel */}
              <ConsortiumCarousel onViewManifest={handleViewManifest} />
            </div>
          </section>

          {/* TIER 2: Regional Consortiums (NEW) */}
          <section className="py-16 relative z-10 border-y border-tyrian/20">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-3">
                <Sparkles className="w-6 h-6 text-tyrian" />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-blackpearl text-3xl text-ink">Regional Blends</h2>
                    <span className="text-[10px] uppercase tracking-wider bg-tyrian/20 text-tyrian px-2 py-1 rounded font-heading">
                      New Tier
                    </span>
                  </div>
                  <p className="text-ink/60 font-heading text-sm uppercase tracking-wider">
                    Curated 3-pepper selections by geography & flavor
                  </p>
                </div>
              </div>

              <p className="text-ink/70 font-body max-w-2xl mb-8">
                A middle tier between individual cultivars and flagship journeys — 
                focused blends that showcase regional character without the commitment of a full consortium.
              </p>

              {/* Regional Cards */}
              <SkeletonRegionalCards />
            </div>
          </section>

          {/* TIER 3: Individual Cultivars */}
          <section className="py-16 relative z-10">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <Leaf className="w-6 h-6 text-green-700" />
                <div>
                  <h2 className="font-blackpearl text-3xl text-ink">Individual Cultivars</h2>
                  <p className="text-ink/60 font-heading text-sm uppercase tracking-wider">
                    Single-origin peppers by heat level • {cultivars.length} varieties
                  </p>
                </div>
              </div>

              {/* Cultivar Grid with Heat Tabs */}
              <SkeletonCultivarSection 
                cultivars={cultivars} 
                onQuickView={setQuickViewProduct}
              />
            </div>
          </section>
        </>
      )}

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Consortium Modals */}
      <CradleOfFireModal open={activeModal === 'cradle-of-fire'} onOpenChange={(open) => !open && closeModal()} />
      <ManilaGalleonModal open={activeModal === 'manila-galleon'} onOpenChange={(open) => !open && closeModal()} />
      <PhoenicianLegacyModal open={activeModal === 'phoenician-legacy'} onOpenChange={(open) => !open && closeModal()} />
      <AtlanticProvenanceModal open={activeModal === 'atlantic-provenance'} onOpenChange={(open) => !open && closeModal()} />
      <LetterOfMarqueModal open={activeModal === 'letter-of-marque'} onOpenChange={(open) => !open && closeModal()} />
      <SilkJadePassagesModal open={activeModal === 'silk-jade-passages'} onOpenChange={(open) => !open && closeModal()} />
      <AndeanDiasporaModal open={activeModal === 'andean-diaspora'} onOpenChange={(open) => !open && closeModal()} />
      <SouthernCrucibleModal open={activeModal === 'southern-crucible'} onOpenChange={(open) => !open && closeModal()} />
      <OldNatchezTraceModal open={activeModal === 'old-natchez-trace'} onOpenChange={(open) => !open && closeModal()} />
    </div>
  );
}
