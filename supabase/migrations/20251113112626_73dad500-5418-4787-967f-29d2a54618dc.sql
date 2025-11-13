-- Add round_no and match_no columns to matches table
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS round_no integer,
ADD COLUMN IF NOT EXISTS match_no integer;