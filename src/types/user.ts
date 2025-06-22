export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
}
