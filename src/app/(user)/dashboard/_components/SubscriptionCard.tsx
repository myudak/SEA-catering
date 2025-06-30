"use client";

import React, { useState } from "react";
import { DateRangePicker } from "@/components/DataRangePicker/";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

interface SubscriptionCardProps {
  subscription: Subscription;
  onUpdate: (updatedSubscription: Subscription) => void;
}

export default function SubscriptionCard({
  subscription,
  onUpdate,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const [isDialogCancelOpen, setIsDialogCancelOpen] = useState(false);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [pauseRange, setPauseRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

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
    if (!pauseRange.start || !pauseRange.end) {
      toast.error("Please select both start and end dates");
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
          pause_start_date: pauseRange.start.toISOString().slice(0, 10),
          pause_end_date: pauseRange.end.toISOString().slice(0, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to pause subscription");
      }

      toast.success("Subscription paused successfully");
      onUpdate(data.subscription);
      setIsPauseDialogOpen(false);
      setPauseRange({ start: null, end: null });
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
    <>
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
                <p className="text-sm text-gray-600">
                  {subscription.allergies}
                </p>
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
                  onClick={() => setIsPauseDialogOpen(true)}
                  disabled={loading}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDialogCancelOpen(true)}
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

      <Dialog open={isDialogCancelOpen} onOpenChange={setIsDialogCancelOpen}>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold mb-4">
            Cancel Subscription
          </DialogTitle>
          {/* Are you sure you want to cancel subscription */}
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to cancel this subscription?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. All associated data will be lost.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={loading}
              >
                Yes, Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogCancelOpen(false);
                }}
              >
                No, Go Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold mb-4">
            Pause Subscription
          </DialogTitle>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select the date range for pausing this subscription.
            </p>
            {/* DateRangePicker expects value and onChange */}
            <DateRangePicker
              selected={
                pauseRange.start && pauseRange.end
                  ? { from: pauseRange.start, to: pauseRange.end }
                  : undefined
              }
              onSelect={(range) => {
                setPauseRange({
                  start: range?.from ?? null,
                  end: range?.to ?? null,
                });
              }}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsPauseDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handlePause}
                disabled={loading}
              >
                Confirm Pause
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
