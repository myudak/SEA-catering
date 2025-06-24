import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// PUT /api/meal-plans/[id] - Admin only endpoint for updating meal plans
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      is_active,
      sort_order,
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

    const updateData: {
      name: string;
      price: number;
      description: string;
      image_url: string | null;
      features: string[];
      is_active?: boolean;
      sort_order?: number;
      badge_text?: string;
      color_scheme?: string;
      icon_emoji?: string;
      specs?: { freshness: string; serving: string };
    } = {
      name,
      price: parseInt(price),
      description,
      image_url: image_url || null,
      features: features || [],
    };

    // Only update is_active if provided
    if (typeof is_active === "boolean") {
      updateData.is_active = is_active;
    }

    // Only update sort_order if provided
    if (typeof sort_order === "number") {
      updateData.sort_order = sort_order;
    }

    // Only update display fields if provided
    if (badge_text) {
      updateData.badge_text = badge_text;
    }

    if (color_scheme) {
      updateData.color_scheme = color_scheme;
    }

    if (icon_emoji) {
      updateData.icon_emoji = icon_emoji;
    }

    if (specs) {
      updateData.specs = specs;
    }

    const { data: updatedMealPlan, error } = await supabase
      .from("meal_plans")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating meal plan:", error);
      return NextResponse.json(
        { error: "Failed to update meal plan" },
        { status: 500 }
      );
    }

    if (!updatedMealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Revalidate the menu page to update ISR
    revalidatePath("/menu");

    return NextResponse.json(updatedMealPlan);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/meal-plans/[id] - Admin only endpoint for deleting meal plans
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from("meal_plans")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting meal plan:", error);
      return NextResponse.json(
        { error: "Failed to delete meal plan" },
        { status: 500 }
      );
    }

    // Revalidate the menu page to update ISR
    revalidatePath("/menu");

    return NextResponse.json({ message: "Meal plan deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/meal-plans/[id] - Public endpoint for fetching single meal plan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerComponentClient();

    const { data: mealPlan, error } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("id", params.id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching meal plan:", error);
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(mealPlan, {
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
