"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

export default function Header() {
  const { profile } = useAuth();
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to the admin panel, {profile?.full_name}
          </p>
        </div>
      </div>
    </div>
  );
}
