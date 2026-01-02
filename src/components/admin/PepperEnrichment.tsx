import { useState, useCallback } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperEnrichment, EnrichmentQueueEntry } from '@/hooks/usePepperEnrichment';
import { EnrichmentPepperList } from './EnrichmentPepperList';
import { EnrichmentSettings } from './EnrichmentSettings';
import { ResearchPanel } from './ResearchPanel';
import { BatchEnrichmentPanel } from './BatchEnrichmentPanel';
import { EnrichmentReviewModal } from './EnrichmentReviewModal';
import { EnrichmentStats } from './EnrichmentStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Eye, Layers, Circle, Settings, ChevronDown } from 'lucide-react';

export function PepperEnrichment() {
  const [selectedPepper, setSelectedPepper] = useState<Pepper | null>(null);
  const [selectedPeppers, setSelectedPeppers] = useState<Pepper[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentQueueEntry, setCurrentQueueEntry] = useState<EnrichmentQueueEntry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { fetchPepperQueue } = usePepperEnrichment();

  const handleSelectPepper = useCallback((pepper: Pepper) => {
    setSelectedPepper(pepper);
    setCurrentQueueEntry(null);
  }, []);

  const handleSelectionChange = useCallback((peppers: Pepper[]) => {
    setSelectedPeppers(peppers);
  }, []);

  const handleSynthesisComplete = useCallback(async () => {
    if (selectedPepper) {
      const entry = await fetchPepperQueue(selectedPepper.id);
      if (entry) {
        setCurrentQueueEntry(entry);
      }
      setRefreshKey(k => k + 1);
    }
  }, [selectedPepper, fetchPepperQueue]);

  const handleOpenReview = useCallback(async () => {
    if (selectedPepper) {
      const entry = await fetchPepperQueue(selectedPepper.id);
      if (entry) {
        setCurrentQueueEntry(entry);
        setReviewModalOpen(true);
      }
    }
  }, [selectedPepper, fetchPepperQueue]);

  const handleReviewComplete = useCallback(() => {
    setCurrentQueueEntry(null);
    setRefreshKey(k => k + 1);
  }, []);

  const handleBatchComplete = useCallback(() => {
    setRefreshKey(k => k + 1);
    setSelectedPeppers([]);
  }, []);

  const handleSettingsChange = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <EnrichmentStats key={`stats-${refreshKey}`} refreshKey={refreshKey} />

      {/* Settings Collapsible */}
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between" size="sm">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Enrichment Settings
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <EnrichmentSettings onSettingsChange={handleSettingsChange} />
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Mode Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'single' | 'batch')}>
        <TabsList className="bg-parchment-dark/30 border border-ink/20">
          <TabsTrigger value="single" className="flex items-center gap-2 text-xs">
            <Circle className="w-4 h-4" />
            Single Pepper
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2 text-xs">
            <Layers className="w-4 h-4" />
            Batch Processing
            {selectedPeppers.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {selectedPeppers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Single Pepper Mode */}
        <TabsContent value="single" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
            {/* Pepper List */}
            <div className="lg:col-span-1 border border-ink/10 rounded-lg overflow-hidden bg-parchment">
              <div className="p-3 border-b border-ink/10 bg-parchment-dark/20">
                <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70">
                  Pepper Catalog
                </h3>
              </div>
              <div className="h-[450px]">
                <EnrichmentPepperList
                  key={`list-single-${refreshKey}`}
                  onSelectPepper={handleSelectPepper}
                  selectedPepperId={selectedPepper?.id}
                  batchMode={false}
                />
              </div>
            </div>

            {/* Research Panel */}
            <div className="lg:col-span-2 border border-ink/10 rounded-lg overflow-hidden bg-parchment">
              <div className="p-3 border-b border-ink/10 bg-parchment-dark/20 flex items-center justify-between">
                <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70">
                  Research & Synthesis
                </h3>
                {selectedPepper && currentQueueEntry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenReview}
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Review Pending
                    <Badge variant="secondary" className="ml-2 text-xs">1</Badge>
                  </Button>
                )}
              </div>
              <div className="h-[450px]">
                {selectedPepper ? (
                  <ResearchPanel
                    pepper={selectedPepper}
                    onSynthesisComplete={handleSynthesisComplete}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-ink/40">
                    <p className="text-sm">Select a pepper from the catalog to begin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Batch Mode */}
        <TabsContent value="batch" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
            {/* Pepper List with Multi-Select */}
            <div className="lg:col-span-1 border border-ink/10 rounded-lg overflow-hidden bg-parchment">
              <div className="p-3 border-b border-ink/10 bg-parchment-dark/20">
                <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70">
                  Select Peppers for Batch
                </h3>
              </div>
              <div className="h-[450px]">
                <EnrichmentPepperList
                  key={`list-batch-${refreshKey}`}
                  onSelectPepper={handleSelectPepper}
                  selectedPepperId={selectedPepper?.id}
                  onSelectionChange={handleSelectionChange}
                  batchMode={true}
                />
              </div>
            </div>

            {/* Batch Panel */}
            <div className="lg:col-span-2 border border-ink/10 rounded-lg overflow-hidden bg-parchment">
              <div className="p-3 border-b border-ink/10 bg-parchment-dark/20">
                <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70">
                  Batch Processing
                </h3>
              </div>
              <div className="h-[450px]">
                <BatchEnrichmentPanel
                  selectedPeppers={selectedPeppers}
                  onComplete={handleBatchComplete}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {selectedPepper && (
        <EnrichmentReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          pepper={selectedPepper}
          queueEntry={currentQueueEntry}
          onComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}
