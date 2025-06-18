import {
  HeroSection,
  AboutSection,
  FeaturesSection,
  ContactSection,
  JourneySection,
} from "./_components";

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <FeaturesSection />
      <ContactSection />
    </div>
  );
}
