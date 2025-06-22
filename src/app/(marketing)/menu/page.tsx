/* eslint-disable @next/next/no-img-element */
"use client";

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
// import { supabase } from "@/lib/supabase";
import { Clock, Users, Star, Utensils } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
// import { toast } from "sonner";

interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string | null;
  created_at: string;
}

const MenuPage = () => {
  // Static meal plans data
  const mealPlans: MealPlan[] = [
    {
      id: "1",
      name: "Diet Plan",
      price: 45000,
      description:
        "Perfect for weight management and healthy lifestyle. Our diet plan features calorie-controlled portions with fresh vegetables, lean proteins, and balanced nutrition to help you achieve your fitness goals.",
      image_url: null,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Protein Plan",
      price: 65000,
      description:
        "Designed for fitness enthusiasts and muscle building. High-protein meals with premium ingredients to support your workout routine and recovery. Each meal contains 30g+ of quality protein.",
      image_url: null,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      name: "Royal Plan",
      price: 85000,
      description:
        "Our premium offering with gourmet ingredients and chef-curated recipes. Experience luxury dining with organic ingredients, larger portions, and exclusive seasonal menus.",
      image_url: null,
      created_at: "2024-01-01T00:00:00Z",
    },
  ];

  const loading = false;

  // Comment out database-related code
  // const [mealPlans, setMealPlans] = useState<MealPlan[]>(mockMealPlans);
  // const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   fetchMealPlans();
  // }, []);

  // const fetchMealPlans = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("meal_plans")
  //       .select("*")
  //       .order("price", { ascending: true });

  //     if (error) throw error;
  //     setMealPlans(data || []);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     toast.error("Failed to load meal plans");
  //     console.error("Error fetching meal plans:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPlanFeatures = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "diet plan":
        return [
          "Calorie-controlled portions",
          "Weight management focus",
          "Fresh vegetables & lean proteins",
          "Nutritionist approved",
          "Low-carb options available",
        ];
      case "protein plan":
        return [
          "High-protein content (30g+ per meal)",
          "Perfect for fitness enthusiasts",
          "Muscle building support",
          "Post-workout recovery meals",
          "Premium protein sources",
        ];
      case "royal plan":
        return [
          "Gourmet ingredients & preparation",
          "Chef-curated recipes",
          "Premium organic ingredients",
          "Larger portion sizes",
          "Exclusive seasonal menus",
        ];
      default:
        return [
          "Healthy & delicious meals",
          "Fresh ingredients",
          "Balanced nutrition",
        ];
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "diet plan":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
      case "protein plan":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700";
      case "royal plan":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600";
    }
  };

  const getPlanBadge = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "diet plan":
        return "Most Popular";
      case "protein plan":
        return "Best for Fitness";
      case "royal plan":
        return "Premium Choice";
      default:
        return "Available";
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "diet plan":
        return "🥗";
      case "protein plan":
        return "💪";
      case "royal plan":
        return "👑";
      default:
        return "🍽️";
    }
  };

  const getPlanGradient = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "diet plan":
        return "from-green-100 to-green-200 dark:from-green-800 dark:to-green-700";
      case "protein plan":
        return "from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700";
      case "royal plan":
        return "from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700";
      default:
        return "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700";
    }
  };

  const getPlanImageUrl = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "diet plan":
        return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&auto=format";
      case "protein plan":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format";
      case "royal plan":
        return "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&auto=format";
      default:
        return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format";
    }
  };

  const getPlanSpecs = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "diet plan":
        return {
          freshness: "Made Fresh",
          serving: "1-2 People",
        };
      case "protein plan":
        return {
          freshness: "Daily Prep",
          serving: "1 Person",
        };
      case "royal plan":
        return {
          freshness: "Chef Prepared",
          serving: "2-4 People",
        };
      default:
        return {
          freshness: "Fresh Daily",
          serving: "1 Person",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meal plans...</p>
        </div>
      </div>
    );
  }

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
                    src={getPlanImageUrl(plan.name)}
                    alt={`${plan.name} meal`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getPlanColor(plan.name)}>
                      {getPlanBadge(plan.name)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-16"></div>
                </div>

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${getPlanGradient(
                      plan.name
                    )} rounded-full flex items-center justify-center mx-auto mb-4 -mt-8 relative z-10 border-4 border-white dark:border-gray-800`}
                  >
                    <span className="text-2xl">{getPlanIcon(plan.name)}</span>
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
                      {getPlanFeatures(plan.name).map((feature, index) => (
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
                      {getPlanSpecs(plan.name).freshness}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {getPlanSpecs(plan.name).serving}
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
                            {getPlanFeatures(plan.name).map(
                              (feature, index) => (
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
                              )
                            )}
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
