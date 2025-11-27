/*
  # Add missing profile details columns

  1. Changes
    - Add `age` column (integer) to profiles table
    - Add `skin_type` column (text) to profiles table  
    - Add `dermatologist` column (text) to profiles table

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add missing columns to profiles table
DO $$
BEGIN
  -- Add age column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age integer;
  END IF;

  -- Add skin_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'skin_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN skin_type text;
  END IF;

  -- Add dermatologist column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'dermatologist'
  ) THEN
    ALTER TABLE profiles ADD COLUMN dermatologist text;
  END IF;
END $$;