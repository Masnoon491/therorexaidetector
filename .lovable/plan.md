

## Fix: Scan History RLS Policies

**Root Cause**: The `scan_history` table has two SELECT policies both marked as **restrictive** (`Permissive: No`):
- "Users can read own scan history" — requires `auth.uid() = user_id`
- "Admins can read all scan history" — requires admin role

Since both are restrictive, a regular user must satisfy BOTH conditions, which fails. Same pattern that was already fixed for `user_credits`.

**Fix**: Drop the two restrictive SELECT policies and replace with **permissive** ones.

```sql
DROP POLICY IF EXISTS "Users can read own scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Admins can read all scan history" ON public.scan_history;

CREATE POLICY "Users can read own scan history"
  ON public.scan_history FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all scan history"
  ON public.scan_history FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
```

Also fix the INSERT policy (same restrictive issue):
```sql
DROP POLICY IF EXISTS "Users can insert own scan history" ON public.scan_history;

CREATE POLICY "Users can insert own scan history"
  ON public.scan_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

**While we're at it**, the same restrictive bug exists on `profiles` and `payment_transactions` tables. We should fix all remaining tables in one migration to prevent further issues.

No code changes needed — only a single database migration.

