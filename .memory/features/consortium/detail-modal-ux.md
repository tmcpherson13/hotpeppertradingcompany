# Memory: features/consortium/detail-modal-ux
Updated: 2026-01-03

Consortium detail modals (opened via 'View Manifest') include a fixed-position `ScrollDownIndicator` component overlaid at the bottom center of the modal viewport. This indicator shows "More below" text with a bouncing chevron arrow and is visible immediately when the modal opens (not at the bottom of the content). The indicator uses `pointer-events-none` to not interfere with scrolling. Bottom padding (`pb-16`) is added to content areas to prevent the indicator from overlapping text.
