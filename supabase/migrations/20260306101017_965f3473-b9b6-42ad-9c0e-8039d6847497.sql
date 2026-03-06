
DROP POLICY IF EXISTS "Users can read own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Admins can read user credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Admins can update user credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can insert own credits" ON public.user_credits;

CREATE POLICY "Users can read own credits" ON public.user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read user credits" ON public.user_credits FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own credits" ON public.user_credits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update user credits" ON public.user_credits FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own credits" ON public.user_credits FOR INSERT WITH CHECK (auth.uid() = user_id);
