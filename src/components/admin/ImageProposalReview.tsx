import { useEffect, useState } from 'react';
import { useImageProposals, ImageProposal } from '@/hooks/useImageProposals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Loader2, Check, X, Image as ImageIcon, Camera, Flower2, 
  ExternalLink, Trash2, ZoomIn, RefreshCw
} from 'lucide-react';
import { peppers } from '@/data/peppers';
import { ReferenceImageUpload } from './ReferenceImageUpload';

interface ImageProposalReviewProps {
  pepperId?: string;
  onComplete?: () => void;
}

const SOURCE_TYPE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  'ai-botanical': { label: 'Botanical Illustration', icon: Flower2, color: 'bg-amber-100 text-amber-800' },
  'ai-photo-plant': { label: 'Photo (On Plant)', icon: Camera, color: 'bg-green-100 text-green-800' },
  'ai-photo-individual': { label: 'Photo (Individual)', icon: ImageIcon, color: 'bg-blue-100 text-blue-800' },
  'wikimedia': { label: 'Wikimedia Commons', icon: ExternalLink, color: 'bg-purple-100 text-purple-800' },
};

interface FeedbackTarget {
  type: 'all' | 'single';
  pepperId: string;
  pepperName: string;
  proposal?: ImageProposal;
}

export function ImageProposalReview({ pepperId, onComplete }: ImageProposalReviewProps) {
  const {
    proposals,
    isLoading,
    processingId,
    isRegenerating,
    regeneratingIds,
    fetchProposals,
    approveProposal,
    rejectProposal,
    approveAll,
    rejectAll,
    regenerateImages,
    regenerateSingleImage,
    deleteProposal,
    deleteAll,
  } = useImageProposals();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTarget, setFeedbackTarget] = useState<FeedbackTarget | null>(null);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

  useEffect(() => {
    fetchProposals(pepperId);
  }, [fetchProposals, pepperId]);

  const handleApprove = async (proposal: ImageProposal) => {
    const success = await approveProposal(proposal);
    if (success) onComplete?.();
  };

  const handleReject = async (proposal: ImageProposal) => {
    const success = await rejectProposal(proposal);
    if (success) onComplete?.();
  };

  const handleDelete = async (proposal: ImageProposal) => {
    const success = await deleteProposal(proposal);
    if (success) onComplete?.();
  };

  const handleBulkApprove = async (pepperProposals: ImageProposal[]) => {
    await approveAll(pepperProposals);
    onComplete?.();
  };

  const handleBulkReject = async (pepperProposals: ImageProposal[]) => {
    await rejectAll(pepperProposals);
    onComplete?.();
  };

  const handleBulkDelete = async (pepperProposals: ImageProposal[]) => {
    await deleteAll(pepperProposals);
    onComplete?.();
  };

  const handleRegenerateAll = (pepId: string, pepperName: string) => {
    setFeedbackTarget({ type: 'all', pepperId: pepId, pepperName });
    setFeedbackText('');
    setReferenceImages([]);
    setFeedbackDialogOpen(true);
  };

  const handleRegenerateSingle = (proposal: ImageProposal, pepperName: string) => {
    setFeedbackTarget({ type: 'single', pepperId: proposal.pepper_id, pepperName, proposal });
    setFeedbackText('');
    setReferenceImages([]);
    setFeedbackDialogOpen(true);
  };

  const submitRegeneration = async () => {
    if (!feedbackTarget) return;
    
    setFeedbackDialogOpen(false);
    
    if (feedbackTarget.type === 'all') {
      await regenerateImages(
        feedbackTarget.pepperId, 
        feedbackTarget.pepperName, 
        feedbackText || undefined,
        referenceImages.length > 0 ? referenceImages : undefined
      );
    } else if (feedbackTarget.proposal) {
      await regenerateSingleImage(
        feedbackTarget.proposal, 
        feedbackTarget.pepperName, 
        feedbackText || undefined,
        referenceImages.length > 0 ? referenceImages : undefined
      );
    }
    
    setFeedbackTarget(null);
    setFeedbackText('');
    setReferenceImages([]);
    onComplete?.();
  };

  const getPepperName = (pepperId: string) => {
    const pepper = peppers.find(p => p.id === pepperId);
    return pepper?.name || pepperId;
  };

  // Group proposals by pepper
  const groupedProposals = proposals.reduce((acc, proposal) => {
    if (!acc[proposal.pepper_id]) {
      acc[proposal.pepper_id] = [];
    }
    acc[proposal.pepper_id].push(proposal);
    return acc;
  }, {} as Record<string, ImageProposal[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center p-8 text-ink/50">
        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No pending image proposals</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[600px]">
        <div className="space-y-6 pr-4">
          {Object.entries(groupedProposals).map(([pepId, pepperProposals]) => {
            const pepperName = getPepperName(pepId);
            
            return (
              <Card key={pepId} className="bg-parchment border-ink/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg">{pepperName}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkApprove(pepperProposals)}
                        disabled={!!processingId || isRegenerating}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkReject(pepperProposals)}
                        disabled={!!processingId || isRegenerating}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerateAll(pepId, pepperName)}
                        disabled={!!processingId || isRegenerating}
                      >
                        {isRegenerating ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-1" />
                        )}
                        Regenerate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBulkDelete(pepperProposals)}
                        disabled={!!processingId || isRegenerating}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {pepperProposals.map((proposal) => {
                      const typeInfo = SOURCE_TYPE_LABELS[proposal.source_type] || {
                        label: proposal.source_type,
                        icon: ImageIcon,
                        color: 'bg-gray-100 text-gray-800',
                      };
                      const TypeIcon = typeInfo.icon;
                      const isProcessing = processingId === proposal.id;
                      const isRegeneratingThis = regeneratingIds.has(proposal.id);

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
                                alt={`${pepperName} - ${typeInfo.label}`}
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

                            {/* Attribution — shown for real web photos (Wikimedia, etc.) */}
                            {(proposal.author || proposal.license || proposal.source_url) && (
                              <div className="text-[10px] leading-snug text-ink/50 border-t border-ink/5 pt-1">
                                {proposal.author && proposal.author !== 'Unknown' && (
                                  <div className="truncate" title={proposal.author}>© {proposal.author}</div>
                                )}
                                <div className="flex items-center gap-1">
                                  {proposal.license && <span className="truncate">{proposal.license}</span>}
                                  {proposal.source_url && (
                                    <a
                                      href={proposal.source_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-0.5 underline hover:text-ink/70"
                                    >
                                      source <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-1 pt-1">
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleApprove(proposal)}
                                disabled={isProcessing || isRegeneratingThis}
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(proposal)}
                                disabled={isProcessing || isRegeneratingThis}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegenerateSingle(proposal, pepperName)}
                                disabled={isProcessing || isRegeneratingThis}
                              >
                                {isRegeneratingThis ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(proposal)}
                                disabled={isProcessing || isRegeneratingThis}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

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

      {/* Regeneration Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={(open) => {
        setFeedbackDialogOpen(open);
        if (!open) {
          setReferenceImages([]);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Regenerate Images</DialogTitle>
            <DialogDescription>
              Provide optional feedback and reference images to guide AI generation for {feedbackTarget?.pepperName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Text Feedback (optional)
              </label>
              <Textarea
                placeholder="e.g., 'Show more vibrant colors' or 'Include the whole pepper plant'"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <Separator />
            
            <ReferenceImageUpload
              images={referenceImages}
              onImagesChange={setReferenceImages}
              maxImages={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitRegeneration} disabled={isRegenerating}>
              {isRegenerating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
