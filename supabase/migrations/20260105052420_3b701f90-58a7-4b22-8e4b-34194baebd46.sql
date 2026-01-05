-- Drop the existing check constraint on match_phase
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS matches_match_phase_check;

-- Add new check constraint with all valid phases
ALTER TABLE public.matches ADD CONSTRAINT matches_match_phase_check 
  CHECK (match_phase IN ('league1', 'league2', 'semifinal', 'final'));