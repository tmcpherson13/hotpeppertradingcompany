import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pepper, peppers, speciesDisplayNames, PepperImage } from '@/data/peppers';
import { Flame, MapPin, Package, Pencil, Check, X } from 'lucide-react';
import { PepperGallery } from './PepperGallery';
import { getPepperImage } from '@/data/pepperImages';
import { applyGalleryOrder } from '@/utils/galleryOrder';
import { useAuth } from '@/contexts/AuthContext';
import { usePepperOverrides } from '@/hooks/usePepperOverrides';
import logoDark from '@/assets/logo-dark.svg';
import { CompassBack } from '@/components/ui/CompassBack';

// Helper to get gallery from pepper (with legacy fallback) and apply saved order
const getGalleryFromPepper = (pepper: Pepper): PepperImage[] => {
  let gallery: PepperImage[] = [];
  
  if (pepper.gallery && pepper.gallery.length > 0) {
    gallery = pepper.gallery;
  } else {
    // Fallback to legacy imageUrl or pepperImages
    const legacyUrl = pepper.imageUrl || getPepperImage(pepper.id);
    if (legacyUrl) {
      gallery = [{
        id: `${pepper.id}-primary`,
        url: legacyUrl,
        type: 'illustration',
        isPrimary: true,
        source: pepper.imageLicense ? 'wikimedia' : 'ai-generated',
        license: pepper.imageLicense,
        author: pepper.attributionText?.replace('Photo by ', '').split(',')[0],
      }];
    }
  }
  
  // Apply saved gallery order
  return applyGalleryOrder(pepper.id, gallery);
};

