-- Trust-model refinement: separate blocking factual problems from allowed
-- creative license. The verification pass now sorts what it finds into three
-- buckets:
--   * plagiarism_flags      — copied wording (BLOCKS auto-approval)
--   * unsupported_claims    — unsupported CHECKABLE hard facts (BLOCKS)
--   * narrative_inferences  — reasonable evocative/inferential framing (does NOT
--                             block; recorded so a human can review the creative
--                             license the entry took).
-- This column stores that third bucket so the review UI can surface it as
-- informational rather than as a failure.

ALTER TABLE public.pepper_enrichment_queue
ADD COLUMN IF NOT EXISTS narrative_inferences jsonb DEFAULT '[]'::jsonb;
