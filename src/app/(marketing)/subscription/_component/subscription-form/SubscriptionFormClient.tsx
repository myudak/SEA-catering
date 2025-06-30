"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import SForm from "./SubscriptionForm.form";
import { deliveryDayOptions, MealPlan, mealTypeOptions } from "./type";
import PriceCalculator from "./SubscriptionForm.pricecalculator";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { User, ArrowRight, Calendar, Check, Clock, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransitionLink from "@/components/TransitionLink";

interface SubscriptionFormClientProps {
  mealPlans: MealPlan[] | null;
}

export default function SubscriptionFormClient({
  mealPlans,
}: SubscriptionFormClientProps) {
  const { user, loading: authLoading } = useAuth();
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<
    | {
        plan: string;
        customerName: string;
        planPrice: string;
        mealTypes: string[];
        deliveryDays: string[];
        totalPrice: string;
        subscriptionId: string;
      }
    | undefined
  >(undefined);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    planId: "",
    mealTypes: [] as string[],
    deliveryDays: [] as string[],
    allergies: "",
    promoCode: "",
  });
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    type: string;
  } | null>(null);

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
    let total = planPrice * mealTypesCount * deliveryDaysCount * weeksInMonth;

    if (appliedPromo) {
      if (appliedPromo.type === "percentage") {
        total *= 1 - appliedPromo.discount / 100;
      } else if (appliedPromo.type === "fixed_amount") {
        total -= appliedPromo.discount;
      }
    }

    return total;
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
    setFormData((prev) => {
      const alreadyIncluded = prev.deliveryDays.includes(day);

      if (checked && !alreadyIncluded) {
        return {
          ...prev,
          deliveryDays: [...prev.deliveryDays, day],
        };
      }

      if (!checked && alreadyIncluded) {
        return {
          ...prev,
          deliveryDays: prev.deliveryDays.filter((d) => d !== day),
        };
      }

      return prev; // nothing changed
    });
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode) {
      toast.error("Please enter a promo code");
      return;
    }
    try {
      const res = await fetch(`/api/promo-codes/${formData.promoCode}`);
      const data = await res.json();
      if (res.ok) {
        toast.success("Promo code applied!");
        setAppliedPromo({
          code: data.promoCode.code,
          discount: data.promoCode.value,
          type: data.promoCode.discount_type,
        });

        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
        });
      } else {
        toast.error(data.error || "Invalid promo code");
        setAppliedPromo(null);
      }
    } catch {
      toast.error("Failed to apply promo code");
      setAppliedPromo(null);
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
          promo_code: appliedPromo?.code,
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

      // add to success modal data
      setConfirmationDialog(true);
      setSubscriptionData({
        plan: selectedPlan.name,
        customerName: formDataToValidate.name,
        planPrice: formatPrice(selectedPlan.price),
        mealTypes: formDataToValidate.mealTypes,
        deliveryDays: formDataToValidate.deliveryDays,
        totalPrice: formatPrice(totalPrice),
        subscriptionId: data.subscription.id,
      });

      // Reset form
      setFormData({
        name: "",
        phoneNumber: "",
        planId: "",
        mealTypes: [],
        deliveryDays: [],
        allergies: "",
        promoCode: "",
      });
      setAppliedPromo(null);

      setLoading(false);

      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
      });
    } catch (error: unknown) {
      console.error("Error creating subscription:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
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
    <>
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
                    Please sign in to create a subscription. You can view our
                    meal plans and pricing below, but you&apos;ll need an
                    account to place an order.
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
              promoCode={formData.promoCode}
              handlePromoCodeChange={(e) =>
                setFormData({ ...formData, promoCode: e.target.value })
              }
              handleApplyPromo={handleApplyPromo}
              appliedPromo={appliedPromo}
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

      {/* success modal */}
      {subscriptionData && (
        <Dialog open={confirmationDialog} onOpenChange={setConfirmationDialog}>
          <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 dark:from-green-600 dark:via-green-700 dark:to-emerald-700 px-4 sm:px-6 py-6 sm:py-8 text-white">
              <div className="flex justify-center mb-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-700 bg-opacity-20 dark:bg-green-900  dark:bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Check
                    className="w-6 sm:w-8 h-6 sm:h-8 text-white"
                    strokeWidth={3}
                  />
                </div>
              </div>

              <DialogHeader className="text-center space-y-2">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  🎉 Subscription Confirmed!
                </DialogTitle>
                <DialogDescription className="text-green-100 dark:text-green-200 text-sm sm:text-base">
                  Welcome to SEA Catering, {subscriptionData.customerName}!
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Thank you message */}
              <div className="text-center space-y-2">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  Thank you for choosing SEA Catering! Your healthy meal journey
                  starts now. We&apos;re excited to deliver fresh, nutritious
                  meals right to your doorstep.
                </p>
              </div>

              {/* Subscription details */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                  <Gift className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 dark:text-green-400" />
                  Your Subscription Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Plan:
                    </span>
                    <p className="font-semibold text-green-700 dark:text-green-400">
                      {subscriptionData.plan}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly Total:
                    </span>
                    <p className="font-semibold text-green-700 dark:text-green-400">
                      {subscriptionData.totalPrice}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Meal Types:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {subscriptionData.mealTypes.map((meal, index) => (
                      <span
                        key={index}
                        className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {meal}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Delivery Days:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {subscriptionData.deliveryDays.map((day, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next steps */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3 text-sm sm:text-base">
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 dark:text-blue-400" />
                  What Happens Next?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Your first delivery will arrive on your next selected day
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Track your orders through your personal dashboard
                    </span>
                  </li>
                </ul>
              </div>

              {/* Subscription ID */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Subscription ID:{" "}
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {subscriptionData.subscriptionId}
                  </span>
                </p>
              </div>

              {/* Action button */}
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-700 dark:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                asChild
              >
                <TransitionLink
                  href="/dashboard"
                  className="flex items-center justify-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Continue to Dashboard</span>
                </TransitionLink>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
