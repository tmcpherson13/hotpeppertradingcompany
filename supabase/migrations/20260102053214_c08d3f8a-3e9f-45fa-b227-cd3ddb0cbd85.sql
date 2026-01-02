-- Allow anyone to view uploaded images (images are in public storage anyway)
CREATE POLICY "Anyone can view uploaded images"
ON public.user_uploaded_images
FOR SELECT
USING (true);

-- Allow anyone to view hidden images list (needed for frontend filtering)
DROP POLICY IF EXISTS "Admins can view hidden images" ON public.hidden_gallery_images;

CREATE POLICY "Anyone can view hidden images list"
ON public.hidden_gallery_images
FOR SELECT
USING (true);