"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

interface HeaderProps {
  revalidating: boolean;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  revalidateMenu: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function Header({
  revalidating,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  revalidateMenu,
  handleSubmit,
}: HeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <TransitionLink
          href="/admin"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </TransitionLink>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Meal Plans Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your meal plans and pricing
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={revalidateMenu}
          disabled={revalidating}
          variant="outline"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${revalidating ? "animate-spin" : ""}`}
          />
          Revalidate Menu
        </Button>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Meal Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Meal Plan</DialogTitle>
              <DialogDescription>
                Add a new meal plan to your offerings
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields will be passed as children */}
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
