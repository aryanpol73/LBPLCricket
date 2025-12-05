-- Drop and recreate views with proper security settings
DROP VIEW IF EXISTS public.match_prediction_stats;
DROP VIEW IF EXISTS public.potm_vote_stats;

-- Recreate match prediction stats view with security invoker
CREATE VIEW public.match_prediction_stats 
WITH (security_invoker = true)
AS
SELECT 
  match_id,
  team_id,
  COUNT(*) as prediction_count
FROM public.match_predictions
GROUP BY match_id, team_id;

-- Recreate POTM vote stats view with security invoker
CREATE VIEW public.potm_vote_stats 
WITH (security_invoker = true)
AS
SELECT 
  match_id,
  player_id,
  COUNT(*) as vote_count
FROM public.potm_votes
GROUP BY match_id, player_id;

-- Grant access to views
GRANT SELECT ON public.match_prediction_stats TO anon, authenticated;
GRANT SELECT ON public.potm_vote_stats TO anon, authenticated;