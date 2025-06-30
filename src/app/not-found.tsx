"use client";
import React, { HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, Leaf, Heart } from "lucide-react";

interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface MotionCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const MotionDiv: React.FC<MotionDivProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`transition-all duration-500 ease-out ${className}`}
    {...props}
  >
    {children}
  </div>
);

const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = "",
  delay = 0,
  ...props
}) => (
  <Card
    className={`transform transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1 ${className}`}
    style={{ animationDelay: `${delay}ms` }}
    {...props}
  >
    {children}
  </Card>
);

export default function NotFoundPage() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-all duration-500 `}
    >
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - 404 Content */}
          <MotionDiv className="text-center lg:text-left">
            <div className="mb-6">
              <h2 className="text-8xl font-bold text-green-600 dark:text-green-400 mb-2 transition-all duration-500 hover:scale-105 cursor-default select-none">
                <span className="inline-block hover:animate-pulse">4</span>
                <span className="inline-block hover:animate-bounce delay-100">
                  0
                </span>
                <span className="inline-block hover:animate-pulse delay-200">
                  4
                </span>
              </h2>
              <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
                Oops! This meal isn&apos;t on our menu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 transition-colors duration-300 leading-relaxed">
                It looks like you&apos;ve wandered off the dining path. The page
                you&apos;re looking for might have been moved, deleted, or never
                existed in the first place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                onClick={handleGoHome}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg transform"
              >
                <Home className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Back to Home
              </Button>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg transform"
              >
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                Go Back
              </Button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <MotionCard
                delay={100}
                className="border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-500 bg-white dark:bg-gray-800 transition-all duration-300 cursor-pointer group hover:shadow-xl"
              >
                <CardContent className="p-4 text-center">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2 group-hover:scale-125 transition-all duration-300" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">
                    Browse Menu
                  </p>
                </CardContent>
              </MotionCard>
              <MotionCard
                delay={200}
                className="border-orange-200 dark:border-orange-700 hover:border-orange-300 dark:hover:border-orange-500 bg-white dark:bg-gray-800 transition-all duration-300 cursor-pointer group hover:shadow-xl"
              >
                <CardContent className="p-4 text-center">
                  <Heart className="h-6 w-6 text-orange-600 dark:text-orange-400 mx-auto mb-2 group-hover:scale-125 transition-all duration-300 group-hover:text-red-500" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">
                    Subscription
                  </p>
                </CardContent>
              </MotionCard>
            </div>
          </MotionDiv>

          {/* Right side - Illustration */}
          <MotionDiv className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl p-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl dark:hover:shadow-green-500/10 transform hover:scale-[1.02]">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400 transition-colors duration-300" />
              </div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer">
                <Heart className="h-4 w-4 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
              </div>

              {/* Empty plate illustration */}
              <div className="text-center">
                <div className="relative mx-auto w-48 h-48 mb-6 group">
                  {/* Plate */}
                  <div className="w-full h-full border-8 border-gray-200 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 shadow-inner relative transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105">
                    {/* Plate rim */}
                    <div className="absolute inset-2 border-2 border-gray-100 dark:border-gray-500 rounded-full transition-colors duration-300"></div>

                    {/* Empty plate message */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-4xl mb-2 hover:scale-125 transition-transform duration-300 cursor-pointer">
                          🍽️
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium transition-colors duration-300">
                          Empty Plate
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating food icons with enhanced animations */}
                  <div className="absolute -top-2 -right-2 animate-bounce hover:animate-spin transition-all duration-300 cursor-pointer">
                    <div className="bg-green-100 dark:bg-green-900/40 rounded-full p-2 hover:scale-125 transition-transform duration-300">
                      <span className="text-lg hover:scale-110 inline-block transition-transform duration-300">
                        🥗
                      </span>
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-2 -left-2 animate-bounce hover:animate-spin transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="bg-orange-100 dark:bg-orange-900/40 rounded-full p-2 hover:scale-125 transition-transform duration-300">
                      <span className="text-lg hover:scale-110 inline-block transition-transform duration-300">
                        🍎
                      </span>
                    </div>
                  </div>
                  <div
                    className="absolute top-8 -left-4 animate-bounce hover:animate-spin transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-full p-2 hover:scale-125 transition-transform duration-300">
                      <span className="text-lg hover:scale-110 inline-block transition-transform duration-300">
                        🥑
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-300 hover:text-green-600 dark:hover:text-green-400">
                  Let&apos;s fill this plate!
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300 leading-relaxed">
                  Explore our delicious and nutritious meal plans designed just
                  for you.
                </p>
              </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute -z-10 inset-0 overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-green-300/20 dark:bg-green-400/20 rounded-full animate-pulse`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </MotionDiv>
        </div>

        {/* Footer */}
        <MotionDiv className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
            Need help? Contact our manager Brian at{" "}
            <a
              href="tel:08123456789"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline font-medium transition-all duration-300 hover:scale-105 inline-block"
            >
              08123456789
            </a>
          </p>
        </MotionDiv>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
