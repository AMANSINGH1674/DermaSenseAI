-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  role text CHECK (role IN ('patient', 'doctor')) DEFAULT 'patient',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies (explicit roles and safe auth.uid() usage)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$;
REVOKE EXECUTE ON FUNCTION public.update_profiles_updated_at() FROM anon, authenticated;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_profiles_updated_at();

-- Function to create profile on user signup (safe against duplicates)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- Create trigger on auth.users to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
