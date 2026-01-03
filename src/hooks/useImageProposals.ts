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
  fetchProposals: (pepperId?: string) => Promise<void>;
  approveProposal: (proposal: ImageProposal) => Promise<boolean>;
  rejectProposal: (proposal: ImageProposal) => Promise<boolean>;
  approveAll: (proposals: ImageProposal[]) => Promise<void>;
  rejectAll: (proposals: ImageProposal[]) => Promise<void>;
}

export function useImageProposals(): UseImageProposalsResult {
  const [proposals, setProposals] = useState<ImageProposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
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

  return {
    proposals,
    isLoading,
    processingId,
    fetchProposals,
    approveProposal,
    rejectProposal,
    approveAll,
    rejectAll,
  };
}
