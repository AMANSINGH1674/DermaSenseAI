# DermaSenseAI Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. MedGemma Not Responding / API Errors

**Symptoms:**
- Chat responses show "Demo Mode Active" messages
- API errors in browser console
- Image analysis provides generic guidance instead of actual analysis

**Possible Causes & Solutions:**

#### A. Hugging Face API Key Issues
```bash
# Check your .env.local file
cat .env.local
```

**✅ Solution:**
1. Verify your `VITE_HUGGINGFACE_API_KEY` is correctly set in `.env.local`
2. Your API key should start with `hf_` 
3. Get a new key from https://huggingface.co/settings/tokens if needed

#### B. Model Access Permissions
**✅ Solution:**
1. Go to https://huggingface.co/google/medgemma-2b
2. Click "Request access to this model"
3. Accept the terms of use
4. Wait for approval (usually immediate)

#### C. Model Temporarily Unavailable
**✅ Solution:**
- Wait 5-10 minutes and try again
- Models sometimes need to "warm up" after being idle
- Check https://status.huggingface.co for service status

### 2. Authentication Issues

**Symptoms:**
- Cannot login/signup
- Redirected to login page constantly
- "Supabase not configured" errors

**✅ Solutions:**

#### Check Supabase Configuration
```bash
# Verify your Supabase credentials in .env.local
grep VITE_SUPABASE .env.local
```

1. **Get Supabase Credentials:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API
   - Copy URL and anon key to `.env.local`

2. **Database Setup:**
   ```sql
   -- Run this in Supabase SQL Editor
   -- Create profiles table
   CREATE TABLE IF NOT EXISTS public.profiles (
     id uuid REFERENCES auth.users ON DELETE CASCADE,
     email text,
     full_name text,
     avatar_url text,
     created_at timestamp with time zone DEFAULT now(),
     PRIMARY KEY (id)
   );

   -- Enable RLS
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
     FOR SELECT TO public USING (true);

   CREATE POLICY "Users can insert own profile" ON public.profiles
     FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);

   CREATE POLICY "Users can update own profile" ON public.profiles
     FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id);
   ```

3. **Chat Tables Setup:**
   ```sql
   -- Run the SQL from create-chat-tables.sql
   \i create-chat-tables.sql
   ```

### 3. Chat History Not Saving

**Symptoms:**
- Messages disappear on refresh
- Error messages about database access

**✅ Solutions:**

1. **Check RLS Policies:**
   ```sql
   -- In Supabase SQL Editor, verify policies exist
   SELECT * FROM pg_policies WHERE tablename = 'chat_messages';
   ```

2. **Verify User Authentication:**
   - Make sure user is properly logged in
   - Check browser console for auth errors

3. **Test Database Connection:**
   ```javascript
   // In browser console
   console.log('User:', window.location.search);
   ```

### 4. File Upload Issues

**Symptoms:**
- Images/PDFs don't upload
- Storage bucket errors
- File analysis fails

**✅ Solutions:**

1. **Create Storage Bucket:**
   - Go to Supabase → Storage
   - Create bucket named `medical-files`
   - Make it public if needed for demos

2. **Set Storage Policies:**
   ```sql
   -- Allow authenticated uploads
   CREATE POLICY "Users can upload files" ON storage.objects
     FOR INSERT TO authenticated
     WITH CHECK (bucket_id = 'medical-files');

   -- Allow public access for demo
   CREATE POLICY "Public file access" ON storage.objects
     FOR SELECT TO public
     USING (bucket_id = 'medical-files');
   ```

### 5. Development Server Issues

**Symptoms:**
- App won't start
- Build errors
- Module not found errors

**✅ Solutions:**

1. **Clear Cache & Reinstall:**
   ```bash
   # Clear npm cache and reinstall
   rm -rf node_modules package-lock.json
   npm install

   # Clear Vite cache
   rm -rf .vite
   ```

2. **Check Node Version:**
   ```bash
   node --version  # Should be 18+ 
   npm --version   # Should be 9+
   ```

3. **Restart Dev Server:**
   ```bash
   npm run dev
   ```

## 🔧 Testing Tools

### Test MedGemma API Connection
```bash
node test-medgemma.js
```

This will test:
- API key validity
- Model access permissions  
- Endpoint availability
- Response format

### Test Supabase Connection
```javascript
// In browser console on your app
import { supabase } from './src/lib/supabase.ts';
const { data, error } = await supabase.auth.getUser();
console.log('User:', data, 'Error:', error);
```

## 🏥 Demo Mode

If MedGemma is unavailable, the app automatically falls back to **Demo Mode**:

- ✅ Shows realistic dermatological responses
- ✅ Demonstrates UI functionality  
- ✅ Educational content about skin conditions
- ⚠️ Not actual AI analysis

**Demo Mode Indicators:**
- Responses include "Demo Mode Active" 
- Consistent 2-3 second response times
- Generic but informative medical content

## 🆘 Still Need Help?

### Debug Information to Collect:

1. **Browser Console Logs:**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Look for red error messages

2. **Network Tab:**
   - Check failed API requests
   - Look for 401, 403, 404, or 500 status codes

3. **Environment Check:**
   ```bash
   # In terminal
   echo "Node: $(node --version)"
   echo "NPM: $(npm --version)" 
   cat .env.local
   ```

4. **API Test Results:**
   ```bash
   node test-medgemma.js > debug.log 2>&1
   cat debug.log
   ```

### Getting Support:

1. **Check existing GitHub issues**
2. **Create new issue with:**
   - Error messages from console
   - Steps to reproduce
   - Debug information above
   - Your OS and browser version

## 📚 Additional Resources

- [MedGemma Model Documentation](https://huggingface.co/google/medgemma-2b)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)