-- Fix views to use SECURITY INVOKER instead of SECURITY DEFINER
ALTER VIEW public.match_prediction_stats SET (security_invoker = on);
ALTER VIEW public.potm_vote_stats SET (security_invoker = on);