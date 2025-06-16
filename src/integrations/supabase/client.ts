
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tdgulehinkdtppxhxfat.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZ3VsZWhpbmtkdHBweGh4ZmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTAwOTMsImV4cCI6MjA2NTU4NjA5M30.cQiijn1c7rblRB4CQ7CeuW07cGnEnLF6MbEh3uWqkwY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
