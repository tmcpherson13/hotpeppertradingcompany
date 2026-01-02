import { useState, useEffect, useRef, useCallback } from 'react';
import { PepperImage } from '@/data/peppers';
import { ImageAttribution } from './ImageAttribution';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGallerySync, mergeGalleryWithUploads, PepperImageWithMeta } from '@/hooks/useGallerySync';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useHiddenImages } from '@/hooks/useHiddenImages';
import { ImageUploadZone, DeleteImageButton } from './ImageUploadZone';

interface PepperGalleryProps {
  gallery: PepperImage[];
  pepperName: string;
  pepperId: string;
}

export function PepperGallery({ gallery, pepperName, pepperId }: PepperGalleryProps) {
  const [orderedGallery, setOrderedGallery] = useState<PepperImageWithMeta[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const dragCounter = useRef(0);
  
  const { user, isAdmin } = useAuth();
  const { uploadedImages, savedOrder, isLoading, refreshUploads, saveOrder } = useGallerySync(pepperId);
  const { deleteImage } = useImageUpload(pepperId);
  const { hiddenIds, hideImage, isLoading: hiddenLoading } = useHiddenImages(pepperId);
  
  // Merge static gallery with uploaded images, filter hidden, and apply saved order
  useEffect(() => {
    if (gallery.length === 0 && uploadedImages.length === 0) return;

    // Filter out hidden images from static gallery
    const visibleGallery = gallery.filter((img) => !hiddenIds.has(img.id));
    
    const merged = mergeGalleryWithUploads(visibleGallery, uploadedImages, savedOrder);
    setOrderedGallery(merged);

    // Keep Compendium thumbnails in sync by persisting the current primary URL
    try {
      const key = `pepper-primary-image-${pepperId}`;
      const primaryUrl = merged[0]?.url;
      if (primaryUrl) {
        localStorage.setItem(key, primaryUrl);
      } else {
        localStorage.removeItem(key);
      }
      window.dispatchEvent(new CustomEvent('pepper-thumbnail-changed', { detail: { pepperId } }));
    } catch {
      // ignore storage errors
    }

    // Reset current index if it's out of bounds
    if (currentIndex >= merged.length) {
      setCurrentIndex(Math.max(0, merged.length - 1));
    }
  }, [gallery, uploadedImages, savedOrder, hiddenIds]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(orderedGallery.length - 1, 0) : prev - 1));
  }, [orderedGallery.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (orderedGallery.length === 0 ? 0 : (prev === orderedGallery.length - 1 ? 0 : prev + 1)));
  }, [orderedGallery.length]);

  // Keyboard navigation - must be before early returns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (orderedGallery.length === 0) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, orderedGallery.length]);

  const handleUploadComplete = () => {
    refreshUploads();
  };

  const handleDeleteImage = async (img: PepperImageWithMeta) => {
    setDeletingId(img.id);
    
    // If it's a user upload, delete from storage
    if (img._uploadMetadata) {
      const success = await deleteImage(img.id, img._uploadMetadata.storagePath);
      setDeletingId(null);
      if (success) {
        refreshUploads();
      }
    } else if (isAdmin) {
      // Static/AI image - hide it instead
      const success = await hideImage(img.id);
      setDeletingId(null);
      if (success && currentIndex >= orderedGallery.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } else {
      setDeletingId(null);
    }
  };

  // Can user delete/hide this image?
  const canDeleteImage = (img: PepperImageWithMeta): boolean => {
    if (!user) return false;
    // Admin can delete/hide any image
    if (isAdmin) return true;
    // Regular user can only delete their own uploads
    return !!img._uploadMetadata && img._uploadMetadata.userId === user.id;
  };

  if (isLoading || hiddenLoading) {
    return (
      <div className="flex justify-center">
        <div className="w-48 h-48 border-2 border-ink/20 p-2 bg-parchment-dark/30 animate-pulse" />
      </div>
    );
  }

  if (orderedGallery.length === 0) return null;
  
  const currentImage = orderedGallery[currentIndex];
  const hasMultiple = orderedGallery.length > 1;

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    if (index !== draggedIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newGallery = [...orderedGallery];
    const [draggedItem] = newGallery.splice(draggedIndex, 1);
    newGallery.splice(dropIndex, 0, draggedItem);
    
    setOrderedGallery(newGallery);
    
    // Save order to Supabase (or localStorage for guests)
    const newOrder = newGallery.map(img => img.id);
    saveOrder(newOrder);
    
    // Adjust current index if needed
    if (currentIndex === draggedIndex) {
      setCurrentIndex(dropIndex);
    } else if (draggedIndex < currentIndex && dropIndex >= currentIndex) {
      setCurrentIndex(currentIndex - 1);
    } else if (draggedIndex > currentIndex && dropIndex <= currentIndex) {
      setCurrentIndex(currentIndex + 1);
    }
    
    handleDragEnd();
  };

  const isDragging = draggedIndex !== null;

  return (
    <div className="space-y-2">
      {/* Main Image Display */}
      <div className="relative flex justify-center">
        <div className={`w-48 h-48 border-2 border-ink/20 p-2 bg-parchment-dark/30 relative group transition-transform duration-200 origin-center z-10 ${!isDragging ? 'hover:scale-[5] hover:z-50' : ''}`}>
          <img 
            src={currentImage.url} 
            alt={`${pepperName} - ${currentImage.type}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 
                  w-8 h-8 bg-parchment border border-ink/30 
                  flex items-center justify-center opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-parchment-dark"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-ink" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 
                  w-8 h-8 bg-parchment border border-ink/30 
                  flex items-center justify-center opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-parchment-dark"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-ink" />
              </button>
            </>
          )}
          
           {/* Delete button */}
           <DeleteImageButton
             disabled={!canDeleteImage(currentImage)}
             title={
               !canDeleteImage(currentImage)
                 ? 'Sign in as admin to hide archival images'
                 : currentImage._uploadMetadata
                   ? 'Delete uploaded photo'
                   : 'Hide archival image (admin)'
             }
             onDelete={() => handleDeleteImage(currentImage)}
             isDeleting={deletingId === currentImage.id}
           />
        </div>
      </div>

      {/* Thumbnail Strip - Draggable */}
      <div className="flex justify-center gap-2 flex-wrap relative">
        {orderedGallery.map((img, idx) => (
          <div key={img.id} className="relative group">
            <button
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragEnter={(e) => handleDragEnter(e, idx)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-12 h-12 border-2 p-0.5 transition-all cursor-grab active:cursor-grabbing
                ${idx === currentIndex 
                  ? 'border-tyrian bg-tyrian/10' 
                  : 'border-ink/20 hover:border-ink/40'
                }
                ${draggedIndex === idx ? 'opacity-50 scale-95' : ''}
                ${dragOverIndex === idx ? 'border-tyrian border-dashed scale-105' : ''}
              `}
            >
              <img 
                src={img.url} 
                alt={`${pepperName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
            {/* Hover preview - positioned above and to the left */}
            {!isDragging && (
              <div className="absolute bottom-full left-0 mb-2 w-48 h-48 border-2 border-ink/30 bg-parchment shadow-lg 
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <img 
                  src={img.url} 
                  alt={`${pepperName} preview`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {/* Delete button */}
            <DeleteImageButton
              disabled={!canDeleteImage(img)}
              title={
                !canDeleteImage(img)
                  ? 'Sign in as admin to hide archival images'
                  : img._uploadMetadata
                    ? 'Delete uploaded photo'
                    : 'Hide archival image (admin)'
              }
              onDelete={() => handleDeleteImage(img)}
              isDeleting={deletingId === img.id}
            />
          </div>
        ))}
        
        {/* Upload button for authenticated users */}
        {user && (
          <ImageUploadZone 
            pepperId={pepperId} 
            onUploadComplete={handleUploadComplete} 
          />
        )}
      </div>

      {/* Hint text for reordering */}
      {(hasMultiple || user) && (
        <p className="text-center text-[10px] text-ink/50 italic">
          {user 
            ? 'Drag to reorder • Click + to upload • Changes sync across devices'
            : 'Drag thumbnails to reorder • leftmost becomes primary'
          }
        </p>
      )}

      {/* Attribution */}
      <div className="text-center">
        <ImageAttribution image={currentImage} />
      </div>
    </div>
  );
}
