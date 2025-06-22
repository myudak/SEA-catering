"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  Home,
  UtensilsCrossed,
  CreditCard,
  Phone,
} from "lucide-react";
import ThemeToggleButton from "../ui/theme-toggle-button";
import Image from "next/image";
import TransitionLink from "../TransitionLink";
import { navItemType } from "./types";
import MobileNavigation from "./MobileNavigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

const Navbar = () => {
  const [signOutDialog, setSignOutDialog] = React.useState(false);
  const [mobileNavSheet, setMobileNavSheet] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  const navItems: navItemType = [
    { href: "/", label: "Home", icon: Home },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/subscription", label: "Subscription", icon: CreditCard },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    console.log("Navbar - Starting sign out...");

    try {
      await signOut();
      console.log("Navbar - Sign out successful");
      toast.success("Signed out successfully");
      setMobileNavSheet(false);

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Navbar - Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="shadow-md sticky top-0 z-50 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <TransitionLink href="/" className="flex items-center space-x-2">
            {/* <UtensilsCrossed className="h-8 w-8 text-green-600" /> */}
            <Image
              src={"/favicon2.png"}
              width={32}
              height={32}
              alt="SEA Catering Logo"
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-2xl font-bold">
              <span className="text-green-600">SEA</span> Catering
            </span>
          </TransitionLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-sm"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </TransitionLink>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggleButton />
            {user ? (
              <>
                {profile?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
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
                      <Link href="/dashboard" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {profile?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
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
                      <h3 className="text-lg font-semibold mb-4">
                        Confirm Sign Out
                      </h3>
                      <p className="mb-4">
                        Are you sure you want to sign out? You will need to sign
                        in again to access your account.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setSignOutDialog(false)}
                        >
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
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <MobileNavigation
            navItems={navItems}
            isActive={isActive}
            user={user}
            profile={profile}
            handleSignOut={handleSignOut}
            isSigningOut={isSigningOut}
            open={mobileNavSheet}
            setOpen={setMobileNavSheet}
          />
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
