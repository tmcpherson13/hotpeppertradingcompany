-- Smoke test for the peppers table + RLS, run AFTER applying
-- 20260707000000_create_peppers_table.sql.
--
-- Paste this whole block into the Supabase dashboard SQL editor (or run with
-- the CLI). It checks structure/policies/trigger, does a safe insert→select→
-- delete round trip, and cleans up after itself. Expected: the SELECTs return
-- the checks below with ok = true, and the final table is left empty.

-- 1. Table exists with the expected column count (should be 32).
SELECT 'column_count' AS check,
       count(*) = 32 AS ok,
       count(*) AS actual
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'peppers';

-- 2. Both RLS policies are attached.
SELECT 'rls_policies' AS check,
       count(*) = 2 AS ok,
       string_agg(policyname, ', ') AS policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'peppers';

-- 3. The updated_at trigger exists.
SELECT 'updated_at_trigger' AS check,
       count(*) = 1 AS ok
FROM pg_trigger
WHERE tgname = 'trg_peppers_updated_at';

-- 4. Round trip: insert a published + a draft test row, confirm the
--    published-only public filter would see exactly one, then clean up.
INSERT INTO public.peppers (id, name, scientific_name, species, origin, region,
                            scoville_min, scoville_max, heat_level, status, verified, data_source)
VALUES
  ('zzz-verify-published', 'Verify Published', 'Capsicum annuum', 'annuum', 'Test', 'Americas',
   100, 200, 'Mild', 'published', true, 'seed'),
  ('zzz-verify-draft', 'Verify Draft', 'Capsicum annuum', 'annuum', 'Test', 'Americas',
   100, 200, 'Mild', 'draft', false, 'seed');

SELECT 'published_filter' AS check,
       count(*) = 1 AS ok,
       count(*) AS visible_published
FROM public.peppers
WHERE id LIKE 'zzz-verify-%' AND status = 'published';

DELETE FROM public.peppers WHERE id LIKE 'zzz-verify-%';

-- Final: the table should be empty (0 rows) unless you have added real peppers.
SELECT 'row_count_after_cleanup' AS check, count(*) AS peppers_in_table FROM public.peppers;
