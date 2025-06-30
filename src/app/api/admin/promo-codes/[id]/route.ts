import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { checkIsAdmin } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerComponentClient();
  const check = await checkIsAdmin(supabase);
  if (check instanceof NextResponse) return check;

  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("promo_codes")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ promo_code: data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerComponentClient();
  const check = await checkIsAdmin(supabase);
  if (check instanceof NextResponse) return check;

  const { id } = await params;

  const { error } = await supabase.from("promo_codes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Promo code deleted successfully" });
}
