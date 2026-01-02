import { useState, useCallback } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperEnrichment, EnrichmentQueueEntry } from '@/hooks/usePepperEnrichment';
import { EnrichmentPepperList } from './EnrichmentPepperList';
import { ResearchPanel } from './ResearchPanel';
import { EnrichmentReviewModal } from './EnrichmentReviewModal';
import { EnrichmentStats } from './EnrichmentStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye } from 'lucide-react';

export function PepperEnrichment() {
  const [selectedPepper, setSelectedPepper] = useState<Pepper | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentQueueEntry, setCurrentQueueEntry] = useState<EnrichmentQueueEntry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { fetchPepperQueue } = usePepperEnrichment();

  const handleSelectPepper = useCallback((pepper: Pepper) => {
    setSelectedPepper(pepper);
    setCurrentQueueEntry(null);
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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <EnrichmentStats key={`stats-${refreshKey}`} />

      <Separator />

      {/* Main Content */}
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
              key={`list-${refreshKey}`}
              onSelectPepper={handleSelectPepper}
              selectedPepperId={selectedPepper?.id}
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
