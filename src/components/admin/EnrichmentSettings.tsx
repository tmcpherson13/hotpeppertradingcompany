import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Loader2, Zap, Calendar, Play, Image, Wand2, Bot } from 'lucide-react';

interface EnrichmentSettingsData {
  id: string;
  auto_approve_enabled: boolean;
  auto_approve_threshold: number;
  auto_rewrite_enabled: boolean;
  auto_publish_enabled: boolean;
  autorun_enabled: boolean;
  autorun_status: string;
  autorun_batch_size: number;
  autorun_last_tick: string | null;
  schedule_enabled: boolean;
  schedule_frequency: string;
  schedule_next_run: string | null;
  last_run_at: string | null;
  last_run_count: number;
}

interface EnrichmentSettingsProps {
  onSettingsChange?: () => void;
}

export function EnrichmentSettings({ onSettingsChange }: EnrichmentSettingsProps) {
  const [settings, setSettings] = useState<EnrichmentSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunningNow, setIsRunningNow] = useState(false);
  const [localImageGen, setLocalImageGen] = useState(false);
  const [progress, setProgress] = useState<{ enriched: number; total: number } | null>(null);
  const { toast } = useToast();

  // Autonomous-run progress: how much of the catalogue is populated.
  const fetchProgress = useCallback(async () => {
    try {
      const [{ count: total }, { count: enriched }] = await Promise.all([
        supabase.from('pepper_catalog').select('*', { count: 'exact', head: true }),
        supabase.from('pepper_overrides').select('*', { count: 'exact', head: true }).gt('enrichment_version', 0),
      ]);
      if (total !== null) setProgress({ enriched: enriched ?? 0, total });
    } catch (err) {
      console.error('Error fetching autorun progress:', err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('enrichment_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data as unknown as EnrichmentSettingsData);
        // Load image generation toggle from localStorage (not in DB yet)
        const savedImageGen = localStorage.getItem('enrichment_image_generation');
        setLocalImageGen(savedImageGen === 'true');
      }
    } catch (err) {
      console.error('Error fetching enrichment settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchProgress();
    // Poll progress while a run is active so the bar advances live.
    const t = setInterval(() => { fetchSettings(); fetchProgress(); }, 20000);
    return () => clearInterval(t);
  }, [fetchSettings, fetchProgress]);

  // Toggle the autonomous run. Enabling clears any stale lock and flips status
  // to running; the cron picks it up on its next tick.
  const toggleAutorun = useCallback(async (enabled: boolean) => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('enrichment_settings')
        .update({
          autorun_enabled: enabled,
          autorun_status: enabled ? 'running' : 'idle',
          autorun_locked_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);
      if (error) throw error;
      setSettings((prev) => prev ? { ...prev, autorun_enabled: enabled, autorun_status: enabled ? 'running' : 'idle' } : null);
      toast({
        title: enabled ? 'Autonomous run started' : 'Autonomous run paused',
        description: enabled
          ? 'The catalogue will populate on its own, a little at a time.'
          : 'The run will stop after the current pepper finishes.',
      });
    } catch (err) {
      console.error('Error toggling autorun:', err);
      toast({ title: 'Error', description: 'Failed to update autonomous run', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  }, [settings, toast]);

  // Only these columns are user-editable here; schedule_next_run / last_run_at
  // are written by the backend, and the image-generation toggle lives in
  // localStorage (not the DB) — so none of them belong in this update payload.
  const updateSettings = useCallback(async (
    updates: Partial<Pick<EnrichmentSettingsData,
      'auto_approve_enabled' | 'auto_approve_threshold' | 'auto_rewrite_enabled' | 'auto_publish_enabled' | 'schedule_enabled' | 'schedule_frequency'>>
  ) => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('enrichment_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      onSettingsChange?.();

      toast({
        title: 'Settings Updated',
        description: 'Enrichment settings have been saved',
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, toast, onSettingsChange]);

  const handleRunNow = useCallback(async () => {
    setIsRunningNow(true);
    try {
      const { data: session } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pepper-scheduled-enrichment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ force: true }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run scheduled enrichment');
      }

      toast({
        title: 'Enrichment Started',
        description: result.message,
      });

      // Refresh settings to get updated last_run info
      await fetchSettings();
      onSettingsChange?.();

    } catch (err) {
      console.error('Error running scheduled enrichment:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to run enrichment',
        variant: 'destructive',
      });
    } finally {
      setIsRunningNow(false);
    }
  }, [toast, fetchSettings, onSettingsChange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8 text-ink/50">
        No settings configured
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Auto-Approval Settings */}
      <Card className="bg-parchment border-ink/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-heading">
            <Zap className="w-4 h-4 text-amber-600" />
            Auto-Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-approve" className="text-sm font-medium">
                Enable Auto-Approval
              </Label>
              <p className="text-xs text-ink/60 mt-0.5">
                Automatically approve high-confidence enrichments
              </p>
            </div>
            <Switch
              id="auto-approve"
              checked={settings.auto_approve_enabled}
              onCheckedChange={(checked) => 
                updateSettings({ auto_approve_enabled: checked })
              }
              disabled={isSaving}
            />
          </div>

          {settings.auto_approve_enabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Confidence Threshold</Label>
                  <Badge variant="outline" className="text-xs">
                    {settings.auto_approve_threshold}%
                  </Badge>
                </div>
                <Slider
                  value={[settings.auto_approve_threshold]}
                  onValueCommit={([value]) => 
                    updateSettings({ auto_approve_threshold: value })
                  }
                  min={60}
                  max={95}
                  step={5}
                  className="py-2"
                  disabled={isSaving}
                />
                <p className="text-xs text-ink/50">
                  Higher thresholds require more research sources and complete content
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Fast-Populate (auto-rewrite + auto-publish) */}
      <Card className="bg-parchment border-ink/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-heading">
            <Wand2 className="w-4 h-4 text-purple-600" />
            Fast Populate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-rewrite" className="text-sm font-medium">
                Auto-Rewrite Copied Passages
              </Label>
              <p className="text-xs text-ink/60 mt-0.5">
                When the verifier flags wording that copies a source, rewrite it
                automatically (facts preserved) instead of waiting for a manual edit.
              </p>
            </div>
            <Switch
              id="auto-rewrite"
              checked={settings.auto_rewrite_enabled}
              onCheckedChange={(checked) =>
                updateSettings({ auto_rewrite_enabled: checked })
              }
              disabled={isSaving}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-publish" className="text-sm font-medium">
                Auto-Publish (Fast Populate)
              </Label>
              <p className="text-xs text-ink/60 mt-0.5">
                Once copying is cleared, publish straight to live content — bypassing
                the confidence threshold. Unsupported facts are logged for a later
                deep-analysis pass rather than blocking.
              </p>
            </div>
            <Switch
              id="auto-publish"
              checked={settings.auto_publish_enabled}
              onCheckedChange={(checked) =>
                updateSettings({ auto_publish_enabled: checked })
              }
              disabled={isSaving}
            />
          </div>

          {settings.auto_publish_enabled && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
              Fast-populate is ON. Enriched entries publish automatically after
              copying is rewritten away. Review facts later in the deep-analysis pass.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Autonomous Run */}
      <Card className="bg-parchment border-ink/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-heading">
            <Bot className="w-4 h-4 text-indigo-600" />
            Autonomous Run
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autorun" className="text-sm font-medium">
                Populate the whole catalogue
              </Label>
              <p className="text-xs text-ink/60 mt-0.5">
                Researches and enriches peppers one at a time, on a schedule, until the
                entire Compendium is filled — no manual triggering. Publishes live with
                auto-rewrite on; review facts later in the deep-analysis pass.
              </p>
            </div>
            <Switch
              id="autorun"
              checked={settings.autorun_enabled}
              onCheckedChange={toggleAutorun}
              disabled={isSaving}
            />
          </div>

          {settings.autorun_status === 'blocked_credits' && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              ⚠ Anthropic API credits exhausted — the run is paused. Add credits at
              console.anthropic.com (same org as the site's API key). It resumes
              automatically within ~2 minutes once credits are available.
            </div>
          )}

          {progress && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink/60">Enriched</span>
                <span className="font-medium text-ink">
                  {progress.enriched} / {progress.total}
                  {progress.total > 0 && (
                    <span className="text-ink/50 ml-1">
                      ({Math.round((progress.enriched / progress.total) * 100)}%)
                    </span>
                  )}
                </span>
              </div>
              <Progress value={progress.total ? (progress.enriched / progress.total) * 100 : 0} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-ink/50">Status</p>
              <p className="font-medium text-ink mt-0.5 capitalize">
                {settings.autorun_status === 'blocked_credits'
                  ? 'Paused · out of credits'
                  : settings.autorun_status}
                {settings.autorun_enabled && settings.autorun_status === 'running' && ' · working…'}
              </p>
            </div>
            <div>
              <p className="text-ink/50">Last activity</p>
              <p className="font-medium text-ink mt-0.5">{formatDate(settings.autorun_last_tick)}</p>
            </div>
          </div>

          <p className="text-xs text-ink/50">
            Runs about one pepper every couple of minutes; the full catalogue takes a
            few hours. Safe to close this tab — it runs on the server. Toggle off to pause.
          </p>
        </CardContent>
      </Card>

      {/* Image Generation Settings */}
      <Card className="bg-parchment border-ink/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-heading">
            <Image className="w-4 h-4 text-green-600" />
            AI Image Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="image-gen" className="text-sm font-medium">
                Generate Images During Enrichment
              </Label>
              <p className="text-xs text-ink/60 mt-0.5">
                Creates 3 AI images per pepper: botanical illustration, plant photo, individual pepper
              </p>
            </div>
            <Switch
              id="image-gen"
              checked={localImageGen}
              onCheckedChange={(checked) => {
                setLocalImageGen(checked);
                localStorage.setItem('enrichment_image_generation', String(checked));
                
                // Dispatch custom event for same-tab listeners
                window.dispatchEvent(new CustomEvent('enrichment-settings-changed', {
                  detail: { imageGeneration: checked }
                }));
                
                toast({
                  title: 'Settings Updated',
                  description: checked ? 'Image generation enabled' : 'Image generation disabled',
                });
              }}
            />
          </div>
          <p className="text-xs text-ink/50">
            Images will be watermarked and require admin approval before appearing in the compendium
          </p>
        </CardContent>
      </Card>

      {/* Schedule Settings */}
      <Card className="bg-parchment border-ink/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-heading">
            <Calendar className="w-4 h-4 text-blue-600" />
            Scheduled Enrichment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="schedule-enable" className="text-sm font-medium">
                Enable Scheduled Runs
              </Label>
              <p className="text-xs text-ink/60 mt-0.5">
                Automatically enrich peppers on a schedule
              </p>
            </div>
            <Switch
              id="schedule-enable"
              checked={settings.schedule_enabled}
              onCheckedChange={(checked) => 
                updateSettings({ schedule_enabled: checked })
              }
              disabled={isSaving}
            />
          </div>

          {settings.schedule_enabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm">Frequency</Label>
                <Select
                  value={settings.schedule_frequency}
                  onValueChange={(value) => 
                    updateSettings({ schedule_frequency: value })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-xs">
                  <p className="text-ink/50">Next Run</p>
                  <p className="font-medium text-ink mt-0.5">
                    {formatDate(settings.schedule_next_run)}
                  </p>
                </div>
                <div className="text-xs">
                  <p className="text-ink/50">Last Run</p>
                  <p className="font-medium text-ink mt-0.5">
                    {formatDate(settings.last_run_at)}
                    {settings.last_run_count > 0 && (
                      <span className="text-ink/50 ml-1">
                        ({settings.last_run_count} processed)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          <Button
            onClick={handleRunNow}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isRunningNow}
          >
            {isRunningNow ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Enrichment Now
              </>
            )}
          </Button>
          <p className="text-xs text-ink/50 text-center">
            Processes up to 5 peppers per run (in-stock prioritized)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
