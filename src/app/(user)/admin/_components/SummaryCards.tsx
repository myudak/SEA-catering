"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Settings, Users } from "lucide-react";

interface SummaryCardsProps {
  metrics: {
    dates: string[];
    totals: {
      userCount: number;
      activeSubscriptions: number;
      revenue: number;
      newSubscriptions: number;
    };
  } | null;
  getPercentChange: (metrics: {
    dates: string[];
    totals: { userCount: number; newSubscriptions: number };
  }) => string | number;
}

export default function SummaryCards({
  metrics,
  getPercentChange,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 card-gradient-admin">
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.totals.userCount ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics ? `${getPercentChange(metrics)}% from last month` : "--"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.totals.activeSubscriptions ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">+0% last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.totals.revenue !== undefined
              ? `Rp${metrics.totals.revenue.toLocaleString("id-ID")}`
              : "Rp0"}
          </div>
          <p className="text-xs text-muted-foreground">+0% last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Healthy</div>
          <p className="text-xs text-muted-foreground">
            All systems operational
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
