-- Create chat_messages table for storing conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content text NOT NULL,
  image_url text,
  attachment_url text,
  attachment_type text CHECK (attachment_type IN ('image', 'pdf')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own chat messages" ON public.chat_messages
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS chat_messages_user_id_created_at_idx 
ON public.chat_messages(user_id, created_at DESC);

-- Create storage bucket for medical files (images and PDFs)
-- Note: This needs to be run in Supabase dashboard as it requires storage permissions
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('medical-files', 'medical-files', true);

-- Create RLS policies for storage bucket (run these in Supabase dashboard)
-- CREATE POLICY "Users can upload own files" ON storage.objects 
-- FOR INSERT TO authenticated 
-- WITH CHECK (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own files" ON storage.objects 
-- FOR SELECT TO authenticated 
-- USING (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Files are publicly accessible" ON storage.objects 
-- FOR SELECT TO public 
-- USING (bucket_id = 'medical-files');