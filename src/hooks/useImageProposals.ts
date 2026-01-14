import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ImageProposal {
  id: string;
  pepper_id: string;
  image_url: string | null;
  storage_path: string | null;
  source_type: string;
  source_url: string | null;
  license: string | null;
  author: string | null;
  prompt_used: string | null;
  confidence_score: number | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface UseImageProposalsResult {
  proposals: ImageProposal[];
  isLoading: boolean;
  processingId: string | null;
  isRegenerating: boolean;
  regeneratingIds: Set<string>;
  fetchProposals: (pepperId?: string) => Promise<void>;
  approveProposal: (proposal: ImageProposal) => Promise<boolean>;
  rejectProposal: (proposal: ImageProposal) => Promise<boolean>;
  approveAll: (proposals: ImageProposal[]) => Promise<void>;
  rejectAll: (proposals: ImageProposal[]) => Promise<void>;
  regenerateImages: (pepperId: string, pepperName: string, feedback?: string, referenceImages?: File[]) => Promise<boolean>;
  regenerateSingleImage: (proposal: ImageProposal, pepperName: string, feedback?: string, referenceImages?: File[]) => Promise<boolean>;
  deleteProposal: (proposal: ImageProposal) => Promise<boolean>;
  deleteAll: (proposals: ImageProposal[]) => Promise<{ success: number; failed: number }>;
  convertFilesToDataUrls: (files: File[]) => Promise<string[]>;
}

export function useImageProposals(): UseImageProposalsResult {
  const [proposals, setProposals] = useState<ImageProposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchProposals = useCallback(async (pepperId?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('pepper_image_proposals')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pepperId) {
        query = query.eq('pepper_id', pepperId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProposals(data || []);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch image proposals',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const approveProposal = useCallback(async (proposal: ImageProposal): Promise<boolean> => {
    setProcessingId(proposal.id);

    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      // Update proposal status
      const { error: updateError } = await supabase
        .from('pepper_image_proposals')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
        })
        .eq('id', proposal.id);

      if (updateError) throw updateError;

      // Create entry in user_uploaded_images for gallery integration
      if (proposal.image_url && proposal.storage_path) {
        const { error: insertError } = await supabase
          .from('user_uploaded_images')
          .insert({
            pepper_id: proposal.pepper_id,
            user_id: userId!,
            storage_path: proposal.storage_path,
            filename: proposal.storage_path.split('/').pop() || 'image.png',
          });

        if (insertError) {
          console.error('Error adding to gallery:', insertError);
        }
      }

      toast({
        title: 'Image Approved',
        description: 'Image has been added to the pepper gallery',
      });

      // Remove from local state
      setProposals(prev => prev.filter(p => p.id !== proposal.id));
      return true;
    } catch (err) {
      console.error('Error approving proposal:', err);
      toast({
        title: 'Error',
        description: 'Failed to approve image',
        variant: 'destructive',
      });
      return false;
    } finally {
      setProcessingId(null);
    }
  }, [toast]);

  const rejectProposal = useCallback(async (proposal: ImageProposal): Promise<boolean> => {
    setProcessingId(proposal.id);

    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      // Update proposal status
      const { error: updateError } = await supabase
        .from('pepper_image_proposals')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
        })
        .eq('id', proposal.id);

      if (updateError) throw updateError;

      // Delete from storage
      if (proposal.storage_path) {
        await supabase.storage
          .from('pepper-images')
          .remove([proposal.storage_path]);
      }

      toast({
        title: 'Image Rejected',
        description: 'Image has been removed',
      });

      // Remove from local state
      setProposals(prev => prev.filter(p => p.id !== proposal.id));
      return true;
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      toast({
        title: 'Error',
        description: 'Failed to reject image',
        variant: 'destructive',
      });
      return false;
    } finally {
      setProcessingId(null);
    }
  }, [toast]);

  const approveAll = useCallback(async (proposalsToApprove: ImageProposal[]) => {
    for (const proposal of proposalsToApprove) {
      await approveProposal(proposal);
    }
  }, [approveProposal]);

  const rejectAll = useCallback(async (proposalsToReject: ImageProposal[]) => {
    for (const proposal of proposalsToReject) {
      await rejectProposal(proposal);
    }
  }, [rejectProposal]);

  // Convert File[] to base64 data URLs for edge function
  const convertFilesToDataUrls = useCallback(async (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(file => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }))
    );
  }, []);

  const regenerateImages = useCallback(async (
    pepperId: string, 
    pepperName: string, 
    feedback?: string,
    referenceImages?: File[]
  ): Promise<boolean> => {
    setIsRegenerating(true);
    
    try {
      // First, reject all current pending proposals for this pepper
      const currentProposals = proposals.filter(p => p.pepper_id === pepperId);
      for (const proposal of currentProposals) {
        await rejectProposal(proposal);
      }

      // Get auth token
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

      // Convert reference images to data URLs if provided
      let referenceImageUrls: string[] | undefined;
      if (referenceImages && referenceImages.length > 0) {
        referenceImageUrls = await convertFilesToDataUrls(referenceImages);
      }

      // Call the image generation edge function with feedback as additional context
      const response = await supabase.functions.invoke('pepper-image-generate', {
        body: { 
          pepperId, 
          pepperName,
          regenerationFeedback: feedback,
          referenceImageUrls,
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Image generation failed');
      }

      toast({
        title: 'Images Regenerating',
        description: 'New images are being generated with your feedback. This may take a minute.',
      });

      // Refresh proposals after a short delay to get new ones
      setTimeout(() => {
        fetchProposals(pepperId);
      }, 3000);

      return true;
    } catch (err) {
      console.error('Error regenerating images:', err);
      toast({
        title: 'Regeneration Failed',
        description: err instanceof Error ? err.message : 'Failed to regenerate images',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsRegenerating(false);
    }
  }, [proposals, rejectProposal, fetchProposals, toast, convertFilesToDataUrls]);

  const regenerateSingleImage = useCallback(async (
    proposal: ImageProposal,
    pepperName: string,
    feedback?: string,
    referenceImages?: File[]
  ): Promise<boolean> => {
    // Add to regenerating set to track this specific image
    setRegeneratingIds(prev => new Set(prev).add(proposal.id));
    
    try {
      // Get auth token
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

      // Convert reference images to data URLs if provided
      let referenceImageUrls: string[] | undefined;
      if (referenceImages && referenceImages.length > 0) {
        referenceImageUrls = await convertFilesToDataUrls(referenceImages);
      }

      // Call the image generation edge function for just this image type
      const response = await supabase.functions.invoke('pepper-image-generate', {
        body: { 
          pepperId: proposal.pepper_id, 
          pepperName,
          regenerationFeedback: feedback,
          referenceImageUrls,
          imageType: proposal.source_type, // Only regenerate this specific type
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Image regeneration failed');
      }

      // Now reject the old proposal after successful trigger
      const userId = session?.session?.user?.id;
      await supabase
        .from('pepper_image_proposals')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
        })
        .eq('id', proposal.id);

      // Delete from storage
      if (proposal.storage_path) {
        await supabase.storage
          .from('pepper-images')
          .remove([proposal.storage_path]);
      }

      // Remove from local state
      setProposals(prev => prev.filter(p => p.id !== proposal.id));

      toast({
        title: 'Image Regenerating',
        description: 'A new image is being generated. This may take a moment.',
      });

      // Refresh proposals after a short delay
      setTimeout(() => {
        fetchProposals(proposal.pepper_id);
      }, 5000);

      return true;
    } catch (err) {
      console.error('Error regenerating single image:', err);
      toast({
        title: 'Regeneration Failed',
        description: err instanceof Error ? err.message : 'Failed to regenerate image',
        variant: 'destructive',
      });
      return false;
    } finally {
      // Remove from regenerating set
      setRegeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(proposal.id);
        return next;
      });
    }
  }, [fetchProposals, toast, convertFilesToDataUrls]);

  const deleteProposal = useCallback(async (proposal: ImageProposal): Promise<boolean> => {
    setProcessingId(proposal.id);

    try {
      // Delete from storage first
      if (proposal.storage_path) {
        await supabase.storage
          .from('pepper-images')
          .remove([proposal.storage_path]);
      }

      // Permanently delete from database
      const { error } = await supabase
        .from('pepper_image_proposals')
        .delete()
        .eq('id', proposal.id);

      if (error) throw error;

      toast({
        title: 'Image Deleted',
        description: 'Image proposal permanently removed',
      });

      // Remove from local state
      setProposals(prev => prev.filter(p => p.id !== proposal.id));
      return true;
    } catch (err) {
      console.error('Error deleting proposal:', err);
      toast({
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    } finally {
      setProcessingId(null);
    }
  }, [toast]);

  const deleteAll = useCallback(async (proposalsToDelete: ImageProposal[]): Promise<{ success: number; failed: number }> => {
    let success = 0;
    let failed = 0;

    for (const proposal of proposalsToDelete) {
      try {
        // Delete from storage
        if (proposal.storage_path) {
          await supabase.storage
            .from('pepper-images')
            .remove([proposal.storage_path]);
        }

        // Permanently delete from database
        const { error } = await supabase
          .from('pepper_image_proposals')
          .delete()
          .eq('id', proposal.id);

        if (error) throw error;
        success++;
        
        // Remove from local state
        setProposals(prev => prev.filter(p => p.id !== proposal.id));
      } catch (err) {
        console.error('Error deleting proposal:', err);
        failed++;
      }
    }

    toast({
      title: 'Bulk Delete Complete',
      description: `${success} deleted${failed > 0 ? `, ${failed} failed` : ''}`,
    });

    return { success, failed };
  }, [toast]);

  return {
    proposals,
    isLoading,
    processingId,
    isRegenerating,
    regeneratingIds,
    fetchProposals,
    approveProposal,
    rejectProposal,
    approveAll,
    rejectAll,
    regenerateImages,
    regenerateSingleImage,
    deleteProposal,
    deleteAll,
    convertFilesToDataUrls,
  };
}
