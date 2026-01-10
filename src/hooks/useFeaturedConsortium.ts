import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedConsortium {
  id: string;
  consortium_index: number;
  last_rotated_at: string;
  updated_at: string;
}

export function useFeaturedConsortium() {
  return useQuery({
    queryKey: ['featured-consortium'],
    queryFn: async (): Promise<FeaturedConsortium | null> => {
      const { data, error } = await supabase
        .from('featured_consortium')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching featured consortium:', error);
        return null;
      }

      return data as FeaturedConsortium;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Helper to calculate days until next rotation (Sunday midnight)
export function getDaysUntilNextRotation(): number {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  return daysUntilSunday;
}

// Helper to get next rotation date
export function getNextRotationDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  
  const nextSunday = new Date(now);
  nextSunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
  nextSunday.setUTCHours(0, 0, 0, 0);
  
  return nextSunday;
}
