import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PublicProfileView } from "@/components/public-profile/public-profile-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  canAccessProfileFeature,
  getProfileCompletion,
} from "@/lib/profile/completion";
import {
  getOwnSpecialistProfile,
  getPublicSpecialistProfileBySlug,
} from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveServicesForPublicProfile } from "@/lib/services/service";

function DashboardProfilePreviewLocked() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { href: "/dashboard", label: "Home" },
        { href: "/dashboard/profile", label: "Profile" },
        { label: "Public Profile" },
      ]}
    >
      <section className="mx-auto max-w-3xl pb-12">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]">
              Locked for now
            </Badge>
            <CardTitle className="pt-3 text-3xl">
              Complete your profile to unlock this feature.
            </CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              Finish the required profile details before previewing your public
              profile from the dashboard.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/dashboard/profile">Go to Profile</Link>
            </Button>
            <Button asChild className="rounded-full" variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}

function DashboardProfilePreviewUnavailable({
  slug,
}: {
  slug: string;
}) {
  return (
    <DashboardLayout
      breadcrumbs={[
        { href: "/dashboard", label: "Home" },
        { href: "/dashboard/profile", label: "Profile" },
        { label: "Public Profile" },
      ]}
    >
      <section className="mx-auto max-w-3xl pb-12">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]">
              Unavailable
            </Badge>
            <CardTitle className="pt-3 text-3xl">
              This profile is not public right now.
            </CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              The public preview for {slug} is currently private or hidden.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/dashboard/profile">Go to Profile</Link>
            </Button>
            <Button asChild className="rounded-full" variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}

export default async function DashboardPublicProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await getOwnSpecialistProfile(supabase, user.id);

  if (!profile?.slug) {
    redirect("/dashboard/profile");
  }

  const completion = getProfileCompletion(profile);

  if (!canAccessProfileFeature(completion, "publicProfile")) {
    return <DashboardProfilePreviewLocked />;
  }

  const { data: publicProfile } = await getPublicSpecialistProfileBySlug(
    supabase,
    profile.slug,
  );

  if (!publicProfile) {
    return <DashboardProfilePreviewUnavailable slug={profile.slug} />;
  }

  const { data: publicServices } = await getActiveServicesForPublicProfile(
    supabase,
    publicProfile.id,
  );

  return (
    <DashboardLayout
      breadcrumbs={[
        { href: "/dashboard", label: "Home" },
        { href: "/dashboard/profile", label: "Profile" },
        { label: publicProfile.display_name },
      ]}
    >
      <PublicProfileView
        profile={publicProfile}
        services={publicServices ?? []}
      />
    </DashboardLayout>
  );
}
