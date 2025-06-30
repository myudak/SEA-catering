"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Percent,
  DollarSign,
  Users,
  Calendar,
  Trash2,
  Copy,
  Tag,
  ArrowLeft,
} from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

interface PromoCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed_amount";
  value: number;
  is_active: boolean;
  usage_count: number;
  usage_limit: number | null;
  created_at: string;
}

export default function PromoCodeClient() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState<{
    code: string;
    discount_type: "percentage" | "fixed_amount";
    value: number;
    is_active: boolean;
    usage_limit: number | null;
  }>({
    code: "",
    discount_type: "percentage",
    value: 0,
    is_active: true,
    usage_limit: null,
  });

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promo-codes");
      const data = await res.json();
      setPromoCodes(data.promo_codes || []);
    } catch {
      toast.error("Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromoCode),
      });
      if (res.ok) {
        toast.success("Promo code created successfully");
        fetchPromoCodes();
        setIsDialogOpen(false);
        setNewPromoCode({
          code: "",
          discount_type: "percentage",
          value: 0,
          is_active: true,
          usage_limit: null,
        });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create promo code");
      }
    } catch {
      toast.error("Failed to create promo code");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Promo code deleted");
        setPromoCodes(promoCodes.filter((code) => code.id !== id));
      } else {
        toast.error("Failed to delete promo code");
      }
    } catch {
      toast.error("Failed to delete promo code");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUsageColor = (usage: number, limit: number | null) => {
    if (!limit) return "text-gray-600 dark:text-gray-400";
    const percentage = (usage / limit) * 100;
    if (percentage >= 90) return "text-red-600 dark:text-red-400";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getDiscountDisplay = (type: string, value: number) => {
    if (type === "percentage") {
      return (
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <Percent className="h-4 w-4" />
          <span className="font-medium">{value}%</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <DollarSign className="h-4 w-4" />
        <span className="font-medium">${value}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading promo codes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-6">
            <TransitionLink
              href="/admin"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </TransitionLink>
          </div>
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Promo Codes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage discount codes and promotions
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Promo Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Promo Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., SUMMER2024"
                      value={newPromoCode.code}
                      onChange={(e) =>
                        setNewPromoCode({
                          ...newPromoCode,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select
                      value={newPromoCode.discount_type}
                      onValueChange={(value: "percentage" | "fixed_amount") =>
                        setNewPromoCode({
                          ...newPromoCode,
                          discount_type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">
                          Fixed Amount
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      {newPromoCode.discount_type === "percentage"
                        ? "Percentage"
                        : "Amount ($)"}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      min="0"
                      max={
                        newPromoCode.discount_type === "percentage"
                          ? "100"
                          : undefined
                      }
                      value={newPromoCode.value}
                      onChange={(e) =>
                        setNewPromoCode({
                          ...newPromoCode,
                          value: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage_limit">Usage Limit</Label>
                    <Input
                      id="usage_limit"
                      type="number"
                      min="1"
                      placeholder="Leave empty for unlimited"
                      onChange={(e) =>
                        setNewPromoCode({
                          ...newPromoCode,
                          usage_limit: Number(e.target.value) || null,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-active"
                      checked={newPromoCode.is_active}
                      onCheckedChange={(checked) =>
                        setNewPromoCode({
                          ...newPromoCode,
                          is_active: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="is-active">Active immediately</Label>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreate}>Create Promo Code</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {promoCodes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Tag className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No promo codes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first promo code to start offering discounts to
              customers.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Code
            </Button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                            {code.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(code.code);
                              toast.success("Code copied to clipboard");
                            }}
                            title="Copy code"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDiscountDisplay(code.discount_type, code.value)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span
                            className={`font-medium ${getUsageColor(
                              code.usage_count,
                              code.usage_limit
                            )}`}
                          >
                            {code.usage_count} / {code.usage_limit || "∞"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={code.is_active ? "default" : "destructive"}
                        >
                          {code.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {formatDate(code.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                              title="Delete promo code"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the promo code{" "}
                                <strong>{code.code}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(code.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
