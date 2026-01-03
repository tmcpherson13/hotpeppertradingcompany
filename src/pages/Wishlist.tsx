import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { fetchProductByHandle, CartItem } from '@/lib/shopify';
import { toast } from 'sonner';
import { useState } from 'react';
import tradeRoutesBg from '@/assets/trade-routes-bg.jpg';

export default function Wishlist() {
  const { user, isLoading: authLoading } = useAuth();
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const addItem = useCartStore(state => state.addItem);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/admin" replace />;
  }

  const handleAddToCart = async (item: typeof items[0]) => {
    setAddingToCart(item.product_id);
    try {
      const product = await fetchProductByHandle(item.product_handle);
      if (!product) {
        toast.error('Product not found');
        return;
      }

      const defaultVariant = product.node.variants.edges[0]?.node;
      if (!defaultVariant) {
        toast.error('No variant available');
        return;
      }

      const cartItem: CartItem = {
        product,
        variantId: defaultVariant.id,
        variantTitle: defaultVariant.title,
        price: defaultVariant.price,
        quantity: 1,
        selectedOptions: defaultVariant.selectedOptions || []
      };

      addItem(cartItem);
      toast.success(`${item.product_title} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={tradeRoutesBg} 
            alt="" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-pepper-red fill-pepper-red" />
              <span className="text-gold font-heading text-sm uppercase tracking-widest">Your Collection</span>
            </div>
            <h1 className="font-blackpearl text-4xl md:text-5xl text-parchment mb-4">
              Saved Favorites
            </h1>
            <p className="text-parchment/60 font-heading">
              Cultivars and consortiums you've marked for future acquisition
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4">
          {isLoading || authLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
              <p className="text-parchment/60 font-heading">Loading your wishlist...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-parchment/20 mx-auto mb-4" />
              <h2 className="font-heading text-xl text-parchment mb-2">Your wishlist is empty</h2>
              <p className="text-parchment/60 mb-6">Browse our collection and save items you'd like to acquire</p>
              <Button asChild className="bg-pepper-red hover:bg-pepper-red/90 text-parchment font-heading uppercase tracking-wider">
                <Link to="/trading-post">Explore the Trading Post</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-ink/50 border border-tyrian/30 rounded-sm overflow-hidden group"
                >
                  {/* Image */}
                  <Link to={`/product/${item.product_handle}`} className="block">
                    <div className="aspect-square overflow-hidden bg-parchment/5">
                      {item.product_image_url ? (
                        <img
                          src={item.product_image_url}
                          alt={item.product_title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-parchment/30">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <Link to={`/product/${item.product_handle}`}>
                      <h3 className="font-heading text-lg text-parchment line-clamp-1 group-hover:text-gold transition-colors">
                        {item.product_title}
                      </h3>
                    </Link>

                    {item.product_price && (
                      <span className="font-heading text-xl text-gold block">
                        ${parseFloat(item.product_price).toFixed(2)}
                      </span>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={addingToCart === item.product_id}
                        className="flex-1 bg-pepper-red hover:bg-pepper-red/90 text-parchment font-heading uppercase tracking-wider text-xs"
                      >
                        {addingToCart === item.product_id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(item.product_id)}
                        className="border-parchment/30 text-parchment/60 hover:text-pepper-red hover:border-pepper-red/50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
