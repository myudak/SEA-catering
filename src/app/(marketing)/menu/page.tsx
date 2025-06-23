/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Users, Star, Utensils } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import { createServerComponentClient } from "@/lib/supabase-server";
import { MealPlan } from "@/types/meal-plan";
import { toast } from "sonner";

// ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getMealPlans(): Promise<MealPlan[]> {
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
      return [
        {
          id: "1",
          name: "Diet Plan",
          price: 45000,
          description:
            "Perfect for weight management and healthy lifestyle. Our diet plan features calorie-controlled portions with fresh vegetables, lean proteins, and balanced nutrition to help you achieve your fitness goals.",
          image_url: null,
          features: [
            "Calorie-controlled portions",
            "Weight management focus",
            "Fresh vegetables & lean proteins",
            "Nutritionist approved",
            "Low-carb options available",
          ],
          badge_text: "Most Popular",
          color_scheme: "green",
          icon_emoji: "🥗",
          specs: { freshness: "Made Fresh", serving: "1-2 People" },
          is_active: true,
          sort_order: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Protein Plan",
          price: 65000,
          description:
            "Designed for fitness enthusiasts and muscle building. High-protein meals with premium ingredients to support your workout routine and recovery. Each meal contains 30g+ of quality protein.",
          image_url: null,
          features: [
            "High-protein content (30g+ per meal)",
            "Perfect for fitness enthusiasts",
            "Muscle building support",
            "Post-workout recovery meals",
            "Premium protein sources",
          ],
          badge_text: "Best for Fitness",
          color_scheme: "blue",
          icon_emoji: "💪",
          specs: { freshness: "Daily Prep", serving: "1 Person" },
          is_active: true,
          sort_order: 2,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "3",
          name: "Royal Plan",
          price: 85000,
          description:
            "Our premium offering with gourmet ingredients and chef-curated recipes. Experience luxury dining with organic ingredients, larger portions, and exclusive seasonal menus.",
          image_url: null,
          features: [
            "Gourmet ingredients & preparation",
            "Chef-curated recipes",
            "Premium organic ingredients",
            "Larger portion sizes",
            "Exclusive seasonal menus",
          ],
          badge_text: "Premium Choice",
          color_scheme: "purple",
          icon_emoji: "👑",
          specs: { freshness: "Chef Prepared", serving: "2-4 People" },
          is_active: true,
          sort_order: 3,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];
    }

    return mealPlans || [];
  } catch (error) {
    console.error("Unexpected error fetching meal plans:", error);
    return [];
  }
}

const MenuPage = async () => {
  const mealPlans = await getMealPlans();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 px-4 py-2 text-sm font-medium">
              🍽️ Our Meal Plans
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Perfect{" "}
            <span className="text-green-600 dark:text-green-400">
              Meal Plan
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover our carefully crafted meal plans designed to meet your
            health goals and lifestyle needs. Each plan is prepared with fresh,
            high-quality ingredients and delivered right to your door.
          </p>
        </div>
      </section>

      {/* Meal Plans Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mealPlans.map((plan) => (
              <Card
                key={plan.id}
                className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700"
              >
                {/* Plan Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      plan.image_url ||
                      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format"
                    }
                    alt={`${plan.name} meal`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`bg-${plan.color_scheme}-100 text-${plan.color_scheme}-800 border-${plan.color_scheme}-300 dark:bg-${plan.color_scheme}-900 dark:text-${plan.color_scheme}-200 dark:border-${plan.color_scheme}-700`}
                    >
                      {plan.badge_text}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-16"></div>
                </div>

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.color_scheme} rounded-full flex items-center justify-center mx-auto mb-4 -mt-8 relative z-10 border-4 border-white dark:border-gray-800`}
                  >
                    <span className="text-2xl">{plan.icon_emoji}</span>
                  </div>

                  <CardTitle className="text-2xl text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </CardTitle>

                  <div
                    className={`text-3xl font-bold mb-2 ${
                      plan.name.toLowerCase() === "diet plan"
                        ? "text-green-600 dark:text-green-400"
                        : plan.name.toLowerCase() === "protein plan"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {formatPrice(plan.price)}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      /meal
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {plan.description}
                  </CardDescription>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Plan Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0 ${
                              plan.name.toLowerCase() === "diet plan"
                                ? "bg-green-500 dark:bg-green-400"
                                : plan.name.toLowerCase() === "protein plan"
                                ? "bg-blue-500 dark:bg-blue-400"
                                : "bg-purple-500 dark:bg-purple-400"
                            }`}
                          ></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {plan.specs.freshness}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {plan.specs.serving}
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Utensils className="h-4 w-4 mr-2" />
                        See More Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-gray-900 dark:text-white">
                          {plan.name} Details
                        </DialogTitle>
                        <DialogDescription className="text-lg text-gray-600 dark:text-gray-300">
                          Everything you need to know about this meal plan
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                            Plan Overview
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {plan.description}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                            What&apos;s Included
                          </h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {plan.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start text-sm text-gray-600 dark:text-gray-300"
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0 ${
                                    plan.name.toLowerCase() === "diet plan"
                                      ? "bg-green-500 dark:bg-green-400"
                                      : plan.name.toLowerCase() ===
                                        "protein plan"
                                      ? "bg-blue-500 dark:bg-blue-400"
                                      : "bg-purple-500 dark:bg-purple-400"
                                  }`}
                                ></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border dark:border-green-800">
                          <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                            Pricing Information
                          </h3>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                            {formatPrice(plan.price)} per meal
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Final subscription price depends on meal types and
                            delivery days selected. Use our subscription
                            calculator to get your personalized quote!
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                            asChild
                          >
                            <TransitionLink href="/subscription">
                              Subscribe Now
                            </TransitionLink>
                          </Button>
                          <Button variant="outline" className="flex-1" asChild>
                            <TransitionLink href="/contact">
                              Contact Us
                            </TransitionLink>
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Healthy Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose your perfect meal plan and let us take care of your nutrition
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
              asChild
            >
              <TransitionLink href="/subscription">
                <Utensils className="mr-2 h-5 w-5" />
                Start Subscription
              </TransitionLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <TransitionLink href="/contact">Contact Our Team</TransitionLink>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
