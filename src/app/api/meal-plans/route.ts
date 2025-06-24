import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// GET /api/meal-plans - Public endpoint for fetching meal plans
export async function GET() {
  try {
    const supabase = await createServerComponentClient();

    const { data: mealPlans, error } = await supabase
      .from("meal_plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching meal plans:", error);
      return NextResponse.json(
        { error: "Failed to fetch meal plans" },
        { status: 500 }
      );
    }

    return NextResponse.json(mealPlans, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/meal-plans - Admin only endpoint for creating meal plans
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    // Check authentication and admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      price,
      description,
      image_url,
      features,
      badge_text,
      color_scheme,
      icon_emoji,
      specs,
    } = body;

    // Validate required fields
    if (!name || !price || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, description" },
        { status: 400 }
      );
    }

    // Get the highest sort_order and increment
    const { data: maxSortOrder } = await supabase
      .from("meal_plans")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const newSortOrder = (maxSortOrder?.sort_order || 0) + 1;

    const { data: newMealPlan, error } = await supabase
      .from("meal_plans")
      .insert({
        name,
        price: parseInt(price),
        description,
        image_url: image_url || null,
        features: features || [],
        badge_text: badge_text || "Available",
        color_scheme: color_scheme || "gray",
        icon_emoji: icon_emoji || "🍽️",
        specs: specs || { freshness: "Fresh Daily", serving: "1 Person" },
        sort_order: newSortOrder,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating meal plan:", error);
      return NextResponse.json(
        { error: "Failed to create meal plan" },
        { status: 500 }
      );
    }

    // Revalidate the menu page to update ISR
    revalidatePath("/menu");

    return NextResponse.json(newMealPlan, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
