import { createMiddlewareClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { supabase, response } = createMiddlewareClient(req);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isGuestRoute =
    pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup");

  // 🚫 Guest pages: redirect to dashboard if user is already logged in

  // console.log("Session:", session);
  if (isGuestRoute && session) {
    const redirectUrl = new URL("/dashboard", req.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    copySetCookies(response, redirectResponse);
    return redirectResponse;
  }

  // 🔐 Protected pages: redirect to signin if user not logged in
  if (isAuthRoute && !session) {
    const redirectUrl = new URL("/auth/signin", req.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    copySetCookies(response, redirectResponse);
    return redirectResponse;
  }

  // 🔐 Admin-only access
  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", session?.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const redirectUrl = new URL("/", req.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      copySetCookies(response, redirectResponse);
      return redirectResponse;
    }
  }

  // ✅ Pass through
  const finalResponse = NextResponse.next();
  copySetCookies(response, finalResponse);
  return finalResponse;
}

// 🔄 Helper to copy set-cookie headers
function copySetCookies(from: Response, to: NextResponse) {
  from.headers.forEach((value, key) => {
    if (key === "set-cookie") {
      to.headers.set(key, value);
    }
  });
}

// ✅ Only run on (auth) + (guest) routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
};
