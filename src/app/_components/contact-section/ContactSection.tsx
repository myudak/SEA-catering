import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, Utensils } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";

export function ContactSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to Start Your{" "}
          <span className="text-green-600">Healthy Journey</span>?
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          Join thousands of satisfied customers across Indonesia who have
          transformed their eating habits with SEA Catering.
        </p>

        <Card className="bg-gradient-to-r from-green-50 to-orange-50 border-green-200 shadow-lg">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Have questions about our meal plans or delivery areas? Our
                  team is here to help you find the perfect healthy eating
                  solution for your lifestyle.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manager</p>
                      <p className="text-gray-700">Brian</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Phone Number
                      </p>
                      <p className="text-gray-700">08123456789</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-block p-6 bg-white rounded-full shadow-md mb-6">
                  <Utensils className="h-16 w-16 text-green-600" />
                </div>
                <AnimatedButton />
                <p className="text-sm text-gray-500 mt-4">
                  Available 7 days a week, 8 AM - 10 PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
