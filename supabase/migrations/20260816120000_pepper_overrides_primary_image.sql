-- Primary-image override: the chosen display image for a pepper, curated from
-- the pepper_image_proposals pipeline. Read at runtime the same way the text
-- overrides are, so it surfaces on the card, the modal, and the full record
-- without editing the frozen static data. Attribution fields satisfy the
-- Wikimedia reuse terms.
ALTER TABLE pepper_overrides
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS image_source_url text,
  ADD COLUMN IF NOT EXISTS image_license text,
  ADD COLUMN IF NOT EXISTS image_author text;
