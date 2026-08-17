import { useState, useCallback } from 'react';
import { Pepper } from '@/data/pepperTypes';
import { usePepperOverrides } from '@/hooks/usePepperOverrides';
import { buildDisplayGallery } from '@/utils/pepperGallery';
import { EnrichmentPepperList } from './EnrichmentPepperList';
import { ImageProposalReview } from './ImageProposalReview';
import { PepperGallery } from '@/components/compendium/PepperGallery';
import { ImageIcon, Images, Sparkles } from 'lucide-react';

/**
 * One place to manage every image for a single pepper: its live gallery
 * (bundled catalog images + user uploads + the curated primary), with upload,
 * drag-to-set-primary and delete/hide — shown alongside its pending AI/Wikimedia
 * image proposals so an admin can compare and pick the best without leaving the
 * admin area. The gallery is assembled exactly as the public compendium builds
 * it, so the counts here match what visitors see.
 */
export function AdminPepperImages() {
  const [selectedPepper, setSelectedPepper] = useState<Pepper | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { getOverride } = usePepperOverrides();

  const handleSelect = useCallback((pepper: Pepper) => {
    setSelectedPepper(pepper);
  }, []);

  const override = selectedPepper ? getOverride(selectedPepper.id) : undefined;
  const gallery = selectedPepper ? buildDisplayGallery(selectedPepper, override) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
      {/* Pepper picker */}
      <div className="lg:col-span-1 border border-ink/10 rounded-lg overflow-hidden bg-parchment">
        <div className="p-3 border-b border-ink/10 bg-parchment-dark/20">
          <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70">
            Select a Pepper
          </h3>
        </div>
        <div className="h-[550px]">
          <EnrichmentPepperList
            onSelectPepper={handleSelect}
            selectedPepperId={selectedPepper?.id}
            batchMode={false}
          />
        </div>
      </div>

      {/* Images for the selected pepper */}
      <div className="lg:col-span-2 space-y-6">
        {!selectedPepper ? (
          <div className="border border-ink/10 rounded-lg bg-parchment h-[550px] flex items-center justify-center text-ink/40">
            <p className="text-sm flex items-center gap-2">
              <Images className="w-4 h-4" />
              Select a pepper to see all of its images and proposals in one place
            </p>
          </div>
        ) : (
          <>
            {/* Live gallery — matches the public compendium */}
            <div className="border border-ink/10 rounded-lg overflow-hidden bg-parchment">
              <div className="p-3 border-b border-ink/10 bg-parchment-dark/20 flex items-center justify-between">
                <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {selectedPepper.name} — Gallery
                </h3>
                <span className="text-[11px] text-ink/50">
                  {gallery.length} image{gallery.length === 1 ? '' : 's'} · drag leftmost to set primary
                </span>
              </div>
              <div className="p-4">
                {gallery.length > 0 ? (
                  <PepperGallery
                    key={`gallery-${selectedPepper.id}-${refreshKey}`}
                    gallery={gallery}
                    pepperName={selectedPepper.name}
                    pepperId={selectedPepper.id}
                  />
                ) : (
                  <p className="text-sm text-ink/40 py-8 text-center">
                    No images yet — upload one below or approve a proposal.
                  </p>
                )}
                <p className="mt-3 text-[11px] text-ink/45 leading-relaxed">
                  This gallery includes the catalog's bundled images, your uploads, and the
                  curated primary image — the same set shown in the Compendium. Uploaded images
                  can be deleted; bundled images are hidden rather than deleted.
                </p>
              </div>
            </div>

            {/* Pending proposals for this pepper */}
            <div className="border border-ink/10 rounded-lg overflow-hidden bg-parchment">
              <div className="p-3 border-b border-ink/10 bg-parchment-dark/20">
                <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Proposed Images
                </h3>
              </div>
              <div className="p-4">
                <ImageProposalReview
                  key={`proposals-${selectedPepper.id}`}
                  pepperId={selectedPepper.id}
                  onComplete={() => setRefreshKey((k) => k + 1)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
