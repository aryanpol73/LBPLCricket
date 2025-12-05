-- Drop the views - they won't work with the current RLS setup
DROP VIEW IF EXISTS public.match_prediction_stats;
DROP VIEW IF EXISTS public.potm_vote_stats;

-- Create SECURITY DEFINER functions that return only aggregated data (safe)
-- This bypasses RLS but only returns counts, not individual user data

CREATE OR REPLACE FUNCTION public.get_match_prediction_counts(p_match_id uuid)
RETURNS TABLE (
  team_id uuid,
  prediction_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id, COUNT(*) as prediction_count
  FROM match_predictions
  WHERE match_id = p_match_id
  GROUP BY team_id;
$$;

CREATE OR REPLACE FUNCTION public.get_potm_vote_counts(p_match_id uuid)
RETURNS TABLE (
  player_id uuid,
  vote_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT player_id, COUNT(*) as vote_count
  FROM potm_votes
  WHERE match_id = p_match_id
  GROUP BY player_id;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_match_prediction_counts(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_potm_vote_counts(uuid) TO anon, authenticated;