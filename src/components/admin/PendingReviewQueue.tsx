import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { peppers } from '@/data/peppers';
import { Pepper } from '@/data/pepperTypes';
import { EnrichmentQueueEntry } from '@/hooks/usePepperEnrichment';
import { EnrichmentReviewModal } from './EnrichmentReviewModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, RefreshCw, Flame, Calendar, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PendingReviewQueueProps {
  onReviewComplete: () => void;
  refreshKey: number;
}

interface PendingEntry extends EnrichmentQueueEntry {
  pepper: Pepper | null;
}

export function PendingReviewQueue({ onReviewComplete, refreshKey }: PendingReviewQueueProps) {
  const [entries, setEntries] = useState<PendingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<PendingEntry | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

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
    } catch (err) {
      console.error('Error fetching pending entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingEntries();
  }, [fetchPendingEntries, refreshKey]);

  const handleReview = (entry: PendingEntry) => {
    setSelectedEntry(entry);
    setReviewModalOpen(true);
  };

  const handleReviewComplete = () => {
    setSelectedEntry(null);
    fetchPendingEntries();
    onReviewComplete();
  };

  const getHeatBadgeColor = (scovilleMax: number) => {
    if (scovilleMax >= 100000) return 'bg-red-600 text-white';
    if (scovilleMax >= 30000) return 'bg-orange-500 text-white';
    if (scovilleMax >= 5000) return 'bg-amber-500 text-white';
    return 'bg-yellow-400 text-ink';
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
      <div className="p-3 border-b border-ink/10 bg-parchment-dark/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {entries.length} pending
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchPendingEntries}
          className="h-7"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider">Pepper</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Heat</TableHead>
              <TableHead className="text-xs uppercase tracking-wider">Created</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className="cursor-pointer hover:bg-parchment-dark/10">
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
