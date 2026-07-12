import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/layout/public-layout";
import { PublicProfileView } from "@/components/public-profile/public-profile-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  canAccessProfileFeature,
  getProfileCompletion,
} from "@/lib/profile/completion";
import {
  getPublicSpecialistProfileBySlug,
  getSpecialistProfileBySlug,
} from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveServicesForPublicProfile } from "@/lib/services/service";

type PublicProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

    const { data: publicServices } = await getActiveServicesForPublicProfile(
      supabase,
      publicProfile.id,
    );

    return (
      <PublicLayout>
        <PublicProfileView
          profile={publicProfile}
          services={publicServices ?? []}
        />
      </PublicLayout>
    );
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
