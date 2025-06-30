/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Star } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import TransitionLink from "@/components/TransitionLink";

const TestimonialForm = () => {
  const { user, profile, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    customerName: profile?.full_name || "",
    email: "",
    message: "",
    rating: 5,
  });

  // Update name if profile changes
  React.useEffect(() => {
    if (profile?.full_name && user) {
      setTestimonialForm((prev) => ({
        ...prev,
        customerName: profile.full_name,
      }));
    }
  }, [profile, user]);

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (
      !testimonialForm.customerName.trim() ||
      !testimonialForm.message.trim()
    ) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (testimonialForm.customerName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    if (testimonialForm.message.trim().length < 10) {
      toast.error(
        "Please provide a more detailed review (at least 10 characters)"
      );
      setLoading(false);
      return;
    }

    if (testimonialForm.rating < 1 || testimonialForm.rating > 5) {
      toast.error("Rating must be between 1 and 5");
      setLoading(false);
      return;
    }

    // If public, validate email if provided
    if (!user && testimonialForm.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(testimonialForm.email.trim())) {
        toast.error("Please provide a valid email address");
        setLoading(false);
        return;
      }
    }

    // Prepare data for API
    const payload: any = {
      customer_name: testimonialForm.customerName.trim(),
      email: user ? null : testimonialForm.email.trim() || null,
      message: testimonialForm.message.trim(),
      rating: testimonialForm.rating,
      profile_picture_url: user ? profile?.profile_picture_url || null : null,
      is_authenticated: !!user,
    };

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Testimonial submission error:", data);
        throw new Error(data.error || "Failed to submit testimonial");
      }

      toast.success(data.message || "Thank you for your testimonial!");

      // Reset form
      setTestimonialForm({
        customerName: user ? profile?.full_name || "" : "",
        email: "",
        message: "",
        rating: 5,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Testimonial submission error:", error.message);
        toast.error(error.message || "Failed to submit testimonial");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = !!user;

  return (
    <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center text-gray-900 dark:text-white">
          <MessageSquare className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
          Share Your Experience
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Tell us about your experience with SEA Catering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
          {/* Auth status and profile picture */}
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  isLoggedIn ? profile?.profile_picture_url || undefined : ""
                }
                alt={testimonialForm.customerName || "Profile"}
              />
              <AvatarFallback>
                {getInitials(testimonialForm.customerName || "Guest")}
              </AvatarFallback>
            </Avatar>

            <div>
              {isLoggedIn ? (
                <span className="text-green-700 dark:text-green-300 text-sm">
                  Signed in as <b>{profile?.full_name}</b>
                </span>
              ) : (
                <span className="text-blue-700 dark:text-blue-300 text-sm">
                  Public submission.{" "}
                  <TransitionLink
                    href="/auth/signin"
                    className="underline hover:text-blue-900"
                  >
                    Sign in for a better experience!
                  </TransitionLink>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Your Name *</Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Enter your name"
              value={testimonialForm.customerName}
              onChange={(e) =>
                setTestimonialForm({
                  ...testimonialForm,
                  customerName: e.target.value,
                })
              }
              required
              disabled={authLoading}
            />
          </div>

          {!isLoggedIn && (
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={testimonialForm.email}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    email: e.target.value,
                  })
                }
                disabled={authLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We will never share your email. Used for verification only.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rating">Rating *</Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setTestimonialForm({
                      ...testimonialForm,
                      rating: star,
                    })
                  }
                  className="focus:outline-none"
                  disabled={authLoading}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= testimonialForm.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                ({testimonialForm.rating} star
                {testimonialForm.rating !== 1 ? "s" : ""})
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Review *</Label>
            <Textarea
              id="message"
              placeholder="Share your experience with SEA Catering..."
              value={testimonialForm.message}
              onChange={(e) =>
                setTestimonialForm({
                  ...testimonialForm,
                  message: e.target.value,
                })
              }
              rows={4}
              required
              disabled={authLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            disabled={loading || authLoading}
          >
            {loading ? "Submitting..." : "Submit Testimonial"}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Your testimonial will be reviewed before being published
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export { TestimonialForm };
