// Simple Node.js script to check what columns exist in the profiles table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('Checking profiles table schema...');
    
    // Try to select with all possible columns
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, created_at, updated_at')
      .limit(1);
    
    if (error) {
      console.error('Error accessing basic columns:', error.message);
      
      // Try with just essential columns
      const { data: basicData, error: basicError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (basicError) {
        console.error('Error accessing any columns:', basicError.message);
      } else {
        console.log('Available data structure:', basicData);
      }
    } else {
      console.log('✅ Basic profile columns exist');
      console.log('Sample data:', data);
    }
    
    // Check if table exists at all by trying to read metadata
    console.log('\nTrying to understand the actual table structure...');
    
  } catch (err) {
    console.error('General error:', err);
  }
}

checkSchema();