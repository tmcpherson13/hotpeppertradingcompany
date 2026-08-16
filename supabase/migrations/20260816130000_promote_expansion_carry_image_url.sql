-- Carry the curated/generated primary image across when promoting enriched
-- expansion peppers into the public `peppers` table.
--
-- Background: promote_expansion_peppers() copies enriched content out of
-- pepper_overrides into peppers (status='published'), but the original version
-- never included image_url. The public site reads a DB pepper's image straight
-- from peppers.image_url (see src/data/dbPeppers.ts -> mapDbRowToPepper), so
-- every promoted expansion pepper rendered imageless even though its override
-- already had a curated Wikimedia photo or an AI-generated studio shot.
--
-- This revision adds image_url to both the INSERT and the ON CONFLICT UPDATE.
-- The UPDATE uses coalesce(EXCLUDED.image_url, peppers.image_url) so a later
-- promote pass with an empty override image can never blank out an image that
-- is already live.
CREATE OR REPLACE FUNCTION public.promote_expansion_peppers()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE n integer;
BEGIN
  INSERT INTO peppers (id,name,scientific_name,species,origin,region,scoville_min,scoville_max,heat_level,
     description,historical_notes,trade_route,flavor_notes,aroma_notes,culinary_uses,source_citations,image_url,status,data_source,verified)
  SELECT m.id,m.name,m.scientific_name,m.species,m.origin,m.region,m.scoville_min,m.scoville_max,m.heat_level,
     o.description,o.historical_notes,coalesce(o.trade_route,''),
     CASE WHEN coalesce(o.flavor_notes,'')='' THEN '{}'::text[] ELSE string_to_array(o.flavor_notes, ', ') END,
     CASE WHEN coalesce(o.aroma_notes,'')='' THEN '{}'::text[] ELSE string_to_array(o.aroma_notes, ', ') END,
     CASE WHEN coalesce(o.culinary_uses,'')='' THEN '{}'::text[] ELSE string_to_array(o.culinary_uses, ', ') END,
     coalesce(o.source_citations,'[]'::jsonb),
     NULLIF(o.image_url,''),
     'published','ai',false
  FROM pepper_expansion_meta m
  JOIN pepper_overrides o ON o.pepper_id=m.id AND o.enrichment_version>0
  WHERE o.description IS NOT NULL
  ON CONFLICT (id) DO UPDATE SET
    description=EXCLUDED.description, historical_notes=EXCLUDED.historical_notes, trade_route=EXCLUDED.trade_route,
    flavor_notes=EXCLUDED.flavor_notes, aroma_notes=EXCLUDED.aroma_notes, culinary_uses=EXCLUDED.culinary_uses,
    source_citations=EXCLUDED.source_citations,
    image_url=coalesce(EXCLUDED.image_url, peppers.image_url),
    status='published';
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $function$;
