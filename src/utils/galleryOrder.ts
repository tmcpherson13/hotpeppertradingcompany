import { PepperImage } from '@/data/pepperTypes';

const STORAGE_KEY_PREFIX = 'pepper-gallery-order-';

/**
 * Get saved gallery order for a pepper
 */
export function getSavedGalleryOrder(pepperId: string): string[] | null {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${pepperId}`);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save gallery order for a pepper
 */
export function saveGalleryOrder(pepperId: string, imageIds: string[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${pepperId}`, JSON.stringify(imageIds));
  } catch {
    console.warn('Failed to save gallery order to localStorage');
  }
}

/**
 * Apply saved order to a gallery array
 */
export function applyGalleryOrder(pepperId: string, gallery: PepperImage[]): PepperImage[] {
  const savedOrder = getSavedGalleryOrder(pepperId);
  if (!savedOrder || savedOrder.length === 0) {
    return gallery;
  }

  // Create a map for quick lookup
  const imageMap = new Map(gallery.map(img => [img.id, img]));
  
  // Build ordered array from saved order
  const ordered: PepperImage[] = [];
  for (const id of savedOrder) {
    const img = imageMap.get(id);
    if (img) {
      ordered.push(img);
      imageMap.delete(id);
    }
  }
  
  // Append any images not in saved order (new images)
  for (const img of imageMap.values()) {
    ordered.push(img);
  }
  
  return ordered;
}

/**
 * Get primary image URL respecting saved order
 */
export function getPrimaryImageUrl(pepperId: string, gallery: PepperImage[]): string | undefined {
  const orderedGallery = applyGalleryOrder(pepperId, gallery);
  return orderedGallery[0]?.url;
}
