-- Create storage bucket for community images
INSERT INTO storage.buckets (id, name, public) VALUES ('community-images', 'community-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload community images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'community-images' AND auth.uid() IS NOT NULL);

-- Allow anyone to view community images
CREATE POLICY "Anyone can view community images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own community images"
ON storage.objects FOR DELETE
USING (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to delete any community image
CREATE POLICY "Admins can delete any community image"
ON storage.objects FOR DELETE
USING (bucket_id = 'community-images' AND public.has_role(auth.uid(), 'admin'));