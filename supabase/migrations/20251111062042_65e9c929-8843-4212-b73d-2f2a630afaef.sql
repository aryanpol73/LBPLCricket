-- Drop existing storage policy and create admin policy
DROP POLICY IF EXISTS "Gallery bucket is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Public read access
CREATE POLICY "Gallery bucket is publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery');

-- Admin management
CREATE POLICY "Admins can manage gallery storage"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);