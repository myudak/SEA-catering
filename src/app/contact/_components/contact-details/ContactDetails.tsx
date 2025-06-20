import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Phone, User, Clock, MapPin } from "lucide-react";
import React from "react";

const ContactDetails = () => {
  return (
    <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center text-gray-900 dark:text-white">
          <Phone className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
          Contact Information
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Reach out to us for any questions or support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Manager
              </h3>
              <p className="text-gray-700 dark:text-gray-200 text-lg">Brian</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available to help with all your meal planning needs
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Phone Number
              </h3>
              <p className="text-gray-700 dark:text-gray-200 text-lg font-mono">
                08123456789
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Call or WhatsApp us anytime
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Business Hours
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Monday - Sunday
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                8:00 AM - 10:00 PM
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We&apos;re here when you need us
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Service Area
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                All Major Cities in Indonesia
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jakarta, Surabaya, Medan, Makassar, and more
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-6 border-t dark:border-gray-600">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white w-full"
            asChild
          >
            <a href="tel:08123456789">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ContactDetails };
