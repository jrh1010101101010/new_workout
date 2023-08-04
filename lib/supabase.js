import { createClient } from '@supabase/supabase-js';

export const supabase= createClient(process.env.REACT_NATIVE_SUPABASE_URL, process.env.REACT_NATIVE_SUPABASE_KEY)
