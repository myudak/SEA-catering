import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// POST /api/meal-plans/reorder - Admin only endpoint for reordering meal plans
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
    const { reorderData } = body;

    // Validate that reorderData is an array of {id, sort_order}
    if (!Array.isArray(reorderData)) {
      return NextResponse.json(
        { error: "reorderData must be an array" },
        { status: 400 }
      );
    }

    // Update all sort orders in a transaction-like manner
    const updatePromises = reorderData.map(({ id, sort_order }) =>
      supabase.from("meal_plans").update({ sort_order }).eq("id", id)
    );

    const results = await Promise.all(updatePromises);

    // Check if any updates failed
    const hasErrors = results.some((result) => result.error);
    if (hasErrors) {
      console.error("Error updating sort orders:", results);
      return NextResponse.json(
        { error: "Failed to update sort orders" },
        { status: 500 }
      );
    }

    // Revalidate the menu page to update ISR
    revalidatePath("/menu");

    return NextResponse.json({
      message: "Sort orders updated successfully",
      updated: reorderData.length,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
