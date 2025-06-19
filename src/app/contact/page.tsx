/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/contexts/AuthContext';
// import { sanitizeInput } from '@/lib/auth';
import { toast } from "sonner";
import {
  Phone,
  User,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  Heart,
} from "lucide-react";

interface Testimonial {
  id: string;
  customer_name: string;
  message: string;
  rating: number;
  created_at: string;
}

const ContactPage = () => {
  // Mock testimonial data
  const mockTestimonials: Testimonial[] = [
    {
      id: "1",
      customer_name: "Sarah Johnson",
      message:
        "SEA Catering has completely transformed my eating habits! The meals are delicious, nutritious, and perfectly portioned. I've lost 5kg in just 2 months!",
      rating: 5,
      created_at: "2024-12-01T10:30:00Z",
    },
    {
      id: "2",
      customer_name: "Ahmad Rahman",
      message:
        "Fantastic service and amazing food quality. The delivery is always on time and the packaging keeps everything fresh. Highly recommended!",
      rating: 5,
      created_at: "2024-11-28T14:15:00Z",
    },
    {
      id: "3",
      customer_name: "Maria Santos",
      message:
        "I love the variety of meals offered. Every day is a new culinary adventure, and I never get bored with the menu options.",
      rating: 4,
      created_at: "2024-11-25T09:45:00Z",
    },
    {
      id: "4",
      customer_name: "David Chen",
      message:
        "Great value for money! The portion sizes are perfect and the ingredients are always fresh. My family loves the family meal plans.",
      rating: 5,
      created_at: "2024-11-22T16:20:00Z",
    },
    {
      id: "5",
      customer_name: "Lisa Anderson",
      message:
        "Professional service and excellent customer support. Brian is always helpful and responsive to any questions or concerns.",
      rating: 4,
      created_at: "2024-11-20T11:10:00Z",
    },
    {
      id: "6",
      customer_name: "Rudi Hartono",
      message:
        "The best catering service in Jakarta! Clean, healthy, and tasty meals delivered right to my office every day.",
      rating: 5,
      created_at: "2024-11-18T13:30:00Z",
    },
  ];

  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(mockTestimonials);
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 px-4 py-2 text-sm font-medium">
              📞 Get in Touch
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Contact{" "}
            <span className="text-green-600 dark:text-green-400">
              SEA Catering
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions about our meal plans or need assistance? We&apos;re
            here to help you start your healthy eating journey.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Details */}
            <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-gray-900 dark:text-white">
                  <Phone className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                  Contact Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Reach out to us for any questions or support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Manager
                      </h3>
                      <p className="text-gray-700 dark:text-gray-200 text-lg">
                        Brian
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available to help with all your meal planning needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Phone Number
                      </h3>
                      <p className="text-gray-700 dark:text-gray-200 text-lg font-mono">
                        08123456789
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Call or WhatsApp us anytime
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Business Hours
                      </h3>
                      <p className="text-gray-700 dark:text-gray-200">
                        Monday - Sunday
                      </p>
                      <p className="text-gray-700 dark:text-gray-200">
                        8:00 AM - 10:00 PM
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We&apos;re here when you need us
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Service Area
                      </h3>
                      <p className="text-gray-700 dark:text-gray-200">
                        All Major Cities in Indonesia
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Jakarta, Surabaya, Medan, Makassar, and more
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-6 border-t dark:border-gray-600">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    asChild
                  >
                    <a href="tel:08123456789">
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Form */}
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
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
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
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our{" "}
              <span className="text-green-600 dark:text-green-400">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real experiences from our satisfied customers across Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(testimonial.created_at)}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    &quot;{testimonial.message}&quot;
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.customer_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {testimonials.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No testimonials yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
