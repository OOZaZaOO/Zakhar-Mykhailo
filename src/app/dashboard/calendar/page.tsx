import { redirect } from "next/navigation";

import { WeekAvailabilityEditor } from "@/components/calendar/week-availability-editor";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileGatedEmptyState } from "@/components/onboarding/profile-gated-empty-state";
import { Badge } from "@/components/ui/badge";
import { getAvailableExceptionsForSpecialistWeek } from "@/lib/availability/service";
import {
  createWeekScheduleFromAvailabilityExceptions,
  formatDateKey,
  getWeekStartFromParam,
} from "@/lib/availability/week";
import {
  canAccessProfileFeature,
  getProfileCompletion,
} from "@/lib/profile/completion";
import { getOwnSpecialistProfile } from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CalendarPageProps = {
  searchParams?: Promise<{
    week?: string;
  }>;
};

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const resolvedSearchParams = await searchParams;
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

  const selectedWeekStart = getWeekStartFromParam(resolvedSearchParams?.week);
  const { data: availabilityExceptions, error: availabilityError } =
    await getAvailableExceptionsForSpecialistWeek({
      specialistProfileId: profile.id,
      supabase,
      timezone: profile.timezone,
      weekStart: selectedWeekStart,
    });
  const initialSchedule = createWeekScheduleFromAvailabilityExceptions({
    exceptions: availabilityExceptions ?? [],
    timezone: profile.timezone,
    weekStart: selectedWeekStart,
  });

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
            Set your availability for each week.
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
        <WeekAvailabilityEditor
          initialIsAcceptingBookings={profile.is_accepting_bookings}
          initialSchedule={initialSchedule}
          selectedWeekStart={formatDateKey(selectedWeekStart)}
          specialistProfileId={profile.id}
          timezone={profile.timezone}
        />
      )}
    </DashboardLayout>
  );
}
