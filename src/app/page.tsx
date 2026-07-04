import { redirect } from "next/navigation";

import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { PublicLayout } from "@/components/layout/public-layout";
import { SessionWorkspace } from "@/components/session/session-workspace";
import { getLoginPathForAccountType } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(getLoginPathForAccountType(user.user_metadata.account_type));
  }

  return (
    <PublicLayout showBreadcrumbs={false}>
      <HeroSection />
      <FeaturesSection />
      <SessionWorkspace />
      <PricingSection />
    </PublicLayout>
  );
}
