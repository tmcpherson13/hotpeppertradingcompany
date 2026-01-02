import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, Play, Pause, X, Search, Brain, Eye, Paintbrush, Stamp, 
  CheckCircle, AlertTriangle, Clock, TrendingUp, RefreshCw 
} from 'lucide-react';

interface EnrichmentJob {
  id: string;
  job_type: string;
  status: string;
  total_items: number;
  completed_items: number;
  current_pepper_id: string | null;
  current_pepper_name: string | null;
  current_step: string | null;
  started_at: string | null;
  estimated_completion: string | null;
  error_log: any;
  settings: any;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface EnrichmentDashboardProps {
  onRefresh?: () => void;
  onNavigate?: (target: 'pending' | 'auto-approved' | 'completed') => void;
}

const STEP_ICONS: Record<string, any> = {
  research: Search,
  synthesis: Brain,
  'image-analysis': Eye,
  'image-generation': Paintbrush,
  watermarking: Stamp,
};

const STEP_ORDER = ['research', 'synthesis', 'image-analysis', 'image-generation', 'watermarking'];

export function EnrichmentDashboard({ onRefresh, onNavigate }: EnrichmentDashboardProps) {
  const [activeJob, setActiveJob] = useState<EnrichmentJob | null>(null);
  const [recentJobs, setRecentJobs] = useState<EnrichmentJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    autoApproved: 0,
    errors: 0,
  });
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    try {
      // Get active job (not completed, failed, or cancelled)
      const { data: activeJobs, error: activeError } = await supabase
        .from('enrichment_jobs')
        .select('*')
        .in('status', ['queued', 'researching', 'synthesizing', 'generating-images'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (activeError) throw activeError;
      setActiveJob(activeJobs?.[0] || null);

      // Get recent jobs (last 10)
      const { data: recent, error: recentError } = await supabase
        .from('enrichment_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;
      setRecentJobs(recent || []);

      // Calculate stats from queue
      const { data: queueStats, error: queueError } = await supabase
        .from('pepper_enrichment_queue')
        .select('status, auto_approved');

      if (!queueError && queueStats) {
        setStats({
          completed: queueStats.filter(q => q.status === 'approved').length,
          pending: queueStats.filter(q => q.status === 'pending').length,
          autoApproved: queueStats.filter(q => q.auto_approved).length,
          errors: activeJob?.error_log?.length || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('enrichment-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrichment_jobs',
        },
        (payload) => {
          console.log('Job update:', payload);
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJobs]);

  const handlePauseResume = async () => {
    if (!activeJob) return;

    const newStatus = activeJob.status === 'paused' ? 'queued' : 'paused';
    
    const { error } = await supabase
      .from('enrichment_jobs')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', activeJob.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: newStatus === 'paused' ? 'Job Paused' : 'Job Resumed',
        description: newStatus === 'paused' 
          ? 'Enrichment job has been paused'
          : 'Enrichment job has been resumed',
      });
      fetchJobs();
    }
  };

  const handleCancel = async () => {
    if (!activeJob) return;

    const { error } = await supabase
      .from('enrichment_jobs')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', activeJob.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel job',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Job Cancelled',
        description: 'Enrichment job has been cancelled',
      });
      fetchJobs();
      onRefresh?.();
    }
  };

  const calculateETA = (job: EnrichmentJob) => {
    if (!job.started_at || job.completed_items === 0) return 'Calculating...';
    
    const startTime = new Date(job.started_at).getTime();
    const elapsed = Date.now() - startTime;
    const rate = job.completed_items / (elapsed / 60000); // items per minute
    const remaining = job.total_items - job.completed_items;
    const etaMinutes = remaining / rate;

    if (etaMinutes < 1) return 'Less than a minute';
    if (etaMinutes < 60) return `~${Math.round(etaMinutes)} minutes`;
    return `~${Math.round(etaMinutes / 60)} hours`;
  };

  const calculateSpeed = (job: EnrichmentJob) => {
    if (!job.started_at || job.completed_items === 0) return '—';
    
    const startTime = new Date(job.started_at).getTime();
    const elapsed = Date.now() - startTime;
    const rate = job.completed_items / (elapsed / 60000);
    return `${rate.toFixed(1)}/min`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      queued: { variant: 'outline', icon: Clock },
      researching: { variant: 'default', icon: Search },
      synthesizing: { variant: 'default', icon: Brain },
      'generating-images': { variant: 'default', icon: Paintbrush },
      completed: { variant: 'secondary', icon: CheckCircle },
      failed: { variant: 'destructive', icon: AlertTriangle },
      paused: { variant: 'outline', icon: Pause },
      cancelled: { variant: 'outline', icon: X },
    };

    const { variant, icon: Icon } = variants[status] || { variant: 'outline', icon: Clock };

    return (
      <Badge variant={variant} className="capitalize">
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const progress = activeJob 
    ? (activeJob.completed_items / Math.max(activeJob.total_items, 1)) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Active Job Monitor */}
      {activeJob ? (
        <Card className="bg-parchment border-primary/20 border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Enrichment In Progress
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseResume}
                >
                  {activeJob.status === 'paused' ? (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {Math.round(progress)}% Complete
                </span>
                <span className="text-ink/60">
                  {activeJob.completed_items} / {activeJob.total_items}
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Current Item */}
            {activeJob.current_pepper_name && (
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-ink/60 mb-1">Currently Processing</p>
                <p className="font-medium">{activeJob.current_pepper_name}</p>
              </div>
            )}

            {/* Step Indicator */}
            <div className="flex items-center justify-between py-2">
              {STEP_ORDER.map((step, index) => {
                const Icon = STEP_ICONS[step];
                const isActive = activeJob.current_step === step;
                const isPast = STEP_ORDER.indexOf(activeJob.current_step || '') > index;

                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                        ${isActive ? 'bg-primary border-primary text-primary-foreground' : ''}
                        ${isPast ? 'bg-green-100 border-green-500 text-green-700' : ''}
                        ${!isActive && !isPast ? 'bg-background border-ink/20 text-ink/40' : ''}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {index < STEP_ORDER.length - 1 && (
                      <div 
                        className={`w-8 h-0.5 mx-1 ${isPast ? 'bg-green-500' : 'bg-ink/10'}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-ink/50">
              <span>Research</span>
              <span>Synthesis</span>
              <span>Analysis</span>
              <span>Generate</span>
              <span>Watermark</span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-sm">
                <span className="text-ink/60">Speed:</span>
                <span className="ml-2 font-medium">{calculateSpeed(activeJob)}</span>
              </div>
              <div className="text-sm">
                <span className="text-ink/60">ETA:</span>
                <span className="ml-2 font-medium">{calculateETA(activeJob)}</span>
              </div>
            </div>

            {/* Error Log Preview */}
            {activeJob.error_log && activeJob.error_log.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-destructive mb-2">
                    Recent Errors ({activeJob.error_log.length})
                  </p>
                  <ScrollArea className="h-24">
                    <div className="space-y-1">
                      {activeJob.error_log.slice(-3).map((err: any, i: number) => (
                        <p key={i} className="text-xs text-ink/70 bg-destructive/5 p-2 rounded">
                          <span className="font-medium">{err.pepper_name}:</span> {err.error}
                        </p>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-parchment/50 border-ink/10">
          <CardContent className="py-8 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-ink/60">No active enrichment jobs</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => { fetchJobs(); onRefresh?.(); }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-3">
        <Card 
          className="bg-green-50 border-green-200 cursor-pointer hover:scale-102 hover:shadow-md transition-all"
          onClick={() => {
            toast({
              title: 'Completed Items',
              description: 'Approved enrichments are now live in the Compendium',
            });
          }}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            <p className="text-xs text-green-600">Completed</p>
          </CardContent>
        </Card>
        <Card 
          className="bg-amber-50 border-amber-200 cursor-pointer hover:scale-102 hover:shadow-md transition-all"
          onClick={() => onNavigate?.('pending')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
            <p className="text-xs text-amber-600">Pending Review</p>
          </CardContent>
        </Card>
        <Card 
          className="bg-blue-50 border-blue-200 cursor-pointer hover:scale-102 hover:shadow-md transition-all"
          onClick={() => onNavigate?.('auto-approved')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.autoApproved}</p>
            <p className="text-xs text-blue-600">Auto-Approved</p>
          </CardContent>
        </Card>
        <Card 
          className="bg-red-50 border-red-200 cursor-pointer hover:scale-102 hover:shadow-md transition-all"
          onClick={() => {
            if (activeJob?.error_log?.length > 0) {
              toast({
                title: `${stats.errors} Errors`,
                description: 'Check the error log in the active job above',
                variant: 'destructive',
              });
            }
          }}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-700">{stats.errors}</p>
            <p className="text-xs text-red-600">Errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card className="bg-parchment border-ink/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Recent Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-2 bg-background/50 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-3">
                    {getStatusBadge(job.status)}
                    <span className="text-ink/60">{formatDate(job.created_at)}</span>
                  </div>
                  <div className="text-right text-xs text-ink/50">
                    {job.completed_items}/{job.total_items} items
                    {job.error_log && job.error_log.length > 0 && (
                      <span className="ml-2 text-destructive">
                        ({job.error_log.length} errors)
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {recentJobs.length === 0 && (
                <p className="text-center text-ink/50 py-4">No job history</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
