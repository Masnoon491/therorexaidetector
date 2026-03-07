

## Upgrade: Industry-Grade Professional Audit Certificate

The current report already has most of the structure requested. The main changes are: **3-tier color theming** (adding Amber for mixed range), **enhanced visual scorecard** with circular gauge drawing, **larger embossed seal** with WhatsApp contact, **audit trail on every page footer**, and **removal of readability/grammar** (already done).

### Changes to `src/utils/generatePdfReport.ts`

**1. 3-Tier Color Theme Logic**
- Replace current 2-tier (`getAccent`) with 3 tiers:
  - AI > 70%: Red theme, verdict "HIGH RISK"
  - Human > 70% (AI < 30%): Teal theme, verdict "VERIFIED HUMAN"  
  - 30-70%: Amber (#FF9800) / Navy theme, verdict "MODERATE RISK"

**2. Circular Gauge Scorecard (Page 1)**
- Replace the 4 flat score cards with two large SVG-style circular gauges drawn via `doc.circle()` arcs:
  - Left gauge: Human Originality % (Teal arc on grey track)
  - Right gauge: AI Detection % (accent-colored arc)
- Below gauges: a single Risk Assessment card with the 3-tier label and color

**3. Document Identity Block**
- Replace plain text info lines with color-coded rounded blocks:
  - Document Name | Scan Date (DD-MM-YYYY, GMT+6) | Word Count | Audit ID
  - Each in a small pill/card with LIGHT background

**4. Thick Horizontal Progress Bar**
- Replace the thin 5mm bars with 8mm thick bars with rounded ends and percentage labels inside the bar

**5. Enhanced Seal**
- Increase seal radius from 22mm to 28mm
- Add 4 concentric rings (outer accent thick, decorative dots ring, navy ring, inner accent)
- Add "WhatsApp: +8801819185751" text curved below the seal
- Add "VERIFIED" or "HIGH RISK" stamp text based on score

**6. Audit Trail in Footer**
- Update `drawPageChrome` to accept `meta` and render `Ref: {auditId} | IP: {ipAddress}` in the footer on every page

**7. Removal**
- Readability/grammar already removed. No changes needed.

**8. Page Chrome Updates**
- Pass `meta` to `drawPageChrome` and `newPage` for audit trail rendering
- Keep existing disclaimers, add "Always apply human judgment" as separate line

### No other files need changes. No database changes required.

