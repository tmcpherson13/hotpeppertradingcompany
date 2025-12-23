import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pepper, peppers, speciesDisplayNames, PepperImage } from '@/data/peppers';
import { Flame, MapPin, Package } from 'lucide-react';
import { PepperGallery } from './PepperGallery';
import { getPepperImage } from '@/data/pepperImages';
import logoDark from '@/assets/logo-dark.svg';

// Helper to get gallery from pepper (with legacy fallback)
const getGalleryFromPepper = (pepper: Pepper): PepperImage[] => {
  if (pepper.gallery && pepper.gallery.length > 0) {
    return pepper.gallery;
  }
  // Fallback to legacy imageUrl or pepperImages
  const legacyUrl = pepper.imageUrl || getPepperImage(pepper.id);
  if (legacyUrl) {
    return [{
      id: `${pepper.id}-primary`,
      url: legacyUrl,
      type: 'illustration',
      isPrimary: true,
      source: pepper.imageLicense ? 'wikimedia' : 'ai-generated',
      license: pepper.imageLicense,
      author: pepper.attributionText?.replace('Photo by ', '').split(',')[0],
    }];
  }
  return [];
};

interface PepperDetailModalProps {
  pepper: Pepper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPepper: (pepper: Pepper) => void;
}

const getHeatColor = (level: string) => {
  switch (level) {
    case 'No Heat': return 'text-gray-500';
    case 'Very Mild': return 'text-green-600';
    case 'Mild': return 'text-green-700';
    case 'Medium': return 'text-yellow-600';
    case 'Hot': return 'text-orange-500';
    case 'Very Hot': return 'text-orange-600';
    case 'Extreme': return 'text-red-600';
    case 'Superhot': return 'text-red-800';
    default: return 'text-muted-foreground';
  }
};

const formatScoville = (min: number, max: number) => {
  if (min === max) return min.toLocaleString();
  return `${min.toLocaleString()} – ${max.toLocaleString()}`;
};

const generateTradeRouteSummary = (tags: string[], tradeRoute: string): string => {
  if (!tags || tags.length === 0) return tradeRoute;
  
  const hasSeaRoute = tags.some(t => 
    t.toLowerCase().includes('cape') || 
    t.toLowerCase().includes('sea') || 
    t.toLowerCase().includes('atlantic') ||
    t.toLowerCase().includes('mediterranean') ||
    t.toLowerCase().includes('indian ocean')
  );
  
  const hasOverland = tags.some(t => 
    t.toLowerCase().includes('overland') || 
    t.toLowerCase().includes('silk road') ||
    t.toLowerCase().includes('caravan')
  );
  
  const regions = tags.filter(t => 
    !t.toLowerCase().includes('route') && 
    !t.toLowerCase().includes('overland') &&
    !t.toLowerCase().includes('colonial')
  );
  
  let summary = tradeRoute + '. ';
  
  if (hasSeaRoute && hasOverland) {
    summary += `This pepper traveled both sea and overland routes, passing through ${regions.slice(0, 3).join(', ')}.`;
  } else if (hasSeaRoute) {
    summary += `Maritime trade networks carried it across ${regions.slice(0, 2).join(' and ')}.`;
  } else if (hasOverland) {
    summary += `Caravan routes brought it through ${regions.slice(0, 2).join(' and ')}.`;
  } else {
    summary += `Trade connections linked it to ${regions.slice(0, 2).join(' and ')}.`;
  }
  
  return summary;
};

