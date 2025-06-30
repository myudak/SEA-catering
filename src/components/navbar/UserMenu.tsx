/* eslint-disable @next/next/no-img-element */
import {
  Settings,
  User,
  LogOut,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import React from "react";
import TransitionLink from "../TransitionLink";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserMenuProps } from "./types";

const UserMenu = ({
  profile,
  setSignOutDialog,
  isSigningOut,
}: UserMenuProps) => {
  return (
    <>
      {profile?.role === "admin" && (
        <TransitionLink animationType="loadingTopBar" href="/admin">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </TransitionLink>
      )}
      <TransitionLink animationType="loadingTopBar" href="/dashboard">
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </TransitionLink>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            {profile?.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt={profile.full_name || "User Profile"}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <User className="h-6 w-6 text-gray-500" />
            )}
            <span>{profile?.full_name || "User"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <TransitionLink href="/dashboard" className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TransitionLink>
          </DropdownMenuItem>
          {profile?.role === "admin" && (
            <DropdownMenuItem asChild>
              <TransitionLink href="/admin" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </TransitionLink>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <TransitionLink
              href="/dashboard/edit-profile"
              className="flex items-center"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Edit Profile
            </TransitionLink>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSignOutDialog(true)}
            className="flex items-center"
            disabled={isSigningOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMenu;
