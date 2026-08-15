# The Windward Passage (№ 004)

Region: The Caribbean — Greater and Lesser Antilles
Modal File: `ConsortiumDetailModal.tsx`
Heat Range: 10,000–2,000,000 SHU

Replaces: `embers-of-africa-v1.md`. Delete that file once this ships. See History below.

## The Passage

The Windward Passage is the strait between Cuba and Hispaniola — roughly fifty miles of open water linking the Atlantic to the Caribbean Sea. Every ship working between the Old World and the Spanish Main passed through it or around it. It appears on every serious chart of the region from the sixteenth century forward.

It is a real trade route, it is genuinely on the map, and it names the sea rather than a period. That makes it correct under the naming policy in `brand/master-terminology-guide.md`: name for place, people, cultivar, or route — never for a period of suffering.

## Pepper Lineup

Unchanged from Embers of Africa v1. The blend was never the problem; the label was.

| Position | Pepper | Heat (SHU) | Role | On route |
|---|---|---|---|---|
| 1 | Peri Peri | 50,000–175,000 | Anchor | Yes — Atlantic circuit |
| 2 | Urfa Biber | 10,000–30,000 | Bridge | No — see Factor's Note |
| 3 | Scotch Bonnet | 100,000–350,000 | Body | Yes |
| 4 | Wiri Wiri | 100,000–350,000 | Vanguard | Yes |
| 5 | Trinidad Scorpion | 1,200,000–2,000,000 | Flagship | Yes |

Peri peri is defensible as on-route rather than an outlier. It is a *C. frutescens* line that reached Africa on Portuguese ships out of Brazil — the same Atlantic circuit that carried scotch bonnet's ancestors into the Caribbean. It belongs in an Atlantic framing in a way it never belonged in a strictly West African one.

Urfa Biber is the one genuine outlier and is declared as such, not hidden.

## Copy

### Consortium description

> Four cultivars of the Antilles and one of the Atlantic circuit that fed them. The Windward Passage — the strait between Cuba and Hispaniola — carried nearly everything that moved between the Old World and the Caribbean, and the peppers that define the islands' cooking came through it or around it. Scotch bonnet and wiri wiri for the fruit and body, peri peri for the Atlantic anchor, Trinidad scorpion for the flagship heat. Assembled as the islands assembled themselves: from what arrived, made into something that had not existed before.

### Factor's Note

> Four of five cultivars are drawn from the Passage and the Atlantic circuit that fed it. Urfa Biber, of Anatolia, is carried outside the route — added for the smoke and raisin depth the blend wanted and the region does not supply. A trading house sources what the cargo requires, and records what it sourced.

## New pattern: the Factor's Note

The Factor's Note is a new required field on every consortium, not just this one. It declares which cultivars are on-route and which were carried outside it for flavor.

Rationale: the brand's closing claim is that the ledger is only worth keeping if it is accurate. Blends assembled with creative license are fine — every real house sourced opportunistically — but undeclared license puts the products in tension with the Compendium's rigor, and the Compendium is the more valuable asset. Declaring the license resolves the tension and reads as voice rather than apology.

Implementation:
* Add `factorsNote` to the consortium schema in `src/data/consortiums.ts`
* Render below the lineup in `ConsortiumDetailModal.tsx`
* Required field. A consortium with no off-route cultivars still carries a note saying so.
* Backfill for all existing consortiums — Cradle of Fire, Phoenician Legacy, Manila Galleon, Silk & Jade Passages, Old Natchez Trace

## Attribution

Pending the owner's conversation with the person the original blend was made for. If she consents to being named, the Bill of Lading card carries a single line in merchant-ledger form:

> Commissioned for [name], of [city].

Do not implement any attribution line until the owner confirms consent. Do not credit her as creator or co-creator in any form — she did not formulate the blend, and an inaccurate credit is worse than none.

## History

Embers of Africa (v1) was labelled West African Coast while three of its five cultivars are Caribbean. The historical link between West Africa and those peppers is the transatlantic trade, which the previous content policy forbade stating — leaving the product's premise unexplainable.

Renaming to a Caribbean route resolves it. The peppers now match the label, the one true outlier is declared rather than concealed, and the name points at a sea lane instead of a period.

Embers of Africa persists as a private gift outside the commercial line. It is not a product, has no listing, and should not appear in `consortiums.ts` or anywhere in the storefront.

## Build tasks

* Rename the consortium in `src/data/consortiums.ts`, keeping № 004 and the ordering lock intact — see `consortium/ordering-lock.md`
* Update `src/data/blendContents.ts` if the blend is keyed by name
* Regenerate the consortium artwork: Caribbean chart, Windward Passage between Cuba and Hispaniola, period cartographic style. Retire the West African caravel image.
* Add `factorsNote` to the schema and backfill all consortiums
* Check `src/assets/consortium/` and `src/assets/regional-blends/` for filenames carrying the old name
* Grep the whole repo for "Embers of Africa" before closing the task
* Delete `.memory/features/consortium/embers-of-africa-v1.md`
