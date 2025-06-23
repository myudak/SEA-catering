import React from "react";
import { getMealPlans } from "@/lib/mealPlans";
import SubscriptionFormClient from "./SubscriptionFormClient";

async function SubscriptionForm() {
  try {
    const mealPlans = await getMealPlans();
    return <SubscriptionFormClient mealPlans={mealPlans} />;
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return <SubscriptionFormClient mealPlans={null} />;
  }
}

export { SubscriptionForm };
