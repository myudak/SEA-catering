import { TestimonialSection } from "@/components/testimonial-section";
import {
  HeroSection,
  AboutSection,
  FeaturesSection,
  ContactSection,
  JourneySection,
} from "./_components";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <FeaturesSection />
      <TestimonialSection>
        <div className="flex justify-center mt-4">
          <Button asChild>
            <TransitionLink href={"/contact"}>
              {" "}
              <MessageSquare className="h-6 w-6 mr-2 text-green-600 dark:text-green-700" />{" "}
              Share Your Experience
            </TransitionLink>
          </Button>
        </div>
      </TestimonialSection>
      <ContactSection />
    </div>
  );
}
