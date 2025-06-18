import {
  HeroSection,
  AboutSection,
  FeaturesSection,
  ContactSection,
} from "./_components";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ContactSection />
    </div>
  );
}
