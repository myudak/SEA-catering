import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server client for server-side operations (server components)
export async function createServerComponentClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

// Server client for middleware (with request/response handling)
export function createMiddlewareClient(request: Request) {
  let response = new Response();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookiesFromRequest(request);
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookie = serializeCookie(name, value, options || {});
          response = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: new Headers(response.headers),
          });
          response.headers.append("Set-Cookie", cookie);
        });
      },
    },
  });

  return { supabase, response };
}

// Helper function to parse cookies from request
function parseCookiesFromRequest(request: Request) {
  const cookieString = request.headers.get("cookie") || "";
  const cookies: Array<{ name: string; value: string }> = [];

  if (cookieString) {
    cookieString.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies.push({ name, value });
      }
    });
  }

  return cookies;
}

// Helper function to serialize cookies
function serializeCookie(
  name: string,
  value: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any = {}
): string {
  const opts = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...options,
  };

  let cookie = `${name}=${value}`;

  if (opts.maxAge) cookie += `; Max-Age=${opts.maxAge}`;
  if (opts.path) cookie += `; Path=${opts.path}`;
  if (opts.httpOnly) cookie += "; HttpOnly";
  if (opts.secure) cookie += "; Secure";
  if (opts.sameSite && typeof opts.sameSite === "string") {
    cookie += `; SameSite=${opts.sameSite}`;
  }
  if (opts.expires) cookie += `; Expires=${opts.expires.toUTCString()}`;

  return cookie;
}
