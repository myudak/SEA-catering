/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Johnson",
    username: "Verified Customer",
    body: "SEA Catering has completely transformed my eating habits! The meals are delicious, nutritious, and perfectly portioned. I've lost 5kg in just 2 months!",
    img: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=150&h=150&fit=crop&auto=format",
    rating: 5,
  },
  {
    name: "Ahmad Rahman",
    username: "Verified Customer",
    body: "Fantastic service and amazing food quality. The delivery is always on time and the packaging keeps everything fresh. Highly recommended!",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    rating: 5,
  },
  {
    name: "Maria Santos",
    username: "Verified Customer",
    body: "I love the variety of meals offered. Every day is a new culinary adventure, and I never get bored with the menu options.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format",
    rating: 4,
  },
  {
    name: "David Chen",
    username: "Verified Customer",
    body: "Great value for money! The portion sizes are perfect and the ingredients are always fresh. My family loves the family meal plans.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    username: "Verified Customer",
    body: "Professional service and excellent customer support. Brian is always helpful and responsive to any questions or concerns.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&auto=format",
    rating: 4,
  },
  {
    name: "Rudi Hartono",
    username: "Verified Customer",
    body: "The best catering service in Jakarta! Clean, healthy, and tasty meals delivered right to my office every day.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format",
    rating: 5,
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
  rating,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  rating: number;
}) => {
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
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900 dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-green-600 dark:text-green-400">
            {username}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">{renderStars(rating)}</div>

      <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        &quot;{body}&quot;
      </blockquote>
    </figure>
  );
};

export function MarqueeTestimonial() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900"></div>
    </div>
  );
}
