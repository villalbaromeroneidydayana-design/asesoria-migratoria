import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if env vars are missing so the app doesn't crash during build/dev
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
