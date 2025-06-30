import React from "react";
import TransitionLink from "../TransitionLink";
import { Button } from "../ui/button";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  Sheet,
} from "../ui/sheet";
import ThemeToggleButton from "../ui/theme-toggle-button";
import Image from "next/image";
import { NavbarProps } from "./types";
import { LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";

const MobileNavigation = ({
  open,
  setOpen,
  navItems,
  isActive,
  user,
  profile,
  isSigningOut = false,
  setSignOutDialog,
}: NavbarProps) => {
  return (
    <div className="md:hidden">
      <ThemeToggleButton />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center space-x-2">
              <Image
                src={"/favicon2.png"}
                width={32}
                height={32}
                alt="SEA Catering Logo"
                className="h-8 w-8 rounded-full"
              />
              <SheetTitle className="text-xl font-bold">
                <span className="text-green-600">SEA</span> Catering
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="py-6 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TransitionLink
                    funcBeforeTransition={() => setOpen(false)}
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </TransitionLink>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div className="border-t pt-4">
              <div className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </span>
                  <ThemeToggleButton />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="border-t pt-4 mt-auto">
            {user ? (
              <div className="flex flex-col gap-3 w-full">
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b">
                  Signed in as {profile?.full_name || "User"}
                </div>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                    asChild
                  >
                    <TransitionLink href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </TransitionLink>
                  </Button>
                </SheetClose>
                {profile?.role === "admin" && (
                  <SheetClose asChild>
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    size="sm"
                    onClick={() => setSignOutDialog(true)}
                    disabled={isSigningOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </Button>
                </SheetClose>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    asChild
                  >
                    <TransitionLink href="/auth/signin">Sign In</TransitionLink>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="w-full" size="sm" asChild>
                    <TransitionLink href="/auth/signup">Sign Up</TransitionLink>
                  </Button>
                </SheetClose>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
