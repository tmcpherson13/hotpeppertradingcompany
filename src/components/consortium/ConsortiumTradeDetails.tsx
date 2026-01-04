import { getConsortiumById } from '@/data/consortiums';

interface ConsortiumTradeDetailsProps {
  consortiumId: string;
  heatRange: string;
}

/**
 * Shared Trade Details component for consortium modals.
 * Pulls weight and price from the canonical data source to ensure consistency.
 */
export function ConsortiumTradeDetails({ consortiumId, heatRange }: ConsortiumTradeDetailsProps) {
  const consortium = getConsortiumById(consortiumId);
  
  // Fallback values if consortium not found (shouldn't happen)
  const weight = consortium?.weight ?? "5 × 2oz";
  const price = consortium?.price ?? "$21.00";

  return (
    <div className="flex items-center justify-center gap-8 py-4 border-t border-dashed border-ink/20">
      <div className="text-center">
        <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Weight</span>
        <span className="font-display text-ink">{weight}</span>
      </div>
      <div className="text-center">
        <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Price</span>
        <span className="font-display text-primary text-lg">{price}</span>
      </div>
      <div className="text-center">
        <span className="block text-xs uppercase tracking-wider text-muted-foreground font-heading">Heat Range</span>
        <span className="font-display text-ink">{heatRange}</span>
      </div>
    </div>
  );
}
