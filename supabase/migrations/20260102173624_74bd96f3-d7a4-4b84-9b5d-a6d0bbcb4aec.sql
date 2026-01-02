-- Drop existing constraint
ALTER TABLE pepper_research DROP CONSTRAINT IF EXISTS pepper_research_source_type_check;

-- Add updated constraint with wikimedia
ALTER TABLE pepper_research 
ADD CONSTRAINT pepper_research_source_type_check 
CHECK (source_type = ANY (ARRAY['firecrawl', 'perplexity', 'wikimedia']));