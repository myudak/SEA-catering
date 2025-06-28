"use client";

import React, { useEffect, useState } from "react";
import { Testimonial, TestimonialStatus } from "@/types/testimonial";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Calendar,
  User,
  MessageSquare,
  Filter,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

export default function TestimonialClient() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    testimonialId: string;
    currentStatus: TestimonialStatus;
    newStatus: TestimonialStatus;
    customerName: string;
  }>({
    isOpen: false,
    testimonialId: "",
    currentStatus: "pending",
    newStatus: "pending",
    customerName: "",
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusChange = async (id: string, status: TestimonialStatus) => {
    const testimonial = testimonials.find((t) => t.id === id);
    if (!testimonial) return;

    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      testimonialId: id,
      currentStatus: testimonial.status,
      newStatus: status,
      customerName: testimonial.customer_name,
    });
  };

  const confirmStatusChange = async () => {
    const { testimonialId, newStatus } = confirmDialog;

    try {
      const res = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Testimonial status updated");
        fetchTestimonials();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const getStatusBadgeVariant = (status: TestimonialStatus) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: TestimonialStatus) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "rejected":
        return "text-white bg-red-600 border-red-700";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating}/5
        </span>
      </div>
    );
  };

  const getConfirmationDetails = () => {
    const { newStatus, customerName } = confirmDialog;

    switch (newStatus) {
      case "approved":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          title: "Approve Testimonial",
          description: `Are you sure you want to approve ${customerName}'s testimonial? This will make it visible to the public.`,
          actionText: "Approve",
          actionClass: "bg-green-600 hover:bg-green-700 text-white",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          title: "Reject Testimonial",
          description: `Are you sure you want to reject ${customerName}'s testimonial? This action will hide it from the public.`,
          actionText: "Reject",
          actionClass: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "pending":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          title: "Set to Pending",
          description: `Are you sure you want to set ${customerName}'s testimonial back to pending review?`,
          actionText: "Set Pending",
          actionClass: "bg-amber-600 hover:bg-amber-700 text-white",
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-gray-600" />,
          title: "Change Status",
          description: `Are you sure you want to change ${customerName}'s testimonial status?`,
          actionText: "Confirm",
          actionClass: "bg-gray-600 hover:bg-gray-700 text-white",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Loading testimonials...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalTestimonials = testimonials.length;
  const approvedCount = testimonials.filter(
    (t: Testimonial) => t.status === "approved"
  ).length;
  const pendingCount = testimonials.filter(
    (t: Testimonial) => t.status === "pending"
  ).length;
  const rejectedCount = testimonials.filter(
    (t: Testimonial) => t.status === "rejected"
  ).length;
  const confirmDetails = getConfirmationDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <TransitionLink
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </TransitionLink>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Testimonial Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Review and manage customer testimonials
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalTestimonials}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {approvedCount}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <Filter className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {rejectedCount}
                    </p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Table Card */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 overflow-hidden py-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray- pt-6">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Rating
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((t, index) => (
                    <TableRow
                      key={t.id}
                      className={`
                        transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700
                        ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-25 dark:bg-gray-800/50"
                        }
                      `}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {t.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {t.customer_name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {renderStars(t.rating)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="max-w-sm">
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {t.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={getStatusBadgeVariant(t.status)}
                          className={`px-3 py-1 font-medium capitalize border ${getStatusColor(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(t.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Select
                          value={t.status}
                          onValueChange={(value: TestimonialStatus) =>
                            handleStatusChange(t.id, value)
                          }
                        >
                          <SelectTrigger className="w-[130px] border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Set Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                            <SelectItem
                              value="pending"
                              className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="approved"
                              className="hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Approved
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="rejected"
                              className="hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Rejected
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {testimonials.length === 0 && (
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 mt-8">
            <CardContent className="py-12">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No testimonials yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Customer testimonials will appear here once they start coming
                  in.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                {confirmDetails.icon}
                {confirmDetails.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
                {confirmDetails.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStatusChange}
                className={confirmDetails.actionClass}
              >
                {confirmDetails.actionText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
