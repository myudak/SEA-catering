import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background - Next.js Image with Blur */}
      <div className="absolute inset-0">
        <Image
          width={1920}
          height={1080}
          src="/hero-food.jpg"
          alt="Healthy food background"
          className="w-full h-full object-cover blur-xs "
          loading="eager"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-2 right-4 z-20 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
          Image by{" "}
          <a
            href="https://www.freepik.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Freepik
          </a>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 backdrop-blur-xs bg-black/30 rounded-xl ">
        <Badge variant="secondary" className="mb-6 text-sm font-medium">
          Indonesia&apos;s Premier Meal Delivery Service
        </Badge>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#faf8f3] shadow-accent mb-6 tracking-tight ">
          SEA Catering
        </h1>
        <p className="text-2xl md:text-3xl text-white/90 mb-8 font-medium">
          &ldquo;Healthy Meals, Anytime, Anywhere&rdquo;
        </p>
        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed  ">
          Discover the future of healthy eating with our customizable meal plans
          delivered fresh across Indonesia
        </p>
        <Button size="lg" className="text-lg px-8 py-6 ">
          Order Now
        </Button>
      </div>
    </section>
  );
}
