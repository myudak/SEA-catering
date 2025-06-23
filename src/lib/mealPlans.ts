import { createServerComponentClient } from "@/lib/supabase-server";
import { MealPlan } from "@/types/meal-plan";
import { toast } from "sonner";

export async function getMealPlans(): Promise<MealPlan[] | null> {
  try {
    const supabase = await createServerComponentClient();

    const { data: mealPlans, error } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching meal plans:", error);
      toast.error("Failed to load meal plans. using fallback.");
      // Return fallback data on error
      return null;
    }

    return mealPlans || [];
  } catch (error) {
    console.error("Unexpected error fetching meal plans:", error);
    return [];
  }
}
