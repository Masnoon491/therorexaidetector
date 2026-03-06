
-- Add IP columns to profiles and scan_history
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_ip text;
ALTER TABLE public.scan_history ADD COLUMN IF NOT EXISTS ip_address text;

-- Create trigger to deduct from api_inventory when a scan is logged
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_scan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.api_inventory
  SET remaining_credits = remaining_credits - NEW.credits_used,
      updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_deduct_inventory_on_scan
  AFTER INSERT ON public.scan_history
  FOR EACH ROW
  EXECUTE FUNCTION public.deduct_inventory_on_scan();
