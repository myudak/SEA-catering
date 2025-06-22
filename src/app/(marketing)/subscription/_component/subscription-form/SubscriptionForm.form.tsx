import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  User,
  Phone,
  Utensils,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import React from "react";
import { SubscriptionFormProps } from "./type";

const SForm = ({
  mealPlans,
  handleSubmit,
  formData,
  setFormData,
  formatPrice,
  loading,
  mealTypeOptions,
  deliveryDayOptions,
  handleMealTypeChange,
  handleDeliveryDayChange,
  isAuthenticated,
}: SubscriptionFormProps) => {
  return (
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
                  <Label htmlFor="phoneNumber">Active Phone Number *</Label>
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
                      <Label htmlFor={plan.id} className="cursor-pointer">
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
                        handleMealTypeChange(mealType, checked as boolean)
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
              disabled={loading || !isAuthenticated}
            >
              {loading ? "Creating Subscription..." : "Create Subscription"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SForm;
