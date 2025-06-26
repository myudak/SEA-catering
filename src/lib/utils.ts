import { SupabaseClient } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string, lowercase = true): string {
  if (!name) return "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return lowercase ? initials.toLowerCase() : initials.toUpperCase();
}

type Mode = "api" | "action";

export async function checkIsAdmin(
  supabase: SupabaseClient,
  mode: Mode = "api"
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    if (mode === "api") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      throw new Error("Unauthorized");
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    if (mode === "api") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } else {
      throw new Error("Forbidden");
    }
  }

  return { user, profile };
}
