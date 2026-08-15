-- Auto-rewrite + fast-populate enrichment mode.
--
-- New direction: instead of flagging copied passages and waiting for a human to
-- rewrite/approve, the synthesize function rewrites flagged passages on the fly
-- and (in fast-populate mode) publishes straight to live content. The remaining
-- verification signals (unsupported facts, creative inferences) are still stored
-- on the queue row so a later deep-analysis pass can audit everything.

-- Settings: two new toggles.
--   auto_rewrite_enabled  — when a passage is flagged as too close to a source,
--                           rewrite it automatically (default ON; strictly safer
--                           than storing copied wording).
--   auto_publish_enabled  — fast-populate: once copying is cleared, publish the
--                           entry to pepper_overrides regardless of the confidence
--                           threshold, logging any unsupported facts for later
--                           audit (default OFF; opt-in for bulk population).
ALTER TABLE public.enrichment_settings
  ADD COLUMN IF NOT EXISTS auto_rewrite_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_publish_enabled boolean NOT NULL DEFAULT false;

-- Queue: preserve the audit trail for auto-rewritten entries.
--   auto_rewritten      — this entry had copied passages rewritten automatically.
--   pre_rewrite_content — the original synthesized fields BEFORE the rewrite, so
--                         the deep-analysis pass can diff rewrite-vs-original.
ALTER TABLE public.pepper_enrichment_queue
  ADD COLUMN IF NOT EXISTS auto_rewritten boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pre_rewrite_content jsonb;
