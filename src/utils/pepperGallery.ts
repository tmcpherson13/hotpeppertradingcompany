import { Pepper, PepperImage } from '@/data/pepperTypes';
import { getPepperImage } from '@/data/pepperImages';
import { applyGalleryOrder } from '@/utils/galleryOrder';

/** Optional curated primary-image override (from pepper_overrides). */
export interface PrimaryImageOverride {
  image_url?: string | null;
  image_source_url?: string | null;
  image_license?: string | null;
  image_author?: string | null;
}

/**
 * Assemble a pepper's base gallery from its static `gallery` array (or legacy
 * single-image fallback), applying any saved reorder. This is the "bundled"
 * image set baked into the catalog — it does NOT include user uploads (those
 * are merged in later by PepperGallery via useGallerySync).
 */
export function getGalleryFromPepper(pepper: Pepper): PepperImage[] {
  let gallery: PepperImage[] = [];

  if (pepper.gallery && pepper.gallery.length > 0) {
    gallery = pepper.gallery;
  } else {
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

  return applyGalleryOrder(pepper.id, gallery);
}

/**
 * The full gallery a viewer sees for a pepper: the curated primary-image
 * override (if any) leading the bundled gallery. Mirrors what the compendium
 * modal renders so the admin image view matches the public one. User uploads
 * are still merged in downstream by PepperGallery.
 */
export function buildDisplayGallery(pepper: Pepper, override?: PrimaryImageOverride | null): PepperImage[] {
  const base = getGalleryFromPepper(pepper);
  if (override?.image_url) {
    return [
      {
        id: `${pepper.id}-override`,
        url: override.image_url,
        type: 'photo',
        isPrimary: true,
        source: 'wikimedia',
        license: override.image_license ?? undefined,
        author: override.image_author ?? undefined,
        sourceUrl: override.image_source_url ?? undefined,
      },
      ...base.filter((g) => g.url !== override.image_url),
    ];
  }
  return base;
}
