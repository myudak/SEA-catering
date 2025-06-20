"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/lib/supabase";
// import { useAuth } from "@/contexts/AuthContext";
// import { sanitizeInput } from "@/lib/auth";
import { toast } from "sonner";
import {
  Calculator,
  CreditCard,
  User,
  Phone,
  Utensils,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
}

const SubscriptionPage = () => {
  // const { user } = useAuth();
  // const router = useRouter();

  // Static meal plans data (updated pricing per specifications)
  const mealPlans: MealPlan[] = [
    {
      id: "1",
      name: "Diet Plan",
      price: 30000,
      description:
        "Perfect for weight management and healthy lifestyle. Our diet plan features calorie-controlled portions with fresh vegetables, lean proteins, and balanced nutrition to help you achieve your fitness goals.",
    },
    {
      id: "2",
      name: "Protein Plan",
      price: 40000,
      description:
        "Designed for fitness enthusiasts and muscle building. High-protein meals with premium ingredients to support your workout routine and recovery. Each meal contains 30g+ of quality protein.",
    },
    {
      id: "3",
      name: "Royal Plan",
      price: 60000,
      description:
        "Our premium offering with gourmet ingredients and chef-curated recipes. Experience luxury dining with organic ingredients, larger portions, and exclusive seasonal menus.",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    planId: "",
    mealTypes: [] as string[],
    deliveryDays: [] as string[],
    allergies: "",
  });

  const mealTypeOptions = ["Breakfast", "Lunch", "Dinner"];
  const deliveryDayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Comment out database-related code
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
  //   } catch (error: any) {
  //     toast.error("Failed to load meal plans");
  //     console.error("Error fetching meal plans:", error);
  //   }
  // };

  const calculateTotalPrice = () => {
    const selectedPlan = mealPlans.find((plan) => plan.id === formData.planId);
    if (
      !selectedPlan ||
      formData.mealTypes.length === 0 ||
      formData.deliveryDays.length === 0
    ) {
      return 0;
    }

    const planPrice = selectedPlan.price;
    const mealTypesCount = formData.mealTypes.length;
    const deliveryDaysCount = formData.deliveryDays.length;
    const weeksInMonth = 4.3;

    return planPrice * mealTypesCount * deliveryDaysCount * weeksInMonth;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleMealTypeChange = (mealType: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        mealTypes: [...formData.mealTypes, mealType],
      });
    } else {
      setFormData({
        ...formData,
        mealTypes: formData.mealTypes.filter((type) => type !== mealType),
      });
    }
  };

  const handleDeliveryDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        deliveryDays: [...formData.deliveryDays, day],
      });
    } else {
      setFormData({
        ...formData,
        deliveryDays: formData.deliveryDays.filter((d) => d !== day),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // Simulate form processing delay
    setTimeout(() => {
      try {
        // Basic validation (no auth required for static version)
        const formDataToValidate = {
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          planId: formData.planId,
          mealTypes: formData.mealTypes,
          deliveryDays: formData.deliveryDays,
          allergies: formData.allergies.trim(),
        };

        // Validate required fields
        if (
          !formDataToValidate.name ||
          !formDataToValidate.phoneNumber ||
          !formDataToValidate.planId
        ) {
          toast.error("Please fill in all required fields");
          setLoading(false);
          return;
        }

        if (formDataToValidate.mealTypes.length === 0) {
          toast.error("Please select at least one meal type");
          setLoading(false);
          return;
        }

        if (formDataToValidate.deliveryDays.length === 0) {
          toast.error("Please select at least one delivery day");
          setLoading(false);
          return;
        }

        // Validate phone number
        const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
        if (!phoneRegex.test(formDataToValidate.phoneNumber)) {
          toast.error("Please enter a valid Indonesian phone number");
          setLoading(false);
          return;
        }

        const totalPrice = calculateTotalPrice();
        const selectedPlan = mealPlans.find(
          (plan) => plan.id === formData.planId
        );

        // Simulate successful subscription creation
        toast.success(
          `Subscription created successfully! ${
            selectedPlan?.name
          } plan with total monthly cost: ${formatPrice(totalPrice)}`
        );

        // Reset form
        setFormData({
          name: "",
          phoneNumber: "",
          planId: "",
          mealTypes: [],
          deliveryDays: [],
          allergies: "",
        });

        setLoading(false);
      } catch {
        toast.error("Failed to create subscription");
        setLoading(false);
      }
    }, 1500); // Simulate processing time
  };

  const selectedPlan = mealPlans.find((plan) => plan.id === formData.planId);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 px-4 py-2 text-sm font-medium">
              🎯 Create Your Subscription
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Start Your{" "}
            <span className="text-green-600 dark:text-green-400">
              Healthy Journey
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Customize your meal plan to fit your lifestyle and dietary needs.
            Fresh, healthy meals delivered right to your door.
          </p>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-gray-900 dark:text-white">
                    <CreditCard className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                    Subscription Details
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Fill in your information to create your personalized meal
                    subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
                        <User className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                        Personal Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">
                            Active Phone Number *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phoneNumber"
                              type="tel"
                              placeholder="08123456789"
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phoneNumber: e.target.value,
                                })
                              }
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plan Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
                        <Utensils className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                        Choose Your Plan *
                      </h3>

                      <RadioGroup
                        value={formData.planId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, planId: value })
                        }
                        className="space-y-3"
                      >
                        {mealPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <div className="flex-1">
                              <Label
                                htmlFor={plan.id}
                                className="cursor-pointer"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                      {plan.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      {plan.description}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-green-600 dark:text-green-400">
                                      {formatPrice(plan.price)}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      per meal
                                    </div>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Meal Types */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Meal Types *
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Select at least one meal type
                      </p>

                      <div className="grid grid-cols-3 gap-4">
                        {mealTypeOptions.map((mealType) => (
                          <div
                            key={mealType}
                            className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <Checkbox
                              id={mealType}
                              checked={formData.mealTypes.includes(mealType)}
                              onCheckedChange={(checked) =>
                                handleMealTypeChange(
                                  mealType,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={mealType}
                              className="cursor-pointer font-medium text-gray-900 dark:text-white"
                            >
                              {mealType}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Days */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
                        <Calendar className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                        Delivery Days *
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Choose your preferred delivery days
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {deliveryDayOptions.map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <Checkbox
                              id={day}
                              checked={formData.deliveryDays.includes(day)}
                              onCheckedChange={(checked) =>
                                handleDeliveryDayChange(day, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={day}
                              className="cursor-pointer font-medium text-sm text-gray-900 dark:text-white"
                            >
                              {day.slice(0, 3)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
                        <AlertTriangle className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                        Allergies & Dietary Restrictions
                      </h3>

                      <Textarea
                        placeholder="Please list any allergies or dietary restrictions (optional)"
                        value={formData.allergies}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allergies: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white text-lg py-6"
                      disabled={loading}
                    >
                      {loading
                        ? "Creating Subscription..."
                        : "Create Subscription"}
                    </Button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      This is a demo subscription form. Your data will not be
                      saved.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Price Calculator */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 sticky top-24 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-gray-900 dark:text-white">
                    <Calculator className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    Price Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPlan && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Selected Plan:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedPlan.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Price per meal:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(selectedPlan.price)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Meal types:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formData.mealTypes.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Delivery days:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formData.deliveryDays.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Weeks per month:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            4.3
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Monthly Total:
                          </span>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                      </div>

                      {totalPrice > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border dark:border-green-800">
                          <p className="text-xs text-green-700 dark:text-green-300">
                            <strong>Calculation:</strong>{" "}
                            {formatPrice(selectedPlan.price)} ×{" "}
                            {formData.mealTypes.length} meals ×{" "}
                            {formData.deliveryDays.length} days × 4.3 weeks
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {!selectedPlan && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      Select a meal plan to see pricing details
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;
