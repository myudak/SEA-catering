import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client-side operations only
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Default export for backward compatibility
export const supabase = createClient();
