# Memory: design/consortium-card-layout-v2
Updated: 2026-01-05

## Consortium Card Design Settings (ConsortiumCard.tsx)

### Content Container
- Fixed height: `h-[330px]` on the content container (line 92)
- Background: `bg-parchment-dark`
- Layout: `flex flex-col`

### Name Spacing (Conditional)
Cards with shorter region labels get reduced margin after the name:
- **Excluded cards** (use `mb-2`): 'Silk & Jade Passages', 'Atlantic Provenance'
- **All other cards** (use `mb-5`): Standard spacing for visual balance

### Price Display
- Weight display removed from cards (only price shown)
- Font size: `text-xl` (doubled from original text-[10px])
- Styling: `uppercase tracking-wider text-tyrian font-semibold`

### Price & Description Container
- Wrapped in `flex-1 flex flex-col items-center justify-center` to center content equally between the name and buttons
- Price has `mb-4` spacing before description
- Description: `font-body text-xs text-ink/70 italic line-clamp-2 min-h-[2.5rem]`

### Buttons
- Anchored to bottom with `mt-auto` on button container
- Two buttons: "View Manifest" and "Procure Stock"
- Separated by `border-t border-dashed border-ink/20 pt-3`
