import { PepperImage } from '@/data/peppers';
import { ExternalLink } from 'lucide-react';

interface ImageAttributionProps {
  image: PepperImage;
  className?: string;
}

export function ImageAttribution({ image, className = '' }: ImageAttributionProps) {
  if (image.source === 'ai-generated') {
    return (
      <span className={`font-body text-[9px] text-ink/40 ${className}`}>
        AI-generated illustration
      </span>
    );
  }

  const hasAttribution = image.author || image.license;
  
  if (!hasAttribution) {
    return (
      <span className={`font-body text-[9px] text-ink/40 ${className}`}>
        Image source pending
      </span>
    );
  }

  // Determine attribution prefix based on image type
  const attributionPrefix = image.type === 'illustration' ? 'Illustration by' : 'Photo by';

  return (
    <span className={`font-body text-[9px] text-ink/40 ${className}`}>
      {image.author && `${attributionPrefix} ${image.author}`}
      {image.author && image.license && ' · '}
      {image.license}
      {image.sourceUrl && (
        <a 
          href={image.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 ml-1 hover:text-tyrian transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </span>
  );
}
