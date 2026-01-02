import { useState, useEffect, useRef } from 'react';
import { PepperImage } from '@/data/peppers';
import { ImageAttribution } from './ImageAttribution';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSavedGalleryOrder, saveGalleryOrder, applyGalleryOrder } from '@/utils/galleryOrder';

interface PepperGalleryProps {
  gallery: PepperImage[];
  pepperName: string;
  pepperId: string;
}

export function PepperGallery({ gallery, pepperName, pepperId }: PepperGalleryProps) {
  const [orderedGallery, setOrderedGallery] = useState<PepperImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);
  
  // Initialize gallery with saved order
  useEffect(() => {
    if (gallery.length === 0) return;
    const ordered = applyGalleryOrder(pepperId, gallery);
    setOrderedGallery(ordered);
  }, [gallery, pepperId]);

  if (orderedGallery.length === 0) return null;
  
  const currentImage = orderedGallery[currentIndex];
  const hasMultiple = orderedGallery.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? orderedGallery.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === orderedGallery.length - 1 ? 0 : prev + 1));
  };

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
    saveGalleryOrder(pepperId, newGallery.map(img => img.id));
    
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

  return (
    <div className="space-y-2">
      {/* Main Image Display */}
      <div className="relative flex justify-center">
        <div className="w-48 h-48 border-2 border-ink/20 p-2 bg-parchment-dark/30 relative group">
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
          
          {/* Image Type Badge */}
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-parchment/90 
            border border-ink/20 text-[9px] font-heading uppercase tracking-wider text-ink">
            {currentImage.type}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip - Draggable */}
      {hasMultiple && (
        <div className="flex justify-center gap-2">
          {orderedGallery.map((img, idx) => (
            <button
              key={img.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragEnter={(e) => handleDragEnter(e, idx)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-12 border-2 p-0.5 transition-all cursor-grab active:cursor-grabbing
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
          ))}
        </div>
      )}

      {/* Hint text for reordering */}
      {hasMultiple && (
        <p className="text-center text-[10px] text-ink/50 italic">
          Drag thumbnails to reorder • leftmost becomes primary
        </p>
      )}

      {/* Attribution */}
      <div className="text-center">
        <ImageAttribution image={currentImage} />
      </div>
    </div>
  );
}
