-- Table to track hidden gallery images (admin can hide any image, including static/AI ones)
CREATE TABLE public.hidden_gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id TEXT NOT NULL,
  pepper_id TEXT NOT NULL,
  hidden_by UUID NOT NULL,
  hidden_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(image_id)
);

-- Enable RLS
ALTER TABLE public.hidden_gallery_images ENABLE ROW LEVEL SECURITY;

-- Anyone can see which images are hidden (needed for filtering)
CREATE POLICY "Anyone can view hidden images"
  ON public.hidden_gallery_images
  FOR SELECT
  USING (true);

-- Only admins can hide/unhide images
CREATE POLICY "Admins can insert hidden images"
  ON public.hidden_gallery_images
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hidden images"
  ON public.hidden_gallery_images
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));