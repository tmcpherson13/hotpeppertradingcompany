# Backend Migration Runbook — Lovable Cloud → own Supabase project

The backend was moved off Lovable Cloud (managed, no dashboard) to a Supabase
project you own directly in **TMc Org**. This is what changed and the few steps
left for you to finish the switch.

## New project

| | |
|---|---|
| Project name | `hotpeppertradingcompany` |
| Project ref | `naxtutjkdmxyvwctpsub` |
| API URL | `https://naxtutjkdmxyvwctpsub.supabase.co` |
| Publishable (anon) key | `sb_publishable_KDW0Ph6RLYCyqq3mvGc_aA_fgWmPicf` |
| Dashboard | https://supabase.com/dashboard/project/naxtutjkdmxyvwctpsub |

The publishable key is public-by-design (it ships in the browser bundle), so
it's safe to commit and paste. The **service-role** key (Settings → API) is
secret — never expose it; edge functions get it automatically.

## What's already done

- All 21 migrations applied (17 tables, RLS enabled on every one, storage
  bucket + policies, `has_role`, the new `peppers` table). Verified with a
  create→publish→delete round-trip.
- `supabase/config.toml` `project_id` repointed to the new ref.
- Edge functions repointed off Lovable's AI gateway (Claude for text synthesis,
  Google Gemini for images) and deployed to the new project.

## What you need to do

### 1. Set the frontend env vars (Vercel + local)
In **Vercel → Project → Settings → Environment Variables**, set (and redeploy):

```
VITE_SUPABASE_URL=https://naxtutjkdmxyvwctpsub.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_KDW0Ph6RLYCyqq3mvGc_aA_fgWmPicf
```

For local dev, put the same two lines in a `.env` file (it's gitignored).

### 2. Create your admin account
The old admin login did not carry over (fresh backend). Two ways:

- **Dashboard (simplest):** Authentication → Users → Add user (email + password).
  Then SQL editor: `INSERT INTO public.user_roles (user_id, role) VALUES ('<the-new-user-id>', 'admin');`
- **Or** invoke the `create-admin-user` edge function once its secrets are set.

Then log in at `/admin`.

### 3. Set the edge-function secrets
In **Edge Functions → Secrets**, add the keys the pipeline uses. Auto-provided
by Supabase (do NOT add): `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`. You provide:

| Secret | Used by | Get it from |
|---|---|---|
| `ANTHROPIC_API_KEY` | pepper-synthesize (text) | console.anthropic.com |
| `GEMINI_API_KEY` | pepper-image-generate, consortium-image-generate | aistudio.google.com |
| `FIRECRAWL_API_KEY` | pepper-research | firecrawl.dev |
| `PERPLEXITY_API_KEY` | pepper-research | perplexity.ai |
| `RESEND_API_KEY` | send/resend-admin-welcome | resend.com |

Only add the ones for features you'll use. The site, the Compendium, and the
Catalog admin tab work **without any of these** — they're only for the
enrichment/image/email pipeline.

### 4. Point the short domain
In Vercel → Domains, add `hotpeppertrading.com` as a **301 redirect** to
`hotpeppertradingcompany.com` (matches the canonical tag).

## Notes / follow-ups

- The Supabase security linter flags a few WARN-level items inherited from the
  original Lovable schema (SECURITY DEFINER `has_role`/`handle_new_user` callable
  via RPC, public storage bucket listing). They match the old project's posture;
  hardening them (and the edge-function auth) is part of the planned Step 2
  trust-model work.
- Regenerate typed DB types anytime with the Supabase CLI once linked:
  `supabase gen types typescript --project-id naxtutjkdmxyvwctpsub > src/integrations/supabase/types.ts`
  (this will also add the `peppers` table to the types and let the `any` cast in
  `src/data/dbPeppers.ts` be removed).
- The old Lovable Cloud project (`irvgpvjdnatvogmsxszr`) can be left as-is or
  decommissioned once you've confirmed the new one works end-to-end.
