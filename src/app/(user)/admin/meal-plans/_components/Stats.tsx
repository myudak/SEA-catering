"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlan } from "@/types/meal-plan";

interface StatsProps {
  mealPlans: MealPlan[] | null;
  formatPrice: (price: number) => string;
}

export default function Stats({ mealPlans, formatPrice }: StatsProps) {
  const activePlans = mealPlans?.filter((plan) => plan.is_active).length || 0;
  const totalPlans = mealPlans?.length || 0;
  const averagePrice =
    totalPlans > 0
      ? mealPlans!.reduce((sum, plan) => sum + plan.price, 0) / totalPlans
      : 0;
  const priceRange =
    totalPlans > 0
      ? `${formatPrice(
          Math.min(...mealPlans!.map((p) => p.price))
        )} - ${formatPrice(Math.max(...mealPlans!.map((p) => p.price)))}`
      : "No plans";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 card-gradient-admin">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPlans}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activePlans}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(averagePrice)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">{priceRange}</div>
        </CardContent>
      </Card>
    </div>
  );
}
