import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Image, Calendar, TrendingUp } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalImages: number;
  imagesThisWeek: number;
  activeContributors: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalImages: 0,
    imagesThisWeek: 0,
    activeContributors: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total images
        const { count: imageCount } = await supabase
          .from('user_uploaded_images')
          .select('*', { count: 'exact', head: true });

        // Get images uploaded this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const { count: weeklyCount } = await supabase
          .from('user_uploaded_images')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());

        // Get unique contributors
        const { data: contributors } = await supabase
          .from('user_uploaded_images')
          .select('user_id');
        const uniqueContributors = new Set(contributors?.map(c => c.user_id)).size;

        setStats({
          totalUsers: userCount || 0,
          totalImages: imageCount || 0,
          imagesThisWeek: weeklyCount || 0,
          activeContributors: uniqueContributors,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-tyrian' },
    { label: 'Total Uploads', value: stats.totalImages, icon: Image, color: 'text-spice-600' },
    { label: 'This Week', value: stats.imagesThisWeek, icon: Calendar, color: 'text-ocean' },
    { label: 'Contributors', value: stats.activeContributors, icon: TrendingUp, color: 'text-ink' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-parchment-dark/30 border border-ink/20 p-4 animate-pulse">
            <div className="h-4 bg-ink/10 rounded w-20 mb-2" />
            <div className="h-8 bg-ink/10 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-parchment-dark/30 border border-ink/20 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="font-heading text-xs uppercase tracking-wider text-ink/60">
              {stat.label}
            </span>
          </div>
          <p className="font-display text-2xl text-ink">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}