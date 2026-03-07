

## Fix: Convert All Restrictive RLS Policies to Permissive

**The Core Problem**: Every table still has `Permissive: No` on all RLS policies. This means multiple SELECT policies on the same table require ALL conditions to be met simultaneously, which blocks both regular users and admins from reading data. This has been the root cause of every "missing data" bug in this project.

**What needs to happen**: A single database migration to drop and recreate all policies as **permissive** (the Postgres default). No code changes are needed — the schema, columns, realtime listener, document name field, and UI are all already in place and working correctly.

### Tables & Policies to Fix

**`scan_history`** — 3 policies (SELECT×2, INSERT×1)
**`profiles`** — 4 policies (SELECT×2, INSERT×1, UPDATE×1)
**`payment_transactions`** — 3 policies (SELECT×1, INSERT×1, UPDATE×1)
**`user_credits`** — 6 policies (SELECT×2, INSERT×2, UPDATE×2)
**`user_roles`** — 2 policies (SELECT×2)
**`api_inventory`** — 2 policies (SELECT×1, UPDATE×1)

All will be dropped and recreated without the `AS RESTRICTIVE` qualifier, making them permissive. The USING/WITH CHECK expressions stay identical.

### What Already Works (No Changes Needed)
- `scan_history` table has all required columns including `document_name`, `content_snippet`, `risk_assessment`
- `ContentEditor.tsx` has the mandatory Document Name field with auto-fill from imports
- `useScanHistory.ts` has Supabase Realtime listener
- `ScanHistoryPanel.tsx` has the professional table with Total Credits Spent summary
- All dates use `DD-MM-YYYY | HH:mm` in GMT+6
- Dashboard calls `logScan` after successful API response

### Migration SQL Summary
One migration file: drop all existing policies, recreate each as permissive with the same access logic.

