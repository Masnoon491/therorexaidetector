-- scan_history: fix restrictive SELECT & INSERT
DROP POLICY IF EXISTS "Users can read own scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Admins can read all scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert own scan history" ON public.scan_history;

CREATE POLICY "Users can read own scan history" ON public.scan_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all scan history" ON public.scan_history FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own scan history" ON public.scan_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- profiles: fix restrictive SELECT, INSERT, UPDATE
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- payment_transactions: fix restrictive SELECT, INSERT, UPDATE
DROP POLICY IF EXISTS "Users can read own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.payment_transactions;

CREATE POLICY "Users can read own transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update transactions" ON public.payment_transactions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own transactions" ON public.payment_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);