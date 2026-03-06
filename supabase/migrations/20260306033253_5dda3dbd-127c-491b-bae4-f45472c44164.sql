
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can read user_roles
CREATE POLICY "Admins can read user_roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

-- Payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trx_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0,
  amount_bdt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
ON public.payment_transactions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can read their own transactions
CREATE POLICY "Users can read own transactions"
ON public.payment_transactions FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admins can update transactions (approve)
CREATE POLICY "Admins can update transactions"
ON public.payment_transactions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add expires_at to user_credits
ALTER TABLE public.user_credits ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
