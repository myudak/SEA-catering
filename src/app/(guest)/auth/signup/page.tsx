"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  // Password validation criteria
  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Input validation
      if (!fullName || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Password strength validation
      if (!isPasswordValid) {
        toast.error(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        );
        setLoading(false);
        return;
      }

      // Password confirmation
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      // Sanitize inputs (React handles XSS protection by default)
      const sanitizedEmail = email.trim();
      const sanitizedFullName = fullName.trim();

      const { error } = await signUp(
        sanitizedEmail,
        password,
        sanitizedFullName
      );

      if (error) {
        toast.error(error.message || "Failed to sign up");
      } else {
        toast.success("Account created successfully! You can now sign in.");
        router.push("/auth/signin");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div
      className={`flex items-center space-x-2 text-sm ${
        met ? "text-green-600" : "text-gray-500"
      }`}
    >
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join SEA Catering today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <CriteriaItem
                    met={passwordCriteria.length}
                    text="At least 8 characters"
                  />
                  <CriteriaItem
                    met={passwordCriteria.uppercase}
                    text="One uppercase letter"
                  />
                  <CriteriaItem
                    met={passwordCriteria.lowercase}
                    text="One lowercase letter"
                  />
                  <CriteriaItem
                    met={passwordCriteria.number}
                    text="One number"
                  />
                  <CriteriaItem
                    met={passwordCriteria.special}
                    text="One special character (@$!%*?&)"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-1">
                  <CriteriaItem
                    met={password === confirmPassword && password.length > 0}
                    text="Passwords match"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                loading || !isPasswordValid || password !== confirmPassword
              }
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-green-600 hover:text-green-500 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
