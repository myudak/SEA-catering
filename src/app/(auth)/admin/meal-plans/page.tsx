"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
} from "lucide-react";
import {
  MealPlan,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
} from "@/types/meal-plan";
import { toast } from "sonner";
import TransitionLink from "@/components/TransitionLink";

export default function MealPlansAdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [revalidating, setRevalidating] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
    features: [] as string[],
    badge_text: "",
    color_scheme: "gray",
    icon_emoji: "🍽️",
    freshness: "Fresh Daily",
    serving: "1 Person",
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (!authLoading && profile?.role === "admin") {
      fetchMealPlans();
    }
  }, [authLoading, profile]);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/meal-plans");
      if (!response.ok) throw new Error("Failed to fetch meal plans");
      const data = await response.json();
      setMealPlans(data);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      toast.error("Failed to load meal plans");
    } finally {
      setLoading(false);
    }
  };

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
      setMealPlans([...mealPlans, newPlan]);
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
      setMealPlans(
        mealPlans.map((plan) => (plan.id === id ? updatedPlan : plan))
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

      setMealPlans(mealPlans.filter((plan) => plan.id !== id));
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
      price: "",
      description: "",
      image_url: "",
      features: [],
      badge_text: "",
      color_scheme: "gray",
      icon_emoji: "🍽️",
      freshness: "Fresh Daily",
      serving: "1 Person",
    });
    setNewFeature("");
  };

  const openEditDialog = (plan: MealPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description,
      image_url: plan.image_url || "",
      features: [...plan.features],
      badge_text: plan.badge_text || "",
      color_scheme: plan.color_scheme || "gray",
      icon_emoji: plan.icon_emoji || "🍽️",
      freshness: plan.specs?.freshness || "Fresh Daily",
      serving: plan.specs?.serving || "1 Person",
    });
    setIsEditDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      price: parseInt(formData.price),
      description: formData.description,
      image_url: formData.image_url || undefined,
      features: formData.features,
      badge_text: formData.badge_text || undefined,
      color_scheme: formData.color_scheme || undefined,
      icon_emoji: formData.icon_emoji || undefined,
      specs: {
        freshness: formData.freshness,
        serving: formData.serving,
      },
    };

    if (editingPlan) {
      updateMealPlan(editingPlan.id, data);
    } else {
      createMealPlan(data);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (authLoading || loading) {
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button asChild>
              <TransitionLink
                animationType="loadingTopBar"
                href="/admin"
                className="flex items-center"
              >
                <span className="sr-only">Back to Dashboard</span>
                <ArrowLeft className="h-4 w-4" />
              </TransitionLink>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meal Plans Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your meal plans and pricing
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={revalidateMenu}
              disabled={revalidating}
              variant="outline"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${revalidating ? "animate-spin" : ""}`}
              />
              Revalidate Menu
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Meal Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Meal Plan</DialogTitle>
                  <DialogDescription>
                    Add a new meal plan to your offerings
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Plan Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (IDR)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL (optional)</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                    />
                  </div>

                  {/* Display Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="badge_text">Badge Text</Label>
                      <Input
                        id="badge_text"
                        value={formData.badge_text}
                        placeholder="e.g., Most Popular"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            badge_text: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="color_scheme">Color Scheme</Label>
                      <Select
                        value={formData.color_scheme}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            color_scheme: e.target.value,
                          })
                        }
                      >
                        <option value="gray">Gray</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="red">Red</option>
                        <option value="yellow">Yellow</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icon_emoji">Icon Emoji</Label>
                      <Input
                        id="icon_emoji"
                        value={formData.icon_emoji}
                        placeholder="e.g., 🥗"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            icon_emoji: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="freshness">Freshness</Label>
                      <Input
                        id="freshness"
                        value={formData.freshness}
                        placeholder="e.g., Made Fresh"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            freshness: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="serving">Serving Size</Label>
                    <Input
                      id="serving"
                      value={formData.serving}
                      placeholder="e.g., 1-2 People"
                      onChange={(e) =>
                        setFormData({ ...formData, serving: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addFeature())
                        }
                      />
                      <Button type="button" onClick={addFeature}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {feature}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Create Plan
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mealPlans.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mealPlans.filter((plan) => plan.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(
                  mealPlans.length > 0
                    ? mealPlans.reduce((sum, plan) => sum + plan.price, 0) /
                        mealPlans.length
                    : 0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {mealPlans.length > 0 ? (
                  <>
                    {formatPrice(Math.min(...mealPlans.map((p) => p.price)))} -{" "}
                    {formatPrice(Math.max(...mealPlans.map((p) => p.price)))}
                  </>
                ) : (
                  "No plans"
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meal Plans List */}
        <div className="grid gap-6">
          {mealPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl">
                        {plan.icon_emoji || "🍽️"}
                      </span>
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
                      Created: {new Date(plan.created_at).toLocaleDateString()}{" "}
                      | Updated:{" "}
                      {new Date(plan.updated_at).toLocaleDateString()} | Sort
                      Order: {plan.sort_order}
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
                      disabled={plan.sort_order === mealPlans.length}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Meal Plan</DialogTitle>
              <DialogDescription>
                Update the meal plan details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Plan Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price (IDR)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-image_url">Image URL (optional)</Label>
                <Input
                  id="edit-image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>

              {/* Display Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-badge_text">Badge Text</Label>
                  <Input
                    id="edit-badge_text"
                    value={formData.badge_text}
                    placeholder="e.g., Most Popular"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        badge_text: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color_scheme">Color Scheme</Label>
                  <Select
                    value={formData.color_scheme}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color_scheme: e.target.value,
                      })
                    }
                  >
                    <option value="gray">Gray</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-icon_emoji">Icon Emoji</Label>
                  <Input
                    id="edit-icon_emoji"
                    value={formData.icon_emoji}
                    placeholder="e.g., 🥗"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        icon_emoji: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-freshness">Freshness</Label>
                  <Input
                    id="edit-freshness"
                    value={formData.freshness}
                    placeholder="e.g., Made Fresh"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        freshness: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-serving">Serving Size</Label>
                <Input
                  id="edit-serving"
                  value={formData.serving}
                  placeholder="e.g., 1-2 People"
                  onChange={(e) =>
                    setFormData({ ...formData, serving: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                  />
                  <Button type="button" onClick={addFeature}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {feature}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFeature(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Update Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
