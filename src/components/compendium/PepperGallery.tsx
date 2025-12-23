import { useState } from 'react';
import { PepperImage } from '@/data/peppers';
import { ImageAttribution } from './ImageAttribution';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PepperGalleryProps {
  gallery: PepperImage[];
  pepperName: string;
}

export function PepperGallery({ gallery, pepperName }: PepperGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (gallery.length === 0) return null;
  
  const currentImage = gallery[currentIndex];
  const hasMultiple = gallery.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-2">
      {/* Main Image Display */}
      <div className="relative flex justify-center">
        <div className="w-48 h-48 border-2 border-[#5a4a3a]/20 p-2 bg-[#e8dcc4]/30 relative group">
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
                  w-8 h-8 bg-[#f5efe6] border border-[#5a4a3a]/30 
                  flex items-center justify-center opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-[#e8dcc4]"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-[#5a4a3a]" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 
                  w-8 h-8 bg-[#f5efe6] border border-[#5a4a3a]/30 
                  flex items-center justify-center opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-[#e8dcc4]"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-[#5a4a3a]" />
              </button>
            </>
          )}
          
          {/* Image Type Badge */}
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#f5efe6]/90 
            border border-[#5a4a3a]/20 text-[9px] font-heading uppercase tracking-wider text-[#5a4a3a]">
            {currentImage.type}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {hasMultiple && (
        <div className="flex justify-center gap-2">
          {gallery.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-12 border-2 p-0.5 transition-all
                ${idx === currentIndex 
                  ? 'border-[#8b2942] bg-[#8b2942]/10' 
                  : 'border-[#5a4a3a]/20 hover:border-[#5a4a3a]/40'
                }`}
            >
              <img 
                src={img.url} 
                alt={`${pepperName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Attribution */}
      <div className="text-center">
        <ImageAttribution image={currentImage} />
      </div>
    </div>
  );
}
