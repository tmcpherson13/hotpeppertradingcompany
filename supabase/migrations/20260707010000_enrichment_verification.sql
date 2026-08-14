-- Trust-model: store the adversarial verification results alongside each AI
-- enrichment proposal. The pipeline blocks auto-approval unless verification
-- passes; these columns let the human reviewer see exactly why something was
-- held (unsupported factual claims, near-verbatim/plagiarized passages).

ALTER TABLE public.pepper_enrichment_queue
ADD COLUMN IF NOT EXISTS verification_passed boolean,
ADD COLUMN IF NOT EXISTS unsupported_claims jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS plagiarism_flags jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS verification_notes text;
