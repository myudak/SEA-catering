"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, CreditCard, LogOut, Plus } from "lucide-react";
import { Subscription } from "@/types/subscription";
import SubscriptionCard from "./_components/SubscriptionCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import TransitionLink from "@/components/TransitionLink";

export default function Dashboard() {
  const { user, profile, signOut, loading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);

  // Fetch user's subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.subscriptions || []);
        } else {
          console.error("Failed to fetch subscriptions");
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setSubscriptionsLoading(false);
      }
    };

    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleSubscriptionUpdate = (updatedSubscription: Subscription) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === updatedSubscription.id ? updatedSubscription : sub
      )
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active"
  );
  const pausedSubscriptions = subscriptions.filter(
    (sub) => sub.status === "paused"
  );
  const cancelledSubscriptions = subscriptions.filter(
    (sub) => sub.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.full_name || "User"}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account and subscriptions from your dashboard.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 card-gradient-admin">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={profile?.profile_picture_url || ""}
                  alt={profile?.full_name || "Profile"}
                />
                <AvatarFallback>
                  {getInitials(profile?.full_name || "User")}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.full_name}</div>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                Role: {profile?.role}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeSubscriptions.length}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paused Subscriptions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pausedSubscriptions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Temporarily paused
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Status
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                Account is verified
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Subscriptions
            </h2>
            <TransitionLink href="/subscription">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Subscription
              </Button>
            </TransitionLink>
          </div>

          {subscriptionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">
                Loading subscriptions...
              </p>
            </div>
          ) : subscriptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No subscriptions yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by creating your first meal subscription.
                </p>
                <TransitionLink href="/subscription">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Subscription
                  </Button>
                </TransitionLink>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Subscriptions */}
              {activeSubscriptions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Active Subscriptions ({activeSubscriptions.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeSubscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        onUpdate={handleSubscriptionUpdate}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Paused Subscriptions */}
              {pausedSubscriptions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Paused Subscriptions ({pausedSubscriptions.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pausedSubscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        onUpdate={handleSubscriptionUpdate}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled Subscriptions */}
              {cancelledSubscriptions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Cancelled Subscriptions ({cancelledSubscriptions.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cancelledSubscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        onUpdate={handleSubscriptionUpdate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <TransitionLink href="/subscription">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Subscription
                </Button>
              </TransitionLink>
              <TransitionLink href="/dashboard/edit-profile">
                <Button className="w-full justify-start" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </TransitionLink>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-sm">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <p className="text-sm">{profile?.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Role
                </label>
                <p className="text-sm capitalize">{profile?.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Member Since
                </label>
                <p className="text-sm">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
