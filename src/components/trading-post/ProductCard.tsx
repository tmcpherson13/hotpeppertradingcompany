import { ShopifyProduct, CartItem } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Heart, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/useWishlist";
import { HeatBadge, HeatTier } from "./HeatBadge";

interface ProductCardProps {
  product: ShopifyProduct;
  onQuickView?: (product: ShopifyProduct) => void;
}

// Helper function to determine heat tier from max SHU
function getHeatTierFromSHU(maxSHU: number): HeatTier {
  if (maxSHU >= 500000) return 5;
  if (maxSHU >= 100000) return 4;
  if (maxSHU >= 30000) return 3;
  if (maxSHU >= 2500) return 2;
  return 1;
}

// Parse SHU from tags like "shu:30000-50000" or product title/description
function parseSHUFromProduct(tags: string[]): number | null {
  // Look for SHU tag pattern
  const shuTag = tags.find(tag => tag.toLowerCase().startsWith('shu:'));
  if (shuTag) {
    const match = shuTag.match(/shu:(\d+)(?:-(\d+))?/i);
    if (match) {
      // Return the max value if range, otherwise the single value
      return parseInt(match[2] || match[1], 10);
    }
  }
  return null;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { node } = product;
  
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const imageUrl = node.images.edges[0]?.node.url;
  const imageAlt = node.images.edges[0]?.node.altText || node.title;
  const isConsortium = node.productType === "Pepper Consortium";
  const isCultivar = node.productType === "Cultivar";
  const isWishlisted = isInWishlist(node.id);
  
  // Get heat tier for cultivars
  const maxSHU = parseSHUFromProduct(node.tags || []);
  const heatTier = isCultivar && maxSHU ? getHeatTierFromSHU(maxSHU) : null;
  
  // Get the first available variant
  const defaultVariant = node.variants.edges[0]?.node;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!defaultVariant) return;
    
    const cartItem: CartItem = {
      product,
      variantId: defaultVariant.id,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      quantity: 1,
      selectedOptions: defaultVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    setIsAdded(true);
    
    toast.success(`${node.title} added to manifest`, {
      position: "top-center"
    });
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <Link 
      to={`/product/${node.handle}`}
      className="group relative bg-ink/50 border border-tyrian/30 rounded-sm overflow-hidden transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-tyrian/20 block"
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-parchment/5 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-parchment/30">
            No image
          </div>
        )}
        
        {/* Product Type Badge */}
        {isConsortium && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-tyrian text-parchment text-[10px] uppercase tracking-wider font-heading">
              Consortium
            </span>
          </div>
        )}
        
        {/* Heat Badge for Cultivars */}
        {heatTier && (
          <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-sm px-2 py-1.5 rounded">
            <HeatBadge tier={heatTier} />
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`
              p-2 rounded-full transition-all shadow-lg
              ${isWishlisted 
                ? 'bg-pepper-red text-parchment' 
                : 'bg-ink/80 text-parchment/70 hover:text-parchment hover:bg-ink'
              }
            `}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-ink/80 text-parchment/70 hover:text-parchment hover:bg-ink transition-all shadow-lg"
              title="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading text-lg text-parchment line-clamp-1 group-hover:text-gold transition-colors">
            {node.title}
          </h3>
          <p className="text-sm text-parchment/60 line-clamp-2 mt-1">
            {node.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-parchment/10">
          <span className="font-heading text-xl text-gold">
            ${price.toFixed(2)}
          </span>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!defaultVariant?.availableForSale}
            className={`
              font-heading uppercase tracking-wider text-xs transition-all
              ${isAdded 
                ? 'bg-green-600 hover:bg-green-600 text-white' 
                : 'bg-pepper-red hover:bg-pepper-red/90 text-parchment'
              }
            `}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
