"use client";

import React, { useEffect, useState } from "react";
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionStatusUpdate,
} from "@/types/subscription";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DateRangePicker } from "@/app/(user)/admin/_components/DateRangePicker";
import type { DateRange } from "react-day-picker";
import {
  User,
  Phone,
  Calendar,
  Play,
  Pause,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ArrowLeft,
} from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

export default function SubscriptionClient() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [ranges, setRanges] = useState<Record<string, DateRange | undefined>>(
    {}
  );

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscriptions");
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const updateStatus = async (
    id: string,
    status: SubscriptionStatus,
    range?: DateRange
  ) => {
    const body: Partial<SubscriptionStatusUpdate> = { status };
    if (status === "paused") {
      if (!range?.from || !range.to) {
        toast.error("Please select pause start and end dates");
        return;
      }
      body.pause_start_date = range.from.toISOString();
      body.pause_end_date = range.to.toISOString();
    }
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Subscription updated");
        fetchSubscriptions();
      } else {
        toast.error(result.error || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Error updating subscription");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/70"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "paused":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
          >
            <Clock className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/70"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSubscriptionStats = () => {
    const active = subscriptions.filter(
      (sub) => sub.status === "active"
    ).length;
    const paused = subscriptions.filter(
      (sub) => sub.status === "paused"
    ).length;
    const cancelled = subscriptions.filter(
      (sub) => sub.status === "cancelled"
    ).length;
    return { active, paused, cancelled, total: subscriptions.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-9 w-16" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = getSubscriptionStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <TransitionLink animationType="loadingTopBar" href={"/admin"}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </TransitionLink>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Subscription Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage customer subscriptions and billing status
            </p>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {stats.active}
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Paused
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                {stats.paused}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                {stats.cancelled}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {stats.total}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2" />
              All Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-semibold dark:text-gray-200">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Customer
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold dark:text-gray-200">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold dark:text-gray-200">
                      Plan
                    </TableHead>
                    <TableHead className="font-semibold dark:text-gray-200">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold dark:text-gray-200">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Next Billing
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold dark:text-gray-200">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow
                      key={sub.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="font-medium dark:text-gray-200">
                        {sub.customer_name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {sub.phone_number}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal dark:border-gray-600 dark:text-gray-300"
                        >
                          {sub.meal_plan?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {new Date(sub.next_billing_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          {sub.status === "active" && (
                            <>
                              <DateRangePicker
                                selected={ranges[sub.id]}
                                onSelect={(r) =>
                                  setRanges((prev) => ({
                                    ...prev,
                                    [sub.id]: r,
                                  }))
                                }
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-yellow-700 border-yellow-300 hover:bg-yellow-50 dark:text-yellow-300 dark:border-yellow-600 dark:hover:bg-yellow-950/30"
                                onClick={() =>
                                  updateStatus(sub.id, "paused", ranges[sub.id])
                                }
                              >
                                <Pause className="w-3 h-3 mr-1" />
                                Pause
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="hover:bg-red-600 dark:hover:bg-red-700"
                                onClick={() =>
                                  updateStatus(sub.id, "cancelled")
                                }
                              >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          {sub.status === "paused" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                                onClick={() => updateStatus(sub.id, "active")}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Resume
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="hover:bg-red-600 dark:hover:bg-red-700"
                                onClick={() =>
                                  updateStatus(sub.id, "cancelled")
                                }
                              >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          {sub.status === "cancelled" && (
                            <span className="text-gray-400 dark:text-gray-500 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                              No actions available
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
