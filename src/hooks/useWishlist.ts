import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  product_id: string;
  product_handle: string;
  product_title: string;
  product_image_url: string | null;
  product_price: string | null;
  created_at: string;
}

export function useWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wishlist items
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  // Add to wishlist
  const addToWishlist = useCallback(async (product: ShopifyProduct) => {
    if (!user) {
      toast.error('Sign in to save favorites', {
        description: 'Create an account to save items to your wishlist'
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_wishlists')
        .insert({
          user_id: user.id,
          product_id: product.node.id,
          product_handle: product.node.handle,
          product_title: product.node.title,
          product_image_url: product.node.images.edges[0]?.node.url || null,
          product_price: product.node.priceRange.minVariantPrice.amount
        });

      if (error) throw error;

      await fetchWishlist();
      toast.success('Added to wishlist');
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast.info('Already in your wishlist');
      } else {
        console.error('Error adding to wishlist:', error);
        toast.error('Failed to add to wishlist');
      }
      return false;
    }
  }, [user, fetchWishlist]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchWishlist();
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    }
  }, [user, fetchWishlist]);

  // Toggle wishlist
  const toggleWishlist = useCallback(async (product: ShopifyProduct) => {
    if (isInWishlist(product.node.id)) {
      return removeFromWishlist(product.node.id);
    } else {
      return addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    items,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist
  };
}
