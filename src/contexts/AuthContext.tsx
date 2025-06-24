/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { AuthUser, UserProfile } from "@/types/user";
import {
  Session,
  User,
  AuthError,
  AuthChangeEvent,
} from "@supabase/supabase-js";

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: AuthError | Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create supabase client instance for this component
  const supabase = createClient();

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      // Fetch profile from Supabase

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("AuthContext - Initial session:", session);
        setSession(session);

        if (session?.user) {
          console.log("AuthContext - User found:", session.user.id);
          setUser(session.user as unknown as AuthUser);
          const profile = await fetchProfile(session.user.id);
          setProfile(profile);
        } else {
          console.log("AuthContext - No session found");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log(
          "AuthContext - Auth state change:",
          event,
          session?.user?.id
        );
        setSession(session);

        if (session?.user) {
          setUser(session.user as unknown as AuthUser);
          const profile = await fetchProfile(session.user.id);
          setProfile(profile);
        } else {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign up function with strong password validation
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Validate password strength
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return {
          error: new Error(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
          ),
          user: null,
        };
      }

      // Create user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: undefined, // Disable email verification
        },
      });

      if (error) {
        return { error, user: null };
      }

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: data.user.id,
          full_name: fullName,
          role: "user", // Default role
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      return { error: null, user: data.user };
    } catch (error) {
      return { error: error as Error, user: null };
    }
  };

  // Sign out function
  type LogoutResult =
    | { success: true }
    | { success: false; reason: "timeout" }
    | { success: false; reason: "supabase"; error: Error };

  const logoutWithTimeout = async (
    timeoutMs: number = 5000
  ): Promise<LogoutResult> => {
    const timeoutError = new Error("Logout request timed out");
    timeoutError.name = "LogoutTimeout";

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(timeoutError), timeoutMs)
    );

    try {
      await Promise.race([supabase.auth.signOut(), timeout]);
      return { success: true };
    } catch (error: any) {
      if (error.name === "LogoutTimeout") {
        return { success: false, reason: "timeout" };
      }

      return {
        success: false,
        reason: "supabase",
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthContext - Starting sign out...");

      const res = await logoutWithTimeout();

      if (!res.success && res.reason === "timeout") {
        console.error("AuthContext - Sign out timed out");
        window.location.reload();
        throw new Error("Sign out request timed out");
        // return;
      }

      // if (error) {
      //   console.error("AuthContext - Sign out error:", error);
      //   throw error;
      // }

      console.log("AuthContext - Sign out successful");
      // Clear local state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error("AuthContext - Sign out failed:", error);
      throw error;
    }
  };

  // Refresh profile function
  const refreshProfile = async () => {
    if (user?.id) {
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
