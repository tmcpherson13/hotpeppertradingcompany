import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EnrichmentQueueEntry {
  id: string;
  pepper_id: string;
  proposed_description: string | null;
  proposed_historical_notes: string | null;
  proposed_flavor_notes: string | null;
  proposed_aroma_notes: string | null;
  proposed_culinary_uses: string | null;
  proposed_trade_route: string | null;
  source_citations: string[];
  research_ids: string[];
  status: 'pending' | 'approved' | 'rejected';
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  created_by: string | null;
  confidence_score: number | null;
  auto_approved: boolean | null;
}

export interface UsePepperEnrichmentResult {
  queue: EnrichmentQueueEntry[];
  isLoading: boolean;
  isSynthesizing: boolean;
  isApplying: boolean;
  fetchQueue: (status?: string) => Promise<void>;
  fetchPepperQueue: (pepperId: string) => Promise<EnrichmentQueueEntry | null>;
  synthesize: (pepperId: string, pepperName: string, generateImages?: boolean, jobId?: string | null) => Promise<boolean>;
  approve: (queueId: string, edits?: Partial<EnrichmentQueueEntry>, reviewNotes?: string) => Promise<boolean>;
  reject: (queueId: string, reviewNotes?: string) => Promise<boolean>;
}

export function usePepperEnrichment(): UsePepperEnrichmentResult {
  const [queue, setQueue] = useState<EnrichmentQueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const fetchQueue = useCallback(async (status?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('pepper_enrichment_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Type assertion since we know the structure matches
      setQueue((data || []) as unknown as EnrichmentQueueEntry[]);
    } catch (err) {
      console.error('Error fetching enrichment queue:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch enrichment queue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchPepperQueue = useCallback(async (pepperId: string): Promise<EnrichmentQueueEntry | null> => {
    try {
      const { data, error } = await supabase
        .from('pepper_enrichment_queue')
        .select('*')
        .eq('pepper_id', pepperId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return (data as unknown as EnrichmentQueueEntry) || null;
    } catch (err) {
      console.error('Error fetching pepper queue:', err);
      return null;
    }
  }, []);

  const synthesize = useCallback(async (
    pepperId: string, 
    pepperName: string,
    generateImages: boolean = false,
    jobId: string | null = null
  ): Promise<boolean> => {
    setIsSynthesizing(true);
    try {
      const { data: session } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pepper-synthesize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ pepperId, pepperName, generateImages, jobId }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Synthesis failed');
      }

      toast({
        title: 'Synthesis Complete',
        description: result.message,
      });

      return true;
    } catch (err) {
      console.error('Error synthesizing content:', err);
      toast({
        title: 'Synthesis Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSynthesizing(false);
    }
  }, [toast]);

  const approve = useCallback(async (
    queueId: string,
    edits?: Partial<EnrichmentQueueEntry>,
    reviewNotes?: string
  ): Promise<boolean> => {
    setIsApplying(true);
    try {
      const { data: session } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pepper-apply-enrichment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ queueId, action: 'approve', edits, reviewNotes }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Approval failed');
      }

      toast({
        title: 'Enrichment Approved',
        description: result.message,
      });

      // Refresh queue
      await fetchQueue('pending');
      return true;
    } catch (err) {
      console.error('Error approving enrichment:', err);
      toast({
        title: 'Approval Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsApplying(false);
    }
  }, [toast, fetchQueue]);

  const reject = useCallback(async (queueId: string, reviewNotes?: string): Promise<boolean> => {
    setIsApplying(true);
    try {
      const { data: session } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pepper-apply-enrichment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ queueId, action: 'reject', reviewNotes }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Rejection failed');
      }

      toast({
        title: 'Enrichment Rejected',
        description: 'The proposal has been rejected',
      });

      // Refresh queue
      await fetchQueue('pending');
      return true;
    } catch (err) {
      console.error('Error rejecting enrichment:', err);
      toast({
        title: 'Rejection Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsApplying(false);
    }
  }, [toast, fetchQueue]);

  return {
    queue,
    isLoading,
    isSynthesizing,
    isApplying,
    fetchQueue,
    fetchPepperQueue,
    synthesize,
    approve,
    reject,
  };
}
