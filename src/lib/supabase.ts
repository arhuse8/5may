import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase Keys are ALWAYS JWTs starting with eyJ. 
// keys starting with sb_publishable_ are for Clerk and will NOT work here.
const isValidFormat = (url?: string, key?: string) => {
  if (!url || !key) return false;
  if (url.includes('placeholder')) return false;
  
  if (key.startsWith('sb_publishable_')) {
    const msg = "CRITICAL ERROR: You have provided a Clerk Publishable Key (starting with 'sb_publishable_') in the VITE_SUPABASE_ANON_KEY field. Please go to your Supabase Dashboard > Project Settings > API and copy the 'anon public' key instead. It should start with 'eyJ'.";
    console.error(msg);
    if (typeof window !== 'undefined') (window as any)._supabaseError = msg;
    return false;
  }
  
  if (!key.startsWith('eyJ')) {
    const msg = "WARNING: Your VITE_SUPABASE_ANON_KEY does not appear to be a standard Supabase JWT (it should start with 'eyJ'). If you are getting connection errors, please verify your credentials.";
    console.warn(msg);
    if (typeof window !== 'undefined') (window as any)._supabaseError = msg;
  }
  return true;
};

export const isSupabaseConfigured = isValidFormat(supabaseUrl, supabaseAnonKey);

if (!isSupabaseConfigured && supabaseUrl && supabaseAnonKey) {
  console.warn("Supabase credentials were found but they look incorrect. Reverting to Demo Mode.");
} else if (!isSupabaseConfigured) {
  console.warn("Supabase credentials missing. Application running in Demo Mode (LocalStorage).");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);
