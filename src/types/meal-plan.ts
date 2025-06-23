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

export interface CreateMealPlanRequest {
  name: string;
  price: number;
  description: string;
  image_url?: string;
  features?: string[];
  badge_text?: string;
  color_scheme?: string;
  icon_emoji?: string;
  specs?: {
    freshness: string;
    serving: string;
  };
}

export interface UpdateMealPlanRequest {
  name: string;
  price: number;
  description: string;
  image_url?: string;
  features?: string[];
  is_active?: boolean;
  sort_order?: number;
  badge_text?: string;
  color_scheme?: string;
  icon_emoji?: string;
  specs?: {
    freshness: string;
    serving: string;
  };
}
