-- Allow admin upserts on user_credits (required for approve flow when row is missing)
DROP POLICY IF EXISTS "Admins can insert user credits" ON public.user_credits;
CREATE POLICY "Admins can insert user credits"
ON public.user_credits
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Ensure every profile has a corresponding user_credits row
CREATE OR REPLACE FUNCTION public.ensure_user_credits_on_profile_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_create_user_credits ON public.profiles;
CREATE TRIGGER trg_profiles_create_user_credits
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.ensure_user_credits_on_profile_insert();

-- Deduct global API inventory on each scan_history insert
DROP TRIGGER IF EXISTS trg_scan_history_deduct_inventory ON public.scan_history;
CREATE TRIGGER trg_scan_history_deduct_inventory
AFTER INSERT ON public.scan_history
FOR EACH ROW
EXECUTE FUNCTION public.deduct_inventory_on_scan();