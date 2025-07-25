import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { CreateSubscriptionRequest } from "@/types/subscription";

// GET - Fetch user's subscriptions
export async function GET() {
  try {
    const supabase = await createServerComponentClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's subscriptions with meal plan details
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        meal_plan:meal_plans(*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new subscription
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateSubscriptionRequest = await request.json();

    // Validate required fields
    if (
      !body.meal_plan_id ||
      !body.customer_name ||
      !body.phone_number ||
      !body.meal_types ||
      !body.delivery_days
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate arrays are not empty
    if (body.meal_types.length === 0 || body.delivery_days.length === 0) {
      return NextResponse.json(
        { error: "Meal types and delivery days cannot be empty" },
        { status: 400 }
      );
    }

    // Validate phone number format (Indonesian)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(body.phone_number)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Verify meal plan exists and is active
    const { data: mealPlan, error: mealPlanError } = await supabase
      .from("meal_plans")
      .select("id, name, price, is_active")
      .eq("id", body.meal_plan_id)
      .eq("is_active", true)
      .single();

    if (mealPlanError || !mealPlan) {
      return NextResponse.json(
        { error: "Invalid meal plan selected" },
        { status: 400 }
      );
    }

    // Server-side price calculation
    const mealTypesCount = body.meal_types.length;
    const deliveryDaysCount = body.delivery_days.length;
    const weeksInMonth = 4.3; // Approximation
    let totalPrice =
      mealPlan.price * mealTypesCount * deliveryDaysCount * weeksInMonth;
    let promoCodeId: string | null = null;

    // Validate and apply promo code
    if (body.promo_code) {
      const { data: promoCode, error: promoCodeError } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", body.promo_code)
        .single();

      if (promoCodeError || !promoCode) {
        return NextResponse.json(
          { error: "Invalid promo code" },
          { status: 400 }
        );
      }
      if (promoCode.usage_count >= promoCode.usage_limit) {
        return NextResponse.json(
          { error: "Promo code usage limit reached" },
          { status: 400 }
        );
      }
      if (
        !promoCode.is_active ||
        (promoCode.valid_to && new Date(promoCode.valid_to) < new Date())
      ) {
        return NextResponse.json(
          { error: "Promo code is not active or has expired" },
          { status: 400 }
        );
      }

      if (promoCode.discount_type === "percentage") {
        totalPrice *= 1 - promoCode.value / 100;
      } else if (promoCode.discount_type === "fixed_amount") {
        totalPrice -= promoCode.value;
      }
      promoCodeId = promoCode.id;

      // +1 usage count for the promo code
      if (promoCodeId) {
        await supabase
          .from("promo_codes")
          .update({
            usage_count: promoCode.usage_count + 1,
          })
          .eq("id", promoCodeId);
      }
    }

    // Calculate next billing date (30 days from now)
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + 30);

    // Create subscription
    const { data: subscription, error: createError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        meal_plan_id: body.meal_plan_id,
        customer_name: body.customer_name.trim(),
        phone_number: body.phone_number.trim(),
        meal_types: body.meal_types,
        delivery_days: body.delivery_days,
        allergies: body.allergies?.trim() || null,
        total_price: totalPrice,
        promo_code_id: promoCodeId,
        status: "active",
        next_billing_date: nextBillingDate.toISOString().split("T")[0],
      })
      .select(
        `
        *,
        meal_plan:meal_plans(*)
      `
      )
      .single();

    if (createError) {
      console.error("Error creating subscription:", createError);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Subscription created successfully",
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
