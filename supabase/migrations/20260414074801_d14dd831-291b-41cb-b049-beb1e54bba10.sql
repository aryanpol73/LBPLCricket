-- Add UPDATE policy for community-images storage bucket to prevent unauthorized overwrites
CREATE POLICY "Users can update their own community images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);