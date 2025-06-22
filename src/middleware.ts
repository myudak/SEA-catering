import { createMiddlewareClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { supabase, response } = createMiddlewareClient(req);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Middleware - Session found:", !!session, session?.user?.id);

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  // Admin-only routes
  const adminRoutes = ["/admin"];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Check if the current route is admin-only
  const isAdminRoute = adminRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/signin", req.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Copy any set cookies from the supabase response
    response.headers.forEach((value, key) => {
      if (key === "set-cookie") {
        redirectResponse.headers.set(key, value);
      }
    });

    return redirectResponse;
  }

  // For admin routes, check if user has admin role
  if (isAdminRoute) {
    if (!session) {
      const redirectUrl = new URL("/auth/signin", req.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // Copy any set cookies from the supabase response
      response.headers.forEach((value, key) => {
        if (key === "set-cookie") {
          redirectResponse.headers.set(key, value);
        }
      });

      return redirectResponse;
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const redirectUrl = new URL("/", req.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // Copy any set cookies from the supabase response
      response.headers.forEach((value, key) => {
        if (key === "set-cookie") {
          redirectResponse.headers.set(key, value);
        }
      });

      return redirectResponse;
    }
  }

  // Return the response with any cookies that were set
  const finalResponse = NextResponse.next();

  // Copy any set cookies from the supabase response
  response.headers.forEach((value, key) => {
    if (key === "set-cookie") {
      finalResponse.headers.set(key, value);
    }
  });

  return finalResponse;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
