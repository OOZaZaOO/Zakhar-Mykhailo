import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileGatedEmptyState } from "@/components/onboarding/profile-gated-empty-state";
import { ServicesManager } from "@/components/services/services-manager";
import {
  canAccessProfileFeature,
  getProfileCompletion,
} from "@/lib/profile/completion";
import { getOwnSpecialistProfile } from "@/lib/profile/service";
import { getServicesForSpecialistProfile } from "@/lib/services/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ServicesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await getOwnSpecialistProfile(supabase, user.id);
  const completion = getProfileCompletion({
    profile,
    userMetadata: user.user_metadata,
  });

  if (!canAccessProfileFeature(completion, "services")) {
    return (
      <DashboardLayout>
        <ProfileGatedEmptyState title="Complete your profile first." />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <ProfileGatedEmptyState title="Complete your profile first." />
      </DashboardLayout>
    );
  }

  const { data: services, error } = await getServicesForSpecialistProfile(
    supabase,
    profile.id,
  );

  return (
    <DashboardLayout>
      {error ? (
        <div className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
          {error.message}
        </div>
      ) : (
        <ServicesManager
          initialServices={services ?? []}
          specialistProfileId={profile.id}
        />
      )}
    </DashboardLayout>
  );
}
