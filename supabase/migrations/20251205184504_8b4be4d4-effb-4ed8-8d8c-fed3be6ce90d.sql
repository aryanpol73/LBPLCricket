-- Drop existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view match predictions" ON public.match_predictions;

-- Create a more restrictive policy - users can only see aggregate counts via view
-- No direct SELECT on individual records
CREATE POLICY "Users can view their own predictions"
ON public.match_predictions
FOR SELECT
USING (false);

-- Create a view for aggregated prediction statistics (safe to expose)
CREATE OR REPLACE VIEW public.match_prediction_stats AS
SELECT 
  match_id,
  team_id,
  COUNT(*) as prediction_count
FROM public.match_predictions
GROUP BY match_id, team_id;

-- Grant access to the view
GRANT SELECT ON public.match_prediction_stats TO anon, authenticated;

-- Apply same fix to potm_votes table
DROP POLICY IF EXISTS "Anyone can view POTM votes" ON public.potm_votes;

-- Restrict direct SELECT access
CREATE POLICY "Users can view their own POTM votes"
ON public.potm_votes
FOR SELECT
USING (false);

-- Create aggregated view for POTM votes
CREATE OR REPLACE VIEW public.potm_vote_stats AS
SELECT 
  match_id,
  player_id,
  COUNT(*) as vote_count
FROM public.potm_votes
GROUP BY match_id, player_id;

-- Grant access to the view
GRANT SELECT ON public.potm_vote_stats TO anon, authenticated;