# Hot Pepper Trading Company

A merchant-house catalog and compendium of chili pepper cultivars — historical
trade routes, botanical detail, and an admin console for AI-assisted content
enrichment and image sourcing.

## Tech stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **MapLibre GL** for the interactive trade-route chart
- **Supabase** (Postgres, Auth, Storage, Edge Functions) for the backend
- **Vercel** for hosting and deployment

## Local development

Requires Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# Clone and install
git clone <YOUR_GIT_URL>
cd hotpeppertradingcompany
npm install

# Start the dev server (auto-reload + instant preview)
npm run dev
```

Other scripts:

```sh
npm run build     # production build (client + SSR prerender)
npm run preview   # preview the production build locally
```

## Deployment

The site is deployed on **Vercel**. Production deploys from the `main` branch;
feature branches get their own preview deployments. Merge to `main` to publish.

## Backend

The backend runs on a dedicated **Supabase** project. Edge functions live under
`supabase/functions/` (pepper research/synthesis, image generation, admin
management). See `docs/backend-migration-runbook.md` for the backend setup and
required secrets.
