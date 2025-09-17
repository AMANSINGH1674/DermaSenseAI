-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS skin_type text,
ADD COLUMN IF NOT EXISTS dermatologist text,
ADD COLUMN IF NOT EXISTS email text;