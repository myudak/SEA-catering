"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransitionLink from "@/components/TransitionLink";
import { Database, Settings, Shield, Users } from "lucide-react";

export default function AdminActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <TransitionLink
            animationType="loadingTopBar"
            href="/admin/meal-plans"
          >
            <Database className="mr-2 h-4 w-4" />
            Manage Meal Plans
          </TransitionLink>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <TransitionLink animationType="loadingTopBar" href="/admin/users">
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </TransitionLink>
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Database className="mr-2 h-4 w-4" />
          Manage Subscriptions
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          System Settings
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Shield className="mr-2 h-4 w-4" />
          Security Settings
        </Button>
      </CardContent>
    </Card>
  );
}
