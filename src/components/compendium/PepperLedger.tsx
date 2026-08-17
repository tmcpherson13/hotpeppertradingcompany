import { useEffect, useState } from 'react';
import { Pepper, speciesDisplayNames, ancestralSpeciesList, AncestralSpecies, PepperImage } from '@/data/peppers';
import { PepperType } from '@/data/pepperTypes';
import { PepperTypeBadge } from './PepperTypeBadge';
import { Package, ChevronRight, Camera, FileText } from 'lucide-react';
import { getPepperImage } from '@/data/pepperImages';
import { applyGalleryOrder } from '@/utils/galleryOrder';
import { usePepperOverrides } from '@/hooks/usePepperOverrides';
import { useEnrichmentStatus } from '@/hooks/useEnrichmentStatus';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import logoDark from '@/assets/logo-dark.svg';

// Resolve the thumbnail for a card, respecting the "image on the left is the
// display" rule. Precedence:
//   1. The leftmost gallery image, kept in sync by the gallery editor
//      (PepperGallery writes it to localStorage). A manual arrangement always
//      wins so it sticks on the card.
//   2. The curated primary-image override (Wikimedia photo / AI studio shot) as
//      the default until the user arranges a leftmost image.
//   3. The gallery's default order, then legacy sources.
const getPrimaryImage = (pepper: Pepper, overrideImageUrl?: string): string | undefined => {
  try {
    const chosen = localStorage.getItem(`pepper-primary-image-${pepper.id}`);
    if (chosen) return chosen;
  } catch {
    // ignore storage errors
  }

  if (overrideImageUrl) return overrideImageUrl;

  if (pepper.gallery && pepper.gallery.length > 0) {
    const orderedGallery = applyGalleryOrder(pepper.id, pepper.gallery);
    return orderedGallery[0]?.url;
  }
  if (pepper.imageUrl) return pepper.imageUrl;
  return getPepperImage(pepper.id);
};

interface PepperLedgerProps {
  peppers: Pepper[];
  onSelectPepper: (pepper: Pepper) => void;
}

const getHeatColor = (level: string) => {
  switch (level) {
    case 'No Heat': return 'bg-gray-400';
    case 'Very Mild': return 'bg-green-500';
    case 'Mild': return 'bg-green-700';
    case 'Medium': return 'bg-yellow-600';
    case 'Hot': return 'bg-orange-500';
    case 'Very Hot': return 'bg-orange-600';
    case 'Extreme': return 'bg-red-600';
    case 'Superhot': return 'bg-red-900';
    default: return 'bg-muted';
  }
};

const formatScoville = (min: number, max: number) => {
  const formatNum = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return `${n}`;
  };
  return `${formatNum(min)}–${formatNum(max)}`;
};


