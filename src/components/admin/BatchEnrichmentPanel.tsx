import { useState, useCallback } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperResearch } from '@/hooks/usePepperResearch';
import { usePepperEnrichment } from '@/hooks/usePepperEnrichment';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, CheckCircle, XCircle, AlertCircle, Pause } from 'lucide-react';

interface BatchEnrichmentPanelProps {
  selectedPeppers: Pepper[];
  onComplete: () => void;
}

type BatchStatus = 'idle' | 'researching' | 'synthesizing' | 'paused' | 'complete';
type ItemStatus = 'pending' | 'researching' | 'synthesizing' | 'complete' | 'error';

interface BatchItem {
  pepper: Pepper;
  status: ItemStatus;
  error?: string;
}

export function BatchEnrichmentPanel({ selectedPeppers, onComplete }: BatchEnrichmentPanelProps) {
  const [batchStatus, setBatchStatus] = useState<BatchStatus>('idle');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const { triggerResearch } = usePepperResearch();
  const { synthesize } = usePepperEnrichment();

  const progress = items.length > 0 
    ? (items.filter(i => i.status === 'complete' || i.status === 'error').length / items.length) * 100
    : 0;

  const startBatch = useCallback(async () => {
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
    setCurrentIndex(0);
    setBatchStatus('researching');
    setIsPaused(false);

    // Process each pepper
    for (let i = 0; i < batchItems.length; i++) {
      // Check if paused
      if (isPaused) {
        setBatchStatus('paused');
        return;
      }

      setCurrentIndex(i);
      const item = batchItems[i];

      // Update status to researching
      setItems(prev => prev.map((it, idx) => 
        idx === i ? { ...it, status: 'researching' } : it
      ));

      try {
        // Research phase
        const researchSuccess = await triggerResearch(item.pepper.id, item.pepper.name);
        
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

        // Synthesis phase
        const synthesisSuccess = await synthesize(item.pepper.id, item.pepper.name);

        if (!synthesisSuccess) {
          setItems(prev => prev.map((it, idx) => 
            idx === i ? { ...it, status: 'error', error: 'Synthesis failed' } : it
          ));
          continue;
        }

        // Mark complete
        setItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, status: 'complete' } : it
        ));

      } catch (err) {
        setItems(prev => prev.map((it, idx) => 
          idx === i ? { ...it, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' } : it
        ));
      }

      // Small delay between items to avoid rate limiting
      if (i < batchItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setBatchStatus('complete');
    toast({
      title: 'Batch Complete',
      description: `Processed ${batchItems.length} peppers`,
    });
    onComplete();
  }, [selectedPeppers, triggerResearch, synthesize, toast, onComplete, isPaused]);

  const pauseBatch = useCallback(() => {
    setIsPaused(true);
    setBatchStatus('paused');
  }, []);

  const resumeBatch = useCallback(() => {
    setIsPaused(false);
    // Resume from current index
    startBatch();
  }, [startBatch]);

  const getStatusIcon = (status: ItemStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'researching':
      case 'synthesizing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ink/30" />;
    }
  };

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-700 text-xs">Complete</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 text-xs">Error</Badge>;
      case 'researching':
        return <Badge className="bg-blue-100 text-blue-700 text-xs">Researching</Badge>;
      case 'synthesizing':
        return <Badge className="bg-purple-100 text-purple-700 text-xs">Synthesizing</Badge>;
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
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-ink">
              {selectedPeppers.length} pepper{selectedPeppers.length !== 1 ? 's' : ''} selected
            </p>
            {batchStatus !== 'idle' && (
              <p className="text-xs text-ink/60 mt-1">
                {items.filter(i => i.status === 'complete').length} complete, 
                {' '}{items.filter(i => i.status === 'error').length} errors
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {batchStatus === 'idle' && (
              <Button onClick={startBatch} size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start Batch
              </Button>
            )}
            {(batchStatus === 'researching' || batchStatus === 'synthesizing') && (
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
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {batchStatus === 'idle' ? (
            // Show selected peppers before starting
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
            // Show processing status
            items.map((item, idx) => (
              <div
                key={item.pepper.id}
                className={`flex items-center gap-3 p-3 border rounded-lg ${
                  idx === currentIndex && batchStatus !== 'complete'
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
                {getStatusBadge(item.status)}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
