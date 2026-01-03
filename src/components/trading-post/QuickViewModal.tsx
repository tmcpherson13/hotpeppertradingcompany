import { ShopifyProduct, CartItem } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShoppingCart, Check, Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useWishlist } from '@/hooks/useWishlist';

interface QuickViewModalProps {
  product: ShopifyProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const { node } = product;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const images = node.images.edges;
  const defaultVariant = node.variants.edges[0]?.node;
  const isWishlisted = isInWishlist(node.id);

  const handleAddToCart = () => {
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
    toast.success(`${node.title} added to manifest`, { position: 'top-center' });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-ink border-tyrian/40 text-parchment p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative aspect-square bg-parchment/5">
            {images[0] ? (
              <img
                src={images[0].node.url}
                alt={images[0].node.altText || node.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-parchment/30">
                No image
              </div>
            )}
            
            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              className={`
                absolute top-4 right-4 p-2 rounded-full transition-all
                ${isWishlisted 
                  ? 'bg-pepper-red text-parchment' 
                  : 'bg-ink/60 text-parchment/60 hover:text-parchment hover:bg-ink/80'
                }
              `}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-heading text-2xl text-parchment">
                {node.title}
              </DialogTitle>
            </DialogHeader>

            <p className="text-parchment/70 text-sm leading-relaxed mb-6 flex-grow">
              {node.description}
            </p>

            <div className="space-y-4">
              {/* Price */}
              <div className="flex items-center justify-between py-3 border-t border-b border-parchment/10">
                <span className="text-parchment/60 font-heading uppercase tracking-wider text-sm">Price</span>
                <span className="font-heading text-2xl text-gold">${price.toFixed(2)}</span>
              </div>

              {/* Variant info if multiple */}
              {node.options && node.options.length > 0 && node.options[0].values.length > 1 && (
                <div className="text-sm text-parchment/60">
                  {node.options[0].values.length} variants available
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!defaultVariant?.availableForSale}
                  className={`
                    flex-1 font-heading uppercase tracking-wider text-xs transition-all
                    ${isAdded 
                      ? 'bg-green-600 hover:bg-green-600 text-white' 
                      : 'bg-pepper-red hover:bg-pepper-red/90 text-parchment'
                    }
                  `}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-parchment/30 text-parchment hover:bg-parchment/10"
                >
                  <Link to={`/product/${node.handle}`} onClick={onClose}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
