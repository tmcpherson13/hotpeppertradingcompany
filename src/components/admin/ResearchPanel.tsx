import { useState, useEffect, useCallback } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperResearch, ResearchRecord } from '@/hooks/usePepperResearch';
import { usePepperEnrichment } from '@/hooks/usePepperEnrichment';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Sparkles, ExternalLink, ChevronDown, Image, CheckCircle } from 'lucide-react';

type EnrichmentStep = 'idle' | 'researching' | 'synthesizing' | 'complete' | 'error';

interface ResearchPanelProps {
  pepper: Pepper;
  onSynthesisComplete: () => void;
}

export function ResearchPanel({ pepper, onSynthesisComplete }: ResearchPanelProps) {
  const {
    research,
    isLoading,
    isResearching,
    fetchResearch,
    triggerResearch,
  } = usePepperResearch();

  const { isSynthesizing, synthesize } = usePepperEnrichment();
  const { isGenerating, generateImages } = useImageGeneration();

  const [enrichmentStep, setEnrichmentStep] = useState<EnrichmentStep>('idle');
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [generateImagesFlag, setGenerateImagesFlag] = useState(() => {
    return localStorage.getItem('enrichment_image_generation') === 'true';
  });

  // Load research on pepper change
  useEffect(() => {
    fetchResearch(pepper.id);
  }, [pepper.id, fetchResearch]);

  // Listen for image generation setting changes
  useEffect(() => {
    const handleSettingsChange = (e: CustomEvent<{ imageGeneration: boolean }>) => {
      setGenerateImagesFlag(e.detail.imageGeneration);
    };
    
    window.addEventListener('enrichment-settings-changed', handleSettingsChange as EventListener);
    return () => window.removeEventListener('enrichment-settings-changed', handleSettingsChange as EventListener);
  }, []);

  // Listen for localStorage changes (cross-tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'enrichment_image_generation') {
        setGenerateImagesFlag(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleEnrichPepper = useCallback(async () => {
    setEnrichmentStep('researching');

    try {
      // Step 1: Trigger research (Firecrawl + Perplexity + Wikimedia)
      const researchSuccess = await triggerResearch(
        pepper.id, 
        pepper.name, 
        ['firecrawl', 'perplexity', 'wikimedia']
      );

      if (!researchSuccess) {
        setEnrichmentStep('error');
        return;
      }

      // Step 2: Automatically synthesize
      setEnrichmentStep('synthesizing');
      const synthesisSuccess = await synthesize(
        pepper.id, 
        pepper.name, 
        generateImagesFlag
      );

      if (!synthesisSuccess) {
        setEnrichmentStep('error');
        return;
      }

      setEnrichmentStep('complete');
      onSynthesisComplete();
    } catch (err) {
      console.error('Enrichment error:', err);
      setEnrichmentStep('error');
    }
  }, [pepper.id, pepper.name, triggerResearch, synthesize, generateImagesFlag, onSynthesisComplete]);

  const handleGenerateImages = useCallback(async () => {
    await generateImages(pepper.id, pepper.name);
  }, [pepper.id, pepper.name, generateImages]);

  const isProcessing = enrichmentStep === 'researching' || enrichmentStep === 'synthesizing' || isResearching || isSynthesizing;

  const getStatusMessage = () => {
    if (isResearching || enrichmentStep === 'researching') return 'Researching sources...';
    if (isSynthesizing || enrichmentStep === 'synthesizing') return 'Synthesizing with AI...';
    if (enrichmentStep === 'complete') return 'Enrichment complete';
    if (enrichmentStep === 'error') return 'An error occurred';
    if (research.length > 0) return `${research.length} research source${research.length !== 1 ? 's' : ''} available`;
    return 'Ready to enrich';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Pepper Header */}
      <div className="p-4 border-b border-ink/10">
        <h3 className="font-display text-xl uppercase tracking-wide text-ink">
          {pepper.name}
        </h3>
        <p className="text-sm text-ink/60 mt-1">{pepper.origin}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {pepper.scovilleMin.toLocaleString()} - {pepper.scovilleMax.toLocaleString()} SHU
          </Badge>
          <Badge variant="outline" className="text-xs">
            {pepper.species}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-ink/10 space-y-3">
        {/* Primary action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleEnrichPepper}
            disabled={isProcessing || isGenerating}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {enrichmentStep === 'researching' ? 'Researching...' : 'Synthesizing...'}
              </>
            ) : enrichmentStep === 'complete' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Re-Enrich
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enrich Pepper
              </>
            )}
          </Button>
          <Button
            onClick={handleGenerateImages}
            disabled={isProcessing || isGenerating}
            variant="outline"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Image className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status indicator */}
        <div className={`text-xs flex items-center gap-2 ${
          enrichmentStep === 'error' ? 'text-red-600' :
          enrichmentStep === 'complete' ? 'text-green-600' :
          'text-ink/60'
        }`}>
          {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
          {enrichmentStep === 'complete' && <CheckCircle className="w-3 h-3" />}
          {getStatusMessage()}
        </div>

        {/* Image generation badge */}
        {generateImagesFlag && (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            <Image className="w-3 h-3 mr-1" />
            AI Images enabled
          </Badge>
        )}
      </div>

      {/* Collapsible Research Data */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Collapsible open={isResearchOpen} onOpenChange={setIsResearchOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-parchment-dark/20 rounded transition-colors">
              <span className="text-sm font-medium text-ink/70">
                View Research Data ({research.length} source{research.length !== 1 ? 's' : ''})
              </span>
              <ChevronDown className={`w-4 h-4 text-ink/40 transition-transform ${isResearchOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-2">
              {isLoading ? (
                <div className="text-center py-4 text-ink/50 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Loading research...
                </div>
              ) : research.length === 0 ? (
                <p className="text-sm text-ink/50 text-center py-4">
                  No research data yet. Click "Enrich Pepper" to gather information.
                </p>
              ) : (
                research.map((record) => (
                  <ResearchCard key={record.id} record={record} />
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}

function ResearchCard({ record }: { record: ResearchRecord }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-ink/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 text-left hover:bg-parchment-dark/20 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                record.source_type === 'perplexity'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : record.source_type === 'wikimedia_images'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}
            >
              {record.source_type === 'perplexity' ? 'Perplexity AI' : 
               record.source_type === 'wikimedia_images' ? 'Wikimedia' : 'Firecrawl'}
            </Badge>
            <span className="text-xs text-ink/50">
              {new Date(record.created_at).toLocaleDateString()}
            </span>
          </div>
          <span className="text-xs text-ink/40">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="p-3 border-t border-ink/10 bg-parchment-dark/10">
          {record.urls && record.urls.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-ink/70 mb-1">Sources:</p>
              <div className="flex flex-wrap gap-1">
                {record.urls.slice(0, 5).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {new URL(url).hostname}
                  </a>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-2" />

          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-xs text-ink/70 font-body max-h-64 overflow-y-auto">
              {record.raw_content?.slice(0, 2000)}
              {(record.raw_content?.length || 0) > 2000 && '...'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
