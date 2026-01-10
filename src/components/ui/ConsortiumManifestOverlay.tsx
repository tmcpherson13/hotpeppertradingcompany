import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsortiumManifestOverlayProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ConsortiumManifestOverlay({ open, onClose, children }: ConsortiumManifestOverlayProps) {
  // Handle escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 flex items-start justify-center pt-8 pb-8 overflow-y-auto h-full">
        <div className="relative w-[min(92vw,900px)] bg-parchment border-2 border-ink/30 rounded-lg shadow-2xl max-h-[90vh] overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-ink/50 text-parchment flex items-center justify-center hover:bg-ink/70 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <ScrollArea className="h-[90vh]">
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
