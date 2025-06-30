import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const supabase = await createServerComponentClient();
  const { code } = params;

  if (!code) {
    return NextResponse.json(
      { error: "Promo code is required" },
      { status: 400 }
    );
  }

  const { data: promoCode, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !promoCode) {
    return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
  }

  if (!promoCode.is_active) {
    return NextResponse.json(
      { error: "This promo code is not active" },
      { status: 400 }
    );
  }

  if (promoCode.valid_from && new Date(promoCode.valid_from) > new Date()) {
    return NextResponse.json(
      { error: "This promo code is not yet valid" },
      { status: 400 }
    );
  }

  if (promoCode.valid_to && new Date(promoCode.valid_to) < new Date()) {
    return NextResponse.json(
      { error: "This promo code has expired" },
      { status: 400 }
    );
  }

  if (promoCode.usage_limit && promoCode.usage_count >= promoCode.usage_limit) {
    return NextResponse.json(
      { error: "This promo code has reached its usage limit" },
      { status: 400 }
    );
  }

  return NextResponse.json({ promoCode });
}
