import { useState, useEffect } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperEnrichment, EnrichmentQueueEntry } from '@/hooks/usePepperEnrichment';
import { usePepperOverrides } from '@/hooks/usePepperOverrides';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Check, X, ExternalLink, Edit2 } from 'lucide-react';

interface EnrichmentReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pepper: Pepper;
  queueEntry: EnrichmentQueueEntry | null;
  onComplete: () => void;
}

export function EnrichmentReviewModal({
  open,
  onOpenChange,
  pepper,
  queueEntry,
  onComplete,
}: EnrichmentReviewModalProps) {
  const { approve, reject, isApplying } = usePepperEnrichment();
  const { getOverride } = usePepperOverrides();
  const [reviewNotes, setReviewNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<Partial<EnrichmentQueueEntry>>({});

  const currentOverride = getOverride(pepper.id);

  useEffect(() => {
    if (queueEntry) {
      setEditedContent({
        proposed_description: queueEntry.proposed_description,
        proposed_historical_notes: queueEntry.proposed_historical_notes,
        proposed_flavor_notes: queueEntry.proposed_flavor_notes,
        proposed_aroma_notes: queueEntry.proposed_aroma_notes,
        proposed_culinary_uses: queueEntry.proposed_culinary_uses,
        proposed_trade_route: queueEntry.proposed_trade_route,
      });
    }
  }, [queueEntry]);

  if (!queueEntry) return null;

  const handleApprove = async () => {
    const edits = isEditing ? editedContent : undefined;
    const success = await approve(queueEntry.id, edits, reviewNotes);
    if (success) {
      onComplete();
      onOpenChange(false);
    }
  };

  const handleReject = async () => {
    const success = await reject(queueEntry.id, reviewNotes);
    if (success) {
      onComplete();
      onOpenChange(false);
    }
  };

  const fields = [
    { key: 'proposed_description', label: 'Description', current: currentOverride?.description || pepper.description },
    { key: 'proposed_historical_notes', label: 'Historical Notes', current: currentOverride?.historical_notes },
    { key: 'proposed_flavor_notes', label: 'Flavor Notes', current: null },
    { key: 'proposed_aroma_notes', label: 'Aroma Notes', current: null },
    { key: 'proposed_culinary_uses', label: 'Culinary Uses', current: null },
    { key: 'proposed_trade_route', label: 'Trade Route', current: currentOverride?.trade_route },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-parchment">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-wide">
            Review Enrichment: {pepper.name}
          </DialogTitle>
          <DialogDescription>
            Compare proposed AI-generated content with existing data
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="compare" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-parchment-dark/30">
            <TabsTrigger value="compare">Side-by-Side</TabsTrigger>
            <TabsTrigger value="citations">Citations ({queueEntry.source_citations?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="compare" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4 p-4">
                {fields.map(({ key, label, current }) => {
                  const proposed = queueEntry[key as keyof EnrichmentQueueEntry] as string | null;
                  const edited = editedContent[key as keyof typeof editedContent] as string | undefined;

                  return (
                    <div key={key} className="border border-ink/10 rounded-lg overflow-hidden">
                      <div className="bg-parchment-dark/20 px-3 py-2 flex items-center justify-between">
                        <span className="font-heading text-sm uppercase tracking-wider text-ink/70">
                          {label}
                        </span>
                        {proposed && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="h-6 text-xs"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            {isEditing ? 'Done' : 'Edit'}
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-ink/10">
                        <div className="p-3">
                          <Badge variant="outline" className="text-xs mb-2">Current</Badge>
                          <p className="text-sm text-ink/70">
                            {current || <span className="italic text-ink/40">Not set</span>}
                          </p>
                        </div>
                        <div className="p-3 bg-primary/5">
                          <Badge variant="outline" className="text-xs mb-2 bg-primary/10 border-primary/30">
                            Proposed
                          </Badge>
                          {isEditing ? (
                            <Textarea
                              value={edited || ''}
                              onChange={(e) => setEditedContent({
                                ...editedContent,
                                [key]: e.target.value,
                              })}
                              className="text-sm min-h-[80px] bg-parchment"
                            />
                          ) : (
                            <p className="text-sm text-ink/70">
                              {proposed || <span className="italic text-ink/40">Not generated</span>}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="citations" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-[50vh]">
              <div className="p-4 space-y-2">
                {queueEntry.source_citations && queueEntry.source_citations.length > 0 ? (
                  queueEntry.source_citations.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 hover:bg-parchment-dark/20 rounded text-sm text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {url}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-ink/50">No citations available</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-3 pt-2">
          <div>
            <Label htmlFor="review-notes" className="text-sm">Review Notes (optional)</Label>
            <Textarea
              id="review-notes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add any notes about this review..."
              className="mt-1 bg-parchment"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isApplying}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {isApplying ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApplying}
            >
              {isApplying ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Approve & Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