export function PepperLedger({ peppers, onSelectPepper }: PepperLedgerProps) {
  const [, forceRender] = useState(0);
  const { getOverride } = usePepperOverrides();
  const { getStatus } = useEnrichmentStatus();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handler = () => forceRender((v) => v + 1);
    window.addEventListener('pepper-thumbnail-changed', handler);
    window.addEventListener('gallery-order-changed', handler);

    return () => {
      window.removeEventListener('pepper-thumbnail-changed', handler);
      window.removeEventListener('gallery-order-changed', handler);
    };
  }, []);

  if (peppers.length === 0) {
    return (
      <div className="text-center py-16 bg-[#f5efe6] border border-[#5a4a3a]/20">
        <p className="font-body text-[#5a4a3a] italic">
          No entries match the current search criteria.
        </p>
        <p className="font-body text-sm text-[#5a4a3a]/60 mt-2">
          Adjust your filters or search terms to view registry entries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Archival Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {peppers.map((pepper) => {
          const override = getOverride(pepper.id);
          const pepperImage = getPrimaryImage(pepper, override?.image_url);
          const showThumbnail = !!pepperImage;

          // Use override values if available
          const displayOrigin = override?.origin ?? pepper.origin;
          const displayHeatLevel = override?.heat_level ?? pepper.heatLevel;
          const displayScovilleMin = override?.scoville_min ?? pepper.scovilleMin;
          const displayScovilleMax = override?.scoville_max ?? pepper.scovilleMax;
          const displayType = ((override?.pepper_type ?? pepper.pepperType) || undefined) as PepperType | undefined;

          return (
          <button
            key={pepper.id}
            onClick={() => onSelectPepper(pepper)}
            className="group text-left bg-[#f8f3eb] border border-[#5a4a3a]/25 hover:border-[#5a4a3a]/40 
              transition-all duration-200 hover:shadow-lg relative overflow-hidden"
          >
            {/* Decorative corner stamps */}
            <div className="absolute top-0 left-0 w-8 h-8 border-b border-r border-[#5a4a3a]/10" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r border-[#5a4a3a]/10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l border-[#5a4a3a]/10" />

            {/* Admin Status Badges - top left corner */}
            {isAdmin && (() => {
              const status = getStatus(pepper.id);
              const hasBadges = status.enrichmentStatus === 'pending' || status.imageStatus !== 'none';
              if (!hasBadges) return null;
              return (
                <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 max-w-[calc(100%-6rem)]">
                  {status.enrichmentStatus === 'pending' && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-[9px] px-1.5 py-0.5 h-auto font-heading uppercase tracking-wide">
                      <FileText className="w-2.5 h-2.5 mr-0.5" />
                      Review
                    </Badge>
                  )}
                  {status.imageStatus === 'pending' && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-[9px] px-1.5 py-0.5 h-auto font-heading uppercase tracking-wide">
                      <Camera className="w-2.5 h-2.5 mr-0.5" />
                      Pending
                    </Badge>
                  )}
                  {status.imageStatus === 'has_images' && (
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 text-[9px] px-1.5 py-0.5 h-auto font-heading uppercase tracking-wide">
                      <Camera className="w-2.5 h-2.5 mr-0.5" />
                      Images
                    </Badge>
                  )}
                </div>
              );
            })()}

            {/* Logo watermark in top right */}
            <div className="absolute top-2 right-2 z-0 opacity-20">
              <img src={logoDark} alt="" className="w-20 h-20 object-contain" />
            </div>

            {/* In Stock Badge - positioned below logo (logo is top-2 + h-20 = ~88px) */}
            {pepper.inStock && (
              <div className="absolute top-[75px] right-2 z-10">
                <div className="flex items-center gap-1 px-2 py-1 bg-[#2d5a3d] text-[#f5efe6] 
                  text-[10px] font-heading uppercase tracking-wider border border-[#2d5a3d]/80
                  shadow-sm">
                  <Package className="w-3 h-3" />
                  <span>In Cargo</span>
                </div>
              </div>
            )}

            {/* Card Header with Thumbnail */}
            <div className={`border-b border-[#5a4a3a]/15 bg-[#e8dcc4]/40 ${showThumbnail ? 'flex items-center gap-3 p-3' : 'px-4 pt-4 pb-3'}`}>
              {/* Thumbnail - only on first card for review */}
              {showThumbnail && (
                <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden border border-[#5a4a3a]/20 bg-[#f5efe6] hover:scale-[3] hover:z-50 transition-transform duration-200 relative origin-left">
                  <img
                    src={pepperImage} 
                    alt={pepper.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className={showThumbnail ? 'flex-1 min-w-0' : ''}>
                <h3 className={`font-display text-base uppercase tracking-[0.08em] text-[#3a2a1a] 
                  group-hover:text-[#8b2942] transition-colors leading-tight ${!showThumbnail ? 'pr-16' : ''}`}>
                  {pepper.name}
                </h3>
                <p className="font-body text-xs italic text-[#5a4a3a]/70 mt-1">
                  {ancestralSpeciesList.includes(pepper.species as AncestralSpecies) && (
                    <span className="text-[#6b5b4d] not-italic font-heading text-[9px] uppercase tracking-wider mr-2 
                      px-1.5 py-0.5 bg-[#d4a84b]/15 border border-[#d4a84b]/30">
                      Ancestral
                    </span>
                  )}
                  {speciesDisplayNames[pepper.species] || pepper.scientificName}
                </p>
                {displayType && (
                  <div className="mt-1.5">
                    <PepperTypeBadge type={displayType} />
                  </div>
                )}
              </div>
            </div>

            {/* Card Body - Ledger Lines */}
            <div className="px-4 py-3 space-y-2">
              {/* Provenance Row */}
              <div className="flex items-baseline justify-between border-b border-dotted border-[#5a4a3a]/20 pb-1">
                <span className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/50">
                  Provenance
                </span>
                <span className="font-body text-sm text-[#3a2a1a]">
                  {displayOrigin}
                </span>
              </div>

              {/* Pungency Row */}
              <div className="flex items-center justify-between border-b border-dotted border-[#5a4a3a]/20 pb-1">
                <span className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/50">
                  Pungency
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getHeatColor(displayHeatLevel)}`} />
                  <span className="font-body text-sm text-[#3a2a1a]">
                    {displayHeatLevel}
                  </span>
                </div>
              </div>

              {/* Scoville Row */}
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/50">
                  Scoville
                </span>
                <span className="font-body text-sm text-[#3a2a1a]">
                  {formatScoville(displayScovilleMin, displayScovilleMax)} <span className="text-[#5a4a3a]/50 text-xs">SHU</span>
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-2 bg-[#e8dcc4]/30 border-t border-[#5a4a3a]/10 
              flex items-center justify-between">
              <span className="font-body text-[10px] italic text-[#5a4a3a]/50">
                View Trade Record
              </span>
              <ChevronRight className="w-4 h-4 text-[#5a4a3a]/30 group-hover:text-[#8b2942] 
                transition-colors group-hover:translate-x-0.5 transform" />
            </div>
          </button>
        );
        })}
      </div>

      {/* Registry Footer */}
      <div className="px-6 py-3 bg-[#f5efe6] border border-[#5a4a3a]/15 flex items-center justify-between">
        <span className="font-body text-[10px] text-[#5a4a3a]/50 italic">
          {peppers.length} {peppers.length === 1 ? 'entry' : 'entries'} in registry
        </span>
        <span className="font-body text-[10px] text-[#5a4a3a]/50">
          Select entry to view trade record
        </span>
      </div>
    </div>
  );
}
