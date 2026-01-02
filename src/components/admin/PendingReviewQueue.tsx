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
import { Eye, RefreshCw, Flame, Calendar, Sparkles, CheckCheck, XCircle, ArrowUpDown, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PendingReviewQueueProps {
  onReviewComplete: () => void;
  refreshKey: number;
}

interface PendingEntry extends EnrichmentQueueEntry {
  pepper: Pepper | null;
}

type SortOption = 'newest' | 'oldest' | 'confidence-high' | 'confidence-low' | 'heat-high' | 'heat-low';

export function PendingReviewQueue({ onReviewComplete, refreshKey }: PendingReviewQueueProps) {
  const [entries, setEntries] = useState<PendingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<PendingEntry | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('confidence-high');
  
  const { approve, reject } = usePepperEnrichment();
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

  // Sort entries
  const sortedEntries = [...entries].sort((a, b) => {
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
    if (selectedIds.size === entries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(entries.map(e => e.id)));
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
      {/* Header with bulk actions */}
      <div className="p-3 border-b border-ink/10 bg-parchment-dark/10 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {entries.length} pending
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

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={selectedIds.size === entries.length && entries.length > 0}
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
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {entry.pepper?.name || entry.pepper_id}
                    </span>
                    {entry.pepper?.origin && (
                      <span className="text-xs text-ink/50">{entry.pepper.origin}</span>
                    )}
                  </div>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(entry)}
                    className="h-7 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Review
                  </Button>
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
