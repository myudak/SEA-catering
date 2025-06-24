"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, X, Camera } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function EditProfile() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    profile_picture_url: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        profile_picture_url: profile.profile_picture_url || "",
      });
      setPreviewImage(profile.profile_picture_url || "");
    }
  }, [profile]);

  // Handle image URL change and preview
  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, profile_picture_url: url });
    setPreviewImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          profile_picture_url: formData.profile_picture_url.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");

      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Profile update error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Failed to update profile");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
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

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your profile information and profile picture.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={previewImage || ""}
                      alt={formData.full_name || "Profile"}
                    />
                    <AvatarFallback>
                      {getInitials(formData.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Enter an image URL below to update your profile picture
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    maxLength={50}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Between 2-50 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="profile_picture_url">
                    Profile Picture URL
                  </Label>
                  <Input
                    id="profile_picture_url"
                    type="url"
                    value={formData.profile_picture_url}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/your-image.jpg"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional. Paste a link to your profile picture. Supports
                    image links from imgur, cloudinary, gravatar, etc.
                  </p>
                </div>
              </div>

              {/* Example URLs */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Example image URLs:
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• https://i.imgur.com/example.jpg</li>
                  <li>• https://gravatar.com/avatar/example</li>
                  <li>• https://github.com/username.png</li>
                  <li>• Direct links ending in .jpg, .png, .gif, etc.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={
                    formLoading ||
                    !formData.full_name.trim() ||
                    formData.full_name.trim().length < 2
                  }
                  className="flex-1"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={formLoading}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Current Profile Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Current Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={profile?.profile_picture_url || ""}
                  alt={profile?.full_name || "Profile"}
                />
                <AvatarFallback>
                  {getInitials(profile?.full_name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.full_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
