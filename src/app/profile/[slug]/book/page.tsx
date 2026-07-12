import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/layout/public-layout";
import { BookingWizard } from "@/components/public-profile/booking-wizard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBookingAvailabilityExceptionsForSpecialistProfile } from "@/lib/availability/service";
import { getPublicSpecialistProfileBySlug } from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveServicesForPublicProfile } from "@/lib/services/service";

type BookingPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    date?: string;
    service?: string;
    time?: string;
  }>;
};

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: publicProfile } = await getPublicSpecialistProfileBySlug(
    supabase,
    slug,
  );

  if (!publicProfile) {
    notFound();
  }

  const { data: publicServices } = await getActiveServicesForPublicProfile(
    supabase,
    publicProfile.id,
  );

  const activeServices = publicServices ?? [];

  if (!publicProfile.is_accepting_bookings || activeServices.length === 0) {
    return (
      <PublicLayout>
        <section className="mx-auto max-w-3xl px-5 pb-12 sm:px-8">
          <Card className="rounded-3xl border-[#ded5c8] bg-white">
            <CardContent className="p-6">
              <Badge className="rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]">
                Booking unavailable
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold text-[#24312f]">
                Booking is not available right now.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#66736f]">
                This specialist is not currently accepting new bookings or has
                no active services available yet.
              </p>
              <Link
                className="mt-6 inline-flex rounded-full bg-[#1f5f55] px-4 py-2 text-sm font-semibold text-white hover:bg-[#174a43]"
                href={`/profile/${publicProfile.slug}`}
              >
                Back to profile
              </Link>
            </CardContent>
          </Card>
        </section>
      </PublicLayout>
    );
  }

  const { data: availabilityExceptions } =
    await getBookingAvailabilityExceptionsForSpecialistProfile({
      specialistProfileId: publicProfile.id,
      supabase,
      timezone: publicProfile.timezone,
    });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
              Booking
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">
              Book a session with {publicProfile.display_name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#5a6865]">
              Choose a service, pick a date with current availability, and
              review the session details before continuing.
            </p>
          </div>

          <Card className="rounded-3xl border-[#ded5c8] bg-white">
            <CardContent className="space-y-3 p-5">
              <div>
                <p className="text-sm font-bold text-[#7f8d5a]">Specialist</p>
                <p className="mt-1 text-xl font-semibold">
                  {publicProfile.display_name}
                </p>
                <p className="mt-1 text-sm text-[#66736f]">
                  {publicProfile.profession}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f7f3ec] p-4 text-sm leading-6 text-[#5a6865]">
                Times are shown in {publicProfile.timezone}. Availability is
                pulled from the specialist&apos;s current booking schedule.
              </div>
            </CardContent>
          </Card>
        </div>

        <BookingWizard
          availabilityExceptions={availabilityExceptions ?? []}
          initialDate={resolvedSearchParams?.date}
          initialServiceId={resolvedSearchParams?.service}
          initialTime={resolvedSearchParams?.time}
          isAuthenticated={Boolean(user)}
          profile={publicProfile}
          services={activeServices}
        />
      </section>
    </PublicLayout>
  );
}
