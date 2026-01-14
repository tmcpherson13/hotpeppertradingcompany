import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { peppers } from '@/data/peppers';
import { Pepper } from '@/data/pepperTypes';
import { usePepperEnrichment, EnrichmentQueueEntry } from '@/hooks/usePepperEnrichment';
import { EnrichmentReviewModal } from './EnrichmentReviewModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, RefreshCw, Flame, Calendar, Sparkles, CheckCheck, XCircle, ArrowUpDown, Loader2, Filter, BookOpen, Utensils, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PendingReviewQueueProps {
  onReviewComplete: () => void;
  refreshKey: number;
  initialFilter?: 'all' | 'auto-approved';
}

interface PendingEntry extends EnrichmentQueueEntry {
  pepper: Pepper | null;
}

type SortOption = 'newest' | 'oldest' | 'confidence-high' | 'confidence-low' | 'heat-high' | 'heat-low';
type ConfidenceFilter = 'all' | 'high' | 'medium' | 'low';

export function PendingReviewQueue({ onReviewComplete, refreshKey, initialFilter }: PendingReviewQueueProps) {
  const [entries, setEntries] = useState<PendingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<PendingEntry | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('confidence-high');
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('all');
  
  const { approve, reject, deleteEntry, deleteSelected } = usePepperEnrichment();
  const { toast } = useToast();

  const fetchPendingEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pepper_enrichment_queue')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map pepper data to each entry
      const entriesWithPeppers: PendingEntry[] = (data || []).map((entry) => ({
        ...(entry as unknown as EnrichmentQueueEntry),
        pepper: peppers.find((p) => p.id === entry.pepper_id) || null,
      }));

      setEntries(entriesWithPeppers);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Error fetching pending entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingEntries();
  }, [fetchPendingEntries, refreshKey]);

  // Filter by confidence
  const filteredEntries = entries.filter((entry) => {
    const score = entry.confidence_score ?? 0;
    switch (confidenceFilter) {
      case 'high': return score >= 85;
      case 'medium': return score >= 70 && score < 85;
      case 'low': return score < 70;
      default: return true;
    }
  });

  // Get counts for filter badges
  const filterCounts = {
    all: entries.length,
    high: entries.filter(e => (e.confidence_score ?? 0) >= 85).length,
    medium: entries.filter(e => (e.confidence_score ?? 0) >= 70 && (e.confidence_score ?? 0) < 85).length,
    low: entries.filter(e => (e.confidence_score ?? 0) < 70).length,
  };

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'confidence-high':
        return (b.confidence_score ?? 0) - (a.confidence_score ?? 0);
      case 'confidence-low':
        return (a.confidence_score ?? 0) - (b.confidence_score ?? 0);
      case 'heat-high':
        return (b.pepper?.scovilleMax ?? 0) - (a.pepper?.scovilleMax ?? 0);
      case 'heat-low':
        return (a.pepper?.scovilleMax ?? 0) - (b.pepper?.scovilleMax ?? 0);
      default:
        return 0;
    }
  });

  // Truncate text helper
  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return null;
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleReview = (entry: PendingEntry) => {
    setSelectedEntry(entry);
    setReviewModalOpen(true);
  };

  const handleReviewComplete = () => {
    setSelectedEntry(null);
    fetchPendingEntries();
    onReviewComplete();
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEntries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEntries.map(e => e.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    
    setIsBulkProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      const success = await approve(id, undefined, 'Bulk approved');
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    toast({
      title: 'Bulk Approve Complete',
      description: `${successCount} approved${failCount > 0 ? `, ${failCount} failed` : ''}`,
    });

    setIsBulkProcessing(false);
    fetchPendingEntries();
    onReviewComplete();
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    
    setIsBulkProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      const success = await reject(id, 'Bulk rejected');
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    toast({
      title: 'Bulk Reject Complete',
      description: `${successCount} rejected${failCount > 0 ? `, ${failCount} failed` : ''}`,
    });

    setIsBulkProcessing(false);
    fetchPendingEntries();
    onReviewComplete();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setIsBulkProcessing(true);
    await deleteSelected(Array.from(selectedIds));
    setIsBulkProcessing(false);
    fetchPendingEntries();
    onReviewComplete();
  };

  const handleDelete = async (id: string) => {
    const success = await deleteEntry(id);
    if (success) {
      fetchPendingEntries();
      onReviewComplete();
    }
  };

  const getHeatBadgeColor = (scovilleMax: number) => {
    if (scovilleMax >= 100000) return 'bg-red-600 text-white';
    if (scovilleMax >= 30000) return 'bg-orange-500 text-white';
    if (scovilleMax >= 5000) return 'bg-amber-500 text-white';
    return 'bg-yellow-400 text-ink';
  };

  const getConfidenceBadge = (score: number | null) => {
    if (score === null) return null;
    if (score >= 85) return <Badge className="bg-green-600 text-white text-xs">{score}%</Badge>;
    if (score >= 70) return <Badge className="bg-amber-500 text-white text-xs">{score}%</Badge>;
    return <Badge className="bg-red-500 text-white text-xs">{score}%</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-ink/40 py-12">
        <Sparkles className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-sm font-medium">No pending enrichments</p>
        <p className="text-xs mt-1">Run enrichment on peppers to generate proposals</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPendingEntries}
          className="mt-4"
        >
          <RefreshCw className="w-3 h-3 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with filters and bulk actions */}
      <div className="p-3 border-b border-ink/10 bg-parchment-dark/10 space-y-2">
        {/* Confidence Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-3 h-3 text-ink/50" />
          <ToggleGroup type="single" value={confidenceFilter} onValueChange={(v) => v && setConfidenceFilter(v as ConfidenceFilter)} className="gap-1">
            <ToggleGroupItem value="all" size="sm" className="h-6 px-2 text-xs data-[state=on]:bg-ink/10">
              All <Badge variant="secondary" className="ml-1 text-[10px] px-1">{filterCounts.all}</Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="high" size="sm" className="h-6 px-2 text-xs data-[state=on]:bg-green-100 data-[state=on]:text-green-700">
              High <Badge className="ml-1 text-[10px] px-1 bg-green-600">{filterCounts.high}</Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="medium" size="sm" className="h-6 px-2 text-xs data-[state=on]:bg-amber-100 data-[state=on]:text-amber-700">
              Medium <Badge className="ml-1 text-[10px] px-1 bg-amber-500">{filterCounts.medium}</Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="low" size="sm" className="h-6 px-2 text-xs data-[state=on]:bg-red-100 data-[state=on]:text-red-700">
              Low <Badge className="ml-1 text-[10px] px-1 bg-red-500">{filterCounts.low}</Badge>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {filteredEntries.length} showing
            </Badge>
            {selectedIds.size > 0 && (
              <Badge variant="outline" className="text-xs">
                {selectedIds.size} selected
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <ArrowUpDown className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confidence-high">Confidence ↓</SelectItem>
                <SelectItem value="confidence-low">Confidence ↑</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="heat-high">Hottest first</SelectItem>
                <SelectItem value="heat-low">Mildest first</SelectItem>
              </SelectContent>
            </Select>

            {/* Bulk actions */}
            {selectedIds.size > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={isBulkProcessing}
                  className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50"
                >
                  {isBulkProcessing ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <CheckCheck className="w-3 h-3 mr-1" />
                  )}
                  Approve ({selectedIds.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkReject}
                  disabled={isBulkProcessing}
                  className="h-7 text-xs text-red-700 border-red-300 hover:bg-red-50"
                >
                  {isBulkProcessing ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isBulkProcessing}
                  className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  {isBulkProcessing ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3 mr-1" />
                  )}
                  Delete
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPendingEntries}
              className="h-7"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={selectedIds.size === filteredEntries.length && filteredEntries.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Pepper</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Heat</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Confidence</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Created</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => (
              <TableRow 
                key={entry.id} 
                className={`cursor-pointer hover:bg-parchment-dark/10 ${selectedIds.has(entry.id) ? 'bg-primary/5' : ''}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(entry.id)}
                    onCheckedChange={() => toggleSelection(entry.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <HoverCard openDelay={300} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="flex flex-col cursor-help">
                        <span className="text-sm hover:text-primary transition-colors">
                          {entry.pepper?.name || entry.pepper_id}
                        </span>
                        {entry.pepper?.origin && (
                          <span className="text-xs text-ink/50">{entry.pepper.origin}</span>
                        )}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" align="start" className="w-80 bg-parchment border-ink/20 shadow-lg">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-semibold text-sm">{entry.pepper?.name}</h4>
                          {getConfidenceBadge(entry.confidence_score)}
                        </div>
                        
                        {entry.proposed_description && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-ink/70 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> Description
                            </p>
                            <p className="text-xs text-ink/80 leading-relaxed">
                              {truncateText(entry.proposed_description, 200)}
                            </p>
                          </div>
                        )}
                        
                        {entry.proposed_historical_notes && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-ink/70">Historical Notes</p>
                            <p className="text-xs text-ink/80 leading-relaxed">
                              {truncateText(entry.proposed_historical_notes, 150)}
                            </p>
                          </div>
                        )}
                        
                        {(entry.proposed_flavor_notes || entry.proposed_culinary_uses) && (
                          <div className="flex gap-4 text-xs">
                            {entry.proposed_flavor_notes && (
                              <div>
                                <span className="font-medium text-ink/70">Flavor:</span>
                                <span className="ml-1 text-ink/80">{truncateText(entry.proposed_flavor_notes, 50)}</span>
                              </div>
                            )}
                            {entry.proposed_culinary_uses && (
                              <div className="flex items-center gap-1">
                                <Utensils className="w-3 h-3 text-ink/50" />
                                <span className="text-ink/80">{truncateText(entry.proposed_culinary_uses, 50)}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className="text-[10px] text-ink/50 italic pt-1 border-t border-ink/10">
                          Click "Review" to see full details
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  {entry.pepper && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs flex items-center gap-1 w-fit ${getHeatBadgeColor(entry.pepper.scovilleMax)}`}
                    >
                      <Flame className="w-3 h-3" />
                      {entry.pepper.scovilleMax >= 1000 
                        ? `${(entry.pepper.scovilleMax / 1000).toFixed(0)}K`
                        : entry.pepper.scovilleMax}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {getConfidenceBadge(entry.confidence_score)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-ink/60">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReview(entry)}
                      className="h-7 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {selectedEntry?.pepper && (
        <EnrichmentReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          pepper={selectedEntry.pepper}
          queueEntry={selectedEntry}
          onComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}
