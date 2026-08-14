# Bulk Pepper Import Format

The **Catalog → Bulk Import** admin tool seeds new pepper cultivars into the
`peppers` database table so the compendium can scale past the built-in 190.

> **Imports land as unverified drafts.** Every row is written with
> `status: 'draft'`, `verified: false`, and `data_source: 'imported'`. Nothing
> imported here is ever auto-published. Each entry must be reviewed — especially
> its Scoville range and scientific name — and marked **verified** in the Catalog
> editor before it can be published. This preserves the compendium's trust
> workflow.

## Input

Paste a **JSON array** of seed records into the textarea, then click
**Validate & preview**. The preview reports how many rows are ready, how many are
duplicates (skipped), and which are invalid (with the specific reason). Once the
preview shows N ready rows, **Import N as drafts** writes them.

Deduplication: a row is treated as a duplicate (and skipped) if its slug matches
any built-in pepper id **or** any existing database pepper id. Duplicate slugs
within the pasted batch are also collapsed.

## Seed record schema

Each element of the array is an object with these fields:

### Required

| Field             | Type   | Notes                                             |
| ----------------- | ------ | ------------------------------------------------- |
| `name`            | string | Common cultivar name, e.g. `"Carolina Reaper"`.   |
| `species`         | string | Must be one of the valid **species** codes below. |
| `scientific_name` | string | e.g. `"Capsicum chinense"`.                        |
| `origin`          | string | Place of origin, e.g. `"South Carolina, USA"`.    |
| `region`          | string | Must be one of the valid **regions** below.       |
| `heat_level`      | string | Must be one of the valid **heat levels** below.   |

### Optional

| Field              | Type     | Default                    | Notes                                             |
| ------------------ | -------- | -------------------------- | ------------------------------------------------- |
| `id`               | string   | slug derived from `name`   | URL slug. Re-slugified on import.                 |
| `scoville_min`     | number   | `0`                        | Lower bound of the Scoville range.                |
| `scoville_max`     | number   | `0`                        | Upper bound of the Scoville range.                |
| `scoville_source`  | string   | —                          | Citation for the SHU values. **Strongly recommended.** |
| `alternate_names`  | string[] | `[]`                       | Other names the cultivar is known by.             |
| `description`      | string   | —                          | Short prose description.                          |
| `flavor_notes`     | string[] | `[]`                       | e.g. `["fruity", "smoky"]`.                        |
| `source_citations` | string[] | `[]`                       | URLs / references backing the entry's facts.      |

## Valid enum values

**Species** (`species`):

```
annuum, chinense, frutescens, baccatum, pubescens,
glabriusculum, chacoense, galapagoense, praetermissum,
eximium, tovarii, cardenasii, rhomboideum
```

**Regions** (`region`):

```
Americas, Asia, Africa, Europe, Middle East
```

**Heat levels** (`heat_level`):

```
No Heat, Very Mild, Mild, Medium, Hot, Very Hot, Extreme, Superhot
```

## Sourcing guidance

- **Scoville values SHOULD carry a `scoville_source`.** SHU numbers vary widely
  by grow conditions and testing method — cite where the range came from. If you
  are unsure of an exact number, set `scoville_min`/`scoville_max` to `0` and note
  in `scoville_source` that the value still needs sourcing.
- Recommended authoritative sources to compile cultivar lists from:
  - Wikipedia — **"List of Capsicum cultivars"**
  - **USDA GRIN** (Germplasm Resources Information Network)
  - The **Chile Pepper Institute** (New Mexico State University)
  - Reputable **seed-bank catalogs**
- **Scientific-name validation:** enable the **"Validate scientific names via
  GBIF"** checkbox during preview. It matches each `scientific_name` against
  [GBIF](https://www.gbif.org/) taxonomy; when GBIF returns a canonical name that
  differs, the preview flags it and the import will substitute the GBIF canonical
  name. GBIF checks are best-effort — a fetch error on a row is skipped and never
  blocks the import.

## Example

```json
[
  {
    "name": "Aji Charapita",
    "species": "chinense",
    "scientific_name": "Capsicum chinense",
    "origin": "Amazon rainforest, Peru",
    "region": "Americas",
    "heat_level": "Hot",
    "scoville_min": 30000,
    "scoville_max": 50000,
    "scoville_source": "Multiple seed-bank catalogs; needs primary-source confirmation",
    "alternate_names": ["Charapita", "Mother of all chilies"],
    "flavor_notes": ["fruity", "citrus"],
    "description": "Tiny round golden pods from the Peruvian Amazon, prized as a gourmet chile.",
    "source_citations": ["https://en.wikipedia.org/wiki/List_of_Capsicum_cultivars"]
  }
]
```

A ready-to-edit starter file lives at
[`public/sample-pepper-import.json`](../public/sample-pepper-import.json).
Treat it as a **template to verify** — confirm every fact before publishing.
