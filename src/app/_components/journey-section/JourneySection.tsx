import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, ChefHat, MapPin, Clock, Heart } from "lucide-react";
import React from "react";

const JourneySection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Journey to{" "}
              <span className="text-green-600">Healthy Living</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              What started as a passion project has evolved into
              Indonesia&apos;s leading healthy meal delivery service. We&apos;ve
              gone viral not just because of our delicious food, but because we
              truly care about making nutritious eating accessible to everyone.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From bustling Jakarta to the beautiful islands of Bali, we&apos;re
              bringing fresh, customizable, and nutritionally balanced meals to
              families across Indonesia. Every meal is crafted with love and
              delivered with care.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-semibold text-gray-900">
                  4.9/5 Rating
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                <span className="font-semibold text-gray-900">
                  50,000+ Happy Customers
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-300">
              <CardContent className="p-6 text-center">
                <ChefHat className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900 mb-2">500+</h3>
                <p className="text-green-700 font-medium">Meal Options</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900 mb-2">25+</h3>
                <p className="text-orange-700 font-medium">Cities Served</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900 mb-2">24h</h3>
                <p className="text-blue-700 font-medium">Delivery Window</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900 mb-2">100%</h3>
                <p className="text-purple-700 font-medium">Fresh Ingredients</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export { JourneySection };
