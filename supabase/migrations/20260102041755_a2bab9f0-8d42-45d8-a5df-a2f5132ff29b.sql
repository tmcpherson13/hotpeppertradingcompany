-- Create pepper_overrides table for admin-editable pepper content
CREATE TABLE public.pepper_overrides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pepper_id text NOT NULL UNIQUE,
    description text,
    historical_notes text,
    trade_route text,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.pepper_overrides ENABLE ROW LEVEL SECURITY;

-- Anyone can read overrides (they're public content)
CREATE POLICY "Anyone can view pepper overrides"
ON public.pepper_overrides
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert pepper overrides"
ON public.pepper_overrides
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update pepper overrides"
ON public.pepper_overrides
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete pepper overrides"
ON public.pepper_overrides
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for fast lookups by pepper_id
CREATE INDEX idx_pepper_overrides_pepper_id ON public.pepper_overrides(pepper_id);