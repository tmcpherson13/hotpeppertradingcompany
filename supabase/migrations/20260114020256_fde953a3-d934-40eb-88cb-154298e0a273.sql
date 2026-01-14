-- Add manual override columns to pepper_overrides table
ALTER TABLE pepper_overrides
ADD COLUMN IF NOT EXISTS origin text,
ADD COLUMN IF NOT EXISTS heat_level text,
ADD COLUMN IF NOT EXISTS scoville_min integer,
ADD COLUMN IF NOT EXISTS scoville_max integer;