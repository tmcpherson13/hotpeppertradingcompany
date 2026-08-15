# Hot Pepper Trading Company — Visual Style Sheet

One page to rule every video, every product card, every post. Pin this above your desk. The value is entirely in not deviating.

Color and type values below are sampled from the live site (`tailwind.config.ts` + `src/App.css` CSS custom properties) so video and web are literally the same values. Do not change them once written.

---

## 1. Color

Sampled from the site so video and web match exactly. (Site token → hex.)

| Role | Name | Hex | Site token | Use |
|---|---|---|---|---|
| Ground | Parchment | `#F4EFE6` | `--parchment` | Backgrounds, map field |
| Ink | Iron Gall | `#291E14` | `--ink-brown` | Body text, rules, line art |
| Accent | Oxblood | `#6F2027` | `--burgundy` / `--primary` | Route lines, heat indicators, one accent per frame |
| Metal | Brass | `#D39E22` | `--gold-accent` | Compass rose, borders, dividers |
| Deep | Hull | `#1B140E` | dark-mode `--background` | Video letterbox, dark backgrounds |

Rules:
* Three colors maximum in any single frame, plus the ground.
* Oxblood is a punctuation mark. If more than roughly a tenth of the frame is red, you have overspent it.
* No pure white (`#FFFFFF`) and no pure black (`#000000`) anywhere, ever. Parchment and Iron Gall replace them. This single rule does more for the period feel than anything else on this sheet.
* Never introduce a color that is not on this table. If a video model returns footage in the wrong palette, grade it or discard it.

## 2. Type

Two faces. Forever.

* Display — `Cinzel`. Titles, dates, the sign-off card. Letterspaced wide on anything under six words.
* Body — `EB Garamond`. Captions, on-screen labels, descriptions.
* No third face. No script fonts. No modern geometric sans anywhere.

Numerals: use oldstyle figures if the face has them. Dates set as `1591`, never `1,591`, never spelled out on screen.

Case: title case for headings, sentence case for captions. Never all-caps except on the compass rose cardinal marks.

## 3. Frame Furniture

Every video, without exception:

* A thin ruled border inset roughly 4% from the frame edge, in Brass, one to two pixels at 1080 wide. Like a printed broadside. This is the single most identifiable element you own in a scrolling feed.
* Compass rose mark, bottom right, inside the border, at about 6% of frame width. Brass, low opacity.
* Date stamp when relevant, top left, inside the border, Display face.
* Nothing else in the margins. Ever.

Safe area: keep all text within the central 80% vertically. Platform UI eats the top and bottom.

## 4. Motion Vocabulary

Permitted:
* Slow push in or out on stills. 4–8 seconds across the shot. Never faster.
* Route lines drawing across the map, Oxblood, roughly 1.5 seconds per leg.
* Cross dissolve, 12–18 frames.
* Compass rose wipe, reserved for act breaks and the sign-off only.
* Hold. Silence and stillness are part of the voice. Use them.

Forbidden:
* Zoom bursts, shake, whip pans, glitch, RGB split
* Any transition that came with the editor as a preset
* Text that flies, bounces, or scales in. Text fades or it cuts.
* Trending audio-reactive effects of any kind

## 5. Captions

Locked, identically, on every video:

* Position: lower third, above the safe margin, never overlapping the border
* Style: Body face, Parchment fill, Iron Gall drop shadow at low opacity, no box, no outline
* Case: sentence case
* Reveal: word-by-word highlight, not karaoke bounce
* Highlight color: Oxblood, on keywords only — dates, place names, cultivar names
* Maximum three lines

## 6. Imagery Sourcing Order

Always work down this list. Only descend when the level above genuinely cannot deliver.

1. Your own origins map, screen-recorded. Highest priority; it is the thing nobody else has.
2. Public domain archival — Library of Congress maps, Rijksmuseum, Wikimedia Commons, Internet Archive, Biodiversity Heritage Library for botanical plates. Free, period-correct, legally clean.
3. Your own photography of actual pods, dishes, and ingredients. Shot on Parchment or Hull background, single light source, no props.
4. Generative video, and only for motion that stills cannot carry — ships under sail, market crowds, harvest, weather.

Target ratio across the channel: at least 70% from levels 1–3. If a video is majority generated, it will read as content-farm output regardless of quality, and the audience you want is the audience most likely to notice.

## 7. Generative Prompt Style Block

If you use a video model, paste this block into every prompt, unchanged, and vary only the subject line.

```
Style: aged nautical chart aesthetic. Muted parchment and iron-gall
palette, desaturated, warm sepia cast. Single soft directional light.
Painterly, not photoreal. Slight paper grain. Static or very slow
camera movement only. No text, no lettering, no signage, no modern
objects. Shallow depth. Muted contrast, lifted blacks.
```

Never let a generated frame contain text — models render lettering badly and it will be the first thing a viewer notices.

## 8. Audio

* One narrator. One voice. No exceptions across the channel.
* Music bed: low strings, distant sea, rigging creak. One track family, used at low level, ducked under narration by roughly 18 dB.
* No stock cinematic drum hits. No riser stings before a reveal.
* Sound design: sparse. A gull, a rope, a page turn. Three effects maximum per video.
* Silence for a full beat before the sign-off, every time.

## 9. Sign-Off

Identical, every video, no variation:

* Cut to Parchment ground
* Compass rose, centered, Brass
* Narrator: "So it is entered in the record."
* Hold two seconds
* End

This is the most valuable ten seconds on the channel. It is what people repeat back to you.

## 10. Language Register

Locked vocabulary — no synonyms, anywhere, in any medium:

| Use | Never |
|---|---|
| Cargo | products, items |
| Consortium | blend, collection, bundle |
| Compendium | database, wiki, encyclopedia |
| Manifest | order, cart |
| Consignment | inventory, drop, stock |
| Bill of Lading | receipt, invoice |
| Trading Post | shop, store |
| Factor | supplier, vendor, partner |
| The Record / The Ledger | history section, blog |
| Entered on the manifest | subscribed, signed up |

Narration register: declarative, unhurried, slightly formal, never arch. You are a records keeper reading from a ledger, not a pirate. If a line would sound absurd read aloud in a normal voice, cut it.

The governing rule: never break character in the copy, and never let the character obstruct the utility. Someone who wants a habanero's heat level gets it in under two seconds, regardless of how the page is dressed.

## 11. Export Specification

* Vertical: 1080 × 1920, H.264, 30fps, 10–16 Mbps
* Horizontal: 1920 × 1080, same codec
* Audio: -14 LUFS integrated, true peak below -1 dB
* Filename convention: `HPTC_[series]_[number]_[slug]_[v]`
  Example: `HPTC_dispersal_09_capsaicin_v2`

## 12. The Deviation Rule

When you want to break something on this sheet — and you will, around video thirty, out of boredom — the answer is no. Boredom with your own visual identity is the point at which the audience is finally starting to recognize it.

Revisit this sheet once a year. Not sooner.
