import { createClient } from '@supabase/supabase-js';
// Server only. The service role key bypasses row level security, so never expose it to the browser.
export const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
