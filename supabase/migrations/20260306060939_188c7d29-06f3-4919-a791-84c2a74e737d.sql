
-- Create api_inventory table (singleton row tracking admin's API credit pool)
CREATE TABLE public.api_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_credits integer NOT NULL DEFAULT 15000,
  remaining_credits integer NOT NULL DEFAULT 15000,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert the initial inventory row
INSERT INTO public.api_inventory (total_credits, remaining_credits) VALUES (15000, 15000);

-- Enable RLS
ALTER TABLE public.api_inventory ENABLE ROW LEVEL SECURITY;

-- Only admins can read and update inventory
CREATE POLICY "Admins can read inventory" ON public.api_inventory
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inventory" ON public.api_inventory
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- CRITICAL FIX: Allow admins to update ANY user's credits (currently only self-update allowed)
CREATE POLICY "Admins can update user credits" ON public.user_credits
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read any user credits
CREATE POLICY "Admins can read user credits" ON public.user_credits
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
