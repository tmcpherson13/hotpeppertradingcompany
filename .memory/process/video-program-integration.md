# Memory: process/video-program-integration

Updated: 2026-08-14
Source: strategy session (Claude chat). Drop this file at `.memory/process/video-program-integration.md`.

This file is the contract between the video program and the website build. Read it before any work touching `src/components/map/`, the history pages, the Compendium schema, or brand copy.

---

## 1. Why this exists

The site is no longer only a website. It is the production source for a video channel. Four series are planned; the trade-route chart in `TradeRouteMap.tsx` is the single most important shared asset between them.

Consequence for the build: the map is now a rendering target, not just a page component. Changes that are cosmetically fine on the web can silently break video output — a palette shift, a label size, a timing change to the voyage animation, a new UI chrome element inside `#routes`. Treat the map as a versioned asset with a downstream consumer.

Series and their site dependencies:

| Series | Depends on |
|---|---|
| The Great Dispersal | Origins map, history pages |
| Trade Routes (18 episodes) | Timeline events in `TradeRouteMap.tsx` — one episode per event, in order |
| One Pepper, One Port | Compendium entries, `peppers.ts`, origin coordinates |
| Consortium Journeys | `consortiums.ts`, `.memory/features/consortium/*` |

## 2. Map-as-video-asset — build tasks

The existing Playwright scripts (`scripts/shot-voyage.mjs`, `scripts/shot-map.mjs`) already do most of this. They capture the draw → follow → pull-back sequence at fixed timestamps. Extend rather than replace.

Required work, in order:

### 2.1 `scripts/render-voyage.mjs` — frame sequence export

New script, modelled on `shot-voyage.mjs`. Requirements:

* Accept a timeline event identifier (the `title` attribute already used for dot clicks) and an output directory
* Capture a continuous PNG frame sequence at 30fps rather than five sampled stamps
* Render at 2160 × 3840 for vertical output and 3840 × 2160 for horizontal, then downscale — capture above delivery resolution so text stays crisp
* Clip strictly to the `#routes` element bounding box with all site UI chrome suppressed
* Emit an ffmpeg-ready sequence: `voyage_[year]_[slug]_%04d.png`
* Deterministic: same input must produce byte-identical frames across runs. Seed or freeze any animation jitter.

### 2.2 `?render=1` query parameter — clean render mode

When present on the origins page:
* Hide nav, footer, region-selector buttons, play controls, and the timeline scrubber
* Force the map to fill the viewport
* Disable all hover states and pointer events
* Keep route lines, port markers, year stamps, and the compass rose

This is what makes the map usable as raw footage. Without it, every frame has UI in it.

### 2.3 Vertical composition preset

The map is currently composed for landscape. Video is primarily 1080 × 1920. Add a `?aspect=vertical` mode that recomposes rather than crops — tighter longitude bounds, larger labels, compass rose repositioned. A center-crop of the landscape view loses both endpoints of most routes, which is the entire point of the shot.

### 2.4 Route-draw timing control

Expose the per-leg draw duration as a parameter. Web reads best fast; video needs roughly 1.5 seconds per leg with a hold at arrival. Do not change the web default — parameterize it.

### 2.5 Episode manifest export

`npm run export:episodes` → writes `episodes.json` containing, for each of the 18 timeline events: year, port name, coordinates, description, route legs, and the preceding event's identifier. This is the script-writing input for the Trade Routes series and it must be generated from the same source of truth the map renders from. Two hand-maintained lists will drift, and a date mismatch between a video and the site is the failure mode that costs the most credibility.

### 2.6 Extend `audit-routes.mjs`

It already verifies smoothed sea lanes don't cross land. Add a check that every timeline event referenced in `episodes.json` has a complete route with valid coordinates, and fail the build if not.

## 3. Locked visual constraints

The video style sheet locks these. The map must not violate them:

* No pure white (`#FFFFFF`), no pure black (`#000000`) anywhere in map rendering
* Route lines in the Oxblood accent, and Oxblood used nowhere else in the frame
* Two type faces total across the whole property
* Compass rose is the transition device — keep it renderable in isolation, on transparent background, as an SVG export

Before changing any map color, type, or motion value, check it against `.memory/design/` and the video style sheet. A palette change now costs a re-render of every published episode.

## 4. Compendium schema additions for video

One Pepper, One Port needs fields the Compendium may not yet carry. Add to the pepper schema:

