import React from "react";
import { MarqueeTestimonial } from "./MarqueeTestimonial";

const TestimonialSection = ({ children }: { children?: React.ReactNode }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our{" "}
            <span className="text-green-600 dark:text-green-400">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real experiences from our satisfied customers across Indonesia
          </p>
        </div>

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(testimonial.created_at)}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    &quot;{testimonial.message}&quot;
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.customer_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {testimonials.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No testimonials yet. Be the first to share your experience!
              </p>
            </div>
          )} */}
        <MarqueeTestimonial />
        {children}
      </div>
    </section>
  );
};

export { TestimonialSection };
