import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, ChefHat, MapPin, Clock, Heart } from "lucide-react";
import React from "react";

const JourneySection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Our Journey to{" "}
              <span className="text-green-600 dark:text-green-400">
                Healthy Living
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              What started as a passion project has evolved into
              Indonesia&apos;s leading healthy meal delivery service. We&apos;ve
              gone viral not just because of our delicious food, but because we
              truly care about making nutritious eating accessible to everyone.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              From bustling Jakarta to the beautiful islands of Bali, we&apos;re
              bringing fresh, customizable, and nutritionally balanced meals to
              families across Indonesia. Every meal is crafted with love and
              delivered with care.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-1" />
                <span className="font-semibold text-foreground">
                  4.9/5 Rating
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-1" />
                <span className="font-semibold text-foreground">
                  50,000+ Happy Customers
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 border-green-300 dark:border-green-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <ChefHat className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-foreground mb-2">
                  500+
                </h3>
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Meal Options
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-300 dark:border-orange-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-foreground mb-2">25+</h3>
                <p className="text-orange-700 dark:text-orange-300 font-medium">
                  Cities Served
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-300 dark:border-blue-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-foreground mb-2">24h</h3>
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  Delivery Window
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-300 dark:border-purple-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-foreground mb-2">
                  100%
                </h3>
                <p className="text-purple-700 dark:text-purple-300 font-medium">
                  Fresh Ingredients
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export { JourneySection };
