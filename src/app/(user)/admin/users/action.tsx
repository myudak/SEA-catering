"use server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { checkIsAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function updateUserAction(formData: FormData) {
  const user_id = formData.get("user_id")?.toString() || "";
  const role = formData.get("role")?.toString() || "";
  const profile_picture_url =
    formData.get("profile_picture_url")?.toString() || "";

  const supabase = await createServerComponentClient();

  try {
    // 🔒 Check if current user is an admin (throws if not)
    await checkIsAdmin(supabase, "action");

    // ✅ Perform the update
    const { error } = await supabase
      .from("profiles")
      .update({ role, profile_picture_url })
      .eq("user_id", user_id);

    console.log("Update result:", {
      user_id,
      role,
      profile_picture_url,
      error,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/users");

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
