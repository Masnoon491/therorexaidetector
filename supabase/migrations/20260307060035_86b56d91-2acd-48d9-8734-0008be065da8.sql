
-- ============================================
-- Convert ALL restrictive RLS policies to permissive
-- ============================================

-- scan_history: drop 3 policies
DROP POLICY IF EXISTS "Users can read own scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Admins can read all scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert own scan history" ON public.scan_history;

CREATE POLICY "Users can read own scan history" ON public.scan_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all scan history" ON public.scan_history FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own scan history" ON public.scan_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- profiles: drop 4 policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- payment_transactions: drop 3 policies
DROP POLICY IF EXISTS "Users can read own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.payment_transactions;

CREATE POLICY "Users can read own transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update transactions" ON public.payment_transactions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own transactions" ON public.payment_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- user_credits: drop 6 policies
DROP POLICY IF EXISTS "Users can read own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Admins can read user credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Admins can update user credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can insert own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Admins can insert user credits" ON public.user_credits;

CREATE POLICY "Users can read own credits" ON public.user_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read user credits" ON public.user_credits FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own credits" ON public.user_credits FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can update user credits" ON public.user_credits FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own credits" ON public.user_credits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can insert user credits" ON public.user_credits FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- user_roles: drop 2 policies
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;

CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- api_inventory: drop 2 policies
DROP POLICY IF EXISTS "Admins can read inventory" ON public.api_inventory;
DROP POLICY IF EXISTS "Admins can update inventory" ON public.api_inventory;

CREATE POLICY "Admins can read inventory" ON public.api_inventory FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update inventory" ON public.api_inventory FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
