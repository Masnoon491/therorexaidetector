
Goal: Fix why clicking “Scan” completes the request but shows no generated result cards.

What I found
1) The scan backend is now working:
- Network calls to `scan-content` return `200` with a valid body.
- Edge function test call also returns full `results` payload.

2) The UI is reading the wrong response shape:
- Current UI expects:
  - `data.ai.score`
  - `data.readability.grade` or `data.readability.score`
- Actual API response is nested:
  - `data.results.ai.confidence.AI`
  - `data.results.readability.readability.fleschGradeLevel`
  - `data.results.plagiarism.score`

3) Because of the mismatch, all cards resolve to `null` and keep showing placeholders, which looks like “nothing generated.”

4) There is also a non-blocking React warning from `ResultsSidebar` around `SkeletonBar`; I’ll clean this while fixing rendering states.

Implementation plan
1) Normalize API response before storing state (in `src/pages/Index.tsx`)
- Add a small mapper function to convert raw API shape into the existing UI shape.
- Mapping rules:
  - AI score: `results.ai.confidence.AI` (fallbacks supported)
  - Plagiarism score: `results.plagiarism.score`
  - Readability grade: `results.readability.readability.fleschGradeLevel` (as string/number)
- Set `setResults(normalized)` instead of `setResults(data)`.

2) Update `ScanResults` type to match normalized data contract
- Keep current cards compatible and type-safe.
- Add optional fields only if used by UI.

3) Improve result rendering behavior (in `src/components/ResultsSidebar.tsx`)
- During scan: show loading skeleton.
- After scan:
  - If value exists: show value.
  - If missing: show explicit “N/A” (not loading skeleton).
- This prevents “silent empty” states that look broken.

4) Address the React warning in sidebar
- Replace/refactor local `SkeletonBar` usage so no ref warning appears.
- Keep visual style unchanged.

5) Keep backend function behavior intact
- No database or auth changes needed.
- No secret changes needed.
- API integration/payload can stay as-is since requests now succeed.

Validation plan (end-to-end)
1) Paste test text and click Scan.
2) Confirm:
- No runtime error toast.
- AI Score and Human Score display percentages.
- Readability Grade displays value (or N/A if unavailable).
3) Confirm console no longer shows the `Function components cannot be given refs` warning from `ResultsSidebar`.
4) Trigger/verify error handling still works:
- 429 -> “Rate Limited” toast.
- Other API errors -> “Scan Failed” toast with parsed message.

Technical details
```text
Current flow (broken display):
Scan button
  -> invoke scan-content
    -> returns { results: {...} }   (OK)
      -> setResults(data)           (raw nested shape)
        -> sidebar reads results.ai.score (undefined)
           => placeholders forever

Planned flow:
Scan button
  -> invoke scan-content
    -> returns { results: {...} }
      -> normalizeResponse(data) => {
           ai: { score },
           plagiarism: { score },
           readability: { grade }
         }
        -> setResults(normalized)
          -> sidebar reads normalized fields
             => values render correctly
```

Field mapping to implement
- `ui.ai.score` <= `api.results.ai.confidence.AI` (number 0..1)
- `ui.plagiarism.score` <= `api.results.plagiarism.score` (number, typically 0..100)
- `ui.readability.grade` <= `api.results.readability.readability.fleschGradeLevel`

Why this resolves your issue
- Your scan is already generating server-side results; the frontend just isn’t reading the returned schema correctly.
- Normalization aligns backend response with current UI expectations, so the cards will populate immediately after scan completion.
