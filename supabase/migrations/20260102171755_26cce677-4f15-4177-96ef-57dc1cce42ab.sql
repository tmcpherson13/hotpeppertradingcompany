-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create pepper_image_proposals table for AI-generated and sourced images
CREATE TABLE public.pepper_image_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pepper_id TEXT NOT NULL,
  image_url TEXT,
  storage_path TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('wikimedia', 'ai-botanical', 'ai-photo-plant', 'ai-photo-individual')),
  source_url TEXT,
  license TEXT,
  author TEXT,
  prompt_used TEXT,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  enrichment_job_id UUID
);

-- Create enrichment_jobs table for progress tracking
CREATE TABLE public.enrichment_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL DEFAULT 'batch' CHECK (job_type IN ('batch', 'single', 'scheduled')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'researching', 'synthesizing', 'generating-images', 'completed', 'failed', 'paused', 'cancelled')),
  total_items INTEGER NOT NULL DEFAULT 0,
  completed_items INTEGER NOT NULL DEFAULT 0,
  current_pepper_id TEXT,
  current_pepper_name TEXT,
  current_step TEXT CHECK (current_step IN ('research', 'synthesis', 'image-analysis', 'image-generation', 'watermarking', NULL)),
  started_at TIMESTAMP WITH TIME ZONE,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  error_log JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.pepper_image_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrichment_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies for pepper_image_proposals
CREATE POLICY "Anyone can view image proposals"
ON public.pepper_image_proposals
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage image proposals"
ON public.pepper_image_proposals
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for enrichment_jobs
CREATE POLICY "Anyone can view enrichment jobs"
ON public.enrichment_jobs
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage enrichment jobs"
ON public.enrichment_jobs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add foreign key from image proposals to jobs
ALTER TABLE public.pepper_image_proposals
ADD CONSTRAINT fk_enrichment_job
FOREIGN KEY (enrichment_job_id) REFERENCES public.enrichment_jobs(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_image_proposals_pepper_id ON public.pepper_image_proposals(pepper_id);
CREATE INDEX idx_image_proposals_status ON public.pepper_image_proposals(status);
CREATE INDEX idx_enrichment_jobs_status ON public.enrichment_jobs(status);
CREATE INDEX idx_enrichment_jobs_created_by ON public.enrichment_jobs(created_by);

-- Enable realtime for enrichment_jobs (for live dashboard updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.enrichment_jobs;

-- Create trigger for updated_at on enrichment_jobs
CREATE TRIGGER update_enrichment_jobs_updated_at
BEFORE UPDATE ON public.enrichment_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();