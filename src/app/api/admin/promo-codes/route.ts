import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { checkIsAdmin } from "@/lib/utils";

export async function GET() {
  const supabase = await createServerComponentClient();
  const check = await checkIsAdmin(supabase);
  if (check instanceof NextResponse) return check;

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ promo_codes: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const check = await checkIsAdmin(supabase);
  if (check instanceof NextResponse) return check;

  const body = await request.json();

  const { data, error } = await supabase
    .from("promo_codes")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ promo_code: data }, { status: 201 });
}
