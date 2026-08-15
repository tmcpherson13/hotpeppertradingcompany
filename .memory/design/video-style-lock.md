# Video Style Lock

Binding subset of the video style sheet — the values the build and the video must agree on. Full production reference lives at `docs/video/style-sheet.md`.

Colors and faces are sampled from the live site (`tailwind.config.ts` + `src/App.css`) so the video palette and the site palette are literally the same values. Do not change them here without changing them on the site, and vice versa. A palette change costs a re-render of every published episode.

---

## 1. Color

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
* No pure white (`#FFFFFF`) and no pure black (`#000000`) anywhere, ever. Parchment and Iron Gall replace them.
* Never introduce a color that is not on this table. If a video model returns footage in the wrong palette, grade it or discard it.

## 2. Type

Two faces. Forever.

* Display — `Cinzel`. Titles, dates, the sign-off card. Letterspaced wide on anything under six words.
* Body — `EB Garamond`. Captions, on-screen labels, descriptions.
* No third face. No script fonts. No modern geometric sans anywhere.

Numerals: oldstyle figures if the face has them. Dates set as `1591`, never `1,591`, never spelled out on screen.

Case: title case for headings, sentence case for captions. Never all-caps except on the compass rose cardinal marks.

## 3. Frame Furniture

Every video, without exception:

* A thin ruled border inset roughly 4% from the frame edge, in Brass, one to two pixels at 1080 wide. Like a printed broadside.
* Compass rose mark, bottom right, inside the border, at about 6% of frame width. Brass, low opacity.
* Date stamp when relevant, top left, inside the border, Display face.
* Nothing else in the margins. Ever.

Safe area: keep all text within the central 80% vertically.

## 5. Captions

Locked, identically, on every video:

* Position: lower third, above the safe margin, never overlapping the border
* Style: Body face, Parchment fill, Iron Gall drop shadow at low opacity, no box, no outline
* Case: sentence case
* Reveal: word-by-word highlight, not karaoke bounce
* Highlight color: Oxblood, on keywords only — dates, place names, cultivar names
* Maximum three lines

## 8. Audio

* One narrator. One voice. No exceptions across the channel.
* Music bed: low strings, distant sea, rigging creak. One track family, low level, ducked under narration by roughly 18 dB.
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

Narration register: declarative, unhurried, slightly formal, never arch. A records keeper reading from a ledger, not a pirate.

The governing rule: never break character in the copy, and never let the character obstruct the utility. Someone who wants a habanero's heat level gets it in under two seconds, regardless of how the page is dressed.
