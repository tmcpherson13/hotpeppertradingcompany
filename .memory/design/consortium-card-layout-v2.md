# Memory: design/consortium-card-layout-v2
Updated: 2026-01-05

## Consortium Card Design Settings (ConsortiumCard.tsx)

### Content Container (Line 92)
- Fixed height: `h-[330px]`
- Padding: `p-4`
- Background: `bg-parchment-dark`
- Layout: `flex flex-col`

### Region Label Section (Lines 94-100)
- Container: `flex items-start gap-2 mb-3 min-h-[2.25rem]`
- Decorative lines: `flex-1 h-px bg-ink/20 mt-[0.35rem]`
- Label text: `text-[10px] uppercase tracking-[0.2em] text-ink/60 font-heading text-center leading-tight max-w-[70%]`

### Name Spacing - Conditional (Lines 103-109)
- Font: `font-blackpearl text-xl text-ink text-center`
- **Excluded cards** (use `mb-2`): 'Silk & Jade Passages', 'Atlantic Provenance'
- **All other cards** (use `mb-5`): Standard spacing for visual balance

### Price & Description Container (Lines 111-121)
- Wrapper: `flex-1 flex flex-col items-center justify-center` — centers content vertically between name and buttons
- Price container: `flex items-center justify-center text-xl uppercase tracking-wider text-ink/60 font-heading mb-4`
- Price text: `text-tyrian font-semibold`
- Weight display: **Removed** (only price shown)
- Description: `font-body text-xs text-ink/70 leading-relaxed text-center italic line-clamp-2 min-h-[2.5rem]`

### Button Section (Lines 123-145)
- Container: `border-t border-dashed border-ink/20 pt-3 flex flex-col gap-2 mt-auto`
- Buttons anchored to bottom via `mt-auto`
- Two buttons: "View Manifest" (ink outline) and "Procure Stock" (tyrian outline)
- Button text: `text-[10px] uppercase tracking-[0.1em]`

### Key Design Decisions
1. Height of 330px accommodates all content including two-line region labels
2. Only two cards (Silk & Jade, Atlantic Provenance) use reduced name margin due to their already-balanced layout
3. Price font doubled from 10px to xl for prominence
4. Flex-1 container ensures price/description float centered between static elements above and below
