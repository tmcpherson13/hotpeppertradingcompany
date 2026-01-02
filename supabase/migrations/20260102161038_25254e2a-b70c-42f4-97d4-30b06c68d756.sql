-- Extend pepper_overrides with enrichment fields
ALTER TABLE public.pepper_overrides
ADD COLUMN IF NOT EXISTS flavor_notes text,
ADD COLUMN IF NOT EXISTS aroma_notes text,
ADD COLUMN IF NOT EXISTS culinary_uses text,
ADD COLUMN IF NOT EXISTS source_citations jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS enrichment_version integer DEFAULT 0;

-- Create pepper_research table for raw web scraping results
CREATE TABLE public.pepper_research (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pepper_id text NOT NULL,
    source_type text NOT NULL CHECK (source_type IN ('firecrawl', 'perplexity')),
    query text NOT NULL,
    raw_content text,
    urls jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Create pepper_enrichment_queue for AI proposals pending review
CREATE TABLE public.pepper_enrichment_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pepper_id text NOT NULL,
    proposed_description text,
    proposed_historical_notes text,
    proposed_flavor_notes text,
    proposed_aroma_notes text,
    proposed_culinary_uses text,
    proposed_trade_route text,
    source_citations jsonb DEFAULT '[]'::jsonb,
    research_ids uuid[] DEFAULT '{}',
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    review_notes text,
    reviewed_by uuid REFERENCES auth.users(id),
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.pepper_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pepper_enrichment_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for pepper_research
CREATE POLICY "Admins can manage pepper research"
ON public.pepper_research
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view pepper research"
ON public.pepper_research
FOR SELECT
USING (true);

-- RLS policies for pepper_enrichment_queue
CREATE POLICY "Admins can manage enrichment queue"
ON public.pepper_enrichment_queue
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view enrichment queue"
ON public.pepper_enrichment_queue
FOR SELECT
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pepper_research_pepper_id ON public.pepper_research(pepper_id);
CREATE INDEX IF NOT EXISTS idx_pepper_research_source_type ON public.pepper_research(source_type);
CREATE INDEX IF NOT EXISTS idx_pepper_enrichment_queue_pepper_id ON public.pepper_enrichment_queue(pepper_id);
CREATE INDEX IF NOT EXISTS idx_pepper_enrichment_queue_status ON public.pepper_enrichment_queue(status);