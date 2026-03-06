CREATE POLICY "Admins can read all scan history" ON public.scan_history
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Also allow admins to read all profiles for email lookup
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
