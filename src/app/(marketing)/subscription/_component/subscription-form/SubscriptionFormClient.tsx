"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import SForm from "./SubscriptionForm.form";
import { deliveryDayOptions, MealPlan, mealTypeOptions } from "./type";
import PriceCalculator from "./SubscriptionForm.pricecalculator";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";

interface SubscriptionFormClientProps {
  mealPlans: MealPlan[] | null;
}

export default function SubscriptionFormClient({
  mealPlans,
}: SubscriptionFormClientProps) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    planId: "",
    mealTypes: [] as string[],
    deliveryDays: [] as string[],
    allergies: "",
  });

  const mealTypeOptions: mealTypeOptions = ["Breakfast", "Lunch", "Dinner"];
  const deliveryDayOptions: deliveryDayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const calculateTotalPrice = () => {
    if (!mealPlans || mealPlans.length === 0) {
      return 0; // No meal plans available
    }
    const selectedPlan = mealPlans?.find((plan) => plan.id === formData.planId);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      toast.error("Please sign in to create a subscription");
      return;
    }

    // Check if meal plans are available
    if (!mealPlans || mealPlans.length === 0) {
      toast.error("Meal plans are not available. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      // Basic validation
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
      const selectedPlan = mealPlans?.find(
        (plan) => plan.id === formData.planId
      );

      if (!selectedPlan) {
        toast.error("Selected meal plan is not available");
        setLoading(false);
        return;
      }

      // Create subscription via API
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal_plan_id: formDataToValidate.planId,
          customer_name: formDataToValidate.name,
          phone_number: formDataToValidate.phoneNumber,
          meal_types: formDataToValidate.mealTypes,
          delivery_days: formDataToValidate.deliveryDays,
          allergies: formDataToValidate.allergies || null,
          total_price: totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }

      // Success!
      toast.success(
        `Subscription created successfully! ${
          selectedPlan.name
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
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      toast.error(error.message || "Failed to create subscription");
      setLoading(false);
    }
  };

  const selectedPlan = mealPlans?.find((plan) => plan.id === formData.planId);
  const totalPrice = calculateTotalPrice();

  if (authLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {!user && (
          <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <User className="h-6 w-6 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                  Sign in required
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Please sign in to create a subscription. You can view our meal
                  plans and pricing below, but you&apos;ll need an account to
                  place an order.
                </p>
                <div className="mt-4 flex space-x-3">
                  <Link href="/auth/signin">
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <SForm
            mealPlans={mealPlans}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            formatPrice={formatPrice}
            loading={loading}
            mealTypeOptions={mealTypeOptions}
            deliveryDayOptions={deliveryDayOptions}
            handleMealTypeChange={handleMealTypeChange}
            handleDeliveryDayChange={handleDeliveryDayChange}
            isAuthenticated={!!user}
          />

          <PriceCalculator
            selectedPlan={selectedPlan}
            formData={formData}
            totalPrice={totalPrice}
            formatPrice={formatPrice}
          />
        </div>
      </div>
    </section>
  );
}
