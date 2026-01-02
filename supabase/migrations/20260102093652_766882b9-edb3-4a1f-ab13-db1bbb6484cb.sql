-- Add failed_attempts column to email_otps table for rate limiting
ALTER TABLE public.email_otps 
ADD COLUMN IF NOT EXISTS failed_attempts integer DEFAULT 0;

-- Add locked_until column to block brute force attempts
ALTER TABLE public.email_otps 
ADD COLUMN IF NOT EXISTS locked_until timestamp with time zone DEFAULT NULL;