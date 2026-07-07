-- Canonical peppers table: the source of truth for all NEW cultivars added
-- beyond the original 190 (which remain in src/data/peppers.ts as a frozen,
-- build-time fallback). This unblocks growing the compendium past 190 without
-- editing a code file for every entry.
--
-- Mirrors the Pepper TypeScript interface (src/data/pepperTypes.ts), plus
-- trust/provenance columns that the enrichment pipeline needs:
--   status    - draft entries are hidden from the public site until published
--   verified  - hard facts (Scoville, scientific name, dates) human-verified
--   *_source  - citation attached to the most safety-critical fields

CREATE TABLE IF NOT EXISTS public.peppers (
    id                text PRIMARY KEY,               -- url slug, e.g. 'carolina-reaper'
    name              text NOT NULL,
    alternate_names   text[] DEFAULT '{}',
    scientific_name   text NOT NULL,
    species           text NOT NULL,
    origin            text NOT NULL,
    region            text NOT NULL CHECK (region IN ('Americas','Asia','Africa','Europe','Middle East')),
    scoville_min      integer NOT NULL DEFAULT 0,
    scoville_max      integer NOT NULL DEFAULT 0,
    scoville_source   text,                            -- citation for the SHU range (Red-tier fact)
    heat_level        text NOT NULL,
    flavor_notes      text[] DEFAULT '{}',
    aroma_notes       text[] DEFAULT '{}',
    description       text,
    historical_notes  text,
    trade_route       text DEFAULT '',
    trade_route_tags  text[] DEFAULT '{}',
    year_introduced   integer,
    culinary_uses     text[] DEFAULT '{}',
    pairings          text[] DEFAULT '{}',
    in_stock          boolean NOT NULL DEFAULT false,
    image_url         text,                            -- primary image (storage/remote URL)
    gallery           jsonb DEFAULT '[]'::jsonb,        -- array of PepperImage objects
    source_citations  jsonb DEFAULT '[]'::jsonb,
    -- trust & provenance
    status            text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    verified          boolean NOT NULL DEFAULT false,
    data_source       text NOT NULL DEFAULT 'manual' CHECK (data_source IN ('manual','imported','ai','seed')),
    enrichment_version integer NOT NULL DEFAULT 0,
    -- audit
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    created_by        uuid REFERENCES auth.users(id),
    updated_by        uuid REFERENCES auth.users(id)
);

ALTER TABLE public.peppers ENABLE ROW LEVEL SECURITY;

-- Public may read only PUBLISHED peppers (drafts stay admin-only). This is what
-- the site + build-time prerender read via the anon key.
CREATE POLICY "Anyone can view published peppers"
ON public.peppers
FOR SELECT
USING (status = 'published');

-- Admins can see and manage everything, including drafts.
CREATE POLICY "Admins can manage peppers"
ON public.peppers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Keep updated_at fresh on every write.
CREATE OR REPLACE FUNCTION public.set_peppers_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_peppers_updated_at
BEFORE UPDATE ON public.peppers
FOR EACH ROW EXECUTE FUNCTION public.set_peppers_updated_at();

-- Indexes for the common filters (region, species, heat, stock, status).
CREATE INDEX IF NOT EXISTS idx_peppers_status  ON public.peppers(status);
CREATE INDEX IF NOT EXISTS idx_peppers_region  ON public.peppers(region);
CREATE INDEX IF NOT EXISTS idx_peppers_species ON public.peppers(species);
CREATE INDEX IF NOT EXISTS idx_peppers_in_stock ON public.peppers(in_stock);
