-- Create featured_consortium table for weekly rotation
CREATE TABLE public.featured_consortium (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consortium_index integer NOT NULL DEFAULT 0,
  last_rotated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert initial row (starting with Cradle of Fire, index 0)
INSERT INTO public.featured_consortium (consortium_index, last_rotated_at) VALUES (0, now());

-- Enable RLS
ALTER TABLE public.featured_consortium ENABLE ROW LEVEL SECURITY;

-- Public read access (needed for display)
CREATE POLICY "Anyone can view featured consortium"
ON public.featured_consortium FOR SELECT USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage featured consortium"
ON public.featured_consortium FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Drop overly permissive RLS policies
-- user_uploaded_images: Remove public SELECT
DROP POLICY IF EXISTS "Anyone can view uploaded images" ON public.user_uploaded_images;

-- pepper_research: Remove public SELECT (admin-only)
DROP POLICY IF EXISTS "Anyone can view pepper research" ON public.pepper_research;

-- pepper_enrichment_queue: Remove public SELECT (admin-only)
DROP POLICY IF EXISTS "Anyone can view enrichment queue" ON public.pepper_enrichment_queue;

-- enrichment_settings: Remove public SELECT (admin-only)
DROP POLICY IF EXISTS "Anyone can view enrichment settings" ON public.enrichment_settings;

-- hidden_gallery_images: Restrict to authenticated users
DROP POLICY IF EXISTS "Anyone can view hidden images list" ON public.hidden_gallery_images;
CREATE POLICY "Authenticated users can view hidden images"
ON public.hidden_gallery_images FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at on featured_consortium
CREATE TRIGGER update_featured_consortium_updated_at
BEFORE UPDATE ON public.featured_consortium
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();