export interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
  badge_text: string;
  color_scheme: string;
  icon_emoji: string;
  specs: {
    freshness: string;
    serving: string;
  };
  created_at: string;
  updated_at: string;
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
  promoCode: string;
};

type setFormData = React.Dispatch<React.SetStateAction<formData>>;

type handleSubmit = (e: React.FormEvent) => void;

type formatPrice = (price: number) => string;

type handleMealTypeChange = (mealType: string, checked: boolean) => void;

type handleDeliveryDayChange = (day: string, checked: boolean) => void;

export interface SubscriptionFormProps {
  mealPlans: MealPlan[] | null;
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
  isAuthenticated: boolean;
  promoCode: string;
  handlePromoCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleApplyPromo: () => void;
  appliedPromo: { code: string; discount: number; type: string } | null;
}

export interface PriceCalculatorProps {
  selectedPlan: MealPlan | undefined;
  formData: Omit<formData, "promoCode">;
  totalPrice: number;
  formatPrice: formatPrice;
}
