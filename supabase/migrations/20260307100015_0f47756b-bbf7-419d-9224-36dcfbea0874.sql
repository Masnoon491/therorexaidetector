
-- Add status column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

-- Create edge function-friendly delete function for admin to delete user data (cascade)
-- This deletes from profiles, user_credits, scan_history, scans, payment_transactions, user_roles
CREATE OR REPLACE FUNCTION public.admin_delete_user(_target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admins
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _target_user_id;
  DELETE FROM public.scan_history WHERE user_id = _target_user_id;
  DELETE FROM public.scans WHERE user_id = _target_user_id;
  DELETE FROM public.payment_transactions WHERE user_id = _target_user_id;
  DELETE FROM public.user_credits WHERE user_id = _target_user_id;
  DELETE FROM public.profiles WHERE id = _target_user_id;
END;
$$;

-- Allow admins to update profiles (for status changes)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admin deletes on relevant tables
CREATE POLICY "Admins can delete scan_history"
ON public.scan_history
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete scans"
ON public.scans
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete payment_transactions"
ON public.payment_transactions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user_credits"
ON public.user_credits
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
