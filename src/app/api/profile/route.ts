import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { full_name, profile_picture_url } = body;

    // Validate required fields
    if (!full_name || full_name.trim().length === 0) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    // Validate full name length
    if (full_name.trim().length < 2 || full_name.trim().length > 50) {
      return NextResponse.json(
        { error: "Full name must be between 2 and 50 characters" },
        { status: 400 }
      );
    }

    // Basic URL validation for profile picture (if provided)
    if (profile_picture_url && profile_picture_url.trim() !== "") {
      try {
        new URL(profile_picture_url);

        // Check if URL looks like an image (basic check)
        // const imageExtensions = [
        //   ".jpg",
        //   ".jpeg",
        //   ".png",
        //   ".gif",
        //   ".webp",
        //   ".svg",
        // ];
        // const hasImageExtension = imageExtensions.some((ext) =>
        //   profile_picture_url.toLowerCase().includes(ext)
        // );

        // Allow common image hosting domains or image extensions
        // const isImageHost =
        //   profile_picture_url.includes("imgur.com") ||
        //   profile_picture_url.includes("cloudinary.com") ||
        //   profile_picture_url.includes("gravatar.com") ||
        //   profile_picture_url.includes("googleusercontent.com") ||
        //   profile_picture_url.includes("githubusercontent.com") ||
        //   hasImageExtension;

        // if (!isImageHost) {
        //   return NextResponse.json(
        //     {
        //       error:
        //         "Please provide a valid image URL. Supported: direct image links or common image hosting services (imgur, cloudinary, gravatar, etc.)",
        //     },
        //     { status: 400 }
        //   );
        // }
      } catch {
        return NextResponse.json(
          { error: "Please provide a valid URL for the profile picture" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      full_name: string;
      profile_picture_url?: string;
    } = {
      full_name: full_name.trim(),
    };

    // Only update profile_picture_url if it's provided
    if (profile_picture_url !== undefined) {
      updateData.profile_picture_url = profile_picture_url?.trim() || null;
    }

    // Update profile in database
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Fetch current profile
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

    // Fetch profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
