import { useState, useEffect, useCallback } from 'react';
import { peppers } from '@/data/peppers';
import { Pepper } from '@/data/pepperTypes';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Circle, CheckCircle, Clock, AlertCircle, CheckSquare, Square } from 'lucide-react';

interface EnrichmentPepperListProps {
  onSelectPepper: (pepper: Pepper) => void;
  selectedPepperId?: string;
  onSelectionChange?: (selectedPeppers: Pepper[]) => void;
  batchMode?: boolean;
}

export type EnrichmentStatus = 'none' | 'researched' | 'pending' | 'enriched';

export function EnrichmentPepperList({ 
  onSelectPepper, 
  selectedPepperId,
  onSelectionChange,
  batchMode = false,
}: EnrichmentPepperListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pepperStatuses, setPepperStatuses] = useState<Map<string, EnrichmentStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchStatuses = useCallback(async () => {
    try {
      // Fetch all overrides with enrichment_version > 0
      const { data: overrides } = await supabase
        .from('pepper_overrides')
        .select('pepper_id, enrichment_version');

      // Fetch pending queue entries
      const { data: pendingQueue } = await supabase
        .from('pepper_enrichment_queue')
        .select('pepper_id')
        .eq('status', 'pending');

      // Fetch peppers with research
      const { data: research } = await supabase
        .from('pepper_research')
        .select('pepper_id');

      const statusMap = new Map<string, EnrichmentStatus>();

      // Mark enriched peppers
      overrides?.forEach((o: any) => {
        if (o.enrichment_version && o.enrichment_version > 0) {
          statusMap.set(o.pepper_id, 'enriched');
        }
      });

      // Mark pending peppers (overrides enriched status)
      pendingQueue?.forEach((p: any) => {
        if (!statusMap.has(p.pepper_id) || statusMap.get(p.pepper_id) !== 'enriched') {
          statusMap.set(p.pepper_id, 'pending');
        }
      });

      // Mark researched peppers
      research?.forEach((r: any) => {
        if (!statusMap.has(r.pepper_id)) {
          statusMap.set(r.pepper_id, 'researched');
        }
      });

      setPepperStatuses(statusMap);
    } catch (err) {
      console.error('Error fetching pepper statuses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const filteredPeppers = peppers.filter(pepper =>
    pepper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pepper.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = useCallback((pepper: Pepper) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(pepper.id)) {
        next.delete(pepper.id);
      } else {
        next.add(pepper.id);
      }
      
      if (onSelectionChange) {
        const selectedPeppers = peppers.filter(p => next.has(p.id));
        onSelectionChange(selectedPeppers);
      }
      
      return next;
    });
  }, [onSelectionChange]);

  const handleSelectAll = useCallback(() => {
    const unselectedFiltered = filteredPeppers.filter(p => !selectedIds.has(p.id));
    if (unselectedFiltered.length > 0) {
      // Select all filtered
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredPeppers.forEach(p => next.add(p.id));
        if (onSelectionChange) {
          const selectedPeppers = peppers.filter(p => next.has(p.id));
          onSelectionChange(selectedPeppers);
        }
        return next;
      });
    } else {
      // Deselect all filtered
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredPeppers.forEach(p => next.delete(p.id));
        if (onSelectionChange) {
          const selectedPeppers = peppers.filter(p => next.has(p.id));
          onSelectionChange(selectedPeppers);
        }
        return next;
      });
    }
  }, [filteredPeppers, selectedIds, onSelectionChange]);

  const handleSelectByStatus = useCallback((status: EnrichmentStatus) => {
    const peppersWithStatus = filteredPeppers.filter(p => 
      (pepperStatuses.get(p.id) || 'none') === status
    );
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      peppersWithStatus.forEach(p => next.add(p.id));
      if (onSelectionChange) {
        const selectedPeppers = peppers.filter(p => next.has(p.id));
        onSelectionChange(selectedPeppers);
      }
      return next;
    });
  }, [filteredPeppers, pepperStatuses, onSelectionChange]);

  const getStatusIcon = (status: EnrichmentStatus) => {
    switch (status) {
      case 'enriched':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'researched':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-ink/30" />;
    }
  };

  const getStatusBadge = (status: EnrichmentStatus) => {
    switch (status) {
      case 'enriched':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Enriched</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Pending</Badge>;
      case 'researched':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Researched</Badge>;
      default:
        return null;
    }
  };

  const allFilteredSelected = filteredPeppers.length > 0 && 
    filteredPeppers.every(p => selectedIds.has(p.id));

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-ink/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <Input
            placeholder="Search peppers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-parchment border-ink/20 text-sm"
          />
        </div>
        
        {batchMode && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs h-7"
            >
              {allFilteredSelected ? (
                <>
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="w-3 h-3 mr-1" />
                  Select All
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectByStatus('none')}
              className="text-xs h-7"
            >
              Select Unenriched
            </Button>
            {selectedIds.size > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedIds.size} selected
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-3 text-xs text-ink/60">
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3" /> None
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-blue-600" /> Researched
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" /> Enriched
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="text-center py-8 text-ink/50 text-sm">Loading...</div>
          ) : (
            filteredPeppers.map((pepper) => {
              const status = pepperStatuses.get(pepper.id) || 'none';
              const isSelected = pepper.id === selectedPepperId;
              const isChecked = selectedIds.has(pepper.id);

              return (
                <div
                  key={pepper.id}
                  className={`flex items-center gap-2 p-3 rounded transition-colors ${
                    isSelected
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-parchment-dark/30 border border-transparent'
                  }`}
                >
                  {batchMode && (
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleSelect(pepper)}
                      className="border-ink/30"
                    />
                  )}
                  <button
                    onClick={() => onSelectPepper(pepper)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm text-ink truncate">
                            {pepper.name}
                          </span>
                          {getStatusBadge(status)}
                        </div>
                        <div className="text-xs text-ink/50 mt-0.5 truncate">
                          {pepper.origin}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
