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

const TestimonialForm = () => {
  const [loading, setLoading] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    customerName: "",
    message: "",
    rating: 5,
  });

  const handleTestimonialSubmit = (e: React.FormEvent) => {
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

    if (testimonialForm.message.trim().length < 10) {
      toast.error(
        "Please provide a more detailed review (at least 10 characters)"
      );
      setLoading(false);
      return;
    }

    // Simulate form submission delay
    setTimeout(() => {
      toast.success(
        "Thank you for your testimonial! It will be reviewed and published soon."
      );

      // Reset form
      setTestimonialForm({
        customerName: "",
        message: "",
        rating: 5,
      });
      setLoading(false);
    }, 1000);
  };

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
            />
          </div>

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
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            disabled={loading}
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
