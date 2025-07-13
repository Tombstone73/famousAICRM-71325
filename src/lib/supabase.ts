import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://zeawvnnkvyicyokpuvkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplYXd2bm5rdnlpY3lva3B1dmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjc1NTQsImV4cCI6MjA2NjYwMzU1NH0.iWVxUlauH8-y4RruXqU6ZG_6NASsoDU1zjB1zi9P56M';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase };