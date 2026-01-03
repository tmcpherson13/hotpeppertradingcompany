import { ShopifyProduct, CartItem } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;
  
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const imageUrl = node.images.edges[0]?.node.url;
  const imageAlt = node.images.edges[0]?.node.altText || node.title;
  const isConsortium = node.productType === "Pepper Consortium";
  
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

  return (
    <Link 
      to={`/product/${node.handle}`}
      className="group relative bg-ink/50 border border-tyrian/30 rounded-sm overflow-hidden transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-tyrian/20 block"
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-parchment/5">
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
