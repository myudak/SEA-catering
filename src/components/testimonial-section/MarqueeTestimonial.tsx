import { cn, getInitials } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Star } from "lucide-react";
import React from "react";
import { Testimonial } from "@/types/testimonial";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ReviewCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-green-200 bg-green-50/50 hover:bg-green-100/50",
        // dark styles
        "dark:border-green-800/50 dark:bg-green-900/20 dark:hover:bg-green-900/30"
      )}
    >
      <div className="flex flex-row items-center gap-2 mb-2">
        <Avatar>
          <AvatarImage
            className="object-cover"
            alt={testimonial.customer_name}
            src={testimonial.profile_picture_url || ""}
          />
          <AvatarFallback>
            {getInitials(testimonial.customer_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900 dark:text-white">
            {testimonial.customer_name}
          </figcaption>
          <p className="text-xs font-medium text-green-600 dark:text-green-400">
            {testimonial.is_authenticated ? "Verified Customer" : "Customer"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {renderStars(testimonial.rating)}
      </div>

      <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;{testimonial.message}&quot;
      </blockquote>
    </figure>
  );
};

export function MarqueeTestimonial({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-300">
        No testimonials yet. Be the first to share your experience!
      </div>
    );
  }

  // Split testimonials for two rows
  const half = Math.ceil(testimonials.length / 2);
  const firstRow = testimonials.slice(0, half);
  const secondRow = testimonials.slice(half);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((testimonial) => (
          <ReviewCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((testimonial) => (
          <ReviewCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#f8f6f4] dark:from-[#060a16]"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#f8f6f4] dark:from-[#060a16]"></div>
    </div>
  );
}
