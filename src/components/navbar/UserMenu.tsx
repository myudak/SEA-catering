import { Settings, User, LogOut } from "lucide-react";
import React from "react";
import TransitionLink from "../TransitionLink";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UserMenuProps } from "./types";

const UserMenu = ({
  profile,
  setSignOutDialog,
  signOutDialog,
  isSigningOut,
  handleSignOut,
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
            <User className="h-4 w-4" />
            <span>{profile?.full_name || "User"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <TransitionLink href="/dashboard" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
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

      <Dialog open={signOutDialog} onOpenChange={setSignOutDialog}>
        <DialogContent>
          <DialogTitle>
            <div className="flex items-center space-x-2">
              <LogOut className="h-6 w-6 text-red-600" />
              <span>Sign Out</span>
            </div>
          </DialogTitle>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Sign Out</h3>
            <p className="mb-4">
              Are you sure you want to sign out? You will need to sign in again
              to access your account.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSignOutDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
