import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

// GET - Fetch specific subscription
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const supabase = await createServerComponentClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch subscription with meal plan details
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        meal_plan:meal_plans(*)
      `
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update subscription (for status changes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const supabase = await createServerComponentClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, pause_start_date, pause_end_date } = body;

    // Validate status
    if (status && !["active", "paused", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (status === "paused") {
      if (!pause_start_date || !pause_end_date) {
        return NextResponse.json(
          { error: "Pause dates are required when pausing subscription" },
          { status: 400 }
        );
      }
      updateData.pause_start_date = pause_start_date;
      updateData.pause_end_date = pause_end_date;
    } else if (status === "active") {
      // Clear pause dates when resuming
      updateData.pause_start_date = null;
      updateData.pause_end_date = null;
    }

    // Update subscription
    const { data: subscription, error: updateError } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(
        `
        *,
        meal_plan:meal_plans(*)
      `
      )
      .single();

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
