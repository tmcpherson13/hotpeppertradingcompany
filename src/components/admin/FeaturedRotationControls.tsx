import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw, Calendar, Star, Clock } from 'lucide-react';
import { getNextRotationDate, getDaysUntilNextRotation } from '@/hooks/useFeaturedConsortium';

const CONSORTIUM_NAMES = [
  'Cradle of Fire',
  'Southern Crucible',
  'Andean Diaspora',
  'The Windward Passage',
  'Phoenician Legacy',
  'Silk & Jade Passages',
  'Atlantic Provenance',
  'Letter of Marque',
  'Manila Galleon',
  'Old Natchez Trace',
];

interface FeaturedConsortium {
  id: string;
  consortium_index: number;
  last_rotated_at: string;
  updated_at: string;
}

export function FeaturedRotationControls() {
  const queryClient = useQueryClient();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured-consortium-admin'],
    queryFn: async (): Promise<FeaturedConsortium | null> => {
      const { data, error } = await supabase
        .from('featured_consortium')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching featured consortium:', error);
        return null;
      }

      return data as FeaturedConsortium;
    },
  });

  const manualRotateMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rotate-featured-consortium`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Rotation failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['featured-consortium'] });
      queryClient.invalidateQueries({ queryKey: ['featured-consortium-admin'] });
      toast.success(`Rotated to: ${CONSORTIUM_NAMES[data.new_index]}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const setSpecificMutation = useMutation({
    mutationFn: async (index: number) => {
      const { error } = await supabase
        .from('featured_consortium')
        .update({ 
          consortium_index: index, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', featured?.id || '');

      if (error) throw error;
      return index;
    },
    onSuccess: (index) => {
      queryClient.invalidateQueries({ queryKey: ['featured-consortium'] });
      queryClient.invalidateQueries({ queryKey: ['featured-consortium-admin'] });
      toast.success(`Featured consortium set to: ${CONSORTIUM_NAMES[index]}`);
      setSelectedIndex(null);
    },
    onError: () => {
      toast.error('Failed to update featured consortium');
    },
  });

  const handleRotate = async () => {
    setIsRotating(true);
    await manualRotateMutation.mutateAsync();
    setIsRotating(false);
  };

  const handleSetSpecific = () => {
    if (selectedIndex !== null) {
      setSpecificMutation.mutate(selectedIndex);
    }
  };

  const nextRotation = getNextRotationDate();
  const daysUntil = getDaysUntilNextRotation();

  if (isLoading) {
    return (
      <div className="p-6 bg-parchment border border-ink/20 rounded-lg animate-pulse">
        <div className="h-6 bg-ink/10 rounded w-1/3 mb-4" />
        <div className="h-4 bg-ink/10 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-parchment border border-ink/20 rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-gold" />
          <h3 className="font-display text-lg uppercase tracking-wide text-ink">
            Featured Consortium Rotation
          </h3>
        </div>
        <Badge className="bg-tyrian/90 text-gold border-none">
          Admin Control
        </Badge>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-parchment-dark/30 p-4 rounded border border-ink/10">
          <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading mb-1">
            Currently Featured
          </span>
          <span className="font-display text-ink text-lg">
            {featured ? CONSORTIUM_NAMES[featured.consortium_index] : 'None'}
          </span>
        </div>
        
        <div className="bg-parchment-dark/30 p-4 rounded border border-ink/10">
          <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading mb-1">
            Last Rotated
          </span>
          <span className="font-display text-ink">
            {featured ? new Date(featured.last_rotated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }) : 'Never'}
          </span>
        </div>
        
        <div className="bg-parchment-dark/30 p-4 rounded border border-ink/10">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-heading">
              Next Auto-Rotation
            </span>
          </div>
          <span className="font-display text-ink">
            {daysUntil === 7 ? 'Today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
          </span>
          <span className="block text-xs text-muted-foreground mt-1">
            {nextRotation.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Manual Controls */}
      <div className="border-t border-ink/20 pt-6 space-y-4">
        <h4 className="font-heading text-sm uppercase tracking-wider text-ink/70">
          Manual Controls
        </h4>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Rotate to Next */}
          <Button
            onClick={handleRotate}
            disabled={isRotating || manualRotateMutation.isPending}
            className="flex items-center gap-2 bg-tyrian hover:bg-tyrian-dark text-parchment"
          >
            <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
            Rotate to Next
          </Button>

          {/* Set Specific */}
          <div className="flex gap-2 flex-1">
            <Select
              value={selectedIndex?.toString() ?? ''}
              onValueChange={(value) => setSelectedIndex(parseInt(value))}
            >
              <SelectTrigger className="flex-1 bg-parchment border-ink/30">
                <SelectValue placeholder="Select a consortium..." />
              </SelectTrigger>
              <SelectContent className="bg-parchment border-ink/30">
                {CONSORTIUM_NAMES.map((name, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="font-body"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">№ {String(index + 1).padStart(3, '0')}</span>
                      {name}
                      {featured?.consortium_index === index && (
                        <Badge variant="outline" className="text-[9px] ml-2">Current</Badge>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSetSpecific}
              disabled={selectedIndex === null || setSpecificMutation.isPending}
              variant="outline"
              className="border-ink/30"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Set
            </Button>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="text-xs text-muted-foreground font-body bg-parchment-dark/20 p-3 rounded border border-ink/10">
        <p>
          The featured consortium automatically rotates every Sunday at midnight (UTC) via a scheduled job.
          Use the manual controls above to override the current selection or trigger an immediate rotation.
        </p>
      </div>
    </div>
  );
}
