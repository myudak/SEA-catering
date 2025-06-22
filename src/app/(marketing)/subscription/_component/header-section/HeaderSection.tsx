import { Badge } from "@/components/ui/badge";
import React from "react";

const HeaderSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 px-4 py-2 text-sm font-medium">
            🎯 Create Your Subscription
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Start Your{" "}
          <span className="text-green-600 dark:text-green-400">
            Healthy Journey
          </span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Customize your meal plan to fit your lifestyle and dietary needs.
          Fresh, healthy meals delivered right to your door.
        </p>
      </div>
    </section>
  );
};

export { HeaderSection };
