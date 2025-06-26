import { getMealPlans } from "@/lib/mealPlans";
import MealPlanClient from "./_components/MealPlanClient";

export default async function MealPlansAdminPage() {
  const mealPlans = await getMealPlans();

  return <MealPlanClient mealPlans={mealPlans} />;
}
