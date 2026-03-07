
-- Add manual_base_stock column
ALTER TABLE public.api_inventory ADD COLUMN IF NOT EXISTS manual_base_stock integer NOT NULL DEFAULT 0;

-- Drop all existing restrictive policies on api_inventory and recreate as permissive
DROP POLICY IF EXISTS "Admins can read inventory" ON public.api_inventory;
DROP POLICY IF EXISTS "Admins can update inventory" ON public.api_inventory;
DROP POLICY IF EXISTS "Admins can read inventory " ON public.api_inventory;
DROP POLICY IF EXISTS "Admins can update inventory " ON public.api_inventory;

CREATE POLICY "Admins can read inventory"
  ON public.api_inventory FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inventory"
  ON public.api_inventory FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix all other tables: drop restrictive, recreate permissive
-- profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile " ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- user_credits
DROP POLICY IF EXISTS "Users can read own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can insert own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can read own credits " ON public.user_credits;
DROP POLICY IF EXISTS "Users can update own credits " ON public.user_credits;
DROP POLICY IF EXISTS "Users can insert own credits " ON public.user_credits;

CREATE POLICY "Users can read own credits"
  ON public.user_credits FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own credits"
  ON public.user_credits FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own credits"
  ON public.user_credits FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- scans
DROP POLICY IF EXISTS "Users can read own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can insert own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can read own scans " ON public.scans;
DROP POLICY IF EXISTS "Users can insert own scans " ON public.scans;

CREATE POLICY "Users can read own scans"
  ON public.scans FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own scans"
  ON public.scans FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- payment_transactions
DROP POLICY IF EXISTS "Users can read own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can read own transactions " ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can update transactions " ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions " ON public.payment_transactions;

CREATE POLICY "Users can read own transactions"
  ON public.payment_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update transactions"
  ON public.payment_transactions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own transactions"
  ON public.payment_transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role " ON public.user_roles;

CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- scan_history
DROP POLICY IF EXISTS "Users can read own scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert own scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Users can read own scan history " ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert own scan history " ON public.scan_history;

CREATE POLICY "Users can read own scan history"
  ON public.scan_history FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own scan history"
  ON public.scan_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
