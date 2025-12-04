-- Add scorer_link column to matches table
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS scorer_link text;