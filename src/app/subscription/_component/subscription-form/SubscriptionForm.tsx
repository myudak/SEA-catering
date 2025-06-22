import React, { useState } from "react";
import { toast } from "sonner";
import SForm from "./SubscriptionForm.form";
import { deliveryDayOptions, MealPlan, mealTypeOptions } from "./type";
import PriceCalculator from "./SubscriptionForm.pricecalculator";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";

const SubscriptionForm = () => {
  const { user, loading: authLoading } = useAuth();

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

    // Check if user is authenticated
    if (!user) {
      toast.error("Please sign in to create a subscription");
      return;
    }

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
};

export { SubscriptionForm };
