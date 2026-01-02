import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ResearchRecord {
  id: string;
  pepper_id: string;
  source_type: 'firecrawl' | 'perplexity';
  query: string;
  raw_content: string | null;
  urls: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  created_by: string | null;
}

export interface UsePepperResearchResult {
  research: ResearchRecord[];
  isLoading: boolean;
  isResearching: boolean;
  fetchResearch: (pepperId: string) => Promise<void>;
  triggerResearch: (pepperId: string, pepperName: string, sources?: string[]) => Promise<boolean>;
  clearResearch: () => void;
}

export function usePepperResearch(): UsePepperResearchResult {
  const [research, setResearch] = useState<ResearchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const { toast } = useToast();

  const fetchResearch = useCallback(async (pepperId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pepper_research')
        .select('*')
        .eq('pepper_id', pepperId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion since we know the structure matches
      setResearch((data || []) as unknown as ResearchRecord[]);
    } catch (err) {
      console.error('Error fetching research:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch research data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const triggerResearch = useCallback(async (
    pepperId: string,
    pepperName: string,
    sources: string[] = ['firecrawl', 'perplexity']
  ): Promise<boolean> => {
    setIsResearching(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pepper-research`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ pepperId, pepperName, sources }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Research failed');
      }

      toast({
        title: 'Research Complete',
        description: result.message,
      });

      // Refresh research data
      await fetchResearch(pepperId);
      return true;
    } catch (err) {
      console.error('Error triggering research:', err);
      toast({
        title: 'Research Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsResearching(false);
    }
  }, [toast, fetchResearch]);

  const clearResearch = useCallback(() => {
    setResearch([]);
  }, []);

  return {
    research,
    isLoading,
    isResearching,
    fetchResearch,
    triggerResearch,
    clearResearch,
  };
}
