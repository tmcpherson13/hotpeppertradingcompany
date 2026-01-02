-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view uploaded images" ON public.user_uploaded_images;

-- Create a restricted SELECT policy: users can only see their own uploads, admins can see all
CREATE POLICY "Users can view own images or admins can view all"
ON public.user_uploaded_images
FOR SELECT
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
);