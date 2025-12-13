-- Enable Row Level Security on email_otps table
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- No SELECT, INSERT, UPDATE, or DELETE policies are created
-- This means only service role (used by edge functions) can access this table
-- Regular users and anon users cannot read or write to this table

-- Add a comment explaining the security model
COMMENT ON TABLE public.email_otps IS 'OTP codes for email verification. Only accessible via edge functions using service role key. No public access allowed.';