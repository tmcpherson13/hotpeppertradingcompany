import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, CheckCircle, Search } from 'lucide-react';

interface EnrichmentStatsData {
  totalPeppers: number;
  enrichedCount: number;
  pendingCount: number;
  researchedCount: number;
}

export function EnrichmentStats() {
  const [stats, setStats] = useState<EnrichmentStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total pepper count from static data
        const { peppers } = await import('@/data/peppers');
        const totalPeppers = peppers.length;

        // Get enriched count (overrides with enrichment_version > 0)
        const { data: enrichedData } = await supabase
          .from('pepper_overrides')
          .select('pepper_id')
          .gt('enrichment_version', 0);

        // Get pending count
        const { data: pendingData } = await supabase
          .from('pepper_enrichment_queue')
          .select('pepper_id')
          .eq('status', 'pending');

        // Get researched count (unique peppers with research)
        const { data: researchData } = await supabase
          .from('pepper_research')
          .select('pepper_id');

        const uniqueResearched = new Set(researchData?.map((r: any) => r.pepper_id) || []);

        setStats({
          totalPeppers,
          enrichedCount: enrichedData?.length || 0,
          pendingCount: pendingData?.length || 0,
          researchedCount: uniqueResearched.size,
        });
      } catch (err) {
        console.error('Error fetching enrichment stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      icon: BookOpen,
      label: 'Total Peppers',
      value: stats.totalPeppers,
      color: 'text-ink',
    },
    {
      icon: Search,
      label: 'Researched',
      value: stats.researchedCount,
      color: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Pending Review',
      value: stats.pendingCount,
      color: 'text-amber-600',
    },
    {
      icon: CheckCircle,
      label: 'Enriched',
      value: stats.enrichedCount,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="bg-parchment-dark/20 border-ink/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <p className="text-xs text-ink/60 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-display text-ink">{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