interface PepperDetailModalProps {
  pepper: Pepper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPepper: (pepper: Pepper) => void;
  showBackToOrigins?: boolean;
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

// Weighted scoring for related peppers
const WEIGHTS = {
  species: 25,        // Same species is a strong indicator
  region: 20,         // Same region often means similar culinary traditions
  flavorMatch: 15,    // Per matching flavor note
  aromaMatch: 10,     // Per matching aroma note
  tradeRouteTag: 8,   // Per shared trade route tag
  scovilleProximity: 20, // Based on how close the Scoville ranges are
  heatLevel: 12,      // Same or adjacent heat level
};

const calculateScovilleProximity = (pepper1: Pepper, pepper2: Pepper): number => {
  // Calculate midpoints
  const mid1 = (pepper1.scovilleMin + pepper1.scovilleMax) / 2;
  const mid2 = (pepper2.scovilleMin + pepper2.scovilleMax) / 2;
  
  // Use logarithmic scale since Scoville ranges vary enormously
  const log1 = Math.log10(mid1 + 1);
  const log2 = Math.log10(mid2 + 1);
  const maxLog = Math.log10(3000001); // Pepper X range
  
  // Calculate proximity (0-1, where 1 is identical)
  const logDiff = Math.abs(log1 - log2);
  const proximity = Math.max(0, 1 - (logDiff / maxLog) * 2);
  
  return proximity;
};

interface RelatedPepperResult {
  pepper: Pepper;
  score: number;
  reasons: string[];
}

// Reason tiers for diverse badge selection
type ReasonTier = 'identity' | 'sensory' | 'heat' | 'history';

interface WeightedReason {
  text: string;
  weight: number;
  tier: ReasonTier;
}

// Simple seeded random for consistent but varied selection
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Select diverse reasons: one from each tier where available, with controlled randomness
const selectDiverseReasons = (reasons: WeightedReason[], seed: number): string[] => {
  const tiers: ReasonTier[] = ['identity', 'sensory', 'heat', 'history'];
  const selected: string[] = [];
  
  // Group reasons by tier
  const byTier: Record<ReasonTier, WeightedReason[]> = {
    identity: [],
    sensory: [],
    heat: [],
    history: []
  };
  
  for (const reason of reasons) {
    byTier[reason.tier].push(reason);
  }
  
  // Shuffle tier order based on seed for variety between peppers
  const shuffledTiers = [...tiers].sort((a, b) => {
    const aVal = seededRandom(seed + a.charCodeAt(0));
    const bVal = seededRandom(seed + b.charCodeAt(0));
    return aVal - bVal;
  });
  
  // Pick one reason from each tier (if available)
  for (const tier of shuffledTiers) {
    if (selected.length >= 3) break;
    
    const tierReasons = byTier[tier];
    if (tierReasons.length === 0) continue;
    
    // If multiple reasons in tier, use seeded random to pick one
    if (tierReasons.length > 1) {
      const idx = Math.floor(seededRandom(seed + tier.charCodeAt(0) * 100) * tierReasons.length);
      selected.push(tierReasons[idx].text);
    } else {
      selected.push(tierReasons[0].text);
    }
  }
  
  // If we still have fewer than 3, fill from remaining high-weight reasons
  if (selected.length < 3) {
    const remaining = reasons
      .filter(r => !selected.includes(r.text))
      .sort((a, b) => b.weight - a.weight);
    
    for (const r of remaining) {
      if (selected.length >= 3) break;
      selected.push(r.text);
    }
  }
  
  return selected;
};

const findRelatedPeppers = (pepper: Pepper, allPeppers: Pepper[]): RelatedPepperResult[] => {
  const heatOrder = ['No Heat', 'Very Mild', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme', 'Superhot'];
  const currentHeatIndex = heatOrder.indexOf(pepper.heatLevel);
  
  const scored = allPeppers
    .filter(p => p.id !== pepper.id)
    .map(p => {
      let score = 0;
      const reasons: WeightedReason[] = [];
      
      // Species match (exact match) - Identity tier
      if (p.species === pepper.species) {
        score += WEIGHTS.species;
        const speciesName = speciesDisplayNames[p.species] || p.species;
        reasons.push({ text: `Same species (${speciesName})`, weight: WEIGHTS.species, tier: 'identity' });
      }
      
      // Region match - Identity tier
      if (p.region === pepper.region) {
        score += WEIGHTS.region;
        reasons.push({ text: 'Same region', weight: WEIGHTS.region, tier: 'identity' });
      }
      
      // Flavor profile overlap - Sensory tier
      const sharedFlavors = pepper.flavorNotes.filter(note => 
        p.flavorNotes.includes(note)
      );
      const flavorScore = sharedFlavors.length * WEIGHTS.flavorMatch;
      score += flavorScore;
      if (sharedFlavors.length >= 2) {
        reasons.push({ text: 'Shared flavors', weight: flavorScore, tier: 'sensory' });
      }
      
      // Aroma profile overlap - Sensory tier
      if (pepper.aromaNotes && p.aromaNotes) {
        const sharedAromas = pepper.aromaNotes.filter(note => 
          p.aromaNotes?.includes(note)
        );
        const aromaScore = sharedAromas.length * WEIGHTS.aromaMatch;
        score += aromaScore;
        if (sharedAromas.length >= 1) {
          reasons.push({ text: 'Similar aroma', weight: aromaScore, tier: 'sensory' });
        }
      }
      
      // Trade route tags overlap - History tier
      if (pepper.tradeRouteTags && p.tradeRouteTags) {
        const sharedTags = pepper.tradeRouteTags.filter(tag => 
          p.tradeRouteTags?.includes(tag)
        );
        const routeScore = sharedTags.length * WEIGHTS.tradeRouteTag;
        score += routeScore;
        if (sharedTags.length >= 1) {
          reasons.push({ text: 'Trade route', weight: routeScore, tier: 'history' });
        }
      }
      
      // Scoville proximity (logarithmic scale) - Heat tier
      const scovilleProximity = calculateScovilleProximity(pepper, p);
      const scovilleScore = scovilleProximity * WEIGHTS.scovilleProximity;
      score += scovilleScore;
      if (scovilleProximity > 0.7) {
        reasons.push({ text: 'Similar Scoville', weight: scovilleScore, tier: 'heat' });
      }
      
      // Heat level adjacency - Heat tier
      const pHeatIndex = heatOrder.indexOf(p.heatLevel);
      const heatDiff = Math.abs(currentHeatIndex - pHeatIndex);
      if (heatDiff === 0) {
        score += WEIGHTS.heatLevel;
        reasons.push({ text: 'Same heat', weight: WEIGHTS.heatLevel, tier: 'heat' });
      } else if (heatDiff === 1) {
        score += WEIGHTS.heatLevel * 0.5;
        reasons.push({ text: 'Similar heat', weight: WEIGHTS.heatLevel * 0.5, tier: 'heat' });
      }
      
      // Create a consistent seed from both pepper IDs for reproducible randomness
      const seed = pepper.id.charCodeAt(0) * 1000 + p.id.charCodeAt(0) * 100 + 
                   pepper.id.charCodeAt(pepper.id.length - 1) + p.id.charCodeAt(p.id.length - 1);
      
      // Select diverse reasons using tiered selection with controlled randomness
      const diverseReasons = selectDiverseReasons(reasons, seed);
      
      return { pepper: p, score, reasons: diverseReasons };
    })
    .filter(item => item.score > 20) // Minimum threshold for relevance
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, 3);
};

// Editable text field component for admins
interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  isAdmin: boolean;
  multiline?: boolean;
  className?: string;
}

