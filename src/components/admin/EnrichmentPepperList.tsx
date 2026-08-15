import { useState, useEffect, useCallback } from 'react';
import { peppers } from '@/data/peppers';
import { Pepper } from '@/data/pepperTypes';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Circle, CheckCircle, Clock, AlertCircle, CheckSquare, Square, Package, Camera, CameraOff, Wand2 } from 'lucide-react';

interface EnrichmentPepperListProps {
  onSelectPepper: (pepper: Pepper) => void;
  selectedPepperId?: string;
  onSelectionChange?: (selectedPeppers: Pepper[]) => void;
  batchMode?: boolean;
}

export type EnrichmentStatus = 'none' | 'researched' | 'pending' | 'enriched';
export type ImageStatus = 'no_images' | 'has_proposals' | 'has_images';

export function EnrichmentPepperList({ 
  onSelectPepper, 
  selectedPepperId,
  onSelectionChange,
  batchMode = false,
}: EnrichmentPepperListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pepperStatuses, setPepperStatuses] = useState<Map<string, EnrichmentStatus>>(new Map());
  const [imageStatuses, setImageStatuses] = useState<Map<string, ImageStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showNeedsImages, setShowNeedsImages] = useState(false);

  const inStockPeppers = peppers.filter(p => p.inStock);
  const inStockCount = inStockPeppers.length;

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

      // Fetch image proposals
      const { data: imageProposals } = await supabase
        .from('pepper_image_proposals')
        .select('pepper_id, status');

      const statusMap = new Map<string, EnrichmentStatus>();
      const imageMap = new Map<string, ImageStatus>();

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

      // Build image status map
      imageProposals?.forEach((ip: any) => {
        const currentStatus = imageMap.get(ip.pepper_id);
        if (ip.status === 'approved') {
          imageMap.set(ip.pepper_id, 'has_images');
        } else if (ip.status === 'pending' && currentStatus !== 'has_images') {
          imageMap.set(ip.pepper_id, 'has_proposals');
        }
      });

      setPepperStatuses(statusMap);
      setImageStatuses(imageMap);
    } catch (err) {
      console.error('Error fetching pepper statuses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const filteredPeppers = peppers.filter(pepper => {
    const matchesSearch = pepper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pepper.origin.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showNeedsImages) {
      // Show only enriched peppers without approved images
      const enrichmentStatus = pepperStatuses.get(pepper.id) || 'none';
      const imageStatus = imageStatuses.get(pepper.id);
      return matchesSearch && 
        (enrichmentStatus === 'enriched' || enrichmentStatus === 'pending') && 
        imageStatus !== 'has_images';
    }
    
    return matchesSearch;
  });

  const needsImagesCount = peppers.filter(p => {
    const enrichmentStatus = pepperStatuses.get(p.id) || 'none';
    const imageStatus = imageStatuses.get(p.id);
    return (enrichmentStatus === 'enriched' || enrichmentStatus === 'pending') && 
      imageStatus !== 'has_images';
  }).length;

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

  const handleSelectInStock = useCallback(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      inStockPeppers.forEach(p => next.add(p.id));
      if (onSelectionChange) {
        const selectedPeppers = peppers.filter(p => next.has(p.id));
        onSelectionChange(selectedPeppers);
      }
      return next;
    });
  }, [inStockPeppers, onSelectionChange]);

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

  const handleSelectNeedsImages = useCallback(() => {
    const peppersNeedingImages = filteredPeppers.filter(p => {
      const enrichmentStatus = pepperStatuses.get(p.id) || 'none';
      const imageStatus = imageStatuses.get(p.id);
      return (enrichmentStatus === 'enriched' || enrichmentStatus === 'pending') && 
        imageStatus !== 'has_images';
    });
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      peppersNeedingImages.forEach(p => next.add(p.id));
      if (onSelectionChange) {
        const selectedPeppers = peppers.filter(p => next.has(p.id));
        onSelectionChange(selectedPeppers);
      }
      return next;
    });
  }, [filteredPeppers, pepperStatuses, imageStatuses, onSelectionChange]);

  // Fast-populate helper: select the next batch of up to 25 peppers that still
  // need enriching (not yet enriched, not already pending review), honoring the
  // current search filter. Lets an admin populate the DB 25 at a time.
  const handleSelectNext25 = useCallback(() => {
    const needsEnrichment = filteredPeppers.filter(p => {
      const status = pepperStatuses.get(p.id) || 'none';
      return status !== 'enriched' && status !== 'pending' && !selectedIds.has(p.id);
    });
    const nextBatch = needsEnrichment.slice(0, 25);
    if (nextBatch.length === 0) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      nextBatch.forEach(p => next.add(p.id));
      if (onSelectionChange) {
        onSelectionChange(peppers.filter(p => next.has(p.id)));
      }
      return next;
    });
  }, [filteredPeppers, pepperStatuses, selectedIds, onSelectionChange]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

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

  const getImageIcon = (imageStatus: ImageStatus | undefined) => {
    switch (imageStatus) {
      case 'has_images':
        return <Camera className="w-3 h-3 text-green-600" />;
      case 'has_proposals':
        return <Camera className="w-3 h-3 text-amber-600" />;
      default:
        return <CameraOff className="w-3 h-3 text-ink/30" />;
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
        
        {/* Needs Images Filter Toggle */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant={showNeedsImages ? "default" : "outline"}
            size="sm"
            onClick={() => setShowNeedsImages(!showNeedsImages)}
            className="text-xs h-7"
          >
            <CameraOff className="w-3 h-3 mr-1" />
            Needs Images ({needsImagesCount})
          </Button>
        </div>
        
        {batchMode && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
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
              onClick={handleSelectInStock}
              className="text-xs h-7 text-indigo-600 hover:text-indigo-700"
            >
              <Package className="w-3 h-3 mr-1" />
              In Stock ({inStockCount})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectByStatus('none')}
              className="text-xs h-7"
            >
              Unenriched
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectNext25}
              className="text-xs h-7 text-purple-600 hover:text-purple-700 border-purple-200"
            >
              <Wand2 className="w-3 h-3 mr-1" />
              Next 25
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectNeedsImages}
              className="text-xs h-7 text-orange-600 hover:text-orange-700"
            >
              <CameraOff className="w-3 h-3 mr-1" />
              No Images
            </Button>
            {selectedIds.size > 0 && (
              <>
                <Badge variant="secondary" className="text-xs">
                  {selectedIds.size} selected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-xs h-7 text-red-600 hover:text-red-700"
                >
                  Clear
                </Button>
              </>
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
              const imgStatus = imageStatuses.get(pepper.id);
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
                          {getImageIcon(imgStatus)}
                          {pepper.inStock && (
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 text-[10px] px-1">
                              In Stock
                            </Badge>
                          )}
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
