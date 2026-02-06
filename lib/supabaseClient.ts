import { createClient } from '@supabase/supabase-js'

const projectId = process.env.SUPABASE_PROJECT_ID!
const anonKey = process.env.SUPABASE_ANON_KEY!

const supabaseUrl = `https://${projectId}.supabase.co`

export const supabase = createClient(supabaseUrl, anonKey)
