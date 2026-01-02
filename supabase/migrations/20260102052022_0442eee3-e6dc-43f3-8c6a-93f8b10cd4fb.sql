-- Fix EXPOSED_SENSITIVE_DATA: Restrict hidden_gallery_images visibility to authenticated users only
DROP POLICY IF EXISTS "Anyone can view hidden images" ON public.hidden_gallery_images;

CREATE POLICY "Authenticated users can view hidden images"
ON public.hidden_gallery_images
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix PUBLIC_USER_DATA: Restrict profiles visibility to authenticated users only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix MISSING_RLS_PROTECTION: Restrict user_roles visibility
-- Users should only see their own role, admins can see all
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
);