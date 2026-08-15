-- Per-pepper failure tracking so the autonomous runner can dead-letter a pepper
-- that keeps failing instead of retrying it every 2 minutes forever (which is
-- what burned Sonnet credits on aji-dulce's 666K-char dossier).
ALTER TABLE pepper_catalog
  ADD COLUMN IF NOT EXISTS fail_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_error text,
  ADD COLUMN IF NOT EXISTS last_attempt_at timestamptz;

-- Clear aji-dulce's implicit failure state so the fixed pipeline (with the
-- dossier cap) gets a clean first retry once credits are back.
UPDATE pepper_catalog SET fail_count = 0, last_error = NULL WHERE id = 'aji-dulce';
