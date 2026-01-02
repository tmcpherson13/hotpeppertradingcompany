-- Fix hidden_gallery_images: Only admins need to see hidden images
DROP POLICY IF EXISTS "Authenticated users can view hidden images" ON public.hidden_gallery_images;

CREATE POLICY "Admins can view hidden images"
ON public.hidden_gallery_images
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix profiles: Users can only view their own profile, admins can view all
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR has_role(auth.uid(), 'admin'::app_role)
);