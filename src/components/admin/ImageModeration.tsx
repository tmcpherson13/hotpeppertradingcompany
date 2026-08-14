import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ExternalLink, X } from 'lucide-react';
import { format } from 'date-fns';
import { peppers } from '@/data/peppers';

interface UploadedImage {
  id: string;
  pepper_id: string;
  storage_path: string;
  filename: string;
  created_at: string;
  user_id: string;
  display_name: string | null;
  imageUrl: string;
}

export function ImageModeration() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('user_uploaded_images')
        .select(`
          id,
          pepper_id,
          storage_path,
          filename,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get display names
      const userIds = [...new Set(data?.map((img) => img.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p.display_name]));

      // Get public URLs
      const imagesWithUrls: UploadedImage[] = (data || []).map((img) => {
        const { data: urlData } = supabase.storage
          .from('pepper-images')
          .getPublicUrl(img.storage_path);

        return {
          ...img,
          display_name: profileMap.get(img.user_id) || null,
          imageUrl: urlData.publicUrl,
        };
      });

      setImages(imagesWithUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load images',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();

    // Realtime subscription for live updates
    const channel = supabase
      .channel('admin-image-moderation')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_uploaded_images',
        },
        () => {
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteImage = async (image: UploadedImage) => {
    setDeletingIds((prev) => new Set(prev).add(image.id));

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('pepper-images')
        .remove([image.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_uploaded_images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      setImages((prev) => prev.filter((img) => img.id !== image.id));
      setSelectedImage(null);

      toast({
        title: 'Image Deleted',
        description: 'The image has been removed',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(image.id);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-parchment-dark/30 animate-pulse" />
        ))}
      </div>
    );
  }

  // Group images by pepper so the gallery is organized by cultivar rather than
  // one flat, undifferentiated grid.
  const getPepperName = (pepperId: string) =>
    peppers.find((p) => p.id === pepperId)?.name || pepperId;

  const groups = images.reduce((acc, image) => {
    (acc[image.pepper_id] ||= []).push(image);
    return acc;
  }, {} as Record<string, UploadedImage[]>);

  const orderedPepperIds = Object.keys(groups).sort((a, b) =>
    getPepperName(a).localeCompare(getPepperName(b))
  );

  return (
    <>
      {orderedPepperIds.length > 0 && (
        <div className="space-y-8">
          {orderedPepperIds.map((pepperId) => (
            <section key={pepperId}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-heading text-sm uppercase tracking-wider text-ink">
                  {getPepperName(pepperId)}
                </h3>
                <span className="font-body text-xs text-ink/40">
                  {groups[pepperId].length} image{groups[pepperId].length === 1 ? '' : 's'}
                </span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {groups[pepperId].map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square bg-parchment-dark/30 border border-ink/20 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-parchment" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-12 text-ink/50 font-body">
          No uploaded images to moderate
        </div>
      )}

      {/* Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-ink/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-parchment max-w-2xl w-full max-h-[90vh] overflow-auto border-2 border-ink/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.filename}
                className="w-full"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-2 bg-ink/60 hover:bg-ink/80 text-parchment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading text-lg text-ink">
                    {selectedImage.pepper_id}
                  </h3>
                  <p className="font-body text-sm text-ink/60">
                    Uploaded by {selectedImage.display_name || 'Anonymous'}
                  </p>
                  <p className="font-body text-xs text-ink/40">
                    {format(new Date(selectedImage.created_at), 'PPP')}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteImage(selectedImage)}
                  disabled={deletingIds.has(selectedImage.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {deletingIds.has(selectedImage.id) ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}