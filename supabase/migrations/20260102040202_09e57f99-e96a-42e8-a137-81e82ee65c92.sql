-- Fix RLS policies on hidden_gallery_images to be PERMISSIVE
DROP POLICY IF EXISTS "Anyone can view hidden images" ON public.hidden_gallery_images;
DROP POLICY IF EXISTS "Admins can insert hidden images" ON public.hidden_gallery_images;
DROP POLICY IF EXISTS "Admins can delete hidden images" ON public.hidden_gallery_images;

-- Recreate as permissive policies
CREATE POLICY "Anyone can view hidden images"
ON public.hidden_gallery_images
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert hidden images"
ON public.hidden_gallery_images
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hidden images"
ON public.hidden_gallery_images
FOR DELETE
USING (has_role(auth.uid(), 'admin'));