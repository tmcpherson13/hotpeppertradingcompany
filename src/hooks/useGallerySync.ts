import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PepperImage } from '@/data/pepperTypes';
import { UploadedImage } from './useImageUpload';

interface GallerySyncResult {
  uploadedImages: UploadedImage[];
  savedOrder: string[] | null;
  isLoading: boolean;
  refreshUploads: () => Promise<void>;
  saveOrder: (imageIds: string[]) => Promise<void>;
}

export function useGallerySync(pepperId: string): GallerySyncResult {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [savedOrder, setSavedOrder] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user-uploaded images for this pepper
  const fetchUploadedImages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_uploaded_images')
        .select('*')
        .eq('pepper_id', pepperId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching uploaded images:', error);
        return;
      }

      const images: UploadedImage[] = (data || []).map((item) => {
        const { data: urlData } = supabase.storage
          .from('pepper-images')
          .getPublicUrl(item.storage_path);

        return {
          id: item.id,
          url: urlData.publicUrl,
          storagePath: item.storage_path,
          filename: item.filename,
          userId: item.user_id,
          pepperId: item.pepper_id,
          createdAt: item.created_at,
        };
      });

      setUploadedImages(images);
    } catch (err) {
      console.error('Error in fetchUploadedImages:', err);
    }
  }, [pepperId]);

  // Fetch user's saved gallery order
  const fetchSavedOrder = useCallback(async () => {
    if (!user) {
      // Fall back to localStorage for guests
      const localKey = `gallery-order-${pepperId}`;
      const localOrder = localStorage.getItem(localKey);
      if (localOrder) {
        try {
          setSavedOrder(JSON.parse(localOrder));
        } catch {
          setSavedOrder(null);
        }
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_gallery_orders')
        .select('image_order')
        .eq('user_id', user.id)
        .eq('pepper_id', pepperId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching gallery order:', error);
        return;
      }

      setSavedOrder(data?.image_order || null);
    } catch (err) {
      console.error('Error in fetchSavedOrder:', err);
    }
  }, [pepperId, user]);

  // Save gallery order
  const saveOrder = useCallback(async (imageIds: string[]) => {
    if (!user) {
      // Save to localStorage for guests
      const localKey = `gallery-order-${pepperId}`;
      localStorage.setItem(localKey, JSON.stringify(imageIds));
      setSavedOrder(imageIds);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_gallery_orders')
        .upsert(
          {
            user_id: user.id,
            pepper_id: pepperId,
            image_order: imageIds,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,pepper_id',
          }
        );

      if (error) {
        console.error('Error saving gallery order:', error);
        return;
      }

      setSavedOrder(imageIds);
    } catch (err) {
      console.error('Error in saveOrder:', err);
    }
  }, [pepperId, user]);

  // Refresh uploads
  const refreshUploads = useCallback(async () => {
    await fetchUploadedImages();
  }, [fetchUploadedImages]);

  // Initial fetch
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await Promise.all([fetchUploadedImages(), fetchSavedOrder()]);
      setIsLoading(false);
    };

    initialize();
  }, [fetchUploadedImages, fetchSavedOrder]);

  return {
    uploadedImages,
    savedOrder,
    isLoading,
    refreshUploads,
    saveOrder,
  };
}

// Extended PepperImage with upload metadata for deletion
export interface PepperImageWithMeta extends PepperImage {
  _uploadMetadata?: {
    storagePath: string;
    userId: string;
  };
}

// Helper to merge static gallery with uploaded images
export function mergeGalleryWithUploads(
  staticGallery: PepperImage[],
  uploadedImages: UploadedImage[],
  savedOrder: string[] | null
): PepperImageWithMeta[] {
  // Convert uploaded images to PepperImage format
  const uploadedAsPepperImages: PepperImageWithMeta[] = uploadedImages.map((img) => ({
    id: img.id,
    url: img.url,
    type: 'user-upload' as const,
    isPrimary: false,
    source: 'user-contributed' as const,
    license: 'User contributed',
    _uploadMetadata: {
      storagePath: img.storagePath,
      userId: img.userId,
    },
  }));

  // Merge all images
  const allImages: PepperImageWithMeta[] = [...staticGallery, ...uploadedAsPepperImages];

  // If no saved order, return as-is with primary first
  if (!savedOrder || savedOrder.length === 0) {
    return allImages.sort((a, b) => {
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
      return 0;
    });
  }

  // Apply saved order
  const orderedImages: PepperImageWithMeta[] = [];
  const remainingImages = [...allImages];

  for (const id of savedOrder) {
    const index = remainingImages.findIndex((img) => img.id === id);
    if (index !== -1) {
      orderedImages.push(remainingImages[index]);
      remainingImages.splice(index, 1);
    }
  }

  // Add any remaining images not in the saved order
  return [...orderedImages, ...remainingImages];
}
