import { useState, useEffect, useCallback, useRef } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperResearch } from '@/hooks/usePepperResearch';
import { usePepperEnrichment } from '@/hooks/usePepperEnrichment';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, CheckCircle, XCircle, AlertCircle, Pause, Zap, Clock, Image, Sparkles } from 'lucide-react';

interface BatchEnrichmentPanelProps {
  selectedPeppers: Pepper[];
  onComplete: () => void;
}

type BatchMode = 'full_enrichment' | 'images_only';
type BatchStatus = 'idle' | 'researching' | 'synthesizing' | 'generating_images' | 'paused' | 'complete' | 'rate_limited';
type ItemStatus = 'pending' | 'researching' | 'synthesizing' | 'generating_images' | 'complete' | 'error' | 'auto_approved';

interface BatchItem {
  pepper: Pepper;
  status: ItemStatus;
  error?: string;
  confidenceScore?: number;
  imageCount?: number;
}

const STORAGE_KEY = 'pepper_batch_progress';

interface StoredProgress {
  pepperIds: string[];
  completedIds: string[];
  currentIndex: number;
  timestamp: number;
}

export function BatchEnrichmentPanel({ selectedPeppers, onComplete }: BatchEnrichmentPanelProps) {
  const [batchMode, setBatchMode] = useState<BatchMode>('full_enrichment');
  const [batchStatus, setBatchStatus] = useState<BatchStatus>('idle');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [generateImages, setGenerateImages] = useState(() => {
    return localStorage.getItem('enrichment_image_generation') === 'true';
  });
  const isPausedRef = useRef(false);
  const { toast } = useToast();

  const { triggerResearch } = usePepperResearch();
  const { synthesize } = usePepperEnrichment();
  const { generateImages: generatePepperImages } = useImageGeneration();

  const progress = items.length > 0 
    ? (items.filter(i => ['complete', 'error', 'auto_approved'].includes(i.status)).length / items.length) * 100
    : 0;

  const completedCount = items.filter(i => i.status === 'complete' || i.status === 'auto_approved').length;
  const autoApprovedCount = items.filter(i => i.status === 'auto_approved').length;
  const errorCount = items.filter(i => i.status === 'error').length;
  const totalImagesGenerated = items.reduce((sum, i) => sum + (i.imageCount || 0), 0);

  // Listen for image generation setting changes (same-tab custom event)
  useEffect(() => {
    const handleSettingsChange = (e: CustomEvent<{ imageGeneration: boolean }>) => {
      setGenerateImages(e.detail.imageGeneration);
    };
    
    window.addEventListener('enrichment-settings-changed', handleSettingsChange as EventListener);
    return () => window.removeEventListener('enrichment-settings-changed', handleSettingsChange as EventListener);
  }, []);

  // Listen for localStorage changes (cross-tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'enrichment_image_generation') {
        setGenerateImages(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setInterval(() => {
        setCooldownSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownSeconds]);

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress: StoredProgress = JSON.parse(saved);
        if (Date.now() - progress.timestamp < 3600000) {
          console.log('Found saved batch progress:', progress);
        }
      }
    } catch (err) {
      console.error('Error loading saved progress:', err);
    }
  }, []);

  const saveProgress = useCallback((completedIds: string[], index: number) => {
    try {
      const progress: StoredProgress = {
        pepperIds: selectedPeppers.map(p => p.id),
        completedIds,
        currentIndex: index,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, [selectedPeppers]);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const startBatch = useCallback(async (resumeFromIndex = 0) => {
    if (selectedPeppers.length === 0) {
      toast({
        title: 'No Peppers Selected',
        description: 'Please select at least one pepper to process',
        variant: 'destructive',
      });
      return;
    }

    // Initialize batch items
    const batchItems: BatchItem[] = selectedPeppers.map(pepper => ({
      pepper,
      status: 'pending',
    }));
    setItems(batchItems);
    setCurrentIndex(resumeFromIndex);
    setBatchStatus(batchMode === 'images_only' ? 'generating_images' : 'researching');
    isPausedRef.current = false;
    setRetryCount(0);

    const completedIds: string[] = [];

    // Process each pepper
    for (let i = resumeFromIndex; i < batchItems.length; i++) {
      // Check if paused
      if (isPausedRef.current) {
        setBatchStatus('paused');
        saveProgress(completedIds, i);
        return;
      }

      setCurrentIndex(i);
      const item = batchItems[i];

      try {
        if (batchMode === 'images_only') {
          // Images only mode - just generate images
          setItems(prev => prev.map((it, idx) => 
            idx === i ? { ...it, status: 'generating_images' } : it
          ));

          const success = await generatePepperImages(item.pepper.id, item.pepper.name);

          if (!success) {
            setItems(prev => prev.map((it, idx) => 
              idx === i ? { ...it, status: 'error', error: 'Image generation failed' } : it
            ));
            continue;
          }

          completedIds.push(item.pepper.id);
          setItems(prev => prev.map((it, idx) => 
            idx === i ? { ...it, status: 'complete', imageCount: 3 } : it
          ));

        } else {
          // Full enrichment mode
          setItems(prev => prev.map((it, idx) => 
            idx === i ? { ...it, status: 'researching' } : it
          ));

          // Research phase - include wikimedia for images
          const researchSuccess = await triggerResearch(item.pepper.id, item.pepper.name, ['firecrawl', 'perplexity', 'wikimedia']);
          
          if (!researchSuccess) {
            setItems(prev => prev.map((it, idx) => 
              idx === i ? { ...it, status: 'error', error: 'Research failed' } : it
            ));
            continue;
          }

          // Update status to synthesizing
          setItems(prev => prev.map((it, idx) => 
            idx === i ? { ...it, status: 'synthesizing' } : it
          ));
          setBatchStatus('synthesizing');

          // Synthesis phase - pass image generation flag
          const synthesisSuccess = await synthesize(item.pepper.id, item.pepper.name, generateImages);

          if (!synthesisSuccess) {
            setItems(prev => prev.map((it, idx) => 
              idx === i ? { ...it, status: 'error', error: 'Synthesis failed' } : it
            ));
            continue;
          }

          completedIds.push(item.pepper.id);
          setItems(prev => prev.map((it, idx) => 
            idx === i ? { ...it, status: 'complete' } : it
          ));
        }

        // Reset retry count on success
        setRetryCount(0);

      } catch (err: any) {
        // Check for rate limit error
        if (err?.message?.includes('429') || err?.message?.includes('rate limit')) {
          setBatchStatus('rate_limited');
          const waitTime = Math.min(30 * Math.pow(2, retryCount), 300);
          setCooldownSeconds(waitTime);
          setRetryCount(prev => prev + 1);
          
          toast({
            title: 'Rate Limited',
            description: `Pausing for ${waitTime} seconds before retry`,
            variant: 'destructive',
          });

          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          i--;
          setBatchStatus(batchMode === 'images_only' ? 'generating_images' : 'researching');
          continue;
        }

        setItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' } : it
        ));
      }

      // Save progress periodically
      if (i % 3 === 0) {
        saveProgress(completedIds, i + 1);
      }

      // Delay between items to avoid rate limiting
      if (i < batchItems.length - 1 && !isPausedRef.current) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setBatchStatus('complete');
    clearProgress();
    
    const message = batchMode === 'images_only'
      ? `Generated images for ${completedIds.length} peppers`
      : `Processed ${completedIds.length} peppers (${autoApprovedCount} auto-approved)`;
    
    toast({
      title: 'Batch Complete',
      description: message,
    });
    onComplete();
  }, [selectedPeppers, batchMode, triggerResearch, synthesize, generatePepperImages, generateImages, toast, onComplete, saveProgress, clearProgress, autoApprovedCount, retryCount]);

  const pauseBatch = useCallback(() => {
    isPausedRef.current = true;
    setBatchStatus('paused');
  }, []);

  const resumeBatch = useCallback(() => {
    isPausedRef.current = false;
    startBatch(currentIndex);
  }, [startBatch, currentIndex]);

  const getStatusIcon = (status: ItemStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'auto_approved':
        return <Zap className="w-4 h-4 text-purple-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'researching':
      case 'synthesizing':
      case 'generating_images':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ink/30" />;
    }
  };

  const getStatusBadge = (status: ItemStatus, imageCount?: number) => {
    switch (status) {
      case 'complete':
        if (imageCount) {
          return <Badge className="bg-green-100 text-green-700 text-xs">{imageCount} images</Badge>;
        }
        return <Badge className="bg-green-100 text-green-700 text-xs">Complete</Badge>;
      case 'auto_approved':
        return <Badge className="bg-purple-100 text-purple-700 text-xs">Auto-Approved</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 text-xs">Error</Badge>;
      case 'researching':
        return <Badge className="bg-blue-100 text-blue-700 text-xs">Researching</Badge>;
      case 'synthesizing':
        return <Badge className="bg-purple-100 text-purple-700 text-xs">Synthesizing</Badge>;
      case 'generating_images':
        return <Badge className="bg-indigo-100 text-indigo-700 text-xs">Generating</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
    }
  };

  if (selectedPeppers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-ink/40 p-8">
        <p className="text-sm text-center">
          Select peppers from the catalog to process them in batch.
          <br />
          Use the checkboxes to select multiple peppers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-ink/10">
        {/* Mode selector */}
        {batchStatus === 'idle' && (
          <div className="mb-4">
            <p className="text-xs text-ink/60 mb-2">Processing Mode</p>
            <Tabs value={batchMode} onValueChange={(v) => setBatchMode(v as BatchMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="full_enrichment" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Full Enrichment
                </TabsTrigger>
                <TabsTrigger value="images_only" className="text-xs">
                  <Image className="w-3 h-3 mr-1" />
                  Images Only
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-ink">
              {selectedPeppers.length} pepper{selectedPeppers.length !== 1 ? 's' : ''} selected
            </p>
            {batchStatus !== 'idle' && (
              <p className="text-xs text-ink/60 mt-1">
                {completedCount} complete
                {batchMode === 'images_only' && totalImagesGenerated > 0 && ` • ${totalImagesGenerated} images`}
                {autoApprovedCount > 0 && ` (${autoApprovedCount} auto)`}
                , {errorCount} errors
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {batchStatus === 'idle' && (
              <>
                {batchMode === 'full_enrichment' && generateImages && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <Image className="w-3 h-3 mr-1" />
                    Images On
                  </Badge>
                )}
                <Button onClick={() => startBatch(0)} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Start {batchMode === 'images_only' ? 'Images' : 'Batch'}
                </Button>
              </>
            )}
            {['researching', 'synthesizing', 'generating_images'].includes(batchStatus) && (
              <Button onClick={pauseBatch} variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            {batchStatus === 'paused' && (
              <Button onClick={resumeBatch} size="sm">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            {batchStatus === 'rate_limited' && (
              <Button disabled size="sm" variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Cooldown: {cooldownSeconds}s
              </Button>
            )}
          </div>
        </div>

        {batchStatus !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-ink/60">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {batchStatus === 'rate_limited' && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
            Rate limit reached. Automatically resuming in {cooldownSeconds} seconds...
          </div>
        )}
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {batchStatus === 'idle' ? (
            selectedPeppers.map(pepper => (
              <div
                key={pepper.id}
                className="flex items-center gap-3 p-3 border border-ink/10 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-ink/30" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{pepper.name}</p>
                  <p className="text-xs text-ink/50">{pepper.origin}</p>
                </div>
                <Badge variant="outline" className="text-xs">Ready</Badge>
              </div>
            ))
          ) : (
            items.map((item, idx) => (
              <div
                key={item.pepper.id}
                className={`flex items-center gap-3 p-3 border rounded-lg ${
                  idx === currentIndex && !['complete', 'paused', 'rate_limited'].includes(batchStatus)
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-ink/10'
                }`}
              >
                {getStatusIcon(item.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{item.pepper.name}</p>
                  {item.error ? (
                    <p className="text-xs text-red-600">{item.error}</p>
                  ) : (
                    <p className="text-xs text-ink/50">{item.pepper.origin}</p>
                  )}
                </div>
                {getStatusBadge(item.status, item.imageCount)}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Summary when complete */}
      {batchStatus === 'complete' && (
        <div className="p-4 border-t border-ink/10 bg-green-50">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-700">Batch Complete</p>
            <p className="text-xs text-green-600 mt-1">
              {completedCount} {batchMode === 'images_only' ? 'processed' : 'enriched'}
              {batchMode === 'images_only' && totalImagesGenerated > 0 && ` • ${totalImagesGenerated} images`}
              {autoApprovedCount > 0 && ` • ${autoApprovedCount} auto-approved`}
              {errorCount > 0 && ` • ${errorCount} errors`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
