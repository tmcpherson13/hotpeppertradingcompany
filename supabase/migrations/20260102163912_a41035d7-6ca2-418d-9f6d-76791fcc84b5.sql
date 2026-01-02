-- Add confidence scoring and auto-approval columns to pepper_enrichment_queue
ALTER TABLE public.pepper_enrichment_queue
ADD COLUMN IF NOT EXISTS confidence_score integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS auto_approved boolean DEFAULT false;

-- Create enrichment_settings table for auto-approval and scheduling configuration
CREATE TABLE public.enrichment_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    auto_approve_enabled boolean NOT NULL DEFAULT false,
    auto_approve_threshold integer NOT NULL DEFAULT 85,
    schedule_enabled boolean NOT NULL DEFAULT false,
    schedule_frequency text NOT NULL DEFAULT 'weekly' CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly')),
    schedule_next_run timestamp with time zone DEFAULT NULL,
    last_run_at timestamp with time zone DEFAULT NULL,
    last_run_count integer DEFAULT 0,
    updated_by uuid DEFAULT NULL,
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on enrichment_settings
ALTER TABLE public.enrichment_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage enrichment settings
CREATE POLICY "Admins can manage enrichment settings"
ON public.enrichment_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow anyone to view enrichment settings (needed for edge functions)
CREATE POLICY "Anyone can view enrichment settings"
ON public.enrichment_settings
FOR SELECT
USING (true);

-- Insert default settings row
INSERT INTO public.enrichment_settings (id)
VALUES (gen_random_uuid());