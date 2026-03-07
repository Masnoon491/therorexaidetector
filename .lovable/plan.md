

## UI/UX Refactor: High-Visibility Action Buttons & Intuitive Flow

### Overview
Enhance the three primary action buttons (Scan, Import, Download Report) with professional styling, better positioning, and accessibility improvements.

### Changes

**1. ContentEditor.tsx — Import Button Upgrade**
- Replace the current ghost "Import" button with an outline-styled button using `UploadCloud` icon (from lucide-react)
- Add navy border styling: `variant="outline"` with `border-navy` class
- Add `aria-label="Import document"` 
- Keep it in the toolbar row (top of editor), move to the right side, swap positions with the trash button

**2. ContentEditor.tsx — Expose `wordCount` for parent**
- Already exposed via `onTextChange` callback — no change needed

**3. Dashboard.tsx — Primary Scan Button Below Editor**
- Move the scan button from the right sidebar panel to directly below the editor (bottom-right)
- Style: large teal button (`h-12 px-8 text-base font-bold`), min-height 48px
- Add conditional pulse animation class when wordCount >= 200 and all conditions met (`animate-pulse-subtle`)
- Add `aria-label="Start AI authenticity scan"`
- Keep the sidebar scan button for desktop but make the bottom-right one the primary CTA
- On mobile, the existing bottom bar scan button gets the same upgraded styling

**4. ResultsPanel.tsx — Download Report Button Upgrade**
- Rename label to "Generate Certified Audit Report (PDF)"
- Change styling to solid navy background: `bg-[hsl(var(--navy))] text-white hover:bg-[hsl(var(--navy))]/90`
- Add `Download` icon, min-height 48px (`h-12`)
- Add `aria-label="Generate certified audit report PDF"`
- Add a floating action button (FAB) on mobile: fixed bottom-right, circular navy button with download icon, only visible when results exist and on small screens

**5. ScanOptionsPanel.tsx — Sync Scan Button Styling**
- Increase button height to `h-12`, font to `text-base font-bold`
- Add pulse animation when scan is ready (wordCount >= 200, doc name set, context confirmed)

**6. Hover Effects on Buttons**
- Add CSS transition for elevation on hover: `transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`
- Apply to all three primary buttons (Scan, Import, Download)
- Use the existing `animate-pulse-subtle` keyframe for the scan-ready pulse

### Files to Edit
- `src/components/ContentEditor.tsx` — Import button restyle
- `src/pages/Dashboard.tsx` — Primary scan button below editor
- `src/components/ResultsPanel.tsx` — Download report button + mobile FAB
- `src/components/ScanOptionsPanel.tsx` — Scan button size increase + pulse

### No database or dependency changes needed.

