"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
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
import { useTransitionRouter } from "next-view-transitions";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  const pathname = usePathname();
  //   const { user, profile, signOut } = useAuth();
  const user = null; // Replace with actual user state
  const profile = { full_name: "John Doe", role: "admin" }; // Replace with actual profile state
  const signOut = async () => {
    // Replace with actual sign out logic
    console.log("User signed out");
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/subscription", label: "Subscription", icon: CreditCard },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const router = useTransitionRouter();

  const slideInOut = () => {
    document.documentElement.classList.add("enable-view-transition");

    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    // Remove the class after the transition is complete
    setTimeout(() => {
      document.documentElement.classList.remove("enable-view-transition");
    }, 1100);
    // document.documentElement.classList.remove("enable-view-transition");
  };

  return (
    <nav className="shadow-md sticky top-0 z-50 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.href, {
                      onTransitionReady: slideInOut,
                    });
                  }}
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
                </Link>
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
                      onClick={handleSignOut}
                      className="flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

          {/* Mobile Sheet Navigation */}
          <div className="md:hidden">
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
                        <Link
                          key={item.href}
                          onClick={(e) => {
                            setOpen(false);
                            e.preventDefault();
                            router.push(item.href, {
                              onTransitionReady: slideInOut,
                            });
                          }}
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
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
                    <div className="space-y-3 w-full">
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b">
                        Signed in as {profile?.full_name || "User"}
                      </div>
                      <SheetClose asChild>
                        <Link href="/dashboard">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            size="sm"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
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
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="space-y-3 w-full">
                      <SheetClose asChild>
                        <Link href="/auth/signin">
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                          >
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/auth/signup">
                          <Button className="w-full" size="sm">
                            Sign Up
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