function EditableField({ value, onSave, isAdmin, multiline = false, className = '' }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    await onSave(editValue);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isAdmin) {
    return multiline ? (
      <p className={className}>{value}</p>
    ) : (
      <span className={className}>{value}</span>
    );
  }

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`w-full p-2 border border-tyrian/50 bg-parchment font-body text-sm leading-relaxed text-[#3a2a1a] resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-tyrian/30 ${className}`}
            disabled={isSaving}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`w-full p-1 border border-tyrian/50 bg-parchment font-body text-sm text-[#3a2a1a] focus:outline-none focus:ring-2 focus:ring-tyrian/30 ${className}`}
            disabled={isSaving}
            autoFocus
          />
        )}
        <div className="absolute -top-2 -right-2 flex gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-6 h-6 bg-[#2d5a3d] text-white flex items-center justify-center hover:bg-[#3a7a4d] transition-colors disabled:opacity-50"
            title="Save"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="w-6 h-6 bg-[#8b2942] text-white flex items-center justify-center hover:bg-[#a33955] transition-colors"
            title="Cancel"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative inline">
      {multiline ? (
        <p className={className}>{value}</p>
      ) : (
        <span className={className}>{value}</span>
      )}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-1 -right-6 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 bg-tyrian/80 text-white flex items-center justify-center hover:bg-tyrian"
        title="Edit"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
}

export function PepperDetailModal({ pepper, open, onOpenChange, onSelectPepper, showBackToOrigins = false }: PepperDetailModalProps) {
  const { isAdmin } = useAuth();
  const { getOverride, saveOverride } = usePepperOverrides();
  
  if (!pepper) return null;

  const override = getOverride(pepper.id);
  
  // Use override values if they exist, otherwise fall back to static data
  const displayDescription = override?.description ?? pepper.description;
  const displayHistoricalNotes = override?.historical_notes ?? pepper.historicalNotes;
  const displayTradeRoute = override?.trade_route ?? pepper.tradeRoute;

  const relatedPeppers = findRelatedPeppers(pepper, peppers);
  const tradeRouteSummary = generateTradeRouteSummary(pepper.tradeRouteTags || [], displayTradeRoute);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#f5efe6] border-2 border-[#5a4a3a]/30 p-0">
        {/* Header with parchment styling */}
        <div className="bg-[#e8dcc4] px-6 py-5 border-b border-[#5a4a3a]/20 relative">
          {/* Back to Origins compass */}
          {showBackToOrigins && (
            <div className="absolute top-3 left-3 z-10" onClick={() => onOpenChange(false)}>
              <CompassBack 
                to="/origins" 
                tooltipText="Return to Origins"
              />
            </div>
          )}
          
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
                <span>In Cargo</span>
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
              <PepperGallery gallery={gallery} pepperName={pepper.name} pepperId={pepper.id} />
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
          <div className="relative">
            <EditableField
              value={displayDescription}
              onSave={async (value) => {
                await saveOverride(pepper.id, { description: value });
              }}
              isAdmin={isAdmin}
              multiline
              className="font-body text-sm leading-relaxed text-[#3a2a1a]"
            />
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
          {(displayHistoricalNotes || isAdmin) && (
            <div className="border-t border-[#5a4a3a]/15 pt-4">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#5a4a3a]/60 mb-2">
                Origin & History
              </h4>
              <div className="relative">
                <EditableField
                  value={displayHistoricalNotes || (isAdmin ? 'Click to add historical notes...' : '')}
                  onSave={async (value) => {
                    await saveOverride(pepper.id, { historical_notes: value });
                  }}
                  isAdmin={isAdmin}
                  multiline
                  className="font-body text-sm leading-relaxed text-[#3a2a1a]"
                />
              </div>
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
                {relatedPeppers.map((result) => (
                  <button
                    key={result.pepper.id}
                    onClick={() => onSelectPepper(result.pepper)}
                    className="text-left p-3 bg-[#e8dcc4]/40 border border-[#5a4a3a]/15 
                      hover:border-[#5a4a3a]/30 hover:bg-[#e8dcc4]/60 transition-colors group"
                  >
                    <p className="font-display text-sm uppercase tracking-wide text-[#3a2a1a] 
                      group-hover:text-[#8b2942] transition-colors">
                      {result.pepper.name}
                    </p>
                    <p className="font-body text-[10px] text-[#5a4a3a]/60 mt-0.5">
                      {result.pepper.heatLevel} · {result.pepper.origin}
                    </p>
                    {result.reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.reasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 text-[9px] font-heading uppercase tracking-wider 
                              bg-[#5a4a3a]/5 border border-[#5a4a3a]/15 text-[#5a4a3a]/70"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}
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
                Recorded in the archives of Hot Pepper Trading Company — curated selections from routes ancient and modern.
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
