export interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
}

export type mealTypeOptions = ["Breakfast", "Lunch", "Dinner"];
export type deliveryDayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

type formData = {
  name: string;
  phoneNumber: string;
  planId: string;
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
};

type setFormData = React.Dispatch<
  React.SetStateAction<{
    name: string;
    phoneNumber: string;
    planId: string;
    mealTypes: string[];
    deliveryDays: string[];
    allergies: string;
  }>
>;

type handleSubmit = (e: React.FormEvent) => void;

type formatPrice = (price: number) => string;

type handleMealTypeChange = (mealType: string, checked: boolean) => void;

type handleDeliveryDayChange = (day: string, checked: boolean) => void;

export interface SubscriptionFormProps {
  mealPlans: MealPlan[];
  selectedMealPlanId?: string;
  handleSubmit: handleSubmit;
  formData: formData;
  setFormData: setFormData;
  formatPrice: formatPrice;
  loading: boolean;
  mealTypeOptions: mealTypeOptions;
  deliveryDayOptions: deliveryDayOptions;
  handleMealTypeChange: handleMealTypeChange;
  handleDeliveryDayChange: handleDeliveryDayChange;
}

export interface PriceCalculatorProps {
  selectedPlan: MealPlan | undefined;
  formData: formData;
  totalPrice: number;
  formatPrice: formatPrice;
}
