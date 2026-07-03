import { SpecialistDashboard } from "@/components/dashboard/specialist-dashboard";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { PublicProfilePreview } from "@/components/public-profile/public-profile-preview";
import { SessionWorkspace } from "@/components/session/session-workspace";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#1e2725]">
      <nav className="border-b border-[#ded5c8] bg-[#fffaf2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a className="text-xl font-semibold tracking-tight" href="#">
            BuyMyTime
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-[#53615f] md:flex">
            <a href="#dashboard">Dashboard</a>
            <a href="#profile">Profile</a>
            <a href="#workspace">Workspace</a>
          </div>
          <div className="flex items-center gap-2">
            <a
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#33413f] sm:inline-flex"
              href="#auth"
            >
              Log in
            </a>
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#174a43]"
            >
              <a href="#booking">Start free</a>
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <SpecialistDashboard />
      <PublicProfilePreview />
      <SessionWorkspace />
    </main>
  );
}
