import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useHiddenImages(pepperId: string) {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchHiddenImages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hidden_gallery_images')
        .select('image_id')
        .eq('pepper_id', pepperId);

      if (error) {
        console.error('Error fetching hidden images:', error);
        return;
      }

      setHiddenIds(new Set(data?.map((row) => row.image_id) || []));
    } catch (err) {
      console.error('Error in fetchHiddenImages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pepperId]);

  useEffect(() => {
    fetchHiddenImages();
  }, [fetchHiddenImages]);

  const hideImage = useCallback(async (imageId: string): Promise<boolean> => {
    if (!user || !isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only administrators can hide archival images.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('hidden_gallery_images')
        .insert({
          image_id: imageId,
          pepper_id: pepperId,
          hidden_by: user.id,
        });

      if (error) {
        throw error;
      }

      setHiddenIds((prev) => new Set([...prev, imageId]));

      toast({
        title: 'Image Hidden',
        description: 'The archival image has been hidden from the gallery.',
      });

      return true;
    } catch (error) {
      console.error('Error hiding image:', error);
      toast({
        title: 'Error',
        description: 'Failed to hide image. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [pepperId, user, isAdmin, toast]);

  const unhideImage = useCallback(async (imageId: string): Promise<boolean> => {
    if (!user || !isAdmin) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('hidden_gallery_images')
        .delete()
        .eq('image_id', imageId);

      if (error) {
        throw error;
      }

      setHiddenIds((prev) => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });

      toast({
        title: 'Image Restored',
        description: 'The archival image is now visible again.',
      });

      return true;
    } catch (error) {
      console.error('Error unhiding image:', error);
      return false;
    }
  }, [user, isAdmin, toast]);

  return {
    hiddenIds,
    isLoading,
    hideImage,
    unhideImage,
    refresh: fetchHiddenImages,
  };
}
