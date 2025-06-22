// Main Supabase client export - client-side only
// For server-side operations, import from supabase-server.ts instead

export { createClient, supabase } from "./supabase-client";

// Re-export server functions with clear naming
export type {
  createServerComponentClient,
  createMiddlewareClient,
} from "./supabase-server";

// Note: Do not import server functions here as it will cause client-side errors
// Instead, import directly from supabase-server.ts in server components and middleware
