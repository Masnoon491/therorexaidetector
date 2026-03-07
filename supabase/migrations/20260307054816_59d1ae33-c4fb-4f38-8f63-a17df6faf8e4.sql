
ALTER TABLE public.scan_history ADD COLUMN IF NOT EXISTS content_snippet TEXT DEFAULT '';
ALTER TABLE public.scan_history ADD COLUMN IF NOT EXISTS risk_assessment TEXT DEFAULT 'Low Risk';
