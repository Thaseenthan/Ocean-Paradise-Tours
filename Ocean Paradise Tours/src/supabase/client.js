import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Supabase initialization failed:', error.message)
  }
} else {
  // eslint-disable-next-line no-console
  console.warn('Supabase credentials not configured. Running in demo mode. Update .env to connect real database.')
}

export { supabase }
