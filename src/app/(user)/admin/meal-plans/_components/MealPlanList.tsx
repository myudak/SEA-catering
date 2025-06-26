"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MealPlan } from "@/types/meal-plan";
import { ArrowDown, ArrowUp, Edit, Eye, EyeOff, Trash2 } from "lucide-react";

interface MealPlanListProps {
  mealPlans: MealPlan[] | null;
  formatPrice: (price: number) => string;
  movePlan: (planId: string, direction: "up" | "down") => void;
  toggleActive: (plan: MealPlan) => void;
  openEditDialog: (plan: MealPlan) => void;
  deleteMealPlan: (id: string) => void;
}

export default function MealPlanList({
  mealPlans,
  formatPrice,
  movePlan,
  toggleActive,
  openEditDialog,
  deleteMealPlan,
}: MealPlanListProps) {
  return (
    <div className="grid gap-6">
      {mealPlans?.map((plan) => (
        <Card key={plan.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl">{plan.icon_emoji || "🍽️"}</span>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {plan.badge_text && (
                    <Badge
                      className={`bg-${plan.color_scheme}-100 text-${plan.color_scheme}-800 border-${plan.color_scheme}-300`}
                    >
                      {plan.badge_text}
                    </Badge>
                  )}
                  <div className="text-lg font-semibold text-green-600">
                    {formatPrice(plan.price)}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {plan.specs && (
                    <>
                      <span className="inline-flex items-center mr-4">
                        🕒 {plan.specs.freshness}
                      </span>
                      <span className="inline-flex items-center mr-4">
                        👥 {plan.specs.serving}
                      </span>
                      <span className="inline-flex items-center">
                        🎨 {plan.color_scheme || "gray"}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Created: {new Date(plan.created_at).toLocaleDateString()} |
                  Updated: {new Date(plan.updated_at).toLocaleDateString()} |
                  Sort Order: {plan.sort_order}
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => movePlan(plan.id, "up")}
                  disabled={plan.sort_order === 1}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => movePlan(plan.id, "down")}
                  disabled={!mealPlans || plan.sort_order === mealPlans.length}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(plan)}
                >
                  {plan.is_active ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(plan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMealPlan(plan.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
