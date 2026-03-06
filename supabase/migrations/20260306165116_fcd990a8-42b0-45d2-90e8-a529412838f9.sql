
ALTER TABLE public.scan_history ADD COLUMN IF NOT EXISTS document_name TEXT NOT NULL DEFAULT 'Untitled Document';
