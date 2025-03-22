import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('supabaseUrl is required. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.')
}

if (!supabaseAnonKey) {
  throw new Error('supabaseAnonKey is required. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.')
}

// Client public pour les opérations côté client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client admin pour les opérations privilégiées (à utiliser uniquement côté serveur)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null