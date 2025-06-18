import { Utensils, Truck, BarChart3, Leaf } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      icon: Utensils,
      badge: "Personalized Nutrition",
      title: "Your Meals, Your Way",
      description:
        "Every body is different, and your meals should be too. Our intuitive customization platform lets you build the perfect meal plan based on your dietary needs, taste preferences, and health goals. Whether you're keto, vegan, or have specific allergies, we've got you covered.",
      features: [
        "Dietary restriction friendly",
        "Calorie and macro tracking",
        "Flexible portion sizes",
      ],
      imageSrc: "/custom-meal.jpg",
      imageAlt: "Custom Meal Example",
      iconColor: "emerald" as const,
      order: "reverse" as const,
    },
    {
      icon: Truck,
      badge: "Island-Wide Coverage",
      title: "Freshness Delivered Everywhere",
      description:
        "From Jakarta to Bali, Medan to Makassar – we've built Indonesia's most reliable healthy meal delivery network. Our temperature-controlled logistics ensure your meals arrive as fresh as the moment they left our kitchen.",
      features: [
        "50+ cities across Indonesia",
        "Temperature-controlled delivery",
        "On-time guarantee",
      ],
      imageSrc: "/delivery.avif",
      imageAlt: "Delivery",
      iconColor: "blue" as const,
      order: "normal" as const,
    },
    {
      icon: BarChart3,
      badge: "Data-Driven Health",
      title: "Know What Fuels You",
      description:
        "Every meal comes with detailed nutritional insights. Track your daily intake, monitor your progress, and make informed decisions about your health journey. Our certified nutritionists ensure every dish is optimally balanced.",
      features: [
        "Complete macro breakdowns",
        "Vitamin and mineral tracking",
        "Progress analytics",
      ],
      imageSrc: "/nutrition.jpg",
      imageAlt: "Nutrition Analytics",
      iconColor: "purple" as const,
      order: "reverse" as const,
    },
    {
      icon: Leaf,
      badge: "Farm to Table",
      title: "Premium Ingredients, Every Time",
      description:
        "We partner directly with local farmers and trusted suppliers across Indonesia to source the freshest, highest-quality ingredients. Every vegetable is crisp, every protein is premium, and every grain is carefully selected for maximum nutrition and flavor.",
      features: [
        "Locally sourced produce",
        "Organic when possible",
        "Quality guaranteed",
      ],
      imageSrc: "/ingredient.jpg",
      imageAlt: "Fresh Ingredients",
      iconColor: "green" as const,
      order: "normal" as const,
    },
  ];

  return (
    <section className="py-20 px-12 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Experience the SEA Catering Difference
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover why thousands of Indonesians trust us to fuel their
            healthiest lives
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
