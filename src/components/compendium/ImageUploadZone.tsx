import { useState, useRef } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ImageUploadZoneProps {
  pepperId: string;
  onUploadComplete: () => void;
}

export function ImageUploadZone({ pepperId, onUploadComplete }: ImageUploadZoneProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { uploadImage, isUploading, uploadProgress, canUpload } = useImageUpload(pepperId);

  if (!canUpload) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (file: File) => {
    const result = await uploadImage(file);
    if (result) {
      setIsDialogOpen(false);
      onUploadComplete();
    }
  };

  return (
    <>
      {/* Upload button (shown in thumbnail strip) */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-12 h-12 border-2 border-dashed border-ink/30 
          flex items-center justify-center transition-all
          hover:border-tyrian hover:bg-tyrian/5"
        title="Upload image"
      >
        <Plus className="w-5 h-5 text-ink/40" />
      </button>

      {/* Upload dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-parchment border-2 border-ink/20">
          <DialogHeader>
            <DialogTitle className="font-display text-lg uppercase tracking-wider text-ink">
              Contribute Image
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-ink/60">
              Upload a photograph to add to this pepper's gallery
            </DialogDescription>
          </DialogHeader>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-none p-8 text-center transition-all
              ${isDragOver 
                ? 'border-tyrian bg-tyrian/10' 
                : 'border-ink/30 hover:border-ink/50'
              }
              ${isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto border-2 border-tyrian border-t-transparent 
                  rounded-full animate-spin" />
                <p className="font-body text-sm text-ink/70">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 mx-auto text-ink/40" />
                <div>
                  <p className="font-heading text-sm uppercase tracking-wider text-ink">
                    Drop image here
                  </p>
                  <p className="font-body text-xs text-ink/50 mt-1">
                    or click to browse
                  </p>
                </div>
                <p className="font-body text-[10px] text-ink/40">
                  JPEG, PNG, or WebP • Max 10MB
                </p>
              </div>
            )}
          </div>

          <p className="font-body text-xs text-ink/40 text-center">
            By uploading, you confirm you have the right to share this image.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Delete confirmation button for thumbnails
interface DeleteImageButtonProps {
  onDelete: () => void;
  isDeleting?: boolean;
}

export function DeleteImageButton({ onDelete, isDeleting }: DeleteImageButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="absolute inset-0 bg-ink/80 flex items-center justify-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={isDeleting}
          className="px-2 py-1 bg-red-600 text-parchment text-[8px] font-heading uppercase"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(false);
          }}
          className="px-2 py-1 bg-parchment text-ink text-[8px] font-heading uppercase"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowConfirm(true);
      }}
      className="absolute top-0.5 right-0.5 w-4 h-4 bg-ink/70 text-parchment 
        flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="w-3 h-3" />
    </button>
  );
}