const findRelatedPeppers = (pepper: Pepper, allPeppers: Pepper[]): Pepper[] => {
  const related: Pepper[] = [];
  
  // Find by similar heat level
  const heatOrder = ['No Heat', 'Very Mild', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme', 'Superhot'];
  const currentHeatIndex = heatOrder.indexOf(pepper.heatLevel);
  
  allPeppers.forEach(p => {
    if (p.id === pepper.id) return;
    
    const pHeatIndex = heatOrder.indexOf(p.heatLevel);
    const heatDiff = Math.abs(currentHeatIndex - pHeatIndex);
    
    // Same or adjacent heat level
    if (heatDiff <= 1) {
      related.push(p);
    }
    // Shared trade route tags
    else if (pepper.tradeRouteTags && p.tradeRouteTags) {
      const sharedTags = pepper.tradeRouteTags.filter(tag => 
        p.tradeRouteTags?.includes(tag)
      );
      if (sharedTags.length >= 2) {
        related.push(p);
      }
    }
  });
  
  // Return unique, limit to 3
  const unique = [...new Set(related)];
  return unique.slice(0, 3);
};

export function PepperDetailModal({ pepper, open, onOpenChange, onSelectPepper }: PepperDetailModalProps) {
  if (!pepper) return null;

  const relatedPeppers = findRelatedPeppers(pepper, peppers);
  const tradeRouteSummary = generateTradeRouteSummary(pepper.tradeRouteTags || [], pepper.tradeRoute);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#f5efe6] border-2 border-[#5a4a3a]/30 p-0">
        {/* Header with parchment styling */}
        <div className="bg-[#e8dcc4] px-6 py-5 border-b border-[#5a4a3a]/20 relative">
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#5a4a3a]/30" />
          
          {/* Logo - positioned under pepper name area */}
          <div className="absolute top-16 right-4 opacity-20">
            <img src={logoDark} alt="" className="w-20 h-20 object-contain" />
          </div>
          
          {/* In Stock Badge - positioned 75% from left */}
          {pepper.inStock && (
            <div className="absolute top-4 left-[75%] -translate-x-1/2">
              <div className="flex items-center gap-1 px-2 py-1 bg-[#2d5a3d] text-[#f5efe6] 
                text-[10px] font-heading uppercase tracking-wider border border-[#2d5a3d]/80">
                <Package className="w-3 h-3" />
                <span>In Stock</span>
              </div>
            </div>
          )}
          
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#5a4a3a]/60">
                Registry Entry
              </span>
              <span className="h-px flex-1 bg-[#5a4a3a]/20" />
              <span className="font-body text-xs text-[#5a4a3a]/60 italic">
                {pepper.id.toUpperCase()}
              </span>
            </div>
            <DialogTitle className="font-display text-2xl uppercase tracking-[0.1em] text-[#3a2a1a]">
              {pepper.name}
            </DialogTitle>
            {pepper.alternateNames && pepper.alternateNames.length > 0 && (
              <p className="font-body text-xs text-[#5a4a3a]/50 mt-0.5">
                Also known as: {pepper.alternateNames.join(', ')}
              </p>
            )}
            <p className="font-body text-sm italic text-[#5a4a3a] mt-1">
              {speciesDisplayNames[pepper.species] || pepper.scientificName}
            </p>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Pepper Gallery */}
          {(() => {
            const gallery = getGalleryFromPepper(pepper);
            return gallery.length > 0 ? (
              <PepperGallery gallery={gallery} pepperName={pepper.name} />
            ) : null;
          })()}

          {/* Quick facts grid - Labeled Fields */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#e8dcc4]/50 border border-[#5a4a3a]/10">
              <Flame className={`w-5 h-5 mx-auto mb-1 ${getHeatColor(pepper.heatLevel)}`} />
              <p className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60">Pungency</p>
              <p className={`font-body text-sm font-medium ${getHeatColor(pepper.heatLevel)}`}>
                {pepper.heatLevel}
              </p>
            </div>
            <div className="text-center p-3 bg-[#e8dcc4]/50 border border-[#5a4a3a]/10">
              <MapPin className="w-5 h-5 mx-auto mb-1 text-[#8b2942]" />
              <p className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60">Provenance</p>
              <p className="font-body text-sm font-medium text-[#3a2a1a]">{pepper.origin}, {pepper.region}</p>
            </div>
            <div className="text-center p-3 bg-[#e8dcc4]/50 border border-[#5a4a3a]/10">
              <div className="w-5 h-5 mx-auto mb-1 flex items-center justify-center text-[#4a7c59] font-display text-xs">
                SHU
              </div>
              <p className="font-heading text-[9px] uppercase tracking-wider text-[#5a4a3a]/60">Scoville</p>
              <p className="font-body text-sm font-medium text-[#3a2a1a]">
                {formatScoville(pepper.scovilleMin, pepper.scovilleMax)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="font-body text-sm leading-relaxed text-[#3a2a1a]">
              {pepper.description}
            </p>
          </div>

          {/* Flavor & Aroma Section */}
          {(pepper.flavorNotes.length > 0 || (pepper.aromaNotes && pepper.aromaNotes.length > 0)) && (
            <div className="border-t border-[#5a4a3a]/15 pt-4">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-3">
                Flavor & Aroma
              </h4>
              <div className="space-y-3">
                {pepper.flavorNotes.length > 0 && (
                  <div>
                    <span className="font-body text-[10px] uppercase tracking-wider text-[#5a4a3a]/50 block mb-1.5">
                      Flavor Profile
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pepper.flavorNotes.map((note) => (
                        <span
                          key={note}
                          className="px-2 py-1 text-xs font-body bg-[#e8dcc4] border border-[#5a4a3a]/20 text-[#3a2a1a]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pepper.aromaNotes && pepper.aromaNotes.length > 0 && (
                  <div>
                    <span className="font-body text-[10px] uppercase tracking-wider text-[#5a4a3a]/50 block mb-1.5">
                      Aroma Notes
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pepper.aromaNotes.map((note) => (
                        <span
                          key={note}
                          className="px-2 py-1 text-xs font-body bg-[#e8dcc4]/70 border border-[#5a4a3a]/15 text-[#3a2a1a] italic"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Culinary Use Section */}
          {(pepper.culinaryUses.length > 0 || (pepper.pairings && pepper.pairings.length > 0)) && (
            <div className="border-t border-[#5a4a3a]/15 pt-4">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-3">
                Culinary Use
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pepper.culinaryUses.length > 0 && (
                  <div>
                    <span className="font-body text-[10px] uppercase tracking-wider text-[#5a4a3a]/50 block mb-1.5">
                      Applications
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pepper.culinaryUses.map((use) => (
                        <span
                          key={use}
                          className="px-2 py-1 text-xs font-body bg-[#d4a84b]/10 border border-[#d4a84b]/30 text-[#3a2a1a]"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pepper.pairings && pepper.pairings.length > 0 && (
                  <div>
                    <span className="font-body text-[10px] uppercase tracking-wider text-[#5a4a3a]/50 block mb-1.5">
                      Pairings
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pepper.pairings.map((pairing) => (
                        <span
                          key={pairing}
                          className="px-2 py-1 text-xs font-body bg-[#4a7c59]/10 border border-[#4a7c59]/25 text-[#3a2a1a]"
                        >
                          {pairing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Origin & History Section */}
          {pepper.historicalNotes && (
            <div className="border-t border-[#5a4a3a]/15 pt-4">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
                Origin & History
              </h4>
              <p className="font-body text-sm leading-relaxed text-[#3a2a1a]">
                {pepper.historicalNotes}
              </p>
            </div>
          )}

          {/* Trade Route Context Section */}
          <div className="bg-[#e8dcc4]/30 p-4 border border-[#5a4a3a]/10">
            <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
              Trade Route Context
            </h4>
            <p className="font-body text-sm text-[#3a2a1a] mb-3">
              {tradeRouteSummary}
            </p>
            {pepper.tradeRouteTags && pepper.tradeRouteTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pepper.tradeRouteTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-heading uppercase tracking-wider bg-[#5a4a3a]/10 border border-[#5a4a3a]/20 text-[#5a4a3a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Related Peppers Section */}
          {relatedPeppers.length > 0 && (
            <div className="border-t border-[#5a4a3a]/15 pt-4">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-3">
                Related Peppers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {relatedPeppers.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => onSelectPepper(related)}
                    className="text-left p-3 bg-[#e8dcc4]/40 border border-[#5a4a3a]/15 
                      hover:border-[#5a4a3a]/30 hover:bg-[#e8dcc4]/60 transition-colors group"
                  >
                    <p className="font-display text-sm uppercase tracking-wide text-[#3a2a1a] 
                      group-hover:text-[#8b2942] transition-colors">
                      {related.name}
                    </p>
                    <p className="font-body text-[10px] text-[#5a4a3a]/60 mt-0.5">
                      {related.heatLevel} · {related.origin}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#e8dcc4]/50 px-6 py-3 border-t border-[#5a4a3a]/15">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="font-body text-[10px] text-[#5a4a3a]/50 italic block">
                Catalogued by the Hot Pepper Trading Company
              </span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-1.5 text-xs font-heading uppercase tracking-wider border border-[#5a4a3a]/30 text-[#5a4a3a] hover:bg-[#5a4a3a]/10 transition-colors"
            >
              Close Registry
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
