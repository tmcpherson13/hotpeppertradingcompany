import { useState, useEffect, type ReactNode } from 'react';
import { Pepper, heatLevels } from '@/data/pepperTypes';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, Check, ExternalLink, Edit2, Image as ImageIcon, 
  ZoomIn, Flower2, Camera, RefreshCw, X, CheckCircle2, XCircle, Save
} from 'lucide-react';
import { ReferenceImageUpload } from './ReferenceImageUpload';

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

type FieldApprovalStatus = 'pending' | 'approved' | 'rejected';

export function EnrichmentReviewModal({
  open,
  onOpenChange,
  pepper,
  queueEntry,
  onComplete,
}: EnrichmentReviewModalProps) {
  const { approve, reject, isApplying } = usePepperEnrichment();
  const { getOverride, saveOverride, isSaving } = usePepperOverrides();
  const { 
    proposals: imageProposals, 
    isLoading: imagesLoading, 
    processingId,
    regeneratingIds,
    fetchProposals,
    approveProposal,
    approveAll,
    regenerateSingleImage,
  } = useImageProposals();
  
  const [reviewNotes, setReviewNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<Partial<EnrichmentQueueEntry>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null);
  const [regeneratingImageId, setRegeneratingImageId] = useState<string | null>(null);
  const [regenerateFeedback, setRegenerateFeedback] = useState('');
  const [regenerateReferenceImages, setRegenerateReferenceImages] = useState<File[]>([]);
  const [fieldApprovals, setFieldApprovals] = useState<Record<string, FieldApprovalStatus>>({});
  
  // Manual override fields state
  const [manualOrigin, setManualOrigin] = useState('');
  const [manualHeatLevel, setManualHeatLevel] = useState('');
  const [manualScovilleMin, setManualScovilleMin] = useState<number | ''>('');
  const [manualScovilleMax, setManualScovilleMax] = useState<number | ''>('');
  const [savingManualOverrides, setSavingManualOverrides] = useState(false);

  const currentOverride = getOverride(pepper.id);

  // Fetch image proposals when modal opens
  useEffect(() => {
    if (open && pepper.id) {
      fetchProposals(pepper.id);
    }
  }, [open, pepper.id, fetchProposals]);

  // Reset field approvals and manual overrides when queue entry changes
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
      // Initialize all fields with proposed content as "pending"
      setFieldApprovals({
        proposed_description: 'pending',
        proposed_historical_notes: 'pending',
        proposed_flavor_notes: 'pending',
        proposed_aroma_notes: 'pending',
        proposed_culinary_uses: 'pending',
        proposed_trade_route: 'pending',
      });
    }
  }, [queueEntry]);
  
  // Initialize manual override fields from existing overrides or pepper data
  useEffect(() => {
    if (open && pepper) {
      setManualOrigin(currentOverride?.origin || pepper.origin || '');
      setManualHeatLevel(currentOverride?.heat_level || pepper.heatLevel || '');
      setManualScovilleMin(currentOverride?.scoville_min ?? pepper.scovilleMin ?? '');
      setManualScovilleMax(currentOverride?.scoville_max ?? pepper.scovilleMax ?? '');
    }
  }, [open, pepper, currentOverride]);

  if (!queueEntry) return null;

  const handleFieldApproval = (fieldKey: string, status: FieldApprovalStatus) => {
    setFieldApprovals(prev => ({
      ...prev,
      [fieldKey]: status,
    }));
  };

  const handleApproveAllText = async () => {
    // Get fields that are rejected (to exclude them)
    const excludedFields = Object.entries(fieldApprovals)
      .filter(([_, status]) => status === 'rejected')
      .map(([key]) => key);

    // Always send the working copy: editedContent is seeded from the proposed
    // values and updated in place, so any manual edits are applied on approve
    // whether or not the field is currently in edit mode. (Previously edits were
    // sent only while isEditing was true, so clicking "Done" first silently
    // discarded them.)
    const edits = editedContent;
    const success = await approve(queueEntry.id, edits, reviewNotes, excludedFields);
    if (success) {
      onComplete();
      onOpenChange(false);
    }
  };

  const handleRegenerateSingle = async (proposal: ImageProposal) => {
    const success = await regenerateSingleImage(
      proposal, 
      pepper.name, 
      regenerateFeedback,
      regenerateReferenceImages.length > 0 ? regenerateReferenceImages : undefined
    );
    if (success) {
      setRegeneratingImageId(null);
      setRegenerateFeedback('');
      setRegenerateReferenceImages([]);
    }
  };
  
  const handleSaveManualOverrides = async () => {
    setSavingManualOverrides(true);
    const success = await saveOverride(pepper.id, {
      origin: manualOrigin || null,
      heat_level: manualHeatLevel || null,
      scoville_min: manualScovilleMin === '' ? null : manualScovilleMin,
      scoville_max: manualScovilleMax === '' ? null : manualScovilleMax,
    });
    setSavingManualOverrides(false);
    return success;
  };

  const fields = [
    { key: 'proposed_description', label: 'Description', current: currentOverride?.description || pepper.description },
    { key: 'proposed_historical_notes', label: 'Historical Notes', current: currentOverride?.historical_notes },
    { key: 'proposed_flavor_notes', label: 'Flavor Notes', current: null },
    { key: 'proposed_aroma_notes', label: 'Aroma Notes', current: null },
    { key: 'proposed_culinary_uses', label: 'Culinary Uses', current: null },
    { key: 'proposed_trade_route', label: 'Trade Route', current: currentOverride?.trade_route },
  ];

  // Each plagiarism flag starts with the flagged phrase in quotes, e.g.
  //   "dusts grilled corn, rims the glass of a michelada" — tracks Know The Pepper: '...'
  // Pull that leading phrase so we can label its section and highlight it in-field.
  const parseFlaggedPhrase = (flag: string): string | null => {
    // Match the leading quoted phrase — straight (") or curly (“”) quotes.
    const m = flag.match(/["“”]([^"“”]+)["“”]/);
    return m ? m[1] : null;
  };

  // Which narrative field (originally) contains a flagged phrase — a stable
  // "in <section>" label so the reviewer knows where to look even after editing.
  const sectionForPhrase = (phrase: string): string | null => {
    const f = fields.find(({ key }) => {
      const text = (queueEntry[key as keyof EnrichmentQueueEntry] as string | null) || '';
      return text.includes(phrase);
    });
    return f ? f.label : null;
  };

  const plagiarismFlagsRaw = ((queueEntry as any).plagiarism_flags as string[] | null | undefined) || [];
  const flaggedPhrases = plagiarismFlagsRaw.map(parseFlaggedPhrase).filter(Boolean) as string[];

  // Render text with any still-present flagged phrases highlighted; the mark
  // disappears once the reviewer edits the phrase away.
  const renderWithFlags = (text: string): ReactNode => {
    const present = flaggedPhrases.filter((p) => text.includes(p));
    if (!present.length) return text;
    let nodes: ReactNode[] = [text];
    present.forEach((phrase, pi) => {
      nodes = nodes.flatMap((node, ni) => {
        if (typeof node !== 'string') return [node];
        const parts = node.split(phrase);
        const out: ReactNode[] = [];
        parts.forEach((part, idx) => {
          if (idx > 0) {
            out.push(
              <mark key={`flag-${pi}-${ni}-${idx}`} className="bg-red-200 text-red-900 rounded px-0.5">
                {phrase}
              </mark>
            );
          }
          if (part) out.push(part);
        });
        return out;
      });
    });
    return nodes;
  };

  const pendingImageCount = imageProposals.length;

  const getFieldStatusStyle = (status: FieldApprovalStatus) => {
    switch (status) {
      case 'approved':
        return 'border-green-400 bg-green-50/50';
      case 'rejected':
        return 'border-red-400 bg-red-50/50';
      default:
        return 'border-ink/10';
    }
  };

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

          <Tabs defaultValue="compare" className="flex-1 flex flex-col overflow-hidden min-h-0">
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

            <TabsContent value="compare" className="flex-1 flex flex-col overflow-hidden min-h-0 mt-0">
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-4 p-4">
                  {/* Verification Panel — results from the adversarial verification pass */}
                  {(() => {
                    const verificationPassed = (queueEntry as any).verification_passed as boolean | null | undefined;
                    const unsupportedClaims = ((queueEntry as any).unsupported_claims as string[] | null | undefined) || [];
                    const plagiarismFlags = ((queueEntry as any).plagiarism_flags as string[] | null | undefined) || [];
                    const narrativeInferences = ((queueEntry as any).narrative_inferences as string[] | null | undefined) || [];
                    const verificationNotes = (queueEntry as any).verification_notes as string | null | undefined;

                    const chip = verificationPassed === true
                      ? { text: 'Verification passed', className: 'bg-green-100 text-green-800 border-green-300' }
                      : verificationPassed === false
                        ? { text: 'Needs review — verification failed', className: 'bg-red-100 text-red-800 border-red-300' }
                        : { text: 'Not verified', className: 'bg-ink/5 text-ink/60 border-ink/20' };

                    return (
                      <div className="border-2 border-ink/10 rounded-lg overflow-hidden bg-parchment-dark/10">
                        <div className="bg-parchment-dark/20 px-3 py-2 flex items-center justify-between">
                          <span className="font-heading text-sm uppercase tracking-wider text-ink/70">
                            Verification
                          </span>
                          <Badge className={`text-xs border ${chip.className}`}>
                            {verificationPassed === true && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {verificationPassed === false && <XCircle className="w-3 h-3 mr-1" />}
                            {chip.text}
                          </Badge>
                        </div>
                        {(unsupportedClaims.length > 0 || plagiarismFlags.length > 0 || narrativeInferences.length > 0 || verificationNotes) && (
                          <div className="p-4 space-y-3">
                            {plagiarismFlags.length > 0 && (
                              <div className="rounded-md border border-red-300 bg-red-50/60 p-3">
                                <p className="font-heading text-xs uppercase tracking-wider text-red-800 mb-1.5">
                                  Possible copied passages · blocks approval
                                </p>
                                <p className="text-[11px] text-red-900/60 mb-1.5">
                                  Each flag names its section; the phrase is highlighted in that field below.
                                  Edit the phrase to clear the flag.
                                </p>
                                <ul className="space-y-1.5 text-sm text-red-900/80">
                                  {plagiarismFlags.map((flag, i) => {
                                    const phrase = parseFlaggedPhrase(flag);
                                    const section = phrase ? sectionForPhrase(phrase) : null;
                                    return (
                                      <li key={i} className="flex gap-2">
                                        {section && (
                                          <span className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded bg-red-200 text-red-900 text-[10px] uppercase tracking-wide font-heading h-fit">
                                            {section}
                                          </span>
                                        )}
                                        <span>{flag}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                            {unsupportedClaims.length > 0 && (
                              <div className="rounded-md border border-red-300 bg-red-50/60 p-3">
                                <p className="font-heading text-xs uppercase tracking-wider text-red-800 mb-1.5">
                                  Unsupported hard facts · blocks approval
                                </p>
                                <p className="text-[11px] text-red-900/60 mb-1.5">
                                  Checkable claims (dates, numbers, names, records) the sources don't back up.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-red-900/80">
                                  {unsupportedClaims.map((claim, i) => (
                                    <li key={i}>{claim}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {narrativeInferences.length > 0 && (
                              <div className="rounded-md border border-ink/15 bg-parchment-dark/15 p-3">
                                <p className="font-heading text-xs uppercase tracking-wider text-ink/60 mb-1.5">
                                  Creative license · allowed
                                </p>
                                <p className="text-[11px] text-ink/50 mb-1.5">
                                  Evocative or inferential framing consistent with general history. Not a failure — noted for your review.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-ink/70">
                                  {narrativeInferences.map((inf, i) => (
                                    <li key={i}>{inf}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {verificationNotes && (
                              <p className="text-xs italic text-ink/50">{verificationNotes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Manual Overrides Section */}
                  <div className="border-2 border-amber-300 rounded-lg overflow-hidden bg-amber-50/30">
                    <div className="bg-amber-100/50 px-3 py-2 flex items-center justify-between">
                      <span className="font-heading text-sm uppercase tracking-wider text-amber-800">
                        Manual Overrides
                      </span>
                      <Badge className="bg-amber-200 text-amber-800 text-xs">
                        Editable Fields
                      </Badge>
                    </div>
                    <div className="p-4 space-y-4">
                      <p className="text-xs text-ink/60 mb-3">
                        Adjust these core pepper attributes directly. Changes save independently from AI enrichment approval.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Provenance */}
                        <div className="space-y-1.5">
                          <Label htmlFor="manual-origin" className="text-sm font-medium">
                            Provenance
                          </Label>
                          <Input
                            id="manual-origin"
                            value={manualOrigin}
                            onChange={(e) => setManualOrigin(e.target.value)}
                            placeholder={pepper.origin || 'e.g., Jamaica'}
                            className="bg-parchment"
                          />
                          <p className="text-xs text-ink/50">Current: {pepper.origin || 'Not set'}</p>
                        </div>
                        
                        {/* Pungency */}
                        <div className="space-y-1.5">
                          <Label htmlFor="manual-heat-level" className="text-sm font-medium">
                            Pungency
                          </Label>
                          <Select value={manualHeatLevel} onValueChange={setManualHeatLevel}>
                            <SelectTrigger id="manual-heat-level" className="bg-parchment">
                              <SelectValue placeholder="Select heat level" />
                            </SelectTrigger>
                            <SelectContent>
                              {heatLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-ink/50">Current: {pepper.heatLevel || 'Not set'}</p>
                        </div>
                      </div>
                      
                      {/* Scoville Range */}
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Scoville Range (SHU)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={manualScovilleMin}
                            onChange={(e) => setManualScovilleMin(e.target.value === '' ? '' : parseInt(e.target.value))}
                            placeholder="Min"
                            className="bg-parchment w-32"
                            min={0}
                          />
                          <span className="text-ink/50">—</span>
                          <Input
                            type="number"
                            value={manualScovilleMax}
                            onChange={(e) => setManualScovilleMax(e.target.value === '' ? '' : parseInt(e.target.value))}
                            placeholder="Max"
                            className="bg-parchment w-32"
                            min={0}
                          />
                          <span className="text-xs text-ink/50">SHU</span>
                        </div>
                        <p className="text-xs text-ink/50">
                          Current: {pepper.scovilleMin?.toLocaleString() || '?'} - {pepper.scovilleMax?.toLocaleString() || '?'} SHU
                        </p>
                      </div>
                      
                      <Button
                        onClick={handleSaveManualOverrides}
                        disabled={savingManualOverrides || isSaving}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {savingManualOverrides ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Manual Overrides
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />

                  {/* Field-tier hint */}
                  <p className="text-xs text-ink/50 italic">
                    These are AI-drafted narrative fields — description, historical notes, flavor &amp; aroma,
                    culinary uses, and trade route — the "Yellow tier" a human approves here. Hard facts such as
                    Scoville values and scientific names are entered and verified separately in the Catalog tab.
                  </p>

                  {/* AI-Generated Fields */}
                  {fields.map(({ key, label, current }) => {
                    const proposed = queueEntry[key as keyof EnrichmentQueueEntry] as string | null;
                    const edited = editedContent[key as keyof typeof editedContent] as string | undefined;
                    const fieldStatus = fieldApprovals[key] || 'pending';

                    return (
                      <div 
                        key={key} 
                        className={`border-2 rounded-lg overflow-hidden transition-colors ${getFieldStatusStyle(fieldStatus)}`}
                      >
                        <div className="bg-parchment-dark/20 px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-sm uppercase tracking-wider text-ink/70">
                              {label}
                            </span>
                            {fieldStatus === 'approved' && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            )}
                            {fieldStatus === 'rejected' && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                <XCircle className="w-3 h-3 mr-1" />
                                Rejected
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {proposed && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFieldApproval(key, 'approved')}
                                  className={`h-7 text-xs ${fieldStatus === 'approved' ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-700'}`}
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFieldApproval(key, 'rejected')}
                                  className={`h-7 text-xs ${fieldStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'hover:bg-red-50 hover:text-red-700'}`}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsEditing(!isEditing)}
                                  className="h-7 text-xs"
                                >
                                  <Edit2 className="w-3 h-3 mr-1" />
                                  {isEditing ? 'Done' : 'Edit'}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-ink/10">
                          <div className="p-3">
                            <Badge variant="outline" className="text-xs mb-2">Current</Badge>
                            <p className="text-sm text-ink/70">
                              {current || <span className="italic text-ink/40">Not set</span>}
                            </p>
                          </div>
                          <div className={`p-3 ${fieldStatus === 'rejected' ? 'opacity-50' : 'bg-primary/5'}`}>
                            <Badge variant="outline" className="text-xs mb-2 bg-primary/10 border-primary/30">
                              Proposed
                            </Badge>
                            {isEditing && fieldStatus !== 'rejected' ? (
                              <Textarea
                                value={edited ?? ''}
                                onChange={(e) => setEditedContent({
                                  ...editedContent,
                                  [key]: e.target.value,
                                })}
                                className="text-sm min-h-[80px] bg-parchment"
                              />
                            ) : (
                              <p className={`text-sm text-ink/70 ${fieldStatus === 'rejected' ? 'line-through' : ''}`}>
                                {(edited ?? proposed)
                                  ? renderWithFlags((edited ?? proposed) as string)
                                  : <span className="italic text-ink/40">Not generated</span>}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Approve All Text button at bottom of Side-by-Side tab */}
              <div className="shrink-0 border-t border-ink/10 p-4 bg-parchment-dark/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-ink/60">
                    {Object.values(fieldApprovals).filter(s => s === 'approved').length} approved, {' '}
                    {Object.values(fieldApprovals).filter(s => s === 'rejected').length} rejected
                  </div>
                  <Button
                    onClick={handleApproveAllText}
                    disabled={isApplying}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isApplying ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Approve All Text & Images
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="flex-1 flex flex-col overflow-hidden min-h-0 mt-0">
              <ScrollArea className="flex-1 min-h-0">
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
                          const isRegenerating = regeneratingIds.has(proposal.id);

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
                                    className={`w-full h-full object-cover ${isRegenerating ? 'opacity-50' : ''}`}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-ink/5 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-ink/20" />
                                  </div>
                                )}
                                {isRegenerating && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
                                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                                  </div>
                                )}
                                {!isRegenerating && (
                                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
                                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                )}
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
                                <div className="space-y-2 pt-1">
                                  <div className="flex gap-1">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => approveProposal(proposal)}
                                      disabled={processingId === proposal.id || isRegenerating}
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
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setRegeneratingImageId(
                                        regeneratingImageId === proposal.id ? null : proposal.id
                                      )}
                                      disabled={processingId === proposal.id || isRegenerating}
                                      className="border-amber-200 hover:bg-amber-50 text-amber-700"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  
                                  {/* Per-image regenerate feedback */}
                                  {regeneratingImageId === proposal.id && (
                                    <div className="space-y-3 p-3 bg-amber-50/50 rounded border border-amber-200">
                                      <Textarea
                                        value={regenerateFeedback}
                                        onChange={(e) => setRegenerateFeedback(e.target.value)}
                                        placeholder="Describe changes... (e.g., 'more orange color', 'show stem')"
                                        className="text-xs min-h-[60px] bg-parchment"
                                      />
                                      
                                      <ReferenceImageUpload
                                        images={regenerateReferenceImages}
                                        onImagesChange={setRegenerateReferenceImages}
                                        maxImages={3}
                                      />
                                      
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="flex-1 text-xs"
                                          onClick={() => {
                                            setRegeneratingImageId(null);
                                            setRegenerateFeedback('');
                                            setRegenerateReferenceImages([]);
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="flex-1 text-xs bg-amber-600 hover:bg-amber-700"
                                          onClick={() => handleRegenerateSingle(proposal)}
                                          disabled={isRegenerating}
                                        >
                                          {isRegenerating ? (
                                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                          ) : (
                                            <RefreshCw className="w-3 h-3 mr-1" />
                                          )}
                                          Regenerate
                                        </Button>
                                      </div>
                                    </div>
                                  )}
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

            <TabsContent value="citations" className="flex-1 flex flex-col overflow-hidden min-h-0 mt-0">
              <ScrollArea className="flex-1 min-h-0">
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

          <div className="shrink-0 space-y-3 pt-2">
            {/* Review Notes for text approval */}
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
