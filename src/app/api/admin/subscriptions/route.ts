import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { checkIsAdmin } from "@/lib/utils";

// GET - Fetch all subscriptions (admin)
export async function GET() {
  const supabase = await createServerComponentClient();

  // CHECK IF USER ADMIN
  const check = await checkIsAdmin(supabase);
  // checkIsAdmin returns a NextResponse when unauthorized/forbidden
  if (check instanceof NextResponse) {
    return check;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      meal_plan:meal_plans(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscriptions: data });
}
