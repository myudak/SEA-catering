import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import React from "react";
import { PriceCalculatorProps } from "./type";

const PriceCalculator = ({
  selectedPlan,
  formData,
  totalPrice,
  formatPrice,
}: PriceCalculatorProps) => {
  return (
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

              {/* {totalPrice > 0 && (
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <strong>Calculation:</strong>{" "}
                    {formatPrice(selectedPlan.price)} ×{" "}
                    {formData.mealTypes.length} meals ×{" "}
                    {formData.deliveryDays.length} days × 4.3 weeks
                  </p>
                </div>
              )} */}
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
  );
};

export default PriceCalculator;
