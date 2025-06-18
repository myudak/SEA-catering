import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { FeatureList } from "./FeatureList";

interface FeatureCardProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
  iconColor: "emerald" | "blue" | "purple" | "green";
  order?: "normal" | "reverse";
}

export function FeatureCard({
  icon: Icon,
  badge,
  title,
  description,
  features,
  imageSrc,
  imageAlt,
  iconColor,
  order = "normal",
}: FeatureCardProps) {
  const colorMap = {
    emerald: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      gradientFrom: "from-emerald-50",
      gradientTo: "to-emerald-100",
    },
    blue: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100",
    },
    purple: {
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      gradientFrom: "from-purple-50",
      gradientTo: "to-purple-100",
    },
    green: {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100",
    },
  };

  const colors = colorMap[iconColor];

  return (
    <div
      className={`flex flex-col lg:flex-row gap-16 items-center ${
        order === "reverse" ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Text Content */}
      <div className="flex-1">
        <div className="flex items-center mb-6">
          <div className={`p-3 ${colors.iconBg} rounded-xl mr-4`}>
            <Icon className={`h-8 w-8 ${colors.iconColor}`} />
          </div>
          <Badge variant="secondary" className="text-sm font-medium">
            {badge}
          </Badge>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          {title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {description}
        </p>
        <FeatureList items={features} color={iconColor} />
      </div>

      {/* Image Content */}
      <div className="flex-1">
        <div className="relative">
          <div
            className={`aspect-square bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} rounded-2xl flex items-center justify-center overflow-hidden`}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
