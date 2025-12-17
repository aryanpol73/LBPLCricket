-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can view their own rating" ON public.app_ratings;
DROP POLICY IF EXISTS "Users can update their own rating" ON public.app_ratings;

-- Create restrictive SELECT policy (deny all direct reads)
-- App will use localStorage to track if user has rated
CREATE POLICY "Users can view their own rating" 
ON public.app_ratings 
FOR SELECT 
USING (false);

-- Create restrictive UPDATE policy (deny direct updates)
-- Users should submit new ratings or use upsert
CREATE POLICY "Users can update their own rating" 
ON public.app_ratings 
FOR UPDATE 
USING (false);