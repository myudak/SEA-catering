"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MealPlan } from "@/types/meal-plan";
import { Save, X } from "lucide-react";

interface DialogsProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setEditingPlan: (plan: MealPlan | null) => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  formData: Partial<MealPlan>;
  setFormData: (data: Partial<MealPlan>) => void;
  newFeature: string;
  setNewFeature: (feature: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
}

export default function Dialogs({
  isEditDialogOpen,
  setIsEditDialogOpen,
  setEditingPlan,
  resetForm,
  handleSubmit,
  formData,
  setFormData,
  newFeature,
  setNewFeature,
  addFeature,
  removeFeature,
}: DialogsProps) {
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Meal Plan</DialogTitle>
          <DialogDescription>Update the meal plan details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Plan Name</Label>
              <Input
                id="edit-name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price (IDR)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-image_url">Image URL (optional)</Label>
            <Input
              id="edit-image_url"
              type="url"
              value={formData.image_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
            />
          </div>

          {/* Display Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-badge_text">Badge Text</Label>
              <Input
                id="edit-badge_text"
                value={formData.badge_text || ""}
                placeholder="e.g., Most Popular"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    badge_text: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-color_scheme">Color Scheme</Label>
              <Select
                value={formData.color_scheme || "gray"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    color_scheme: value,
                  })
                }
              >
                <SelectTrigger id="edit-color_scheme">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-icon_emoji">Icon Emoji</Label>
              <Input
                id="edit-icon_emoji"
                value={formData.icon_emoji || ""}
                placeholder="e.g., 🥗"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    icon_emoji: e.target.value,
                  })
                }
              />
            </div>
            <div></div>
          </div>

          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
              />
              <Button type="button" onClick={addFeature}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feature: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {feature}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFeature(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingPlan(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Update Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
