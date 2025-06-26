"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  MealPlan,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
} from "@/types/meal-plan";
import { toast } from "sonner";
import Header from "./Header";
import Stats from "./Stats";
import MealPlanList from "./MealPlanList";
import Dialogs from "./Dialogs";

interface MealPlanClientProps {
  mealPlans: MealPlan[] | null;
}

export default function MealPlanClient({
  mealPlans: initialMealPlans,
}: MealPlanClientProps) {
  const { user, profile, loading: authLoading } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[] | null>(
    initialMealPlans
  );
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [revalidating, setRevalidating] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<MealPlan>>({
    name: "",
    price: 0,
    description: "",
    image_url: "",
    features: [] as string[],
    badge_text: "",
    color_scheme: "gray",
    icon_emoji: "🍽️",
  });
  const [newFeature, setNewFeature] = useState("");

  const createMealPlan = async (data: CreateMealPlanRequest) => {
    try {
      const response = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create meal plan");
      }

      const newPlan = await response.json();
      setMealPlans((prev) => (prev ? [...prev, newPlan] : [newPlan]));
      toast.success("Meal plan created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error: unknown) {
      console.error("Error creating meal plan:", error);
      toast.error((error as Error).message || "Failed to create meal plan");
    }
  };

  const updateMealPlan = async (id: string, data: UpdateMealPlanRequest) => {
    try {
      const response = await fetch(`/api/meal-plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update meal plan");
      }

      const updatedPlan = await response.json();
      setMealPlans((prev) =>
        prev ? prev.map((plan) => (plan.id === id ? updatedPlan : plan)) : null
      );
      toast.success("Meal plan updated successfully");
      setIsEditDialogOpen(false);
      setEditingPlan(null);
      resetForm();
    } catch (error: unknown) {
      console.error("Error updating meal plan:", error);
      toast.error((error as Error).message || "Failed to update meal plan");
    }
  };

  const deleteMealPlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    try {
      const response = await fetch(`/api/meal-plans/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete meal plan");
      }

      setMealPlans((prev) =>
        prev ? prev.filter((plan) => plan.id !== id) : null
      );
      toast.success("Meal plan deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting meal plan:", error);
      toast.error((error as Error).message || "Failed to delete meal plan");
    }
  };

  const toggleActive = async (plan: MealPlan) => {
    await updateMealPlan(plan.id, {
      name: plan.name,
      price: plan.price,
      description: plan.description,
      image_url: plan.image_url || undefined,
      features: plan.features,
      is_active: !plan.is_active,
    });
  };

  const revalidateMenu = async () => {
    try {
      setRevalidating(true);
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/menu" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to revalidate");
      }

      toast.success("Menu page revalidated successfully");
    } catch (error: unknown) {
      console.error("Error revalidating:", error);
      toast.error((error as Error).message || "Failed to revalidate menu");
    } finally {
      setRevalidating(false);
    }
  };

  const movePlan = async (planId: string, direction: "up" | "down") => {
    if (!mealPlans) return;
    try {
      const currentPlan = mealPlans.find((plan) => plan.id === planId);
      if (!currentPlan) return;

      const sortedPlans = [...mealPlans].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      const currentIndex = sortedPlans.findIndex((plan) => plan.id === planId);

      if (direction === "up" && currentIndex === 0) return;
      if (direction === "down" && currentIndex === sortedPlans.length - 1)
        return;

      const swapIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const swapPlan = sortedPlans[swapIndex];

      // Swap sort orders
      const reorderData = [
        { id: currentPlan.id, sort_order: swapPlan.sort_order },
        { id: swapPlan.id, sort_order: currentPlan.sort_order },
      ];

      const response = await fetch("/api/meal-plans/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorderData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reorder meal plans");
      }

      // Update local state
      const updatedPlans = mealPlans.map((plan) => {
        if (plan.id === currentPlan.id) {
          return { ...plan, sort_order: swapPlan.sort_order };
        }
        if (plan.id === swapPlan.id) {
          return { ...plan, sort_order: currentPlan.sort_order };
        }
        return plan;
      });

      setMealPlans(updatedPlans);
      toast.success("Meal plan order updated successfully");
    } catch (error: unknown) {
      console.error("Error moving plan:", error);
      toast.error((error as Error).message || "Failed to reorder meal plan");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      image_url: "",
      features: [],
      badge_text: "",
      color_scheme: "gray",
      icon_emoji: "🍽️",
    });
    setNewFeature("");
  };

  const openEditDialog = (plan: MealPlan) => {
    setEditingPlan(plan);
    setFormData({
      ...plan,
      price: plan.price,
    });
    setIsEditDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      price: formData.price,
      description: formData.description,
      image_url: formData.image_url || undefined,
      features: formData.features,
      badge_text: formData.badge_text || undefined,
      color_scheme: formData.color_scheme || undefined,
      icon_emoji: formData.icon_emoji || undefined,
    };

    if (editingPlan) {
      updateMealPlan(editingPlan.id, data as UpdateMealPlanRequest);
    } else {
      createMealPlan(data as CreateMealPlanRequest);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          revalidating={revalidating}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          revalidateMenu={revalidateMenu}
          handleSubmit={handleSubmit}
        />
        <Stats mealPlans={mealPlans} formatPrice={formatPrice} />
        <MealPlanList
          mealPlans={mealPlans}
          formatPrice={formatPrice}
          movePlan={movePlan}
          toggleActive={toggleActive}
          openEditDialog={openEditDialog}
          deleteMealPlan={deleteMealPlan}
        />
        <Dialogs
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          setEditingPlan={setEditingPlan}
          resetForm={resetForm}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          addFeature={addFeature}
          removeFeature={removeFeature}
        />
      </div>
    </div>
  );
}
