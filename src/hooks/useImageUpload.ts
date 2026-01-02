import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadedImage {
  id: string;
  url: string;
  storagePath: string;
  filename: string;
  userId: string;
  pepperId: string;
  createdAt: string;
}

export function useImageUpload(pepperId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to upload images.',
        variant: 'destructive',
      });
      return null;
    }

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: 'Invalid File',
        description: validationError,
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const filename = `${pepperId}-${timestamp}.${ext}`;
      const storagePath = `${user.id}/${pepperId}/${filename}`;

      setUploadProgress(30);

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('pepper-images')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(70);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pepper-images')
        .getPublicUrl(storagePath);

      // Save metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from('user_uploaded_images')
        .insert({
          user_id: user.id,
          pepper_id: pepperId,
          storage_path: storagePath,
          filename: file.name,
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if DB insert fails
        await supabase.storage.from('pepper-images').remove([storagePath]);
        throw dbError;
      }

      setUploadProgress(100);

      toast({
        title: 'Image Uploaded',
        description: 'Your image has been added to the gallery.',
      });

      return {
        id: dbData.id,
        url: urlData.publicUrl,
        storagePath: dbData.storage_path,
        filename: dbData.filename,
        userId: dbData.user_id,
        pepperId: dbData.pepper_id,
        createdAt: dbData.created_at,
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (imageId: string, storagePath: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to delete images.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('pepper-images')
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_uploaded_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: 'Image Deleted',
        description: 'The image has been removed from the gallery.',
      });

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
    uploadProgress,
    canUpload: !!user,
  };
}
