import { useState } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperResearch, ResearchRecord } from '@/hooks/usePepperResearch';
import { usePepperEnrichment } from '@/hooks/usePepperEnrichment';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

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

  const [hasLoadedResearch, setHasLoadedResearch] = useState(false);

  const handleLoadResearch = async () => {
    await fetchResearch(pepper.id);
    setHasLoadedResearch(true);
  };

  const handleTriggerResearch = async () => {
    const success = await triggerResearch(pepper.id, pepper.name);
    if (success) {
      setHasLoadedResearch(true);
    }
  };

  const handleSynthesize = async () => {
    const success = await synthesize(pepper.id, pepper.name);
    if (success) {
      onSynthesisComplete();
    }
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
      <div className="p-4 border-b border-ink/10 space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={handleTriggerResearch}
            disabled={isResearching}
            className="flex-1"
            variant="outline"
          >
            {isResearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Research Web
              </>
            )}
          </Button>
          {hasLoadedResearch && (
            <Button
              onClick={handleLoadResearch}
              disabled={isLoading}
              variant="ghost"
              size="icon"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>

        {!hasLoadedResearch && (
          <Button
            onClick={handleLoadResearch}
            disabled={isLoading}
            variant="ghost"
            className="w-full text-sm"
          >
            {isLoading ? 'Loading...' : 'Load Existing Research'}
          </Button>
        )}

        {research.length > 0 && (
          <Button
            onClick={handleSynthesize}
            disabled={isSynthesizing}
            className="w-full"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Synthesize with AI
              </>
            )}
          </Button>
        )}
      </div>

      {/* Research Results */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {!hasLoadedResearch ? (
            <p className="text-sm text-ink/50 text-center py-8">
              Click "Load Existing Research" or "Research Web" to begin
            </p>
          ) : research.length === 0 ? (
            <p className="text-sm text-ink/50 text-center py-8">
              No research data available. Click "Research Web" to gather information.
            </p>
          ) : (
            research.map((record) => (
              <ResearchCard key={record.id} record={record} />
            ))
          )}
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
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}
            >
              {record.source_type === 'perplexity' ? 'Perplexity AI' : 'Firecrawl'}
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
