import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PepperOverride {
  id: string;
  pepper_id: string;
  description: string | null;
  historical_notes: string | null;
  trade_route: string | null;
  origin: string | null;
  heat_level: string | null;
  scoville_min: number | null;
  scoville_max: number | null;
  updated_at: string | null;
  updated_by: string | null;
}

interface UsePepperOverridesResult {
  overrides: Map<string, PepperOverride>;
  isLoading: boolean;
  getOverride: (pepperId: string) => PepperOverride | undefined;
  saveOverride: (pepperId: string, fields: Partial<Pick<PepperOverride, 'description' | 'historical_notes' | 'trade_route' | 'origin' | 'heat_level' | 'scoville_min' | 'scoville_max'>>) => Promise<boolean>;
  isSaving: boolean;
}

export function usePepperOverrides(): UsePepperOverridesResult {
  const [overrides, setOverrides] = useState<Map<string, PepperOverride>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOverrides = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pepper_overrides')
        .select('*');

      if (error) {
        console.error('Error fetching pepper overrides:', error);
      } else if (data) {
        const map = new Map<string, PepperOverride>();
        data.forEach((override) => {
          map.set(override.pepper_id, override as PepperOverride);
        });
        setOverrides(map);
      }
      setIsLoading(false);
    };

    fetchOverrides();
  }, []);

  const getOverride = useCallback((pepperId: string) => {
    return overrides.get(pepperId);
  }, [overrides]);

  const saveOverride = useCallback(async (
    pepperId: string,
    fields: Partial<Pick<PepperOverride, 'description' | 'historical_notes' | 'trade_route' | 'origin' | 'heat_level' | 'scoville_min' | 'scoville_max'>>
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to edit');
      return false;
    }

    setIsSaving(true);
    
    const existing = overrides.get(pepperId);
    
    try {
      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('pepper_overrides')
          .update({
            ...fields,
            updated_at: new Date().toISOString(),
            updated_by: user.id,
          })
          .eq('pepper_id', pepperId);

        if (error) throw error;

        // Update local state
        setOverrides((prev) => {
          const newMap = new Map(prev);
          newMap.set(pepperId, {
            ...existing,
            ...fields,
            updated_at: new Date().toISOString(),
            updated_by: user.id,
          });
          return newMap;
        });
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('pepper_overrides')
          .insert({
            pepper_id: pepperId,
            ...fields,
            updated_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setOverrides((prev) => {
          const newMap = new Map(prev);
          newMap.set(pepperId, data as PepperOverride);
          return newMap;
        });
      }

      toast.success('Content saved');
      return true;
    } catch (error) {
      console.error('Error saving pepper override:', error);
      toast.error('Failed to save changes');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, overrides]);

  return {
    overrides,
    isLoading,
    getOverride,
    saveOverride,
    isSaving,
  };
}
