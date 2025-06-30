import { MealPlan } from "./meal-plan";

export interface Subscription {
  id: string;
  user_id: string;
  meal_plan_id: string;
  meal_plan?: MealPlan; // Populated when joined
  customer_name: string;
  phone_number: string;
  meal_types: string[];
  delivery_days: string[];
  allergies: string | null;
  total_price: number;
  status: "active" | "paused" | "cancelled";
  pause_start_date: string | null;
  pause_end_date: string | null;
  next_billing_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  meal_plan_id: string;
  customer_name: string;
  phone_number: string;
  meal_types: string[];
  delivery_days: string[];
  allergies?: string;
  promo_code?: string;
}

export interface PauseSubscriptionRequest {
  pause_start_date: string;
  pause_end_date: string;
}

export interface SubscriptionStatusUpdate {
  status: "active" | "paused" | "cancelled";
  pause_start_date?: string | null;
  pause_end_date?: string | null;
}

export type SubscriptionStatus = "active" | "paused" | "cancelled";
