import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ImageGenerationResult {
  isGenerating: boolean;
  generateImages: (pepperId: string, pepperName: string, referenceImageUrls?: string[]) => Promise<boolean>;
  fetchReferenceImages: (pepperId: string) => Promise<string[]>;
}

export function useImageGeneration(): ImageGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const fetchReferenceImages = useCallback(async (pepperId: string): Promise<string[]> => {
    try {
      // Fetch Wikimedia research records for reference images
      const { data, error } = await supabase
        .from('pepper_research')
        .select('metadata')
        .eq('pepper_id', pepperId)
        .eq('source_type', 'wikimedia_images');

      if (error) throw error;

      const imageUrls: string[] = [];
      
      data?.forEach((record: any) => {
        const metadata = record.metadata;
        if (metadata?.images && Array.isArray(metadata.images)) {
          metadata.images.forEach((img: any) => {
            if (img.url) {
              imageUrls.push(img.url);
            }
          });
        }
      });

      return imageUrls;
    } catch (err) {
      console.error('Error fetching reference images:', err);
      return [];
    }
  }, []);

  const generateImages = useCallback(async (
    pepperId: string,
    pepperName: string,
    referenceImageUrls?: string[]
  ): Promise<boolean> => {
    setIsGenerating(true);
    try {
      const { data: session } = await supabase.auth.getSession();

      // If no reference URLs provided, try to fetch from research
      let imageUrls = referenceImageUrls || [];
      if (imageUrls.length === 0) {
        imageUrls = await fetchReferenceImages(pepperId);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pepper-image-generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            pepperId,
            pepperName,
            referenceImageUrls: imageUrls,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Image generation failed');
      }

      const imageCount = result.data?.length || 0;
      toast({
        title: 'Images Generated',
        description: `${imageCount} image proposal${imageCount !== 1 ? 's' : ''} created for review`,
      });

      return true;
    } catch (err) {
      console.error('Error generating images:', err);
      toast({
        title: 'Image Generation Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, [toast, fetchReferenceImages]);

  return {
    isGenerating,
    generateImages,
    fetchReferenceImages,
  };
}
