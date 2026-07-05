import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/data/mock";
import {
  canAccessProfileFeature,
  getProfileCompletion,
} from "@/lib/profile/completion";
import {
  getPublicSpecialistProfileBySlug,
  getSpecialistProfileBySlug,
} from "@/lib/profile/service";
import type { SpecialistProfile } from "@/lib/profile/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PublicProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfileUnavailableState({
  slug,
}: {
  slug: string;
}) {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]">
              Unavailable
            </Badge>
            <CardTitle className="pt-3 text-3xl">
              This profile is not public right now.
            </CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              The profile for {slug} exists, but it is currently private or
              hidden.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/">Back to homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}

function ProfileOwnerGatedState() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]">
              Locked for now
            </Badge>
            <CardTitle className="pt-3 text-3xl">
              Complete your profile to unlock this feature.
            </CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              Finish the required profile details before using your public
              profile.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/dashboard/profile">Go to Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}

function PublicProfileContent({ profile }: { profile: SpecialistProfile }) {
  const canBook = profile.is_accepting_bookings;

  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardContent className="p-6">
            <div className="flex size-24 items-center justify-center rounded-3xl bg-[#1f5f55] text-3xl font-bold text-white">
              {getInitials(profile.display_name)}
            </div>
            <p className="mt-6 text-sm font-bold text-[#7f8d5a]">
              buymytime.app/{profile.slug}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
                {profile.visibility}
              </Badge>
              <Badge
                className={
                  canBook
                    ? "rounded-full bg-[#e5f3ef] text-[#1f5f55] hover:bg-[#e5f3ef]"
                    : "rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]"
                }
              >
                {canBook ? "Accepting bookings" : "Bookings paused"}
              </Badge>
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              {profile.display_name}
            </h1>
            <p className="mt-2 font-medium text-[#5a6865]">
              {profile.profession} · {profile.timezone}
            </p>
            {profile.bio ? (
              <p className="mt-5 leading-7 text-[#4d5c59]">{profile.bio}</p>
            ) : null}
            {profile.languages.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.languages.map((language) => (
                  <Badge
                    className="rounded-full bg-[#eef1da] px-3 py-1 text-sm font-bold text-[#59672c]"
                    key={language}
                    variant="secondary"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            ) : null}
            {profile.working_rules ? (
              <div className="mt-6 rounded-2xl bg-[#f7f3ec] p-4">
                <p className="text-sm font-bold text-[#24312f]">
                  Working rules
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5a6865]">
                  {profile.working_rules}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                Services
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Choose a session type
              </h2>
            </div>
            {canBook ? (
              <Button
                asChild
                className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
              >
                <Link href={`/profile/${profile.slug}/book`}>Book session</Link>
              </Button>
            ) : (
              <Button className="rounded-full" disabled>
                Booking paused
              </Button>
            )}
          </div>
          {!canBook ? (
            <div className="rounded-2xl bg-[#f6ddd4] p-4 text-sm font-medium leading-6 text-[#9a4c2f]">
              This specialist is not accepting new bookings right now. You can
              still view the public profile and mocked service preview.
            </div>
          ) : null}
          {services.map((service) => (
            <Card
              className="rounded-3xl border-[#ded5c8] bg-white"
              key={service.id}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{service.name}</CardTitle>
                    <p className="mt-2 text-sm leading-6 text-[#60706c]">
                      {service.description}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold text-[#9a4c2f]">
                    {service.price}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#7d8a86]">
                  {service.duration} · {service.format}
                </p>
                {canBook ? (
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={`/profile/${profile.slug}/book`}>
                      Select service
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="rounded-full" disabled>
                    Unavailable
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: publicProfile } = await getPublicSpecialistProfileBySlug(
    supabase,
    slug,
  );

  if (publicProfile) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const completion = getProfileCompletion(publicProfile);

    if (
      user?.id === publicProfile.user_id &&
      !canAccessProfileFeature(completion, "publicProfile")
    ) {
      return <ProfileOwnerGatedState />;
    }

    return <PublicProfileContent profile={publicProfile} />;
  }

  const { data: unavailableProfile } = await getSpecialistProfileBySlug(
    supabase,
    slug,
  );

  if (!unavailableProfile) {
    notFound();
  }

  return <ProfileUnavailableState slug={slug} />;
}
