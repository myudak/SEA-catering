"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function SecurityNotice() {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Security Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Admin Access Granted:</strong> You have full
              administrative privileges. Please use responsibly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
