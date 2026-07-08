
-- 1. Community-images INSERT policy: enforce folder ownership
DROP POLICY IF EXISTS "Authenticated users can upload community images" ON storage.objects;
CREATE POLICY "Authenticated users can upload community images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'community-images'
  AND auth.uid() IS NOT NULL
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 2. Public bucket listing: remove broad SELECT policies on public buckets.
-- Direct file access via /object/public/... still works because the bucket is public;
-- this only prevents listing bucket contents via storage.objects.
DROP POLICY IF EXISTS "Anyone can view community images" ON storage.objects;
DROP POLICY IF EXISTS "Gallery bucket is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;

-- 3. Restrict EXECUTE on SECURITY DEFINER functions from anon.
-- has_role: only needed by authenticated (used inside RLS policies).
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- Aggregate count RPCs: restrict to authenticated only (revoke from anon).
REVOKE ALL ON FUNCTION public.get_match_prediction_counts(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_match_prediction_counts(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_potm_vote_counts(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_potm_vote_counts(uuid) TO authenticated, service_role;

-- 4. Bind vote/prediction/rating inserts to the authenticated user's ID.
DROP POLICY IF EXISTS "Anyone can create app ratings" ON public.app_ratings;
CREATE POLICY "Authenticated users can create app ratings"
ON public.app_ratings FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_identifier = (auth.uid())::text
);

DROP POLICY IF EXISTS "Anyone can create match predictions" ON public.match_predictions;
CREATE POLICY "Authenticated users can create match predictions"
ON public.match_predictions FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_identifier = (auth.uid())::text
);

DROP POLICY IF EXISTS "Anyone can create POTM votes" ON public.potm_votes;
CREATE POLICY "Authenticated users can create POTM votes"
ON public.potm_votes FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_identifier = (auth.uid())::text
);

-- Ensure anon can no longer INSERT into these tables (roles removed via TO authenticated above,
-- but revoke the table-level grant too for defense in depth).
REVOKE INSERT ON public.app_ratings FROM anon;
REVOKE INSERT ON public.match_predictions FROM anon;
REVOKE INSERT ON public.potm_votes FROM anon;
