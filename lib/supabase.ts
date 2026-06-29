import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
// Fallback to placeholder values so the app can be built before env vars are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-anon-key'

// True when real Supabase credentials are provided; otherwise the app uses localStorage.
export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)