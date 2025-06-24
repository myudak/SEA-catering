import React from "react";
import { MarqueeTestimonial } from "./MarqueeTestimonial";
import { Testimonial } from "@/types/testimonial";
import { headers } from "next/headers";

const ISR_REVALIDATE = 60; // seconds

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const url = `${protocol}://${host}/api/testimonials`;

    const res = await fetch(url, {
      next: { revalidate: ISR_REVALIDATE },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.testimonials || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

const TestimonialSection = async ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const testimonials = await getTestimonials();

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
        <MarqueeTestimonial testimonials={testimonials} />
        {children}
      </div>
    </section>
  );
};

export { TestimonialSection };
