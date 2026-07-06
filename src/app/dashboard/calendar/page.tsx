import { redirect } from "next/navigation";

import { WeeklyAvailabilityEditor } from "@/components/calendar/weekly-availability-editor";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileGatedEmptyState } from "@/components/onboarding/profile-gated-empty-state";
import { Badge } from "@/components/ui/badge";
import { createScheduleFromAvailabilityBlocks } from "@/lib/availability/schedule";
import { getAvailabilityBlocksForSpecialistProfile } from "@/lib/availability/service";
import {
  canAccessProfileFeature,
  getProfileCompletion,
} from "@/lib/profile/completion";
import { getOwnSpecialistProfile } from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CalendarPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await getOwnSpecialistProfile(supabase, user.id);
  const completion = getProfileCompletion(profile);

  if (!canAccessProfileFeature(completion, "calendar")) {
    return (
      <DashboardLayout>
        <ProfileGatedEmptyState title="Complete your profile to configure availability." />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <ProfileGatedEmptyState title="Complete your profile to configure availability." />
      </DashboardLayout>
    );
  }

  const { data: availabilityBlocks, error: availabilityError } =
    await getAvailabilityBlocksForSpecialistProfile(supabase, profile.id);
  const initialSchedule = createScheduleFromAvailabilityBlocks(
    availabilityBlocks ?? [],
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Calendar
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Calendar
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            Set your weekly availability for bookings.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-[#ded5c8] bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
          Timezone
        </p>
        <p className="mt-2 text-sm leading-6 text-[#66736f]">
          Your availability is configured in:
        </p>
        <Badge className="mt-3 rounded-full bg-[#e5f0ee] px-3 py-1 text-sm text-[#1f5f55] hover:bg-[#e5f0ee]">
          {profile.timezone}
        </Badge>
        <p className="mt-3 text-xs font-medium text-[#66736f]">
          Timezone is edited on the Profile page.
        </p>
      </div>

      {availabilityError ? (
        <div className="mt-6 rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
          {availabilityError.message}
        </div>
      ) : (
        <WeeklyAvailabilityEditor
          initialIsAcceptingBookings={profile.is_accepting_bookings}
          initialSchedule={initialSchedule}
          specialistProfileId={profile.id}
          timezone={profile.timezone}
        />
      )}
    </DashboardLayout>
  );
}
