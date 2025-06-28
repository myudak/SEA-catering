export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  id: string;
  user_id: string | null;
  customer_name: string;
  email?: string | null;
  message: string;
  rating: number;
  status: TestimonialStatus;
  profile_picture_url?: string | null;
  is_authenticated: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTestimonialRequest {
  customer_name: string;
  email?: string | null;
  message: string;
  rating: number;
  profile_picture_url?: string | null;
  is_authenticated: boolean;
}
