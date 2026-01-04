# Memory: process/execution-standards
Updated: 2025-01-04

## Execution Standards Protocol

### 1. Multi-Part Request Protocol
- Parse ALL numbered/bullet items before execution
- Create explicit task list with tracking
- Execute each item completely before moving to next
- Verify each item upon completion
- Never mark complete until ALL parts are addressed

### 2. Proactive Improvement Protocol (70% Confidence Threshold)
Before finalizing any change, scan for and auto-correct:
- Obvious visual inconsistencies (misaligned elements, spacing issues)
- Text contrast problems against backgrounds
- Missing responsive breakpoints in new components
- Inconsistent styling patterns vs. established design system
- Button placement and functionality issues

Only apply proactive fixes when confidence ≥70% that user would accept.

### 3. Anti-Repetition Protocol
- Track all user requests from current session
- If a similar request was made previously, reference original implementation
- Flag recurring patterns that suggest underlying architecture issues
- After 2+ similar requests, propose permanent solution (abstraction, shared component, design token)

### 4. Visual Integrity Scan (Run Automatically)
Before completing any UI-related task:
- **Spacing audit**: Check for uneven gaps, orphaned elements, misaligned cards
- **Text visibility**: Scan all text for adequate contrast against backgrounds (auto-correct if failing)
- **Button audit**: Verify all buttons have `type="button"` (except form submits), correct event handlers, visible hover/focus states
- **Responsive check**: Verify layout at mobile, tablet, desktop breakpoints
- **ID consistency**: Ensure matching IDs across data sources (e.g., carousel vs. cards vs. modals)

### 5. Verification Requirements
Before marking any task complete:
- Confirm fix actually resolves the stated issue
- Check for regression in adjacent features
- Verify at desktop and mobile breakpoints when relevant
- Test interactive features (buttons, modals, navigation) work as expected

### 6. Session Memory
- Retain context from all user requests in current conversation
- Cross-reference new requests against previous fixes
- Identify when a "new" request is actually a repeat of an unresolved issue

### 7. Anti-Redundancy Protocol for Suggestions
- NEVER suggest actions that are already part of the current execution plan
- Action suggestions should only offer NEW directions not already discussed
- If plan is approved, execute immediately without re-confirming items in plan

### 8. Visual Audit Analysis Requirements
- Screenshots must be ANALYZED, not just captured
- Button visibility must be verified visually (not just code review)
- Component context matters: verify which components render in which view modes
- After making visual fixes, re-screenshot to confirm fix worked
