"use client";

import React from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { useAuth } from "@/contexts/AuthContext";
// import { sanitizeInput } from "@/lib/auth";
import { HeaderSection, SubscriptionForm } from "./_component";

const SubscriptionPage = () => {
  // const { user } = useAuth();
  // const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <HeaderSection />

      <SubscriptionForm />
    </div>
  );
};

export default SubscriptionPage;
