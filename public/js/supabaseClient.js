import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const SUPABASE_URL = 'https://iexiqtweyghgmnpxtdzc.supabase.co';
export const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...'; // tu anon key real

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);