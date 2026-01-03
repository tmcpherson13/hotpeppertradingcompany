import { useEffect } from 'react';
import { useImageProposals, ImageProposal } from '@/hooks/useImageProposals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Loader2, Check, X, Image as ImageIcon, Camera, Flower2, 
  ExternalLink, Trash2, ZoomIn 
} from 'lucide-react';
import { peppers } from '@/data/peppers';
import { useState } from 'react';

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

export function ImageProposalReview({ pepperId, onComplete }: ImageProposalReviewProps) {
  const {
    proposals,
    isLoading,
    processingId,
    fetchProposals,
    approveProposal,
    rejectProposal,
    approveAll,
    rejectAll,
  } = useImageProposals();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null);

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

  const handleBulkApprove = async (pepperProposals: ImageProposal[]) => {
    await approveAll(pepperProposals);
    onComplete?.();
  };

  const handleBulkReject = async (pepperProposals: ImageProposal[]) => {
    await rejectAll(pepperProposals);
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
          {Object.entries(groupedProposals).map(([pepId, pepperProposals]) => (
            <Card key={pepId} className="bg-parchment border-ink/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg">{getPepperName(pepId)}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkApprove(pepperProposals)}
                      disabled={!!processingId}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkReject(pepperProposals)}
                      disabled={!!processingId}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject All
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
                              alt={`${getPepperName(pepId)} - ${typeInfo.label}`}
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
                              onClick={() => handleApprove(proposal)}
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
                              onClick={() => handleReject(proposal)}
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
              </CardContent>
            </Card>
          ))}
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
    </>
  );
}