* `originCoordinates` — for map linkage; required for any cultivar that gets an episode
* `relativeHeat` — heat expressed as a multiple of a jalapeño, computed from SHU midpoint. Absolute SHU is meaningless to a general audience and this is the number the narration uses.
* `routeId` — foreign key to the trade route that carried it, nullable
* `videoStatus` — enum: none / scripted / produced / published
* `videoUrl` — populated on publish so Compendium entries can embed their own episode

Episode priority order is search volume, highest first. The first 40 are listed in the video plan.

## 5. Brand statement — Option A

Add to the About page. This supersedes the current content policy line in `.memory/brand/master-terminology-guide.md` that reads "No references to slave trade in historical narratives." See section 6 for why that line needs to change rather than be worked around.

Placement: About page, its own section, below the founding statement. Plain type. No cartouche, no ornament, no compass rose. The absence of decoration is the point.

> ### On the Record We Keep
>
> The Hot Pepper Trading Company borrows the language of a merchant house — manifests, consignments, bills of lading — because that is how the movement of peppers was actually recorded. The routes on our chart are the routes that existed.
>
> Those same routes carried people. The Atlantic trade that moved capsicum between the Americas, Africa, and the Caribbean was inseparable from the trade in enslaved human beings. Elmina and São Tomé appear on our chart as pepper ports. They were also slaving ports.
>
> We use the aesthetic of that era. We make no claim that the era was romantic. Where a pepper's history runs through coercion, we say so in the entry rather than around it, and we do not name a product after a period of suffering.
>
> The ledger is only worth keeping if it is accurate.

This statement carries the weight once, at the brand level, which is what allows individual entries to stay brief. A site that has said this clearly in one place does not need to restate it in every cultivar record — one factual sentence in context is enough. A site that has never said it has to relitigate the question every time the subject comes near.

Revised founding statement, replacing the current "Founded: 1493 (year peppers documented in Europe)":

> The Company dates itself to 1493. Not because it existed then, but because that is the year the trade began — the first year peppers were carried beyond the hemisphere that made them. Everything in the Compendium descends from that crossing. We keep the record from its opening entry.

## 6. Required changes to existing memory files

### `.memory/brand/master-terminology-guide.md`

Remove: `- No references to slave trade in historical narratives`

Replace with:
```
- Tell the real history. Where a cultivar's or region's story runs through
  coercion, forced labour, or the Atlantic slave trade, state it plainly and
  proportionately — normally one factual sentence in the historical context,
  in the same register as any other trade fact. Do not omit it. Do not
  editorialize, moralize, or dwell on it. Do not make it the subject of an
  entry that is about a pepper.
- The brand statement on the About page carries the weight. Entries stay brief
  because that statement exists.
- Never name a product, consortium, or collection after a period of suffering.
  Name for place, people, cultivar, or route.
- Never apply cargo, consignment, manifest, or lading language to human beings,
  in any context, including quotation.
```

### `supabase/functions/pepper-synthesize`

The AI synthesis rules currently enforce the omission. This is the higher-priority fix, because it is not a style preference — it silently generates historically incomplete entries at scale for every West African, Caribbean, South Asian, and Indian Ocean cultivar. Update the system prompt to match the new policy above and re-run synthesis for affected entries. The prompt should instruct proportionality explicitly — one sentence, factual register, never the focus of the entry — otherwise a model told to "include this history" will over-weight it in exactly the way the user does not want.

### `.memory/features/consortium/embers-of-africa-v1.md`

Flagged for review, not yet resolved. The blend is labelled West African Coast and its lineup is Peri Peri, Urfa Biber, Scotch Bonnet, Wiri Wiri, and Trinidad Scorpion. Three of those five are Caribbean cultivars. They are in the Caribbean because of the transatlantic slave trade — that is the actual historical link between West Africa and those peppers, and it is the one thing the current content policy forbids stating.

As it stands the product's premise is incoherent without the mechanism that has been excluded. Options: rename and re-scope to an Atlantic or diaspora framing that can be stated honestly; restrict the lineup to genuinely West African cultivars; or retire it. Do not ship it with the current name and the current omission. Decision pending — do not implement any option until the user chooses.

## 7. Working agreement between sessions

* This repo's `.memory/` is the source of truth for anything the build must honour. Strategy conversations elsewhere are drafts until they land here.
* Video assets are generated from the site, never hand-recreated. If a video needs a map state that does not exist on the site, build it on the site first.
* Any change to a timeline year, port name, or route geometry is a breaking change for published video. Flag it explicitly rather than absorbing it as a routine edit.
* `episodes.json` is generated, never hand-edited.
