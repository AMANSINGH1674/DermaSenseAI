import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key present:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check profiles table access
    console.log('\n1. Testing profiles table read access...');
    const { data: profiles, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.error('Read error:', readError);
    } else {
      console.log('✅ Can read from profiles table');
      console.log('Sample data:', profiles);
    }

    // Test 2: Check if we can get current user
    console.log('\n2. Testing auth user access...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('User error:', userError);
    } else {
      console.log('✅ Auth working, user:', user ? user.id : 'No user logged in');
    }

    // Test 3: If user exists, try to update profile
    if (user) {
      console.log('\n3. Testing profile update...');
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select();

      if (updateError) {
        console.error('❌ Update error:', updateError);
        console.error('Error details:', updateError.details);
        console.error('Error hint:', updateError.hint);
        console.error('Error message:', updateError.message);
      } else {
        console.log('✅ Can update profile');
        console.log('Updated data:', updateData);
      }
    }

  } catch (error) {
    console.error('General error:', error);
  }
}

testConnection();