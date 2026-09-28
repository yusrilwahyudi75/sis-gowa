import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_SUPABASE_URL.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        lock: false // Disable Navigator Lock API to prevent "Lock was released because another request stole it" in multi-tab usage
    }
})
