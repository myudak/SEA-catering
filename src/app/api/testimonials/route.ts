/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { CreateTestimonialRequest } from "@/types/testimonial";

// GET - Fetch approved testimonials for public display
export async function GET() {
  try {
    const supabase = await createServerComponentClient();

    console.log("Fetching approved testimonials...");

    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.log("Error fetching testimonials:", error);
      return NextResponse.json(
        { error: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.log("Error fetching testimonials:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// POST - Submit a new testimonial (public or authenticated)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();

    // AUTH USER
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !request.headers.get("x-forwarded-for")) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to submit a testimonial" },
        { status: 401 }
      );
    }

    const body: CreateTestimonialRequest = await request.json();

    // Validate required fields
    if (
      !body.customer_name ||
      !body.customer_name.trim() ||
      !body.message ||
      !body.message.trim() ||
      !body.rating
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      body.customer_name.trim().length < 2 ||
      body.customer_name.trim().length > 50
    ) {
      return NextResponse.json(
        { error: "Name must be between 2 and 50 characters" },
        { status: 400 }
      );
    }

    if (body.message.trim().length < 10) {
      return NextResponse.json(
        {
          error:
            "Please provide a more detailed review (at least 10 characters)",
        },
        { status: 400 }
      );
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // If public, validate email if provided
    if (!user && body.email && body.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email.trim())) {
        return NextResponse.json(
          { error: "Please provide a valid email address" },
          { status: 400 }
        );
      }
    }

    // Prepare insert data
    const insertData: any = {
      ...(user ? { user_id: user.id } : {}),
      customer_name: body.customer_name.trim(),
      email: user ? null : body.email?.trim() || null,
      message: body.message.trim(),
      rating: body.rating,
      status: "approved",
      profile_picture_url: body.profile_picture_url || null,
      is_authenticated: !!user,
    };

    // Insert testimonial
    // 1. Insert WITHOUT selecting
    const { data: insertResult, error: insertError } = await supabase
      .from("testimonials")
      .insert(insertData);

    if (insertError) {
      console.log("Insert Error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Thank you for your testimonial! It will be reviewed and published soon.",
        insertResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
