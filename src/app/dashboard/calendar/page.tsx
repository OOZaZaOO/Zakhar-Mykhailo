import { redirect } from "next/navigation";

import { BookingStatusToggle } from "@/components/calendar/booking-status-toggle";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileGatedEmptyState } from "@/components/onboarding/profile-gated-empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calendarDays } from "@/data/mock";
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
        <ProfileGatedEmptyState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Calendar
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Availability for the week
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            Manage working hours, open slots, and blocked dates before real
            calendar logic is connected.
          </p>
        </div>
        <Button className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]">
          Add availability
        </Button>
      </div>

      <div className="mt-8">
        <BookingStatusToggle
          initialIsAcceptingBookings={
            profile?.is_accepting_bookings ?? false
          }
          profileId={profile?.id ?? null}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.35fr]">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Week view</CardTitle>
            <p className="text-sm text-[#66736f]">
              Mock slots available for clients to book.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-5">
            {calendarDays.map((day) => (
              <div
                className="min-h-44 rounded-2xl border border-[#eee5d9] p-4"
                key={day.date}
              >
                <p className="text-sm font-bold text-[#7f8d5a]">{day.day}</p>
                <p className="mt-1 text-2xl font-semibold">{day.date}</p>
                <div className="mt-4 space-y-2">
                  {day.slots.map((slot) => (
                    <div
                      className="rounded-xl bg-[#eef1da] px-3 py-2 text-sm font-bold text-[#5d6b2f]"
                      key={slot}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#5a6865]">
            <Badge className="rounded-full bg-[#e5f0ee] text-[#1f5f55] hover:bg-[#e5f0ee]">
              Europe/Kyiv
            </Badge>
            <p>Working hours: 09:00-18:00</p>
            <p>Buffer: 15 minutes between sessions</p>
            <p>Blocked dates: Jul 15, Jul 18</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
