"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/types/subscription";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Utensils,
  AlertTriangle,
  Pause,
  Play,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface SubscriptionCardProps {
  subscription: Subscription;
  onUpdate: (updatedSubscription: Subscription) => void;
}

export default function SubscriptionCard({
  subscription,
  onUpdate,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const handlePause = async () => {
    const startDate = prompt("Enter pause start date (YYYY-MM-DD):");
    const endDate = prompt("Enter pause end date (YYYY-MM-DD):");

    if (!startDate || !endDate) {
      toast.error("Please provide both start and end dates");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "paused",
          pause_start_date: startDate,
          pause_end_date: endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to pause subscription");
      }

      toast.success("Subscription paused successfully");
      onUpdate(data.subscription);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Pause error:", error);
      } else {
        console.error("Unknwon error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "active",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resume subscription");
      }

      toast.success("Subscription resumed successfully");
      onUpdate(data.subscription);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Pause error:", error);
      } else {
        console.error("Unknwon error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this subscription? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast.success("Subscription cancelled successfully");
      onUpdate(data.subscription);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Pause error:", error);
      } else {
        console.error("Unknwon error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">
            {subscription.meal_plan?.name || "Unknown Plan"}
          </CardTitle>
          {getStatusBadge(subscription.status)}
        </div>
        <p className="text-2xl font-bold text-green-600">
          {formatPrice(subscription.total_price)}/month
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{subscription.customer_name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{subscription.phone_number}</span>
          </div>
        </div>

        {/* Meal Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Utensils className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Meal Types:</span>
            <span className="text-sm">
              {subscription.meal_types.join(", ")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Delivery Days:</span>
            <span className="text-sm">
              {subscription.delivery_days.join(", ")}
            </span>
          </div>
        </div>

        {/* Allergies */}
        {subscription.allergies && (
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
            <div>
              <span className="text-sm font-medium">Allergies:</span>
              <p className="text-sm text-gray-600">{subscription.allergies}</p>
            </div>
          </div>
        )}

        {/* Billing Info */}
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Next Billing:</span>
          <span className="text-sm">
            {formatDate(subscription.next_billing_date)}
          </span>
        </div>

        {/* Pause Info */}
        {subscription.status === "paused" &&
          subscription.pause_start_date &&
          subscription.pause_end_date && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                Paused from {formatDate(subscription.pause_start_date)} to{" "}
                {formatDate(subscription.pause_end_date)}
              </p>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          {subscription.status === "active" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePause}
                disabled={loading}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          {subscription.status === "paused" && (
            <Button
              variant="default"
              size="sm"
              onClick={handleResume}
              disabled={loading}
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
