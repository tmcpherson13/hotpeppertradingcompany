import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type EnrichmentState = 'none' | 'pending' | 'enriched';
export type ImageState = 'none' | 'pending' | 'has_images';

export interface PepperEnrichmentStatus {
  enrichmentStatus: EnrichmentState;
  imageStatus: ImageState;
}

interface UseEnrichmentStatusResult {
  statusMap: Map<string, PepperEnrichmentStatus>;
  isLoading: boolean;
  getStatus: (pepperId: string) => PepperEnrichmentStatus;
  refresh: () => Promise<void>;
}

const DEFAULT_STATUS: PepperEnrichmentStatus = {
  enrichmentStatus: 'none',
  imageStatus: 'none',
};

export function useEnrichmentStatus(): UseEnrichmentStatusResult {
  const [statusMap, setStatusMap] = useState<Map<string, PepperEnrichmentStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatuses = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [overridesRes, queueRes, imagesRes] = await Promise.all([
        supabase.from('pepper_overrides').select('pepper_id, enrichment_version'),
        supabase.from('pepper_enrichment_queue').select('pepper_id, status'),
        supabase.from('pepper_image_proposals').select('pepper_id, status'),
      ]);

      const newMap = new Map<string, PepperEnrichmentStatus>();

      // Process overrides (enriched peppers)
      const enrichedPepperIds = new Set<string>();
      if (overridesRes.data) {
        for (const row of overridesRes.data) {
          if (row.enrichment_version && row.enrichment_version > 0) {
            enrichedPepperIds.add(row.pepper_id);
          }
        }
      }

      // Process enrichment queue (pending reviews)
      const pendingPepperIds = new Set<string>();
      if (queueRes.data) {
        for (const row of queueRes.data) {
          if (row.status === 'pending') {
            pendingPepperIds.add(row.pepper_id);
          }
        }
      }

      // Process image proposals
      const imagePendingIds = new Set<string>();
      const imageApprovedIds = new Set<string>();
      if (imagesRes.data) {
        for (const row of imagesRes.data) {
          if (row.status === 'pending') {
            imagePendingIds.add(row.pepper_id);
          } else if (row.status === 'approved') {
            imageApprovedIds.add(row.pepper_id);
          }
        }
      }

      // Collect all unique pepper IDs
      const allPepperIds = new Set([
        ...enrichedPepperIds,
        ...pendingPepperIds,
        ...imagePendingIds,
        ...imageApprovedIds,
      ]);

      // Build status for each pepper
      for (const pepperId of allPepperIds) {
        let enrichmentStatus: EnrichmentState = 'none';
        let imageStatus: ImageState = 'none';

        // Determine enrichment status (pending takes priority over enriched for visibility)
        if (pendingPepperIds.has(pepperId)) {
          enrichmentStatus = 'pending';
        } else if (enrichedPepperIds.has(pepperId)) {
          enrichmentStatus = 'enriched';
        }

        // Determine image status (pending takes priority over approved for visibility)
        if (imagePendingIds.has(pepperId)) {
          imageStatus = 'pending';
        } else if (imageApprovedIds.has(pepperId)) {
          imageStatus = 'has_images';
        }

        newMap.set(pepperId, { enrichmentStatus, imageStatus });
      }

      setStatusMap(newMap);
    } catch (error) {
      console.error('Failed to fetch enrichment statuses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const getStatus = useCallback(
    (pepperId: string): PepperEnrichmentStatus => {
      return statusMap.get(pepperId) || DEFAULT_STATUS;
    },
    [statusMap]
  );

  return useMemo(
    () => ({
      statusMap,
      isLoading,
      getStatus,
      refresh: fetchStatuses,
    }),
    [statusMap, isLoading, getStatus, fetchStatuses]
  );
}
