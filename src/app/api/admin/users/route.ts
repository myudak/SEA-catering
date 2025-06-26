import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { checkIsAdmin } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  const supabase = await createServerComponentClient();

  // CHECK IF USER ADMIN
  const check = await checkIsAdmin(supabase);
  if (check instanceof Response) return check;

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, role, created_at, profile_picture_url")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}
