import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, CheckCircle, Search, Zap, Calendar } from 'lucide-react';

interface EnrichmentStatsData {
  totalPeppers: number;
  enrichedCount: number;
  pendingCount: number;
  researchedCount: number;
  autoApprovedCount: number;
  inStockCount: number;
}

interface EnrichmentStatsProps {
  refreshKey?: number;
}

export function EnrichmentStats({ refreshKey }: EnrichmentStatsProps) {
  const [stats, setStats] = useState<EnrichmentStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total pepper count from static data
        const { peppers } = await import('@/data/peppers');
        const totalPeppers = peppers.length;
        const inStockCount = peppers.filter(p => p.inStock).length;

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

        // Get auto-approved count
        const { data: autoApprovedData } = await supabase
          .from('pepper_enrichment_queue')
          .select('pepper_id')
          .eq('auto_approved', true);

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
          autoApprovedCount: autoApprovedData?.length || 0,
          inStockCount,
        });
      } catch (err) {
        console.error('Error fetching enrichment stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [refreshKey]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      icon: BookOpen,
      label: 'Total',
      value: stats.totalPeppers,
      color: 'text-ink',
    },
    {
      icon: Calendar,
      label: 'In Stock',
      value: stats.inStockCount,
      color: 'text-indigo-600',
    },
    {
      icon: Search,
      label: 'Researched',
      value: stats.researchedCount,
      color: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pendingCount,
      color: 'text-amber-600',
    },
    {
      icon: CheckCircle,
      label: 'Enriched',
      value: stats.enrichedCount,
      color: 'text-green-600',
    },
    {
      icon: Zap,
      label: 'Auto-Approved',
      value: stats.autoApprovedCount,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {statItems.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="bg-parchment-dark/20 border-ink/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <div>
                <p className="text-[10px] text-ink/60 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-display text-ink">{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
