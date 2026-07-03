import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SessionWorkspace } from "@/components/session/session-workspace";
import { PublicLayout } from "@/components/layout/public-layout";

export default function Home() {
  return (
    <PublicLayout showBreadcrumbs={false}>
      <HeroSection />
      <FeaturesSection />
      <SessionWorkspace />
      <PricingSection />
    </PublicLayout>
  );
}
