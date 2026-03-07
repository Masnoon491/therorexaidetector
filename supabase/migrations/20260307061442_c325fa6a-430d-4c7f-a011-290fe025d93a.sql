-- Create scans table for persistent user-level scan recording
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_name TEXT NOT NULL DEFAULT 'Untitled Document',
  ai_score INTEGER NOT NULL DEFAULT 0,
  human_score INTEGER NOT NULL DEFAULT 0,
  risk_assessment TEXT NOT NULL DEFAULT 'Moderate Risk',
  word_count INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure required columns exist even if table pre-exists
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS document_name TEXT NOT NULL DEFAULT 'Untitled Document';
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS credits_used INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS ai_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS human_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS risk_assessment TEXT NOT NULL DEFAULT 'Moderate Risk';
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS word_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Helpful indexes for history loading
CREATE INDEX IF NOT EXISTS idx_scans_user_created_at ON public.scans(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Recreate policies as permissive
DROP POLICY IF EXISTS "Users can insert own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can read own scans" ON public.scans;
DROP POLICY IF EXISTS "Admins can read all scans" ON public.scans;

CREATE POLICY "Users can insert own scans"
ON public.scans
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own scans"
ON public.scans
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all scans"
ON public.scans
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Enable realtime on scans table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'scans'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.scans;
  END IF;
END $$;