-- Add RLS policy to block all client access to email_otps table
-- Edge functions use service role key which bypasses RLS, so they will continue to work
CREATE POLICY "Deny all client access to OTPs"
  ON public.email_otps
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);