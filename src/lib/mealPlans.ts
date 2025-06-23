import { createServerComponentClient } from "@/lib/supabase-server";
import { MealPlan } from "@/types/meal-plan";

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
      // Return null on error to trigger fallback
      return null;
    }

    return mealPlans || [];
  } catch (error) {
    console.error("Unexpected error fetching meal plans:", error);
    return null;
  }
}
