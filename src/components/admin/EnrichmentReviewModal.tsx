import { useState, useEffect } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperEnrichment, EnrichmentQueueEntry } from '@/hooks/usePepperEnrichment';
import { usePepperOverrides } from '@/hooks/usePepperOverrides';
import { useImageProposals, ImageProposal } from '@/hooks/useImageProposals';
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
import { 
  Loader2, Check, X, ExternalLink, Edit2, Image as ImageIcon, 
  ZoomIn, Trash2, Flower2, Camera, CheckCheck 
} from 'lucide-react';

interface EnrichmentReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pepper: Pepper;
  queueEntry: EnrichmentQueueEntry | null;
  onComplete: () => void;
}

const SOURCE_TYPE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  'ai-botanical': { label: 'Botanical', icon: Flower2, color: 'bg-amber-100 text-amber-800' },
  'ai-photo-plant': { label: 'On Plant', icon: Camera, color: 'bg-green-100 text-green-800' },
  'ai-photo-individual': { label: 'Individual', icon: ImageIcon, color: 'bg-blue-100 text-blue-800' },
  'wikimedia': { label: 'Wikimedia', icon: ExternalLink, color: 'bg-purple-100 text-purple-800' },
};

export function EnrichmentReviewModal({
  open,
  onOpenChange,
  pepper,
  queueEntry,
  onComplete,
}: EnrichmentReviewModalProps) {
  const { approve, reject, isApplying } = usePepperEnrichment();
  const { getOverride } = usePepperOverrides();
  const { 
    proposals: imageProposals, 
    isLoading: imagesLoading, 
    processingId,
    fetchProposals,
    approveProposal,
    rejectProposal,
    approveAll,
  } = useImageProposals();
  
  const [reviewNotes, setReviewNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<Partial<EnrichmentQueueEntry>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null);

  const currentOverride = getOverride(pepper.id);

  // Fetch image proposals when modal opens
  useEffect(() => {
    if (open && pepper.id) {
      fetchProposals(pepper.id);
    }
  }, [open, pepper.id, fetchProposals]);

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

  const handleApproveEverything = async () => {
    // Approve text content
    const edits = isEditing ? editedContent : undefined;
    const textSuccess = await approve(queueEntry.id, edits, reviewNotes);
    
    // Approve all images
    if (textSuccess && imageProposals.length > 0) {
      await approveAll(imageProposals);
    }
    
    if (textSuccess) {
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

  const pendingImageCount = imageProposals.length;

  return (
    <>
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
              <TabsTrigger value="images" className="flex items-center gap-1.5">
                Images
                {pendingImageCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-primary/20 text-primary">
                    {pendingImageCount}
                  </Badge>
                )}
              </TabsTrigger>
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

            <TabsContent value="images" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-[50vh]">
                <div className="p-4">
                  {imagesLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : imageProposals.length === 0 ? (
                    <div className="text-center p-8 text-ink/50">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No pending image proposals for this pepper</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-ink/60">
                          {pendingImageCount} pending image{pendingImageCount !== 1 ? 's' : ''}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveAll(imageProposals)}
                          disabled={!!processingId}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve All Images
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {imageProposals.map((proposal) => {
                          const typeInfo = SOURCE_TYPE_LABELS[proposal.source_type] || {
                            label: proposal.source_type,
                            icon: ImageIcon,
                            color: 'bg-gray-100 text-gray-800',
                          };
                          const TypeIcon = typeInfo.icon;

                          return (
                            <div
                              key={proposal.id}
                              className="bg-background rounded-lg overflow-hidden border border-ink/10"
                            >
                              {/* Image */}
                              <div 
                                className="aspect-square relative group cursor-pointer"
                                onClick={() => {
                                  setPreviewImage(proposal.image_url);
                                  setPreviewPrompt(proposal.prompt_used);
                                }}
                              >
                                {proposal.image_url ? (
                                  <img
                                    src={proposal.image_url}
                                    alt={`${pepper.name} - ${typeInfo.label}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-ink/5 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-ink/20" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
                                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>

                              {/* Info */}
                              <div className="p-2 space-y-2">
                                <Badge className={`text-xs ${typeInfo.color}`}>
                                  <TypeIcon className="w-3 h-3 mr-1" />
                                  {typeInfo.label}
                                </Badge>

                                {proposal.confidence_score && (
                                  <div className="flex items-center gap-1 text-xs text-ink/60">
                                    <span>Confidence:</span>
                                    <span className="font-medium">{proposal.confidence_score}%</span>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-1 pt-1">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => approveProposal(proposal)}
                                    disabled={processingId === proposal.id}
                                  >
                                    {processingId === proposal.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Check className="w-4 h-4 mr-1" />
                                        Approve
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => rejectProposal(proposal)}
                                    disabled={processingId === proposal.id}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                variant="outline"
                onClick={handleApprove}
                disabled={isApplying}
              >
                {isApplying ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Approve Text
              </Button>
              {pendingImageCount > 0 && (
                <Button
                  onClick={handleApproveEverything}
                  disabled={isApplying || !!processingId}
                  className="bg-primary"
                >
                  {isApplying || processingId ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCheck className="w-4 h-4 mr-2" />
                  )}
                  Approve Everything
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => { setPreviewImage(null); setPreviewPrompt(null); }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              Full-size preview of the proposed image
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full rounded-lg"
              />
            )}
            {previewPrompt && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Generation Prompt:</p>
                  <p className="text-sm text-ink/70 bg-ink/5 p-3 rounded-lg whitespace-pre-wrap">
                    {previewPrompt}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
