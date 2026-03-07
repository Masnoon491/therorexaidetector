

## Admin Panel Extension: Centralized User Audit & Direct Credit Management

### Current State
The Admin panel (`Admin.tsx`) already has a User Credit Tracking table, API Inventory card, Global Scan Audit, and Payment Transactions sections. RLS policies on all tables are still **restrictive** (`Permissive: No`), which has been a recurring blocker -- this must be fixed again in this pass.

### Plan

**1. Database Migration -- Fix RLS (again) + enable realtime on user_credits**

All tables still show `Permissive: No` on every policy. Drop and recreate all policies as permissive (no `AS RESTRICTIVE`). This is the same fix attempted multiple times but the policies keep reverting to restrictive. Additionally, enable realtime on `user_credits` so the admin sees balance changes instantly.

**2. Enhance Admin.tsx -- Master User Table**

Refactor `fetchUserSummaries` to include:
- **Plan Name**: Pull from latest approved `payment_transactions` per user
- **Total Credits Spent**: Sum `credits_used` from `scans` table (currently uses `scan_history`)
- **Last Scan Date**: Max `created_at` from `scans` table
- **Account Expiry**: Already exists, keep as-is with DD-MM-YYYY GMT+6

Add all users who have a profile (not just those with purchases) so admins see every registered user.

**3. Direct Credit Management -- "Give Direct Credit" Modal**

- Add a `Dialog` with an `Input` for credit amount next to each user row
- On submit:
  1. Upsert `user_credits` adding the entered amount to the user's current balance
  2. Deduct the same amount from `api_inventory.remaining_credits`
  3. Insert a record into `payment_transactions` with `plan_name: "Manual Admin Adjustment"`, `status: "approved"`, `trx_id: "ADMIN-{timestamp}"`, `amount_bdt: "0"`, and `credits` set to the entered amount
  4. Toast confirmation

**4. Global Business Summary Card**

Add a summary section at the top of Admin showing:
- **Total Active Subscriptions**: Count of users with `expires_at > now()` in `user_credits`
- **Cumulative Usage**: Sum of all `credits_used` from the `scans` table across all users
- **Remaining Global Inventory**: The existing `api_inventory.remaining_credits` value (already displayed)

**5. Files to Edit**

| File | Change |
|------|--------|
| `src/pages/Admin.tsx` | Add summary cards, enhance user table columns, add Direct Credit modal, add "Give Direct Credit" button per row |
| Migration SQL | Drop/recreate all RLS policies as permissive (fix persistent restrictive issue) |

**6. No Changes To**
- `ContentEditor.tsx` -- mandatory Document Name + handleScan logic preserved
- `ScanHistoryPanel.tsx` -- user-level history stays as-is
- `Dashboard.tsx` -- scan recording logic untouched

