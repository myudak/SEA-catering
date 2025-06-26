"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminInformation() {
  const { user, profile } = useAuth();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Admin Email
          </label>
          <p className="text-sm">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Admin Name
          </label>
          <p className="text-sm">{profile?.full_name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Role</label>
          <p className="flex items-center space-x-2 text-sm capitalize">
            <Shield className="h-4 w-4 text-red-600" />
            <span className="text-red-600 font-semibold">{profile?.role}</span>
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Last Login
          </label>
          <p className="text-sm">
            {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
